/* global QUnit, sinon */
sap.ui.define([
	"sap/ui/comp/providers/BaseValueListProvider",
	"sap/ui/comp/util/DateTimeUtil",
	"sap/ui/comp/odata/MetadataAnalyser",
	"sap/m/MultiComboBox",
	"sap/ui/comp/library",
	"sap/m/Input",
	"sap/m/MultiInput",
	"sap/m/Token",
	"sap/base/Log",
	"sap/m/table/Util"
], function(BaseValueListProvider, DateTimeUtil, MetadataAnalyser, MultiComboBox, library, Input, MultiInput, Token, Log, TableUtil) {
	"use strict";

	var DisplayBehaviour = library.smartfilterbar.DisplayBehaviour;

	QUnit.module("sap.ui.comp.providers.BaseValueListProvider", {
		beforeEach: function() {
			this.sTitle = "foo";
			this.oAnnotation = {valueListEntitySetName: "Chuck", keyField: "TheKey", descriptionField: "Desc", keys: ["TheKey"], fields: [{name: "MyText", type: "Edm.String"}, {name: "MyDate",type: "Edm.DateTime", displayFormat: "Date"}, {name: "TestField",type: "Edm.DateTime", displayFormat: "NonNegative", isDigitSequence: "true"}], valueListFields: [{name: "TheKey", type: "Edm.String", visible: true}, {name: "Desc",type: "Edm.String", visible: true}, {name: "DoB",type: "Edm.DateTime", displayFormat: "Date", visible: true}, {name: "employed", type: "Edm.Boolean", visible: false}]};
			this.oModel = {read: sinon.stub()};
			this.oBaseValueListProvider = new BaseValueListProvider({title:this.sTitle,control: new MultiComboBox(), aggregation:"items",annotation:this.oAnnotation,model:this.oModel});
		},
		afterEach: function() {
			this.oBaseValueListProvider.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oBaseValueListProvider);
	});

	QUnit.test("Shall default UTC to true when no dateFormatSettings are passed", function(assert) {
		assert.ok(this.oBaseValueListProvider._oDateFormatSettings);
		assert.strictEqual(this.oBaseValueListProvider._oDateFormatSettings.UTC, true);
	});

	QUnit.test("Shall contain the necessary params", function(assert) {
		assert.strictEqual(this.oBaseValueListProvider.sKey,this.oAnnotation.keyField);
		assert.strictEqual(this.oBaseValueListProvider.sDescription,this.oAnnotation.descriptionField);
		assert.strictEqual(this.oBaseValueListProvider.oODataModel,this.oModel);
		assert.strictEqual(this.oBaseValueListProvider.oFilterModel,this.oAnnotation.filterModel);
		assert.strictEqual(this.oBaseValueListProvider._aKeys,this.oAnnotation.keys);
		assert.strictEqual(this.oBaseValueListProvider.sDDLBDisplayBehaviour, DisplayBehaviour.descriptionOnly);
		assert.strictEqual(this.oBaseValueListProvider.sTokenDisplayBehaviour, DisplayBehaviour.descriptionAndId);
	});

	QUnit.test("Shall contain the necessary columns", function(assert) {
		var aCols = this.oBaseValueListProvider._aCols;
		assert.strictEqual(aCols.length, 3);
	});

	QUnit.test("_calculateFilterInputData Shall set mFilterInputData & aFilterField", function(assert) {
		var oData = {"field":"value","field2":"value2","SomeField":"value3"};
		this.oBaseValueListProvider.oFilterModel = {getData:function(){return oData;}};
		this.oBaseValueListProvider.mInParams = {field:"field",SomeField:"field3"};
		this.oBaseValueListProvider.mConstParams = { constKey: "constValue" };
		this.oBaseValueListProvider._calculateFilterInputData();
		assert.ok(this.oBaseValueListProvider.mFilterInputData);
		assert.strictEqual(this.oBaseValueListProvider.mFilterInputData.field, "value");
		assert.strictEqual(this.oBaseValueListProvider.mFilterInputData.field3, "value3");
		assert.strictEqual(this.oBaseValueListProvider.mFilterInputData.constKey, "constValue");
		assert.ok(this.oBaseValueListProvider.aFilterField);
		assert.strictEqual(this.oBaseValueListProvider.aFilterField.length, 3);
		assert.strictEqual(this.oBaseValueListProvider.aFilterField[0], "field");
		assert.strictEqual(this.oBaseValueListProvider.aFilterField[1], "field3");
		assert.strictEqual(this.oBaseValueListProvider.aFilterField[2], "constKey");
	});

	QUnit.test("_calculateFilterInputData Shall return no error when there is no control with bindingContext", function(assert) {
		// Arrange
		sinon.spy(Log, "error");

		this.oBaseValueListProvider.oODataModel = {};
		this.oBaseValueListProvider.mInParams = {testField:"field"};
		this.oBaseValueListProvider.mConstParams = { constKey: "constValue" };
		sinon.stub(this.oBaseValueListProvider.oControl, "getBindingContext").returns(undefined);

		// Act
		this.oBaseValueListProvider._calculateFilterInputData();

		// Assert
		assert.ok(Log.error.notCalled, "Function Log.error has not been called.");

		// Cleanup
		this.oBaseValueListProvider.destroy();
		Log.error.restore();

	});

	QUnit.test("_calculateFilterInputData Shall set mFilterInputData & aFilterField from FilterProvider/SmartFilter (visble fields)", function(assert) {
		var oVisibleFieldData = {"field":"value","field2":"value2","SomeField":"value3", "$Parameter.field4":"value4"};
		this.oBaseValueListProvider.oFilterProvider = {_oSmartFilter:{getFilterData:function(){return oVisibleFieldData;}}};
		this.oBaseValueListProvider.mInParams = {field:"field",SomeField:"field3","field4":"field4"};
		this.oBaseValueListProvider._calculateFilterInputData();
		assert.ok(this.oBaseValueListProvider.mFilterInputData);
		assert.strictEqual(this.oBaseValueListProvider.mFilterInputData.field, "value");
		assert.strictEqual(this.oBaseValueListProvider.mFilterInputData.field3, "value3");
		assert.strictEqual(this.oBaseValueListProvider.mFilterInputData.field4, "value4");
		assert.ok(this.oBaseValueListProvider.aFilterField);
		assert.strictEqual(this.oBaseValueListProvider.aFilterField.length, 3);
		assert.strictEqual(this.oBaseValueListProvider.aFilterField[0], "field");
		assert.strictEqual(this.oBaseValueListProvider.aFilterField[1], "field3");
		assert.strictEqual(this.oBaseValueListProvider.aFilterField[2], "field4");
	});

	QUnit.test("_calculateFilterInputData Shall set mFilterInputData visible fields in FilterBar", function(assert) {
		// Arrange
		var oData = { visibleField: "value1", notVisibleField: "value2" };

		var oVisibleFilterItem = { getVisibleInFilterBar: this.stub().returns(true) };
		var oNotVisibleFilterItem = { getVisibleInFilterBar: this.stub().returns(false) };
		var oGetFilterItemByNameStub = this.stub();
		var oSmartFilterBar = { _getFilterItemByName: oGetFilterItemByNameStub };
		oGetFilterItemByNameStub.withArgs("visibleField").returns(oVisibleFilterItem);
		oGetFilterItemByNameStub.withArgs("notVisibleField").returns(oNotVisibleFilterItem);

		this.oBaseValueListProvider.mInParams = { visibleField: "fieldName1", notVisibleField: "fieldName2" };
		this.oBaseValueListProvider.sContext = "SmartFilterBar";
		this.oBaseValueListProvider.oFilterProvider = { _oSmartFilter: oSmartFilterBar };

		var oGetFilterDataStub = this.stub(this.oBaseValueListProvider, "_getFilterData").returns(oData);

		// Act
		this.oBaseValueListProvider._calculateFilterInputData();

		// Assert
		assert.equal(this.oBaseValueListProvider.aFilterField.length, 1, "only visible fields should be included in 'IN' params");
		assert.ok(this.oBaseValueListProvider.aFilterField.includes("fieldName1"), "visible field should be in aFilterField");
		assert.notOk(this.oBaseValueListProvider.aFilterField.includes("fieldName2"), "not visible field should not be in aFilterField");

		// Cleanup
		oGetFilterDataStub.restore();
	});

	QUnit.test("_calculateFilterInputData Shall set mFilterInputData visible fields in FilterBar", function(assert) {
		// Arrange
		var oData = { visibleField: "value1", notVisibleField: "value2" };

		this.oBaseValueListProvider.mInParams = { visibleField: "fieldName1", notVisibleField: "fieldName2" };
		this.oBaseValueListProvider.sContext = "mdcFilterPanel";
		this.oBaseValueListProvider.oFilterProvider = { _oSmartFilter: {} };

		var oGetFilterDataStub = this.stub(this.oBaseValueListProvider, "_getFilterData").returns(oData);

		// Act
		this.oBaseValueListProvider._calculateFilterInputData();

		// Assert
		assert.equal(this.oBaseValueListProvider.aFilterField.length, 0, "no fields should be included in 'IN' params");

		// Cleanup
		oGetFilterDataStub.restore();
	});

	QUnit.test("_calculateFilterInputData Shall set mFilterInputData & aFilterField (SmartField scenario, with a Date input)", function(assert) {

		var oDate = new Date();
		var oDatePlusTimezone = DateTimeUtil.utcToLocal(oDate);

		this.oBaseValueListProvider.oODataModel = {};
		this.oBaseValueListProvider.mInParams = {stringField:"MyText", dateField:"MyDate"};

		var oBindingContext = {
		    getProperty: function(s) {
               return (s === "dateField") ? oDate : s;
		    }
		};
		sinon.stub(this.oBaseValueListProvider.oControl, "getBindingContext").returns(oBindingContext);

		this.oBaseValueListProvider._calculateFilterInputData();
		assert.ok(this.oBaseValueListProvider.mFilterInputData);
		assert.strictEqual(this.oBaseValueListProvider.mFilterInputData.MyText, "stringField");
		assert.strictEqual(this.oBaseValueListProvider.mFilterInputData.MyDate.toJSON(),  oDatePlusTimezone.toJSON());
		assert.ok(this.oBaseValueListProvider.aFilterField);
		assert.strictEqual(this.oBaseValueListProvider.aFilterField.length, 2);
		assert.strictEqual(this.oBaseValueListProvider.aFilterField[0], "MyText");
		assert.strictEqual(this.oBaseValueListProvider.aFilterField[1], "MyDate");
	});

	QUnit.test("_calculateFilterInputData Shall set mFilterInputData & aFilterField (SmartField scenario, with a Boolean field as In field)", function(assert) {

		// Arrange
		var oBindingContext = {
		    getProperty: function() {
               return false;
		    }
		};

		this.oBaseValueListProvider.oODataModel = {};
		this.oBaseValueListProvider.mInParams = {boolField: "MyBoolean"};
		sinon.stub(this.oBaseValueListProvider.oControl, "getBindingContext").returns(oBindingContext);

		// Act
		this.oBaseValueListProvider._calculateFilterInputData();

		// Assert
		assert.equal(this.oBaseValueListProvider.mFilterInputData.MyBoolean, false);
		assert.strictEqual(this.oBaseValueListProvider.aFilterField.length, 1);
		assert.strictEqual(this.oBaseValueListProvider.aFilterField[0], "MyBoolean");
	});

	QUnit.test("_calculateAndSetFilterOutputData shall skip OUT fields if data is set in Define Conditions", function(assert) {
		// Arrange
		var aData = [{"field":"value"},{"FieldTwo":"FieldTwo"}];
		this.oBaseValueListProvider.sFieldName = "field";
		this.oBaseValueListProvider.oFilterModel = {getData:sinon.stub(), setData:function(){}};
		this.oBaseValueListProvider.mOutParams = {field:"TheKey","SomeField":"FieldTwo"};
		sinon.spy(this.oBaseValueListProvider.oFilterModel, "setData");

		// Act
		this.oBaseValueListProvider._calculateAndSetFilterOutputData(aData);

		// Assert
		assert.strictEqual(this.oBaseValueListProvider.oFilterModel.setData.calledWith({}), true, "OUT Param was not set");
	});

	QUnit.test("_calculateAndSetFilterOutputData shall not invoke utcToLocal for strings", function(assert) {
		// Arrange
		var oDate = new Date("2023-05-12T23:50:21.817Z"),
			aData = [
				{
					"field1" : "invalid string",
					"field2" : oDate

				}
			],
			oUtcToLocalSpy = this.spy(DateTimeUtil, "utcToLocal");

		this.oBaseValueListProvider.sFieldName = "StartDate";
		this.oBaseValueListProvider.oFilterModel = {
			getData : sinon.stub()
		};
		this.oBaseValueListProvider.mOutParams = {
			"FieldName1" : "field1",
			"FieldName2" : "field2"
		};
		this.oBaseValueListProvider.oFilterProvider = {
			setFilterData : sinon.stub(),
			_getFieldMetadata: function() { return { "type": "Edm.DateTime"}; }
		};

		// Act
		this.oBaseValueListProvider._calculateAndSetFilterOutputData(aData);

		// Assert
		assert.ok(oUtcToLocalSpy.calledOnce, "utcToLocal should not be called with string for DateTime");
		assert.strictEqual(oUtcToLocalSpy.calledWith(oDate), true, "utcToLocal should be called only with DATE for DateTime");

		// Clean
		oUtcToLocalSpy.restore();
	});

	QUnit.test("_calculateAndSetFilterOutputData shall skip OUT fields which are not visible in filterbar", function(assert) {
		// Arrange
		var aData = [{ fieldName1: "value1", fieldName2: "value2" }];
		var oVisibleFilterItem = { getVisibleInFilterBar: this.stub().returns(true) };
		var oNotVisibleFilterItem = { getVisibleInFilterBar: this.stub().returns(false) };
		var oGetFilterItemByNameStub = this.stub();
		var oSmartFilterBar = { _getFilterItemByName: oGetFilterItemByNameStub };
		oGetFilterItemByNameStub.withArgs("visibleField").returns(oVisibleFilterItem);
		oGetFilterItemByNameStub.withArgs("notVisibleField").returns(oNotVisibleFilterItem);

		this.oBaseValueListProvider.mOutParams = { visibleField: "fieldName1", notVisibleField: "fieldName2"} ;
		this.oBaseValueListProvider.sContext = "SmartFilterBar";
		this.oBaseValueListProvider.oFilterProvider = { _oSmartFilter: oSmartFilterBar, _getFieldMetadata: this.stub()};

		var oSetFilterDataStub = this.stub(this.oBaseValueListProvider, "_setFilterData");

		// Act
		this.oBaseValueListProvider._calculateAndSetFilterOutputData(aData);

		// Assert
		var oCallArgs = oSetFilterDataStub.getCall(0).args[0];
		var aArgsKeys = Object.keys(oCallArgs);
		assert.equal(oSetFilterDataStub.callCount, 1, "_setFilterData should be called once");
		assert.ok(aArgsKeys.includes("visibleField"), "_setFilterData should be called with visibleField");
		assert.notOk(aArgsKeys.includes("notVisibleField"), "_setFilterData should be called without notVisibleField");
	});

	QUnit.test("_calculateAndSetFilterOutputData shall skip OUT fields when used in FilterPanel", function(assert) {
		// Arrange
		var aData = [{ fieldName1: "value1", fieldName2: "value2" }];

		this.oBaseValueListProvider.mOutParams = { visibleField: "fieldName1", notVisibleField: "fieldName2"};
		this.oBaseValueListProvider.sContext = "mdcFilterPanel";
		this.oBaseValueListProvider.oFilterProvider = { _getFieldMetadata: this.stub()};

		var oSetFilterDataStub = this.stub(this.oBaseValueListProvider, "_setFilterData");

		// Act
		this.oBaseValueListProvider._calculateAndSetFilterOutputData(aData);

		// Assert

		assert.equal(oSetFilterDataStub.callCount, 1, "_setFilterData should be called once");
		assert.ok(oSetFilterDataStub.calledWith({}), "_setFilterData should be called with empty object");
	});

	QUnit.test("_calculateAndSetFilterOutputData shall call setFilterData on the filterProvider", function(assert) {
		//Single-Value
		var aData = [{"field":"value"},{"SomeField":"value3"}];
		this.oBaseValueListProvider.oFilterProvider = {setFilterData:sinon.stub(), _getFieldMetadata:sinon.stub()};
		this.oBaseValueListProvider.mOutParams = {field1:"field",field2:"FieldTwo"};
		this.oBaseValueListProvider._calculateAndSetFilterOutputData(aData);
		assert.strictEqual(this.oBaseValueListProvider.oFilterProvider.setFilterData.calledOnce, true);
		assert.strictEqual(this.oBaseValueListProvider.oFilterProvider.setFilterData.calledWith({field1:{items:[{key:"value", text: "value"}], ranges:[]}}), true);

		//Multi-value
		var oData = {"field1":{items:[{key:"value2"}]},"SomeField":"value3"};
		this.oBaseValueListProvider.oFilterModel = {getData:function(){return oData;}};
		aData = [{"field":"value"}, {"field":"value1"}, {"field":"value2"},{"SomeField":"value3"}];
		this.oBaseValueListProvider.oFilterProvider.setFilterData.reset();
		this.oBaseValueListProvider._calculateAndSetFilterOutputData(aData);
		assert.strictEqual(this.oBaseValueListProvider.oFilterProvider.setFilterData.calledOnce, true);
		assert.strictEqual(this.oBaseValueListProvider.oFilterProvider.setFilterData.calledWith({field1:{items:[{key:"value2"},{key:"value1", text:"value1"},{key:"value", text:"value"}], ranges:[]}}), true);
		//Multi-value DateTime outParameter value
		var oData = {"datefield":{items:[{key:"value2"}]}};
		this.oBaseValueListProvider.oFilterProvider = {
			setFilterData:sinon.stub(),
			_getFieldMetadata:function() { return { "type": "Edm.DateTime"}; }
		};
		this.oBaseValueListProvider.oFilterModel = {getData:function(){return oData;}};
		var oDate = new Date();
		var oDateResult = DateTimeUtil.utcToLocal(oDate);

		aData = [{"datefield": oDate}];
		this.oBaseValueListProvider.mOutParams = {field1:"datefield"};

		this.oBaseValueListProvider.oFilterProvider.setFilterData.reset();
		this.oBaseValueListProvider._calculateAndSetFilterOutputData(aData);

		assert.strictEqual(this.oBaseValueListProvider.oFilterProvider.setFilterData.calledOnce, true);
		assert.strictEqual(this.oBaseValueListProvider.oFilterProvider.setFilterData.calledWith({field1:{items:[], ranges:[{
			"exclude": false,
			"operation": "EQ",
			"keyField": "field1",
			"value1": oDateResult,
			"value2": null
		}] }} ), true);
	});

	QUnit.test("_calculateAndSetFilterOutputData shall call setData on the filterModel", function(assert) {
		//Single-Value
		var aData = [{"field":"value"},{"SomeField":"value3"}];
		var oFilterModel = {getData:sinon.stub(), setData:sinon.stub()};
		this.oBaseValueListProvider.oFilterModel = oFilterModel;
		this.oBaseValueListProvider.oFilterProvider = {setFilterData:function(mFilterOutputData) { oFilterModel.setData(mFilterOutputData, true);},_getFieldMetadata:sinon.stub()};
		this.oBaseValueListProvider.mOutParams = {field1:"field",field2:"FieldTwo"};
		this.oBaseValueListProvider._calculateAndSetFilterOutputData(aData);
		assert.strictEqual(this.oBaseValueListProvider.oFilterModel.setData.calledOnce, true);
		assert.strictEqual(this.oBaseValueListProvider.oFilterModel.setData.calledWith({field1:{items:[{key:"value", text:"value"}], ranges:[]}}), true);
	});

	QUnit.test("_resolveAnnotationData adds correctly the valueListFields from the annotation to the _aCols array", function (assert) {
		var aFields = [{
				name: "CURR",
				type: "Edm.String",
				maxLength: "4",
				fieldLabel: "Currency Code",
				visible: true
			}],
			oAnnotation = {
				valueListEntitySetName: "EntityName",
				keyField: "keyField",
				valueListFields: aFields
			};

		this.oBaseValueListProvider._resolveAnnotationData(oAnnotation);

		assert.equal(this.oBaseValueListProvider._aCols[0].template, aFields[0].name, "a visible field is added to the _aCols array");

	});

	QUnit.test("_getColumnConfigFromField should create column configuration from a field metadata", function (assert) {
		// Arrange
		var oFieldStub = {
			type: "Edm.String",
			fieldLabel: "FieldLabel",
			quickInfo: "Tooltip",
			name: "Path in the model",
			sortable: true
		};

		// Act
		var oResult = this.oBaseValueListProvider._getColumnConfigFromField(oFieldStub);

		// Arrange
		assert.equal(oResult.label, oFieldStub.fieldLabel, "'label' should be equal to the 'fieldLabel' from the field");
		assert.equal(oResult.sort, oFieldStub.name, "'sort' should be equal to the 'name' if sortable is 'true' in the field");
		assert.equal(oResult.sortOrder, "Ascending", "'sortOrder' should be equal to Ascending");
		assert.equal(oResult.template, oFieldStub.name, "'template' should be equal to the 'name' from the field");
		assert.equal(oResult.tooltip, oFieldStub.quickInfo, "'tooltip' should be equal to the 'quickInfo' from the field");
		assert.equal(oResult.type, "string", "'type' should be equal to the 'string' for 'Edm.String'");
		assert.ok(parseFloat(oResult.width) >= 20, "'width' should be equal or greater than '20rem' if no min/max length is set");
	});

	QUnit.test("_getColumnConfigFromField should calculate width of a column to prevent label truncation", function (assert) {
		var oFieldStub = {
			name: "TheKey",
			type: "Edm.Boolean",
			fieldLabel: "FieldLabel with a long text",
			quickInfo: "Tooltip",
			sortable: true
		};
		var oTableUtilcalcColumnWidthSpy = this.spy(TableUtil, "calcColumnWidth");

		// Act
		this.oBaseValueListProvider._getColumnConfigFromField(oFieldStub);

		assert.equal(oTableUtilcalcColumnWidthSpy.getCall(1).args[2].truncateLabel, false, "truncateLabel property should be set to 'false'");
	});

	QUnit.test("_getColumnConfigFromField should return 'undefined' if the field and description field are the same", function (assert) {
		// Arrange
		var oFieldStub = {
			name: "DescriptionFieldName"
		};

		this.oBaseValueListProvider._aCombinedDescriptionColNames = [oFieldStub.name];

		// Act
		var vResult = this.oBaseValueListProvider._getColumnConfigFromField(oFieldStub);

		// Assert
		assert.equal(vResult, undefined, "no config should be if field is description field");
	});

	QUnit.test("_getColumnConfigFromField should return array for template if the field has description field and displayBehaviour is containing both id and description", function (assert) {
		// Arrange
		this.oBaseValueListProvider._oMetadataAnalyser = {
			getTextArrangementValue: this.stub().returns("idAndDescription"),
			getDescriptionFieldName: this.stub().returns("Desc")
		};
		var oHasTextArrangementAnnotationStub = this.stub(MetadataAnalyser, "hasTextArrangementAnnotation").returns(true);
		var oFieldStub = {
				name: "TheKey",
				type: "Edm.String",
				fieldLabel: "FieldLabel",
				quickInfo: "Tooltip",
				sortable: true
			};

		// Act
		var oResult = this.oBaseValueListProvider._getColumnConfigFromField(oFieldStub);

		// Assert
		assert.equal(oResult.template.length, 2, "template of the column should contain two entries");
		assert.equal(oResult.template[0], "TheKey", "first part of the template should be the key");
		assert.equal(oResult.template[1], "Desc", "second part of the template should be the description");

		// Cleanup
		oHasTextArrangementAnnotationStub.restore();
	});

	QUnit.test("_getColumnConfigFromField should return key field if key field exists, description field exists and displayBehaviour is idOnly or descriptionOnly", function (assert) {
		// Arrange
		var oGetDisplayBehaviourSutb = this.stub(this.oBaseValueListProvider, "_getDisplayBehaviour").returns("idOnly");
		var oFieldStub = {
				name: "TheKey",
				type: "Edm.String",
				fieldLabel: "FieldLabel",
				quickInfo: "Tooltip",
				sortable: true
			},
			oDescriptionField = {
				name: "TheDescription"
			};

		// Act
		var oResult = this.oBaseValueListProvider._getColumnConfigFromField(oFieldStub, oDescriptionField);

		// Assert
		assert.equal(oResult.template, "TheKey", "the template should be the key");

		// Arrange
		oGetDisplayBehaviourSutb.returns("descriptionOnly");

		// Act
		var oResult = this.oBaseValueListProvider._getColumnConfigFromField(oFieldStub, oDescriptionField);

		// Assert
		assert.equal(oResult.template, "TheKey", "the template should be the key");

		// Cleanup
		oGetDisplayBehaviourSutb.restore();
	});


	QUnit.test("_getColumnConfigFromField should add the IsDigitSequence to the type Contraints when the field is annotated", function (assert) {
		// Arrange
		var oGetDisplayBehaviourSutb = this.stub(this.oBaseValueListProvider, "_getDisplayBehaviour").returns("idAndDescription");
		var oFieldStub = {
				name: "TheKey",
				type: "Edm.String",
				fieldLabel: "FieldLabel",
				displayFormat: "NonNegative",
				"com.sap.vocabularies.Common.v1.IsDigitSequence": {Bool: "true"}
			};

		// Act
		var oResult = this.oBaseValueListProvider._getColumnConfigFromField(oFieldStub);

		// Assert
		assert.equal(oResult.oType.oConstraints.isDigitSequence, true, "isDigitSequence should be added in the Constraints");

		// Cleanup
		oGetDisplayBehaviourSutb.restore();
	});

	QUnit.test("simulate readData", function(assert) {

		var done = assert.async();

		var oModel = {
			read: function(sName, oObj) {
				oObj.success(oResponseData);
				fResolve();
			}
		};

		var oControl = new MultiInput();

		var oBaseValueListProvider = new BaseValueListProvider({
			title: "title",
			control: oControl,
			aggregation: "items",
			annotation: this.oAnnotation,
			model: oModel
		});

		sinon.spy(oBaseValueListProvider, "_handleRowsSelect");

		var fResolve, oPromise = new Promise(function(resolve) {
			fResolve = resolve;
		});

		var oResponseData = {
			results: []
		};

		sap.ui.require([
			"sap/ui/comp/smartfilterbar/FilterProvider"
		], function(FilterProvider) {

			oBaseValueListProvider.readData([]);

			oPromise.then(function() {

				assert.ok(oBaseValueListProvider._handleRowsSelect.calledOnce);
				oControl.destroy();
				oBaseValueListProvider.destroy();
				done();
			});
		});

	});

	QUnit.test("simulate readData with more rows received ", function(assert) {

		var done = assert.async();

		var oModel = {
			read: function(sName, oObj) {
				oObj.success(oResponseData);
				fResolve();
			}
		};

		var oControl = new MultiInput();

		var oBaseValueListProvider = new BaseValueListProvider({
			title: "title",
			control: oControl,
			aggregation: "items",
			annotation: this.oAnnotation,
			model: oModel
		});

		sinon.spy(oBaseValueListProvider, "_handleRowsSelect");
		sinon.spy(Log, "error");

		var fResolve, oPromise = new Promise(function(resolve) {
			fResolve = resolve;
		});

		var oResponseData = {
			results: [ {}, {}, {}]
		};

		sap.ui.require([
			"sap/ui/comp/smartfilterbar/FilterProvider"
		], function(FilterProvider) {

			oBaseValueListProvider.readData([{}]);

			oPromise.then(function() {
				assert.ok(Log.error.calledOnce);
				assert.ok(oBaseValueListProvider._handleRowsSelect.notCalled);
				oControl.destroy();
				oBaseValueListProvider.destroy();
				done();
			});
		});

	});

	QUnit.test("check _handleRowsSelect", function(assert) {

		var oControl = new MultiInput();
		var aTokens = [
			new Token({
				key: "",
				text: "Text0001"
			}), new Token({
				key: "0002"
			})
		];

		var oToken = new Token();
		oToken.data("range", {
			exclude: false,
			operation: "EQ",
			value1: "0003"
		});
		aTokens.push(oToken);

		oControl.setTokens(aTokens);

		var aRows = [
			{
				"TheKey": "0002",
				"Desc": "Text0002"
			}, {
				"TheKey": "0003",
				"Desc": "Text0003"
			}
		];
		var oBaseValueListProvider = new BaseValueListProvider({
			title: "title",
			control: oControl,
			aggregation: "items",
			annotation: this.oAnnotation,
			model: this.oModel,
			displayBehaviour: DisplayBehaviour.descriptionOnly
		});

		oBaseValueListProvider._handleRowsSelect(aRows);
		aTokens = oControl.getTokens();

		assert.ok(aTokens);
		assert.equal(aTokens.length, 3);
		assert.equal(aTokens[0].getKey(), "");
		assert.equal(aTokens[0].getText(), "Text0001");
		assert.equal(aTokens[1].getKey(), "0002");
		assert.equal(aTokens[1].getText(), "Text0002");
		assert.equal(aTokens[2].getKey(), "0003");
		assert.equal(aTokens[2].getText(), "Text0003");

		oControl.destroy();
		oBaseValueListProvider.destroy();

	});

	QUnit.test("_getUpdatedDataModelRows returns correct list ", function (assert) {

		var done = assert.async();

		var oControl = new MultiInput();
		oControl.setTokens([
			new Token({text: "Token 2", key: "2"})
		]);

		var oBaseValueListProvider = new BaseValueListProvider({
			title: "title",
			control: oControl,
			aggregation: "items",
			annotation: this.oAnnotation
		});
		oBaseValueListProvider.sKey = "test2";

		var aResponseData = [{test1: "1", test2: "2"}, {test1: "3"}];

		sap.ui.require([
			"sap/ui/comp/smartfilterbar/FilterProvider"
		], function (FilterProvider) {

			var aResultData = oBaseValueListProvider._getUpdatedDataModelRows(aResponseData);
			assert.equal(aResultData.length, oControl.getTokens().length);
			oControl.destroy();
			oBaseValueListProvider.destroy();
			done();
		});

	});

	QUnit.test("_adaptPropertyValue returns correct value", function (assert) {
		var sValueListFieldName = "TestField",
			sValue = "0";
		var result = this.oBaseValueListProvider._adaptPropertyValue(sValueListFieldName, sValue);
		assert.strictEqual(result, null);
	});

	QUnit.test("_onAnnotationLoad should not set annotations with 'PresentationVariantQualifier'", function (assert) {
		var oAnnotation,
			mValueList = {
				"additionalAnnotations": [
					{
						"annotation": {
							"CollectionPath": {
								"String": "C_TrdCmplncDocBlkdItemResults"
							},
							"SearchSupported": {
								"Bool": "true"
							},
							"Parameters": []
						},
						"keyField": "LegalRegulation2"
					}
				],
				"primaryValueListAnnotation": {
					"annotation": {
						"Label": {
							"String": "Legal Control Embargo Legal Regulation Value Help"
						},
						"CollectionPath": {
							"String": "I_LglCtrlEmbargoLglRglnStdVH"
						},
						"SearchSupported": {
							"Bool": "true"
						},
						"Parameters": []
					},
					"keyField": "LegalRegulation1"
				}
			},
			mValueListWithPresentationVariantQualifier = {
				"additionalAnnotationsWithPVQualifier": [
					{
						"annotation": {
							"CollectionPath": {
								"String": "C_TrdCmplncDocBlkdItemResults"
							},
							"SearchSupported": {
								"Bool": "true"
							},
							"PresentationVariantQualifier": {
								"String": "BlocksByLgl"
							},
							"Parameters": []
						},
						"keyField": "LegalRegulation3"
					}
				],
				"additionalAnnotations": [
					{
						"annotation": {
							"CollectionPath": {
								"String": "C_TrdCmplncDocBlkdItemResults"
							},
							"SearchSupported": {
								"Bool": "true"
							},
							"Parameters": []
						},
						"keyField": "LegalRegulation2"
					}
				],
				"primaryValueListAnnotationWithPVQualifier": {
					"annotation": {
						"Label": {
							"String": "Legal Control Embargo Legal Regulation Value Help"
						},
						"CollectionPath": {
							"String": "I_LglCtrlEmbargoLglRglnStdVH"
						},
						"SearchSupported": {
							"Bool": "true"
						},
						"PresentationVariantQualifier": {
							"String": "BlocksByLgl"
						},
						"Parameters": []
					},
					"keyField": "LegalRegulation1"
				}
			};

		oAnnotation = this.oBaseValueListProvider._onAnnotationLoad(mValueList);

		assert.strictEqual(this.oBaseValueListProvider.oPrimaryValueListAnnotation.keyField, "LegalRegulation1");
		assert.strictEqual(this.oBaseValueListProvider.additionalAnnotations[0].keyField, "LegalRegulation2");

		assert.strictEqual(oAnnotation.primaryValueListAnnotation.keyField, "LegalRegulation1");
		assert.strictEqual(oAnnotation.additionalAnnotations.length, 1);
		assert.strictEqual(oAnnotation.additionalAnnotations[0].keyField, "LegalRegulation2");

		oAnnotation = this.oBaseValueListProvider._onAnnotationLoad(mValueListWithPresentationVariantQualifier);

		assert.strictEqual(this.oBaseValueListProvider.oPrimaryValueListAnnotation, undefined);
		assert.strictEqual(this.oBaseValueListProvider.additionalAnnotations.length, 1);
		assert.strictEqual(this.oBaseValueListProvider.additionalAnnotations[0].keyField, "LegalRegulation2");

		assert.strictEqual(oAnnotation.primaryValueListAnnotation.keyField, "LegalRegulation1");
		assert.strictEqual(oAnnotation.additionalAnnotations.length, 2);
		assert.strictEqual(oAnnotation.additionalAnnotations[0].keyField, "LegalRegulation2");
		assert.strictEqual(oAnnotation.additionalAnnotations[1].keyField, "LegalRegulation3");
	});

	QUnit.test("_handleRowSelect do not create two tokens when field has int value", function (assert) {
		// Arrange
		var oToken = new Token({ key: "", text: "=5000"});
		oToken.data("range", {
			"exclude": false,
			"operation": "EQ",
			"keyField": "STRING_AUTO",
			"value1": 5000,
			"value2": null
		});
		var aDataModelRow = [{
			"KEY": "5000",
			"TXT": "Key 5000"
		}];
		this.oBaseValueListProvider.oControl = new MultiInput({ tokens: oToken });
		this.oBaseValueListProvider.sKey = "KEY";
		this.oBaseValueListProvider.sDescription = "TXT";
		var oSetTokensSpy = this.spy(this.oBaseValueListProvider.oControl, "setTokens");

		// Act
		this.oBaseValueListProvider._handleRowsSelect(aDataModelRow);

		// Assert
		var aSetTokensParams = oSetTokensSpy.getCall(0).args[0];
		assert.equal(aSetTokensParams.length, 1, "Only one token is added");
		assert.ok(aSetTokensParams[0].data("row"), "Token with key and description is added");
	});

	QUnit.test("_isFieldHiddenInFilterBar returns correct information if filter is not visible in filterbar", function (assert) {
		// Arrange
		var oVisibleFilterItem = { getVisibleInFilterBar: this.stub().returns(true) };
		var oNotVisibleFilterItem = { getVisibleInFilterBar: this.stub().returns(false) };
		var oGetFilterItemByNameStub = this.stub();
		var oSmartFilterBar = { _getFilterItemByName: oGetFilterItemByNameStub };
		oGetFilterItemByNameStub.withArgs("visibleFilterName").returns(oVisibleFilterItem);
		oGetFilterItemByNameStub.withArgs("notVisibleFilterName").returns(oNotVisibleFilterItem);

		// Act
		var bResult = this.oBaseValueListProvider._isFieldHiddenInFilterBar(oSmartFilterBar, "visibleFilterName");

		// Assert
		assert.notOk(bResult, "_isFieldHiddenInFilterBar should return false if the filter is visible in the filterbar");

		// Act
		bResult = this.oBaseValueListProvider._isFieldHiddenInFilterBar(oSmartFilterBar, "notVisibleFilterName");

		// Assert
		assert.ok(bResult, "_isFieldHiddenInFilterBar should return false if the filter is visible in the filterbar");
	});

	QUnit.test("_isFieldHiddenInFilterBar returns correct information if filter is not visible in filterbar (when the field is analytical parameter - eg: $Parameter", function (assert) {
		// Arrange
		var oVisibleFilterItem = { getVisibleInFilterBar: this.stub().returns(true) };
		var oNotVisibleFilterItem = { getVisibleInFilterBar: this.stub().returns(false) };
		var oGetFilterItemByNameStub = this.stub();
		var oSmartFilterBar = { _getFilterItemByName: oGetFilterItemByNameStub };

		oGetFilterItemByNameStub.withArgs("$Parameter.visibleFilterName").returns(oVisibleFilterItem);
		oGetFilterItemByNameStub.withArgs("$Parameter.notVisibleFilterName").returns(oNotVisibleFilterItem);

		// Act
		var bResult = this.oBaseValueListProvider._isFieldHiddenInFilterBar(oSmartFilterBar, "visibleFilterName");

		// Assert
		assert.notOk(bResult, "_isFieldHiddenInFilterBar should return false if the filter is visible in the filterbar");

		// Act
		bResult = this.oBaseValueListProvider._isFieldHiddenInFilterBar(oSmartFilterBar, "notVisibleFilterName");

		// Assert
		assert.ok(bResult, "_isFieldHiddenInFilterBar should return false if the filter is visible in the filterbar");
	});

	QUnit.test("_isMultiFilterField should return true for MultiInput and false for Input", function (assert) {
		// Act
		var bResult = this.oBaseValueListProvider._isMultiFilterField(new MultiInput());

		// Assert
		assert.ok(bResult, "_isMultiFilterField return true for MultiInput");

		// Act
		bResult = this.oBaseValueListProvider._isMultiFilterField(new Input());

		// Assert
		assert.notOk(bResult, "_isMultiFilterField return false for Input");
	});

	QUnit.test("_getDisplayBehaviour should return proper display behaviour based on single or multiple field", function (assert) {
		// Arrange
		var oIsMultiFilterFieldStub = this.stub(this.oBaseValueListProvider, "_isMultiFilterField").returns(true);
		this.oBaseValueListProvider.sTokenDisplayBehaviour = "multiInputDisplayBehaviour";
		this.oBaseValueListProvider.sSingleFieldDisplayBehaviour = "singleInputDisplaybehaviour";

		// Act
		var sResult = this.oBaseValueListProvider._getDisplayBehaviour();

		// Assert
		assert.equal(sResult, "multiInputDisplayBehaviour", "sTokenDisplayBehaviour property should be used when the control is MultiInput");


		// Arrange
		oIsMultiFilterFieldStub.returns(false);

		// Act
		var sResult = this.oBaseValueListProvider._getDisplayBehaviour();

		// Assert
		assert.equal(sResult, "singleInputDisplaybehaviour", "sSingleFieldDisplayBehaviour property should be used when the control is MultiInput");

		// Cleanup
		oIsMultiFilterFieldStub.restore();
	});
});
