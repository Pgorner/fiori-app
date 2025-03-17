sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/genericUtilities/testableHelper", "sap/suite/ui/generic/template/js/RuntimeFormatters", "sap/ui/core/message/MessageType"
], function (sinon, testableHelper, RuntimeFormatters, MessageType) {

	function getControlWithCustomData(aCustomData){
		return {
			getCustomData: function(){
				return aCustomData;
			},
			getModel: function(sName){
				var oResourceModel = new sap.ui.model.resource.ResourceModel({
					bundleName: "sap.suite.ui.generic.template.lib.i18n.i18n"
				});
				return oResourceModel;
			}
		};
	}

	var oTestStub; // host for static functions to be tested
	QUnit.module("RuntimeFormatters", {
		beforeEach: function () {
			testableHelper.startTest();
			oTestStub = testableHelper.getStaticStub();
		},
		afterEach: testableHelper.endTest
	}, function(){
		QUnit.test("Check function getLineItemQualifier", function (assert) {
			//Arrange
			var getLineItemQualifier = oTestStub.RuntimeFormatters_getLineItemQualifier; // the function to be tested
			var oControl = getControlWithCustomData([{
				getKey: function() {
					return "Key";
				},
				getValue: function() {
					return "Value"
				}
			}, {
				getKey: function() {
					return "lineItemQualifier";
				},
				getValue: function() {
					return "Qualifier"
				}
			}]);
			//Act
			var sQualifier = getLineItemQualifier(oControl);
			//Assert
			assert.deepEqual(sQualifier, "Qualifier", "Returns the defined lineitem qualifier");
		});
	
		QUnit.test("Check function getLineItemQualifier", function (assert) {
			//Arrange
			var getLineItemQualifier = oTestStub.RuntimeFormatters_getLineItemQualifier; // the function to be tested
			var oControl = getControlWithCustomData([{
					getKey: function() {
						return "Key";
					},
					getValue: function() {
						return "Value"
					}
				}
			]);
			//Act
			var sQualifier = getLineItemQualifier(oControl);
			//Assert
			assert.deepEqual(sQualifier, undefined, "Returns undefined when lineitem qualifier is not defined");
		});
	
		QUnit.test("Check function getLineItemQualifier", function (assert) {
			//Arrange
			var getLineItemQualifier = oTestStub.RuntimeFormatters_getLineItemQualifier; // the function to be tested
			var oControl = getControlWithCustomData([]);
			//Act
			var sQualifier = getLineItemQualifier(oControl);
			//Assert
			assert.deepEqual(sQualifier, undefined, "Returns undefined when custom data not defined");
		});
	});



	QUnit.module("Test Methods for Rating Indicator formatters");

	QUnit.test("check method formatRatingIndicatorFooterText", function (assert) {
		var sExpectedFooterText = "", sActualFooterText = "", sI18nText = " out of ";
		var oLabel = new sap.m.Label();
		sinon.stub(oLabel, "getModel", function () {
			return {
				getResourceBundle: function () {
					return {
						getText: function (sKey, aText) {
							return aText[0] + sI18nText + aText[1];
						}
					}
				}
			}
		});
		var oVBox = new sap.m.VBox({
			items: [new sap.m.RatingIndicator(), oLabel]
		});
		var aText = [
			{
				sValue: "2",
				sMaxValue: "5",
				customData: undefined
			},
			{
				sValue: "1",
				sMaxValue: undefined,
				customData: new sap.ui.core.CustomData({
					value: "3"
				})
			},
			{
				sValue: "5",
				sMaxValue: undefined,
				customData: undefined
			}
		].forEach(function (obj) {
			sExpectedFooterText = obj.sValue + sI18nText;
			if (obj.customData) {
				oLabel.addCustomData(obj.customData);
				sExpectedFooterText += oLabel.data("Footer");
			}
			else if (obj.sMaxValue) {
				sExpectedFooterText += obj.sMaxValue;
			}
			else {
				sExpectedFooterText += "5";
			}
			sActualFooterText = RuntimeFormatters.formatRatingIndicatorFooterText.apply(oLabel, [obj.sValue, obj.sMaxValue]);
			assert.equal(sActualFooterText, sExpectedFooterText, "'" + sActualFooterText + "' returned correctly from with custom data as '" + (obj.customData && obj.customData.getValue()) + "' and max value as '" + obj.sMaxValue + "'");

			oLabel.removeAllCustomData();

		}.bind(this));

		oVBox.destroy();

	});


	[
		{
			description: "Verify formatRatingIndicatorAggregatedCount with value resolved from a navigation path",
			expected: "(100)",
			value: "100",
			customData: undefined
		},
		{
			description: "Verify formatRatingIndicatorAggregatedCount with value is a primitive type and navigation path resolves to undefined",
			expected: "(101)",
			value: undefined,
			customData: [new sap.ui.core.CustomData({
				value: "101",
				key: "AggregateCount"
			})]
		},
		{
			description: "Verify formatRatingIndicatorAggregatedCount with undefined value",
			expected: "",
			value: undefined,
			customData: undefined
		}

	].forEach(function (mTest) {
		QUnit.test(mTest.description, function (assert) {
			var oControl = new sap.ui.core.Control();
			oControl.getModel = function () {
				var oResourceModel = new sap.ui.model.resource.ResourceModel({
					bundleName: "sap.suite.ui.generic.template.lib.i18n.i18n"
				});
				return oResourceModel;
			};
			if (mTest.customData) {
				oControl.getCustomData = function () {
					return mTest.customData;
				};

				oControl.addCustomData(mTest.customData[0]);
			}

			var sActualAggegatedCount = RuntimeFormatters.formatRatingIndicatorAggregateCount.apply(oControl, [mTest.value]);
			assert.equal(sActualAggegatedCount, mTest.expected, "The aggregated count " + mTest.expected + " is correct");

		});
	}.bind(this));


	function getControlWithTargetAndKeyValue(sTargetValue, sKeyValue){
		var aCustomData = [{
			getValue: function () {
				return sTargetValue;
			}, getKey: function () {
				return "Target";
			}
		}, {
			getValue: function () {
				return sKeyValue;
			}, getKey: function () {
				return "UoM";
			}
		}];
		return getControlWithCustomData(aCustomData);		
	}
	
	QUnit.module("Test Methods for ProgressIndicator Display Value", );

	QUnit.test("Value is numeric, uom is '%'", function (assert) {
		var sValue = "20";
		var sUoM = "%";
		var sExpectedDisplayValue = "20 %";
		var sTarget = "";
		var oControl = getControlWithTargetAndKeyValue();
		var sDisplayValue = RuntimeFormatters.formatDisplayValueForProgressIndicator.apply(oControl, [sValue, sTarget, sUoM]);
		assert.strictEqual(sDisplayValue, sExpectedDisplayValue, "Target is provided. Returned the expected display value: " + sExpectedDisplayValue);

		sUoM = undefined;
		oControl = getControlWithTargetAndKeyValue(null, "%");
		sExpectedDisplayValue = "20 %";
		sDisplayValue = RuntimeFormatters.formatDisplayValueForProgressIndicator.apply(oControl, [sValue, sTarget, sUoM]);
		assert.strictEqual(sDisplayValue, sExpectedDisplayValue, "Target is in custom data. Returned the expected display value: " + sExpectedDisplayValue);

	});

	QUnit.test("Value is numeric, uom is not '%'', target is provided)", function (assert) {
		var sValue = "20";
		var sTarget = "100";
		var sUoM = "GB";
		var sExpectedDisplayValue = "20 of 100 GB";
		var oControl = getControlWithTargetAndKeyValue();
		sDisplayValue = RuntimeFormatters.formatDisplayValueForProgressIndicator.apply(oControl, [sValue, sTarget, sUoM]);
		assert.strictEqual(sDisplayValue, sExpectedDisplayValue, "Target is provided. Returned the expected display value: " + sExpectedDisplayValue);

		sTarget = undefined;
		sUoM = undefined;
		oControl = getControlWithTargetAndKeyValue("40", "CM");
		sExpectedDisplayValue = "20 of 40 CM";
		sDisplayValue = RuntimeFormatters.formatDisplayValueForProgressIndicator.apply(oControl, [sValue, sTarget, sUoM]);
		assert.strictEqual(sDisplayValue, sExpectedDisplayValue, "Target is in custom data. Returned the expected display value: " + sExpectedDisplayValue);

	});

	QUnit.test("value is numeric, target is undefined, uom is defined", function (assert) {
		var sValue = "20";
		var sUoM = "GB";
		var sExpectedDisplayValue = "20 GB";
		var oControl = getControlWithTargetAndKeyValue();
		var sTarget = null;
		var sDisplayValue = RuntimeFormatters.formatDisplayValueForProgressIndicator.apply(oControl, [sValue, sTarget, sUoM]);
		assert.strictEqual(sDisplayValue, sExpectedDisplayValue, "Target is provided. Returned the expected display value: " + sExpectedDisplayValue);

		sUoM = undefined;
		sExpectedDisplayValue = "20 CM";
		oControl = getControlWithTargetAndKeyValue(null, "CM");
		sDisplayValue = RuntimeFormatters.formatDisplayValueForProgressIndicator.apply(oControl, [sValue, sTarget, sUoM]);
		assert.strictEqual(sDisplayValue, sExpectedDisplayValue, "Target is in custom data. Returned the expected display value: " + sExpectedDisplayValue);
	});

	QUnit.test("Value is numeric, target is defined, uom is undefined", function (assert) {
		var sValue = "20";
		var sTarget = "100";
		var sExpectedDisplayValue = "20 of 100";
		var sUoM = null;
		var oControl = getControlWithTargetAndKeyValue();
		var sDisplayValue = RuntimeFormatters.formatDisplayValueForProgressIndicator.apply(oControl, [sValue, sTarget, sUoM]);
		assert.strictEqual(sDisplayValue, sExpectedDisplayValue, "Target is provided. Returned the expected display value: " + sExpectedDisplayValue);

		sTarget = undefined;
		oControl = getControlWithTargetAndKeyValue(80);
		sExpectedDisplayValue = "20 of 80";
		sDisplayValue = RuntimeFormatters.formatDisplayValueForProgressIndicator.apply(oControl, [sValue, sTarget, sUoM]);
		assert.strictEqual(sDisplayValue, sExpectedDisplayValue, "Target is in custom data. Returned the expected display value: " + sExpectedDisplayValue);

	});

	QUnit.test("Value is numeric, target is undefined, uom is undefined", function (assert) {
		var sValue = "20";
		var sExpectedDisplayValue = sValue;
		var sUoM = null;
		var sTarget = undefined;
		var oControl = getControlWithTargetAndKeyValue();
		var sDisplayValue = RuntimeFormatters.formatDisplayValueForProgressIndicator.apply(oControl, [sValue, sTarget, sUoM]);
		assert.strictEqual(sDisplayValue, sExpectedDisplayValue, "Returned the expected display value: " + sExpectedDisplayValue);
	});

	QUnit.test("Value is 0, target is null, uom is 'PCS'", function (assert) {
		var sValue = 0;
		var sTarget = null;
		var sUoM = "PCS";
		var sExpectedDisplayValue = "0 PCS";
		var oControl = getControlWithTargetAndKeyValue();
		var sDisplayValue = RuntimeFormatters.formatDisplayValueForProgressIndicator.apply(oControl, [sValue, sTarget, sUoM]);
		assert.strictEqual(sDisplayValue, sExpectedDisplayValue, "Returned the expected display value: " + sExpectedDisplayValue);
	});

	QUnit.test("Negative Tests (value is undefined)", function (assert) {
		var sExpectedDisplayValue = "";
		var oControl = getControlWithTargetAndKeyValue();
		var sDisplayValue = RuntimeFormatters.formatDisplayValueForProgressIndicator.apply(oControl, []);
		assert.strictEqual(sDisplayValue, sExpectedDisplayValue, "Returned the expected display value: " + sExpectedDisplayValue);
	});

	QUnit.test("test setInfoHighlight", function (assert) {
		var result1 = RuntimeFormatters.setInfoHighlight.apply({
			getBindingContext: () => ({
					getMessages: () => ([{
						getType: () => MessageType.Error
					}])
				})
		}, [false, false, true]);

		var result2 = RuntimeFormatters.setInfoHighlight.apply({
			getBindingContext: () => ({
					getMessages: () => [],
					isTransient: () => true,
					isInactive: () => false,
				})
		}, [false, false, true]);

		assert.equal(result1, 'Error', "if message is present with Error, 'Error' should be returned");
		assert.equal(result2, 'Information', "if message is not present, check if context is transient and active .. if yes 'Information' should be returned");
	});

	QUnit.module("RuntimeFormatters getSmartTableControl", {
		beforeEach: function () {
			testableHelper.startTest();
			oTestStub = testableHelper.getStaticStub();
		},
		afterEach: testableHelper.endTest
	}, function(){
		QUnit.test("Check function getSmartTableControl", function (assert) {
			var getSmartTableControl = oTestStub.RuntimeFormatters_getSmartTableControl; // the function to be tested
			//Arrange
			var oSmartTable = {
					getEntitySet: function() {
						return {dummy: "value"};
					}
				};
			var oColumn = {
				getParent: function(){
					return {
						getParent: function() {
							return oSmartTable;
						}
					}
				}
			}
			//Act
			var oControl = getSmartTableControl(oColumn);
			//Assert
			assert.deepEqual(oControl.getEntitySet(), oSmartTable.getEntitySet(), "Returns smart table control when a column control is passed");
		});

		QUnit.test("Check function getSmartTableControl", function (assert) {
			//Arrange
			var getSmartTableControl = oTestStub.RuntimeFormatters_getSmartTableControl; // the function to be tested
			var oSmartTable = {
					getEntitySet: function() {
						return {dummy: "value"};
					}
				};
			var oTable = {
				getParent: function(){
					return oSmartTable;
				}
			}
			//Act
			var oControl = getSmartTableControl(oTable);
			//Assert
			assert.deepEqual(oControl.getEntitySet(), oSmartTable.getEntitySet(), "Returns smart table control when table control is passed");
		});

		QUnit.test("Check function getSmartTableControl", function (assert) {
			//Arrange
			var getSmartTableControl = oTestStub.RuntimeFormatters_getSmartTableControl; // the function to be tested
			var oSmartTable = {
					getEntitySet: function() {
						return {dummy: "value"};
					}
				};
			//Act
			var oControl = getSmartTableControl(oSmartTable);
			//Assert
			assert.deepEqual(oControl.getEntitySet(), oSmartTable.getEntitySet(), "Returns smart table control when smart table control is passed");
		});
	});
});
