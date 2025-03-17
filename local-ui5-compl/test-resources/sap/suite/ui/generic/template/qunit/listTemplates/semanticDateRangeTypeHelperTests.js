/**
 * tests for the sap.suite.ui.generic.template.listTemplates.semanticDateRangeHelper
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/listTemplates/semanticDateRangeTypeHelper", "sap/base/util/extend"], function (sinon, semanticDateRangeTypeHelper, extend) {
	"use strict";

	var oSandbox;
	
	QUnit.module("Support for Semantic Date - templating preparation", {}, function(){
		QUnit.test("Support for Semantic Date - getDateSettingsMetadata", function (assert) {
			var oExpectedMetadata = {
				type: "object",
				properties: {
					useDateRange: {
						type: "boolean",
						defaultValue: false
					},
					selectedValues: {
						type: "string",
						defaultValue: ""
					},
					exclude: {
						type: "boolean",
						defaultValue: true
					},
					customDateRangeImplementation: {
						type: "string",
						defaultValue: ""
					},
					defaultValue: {
						type: "object",
						properties: {
							operation: {
								type: "string"
							}
						}
					},
					filter: { 
						type: "array",
						arrayEntries: {
							type: "object",
							properties: {
								path: {
									type: "string"
								},
								equals: {
									type: "string"
								},
								contains: {
									type: "string"
								},
								exclude: {
									type: "boolean",
									defaultValue: false
								}
							}
						}
					},
					fields: {
						type: "object",
						mapEntryProperties: {
							useDateRange: {
								type: "boolean",
								defaultValue: false
							},
							selectedValues: {
								type: "string",
								defaultValue: ""
							},
							exclude: {
								type: "boolean",
								defaultValue: true
							},
							customDateRangeImplementation: {
								type: "string",
								defaultValue: ""
							},
							defaultValue: {
								type: "object",
								properties: {
									operation: {
										type: "string"
									}
								}
							},
							filter: { 
								type: "array",
								arrayEntries: {
									type: "object",
									properties: {
										path: {
											type: "string"
										},
										equals: {
											type: "string"
										},
										contains: {
											type: "string"
										},
										exclude: {
											type: "boolean",
											defaultValue: false
										}
									}
								}
							}
						}
					}
				}
			};
			var oResult = semanticDateRangeTypeHelper.getDateSettingsMetadata();
			assert.deepEqual(oResult, oExpectedMetadata);
		});

		QUnit.test("getDateRangeFieldSettings: Edm.DateTime with display-format:Date and filter-restriction:interval, generic dateSettings selectedValues  (excluded per dafault)", function (assert) {
			var oEntityType = {
				property: [{
					name: "DeliveryDate",
					type: "Edm.DateTime",
					"sap:display-format": "Date",
					"sap:filter-restriction": "interval"
				}]
			};
			var oPageSettings = {
				filterSettings: {
					dateSettings: {
						selectedValues: "DAYS,WEEK",
					}
				}
			}
			var aExpectedDateRangeFieldSettings = [{
				key: "DeliveryDate",
				conditionType: JSON.stringify({
					module: "sap.ui.comp.config.condition.DateRangeType",
					operations: {
						filter: [{
							path: "key",
							contains: "DAYS,WEEK",
							exclude: true
						}]
					}
				})
			}];
			var oLeadingEntitySet = {};

			var mResult = semanticDateRangeTypeHelper.getDateRangeFieldSettings(oPageSettings, oEntityType, oLeadingEntitySet);
			assert.deepEqual(mResult, aExpectedDateRangeFieldSettings, "correct controlConfigrationSettings provided");
		});

		QUnit.test("getDateRangeFieldSettings: Edm.String with IsCalendarDate:true and filter-restriction:interval, generic dateSettings selectedValues not excluded", function (assert) {
			var oEntityType = {
				property: [{
					name: "DeliveryDate",
					type: "Edm.String",
					"com.sap.vocabularies.Common.v1.IsCalendarDate": {
						Bool: "true"
					},
					"sap:filter-restriction": "interval"
				}]
			};
			var oPageSettings = {
				filterSettings: {
					dateSettings: {
						selectedValues: "DAYS,WEEK",
						exclude: false
					}
				}
			}
			var aExpectedDateRangeFieldSettings = [{
				key: "DeliveryDate",
				conditionType: JSON.stringify({
					module: "sap.ui.comp.config.condition.DateRangeType",
					operations: {
						filter: [{
							path: "key",
							contains: "DAYS,WEEK",
							exclude: false
						}]
					}
				})
			}];
			var oLeadingEntitySet = {};

			var mResult = semanticDateRangeTypeHelper.getDateRangeFieldSettings(oPageSettings, oEntityType, oLeadingEntitySet);
			assert.deepEqual(mResult, aExpectedDateRangeFieldSettings, "correct controlConfigrationSettings provided");
		});

		QUnit.test("getDateRangeFieldSettings: Edm.DateTime with display-format:Date and filter-restriction:interval, generic dateSettings filter", function (assert) {
			var oEntityType = {
				property: [{
					name: "DeliveryDate",
					type: "Edm.DateTime",
					"sap:display-format": "Date",
					"sap:filter-restriction": "interval"
				}]
			};
			var oPageSettings = {
				filterSettings: {
					dateSettings: {
						filter: [
							{path: 'key', equals: 'DAY', exclude: false},
							{path: 'category', contains: 'WEEK', exclude: true}
							]
					}
				}
			}
			var aExpectedDateRangeFieldSettings = [{
				key: "DeliveryDate",
				conditionType: JSON.stringify({
					module: "sap.ui.comp.config.condition.DateRangeType",
					operations: {
						filter: [
							{path: 'key', equals: 'DAY', exclude: false},
							{path: 'category', contains: 'WEEK', exclude: true}
							]
					}
				})
			}];
			var oLeadingEntitySet = {};

			var mResult = semanticDateRangeTypeHelper.getDateRangeFieldSettings(oPageSettings, oEntityType, oLeadingEntitySet);
			assert.deepEqual(mResult, aExpectedDateRangeFieldSettings, "correct controlConfigrationSettings provided");
		});

		QUnit.test("getDateRangeFieldSettings: Edm.DateTime with display-format:Date and FilterExpressionRestrictions with SingleRange as the AllowedExpressions, generic dateSettings filter", function (assert) {
			var oEntityType = {
				property: [{
					name: "DeliveryDate",
					type: "Edm.DateTime",
					"sap:display-format": "Date"
				}]
			};
			var oPageSettings = {
				filterSettings: {
					dateSettings: {
						filter: [
							{path: 'key', equals: 'DAY', exclude: false},
							{path: 'category', contains: 'WEEK', exclude: true}
							]
					}
				}
			}
			var aExpectedDateRangeFieldSettings = [{
				key: "DeliveryDate",
				conditionType: JSON.stringify({
					module: "sap.ui.comp.config.condition.DateRangeType",
					operations: {
						filter: [
							{path: 'key', equals: 'DAY', exclude: false},
							{path: 'category', contains: 'WEEK', exclude: true}
							]
					}
				})
			}];
			var oLeadingEntitySet = {
				"Org.OData.Capabilities.V1.FilterRestrictions": {
					FilterExpressionRestrictions: [
						{
							Property: {
								PropertyPath: "DeliveryDate"
							},
							AllowedExpressions: {
								String: "SingleRange"
							}
						}
					]
				}
			};

			var mResult = semanticDateRangeTypeHelper.getDateRangeFieldSettings(oPageSettings, oEntityType, oLeadingEntitySet);
			assert.deepEqual(mResult, aExpectedDateRangeFieldSettings, "correct controlConfigrationSettings provided");
		});

		QUnit.test("getDateRangeFieldSettings: Edm.String with IsCalendarDate:true and filter-restriction:interval, specific dateSettings defaultValue", function (assert) {
			var oEntityType = {
				property: [{
					name: "DeliveryDate",
					type: "Edm.String",
					"com.sap.vocabularies.Common.v1.IsCalendarDate": {
						Bool: "true"
					},
					"sap:filter-restriction": "interval"
				}]
			};
			var oPageSettings = {
				filterSettings: {
					dateSettings: {
						fields: {
							DeliveryDate: {
								defaultValue: {
									operation: "TODAY"
								}
							}
						}
					}
				}
			}
			var aExpectedDateRangeFieldSettings = [{
				key: "DeliveryDate",
				conditionType: JSON.stringify({
					module: "sap.ui.comp.config.condition.DateRangeType"
				})
			}];
			var oLeadingEntitySet = {};

			var mResult = semanticDateRangeTypeHelper.getDateRangeFieldSettings(oPageSettings, oEntityType, oLeadingEntitySet);
			assert.deepEqual(mResult, aExpectedDateRangeFieldSettings, "correct controlConfigrationSettings provided");
		});

		QUnit.test("getDateRangeFieldSettings: Edm.String with IsCalendarDate:true and filter-restriction:interval, specific dateSettings customDateRangeImplementation", function (assert) {
			var oEntityType = {
				property: [{
					name: "DeliveryDate",
					type: "Edm.String",
					"com.sap.vocabularies.Common.v1.IsCalendarDate": {
						Bool: "true"
					},
					"sap:filter-restriction": "interval"
				}]
			};
			var oPageSettings = {
				filterSettings: {
					dateSettings: {
						fields: {
							DeliveryDate: {
								customDateRangeImplementation: "custom"
							}
						}
					}
				}
			}
			var aExpectedDateRangeFieldSettings = [{
				key: "DeliveryDate",
				conditionType: "custom"
			}];
			var oLeadingEntitySet = {};

			var mResult = semanticDateRangeTypeHelper.getDateRangeFieldSettings(oPageSettings, oEntityType, oLeadingEntitySet);
			assert.deepEqual(mResult, aExpectedDateRangeFieldSettings, "correct controlConfigrationSettings provided");
		});

		QUnit.test("getDateRangeFieldSettings: No dateSettings => no controlConfigurations with conditionType (although correctly annotated dateRange fields exist)", function (assert) {
			var oEntityType = {
				property: [{
					name: "DeliveryDate",
					type: "Edm.String",
					"com.sap.vocabularies.Common.v1.IsCalendarDate": {
						Bool: "true"
					},
					"sap:filter-restriction": "interval"
				}, {
					name: "CreatedDate",
					type: "Edm.DateTime",
					"sap:display-format": "Date",
					"sap:filter-restriction": "interval"
				}]
			};
			var oPageSettings = {
				filterSettings: {}
			}
			var aExpectedDateRangeFieldSettings = [];
			var oLeadingEntitySet = {};

			var mResult = semanticDateRangeTypeHelper.getDateRangeFieldSettings(oPageSettings, oEntityType, oLeadingEntitySet);
			assert.deepEqual(mResult, aExpectedDateRangeFieldSettings, "correct controlConfigrationSettings provided");
		});


		QUnit.test("getDateRangeFieldSettings: Only incompletly annotated dateRangey fields => no controlConfiguration (although dateSettings provided correctly)", function(assert){
			var oEntityType = {
				property: [{
					name: "DeliveryDate",
					type: "Edm.DateTime",
					"sap:filter-restriction": "interval"
				}, {
					name: "CreatedDate",
					type: "Edm.DateTime",
					"sap:display-format": "Date",
				}, {
					name: "LastUpdatedDate",
					type: "Edm.String",
					"com.sap.vocabularies.Common.v1.IsCalendarDate": {
						"Bool": "true"
					}
				}, {
					name: "ReopenedDate",
					type: "Edm.String",
					"com.sap.vocabularies.Common.v1.IsCalendarDate": {
						"Bool": "false"
					},
					"sap:filter-restriction": "interval"
				}]
			};
			var oPageSettings = {
				filterSettings: {
					dateSettings: {
						defaultValue: {
							operation: "TODAY"
						}
					}
				}
			};
			var oLeadingEntitySet = {};

			assert.deepEqual(semanticDateRangeTypeHelper.getDateRangeFieldSettings(oPageSettings, oEntityType, oLeadingEntitySet), [], "No controlConfigurationSettings provided");
		});

		QUnit.test("Wrong Date Range configuration set in manifest", function(assert){
			var oEntityType = {
				property: [{
					name: "CreatedDate",
					type: "Edm.DateTime",
					"sap:display-format": "Date",
					"sap:filter-restriction": "interval"
				}]
			};

			var oPageSettings = {
				filterSettings: {
					dateSettings: {
						fields: {
							CreatedDate: {
								noValidSetting: true
							}
						}
					}
				}
			};
			var oLeadingEntitySet = {};

			var oExpectedError = new Error("listTemplates.semanticDateRangeTypeHelper: Wrong Date Range configuration set in manifest");
			try{
				semanticDateRangeTypeHelper.getDateRangeFieldSettings(oPageSettings, oEntityType, oLeadingEntitySet);
				assert.ok(false, "Expected error not raised");
			} catch(err) {
				assert.deepEqual(err.name, "FioriElements", "Error of type FioriElements thrown");
				assert.deepEqual(err.message, oExpectedError.message, "Invalid date range operator");
			}
		});
	});
});
