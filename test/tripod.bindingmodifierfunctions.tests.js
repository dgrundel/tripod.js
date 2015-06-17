// Tripod.bindingModifierFunctions.show: function(node, value) {

QUnit.test("Tripod.bindingModifierFunctions.show with true", function( assert ) {
	var testNode = document.createElement('div');
	Tripod.bindingModifierFunctions.show(testNode, true);
	assert.deepEqual(testNode.style.display, 'block');
});

QUnit.test("Tripod.bindingModifierFunctions.show with false", function( assert ) {
	var testNode = document.createElement('div');
	Tripod.bindingModifierFunctions.show(testNode, false);
	assert.deepEqual(testNode.style.display, 'none');
});

// Tripod.bindingModifierFunctions.showIfEqualTo: function(node, value, bindingModifiers) {

QUnit.test("Tripod.bindingModifierFunctions.showIfEqualTo with true condition", function( assert ) {
	var testNode = document.createElement('div');
	Tripod.bindingModifierFunctions.showIfEqualTo(testNode, 'someValue', ['showIfEqualTo', 'someValue']);
	assert.deepEqual(testNode.style.display, 'block');
});

QUnit.test("Tripod.bindingModifierFunctions.showIfEqualTo with false condition", function( assert ) {
	var testNode = document.createElement('div');
	Tripod.bindingModifierFunctions.showIfEqualTo(testNode, 'someValue', ['showIfEqualTo', 'someOtherValue']);
	assert.deepEqual(testNode.style.display, 'none');
});

// Tripod.bindingModifierFunctions.hide: function(node, value) {

QUnit.test("Tripod.bindingModifierFunctions.hide with true", function( assert ) {
	var testNode = document.createElement('div');
	Tripod.bindingModifierFunctions.hide(testNode, true);
	assert.deepEqual(testNode.style.display, 'none');
});

QUnit.test("Tripod.bindingModifierFunctions.hide with false", function( assert ) {
	var testNode = document.createElement('div');
	Tripod.bindingModifierFunctions.hide(testNode, false);
	assert.deepEqual(testNode.style.display, 'block');
});

// Tripod.bindingModifierFunctions.hideIfEqualTo: function(node, value, bindingModifiers) {

QUnit.test("Tripod.bindingModifierFunctions.hideIfEqualTo with true condition", function( assert ) {
	var testNode = document.createElement('div');
	Tripod.bindingModifierFunctions.hideIfEqualTo(testNode, 'someValue', ['hideIfEqualTo', 'someValue']);
	assert.deepEqual(testNode.style.display, 'none');
});

QUnit.test("Tripod.bindingModifierFunctions.hideIfEqualTo with false condition", function( assert ) {
	var testNode = document.createElement('div');
	Tripod.bindingModifierFunctions.hideIfEqualTo(testNode, 'someValue', ['hideIfEqualTo', 'someOtherValue']);
	assert.deepEqual(testNode.style.display, 'block');
});

// Tripod.bindingModifierFunctions.enable: function(node, value) {

QUnit.test("Tripod.bindingModifierFunctions.enable with true", function( assert ) {
	var testNode = document.createElement('input');
	Tripod.bindingModifierFunctions.enable(testNode, true);
	assert.deepEqual(testNode.disabled, false);
});

QUnit.test("Tripod.bindingModifierFunctions.enable with true with disabled node", function( assert ) {
	var testNode = document.createElement('input');
	testNode.disabled = true;
	Tripod.bindingModifierFunctions.enable(testNode, true);
	assert.deepEqual(testNode.disabled, false);
});

QUnit.test("Tripod.bindingModifierFunctions.enable with false", function( assert ) {
	var testNode = document.createElement('input');
	Tripod.bindingModifierFunctions.enable(testNode, false);
	assert.deepEqual(testNode.disabled, true);
});

QUnit.test("Tripod.bindingModifierFunctions.enable with false with disabled node", function( assert ) {
	var testNode = document.createElement('input');
	testNode.disabled = true;
	Tripod.bindingModifierFunctions.enable(testNode, false);
	assert.deepEqual(testNode.disabled, true);
});

// Tripod.bindingModifierFunctions.disable: function(node, value) {

QUnit.test("Tripod.bindingModifierFunctions.disable with true", function( assert ) {
	var testNode = document.createElement('input');
	Tripod.bindingModifierFunctions.disable(testNode, true);
	assert.deepEqual(testNode.disabled, true);
});

QUnit.test("Tripod.bindingModifierFunctions.disable with true with disabled node", function( assert ) {
	var testNode = document.createElement('input');
	testNode.disabled = true;
	Tripod.bindingModifierFunctions.disable(testNode, true);
	assert.deepEqual(testNode.disabled, true);
});

QUnit.test("Tripod.bindingModifierFunctions.disable with false", function( assert ) {
	var testNode = document.createElement('input');
	Tripod.bindingModifierFunctions.disable(testNode, false);
	assert.deepEqual(testNode.disabled, false);
});

QUnit.test("Tripod.bindingModifierFunctions.disable with false with disabled node", function( assert ) {
	var testNode = document.createElement('input');
	testNode.disabled = true;
	Tripod.bindingModifierFunctions.disable(testNode, false);
	assert.deepEqual(testNode.disabled, false);
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
// No tests yet.

// Tripod.bindingModifierFunctions.value: function(node, value) {
// No tests yet.