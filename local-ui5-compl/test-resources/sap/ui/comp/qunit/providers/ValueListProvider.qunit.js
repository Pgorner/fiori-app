/* global QUnit, sinon */
sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/comp/odata/MetadataAnalyser",
	"sap/ui/comp/providers/ValueListProvider",
	"sap/ui/comp/historyvalues/Constants",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/MultiInput",
	"sap/m/ComboBox",
	"sap/m/MultiComboBox",
	"sap/ui/core/Theming",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/library",
	'sap/ui/model/type/String',
	"sap/ui/core/theming/Parameters",
	"sap/ui/base/Event",
	"sap/ui/comp/smartfilterbar/SFBMultiInput",
	"sap/ui/core/Item"
], function(JSONModel, MetadataAnalyser, ValueListProvider, HistoryConstants, Text, Input, MultiInput, ComboBox, MultiComboBox, Theming, ODataModel, SmartField, library, TypeString, ThemeParameters, Event, SFBMultiInput, Item) {
	"use strict";

	var DisplayBehaviour = library.smartfilterbar.DisplayBehaviour;
	this.oThemeParametersStub = sinon.stub(ThemeParameters, "get");
	this.oThemeParametersStub.withArgs({ name: "sapMFontMediumSize" }).returns("1rem");
	this.oThemeParametersStub.withArgs({ name: "sapUiFontFamily" }).returns("Helvetica");
	Theming.notifyContentDensityChanged();

	QUnit.module("sap.ui.comp.providers.ValueListProvider", {
		beforeEach: function() {
			this.oAnnotation = {valueListEntitySetName:"Chuck",keyField:"TheKey",descriptionField:"Desc",keys:["TheKey"],valueListFields:[{name:"TheKey", visible: true, type: "Edm.String", maxLength: 7, fieldLabel: "Label"},{name:"Desc", visible: true, type: "Edm.String"}]};
			this.oModel = sinon.createStubInstance(ODataModel);
			this.oValueListProvider = new ValueListProvider({control: sinon.createStubInstance(MultiComboBox), aggregation:"items",annotation:this.oAnnotation,model:this.oModel,typeAheadEnabled:false});
			this.oValueListProvider.oControl.isA = function (sType) {
				// Test only for MultiComboBox as ComboBox scenario is covered in SmartField OPA Tests
				return sType === "sap.m.MultiComboBox";
			};
		},
		afterEach: function() {
			this.oValueListProvider.destroy();
			this.oValueListProvider = null;
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oValueListProvider);
	});

	QUnit.test("Shall have an instance of oDataModel", function(assert) {
		assert.ok(this.oValueListProvider.oODataModel);
	});

	QUnit.test("Shall call addEventDelegate onInitialise of drop downs", function(assert) {
		assert.strictEqual(this.oValueListProvider.oControl.addEventDelegate.calledOnce,true);
	});

	QUnit.test("_createSuggestionTemplate calcColumnWidth", function (assert) {
		// Arrange
		var sWidthResutl;

		this.oValueListProvider.oControl = {
			data: this.stub(),
			unbindAggregation: this.stub(),
			removeEventDelegate: this.stub(),
			removeAllSuggestionColumns: this.stub(),
			addSuggestionColumn: function(a) {
				if (!sWidthResutl) {
					sWidthResutl = a.getWidth();
				}
			},
			isA: this.stub().returns(true),
			setProperty: this.stub()
		};

		// Act
		this.oValueListProvider._createSuggestionTemplate();
		// Assert
		assert.ok(parseFloat(sWidthResutl) >= 5.72, "Column width should be correctly calculcated");
	});

	QUnit.test("The suggestionSeparators property should be correctly sets", function (assert) {
		// Arrange
		this.oValueListProvider._aCols = [{
			template: ["FirstName"]
		}];

		this.oValueListProvider.oControl = new Input();
		sinon.spy(this.oValueListProvider.oControl , "_setSeparateSuggestions");
		// Act
		this.oValueListProvider._createSuggestionTemplate();
		// Assert
		assert.ok(this.oValueListProvider.oControl._setSeparateSuggestions.calledWith(false), "The separateSuggestions property set to false");
	});

	QUnit.test("_handleOutParameters shall call attachSelectionChange with _onMultiComboBoxItemSelected as parameter", function (assert) {
		// Arrange
		var oVLP = this.oValueListProvider;

		// Act
		oVLP._handleOutParameters();

		// Assert
		assert.ok(oVLP.oControl.attachSelectionChange.calledOnce);
		assert.ok(oVLP.oControl.attachSelectionChange.calledWith(oVLP._onMultiComboBoxItemSelected, oVLP));
	});

	QUnit.test("_onMultiComboBoxItemSelected shall call _calculateAndSetFilterOutputData", function (assert) {
		// Arrange
		var oVLP = this.oValueListProvider,
			oMockRow = {
				TheKey: "key",
				Desc: "description",
				getBindingContext: function () {
					return {
						getObject: function () {
							return oMockRow;
						}
					};
				}
			},
			oEvent = {getParameter:sinon.stub()};
			oEvent.getParameter.returns(oMockRow);
			sinon.spy(oVLP, "_calculateAndSetFilterOutputData");

		// Act
		oVLP._onMultiComboBoxItemSelected(oEvent);

		// Assert
		assert.ok(oVLP._calculateAndSetFilterOutputData.calledOnce);
		assert.ok(oVLP._calculateAndSetFilterOutputData.calledWith([oMockRow]));
	});

	QUnit.test("_fetchData should be called for filtering", function (assert) {
		// Arrange
		this.oValueListProvider.mFilterInputData = {};
		this.oValueListProvider.aFilterField = ["KeyField"];
		this.oValueListProvider.oControl.setSelectedKey = function() {};
		sinon.spy(this.oValueListProvider, "_fetchData");
		sinon.stub(this.oValueListProvider, "_calculateFilterInputData").returns({});
		this.oValueListProvider.oControl.getBinding = function () {
			return {
				filter: function() {
					return {};
				}
			};
		};

		// Act
		this.oValueListProvider._filterDropdownRowsByInParameters();

		// Assert
		assert.strictEqual(this.oValueListProvider._fetchData.calledOnce, true);
	});

	QUnit.test("_cleanupControlSelection should be called after filtering", function (assert) {
		// Arrange
		this.oValueListProvider.mFilterInputData = {};
		this.oValueListProvider.aFilterField = ["KeyField"];
		this.oValueListProvider.oControl.setSelectedKey = function() {};
		sinon.spy(this.oValueListProvider, "_cleanupControlSelection");
		sinon.stub(this.oValueListProvider, "_calculateFilterInputData").returns({});
		this.oValueListProvider.oControl.getBinding = function () {
			return {
				filter: function() {
					return {};
				}
			};
		};

		// Act
		this.oValueListProvider._filterDropdownRowsByInParameters();

		// Assert
		assert.strictEqual(this.oValueListProvider._cleanupControlSelection.calledOnce, true);
	});

	QUnit.test("_cleanupControlSelection should clear model and selected keys", function (assert) {
		// Arrange
		var aSelectedKeys = ["1"],
			oValueListProvider = this.oValueListProvider;

		oValueListProvider.sFieldName = "inout";
		oValueListProvider.oFilterModel = {
			"/inout/items": [1],
			setProperty: function (sPropertyPath, vResult) {
				this[sPropertyPath] = vResult;
			}
		};
		oValueListProvider.mFilterInputData = {
			"in": "bar"
		};
		oValueListProvider.oControl.setSelectedKeys(aSelectedKeys);
		oValueListProvider.aFilterField = {};

		// Act
		oValueListProvider._cleanupControlSelection();

		// Assert

		assert.ok(oValueListProvider.oControl.setSelectedKeys.calledWith(null));
		assert.strictEqual(oValueListProvider.oFilterModel["/" + oValueListProvider.sFieldName + "/items"].length, 0);
	});

	QUnit.test("_cleanupControlSelection should clear only selected keys for MultiComboBox when not in SmartFilterBar", function (assert) {
		// Arrange
		var aSelectedKeys = ["1"],
			oValueListProvider = this.oValueListProvider;

		oValueListProvider.sFieldName = "inout";
		oValueListProvider.mFilterInputData = {
			"in": "bar"
		};
		oValueListProvider.oControl.setSelectedKeys(aSelectedKeys);
		oValueListProvider.aFilterField = {};

		// Act
		oValueListProvider._cleanupControlSelection();

		// Assert

		assert.ok(true, "No exception is thrown");
		assert.ok(oValueListProvider.oControl.setSelectedKeys.calledWith(null));
	});

	QUnit.test("_isControlDropdown shall return true if control is of type ComboBox or MultiComboBox", function (assert) {
		// Act
		var bResult = this.oValueListProvider._isControlDropdown();

		// Assert
		assert.ok(bResult);
	});

	QUnit.test("Shall call bindAggrgation/_fetchData once control is rendered", function(assert) {
		var oDelegate;
		this.oValueListProvider.mOutParams = {
			out1: "out1",
			out2: "out2"
		};
		this.oValueListProvider.mInParams = {
			in1: "in1",
			in2: "in2"
		};

		this.oValueListProvider.oControl.isA = function(sType) {
			if (sType === "sap.m.MultiComboBox") {
				return true;
			}
		};
		this.oValueListProvider._oMetadataAnalyser = new MetadataAnalyser();
		sinon.spy(this.oValueListProvider._oMetadataAnalyser, "_getPresentationVariantQualifierForVHD");
		sinon.spy(this.oValueListProvider,"_fetchData");
		sinon.spy(this.oValueListProvider,"_isControlDropdown");
		sinon.spy(this.oValueListProvider,"_handleOutParameters");
		sinon.spy(this.oValueListProvider,"_handleInParameters");
		oDelegate = this.oValueListProvider.oControl.addEventDelegate.args[0][0];
		oDelegate.onAfterRendering.call(this.oValueListProvider);
		assert.strictEqual(this.oValueListProvider.oControl.bindAggregation.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._fetchData.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._isControlDropdown.calledTwice,true);
		assert.strictEqual(this.oValueListProvider._handleInParameters.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._handleOutParameters.calledOnce,true);
		assert.strictEqual(this.oValueListProvider.oControl.removeEventDelegate.calledOnce,true);
	});

	QUnit.test("_handleInParameters shall call _calculateFilterInputData() in order to prevent double filtering", function(assert) {

		// Arrange
		sinon.spy(this.oValueListProvider, "_calculateFilterInputData");

		// Act
		this.oValueListProvider._handleInParameters();

		// Assert
		assert.strictEqual(this.oValueListProvider._calculateFilterInputData.calledOnce, true);
	});

	QUnit.test("_fetchData should include InParams as filter in the initial GET request for DropDowns", function(assert) {

		// Arrange
		var oValueListProvider = this.oValueListProvider,
			oEvent = sinon.createStubInstance(Event);

		// oValueListProvider.oControl.getBinding.withArgs("items").returns(oODataListBinding);
		oValueListProvider.oControl.bindAggregation.callsFake(function(sName, oSettings){
			oSettings.events.dataReceived(oEvent);
		});

		oValueListProvider.mInParams = {
			in1: "in1",
			in2: "in2"
		};
		sinon.stub(oValueListProvider, "_calculateFilterInputData").callsFake(function(){
			oValueListProvider.mFilterInputData = {in2: "in2"};
			oValueListProvider.aFilterField = ["in2"];
		});

		// Act
		oValueListProvider._fetchData();

		// Assert
		assert.equal(oValueListProvider.oControl.bindAggregation.getCall(0).args[1].filters.length, 1, "Filters are added to initial request");
		assert.equal(this.oValueListProvider.oControl.setBusy.callCount, 2);
		assert.ok(this.oValueListProvider.oControl.setBusy.calledWith(true), "The ComboBox busy indicator was set to true");
		assert.ok(this.oValueListProvider.oControl.setBusy.calledWith(false), "The ComboBox busy indicator was set to false");

		// Clean
		oEvent = null;
		oValueListProvider.oControl.bindAggregation.restore();
		oValueListProvider._calculateFilterInputData.restore();
	});

	QUnit.test("_fetchData should include mConstParams as filter in the initial GET request for DropDowns", function(assert) {

		// Arrange
		var oValueListProvider = this.oValueListProvider;

		oValueListProvider.aFilterField = [];
		sinon.spy(oValueListProvider, "_calculateFilterInputData");
		sinon.stub(oValueListProvider, "mInParams").value({
			in1: "in1"
		});
		sinon.stub(oValueListProvider, "mConstParams").value({
			const1: "const1Value"
		});
		oValueListProvider.oControl.getBindingContext.restore();
		sinon.stub(oValueListProvider.oControl, "getBindingContext").returns({getProperty: function(){return "in1";}});


		// Act
		oValueListProvider._fetchData();

		// Assert
		assert.strictEqual(oValueListProvider._calculateFilterInputData.calledOnce, true);
		assert.equal(oValueListProvider.oControl.bindAggregation.getCall(0).args[1].filters.length, 1, "Filters are added to initial request");

		// Clear
		delete oValueListProvider.aFilterField;
		delete oValueListProvider.mInParams;
		delete oValueListProvider.mConstParams;
		oValueListProvider._calculateFilterInputData.restore();
		oValueListProvider.oControl.getBindingContext.restore();

	});

	QUnit.test("_fetchData should add dataReceived event for DropDowns with In Params to remove busy indicator", function(assert) {

		// Arrange
		var oValueListProvider = this.oValueListProvider;

		oValueListProvider.mInParams = {
			in1: "in1",
			in2: "in2"
		};

		// Act
		oValueListProvider._fetchData();

		// Assert
		assert.ok(oValueListProvider.oControl.bindAggregation.getCall(0).args[1].events.dataReceived, "DataReceived is added as argument");
	});

	QUnit.test("_fetchData should check for ValueListRelevantQualifiers and recalculate the qualifiers ", function(assert) {

		// Arrange
		var oValueListProvider = this.oValueListProvider,
			fnHasValueListRelevantQualifiersStub = sinon.stub(MetadataAnalyser, "hasValueListRelevantQualifiers").returns(true),
			fnPrimaryValueListAnnotationChangedSpy = sinon.spy(oValueListProvider, "_primaryValueListAnnotationChanged");

		// Act
		oValueListProvider._fetchData();

		// Assert
		assert.ok(fnHasValueListRelevantQualifiersStub.calledOnce, "MetadataAnalyser.hasValueListRelevantQualifiers has been called");
		assert.ok(fnPrimaryValueListAnnotationChangedSpy.calledOnce, "_primaryValueListAnnotationChanged has been called");

		fnPrimaryValueListAnnotationChangedSpy.restore();
		fnHasValueListRelevantQualifiersStub.restore();
	});

	QUnit.test("_getSuggestionsData should return the data for fixed value-list fields", function (assert) {
		var done = assert.async(),
			oExpectedFirstSuggestions = { key: "0001", description: "Company 0001" },
			oExpectedSecondSuggestions = { key: "0002", description: "Company 0002" };

		this.oValueListProvider.oODataModel = {
			read: (sPath, oParameters) => {
				// Simulate async call
				oParameters.success({
					results: [
						{ Desc: "Company 0001", TheKey: "0001" },
						{ Desc: "Company 0002", TheKey: "0002" }
					]
				});
			}
		};

		// Arrange
		this.oValueListProvider._getSuggestionsData().then(function (aSuggestionsData) {
			assert.equal(aSuggestionsData.length, 2, "Two suggestions are returned");
			assert.deepEqual(aSuggestionsData[0], oExpectedFirstSuggestions, "First suggestion is correct: " + JSON.stringify(oExpectedFirstSuggestions));
			assert.deepEqual(aSuggestionsData[1], oExpectedSecondSuggestions, "Second suggestion is correct: " + JSON.stringify(oExpectedSecondSuggestions));
			done();
		});
	});

	QUnit.test("_fetchData should check for ValueListRelevantQualifiers and recalculate the qualifiers ", function(assert) {

		// Arrange
		var oValueListProvider = this.oValueListProvider,
			sSomeBindingContextPath = "sSomeBindingContextPath",
			oBindingContext = {},
			sFullyQualifiedFieldName = "sSomePath",
			fnGetValueListAnnotationLazySpy,
			bResult1,
			bResult2,
			done = assert.async(),
			oPromiseGetValueListAnnotationLazy = new Promise(function (resolve) {
				resolve({});
			});

		oValueListProvider._oMetadataAnalyser = new MetadataAnalyser();
		oValueListProvider.oControl = new Input();
		oValueListProvider._sFullyQualifiedFieldName = sFullyQualifiedFieldName;
		sinon.stub(oValueListProvider._oMetadataAnalyser, "getPropertyContextByPath").returns({});
		sinon.stub(oValueListProvider._oMetadataAnalyser, "_getODataValueListRelevantQualifiers").returns(["sRelevantQualifier"]);
		oValueListProvider._oMetadataAnalyser.getValueListAnnotationLazy = function() {
			return oPromiseGetValueListAnnotationLazy;
		};
		fnGetValueListAnnotationLazySpy = sinon.spy(oValueListProvider._oMetadataAnalyser, "getValueListAnnotationLazy");
		sinon.stub(oValueListProvider.oControl, "getBindingContext" ).returns({
			getPath: function() {
				return sSomeBindingContextPath;
			}
		});
		sinon.stub(oValueListProvider.oControl, "getModel" ).returns({
			getContext: function() {
				return oBindingContext;
			}
		});

		// Act
		bResult1 = oValueListProvider._primaryValueListAnnotationChanged();
		oPromiseGetValueListAnnotationLazy.then(function () {
			// Assert
			assert.equal(bResult1, true, "_primaryValueListAnnotationChanged should return true if the primary value list annotation is not relevant any more" );
			assert.equal(fnGetValueListAnnotationLazySpy.calledWith(sFullyQualifiedFieldName, sSomeBindingContextPath), true, "MetadataAnalyzrt.getValueListAnnotationLazy has been called with correct arguments");
		 });

		  // Arrange
		  oValueListProvider.oPrimaryValueListAnnotation.qualifier = "sRelevantQualifier";

		  // Act
		  bResult2 = oValueListProvider._primaryValueListAnnotationChanged();

		  oPromiseGetValueListAnnotationLazy.then(function () {
			  // Assert
			  assert.equal(bResult2, false, "_primaryValueListAnnotationChanged should return true if the primary value list annotation is still relevant");

			 // Cleanup
			 oValueListProvider.oControl.destroy();
			 oValueListProvider._oMetadataAnalyser.destroy();
			 done();
		   });
	});

	QUnit.test("_primaryValueListAnnotationChanged should rebind the suggestions if relevant qualifiers are changed", function (assert) {
		// Arrange
		var done = assert.async();

		this.oValueListProvider.oControl = new Input();
		var oRebindInnerControlsSpy = this.spy(this.oValueListProvider, "_rebindInnerControlSuggestions");
		var oCreateDropDownTemplateSpy = this.spy(this.oValueListProvider, "_createDropDownTemplate");
		var oBindAggregationSpy = this.spy(this.oValueListProvider.oControl, "bindAggregation");
		var oGetBindingContextStub = this.stub(this.oValueListProvider.oControl, "getBindingContext").returns({
			getPath: this.stub().returns("fakePath")
		});
		var oPromiseGetValueListAnnotationLazy = new Promise(function (resolve) {
			resolve({});
		});
		this.oValueListProvider._oMetadataAnalyser = {
			getPropertyContextByPath: this.stub().returns("fakePropertyName"),
			_getODataValueListRelevantQualifiers: this.stub().returns(["qualifier1", "qualifier2"]),
			getValueListAnnotationLazy: this.stub().returns(oPromiseGetValueListAnnotationLazy)
		};

		// Act
		this.oValueListProvider._primaryValueListAnnotationChanged();

		oPromiseGetValueListAnnotationLazy.then(function () {
			// Assert
			assert.equal(oRebindInnerControlsSpy.callCount, 1, "_rebindInnerControlSuggestions is called once");
			assert.equal(oCreateDropDownTemplateSpy.callCount, 1, "_createDropDownTemplate is called once");
			assert.equal(oBindAggregationSpy.callCount, 1, "bindAggregation is called once");

			// Cleanup
			oGetBindingContextStub.restore();
			oRebindInnerControlsSpy.restore();
			oCreateDropDownTemplateSpy.restore();
			oBindAggregationSpy.restore();
			done();
		});
	});

	QUnit.test("Shall create sorter for id based DDLBs", function(assert) {
		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.idOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(this.oValueListProvider._oSorter,  "Sorter is created");
		assert.strictEqual(this.oValueListProvider._oSorter.sPath,this.oValueListProvider.sKey, "Sorter key property is correct");

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.descriptionAndId;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(this.oValueListProvider._oSorter,  "Sorter is created");
		assert.strictEqual(this.oValueListProvider._oSorter.sPath,this.oValueListProvider.sKey, "Sorter key property is correct");

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.idAndDescription;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(this.oValueListProvider._oSorter,  "Sorter is created");
		assert.strictEqual(this.oValueListProvider._oSorter.sPath,this.oValueListProvider.sKey, "Sorter key property is correct");

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.descriptionOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(this.oValueListProvider._oSorter,  "Sorter is created");
		assert.strictEqual(this.oValueListProvider._oSorter.sPath,this.oValueListProvider.sDescription, "Sorter by description property is correct");
	});

	QUnit.test("Shall not create sorter for id based DDLBs but one for Description", function(assert) {
		this.oValueListProvider.oPrimaryValueListAnnotation.valueListFields[0].sortable = false;
		this.oValueListProvider.oPrimaryValueListAnnotation.valueListFields[1].sortable = true;

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.idOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(!this.oValueListProvider._oSorter);

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.descriptionOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(this.oValueListProvider._oSorter);
		assert.strictEqual(this.oValueListProvider._oSorter.sPath,this.oValueListProvider.sDescription);
	});

	QUnit.test("Shall not create sorter for id nor description based DDLBs", function(assert) {
		this.oValueListProvider.oPrimaryValueListAnnotation.valueListFields[0].sortable = false;
		this.oValueListProvider.oPrimaryValueListAnnotation.valueListFields[1].sortable = false;

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.idOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(!this.oValueListProvider._oSorter);

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.descriptionOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(!this.oValueListProvider._oSorter);
	});

	QUnit.test("Shall create sorter for PresentationVariant Annotation SortOrder", function(assert) {
		this.oValueListProvider._oPresentationVariant = {
			"annotation": {
				"SortOrder":[{
				"Descending": {"Bool": true},
				"Property": {"PropertyPath": "COUNTRY"},
				"RecordType": "com.sap.vocabularies.Common.v1.SortOrderType"
			}]
			},
			"sPresentationVariantSortPath": "COUNTRY",
			"sortOrderFields": [{
				"descending": true,
				"name": "COUNTRY"
			}],
			"_bIsPresentationVariantSortOrderPropertySortable": true,
			"_bIsPresentationVariantSortPathInVHDEntityType": true
		};
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(this.oValueListProvider._oSorter, "Sorter is created");
		assert.strictEqual(this.oValueListProvider._oSorter.sPath,"COUNTRY", "Sorter path is correct");
		assert.strictEqual(this.oValueListProvider._oSorter.bDescending, true, "Sorter descending property is correct");

	});

	QUnit.test("it should destroy the item template", function(assert) {

		// arrange
		this.oValueListProvider._createDropDownTemplate();
		var oTemplateDestroySpy = sinon.spy(this.oValueListProvider._oTemplate, "destroy");

		// act
		this.oValueListProvider.destroy();

		// assert
		assert.strictEqual(oTemplateDestroySpy.callCount, 1);
		assert.strictEqual(this.oValueListProvider._oTemplate, null);
	});

	QUnit.module("sap.ui.comp.providers.ValueListProvider (typeAhead)", {
		beforeEach: function() {
			this.oAnnotation = {valueListEntitySetName:"Chuck",keyField:"TheKey",descriptionField:"Desc",keys:["TheKey"],valueListFields:[{name:"TheKey"},{name:"Desc"}]};
			this.oModel = sinon.createStubInstance(ODataModel);
			this.oValueListProvider = new ValueListProvider({
				control: sinon.createStubInstance(MultiInput),
				aggregation:"suggestionItems",
				annotation:this.oAnnotation,
				model:this.oModel,
				typeAheadEnabled:true,
				displayBehaviour: DisplayBehaviour.idAndDescription
			});
		},
		afterEach: function() {
			this.oValueListProvider.destroy();
			this.oValueListProvider = null;
			delete this.oAnnotation;
			this.oModel.destroy();
			this.oModel = null;
		}
	});

	QUnit.test("Shall call attachSuggest once on initialise if type Ahead is enabled", function(assert) {
		assert.strictEqual(this.oValueListProvider.oControl.attachSuggest.calledOnce,true);
	});

	QUnit.test("suggest shall trigger _fetchData", function(assert) {
		var fSuggest = null,oEvent = {getParameter:sinon.stub(), getSource: sinon.stub()}, sInput = "test";
		oEvent.getParameter.returns(sInput);
		oEvent.getSource.returns(this.oValueListProvider.oControl);
		assert.strictEqual(this.oValueListProvider.oControl.attachSuggest.calledOnce,true);
		sinon.spy(this.oValueListProvider,"_fetchData");
		fSuggest = this.oValueListProvider.oControl.attachSuggest.args[0][0];
		//Trigger Suggest
		fSuggest(oEvent);

		assert.strictEqual(this.oValueListProvider._fetchData.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._fetchData.calledWith(sInput),true);
	});

	QUnit.test("_fetchData shall use the Search Text and Search-focus if basic search and type ahead is enabled", function(assert) {
		this.oValueListProvider.bSupportBasicSearch = true;
		this.oValueListProvider._fetchData("SomeSearchText");

		var args = this.oValueListProvider.oControl.bindAggregation.args[0];
		var custom = args[1].parameters["custom"];
		assert.strictEqual(custom["search"],"SomeSearchText");
		assert.strictEqual(custom["search-focus"],"TheKey");
	});

	QUnit.test("Search Text shall be converted to UpperCase according to displayFormat", function(assert) {
		this.oValueListProvider.bSupportBasicSearch = true;
		this.oValueListProvider.sDisplayFormat = "UpperCase";
		this.oValueListProvider._fetchData("UpperCase");
		var args = this.oValueListProvider.oControl.bindAggregation.args[0];
		var custom = args[1].parameters["custom"];
		assert.strictEqual(custom["search"],"UPPERCASE");
		assert.strictEqual(custom["search-focus"],"TheKey");
	});

	QUnit.test("Search Text with maxLength", function(assert) {
		sinon.spy(this.oValueListProvider,"_truncateSearchText");

		this.oValueListProvider.bSupportBasicSearch = false;
		this.oValueListProvider._fieldViewMetadata = {};
		this.oValueListProvider._fieldViewMetadata.maxLength = "1";
		this.oValueListProvider._fetchData("123");

		assert.strictEqual(this.oValueListProvider._truncateSearchText.calledOnce,true, "_truncateSearchText called once");
		assert.strictEqual(this.oValueListProvider._truncateSearchText.returned("1"),true, "_truncateSearchText returned truncated value '1'");
	});

	QUnit.test("MultiInput - addValidator shall trigger select and create token via asyncCallback with the suggestionRow", function(assert) {
		var fValidate = null, fAsyncCallback = sinon.stub(),
			oMockRow = {TheKey:"key",Desc:"description"},
			getObjectStub = sinon.stub().returns(oMockRow),
			oSuggestionRow = {
				getBindingContext: function () {
					return {
						getObject: getObjectStub
					};
				}
			},
			sInput = "foo";

		assert.strictEqual(this.oValueListProvider.oControl.addValidator.calledOnce,true);
		fValidate  = this.oValueListProvider.oControl.addValidator.args[0][0];
		sinon.spy(this.oValueListProvider,"_calculateAndSetFilterOutputData");
		assert.strictEqual(getObjectStub.calledOnce,false, "data of the row is not retrieved initially");

		//Trigger the validation
		fValidate({suggestionObject: oSuggestionRow, text: sInput, asyncCallback: fAsyncCallback});

		assert.strictEqual(getObjectStub.calledOnce,true, "data of the row is retrieved");
		assert.strictEqual(this.oValueListProvider.oODataModel.read.calledOnce,false, "no oData request is made");
		assert.strictEqual(this.oValueListProvider._calculateAndSetFilterOutputData.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._calculateAndSetFilterOutputData.calledWith([oMockRow]),true);
		assert.strictEqual(fAsyncCallback.calledOnce,true);
		//assert.strictEqual(this.oValueListProvider.oControl.setValue.calledOnce,true);
		//assert.strictEqual(this.oValueListProvider.oControl.setValue.calledWith(""),true);
	});

	QUnit.test("MultiInput - addValidator shall trigger backend validation and create token (via asyncCallback) with typed in text if no suggestionRow is present", function(assert) {
		var fValidate = null, fAsyncCallback = sinon.stub(), oSuggestionRow = null, sInput = "foo";
		var oMockRow = {TheKey:"key",Desc:"description"};
		var oBackendRequest = null;
		assert.strictEqual(this.oValueListProvider.oControl.addValidator.calledOnce,true);
		fValidate  = this.oValueListProvider.oControl.addValidator.args[0][0];
		sinon.stub(this.oValueListProvider,"_calculateAndSetFilterOutputData");
		sinon.stub(this.oValueListProvider,"_calculateFilterInputData");
		//Trigger the validation
		fValidate({suggestionObject: oSuggestionRow, text: sInput, asyncCallback: fAsyncCallback});
		assert.strictEqual(this.oValueListProvider.oODataModel.getProperty.calledOnce,false);
		assert.strictEqual(this.oValueListProvider.oODataModel.read.calledOnce,true);
		assert.strictEqual(this.oValueListProvider.oControl.__bValidatingToken,true);

		oBackendRequest = this.oValueListProvider.oODataModel.read.args[0][1];

		//Tigger success call
		oBackendRequest.success({results:[oMockRow]},{});

		assert.strictEqual(this.oValueListProvider._calculateAndSetFilterOutputData.calledWith([oMockRow]),true);
		assert.strictEqual(fAsyncCallback.calledOnce,true);
		//assert.strictEqual(this.oValueListProvider.oControl.setValue.calledOnce,true);
		//assert.strictEqual(this.oValueListProvider.oControl.setValue.calledWith(""),true);
		assert.strictEqual(this.oValueListProvider.oControl.__bValidatingToken,undefined);
	});

	QUnit.module("sap.ui.comp.providers.ValueListProvider (typeAhead - single Input)", {
		beforeEach: function() {
			this.oAnnotation = {valueListEntitySetName:"Chuck",keyField:"TheKey",descriptionField:"Desc",keys:["TheKey"],valueListFields:[{name:"TheKey"},{name:"Desc"}]};
			this.oModel = sinon.createStubInstance(ODataModel);
			this.oValueListProvider = new ValueListProvider({control: sinon.createStubInstance(Input), aggregation:"suggestionItems", annotation:this.oAnnotation, model:this.oModel, typeAheadEnabled:true});
		},
		afterEach: function() {
			this.oValueListProvider = null;
		}
	});

	QUnit.test("Input - attachSuggestionItemSelected shall trigger select and set Key as value of Input", function(assert) {
		var oMockRow = {TheKey:"key",Desc:"description"};
		var getObjectStub = sinon.stub().returns(oMockRow);
		var getBindingContextStub = sinon.stub().returns({
			getObject: getObjectStub
		});
		var oSelectedRow = { getBindingContext: getBindingContextStub };
		var fSuggestionItemSelected = null, oEvent = { getParameter:sinon.stub().returns(oSelectedRow) };
		this.oValueListProvider.sContext = "";


		assert.strictEqual(this.oValueListProvider.oControl.attachSuggestionItemSelected.calledOnce,true);
		fSuggestionItemSelected  = this.oValueListProvider.oControl.attachSuggestionItemSelected.args[0][0];
		sinon.spy(this.oValueListProvider,"_calculateAndSetFilterOutputData");

		//Trigger the selection
		fSuggestionItemSelected.call(this.oValueListProvider, oEvent);

		assert.strictEqual(getBindingContextStub.calledOnce,true);
		assert.strictEqual(getObjectStub.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._calculateAndSetFilterOutputData.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._calculateAndSetFilterOutputData.calledWith([oMockRow]),true);
		assert.strictEqual(this.oValueListProvider.oControl.setValue.calledOnce,true);
		assert.strictEqual(this.oValueListProvider.oControl.setValue.calledWith("key"),true);
		assert.strictEqual(this.oValueListProvider.oControl.fireChange.calledOnce,true);
		assert.strictEqual(this.oValueListProvider.oControl.fireChange.calledWith({value:"key", validated: true}),true);
	});

	// BCP 1770487494
	QUnit.test("it should unbind the suggestionItems aggregation when the provided control is removed from the control tree", function(assert) {

		// arrange
		var oSmartField = new SmartField();
		var oInput = new Input();
		var oText = new Text();
		var sAggregation = "suggestionItems";
		oSmartField.setContent(oInput);

		// system under test
		this.oValueListProvider = new ValueListProvider({
			control: oInput,
			aggregation: sAggregation,
			annotation: this.oAnnotation,
			model: this.oModel,
			typeAheadEnabled: true
		});

		// act: simulate an user interaction with the text input control, the ValueListProvider class bind the
		// aggregation on the suggest event handler of the text input control
		oInput.fireSuggest({
			suggestValue: "foo"
		});

		// change the SmartField's content aggregation (this usually occurs when the inner controls are toggled)
		oSmartField.setContent(oText);

		// assert
		assert.strictEqual(oInput.isBound(sAggregation), false);

		// cleanup
		oSmartField.destroy();
		oInput.destroy();
		oText.destroy();
	});

	QUnit.test("it should not unbind the suggestionItems aggregation", function(assert) {

		// arrange
		var oSmartField = new SmartField();
		var oInput = new Input();
		var sAggregation = "suggestionItems";
		oSmartField.setContent(oInput);

		// system under test
		this.oValueListProvider = new ValueListProvider({
			control: oInput,
			aggregation: sAggregation,
			annotation: this.oAnnotation,
			model: this.oModel,
			typeAheadEnabled: true
		});

		// act: simulate an user interaction with the text input control, the ValueListProvider class bind the
		// aggregation on the suggest event handler of the text input control
		oInput.fireSuggest({
			suggestValue: "foo"
		});

		// change the SmartField's content aggregation (this usually occurs when the inner controls are toggled)
		oSmartField.setContent(oInput);

		// assert
		assert.strictEqual(oInput.isBound(sAggregation), true);

		// cleanup
		oSmartField.destroy();
		oInput.destroy();
	});

	QUnit.module("Recommendations", {
		beforeEach: function () {
			this.oMockInput  = new Input();
			this.oVLP = new ValueListProvider({
				aggregation: "suggestionRows",
				control: this.oMockInput
			});
		},
		afterEach: function () {
			this.oVLP.destroy();
			this.oMockInput.destroy();
		}
	});

	QUnit.test("_addSuggestionsToGroup should loop through all passed items in the array and add to them additional 'order' field with value passed as second argument", function (assert) {
		// Arrange
		var ORDER_NUMBER_FOR_SUGGESTIONS = 30,
			ORDER_NUMBER_FOR_RECENTLY_USED = 20,
			ORDER_NUMBER_FOR_RECOMMENDATIONS = 10,
			SUGGESTION_GROUP_ORDER_NAME = HistoryConstants.getSuggestionsGroupPropertyName(),
			aSuggestions = [{ name: "First Suggestion" }, { name: "Second Suggestion" }];

		// Act
		var oResult = this.oVLP._addSuggestionsToGroup(aSuggestions, ORDER_NUMBER_FOR_SUGGESTIONS);

		// Assert
		assert.equal(oResult[0][SUGGESTION_GROUP_ORDER_NAME], ORDER_NUMBER_FOR_SUGGESTIONS, "an order field with value 30 is added to the first suggestion");
		assert.equal(oResult[1][SUGGESTION_GROUP_ORDER_NAME], ORDER_NUMBER_FOR_SUGGESTIONS, "an order field with value 30 is added to the second suggestion");

		// Act
		var oResult = this.oVLP._addSuggestionsToGroup(aSuggestions, ORDER_NUMBER_FOR_RECENTLY_USED);

		// Assert
		assert.equal(oResult[0][SUGGESTION_GROUP_ORDER_NAME], ORDER_NUMBER_FOR_RECENTLY_USED, "an order field with value 20 is added to the first suggestion");
		assert.equal(oResult[1][SUGGESTION_GROUP_ORDER_NAME], ORDER_NUMBER_FOR_RECENTLY_USED, "an order field with value 20 is added to the second suggestion");

		// Act
		var oResult = this.oVLP._addSuggestionsToGroup(aSuggestions, ORDER_NUMBER_FOR_RECOMMENDATIONS);

		// Assert
		assert.equal(oResult[0][SUGGESTION_GROUP_ORDER_NAME], ORDER_NUMBER_FOR_RECOMMENDATIONS, "an order field with value 10 is added to the first suggestion");
		assert.equal(oResult[1][SUGGESTION_GROUP_ORDER_NAME], ORDER_NUMBER_FOR_RECOMMENDATIONS, "an order field with value 10 is added to the second suggestion");

		assert.notOk(aSuggestions[0][SUGGESTION_GROUP_ORDER_NAME], "original first suggestion should not be modified");
		assert.notOk(aSuggestions[1][SUGGESTION_GROUP_ORDER_NAME], "original second suggestion should not be modified");
	});

	QUnit.test("_groupHeaderFactory should return correct group item for fixed and not fixed values scenario", function (assert) {
		// Arrange
		this.oVLP.oControl = new MultiComboBox();

		// Act & Assert
		var oControl = this.oVLP._groupHeaderFactory({});
		assert.equal(oControl.isA("sap.ui.core.SeparatorItem"), true, "group headers should be SeparatorItem in case of multicombobox scenario");

		// Arrange
		this.oVLP.oControl = new ComboBox();

		// Act & Assert
		var oControl = this.oVLP._groupHeaderFactory({});
		assert.equal(oControl.isA("sap.ui.core.SeparatorItem"), true, "group headers should be SeparatorItem in case of combobox scenario");

		// Arrange
		this.oVLP.oControl = new MultiInput();

		// Act & Assert
		var oControl = this.oVLP._groupHeaderFactory({});
		assert.equal(oControl.isA("sap.m.GroupHeaderListItem"), true, "group headers should be GroupHeaderListItem in case of multiinput scenario");

		// Arrange
		this.oVLP.oControl = new Input();

		// Act & Assert
		var oControl = this.oVLP._groupHeaderFactory({});
		assert.equal(oControl.isA("sap.m.GroupHeaderListItem"), true, "group headers should be GroupHeaderListItem in case of input scenario");
	});

	QUnit.test("_groupHeaderFactory should Separator Item with not empty key", function (assert) {
		// Arrange
		var sExpected = HistoryConstants.getHistoryPrefix() + 20 + ".key";
		this.oVLP.oControl = new MultiComboBox();

		// Act & Assert
		var oControl = this.oVLP._groupHeaderFactory({ key: 20 });
		assert.equal(oControl.getKey(), sExpected, "group headers should  have key set and equal to: " + sExpected);

		// Arrange
		this.oVLP.oControl = new ComboBox();

		// Act & Assert
		var oControl = this.oVLP._groupHeaderFactory({ key: 20 });
		assert.equal(oControl.getKey(), sExpected, "group headers should  have key set and equal to: " + sExpected);
	});

	QUnit.test("_getGroupHeaderTitle should return right titles for different groups", function (assert) {
		// Arrange
		var ORDER_NUMBER_FOR_RECOMMENDATIONS = 10,
			ORDER_NUMBER_FOR_RECENTLY_USED = 20,
			ORDER_NUMBER_FOR_SUGGESTIONS = 30,
			sOthersTitle = "Others",
			sRecentlyUsedTitle = "Recently Used",
			sRecommendationsTitle = "Recommendations",
			oRBGetTextStub = this.stub();
		oRBGetTextStub.withArgs("VALUELIST_OTHERS_TITLE").returns(sOthersTitle);
		oRBGetTextStub.withArgs("VALUELIST_RECENTLY_USED_TITLE").returns(sRecentlyUsedTitle);
		oRBGetTextStub.withArgs("VALUELIST_RECOMMENDATIONS_TITLE").returns(sRecommendationsTitle);
		this.oVLP._oResourceBundle = { getText: oRBGetTextStub };

		// Act & Assert
		var sResult = this.oVLP._getGroupHeaderTitle(ORDER_NUMBER_FOR_RECOMMENDATIONS);
		assert.equal(sResult, sRecommendationsTitle, "Group Header title for recommendations should be equal to " + sRecommendationsTitle);

		// Act & Assert
		var sResult = this.oVLP._getGroupHeaderTitle(ORDER_NUMBER_FOR_RECENTLY_USED);
		assert.equal(sResult, sRecentlyUsedTitle, "Group Header title for recently used should be equal to " + sRecentlyUsedTitle);

		// Act & Assert
		var sResult = this.oVLP._getGroupHeaderTitle(ORDER_NUMBER_FOR_SUGGESTIONS);
		assert.equal(sResult, sOthersTitle, "Group Header title for suggestions should be equal to " + sOthersTitle);
	});

	QUnit.test("_getGroupHeaderSorter should return a sap.ui.model.Sorter with path equal to 'order' and group function that extract 'order' property from the context", function (assert) {
		// Arrange
		var ORDER_NUMBER_FOR_RECOMMENDATIONS = 10,
			sOrderPropertyPath = HistoryConstants.getSuggestionsGroupPropertyName(),
			oContextStub = {
				getProperty: this.stub().returns(ORDER_NUMBER_FOR_RECOMMENDATIONS)
			};

		// Act
		var oSorter = this.oVLP._getGroupHeaderSorter();

		// Assert
		assert.equal(oSorter.getMetadata().getName(), "sap.ui.model.Sorter", "sorter should be sap.ui.model.Sorter");
		assert.equal(oSorter.sPath, sOrderPropertyPath, "sorter property name should be " + HistoryConstants.getSuggestionsGroupPropertyName());
		assert.equal(oSorter.fnGroup(oContextStub), ORDER_NUMBER_FOR_RECOMMENDATIONS, "group function should extract the order property from the context");
	});

	QUnit.test("_getDistinctSuggestions should return only unique entries from an array (uniqueness determined by _aHighImportanceCols or _aCols)", function (assert) {
		// Arrange
		var oItem1 = { firstName: "firstName1", lastName: "lastName1", others: "otherName1"  },
			oItem2 = { firstName: "firstName1", lastName: "lastName2" },
			oItem3 = { firstName: "firstName2", lastName: "lastName1" },
			oItem4 = { firstName: "firstName1", lastName: "lastName1" }, // same as oItem1 (based on _aKeys)
			aExpected = [oItem1, oItem2, oItem3],
			aTestArray = [oItem1, oItem2, oItem1, oItem2, oItem3, oItem3, oItem3, oItem4];

		this.oVLP._aCols = [{ template: "firstName" }, { template: "lastName" }]; // override keys that matter

		// Act
		var aResult = this.oVLP._getDistinctSuggestions(aTestArray);

		// Assert
		assert.deepEqual(aResult, aExpected, "returned array should have only distinct values");
	});

	QUnit.test("_getDistinctSuggestions should be able to detect uniqueness if textarrangement is used for the key column", function (assert) {
		// Arrange
		var oItem1 = { firstName: "firstName1", lastName: "lastName1", others: "otherName1"  },
			oItem2 = { firstName: "firstName1", lastName: "lastName2" },
			oItem3 = { firstName: "firstName2", lastName: "lastName1" },
			oItem4 = { firstName: "firstName1", lastName: "lastName1" }, // same as oItem1 (based on _aKeys)
			aExpected = [oItem1, oItem2, oItem3],
			aTestArray = [oItem1, oItem2, oItem1, oItem2, oItem3, oItem3, oItem3, oItem4];

		this.oVLP._aCols = [{ template: ["firstName", "lastName"]}]; // override keys that matter

		// Act
		var aResult = this.oVLP._getDistinctSuggestions(aTestArray);

		// Assert
		assert.deepEqual(aResult, aExpected, "returned array should have only distinct values");
	});

	QUnit.test("_getDistinctSuggestions should add __sapui5_forced_visible_suggestion set to true if recently used is duplicated with others", function (assert) {
		var ORDER_NUMBER_FOR_RECENTLY_USED = 20,
			ORDER_NUMBER_FOR_SUGGESTIONS = 30,
			oItem1 = { firstName: "firstName1", lastName: "lastName1"  }, // same
			oItem2 = { firstName: "firstName1", lastName: "lastName1" }, // same
			oItem3 = { firstName: "firstName3", lastName: "lastName3" },
			aTestArray = [oItem1, oItem2, oItem3, oItem1, oItem2, oItem3];

		oItem1[HistoryConstants.getSuggestionsGroupPropertyName()] = ORDER_NUMBER_FOR_RECENTLY_USED;
		oItem2[HistoryConstants.getSuggestionsGroupPropertyName()] = ORDER_NUMBER_FOR_SUGGESTIONS;
		oItem3[HistoryConstants.getSuggestionsGroupPropertyName()] = ORDER_NUMBER_FOR_SUGGESTIONS;

		var aExpected = [Object.assign({}, oItem1), Object.assign({}, oItem3)];
		aExpected[0][HistoryConstants.getForcedVisiblePropertyName()] = true;


		this.oVLP._aCols = [{ template: "firstName" }, { template: "lastName" }]; // override keys that matter

		// Act
		var aResult = this.oVLP._getDistinctSuggestions(aTestArray);

		// Assert
		assert.deepEqual(aResult, aExpected, "returned array should have only distinct values");
		assert.ok(aResult[0][HistoryConstants.getForcedVisiblePropertyName()], HistoryConstants.getForcedVisiblePropertyName() + " should be set to true for the first item");
	});

	QUnit.test("_resolveRecommendationListAnnotationData should add visible columns to the recommendations cols and select arrays", function (assert) {
		// Arrange
		var oVisibleField = { name: "Visible Field", visible: true, type: "Edm.String" },
			oInvisibleField = { name: "Invisible Field", visible: false, type: "Edm.String" },
			oRecommendationAnnotation = {
				fieldsToDisplay: [oVisibleField, oInvisibleField]
			};
		// Act
		this.oVLP._resolveRecommendationListAnnotationData(oRecommendationAnnotation);

		// Assert
		assert.equal(this.oVLP._aRecommendationCols.length, 1, "one column config should be added");
		assert.equal(this.oVLP.aRecommendationSelect.length, 1, "one select field should be added");
		assert.equal(this.oVLP._aRecommendationCols[0].template, oVisibleField.name, "column template should be equal to the field name");
		assert.equal(this.oVLP.aRecommendationSelect[0], oVisibleField.name, "select should be equal to the field name");
	});

	QUnit.test("_resolveRecommendationListAnnotationData should add rankField to the _aHighImportanceCols", function (assert) {

		// Arrange
		var oVLP = this.oVLP,
			oVisibleField = { name: "Visible Field", visible: true, type: "Edm.String"},
			oSecondVisibleField = { name: "Second Visible Field", visible: true, type: "Edm.String"},
			oRankField = { name: "Rank Field", visible: true, type: "Edm.String"},
			oRecommendationAnnotation = {
				fieldsToDisplay: [oVisibleField, oSecondVisibleField, oRankField]
			},
			oHighImportanceField = oVLP._getColumnConfigFromField(oVisibleField);

		oVLP._oRecommendationListAnnotation = {
			rankField: [oRankField]
		};
		oVLP._aHighImportanceCols = [oHighImportanceField];

		// Act
		oVLP._resolveRecommendationListAnnotationData(oRecommendationAnnotation);

		// Assert
		assert.equal(oVLP._aHighImportanceCols.length, 2, "one column config should be added");
		assert.equal(oVLP._aHighImportanceCols[oVLP._aHighImportanceCols.length - 1].template, oRankField.name, "column template should be equal to the field name");
	});

	QUnit.test("_shouldHaveRecommendations should return true if RecommendationList annotation is set", function(assert) {
		// Arrange
		var oIsRecommendationListStub = this.stub(MetadataAnalyser, "isRecommendationList");

		// Act & Arrange
		oIsRecommendationListStub.returns(true);
		assert.ok(this.oVLP._shouldHaveRecommendations(), "should return true");

		// Act & Arrange
		oIsRecommendationListStub.returns(false);
		assert.notOk(this.oVLP._shouldHaveRecommendations(), "should return false");

		// Cleanup
		oIsRecommendationListStub.restore();
	});

	QUnit.test("_getRecommendationListAnnotation should return and enrich the RecommendationList Annotation", function (assert) {
		// Arrange
		var sFieldName = "EPM_REF_APPS_PROD_MAN_SRV.Product/CurrencyCode",
			oAnnotation = { name: "Annotation" },
			oEnrichedAnnotation = { name: "EnrichedAnnotation" },
				oMetadataAnalyser = {
					_getRecommendationListAnnotation: this.stub().returns(oAnnotation),
					_enrichRecommendationListAnnotation: this.stub().returns(oEnrichedAnnotation)
				};
		this.oVLP._sFullyQualifiedFieldName = sFieldName;
		this.oVLP._oMetadataAnalyser = oMetadataAnalyser;

		// Act
		var oResult = this.oVLP._getRecommendationListAnnotation();

		// Assert
		assert.equal(oResult, oEnrichedAnnotation, "returned value should be equal the enriched annotation");
		assert.equal(oMetadataAnalyser._getRecommendationListAnnotation.callCount, 1, "_getRecommendationListAnnotation should be called once");
		assert.equal(oMetadataAnalyser._enrichRecommendationListAnnotation.callCount, 1, "_enrichRecommendationListAnnotation should be called once");
		assert.equal(oMetadataAnalyser._getRecommendationListAnnotation.args[0][0], sFieldName, "_getRecommendationListAnnotation should be called with " + sFieldName);
		assert.equal(oMetadataAnalyser._enrichRecommendationListAnnotation.args[0][0], oAnnotation, "_enrichRecommendationListAnnotation should be called with the annotation");
	});

	QUnit.test("_isNotRecommendationItemSelected should return true if selected item is from recommendations group and false otherwise", function (assert) {
		// Arrange
		var oFindSuggestionItemGroupStub = this.stub(this.oVLP, "_findSuggestionItemGroup");

		// Act & Assert
		oFindSuggestionItemGroupStub.returns(10); // 10 - Recommendations Group
		var bResult = this.oVLP._isNotRecommendationItemSelected();
		assert.notOk(bResult, "item that is selected is from recommendation group");

		// Act & Assert
		oFindSuggestionItemGroupStub.returns(30); // 30 - Others Group
		var bResult = this.oVLP._isNotRecommendationItemSelected();
		assert.ok(bResult, "item that is selected is not from recommendation group");

		// Cleanup
		oFindSuggestionItemGroupStub.restore();
	});

	QUnit.test("_getSuggestionsModelName 'list' in all cases", function (assert) {
		// Arrange
		var oShouldHaveRecommendationsStub = this.stub(this.oVLP, "_shouldHaveRecommendations");

		// Act & Assert
		oShouldHaveRecommendationsStub.returns(true);
		var sResult = this.oVLP._getSuggestionsModelName();
		assert.equal(sResult, "list", "model path should be equal to 'list'");

		// Act & Assert
		oShouldHaveRecommendationsStub.returns(true);
		var sResult = this.oVLP._getSuggestionsModelName();
		assert.equal(sResult, "list", "model path should be equal to 'list'");

		// Cleanup
		oShouldHaveRecommendationsStub.restore();
	});

	QUnit.test("_resolveSuggestionBindingPath should add the model path if any", function (assert) {
		// Arrange
		var sPath = "CurrencyCode",
			oGetSuggestionsModelName = this.stub(this.oVLP, "_getSuggestionsModelName");

		// Act & Assert
		oGetSuggestionsModelName.returns("list");
		var sResult = this.oVLP._resolveSuggestionBindingPath(sPath);
		assert.equal(sResult, "list>" + sPath);

		// Act & Assert
		oGetSuggestionsModelName.returns();
		var sResult = this.oVLP._resolveSuggestionBindingPath(sPath);
		assert.equal(sResult, sPath);

		// Cleanup
		oGetSuggestionsModelName.restore();
	});

	QUnit.module("History Values", {
		beforeEach: function () {
			this.oMockInput  = new Input();
			this.oVLP = new ValueListProvider({
				aggregation: "suggestionRows",
				control: this.oMockInput,
				fieldHistoryEnabled: true
			});
            sinon.stub(this.oVLP, "_getUShellContainer").returns({});
		},
		afterEach: function () {
			this.oVLP.destroy();
			this.oMockInput.destroy();
		}
	});

	QUnit.test("_setupHistoryValues should setup the ValueList for history values", function (assert) {
		// Arrange
		var aFieldData = ["history1", "history2"],
			oGetFieldDataStub = {
				then: function (fnCallback) {
					fnCallback(aFieldData);
				}
			},
			oGetHistoryEnabledStub = {
				then: function (fnCallback) {
					fnCallback(true);
				}
			},
			oHistoryValuesProviderStub = {
				attachEvent: this.spy(),
				attachChangeListener: this.spy(),
				getFieldData: this.stub().returns(oGetFieldDataStub),
				getHistoryEnabled: this.stub().returns(oGetHistoryEnabledStub),
				destroy: this.stub()
			},
			oShouldHaveHistoryStub = this.stub(this.oVLP, "_shouldHaveHistory").returns(true),
			oCreateHistoryValuesProviderSpy = this.stub(this.oVLP, "_createHistoryValuesProvider").returns(oHistoryValuesProviderStub),
			oUpdateModelHistoryData = this.stub(this.oVLP, "_updateModelHistoryData"),
			oCreateHistoryOptOutProvider = this.stub(this.oVLP, "_createHistoryOptOutProvider");

		this.oVLP._sFullyQualifiedFieldName = "fieldName";

		// Act
		this.oVLP._setupHistoryValues();

		// Assert
		var aUpdateModelArgs = oUpdateModelHistoryData.getCall(0).args[0];
		assert.equal(oCreateHistoryValuesProviderSpy.callCount, 1, "_createHistoryValuesProvider is called once");
		assert.equal(oHistoryValuesProviderStub.attachEvent.callCount, 1, "attachEvent of HistoryValuesProvider is called once");
		assert.equal(oHistoryValuesProviderStub.attachChangeListener.callCount, 1, "attachChangeListener of HistoryValuesProvider is called once");
		assert.equal(oUpdateModelHistoryData.callCount, 1, "_updateModelHistoryData is called once");
		assert.equal(oCreateHistoryOptOutProvider.callCount, 1, "_createHistoryOptOutProvider is called once");
		assert.deepEqual(aUpdateModelArgs, aFieldData, "updateModelHistoryData is called with right parameters");

		// Cleanup
		oShouldHaveHistoryStub.restore();
		oCreateHistoryValuesProviderSpy.restore();
		oUpdateModelHistoryData.restore();
		oCreateHistoryOptOutProvider.restore();
	});

	QUnit.test("_updateModelHistoryData adds history data to the JSONModel", function (assert) {
		// Arrange
		var SUGGESTION_GROUP_ORDER_NAME = HistoryConstants.getSuggestionsGroupPropertyName();
		var oAddSuggestionsToGroupSpy = this.spy(this.oVLP, "_addSuggestionsToGroup");
		var oShouldHaveRecommendations = this.stub(this.oVLP, "_shouldHaveRecommendations").returns(false);
		var oShouldHaveHistory = this.stub(this.oVLP, "_shouldHaveHistory").returns(true);
		this.oVLP._aCols = [{ template: "key" }, { template: "text" }];
		var aHistoryData = [{
			key: "item1",
			text: "History Item 1"
		}, {
			key: "item2",
			text: "History Item 2"
		}],
		aResult = [{
			key: "item1",
			text: "History Item 1"
		}, {
			key: "item2",
			text: "History Item 2"
		}];
		aResult[0][HistoryConstants.getSuggestionsGroupPropertyName()] = 20;
		aResult[1][HistoryConstants.getSuggestionsGroupPropertyName()] = 20;

		// Act
		this.oVLP._updateModelHistoryData(aHistoryData);

		// Assert
		var aData = this.oVLP.oControl.getModel("list").getData();
		assert.notOk(aHistoryData[0][SUGGESTION_GROUP_ORDER_NAME], "original item1 should not be modified");
		assert.notOk(aHistoryData[1][SUGGESTION_GROUP_ORDER_NAME], "original item2 should not be modified");
		assert.deepEqual(oAddSuggestionsToGroupSpy.getCall(0).args[0], aHistoryData, "history data is passed as first arg to _addSuggestionsToGroup");
		assert.equal(oAddSuggestionsToGroupSpy.getCall(0).args[1], 20, "_addSuggestionsToGroup is called with second param 20 (index of recently used goup)");
		assert.deepEqual(aData, aResult, "history data should be added to the JSON model");

		// Cleanup
		oAddSuggestionsToGroupSpy.restore();
		oShouldHaveRecommendations.restore();
		oShouldHaveHistory.restore();
	});

	QUnit.test("_updateModelHistoryData merge history data with recommendations and add them to JSONmodel", function (assert) {
		// Arrange
		var oAddSuggestionsToGroupSpy = this.spy(this.oVLP, "_addSuggestionsToGroup");
		var oShouldHaveRecommendations = this.stub(this.oVLP, "_shouldHaveRecommendations").returns(true);
		this.oVLP._aCols = [{ template: "key" }, { template: "text" }];
		var aHistoryData = [{
				key: "item1",
				text: "History Item 1"
			}, {
				key: "item2",
				text: "History Item 2"
			}],
			aResult = [{
				key: "item1",
				text: "History Item 1"
			}, {
				key: "item2",
				text: "History Item 2"
			}, {
				key: "item3",
				text: "Recommendation Item 1"
			}];

		aResult[0][HistoryConstants.getSuggestionsGroupPropertyName()] = 20;
		aResult[1][HistoryConstants.getSuggestionsGroupPropertyName()] = 20;
		aResult[2][HistoryConstants.getSuggestionsGroupPropertyName()] = 10;

		var aDataToSet = [{
			key: "item3",
			text: "Recommendation Item 1"
		}];
		aDataToSet[0][HistoryConstants.getSuggestionsGroupPropertyName()] = 10;

		this.oVLP.oControl.getModel("list").setData(aDataToSet);

		// Act
		this.oVLP._updateModelHistoryData(aHistoryData);

		// Assert
		var aData = this.oVLP.oControl.getModel("list").getData();
		assert.deepEqual(aData, aResult, "history data should be merged with recommendations");

		// Cleanup
		oAddSuggestionsToGroupSpy.restore();
		oShouldHaveRecommendations.restore();
	});

	QUnit.test("_updateModelHistoryData should close suggestion popover", function (assert) {
		// Arrange
		var oClock = sinon.useFakeTimers();
		var oEventMock = { getParameter: this.stub().returns([]) };
		// var oUpdateModelHistoryDataStub = this.stub(this.oVLP, "_updateModelHistoryData");
		var oCloseSpy = this.spy();
		this.oVLP.oControl = {
			getModel: this.stub().returns({
				getData: this.stub().returns([]),
				setData: this.stub()
			}),
			isA: this.stub().returns(true),
			_oSuggPopover: {
				_oPopover: { close: oCloseSpy },
				_deregisterResize: this.stub(),
				destroy: this.stub()
			},
			unbindAggregation: this.stub(),
			data: this.stub(),
			removeEventDelegate: this.stub()
		};
		this.oVLP._aCols = [{ template: "key" }, { template: "text" }];

		// Act
		this.oVLP._onHistoryFieldUpdated(oEventMock);
		oClock.tick(100);

		// Assert
		assert.equal(oCloseSpy.callCount, 1, "suggestion popover is closed");

		// Cleanup
		oClock.restore();
	});

	QUnit.test("_updateModelHistoryData should return without invoking the function if there is no control", function (assert) {
		// Arrange
		var oShowSuggestionsMoreButtonSpy = this.spy(this.oVLP, "_showSuggestionsMoreButton");
		this.oVLP.oControl = null;

		// Act
		this.oVLP._updateModelHistoryData();

		// Assert
		assert.equal(oShowSuggestionsMoreButtonSpy.callCount, 0, "_showSuggestionsMoreButton should not be called");

		// Cleanup
		oShowSuggestionsMoreButtonSpy.restore();
		this.oVLP.oControl = {
			removeEventDelegate: this.stub(),
			unbindAggregation: this.stub(),
			data: this.stub()
		};
	});

	QUnit.test("_shouldHaveHistory should return false if no metadata is provided", function (assert) {

		// Act
		this.oVLP._filedHistoryEnabled = true;
		var bResult = this.oVLP._shouldHaveHistory();

		// Assert
		assert.notOk(bResult, "should not have history without metadata");

	});

	QUnit.test("_shouldHaveHistory should return true if field is not sensitive and ushell library is loaded and inputFieldHistoryStorage ushell setting is set", function (assert) {
		// Arrange
		window["sap-ushell-config"] = {
			apps: {
				inputFieldHistory: {
					enabled: true
				}
			}
		};
		this.oVLP._fieldViewMetadata = {
			"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
				Bool: "false"
			}
		};
		this.oVLP._filedHistoryEnabled = true;
		this.oVLP._sFullyQualifiedFieldName = "test";

		// Act
		var bResult = this.oVLP._shouldHaveHistory();

		// Assert
		assert.ok(bResult, "should have history");

		// Arrange
		this.oVLP._fieldViewMetadata = {
			"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
				Bool: "true"
			}
		};

		// Act
		var bResult = this.oVLP._shouldHaveHistory();

		// Assert
		assert.notOk(bResult, "should not have history");

		// Cleanup
		delete window["sap-ushell-config"];
	});

	QUnit.test("_shouldHaveHistory should return false if it is turned off through a property for this field", function (assert) {
		// Arrange
		window["sap-ushell-config"] = {
			apps: {
				inputFieldHistory: {
					enabled: true
				}
			}
		};
		this.oVLP._fieldViewMetadata = {
			"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
				Bool: "false"
			}
		};
		this.oVLP._sFullyQualifiedFieldName = "test";

		// Act
		this.oVLP._fieldHistoryEnabled = false;
		var bResult = this.oVLP._shouldHaveHistory();

		// Assert
		assert.notOk(bResult, "should not have history if it is turned of by a property");

		// Cleanup
		delete window["sap-ushell-config"];
	});

	QUnit.test("_shouldHaveHistory should return false if control is ComboBox or MultiComboBox", function (assert) {
		// Arrange
		window["sap-ushell-config"] = {
			apps: {
				inputFieldHistory: {
					enabled: true
				}
			}
		};
		this.oVLP._fieldViewMetadata = {
		};
		this.oVLP._sFullyQualifiedFieldName = "test";

		// Act
		this.oVLP.oControl = new ComboBox();
		var bResult = this.oVLP._shouldHaveHistory();

		// Assert
		assert.notOk(bResult, "should not have history in case of ComboBox");

		// Act
		this.oVLP.oControl = new MultiComboBox();
		var bResult = this.oVLP._shouldHaveHistory();

		// Assert
		assert.notOk(bResult, "should not have history in case of MultiComboBox");
	});

	QUnit.test("_shouldHaveHistory should return true if control is ComboBox or MultiComboBox and have not default setting of historyEnabled", function (assert) {
		// Arrange
		window["sap-ushell-config"] = {
			apps: {
				inputFieldHistory: {
					enabled: true
				}
			}
		};
		this.oVLP._fieldViewMetadata = {
		};
		this.oVLP._sFullyQualifiedFieldName = "test";
		this.oVLP._fieldHistoryEnabled = true;
		this.oVLP._fieldHistoryEnabledInitial = false;

		// Act
		this.oVLP.oControl = new ComboBox();
		var bResult = this.oVLP._shouldHaveHistory();

		// Assert
		assert.ok(bResult, "should have history in case of ComboBox and historyEnabled");

		// Act
		this.oVLP.oControl = new MultiComboBox();
		var bResult = this.oVLP._shouldHaveHistory();

		// Assert
		assert.ok(bResult, "should have history in case of MultiComboBox");
	});

	QUnit.test("_getSuggestionsEnabled should return false if inputFieldSuggestions ushell setting is set to false", function (assert) {
		// Arrange
		window["sap-ushell-config"] = {
			apps: {
				inputFieldSuggestions: {
					enabled: false
				}
			}
		};

		// Act
		var bResult = this.oVLP._getSuggestionsEnabled();

		// Assert
		assert.notOk(bResult, "should not have suggestions");

		// Cleanup
		delete window["sap-ushell-config"];
	});

	QUnit.test("_getSuggestionsEnabled should return ture if inputFieldSuggestions ushell setting is set to true", function (assert) {
		// Arrange
		window["sap-ushell-config"] = {
			apps: {
				inputFieldSuggestions: {
					enabled: true
				}
			}
		};
		// Act
		var bResult = this.oVLP._getSuggestionsEnabled();

		// Assert
		assert.ok(bResult, "should have suggestions");

		// Cleanup
		delete window["sap-ushell-config"];
	});

	QUnit.test("_getSuggestionsEnabled should return ture if ushell setting is  not set", function (assert) {
		// Arrange
		window["sap-ushell-config"] = {
			apps: {
			}
		};

		// Act
		var bResult = this.oVLP._getSuggestionsEnabled();

		// Assert
		assert.ok(bResult, "should have suggestions");

		// Cleanup
		delete window["sap-ushell-config"];
	});

	QUnit.test("_getSuggestionsEnabled should return ture if there is no ushell setting ", function (assert) {

		// Act
		var bResult = this.oVLP._getSuggestionsEnabled();

		// Assert
		assert.ok(bResult, "should have suggestions");

		// Cleanup
		delete window["sap-ushell-config"];
	});

	QUnit.test("_getShellConfig should return ushell configuration", function (assert) {
		// Arrange
		window["sap-ushell-config"] = {
			apps: {
				inputFieldHistory: {
					enabled: true
				},
				inputFieldSuggestions: {
					enabled: false
				}
			}
		};

		// Act
		var oResult = this.oVLP._getShellConfig();

		// Assert
		assert.ok(oResult.inputFieldHistory.enabled, "should have inputFieldHistory setting");
		assert.notOk(oResult.inputFieldSuggestions.enabled, "should have inputFieldSuggestions setting");

		// Cleanup
		delete window["sap-ushell-config"];
	});

	QUnit.test("_getShellConfig should return null if no ushell configuration", function (assert) {
		// Arrange

		// Act
		var oResult = this.oVLP._getShellConfig();

		// Assert
		assert.equal(oResult, null, "should return null");

		// Cleanup
	});

	QUnit.test("fnFilter of Input suggestions with history or recently used should filter on formatted text and all fields in the data", function (assert) {
		// Arrange
		var oItemData = {
				key: "Key",
				description:  "Description"
			},
			oItem = {
				getBindingContext: this.stub().returns({
					getObject: this.stub().returns(oItemData)
				})
			};
		this.oVLP._setupInputSuggestionInteractions();
		this.oVLP.sKey = "key";
		this.oVLP.sDescription = "description";

		// Act
		this.oVLP.sDDLBDisplayBehaviour = "idOnly";
		var bResult = this.oMockInput._fnFilter("Desc", oItem);

		// Assert
		assert.ok(bResult, "filter function searches in all fields in the data item and find in the description field");

		// Act
		this.oVLP.sDDLBDisplayBehaviour = "idAndDescription";
		var bResult = this.oMockInput._fnFilter("Key (Description)", oItem);

		// Assert
		assert.ok(bResult, "filter function searches if formatted text based on the display behaviour and find in formatted text");

		// Act
		this.oVLP.sDDLBDisplayBehaviour = "idAndDescription";
		var bResult = this.oMockInput._fnFilter("Not In the data", oItem);

		// Assert
		assert.notOk(bResult, "if filter function does not find in the formatted text or each field then return false");
	});

	QUnit.test("fnFilter of Input suggestions with history or recently used should not throw an exception", function (assert) {
		// Arrange
		var oItemData = {
				key: "Key",
				description:  "Description"
			},
			oItem = {
				getBindingContext: this.stub().returns({
					getObject: this.stub().returns(oItemData)
				})
			};
		this.oVLP._setupInputSuggestionInteractions();
		this.oVLP.sKey = undefined;
		this.oVLP.sDescription = undefined;

		// Act
		this.oVLP.sDDLBDisplayBehaviour = "idOnly";
		this.oMockInput._fnFilter("Desc", oItem);

		// Assert
		assert.ok(true, "no exception is thrown");
	});

	QUnit.test("_onAnnotationLoad should not bind the aggregation and setup interactions if the control is not supported for history or recommendations", function (assert) {
		// Arrange
		var oIsControlSupportedForHistoryStub = this.stub(this.oVLP, "_isControlSupportedForHistory").returns(false);
		var oShouldHaveHistoryStub = this.stub(this.oVLP, "_shouldHaveHistory").returns(true);
		var oBindInnerControlSuggestionsStub = this.stub(this.oVLP, "_bindInnerControlSuggestions");
		var oSetupSuggestionInteractionsStub = this.stub(this.oVLP, "_setupSuggestionInteractions");

		// Act
		this.oVLP._onAnnotationLoad({});

		// Assert
		assert.equal(oBindInnerControlSuggestionsStub.callCount, 0, "_bindInnerControlSuggestions should not be called");
		assert.equal(oSetupSuggestionInteractionsStub.callCount, 0, "_setupSuggestionInteractions should not be called");

		// Cleanup
		oIsControlSupportedForHistoryStub.restore();
		oShouldHaveHistoryStub.restore();
		oBindInnerControlSuggestionsStub.restore();
		oSetupSuggestionInteractionsStub.restore();
	});

	QUnit.test("_setupHistoryValues should not create history provider if the control is not supported", function (assert) {
		// Arrange
		var oIsControlSupportedForHistoryStub = this.stub(this.oVLP, "_isControlSupportedForHistory").returns(false);
		var oShouldHaveHistoryStub = this.stub(this.oVLP, "_shouldHaveHistory").returns(true);
		var oCreateHistoryValuesProviderStub = this.stub(this.oVLP, "_createHistoryValuesProvider");

		// Act
		this.oVLP._setupHistoryValues();

		// Assert
		assert.equal(oCreateHistoryValuesProviderStub.callCount, 0, "_createHistoryValuesProvider should not be called");

		// Cleanup
		oIsControlSupportedForHistoryStub.restore();
		oShouldHaveHistoryStub.restore();
		oCreateHistoryValuesProviderStub.restore();
	});

	QUnit.test("_getSuggestionsModelName should return the model name not modified if the control is not supported for history", function (assert) {
		// Arrange
		var oIsControlSupportedForHistoryStub = this.stub(this.oVLP, "_isControlSupportedForHistory").returns(false);

		// Act
		var vResult = this.oVLP._getSuggestionsModelName();

		// Assert
		assert.equal(vResult, undefined, "the model name should be undefined if the control is not supported for history");

		// Cleanup
		oIsControlSupportedForHistoryStub.restore();
	});

	QUnit.test("_isControlSupportedForHistory should work correctly", function (assert) {
		// Act
		var oStub = this.stub().returns(false);
		oStub.withArgs("sap.ui.comp.smartfield.DisplayComboBox").returns(true);
		var bResult = this.oVLP._isControlSupportedForHistory();

		// Assert
		assert.notOk(bResult, "if control is destroyed it should return false");

		// Act
		var oStub = this.stub().returns(false);
		oStub.withArgs("sap.ui.comp.smartfield.DisplayComboBox").returns(true);
		var bResult = this.oVLP._isControlSupportedForHistory({ isA: oStub });

		// Assert
		assert.notOk(bResult, "DisplayComboBox should not be supported for history");

		// Act
		var oStub = this.stub().returns(false);
		oStub.withArgs("sap.m.Select").returns(true);
		var bResult = this.oVLP._isControlSupportedForHistory({ isA: oStub });

		// Assert
		assert.notOk(bResult, "Select should not be supported for history");

		// Act
		var oStub = this.stub().returns(false);
		oStub.withArgs("sap.m.Input").returns(true);
		var bResult = this.oVLP._isControlSupportedForHistory({ isA: oStub });

		// Assert
		assert.ok(bResult, "Input should not be supported for history");

		// Act
		var oStub = this.stub().returns(false);
		oStub.withArgs("sap.m.MultiInput").returns(true);
		var bResult = this.oVLP._isControlSupportedForHistory({ isA: oStub });

		// Assert
		assert.ok(bResult, "MultiInput should not be supported for history");

		// Act
		var oStub = this.stub().returns(false);
		oStub.withArgs("sap.m.ComboBox").returns(true);
		var bResult = this.oVLP._isControlSupportedForHistory({ isA: oStub });

		// Assert
		assert.ok(bResult, "ComboBox should not be supported for history");

		// Act
		var oStub = this.stub().returns(false);
		oStub.withArgs("sap.m.MultiComboBox").returns(true);
		var bResult = this.oVLP._isControlSupportedForHistory({ isA: oStub });

		// Assert
		assert.ok(bResult, "MultiComboBox should not be supported for history");
	});

	QUnit.test("_parseHistoryJsonDates should convert JSON date string to JS Date", function (assert) {
		// Arrange
		var aData = [{
			prop1: "Not modified",
			prop2: "/Date(1612908000000)/",
			prop3: "Date(1612908000000)" // should not be modified. Does not match the pattern /Date(timestamp)/
		}];
		var aExpected = [{
			prop1: "Not modified",
			prop2: new Date(1612908000000),
			prop3: "Date(1612908000000)"
		}];

		// Act
		var aResult = this.oVLP._parseHistoryJsonDates(aData);

		// Assert
		assert.equal(aResult[0].prop1, aExpected[0].prop1);
		assert.equal(aResult[0].prop2.getTime(), aExpected[0].prop2.getTime());
		assert.equal(aResult[0].prop3, aExpected[0].prop3);
	});

	QUnit.module("Internal functions", {
		beforeEach: function () {
			this.oMockInput  = new Input();
			this.oVLP = new ValueListProvider({
				aggregation: "suggestionRows",
				control: this.oMockInput
			});
		},
		afterEach: function () {
			this.oVLP.destroy();
			this.oMockInput.destroy();
		}
	});

	QUnit.test("_handleRowSelect methods called in expected order",
		function () {
			// Arrange
			var oCalculateSpy = this.spy(this.oVLP, "_calculateAndSetFilterOutputData"),
				oInputSetterSpy = this.spy(this.oMockInput, "setValue"),
				oChangeSpy = sinon.spy();

			// Mock Key so it could be picked up from _handleRowSelect oDataModelRow mock
			this.oVLP.sKey = "mockKey";
			this.oVLP.sContext = "";

			this.oMockInput.attachChange(oChangeSpy);

			// Act
			this.oVLP._handleRowSelect({
				mockKey: "mockKey" // Propagate mock key to oDataModelRow mock
			});

			// Assert - all expected events happened in order
			sinon.assert.callOrder(oInputSetterSpy, oChangeSpy, oCalculateSpy);

			// Cleanup
			oCalculateSpy.restore();
			oInputSetterSpy.restore();
		}
	);

	QUnit.test("_handleSelect - validation of single input fields", function (assert) {
		// Arrange
		var oAttachMethodSpy = sinon.spy(this.oMockInput, "attachChange"),
			oValidateFunctionSpy = sinon.spy(this.oVLP, "_validateStringSingleWithValueList");

		// Arrange - mock field metadata and context
		this.oVLP._fieldViewMetadata = {
			hasValueListAnnotation: true
		};
		this.oVLP.sContext = "SmartFilterBar";

		// Act - call method
		this.oVLP._handleSelect();

		// Assert
		assert.strictEqual(oAttachMethodSpy.callCount, 1, "Change handler attached to input control");

		// Act - trigger validation event
		this.oMockInput.fireChange({
			text: "Some text"
		});

		// Assert
		assert.strictEqual(oValidateFunctionSpy.callCount, 1, "Validation is called when control change event is fired");

		// Cleanup
		oValidateFunctionSpy.restore();
		oAttachMethodSpy.restore();
	});

	QUnit.test("_validateStringSingleWithValueList", function (assert) {
		// Arrange
		var oMockEvent = {
				bValidated: true,
				sValue: "some text",
				getParameter: function (sName) {
					return sName === "validated" ? this.bValidated : this.sValue;
				}
			},
			oValidateFunctionSpy = sinon.stub(this.oVLP, "_validateInput");

		// Act - call with {validated: true, value: 'some text'}
		this.oVLP._validateStringSingleWithValueList(oMockEvent);

		// Assert
		assert.strictEqual(oValidateFunctionSpy.callCount, 0,
			"_validateInput should not be called in case event data is {validated: true, value: 'some text'}");

		// Arrange
		oMockEvent.bValidated = false;
		oMockEvent.sValue = "";

		// Act
		this.oVLP._validateStringSingleWithValueList(oMockEvent);

		// Assert
		assert.strictEqual(oValidateFunctionSpy.callCount, 0,
			"_validateInput should not be called in case event data is {validated: false, value: ''}");

		// Arrange - run method with event which value parameter is undefined
		oMockEvent.bValidated = false;
		oMockEvent.sValue = undefined;

		// Act
		this.oVLP._validateStringSingleWithValueList(oMockEvent);

		// Assert
		assert.strictEqual(oValidateFunctionSpy.callCount, 0,
			"_validateInput should not be called in this case}");

		// Arrange
		oMockEvent.bValidated = false;
		oMockEvent.sValue = "Some text";

		// Act
		this.oVLP._validateStringSingleWithValueList(oMockEvent);

		// Assert
		assert.strictEqual(oValidateFunctionSpy.callCount, 1,
			"_validateInput should be called in case event data is {validated: false, value: 'Some text'}");

		// Cleanup
		oValidateFunctionSpy.restore();
	});

	QUnit.test("_validateStringSingleWithValueList should parse text based on text arrangement to call _validateInput with the id", function (assert) {
		// Arrange
		var oMockEvent = {
			bValidated: false,
			getParameter: function (sName) {
				return sName === "validated" ? this.bValidated : this.sValue;
			}
		},
		oValidateFunctionSpy = this.stub(this.oVLP, "_validateInput");

		// idAndDescription
		// Act
		oMockEvent.sValue = "0001 (Description)";
		this.oVLP.sSingleFieldDisplayBehaviour = "idAndDescription";
		this.oVLP._validateStringSingleWithValueList(oMockEvent);

		// Assert
		assert.strictEqual(oValidateFunctionSpy.getCall(0).args[0], "0001", "_validateInput should be with '0001'");
		oValidateFunctionSpy.reset();

		// Act
		oMockEvent.sValue = "0001 (Description)a";
		this.oVLP.sSingleFieldDisplayBehaviour = "idAndDescription";
		this.oVLP._validateStringSingleWithValueList(oMockEvent);

		// Assert
		assert.strictEqual(oValidateFunctionSpy.getCall(0).args[0], "0001 (Description)a", "_validateInput should be with '0001 (Description)a'");
		oValidateFunctionSpy.reset();

		// descriptionAndId
		// Act
		oMockEvent.sValue = "Description (0001)";
		this.oVLP.sSingleFieldDisplayBehaviour = "descriptionAndId";
		this.oVLP._validateStringSingleWithValueList(oMockEvent);

		// Assert
		assert.strictEqual(oValidateFunctionSpy.getCall(0).args[0], "0001", "_validateInput should be with '0001'");
		oValidateFunctionSpy.reset();

		// Act
		oMockEvent.sValue = "Description (0001)a";
		this.oVLP.sSingleFieldDisplayBehaviour = "descriptionAndId";
		this.oVLP._validateStringSingleWithValueList(oMockEvent);

		// Assert
		assert.strictEqual(oValidateFunctionSpy.getCall(0).args[0], "Description (0001)a", "_validateInput should be with '0001 (Description)a'");
		oValidateFunctionSpy.reset();

		// Cleanup
		oValidateFunctionSpy.restore();
	});

	QUnit.test("_fetchSingleFieldDescription should wait for validation promises to be resolved before setting the data", function (assert) {
		// Arrange
		var done = assert.async();
		var oSetValueStub = this.stub(this.oVLP.oControl, "setValue");
		this.oVLP.sKey = "TheKey";
		this.oVLP.sDescription = "Desc";
		this.oVLP.sSingleFieldDisplayBehaviour = "idAndDescription";
		this.oVLP.oODataModel = {
			read: (sPath, oParameters) => {
				// Simulate async call
				oParameters.success({
					results: [{ Desc: "Company 0001", TheKey: "0001" }]
				});
			}
		};
		this.oVLP.oFilterProvider = {
			oModel: sinon.createStubInstance(JSONModel)
		};

		// Act
		this.oVLP._fetchSingleFieldDescription();

		// Assert
		assert.equal(oSetValueStub.callCount, 0, "setValue should not be called before the validation promise is resolved");

		Promise.all(this.oVLP._aValidationPromises).then(() => {
			// Assert
			assert.equal(oSetValueStub.callCount, 1, "setValue should be called after the validation promise is resolved");
			assert.equal(oSetValueStub.getCall(0).args[0], "0001 (Company 0001)", "setValue should be called with the resolved data");
			assert.equal(this.oVLP.oFilterProvider.oModel.setProperty.callCount, 1, "setProperty of the model should be called once");
			assert.equal(this.oVLP.oFilterProvider.oModel.setProperty.getCall(0).args[1], "0001", "setProperty of the model should be called with the right key");

			// Cleanup
			oSetValueStub.restore();
			done();
		});
	});

	QUnit.test("_fetchSingleFieldDescription should cancel previous calls to _fetchSingleFieldDescription and execute the last one", function (assert) {
		// Arrange
		function oDataRead(oParameters) {
			if (oParameters.filters[0].oValue1 === "EUR") {
				timeoutId = setTimeout(() => {
					oParameters.success({
						results: [{ Desc: "European Euro", TheKey: "EUR" }]
					});
				}, 200);
			} else {
				timeoutId = setTimeout(() => {
					oParameters.success({
						results: [{ Desc: "Australian Dollar", TheKey: "AUD" }]
					});
				}, 100);
			}
		}

		var timeoutId;
		var done = assert.async();
		var oSetValueStub = this.stub(this.oVLP.oControl, "setValue");
		this.oVLP.sKey = "TheKey";
		this.oVLP.sDescription = "Desc";
		this.oVLP.sSingleFieldDisplayBehaviour = "idAndDescription";
		this.oVLP.oODataModel = {
			read: (sPath, oParameters) => {
				oDataRead(oParameters);

				return {
					abort: () => clearTimeout(timeoutId)
				};
			}
		};

		// Act
		this.oVLP._fetchSingleFieldDescription("EUR");
		this.oVLP._fetchSingleFieldDescription("AUD");

		setTimeout(function () {
			assert.equal(oSetValueStub.callCount, 1, "setValue should be called once");
			assert.equal(oSetValueStub.args[0][0], "AUD (Australian Dollar)", "setValue should be called with the right data");
			done();
		}, 300);
	});

	QUnit.test("_handleRowSelect does not throw exception if '{' is part of the key of some tokens", function (assert) {
		// Arrange
		var oDataModelRowStub = {
			key: "not{escaped{key",
			desc: "not{escaped{desc"
		},
			oFnCallbackStub = this.stub();
		this.oVLP.oControl = new MultiInput();
		this.oVLP.sKey = "key";
		this.oVLP.sDescription = "desc";

		// Act
		this.oVLP._handleRowSelect(oDataModelRowStub, oFnCallbackStub);

		// Assert
		assert.ok(true, "no exception is thrown");
	});

	QUnit.test("_handleRowSelect should set getTextForCopy to tokens", function (assert) {
		// Arrange
		var oDataModelRowStub = {
				key: "not{escaped{key",
				desc: "not{escaped{desc"
			},
			oFnCallbackStub = this.stub();
		this.oVLP.oControl = new SFBMultiInput();
		this.oVLP.sKey = "key";
		this.oVLP.sDescription = "desc";

		// Act
		this.oVLP._handleRowSelect(oDataModelRowStub, oFnCallbackStub);

		// Assert
		assert.ok(true, "no exception is thrown");
		assert.equal(oFnCallbackStub.getCall(0).args[0].getMetadata().getName(), "sap.m.Token", "_handleRowSelect callback is invoked with token");
		assert.notEqual(oFnCallbackStub.getCall(0).args[0].getTextForCopy, undefined, "getTextForCopy is set");
	});

	QUnit.test("_sortRecommendations sort the provided recommendations by their 'rank' property", function (assert) {
		// Arrange
		var aRecommendations = [{ rank: 1 }, { rank: 3 }, { rank: 3.3 }, { rank: 3.5 }, { rank: 2 }],
			aExpected = [{ rank: 3.5 }, { rank: 3.3 }, { rank: 3 }, { rank: 2 }, { rank: 1 }];
		this.oVLP._oRecommendationListAnnotation = {
			rankProperty: "rank"
		};

		// Act
		var aResult = aRecommendations.sort(this.oVLP._sortRecommendations.bind(this.oVLP));

		// Assert
		assert.deepEqual(aExpected, aResult, "recommendations should be sorted descending by rank property");
	});

	QUnit.test("_getBindingLength returns the size limit set to the oData model or 100", function (assert) {
		// Arrange
		this.oVLP.oODataModel = {
			iSizeLimit: 10000
		};

		// Act
		var iResult = this.oVLP._getBindingLength();

		// Assert
		assert.equal(10000, iResult, "sizeLimit should be equal to sizeLimit set to oData model");

		// Arrange
		this.oVLP.oODataModel = {
			iSizeLimit: 100
		};

		// Act
		var iResult = this.oVLP._getBindingLength();

		// Assert
		assert.equal(300, iResult, "sizeLimit should be equal default 300 if model's size limit is smaller");
	});

	QUnit.test("_bindInnerControlSuggestions should bind aggregation with length set from the oData model", function (assert) {
		// Arrange
		var oBindAggregationSpy = this.spy(this.oVLP.oControl, "bindAggregation");

		// Act
		this.oVLP._bindInnerControlSuggestions();

		// Assert
		assert.equal(oBindAggregationSpy.getCall(0).args[1].length, 300, "bindAggregation should be called with length parameter set to 300 (default length)");

		// Act
		this.oVLP.oControl.unbindAggregation(this.oVLP.sAggregationName);
		this.oVLP.oODataModel = {
			iSizeLimit: 10000
		};
		this.oVLP._bindInnerControlSuggestions();

		// Assert
		assert.equal(oBindAggregationSpy.getCall(1).args[1].length, 10000, "bindAggregation should be called with length parameter set to 10000 (size of the oData model)");
	});

	QUnit.test("_bindInnerControlSuggestions should not bind aggregation if it is already binded", function (assert) {
		// Arrange
		var oBindAggregationSpy = this.spy(this.oVLP.oControl, "bindAggregation");
		this.stub(this.oVLP.oControl, "isBound").returns(true);

		// Act
		this.oVLP._bindInnerControlSuggestions();

		// Assert
		assert.equal(oBindAggregationSpy.callCount, 0, "bindAggregation should not be called if the aggregation is already binded");
	});

	// If in params come from Input
	QUnit.test("_filterSuggestionsWithInParams should filter based on in/out params if in param is a string", function (assert) {
		// Arrange
		var oFilterInputData = {
			inProperty: "Value 1"
		};
		var aItems = [{
			otherProp: "prop 1",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 2",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 3",
			inProperty: "Value 2"
		}];
		var aExpected = [{
			otherProp: "prop 1",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 2",
			inProperty: "Value 1"
		}];

		// Act
		var aResult = aItems.filter(this.oVLP._filterSuggestionsWithInParams.bind(this.oVLP, oFilterInputData));

		// Assert
		assert.equal(aResult.length, 2, "one item should be removed because it does not match the in params");
		assert.deepEqual(aResult, aExpected, "should match the expected");
	});

	// BCP: 2080348788 if inParams are coming from multi input
	QUnit.test("_filterSuggestionsWithInParams should filter based on in/out params if in param is an object", function (assert) {
		// Arrange
		var oFilterInputData = {
			inProperty: { items: [{key: "Value 1"}] }
		};
		var aItems = [{
			otherProp: "prop 1",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 2",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 3",
			inProperty: "Value 2"
		}];
		var aExpected = [{
			otherProp: "prop 1",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 2",
			inProperty: "Value 1"
		}];

		// Act
		var aResult = aItems.filter(this.oVLP._filterSuggestionsWithInParams.bind(this.oVLP, oFilterInputData));

		// Assert
		assert.equal(aResult.length, 2, "one item should be removed because it does not match the in params");
		assert.deepEqual(aResult, aExpected, "should match the expected");
	});

	QUnit.test("_filterSuggestionsWithInParams should not filter based on in/out params which are not contained as key", function (assert) {
		// Arrange
		var oFilterInputData = {
			notIn: "Value 1"
		};
		var aItems = [{
			otherProp: "prop 1",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 2",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 3",
			inProperty: "Value 2"
		}];
		var aExpected = [{
			otherProp: "prop 1",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 2",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 3",
			inProperty: "Value 2"
		}];

		// Act
		var aResult = aItems.filter(this.oVLP._filterSuggestionsWithInParams.bind(this.oVLP, oFilterInputData));

		// Assert
		assert.equal(aResult.length, 3, "no item should be removed because the filter key does not define in params");
		assert.deepEqual(aResult, aExpected, "should match the expected");
	});

	QUnit.test("_createSuggestionTemplate adds a css class to the suggestions table", function (assert) {
		// Arrange
		var oAddStyleClassSpy = this.spy();
		this.oVLP.oControl = {
			data: this.stub(),
			unbindAggregation: this.stub(),
			removeEventDelegate: this.stub(),
			_oSuggestionTable: {
				addStyleClass: oAddStyleClassSpy
			}
		};

		// Act
		this.oVLP._createSuggestionTemplate();

		// Assert
		assert.equal(oAddStyleClassSpy.callCount, 1, "addStyleClass for the suggestions table is called");
		assert.equal(oAddStyleClassSpy.getCall(0).args[0], "sapUiCompValueListProviderTable", "the right css class is added to the suggestions table");
	});

	QUnit.test("_createSuggestionTemplate should be able to create combined columns, as well normal columns", function (assert) {
		// Arrange
		this.oVLP._aCols = [{
			template: ["FirstName", "LastName"]
		}, {
			template: "Age"
		}];

		// Act
		this.oVLP._createSuggestionTemplate();

		var aCells = this.oVLP._oTemplate.getCells(),
			oFirstCell = aCells[0],
			oSecondCell = aCells[1];

		// Assert
		assert.equal(oFirstCell.getBindingInfo("text").parts[0].path, "FirstName", "template of first column should be created by combination of two columns. The first one FirstName");
		assert.equal(oFirstCell.getBindingInfo("text").parts[1].path, "LastName", "template of first column should be created by combination of two columns. The second one LastName");
		assert.equal(oSecondCell.getBindingInfo("text").parts[0].path, "Age", "template of second column should be created by one property. The property Age");
	});

	QUnit.test("BCP:2070305180 _validateInput _pendingAutoTokenGeneration flag is raised/lowered when _handleRowSelect is called", function (assert) {
		// Arrange
		var oModel = {
				read: function (sPath, oSettings) {
					oSettings.success({
						results: [
							{KEY: "1", TXT: "Desc"}
						]
					});
				}
			},
			oAnnotation = {keyField: "KEY"},
			oControl = new MultiInput(),
			oVLP = new ValueListProvider({
				model: oModel,
				control: oControl,
				annotation: oAnnotation
			});

		// Assert
		assert.strictEqual(oControl._pendingAutoTokenGeneration, undefined, "Pending flag has not been defined yet");

		// Arrange
		oVLP._handleRowSelect = function () {
			// Assert
			assert.strictEqual(oControl._pendingAutoTokenGeneration, true, "Pending flag is raised");
		};

		// Act
		oVLP._validateInput("1");

		// Assert
		assert.strictEqual(oControl._pendingAutoTokenGeneration, false, "Pending flag is lowered");

		// Cleanup
		oControl.destroy();
		oVLP.destroy();
	});

	QUnit.test("_validateInput should not trigger validation request and the input should be set to 'Error' state if text entered is longer that max-length", function (assert) {
		// Arrange
		var oModel = {
				read: this.spy()
			},
			oControl = sinon.createStubInstance(Input),
			oVLP = new ValueListProvider({
				model: oModel,
				control: oControl,
				fieldViewMetadata: {
					maxLength: 3,
					filterRestriction: "single"
				},
				context: "SmartFilterBar"
			});

		// Act
		oVLP._validateInput("abcd");

		// Assert
		assert.equal(oModel.read.callCount, 0, "validation request should not be triggered if max length is ");
		assert.equal(oControl.setValueState.callCount, 1, "setValueState is called once");
		assert.equal(oControl.setValueState.getCall(0).args[0], "Error", "setValueState should be called with 'Error' parameter");

		// Cleanup
		oControl.destroy();
		oVLP.destroy();
	});

	QUnit.test("_validateInput should update only the model and not select suggestion row if service returns more than one row", function (assert) {
		// Arrange
		var oSetPropertySpy = this.spy(),
			oModel = {
				read: function (sPath, oConfig) {
					oConfig.success({
						results: [{ key: "0001", out: "a"}, { key: "0001", out: "b"}]
					});
				}
			},
			oControl = sinon.createStubInstance(Input),
			oVLP = new ValueListProvider({
				model: oModel,
				control: oControl,
				fieldViewMetadata: {
					maxLength: 4,
					filterRestriction: "single"
				},
				context: "SmartFilterBar"
			});
			oVLP.sKey = "key";
			oVLP.oFilterProvider = {
				oModel: {
					setProperty: oSetPropertySpy
				}
			};

		// Act
		oVLP._validateInput("0001");

		// Assert
		assert.equal(oSetPropertySpy.getCall(0).args[1], "0001", "model should be update with the key field");

		// Cleanup
		oControl.destroy();
		oVLP.destroy();
	});

	QUnit.test("_validateInput should skip _afterTokenVaidation call if a third parameter is passed to it", function (assert) {
		// Arrange
		var oModel = {
				read: function(sEntitySetName, oSettings) {
					oSettings.success({
						results: [{
							key: "key",
							text: "text"
						}]
					});
				}
			},
			oControl = sinon.createStubInstance(Input),
			oVLP = new ValueListProvider({
				model: oModel,
				control: oControl,
				fieldViewMetadata: {
					maxLength: 10,
					filterRestriction: "single"
				},
				context: "SmartFilterBar"
			}),
			oAfterTokenValidateStub = this.stub(oVLP, "_afterTokenValidate");

		// Act
		oVLP._validateInput("input1", undefined, true);

		// Assert
		assert.equal(oAfterTokenValidateStub.callCount, 0, "_afterTokenValidate should not be called if skip parameter is passed");

		// Act
		oVLP._validateInput("input2");

		// Assert
		assert.equal(oAfterTokenValidateStub.callCount, 1, "_afterTokenValidate should be called if no skip parameter is passed");


		// Cleanup
		oAfterTokenValidateStub.restore();

	});

	QUnit.test("_handlePresentationVariantSortOrderAnnotation should return an object of Presentation Variant Annotation", function (assert) {
		// Arrange
		this.oVLP._oMetadataAnalyser = new MetadataAnalyser();
		this.oVLP.oPrimaryValueListAnnotation = {
			"fields": [
				{"name": "KEY", "type": "Edm.String"},
				{"name": "COUNTRY", "type": "Edm.String", "nullable": "false", "sap:sortable": true, "sortable": true }
			],
			"valueListEntityName": "EmployeesNamespace.StringVHType"
		};
		this.stub(this.oVLP._oMetadataAnalyser, "_getPresentationVariantQualifierForVHD").returns(" ");
		this.stub(this.oVLP._oMetadataAnalyser, "getPresentationVariantAnnotation").returns({
			"annotation": {
				"SortOrder":[{
				"Descending": {"Bool": true},
				"Property": {"PropertyPath": "COUNTRY"},
				"RecordType": "com.sap.vocabularies.Common.v1.SortOrderType"
			}]
			},
			"sortOrderFields": [{
				"descending": true,
				"name": "COUNTRY"
			}]
		});
		this.stub(this.oVLP._oMetadataAnalyser, "_getEntityDefinition").returns({
			"com.sap.vocabularies.UI.v1.PresentationVariant": {
				"SortOrder":[{
				"Descending": {"Bool": true},
				"Property": {"PropertyPath": "COUNTRY"},
				"RecordType": "com.sap.vocabularies.Common.v1.SortOrderType"
			}]
			},
			"property": [
				{"name": "KEY", "type": "Edm.String"},
				{"name": "COUNTRY", "type": "Edm.String", "nullable": "false", "sap:sortable": true, "sortable": true }
			]
		});

		// Act
		this.oVLP.oPresentationVariantAnnotation = this.oVLP._handlePresentationVariantSortOrderAnnotation();

		// Assert
		assert.equal(this.oVLP.oPresentationVariantAnnotation.sPresentationVariantSortPath, "COUNTRY", "sPresentationVariantSortPath is set and correct");
		assert.equal(this.oVLP.oPresentationVariantAnnotation._bIsPresentationVariantSortOrderPropertySortable, true, "_bIsPresentationVariantSortOrderPropertySortable is set and is true");
		assert.equal(this.oVLP.oPresentationVariantAnnotation._bIsPresentationVariantSortPathInVHDEntityType, true, "_bIsPresentationVariantSortPathInVHDEntityType is set and is true");

		// Cleanup
		this.oVLP.destroy();
	});

	QUnit.test("_handlePresentationVariantSortOrderAnnotation should return an object of Presentation Variant Annotation without sPresentationVariantSortPath on missing sortOrderFields", function (assert) {
		// Arrange
		this.oVLP._oMetadataAnalyser = new MetadataAnalyser();
		this.oVLP.oPrimaryValueListAnnotation = {
			"fields": [
				{"name": "KEY", "type": "Edm.String"},
				{"name": "COUNTRY", "type": "Edm.String", "nullable": "false", "sap:sortable": true, "sortable": true }
			],
			"valueListEntityName": "EmployeesNamespace.StringVHType"
		};
		this.stub(this.oVLP._oMetadataAnalyser, "_getPresentationVariantQualifierForVHD").returns(" ");
		this.stub(this.oVLP._oMetadataAnalyser, "getPresentationVariantAnnotation").returns({
			"annotation": {
				"SortOrder":[{
				"Descending": {"Bool": true},
				"Property": {"PropertyPath": "COUNTRY"},
				"RecordType": "com.sap.vocabularies.Common.v1.SortOrderType"
			}]
			},
			"sortOrderFields": []
		});
		this.stub(this.oVLP._oMetadataAnalyser, "_getEntityDefinition").returns({
			"com.sap.vocabularies.UI.v1.PresentationVariant": {
				"SortOrder":[{
				"Descending": {"Bool": true},
				"Property": {"PropertyPath": "COUNTRY"},
				"RecordType": "com.sap.vocabularies.Common.v1.SortOrderType"
			}]
			},
			"property": [
				{"name": "KEY", "type": "Edm.String"},
				{"name": "COUNTRY", "type": "Edm.String", "nullable": "false", "sap:sortable": true, "sortable": true }
			]
		});

		// Act
		this.oVLP.oPresentationVariantAnnotation = this.oVLP._handlePresentationVariantSortOrderAnnotation();

		// Assert
		assert.equal(this.oVLP.oPresentationVariantAnnotation.sPresentationVariantSortPath, undefined, "sPresentationVariantSortPath is not set due to missing sortOrderFields");

		// Cleanup
		this.oVLP.destroy();
	});

	QUnit.test("_handlePresentationVariantSortOrderAnnotation should create instance of MetadataAnalyser is nessesary", function (assert) {
		// Arrange
		this.oVLP.oPrimaryValueListAnnotation = {
			"fields": [
				{"name": "KEY", "type": "Edm.String"},
				{"name": "COUNTRY", "type": "Edm.String", "nullable": "false", "sap:sortable": true, "sortable": true }
			],
			"valueListEntityName": "EmployeesNamespace.StringVHType"
		};

		// Act
		this.oVLP._handlePresentationVariantSortOrderAnnotation();

		// Assert
		assert.ok(this.oVLP._oMetadataAnalyser instanceof Object, "MetadataAnalyser is created");

		// Cleanup
		this.oVLP.destroy();
	});

	QUnit.test("_resetValueState should remove the error state when there is a valid key in the ComboBox", function (assert) {
		// Arrange
		var oEvent = {
			getParameter: function () {
				return {
					results: [{"KEY": "1", "TXT": "Test"}]
				};
			}
		};
		this.oVLP.oControl = new ComboBox();
		this.oVLP.sKey = "KEY";

		// Act
		this.oVLP.oControl.setValueState("Error");
		this.oVLP.oControl.setSelectedKey("1");
		this.oVLP._resetValueState(oEvent);

		//Assert
		assert.equal(this.oVLP.oControl.getValueState(), "None", "valueState is correctly reset");

		// Cleanup
		this.oVLP.oControl.destroy();
	});

	QUnit.test("_applyValueIfNeeded: the value is applied after the items are loaded on certain conditions", function (assert) {
		// Arrange
		this.oVLP.oControl = new ComboBox();
		this.oVLP.oControl.setValue("1");
		this.oVLP.oControl.addItem(new Item({"key": "1", "text": "Test"}));

		// Act
		this.oVLP._applyValueIfNeeded();

		//Assert
		assert.equal(this.oVLP.oControl.getSelectedKey(), "1", "The value is applied as an item.");

		// Cleanup
		this.oVLP.oControl.destroy();
	});

	QUnit.test("_updateBindings should filter dropdown rows", function (assert) {
		// Arrange
		const fnCalculateFilterInputData = sinon.stub(this.oVLP, "_calculateFilterInputData"),
		fnFilterDropdownRowsByInParameters = sinon.stub(this.oVLP, "_filterDropdownRowsByInParameters");
		this.oVLP._mLastFilterInputData = {Customer: "value1"};

		// Act
		this.oVLP._updateBindings();

		// Assert
		assert.equal(this.oVLP._calculateFilterInputData.calledOnce, true, "_calculateFilterInputData is correctly called");
		assert.equal(this.oVLP._filterDropdownRowsByInParameters.calledOnce, true, "_filterDropdownRowsByInParameters is correctly called");

		// Cleanup
		fnFilterDropdownRowsByInParameters.restore();
		fnCalculateFilterInputData.restore();
	});

	QUnit.test("_updateBindings should not call _filterDropdownRowsByInParameters in case there is no lastFilterInputData", function (assert) {
		// Arrange
		const fnFilterDropdownRowsByInParameters = sinon.stub(this.oVLP, "_filterDropdownRowsByInParameters");
		this.oVLP._mLastFilterInputData = undefined;

		// Act
		this.oVLP._updateBindings();

		// Assert
		assert.equal(this.oVLP._filterDropdownRowsByInParameters.notCalled, true, "_filterDropdownRowsByInParameters should not be called");

		// Cleanup
		fnFilterDropdownRowsByInParameters.restore();
	});
});
