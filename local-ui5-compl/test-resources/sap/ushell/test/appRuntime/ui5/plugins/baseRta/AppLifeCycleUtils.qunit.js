// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/*global QUnit*/

// eslint-disable-next-line no-unused-expressions
window.blanket && window.blanket.options("sap-ui-cover-only", "[sap/ushell/plugins]");
sap.ui.define([
	"sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils",
	"sap/base/util/ObjectPath",
	"sap/ui/thirdparty/sinon-4"
], function (
	AppLifeCycleUtils,
	ObjectPath,
	sinon
) {
	"use strict";

	var sandbox = sinon.sandbox.create();

	QUnit.module("Given ushell container with AppLifeCycle service", {
		beforeEach: function () {
			this.oGetCurrentApplicationStub = sandbox.stub();
			this.oContainer = {
				getServiceAsync: function () {
					return Promise.resolve({
						getCurrentApplication: this.oGetCurrentApplicationStub
					});
				}.bind(this)
			};
			this.oRequireContainerStub = sandbox.stub(sap.ui, "require")
			.withArgs("sap/ushell/Container")
			.returns(this.oContainer);
		},
		afterEach: function () {
			sandbox.restore();
		}
	});

	QUnit.test("When getContainer is called", function (assert) {
		AppLifeCycleUtils.getContainer();
		assert.ok(this.oRequireContainerStub.calledWith("sap/ushell/Container"), "then the ushell container is called");
	});

	QUnit.test("When getContainer is called without existing container", function (assert) {
		sap.ui.require.restore();
		sandbox.stub(sap.ui, "require")
		.withArgs("sap/ushell/Container");
		assert.throws(function () {
			AppLifeCycleUtils.getContainer();
		}, /Illegal state: shell container not available; this component must be executed in a unified shell runtime context./,
			"then an exception is trown");
	});

	QUnit.test("When getAppLifeCycleService is called", function (assert) {
		var oGetServiceAsyncSpy = sandbox.spy(this.oContainer, "getServiceAsync");
		var oGetContainerSpy = sandbox.spy(AppLifeCycleUtils, "getContainer");
		return AppLifeCycleUtils.getAppLifeCycleService()
			.then(function () {
				assert.ok(oGetContainerSpy.calledOnce, "then the getContainer function is called");
				assert.ok(oGetServiceAsyncSpy.calledWith("AppLifeCycle"), "then the container is called for the AppLifeCycleService");
			});
	});

	QUnit.test("When getCurrentRunningApplication is called", function (assert) {
		var oGetAppLifeCycleServiceSpy = sandbox.spy(AppLifeCycleUtils, "getAppLifeCycleService");
		return AppLifeCycleUtils.getCurrentRunningApplication()
			.then(function () {
				assert.ok(oGetAppLifeCycleServiceSpy.calledOnce, "then the getAppLifeCycleService function is called");
				assert.ok(this.oGetCurrentApplicationStub.calledOnce,
					"then the getCurrentApplication function from AppLifeCycleService is called");
			}.bind(this));
	});
});
