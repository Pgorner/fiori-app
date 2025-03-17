/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "sap/ovp/cards/ActionUtils",
    "test-resources/sap/ovp/mockservers"
], function (
    CardUtils,
    ActionUtils,
    Mockserver
) {
    "use strict";

    QUnit.module("sap.ovp.app.Main", {
        beforeEach: function () {
            Mockserver.loadMockServer(CardUtils.odataBaseUrl_salesOrder, CardUtils.odataRootUrl_salesOrder);
        },
        afterEach: function () {
            Mockserver.close();
        }
    });

    QUnit.test("Action Utils - _toBoolean tests", function (assert) {
        assert.ok(!ActionUtils._toBoolean("false"));
        assert.ok(!ActionUtils._toBoolean(""));
        assert.ok(ActionUtils._toBoolean("true"));
        assert.ok(!ActionUtils._toBoolean(false));
        assert.ok(!ActionUtils._toBoolean());
        assert.ok(!ActionUtils._toBoolean(null));
        assert.ok(!ActionUtils._toBoolean(undefined));
        assert.ok(ActionUtils._toBoolean(true));
    });

    QUnit.test("Action Utils - _isMandatoryParameter tests", function (assert) {
        var parameter = {};
        parameter.nullable = false;
        assert.ok(ActionUtils._isMandatoryParameter(parameter));
        parameter.nullable = true;
        assert.ok(!ActionUtils._isMandatoryParameter(parameter));
        parameter.nullable = undefined;
        assert.ok(ActionUtils._isMandatoryParameter(parameter));
        parameter.nullable = "";
        assert.ok(ActionUtils._isMandatoryParameter(parameter));
    });

    QUnit.test("Action Utils - Validate Parameters Value  &  mandatory-Params-Missing", function (assert) {
        // preparing function import Mock
        var functionImportMock = {};
        functionImportMock.entitySet = "entitySet";
        functionImportMock.httpMethod = "POST";
        functionImportMock.name = "functionImport_example";
        functionImportMock.returnType = "namespace.entitySet";
        functionImportMock.parameter = [];
        functionImportMock.parameter[0] = {
            isKey: true,
            maxLength: "10",
            mode: "In",
            name: "entityTypeProperty_1",
            nullable: false,
            type: "Edm.String",
            "com.sap.vocabularies.Common.v1.Label": {
                String: "entity type property 1",
            },
        };
        functionImportMock.parameter[1] = {
            maxLength: "255",
            mode: "In",
            name: "entityTypeProperty_2",
            nullable: false,
            type: "Edm.String",
            "com.sap.vocabularies.Common.v1.Label": {
                String: "entity type property 2",
            },
        };
        functionImportMock.parameter[2] = {
            maxLength: "255",
            name: "entityTypeProperty_3",
            nullable: true,
            type: "Edm.String",
        };

        // TEST - first set of tests - all is valid
        var oModelParameterDataMock = {};
        oModelParameterDataMock.metaData = [];
        oModelParameterDataMock.metaData["entityTypeProperty_1"] = "value 1";
        oModelParameterDataMock.metaData["entityTypeProperty_2"] = "value 2";
        oModelParameterDataMock.metaData["entityTypeProperty_3"] = "value 3";
        oModelParameterDataMock.getObject = function () {
            return this.metaData;
        };
        oModelParameterDataMock.metaData.hasOwnProperty = function (sKey) {
            return !!this[sKey];
        };
        var result = ActionUtils._validateParametersValue(oModelParameterDataMock, functionImportMock);
        assert.ok(result.missingMandatoryParameters.length === 0);
        assert.ok(
            result.preparedParameterData["entityTypeProperty_1"] &&
            result.preparedParameterData["entityTypeProperty_1"] === "value 1"
        );
        assert.ok(
            result.preparedParameterData["entityTypeProperty_2"] &&
            result.preparedParameterData["entityTypeProperty_2"] === "value 2"
        );
        assert.ok(
            result.preparedParameterData["entityTypeProperty_3"] &&
            result.preparedParameterData["entityTypeProperty_3"] === "value 3"
        );

        // TEST - validate no mandatory parameters missing
        assert.ok(!ActionUtils.mandatoryParamsMissing(oModelParameterDataMock, functionImportMock));

        // TEST - getParameters
        result = ActionUtils.getParameters(oModelParameterDataMock, functionImportMock);
        assert.ok(result["entityTypeProperty_1"] && result["entityTypeProperty_1"] === "value 1");
        assert.ok(result["entityTypeProperty_2"] && result["entityTypeProperty_2"] === "value 2");
        assert.ok(result["entityTypeProperty_3"] && result["entityTypeProperty_3"] === "value 3");

        // TEST - second set of tests - all is valid - 3rd parameter not exist but is nullable so is still valid
        oModelParameterDataMock = {};
        oModelParameterDataMock.metaData = [];
        oModelParameterDataMock.metaData["entityTypeProperty_1"] = "value 1";
        oModelParameterDataMock.metaData["entityTypeProperty_2"] = "value 2";
        oModelParameterDataMock.metaData["entityTypeProperty_3"] = "";
        oModelParameterDataMock.getObject = function () {
            return this.metaData;
        };
        oModelParameterDataMock.metaData.hasOwnProperty = function (sKey) {
            return this[sKey] !== undefined;
        };
        result = ActionUtils._validateParametersValue(oModelParameterDataMock, functionImportMock);
        assert.ok(result.missingMandatoryParameters.length === 0);
        assert.ok(
            result.preparedParameterData["entityTypeProperty_1"] &&
            result.preparedParameterData["entityTypeProperty_1"] === "value 1"
        );
        assert.ok(
            result.preparedParameterData["entityTypeProperty_2"] &&
            result.preparedParameterData["entityTypeProperty_2"] === "value 2"
        );

        // TEST - validate no mandatory parameters missing
        assert.ok(!ActionUtils.mandatoryParamsMissing(oModelParameterDataMock, functionImportMock));

        // TEST - getParameters
        result = ActionUtils.getParameters(oModelParameterDataMock, functionImportMock);
        assert.ok(result["entityTypeProperty_1"] && result["entityTypeProperty_1"] === "value 1");
        assert.ok(result["entityTypeProperty_2"] && result["entityTypeProperty_2"] === "value 2");
        assert.ok(!result["entityTypeProperty_3"]);

        // TEST - third set of tests - one missing mandatory parameter
        oModelParameterDataMock = {};
        oModelParameterDataMock.metaData = [];
        oModelParameterDataMock.metaData["entityTypeProperty_1"] = "value 1";
        oModelParameterDataMock.metaData["entityTypeProperty_2"] = "";
        oModelParameterDataMock.metaData["entityTypeProperty_3"] = "";
        oModelParameterDataMock.getObject = function () {
            return this.metaData;
        };
        oModelParameterDataMock.metaData.hasOwnProperty = function (sKey) {
            return this[sKey] !== undefined;
        };
        result = ActionUtils._validateParametersValue(oModelParameterDataMock, functionImportMock);
        assert.ok(
            result.preparedParameterData["entityTypeProperty_1"] &&
            result.preparedParameterData["entityTypeProperty_1"] === "value 1"
        );
        assert.ok(result.missingMandatoryParameters.length === 1);
        assert.ok(result.missingMandatoryParameters[0].name === "entityTypeProperty_2");

        // TEST - validate no mandatory parameters missing
        assert.ok(ActionUtils.mandatoryParamsMissing(oModelParameterDataMock, functionImportMock));

        // TEST - getParameters
        result = ActionUtils.getParameters(oModelParameterDataMock, functionImportMock);
        assert.ok(result["entityTypeProperty_1"] && result["entityTypeProperty_1"] === "value 1");
        assert.ok(!result["entityTypeProperty_2"]);
        assert.ok(!result["entityTypeProperty_3"]);
    });

    QUnit.test("Action Utils - buildParametersForm ", function (assert) {
        var actionData = {};
        actionData.allParameters = [];
        actionData.allParameters[0] = {
            isKey: true,
            maxLength: "10",
            mode: "In",
            name: "entityTypeProperty_1",
            nullable: false,
            type: "Edm.String",
            "com.sap.vocabularies.Common.v1.Label": {
                String: "entity type property 1",
            },
        };
        actionData.allParameters[1] = {
            maxLength: "255",
            mode: "In",
            name: "entityTypeProperty_2",
            nullable: false,
            type: "Edm.String",
            "com.sap.vocabularies.Common.v1.Label": {
                String: "entity type property 2",
            },
        };
        actionData.allParameters[2] = {
            maxLength: "255",
            name: "entityTypeProperty_3",
            nullable: true,
            type: "Edm.String",
        };

        // TEST - build the parameters form according to the actionData passed
        var result = ActionUtils.buildParametersForm(actionData);
        assert.ok(result);

        // validating form's content
        var formContent = result.getContent();
        assert.ok(formContent && formContent.length === 6);

        assert.ok(formContent[0].getProperty("text") === "entity type property 1");
        assert.ok(formContent[1].getProperty("mandatory") == true);
        assert.ok(formContent[1].getProperty("maxLength") == 10);

        assert.ok(formContent[2].getProperty("text") === "entity type property 2");
        assert.ok(formContent[3].getProperty("mandatory") == true);
        assert.ok(formContent[3].getProperty("maxLength") == 255);

        assert.ok(formContent[4].getProperty("text") === "entityTypeProperty_3");
        assert.ok(formContent[5].getProperty("mandatory") == false);
        assert.ok(formContent[5].getProperty("maxLength") == 255);
    });

    QUnit.test("Action Utils - _getKeyProperties tests", function (assert) {
        var cardTestData = {
            card: {
                id: "card_11",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "SalesOrderSet",
                    category: "Static Category",
                    title: "Static Title",
                    description: "Static Description",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                key: {
                    SalesOrderID: true,
                },
            },
        };
        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        oModel.getMetaModel().loaded()
            .then(function () {
                var metaModel = oModel.getMetaModel();
                var entitySet = metaModel.getODataEntitySet("SalesOrderSet");
                var entityType = metaModel.getODataEntityType(entitySet.entityType);
                var oKeyMap = ActionUtils._getKeyProperties(entityType);

                assert.deepEqual(oKeyMap, cardTestData.expectedResult.key);
                fnDone();
            });
    });

    QUnit.test("Action Utils - _getKeyProperties tests (more then one key)", function (assert) {
        var cardTestData = {
            card: {
                id: "card_11",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "SalesOrderLineItemSet",
                    category: "Static Category",
                    title: "Static Title",
                    description: "Static Description",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                key: {
                    SalesOrderID: true,
                    ItemPosition: true,
                },
            },
        };
        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();
        oModel.getMetaModel().loaded()
            .then(function () {
                var metaModel = oModel.getMetaModel();
                var entitySet = metaModel.getODataEntitySet("SalesOrderLineItemSet");
                var entityType = metaModel.getODataEntityType(entitySet.entityType);
                var oKeyMap = ActionUtils._getKeyProperties(entityType);

                assert.deepEqual(oKeyMap, cardTestData.expectedResult.key);
                fnDone();
            });
    });

    QUnit.test("Action Utils - _addParamLabel tests", function (assert) {
        var cardTestData = {
            card: {
                id: "card_11",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "SalesOrderSet",
                    category: "Static Category",
                    title: "Static Title",
                    description: "Static Description",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {},
        };
        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        oModel.getMetaModel().loaded()
            .then(function () {
                var metaModel = oModel.getMetaModel();
                var entitySet = metaModel.getODataEntitySet("SalesOrderSet");
                var entityType = metaModel.getODataEntityType(entitySet.entityType);
                var oParameter = { name: "SalesOrderID" };

                ActionUtils._addParamLabel(oParameter, entityType, metaModel);

                assert.equal(oParameter["com.sap.vocabularies.Common.v1.Label"].String, "Sa. Ord. ID");
                fnDone();
            });
    });

    QUnit.test("Action Utils - _addParamLabel tests (No label)", function (assert) {
        var cardTestData = {
            card: {
                id: "card_11",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                settings: {
                    entitySet: "SalesOrderSet",
                    category: "Static Category",
                    title: "Static Title",
                    description: "Static Description",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {},
        };
        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        oModel.getMetaModel().loaded()
            .then(function () {
                var metaModel = oModel.getMetaModel();
                var entitySet = metaModel.getODataEntitySet("SalesOrderSet");
                var entityType = metaModel.getODataEntityType(entitySet.entityType);
                var oParameter = { name: "SalesOrderNoLabelTest" };

                ActionUtils._addParamLabel(oParameter, entityType, metaModel);

                assert.ok(!oParameter.hasOwnProperty("com.sap.vocabularies.Common.v1.Label"));
                assert.ok(!oParameter.hasOwnProperty("sap:label"));
                fnDone();
            });
    });

    QUnit.test("Action Utils - getActionInfo tests", function (assert) {
        var cardTestData = {
            card: {
                id: "card_11",
                model: "salesOrder",
                template: "sap.ovp.cards.quickview",
                settings: {
                    entitySet: "ContactSet",
                    entityPath: "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                    category: "Static Category",
                    title: "Static Title",
                    description: "Static Description",
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {},
        };
        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();

        oModel.getMetaModel().loaded()
            .then(function () {
                var metaModel = oModel.getMetaModel();
                var entitySet = metaModel.getODataEntitySet("SalesOrderSet");
                var entityType = metaModel.getODataEntityType(entitySet.entityType);
                var contextMock = new CardUtils.ContextMock({
                    model: oModel,
                    object: { SalesOrderID: "12345679" },
                });
                var actionMock = {
                    action: "GWSAMPLE_BASIC.GWSAMPLE_BASIC_Entities/SalesOrder_Confirm",
                    label: "Confirm",
                };

                var actionData = ActionUtils.getActionInfo(contextMock, actionMock, entityType);
                var sFunctionName = actionMock.action.split("/")[1];
                var functionImport = metaModel.getODataFunctionImport(sFunctionName);

                assert.equal(actionData.sFunctionImportPath, "GWSAMPLE_BASIC.GWSAMPLE_BASIC_Entities/SalesOrder_Confirm");
                assert.equal(actionData.parameterData.SalesOrderID, "12345679");
                assert.deepEqual(actionData.oFunctionImport, functionImport);
                assert.ok(actionData.allParameters.length == 4);
                assert.ok(actionData.parameterData.hasOwnProperty("SalesOrderID"));
                fnDone();
            });
    });
});
