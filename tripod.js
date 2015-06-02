var Tripod = function(initialAttrs, namespace, persist) {
	var attrs = initialAttrs || {};
	var bindNamespace = namespace;
	var persistent = persist === true && window.localStorage && window.JSON;
	
	var bindAttribute = 'data-bound-to';
	var bindModifierAttribute = 'data-bound-as';

	/*
		utility methods and such
	*/

	function isArray(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	}

	function isNotBlank(value) {
		return value || value === false;
	}

	function getNamespacedAttrName(attr) {
		return bindNamespace ? (bindNamespace + '.' + attr) : attr;
	}

	function getNodes(attr) {
		var namespacedAttrName = getNamespacedAttrName(attr);
		if(document.querySelectorAll) {
			var selector = '[' + bindAttribute + '="' + namespacedAttrName + '"]';
			return document.querySelectorAll(selector);

		} else { // yay polyfills! (IE7 only)
			var nodes = [];
			var allNodes = document.getElementsByTagName('*');
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

	function getNodeBindingModifier(node) {
		return (node.getAttribute(bindModifierAttribute) || 'value').toLowerCase();
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
		var nodeBindingModifier = getNodeBindingModifier(node);

		switch(nodeBindingModifier) {
			case 'show':
				node.style.display = value ? '' : 'none';
				break;
			case 'hide':
				node.style.display = value ? 'none' : '';
				break;
			case 'value':
			default:
				setNodeValue(node, value);
		}
	}

	function setNodeValue(node, value) {
		if(node.nodeName.toLowerCase() === 'select') {
			var options = node.options;
			for (var i = 0, ol = options.length; i < ol; i++) {
				options[i].selected = (options[i].value == value);
			}

		} else if(node.type === 'checkbox') {
			node.checked = value === 'false' ? false : !!value;

		} else if(node.type === 'radio') {
			var radioGroupName = node.getAttribute('name');
			if(radioGroupName) {
				var radioButtons = document.getElementsByName(radioGroupName);
				for(var i = 0, rl = radioButtons.length; i < rl; i++) {
					radioButtons[i].checked = (radioButtons[i].value == value);
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
			if(attr && getNodeBindingModifier(node) === 'value') {
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
	
	function load(attr) {
		if(isArray(attr)) { //if passed array, assume it is an array of attrs
			for(var a = 0, al = attr.length; a < al; a++) {
				load(attr[a]);
			}

		} else if(attr && typeof attr === 'string') { //if we have a non-array argument, assume it is a single string attr
			var value;
			if(persistent) {
				value = getPersistentValue(attr);
			}

			if(isNotBlank(value)) {
				attrs[attr] = value;
				return value;
			}

			var nodes = getNodes(attr);
			for(var n = 0, nl = nodes.length; n < nl; n++) {
				if(getNodeBindingModifier(nodes[n]) !== 'value') {
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

	function loadAll() {
		for(var attr in attrs) {
			load(attr);
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

	return {
		get: get,
		getAll: getAll,
		set: set,
		load: load,
		loadAll: loadAll,
		push: push,
		pushAll: pushAll
	};
};