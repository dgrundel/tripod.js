QUnit.module("Tripod.bindingModifierFunctions");

function assertNodeDisplay(assert, testNode, isHidden) {
	assert.deepEqual(testNode.style.display, isHidden ? 'none' : 'block');
}

// Tripod.bindingModifierFunctions.show: function(node, value) {

QUnit.test("Tripod.bindingModifierFunctions.show with true", function( assert ) {
	var testNode = document.createElement('div');
	Tripod.bindingModifierFunctions.show(testNode, true);
	assertNodeDisplay(assert, testNode, false);
});

QUnit.test("Tripod.bindingModifierFunctions.show with false", function( assert ) {
	var testNode = document.createElement('div');
	Tripod.bindingModifierFunctions.show(testNode, false);
	assertNodeDisplay(assert, testNode, true);
});

// Tripod.bindingModifierFunctions.showIfEqualTo: function(node, value, bindingModifiers) {

QUnit.test("Tripod.bindingModifierFunctions.showIfEqualTo with true condition", function( assert ) {
	var testNode = document.createElement('div');
	Tripod.bindingModifierFunctions.showIfEqualTo(testNode, 'someValue', ['showIfEqualTo', 'someValue']);
	assertNodeDisplay(assert, testNode, false);
});

QUnit.test("Tripod.bindingModifierFunctions.showIfEqualTo with false condition", function( assert ) {
	var testNode = document.createElement('div');
	Tripod.bindingModifierFunctions.showIfEqualTo(testNode, 'someValue', ['showIfEqualTo', 'someOtherValue']);
	assertNodeDisplay(assert, testNode, true);
});

// Tripod.bindingModifierFunctions.hide: function(node, value) {

QUnit.test("Tripod.bindingModifierFunctions.hide with true", function( assert ) {
	var testNode = document.createElement('div');
	Tripod.bindingModifierFunctions.hide(testNode, true);
	assertNodeDisplay(assert, testNode, true);
});

QUnit.test("Tripod.bindingModifierFunctions.hide with false", function( assert ) {
	var testNode = document.createElement('div');
	Tripod.bindingModifierFunctions.hide(testNode, false);
	assertNodeDisplay(assert, testNode, false);
});

// Tripod.bindingModifierFunctions.hideIfEqualTo: function(node, value, bindingModifiers) {

QUnit.test("Tripod.bindingModifierFunctions.hideIfEqualTo with true condition", function( assert ) {
	var testNode = document.createElement('div');
	Tripod.bindingModifierFunctions.hideIfEqualTo(testNode, 'someValue', ['hideIfEqualTo', 'someValue']);
	assertNodeDisplay(assert, testNode, true);
});

QUnit.test("Tripod.bindingModifierFunctions.hideIfEqualTo with false condition", function( assert ) {
	var testNode = document.createElement('div');
	Tripod.bindingModifierFunctions.hideIfEqualTo(testNode, 'someValue', ['hideIfEqualTo', 'someOtherValue']);
	assertNodeDisplay(assert, testNode, false);
});

// Tripod.bindingModifierFunctions.enable: function(node, value) {

function assertEnableBindingModifier(assert, testNode, isDisabled) {
	Tripod.bindingModifierFunctions.enable(testNode, !isDisabled);
	assert.deepEqual(testNode.disabled, isDisabled);
}

QUnit.test("Tripod.bindingModifierFunctions.enable with true", function( assert ) {
	var testNode = document.createElement('input');
	assertEnableBindingModifier(assert, testNode, false);
});

QUnit.test("Tripod.bindingModifierFunctions.enable with true with disabled node", function( assert ) {
	var testNode = document.createElement('input');
	testNode.disabled = true;
	assertEnableBindingModifier(assert, testNode, false);
});

QUnit.test("Tripod.bindingModifierFunctions.enable with false", function( assert ) {
	var testNode = document.createElement('input');
	assertEnableBindingModifier(assert, testNode, true);
});

QUnit.test("Tripod.bindingModifierFunctions.enable with false with disabled node", function( assert ) {
	var testNode = document.createElement('input');
	testNode.disabled = true;
	assertEnableBindingModifier(assert, testNode, true);
});

// Tripod.bindingModifierFunctions.disable: function(node, value) {

function assertDisableBindingModifier(assert, testNode, isDisabled) {
	Tripod.bindingModifierFunctions.disable(testNode, isDisabled);
	assert.deepEqual(testNode.disabled, isDisabled);
}

QUnit.test("Tripod.bindingModifierFunctions.disable with true", function( assert ) {
	var testNode = document.createElement('input');
	assertDisableBindingModifier(assert, testNode, true);
});

QUnit.test("Tripod.bindingModifierFunctions.disable with true with disabled node", function( assert ) {
	var testNode = document.createElement('input');
	testNode.disabled = true;
	assertDisableBindingModifier(assert, testNode, true);
});

QUnit.test("Tripod.bindingModifierFunctions.disable with false", function( assert ) {
	var testNode = document.createElement('input');
	assertDisableBindingModifier(assert, testNode, false);
});

QUnit.test("Tripod.bindingModifierFunctions.disable with false with disabled node", function( assert ) {
	var testNode = document.createElement('input');
	testNode.disabled = true;
	assertDisableBindingModifier(assert, testNode, false);
});

// Tripod.bindingModifierFunctions.toggleClass: function(node, value, bindingModifiers) {

QUnit.test("Tripod.bindingModifierFunctions.toggleClass: toggle on", function( assert ) {
	var testNode = document.createElement('p');
	Tripod.bindingModifierFunctions.toggleClass(testNode, true, ['toggleClass', 'someClass']);
	assert.deepEqual(testNode.className, 'someClass');
});

