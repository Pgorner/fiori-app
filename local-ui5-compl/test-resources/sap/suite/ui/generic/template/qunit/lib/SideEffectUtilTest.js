/**
 * tests for the sap.suite.ui.generic.template.lib.SideEffectUtil
 */

sap.ui.define([
	"sap/suite/ui/generic/template/lib/SideEffectUtil",
	"sap/base/util/deepExtend"
], function(SideEffectUtil, deepExtend) {
	"use strict";

	var oTemplateUtils = {
		oCommonUtils: {
			isDraftEnabled : function(){
				return true;
			}
		}
	};
	var oMainEntitySet = {
		entityType: "Service.MainEntityType",
		type:"oMainEntityType",
		entitySet:"MainEntitySet",
	};
	var oMainEntityType = {
		property: [{
			name: "property1" // Sinlge and Multi source 
		},{
			name: "property2" // Only Multi Source (Side effect should not be triggered)
		}, {
			name: "property3" // Onyl Single Source
		}],
		"com.sap.vocabularies.Common.v1.SideEffects#1": {
			SourceProperties: [{
				PropertyPath: "property1"
			}]
		},
		"com.sap.vocabularies.Common.v1.SideEffects#2": {
			SourceProperties: [{
				PropertyPath: "property1"
			}, {
				PropertyPath: "property2"
			}]
		},
		"com.sap.vocabularies.Common.v1.SideEffects#3": {
			SourceProperties: [{
				PropertyPath: "property3"
			}]
		}
	};
	var oMetaModel = {
		getODataEntitySet: function(sEntitySet) {
			switch(sEntitySet) {
				case "MainEntitySet":
					return oMainEntitySet;
			}
		},
		getODataEntityType: function(sEntityType) {
			switch(sEntityType) {
				case "Service.MainEntityType":
					return oMainEntityType;
			}
		}
	};

	QUnit.module("The function trigger side effect utils");

	QUnit.test("1:1 associated smartfield should be assigned with fieldGroupIds", function(assert) {
		var oComputedMetaData = {
			navigationPath: "DummyNavigationPath"
		};
		var aIDs = ["DummyID"];
		var fnResolve;
		var oComputedMetaDataAsync = new Promise(function(resolve) {
			fnResolve = resolve;
		});
		var oSmartField = {
			_getComputedMetadata: function() {
				return oComputedMetaDataAsync;
			},
			_calculateFieldGroupIDs: function() {
				return aIDs;
			},
			getBindingContext: function() {
				return {};
			},
			_setInternalFieldGroupIds: function(aIds) {
			}
		};
		// var oEvent = {
		// 	getParameter: function() {
		// 		return true;
		// 	},
		// 	getSource: function() {
		// 		return oSmartField;
		// 	}
		// };
		var oFieldGroupIDsSpy = sinon.spy(oSmartField, "_setInternalFieldGroupIds");
		var done = assert.async();

		SideEffectUtil.assignFieldGroupIds(oSmartField, oMetaModel, "MainEntitySet");
		fnResolve(oComputedMetaData);

		oComputedMetaDataAsync.then(function() {
			assert.equal(oFieldGroupIDsSpy.calledWith(aIDs), true, "smartfield's _setInternalFieldGroupIds method has been called with the expected argument");
			done();
		});
	});




	/**
	 * The side effect logic for value help fields is different for the fields inside smart table and smart form.
	 * Tests for calculation of side effect source type are available in the metadataAnalyserTest
	 * 
	 */
	QUnit.test("Side effect should be triggered on value selection - SmartForm- single source property case", function (assert) {
		
		var aSmartFormFieldGroupId = ["aSmartFormFieldGroupId"] , bIsSideEffectTypeComputed = true; // true for fields rendered inside the smart form
		var oSmartField = {
			getCustomData: function () {
				return [{
					getKey: function () {
						return "SideEffectSourcePropertyType";
					},
					getValue: function () {
						return "OnlySingleSource";
					}
				}];
			},
			getInnerControls : function() {
				return [{
					getFieldGroupIds: function () {
						return aSmartFormFieldGroupId;
					}
				}];
			},
			triggerValidateFieldGroup : function (aIDs) {
				return true;
			}
		};
		var oEvent = {
			getSource: function () {
				return oSmartField;
			},
			getParameter : function() {
				return;
			}
		};
		var oTriggerValidateFieldGroupSpy = sinon.spy(oSmartField, "triggerValidateFieldGroup");
		SideEffectUtil.handleSideEffectForField(oEvent, oTemplateUtils.oCommonUtils, bIsSideEffectTypeComputed);
		assert.equal(oTriggerValidateFieldGroupSpy.calledWith(aSmartFormFieldGroupId), true, "smartfield's triggerValidateFieldGroup method has been called with the expected argument");
	});

	QUnit.test("Side effect should be triggered on value selection - SmartForm- Single and Multi source property case", function (assert) {
		var fnResolve, sMainEntityType = "MainEntityType", aSmartFormFieldGroupId = ["aSmartFormFieldGroupId"];
		var oComputedMetaDataAsync = new Promise(function(resolve) {
			fnResolve = resolve;
		});
		var oComputedMetaData = {
			path: "property2",
			entityType : {
				namespace : "Service",
				name: sMainEntityType
			}
		};
		var aSmartFormFieldGroupId = ["aSmartFormFieldGroupId"] , bIsSideEffectTypeComputed = true; // true for fields rendered inside the smart form
		var oSmartField = {
			getCustomData: function () {
				return [{
					getKey: function () {
						return "SideEffectSourcePropertyType";
					},
					getValue: function () {
						return "SingleAndMultipleSource";
					}
				}];
			},
			getModel : function() {
				return {
					getMetaModel : function () {
						return oMetaModel;
					}
				}
			},
			_getComputedMetadata: function() {
				return oComputedMetaDataAsync;
			},
			getInnerControls : function() {
				return [{
					getFieldGroupIds: function () {
						return aSmartFormFieldGroupId;
					}
				}];
			},
			_calculateFieldGroupIDs: function() {
				return aSmartFormFieldGroupId;
			},
			triggerValidateFieldGroup : function (aIDs) {
				return true;
			}
		};
		var oEvent = {
			getSource: function () {
				return oSmartField;
			},
			getParameter : function() {
				return;
			}
		};

		var oEntityType = oSmartField.getModel().getMetaModel().getODataEntityType("Service."+ sMainEntityType);
		oComputedMetaData.entityType = deepExtend(oComputedMetaData.entityType, oEntityType); // Since the sideeffect annotations are available globally reuse the same

		var oTriggerValidateFieldGroupSpy = sinon.spy(oSmartField, "triggerValidateFieldGroup");
		var done = assert.async();
		SideEffectUtil.handleSideEffectForField(oEvent, oTemplateUtils.oCommonUtils, bIsSideEffectTypeComputed);
		fnResolve(oComputedMetaData);

		oComputedMetaDataAsync.then(function() {
			assert.equal(oTriggerValidateFieldGroupSpy.calledWith(aSmartFormFieldGroupId), true, "smartfield's triggerValidateFieldGroup method has been called with the expected argument");
			done();
		});
	});

	QUnit.test("Side effect should be triggered on value selection - SmartTable - single source property case", function (assert) {
		
		var aSmartTableFieldGroupId = ["aSmartTableFieldGroupId"], bIsSideEffectTypeComputed = false; // false for smart field rendered inside smart table
		var fnResolve, oComputedMetaData = {
			path: "property3",
			entityType : {
				namespace : "Service",
				name: "MainEntityType"
			}
		};
		var oComputedMetaDataAsync = new Promise(function(resolve) {
			fnResolve = resolve;
		});
		var oSmartField = {
			getInnerControls : function() {
				return [{
					getFieldGroupIds: function () {
						return aSmartTableFieldGroupId;
					}
				}];
			},
			getModel : function() {
				return {
					getMetaModel : function () {
						return oMetaModel;
					}
				}
			},
			triggerValidateFieldGroup : function (aIDs) {
				return true;
			},
			_getComputedMetadata: function() {
				return oComputedMetaDataAsync;
			},
			_calculateFieldGroupIDs: function() {
				return aSmartTableFieldGroupId;
			},
			getBindingContext: function() {
				return {};
			},
			setFieldGroupIds: Function.prototype
		};
		var oEvent = {
			getSource: function () {
				return oSmartField;
			},
			getParameter : function() {
				return;
			}
		};

		var oTriggerValidateFieldGroupSpy = sinon.spy(oSmartField, "triggerValidateFieldGroup");
		var oCalculateFieldGroupID = sinon.spy(oSmartField, "_calculateFieldGroupIDs");
		var done = assert.async();
		SideEffectUtil.handleSideEffectForField(oEvent, oTemplateUtils.oCommonUtils, bIsSideEffectTypeComputed);
		fnResolve(oComputedMetaData);

		oComputedMetaDataAsync.then(function() {
			assert.equal(oCalculateFieldGroupID.calledOnce, false, "smartfield's _calculateFieldGroupIDs method is not called as expected");
			assert.equal(oTriggerValidateFieldGroupSpy.calledWith(aSmartTableFieldGroupId), true, "smartfield's triggerValidateFieldGroup method has been called with the expected argument");
			done();
		});
	});
	QUnit.test("Side effect should be triggered on value selection - SmartTable - single and Multi source property case", function (assert) {
		
		var aSmartTableFieldGroupId = ["aSmartTableFieldGroupId"], bIsSideEffectTypeComputed = false; // false for smart field rendered inside smart table
		var fnResolve, oComputedMetaData = {
			path: "property1",
			entityType : {
				namespace : "Service",
				name: "MainEntityType"
			}
		};
		var oComputedMetaDataAsync = new Promise(function(resolve) {
			fnResolve = resolve;
		});
		var oSmartField = {
			getInnerControls : function() {
				return [{
					getFieldGroupIds: function () {
						return aSmartTableFieldGroupId;
					}
				}];
			},
			getModel : function() {
				return {
					getMetaModel : function () {
						return oMetaModel;
					}
				}
			},
			triggerValidateFieldGroup : function (aIDs) {
				return true;
			},
			_getComputedMetadata: function() {
				return oComputedMetaDataAsync;
			},
			_calculateFieldGroupIDs: function() {
				return aSmartTableFieldGroupId;
			},
			getBindingContext: function() {
				return {};
			},
			setFieldGroupIds: Function.prototype
		};
		var oEvent = {
			getSource: function () {
				return oSmartField;
			},
			getParameter : function() {
				return;
			}
		};

		var oTriggerValidateFieldGroupSpy = sinon.spy(oSmartField, "triggerValidateFieldGroup");
		var oCalculateFieldGroupID = sinon.spy(oSmartField, "_calculateFieldGroupIDs");
		var done = assert.async();
		SideEffectUtil.handleSideEffectForField(oEvent, oTemplateUtils.oCommonUtils, bIsSideEffectTypeComputed);
		fnResolve(oComputedMetaData);

		oComputedMetaDataAsync.then(function() {
			assert.equal(oCalculateFieldGroupID.calledOnce, true, "smartfield's _calculateFieldGroupIDs method is called as expected");
			assert.equal(oTriggerValidateFieldGroupSpy.calledWith(aSmartTableFieldGroupId), true, "smartfield's triggerValidateFieldGroup method has been called with the expected argument");
			done();
		});
	});
	QUnit.test("Side effect should not be triggered on value selection - SmartTable - Only Multi source property case", function (assert) {
		
		var aSmartTableFieldGroupId = ["aSmartTableFieldGroupId"], bIsSideEffectTypeComputed = false; // false for smart field rendered inside smart table
		var fnResolve, oComputedMetaData = {
			path: "property2",
			entityType : {
				namespace : "Service",
				name: "MainEntityType"
			}
		};
		var oComputedMetaDataAsync = new Promise(function(resolve) {
			fnResolve = resolve;
		});
		var oSmartField = {
			getInnerControls : function() {
				return [{
					getFieldGroupIds: function () {
						return aSmartTableFieldGroupId;
					}
				}];
			},
			getModel : function() {
				return {
					getMetaModel : function () {
						return oMetaModel;
					}
				}
			},
			triggerValidateFieldGroup : function (aIDs) {
				return true;
			},
			_getComputedMetadata: function() {
				return oComputedMetaDataAsync;
			},
			_calculateFieldGroupIDs: function() {
				return aSmartTableFieldGroupId;
			},
			getBindingContext: function() {
				return {};
			},
			setFieldGroupIds: Function.prototype
		};
		var oEvent = {
			getSource: function () {
				return oSmartField;
			},
			getParameter : function() {
				return;
			}
		};

		var oTriggerValidateFieldGroupSpy = sinon.spy(oSmartField, "triggerValidateFieldGroup");
		var oCalculateFieldGroupID = sinon.spy(oSmartField, "_calculateFieldGroupIDs");
		var done = assert.async();
		SideEffectUtil.handleSideEffectForField(oEvent, oTemplateUtils.oCommonUtils, bIsSideEffectTypeComputed);
		fnResolve(oComputedMetaData);

		oComputedMetaDataAsync.then(function() {
			assert.equal(oCalculateFieldGroupID.calledOnce, false, "smartfield's _calculateFieldGroupIDs method is not called as expected");
			assert.equal(oTriggerValidateFieldGroupSpy.calledOnce, false, "smartfield's triggerValidateFieldGroup method is not called as expected");
			done();
		});
	});

	QUnit.test("SideEffect properties generated using getPropsForLinkFields method should be correct", function(assert) {
		var sFieldName = "CompanyCode";
		var oEntitySet = {
			"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductType",
			"name": "STTA_C_MP_Product"
		};
		var oTargetForIBN = {
			"Value": {
				"Path": "ProductCategory"
			}
		};
		var oTargetForDFA = {
			"Target": {
				"AnnotationPath": "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact"
			}
		};
		assert.equal(SideEffectUtil.getPropsForLinkFields(oEntitySet, oTargetForIBN, sFieldName), '{"sEntitySetName":"STTA_C_MP_Product","sEntityTypeName":"STTA_PROD_MAN.STTA_C_MP_ProductType","sLinkProperty":"ProductCategory"}', "The properties generated for DataFieldWithIntentBasedNavigation link field should be correct");
		assert.equal(SideEffectUtil.getPropsForLinkFields(oEntitySet, oTargetForDFA, sFieldName), '{"sEntitySetName":"STTA_C_MP_Product","sEntityTypeName":"STTA_PROD_MAN.STTA_C_MP_ProductType","sLinkProperty":"to_Supplier/CompanyCode"}', "The properties generated for DataFieldForAnnotation link field should be correct");
	});
});
