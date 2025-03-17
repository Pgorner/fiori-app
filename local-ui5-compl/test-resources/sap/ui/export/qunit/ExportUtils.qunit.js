sap.ui.define([
	"sap/base/config",
	"sap/base/i18n/Formatting",
	"sap/base/i18n/Localization",
	"sap/ui/core/Element",
	"sap/ui/core/InvisibleMessage",
	"sap/ui/core/library",
	"sap/ui/core/LocaleData",
	"sap/ui/core/util/MockServer",
	"sap/ui/export/ExportUtils",
	"sap/ui/export/library",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/odata/v2/ODataTreeBinding",
	"sap/ui/model/odata/v4/ODataListBinding",
	"sap/ui/performance/trace/FESRHelper",
	"sap/ui/thirdparty/sinon-qunit"
	/* Sinon itself already part of MockServer */
], function(BaseConfig, Formatting, Localization, Element, InvisibleMessage, coreLibrary, LocaleData, MockServer, ExportUtils, exportLibrary, Filter, FilterOperator, ODataModel, ODataTreeBinding, ODataListBinding, FESRHelper, SinonQUnit) {
	"use strict";

	/* global QUnit, sinon */

	let oMockServer, oModel;
	const CalendarType = coreLibrary.CalendarType;
	const Destination = exportLibrary.Destination;
	const EdmType = exportLibrary.EdmType;
	const FileType = exportLibrary.FileType;
	const Status = exportLibrary.Status;

	/* Create mock server */
	const sPath = sap.ui.require.toUrl("sap/ui/export/mock");

	/* Export requires an absolute path */
	const sServiceUrl = "https://fake.host.com/localService/";

	/* Default config for export settings */
	const oDefaultConfig = {
		fileName: "Standard",
		fitToPage: false,
		fileType: "XLSX",
		splitCells: false,
		destination: Destination.LOCAL,
		doEnableAccessibility: false,
		includeFilterSettings: false,
		pdfArchive: false,
		addDateTime: false,
		fontSize: 10,
		orientation: "LANDSCAPE",
		paperSize: "DIN_A4",
		signature: false,
		signatureReason: "",
		showPageNumber: true
	};

	const mCapabilities = {
		XLSX: {},
		PDF: {
			DocumentDescriptionReference: "../../../../default/iwbep/common/0001/$metadata",
			DocumentDescriptionCollection: "MyDocumentDescriptions",
			ArchiveFormat: false,
			Border: true,
			CoverPage: true,
			FitToPage: false,
			FontName: true,
			FontSize: true,
			Margin: true,
			Signature: false,
			HeaderFooter: true,
			ResultSizeDefault: 5000,
			ResultSizeMaximum: 20000
		}
	};

	const mFakeDataSource = {
		uri: "https://some.fake.host/with/fake/path",
		type: "odata",
		version: "1.0"
	};

	QUnit.module("ExportUtils", {
		before: function() {
			oMockServer = new MockServer({
				rootUri: sServiceUrl
			});
			oMockServer.simulate(sPath + "/metadata.xml", sPath + "/mockdata");
			oMockServer.start();

			oModel = new ODataModel(sServiceUrl);
		},
		after: function() {
			oMockServer.stop();
			oModel.destroy();
			oMockServer.destroy();
		}
	});

	QUnit.test("interceptUrl", function (assert) {
		const sUrl1 = "http://www.sap.com";
		const sUrl2 = "http://www.sap.de";

		const done = assert.async();

		assert.strictEqual(ExportUtils.interceptUrl(sUrl1), sUrl1, "No Interception done when no Interceptservice available");

		const oFakeInterceptService = {
			getInstance: () => { return null; }
		};
		sap.ui.define(ExportUtils._INTERCEPTSERVICE, [], () => {
			return oFakeInterceptService;
		});

		sap.ui.require([ExportUtils._INTERCEPTSERVICE], () => {

			assert.strictEqual(ExportUtils.interceptUrl(sUrl1), sUrl1, "No Interception done when Interceptservice has no instance");

			oFakeInterceptService.getInstance = () => {return oFakeInterceptService;};
			assert.strictEqual(ExportUtils.interceptUrl(sUrl1), sUrl1, "No Interception done when Interceptservice has no interceptUrl function");

			oFakeInterceptService.interceptUrl = function(sUrl) {
				return sUrl2;
			};
			assert.strictEqual(ExportUtils.interceptUrl(sUrl1), sUrl2, "Interception done when Interceptservice has interceptUrl function");

			done();
		});
	});

	QUnit.test("fetchDataSource - no DataSource available", function(assert) {
		return ExportUtils.fetchDataSource().then((oDataSource) => {
			assert.notOk(oDataSource, "DataSource is empty because there is no DataSource available");
		}).catch(() => {
			assert.ok(false, "Function fetchDataSource should never reject");
		});
	});

	QUnit.test("fetchDataSource - DataSource available", function(assert) {
		const sFileShareSupportModuleName = "sap/ui/export/FileShareSupport";

		const oStub = sinon.stub(BaseConfig, "get").callsFake(function(mParameters) {
			if (mParameters.name === "sapUiFileShareSupport") {
				return sFileShareSupportModuleName;
			} else {
				return oStub.wrappedMethod.call(this, mParameters);
			}
		});

		sap.ui.define(sFileShareSupportModuleName, [], () => {
			return {
				getDataSource: () => {
					return Promise.resolve(mFakeDataSource);
				}
			};
		});

		return ExportUtils.fetchDataSource().then((oDataSource) => {
			assert.ok(oDataSource, "DataSource is empty because there is no DataSource available");
		}).catch(() => {
			assert.ok(false, "Function fetchDataSource should never reject");
		}).finally(() => {
			oStub.restore();
		});
	});

	QUnit.test("getExportSettingsViaDialog - with default configuration", async function(assert) {
		const oExportCapabilities = { "XLSX": {} };
		let oDialog;

		const oUserConfig = await ExportUtils.getExportSettingsViaDialog(null, oExportCapabilities, null, (oExportSettingsDialog) => {
			const sStepName = "OI:EXP:LOC:XLS";
			const oExportButton = oExportSettingsDialog.getBeginButton();

			oDialog = oExportSettingsDialog;

			assert.ok(oDialog.isOpen(), "Export Settings Dialog is open");

			oExportButton.firePress();
			assert.ok(oDialog._bSuccess, "Export triggered");
			assert.equal(FESRHelper.getSemanticStepname(oExportButton, "press"), sStepName, "Correct FESR StepName");
		});

		assert.deepEqual(oUserConfig, oDefaultConfig, "Promise returned with default export config data");
		oDialog.destroy();
	});

	QUnit.test("getExportSettingsViaDialog - triggering onFileTypeChange and onDestinationChange (GSHEET)", async function(assert) {
		const oExportCapabilities = {
			"XLSX": {},
			"PDF": {},
			"GSHEET": {}
		};
		const oCustomConfig = {
			fileType: FileType.GSHEET,
			destination: Destination.REMOTE
		};
		let oDialog;

		const oUserConfig = await ExportUtils.getExportSettingsViaDialog(oCustomConfig, oExportCapabilities, true, null, (oExportSettingsDialog) => {
			const sStepName = "OI:EXP:CL:GS";
			const oModel = oExportSettingsDialog.getModel();

			const oExportButton = oExportSettingsDialog.getBeginButton();
			oDialog = oExportSettingsDialog;

			Element.getElementById("exportSettingsDialog-fileType").setSelectedKey(FileType.GSHEET);

			assert.equal(oModel.getProperty("/fileType"), FileType.GSHEET, "file type applied to the export settings dialog");
			assert.equal(oModel.getProperty("/destination"), Destination.REMOTE, "destination applied to the export settings dialog");
			assert.ok(oDialog.isOpen(), "Export Settings Dialog is open");

			oExportButton.firePress();
			assert.ok(oDialog._bSuccess, "Export triggered");
			assert.equal(FESRHelper.getSemanticStepname(oExportButton, "press"), sStepName, "Correct FESR StepName");
		});

		assert.notDeepEqual(oUserConfig, oDefaultConfig, "Default config is overwritten with custom config");
		oDialog.destroy();
	});

	QUnit.test("getExportSettingsViaDialog - triggering onFileTypeChange and onDestinationChange (PDF)", async function(assert) {
		const oExportCapabilities = {
			"XLSX": {},
			"PDF": {},
			"GSHEET": {}
		};
		const oCustomConfig = {
			fileType: FileType.PDF
			//destination is default local
		};
		let oDialog;

		const oUserConfig = await ExportUtils.getExportSettingsViaDialog(oCustomConfig, oExportCapabilities, true, null, (oExportSettingsDialog) => {
			const sStepName = "OI:EXP:LOC:PDF";
			const oModel = oExportSettingsDialog.getModel();

			const oExportButton = oExportSettingsDialog.getBeginButton();
			oDialog = oExportSettingsDialog;

			Element.getElementById("exportSettingsDialog-fileType").setSelectedKey(FileType.PDF);

			assert.equal(oModel.getProperty("/fileType"), FileType.PDF, "Custom config for file type applied to the export settings dialog");
			assert.equal(oModel.getProperty("/destination"), Destination.LOCAL, "Custom config for destination applied to the export settings dialog");
			assert.ok(oDialog.isOpen(), "Export Settings Dialog is open");

			oExportButton.firePress();
			assert.ok(oDialog._bSuccess, "Export triggered");
			assert.equal(FESRHelper.getSemanticStepname(oExportButton, "press"), sStepName, "Correct FESR StepName");
		});

		assert.notDeepEqual(oUserConfig, oDefaultConfig, "Default config is overwritten with custom config");
		oDialog.destroy();
	});

	QUnit.test("getExportSettingsViaDialog - triggering onFileTypeChange and onDestinationChange (XLSX)", async function(assert) {
		const oExportCapabilities = {
			"XLSX": {},
			"PDF": {},
			"GSHEET": {}
		};
		const oCustomConfig = {
			fileType: FileType.XLSX,
			destination: Destination.REMOTE
		};
		let oDialog;

		const oUserConfig = await ExportUtils.getExportSettingsViaDialog(oCustomConfig, oExportCapabilities, true, null, (oExportSettingsDialog) => {
			const sStepName = "OI:EXP:CL:XLS";
			const oModel = oExportSettingsDialog.getModel();

			const oExportButton = oExportSettingsDialog.getBeginButton();
			oDialog = oExportSettingsDialog;

			assert.equal(oModel.getProperty("/fileType"), FileType.XLSX, "Custom config for file type applied to the export settings dialog");
			assert.equal(oModel.getProperty("/destination"), Destination.REMOTE, "Custom config for destination applied to the export settings dialog");
			assert.ok(oDialog.isOpen(), "Export Settings Dialog is open");

			oExportButton.firePress();
			assert.ok(oDialog._bSuccess, "Export triggered");
			assert.equal(FESRHelper.getSemanticStepname(oExportButton, "press"), sStepName, "Correct FESR StepName");
		});

		assert.notDeepEqual(oUserConfig, oDefaultConfig, "Default config is overwritten with custom config");
		oDialog.destroy();
	});

	QUnit.test("getExportSettingsViaDialog - with custom configuration", async function(assert) {
		const oExportCapabilities = {
			"XLSX": {} // default
		};
		const oCustomConfig = {
			fileName: "Products",
			addDateTime: true
		};
		let oDialog;

		const oUserConfig = await ExportUtils.getExportSettingsViaDialog(oCustomConfig, oExportCapabilities, null, (oExportSettingsDialog) => {
			oDialog = oExportSettingsDialog;

			const oModelData = oDialog.getModel().getData();
			const oExportButton = oDialog.getBeginButton();

			assert.equal(oModelData.fileName, "Products", "Custom config for file name applied to the export settings dialog");
			assert.ok(oModelData.addDateTime, "Add date time config applied to export settings dialog");

			oExportButton.firePress();
			assert.ok(oDialog._bSuccess, "Export triggered");
		});

		assert.notDeepEqual(oUserConfig, oDefaultConfig, "Default config is overwritten with custom config");
		oDialog.destroy();
	});

	QUnit.test("getExportSettingsViaDialog - for file name input validation", function(assert) {
		const oExportCapabilities = {
			"XLSX": {} // default
		};
		let oDialog;

		return ExportUtils.getExportSettingsViaDialog(null, oExportCapabilities, null, (oExportSettingsDialog) => {
			oDialog = oExportSettingsDialog;
			const sLongFileName = "This is a very very very very very very very very very very long file name, which exceeds 100 characters";
			const oInput = Element.getElementById(oExportSettingsDialog.getId() + "-fileName");
			const oExportButton = oExportSettingsDialog.getBeginButton();
			const oCancelButton = oExportSettingsDialog.getEndButton();
			const $oInput = oInput.$("inner");

			oInput.focus();
			// input validation for invalid file name
			$oInput.trigger("focus").val("Products?").trigger("input");

			assert.equal(oInput.getValueState(), "Error", "Invalid character found");
			assert.ok(!oExportButton.getEnabled(), "Export button disabled as there is invalid user input");

			// input validation for very long file name which is over 100 characters
			$oInput.trigger("focus").val(sLongFileName).trigger("input");
			assert.ok(oExportButton.getEnabled(), "Export button is enabled, but warning message is also show to the user");
			assert.equal(oInput.getValueState(), "Warning", "Warning text show to user for long file name");

			assert.equal(FESRHelper.getSemanticStepname(oCancelButton, "press"), "OI:EXP:CANCEL", "Correct FESR StepName");
			oCancelButton.firePress();
		}).catch((oResolve) => {
			assert.notOk(oResolve, "No settings are provided when dialog was canceled");
		}).finally(() => {
			oDialog.destroy();
		});
	});

	QUnit.test("parseTechnicalConfiguration", async function (assert) {
		const oResourceBundle = await ExportUtils.getResourceBundle();
		const fnRequireStub = sinon.stub(sap.ui, "require");

		fnRequireStub.withArgs("sap/ushell/Container").returns({
			getServiceAsync: function(sService) {
				return sService === "UserInfo" ? Promise.resolve({
					getFullName: () => {
						return "Anonymous";
					}
				}) : Promise.reject();
			}
		});
		fnRequireStub.callThrough();

		let oUserConfig = await ExportUtils.parseTechnicalConfiguration();

		assert.strictEqual(oUserConfig.name, oResourceBundle.getText("TECHNICAL_INFORMATION"), "Correct Technical name");
		assert.equal(oUserConfig.items.length, 2, "Two items available");
		assert.equal(oUserConfig.items[0].value, "Anonymous", "Correct Username from the service");

		fnRequireStub.restore();
		oUserConfig = await ExportUtils.parseTechnicalConfiguration();

		assert.strictEqual(oUserConfig.name, oResourceBundle.getText("TECHNICAL_INFORMATION"), "Correct Technical name");
		assert.equal(oUserConfig.items.length, 1, "Only one item available");
		assert.equal(oUserConfig.items[0].key, oResourceBundle.getText("CREATED_TIME"), "Creation Time available");
	});

	QUnit.test("getFilters", function (assert) {
		const oListBinding = oModel.bindList("/Users");
		const filterArray = [
			new Filter({
				path: "Currency",
				operator: FilterOperator.EQ,
				value1: "EUR"
			}),
			new Filter({
				path: "Active",
				operator: FilterOperator.EQ,
				value1: true
			}),
			new Filter({
				path: "Salary",
				operator: FilterOperator.BT,
				value1: 5000,
				value2: 10000
			}),
			new Filter({
				path: "Firstname",
				operator: FilterOperator.NotStartsWith,
				value1: "A"
			})
		];

		/* Apply the filters on the binding */
		oListBinding.filter(new Filter({
			filters: filterArray,
			and: true
		}));

		const aFilters = ExportUtils.getFilters(oListBinding);
		assert.ok(aFilters.length == filterArray.length, "The amount of parsed entries is equal to the amount of filter settings");
		filterArray.forEach((oFilter, nIndex) => {
			assert.ok(aFilters.some((oEntry) => {
				return oEntry.getProperty() === oFilter.sPath
					&& oEntry.getValue().indexOf(oFilter.oValue1) > -1;
			}), `Filter no. ${nIndex + 1} is contained in the result`);
		});
	});

	QUnit.test("getFilters for exclude multi-filter", function (assert) {
		const sKey = "Currency";
		const oListBinding = oModel.bindList("/Users");
		const filterArray = [
			new Filter([
				new Filter({
					path: sKey,
					operator: FilterOperator.NE,
					value1: "EUR"
				}),
				new Filter({
					path: sKey,
					operator: FilterOperator.NE,
					value1: "USD"
				})
			], false)
		];

		/* Apply the filters on the binding */
		oListBinding.filter(new Filter({
			filters: filterArray,
			and: true
		}));

		const aFilters = ExportUtils.getFilters(oListBinding);

		assert.equal(aFilters.length, 1, "Grouped entry is being returned"); // Expect one grouped entry
		assert.equal(aFilters[0].getProperty(), sKey, "Property name is as expected");
		assert.ok(aFilters[0].getValue().indexOf("!=") > -1, "NE filter was found");
		assert.ok(aFilters[0].getValue().indexOf("!=") != aFilters[0].getValue().lastIndexOf("!="), "Multiple NE filter were found");
		assert.ok(aFilters[0].getValue().split(";").length > aFilters.length, "Tha value contains multiple entries");
	});

	QUnit.test("getFilters without filters", function(assert) {
		const oListBinding = oModel.bindList("/Users");
		const aFilters = ExportUtils.getFilters(oListBinding);

		assert.ok(Array.isArray(aFilters), "An Array has been returned");
		assert.equal(aFilters.length, 0, "No exception when binding has no filters");
	});

	QUnit.test("getFilters - exceed call stack size", function(assert) {
		let i, oCurrentFilter;

		const fnCreateFilter = (iValue) => {
			return {
				type: "Binary",
				op: "==",
				left: {
					type: "Reference",
					path: "MaintenanceNotification"
				},
				right: {
					"type":"Literal",
					"value": String(iValue).padStart(8, "0")
				}
			};
		};

		const oFilterInfo = oCurrentFilter = {
			left: {
				arg: {
					args: [
						{
							path: "SystemName",
							type: "Reference"
						},
						{
							type: "Literal",
							value: "SAP"
						}
					],
					name: "contains",
					type: "Call"
				},
				op: "!",
				type: "Unary"
			},
			op: "&&",
			right: {},
			type: "Logical"
		};

		// Build tree structure - 4154 is the highest value that works in edge and chrome
		for (i = 0; i < 10000; i++) {
			oCurrentFilter = oCurrentFilter.right;

			oCurrentFilter.type = "Logical";
			oCurrentFilter.op = "||";
			oCurrentFilter.left = fnCreateFilter(i);
			oCurrentFilter.right = {};
		}

		// Add final filter
		oCurrentFilter.right = fnCreateFilter(i);

		const oFakeBinding = {
			isA: sinon.stub().withArgs(["sap.ui.model.ListBinding", "sap.ui.model.TreeBinding"]).returns(true),
			getFilterInfo: sinon.stub().returns(oFilterInfo)
		};

		const aFilters = ExportUtils.getFilters(oFakeBinding);
		assert.equal(aFilters.length, 2, "Filters have been evaluated");
	});

	/**
	 * @deprecated
	 */
	QUnit.test("parseFilterConfiguration", function(assert) {
		const done = assert.async();

		ExportUtils.parseFilterConfiguration().then(function(oFilters) {
			assert.ok(oFilters, "Function returned a result");
			assert.ok(oFilters.name, "Group name is assigned");
			assert.ok(oFilters.items, "Array of items is present");
			assert.equal(oFilters.items.length, 0, "No items available");

			done();
		});
	});

	QUnit.test("_validateProperty", function(assert) {
		const sPropertyName = "test";
		const oContext = {};
		const sDefaultValue = "abc";

		oContext[sPropertyName] = true;
		ExportUtils._validateProperty(oContext, sPropertyName, "boolean");
		assert.ok(oContext[sPropertyName], "Value was accepted");

		ExportUtils._validateProperty(oContext, sPropertyName, "string");
		assert.notOk(oContext[sPropertyName], "Value was rejected");

		oContext[sPropertyName] = sDefaultValue;
		ExportUtils._validateProperty(oContext, sPropertyName, "string");
		assert.ok(oContext[sPropertyName], "Value was accepted");

		ExportUtils._validateProperty(oContext, sPropertyName, "number");
		assert.notOk(oContext[sPropertyName], "Value was rejected");

		oContext[sPropertyName] = true;
		ExportUtils._validateProperty(oContext, sPropertyName, "string", sDefaultValue);
		assert.ok(oContext[sPropertyName] !== true, "Value was discarded");
		assert.ok(oContext[sPropertyName], "Value assigned");
		assert.ok(oContext[sPropertyName] === sDefaultValue, "Default value assigned");
	});

	QUnit.test("_validateString", function(assert) {
		const sPropertyName = "test";
		const oContext = {};
		const sDefaultValue = "abc123";

		oContext[sPropertyName] = 1; // Invalid value
		ExportUtils._validateString(oContext, sPropertyName, sDefaultValue);
		assert.ok(oContext[sPropertyName] !== 1, "Value was discarded");
		assert.ok(oContext[sPropertyName], "Value assigned");
		assert.ok(oContext[sPropertyName] === sDefaultValue, "Default value assigned");

		// Check max length validation
		oContext[sPropertyName] = sDefaultValue;

		const iMaxLength = oContext[sPropertyName].length - 1;
		ExportUtils._validateString(oContext, sPropertyName, sDefaultValue, iMaxLength);
		assert.ok(oContext[sPropertyName] !== sDefaultValue, "Value was adjusted");
		assert.ok(oContext[sPropertyName], "Value assigned");
		assert.ok(oContext[sPropertyName].length === iMaxLength, "Value was truncated");
	});

	QUnit.test("validateFileSettings", function(assert) {
		/* Invalid FileType */
		const sInvalidFileType = "DOCX";
		let mSettings = {
			fileType: sInvalidFileType,
			fileName: "Purchaser Order"
		};

		assert.ok(mSettings.fileName.indexOf(".") < 0, "No file-ending separator contained");
		assert.notOk(mSettings.fileName.toLowerCase().endsWith(mSettings.fileType.toLowerCase()), "Filename does not contain the file ending");

		ExportUtils.validateFileSettings(mSettings);

		assert.notEqual(mSettings.fileType, sInvalidFileType, "Validation changed the invalid type");
		assert.equal(mSettings.fileType, oDefaultConfig.fileType, "Default fileType has been applied");
		assert.ok(mSettings.fileName.indexOf(".")  > -1, "File-ending separator contained");
		assert.ok(mSettings.fileName.toLowerCase().endsWith(mSettings.fileType.toLowerCase()), "Filename contains the type specific file ending");

		/* GSHEET FileType */
		mSettings = {
			fileType: FileType.GSHEET,
			fileName: "Purchaser Order"
		};

		ExportUtils.validateFileSettings(mSettings);
		assert.ok(mSettings.fileName.indexOf(".") < 0, "Must not contain file-extension separator");
		assert.notOk(mSettings.fileName.toLowerCase().endsWith(mSettings.fileType.toLowerCase()), "FileType GSHEET must not add a file extension");

		/* GSHEET FileType */
		mSettings = {
			fileType: FileType.GSHEET,
			fileName: "Purchaser Order"
		};

		ExportUtils.validateFileSettings(mSettings);
		assert.ok(mSettings.fileName.indexOf(".") < 0, "Must not contain file-extension separator");
		assert.notOk(mSettings.fileName.toLowerCase().endsWith(mSettings.fileType.toLowerCase()), "FileType GSHEET must not add a file extension");

		mSettings = {
			fileType: FileType.GSHEET,
			fileName: "Purchaser Order.xlsx"
		};

		ExportUtils.validateFileSettings(mSettings);
		assert.equal(mSettings.fileName.indexOf("."), mSettings.fileName.lastIndexOf("."), "Must not contain an additional file-extension");
		assert.notOk(mSettings.fileName.toLowerCase().endsWith(mSettings.fileType.toLowerCase()), "FileType GSHEET must not add a file extension");
		assert.ok(mSettings.fileName.toLowerCase().endsWith(".xlsx"), "Existing file extension will not be overwritten");
	});

	QUnit.test("validateFileName", function(assert) {
		assert.equal(ExportUtils.validateFileName("Test", FileType.XLSX), "Test.xlsx", "Filename received extension .xlsx");
		assert.equal(ExportUtils.validateFileName("Test", FileType.PDF), "Test.pdf", "Filename received extension .pdf");
		assert.equal(ExportUtils.validateFileName("Test", FileType.CSV), "Test.csv", "Filename received extension .csv");
		assert.equal(ExportUtils.validateFileName("Test", FileType.GSHEET), "Test", "Filename received no extension");

		assert.equal(ExportUtils.validateFileName("Test.xlsx", FileType.XLSX), "Test.xlsx", "Extension correctly detected");
		assert.equal(ExportUtils.validateFileName("Test.pdf", FileType.PDF), "Test.pdf", "Extension correctly detected");
		assert.equal(ExportUtils.validateFileName("Test.csv", FileType.CSV), "Test.csv", "Extension correctly detected");
		assert.equal(ExportUtils.validateFileName("Test.gsheet", FileType.GSHEET), "Test.gsheet", "Filename received no additional extension");

		assert.equal(ExportUtils.validateFileName("Test.pdf", FileType.XLSX), "Test.pdf.xlsx", "Filename received extension .xlsx");
		assert.equal(ExportUtils.validateFileName("Test.xlsx", FileType.PDF), "Test.xlsx.pdf", "Filename received extension .pdf");
		assert.equal(ExportUtils.validateFileName("Test.xlsx", FileType.CSV), "Test.xlsx.csv", "Filename received extension .csv");
		assert.equal(ExportUtils.validateFileName("Test.xlsx", FileType.GSHEET), "Test.xlsx", "Filename received no additional extension");
	});

	QUnit.test("_validateWorkbook", function(assert) {
		let oWorkbook = null;

		assert.throws(() => {
			ExportUtils._validateWorkbook(oWorkbook);
		}, "Throws error in case of invalid configuration");

		oWorkbook = { columns: null };
		assert.throws(() => {
			ExportUtils._validateWorkbook(oWorkbook);
		}, "Throws error in case of invalid configuration");

		/* Validate incorrect definition */
		oWorkbook = {
			columns: [
				{
					type: EdmType.String,
					property: "SampleText",
					template: "{0}"
				}
			],
			context: {
				application: "QUnit Test",
				version: "1.0",
				sheetName: "Datasheet:*[]/\\?"
			}
		};
		const iLength = oWorkbook.columns.length;

		assert.ok(oWorkbook.columns[0].template, "Template is present prior to validation");

		ExportUtils._validateWorkbook(oWorkbook);
		assert.ok(oWorkbook.columns, "Columns still present");
		assert.equal(oWorkbook.columns.length, iLength, "Amount of columns not changed");
		assert.notOk(oWorkbook.columns[0].template, "Template has been removed");
		assert.equal(oWorkbook.context.sheetName, "Datasheet", "Invalid characters have been removed");

		/* Validate Array of properties with type different than "String" */
		oWorkbook = {
			columns: [
				{
					type: EdmType.Date,
					property: ["SampleID", "SampleText"],
					inputFormat: "YYYYMMDD"
				}
			]
		};

		const sInitialType = oWorkbook.columns[0].type;

		assert.ok(Array.isArray(oWorkbook.columns[0].property), "Column uses Array of properties");
		assert.notEqual(oWorkbook.columns[0].type, "String", "Column is not of type String");

		ExportUtils._validateWorkbook(oWorkbook);
		assert.notOk(Array.isArray(oWorkbook.columns[0].property), "Array of properties has been replaced");
		assert.ok(oWorkbook.columns[0].property && typeof oWorkbook.columns[0].property === "string", "Replaced by single property string");
		assert.equal(oWorkbook.columns[0].type, sInitialType, "Column type not changed");

		oWorkbook = {
			columns: [
				{
					type: EdmType.Date,
					property: "SampleDate",
					utc: false
				}
			]
		};

		assert.equal(typeof oWorkbook.columns[0].utc, "boolean", "UTC flag is defined");
		assert.notOk(oWorkbook.columns[0].utc, "UTC flag is set to false");

		ExportUtils._validateWorkbook(oWorkbook);
		assert.equal(typeof oWorkbook.columns[0].utc, "undefined", "UTC flag has been removed for EdmType." + oWorkbook.columns.type);


		oWorkbook = {
			columns: [
				{
					type: EdmType.DateTime,
					property: "SampleDate"
				}
			]
		};

		assert.equal(typeof oWorkbook.columns[0].utc, "undefined", "UTC flag is not defined");
		assert.equal(typeof oWorkbook.columns[0].timezone, "undefined", "Timezone is not explicitly defined");

		sinon.stub(Localization, "getTimezone").returns("America/New_York");

		ExportUtils._validateWorkbook(oWorkbook);
		assert.equal(typeof oWorkbook.columns[0].timezone, "string", "Timezone is of type string");
		assert.equal(oWorkbook.columns[0].timezone, "UTC", "Timezone has been set to UTC per default");
		assert.ok(Localization.getTimezone.notCalled, "getTimezone has not been called");

		Localization.getTimezone.restore();

		oWorkbook = {
			columns: [
				{
					type: EdmType.DateTime,
					property: "SampleDate",
					utc: false
				}
			]
		};

		assert.equal(typeof oWorkbook.columns[0].utc, "boolean", "UTC flag is defined");
		assert.equal(typeof oWorkbook.columns[0].timezone, "undefined", "Timezone is not explicitly defined");

		ExportUtils._validateWorkbook(oWorkbook);
		assert.equal(typeof oWorkbook.columns[0].timezone, "string", "Timezone is of type string");
		assert.equal(oWorkbook.columns[0].timezone, new Intl.DateTimeFormat().resolvedOptions().timeZone, "Local timezone has been set due to utc=false");

		oWorkbook = {
			columns: [
				{
					type: EdmType.DateTime,
					property: "SampleDate",
					utc: false
				}
			]
		};

		assert.equal(typeof oWorkbook.columns[0].utc, "boolean", "UTC flag is defined");
		assert.equal(typeof oWorkbook.columns[0].timezone, "undefined", "Timezone is not explicitly defined");

		sinon.stub(Localization, "getTimezone").returns("America/New_York");

		ExportUtils._validateWorkbook(oWorkbook);
		assert.equal(typeof oWorkbook.columns[0].timezone, "string", "Timezone is of type string");
		assert.ok(Localization.getTimezone.calledOnce, "getTimezone has been called once");
		assert.equal(oWorkbook.columns[0].timezone, Localization.getTimezone(), "User timezone has been set due to utc=false");

		Localization.getTimezone.restore();

		/* Invalid timezoneProperty */
		oWorkbook = {
			columns: [
				{
					type: EdmType.DateTime,
					property: "SampleDate",
					timezoneProperty: "SampleDate"
				}
			]
		};

		ExportUtils._validateWorkbook(oWorkbook);
		assert.notEqual(typeof oWorkbook.columns[0].timezoneProperty, "string", "timezoneProperty has been removed");
		assert.equal(typeof oWorkbook.columns[0].timezoneProperty, "undefined", "timezoneProperty is not defined");

		oWorkbook = {
			columns: [
				{
					type: EdmType.DateTime,
					property: "SampleDate",
					timezoneProperty: "AdditionalProperty,OtherProperty"
				}
			]
		};

		ExportUtils._validateWorkbook(oWorkbook);
		assert.notEqual(typeof oWorkbook.columns[0].timezoneProperty, "string", "timezoneProperty has been removed");
		assert.equal(typeof oWorkbook.columns[0].timezoneProperty, "undefined", "timezoneProperty is not defined");
	});

	QUnit.test("_validateDataSource", function(assert) {
		assert.throws(() => {
			ExportUtils._validateDataSource(null);
		}, "Throws error in case of invalid configuration");

		assert.throws(() => {
			ExportUtils._validateDataSource(true);
		}, "Throws error in case of invalid configuration");

		assert.throws(() => {
			ExportUtils._validateDataSource({
				type: "odata",
				dataUrl: null
			});
		}, "Throws error in case of invalid configuration");

		assert.ok(ExportUtils._validateDataSource({
			type: "odata",
			dataUrl: "/some/random/path",
			serviceUrl: "/some",
			sizeLimit: 500,
			count: 1000,
			downloadLimit: 900,
			useBatch: true
		}) === undefined, "Valid dataSource accepted");

		let oDataSource = {
			type: "oData",
			dataUrl: "/some/random/path",
			serviceUrl: "/some",
			sizeLimit: 250.5,
			count: 1000.123,
			useBatch: true
		};

		ExportUtils._validateDataSource(oDataSource);
		assert.equal(oDataSource.type, "odata", "Case insensitive type interpretation");
		assert.equal(oDataSource.count, null, "Invalid count is being ignored");
		assert.equal(oDataSource.sizeLimit % 1, 0, "sizeLimit is an integer value");

		oDataSource = {
			type: "oData",
			dataUrl: "/some/random/path",
			serviceUrl: "/some",
			count: 1000.23,
			downloadLimit: "null",
			useBatch: true
		};

		ExportUtils._validateDataSource(oDataSource);

		assert.equal(oDataSource.downloadLimit, null, "Invalid downloadLimit is being ignored");

		oDataSource = {
			type: "oData",
			dataUrl: "/some/random/path",
			serviceUrl: "/some",
			count: 1000.23,
			downloadLimit: "NaN",
			useBatch: true
		};
		ExportUtils._validateDataSource(oDataSource);
		assert.equal(oDataSource.downloadLimit, null, "NaN downloadLimit is being ignored");
	});

	QUnit.test("_validateType", function(assert) {
		let oColumn = {
			type: "nUmBer",
			property: "QUnitTest"
		};

		assert.notEqual(oColumn.type, EdmType.Number, "Case sensitive type mismatch");
		ExportUtils._validateType(oColumn);
		assert.equal(oColumn.type, EdmType.Number, "Type fixed");

		oColumn = {
			type: "bOoleAn",
			property: "QUnitTest"
		};
		assert.notEqual(oColumn.type, EdmType.Boolean, "Case sensitive type mismatch");
		ExportUtils._validateType(oColumn);
		assert.equal(oColumn.type, EdmType.Boolean, "Type fixed");

		oColumn = {
			type: "Booolean",
			property: "QUnitTest"
		};
		assert.notOk(EdmType[oColumn.type], "Invalid type");
		ExportUtils._validateType(oColumn);
		assert.equal(oColumn.type, EdmType.String, "Default type applied");

		oColumn = {
			type: "pErcEntaGe",
			property: "QUnitTest"
		};
		assert.notEqual(oColumn.type, EdmType.Percentage, "Case sensitive type mismatch");
		ExportUtils._validateType(oColumn);
		assert.equal(oColumn.type, EdmType.Percentage, "Type fixed");
	});

	QUnit.test("_validateType - Type specific default values", function(assert) {

		/*
		 * Apply custom settings - DO NOT DELETE
		 * This will delete previously cached format
		 * settings in the ExportUtils#getFormatSettings
		 */
		Formatting.setDatePattern("medium", "yyyy-MM-dd");
		Formatting.setTimePattern("medium", "hh:mm:ss a");
		Formatting.setNumberSymbol("group", ",");

		/* Apply default format on Date column */
		let oColumn = {
			property: "SampleDate",
			type: EdmType.Date
		};
		assert.notOk(oColumn.format, "Format property does not exist");

		ExportUtils._validateType(oColumn);
		assert.ok(oColumn.format, "Default format has been applied");
		assert.equal(typeof oColumn.format, "string", "Default format should be of type string");
		assert.equal(oColumn.format, Formatting.getDatePattern("medium").toLowerCase(), "Date format should match format from Formatting facade");

		/* Apply default format on DateTime column */
		oColumn = {
			property: "SampleDateTime",
			type: EdmType.DateTime
		};
		assert.notOk(oColumn.format, "Format property does not exist");

		ExportUtils._validateType(oColumn);
		assert.ok(oColumn.format, "Default format has been applied");
		assert.equal(typeof oColumn.format, "string", "Default format should be of type string");
		assert.ok(oColumn.format.indexOf(Formatting.getDatePattern("medium").toLowerCase()) > -1, "DateTime format should contain date format from Formatting facade");
		assert.ok(oColumn.format.indexOf(Formatting.getTimePattern("medium").slice(0, -1).toLowerCase()) > -1, "DateTime format should contain time format from Formatting facade");

		/* Apply default format on Time column */
		oColumn = {
			property: "SampleTime",
			type: EdmType.Time
		};
		assert.notOk(oColumn.format, "Format property does not exist");

		ExportUtils._validateType(oColumn);
		assert.ok(oColumn.format, "Default format has been applied");
		assert.equal(typeof oColumn.format, "string", "Default format should be of type string");
		assert.ok(oColumn.format.indexOf(Formatting.getTimePattern("medium").slice(0, -1).toLowerCase()) > -1, "DateTime format should contain time format from Formatting facade");

		/* Don't apply default format if format or calendar is already configured  */
		oColumn = {
			property: "SampleDate",
			type: EdmType.Date,
			calendar: CalendarType.Japanese
		};
		assert.ok(typeof oColumn.format === "undefined", "format property does not exist");

		ExportUtils._validateType(oColumn);
		assert.ok(typeof oColumn.format === "undefined", "format property does not exist");

		oColumn = {
			property: "SampleDateTime",
			type: EdmType.DateTime,
			format: "YYYY-MM-DD HH:MM:SS"
		};
		assert.ok(typeof oColumn.calendar === "undefined", "calendar property does not exist");

		ExportUtils._validateType(oColumn);
		assert.ok(typeof oColumn.calendar === "undefined", "calendar property does not exist");

		/* Reset custom settings */
		Formatting.setDatePattern("medium", null);
		Formatting.setTimePattern("medium", null);
		Formatting.setNumberSymbol("group", null);
	});

	QUnit.test("getFormatSettings", function(assert) {

		/* Reset custom settings */
		Formatting.setDatePattern("medium", null);
		Formatting.setTimePattern("medium", null);
		Formatting.setNumberSymbol("group", null);

		let oSettings = ExportUtils.getFormatSettings();

		assert.ok(oSettings, "FormatSettings should be available");
		assert.equal(oSettings.calendar, CalendarType.Gregorian, "Default CalendarType should be Gregorian");
		assert.equal(oSettings.datePattern, undefined, "No datePattern should be defined");
		assert.equal(oSettings.dateTimePattern, undefined, "No dateTimePattern should be defined");
		assert.equal(oSettings.timePattern, undefined, "No timePattern should be defined");

		/*
		 * Apply custom settings. This will delete
		 * previously cached format settings in the
		 * ExportUtils#getFormatSettings.
		 */
		Formatting.setCalendarType(CalendarType.Japanese);
		Formatting.setDatePattern("medium", "Gyy.MM.dd");

		oSettings = ExportUtils.getFormatSettings();

		assert.ok(oSettings, "FormatSettings should be available");
		assert.equal(oSettings.calendar, CalendarType.Japanese, "CalendarType should be Japanese");
		assert.notEqual(oSettings.datePattern, undefined, "datePattern should be defined");
		assert.equal(typeof oSettings.datePattern, "string", "datePattern should be of type string");
		assert.equal(oSettings.datePattern, Formatting.getDatePattern("medium").toLowerCase(), "datePattern should match the Formatting facade datePattern");
		assert.equal(oSettings.timePattern, undefined, "No timePattern should be defined");
		assert.equal(oSettings.dateTimePattern, undefined, "No dateTimePattern should be defined unless datePattern and timePattern are both available");

		/*
		 * Apply custom settings. This will delete
		 * previously cached format settings in the
		 * ExportUtils#getFormatSettings.
		 */
		Formatting.setTimePattern("medium", "hh:mm:ss a");

		oSettings = ExportUtils.getFormatSettings();

		assert.ok(oSettings, "FormatSettings should be available");
		assert.notEqual(oSettings.datePattern, undefined, "datePattern should be defined");
		assert.equal(typeof oSettings.datePattern, "string", "datePattern should be of type string");
		assert.equal(oSettings.datePattern, Formatting.getDatePattern("medium").toLowerCase(), "datePattern should match the Formatting facade datePattern");
		assert.equal(typeof oSettings.timePattern, "string", "timePattern should be of type string");
		assert.ok(oSettings.timePattern.startsWith(Formatting.getTimePattern("medium").slice(0, -1).toLowerCase()), "timePattern should start with the Formatting facade timePattern");
		assert.notEqual(oSettings.dateTimePattern, undefined, "dateTimePattern should be defined");
		assert.equal(typeof oSettings.timePattern, "string", "dateTimePattern should be of type string");

		/* Reset custom settings */
		Formatting.setCalendarType(null);
		Formatting.setDatePattern("medium", null);
		Formatting.setTimePattern("medium", null);
		Formatting.setNumberSymbol("group", null);
	});

	QUnit.test("_validateScaleCustomizing", function(assert) {
		const oCustomizing = {
			currency: {
				EUR: { digits: 2},
				USD: 2,
				DEFAULT: { scale: 1 }
			},
			unit: [
				{ kg: 3 }
			]
		};

		assert.notOk(Array.isArray(oCustomizing.currency), "Customizing defined as object");
		assert.ok(typeof oCustomizing.currency.EUR !== "undefined", "Currency EUR is defined");
		assert.ok(typeof oCustomizing.currency.USD !== "undefined", "Currency EUR is defined");

		ExportUtils._validateScaleCustomizing(oCustomizing, "currency");

		assert.ok(oCustomizing.currency instanceof Object, "Customizing defined as Object");
		assert.ok(typeof oCustomizing.currency.EUR === "undefined", "Currency EUR has been removed");
		assert.ok(typeof oCustomizing.currency.USD === "undefined", "Currency EUR has been removed");


		assert.ok(Array.isArray(oCustomizing.unit), "Customizing defined as Array");

		ExportUtils._validateScaleCustomizing(oCustomizing, "unit");

		assert.notOk(Array.isArray(oCustomizing.unit), "Customizing is not an Array anymore");
	});

	QUnit.test("splitColumns", function(assert) {
		/* String columns with multiple properties */
		let aColumns = [
			{
				property: ["FirstName","LastName"],
				label: "Full Name",
				template: "{0} {1}"
			}
		];
		let aResult = ExportUtils.splitColumns(aColumns);

		assert.ok(Array.isArray(aResult), "#splitColumns has returned an Array");
		assert.ok(aResult.length > aColumns.length, "The array length increased");
		assert.equal(typeof aResult[0].property, "string", "The column.property is referencing a string");
		assert.equal(typeof aResult[0].template, "undefined", "The template has been removed");
		assert.notEqual(aResult[1].label, aColumns[0].label, "The additional column has a different label");
		assert.ok(aResult[1].label.indexOf(aColumns[0].label) > -1, "Original label is still contained");

		/* String columns with multiple properties and label resolving callback function */
		let fnResolveColumnLabel = sinon.stub();

		fnResolveColumnLabel.withArgs("LastName").returns("Last Name");

		aResult = ExportUtils.splitColumns(aColumns, fnResolveColumnLabel);

		assert.notEqual(aResult[1].label, aColumns[0].label, "The additional column has a different label");
		assert.equal(aResult[0].label, aColumns[0].label, "Original label is still used");

		/* String columns with multiple properties and label resolving callback function for all columns */
		fnResolveColumnLabel.withArgs("FirstName").returns("First Name");

		aResult = ExportUtils.splitColumns(aColumns, fnResolveColumnLabel);

		assert.notEqual(aResult[1].label, aColumns[0].label, "The additional column has a different label");
		assert.notEqual(aResult[0].label, aColumns[0].label, "Original label is still contained");
		assert.equal(aResult[0].label, "First Name", "Original label has been replaced");

		aColumns = [
			{
				property: "SampleCurrency",
				label: "SampleColumn",
				unitProperty: "CurrencyCode",
				type: EdmType.Currency
			},
			{
				property: "SampleUnit",
				label: "SampleColumn",
				unitProperty: "UnitOfMeasure",
				type: EdmType.Number
			}
		];

		aResult = ExportUtils.splitColumns(aColumns);
		assert.ok(aResult.length > aColumns.length, "The array length increased");
		assert.equal(aResult.length, aColumns.length * 2, "All columns have been split up");
		assert.notEqual(aResult[1].label, aColumns[0].label, "The additional column has a different label");
		assert.ok(aResult[1].label.indexOf(aColumns[0].label) > -1, "Original label is still contained");
		assert.notEqual(aResult[3].label, aColumns[1].label, "The additional column has a different label");
		assert.ok(aResult[3].label.indexOf(aColumns[1].label) > -1, "Original label is still contained");
		assert.equal(typeof aResult[0].unitProperty, "string", "The unitProperty needs to be removed");
		assert.equal(typeof aResult[0].displayUnit, "boolean", "Property displayUnit is defined");
		assert.equal(aResult[0].displayUnit, false, "Property displayUnit was set accordingly");
		assert.equal(typeof aResult[2].unitProperty, "string", "The unitProperty needs to be kept");
		assert.equal(aResult[2].displayUnit, false, "Property displayUnit was set to false");

		aColumns = [
			{
				property: "SampleCurrency",
				label: "SampleColumn",
				unitProperty: "CurrencyCode",
				displayUnit: false,
				type: EdmType.Currency
			}
		];

		aResult = ExportUtils.splitColumns(aColumns);
		assert.equal(aResult.length, aColumns.length, "The array length remains the same");
		assert.equal(aResult[0], aColumns[0], "The column settings have not been adjusted");

		aColumns = [
			{
				property: "SampleDateTime",
				label: "SampleColumn",
				timezoneProperty: "Timezone"
			}
		];

		fnResolveColumnLabel = sinon.stub().returns("anotherLabel");

		aResult = ExportUtils.splitColumns(aColumns, fnResolveColumnLabel);
		assert.ok(aResult.length > aColumns.length, "The array length increased");
		assert.notEqual(aResult[1].label, aColumns[0].label, "The additional column has a different label");
		assert.ok(aResult[1].label.indexOf(aColumns[0].label) === -1, "Original label is not contained");
		assert.ok(fnResolveColumnLabel.calledOnce, "Resolve column label function has been called");
		assert.ok(fnResolveColumnLabel.calledWith(aColumns[0].timezoneProperty), "Resolve column label function was called with correct property name");
		assert.equal(aResult[1].label, "anotherLabel", "Label of additional column resolved");
		assert.equal(typeof aResult[0].timezoneProperty, "string", "The unitProperty needs to be removed");
		assert.equal(typeof aResult[0].displayTimezone, "boolean", "Property displayUnit is defined");
		assert.equal(aResult[0].displayTimezone, false, "Property displayTimezone was set accordingly");
		assert.equal(aResult[1].property, aColumns[0].timezoneProperty, "Additional column is referencing the timezoneProperty");
	});

	QUnit.test("getExportInstance", async function(assert) {
		const mExportCapabilities = JSON.parse(JSON.stringify(mCapabilities));

		const oExportInstanceStub = sinon.stub();
		const fnRequire = sinon.stub(sap.ui, "require");
		const mSettings = {
			fileType: "PDF"
		};
		const mCloudFileInfo = {
			FileShare: "DEV_123456",
			FileShareItem: "abcd-efgh-ijkl-mnop",
			FileShareItemName: "Books.pdf",
			FileShareItemContentType: "application/pdf"
		};

		fnRequire.withArgs(["sap/ui/export/Spreadsheet"]).callsFake((vDependencies, fnCallback) => {
			fnCallback(oExportInstanceStub);
		});
		fnRequire.withArgs(["sap/ui/export/PortableDocument"]).callsFake((vDependencies, fnCallback) => {
			fnCallback(oExportInstanceStub);
		});
		fnRequire.callThrough();

		await ExportUtils.getExportInstance(mSettings, mExportCapabilities, mCloudFileInfo);
		assert.ok(oExportInstanceStub.calledWith(mSettings, mExportCapabilities[mSettings.fileType], mCloudFileInfo), "PDF Export instance has been created with the correct parameters");

		fnRequire.restore();
	});

	QUnit.test("getHierarchyLevel", function(assert) {
		/* No binding */
		let vResult = ExportUtils.getHierarchyLevel();
		assert.equal(vResult, undefined, "Returns undefined if no binding is provided");

		/* OData V2 */
		let oBinding = sinon.createStubInstance(ODataTreeBinding);
		oBinding.getTreeAnnotation.withArgs("hierarchy-level-for").returns("DistanceFromRoot");
		oBinding.isA.withArgs("sap.ui.model.odata.v2.ODataTreeBinding").returns(true);
		oBinding.isA.returns(false);

		vResult = ExportUtils.getHierarchyLevel(oBinding);
		assert.ok(oBinding.getTreeAnnotation.calledOnce, "ODataTreeBinding#getTreeAnnotation was called once");
		assert.equal(vResult, "DistanceFromRoot", "Property name was returned correctly");

		/* OData V4 */
		oBinding = sinon.createStubInstance(ODataListBinding);
		oBinding.getAggregation.withArgs(true).returns({
			$DistanceFromRoot: "DistanceFromRoot"
		});
		oBinding.getAggregation.returns({});
		oBinding.isA.withArgs("sap.ui.model.odata.v4.ODataListBinding").returns(true);
		oBinding.isA.returns(false);

		vResult = ExportUtils.getHierarchyLevel(oBinding);
		assert.ok(oBinding.getAggregation.calledOnce, "v4.ODataListBinding#getAggregation was called once");
		assert.ok(oBinding.getAggregation.firstCall.calledWith(true), "v4.ODataListBinding#getAggregation was called with bVerbose flag set to true");
		assert.equal(vResult, "DistanceFromRoot", "Property name was returned correctly");

		/* OData V4 without hierarchies */
		oBinding = sinon.createStubInstance(ODataListBinding);
		oBinding.isA.withArgs("sap.ui.model.odata.v4.ODataListBinding").returns(true);
		oBinding.isA.returns(false);

		vResult = ExportUtils.getHierarchyLevel(oBinding);
		assert.equal(vResult, undefined, "Property not present");
	});

	QUnit.test("getHierarchyDrillState", function(assert) {
		/* No binding */
		let vResult = ExportUtils.getHierarchyDrillState();
		assert.equal(vResult, undefined, "Returns undefined if no binding is provided");

		/* OData V2 */
		let oBinding = sinon.createStubInstance(ODataTreeBinding);
		oBinding.getTreeAnnotation.withArgs("hierarchy-drill-state-for").returns("DrillState");
		oBinding.isA.withArgs("sap.ui.model.odata.v2.ODataTreeBinding").returns(true);
		oBinding.isA.returns(false);

		vResult = ExportUtils.getHierarchyDrillState(oBinding);
		assert.ok(oBinding.getTreeAnnotation.calledOnce, "ODataTreeBinding#getTreeAnnotation was called once");
		assert.equal(vResult, "DrillState", "Property name was returned correctly");

		/* OData V4 */
		oBinding = sinon.createStubInstance(ODataListBinding);
		oBinding.getAggregation.withArgs(true).returns({
			$DrillState: "DrillState"
		});
		oBinding.getAggregation.returns({});
		oBinding.isA.withArgs("sap.ui.model.odata.v4.ODataListBinding").returns(true);
		oBinding.isA.returns(false);

		vResult = ExportUtils.getHierarchyDrillState(oBinding);
		assert.ok(oBinding.getAggregation.calledOnce, "v4.ODataListBinding#getAggregation was called once");
		assert.ok(oBinding.getAggregation.firstCall.calledWith(true), "v4.ODataListBinding#getAggregation was called with bVerbose flag set to true");
		assert.equal(vResult, "DrillState", "Property name was returned correctly");

		/* OData V4 without hierarchies */
		oBinding = sinon.createStubInstance(ODataListBinding);
		oBinding.isA.withArgs("sap.ui.model.odata.v4.ODataListBinding").returns(true);
		oBinding.isA.returns(false);

		vResult = ExportUtils.getHierarchyDrillState(oBinding);
		assert.equal(vResult, undefined, "Property not present");
	});

	QUnit.test("showPageNumber", async function(assert) {
		const mExportCapabilities =  JSON.parse(JSON.stringify(mCapabilities));

		let oDialog;
		let oUserConfig = await ExportUtils.getExportSettingsViaDialog(null, mExportCapabilities, null, (oExportSettingsDialog) => {
			oDialog = oExportSettingsDialog;

			assert.ok(oDialog.isOpen(), "Export Settings Dialog is open");
			const oExportButton = oDialog.getBeginButton();
			oExportButton.firePress();
			assert.ok(oDialog._bSuccess, "Export triggered");
		});

		assert.ok(oUserConfig.showPageNumber, "Generated PDF has page numbers");

		mExportCapabilities.PDF.HeaderFooter = false;
		oUserConfig = await ExportUtils.getExportSettingsViaDialog(null, mExportCapabilities, null, (oExportSettingsDialog) => {
			oDialog = oExportSettingsDialog;

			const oExportButton = oDialog.getBeginButton();
			oExportButton.firePress();
		});

		assert.notOk(oUserConfig.showPageNumber, "Generated PDF does not page numbers");
		oDialog.destroy();
	});

	QUnit.test("getTimezoneTranslations", function(assert) {
		sinon.spy(Localization, "getLanguageTag");
		sinon.spy(LocaleData, "getInstance");

		const mTimezones = ExportUtils.getTimezoneTranslations();
		assert.ok(Localization.getLanguageTag.calledOnce, "Current Locale was requested");
		assert.ok(LocaleData.getInstance.calledOnce, "LocaleData instance was requested");
		assert.ok(mTimezones, "Timezone translations available");

		Localization.getLanguageTag.restore();
		LocaleData.getInstance.restore();
	});

	QUnit.test("announceExportStatus", async function(assert) {
		const oInvisibleMessage = InvisibleMessage.getInstance();
		const oBundle = await ExportUtils.getResourceBundle();

		sinon.stub(oInvisibleMessage, "announce");

		/* Without Status parameter */
		try {
			await ExportUtils.announceExportStatus();
		} catch (oError) {
			assert.ok(true, "Announcement failed due to missing parameter");
		}

		/* With FINISHED parameter */
		await ExportUtils.announceExportStatus(Status.FINISHED);
		assert.ok(oInvisibleMessage.announce.calledOnce, "Text was announced");
		assert.ok(oInvisibleMessage.announce.calledWith(oBundle.getText("MSG_INFO_EXPORT_FINISHED")), "Called with correct parameter");

		oInvisibleMessage.announce.restore();
	});
});