/* global QUnit, sinon */
sap.ui.define([
	"sap/ui/comp/smartvariants/SmartVariantManagementModel",
	"sap/ui/model/BindingMode",
	"sap/ui/core/Lib",
	"sap/ui/core/library",
	"sap/base/Log",
	"./Util",
	"sap/ui/fl/apply/api/FlexRuntimeInfoAPI",
	"sap/ui/fl/apply/api/SmartVariantManagementApplyAPI",
	"sap/ui/fl/write/api/SmartVariantManagementWriteAPI"
], function(
	SmartVariantManagementModel,
	BindingMode,
	Library,
	coreLibrary,
	Log,
	Util,
	FlexRuntimeInfoAPI,
	FlexApplyAPI,
	FlexWriteAPI
) {
	"use strict";

	// shortcut for sap.ui.core.TitleLevel
	const { TitleLevel } = coreLibrary;

	const DEFAULT_CONTEXT_PATH = SmartVariantManagementModel.getDefaultContextPath();

	const DEFAULT_CONTEXT_VALUE = {
		creationAllowed: true,
		currentVariant: "",
		defaultVariant: "",
		headerLevel: TitleLevel.Auto,
		modified: false,
		showExecuteOnSelection: false,
		showFavorites: false,
		standardItemText: null,
		supportDefault: true,
		supportPublic: false,
		titleStyle: TitleLevel.Auto,
		variants: [],
		variantsEditable: true
	};

	const PROPERTIES = [
		"creationAllowed",
		"currentVariant",
		"defaultVariant",
		"headerLevel",
		"modified",
		"showExecuteOnSelection",
		"showFavorites",
		"standardItemText",
		"supportDefault",
		"supportPublic",
		"titleStyle",
		"variants",
		"variantsEditable"
	];

	QUnit.module("Constructor");

	QUnit.test("should set default properties", function(assert) {
		const oSmartVariantManagmentModel = new SmartVariantManagementModel();

		assert.equal(oSmartVariantManagmentModel.iSizeLimit, 1000, "should have a size limit of 1000");
		assert.equal(oSmartVariantManagmentModel.getDefaultBindingMode(), BindingMode.OneWay, `should have default binding mode ${BindingMode.OneWay}`);
		assert.equal(oSmartVariantManagmentModel.getContexts().length, 1, "should have 1 context");
		assert.deepEqual(oSmartVariantManagmentModel.getContexts(), [DEFAULT_CONTEXT_PATH], "should have context with default context path");
		assert.ok(oSmartVariantManagmentModel.getProperty(DEFAULT_CONTEXT_PATH), "should have a property for default context path");
		assert.equal(oSmartVariantManagmentModel._sDefaultVariantId, null, "should have no default variant id");
	});

	QUnit.module("createContext", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			this.fnSetPropertySpy = sinon.spy(this.oSmartVariantManagmentModel, "setProperty");
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
			this.fnSetPropertySpy.restore();
		}
	});

	QUnit.test("should do nothing when no contextpath provided", function(assert) {
		assert.ok(this.fnSetPropertySpy.notCalled, "should not call 'setProperty' initially");

		this.oSmartVariantManagmentModel.createContext();
		this.oSmartVariantManagmentModel.createContext(undefined, {});
		this.oSmartVariantManagmentModel.createContext(null, {});

		assert.ok(this.fnSetPropertySpy.notCalled, "should not call 'setProperty'");
	});

	QUnit.test("should do nothing when context path already exists", function(assert) {
		assert.ok(this.fnSetPropertySpy.notCalled, "should not call 'setProperty' initially");

		this.oSmartVariantManagmentModel.createContext(DEFAULT_CONTEXT_PATH);

		assert.ok(this.fnSetPropertySpy.notCalled, "should not call 'setProperty'");
	});

	QUnit.test("should do log a warning when context path doesn't start with an '/'", function(assert) {
		const sContextPath = "testContext";
		const fnWarningSpy = sinon.spy(Log, "warning");

		assert.ok(this.fnSetPropertySpy.notCalled, "should not call 'setProperty' initially");
		assert.ok(fnWarningSpy.notCalled, "should not call 'warning' initially");

		this.oSmartVariantManagmentModel.createContext(sContextPath);

		assert.ok(this.fnSetPropertySpy.notCalled, "should not call 'setProperty'");
		assert.ok(fnWarningSpy.calledOnce, "should call 'warning'");
		assert.ok(fnWarningSpy.calledWith("SmartVariantManagementModel: you've called 'createContext' with a context path that's not starting with a '/'."), "should call 'warning' with correct message");
	});

	QUnit.test("should set default properties on given context path", function(assert) {
		const sContextPath = "/testContext";

		assert.ok(this.fnSetPropertySpy.notCalled, "should not call 'setProperty' initially");

		this.oSmartVariantManagmentModel.createContext(sContextPath);

		assert.ok(this.fnSetPropertySpy.calledOnce, "should call 'setProperty'");
		assert.ok(this.fnSetPropertySpy.calledWith(sContextPath, DEFAULT_CONTEXT_VALUE), "should call 'setProperty' with correct parameters");
		assert.deepEqual(this.oSmartVariantManagmentModel.getProperty(sContextPath), DEFAULT_CONTEXT_VALUE, "should set property correctly");
	});

	QUnit.test("should set properties on given context path and value", function(assert) {
		const sContextPath = "/testContext";
		const sContextValue = {};

		assert.ok(this.fnSetPropertySpy.notCalled, "should not call 'setProperty' initially");

		this.oSmartVariantManagmentModel.createContext(sContextPath, sContextValue);

		assert.ok(this.fnSetPropertySpy.calledOnce, "should call 'setProperty'");
		assert.ok(this.fnSetPropertySpy.calledWith(sContextPath, sContextValue), "should call 'setProperty' with correct parameters");
		assert.deepEqual(this.oSmartVariantManagmentModel.getProperty(sContextPath), sContextValue, "should set property correctly");
	});

	QUnit.module("Properties", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();

			this.fnInnerGetPropertySpy = sinon.spy(this.oSmartVariantManagmentModel, "_getProperty");
			this.fnInnerSetPropertySpy = sinon.spy(this.oSmartVariantManagmentModel, "_setProperty");

			this.fnGetPropertySpy = sinon.spy(this.oSmartVariantManagmentModel, "getProperty");
			this.fnSetPropertySpy = sinon.spy(this.oSmartVariantManagmentModel, "setProperty");
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;

			this.fnInnerGetPropertySpy.restore();
			this.fnInnerSetPropertySpy.restore();

			this.fnGetPropertySpy.restore();
			this.fnSetPropertySpy.restore();
		}
	});

	QUnit.test("should provide correct default values", function(assert) {
		assert.equal(Object.entries(DEFAULT_CONTEXT_VALUE).length, PROPERTIES.length, "should have same amount of default values as properties");

		Object.entries(DEFAULT_CONTEXT_VALUE).forEach(([sKey, vValue]) => {
			assert.ok(PROPERTIES.includes(sKey), `should include '${sKey}' in properties`);
			assert.deepEqual(this.oSmartVariantManagmentModel._getProperty(sKey), vValue, `should have correct defult value for '${sKey}'`);
		});
	});

	PROPERTIES.forEach((sPropertyName) => {
		const sPropertyNameCapitalized = Util.fnCapitalizeFirstLetter(sPropertyName);
		const sGetterName = `get${sPropertyNameCapitalized}`,
			sSetterName = `set${sPropertyNameCapitalized}`;

		QUnit.test(`should create a getter function for property ${sPropertyName}`, function(assert) {
			assert.ok(this.oSmartVariantManagmentModel[sGetterName], `should have a getter function for property ${sPropertyName}`);

			assert.ok(this.fnInnerGetPropertySpy.notCalled, "should not call '_getProperty' initially");
			assert.ok(this.fnGetPropertySpy.notCalled, "should not call 'getProperty' initially");

			this.oSmartVariantManagmentModel[sGetterName]();

			assert.ok(this.fnInnerGetPropertySpy.calledOnce, "should call '_getProperty'");
			assert.ok(this.fnInnerGetPropertySpy.calledWith(sPropertyName, undefined), "should call '_getProperty' with correct parameters excluding context path");

			assert.ok(this.fnGetPropertySpy.calledOnce, "should forward call to 'getProperty'");
			assert.ok(this.fnGetPropertySpy.calledWith(`${DEFAULT_CONTEXT_PATH}/${sPropertyName}`), "should call 'getProperty' with correct property path");

			const sContextPath = "/testContextPath";
			this.oSmartVariantManagmentModel[sGetterName](sContextPath);

			assert.ok(this.fnInnerGetPropertySpy.calledTwice, "should call '_getProperty'");
			assert.ok(this.fnInnerGetPropertySpy.calledWith(sPropertyName, sContextPath), "should call '_getProperty' with correct parameters including context path");

			assert.ok(this.fnGetPropertySpy.calledTwice, "should forward call to 'getProperty'");
			assert.ok(this.fnGetPropertySpy.calledWith(`${sContextPath}/${sPropertyName}`), "should call 'getProperty' with correct property path");
		});

		QUnit.test(`should create a setter function for property ${sPropertyName}`, function(assert) {
			assert.ok(this.oSmartVariantManagmentModel[sSetterName], `should have a setter function for property ${sPropertyName}`);

			assert.ok(this.fnInnerSetPropertySpy.notCalled, "should not call '_setProperty' initially");
			assert.ok(this.fnSetPropertySpy.notCalled, "should not call 'setProperty' initially");

			this.oSmartVariantManagmentModel[sSetterName]();

			assert.ok(this.fnInnerSetPropertySpy.calledOnce, "should call '_setProperty'");
			assert.ok(this.fnInnerSetPropertySpy.calledWith(sPropertyName, undefined, undefined), "should call '_setProperty' with correct parameters excluding context path");

			assert.ok(this.fnSetPropertySpy.calledOnce, "should forward call to 'setProperty'");
			assert.ok(this.fnSetPropertySpy.calledWith(`${DEFAULT_CONTEXT_PATH}/${sPropertyName}`, undefined), "should call 'setProperty' with correct property path");

			this.oSmartVariantManagmentModel[sSetterName](null);

			assert.ok(this.fnInnerSetPropertySpy.calledTwice, "should call '_setProperty'");
			assert.ok(this.fnInnerSetPropertySpy.calledWith(sPropertyName, null, undefined), "should call '_setProperty' with correct parameters excluding context path");

			assert.ok(this.fnSetPropertySpy.calledTwice, "should forward call to 'setProperty'");
			assert.ok(this.fnSetPropertySpy.calledWith(`${DEFAULT_CONTEXT_PATH}/${sPropertyName}`, null), "should call 'setProperty' with correct property path");

			const sContextPath = "/testContextPath";
			this.oSmartVariantManagmentModel[sSetterName](null, sContextPath);

			assert.ok(this.fnInnerSetPropertySpy.calledThrice, "should call '_setProperty'");
			assert.ok(this.fnInnerSetPropertySpy.calledWith(sPropertyName, null, sContextPath), "should call '_setProperty' with correct parameters including context path");

			assert.ok(this.fnSetPropertySpy.calledThrice, "should forward call to 'setProperty'");
			assert.ok(this.fnSetPropertySpy.calledWith(`${sContextPath}/${sPropertyName}`, null), "should call 'setProperty' with correct property path");
		});
	});

	QUnit.test("_getDefaultVariantId", function(assert) {
		assert.equal(this.oSmartVariantManagmentModel._getDefaultVariantId(), "", "should return empty string when '_sDefaultVariantId' is not set");

		const sVariantId = "testId";
		this.oSmartVariantManagmentModel._sDefaultVariantId = sVariantId;
		assert.equal(this.oSmartVariantManagmentModel._getDefaultVariantId(), sVariantId, "should return correct string when '_sDefaultVariantId' is set");

		this.oSmartVariantManagmentModel._sDefaultVariantId = undefined;
		assert.equal(this.oSmartVariantManagmentModel._getDefaultVariantId(), "", "should return empty string when '_sDefaultVariantId' is not set");
	});

	QUnit.test("_setDefaultVariantId", async function(assert) {
		const fnFlexWriteAPISetDefaultVariantIdStub = sinon.stub(FlexWriteAPI, "setDefaultVariantId");

		assert.equal(this.oSmartVariantManagmentModel._getDefaultVariantId(), "", "should return empty string when '_sDefaultVariantId' is not set");
		assert.ok(fnFlexWriteAPISetDefaultVariantIdStub.notCalled, "should not call 'setDefaultVariantId' on FlexWriteAPI initially");

		const sVariantId = "testId";
		this.oSmartVariantManagmentModel._setDefaultVariantId(sVariantId);
		assert.equal(this.oSmartVariantManagmentModel._getDefaultVariantId(), sVariantId, "should return correct string when '_sDefaultVariantId' is set");
		assert.ok(fnFlexWriteAPISetDefaultVariantIdStub.notCalled, "should not call 'setDefaultVariantId' on FlexWriteAPI when no oPersoControl is provided");

		const oPersoControl = {};
		this.oSmartVariantManagmentModel._setDefaultVariantId(sVariantId, oPersoControl);
		assert.equal(this.oSmartVariantManagmentModel._getDefaultVariantId(), sVariantId, "should return correct string when '_sDefaultVariantId' is set");
		assert.ok(fnFlexWriteAPISetDefaultVariantIdStub.notCalled, "should not call 'setDefaultVariantId' on FlexWriteAPI when flex is not loaded");

		await this.oSmartVariantManagmentModel.loadFlex();

		this.oSmartVariantManagmentModel._setDefaultVariantId(sVariantId, oPersoControl);
		assert.equal(this.oSmartVariantManagmentModel._getDefaultVariantId(), sVariantId, "should return correct string when '_sDefaultVariantId' is set");
		assert.ok(fnFlexWriteAPISetDefaultVariantIdStub.calledOnce, "should call 'setDefaultVariantId' on FlexWriteAPI");
		assert.ok(fnFlexWriteAPISetDefaultVariantIdStub.calledWith({
			control: oPersoControl,
			defaultVariantId: sVariantId
		}), "should call 'setDefaultVariantId' on FlexWriteAPI with correct parameters");

		fnFlexWriteAPISetDefaultVariantIdStub.restore();
	});

	QUnit.module("prepareVariantsForTitleBindings", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
		}
	});

	QUnit.test("should do nothing when 'mViewsToCheck' provided", function(assert) {
		const mViewsToCheck = [];
		assert.deepEqual(this.oSmartVariantManagmentModel.prepareVariantsForTitleBindings(undefined, mViewsToCheck), mViewsToCheck, "should return given 'mViewsToCheck' when provided");
	});

	QUnit.test("should return a map of variants that have a title property and match a given Regex", function(assert) {
		const fnGetVariantsStub = sinon.stub(this.oSmartVariantManagmentModel, "getVariants");

		const sResourceKey_1 = "TextKey",
			sResourceModel_1 = "i18n",
			sResourceKey_2 = "TextKey",
			sResourceModel_2 = "$sVM";

		const sTitle_1 = `{${sResourceModel_1}>${sResourceKey_1}}`,
			sTitle_2 = `{${sResourceModel_2}>${sResourceKey_2}}`,
			sTitle_3 = undefined;

		fnGetVariantsStub.returns([
			{
				key: "key_1",
				title: sTitle_1
			},
			{
				key: "key_2",
				title: sTitle_2
			},
			{
				key: "key_3",
				title: sTitle_3
			}
		]);
		const sContextPath = "/testPath";

		assert.ok(fnGetVariantsStub.notCalled, "should not call 'getVariants' initially");

		const mReturnedViewsToCheck = this.oSmartVariantManagmentModel.prepareVariantsForTitleBindings(sContextPath);
		assert.ok(fnGetVariantsStub.calledOnce, "should call 'getVariants'");
		assert.ok(fnGetVariantsStub.calledWith(sContextPath), "should call 'getVariants' with correct context path");

		assert.equal(mReturnedViewsToCheck.length, 1, "should only return one view");
		assert.equal(mReturnedViewsToCheck[0].key, "key_1", "should return correct key");
		assert.equal(mReturnedViewsToCheck[0].sResourceKey, sResourceKey_1, "should return correct resource key");
		assert.equal(mReturnedViewsToCheck[0].sResourceModel, sResourceModel_1, "should return correct resource model");
	});

	QUnit.module("updateVariant", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();

			this.fnGetVariantsStub = sinon.stub(this.oSmartVariantManagmentModel, "getVariants");
			this.fnFindVariantIndexStub = sinon.stub(this.oSmartVariantManagmentModel, "findVariantIndex");
			this.fnGetIdxSortedStub = sinon.stub(this.oSmartVariantManagmentModel, "getIdxSorted");
			this.fnSetVariantsStub = sinon.stub(this.oSmartVariantManagmentModel, "setVariants");
			this.fnCheckUpdate = sinon.stub(this.oSmartVariantManagmentModel, "checkUpdate");

			this.fnVariantGetVariantIdStub = sinon.stub();
			this.fnVariantGetExecuteOnSelectionStub = sinon.stub();
			this.fnVariantGetFavoriteStub = sinon.stub();
			this.fnVariantGetTextStub = sinon.stub();
			this.fnVariantGetContextsStub = sinon.stub();

			this.oVariant = {
				getVariantId: this.fnVariantGetVariantIdStub,
				getExecuteOnSelection: this.fnVariantGetExecuteOnSelectionStub,
				getFavorite: this.fnVariantGetFavoriteStub,
				getText: this.fnVariantGetTextStub
			};
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;

			this.fnGetVariantsStub.restore();
			this.fnFindVariantIndexStub.restore();
			this.fnGetIdxSortedStub.restore();
			this.fnSetVariantsStub.restore();
			this.fnCheckUpdate.reset();

			this.fnVariantGetVariantIdStub.reset();
			this.fnVariantGetVariantIdStub = undefined;
			this.fnVariantGetExecuteOnSelectionStub.reset();
			this.fnVariantGetExecuteOnSelectionStub = undefined;
			this.fnVariantGetFavoriteStub.reset();
			this.fnVariantGetFavoriteStub = undefined;
			this.fnVariantGetTextStub.reset();
			this.fnVariantGetTextStub = undefined;
			this.fnVariantGetContextsStub.reset();
			this.fnVariantGetContextsStub = undefined;

			this.oVariant = undefined;
		}
	});

	const fnCheckInitialState = function(assert) {
		assert.ok(this.fnGetVariantsStub.notCalled, "should not call 'getVariants' initially");
		assert.ok(this.fnFindVariantIndexStub.notCalled, "should not call 'findVariantIndex' initially");
		assert.ok(this.fnGetIdxSortedStub.notCalled, "should not call 'getIdxSorted' initially");
		assert.ok(this.fnSetVariantsStub.notCalled, "should not call 'setVariants' initially");
		assert.ok(this.fnCheckUpdate.notCalled, "should not call 'checkUpdate' initially");

		assert.ok(this.fnVariantGetVariantIdStub.notCalled, "should not call 'getVariantId' on oVariant initially");
		assert.ok(this.fnVariantGetExecuteOnSelectionStub.notCalled, "should not call 'getExecuteOnSelection' on oVariant initially");
		assert.ok(this.fnVariantGetFavoriteStub.notCalled, "should not call 'getFavorite' on oVariant initially");
		assert.ok(this.fnVariantGetTextStub.notCalled, "should not call 'getText' on oVariant initially");
		assert.ok(this.fnVariantGetContextsStub.notCalled, "should not call 'getContexts' on oVariant initially");
	};

	QUnit.test("should do nothing when no variant provided", function(assert) {
		fnCheckInitialState.call(this, assert);

		this.oSmartVariantManagmentModel.updateVariant();

		assert.ok(this.fnGetVariantsStub.notCalled, "should not call 'getVariants'");
		assert.ok(this.fnFindVariantIndexStub.notCalled, "should not call 'findVariantIndex'");
		assert.ok(this.fnGetIdxSortedStub.notCalled, "should not call 'getIdxSorted'");
		assert.ok(this.fnSetVariantsStub.notCalled, "should not call 'setVariants'");
		assert.ok(this.fnCheckUpdate.notCalled, "should not call 'checkUpdate'");

		assert.ok(this.fnVariantGetVariantIdStub.notCalled, "should not call 'getVariantId' on oVariant");
		assert.ok(this.fnVariantGetExecuteOnSelectionStub.notCalled, "should not call 'getExecuteOnSelection' on oVariant");
		assert.ok(this.fnVariantGetFavoriteStub.notCalled, "should not call 'getFavorite' on oVariant");
		assert.ok(this.fnVariantGetTextStub.notCalled, "should not call 'getText' on oVariant");
		assert.ok(this.fnVariantGetContextsStub.notCalled, "should not call 'getContexts' on oVariant");
	});

	QUnit.test("should not update variant when variant can't be found by index", function(assert) {
		fnCheckInitialState.call(this, assert);

		const sVariantId = "variant_id";

		this.fnVariantGetVariantIdStub.returns(sVariantId);
		this.fnFindVariantIndexStub.withArgs(sVariantId).returns(-1);

		this.oSmartVariantManagmentModel.updateVariant(this.oVariant);

		assert.ok(this.fnGetVariantsStub.calledOnce, "should call 'getVariants'");
		assert.ok(this.fnFindVariantIndexStub.calledOnce, "should call 'findVariantIndex'");
		assert.ok(this.fnGetIdxSortedStub.notCalled, "should not call 'getIdxSorted'");
		assert.ok(this.fnSetVariantsStub.notCalled, "should not call 'setVariants'");
		assert.ok(this.fnCheckUpdate.notCalled, "should not call 'checkUpdate'");

		assert.ok(this.fnVariantGetVariantIdStub.calledOnce, "should call 'getVariantId' on oVariant");
		assert.ok(this.fnVariantGetExecuteOnSelectionStub.notCalled, "should not call 'getExecuteOnSelection' on oVariant");
		assert.ok(this.fnVariantGetFavoriteStub.notCalled, "should not call 'getFavorite' on oVariant");
		assert.ok(this.fnVariantGetTextStub.notCalled, "should not call 'getText' on oVariant");
		assert.ok(this.fnVariantGetContextsStub.notCalled, "should not call 'getContexts' on oVariant");
	});

	QUnit.test("should update variants executeOnSelect + favorite", function(assert) {
		fnCheckInitialState.call(this, assert);

		const sVariantId = "variant_id";
		const bExecuteOnSelection = true;
		const bFavorite = true;

		this.fnGetVariantsStub.returns([
			this.oVariant,
			{}
		]);
		this.fnVariantGetVariantIdStub.returns(sVariantId);
		this.fnFindVariantIndexStub.withArgs(sVariantId).returns(0);
		this.fnVariantGetExecuteOnSelectionStub.returns(bExecuteOnSelection);
		this.fnVariantGetFavoriteStub.returns(bFavorite);

		this.oSmartVariantManagmentModel.updateVariant(this.oVariant);

		assert.ok(this.fnGetVariantsStub.calledOnce, "should call 'getVariants'");
		assert.ok(this.fnFindVariantIndexStub.calledOnce, "should call 'findVariantIndex'");
		assert.ok(this.fnGetIdxSortedStub.notCalled, "should not call 'getIdxSorted'");
		assert.ok(this.fnSetVariantsStub.calledOnce, "should call 'setVariants'");
		assert.ok(this.fnSetVariantsStub.calledWith([
			{
				...this.oVariant,
				executeOnSelect: bExecuteOnSelection,
				originalExecuteOnSelect: bExecuteOnSelection,
				favorite: bFavorite,
				originalFavorite: bFavorite
			},
			{}
		]), "should call 'setVariants' with correct parameters");
		assert.ok(this.fnCheckUpdate.calledOnce, "should call 'checkUpdate'");

		assert.ok(this.fnVariantGetVariantIdStub.calledOnce, "should call 'getVariantId' on oVariant");
		assert.ok(this.fnVariantGetExecuteOnSelectionStub.calledTwice, "should call 'getExecuteOnSelection' on oVariant");
		assert.ok(this.fnVariantGetFavoriteStub.calledTwice, "should call 'getFavorite' on oVariant");
		assert.ok(this.fnVariantGetTextStub.calledOnce, "should call 'getText' on oVariant");
		assert.ok(this.fnVariantGetContextsStub.notCalled, "should not call 'getContexts' on oVariant");
	});

	QUnit.test("should update variants contexts", function(assert) {
		fnCheckInitialState.call(this, assert);

		const sVariantId = "variant_id";
		const bExecuteOnSelection = true;
		const bFavorite = true;
		const aContexts = [
			"contextA", "contextB"
		];

		this.oVariant.getContexts = this.fnVariantGetContextsStub;

		this.fnGetVariantsStub.returns([
			this.oVariant,
			{}
		]);
		this.fnVariantGetVariantIdStub.returns(sVariantId);
		this.fnFindVariantIndexStub.withArgs(sVariantId).returns(0);
		this.fnVariantGetExecuteOnSelectionStub.returns(bExecuteOnSelection);
		this.fnVariantGetFavoriteStub.returns(bFavorite);
		this.fnVariantGetContextsStub.returns(aContexts);

		this.oSmartVariantManagmentModel.updateVariant(this.oVariant);

		assert.ok(this.fnGetVariantsStub.calledOnce, "should call 'getVariants'");
		assert.ok(this.fnFindVariantIndexStub.calledOnce, "should call 'findVariantIndex'");
		assert.ok(this.fnGetIdxSortedStub.notCalled, "should not call 'getIdxSorted'");
		assert.ok(this.fnSetVariantsStub.calledOnce, "should call 'setVariants'");
		assert.ok(this.fnSetVariantsStub.calledWith([
			{
				...this.oVariant,
				executeOnSelect: bExecuteOnSelection,
				originalExecuteOnSelect: bExecuteOnSelection,
				favorite: bFavorite,
				originalFavorite: bFavorite,
				contexts: aContexts,
				originalContexts: aContexts
			},
			{}
		]), "should call 'setVariants' with correct parameters");
		assert.ok(this.fnCheckUpdate.calledOnce, "should call 'checkUpdate'");

		assert.ok(this.fnVariantGetVariantIdStub.calledOnce, "should call 'getVariantId' on oVariant");
		assert.ok(this.fnVariantGetExecuteOnSelectionStub.calledTwice, "should call 'getExecuteOnSelection' on oVariant");
		assert.ok(this.fnVariantGetFavoriteStub.calledTwice, "should call 'getFavorite' on oVariant");
		assert.ok(this.fnVariantGetTextStub.calledOnce, "should call 'getText' on oVariant");
		assert.ok(this.fnVariantGetContextsStub.calledTwice, "should call 'getContexts' on oVariant");
	});

	QUnit.test("should update variants title", function(assert) {
		fnCheckInitialState.call(this, assert);

		const sVariantId = "variant_id";
		const bExecuteOnSelection = true;
		const bFavorite = true;
		const sTitle = "title text";

		this.fnGetVariantsStub.returns([
			this.oVariant,
			{}
		]);
		this.fnVariantGetVariantIdStub.returns(sVariantId);
		this.fnFindVariantIndexStub.withArgs(sVariantId).returns(0);
		this.fnVariantGetExecuteOnSelectionStub.returns(bExecuteOnSelection);
		this.fnVariantGetFavoriteStub.returns(bFavorite);
		this.fnVariantGetTextStub.withArgs("variantName").returns(sTitle);
		this.fnGetIdxSortedStub.withArgs(sTitle).returns(0);

		this.oSmartVariantManagmentModel.updateVariant(this.oVariant);

		assert.ok(this.fnGetVariantsStub.calledOnce, "should call 'getVariants'");
		assert.ok(this.fnFindVariantIndexStub.calledOnce, "should call 'findVariantIndex'");
		assert.ok(this.fnGetIdxSortedStub.calledOnce, "should call 'getIdxSorted'");
		assert.ok(this.fnSetVariantsStub.calledOnce, "should call 'setVariants'");
		assert.ok(this.fnSetVariantsStub.calledWith([
			{
				...this.oVariant,
				executeOnSelect: bExecuteOnSelection,
				originalExecuteOnSelect: bExecuteOnSelection,
				favorite: bFavorite,
				originalFavorite: bFavorite,
				title: sTitle,
				originalTitle: sTitle
			},
			{}
		]), "should call 'setVariants' with correct parameters");
		assert.ok(this.fnCheckUpdate.calledOnce, "should call 'checkUpdate'");

		assert.ok(this.fnVariantGetVariantIdStub.calledOnce, "should call 'getVariantId' on oVariant");
		assert.ok(this.fnVariantGetExecuteOnSelectionStub.calledTwice, "should call 'getExecuteOnSelection' on oVariant");
		assert.ok(this.fnVariantGetFavoriteStub.calledTwice, "should call 'getFavorite' on oVariant");
		assert.ok(this.fnVariantGetTextStub.calledOnce, "should call 'getText' on oVariant");
		assert.ok(this.fnVariantGetContextsStub.notCalled, "should not call 'getContexts' on oVariant");
	});

	QUnit.test("should update variants title + reorder", function(assert) {
		fnCheckInitialState.call(this, assert);

		const sVariantId = "variant_id";
		const bExecuteOnSelection = true;
		const bFavorite = true;
		const sTitle = "title text";

		this.fnGetVariantsStub.returns([
			this.oVariant,
			{}
		]);
		this.fnVariantGetVariantIdStub.returns(sVariantId);
		this.fnFindVariantIndexStub.withArgs(sVariantId).returns(0);
		this.fnVariantGetExecuteOnSelectionStub.returns(bExecuteOnSelection);
		this.fnVariantGetFavoriteStub.returns(bFavorite);
		this.fnVariantGetTextStub.withArgs("variantName").returns(sTitle);
		this.fnGetIdxSortedStub.withArgs(sTitle).returns(1);

		this.oSmartVariantManagmentModel.updateVariant(this.oVariant);

		assert.ok(this.fnGetVariantsStub.calledOnce, "should call 'getVariants'");
		assert.ok(this.fnFindVariantIndexStub.calledOnce, "should call 'findVariantIndex'");
		assert.ok(this.fnGetIdxSortedStub.calledOnce, "should call 'getIdxSorted'");
		assert.ok(this.fnSetVariantsStub.calledOnce, "should call 'setVariants'");
		assert.ok(this.fnSetVariantsStub.calledWith([
			{},
			{
				...this.oVariant,
				executeOnSelect: bExecuteOnSelection,
				originalExecuteOnSelect: bExecuteOnSelection,
				favorite: bFavorite,
				originalFavorite: bFavorite,
				title: sTitle,
				originalTitle: sTitle
			}
		]), "should call 'setVariants' with correct parameters");
		assert.ok(this.fnCheckUpdate.calledOnce, "should call 'checkUpdate'");

		assert.ok(this.fnVariantGetVariantIdStub.calledOnce, "should call 'getVariantId' on oVariant");
		assert.ok(this.fnVariantGetExecuteOnSelectionStub.calledTwice, "should call 'getExecuteOnSelection' on oVariant");
		assert.ok(this.fnVariantGetFavoriteStub.calledTwice, "should call 'getFavorite' on oVariant");
		assert.ok(this.fnVariantGetTextStub.calledOnce, "should call 'getText' on oVariant");
		assert.ok(this.fnVariantGetContextsStub.notCalled, "should not call 'getContexts' on oVariant");
	});

	QUnit.module("reorderVariants", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			this.fnGetIdxSortedSpy = sinon.spy(this.oSmartVariantManagmentModel, "getIdxSorted");
			this.fnGetVariantsStub = sinon.stub(this.oSmartVariantManagmentModel, "getVariants");
			this.fnSetVariantsStub = sinon.stub(this.oSmartVariantManagmentModel, "setVariants");
			this.fnFindVariantIndexSpy = sinon.spy(this.oSmartVariantManagmentModel, "findVariantIndex");
			this.aVariants = [
				{
					key: "key_0",
					title: "title_0"
				},
				{
					key: "key_1",
					title: "title_1"
				},
				{
					key: "key_2",
					title: "title_2"
				}
			];
			this.fnVariantsSpliceSpy = sinon.spy(this.aVariants, "splice");
			this.fnGetVariantsStub.returns(this.aVariants);
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
			this.aVariants = undefined;
			this.fnGetIdxSortedSpy.restore();
			this.fnVariantsSpliceSpy.restore();
			this.fnGetVariantsStub.restore();
			this.fnSetVariantsStub.restore();
			this.fnFindVariantIndexSpy.restore();
		}
	});

	QUnit.test("should update 'title' property when key is of standard variant and nFromIndex = -1", function(assert) {
		assert.ok(this.fnGetVariantsStub.notCalled, "should not call 'getVariants' initially");
		assert.ok(this.fnSetVariantsStub.notCalled, "should not call 'setVariants' initially");
		assert.ok(this.fnFindVariantIndexSpy.notCalled, "should not call 'findVariantIndex' initially");
		assert.ok(this.fnGetIdxSortedSpy.notCalled, "should not call 'getIdxSorted' initially");
		assert.ok(this.fnVariantsSpliceSpy.notCalled, "should not call 'splice' initially");

		const sKey = "key_0",
			sTitle = "new_title",
			nFromIndex = -1;

		this.oSmartVariantManagmentModel.reorderVariants(sKey, sTitle, nFromIndex);

		assert.ok(this.fnGetVariantsStub.calledTwice, "should call 'getVariants'"); // called twice as it's also called in findVariantIndex
		assert.ok(this.fnSetVariantsStub.calledOnce, "should call 'setVariants'");
		assert.ok(this.fnSetVariantsStub.calledWith([
			{
				key: "key_0",
				title: sTitle
			},
			{
				key: "key_1",
				title: "title_1"
			},
			{
				key: "key_2",
				title: "title_2"
			}
		]), "should call 'setVariants' with correct parameters");
		assert.ok(this.fnFindVariantIndexSpy.calledOnce, "should call 'findVariantIndex'");
		assert.ok(this.fnFindVariantIndexSpy.calledWith(sKey, nFromIndex), "should call 'findVariantIndex' with correct parameters");
		assert.ok(this.fnGetIdxSortedSpy.notCalled, "should not call 'getIdxSorted'");
		assert.ok(this.fnVariantsSpliceSpy.notCalled, "should not call 'splice'");
	});

	QUnit.test("should update variants when new title is not the title of a variant", function(assert) {
		assert.ok(this.fnGetVariantsStub.notCalled, "should not call 'getVariants' initially");
		assert.ok(this.fnSetVariantsStub.notCalled, "should not call 'setVariants' initially");
		assert.ok(this.fnFindVariantIndexSpy.notCalled, "should not call 'findVariantIndex' initially");
		assert.ok(this.fnGetIdxSortedSpy.notCalled, "should not call 'getIdxSorted' initially");
		assert.ok(this.fnVariantsSpliceSpy.notCalled, "should not call 'splice' initially");

		const sKey = "key_1",
			sTitle = "new_title",
			nFromIndex = 0;

		this.oSmartVariantManagmentModel.reorderVariants(sKey, sTitle);
		assert.ok(this.fnGetVariantsStub.calledThrice, "should call 'getVariants'"); // called twice as it's also called in findVariantIndex + getIdxSorted
		assert.ok(this.fnSetVariantsStub.calledOnce, "should call 'setVariants'");
		assert.ok(this.fnSetVariantsStub.calledWith([
			{
				key: "key_0",
				title: "title_0"
			},
			{
				key: "key_1",
				title: sTitle
			},
			{
				key: "key_2",
				title: "title_2"
			}
		]), "should call 'setVariants' with correct parameters");
		assert.ok(this.fnFindVariantIndexSpy.calledOnce, "should call 'findVariantIndex'");
		assert.ok(this.fnFindVariantIndexSpy.calledWith(sKey, nFromIndex), "should call 'findVariantIndex' with correct parameters");
		assert.ok(this.fnGetIdxSortedSpy.calledOnce, "should call 'getIdxSorted'");
		assert.ok(this.fnGetIdxSortedSpy.calledWith(sTitle), "should call 'getIdxSorted' with correct parameters");
		assert.ok(this.fnVariantsSpliceSpy.calledTwice, "should call 'splice'");
	});

	QUnit.test("should reorder variants when new title is the title of a variant", function(assert) {
		assert.ok(this.fnGetVariantsStub.notCalled, "should not call 'getVariants' initially");
		assert.ok(this.fnSetVariantsStub.notCalled, "should not call 'setVariants' initially");
		assert.ok(this.fnFindVariantIndexSpy.notCalled, "should not call 'findVariantIndex' initially");
		assert.ok(this.fnGetIdxSortedSpy.notCalled, "should not call 'getIdxSorted' initially");
		assert.ok(this.fnVariantsSpliceSpy.notCalled, "should not call 'splice' initially");

		const sKey = "key_1",
			sTitle = "title_2",
			nFromIndex = 0;

		this.oSmartVariantManagmentModel.reorderVariants(sKey, sTitle);
		assert.ok(this.fnGetVariantsStub.calledThrice, "should call 'getVariants'"); // called twice as it's also called in findVariantIndex + getIdxSorted
		assert.ok(this.fnSetVariantsStub.calledOnce, "should call 'setVariants'");
		assert.ok(this.fnSetVariantsStub.calledWith([
			{
				key: "key_0",
				title: "title_0"
			},
			{
				key: "key_2",
				title: "title_2"
			},
			{
				key: "key_1",
				title: sTitle
			}
		]), "should call 'setVariants' with correct parameters");
		assert.ok(this.fnFindVariantIndexSpy.calledOnce, "should call 'findVariantIndex'");
		assert.ok(this.fnFindVariantIndexSpy.calledWith(sKey, nFromIndex), "should call 'findVariantIndex' with correct parameters");
		assert.ok(this.fnGetIdxSortedSpy.calledOnce, "should call 'getIdxSorted'");
		assert.ok(this.fnGetIdxSortedSpy.calledWith(sTitle), "should call 'getIdxSorted' with correct parameters");
		assert.ok(this.fnVariantsSpliceSpy.calledTwice, "should call 'splice'");
	});

	QUnit.module("getIdxSorted", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			this.fnGetVariantsStub = sinon.stub(this.oSmartVariantManagmentModel, "getVariants");
			this.aVariants = [
				{
					title: "title_0"
				},
				{
					title: "title_1"
				},
				{
					title: "title_2"
				}
			];
			this.fnFindIndexSpy = sinon.spy(this.aVariants, "findIndex");
			this.fnGetVariantsStub.returns(this.aVariants);
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
			this.aVariants = undefined;
			this.fnFindIndexSpy.restore();
			this.fnGetVariantsStub.restore();
		}
	});

	QUnit.test("should return amount of variants if title can't be found in variants", function(assert) {
		assert.ok(this.fnGetVariantsStub.notCalled, "should not call 'getVariants' initially");
		assert.ok(this.fnFindIndexSpy.notCalled, "should not call 'findIndex' initially");

		assert.equal(this.oSmartVariantManagmentModel.getIdxSorted("title_3"), 3, "should return 2");
		assert.ok(this.fnGetVariantsStub.calledOnce, "should call 'getVariants'");
		assert.ok(this.fnFindIndexSpy.calledOnce, "should call 'findIndex'");
	});

	QUnit.test("should return index of variant if title can be found in variants", function(assert) {
		assert.ok(this.fnGetVariantsStub.notCalled, "should not call 'getVariants' initially");
		assert.ok(this.fnFindIndexSpy.notCalled, "should not call 'findIndex' initially");

		assert.equal(this.oSmartVariantManagmentModel.getIdxSorted("title_0"), 1, "should return 1");
		assert.ok(this.fnGetVariantsStub.calledOnce, "should call 'getVariants'");
		assert.ok(this.fnFindIndexSpy.calledOnce, "should call 'findIndex'");
	});

	QUnit.test("should return index of variant if title can be found in variants", function(assert) {
		assert.ok(this.fnGetVariantsStub.notCalled, "should not call 'getVariants' initially");
		assert.ok(this.fnFindIndexSpy.notCalled, "should not call 'findIndex' initially");

		assert.equal(this.oSmartVariantManagmentModel.getIdxSorted("title_1"), 2, "should return 2");
		assert.ok(this.fnGetVariantsStub.calledOnce, "should call 'getVariants'");
		assert.ok(this.fnFindIndexSpy.calledOnce, "should call 'findIndex'");
	});

	QUnit.module("removeVariant", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			this.fnGetVariantsStub = sinon.stub(this.oSmartVariantManagmentModel, "getVariants");
			this.fnSetVariantsStub = sinon.stub(this.oSmartVariantManagmentModel, "setVariants");
			this.fnFindVariantIndexSpy = sinon.spy(this.oSmartVariantManagmentModel, "findVariantIndex");
			this.aVariants = [
				{
					key: "key_0"
				},
				{
					key: "key_1"
				}
			];
			this.fnVariantsSpliceSpy = sinon.spy(this.aVariants, "splice");
			this.fnGetVariantsStub.returns(this.aVariants);
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
			this.aVariants = undefined;
			this.fnVariantsSpliceSpy.restore();
			this.fnGetVariantsStub.restore();
			this.fnSetVariantsStub.restore();
			this.fnFindVariantIndexSpy.restore();
		}
	});

	QUnit.test("should do nothing when variant index is -1", function(assert) {
		assert.ok(this.fnGetVariantsStub.notCalled, "should not call 'getVariants' initially");
		assert.ok(this.fnSetVariantsStub.notCalled, "should not call 'setVariants' initially");
		assert.ok(this.fnFindVariantIndexSpy.notCalled, "should not call 'findVariantIndex' initially");
		assert.ok(this.fnVariantsSpliceSpy.notCalled, "should not call 'splice' initially");

		const sKey = "key_0";
		this.oSmartVariantManagmentModel.removeVariant(sKey);

		assert.ok(this.fnGetVariantsStub.calledTwice, "should call 'getVariants'"); // called twice as it's also called in findVariantIndex
		assert.ok(this.fnSetVariantsStub.notCalled, "should not call 'setVariants'");
		assert.ok(this.fnFindVariantIndexSpy.calledOnce, "should call 'findVariantIndex'");
		assert.ok(this.fnFindVariantIndexSpy.calledWith(sKey), "should call 'findVariantIndex' with correct parameters");
		assert.ok(this.fnVariantsSpliceSpy.notCalled, "should not call 'splice'");
	});

	QUnit.test("should remove variant when variant index is not -1", function(assert) {
		assert.ok(this.fnGetVariantsStub.notCalled, "should not call 'getVariants' initially");
		assert.ok(this.fnSetVariantsStub.notCalled, "should not call 'setVariants' initially");
		assert.ok(this.fnFindVariantIndexSpy.notCalled, "should not call 'findVariantIndex' initially");
		assert.ok(this.fnVariantsSpliceSpy.notCalled, "should not call 'splice' initially");

		const sKey = "key_1";
		this.oSmartVariantManagmentModel.removeVariant(sKey);

		assert.ok(this.fnGetVariantsStub.calledTwice, "should call 'getVariants'"); // called twice as it's also called in findVariantIndex
		assert.ok(this.fnSetVariantsStub.calledOnce, "should call 'setVariants'");
		assert.ok(this.fnSetVariantsStub.calledWith([
			{
				key: "key_0"
			}
		]), "should call 'setVariants' with correct parameters");
		assert.ok(this.fnFindVariantIndexSpy.calledOnce, "should call 'findVariantIndex'");
		assert.ok(this.fnFindVariantIndexSpy.calledWith(sKey), "should call 'findVariantIndex' with correct parameters");
		assert.ok(this.fnVariantsSpliceSpy.calledOnce, "should call 'splice'");
	});

	QUnit.module("updateView", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			this.fnGetVariantsStub = sinon.stub(this.oSmartVariantManagmentModel, "getVariants");
			this.fnSetVariantsStub = sinon.stub(this.oSmartVariantManagmentModel, "setVariants");
			this.fnFindVariantIndexSpy = sinon.spy(this.oSmartVariantManagmentModel, "findVariantIndex");
			this.aVariants = [
				{
					key: "key_0"
				},
				{
					key: "key_1"
				}
			];
			this.fnGetVariantsStub.returns(this.aVariants);
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
			this.aVariants = undefined;
			this.fnGetVariantsStub.restore();
			this.fnSetVariantsStub.restore();
			this.fnFindVariantIndexSpy.restore();
		}
	});

	QUnit.test("should update property when variant index is 0", function(assert) {
		assert.ok(this.fnGetVariantsStub.notCalled, "should not call 'getVariants' initially");
		assert.ok(this.fnSetVariantsStub.notCalled, "should not call 'setVariants' initially");
		assert.ok(this.fnFindVariantIndexSpy.notCalled, "should not call 'findVariantIndex' initially");

		const sKey = "key_0";
		const sPropertyName = "property";
		const vPropertyValue = {};
		this.oSmartVariantManagmentModel.updateView(sKey, sPropertyName, vPropertyValue);

		assert.ok(this.fnGetVariantsStub.calledTwice, "should call 'getVariants'"); // called twice as it's also called in findVariantIndex
		assert.ok(this.fnSetVariantsStub.calledOnce, "should call 'setVariants'");
		assert.ok(this.fnSetVariantsStub.calledWith([
			{
				key: "key_0",
				property: vPropertyValue
			},
			{
				key: "key_1"
			}
		]), "should call 'setVariants' with correct parameters");
		assert.ok(this.fnFindVariantIndexSpy.calledOnce, "should call 'findVariantIndex'");
		assert.ok(this.fnFindVariantIndexSpy.calledWith(sKey, -1), "should call 'findVariantIndex' with correct parameters");
	});

	QUnit.test("should update property when variant index is not 0", function(assert) {
		assert.ok(this.fnGetVariantsStub.notCalled, "should not call 'getVariants' initially");
		assert.ok(this.fnSetVariantsStub.notCalled, "should not call 'setVariants' initially");
		assert.ok(this.fnFindVariantIndexSpy.notCalled, "should not call 'findVariantIndex' initially");

		const sKey = "key_1";
		const sPropertyName = "property";
		const vPropertyValue = {};
		this.oSmartVariantManagmentModel.updateView(sKey, sPropertyName, vPropertyValue);

		assert.ok(this.fnGetVariantsStub.calledTwice, "should call 'getVariants'"); // called twice as it's also called in findVariantIndex
		assert.ok(this.fnSetVariantsStub.calledOnce, "should call 'setVariants'");
		assert.ok(this.fnSetVariantsStub.calledWith([
			{
				key: "key_0"
			},
			{
				key: "key_1",
				property: vPropertyValue
			}
		]), "should call 'setVariants' with correct parameters");
		assert.ok(this.fnFindVariantIndexSpy.calledOnce, "should call 'findVariantIndex'");
		assert.ok(this.fnFindVariantIndexSpy.calledWith(sKey, -1), "should call 'findVariantIndex' with correct parameters");
	});

	QUnit.module("findVariantIndex", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			this.fnGetVariantsStub = sinon.stub(this.oSmartVariantManagmentModel, "getVariants");
			this.aVariants = [
				{
					key: "key_0"
				},
				{
					key: "key_1"
				}
			];
			this.fnFindIndexSpy = sinon.spy(this.aVariants, "findIndex");
			this.fnGetVariantsStub.returns(this.aVariants);
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
			this.aVariants = undefined;
			this.fnGetVariantsStub.restore();
			this.fnFindIndexSpy.restore();
		}
	});

	QUnit.test("should use default nFromIndex = 0 to skip first variant", function(assert) {
		assert.ok(this.fnGetVariantsStub.notCalled, "should not call 'getVariants' initially");
		assert.ok(this.fnFindIndexSpy.notCalled, "should not call 'findIndex' initially");

		assert.equal(this.oSmartVariantManagmentModel.findVariantIndex("key_0"), -1, "should return -1 as the searched key has index 0");
		assert.ok(this.fnGetVariantsStub.calledOnce, "should call 'getVariants'");
		assert.ok(this.fnFindIndexSpy.calledOnce, "should call 'findIndex'");

		assert.equal(this.oSmartVariantManagmentModel.findVariantIndex("key_1"), 1, "should return 1 as the searched key has index 1");
		assert.ok(this.fnGetVariantsStub.calledTwice, "should call 'getVariants'");
		assert.ok(this.fnFindIndexSpy.calledTwice, "should call 'findIndex'");
	});

	QUnit.test("should use given nFromIndex", function(assert) {
		assert.ok(this.fnGetVariantsStub.notCalled, "should not call 'getVariants' initially");

		assert.equal(this.oSmartVariantManagmentModel.findVariantIndex("key_0", -1), 0, "should return 0 as the searched key has index 0");
		assert.ok(this.fnGetVariantsStub.calledOnce, "should call 'getVariants'");
		assert.ok(this.fnFindIndexSpy.calledOnce, "should call 'findIndex'");

		assert.equal(this.oSmartVariantManagmentModel.findVariantIndex("key_1", 1), -1, "should return -1 as the searched key has index 1 but nFromIndex is 1 aswelll");
		assert.ok(this.fnGetVariantsStub.calledTwice, "should call 'getVariants'");
		assert.ok(this.fnFindIndexSpy.calledTwice, "should call 'findIndex'");
	});

	QUnit.module("retrieveDataFromFlex", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			this.fnRetrieveDataFromFlexSpy = sinon.spy(this.oSmartVariantManagmentModel, "retrieveDataFromFlex");
			this.fnFlexWriteAPIIsVariantSharingEnabledStub = sinon.stub(FlexWriteAPI, "isVariantSharingEnabled");
			this.fnFlexWriteAPIIsVariantPersonalizationEnabledStub = sinon.stub(FlexWriteAPI, "isVariantPersonalizationEnabled");
			this.fnFlexWriteAPIIsVariantAdaptationEnabedStub = sinon.stub(FlexWriteAPI, "isVariantAdaptationEnabled");
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
			this.fnRetrieveDataFromFlexSpy.restore();
			this.fnFlexWriteAPIIsVariantSharingEnabledStub.restore();
			this.fnFlexWriteAPIIsVariantPersonalizationEnabledStub.restore();
			this.fnFlexWriteAPIIsVariantAdaptationEnabedStub.restore();
		}
	});

	QUnit.test("should throw an error if FlexWriteAPI is not loaded", function(assert) {
		if (this.oSmartVariantManagmentModel.isFlexLoaded()) {
			this.oSmartVariantManagmentModel._unloadFlex();
		}

		const sExpectedError = "SmartVariantManagementModel.retrieveDataFromFlex: FlexWriteAPI is not available. Please call 'loadFlex' before this method.";
		assert.ok(this.fnRetrieveDataFromFlexSpy.notCalled, "should not call 'retrieveDataFromFlex' initially");
		assert.ok(this.fnFlexWriteAPIIsVariantSharingEnabledStub.notCalled, "should not call 'isVariantSharingEnabled' on FlexWriteAPI initially");
		assert.ok(this.fnFlexWriteAPIIsVariantPersonalizationEnabledStub.notCalled, "should not call 'isVariantPersonalizationEnabled' on FlexWriteAPI initially");
		assert.ok(this.fnFlexWriteAPIIsVariantAdaptationEnabedStub.notCalled, "should not call 'isVariantAdaptationEnabled' on FlexWriteAPI initially");

		try {
			this.oSmartVariantManagmentModel.retrieveDataFromFlex();
		} catch (oError) {
			assert.equal(oError.message, sExpectedError, "should throw correct error message");
		}
		assert.ok(this.fnRetrieveDataFromFlexSpy.calledOnce, "should call 'retrieveDataFromFlex'");
		assert.ok(this.fnFlexWriteAPIIsVariantSharingEnabledStub.notCalled, "should not call 'isVariantSharingEnabled' on FlexWriteAPI");
		assert.ok(this.fnFlexWriteAPIIsVariantPersonalizationEnabledStub.notCalled, "should not call 'isVariantPersonalizationEnabled' on FlexWriteAPI");
		assert.ok(this.fnFlexWriteAPIIsVariantAdaptationEnabedStub.notCalled, "should not call 'isVariantAdaptationEnabled' on FlexWriteAPI");
	});

	QUnit.test("should return an array of Promises", async function(assert) {
		const done = assert.async();
		if (!this.oSmartVariantManagmentModel.isFlexLoaded()) {
			await this.oSmartVariantManagmentModel.loadFlex();
		}

		assert.ok(this.fnRetrieveDataFromFlexSpy.notCalled, "should not call 'retrieveDataFromFlex' initially");
		assert.ok(this.fnFlexWriteAPIIsVariantSharingEnabledStub.notCalled, "should not call 'isVariantSharingEnabled' on FlexWriteAPI initially");
		assert.ok(this.fnFlexWriteAPIIsVariantPersonalizationEnabledStub.notCalled, "should not call 'isVariantPersonalizationEnabled' on FlexWriteAPI initially");
		assert.ok(this.fnFlexWriteAPIIsVariantAdaptationEnabedStub.notCalled, "should not call 'isVariantAdaptationEnabled' on FlexWriteAPI initially");

		const aReturnValue = this.oSmartVariantManagmentModel.retrieveDataFromFlex();

		assert.ok(aReturnValue, "should return a value");
		assert.equal(aReturnValue.length, 3, "should return an array of length 3");
		assert.ok(this.fnRetrieveDataFromFlexSpy.calledOnce, "should call 'retrieveDataFromFlex'");
		assert.ok(this.fnFlexWriteAPIIsVariantSharingEnabledStub.calledOnce, "should call 'isVariantSharingEnabled' on FlexWriteAPI");
		assert.ok(this.fnFlexWriteAPIIsVariantPersonalizationEnabledStub.calledOnce, "should call 'isVariantPersonalizationEnabled' on FlexWriteAPI");
		assert.ok(this.fnFlexWriteAPIIsVariantAdaptationEnabedStub.calledOnce, "should call 'isVariantAdaptationEnabled' on FlexWriteAPI");
		this.oSmartVariantManagmentModel._unloadFlex();
		done();
	});

	QUnit.module("loadFlex", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			this.fnLibraryLoadStub = sinon.stub(Library, "load");
			this.fnSAPRequireSpy = sinon.spy(sap.ui, "require");
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
			this.fnLibraryLoadStub.restore();
			this.fnSAPRequireSpy.restore();
		}
	});

	QUnit.test("should return '_oFlLibrary' promise when set already", function(assert) {
		const oFlLibraryPromise = {
			test: "test value"
		};
		this.oSmartVariantManagmentModel._oFlLibrary = oFlLibraryPromise;
		assert.equal(this.oSmartVariantManagmentModel.loadFlex(), oFlLibraryPromise, "should return correct value");
	});

	QUnit.test("should set '_oFlLibrary' + require flex APIs promise when not set already", async function(assert) {
		const done = assert.async();
		assert.equal(this.oSmartVariantManagmentModel._oFlLibrary, undefined, "should not have '_oFlLibrary' initially");
		assert.equal(this.oSmartVariantManagmentModel._oPersistencyPromise, undefined, "should not have '_oPersistencyPromise' initially");
		assert.equal(this.oSmartVariantManagmentModel._fResolvePersistencyPromise, undefined, "should not have '_fResolvePersistencyPromise' initially");
		assert.equal(this.oSmartVariantManagmentModel._fRejectPersistencyPromise, undefined, "should not have '_fRejectPersistencyPromise' initially");
		assert.ok(this.fnLibraryLoadStub.notCalled, "should not call 'load' on Library initially");
		assert.ok(this.fnSAPRequireSpy.notCalled, "should not call 'require' on sap.ui initially");

		this.fnLibraryLoadStub.returns(Promise.resolve());

		await this.oSmartVariantManagmentModel.loadFlex();

		assert.ok(this.fnLibraryLoadStub.calledOnce, "should call 'load' on Library");
		assert.ok(this.fnLibraryLoadStub.calledWith({
			name: 'sap.ui.fl'
		}), "should call 'load' on Library with correct parameters");
		assert.ok(this.fnSAPRequireSpy.calledOnce, "should call 'require' on sap.ui");
		assert.ok(this.fnSAPRequireSpy.calledWith([
			"sap/ui/fl/apply/api/SmartVariantManagementApplyAPI",
			"sap/ui/fl/write/api/SmartVariantManagementWriteAPI",
			"sap/ui/fl/apply/api/FlexRuntimeInfoAPI"
		]), "should call 'require' on sap.ui with correct parameters");
		assert.ok(this.oSmartVariantManagmentModel._oFlLibrary, "should set '_oFlLibrary'");
		assert.ok(this.oSmartVariantManagmentModel._oPersistencyPromise, "should set '_oPersistencyPromise'");
		assert.ok(this.oSmartVariantManagmentModel._fResolvePersistencyPromise, "should set '_fResolvePersistencyPromise'");
		assert.ok(this.oSmartVariantManagmentModel._fRejectPersistencyPromise, "should set '_fRejectPersistencyPromise'");

		done();
	});