QUnit.test("Tripod.bindingModifierFunctions.toggleClass: toggle off", function( assert ) {
	var testNode = document.createElement('p');
	testNode.className = 'someClass';
	Tripod.bindingModifierFunctions.toggleClass(testNode, false, ['toggleClass', 'someClass']);
	assert.deepEqual(testNode.className, '');
});

QUnit.test("Tripod.bindingModifierFunctions.toggleClass: toggle on when exists", function( assert ) {
	var testNode = document.createElement('p');
	testNode.className = 'someClass';
	Tripod.bindingModifierFunctions.toggleClass(testNode, true, ['toggleClass', 'someClass']);
	assert.deepEqual(testNode.className, 'someClass');
});

QUnit.test("Tripod.bindingModifierFunctions.toggleClass: toggle off when missing", function( assert ) {
	var testNode = document.createElement('p');
	Tripod.bindingModifierFunctions.toggleClass(testNode, false, ['toggleClass', 'someClass']);
	assert.deepEqual(testNode.className, '');
});

// Tripod.bindingModifierFunctions.currency: function(node, value, bindingModifiers) {

QUnit.test("Tripod.bindingModifierFunctions.currency with Number", function( assert ) {
	var testValue = 12345;
	assert.deepEqual(Tripod.bindingModifierFunctions.currency(null, testValue, ['formatAsCurrency']), '$12,345.00');
});

QUnit.test("Tripod.bindingModifierFunctions.currency with String", function( assert ) {
	var testValue = '12345';
	assert.deepEqual(Tripod.bindingModifierFunctions.currency(null, testValue, ['formatAsCurrency']), '$12,345.00');
});

QUnit.test("Tripod.bindingModifierFunctions.currency Rounding", function( assert ) {
	var testValue = 12345.111;
	assert.deepEqual(Tripod.bindingModifierFunctions.currency(null, testValue, ['formatAsCurrency']), '$12,345.11');
});

QUnit.test("Tripod.bindingModifierFunctions.currency with Alternate Currency Symbol", function( assert ) {
	var testValue = '12345';
	var testSymbol = 'Tripod';
	assert.deepEqual(Tripod.bindingModifierFunctions.currency(null, testValue, ['formatAsCurrency', testSymbol]), 'Tripod12,345.00');
});

QUnit.test("Tripod.bindingModifierFunctions.currency with Null", function( assert ) {
	var testValue = null;
	assert.deepEqual(Tripod.bindingModifierFunctions.currency(null, testValue, ['formatAsCurrency']), '$0.00');
});

QUnit.test("Tripod.bindingModifierFunctions.currency with Undefined", function( assert ) {
	var testValue;
	assert.deepEqual(Tripod.bindingModifierFunctions.currency(null, testValue, ['formatAsCurrency']), '$0.00');
});

// Tripod.bindingModifierFunctions.template: function(node, value, bindingModifiers) {

QUnit.test("Tripod.bindingModifierFunctions.template", function( assert ) {
	var testNode = document.getElementById('bindingModifiersTemplate');
	var testData = { 
		greeting: 'Hello',
		who: 'test' 
	};

	Tripod.bindingModifierFunctions.template(testNode, testData, ['template']);
	
	assert.deepEqual(testNode.innerHTML, 'Hello, test!');
	assert.deepEqual(testNode.getAttribute('data-original-template'), '{greeting}, {who}!');
});

QUnit.test("Tripod.bindingModifierFunctions.template with Array of Data", function( assert ) {
	var testNode = document.getElementById('bindingModifiersTemplateWithArray');
	var testData = [{
		greeting: 'Hello',
		who: 'test' 
	},{
		greeting: 'Goodbye',
		who: 'Mark'
	},{
		greeting: 'Aloha',
		who: 'Holly' 
	}];

	Tripod.bindingModifierFunctions.template(testNode, testData, ['template']);
	
	assert.deepEqual(testNode.innerHTML, '<p>Hello, test!</p><p>Goodbye, Mark!</p><p>Aloha, Holly!</p>');
	assert.deepEqual(testNode.getAttribute('data-original-template'), '<p>{greeting}, {who}!</p>');
});

QUnit.test("Tripod.bindingModifierFunctions.template with External Template", function( assert ) {
	var testNode = document.createElement('div');
	var testData = { 
		greeting: 'Hello',
		who: 'test' 
	};

	Tripod.bindingModifierFunctions.template(testNode, testData, ['template', 'bindingModifiersTemplateExternalTemplate']);
	
	assert.deepEqual(testNode.innerHTML, 'Hello, test!');
});

// Tripod.bindingModifierFunctions.value: function(node, value) {

QUnit.test("Tripod.bindingModifierFunctions.value with Null", function( assert ) {
	var testValue = null;
	assert.deepEqual(Tripod.bindingModifierFunctions.value(null, testValue, []), null);
});

QUnit.test("Tripod.bindingModifierFunctions.value with Number", function( assert ) {
	var testValue = 42;
	assert.deepEqual(Tripod.bindingModifierFunctions.value(null, testValue, []), 42);
});

QUnit.test("Tripod.bindingModifierFunctions.value with String", function( assert ) {
	var testValue = 'someValue';
	assert.deepEqual(Tripod.bindingModifierFunctions.value(null, testValue, []), 'someValue');
});

QUnit.test("Tripod.bindingModifierFunctions.value with Array", function( assert ) {
	var testValue = ['a', 'b', 'c'];
	assert.deepEqual(Tripod.bindingModifierFunctions.value(null, testValue, []), ['a', 'b', 'c']);
});

QUnit.test("Tripod.bindingModifierFunctions.value with Object", function( assert ) {
	var testValue = { a: '1', b: '2', c: '3' };
	assert.deepEqual(Tripod.bindingModifierFunctions.value(null, testValue, []), { a: '1', b: '2', c: '3' });
});