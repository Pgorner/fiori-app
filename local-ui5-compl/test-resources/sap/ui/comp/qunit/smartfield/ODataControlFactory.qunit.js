/* global QUnit, sinon */
sap.ui.define([
	"sap/base/i18n/Localization",
	"sap/ui/core/library",
	"sap/ui/comp/library",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/ODataControlFactory",
	"sap/ui/comp/smartfield/ODataControlSelector",
	"sap/ui/comp/navpopover/SmartLink",
	"sap/m/Select",
	"sap/m/ComboBox",
	"sap/m/HBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/ODataMetaModel",
	"test-resources/sap/ui/comp/qunit/smartfield/QUnitHelper",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/Element",
	"sap/m/Input",
	"sap/m/library",
	"sap/m/CheckBox",
	"sap/m/Link",
	"sap/m/Text",
	"sap/m/TimePicker",
	"sap/ui/model/odata/type/DateTimeWithTimezone",
	"sap/m/ExpandableText",
	"sap/ui/model/odata/type/String",
	"test-resources/sap/ui/comp/qunit/smartfield/data/TestModel.data",
	"test-resources/sap/ui/comp/qunit/smartfield/data/ValueHelpModel.data",
	"test-resources/sap/ui/comp/qunit/smartfield/data/ComplexTestModel.data",
	"sap/base/util/includes",
	"sap/ui/core/CustomData",
	"sap/ui/base/Event",
	"sap/ui/base/SyncPromise",
	"sap/base/Log",
	"sap/ui/thirdparty/jquery",
	"sap/ui/comp/odata/ODataModelUtilSync",
	"sap/base/strings/whitespaceReplacer",
	"sap/ui/comp/providers/ValueListProvider",
	"sap/ui/comp/providers/ValueHelpProvider",
	"sap/ui/comp/smartfield/TextArrangementDelegate"
], function(Localization, coreLibrary, library, SmartField, ODataControlFactory, ODataControlSelector, SmartLink, Select, ComboBox, HBox, JSONModel, ODataMetaModel, QUnitHelper, ODataModel, Element, Input, mobileLibrary, CheckBox, Link, Text, TimePicker, DateTimeWithTimezone, ExpandableText, StringType, TestModelTestData, ValueHelpModelTestData, ComplexTestModelTestData, includes, CustomData, Event, SyncPromise, Log, jQuery, ODataModelUtilSync, whitespaceReplacer, ValueListProvider, ValueHelpProvider, TextArrangementDelegate) {
	"use strict";

	// shortcut for sap.m.InputType
	var InputType = mobileLibrary.InputType;

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

	// shortcut for sap.ui.comp.smartfield.TextInEditModeSource
	var TextInEditModeSource = library.smartfield.TextInEditModeSource;

	// shortcut for sap.m.EmptyIndicatorMode
	var EmptyIndicatorMode = mobileLibrary.EmptyIndicatorMode;

	var oV4Helper = QUnitHelper;
	var fCreateSmartFieldStub = function(oModel) {
		var oSmartField = sinon.createStubInstance(SmartField);

		oSmartField._getComputedTextInEditModeSource.returns(TextInEditModeSource.ValueList);
		oSmartField.oValidation = {
			addValidationToType: function () {},
			handleComboValidation: function () {}
		};

		oSmartField.setModel(oModel);
		return oSmartField;
	};

	var getObject1 = function(oModel, sArrayName, sQualifiedName, bAsPath) {
		var vResult = bAsPath ? undefined : null, iSeparatorPos, sNamespace, sName,oMetaData;

		sQualifiedName = sQualifiedName || "";
		iSeparatorPos = sQualifiedName.lastIndexOf(".");
		sNamespace = sQualifiedName.slice(0, iSeparatorPos);
		sName = sQualifiedName.slice(iSeparatorPos + 1);
		oMetaData = oModel.getServiceMetadata();

		jQuery.each(oMetaData.dataServices.schema || [], function(i, oSchema) {
			if (oSchema.namespace === sNamespace) {
				jQuery.each(oSchema[sArrayName] || [], function(j, oThing) {
					if (oThing.name === sName) {
						vResult = bAsPath ? oThing.$path : oThing;
						return false; // break
					}
				});
				return false; // break
			}
		});

		return vResult;
	};

	var findIndex = function(aArray, vExpectedPropertyValue, sPropertyName) {
		var iIndex = -1;

		sPropertyName = sPropertyName || "name";
		jQuery.each(aArray || [], function(i, oObject) {
			if (oObject[sPropertyName] === vExpectedPropertyValue) {
				iIndex = i;
				return false; // break
			}
		});

		return iIndex;
	};

	var findObject = function(aArray, vExpectedPropertyValue, sPropertyName) {
		var iIndex = findIndex(aArray, vExpectedPropertyValue, sPropertyName);

		return iIndex < 0 ? null : aArray[iIndex];
	};

	var createMetaModel = function(oData,oModel) {
		var oStub = sinon.createStubInstance(ODataMetaModel);
		oStub.oModel = new JSONModel(oData);
		oStub.oData = oData;
		oStub.getObject = function(sPath) {
			var oNode, aParts = sPath.split("/"), iIndex = 0;
			if (!aParts[0]) {
				// absolute path starting with slash
				oNode = this.oData;
				iIndex++;
			}
			while (oNode && aParts[iIndex]) {
				oNode = oNode[aParts[iIndex]];
				iIndex++;
			}
			return oNode;
		};
		oStub.getODataEntityContainer = function(bAsPath) {
			var vResult = bAsPath ? undefined : null;

			jQuery.each(oData.dataServices.schema || [], function(i, oSchema) {
				var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

				if (j >= 0) {
					vResult = bAsPath ? "/dataServices/schema/" + i + "/entityContainer/" + j : oSchema.entityContainer[j];
					return false; //break
				}
			});

			return vResult;
		};
		oStub.getODataEntitySet = function(sName, bAsPath) {
			var k, oEntityContainer = this.getODataEntityContainer(), vResult = bAsPath ? undefined : null;

			if (oEntityContainer) {
				k = findIndex(oEntityContainer.entitySet, sName);
				if (k >= 0) {
					vResult = bAsPath ? oEntityContainer.$path + "/entitySet/" + k : oEntityContainer.entitySet[k];
				}
			}

			return vResult;
		};
		oStub.getODataEntityType = function(sQualifiedName, bAsPath) {
			return getObject1(oModel, "entityType", sQualifiedName, bAsPath);
		};
		oStub.getODataProperty = function(oType, vName, bAsPath) {
			var i, aParts = Array.isArray(vName) ? vName : [
				vName
			], oProperty = null, sPropertyPath;

			while (oType && aParts.length) {
				i = findIndex(oType.property, aParts[0]);
				if (i < 0) {
					break;
				}

				aParts.shift();
				oProperty = oType.property[i];
				sPropertyPath = oType.$path + "/property/" + i;

				if (aParts.length) {
					// go to complex type in order to allow drill-down
					oType = this.getODataComplexType(oProperty.type);
				}
			}

			return bAsPath ? sPropertyPath : oProperty;
		};
		oStub.getProperty = function(sPath) {
			return this.getObject(sPath);
		};
		oStub.getODataComplexType = function(sQualifiedName, bAsPath) {
			return getObject1(oModel, "complexType", sQualifiedName, bAsPath);
		};
		oStub.getODataAssociationSetEnd = function(oEntityType, sName) {
			var oAssociationSet, oAssociationSetEnd = null, oEntityContainer = this.getODataEntityContainer(), oNavigationProperty = oEntityType ? findObject(oEntityType.navigationProperty, sName) : null;

			if (oEntityContainer && oNavigationProperty) {
				oAssociationSet = findObject(oEntityContainer.associationSet, oNavigationProperty.relationship, "association");
				oAssociationSetEnd = oAssociationSet ? findObject(oAssociationSet.end, oNavigationProperty.toRole, "role") : null;
			}

			return oAssociationSetEnd;
		};
		oStub.loaded = function() {
			return Promise.resolve();
		};
		return oStub;
	};

	var setUpModel = function(oData) {
		var oDataClone = JSON.parse(JSON.stringify(oData));
		var oModel = sinon.createStubInstance(ODataModel);

		oModel.oMetadata = {
			bLoaded: true
		};
		oModel.oAnnotations = {};
		oModel.getServiceMetadata = function() {
			return oDataClone;
		};
		var oMetaModel = createMetaModel(oDataClone, oModel);

		oV4Helper.liftSchema(oMetaModel.oData,oMetaModel);

		oModel.getMetaModel = function() { return oMetaModel; };

		return oModel;
	};


	QUnit.module("sap.ui.comp.smartfield.ODataControlFactory", {
		beforeEach: function() {
			this.oModel = setUpModel(TestModelTestData.TestModel);
			this.oVHModel = setUpModel(ValueHelpModelTestData);
			this.oComplexModel = setUpModel(ComplexTestModelTestData);
		},
		afterEach: function() {
			this.oModel.destroy();
			this.oVHModel.destroy();
			this.oComplexModel.destroy();
		}
	});

	/**
	 * @deprecated As of version 1.117
	 */
	QUnit.test("check auto Expand", function(assert) {
		var oFactory, oParent, bCalled, oBinding;
		oParent = fCreateSmartFieldStub(this.oModel);
		bCalled = false;

		oParent.bindElement = function(element) {
			oBinding = element;
		};

		var oObject = {};
		oObject.__metadata = {
			created: true
		};

		var oCtx = {};

		oCtx.getObject = function() {
			return oObject;
		};
		oCtx.getPath = function(){
			return this.sPath;
		};

		/* Check not called when property expandNavigationProperties is false */

		//spy if this is called during the init
		var getAutoExpandProperties = function(oMetadataProperty) {
			bCalled = true;
			return "to_Navi";
		};

		var oName = {
			entitySet: "Project",
			path: "Name"
		};

		oParent.getBindingContext = function() {
			return oCtx;
		};

		oFactory = new ODataControlFactory(this.oModel, oParent, oName);
		oFactory._oHelper.getAutoExpandProperties = getAutoExpandProperties;
		oFactory._init(oFactory._oMeta);
		assert.strictEqual(bCalled, false, "For the default property value expandNavigationProperties = false of a smart field, the calculation of navigation properties is not performed");

		//clean
		oFactory.destroy();
		bCalled = false;

		/* Check not called when entity is not persited but property expandNavigationProperties is true */

		oParent.getExpandNavigationProperties = function() {
			return true;
		};

		oFactory = new ODataControlFactory(this.oModel, oParent, oName);
		oFactory._oHelper.getAutoExpandProperties = getAutoExpandProperties;
		oFactory._init(oFactory._oMeta);
		assert.strictEqual(bCalled, false, "Even when allowing autoexpand this is not performed in case the curresponding object is just created and not persited yet");

		//clean
		oFactory.destroy();
		bCalled = false;

		/* Now let object be persisted and autoExpandProperties be true => Assumption autoExpanding will be called */

		oObject.__metadata.created = false;
		oParent.getBindingContext = function() {
			return oCtx;
		};

		oFactory = new ODataControlFactory(this.oModel, oParent, oName);

		oFactory._oHelper.getAutoExpandProperties = getAutoExpandProperties;
		oFactory._init(oFactory._oMeta);
		assert.strictEqual(bCalled, true, "Only when auto expand is switchen on and the object is not new, then the auto expand feature is called");
		assert.ok(oBinding, "The element binding is applied");
		assert.strictEqual(oBinding.path, "", "It has been applied with an empty path");
		assert.strictEqual(oBinding.parameters.expand, "to_Navi", "It only expands what is determined from the helper");
		assert.strictEqual(oBinding.parameters.select, "to_Navi", "Also to save performance it only selects what is determined from the helper");

		oFactory.destroy();
	});

	QUnit.test("Shall be instantiable", function(assert) {

		// system under test
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		// assert
		assert.ok(oFactory);
		var oMeta = oFactory.getMetaData();
		assert.ok(oMeta);

		// cleanup
		oFactory.destroy();
	});

	QUnit.test("Shall not reinitialise if there are no changes in the MetaData", function(assert) {
		// Arrange
		var oMetaData = {
				"entitySet": "Project",
				"path": "Amount"
			},
			oParent = fCreateSmartFieldStub(this.oModel),
			oFactory = new ODataControlFactory(this.oModel, oParent, oMetaData);

		oFactory._oMetaData = {
			"annotations": {},
			"path": "Amount",
			"entitySet": {
				"name": "Project",
				"entityType": "ZMEY_SRV.Project_Type"
			},
			"property": {
				"property": {
					"name": "Amount"
				},
				"typePath": "Amount",
				"valueListAnnotation": {"dummy": "dummy"},
				"valueListKeyProperty": {"dummy": "dummy"},
				"valueListEntitySet": {"dummy": "dummy"},
				"valueListEntityType": {"dummy": "dummy"}
			}
		};

		// Act
		oFactory._init(oMetaData);

		// Assert
		// The present value list related metadata should not be deleted
		assert.notStrictEqual(oFactory._oMetaData.property.valueListAnnotation, null);
		assert.notStrictEqual(oFactory._oMetaData.property.valueListKeyProperty, null);
		assert.notStrictEqual(oFactory._oMetaData.property.valueListEntitySet, null);
		assert.notStrictEqual(oFactory._oMetaData.property.valueListEntityType, null);

		// Cleanup
		oFactory.destroy();
	});

	QUnit.test("Shall be instantiable with invalid property name", function(assert) {

		// system under test
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "DescriptionInvalid"
		});

		// act
		oFactory._init(oFactory._oMeta);

		// assert
		assert.ok(oFactory);

		// cleanup
		oFactory.destroy();
	});

	QUnit.test("Shall be instantiable without model", function(assert) {

		// system under test
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(null, oParent, {
			namespace: "Project",
			path: "Description",
			entitySetObject: {},
			entityType: {
				type: {},
				count: 0
			},
			property: {},
			annotations: {}
		});

		// act
		oFactory._init(oFactory._oMeta);

		// assert
		assert.ok(oFactory);

		// cleanup
		oFactory.destroy();
	});

	// BCP: 1880514853
	QUnit.test("it should create the inner controls synchronous if the meta model is loaded", function(assert) {

		// system under test
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getFetchValueListReadOnly.returns(false);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		// arrange
		this.oModel.bMetaModelLoaded = true; // to simulate metadata loaded
		var oSpyTriggerCreationOfControls = this.spy(oFactory, "triggerCreationOfControls");

		// act
		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			oFactory.triggerCreationOfControls();

			// assert
			assert.strictEqual(oSpyTriggerCreationOfControls.callCount, 1, "The .triggerCreationOfControls method was called");

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	// BCP: 1880534442
	/**
	 * @deprecated As of version 1.117
	 */
	QUnit.test('it should not raise an exception when the "bind" method is called and the "expandNavigationProperties"' +
		' property is set to "true"', function(assert) {

		// system under test
		var oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getExpandNavigationProperties.returns(true);
		oParent.getBindingContext.returns(undefined);
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		// act
		try {
			oFactory._init(oFactory._oMeta);
		} catch (oError) {

		// assert
			assert.ok(false);
			return;
		}

		assert.ok(true);

		// cleanup
		oFactory.destroy();
	});

	// BCP: 1880534442
	/**
	 * @deprecated As of version 1.117
	 */
	QUnit.test('it should not raise an exception when the "bind" method is called and the "expandNavigationProperties"' +
		' property is set to "true"', function(assert) {

		// system under test
		var oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getExpandNavigationProperties.returns(true);
		oParent.getBindingContext.returns({
			getObject: this.stub().returns(undefined)
		});
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});


		// act
		try {
			oFactory._init(oFactory._oMeta);
		} catch (oError) {

			// assert
			assert.ok(false);
			return;
		}

		assert.ok(true);
		assert.equal(oFactory._checkTextInDisplayModeValueList(), false, "_checkTextInDisplayModeValueList returns the correct value when having expandNavigationProperties with not initial value.");

		// cleanup
		oFactory.destroy();
	});

	QUnit.test('it should not raise an exception when the "bind" method is called and no valid entityType is provided - 1', function(assert) {

		// system under test
		var fnDone = assert.async(),
			fnSapLogErrorSpy = sinon.spy(Log, "error"),
			oModel = Object.create(this.oModel, {bMetaModelLoaded: {value: true}}),
			oParent = fCreateSmartFieldStub(oModel),
			oFactory = new ODataControlFactory(oModel, oParent, {
			entitySet: "FakeEntitySetName",
			path: "Description"
		});

		// arrange
		oParent.data.returns({configdata: {}});

		// act
		oFactory.bind(oFactory._oMeta).then(function(){
			assert.ok(fnSapLogErrorSpy.called);

			// cleanup
			Log.error.restore();
			oFactory.destroy();
			oModel = null;

			fnDone();
		});
	});

	QUnit.test('it should not raise an exception when the "bind" method is called and no valid entityType is provided - 2', function(assert) {

		// system under test
		var fnDone = assert.async(),
			fnSapLogErrorSpy = sinon.spy(Log, "error"),
			oModel = Object.create(this.oModel, {bMetaModelLoaded: {value: true}}),
			oParent = fCreateSmartFieldStub(oModel),
			oFactory = new ODataControlFactory(oModel, oParent, {
			entitySet: "FakeEntitySetName",
			path: "Description"
		});

		// act
		oFactory.bind(oFactory._oMeta).then(function(){
			assert.ok(fnSapLogErrorSpy.called);

			// cleanup
			Log.error.restore();
			oFactory.destroy();
			oModel = null;

			fnDone();
		});
	});

	QUnit.test("it should not try to initialize the inner controls after the SmartField control is destroyed", function(assert) {
		var done = assert.async();

		// system under test
		var oModel = sinon.createStubInstance(ODataModel),
			oSmartField = fCreateSmartFieldStub(oModel);

		var oFactory = new ODataControlFactory(this.oModel, oSmartField, {
			entitySet: "Project",
			path: "Description"
		});

		// arrange
		var oSpyTriggerCreationOfControls = this.spy(oFactory, "triggerCreationOfControls");
		oFactory.bind({mode: oSmartField.getMode()}).finally(function() {

			// assert
			assert.strictEqual(oSpyTriggerCreationOfControls.callCount, 0);
			done();
		});

		// act
		oSmartField.destroy();
		oFactory.destroy(); // simulate factory destruction
	});

	QUnit.test("createControl", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getMode.returns("edit");
		oParent.getAriaLabelledBy.returns("DummyLabel");
		oParent.getAriaDescribedBy.returns("DummyDescription");
		oParent.getClientSideMandatoryCheck.returns(false);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory.rebindOnCreated();
			var oControl = oFactory.createControl(oFactorySettings);

			// assert
			assert.ok(oControl);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("updateControl", function(assert) {
		var oFactory, oControl, oParent, bText = false;

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getBindingInfo = function(sProperty) {
			if (sProperty === "value") {
				return {
					parts: [
						{
							model: undefined,
							path: "StartDateTime"
						}
					]
				};
			}
		};
		oParent.data = function() {
			return {
				configdata: {
					onText: function() {
						bText = true;
					}
				}
			};
		};
		oParent.getMode.returns("display");

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings);
		oControl = oFactory._createEdmDisplay(oFactorySettings);
		oFactory.updateControl(oFactorySettings);
		assert.equal(bText, true);

		oControl.control.destroy();
		oFactory.destroy();
	});

	QUnit.test("_updateDynamicAmountInputFlexItemData - set CSS even though the base control has no layOut yet", function(assert) {
		var oControl = sinon.createStubInstance(Element),
			oParent = sinon.createStubInstance(SmartField),
			oFactory = new ODataControlFactory(this.oModel, oParent, {
				entitySet: "Project",
				path: "Description"
			});

		oFactory._updateDynamicAmountInputFlexItemData(oControl, {});
		assert.ok(oControl.setLayoutData.calledOnce, "The CSS was set.");

		oFactory.destroy();
	});

	QUnit.test("BCP: 2280052534 - min-width=0 set to measure field", function(assert) {
		var oControl = new Element(),
			oParent = new SmartField(),
			oFactory = new ODataControlFactory(this.oModel, oParent, {
				entitySet: "Project",
				path: "Description"
			});

		oFactory._updateDynamicAmountInputFlexItemData(oControl, {});
		assert.strictEqual(oControl.getLayoutData().getMinWidth(), "0");

		// Cleanup
		oFactory.destroy();
		oControl.destroy();
		oParent.destroy();
	});

	QUnit.test("_updateStaticAmountInputFlexItemData - set CSS even though the base control has no layOut yet", function(assert) {
		var oControl = sinon.createStubInstance(Element),
			oParent = sinon.createStubInstance(SmartField),
			oFactory = new ODataControlFactory(this.oModel, oParent, {
				entitySet: "Project",
				path: "Description"
			});

		oFactory._updateStaticAmountInputFlexItemData(oControl, {});
		assert.ok(oControl.setLayoutData.calledOnce, "The CSS was set.");

		oFactory.destroy();
	});

	QUnit.test("_updateStaticUOMInputFlexItemData - set CSS even though the base control has no layOut yet", function(assert) {
		var oControl = sinon.createStubInstance(Element),
			oParent = sinon.createStubInstance(SmartField),
			oFactory = new ODataControlFactory(this.oModel, oParent, {
				entitySet: "Project",
				path: "Description"
			});

		oFactory._updateStaticUOMInputFlexItemData(oControl, {});
		assert.ok(oControl.setLayoutData.calledOnce, "The CSS was set.");

		oFactory.destroy();
	});

	QUnit.test("_updateStaticUOMTextFlexItemData - set CSS even though the base control has no layOut yet", function(assert) {
		var oControl = sinon.createStubInstance(Element),
			oParent = sinon.createStubInstance(SmartField),
			oFactory = new ODataControlFactory(this.oModel, oParent, {
				entitySet: "Project",
				path: "Description"
			});

		oFactory._updateStaticUOMTextFlexItemData(oControl, {});
		assert.ok(oControl.setLayoutData.calledOnce, "The CSS was set.");

		oFactory.destroy();
	});

	QUnit.test("createControl - optional onCreate", function(assert) {

		// arrange
		var done = assert.async();
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});
		oFactory.onCreate = this.spy();
		var oFactorySettings = {mode: oParent.getMode()};

		oParent.getAriaLabelledBy.returns("DummyLabel");
		oParent.getAriaDescribedBy.returns("DummyDescription");

		oFactory.bind(oFactorySettings).finally(function() {

			// act
			var oControl = oFactory.createControl(oFactorySettings);

			// assert
			assert.strictEqual(oControl.control.getMetadata().getName(), "sap.m.HBox");
			assert.strictEqual(oFactory.onCreate.callCount, 0);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("Add annotation label to SmartField", function (assert) {
		var oParent = new SmartField();
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});
		var sTextLabel = "Label Text";
		this.stub(oFactory, "getDataProperty").returns({property: {}});
		this.stub(oFactory._oHelper.oAnnotation, "getLabel").returns(sTextLabel);
		oFactory._addLabelAndQuickInfo();
		assert.ok(oParent._sAnnotationLabel, "Smartfield has annotation label");
		assert.equal(oParent._sAnnotationLabel, sTextLabel, "Smartfield annotation label is the expected one");
	});

	QUnit.test("_addAriaLabelledBy", function(assert) {
		var oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getBindingContext.returns({
			sPath: "/Project(id1='71' id2='abcd')"
		});
		oParent.getBindingInfo.returns({
			"parts": [
				{
					model: undefined,
					path: "AmountCurrency"
				}
			]
		});
		oParent.data.returns({
			"configdata": {
				"isInnerControl": true,
				"isUOM": true
			}
		});
		oParent.getObjectBinding.returns({
			sPath: "AmountCurrency"
		});
		oParent.getAriaLabelledBy.returns([]);
		oParent.getControlContext.returns("form");

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "AmountCurrency"
		});
		oFactory._init({
			model: this.oModel,
			path: "AmountCurrency",
			entitySet: "Project"
		});
		var oControl = {
			control: new Input()
		};

		oFactory._addAriaLabelledBy(oControl);
		assert.equal(Element.getElementById(oControl.control.getAriaLabelledBy()[0]).getText(), "Currency", "ARIA label taken from sap:label");

		oControl.control.destroy();
		oFactory.destroy();
	});

	QUnit.test("_addAriaDescribedBy", function(assert) {
		var oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getBindingContext.returns("/Project(id1='71' id2='abcd')");
		oParent.getBindingInfo.returns({
			"parts": [
				{
					model: undefined,
					path: "AmountCurrency"
				}
			]
		});
		oParent.data.returns({
			"configdata": {
				"isInnerControl": true,
				"isUOM": true
			}
		});
		oParent.getObjectBinding.returns({
			sPath: "AmountCurrency"
		});
		oParent.getAriaDescribedBy.returns(["Dummy Description"]);
		oParent.getControlContext.returns("form");

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "AmountCurrency"
		});
		oFactory._init({
			model: this.oModel,
			path: "AmountCurrency",
			entitySet: "Project"
		});
		var oControl = {
			control: new Input()
		};

		oFactory._addAriaDescribedBy(oControl);
		assert.equal(oControl.control.getAriaDescribedBy()[0], "Dummy Description", "ARIA description is correct");

		oControl.control.destroy();
		oFactory.destroy();
	});

	QUnit.test("_createEdmString with default textInEditModeSource", function (assert) {

		// arrange
		var done = assert.async();
		var oParent = fCreateSmartFieldStub(this.oModel);
		oParent.data.returns("ValueList");
		oParent.isPropertyInitial.returns(true);
		oParent.getMode.returns("edit");
		oParent.getClientSideMandatoryCheck.returns(false);
		oParent._getComputedTextInEditModeSource = this.stub().returns("ValueList");
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Name"
		});
		this.spy(oFactory.oTextArrangementDelegate, "checkRequiredMetadata");
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl = oFactory._createEdmString(oFactorySettings);

				// assert
			assert.ok(oParent.data.calledWith("defaultTextInEditModeSource"));
			assert.ok(oParent.isPropertyInitial.calledWith("textInEditModeSource"));
			assert.ok(oFactory.oTextArrangementDelegate.checkRequiredMetadata.calledWith("ValueList", true));
			assert.ok(oParent._getComputedTextInEditModeSource.called);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("Test _getTextArrangementType returns only one type if multiple available", function (assert) {

		// arrange
		var done = assert.async();
		var oParent = fCreateSmartFieldStub(this.oModel);
		oParent.data.returns("ValueList");
		oParent.isPropertyInitial.returns(true);
		oParent.getMode.returns("edit");
		oParent.getClientSideMandatoryCheck.returns(false);
		oParent._getComputedTextInEditModeSource = this.stub().returns("ValueList");
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Name"
		});
		this.spy(oFactory.oTextArrangementDelegate, "checkRequiredMetadata");
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl = oFactory._createEdmString(oFactorySettings), oType,
				oReturnType1 = {id: 1}, oReturnType2 = {id: 2},
				sTypeString = "sap.ui.comp.smartfield.type.TextArrangementString",
				fnIsA = function () {
					return sTypeString;
				};
			oReturnType1.isA = fnIsA;
			oReturnType2.isA = fnIsA;

			// assert
			assert.ok(oParent.data.calledWith("defaultTextInEditModeSource"));
			assert.ok(oParent.isPropertyInitial.calledWith("textInEditModeSource"));
			assert.ok(oFactory.oTextArrangementDelegate.checkRequiredMetadata.calledWith("ValueList", true));
			assert.ok(oParent._getComputedTextInEditModeSource.called);

			// arrange
			TextArrangementDelegate.getPaths = function () {
				return {keyField: "dummyKey", descriptionField: "dummyDescription"};
			};
			oFactory._oTypes.getType = function () { return [oReturnType1, oReturnType2]; };

			// act
			oType = oFactory._getTextArrangementType();

			// assert
			assert.deepEqual(oType, oReturnType1);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmString with format-display='UpperCase'", function(assert) {

		// arrange
		var done = assert.async();
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Name"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl = oFactory._createEdmString(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof Input, true);
			assert.ok(oControl.control.hasListeners("change"));
			assert.equal(oControl.control.getType() === InputType.Password, false);
			assert.equal(oControl.control.getId(), oParent.getId() + "-input");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmString returning sap.m.Select", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			sValue;

		oParent.data.withArgs("hasValueHelpDialog").returns(false);
		oParent.data.withArgs("controlType").returns("selection");

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "selection";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});
		oParent.fireChange = function(oParam) {
			sValue = oParam.value;
		};
		oParent.getWidth.returns("");

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.annotations.valuelist = "foo";
			var oControl = oFactory._createEdmString(oFactorySettings);
			assert.equal(oControl.control instanceof Select, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-select");

			oControl.control.fireChange({
				selectedItem: {
					getKey: function() {
						return "test";
					}
				}
			});

			assert.equal(sValue, "test");

			// triggers an exception, that is "swallowed"
			// check whether test runs through
			oControl.control.fireChange({
				selectedItem: {
					getKey: function() {
						throw "test";
					}
				}
			});

			assert.equal(sValue, "test");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmString returning a comp combo box", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			sValue;

		oParent.getMode.returns("edit");
		oParent.data.withArgs("hasValueHelpDialog").returns("false");
		oParent.data.withArgs("controlType").returns("dropDownList");

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});
		oParent.fireChange = function(oParam) {
			sValue = oParam.value;
		};

		oParent.getFirstInnerControl.returns({
			setEnteredValue: false
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.annotations.valuelist = "foo";
			oFactory._oMetaData.property.property = {
				"sap:value-list": "standard"
			};

			var oControl = oFactory._createEdmString(oFactorySettings);
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.ok(oControl.control.isA("sap.ui.comp.smartfield.ComboBox"));
			assert.ok(oControl.control.getBindingInfo("realValue"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxEdit");

			oControl.control.getSelectedKey = function() {
				return "test";
			};

			oControl.control.fireChange({
				selectedItem: {
					getKey: function() {
						return "test";
					}
				}
			});

			assert.equal(sValue, "test");

			// triggers an exception, that is "swallowed"
			// check whether test runs through
			oControl.control.fireChange({
				selectedItem: {
					getKey: function() {
						throw "test";
					}
				}
			});

			assert.equal(sValue, "test");

			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmString returning a combo box in context of smart multi edit", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			sValue;
		oParent.oParent = {
			isA : function() {
				return "sap.ui.comp.smartmultiedit.Field";
			}
		};
		oParent.getMode.returns("edit");
		oParent.data.withArgs("hasValueHelpDialog").returns("false");
		oParent.data.withArgs("controlType").returns("dropDownList");

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});
		oParent.fireChange = function(oParam) {
			sValue = oParam.value;
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.annotations.valuelist = "foo";
			oFactory._oMetaData.property.property = {
				"sap:value-list": "standard"
			};

			var oControl = oFactory._createEdmString(oFactorySettings);
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.notOk(oControl.control.isA("sap.ui.comp.smartfield.ComboBox"));
			assert.ok(oControl.control.getBindingInfo("selectedKey"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxEdit");

			oControl.control.fireChange({
				selectedItem: {
					getKey: function() {
						return "test";
					}
				}
			});

			assert.equal(sValue, "test");

			// triggers an exception, that is "swallowed"
			// check whether test runs through
			oControl.control.fireChange({
				selectedItem: {
					getKey: function() {
						throw "test";
					}
				}
			});

			assert.equal(sValue, "test");

			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmString returning a combo box if fixedValueListValidationEnabled is true", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			sValue;
		oParent.getMode.returns("edit");

		oParent.getFixedValueListValidationEnabled.returns(true);
		oParent.data.withArgs("hasValueHelpDialog").returns("false");
		oParent.data.withArgs("controlType").returns("dropDownList");
		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});
		oParent.fireChange = function(oParam) {
			sValue = oParam.value;
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.annotations.valuelist = "foo";
			oFactory._oMetaData.property.property = {
				"sap:value-list": "standard"
			};

			var oControl = oFactory._createEdmString(oFactorySettings);
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.notOk(oControl.control.isA("sap.ui.comp.smartfield.ComboBox"));
			assert.ok(oControl.control.getBindingInfo("selectedKey"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxEdit");

			oControl.control.fireChange({
				selectedItem: {
					getKey: function() {
						return "test";
					}
				}
			});

			assert.equal(sValue, "test");

			// triggers an exception, that is "swallowed"
			// check whether test runs through
			oControl.control.fireChange({
				selectedItem: {
					getKey: function() {
						throw "test";
					}
				}
			});

			assert.equal(sValue, "test");

			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmString attaches change event if calendar annotation is available", function(assert) {
		// arrange
		var done = assert.async();
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Name"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.property.property = JSON.parse(JSON.stringify(oFactory._oMetaData.property.property));
			oFactory._oMetaData.property.property["com.sap.vocabularies.Common.v1.IsCalendarYear"] = true;
			var oControl = oFactory._createEdmString(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof Input, true, "Control is input.");
			assert.ok(oControl.control.hasListeners("change"), "Control has change event listener.");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmString returning a multi-line-text", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.property.property = JSON.parse(JSON.stringify(oFactory._oMetaData.property.property));
			oFactory._oMetaData.property.property["com.sap.vocabularies.UI.v1.MultiLineText"] = true;
			var oControl = oFactory._createEdmString(oFactorySettings);

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.TextArea"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-textArea");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmString attaches change event if fiscal annotation is available", function(assert) {
		// arrange
		var done = assert.async();
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Name"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.property.property = JSON.parse(JSON.stringify(oFactory._oMetaData.property.property));
			oFactory._oMetaData.property.property["com.sap.vocabularies.Common.v1.IsFiscalYear"] = true;
			var oControl = oFactory._createEdmString(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof Input, true, "Control is input.");
			assert.ok(oControl.control.hasListeners("change"), "Control has change event listener.");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay - for Edm.DateTimeOffset UTC should be always false", function(assert) {
		// Arrange
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			oControl,
			oFactory,
			oFactorySettings;

		assert.expect(1);

		oParent.data.returns({
			UTC: true, // We explicitly return UTC true
			style: "medium"
		});

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.getEdmProperty = function () {
			return {
				type: "Edm.DateTimeOffset"
			};
		};

		// Assert
		oFactory._oTypes.getType = function (oMetaModel, mOptions, mDisplayOptions) {
			assert.strictEqual(mOptions.UTC, false, "UTC flag is overridden for the Edm.DateTimeOffset type");
		};

		// Act
		oFactorySettings = {mode: oParent.getMode()};
		oFactory.bind(oFactorySettings).finally(function() {
			oControl = oFactory._createEdmDisplay(oFactorySettings);

			done();

			// Cleanup
			oParent = null;
			oControl.control.destroy();
			oFactory.destroy();
		});
	});

	QUnit.test("_createEdmDisplay - for Edm.DateTimeOffset with time zone should be type DateTimeWithTimezone", function(assert) {
		// Arrange
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			oFactory,
			oFactorySettings;

		assert.expect(7);

		oParent.data.returns({
			style: "medium"
		});

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTimeTimeZone"
		});

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.DateTimeOffset"
			}
		};
		oFactory.getEdmProperty = function () {
			return {
				type: "Edm.DateTimeOffset",
				"com.sap.vocabularies.Common.v1.Timezone":{
						Path: "Timezone"
					}
			};
		};

		// Act
		oFactorySettings = {mode: oParent.getMode()};
		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.property = {
				"property": {
					"name": "StartDateTimeTimeZone",
					"type": "Edm.DateTimeOffset",
					"nullable": "false",
					"precision": "11",
					"scale": "2",
					"com.sap.vocabularies.Common.v1.Timezone": "Timezone"
				}
			};

			var oControl = oFactory._createEdmDisplay(oFactorySettings),
			oBindingInfoText = oControl.control.getBindingInfo("text");
			// assert
			assert.equal(oControl.control instanceof Text, true);
			assert.equal(oBindingInfoText.useRawValues, true);
			assert.equal(oBindingInfoText.parts.length, 2);
			assert.equal(oBindingInfoText.parts[0].path, "StartDateTimeTimeZone");
			assert.equal(oBindingInfoText.parts[0].type.getMetadata().getName(), "sap.ui.model.odata.type.DateTimeWithTimezone");
			assert.equal(oBindingInfoText.parts[1].path, "Timezone");
			assert.equal(oBindingInfoText.parts[1].parameters.useUndefinedForUnresolved, true);


			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay - when has Timezone annotation and no EdmProperty", function(assert) {
		// Arrange
		var done = assert.async(),
			bIsErroRaised = false,
			oParent = fCreateSmartFieldStub(this.oModel),
			oFactory,
			oFactorySettings;

		oParent.data.returns({
			style: "medium"
		});

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTimeTimeZone"
		});

		oFactory.getEdmProperty = function () {
			return null;
		};

		// Act
		oFactorySettings = {mode: oParent.getMode()};
		oFactory.bind(oFactorySettings).finally(function() {

			try {
				var oControl = oFactory._createEdmDisplay(oFactorySettings);
			} catch (error) {
				bIsErroRaised = true;
			}
			// assert
			assert.notOk(bIsErroRaised, "Error was not raised");


			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay - for Edm.String with isTimezone annotation", function(assert) {
		// Arrange
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			oFactory,
			oFactorySettings;

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StringIsTimeZone"
		});

		oFactory._oMetaData = {
			path: "StringIsTimeZone",
			property: {
				type: "Edm.String"
			}
		};
		oFactory.getEdmProperty = function () {
			return {
				type: "Edm.String",
				"com.sap.vocabularies.Common.v1.IsTimezone":{
						Bool: "true"
					}
			};
		};

		// Act
		oFactorySettings = {mode: oParent.getMode()};
		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.property = {
				"property": {
					"type": "Edm.String",
					"name": "StringIsTimeZone",
					"com.sap.vocabularies.Common.v1.IsTimezone": {
						Bool: "true"
					}
				}
			};

			var oControl = oFactory._createEdmDisplay(oFactorySettings),
			oBindingInfoText = oControl.control.getBindingInfo("text");
			// assert
			assert.equal(oControl.control instanceof Text, true);
			assert.ok(oControl.type.type.isA("sap.ui.model.odata.type.DateTimeWithTimezone"));
			assert.equal(oBindingInfoText.parts.length, 2);
			assert.equal(oBindingInfoText.parts[0].value, null);
			assert.equal(oBindingInfoText.parts[1].path, "StringIsTimeZone");
			assert.equal(oBindingInfoText.type.bShowDate, false);
			assert.equal(oBindingInfoText.type.bShowTime, false);
			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmString with isTimezone annotation", function(assert) {

		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			oFactory,
			oFactorySettings;

		oParent.getMode.returns(true);
		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StringIsTimeZone"
		});

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.String"
			}
		};
		oFactory.getEdmProperty = function () {
			return {
				type: "Edm.String",
				"com.sap.vocabularies.Common.v1.IsTimezone":{
						Bool: "true"
					}
			};
		};

		// Act
		oFactorySettings = {mode: oParent.getMode()};
			oFactory.bind(oFactorySettings).finally(function() {
				var oControl = oFactory._createEdmString(oFactorySettings),
				oBindingInfoText = oControl.control.getBindingInfo("value");

				// assert
				assert.equal(oControl.control instanceof Input, true);
				assert.equal(oBindingInfoText.parts[0].path, "StringIsTimeZone");

				// cleanup
				oControl.control.destroy();
				oFactory.destroy();
				done();
			});
	});

	QUnit.test("check _createEdmString set maxLength property on inner control", function(assert) {
		// Arrange
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			oFactory,
			oFactorySettings;

		oParent.getMode.returns(true);
		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Name"
		});

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.String"
			}
		};

		// Act
		oFactorySettings = {mode: oParent.getMode()};
		oFactory.bind(oFactorySettings).finally(function() {
			// arrange
			var oControl = oFactory._createEdmString(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof Input, true);
			assert.equal(oControl.control.mProperties.maxLength, oFactory._oMetaData.property.property.maxLength);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay - for Edm.Time should apply dateFormatSettings", function(assert) {
		// Arrange
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			oControl,
			oFactory,
			oFactorySettings;

		assert.expect(1);

		oParent.data.returns({
			UTC: true, // We explicitly return UTC true
			style: "short"
		});

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.getEdmProperty = function () {
			return {
				type: "Edm.Time"
			};
		};

		// Assert
		oFactory._oTypes.getType = function (oMetaModel, mOptions, mDisplayOptions) {
			assert.strictEqual(mOptions.style, "short", "dateFormatSettings should be set Edm.eTime type");
		};

		// Act
		oFactorySettings = {mode: oParent.getMode()};
		oFactory.bind(oFactorySettings).finally(function() {
			oControl = oFactory._createEdmDisplay(oFactorySettings);

			done();

			// Cleanup
			oParent = null;
			oControl.control.destroy();
			oFactory.destroy();
		});
	});

	QUnit.test("_createEdmDisplay returning a text box", function(assert) {
		var oFactory,
			fn_CheckComboBox,
			fnCheckComboBox,
			oFactorySettings,
			done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data.withArgs("hasValueHelpDialog").returns("false");
		oParent.data.withArgs("controlType").returns("dropDownList");

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		oFactorySettings = {mode: oParent.getMode()};

		fnCheckComboBox = sinon.spy(oFactory._oSelector, "checkComboBox");
		fn_CheckComboBox = sinon.spy(oFactory._oSelector, "_checkComboBox");

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl;

			oFactory._oMetaData.annotations.valuelist = "foo";
			oControl = oFactory._createEdmDisplay(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof Text, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");
			assert.equal(oControl.control.getRenderWhitespace(), true, "renderWhitespace property of the Text control is set to true");
			assert.ok(fnCheckComboBox.notCalled);
			assert.ok(fn_CheckComboBox.notCalled);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay with fetchValueListReadOnly=false", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data.withArgs("hasValueHelpDialog").returns("false");
		oParent.data.withArgs("controlType").returns("dropDownList");
		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});
		oParent.getFetchValueListReadOnly.returns(false);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.annotations.valuelist = "foo";
			var oControl = oFactory._createEdmDisplay(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof Text, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");
			assert.equal(oControl.control.getRenderWhitespace(), true, "renderWhitespace property of the Text control is set to true");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay with fetchValueListReadOnly=false (fallback)", function(assert) {
		var done = assert.async(),
			sDisplayBehaviour = "",
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data.withArgs("hasValueHelpDialog").returns("false");
		oParent.data.withArgs("controlType").returns("dropDownList");
		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function(){
				return sDisplayBehaviour;
			}
		});
		oParent.getFetchValueListReadOnly.returns(false);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};
		oFactory._oMetaData.annotations.valuelist = "foo";

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl = oFactory._createEdmDisplay(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof Text, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");
			assert.equal(oControl.control.getRenderWhitespace(), true, "renderWhitespace property of the Text control is set to true");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay with fetchValueListReadOnly=true (fallback)", function(assert) {
		var done = assert.async(),
			sDisplayBehaviour = "",
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data.withArgs("hasValueHelpDialog").returns("false");
		oParent.data.withArgs("controlType").returns("dropDownList");
		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function(){
				return sDisplayBehaviour;
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};
		oFactory._oMetaData.annotations.valuelist = "foo";

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl = oFactory._createEdmDisplay(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof Text, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");
			assert.equal(oControl.control.getRenderWhitespace(), true, "renderWhitespace property of the Text control is set to true");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	// BCP: 1980216671
	QUnit.test("_createEdmDisplay it should invoke the .formatValue() method of the DateTime class to format the value", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oSmartField, {
			entitySet: "Task",
			path: "NetDueDate"
		});

		// arrange
		this.stub(oFactory, "getFormatSettings").callsFake(function() {
			return {
				UTC: true,
				style: "medium"
			};
		});

		var oFactorySettings = {mode: oSmartField.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {

			// oFactory._oMetaData.property = oProperty;

			// arrange
			var oControlInfo = oFactory._createEdmDisplay(oFactorySettings),
				oControl = oControlInfo.control,
				fnTextArrangementFormatter = oControl.getBindingInfo("text").formatter,
				oDateTimeType = oControlInfo.type.type,
				oDate = new Date(2019, 3, 3),
				oDateTimeFormatValueFunctionSpy = this.spy(oDateTimeType, "formatValue");

			// act
			fnTextArrangementFormatter.call(oControl, oDate, "35 Days passed");

			// assert
			assert.strictEqual(oDateTimeFormatValueFunctionSpy.callCount, 1);
			assert.ok(oDateTimeFormatValueFunctionSpy.calledWithExactly(oDate, "string"));

			// cleanup
			oControl.destroy();
			oFactory.destroy();
			done();
		}.bind(this));
	});

	QUnit.test("_checkComboBox returning an input despite text annotation", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data.withArgs("hasValueHelpDialog").returns("false");
		oParent.data.withArgs("controlType").returns("input");
		oParent.getConfiguration.returns({
			getControlType: function() {
				return "input";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.annotations.text = {};
			oFactory._oMetaData.annotations.valuelist = "foo";
			var oControl = oFactory._createEdmString(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof Input, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-input");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_checkComboBox returning a combo box for value list with fixed values", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getMode.returns("edit");
		oParent.getConfiguration.returns({
			getControlType: function() {
				return null;
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.annotations.text = {};
			oFactory._oMetaData.annotations.valuelist = "foo";
			oFactory._oMetaData.annotations.valuelistType = "fixed-values";
			var oControl = oFactory._createEdmString(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.ok(oControl.control.isA("sap.ui.comp.smartfield.ComboBox"));
			assert.ok(oControl.control.getBindingInfo("realValue"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxEdit");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_checkComboBox returning a combo box for value list with fixed values in the context of Smart multi edit", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);
		oParent.oParent = {
			isA : function() {
				return "sap.ui.comp.smartmultiedit.Field";
			}
		};
		oParent.getMode.returns("edit");

		oParent.getConfiguration.returns({
			getControlType: function() {
				return null;
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.annotations.text = {};
			oFactory._oMetaData.annotations.valuelist = "foo";
			oFactory._oMetaData.annotations.valuelistType = "fixed-values";
			var oControl = oFactory._createEdmString(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.notOk(oControl.control.isA("sap.ui.comp.smartfield.ComboBox"));
			assert.ok(oControl.control.getBindingInfo("selectedKey"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxEdit");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_checkComboBox returning a combo box for value list with fixed values if fixedValueListValidationEnabled is true", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getFixedValueListValidationEnabled.returns(true);
		oParent.getMode.returns(true);

		oParent.getConfiguration.returns({
			getControlType: function() {
				return null;
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.annotations.text = {};
			oFactory._oMetaData.annotations.valuelist = "foo";
			oFactory._oMetaData.annotations.valuelistType = "fixed-values";
			var oControl = oFactory._createEdmString(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.notOk(oControl.control.isA("sap.ui.comp.smartfield.ComboBox"));
			assert.ok(oControl.control.getBindingInfo("selectedKey"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxEdit");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_checkComboBox returning a combo box for text annotation for configuration", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getMode.returns(true);
		oParent.data.withArgs("hasValueHelpDialog").returns("false");
		oParent.data.withArgs("controlType").returns("dropDownList");

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.annotations.text = {};
			oFactory._oMetaData.annotations.valuelist = "foo";
			oFactory._oMetaData.property.valuelistType = "fixed-values";
			var oControl = oFactory._createEdmString(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.ok(oControl.control.isA("sap.ui.comp.smartfield.ComboBox"));
			assert.ok(oControl.control.getBindingInfo("realValue"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxEdit");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});

	});

	QUnit.test("_checkComboBox returning a combo box for text annotation for configuration in the context of Smart multi edit", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.oParent = {
			isA : function() {
				return "sap.ui.comp.smartmultiedit.Field";
			}
		};

		oParent.getMode.returns("edit");
		oParent.data.withArgs("hasValueHelpDialog").returns("false");
		oParent.data.withArgs("controlType").returns("dropDownList");

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.annotations.text = {};
			oFactory._oMetaData.annotations.valuelist = "foo";
			oFactory._oMetaData.property.valuelistType = "fixed-values";
			var oControl = oFactory._createEdmString(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.notOk(oControl.control.isA("sap.ui.comp.smartfield.ComboBox"));
			assert.ok(oControl.control.getBindingInfo("selectedKey"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxEdit");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});

	});

	QUnit.test("_checkComboBox returning a combo box for text annotation for configuration if fixedValueListValidationEnabled is true", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getFixedValueListValidationEnabled.returns(true);

		oParent.getMode.returns("edit");
		oParent.data.withArgs("hasValueHelpDialog").returns("false");
		oParent.data.withArgs("controlType").returns("dropDownList");

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.annotations.text = {};
			oFactory._oMetaData.annotations.valuelist = "foo";
			oFactory._oMetaData.property.valuelistType = "fixed-values";
			var oControl = oFactory._createEdmString(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.notOk(oControl.control.isA("sap.ui.comp.smartfield.ComboBox"));
			assert.ok(oControl.control.getBindingInfo("selectedKey"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxEdit");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});

	});

	QUnit.test("change event(attaching on _handleEventingForTextArrangement) is firing once on onsapleave event with opened suggestions", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			oControl,
			oFactory,
			oFactorySettings;

		oParent.getBindingContext.returns({
			getProperty: function(s) {
				return "SOME_ID";
			},
			getPath: function(){
				return this.sPath;
			}
		});

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function() {
				return null;
			}
		});

		oParent.getMode.returns("edit");
		// oFireChangeEventSpy = this.spy(oParent, "fireChange");

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});
		//With stubbing the below method checkRequiredMetadata, we are making sure
		//that the change event is attached at _handleEventingForTextArrangement
		oFactory.oTextArrangementDelegate.checkRequiredMetadata = function(){return true;};
		oFactory.oTextArrangementDelegate.getBindingInfo = function(){
			return {
				"parts": [
					{
						"path": "ID"
					}
				]
			};
		};

		oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.entityType["com.sap.vocabularies.UI.v1.TextArrangement"] = {
				EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"
			};

			// Arrange
			oControl = oFactory._createEdmString(oFactorySettings);
			oControl.control._oSuggPopover.isOpen = function () {
				return true;
			};

			//Act
			oControl.control.setShowSuggestion(true);

			// Assert
			assert.equal(oControl.control.getShowSuggestion(), true, "suggestions are enabled");


			// Arrange
			oControl.control._oSuggPopover.getItemsContainer = function() {
				return {
					getSelectedItem: function() {
						return {key:"SomeId", text: "SomeText"};
					}
				};
			};

			oParent.getFirstInnerControl.returns(oControl.control);
			oFactory._oParent = oParent;

			// Act
			//Case: 2 events are fired ->
			//one from the base control & one from the ValueListProvider._handleRowSelect
			//we supress the 1st one
			oControl.control.fireChange({validated: false});
			oControl.control.fireChange({validated: true});

			// Assert
			assert.equal(oParent.fireChange.callCount, 1, "change event fired once on selected item from suggestions");

			//Arrange
			oParent.fireChange.reset();
			oControl.control._oSuggPopover.getItemsContainer = function() {
				return {
					getSelectedItem: function() {
						return null;
					}
				};
			};

			// Act
			oControl.control.fireChange({validated: false});

			// Assert
			assert.equal(oParent.fireChange.callCount, 1, "change event fired once with value that is not contained in the suggestions");

			// Cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("change event(attaching on _handleEventingForTextArrangement) fired on invalid value provides the value without attaching the old description", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			oControl,
			oFactory,
			oFactorySettings;

		oParent.getBindingContext.returns({
			getProperty: function(s) {
				return "SOME_ID";
			},
			getPath: function(){
				return this.sPath;
			}
		});

		oParent.getMode.returns("edit");
		oParent.getValueState.returns("None");

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});
		//With stubbing the below method checkRequiredMetadata, we are making sure
		//that the change event is attached at _handleEventingForTextArrangement
		oFactory.oTextArrangementDelegate.checkRequiredMetadata = function(){return true;};
		oFactory.oTextArrangementDelegate.getBindingInfo = function(){
			return {
				"parts": [
					{
						"path": "ID"
					}
				]
			};
		};

		oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.entityType["com.sap.vocabularies.UI.v1.TextArrangement"] = {
				EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
			};

			// Arrange
			oControl = oFactory._createEdmString(oFactorySettings);
			oControl.control.getBinding = function() {
				return {
					getCurrentValues: function() {
						return ["Key"];
					},
					oType: {
						oFormatOptions: { textArrangement: "idAndDescription"}
					}
				};
			};

			oParent.getInnerControls.returns([oControl.control]);
			oParent.getFirstInnerControl.returns(oControl.control);

			oParent.fireChange = function (oEventParams) {
				assert.equal(oEventParams.newValue, "Key", "newValue contains only the input value without the old description");
				assert.equal(oEventParams.value, "Key", "value contains only the input value without the old description");
			};

			oControl.control.fireChange({validated: false, newValue: "Key (Old Description)", value: "Key (Old Description)"});

			// Cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("change event(attaching on _handleEventingForTextArrangement) fired with invalid value(including exceeded maxLength value)", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			oControl,
			oFactory,
			oFactorySettings;

		oParent.getBindingContext.returns({
			getProperty: function(s) {
				return "SOME_ID";
			},
			getPath: function(){
				return this.sPath;
			}
		});

		oParent.getMode.returns("edit");
		oParent.getValueState.returns("Error");

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});
		//With stubbing the below method checkRequiredMetadata, we are making sure
		//that the change event is attached at _handleEventingForTextArrangement
		oFactory.oTextArrangementDelegate.checkRequiredMetadata = function(){return true;};
		oFactory.oTextArrangementDelegate.getBindingInfo = function(){
			return {
				"parts": [
					{
						"path": "ID"
					}
				]
			};
		};

		oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.entityType["com.sap.vocabularies.UI.v1.TextArrangement"] = {
				EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
			};

			// Arrange
			oControl = oFactory._createEdmString(oFactorySettings);
			oControl.control.getBinding = function() {
				return {
					getCurrentValues: function() {
						return ["Key"];
					},
					oType: {
						oFormatOptions: { textArrangement: "idAndDescription"}
					}
				};
			};

			oParent.getInnerControls.returns([oControl.control]);
			oParent.getFirstInnerControl.returns(oControl.control);

			oParent.fireChange = function (oEventParams) {
				assert.equal(oEventParams.newValue, "Some Invalid Value", "newValue contains the newly entered invalid value");
				assert.equal(oEventParams.value, "Some Invalid Value", "newValue contains the newly entered invalid value");
			};

			oControl.control.fireChange({validated: false, newValue: "Some Invalid Value", value: "Some Invalid Value"});

			// Cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("check the display behaviour", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			sDisplayBehaviour = "idAndDescription",
			sValue;

		oParent.getBindingContext.returns({
			getProperty: function(s) {
				return "SOME_ID";
			},
			getPath: function(){
				return this.sPath;
			}
		});

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function() {
				return sDisplayBehaviour;
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl = oFactory._createEdmDisplay(oFactorySettings);

			assert.equal(oControl.control instanceof Text, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");

			var oTextBinding = oControl.control.getBindingInfo("text");
			assert.ok(oTextBinding);
			assert.ok(oTextBinding.formatter);

			sDisplayBehaviour = "idAndDescription";
			sValue = oTextBinding.formatter("SOME_ID", "DESCRIPTION");
			assert.equal(sValue, "SOME_ID (DESCRIPTION)");

			sDisplayBehaviour = "descriptionAndId";
			sValue = oTextBinding.formatter("SOME_ID", "DESCRIPTION");
			assert.equal(sValue, "DESCRIPTION (SOME_ID)");

			sDisplayBehaviour = "descriptionOnly";
			sValue = oTextBinding.formatter("SOME_ID", "DESCRIPTION");
			assert.equal(sValue, "DESCRIPTION");

			sDisplayBehaviour = "idOnly";
			sValue = oTextBinding.formatter("SOME_ID", "DESCRIPTION");
			assert.equal(sValue, "SOME_ID");

			sDisplayBehaviour = "idAndDescription";
			sValue = oTextBinding.formatter("SOME_ID");
			assert.equal(sValue, "SOME_ID");

			sValue = oTextBinding.formatter("");
			assert.equal(sValue, "");

			oParent.getBindingContext.returns({
				getProperty: function(s) {
					return undefined;
				},
				getPath: function(){
					return this.sPath;
				}
			});

			sDisplayBehaviour = "idAndDescription";
			sValue = oTextBinding.formatter("");
			assert.equal(sValue, "");

			oControl.control.destroy();
			oFactory.destroy();
			done();
		});

	});

	//Fix for ID: 1970217313
	QUnit.test("check if additional handler that fetches once the id and description on model context change and working properly", function (assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getMode.returns("edit");
		oParent.getTextInEditModeSource.returns(TextInEditModeSource.ValueList);

		oParent.isTextInEditModeSourceNotNone = function () {
			return true;
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});

		oFactory._oMetaData.annotations.valuelist = "ValidValue";
		var oLoadValueListAnnotationPromiseStub = sinon.stub(oFactory._oHelper, "loadValueListAnnotation").returns(Promise.resolve(true));
		var oInitValueListStub = sinon.stub(oFactory, "_initValueList");
		var oTriggerCreationOfControlsStub = sinon.stub(oFactory, "triggerCreationOfControls");
		var oCheckRequiredMetadataStub = sinon.stub(oFactory.oTextArrangementDelegate, "checkRequiredMetadata").returns(false);

		oFactory.bind({mode: oParent.getMode()}).then(function (oResult) {
			assert.ok(oResult.fetchIDAndDescription, "After .bind the id and description should be fetched once.");
		}).then(function () {
			return oFactory.bind({ bindingContextChanged: true, rebind: true });
		}).then(function (oResult) {
			assert.ok(oResult.fetchIDAndDescription, "Fetching data one more time after the modelContextChange event is fired.");
		}).finally(function () {
			//Cleanup
			oLoadValueListAnnotationPromiseStub.restore();
			oInitValueListStub.restore();
			oTriggerCreationOfControlsStub.restore();
			oCheckRequiredMetadataStub.restore();

			oFactory.destroy();
			done();
		});

	});

	QUnit.test("check the display behaviour with TextArrangement annotation", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingContext.returns({
			getProperty: function(s) {
				return "SOME_ID";
			},
			getPath: function(){
				return this.sPath;
			}
		});

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function() {
				return null;
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {

			oFactory._oMetaData.entityType["com.sap.vocabularies.UI.v1.TextArrangement"] = {
				EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"
			};

			var oControl = oFactory._createEdmDisplay(oFactorySettings);

			assert.equal(oControl.control instanceof Text, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");

			var oTextBinding = oControl.control.getBindingInfo("text");
			assert.ok(oTextBinding);
			assert.ok(oTextBinding.formatter);

			var sValue = oTextBinding.formatter("SOME_ID", "DESCRIPTION");
			assert.equal(sValue, "DESCRIPTION (SOME_ID)");

			oFactory._oMetaData.entityType["com.sap.vocabularies.UI.v1.TextArrangement"] = {
				EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
			};
			sValue = oTextBinding.formatter("SOME_ID", "DESCRIPTION");
			assert.equal(sValue, "SOME_ID (DESCRIPTION)");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("check the display behaviour with TextArrangement annotation and Control configuration", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingContext.returns({
			getProperty: function(s) {
				return "SOME_ID";
			},
			getPath: function(){
				return this.sPath;
			}
		});

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function() {
				return "idAndDescription";
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.entityType["com.sap.vocabularies.UI.v1.TextArrangement"] = {
				EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"
			};

			var oControl = oFactory._createEdmDisplay(oFactorySettings);

			assert.equal(oControl.control instanceof Text, true);

			var oTextBinding = oControl.control.getBindingInfo("text");
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");
			assert.ok(oTextBinding);
			assert.ok(oTextBinding.formatter);

			var sValue = oTextBinding.formatter("SOME_ID", "DESCRIPTION");
			assert.equal(sValue, "SOME_ID (DESCRIPTION)");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	/**
	 * @deprecated Since 1.32.0
	 */
	QUnit.test("_createEdmDisplay shall return sap.m.ObjectIdentifier", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getProposedControl.returns("ObjectIdentifier");

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl = oFactory._createEdmDisplay(oFactorySettings);
			assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectIdentifier"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-objIdentifier");
			assert.equal(oControl.control.hasListeners("titlePressed"), false);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	/**
	 * @deprecated Since 1.34.0
	 */
	QUnit.test("_createEdmDisplay shall return sap.m.ObjectIdentifier with titlePress event handler", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getControlProposal.returns({
			"getControlType": function() {
				return "ObjectIdentifier";
			}
		});

		oParent.hasListeners.withArgs("press").returns(true);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl = oFactory._createEdmDisplay(oFactorySettings);
			assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectIdentifier"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-objIdentifier");
			assert.equal(oControl.control.hasListeners("titlePress"), true);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	/**
	 * @deprecated Since 1.34.0
	 */
	QUnit.test("_createEdmUOMObjectStatus shall return sap.m.ObjectStatus", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getControlProposal.returns({
			getObjectStatus: function() {
				return {
					getCriticality: function() {
						return null;
					},
					getCriticalityRepresentationType: function() {
						return library.smartfield.CriticalityRepresentationType.WithIcon;
					},
					getBindingInfo: function() {
						return null;
					}
				};
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			oFactory._oMetaData.annotations.uom = {
				"path": "dummy"
			};

			var oControl = oFactory._createEdmUOMObjectStatus();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectStatus"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-objStatus");
			assert.ok(oControl.control && oControl.control.mBindingInfos && oControl.control.mBindingInfos.text && oControl.control.mBindingInfos.text.parts);
			assert.equal(oControl.control.mBindingInfos.text.parts.length, 3);
			assert.equal(oControl.control.mBindingInfos.text.parts[0].path, "Category");
			assert.equal(oControl.control.mBindingInfos.text.parts[0].mode, "OneWay");
			assert.equal(oControl.control.mBindingInfos.text.parts[1].path, "dummy");
			assert.equal(oControl.control.mBindingInfos.text.parts[1].mode, "OneWay");
			assert.equal(oControl.control.mBindingInfos.text.parts[2].path, "/##@@requestUnitsOfMeasure");
			assert.equal(oControl.control.mBindingInfos.text.parts[2].mode, "OneTime");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	/**
	 * @deprecated Since 1.34.0
	 */
	QUnit.test("_createProposedObjectStatus shall return sap.m.ObjectStatus(control proposed ObjectStatus)", function(assert) {
		var oFactory, oControl, oParent;

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getControlProposal.returns({
			getObjectStatus: function() {
				return {
					getCriticality: function() {
						return null;
					},
					getCriticalityRepresentationType: function() {
						return library.smartfield.CriticalityRepresentationType.WithIcon;
					},
					getBindingInfo: function() {
						return null;
					}
				};
			}
		});

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});
		oFactory.bind({mode: oParent.getMode()});

		oControl = oFactory._createProposedObjectStatus();
		assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectStatus"));
		assert.equal(oControl.control.getId(), oParent.getId() + "-objStatus");

		oControl.control.destroy();
		oFactory.destroy();
	});

	/**
	 * @deprecated Since 1.34.0
	 */
	QUnit.test("_createProposedObjectStatus shall return sap.m.ObjectStatus with criticality bound to formatter", function(assert) {
		var oFactory, oControl, oParent, oInfo;

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getControlProposal.returns({
			getObjectStatus: function() {
				return {
					getCriticality: function() {
						return 2;
					},
					getCriticalityRepresentationType: function() {
						return "WithIcon";
					},
					getBindingInfo: function() {
						return {
							formatter: function() {
								return 2;
							},
							parts: [
								"dummy"
							]
						};
					}
				};
			}
		});

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});
		oFactory.bind({mode: oParent.getMode()});

		oControl = oFactory._createProposedObjectStatus();
		assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectStatus"));
		assert.equal(oControl.control.getId(), oParent.getId() + "-objStatus");

		oInfo = oControl.control.getBindingInfo("state");
		assert.equal(oInfo.formatter(), "Warning");

		oInfo = oControl.control.getBindingInfo("icon");
		assert.equal(oInfo.formatter(), "sap-icon://alert");

		oControl.control.destroy();
		oFactory.destroy();
	});

	// BCP: 1770110922
	/**
	 * @deprecated Since 1.34.0
	 */
	QUnit.test("the formatter of the icon should return the URI to the corresponding icon when the criticality value is 0", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = fCreateSmartFieldStub(this.oModel);

		// arrange
		oSmartField.getControlProposal.returns({
			getObjectStatus: function() {
				return {
					getCriticality: function() {
						return 0;
					},
					getCriticalityRepresentationType: function() {
						return "WithIcon";
					},
					getBindingInfo: function() {
						return {
							parts: [
								"dummy"
							]
						};
					}
				};
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oSmartField, {
			entitySet: "Project",
			path: "Category"
		});

		oFactory.bind({mode: oSmartField.getMode()}).finally(function() {

			// act
			var oControl = oFactory._createProposedObjectStatus();

			// assert
			var oIconBindingInfo = oControl.control.getBindingInfo("icon");
			assert.equal(oIconBindingInfo.formatter(0), null);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	/**
	 * @deprecated Since 1.34.0
	 */
	QUnit.test("_createProposedObjectStatus shall return sap.m.ObjectStatus with criticality bound to path", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getControlProposal.returns({
			getObjectStatus: function() {
				return {
					getCriticality: function() {
						return 2;
					},
					getCriticalityRepresentationType: function() {
						return "WithIcon";
					},
					getBindingInfo: function() {
						return {
							parts: [
								"dummy"
							]
						};
					}
				};
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			var oControl = oFactory._createProposedObjectStatus();
			assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectStatus"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-objStatus");

			var oInfo = oControl.control.getBindingInfo("state");
			assert.equal(oInfo.formatter(2), "Warning");

			oInfo = oControl.control.getBindingInfo("icon");
			assert.equal(oInfo.formatter(2), "sap-icon://alert");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	/**
	 * @deprecated Since 1.34.0
	 */
	QUnit.test("_createProposedObjectStatus shall return sap.m.ObjectStatus (2)", function(assert) {
		var oFactory, oControl, oParent;

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getControlProposal.returns({
			getObjectStatus: function() {
				return {
					getCriticality: function() {
						return null;
					},
					getCriticalityRepresentationType: function() {
						return library.smartfield.CriticalityRepresentationType.WithIcon;
					},
					getBindingInfo: function() {
						return null;
					}
				};
			}
		});

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		oFactory.bind({mode: oParent.getMode()});

		oControl = oFactory._createProposedObjectStatus();
		assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectStatus"));
		assert.equal(oControl.control.getId(), oParent.getId() + "-objStatus");

		oControl.control.destroy();
		oFactory.destroy();
	});

	/**
	 * @deprecated Since 1.32.0
	 */
	QUnit.test("ODataControlSelector._isObjectStatusProposed shall return true", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getControlProposal.returns({
			getObjectStatus: function() {
				return {
					getCriticality: function() {
						return null;
					},
					getBindingInfo: function() {
						return null;
					}
				};
			},
			getControlType: function() {
				return null;
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Category"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			assert.ok(oFactory._oSelector._isObjectStatusProposed());

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("On _init LineItem Criticality annotation should be passed and applied correctly", function(assert) {
		// Arrange
		var oMetaData = {
				"entitySet": "Project",
				"path": "Name"
			},
			oParent = fCreateSmartFieldStub(this.oModel),
			oFactory = new ODataControlFactory(this.oModel, oParent, oMetaData),
			oCriticalityInfo;

		oFactory._oMetaData = {
			"path": "Name",
			"annotations": {
				"lineitem": {
					"criticality": {
						"Name": {"path": "NameCriticality", "criticalityRepresentationType": "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"}
					}
				}
			},
			"property": {
				"property": {
					"name": "Name"
				},
				"typePath": "Name"
			}
		};

		oFactory._oHelper.getAnalyzer().getLineItemAnnotation = function() {
			return {"criticality": {
				"Name": {"path": "NameCriticality", "criticalityRepresentationType": "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"}
			}};
		};
		// Act
		oFactory._init(oMetaData);
		oCriticalityInfo = oFactory._oMetaData?.property?.property.criticalityInfo;

		// Assert
		assert.ok(oCriticalityInfo, "Criticality Information is available.");
		if (oCriticalityInfo) {
			assert.strictEqual(oCriticalityInfo.path, "NameCriticality", "Criticality path is presented.");
			assert.strictEqual(oCriticalityInfo.criticalityRepresentationType, "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon", "Criticality representation tyope is presented.");
		}

		// Cleanup
		oFactory.destroy();
	});

	QUnit.test("_checkComboBox returning a combo box for config", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getMode.returns("edit");
		oParent.data.withArgs("hasValueHelpDialog").returns("false");
		oParent.data.withArgs("controlType").returns("dropDownList");
		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oHelper.getTextProperty = function() {
				return null;
			};
			oFactory._oMetaData.annotations.valuelist = "foo";
			var oControl = oFactory._createEdmString(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.ok(oControl.control.isA("sap.ui.comp.smartfield.ComboBox"));
			assert.ok(oControl.control.getBindingInfo("realValue"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-comboBoxEdit");
			assert.equal(oControl.params.getValue, "getRealValue");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_checkCheckBox", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "checkBox";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			assert.equal(oFactory._oSelector.checkCheckBox(), false);

			oFactory._oMetaData.property.property.maxLength = "1";
			assert.equal(oFactory._oSelector.checkCheckBox(), true);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmString - CheckBox", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "checkBox";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.property.property.maxLength = "1";
			var oControl = oFactory._createEdmString(oFactorySettings);
			assert.ok(oControl.control instanceof CheckBox);
			assert.equal(oControl.control.getId(), oParent.getId() + "-cBox");
			oControl.control.setSelected(true);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay - CheckBox", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "checkBox";
			},
			getDisplayBehaviour: function() {
				return null;
			}
		});
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.property.property.maxLength = "1";
			var oControl = oFactory._createEdmDisplay(oFactorySettings);
			assert.ok(oControl.control instanceof Text);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");

			var oInfo = oControl.control.getBindingInfo("text");
			var sResult = oInfo.formatter("test");
			assert.ok(sResult);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay - link", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});
		oParent.getBindingInfo.returns(null);
		oParent.getUrl.returns("www.sap.com");
		oParent.getValue.returns("VALUE");

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "AmountCurrency"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl = oFactory._createEdmDisplay(oFactorySettings);
			assert.equal(oControl.control instanceof Link, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-link");
			assert.equal(oControl.control.getHref(), "www.sap.com");
			assert.equal(oControl.control.getText(), "VALUE");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay - link with binding", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});
		oParent.getBindingInfo.withArgs("url").returns({
			"path": "dummy"
		});
		oParent.getBindingInfo.withArgs("value").returns({
			"path": "dummy"
		});

		oParent.getUrl.returns("www.sap.com");
		oParent.getUrl.returns("VALUE");

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "AmountCurrency"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl = oFactory._createEdmDisplay(oFactorySettings);
			assert.equal(oControl.control instanceof Link, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-link");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit
		.test(
				"_createEdmDisplay - link with text annotation",
				function(assert) {
					var oFactory, oParent, oControl, oMeta =
																"{\"annotations\":{\"text\":{\"property\":{\"name\":\"SupplierName\",\"type\":\"Edm.String\",\"maxLength\":\"80\",\"extensions\":[{\"name\":\"label\",\"value\":\"Name of Supplier\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Name of Supplier\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Name of Supplier\"}},\"typePath\":\"SupplierName\"},\"uom\":null,\"lineitem\":{\"annotation\":[{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"PurchaseContract\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"SupplierName\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"PurchaseContractTargetAmount\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.Decimal\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"ReleaseCode_Text\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"}],\"fields\":[\"PurchaseContract\",\"SupplierName\",\"PurchaseContractTargetAmount\",\"ReleaseCode_Text\"],\"labels\":{},\"importance\":{\"PurchaseContract\":\"High\",\"SupplierName\":\"High\",\"PurchaseContractTargetAmount\":\"High\",\"ReleaseCode_Text\":\"High\"}}},\"path\":\"Supplier\",\"namespace\":\"C_CONTRACT_FS_SRV\",\"entitySet\":{\"name\":\"C_ContractFs\",\"entityType\":\"C_CONTRACT_FS_SRV.C_ContractFsType\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"deletable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:creatable\":\"false\",\"Org.OData.Capabilities.V1.InsertRestrictions\":{\"Insertable\":{\"Bool\":\"false\"}},\"sap:updatable\":\"false\",\"Org.OData.Capabilities.V1.UpdateRestrictions\":{\"Updatable\":{\"Bool\":\"false\"}},\"sap:deletable\":\"false\",\"Org.OData.Capabilities.V1.DeleteRestrictions\":{\"Deletable\":{\"Bool\":\"false\"}},\"sap:content-version\":\"1\",\"Org.OData.Capabilities.V1.SearchRestrictions\":{\"Searchable\":{\"Bool\":\"false\"}}},\"entityType\":{\"name\":\"C_ContractFsType\",\"key\":{\"propertyRef\":[{\"name\":\"PurchaseContract\"}]},\"property\":[{\"name\":\"AddressID\",\"type\":\"Edm.String\",\"maxLength\":\"200\",\"extensions\":[{\"name\":\"label\",\"value\":\"Address\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Address\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Address\"}},{\"name\":\"CashDiscount1Days\",\"type\":\"Edm.Decimal\",\"precision\":\"3\",\"scale\":\"0\",\"extensions\":[{\"name\":\"label\",\"value\":\"Days 1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Days 1\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Days 1\"}},{\"name\":\"CashDiscount1Percent\",\"type\":\"Edm.Decimal\",\"precision\":\"5\",\"scale\":\"3\",\"extensions\":[{\"name\":\"label\",\"value\":\"Disc.percent 1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Disc.percent 1\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Disc.percent 1\"}},{\"name\":\"CashDiscount2Days\",\"type\":\"Edm.Decimal\",\"precision\":\"3\",\"scale\":\"0\",\"extensions\":[{\"name\":\"label\",\"value\":\"Days 2\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Days 2\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Days 2\"}},{\"name\":\"CashDiscount2Percent\",\"type\":\"Edm.Decimal\",\"precision\":\"5\",\"scale\":\"3\",\"extensions\":[{\"name\":\"label\",\"value\":\"Disc.percent 2\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Disc.percent 2\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Disc.percent 2\"}},{\"name\":\"CityName\",\"type\":\"Edm.String\",\"maxLength\":\"40\",\"extensions\":[{\"name\":\"label\",\"value\":\"City\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"City\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"City\"}},{\"name\":\"CompanyCode\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Company Code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Company Code\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Company Code\"},\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"CompanyCodeName\"}},{\"name\":\"CompanyCodeName\",\"type\":\"Edm.String\",\"maxLength\":\"25\",\"extensions\":[{\"name\":\"label\",\"value\":\"Company Name\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Company Name\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Company Name\"}},{\"name\":\"CreatedByUser\",\"type\":\"Edm.String\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"label\",\"value\":\"Created by\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Created by\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Created by\"}},{\"name\":\"CreationDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"label\",\"value\":\"Document Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Document Date\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Document Date\"}},{\"name\":\"DocumentCurrency\",\"type\":\"Edm.String\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Currency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Currency\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Currency\"},\"sap:semantics\":\"currency-code\"},{\"name\":\"EmailAddress\",\"type\":\"Edm.String\",\"maxLength\":\"241\",\"extensions\":[{\"name\":\"label\",\"value\":\"E-Mail Address\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"E-Mail Address\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"E-Mail Address\"}},{\"name\":\"FaxNumber\",\"type\":\"Edm.String\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Fax\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Fax\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Fax\"}},{\"name\":\"HouseNumber\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"House Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"House Number\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"House Number\"}},{\"name\":\"IncotermsClassification\",\"type\":\"Edm.String\",\"maxLength\":\"3\",\"extensions\":[{\"name\":\"text\",\"value\":\"IncotermsClassification_Text\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Incoterms\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:text\":\"IncotermsClassification_Text\",\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"IncotermsClassification_Text\"},\"sap:label\":\"Incoterms\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Incoterms\"}},{\"name\":\"IncotermsTransferLocation\",\"type\":\"Edm.String\",\"maxLength\":\"28\",\"extensions\":[{\"name\":\"label\",\"value\":\"Incoterms (Part 2)\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Incoterms (Part 2)\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Incoterms (Part 2)\"}},{\"name\":\"InternationalFaxNumber\",\"type\":\"Edm.String\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Fax number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Fax number\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Fax number\"}},{\"name\":\"InternationalMobilePhoneNumber\",\"type\":\"Edm.String\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Telephone number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Telephone number\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Telephone number\"}},{\"name\":\"InternationalPhoneNumber\",\"type\":\"Edm.String\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Telephone number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Telephone number\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Telephone number\"}},{\"name\":\"InvoicingParty\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Invoicing Party\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Invoicing Party\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Invoicing Party\"}},{\"name\":\"MobilePhoneNumber\",\"type\":\"Edm.String\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Telephone\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Telephone\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Telephone\"}},{\"name\":\"NetPaymentDays\",\"type\":\"Edm.Decimal\",\"precision\":\"3\",\"scale\":\"0\",\"extensions\":[{\"name\":\"label\",\"value\":\"Days net\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Days net\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Days net\"}},{\"name\":\"PaymentTerms\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Payment terms\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Payment terms\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Payment terms\"}},{\"name\":\"PhoneNumber\",\"type\":\"Edm.String\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Telephone\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Telephone\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Telephone\"}},{\"name\":\"PostalCode\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Postal Code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Postal Code\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Postal Code\"}},{\"name\":\"PurchaseContract\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Pur. Contract\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Pur. Contract\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Pur. Contract\"},\"sap:updatable\":\"false\",\"Org.OData.Core.V1.Immutable\":{\"Bool\":\"true\"}},{\"name\":\"PurchaseContractTargetAmount\",\"type\":\"Edm.Decimal\",\"precision\":\"15\",\"scale\":\"4\",\"extensions\":[{\"name\":\"unit\",\"value\":\"DocumentCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Target Value\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:unit\":\"DocumentCurrency\",\"sap:label\":\"Target Value\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Target Value\"},\"Org.OData.Measures.V1.ISOCurrency\":{\"Path\":\"DocumentCurrency\"}},{\"name\":\"PurchaseContractType\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"text\",\"value\":\"PurchaseContractType_Text\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Purchasing Doc. Type\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:text\":\"PurchaseContractType_Text\",\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"PurchaseContractType_Text\"},\"sap:label\":\"Purchasing Doc. Type\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Purchasing Doc. Type\"}},{\"name\":\"PurchasingDocumentCategory\",\"type\":\"Edm.String\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"text\",\"value\":\"PurchasingDocumentCategory_Text\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Purch. Doc. Category\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:text\":\"PurchasingDocumentCategory_Text\",\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"PurchasingDocumentCategory_Text\"},\"sap:label\":\"Purch. Doc. Category\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Purch. Doc. Category\"}},{\"name\":\"PurchasingGroup\",\"type\":\"Edm.String\",\"maxLength\":\"3\",\"extensions\":[{\"name\":\"label\",\"value\":\"Purchasing Group\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Purchasing Group\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Purchasing Group\"},\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"PurchasingGroupName\"}},{\"name\":\"PurchasingGroupName\",\"type\":\"Edm.String\",\"maxLength\":\"18\",\"extensions\":[{\"name\":\"label\",\"value\":\"Purchasing Grp Name\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Purchasing Grp Name\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Purchasing Grp Name\"}},{\"name\":\"PurchasingOrganization\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Purch. organization\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Purch. organization\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Purch. organization\"},\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"PurchasingOrganizationName\"}},{\"name\":\"PurchasingOrganizationName\",\"type\":\"Edm.String\",\"maxLength\":\"20\",\"extensions\":[{\"name\":\"label\",\"value\":\"Purchasing Org Name\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Purchasing Org Name\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Purchasing Org Name\"}},{\"name\":\"ReleaseCode\",\"type\":\"Edm.String\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"text\",\"value\":\"ReleaseCode_Text\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Release indicator\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:text\":\"ReleaseCode_Text\",\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"ReleaseCode_Text\"},\"sap:label\":\"Release indicator\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Release indicator\"}},{\"name\":\"StreetName\",\"type\":\"Edm.String\",\"maxLength\":\"60\",\"extensions\":[{\"name\":\"label\",\"value\":\"Street\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Street\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Street\"}},{\"name\":\"Supplier\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Supplier\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Supplier\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Supplier\"},\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"SupplierName\"}},{\"name\":\"SupplierAddressID\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Address Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Address Number\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Address Number\"}},{\"name\":\"SupplierName\",\"type\":\"Edm.String\",\"maxLength\":\"80\",\"extensions\":[{\"name\":\"label\",\"value\":\"Name of Supplier\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Name of Supplier\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Name of Supplier\"}},{\"name\":\"SupplyingSupplier\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Supplying Vendor\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Supplying Vendor\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Supplying Vendor\"}},{\"name\":\"IncotermsClassification_Text\",\"type\":\"Edm.String\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Description\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Description\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Description\"},\"sap:creatable\":\"false\",\"sap:updatable\":\"false\",\"Org.OData.Core.V1.Computed\":{\"Bool\":\"true\"}},{\"name\":\"PurchaseContractType_Text\",\"type\":\"Edm.String\",\"maxLength\":\"20\",\"extensions\":[{\"name\":\"label\",\"value\":\"Doc. Type Descript.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Doc. Type Descript.\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Doc. Type Descript.\"},\"sap:creatable\":\"false\",\"sap:updatable\":\"false\",\"Org.OData.Core.V1.Computed\":{\"Bool\":\"true\"}},{\"name\":\"PurchasingDocumentCategory_Text\",\"type\":\"Edm.String\",\"maxLength\":\"60\",\"extensions\":[{\"name\":\"label\",\"value\":\"Short Descript.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Short Descript.\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Short Descript.\"},\"sap:creatable\":\"false\",\"sap:updatable\":\"false\",\"Org.OData.Core.V1.Computed\":{\"Bool\":\"true\"}},{\"name\":\"ReleaseCode_Text\",\"type\":\"Edm.String\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Description\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Description\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Description\"},\"sap:creatable\":\"false\",\"sap:updatable\":\"false\",\"Org.OData.Core.V1.Computed\":{\"Bool\":\"true\"}},{\"name\":\"ValidityEndDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Validity End\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:display-format\":\"Date\",\"sap:label\":\"Validity End\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Validity End\"}},{\"name\":\"ValidityStartDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Validity Start\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:display-format\":\"Date\",\"sap:label\":\"Validity Start\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Validity Start\"}}],\"navigationProperty\":[{\"name\":\"to_ContactCard\",\"relationship\":\"C_CONTRACT_FS_SRV.assoc_8D0A07136813B893B73350D0535B26CD\",\"fromRole\":\"FromRole_assoc_8D0A07136813B893B73350D0535B26CD\",\"toRole\":\"ToRole_assoc_8D0A07136813B893B73350D0535B26CD\",\"extensions\":[{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:filterable\":\"false\"},{\"name\":\"to_PurchaseContractItem\",\"relationship\":\"C_CONTRACT_FS_SRV.assoc_5841FCA008A2F3C01A7552525EFD253A\",\"fromRole\":\"FromRole_assoc_5841FCA008A2F3C01A7552525EFD253A\",\"toRole\":\"ToRole_assoc_5841FCA008A2F3C01A7552525EFD253A\",\"extensions\":[{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:filterable\":\"false\"}],\"extensions\":[{\"name\":\"label\",\"value\":\"Purchasing Contract consumption view for Factsheet\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"namespace\":\"C_CONTRACT_FS_SRV\",\"entityType\":\"C_CONTRACT_FS_SRV.C_ContractFsType\",\"sap:label\":\"Purchasing Contract consumption view for Factsheet\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Purchasing Contract consumption view for Factsheet\"},\"sap:content-version\":\"1\",\"$path\":\"/dataServices/schema/0/entityType/0\",\"com.sap.vocabularies.UI.v1.DataPoint#DataPoint01\":{\"Title\":{\"String\":\"Target Value\"},\"Value\":{\"Path\":\"PurchaseContractTargetAmount\",\"EdmType\":\"Edm.Decimal\"}},\"com.sap.vocabularies.UI.v1.DataPoint#DataPoint02\":{\"Title\":{\"String\":\"Status\"},\"Value\":{\"Path\":\"ReleaseCode_Text\",\"EdmType\":\"Edm.String\"}},\"com.sap.vocabularies.UI.v1.DataPoint#DataPoint03\":{\"Title\":{\"String\":\"Supplier\"},\"Value\":{\"Path\":\"SupplierName\",\"EdmType\":\"Edm.String\"}},\"com.sap.vocabularies.UI.v1.HeaderInfo\":{\"TypeName\":{\"String\":\"Purchase Contract\"},\"TypeNamePlural\":{\"String\":\"Purchase Contract\"},\"TypeImageUrl\":{\"String\":\"/sap/bc/ui5_ui5/sap/ssuite_objexps1/typeimages/contract.jpg\"},\"Title\":{\"Value\":{\"Path\":\"PurchaseContractType_Text\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},\"Description\":{\"Value\":{\"Path\":\"PurchaseContract\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"}},\"com.sap.vocabularies.UI.v1.Badge\":{\"HeadLine\":{\"Value\":{\"String\":\"Purchase Contract\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\"},\"TypeImageUrl\":{\"String\":\"/sap/bc/ui5_ui5/sap/ssuite_objexps1/typeimages/contract.jpg\"},\"Title\":{\"Value\":{\"Path\":\"PurchaseContractType_Text\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},\"MainInfo\":{\"Value\":{\"Path\":\"PurchaseContract\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"}},\"com.sap.vocabularies.UI.v1.Identification\":[{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"PurchaseContractTargetAmount\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.Decimal\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"PurchasingOrganization\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"PurchasingGroup\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"CompanyCode\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"ValidityStartDate\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.Date\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"ValidityEndDate\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.Date\"}],\"com.sap.vocabularies.UI.v1.FieldGroup#Detail2\":{\"Label\":{\"String\":\"Delivery and Payment\"},\"Data\":[{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"IncotermsClassification\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"IncotermsTransferLocation\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"PaymentTerms\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"}]},\"com.sap.vocabularies.UI.v1.FieldGroup#Detail3\":{\"Label\":{\"String\":\"Supplier\"},\"Data\":[{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Url\":{\"Apply\":{\"Name\":\"odata.fillUriTemplate\",\"Parameters\":[{\"Type\":\"String\",\"Value\":\"#Supplier-displayFactSheet?Supplier={ID1}\"},{\"Type\":\"LabeledElement\",\"Value\":{\"Path\":\"Supplier\"},\"Name\":\"ID1\"}]}},\"Value\":{\"Path\":\"Supplier\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataFieldWithUrl\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"AddressID\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"com.sap.vocabularies.Communication.v1.IsEmailAddress\":{},\"Value\":{\"Path\":\"EmailAddress\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"com.sap.vocabularies.Communication.v1.IsPhoneNumber\":{},\"Value\":{\"Path\":\"InternationalPhoneNumber\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"com.sap.vocabularies.Communication.v1.IsPhoneNumber\":{},\"Value\":{\"Path\":\"InternationalMobilePhoneNumber\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"}]},\"com.sap.vocabularies.UI.v1.LineItem\":[{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"PurchaseContract\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"SupplierName\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"PurchaseContractTargetAmount\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.Decimal\"},{\"com.sap.vocabularies.UI.v1.Importance\":{\"EnumMember\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\"},\"Value\":{\"Path\":\"ReleaseCode_Text\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.DataField\",\"EdmType\":\"Edm.String\"}],\"com.sap.vocabularies.UI.v1.Facets\":[{\"com.sap.vocabularies.UI.v1.IsSummary\":{},\"Label\":{\"String\":\"General Information\"},\"Facets\":[{\"Label\":{\"String\":\"Basic Data\"},\"Target\":{\"AnnotationPath\":\"@com.sap.vocabularies.UI.v1.Identification\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.ReferenceFacet\"},{\"Label\":{\"String\":\"Delivery and Payment\"},\"Target\":{\"AnnotationPath\":\"@com.sap.vocabularies.UI.v1.FieldGroup#Detail2\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.ReferenceFacet\"},{\"Label\":{\"String\":\"Supplier\"},\"Target\":{\"AnnotationPath\":\"@com.sap.vocabularies.UI.v1.FieldGroup#Detail3\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.ReferenceFacet\"}],\"RecordType\":\"com.sap.vocabularies.UI.v1.CollectionFacet\"},{\"Label\":{\"String\":\"Items\"},\"Target\":{\"AnnotationPath\":\"to_PurchaseContractItem/@com.sap.vocabularies.UI.v1.LineItem\"},\"RecordType\":\"com.sap.vocabularies.UI.v1.ReferenceFacet\"}]},\"property\":{\"property\":{\"name\":\"Supplier\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Supplier\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Supplier\",\"com.sap.vocabularies.Common.v1.Label\":{\"String\":\"Supplier\"},\"com.sap.vocabularies.Common.v1.Text\":{\"Path\":\"SupplierName\"}},\"typePath\":\"Supplier\"}}";

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getConfiguration.returns({
			getControlType: function() {
				return "";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});
		oParent.getBindingInfo.withArgs("url").returns({
			"path": "dummy"
		});
		oParent.getBindingInfo.withArgs("value").returns({
			"path": "dummy"
		});
		oParent.getUrl.returns("www.sap.com");

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "AmountCurrency"
		});
		//oFactory.bind({mode: oParent.getMode()});
		oFactory._oMetaData = JSON.parse(oMeta);
		oFactory._oMetaData.annotations.text.path = oFactory._oMetaData.annotations.text.typePath;

		oControl = oFactory._createEdmDisplay({mode: oParent.getMode()});
		assert.equal(oControl.control instanceof Link, true);
		assert.equal(oControl.control.getId(), oParent.getId() + "-link");

		oControl.control.destroy();
		oFactory.destroy();
	});

	QUnit.test("_createEdmDisplay - linkPress event should be fired when link is pressed", function(assert) {
		// Arrange
		const oParent = fCreateSmartFieldStub(this.oModel);
		oParent.hasListeners = (sArg) => {
			if (sArg === "linkPress") {
				return true;
			}
		};
		const oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "AmountCurrency"
		});

		// Act
		const oControl = oFactory._createEdmDisplay({mode: oParent.getMode()});

		// Assert
		assert.equal(oControl.control instanceof Link, true);
		assert.equal(oControl.control.getId(), oParent.getId() + "-link");

		// Act
		oControl.control.firePress();

		// Assert
		assert.equal(oParent.fireLinkPress.calledOnce, true, "fireLinkPress is called on link press event");

		// Cleanup
		oControl.control.destroy();
		oFactory.destroy();
	});

	QUnit.test("_checkLink should return true if SmartField has linkPress listeners", function(assert) {
		const oParent = new SmartField(),
			oFactory = new ODataControlFactory(this.oModel, oParent, {
				entitySet: "Project",
				path: "AmountCurrency"
			});
		oParent.attachLinkPress(() => {});

		// Act
		const bResult = oFactory._checkLink();

		// Assert
		assert.equal(bResult, true, "checkLink returns true");

		// Cleanup
		oParent.destroy();
		oFactory.destroy();
	});

	QUnit.test("_createEdmTime", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo.returns({
			parts: [
				{
					model: "json",
					path: "Services/results"
				}
			]
		});

		oParent.data.returns({
			style: "short"
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartTime"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			var oControl = oFactory._createEdmTime();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.TimePicker"));
			assert.strictEqual(oControl.control.getId(), oParent.getId() + "-timePicker");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmTime with custom dateFormatSettings", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			oCustomDateFormatSettings = {
				pattern: "hh:mm"
			};

		oParent.getBindingInfo.returns({
			parts: [
				{
					model: "json",
					path: "Services/results"
				}
			]
		});

		oParent.data.returns({
			style: "short"
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartTime"
		});
		sinon.stub(oFactory, "getFormatSettings").returns(oCustomDateFormatSettings);
		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			var oControl = oFactory._createEdmTime();
			var oCustomFormatSettings = oControl.params.type.type.oFormatOptions;

			// assert
			assert.equal(oCustomFormatSettings.pattern, oCustomDateFormatSettings.pattern, "Control has custom format settings");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	// BCP: 1780442947
	QUnit.test("_createEdmTime it should set the default width of the TimePicker control to 100%", function(assert) {

		// arrange
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartTime"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			oParent.getWidth.returns("");
			var oControl = oFactory._createEdmTime();

			// assert
			assert.strictEqual(oControl.control.getWidth(), "100%");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("changeEvent should contain the new value of _createEdmTime", function(assert) {

		// arrange
		var  sValue,
			sNewValue,
			done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartTime"
			});

			oParent.fireChange = function(oParam) {
				sValue = oParam.value;
				sNewValue = oParam.newValue;
			};

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			var oControl = oFactory._createEdmTime();
			assert.equal(oControl.control instanceof TimePicker, true);

			//act
			oControl.control.fireChange({"value":"12:00:00 PM"});

			// assert
			assert.equal(sValue, "12:00:00 PM", "change event should contains correct value");
			assert.equal(sNewValue, "12:00:00 PM", "change event should contains correct new value");
			done();
		});
	});

	QUnit.test("_createEdmDateTime with display-format = date", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo.returns({
			parts: [
				{
					model: "json",
					path: "Services/results"
				}
			]
		});
		oParent.data.returns({
			style: "short"
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDate"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			var oControl = oFactory._createEdmDateTime();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.DatePicker"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-datePicker");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDateTime with semantics = yearmonthday", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo.returns({
			parts: [
				{
					model: "json",
					path: "Services/results"
				}
			]
		});
		oParent.data.returns({
			style: "short"
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateStr"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			var oControl = oFactory._createEdmDateTime();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.DatePicker"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-datePicker");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDateTime without display-format", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "auto";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateWithout"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			var oControl = oFactory._createEdmDateTime();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.DateTimePicker"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-input");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDateTimeOffset", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data.returns({
			UTC: true,
			style: "medium"
		});

		oParent.getBindingInfo.withArgs("value").returns({
			parts: [{
				model: undefined,
				path: "StartDateTime"
			}]
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTime"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			var oControl = oFactory._createEdmDateTimeOffset();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.DateTimePicker"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-input");

			// BCP: 1770430441
			assert.strictEqual(oControl.params.type.type.oFormatOptions.UTC, false, "it should parse and format the date as local time zone");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDateTimeOffset when has Timezone annotation", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data.returns({
			UTC: true,
			style: "medium"
		});

		oParent.getBindingInfo.withArgs("value").returns({
			parts: [{
				model: undefined,
				path: "StartDateTimeTimeZone"
			}]
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTimeTimeZone"
		});

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.DateTimeOffset"
			}
		};

		oFactory.getEdmProperty = function () {
			return {
				type: "Edm.DateTimeOffset",
				"com.sap.vocabularies.Common.v1.Timezone":{
					Path: "Timezone"
				}
			};
		};

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			oFactory._oMetaData.property = {
				"property": {
					"name": "StartDateTimeTimeZone",
					"type": "Edm.DateTimeOffset",
					"nullable": "false",
					"precision": "11",
					"scale": "2",
					"com.sap.vocabularies.Common.v1.Timezone": "Timezone"
				}
			};

			var oControl = oFactory._createEdmDateTimeOffset(),
			oBindingInfoValue = oControl.control.getBindingInfo("value");
			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.DateTimePicker"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-input");
			assert.equal(oBindingInfoValue.useRawValues, true);
			assert.equal(oBindingInfoValue.parts.length, 2);
			assert.equal(oBindingInfoValue.parts[0].path, "StartDateTimeTimeZone");
			assert.equal(oBindingInfoValue.parts[0].type.getMetadata().getName(), "sap.ui.model.odata.type.DateTimeWithTimezone");
			assert.equal(oBindingInfoValue.parts[1].path, "Timezone");
			assert.equal(oBindingInfoValue.parts[1].parameters.useUndefinedForUnresolved, true);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDateTimeOffset when has Timezone annotation and no EdmProperty", function(assert) {
		var done = assert.async(),
			bIsErroRaised = false,
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data.returns({
			UTC: true,
			style: "medium"
		});

		oParent.getBindingInfo.withArgs("value").returns({
			parts: [{
				model: undefined,
				path: "StartDateTimeTimeZone"
			}]
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTimeTimeZone"
		});

		oFactory.getEdmProperty = function () {
			return null;
		};

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			try {
				var oControl = oFactory._createEdmDateTimeOffset();
			} catch (error) {
				bIsErroRaised = true;
			}
			// assert
			assert.notOk(bIsErroRaised, "Error was not raised");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmNumeric", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "StartDateTime"
				}
			]
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			var oControl = oFactory._createEdmNumeric();

			// assert
			assert.equal(oControl.control instanceof Input, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-input");
			assert.equal(oControl.onCreate, "_onCreate");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	// BCP: 1870168882
	QUnit.test("_createEdmNumeric it should create a combo box control", function(assert) {

		// system under test
		var done = assert.async(),
			oSmartFieldStub = fCreateSmartFieldStub(this.oModel);

		var oFactory = new ODataControlFactory(this.oModel, oSmartFieldStub, {
			entitySet: "Project",
			path: "Amount"
		});

		oSmartFieldStub.getMode.returns("edit");

		oFactory.bind({mode: oSmartFieldStub.getMode()}).finally(function() {

			// arrange
			var oMetadata = oFactory.getMetaData();
			oMetadata.annotations.valuelist = "foo";
			oMetadata.annotations.valuelistType = "fixed-values";

			// act
			var oControl = oFactory._createEdmNumeric();

			// assert
			assert.ok(oControl.control.isA("sap.m.ComboBox"));
			assert.strictEqual(oControl.control.getMetadata().getName(), "sap.ui.comp.smartfield.ComboBox");
			assert.ok(oControl.control.getBindingInfo("realValue"));

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmNumeric it should create a combo box control in the context of Smart multi edit", function(assert) {

		// system under test
		var done = assert.async(),
			oSmartFieldStub = fCreateSmartFieldStub(this.oModel);

		var oFactory = new ODataControlFactory(this.oModel, oSmartFieldStub, {
			entitySet: "Project",
			path: "Amount"
		});

		oSmartFieldStub.oParent = {
			isA : function() {
				return "sap.ui.comp.smartmultiedit.Field";
			}
		};

		oSmartFieldStub.getMode.returns("edit");

		oFactory.bind({mode: oSmartFieldStub.getMode()}).finally(function() {

			// arrange
			var oMetadata = oFactory.getMetaData();
			oMetadata.annotations.valuelist = "foo";
			oMetadata.annotations.valuelistType = "fixed-values";

			// act
			var oControl = oFactory._createEdmNumeric();

			// assert
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.notOk(oControl.control.isA("sap.ui.comp.smartfield.ComboBox"));
			assert.ok(oControl.control.getBindingInfo("selectedKey"));
			assert.equal(oControl.control.getId(), oSmartFieldStub.getId() + "-comboBoxEdit");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmNumeric it should create a combo box control if fixedValueListValidationEnabled is true", function(assert) {

		// system under test
		var done = assert.async(),
			oSmartFieldStub = fCreateSmartFieldStub(this.oModel);

		var oFactory = new ODataControlFactory(this.oModel, oSmartFieldStub, {
			entitySet: "Project",
			path: "Amount"
		});

		oSmartFieldStub.getFixedValueListValidationEnabled.returns(true);

		oSmartFieldStub.getMode.returns("edit");

		oFactory.bind({mode: oSmartFieldStub.getMode()}).finally(function() {

			// arrange
			var oMetadata = oFactory.getMetaData();
			oMetadata.annotations.valuelist = "foo";
			oMetadata.annotations.valuelistType = "fixed-values";

			// act
			var oControl = oFactory._createEdmNumeric();

			// assert
			assert.equal(oControl.control instanceof ComboBox, true);
			assert.notOk(oControl.control.isA("sap.ui.comp.smartfield.ComboBox"));
			assert.ok(oControl.control.getBindingInfo("selectedKey"));
			assert.equal(oControl.control.getId(), oSmartFieldStub.getId() + "-comboBoxEdit");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmBoolean disabled", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "Released"
				}
			]
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Released"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl = oFactory._createEdmBoolean(oFactorySettings);
			assert.ok(oControl.control instanceof Text);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");
			assert.equal(oControl.onCreate, "_onCreate");

			var oInfo = oControl.control.getBindingInfo("text");
			var sResult = oInfo.formatter("test");
			assert.ok(sResult);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmBoolean enabled", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "Released"
				}
			]
		});

		oParent.getEditable.returns(true);
		oParent.getEnabled.returns(true);
		oParent.getContextEditable.returns(true);
		oParent.getMode.returns("edit");

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Released"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl = oFactory._createEdmBoolean(oFactorySettings);

			// assert
			assert.ok(oControl.control instanceof CheckBox);
			assert.equal(oControl.control.getId(), oParent.getId() + "-cBoxBool");
			assert.equal(oControl.onCreate, "_onCreate");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmBoolean returning a combo box", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.data.withArgs("hasValueHelpDialog").returns("false");
		oParent.data.withArgs("controlType").returns("dropDownList");


		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});

		oParent.getWidth.returns("");
		oParent.getBindingInfo.returns(null);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			oFactory._oMetaData.property = {
				"property": {
					"name": "Amount",
					"type": "Edm.Decimal",
					"nullable": "false",
					"precision": "11",
					"scale": "2",
					"sap:value-list": "fixed-values",
					"documentation": [
						{
							"text": null,
							"extensions": [
								{
									"name": "Summary",
									"value": "Preis fÃ¼r externe Verarbeitung.",
									"attributes": [],
									"children": [],
									"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
								}, {
									"name": "LongDescription",
									"value": null,
									"attributes": [],
									"children": [],
									"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
								}
							]
						}
					],
					"extensions": [
						{
							"name": "unit",
							"value": "AmountCurrency",
							"namespace": "http://www.sap.com/Protocols/SAPData"
						}, {
							"name": "label",
							"value": "Preis",
							"namespace": "http://www.sap.com/Protocols/SAPData"
						}, {
							"name": "sortable",
							"value": "false",
							"namespace": "http://www.sap.com/Protocols/SAPData"
						}, {
							"name": "filterable",
							"value": "false",
							"namespace": "http://www.sap.com/Protocols/SAPData"
						}
					]
				},
				"typePath": "Amount",
				"extensions": {
					"sap:filterable": {
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					"sap:sortable": {
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					"sap:label": {
						"name": "label",
						"value": "Preis",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					"sap:text": {
						"name": "text",
						"value": "AmountCurrency",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}
				}
			};

			oFactory._oHelper.getTextAnnotationoFactory = function() {
				return {};
			};
			oFactory._oMetaData.annotations.valuelist = "foo";
			var oControl = oFactory._createEdmBoolean({mode: oParent.getMode()});

			// assert
			assert.equal(oControl.control.isA("sap.m.Text"), true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");
			assert.equal(oControl.control.getRenderWhitespace(), true, "renderWhitespace property of the Text control is set to true");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	// BCP: 1880033659
	QUnit.test("_createEdmBoolean should not instantiate a combo box control instance in display mode to fetch" +
			"the value list collection when the fetchValueListReadOnly property is set to false", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartFieldStub = fCreateSmartFieldStub(this.oModel);

		// arrange
		oSmartFieldStub.getFetchValueListReadOnly.returns(false);

		var oFactory = new ODataControlFactory(this.oModel, oSmartFieldStub, {
			entitySet: "Project",
			path: "Amount"
		});
		var oFactorySettings = {mode: oSmartFieldStub.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			var oMetadata = oFactory.getMetaData();
			oMetadata.annotations.valuelist = "foo";
			oMetadata.annotations.valuelistType = "fixed-values";

			// act
			var oControl = oFactory._createEdmBoolean(oFactorySettings);

			// assert
			assert.strictEqual(oControl.control.getMetadata().getName(), "sap.m.Text");
			assert.equal(oControl.control.getRenderWhitespace(), true, "renderWhitespace property of the Text control is set to true");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOM", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			len = 2,
			bChange = false,
			bExc = false,
			bUnit;

		oParent.getMode.returns("edit");
		oParent.getInnerControls.returns([new Input(), new Input()]);
		oParent.checkValuesValidity.returns(new SyncPromise.resolve());
		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "StartDateTime"
				}
			]
		});

		oParent.getObjectBinding.returns({
			sPath: "binding"
		});

		oParent.fireChange = function() {
			bChange = true;
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl = oFactory._createEdmUOM(oFactorySettings);
			var oText = oControl.control.getItems()[1];
			assert.equal(oText.getId(), oParent.getId() + "-sfEdit");
			assert.equal(oControl.control instanceof HBox, true);
			assert.equal(oControl.onCreate, "_onCreateUOM");

			var oConfig = oText.data("configdata");
			oConfig.configdata.onText(oControl.control);
			oConfig.configdata.onInput(oControl.control);

			var mParams = {
				getValue: "getValue",
				valuehelp: true
			};
			oFactory._onCreateUOM(oControl.control, mParams);

			while (len--) {
				oControl.control.getItems()[len].fireChange();
			}

			var oItem = oControl.control.getItems()[1];
			assert.equal(oItem.getId(), oParent.getId() + "-sfEdit");
			oItem.setValue("");

			assert.equal(bChange, true);
			assert.equal(mParams.getValue(), "");
			assert.equal(mParams.uom(), "");

			mParams.uomset("uom");
			assert.equal(mParams.uom(), "uom");

			//check exception handling
			oParent.fireChange = function(oParam) {
				bUnit = oParam.unitChanged;
				bExc = true;
				throw "exc";
			};
			try {
				oControl.control.getItems()[0].fireChange();
				oControl.control.getItems()[1].fireChange();
			} catch (ex) {
				//should not happen
				bExc = false;
			}

			assert.equal(bUnit, true);
			assert.equal(bExc, true);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOM - unit suppressed", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "StartDateTime"
				}
			]
		});
		oParent.data.returns("true");

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl = oFactory._createEdmUOM(oFactorySettings);

			assert.equal(oControl.control instanceof Input, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-input");
			assert.equal(oControl.onCreate, "_onCreate");

			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOM - Currency OneWay Binding", function(assert) {
		var oFactory,
			oFactorySettings,
			done = assert.async(),
			oModel = sinon.createStubInstance(ODataModel),
			oParent = sinon.createStubInstance(SmartField);

		oParent.getModel.returns(oModel);
		oParent.getMode.returns("edit");
		// oParent.getBindingInfo.withArgs("uomVisible").returns({});
		oParent.getUomVisible.returns(true);
		oParent.getBinding.returns({
									getBindingMode: function(){
														return "OneWay";
													}
									});

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});
		oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			// Arrange
			var oEdmUOMResult = oFactory._createEdmUOM(oFactorySettings),
				oAmountInputUOM = oEdmUOMResult.control.getItems()[0],
				oUnitSmartFieldUOM = oEdmUOMResult.control.getItems()[1];

			oParent.getInnerControls.returns([oAmountInputUOM, oUnitSmartFieldUOM]);
			oAmountInputUOM.setValue(12);
			oAmountInputUOM.fireChange();

			// Assert
			assert.ok(oAmountInputUOM.isA("sap.m.Input"));

			// Make sure the data model won't get updated, because of the OneWay binding mode
			assert.strictEqual(oAmountInputUOM.getBindingInfo("value").mode, "OneWay");
			assert.strictEqual(oAmountInputUOM.getBindingInfo("value").parts[0].mode, "OneWay");
			assert.strictEqual(oAmountInputUOM.getBindingInfo("value").parts[1].mode, "OneWay");

			assert.strictEqual(oAmountInputUOM.getBindingInfo("value").mode, "OneWay");
			assert.ok(oUnitSmartFieldUOM.isA("sap.ui.comp.smartfield.SmartField")); // the SmartField will propagate its binding mode to the base controls
			assert.strictEqual(oUnitSmartFieldUOM.getBindingInfo("value").parts[0].mode, "OneWay");
			assert.strictEqual(oParent.checkValuesValidity.callCount, 1);

			// cleanup
			oEdmUOMResult.control.destroy();
			oFactory.destroy();
			oParent = null;
			done();
		});
	});

	QUnit.test("_createEdmUOM - test if currency is added as ariaDescribedBy to the amount input when currency is not editable", function(assert) {
		var oFactory,
			oAriaDescribedBySpy,
			oFactorySettings,
			done = assert.async(),
			oModel = sinon.createStubInstance(ODataModel),
			oParent = sinon.createStubInstance(SmartField);

		oParent.getModel.returns(oModel);
		oParent.getMode.returns("edit");

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});
		oFactorySettings = {mode: oParent.getMode()};
		oAriaDescribedBySpy = sinon.spy(oFactory, "_handleUoMAriaDescribedBy");
		oFactory.bind(oFactorySettings).finally(function() {
			// Arrange
			var oEdmUOMResult = oFactory._createEdmUOM(oFactorySettings),
				oText = new Text("undefined-sfEdit-text"),
				oInput = new Input("undefined-sfEdit-input"),
				oAmountInputUOM = oEdmUOMResult.control.getItems()[0],
				oUnitSmartFieldUOM = oEdmUOMResult.control.getItems()[1];

			oParent.getInnerControls.returns([oAmountInputUOM, oUnitSmartFieldUOM]);
			sinon.stub(oUnitSmartFieldUOM, "getFirstInnerControl").returns(oText);

			// Act
			oUnitSmartFieldUOM.data("configdata").configdata.onText(oText);

			// Assert
			assert.ok(oAriaDescribedBySpy.calledOnce, "_handleUoMAriaDescribedBy is correctly called");
			assert.ok(oAmountInputUOM.getAriaDescribedBy(), "Amount input has ariaDescribedBy association");
			assert.equal(oAmountInputUOM.getAriaDescribedBy().length, 1, "Amount input has only one ariaDescribedBy association");
			assert.equal(oAmountInputUOM.getAriaDescribedBy()[0], "undefined-sfEdit-text", "Currency is correctly added as ariaDescribedBy");

			// Act
			oUnitSmartFieldUOM.data("configdata").configdata.onInput(oInput);

			// Assert
			assert.equal(oAmountInputUOM.getAriaDescribedBy().length, 0, "Amount input has no ariaDescribedBy associations");


			// Act
			oUnitSmartFieldUOM.data("configdata").configdata.onText(oText);

			// Assert
			assert.equal(oAmountInputUOM.getAriaDescribedBy().length, 1, "Amount input has only one ariaDescribedBy association");

			// cleanup
			oEdmUOMResult.control.destroy();
			oFactory.destroy();
			oText.destroy();
			oInput.destroy();
			oAriaDescribedBySpy.restore();
			oParent = null;
			done();
		});
	});

	QUnit.test("_createEdmUOM - Unit OneWay Binding", function(assert) {
		var oFactory,
			oFactorySettings,
			done = assert.async(),
			oModel = sinon.createStubInstance(ODataModel),
			oParent = sinon.createStubInstance(SmartField);

		oParent.getModel.returns(oModel);
		oParent.getMode.returns("edit");
		// oParent.getBindingInfo.withArgs("uomVisible").returns({});
		oParent.getUomVisible.returns(true);
		oParent.getBinding.returns({
									getBindingMode: function(){
														return "OneWay";
													}
									});

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Quantity"
		});
		oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			// Arrange
			var oEdmUOMResult = oFactory._createEdmUOM(oFactorySettings),
				oUnitUOM = sinon.createStubInstance(Input),
				oAmountInputUOM = oEdmUOMResult.control.getItems()[0],
				oUnitSmartFieldUOM = oEdmUOMResult.control.getItems()[1];

			oUnitUOM.getMetadata.returns({
				getName: function(){ return "sap.m.Input"; }
			});
			oUnitUOM.getParent.returns(oUnitSmartFieldUOM);
			sinon.stub(oUnitSmartFieldUOM, "_oFactory").value(sinon.createStubInstance(ODataControlFactory));
			oParent.getInnerControls.returns([oAmountInputUOM, oUnitUOM]);
			oAmountInputUOM.setValue(1);
			oAmountInputUOM.fireChange();

			// Assert
			assert.ok(oAmountInputUOM.isA("sap.m.Input"));

			// Make sure the data model won't get updated, because of the OneWay binding mode
			assert.strictEqual(oAmountInputUOM.getBindingInfo("value").mode, "OneWay");
			assert.strictEqual(oAmountInputUOM.getBindingInfo("value").parts[0].mode, "OneWay");
			assert.strictEqual(oAmountInputUOM.getBindingInfo("value").parts[1].mode, "OneWay");

			assert.ok(oUnitSmartFieldUOM.isA("sap.ui.comp.smartfield.SmartField")); // the SmartField will propagate its binding mode to the base controls
			assert.strictEqual(oUnitSmartFieldUOM.getBindingInfo("value").parts[0].mode, "OneWay");
			assert.strictEqual(oParent.checkUnitValidity.callCount, 1);

			// cleanup
			oEdmUOMResult.control.destroy();
			oFactory.destroy();
			oParent = null;
			oUnitUOM = null;
			done();
		});
	});

	QUnit.test("it should propagate the value of the wrapping property to the to the currency field", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			wrapping: true
		});
		var oText = new Text({
			wrapping: true
		});

		// arrange
		var oFactory = new ODataControlFactory(this.oModel, oSmartField, {
			entitySet: "Project",
			path: "Amount"
		});
		var oFactorySettings = {mode: oSmartField.getMode()};

		oSmartField._bMetaModelLoadAttached = true;
		oFactory.bind(oFactorySettings).finally(function() {
			var oHBox = oFactory._createEdmUOM(oFactorySettings).control;
			var oSmartFieldCurrencyField = oHBox.getItems()[1];
			oSmartFieldCurrencyField.setContent(oText);
			oSmartField.setContent(oHBox);

			// act
			oSmartField.setWrapping(false);
			oSmartField._propagateToInnerControls();

			// assert
			assert.strictEqual(oText.getWrapping(), false);

			// cleanup
			oText.destroy();
			oHBox.destroy();
			oFactory.destroy();
			oSmartField.destroy();
			done();
		});
	});

	// BCP: 1870164318
	QUnit.test("calling the .getInnerControls() method should not raise an exception in RTL mode", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField();

		// arrange
		var oFactory = new ODataControlFactory(this.oModel, oSmartField, {
			entitySet: "Project",
			path: "Amount"
		});
		var oFactorySettings = {mode: oSmartField.getMode()};

		oSmartField._bMetaModelLoadAttached = true;

		oFactory.bind(oFactorySettings).finally(function() {
			var oGetRTLStub = sinon.stub(Localization, "getRTL").returns(true);
			var oHBox = oFactory._createEdmUOM(oFactorySettings).control;
			var oSmartFieldCurrencyField = oHBox.getItems()[1];
			var oText = new Text();
			oSmartFieldCurrencyField.setContent(oText);
			oSmartField.setContent(oHBox);

			// act
			var aInnerControls = oSmartField.getInnerControls();

			// assert
			assert.strictEqual(aInnerControls[0].getMetadata().getName(), "sap.m.Input");
			assert.strictEqual(aInnerControls[1].getMetadata().getName(), "sap.m.Text");

			// cleanup
			oText.destroy();
			oHBox.destroy();
			oFactory.destroy();
			oSmartField.destroy();
			oGetRTLStub.restore();
			done();
		});
	});

	QUnit.test("_createEdmUOM - unit suppressed, no currency", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "StartDateTime"
				}
			]
		});
		oParent.data.returns("true");

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			delete oFactory._oMetaData.annotations.uom.property.property["sap:semantics"];
			delete oFactory._oMetaData.property.property["Org.OData.Measures.V1.ISOCurrency"];

			// act
			var oControl = oFactory._createEdmUOM(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof Input, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-input");
			assert.equal(oControl.onCreate, "_onCreate");
			assert.ok(oControl.params.type);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOMAttributes for amount", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "StartDateTime"
				}
			]
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			oFactory._oMetaData.annotations.uom.property.property["sap:semantics"] = "currency-code";

			var oSettings = {
				currency: true,
				edmProperty: oFactory._oMetaData.annotations.uom.property.property
			};

			var mParams = oFactory._createEdmUOMAttributes(oSettings);

			// assert
			assert.equal(mParams.value.parts.length, 3);
			assert.equal(mParams.value.parts[0].path, "Amount");

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOMAttributes for non-amount", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "StartDateTime"
				}
			]
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTime"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {

			var oSettings = {
				currency: false,
				edmProperty: {}
			};

			var mParams = oFactory._createEdmUOMAttributes(oSettings);

			// assert
			assert.equal(mParams.value.parts.length, 3);
			assert.equal(mParams.value.parts[0].path, "StartDateTime");

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOM for non-amount", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			oConfig,
			len = 2,
			bChange = false,
			bExc = false,
			bUnit;

		oParent.getMode.returns("edit");
		oParent.getInnerControls.returns([new Input(), new Input()]);
		oParent.checkValuesValidity.returns(new SyncPromise.resolve());
		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "StartDateTime"
				}
			]
		});
		oParent.fireChange = function() {
			bChange = true;
		};
		oParent.checkUnitValidity = function() {
			bChange = true;
		};

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			delete oFactory._oMetaData.annotations.uom.property.property["sap:semantics"];
			delete oFactory._oMetaData.property.property["Org.OData.Measures.V1.ISOCurrency"];

			// act
			var oControl = oFactory._createEdmUOM(oFactorySettings);
			var oText = oControl.control.getItems()[1];
			assert.equal(oControl.control instanceof HBox, true);
			assert.equal(oText.getId(), oParent.getId() + "-sfEdit");
			assert.equal(oControl.onCreate, "_onCreateUOM");

			oConfig = oText.data("configdata");
			oConfig.configdata.onText();
			oConfig.configdata.onInput();

			var mParams = {
				getValue: "getValue",
				valuehelp: true,
				type: oControl.params.type
			};
			oFactory._onCreateUOM(oControl.control, mParams);
			assert.ok(mParams.type.type.oFieldControl);

			while (len--) {
				oControl.control.getItems()[len].fireChange();
			}

			var oItem = oControl.control.getItems()[1];
			oItem.setValue("");

			assert.equal(bChange, true);
			assert.equal(mParams.getValue(), "");
			assert.equal(mParams.uom(), "");

			mParams.uomset("uom");
			assert.equal(mParams.uom(), "uom");

			//check exception handling
			oParent.fireChange = function(oParam) {
				bUnit = oParam.unitChanged;
				bExc = true;
				throw "exc";
			};

			try {
				oControl.control.getItems()[0].fireChange();
				oControl.control.getItems()[1].fireChange();
			} catch (ex) {
				//should not happen
				bExc = false;
			}

			assert.equal(bUnit, true);
			assert.equal(bExc, true);

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOMDisplay", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "StartDateTime"
				}
			]
		});
		oParent.getUomVisible.returns(true);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl = oFactory._createEdmUOMDisplay(oFactorySettings);
			assert.equal(oControl.control instanceof HBox, true);
			assert.equal(!oControl.onCreate, true);

			var oSmartField = oControl.control.getItems()[1];
			assert.equal(oSmartField.getId(), oParent.getId() + "-sfDisp");
			var oConfig = oSmartField.data("configdata");
			var oInner = {
				addStyleClass: function() {
				}
			};
			oConfig.configdata.onText(oInner);
			oConfig.configdata.onInput(oInner);
			assert.ok(!oConfig.configdata.getContextEditable());

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOMDisplay - unit suppressed", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "StartDateTime"
				}
			]
		});
		oParent.data.returns("true");

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			var oControl = oFactory._createEdmUOMDisplay();

			// assert
			assert.equal(oControl.control instanceof Text, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOMDisplay - OneWay Binding", function(assert) {
		var oFactory,
			oFactorySettings,
			done = assert.async(),
			oModel = sinon.createStubInstance(ODataModel),
			oParent = sinon.createStubInstance(SmartField);

		oParent.getModel.returns(oModel);
		oParent.getMode.returns("edit");
		oParent.getUomVisible.returns(true);
		oParent.getBinding.returns({
									getBindingMode: function(){
														return "OneWay";
													}
									});

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});
		oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			var oEdmUOMDisplayResult = oFactory._createEdmUOMDisplay(oFactorySettings),
				oAmountInputUOMDisplay = oEdmUOMDisplayResult.control.getItems()[0],
				oUnitSmartFieldUOMDisplay = oEdmUOMDisplayResult.control.getItems()[1];

			// Assert
			assert.ok(oAmountInputUOMDisplay.isA("sap.m.Text")); // we don't need to check the binding way for display controls
			assert.ok(oUnitSmartFieldUOMDisplay.isA("sap.ui.comp.smartfield.SmartField")); // the SmartField will propagate its binding mode to the base controls
			assert.strictEqual(oUnitSmartFieldUOMDisplay.getBindingInfo("value").parts[0].mode, "OneWay");

			// cleanup
			oEdmUOMDisplayResult.control.destroy();
			oFactory.destroy();
			oParent = null;
			done();
		});
	});

	QUnit.test("_checkSuppressUnit - unit suppressed by uomVisible", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "StartDateTime"
				}
			]
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			var oControl = oFactory._createEdmUOMDisplay();

			// assert
			assert.equal(oControl.control instanceof Text, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-text");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	/**
	 * @deprecated Since 1.32.0
	 */
	QUnit.test("_setUOMEditState for amount", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel),
			bEditState = false;

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "objectIdentifier";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});
		oParent.bindProperty = function(sName) {
			if (sName === "uomEditState") {
				bEditState = true;
			}
		};
		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "StartDateTime"
				}
			]
		});
		oParent.getProposedControl.returns("ObjectNumber");

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			oFactory._oMetaData.annotations.uom.property["sap:semantics"] = "currency-code";
			oFactory._setUOMEditState();

			// assert
			assert.ok(bEditState);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOMObjectNumber for amount", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "StartDateTime"
				}
			]
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			oFactory._oMetaData.annotations.uom.property["sap:semantics"] = "currency-code";
			var oControl = oFactory._createEdmUOMObjectNumber();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectNumber"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-objNumber");
			assert.equal(oControl.control.mBindingInfos.number.parts.length, 3);
			assert.equal(oControl.control.mBindingInfos.number.parts[0].path, "Amount");
			assert.equal(oControl.control.mBindingInfos.number.parts[1].path, "AmountCurrency");
			assert.equal(oControl.control.mBindingInfos.number.parts[2].path, "/##@@requestCurrencyCodes");
			assert.equal(oControl.control.mBindingInfos.number.parts[2].mode, "OneTime");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmUOMObjectNumber for non-amount", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "StartDateTime"
				}
			]
		});

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTime"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			var oControl = oFactory._createEdmUOMObjectNumber();

			// assert
			assert.ok(oControl.control && oControl.control.isA("sap.m.ObjectNumber"));
			assert.equal(oControl.control.getId(), oParent.getId() + "-objNumber");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmSemantic", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getMode.returns("edit");
		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "StartDateTime"
				}
			]
		});
		oParent.getEditable.returns(true);
		oParent.getEnabled.returns(true);
		oParent.getContextEditable.returns(true);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			oFactory._oMetaData.annotations.semantic = oFactory._oMetaData.annotations.uom;
			oFactory._oMetaData.annotations.uom = null;
			oFactory._oMetaData.annotations.lineitem = {
				labels: {
					"StartDateTime": "StartDateTime"
				}
			};

			var oControl = oFactory._createEdmSemantic();
			assert.equal(oControl.control instanceof SmartLink, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-sl");

			assert.equal(oControl.onCreate, "_onCreate");

			assert.equal(oControl.params.getValue, "getInnerControlValue");

			var fCallBack = oControl.control.getCreateControlCallback();
			oControl.control.destroy();

			oControl = fCallBack();
			assert.equal(oControl instanceof Input, true);
			assert.equal(oControl.getId(), oParent.getId() + "-input");
			oControl.destroy();

			oFactory.createControl = function() {
				return null;
			};
			oControl = fCallBack();
			assert.equal(!oControl, true);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay", function(assert) {
		var oFactory, oFactorySettings, oControl, oParent;

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getBindingInfo.withArgs("value").returns({
			parts: [
				{
					model: undefined,
					path: "StartDateTime"
				}
			]
		});
		oParent.data.returns({
			configdata: {}
		});

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings);
		oControl = oFactory._createEdmDisplay(oFactorySettings);
		assert.equal(oControl.control instanceof Text, true);
		assert.equal(oControl.control.getId(), oParent.getId() + "-text");

		var oBindingInfo = oControl.control.getBindingInfo("text");
		assert.ok(oBindingInfo);
		assert.ok(oBindingInfo.formatter);

		assert.equal("***", oBindingInfo.formatter("XYZ"));
		assert.equal("", oBindingInfo.formatter(""));

		oControl.control.destroy();
		oFactory.destroy();
	});

	QUnit.test("_getEdmDisplayPath", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			var sPath = oFactory._oHelper.getEdmDisplayPath(oFactory._oMetaData);
			assert.equal(sPath, "Description");
			oFactory._oMetaData.annotations.text = {
				property: {
					name: "TextforDescription"
				},
				path: "TextforDescription"
			};
			sPath = oFactory._oHelper.getEdmDisplayPath(oFactory._oMetaData);
			assert.equal(sPath, "TextforDescription");

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_getEdmUOMTextAlignment", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.bind({mode: oParent.getMode()}).finally(function() {

			oParent.getTextAlign.returns("dummyTextAlign");

			assert.equal(oFactory._getEdmUOMTextAlignment(), "dummyTextAlign");

			oParent.getTextAlign.returns("Initial");

			assert.equal(oFactory._getEdmUOMTextAlignment(), "Begin");

			oParent.getEditable.returns(true);

			oParent.getContextEditable.returns(true);

			assert.equal(oFactory._getEdmUOMTextAlignment(), "Begin");

			oParent.isContextTable.returns(true);

			assert.equal(oFactory._getEdmUOMTextAlignment(), "End");

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay - date picker", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getBindingInfo.returns({
			parts: [
				{
					model: "json",
					path: "Services/results"
				}
			]
		});
		oParent.getBindingInfo.withArgs("url").returns(null);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDate"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			var oControl = oFactory._createEdmDisplay(oFactorySettings).control;

			// assert
			assert.equal(oControl instanceof Text, true);
			assert.equal(oControl.getId(), oParent.getId() + "-text");
			assert.equal(oControl.getEmptyIndicatorMode(), EmptyIndicatorMode.Auto, "EmptyIndicatorMode is correctly set on the inner sap.m.Text control");

			// cleanup
			oControl.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay - return ExpandableText when switched from edit to display mode", function(assert) {
		var oFactory,
			oInnerControl,
			oControl,
			done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});
		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.property.property = JSON.parse(JSON.stringify(oFactory._oMetaData.property.property));
			oFactory._oMetaData.property.property["com.sap.vocabularies.UI.v1.MultiLineText"] = true;
			oInnerControl = oFactory._createEdmString(oFactorySettings);
			oParent._oControl = {"edit" : oInnerControl.control};
			oControl = oFactory._createEdmDisplay(oFactorySettings);

			// assert
			assert.equal(oControl.control instanceof ExpandableText, true);
			assert.equal(oControl.control.getId(), oParent.getId() + "-expandableText");

			// cleanup
			oControl.control.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_createEdmDisplay - return ExpandableText when initially loaded in display mode", function(assert) {
		var oFactory,
			oControl,
			done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oModel);

		oParent.getConfiguration.returns({
			getControlType: function() {
				return "dropDownList";
			},
			getDisplayBehaviour: function(){
				return null;
			}
		});

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		var oFactorySettings = {mode: oParent.getMode()};

		oFactory.bind(oFactorySettings).finally(function() {
			oFactory._oMetaData.property.property = JSON.parse(JSON.stringify(oFactory._oMetaData.property.property));
			oFactory._oMetaData.property.property["com.sap.vocabularies.UI.v1.MultiLineText"] = true;
			oControl = oFactory._createEdmDisplay(oFactorySettings).control;

			// assert
			assert.equal(oControl instanceof ExpandableText, true);
			assert.equal(oControl.getId(), oParent.getId() + "-expandableText");
			assert.equal(oControl.getRenderWhitespace(), true, "renderWhitespace property of the TextArea control is set to true");
			assert.equal(oControl.getEmptyIndicatorMode(), EmptyIndicatorMode.Auto, "EmptyIndicatorMode is correctly set on the inner sap.m.ExpandableText control");

			// cleanup
			oControl.destroy();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("it should not try to load the ValueList annotation if the annotation is not specified " +
	           "in the service metadata", function(assert) {
		// Note: in this test setup, by default the ValueList annotation is not specified in the metadata

		var done = assert.async();

		// system under test
		var oSmartFieldStub = fCreateSmartFieldStub(this.oModel);

		// arrange
		oSmartFieldStub.getTextInEditModeSource.returns(TextInEditModeSource.NavigationProperty);
		oSmartFieldStub.isTextInEditModeSourceNotNone.returns(true);
		var oODataControlFactory = new ODataControlFactory(this.oModel, oSmartFieldStub, {
			entitySet: "Project",
			path: "Amount"
		});
		var oLoadValueListAnnotationSpy = this.spy(oODataControlFactory._oHelper, "loadValueListAnnotation");
		var oInitSpy = this.spy(oODataControlFactory, "_init");

		// act
		oODataControlFactory.bind({mode: oSmartFieldStub.getMode()}).finally(function() {

			// assert
			assert.ok(oLoadValueListAnnotationSpy.notCalled, "the .loadValueListAnnotation() method should not be invoked");
			assert.ok(oInitSpy.calledOnce, "it should initialize the metadata only once");

			// cleanup
			oODataControlFactory.destroy();
			done();
		});
	});

	/**
	 * @deprecated Since 1.32.0
	 */
	QUnit.test("_getCreator", function(assert) {
		var oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getEditable.returns(true);
		oParent.getEnabled.returns(true);
		oParent.getContextEditable.returns(true);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Time"
			}
		};
		var oFactorySettings = {mode: oParent.getMode()};

		var sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmTime");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.String"
			}
		};
		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmString");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Int16"
			}
		};
		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmNumeric");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.DateTime"
			}
		};
		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmDateTime");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.DateTimeOffset"
			}
		};
		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmDateTimeOffset");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Decimal"
			}
		};
		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmNumeric");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Single"
			}
		};
		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmNumeric");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Float"
			}
		};
		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmNumeric");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Double"
			}
		};
		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmNumeric");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Byte"
			}
		};
		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmNumeric");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Decimal"
			}
		};
		oFactory._oMetaData.annotations.uom = true;
		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmUOM");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Decimal"
			}
		};
		oParent.getEditable.returns(true);
		oParent.getMode.returns("display");

		oFactorySettings = {mode: oParent.getMode()};

		oFactory._oMetaData.annotations.semantic = true;
		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmSemantic");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Boolean"
			}
		};
		oFactory._oMetaData.annotations = {};
		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmBoolean");

		oParent.getEditable.returns(false);

		oFactorySettings = {mode: oParent.getMode()};

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Boolean"
			}
		};
		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmBoolean");

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Decimal"
			}
		};
		oFactory._oMetaData.annotations.uom = true;
		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmUOMDisplay");

		oParent.getEditable.returns(false);

		oFactorySettings = {mode: oParent.getMode()};

		oParent.data.returns({
			configdata: {
				isUOM: true,
				getContextEditable: function() {
					return false;
				}
			}
		});

		oFactory._oMetaData.property = {
			property: {
				type: "Edm.Decimal"
			}
		};
		oFactory._oMetaData.annotations.uom = true;
		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmUOMDisplay");

		oParent.getEditable.returns(true);
		oParent.getMode.returns("edit");
		oFactorySettings = {mode: oParent.getMode()};

		oParent.data.returns(null);
		oFactory._oMetaData.annotations.uom = false;
		oFactory._oMetaData.property = null;

		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, null);

		oParent.getControlProposal.returns({
			getControlType: function() {
				return null;
			},
			getObjectStatus: function() {
				return {};
			}
		});
		oParent.getEditable.returns(false);
		oParent.getMode.returns("display");

		oFactorySettings = {mode: oParent.getMode()};

		oFactory._oMetaData.annotations = true;
		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createProposedObjectStatus");

		oParent.getControlProposal.returns({
			getControlType: function() {
				return null;
			},
			getObjectStatus: function() {
				return {};
			}
		});
		oParent.getEditable.returns(false);

		oParent.getUomEditable.returns(false);

		oFactorySettings = {mode: oParent.getMode()};

		oFactory._oMetaData.annotations = {
			uom: true
		};

		sMethod = oFactory._getCreator(oFactorySettings);
		assert.equal(sMethod, "_createEdmUOMObjectStatus");

		oFactory.destroy();
	});

	/**
	 * @deprecated Since 1.32.0
	 */
	QUnit.test("ODataControlSelector.getCreator shall return _createEdmUOMObjectNumber", function(assert) {
		var oSelector, oParent, oMetaData = {
			annotations: {
				uom: true
			}
		};

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getEditable.returns(true);
		oParent.getEnabled.returns(true);
		oParent.getProposedControl.returns("ObjectNumber");
		oParent.getConfiguration.returns({
			getControlType: function() {
				return "objectIdentifier";
			}
		});

		oSelector = new ODataControlSelector(oMetaData, oParent);
		assert.equal(oSelector.getCreator(), "_createEdmUOMObjectNumber");

		oSelector.destroy();
	});

	/**
	 * @deprecated Since 1.32.0
	 */
	QUnit.test("ODataControlSelector._isUOMDisplay shall return true", function(assert) {
		var oSelector, oParent, oMetaData = {
			annotations: {
				uom: true
			}
		};
		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getEditable.returns(true);
		oParent.getEnabled.returns(true);
		oParent.getProposedControl.returns("ObjectNumber");
		oParent.getConfiguration.returns({
			getControlType: function() {
				return "objectIdentifier";
			}
		});

		oSelector = new ODataControlSelector(oMetaData, oParent);
		assert.ok(oSelector._isUOMDisplay());

		oSelector.destroy();
	});

	/**
	 * @deprecated Since 1.32.0
	 */
	QUnit.test("ODataControlSelector._isUOMDisplay shall return true for uomEditState = 0", function(assert) {
		var oSelector, oParent, oMetaData = {
			annotations: {
				uom: true
			}
		};

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getEditable.returns(true);
		oParent.getEnabled.returns(true);
		oParent.getContextEditable.returns(true);
		oParent.getProposedControl.returns("ObjectNumber");
		oParent.getProperty.returns(0);
		oParent.getConfiguration.returns({
			getControlType: function() {
				return "objectIdentifier";
			}
		});

		oSelector = new ODataControlSelector(oMetaData, oParent);
		assert.ok(oSelector._isUOMDisplay());

		oSelector.destroy();
	});

	QUnit.test("ODataControlSelector._isUOMDisplay shall return false", function(assert) {
		var oSelector, oParent, oMetaData = {
			annotations: {
				uom: true
			}
		};

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getEditable.returns(true);
		oParent.getEnabled.returns(true);
		oParent.getContextEditable.returns(true);

		oSelector = new ODataControlSelector(oMetaData, oParent);
		assert.ok(!oSelector._isUOMDisplay());

		oSelector.destroy();
	});

	/**
	 * @deprecated Since 1.32.0
	 */
	QUnit.test("ODataControlSelector._isUOMDisplayObjectStatus shall return true", function(assert) {
		var oSelector, oParent, oMetaData = {
			annotations: {
				uom: true
			}
		};

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getEditable.returns(true);
		oParent.getEnabled.returns(true);
		oParent.getControlProposal.returns({
			getObjectStatus: function() {
				return {};
			}
		});

		oSelector = new ODataControlSelector(oMetaData, oParent);
		assert.ok(oSelector._isUOMDisplayObjectStatus());

		oSelector.destroy();
	});

	/**
	 * @deprecated Since 1.34.0
	 */
	QUnit.test("ODataControlSelector._isUOMDisplayObjectStatus shall return false", function(assert) {
		var oSelector, oParent, oMetaData = {
			annotations: {
				uom: true
			}
		};

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getEditable.returns(true);
		oParent.getEnabled.returns(true);
		oParent.getContextEditable.returns(true);
		oParent.getControlProposal.returns({
			getObjectStatus: function() {
				return {};
			}
		});

		oSelector = new ODataControlSelector(oMetaData, oParent);
		assert.ok(!oSelector._isUOMDisplayObjectStatus());

		oSelector.destroy();
	});

	/**
	 * @deprecated Since 1.32.0
	 */
	QUnit.test("ODataControlSelector._isObjectStatusProposed shall return true", function(assert) {
		var oSelector, oParent, oMetaData = {
			annotations: {
				uom: true
			}
		};

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getEditable.returns(true);
		oParent.getEnabled.returns(true);
		oParent.getControlProposal.returns({
			getObjectStatus: function() {
				return {};
			}
		});

		oSelector = new ODataControlSelector(oMetaData, oParent);
		assert.ok(oSelector._isObjectStatusProposed());

		oSelector.destroy();
	});

	QUnit.test("ODataControlSelector._isObjectStatusProposed shall return false", function(assert) {
		var oSelector, oParent, oMetaData = {
			annotations: {
				uom: true
			}
		};

		oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getEditable.returns(true);
		oParent.getEnabled.returns(true);
		oParent.getContextEditable.returns(true);

		oSelector = new ODataControlSelector(oMetaData, oParent);
		assert.ok(!oSelector._isObjectStatusProposed());

		oSelector.destroy();
	});

	QUnit.test("bind", function(assert) {
		var done = assert.async(),
			iCount = 0;

		var oControl = fCreateSmartFieldStub(this.oModel);
		oControl.getMode.returns("edit");
		oControl.bindProperty = function(sName) {
			if (sName === "editable" || sName === "visible" || sName === "mandatory") {
				iCount++;
			} else {
				iCount--;
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oControl, {
			entitySet: "Project",
			path: "Description"
		});
		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind({mode: oControl.getMode()}).finally(function() {
			oFactory.triggerCreationOfControls();

			// assert
			assert.equal(iCount, 3);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("bind - asynchronous model loading", function(assert) {
		var done = assert.async(),
			iCount = 0;

		var oControl = fCreateSmartFieldStub(this.oModel);
		oControl.bindProperty = function(sName) {
			if (sName === "editable" || sName === "visible" || sName === "mandatory") {
				iCount++;
			} else {
				iCount--;
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oControl, {
			entitySet: "Project",
			path: "Description"
		});
		oFactory._oModel.oMetadata = {
			bLoaded: false
		};

		oFactory._oModel.getMetaModel = function() {
			return {
				loaded: function() {
					return Promise.resolve();
				},
				getProperty: function() {

				},
				getODataEntityType: function() {

				},
				getODataComplexType: function() {
				},
				getODataProperty: function() {
				}
			};
		};

		oFactory.bind({mode: oControl.getMode()}).finally(function() {
			oFactory.triggerCreationOfControls();

			// assert
			assert.equal(iCount, 3);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("bind - throws an exception", function(assert) {
		var done = assert.async(),
			iCount = 0;

		var oControl = fCreateSmartFieldStub(this.oModel);
		oControl.bindProperty = function(sName) {
			if (sName === "enabled" || sName === "visible" || sName === "mandatory") {
				iCount++;
			} else {
				iCount--;
			}
		};

		oControl.getMode = SmartField.prototype.getMode.bind(oControl);

		var oFactory = new ODataControlFactory(this.oModel, oControl, {
			entitySet: "ProjectInvalid",
			path: "Description"
		});

		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind({mode: oControl.getMode()}).finally(function() {

			// assert
			assert.equal(iCount, 0);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_onCreate with sap:value-list", function(assert) {
		var done = assert.async(),
			iFormat = 0,
			iCount = 0;

		var oControl = fCreateSmartFieldStub(this.oModel);
		oControl.attachFormatError = function() {
			iFormat++;
		};
		oControl.attachParseError = function() {
			iFormat++;
		};
		oControl.attachValidationError = function() {
			iFormat++;
		};
		oControl.attachValidationSuccess = function() {
			iFormat++;
		};
		oControl.fireValueListChanged = function() {
			iCount++;
		};
		oControl.getMetadata.returns({
			getName: function() {
				return "Input";
			}
		});
		oControl.getValue.returns("testtest");
		oControl.getEnabled.returns(true);
		oControl.getEditable.returns(true);
		oControl.getMode.returns("edit");

		var oVHPStub = this.stub(ValueHelpProvider.prototype, "destroy").returns(function() {});
		var oVLPStub = this.stub(ValueListProvider.prototype, "destroy").returns(function() {});
		var oFactory = new ODataControlFactory(this.oVHModel, oControl, {
			entitySet: "Headers",
			path: "AccountingDocumentCategory"
		});
		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind({mode: oControl.getMode()}).finally(function() {
			var oAnnotation = "foo";
			oFactory._oMetaData.property.property = {
				"sap:value-list": "standard"
			};

			var mParams = {
				getValue: "getValue",
				valuehelp: {
					annotation: oAnnotation
				}
			};
			oFactory._onCreate(oControl, mParams);

			// assert
			assert.equal(iFormat, 4);
			assert.equal(oFactory._aProviders.length, 2);

			for (var i = 0; i < 2; i++) {
				oFactory._aProviders[i].fireEvent("valueListChanged", {
					"changes": {}
				});
			}

			// assert
			assert.equal(iCount, 2);
			assert.equal(mParams.getValue(), "testtest");

			// cleanup
			oFactory._aProviders = [];
			oVHPStub.restore();
			oVLPStub.restore();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_onCreate with com.sap.vocabularies.Common.v1.ValueList", function(assert) {
		var done = assert.async();
		var iFormat = 0;

		var oControl = fCreateSmartFieldStub(this.oModel);
		oControl.attachFormatError = function() {
			iFormat++;
		};
		oControl.attachParseError = function() {
			iFormat++;
		};
		oControl.attachValidationError = function() {
			iFormat++;
		};
		oControl.attachValidationSuccess = function() {
			iFormat++;
		};
		oControl.getMetadata.returns({
			getName: function() {
				return "Input";
			}
		});
		oControl.getEnabled.returns(true);
		oControl.getEditable.returns(true);
		oControl.getMode.returns("edit");
		oControl.getValue.returns("testtest");

		var oVHPStub = this.stub(ValueHelpProvider.prototype, "destroy").returns(function() {});
		var oVLPStub = this.stub(ValueListProvider.prototype, "destroy").returns(function() {});
		var oFactory = new ODataControlFactory(this.oVHModel, oControl, {
			entitySet: "Headers",
			path: "AccountingDocumentCategory"
		});
		oFactory._oModel.oMetadata = {
			bLoaded: true
		};
		oFactory.bind({mode: oControl.getMode()}).finally(function() {
			var oAnnotation = "foo";
			oFactory._oMetaData.property.property = {
				"com.sap.vocabularies.Common.v1.ValueList": {}
			};

			var mParams = {
				getValue: "getValue",
				valuehelp: {
					annotation: oAnnotation
				}
			};
			oFactory._onCreate(oControl, mParams);
			assert.equal(iFormat, 4);
			assert.equal(oFactory._aProviders.length, 2);
			assert.equal(mParams.getValue(), "testtest");

			// cleanup
			oFactory._aProviders = [];
			oVHPStub.restore();
			oVLPStub.restore();
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_onCreate - no value help and no validations added", function(assert) {
		var done = assert.async(),
			iFormat = 0;

		var oControl = fCreateSmartFieldStub(this.oModel);
		oControl.attachFormatError = function() {
			iFormat++;
		};
		oControl.attachParseError = function() {
			iFormat++;
		};
		oControl.attachValidationError = function() {
			iFormat++;
		};
		oControl.attachValidationSuccess = function() {
			iFormat++;
		};
		oControl.getMode.returns("edit");
		oControl.getEditable.returns(true);

		var oFactory = new ODataControlFactory(this.oModel, oControl, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind({mode: oControl.getMode()}).finally(function() {
			oFactory._onCreate(oControl, {
				noValidation: true
			});

			// assert
			assert.equal(iFormat, 0);
			assert.equal(oFactory._aProviders.length, 0);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_getValueHelpDialogTitle", function(assert) {
		var done = assert.async();
		var oControl = fCreateSmartFieldStub(this.oModel);
		oControl.getValue.returns("testtest");
		oControl.getEditable.returns(true);
		oControl.getComputedTextLabel = function () {
			return this.getTextLabel() || this._sAnnotationLabel;
		}.bind(oControl);

		var oFactory = new ODataControlFactory(this.oVHModel, oControl, {
			entitySet: "Headers",
			path: "AccountingDocumentCategory"
		});
		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind({mode: oControl.getMode()}).finally(function() {
			oV4Helper.addSAPAnnotation(oFactory._oMetaData.property.property,"label","State of the Amount");
			oV4Helper.liftV4Annotations(oFactory._oMetaData);

			var mParams = {};
			oFactory._getValueHelpDialogTitle(mParams);
			assert.equal(mParams.dialogtitle, "State of the Amount");

			oV4Helper.removeSAPAnnotation(oFactory._oMetaData.property.property,"label");
			oV4Helper.liftV4Annotations(oFactory._oMetaData);
			oFactory._getValueHelpDialogTitle(mParams);
			assert.equal(mParams.dialogtitle, "AccountingDocumentCategory");

			oControl.getTextLabel.returns("textLabel");

			oFactory._getValueHelpDialogTitle(mParams);
			assert.equal(mParams.dialogtitle, "textLabel");

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("getDataProperty", function(assert) {
		var done = assert.async();

		var oParent = fCreateSmartFieldStub(this.oModel);
		oParent.getEditable.returns(true);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTime"
		});
		oFactory._oModel.oMetadata = {
			bLoaded: true
		};
		oFactory.bind({mode: oParent.getMode()}).finally(function() {

			// assert
			assert.equal(oFactory.getDataProperty().property.type, "Edm.DateTimeOffset");

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("Create factory with binding to navigation property", function(assert) {
		var done = assert.async();

		var oControl = fCreateSmartFieldStub(this.oModel);
		oControl.getEnabled.returns(true);
		oControl.getVisible.returns(true);
		oControl.getEditable.returns(true);
		oControl.getMandatory.returns(true);
		oControl.getObjectBinding.returns({
			sPath: "Tasks"
		});

		var oFactory = new ODataControlFactory(this.oModel, oControl, {
			entitySet: "Project",
			path: "Description"
		});
		oFactory._oModel.oMetadata = {
			bLoaded: true
		};
		oFactory.bind({mode: oControl.getMode()}).finally(function() {

			// assert
			assert.equal(oFactory._oMetaData.entityType.name, "Task_Type");

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_handleEventingForEdmString", function(assert) {
		var done = assert.async(),
			fChange,
			iChange = 0,
			oControl;

		oControl = fCreateSmartFieldStub(this.oModel);
		oControl.attachChange = function(fEvent) {
			fChange = fEvent;
			return this;
		}.bind(oControl);
		oControl.fireChange = function() {
			iChange++;
		};
		oControl.getObjectBinding.returns({
			sPath: "Tasks"
		});
		oControl.getEditable.returns(true);
		oControl._oSuggestionPopup = {
			isOpen: function() {
				return true;
			},
			getContent: function() {
				return [{
					isA: function() { return true; },
					getSelectedItem: function() { return true; }
				}];
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oControl, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind({mode: oControl.getMode()}).finally(function() {
			oFactory._handleEventingForEdmString({ control: oControl, edmProperty: oFactory._oMetaData.property.property });
			fChange();
			fChange({
				getParameters: function() {
					return {
						validated: true
					};
				},
				getSource: function() {}
			});
			fChange({
				getParameters: function() {
					return {
						validated: false
					};
				},
				getSource: function() {}
			});
			oControl.fireChange = function() {
				iChange++;
				throw "error";
			};
			fChange({
				getParameters: function() {
					return {
						validated: true
					};
				},
				getSource: function() {}
			});

			assert.equal(iChange, 2);
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_handleEventingForEdmString - currency", function(assert) {
		var done = assert.async(),
			fChange,
			iChange = 0,
			oControl;

		oControl = fCreateSmartFieldStub(this.oModel);
		oControl.attachChange = function(fEvent) {
			fChange = fEvent;
			return this;
		}.bind(oControl);
		oControl.fireChange = function() {
			iChange++;
		};
		oControl.getObjectBinding.returns({
			sPath: "Tasks"
		});
		oControl.getEditable.returns(true);
		oControl._oSuggestionPopup = {
			isOpen: function() {
				return true;
			},
			getContent: function() {
				return [{
					isA: function() { return true; },
					getSelectedItem: function() { return true; }
				}];
			}
		};

		var oFactory = new ODataControlFactory(this.oModel, oControl, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory.getCurrencyValidationSettings = function(){
			return {};
		};

		oFactory.updateModelPropertiesForCurrency  = function(){
		};

		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind({mode: oControl.getMode()}).finally(function() {
			oFactory._handleEventingForEdmString({currency: {},  control: oControl, edmProperty: oFactory._oMetaData.property.property });
			fChange();
			fChange({
				getParameters: function() {
					return {
						validated: true
					};
				},
				getSource: function() {}
			});
			fChange({
				getParameters: function() {
					return {
						validated: false
					};
				},
				getSource: function() {}
			});
			oControl.fireChange = function() {
				iChange++;
				throw "error";
			};
			fChange({
				getParameters: function() {
					return {
						validated: true
					};
				},
				getSource: function() {}
			});

			assert.equal(iChange, 2);
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_handleEventingForEdmString - currency OneWay binding", function(assert) {
		var done = assert.async(),
			fChange,
			fnUpdateModelPropertiesForCurrencySpy,
			oModel = sinon.createStubInstance(ODataModel),
			oParent = sinon.createStubInstance(SmartField),
			oEventObject = sinon.createStubInstance(Event),
			oInput = sinon.createStubInstance(Input);

		oParent.getModel.returns(oModel);
		oParent.getMode.returns("edit");
		oInput.getBindingInfo.withArgs("value").returns({
			parts: [{mode: "OneWay"}]
		});

		oInput.attachChange.value(function(fEvent) {
			fChange = fEvent;
			return this;
		}.bind(oInput));

		oEventObject.getParameters.returns({});
		oEventObject.getSource.returns(oInput);

		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		fnUpdateModelPropertiesForCurrencySpy = sinon.stub(oFactory, "updateModelPropertiesForCurrency");
		sinon.stub(oFactory, "getCurrencyValidationSettings").returns(function(){return {};});

		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			oFactory._handleEventingForEdmString({currency: true,  control: oInput, edmProperty: oFactory._oMetaData.property.property });
			fChange(oEventObject);

			assert.equal(fnUpdateModelPropertiesForCurrencySpy.callCount, 0);
			oFactory.destroy();
			oParent = null;
			oInput = null;
			oEventObject = null;
			done();
		});
	});

	QUnit.test("Should throw 'The meta model could not be loaded' exception", function(assert) {
		var oFactory,
			done = assert.async(),
			oError = new Error("ReferenceError"),
			fnLogError = sinon.spy(Log, "error"),
			oModel = sinon.createStubInstance(ODataModel),
			oParent = sinon.createStubInstance(SmartField);

		oParent.getModel.returns(oModel);
		oParent.getMode.returns("edit");

		oModel.isA.returns(true);
		oModel.getMetaModel.returns({loaded: true});

		oFactory = new ODataControlFactory(oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		sinon.stub(ODataModelUtilSync, "_flexRuntimeInfoAPIHandler").callsFake(function(){
			return Promise.reject(oError);
		});

		oFactory._metadataInitialise().finally(function() {
			assert.ok(fnLogError.calledOnceWith("The meta model could not be loaded.", oError), "'The meta model could not be loaded.' was logged.");
			// cleanup
			ODataModelUtilSync._flexRuntimeInfoAPIHandler.restore();
			Log.error.restore();
			oModel = null;
			oError = null;
			oParent = null;
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("Shall be destructible", function(assert) {
		var oFactory, oParent, oProvider, bDestroy = false;

		oParent = fCreateSmartFieldStub(this.oModel);

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTime"
		});
		oProvider = {
			destroy: function() {
				bDestroy = true;
			}
		};
		oFactory._aProviders.push(oProvider);
		oFactory.destroy();
		assert.ok(oFactory);
		assert.equal(oFactory._oParent, null);
		assert.equal(bDestroy, true);
	});

	QUnit.test("createControl with complex type", function(assert) {
		var oFactory, oSet, oType, oProperty, oControl, oParent, oComplexTypes;

		oParent = fCreateSmartFieldStub(this.oModel);

		oComplexTypes = JSON.parse("[{\"name\":\"AcctgDocSimTmpKey\",\"property\":[{\"name\":\"TmpIdType\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"label\",\"value\":\"Temp. Belegart\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TmpId\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"22\",\"extensions\":[{\"name\":\"label\",\"value\":\"Temp. Beleg-ID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CompanyCode\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Buchungskreis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"FiscalYear\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Geschäftsjahr\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]},{\"name\":\"AcctgDocHdrPayment\",\"property\":[{\"name\":\"HouseBank\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcHouseBank\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Hausbank\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"GLAccount\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcGLAccount\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Sachkonto\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"GLAccountName\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"20\",\"extensions\":[{\"name\":\"label\",\"value\":\"Kurztext\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"HouseBankAccount\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcHouseBankAccount\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Konto-Id\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AmountInTransCrcy\",\"type\":\"Edm.Decimal\",\"precision\":\"13\",\"scale\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAmountInTransCrcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"TransactionCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Betrag\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TransactionCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Währung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AmountInCoCodeCrcy\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\",\"precision\":\"13\",\"scale\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAmountInCoCodeCrcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"CoCodeCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Hauswährungsbetrag\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CoCodeCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Hauswährung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"BusinessArea\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcBusinessArea\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"GeschBereich\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ProfitCenter\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcProfitCenter\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Profitcenter\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"DocumentItemText\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"50\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcDocumentItemText\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Positionstext\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AssignmentReference\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"18\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAssignmentReference\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Zuordnung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ValueDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcValueDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Valutadatum\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcHouseBank\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcGLAccount\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcHouseBankAccount\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAmountInTransCrcy\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAmountInCoCodeCrcy\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcBusinessArea\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcProfitCenter\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcDocumentItemText\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAssignmentReference\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcValueDate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}],\"namespace\":\"FAC_FINANCIALS_POSTING_SRV\"},{\"name\":\"AcctgDocHdrBankCharges\",\"property\":[{\"name\":\"AmountInTransCrcy\",\"type\":\"Edm.Decimal\",\"precision\":\"13\",\"scale\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAmountInTransCrcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"TransactionCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Betrag\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TransactionCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Währung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AmountInCoCodeCrcy\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\",\"precision\":\"13\",\"scale\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAmountInCoCodeCrcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"CoCodeCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Hauswährungsbetrag\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CoCodeCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Hauswährung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TaxCode\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcTaxCode\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Umsatzsteuer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcTaxCode\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAmountInCoCodeCrcy\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAmountInTransCrcy\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]},{\"name\":\"FunctionImportDummyReturn\",\"property\":[{\"name\":\"Dummy\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]},{\"name\":\"AcctgDocTmpKey\",\"property\":[{\"name\":\"TmpIdType\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"label\",\"value\":\"Temp. Belegart\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TmpId\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"22\",\"extensions\":[{\"name\":\"label\",\"value\":\"Temp. Beleg-ID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]},{\"name\":\"AcctgDocKey\",\"property\":[{\"name\":\"AccountingDocument\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Belegnummer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CompanyCode\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Geschäftsjahr\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"FiscalYear\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Belegnummer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]},{\"name\":\"APARAccountKey\",\"property\":[{\"name\":\"CompanyCode\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Buchungskreis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"APARAccount\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Konto\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]}]");
					oSet = JSON.parse("{\"name\":\"FinsPostingPaymentHeaders\",\"entityType\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostingPaymentHeader\",\"extensions\":[{\"name\":\"pageable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}");
					oType =
							JSON
								.parse("{\"name\":\"FinsPostingPaymentHeader\",\"key\":{\"propertyRef\":[{\"name\":\"TmpId\"},{\"name\":\"TmpIdType\"}]},\"property\":[{\"name\":\"BankCharges\",\"type\":\"FAC_FINANCIALS_POSTING_SRV.AcctgDocHdrBankCharges\",\"nullable\":\"false\"},{\"name\":\"Payment\",\"type\":\"FAC_FINANCIALS_POSTING_SRV.AcctgDocHdrPayment\",\"nullable\":\"false\"},{\"name\":\"AccountingDocument\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAccountingDocument\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Belegnummer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AccountingDocumentCategory\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"label\",\"value\":\"Belegstatus\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AccountingDocumentHeaderText\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"25\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAccountingDocumentHeaderText\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Kopftext\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AccountingDocumentType\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAccountingDocumentType\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Belegart\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AccountingDocumentTypeName\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"40\",\"extensions\":[{\"name\":\"label\",\"value\":\"Langtext\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CompanyCode\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcCompanyCode\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Buchungskreis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CompanyCodeCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Hauswährung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CompanyCodeName\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"54\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"DisplayCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Anzeigewährung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"DocumentDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"field-control\",\"value\":\"UxFcDocumentDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Belegdatum\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"DocumentReferenceID\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"16\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcDocumentReferenceID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Referenz\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ExchangeRate\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcExchangeRate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Umrechnungskurs\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ExchangeRateDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcExchangeRateDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Umrechnungsdatum\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ExchangeRateForTaxes\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcExchangeRateForTaxes\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Umrechnungskurs\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"FiscalPeriod\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcFiscalPeriod\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Periode\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"FiscalYear\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Geschäftsjahr\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"HasInvoiceReference\",\"type\":\"Edm.Boolean\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"Rechn.bez. berücks.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"IntercompanyTransaction\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"16\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcIntercompanyTransaction\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"GesellschÜbergr. TA\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"IsNetEntry\",\"type\":\"Edm.Boolean\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcIsNetEntry\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Nettoerfassung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"LedgerGroup\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcLedgerGroup\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Ledger-Gruppe\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"NoteToPayee\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"Verwendungszweck\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"PostingDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"field-control\",\"value\":\"UxFcPostingDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Buchungsdatum\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ScreenVariant\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Variante\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TaxIsCalculatedAutomatically\",\"type\":\"Edm.Boolean\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcTaxIsCalculatedAutomatically\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Steuer rechnen\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TaxReportingDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcTaxReportingDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Steuermeldedat.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TmpId\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"22\",\"extensions\":[{\"name\":\"label\",\"value\":\"Temporäre ID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TmpIdType\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"label\",\"value\":\"Art der temporären ID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TotalCreditAmountInDisplayCrcy\",\"type\":\"Edm.Decimal\",\"precision\":\"17\",\"scale\":\"2\",\"extensions\":[{\"name\":\"unit\",\"value\":\"DisplayCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Habensumme\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TotalDebitAmountInDisplayCrcy\",\"type\":\"Edm.Decimal\",\"precision\":\"17\",\"scale\":\"2\",\"extensions\":[{\"name\":\"unit\",\"value\":\"DisplayCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Sollsumme\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TotalNetAmountInDisplayCrcy\",\"type\":\"Edm.Decimal\",\"precision\":\"17\",\"scale\":\"2\",\"extensions\":[{\"name\":\"unit\",\"value\":\"DisplayCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Nettosumme der Posten\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TransactionCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcTransactionCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Transaktionswährung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxAction\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"15\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAccountingDocument\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAccountingDocumentHeaderText\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAccountingDocumentType\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcCompanyCode\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcDocumentDate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcDocumentReferenceID\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcExchangeRate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcExchangeRateDate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcExchangeRateForTaxes\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcFiscalPeriod\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcIntercompanyTransaction\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcIsNetEntry\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcLedgerGroup\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcPostingDate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcTaxIsCalculatedAutomatically\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcTaxReportingDate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcTransactionCurrency\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxProcessTaxAlways\",\"type\":\"Edm.Boolean\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"Flag\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxStatus\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"label\",\"value\":\"Datnerfassgsstats\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}],\"navigationProperty\":[{\"name\":\"Attachments\",\"relationship\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostPaytHdrAttachment\",\"fromRole\":\"FromRole_FinsPostPaytHdrAttachment\",\"toRole\":\"ToRole_FinsPostPaytHdrAttachment\"},{\"name\":\"Notes\",\"relationship\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostPaytHdrNote\",\"fromRole\":\"FromRole_FinsPostPaytHdrNote\",\"toRole\":\"ToRole_FinsPostPaytHdrNote\"},{\"name\":\"APARItemsToBeClrd\",\"relationship\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostPaytHdrAPARItemToBeClrd\",\"fromRole\":\"FromRole_FinsPostPaytHdrAPARItemToBeClrd\",\"toRole\":\"ToRole_FinsPostPaytHdrAPARItemToBeClrd\"},{\"name\":\"APARItems\",\"relationship\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostPaytHdrAPARItem\",\"fromRole\":\"FromRole_FinsPostPaytHdrAPARItem\",\"toRole\":\"ToRole_FinsPostPaytHdrAPARItem\"},{\"name\":\"Items\",\"relationship\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostPaytHdrGLItm\",\"fromRole\":\"FromRole_FinsPostPaytHdrGLItm\",\"toRole\":\"ToRole_FinsPostPaytHdrGLItm\"}],\"extensions\":[{\"name\":\"service-schema-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"service-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"namespace\":\"FAC_FINANCIALS_POSTING_SRV\",\"entityType\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostingPaymentHeader\"}");

		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "StartDateTime"
		});

		this.oModel.getServiceMetadata().dataServices.schema[0].complexType = oComplexTypes;
		this.oModel.getServiceMetadata().dataServices.schema[0].namespace = "FAC_FINANCIALS_POSTING_SRV";

		oProperty = JSON.parse("{\"property\":{\"name\":\"ValueDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcValueDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Valutadatum\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},\"extensions\":{\"sap:filterable\":{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:sortable\":{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:creatable\":{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:label\":{\"name\":\"label\",\"value\":\"Valutadatum\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:field-control\":{\"name\":\"field-control\",\"value\":\"UxFcValueDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}},\"typePath\":\"AcctgDocHdrPayment/ValueDate\",\"complex\":true}");
		oFactory._oMetaData.entitySet = oSet;
		oFactory._oMetaData.entityType = oType;
		oFactory._oMetaData.property = oProperty;
		oFactory._oMetaData.namespace = "ZMEY_SRV";
		oFactory._oMetaData.path = "Payment/ValueDate";

		oControl = oFactory.createControl({mode: oParent.getMode()});
		assert.ok(oControl);

		oControl.control.destroy();
		oFactory.destroy();
	});

	QUnit.test("createControl with complex type (Unit of Measure)", function(assert) {
		var done = assert.async(),

		oParent = fCreateSmartFieldStub(this.oComplexModel);

		oParent.getBindingContext.returns({
			sPath: "/FinsPostingPaymentHeaders(TmpId='3HLDC27520',TmpIdType='T')",
			getPath: function(){
				return this.sPath;
			}
		});

		var oFactory = new ODataControlFactory(this.oComplexModel, oParent, {
			entitySet: "FinsPostingPaymentHeaders",
			path: "Payment/AmountInCoCodeCrcy"
		});

		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			var oControl = oFactory.createControl({mode: oParent.getMode()});

			// assert
			assert.ok(oControl);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_getUOMPath", function(assert) {
		var done = assert.async(),
			oParent = fCreateSmartFieldStub(this.oComplexModel);

		oParent.getBindingContext.returns({
			sPath: "/FinsPostingPaymentHeaders(TmpId='3HLDC27520',TmpIdType='T')",
			getPath: function(){
				return this.sPath;
			}
		});
		oParent.getBindingInfo.returns({
			"parts": [
				{
					model: undefined,
					path: "ID"
				}
			]
		});

		var oFactory = new ODataControlFactory(this.oComplexModel, oParent, {
			entitySet: "FinsPostingPaymentHeaders",
			path: "Payment/AmountInCoCodeCrcy"
		});

		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			var sPath = oFactory._oHelper.getUOMPath(oFactory._oMetaData);
			assert.equal(sPath, "Payment/CoCodeCurrency");

			sPath = oFactory._oHelper.getUOMPath({});
			assert.equal(!sPath, true);

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("_checkUOM", function(assert) {
		var done = assert.async();
		var oParent = fCreateSmartFieldStub(this.oModel);


		var oFactory = new ODataControlFactory(this.oComplexModel, oParent, {
			entitySet: "FinsPostingPaymentHeaders",
			path: "Payment/AmountInCoCodeCrcy"
		});

		oFactory._oModel.oMetadata = {
			bLoaded: true
		};

		oFactory.bind({mode: oParent.getMode()}).finally(function() {
			assert.ok(!oFactory._checkUOM());

			oParent.data = function() {
				return {
					configdata: {
						onText: true,
						onInput: false
					}
				};
			};

			assert.ok(oFactory._checkUOM());

			oParent.data = function() {
				return {
					configdata: {
						onText: false,
						onInput: true
					}
				};
			};

			assert.ok(oFactory._checkUOM());

			// cleanup
			oFactory.destroy();
			done();
		});
	});

	QUnit.test("it should return the binding data type of the provided control", function(assert) {

		// arrange
		var oExpectedStringType = new StringType();
		var oComboBox = new ComboBox({
			selectedKey: {
				path: "CategoryID",
				type: oExpectedStringType
			}
		});
		var oSmartField = new SmartField();
		oSmartField.setContent(oComboBox);

		// system under test
		var oFactory = new ODataControlFactory(this.oModel, oSmartField, {
			entitySet: "lorem",
			path: "loremPath"
		});

		// act
		var oStringType = oFactory.getDropdownItemKeyType(oComboBox);

		// assert
		assert.strictEqual(oStringType, oExpectedStringType);

		// cleanup
		oSmartField.destroy();
		oFactory.destroy();
	});

	QUnit.test("it should pass ODataModel instance from oMetaData parameter to ODataHelper", function(assert) {

		// Arrange
		var sODataModelId = "ODataModelTestId",
			oODataModel = sinon.createStubInstance(ODataModel),
			oSmartField = sinon.createStubInstance(SmartField);

		oODataModel.getId.returns(sODataModelId);

		// Act
		var oFactory = new ODataControlFactory(null, oSmartField, {
			entitySet: "lorem",
			path: "loremPath",
			modelObject: oODataModel
		});

		// Assert
		assert.strictEqual(oFactory._oHelper._oModel.getId(), sODataModelId);

		// Cleanup
		oODataModel = null;
		oSmartField = null;
		oFactory.destroy();
	});

	QUnit.module("getBoundPropertiesMapInfoForControl");

	QUnit.test('it should return the correct mapping information for "sap.m.Input"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.Input";
		var EXPECTED_PROPERTY_NAME = "value";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.TimePicker"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.TimePicker";
		var EXPECTED_PROPERTY_NAME = "value";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.DatePicker"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.DatePicker";
		var EXPECTED_PROPERTY_NAME = "value";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.DateTimePicker"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.DateTimePicker";
		var EXPECTED_PROPERTY_NAME = "value";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.TextArea"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.TextArea";
		var EXPECTED_PROPERTY_NAME = "value";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.Text"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.Text";
		var EXPECTED_PROPERTY_NAME = "text";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.ObjectIdentifier"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.ObjectIdentifier";
		var EXPECTED_PROPERTY_NAME = "text";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.ui.comp.navpopover.SmartLink"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.ui.comp.navpopover.SmartLink";
		var EXPECTED_PROPERTY_NAME = "text";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.Link" (test case 1)', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.Link";
		var mSETTINGS = {
			propertyName: "value"
		};
		var EXPECTED_PROPERTY_NAME1 = "text";
		var EXPECTED_PROPERTY_NAME2 = "href";

		// act
		var sProperty1 = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var sProperty2 = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[1];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty1, EXPECTED_PROPERTY_NAME1);
		assert.strictEqual(sProperty2, EXPECTED_PROPERTY_NAME2);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME1);
		assert.strictEqual(mMap.value[1], EXPECTED_PROPERTY_NAME2);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.Link" (test case 2)', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.Link";
		var mSETTINGS = {
			propertyName: "url"
		};
		var EXPECTED_PROPERTY_NAME = "href";

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.url[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.ObjectStatus"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.ObjectStatus";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty1 = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var sProperty2 = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[1];
		var sProperty3 = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[2];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty1, "text");
		assert.strictEqual(sProperty2, "state");
		assert.strictEqual(sProperty3, "icon");

		assert.strictEqual(mMap.value[0], "text");
		assert.strictEqual(mMap.value[1], "state");
		assert.strictEqual(mMap.value[2], "icon");
	});

	QUnit.test('it should return the correct mapping information for "sap.m.ObjectNumber"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.ObjectNumber";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty1 = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var sProperty2 = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[1];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty1, "number");
		assert.strictEqual(sProperty2, "unit");

		assert.strictEqual(mMap.value[0], "number");
		assert.strictEqual(mMap.value[1], "unit");
	});

	QUnit.test('it should return the correct mapping information for "sap.m.Select"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.Select";
		var EXPECTED_PROPERTY_NAME = "selectedKey";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.ComboBox"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.ComboBox";
		var EXPECTED_PROPERTY_NAME = "selectedKey";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.ui.comp.smartfield.ComboBox"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.ui.comp.smartfield.ComboBox";
		var EXPECTED_PROPERTY_NAME = "enteredValue";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.ComboBox"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.ComboBox";
		var EXPECTED_PROPERTY_NAME = "selectedKey";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.ui.comp.smartfield.DisplayComboBox"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.ui.comp.smartfield.DisplayComboBox";
		var EXPECTED_PROPERTY_NAME = "selectedKey";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test('it should return the correct mapping information for "sap.m.CheckBox"', function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.CheckBox";
		var EXPECTED_PROPERTY_NAME = "selected";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);
	});

	QUnit.test("calling the getBoundPropertiesMapInfoForControl method should not raise an exception", function(assert) {

		// arrange
		var CONTROL_NAME = "sap.m.FooBarControl";
		var mSETTINGS = {
			propertyName: "value"
		};
		var oExpectedReturnValue;

		try {
			oExpectedReturnValue = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS);
		} catch (oEvent) {
			assert.ok(false, "it should not raise an exception");
		}

		// assert
		assert.ok(oExpectedReturnValue === null, "it should return null");
	});

	QUnit.test('it should return the correct mapping information for "sap.ui.comp.smartfield.SmartField"', function(assert) {

		// arrange
		var oModel = setUpModel(TestModelTestData.TestModel);
		var oSmartField = new SmartField();
		var oMetaData = {};
		var oDataControlFactory = new ODataControlFactory(oModel, oSmartField, oMetaData);
		var CONTROL_NAME = "sap.ui.comp.smartfield.SmartField";
		var EXPECTED_PROPERTY_NAME = "value";
		var mSETTINGS = {
			propertyName: "value"
		};

		// act
		var sProperty = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME, mSETTINGS)[0];
		var mMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(CONTROL_NAME);

		// assert
		assert.strictEqual(sProperty, EXPECTED_PROPERTY_NAME);
		assert.strictEqual(mMap.value[0], EXPECTED_PROPERTY_NAME);

		// cleanup
		oModel.destroy();
		oSmartField.destroy();
		oDataControlFactory.destroy();
	});

	QUnit.test("_createInput creates sap.m.Input with proper configuration BCP: 2270069122", function (assert) {
		// Arrange
		var oSpy = this.spy(Input.prototype, "_setPreferUserInteraction"),
			oParent = fCreateSmartFieldStub(this.oModel),
			oFactory = new ODataControlFactory(this.oModel, oParent, {
				entitySet: "Project",
				path: "Description"
			}),
			oInput;
		oParent.getId.returns("testInput");

		// Act
		oInput = oFactory._createInput({visible: false});

		// Assert
		assert.strictEqual(oSpy.callCount, 1, "Method called once");
		assert.ok(oSpy.calledWith(true), "Method called with proper configuration");
		assert.strictEqual(oInput.getVisible(), false, "mAttributes propagated to control");

		// Cleanup
		oSpy.restore();
		oFactory.destroy();
		oInput.destroy();
	});

	QUnit.module("RecommendationState annotation");

	QUnit.test("calling .getValueStateBindingInfoForRecommendationStateAnnotation() method should return the binding info", function(assert) {

		// arrange
		var oModel = {};
		var oEdmProperty = {
			"name": "Name",
			"type": "Edm.String",
			"com.sap.vocabularies.UI.v1.RecommendationState": {
				"Path": "Name_sr"
			}
		};
		var oRecommendationEdmProperty = {
			"name": "Name_sr",
			"type": "Edm.Byte"
		};

		var oMock = {
			_oMetaData: {
				entityType: {
					name: "Product"
				}
			},
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.ui.comp.smartfield.ODataControlFactory";
					}
				};
			}
		};

		// act
		var oBindingInfo = ODataControlFactory.prototype.getValueStateBindingInfoForRecommendationStateAnnotation.call(oMock, oEdmProperty, oRecommendationEdmProperty, oModel);

		// assert
		assert.ok(oBindingInfo.model === oModel);
		assert.strictEqual(oBindingInfo.path, "Name_sr", 'it should return the path specified in the "HasRecommendation" annotation');
		assert.strictEqual(typeof oBindingInfo.formatter, "function");
	});

	QUnit.test("calling .getValueStateBindingInfoForRecommendationStateAnnotation() method should return null (test case 1)", function(assert) {

		// arrange
		var oEdmProperty = {
			"name": "Name",
			"type": "Edm.String"
		};

		// act
		var oBindingInfo = ODataControlFactory.prototype.getValueStateBindingInfoForRecommendationStateAnnotation(oEdmProperty);

		// assert
		assert.ok(oBindingInfo === null);
	});

	QUnit.test("calling .getValueStateBindingInfoForRecommendationStateAnnotation() method should return null (test case 2)", function(assert) {

		// arrange
		var oEdmProperty = {
			"name": "Name",
			"type": "Edm.String",
			"com.sap.vocabularies.UI.v1.HasRecommendation": {
				"Path": "Name_sr"
			}
		};
		var oRecommendationEdmProperty = {
			"name": "Name_sr",
			"type": "Edm.String" // not expected type
		};

		var oMock = {
			_oMetaData: {
				entityType: {
					name: "Product"
				}
			},
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.ui.comp.smartfield.ODataControlFactory";
					}
				};
			}
		};

		// act
		var oBindingInfo = ODataControlFactory.prototype.getValueStateBindingInfoForRecommendationStateAnnotation.call(oMock, oEdmProperty, oRecommendationEdmProperty);

		// assert
		assert.ok(oBindingInfo === null);
	});

	QUnit.test("it should convert the value of the UI.RecommendationState annotation to valid arguments for the valueState property", function(assert) {

		// assert
		assert.strictEqual(ODataControlFactory.formatRecommendationState(0), ValueState.None);
		assert.strictEqual(ODataControlFactory.formatRecommendationState(1), ValueState.Information);
		assert.strictEqual(ODataControlFactory.formatRecommendationState(2), ValueState.Warning);
		assert.strictEqual(ODataControlFactory.formatRecommendationState("0"), ValueState.None, "Invalid recommended value type");
		assert.strictEqual(ODataControlFactory.formatRecommendationState(10), ValueState.None, "Invalid recommended value");
	});

	QUnit.module("_hasBoundFieldControl");

	QUnit.test("return false in case of no bound field control property", function(assert) {

		// arrange
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		// act
		var result = oFactory._hasBoundFieldControl();

		// assert
		assert.equal(result, false);
	});

	QUnit.test("return true in case of any bound field control property", function(assert) {

		// arrange
		var oParent = fCreateSmartFieldStub(this.oModel);
		var oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oParent.getBinding.returns({});
		// act
		var result = oFactory._hasBoundFieldControl();

		// assert
		assert.equal(result, true);
	});

	QUnit.module("triggerCreationOfControls");

	QUnit.test("SmartField change event object should have newValue parameter", function(assert) {

		// arrange
		var oNewControlEvent,
			sTestValue = "testValue",
			oControlEvent = new Event(null, null, {"value": sTestValue}),
			oParent = fCreateSmartFieldStub(this.oModel),
			oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		// act
		oNewControlEvent = oFactory._getChangeEventParams(oControlEvent);

		// assert
		assert.equal(oNewControlEvent.newValue, sTestValue);
	});

	QUnit.test("_formatText function should format whitespace characters correclty", function(assert) {
		// arrange
		var sId = "001",
		sDescription = "This is test     case",
		sDisplayBehaviour = "idAndDescription",
		oParent = fCreateSmartFieldStub(this.oModel),
		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Description"
		});

		oParent.getConfiguration.returns({
			getDisplayBehaviour: function(){
				return sDisplayBehaviour;
			}
		});
		// act
		var sResult = oFactory._formatText(sId, sDescription);
		// assert
		assert.equal(whitespaceReplacer(sId + " (" + sDescription + ")"), sResult);
	});

	QUnit.test("ComboBox search should work correctly with filter function with contains", function(assert) {
		var oParent = fCreateSmartFieldStub(this.oModel),
		oFactory = new ODataControlFactory(this.oModel, oParent, {
			entitySet: "Project",
			path: "Amount"
		}),
		oComboBox = oFactory._createComboBox({edit: false,valueHelp: { annotation: null, noDialog: null, noTypeAhead: null}}),
		oItem = {
			getKey: function() {
				return "1";
			},
			getText: function() {
				return "European Euro";
			}
		},
		bResult = oComboBox.control.fnFilter("pean", oItem);

		assert.equal(bResult[0], "pean", "Filter function return correct result");
		assert.equal(oComboBox.control.useHighlightItemsWithContains(), true, "Override useHighlightItemsWithContains function is correct");
	});

	QUnit.module("Internal methods", {
		beforeEach: function () {
			this.oFactory = new ODataControlFactory(null, new SmartField());
		},
		afterEach: function () {
			this.oFactory.destroy();
		}
	});

	QUnit.test("BCP: CS20230005752345 - we raise _bEdmBoolDetected flag", function (assert) {
		// Arrange
		var oParent = fCreateSmartFieldStub(this.oModel);
		this.oFactory._oParent = oParent;

		// Act
		this.oFactory._checkBoxFlag({type: "Edm.String"});

		// Assert
		assert.strictEqual(oParent._bEdmBoolDetected, undefined,
			"If the field was never of type Boolean the flag should be undefined");

		// Act
		this.oFactory._checkBoxFlag({type: "Edm.Boolean"});

		// Assert
		assert.strictEqual(oParent._bEdmBoolDetected, true, "For Boolean field the flag should be set");

		// Act
		this.oFactory._checkBoxFlag({type: "Edm.String"});

		// Assert
		assert.strictEqual(oParent._bEdmBoolDetected, true, "Flag is not reset if the data type changes");

		// Cleanup
		oParent.destroy();
	});

	QUnit.test("BCP: 2370108763 _displayFormatter should return empty string when called with null and description", function (assert) {
		// Assert
		assert.strictEqual(this.oFactory._displayFormatter(null, "Description"), "", "Empty string is returned");
	});
});
