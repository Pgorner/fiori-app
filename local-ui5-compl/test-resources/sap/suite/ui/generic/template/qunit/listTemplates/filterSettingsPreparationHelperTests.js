/**
 * tests for the sap.suite.ui.generic.template.listTemplates.filterSettingsPreparationHelper
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/listTemplates/filterSettingsPreparationHelper", "sap/suite/ui/generic/template/listTemplates/semanticDateRangeTypeHelper"], function (sinon, filterSettingsPreparationHelper, semanticDateRangeTypeHelper) {
	"use strict";
	var oSandbox;

	QUnit.module("Filter settings preparation", {
		beforeEach: function() {
			oSandbox = sinon.sandbox.create();
		},
		afterEach: function() {
			oSandbox.restore();
		}
	}, function(){		
		QUnit.test("getControlConfigurationSettings: SelectionFields", function (assert) {
			var oEntityType = {
				property: [{
					name: "DeliveryDate",
					type: "Edm.DateTime"
				}, {
					name: "CreatedDate",
					type: "Edm.DateTime"
				}],
				"com.sap.vocabularies.UI.v1.SelectionFields": [{
					PropertyPath: "DeliveryDate"
				}, {
					PropertyPath: "CreatedDate"
					
				}]
			};
			
			var mExpectedControlConfigurationSetting = {
				DeliveryDate: {
					key: "DeliveryDate",
					groupId: "_BASIC",
					index: 10,
					visibleInAdvancedArea: true,
				},
				CreatedDate: {
					key: "CreatedDate",
					groupId: "_BASIC",
					index: 20,
					visibleInAdvancedArea: true,
				}
			};

			var mResult = filterSettingsPreparationHelper.getControlConfigurationSettings({}, oEntityType);
			assert.deepEqual(mResult, mExpectedControlConfigurationSetting, "correct controlConfigrationSettings provided");
		});

		QUnit.test("getControlConfigurationSettings: History enablement per field", function (assert) {
			var oEntityType = {
				property: [{
					name: "Enabled",
					type: "Edm.String"
				}, {
					name: "Disabled",
					type: "Edm.String"
				}, {
					name: "Auto",
					type: "Edm.String"
				}]
			};
			
			var oPageSettings = {
				filterSettings: {
					historySettings: {
						fields: {
							Enabled: {
								historyEnabled: "enabled"
							},
							Disabled: {
								historyEnabled: "disabled"
							},
							Auto: {
								historyEnabled: "auto"
							},
						}
					}
				}
			};
			
			var mExpectedControlConfigurationSetting = {
				Enabled: {
					key: "Enabled",
					historyEnabled: true
				},
				Disabled: {
					key: "Disabled",
					historyEnabled: false
				}
			};

			var mResult = filterSettingsPreparationHelper.getControlConfigurationSettings(oPageSettings, oEntityType);
			assert.deepEqual(mResult, mExpectedControlConfigurationSetting, "correct controlConfigrationSettings provided");
		});

		QUnit.test("getControlConfigurationSettings: History enablement default enabled", function (assert) {
			var oEntityType = {
					property: [{
						name: "Enabled",
						type: "Edm.String"
					}, {
						name: "Disabled",
						type: "Edm.String"
					}, {
						name: "Auto",
						type: "Edm.String"
					}]
			};
			
			var oPageSettings = {
					filterSettings: {
						historySettings: {
							historyEnabled: "enabled",
							fields: {
								Disabled: {
									historyEnabled: "disabled"
								},
								Auto: {
									historyEnabled: "auto"
								}
							}
						}
					}
			};
			
			var mExpectedControlConfigurationSetting = {
					Enabled: {
						key: "Enabled",
						historyEnabled: true
					},
					Disabled: {
						key: "Disabled",
						historyEnabled: false
					}
			};
			
			var mResult = filterSettingsPreparationHelper.getControlConfigurationSettings(oPageSettings, oEntityType);
			assert.deepEqual(mResult, mExpectedControlConfigurationSetting, "correct controlConfigrationSettings provided");
		});
		
		QUnit.test("getControlConfigurationSettings: History enablement default disabled", function (assert) {
			var oEntityType = {
					property: [{
						name: "Enabled",
						type: "Edm.String"
					}, {
						name: "Disabled",
						type: "Edm.String"
					}, {
						name: "Auto",
						type: "Edm.String"
					}]
			};
			
			var oPageSettings = {
					filterSettings: {
						historySettings: {
							historyEnabled: "disabled",
							fields: {
								Enabled: {
									historyEnabled: "enabled"
								},
								Auto: {
									historyEnabled: "auto"
								}
							}
						}
					}
			};
			
			var mExpectedControlConfigurationSetting = {
					Enabled: {
						key: "Enabled",
						historyEnabled: true
					},
					Disabled: {
						key: "Disabled",
						historyEnabled: false
					}
			};
			
			var mResult = filterSettingsPreparationHelper.getControlConfigurationSettings(oPageSettings, oEntityType);
			assert.deepEqual(mResult, mExpectedControlConfigurationSetting, "correct controlConfigrationSettings provided");
		});
		
		QUnit.test("getControlConfigurationSettings: History enablement default auto", function (assert) {
			var oEntityType = {
					property: [{
						name: "Enabled",
						type: "Edm.String"
					}, {
						name: "Disabled",
						type: "Edm.String"
					}, {
						name: "Auto",
						type: "Edm.String"
					}]
			};
			
			var oPageSettings = {
					filterSettings: {
						historySettings: {
							historyEnabled: "auto",
							fields: {
								Enabled: {
									historyEnabled: "enabled"
								},
								Disabled: {
									historyEnabled: "disabled"
								}
							}
						}
					}
			};
			
			var mExpectedControlConfigurationSetting = {
					Enabled: {
						key: "Enabled",
						historyEnabled: true
					},
					Disabled: {
						key: "Disabled",
						historyEnabled: false
					}
			};
			
			var mResult = filterSettingsPreparationHelper.getControlConfigurationSettings(oPageSettings, oEntityType);
			assert.deepEqual(mResult, mExpectedControlConfigurationSetting, "correct controlConfigrationSettings provided");
		});
		
		QUnit.test("getControlConfigurationSettings: Combining SelectionFields, DateRangeFields and history enablement", function (assert) {
			oSandbox.stub(semanticDateRangeTypeHelper, "getDateRangeFieldSettings", function(){
				return [{
					key: "SelectionFieldWithDateRange",
					conditionType: "some condition"
				}, {
					key: "HistoryEnabledDateRangeField",
					conditionType: "some other condition"
				}];
			});
			
			var oEntityType = {
				property: [{
					name: "SelectionFieldWithDateRange",
					type: "Edm.DateTime",
				}, {
					name: "HistoryEnabledSelectionField",
					type: "Edm.DateTime",
				}, {
					name: "HistoryEnabledDateRangeField",
					type: "Edm.DateTime",
				}],
				"com.sap.vocabularies.UI.v1.SelectionFields": [{
					PropertyPath: "SelectionFieldWithDateRange"
				}, {
					PropertyPath: "HistoryEnabledSelectionField"
				}]
			};
			
			var oPageSettings = {
				filterSettings: {
					dateSettings: {
						useDateRange: true
					},
					historySettings: {
						fields: {
							HistoryEnabledSelectionField: {
								historyEnabled: "enabled"
							},
							HistoryEnabledDateRangeField: {
								historyEnabled: "enabled"
							}
						}
					}
				}
			};

			var mExpectedControlConfigurationSetting = {
				SelectionFieldWithDateRange: {
					key: "SelectionFieldWithDateRange",
					groupId: "_BASIC",
					index: 10,
					visibleInAdvancedArea: true,
					conditionType: "some condition"
				},
				HistoryEnabledSelectionField: {
					key: "HistoryEnabledSelectionField",
					groupId: "_BASIC",
					index: 20,
					visibleInAdvancedArea: true,
					historyEnabled: true
				},
				HistoryEnabledDateRangeField: {
					key: "HistoryEnabledDateRangeField",
					conditionType: "some other condition",
					historyEnabled: true
				}
			};

			var mResult = filterSettingsPreparationHelper.getControlConfigurationSettings(oPageSettings, oEntityType);
			assert.deepEqual(mResult, mExpectedControlConfigurationSetting, "correct controlConfigrationSettings provided");
		});

	});
});
