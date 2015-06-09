var Tripod = function(initialAttrs, namespace, persist) {
	'use strict';

	var attrs = initialAttrs || {};
	var bindNamespace = namespace;
	var persistent = persist === true && window.localStorage && window.JSON;
	
	var savedState = null;

	var bindAttribute = 'data-bound-to';
	var bindModifierAttribute = 'data-bound-as';

	var nodeBindingModifierFunctions = {
		'show': function(node, value) {
			node.style.display = value ? 'block' : 'none';
		},
		'showIfEqualTo': function(node, value, nodeBindingModifiers) {
			if(nodeBindingModifiers.length === 2) {
				node.style.display = (value + '') === nodeBindingModifiers[1] ? 'block' : 'none';
			}
		},
		'hide': function(node, value) {
			node.style.display = value ? 'none' : 'block';
		},
		'hideIfEqualTo': function(node, value, nodeBindingModifiers) {
			if(nodeBindingModifiers.length === 2) {
				node.style.display = (value + '') === nodeBindingModifiers[1] ? 'none' : 'block';
			}
		},
		'enable': function(node, value) {
			node.disabled = !value;
		},
		'disable': function(node, value) {
			node.disabled = !!value;
		},
		'toggleClass': function(node, value, nodeBindingModifiers) {
			if(nodeBindingModifiers.length === 2) {
				toggleClass(node, nodeBindingModifiers[1], value);
			}
		},
		'currency': function(node, value, nodeBindingModifiers) {
			var currencySymbol = nodeBindingModifiers.length === 2 ? nodeBindingModifiers[1] : '$';
			var valueAsNumber = Number(value.replace(/[^0-9.]/g, '')).toFixed(2);
			var valueAsCurrency = currencySymbol + valueAsNumber.replace(/\d(?=(\d{3})+\.)/g, '$&,');
			return valueAsCurrency;
		},
		'value': function(node, value) {
			return value;
		}
	};

	/*
		utility methods and such
	*/

	function isArray(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	}

	function isNotBlank(value) {
		return value || value === false;
	}

	//http://blog.stevenlevithan.com/archives/faster-trim-javascript
	function trim(str) {
		var ws = /\s/;
		var i = str.length;
		str = str.replace(/^\s\s*/, '');
		while (ws.test(str.charAt(--i)));
		return str.slice(0, i + 1);
	}

	function cloneObject(obj) {
		var newObject = {};
		for(var attr in obj) {
			if(attr && obj.hasOwnProperty(attr)) {
				newObject[attr] = obj[attr];
			}
		}
		return newObject;
	}

	function toggleClass(node, className, value) {
		var appliedClasses = node.className.match(/\S+/g) || [];
		var hasClass = appliedClasses.indexOf(className) >= 0;

		if(value && !hasClass) {
			appliedClasses.push(className);
		} else if(hasClass) {
			appliedClasses.splice(index, 1);
		}

		node.className = appliedClasses.join(' ');
	}

	function getNamespacedAttrName(attr) {
		return bindNamespace ? (bindNamespace + '.' + attr) : attr;
	}

	function getNodes(attr, parentNode) {
		parentNode = parentNode || document.body;
		var namespacedAttrName = getNamespacedAttrName(attr);
		if(document.querySelectorAll) {
			var selector = '[' + bindAttribute + '="' + namespacedAttrName + '"]';
			return parentNode.querySelectorAll(selector);

		} else { // yay polyfills! (IE7 only)
			var nodes = [];
			var allNodes = parentNode.getElementsByTagName('*');
			for(var i = 0, al = allNodes.length; i < al; i++) {
				if (allNodes[i].getAttribute(bindAttribute) === namespacedAttrName) {
					nodes.push(allNodes[i]);
				}
			}
			return nodes;
		}
	}

	function findAttrForBindingString(boundTo) {
		if(boundTo) {
			for(var attr in attrs) {
				if(boundTo === getNamespacedAttrName(attr)) {
					return attr;
				}
			}
		}
		return false;
	}

	function getNodeBinding(node) {
		var boundTo = node.getAttribute(bindAttribute);
		return boundTo ? findAttrForBindingString(boundTo) : false;
	}

	function getNodeBindingModifiers(node) {
		var nodeBindingModifiers = (node.getAttribute(bindModifierAttribute) || 'value').split('|');
		for(var ii = 0, mc = nodeBindingModifiers.length; ii < mc; ii++) {
			nodeBindingModifiers[ii] = trim(nodeBindingModifiers[ii]);
		}
		return nodeBindingModifiers;
	}
	
	function getNodeValue(node) {
		if(node.nodeName.toLowerCase() === 'select') {
			return node.options[node.selectedIndex].value;
		}
		if(node.type === 'checkbox') {
			return node.checked;
		}
		if(node.type === 'radio') {
			var radioGroupName = node.getAttribute('name');
			if(radioGroupName) {
				var radioButtons = document.getElementsByName(radioGroupName);
				for(var i = 0, rl = radioButtons.length; i < rl; i++) {
					if(radioButtons[i].checked) {
						return radioButtons[i].value;
					}
				}
			}
			return node.checked;
		}
		if('value' in node) {
			return node.value;
		}
		return ('textContent' in node) ? node.textContent : node.innerText;
	}

	function updateNode(node, value) {
		var nodeBindingModifiers = getNodeBindingModifiers(node);
		var modifierFunction = nodeBindingModifierFunctions[ nodeBindingModifiers[0] ];
		var modifierResult = value;
		
		if(typeof modifierFunction === 'function') {
			modifierResult = modifierFunction(node, value, nodeBindingModifiers);
		}

		if(typeof modifierResult !== 'undefined') {
			setNodeValue(node, modifierResult);
		}
	}

	function setNodeValue(node, value) {
		if(node.nodeName.toLowerCase() === 'select') {
			var options = node.options;
			for (var ii = 0, ol = options.length; ii < ol; ii++) {
				options[ii].selected = (options[ii].value == value);
			}

		} else if(node.type === 'checkbox') {
			node.checked = value === 'false' ? false : !!value;

		} else if(node.type === 'radio') {
			var radioGroupName = node.getAttribute('name');
			if(radioGroupName) {
				var radioButtons = document.getElementsByName(radioGroupName);
				for(var iii = 0, rl = radioButtons.length; iii < rl; iii++) {
					radioButtons[iii].checked = (radioButtons[iii].value == value);
				}
			} else {
				node.checked = !!value;
			}

		} else if('value' in node) {
			node.value = value;

		} else if('textContent' in node) {
			node.textContent = value;

		} else {
			node.innerText = value;
		}
	}

	function getPersistentValue(attr) {
		var persistentValue = localStorage.getItem(getNamespacedAttrName(attr));
		return persistentValue ? JSON.parse(persistentValue) : null;
	}

	function setPersistentValue(attr, value) {
		localStorage.setItem(getNamespacedAttrName(attr), JSON.stringify(value));
	}

	/*
		event listeners
	*/
	
	var inputEventHandler = function(event) {
		var node = event.target || event.srcElement;
		if('value' in node) {
			var attr = getNodeBinding(node);
			if(attr && getNodeBindingModifiers(node)[0] === 'value') {
				var val = getNodeValue(node);
				set(attr, val);
			}
		}
		return true;
	};

	var storageEventHandler = function(event) {
		var attr = findAttrForBindingString(event.key);
		if(attr) {
			set(attr, JSON.parse(event.newValue), false);
		}
	};

	var readyTimerId;
	var initEventHandlers = function() {
		if ( document.readyState !== 'complete' ) {
			return;
		}
		
		clearInterval(readyTimerId);

		if (document.body.addEventListener) { //Real browsers and IE9+
			document.body.addEventListener('input', inputEventHandler);
			document.body.addEventListener('change', inputEventHandler);
			if(persistent) {
				window.addEventListener('storage', storageEventHandler);
			}
		} else if (document.body.attachEvent)  { //IE8 and below
			document.body.attachEvent('onkeyup', inputEventHandler);
			document.body.attachEvent('onclick', inputEventHandler);
		}
	};
	readyTimerId = setInterval(initEventHandlers, 100);
	
	/*
		public methods
	*/

	function get(attr) {
		if(attr && typeof attr === 'string' && attrs.hasOwnProperty(attr)) {
			return attrs[attr];
		} else {
			throw 'attribute "' + attr + '" does not exist.';
		}
	}

	function getAll() {
		return attrs;
	}

	function set(attr, value, persist) {
		if(attr && typeof attr === 'string') {
			attrs[attr] = value;

			if(persistent && persist !== false) {
				setPersistentValue(attr, value);
			}

			push(attr);
			
		} else {
			throw 'attribute must be a non-empty string.';
		}
	}
	
	function load(attr, parentNode) {
		if(isArray(attr)) { //if passed array, assume it is an array of attrs
			for(var a = 0, al = attr.length; a < al; a++) {
				load(attr[a]);
			}

		} else if(attr && typeof attr === 'string') { //if we have a non-array argument, assume it is a single string attr
			var value;

			if(persistent && !parentNode) {
				value = getPersistentValue(attr);

				if(isNotBlank(value)) {
					attrs[attr] = value;
					return value;
				}
			}

			var nodes = getNodes(attr, parentNode);
			for(var n = 0, nl = nodes.length; n < nl; n++) {
				if(getNodeBindingModifiers(nodes[n])[0] !== 'value') {
					continue;
				}

				value = getNodeValue(nodes[n]);

				if(isNotBlank(value)) {
					break;
				}
			}

			if(isNotBlank(value)) {
				attrs[attr] = value;
				return value;
			}
		
		} else {
			throw 'attribute(s) must be an array or non-empty string.';
		}
	}

	function loadAll(parentNode) {
		for(var attr in attrs) {
			load(attr, parentNode);
		}
	}
	
	function push(attr) {
		if(isArray(attr)) { //if passed array, assume it is an array of attrs
			for(var a = 0, al = attr.length; a < al; a++) {
				push(attr[a]);
			}

		} else if(attr && typeof attr === 'string') {
			var nodes = getNodes(attr);
			for(var n = 0, nl = nodes.length; n < nl; n++) {
				updateNode(nodes[n], attrs[attr]);
			}
			
		} else {
			throw 'attribute(s) must be an array or non-empty string.';
		}
	}

	function pushAll() {
		for(var attr in attrs) {
			if(attr && attrs.hasOwnProperty(attr)) {
				push(attr);
			}
		}
	}

	function sync(attr, parentNode) {
		load(attr, parentNode);
		push(attr);
	}

	function syncAll(parentNode) {
		loadAll(parentNode);
		pushAll();
	}

	function saveState() {
		savedState = cloneObject(attrs);
		return savedState;
	}

	function revert() {
		if(savedState) {
			for(var attr in savedState) {
				if(attr && savedState.hasOwnProperty(attr) && savedState[attr] !== attrs[attr]) {
					set(attr, savedState[attr]);
				}
			}
		}
		return getAll();
	}

	return {
		get: get,
		getAll: getAll,
		set: set,
		load: load,
		loadAll: loadAll,
		push: push,
		pushAll: pushAll,
		sync: sync,
		syncAll: syncAll,
		saveState: saveState,
		revert: revert
	};
};