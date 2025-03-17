sap.ui.define([
	"sap/suite/ui/commons/CloudFilePicker",
	"sap/suite/ui/commons/library",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/m/Table",
	"sap/m/Column",
	"sap/m/Text",
	"sap/ui/qunit/utils/nextUIUpdate"

], function(CloudFilePicker, library, createAndAppendDiv,Table,Column,Text, nextUIUpdate) {
	"use strict";

	createAndAppendDiv("content");

	var FilePickerModes = library.FilePickerModes;

	async function render(oElement) {
		oElement.placeAt("content");
		await nextUIUpdate();
	}

	QUnit.module("Control Rendering - sap.suite.ui.commons.CloudFilePicker", {
		afterEach: function() {
			this.oCloudFilePicker.destroy();
		}
	});

	QUnit.test("CloudFilePicker wrapper is working", async function(assert) {
		this.oCloudFilePicker = new CloudFilePicker({
			confirmButtonText: "Select File",
			filePickerMode: FilePickerModes.FileOnly,
			title: "Save As Dialog",
			serviceUrl: "test/"
		});
		await render(this.oCloudFilePicker);
		assert.ok(this.oCloudFilePicker.getDomRef(), "CloudFilePicker was rendered successfully");
		assert.equal(this.oCloudFilePicker.getContent()[0].getFixContent()[0].getContent()[3].getVisible(), false, "file name field does not exist in FileOnly mode");
	});

	QUnit.module("Control Rendering - sap.suite.ui.commons.CloudFilePicker", {
		beforeEach: async function() {
			this.oCloudFilePicker = new CloudFilePicker({
				confirmButtonText: "Select File",
				filePickerMode: FilePickerModes.All,
				title: "Save As Dialog",
				serviceUrl: "test/",
				fileNameMandatory: true
			});
			await render(this.oCloudFilePicker);
		},
        afterEach: function() {
            this.oCloudFilePicker.destroy();
        }
	});

	QUnit.test("Test default control properties", function(assert) {
		assert.equal(this.oCloudFilePicker.getContent()[0].getFixContent()[0].getContent()[3].getVisible(), true, "file name field exist in All mode");
		this.oCloudFilePicker.setSuggestedFileName('test1');
		assert.equal(this.oCloudFilePicker.getSuggestedFileName(), "test1", "CloudFilePicker has set the file name");
		assert.equal(this.oCloudFilePicker.getButtons().length, 2, "CloudFilePicker has two buttons");
	});

	QUnit.test("Test _setConfirmationButtonEnabled",function(assert) {
		this.oCloudFilePicker.oFileNameControl = {
			getValue: function () {
				return "FileName1";
			}
		};
		this.oCloudFilePicker.oSelectedFolderInfo = {
			getIsDocumentCreationAllowed: function() {
				return true;
			}
		};
		this.oCloudFilePicker._setConfirmationButtonEnabled(null, this.oCloudFilePicker.oSelectedFolderInfo);
		assert.equal(this.oCloudFilePicker.oConfirmationButton.getEnabled(), true, "Confirmation button enabled when the folder is allowed to select a file for export/upload");
	});

	QUnit.test("Test Confrimation button disabled when FileNameMandatory optional", function(assert) {
		this.oCloudFilePicker.setSuggestedFileName('');
		this.oCloudFilePicker.setFileNameMandatory(true);
		this.oCloudFilePicker._setConfirmationButtonEnabled(false);
		assert.equal(this.oCloudFilePicker.getButtons()[0].getEnabled(), false, "Confrimation button disabled");
	});

	QUnit.module("Control Rendering - sap.suite.ui.commons.CloudFilePicker", {
		beforeEach: async function() {
			this.oSandbox = sinon.sandbox.create();
			this.oCloudFilePicker = new CloudFilePicker({ confirmButtonText: "Select File", filePickerMode: FilePickerModes.FileOnly, title: "Save As Dialog", enableDuplicateCheck:true, serviceUrl: "test/" });
			await render(this.oCloudFilePicker);
		},
		afterEach: function() {
			this.oSandbox.restore();
			this.oCloudFilePicker.destroy();
		}
	});

	QUnit.test("Check for Duplicate File and Folder - Positive Case",function(assert) {
		var oRequestValue = {
			"value": [{
				"FileShare": "ZPERSONAL",
				"FileShareItem": "1rHDDG7dKR6xrhpztP2gQVzgWwjtQyElz",
				"ParentFileShareItem": "0ACGgV1bbQGeXUk9PVA",
				"FileShareItemKind": "folder",
				"FileShareItemName": "Folder Name 1",
				"CreatedByUser": "tester_em_go",
				"CreationDateTime": "2022-07-25T06:51:11.669Z",
				"LastChangedByUser": "tester_em_go",
				"LastChangeDateTime": "2022-07-25T06:51:12.411Z",
				"isDocumentCreationAllowed": true,
				"FileShareItemContent@odata.mediaContentType": null,
				"FileShareItemContentType": "",
				"FileShareItemContentSize": "0",
				"FileShareItemContentLink": "",
				"__CreateByAssociationControl": {
					"_Children": true
				},
				"__EntityControl": {
					"Deletable": true, "Updatable": true
				}
			}]
		};
		var stubedModel = sinon.stub(this.oCloudFilePicker, "getModel");
		stubedModel.returns({
            getObject: function (sPath) {
				return "some label";
			},
			createBindingContext: function () {
				return {
					oModel: {},
					sPath: "/test",
					bForceRefresh: false,
					sDeepPath: ""
				};
			},bindContext: function () {
				return {
					oModel: {},
					sPath: "/test",
					bForceRefresh: false,
					sDeepPath: "",
					requestObject: function () {
						var result =  oRequestValue.value.some(function(oRequestData) {
							return oRequestData.FileShareItemName == "Folder Name 1";
						});
						return Promise.resolve(result);
					}
				};
			},
			requestObject: function () {
				return Promise.resolve({});
			}
        });
		return this.oCloudFilePicker._checkForDuplicateFileAndFolder("Folder Name 1", "ZPERSONAL", "folder").then(function(bSuccess) {
			assert.ok(stubedModel.calledOnce, "Function called");
			assert.ok(bSuccess, "Folder Name 1 already exist in the list");
			stubedModel.restore();
		});
	});

	QUnit.test("Check for Duplicate File and Folder - Negative Case",function(assert) {
		var oRequestValue = {
			"value": [{
				"FileShareItemName": "abc"
			}]
		};
		var stubedModel = sinon.stub(this.oCloudFilePicker, "getModel");
		stubedModel.returns({
            getObject: function (sPath) {
				return "some label";
			},
			createBindingContext: function () {
				return {
					oModel: {},
					sPath: "/test",
					bForceRefresh: false,
					sDeepPath: ""
				};
			},bindContext: function () {
				return {
					oModel: {},
					sPath: "/test",
					bForceRefresh: false,
					sDeepPath: "",
					requestObject: function () {
						var result =  oRequestValue.value.some(function(oRequestData) {
							return oRequestData.FileShareItemName == "Folder Name 1";
						});
						return Promise.resolve(result);
					}
				};
			},
			requestObject: function () {
				return Promise.resolve({});
			}
        });
		return this.oCloudFilePicker._checkForDuplicateFileAndFolder("Folder Name 1", "ZPERSONAL", "folder").then(function(bFailure) {
			assert.ok(stubedModel.calledOnce, "Function called");
			assert.notOk(bFailure, "Folder Name 1 does not exist in the list");
			stubedModel.restore();
		});
	});

	QUnit.test("Test _enableDisableNewFolderBtn - positive case", function(assert) {
		var oParentData = {
			"isDocumentCreationAllowed": true
		};
		this.oCloudFilePicker.oNavigationMap.set('0ACGgV1bbQGeXUk9PVA', 'FilelShareItem');
		this.oCloudFilePicker.oCurrentParentData = {
			getProperty: function () {
				return oParentData.isDocumentCreationAllowed;
		}};
		this.oCloudFilePicker._enableDisableNewFolderBtn();
		assert.equal(this.oCloudFilePicker.oNewFolderButton.getEnabled(), true, "New folder button enabled");
	});

	QUnit.test("Test _enableDisableNewFolderBtn - negative case",function(assert) {
		var oParentData = {
			"isDocumentCreationAllowed": false
		};
		this.oCloudFilePicker.oNavigationMap.set('0ACGgV1bbQGeXUk9PVA','FilelShareItem');
		this.oCloudFilePicker.oCurrentParentData = {
			getProperty: function () {
				return oParentData.isDocumentCreationAllowed;
		}};
		this.oCloudFilePicker._enableDisableNewFolderBtn();
		assert.equal(this.oCloudFilePicker.oNewFolderButton.getEnabled(), false, "New folder button disabled");
	});

	QUnit.test("test _createButton", function(assert) {
		var oRequestValue = {
			"value": [{
				"FileShareItemName": "Folder Name1"
			}]
		};
		sinon.stub(this.oCloudFilePicker, "_checkForDuplicateFileAndFolder").returns(Promise.resolve(oRequestValue));
		sinon.stub(this.oCloudFilePicker, "_showOverwriteMessage").returns(null);
		this.oCloudFilePicker._createButton();
		this.oCloudFilePicker.oConfirmationButton.firePress();
		assert.equal(this.oCloudFilePicker.getButtons()[0].getText(),"Select File","Button created for export");
		assert.equal(this.oCloudFilePicker.getButtons()[1].getText(),"Cancel","Cancel button is created");
	});

	QUnit.test("Test _closeDialog", function(assert) {
		var oSelectedControl = "ZPERSONAL";
		var oSelectedItem = {
			mProperies: {
				FileShareItemName: "FolderName1"
			}
                };
		this.oCloudFilePicker.oSelectControl = {
			getSelectedKey: function () {
				return oSelectedControl;
			}
		};
		this.oCloudFilePicker.oTableControl = {
			getSelectedItem: function () {
				return oSelectedItem;
			}
		};
		this.oCloudFilePicker.oFileShareControl = {
			getValue: function () {
				return "FileName1";
			}
		};
		sinon.stub(this.oCloudFilePicker, "_createSelectionParameter").returns(oSelectedItem);
		var oCloseSpy = sinon.spy(this.oCloudFilePicker, "close");
		var oDestroySpy = sinon.spy(this.oCloudFilePicker, "destroy");
		this.oCloudFilePicker._closeDialog();
		assert.ok(oCloseSpy.called, "Close dialog was called");
		var done = assert.async();
		setTimeout(function () {
			assert.ok(oDestroySpy.called, "Destroy dialog was called");
			oDestroySpy.restore();
			done();
		});
	});

	QUnit.test("test _createNewFolderInline",function(assert) {
		var oRequestValue = {
			"value": [{
				"FileShareItemName": "Folder Name1"
			}]
		};
		sinon.stub(this.oCloudFilePicker,"_checkForDuplicateFileAndFolder").returns(Promise.resolve(oRequestValue));
		this.oCloudFilePicker._createNewFolderInline();
		assert.equal(this.oCloudFilePicker.oConfirmationButton.getEnabled(),false,"Confirmation button is not enabled during the creation of new folder");
	});

	QUnit.test("test _updateBreadcrumbLinks - other than root folders", function(assert) {
		this.oCloudFilePicker.aVisibleLinks = [
			{fileShareItemId: 'Root', title: 'Google Worksapce EU12 Dev Account'},
			{fileShareItemId: "0ACGgV1bbQGeXUk9PVA", title: "My Drive"},
			{fileShareItemId: "1rHDDG7dKR6xrhpztP2gQVzgWwjtQyElz", title: "Folder Name 1"}
		];
		this.oCloudFilePicker._updateBreadcrumbLinks();
		assert.equal(this.oCloudFilePicker.oBreadcrumbLinkControl.getLinks().length, 2, "Breadcrumblink is updated");
	});

	QUnit.test("test _updateBreadcrumbLinks - in root folders", function(assert) {
		this.oCloudFilePicker.aVisibleLinks = [
			{fileShareItemId: 'Root', title: 'Google Worksapce EU12 Dev Account'}
		];
		this.oCloudFilePicker._updateBreadcrumbLinks();
		assert.equal(this.oCloudFilePicker.oBreadcrumbLinkControl.getLinks().length, 0, "Breadcrumblink is updated");
	});

	QUnit.test("test _loadFileShareRootFolder", function(assert) {
		this.oCloudFilePicker.oTableControl = new Table({
			columns: [
				new Column({
					header: new Text({text: "FileShareItemName"})
				}),
				new Column({
					header: new Text({text: "FileShareItemKind"})
				})
			]
		});
		var oRequestValue = {
			"value": [{
				"FileShareItemName": "Folder Name 1"
			}]
		};
		var stubedModel = sinon.stub(this.oCloudFilePicker, "getModel");
		stubedModel.returns({
			bindContext: function () {
				return {
					oModel: {},
					sPath: "/test",
					bForceRefresh: false,
					sDeepPath: "",
					requestObject: function () {
						var result =  oRequestValue;
						return Promise.resolve(result);
					}
				};
			},
			createBindingContext: function() {
				return {
					oModel: {},
					sPath: "/test",
					bForceRefresh: false,
					sDeepPath: ""
				};
			}
		});
		var oTableBindingSpy = sinon.spy(this.oCloudFilePicker.oTableControl,"setBindingContext");
		this.oCloudFilePicker._loadFileShareRootFolder();
		assert.ok(oTableBindingSpy.called,"Entries are loaded in the table");
	});
});