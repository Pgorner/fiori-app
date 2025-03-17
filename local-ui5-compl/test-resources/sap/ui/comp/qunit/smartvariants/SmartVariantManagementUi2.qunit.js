/* global QUnit, sinon */
sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/comp/variants/VariantItem",
	"sap/ui/comp/smartvariants/PersonalizableInfo",
	"sap/ui/comp/smartvariants/SmartVariantManagementUi2",
	"sap/ui/core/Element"
],
	function(
		Control,
		VariantItem,
		PersonalizableInfo,
		SmartVariantManagementUi2,
		Element
	) {
	"use strict";

	var TestingControl = Control.extend("testing.Control", {
		metadata : {
			properties : {
				key: "string"
			},
			events: {
				beforeVariantSave : {}
			}
		},
		renderer: null,
		fetchVariant: function() {
			return {filterBarVariant: {}, filterbar: {}};
		},
		applyVariant: function(oVariant) {
			this._applyedData = oVariant;
		},

		getApplyedData: function() {
			return this._applyedData;
		},

		fireBeforeVariantSave: function(s) {
			var oEvent = { context: s };
			this.fireEvent("beforeVariantSave", oEvent);
		}
	});

	function createControlInfo(oVariantManagement) {
		var oControl = new TestingControl( {key: "4711"});
		var oPersControlInfo = new PersonalizableInfo({
			type: "TYPE",
			keyName: "key"
		});
		oPersControlInfo.setControl(oControl);

		oVariantManagement.addPersonalizableControl(oPersControlInfo);

		return oPersControlInfo;
	}

	QUnit.module("sap.ui.comp.smartvariants.SmartVariantManagementUi2", {
		beforeEach: function() {
			this.oVariantManagement = new SmartVariantManagementUi2();
		},
		afterEach: function() {
			this.oVariantManagement.destroy();
		}
	});


	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oVariantManagement);
	});

	QUnit.test("Exit shall be called", function(assert) {
		var oVariantManagement = new SmartVariantManagementUi2();
		sinon.spy(oVariantManagement, "exit");
		oVariantManagement.destroy();
		assert.ok(oVariantManagement.exit.called, "expecting 'exit' to be called");
	});


	QUnit.test("check initialise", function(assert) {

		var oService = {
				getContainer: function() {
					return this;
				},
				fail: function(fFunc) {
					return this;
				},
				done: function(fFunc) {
					fFunc({});
				}
		};

		var oContainer = {
				getServiceAsync: function() {
							return Promise.resolve(oService);
						}
		};

		var oVariantSetAdapter = {
				getVariantSet: function() {
							return {};
						}
		};

		sinon.stub(this.oVariantManagement, "_getUShellContainer").returns(oContainer);

		var oPersControlInfo = createControlInfo(this.oVariantManagement);
		var oControl = Element.getElementById(oPersControlInfo.getControl());

		var fWaitPromiseResolve = null;
		var oWaitPromise = new Promise(function(resolve, reject) {
			fWaitPromiseResolve = resolve;
		});

		var bBeforeSaveCalled = false;
		var sContext = null;
		var fBeforeSave = function(oEvent) {
			bBeforeSaveCalled = true;
			sContext = oEvent.getParameters().context;
			fWaitPromiseResolve();
		};
		oControl.attachBeforeVariantSave(fBeforeSave);

		sinon.stub(this.oVariantManagement, "_reCreateVariantEntries");
		sinon.stub(this.oVariantManagement, "_setSelectedVariant");
		sinon.stub(this.oVariantManagement, "_getPersistencyKey").returns("key");
		sinon.stub(this.oVariantManagement, "_getVariantSetAdapter").returns(Promise.resolve(oVariantSetAdapter));
		sinon.spy(this.oVariantManagement, "fireEvent");
		sinon.spy(oControl, "fetchVariant");

		this.oVariantManagement.initialise();
		return oWaitPromise.then(function() {
			assert.ok(bBeforeSaveCalled);
			assert.equal(sContext, "STANDARD");

			assert.ok(this.oVariantManagement._reCreateVariantEntries.calledOnce, "expecting '_reCreateVariantEntries' to be called");
			assert.ok(this.oVariantManagement.fireEvent.calledOnce); //initialise
			assert.ok(oControl.fetchVariant.called);
		}.bind(this));
	});

	QUnit.test("checking variantSave method", function(assert) {

		var oVariantInfo = {overwrite: true, def: true, key: "1"};

		var oVariant = {
				setItemValue: function(a) {

				},
				getVariantKey: function() {
					return "1";
				}
		};

		var oVariantSet = {
				getVariant: function() {
				},
				addVariant: function(a) {
				},
				setCurrentVariantKey: function(a) {
				},
				getCurrentVariantKey: function() {
				}
		};

		createControlInfo(this.oVariantManagement);

		sinon.stub(this.oVariantManagement,"_savePersonalizationContainer");
		sinon.stub(this.oVariantManagement, "setInitialSelectionKey");


		sinon.stub(oVariantSet, "getVariant").returns(oVariant);
		sinon.stub(oVariantSet, "addVariant").returns(oVariant);
		sinon.stub(oVariantSet, "setCurrentVariantKey");
		sinon.stub(oVariantSet, "getCurrentVariantKey").returns("1");
		this.oVariantManagement._oVariantSet = oVariantSet;

		var bCalled = false;
		this.oVariantManagement.attachSave(function() {bCalled = true;});

		this.oVariantManagement.fireSave(oVariantInfo);
		assert.ok(bCalled);

		assert.ok(this.oVariantManagement._savePersonalizationContainer.calledOnce);

		assert.ok(oVariantSet.setCurrentVariantKey.calledOnce);

		assert.ok(oVariantSet.getCurrentVariantKey.called === false);
		assert.ok(this.oVariantManagement.setInitialSelectionKey.called === false);

		bCalled = false;
		oVariantInfo = {key: "1", name: "NEW"};
		this.oVariantManagement.fireSave(oVariantInfo);

		assert.ok(bCalled);
		assert.ok(oVariantSet.getCurrentVariantKey.calledOnce);
		assert.ok(this.oVariantManagement.setInitialSelectionKey.calledOnce);
	});


	QUnit.test("checking fireManage method", function(assert) {

		var oVariantInfo = {renamed: [{name: "A", key: "1"}], deleted: ["1"]};

		var oVariant = {
				setVariantName: function(s) {
				},
				getVariantKey: function() {
					return "1";
				}
		};

		var oVariantSet = {
				getVariant: function() {
				},
				setCurrentVariantKey: function(a) {
				},
				getCurrentVariantKey: function() {
				},
				delVariant: function() {
				}
		};


		sinon.stub(this.oVariantManagement,"_savePersonalizationContainer");


		sinon.stub(oVariant, "setVariantName");

		sinon.stub(oVariantSet, "getVariant").returns(oVariant);
		sinon.stub(oVariantSet, "setCurrentVariantKey");
		sinon.stub(oVariantSet, "getCurrentVariantKey").returns("1");
		sinon.stub(oVariantSet, "delVariant");
		this.oVariantManagement._oVariantSet = oVariantSet;

		var bCalled = false;
		this.oVariantManagement.attachSave(function() {bCalled = true;});

		this.oVariantManagement.fireManage(oVariantInfo);

		assert.ok(!bCalled);
		assert.ok(this.oVariantManagement._savePersonalizationContainer.calledOnce);
		assert.ok(oVariant.setVariantName.calledOnce);
		assert.ok(oVariantSet.getVariant.calledTwice);
		assert.ok(oVariantSet.getCurrentVariantKey.calledOnce);
		assert.ok(oVariantSet.setCurrentVariantKey.calledOnce);
		assert.ok(oVariantSet.delVariant.calledOnce);
	});

	QUnit.test("checking fireSelect method", function(assert) {

		var oVariantInfo = {key: "1"};

		var oVariant = {
				getItemValue: function(s) { return s; }
		};

		var oVariantSet = {
				getVariant: function() {
				}
		};


		sinon.spy(this.oVariantManagement,"_applyVariant");

		sinon.stub(oVariantSet, "getVariant").returns(oVariant);

		this.oVariantManagement._oVariantSet = oVariantSet;

		this.oVariantManagement.fireSelect(oVariantInfo);

		assert.ok(this.oVariantManagement._applyVariant.calledOnce);
		assert.ok(oVariantSet.getVariant.calledOnce);
	});


	QUnit.test("checking _createVariantEntries method", function(assert) {


		var bReturnNull;
		var oVariantSetAdapter = {
				getVariantSet: function(s) {
					if (bReturnNull) {
						return null;
					} else {
						return {
							getVariant: function() { return null; }
						};
					}
				},
				addVariantSet: function() {
				}
		};

		this.oVariantManagement._oContainer = {};

		sinon.stub(this.oVariantManagement, "_getVariantSetAdapter").returns(Promise.resolve(oVariantSetAdapter));
		sinon.stub(this.oVariantManagement, "_reCreateVariantEntries");
		sinon.stub(oVariantSetAdapter, "addVariantSet");

		bReturnNull = true;
		return this.oVariantManagement._createVariantEntries(this.oVariantManagement._oContainer).then(function(oVarSet) {
			assert.ok(!this.oVariantManagement._reCreateVariantEntries.called);
			assert.ok(oVariantSetAdapter.addVariantSet.called);

			this.oVariantManagement._reCreateVariantEntries.restore();
			oVariantSetAdapter.addVariantSet.restore();

			sinon.stub(this.oVariantManagement, "_reCreateVariantEntries");
			sinon.stub(oVariantSetAdapter, "addVariantSet");

			bReturnNull = false;

			return this.oVariantManagement._createVariantEntries(this.oVariantManagement._oContainer).then(function(oVarSet) {
				assert.ok(this.oVariantManagement._reCreateVariantEntries.called);
				assert.ok(!oVariantSetAdapter.addVariantSet.called);
			}.bind(this));

		}.bind(this));
	});

	QUnit.test("checking _setSelectedVariant method", function(assert) {

		var oVariantSet = {
				getVariant: function(sKey) {
					return ({});
				}
		};

		this.oVariantManagement._oVariantSet = oVariantSet;
		sinon.stub(this.oVariantManagement,"getSelectionKey").returns("key");
		sinon.stub(this.oVariantManagement,"_applyVariant");

		this.oVariantManagement._setSelectedVariant();

		assert.ok(this.oVariantManagement._applyVariant.calledOnce);
	});


	QUnit.test("checking _reCreateVariantEntries method", function(assert) {

		var oVariantSet = {
				getVariant: function(sKey) {
					return ({});
				},
				getVariantNamesAndKeys: function() {
					var mMap = {};
					mMap["ONE"] = "1";
					mMap["TWO"] = "2";
					return mMap;
				},
				getCurrentVariantKey: function() {
					return "2";
				}
		};

		this.oVariantManagement._oVariantSet = oVariantSet;
		sinon.stub(this.oVariantManagement,"removeAllVariantItems");

		sinon.spy(this.oVariantManagement,"setDefaultVariantKey");

		this.oVariantManagement._reCreateVariantEntries();

		assert.ok(this.oVariantManagement.setDefaultVariantKey.calledOnce);

		var aItems = this.oVariantManagement.getVariantItems();
		assert.ok(aItems);
		assert.equal(aItems.length, 2);
	});

	QUnit.test("checking _readPersonalization method", function(assert) {

		sinon.stub(this.oVariantManagement, "_createVariantEntries");

		this.oVariantManagement._readPersonalization({});

		assert.ok(this.oVariantManagement._createVariantEntries.calledOnce);
	});


	QUnit.test("check getCurrentVariantId STANDARD", function(assert) {

		var sKey = this.oVariantManagement.getCurrentVariantId();
		assert.equal(sKey, "");
	});

	QUnit.test("check getCurrentVariantId not STANDARD", function(assert) {

		var oVariantSet = {
				getVariant: function(sKey) {
					return ({});
				},
				getVariantNamesAndKeys: function() {
					var mMap = {};
					mMap["ONE"] = "1";
					mMap["TWO"] = "2";
					return mMap;
				},
				getCurrentVariantKey: function() {
					return "2";
				}
		};

		this.oVariantManagement._oVariantSet = oVariantSet;
		sinon.stub(this.oVariantManagement,"removeAllVariantItems");


		this.oVariantManagement._reCreateVariantEntries();

		var sKey = this.oVariantManagement.getCurrentVariantId();
		assert.equal(sKey, "2");

		var aItems = this.oVariantManagement.getVariantItems();
		assert.ok(aItems);
		assert.equal(aItems.length, 2); // standard variant is not created in this run
	});

	QUnit.test("check setCurrentVariantId STANDARD", function(assert) {

		sinon.stub(this.oVariantManagement,"_applyVariantContent");
		sinon.stub(this.oVariantManagement,"getVariantContent").returns("STANDARD");
		var spy = sinon.spy(this.oVariantManagement, "setSelectionKey");
		spy.withArgs(this.oVariantManagement.STANDARDVARIANTKEY);

		this.oVariantManagement._oVariantSet = sinon.stub();

		this.oVariantManagement.setCurrentVariantId("");

		assert.ok(spy.withArgs(this.oVariantManagement.STANDARDVARIANTKEY).calledOnce);
		assert.ok(this.oVariantManagement._applyVariantContent.calledOnce);

	});

	QUnit.test("check setCurrentVariantId not STANDARD", function(assert) {

		var oVariantSet = {
				getVariant: function(sKey) {
					return ({});
				},
				getVariantNamesAndKeys: function() {
					var mMap = {};
					mMap["ONE"] = "1";
					mMap["TWO"] = "2";
					return mMap;
				},
				getCurrentVariantKey: function() {
					return "2";
				}
		};
		sinon.stub(this.oVariantManagement,"getVariantContent").returns("STANDARD");

		this.oVariantManagement._oVariantSet = oVariantSet;

		this.oVariantManagement._reCreateVariantEntries();

		this.oVariantManagement.setCurrentVariantId("1");
		var sKey = this.oVariantManagement.getCurrentVariantId();
		assert.equal(sKey, "1");
	});

	QUnit.test("check _setErrorValueState", function(assert) {

		assert.ok(this.oVariantManagement.getEnabled());

		this.oVariantManagement._setErrorValueState("TEXT");

		assert.ok(!this.oVariantManagement.getEnabled());

	});

	QUnit.test("check fetch basicSearch", function(assert) {

		var sResult = {};
		var oVariant = {
				setItemValue: function(sKey, sValue) {
					sResult[sKey] = sValue;
				},
				getVariantKey: function() { return null; }

		};

		this.oVariantManagement._oVariantSet = {
				getVariant: function() { return oVariant; }
		};
		this.oVariantManagement._oPersController = {
				fetchVariant: function() { return {filterBarVariant: {}, filterbar: {}, basicSearch: "TEST"}; }
		};

		sinon.stub(this.oVariantManagement, "_savePersonalizationContainer");

		var oVariantInfo = {
				def: true,
				overwrite: true,
				key: "1"
		};

		this.oVariantManagement.fireSave(oVariantInfo);

		assert.ok(sResult.basicSearch);
		assert.equal(sResult.basicSearch, "TEST");

	});

	QUnit.test("check _getContent", function(assert) {
		var sResult = {filterBarVariant: {}, filterbar: {}, basicSearch: "TEST"};

		var oVariant = {
				getItemValue: function(sKey, sValue) {
					return sResult[sKey];
				}
		};

		var oContent = this.oVariantManagement._getContent(oVariant);
		assert.ok(oContent);
		assert.ok(oContent.basicSearch);
		assert.equal(oContent.basicSearch, "TEST");
	});
});