/* globals QUnit, sinon */

sap.ui.define([
	"sap/base/i18n/Localization",
	"sap/ui/core/Element",
	'sap/ui/qunit/QUnitUtils',
	"sap/ui/qunit/utils/createAndAppendDiv",
	'sap/ui/core/Control',
	"sap/ui/model/resource/ResourceModel",
	'sap/ui/comp/variants/VariantItem',
	'sap/ui/comp/smartvariants/SmartVariantManagement',
	'sap/ui/comp/smartvariants/PersonalizableInfo',
	'sap/ui/fl/apply/api/SmartVariantManagementApplyAPI',
	'sap/ui/fl/apply/api/FlexRuntimeInfoAPI',
	'sap/ui/fl/write/api/SmartVariantManagementWriteAPI',
	"sap/ui/fl/write/api/ContextSharingAPI",
	"sap/ui/qunit/utils/nextUIUpdate"
], function(
	Localization,
	Element,
	QUnitUtils,
	createAndAppendDiv,
	Control,
	ResourceModel,
	VariantItem,
	SmartVariantManagement,
	PersonalizableInfo,
	FlexApplyAPI,
	FlexRuntimeInfoAPI,
	FlexWriteAPI,
	FlexContextSharingAPI,
	nextUIUpdate
) {
	"use strict";

	// prepare DOM
	createAndAppendDiv("qunit-fixture-visible");

	function createVariantStub(sName, sText, oContent, mContexts, packageName, request) {
		var oObj = {
			content: null,
			executeOnSelection: false,
			request: request,
			packageName: packageName,
			text: sText,
			author: "author",
			getId: function () { return sName; },
			getVariantId: function () { return sName; },
			isUserDependent: function () { return (this.getId() === "*standard*" ? false : true); },
			getRequest: function () { return this.request; },
			setRequest: function (s) { this.request = s; },
			getPackage: function () { return this.packageName; },
			setPackage: function (s) { this.packageName = s; },
			getNamespace: function () { return ""; },
			isReadOnly: function () { return !this.isEditEnabled(); },
			isRenameEnabled: function () { return true; },
			isEditEnabled: function () { return (this.getId() === "*standard*" ? false : true); },
			isDeleteEnabled: function () { return (this.getId() === "*standard*" ? false : true); },
			getFavorite: function () { return true; },
			getDefinition: function () { return null; },
			getName: function () { return this.text; },
			setName: function (s) { this.text = s; },
			getContent: function () { return (this.content || {}); },
			setContent: function (oContent) {
				if (oContent && oContent.hasOwnProperty("executeOnSelection")) {
					this.setExecuteOnSelection(oContent.executeOnSelection);
				}
				this.content = oContent;
			},
			getContexts: function () { return mContexts; },
			setExecuteOnSelection: function (bExe) { this.executeOnSelection = bExe; },
			getExecuteOnSelection: function () { return this.executeOnSelection; },
			getLayer: function () { return ""; },
			setAuthor: function (sAuthor) { this.author = sAuthor; },
			getAuthor: function () { return this.author; }
		};

		oObj.setContent(oContent);

		return oObj;
	}

	function createVariantStubs(bAppVariant, aFLVariants, sVendorStandardText = "") {
		var mChanges = {};
		var oVariant1 = createVariantStub("1", "ONE", undefined, { role: [] });
		var oVariant2 = createVariantStub("2", "TWO", { data: "TEST", standardvariant: true }, { role: [] }, "package", "request");
		var oVariant3 = createVariantStub("3", "THREE", { executeOnSelection: true }, { role: ["Role1", "Role2", "Role3"] });
		if (bAppVariant) {
			mChanges.standardVariant = oVariant2;
			mChanges.variants = [oVariant1, oVariant3];
		} else {
			mChanges.standardVariant = createVariantStub("*standard*", sVendorStandardText ? sVendorStandardText : "Standard");
			mChanges.variants = [oVariant1, oVariant2, oVariant3];
		}

		if (aFLVariants) {
			for (var i = 0; i < aFLVariants.length; i++) {
				mChanges.variants.push(aFLVariants[i]);
			}
		}

		return mChanges;
	}

	var oStubLoadVariants;
	var oStubIsVariantSharingEnabled;
	var oStubIsVariantAdaptationEnabled;
	var oStubIsVariantPersonalizationEnabled;
	var oStubSave;



	function stubLoadVariants(mProperties) {
		if (!(FlexApplyAPI && FlexApplyAPI.loadVariants && FlexApplyAPI.loadVariants.displayName === "loadVariants")) {
			oStubLoadVariants = sinon.stub(FlexApplyAPI, "loadVariants");
		}
		oStubLoadVariants.returns(mProperties);
	}

	function stubIsVariantAdaptationEnabled(bValue) {
		if (!(FlexWriteAPI && FlexWriteAPI.isVariantAdaptationEnabled && FlexWriteAPI.isVariantAdaptationEnabled.displayName === "isVariantAdaptationEnabled")) {
			oStubIsVariantAdaptationEnabled = sinon.stub(FlexWriteAPI, "isVariantAdaptationEnabled");
		}
		oStubIsVariantAdaptationEnabled.returns(bValue);
	}

	function stubIsVariantSharingEnabled(bValue) {
		if (!(FlexWriteAPI && FlexWriteAPI.isVariantSharingEnabled && FlexWriteAPI.isVariantSharingEnabled.displayName === "isVariantSharingEnabled")) {
			oStubIsVariantSharingEnabled = sinon.stub(FlexWriteAPI, "isVariantSharingEnabled");
		}
		oStubIsVariantSharingEnabled.returns(bValue);
	}

	function stubIsVariantPersonalizationEnabled(bValue) {
		if (!(FlexWriteAPI && FlexWriteAPI.isVariantPersonalizationEnabled && FlexWriteAPI.isVariantPersonalizationEnabled.displayName === "isVariantPersonalizationEnabled")) {
			oStubIsVariantPersonalizationEnabled = sinon.stub(FlexWriteAPI, "isVariantPersonalizationEnabled");
		}
		oStubIsVariantPersonalizationEnabled.returns(bValue);
	}


	function stubSave(oValue) {
		if (!(FlexWriteAPI && FlexWriteAPI.save && FlexWriteAPI.save.displayName === "save")) {
			oStubSave = sinon.stub(FlexWriteAPI, "save");
		}
		oStubSave.returns(oValue);
	}

	function fakeResolved(value) {
		// return Promise.resolve(value);
		return {
			then: function (callback, fail) {
				var oObj = value;
				callback(oObj);
			},
			fail: function (callback) {
				callback();
			}
		};
	}

	var ControlForTest = Control.extend("sap.ui.ControlForTest", {
		metadata: {
			_sOwnerId: "testId",
			properties: {
				key: "string",
				persistencyKey: "string"
			},
			events: {
				beforeVariantSave: {},
				afterVariantLoad: {
					parameters: {
						sContext: {
							type: "string"
						}
					}
				}
			}
		},
		renderer: null,
		fetchVariant: function () {
			return {
				id: "ID",
				test: "TEST"
			};
		},
		applyVariant: function (oVariant, sContext) {
			this._applyedData = oVariant;

			var oEvent = {
				context: sContext
			};
			this.fireEvent("afterVariantLoad", oEvent);
		},

		_getApplyedData: function () {
			return this._applyedData;
		},

		_initialized: function () {
		},

		fireBeforeVariantSave: function (s) {
			var oEvent = {
				context: s
			};
			this.fireEvent("beforeVariantSave", oEvent);
		}
	});

	function createControlInfo(oVariantManagement, sKey, bDoNotStub) {

		if (!sKey) {
			sKey = "4711";
		}

		if (!bDoNotStub) {
			oVariantManagement._oPersistencyPromise = Promise.resolve();
		}

		var oControl = new ControlForTest({
			key: sKey,
			persistencyKey: "SmartVariant"
		});
		var oPersControlInfo = new PersonalizableInfo({
			type: "TYPE",
			dataSource: "DATA_SOURCE",
			keyName: "key"
		});
		oPersControlInfo.setControl(oControl);

		oVariantManagement.addPersonalizableControl(oPersControlInfo);

		return oPersControlInfo;
	}

	QUnit.module("sap.ui.comp.smartvariants.SmartVariantManagement", {
		beforeEach: function () {
			this.oVariantManagement = new SmartVariantManagement({
				showShare: true
			});
			sinon.stub(FlexRuntimeInfoAPI, "isFlexSupported").returns(true);

			this._oVM = this.oVariantManagement._getEmbeddedVM();
		},
		afterEach: function () {
			this.oVariantManagement.destroy();
			FlexRuntimeInfoAPI.isFlexSupported.restore();
			this._oVM = null;
		}
	});

	QUnit.test("Shall be instantiable", function (assert) {
		assert.ok(this.oVariantManagement);
	});

	QUnit.test("check property 'standardItemText'", function (assert) {
		var oVariantManagement = new SmartVariantManagement({
			standardItemText: "MyStandard"
		});

		assert.equal(oVariantManagement.getStandardItemText(), "MyStandard");
		oVariantManagement.destroy();
	});

	QUnit.test("check bound property 'standardItemText'", async function (assert) {
		var done = assert.async();

		var oVariantManagement = new SmartVariantManagement({
			standardItemText: {
				path: "\MyStandard",
				model: "i18n"
			}
		});

		assert.equal(oVariantManagement.getStandardItemText(), "");

		oVariantManagement.setModel(new ResourceModel({
			bundleName: "test-resources/sap/ui/comp/qunit/smartvariants/i18n/i18n"
		}), "i18n");

		await nextUIUpdate();

		await oVariantManagement._getStandardVariantItemName();
		assert.equal(oVariantManagement.getStandardItemText(), "My Standard");
		oVariantManagement.destroy();
		done();
	});

	QUnit.test("Exit shall be called", function (assert) {
		var oVariantManagement = new SmartVariantManagement();
		sinon.spy(oVariantManagement, "exit");
		oVariantManagement.destroy();
		assert.ok(oVariantManagement.exit.called, "expecting 'exit' to be called");
	});

	QUnit.test("Check rendering", function(assert) {
		var sString = "";
		var oRm = {
			openStart: function(s) {
				sString += s;
				return this;
			},
			style: function(p, v) {
				sString += ('style=\"\{' + p + '=' + v + '\}\"');
				return this;
			},
			'class': function(s) {
				sString += ('class=\"' + s + '\"');
				return this;
			},
			attr: function() {
				return this;
			},
			openEnd: function() {
				return this;
			},
			close: function(s) {
				sString += s;
				return this;
			},
			renderControl: function() {
				return this;
			}
		};

		var oRenderer = this.oVariantManagement.getMetadata().getRenderer();
		assert.ok(oRenderer);
		oRenderer.render(oRm, this.oVariantManagement);
		assert.ok(sString);
	});

	QUnit.test("check _dataReceived", function (assert) {
		var mChanges = createVariantStubs();

		var oPersControlInfo = createControlInfo(this.oVariantManagement);
		var oControl = Element.getElementById(oPersControlInfo.getControl());

		var sContext = null;
		var fBeforeSave = function (oEvent) {
			sContext = oEvent.getParameters().context;
		};
		oControl.attachBeforeVariantSave(fBeforeSave);

		sinon.spy(this.oVariantManagement, "getStandardVariant");
		sinon.spy(this.oVariantManagement, "_createVariantEntries");
		sinon.spy(this.oVariantManagement, "fireEvent");
		sinon.stub(this.oVariantManagement, "setPersControler");

		this._oVM._createVariantList();
		sinon.stub(this._oVM.oVariantPopOver, "openBy");
		this.oVariantManagement._dataReceived(mChanges, false, true, false, this.oVariantManagement._getControlWrapper(oControl));


		assert.ok(sContext === "STANDARD");

		assert.ok(this.oVariantManagement._createVariantEntries.called, "expecting '_createVariantEntries' to be called");
		assert.ok(this.oVariantManagement.getVariantItems());
		assert.equal(this.oVariantManagement.getVariantItems().length, 4, "expecting three entries");


		assert.ok(!this.oVariantManagement.getShowShare());

		this._oVM._openVariantList();
		assert.ok(this._oVM.oVariantSaveAsBtn.getVisible());
	});


	QUnit.test("check _dataReceived with isVariantPersonalizationEnabled=false", function (assert) {
		var mChanges = createVariantStubs();

		var oPersControlInfo = createControlInfo(this.oVariantManagement);
		var oControl = Element.getElementById(oPersControlInfo.getControl());

		var sContext = null;
		var fBeforeSave = function (oEvent) {
			sContext = oEvent.getParameters().context;
		};
		oControl.attachBeforeVariantSave(fBeforeSave);

		sinon.spy(this.oVariantManagement, "getStandardVariant");
		sinon.spy(this.oVariantManagement, "_createVariantEntries");
		sinon.spy(this.oVariantManagement, "fireEvent");

		this._oVM._createVariantList();
		sinon.stub(this._oVM.oVariantPopOver, "openBy");
		this.oVariantManagement._dataReceived(mChanges, false, false, false, this.oVariantManagement._getControlWrapper(oControl));

		assert.ok(sContext === "STANDARD");

		assert.ok(this.oVariantManagement._createVariantEntries.called, "expecting '_createVariantEntries' to be called");
		assert.ok(this.oVariantManagement.getVariantItems());
		assert.equal(this.oVariantManagement.getVariantItems().length, 4, "expecting three entries");

		assert.ok(!this.oVariantManagement.getShowShare());

		this._oVM._openVariantList();
		assert.ok(!this._oVM.oVariantSaveAsBtn.getVisible());
	});

	QUnit.test("check getVariantContent", function (assert) {
		var mChanges = createVariantStubs();
		var oPersControlInfo = createControlInfo(this.oVariantManagement);
		var oControl = Element.getElementById(oPersControlInfo.getControl());

		this.oVariantManagement._createVariantEntries(mChanges);

		var oObj = this.oVariantManagement.getVariantContent(oControl, "2");

		assert.ok(oObj);
		assert.equal(oObj.data, "TEST");

		var v = this.oVariantManagement._getVariantById("2");
		assert.equal(v.getExecuteOnSelection(), false);

		v = this.oVariantManagement._getVariantById("3");
		assert.equal(v.getExecuteOnSelection(), true);

	});

	QUnit.test("check fetch/apply standard variant without promises", function (assert) {

		var mChanges = createVariantStubs();

		var oPersControlInfo = createControlInfo(this.oVariantManagement);
		var oControl = Element.getElementById(oPersControlInfo.getControl());
		return this.oVariantManagement._loadFlex().then(function () {
			sinon.spy(oControl, "fetchVariant");
			sinon.spy(oControl, "applyVariant");

			this.oVariantManagement._dataReceived(mChanges, null, true, false, this.oVariantManagement._getControlWrapper(this.oVariantManagement._oPersoControl));

			this.oVariantManagement.fireSelect({
				key: this.oVariantManagement.STANDARDVARIANTKEY
			}); // apply

			assert.ok(oControl.fetchVariant.calledOnce);
			assert.ok(oControl.applyVariant.calledOnce);

			var oObj = oControl._getApplyedData();
			assert.equal(oObj.id, "ID");
			assert.equal(oObj.test, "TEST");

			oControl.destroy();
		}.bind(this));
	});

	QUnit.test("check apply automatically on standard without promises", function (assert) {

		var mChanges = createVariantStubs();

		var oPersControlInfo = createControlInfo(this.oVariantManagement);
		var oControl = Element.getElementById(oPersControlInfo.getControl());
		var oWrapper = {
			control: oControl,
			loaded: {
				resolve: function () { }
			}
		};

		sinon.spy(oControl, "fetchVariant");

		this.oVariantManagement._dataReceived(mChanges, null, true, false, oWrapper);

		assert.ok(!this.oVariantManagement._getApplyAutomaticallyOnStandardVariant());

		var fCallBack = function () { return true; };
		this.oVariantManagement.registerApplyAutomaticallyOnStandardVariant(fCallBack);

		assert.ok(!this.oVariantManagement._getApplyAutomaticallyOnStandardVariant());

		this.oVariantManagement.setDisplayTextForExecuteOnSelectionForStandardVariant("what ever");
		assert.ok(this.oVariantManagement._getApplyAutomaticallyOnStandardVariant());

		oControl.destroy();
	});

	QUnit.test("check apply automatically on standard without promises initial phase", function (assert) {

		var mChanges = createVariantStubs();
		var bSearchCalled = false;

		var oPersControlInfo = createControlInfo(this.oVariantManagement);
		var oControl = Element.getElementById(oPersControlInfo.getControl());
		oControl.search = function (oEvent) {
			bSearchCalled = true;
		};

		var oWrapper = {
			control: oControl,
			loaded: {
				resolve: function () { }
			}
		};

		sinon.spy(oControl, "fetchVariant");

		var fCallBack = function () { return true; };
		this.oVariantManagement.registerApplyAutomaticallyOnStandardVariant(fCallBack);

		this.oVariantManagement._dataReceived(mChanges, null, true, false, oWrapper);
		assert.ok(!bSearchCalled);

		this.oVariantManagement.setDisplayTextForExecuteOnSelectionForStandardVariant("what ever");
		this.oVariantManagement._dataReceived(mChanges, null, true, false, oWrapper);
		assert.ok(bSearchCalled);

		oControl.destroy();
	});

	QUnit.test("check fireSave", function (assert) {

		var nSaveCalled = 0;
		this.oVariantManagement.attachSave(function(oEvent){
			nSaveCalled++;
			assert.equal(oEvent.getParameter("name"), "V1", "view name expected");
		});

		sinon.stub(this.oVariantManagement, "_newVariant");
		sinon.stub(this.oVariantManagement, "_updateVariant");

		this.oVariantManagement.fireSave({
			overwrite: true,
			key: "1",
			name: "V1"
		});

		assert.ok(this.oVariantManagement._updateVariant.calledOnce);
		assert.ok(!this.oVariantManagement._newVariant.called);


		this.oVariantManagement._newVariant.reset();
		this.oVariantManagement._updateVariant.reset();

		this.oVariantManagement.fireSave({
			overwrite: false,
			key: "1",
			name: "V1"
		});

		assert.ok(!this.oVariantManagement._updateVariant.called);
		assert.ok(this.oVariantManagement._newVariant.calledOnce);

		assert.equal(nSaveCalled, "2");
	});

	QUnit.test("check fireSave with standard variant", function (assert) {

		sinon.stub(this.oVariantManagement, "_newVariant");
		sinon.stub(this.oVariantManagement, "_updateVariant");
		sinon.stub(this.oVariantManagement, "_save");

		this.oVariantManagement.fireSave({
			overwrite: true,
			key: this.oVariantManagement.STANDARDVARIANTKEY,
			name: "V1"
		});

		assert.ok(!this.oVariantManagement._newVariant.called);
		assert.ok(!this.oVariantManagement._updateVariant.called);
		assert.ok(!this.oVariantManagement._save.called);
	});

	QUnit.test("check fireSelect", function (assert) {

		var oVariant = {
			getVariantId: function () { return "testId"; },
			getContent: function () {
				return { test: "CONTENT" };
			},
			getExecuteOnSelection: function () { return true; }
		};

		sinon.stub(this.oVariantManagement, "_getVariantById").returns(oVariant);
		sinon.stub(this.oVariantManagement, "_applyVariant");
		sinon.stub(this.oVariantManagement, "getStandardVariant");

		this.oVariantManagement._oPersoControl = {};

		this.oVariantManagement.fireSelect({
			key: "1"
		});

		assert.ok(this.oVariantManagement._applyVariant.calledOnce);
		assert.ok(!this.oVariantManagement.getStandardVariant.called);
	});

	QUnit.test("check fireSelect with standard variant", function (assert) {

		this.oVariantManagement._oPersoControl = {};

		sinon.stub(this.oVariantManagement, "_getVariantById").returns({ getVariantId: function () { return "testId"; }, getExecuteOnSelection: function () { return false; }, getContent: function () { return {}; } });
		sinon.stub(this.oVariantManagement, "_applyVariant");
		sinon.stub(this.oVariantManagement, "getStandardVariant").returns({});

		this.oVariantManagement.fireSelect({
			key: this.oVariantManagement.STANDARDVARIANTKEY
		});

		assert.ok(this.oVariantManagement._applyVariant.calledOnce);
		assert.ok(this.oVariantManagement.getStandardVariant.calledOnce);
	});

	QUnit.test("check fireManage", function (assert) {
		createControlInfo(this.oVariantManagement);

		var bManageFired = false;
		this.oVariantManagement.attachManage(function (oEvent) {
			bManageFired = true;
		});

		sinon.stub(this.oVariantManagement, "_renameVariant");
		sinon.stub(this.oVariantManagement, "_deleteVariants");
		sinon.stub(this.oVariantManagement, "_setDefaultVariantKey");
		sinon.stub(this.oVariantManagement, "_save");

		var oInfo = {
			deleted: [
				{
					key: "1"
				}
			],
			renamed: [
				{
					key: "2",
					name: "V1"
				}
			],
			def: [
				{
					key: "1"
				}
			]
		};

		var bCalled = false;
		this.oVariantManagement.attachSave(function () {
			bCalled = true;
		});

		this.oVariantManagement.fireManage(oInfo);

		assert.ok(!bCalled);
		assert.ok(this.oVariantManagement._renameVariant.calledOnce);
		assert.ok(this.oVariantManagement._deleteVariants.calledOnce);
		assert.ok(this.oVariantManagement._setDefaultVariantKey.calledOnce);

		assert.ok(bManageFired);
	});

	QUnit.test("check addPersonalizableControl ", function (assert) {

		var oSetPersControler = sinon.stub(this.oVariantManagement, "setPersControler");

		var oControl = new ControlForTest({
			key: "4711"
		});
		var oPersControlInfo = new PersonalizableInfo({
			type: "TYPE",
			dataSource: "DATA_SOURCE",
			keyName: "key"
		});
		oPersControlInfo.setControl(oControl);

		this.oVariantManagement.addPersonalizableControl(oPersControlInfo);

		assert.ok(oSetPersControler.calledOnce);
	});

	QUnit.test("check getVariantContent", function (assert) {

		var mChanges = createVariantStubs();

		this.oVariantManagement._createVariantEntries(mChanges);

		var oContent = this.oVariantManagement.getVariantContent(null, "2");
		assert.ok(oContent);
		assert.ok(oContent.data);
		assert.equal(oContent.data, "TEST");
	});

	QUnit.test("check getVariantContent for page variant", function (assert) {

		var oControlInfo1 = {
			keyName: "id",
			control: {
				getId: function () { return "PK1"; }
			}
		};
		var oControlInfo2 = {
			keyName: "pk",
			control: {
				getProperty: function (s) { return "PK2"; }
			}
		};

		var oPageVariantContent = { PK1: { someContent: {} }, PK2: { someOtherContent: {} } };

		sinon.stub(this.oVariantManagement, "isPageVariant").returns(true);
		sinon.stub(this.oVariantManagement, "_getControlWrapper").returns(oControlInfo2);
		sinon.stub(this.oVariantManagement, "_getVariantContent").returns(oPageVariantContent);

		var oContent1 = this.oVariantManagement.getVariantContent(oControlInfo1, "2");
		assert.ok(oContent1);
		assert.deepEqual(oContent1, oPageVariantContent["PK1"]);

		var oContent2 = this.oVariantManagement.getVariantContent({}, "2");
		assert.ok(oContent2);
		assert.deepEqual(oContent2, oPageVariantContent["PK2"]);
	});

	QUnit.test("check fireSave: _updateVariant", function (assert) {

		var mChanges = createVariantStubs();
		this.oVariantManagement._createVariantEntries(mChanges);

		sinon.stub(this.oVariantManagement, "setPersControler");
		sinon.stub(this.oVariantManagement, "_save");
		sinon.stub(this.oVariantManagement.oModel, "_flWriteUpdateVariant").callsFake(function (mProperties) {
			var oVariant = this._getVariantById(mProperties.id);
			if (mProperties.hasOwnProperty("content")) {
				oVariant.setContent(mProperties.content);
				assert.ok(mProperties.hasOwnProperty("packageName"));
				assert.ok(mProperties.hasOwnProperty("transportId"));
			}
			if (mProperties.hasOwnProperty("executeOnSelection")) {
				oVariant.setExecuteOnSelection(mProperties.executeOnSelection);
				assert.ok(!mProperties.hasOwnProperty("packageName"));
				assert.ok(!mProperties.hasOwnProperty("transportId"));
			}
			return oVariant;
		}.bind(this.oVariantManagement));

		var oPersControlInfo = createControlInfo(this.oVariantManagement);
		var oControl = Element.getElementById(oPersControlInfo.getControl());

		sinon.stub(oControl, "fetchVariant").returns({
			data: "MY TEST"
		});

		var oItem = {
			getExecuteOnSelect: function (sKey) {
				return true;
			}
		};
		sinon.stub(this.oVariantManagement, "getItemByKey").returns(oItem);

		var oInfo = {
			key: "2",
			overwrite: true,
			lifecycleTransportId: "transportId",
			lifecyclePackage: "packageName"
		};


		this.oVariantManagement.fireSave(oInfo);
		var oVariant = this.oVariantManagement._getVariantById(oInfo.key);
		assert.ok(oVariant);
		assert.equal(oVariant.getExecuteOnSelection(), true);

		var oContent = oVariant.getContent();
		assert.ok(oContent);
		assert.ok(oContent.data);
		assert.equal(oContent.data, "MY TEST");

		assert.ok(this.oVariantManagement._save.calledOnce);

		oControl.destroy();
	});

	QUnit.test("check fireSave: _newVariant", function (assert) {

		var sNewId = "4711";
		var mChanges = createVariantStubs();
		this.oVariantManagement._createVariantEntries(mChanges);

		sinon.stub(this.oVariantManagement, "_setDefaultVariantKey");
		sinon.stub(this.oVariantManagement, "setPersControler");
		sinon.stub(this.oVariantManagement, "_save");
		sinon.stub(this.oVariantManagement.oModel, "_flWriteUpdateVariant");
		sinon.stub(this.oVariantManagement.oModel, "_flWriteAddVariant").callsFake(function (mProperties) {
			var oVariant = createVariantStub(sNewId);

			if (mProperties.changeSpecificData.hasOwnProperty("content")) {
				oVariant.setContent(mProperties.changeSpecificData.content);
			}
			if (mProperties.changeSpecificData.hasOwnProperty("executeOnSelection")) {
				oVariant.setExecuteOnSelection(mProperties.changeSpecificData.executeOnSelection);
			}
			if (mProperties.changeSpecificData.hasOwnProperty("packageName")) {
				oVariant.setPackage(mProperties.changeSpecificData.packageName);
			}
			if (mProperties.changeSpecificData.hasOwnProperty("texts") && mProperties.changeSpecificData.texts.hasOwnProperty("variantName")) {
				oVariant.setName(mProperties.changeSpecificData.texts.variantName);
			}

			return oVariant;
		});

		var oPersControlInfo = createControlInfo(this.oVariantManagement);
		var oControl = Element.getElementById(oPersControlInfo.getControl());

		sinon.stub(oControl, "fetchVariant").returns({
			data: "MY NEW TEST"
		});

		var oInfo = {
			key: "oldId",
			name: "newVariant",
			lifecyclePackage: "PACKAGE",
			lifecycleTransportId: "TRANSPORT_ID",
			execute: true,
			def: true
		};

		this.oVariantManagement.fireSave(oInfo);

		var oVariantItem = this.oVariantManagement.getItemByKey(sNewId);
		assert.ok(oVariantItem);
		assert.ok(oVariantItem.getKey() === sNewId);

		var oVariant = this.oVariantManagement._getVariantById(oVariantItem.getKey());
		assert.ok(oVariant);
		assert.equal(oVariant.getExecuteOnSelection(), true);

		var oContent = oVariant.getContent();
		assert.ok(oContent);
		assert.ok(oContent.data);
		assert.equal(oContent.data, "MY NEW TEST");

		assert.ok(this.oVariantManagement._save.calledOnce);
		assert.ok(this.oVariantManagement._setDefaultVariantKey.calledOnce);

		oControl.destroy();
	});

	QUnit.test("check fireSave: _newVariant implicit with existing key", function (assert) {

		var sNewId = "4711";
		sinon.stub(this.oVariantManagement, "_save");
		sinon.stub(this.oVariantManagement, "setPersControler");
		sinon.stub(this.oVariantManagement, "_setDefaultVariantKey");
		sinon.stub(this.oVariantManagement.oModel, "_flWriteUpdateVariant");
		sinon.stub(this.oVariantManagement.oModel, "_flWriteAddVariant").callsFake(function (mProperties) {
			var oVariant = createVariantStub(sNewId);

			if (mProperties.changeSpecificData.hasOwnProperty("content")) {
				oVariant.setContent(mProperties.changeSpecificData.content);
			}
			if (mProperties.changeSpecificData.hasOwnProperty("executeOnSelection")) {
				oVariant.setExecuteOnSelection(mProperties.changeSpecificData.executeOnSelection);
			}
			if (mProperties.changeSpecificData.hasOwnProperty("packageName")) {
				oVariant.setPackage(mProperties.changeSpecificData.packageName);
			}
			if (mProperties.changeSpecificData.hasOwnProperty("texts") && mProperties.changeSpecificData.texts.hasOwnProperty("variantName")) {
				oVariant.setName(mProperties.changeSpecificData.texts.variantName);
			}
			return oVariant;
		});

		var oPersControlInfo = createControlInfo(this.oVariantManagement);
		var oControl = Element.getElementById(oPersControlInfo.getControl());
		sinon.stub(oControl, "fetchVariant").returns({
			data: "MY NEW TEST"
		});

		var oInfo = {
			key: "1",
			name: "newVariant",
			implicit: true,
			def: true
		};

		assert.equal(this.oVariantManagement.getVariantItems().length, 0);
		this.oVariantManagement.fireSave(oInfo);

		assert.equal(this.oVariantManagement.getVariantItems().length, 1);
		assert.ok(this.oVariantManagement.getVariantItems()[0].getKey() !== oInfo.key);

		oControl.destroy();
	});

	QUnit.test("check fireSave: _newVariant implicit", function (assert) {

		var sNewId = "4711";
		sinon.stub(this.oVariantManagement, "_save");
		sinon.stub(this.oVariantManagement, "setPersControler");
		sinon.stub(this.oVariantManagement, "_setDefaultVariantKey");
		sinon.stub(this.oVariantManagement.oModel, "_flWriteUpdateVariant");
		sinon.stub(this.oVariantManagement.oModel, "_flWriteAddVariant").callsFake(function (mProperties) {
			var oVariant = createVariantStub(sNewId);

			if (mProperties.changeSpecificData.hasOwnProperty("content")) {
				oVariant.setContent(mProperties.changeSpecificData.content);
			}
			if (mProperties.changeSpecificData.hasOwnProperty("executeOnSelection")) {
				oVariant.setExecuteOnSelection(mProperties.changeSpecificData.executeOnSelection);
			}
			if (mProperties.changeSpecificData.hasOwnProperty("packageName")) {
				oVariant.setPackage(mProperties.changeSpecificData.packageName);
			}
			if (mProperties.changeSpecificData.hasOwnProperty("texts") && mProperties.changeSpecificData.texts.hasOwnProperty("variantName")) {
				oVariant.setName(mProperties.changeSpecificData.texts.variantName);
			}

			return oVariant;
		});

		var oPersControlInfo = createControlInfo(this.oVariantManagement);
		var oControl = Element.getElementById(oPersControlInfo.getControl());
		sinon.stub(oControl, "fetchVariant").returns({
			data: "MY NEW TEST"
		});

		var oInfo = {
			key: undefined,
			implicit: true,
			def: true,
			name: "newVariant"
		};

		assert.equal(this.oVariantManagement.getVariantItems().length, 0);

		this.oVariantManagement.fireSave(oInfo);

		assert.equal(this.oVariantManagement.getVariantItems().length, 1);
		assert.ok(this.oVariantManagement.getVariantItems()[0].getKey() !== oInfo.key);

		assert.ok(this.oVariantManagement.getCurrentVariantId());

		oControl.destroy();
	});

	QUnit.test("check fireManage: _deleteVariants", function (assert) {

		var mChanges = createVariantStubs();
		mChanges.defaultVariantId = "2";
		this.oVariantManagement._createVariantEntries(mChanges);

		sinon.spy(this.oVariantManagement, "_deleteVariants");
		sinon.stub(this.oVariantManagement, "setPersControler");
		sinon.stub(this.oVariantManagement, "_save");
		sinon.stub(this.oVariantManagement, "_appendLifecycleInformation");
		sinon.stub(this.oVariantManagement.oModel, "_flWriteRemoveVariant").callsFake(function (mProperties) {
			return this.oVariantManagement._mVariants[mProperties.id];
		}.bind(this));

		var sDefaultKey = null;
		sinon.stub(this.oVariantManagement, "_setDefaultVariantKey").callsFake(function (sKey) {
			sDefaultKey = sKey;
		});

		var oInfo = {
			deleted: [
				"1", "2", "3"
			]
		};

		assert.ok(!this.oVariantManagement._deleteVariants.called);

		this.oVariantManagement.fireManage(oInfo);


		assert.ok(sDefaultKey === "");

		assert.ok(this.oVariantManagement._deleteVariants.calledOnce);
		assert.ok(this.oVariantManagement._appendLifecycleInformation.calledThrice);
	});

	QUnit.test("check fireManage: _renameVariant", function (assert) {

		var mChanges = createVariantStubs();
		this.oVariantManagement._createVariantEntries(mChanges);

		sinon.stub(this.oVariantManagement, "setPersControler");
		sinon.stub(this.oVariantManagement, "_save");
		sinon.stub(this.oVariantManagement, "_appendLifecycleInformation").returns("transportId");


		sinon.stub(this.oVariantManagement.oModel, "_flWriteUpdateVariant").callsFake(function (mProperties) {
			var oVariant = this._getVariantById(mProperties.id);
			if (mProperties.hasOwnProperty("name")) {
				oVariant.setName(mProperties.name);
			}

			assert.ok(mProperties.hasOwnProperty("transportId"));
			assert.ok(mProperties.transportId, "transportId");

			return oVariant;
		}.bind(this.oVariantManagement));

		var oInfo = {
			renamed: [
				{
					key: "1",
					name: "NEW ONE"
				}, {
					key: "2",
					name: "NEW TWO"
				}
			]
		};

		assert.equal(this.oVariantManagement._getVariantById("1").getName(), "ONE");
		assert.equal(this.oVariantManagement._getVariantById("2").getName(), "TWO");

		this.oVariantManagement.fireManage(oInfo);

		assert.equal(this.oVariantManagement._getVariantById("1").getName(), "NEW ONE");
		assert.equal(this.oVariantManagement._getVariantById("2").getName(), "NEW TWO");
	});


	QUnit.test("check fireManage: _setExecuteOnSelections", function (assert) {

		var oInfo = {
			exe: [{
				key: "1",
				exe: true
			}, {
				key: "2",
				exe: false
			}, {
				key: "*standard*",
				exe: true
			}]
		};

		var mChanges = createVariantStubs();
		this.oVariantManagement._createVariantEntries(mChanges);

		sinon.stub(this.oVariantManagement, "setPersControler");
		sinon.stub(this.oVariantManagement, "_save");
		sinon.stub(this.oVariantManagement.oModel, "_flWriteUpdateVariant").callsFake(function (mProperties) {
			var oVariant = this._getVariantById(mProperties.id);
			if (mProperties.hasOwnProperty("executeOnSelection")) {
				oVariant.setExecuteOnSelection(mProperties.executeOnSelection);
			}
		}.bind(this.oVariantManagement));


		assert.ok(!this.oVariantManagement._getVariantById(oInfo.exe[2].key).getExecuteOnSelection());

		this.oVariantManagement.fireManage(oInfo);

		assert.ok(this.oVariantManagement._getVariantById(oInfo.exe[0].key).getExecuteOnSelection());
		assert.ok(!this.oVariantManagement._getVariantById(oInfo.exe[1].key).getExecuteOnSelection());
	});


	QUnit.test("check getCurrentVariantId STANDARD", function (assert) {

		var sKey = this.oVariantManagement.getCurrentVariantId();
		assert.equal(sKey, "");
	});

	QUnit.test("check getCurrentVariantId not STANDARD", function (assert) {

		var mChanges = createVariantStubs();
		mChanges.defaultVariantId = "3";
		var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
		var oControl = Element.getElementById(oPersControlInfo.getControl());
		this.oVariantManagement._oPersoControl = oControl;

		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(this.oVariantManagement._oPersoControl));

		var sKey = this.oVariantManagement.getCurrentVariantId();
		assert.equal(sKey, "3");

		oControl.destroy();
	});

	QUnit.test("check setCurrentVariantId STANDARD", function (assert) {

		var aArray = [];
		aArray.push({
			control: {}
		});
		sinon.stub(this.oVariantManagement, "_getAllPersonalizableControls").returns(aArray);

		this.oVariantManagement._oPersoControl = {};

		sinon.stub(this.oVariantManagement, "_applyVariant");
		sinon.stub(this.oVariantManagement, "_getVariantById").returns({ getExecuteOnSelection: function () { return true; }, getContent: function() { return {}; } });
		sinon.stub(this.oVariantManagement, "_getVariantContent").returns("STANDARD");
		var spy = sinon.spy(this.oVariantManagement, "setCurrentVariantKey");
		spy.withArgs(this.oVariantManagement.STANDARDVARIANTKEY);

		this.oVariantManagement._oStandardVariant = {};
		this.oVariantManagement._bIsInitialized = true;

		this.oVariantManagement.setCurrentVariantId("");

		assert.ok(spy.withArgs(this.oVariantManagement.STANDARDVARIANTKEY).calledOnce);
		assert.ok(this.oVariantManagement._applyVariant.calledOnce);

		//---- no content for standard
		this.oVariantManagement._applyVariant.restore();
		this.oVariantManagement._oStandardVariant = null;

		this.oVariantManagement.setCurrentVariantId("");

		assert.ok(spy.withArgs(this.oVariantManagement.STANDARDVARIANTKEY).calledTwice);
		assert.ok(!this.oVariantManagement._applyVariant.called);
	});

	QUnit.test("check setCurrentVariantId non STANDARD with simulated variantsLoad", function (assert) {

		var aArray = [];
		aArray.push({
			control: {}
		});
		sinon.stub(this.oVariantManagement, "_getAllPersonalizableControls").returns(aArray);

		this.oVariantManagement._oPersoControl = {};

		var bExpectedVariantId = false;

		sinon.stub(this.oVariantManagement, "_applyVariant").callsFake(function() {
			if (this.getCurrentVariantId() === "3") {
				bExpectedVariantId = true;
			}
		}.bind(this.oVariantManagement));

		sinon.stub(this.oVariantManagement, "_determineVariantId").returns("3");
		sinon.stub(this.oVariantManagement, "_getVariantById").returns({ getExecuteOnSelection: function () { return true; }, getContent: function() { return {}; } });

		this.oVariantManagement._oStandardVariant = {};
		this.oVariantManagement._bIsInitialized = true;

		assert.ok(!bExpectedVariantId, "expected id");
		this.oVariantManagement.setCurrentVariantId("3");
		assert.ok(bExpectedVariantId, "expected id");
	});

	QUnit.test("check setCurrentVariantId not STANDARD", function (assert) {
		var mChanges = createVariantStubs();
		mChanges.defaultVariantId = "3";

		var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
		var oControl = Element.getElementById(oPersControlInfo.getControl());
		var oControlWrapper = this.oVariantManagement._getControlWrapper(oControl);
		this.oVariantManagement._oPersoControl = {};

		var fCallBack = function (oEvent) {
			this.oVariantManagement.setCurrentVariantId("2");
		}.bind(this);
		oControlWrapper.fInitCallback = fCallBack.bind(this);

		this.oVariantManagement._dataReceived(mChanges, true, true, false, oControlWrapper);

		var sKey = this.oVariantManagement.getCurrentVariantId();
		assert.equal(sKey, "2");

		oControl.destroy();
	});


	QUnit.test("check applyAutomatically for default page variant", function (assert) {
		var mChanges = createVariantStubs();
		mChanges.defaultVariantId = "3";

		var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
		var oControl = Element.getElementById(oPersControlInfo.getControl());

		this.oVariantManagement._oPersoControl = oControl;
		sinon.stub(this.oVariantManagement, "isPageVariant").returns(true);
		sinon.spy(this.oVariantManagement, "_applyControlVariant").withArgs(sinon.match.any, sinon.match.any, sinon.match.any, sinon.match.any, true);

		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(this.oVariantManagement._oPersoControl));
		assert.ok(this.oVariantManagement._applyControlVariant.calledOnce);


		oControl.destroy();
	});

	QUnit.test("check applyAutomatically for default control variant", function (assert) {
		var mChanges = createVariantStubs();
		mChanges.defaultVariantId = "3";

		var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
		var oControl = Element.getElementById(oPersControlInfo.getControl());

		this.oVariantManagement._oPersoControl = oControl;
		sinon.stub(this.oVariantManagement, "isPageVariant").returns(false);
		sinon.spy(this.oVariantManagement, "_applyVariant").withArgs(sinon.match.any, sinon.match.any, sinon.match.any, sinon.match.any, true);

		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(this.oVariantManagement._oPersoControl));
		assert.ok(this.oVariantManagement._applyVariant.calledOnce);

		oControl.destroy();
	});

	QUnit.test("check _setErrorValueState", function (assert) {

		assert.ok(!this.oVariantManagement.getInErrorState());

		this.oVariantManagement._setErrorValueState("TEXT");

		assert.ok(this.oVariantManagement.getInErrorState());

	});


	QUnit.test("check initialise with app variant", function (assert) {
		var mChanges = createVariantStubs();
		var oPersControlInfo = createControlInfo(this.oVariantManagement);
		var oControl = Element.getElementById(oPersControlInfo.getControl());

		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(oControl));

		assert.ok(this.oVariantManagement.getStandardVariantKey(), "2");

		oControl.destroy();
	});


	QUnit.test("check _createVariantEntries without standard variant flag", function (assert) {

		var mChanges = createVariantStubs();

		var oCurrentControlInfo = {
			control: {}
		};
		this.oVariantManagement._createVariantEntries(mChanges, oCurrentControlInfo);
		assert.ok(this.oVariantManagement._mVariants);
		assert.ok(Object.keys(this.oVariantManagement._mVariants).length, 4);

		assert.ok(!oCurrentControlInfo.standardvariantkey);
	});

	QUnit.test("check _createVariantEntries with standard variant flag in a non template app", function (assert) {

		var mChanges = createVariantStubs();

		var oCurrentControlInfo = {
			control: {}
		};
		this.oVariantManagement._createVariantEntries(mChanges, oCurrentControlInfo);
		assert.ok(this.oVariantManagement._mVariants);
		assert.ok(Object.keys(this.oVariantManagement._mVariants).length, 4);

		assert.ok(!oCurrentControlInfo.standardvariantkey);
	});

	QUnit.test("check _createVariantEntries with standard variant flag in a template app", function (assert) {

		var mChanges = createVariantStubs(true);

		this.oVariantManagement._oPersoControl = {};

		this.oVariantManagement._createVariantEntries(mChanges);
		assert.ok(this.oVariantManagement._mVariants);
		assert.ok(Object.keys(this.oVariantManagement._mVariants).length, 3);

		assert.equal(this.oVariantManagement._sAppStandardVariantKey, "2");
	});

	QUnit.test("check isPageVariant", function (assert) {

		assert.ok(!this.oVariantManagement.isPageVariant());

		sinon.stub(this.oVariantManagement, "_handleGetChanges");
		this.oVariantManagement.setPersistencyKey("DUMMY");

		assert.ok(this.oVariantManagement.isPageVariant());

	});

	QUnit.test("check initialise with page variant: later registry; early data retrieval", function (assert) {

		sinon.stub(this.oVariantManagement, "_handleGetChanges");
		this.oVariantManagement.setPersistencyKey("DUMMY");

		var nCount = 0;
		var mChanges = createVariantStubs();
		this.oVariantManagement._oControlPromise = fakeResolved(mChanges);

		var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
		var oControl1 = Element.getElementById(oPersControlInfo.getControl());
		oControl1.fCallback = function (oEvent) {
			++nCount;
		};

		this.oVariantManagement._dataReceived(mChanges, true, true, false, {
			control: oControl1,
			fInitCallback: oControl1.fCallback,
			loaded: {
				resolve: function () {
				}
			}
		});

		assert.equal(nCount, 1);

		oPersControlInfo = createControlInfo(this.oVariantManagement, "4712", true);
		var oControl2 = Element.getElementById(oPersControlInfo.getControl());
		oControl2.fCallback = function (oEvent) {
			++nCount;
		};

		this.oVariantManagement._dataReceived(mChanges, true, true, false, {
			control: oControl2,
			fInitCallback: oControl2.fCallback,
			loaded: {
				resolve: function () {
				}
			}
		});

		assert.equal(nCount, 2);
	});

	QUnit.test("check initialise with page variant: later registry; late data retrieval", function (assert) {
		var nCount = 0;
		var fCallBack1, oPromiseCallback1 = new Promise(function (fResolve) {
			fCallBack1 = fResolve;
		});
		var fCallBack2, oPromiseCallback2 = new Promise(function (fResolve) {
			fCallBack2 = fResolve;
		});

		var done = assert.async();

		stubLoadVariants(Promise.resolve({}));
		stubIsVariantPersonalizationEnabled(true);
		stubIsVariantSharingEnabled(true);
		stubIsVariantAdaptationEnabled(false);
		this.oVariantManagement._oMetadataPromise = Promise.resolve();

		this.oVariantManagement._loadFlex().then(function () {

			this.oVariantManagement.setPersistencyKey("DUMMY");

			var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
			var oControl1 = Element.getElementById(oPersControlInfo.getControl());
			oControl1.fCallback = function (oEvent) {
				++nCount;
				fCallBack1();
			};

			this.oVariantManagement.initialise(oControl1.fCallback, oControl1);
			assert.equal(nCount, 0);

			oPersControlInfo = createControlInfo(this.oVariantManagement, "4712");
			var oControl2 = Element.getElementById(oPersControlInfo.getControl());
			oControl2.fCallback = function (oEvent) {
				++nCount;
				fCallBack2();
			};

			this.oVariantManagement.initialise(oControl2.fCallback, oControl2);
			assert.equal(nCount, 0);

			Promise.all([
				oPromiseCallback1, oPromiseCallback2
			]).then(function () {
				assert.equal(nCount, 2);

				FlexWriteAPI.isVariantAdaptationEnabled.restore();

				done();
			});
		}.bind(this));

	});


	QUnit.test("check initialise with page variant: STANDARD", function (assert) {
		this.oVariantManagement.setPersistencyKey("DUMMY");

		var mChanges = createVariantStubs();
		this.oVariantManagement._createVariantEntries(mChanges);

		var oStdCtr1 = {
			a: "A",
			b: "B",
			c: "C"
		};

		var oStdCtr2 = {
			y: "Y",
			z: "Z"
		};

		var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
		var oControl1 = Element.getElementById(oPersControlInfo.getControl());
		oControl1.fCallback = function () {
		};
		sinon.stub(oControl1, "fetchVariant").returns(oStdCtr1);

		oPersControlInfo = createControlInfo(this.oVariantManagement, "4712", true);
		var oControl2 = Element.getElementById(oPersControlInfo.getControl());
		oControl2.fCallback = function () {
		};
		sinon.stub(oControl2, "fetchVariant").returns(oStdCtr2);

		this.oVariantManagement._dataReceived(mChanges, true, true, false, {
			control: oControl1,
			fInitCallback: oControl1.fCallback,
			loaded: {
				resolve: function () {
				}
			}
		});

		this.oVariantManagement._dataReceived(mChanges, true, true, false, {
			control: oControl2,
			fInitCallback: oControl2.fCallback,
			loaded: {
				resolve: function () {
				}
			}
		});

		var oExpectResult = {};
		oExpectResult[this.oVariantManagement._getControlPersKey(oControl1)] = oStdCtr1;
		oExpectResult[this.oVariantManagement._getControlPersKey(oControl2)] = oStdCtr2;

		var oResult = this.oVariantManagement.getStandardVariant();
		assert.strictEqual(JSON.stringify(oResult), JSON.stringify(oExpectResult));
		assert.strictEqual(this.oVariantManagement.getStandardVariant(oControl1), oStdCtr1);
		assert.strictEqual(this.oVariantManagement.getStandardVariant(oControl2), oStdCtr2);
	});

	QUnit.test("check initialise with page variant: APP STANDARD", function (assert) {

		var mChanges = createVariantStubs(true);
		mChanges.defaultVariantId = "2";
		this.oVariantManagement.setPersistencyKey("DUMMY");

		var oStdCtr1 = {
			a: "A",
			b: "B",
			c: "C"
		};

		var oStdCtr2 = {
			y: "Y",
			z: "Z"
		};

		var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
		var oControl1 = Element.getElementById(oPersControlInfo.getControl());

		oPersControlInfo = createControlInfo(this.oVariantManagement, "4712", true);
		var oControl2 = Element.getElementById(oPersControlInfo.getControl());

		var oAppStandard = {};
		oAppStandard[this.oVariantManagement._getControlPersKey(oControl1)] = oStdCtr1;
		oAppStandard[this.oVariantManagement._getControlPersKey(oControl2)] = oStdCtr2;

		sinon.stub(this.oVariantManagement, "_getVariantContent").returns(oAppStandard);

		oStdCtr1["executeOnSelection"] = undefined;
		oStdCtr2["executeOnSelection"] = undefined;

		this.oVariantManagement._oPersoControl = this.oVariantManagement;
		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(oControl1));
		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(oControl2));

		assert.equal(this.oVariantManagement._sAppStandardVariantKey, "2");
		assert.equal(this.oVariantManagement.getDefaultVariantKey(), "2");

		var oResult = this.oVariantManagement.getStandardVariant();
		assert.deepEqual(JSON.stringify(oResult), JSON.stringify(oAppStandard));
		assert.deepEqual(this.oVariantManagement.getStandardVariant(oControl1), oStdCtr1);
		assert.deepEqual(this.oVariantManagement.getStandardVariant(oControl2), oStdCtr2);

		oControl1.destroy();
		oControl2.destroy();
	});

	QUnit.test("check initialise with page variant: apply", function (assert) {
		const done = assert.async();
		const mChanges = createVariantStubs();
		this.oVariantManagement.setPersistencyKey("DUMMY");

		const oStdCtr1 = {
			a: "A",
			b: "B",
			c: "C"
		};

		const oStdCtr2 = {
			y: "Y",
			z: "Z"
		};

		let oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
		const oControl1 = Element.getElementById(oPersControlInfo.getControl());
		sinon.spy(oControl1, "applyVariant");

		oPersControlInfo = createControlInfo(this.oVariantManagement, "4712", true);
		const oControl2 = Element.getElementById(oPersControlInfo.getControl());
		sinon.spy(oControl2, "applyVariant");

		const oControlWrapper1 = this.oVariantManagement._getControlWrapper(oControl1),
			oControlWrapper2 = this.oVariantManagement._getControlWrapper(oControl2);

		this.oVariantManagement._dataReceived(mChanges, true, true, false, oControlWrapper1);
		this.oVariantManagement._dataReceived(mChanges, true, true, false, oControlWrapper2);

		const oApplyData = {};
		oApplyData[this.oVariantManagement._getControlPersKey(oControl1)] = oStdCtr1;
		oApplyData[this.oVariantManagement._getControlPersKey(oControl2)] = oStdCtr2;

		Promise.all(this.oVariantManagement._applyVariants(oApplyData)).then(() => {
			assert.ok(oControl1.applyVariant.calledOnce);
			assert.ok(oControl2.applyVariant.calledOnce);

			assert.strictEqual(oControl1._getApplyedData(), oStdCtr1);
			assert.strictEqual(oControl2._getApplyedData(), oStdCtr2);

			oControl1.destroy();
			oControl2.destroy();
			done();
		});
	});

	QUnit.test("check initialise with page variant: fetch", function (assert) {

		var mChanges = createVariantStubs();
		this.oVariantManagement.setPersistencyKey("DUMMY");

		var oStdCtr1 = {
			a: "A",
			b: "B",
			c: "C"
		};

		var oStdCtr2 = {
			y: "Y",
			z: "Z"
		};

		var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
		var oControl1 = Element.getElementById(oPersControlInfo.getControl());
		sinon.stub(oControl1, "fetchVariant").returns(oStdCtr1);

		oPersControlInfo = createControlInfo(this.oVariantManagement, "4712", true);
		var oControl2 = Element.getElementById(oPersControlInfo.getControl());
		sinon.stub(oControl2, "fetchVariant").returns(oStdCtr2);

		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(oControl1));
		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(oControl2));

		var oResult = this.oVariantManagement._fetchContent();

		var oExpectResult = {};
		oExpectResult[this.oVariantManagement._getControlPersKey(oControl1)] = oStdCtr1;
		oExpectResult[this.oVariantManagement._getControlPersKey(oControl2)] = oStdCtr2;

		assert.strictEqual(JSON.stringify(oResult), JSON.stringify(oExpectResult));

		assert.ok(oControl1.fetchVariant.calledTwice); // 2x because of Standard
		assert.ok(oControl2.fetchVariant.calledTwice);

		oControl1.destroy();
	});

	QUnit.test("check initialise with page variant: STANDARD - one perso; backward compatible", function (assert) {

		var mChanges = createVariantStubs();
		this.oVariantManagement.setPersistencyKey("DUMMY");

		var oStdCtr1 = {
			a: "A",
			b: "B",
			c: "C"
		};

		var oPersControlInfo = createControlInfo(this.oVariantManagement, "DUMMY", true);
		var oControl1 = Element.getElementById(oPersControlInfo.getControl());
		oControl1.fCallback = function () {
		};
		sinon.stub(oControl1, "fetchVariant").returns(oStdCtr1);

		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(oControl1));

		var oExpectResult = { DUMMY: oStdCtr1 };

		var oResult = this.oVariantManagement.getStandardVariant();
		assert.deepEqual(oResult, oExpectResult);
		assert.deepEqual(this.oVariantManagement.getStandardVariant(oControl1), oStdCtr1);

		oControl1.destroy();
	});

	QUnit.test("check initialise with page variant: APP STANDARD - one perso; backward compatible", function (assert) {

		var mChanges = createVariantStubs(true);
		mChanges.defaultVariantId = "2";
		this.oVariantManagement.setPersistencyKey("DUMMY");

		var oStdCtr1 = {
			a: "A",
			b: "B",
			c: "C"
		};

		var oPersControlInfo = createControlInfo(this.oVariantManagement, "DUMMY", true);
		var oControl1 = Element.getElementById(oPersControlInfo.getControl());

		var oAppStandard = { DUMMY: oStdCtr1 };
		sinon.stub(this.oVariantManagement, "_getVariantContent").returns(oAppStandard);

		// In "_dataReceived" a copy of the Variant is created. "executeOnSelection" is added later...
		oStdCtr1["executeOnSelection"] = undefined;

		this.oVariantManagement._oPersoControl = oControl1;
		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(oControl1));

		assert.equal(this.oVariantManagement._sAppStandardVariantKey, "2");
		assert.equal(this.oVariantManagement.getDefaultVariantKey(), "2");

		var oResult = this.oVariantManagement.getStandardVariant();
		assert.deepEqual(oResult, oAppStandard);
		assert.deepEqual(this.oVariantManagement.getStandardVariant(oControl1), oStdCtr1);

		oControl1.destroy();
	});

	QUnit.test("check initialise with page variant: apply  - one perso; backward compatible", function (assert) {
		const done = assert.async();
		const mChanges = createVariantStubs();
		this.oVariantManagement.setPersistencyKey("DUMMY");

		const oStdCtr1 = {
			a: "A",
			b: "B",
			c: "C"
		};

		const oPersControlInfo = createControlInfo(this.oVariantManagement, "DUMMY", true);
		const oControl1 = Element.getElementById(oPersControlInfo.getControl());
		sinon.spy(oControl1, "applyVariant");

		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(oControl1));

		const oApplyData = { DUMMY: oStdCtr1 };

		Promise.all(this.oVariantManagement._applyVariants(oApplyData)).then(() => {
			assert.ok(oControl1.applyVariant.calledOnce);

			assert.deepEqual(oControl1._getApplyedData(), oStdCtr1);

			oControl1.destroy();
			done();
		});
	});

	QUnit.test("check initialise with page variant: fetch  - one perso; backward compatible", function (assert) {

		var mChanges = createVariantStubs();
		this.oVariantManagement.setPersistencyKey("DUMMY");

		var oStdCtr1 = {
			a: "A",
			b: "B",
			c: "C"
		};

		var oPersControlInfo = createControlInfo(this.oVariantManagement, "DUMMY", true);
		var oControl1 = Element.getElementById(oPersControlInfo.getControl());
		sinon.stub(oControl1, "fetchVariant").returns(oStdCtr1);

		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(oControl1));

		var oResult = this.oVariantManagement._fetchContent();

		var oExpectResult = { DUMMY: oStdCtr1 };

		assert.strictEqual(JSON.stringify(oResult), JSON.stringify(oExpectResult));

		assert.ok(oControl1.fetchVariant.calledTwice);

		oControl1.destroy();
	});

	QUnit.test("check variantsInitialized ", function (assert) {

		var mChanges = createVariantStubs();
		var oPersControlInfo = createControlInfo(this.oVariantManagement);
		var oControl = Element.getElementById(oPersControlInfo.getControl());
		oControl.variantsInitialized = sinon.stub();

		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(oControl));

		assert.ok(oControl.variantsInitialized.calledOnce);

		oControl.destroy();
	});

	QUnit.test("check _applyVariants", async function (assert) {
		const done = assert.async();
		const mChanges = createVariantStubs();
		sinon.stub(this.oVariantManagement, "setPersControler");
		this.oVariantManagement.setPersistencyKey("DUMMY");

		sinon.stub(this.oVariantManagement, "_applyControlVariant");

		let oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
		const oControl1 = Element.getElementById(oPersControlInfo.getControl());
		oControl1.fCallback = function (oEvent) { };

		oPersControlInfo = createControlInfo(this.oVariantManagement, "4712", true);
		const oControl2 = Element.getElementById(oPersControlInfo.getControl());
		oControl2.fCallback = function (oEvent) { };

		const aPromises = this.oVariantManagement._applyVariants({}, null);

		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(oControl2));
		await Promise.any(aPromises);
		assert.ok(this.oVariantManagement._applyControlVariant.calledOnce);
		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(oControl1));
		await Promise.all(aPromises);
		assert.ok(this.oVariantManagement._applyControlVariant.calledTwice);
		this.oVariantManagement._applyControlVariant.reset();

		await Promise.all(this.oVariantManagement._applyVariants({}, null));
		assert.ok(this.oVariantManagement._applyControlVariant.calledTwice);

		oControl1.destroy();
		oControl2.destroy();
		done();
	});

	QUnit.test("check _selectVariant", function (assert) {
		sinon.spy(this.oVariantManagement, "fireSelect");
		sinon.stub(this.oVariantManagement, "_triggerSelectVariant");

		this.oVariantManagement._oPersoControl = {};
		this.oVariantManagement._selectVariant("4711");

		assert.ok(this.oVariantManagement.fireSelect.calledOnce);
		assert.ok(this.oVariantManagement._triggerSelectVariant.calledOnce);

	});

	QUnit.test("XCheck if all properties defined in the class of the control are declared in designtime metadata (there are also inherited properties)", function (assert) {
		var mProperties = this.oVariantManagement.getMetadata()._mProperties;
		assert.ok(mProperties);

		var done = assert.async();

		this.oVariantManagement.getMetadata().loadDesignTime().then(function (oDesignTimeMetadata) {
			var aProperties = Object.keys(mProperties);

			aProperties.forEach(function (element) {
				assert.ok(oDesignTimeMetadata.properties[element]);
			});
			done();
		});

	});

	QUnit.test("check afterVariantLoad event no event", function (assert) {

		sinon.stub(this.oVariantManagement, "_handleGetChanges");
		this.oVariantManagement.setPersistencyKey("DUMMY");

		var mChanges = createVariantStubs();

		var oPersControlInfo = createControlInfo(this.oVariantManagement, "DUMMY", true);
		var oControl1 = Element.getElementById(oPersControlInfo.getControl());

		var sContext = null;
		oControl1.attachAfterVariantLoad(function (e) {
			sContext = e.getParameters().context;
		});

		sinon.stub(this.oVariantManagement, "_getVariantContent").returns({
			DUMMY: {}
		});

		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(oControl1));

		assert.equal(sContext, "INIT");

	});

	QUnit.test("check afterVariantLoad event with default variant", function (assert) {

		sinon.stub(this.oVariantManagement, "_handleGetChanges");
		this.oVariantManagement.setPersistencyKey("DUMMY");

		var mChanges = createVariantStubs();

		var oPersControlInfo = createControlInfo(this.oVariantManagement, "DUMMY", true);
		var oControl1 = Element.getElementById(oPersControlInfo.getControl());

		var sContext = null;
		oControl1.attachAfterVariantLoad(function (e) {
			sContext = e.getParameters().context;
		});

		sinon.stub(this.oVariantManagement, "getSelectionKey").returns("default");
		sinon.stub(this.oVariantManagement, "_getVariantContent").returns({
			DUMMY: {}
		});

		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(oControl1));

		assert.equal(sContext, "INIT");

		oControl1.destroy();
	});

	QUnit.test("check afterVariantLoad event with app variant", function (assert) {

		var mChanges = createVariantStubs(true);
		this.oVariantManagement.setPersistencyKey("DUMMY");

		var oStdCtr1 = {
			a: "A",
			b: "B",
			c: "C"
		};

		var oPersControlInfo = createControlInfo(this.oVariantManagement, "DUMMY", true);
		var oControl1 = Element.getElementById(oPersControlInfo.getControl());

		var sContext = null;
		oControl1.attachAfterVariantLoad(function (e) {
			sContext = e.getParameters().context;
		});
		assert.equal(this.oVariantManagement._getDefaultVariantKey(), "");
		sinon.stub(this.oVariantManagement, "_getVariantContent").returns({ DUMMY: {} });

		// In "_dataReceived" a copy of the Variant is created. "executeOnSelection" is added later...
		oStdCtr1["executeOnSelection"] = undefined;

		this.oVariantManagement._oPersoControl = this.oVariantManagement;
		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(oControl1));

		assert.equal(sContext, "INIT");

		oControl1.destroy();
	});

	QUnit.test("check removeAllPersonalizableControls", function (assert) {

		var oControl = new Control();

		sinon.stub(this.oVariantManagement, "_handleGetChanges");

		assert.equal(this.oVariantManagement.getPersonalizableControls().length, 0);
		assert.equal(this.oVariantManagement._aPersonalizableControls.length, 0);

		this.oVariantManagement.addPersonalizableControl(new PersonalizableInfo({
			type: "chart",
			dataSource: "TODO",
			keyName: "persistencyKey",
			control: oControl
		}));

		assert.equal(this.oVariantManagement.getPersonalizableControls().length, 1);
		assert.equal(this.oVariantManagement._aPersonalizableControls.length, 1);

		this.oVariantManagement.removeAllPersonalizableControls();

		assert.equal(this.oVariantManagement.getPersonalizableControls().length, 0);
		assert.equal(this.oVariantManagement._aPersonalizableControls.length, 0);

		this.oVariantManagement.addPersonalizableControl(new PersonalizableInfo({
			type: "chart",
			dataSource: "TODO",
			keyName: "persistencyKey",
			control: oControl
		}));

		assert.equal(this.oVariantManagement.getPersonalizableControls().length, 1);
		assert.equal(this.oVariantManagement._aPersonalizableControls.length, 1);

		this.oVariantManagement.removeAllPersonalizableControls();

		assert.equal(this.oVariantManagement.getPersonalizableControls().length, 0);
		assert.equal(this.oVariantManagement._aPersonalizableControls.length, 0);

	});

	QUnit.test("check search on standard variant", function (assert) {

		var oControlWrapper = {
			loaded: {
				resolve: function () {
				}
			},
			control: {
				search: function () {
				}
			}
		};

		sinon.spy(oControlWrapper.control, "search");

		sinon.stub(this.oVariantManagement, "getCurrentVariantKey").returns(this.oVariantManagement.STANDARDVARIANTKEY);

		sinon.stub(this.oVariantManagement, "_setStandardVariant");

		this.oVariantManagement._initialize({}, oControlWrapper);
		assert.ok(!oControlWrapper.control.search.called);

		sinon.stub(this.oVariantManagement, "getExecuteOnSelectForStandardVariant").returns(true);
		this.oVariantManagement._initialize({}, oControlWrapper);
		assert.ok(oControlWrapper.control.search.called);

		oControlWrapper.control.search.restore();
		this.oVariantManagement.getCurrentVariantKey.restore();
		sinon.stub(this.oVariantManagement, "getCurrentVariantKey").returns("");

		sinon.spy(oControlWrapper.control, "search");
		this.oVariantManagement._initialize({}, oControlWrapper);
		assert.ok(!oControlWrapper.control.search.called);

		oControlWrapper.control.search.restore();
		this.oVariantManagement.getCurrentVariantKey.restore();
		sinon.stub(this.oVariantManagement, "getStandardVariantKey").returns("VENDOR_VAR");
		sinon.stub(this.oVariantManagement, "getCurrentVariantKey").returns("VENDOR_VAR");
		this.oVariantManagement._oAppStdContent = {};

		sinon.spy(oControlWrapper.control, "search");
		this.oVariantManagement._initialize({}, oControlWrapper);
		assert.ok(oControlWrapper.control.search.called);

	});

	QUnit.test("check removePersonalizableControl", function (assert) {

		var oControl1 = new Control();
		var oControl2 = new Control();

		sinon.stub(this.oVariantManagement, "_handleGetChanges");

		assert.equal(this.oVariantManagement.getPersonalizableControls().length, 0);
		assert.equal(this.oVariantManagement._aPersonalizableControls.length, 0);

		var oPers1 = new PersonalizableInfo({
			type: "chart",
			dataSource: "TODO",
			keyName: "persistencyKey",
			control: oControl1
		});

		var oPers2 = new PersonalizableInfo({
			type: "chart",
			dataSource: "TODO",
			keyName: "persistencyKey",
			control: oControl2
		});

		this.oVariantManagement.addPersonalizableControl(oPers1);
		this.oVariantManagement.addPersonalizableControl(oPers2);

		assert.equal(this.oVariantManagement.getPersonalizableControls().length, 2);
		assert.equal(this.oVariantManagement._aPersonalizableControls.length, 2);

		this.oVariantManagement.removePersonalizableControl(oPers1);

		assert.equal(this.oVariantManagement.getPersonalizableControls().length, 1);
		assert.equal(this.oVariantManagement._aPersonalizableControls.length, 1);

		this.oVariantManagement.removePersonalizableControl(oPers2);
		assert.equal(this.oVariantManagement.getPersonalizableControls().length, 0);
		assert.equal(this.oVariantManagement._aPersonalizableControls.length, 0);

	});

	QUnit.test("check removePersonalizableControlById", function (assert) {

		var oControl1 = new Control();
		var oControl2 = new Control();

		sinon.stub(this.oVariantManagement, "_handleGetChanges");

		assert.equal(this.oVariantManagement.getPersonalizableControls().length, 0);
		assert.equal(this.oVariantManagement._aPersonalizableControls.length, 0);

		var oPers1 = new PersonalizableInfo({
			type: "chart",
			dataSource: "TODO",
			keyName: "persistencyKey",
			control: oControl1
		});

		var oPers2 = new PersonalizableInfo({
			type: "chart",
			dataSource: "TODO",
			keyName: "persistencyKey",
			control: oControl2
		});

		this.oVariantManagement.addPersonalizableControl(oPers1);
		this.oVariantManagement.addPersonalizableControl(oPers2);

		assert.equal(this.oVariantManagement.getPersonalizableControls().length, 2);
		assert.equal(this.oVariantManagement._aPersonalizableControls.length, 2);

		this.oVariantManagement.removePersonalizableControlById(oControl1);

		assert.equal(this.oVariantManagement.getPersonalizableControls().length, 1);
		assert.equal(this.oVariantManagement._aPersonalizableControls.length, 1);

		this.oVariantManagement.removePersonalizableControlById(oControl2);
		assert.equal(this.oVariantManagement.getPersonalizableControls().length, 0);
		assert.equal(this.oVariantManagement._aPersonalizableControls.length, 0);

	});

	QUnit.test("check initialize with error main promise", function (assert) {
		var done = assert.async();
		sinon.stub(this.oVariantManagement, "_setErrorValueState");

		return this.oVariantManagement._loadFlex().then(function () {
			var oPersControlInfo = createControlInfo(this.oVariantManagement, "", true);
			var oControl = Element.getElementById(oPersControlInfo.getControl());
			oControl.variantsInitialized = sinon.stub();
			oControl.fFunc = sinon.stub();

			this.oVariantManagement.oModel._oPersistencyPromise = Promise.reject();

			const oInitialisePromise = this.oVariantManagement.initialise(oControl.fFunc, oControl);

			oInitialisePromise.then(() => {
				assert.ok(oControl.fFunc.calledOnce);
				assert.ok(oControl.variantsInitialized.calledOnce);

				oControl.destroy();
				done();
			});
		}.bind(this));
	});

	QUnit.test("check initialize with error", function (assert) {
		var done = assert.async();

		sinon.stub(this.oVariantManagement, "_setErrorValueState");

		var oPersControlInfo = createControlInfo(this.oVariantManagement);
		var oControl = Element.getElementById(oPersControlInfo.getControl());
		oControl.variantsInitialized = sinon.stub();
		oControl.fFunc = sinon.stub();

		this.oVariantManagement._oMetadataPromise = Promise.reject();

		const oInitialisePromise = this.oVariantManagement.initialise(oControl.fFunc, oControl);

		oInitialisePromise.then(() => {
			assert.ok(oControl.fFunc.calledOnce);
			assert.ok(oControl.variantsInitialized.calledOnce);
			done();
		});

	});

	/**
	* @deprecated As of version 1.127.0, the concept has been discarded.
	*/
	QUnit.test("check registerSelectionVariantHandler/unregisterSelectionVariantHandler", function (assert) {

		var oHandler1 = {
			callback: function () {
			},
			handler: {}
		};

		var oHandler2 = {
			callback: function () {
			},
			handler: {}
		};

		oHandler1.handler = oHandler1;
		oHandler2.handler = oHandler2;

		assert.equal(Object.keys(this.oVariantManagement._oSelectionVariantHandler).length, 0);

		this.oVariantManagement.registerSelectionVariantHandler(oHandler1, "#");
		this.oVariantManagement.registerSelectionVariantHandler(oHandler2, "@");
		assert.equal(Object.keys(this.oVariantManagement._oSelectionVariantHandler).length, 2);

		this.oVariantManagement.unregisterSelectionVariantHandler("@");
		assert.equal(Object.keys(this.oVariantManagement._oSelectionVariantHandler).length, 1);
		assert.equal(Object.keys(this.oVariantManagement._oSelectionVariantHandler), "#");

		this.oVariantManagement.registerSelectionVariantHandler(oHandler2, "@");
		assert.equal(Object.keys(this.oVariantManagement._oSelectionVariantHandler).length, 2);
		assert.equal(this.oVariantManagement._oSelectionVariantHandler["#"], oHandler1);
		assert.equal(this.oVariantManagement._oSelectionVariantHandler["@"], oHandler2);

		this.oVariantManagement.unregisterSelectionVariantHandler(oHandler1);
		assert.equal(Object.keys(this.oVariantManagement._oSelectionVariantHandler).length, 1);
		assert.equal(Object.keys(this.oVariantManagement._oSelectionVariantHandler), "@");

		this.oVariantManagement.unregisterSelectionVariantHandler(oHandler2);
		assert.equal(Object.keys(this.oVariantManagement._oSelectionVariantHandler).length, 0);

	});

	/**
	* @deprecated As of version 1.127.0, the concept has been discarded.
	*/
	QUnit.test("check fireSelect with SelectionVariantHandler", function (assert) {

		var oHandler = {
			callback: function (key, context) {
				return {};
			},
			handler: {}
		};
		oHandler.handler = oHandler;
		this.oVariantManagement.registerSelectionVariantHandler(oHandler, "#");
		sinon.spy(oHandler, "callback");

		this.oVariantManagement._oPersoControl = sinon.stub();
		sinon.stub(this.oVariantManagement, "_applyVariant");

		sinon.spy(this.oVariantManagement, "_getGeneralSelectVariantContent");
		sinon.spy(this.oVariantManagement, "_getSpecialSelectVariantContent");

		this.oVariantManagement.fireSelect({
			key: "HUGO"
		});
		assert.ok(this.oVariantManagement._getGeneralSelectVariantContent.called);
		assert.ok(!this.oVariantManagement._getSpecialSelectVariantContent.called);
		assert.ok(!oHandler.callback.called);

		this.oVariantManagement._getGeneralSelectVariantContent.restore();
		this.oVariantManagement._getSpecialSelectVariantContent.restore();

		sinon.spy(this.oVariantManagement, "_getGeneralSelectVariantContent");
		sinon.spy(this.oVariantManagement, "_getSpecialSelectVariantContent");

		this.oVariantManagement.fireSelect({
			key: "#HUGO"
		});
		assert.ok(!this.oVariantManagement._getGeneralSelectVariantContent.called);
		assert.ok(this.oVariantManagement._getSpecialSelectVariantContent.called);
		assert.ok(oHandler.callback.called);

	});

	QUnit.test("check fireSave with tile", function (assert) {
		var done = assert.async();
		createControlInfo(this.oVariantManagement);


		sinon.stub(this.oVariantManagement, "_setDefaultVariantKey");
		sinon.stub(this.oVariantManagement, "_createChangeHeader").returns({ type: "test" });
		sinon.stub(this.oVariantManagement, "_createVariantItem");
		sinon.stub(this.oVariantManagement, "_flUpdateVariant");

		sinon.stub(this.oVariantManagement.oModel, "_flWriteAddVariant").callsFake(function (mProperties) {
			return { getVariantId: function () { return "id1"; } };
		});

		sinon.stub(this.oVariantManagement, "_save");

		var nCount = 0;
		this.oVariantManagement.attachSave(function (oEvent) {

			nCount++;
			var bWithTile;
			if (oEvent && (oEvent.mParameters.tile !== undefined)) {
				bWithTile = oEvent.mParameters.tile;
			}
			if (nCount === 1) {
				assert.ok(bWithTile === undefined);
			} else if (nCount === 2) {
				assert.ok(bWithTile);
			} else {
				assert.ok(!bWithTile);
				done();
			}
		});

		this.oVariantManagement.fireSave({ name: "Test1", "public": true });
		this.oVariantManagement.fireSave({
			tile: true,
			name: "Test1",
			"public": true
		});
		this.oVariantManagement.fireSave({
			tile: false,
			name: "Test1",
			"public": true
		});
	});


	QUnit.test("check initialize ok", function (assert) {
		var mChanges = createVariantStubs();

		this.oVariantManagement.setPersistencyKey("DUMMY");

		stubIsVariantSharingEnabled(true);
		stubIsVariantPersonalizationEnabled(true);
		stubIsVariantAdaptationEnabled(false);

		stubLoadVariants(Promise.resolve(mChanges));

		sinon.stub(this.oVariantManagement, "_dataReceived");
		this.oVariantManagement._oMetadataPromise = Promise.resolve();

		return this.oVariantManagement._loadFlex().then(function () {

			var oPersControlInfo = createControlInfo(this.oVariantManagement);
			var oControl = Element.getElementById(oPersControlInfo.getControl());
			oControl.fFunc = sinon.stub();


			this.oVariantManagement.initialise(oControl.fFunc, oControl);

			return this.oVariantManagement._oPersistencyPromise.then(function () {
				return Promise.all([
					this.oVariantManagement._oMetadataPromise, this.oVariantManagement._oControlPromise
				]).then(function (aArray) {
					assert.ok(this.oVariantManagement._dataReceived.called);
				}.bind(this));
			}.bind(this));

		}.bind(this));
	});

	QUnit.test("check initialize with failed metadata load", function (assert) {
		sinon.stub(this.oVariantManagement, "_setErrorValueState");
		return this.oVariantManagement._loadFlex().then(function () {
			stubIsVariantSharingEnabled(true);
			this.oVariantManagement.setPersistencyKey("DUMMY");

			var oPersControlInfo = createControlInfo(this.oVariantManagement);
			var oControl = Element.getElementById(oPersControlInfo.getControl());
			oControl.fFunc = sinon.stub();

			sinon.stub(this.oVariantManagement, "_dataReceived");

			this.oVariantManagement._oMetadataPromise = Promise.reject();

			this.oVariantManagement.initialise(oControl.fFunc, oControl);

			return Promise.all([
				this.oVariantManagement._oMetadataPromise, this.oVariantManagement._oControlPromise
			]).then(function (aArray) {
			}, function (err) {
				assert.ok(!this.oVariantManagement._dataReceived.called);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("check initialize with failed lrep load", function (assert) {
		this.oVariantManagement._oMetadataPromise = Promise.resolve();
		sinon.stub(this.oVariantManagement, "_setErrorValueState");
		stubLoadVariants(Promise.reject());
		stubIsVariantSharingEnabled(true);
		stubIsVariantPersonalizationEnabled(true);
		this.oVariantManagement.setPersistencyKey("DUMMY");

		var oPersControlInfo = createControlInfo(this.oVariantManagement);
		var oControl = Element.getElementById(oPersControlInfo.getControl());
		oControl.fFunc = sinon.stub();

		sinon.stub(this.oVariantManagement, "_dataReceived");

		return this.oVariantManagement._loadFlex().then(function () {

			this.oVariantManagement.initialise(oControl.fFunc, oControl);

			return Promise.all([
				this.oVariantManagement._oMetadataPromise, this.oVariantManagement._oControlPromise
			]).then(function (aArray) {
			}, function (err) {
				assert.ok(!this.oVariantManagement._dataReceived.called);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("check setEntitySet and model", async function (assert) {

		sinon.stub(this.oVariantManagement, "_onMetadataInitialised");
		assert.ok(!this.oVariantManagement._oMetadataPromise);

		this.oVariantManagement.setEntitySet("ENTITY_SET");
		assert.ok(this.oVariantManagement._oMetadataPromise);

		var oModel = {
			getMetadata: function () { return this.oVariantManagement; }
		};

		this.oVariantManagement.setModel(oModel);
		await nextUIUpdate();

		assert.ok(this.oVariantManagement._onMetadataInitialised.called);
	});

	QUnit.test("check applyVariant/setUiStateAsVariant", function (assert) {
		const done = assert.async();
		var oAdapter = {
			getUiState: function () {
				return {};
			}
		};

		sinon.stub(this.oVariantManagement, "_getGeneralSelectVariantContent").returns({});
		sinon.stub(this.oVariantManagement, "_getAdapter").returns(oAdapter);
		sinon.stub(this.oVariantManagement, "setPersControler");

		const oPersControlInfo = createControlInfo(this.oVariantManagement, "Key");
		const oControl = Element.getElementById(oPersControlInfo.getControl());
		this.oVariantManagement._oPersoControl = oControl;

		const oControlWrapper = this.oVariantManagement._getControlWrapper(oControl);
		assert.ok(oControlWrapper);
		oControlWrapper.loaded.resolve();

		oControl.applyVariant = sinon.stub();
		oControl.setUiStateAsVariant = sinon.stub();

		this.oVariantManagement.fireSelect({
			key: "One"
		});
		assert.ok(oControl.applyVariant.called);
		assert.ok(!oControl.setUiStateAsVariant.called);

		oControl.applyVariant.reset();
		oControl.setUiStateAsVariant.reset();

		this.oVariantManagement.fireSelect({
			key: "#One"
		});

		oControlWrapper.loaded.then(() => {
			assert.ok(!oControl.applyVariant.called);
			assert.ok(oControl.setUiStateAsVariant.called);
			done();
		});
	});


	QUnit.test("check mixed sync/async fetchVariant for new variant", function (assert) {

		var done = assert.async();
		var newVar = "newVar";
		var oContent1 = { test: "Control1" };
		var oContent2 = { test: "Control2" };

		var mChanges = createVariantStubs();
		mChanges["newId"] = createVariantStub("newId", "NEW", { key1: oContent1, key2: oContent2 });
		stubLoadVariants(Promise.resolve(mChanges));


		sinon.spy(this.oVariantManagement, "_newVariant");
		sinon.spy(this.oVariantManagement, "_updateVariant");

		this.oVariantManagement._oMetadataPromise = Promise.resolve();
		stubIsVariantSharingEnabled(true);
		stubIsVariantPersonalizationEnabled(true);
		stubIsVariantAdaptationEnabled(true);

		sinon.stub(this.oVariantManagement.oModel, "_flWriteUpdateVariant").callsFake(function (mProperties) {
			var oVariant = this._getVariantById(mProperties.id);
			if (mProperties.hasOwnProperty("executeOnSelection")) {
				oVariant.setExecuteOnSelection(mProperties.executeOnSelection);
			}
			return oVariant;
		}.bind(this.oVariantManagement));
		sinon.stub(this.oVariantManagement.oModel, "_flWriteAddVariant").callsFake(function (mProperties) {
			var oVariant = createVariantStub(newVar);

			if (mProperties.changeSpecificData.hasOwnProperty("content")) {
				oVariant.setContent(mProperties.changeSpecificData.content);
			}
			if (mProperties.changeSpecificData.hasOwnProperty("texts") && mProperties.changeSpecificData.texts.hasOwnProperty("variantName")) {
				oVariant.setName(mProperties.changeSpecificData.texts.variantName);
			}
			return oVariant;
		});

		var fResolve;
		var oAfterSavePromise = new Promise(function (resolve, reject) {
			fResolve = resolve;
		});

		this.oVariantManagement.attachAfterSave(function (oEvent) {
			fResolve();
		});

		var oVariantInfo = {
			key: newVar,
			name: "newVariant"
		};

		this.oVariantManagement.setPersistencyKey("DUMMY");

		var oPersControlInfo = createControlInfo(this.oVariantManagement, "key1", true);
		var oControl1 = Element.getElementById(oPersControlInfo.getControl());
		oControl1.fCallback = sinon.stub();
		oControl1.fetchVariant = function () {
			return oContent1;
		};

		this.oVariantManagement.initialise(oControl1.fCallback, oControl1);

		oPersControlInfo = createControlInfo(this.oVariantManagement, "key2", true);
		var oControl2 = Element.getElementById(oPersControlInfo.getControl());
		oControl2.fCallback = oControl1.fCallback = sinon.stub();
		oControl2.fetchVariant = function () {

			var fTest, oPromise = new Promise(function (resolve, reject) {
				fTest = resolve;
			});
			setTimeout(function () {
				fTest(oContent2);
			}, 1000);

			return oPromise;
		};

		this.oVariantManagement.initialise(oControl2.fCallback, oControl2);

		this.oVariantManagement.oModel._oFlLibrary.then(function () {
			stubSave(Promise.resolve());

			assert.ok(!this.oVariantManagement._newVariant.called);
			assert.ok(!this.oVariantManagement._updateVariant.called);

			this.oVariantManagement.fireSave(oVariantInfo);

			oAfterSavePromise.then(function () {

				var oVariantItem = null;

				this.oVariantManagement.getVariantItems().some(function (oItem) {
					if (oItem.getKey() === oVariantInfo.key) {
						oVariantItem = oItem;
					}

					return oVariantItem !== null;
				});

				assert.ok(oVariantItem);

				var oVariant = this.oVariantManagement._getVariantById(oVariantItem.getKey());
				assert.ok(oVariant);

				var oContent = oVariant.getContent();
				assert.ok(oContent);

				assert.deepEqual(oContent.key1, oContent1);
				assert.deepEqual(oContent.key2, oContent2);

				assert.ok(this.oVariantManagement._newVariant.calledOnce);
				assert.ok(!this.oVariantManagement._updateVariant.called);

				done();
			}.bind(this));
		}.bind(this));

	});


	QUnit.test("check mixed sync/async fetchVariant for update variant", function (assert) {

		var done = assert.async();

		var oContent1 = { test: "Control1" };
		var oContent2 = { test: "Control2" };
		var mChanges = createVariantStubs();
		mChanges["newId"] = createVariantStub("newId", "NEW", { key1: oContent1, key2: oContent2 });
		stubLoadVariants(Promise.resolve(mChanges));

		this.oVariantManagement.setPersistencyKey("DUMMY");

		sinon.spy(this.oVariantManagement, "_newVariant");
		sinon.spy(this.oVariantManagement, "_updateVariant");
		sinon.stub(this.oVariantManagement.oModel, "_flWriteUpdateVariant").callsFake(function (mProperties) {
			var oVariant = this._getVariantById(mProperties.id);

			if (mProperties.hasOwnProperty("content")) {
				oVariant.setContent(mProperties.content);
			}
			if (mProperties.hasOwnProperty("name")) {
				oVariant.setText(mProperties.name);
			}
			if (mProperties.hasOwnProperty("executeOnSelection")) {
				oVariant.setExecuteOnSelection(mProperties.executeOnSelection);
			}
			return oVariant;
		}.bind(this.oVariantManagement));
		sinon.stub(this.oVariantManagement.oModel, "_flWriteAddVariant").callsFake(function (mProperties) {
			var oVariant = createVariantStub("newVar");

			if (mProperties.changeSpecificData.hasOwnProperty("content")) {
				oVariant.setContent(mProperties.changeSpecificData.content);
			}
			if (mProperties.changeSpecificData.hasOwnProperty("name")) {
				oVariant.setText(mProperties.changeSpecificData.name);
			}
			if (mProperties.changeSpecificData.hasOwnProperty("packageName")) {
				oVariant.setPackage(mProperties.changeSpecificData.packageName);
			}

			return oVariant;
		});

		this.oVariantManagement._oMetadataPromise = Promise.resolve();

		stubIsVariantSharingEnabled(true);
		stubIsVariantPersonalizationEnabled(true);
		stubIsVariantAdaptationEnabled(true);

		var fResolve;
		var oAfterSavePromise = new Promise(function (resolve, reject) {
			fResolve = resolve;
		});

		this.oVariantManagement.attachAfterSave(function (oEvent) {
			fResolve();
		});

		var oVariantInfo = {
			key: "2",
			text: "TWO",
			overwrite: true
		};


		var oPersControlInfo = createControlInfo(this.oVariantManagement, "key1", true);
		var oControl1 = Element.getElementById(oPersControlInfo.getControl());
		oControl1.fCallback = sinon.stub();
		oControl1.fetchVariant = function () {
			return oContent1;
		};

		this.oVariantManagement.initialise(oControl1.fCallback, oControl1);

		oPersControlInfo = createControlInfo(this.oVariantManagement, "key2", true);
		var oControl2 = Element.getElementById(oPersControlInfo.getControl());
		oControl2.fCallback = oControl1.fCallback = sinon.stub();
		oControl2.fetchVariant = function () {

			var fTest, oPromise = new Promise(function (resolve, reject) {
				fTest = resolve;
			});
			setTimeout(function () {
				fTest(oContent2);
			}, 1000);

			return oPromise;
		};

		this.oVariantManagement.initialise(oControl2.fCallback, oControl2);

		this.oVariantManagement.oModel._oFlLibrary.then(function () {
			stubSave(Promise.resolve());
			assert.ok(!this.oVariantManagement._newVariant.called);
			assert.ok(!this.oVariantManagement._updateVariant.called);

			this.oVariantManagement.fireSave(oVariantInfo);

			oAfterSavePromise.then(function () {

				var oVariantItem = null;

				this.oVariantManagement.getVariantItems().some(function (oItem) {
					if (oItem.getText() === oVariantInfo.text) {
						oVariantItem = oItem;
					}

					return oVariantItem !== null;
				});

				assert.ok(oVariantItem);

				var oVariant = this.oVariantManagement._getVariantById(oVariantItem.getKey());
				assert.ok(oVariant);

				var oContent = oVariant.getContent();
				assert.ok(oContent);


				assert.deepEqual(oContent.key1, oContent1);
				assert.deepEqual(oContent.key2, oContent2);

				assert.ok(!this.oVariantManagement._newVariant.called);
				assert.ok(this.oVariantManagement._updateVariant.calledOnce);

				done();
			}.bind(this));
		}.bind(this));

	});

	QUnit.test("check displayTextForExecuteOnSelectionForStandardVariant property", function (assert) {
		assert.ok(!this.oVariantManagement.getDisplayTextForExecuteOnSelectionForStandardVariant());

		this.oVariantManagement.setDisplayTextForExecuteOnSelectionForStandardVariant("TEST");
		assert.equal(this.oVariantManagement.getDisplayTextForExecuteOnSelectionForStandardVariant(), "TEST");

		this.oVariantManagement.setDisplayTextForExecuteOnSelectionForStandardVariant(null);
		assert.ok(!this.oVariantManagement.getDisplayTextForExecuteOnSelectionForStandardVariant());
	});

	QUnit.test("Checking the apply automatic text for standard", function (assert) {

		var mVariants = createVariantStubs();
		mVariants.variants = null;
		this.oVariantManagement._createVariantEntries(mVariants);

		this._oVM._createManagementDialog();

		assert.ok(this._oVM.oManagementDialog);
		sinon.stub(this._oVM.oManagementDialog, "open");

		this._oVM._openManagementDialog();

		assert.ok(this._oVM.oManagementTable);
		assert.equal(this._oVM.oManagementTable.getItems().length, 1);

		var aCells = this._oVM.oManagementTable.getItems()[0].getCells();
		assert.ok(aCells);

		var oCheckBox = aCells[4]; // EXEC_COLUMN
		assert.ok(oCheckBox.isA("sap.m.CheckBox"));
		assert.ok(oCheckBox.getEnabled());
		assert.ok(!oCheckBox.getSelected());

		this._oVM.oManagementDialog.close();

		this._oVM.oManagementDialog.destroy();
		this._oVM.oManagementDialog = undefined;
		//------

		this.oVariantManagement.setDisplayTextForExecuteOnSelectionForStandardVariant("TEST");

		this._oVM._createManagementDialog();
		assert.ok(this._oVM.oManagementDialog);
		sinon.stub(this._oVM.oManagementDialog, "open");
		this._oVM._openManagementDialog();
		assert.ok(this._oVM.oManagementTable);
		assert.equal(this._oVM.oManagementTable.getItems().length, 1);

		aCells = this._oVM.oManagementTable.getItems()[0].getCells();
		assert.ok(aCells);

		oCheckBox = aCells[4];  // EXEC_COLUMN
		assert.ok(oCheckBox.isA("sap.m.CheckBox"));
		assert.equal(oCheckBox.getText(), "TEST");
	});

	QUnit.test("check _executeOnSelectForStandardVariantByXML", function (assert) {
		var oVariant = {
			executeOnSelection: false,
			getExecuteOnSelection: function () { return this.executeOnSelection; }
		};

		var oVariant1 = {
			executeOnSelection: false,
			setExecuteOnSelect: function (b) { this.executeOnSelection = b; }
		};

		sinon.stub(this.oVariantManagement, "flWriteOverrideStandardVariant").callsFake(function (bExec) { oVariant.executeOnSelection = true; });
		sinon.stub(this.oVariantManagement, "_getVariantById").returns(oVariant);
		sinon.stub(this.oVariantManagement, "getItemByKey").returns(oVariant1);

		assert.ok(this.oVariantManagement.bConsiderXml === undefined);
		this.oVariantManagement._executeOnSelectForStandardVariantByXML(true);
		assert.ok(!this.oVariantManagement.flWriteOverrideStandardVariant.called);
		assert.ok(this.oVariantManagement.bExecuteOnSelectForStandardViaXML);
		assert.ok(this.oVariantManagement.bConsiderXml);

		this.oVariantManagement._mVariants = { test: "" };
		this.oVariantManagement._executeOnSelectForStandardVariantByXML(this.oVariantManagement.bConsiderXml);
		assert.ok(this.oVariantManagement.flWriteOverrideStandardVariant.calledOnce);
		assert.ok(this.oVariantManagement.bConsiderXml === undefined);
		assert.ok(oVariant1.executeOnSelection);
	});

	QUnit.test("check getExecuteOnStandard/setExecuteOnStandard", function (assert) {
		var oVariant = {
			executeOnSelection: false,
			getExecuteOnSelection: function () { return this.executeOnSelection; }
		};

		var oVariant1 = {
			executeOnSelection: false,
			setExecuteOnSelect: function (b) { this.executeOnSelection = b; },
			getExecuteOnSelect: function () { return this.executeOnSelection; }
		};

		sinon.stub(this.oVariantManagement, "flWriteOverrideStandardVariant").callsFake(function (bExec) { oVariant.executeOnSelection = bExec; });
		sinon.stub(this.oVariantManagement, "_getVariantById").returns(oVariant);
		sinon.stub(this.oVariantManagement, "getItemByKey").returns(oVariant1);

		assert.ok(!this.oVariantManagement.getExecuteOnStandard());


		this.oVariantManagement._mVariants = { test: "" };
		this.oVariantManagement.setExecuteOnStandard(true);
		assert.ok(this.oVariantManagement.getExecuteOnStandard());

		this.oVariantManagement.setExecuteOnStandard(false);
		assert.ok(!this.oVariantManagement.getExecuteOnStandard());
	});

	QUnit.test("check designtime mode", function (assert) {
		var oVariantItem = new VariantItem({ key: this.oVariantManagement.STANDARDVARIANTKEY, text: "Standard", favorite: false });
		this.oVariantManagement.addVariantItem(oVariantItem);

		this._oVM._openVariantList();
		assert.ok(this._oVM.oVariantSelectionPage.getShowFooter());

		this.oVariantManagement.setDesignTimeMode(true);
		this._oVM._openVariantList();
		assert.ok(!this._oVM.oVariantSelectionPage.getShowFooter());

		this.oVariantManagement.setDesignTimeMode(false);
		this._oVM._openVariantList();
		assert.ok(this._oVM.oVariantSelectionPage.getShowFooter());
	});

	QUnit.test("check opening the varian list display in simulated designmode", function(assert) {
		sinon.stub(this._oVM, "_openVariantList");

		this.oVariantManagement.enteringDesignMode();
		this._oVM.onclick();
		assert.ok(!this._oVM._openVariantList.called);

		this.oVariantManagement.leavingDesignMode();
		this._oVM.onclick();
		assert.ok(this._oVM._openVariantList.called);
	});

	QUnit.skip("Checking _focusOnFirstFilterInError", function (assert) {
		sinon.stub(this.oVariantManagement, "_focusOnFirstFilterInError");

		this.oVariantManagement.addVariantItem(new VariantItem({
			key: "1",
			text: "A"
		}));

		this.oVariantManagement.addVariantItem(new VariantItem({
			key: "2",
			text: "B"
		}));

		this.oVariantManagement._delayedControlCreation();
		this.oVariantManagement._createManagementDialog();

		assert.ok(this.oVariantManagement.oManagementDialog);
		sinon.stub(this.oVariantManagement.oManagementDialog, "open");

		this.oVariantManagement._openVariantManagementDialog();

		this.oVariantManagement._saveFromManagementDialog();
		assert.ok(!this.oVariantManagement._focusOnFirstFilterInError.called);

		this.oVariantManagement.addVariantItem(new VariantItem({
			key: "3",
			text: "B"
		}));

		this.oVariantManagement._openVariantManagementDialog();
		this.oVariantManagement._saveFromManagementDialog();
		assert.ok(this.oVariantManagement._focusOnFirstFilterInError.calledOnce);
	});

	QUnit.test("Checking modified flag after save", function (assert) {
		this.oVariantManagement.addVariantItem(new VariantItem({
			key: "1",
			text: "A"
		}));

		this.oVariantManagement.addVariantItem(new VariantItem({
			key: "2",
			text: "B"
		}));


		this.oVariantManagement.setCurrentVariantId("2");

		this.oVariantManagement.setModified(true);
		assert.ok(this.oVariantManagement.getModified(), "expecting modified to be set");

		this.oVariantManagement._afterSave({});

		assert.ok(!this.oVariantManagement.getModified(), "expecting modified not set");
	});

	QUnit.test("check property 'headerLevel'", function (assert) {
		assert.ok(this.oVariantManagement.getHeaderLevel(), "Auto");
		assert.ok(this.oVariantManagement._getEmbeddedVM().oVariantText.getLevel(), "Auto");

		this.oVariantManagement.setHeaderLevel("H1");

		assert.ok(this.oVariantManagement.getHeaderLevel(), "H1");
		assert.ok(this.oVariantManagement._getEmbeddedVM().oVariantText.getLevel(), "H1");
	});

	QUnit.test("check property 'titleStyle'", function (assert) {
		assert.ok(this.oVariantManagement.getTitleStyle(), "Auto");
		assert.ok(this.oVariantManagement._getEmbeddedVM().oVariantText.getTitleStyle(), "Auto");

		this.oVariantManagement.setTitleStyle("H1");

		assert.ok(this.oVariantManagement.getTitleStyle(), "H1");
		assert.ok(this.oVariantManagement._getEmbeddedVM().oVariantText.getTitleStyle(), "H1");
	});

	QUnit.test("check getCurrentVariantId during variant creation", function (assert) {

		var done = assert.async();

		var mChanges = createVariantStubs();
		this.oVariantManagement._createVariantEntries(mChanges);

		sinon.stub(this.oVariantManagement, "isPageVariant").returns(true);
		sinon.stub(this.oVariantManagement, "_flUpdateVariant");
		sinon.stub(this.oVariantManagement.oModel, "_flWriteAddVariant").callsFake(function () {
			return createVariantStub("newId", "name");
		});
		sinon.stub(this.oVariantManagement, "_fetchContentAsync").callsFake(function () {
			assert.equal(this.oVariantManagement.getCurrentVariantId(), "SV1656651501366", "expecting a temporarily variant id");
			return Promise.resolve({});
		}.bind(this));

		var fWaitForSavePromise = null;
		var oWaitForSavePromise = new Promise(function (resolve) {
			fWaitForSavePromise = resolve;
		});
		sinon.stub(this.oVariantManagement, "_save").callsFake(function (oInfo) {
			return fWaitForSavePromise();
		});

		var oInfo = {
			name: "newVariant",
			"public": true
		};

		this.oVariantManagement._newVariant(oInfo);
		oWaitForSavePromise.then(function (oContent) {
			assert.equal(this.oVariantManagement.getCurrentVariantId(), "newId", "expecting the new variant id");
			done();
		}.bind(this));

	});

	QUnit.test("check calling the _checkUpdate method", function (assert) {
		sinon.spy(this.oVariantManagement, "_checkUpdate");

		assert.ok(!this.oVariantManagement._checkUpdate.called);
		this.oVariantManagement.fireManage({});
		assert.ok(this.oVariantManagement._checkUpdate.calledOnce);
	});

	QUnit.test("check label of variant lists", function (assert) {
		var sLanguage = Localization.getLanguage();
		Localization.setLanguage("EN");

		var mChanges = createVariantStubs();
		this.oVariantManagement._createVariantEntries(mChanges);

		assert.equal(this.oVariantManagement._oVM.getPopoverTitle(), "My Views");

		Localization.setLanguage(sLanguage);
	});

	QUnit.test("Checking the control ids in manage views", function (assert) {

		var mVariants = createVariantStubs();
		this.oVariantManagement._createVariantEntries(mVariants);

		this._oVM._createManagementDialog();

		assert.ok(this._oVM.oManagementDialog);
		sinon.stub(this._oVM.oManagementDialog, "open");

		this._oVM._openManagementDialog();

		assert.ok(this._oVM.oManagementTable);
		assert.equal(this._oVM.oManagementTable.getItems().length, 4);

		var sIdPrefix = this._oVM.getId() + "-manage-";

		var i, j, aCells, oControl, sTemp, bSkip;

		for (i = 0; i < this._oVM.oManagementTable.getItems().length; i++) {
			aCells = this._oVM.oManagementTable.getItems()[i].getCells();
			assert.ok(aCells, "expected cells found");

			for (j = 0; j < aCells.length; j++) {
				oControl = aCells[j];
				bSkip = false;
				switch (j) {
					case 0: sTemp = "fav-"; break;
					case 1: sTemp = oControl.isA("sap.m.Input") ? "input-" : "text-"; break;
					case 2: sTemp = "type-"; break;
					case 3: sTemp = "def-"; break;
					case 4: sTemp = "exe-"; break;
					case 5: sTemp = "roles-"; bSkip = true; break;
					case 6: sTemp = "author-"; break;
					case 7: sTemp = "del-"; break;
					default: bSkip = true; break;
				}

				if (!bSkip) {
					assert.equal(oControl.getId(), sIdPrefix + sTemp + i, "expecting id '" + sTemp + "' for (" + i + ',' + j + ')');
				}
			}
		}

		this._oVM.oManagementDialog.close();

		this._oVM.oManagementDialog.destroy();
		this._oVM.oManagementDialog = undefined;
	});


	QUnit.test("Checking title", async function(assert) {
		var mVariants = createVariantStubs();
		this.oVariantManagement._createVariantEntries(mVariants);

		this.oVariantManagement.setCurrentVariantKey("2");
		await nextUIUpdate();

		assert.equal(this._oVM.getTitle().getText(), "TWO", "expected text");

		var aItems = this.oVariantManagement.getVariantItems();
		assert.equal(aItems.length, 4, "expected items found");

		aItems[3].setTitle("Hugo");
		await nextUIUpdate();

		assert.equal(this._oVM.getTitle().getText(), "Hugo", "expected text");
	});

	QUnit.test("check default on a non existing variant", function (assert) {
		var mChanges = createVariantStubs();
		mChanges.defaultVariantId = "3XXX";

		var oPersControlInfo = createControlInfo(this.oVariantManagement, "4711", true);
		var oControl = Element.getElementById(oPersControlInfo.getControl());

		this.oVariantManagement._oPersoControl = oControl;
		sinon.stub(this.oVariantManagement, "isPageVariant").returns(false);
		sinon.stub(this.oVariantManagement, "_applyVariant");

		this.oVariantManagement._dataReceived(mChanges, true, true, false, this.oVariantManagement._getControlWrapper(this.oVariantManagement._oPersoControl));
		assert.equal(this.oVariantManagement.getCurrentVariantKey(), this.oVariantManagement.STANDARDVARIANTKEY);

		oControl.destroy();
	});

	QUnit.test("Checking getViewIdByName", function (assert) {
		var mVariants = createVariantStubs();
		this.oVariantManagement._createVariantEntries(mVariants);

		var sVariantId = this.oVariantManagement.getViewIdByName("TWO");
		assert.equal(sVariantId, "2", "expected id found");

		sVariantId = this.oVariantManagement.getViewIdByName("Standard");
		assert.equal(sVariantId, "*standard*", "expected id found");

		sVariantId = this.oVariantManagement.getViewIdByName("ONE");
		assert.equal(sVariantId, "1", "expected id found");

		sVariantId = this.oVariantManagement.getViewIdByName("NIL");
		assert.equal(sVariantId, null, "expected id found");
	});

	QUnit.test("Checking isNameDuplicate", function (assert) {
		var mVariants = createVariantStubs();
		this.oVariantManagement._createVariantEntries(mVariants);

		assert.ok(this.oVariantManagement.isNameDuplicate("TWO"));
		assert.ok(this.oVariantManagement.isNameDuplicate("Standard"));
		assert.ok(this.oVariantManagement.isNameDuplicate("ONE "));

		assert.ok(!this.oVariantManagement.isNameDuplicate("TwO"));
		assert.ok(!this.oVariantManagement.isNameDuplicate("Standart"));
		assert.ok(!this.oVariantManagement.isNameDuplicate("ONEe "));
	});

	QUnit.skip("Checking wrong binding name", function (assert) {
		var oVariant1 = createVariantStub("V1", "{= 1 ? Math.abs.constructor.call('', 'alert(document.domain);return \"YES\"')() : 'NO'", { c: "v1" });
		var oVariant2 = createVariantStub("V2", "{= 1 ? Math.abs.constructor.call('', 'alert(document.domain);return \"YES\"')() : 'NO'}", { c: "v2" });
		var mVariants = createVariantStubs(false, [oVariant1, oVariant2]);

		this.oVariantManagement._createVariantEntries(mVariants);

		var oVariantItems = this.oVariantManagement.getVariantItems();
		assert.equal(oVariantItems.length, 6);
		assert.equal(oVariantItems[0].getText(), "Standard");
		assert.equal(oVariantItems[1].getText(), "ONE");
		assert.equal(oVariantItems[2].getText(), "THREE");
		assert.equal(oVariantItems[3].getText(), "TWO");
		assert.equal(oVariantItems[4].getText(), "undefined");
		assert.equal(oVariantItems[5].getKey(), "V2");
		assert.equal(oVariantItems[5].getText(), "undefined");
	});

	QUnit.test("VariantManagement check get-/setShowAsText", function(assert) {
		assert.equal(this.oVariantManagement.getShowAsText(), false, "expected default value");

		assert.ok(this.oVariantManagement.getTitle());
		assert.ok(this.oVariantManagement.getTitle().isA("sap.m.Title"), "expected type 'sap.m.Title'.");

		this.oVariantManagement.setShowAsText(true);
		assert.equal(this.oVariantManagement.getShowAsText(), true, "expected assigned value");

		assert.ok(this.oVariantManagement.getTitle());
		assert.ok(this.oVariantManagement.getTitle().isA("sap.m.Text"), "expected type 'sap.m.Text'.");

		this.oVariantManagement.setShowAsText(false);
		assert.equal(this.oVariantManagement.getShowAsText(), false, "expected assigned value");

		assert.ok(this.oVariantManagement.getTitle());
		assert.ok(this.oVariantManagement.getTitle().isA("sap.m.Title"), "expected type 'sap.m.Title'.");
	});

	QUnit.test("_assignUser", function(assert) {
		var mVariants = createVariantStubs(false);

		this.oVariantManagement._createVariantEntries(mVariants);

		var oVariantItems = this.oVariantManagement.getVariantItems();
		assert.ok(oVariantItems.length, 5);
		assert.equal(oVariantItems[0].getAuthor(), "SAP");
		assert.equal(oVariantItems[1].getAuthor(), "author");

		this.oVariantManagement._assignUser("1", "QUNIT");
		assert.equal(oVariantItems[0].getAuthor(), "SAP");
		assert.equal(oVariantItems[1].getAuthor(), "QUNIT");
	});

	QUnit.test("check property 'enabled'", function(assert) {

		var oTitle = this.oVariantManagement.getTitle();
		assert.ok(oTitle);
		assert.ok(oTitle.isA("sap.m.Title"), "expected type 'sap.m.Title'");

		assert.ok(this.oVariantManagement.getEnabled(), "is enabled");
		assert.ok(oTitle.hasStyleClass("sapMVarMngmtClickable"), "style class should be assigned");
		assert.ok(!oTitle.hasStyleClass("sapMVarMngmtDisabled"), "style class should not be assigned");

		this.oVariantManagement.setEnabled(false);
		assert.ok(!this.oVariantManagement.getEnabled(), "is not enabled");
		assert.ok(!oTitle.hasStyleClass("sapMVarMngmtClickable"), "style class should not be assigned");
		assert.ok(oTitle.hasStyleClass("sapMVarMngmtDisabled"), "style class should be assigned");

		this.oVariantManagement.setEnabled(true);
		assert.ok(oTitle.hasStyleClass("sapMVarMngmtClickable"), "style class should be assigned");
		assert.ok(!oTitle.hasStyleClass("sapMVarMngmtDisabled"), "style class should not be assigned");
	});

	QUnit.module("sap.ui.comp.smartvariants.SmartVariantManagement Vendor", {
		beforeEach: function () {
			this.oVariantManagement = new SmartVariantManagement({
				showShare: true
			});
			stubIsVariantAdaptationEnabled(false);
			stubIsVariantSharingEnabled(true);
			stubIsVariantPersonalizationEnabled(true);

			sinon.stub(this.oVariantManagement.oModel, "_isFlexSupported").returns(true);

			var mChanges = createVariantStubs();
			stubLoadVariants(Promise.resolve(mChanges));
			this.oVariantManagement.setPersistencyKey("Persistency_Key");
		},
		afterEach: function () {
			this.oVariantManagement.destroy();
			FlexWriteAPI.isVariantAdaptationEnabled.restore();
			FlexWriteAPI.isVariantSharingEnabled.restore();
			FlexWriteAPI.isVariantPersonalizationEnabled.restore();

		}
	});

	QUnit.test("Vendor: check the vendor standard key", function (assert) {

		this.oVariantManagement._oPersoControl = {};

		var mFlVariants = createVariantStubs(true);
		this.oVariantManagement._createVariantEntries(mFlVariants);
		assert.equal(this.oVariantManagement._sAppStandardVariantKey, "2");

		mFlVariants = createVariantStubs();
		this.oVariantManagement._sAppStandardVariantKey = null;
		this.oVariantManagement._createVariantEntries(mFlVariants);
		assert.equal(this.oVariantManagement._sAppStandardVariantKey, null);

		mFlVariants.standardVariant.setContent({ filter: [] });

		this.oVariantManagement._sAppStandardVariantKey = null;
		this.oVariantManagement._createVariantEntries(mFlVariants);
		assert.equal(this.oVariantManagement._sAppStandardVariantKey, "*standard*");
	});

	QUnit.test("Vendor: check variants with i18n model dependencies", function(assert) {

		var fnWaitResolve = null;
		var oWaitPromise = new Promise(function (resolve) { fnWaitResolve = resolve; });

		var oVariant1 = createVariantStub("V1", "{i18n>Vendor1}", { c: "v1" });
		var oVariant2 = createVariantStub("V2", "{i18n>Vendor2}", { c: "v2" });
		var mFlVariants = createVariantStubs(false, [oVariant2, oVariant1], "{i18n>MyStandard}");

		var nCount = 0;
		var fReorderList = this.oVariantManagement.oModel.reorderVariants.bind(this.oVariantManagement.oModel);
		sinon.stub(this.oVariantManagement.oModel, "reorderVariants").callsFake(function (sKey, sNewTitle, nIdx) {
			fReorderList(sKey, sNewTitle, nIdx);
			if (++nCount === 3) {
				setTimeout(fnWaitResolve(), 50);
			}
		});

		this.oVariantManagement._createVariantEntries(mFlVariants);

		var oVariantItems = this.oVariantManagement.getVariantItems();
		assert.ok(oVariantItems.length, 6);
		assert.equal(oVariantItems[0].getText(), "{i18n>MyStandard}");
		assert.equal(oVariantItems[1].getText(), "ONE");
		assert.equal(oVariantItems[2].getText(), "THREE");
		assert.equal(oVariantItems[3].getText(), "TWO");
		assert.equal(oVariantItems[4].getText(), "{i18n>Vendor1}");
		assert.equal(oVariantItems[5].getText(), "{i18n>Vendor2}");

		this.oVariantManagement.setModel(new ResourceModel({
			bundleName: "test-resources/sap/ui/comp/qunit/smartvariants/i18n/i18n"
		}), "i18n");

		//this.oVariantManagement._checkUpdate();
		//await nextUIUpdate();

		return oWaitPromise.then(function () {

			var oVariantItems = this.oVariantManagement.getVariantItems();
			assert.ok(oVariantItems.length, 6);
			assert.equal(oVariantItems[0].getText(), "My Standard");
			assert.equal(oVariantItems[1].getText(), "A Vendor 2");
			assert.equal(oVariantItems[2].getText(), "ONE");
			assert.equal(oVariantItems[3].getText(), "THREE");
			assert.equal(oVariantItems[4].getText(), "TWO");
			assert.equal(oVariantItems[5].getText(), "Vendor 1");

			//done();

		}.bind(this));
	});

	QUnit.module("sap.ui.comp.smartvariants.SmartVariantManagement Ui Adaptation", {
		beforeEach: function () {
			this.oVariantManagement = new SmartVariantManagement({
				showShare: true
			});
			stubIsVariantAdaptationEnabled(true);
			stubIsVariantSharingEnabled(true);
			stubIsVariantPersonalizationEnabled(true);

			sinon.stub(this.oVariantManagement.oModel, "_isFlexSupported").returns(true);

			this._oVM = this.oVariantManagement._getEmbeddedVM();

			var mChanges = createVariantStubs();
			stubLoadVariants(Promise.resolve(mChanges));

			this.oVariantManagement.setPersistencyKey("Persistency_Key");
		},
		afterEach: function () {
			this.oVariantManagement.destroy();
			FlexWriteAPI.isVariantAdaptationEnabled.restore();
			FlexWriteAPI.isVariantSharingEnabled.restore();
			FlexWriteAPI.isVariantPersonalizationEnabled.restore();

		}
	});

	QUnit.test("UI Adaptation - save as dialog - press Save", function (assert) {

		return new Promise(function (fResolve) {
			var fInitializedPromise = null;
			var oInitializedPromise = new Promise(function (resolve) {
				fInitializedPromise = resolve;
			});

			this.oVariantManagement._loadFlex().then(function () {
				var oPersControlInfo = createControlInfo(this.oVariantManagement, "ControlPersKey");
				var oControl = Element.getElementById(oPersControlInfo.getControl());

				oControl.variantsInitialized = sinon.stub();
				oControl.fFunc = function () {
					fInitializedPromise();
				};

				this.oVariantManagement.initialise(oControl.fFunc, oControl);
				oInitializedPromise.then(async function() {
					var fDataCallBack = function (oData) {
						assert.ok(oData);
						assert.equal(oData.text, "New Variant");
						assert.equal(oData.default, false);
						assert.equal(oData.executeOnSelection, false);
						assert.equal(oData.type, "page");
						assert.ok(!oData.contexts);

						var oObj = {};
						oObj[oControl.getKey()] = oControl.fetchVariant();
						assert.deepEqual(oData.content, oObj);

						fResolve();
					};

					this._oVM._createSaveAsDialog();


					var fOpened = async function (oEvent) {
						var oTarget = this._oVM.oSaveSave.getFocusDomRef();
						assert.ok(oTarget);
						QUnitUtils.triggerTouchEvent("tap", oTarget, {
							srcControl: null
						});

						await nextUIUpdate();

					}.bind(this);

					this._oVM.oSaveAsDialog.attachAfterOpen(fOpened);

					this.oVariantManagement.openSaveAsDialogForKeyUser("STYLECLASS", fDataCallBack);
					this._oVM.oInputName.setValue("New Variant");

					await nextUIUpdate();
				}.bind(this));
			}.bind(this));

		}.bind(this));
	});


	QUnit.test("UI Adaptation - save as dialog - press Cancel", function (assert) {

		return new Promise(function (fResolve) {

			var fInitializedPromise = null;
			var oInitializedPromise = new Promise(function (resolve) {
				fInitializedPromise = resolve;
			});

			this.oVariantManagement._loadFlex().then(function () {
				var oPersControlInfo = createControlInfo(this.oVariantManagement, "ControlPersKey");
				var oControl = Element.getElementById(oPersControlInfo.getControl());

				oControl.variantsInitialized = sinon.stub();
				oControl.fFunc = function () {
					fInitializedPromise();
				};

				this.oVariantManagement.initialise(oControl.fFunc, oControl);
				oInitializedPromise.then(async function() {
					var fDataCallBack = function (oData) {
						assert.ok(!oData);
						fResolve();
					};

					this._oVM._createSaveAsDialog();

					var fOpened = async function (oEvent) {
						var oButton = Element.getElementById(this._oVM.getId() + "-variantcancel");
						assert.ok(oButton);
						var oTarget = oButton.getFocusDomRef();
						assert.ok(oTarget);
						QUnitUtils.triggerTouchEvent("tap", oTarget, {
							srcControl: null
						});

						await nextUIUpdate();

					}.bind(this);

					this._oVM.oSaveAsDialog.attachAfterOpen(fOpened);

					this.oVariantManagement.openSaveAsDialogForKeyUser("STYLECLASS", fDataCallBack);
					this._oVM.oInputName.setValue("New Variant");

					await nextUIUpdate();
				}.bind(this));
			}.bind(this));

		}.bind(this));
	});

	QUnit.test("UI Adaptation - save as dialog - with Roles Component - press Save", function (assert) {

		return new Promise(function (fResolve) {

			var fInitializedPromise = null;
			var oInitializedPromise = new Promise(function (resolve) {
				fInitializedPromise = resolve;
			});

			var oContextSharingComponentContainer = FlexContextSharingAPI.createComponent({ layer: "CUSTOMER" });

			this.oVariantManagement._loadFlex().then(function () {
				var oPersControlInfo = createControlInfo(this.oVariantManagement, "ControlPersKey");
				var oControl = Element.getElementById(oPersControlInfo.getControl());

				oControl.variantsInitialized = sinon.stub();
				oControl.fFunc = function () {
					fInitializedPromise();
				};

				this.oVariantManagement.initialise(oControl.fFunc, oControl);
				oInitializedPromise.then(async function() {
					var fDataCallBack = function (oData) {
						assert.ok(oData);
						assert.equal(oData.text, "New Variant");
						assert.equal(oData.default, false);
						assert.equal(oData.executeOnSelection, false);
						assert.equal(oData.type, "page");
						assert.deepEqual(oData.contexts, { role: [] });

						var oObj = {};
						oObj[oControl.getKey()] = oControl.fetchVariant();
						assert.deepEqual(oData.content, oObj);

						oContextSharingComponentContainer.then(function (oCompContainer) {
							var oComponent = oCompContainer.getComponentInstance();
							assert.ok(oComponent);
							oComponent.destroy();
							oCompContainer.destroy();
							fResolve();
						});
					};

					this._oVM._createSaveAsDialog();

					var fOpened = async function (oEvent) {
						var oTarget = this._oVM.oSaveSave.getFocusDomRef();
						assert.ok(oTarget);
						QUnitUtils.triggerTouchEvent("tap", oTarget, {
							srcControl: null
						});

						await nextUIUpdate();

					}.bind(this);

					this._oVM.oSaveAsDialog.attachAfterOpen(fOpened);

					this.oVariantManagement.openSaveAsDialogForKeyUser("STYLECLASS", fDataCallBack, oContextSharingComponentContainer);
					this._oVM.oInputName.setValue("New Variant");

					await nextUIUpdate();
				}.bind(this));
			}.bind(this));

		}.bind(this));
	});

	QUnit.test("UI Adaptation - manage views - press Save", function (assert) {

		return new Promise(function (fResolve) {

			var fInitializedPromise = null;
			var oInitializedPromise = new Promise(function (resolve) {
				fInitializedPromise = resolve;
			});

			this.oVariantManagement._loadFlex().then(function () {
				var oPersControlInfo = createControlInfo(this.oVariantManagement, "ControlPersKey");
				var oControl = Element.getElementById(oPersControlInfo.getControl());

				oControl.variantsInitialized = sinon.stub();
				oControl.fFunc = function () {
					fInitializedPromise();
				};

				this.oVariantManagement.initialise(oControl.fFunc, oControl);
				oInitializedPromise.then(async function() {
					var fDataCallBack = function (oData) {
						assert.ok(oData);
						assert.equal(oData.default, "3");

						assert.deepEqual(oData["1"], { "deleted": true });
						assert.deepEqual(oData["2"], { executeOnSelection: true, contexts: { role: ["OME", "TWO", "THREE"] } });
						assert.deepEqual(oData["3"], { "deleted": true });


						fResolve();
					};

					this._oVM._createManagementDialog();

					var fOpened = async function (oEvent) {
						var aColumns = this._oVM.oManagementTable.getColumns();
						assert.ok(!aColumns[5].getVisible()); // RESTRICT_COLUMN

						this._oVM.setDefaultKey("3");

						var oItem = this._oVM.getItemByKey("1");
						oItem.setFavorite(false);
						oItem = this._oVM.getItemByKey("3");
						oItem.setFavorite(true);

						oItem = this._oVM.getItemByKey("1");
						oItem.setTitle("New Title 1");
						this._oVM._addRenamedItem(oItem);
						oItem = this._oVM.getItemByKey("3");
						oItem.setTitle("New Title 3");
						this._oVM._addRenamedItem(oItem);

						oItem = this._oVM.getItemByKey("2");
						oItem.setExecuteOnSelect(true);
						oItem = this._oVM.getItemByKey("3");
						oItem.setExecuteOnSelect(true);

						oItem = this._oVM.getItemByKey("1");
						oItem.setVisible(false);
						this._oVM._addDeletedItem(oItem);
						oItem = this._oVM.getItemByKey("3");
						oItem.setVisible(false);
						this._oVM._addDeletedItem(oItem);

						oItem = this._oVM.getItemByKey("2");
						oItem.setContexts({ role: ["OME", "TWO", "THREE"] });


						var oTarget = this._oVM.oManagementSave.getFocusDomRef();
						assert.ok(oTarget);
						QUnitUtils.triggerTouchEvent("tap", oTarget, {
							srcControl: null
						});

						await nextUIUpdate();

					}.bind(this);

					this._oVM.oManagementDialog.attachAfterOpen(fOpened);

					this.oVariantManagement.openManageViewsDialogForKeyUser({ rtaStyleClass: "STYLECLASS" }, fDataCallBack, true);

					await nextUIUpdate();
				}.bind(this));
			}.bind(this));

		}.bind(this));
	});

	QUnit.test("UI Adaptation - manage views - press Cancel", function (assert) {

		return new Promise(function (fResolve) {

			var fInitializedPromise = null;
			var oInitializedPromise = new Promise(function (resolve) {
				fInitializedPromise = resolve;
			});

			this.oVariantManagement._loadFlex().then(function () {
				var oPersControlInfo = createControlInfo(this.oVariantManagement, "ControlPersKey");
				var oControl = Element.getElementById(oPersControlInfo.getControl());

				oControl.variantsInitialized = sinon.stub();
				oControl.fFunc = function () {
					fInitializedPromise();
				};

				this.oVariantManagement.initialise(oControl.fFunc, oControl);
				oInitializedPromise.then(async function() {
					var fDataCallBack = function (oData) {
						assert.ok(!oData);

						fResolve();
					};

					this._oVM._createManagementDialog();

					var fOpened = async function (oEvent) {
						this._oVM.setDefaultKey("3");

						var oItem = this._oVM.getItemByKey("1");
						oItem.setFavorite(false);
						oItem = this._oVM.getItemByKey("3");
						oItem.setFavorite(true);

						oItem = this._oVM.getItemByKey("1");
						oItem.setTitle("New Title 1");
						this._oVM._addRenamedItem(oItem);
						oItem = this._oVM.getItemByKey("3");
						oItem.setTitle("New Title 3");
						this._oVM._addRenamedItem(oItem);

						oItem = this._oVM.getItemByKey("2");
						oItem.setExecuteOnSelect(true);
						oItem = this._oVM.getItemByKey("3");
						oItem.setExecuteOnSelect(true);

						oItem = this._oVM.getItemByKey("1");
						oItem.setVisible(false);
						this._oVM._addDeletedItem(oItem);
						oItem = this._oVM.getItemByKey("3");
						oItem.setVisible(false);
						this._oVM._addDeletedItem(oItem);

						oItem = this._oVM.getItemByKey("2");
						oItem.setContexts({ role: ["OME", "TWO", "THREE"] });

						var oButton = Element.getElementById(this._oVM.getId() + "-managementcancel");
						assert.ok(oButton);
						var oTarget = oButton.getFocusDomRef();
						QUnitUtils.triggerTouchEvent("tap", oTarget, {
							srcControl: null
						});

						await nextUIUpdate();

					}.bind(this);

					this._oVM.oManagementDialog.attachAfterOpen(fOpened);

					this.oVariantManagement.openManageViewsDialogForKeyUser({ rtaStyleClass: "STYLECLASS" }, fDataCallBack, true);

					await nextUIUpdate();
				}.bind(this));
			}.bind(this));

		}.bind(this));
	});

	QUnit.test("UI Adaptation - manage views  - with Roles Component - press Save", function (assert) {

		return new Promise(function (fResolve) {

			var fInitializedPromise = null;
			var oInitializedPromise = new Promise(function (resolve) {
				fInitializedPromise = resolve;
			});

			var oContextSharingComponentContainer = FlexContextSharingAPI.createComponent({ layer: "CUSTOMER" });

			this.oVariantManagement._loadFlex().then(function () {
				var oPersControlInfo = createControlInfo(this.oVariantManagement, "ControlPersKey");
				var oControl = Element.getElementById(oPersControlInfo.getControl());

				oControl.variantsInitialized = sinon.stub();
				oControl.fFunc = function () {
					fInitializedPromise();
				};

					this.oVariantManagement.initialise(oControl.fFunc, oControl);
					oInitializedPromise.then(async function() {
						var fDataCallBack = function (oData) {
							assert.ok(oData);
							//even though the setDefaultKey("2") was called - this is a restricted view, so standard will be used and since the
							//initial value was standard - no default view change will be determined.
							assert.ok(!oData.hasOwnProperty("default"));

						assert.deepEqual(oData["1"], { "deleted": true });
						assert.deepEqual(oData["2"], { executeOnSelection: true, contexts: { role: ["OME", "TWO", "THREE"] } });
						assert.deepEqual(oData["3"], { "deleted": true });

						oContextSharingComponentContainer.then(function (oCompContainer) {
							var oComponent = oCompContainer.getComponentInstance();
							assert.ok(oComponent);
							oComponent.destroy();
							oCompContainer.destroy();
							fResolve();
						});
					};

					this._oVM._createManagementDialog();

					var fOpenedRolesDialog = async function (oEvent) {

						var oButton = Element.getElementById(this._oVM.getId() + "-rolesave");
						assert.ok(oButton);
						var oTarget = oButton.getFocusDomRef();
						QUnitUtils.triggerTouchEvent("tap", oTarget, {
							srcControl: null
						});

						await nextUIUpdate();


						oTarget = this._oVM.oManagementSave.getFocusDomRef();
						assert.ok(oTarget);
						QUnitUtils.triggerTouchEvent("tap", oTarget, {
							srcControl: null
						});

						await nextUIUpdate();

					}.bind(this);

					var fOpened = function (oEvent) {

						var aColumns = this._oVM.oManagementTable.getColumns();
						assert.ok(aColumns[5].getVisible()); //RESTRICT_COLUMN

						//this will be neglected, because view '2' is a restricted view.
						this._oVM.setDefaultKey("2");

						var oItem = this._oVM.getItemByKey("1");
						oItem.setFavorite(false);
						oItem = this._oVM.getItemByKey("3");
						oItem.setFavorite(true);

						oItem = this._oVM.getItemByKey("1");
						oItem.setTitle("New Title 1");
						this._oVM._addRenamedItem(oItem);
						oItem = this._oVM.getItemByKey("3");
						oItem.setTitle("New Title 3");
						this._oVM._addRenamedItem(oItem);

						oItem = this._oVM.getItemByKey("2");
						oItem.setExecuteOnSelect(true);
						oItem = this._oVM.getItemByKey("3");
						oItem.setExecuteOnSelect(true);

						oItem = this._oVM.getItemByKey("1");
						oItem.setVisible(false);
						this._oVM._addDeletedItem(oItem);
						oItem = this._oVM.getItemByKey("3");
						oItem.setVisible(false);
						this._oVM._addDeletedItem(oItem);

						oItem = this._oVM.getItemByKey("2");
						oItem.setContexts({ role: ["OME", "TWO", "THREE"] });


						assert.ok(!this._oVM._oRolesDialog);
						this._oVM._createRolesDialog();
						assert.ok(this._oVM._oRolesDialog);
						this._oVM._oRolesDialog.attachAfterOpen(fOpenedRolesDialog);

						var oItemStub = {
							getKey: function () { return "1"; },
							getContexts: function () { return { role: [] }; }
						};

						this._oVM._openRolesDialog(oItemStub);
					}.bind(this);

					this._oVM.oManagementDialog.attachAfterOpen(fOpened);


					this.oVariantManagement.openManageViewsDialogForKeyUser({ rtaStyleClass: "STYLECLASS", contextSharingComponentContainer: oContextSharingComponentContainer }, fDataCallBack, true);

					await nextUIUpdate();
				}.bind(this));
			}.bind(this));

		}.bind(this));
	});

	QUnit.test("UI Adaptation - manage views - check favorites", function (assert) {

		sinon.stub(this.oVariantManagement, "_getDefaultVariantKey").returns("2");
		return new Promise(function (fResolve) {

			var fInitializedPromise = null;
			var oInitializedPromise = new Promise(function (resolve) {
				fInitializedPromise = resolve;
			});

			this.oVariantManagement._loadFlex().then(function () {
				var oPersControlInfo = createControlInfo(this.oVariantManagement, "ControlPersKey");
				var oControl = Element.getElementById(oPersControlInfo.getControl());

				oControl.variantsInitialized = sinon.stub();
				oControl.fFunc = function () {
					fInitializedPromise();
				};

				this.oVariantManagement.initialise(oControl.fFunc, oControl);
				oInitializedPromise.then(async function() {
					var fDataCallBack = function (oData) {
						assert.ok(!oData);

						fResolve();
					};

					this._oVM._createManagementDialog();

					var fOpened = async function (oEvent) {

						assert.ok(this._oVM.oManagementTable);

						var aManageItems = this._oVM.oManagementTable.getItems();
						assert.equal(aManageItems.length, 4);
						// favorites
						//is sorted: Standard, ONE, THREE, TWO
						assert.ok(aManageItems[0].getCells()[0].hasStyleClass("sapMVarMngmtFavNonInteractiveColor"));
						assert.ok(aManageItems[1].getCells()[0].hasStyleClass("sapMVarMngmtFavColor"));
						assert.ok(aManageItems[2].getCells()[0].hasStyleClass("sapMVarMngmtFavColor"));
						assert.ok(aManageItems[3].getCells()[0].hasStyleClass("sapMVarMngmtFavNonInteractiveColor"));

						// default
						assert.ok(!aManageItems[0].getCells()[3].getSelected());
						assert.ok(!aManageItems[1].getCells()[3].getSelected());
						assert.ok(!aManageItems[2].getCells()[3].getSelected());
						assert.ok(aManageItems[3].getCells()[3].getSelected());

						//delete
						assert.ok(!aManageItems[0].getCells()[7].getVisible());
						assert.ok(aManageItems[1].getCells()[7].getVisible());
						assert.ok(aManageItems[2].getCells()[7].getVisible());
						assert.ok(aManageItems[3].getCells()[7].getVisible());


						var oButton = Element.getElementById(this._oVM.getId() + "-managementcancel");
						assert.ok(oButton);
						var oTarget = oButton.getFocusDomRef();
						QUnitUtils.triggerTouchEvent("tap", oTarget, {
							srcControl: null
						});

						await nextUIUpdate();

					}.bind(this);

					this._oVM.oManagementDialog.attachAfterOpen(fOpened);

					this.oVariantManagement.openManageViewsDialogForKeyUser({ rtaStyleClass: "STYLECLASS" }, fDataCallBack, true);

					await nextUIUpdate();
				}.bind(this));
			}.bind(this));

		}.bind(this));
	});
});