QUnit.test("should catch rejection of Library.load", function(assert) {
		const done = assert.async();
		const fnResolvePersistencyPromiseStub = sinon.stub(),
			fnRejectPersistencyPromiseStub = sinon.stub();

		this.oSmartVariantManagmentModel._oPersistencyPromise = {};
		this.oSmartVariantManagmentModel._fResolvePersistencyPromise = fnResolvePersistencyPromiseStub;
		this.oSmartVariantManagmentModel._fRejectPersistencyPromise = fnRejectPersistencyPromiseStub;


		assert.equal(this.oSmartVariantManagmentModel._oFlLibrary, undefined, "should not have '_oFlLibrary' initially");
		assert.ok(this.oSmartVariantManagmentModel._oPersistencyPromise, "should have mocked '_oPersistencyPromise'");
		assert.ok(this.oSmartVariantManagmentModel._fResolvePersistencyPromise, "should have mocked '_fResolvePersistencyPromise'");
		assert.ok(fnResolvePersistencyPromiseStub.notCalled, "should not call mocked 'fResolvePersistencyPromise' initially");
		assert.ok(this.oSmartVariantManagmentModel._fRejectPersistencyPromise, "should have mocked '_fRejectPersistencyPromise'");
		assert.ok(fnRejectPersistencyPromiseStub.notCalled, "should not call mocked 'fRejectPersistencyPromise' initially");
		assert.ok(this.fnLibraryLoadStub.notCalled, "should not call 'load' on Library initially");
		assert.ok(this.fnSAPRequireSpy.notCalled, "should not call 'require' on sap.ui initially");

		const { promise: oLibraryLoadPromise, reject: fnLibraryLoadReject } = Promise.withResolvers();
		this.fnLibraryLoadStub.returns(oLibraryLoadPromise);

		this.oSmartVariantManagmentModel.loadFlex().finally(() => {
			assert.ok(fnResolvePersistencyPromiseStub.notCalled, "should not call '_fResolvePersistencyPromise'");
			assert.ok(fnRejectPersistencyPromiseStub.calledOnce, "should call '_fRejectPersistencyPromise'");
			assert.ok(this.fnSAPRequireSpy.notCalled, "should not call 'require' on sap.ui");
			done();
		});

		assert.ok(this.fnLibraryLoadStub.calledOnce, "should call 'load' on Library");
		assert.ok(this.fnLibraryLoadStub.calledWith({
			name: 'sap.ui.fl'
		}), "should call 'load' on Library with correct parameters");
		assert.ok(this.fnSAPRequireSpy.notCalled, "should not call 'require' on sap.ui");
		assert.ok(this.oSmartVariantManagmentModel._oFlLibrary, "should set '_oFlLibrary'");
		assert.ok(this.oSmartVariantManagmentModel._oPersistencyPromise, "should set '_oPersistencyPromise'");
		assert.ok(this.oSmartVariantManagmentModel._fResolvePersistencyPromise, "should set '_fResolvePersistencyPromise'");
		assert.ok(this.oSmartVariantManagmentModel._fRejectPersistencyPromise, "should set '_fRejectPersistencyPromise'");

		assert.ok(fnResolvePersistencyPromiseStub.notCalled, "should not call '_fResolvePersistencyPromise'");
		assert.ok(fnRejectPersistencyPromiseStub.notCalled, "should not call '_fRejectPersistencyPromise'");

		fnLibraryLoadReject();

	});

	QUnit.module("_unloadFlex", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
		}
	});

	QUnit.test("should set Flex APIs and _oFlLibrary to undefined", async function(assert) {
		await this.oSmartVariantManagmentModel.loadFlex();
		assert.equal(this.oSmartVariantManagmentModel.isFlexLoaded(), true, "should return true");
		this.oSmartVariantManagmentModel._unloadFlex();
		assert.equal(this.oSmartVariantManagmentModel.isFlexLoaded(), false, "should return false");
	});

	QUnit.module("isFlexLoaded", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
		}
	});

	QUnit.test("should return false when one of the FlexAPIs is not loaded", function(assert) {
		this.oSmartVariantManagmentModel._unloadFlex();
		assert.equal(this.oSmartVariantManagmentModel.isFlexLoaded(), false, "should return false");
	});

	QUnit.test("should return true when all of the FlexAPIs are loaded", async function(assert) {
		await this.oSmartVariantManagmentModel.loadFlex();
		assert.equal(this.oSmartVariantManagmentModel.isFlexLoaded(), true, "should return true");
		this.oSmartVariantManagmentModel._unloadFlex();
	});

	QUnit.module("isFlexSupported", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			this.fnIsFlexLoadedStub = sinon.stub(this.oSmartVariantManagmentModel, "isFlexLoaded");
			this.fnLoadFlexStub = sinon.stub(this.oSmartVariantManagmentModel, "loadFlex");
			this.fnIsFlexSupportedStub = sinon.stub(this.oSmartVariantManagmentModel, "_isFlexSupported");
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
			this.fnIsFlexLoadedStub.restore();
			this.fnLoadFlexStub.restore();
			this.fnIsFlexSupportedStub.restore();
		}
	});

	QUnit.test("should call '_isFlexSupported' if flex is loaded already", function(assert) {
		const done = assert.async();
		assert.ok(this.fnIsFlexLoadedStub.notCalled, "should not call 'isFlexLoaded' initially");
		assert.ok(this.fnLoadFlexStub.notCalled, "should not call 'loadFlex' initially");
		assert.ok(this.fnIsFlexSupportedStub.notCalled, "should not call '_isFlexSupported' initially");

		const oControl = {
			test: "test value"
		};
		this.fnIsFlexLoadedStub.returns(true);
		this.oSmartVariantManagmentModel.isFlexSupported(oControl);

		assert.ok(this.fnIsFlexLoadedStub.calledOnce, "should call 'isFlexLoaded'");
		assert.ok(this.fnLoadFlexStub.notCalled, "should not call 'loadFlex'");
		assert.ok(this.fnIsFlexSupportedStub.calledOnce, "should call '_isFlexSupported'");
		assert.ok(this.fnIsFlexSupportedStub.calledWith(oControl), "should call '_isFlexSupported' with correct parameters");

		done();
	});

	QUnit.test("should call 'loadFlex' if it's not already loaded and then '_isFlexSupported'", async function(assert) {
		const done = assert.async();
		assert.ok(this.fnIsFlexLoadedStub.notCalled, "should not call 'isFlexLoaded' initially");
		assert.ok(this.fnLoadFlexStub.notCalled, "should not call 'loadFlex' initially");
		assert.ok(this.fnIsFlexSupportedStub.notCalled, "should not call '_isFlexSupported' initially");

		const oControl = {
			test: "test value"
		};
		this.fnIsFlexLoadedStub.returns(false);
		this.fnLoadFlexStub.returns(Promise.resolve());
		await this.oSmartVariantManagmentModel.isFlexSupported(oControl);

		assert.ok(this.fnIsFlexLoadedStub.calledOnce, "should call 'isFlexLoaded'");
		assert.ok(this.fnLoadFlexStub.calledOnce, "should call 'loadFlex'");
		assert.ok(this.fnIsFlexSupportedStub.calledOnce, "should call '_isFlexSupported'");
		assert.ok(this.fnIsFlexSupportedStub.calledWith(oControl), "should call '_isFlexSupported' with correct parameters");

		done();
	});

	QUnit.module("_isFlexSupported", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			this.fnIsFlexSupportedSpy = sinon.spy(this.oSmartVariantManagmentModel, "_isFlexSupported");
			this.fnFlexRuntimeInfoAPIIsFlexSupportedStub = sinon.stub(FlexRuntimeInfoAPI, "isFlexSupported");
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
			this.fnIsFlexSupportedSpy.restore();
			this.fnFlexRuntimeInfoAPIIsFlexSupportedStub.restore();
		}
	});

	QUnit.test("should throw an error if FlexRuntimeInfoAPI is not loaded", function(assert) {
		if (this.oSmartVariantManagmentModel.isFlexLoaded()) {
			this.oSmartVariantManagmentModel._unloadFlex();
		}

		const sExpectedError = "SmartVariantManagementModel._isFlexSupported: FlexRuntimeInfoAPI is not available. Please call 'loadFlex' before this method.";
		assert.ok(this.fnIsFlexSupportedSpy.notCalled, "should not call '_isFlexSupported' initially");
		assert.ok(this.fnFlexRuntimeInfoAPIIsFlexSupportedStub.notCalled, "should not call 'isFlexSupported' on FlexRuntimeInfoAPI initially");

		try {
			this.oSmartVariantManagmentModel._isFlexSupported();
		} catch (oError) {
			assert.equal(oError.message, sExpectedError, "should throw correct error message");
		}
		assert.ok(this.fnIsFlexSupportedSpy.calledOnce, "should call '_isFlexSupported'");
		assert.ok(this.fnFlexRuntimeInfoAPIIsFlexSupportedStub.notCalled, "should not call 'isFlexSupported' on FlexRuntimeInfoAPI");
	});

	QUnit.test("should call 'isFlexSupported' on FlexRuntimeInfoAPI", async function(assert) {
		const done = assert.async();

		assert.ok(this.fnIsFlexSupportedSpy.notCalled, "should not call '_isFlexSupported' initially");
		assert.ok(this.fnFlexRuntimeInfoAPIIsFlexSupportedStub.notCalled, "should not call 'isFlexSupported' on FlexRuntimeInfoAPI initially");

		await this.oSmartVariantManagmentModel.loadFlex();

		const oControl = {
			test: "test value"
		};
		this.oSmartVariantManagmentModel._isFlexSupported(oControl);

		assert.ok(this.fnIsFlexSupportedSpy.calledOnce, "should call '_isFlexSupported'");
		assert.ok(this.fnFlexRuntimeInfoAPIIsFlexSupportedStub.calledOnce, "should call 'isFlexSupported' on FlexRuntimeInfoAPI");
		assert.ok(this.fnFlexRuntimeInfoAPIIsFlexSupportedStub.calledWith({
			element: oControl
		}), "should call 'isFlexSupported' on FlexRuntimeInfoAPI with correct parameters");

		this.oSmartVariantManagmentModel._unloadFlex();

		done();
	});

	QUnit.module("loadVariants", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			this.fnLoadVariantsSpy = sinon.spy(this.oSmartVariantManagmentModel, "loadVariants");
			this.fnFlexApplyAPILoadVariantsStub = sinon.stub(FlexApplyAPI, "loadVariants");

			this.fnResolveControlPromiseStub = sinon.stub();
			this.fnRejectControlPromiseStub = sinon.stub();
			this.fnResolvePersistencyPromise = sinon.stub();
			this.fnRejectPersistencyPromise = sinon.stub();
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
			this.fnFlexApplyAPILoadVariantsStub.restore();
			this.fnResolveControlPromiseStub.reset();
			this.fnRejectControlPromiseStub.reset();
			this.fnResolvePersistencyPromise.reset();
			this.fnRejectPersistencyPromise.reset();

			this.fnLoadVariantsSpy.restore();
		}
	});

	QUnit.test("should throw an error when FlexApplyAPI is not loaded", function(assert) {
		if (this.oSmartVariantManagmentModel.isFlexLoaded()) {
			this.oSmartVariantManagmentModel._unloadFlex();
		}

		const sExpectedError = "SmartVariantManagementModel.loadVariant: FlexApplyAPI is not available. Please call 'loadFlex' before this method.";
		assert.ok(this.fnLoadVariantsSpy.notCalled, "should not call 'loadVariants' initially");
		assert.ok(this.fnFlexApplyAPILoadVariantsStub.notCalled, "should not call 'loadVariants' on FlexApplyAPI initially");
		assert.ok(this.fnResolvePersistencyPromise.notCalled, "should not call '_fResolvePersistencyPromise' initially");
		assert.ok(this.fnRejectPersistencyPromise.notCalled, "should not call '_fRejectPersistencyPromise' initially");

		// no need for parameters as the error will be thrown anyways
		try	{
			this.oSmartVariantManagmentModel.loadVariants();
		} catch (oError) {
			assert.equal(oError.message, sExpectedError, "should throw correct error message");
		}

		assert.ok(this.fnLoadVariantsSpy.calledOnce, "should call 'loadVariants'");
		assert.ok(this.fnLoadVariantsSpy.threw, "should call 'loadVariants'");
		assert.ok(this.fnFlexApplyAPILoadVariantsStub.notCalled, "should not call 'loadVariants' on FlexApplyAPI");
	});

	QUnit.test("should call 'loadVariants' on FlexApplyAPI + _fResolvePersistencyPromise", async function(assert) {
		const done = assert.async();
		const mVariants = {
			test: "just to check if the return value is correct"
		};
		await this.oSmartVariantManagmentModel.loadFlex();
		this.oSmartVariantManagmentModel._fResolvePersistencyPromise = this.fnResolvePersistencyPromise;
		this.oSmartVariantManagmentModel._fRejectPersistencyPromise = this.fnRejectPersistencyPromise;
		this.fnFlexApplyAPILoadVariantsStub.returns(Promise.resolve(mVariants));

		const mPropertyBag = {
			test: "another test value"
		};

		assert.ok(this.fnLoadVariantsSpy.notCalled, "should not call 'loadVariants' initially");
		assert.ok(this.fnFlexApplyAPILoadVariantsStub.notCalled, "should not call 'loadVariants' on FlexApplyAPI initially");
		assert.ok(this.fnResolvePersistencyPromise.notCalled, "should not call '_fResolvePersistencyPromise' initially");
		assert.ok(this.fnRejectPersistencyPromise.notCalled, "should not call '_fRejectPersistencyPromise' initially");
		assert.ok(this.fnResolveControlPromiseStub.notCalled, "should not call 'resolveControlPromise' initially");
		assert.ok(this.fnRejectControlPromiseStub.notCalled, "should not call 'rejectControlPromise' initially");

		await this.oSmartVariantManagmentModel.loadVariants(mPropertyBag, this.fnResolveControlPromiseStub, this.fnRejectControlPromiseStub);

		assert.ok(this.fnLoadVariantsSpy.calledOnce, "should call 'loadVariants'");
		assert.ok(this.fnFlexApplyAPILoadVariantsStub.calledOnce, "should call 'loadVariants' on FlexApplyAPI");
		assert.ok(this.fnFlexApplyAPILoadVariantsStub.calledWith(mPropertyBag), "should call 'loadVariants' on FlexApplyAPI with correct parameters");
		assert.ok(this.fnResolvePersistencyPromise.calledOnce, "should call '_fResolvePersistencyPromise'");
		assert.ok(this.fnRejectPersistencyPromise.notCalled, "should not call '_fRejectPersistencyPromise'");
		assert.ok(this.fnResolveControlPromiseStub.calledOnce, "should call 'resolveControlPromise'");
		assert.ok(this.fnResolveControlPromiseStub.calledWith(mVariants), "should call 'resolveControlPromise' with correct parameters");
		assert.ok(this.fnRejectControlPromiseStub.notCalled, "should not call 'rejectControlPromise'");

		this.oSmartVariantManagmentModel._unloadFlex();
		done();
	});

	QUnit.test("should call 'loadVariants' on FlexApplyAPI + _fRejectPersistencyPromise", async function(assert) {
		const done = assert.async();
		const mVariants = {
			test: "just to check if the return value is correct"
		};
		await this.oSmartVariantManagmentModel.loadFlex();
		this.oSmartVariantManagmentModel._fResolvePersistencyPromise = this.fnResolvePersistencyPromise;
		this.oSmartVariantManagmentModel._fRejectPersistencyPromise = this.fnRejectPersistencyPromise;
		this.fnFlexApplyAPILoadVariantsStub.returns(Promise.reject(mVariants));

		const mPropertyBag = {
			test: "another test value"
		};

		assert.ok(this.fnLoadVariantsSpy.notCalled, "should not call 'loadVariants' initially");
		assert.ok(this.fnFlexApplyAPILoadVariantsStub.notCalled, "should not call 'loadVariants' on FlexApplyAPI initially");
		assert.ok(this.fnResolvePersistencyPromise.notCalled, "should not call '_fResolvePersistencyPromise' initially");
		assert.ok(this.fnRejectPersistencyPromise.notCalled, "should not call '_fRejectPersistencyPromise' initially");
		assert.ok(this.fnResolveControlPromiseStub.notCalled, "should not call 'resolveControlPromise' initially");
		assert.ok(this.fnRejectControlPromiseStub.notCalled, "should not call 'rejectControlPromise' initially");

		await this.oSmartVariantManagmentModel.loadVariants(mPropertyBag, this.fnResolveControlPromiseStub, this.fnRejectControlPromiseStub);

		assert.ok(this.fnLoadVariantsSpy.calledOnce, "should call 'loadVariants'");
		assert.ok(this.fnFlexApplyAPILoadVariantsStub.calledOnce, "should call 'loadVariants' on FlexApplyAPI");
		assert.ok(this.fnFlexApplyAPILoadVariantsStub.calledWith(mPropertyBag), "should call 'loadVariants' on FlexApplyAPI with correct parameters");
		assert.ok(this.fnResolvePersistencyPromise.notCalled, "should not call '_fResolvePersistencyPromise'");
		assert.ok(this.fnRejectPersistencyPromise.calledOnce, "should call '_fRejectPersistencyPromise'");
		assert.ok(this.fnRejectPersistencyPromise.calledWith(mVariants), "should call '_fRejectPersistencyPromise' with correct parameters");
		assert.ok(this.fnResolveControlPromiseStub.notCalled, "should not call 'resolveControlPromise'");
		assert.ok(this.fnRejectControlPromiseStub.calledOnce, "should call 'rejectControlPromise'");
		assert.ok(this.fnRejectControlPromiseStub.calledWith(mVariants), "should call 'rejectControlPromise' with correct parameters");

		this.oSmartVariantManagmentModel._unloadFlex();
		done();
	});

	QUnit.module("flUpdateVariant", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			this.fnHandleLayerUpdateStub = sinon.stub(this.oSmartVariantManagmentModel, "_handleLayerUpdate");
			this.fnHandleUserDependentUpdateStub = sinon.stub(this.oSmartVariantManagmentModel, "_handleUserDependentUpdate");

			this.oVariant = {};
			this.oPersoControl = {};
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
			this.oPersoControl = undefined;
			this.oVariant = undefined;
			this.fnHandleLayerUpdateStub.restore();
			this.fnHandleUserDependentUpdateStub.restore();
		}
	});

	QUnit.test("should do nothing when 'content', 'name', 'favorite' and 'executeOnSelection' are not defined on mProperties", function(assert) {
		assert.ok(this.fnHandleLayerUpdateStub.notCalled, "should not call '_handleLayerUpdate' initially");
		assert.ok(this.fnHandleUserDependentUpdateStub.notCalled, "should not call '_handleUserDependentUpdate' initially");

		const vReturnValue = this.oSmartVariantManagmentModel.flUpdateVariant(this.oVariant, {}, this.oPersoControl);

		assert.equal(vReturnValue, undefined, "should return undefined");
		assert.ok(this.fnHandleLayerUpdateStub.notCalled, "should not call '_handleLayerUpdate'");
		assert.ok(this.fnHandleUserDependentUpdateStub.notCalled, "should not call '_handleUserDependentUpdate'");
	});

	QUnit.test("should forward call to '_handleLayerUpdate' when 'content' or 'name' are defined on mProperties", function(assert) {
		assert.ok(this.fnHandleLayerUpdateStub.notCalled, "should not call '_handleLayerUpdate' initially");
		assert.ok(this.fnHandleUserDependentUpdateStub.notCalled, "should not call '_handleUserDependentUpdate' initially");

		const oUpdatedVariant = {
			test: "this is just an test object to test the return value"
		};
		this.fnHandleLayerUpdateStub.returns(oUpdatedVariant);

		let mProperties = {
			content: {}
		};
		let vReturnValue = this.oSmartVariantManagmentModel.flUpdateVariant(this.oVariant, mProperties, this.oPersoControl);

		assert.equal(vReturnValue, oUpdatedVariant, "should not return undefined");
		assert.ok(this.fnHandleLayerUpdateStub.calledOnce, "should call '_handleLayerUpdate' when 'content' is present in mProperties");
		assert.ok(this.fnHandleLayerUpdateStub.calledWith(this.oVariant, mProperties, this.oPersoControl), "should call '_handleLayerUpdate' with correct parameteres");
		assert.ok(this.fnHandleUserDependentUpdateStub.notCalled, "should not call '_handleUserDependentUpdate'");

		mProperties = {
			name: "name"
		};
		vReturnValue = this.oSmartVariantManagmentModel.flUpdateVariant(this.oVariant, mProperties, this.oPersoControl);

		assert.equal(vReturnValue, oUpdatedVariant, "should not return undefined");
		assert.ok(this.fnHandleLayerUpdateStub.calledTwice, "should call '_handleLayerUpdate' when 'name' is present in mProperties");
		assert.ok(this.fnHandleLayerUpdateStub.calledWith(this.oVariant, mProperties, this.oPersoControl), "should call '_handleLayerUpdate' with correct parameteres");
		assert.ok(this.fnHandleUserDependentUpdateStub.notCalled, "should not call '_handleUserDependentUpdate'");
	});

	QUnit.test("should forward call to '_handleUserDependentUpdate' when 'favorite' or 'executeOnSelection' are defined on mProperties", function(assert) {
		assert.ok(this.fnHandleLayerUpdateStub.notCalled, "should not call '_handleLayerUpdate' initially");
		assert.ok(this.fnHandleUserDependentUpdateStub.notCalled, "should not call '_handleUserDependentUpdate' initially");

		const oUpdatedVariant = {
			test: "this is just an test object to test the return value"
		};
		this.fnHandleUserDependentUpdateStub.returns(oUpdatedVariant);

		let mProperties = {
			favorite: true
		};
		let vReturnValue = this.oSmartVariantManagmentModel.flUpdateVariant(this.oVariant, mProperties, this.oPersoControl);

		assert.equal(vReturnValue, oUpdatedVariant, "should not return undefined");
		assert.ok(this.fnHandleLayerUpdateStub.notCalled, "should not call '_handleLayerUpdate'");
		assert.ok(this.fnHandleUserDependentUpdateStub.calledOnce, "should call '_handleUserDependentUpdate' when 'favorite'  is present in mProperties");
		assert.ok(this.fnHandleUserDependentUpdateStub.calledWith(this.oVariant, mProperties, this.oPersoControl), "should call '_handleUserDependentUpdate' with correct parameteres");

		mProperties = {
			executeOnSelection: true
		};
		vReturnValue = this.oSmartVariantManagmentModel.flUpdateVariant(this.oVariant, mProperties, this.oPersoControl);

		assert.equal(vReturnValue, oUpdatedVariant, "should not return undefined");
		assert.ok(this.fnHandleLayerUpdateStub.notCalled, "should not call '_handleLayerUpdate'");
		assert.ok(this.fnHandleUserDependentUpdateStub.calledTwice, "should call '_handleUserDependentUpdate' when 'executeOnSelection'  is present in mProperties");
		assert.ok(this.fnHandleUserDependentUpdateStub.calledWith(this.oVariant, mProperties, this.oPersoControl), "should call '_handleUserDependentUpdate' with correct parameteres");
	});

	QUnit.module("_handleLayerUpdate", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			this.fnHandleUpdateStub = sinon.stub(this.oSmartVariantManagmentModel, "_handleUpdate");

			this.sLayer = "layer";
			this.fnGetLayerStub = sinon.stub();
			this.fnGetLayerStub.returns(this.sLayer);

			this.sVariantId = "variant_id";
			this.fnGetVariantIdStub = sinon.stub();
			this.fnGetVariantIdStub.returns(this.sVariantId);
			this.oVariant = {
				getVariantId: this.fnGetVariantIdStub,
				getLayer: this.fnGetLayerStub
			};
			this.oPersoControl = {};
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
			this.oPersoControl = undefined;
			this.oVariant = undefined;
			this.sVariantId = undefined;
			this.fnHandleUpdateStub.restore();
			this.fnGetVariantIdStub.reset();
			this.fnGetVariantIdStub = undefined;
		}
	});

	QUnit.test("should update layer and call '_handleUpdate'", function(assert) {
		assert.ok(this.fnGetVariantIdStub.notCalled, "should not call 'getVariantId' on oVariant initially");
		assert.ok(this.fnGetLayerStub.notCalled, "should not call 'getLayer' on oVariant initially");
		assert.ok(this.fnHandleUpdateStub.notCalled, "should not call '_handleUpdate' initially");

		this.oSmartVariantManagmentModel._handleLayerUpdate(this.oVariant, {}, this.oPersoControl);

		assert.ok(this.fnGetVariantIdStub.calledOnce, "should call 'getVariantId' on oVariant");
		assert.ok(this.fnGetLayerStub.calledOnce, "should call 'getLayer' on oVariant");
		assert.ok(this.fnHandleUpdateStub.calledOnce, "should call '_handleUpdate'");
		assert.ok(this.fnHandleUpdateStub.calledWith({
			control: this.oPersoControl,
			id: this.sVariantId,
			layer: this.sLayer
		}), "should call '_handleUpdate' with correct parameters");
	});

	QUnit.test("should update content", function(assert) {
		assert.ok(this.fnGetVariantIdStub.notCalled, "should not call 'getVariantId' on oVariant initially");
		assert.ok(this.fnGetLayerStub.notCalled, "should not call 'getLayer' on oVariant initially");
		assert.ok(this.fnHandleUpdateStub.notCalled, "should not call '_handleUpdate' initially");

		const oContent = {};
		this.oSmartVariantManagmentModel._handleLayerUpdate(this.oVariant, {
			content: oContent
		}, this.oPersoControl);

		assert.ok(this.fnGetVariantIdStub.calledOnce, "should call 'getVariantId' on oVariant");
		assert.ok(this.fnGetLayerStub.calledOnce, "should call 'getLayer' on oVariant");
		assert.ok(this.fnHandleUpdateStub.calledOnce, "should call '_handleUpdate'");
		assert.ok(this.fnHandleUpdateStub.calledWith({
			control: this.oPersoControl,
			id: this.sVariantId,
			layer: this.sLayer,
			content: oContent
		}), "should call '_handleUpdate' with correct parameters");
	});

	QUnit.test("should update name", function(assert) {
		assert.ok(this.fnGetVariantIdStub.notCalled, "should not call 'getVariantId' on oVariant initially");
		assert.ok(this.fnGetLayerStub.notCalled, "should not call 'getLayer' on oVariant initially");
		assert.ok(this.fnHandleUpdateStub.notCalled, "should not call '_handleUpdate' initially");

		const sName = "name";
		this.oSmartVariantManagmentModel._handleLayerUpdate(this.oVariant, {
			name: sName
		}, this.oPersoControl);

		assert.ok(this.fnGetVariantIdStub.calledOnce, "should call 'getVariantId' on oVariant");
		assert.ok(this.fnGetLayerStub.calledOnce, "should call 'getLayer' on oVariant");
		assert.ok(this.fnHandleUpdateStub.calledOnce, "should call '_handleUpdate'");
		assert.ok(this.fnHandleUpdateStub.calledWith({
			control: this.oPersoControl,
			id: this.sVariantId,
			layer: this.sLayer,
			name: sName
		}), "should call '_handleUpdate' with correct parameters");
	});

	QUnit.test("should update packageName", function(assert) {
		assert.ok(this.fnGetVariantIdStub.notCalled, "should not call 'getVariantId' on oVariant initially");
		assert.ok(this.fnGetLayerStub.notCalled, "should not call 'getLayer' on oVariant initially");
		assert.ok(this.fnHandleUpdateStub.notCalled, "should not call '_handleUpdate' initially");

		const sPackageName = "packageName";
		this.oSmartVariantManagmentModel._handleLayerUpdate(this.oVariant, {
			packageName: sPackageName
		}, this.oPersoControl);

		assert.ok(this.fnGetVariantIdStub.calledOnce, "should call 'getVariantId' on oVariant");
		assert.ok(this.fnGetLayerStub.calledOnce, "should call 'getLayer' on oVariant");
		assert.ok(this.fnHandleUpdateStub.calledOnce, "should call '_handleUpdate'");
		assert.ok(this.fnHandleUpdateStub.calledWith({
			control: this.oPersoControl,
			id: this.sVariantId,
			layer: this.sLayer,
			packageName: sPackageName
		}), "should call '_handleUpdate' with correct parameters");
	});

	QUnit.test("should update transportId", function(assert) {
		assert.ok(this.fnGetVariantIdStub.notCalled, "should not call 'getVariantId' on oVariant initially");
		assert.ok(this.fnGetLayerStub.notCalled, "should not call 'getLayer' on oVariant initially");
		assert.ok(this.fnHandleUpdateStub.notCalled, "should not call '_handleUpdate' initially");

		const sTransportId = "transportId";
		this.oSmartVariantManagmentModel._handleLayerUpdate(this.oVariant, {
			transportId: sTransportId
		}, this.oPersoControl);

		assert.ok(this.fnGetVariantIdStub.calledOnce, "should call 'getVariantId' on oVariant");
		assert.ok(this.fnGetLayerStub.calledOnce, "should call 'getLayer' on oVariant");
		assert.ok(this.fnHandleUpdateStub.calledOnce, "should call '_handleUpdate'");
		assert.ok(this.fnHandleUpdateStub.calledWith({
			control: this.oPersoControl,
			id: this.sVariantId,
			layer: this.sLayer,
			transportId: sTransportId
		}), "should call '_handleUpdate' with correct parameters");
	});

	QUnit.module("_handleUserDependentUpdate", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			this.fnHandleUpdateStub = sinon.stub(this.oSmartVariantManagmentModel, "_handleUpdate");

			this.sVariantId = "variant_id";
			this.fnGetVariantIdStub = sinon.stub();
			this.fnGetVariantIdStub.returns(this.sVariantId);
			this.oVariant = {
				getVariantId: this.fnGetVariantIdStub
			};
			this.oPersoControl = {};
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
			this.oPersoControl = undefined;
			this.oVariant = undefined;
			this.sVariantId = undefined;
			this.fnHandleUpdateStub.restore();
			this.fnGetVariantIdStub.reset();
			this.fnGetVariantIdStub = undefined;
		}
	});

	QUnit.test("should update isUserDependent and call '_handleUpdate'", function(assert) {
		assert.ok(this.fnGetVariantIdStub.notCalled, "should not call 'getVariantId' on oVariant initially");
		assert.ok(this.fnHandleUpdateStub.notCalled, "should not call '_handleUpdate' initially");

		this.oSmartVariantManagmentModel._handleUserDependentUpdate(this.oVariant, {}, this.oPersoControl);

		assert.ok(this.fnGetVariantIdStub.calledOnce, "should call 'getVariantId' on oVariant");
		assert.ok(this.fnHandleUpdateStub.calledOnce, "should call '_handleUpdate'");
		assert.ok(this.fnHandleUpdateStub.calledWith({
			control: this.oPersoControl,
			id: this.sVariantId,
			isUserDependent: true
		}), "should call '_handleUpdate' with correct parameters");
	});

	QUnit.test("should update favorite and call '_handleUpdate'", function(assert) {
		assert.ok(this.fnGetVariantIdStub.notCalled, "should not call 'getVariantId' on oVariant initially");
		assert.ok(this.fnHandleUpdateStub.notCalled, "should not call '_handleUpdate' initially");

		const bFavorite = true;
		this.oSmartVariantManagmentModel._handleUserDependentUpdate(this.oVariant, {
			favorite: bFavorite
		}, this.oPersoControl);

		assert.ok(this.fnGetVariantIdStub.calledOnce, "should call 'getVariantId' on oVariant");
		assert.ok(this.fnHandleUpdateStub.calledOnce, "should call '_handleUpdate'");
		assert.ok(this.fnHandleUpdateStub.calledWith({
			control: this.oPersoControl,
			id: this.sVariantId,
			isUserDependent: true,
			favorite: bFavorite
		}), "should call '_handleUpdate' with correct parameters");
	});

	QUnit.test("should update executeOnSelection and call '_handleUpdate'", function(assert) {
		assert.ok(this.fnGetVariantIdStub.notCalled, "should not call 'getVariantId' on oVariant initially");
		assert.ok(this.fnHandleUpdateStub.notCalled, "should not call '_handleUpdate' initially");

		const bExecuteOnSelection = true;
		this.oSmartVariantManagmentModel._handleUserDependentUpdate(this.oVariant, {
			executeOnSelection: bExecuteOnSelection
		}, this.oPersoControl);

		assert.ok(this.fnGetVariantIdStub.calledOnce, "should call 'getVariantId' on oVariant");
		assert.ok(this.fnHandleUpdateStub.calledOnce, "should call '_handleUpdate'");
		assert.ok(this.fnHandleUpdateStub.calledWith({
			control: this.oPersoControl,
			id: this.sVariantId,
			isUserDependent: true,
			executeOnSelection: bExecuteOnSelection
		}), "should call '_handleUpdate' with correct parameters");
	});

	QUnit.module("_handleUpdate", {});

	QUnit.test("should forward call to '_flWriteUpdateVariant'", function(assert) {
		let oSmartVariantManagmentModel = new SmartVariantManagementModel();

		const fnHandleUpdateSpy = sinon.spy(oSmartVariantManagmentModel, "_handleUpdate");
		const fnWriteUpdateVariantSpy = sinon.stub(oSmartVariantManagmentModel, "_flWriteUpdateVariant");

		assert.ok(fnHandleUpdateSpy.notCalled, "should not call '_handleUpdate' initially");
		assert.ok(fnWriteUpdateVariantSpy.notCalled, "should not call '_flWriteUpdateVariant' initially");

		const mParameters = {};
		oSmartVariantManagmentModel._handleUpdate(mParameters);

		assert.ok(fnHandleUpdateSpy.calledOnce, "should call '_handleUpdate'");
		assert.ok(fnWriteUpdateVariantSpy.calledOnce, "should call '_flWriteUpdateVariant'");
		assert.ok(fnWriteUpdateVariantSpy.calledWith(mParameters), "should call '_flWriteUpdateVariant' with correct parameters");

		fnHandleUpdateSpy.restore();
		fnWriteUpdateVariantSpy.restore();

		oSmartVariantManagmentModel.destroy();
		oSmartVariantManagmentModel = undefined;
	});

	const fnShouldForwardCallToFlexWriteAPI = async function(assert, { forwardedMethodName, methodName, aParameters, oSmartVariantManagmentModel }) {
		const done = assert.async();
		const fnSmartVariantManagementModelSpy = sinon.spy(oSmartVariantManagmentModel, methodName);
		const fnFlexWriteAPIStub = sinon.stub(FlexWriteAPI, forwardedMethodName);

		assert.ok(fnSmartVariantManagementModelSpy.notCalled, `should not call '${methodName}' initially`);
		assert.ok(fnFlexWriteAPIStub.notCalled, `should not call '${forwardedMethodName}' on FlexWriteAPI initially`);

		await oSmartVariantManagmentModel.loadFlex();

		oSmartVariantManagmentModel[methodName](...aParameters);

		assert.ok(fnSmartVariantManagementModelSpy.calledOnce, `should call '${methodName}'`);
		assert.ok(fnFlexWriteAPIStub.calledOnce, `should call '${forwardedMethodName}' on FlexWriteAPI`);
		assert.ok(fnFlexWriteAPIStub.calledWith(...aParameters), `should call '${forwardedMethodName}' on FlexWriteAPI with correct parameters`);

		fnSmartVariantManagementModelSpy.restore();
		fnFlexWriteAPIStub.restore();
		oSmartVariantManagmentModel._unloadFlex();
		done();
	};

	const fnShouldNotForwardCallToFlexWriteAPI = function(assert, { forwardedMethodName, methodName, aParameters, oSmartVariantManagmentModel, returnValue }) {
		const fnSmartVariantManagementModelSpy = sinon.spy(oSmartVariantManagmentModel, methodName);
		const fnFlexWriteAPIStub = sinon.stub(FlexWriteAPI, forwardedMethodName);

		if (oSmartVariantManagmentModel.isFlexLoaded()) {
			oSmartVariantManagmentModel._unloadFlex();
		}

		const vReturnValue = oSmartVariantManagmentModel[methodName](...aParameters);

		assert.ok(fnSmartVariantManagementModelSpy.calledOnce, `should call '${methodName}'`);
		assert.ok(fnFlexWriteAPIStub.notCalled, `should not call '${forwardedMethodName}' on FlexWriteAPI`);
		assert.equal(vReturnValue, returnValue, "should return correct value");

		fnSmartVariantManagementModelSpy.restore();
		fnFlexWriteAPIStub.restore();
	};

	Object.entries({
		"_flWriteUpdateVariant": "updateVariant",
		"_flWriteRemoveVariant": "removeVariant",
		"_flWriteAddVariant": "addVariant"
	}).forEach(function([sMethodName, sForwardedMethodName]) {
		QUnit.module(sMethodName, {
			beforeEach: function() {
				this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			},
			afterEach: function() {
				this.oSmartVariantManagmentModel.destroy();
				this.oSmartVariantManagmentModel = undefined;
			}
		});

		QUnit.test("should return null when FlexWriteAPI is not loaded", function(assert) {
			fnShouldNotForwardCallToFlexWriteAPI(assert, {
				forwardedMethodName: sForwardedMethodName,
				methodName: sMethodName,
				aParameters: [{}],
				oSmartVariantManagmentModel: this.oSmartVariantManagmentModel,
				returnValue: null
			});
		});

		QUnit.test(`should forward call to '${sForwardedMethodName}' of FlexWriteAPI`, async function(assert) {
			await fnShouldForwardCallToFlexWriteAPI(assert, {
				forwardedMethodName: sForwardedMethodName,
				methodName: sMethodName,
				aParameters: [{}],
				oSmartVariantManagmentModel: this.oSmartVariantManagmentModel
			});
		});
	});

	QUnit.module("flWriteOverrideStandardVariant", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			this.fnWriteOverrideStandardVariantSpy = sinon.spy(this.oSmartVariantManagmentModel, "flWriteOverrideStandardVariant");
			this.fnFlexWriteAPIOverrideStandardVariantStub = sinon.stub(FlexWriteAPI, "overrideStandardVariant");
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;

			this.fnWriteOverrideStandardVariantSpy.restore();
			this.fnFlexWriteAPIOverrideStandardVariantStub.restore();
		}
	});

	QUnit.test("should do nothing when FlexWriteAPI is not loaded", function(assert) {
		assert.ok(this.fnWriteOverrideStandardVariantSpy.notCalled, "should not call 'flWriteOverrideStandardVariant' initially");
		assert.ok(this.fnFlexWriteAPIOverrideStandardVariantStub.notCalled, "should not call 'overrideStandardVariant' on FlexWriteAPI initially");

		if (this.oSmartVariantManagmentModel.isFlexLoaded()) {
			this.oSmartVariantManagmentModel._unloadFlex();
		}

		this.oSmartVariantManagmentModel.flWriteOverrideStandardVariant();

		assert.ok(this.fnWriteOverrideStandardVariantSpy.calledOnce, "should call 'flWriteOverrideStandardVariant'");
		assert.ok(this.fnFlexWriteAPIOverrideStandardVariantStub.notCalled, "should not call 'overrideStandardVariant' on FlexWriteAPI");
	});

	QUnit.test("should forward call to 'overrideStandardVariant' of FlexWriteAPI", async function(assert) {
		const done = assert.async();
		const bFlag = true;
		const oPersoControl = {};

		assert.ok(this.fnWriteOverrideStandardVariantSpy.notCalled, "should not call 'flWriteOverrideStandardVariant' initially");
		assert.ok(this.fnFlexWriteAPIOverrideStandardVariantStub.notCalled, "should not call 'overrideStandardVariant' on FlexWriteAPI initially");

		await this.oSmartVariantManagmentModel.loadFlex();
		this.oSmartVariantManagmentModel.flWriteOverrideStandardVariant(bFlag, oPersoControl);

		assert.ok(this.fnWriteOverrideStandardVariantSpy.calledOnce, "should call 'flWriteOverrideStandardVariant'");
		assert.ok(this.fnFlexWriteAPIOverrideStandardVariantStub.calledOnce, "should call 'overrideStandardVariant' on FlexWriteAPI");
		assert.ok(this.fnFlexWriteAPIOverrideStandardVariantStub.calledWith({
			control: oPersoControl,
			executeOnSelection: bFlag
		}), "should call 'overrideStandardVariant' on FlexWriteAPI with correct parameters");
		this.oSmartVariantManagmentModel._unloadFlex();
		done();
	});

	QUnit.module("save", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
			this.fnSaveSpy = sinon.spy(this.oSmartVariantManagmentModel, "save");
			this.fnFlexWriteAPISaveStub = sinon.stub(FlexWriteAPI, "save");
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;

			this.fnSaveSpy.restore();
			this.fnFlexWriteAPISaveStub.restore();
		}
	});

	QUnit.test("should throw an error if FlexWriteAPI is not loaded", function(assert) {
		const sExpectedError = "SmartVariantManagementModel.save: FlexWriteAPI is not set. Please call 'loadFlex' before calling this method.";
		assert.ok(this.fnSaveSpy.notCalled, "should not call 'save' initially");
		assert.ok(this.fnFlexWriteAPISaveStub.notCalled, "should not call 'save' on FlexWriteAPI initially");


		if (this.oSmartVariantManagmentModel.isFlexLoaded()) {
			this.oSmartVariantManagmentModel._unloadFlex();
		}

		try {
			this.oSmartVariantManagmentModel.save();
		} catch (oError) {
			assert.equal(oError.message, sExpectedError, "should throw correct error message");
		}

		assert.ok(this.fnSaveSpy.threw(), "should throw an error when FlexWriteAPI is not loaded");
		assert.ok(this.fnSaveSpy.calledOnce, "should call 'save'");
		assert.ok(this.fnFlexWriteAPISaveStub.notCalled, "should not call 'save' on FlexWriteAPI");
	});

	QUnit.test("should forward call to 'save' of FlexWriteAPI", async function(assert) {
		const done = assert.async();
		assert.ok(this.fnSaveSpy.notCalled, "should not call 'save' initially");
		assert.ok(this.fnFlexWriteAPISaveStub.notCalled, "should not call 'save' on FlexWriteAPI initially");

		await this.oSmartVariantManagmentModel.loadFlex();

		const oPersoControl = {};
		this.oSmartVariantManagmentModel.save(oPersoControl);

		assert.ok(!this.fnSaveSpy.threw(), "should not throw an error when FlexWriteAPI is loaded");
		assert.ok(this.fnSaveSpy.calledOnce, "should call 'save'");
		assert.ok(this.fnFlexWriteAPISaveStub.calledOnce, "should call 'save' on FlexWriteAPI");
		assert.ok(this.fnFlexWriteAPISaveStub.calledWith({
			control: oPersoControl
		}), "should call 'save' on FlexWriteAPI");

		this.oSmartVariantManagmentModel._unloadFlex();
		done();
	});

	QUnit.module("_createMetadataPromise", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
		}
	});

	QUnit.test("should set internal function variable '_fResolveMetadataPromise' + '_oMetadataPromise'", function(assert) {
		assert.equal(this.oSmartVariantManagmentModel._fResolveMetadataPromise, null, "should have default value 'null' for '_fResolveMetadataPromise'");
		assert.equal(this.oSmartVariantManagmentModel._oMetadataPromise, null, "should have default value 'null' for '_oMetadataPromise'");

		this.oSmartVariantManagmentModel._createMetadataPromise();
		assert.ok(this.oSmartVariantManagmentModel._fResolveMetadataPromise instanceof Function, "should set value of '_fResolveMetadataPromise' to a function");
		assert.ok(this.oSmartVariantManagmentModel._oMetadataPromise instanceof Promise, "should set value of '_oMetadataPromise' to a Promise");
	});

	QUnit.module("_resolveMetadataPromise", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
		}
	});

	QUnit.test("should call internal function variable '_fResolveMetadataPromise'", function(assert) {
		const fnResolveMetadataPromiseStub = sinon.stub();

		this.oSmartVariantManagmentModel._fResolveMetadataPromise = fnResolveMetadataPromiseStub;

		assert.ok(fnResolveMetadataPromiseStub.notCalled, "should not call '_fResolveMetadataPromise' initially");

		this.oSmartVariantManagmentModel._resolveMetadataPromise();

		assert.ok(fnResolveMetadataPromiseStub.calledOnce, "should call '_fResolveMetadataPromise'");
	});

	QUnit.module("getPersistencyPromise", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
		}
	});

	QUnit.test("should return internal variable '_oPersistencyPromise'", function(assert) {
		assert.equal(this.oSmartVariantManagmentModel.getPersistencyPromise(), null, "should return 'null' by default");

		const oPersistencyPromise = {};
		this.oSmartVariantManagmentModel._oPersistencyPromise = oPersistencyPromise;

		assert.equal(this.oSmartVariantManagmentModel.getPersistencyPromise(), oPersistencyPromise, "should return correct persistency promise");
	});

	QUnit.module("getDefaultContextPath", {});

	QUnit.test("should return '/data'", function(assert) {
		assert.equal(SmartVariantManagementModel.getDefaultContextPath(), "/data", "should return correct default context path");
	});

	QUnit.module("getDefaultModelName", {});

	QUnit.test("should return '$sVM'", function(assert) {
		assert.equal(SmartVariantManagementModel.getDefaultModelName(), "$sVM", "should return correct default model name");
	});

	QUnit.module("destroy", {
		beforeEach: function() {
			this.oSmartVariantManagmentModel = new SmartVariantManagementModel();
		},
		afterEach: function() {
			this.oSmartVariantManagmentModel.destroy();
			this.oSmartVariantManagmentModel = undefined;
		}
	});

	QUnit.test("should cleanup internal properties", function(assert) {
		this.oSmartVariantManagmentModel._oPersistencyPromise = 1;
		this.oSmartVariantManagmentModel._sDefaultVariantId = 1;
		this.oSmartVariantManagmentModel._fResolveMetadataPromise = 1;
		this.oSmartVariantManagmentModel._oMetadataPromise = 1;
		this.oSmartVariantManagmentModel._aContexts = 1;

		this.oSmartVariantManagmentModel.destroy();

		assert.equal(this.oSmartVariantManagmentModel._oPersistencyPromise, null, "should clean up internal propert '_oPersistencyPromise'");
		assert.equal(this.oSmartVariantManagmentModel._sDefaultVariantId, null, "should clean up internal propert '_sDefaultVariantId'");
		assert.equal(this.oSmartVariantManagmentModel._fResolveMetadataPromise, null, "should clean up internal propert '_fResolveMetadataPromise'");
		assert.equal(this.oSmartVariantManagmentModel._oMetadataPromise, null, "should clean up internal propert '_oMetadataPromise'");
		assert.equal(this.oSmartVariantManagmentModel._aContexts, undefined, "should clean up internal propert '_aContexts'");
	});
});