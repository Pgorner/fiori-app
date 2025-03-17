/**
 * tests for the sap.suite.ui.generic.template.lib.CommonUtils.setEnabledToolbarButtons
 */

sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/generic/template/lib/CommonUtils",
	"sap/suite/ui/generic/template/genericUtilities/controlHelper",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/genericUtilities/oDataModelHelper"
], function(sinon, JSONModel, CommonUtils, controlHelper, testableHelper, oDataModelHelper) {
	"use strict";

	var oPrivateModel = new JSONModel({
		generic: {
			controlProperties: {},
		},
	});
	var oEntitySet = {
		"Org.OData.Capabilities.V1.DeleteRestrictions": {
			"Deletable": {
				"Path": undefined
			}
		},
		"Org.OData.Capabilities.V1.UpdateRestrictions": {
			"Updatable": {
				"Path": undefined
			}
		}
	};
	var oModelObject = {};
	var oMetaModelObject = {};
	var oManifestActions = {};
	var mFunctionImport = {};
	var oComponentUtils = {};
	var aContexts = [];
	var oToolbarContent = {};
	var aToolbarCustomData = [];
	var oMetaModel = {
		getODataFunctionImport: function () {
			return mFunctionImport;
		},
		getODataEntitySet: function () {
			return oEntitySet;
		}
	};
	var sDraftAdministrativeData;
	var oModel = {
		getMetaModel: function () {
			return oMetaModel;
		},
		getObject: function (vValue) {
			if (typeof(vValue) === 'string' && vValue.includes("DraftAdministrativeData")) {
				return sDraftAdministrativeData;
			} else {
				return {entityProperty: vValue};
			}
		},
		getProperty: function (sPath, oContext) {
			var sContextPath = oContext.getPath(sPath);
			if (sContextPath === "isDeletable") {
				return true;
			} else if (sContextPath === "isNotDeletable") {
				return false;
			} else if (sContextPath === "isUpdatable") {
				return true;
			} else if (sContextPath === "isNotUpdatable") {
				return false;
			}
		}
	};
	var oControl = {
		getModel: function(){
			return oModel;
		},
		getSelectedContexts: function () {
			return aContexts;
		},
		getToolbar: function () {
			return oToolbar;
		},
		getEntitySet: function () {
			return;
		},
		getId: function () {
			return "toolbar_id";
		}
	};

	var oTemplateSpecific = {
		templateSpecific: {
			multiEdit: false
		}
	}
	var oComponentUtils = {
		getSettings: function () {
			var oSettings = {
				multiSelect: true
			}
			return oSettings;
		},
		isDraftEnabled: function () {
			return true;
		},
		getParameterModelForTemplating : function () {
			return {
				getData : function() {
					return oTemplateSpecific;
				}
			}
		},
		getTemplatePrivateModel: function(){
			return oPrivateModel;
		},
		getViewLevel: function(){ return 1; },
	};

	// setup variables for CommonUtils creation
	var oServices = {
		oApplication: {
			getBusyHelper: function() {
				return {
					isBusy: function() {
						return false;
					},
					setBusy: Function.prototype
				};
			},
			isObjectInEditMode: function() {
				return false;
			}
		},
		oPresentationControlHandlerFactory: {
			getPresentationControlHandler: function() {
				return {
					getSelectedContexts: function() {
						return aContexts;
					}
				}
			}
		}
	};
	var oController = {
		byId: function (sId) {
			return oToolbarContent[sId];
		},		
		getOwnerComponent : function() {
			return {
				getModel : function(sId) {
					return {
						getResourceBundle : function() {
							return { };
						},
						getMetaModel : function() {
							return {
								getODataEntitySet: function(sEntitySet) {
									return oEntitySet;
								},
								getObject: function(sPath) {
									return oMetaModelObject;
								}
							};
						},
						getObject: function(sPath) {
							return oModelObject;
						}
					};
				},
				getComponentContainer: function(){
					return {
						getElementBinding: function(){
							return { };
						}
					};
				},
				getEntitySet: function() {
					return oEntitySet;
				},
				getAppComponent: function() {
					return {
						getInternalManifest: function() {
							return oManifestActions;
						}
					};
				},
				getTemplateName: function() {
					return "sap.suite.ui.generic.template.ListReport.view.ListReport";
				}
			};
		},
		getInnerAppState: Function.prototype,
		getView: function() {
			return {
				getLocalId: function (sId) {
					return sId;
				} 
			};
		}
	};

	var sandbox, oStubForPrivate, oCommonUtils;
	
	function fnCommonBeforeEach(){
		oStubForPrivate = testableHelper.startTest();
		var oStubForStatic = testableHelper.getStaticStub();
		sandbox = sinon.sandbox.create();
		oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
		// override getSelectedContexts, getOwnerControl, getBreakoutActionsForTable, fillEnabledMapForBreakoutActions - we don't want to test these functions
		sandbox.stub(oStubForPrivate, "fnGetToolbarCustomData", function() {
			return aToolbarCustomData;
		});
		sandbox.stub(oStubForPrivate, "getOwnerControl", function() {
			return oControl;
		});

		sandbox.stub(oStubForPrivate, "fillEnabledMapForBreakoutActions", Function.prototype);
		sandbox.stub(oStubForPrivate, "getBreakoutActionIds", Function.prototype);
		sandbox.stub(controlHelper, "isSmartTable", function(){
			return true;
		});
	}

	function fnCommonAfterEach(){
		sandbox.restore();
		testableHelper.endTest();
	}

	/* annotated action button test module */
	QUnit.module("lib.CommonUtils.setEnabledToolbarButtons - Annotated Action Button", {
		beforeEach: fnCommonBeforeEach,
		afterEach: fnCommonAfterEach
	});

	QUnit.test("no action-for defined, no applicable-path, no context selected", function(assert) {
		var oButton = new sap.m.Button();

		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Action: "Action1"
			}
		];

		aContexts = [];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;
		mFunctionImport["sap:action-for"] = undefined;
		mFunctionImport["sap:applicable-path"] = undefined;

		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

		// assert
		assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton.getId() + "/enabled"), undefined, "Action button's enabled property correctly set to true.");

		// destroy
		oButton.destroy();
	});

	QUnit.test("no action-for defined, no applicable-path, one context selected", function(assert) {
		var oButton = new sap.m.Button();

		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Action: "Action1"
			}
		];

		var oContext = {
			getPath: function() {
				return '';
			},
			isTransient: function() {
				return false;
			}
		};
		aContexts = [oContext];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;

		mFunctionImport["sap:action-for"] = undefined;
		mFunctionImport["sap:applicable-path"] = undefined;

		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

		// assert
		assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton.getId() + "/enabled"), undefined, "Action button's enabled property correctly set to true.");

		// destroy
		oButton.destroy();
	});

	QUnit.test("action-for defined, no applicable-path, one context selected", function(assert) {
		var oButton = new sap.m.Button();
		oButton.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton.getId() + "/enabled}");

		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Action: "Action1"
			}
		];

		var oContext = {
			getPath: function() {
				return '';
			},
			isTransient: function() {
				return false;
			}
		};
		aContexts = [oContext];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;

		mFunctionImport["sap:action-for"] = "functionImport";
		mFunctionImport["sap:applicable-path"] = undefined;

		// initialize the private model with the button id
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton.getId(), { enabled : undefined });

		// setting the property might happen asynchronous or synchronous - so attach the event handler (including the assertion) before calling the method actually triggering the change
		// assert
		var done = assert.async();
		oPrivateModel.bindProperty("/generic/controlProperties/" + oButton.getId() + "/enabled").attachChange(function(){
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton.getId() + "/enabled"), true, "Action button's enabled property correctly set to true.");
			// destroy
			oButton.destroy();
			done();
		})
		
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

	});

	QUnit.test("action-for defined, no applicable-path, no context selected", function(assert) {
		var oButton = new sap.m.Button();
		oButton.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton.getId() + "/enabled}");

		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Action: "Action1"
			}
		];

		aContexts = [];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;

		mFunctionImport["sap:action-for"] = "functionImport";
		mFunctionImport["sap:applicable-path"] = undefined;

		// initialize the private model with the button id
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton.getId(), { enabled : undefined });

		// setting the property might happen asynchronous or synchronous - so attach the event handler (including the assertion) before calling the method actually triggering the change
		// assert
		var done = assert.async();
		oPrivateModel.bindProperty("/generic/controlProperties/" + oButton.getId() + "/enabled").attachChange(function(){
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton.getId() + "/enabled"), false, "Action button's enabled property correctly set to false.");
			// destroy
			oButton.destroy();
			done();
		})
		
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

	});

	QUnit.test("action-for defined, applicable-path true, one context selected", function(assert) {
		var oButton = new sap.m.Button();
		oButton.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton.getId() + "/enabled}");

		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Action: "Action1"
			}
		];

		var oContext = {
			getPath: function() {
				return true;
			},
			isTransient: function() {
				return false;
			}
		};
		aContexts = [oContext];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;

		mFunctionImport["sap:action-for"] = "functionImport";
		mFunctionImport["sap:applicable-path"] = "entityProperty";

		// initialize the private model with the button id
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton.getId(), { enabled : undefined });

		// setting the property might happen asynchronous or synchronous - so attach the event handler (including the assertion) before calling the method actually triggering the change
		// assert
		var done = assert.async();
		oPrivateModel.bindProperty("/generic/controlProperties/" + oButton.getId() + "/enabled").attachChange(function(){
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton.getId() + "/enabled"), true, "Action button's enabled property correctly set to true.");
			// destroy
			oButton.destroy();
			done();
		})
		
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

	});

	QUnit.test("action-for, applicable-path false, one context selected", function(assert) {
		var oButton = new sap.m.Button();
		oButton.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton.getId() + "/enabled}");

		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Action: "Action1"
			}
		];

		var oContext = {
			getPath: function() {
				return false;
			},
			isTransient: function() {
				return false;
			}
		};
		aContexts = [oContext];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;

		mFunctionImport["sap:action-for"] = "functionImport";
		mFunctionImport["sap:applicable-path"] = "entityProperty";

		// initialize the private model with the button id
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton.getId(), { enabled : undefined });

		// setting the property might happen asynchronous or synchronous - so attach the event handler (including the assertion) before calling the method actually triggering the change
		// assert
		var done = assert.async();
		oPrivateModel.bindProperty("/generic/controlProperties/" + oButton.getId() + "/enabled").attachChange(function(){
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton.getId() + "/enabled"), false, "Action button's enabled property correctly set to false.");
			// destroy
			oButton.destroy();
			done();
		})
		
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

	});

	QUnit.test("no action-for defined, applicable-path false, one context selected", function(assert) {
		var oButton = new sap.m.Button();
		oButton.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton.getId() + "/enabled}");

		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Action: "Action1"
			}
		];

		var oContext = {
			getPath: function() {
				return false;
			},
			isTransient: function() {
				return false;
			}
		};
		aContexts = [oContext];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;

		mFunctionImport["sap:action-for"] = undefined;
		mFunctionImport["sap:applicable-path"] = "entityProperty";

		// initialize the private model with the button id
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton.getId(), { enabled : undefined });

		// setting the property might happen asynchronous or synchronous - so attach the event handler (including the assertion) before calling the method actually triggering the change
		// assert
		var done = assert.async();
		oPrivateModel.bindProperty("/generic/controlProperties/" + oButton.getId() + "/enabled").attachChange(function(){
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton.getId() + "/enabled"), true, "Action button's enabled property correctly set to true.");
			// destroy
			oButton.destroy();
			done();
		})
		
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

	});

	QUnit.test("action-for defined, one applicable-path true, one applicable-path false, two contexts selected", function(assert) {
		var oButton1 = new sap.m.Button();
		oButton1.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton1.getId() + "/enabled}");

		var oButton2 = new sap.m.Button();
		oButton2.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton2.getId() + "/enabled}");

		aToolbarCustomData = [
			{
				ID: oButton1.getId(),
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Action: "Action1"
			}, {
				ID: oButton2.getId(),
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Action: "Action1"
			}
		];

		var oContext1 = {
			getPath: function() {
				return false;
			},
			isTransient: function() {
				return false;
			}
		};
		var oContext2 = {
			getPath: function() {
				return true;
			},
			isTransient: function() {
				return false;
			}
		};
		aContexts = [oContext1, oContext2];
		oToolbarContent = {};
		oToolbarContent[oButton1.getId()] = oButton1;
		oToolbarContent[oButton2.getId()] = oButton2;

		mFunctionImport["sap:action-for"] = "functionImport";
		mFunctionImport["sap:applicable-path"] = "entityProperty";

		// initialize the private model with the button id
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton1.getId(), { enabled : undefined });
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton2.getId(), { enabled : undefined });

		// setting the property might happen asynchronous or synchronous - so attach the event handler before calling the method actually triggering the change
		var oPromise1 = new Promise(function(resolve){
			oPrivateModel.bindProperty("/generic/controlProperties/" + oButton1.getId() + "/enabled").attachChange(resolve);
		})
		var oPromise2 = new Promise(function(resolve){
			oPrivateModel.bindProperty("/generic/controlProperties/" + oButton2.getId() + "/enabled").attachChange(resolve);
		})
		
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

		var done = assert.async();
		Promise.all([oPromise1, oPromise2]).then(function(){
			// assert
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton1.getId() + "/enabled"), true, "Action button's enabled property correctly set to true.");
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton2.getId() + "/enabled"), true, "Action button's enabled property correctly set to true.");
	
			// destroy
			oButton1.destroy();
			oButton2.destroy();
			
			done();
		})
	});

	QUnit.test("action-for defined, two applicable-path false, two context selected", function(assert) {
		var oButton1 = new sap.m.Button();
		oButton1.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton1.getId() + "/enabled}");

		var oButton2 = new sap.m.Button();
		oButton2.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton2.getId() + "/enabled}");

		aToolbarCustomData = [
			{
				ID: oButton1.getId(),
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Action: "Action1"
			}, {
				ID: oButton2.getId(),
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Action: "Action1"
			}
		];

		var oContext1 = {
			getPath: function() {
				return false;
			},
			isTransient: function() {
				return false;
			}
		};
		var oContext2 = {
			getPath: function() {
				return false;
			},
			isTransient: function() {
				return false;
			}
		};
		aContexts = [oContext1, oContext2];
		oToolbarContent = {};
		oToolbarContent[oButton1.getId()] = oButton1;
		oToolbarContent[oButton2.getId()] = oButton2;

		mFunctionImport["sap:action-for"] = "functionImport";
		mFunctionImport["sap:applicable-path"] = "entityProperty";

		// initialize the private model with the button id
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton1.getId(), { enabled : undefined });
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton2.getId(), { enabled : undefined });

		// setting the property might happen asynchronous or synchronous - so attach the event handler before calling the method actually triggering the change
		var oPromise1 = new Promise(function(resolve){
			oPrivateModel.bindProperty("/generic/controlProperties/" + oButton1.getId() + "/enabled").attachChange(resolve);
		})
		var oPromise2 = new Promise(function(resolve){
			oPrivateModel.bindProperty("/generic/controlProperties/" + oButton2.getId() + "/enabled").attachChange(resolve);
		})
		
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

		var done = assert.async();
		Promise.all([oPromise1, oPromise2]).then(function(){
			// assert
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton1.getId() + "/enabled"), false, "Action button's enabled property correctly set to false.");
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton2.getId() + "/enabled"), false, "Action button's enabled property correctly set to false.");
	
			// destroy
			oButton1.destroy();
			oButton2.destroy();
			
			done();
		});
	});

	QUnit.test("action-for defined, two applicable-path true, two context selected", function(assert) {
		var oButton1 = new sap.m.Button();
		oButton1.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton1.getId() + "/enabled}");

		var oButton2 = new sap.m.Button();
		oButton2.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton2.getId() + "/enabled}");

		aToolbarCustomData = [
			{
				ID: oButton1.getId(),
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Action: "Action1"
			}, {
				ID: oButton2.getId(),
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				Action: "Action1"
			}
		];

		var oContext1 = {
			getPath: function() {
				return true;
			},
			isTransient: function() {
				return false;
			}
		};
		var oContext2 = {
			getPath: function() {
				return true;
			},
			isTransient: function() {
				return false;
			}
		};
		aContexts = [oContext1, oContext2];
		oToolbarContent = {};
		oToolbarContent[oButton1.getId()] = oButton1;
		oToolbarContent[oButton2.getId()] = oButton2;

		mFunctionImport["sap:action-for"] = "functionImport";
		mFunctionImport["sap:applicable-path"] = "entityProperty";

		// initialize the private model with the button id
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton1.getId(), { enabled : undefined });
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton2.getId(), { enabled : undefined });

		// setting the property might happen asynchronous or synchronous - so attach the event handler before calling the method actually triggering the change
		var oPromise1 = new Promise(function(resolve){
			oPrivateModel.bindProperty("/generic/controlProperties/" + oButton1.getId() + "/enabled").attachChange(resolve);
		})
		var oPromise2 = new Promise(function(resolve){
			oPrivateModel.bindProperty("/generic/controlProperties/" + oButton2.getId() + "/enabled").attachChange(resolve);
		})
		
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

		var done = assert.async();
		Promise.all([oPromise1, oPromise2]).then(function(){
			// assert
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton1.getId() + "/enabled"), true, "Action button's enabled property correctly set to true.");
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton2.getId() + "/enabled"), true, "Action button's enabled property correctly set to true.");
	
			// destroy
			oButton1.destroy();
			oButton2.destroy();
			
			done();
		});
	});

	/* delete button test module */
	QUnit.module("lib.CommonUtils.setEnabledToolbarButtons - Delete Button", {
		beforeEach: function () {
			fnCommonBeforeEach();
		},
		afterEach: fnCommonAfterEach
	});

	QUnit.test("nothing is selected", function(assert) {
		var oButton = new sap.m.Button();
		oButton.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton.getId() + "/enabled}");
		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "CRUDActionDelete"
			}
		];
		aContexts = [];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;

		// set the deletable path
		oEntitySet["Org.OData.Capabilities.V1.DeleteRestrictions"]["Deletable"]["Path"] = "isDeletable";

		// initialize the private model with the button id
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton.getId(), { enabled : undefined });

		// setting the property might happen asynchronous or synchronous - so attach the event handler (including the assertion) before calling the method actually triggering the change
		// assert
		var done = assert.async();
		oPrivateModel.bindProperty("/generic/controlProperties/" + oButton.getId() + "/enabled").attachChange(function(){
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton.getId() + "/enabled"), false, "Delete button's enabled property correctly set to false.");
			// destroy
			oButton.destroy();
			done();
		})
		
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

	});

	QUnit.test("one item selected - item deletable", function(assert) {
		var oButton = new sap.m.Button();
		oButton.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton.getId() + "/enabled}");

		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "CRUDActionDelete"
			}
		];

		var oContext = {
			getPath: function() {
				return "isDeletable";
			},
			isTransient: function() {
				return false;
			},
			isInactive: function() {
				return false;
			}
		};
		aContexts = [oContext];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;

		// set the deletable path
		oEntitySet["Org.OData.Capabilities.V1.DeleteRestrictions"]["Deletable"]["Path"] = "isDeletable";

		// initialize the private model with the button id
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton.getId(), { enabled : undefined });

		// setting the property might happen asynchronous or synchronous - so attach the event handler (including the assertion) before calling the method actually triggering the change
		// assert
		var done = assert.async();
		oPrivateModel.bindProperty("/generic/controlProperties/" + oButton.getId() + "/enabled").attachChange(function(){
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton.getId() + "/enabled"), true, "Delete button's enabled property correctly set to true.");
			// destroy
			oButton.destroy();
			done();
		})
		
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

	});

	QUnit.test("one item selected - item not deletable", function(assert) {
		var oButton = new sap.m.Button();
		oButton.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton.getId() + "/enabled}");

		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "CRUDActionDelete"
			}
		];

		var oContext = {
			getPath: function() {
				return "isNotDeletable";
			},
			isTransient: function() {
				return false;
			},
			isInactive: function() {
				return false;
			}
		};
		aContexts = [oContext];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;

		// set the deletable path
		oEntitySet["Org.OData.Capabilities.V1.DeleteRestrictions"]["Deletable"]["Path"] = "isNotDeletable";

		// initialize the private model with the button id
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton.getId(), { enabled : undefined });

		// setting the property might happen asynchronous or synchronous - so attach the event handler (including the assertion) before calling the method actually triggering the change
		// assert
		var done = assert.async();
		oPrivateModel.bindProperty("/generic/controlProperties/" + oButton.getId() + "/enabled").attachChange(function(){
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton.getId() + "/enabled"), false, "Delete button's enabled property correctly set to false.");
			// destroy
			oButton.destroy();
			done();
		})
		
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

	});

	QUnit.test("two items selected - one not deletable, one deletable", function(assert) {
		var oButton = new sap.m.Button();
		oButton.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton.getId() + "/enabled}");

		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "CRUDActionDelete"
			}
		];

		var oContext1 = {
			getPath: function() {
				return "isNotDeletable";
			},
			isTransient: function() {
				return false;
			},
			isInactive: function() {
				return false;
			}
		};
		var oContext2 = {
			getPath: function() {
				return "isDeletable";
			},
			isTransient: function() {
				return false;
			},
			isInactive: function() {
				return false;
			}
		};
		aContexts = [oContext1, oContext2];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;

		// set the deletable path
		oEntitySet["Org.OData.Capabilities.V1.DeleteRestrictions"]["Deletable"]["Path"] = "isNotDeletable";

		// initialize the private model with the button id
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton.getId(), { enabled : undefined });

		// setting the property might happen asynchronous or synchronous - so attach the event handler (including the assertion) before calling the method actually triggering the change
		// assert
		var done = assert.async();
		oPrivateModel.bindProperty("/generic/controlProperties/" + oButton.getId() + "/enabled").attachChange(function(){
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton.getId() + "/enabled"), true, "Delete button's enabled property correctly set to true.");
			// destroy
			oButton.destroy();
			done();
		})

		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

	});

	QUnit.test("two items selected - both not deletable", function(assert) {
		var oButton = new sap.m.Button();
		oButton.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton.getId() + "/enabled}");

		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "CRUDActionDelete"
			}
		];

		var oContext1 = {
			getPath: function() {
				return "isNotDeletable";
			},
			isTransient: function() {
				return false;
			},
			isInactive: function() {
				return false;
			}
		};
		var oContext2 = {
			getPath: function() {
				return "isNotDeletable";
			},
			isTransient: function() {
				return false;
			},
			isInactive: function() {
				return false;
			}
		};
		aContexts = [oContext1, oContext2];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;

		// set the deletable path
		oEntitySet["Org.OData.Capabilities.V1.DeleteRestrictions"]["Deletable"]["Path"] = "isNotDeletable";

		// initialize the private model with the button id
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton.getId(), { enabled : undefined });

		// setting the property might happen asynchronous or synchronous - so attach the event handler (including the assertion) before calling the method actually triggering the change
		// assert
		var done = assert.async();
		oPrivateModel.bindProperty("/generic/controlProperties/" + oButton.getId() + "/enabled").attachChange(function(){
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton.getId() + "/enabled"), false, "Delete button's enabled property correctly set to false.");
			// destroy
			oButton.destroy();
			done();
		})
		
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

	});

	QUnit.test("two items selected - both deletable", function(assert) {
		var oButton = new sap.m.Button();
		oButton.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton.getId() + "/enabled}");

		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "CRUDActionDelete"
			}
		];

		var oContext1 = {
			getPath: function() {
				return "isDeletable";
			},
			isTransient: function() {
				return false;
			},
			isInactive: function() {
				return false;
			}
		};
		var oContext2 = {
			getPath: function() {
				return "isDeletable";
			},
			isTransient: function() {
				return false;
			},
			isInactive: function() {
				return false;
			}
		};
		aContexts = [oContext1, oContext2];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;

		// set the deletable path
		oEntitySet["Org.OData.Capabilities.V1.DeleteRestrictions"]["Deletable"]["Path"] = "isNotDeletable";

		// initialize the private model with the button id
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton.getId(), { enabled : undefined });

		// setting the property might happen asynchronous or synchronous - so attach the event handler (including the assertion) before calling the method actually triggering the change
		// assert
		var done = assert.async();
		oPrivateModel.bindProperty("/generic/controlProperties/" + oButton.getId() + "/enabled").attachChange(function(){
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton.getId() + "/enabled"), true, "Delete button's enabled property correctly set to true.");
			// destroy
			oButton.destroy();
			done();
		})
		
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

	});

	QUnit.test("three items selected - one deletable, two not deletable", function(assert) {
		var oButton = new sap.m.Button();
		oButton.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton.getId() + "/enabled}");

		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "CRUDActionDelete"
			}
		];

		var oContext1 = {
			getPath: function() {
				return "isNotDeletable";
			},
			isTransient: function() {
				return false;
			},
			isInactive: function() {
				return false;
			}
		};
		var oContext2 = {
			getPath: function() {
				return "isNotDeletable";
			},
			isTransient: function() {
				return false;
			},
			isInactive: function() {
				return false;
			}
		};
		var oContext3 = {
			getPath: function() {
				return "isDeletable";
			},
			isTransient: function() {
				return false;
			},
			isInactive: function() {
				return false;
			}
		};
		aContexts = [oContext1, oContext2, oContext3];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;

		// set the deletable path
		oEntitySet["Org.OData.Capabilities.V1.DeleteRestrictions"]["Deletable"]["Path"] = "isNotDeletable";

		// initialize the private model with the button id
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton.getId(), { enabled : undefined });

		// setting the property might happen asynchronous or synchronous - so attach the event handler (including the assertion) before calling the method actually triggering the change
		// assert
		var done = assert.async();
		oPrivateModel.bindProperty("/generic/controlProperties/" + oButton.getId() + "/enabled").attachChange(function(){
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton.getId() + "/enabled"), true, "Delete button's enabled property correctly set to true.");
			// destroy
			oButton.destroy();
			done();
		})
		
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

	});

	QUnit.test("three items selected - all not deletable", function(assert) {
		var oButton = new sap.m.Button();
		oButton.bindProperty("enabled", "{_templPriv>/generic/controlProperties/" + oButton.getId() + "/enabled}");

		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "CRUDActionDelete"
			}
		];

		var oContext1 = {
			getPath: function() {
				return "isNotDeletable";
			},
			isTransient: function() {
				return false;
			},
			isInactive: function() {
				return false;
			}
		};
		var oContext2 = {
			getPath: function() {
				return "isNotDeletable";
			},
			isTransient: function() {
				return false;
			},
			isInactive: function() {
				return false;
			}
		};
		var oContext3 = {
			getPath: function() {
				return "isDeletable";
			},
			isTransient: function() {
				return true;
			},
			isInactive: function() {
				return true;
			}
		};
		aContexts = [oContext1, oContext2, oContext3];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;

		// set the deletable path
		oEntitySet["Org.OData.Capabilities.V1.DeleteRestrictions"]["Deletable"]["Path"] = "isNotDeletable";

		// initialize the private model with the button id
		oPrivateModel.setProperty("/generic/controlProperties/" + oButton.getId(), { enabled : undefined });

		// setting the property might happen asynchronous or synchronous - so attach the event handler (including the assertion) before calling the method actually triggering the change
		// assert
		var done = assert.async();
		oPrivateModel.bindProperty("/generic/controlProperties/" + oButton.getId() + "/enabled").attachChange(function(){
			assert.strictEqual(oPrivateModel.getProperty("/generic/controlProperties/" + oButton.getId() + "/enabled"), false, "Delete button's enabled property correctly set to false.");
			// destroy
			oButton.destroy();
			done();
		})
		
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);

	});

	QUnit.module("lib.CommonUtils.setEnabledToolbarButtons - Multi Edit Button", {
		beforeEach: function () {
			fnCommonBeforeEach();
			sandbox.stub(oDataModelHelper, "analyseContext", function() {
				return {
					entitySet: ""
				};
			});
		},
		afterEach: fnCommonAfterEach
	});

	QUnit.test("nothing is selected", function (assert) {
		var oButton = new sap.m.Button();
		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "CRUDActionMultiEdit"
			}
		];
		aContexts = [];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;
	
		// set the Updatable path
		oEntitySet["Org.OData.Capabilities.V1.UpdateRestrictions"]["Updatable"]["Path"] = "isUpdatable";
	
		// initialize the private model with the button id
		oPrivateModel.setProperty("/listReport/", { multiEditEnabled : undefined });
	
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);
		assert.strictEqual(oPrivateModel.getProperty("/listReport/multiEditEnabled"), false, "Multi Edit button's enabled property correctly set to false.");
	});
	
	QUnit.test("one active item selected - item updatable", function (assert) {
		var oButton = new sap.m.Button();
		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "CRUDActionMultiEdit"
			}
		];
		var oContext = {
			getPath: function () {
				return "isUpdatable";
			},
			getModel: function() {
				return oModel;
			},
			isTransient: function() {
				return false;
			}
		};
		aContexts = [oContext];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;
		// set the Updatable path
		oEntitySet["Org.OData.Capabilities.V1.UpdateRestrictions"]["Updatable"]["Path"] = "isUpdatable";
	
		// initialize the private model with the button id
		oPrivateModel.setProperty("/listReport/", { multiEditEnabled : undefined });
	
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);
		assert.strictEqual(oPrivateModel.getProperty("/listReport/multiEditEnabled"), true, "Multi Edit button's enabled property correctly set to true.");
	});
	
	QUnit.test("one active item selected - item not updatable", function (assert) {
        var oButton = new sap.m.Button();
        aToolbarCustomData = [
            {
                ID: oButton.getId(),
                RecordType: "CRUDActionMultiEdit"
            }
        ];
        // OP is open in edit mode
        var oServices = {
            oApplication: {
                getBusyHelper: function() {
                    return {
                        isBusy: function() {
                            return false;
                        },
                        setBusy: Function.prototype
                    };
                },
                isObjectInEditMode: function() {
                    return true;
                }
            },
            oPresentationControlHandlerFactory: {
                getPresentationControlHandler: function() {
                    return {
                        getSelectedContexts: function() {
                            return aContexts;
                        }
                    }
                }
            }
        };
        var oContext = {
            getPath: function () {
                return "isUpdatable";
            },
            getModel: function() {
                return oModel;
            },
			isTransient: function() {
				return false;
			}
        };
        aContexts = [oContext];
        oToolbarContent = {};
        oToolbarContent[oButton.getId()] = oButton;
        // set the Updatable path
        oEntitySet["Org.OData.Capabilities.V1.UpdateRestrictions"]["Updatable"]["Path"] = "isUpdatable";

		// initialize the private model with the button id
        oPrivateModel.setProperty("/listReport/", { multiEditEnabled : undefined });

        // call the function in test
        oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
        oCommonUtils.setEnabledToolbarButtons(oControl);
        assert.strictEqual(oPrivateModel.getProperty("/listReport/multiEditEnabled"), false, "Multi Edit button's enabled property correctly set to false when OP is open in edit mode.");
    });

	QUnit.test("one active item selected - item not updatable", function (assert) {
		var oButton = new sap.m.Button();
		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "CRUDActionMultiEdit"
			}
		];
		var oContext = {
			getPath: function () {
				return "isNotUpdatable";
			},
			getModel: function() {
				return oModel;
			},
			isTransient: function() {
				return false;
			}
		};
		aContexts = [oContext];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;
		// set the Updatable path
		oEntitySet["Org.OData.Capabilities.V1.UpdateRestrictions"]["Updatable"]["Path"] = "isUpdatable";
	
		// initialize the private model with the button id
		oPrivateModel.setProperty("/listReport/", { multiEditEnabled : undefined });
	
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);
		assert.strictEqual(oPrivateModel.getProperty("/listReport/multiEditEnabled"), false, "Multi Edit button's enabled property correctly set to false.");
	});
	
	QUnit.test("two active items selected - one not updatable, one updatable", function (assert) {
		var oButton = new sap.m.Button();
		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "CRUDActionMultiEdit"
			}
		];
	
		var oContext1 = {
			getPath: function () {
				return "isNotUpdatable";
			},
			getModel: function() {
				return oModel;
			},
			isTransient: function() {
				return false;
			}
		};
		var oContext2 = {
			getPath: function () {
				return "isUpdatable";
			},
			getModel: function() {
				return oModel;
			},
			isTransient: function() {
				return false;
			}
		};
		aContexts = [oContext1, oContext2];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;
		// set the Updatable path
		oEntitySet["Org.OData.Capabilities.V1.UpdateRestrictions"]["Updatable"]["Path"] = "isUpdatable";
	
		// initialize the private model with the button id
		oPrivateModel.setProperty("/listReport/", { multiEditEnabled : undefined });
	
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);
		assert.strictEqual(oPrivateModel.getProperty("/listReport/multiEditEnabled"), true, "Multi Edit button's enabled property correctly set to true.");
	});
	
	QUnit.test("two active items selected - both not updatable", function (assert) {
		var oButton = new sap.m.Button();
		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "CRUDActionMultiEdit"
			}
		];
		var oContext1 = {
			getPath: function () {
				return "isNotUpdatable";
			},
			getModel: function() {
				return oModel;
			},
			isTransient: function() {
				return false;
			}
		};
		var oContext2 = {
			getPath: function () {
				return "isNotUpdatable";
			},
			getModel: function() {
				return oModel;
			},
			isTransient: function() {
				return false;
			}
		};
		aContexts = [oContext1, oContext2];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;
		// set the Updatable path
		oEntitySet["Org.OData.Capabilities.V1.UpdateRestrictions"]["Updatable"]["Path"] = "isUpdatable";
	
		// initialize the private model with the button id
		oPrivateModel.setProperty("/listReport/", { multiEditEnabled : undefined });
	
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);
		assert.strictEqual(oPrivateModel.getProperty("/listReport/multiEditEnabled"), false, "Multi Edit button's enabled property correctly set to false.");
	});
	
	QUnit.test("two active items selected - both updatable", function (assert) {
		var oButton = new sap.m.Button();
		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "CRUDActionMultiEdit"
			}
		];
		var oContext1 = {
			getPath: function () {
				return "isUpdatable";
			},
			getModel: function() {
				return oModel;
			},
			isTransient: function() {
				return false;
			}
		};
		var oContext2 = {
			getPath: function () {
				return "isUpdatable";
			},
			getModel: function() {
				return oModel;
			},
			isTransient: function() {
				return false;
			}
		};
		aContexts = [oContext1, oContext2];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;
		// set the Updatable path
		oEntitySet["Org.OData.Capabilities.V1.UpdateRestrictions"]["Updatable"]["Path"] = "isUpdatable";
	
		// initialize the private model with the button id
		oPrivateModel.setProperty("/listReport/", { multiEditEnabled : undefined });
	
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);
		assert.strictEqual(oPrivateModel.getProperty("/listReport/multiEditEnabled"), true, "Multi Edit button's enabled property correctly set to true.");
	});
	
	QUnit.test("one draft item selected - item updatable", function (assert) {
		var oButton = new sap.m.Button();
		aToolbarCustomData = [
			{
				ID: oButton.getId(),
				RecordType: "CRUDActionMultiEdit"
			}
		];
		var oContext = {
			getPath: function () {
				return "isUpdatable";
			},
			getModel: function() {
				return oModel;
			},
			isTransient: function() {
				return false;
			}
		};
		aContexts = [oContext];
		oToolbarContent = {};
		oToolbarContent[oButton.getId()] = oButton;
		sDraftAdministrativeData = {"DraftIsCreatedByMe": true};
		// set the Updatable path
		oEntitySet["Org.OData.Capabilities.V1.UpdateRestrictions"]["Updatable"]["Path"] = "isUpdatable";
	
		// initialize the private model with the button id
		oPrivateModel.setProperty("/listReport/", { multiEditEnabled : undefined });
	
		// call the function in test
		oCommonUtils.setEnabledToolbarButtons(oControl);
		assert.strictEqual(oPrivateModel.getProperty("/listReport/multiEditEnabled"), false, "Multi Edit button's enabled property correctly set to false.");
	});	
});
