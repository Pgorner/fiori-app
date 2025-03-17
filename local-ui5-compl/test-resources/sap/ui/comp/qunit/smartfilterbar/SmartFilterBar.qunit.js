/* globals QUnit, sinon */
sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/events/KeyCodes",
	"sap/ui/comp/smartfilterbar/SmartFilterBar",
	"sap/ui/comp/smartfilterbar/SmartFilterBarFilterGroupItem",
	"sap/ui/comp/filterbar/FilterBar",
	"sap/ui/comp/filterbar/FilterGroupItem",
	"sap/m/Input",
	"sap/m/ComboBox",
	"sap/m/CheckBox",
	"sap/m/TimePicker",
	"sap/m/DateTimePicker",
	"sap/m/DynamicDateRange",
	"sap/ui/core/library",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/json/JSONPropertyBinding",
	"sap/m/DatePicker",
	"sap/m/SearchField",
	"sap/m/MessageBox",
	"sap/m/DateRangeSelection",
	"sap/m/MultiInput",
	"sap/m/Select",
	"sap/ui/core/Control",
	'sap/ui/core/Item',
	'sap/ui/comp/smartfilterbar/FilterProvider',
	'sap/ui/comp/smartfilterbar/FilterProviderUtils',
	'sap/m/MultiComboBox',
	"sap/ui/comp/providers/ValueListProvider",
	"sap/ui/comp/odata/ODataModelUtil",
	"sap/ui/comp/filterbar/FilterItem",
	"sap/ui/qunit/utils/nextUIUpdate"
], function(
	Library,
	qutils,
	KeyCodes,
	SmartFilterBar,
	SmartFilterBarFilterGroupItem,
	FilterBar,
	FilterGroupItem,
	Input,
	ComboBox,
	CheckBox,
	TimePicker,
	DateTimePicker,
	DynamicDateRange,
	coreLibrary,
	JSONModel,
	JSONPropertyBinding,
	DatePicker,
	SearchField,
	MessageBox,
	DateRangeSelection,
	MultiInput,
	Select,
	Control,
	Item,
	FilterProvider,
	FilterProviderUtils,
	MultiComboBox,
	ValueListProvider,
	ODataModelUtil,
	FilterItem,
	nextUIUpdate
) {
	"use strict";

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState,
		oRB = Library.getResourceBundleFor("sap.ui.comp");

	QUnit.module("sap.ui.comp.smartfilterbar.SmartFilterBar", {
		beforeEach: function() {
			this.oSmartFilter = new SmartFilterBar();
			sinon.stub(this.oSmartFilter._oSmartVariantManagement, "_getDefaultVariantKey").returns("");
			sinon.stub(this.oSmartFilter._oSmartVariantManagement, "_handleGetChanges").returns("");
		},
		afterEach: function() {
			this.oSmartFilter.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oSmartFilter);
	});

	QUnit.test("Shall have entitySet property", function(assert) {
		this.oSmartFilter.setEntitySet("foo");
		assert.strictEqual(this.oSmartFilter.getEntitySet(), "foo");
	});

	/**
	 * @deprecated entityType Since 1.40. Use <code>entitySet</code> property instead of this one, to enable V4 annotation support
	 */
	QUnit.test("Shall have entityType property", function(assert) {
		this.oSmartFilter.setEntityType("foo");
		assert.strictEqual(this.oSmartFilter.getEntityType(), "foo");
	});

	/**
	 * @deprecated resourceUri Since 1.29. Set an ODataModel as the main model on your control/view instead
	 */
	QUnit.test("Shall have resourceUri property", function(assert) {
		this.oSmartFilter.setResourceUri("foo");
		assert.strictEqual(this.oSmartFilter.getResourceUri(), "foo");
	});

	QUnit.test("Shall have getFilters method", function(assert) {
		var aFilters = this.oSmartFilter.getFilters();
		assert.strictEqual(aFilters.length, 0);
	});

	QUnit.test("Shall delegate getFilters call to FilterProvider", function(assert) {
		var aVisibleFields = [
			"Company", "foo", "bar"
		];
		var aRequestedFields = [
			"foo", "Ledger"
		];
		var fVisibleFieldStub = sinon.stub(this.oSmartFilter, "_getVisibleFieldNames");
		fVisibleFieldStub.returns(aVisibleFields);
		this.oSmartFilter._oFilterProvider = {
			getFilters: sinon.stub(),
			getAnalyticParameters: sinon.stub().returns([])
		};

		this.oSmartFilter.getFilters();
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilters.calledOnce, true);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilters.calledWithExactly(aVisibleFields), true);

		this.oSmartFilter._oFilterProvider.getFilters.reset();

		this.oSmartFilter.getFilters(aRequestedFields);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilters.calledOnce, true);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilters.calledWithExactly(aRequestedFields), true);

		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("Check getFilters when called from ValueHelpDialog", function(assert) {
		// Arrange
		var oSmartFilter = this.oSmartFilter;
		oSmartFilter.setIsRunningInValueHelpDialog(true);
		oSmartFilter._getAllFieldNames = sinon.stub();
		oSmartFilter._getVisibleFieldNames = sinon.stub();

		// Act
		oSmartFilter.getFilters();

		// Assert
		assert.strictEqual(oSmartFilter._getAllFieldNames.calledOnce, true);
		assert.strictEqual(oSmartFilter._getVisibleFieldNames.notCalled, true);
	});

	QUnit.test("Shall delegate getFilledFilterData method to FilterProvider by default", function(assert) {
		this.oSmartFilter._oFilterProvider = {
			getFilterData: sinon.stub(),
			getFilledFilterData: sinon.stub()
		};
		this.oSmartFilter.getFilterData();
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilterData.calledOnce, false);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilledFilterData.calledOnce, true);
		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("Shall delegate getFilterDataAsString method to FilterProvider by default", function(assert) {
		this.oSmartFilter._oFilterProvider = {
			getFilterDataAsString: sinon.stub(),
			getFilledFilterDataAsString: sinon.stub()
		};
		this.oSmartFilter.getFilterDataAsString();
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilterDataAsString.calledOnce, false);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilledFilterDataAsString.calledOnce, true);
		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("getFilterDataAsStringForVariant should not convert integer ranges for DynamicDateRange to dates", function (assert) {
		// Arrange
		var oFilterData = {
			DateField: {
				"conditionTypeInfo": {
					"name": "sap.ui.comp.config.condition.DateRangeType",
					"data": {
						"operation": "TODAYFROMTO",
						"value1": 0,
						"value2": 13,
						"key": "DateField",
						"calendarType": "Gregorian"
					}
				},
				"ranges": [{
					"operation": "BT",
					"value1": new Date(2023, 2, 15),
					"value2": new Date(2023, 2, 16),
					"exclude": false,
					"keyField": "DateField"
				}]
			}
		};
		this.oSmartFilter._oFilterProvider = {};
		this.oSmartFilter.isInUTCMode = this.stub().returns(true);
		this.oSmartFilter._oFilterProvider._isSingleDynamicDateEnabled = this.stub().returns(false);
		this.oSmartFilter._aFilterBarViewMetadata = [{
			fields: [{
				fieldName: "DateField",
				filterType: "date"
			}]
		}];
		var oGetFilterData = this.stub(this.oSmartFilter, "getFilterData").returns(oFilterData);
		this.oSmartFilter._oFilterProvider._aFilterBarDateTimeFieldNames = [];
		this.oSmartFilter._oFilterProvider._aFilterBarTimeFieldNames = [];
		this.oSmartFilter._oFilterProvider._aFilterBarDateFieldNames = ["DateField"];

		// Act
		var sData = this.oSmartFilter.getFilterDataAsStringForVariant();
		var oResult = JSON.parse(sData);

		// Assert
		assert.ok(true, "No exception was thrown");
		assert.equal(oResult.DateField.conditionTypeInfo.data.value1, 0, "value1 should not be changed and still be 0");
		assert.equal(oResult.DateField.conditionTypeInfo.data.value2, 13, "value2 should not be changed and still be 13");

		// Cleanup
		oGetFilterData.restore();
	});

	QUnit.test("Shall delegate getFilterData method to FilterProvider if true is passed", function(assert) {
		this.oSmartFilter._oFilterProvider = {
			getFilterData: sinon.stub(),
			getFilledFilterData: sinon.stub()
		};
		this.oSmartFilter.getFilterData(true);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilterData.calledOnce, true);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilledFilterData.calledOnce, false);
		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("Shall delegate getFilterDataAsString method to FilterProvider if true is passed", function(assert) {
		this.oSmartFilter._oFilterProvider = {
			getFilterDataAsString: sinon.stub(),
			getFilledFilterDataAsString: sinon.stub()
		};
		this.oSmartFilter.getFilterDataAsString(true);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilterDataAsString.calledOnce, true);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilledFilterDataAsString.calledOnce, false);
		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("Shall delegate setFilterData method to FilterProvider", function(assert) {
		var oObj = {
			foo: "bar"
		};
		this.oSmartFilter._oFilterProvider = {
			setFilterData: sinon.stub()
		};
		this.oSmartFilter.setFilterData(oObj);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.setFilterData.calledOnce, true);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.setFilterData.calledWith(oObj), true);
		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("Shall delegate setFilterDataAsString method to FilterProvider", function(assert) {
		var sObj = "{\"foo\":\"bar\"}";
		this.oSmartFilter._oFilterProvider = {
			setFilterData: sinon.stub()
		};
		this.oSmartFilter.setFilterDataAsString(sObj);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.setFilterData.calledOnce, true);
		assert.strictEqual(JSON.stringify(this.oSmartFilter._oFilterProvider.setFilterData.args[0][0]), sObj);
		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("setFilterData should not call FilterProviders setFilterData if suspendSetFilterData is called", function (assert) {
		// Arrange
		var oObj1 = {
			foo1: "bar1"
		}, oObj2 = {
			foo2: "bar2"
		};
		var oExpected = {
			foo1: "bar1",
			foo2: "bar2"
		};
		this.oSmartFilter._oFilterProvider = {
			setFilterData: sinon.stub()
		};

		// Act
		this.oSmartFilter.suspendSetFilterData();
		this.oSmartFilter.setFilterData(oObj1);
		this.oSmartFilter.setFilterData(oObj2);

		// Assert
		assert.equal(this.oSmartFilter._oFilterProvider.setFilterData.callCount, 0, "FilterProviders setFilterData should not be called");
		assert.deepEqual(oExpected, this.oSmartFilter._oStoredFilterData);

		// Cleanup
		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("resumeSetFilterData should call setFilterData with stored data", function (assert) {
		// Arrange
		var oExpected = {
			foo1: "bar1",
			foo2: "bar2"
		};
		var oSmartFilterBarSetFilterDataSpy = this.spy(this.oSmartFilter, "_setFilterData");
		this.oSmartFilter._oFilterProvider = {
			setFilterData: sinon.stub()
		};
		this.oSmartFilter._bSetFilterDataSuspended = true;
		this.oSmartFilter._oStoredFilterData = oExpected;

		// Act
		this.oSmartFilter.resumeSetFilterData();

		// Assert
		assert.equal(this.oSmartFilter._oFilterProvider.setFilterData.callCount, 1, "FilterProviders setFilterData should be called once");
		assert.deepEqual(oExpected, this.oSmartFilter._oFilterProvider.setFilterData.args[0][0]);
		assert.equal(oSmartFilterBarSetFilterDataSpy.callCount, 1, "FilterBar _setFilterData should be called once");
		assert.deepEqual(oExpected, oSmartFilterBarSetFilterDataSpy.args[0][0]);

		// Cleanup
		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("Destroy", function(assert) {
		assert.equal(this.oSmartFilter.bIsDestroyed, undefined);
		this.oSmartFilter.destroy();
		assert.equal(this.oSmartFilter._oFilterProvider, null);
		assert.equal(this.oSmartFilter._aFilterBarViewMetadata, null);
		assert.strictEqual(this.oSmartFilter.bIsDestroyed, true);
	});

	QUnit.test("Shall pass the BasicSearchFieldName to the FilterProvider", function(assert) {

		sinon.stub(this.oSmartFilter, "_initializeVariantManagement");
		sinon.stub(this.oSmartFilter, "getModel");

		this.oSmartFilter.getModel.returns({
			getMetaModel: function() {
				return null;
			}
		});

		this.oSmartFilter.setBasicSearchFieldName("CompanyCode");

		// Call CUT
		var done = assert.async();
		this.oSmartFilter._createFilterProvider(this.oSmartFilter.getModel(), "", "COMPANIES", "").then(function(oFilterProvider) {
			assert.ok(oFilterProvider);
			assert.equal(oFilterProvider._sBasicSearchFieldName, "CompanyCode");
			done();
		});

	});

	QUnit.test("_handleControlConfigurationChanged shall set the visible property of the FilterItem", function(assert) {
		var oControlConfiguration, oFilterItem;
		oControlConfiguration = {
			getVisible: sinon.stub().returns(true),
			getKey: sinon.stub()
		};
		oFilterItem = {
			setVisible: sinon.stub()
		};
		this.oSmartFilter._getFilterItemByName = sinon.stub().returns(oFilterItem);

		// Call CUT
		this.oSmartFilter._handleControlConfigurationChanged({
			getParameter: sinon.stub().returns("visible"),
			oSource: oControlConfiguration
		});

		assert.ok(oFilterItem.setVisible.calledOnce);
		assert.strictEqual(oFilterItem.setVisible.args[0][0], true);
	});

	QUnit.test("_handleControlConfigurationChanged shall set the label property of the FilterItem", function(assert) {
		var oControlConfiguration, oFilterItem;
		oControlConfiguration = {
			getLabel: sinon.stub().returns("HelloWorld"),
			getKey: sinon.stub()
		};
		oFilterItem = {
			setLabel: sinon.stub()
		};
		this.oSmartFilter._getFilterItemByName = sinon.stub().returns(oFilterItem);

		// Call CUT
		this.oSmartFilter._handleControlConfigurationChanged({
			getParameter: sinon.stub().returns("label"),
			oSource: oControlConfiguration
		});

		assert.ok(oFilterItem.setLabel.calledOnce);
		assert.strictEqual(oFilterItem.setLabel.args[0][0], "HelloWorld");
	});

	QUnit.test("_handleControlConfigurationChanged shall set the visibleInFilterBar property of the FilterItem", function(assert) {
		var oControlConfiguration, oFilterItem;
		oControlConfiguration = {
			getVisibleInAdvancedArea: sinon.stub().returns(true),
			getKey: sinon.stub()
		};
		oFilterItem = {
			setVisibleInFilterBar: sinon.stub()
		};
		this.oSmartFilter._getFilterItemByName = sinon.stub().returns(oFilterItem);

		// Call CUT
		this.oSmartFilter._handleControlConfigurationChanged({
			getParameter: sinon.stub().returns("visibleInAdvancedArea"),
			oSource: oControlConfiguration
		});

		assert.ok(oFilterItem.setVisibleInFilterBar.calledOnce);
		assert.strictEqual(oFilterItem.setVisibleInFilterBar.args[0][0], true);
	});

	QUnit.test("fireSearch shall call _validateMandatoryFields and show an error message if empty fields exist", function(assert) {
		var sinonClock = sinon.useFakeTimers();

		sinon.stub(this.oSmartFilter, "setFilterBarExpanded");
		this.oSmartFilter._validateMandatoryFields = sinon.stub().returns(false);
		MessageBox.show = sinon.stub();
		this.oSmartFilter.fireEvent = sinon.stub();

		this.oSmartFilter.search();
		sinonClock.tick(SmartFilterBar.LIVE_MODE_INTERVAL);

		assert.strictEqual(this.oSmartFilter._validateMandatoryFields.called, true);
		assert.strictEqual(this.oSmartFilter.fireEvent.called, false);
		assert.strictEqual(MessageBox.show.notCalled, true);

		this.oSmartFilter.setShowMessages(true);
		this.oSmartFilter.search();
		sinonClock.tick(SmartFilterBar.LIVE_MODE_INTERVAL);

		assert.strictEqual(MessageBox.show.calledOnce, true);

		this.oSmartFilter._validateMandatoryFields.returns(true);
		MessageBox.show.reset();
		this.oSmartFilter.fireEvent.reset();

		this.oSmartFilter.search();
		sinonClock.tick(SmartFilterBar.LIVE_MODE_INTERVAL);

		assert.strictEqual(this.oSmartFilter._validateMandatoryFields.called, true);
		assert.strictEqual(this.oSmartFilter.fireEvent.calledOnce, true);
		assert.strictEqual(MessageBox.show.called, false);

		sinonClock.restore();
	});

	QUnit.test("_validateMandatoryFields shall return true if no empty mandatory fields exist/default", function(assert) {
		var bContinue = this.oSmartFilter._validateMandatoryFields();

		assert.strictEqual(bContinue, true);
	});

	QUnit.test("_validateMandatoryFields shall return true if no empty mandatory fields (modelled) exist", function(assert) {
		var oData, aFilterItems, bContinue = false;
		oData = {
			foo: "bar"
		};
		aFilterItems = [
			{
				getName: sinon.stub().returns("foo"),
				getKey: sinon.stub(),
				data: sinon.stub().returns(false),
				getLabel: sinon.stub().returns("Label")
			}
		];
		this.oSmartFilter.getFilterData = sinon.stub().returns(oData);
		this.oSmartFilter.determineMandatoryFilterItems = sinon.stub().returns(aFilterItems);
		this.oSmartFilter._determineControlByFilterItem = sinon.stub().returns(new Input());

		bContinue = this.oSmartFilter._validateMandatoryFields();
		assert.strictEqual(bContinue, true);
	});

	QUnit.test("_validateMandatoryFields shall return true if no empty mandatory fields (custom) exist", function(assert) {
		var oData = {}, aFilterItems, bContinue = false;
		aFilterItems = [
			{
				getName: sinon.stub().returns("foo"),
				getKey: sinon.stub(),
				data: sinon.stub().returns(true),
				getLabel: sinon.stub().returns("Label")
			}
		];
		this.oSmartFilter.getFilterData = sinon.stub().returns(oData);
		this.oSmartFilter.determineMandatoryFilterItems = sinon.stub().returns(aFilterItems);
		this.oSmartFilter._determineControlByFilterItem = sinon.stub().returns(new Input({
			value: "bar"
		}));

		bContinue = this.oSmartFilter._validateMandatoryFields();
		assert.strictEqual(bContinue, true);
	});

	QUnit.test("_validateMandatoryFields shall return false if an empty mandatory field (modelled) exist", function(assert) {
		var oData, aFilterItems, bContinue = false;
		oData = {
			foo: ""
		};
		aFilterItems = [
			{
				getName: sinon.stub().returns("foo"),
				getKey: sinon.stub(),
				data: sinon.stub().returns(false),
				getLabel: sinon.stub().returns("Label")
			}
		];
		this.oSmartFilter.getFilterData = sinon.stub().returns(oData);
		this.oSmartFilter.determineMandatoryFilterItems = sinon.stub().returns(aFilterItems);
		this.oSmartFilter._determineControlByFilterItem = sinon.stub().returns(new Input());

		bContinue = this.oSmartFilter._validateMandatoryFields();
		assert.strictEqual(bContinue, false);
	});

	QUnit.test("_validateMandatoryFields shall set ValueStateErrorText that includes the label of the field", function(assert) {
		// Arrange
		var sLabel = "Some Label",
			oInput = new Input(),
			oData = {
				foo: ""
			},
			aFilterItems = [
				{
					getName: sinon.stub().returns("foo"),
					getKey: sinon.stub(),
					data: sinon.stub().returns(false),
					getLabel: sinon.stub().returns(sLabel)
				}
			];
		this.oSmartFilter.getFilterData = sinon.stub().returns(oData);
		this.oSmartFilter.determineMandatoryFilterItems = sinon.stub().returns(aFilterItems);
		this.oSmartFilter._determineControlByFilterItem = sinon.stub().returns(oInput);

		// Act
		this.oSmartFilter._validateMandatoryFields();

		// Assert
		assert.equal(oInput.getValueStateText(), oRB.getText("MANDATORY_FIELD_WITH_LABEL_ERROR", [sLabel]), "Error message is correct");

		// Cleanup
		oInput.destroy();
	});

	QUnit.test("_validateMandatoryFields shall set generic ValueStateErrorText if there is no label", function(assert) {
		// Arrange
		var	oInput = new Input(),
			oData = {
				foo: ""
			},
			aFilterItems = [
				{
					getName: sinon.stub().returns("foo"),
					getKey: sinon.stub(),
					data: sinon.stub().returns(false),
					getLabel: sinon.stub()
				}
			];
		this.oSmartFilter.getFilterData = sinon.stub().returns(oData);
		this.oSmartFilter.determineMandatoryFilterItems = sinon.stub().returns(aFilterItems);
		this.oSmartFilter._determineControlByFilterItem = sinon.stub().returns(oInput);

		// Act
		this.oSmartFilter._validateMandatoryFields();

		// Assert
		assert.equal(oInput.getValueStateText(), oRB.getText("MANDATORY_FIELD_ERROR"), "Label is correctly included in the error text");

		// Cleanup
		oInput.destroy();
	});

	QUnit.test("_validateMandatoryFields shall return false if an empty mandatory field (Custom) exist", function(assert) {
		var oData = {}, aFilterItems, bContinue = false;
		aFilterItems = [
			{
				getName: sinon.stub().returns("foo"),
				getKey: sinon.stub(),
				data: sinon.stub().returns(true),
				getLabel: sinon.stub().returns("Label")
			}
		];
		this.oSmartFilter.getFilterData = sinon.stub().returns(oData);
		this.oSmartFilter.determineMandatoryFilterItems = sinon.stub().returns(aFilterItems);
		this.oSmartFilter._determineControlByFilterItem = sinon.stub().returns(new Input());

		bContinue = this.oSmartFilter._validateMandatoryFields();
		assert.strictEqual(bContinue, false);
	});

	QUnit.test("check getFiltersWithValues", function(assert) {

		var Control = function() {
			Control.prototype.getValue = function() {
				return "X";
			};
			Control.prototype.data = function(s) {
				return true;
			};
			Control.prototype.isA = function () {
				return false;
			};
		};

		var FilterItem = function(sName) {
			this.sName = sName;
			FilterItem.prototype.data = function(s) {
				return {};
			};
			FilterItem.prototype.getName = function() {
				return this.sName;
			};
		};

		var aFilterItems = [
			new FilterItem("A"), new FilterItem("B"), new FilterItem("C"), new FilterItem("D")
		];

		var oData = [];
		oData["B"] = "X";

		aFilterItems[2].data = sinon.stub().returns(null);
		aFilterItems[1].data = sinon.stub().returns(null);

		this.oSmartFilter.getAllFilterItems = sinon.stub().returns(aFilterItems);
		this.oSmartFilter.getFilterData = sinon.stub().returns(oData);
		this.oSmartFilter._determineControlByFilterItem = sinon.stub();
		this.oSmartFilter._determineControlByFilterItem.withArgs(aFilterItems[0]).returns(new Control()); // getValue
		this.oSmartFilter._determineControlByFilterItem.withArgs(aFilterItems[1]).returns(new Control()); // odata value
		this.oSmartFilter._determineControlByFilterItem.withArgs(aFilterItems[2]).returns(new Control()); // odata no value
		this.oSmartFilter._determineControlByFilterItem.withArgs(aFilterItems[3]).returns(null); // no control

		var aFiltersWithValues = this.oSmartFilter.getFiltersWithValues();
		assert.ok(aFiltersWithValues);
		assert.equal(aFiltersWithValues.length, 2);
	});

	QUnit.test("check _getFiltersWithAssignedValues", function(assert) {
		// Arrange
		var Control = function() {
			Control.prototype.getValue = function() {
				return "X";
			};
			Control.prototype.data = function(s) {
				return true;
			};
			Control.prototype.isA = function () {
				return false;
			};
		};

		var FilterItem = function(sName) {
			this.sName = sName;
			FilterItem.prototype.data = function(s) {
				return {};
			};
			FilterItem.prototype.getName = function() {
				return this.sName;
			};
		};

		var aFilterItems = [
			new FilterItem("A"), new FilterItem("B"), new FilterItem("C"), new FilterItem("D")
		];

		var oData = [];
		oData["B"] = "X";
		this.oSmartFilter._oStoredFilterData = oData;

		aFilterItems[2].data = sinon.stub().returns(null);
		aFilterItems[1].data = sinon.stub().returns(null);

		this.oSmartFilter._oFilterProvider = new FilterProvider();
		this.oSmartFilter._bSetFilterDataSuspended = true;
		this.oSmartFilter.getAllFilterItems = sinon.stub().returns(aFilterItems);
		this.oSmartFilter._determineControlByFilterItem = sinon.stub();
		this.oSmartFilter._determineControlByFilterItem.withArgs(aFilterItems[0]).returns(new Control()); // getValue
		this.oSmartFilter._determineControlByFilterItem.withArgs(aFilterItems[1]).returns(new Control()); // odata value
		this.oSmartFilter._determineControlByFilterItem.withArgs(aFilterItems[2]).returns(new Control()); // odata no value
		this.oSmartFilter._determineControlByFilterItem.withArgs(aFilterItems[3]).returns(null); // no control

		// Act
		var aFiltersWithValues = this.oSmartFilter._getFiltersWithAssignedValues(false);

		// Assert
		assert.ok(aFiltersWithValues);
		assert.equal(aFiltersWithValues.length, 2);

		// // Act
		// this.oSmartFilter._getFiltersWithAssignedValues(false);
	});

	QUnit.test("check _checkForValues", function(assert) {
		var FilterItem = function(sName) {
			this.sName = sName;
			FilterItem.prototype.data = function(s) {
				return {};
			};
			FilterItem.prototype.getName = function() {
				return this.sName;
			};
		};

		var oFilterItem = new FilterItem("A");
		var oControl = new Input();
		sinon.spy(oControl, 'getValue');

		oControl.data("hasValue", true);
		var bHasValue = this.oSmartFilter._checkForValues({}, oFilterItem, oControl);
		assert.equal(bHasValue, true);

		oControl.data("hasValue", false);
		bHasValue = this.oSmartFilter._checkForValues({}, oFilterItem, oControl);
		assert.equal(bHasValue, false);

		oControl.data("hasValue", null);
		bHasValue = this.oSmartFilter._checkForValues({}, oFilterItem, oControl);
		assert.equal(bHasValue, false); // via getValue
		assert.ok(oControl.getValue.calledOnce);

		oControl.data("hasValue", "false");
		bHasValue = this.oSmartFilter._checkForValues({}, oFilterItem, oControl);
		assert.equal(bHasValue, false);

		oControl.data("hasValue", "true");
		bHasValue = this.oSmartFilter._checkForValues({}, oFilterItem, oControl);
		assert.equal(bHasValue, true);
	});

	QUnit.test("check setFilterDataAsStringFromVariant if the field is of type Edm.DateTimeOffset and is not saved " +
		"in the variant and has filterType=auto (no filter restriction is given)", function (assert) {

		// Arrange
		var sJson = "{}";
		this.oSmartFilter._aFilterBarViewMetadata = [{
			groupName: "G1",
			fields: [{
				fieldName: "DTOffset",
				type: "Edm.DateTimeOffset",
				filterRestriction: "auto"
			}]
		}];
		this.oSmartFilter._oFilterProvider = {
			_aFilterBarDateFieldNames: [],
			_aFilterBarTimeFieldNames: [],
			_aFilterBarDateTimeFieldNames: ["DTOffset"]
		};
		this.oSmartFilter.setFilterData = sinon.stub();

		// Act
		this.oSmartFilter.setFilterDataAsStringFromVariant(sJson);

		// Assert
		assert.ok(true, "No exception thrown");
	});

	QUnit.test("check _checkForValues for Select control; special handling for Edm.Boolean", function(assert) {
		var FilterItem = function(sName) {
			this.sName = sName;
			FilterItem.prototype.data = function(s) {
				return false;
			};
			FilterItem.prototype.getName = function() {
				return this.sName;
			};
		};

		this.oSmartFilter._aFilterBarViewMetadata = [ {groupName: "G1", fields: [ {fieldName: "Bool", type: "Edm.Boolean"}, {fieldName: "String", type: "Edm.String"} ]}];


		var oFilterItem = new FilterItem("Bool");
		var oControl = new Select();
		var oItem = new Item({
			key: "",
			text: ""
		});
		oControl.addItem(oItem);
		oControl.setSelectedItem(oItem);


		var bHasValue = this.oSmartFilter._checkForValues({ String: "BBB"}, oFilterItem, oControl);
		assert.ok(!bHasValue);

		bHasValue = this.oSmartFilter._checkForValues({ Bool: "true", String: "BBB"}, oFilterItem, oControl);
		assert.ok(bHasValue);

		oFilterItem = new FilterItem("String");

		bHasValue = this.oSmartFilter._checkForValues({}, oFilterItem, oControl);
		assert.ok(bHasValue);

		bHasValue = this.oSmartFilter._checkForValues({ Bool: "true", String: "BBB"}, oFilterItem, oControl);
		assert.ok(bHasValue);
	});

	QUnit.test("_checkForValues for MultiInput control when hasValue data is forgotten tries to get value from the tokens", function (assert) {
		// Arrange
		var oFilterItemStub = {
				data: this.stub().withArgs("isCustomField").returns(true),
				getName: function(){}
			},
			oMultiInputStub = {
				data: this.stub().withArgs("hasValue").returns(undefined),
				getTokens: this.stub().returns(["value 1"])
			},
			bResult;

		// Act
		bResult = this.oSmartFilter._checkForValues({}, oFilterItemStub, oMultiInputStub);

		// Assert
		assert.equal(oMultiInputStub.getTokens.callCount, 1, "getTokens method is called once");
		assert.equal(bResult, true, "_checkForValues returns true if MultiInput has at least one token");
	});

	QUnit.test("check _checkForValues for Input control; special handling for Edm.Int", function(assert) {
		var FilterItem = function(sName) {
			this.sName = sName;
			FilterItem.prototype.data = function(s) {
				return false;
			};
			FilterItem.prototype.getName = function() {
				return this.sName;
			};
		};

		this.oSmartFilter._aFilterBarViewMetadata = [ {groupName: "G1", fields: [ {fieldName: "Int", type: "Edm.Int16"} ]}];


		var oFilterItem = new FilterItem("Int");
		var oControl = new Input();
		oControl.setValue(0);


		var bHasValue = this.oSmartFilter._checkForValues({ Int: 0}, oFilterItem, oControl);
		assert.ok(bHasValue);
	});

	QUnit.test("_onCustomFieldCustomDataChange updates the toolbar text if there is change in hasValue of the customData", function (assert) {
		// Arrange
		var oUpdateToolbarTextSpy = this.spy(this.oSmartFilter, "_updateToolbarText"),
			oGetParamStub = this.stub(),
			oEvent = { getParameter: oGetParamStub };

		oGetParamStub.withArgs("newValue").returns("true");
		oGetParamStub.withArgs("oldValue").returns("false");
		oGetParamStub.withArgs("name").returns("value");

		// Act
		this.oSmartFilter._onCustomFieldCustomDataChange(oEvent);

		// Assert
		assert.equal(oUpdateToolbarTextSpy.callCount, 1, "_updateToolbarText should be called once");

		// Cleanup
		oUpdateToolbarTextSpy.restore();
	});

	QUnit.test("_onCustomFieldCustomDataChange should fire assignedFilterChange event if old and new values are different", function (assert) {
		// Arrange
		var oGetParamStub = this.stub(),
			oFireAssignedFiltersChangedSpy = this.spy(this.oSmartFilter, "fireAssignedFiltersChanged"),
			oEvent = { getParameter: oGetParamStub };

		oGetParamStub.withArgs("newValue").returns("true");
		oGetParamStub.withArgs("oldValue").returns("false");
		oGetParamStub.withArgs("name").returns("value");

		// Act
		this.oSmartFilter._onCustomFieldCustomDataChange(oEvent);

		// Assert
		assert.equal(oFireAssignedFiltersChangedSpy.callCount, 1, "fireAssignedFiltersChanged should be called once");

		// Cleanup
		oFireAssignedFiltersChangedSpy.restore();
	});

	QUnit.test("_attachCustomControlCustomDataChange attaches to the _change event of custom data with key 'hasValue'", function (assert) {
		// Arrange
		var oHasValueCustomData = {
				getKey: this.stub().returns("hasValue"),
				attachEvent: this.spy()
			},
			oOtherCustomData = {
				getKey: this.stub().returns("some key"),
				attachEvent: this.spy()
			},
			aCustomData = [oOtherCustomData, oHasValueCustomData];

		// Act
		this.oSmartFilter._attachCustomControlCustomDataChange(aCustomData);

		// Assert
		assert.equal(oOtherCustomData.attachEvent.callCount, 0, "attachEvent should not be called on custom data with different key than 'hasValue'");
		assert.equal(oHasValueCustomData.attachEvent.callCount, 1, "attachEvent should be called on custom data with key 'hasValue'");
	});

	QUnit.test("check initialise event with variant management", function(assert) {

		var oInitialized = 0;
		assert.ok(this.oSmartFilter._oSmartVariantManagement);

		this.oSmartFilter._oSmartVariantManagement.initialise = function() {
			oInitialized++;
		};
		sinon.stub(this.oSmartFilter._oSmartVariantManagement, "addPersonalizableControl");
		sinon.stub(this.oSmartFilter, "_setInitialFocus");

		this.oSmartFilter.setPersistencyKey("DUMMY");

		this.oSmartFilter._initializeVariantManagement();

		assert.equal(oInitialized, 1);

	});

	QUnit.test("check initialise with custom data executeStandardVariantOnSelect", function(assert) {

		if (this.oSmartFilter._oSmartVariantManagement) {
			this.oSmartFilter._oSmartVariantManagement.destroy();
			this.oSmartFilter._oSmartVariantManagement = null;
			this.oSmartFilter._oVariantManagement = null;
		}

		this.oSmartFilter.attachInitialise(function() {});

		this.oSmartFilter.data("executeStandardVariantOnSelect", true);
		this.oSmartFilter._createVariantManagement();
		assert.ok(this.oSmartFilter._oSmartVariantManagement);

		this.oSmartFilter._oSmartVariantManagement.initialise = function() {
			this.oSmartFilter.fireInitialise();
		}.bind(this);
		sinon.stub(this.oSmartFilter._oSmartVariantManagement, "addPersonalizableControl");
		sinon.stub(this.oSmartFilter, "_setInitialFocus");
		this.oSmartFilter.setPersistencyKey("DUMMY");

		assert.ok(!this.oSmartFilter._oSmartVariantManagement.bExecuteOnSelectForStandardViaXML);

		this.oSmartFilter._oSmartVariantManagement._mVariants = { test: "TEST"};
		sinon.stub(this.oSmartFilter._oSmartVariantManagement, "flWriteOverrideStandardVariant");
		sinon.stub(this.oSmartFilter._oSmartVariantManagement, "_getVariantById");

		this.oSmartFilter._initializeVariantManagement();

		assert.ok(this.oSmartFilter._oSmartVariantManagement.bExecuteOnSelectForStandardViaXML);

	});

	QUnit.test("check initialise event without persistency key", function(assert) {

		var oInitialize = 0;
		var oInitialized = 0;

		this.oSmartFilter.attachInitialise(function() {
			oInitialize++;
		});
		this.oSmartFilter.attachInitialized(function() {
			oInitialized++;
		});

		assert.ok(this.oSmartFilter._oSmartVariantManagement);

		sinon.stub(this.oSmartFilter._oSmartVariantManagement, "initialise");
		sinon.stub(this.oSmartFilter, "_setInitialFocus");

		this.oSmartFilter._initializeVariantManagement();

		assert.ok(!this.oSmartFilter._oSmartVariantManagement.initialise.called);

		assert.equal(oInitialize, 1);
		assert.equal(oInitialized, 1);
	});

	QUnit.test("check initialise event without smart variant control", function(assert) {

		var oInitialized = 0;
		this.oSmartFilter.attachInitialise(function() {
			oInitialized++;
		});

		this.oSmartFilter.setPersistencyKey("DUMMY");
		sinon.stub(this.oSmartFilter._oSmartVariantManagement, "initialise");
		sinon.stub(this.oSmartFilter, "_setInitialFocus");
		this.oSmartFilter._oSmartVariantManagement = null;

		this.oSmartFilter._initializeVariantManagement();

		assert.equal(oInitialized, 1);
	});

	QUnit.test("check _getFilterInformation", function(assert) {
		var oBasicSearch = sinon.createStubInstance(SearchField);
		this.oSmartFilter.data("hiddenFields", ["CONTINENT"]);
		this.oSmartFilter._aFilterBarViewMetadata = [
			{
				"groupName": "_BASIC",
				"fields": [
					{
						"name": "_BASIC_SEARCH_FIELD",
						"type": "Edm.String",
						"filterRestriction": "single_value",
						"isCustomFilterField": false,
						"groupId": "_BASIC",
						"control": oBasicSearch
					}
				]
			}, {
				"groupName": "_BASIC",
				"fields": [
					{
						"fieldName": "BLDAT",
						"type": "Edm.DateTime",
						"filterRestriction": "multiple",
						"isCustomFilterField": false,
						"groupId": "_BASIC",
						"control": {}
					}
				]
			}, {
				"groupName": "GROUP1",
				"fields": [
					{
						"fieldName": "BLDAT2",
						"type": "Edm.DateTime",
						"filterRestriction": "multiple",
						"isCustomFilterField": false,
						"groupId": "GROUP1",
						"control": {}
					},
					{
						"name": "CONTINENT",
						"fieldName": "CONTINENT",
						"type": "Edm.String",
						"isCustomFilterField": false,
						"groupId": "GROUP1",
						"control": {}
					}
				]
			}
		];

		this.oSmartFilter._oFilterProvider = {
			getAnalyticParameters: sinon.stub().returns([
				{
					fieldName: "A_PARA"
				}
			])
		};

		sinon.stub(this.oSmartFilter, "setBasicSearch");
		sinon.spy(this.oSmartFilter, "_createFieldInAdvancedArea");
		sinon.spy(this.oSmartFilter, "_createAnalyticParameter");

		sinon.stub(this.oSmartFilter, "_handleEnter");
		sinon.stub(this.oSmartFilter, "_handleChange");

		var aFields = this.oSmartFilter._getFilterInformation();
		assert.ok(aFields);
		assert.equal(aFields.length, 3);

		assert.equal(aFields[0].fieldName, "BLDAT");
		assert.equal(aFields[0].groupName, "__$INTERNAL$");
		assert.ok(aFields[0].factory);

		assert.equal(aFields[1].fieldName, "BLDAT2");
		assert.equal(aFields[1].groupName, "GROUP1");
		assert.ok(aFields[1].factory);

		assert.equal(aFields[2].fieldName, "A_PARA");
		assert.equal(aFields[2].groupName, "__$INTERNAL$");
		assert.ok(aFields[2].factory);

		assert.ok(this.oSmartFilter.setBasicSearch.calledOnce);
		assert.equal(this.oSmartFilter._createFieldInAdvancedArea.called, true);
		assert.ok(this.oSmartFilter._createAnalyticParameter.calledOnce);

		// Clean
		this.oSmartFilter.data("hiddenFields", null);
	});

	QUnit.test("check addFieldToAdvancedArea ", function(assert) {
		var bVisibleInAdvancedArea = false;
		var oFilterItem = {
			setVisibleInFilterBar: function(bFlag) {
				bVisibleInAdvancedArea = bFlag;
			}
		};

		sinon.stub(this.oSmartFilter, "_getFilterItemByName").returns(oFilterItem);
		assert.ok(!bVisibleInAdvancedArea);
		this.oSmartFilter.addFieldToAdvancedArea("");
		assert.ok(bVisibleInAdvancedArea);
	});

	QUnit.test("check getConditionTypeByKey", function(assert) {

		var oFilterProvider = {
			_mConditionTypeFields: {
				dummy: {
					conditionType: "conditionType"
				}
			}
		};
		this.oSmartFilter._oFilterProvider = oFilterProvider;

		var conditionType = this.oSmartFilter.getConditionTypeByKey("dummy");
		assert.strictEqual(conditionType, "conditionType");
	});

	QUnit.test("check getConditionTypeByKey for Parameters", function(assert) {

		var oFilterProvider = {
			_mConditionTypeFields: {
				"$Parameter.dummy": {
					conditionType: "conditionType"
				}
			}
		};
		this.oSmartFilter._oFilterProvider = oFilterProvider;

		var conditionType = this.oSmartFilter.getConditionTypeByKey("dummy");
		assert.strictEqual(conditionType, "conditionType");
	});

	QUnit.test("check getDateRangeTypeByKey", function(assert) {

		// Arrange
		var aPromises = [],
			done = assert.async(),
			fnGetFilterDataStub = this.stub(this.oSmartFilter, "getFilterData").returns({
				DateField: "Value"
			}),
			fnGetInitializedPromiseStub = this.stub(this.oSmartFilter, "getInitializedPromise").returns(Promise.resolve());
		this.oSmartFilter._oFilterProvider = {
			_mConditionTypeFields: {
				dummy: {
					conditionType: "conditionType"
				}
			}
		};

		// Act
		var pPromise = this.oSmartFilter.getDateRangeTypeByKey("dummy").then(function (bResult) {
			// Assert
			assert.strictEqual(bResult, "conditionType");
		});
		aPromises.push(pPromise);

		// Cleanup
		Promise.all(aPromises).then(function () {
			done();
		});
		fnGetFilterDataStub.restore();
		fnGetInitializedPromiseStub.restore();
	});

	QUnit.test("check getConditionTypeByKey for Parameters", function(assert) {

		// Arrange
		var aPromises = [],
			done = assert.async(),
			fnGetFilterDataStub = this.stub(this.oSmartFilter, "getFilterData").returns({
				DateField: "Value"
			}),
			fnGetInitializedPromiseStub = this.stub(this.oSmartFilter, "getInitializedPromise").returns(Promise.resolve());
		this.oSmartFilter._oFilterProvider = {
			_mConditionTypeFields: {
				"$Parameter.dummy": {
					conditionType: "conditionType"
				}
			}
		};

		// Act
		var pPromise = this.oSmartFilter.getDateRangeTypeByKey("dummy").then(function (bResult) {
			// Assert
			assert.strictEqual(bResult, "conditionType");
		});
		aPromises.push(pPromise);

		// Cleanup
		Promise.all(aPromises).then(function () {
			done();
		});
		fnGetFilterDataStub.restore();
		fnGetInitializedPromiseStub.restore();
	});

	QUnit.test("check setDateRangeTypeOperationByKey", function(assert) {
		// Arrange
		var aPromises = [],
			done = assert.async(),
			fnGetFilterDataStub = this.stub(this.oSmartFilter, "getFilterData").returns({
				DateField: "Value"
			}),
			fnGetInitializedPromiseStub = this.stub(this.oSmartFilter, "getInitializedPromise").returns(Promise.resolve());
		this.oSmartFilter._oFilterProvider = {
			_mConditionTypeFields: {
				dummy: {
					conditionType: {
						setOperation: function (sOperation) {
							this._sOperation = sOperation;
						},
						getOperation: function () {
							return this._sOperation;
						}
					}
				}
			}
		};

		// Assert
		assert.strictEqual(this.oSmartFilter._oFilterProvider._mConditionTypeFields["dummy"].conditionType.getOperation(), undefined);

		// Act
		var pPromise = this.oSmartFilter.setDateRangeTypeOperationByKey("dummy","TODAY").then(function () {

			// Assert
			assert.strictEqual(this.oSmartFilter._oFilterProvider._mConditionTypeFields["dummy"].conditionType.getOperation(), "TODAY");

		}.bind(this));
		aPromises.push(pPromise);

		// Cleanup
		Promise.all(aPromises).then(function () {
			done();
		});

		fnGetFilterDataStub.restore();
		fnGetInitializedPromiseStub.restore();
	});

	QUnit.test("check setDateRangeTypeOperationByKey for Parameters", function(assert) {
		// Arrange
		var aPromises = [],
			done = assert.async(),
			fnGetFilterDataStub = this.stub(this.oSmartFilter, "getFilterData").returns({
				DateField: "Value"
			}),
			fnGetInitializedPromiseStub = this.stub(this.oSmartFilter, "getInitializedPromise").returns(Promise.resolve());
		this.oSmartFilter._oFilterProvider = {
			_mConditionTypeFields: {
				"$Parameter.dummy": {
					conditionType: {
						setOperation: function (sOperation) {
							this._sOperation = sOperation;
						},
						getOperation: function () {
							return this._sOperation;
						}
					}
				}
			}
		};

		// Assert
		assert.strictEqual(this.oSmartFilter._oFilterProvider._mConditionTypeFields["$Parameter.dummy"].conditionType.getOperation(), undefined);

		// Act
		var pPromise = this.oSmartFilter.setDateRangeTypeOperationByKey("dummy","TODAY").then(function () {

			// Assert
			assert.strictEqual(this.oSmartFilter._oFilterProvider._mConditionTypeFields["$Parameter.dummy"].conditionType.getOperation(), "TODAY");

		}.bind(this));
		aPromises.push(pPromise);

		// Cleanup
		Promise.all(aPromises).then(function () {
			done();
		});

		fnGetFilterDataStub.restore();
		fnGetInitializedPromiseStub.restore();
	});

	QUnit.test("check setSmartVariant", function(assert) {

		var oControl = new Input({
			id: "dummy"
		});

		var aAssoc = this.oSmartFilter.getAssociation("smartVariant");
		assert.ok(!aAssoc);

		this.oSmartFilter.setSmartVariant(oControl.getId());

		aAssoc = this.oSmartFilter.getAssociation("smartVariant");
		assert.ok(aAssoc);

		oControl.destroy();
	});

	QUnit.test("check getSmartVariant", function(assert) {

		var oControl = new Input({
			id: "dummy"
		});

		sinon.stub(this.oSmartFilter, "getAssociation").returns(oControl.getId());
		var oSV = this.oSmartFilter.getSmartVariant();
		assert.ok(oSV);
		assert.strictEqual(oSV, oControl);

		sinon.stub(this.oSmartFilter, "getAdvancedMode").returns(true);
		oSV = this.oSmartFilter.getSmartVariant();
		assert.ok(!oSV);

		oControl.destroy();

	});

	QUnit.test("check fireReset", function(assert) {
		sinon.spy(this.oSmartFilter, "fireEvent");
		this.oSmartFilter.fireReset();

		assert.ok(this.oSmartFilter.fireEvent.called);
	});

	QUnit.test("check fireClear", function(assert) {
		sinon.spy(this.oSmartFilter, "fireEvent");
		this.oSmartFilter.fireClear();

		assert.ok(this.oSmartFilter.fireEvent.called);
	});

	QUnit.test("valueListAnnotationLoaded event is fired only one time when SmartFilterBar suppressValueListsAssociation is true and field with VHD annotations loaded ", function(assert) {
		// Arrange
		var done = assert.async(),
		oPromise = new Promise(function(resolve) {
			resolve();
		});
		this.stub(this.oSmartFilter, "getSuppressValueListsAssociation").returns(true);
		this.oSmartFilter._oFilterProvider = new FilterProvider();
		this.oSmartFilter._oFilterProvider.aFilterAnnotations = [oPromise];

		// Act
		this.oSmartFilter._createVisibleFilters();
		this.oSmartFilter.associateValueLists();

		// Assert
		this.oSmartFilter.attachEventOnce("valueListAnnotationLoaded", function(oControlElement){
			// Assert
			assert.ok(oControlElement.oSource._oFilterProvider, "FilterProvider is initialized and attached to SmartFilterBar");
			assert.equal(oControlElement.oSource._oFilterProvider.aFilterAnnotations.length, 1, "The correct FilterProvider with one Promise in the aFilterAnnotations is attached to SmartFilterBar");
			done();
		});
	});

	QUnit.test("valueListAnnotationLoaded event is fired only one time when SmartFilterBar suppressValueListsAssociation is false and field with VHD annotations loaded", function(assert) {
		// Arrange
		var done = assert.async(),
		oPromise = new Promise(function(resolve) {
			resolve();
		});
		this.stub(this.oSmartFilter, "getSuppressValueListsAssociation").returns(false);
		this.oSmartFilter._oFilterProvider = new FilterProvider();
		this.oSmartFilter._oFilterProvider.aFilterAnnotations = [oPromise];

		// Act
		this.oSmartFilter._createVisibleFilters();
		this.oSmartFilter.associateValueLists();

		// Assert
		this.oSmartFilter.attachEventOnce("valueListAnnotationLoaded", function(oControlElement){
			// Assert
			assert.ok(oControlElement.oSource._oFilterProvider, "FilterProvider is initialized and attached to SmartFilterBar");
			assert.equal(oControlElement.oSource._oFilterProvider.aFilterAnnotations.length, 1, "The correct FilterProvider with one Promise in the aFilterAnnotations is attached to SmartFilterBar");
			done();
		});
	});

	QUnit.test("valueListAnnotationLoaded event is fired even when SmartFilterBar field without VHD annotations loaded", function(assert) {
		// Arrange
		var done = assert.async();
		this.stub(this.oSmartFilter, "getSuppressValueListsAssociation").returns(true);
		this.oSmartFilter._oFilterProvider = new FilterProvider();
		this.oSmartFilter._oFilterProvider.aFilterAnnotations = [];

		// Act
		this.oSmartFilter._createVisibleFilters();
		this.oSmartFilter.associateValueLists();

		// Assert
		this.oSmartFilter.attachEventOnce("valueListAnnotationLoaded", function(oControlElement){
			// Assert
			assert.ok(oControlElement.oSource._oFilterProvider, "FilterProvider is initialized and attached to SmartFilterBar");
			assert.equal(oControlElement.oSource._oFilterProvider.aFilterAnnotations.length, 0, "The correct FilterProvider with empty aFilterAnnotations is attached to SmartFilterBar");
			done();
		});
	});

	QUnit.test("_refreshFiltersCountOnValueListAnnotationLoaded is called when _createVisibleFilters is called", function(assert) {
		// Arrange
		var done = assert.async(),
			oPromise = new Promise(function(resolve) {
				resolve();
			}),
			fnResolve,
			oPromiseValueLists = new Promise(function(resolve) {
				fnResolve = resolve;
			});

		this.stub(this.oSmartFilter, "_refreshFiltersCountOnValueListAnnotationLoaded");
		this.stub(this.oSmartFilter, "_valueListAnnotationsLoaded").callsFake(function() {
			SmartFilterBar.prototype._valueListAnnotationsLoaded.call(this.oSmartFilter).then(fnResolve);
		}.bind(this));
		this.oSmartFilter._oFilterProvider = new FilterProvider();
		this.oSmartFilter._oFilterProvider.aFilterAnnotations = [oPromise];

		// Act
		this.oSmartFilter._createVisibleFilters();

		// Assert
		oPromiseValueLists.then(function() {
			// Assert
			assert.ok(this.oSmartFilter._refreshFiltersCountOnValueListAnnotationLoaded.calledOnce);
			done();
		}.bind(this));
	});

	QUnit.test("_refreshFiltersCountOnValueListAnnotationLoaded is called when associateValueLists is called", function(assert) {
		// Arrange
		var done = assert.async(),
			oPromise = new Promise(function(resolve) {
				resolve();
			}),
			fnResolve,
			oPromiseValueLists = new Promise(function(resolve) {
				fnResolve = resolve;
			});

		this.stub(this.oSmartFilter, "_refreshFiltersCountOnValueListAnnotationLoaded");
		this.stub(this.oSmartFilter, "getSuppressValueListsAssociation").returns(true);
		this.stub(this.oSmartFilter, "_valueListAnnotationsLoaded").callsFake(function() {
			SmartFilterBar.prototype._valueListAnnotationsLoaded.call(this.oSmartFilter).then(fnResolve);
		}.bind(this));
		this.oSmartFilter._oFilterProvider = new FilterProvider();
		this.oSmartFilter._oFilterProvider.aFilterAnnotations = [oPromise];

		// Act
		this.oSmartFilter.associateValueLists();

		// Assert
		oPromiseValueLists.then(function() {
			// Assert
			assert.ok(this.oSmartFilter._refreshFiltersCountOnValueListAnnotationLoaded.calledOnce);
			done();
		}.bind(this));
	});

	QUnit.test("Description for tokens are retrieved only after associateValueLists is called", function(assert) {
		// Arrange
		var oFBTextSpy = this.spy(FilterBar.prototype, "_enhanceFilterItemsWithTextValue"),
			oGetUiState = this.spy(FilterBar.prototype, "getUiState");

		this.oSmartFilter._oFilterProvider = new FilterProvider();

		// Act
		this.oSmartFilter._enhanceFilterItemsWithTextValue();

		// Assert
		assert.strictEqual(oFBTextSpy.callCount, 1, "FilterBar._enhanceFilterItemsWithTextValue is called synchronously");
		assert.strictEqual(oGetUiState.callCount, 0, "FilterBar.getUiState is not called");
		assert.strictEqual(
			typeof this.oSmartFilter._enhanceFilterItemsWithTextOnValueListAssociation,
			"undefined",
			"Private property is not defined"
		);

		// Arrange - value list association is suppressed
		oFBTextSpy.reset();
		this.stub(this.oSmartFilter, "getSuppressValueListsAssociation").returns(true);

		// Act
		this.oSmartFilter._enhanceFilterItemsWithTextValue();

		// Assert
		assert.strictEqual(oFBTextSpy.callCount, 0, "FilterBar._enhanceFilterItemsWithTextValue is not called");
		assert.strictEqual(
			typeof this.oSmartFilter._enhanceFilterItemsWithTextOnValueListAssociation,
			"function",
			"Private property is a function"
		);

		// Act - associate value lists
		this.oSmartFilter.associateValueLists();

		// Assert
		assert.strictEqual(oFBTextSpy.callCount, 1, "FilterBar._enhanceFilterItemsWithTextValue is called");
		assert.strictEqual(oGetUiState.callCount, 1, "FilterBar.getUiState is called");

		// Act - call method again (new UIState applied after value list association
		this.oSmartFilter._enhanceFilterItemsWithTextValue();
		assert.strictEqual(oFBTextSpy.callCount, 2, "FilterBar._enhanceFilterItemsWithTextValue is called");
	});

	QUnit.test("check _handleGroupConfigurationChanged", function(assert) {

		var sLabel = null;
		var oFilterGroupItem = {
			setGroupTitle: function(s) {
				sLabel = s;
			}
		};

		var oEvent = {
			oSource: {
				getLabel: function() {
					return "mylabel";
				},
				getKey: function() {
					return "";
				}
			},
			getParameter: function(sName) {
				return "label";
			}
		};

		sinon.stub(this.oSmartFilter, "_getFilterGroupItemByGroupName").returns(oFilterGroupItem);

		assert.ok(!sLabel);
		this.oSmartFilter._handleGroupConfigurationChanged(oEvent);
		assert.strictEqual(sLabel, "mylabel");
	});

	QUnit.test("check _createFieldInAdvancedArea", function(assert) {

		var oControl = new Input({
			id: "dummy"
		});

		var oField = {
			quickInfo: "quickinfo",
			label: "label",
			fieldName: "name",
			isMandatory: false,
			isVisible: true,
			groupEntitySet: "SET",
			groupEntityType: "TYPE"
		};
		sinon.spy(this.oSmartFilter, "addFilterGroupItem");
		sinon.stub(this.oSmartFilter, "_createFilterFieldControl").withArgs(oField).returns(oField.control = oControl);

		sinon.stub(this.oSmartFilter, "getConditionTypeByKey").returns(false);

		var oFilter = this.oSmartFilter._createFieldInAdvancedArea({
			groupName: "__$INTERNAL$",
			groupLabel: ""
		}, oField);
		assert.ok(oFilter);
		assert.ok(oFilter.factory);
		assert.ok(!this.oSmartFilter.addFilterGroupItem.called);

		oFilter.factory();
		assert.ok(this.oSmartFilter.addFilterGroupItem.called);

		var oContent = this.oSmartFilter._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP].items[0];
		assert.equal(Object.keys(oContent).length, 2);
		assert.ok(oContent.filterItem._oLabel.isA("sap.m.Label"));
		assert.ok(oContent.control.isA("sap.m.Input"));
		assert.equal(oControl.getTooltip(), "quickinfo");

		oFilter = this.oSmartFilter.determineFilterItemByName("name");
		assert.ok(oFilter);
		assert.equal(oFilter.getEntitySetName(), "SET");
		assert.equal(oFilter.getEntityTypeName(), "TYPE");
	});

	//BCP : 1970470346
	QUnit.test("check _createFieldInAdvancedArea overwrite correct tooltip", function(assert) {

		var oControl = new Input({
			id: "dummy",
			tooltip: "control tooltip"
		});

		var oField = {
			quickInfo: "quickinfo",
			label: "label",
			fieldName: "name",
			isMandatory: false,
			isVisible: true,
			groupEntitySet: "SET",
			groupEntityType: "TYPE"
		};

		sinon.spy(this.oSmartFilter, "addFilterGroupItem");
		sinon.stub(this.oSmartFilter, "_createFilterFieldControl").withArgs(oField).returns(oField.control = oControl);
		sinon.stub(this.oSmartFilter, "getConditionTypeByKey").returns(false);

		var oFilter = this.oSmartFilter._createFieldInAdvancedArea({
			groupName: "__$INTERNAL$",
			groupLabel: ""
		}, oField);

		oFilter.factory();
		var oContent = this.oSmartFilter._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP].items[0];
		assert.equal(oContent.control.getTooltip(),oControl.getTooltip());
	});

	//BCP : 2080100965
	QUnit.test("check _createFieldInAdvancedArea overwrite correct label tooltip", function(assert) {

		// Arrange
		var oControl = new Input({
			id: "dummy"
		});

		var oField = {
			quickInfo: "quickinfo",
			label: "label",
			fieldName: "name",
			isMandatory: false,
			isVisible: true,
			groupEntitySet: "SET",
			groupEntityType: "TYPE",
			control: oControl
		};

		sinon.stub(this.oSmartFilter, "_createFilterFieldControl").returns(oField.control);
		sinon.stub(this.oSmartFilter, "getConditionTypeByKey").returns(false);

		var oFilter = this.oSmartFilter._createFieldInAdvancedArea({
			groupName: "__$INTERNAL$",
			groupLabel: ""
		}, oField);

		// Act
		oFilter.factory();
		var oContent = this.oSmartFilter._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP].items[0];

		 // Assert
		assert.equal(oContent.control.getTooltip(), oControl.getTooltip());

		// Cleanup
		oControl.destroy();
	});

	QUnit.test("_createFieldInAdvancedArea: if no quickinfo is provided, no default tooltip is set", function(assert) {

		// Arrange
		var oControl = new Input({
			id: "dummy"
		});

		var oField = {
			quickInfo: undefined,
			label: "label",
			fieldName: "name",
			isMandatory: false,
			isVisible: true,
			groupEntitySet: "SET",
			groupEntityType: "TYPE",
			control: oControl
		};

		sinon.stub(this.oSmartFilter, "_createFilterFieldControl").returns(oField.control);
		sinon.stub(this.oSmartFilter, "getConditionTypeByKey").returns(false);

		var oFilter = this.oSmartFilter._createFieldInAdvancedArea({
			groupName: "__$INTERNAL$",
			groupLabel: ""
		}, oField);

		// Act
		oFilter.factory();
		var oContent = this.oSmartFilter._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP].items[0];

		// Assert
		assert.equal(oContent.filterItem.getAggregation("_label").getTooltip(), null);

		// Cleanup
		oControl.destroy();
	});

	QUnit.test("check _onChange", function(assert) {

		var oControl = new Input({
			id: "dummy"
		});

		oControl.setValueState(ValueState.Error);
		oControl.data("__mandatoryEmpty", true);

		var oEvent = {
			getSource: function() {
				return oControl;
			},
			getParameter: function(s) {
				return "";
			}
		};

		this.oSmartFilter._oFilterProvider = {
			_updateConditionTypeFields: sinon.stub()
		};
		sinon.spy(this.oSmartFilter, "search");
		this.oSmartFilter._onChange(oEvent);
		assert.strictEqual(oControl.getValueState(), ValueState.None);

		oControl.data("__mandatoryEmpty", null);
		oControl.data("__validationError", true);
		oControl.setValueState(ValueState.Error);

		this.oSmartFilter._onChange(oEvent);
		assert.ok(this.oSmartFilter.search.notCalled);
		assert.strictEqual(oControl.getValueState(), ValueState.None);

		oControl.destroy();
	});

	QUnit.test("check _onChange with LiveMode", function(assert) {
		var oControl = new Input({
			id: "dummy"
		});

		oControl.setValueState(ValueState.Error);
		oControl.data("__mandatoryEmpty", true);

		var oEvent = {
			getSource: function() {
				return oControl;
			},
			getParameter: function(s) {
				return "";
			}
		};

		sinon.spy(this.oSmartFilter, "_search");
		sinon.spy(this.oSmartFilter, "triggerSearch");

		sinon.stub(this.oSmartFilter, "_isPhone").returns(false);
		this.oSmartFilter.setLiveMode(true);
		var sinonClock = sinon.useFakeTimers();

		this.oSmartFilter._oFilterProvider = {
			_updateConditionTypeFields: sinon.stub(),
			_validateConditionTypeFields: sinon.stub(),
			getFilledFilterData: sinon.stub(),
			isPending: function() {
				return false;
			}
		};

		this.oSmartFilter._onChange(oEvent);
		assert.ok(this.oSmartFilter._search.notCalled);
		sinonClock.tick(SmartFilterBar.LIVE_MODE_INTERVAL);

		assert.ok(this.oSmartFilter._search.calledOnce);
		assert.ok(this.oSmartFilter.triggerSearch.calledOnce);

		sinonClock.restore();
		oControl.destroy();
	});

	QUnit.test("_onChange of ComboBox control should set '_bDirtyViaDialog' to 'true' when ValueHelpDialog's control triggers the change", function (assert) {
		// Arrange
		var oControl = new ComboBox({
			value: "some value"
		});
		var oEvent = {
			getSource: function() {
				return oControl;
			},
			getParameter: function(s) {
				return "";
			},
			getSelectedItem: function () {
				return null;
			}
		};
		this.oSmartFilter._oAdaptFiltersDialog = {
			isOpen: function () { return true; },
			destroy: function () {}
		};

		this.oSmartFilter._oFilterProvider = {
			getFilterData: sinon.stub(),
			getFilledFilterData: sinon.stub(),
			_bUpdatingFilterData: false,
			_bCreatingInitialModel: false
		};

		this.oSmartFilter._oAdaptFiltersDialogModel = {
			getData: function () { return {items: []}; }
		};

		// Act
		this.oSmartFilter._onChange(oEvent);

		// Assert
		assert.ok(this.oSmartFilter._bDirtyViaDialog, "the _bDirtyViaDialog should be set to 'true' when onChange event of Combobox is fired (even when no selected item presents - in case of not valid string entered)");

		// Cleanup
		oControl.destroy();
	});

	QUnit.test("_onChange of ComboBox control should trigger the fireFilterChange when no selected item", function (assert) {
		// Arrange
		var oControl = new ComboBox({
			value: "some value"
		});
		var oEvent = {
			getSource: function() {
				return oControl;
			},
			getParameter: function(s) {
				return "";
			},
			getSelectedItem: function () {
				return null;
			}
		};
		sinon.spy(this.oSmartFilter, "fireFilterChange");

		this.oSmartFilter._oFilterProvider = {
			getFilterData: sinon.stub(),
			getFilledFilterData: sinon.stub(),
			_bUpdatingFilterData: false,
			_bCreatingInitialModel: false
		};

		// Act
		this.oSmartFilter._onChange(oEvent);

		// Assert
		assert.ok(this.oSmartFilter.fireFilterChange.calledOnce, "fireFilterChange was called");

		// Cleanup
		oControl.destroy();
	});

	QUnit.test("check _getFilterItemByName", function(assert) {

		sinon.stub(this.oSmartFilter, "determineFilterItemByName").returns({});

		this.oSmartFilter._getFilterItemByName("hugo");

		assert.ok(this.oSmartFilter.determineFilterItemByName.called);

	});

	QUnit.test("check _getFilterGroupItemByGroupName", function(assert) {

		sinon.stub(this.oSmartFilter, "determineFilterItemByName").returns({});

		this.oSmartFilter._getFilterItemByName("hugo");

		assert.ok(this.oSmartFilter.determineFilterItemByName.called);

	});

	QUnit.test("check _createFilterFieldControl", function(assert) {

		var oControl = new Input({
			id: "dummy"
		});

		var oField = {
			conditionType: {
				initializeFilterItem: function() {
					return oControl;
				}
			},
			fCreateControl: function(oField) {
				return oControl;
			}
		};

		this.oSmartFilter._createFilterFieldControl(oField);
		assert.ok(oField.control);
		oField.control.destroy();

		delete oField.conditionType;
		this.oSmartFilter._createFilterFieldControl(oField);
		assert.ok(oField.control);
		oField.control.destroy();
	});

	QUnit.test("check _createFilterFieldControl with custom MultiComboBox", function(assert) {

		// Arrange
		var oControl = new MultiComboBox({
			id: "dummy"
		});

		var oField = {
			conditionType: {
				initializeFilterItem: function() {
					return oControl;
				}
			},
			fCreateControl: function(oField) {
				return oControl;
			},
			isCustomFilterField: true
		};
		sinon.spy(this.oSmartFilter, "_handleSelectionChange");

		// Act
		this.oSmartFilter._createFilterFieldControl(oField);

		// Assert
		assert.ok(this.oSmartFilter._handleSelectionChange.calledOnce, "_handleSelectionChange was called");
		assert.ok(this.oSmartFilter._handleSelectionChange.calledWith(oControl), "_handleSelectionChange was called with correct arguments");

		// Cleanup
		oControl.destroy();
	});

	QUnit.test("check _handleSelectionChange", function(assert) {

		// Arrange
		var oControl = new MultiComboBox({
			id: "dummy"
		});

		sinon.spy(oControl, "attachSelectionChange");
		sinon.stub(this.oSmartFilter, "_onChange");

		// Act
		this.oSmartFilter._handleSelectionChange(oControl);

		// Assert
		assert.ok(oControl.attachSelectionChange.calledOnce, "_handleSelectionChange was called");

		// Act
		oControl.fireSelectionChange();

		// Assert
		assert.ok(this.oSmartFilter._onChange.calledOnce, "_onChange was called on selectionChange event");

		// Cleanup
		oControl.destroy();
	});


	QUnit.test("check triggerSearch", function(assert) {
		sinon.stub(this.oSmartFilter, "_search");

		var sinonClock = sinon.useFakeTimers();
		this.oSmartFilter.triggerSearch();
		sinonClock.tick(SmartFilterBar.LIVE_MODE_INTERVAL);
		sinonClock.restore();

		assert.ok(this.oSmartFilter._search.calledOnce);
	});

	QUnit.test("check triggerSearch calling twice with LIVE_MODE_INTERVAL", function(assert) {
		sinon.stub(this.oSmartFilter, "_search");

		var sinonClock = sinon.useFakeTimers();
		// Search 1
		this.oSmartFilter.triggerSearch(SmartFilterBar.LIVE_MODE_INTERVAL);
		// Wait for half-time
		sinonClock.tick(SmartFilterBar.LIVE_MODE_INTERVAL / 2);
		// Search 2
		this.oSmartFilter.triggerSearch(SmartFilterBar.LIVE_MODE_INTERVAL);
		// Wait for full-time
		sinonClock.tick(SmartFilterBar.LIVE_MODE_INTERVAL);
		sinonClock.restore();

		assert.ok(this.oSmartFilter._search.calledOnce);
	});

	QUnit.test("check _setFocusOnFirstErroneousField", function(assert) {

		var sinonClock = sinon.useFakeTimers();

		var aControl = [
			new Input(), new Input(), new Input()
		];

		aControl[0].setValueState(ValueState.Error);
		aControl[2].setValueState(ValueState.Error);
		sinon.spy(aControl[0], "focus");
		sinon.spy(aControl[1], "focus");
		sinon.spy(aControl[2], "focus");

		sinon.stub(this.oSmartFilter, "_validateState").returns(false);
		sinon.stub(this.oSmartFilter, "getAllFilterItems").returns([
			"A", "B", "C"
		]);
		var oSinonStub = sinon.stub(this.oSmartFilter, "_determineControlByFilterItem");
		oSinonStub.withArgs("A").returns(aControl[0]);
		oSinonStub.withArgs("B").returns(aControl[1]);
		oSinonStub.withArgs("C").returns(aControl[2]);

		sinon.spy(this.oSmartFilter, "_setFocusOnFirstErroneousField");

		this.oSmartFilter.setShowMessages(false);
		this.oSmartFilter.search();

		sinonClock.tick(500);

		assert.equal(this.oSmartFilter._setFocusOnFirstErroneousField.calledOnce, true);
		assert.equal(aControl[0].focus.called, true);
		assert.equal(aControl[1].focus.called, false);
		assert.equal(aControl[2].focus.called, false);

		aControl[0].destroy();
		aControl[1].destroy();
		aControl[2].destroy();

		sinonClock.restore();
	});

	QUnit.test("check _setInitialFocus", function(assert) {

		var aControl = [
			new FilterItem(), new FilterItem(), new FilterItem()
		],

		oSearchField = new SearchField(),
		oSinonStub;

		aControl[0].setControl(new Input());
		aControl[1].setControl(new Input());

		sinon.spy(aControl[0], "focus");
		sinon.spy(aControl[1], "focus");
		sinon.spy(oSearchField, "focus");

		oSinonStub = sinon.stub(this.oSmartFilter, "getAllFilterItems");
		oSinonStub.withArgs(true).returns(aControl);

		sinon.stub(this._onAfterRenderingBasicSearchDelegate).returns(oSearchField.focus());
		sinon.stub(this._onAfterRenderingFirstFilterVisibleFieldDelegate).returns(aControl[0].focus());


		sinon.spy(this.oSmartFilter, "_setInitialFocus");

		this.oSmartFilter._setInitialFocus();
		assert.equal(aControl[0].focus.called, true, "Focus is set on the first filter control");

		this.oSmartFilter.setBasicSearch(oSearchField);
		this.oSmartFilter.setEnableBasicSearch(true);
		this.oSmartFilter._setInitialFocus();

		assert.equal(oSearchField.focus.called, true, "Focus is set on the Search control");

		this.oSmartFilter.setPersistencyKey("DUMMY");

		this.oSmartFilter._initializeVariantManagement();
		this.oSmartFilter._setInitialFocus();

		assert.equal(oSearchField.focus.calledOnce, true, "Focus is not set on the Search control more than once because of variant management available");
		assert.equal(aControl[0].focus.calledOnce, true, "Focus is not set on the first filter control  more than once  because of variant management available");

	});

	QUnit.test("when in ValueHelpDialog check _setInitialFocus - it shouldn't be called", function(assert) {
		// Arrange
		sinon.stub(this.oSmartFilter, "getIsRunningInValueHelpDialog").returns(true);
		sinon.spy(this.oSmartFilter, "_setInitialFocus");

		//Act
		this.oSmartFilter._createVisibleFilters();

		// Assert
		assert.equal(this.oSmartFilter._setInitialFocus.called, false, "_setInitialFocus is not called");
	});

	QUnit.test("check liveMode", function(assert) {
		sinon.stub(this.oSmartFilter, "_isPhone").returns(false);
		assert.ok(this.oSmartFilter._getSearchButton().getVisible());

		assert.ok(!this.oSmartFilter.getLiveMode());

		this.oSmartFilter.setLiveMode(true);
		assert.ok(this.oSmartFilter.getLiveMode());
		assert.ok(this.oSmartFilter.isLiveMode());
		assert.ok(!this.oSmartFilter._getSearchButton().getVisible());

		this.oSmartFilter._isPhone.restore();
		sinon.stub(this.oSmartFilter, "_isPhone").returns(true);
		this.oSmartFilter._getSearchButton().setVisible(true);

		this.oSmartFilter.setLiveMode(true);
		assert.ok(!this.oSmartFilter.isLiveMode());
		assert.ok(this.oSmartFilter.getLiveMode());
		assert.ok(this.oSmartFilter._getSearchButton().getVisible());
	});

	QUnit.test("check _resetFilterFields", function(assert) {

		this.oSmartFilter._oFilterProvider = {
			reset: sinon.stub()
		};
		sinon.stub(this.oSmartFilter, "_clearErroneusControlValues");

		this.oSmartFilter._resetFilterFields();

		assert.ok(this.oSmartFilter._clearErroneusControlValues.called);
	});

	QUnit.test("check _clearFilterFields", function(assert) {

		this.oSmartFilter._oFilterProvider = {
			clear: sinon.stub()
		};
		sinon.stub(this.oSmartFilter, "_clearErroneusControlValues");

		this.oSmartFilter._clearFilterFields();

		assert.ok(this.oSmartFilter._clearErroneusControlValues.called);
	});

	QUnit.test("check _clearErroneusControlValues", function(assert) {
		var oControl1 = new Input();
		var oControl2 = new Input();
		var oControl3 = new Input();

		var oControlDRT = new Input();

		var oControlDP = new DatePicker();
		sinon.stub(oControlDP, "getBinding").returns({
			checkUpdate: function(b) {
			}
		});

		var oModel = new JSONModel({
			value: ""
		});
		oControl1.setModel(oModel, "$test");
		oControl2.setModel(oModel, "$test");
		oControl3.setModel(oModel, "$test");
		oControlDRT.setModel(oModel, "$test");

		oControl1.bindProperty("value", "$test>/value");
		oControl2.bindProperty("value", "$test>/value");
		oControl3.bindProperty("value", "$test>/value");
		oControlDRT.bindProperty("value", "$test>/value");

		oControl2.setValueState(ValueState.Error);
		oControl3.setValueState(ValueState.Error);

		oControlDRT.setValueState(ValueState.Error);
		oControlDP.setValueState(ValueState.Error);

		this.oSmartFilter._oFilterProvider = {
			_mConditionTypeFields: {}
		};

		this.oSmartFilter._oFilterProvider._mConditionTypeFields["DRT"] = {};

		var Filter = function(sName) {
			this._sName = sName;
			this.getName = function() {
				return this._sName;
			};
		};

		var aFilters = [
			new Filter("A"), new Filter("B"), new Filter("C"), new Filter("DP"), new Filter("DRT")
		];

		sinon.stub(this.oSmartFilter, "getAllFilterItems").returns(aFilters);
		var oStub = sinon.stub(this.oSmartFilter, "_determineControlByFilterItem");
		oStub.withArgs(aFilters[0]).returns(oControl1);
		oStub.withArgs(aFilters[1]).returns(oControl2);
		oStub.withArgs(aFilters[2]).returns(oControl3);
		oStub.withArgs(aFilters[3]).returns(oControlDP);
		oStub.withArgs(aFilters[4]).returns(oControlDRT);

		sinon.stub(JSONPropertyBinding.prototype, "checkUpdate");
		this.oSmartFilter._clearErroneusControlValues();

		assert.ok(this.oSmartFilter.getAllFilterItems.calledWith(false), "getAllFilterItems called with 'false' from _clearErroneusControlValues method");

		assert.equal(oControlDP.getValueState(), ValueState.None);
		assert.equal(oControlDRT.getValueState(), ValueState.None);

		assert.ok(JSONPropertyBinding.prototype.checkUpdate.calledTwice);

		this.oSmartFilter._oFilterProvider = null;
		oControl1.destroy();
		oControl2.destroy();
		oControl3.destroy();
		oControlDP.destroy();
		oControlDRT.destroy();

	});

	QUnit.test("check setConsiderAnalyticalParameters", function(assert) {

		assert.ok(!this.oSmartFilter.getConsiderAnalyticalParameters());

		this.oSmartFilter.setConsiderAnalyticalParameters(true);

		assert.ok(this.oSmartFilter.getConsiderAnalyticalParameters());

	});

	QUnit.test("check getAnalyticBindingPath", function(assert) {

		this.oSmartFilter.setConsiderAnalyticalParameters(true);
		this.oSmartFilter._oFilterProvider = {
			getAnalyticBindingPath: sinon.stub()
		};

		this.oSmartFilter.getAnalyticBindingPath();

		assert.ok(this.oSmartFilter._oFilterProvider.getAnalyticBindingPath.calledOnce);
	});

	QUnit.test("check getFilters with analytical parameters", function(assert) {

		var oStub = sinon.stub(this.oSmartFilter, "_getVisibleFieldNames");
		oStub.withArgs(true).returns([
			'p.A', 'B', 'C', 'p.D'
		]);

		this.oSmartFilter._oFilterProvider = {
			getFilters: function(a) {
				assert.ok(a);
				assert.equal(a.length, 4);
				assert.equal(a[0], 'p.A');
				assert.equal(a[1], 'B');
				assert.equal(a[2], 'C');
				assert.equal(a[3], 'p.D');
			}
		};

		this.oSmartFilter.getFilters();

	});

	QUnit.test("check _createAnalyticParameter", function(assert) {

		var oParam = {
			quickInfo: "quickinfo",
			label: "label",
			fieldName: "fieldName",
			isMandatory: true,
			isVisible: true,
			control: new Control()
		};

		sinon.stub(this.oSmartFilter, "_createFilterFieldControl");
		sinon.stub(this.oSmartFilter, "_addParameter");

		var oParamRes = this.oSmartFilter._createAnalyticParameter(oParam);
		assert.ok(oParamRes);
		assert.ok(oParamRes.factory);

		oParamRes.factory();
		assert.ok(this.oSmartFilter._addParameter.calledOnce);

		this.oSmartFilter._addParameter.restore();
		sinon.stub(this.oSmartFilter, "_addParameter");
		delete oParamRes.control;
		oParamRes.factory();
		assert.ok(!this.oSmartFilter._addParameter.calledOnce);

	});

	QUnit.test("check _getVisibleFieldNames", function(assert) {

		var aFilters = [
			{
				getName: function() {
					return "A";
				},
				_isParameter: function() {
					return false;
				}
			}, {
				getName: function() {
					return "B";
				},
				_isParameter: function() {
					return true;
				}
			}, {
				getName: function() {
					return "C";
				},
				_isParameter: function() {
					return true;
				}
			}, {
				getName: function() {
					return "D";
				},
				_isParameter: function() {
					return false;
				}
			}
		];

		sinon.stub(this.oSmartFilter, "getAllFilterItems").returns(aFilters);

		aFilters = this.oSmartFilter._getVisibleFieldNames(true);
		assert.ok(aFilters);
		assert.equal(aFilters.length, 2);
		assert.equal(aFilters[0], "D");
		assert.equal(aFilters[1], "A");

		aFilters = this.oSmartFilter._getVisibleFieldNames();
		assert.ok(aFilters);
		assert.equal(aFilters.length, 4);
		assert.equal(aFilters[0], "D");
		assert.equal(aFilters[1], "C");
		assert.equal(aFilters[2], "B");
		assert.equal(aFilters[3], "A");
	});

	QUnit.test("check _getAllFieldNames", function(assert) {
		var oSmartFilter = this.oSmartFilter,
			aFilters = [{
				name: 'firstName',
				isVisible: false,
				entitySet: 'foo'
			}, {
				name: 'secondName',
				isVisible: true,
				entitySet: 'foo'
			}];

		oSmartFilter.setEntitySet("foo");
		oSmartFilter._oFilterProvider = {
			_oMetadataAnalyser: {
				getFieldsByEntitySetName: function() {
					return aFilters;
				}
			}
		};

		aFilters = this.oSmartFilter._getAllFieldNames();
		assert.ok(aFilters);
		assert.equal(aFilters.length, 2);
		assert.equal(aFilters[0], "firstName");
		assert.equal(aFilters[1], "secondName");
	});

	QUnit.test("check triggerSearch ", function(assert) {
		sinon.stub(this.oSmartFilter, "triggerSearch");
		sinon.stub(this.oSmartFilter, "_search");
		this.oSmartFilter.search();

		assert.ok(this.oSmartFilter.triggerSearch.calledOnce);
		assert.ok(!this.oSmartFilter._search.called);
	});

	QUnit.test("check search with basic search field", function(assert) {
		var oSearchField = new SearchField();

		sinon.stub(this.oSmartFilter, "search");

		this.oSmartFilter._attachToBasicSearch(oSearchField);
		oSearchField.fireSearch();
		assert.ok(this.oSmartFilter.search.calledOnce);

		// livemode
		this.oSmartFilter.search.restore();
		sinon.stub(this.oSmartFilter, "search");

		this.oSmartFilter.setLiveMode(true);
		oSearchField.fireSearch();
		/*
		 * if (this.oSmartFilter._isPhone()) { assert.ok(this.oSmartFilter.search.calledOnce); } else {
		 * assert.ok(!this.oSmartFilter.search.calledOnce); }
		 */
		assert.ok(this.oSmartFilter.search.calledOnce);

		// open filters dialog
		this.oSmartFilter.search.restore();
		sinon.stub(this.oSmartFilter, "search");

		this.oSmartFilter.setLiveMode(false);
		sinon.stub(this.oSmartFilter, "isDialogOpen").returns(true);
		oSearchField.fireSearch();
		assert.ok(!this.oSmartFilter.search.called);

		oSearchField.destroy();
	});

	QUnit.test("check basicSearchValidation ", function(assert) {
		sinon.stub(this.oSmartFilter, "getBasicSearch").returns(true);
		sinon.stub(this.oSmartFilter, "getBasicSearchControl").returns({});
		this.oSmartFilter._search();

		assert.ok(true, "no exception should be thrown");
	});

	QUnit.test("search event should have property 'firedFromFilterBar' set to 'true' if 'Go' button is pressed", function (assert) {
		// Arrange
		var done = assert.async();
		this.oSmartFilter.attachSearch(function (oEvent) {
			// Assert
			assert.ok(oEvent.getParameters()[0].firedFromFilterBar, "firedFromFilterBar should be set to 'true'");
			done();
		});

		// Act
		this.oSmartFilter._getSearchButton().firePress();
	});

	QUnit.test("search event should have property 'firedFromFilterBar' set to 'false' if search method is called directly", function (assert) {
		// Arrange
		var done = assert.async();
		this.oSmartFilter.attachSearch(function (oEvent) {
			// Assert
			assert.notOk(oEvent.getParameters()[0].firedFromFilterBar, "firedFromFilterBar should be set to 'false'");
			done();
		});

		// Act
		this.oSmartFilter.search();
	});

	QUnit.test("XCheck if all properties defined in the class of the control are declared in designtime metadata (there are also inherited properties)", function(assert) {
		var mProperties = this.oSmartFilter.getMetadata()._mProperties;
		assert.ok(mProperties);

		var done = assert.async();

		this.oSmartFilter.getMetadata().loadDesignTime().then(function(oDesignTimeMetadata) {
			var aProperties = Object.keys(mProperties);
			aProperties.forEach(function(element) {
				assert.ok(oDesignTimeMetadata.properties[element]);
			});
			done();
		});
	});

	QUnit.test("check property useDateRangeType ", function(assert) {

		assert.ok(!this.oSmartFilter.getUseDateRangeType());

		this.oSmartFilter.setUseDateRangeType(true);

		assert.ok(this.oSmartFilter.getUseDateRangeType());
	});

	QUnit.test("check validateMandatoryFields", function(assert) {

		sinon.spy(this.oSmartFilter, "_validateMandatoryFields");

		sinon.stub(this.oSmartFilter, "determineMandatoryFilterItems").returns([
			{
				getName: function() {
					return "A";
				},
				data: function(s) {
					return null;
				}
			}, {
				getName: function() {
					return "B";
				},
				data: function(s) {
					return null;
				}
			}
		]);
		sinon.stub(this.oSmartFilter, "_determineControlByFilterItem").returns({
			setValueState: function() {
			},
			getValueState: function() {
				return "None";
			},
			isA: function () {
				return false;
			},
			data: function(s) {
				return null;
			}
		});

		sinon.stub(this.oSmartFilter, "getFilterData").returns({
			"A": "a",
			"B": "b"
		});
		assert.ok(this.oSmartFilter.validateMandatoryFields());

		this.oSmartFilter.getFilterData.restore();
		sinon.stub(this.oSmartFilter, "getFilterData").returns({
			"A": "a"
		});
		assert.ok(!this.oSmartFilter.validateMandatoryFields());

		assert.ok(this.oSmartFilter._validateMandatoryFields.calledTwice);
	});

	QUnit.test("check verifySearchAllowed", function(assert) {

		sinon.stub(this.oSmartFilter, "validateMandatoryFields").returns(true);
		sinon.stub(this.oSmartFilter, "_validateState").returns(true);
		assert.deepEqual(this.oSmartFilter.verifySearchAllowed(), {});

		this.oSmartFilter.validateMandatoryFields.restore();
		sinon.stub(this.oSmartFilter, "validateMandatoryFields").returns(false);
		assert.deepEqual(this.oSmartFilter.verifySearchAllowed(), {
			mandatory: true
		});

		this.oSmartFilter._validateState.restore();
		sinon.stub(this.oSmartFilter, "_validateState").returns(false);
		assert.deepEqual(this.oSmartFilter.verifySearchAllowed(), {
			error: true
		});

		this.oSmartFilter._validateState.restore();
		sinon.stub(this.oSmartFilter, "getAllFilterItems").returns([
			{}, {}
		]);
		sinon.stub(this.oSmartFilter, "_determineControlByFilterItem").returns({
			__bValidatingToken: true,
			getValueState: function() {
				return "None";
			},
			data: function(s) {
				return null;
			}
		});
		assert.deepEqual(this.oSmartFilter.verifySearchAllowed(), {
			pending: true
		});

	});

	QUnit.test("test checkSearchAllowed", function(assert) {

		sinon.stub(this.oSmartFilter, "_validateState").returns(true);
		sinon.stub(this.oSmartFilter, "_checkMandatoryFields").returns({emptyMandatory: true, valueStateInError: false});
		assert.equal(this.oSmartFilter.checkSearchAllowed(), false, "Search is not allowed when empty mandatory fields available/no fields in ValueState.Error");

		this.oSmartFilter._checkMandatoryFields.restore();
		sinon.stub(this.oSmartFilter, "_checkMandatoryFields").returns({emptyMandatory: false, valueStateInError: true});
		assert.equal(this.oSmartFilter.checkSearchAllowed(), false, "Search is not allowed when no empty mandatory fields available/fields in ValueState.Error available");

		this.oSmartFilter._checkMandatoryFields.restore();
		sinon.stub(this.oSmartFilter, "_checkMandatoryFields").returns({emptyMandatory: false, valueStateInError: false});
		assert.equal(this.oSmartFilter.checkSearchAllowed(), true, "Search is allowed when no empty mandatory fields availa ble and no fields in ValueState.Error");

		this.oSmartFilter._validateState.restore();
		sinon.stub(this.oSmartFilter, "_validateState").returns(false);
		assert.equal(this.oSmartFilter.checkSearchAllowed(), false, "Search is not allowed when state is not valid and no pending validations of tokens available.");

		this.oSmartFilter._validateState.restore();
		sinon.stub(this.oSmartFilter, "getAllFilterItems").returns([
			{}, {}
		]);
		sinon.stub(this.oSmartFilter, "_determineControlByFilterItem").returns({
			__bValidatingToken: true,
			getValueState: function() {
				return "None";
			},
			data: function(s) {
				return null;
			}
		});
		assert.equal(this.oSmartFilter.checkSearchAllowed(), false, "Search is not allowed when pending validations of tokens available.");

		this.oSmartFilter._oFilterProvider = {
			_validateConditionTypeFields: function() {
				return true;
			}
		};
		sinon.spy(this.oSmartFilter._oFilterProvider, "_validateConditionTypeFields");
		this.oSmartFilter.checkSearchAllowed();
		assert.ok(!this.oSmartFilter._oFilterProvider._validateConditionTypeFields.calledWith(false));
	});

	QUnit.test("check suppressSelection", function(assert) {

		sinon.stub(this.oSmartFilter, "_search");

		this.oSmartFilter.search(true);
		assert.ok(this.oSmartFilter._search.called);

		this.oSmartFilter._search.restore();
		sinon.stub(this.oSmartFilter, "_search");

		this.oSmartFilter.setSuppressSelection(true);
		this.oSmartFilter.search(true);
		assert.ok(!this.oSmartFilter._search.called);

		this.oSmartFilter._search.restore();
		sinon.stub(this.oSmartFilter, "_search");

		this.oSmartFilter.setSuppressSelection(false);
		this.oSmartFilter.search(true);
		assert.ok(this.oSmartFilter._search.called);

	});

	QUnit.test("check _handleControlConfigurationChangedForDelayedFilterItems", function(assert) {

		var oControlConfig = {
			getLabel: function() {
				return "LABEL";
			},
			getVisible: function() {
				return false;
			},
			getVisibleInAdvancedArea: function() {
				return true;
			}
		};

		this.oSmartFilter._aFilterBarViewMetadata = [
			{
				groupName: "G1",
				fields: [
					{
						fieldName: "A"
					}, {
						fieldName: "B"
					}, {
						fieldName: "C"
					}
				]
			}, {
				groupName: "G2",
				fields: [
					{
						fieldName: "D"
					}, {
						fieldName: "E"
					}
				]
			}
		];

		this.oSmartFilter._handleControlConfigurationChangedForDelayedFilterItems("D", oControlConfig, "label");
		assert.ok(this.oSmartFilter._aFilterBarViewMetadata[1].fields[0].hasOwnProperty("label"));
		assert.equal(this.oSmartFilter._aFilterBarViewMetadata[1].fields[0].label, "LABEL");

		this.oSmartFilter._handleControlConfigurationChangedForDelayedFilterItems("A", oControlConfig, "visible");
		assert.ok(this.oSmartFilter._aFilterBarViewMetadata[0].fields[0].hasOwnProperty("isVisible"));
		assert.equal(this.oSmartFilter._aFilterBarViewMetadata[0].fields[0].isVisible, false);

		this.oSmartFilter._handleControlConfigurationChangedForDelayedFilterItems("E", oControlConfig, "visibleInAdvancedArea");
		assert.ok(this.oSmartFilter._aFilterBarViewMetadata[1].fields[1].hasOwnProperty("visibleInAdvancedArea"));
		assert.equal(this.oSmartFilter._aFilterBarViewMetadata[1].fields[1].visibleInAdvancedArea, true);

	});

	QUnit.test("check _handleControlConfigurationChanged", function(assert) {

		sinon.spy(this.oSmartFilter, "_handleControlConfigurationChangedForDelayedFilterItems");
		var oControlConfig = {
			getLabel: function() {
				return "LABEL";
			},
			getKey: function() {
				return "D";
			}
		};

		var oEvent = {
			oSource: oControlConfig,
			getParameter: function(s) {
				return "label";
			}
		};

		this.oSmartFilter._aFilterBarViewMetadata = [
			{
				groupName: "G1",
				fields: [
					{
						fieldName: "A"
					}, {
						fieldName: "B"
					}, {
						fieldName: "C"
					}
				]
			}, {
				groupName: "G2",
				fields: [
					{
						fieldName: "D"
					}, {
						fieldName: "E"
					}
				]
			}
		];

		this.oSmartFilter._handleControlConfigurationChanged(oEvent);
		assert.ok(this.oSmartFilter._aFilterBarViewMetadata[1].fields[0].hasOwnProperty("label"));
		assert.equal(this.oSmartFilter._aFilterBarViewMetadata[1].fields[0].label, "LABEL");

		assert.ok(this.oSmartFilter._handleControlConfigurationChangedForDelayedFilterItems.called);

	});

	QUnit.test("check _handleGroupConfigurationLabelChangedForDelayedFilterItems", function(assert) {

		this.oSmartFilter._aFilterBarViewMetadata = [
			{
				groupName: "G1",
				fields: [
					{
						fieldName: "A"
					}, {
						fieldName: "B"
					}, {
						fieldName: "C"
					}
				]
			}, {
				groupName: "G2",
				fields: [
					{
						fieldName: "D"
					}, {
						fieldName: "E"
					}
				]
			}
		];

		this.oSmartFilter._handleGroupConfigurationLabelChangedForDelayedFilterItems("G2", "LABEL");
		assert.ok(this.oSmartFilter._aFilterBarViewMetadata[1].hasOwnProperty("groupLabel"));
		assert.equal(this.oSmartFilter._aFilterBarViewMetadata[1].groupLabel, "LABEL");

	});

	QUnit.test("check _handleGroupConfigurationLabelChangedForDelayedFilterItems", function(assert) {

		sinon.spy(this.oSmartFilter, "_handleGroupConfigurationLabelChangedForDelayedFilterItems");

		this.oSmartFilter._aFilterBarViewMetadata = [
			{
				groupName: "G1",
				fields: [
					{
						fieldName: "A"
					}, {
						fieldName: "B"
					}, {
						fieldName: "C"
					}
				]
			}, {
				groupName: "G2",
				fields: [
					{
						fieldName: "D"
					}, {
						fieldName: "E"
					}
				]
			}
		];

		this.oSmartFilter._handleGroupConfigurationLabelChangedForDelayedFilterItems("G1", "LABEL");
		assert.ok(this.oSmartFilter._aFilterBarViewMetadata[0].hasOwnProperty("groupLabel"));
		assert.equal(this.oSmartFilter._aFilterBarViewMetadata[0].groupLabel, "LABEL");

		assert.ok(this.oSmartFilter._handleGroupConfigurationLabelChangedForDelayedFilterItems.called);

	});

	/**
	 * @deprecated considerSelectionVariants Since version 1.87. Please use the <code>com.sap.vocabularies.UI.v1.SelectionPresentationVariant</code> annotation through the {@link sap.ui.comp.smartvariants.SmartVariantManagement#setEntitySet}
	 */
	QUnit.test("Checking 'considerSelectionVariants' property", function(assert) {
		assert.ok(!this.oSmartFilter.getConsiderSelectionVariants());
		this.oSmartFilter.setConsiderSelectionVariants(true);
		assert.ok(this.oSmartFilter.getConsiderSelectionVariants());
	});

	/**
	 * @deprecated considerSelectionVariants Since version 1.87. Please use the <code>com.sap.vocabularies.UI.v1.SelectionPresentationVariant</code> annotation through the {@link sap.ui.comp.smartvariants.SmartVariantManagement#setEntitySet}
	 */
	QUnit.test("check _initializeVariantManagement", function(assert) {

		sinon.stub(this.oSmartFilter, "getSelectionVariants").returns([
			{
				qualifier: "Q1",
				annotation: {
					Text: {
						String: "Variant Q1"
					}
				}
			}, {
				qualifier: "Q2",
				annotation: {
					Text: {
						String: "Variant Q2"
					}
				}
			}
		]);

		sinon.stub(this.oSmartFilter, "_setInitialFocus");
		sinon.spy(this.oSmartFilter._oSmartVariantManagement, "registerSelectionVariantHandler");

		assert.ok(!this.oSmartFilter._oSmartVariantManagement.registerSelectionVariantHandler.called);

		this.oSmartFilter.setConsiderSelectionVariants(true);
		this.oSmartFilter.setPersistencyKey("DUMMY");

		this.oSmartFilter._initializeVariantManagement();
		assert.ok(this.oSmartFilter._oSmartVariantManagement.registerSelectionVariantHandler.calledOnce);

		var oAdapter = this.oSmartFilter._oSmartVariantManagement._getFilterBarAdapter();
		assert.ok(oAdapter);

		assert.ok(oAdapter.variants);
		assert.equal(oAdapter.variants.length, 2);

		assert.equal(oAdapter.variants[0].id, "#Q1");
		assert.equal(oAdapter.variants[1].id, "#Q2");
	});

	QUnit.test("check getSelectionVariant", function(assert) {

		var aSelectionVariants = [
			{
				qualifier: "Q1",
				annotation: {
					Text: {
						String: "Variant Q1"
					}
				}
			}, {
				qualifier: "Q2",
				annotation: {
					Text: {
						String: "Variant Q2"
					}
				}
			}
		];

		sinon.stub(this.oSmartFilter, "getSelectionVariants").returns(aSelectionVariants);

		sinon.stub(this.oSmartFilter, "convertSelectionVariantToInternalVariant");
		this.oSmartFilter.convertSelectionVariantToInternalVariant.withArgs(aSelectionVariants[0].annotation).returns("Q1_Content");

		var sContent = this.oSmartFilter.getSelectionVariant("#Q1");
		assert.equal(sContent, "Q1_Content");
		assert.ok(this.oSmartFilter.convertSelectionVariantToInternalVariant.called);

	});

	QUnit.test("check convertSelectionVariantToInternalVariant", function(assert) {

		var oSelectionVariant = {
			Parameters: [
				{
					PropertyName: {
						PropertyPath: "Kunnr"
					},
					PropertyValue: {
						String: "KUNDE"
					}
				}
			],
			SelectOptions: [
				{
					PropertyName: {
						PropertyPath: "Bukrs"
					},
					Ranges: [
						{
							Low: {
								String: "0001"
							},
							Option: {
								EnumMember: "UI.SelectionRangeOptionType/EQ"
							},
							Sign: {
								EnumMember: "UI.SelectionRangeSignType/I"
							}
						}
					]
				}, {
					PropertyName: {
						PropertyPath: "BUDAT"
					},
					Ranges: [
						{
							Low: {
								String: "02.14.2017"
							},
							High: {
								String: "02.17.2017"
							},
							Option: {
								EnumMember: "UI.SelectionRangeOptionType/BT"
							},
							Sign: {
								EnumMember: "UI.SelectionRangeSignType/I"
							}
						}
					]
				}
			]
		};

		var oResult = {
			"Kunnr": "KUNDE",
			"Bukrs": {
				"ranges": [
					{
						"exclude": false,
						"operation": "EQ",
						"keyField": "Bukrs",
						"value1": "0001",
						"value2": null
					}
				],
				"items": [],
				"value": null
			},
			"BUDAT": {
				"low": "02.14.2017",
				"high": "02.17.2017"
			}
		};

		var aViewMetadata = [
			{
				groupName: "_BASIC",
				fields: [
					{
						fieldName: "Bukrs",
						control: new MultiInput(),
						filterRestriction: "auto"
					}, {
						fieldName: "BUDAT",
						control: new DateRangeSelection(),
						filterRestriction: "interval"
					}, {
						fieldName: "Kunnr",
						control: new Input(),
						filterRestriction: "single"
					}
				]
			}
		];

		sinon.stub(this.oSmartFilter, "getFilterBarViewMetadata").returns(aViewMetadata);

		this.oSmartFilter.setPersistencyKey("PESISTENCY.KEY");

		var oVariantContent = this.oSmartFilter.convertSelectionVariantToInternalVariant(oSelectionVariant);
		assert.ok(oVariantContent);
		// assert.ok(oVariantContent["PESISTENCY.KEY"]);
		assert.ok(oVariantContent.filterbar);
		assert.equal(oVariantContent.filterbar.length, 3);
		assert.equal(oVariantContent.version, "V2");
		assert.ok(oVariantContent.filterBarVariant);
		assert.deepEqual(JSON.parse(oVariantContent.filterBarVariant), oResult);
	});

	QUnit.test("check _search with messagebox displayed", function(assert) {

		this.oSmartFilter.setLiveMode(true);

		sinon.stub(this.oSmartFilter, "verifySearchAllowed").returns({
			error: true
		});

		sinon.stub(MessageBox, "error");

		this.oSmartFilter._search();

		assert.ok(!MessageBox.error.called);

		this.oSmartFilter.setLiveMode(false);
		this.oSmartFilter.setShowMessages(true);
		this.oSmartFilter._search();
		assert.ok(MessageBox.error.called);

		MessageBox.error.restore();
	});

	QUnit.test("check @i18n label and quickInfo functionality", function(assert) {
		var oFieldGroup = {
			groupName: "G1",
			groupLabel: "G1_LABEL"
		};
		var oField1 = {
			quickInfo: "QI",
			fieldName: "FIELD1",
			label: "FIELD1_LABEL",
			isMndatory: false,
			isVisible: true,
			visibleInAdvancedArea: true,
			control: new Control(),
			hiddenFilter: false
		};
		var oField2 = {
			quickInfo: "@i18n>QI",
			fieldName: "FIELD2",
			label: "@i18n>FIELD2_LABEL",
			isMndatory: false,
			isVisible: true,
			visibleInAdvancedArea: true,
			control: new Control(),
			hiddenFilter: false
		};
		var oParam = {
			quickInfo: "@i18n>QI",
			fieldName: "$Parameter.P1",
			label: "@i18n>P1_LABEL",
			isMndatory: false,
			isVisible: true,
			control: new Control()
		};

		sinon.spy(FilterGroupItem.prototype, "setLabel");
		sinon.spy(FilterGroupItem.prototype, "setLabelTooltip");
		sinon.spy(FilterGroupItem.prototype, "bindProperty");

		sinon.stub(this.oSmartFilter, "_createFilterFieldControl");
		var oPreFilter1 = this.oSmartFilter._createFieldInAdvancedArea(oFieldGroup, oField1);
		assert.ok(oPreFilter1);

		var oPreFilter2 = this.oSmartFilter._createFieldInAdvancedArea(oFieldGroup, oField2);
		assert.ok(oPreFilter1);

		var oPreFilter3 = this.oSmartFilter._createAnalyticParameter(oParam);

		oPreFilter1.factory();
		assert.ok(FilterGroupItem.prototype.setLabel.calledOnce);
		assert.ok(FilterGroupItem.prototype.setLabelTooltip.calledOnce);
		assert.ok(FilterGroupItem.prototype.setLabelTooltip.calledWith("QI"));
		assert.ok(!FilterGroupItem.prototype.bindProperty.called);

		oPreFilter2.factory();
		assert.ok(FilterGroupItem.prototype.setLabel.calledTwice);
		assert.ok(FilterGroupItem.prototype.setLabelTooltip.calledTwice);
		assert.ok(FilterGroupItem.prototype.setLabelTooltip.calledWith("QI"));
		assert.ok(!FilterGroupItem.prototype.bindProperty.calledOnce);

		oPreFilter3.factory();
		assert.ok(FilterGroupItem.prototype.setLabel.calledThrice);
		assert.ok(FilterGroupItem.prototype.setLabelTooltip.calledTwice);
		assert.ok(FilterGroupItem.prototype.setLabelTooltip.calledWith("QI"));
		assert.ok(!FilterGroupItem.prototype.bindProperty.calledTwice);

		FilterGroupItem.prototype.setLabelTooltip.restore();
	});

	QUnit.test("check ensureLoadedValueHelp", function(assert) {

		var sCalled = null;
		var aVHProviders = [
			{
				sFieldName: "A",
				_bValueListRequested: true,
				loadAnnotation: function() {
					sCalled = "A";
					return Promise.resolve();
				}
			}, {
				sFieldName: "B",
				_bValueListRequested: false,
				loadAnnotation: function() {
					sCalled = "B";
					return Promise.resolve();
				}
			}
		];

		this.oSmartFilter._oFilterProvider = {
			getAssociatedValueHelpProviders: function() {
				return aVHProviders;
			}
		};

		this.oSmartFilter.ensureLoadedValueHelp("A");
		assert.ok(sCalled === null);

		this.oSmartFilter.ensureLoadedValueHelp("B");
		assert.equal(sCalled, "B");

		this.oSmartFilter._oFilterProvider = null;

	});

	QUnit.test("check ensureLoadedValueList", function(assert) {

		var sCalled = null;
		var aVLProviders = [
			{
				sFieldName: "A",
				_bValueListRequested: true,
				loadAnnotation: function() {
					sCalled = "A";
					return Promise.resolve();
				}
			}, {
				sFieldName: "B",
				_bValueListRequested: false,
				loadAnnotation: function() {
					sCalled = "B";
					return Promise.resolve();
				}
			}
		];

		this.oSmartFilter._oFilterProvider = {
			getAssociatedValueListProviders: function() {
				return aVLProviders;
			}
		};

		this.oSmartFilter.ensureLoadedValueList("A");
		assert.ok(sCalled === null);

		this.oSmartFilter.ensureLoadedValueList("B");
		assert.equal(sCalled, "B");

		this.oSmartFilter._oFilterProvider = null;

	});

	QUnit.test("check ensureLoadedValueHelpList", function(assert) {
		sinon.stub(this.oSmartFilter, "ensureLoadedValueHelp");
		sinon.stub(this.oSmartFilter, "ensureLoadedValueList");

		this.oSmartFilter.ensureLoadedValueHelpList();
		assert.ok(this.oSmartFilter.ensureLoadedValueHelp.calledOnce);
		assert.ok(this.oSmartFilter.ensureLoadedValueList.calledOnce);
	});

	QUnit.test("check collapse after Go on tablet", function(assert) {

		sinon.stub(SmartFilterBar.prototype, "_isTablet").returns(false);
		sinon.stub(SmartFilterBar.prototype, "_isPhone").returns(false);

		var oSmartFilter = new SmartFilterBar();
		assert.ok(oSmartFilter.getFilterBarExpanded());
		oSmartFilter._search();
		assert.ok(oSmartFilter.getFilterBarExpanded());

		oSmartFilter.destroy();
		SmartFilterBar.prototype._isTablet.restore();

		sinon.stub(SmartFilterBar.prototype, "_isTablet").returns(true);

		oSmartFilter = new SmartFilterBar();

		assert.ok(!oSmartFilter.getFilterBarExpanded());
		sinon.stub(oSmartFilter, "verifySearchAllowed").returns({});

		oSmartFilter.setFilterBarExpanded(true);
		assert.ok(oSmartFilter.getFilterBarExpanded());

		oSmartFilter._search();
		assert.ok(!oSmartFilter.getFilterBarExpanded());

		SmartFilterBar.prototype._isTablet.restore();
		SmartFilterBar.prototype._isPhone.restore();
		oSmartFilter.destroy();

		oSmartFilter = null;
	});

	QUnit.test("check getParameterBindingPath", function(assert) {

		sinon.stub(this.oSmartFilter, "getAnalyticBindingPath");
		this.oSmartFilter.getParameterBindingPath();
		assert.ok(this.oSmartFilter.getAnalyticBindingPath.called);
	});

	QUnit.test("check _onMetadataInitialised", function(assert) {
		var done = assert.async();

		var oFilterProvider = {
			getFilterBarViewMetadata: function() {
				return [];
			},
			attachPendingChange: function() {
			}
		};

		var fResolve, oPromise = new Promise(function(resolve) {
			fResolve = resolve;
		});

		sinon.stub(this.oSmartFilter, "_initializeVariantManagement");

		sinon.stub(this.oSmartFilter, "_createFilterProvider").callsFake(function() { fResolve(oFilterProvider); return oPromise;});

		assert.ok(!this.oSmartFilter._bCreateFilterProviderCalled);

		var oModel = new JSONModel();
		this.oSmartFilter.setModel(oModel);
		this.oSmartFilter.setEntitySet("A");
		this.oSmartFilter._onMetadataInitialised();

		oPromise.then(function() {
			assert.ok(this.oSmartFilter._bCreateFilterProviderCalled);
			assert.ok(this.oSmartFilter._createFilterProvider.calledOnce);
			done();
		}.bind(this));

	});

	QUnit.test("check _initializeMetadata bWaitForFlexChanges depending on context", function (assert) {
		// Arrange
		var oSpy = sinon.spy(ODataModelUtil, "handleModelInit");

		sinon.stub(this.oSmartFilter, "_onMetadataInitialised").returns(""); // We do nothing

		// Act
		this.oSmartFilter._initializeMetadata();

		// Assert
		assert.strictEqual(oSpy.callCount, 1, "Method called only once");
		assert.strictEqual(oSpy.getCall(0).args[2], true, "Method called with 'true' by default");

		// Arrange
		oSpy.reset();
		this.oSmartFilter.setIsRunningInValueHelpDialog(true);

		// Act
		this.oSmartFilter._initializeMetadata();

		// Assert
		assert.strictEqual(oSpy.callCount, 1, "Method called only once");
		assert.strictEqual(oSpy.getCall(0).args[2], false, "Method called with 'false' when in VH Dialog");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("check getFilterContextUrl/getParameterContextUrl", function(assert) {

		var oFilterProvider = {
			getFilterContextUrl: function() {
				return "filterURL";
			},
			getParameterContextUrl: function() {
				return "parameterURL";
			}
		};

		this.oSmartFilter._oFilterProvider = oFilterProvider;

		assert.equal(this.oSmartFilter.getFilterContextUrl(), "filterURL");
		assert.equal(this.oSmartFilter.getParameterContextUrl(), "parameterURL");

		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("_checkIfFilterHasValue should return if filter has value", function (assert) {
		// Arrange
		var oData = {
			item1: null,
			item2: undefined,
			item3: "",
			item4: "some value",
			item5: new Date(),
			item6: { low: null, high: null },
			item7: { low: "some value", high: null },
			item8: { low: null, high: "some value" },
			item9: { low: "some value", high: "some value" },
			item10: { value: null, items: [], ranges: [] },
			item11: { value: "some value", items: [], ranges: [] },
			item12: { value: null, items: ["some value"], ranges: [] },
			item13: { value: null, items: [], ranges: ["some value"] },
			_CUSTOM: {
				item14: "some other value"
			},
			item15: 0
		};
		this.oSmartFilter._oFilterProvider = { getFilterData: this.stub().returns(oData) };

		assert.notOk(this.oSmartFilter._checkIfFilterHasValue("item1"), "'null' should return 'false'");
		assert.notOk(this.oSmartFilter._checkIfFilterHasValue("item2"), "'undefined' should return 'false'");
		assert.notOk(this.oSmartFilter._checkIfFilterHasValue("item3"), "'' should return 'false'");
		assert.ok(this.oSmartFilter._checkIfFilterHasValue("item4"), "'some value' should return 'true'");
		assert.ok(this.oSmartFilter._checkIfFilterHasValue("item5"), "'Date Object' should return 'true'");
		assert.notOk(this.oSmartFilter._checkIfFilterHasValue("item6"), "'low null' and 'high null' should return 'false'");
		assert.ok(this.oSmartFilter._checkIfFilterHasValue("item7"), "'low some value' and 'high null' should return 'true'");
		assert.ok(this.oSmartFilter._checkIfFilterHasValue("item8"), "'low null' and 'high some value' should return 'true'");
		assert.ok(this.oSmartFilter._checkIfFilterHasValue("item9"), "'low some value' and 'high some value' should return 'true'");
		assert.notOk(this.oSmartFilter._checkIfFilterHasValue("item10"), "'value null', 'items []' and 'ranges []' should return 'false'");
		assert.ok(this.oSmartFilter._checkIfFilterHasValue("item11"), "'value some value', 'items []' and 'ranges []' should return 'true'");
		assert.ok(this.oSmartFilter._checkIfFilterHasValue("item12"), "'value null', 'items [some value]' and 'ranges []' should return 'true'");
		assert.ok(this.oSmartFilter._checkIfFilterHasValue("item13"), "'value null', 'items []' and 'ranges [some value]' should return 'true'");
		assert.ok(this.oSmartFilter._checkIfFilterHasValue("item14"), "'some other value' should return true when in custom filter");
		assert.ok(this.oSmartFilter._checkIfFilterHasValue("item15"), "'0 should return true");

	});

	QUnit.test("_checkIfFilterHasValue should should use passed data instead of data from FilterProvider", function (assert) {
		// Arrange
		var oData = {
			item1: "data1"
		},
		oSourceData = {
			item2: "data2"
		};
		this.oSmartFilter._oFilterProvider = { getFilterData: this.stub().returns(oData) };

		assert.equal(this.oSmartFilter._checkIfFilterHasValue("item1"), true, "'data1' should return 'true'");
		assert.equal(this.oSmartFilter._checkIfFilterHasValue("item2", oSourceData), true, "'data2' should return 'true'");


		// Cleanup
	});

	QUnit.test("_removeEmptyFilters should remove all empty filters", function (assert) {
		// Arrange
		var oData = {
			item1: null,
			item2: undefined,
			item3: "",
			item4: "some value",
			item5: new Date(),
			item6: { low: null, high: null },
			item7: { low: "some value", high: null },
			item8: { low: null, high: "some value" },
			item9: { low: "some value", high: "some value" },
			item10: { value: null, items: [], ranges: [] },
			item11: { value: "some value", items: [], ranges: [] },
			item12: { value: null, items: ["some value"], ranges: [] },
			item13: { value: null, items: [], ranges: ["some value"] },
			_CUSTOM: []
		};
		var oModel = new JSONModel(oData);
		this.oSmartFilter._oFilterProvider = { getFilterData: this.stub().returns(oModel.getData()),
											   getFilterDataAsString: this.stub().returns(oModel.getJSON()) };
		this.oSmartFilter._oFilterProvider._aFilterBarDateTimeFieldNames = [];
		this.oSmartFilter._oFilterProvider._aFilterBarDateFieldNames = [];
		this.oSmartFilter._oFilterProvider._aFilterBarTimeFieldNames = [];
		sinon.stub(this.oSmartFilter,"_logAccessWhenNotInitialized");

		var sJson = this.oSmartFilter.getFilterDataAsStringForVariant(true, "V3");
		assert.ok(sJson);
		var oJson = JSON.parse(sJson);
		assert.ok(oJson.hasOwnProperty("item1"));
		assert.ok(!oJson.hasOwnProperty("item2"));
		assert.ok(oJson.hasOwnProperty("item3"));
		assert.ok(oJson.hasOwnProperty("item4"));
		assert.ok(oJson.hasOwnProperty("item5"));
		assert.ok(oJson.hasOwnProperty("item6"));
		assert.ok(oJson.hasOwnProperty("item7"));
		assert.ok(oJson.hasOwnProperty("item8"));
		assert.ok(oJson.hasOwnProperty("item9"));
		assert.ok(oJson.hasOwnProperty("item10"));
		assert.ok(oJson.hasOwnProperty("item11"));
		assert.ok(oJson.hasOwnProperty("item12"));
		assert.ok(oJson.hasOwnProperty("item13"));
		assert.ok(oJson.hasOwnProperty("_CUSTOM"));

		var sJsonResult = this.oSmartFilter._removeEmptyFilters(sJson);
		assert.ok(sJsonResult);
		var oJsonResult = JSON.parse(sJsonResult);
		assert.ok(!oJsonResult.hasOwnProperty("item1"));
		assert.ok(!oJsonResult.hasOwnProperty("item2"));
		assert.ok(!oJsonResult.hasOwnProperty("item3"));
		assert.ok(oJsonResult.hasOwnProperty("item4"));
		assert.ok(oJsonResult.hasOwnProperty("item5"));
		assert.ok(!oJsonResult.hasOwnProperty("item6"));
		assert.ok(oJsonResult.hasOwnProperty("item7"));
		assert.ok(oJsonResult.hasOwnProperty("item8"));
		assert.ok(oJsonResult.hasOwnProperty("item9"));
		assert.ok(!oJsonResult.hasOwnProperty("item10"));
		assert.ok(oJsonResult.hasOwnProperty("item11"));
		assert.ok(oJsonResult.hasOwnProperty("item12"));
		assert.ok(oJsonResult.hasOwnProperty("item13"));
		assert.ok(oJsonResult.hasOwnProperty("_CUSTOM"));

		oModel.destroy();
	});

	QUnit.test("_removeEmptyFilters should remove all non-conditionType empty filters", function (assert) {
		// Arrange
		var oData = {
			item1: null,
			item2: undefined,
			item3: { value: null, items: [], ranges: [] },
			_CUSTOM: []
		};
		var oModel = new JSONModel(oData);
		this.oSmartFilter._oFilterProvider = { getFilterData: this.stub().returns(oModel.getData()),
			getFilterDataAsString: this.stub().returns(oModel.getJSON()) };
		this.oSmartFilter._oFilterProvider._mConditionTypeFields = {
			item3: {
				conditionType: {
					_oInput: { getValueState: this.stub().returns("Error"), data: this.stub().returns(false) },
					getDefaultOperation: this.stub().returns({key: 'TODAY', category: 'FIXED.DATE', order: 3, type: 'range'})
				}
			}
		};
		this.oSmartFilter._oFilterProvider._aFilterBarDateTimeFieldNames = [];
		this.oSmartFilter._oFilterProvider._aFilterBarDateFieldNames = [];
		this.oSmartFilter._oFilterProvider._aFilterBarTimeFieldNames = [];
		sinon.stub(this.oSmartFilter,"_logAccessWhenNotInitialized");

		var sJson = this.oSmartFilter.getFilterDataAsStringForVariant(true, "V3");
		assert.ok(sJson);
		var oJson = JSON.parse(sJson);
		assert.ok(oJson.hasOwnProperty("item1"));
		assert.ok(!oJson.hasOwnProperty("item2"));
		assert.ok(oJson.hasOwnProperty("item3"));
		assert.ok(oJson.hasOwnProperty("_CUSTOM"));

		var sJsonResult = this.oSmartFilter._removeEmptyFilters(sJson);
		assert.ok(sJsonResult);
		var oJsonResult = JSON.parse(sJsonResult);
		assert.ok(!oJsonResult.hasOwnProperty("item1"));
		assert.ok(!oJsonResult.hasOwnProperty("item2"));
		assert.ok(oJsonResult.hasOwnProperty("item3"));
		assert.ok(oJsonResult.hasOwnProperty("_CUSTOM"));

		oModel.destroy();
	});

	QUnit.test("_removeEmptyFilters should not remove all empty filters if setFilterData is suspended", function (assert) {
		// Arrange
		var oData = {
			item1: null,
			item2: undefined,
			item3: "",
			item4: "some value",
			item5: new Date(),
			item6: { low: null, high: null },
			item7: { low: "some value", high: null },
			item8: { low: null, high: "some value" },
			item9: { low: "some value", high: "some value" },
			item10: { value: null, items: [], ranges: [] },
			item11: { value: "some value", items: [], ranges: [] },
			item12: { value: null, items: ["some value"], ranges: [] },
			item13: { value: null, items: [], ranges: ["some value"] },
			_CUSTOM: []
		};
		var oModel = new JSONModel(oData);
		this.oSmartFilter._oFilterProvider = { getFilterData: this.stub().returns(oModel.getData()),
			getFilterDataAsString: this.stub().returns(oModel.getJSON()) };
		this.oSmartFilter._oFilterProvider._aFilterBarDateTimeFieldNames = [];
		this.oSmartFilter._oFilterProvider._aFilterBarDateFieldNames = [];
		this.oSmartFilter._oFilterProvider._aFilterBarTimeFieldNames = [];
		sinon.stub(this.oSmartFilter,"_logAccessWhenNotInitialized");
		this.oSmartFilter.suspendSetFilterData();

		var sOriginalJSON = this.oSmartFilter.getFilterDataAsStringForVariant(true, "V3");
		var sResultJSON = this.oSmartFilter._removeEmptyFilters(sOriginalJSON);

		assert.equal(sResultJSON, sOriginalJSON, "The result should be the same as the original JSON");

		oModel.destroy();
	});

	QUnit.test("check _createArrayFromString ", function(assert) {
		this.oSmartFilter.setNavigationProperties("A, B, C");

		var aArray = this.oSmartFilter._createArrayFromString(this.oSmartFilter.getNavigationProperties());
		assert.ok(aArray);
		assert.equal(aArray.length, 3);
	});

	QUnit.test("keyup event with 'Enter' key on a checkbox should NOT trigger search", async function (assert) {
		// Arrange
		var oControlStub = new CheckBox(),
			oSearchSpy = this.spy(this.oSmartFilter, "search");
		oControlStub.placeAt("qunit-fixture");
		await nextUIUpdate();

		// Act
		this.oSmartFilter._handleEnter(oControlStub);
		qutils.triggerKeyup(oControlStub.getId(), KeyCodes.ENTER, false, false, false);

		// Assert
		assert.equal(oSearchSpy.callCount, 0, "search method should NOT be called");

		// Cleanup
		oControlStub.destroy();
		oSearchSpy.restore();
	});

	QUnit.test("check getSelectionVariants", function(assert) {
		var oSelectionVariants = {};
		this.oSmartFilter._oFilterProvider = {
			getSelectionVariants: function() {
				return oSelectionVariants;
			}
		};
		assert.ok(!this.oSmartFilter.getSelectionVariants());

		oSelectionVariants = {
			test: 1
		};
		assert.ok(this.oSmartFilter.getSelectionVariants());

		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("check getDescriptionForKeys", function(assert) {

		var sCalled = null, bReadDataA = false, bReadDataB = false;
		var aVHProviders = [
			{
				sFieldName: "A",
				_bValueListRequested: true,
				loadAnnotation: function() {
					assert.ok(true);
				},
				readData: function(aFilters) {
					bReadDataA = true;
					assert.ok(aFilters);
					assert.equal(aFilters.length, 2);
					assert.equal(aFilters[0], "001");
					assert.equal(aFilters[1], "002");
				}
			}, {
				sFieldName: "B",
				_bValueListRequested: false,
				loadAnnotation: function() {
					sCalled = "B";
				},
				readData: function(aFilters) {
					bReadDataB = true;
				}
			}
		];

		this.oSmartFilter._oFilterProvider = {
			getAssociatedValueListProviders: function() {
				return aVHProviders;
			}
		};

		var aFiltersWithKeyValues = [
			{
				filterName: "A",
				keys: [
					"001", "002"
				]
			}
		];
		this.oSmartFilter.getDescriptionForKeys(aFiltersWithKeyValues);

		assert.ok(bReadDataA);
		assert.ok(!bReadDataB);
		assert.ok(!sCalled);

		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("calling search in live mode should trigger search with delay of 0", function (assert) {
		// Arrange
		var oIsLiveModeStub = this.stub(this.oSmartFilter, "isLiveMode").returns(true),
			oTriggerSearchSpy = this.spy(this.oSmartFilter, "triggerSearch"),
			oSearchSpy = this.spy(this.oSmartFilter, "_search"),
			done = assert.async();
		this.oSmartFilter.attachEventOnce("search", onSearch);

		// Act
		this.oSmartFilter.search();
		this.oSmartFilter.search();
		this.oSmartFilter.search();

		function onSearch() {
			// Assert
			assert.ok(oTriggerSearchSpy.calledWith(0), "triggerSearch should be called with parameter '0'");
			assert.equal(oSearchSpy.callCount, 1, "triggerSearch should be called once");

			// Cleanup
			oIsLiveModeStub.restore();
			oTriggerSearchSpy.restore();
			oSearchSpy.restore();
			done();
		}
	});

	QUnit.test("check create ValueList with delayed association", function(assert) {
		// Arrange
		this.stub(this.oSmartFilter, "getSuppressValueListsAssociation").returns(true);
		this.oSmartFilter._oFilterProvider = new FilterProvider();
		var oFireAssociateValueListsSpy = this.spy(this.oSmartFilter._oFilterProvider, "_fireEvent");

		// Act
		this.oSmartFilter.associateValueLists();

		// Assert
		assert.ok(oFireAssociateValueListsSpy.calledWith(FilterProviderUtils.ASSOCIATE_VALUE_LISTS));

		// Clean Up
		this.oSmartFilter._oFilterProvider.destroy();
	});

	QUnit.test("check getFilterBarViewMetadata with additional ValueList annotations with qualifier", function(assert) {
		var resultViewMetadata,
			resultViewMetadataFull,
			aViewMetadata = [
				{
					groupName: "TestGroup",
					fields: [{
						groupName: "TestGroup",
						fullName: "A",
						hasValueListAnnotation: true,
						filterRestriction: "single",
						filterType: "Edm.String",
						visibleInAdvancedArea: true,
						_bSuppressValueListsAssociation: true
					}]
				}
			],
			oViewMetadataExtend = {
				"TestGroup": {
					"A": {
						"com.sap.vocabularies.Common.v1.ValueList": {
							"Label": { "String": "Types" },
							"CollectionPath": { "String": "StringVH"},
							"SearchSupported": { "Bool": "true" },
							"Parameters": [{"LocalDataProperty": { "PropertyPath": "STRING_SINGLE" }, "ValueListProperty": { "String": "KEY"}, "RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterInOut"}, {"ValueListProperty": {"String": "TXT"}, "RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"}]
						},
						"com.sap.vocabularies.Common.v1.ValueList#VisualFilter": {
							"Label": { "String": "Types" },
							"CollectionPath": { "String": "StringVH"},
							"SearchSupported": { "Bool": "true" },
							"Parameters": [{"LocalDataProperty": { "PropertyPath": "STRING_SINGLE" }, "ValueListProperty": { "String": "KEY"}, "RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterInOut"}, {"ValueListProperty": {"String": "TXT"}, "RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"}]
						}
					}
				}
			};

		// Arrange
		this.stub(this.oSmartFilter, "_aFilterBarViewMetadata").value(aViewMetadata);
		this.stub(this.oSmartFilter, "_oFilterBarViewMetadataExtend").value(oViewMetadataExtend);

		// Act
		resultViewMetadataFull = this.oSmartFilter.getFilterBarViewMetadata(true);
		resultViewMetadata = this.oSmartFilter.getFilterBarViewMetadata();

		// Assert
		assert.ok(resultViewMetadataFull[0].fields[0].hasOwnProperty("com.sap.vocabularies.Common.v1.ValueList"));
		assert.ok(resultViewMetadataFull[0].fields[0].hasOwnProperty("com.sap.vocabularies.Common.v1.ValueList#VisualFilter"));

		assert.notOk(resultViewMetadata[0].fields[0].hasOwnProperty("com.sap.vocabularies.Common.v1.ValueList"));
		assert.notOk(resultViewMetadata[0].fields[0].hasOwnProperty("com.sap.vocabularies.Common.v1.ValueList#VisualFilter"));
	});

	QUnit.test("refreshFiltersCount should update adapt filters count", function (assert) {
		// Arrange
		var fnDone = assert.async(),
			oInputString1 = new Input("STRING"),
			oFilterItem1 = new FilterGroupItem("filterItem1", {
				groupName: "GROUP1",
				control: oInputString1,
				label: "filterItem1",
				name: "STRING",
				visible: true,
				visibleInFilterBar: true
			}),
			oInputString2 = new Input("DATE_INTERVAL"),
			oFilterItem2 = new FilterGroupItem("filterItem2", {
				groupName: "GROUP1",
				control: oInputString2,
				label: "filterItem2",
				name: "DATE_INTERVAL",
				visible: true,
				visibleInFilterBar: true
			}),
			oMultiInput = new MultiInput("STRING_INOUT"),
			oFilterItem3 = new FilterGroupItem("filterItem3", {
				groupName: "GROUP1",
				control: oMultiInput,
				label: "filterItem3",
				name: "STRING_INOUT",
				visible: true,
				visibleInFilterBar: true
			}),
			oValueListProvider = Object.create(ValueListProvider.prototype);

		oValueListProvider._aValidationPromises = [];
		oValueListProvider.fakeValidator = function(){
			var oValidationPromise = new Promise(function (fnResolve, fnReject) {
				setTimeout(function (){
					fnResolve();
				}, 1);
			});
			this._addValidationPromise(oValidationPromise);
		};

		oFilterItem1.data("isCustomField", true);
		oFilterItem3.data("isCustomField", true);
		this.oSmartFilter.addFilterGroupItem(oFilterItem1);
		this.oSmartFilter.addFilterGroupItem(oFilterItem2);
		this.oSmartFilter.addFilterGroupItem(oFilterItem3);
		this.oSmartFilter.setBasicSearch(new SearchField("BASIC"));
		this.oSmartFilter.registerGetFiltersWithValues(this.oSmartFilter.getFiltersWithValues.bind(this.oSmartFilter));
		this.oSmartFilter._oFilterProvider = new FilterProvider();
		this.oSmartFilter._oFilterProvider._aValueListProvider.push(oValueListProvider);

		// Act
		this.oSmartFilter.setFilterData({
				"DATE_INTERVAL": {
					"conditionTypeInfo": {
						"name": "sap.ui.comp.config.condition.DateRangeType",
						"data": {
							"operation": "LASTDAYS",
							"value1": 7,
							"value2": null,
							"key": "AuthorizationDate",
							"calendarType": "Gregorian"
						}
					}
				}
			},
			true
		);

		// assert
		assert.equal(this.oSmartFilter._getFiltersWithValuesCount(), 1);

		// Act
		this.oSmartFilter.getBasicSearchControl().setValue("basic");
		oInputString1.setValue("One");
		oInputString2.setValue("Two");
		oMultiInput.addValidator(oValueListProvider.fakeValidator.bind(oValueListProvider));
		oMultiInput.setValue("Three");
		oMultiInput._validateCurrentText();

		this.oSmartFilter.refreshFiltersCount().then(function(){
			// assert
			assert.equal(this.oSmartFilter._getFiltersWithValuesCount(), 4);
			fnDone();
		}.bind(this));

		// Clean
		oValueListProvider = null;
	});

	QUnit.test("getAllFilterItems with custom item with visibleInFilterBar=false and hasValue=true", function (assert) {
		// Arrange
		this.stub(this.oSmartFilter, "_checkIfFilterHasValue").returns(false);

		this.oSmartFilter._mAdvancedAreaFilter = {
			"groupName": {
				"items": [
					{
						"filterItem": {
							getVisible: this.stub().returns(true),
							getVisibleInFilterBar: this.stub().returns(false),
							getName: this.stub().returns("CustomControlWithValue"),
							data: this.stub().returns(true) // .data("isCustomControl")
						},
						"control": {
							data: this.stub().returns(true) // .data("hasValue")
						}
					}
				]
			}
		};

		// Act
		var aResult = this.oSmartFilter.getAllFilterItems(true);

		// Assert
		assert.equal(aResult.length, 1);
		assert.equal(aResult[0].getName(), "CustomControlWithValue");
	});

	QUnit.test("CustomFilterData", function (assert) {
		// Arrange
		this.oSmartFilter._oFilterProvider = new FilterProvider();

		// Act
		this.oSmartFilter.setCustomFilterData({
				"SomeKey": "someData"
			}
		);

		// assert
		assert.equal(this.oSmartFilter.getCustomFilterData()["SomeKey"], "someData");
	});

	QUnit.test("BCP: 2170240718 _checkForValues for ComboBox should return correct value when selectedKey is number", function (assert) {
		// Arrange
		var oControl = new ComboBox({
				selectedKey: "1",
				items: [
					new Item({key: "1", text: "Item 1"})
				]
			}),
			bHasValue;

		// Act
		bHasValue = this.oSmartFilter._checkForValues(
				{name: 1},
				new FilterItem({name: "name"}),
				oControl
			);

		// assert
		assert.ok(bHasValue, "Control should have a value");
	});

	QUnit.test("hasDateRangeTypeFieldsWithValue correctly return if there are DateRangeType fields with value", function (assert) {
		// Arrange
		var aPromises = [],
			done = assert.async(),
			oGetFilterDataStub = this.stub(this.oSmartFilter, "getFilterData").returns({
				DateField: "Value"
			}),
			oGetInitializedPromiseStub = this.stub(this.oSmartFilter, "getInitializedPromise").returns(Promise.resolve());
		this.oSmartFilter._oFilterProvider = {
			_mConditionTypeFields: {
				DateField: {conditionType: { /* Mocked Object */}}
			}
		};

		// Act
		var oPromise = this.oSmartFilter.hasDateRangeTypeFieldsWithValue().then(function (bResult) {
			// Assert
			assert.ok(bResult, "hasDateRangeTypeFieldsWithValue should return true if there is a DateRangeType field with a value");
		});
		aPromises.push(oPromise);

		// Act
		oGetFilterDataStub.restore();
		oGetFilterDataStub = this.stub(this.oSmartFilter, "getFilterData").returns({});
		oPromise = this.oSmartFilter.hasDateRangeTypeFieldsWithValue().then(function (bResult) {
			// Assert
			assert.notOk(bResult, "hasDateRangeTypeFieldsWithValue should return false if there is a DateRangeType but with no value");
		});
		aPromises.push(oPromise);

		// Cleanup
		Promise.all(aPromises).then(function () {
			done();
		});
		oGetFilterDataStub.restore();
		oGetInitializedPromiseStub.restore();
	});

	QUnit.test("_setFilterData should instanciate filters which are not visible but contains data", function(assert) {
		// Arrange
		var oData = {"ITEM": "", "ITEM2": "Some Name"};
		sinon.stub(this.oSmartFilter, "_getFilterMetadata").returns(true);
		sinon.spy(this.oSmartFilter, "_instanciateFilterItem");

		// Act
		this.oSmartFilter._setFilterData(oData);

		// Assert
		assert.equal(this.oSmartFilter._instanciateFilterItem.calledOnce, true, "Only filter for which we will set data is instanciated");
	});

	QUnit.test("_setFilterData should instanciate filters which are not visible but contains data", function(assert) {
		// Arrange
		var oData = {"ITEM2": "Some Name"};
		sinon.stub(this.oSmartFilter, "_getFilterMetadata").withArgs("ITEM2").returns(true);
		sinon.spy(this.oSmartFilter, "_instanciateFilterItem");

		// Act
		this.oSmartFilter._setFilterData(oData);

		// Assert
		assert.equal(this.oSmartFilter._instanciateFilterItem.calledOnce, true, "Filter in which we eill set data is instanciated");
	});

	QUnit.test("_validateState should correctly detect that DateRangeType field is in errored state", function (assert) {
		// Arrange
		this.oSmartFilter._oFilterProvider = {
			_mConditionTypeFields: {
				FieldName: {
					conditionType: {
						_oInput: { getValueState: this.stub().returns("Error"), data: this.stub().returns(false) }
					}
				}
			},
			_validateConditionTypeFields: this.stub().returns(false)
		};
		var bResult = this.oSmartFilter._validateState();

		assert.notOk(bResult, "state should be false because _validateState founds DynamicDateRange field with error");
	});

	QUnit.test("check _applyAttributes and _applyInputModeAttribute are called on after rendering on phone", function(assert) {
		var oSmartFilter = new SmartFilterBar();
		oSmartFilter._oFilterProvider = {
			_aFilterBarNumericFieldMetadata : ["number"]
		};
		var aControls = [
				new FilterItem()
			],
			oSinonStub;

		aControls[0].setControl(new Input());
		aControls[0].setName("number");

		oSinonStub = sinon.stub(oSmartFilter, "getAllFilterItems");
		oSinonStub.withArgs(true).returns(aControls);

		sinon.stub(oSmartFilter, "_isPhone").returns(true);
		sinon.stub(oSmartFilter, "_isTablet").returns(true);
		sinon.spy(oSmartFilter, "_applyAttributes");
		sinon.spy(oSmartFilter, "_applyInputModeAttribute");

		oSmartFilter.onAfterRendering();

		assert.ok(oSmartFilter._applyAttributes.called);
		assert.ok(oSmartFilter._applyInputModeAttribute.called);

		oSmartFilter.destroy();
	});

	QUnit.test("check only _applyAttributes is called on after rendering not on phone", function(assert) {

		var oSmartFilter = new SmartFilterBar();
		oSmartFilter._oFilterProvider = {
			_aFilterBarNumericFieldMetadata : ["number"]
		};
		var aControls = [
				new FilterItem()
			],
			oSinonStub;

		aControls[0].setControl(new Input());
		aControls[0].setName("number");

		oSinonStub = sinon.stub(oSmartFilter, "getAllFilterItems");
		oSinonStub.withArgs(true).returns(aControls);

		sinon.stub(oSmartFilter, "_isPhone").returns(false);
		sinon.stub(oSmartFilter, "_isTablet").returns(false);

		sinon.spy(oSmartFilter, "_applyAttributes");
		sinon.spy(oSmartFilter, "_applyInputModeAttribute");

		oSmartFilter.onAfterRendering();

		assert.ok(oSmartFilter._applyAttributes.called);
		assert.ok(oSmartFilter._applyInputModeAttribute.notCalled);

		oSmartFilter.destroy();
	});

	QUnit.test("BCP: 2380124335 _getVisibleControlsLoadingPromises ignores custom ComboBox fields", function (assert) {
		// Arrange
		var oSFB = new SmartFilterBar(),
			oGroupItem = new SmartFilterBarFilterGroupItem({
				control: new ComboBox()
			}),
			aItems;

		oGroupItem.data("isCustomField", true); // Mock custom filter
		this.stub(oSFB, "determineMandatoryFilterItems").returns([oGroupItem]);

		// Act
		aItems = oSFB._getVisibleControlsLoadingPromises();

		// Assert
		assert.strictEqual(aItems.length, 0, "No promises for custom ComboBox filters are returned.");

		// Cleanup
		oSFB.destroy();
	});

	// keyup event with 'Enter' key on a sap.m.MultiInput should trigger search
	testKeyupEnterOnControlsThatTriggerSearch(MultiInput);

	// keyup event with 'Enter' key on a sap.m.Input should trigger search
	testKeyupEnterOnControlsThatTriggerSearch(Input);

	// keyup event with 'Enter' key on a sap.m.DatePicker should trigger search
	testKeyupEnterOnControlsThatTriggerSearch(DatePicker);

	// keyup event with 'Enter' key on a sap.m.DateTimePicker should trigger search
	testKeyupEnterOnControlsThatTriggerSearch(DateTimePicker);

	// keyup event with 'Enter' key on a sap.m.DatePicker should trigger search
	testKeyupEnterOnControlsThatTriggerSearch(DateRangeSelection);

	// keyup event with 'Enter' key on a sap.m.TimePicker should trigger search
	testKeyupEnterOnControlsThatTriggerSearch(TimePicker);

	// keyup event with 'Enter' key on a sap.m.DynamicDateRange should trigger search
	testKeyupEnterOnControlsThatTriggerSearch(DynamicDateRange);

	// keyup event with 'Enter' key on a sap.m.Select should trigger search
	testKeyupEnterOnControlsThatTriggerSearch(Select);

	function testKeyupEnterOnControlsThatTriggerSearch (oControlType) {
		QUnit.test("keyup event with 'Enter' key on a " + oControlType.getMetadata().getName() + " should trigger search", async function (assert) {
			// Arrange
			var oControlStub = new oControlType(),
				oSearchSpy = this.spy(this.oSmartFilter, "search");
			oControlStub.placeAt("qunit-fixture");
			await nextUIUpdate();

			// Act
			this.oSmartFilter._handleEnter(oControlStub);
			qutils.triggerKeyup(oControlStub.getId(), KeyCodes.ENTER, false, false, false);

			// Assert
			assert.equal(oSearchSpy.callCount, 1, "search method should be called");

			// Cleanup
			oControlStub.destroy();
			oSearchSpy.restore();
		});
	}

	QUnit.module("FESR", {
		beforeEach: function () {
			this.oSFB = new SmartFilterBar();
		},
		afterEach: function () {
			this.oSFB.destroy();
			this.oSFB = null;
		}
	});

	QUnit.test("Semantic added to internally created buttons", function (assert) {
		// Arrange
		var oApplyFESRSemanticStub = this.stub(this.oSFB, "_applyFESRSemantic");

		// Act
		this.oSFB.onBeforeRendering.apply(this.oSFB);

		// Assert
		assert.equal(oApplyFESRSemanticStub.getCall(0).args[1], "sc:sfbGo");
		assert.equal(oApplyFESRSemanticStub.getCall(1).args[1], "sc:sfbShowHideToggle");
		assert.equal(oApplyFESRSemanticStub.getCall(2).args[1], "sc:sfbClear");
		assert.equal(oApplyFESRSemanticStub.getCall(3).args[1], "sc:sfbRestore");
		assert.equal(oApplyFESRSemanticStub.getCall(4).args[1], "sc:sfbAdaptFilters");

		// Cleanup
		oApplyFESRSemanticStub.restore();
	});

	QUnit.module("sap.ui.comp.smartfilterbar.SmartFilterBar", {
		beforeEach: function() {
			this.oSmartFilter = new SmartFilterBar();
		},
		afterEach: function() {
			this.oSmartFilter.destroy();
		}
	});

	QUnit.test("Test initialized event", function (assert) {
		// Arrange
		var done = assert.async(),
			oInitializedSpy = this.spy(this.oSmartFilter, "fireInitialized"),
			oPrivateInitializedSpy = this.spy(this.oSmartFilter, "_fireInitialized"),
			aPromises = [{}];

		sinon.stub(this.oSmartFilter, '_getVisibleControlsLoadingPromises').returns(aPromises);

		// Act
		this.oSmartFilter.attachInitialized(function() {
			// Assert
			assert.ok(oInitializedSpy.calledOnce, "SmartFilterBar initialized event should be called");
			assert.ok(oPrivateInitializedSpy.calledOnce, "SmartFilterBar private initialized event should be called");
			done();
		});

		this.oSmartFilter._initializeVariantManagement();

		// Clean
		oPrivateInitializedSpy.restore();
		oInitializedSpy.restore();
	});

	QUnit.test("Checking the _applyVariantFields method", function(assert) {

		// Arrange
		var sJson = '{"Date":{"conditionTypeInfo":{"name":"sap.ui.comp.config.condition.DateRangeType","data":{"operation":"DATE","value1":"2023-10-09T00:00:00.000","value2":null,"key":"Date","calendarType":"Gregorian"}},"ranges":[{"operation":"BT","value1":"2023-10-09T00:00:00.000","value2":"2023-10-09T23:59:59.999","exclude":false,"keyField":"Date","tokenText":null}],"items":[]}}',
			oParseSpy = this.spy(FilterProvider.prototype, "_parseFilterData"),
			oInitializeSpy;

		var oFilterProvider = new FilterProvider(),
			oVariantData = {
				"Date": {
					"conditionTypeInfo": {
						"name": "sap.ui.comp.config.condition.DateRangeType",
						"data": {
							"operation": "THISYEAR",
							"value1": null,
							"value2": null,
							"key": "Date",
							"calendarType": "Gregorian"
						}
					},
					"ranges": [
						{
							"operation": "BT",
							"value1": "2022-12-31T22:00:00.000Z",
							"value2": "2023-12-31T21:59:59.999Z",
							"exclude": false,
							"keyField": "Date"
						}
					],
					"items": []
				}
			},
			oInputJson = {
				"Date": {
					"conditionTypeInfo": {
						"name": "sap.ui.comp.config.condition.DateRangeType",
						"data": {
							"operation": "DATE",
							"value1": "2023-10-08T21:00:00.000Z",
							"value2": null,
							"key": "Date",
							"calendarType": "Gregorian"
						}
					},
					"ranges": [
						{
							"operation": "BT",
							"value1": "2023-10-08T21:00:00.000Z",
							"value2": "2023-10-09T20:59:59.999Z",
							"exclude": false,
							"keyField": "Date"
						}
					],
					"items": []
				}
			},
			oNewValue = {
				"conditionTypeInfo": {
					"name": "sap.ui.comp.config.condition.DateRangeType",
					"data": {
						"operation": "DATE",
						"value1": "2023-10-09T00:00:00.000",
						"value2": null,
						"key": "Date",
						"calendarType": "Gregorian"
					}
				},
				"ranges": [
					{
						"operation": "BT",
						"value1": "2023-10-09T00:00:00.000",
						"value2": "2023-10-09T23:59:59.999",
						"exclude": false,
						"keyField": "Date"
					}
				],
				"items": []
			};

		this.oSmartFilter._aFilterBarViewMetadata = [{
			fields: [{
				fieldName: "Date",
				filterType: "date"
			}]
		}];
		oFilterProvider._aFilterBarDateTimeFieldNames = [];
		oFilterProvider._aFilterBarTimeFieldNames = [];
		oFilterProvider._aFilterBarDateFieldNames = ['Date'];
		oFilterProvider._mConditionTypeFields = {
			"Date": {
				conditionType: {
					destroy: function() {},
					initialize: function() {},
					providerDataUpdated: function() {}
				}
			}
		};

		oInitializeSpy = this.spy(oFilterProvider._mConditionTypeFields["Date"].conditionType, "initialize");
		sinon.stub(oFilterProvider.oModel, "getData").returns(oInputJson);
		this.oSmartFilter._oFilterProvider = oFilterProvider;
		this.oSmartFilter.bIsInitialised = true;

		// Act
		this.oSmartFilter.setFilterData({});

		// Assert
		assert.ok(oParseSpy.calledOnce, "_parseFilterData is called once");
		assert.ok(oInitializeSpy.notCalled, "conditionType.initialize() is not invoked");

	   // Clean
		oParseSpy.reset();
		oFilterProvider.oModel.getData.restore();
		sinon.stub(oFilterProvider.oModel, "getData").returns(oVariantData);

		// Act
		this.oSmartFilter.setFilterDataAsStringFromVariant(sJson, true);

		// Assert
		assert.ok(oParseSpy.calledOnce, "_parseFilterData is called once");
		assert.ok(oInitializeSpy.called, "conditionType.initialize() is invoked");

		assert.ok(oInitializeSpy.calledWith(oNewValue), "conditionType.initialize() is called with the correct value");

		// Clean
		oParseSpy.restore();
		oInitializeSpy.restore();
	});

	QUnit.test("Test _getVisibleControlsLoadingPromises", function (assert) {
		// Arrange
		var oComboBox = sinon.createStubInstance(ComboBox),
			oFilterItem = sinon.createStubInstance(FilterItem),
			aFilterItems = [oFilterItem],
			aPromises;

		oComboBox.isA.withArgs("sap.m.ComboBox").returns(true);
		oComboBox.getItems.returns([]);
		oFilterItem._getControl.returns(oComboBox);
		sinon.stub(this.oSmartFilter, "determineControlByFilterItem").returns(oComboBox);

		sinon.stub(this.oSmartFilter, "getAllFilterItems").returns(aFilterItems);

		// Act
		aPromises = this.oSmartFilter._getVisibleControlsLoadingPromises();

		// Assert
		assert.equal(aPromises.length, 1, "one mandatory combobox");

		// Clean
		oComboBox = null;
		oFilterItem = null;
		this.oSmartFilter.getAllFilterItems.reset();
	});

	QUnit.test("BCP: 2380094229 fireInitialized wait for control loading when SFB is rendered", function (assert) {
		// Arrange
		var oSpy = this.spy(this.oSmartFilter, "_fireInitialized"),
			fnDone = assert.async();

		this.oSmartFilter.attachInitialized(function () {
			// Assert
			assert.strictEqual(oSpy.callCount, 1, "_fireInitialized called asynchronously");

			// Cleanup
			oSpy.restore();
			fnDone();
		});

		assert.expect(2);

		this.stub(this.oSmartFilter, "_getVisibleControlsLoadingPromises").returns([Promise.resolve()]);
		this.stub(this.oSmartFilter, "getDomRef").returns({});

		// Act
		this.oSmartFilter.fireInitialized();

		// Assert
		assert.strictEqual(oSpy.callCount, 0, "_fireInitialized is not called synchronously");
	});

	QUnit.test("BCP: 2380094229 fireInitialized synchronous when SFB is not rendered", function (assert) {
		// Arrange
		var oSpy = this.spy(this.oSmartFilter, "_fireInitialized");

		this.stub(this.oSmartFilter, "_getVisibleControlsLoadingPromises").returns([Promise.resolve()]);
		this.stub(this.oSmartFilter, "getDomRef").returns(undefined);

		// Act
		this.oSmartFilter.fireInitialized();

		// Assert
		assert.strictEqual(oSpy.callCount, 1, "_fireInitialized is called synchronously");
	});

	QUnit.test("BCP: 2380094657 fireInitialized synchronous when value list association is suppressed", function (assert) {
		// Arrange
		var oSpy = this.spy(this.oSmartFilter, "_fireInitialized");

		this.stub(this.oSmartFilter, "_getVisibleControlsLoadingPromises").returns([Promise.resolve()]);
		this.stub(this.oSmartFilter, "getSuppressValueListsAssociation").returns(true);
		this.stub(this.oSmartFilter, "getDomRef").returns({});

		// Act
		this.oSmartFilter.fireInitialized();

		// Assert
		assert.strictEqual(oSpy.callCount, 1, "_fireInitialized is called synchronously");
	});

	QUnit.test("setWarningState should not throw an error when unit field is not filterable", function (assert) {
		// Arrange
		var oControl = new MultiInput(),
			oFilterProvider = new FilterProvider();

		oControl._oFieldViewMetadata = {
			unit: "UnitOfMeasure",
			name: "Amount"
		};
		this.oSmartFilter._oFilterProvider = oFilterProvider;

		// Act
		this.oSmartFilter._setWarningState(oControl);

		// Assert
		assert.ok(true, "No exception thrown");

		// Clean up
		oControl.destroy();
		oFilterProvider.destroy();
	});

	QUnit.test("setWarningState should not set warning state when the currency field has UI.Hidden annotation", function (assert) {
		// Arrange
		var oControl = new MultiInput(),
			oFilterProvider = new FilterProvider(),
			fnStub = sinon.stub(oFilterProvider, "_getFieldMetadata").returns({
				"name": "UnitOfMeasure",
				"com.sap.vocabularies.UI.v1.Hidden": {
					"Bool": true
				}
			}),
			fnSpy = sinon.spy(oControl, "setValueState");

		oControl._oFieldViewMetadata = {
			unit: "UnitOfMeasure",
			name: "Amount"
		};
		this.oSmartFilter._oFilterProvider = oFilterProvider;

		// Act
		this.oSmartFilter._setWarningState(oControl);

		// Assert
		assert.equal(fnSpy.callCount, 0, "setWarningState was not called");

		// Clean up
		oControl.destroy();
		oFilterProvider.destroy();
		fnSpy.restore();
		fnStub.restore();
	});

	QUnit.test("setWarningState should not set warning state when the currency field has UI.HiddenFilter annotation", function (assert) {
		// Arrange
		var oControl = new MultiInput(),
			oFilterProvider = new FilterProvider(),
			fnStub = sinon.stub(oFilterProvider, "_getFieldMetadata").returns({
				"name": "UnitOfMeasure",
				"com.sap.vocabularies.UI.v1.HiddenFilter": {
					"Bool": true
				}
			}),
			fnSpy = sinon.spy(oControl, "setValueState");

		oControl._oFieldViewMetadata = {
			unit: "UnitOfMeasure",
			name: "Amount"
		};
		this.oSmartFilter._oFilterProvider = oFilterProvider;

		// Act
		this.oSmartFilter._setWarningState(oControl);

		// Assert
		assert.equal(fnSpy.callCount, 0, "setWarningState was not called");

		// Clean up
		oControl.destroy();
		oFilterProvider.destroy();
		fnSpy.restore();
		fnStub.restore();
	});

	QUnit.test("_setFilterData should not fire filterChange when called from Variant and only custom data is set", function (assert) {
		// Arrange
		this.oSmartFilter._bSetFilterDataFromVariant = false;
		var fnSpy = sinon.spy(this.oSmartFilter, "fireFilterChange");

		// Act
		this.oSmartFilter._setFilterData({_CUSTOM: {}});

		// Assert
		assert.equal(fnSpy.callCount, 0, "_setFilterData does not fire filterChange");

		// Cleanup
		fnSpy.restore();
	});

	QUnit.test("_setFilterData should fire filterChange when not called from Variant and only custom data is set", function (assert) {
		// Arrange
		this.oSmartFilter._bSetFilterDataFromVariant = true;
		var fnSpy = sinon.spy(this.oSmartFilter, "fireFilterChange");
		// Act
		this.oSmartFilter._setFilterData({_CUSTOM: {}});

		// Assert
		assert.equal(fnSpy.callCount, 1, "_setFilterData does not fire filterChange");
		assert.equal(this.oSmartFilter._bSetFilterDataFromVariant, false, "_bSetFilterDataFromVariant flag is restored");

		// Cleanup
		fnSpy.restore();

	});

	QUnit.test("setFilterDataAsStringFromVariant should set flag _bSetFilterDataFromVariant to true", function (assert) {
		// Arrange
		this.oSmartFilter._oFilterProvider = {
			_aFilterBarDateTimeFieldNames: [],
			_aFilterBarDateFieldNames: []
		};
		var fnGetFieldMetadataStub = sinon.stub(FilterProviderUtils, "_getFieldMetadata").returns({filterType: "string"}),
			fnSetFilterDataStub = sinon.stub(this.oSmartFilter, "setFilterData");

		// Act
		this.oSmartFilter.setFilterDataAsStringFromVariant('{"oData": "data"}');

		// Assert
		assert.equal(this.oSmartFilter._bSetFilterDataFromVariant, true, "_bSetFilterDataFromVariant flag is set");

		// Cleanup
		fnGetFieldMetadataStub.restore();
		fnSetFilterDataStub.restore();
	});

	QUnit.test("SNOW: DINC0091903 _ensureLoadedValueHelpList does not throw an uncaught in promise", function (assert) {
		// Arrange
		var oMockValueListProvider = {
				loadAnnotation: function () {
					return new Promise(function (fnResolve, fnReject) {
						throw "Test exception";
					});
				}
			},
			fnDone = assert.async(),
			bUnhandledRejection = false;

		addEventListener("unhandledrejection", (event) => {
			if (event.reason === "Test exception") {
				bUnhandledRejection = true;
			}
		});

		// Act
		this.oSmartFilter._ensureLoadedValueHelpList(oMockValueListProvider);

		// Assert
		setTimeout(function () {
			assert.ok(!bUnhandledRejection, "No unhandled promise rejection fired");
			fnDone();
		}, 100);
	});

	QUnit.test("_getFixedFilterItemSuggestions should return data for fixed-value valuelist fields", function (assert) {
		// Arrange
		const done = assert.async();
		const oSuggestion = {
			key: "1",
			text: "One"
		};
		this.oSmartFilter._oFilterProvider = {
			_aValueListProvider: [{
				sFieldName: "FixedValueField",
				_isControlDropdown: () => true,
				_getSuggestionsData: function () {
					return Promise.resolve([oSuggestion]);
				}
			}]
		};

		// Act
		this.oSmartFilter._getFixedFilterItemSuggestions("FixedValueField").then(function (aSuggestions) {
			assert.equal(aSuggestions.length, 1, "There is one suggestion");
			assert.deepEqual(aSuggestions[0], oSuggestion, "The suggestion is correct: " + JSON.stringify(oSuggestion));
			done();
		});
	});

	QUnit.test("_getFixedFilterItemSuggestions should throws an exception for standard valuelist fields", function (assert) {
		// Arrange
		const oSuggestion = {
			key: "1",
			text: "One"
		};
		this.oSmartFilter._oFilterProvider = {
			_aValueListProvider: [{
				sFieldName: "FixedValueField",
				_isControlDropdown: () => false,
				_getSuggestionsData: function () {
					return Promise.resolve([oSuggestion]);
				}
			}]
		};

		// Act
		assert.throws(function () { this.oSmartFilter._getFixedFilterItemSuggestions("FixedValueField"); }, "exception thrown if standard value list is used.");
	});

	QUnit.test("check triggerSearch calling date range type filterUpdate", function(assert) {
		// Arrange
		var oFilterData = {
			DateField: {
				"conditionTypeInfo": {
					"name": "sap.ui.comp.config.condition.DateRangeType",
					"data": {
						"operation": "LASTDAYS",
						"value1": 1,
						"value2": null,
						"key": "DateField",
						"calendarType": "Gregorian"
					}
				},
				"conditionType" :{
					updateFilters: function() {
					}
				},
				"ranges": [{
					"operation": "BT",
					"value1": new Date(2023, 2, 15),
					"value2": new Date(2023, 2, 16),
					"exclude": false,
					"keyField": "DateField"
				}]
			}
		};
		this.oSmartFilter._oFilterProvider = {};
		this.oSmartFilter.isInUTCMode = this.stub().returns(true);
		this.oSmartFilter._oFilterProvider._isSingleDynamicDateEnabled = this.stub().returns(false);
		this.oSmartFilter._aFilterBarViewMetadata = [{
			fields: [{
				fieldName: "DateField",
				filterType: "date"
			}]
		}];
		this.oSmartFilter._oFilterProvider._aFilterBarDateTimeFieldNames = [];
		this.oSmartFilter._oFilterProvider._aFilterBarTimeFieldNames = [];
		this.oSmartFilter._oFilterProvider._aFilterBarDateFieldNames = ["DateField"];
		this.oSmartFilter._oFilterProvider._validateConditionTypeFields = function() {};
		this.oSmartFilter._oFilterProvider.isPending = function() {};
		this.oSmartFilter._oFilterProvider._mConditionTypeFields = oFilterData;
		this.oSmartFilter._oFilterProvider["DateField"] = oFilterData.DateField;
		this.oSmartFilter._aFilterBarViewMetadata = [{
			fields: [{
				fieldName: "DateField",
				filterType: "date"
			}]
		}];
		sinon.stub(this.oSmartFilter._oFilterProvider, "_validateConditionTypeFields").returns(true);
		sinon.stub(this.oSmartFilter._oFilterProvider, "isPending").returns(false);
		sinon.stub(this.oSmartFilter, "validateMandatoryFields").returns(true);
		sinon.stub(this.oSmartFilter, "_validateState").returns(true);
		sinon.stub(this.oSmartFilter._oFilterProvider["DateField"].conditionType, "updateFilters");
		//sinon.stub(this.oSmartFilter, "_search");
		var oGetFilterData = this.stub(this.oSmartFilter, "getFilterData").returns(oFilterData);
		this.oSmartFilter._search();

		// Assert
		assert.ok(this.oSmartFilter._oFilterProvider["DateField"].conditionType.updateFilters.calledOnce);
		// Cleanup
		oGetFilterData.restore();
	});
});
