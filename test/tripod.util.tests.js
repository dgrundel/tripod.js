// Tripod.util.isArray: function(obj)

QUnit.test("Tripod.util.isArray with Array", function( assert ) {
	var testValue = [1, 2, 3];
	assert.deepEqual(Tripod.util.isArray(testValue), true);
});

QUnit.test("Tripod.util.isArray with Empty Array", function( assert ) {
	var testValue = [];
	assert.deepEqual(Tripod.util.isArray(testValue), true);
});

QUnit.test("Tripod.util.isArray with Object", function( assert ) {
	var testValue = { foo: 'bar' };
	assert.deepEqual(Tripod.util.isArray(testValue), false);
});

QUnit.test("Tripod.util.isArray with Null", function( assert ) {
	var testValue = null;
	assert.deepEqual(Tripod.util.isArray(testValue), false);
});

QUnit.test("Tripod.util.isArray with String", function( assert ) {
	var testValue = "some string";
	assert.deepEqual(Tripod.util.isArray(testValue), false);
});

// Tripod.util.isNotBlank: function(value)

QUnit.test("Tripod.util.isNotBlank with Empty String", function( assert ) {
	var testValue = "";
	assert.deepEqual(Tripod.util.isNotBlank(testValue), false);
});

QUnit.test("Tripod.util.isNotBlank with Some String", function( assert ) {
	var testValue = "some string";
	assert.deepEqual(Tripod.util.isNotBlank(testValue), true);
});

QUnit.test("Tripod.util.isNotBlank with Null", function( assert ) {
	var testValue = null;
	assert.deepEqual(Tripod.util.isNotBlank(testValue), false);
});

QUnit.test("Tripod.util.isNotBlank with Boolean False", function( assert ) {
	var testValue = false;
	assert.deepEqual(Tripod.util.isNotBlank(testValue), true);
});

QUnit.test("Tripod.util.isNotBlank with String Zero", function( assert ) {
	var testValue = '0';
	assert.deepEqual(Tripod.util.isNotBlank(testValue), true);
});

QUnit.test("Tripod.util.isNotBlank with Int Zero", function( assert ) {
	var testValue = 0;
	assert.deepEqual(Tripod.util.isNotBlank(testValue), true);
});

// Tripod.util.arrayMap: function(arr, callback)

QUnit.test("Tripod.util.arrayMap", function( assert ) {
	var testValue = ['a', 'b', 'c'];
	var testFunction = function(item) {
		return item.toUpperCase();
	}
	assert.deepEqual(Tripod.util.arrayMap(testValue, testFunction), ['A', 'B', 'C']);
});

// Tripod.util.trim: function(str)

QUnit.test("Tripod.util.trim with Spaces", function( assert ) {
	var testValue = '  some value  ';
	assert.deepEqual(Tripod.util.trim(testValue), 'some value');
});

QUnit.test("Tripod.util.trim with Tabs", function( assert ) {
	var testValue = '\t\tsome value\t\t';
	assert.deepEqual(Tripod.util.trim(testValue), 'some value');
});

QUnit.test("Tripod.util.trim with New Lines", function( assert ) {
	var testValue = '\n\nsome value\n\n';
	assert.deepEqual(Tripod.util.trim(testValue), 'some value');
});

// Tripod.util.cloneObject: function(obj)

QUnit.test("Tripod.util.cloneObject", function( assert ) {
	var testValue = { someProperty: 'someValue' };
	var testClone = Tripod.util.cloneObject(testValue);
	testValue.someProperty = 'someOtherValue';
	assert.deepEqual(testClone, { someProperty: 'someValue' });
});

// Tripod.util.toggleClass: function(node, className, value)

QUnit.test("Tripod.util.toggleClass: toggle on", function( assert ) {
	var testNode = document.createElement('p');
	Tripod.util.toggleClass(testNode, 'someClass', true);
	assert.deepEqual(testNode.className, 'someClass');
});

QUnit.test("Tripod.util.toggleClass: toggle off", function( assert ) {
	var testNode = document.createElement('p');
	testNode.className = 'someClass';
	Tripod.util.toggleClass(testNode, 'someClass', false);
	assert.deepEqual(testNode.className, '');
});

QUnit.test("Tripod.util.toggleClass: toggle on when exists", function( assert ) {
	var testNode = document.createElement('p');
	testNode.className = 'someClass';
	Tripod.util.toggleClass(testNode, 'someClass', true);
	assert.deepEqual(testNode.className, 'someClass');
});

QUnit.test("Tripod.util.toggleClass: toggle off when missing", function( assert ) {
	var testNode = document.createElement('p');
	Tripod.util.toggleClass(testNode, 'someClass', false);
	assert.deepEqual(testNode.className, '');
});

// Tripod.util.formatAsCurrency: function(value, currencySymbol)

QUnit.test("Tripod.util.formatAsCurrency with Number", function( assert ) {
	var testValue = 12345;
	assert.deepEqual(Tripod.util.formatAsCurrency(testValue), '$12,345.00');
});

QUnit.test("Tripod.util.formatAsCurrency with String", function( assert ) {
	var testValue = '12345';
	assert.deepEqual(Tripod.util.formatAsCurrency(testValue), '$12,345.00');
});

QUnit.test("Tripod.util.formatAsCurrency Rounding", function( assert ) {
	var testValue = 12345.111;
	assert.deepEqual(Tripod.util.formatAsCurrency(testValue), '$12,345.11');
});

QUnit.test("Tripod.util.formatAsCurrency with Alternate Currency Symbol", function( assert ) {
	var testValue = '12345';
	var testSymbol = 'Tripod';
	assert.deepEqual(Tripod.util.formatAsCurrency(testValue, testSymbol), 'Tripod12,345.00');
});

QUnit.test("Tripod.util.formatAsCurrency with Null", function( assert ) {
	var testValue = null;
	assert.deepEqual(Tripod.util.formatAsCurrency(testValue), '$0.00');
});

QUnit.test("Tripod.util.formatAsCurrency with Undefined", function( assert ) {
	var testValue;
	assert.deepEqual(Tripod.util.formatAsCurrency(testValue), '$0.00');
});

// Tripod.util.getNodeValue: function(node)
// Tripod.util.setNodeValue: function(node, value)
// Tripod.util.getNodesByAttributeValue: function(attributeName, attributeValue, parentNode)
// Tripod.util.processTemplate: function(templateString, data)
