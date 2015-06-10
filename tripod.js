var Tripod = function(initialAttrs, namespace, persist) {
	'use strict';

	var attrs = initialAttrs || {};
	var bindNamespace = namespace;
	var persistent = persist === true && window.localStorage && window.JSON;
	var savedState = null;

	var bindAttribute = 'data-bound-to';
	var bindModifierAttribute = 'data-bound-as';

	/*
		instance-specific utility methods
	*/

	function getNamespacedAttrName(attr) {
		return bindNamespace ? (bindNamespace + '.' + attr) : attr;
	}

	function getNodesForAttr(attr, parentNode) {
		var namespacedAttrName = getNamespacedAttrName(attr);
		return Tripod.util.getNodesByAttributeValue(bindAttribute, namespacedAttrName, parentNode);
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
		var bindingModifierString = node.getAttribute(bindModifierAttribute) || 'value';
		return Tripod.util.arrayMap( bindingModifierString.split('|'), Tripod.util.trim );
	}
	
	function updateNode(node, value) {
		var bindingModifiers = getNodeBindingModifiers(node);
		var modifierFunction = Tripod.bindingModifierFunctions[ bindingModifiers[0] ];
		var modifierResult = value;
		
		if(typeof modifierFunction === 'function') {
			modifierResult = modifierFunction(node, value, bindingModifiers);
		}

		if(typeof modifierResult !== 'undefined') {
			Tripod.util.setNodeValue(node, modifierResult);
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
				var val = Tripod.util.getNodeValue(node);
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
		if(Tripod.util.isArray(attr)) { //if passed array, assume it is an array of attrs
			for(var a = 0, al = attr.length; a < al; a++) {
				load(attr[a]);
			}

		} else if(attr && typeof attr === 'string') { //if we have a non-array argument, assume it is a single string attr
			var value;

			if(persistent && !parentNode) {
				value = getPersistentValue(attr);
				if(Tripod.util.isNotBlank(value)) {
					attrs[attr] = value;
					return value;
				}
			}

			var nodes = getNodesForAttr(attr, parentNode);
			for(var n = 0, nl = nodes.length; n < nl; n++) {
				if(getNodeBindingModifiers(nodes[n])[0] !== 'value') {
					continue;
				}

				value = Tripod.util.getNodeValue(nodes[n]);
				if(Tripod.util.isNotBlank(value)) {
					break;
				}
			}

			value = value || '';
			attrs[attr] = value;
			return value;
		
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
		if(Tripod.util.isArray(attr)) { //if passed array, assume it is an array of attrs
			for(var a = 0, al = attr.length; a < al; a++) {
				push(attr[a]);
			}

		} else if(attr && typeof attr === 'string') {
			var nodes = getNodesForAttr(attr);
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
		savedState = Tripod.util.cloneObject(attrs);
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

/*
	utility methods and such
*/

Tripod.util = {};

Tripod.util.isArray = function(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
};

Tripod.util.isNotBlank = function(value) {
	return value || value === false;
};

Tripod.util.arrayMap = function(arr, callback) {
	var len = arr.length;
	while(len--) {
		arr[len] = callback(arr[len]);
	}
	return arr;
}

Tripod.util.trim = function(str) {
	var ws = /\s/;
	var i = str.length;
	str = str.replace(/^\s\s*/, '');
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i + 1);
}

Tripod.util.cloneObject = function(obj) {
	var newObject = {};
	for(var attr in obj) {
		if(attr && obj.hasOwnProperty(attr)) {
			newObject[attr] = obj[attr];
		}
	}
	return newObject;
};

Tripod.util.toggleClass = function(node, className, value) {
	var appliedClasses = node.className.match(/\S+/g) || [];
	var hasClass = appliedClasses.indexOf(className) >= 0;

	if(value && !hasClass) {
		appliedClasses.push(className);
	} else if(hasClass) {
		appliedClasses.splice(index, 1);
	}

	node.className = appliedClasses.join(' ');
};

Tripod.util.formatAsCurrency = function(value, currencySymbol) {
	currencySymbol = currencySymbol || '$';
	var valueAsNumber = Number(value.replace(/[^0-9.]/g, '')).toFixed(2);
	return currencySymbol + valueAsNumber.replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

Tripod.util.getNodeValue = function(node) {
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
};

Tripod.util.setNodeValue = function(node, value) {
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
};

Tripod.util.getNodesByAttributeValue = function(attributeName, attributeValue, parentNode) {
	parentNode = parentNode || document.body;

	if(document.querySelectorAll) {
		var selector = '[' + attributeName + '="' + attributeValue + '"]';
		return parentNode.querySelectorAll(selector);

	} else { // yay polyfills! (IE7 only)
		var nodes = [];
		var allNodes = parentNode.getElementsByTagName('*');
		for(var i = 0, al = allNodes.length; i < al; i++) {
			if (allNodes[i].getAttribute(attributeName) === attributeValue) {
				nodes.push(allNodes[i]);
			}
		}
		return nodes;
	}
};

Tripod.util.processTemplate = function(templateString, data){
	if(typeof data === 'object') {
		for(var prop in data) {
			if(data.hasOwnProperty(prop)) {
				templateString = templateString.replace(new RegExp('{' +  prop + '}','g'), data[prop]);
			}
		}
	}
	return templateString;
};

/*
	node binding modifier functions
*/

Tripod.bindingModifierFunctions = {};

Tripod.bindingModifierFunctions.show = function(node, value) {
	node.style.display = value ? 'block' : 'none';
};

Tripod.bindingModifierFunctions.showIfEqualTo = function(node, value, bindingModifiers) {
	if(bindingModifiers.length === 2) {
		node.style.display = (value + '') === bindingModifiers[1] ? 'block' : 'none';
	} else {
		throw 'showIfEqualTo requires a parameter.'
	}
};

Tripod.bindingModifierFunctions.hide = function(node, value) {
	node.style.display = value ? 'none' : 'block';
};

Tripod.bindingModifierFunctions.hideIfEqualTo = function(node, value, bindingModifiers) {
	if(bindingModifiers.length === 2) {
		node.style.display = (value + '') === bindingModifiers[1] ? 'none' : 'block';
	} else {
		throw 'hideIfEqualTo requires a parameter.'
	}
};

Tripod.bindingModifierFunctions.enable = function(node, value) {
	node.disabled = !value;
};

Tripod.bindingModifierFunctions.disable = function(node, value) {
	node.disabled = !!value;
};

Tripod.bindingModifierFunctions.toggleClass = function(node, value, bindingModifiers) {
	if(bindingModifiers.length === 2) {
		Tripod.util.toggleClass(node, bindingModifiers[1], value);
		
	} else {
		throw 'toggleClass requires a parameter.'
	}
};

Tripod.bindingModifierFunctions.currency = function(node, value, bindingModifiers) {
	var currencySymbol = bindingModifiers.length === 2 ? bindingModifiers[1] : '$';
	return Tripod.util.formatAsCurrency(value, currencySymbol);
};

Tripod.bindingModifierFunctions.template = function(node, value, bindingModifiers) {
	var templateAttributeName = 'data-original-template';
	var generatedHtml = '';
	var templateHtml = node.getAttribute(templateAttributeName) || node.innerHTML;

	if(templateHtml) {
		if(!Tripod.util.isArray(value)) {
			value = [value];
		}
		for(var ii = 0, vl = value.length; ii < vl; ii++) {
			generatedHtml += Tripod.util.processTemplate(templateHtml, value[ii]);
		}
		node.innerHTML = generatedHtml;
		node.setAttribute(templateAttributeName, templateHtml)
	}
};

Tripod.bindingModifierFunctions.value = function(node, value) {
	return value;
};
