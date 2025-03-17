/*global QUnit, sinon */
sap.ui.define([
	'sap/ui/export/ExportBase',
	'sap/ui/export/ExportUtils',
	'sap/ui/thirdparty/sinon-qunit' /* Sinon itself is already part of MockServer */
], function (ExportBase, ExportUtils, SinonQUnit) {
	'use strict';

	var oExportBase, mSettings, mModuleConfig;

	mSettings = {
		workbook: {
			columns: [
				{
					property: 'SampleProperty',
					label: 'Sample Column'
				}
			],
			hierarchyLevel: 'Level',
			drillState: 'State'
		}
	};

	mModuleConfig = {
		beforeEach: function() {
			sinon.stub(ExportUtils, 'validateSettings');
			sinon.stub(ExportUtils, 'getHierarchyLevel');
			sinon.stub(ExportUtils, 'getHierarchyDrillState');
			oExportBase = new ExportBase(mSettings);
		},
		afterEach: function () {
			ExportUtils.validateSettings.restore();
			ExportUtils.getHierarchyLevel.restore();
			ExportUtils.getHierarchyDrillState.restore();
			oExportBase = null;
		}
	};

	QUnit.module('Interface', mModuleConfig);

	QUnit.test('constructor', function(assert) {
		assert.ok(ExportUtils.getHierarchyLevel.calledOnce, 'HierarchyLevel evaluated during initialization');
		assert.ok(ExportUtils.getHierarchyDrillState.calledOnce, 'DrillState evaluated during initialization');
		assert.equal(oExportBase._mSettings.workbook.hierarchyLevel, 'Level', 'Property hierarchyLevel has not been overwritten');
		assert.equal(oExportBase._mSettings.workbook.drillState, 'State', 'Property drillState has not been overwritten');
	});

	QUnit.test('abstract functions', function(assert) {

		/* Check whether the abstract functions exist */
		assert.equal(typeof oExportBase.createBuildPromise, 'function', 'The function "createBuildPromise" is existing on the ExportBase instance');
		assert.equal(typeof oExportBase.setDefaultExportSettings, 'function', 'The function "setDefaultExportSettings" is existing on the ExportBase instance');
		assert.equal(typeof oExportBase.processDataSource, 'function', 'The function "processDataSource" is existing on the ExportBase instance');
		assert.equal(typeof oExportBase.cancel, 'function', 'The function "cancel" is existing on the ExportBase instance');
		assert.equal(typeof oExportBase.getMimeType, 'function', 'The function "getMimeType" is existing on the ExportBase instance');

		/* Verify that the abstract functions throw an Error to enforce a specific implementation */
		assert.throws(oExportBase.createBuildPromise, 'Function "createBuildPromise" is abstract');
		assert.throws(oExportBase.setDefaultExportSettings, 'Function "setDefaultExportSettings" is abstract');
		assert.throws(oExportBase.processDataSource, 'Function "processDataSource" is abstract');
		assert.throws(oExportBase.cancel, 'Function "cancel" is abstract');
		assert.throws(oExportBase.getMimeType, 'Function "getMimeType" is abstract');
	});

	QUnit.test('function destroy works as intended', function(assert) {
		sinon.stub(oExportBase, 'cancel');

		assert.equal(typeof oExportBase.destroy, 'function', 'The function "destroy" is existing on the ExportBase instance');
		assert.ok(oExportBase._mSettings, 'Export settings available');

		oExportBase.attachBeforeExport(function(){});
		assert.ok(oExportBase.hasListeners('beforeExport'), 'Event listeners attached');

		assert.notOk(oExportBase.bIsDestroyed, 'Object is not yet marked as destroyed');

		oExportBase.destroy();
		assert.ok(oExportBase.bIsDestroyed, 'Object is marked as destroyed');
		assert.notOk(oExportBase._mSettings, 'Export settings have been removed');
		assert.notOk(oExportBase.hasListeners('beforeExport'), 'Listeners have been removed');
		assert.ok(oExportBase.cancel.calledOnce, 'The any running export has been cancelled while destroying the object');

		oExportBase.cancel.restore();
	});

	QUnit.test('function build works as intended', function(assert) {
		const done = assert.async();

		assert.expect(4);

		sinon.stub(oExportBase, 'setDefaultExportSettings').returns(Promise.resolve());
		sinon.stub(oExportBase, 'createBuildPromise').returns(Promise.resolve());

		assert.equal(typeof oExportBase.build, 'function', 'The function "build" is existing on the ExportBase instance');

		oExportBase.build().then(function() {
			assert.ok(true, 'Promise returned by function build is resolved');
		}).catch(function() {
			assert.ok(false, 'Function build must not reject when the object has not been destroyed');
		}).finally(function() {
			assert.ok(oExportBase.setDefaultExportSettings.calledOnce, 'Function setDefaultExportSettings was called');
			assert.ok(oExportBase.createBuildPromise.calledOnce, 'Function createBuildPromise was called');

			oExportBase.setDefaultExportSettings.restore();
			oExportBase.createBuildPromise.restore();

			done();
		});
	});

	QUnit.test('function build rejects when object is destroyed', function(assert) {
		const done = assert.async();

		assert.expect(3);

		sinon.stub(oExportBase, 'setDefaultExportSettings').returns(Promise.resolve());
		sinon.stub(oExportBase, 'createBuildPromise').returns(Promise.resolve());
		sinon.stub(oExportBase, 'cancel');

		oExportBase.destroy();
		oExportBase.build().then(function() {
			assert.ok(false, 'Function build must not resolve when the object has been destroyed');
		}).catch(function() {
			assert.ok(true, 'The Promise rejects when the object has been destroyed');
		}).finally(function() {
			assert.ok(oExportBase.setDefaultExportSettings.notCalled, 'Function setDefaultExportSettings was not called');
			assert.ok(oExportBase.createBuildPromise.notCalled, 'Function createBuildPromise was not called');

			oExportBase.setDefaultExportSettings.restore();
			oExportBase.createBuildPromise.restore();
			oExportBase.cancel.restore();

			done();
		});
	});

	QUnit.test('event beforeExport is fired', async function(assert) {
		assert.expect(4);

		const expectedResult = 'FakeResult';

		sinon.stub(oExportBase, 'setDefaultExportSettings').returns(Promise.resolve());
		sinon.stub(oExportBase, 'createBuildPromise').returns(Promise.resolve(expectedResult));

		oExportBase.attachBeforeExport(function() {
			assert.ok(true, 'Event beforeExport was fired');
			assert.ok(oExportBase.setDefaultExportSettings.calledOnce, 'Function setDefaultExportSettings was called');
			assert.ok(oExportBase.createBuildPromise.notCalled, 'Function createBuildPromise was not called');
		});

		const result = await oExportBase.build();

		assert.equal(result, expectedResult, 'Export resolved with expected result');

		oExportBase.setDefaultExportSettings.restore();
		oExportBase.createBuildPromise.restore();
	});

	QUnit.test('event beforeExport allows prevent default', async function(assert) {
		sinon.stub(oExportBase, 'setDefaultExportSettings').returns(Promise.resolve());
		sinon.stub(oExportBase, 'createBuildPromise').returns(Promise.resolve('FakeResult'));

		oExportBase.attachBeforeExport((oEvent) => {
			assert.ok(true, 'Event beforeExport was fired');
			oEvent.preventDefault();
		});

		const result = await oExportBase.build();

		assert.equal(typeof result, 'undefined', 'No result returned');
		assert.ok(oExportBase.setDefaultExportSettings.calledOnce, 'Function setDefaultExportSettings was called');
		assert.ok(ExportUtils.validateSettings.notCalled, 'ExportUtils.validateSettings was not called');
		assert.ok(oExportBase.createBuildPromise.notCalled, 'Function createBuildPromise was not called');

		oExportBase.setDefaultExportSettings.restore();
		oExportBase.createBuildPromise.restore();
	});
});