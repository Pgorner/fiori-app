sap.ui.define([
	"sap/apf/cloudFoundry/ui/sharedialog/controller/ShareDialog.controller",
	"sap/apf/cloudFoundry/ui/utils/LaunchPageUtils",
	"sap/m/library",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/core/library",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (ShareDialog, LaunchPageUtils, mobileLibrary, MessageBox, Fragment, coreLibrary, sinon) {
	'use strict';

	const { ValueState } = coreLibrary;

	QUnit.module("Init", {
		beforeEach: function () {
			var env = this;
			env.oShareDialog = new ShareDialog();
			//stub destroy
			env.stubDestroyDialog = sinon.stub(env.oShareDialog, "destroy");
			//stub getDialog
			env.spyOpenDialog = sinon.spy();
			env.oDialog = {
				open: env.spyOpenDialog
			};
			env.stubLoadFragment = sinon.stub(env.oShareDialog, "loadFragment").returns(Promise.resolve(env.oDialog));
			env.stubGetDialog = sinon.stub(env.oShareDialog, "getDialog");
			env.stubGetDialog.returns(env.oDialog);
			//stub getOwnerComponent
			env.stubGetOwnerComponent = sinon.stub(env.oShareDialog, "getOwnerComponent");
			env.stubGetOwnerComponent.returns({});
			//stub controller
			env.bSaved = undefined;
			env.oConfigEditor = {
				isSaved: function() {
					return env.bSaved;
				}
			};
			env.spyIsSaved = sinon.spy(env.oConfigEditor, "isSaved");
			env.oConfig = {
				name: "name",
				AnalyticalConfiguration: "123456789"
			};
			env.stubGetNodeData = sinon.stub();
			env.stubGetNodeData.withArgs({}, "configuration").returns({
				data: env.oConfig
			});
			env.oController = {
				configEditor: env.oConfigEditor,
				_getNodeData: env.stubGetNodeData
			};
			//stub getView getViewData
			env.oViewData = {
				oController: env.oController
			};
			env.stubGetViewData = sinon.stub();
			env.stubGetViewData.returns(env.oViewData);
			//stub getView byId
			env.spyTilePreviewAddDelegate = sinon.spy();
			env.oTilePreview = {
				addDelegate: env.spyTilePreviewAddDelegate
			};
			env.stubById = sinon.stub();
			env.stubById.withArgs("tilePreview").returns(env.oTilePreview);
			//stub getView
			env.spySetModel = sinon.spy();
			env.spyDestroyView = sinon.spy();
			env.oView = {
				getViewData: env.stubGetViewData,
				setModel: env.spySetModel,
				destroy: env.spyDestroyView,
				byId: env.stubById
			};
			env.stubGetView = sinon.stub(env.oShareDialog, "getView");
			env.stubGetView.returns(env.oView);
			//stub generateRuntimeLink
			env.sRuntimeLink = "#https://runtime.link";
			env.stubGenerateRuntimeLink = sinon.stub(LaunchPageUtils, "generateRuntimeLink");
			env.stubGenerateRuntimeLink.returns(env.sRuntimeLink);
			//stub translate
			env.stubTranslate = sinon.stub(env.oShareDialog, "translate");
			env.stubTranslate.withArgs("bookmarkSubheaderDefault").returns("translation: bookmarkSubheaderDefault");
			env.stubTranslate.withArgs("unsavedStateWarning").returns("translation: unsavedStateWarning");
			//stub MessageBox.warning
			env.stubWarning = sinon.stub(MessageBox, "warning", function(text, params) {
				if (params && params.onClose) {
					params.onClose();
				}
			});
		},
		afterEach: function () {
			this.stubDestroyDialog.restore();
			this.stubLoadFragment.restore();
			this.stubGetDialog.restore();
			this.spyIsSaved.restore();
			this.stubGetView.restore();
			this.stubGenerateRuntimeLink.restore();
			this.stubTranslate.restore();
			this.stubWarning.restore();
			this.oShareDialog.destroy();
		}
	});
	QUnit.test("Configuration Not Saved", function(assert) {
		var env = this;
		env.bSaved = false;
		env.oShareDialog.onInit();
		assert.ok(env.stubGetView.called, "getView is called");
		assert.ok(env.stubGetViewData.called, "getViewData is called");
		assert.ok(env.spyIsSaved.calledOnce, "isSaved is called once");
		assert.ok(env.stubTranslate.withArgs("unsavedStateWarning").calledOnce, "translate is called once with 'unsavedStateWarning'");
		assert.ok(env.stubWarning.calledOnce, "MessageBox.warning is called once");
		assert.ok(env.spyDestroyView.calledOnce, "view.destroy is called once");
		assert.ok(env.stubDestroyDialog.calledOnce, "destroy is called once");
		assert.strictEqual(env.stubWarning.getCall(0).args[0], "translation: unsavedStateWarning", "MessageBox.warning is called with the correct warning text");
		assert.ok(env.stubGetDialog.notCalled, "getDialog is not called");
		assert.ok(env.stubGetNodeData.notCalled, "_getNodeData is not called");
		assert.ok(env.stubGenerateRuntimeLink.notCalled, "generateRuntimeLink is not called");
		assert.ok(env.spyOpenDialog.notCalled, "dialog.open is not called");
	});
	QUnit.test("Get UI", async function (assert) {
		var env = this;
		env.bSaved = true;
		env.oShareDialog.onInit();
		await env.oShareDialog.whenDialogInitialized();
		assert.ok(env.spyIsSaved.calledOnce, "isSaved is called once");
		assert.ok(env.stubLoadFragment.calledOnce, "loadFRagment is called once")
		// assert.ok(env.stubGetDialog.calledOnce, "getDialog is called once");
		assert.ok(env.stubGetView.called, "getView is called");
		assert.ok(env.stubGetViewData.called, "getViewData is called");
	});
	QUnit.test("Get Configuration", async function (assert) {
		var env = this;
		env.bSaved = true;
		env.oShareDialog.onInit();
		await env.oShareDialog.whenDialogInitialized();
		assert.ok(env.stubLoadFragment.calledOnce, "loadFragment is called once")
		assert.ok(env.stubGetNodeData.withArgs({}, "configuration").calledOnce, "_getNodeData is called once with 'configuration'");
		assert.ok(env.stubGenerateRuntimeLink.withArgs(env.oConfig.AnalyticalConfiguration).calledOnce, "generateRuntimeLink is called once with the config id");
	});
	QUnit.test("Set Model", async function (assert) {
		var env = this;
		env.bSaved = true;
		env.oShareDialog.onInit();
		await env.oShareDialog.whenDialogInitialized();
		assert.ok(env.stubLoadFragment.calledOnce, "loadFragment is called once")
		assert.ok(env.spySetModel.calledOnce, "setModel is called once");
		assert.ok(env.stubTranslate.withArgs("bookmarkSubheaderDefault").calledOnce, "translate is called once with 'bookmarkSubheaderDefault'");
		var args = env.spySetModel.firstCall.args;
		assert.strictEqual(args[0].getProperty("/TileHeader"), env.oConfig.name, "model contains tile header (config name)");
		assert.strictEqual(args[0].getProperty("/TileSubheader"), "translation: bookmarkSubheaderDefault", "model contains tile subheader (default)");
		assert.strictEqual(args[0].getProperty("/TileIcon"), "", "model contains tile icon (empty)");
		assert.strictEqual(args[0].getProperty("/TileGroup"), "", "model contains tile group (empty)");
		assert.strictEqual(args[1], "ui", "model name is 'ui'");
	});
	QUnit.test("Open Dialog", async function (assert) {
		var env = this;
		env.bSaved = true;
		env.oShareDialog.onInit();
		await env.oShareDialog.whenDialogInitialized();
		assert.ok(env.stubLoadFragment.calledOnce, "loadFRagment is called once")
		assert.ok(env.spyOpenDialog.calledOnce, "dialog.open is called once");
	});

	QUnit.module("Update Tile Tooltip", {
		beforeEach: function() {
			var env = this;
			env.oShareDialog = new ShareDialog();
			//stub getProperty
			env.stubGetProperty = sinon.stub();
			//stub setProperty
			env.stubSetProperty = sinon.stub();
			//stub ui
			env.oUi = {
				getProperty: env.stubGetProperty,
				setProperty: env.stubSetProperty
			};
			env.oShareDialog.ui = env.oUi;
			//stub translate
			env.stubTranslate = sinon.stub(env.oShareDialog, "translate");
			env.stubTranslate.withArgs("bookmarkTooltipHeader").returns("header-translation");
			env.stubTranslate.withArgs("bookmarkTooltipSubheader").returns("subheader-translation");
			env.stubTranslate.withArgs("bookmarkTooltipIcon").returns("icon-translation");
			env.stubTranslate.withArgs("bookmarkTooltipGroup").returns("group-translation");
		},
		afterEach: function() {
			this.oShareDialog.ui = null;
			this.stubTranslate.restore();
		}
	});
	QUnit.test("Empty values", function(assert) {
		var env = this;
		//Given
		env.stubGetProperty.withArgs("/TileHeader").returns("");
		env.stubGetProperty.withArgs("/TileSubheader").returns("");
		env.stubGetProperty.withArgs("/TileIcon").returns("");
		env.stubGetProperty.withArgs("/TileGroup").returns("");
		//When
		env.oShareDialog.updateTileTooltip();
		//Then
		assert.ok(env.stubGetProperty.withArgs("/TileHeader").calledOnce, "getProperty is called once for the tile header");
		assert.ok(env.stubGetProperty.withArgs("/TileSubheader").calledOnce, "getProperty is called once for the tile subheader");
		assert.ok(env.stubGetProperty.withArgs("/TileIcon").calledOnce, "getProperty is called once for the tile icon");
		assert.ok(env.stubGetProperty.withArgs("/TileGroup").calledOnce, "getProperty is called once for the tile group");
		assert.ok(env.stubTranslate.withArgs("bookmarkTooltipHeader", "").calledOnce, "translate is called once for the bookmark tooltip header");
		assert.ok(env.stubTranslate.withArgs("bookmarkTooltipSubheader", "").calledOnce, "translate is called once for the bookmark tooltip subheader");
		assert.ok(env.stubSetProperty.withArgs("/TileTooltip").calledOnce, "setProperty is called once for the tile tooltip")
		assert.strictEqual(
			env.stubSetProperty.getCall(0).args[1],
			"header-translation" +
			"\nsubheader-translation",
			"setProperty is called with the correct tooltip"
		);
	});
	QUnit.test("Values for Header and Subheader only", function(assert) {
		var env = this;
		//Given
		env.stubGetProperty.withArgs("/TileHeader").returns("some-header");
		env.stubGetProperty.withArgs("/TileSubheader").returns("some-subheader");
		env.stubGetProperty.withArgs("/TileIcon").returns("");
		env.stubGetProperty.withArgs("/TileGroup").returns("");
		//When
		env.oShareDialog.updateTileTooltip();
		//Then
		assert.ok(env.stubGetProperty.withArgs("/TileHeader").calledOnce, "getProperty is called once for the tile header");
		assert.ok(env.stubGetProperty.withArgs("/TileSubheader").calledOnce, "getProperty is called once for the tile subheader");
		assert.ok(env.stubGetProperty.withArgs("/TileIcon").calledOnce, "getProperty is called once for the tile icon");
		assert.ok(env.stubGetProperty.withArgs("/TileGroup").calledOnce, "getProperty is called once for the tile group");
		assert.ok(env.stubTranslate.withArgs("bookmarkTooltipHeader", "some-header").calledOnce, "translate is called once for the bookmark tooltip header");
		assert.ok(env.stubTranslate.withArgs("bookmarkTooltipSubheader", "some-subheader").calledOnce, "translate is called once for the bookmark tooltip subheader");
		assert.ok(env.stubSetProperty.withArgs("/TileTooltip").calledOnce, "setProperty is called once for the tile tooltip")
		assert.strictEqual(
			env.stubSetProperty.getCall(0).args[1],
			"header-translation" +
			"\nsubheader-translation",
			"setProperty is called with the correct tooltip"
		);
	});
	QUnit.test("Values for Header, Subheader and Icon", function(assert) {
		var env = this;
		//Given
		env.stubGetProperty.withArgs("/TileHeader").returns("some-header");
		env.stubGetProperty.withArgs("/TileSubheader").returns("some-subheader");
		env.stubGetProperty.withArgs("/TileIcon").returns("some-icon");
		env.stubGetProperty.withArgs("/TileGroup").returns("");
		//When
		env.oShareDialog.updateTileTooltip();
		//Then
		assert.ok(env.stubGetProperty.withArgs("/TileHeader").calledOnce, "getProperty is called once for the tile header");
		assert.ok(env.stubGetProperty.withArgs("/TileSubheader").calledOnce, "getProperty is called once for the tile subheader");
		assert.ok(env.stubGetProperty.withArgs("/TileIcon").calledOnce, "getProperty is called once for the tile icon");
		assert.ok(env.stubGetProperty.withArgs("/TileGroup").calledOnce, "getProperty is called once for the tile group");
		assert.ok(env.stubTranslate.withArgs("bookmarkTooltipHeader", "some-header").calledOnce, "translate is called once for the bookmark tooltip header");
		assert.ok(env.stubTranslate.withArgs("bookmarkTooltipSubheader", "some-subheader").calledOnce, "translate is called once for the bookmark tooltip subheader");
		assert.ok(env.stubTranslate.withArgs("bookmarkTooltipIcon", "some-icon").calledOnce, "translate is called once for the bookmark tooltip icon");
		assert.ok(env.stubSetProperty.withArgs("/TileTooltip").calledOnce, "setProperty is called once for the tile tooltip")
		assert.strictEqual(
			env.stubSetProperty.getCall(0).args[1],
			"header-translation" +
			"\nsubheader-translation" +
			"\nicon-translation",
			"setProperty is called with the correct tooltip"
		);
	});
	QUnit.test("Values for Header, Subheader and Group", function(assert) {
		var env = this;
		//Given
		env.stubGetProperty.withArgs("/TileHeader").returns("some-header");
		env.stubGetProperty.withArgs("/TileSubheader").returns("some-subheader");
		env.stubGetProperty.withArgs("/TileIcon").returns("");
		env.stubGetProperty.withArgs("/TileGroup").returns("some-group");
		//When
		env.oShareDialog.updateTileTooltip();
		//Then
		assert.ok(env.stubGetProperty.withArgs("/TileHeader").calledOnce, "getProperty is called once for the tile header");
		assert.ok(env.stubGetProperty.withArgs("/TileSubheader").calledOnce, "getProperty is called once for the tile subheader");
		assert.ok(env.stubGetProperty.withArgs("/TileIcon").calledOnce, "getProperty is called once for the tile icon");
		assert.ok(env.stubGetProperty.withArgs("/TileGroup").calledOnce, "getProperty is called once for the tile group");
		assert.ok(env.stubTranslate.withArgs("bookmarkTooltipHeader", "some-header").calledOnce, "translate is called once for the bookmark tooltip header");
		assert.ok(env.stubTranslate.withArgs("bookmarkTooltipSubheader", "some-subheader").calledOnce, "translate is called once for the bookmark tooltip subheader");
		assert.ok(env.stubTranslate.withArgs("bookmarkTooltipGroup", "some-group").calledOnce, "translate is called once for the bookmark tooltip group");
		assert.ok(env.stubSetProperty.withArgs("/TileTooltip").calledOnce, "setProperty is called once for the tile tooltip")
		assert.strictEqual(
			env.stubSetProperty.getCall(0).args[1],
			"header-translation" +
			"\nsubheader-translation" +
			"\ngroup-translation",
			"setProperty is called with the correct tooltip"
		);
	});
	QUnit.test("Values for Header, Subheader, Icon and Group (all)", function(assert) {
		var env = this;
		//Given
		env.stubGetProperty.withArgs("/TileHeader").returns("some-header");
		env.stubGetProperty.withArgs("/TileSubheader").returns("some-subheader");
		env.stubGetProperty.withArgs("/TileIcon").returns("some-icon");
		env.stubGetProperty.withArgs("/TileGroup").returns("some-group");
		//When
		env.oShareDialog.updateTileTooltip();
		//Then
		assert.ok(env.stubGetProperty.withArgs("/TileHeader").calledOnce, "getProperty is called once for the tile header");
		assert.ok(env.stubGetProperty.withArgs("/TileSubheader").calledOnce, "getProperty is called once for the tile subheader");
		assert.ok(env.stubGetProperty.withArgs("/TileIcon").calledOnce, "getProperty is called once for the tile icon");
		assert.ok(env.stubGetProperty.withArgs("/TileGroup").calledOnce, "getProperty is called once for the tile group");
		assert.ok(env.stubTranslate.withArgs("bookmarkTooltipHeader", "some-header").calledOnce, "translate is called once for the bookmark tooltip header");
		assert.ok(env.stubTranslate.withArgs("bookmarkTooltipSubheader", "some-subheader").calledOnce, "translate is called once for the bookmark tooltip subheader");
		assert.ok(env.stubTranslate.withArgs("bookmarkTooltipIcon", "some-icon").calledOnce, "translate is called once for the bookmark tooltip icon");
		assert.ok(env.stubTranslate.withArgs("bookmarkTooltipGroup", "some-group").calledOnce, "translate is called once for the bookmark tooltip group");
		assert.ok(env.stubSetProperty.withArgs("/TileTooltip").calledOnce, "setProperty is called once for the tile tooltip")
		assert.strictEqual(
			env.stubSetProperty.getCall(0).args[1],
			"header-translation" +
			"\nsubheader-translation" +
			"\nicon-translation" +
			"\ngroup-translation",
			"setProperty is called with the correct tooltip"
		);
	});

	QUnit.module("Get Bookmark Link", {
		beforeEach: function () {
			var env = this;
			env.oShareDialog = new ShareDialog();
			env.sHeader = "header";
			env.sSubheader = "subheader";
			env.sIcon = "add"; //real icon, since that's tested
			env.sIconUri = "sap-icon://add";
			env.sGroup = "group";
			env.stubById = sinon.stub();
			env.stubById.withArgs("inputHeader").returns({
				getValue: function () {
					return env.sHeader;
				}
			});
			env.stubById.withArgs("inputSubheader").returns({
				getValue: function () {
					return env.sSubheader;
				}
			});
			env.stubById.withArgs("inputIcon").returns({
				getValue: function () {
					return env.sIcon;
				}
			});
			env.stubById.withArgs("inputGroup").returns({
				getValue: function () {
					return env.sGroup;
				}
			});
			env.oView = {
				byId: env.stubById
			};
			env.stubGetView = sinon.stub(env.oShareDialog, "getView");
			env.stubGetView.returns(env.oView);
			env.stubBuildBookmarkLink = sinon.stub(LaunchPageUtils, "buildBookmarkLink");
			env.sRuntimeLink = "#https://runtime.link";
			env.oShareDialog.runtimeLink = env.sRuntimeLink;
			env.sBookmarkLink = "#https://bookmark.link";
			env.stubBuildBookmarkLink.returns(env.sBookmarkLink);
			env.spySetProperty = sinon.spy();
			env.oUi = {
				setProperty: env.spySetProperty
			};
			env.oShareDialog.ui = env.oUi;
		},
		afterEach: function () {
			this.stubGetView.restore();
			this.stubBuildBookmarkLink.restore();
			this.oShareDialog.destroy();
		}
	});
	QUnit.test("Normal", function (assert) {
		var env = this;
		var bookmarkLink = env.oShareDialog.getBookmarkLink();
		return bookmarkLink.then(function(bookmarkLink){
		assert.ok(env.stubGetView.calledOnce, "getView is called once");
		assert.ok(env.stubById.calledWith("inputHeader"), "byId is called with 'inputHeader'");
		assert.ok(env.stubById.calledWith("inputSubheader"), "byId is caleld with 'inputSubheader'");
		assert.ok(env.stubById.calledWith("inputIcon"), "byId is caleld with 'inputIcon'");
		assert.ok(env.stubById.calledWith("inputGroup"), "byId is caleld with 'inputGroup'");
		assert.ok(env.stubBuildBookmarkLink.withArgs(env.sRuntimeLink, env.sHeader, env.sSubheader, env.sIconUri, env.sGroup).calledOnce, "buildBookmarkLink is called once with the tile configuration");
		assert.strictEqual(bookmarkLink, env.sBookmarkLink, "result is the bookmark link");
		});
	});
	QUnit.test("Illegal icon", function (assert) {
		var env = this;
		env.sIcon = "fridolin";
		var bookmarkLink = env.oShareDialog.getBookmarkLink();
		return bookmarkLink.then(function(bookmarkLink){
		assert.ok(env.stubGetView.calledOnce, "getView is called once");
		assert.ok(env.stubById.calledWith("inputHeader"), "byId is called with 'inputHeader'");
		assert.ok(env.stubById.calledWith("inputSubheader"), "byId is caleld with 'inputSubheader'");
		assert.ok(env.stubById.calledWith("inputIcon"), "byId is caleld with 'inputIcon'");
		assert.ok(env.stubById.calledWith("inputGroup"), "byId is caleld with 'inputGroup'");
		assert.ok(env.stubBuildBookmarkLink.withArgs(env.sRuntimeLink, env.sHeader, env.sSubheader, "", env.sGroup).calledOnce, "buildBookmarkLink is called once with the tile configuration, except the icon");
		assert.strictEqual(bookmarkLink, env.sBookmarkLink, "result is the bookmark link");
		});
	});

	QUnit.module("Actions", {
		beforeEach: function () {
			var env = this;
			env.oShareDialog = new ShareDialog();
			//stub view
			env.stubAddDependent = sinon.stub();
			env.stubById = sinon.stub();
			env.oLinkRuntime = {
				id: "linkRuntime"
			};
			env.stubById.withArgs("linkRuntime").returns(env.oLinkRuntime);
			env.stubGetId = sinon.stub();
			env.sViewId = "view";
			env.stubGetId.returns(env.sViewId);
			env.oView = {
				addDependent: env.stubAddDependent,
				byId: env.stubById,
				getId: env.stubGetId
			};
			env.stubGetView = sinon.stub(env.oShareDialog, "getView");
			env.stubGetView.returns(env.oView);
			//stub getBookmarkLink
			env.sBookmarkLink = "#https://bookmark.link";
			env.stubGetBookmarkLink = sinon.stub(env.oShareDialog, "getBookmarkLink");
			env.stubGetBookmarkLink.returns(env.sBookmarkLink);
			//stub getProperty
			env.sRuntimeLink = "#https://runtime.link";
			env.oShareDialog.runtimeLink = env.sRuntimeLink;
			env.sHeader = "header";
			env.sSubheader = "subheader";
			env.sIcon = "icon";
			env.sGroup = "group";
			env.stubGetProperty = sinon.stub();
			env.stubGetProperty.withArgs("/TileHeader").returns(env.sHeader);
			env.stubGetProperty.withArgs("/TileSubheader").returns(env.sSubheader);
			env.stubGetProperty.withArgs("/TileIcon").returns(env.sIcon);
			env.stubGetProperty.withArgs("/TileGroup").returns(env.sGroup);
			env.oShareDialog.ui = {
				getProperty: env.stubGetProperty
			};
			//stub translate
			env.stubTranslate = sinon.stub(env.oShareDialog, "translate");
			env.stubTranslate.withArgs("helpLink").returns("translation: helpLink");
			env.stubTranslate.withArgs("emailTemplateSubject", env.sHeader).returns("translation: emailTemplateSubject");
			env.stubTranslate.withArgs("emailTemplateText", env.sHeader, env.sBookmarkLink, "translation: helpLink").returns("translation: emailTemplateText");
			//stub triggerEmail
			env.stubTriggerEmail = sinon.stub(mobileLibrary.URLHelper, "triggerEmail");
			//stub setBookmarkTile
			env.stubSetBookmarkTile = sinon.stub(LaunchPageUtils, "setBookmarkTile");
			//stub Fragment
			env.spyFragmentOpen = sinon.spy();
			env.oFragment = {
				open: env.spyFragmentOpen
			};
			env.oFragmentPromise = {
				then: function(fHandler) {
					fHandler(env.oFragment);
				}
			};
			env.stubFragmentLoad = sinon.stub(Fragment, "load");
			env.stubFragmentLoad.returns(env.oFragmentPromise);
		},
		afterEach: function () {
			this.stubGetView.restore();
			this.stubGetBookmarkLink.restore();
			this.stubTranslate.restore();
			this.stubTriggerEmail.restore();
			this.stubSetBookmarkTile.restore();
			this.stubFragmentLoad.restore();
			this.oShareDialog.destroy();
		}
	});
	QUnit.test("Show Link", function (assert) {
		var env = this;
		//when
		env.oShareDialog.onShowLink();
		//then
		assert.ok(env.stubGetBookmarkLink.calledOnce, "getBookmarkLink is called once");
		assert.ok(env.stubFragmentLoad.calledOnce, "Fragment.load is called once");
		assert.strictEqual(env.stubFragmentLoad.getCall(0).args[0].id, env.sViewId, "fragment.id is view id");
		assert.strictEqual(env.stubFragmentLoad.getCall(0).args[0].name, "sap.apf.cloudFoundry.ui.sharedialog.fragment.ShowLinkDialog", "fragment.name is [..].ShowLinkDialog");
		assert.notStrictEqual(env.stubFragmentLoad.getCall(0).args[0].controller, null, "fragment.controller is not null");
		assert.ok(env.stubAddDependent.withArgs(env.oFragment).calledOnce, "addDependant is called once with the fragment");
		assert.ok(env.spyFragmentOpen.calledOnce, "fragment.open is called once");
	});
	QUnit.test("Send Email", function (assert) {
		var env = this;
		env.oShareDialog.onSendEmail();
		assert.ok(env.stubGetProperty.calledOnce, "getProperty is called once");
		assert.ok(env.stubGetProperty.calledWith("/TileHeader"), "getProperty is called with '/TileHeader'");
		assert.ok(env.stubGetBookmarkLink.calledOnce, "getBookmarkLink is called once");
		assert.ok(env.stubTranslate.calledThrice, "translate is called thrice");
		assert.ok(env.stubTranslate.calledWith("helpLink"), "translate is called with 'helpLink'");
		assert.ok(env.stubTranslate.calledWith("emailTemplateSubject", env.sHeader), "translate is called with 'emailTemplateSubject' and the tile header");
		assert.ok(env.stubTranslate.calledWith("emailTemplateText", env.sHeader, env.sBookmarkLink, "translation: helpLink"), "translate is called with" +
			"'emailTemplateText', the tile header, the bookmark link and the translated help link");
		assert.ok(env.stubTriggerEmail.calledOnce, "triggerEmail is called once");
		assert.ok(env.stubTriggerEmail.calledWith("", "translation: emailTemplateSubject", "translation: emailTemplateText"), "triggerEmail is called with the translated email subject and text");
	});
	QUnit.test("Mark as Favorite", function (assert) {
		var env = this;
		env.oShareDialog.onMarkFavorite();
		assert.ok(env.stubGetProperty.calledWith("/TileHeader"), "getProperty is called with '/Header'");
		assert.ok(env.stubGetProperty.calledWith("/TileSubheader"), "getProperty is called with '/Subheader'");
		assert.ok(env.stubGetProperty.calledWith("/TileIcon"), "getProperty is called with '/Icon'");
		assert.ok(env.stubGetProperty.calledWith("/TileGroup"), "getProperty is called with '/Group'");
		assert.ok(env.stubSetBookmarkTile.calledOnce, "setBookmarkTile is called once");
		assert.ok(env.stubSetBookmarkTile.calledWith(env.sRuntimeLink, env.sHeader, env.sSubheader, env.sIcon, env.sGroup), "setBookmarkTile is called with the tile configuration");
	});

	QUnit.module("Changes", {
		beforeEach: function () {
			var env = this;
			env.oShareDialog = new ShareDialog();
			env.stubGetParameters = sinon.stub();
			env.oControlEvent = {
				getParameters: env.stubGetParameters
			};
			env.spySetProperty = sinon.spy();
			env.oShareDialog.ui = {
				setProperty: env.spySetProperty
			};
			env.oConfig = {
				name: "name",
				AnalyticalConfiguration: "123456789"
			};
			env.oShareDialog.config = env.oConfig;
			env.stubTranslate = sinon.stub(env.oShareDialog, "translate");
			env.stubTranslate.withArgs("bookmarkSubheaderDefault").returns("translation: bookmarkSubheaderDefault");
			env.stubUpdateTileTooltip = sinon.stub(env.oShareDialog, "updateTileTooltip");
		},
		afterEach: function () {
			this.stubTranslate.restore();
			this.stubUpdateTileTooltip.restore();
			this.oShareDialog.destroy();
		}
	});
	QUnit.test("Header Change - Value", function (assert) {
		var env = this;
		env.stubGetParameters.returns({
			value: "parameter value"
		});
		env.oShareDialog.onHeaderChange(env.oControlEvent);
		assert.ok(env.spySetProperty.calledOnce, "setProperty is called once");
		assert.ok(env.spySetProperty.calledWith("/TileHeader", "parameter value"), "setProperty is called with the correct value");
		assert.ok(env.stubUpdateTileTooltip.calledOnce, "updateTileTooltip is called once");
	});
	QUnit.test("Header Change - Empty", function (assert) {
		var env = this;
		env.stubGetParameters.returns({
			value: ""
		});
		env.oShareDialog.onHeaderChange(env.oControlEvent);
		assert.ok(env.spySetProperty.calledOnce, "setProperty is called once");
		assert.ok(env.spySetProperty.calledWith("/TileHeader", env.oConfig.name), "setProperty is called with the default value");
		assert.ok(env.stubUpdateTileTooltip.calledOnce, "updateTileTooltip is called once");
	});
	QUnit.test("Subheader Change - Value", function (assert) {
		var env = this;
		env.stubGetParameters.returns({
			value: "parameter value"
		});
		env.oShareDialog.onSubheaderChange(env.oControlEvent);
		assert.ok(env.stubTranslate.notCalled, "translate is not called");
		assert.ok(env.spySetProperty.calledOnce, "setProperty is called once");
		assert.ok(env.spySetProperty.calledWith("/TileSubheader", "parameter value"), "setProperty is called with the correct value");
		assert.ok(env.stubUpdateTileTooltip.calledOnce, "updateTileTooltip is called once");
	});
	QUnit.test("Subheader Change - Empty", function (assert) {
		var env = this;
		env.stubGetParameters.returns({
			value: ""
		});
		env.oShareDialog.onSubheaderChange(env.oControlEvent);
		assert.ok(env.stubTranslate.calledOnce, "translate is not called");
		assert.ok(env.stubTranslate.calledWith("bookmarkSubheaderDefault"), "translate is called with 'bookmarkSubheaderDefault'");
		assert.ok(env.spySetProperty.calledOnce, "setProperty is called once");
		assert.ok(env.spySetProperty.calledWith("/TileSubheader", "translation: bookmarkSubheaderDefault"), "setProperty is called with the default value");
		assert.ok(env.stubUpdateTileTooltip.calledOnce, "updateTileTooltip is called once");
	});
	QUnit.test("Icon Change - Empty", function (assert) {
		var env = this;
		env.stubGetParameters.returns({
			value: ""
		});
		env.oShareDialog.onIconChange(env.oControlEvent);
		assert.ok(env.spySetProperty.calledTwice, "setProperty is called once");
		assert.ok(env.spySetProperty.calledWith("/TileIcon", ""), "setProperty is called with the correct value (empty)");
		assert.ok(env.spySetProperty.calledWith("/TileIconValueState", ValueState.None), "setProperty is called with the correct value state (none)");
		assert.ok(env.stubUpdateTileTooltip.calledOnce, "updateTileTooltip is called once");
	});
	QUnit.test("Icon Change - Illegal Value", function (assert) {
		var env = this;
		env.stubGetParameters.returns({
			value: "fridolin"
		});
		env.oShareDialog.onIconChange(env.oControlEvent);
		assert.ok(env.spySetProperty.calledTwice, "setProperty is called once");
		assert.ok(env.spySetProperty.calledWith("/TileIcon", ""), "setProperty is called with the default value (empty)");
		assert.ok(env.spySetProperty.calledWith("/TileIconValueState", ValueState.Error), "setProperty is called with the correct value state (error)");
		assert.ok(env.stubUpdateTileTooltip.calledOnce, "updateTileTooltip is called once");
	});
	QUnit.test("Icon Change - Value", function (assert) {
		var env = this;
		env.stubGetParameters.returns({
			value: "add"
		});
		env.oShareDialog.onIconChange(env.oControlEvent);
		assert.ok(env.spySetProperty.calledTwice, "setProperty is called once");
		assert.ok(env.spySetProperty.calledWith("/TileIcon", "sap-icon://add"), "setProperty is called with the correct value");
		assert.ok(env.spySetProperty.calledWith("/TileIconValueState", ValueState.None), "setProperty is called with the correct value state (none)");
		assert.ok(env.stubUpdateTileTooltip.calledOnce, "updateTileTooltip is called once");
	});
	QUnit.test("Group Change", function (assert) {
		var env = this;
		env.stubGetParameters.returns({
			value: "parameter value"
		});
		env.oShareDialog.onGroupChange(env.oControlEvent);
		assert.ok(env.spySetProperty.calledOnce, "setProperty is called once");
		assert.ok(env.spySetProperty.calledWith("/TileGroup", "parameter value"), "setProperty is called with the correct value");
		assert.ok(env.stubUpdateTileTooltip.calledOnce, "updateTileTooltip is called once");
	});

	QUnit.module("Get Dialog", {
		beforeEach: function () {
			var env = this;
			env.oShareDialog = new ShareDialog();
			env.stubById = sinon.stub();
			env.sViewId = "view";
			env.stubGetId = sinon.stub();
			env.stubGetId.returns(env.sViewId);
			env.stubGetView = sinon.stub(env.oShareDialog, "getView");
			env.stubGetView.returns({
				byId: env.stubById,
				getId: env.stubGetId
			});
		},
		afterEach: function () {
			this.stubGetView.restore();
			this.oShareDialog.destroy();
		}
	});
	QUnit.test("Available", function (assert) {
		var env = this;
		var oDialog = {
			id: "shareDialog"
		};
		env.stubById.withArgs("shareDialog").returns(oDialog);
		var result = env.oShareDialog.getDialog();
		assert.ok(env.stubGetView.calledOnce, "getView is called once");
		assert.ok(env.stubById.calledOnce, "byId is called once");
		assert.ok(env.stubById.calledWith("shareDialog"), "byId is called with 'shareDialog'");
		assert.strictEqual(result, oDialog, "dialog is returned");
	});
	QUnit.test("Not Available", function (assert) {
		var env = this;
		env.stubById.withArgs("shareDialog").returns(null);
		var result = env.oShareDialog.getDialog();
		assert.ok(env.stubGetView.calledOnce, "getView is called once");
		assert.ok(env.stubById.calledOnce, "byId is called once");
		assert.ok(env.stubById.calledWith("shareDialog"), "byId is called with 'shareDialog'");
		assert.strictEqual(result, null, "dialog is returned");
	});

	QUnit.module("Translate", {
		beforeEach: function() {
			var env = this;
			env.oShareDialog = new ShareDialog();
			//stub getText
			var translations = {
				"key": "translation",
				"key_one": "trans{0}ion {0}",
				"key_mult": "{1}lat{2} {0}"
			};
			var fGetText = function(key, args) {
				if (!(key in translations)) {
					return undefined;
				}
				var translation = translations[key];
				try {
					for (var i = 0; i < args.length; i++) {
						translation = translation.replace(new RegExp("\\{" + i + "\\}", 'g'), args[i]);
					}
					return translation;
				} catch (e) {
					return undefined;
				}
			};
			//create coreApi
			env.oShareDialog.oCoreApi = {
				getText: fGetText
			};
		},
		afterEach: function() {}
	});
	QUnit.test("Unknown Key", function(assert) {
		var result = this.oShareDialog.translate("unknown");
		assert.strictEqual(result, undefined, "returns undefined");
	});
	QUnit.test("Valid Key", function(assert) {
		var result = this.oShareDialog.translate("key");
		assert.strictEqual(result, "translation", "returns correct translation");
	});
	QUnit.test("Valid Key With One Argument", function(assert) {
		var result = this.oShareDialog.translate("key_one", "lat");
		assert.strictEqual(result, "translation lat", "returns correct translation containing the argument");
	});
	QUnit.test("Valid Key With Multiple Arguments", function(assert) {
		var result = this.oShareDialog.translate("key_mult", "mult", "trans", "ion");
		assert.strictEqual(result, "translation mult", "returns correct translation containing the arguments");
	});

});
