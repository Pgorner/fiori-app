/**
 * tests for the sap.suite.ui.generic.template.designtime.controls.SmartTable.designtime
 */

sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/ui/model/json/JSONModel",
	"sap/ui/comp/smarttable/SmartTable",
	"sap/suite/ui/generic/template/designtime/controls/SmartTable.designtime",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/ListReport/Component",
	"sap/suite/ui/generic/template/ObjectPage/Component",
	"sap/suite/ui/generic/template/designtime/utils/designtimeUtils",
	"sap/suite/ui/generic/template/lib/AppComponent"
], function (sinon, JSONModel, SmartTable, SmartTableDesigntime, testableHelper, ListReportComponent, ObjectPageComponent, designtimeUtils, AppComponent) {
	"use strict";

	let oSandbox, mPropertyBag, designtimeUtilsStub;

	function fnGeneralStartup() {
		oSandbox = sinon.sandbox.create();
		// Initialize testableHelper and access the private function
		this.testableHelperStub = testableHelper.startTest();
		this.oTestablePrivateStub = testableHelper.getStaticStub();

		designtimeUtilsStub = sinon.stub(designtimeUtils);

		this.oSmartTable = sinon.createStubInstance(SmartTable);
		this.listReportComponentStub = sinon.createStubInstance(ListReportComponent);
		this.oAppComponentStub = sinon.createStubInstance(AppComponent);
		this.listReportComponentStub.getMetadata.returns({
			getComponentName: function () {
				return "sap.suite.ui.generic.template.ListReport";
			}
		});
		this.listReportComponentStub.getAppComponent.returns(this.oAppComponentStub);

		this.objectPageComponentStub = sinon.createStubInstance(ObjectPageComponent);
		this.objectPageComponentStub.getMetadata.returns({
			getComponentName: function () {
				return "sap.suite.ui.generic.template.ObjectPage";
			}
		});
		this.objectPageComponentStub.getAppComponent.returns(this.oAppComponentStub);



		this.oSmartTable.getMetadata.returns({
			getName: function () {
				return "sap.ui.comp.smarttable.SmartTable";
			}
		});
		this.oSmartTable.getModel.returns(new JSONModel());




	}

	function fnGeneralTeardown() {
		oSandbox.restore();

		this.oTestablePrivateStub = null;
		this.oSmartTable = null;
		this.listReportComponentStub = null;
		this.objectPageComponentStub = null;
		this.oAppComponentStub = null;

		sinon.restore(designtimeUtilsStub);
		mPropertyBag = null;

	}

	QUnit.module("SmartTableDesigntimeHelper Tests", {
		beforeEach: fnGeneralStartup,
		afterEach: fnGeneralTeardown
	}, function () {


		// async done callback
		QUnit.test("getDesigntime", function (assert) {
			const done = assert.async();
			const oHelper = SmartTableDesigntime.getDesigntime(this.oSmartTable);
			assert.ok(oHelper, "The helper is returned");
			assert.ok(oHelper.actions, "The actions are returned");
			assert.ok(oHelper.actions.settings, "The settings actions are returned");
			assert.ok(oHelper.actions.settings.fe, "The fe settings actions are returned");
			assert.ok(oHelper.actions.settings.fe.name, "The name is returned");
			assert.ok(oHelper.actions.settings.fe.icon, "The icon is returned");
			assert.ok(oHelper.actions.settings.fe.handler, "The handler is returned");
			done();
		});


		QUnit.test("manifestChangeHandler", function (assert) {
			const done = assert.async();
			designtimeUtilsStub.getOwnerComponentFor.returns(this.listReportComponentStub);
			designtimeUtilsStub.getLocalId.returns("smartTable");
			designtimeUtilsStub.openAdaptionDialog.returns(Promise.resolve({}));

			designtimeUtilsStub.getSettings.returns([{}]);

			const oResult = SmartTableDesigntime.getDesigntime(this.oSmartTable).actions.settings.fe.handler(this.oSmartTable, mPropertyBag);

			assert.ok(oResult, "The result is returned");
			// check the parameter values that the extractChanges,openAdaptionDialog are called with
			assert.ok(designtimeUtilsStub.openAdaptionDialog.calledWith(sinon.match.array, sinon.match.object, sinon.match.object, sinon.match.string, sinon.match.object), "The openAdaptionDialog is called with the correct parameters");

			// validate the settings arguments
			assert.ok(designtimeUtilsStub.getSettings.calledWith(sinon.match.object), "The getSettings is called with the correct parameters");

			done();
		});

		QUnit.test("getAllowedDesigntimeSettings", function (assert) {
			designtimeUtils.getOwnerComponentFor.returns(this.listReportComponentStub);

			const aSettings = this.oTestablePrivateStub.getAllowedDesigntimeSettings(this.oSmartTable);

			assert.ok(aSettings, "Designtime settings retrieved successfully");
			assert.ok(Array.isArray(aSettings), "Designtime settings is an array");
			assert.ok(aSettings.length > 0, "Designtime settings is greater than 0");
		});

		QUnit.test("getPathForTableSettings", function (assert) {
			const getPathForTableSettings = this.oTestablePrivateStub.getPathForTableSettings;
			const getPath = getPathForTableSettings("type", true);
			const sPath = getPath({
				sParentComponentName: "sap.suite.ui.generic.template.ObjectPage",
				sSectionKey: "section1",
				sScope: "Page"
			});
			assert.strictEqual(sPath, "component/settings/sections/section1/tableSettings/type", "Path for table settings is correct");
		});

		QUnit.test("getRuntimeAdapationProperties", function (assert) {
			const getRuntimeAdapationProperties = this.oTestablePrivateStub.getRuntimeAdapationProperties;
			const aDesigntimeSettings = [
				{ id: "type", value: "ResponsiveTable" },
				{ id: "multiSelect", value: false }
			];
			const oTableSettings = { type: "GridTable", multiSelect: true };
			const mPropertyValues = getRuntimeAdapationProperties(aDesigntimeSettings, oTableSettings);
			assert.strictEqual(mPropertyValues.type, "GridTable", "Table type is correct");
			assert.strictEqual(mPropertyValues.multiSelect, true, "MultiSelect is correct");
		});



		function testGetManifestTableSettings(sFloorPlan, appTableSettings, oComponentSettings, oVariantSettings, expectedSettings, title) {
			QUnit.test(title + ": getManifestTableSettings", function (assert) {
				designtimeUtilsStub.getSupportedGlobalManifestSettings.returns(appTableSettings);

				const componentStub = sFloorPlan === "LR" ? this.listReportComponentStub : this.objectPageComponentStub;
				const getManifestTableSettings = this.oTestablePrivateStub.getManifestTableSettings;

				this.oAppComponentStub.getTableSettings.returns(appTableSettings);
				if (oComponentSettings.pageTableSettings) {

					componentStub.getTableSettings?.returns(oComponentSettings.pageTableSettings);
				}
				if (oComponentSettings.sectionTableSettings) {
					componentStub.getSections?.returns({
						[oComponentSettings.sectionKey]: {
							tableSettings: oComponentSettings.sectionTableSettings
						}
					});
				}
				designtimeUtilsStub.getLocalId.returns("smartTable-" + oVariantSettings.selectedKey);
				designtimeUtilsStub.getOwnerComponentFor.returns(componentStub);
				if (componentStub.getMetadata().getComponentName() !== "sap.suite.ui.generic.template.ListReport") {
					designtimeUtilsStub.getLocalId.returns(oComponentSettings.sectionKey + "::Table");
				} else if (oVariantSettings.quickVariantSelectionXSettings && oVariantSettings.selectedKey) {
					componentStub.getQuickVariantSelectionX.returns(oVariantSettings.quickVariantSelectionXSettings);
				}

				const oSettings = getManifestTableSettings(this.oSmartTable);
				assert.ok(oSettings, title + ": Manifest table settings retrieved successfully");
				assert.deepEqual(oSettings, expectedSettings, title + ": Table settings are correct");
			});
		}

		const aGetManifestTableSettingTestInput = [
			{
				floorPlan: "LR",
				appTableSettings: { type: "ResponsiveTable" },
				componentSettings: { sectionId: 'Table::section1', pageTableSettings: { type: "GridTable" } },
				variantSettings: {
					selectedKey: "variant1", quickVariantSelectionXSettings: {
						variants: {
							foo: {
								key: "variant1", tableSettings: {
									type: "TreeTable"
								}
							},
							bar: {
								key: "variant2", tableSettings: {
									type: "AnalyticalTable"
								}
							}
						}
					}
				},
				expectedSettings: { type: "TreeTable" }
			},
			{
				floorPlan: "OP",
				appTableSettings: { type: "ResponsiveTable" },
				componentSettings: { sectionKey: "variant-section", sectionTableSettings: { type: "GridTable" } },
				variantSettings: {
					selectedKey: "variant1", quickVariantSelectionXSettings: {
						variants: {
							canbeAnything: {
								key: "variant1",
								tableSettings: { type: "TreeTable" }
							}
						}
					}
				},
				expectedSettings: { type: "GridTable" }
			},
			{
				floorPlan: "LR",
				appTableSettings: { type: "ResponsiveTable" },
				componentSettings: { type: "GridTable" },
				variantSettings: {
					selectedKey: "variant2", quickVariantSelectionXSettings: {
						variants: {
							foo: {
								key: "variant1", tableSettings: {
									type: "TreeTable"
								}
							},
							bar: {
								key: "variant2", tableSettings: {
									type: "AnalyticalTable"
								}
							}
						}
					}
				},
				expectedSettings: { type: "AnalyticalTable" }
			},
			{
				floorPlan: "LR",
				appTableSettings: { tableSettings: { type: "ResponsiveTable" } },
				componentSettings: {},
				variantSettings: {},
				expectedSettings: { type: "ResponsiveTable" }
			},
			{
				floorPlan: "LR",
				appTableSettings: { tableSettings: { createMode: true } },
				componentSettings: { pageTableSettings: { foo: "bar" } },
				variantSettings: {
					selectedKey: "variant2", quickVariantSelectionXSettings: {
						variants: {
							foo: {
								key: "variant1", tableSettings: {
									type: "TreeTable"
								}
							},
							bar: {
								key: "variant2", tableSettings: {
									type: "AnalyticalTable",
									something: "else"
								}
							}
						}
					}
				},
				expectedSettings: {
					createMode: true,
					foo: "bar",
					type: "AnalyticalTable",
					something: "else"
				}
			}
		];


		aGetManifestTableSettingTestInput.forEach((test, idx) => testGetManifestTableSettings.apply(this, [...[test.floorPlan, test.appTableSettings, test.componentSettings, test.variantSettings, test.expectedSettings], idx + 1]));



		const aGetSelectedTabKeyTestInput = [
			{
				localId: "smartTable-variant1",
				selectedKey: "variant1",
				expectedKey: "variant1"

			},
			{
				localId: "smartTable-variant2",
				selectedKey: "variant2",
				expectedKey: "variant2"
			},
			{
				localId: "smartTable-variant3",
				selectedKey: "variant3",
				expectedKey: "variant3"
			}
		];


		aGetSelectedTabKeyTestInput.forEach((test, idx) => {
			QUnit.test("getSelectedTabKey " + (idx + 1), function (assert) {
				const getSelectedTabKey = this.oTestablePrivateStub.getSelectedTabKey;
				designtimeUtilsStub.getLocalId.returns(test.localId);

				const sTabKey = getSelectedTabKey(this.oSmartTable);
				assert.strictEqual(sTabKey, test.expectedKey, "Selected tab key is correct");


			});
		});



		QUnit.test("getVariantInfo", function (assert) {
			const getVariantInfo = this.oTestablePrivateStub.getVariantInfo;
			this.listReportComponentStub.getQuickVariantSelectionX.returns({
				variants: {
					variant1: { key: "variant1" },
					variant2: { key: "variant2" }
				}
			});

			const testInput = [
				{ selectedKey: "variant1", expectedKey: "variant1" },
				{ selectedKey: "variant2", expectedKey: "variant2" },
				{ selectedKey: "variant3", expectedKey: "error" }
			];

			for (const input of testInput) {
				if (input.expectedKey !== "error") {
					const aVariantInfo = getVariantInfo(this.listReportComponentStub, input.selectedKey);
					assert.ok(aVariantInfo, "Variant info retrieved successfully");
					assert.strictEqual(aVariantInfo[0], input.expectedKey, "Variant key is correct");
					continue;
				}
				assert.throws(() => {
					getVariantInfo(this.listReportComponentStub, input.selectedKey);
				});
			}
		});



		QUnit.test("getAllowedDesigntimeSettings", function (assert) {
			designtimeUtils.getOwnerComponentFor.returns(this.objectPageComponentStub);
			// sinon.stub(SmartTableDesigntime, "getComponent").returns(oComponent);
			const aSettings = this.oTestablePrivateStub.getAllowedDesigntimeSettings(this.oSmartTable);
			assert.ok(aSettings, "Designtime settings retrieved successfully");
			assert.ok(Array.isArray(aSettings), "Designtime settings is an array");
			assert.ok(aSettings.length > 0, "Designtime settings is greater than 0");
		});

		const getPathForTableSettingsTestInput = [
			{
				type: "type",
				scope: "Page",
				parentComponentName: "sap.suite.ui.generic.template.ObjectPage",
				sectionKey: "section1",
				expectedPath: "component/settings/sections/section1/tableSettings/type"

			},
			{
				type: "type",
				scope: "Application",
				parentComponentName: "sap.suite.ui.generic.template.ObjectPage",
				sectionKey: "section1",
				expectedPath: "component/settings/sections/section1/tableSettings/type"
			},
			{
				type: "type",
				scope: "Control",
				parentComponentName: "sap.suite.ui.generic.template.ObjectPage",
				sectionKey: "section1",
				expectedPath: "component/settings/sections/section1/tableSettings/type"
			},
			// list report component, control scope, no variant
			{
				type: "type",
				scope: "Control",
				parentComponentName: "sap.suite.ui.generic.template.ListReport",
				sectionKey: "section1",
				expectedPath: "component/settings/tableSettings/type"
			}
		];

		getPathForTableSettingsTestInput.forEach((test, idx) => {
			QUnit.test(`getPathForTableSettings ${idx + 1} - ${test.parentComponentName} - ${test.scope}`, function (assert) {
				const getPathForTableSettings = this.oTestablePrivateStub.getPathForTableSettings;
				const getPath = getPathForTableSettings(test.type, true);
				const sPath = getPath({
					sParentComponentName: test.parentComponentName,
					sSectionKey: test.sectionKey,
					sScope: test.scope
				});
				assert.strictEqual(sPath, test.expectedPath, "Path for table settings is correct");
			});
		});

		QUnit.test("getRuntimeAdapationProperties with different settings", function (assert) {
			const getRuntimeAdapationProperties = this.oTestablePrivateStub.getRuntimeAdapationProperties;
			const aDesigntimeSettings = [
				{ id: "type", value: "ResponsiveTable" },
				{ id: "multiSelect", value: false },
				{ id: "createMode", value: "Inline" },
				{ id: "selectAll", value: false }
			];
			const oTableSettings = { type: "GridTable", multiSelect: true, createMode: "NewPage", selectAll: true };
			const mPropertyValues = getRuntimeAdapationProperties(aDesigntimeSettings, oTableSettings);
			assert.strictEqual(mPropertyValues.type, "GridTable", "Table type is correct");
			assert.strictEqual(mPropertyValues.multiSelect, true, "MultiSelect is correct");
			assert.strictEqual(mPropertyValues.createMode, "NewPage", "CreateMode is correct");
			assert.strictEqual(mPropertyValues.selectAll, true, "SelectAll is correct");
		});




		QUnit.test("fnOpenTableConfigurationDialog with different property bags", async function (assert) {
			const done = assert.async();
			const sTestScope = null;
			const fnOpenTableConfigurationDialog = this.oTestablePrivateStub.fnOpenTableConfigurationDialog;
			designtimeUtilsStub.getOwnerComponentFor.returns(this.listReportComponentStub);
			designtimeUtilsStub.getSettings.returns([{}]);
			designtimeUtilsStub.openAdaptionDialog.returns(Promise.resolve({ scope: sTestScope }));
			designtimeUtilsStub.extractChanges.returns({});
			designtimeUtilsStub.getLocalId.returns("smartTable");

			const oDialogPromise = fnOpenTableConfigurationDialog(this.oSmartTable, { someProperty: "someValue" });


			assert.ok(oDialogPromise instanceof Promise, "Dialog promise returned successfully");
			assert.ok(designtimeUtilsStub.openAdaptionDialog.calledWith(sinon.match.array, sinon.match.object, sinon.match.object, sinon.match.string, sinon.match.object), "The openAdaptionDialog is called with the correct parameters");

			const aOpenDialogArgs = designtimeUtilsStub.openAdaptionDialog.getCall(0).args;
			const aTableContent = aOpenDialogArgs[0];


			assert.ok(aTableContent.length >= 1, "At least Scope setting is passed");
			// aTableContent[0] =  Scope setting
			assert.ok(aTableContent[0].control.some(oControlSetting => oControlSetting.id === "scope"), "Scope setting is passed");

			await oDialogPromise;
			// extractChanges called with correct parameters
			assert.ok(designtimeUtilsStub.extractChanges.calledWith(sinon.match.object, sinon.match.object, sinon.match.array, sinon.match.object, sinon.match.object), "The extractChanges is called with the correct parameters");

			const aExtractedChangesArgs = designtimeUtilsStub.extractChanges.getCall(0).args;
			const mPathParameters = aExtractedChangesArgs[4];
			const sDefaultScope = "Page";
			const expectedPathParameters = {
				sChangeType: "appdescr_ui_generic_app_changePageConfiguration",
				sParentComponentName:
					"sap.suite.ui.generic.template.ListReport",
				sSectionKey: null,
				sSelectedVariantKey: null,
				sScope: sTestScope || sDefaultScope
			};

			assert.deepEqual(mPathParameters, expectedPathParameters, "The path parameters are correct");
			done();
		});
	});

});

