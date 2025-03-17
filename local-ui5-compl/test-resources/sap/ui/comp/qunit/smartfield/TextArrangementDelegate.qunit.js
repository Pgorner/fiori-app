 /* globals QUnit, sinon */
sap.ui.define([
	"sap/m/Input",
	"sap/ui/comp/library",
	"sap/ui/comp/smartfield/TextArrangementDelegate",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/ODataControlFactory",
	"sap/ui/comp/smartfield/ValidationUtil",
	"sap/ui/comp/smartfield/type/TextArrangementString",
	"sap/ui/model/odata/ODataPropertyBinding",
	"sap/ui/comp/smartfield/ODataTypes",
	"sap/ui/comp/smartfield/ODataHelper",
	"sap/ui/comp/smartfield/type/TextArrangement",
	"sap/ui/comp/smartfield/type/String",
	"sap/ui/model/json/JSONModel"
], function(
	Input,
	compLibrary,
	TextArrangementDelegate,
	SmartField,
	ODataControlFactory,
	ValidationUtil,
	TextArrangementString,
	ODataPropertyBinding,
	ODataTypes,
	ODataHelper,
	TextArrangement,
	String,
	JSONModel
) {
	"use strict";
	var DisplayBehaviour = compLibrary.smartfield.DisplayBehaviour;

	QUnit.module("Text arrangement annotation utilities");

	QUnit.test("calling .getPaths() should return the corrects paths (test case 1)", function(assert) {

		// arrange
		var oMetadata = {
			annotations: {
				text: {
					entityType: {
						key: {
							propertyRef: [{
								name: "IDNavigationProperty"
							}]
						}
					},
					property: {
						typePath: "DescriptionNavigationProperty"
					},
					entitySet: {
						name: "Category"
					}
				}
			}
		};

		// act
		var mTextArrangementPaths = TextArrangementDelegate.getPaths(compLibrary.smartfield.TextInEditModeSource.NavigationProperty, oMetadata);

		// assert
		assert.strictEqual(mTextArrangementPaths.keyField, "IDNavigationProperty");
		assert.strictEqual(mTextArrangementPaths.descriptionField, "DescriptionNavigationProperty");
		assert.strictEqual(mTextArrangementPaths.entitySetName, "Category");
	});

	QUnit.test("calling .getPaths() should not throw error if NavigationProperty metadata is missing", function(assert) {

		// arrange
		var oMetadata = {annotations: {}};

		// act
		try {
			TextArrangementDelegate.getPaths(compLibrary.smartfield.TextInEditModeSource.NavigationProperty, oMetadata);
		} catch (e) {
			// If we are here - we have failed
			assert.ok(false, "calling the method directly should not throw an exception");
		}

		// If no exception is raised the test succeeds
		assert.ok(true, "No exception thrown");
	});


	QUnit.test("calling .getPaths() method should return the corrects paths (test case 2)", function(assert) {

		// arrange
		var oMetadata = {
			property: {
				valueListAnnotation: {
					keyField: "IDValueList",
					descriptionField: "DescriptionValueList"
				},
				valueListEntitySet: {
					name: "VL_Suppliers"
				}
			}
		};

		// act
		var mTextArrangementPaths = TextArrangementDelegate.getPaths(compLibrary.smartfield.TextInEditModeSource.ValueList, oMetadata);

		// assert
		assert.strictEqual(mTextArrangementPaths.keyField, "IDValueList");
		assert.strictEqual(mTextArrangementPaths.descriptionField, "DescriptionValueList");
		assert.strictEqual(mTextArrangementPaths.entitySetName, "VL_Suppliers");
	});

	QUnit.test("calling .getPaths() method should not throw error if ValueList annotation is missing", function(assert) {

		// arrange
		var oMetadata = {
			property: {
				valueListEntitySet: {
					name: "VL_Suppliers"
				}
			}
		};

		// act
		try {
			TextArrangementDelegate.getPaths(compLibrary.smartfield.TextInEditModeSource.ValueList, oMetadata);
		} catch (e) {
			// If we are here - we have failed
			assert.ok(false, "calling the method directly should not throw an exception");
		}

		// If no exception is raised the test succeeds
		assert.ok(true, "No exception thrown");
	});

	QUnit.test("calling .getPaths() method should not throw error if ValueList entity set is missing", function(assert) {

		// arrange
		var oMetadata = {
			property: {
				valueListAnnotation: {
					keyField: "IDValueList",
					descriptionField: "DescriptionValueList"
				}
			}
		};

		// act
		try {
			TextArrangementDelegate.getPaths(compLibrary.smartfield.TextInEditModeSource.ValueList, oMetadata);
		} catch (e) {
			// If we are here - we have failed
			assert.ok(false, "calling the method directly should not throw an exception");
		}

		// If no exception is raised the test succeeds
		assert.ok(true, "No exception thrown");

	});

	QUnit.test("onFetchIDAndDescriptionCollectionSuccess called after SmartField is destroyed", function (assert) {
		// Arrange
		assert.expect(1); // We expect only 1 assertion

		// Act -> call the method directly on the prototype simulating the scenario when the callback is called after
		// the SmartField control is destroyed should not throw an exception.
		try {
			TextArrangementDelegate.prototype.onFetchIDAndDescriptionCollectionSuccess();
		} catch (e) {
			// If we are here - we have failed
			assert.ok(false, "calling the method directly should not throw an exception");
		}

		// If no exception is raised the test succeeds
		assert.ok(true);
	});

	QUnit.test("bindPropertyForValueList called with no binding type should not throw an exception", function (assert) {
		// Arrange
		var oModel = new JSONModel({value:"test"}),
			oDelegate = new TextArrangementDelegate({
				_oParent: {
					getTextInEditModeSource: function () {
						return "ValueList";
					},
					_getComputedTextInEditModeSource: function () {
						return "ValueList";
					}
				},
				_getTextArrangementType: function () {}
			}),
			oInput = new Input({value: "{value}"}).setModel(oModel);

		// Empty these two methods - we are interested only in the code contained in the main method
		oInput.bindProperty = function () {}; // Does nothing
		oDelegate.getBindingInfo = function () {}; // Does nothing

		assert.expect(1); // We expect only 1 assertion

		try {
			// Call method
			oDelegate.bindPropertyForValueList("value", oInput);
		} catch (e) {
			// If we are here - we have failed
			assert.ok(false, "calling the method should not throw an exception.");
		}

		// If no exception is raised the test succeeds
		assert.ok(true);
	});

	QUnit.test("getBindingInfo with ValueListNoValidation returns object with oMetadata.path not parts", function (assert) {
		// Arrange
		var oModel = new JSONModel({value:"test"}),
			oDelegate = new TextArrangementDelegate({
				_oParent: {
					getTextInEditModeSource: function () {
						return "ValueListNoValidation";
					},
					_getComputedTextInEditModeSource: function () {
						return "ValueListNoValidation";
					},
					getBinding: function () {
						return {
							vOriginalValue : "value",
							getValue: function () {
								return "value";
							}
						};
					}
				},
				_oMetaData: {
						property: {
							valueListKeyProperty: {
								"description": "sTXT",
								"displayBehaviour": "idAndDescription",
								"name": "sID",
								"nullable": "false"
							}
						}
					},
				_oHelper: {
					getAbsolutePropertyPathToValueListEntity: function() {
						return "/test/sTXT";
					}
				}
			}),
			oInput = new Input({value: "{value}"}).setModel(oModel),
			oTextArragementFormatOptions = {
				textArrangement: "idAndDescription"
			},
			oTextArragementSettings = {
				keyField: "ID",
				descriptionField: "Text"
			},
			oType = new TextArrangementString(oTextArragementFormatOptions, null, oTextArragementSettings),
			result = {},
			oSettings = {
				type: oType,
				skipValidation: true,
				valueListNoValidation: true
			};

		sinon.stub(oInput, "bindProperty").returns(undefined);

		try {
			result = oDelegate.getBindingInfo(oSettings, true);
		} catch (e) {

			assert.ok(false, "Calling the method should not throw an exception.");
		}

		// If no exception is raised the test succeeds
		assert.strictEqual(result.hasOwnProperty("parts"), true, "When textInEditSourceMode is ValueListNoValidation result object should contain parts");
	});

	QUnit.test("getBindingInfo should create new TextArrangement binding type if the passed as parameter one is not of a 'sap.ui.comp.smartfield.type.TextArrangement' type", function (assert) {
		// Arrange
		var oDelegate,
			oResult = {},
			oHelper = sinon.createStubInstance(ODataHelper),
			oODataTypes = sinon.createStubInstance(ODataTypes),
			oFactory = sinon.createStubInstance(ODataControlFactory),
			oSmartField = sinon.createStubInstance(SmartField),
			oType = sinon.createStubInstance(String),
			oTextArrangementType = sinon.createStubInstance(TextArrangement),
			oMetaData = {
				property: {
					valueListKeyProperty: {
						"description": "sTXT",
						"displayBehaviour": "idAndDescription",
						"name": "sID",
						"nullable": "false"
					},
					valueListAnnotation: {
						keyField: "ID",
						descriptionField: "Text"
					}
				}
			},
			oSettings = {
				type: oType,
				skipValidation: true,
				valueListNoValidation: true
			};

		oSmartField.getBinding.returns({getValue: function(){}});

		oFactory._oMetaData = oMetaData;
		oFactory._oTypes = oODataTypes;
		oFactory._oParent = oSmartField;
		oFactory._oHelper = oHelper;
		oFactory._bTextInDisplayModeValueList = true;

		oTextArrangementType.isA.withArgs("sap.ui.comp.smartfield.type.TextArrangement").returns(true);

		oODataTypes.getType.returns(oTextArrangementType);

		oDelegate = new TextArrangementDelegate(oFactory);

		sinon.stub(oDelegate, "getTextAnnotationPropertyPath").returns("");

		oType.isA.withArgs("sap.ui.comp.smartfield.type.TextArrangement").returns(false);

		// Action
		oResult = oDelegate.getBindingInfo(oSettings, true);

		// Assertion
		assert.strictEqual(oResult.type.isA("sap.ui.comp.smartfield.type.TextArrangement"), true, "A new TextArrangement type has been created");

		// Clean
		oHelper = null;
		oODataTypes = null;
		oFactory = null;
		oSmartField = null;
		oType = null;
		oTextArrangementType = null;
		oResult = null;
		oSettings = null;
		oMetaData = null;
	});

	QUnit.test("No request for description should be sent if TextArrangementType/TextSeparate", function (assert) {
		// Arrange
		var oTextArrangementDelegateStub,
			oTextArrangement = DisplayBehaviour.idOnly,
			oControlFactory = {
				getMetaData: function () {
						return {
							annotations :{
								text: "test"
							}
						};
					},
				_getDisplayBehaviourConfiguration: function(){
					return oTextArrangement;
				},
				_getLocalTextAnnotation: function () {
					return "test";
				},
				fetchIDAndDescriptionCollection: function () {
				},
				onFetchIDAndDescriptionCollectionSuccess: function () {
				},
				_getInnerControlPropertyBinding: function () {
				}
			},
			oDelegate = new TextArrangementDelegate(oControlFactory);

		sinon.stub(oDelegate, 'oSmartField').value({
			_getComputedTextInEditModeSource: function () {
				return "ValueListNoValidation";
			},
			getControlFactory: function () {
				return oControlFactory;
			},
			getModel: function () {
				return {
					getProperty: function () {
						return "test";
					}
				};
			},
			getBinding: function () {
				return {
					vOriginalValue: "test1",
					getValue: function () {
						return "test";
					},
					getPath: function () {
						return {};
					}
				};
			},
			getBindingContext: function () {
				return {};
			},
			getMode: function () {
				return "display";
			},
			_isValueInitial: function () {
				return true;
			},
			_getInnerControlPropertyBinding: function () {
			}
		});

		oTextArrangementDelegateStub = sinon.stub(oDelegate, "fetchIDAndDescriptionCollection");

		// Action
		oDelegate.fetchIDAndDescriptionCollectionIfRequired({mode: oDelegate.oSmartField.getMode()});

		// Assertion
		assert.strictEqual(oTextArrangementDelegateStub.callCount, 0);

		// Arrange
		oTextArrangement = DisplayBehaviour.descriptionAndId;

		// Action
		oDelegate.fetchIDAndDescriptionCollectionIfRequired({mode: oDelegate.oSmartField.getMode()});

		// Assertion
		assert.strictEqual(oTextArrangementDelegateStub.callCount, 1);

		// Clean
		oTextArrangementDelegateStub.restore();
	});

	QUnit.test("No request for description when has Text annotation with not changed values", function (assert) {
		// Arrange
		var oTextArrangementDelegateStub,
			oControlFactory = {
				getMetaData: function () {
					return {
						annotations: {
							text: {
								path: "test"
							}
						}
					};
				},
				_getLocalTextAnnotation: function () {
					return {
						path: "test"
					};
				},
				_getDisplayBehaviourConfiguration: function(){
					return DisplayBehaviour.descriptionAndId;
				},
				fetchIDAndDescriptionCollection: function () {
				},
				onFetchIDAndDescriptionCollectionSuccess: function () {
				}
			},
			oDelegate = new TextArrangementDelegate(oControlFactory);

		sinon.stub(oDelegate, 'oSmartField').value({
			_getComputedTextInEditModeSource: function () {
				return "ValueListNoValidation";
			},
			getControlFactory: function () {
				return oControlFactory;
			},
			getModel: function () {
				return {};
			},
			_isValueInitial: function () {
				return true;
			},
			_isValueInValidation: function () {
				return true;
			},
			getMode: function () {
				return "display";
			},
			_getInnerControlPropertyBinding: function () {
			},
			getBinding: function () {
				return {};
			}
		});

		oTextArrangementDelegateStub = sinon.stub(oDelegate, "fetchIDAndDescriptionCollection");

		// Action
		oDelegate.fetchIDAndDescriptionCollectionIfRequired({mode: oDelegate.oSmartField.getMode()});

		// Assertion
		assert.strictEqual(oTextArrangementDelegateStub.callCount, 0);

		// Clean
		oTextArrangementDelegateStub.restore();
	});


	QUnit.test("Has request for description when has additional filters different from previous ones", function (assert) {
		// Arrange
		var oTextArrangementDelegateStub,
			oAdditionalFilters = {
				"CONTINENT": "Europe"
			},
			oControlFactory = {
				getMetaData: function () {
					return {
						annotations: {
							text: {
								path: "test"
							}
						}
					};
				},
				_getLocalTextAnnotation: function () {
					return {
						path: "test"
					};
				},
				_getDisplayBehaviourConfiguration: function(){
					return DisplayBehaviour.descriptionAndId;
				},
				fetchIDAndDescriptionCollection: function () {
				},
				onFetchIDAndDescriptionCollectionSuccess: function () {
				}
			},
			oDelegate = new TextArrangementDelegate(oControlFactory);

		sinon.stub(oDelegate, "getAdditionalFiltersData").returns(oAdditionalFilters);
		sinon.stub(oDelegate, "_sTextArrangementLastReadValue").value(true);
		sinon.stub(oDelegate, "_mTextArrangementLastReadAdditionalFilters").value({});

		oDelegate.oSmartField = sinon.createStubInstance(SmartField);
		oDelegate.oSmartField.getControlFactory.returns(oControlFactory);
		oDelegate.oSmartField._getComputedTextInEditModeSource.returns("ValueList");
		oDelegate.oSmartField.getModel.returns(
			{
				getProperty: function () {
					return true;
				}
			}
		);
		oDelegate.oSmartField.getBindingContext.returns({});
		oDelegate.oSmartField.getBinding.returns(
			{
				getPath: function () {
					return "dummyPath";
				}
			}
		);

		oTextArrangementDelegateStub = sinon.stub(oDelegate, "fetchIDAndDescriptionCollection");

		// Action
		oDelegate.fetchIDAndDescriptionCollectionIfRequired({mode: oDelegate.oSmartField.getMode()});

		// Assertion
		assert.strictEqual(oTextArrangementDelegateStub.callCount, 1);

		// Clean
		oTextArrangementDelegateStub.restore();
	});

	QUnit.test("Has request for description when has Text annotation with changed values", function (assert) {
		// Arrange
		var oTextArrangementDelegateStub,
			oControlFactory = {
				getMetaData: function () {
					return {
						annotations: {
							text: {
								path: "test"
							}
						}
					};
				},
				_getLocalTextAnnotation: function () {
					return {
						path: "test"
					};
				},
				_getDisplayBehaviourConfiguration: function(){
					return DisplayBehaviour.descriptionAndId;
				},
				fetchIDAndDescriptionCollection: function () {
				},
				onFetchIDAndDescriptionCollectionSuccess: function () {
				}
			},
			oDelegate = new TextArrangementDelegate(oControlFactory);

		sinon.stub(oDelegate, 'oSmartField').value({
			_getComputedTextInEditModeSource: function () {
				return "ValueListNoValidation";
			},
			getControlFactory: function () {
				return oControlFactory;
			},
			getModel: function () {
				return {
					getProperty: function () {
						return "test";
					}
				};
			},
			getBinding: function () {
				return {
					getValue: function () {
						return "test";
					},
					getPath: function () {
						return {};
					}
				};
			},
			_isValueInitial: function () {
				return false;
			},
			getBindingContext: function () {
				return {};
			},
			getMode: function () {
				return "display";
			},
			_getInnerControlPropertyBinding: function () {
			}
		});

		oTextArrangementDelegateStub = sinon.stub(oDelegate, "fetchIDAndDescriptionCollection");

		// Action
		oDelegate.fetchIDAndDescriptionCollectionIfRequired({mode: oDelegate.oSmartField.getMode()});

		// Assertion
		assert.strictEqual(oTextArrangementDelegateStub.callCount, 1);

		// Clean
		oTextArrangementDelegateStub.restore();
	});

	QUnit.test("Calculate additional filters", function (assert) {
		// Arrange
		var oAdditionalFilters,
			oEntries,
			oData = {
				"annotations": {
					"valueListData": {
						"inParams": {
							"Param1": "CODE",
							"Param2": "CONTINENT"
						},
						"keys": [
							"CODE"
						],
						"keyField": "CODE",
						"descriptionField": "NAME"
					}
				}
			},
			oInParams = oData.annotations.valueListData.inParams,
			oSelectedEntity = {"CODE": "DE","NAME": "Germany", "CONTINENT": "Europe"},
			oSmartField = sinon.createStubInstance(SmartField),
			oTextArrangementDelegate = new TextArrangementDelegate({
				getMetaData: function () {
					return {
						annotations: {
							text: {
								path: "test"
							}
						}
					};
				},
				_getDisplayBehaviourConfiguration: function(){
					return DisplayBehaviour.descriptionAndId;
				},
				fetchIDAndDescriptionCollection: function () {
				},
				onFetchIDAndDescriptionCollectionSuccess: function () {
				}
			});

		oSmartField.getBindingContext.returns({
			getProperty: function(){}
		});

		// Action
		oAdditionalFilters = oTextArrangementDelegate.getAdditionalFiltersData(oSmartField, oData, oSelectedEntity);
		oEntries = Object.entries(oAdditionalFilters);

		// Assertion
		assert.ok(oInParams.hasOwnProperty("Param2"));
		assert.strictEqual(oInParams["Param2"], "CONTINENT");
		assert.strictEqual(oEntries.length, 1);
		assert.strictEqual(oEntries[0][0], "CONTINENT");
		assert.strictEqual(oEntries[0][1], "Europe");

		// Clean
		oTextArrangementDelegate.destroy();
	});

	QUnit.test("Calculate all of the out params", function (assert) {
		// Arrange
		var fnDone = assert.async(),
			oData = {
				"annotations": {
					"valueListData": {
						"fields": [{
							"name": "CODE"
						}, {
							"name": "NAME"
						}, {
							"name": "CONTINENT"
						}],
						"outParams": {
							"Param1": "CODE",
							"Param2": "CONTINENT"
						},
						"keys": [
							"CODE"
						],
						"keyField": "CODE",
						"descriptionField": "NAME"
					}
				},
				"property": {
					"valueListAnnotation" : {
						"keyField": "CODE",
						"descriptionField": "NAME"
					}
				}
			},
			oSmartField = sinon.createStubInstance(SmartField),
			oODataControlFactory = sinon.createStubInstance(ODataControlFactory),
			oTextArrangementDelegate = new TextArrangementDelegate(oODataControlFactory);

		oODataControlFactory._bTextInDisplayModeValueList = true;

		oSmartField.getBindingContext.returns({getProperty: function(){}});
		oSmartField._getTextArrangementRead.returns({
			read: function(oModel, sPath, oDataModelReadSettings){
				// Assertion
				assert.strictEqual(oDataModelReadSettings.urlParameters["$select"], "CODE,NAME,CONTINENT");

				// Clean
				oTextArrangementDelegate.destroy();
				fnDone();

				return Promise.resolve();
			}
		});
		oSmartField.getControlFactory.returns({
			getMetaData: function(){return oData;}
		});

		sinon.stub(oTextArrangementDelegate, "oSmartField").value(oSmartField);

		// Action
		oTextArrangementDelegate.readODataModel({value: "BG", filterFields: []});


		// Clean
		oTextArrangementDelegate.destroy();
	});

	QUnit.test("onFetchIDAndDescriptionCollectionSuccess should set out parameters", function (assert) {
		// Arrange
		var fnDone = assert.async(),
			oData = {
				"results": [
					{
						"CODE": "BG",
						"NAME": "Bulgaria",
						"CONTINENT": "Europe"
					}
				]
			},
			oResultEntity = oData.results[0],
			oSmartField = sinon.createStubInstance(SmartField),
			oODataControlFactory = sinon.createStubInstance(ODataControlFactory),
			oTextArrangementDelegate = new TextArrangementDelegate(oODataControlFactory);

		oSmartField.oValidation = sinon.createStubInstance(ValidationUtil);

		sinon.stub(oTextArrangementDelegate, "oSmartField").value(oSmartField);
		oSmartField._oControl = {};
		oSmartField.getControlFactory.returns(oODataControlFactory);
		oODataControlFactory.getValueListProvider.returns({_calculateAndSetODataModelOutputData: function(oOutputData){
			// Assert
			assert.strictEqual(oOutputData.CODE, oResultEntity.CODE);
			assert.strictEqual(oOutputData.CONTINENT, oResultEntity.CONTINENT);
			assert.strictEqual(oOutputData.NAME, oResultEntity.NAME);
		}});

		// Act
		oTextArrangementDelegate.onFetchIDAndDescriptionCollectionSuccess({}, oData);

		//Clean
		oTextArrangementDelegate.destroy();
		oTextArrangementDelegate = null;
		fnDone();
	});

	QUnit.test("_setBindingPath should set Description to invalid if multiple entities correspond to a single ID", function (assert) {
		// Arrange
		var fnDone = assert.async(),
			oData = [
				{
					"__metadata": {
						"id": "odata/LanguageNameEnhanced(CODE='PL',CONTINENT='Europe')",
						"type": "ZEPM_C_SALESORDERITEMQUERY_CDS.LanguageNameEnhancedType",
						"uri": "odata/LanguageNameEnhanced(CODE='PL',CONTINENT='Europe')"
					},
					"CODE": "PL",
					"NAME": "Poland",
					"CONTINENT": "Europe"
				},
				{
					"__metadata": {
						"id": "odata/LanguageNameEnhanced(CODE='PL',CONTINENT='CentralEurope')",
						"type": "ZEPM_C_SALESORDERITEMQUERY_CDS.LanguageNameEnhancedType",
						"uri": "odata/LanguageNameEnhanced(CODE='PL',CONTINENT='CentralEurope')"
					},
					"CODE": "PL",
					"NAME": "Poland - Central Europe",
					"CONTINENT": "CentralEurope"
				}
			],
			oSmartField = sinon.createStubInstance(SmartField),
			oODataControlFactory = sinon.createStubInstance(ODataControlFactory),
			oInput = sinon.createStubInstance(Input),
			oODataPropertyBinding = sinon.createStubInstance(ODataPropertyBinding),
			oODataType = sinon.createStubInstance(TextArrangement),
			oTextArrangementDelegate = new TextArrangementDelegate(oODataControlFactory);

		oODataType.isA.returns(true);
		oODataPropertyBinding.getType.returns(oODataType);

		oODataControlFactory._oMetaData = {property: {valueListAnnotation: "ValueList"}};
		oODataControlFactory._oTypes = {getType: function(){}};
		oODataControlFactory._oHelper = {getAbsolutePropertyPathToValueListEntity: function(){}};

		oSmartField.oValidation = sinon.createStubInstance(ValidationUtil);
		oSmartField.getModel.returns({});
		oSmartField.getBinding.returns(oODataPropertyBinding);
		oSmartField._getComputedTextInEditModeSource.returns("ValueList");

		oInput.getBinding.returns(oODataPropertyBinding);

		sinon.stub(oTextArrangementDelegate, "oSmartField").value(oSmartField);
		sinon.stub(oTextArrangementDelegate, "getTextAnnotationPropertyPath").returns("/LanguageName('BG')/NAME");

		// Act
		oTextArrangementDelegate._setBindingPath(oSmartField, oData, "value", oInput);

		// Assert
		assert.ok(oODataType.setDescriptionIsInvalid.calledWith(false), "The Description was set to valid");
		assert.ok(oODataType.setDescriptionIsInvalid.calledWith(true), "The Description was set to invalid");
		assert.ok(oODataPropertyBinding.refresh.calledWith(true), "The binding is refreshed");

		//Clean
		oTextArrangementDelegate.destroy();
		oTextArrangementDelegate = null;
		fnDone();
	});

	QUnit.test("_setBindingPath should set Description to invalid if multiple entities correspond to a single ID and no binding available", function (assert) {
		// Arrange
		var fnDone = assert.async(),
			oData = [
				{
					"__metadata": {
						"id": "odata/LanguageNameEnhanced(CODE='PL',CONTINENT='Europe')",
						"type": "ZEPM_C_SALESORDERITEMQUERY_CDS.LanguageNameEnhancedType",
						"uri": "odata/LanguageNameEnhanced(CODE='PL',CONTINENT='Europe')"
					},
					"CODE": "PL",
					"NAME": "Poland",
					"CONTINENT": "Europe"
				},
				{
					"__metadata": {
						"id": "odata/LanguageNameEnhanced(CODE='PL',CONTINENT='CentralEurope')",
						"type": "ZEPM_C_SALESORDERITEMQUERY_CDS.LanguageNameEnhancedType",
						"uri": "odata/LanguageNameEnhanced(CODE='PL',CONTINENT='CentralEurope')"
					},
					"CODE": "PL",
					"NAME": "Poland - Central Europe",
					"CONTINENT": "CentralEurope"
				}
			],
			oSmartField = sinon.createStubInstance(SmartField),
			oODataControlFactory = sinon.createStubInstance(ODataControlFactory),
			oInput = sinon.createStubInstance(Input),
			oODataPropertyBinding = sinon.createStubInstance(ODataPropertyBinding),
			oODataType = sinon.createStubInstance(TextArrangement),
			oTextArrangementDelegate = new TextArrangementDelegate(oODataControlFactory),
			oSettings = {
				type: oODataType,
				skipValidation: true,
				valueListNoValidation: true
			};

		oODataType.isA.returns(true);
		oODataPropertyBinding.getType.returns(oODataType);

		oODataControlFactory._oMetaData = {property: {valueListAnnotation: "ValueList"}};
		oODataControlFactory._oTypes = {getType: function(){}};
		oODataControlFactory._oHelper = {getAbsolutePropertyPathToValueListEntity: function(){}};

		oSmartField.oValidation = sinon.createStubInstance(ValidationUtil);
		oSmartField.getModel.returns({});
		oSmartField.getBinding.returns(undefined);
		oSmartField.getBindingInfo.returns(oSettings);
		oSmartField._getComputedTextInEditModeSource.returns("ValueList");

		oInput.getBinding.returns(undefined);
		oInput.getBindingInfo.returns(oSettings);

		sinon.stub(oTextArrangementDelegate, "oSmartField").value(oSmartField);
		sinon.stub(oTextArrangementDelegate, "getTextAnnotationPropertyPath").returns("/LanguageName('BG')/NAME");

		// Act
		oTextArrangementDelegate._setBindingPath(oSmartField, oData, "value", oInput);

		// Assert
		assert.ok(oODataType.setDescriptionIsInvalid.calledWith(false), "The Description was set to valid");
		assert.ok(oODataType.setDescriptionIsInvalid.calledWith(true), "The Description was set to invalid");

		//Clean
		oTextArrangementDelegate.destroy();
		oTextArrangementDelegate = null;
		fnDone();
	});

	QUnit.test("onFetchIDAndDescriptionCollectionSuccess should be called in case of SuppressEmptyStringRequest", function (assert) {
		// Arrange
		var fnDone = assert.async(),
			oData = {
				"annotations": {
					"valueListData": {
						"fields": [{
							"name": "CODE"
						}, {
							"name": "NAME"
						}, {
							"name": "CONTINENT"
						}],
						"outParams": {
							"Param1": "CODE",
							"Param2": "CONTINENT"
						},
						"keys": [
							"CODE"
						],
						"keyField": "CODE",
						"descriptionField": "NAME"
					}
				},
				"property": {
					"valueListAnnotation" : {
						"keyField": "CODE",
						"descriptionField": "NAME"
					}
				}
			},
			oSettings = {
				filterFields: [],
				initialRendering: true,
				mode: "edit",
				success: null,
				updateBusyIndicator: false,
				value: ""
			},
			oSmartField = sinon.createStubInstance(SmartField),
			oODataControlFactory = sinon.createStubInstance(ODataControlFactory),
			oTextArrangementDelegate = new TextArrangementDelegate(oODataControlFactory),
			oInput = sinon.createStubInstance(Input);

		sinon.spy(oTextArrangementDelegate, "onFetchIDAndDescriptionCollectionSuccess");
		oSmartField._oControl = ({edit: oInput});
		oODataControlFactory._bTextInDisplayModeValueList = true;
		oODataControlFactory.isEmptyStringSignificant.returns(true);
		oSmartField.getSuppressEmptyStringRequest.returns(true);
		oSmartField.getBindingContext.returns({getProperty: function(){}});
		oSmartField._getTextArrangementRead.returns({read: function(){return Promise.resolve();}});
		oSmartField.getControlFactory.returns({
			getMetaData: function(){return oData;},
			getValueListProvider: function(){}
		});
		sinon.stub(oTextArrangementDelegate, "oSmartField").value(oSmartField);

		// Action
		oTextArrangementDelegate.readODataModel({value: "", filterFields: [], mode: "edit", initialRendering: true, updateBusyIndicator: false})
		.then(function(){
			// Clean
			oTextArrangementDelegate.destroy();

			fnDone();
		});

		// Assertion
		assert.ok(oTextArrangementDelegate.onFetchIDAndDescriptionCollectionSuccess.calledOnce, "onFetchIDAndDescriptionCollectionSuccess is called in case of SuppressEmptyStringRequest");
		assert.ok(oTextArrangementDelegate.onFetchIDAndDescriptionCollectionSuccess.calledWith(oSettings, {results: []}), "onFetchIDAndDescriptionCollectionSuccess is called with correct arguments");
	});

	QUnit.test("readODataModel should return Promise", function (assert) {
		// Arrange
		var fnDone = assert.async(),
			oData = {
				"annotations": {
					"valueListData": {
						"fields": [{
							"name": "CODE"
						}, {
							"name": "NAME"
						}, {
							"name": "CONTINENT"
						}],
						"outParams": {
							"Param1": "CODE",
							"Param2": "CONTINENT"
						},
						"keys": [
							"CODE"
						],
						"keyField": "CODE",
						"descriptionField": "NAME"
					}
				},
				"property": {
					"valueListAnnotation" : {
						"keyField": "CODE",
						"descriptionField": "NAME"
					}
				}
			},
			oSmartField = sinon.createStubInstance(SmartField),
			oODataControlFactory = sinon.createStubInstance(ODataControlFactory),
			oTextArrangementDelegate = new TextArrangementDelegate(oODataControlFactory);

		oODataControlFactory._bTextInDisplayModeValueList = true;

		oSmartField.getBindingContext.returns({getProperty: function(){}});
		oSmartField._getTextArrangementRead.returns({read: function(){return Promise.resolve();}});
		oSmartField.getControlFactory.returns({
			getMetaData: function(){return oData;}
		});

		sinon.stub(oTextArrangementDelegate, "oSmartField").value(oSmartField);

		// Action
		var oPromise = oTextArrangementDelegate.readODataModel({value: "BG", filterFields: []}).then(function(){
			// Clean
			oTextArrangementDelegate.destroy();

			fnDone();
		});

		// Assertion
		assert.ok(oPromise instanceof Promise, "TextArrangementDelegate.readODataModel is returning Promise instance.");
	});

	QUnit.test("fetchIDAndDescriptionCollection should turn on/off the busy indicator", function (assert) {
		// Arrange
		var fnDone = assert.async(),
			oData = {
				"annotations": {
					"valueListData": {
						"fields": [{
							"name": "CODE"
						}, {
							"name": "NAME"
						}, {
							"name": "CONTINENT"
						}],
						"outParams": {
							"Param1": "CODE",
							"Param2": "CONTINENT"
						},
						"keys": [
							"CODE"
						],
						"keyField": "CODE",
						"descriptionField": "NAME"
					}
				},
				"property": {
					"valueListAnnotation" : {
						"keyField": "CODE",
						"descriptionField": "NAME"
					}
				}
			},
			oInput = sinon.createStubInstance(Input),
			oSmartField = sinon.createStubInstance(SmartField),
			oODataControlFactory = sinon.createStubInstance(ODataControlFactory),
			oTextArrangementDelegate = new TextArrangementDelegate(oODataControlFactory);

		oODataControlFactory._bTextInDisplayModeValueList = true;

		oSmartField.getBindingContext.returns({getProperty: function(){}});
		oSmartField._getTextArrangementRead.returns({read: function(){return Promise.resolve();}});
		oSmartField._oControl = ({edit: oInput});
		oSmartField._getTextArrangementRead.returns({read: function(){return Promise.resolve();}});
		oSmartField.getControlFactory.returns({
			getMetaData: function(){return oData;}
		});

		sinon.stub(oTextArrangementDelegate, "oSmartField").value(oSmartField);

		// Action
		oTextArrangementDelegate.fetchIDAndDescriptionCollection({value: "dummy", updateBusyIndicator: true}).then(function(){
			var aSetBusyCalls = oInput.setBusy.getCalls();

			// Assertion
			assert.strictEqual(aSetBusyCalls.length, 2, "Busy indicator was called twice.");
			assert.strictEqual(aSetBusyCalls[0].args[0], true, "Busy indicator was firstly turned on.");
			assert.strictEqual(aSetBusyCalls[1].args[0], false, "Busy indicator was then turned off.");

			// Clean
			oTextArrangementDelegate.destroy();
			fnDone();
		});
	});
});
