/*global sinon */
sap.ui.define([
		"sap/apf/base/Component",
		"sap/apf/utils/utils",
		"sap/apf/testhelper/comp/Component",
		"sap/ui/core/ComponentContainer",
		"sap/apf/cloudFoundry/uiHandler"
	],
	function(Component, Utils, TestHelperComponent, ComponentContainer, uiHandler) {
	'use strict';

	QUnit.module("Extension of Base Component", {
		afterEach : function() {
			this.oComponentContainer.destroy();
		}
	});
	QUnit.test("WHEN a component is created that extends the base Component", function(assert) {
		// Act
		var oComponent = new TestHelperComponent();
		this.oComponentContainer = new ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(oComponent);
		this.oComponentContainer.placeAt("qunit-fixture");
		// Check
		var manifest = oComponent.getManifest();
		assert.notStrictEqual(manifest["sap.app"].dataSources, undefined, "THEN manifest contains dataSources");
		assert.notStrictEqual(manifest["sap.app"].dataSources.PathPersistenceServiceRoot, undefined, "THEN dataSources contains PathPersistenceServiceRoot");
		assert.notStrictEqual(manifest["sap.app"].dataSources.PathPersistenceServiceRoot.uri, undefined, "AND contains uri");
		assert.deepEqual(manifest["sap.app"].i18n, {
			"bundleUrl": "../../resources/i18n/applicationUi.properties",
			"supportedLocales": ["", "en", "en_US"],
			"fallbackLocale": "en"
		}, "THEN the application text file can be retrieved");
		assert.notStrictEqual(manifest["sap.app"].dataSources.AnalyticalConfigurationLocation.uri, undefined, "THEN contains AnalyticalConfigurationLocation.uri");
		// sap-apf namespace in manifest
		assert.notStrictEqual(manifest["sap.apf"].appSpecificParameters, undefined, "THEN contains appSpecificParameters");
		assert.notStrictEqual(manifest["sap.apf"].activateFilterReduction, undefined, "THEN contains activateFilterReduction");
		assert.notStrictEqual(manifest["sap.apf"].activateLrep, undefined, "THEN contains activateLrep");
	});

	QUnit.module("init CF exit", {
		beforeEach: function() {
			var env = this;
			// stub base metadata
			env.oBaseMetadata = {
				_getManifest: function() {
					return "my-manifest";
				}
			};
			env.stubGetBaseMetadata = sinon.stub(Component.prototype, "getMetadata");
			env.stubGetBaseMetadata.returns(env.oBaseMetadata);
			// stub oComponent
			env.bStartupSucceeded = false;
			env.oAllProperties = {
				injectedApfApi: {
					appData: {
						Constructor: function() {
							this.startupSucceeded = function() {
								return env.bStartupSucceeded;
							}
						}
					}
				}
			};
			env.oMetadata = {
				/** @deprecated */
				getManifest: function() {
					return this._getManifest();
				},
				_getManifest: function() {
					return "my-manifest";
				},
				getAllProperties: function() {
					return env.oAllProperties;
				}
			};
			env.stubGetInjections = sinon.stub();
			env.oComponent = {
				getManifest: function() {
					return this.getMetadata()._getManifest();
				},
				getMetadata: function() {
					return env.oMetadata;
				},
				getInjections: env.stubGetInjections
			};
			// stub initRuntime
			env.stubInitRuntime = sinon.stub(uiHandler, "initRuntime");
		},
		afterEach: function() {
			this.stubGetBaseMetadata.restore();
			this.stubInitRuntime.restore();
		}
	});
	QUnit.test("WHEN getInjections returns undefined", function(assert) {
		// data
		this.stubGetInjections.returns(undefined);
		// execute
		Component.prototype.init.apply(this.oComponent);
		// assert
		assert.ok(this.stubInitRuntime.notCalled, "initRuntime is not called");
	});
	QUnit.test("WHEN isUsingCloudFoundryProxy is undefined", function(assert) {
		// data
		this.stubGetInjections.returns({
			functions: {}
		});
		// execute
		Component.prototype.init.apply(this.oComponent);
		// assert
		assert.ok(this.stubInitRuntime.notCalled, "initRuntime is not called");
	});
	QUnit.test("WHEN isUsingCloudFoundryProxy returns false", function(assert) {
		// data
		this.stubGetInjections.returns({
			functions: {
				isUsingCloudFoundryProxy: function() {
					return false;
				}
			}
		});
		// execute
		Component.prototype.init.apply(this.oComponent);
		// assert
		assert.ok(this.stubInitRuntime.notCalled, "initRuntime is not called");
	});
	QUnit.test("WHEN isUsingCloudFoundryProxy returns true", function(assert) {
		// data
		this.stubGetInjections.returns({
			functions: {
				isUsingCloudFoundryProxy: function() {
					return true;
				}
			}
		});
		// execute
		Component.prototype.init.apply(this.oComponent);
		// assert
		assert.ok(this.stubInitRuntime.calledOnce, "initRuntime is called once");
		assert.strictEqual(this.stubInitRuntime.getCall(0).args[0], this.oComponent, "initRuntime is called with the component");
	});

});
