/*global QUnit, sinon */
sap.ui.define([
    'sap/insights/utils/MetadataAnalyser',
	'sap/ui/model/json/JSONModel'
], function(MetadataAnalyser, JSONModel) {
	"use strict";
	var oMockedData = null;
	var oJsonModel = new JSONModel();
	var pMockedDataLoaded = oJsonModel.loadData(sap.ui.require.toUrl("test-resources/sap/insights/qunit/__mocks__/MetadataAnalyser.json")).then(function(){
		oMockedData = oJsonModel.getData();
	});
	QUnit.module("MetadataAnalyser test cases", {
		before: function() {
			// ensure that tests can safely access oMockedData
			return pMockedDataLoaded;
		},
		beforeEach: function () {
			this.oSandbox = sinon.sandbox.create();
            this.oMetadataAnalyser = MetadataAnalyser;
		},
		afterEach: function () {
			this.oSandbox.restore();
			this.oMetadataAnalyser = null;
		}
	});
    QUnit.test("getPropertyNamesOfEntitySet with valid values length", function(assert) {
        var sEntitySet = oMockedData.sEntitySet,
            oDataModel = oMockedData.oDataModel,
            oModel = {
                getMetaModel: function() {
                    return {
                        getODataEntitySet: function(sEntitySet) {
                            return {entityType: "SD_OVP_SM.C_SalesManagerSelectionResult"};
                        },
                        getODataEntityType: function() {return oDataModel;}
                    };
                }
            };
        var aPropertyNameArray = this.oMetadataAnalyser.getPropertyNamesOfEntitySet(oModel, sEntitySet);
        assert.equal(aPropertyNameArray.length, 2, "Length 2 received");
    });
    QUnit.test("getPropertyNamesOfEntitySet with no input to be an empty array", function(assert) {
        var aPropertyNameArray = this.oMetadataAnalyser.getPropertyNamesOfEntitySet();
        assert.equal(aPropertyNameArray.length, 0, "Empty array received");
    });
    QUnit.test("getParameterisedEntitySetByEntitySet with no input to be an empty array", function(assert) {
        var aPropertyNameArray = this.oMetadataAnalyser.getParameterisedEntitySetByEntitySet();
        assert.equal(aPropertyNameArray, null, "Null value received");
    });
    QUnit.test("getParameterisedEntitySetByEntitySet with navigationProperty as null to return null", function(assert) {
        var sEntitySet = oMockedData.sEntitySet,
            oDataModel = oMockedData.oDataModel,
            oModel = {
                getMetaModel: function() {
                    return {
                        getODataEntitySet: function(sEntitySet) {
                            return {entityType: "SD_OVP_SM.C_SalesManagerSelectionResult"};
                        },
                        getODataEntityType: function() {return oDataModel;}
                    };
                }
            };
        var oParamSet = this.oMetadataAnalyser.getParameterisedEntitySetByEntitySet(oModel, sEntitySet);
        assert.equal(oParamSet, null, "Empty object received");
    });
    QUnit.test("getParameterisedEntitySetByEntitySet to return null", function(assert) {
        var sEntitySet = oMockedData.sEntitySet,
            oDataModel = oMockedData.oDataModelNavigationNotNull,
            oModel = {
                getMetaModel: function() {
                    return {
                        getODataEntitySet: function(sEntitySet) {
                            return {entityType: "SD_OVP_SM.C_SalesManagerSelectionResult"};
                        },
                        getODataEntityType: function() {return oDataModel;},
                        getODataAssociationEnd: function() {
                            return {
                                type: 'Random'
                            };
                        }
                    };
                }
            };
        var oParamSet = this.oMetadataAnalyser.getParameterisedEntitySetByEntitySet(oModel, sEntitySet);
        assert.equal(oParamSet, null, "Null value received");
    });
    QUnit.test("isDate to return entity set", function(assert) {
        var sEntitySet = oMockedData.sEntitySet,
            sProperty = oMockedData.sProperty,
            oDataModel = oMockedData.oDataModel,
            oModel = {
                getMetaModel: function() {
                    return {
                        getODataEntitySet: function(sEntitySet) {
                            return {entityType: "SD_OVP_SM.C_SalesManagerSelectionResult"};
                        },
                        getODataEntityType: function() {return oDataModel;}
                    };
                }
            };
        var oParamSet = this.oMetadataAnalyser.isDate(oModel, sEntitySet, sProperty);
        assert.equal(oParamSet, false, "False value received");
    });
    QUnit.test("isValueListWithFixedValues to return entity set", function(assert) {
        var sEntitySet = oMockedData.sEntitySet,
            sProperty = oMockedData.sProperty,
            oDataModel = oMockedData.oDataModel,
            oModel = {
                getMetaModel: function() {
                    return {
                        getODataEntitySet: function(sEntitySet) {
                            return {entityType: "SD_OVP_SM.C_SalesManagerSelectionResult"};
                        },
                        getODataEntityType: function() {return oDataModel;}
                    };
                }
            };
        var oParamSet = this.oMetadataAnalyser.isValueListWithFixedValues(oModel, sEntitySet, sProperty);
        assert.equal(oParamSet, false, "Returned false");
    });
    QUnit.test("getPropertyFilterRestrictionByEntitySet to return true", function(assert) {
        var sEntitySet = oMockedData.sEntitySet,
            sProperty = "FldLogsActlDeliveredQuantity_fc",
            oDataModel = oMockedData.oDataModel,
            oModel = {
                getMetaModel: function() {
                    return {
                        getODataEntitySet: function(sEntitySet) {
                            return {entityType: "SD_OVP_SM.C_SalesManagerSelectionResult"};
                        },
                        getODataEntityType: function() {return oDataModel;}
                    };
                }
            };
        var oParamSet = this.oMetadataAnalyser.getPropertyFilterRestrictionByEntitySet(oModel, sEntitySet, sProperty);
        assert.equal(oParamSet, true, "Returned true");
    });
});