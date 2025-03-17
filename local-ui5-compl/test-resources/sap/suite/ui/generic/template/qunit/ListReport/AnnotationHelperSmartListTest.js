/**
 * tests for the sap.suite.ui.generic.template.listTemplates.AnnotationHelper - only for StandardList i.e. StandardList and ObjectList Item.
 */

sap.ui.define([
    "testUtils/sinonEnhanced",
    "sap/suite/ui/generic/template/ListReport/AnnotationHelperSmartList",
    "sap/suite/ui/generic/template/genericUtilities/testableHelper",
    "sap/suite/ui/generic/template/js/AnnotationHelper",
    "sap/ui/model/odata/AnnotationHelper"
], function (sinon, AnnotationHelperSmartList, testableHelper, AnnotationHelper, OdataAnnotationHelper) {
    "use strict";

    var sandbox, oStubForPrivate;
    QUnit.module("SmartList AnnotationHelper", {
        beforeEach: function () {
            sandbox = sinon.sandbox.create();
            oStubForPrivate = testableHelper.startTest();
        },
        afterEach: function () {
            testableHelper.endTest();
            sandbox.restore();
        }
    });

    QUnit.test("test with generatePathForField", function (assert) {
        var oStubForPrivate = testableHelper.getStaticStub();
        var sFormatterName = "formatter";

        var aParts = [
            { Path: "Price" },
            { Path: "Currency" }
        ];
        var oResult = oStubForPrivate.AnnotationHelperSmartList_generatePathForField(aParts, sFormatterName);
        assert.equal(oResult, "{parts:[{path: 'Price'}, {path: 'Currency'}], formatter: 'formatter'}", "should return correct value with multiple paths");

        aParts = [
            { Path: "Price" },
            { String: "INR" }
        ];
        oResult = oStubForPrivate.AnnotationHelperSmartList_generatePathForField(aParts, sFormatterName);
        assert.equal(oResult, "{parts:[{path: 'Price'}, {value: 'INR'}], formatter: 'formatter'}", "should return correct value with multiple path and string");

        aParts = [
            { Path: "Price" }
        ];
        oResult = oStubForPrivate.AnnotationHelperSmartList_generatePathForField(aParts, sFormatterName);
        assert.equal(oResult, "{path: 'Price', formatter: 'formatter'}", "should return correct value with single path");

        aParts = [
            { String: "INR" }
        ];
        oResult = oStubForPrivate.AnnotationHelperSmartList_generatePathForField(aParts, sFormatterName);
        assert.equal(oResult, "{value: 'INR', formatter: 'formatter'}", "should return correct value with single string");

        aParts = [
            { Path: "Date", type: 'type' }
        ];
        oResult = oStubForPrivate.AnnotationHelperSmartList_generatePathForField(aParts, sFormatterName);
        assert.equal(oResult, "{path: 'Date', type: 'type', formatter: 'formatter'}", "should return correct value with single path and its data type");
    });

    QUnit.test("test with getSortedDataPointsAndFields - part 1", function (assert) {
        var oFirstDataField = {
            EdmType: "Edm.String",
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {
                Path: "ProductForEdit"
            },
            "com.sap.vocabularies.UI.v1.Importance": {
                EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
            }
        };
        var oSecondDataField = {
            EdmType: "Edm.String",
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {
                Path: "ProductCategory"
            },
            "com.sap.vocabularies.UI.v1.Importance": {
                EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/Low"
            }
        };
        var oThirdDataField = {
            EdmType: "Edm.String",
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {
                Path: "Currency"
            },
            "com.sap.vocabularies.UI.v1.Importance": {
                EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
            }
        };
        var aLineItem = [
            oFirstDataField,
            oSecondDataField,
            oThirdDataField,
            {
                "com.sap.vocabularies.UI.v1.Importance": {
                    EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
                },
                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
                Target: {
                    AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Price"
                }
            },
            {
                "com.sap.vocabularies.UI.v1.Importance": {
                    EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/Low"
                },
                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
                Target: {
                    AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Depth"
                }
            },
            {
                "com.sap.vocabularies.UI.v1.Importance": {
                    EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
                },
                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
                Target: {
                    AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Weight"
                }
            }
        ];

        var oFirstDataPoint = {
            Value: {
                EdmType: "Edm.Decimal",
                Path: "Price"
            }
        };
        var oSecondDataPoint = {
            Value: {
                EdmType: "Edm.Decimal",
                Path: "Depth"
            }
        };
        var oThirdDataPoint = {
            Value: {
                EdmType: "Edm.Decimal",
                Path: "Weight"
            }
        };

        var oExpectedResult = {
            dataFields: [
                oFirstDataField,
                oThirdDataField,
                oSecondDataField
            ],
            dataPoints: [
                oFirstDataPoint,
                oSecondDataPoint,
                oThirdDataPoint
            ],
            "imageDataField": undefined
        };

        var oMetamodel = {}, oEntityTypeProperty = { property: [] };
        var oStubForPrivate = testableHelper.getStaticStub();

        var getTargetPathForDataFieldForAnnotation = sandbox.stub(oStubForPrivate, "AnnotationHelperSmartList_getTargetPathForDataFieldForAnnotation");
        getTargetPathForDataFieldForAnnotation.onCall(0).returns("/dataServices/schema/0/entityType/17/com.sap.vocabularies.UI.v1.DataPoint#Price");
        getTargetPathForDataFieldForAnnotation.onCall(1).returns("/dataServices/schema/0/entityType/17/com.sap.vocabularies.UI.v1.DataPoint#Depth");
        getTargetPathForDataFieldForAnnotation.onCall(2).returns("/dataServices/schema/0/entityType/17/com.sap.vocabularies.UI.v1.DataPoint#Weight");

        var getProperty = sinon.stub(oMetamodel, "getProperty");
        getProperty.onCall(0).returns(oFirstDataPoint);
        getProperty.onCall(1).returns(oSecondDataPoint);
        getProperty.onCall(2).returns(oThirdDataPoint);

        var oContext = {};
        sinon.stub(oMetamodel, "getContext").returns(oContext);
        sinon.stub(oMetamodel, "getODataEntityType").returns(oEntityTypeProperty);
        sinon.stub(oContext, "getObject").returns([]);
        sinon.stub(OdataAnnotationHelper, "resolvePath").returns("");
        getProperty.onCall(3).returns({ property: [] });
        var isImageUrlStub = sinon.stub(AnnotationHelper, "isImageUrl").returns(false);

        var oResult = AnnotationHelperSmartList.getSortedDataPointsAndFields(aLineItem, "", oMetamodel, "");
        assert.deepEqual(oResult, oExpectedResult, "should return sorted datafields and datapoints");
        isImageUrlStub.restore();
    });

    QUnit.test("test with getSortedDataPointsAndFields - part 2", function (assert) {
        var oFirstDataField = {
            EdmType: "Edm.String",
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {
                Path: "ProductForEdit"
            },
            "com.sap.vocabularies.UI.v1.Importance": {
                EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/Low"
            }
        };
        var oSecondDataField = {
            EdmType: "Edm.String",
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {
                Path: "ProductCategory"
            }
        };
        var oThirdDataField = {
            EdmType: "Edm.String",
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {
                Path: "Currency"
            },
            "com.sap.vocabularies.UI.v1.Importance": {
                EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
            }
        };
        var aLineItem = [
            oFirstDataField,
            oSecondDataField,
            oThirdDataField,
            {
                "com.sap.vocabularies.UI.v1.Importance": {
                    EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/Low"
                },
                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
                Target: {
                    AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Price"
                }
            },
            {
                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
                Target: {
                    AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Depth"
                }
            },
            {
                "com.sap.vocabularies.UI.v1.Importance": {
                    EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
                },
                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
                Target: {
                    AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Weight"
                }
            }
        ];

        var oFirstDataPoint = {
            Value: {
                EdmType: "Edm.Decimal",
                Path: "Price"
            }
        };
        var oSecondDataPoint = {
            Value: {
                EdmType: "Edm.Decimal",
                Path: "Depth"
            }
        };
        var oThirdDataPoint = {
            Value: {
                EdmType: "Edm.Decimal",
                Path: "Weight"
            }
        };

        var oExpectedResult = {
            dataFields: [
                oThirdDataField,
                oSecondDataField,
                oFirstDataField
            ],
            dataPoints: [
                oThirdDataPoint,
                oSecondDataPoint,
                oFirstDataPoint
            ],
            "imageDataField": undefined
        };

        var oMetamodel = {}, oEntityTypeProperty = { property: [] };
        var oStubForPrivate = testableHelper.getStaticStub();

        var getTargetPathForDataFieldForAnnotation = sandbox.stub(oStubForPrivate, "AnnotationHelperSmartList_getTargetPathForDataFieldForAnnotation");
        getTargetPathForDataFieldForAnnotation.onCall(0).returns("/dataServices/schema/0/entityType/17/com.sap.vocabularies.UI.v1.DataPoint#Weight");
        getTargetPathForDataFieldForAnnotation.onCall(1).returns("/dataServices/schema/0/entityType/17/com.sap.vocabularies.UI.v1.DataPoint#Depth");
        getTargetPathForDataFieldForAnnotation.onCall(2).returns("/dataServices/schema/0/entityType/17/com.sap.vocabularies.UI.v1.DataPoint#Price");

        var getProperty = sinon.stub(oMetamodel, "getProperty");
        getProperty.onCall(0).returns(oThirdDataPoint);
        getProperty.onCall(1).returns(oSecondDataPoint);
        getProperty.onCall(2).returns(oFirstDataPoint);

        var oContext = {};
        sinon.stub(oMetamodel, "getContext").returns(oContext);
        sinon.stub(oMetamodel, "getODataEntityType").returns(oEntityTypeProperty);
        sinon.stub(oContext, "getObject").returns([]);
        getProperty.onCall(3).returns({ property: [] });
        var isImageUrlStub = sinon.stub(AnnotationHelper, "isImageUrl").returns(false);

        var oResult = AnnotationHelperSmartList.getSortedDataPointsAndFields(aLineItem, "", oMetamodel, "");
        assert.deepEqual(oResult, oExpectedResult, "should return sorted datafields and datapoints");
        isImageUrlStub.restore();
    });

    QUnit.test("test with getSortedDataPointsAndFields - part 3", function (assert) {
        var oFirstDataField = {
            EdmType: "Edm.String",
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {
                Path: "ProductForEdit"
            }
        };
        var oSecondDataField = {
            EdmType: "Edm.String",
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {
                Path: "ProductCategory"
            }
        };
        var oThirdDataField = {
            EdmType: "Edm.String",
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {
                Path: "Currency"
            }
        };
        var oFourthDataField = {
            EdmType: "Edm.String",
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {
                Path: "ProductPictureUrl"
            }
        };
        var aLineItem = [
            oFirstDataField,
            oSecondDataField,
            oThirdDataField,
            oFourthDataField,
            {
                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
                Target: {
                    AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Price"
                }
            },
            {
                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
                Target: {
                    AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Depth"
                }
            },
            {
                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
                Target: {
                    AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Weight"
                }
            }
        ];

        var oFirstDataPoint = {
            Value: {
                EdmType: "Edm.Decimal",
                Path: "Price"
            }
        };
        var oSecondDataPoint = {
            Value: {
                EdmType: "Edm.Decimal",
                Path: "Depth"
            }
        };
        var oThirdDataPoint = {
            Value: {
                EdmType: "Edm.Decimal",
                Path: "Weight"
            }
        };

        var oExpectedResult = {
            dataFields: [
                oFirstDataField,
                oSecondDataField,
                oThirdDataField
            ],
            dataPoints: [
                oFirstDataPoint,
                oSecondDataPoint,
                oThirdDataPoint
            ],
            imageDataField: oFourthDataField
        };

        var oMetamodel = {}, oEntityTypeProperty = { property: [] };
        var oStubForPrivate = testableHelper.getStaticStub();

        var getTargetPathForDataFieldForAnnotation = sandbox.stub(oStubForPrivate, "AnnotationHelperSmartList_getTargetPathForDataFieldForAnnotation");
        getTargetPathForDataFieldForAnnotation.onCall(0).returns("/dataServices/schema/0/entityType/17/com.sap.vocabularies.UI.v1.DataPoint#Price");
        getTargetPathForDataFieldForAnnotation.onCall(1).returns("/dataServices/schema/0/entityType/17/com.sap.vocabularies.UI.v1.DataPoint#Depth");
        getTargetPathForDataFieldForAnnotation.onCall(2).returns("/dataServices/schema/0/entityType/17/com.sap.vocabularies.UI.v1.DataPoint#Weight");

        var getProperty = sinon.stub(oMetamodel, "getProperty");
        getProperty.onCall(0).returns(oFirstDataPoint);
        getProperty.onCall(1).returns(oSecondDataPoint);
        getProperty.onCall(2).returns(oThirdDataPoint);

        var oContext = {};
        sinon.stub(oMetamodel, "getContext").returns(oContext);
        sinon.stub(oMetamodel, "getODataEntityType").returns(oEntityTypeProperty);
        sinon.stub(oContext, "getObject").returns([]);
        getProperty.onCall(3).returns({ property: [] });
        var isImageUrlStub = sinon.stub(AnnotationHelper, "isImageUrl");
        isImageUrlStub.onCall(0).returns(false);
        isImageUrlStub.onCall(1).returns(false);
        isImageUrlStub.onCall(2).returns(false);
        isImageUrlStub.onCall(3).returns(true);
        isImageUrlStub.onCall(4).returns(false);
        isImageUrlStub.onCall(5).returns(false);
        isImageUrlStub.onCall(6).returns(false);
        isImageUrlStub.onCall(7).returns(true);

        var oResult = AnnotationHelperSmartList.getSortedDataPointsAndFields(aLineItem, "", oMetamodel, "");
        assert.deepEqual(oResult, oExpectedResult, "should return sorted datafields and datapoints");
        isImageUrlStub.restore();
    });

    QUnit.test("test with formatDataPointOrField - part 1", function (assert) {
        var oItem = {
            Value: {
                EdmType: "Edm.Decimal",
                Path: "Price"
            }
        };
        var oEntityTypeProperty = {
            "Org.OData.Measures.V1.ISOCurrency": {
                Path: "Currency"
            },
            name: "Price",
            precision: "16",
            "sap:label": "Price per Unit",
            "sap:unit": "Currency",
            scale: "3",
            type: "Edm.Decimal"
        };
        var oInterface = {}, oModel = {}, oProperty = {}, oEntityType = {};

        sinon.stub(oInterface, "getModel").returns(oModel);
        sinon.stub(oModel, "getProperty").returns(oProperty);
        sinon.stub(oProperty, "getODataEntityType").returns(oEntityType);
        sinon.stub(oProperty, "getODataProperty").returns(oEntityTypeProperty);
        var oExpectedResult = "{parts:[{path: 'Price'}, {path: 'Currency'}], formatter: 'sap.ui.core.format.NumberFormat.format'}";
        var oResult = AnnotationHelperSmartList.formatDataPointOrField(oInterface, oItem);
        assert.equal(oResult, oExpectedResult, "should return correct value");
    });

    QUnit.test("test with formatDataPointOrField - part 2", function (assert) {
        var oEntityType = {};
        var oItem = {
            Value: {
                EdmType: "Edm.Decimal",
                Path: "Depth"
            }
        };
        var oEntityTypeProperty = {
            "Org.OData.Measures.V1.Unit": {
                Path: "DimensionUnit"
            },
            name: "Depth",
            precision: "13",
            "sap:label": "Depth",
            "sap:unit": "DimensionUnit",
            scale: "3",
            type: "Edm.Decimal"
        };
        var oInterface = {}, oModel = {}, oProperty = {}, oEntityType = {};

        sinon.stub(oInterface, "getModel").returns(oModel);
        sinon.stub(oModel, "getProperty").returns(oProperty);
        sinon.stub(oProperty, "getODataEntityType").returns(oEntityType);
        sinon.stub(oProperty, "getODataProperty").returns(oEntityTypeProperty);
        sinon.stub(OdataAnnotationHelper, "format").returns("{Depth}");
        var oExpectedResult = "{Depth} {path: 'DimensionUnit'}";
        var oResult = AnnotationHelperSmartList.formatDataPointOrField(oInterface, oItem);
        assert.equal(oResult, oExpectedResult, "should return correct value");
    });

    QUnit.test("test with formatDataPointOrField - part 3", function (assert) {
        var oEntityType = {};
        var oItem = {
            Value: {
                EdmType: "Edm.DateTime",
                Path: "CreatedOn"
            }
        };
        var oEntityTypeProperty = {
            "Org.OData.Measures.V1.Unit": {
                Path: "DimensionUnit"
            },
            name: "CreatedOn",
            precision: "13",
            "sap:label": "CreatedOn",
            "sap:unit": "DimensionUnit",
            scale: "3",
            type: "Edm.DateTime"
        };
        var oInterface = {}, oModel = {}, oProperty = {}, oEntityType = {};

        sinon.stub(oInterface, "getModel").returns(oModel);
        sinon.stub(oModel, "getProperty").returns(oProperty);
        sinon.stub(oProperty, "getODataEntityType").returns(oEntityType);
        sinon.stub(oProperty, "getODataProperty").returns(oEntityTypeProperty);
        var oExpectedResult = "{path: 'CreatedOn', type: 'sap.ui.model.type.DateTime', formatter: 'sap.ui.core.format.DateFormat.format'} {path: 'DimensionUnit'}";
        var oResult = AnnotationHelperSmartList.formatDataPointOrField(oInterface, oItem);
        assert.equal(oResult, oExpectedResult, "should return correct value");
    });

    QUnit.test("test with getObjectListProperty", function (assert) {
        var oFirstDataField = {
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {
                Path: "ProductForEdit"
            }
        };
        var oSecondDataField = {
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {
                Path: "ProductCategory"
            }
        };
        var oThirdDataField = {
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {
                Path: "Currency"
            }
        };
        var oFirstDataPoint = {
            Value: {
                EdmType: "Edm.Decimal",
                Path: "Price"
            }
        };
        var oSecondDataPoint = {
            Value: {
                EdmType: "Edm.Decimal",
                Path: "Depth"
            }
        };
        var oThirdDataPoint = {
            Value: {
                EdmType: "Edm.Decimal",
                Path: "Weight"
            }
        };
        var oLineItem = {
            dataFields: [oFirstDataField, oSecondDataField, oThirdDataField],
            dataPoints: [oFirstDataPoint, oSecondDataPoint, oThirdDataPoint],
            imageDataField: {}
        };
        var oExpectedResult = {
            title: "{ProductForEdit}",
            number: "{Price}",
            numberState: "None",
            firstAttribute: "{ProductCategory}",
            secondAttribute: "{Currency}",
            firstStatus: "{Depth}",
            firstStatusState: "None",
            secondStatus: "{Weight}",
            secondStatusState: "None"
        };

        var oInterface = {};

        var formatDataPointOrField = sinon.stub(AnnotationHelperSmartList, "formatDataPointOrField");
        formatDataPointOrField.onCall(0).returns("{Currency}");
        formatDataPointOrField.onCall(1).returns("{Depth}");
        formatDataPointOrField.onCall(2).returns("{Weight}");
        formatDataPointOrField.onCall(3).returns("{ProductForEdit}");
        formatDataPointOrField.onCall(4).returns("{Price}");
        formatDataPointOrField.onCall(5).returns("{ProductCategory}");
        var oResult = AnnotationHelperSmartList.getObjectListProperty(oInterface, oLineItem);
        assert.deepEqual(oResult, oExpectedResult, "should return correct value with 3 datafields and 3 datapoints");
        formatDataPointOrField.restore();

        formatDataPointOrField = sinon.stub(AnnotationHelperSmartList, "formatDataPointOrField");
        var oFourthDataField = {
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {
                Path: "Supplier"
            }
        };
        var oLineItem = {
            dataFields: [oFirstDataField, oSecondDataField, oThirdDataField, oFourthDataField],
            dataPoints: [oFirstDataPoint, oSecondDataPoint],
            imageDataField: {}
        };
        var oExpectedResult = {
            title: "{ProductForEdit}",
            number: "{Price}",
            numberState: "None",
            firstAttribute: "{ProductCategory}",
            secondAttribute: "{Currency}",
            firstStatus: "{Depth}",
            firstStatusState: "None",
            secondStatus: "{Supplier}",
            secondStatusState: "None"
        };

        formatDataPointOrField.onCall(0).returns("{Currency}");
        formatDataPointOrField.onCall(1).returns("{Depth}");
        formatDataPointOrField.onCall(2).returns("{Supplier}");
        formatDataPointOrField.onCall(3).returns("{ProductForEdit}");
        formatDataPointOrField.onCall(4).returns("{Price}");
        formatDataPointOrField.onCall(5).returns("{ProductCategory}");
        var oResult = AnnotationHelperSmartList.getObjectListProperty(oInterface, oLineItem);
        assert.deepEqual(oResult, oExpectedResult, "should return correct value with 4 datafields and 2 datapoints");
        formatDataPointOrField.restore();

        formatDataPointOrField = sinon.stub(AnnotationHelperSmartList, "formatDataPointOrField");
        var oFifthDataField = {
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {
                Path: "Information"
            }
        };
        var oLineItem = {
            dataFields: [oFirstDataField, oSecondDataField, oThirdDataField, oFourthDataField, oFifthDataField],
            dataPoints: [oFirstDataPoint],
            imageDataField: {}
        };
        var oExpectedResult = {
            title: "{ProductForEdit}",
            number: "{Price}",
            numberState: "None",
            firstAttribute: "{ProductCategory}",
            secondAttribute: "{Supplier}",
            firstStatus: "{Currency}",
            firstStatusState: "None",
            secondStatus: "{Information}",
            secondStatusState: "None"
        };

        formatDataPointOrField.onCall(0).returns("{Supplier}");
        formatDataPointOrField.onCall(1).returns("{Currency}");
        formatDataPointOrField.onCall(2).returns("{Information}");
        formatDataPointOrField.onCall(3).returns("{ProductForEdit}");
        formatDataPointOrField.onCall(4).returns("{Price}");
        formatDataPointOrField.onCall(5).returns("{ProductCategory}");
        var oResult = AnnotationHelperSmartList.getObjectListProperty(oInterface, oLineItem);
        assert.deepEqual(oResult, oExpectedResult, "should return correct value with 5 datafields and 1 datapoints");
        formatDataPointOrField.restore();

        formatDataPointOrField = sinon.stub(AnnotationHelperSmartList, "formatDataPointOrField");
        var oSixthDataField = {
            RecordType: "com.sap.vocabularies.UI.v1.DataField",
            Value: {
                Path: "Party"
            }
        };
        var oLineItem = {
            dataFields: [oFirstDataField, oSecondDataField, oThirdDataField, oFourthDataField, oFifthDataField, oSixthDataField],
            dataPoints: [],
            imageDataField: {}
        };
        var oExpectedResult = {
            title: "{ProductForEdit}",
            number: "{Currency}",
            numberState: "None",
            firstAttribute: "{ProductCategory}",
            secondAttribute: "{Information}",
            firstStatus: "{Supplier}",
            firstStatusState: "None",
            secondStatus: "{Party}",
            secondStatusState: "None"
        };

        formatDataPointOrField.onCall(0).returns("{Information}");
        formatDataPointOrField.onCall(1).returns("{Supplier}");
        formatDataPointOrField.onCall(2).returns("{Party}");
        formatDataPointOrField.onCall(3).returns("{ProductForEdit}");
        formatDataPointOrField.onCall(4).returns("{Currency}");
        formatDataPointOrField.onCall(5).returns("{ProductCategory}");
        var oResult = AnnotationHelperSmartList.getObjectListProperty(oInterface, oLineItem);
        assert.deepEqual(oResult, oExpectedResult, "should return correct value with 6 datafields and no datapoints");
        formatDataPointOrField.restore();
    });

    QUnit.test("test with appendUnitOfMeasure", function (assert) {
        var oEntityTypeProperty = {
            "Org.OData.Measures.V1.Unit": {
                Path: "DimensionUnit"
            }
        };
        var oStubForPrivate = testableHelper.getStaticStub();
        sandbox.stub(oStubForPrivate, "AnnotationHelperSmartList_generatePathForField").returns("{path: 'DimensionUnit'}");
        var oExpectedResult = " {path: 'DimensionUnit'}";
        var oResult = oStubForPrivate.AnnotationHelperSmartList_appendUnitOfMeasure(oEntityTypeProperty);
        assert.equal(oResult, oExpectedResult, "should return correct value");
    });
});
