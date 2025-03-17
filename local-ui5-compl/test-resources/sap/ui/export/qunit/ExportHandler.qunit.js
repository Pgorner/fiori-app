/*global QUnit, sinon */
sap.ui.define([
	"sap/ui/export/library",
	"sap/ui/export/ExportHandler",
	"sap/ui/export/ExportUtils",
	"sap/ui/thirdparty/sinon-qunit" /* Sinon itself is already part of MockServer */
], function (exportLibrary, ExportHandler, ExportUtils, SinonQUnit) {
	"use strict";

	let oExportHandler;

	const Destination = exportLibrary.Destination;
	const FileType = exportLibrary.FileType;

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
			ResultSizeDefault: 5000,
			ResultSizeMaximum: 20000
		}
	};

	const mSettings = {
		fileName: "SampleExport",
		fileType: FileType.XLSX,
		dataSource: {},
		workbook: {
			columns: {}
		}
	};

	const oFakeContext = {
		destroy: sinon.stub(),
		getProperty: sinon.stub()
			.withArgs("FileShareItemContentLink")
			.returns("https://some.fake.link/path/resource"),
		setProperty: sinon.stub().returns(Promise.resolve()),
		reset: function() {
			this.destroy.resetHistory();
			this.getProperty.resetHistory();
			this.setProperty.resetHistory();
		}
	};

	const oFakeBinding = {
		attachCreateCompleted: (fnEventHandler) => {
			fnEventHandler({
				getParameter: sinon.stub()
					.withArgs("success")
					.returns(true)
					.withArgs("context")
					.returns(oFakeContext),
				getParameters: sinon.stub().returns({
					success: true,
					context: oFakeContext
				})
			});
		},
		create: sinon.stub(),
		detachCreateCompleted: sinon.stub(),
		destroy: sinon.stub(),
		requestContexts: sinon.stub().returns([oFakeContext]),
		reset: function() {
			this.create.resetHistory();
			this.detachCreateCompleted.resetHistory();
			this.requestContexts.resetHistory();
		}
	};

	const oFakeFileShareModel = {
		bindList: sinon.stub().returns(oFakeBinding),
		destroy: sinon.stub(),
		getKeepAliveContext: sinon.stub().returns(oFakeContext),
		reset: function() {
			this.bindList.resetHistory();
			this.destroy.resetHistory();
			this.getKeepAliveContext.resetHistory();
		}
	};

	const mFakeExportSettings = {
		fileName: "ExportSample.xlsx",
		fileType: "XLSX",
		splitCells: false,
		includeFilterSettings: false,
		destination: Destination.REMOTE
	};

	const mFakeFileInfo = {
		FileShare: "TEST",
		FileShareItem: undefined,
		FileShareItemKind: "document",
		FileShareItemName: "ExportSample.xlsx",
		ParentFileShareItem: ""
	};

	const mModuleConfig = {
		beforeEach: function() {
			oExportHandler = new ExportHandler(JSON.parse(JSON.stringify(mCapabilities)));
		},
		afterEach: function () {
			oExportHandler.destroy();
			oExportHandler = null;

			oFakeBinding.reset();
			oFakeContext.reset();
			oFakeFileShareModel.reset();
		}
	};

	function resetSharedStubs() {
		oFakeFileShareModel.getKeepAliveContext.resetHistory();
		oFakeFileShareModel.bindList.resetHistory();

		oFakeBinding.create.resetHistory();
		oFakeBinding.detachCreateCompleted.resetHistory();
		oFakeBinding.requestContexts.resetHistory();

		oFakeContext.getProperty.resetHistory();
		oFakeContext.setProperty.resetHistory();
		oFakeContext.destroy.resetHistory();
	}

	QUnit.module("API", mModuleConfig);

	QUnit.test("attachBeforeExport", function(assert) {
		const done = assert.async();

		assert.expect(7);
		assert.notOk(oExportHandler.mEventRegistry.beforeExport, "No event handler attached");

		oExportHandler.attachBeforeExport(function(oEvent) {
			assert.ok(oEvent.getParameter("exportSettings"), "Export settings available");
			assert.ok(oEvent.getParameter("userExportSettings"), "User secific settings available");
			assert.ok(oEvent.getParameter("filterSettings"), "Filter settings available");
			assert.ok(Array.isArray(oEvent.getParameter("filterSettings")), "Filter settings are stored in an array");

			done();
		});

		assert.ok(oExportHandler.mEventRegistry.beforeExport, "Event is available on the event registry");
		assert.ok(oExportHandler.mEventRegistry.beforeExport.length > 0, "At least one event handler attached");

		oExportHandler.getExportInstance(mSettings).then((oInstance) => {
			oInstance.fireEvent("beforeExport", {
				exportSettings: mSettings
			});
		});
	});

	QUnit.test("constructor", function(assert) {
		assert.ok(oExportHandler.isA("sap.ui.base.EventProvider"), "ExportHandler inherits from EventProvider");
		assert.ok(oExportHandler._mCapabilities, "Export capabilities are referenced");
		assert.ok(oExportHandler._mCapabilities.XLSX, "XLSX capabilities are contained");
		assert.ok(oExportHandler._mCapabilities.PDF, "PDF capabilities are contained");
		assert.ok(oExportHandler._mCapabilities.PDF.isA("sap.ui.export.util.PDFCapabilities"), "PDFCapabilities class used");

		oExportHandler = new ExportHandler();
		assert.ok(oExportHandler._mCapabilities, "Default export capabilities are referenced");
		assert.ok(oExportHandler._mCapabilities.XLSX, "XLSX capabilities are contained");

		oExportHandler = new ExportHandler({
			PDF: {
				DocumentDescriptionReference: "../../../../default/iwbep/common/0001/$metadata",
				ResultSizeMaximum: 20000
			}
		});
		assert.ok(oExportHandler._mCapabilities, "Default export capabilities are referenced");
		assert.notOk(oExportHandler._mCapabilities.PDF, "PDFCapabilities");
	});

	QUnit.test("destroy", async function(assert) {
		oExportHandler.attachBeforeExport(function() { /* Do nothing */});
		oExportHandler._oModel = oFakeFileShareModel;
		oExportHandler._oFileShareBinding = oFakeBinding;

		assert.ok(oExportHandler._mCapabilities, "Export capabilities are cached");
		assert.ok(oExportHandler.mEventRegistry.beforeExport.length > 0, "At least one event handler attached");

		oExportHandler.destroy();

		assert.ok(oFakeBinding.destroy.calledOnce, "FileShare binding has been destroyed");
		assert.ok(oFakeFileShareModel.destroy.calledOnce, "ODataModel has been destroyed");

		assert.notOk(oExportHandler._oModel, "Cached ODataModel has been removed");
		assert.notOk(oExportHandler._oFileShareBinding, "FileShare binding has been removed");
		assert.notOk(oExportHandler._mCapabilities, "Export capabilities have been removed");
		assert.notOk(oExportHandler.mEventRegistry.beforeExport, "No event handler attached");

		try {
			await oExportHandler.exportAs(mSettings, () => { /* Fake callback */});
			assert.ok(false, "Destroyed ExportHandler must not handle further actions");
		} catch (oError) {
			assert.ok(true, "Further actions have been rejected");
		}
	});

	QUnit.test("detachBeforeExport", function(assert) {
		const fnEventHandler = function() { /* Do nothing */};

		oExportHandler.attachBeforeExport(fnEventHandler);

		assert.ok(oExportHandler.mEventRegistry.beforeExport, "Event is available on the event registry");
		assert.ok(oExportHandler.mEventRegistry.beforeExport.length > 0, "At least one event handler attached");

		oExportHandler.detachBeforeExport(fnEventHandler);

		assert.notOk(oExportHandler.mEventRegistry.beforeExport, "No event handler attached");
	});

	QUnit.test('export', async function(assert) {
		const mFakeExportInstance = {
			build: sinon.stub().returns(Promise.resolve()),
			destroy: sinon.stub()
		};

		sinon.stub(oExportHandler, 'getExportInstance').returns(Promise.resolve(mFakeExportInstance));

		await oExportHandler.export(mSettings);
		assert.ok(oExportHandler.getExportInstance.calledOnce, 'ExportHandler#getExportInstance has been called');
		assert.ok(mFakeExportInstance.build.calledOnce, '#build has been called on the export instance');
		assert.ok(mFakeExportInstance.destroy.calledOnce, '#destroy has been called on the export instance');

		mFakeExportInstance.build.resetHistory();
		mFakeExportInstance.destroy.resetHistory();
		oExportHandler.getExportInstance.resetHistory();

		mFakeExportInstance.build = sinon.stub().returns(Promise.reject("Export failed"));

		try {
			await oExportHandler.export(mSettings);
			assert.ok(false, "Export should have failed");
		} catch (oError) {
			assert.ok(true, "Error on export instance was not caught by ExportHandler#export");
		} finally {
			assert.ok(oExportHandler.getExportInstance.calledOnce, 'ExportHandler#getExportInstance has been called');
			assert.ok(mFakeExportInstance.build.calledOnce, '#build has been called on the export instance');
			assert.ok(mFakeExportInstance.destroy.calledOnce, '#destroy has been called on the export instance');
		}

		oExportHandler.getExportInstance.restore();
	});

	QUnit.test("exportAs - local file", async function(assert) {
		const mExportSettings = Object.assign({}, mFakeExportSettings, { destination: Destination.LOCAL });
		const mFakeExportInstance = {
			build: () => { return Promise.resolve(); },
			destroy: () => {}
		};

		sinon.stub(ExportUtils, "fetchDataSource").returns(Promise.resolve());
		sinon.stub(ExportUtils, "getExportSettingsViaDialog").returns(Promise.resolve(mExportSettings));
		sinon.spy(oExportHandler, "getFileShareContexts");
		sinon.stub(oExportHandler, "getRemoteFileLocation").returns(Promise.resolve());
		sinon.stub(oExportHandler, "getExportInstance").returns(Promise.resolve(mFakeExportInstance));

		await oExportHandler.exportAs(mSettings);

		// The function will already be called during the initialization of the ExportHandler instance but the sinon stub is not present at that point in time
		assert.ok(ExportUtils.fetchDataSource.calledOnce, "#fetchDataSource has been called once");
		assert.ok(ExportUtils.getExportSettingsViaDialog.calledOnce, "#getExportSettingsViaDialog has been called");
		assert.ok(oExportHandler.getFileShareContexts.calledOnce, "#getFileShareContexts has been called");
		assert.notOk(oExportHandler.getRemoteFileLocation.called, "#getRemoteFileLocation has not been called");
		assert.ok(oExportHandler.getExportInstance.calledOnce, "#getExportInstance has been called");

		ExportUtils.fetchDataSource.restore();
		ExportUtils.getExportSettingsViaDialog.restore();
		oExportHandler.getFileShareContexts.restore();
		oExportHandler.getRemoteFileLocation.restore();
		oExportHandler.getExportInstance.restore();
	});

	QUnit.test("exportAs - remote file", async function(assert) {
		const mFakeExportInstance = {
			build: () => { return Promise.resolve(); },
			destroy: () => {}
		};

		sinon.stub(ExportUtils, "fetchDataSource").returns(Promise.resolve());
		sinon.stub(ExportUtils, "getExportSettingsViaDialog").returns(Promise.resolve(mFakeExportSettings));
		sinon.spy(oExportHandler, "getFileShareContexts");
		sinon.stub(oExportHandler, "getRemoteFileLocation").returns(Promise.resolve(mFakeFileInfo));
		sinon.stub(oExportHandler, "getExportInstance").returns(Promise.resolve(mFakeExportInstance));

		await oExportHandler.exportAs(mSettings);

		// The function will already be called during the initialization of the ExportHandler instance but the sinon stub is not present at that point in time
		assert.ok(ExportUtils.fetchDataSource.calledOnce, "#fetchDataSource has been called once");
		assert.ok(ExportUtils.getExportSettingsViaDialog.calledOnce, "#getExportSettingsViaDialog has been called");
		assert.ok(oExportHandler.getFileShareContexts.calledOnce, "#getFileShareContexts has been called");
		assert.ok(oExportHandler.getRemoteFileLocation.calledOnce, "#getRemoteFileLocation has been called");
		assert.ok(oExportHandler.getExportInstance.calledOnce, "#getExportInstance has been called");

		ExportUtils.fetchDataSource.restore();
		ExportUtils.getExportSettingsViaDialog.restore();
		oExportHandler.getFileShareContexts.restore();
		oExportHandler.getRemoteFileLocation.restore();
		oExportHandler.getExportInstance.restore();
	});

	QUnit.module("Private functions", mModuleConfig);

	QUnit.test("getExportInstance", async function(assert) {
		const oFakeExportInstance = {
			attachBeforeExport: sinon.stub()
		};

		sinon.stub(ExportUtils, "getExportInstance").resolves(oFakeExportInstance);

		const oInstance = await oExportHandler.getExportInstance(mSettings);
		assert.ok(ExportUtils.getExportInstance.calledOnce, "ExportUtils#getExportInstance was called");
		assert.ok(oInstance.attachBeforeExport.calledOnce, "beforeExport event has been attached");

		ExportUtils.getExportInstance.restore();
	});

	QUnit.test("getExportInstance with user settings and CloudFileInfo", async function(assert) {
		const oFakeExportInstance = {
			attachBeforeExport: sinon.stub()
		};
		const oUserSettings = {
			splitCells: false,
			includeFilterSettings: true
		};
		const mCloudFileInfo = {
			FileShare: "DEV_123456",
			FileShareItem: "abcd-efgh-ijkl-mnop",
			FileShareItemName: "Books.pdf",
			FileShareItemContentType: "application/pdf"
		};

		sinon.stub(ExportUtils, "getExportInstance").resolves(oFakeExportInstance);
		sinon.stub(ExportUtils, "getFilters").returns([]);

		const oInstance = await oExportHandler.getExportInstance(mSettings, oUserSettings, mCloudFileInfo);

		assert.ok(ExportUtils.getExportInstance.calledOnce, "ExportUtils#getExportInstance was called");
		assert.ok(ExportUtils.getExportInstance.calledWith(mSettings, oExportHandler._mCapabilities, mCloudFileInfo), "ExportUtils#getExportInstance was called with the expected parameters");
		assert.ok(ExportUtils.getFilters.calledOnce, "ExportUtils#getExportInstance was called");
		assert.ok(oInstance.attachBeforeExport.calledOnce, "beforeExport event has been attached");

		ExportUtils.getExportInstance.restore();
		ExportUtils.getFilters.restore();
	});

	QUnit.test("uploadFile", async function(assert) {
		const mFileToOverwrite = Object.assign({}, mFakeFileInfo);

		mFileToOverwrite.FileShareItem = "0ACGgV1bbQGeXUk9PVA";

		sinon.stub(oExportHandler, "getFileShareModel").returns(Promise.resolve(oFakeFileShareModel));
		sinon.stub(oExportHandler, "_createFile").returns(Promise.resolve("https://some.fake.link/path/resource"));
		sinon.stub(window, "open");

		await oExportHandler.uploadFile(mFakeFileInfo);

		assert.notOk(oFakeFileShareModel.getKeepAliveContext.called, "getKeepAliveContext is not called when creating a new file");
		assert.ok(oFakeFileShareModel.bindList.calledOnce, "ListBinding has been created to create the new file");
		assert.ok(oExportHandler._createFile.calledOnce, "Function _createFile has been called");
		assert.ok(window.open.calledOnce, "File has been opened in a new window");

		oExportHandler._createFile.resetHistory();
		resetSharedStubs();

		/* Second run with an existing file to overwrite */
		await oExportHandler.uploadFile(mFileToOverwrite);

		assert.ok(oFakeFileShareModel.getKeepAliveContext.calledOnce, "getKeepAliveContext was called while overwriting an existing file");
		assert.ok(oFakeContext.setProperty.calledThrice, "The 3 mandatory properties have been set to ensure the expected PATCH result");
		assert.ok(oFakeContext.getProperty.calledOnce, "Function getProperty was called once");
		assert.ok(oFakeContext.getProperty.calledWith("FileShareItemContentLink"), "The property 'FileShareItemContentLink' was requested");
		assert.notOk(oFakeFileShareModel.bindList.called, "ListBinding has not been created because an existing file was overwritten");
		assert.notOk(oExportHandler._createFile.called, "Function _createFile has not been called");
		assert.ok(window.open.calledTwice, "The second file has been opened in a new window");

		oExportHandler.getFileShareModel.restore();
		oExportHandler._createFile.restore();
		window.open.restore();
		resetSharedStubs();

	});

	QUnit.test("getFileShareContexts", async function(assert) {
		let aContexts = await oExportHandler.getFileShareContexts();

		assert.ok(Array.isArray(aContexts), "An Array was returned although no data source is available");
		assert.equal(aContexts.length, 0, "The Array is empty");
		assert.notOk(oExportHandler._oFileShareBinding, "No ODataListBinding has been stored on the ExportHandler");
		sinon.stub(oExportHandler, "getFileShareModel").returns(Promise.resolve(oFakeFileShareModel));

		aContexts = await oExportHandler.getFileShareContexts();

		assert.ok(Array.isArray(aContexts), "An Array was returned");
		assert.notEqual(aContexts.length, 0, "The Array is not empty");
		assert.ok(oExportHandler._oFileShareBinding, "The ODataListBinding has been stored on the ExportHandler");

		oExportHandler._oFileShareBinding = {
			requestContexts: sinon.stub().throws(new Error(""))
		};

		aContexts = await oExportHandler.getFileShareContexts();

		assert.ok(Array.isArray(aContexts), "An Array was returned");
		assert.equal(aContexts.length, 0, "The Array is empty");

		oExportHandler.getFileShareModel.restore();
		oExportHandler._oFileShareBinding = null;
	});

	QUnit.test("isGoogleWorkspace", function(assert) {
		const oContext = {
			getProperty: sinon.stub()
				.withArgs("FileShareVendorType")
				.onFirstCall().returns("GOOGLE")
				.onSecondCall().returns("MICROSOFT")
				.onThirdCall().returns("SAP")
		};

		assert.ok(oExportHandler.isGoogleWorkspace(oContext), "Google Workspace correctly detected");
		assert.notOk(oExportHandler.isGoogleWorkspace(oContext), "Different FileShare vendor detected");
		assert.notOk(oExportHandler.isGoogleWorkspace(oContext), "Different FileShare vendor detected");
		assert.ok(oContext.getProperty.calledWith("FileShareVendorType"), "Property FileShareVendorType was requested from the Context");

		resetSharedStubs();
	});

	QUnit.test("isGoogleSheetSupported", async function(assert) {
		let bIsSupported = await oExportHandler.isGoogleSheetSupported();

		assert.notOk(bIsSupported, "Google Sheet is not supported");

		sinon.stub(oExportHandler, "getFileShareContexts").resolves([{
			getProperty: sinon.stub()
				.withArgs("FileShareVendorType")
				.returns("GOOGLE")
		}]);

		bIsSupported = await oExportHandler.isGoogleSheetSupported();

		assert.ok(bIsSupported, "Google Sheet is supported");

		oExportHandler.getFileShareContexts.restore();
	});

	QUnit.test("_createFile", async function(assert) {
		const sUrl = await oExportHandler._createFile(oFakeBinding, mFakeFileInfo);

		assert.equal(sUrl, "https://some.fake.link/path/resource", "The creation of the file returned the expected link");
		assert.ok(oFakeBinding.create.calledOnce, "Binding#create has been called once");
		assert.ok(oFakeBinding.detachCreateCompleted.calledOnce, "Handler for createCompleted event has been detached");
		assert.ok(oFakeContext.getProperty.calledOnce, "Context#getProperty was called once");
		assert.ok(oFakeContext.getProperty.calledWith("FileShareItemContentLink"), "Requested property was 'FileShareItemContentLink'");
		assert.notOk(oFakeContext.destroy.called, "Context#destroy was never called");

		resetSharedStubs();
	});

	QUnit.module("Event", mModuleConfig);

	QUnit.test("beforeExport allows prevent default", async function(assert) {
		oExportHandler.attachBeforeExport((oEvent) => {
			oEvent.preventDefault();
		});

		/*
		 * Fire the beforeExport event on the inner instance with the
		 * assumption that the inner instance also allows prevent default.
		 * This ensures that preventDefault is accepted by the ExportHandler
		 * beforeExport event and properly forwarded to the event of the
		 * inner instance (e.g. Spreadsheet).
		 */
		const oInstance = await oExportHandler.getExportInstance(mSettings);
		const bExecuteDefaultAction = oInstance.fireEvent("beforeExport", {
			exportSettings: mSettings
		}, true, false);

		assert.equal(typeof bExecuteDefaultAction, "boolean", "Prevent default was returned as boolean");
		assert.notOk(bExecuteDefaultAction, "Default action was prevented");
	});
});
