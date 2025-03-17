sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/suite/ui/generic/template/genericUtilities/filterHelper",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/genericUtilities/metadataAnalyser"
],function(sinon, Filter, FilterOperator, filterHelper, testableHelper, metadataAnalyser) {
	"use strict";

		var oSandbox;

		var oTestStub;
		// This is a simple sample implementation of getFilterInfoForPropertyFilters that
		// - only handles filter operator EQ
		// - treats all values as strings
		// - does not care for escaping special characters (e.g. ') in the value
		function getFilterInfoForPropertyFilters(assert, sProperty, aFiltersForProperty, sLogicalOperator){
			 if (aFiltersForProperty.length < 2){
				assert.strictEqual(aFiltersForProperty.length, 1, "Property filter must not be requested for empty array");
				assert.notOk(sLogicalOperator, "No logical operator must be provided for array of length 1");
			 } else {
				assert.ok(sLogicalOperator === "and" || sLogicalOperator === "or", "only logical operators 'and' and 'or' are allowed");
			 }
			 var sRet = aFiltersForProperty.map(function(oFilter){
				assert.strictEqual(oFilter.sPath, sProperty, "Only filters with path '" + sProperty + "' should have been passed");
				if (oFilter.sOperator === FilterOperator.EQ){
					return sProperty + "%20=%20'" + oFilter.oValue1 + "'";
				}
			 }).join("%20" + sLogicalOperator + "%20");
			 return {
				stringRep: sRet,
				logicalOperator: sLogicalOperator
			 };

		}
	
		QUnit.module("genericUtilities.filterHelper", {
			beforeEach : function() {
				testableHelper.startTest();
				oTestStub = testableHelper.getStaticStub();
				oSandbox = sinon.sandbox.create();
				getFilterInfoForPropertyFilters = oSandbox.spy(getFilterInfoForPropertyFilters);
			},
			afterEach : function() {
				oSandbox.restore();
				testableHelper.endTest();
			}
		}, function() {
			QUnit.test("Compute string representation for empty list of filters", function (assert) {
				var aFilters = [];
				var sStringRep = oTestStub.filterHelper_getFilterString(aFilters);
				assert.equal(sStringRep, "", "string representation must be correct");
				assert.ok(getFilterInfoForPropertyFilters.notCalled, "Callback must not have been called");
			});

			QUnit.test("Compute string representation for one atomic filter", function (assert) {
				var oFilter = new Filter({
					path: "myProperty",
					operator: FilterOperator.EQ,
					value1: "testValue",
				});
				var aFilters = [oFilter];
				var sStringRep = oTestStub.filterHelper_getFilterString(aFilters, getFilterInfoForPropertyFilters.bind(null, assert));
				assert.equal(sStringRep, "myProperty%20=%20'testValue'", "string representation must be correct");
				assert.equal(getFilterInfoForPropertyFilters.callCount, 1, "Callback must have been called once");
			});

			QUnit.test("Compute string representation for an array of two atomic filters", function (assert) {
				var oFilter1 = new Filter({
					path: "myProperty1",
					operator: FilterOperator.EQ,
					value1: "testValue1",
				});
				var oFilter2 = new Filter({
					path: "myProperty2",
					operator: FilterOperator.EQ,
					value1: "testValue2",
				});				
				var aFilters = [oFilter1, oFilter2];
				var sStringRep = oTestStub.filterHelper_getFilterString(aFilters, getFilterInfoForPropertyFilters.bind(null, assert));
				assert.equal(sStringRep, "myProperty1%20=%20'testValue1'%20and%20myProperty2%20=%20'testValue2'", "string representation must be correct");
				assert.equal(getFilterInfoForPropertyFilters.callCount, 2, "Callback must have been called twice");
			});
			
			QUnit.test("Compute string representation for a complex filter consisting of an array of two atomic filters", function (assert) {
				var oFilter1 = new Filter({
					path: "myProperty1",
					operator: FilterOperator.EQ,
					value1: "testValue1",
				});
				var oFilter2 = new Filter({
					path: "myProperty2",
					operator: FilterOperator.EQ,
					value1: "testValue2",
				});
				var oFilter = new Filter({
					filters: [oFilter1, oFilter2],
					and: true
				});			
				var aFilters = [oFilter];
				var sStringRep = oTestStub.filterHelper_getFilterString(aFilters, getFilterInfoForPropertyFilters.bind(null, assert));
				assert.equal(sStringRep, "myProperty1%20=%20'testValue1'%20and%20myProperty2%20=%20'testValue2'", "string representation must be correct");
				assert.equal(getFilterInfoForPropertyFilters.callCount, 2, "Callback must have been called twice");
			});					

			QUnit.test("Compute string representation for an array of two atomic filters pointing to the same property", function (assert) {
				var oFilter1 = new Filter({
					path: "myProperty",
					operator: FilterOperator.EQ,
					value1: "testValue1",
				});
				var oFilter2 = new Filter({
					path: "myProperty",
					operator: FilterOperator.EQ,
					value1: "testValue2",
				});		
				var aFilters = [oFilter1, oFilter2];
				var sStringRep = oTestStub.filterHelper_getFilterString(aFilters, getFilterInfoForPropertyFilters.bind(null, assert));
				assert.equal(sStringRep, "myProperty%20=%20'testValue1'%20and%20myProperty%20=%20'testValue2'", "string representation must be correct");
				assert.equal(getFilterInfoForPropertyFilters.callCount, 1, "Callback must have been called once");
			});	

			QUnit.test("Compute string representation for a complex filter consisting of an array of two atomic filters pointing to the same property", function (assert) {
				var oFilter1 = new Filter({
					path: "myProperty",
					operator: FilterOperator.EQ,
					value1: "testValue1",
				});
				var oFilter2 = new Filter({
					path: "myProperty",
					operator: FilterOperator.EQ,
					value1: "testValue2",
				});
				var oFilter = new Filter({
					filters: [oFilter1, oFilter2],
					and: true
				});			
				var aFilters = [oFilter];
				var sStringRep = oTestStub.filterHelper_getFilterString(aFilters, getFilterInfoForPropertyFilters.bind(null, assert));
				assert.equal(sStringRep, "myProperty%20=%20'testValue1'%20and%20myProperty%20=%20'testValue2'", "string representation must be correct");
				assert.equal(getFilterInfoForPropertyFilters.callCount, 1, "Callback must have been called once");
			});	

			QUnit.test("Compute string representation for a an array of filters, one atomic and one complex (all pointing to the same property)", function (assert) {
				var oFilter1 = new Filter({
					path: "myProperty",
					operator: FilterOperator.EQ,
					value1: "testValue1",
				});
				var oFilter2 = new Filter({
					path: "myProperty",
					operator: FilterOperator.EQ,
					value1: "testValue2",
				});
				var oFilter12 = new Filter({
					filters: [oFilter1, oFilter2],
					or: true
				});
				var oFilter3 = new Filter({
					path: "myProperty",
					operator: FilterOperator.EQ,
					value1: "testValue3",
				});							
				var aFilters = [oFilter12, oFilter3];
				var sStringRep = oTestStub.filterHelper_getFilterString(aFilters, getFilterInfoForPropertyFilters.bind(null, assert));
				assert.equal(sStringRep, "(myProperty%20=%20'testValue1'%20or%20myProperty%20=%20'testValue2')%20and%20myProperty%20=%20'testValue3'", "string representation must be correct");
				assert.equal(getFilterInfoForPropertyFilters.callCount, 2, "Callback must have been called twice");
			});			
			
			QUnit.test("Compute string representation for an array of filters containing navigation properties", function (assert) {
				oSandbox.stub(metadataAnalyser, "getPropertyMetadata", function(oMetaModel, sEntityTypeName, sProperty) {
					var oProperty = {};
					switch (sProperty) {
						case "IsActiveEntity": oProperty.type = "Edm.Boolean"; break;
						case "SiblingEntity/IsActiveEntity": oProperty.type = "Edm.Boolean"; break;
						case "to_BillingStatus/Type": oProperty.type = "Edm.String"; break;
						default: oProperty.type = "null";
					}
					return oProperty;
				});

				var mPropertyFilters = {
					"IsActiveEntity":[new Filter({
						path: "IsActiveEntity",
						operator: FilterOperator.EQ,
						value1: "false"
					})],
					"SiblingEntity/IsActiveEntity":[new Filter({
						path: "SiblingEntity/IsActiveEntity",
						operator: FilterOperator.EQ,
						value1: "false"
					})],
					"to_BillingStatus/Type":[new Filter({
						path:"to_BillingStatus/Type",
						operator:FilterOperator.EQ,
						value1:"A"
					})]
				};

				var aInfosForFilters = [];

				var oParams = {
					oMetaModel: null,
					sEntityTypeName: "",
					sProperty: "",
					oFilterData: {}
				};

				for (var sProperty in mPropertyFilters){
					var sNewProperty = sProperty.replaceAll("/", ".");
					oParams.oFilterData[sNewProperty] = mPropertyFilters[sProperty];
				}

				for (var sProperty in mPropertyFilters){
					oParams.sProperty = sProperty;
					var aFiltersForProperty = mPropertyFilters[sProperty];
					aInfosForFilters.push(oTestStub.filterHelper_getFilterInfoForPropertyFilters(oParams, sProperty, aFiltersForProperty, ""));
				}

				assert.equal(aInfosForFilters[0].stringRep, "IsActiveEntity%20eq%20false");
				assert.equal(aInfosForFilters[1].stringRep, "SiblingEntity/IsActiveEntity%20eq%20false");
				assert.equal(aInfosForFilters[2].stringRep, "to_BillingStatus/Type%20eq%20%27A%27");
			});

			QUnit.test("Should process and group table filters correctly", function (assert) {
                var Filter = sap.ui.model.Filter;
                var aFilters = [
                    { sPath: "Category", sOperator: "EQ", oValue1: "Electronics", oValue2: null },
                    { sPath: "Category", sOperator: "EQ", oValue1: "Books", oValue2: null },
                    { sPath: "Price", sOperator: "GT", oValue1: "100", oValue2: null }
                ];
                var result = oTestStub.filterHelper_fnNormaliseControlFilters(aFilters);

                assert.ok(result[0] instanceof Filter, "Returns a valid Filter object");
                assert.strictEqual(result[0].aFilters.length, 2, "Correctly groups filters by sPath");
                assert.strictEqual(result[0].aFilters[0].aFilters.length, 2, "Groups 'Category' filters correctly");
                assert.strictEqual(result[0].aFilters[1].aFilters.length, 1, "Groups 'Price' filter correctly");
                assert.strictEqual(result[0].bAnd, true, "Combines all groups with AND logic at the top level");
            });
		});

});
