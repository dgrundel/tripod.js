QUnit.module("Tripod Instance");

QUnit.test("Empty Attributes", function( assert ) {
	var t = new Tripod();
	assert.deepEqual(t.getAll(), {});
});

QUnit.test("Constructor Attributes", function( assert ) {
	var t = new Tripod( { someAttribute: 'someValue'} );
	assert.deepEqual(t.getAll(), { someAttribute: 'someValue'});
});

QUnit.test("Set", function( assert ) {
	var t = new Tripod();
	t.set('someAttribute', 'someValue');
	assert.deepEqual(t.getAll(), { someAttribute: 'someValue'});
});

QUnit.test("Get", function( assert ) {
	var t = new Tripod();
	t.set('someAttribute', 'someValue');
	assert.deepEqual(t.get('someAttribute'), 'someValue');
});

QUnit.test("Multi Set", function( assert ) {
	var t = new Tripod();
	t.set('someAttribute', 'someValue');
	t.set('someOtherAttribute', 'someOtherValue');
	assert.deepEqual(t.getAll(), { someAttribute: 'someValue', someOtherAttribute: 'someOtherValue'});
});

QUnit.test("Set with Object", function( assert ) {
	var t = new Tripod();
	t.set({ someAttribute: 'someValue', someOtherAttribute: 'someOtherValue'});
	assert.deepEqual(t.getAll(), { someAttribute: 'someValue', someOtherAttribute: 'someOtherValue'});
});

QUnit.test("SetMany", function( assert ) {
	var t = new Tripod();
	t.setMany({ someAttribute: 'someValue', someOtherAttribute: 'someOtherValue'});
	assert.deepEqual(t.getAll(), { someAttribute: 'someValue', someOtherAttribute: 'someOtherValue'});
});

QUnit.test("SaveState Return", function( assert ) {
	var t = new Tripod();
	t.setMany({ someAttribute: 'someValue', someOtherAttribute: 'someOtherValue'});
	var state = t.saveState();
	assert.deepEqual(state, { someAttribute: 'someValue', someOtherAttribute: 'someOtherValue'});
});

QUnit.test("Revert", function( assert ) {
	var t = new Tripod();
	t.setMany({ someAttribute: 'someValue', someOtherAttribute: 'someOtherValue'});
	t.saveState();
	t.set('someAttribute', 'someOtherValue');
	t.revert();
	assert.deepEqual(t.getAll(), { someAttribute: 'someValue', someOtherAttribute: 'someOtherValue'});
});

QUnit.test("DOM Load", function( assert ) {
	var t = new Tripod({}, 'test');
	t.load('domLoadTest');
	
	assert.deepEqual(t.get('domLoadTest'), 'domLoadTestValue');
});

QUnit.test("DOM LoadAll", function( assert ) {
	var t = new Tripod({domLoadAllTest: ''}, 'test');
	t.loadAll();
	
	assert.deepEqual(t.getAll(), {domLoadAllTest: 'domLoadAllTestValue'});
});

QUnit.test("DOM Push", function( assert ) {
	var t = new Tripod({}, 'test');
	var domValue;

	t.set('domPushTest', 'domPushTestValue');
	domValue = document.getElementById('domPushTestNode').value;

	assert.deepEqual(domValue, 'domPushTestValue');
});

QUnit.test("DOM PushAll", function( assert ) {
	var t = new Tripod({domPushAllTest: 'domPushAllTestValue'}, 'test');
	var domValue;

	t.pushAll();
	domValue = document.getElementById('domPushAllTestNode').value;

	assert.deepEqual(domValue, 'domPushAllTestValue');
});

QUnit.test("DOM Sync", function( assert ) {
	var t = new Tripod({}, 'test');
	var domValue;

	t.sync('domSyncTest');
	domValue = document.getElementById('domSyncTestNode2').value;
	
	assert.deepEqual(t.get('domSyncTest'), 'domSyncTestValue');
	assert.deepEqual(domValue, 'domSyncTestValue');
});

QUnit.test("DOM SyncAll", function( assert ) {
	var t = new Tripod({domSyncAllTest: ''}, 'test');
	var domValue;

	t.syncAll();
	domValue = document.getElementById('domSyncAllTestNode2').value;
	
	assert.deepEqual(t.get('domSyncAllTest'), 'domSyncAllTestValue');
	assert.deepEqual(domValue, 'domSyncAllTestValue');
});

function setLocalStorageItem(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorageItem(key) {
	var value = localStorage.getItem(key);
	return value ? JSON.parse(value) : null;
}

QUnit.test("LocalStorage Persist", function( assert ) {
	var t = new Tripod({}, 'localStoragePersistTest', true);
	var localStorageKey = 'localStoragePersistTest.localStoragePersistTestAttribute';
	var testValue;

	t.set('localStoragePersistTestAttribute', 'localStoragePersistTestValue');
	
	testValue = getLocalStorageItem(localStorageKey);
	localStorage.removeItem(localStorageKey);
	
	assert.deepEqual(testValue, 'localStoragePersistTestValue');
});

QUnit.test("LocalStorage Load", function( assert ) {
	var t = new Tripod({}, 'localStorageLoadTest', true);
	var localStorageKey = 'localStorageLoadTest.localStorageLoadTestAttribute';
	var testValue;

	setLocalStorageItem(localStorageKey, 'localStorageLoadTestValue');

	t.load('localStorageLoadTestAttribute');
	
	testValue = t.get('localStorageLoadTestAttribute');
	localStorage.removeItem(localStorageKey);
	
	assert.deepEqual(testValue, 'localStorageLoadTestValue');
});

QUnit.test("Update", function( assert ) {
	var t = new Tripod();
	var exceptionText;
	t.set('someAttribute', 'someValue');
	t.update('someAttribute', 'someOtherValue');
	t.update('someMissingAttribute', 'someMissingValue');

	try {
		t.get('someMissingAttribute');
	} catch(e) {
		exceptionText = e;
	}

	assert.deepEqual(t.get('someAttribute'), 'someOtherValue');
	assert.deepEqual(exceptionText, 'attribute "someMissingAttribute" does not exist.');
});

QUnit.test("Update with Object", function( assert ) {
	var t = new Tripod();
	var exceptionText;

	t.set({ someAttribute: 'someValue', someOtherAttribute: 'someOtherValue'});
	t.update({ someAttribute: 'yetAnotherValue', someMissingAttribute: 'someMissingValue'});

	try {
		t.get('someMissingAttribute');
	} catch(e) {
		exceptionText = e;
	}

	assert.deepEqual(t.getAll(), { someAttribute: 'yetAnotherValue', someOtherAttribute: 'someOtherValue'});
	assert.deepEqual(exceptionText, 'attribute "someMissingAttribute" does not exist.');
});

QUnit.test("UpdateMany", function( assert ) {
	var t = new Tripod();
	var exceptionText;

	t.set({ someAttribute: 'someValue', someOtherAttribute: 'someOtherValue'});
	t.updateMany({ someAttribute: 'yetAnotherValue', someMissingAttribute: 'someMissingValue'});

	try {
		t.get('someMissingAttribute');
	} catch(e) {
		exceptionText = e;
	}

	assert.deepEqual(t.getAll(), { someAttribute: 'yetAnotherValue', someOtherAttribute: 'someOtherValue'});
	assert.deepEqual(exceptionText, 'attribute "someMissingAttribute" does not exist.');
});