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

function assertNodeValue(assert, nodeId) {
	var testNode = document.getElementById(nodeId);
	assert.deepEqual(Tripod.util.getNodeValue(testNode), 'utilGetNodeValueTestValue');
}

QUnit.test("Tripod.util.getNodeValue with Input", function( assert ) {
	assertNodeValue(assert, 'utilGetNodeValueTestInput');
});

QUnit.test("Tripod.util.getNodeValue with Paragraph", function( assert ) {
	assertNodeValue(assert, 'utilGetNodeValueTestParagraph');
});

QUnit.test("Tripod.util.getNodeValue with Textarea", function( assert ) {
	assertNodeValue(assert, 'utilGetNodeValueTestTextarea');
});

QUnit.test("Tripod.util.getNodeValue with Select with Value", function( assert ) {
	assertNodeValue(assert, 'utilGetNodeValueTestSelectWithValue');
});

QUnit.test("Tripod.util.getNodeValue with Select with No Value", function( assert ) {
	assertNodeValue(assert, 'utilGetNodeValueTestSelectNoValue');
});

QUnit.test("Tripod.util.getNodeValue with Radio", function( assert ) {
	assertNodeValue(assert, 'utilGetNodeValueTestRadio');
});

// Tripod.util.setNodeValue: function(node, value)

QUnit.test("Tripod.util.setNodeValue with Input", function( assert ) {
	var testNode = document.getElementById('utilSetNodeValueTestInput');
	Tripod.util.setNodeValue(testNode, 'utilSetNodeValueTestValue');
	var actual = testNode.value;
	assert.deepEqual(actual, 'utilSetNodeValueTestValue');
});

QUnit.test("Tripod.util.setNodeValue with Paragraph", function( assert ) {
	var testNode = document.getElementById('utilSetNodeValueTestParagraph');
	Tripod.util.setNodeValue(testNode, 'utilSetNodeValueTestValue');
	var actual = testNode.textContent;
	assert.deepEqual(actual, 'utilSetNodeValueTestValue');
});

QUnit.test("Tripod.util.setNodeValue with Textarea", function( assert ) {
	var testNode = document.getElementById('utilSetNodeValueTestTextarea');
	Tripod.util.setNodeValue(testNode, 'utilSetNodeValueTestValue');
	var actual = testNode.value;
	assert.deepEqual(actual, 'utilSetNodeValueTestValue');
});

QUnit.test("Tripod.util.setNodeValue with Select with Value", function( assert ) {
	var testNode = document.getElementById('utilSetNodeValueTestSelectWithValue');
	Tripod.util.setNodeValue(testNode, 'utilSetNodeValueTestValue');
	var actual = testNode.options[testNode.selectedIndex].value;
	assert.deepEqual(actual, 'utilSetNodeValueTestValue');
});

QUnit.test("Tripod.util.setNodeValue with Select with No Value", function( assert ) {
	var testNode = document.getElementById('utilSetNodeValueTestSelectNoValue');
	Tripod.util.setNodeValue(testNode, 'utilSetNodeValueTestValue');
	var actual = testNode.options[testNode.selectedIndex].value;
	assert.deepEqual(actual, 'utilSetNodeValueTestValue');
});

QUnit.test("Tripod.util.setNodeValue with Radio", function( assert ) {
	var testNode = document.getElementById('utilSetNodeValueTestRadio');
	Tripod.util.setNodeValue(testNode, 'utilSetNodeValueTestValue');
	var actual = testNode.checked;
	assert.deepEqual(actual, true);
});

// Tripod.util.getNodesByAttributeValue: function(attributeName, attributeValue, parentNode)

function assertGetNodesByAttributeValue(assert, nodeCount, testParentNode) {
	var testAttributeName = 'data-util-get-nodes-by-attribute-value-attribute';
	var testAttributeValue = 'utilGetNodesByAttributeValueValue';
	var testNodes = Tripod.util.getNodesByAttributeValue(testAttributeName, testAttributeValue, testParentNode);
	assert.deepEqual(testNodes.length, nodeCount);
}

QUnit.test("Tripod.util.getNodesByAttributeValue without parentNode", function( assert ) {
	assertGetNodesByAttributeValue(assert, 12);
});

QUnit.test("Tripod.util.getNodesByAttributeValue with parentNode", function( assert ) {
	var testParentNode = document.getElementById('utilGetNodesByAttributeValueParentNode');
	assertGetNodesByAttributeValue(assert, 6, testParentNode);
});

// Tripod.util.processTemplate: function(templateString, data)

QUnit.test("Tripod.util.processTemplate", function( assert ) {
	var testTemplate = "{greeting}, {who}!";
	var testData = { 
		greeting: 'Hello',
		who: 'test' 
	};
	assert.deepEqual(Tripod.util.processTemplate(testTemplate, testData), 'Hello, test!');
});
