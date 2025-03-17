/**
 * tests for the sap.suite.ui.generic.template.designtime.designtimeUtils
 */

sap.ui.define(["testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/designtime/utils/designtimeUtils",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper"

], function (sinon, designtimeUtils, testableHelper) {
	"use strict";


	let oSandbox;
	QUnit.module("designtimeUtils Tests", {
		beforeEach: function () {
			oSandbox = sinon.sandbox.create();
			this.testableHelperStub = testableHelper.startTest();
			this.oTestablePrivateStub = testableHelper.getStaticStub();

			this.oComponent = {
				getMetadata: oSandbox.stub().returns({
					getComponentName: oSandbox.stub().returns("sap.suite.ui.generic.template.ObjectPage")
				}),
				getSections: oSandbox.stub().returns({
					"testId": {
						tableSettings: {
							type: "ResponsiveTable"
						}
					}
				}),
				getRootControl: oSandbox.stub().returns({
					getLocalId: oSandbox.stub().returnsArg(0)
				}),

				getAppComponent: oSandbox.stub().returns({
					getTableSettings: oSandbox.stub(),
					getLocalId: function (sId) {
						return sId;
					},
					getManifest: sinon.stub()
				}),
				getQuickVariantSelectionX: oSandbox.stub(),
				getId: function () {
					return "testId";
				},
				getEntitySet: oSandbox.stub().returns("EntitySet")
			};
			// testableHelperStub = testableHelper.startTest();
			// oTestablePrivateStub = testableHelper.getStaticStub();
		},
		afterEach: function () {
			oSandbox.restore();
		}
	}, function () {
		QUnit.test("fnCreateAdaptionDialogContent", function (assert) {
			const done = assert.async();
			const items = [];
			const propertyValues = {};
			let unchangedData = {};

			// A fixed list of strings
			const stringEnum = {
				label: "Table Type",
				tooltip: "Define which table type should be used",
				control: [
					{
						id: "type",
						type: "string",
						value: "ResponsiveTable",
						"enum": [
							{ id: "ResponsiveTable", name: "Responsive Table" },
							{ id: "GridTable", name: "Grid Table" },
							{ id: "TreeTable", name: "Tree Table" },
							{ id: "AnalyticalTable", name: "Analytical Table" }
						]
					}
				]
			};
			items.push(stringEnum);

			// A string without fixed list
			const stringNoEnum = {
				label: "Table Title",
				tooltip: "The name of the table to be used",
				control: [{ id: "type", type: "string", value: "ResponsiveTable", "enum": undefined }]
			};
			items.push(stringNoEnum);

			// A boolean
			const bool = {
				label: "Show Header",
				tooltip: "Decide whether the header should be shown or not",
				control: [{ id: "headerVisible", type: "boolean", value: true, "enum": undefined }]
			};
			items.push(bool);

			// A number
			const number = {
				label: "Row Count",
				tooltip: "Define the number of rows that should be shown",
				control: [{ id: "rowCount", type: "number", value: 2, "enum": undefined }]
			};
			items.push(number);

			const stringArray = {
				label: "String Array",
				tooltip: "Define the number of rows that should be shown",
				control: [{ id: "stringArray", type: "string[]", value: ["test1", "test2"], "enum": undefined }]
			};
			items.push(stringArray);

			unchangedData = propertyValues;
			// Create the list that is used as the dialog content
			designtimeUtils.createAdaptionDialogContent(items, propertyValues, unchangedData).then(function (list) {
				// Define the expected types and labels
				const expectedTypes = ["sap.m.Select", "sap.m.Input", "sap.m.CheckBox", "sap.m.Input", "sap.m.MultiInput"];
				const expectedLabels = ["Table Type", "Table Title", "Show Header", "Row Count", "String Array"];

				// Loop through the list items and assert the type and label
				list.getItems().forEach(function (item, index) {
					const thisType = item.getContent()[0].getMetadata().getName();
					const thisLabel = item.getProperty("label");
					assert.strictEqual(thisType, expectedTypes[index]);
					assert.strictEqual(thisLabel, expectedLabels[index]);
				});

			}).finally(function () {
				done();
			});
		});

		QUnit.test("getSettings", function (assert) {
			const mRuntimeSettings = {
				test: "changedtest"
			};
			const aManifestSettingsData = [
				{
					id: "test",
					name: "Test",
					description: "Test",
					value: "test",
					type: "string",
					enums: [
						{ id: "test", name: "test" }
					]
				}
			];
			const aSettings = designtimeUtils.getSettings(mRuntimeSettings, aManifestSettingsData);
			assert.strictEqual(aSettings[0].label, "Test");
			assert.strictEqual(aSettings[0].tooltip, "Test");
			assert.strictEqual(aSettings[0].control[0].type, "string");
			assert.strictEqual(aSettings[0].control[0].enum[0].id, "test");
			assert.strictEqual(aSettings[0].control[0].value, "changedtest");
			assert.strictEqual(aSettings[0].control[0].id, "test");
		});

		QUnit.test("extractChanges", function (assert) {
			const propertyValuesEntered = {
				"test": "changedtest",
				"test2": "changedtest",
				"test3": "changedtest"
			};
			const mUnchangedData = {
				"test": "test",
				"test2": "test",
				"test3": "test"
			};
			const aDesigntimeSettings = [
				{
					id: "test",
					name: "Test",
					description: "Test",
					value: "test",
					type: "string",
					getPath: function (mSmartTableInfo) {
						return "foo/path";
					},
					enums: [
						{ id: "test", name: "test" }
					]

				},
				{
					id: "test2",
					name: "Test2",
					description: "Test2",
					value: "test2",
					type: "string",
					getPath: function (mSmartTableInfo) {
						return "bar/path";
					},
					enums: [
						{ id: "test2", name: "test2" }
					]
				},
				{
					id: "test3",
					name: "Test3",
					description: "Test3",
					value: "test3",
					type: "string",
					getPath: function (mSmartTableInfo) {
						return "foo/bar/path";
					},
					enums: [
						{ id: "test3", name: "test3" }
					]
				}
			];
			const mPathParameters = {
				sParentComponentName: this.oComponent.getMetadata().getComponentName(),
				sFacetId: this.oComponent.getAppComponent().getLocalId(this.oComponent.getId())
			};

			const aChanges = designtimeUtils.extractChanges(propertyValuesEntered, mUnchangedData, aDesigntimeSettings, this.oComponent, mPathParameters);

			assert.equal(aChanges.length, 3, "3 changes should be returned because path is same for 2 changes.");

			const expectedChanges = [
				{
					propertyPath: "foo/path",
					entityPropertyChange: "changedtest"
				},
				{
					propertyPath: "bar/path",
					entityPropertyChange: "changedtest"
				},
				{
					propertyPath: "foo/bar/path",
					entityPropertyChange: "changedtest"
				}
			];

			expectedChanges.forEach((expectedChange, index) => {
				assert.equal(aChanges[index].changeSpecificData.content.parameters.parentPage.component, "sap.suite.ui.generic.template.ObjectPage", "The parent page component should be 'sap.suite.ui.generic.template.ObjectPage'.");
				assert.equal(aChanges[index].changeSpecificData.content.parameters.parentPage.entitySet, "EntitySet", "The entity set should be 'EntitySet'.");
				assert.equal(aChanges[index].changeSpecificData.content.parameters.entityPropertyChange.propertyPath, expectedChange.propertyPath, `The property path should be '${expectedChange.propertyPath}'.`);
				assert.equal(aChanges[index].changeSpecificData.content.parameters.entityPropertyChange.propertyValue, expectedChange.entityPropertyChange, `The property value should be '${expectedChange.entityPropertyChange}'.`);
			});
		});


		QUnit.test("getSupportedGlobalManifestSettings", function (assert) {
			const oAppComponent = this.oComponent.getAppComponent();
			const oTestDefinedManifestSettings = {
				tableSettings: { createMode: true },
				statePreservationMode: true,
				flexibleColumnLayout: true,
				unsupportedSetting: false
			};
			oAppComponent.getManifest.returns({
				"sap.ui.generic.app": {
					settings: oTestDefinedManifestSettings
				}
			});

			const oExpectedSupportedGlobalManifestSettings = {
				tableSettings: { createMode: true },
				statePreservationMode: true,
				flexibleColumnLayout: true
			};

			const oSupportedGlobalManifestSettings = designtimeUtils.getSupportedGlobalManifestSettings(oAppComponent);
			assert.deepEqual(oSupportedGlobalManifestSettings, oExpectedSupportedGlobalManifestSettings, "Supported global manifest settings are correct");
		});

		QUnit.test("getChanges", function (assert) {
			const mChanges = { propertyPath: { value: "propertyChanges", bIsGlobalChange: false } };

			const sChangeType = "ChangeType";

			const oExpectedChanges = [{
				appComponent: this.oComponent.getAppComponent(),
				selector: this.oComponent.getAppComponent(),
				changeSpecificData: {
					appDescriptorChangeType: sChangeType,
					content: {
						parameters: {
							parentPage: {
								component: "sap.suite.ui.generic.template.ObjectPage", //stubbed
								entitySet: "EntitySet"
							},
							entityPropertyChange: {
								propertyPath: "propertyPath",
								operation: "UPSERT",
								propertyValue: "propertyChanges"
							}
						}
					}
				}
			}];

			const aChanges = this.oTestablePrivateStub.getChanges(mChanges, this.oComponent, sChangeType);
			// match the changes not deep equal

			assert.equal(aChanges.length, 1, "Changes array length is correct");
			assert.equal(aChanges[0].appComponent, oExpectedChanges[0].appComponent, "AppComponent is correct");
			assert.equal(aChanges[0].selector, oExpectedChanges[0].selector, "Selector is correct");
			assert.deepEqual(aChanges[0].changeSpecificData, oExpectedChanges[0].changeSpecificData, "ChangeType is correct");

		});

		const aPropertyChangeTests = [
			{
				designtimeSettings: [{ id: "setting1" }, { id: "setting2", bSupportsGlobalScope: true }],
				unchangedData: { setting1: "oldValue", setting2: "oldValue" },
				propertyValues: { setting1: "newValue", setting2: "newValue" },
				mPathParameters: { sScope: "Application" },
				expectedChangedPropertyValues: {
					setting1: {
						value: "newValue",
						bIsGlobalChange: false
					},
					setting2: {
						value: "newValue",
						bIsGlobalChange: true
					}
				},
				title: "getChangedPropertyValues"
			},
			{
				designtimeSettings: [{ id: "setting1" }, { id: "setting2", bSupportsGlobalScope: true }],
				unchangedData: { setting1: "oldValue", setting2: "oldValue" },
				propertyValues: { setting1: "newValue", setting2: "newValue" },
				mPathParameters: { sScope: "Application" },
				expectedChangedPropertyValues: {
					setting1: {
						value: "newValue",
						bIsGlobalChange: false
					},
					setting2: {
						value: "newValue",
						bIsGlobalChange: true
					}
				},
				title: "getChangedPropertyValues"
			},
			{
				designtimeSettings: [
					{
						id: "setting3",
						writeObject: [{ id: "subSetting1" }, { id: "subSetting2", bSupportsGlobalScope: true }]
					}
				],
				unchangedData: { setting3: { subSetting1: "oldValue", subSetting2: "oldValue" } },
				propertyValues: { setting3: { subSetting1: "newValue", subSetting2: "newValue" } },
				mPathParameters: { sScope: "Application" },
				expectedChangedPropertyValues: {
					setting3: {
						value: {
							subSetting1: "newValue",
							subSetting2: "newValue"
						},
						bIsGlobalChange: false
					}
				},
				title: "getChangedPropertyValues with writeObject"
			},
			{
				designtimeSettings: [{ id: "setting4", skipChange: true }],
				unchangedData: { setting4: "oldValue" },
				propertyValues: { setting4: "newValue" },
				mPathParameters: { sScope: "Application" },
				expectedChangedPropertyValues: {},
				title: "getChangedPropertyValues with skipChange"
			},
			{
				designtimeSettings: [{ id: "setting5", bSupportsGlobalScope: false }],
				unchangedData: { setting5: "oldValue" },
				propertyValues: { setting5: "newValue" },
				mPathParameters: { sScope: "Application" },
				expectedChangedPropertyValues: {
					setting5: {
						value: "newValue",
						bIsGlobalChange: false
					}
				},
				title: "getChangedPropertyValues with bSupportsGlobalScope false"
			},
			{
				designtimeSettings: [{ id: "setting6", skipChange: true, bSupportsGlobalScope: true }],
				unchangedData: { setting6: "oldValue" },
				propertyValues: { setting6: "newValue" },
				mPathParameters: { sScope: "Application" },
				expectedChangedPropertyValues: {},
				title: "getChangedPropertyValues with skipChange and bSupportsGlobalScope true"
			},
			{
				designtimeSettings: [
					{
						id: "setting7",
						skipChange: true,
						bSupportsGlobalScope: true,
						writeObject: [{ id: "subSetting1" }, { id: "subSetting2", bSupportsGlobalScope: true }]
					}
				],
				unchangedData: { setting7: { subSetting1: "oldValue", subSetting2: "oldValue" } },
				propertyValues: { setting7: { subSetting1: "newValue", subSetting2: "newValue" } },
				mPathParameters: { sScope: "Application" },
				expectedChangedPropertyValues: {},
				title: "getChangedPropertyValues with skipChange with nested settings and bSupportsGlobalScope true"
			}
		];

		aPropertyChangeTests.forEach(function (oTest,iIdx) {
			QUnit.test(oTest.title + " - " + iIdx, function (assert) {
				const oChangedPropertyValues = this.oTestablePrivateStub.getChangedPropertyValues(oTest.designtimeSettings, oTest.unchangedData, oTest.propertyValues, oTest.mPathParameters);
				assert.deepEqual(oChangedPropertyValues, oTest.expectedChangedPropertyValues, "Changed property values are correct");
			});
		});
	});
});
