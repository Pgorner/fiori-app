/*global QUnit*/

sap.ui.define([
    "sap/ovp/cards/OVPCardAsAPIUtils",
    "sap/ovp/cards/SettingsUtils",
    "sap/ushell/Container"
], function (
    OVPCardAsAPIUtils,
    SettingsUtils,
    UshellContainer
) {
    "use strict";

    var GetServiceAsyncStub;
    QUnit.module("sap.ovp.cards.SettingsUtils", {
        beforeEach: function () {
            GetServiceAsyncStub = sinon.stub(UshellContainer, "getServiceAsync").returns(
                Promise.resolve({
                    isNavigationSupported: function (aList){
                        var aResponse = [];

                        for (var i = 0; i < aList.length; i++) {
                            if (aList[i].target.shellHash === "#procurement-overview") {
                                aResponse.push({supported: true});
                            } else {
                                aResponse.push({supported: false});
                            }
                        }
                        return Promise.resolve(aResponse);
                    },
                    getLinks: function () {
                        return Promise.resolve([
                            [
                                {
                                    text: "To Procurement Page",
                                    intent: "#procurement-overview"
                                },
                                {
                                    text: "To Procurement Page 1",
                                    intent: "#procurement-overview1"
                                }
                            ]
                        ]);
                    }
                })
            );
         },
        afterEach: function () {
            GetServiceAsyncStub.restore();
         },
    });
    
    /**
     *  ------------------------------------------------------------------------------
     *  Creating mock object to test dialog creation functionality
     *  ------------------------------------------------------------------------------
     */
    function fnComponentContainer(entityType, layout, cardLayout, template, defaultSpan, noOfCards) {
        var oComponentContainer = {
            getComponentInstance: function () {
                return {
                    getRootControl: function () {
                        return {
                            getModel: function (model) {
                                return {
                                    getData: function () {
                                        return {
                                            entityType: entityType,
                                            template: template ? template : "sap.ovp.cards.list",
                                            annotationPath: "com.sap.vocabularies.UI.v1.LineItem",
                                            sortOrder: "Descending",
                                            listType: "extended",
                                            layoutDetail: layout,
                                            cardLayout: cardLayout,
                                            defaultSpan: defaultSpan
                                        };
                                    },
                                };
                            },
                        };
                    },
                    getComponentData: function () {
                        return {
                            i18n: "i18n",
                            mainComponent: {
                                _getCardFromManifest: function (cardId) {
                                    return {
                                        id: "card001",
                                        model: "purchaseOrder",
                                        settings: {},
                                        template: "sap.ovp.cards.list",
                                    };
                                },
                                _getApplicationId: function () {
                                    return "sap.ovp.demo";
                                },
                                _getTemplateForChart: function (oManifest) {
                                    return oManifest;
                                },
                                getAllowedNumberOfCards: function () {
                                    return {
                                        numberOfCards: noOfCards,
                                        errorMessage: 'You have reached the maximum limit of ' + noOfCards + ' cards. To add a new card, you first have to deselect one from the list or hide a card if you are in key user mode.'
                                    };
                                },
                                getUIModel: function () {
                                    return {
                                        getProperty: function (sPath) {
                                            if (sPath === "/aOrderedCards") {
                                                return [
                                                    {
                                                        "id": "Vcard16_cardchartscolumnstacked",
                                                        "visibility": true
                                                    },
                                                    {
                                                        "id": "card001",
                                                        "visibility": true
                                                    }
                                                ];
                                            }
                                        }
                                    }
                                }
                            },

                            appComponent: {
                                _getOvpCardOriginalConfig: function (cardId) {
                                    return {
                                        model: "purchaseOrder",
                                        settings: {},
                                        template: "sap.ovp.cards.list",
                                    };
                                },
                                getModel: function (modelName) {
                                    return { id: "model1" };
                                }
                            },
                            cardId: "card001",
                            modelName: "purchaseOrder",
                        };
                    },
                };
            },
            getDomRef: function () {
                return { offsetHeight: 419 };
            },
        };
        return oComponentContainer;
    }
    /**
     *  ------------------------------------------------------------------------------
     *  Start of test cases to test if all generic annotations are set properly
     *  ------------------------------------------------------------------------------
     */
    QUnit.test("getDialogBox(), All generic annotation are set properly to model", function (assert) {
        var oAnnotations = {
            property: [
                {
                    name: "DeliveryDate",
                },
            ],
            "com.sap.vocabularies.UI.v1.LineItem#Purchase_Order": [
                {
                    "com.sap.vocabularies.UI.v1.Importance": {
                        EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/Medium",
                    },
                },
            ],
            "com.sap.vocabularies.UI.v1.SelectionVariant#blanknD": {
                Text: {
                    String: "Filter with Image Type blanknD",
                },
            },
            "com.sap.vocabularies.UI.v1.Identification#New": [
                {
                    Label: {
                        String: "To Procurement Page",
                    },
                    "com.sap.vocabularies.UI.v1.Importance": {
                        EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/Medium",
                    },
                    RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
                },
            ],
            "com.sap.vocabularies.UI.v1.DataPoint#Purchase_Order_DeliveryDate": {
                Title: {
                    String: "Delivery Date",
                },
            },
            "com.sap.vocabularies.UI.v1.HeaderInfo#AllActualCosts": {
                Description: {
                    Label: {
                        String: "Delivery Date",
                    },
                },
            },
            "com.sap.vocabularies.UI.v1.KPI#AllActualCosts": {
                "com.sap.vocabularies.Common.v1.Label#AllActualCosts": {
                    String: "All Actual Costs",
                },
            },
            "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut": {
                Description: {
                    Label: {
                        String: "Delivery Date",
                    },
                },
            },
        };

        var oComponentContainer = fnComponentContainer(oAnnotations, "fixed");
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oComponentContainer);
        var fnDone = assert.async();
        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
            var actualModel = SettingsUtils.dialogBox.getContent()[0];
            assert.ok(actualResult.layoutDetail === "fixed", "added properties for fixed layout");
            assert.ok(actualResult.listFlavorName === "Bar Chart");
            assert.ok(actualResult.selectionVariant.length !== 0, "selection variant added properly in model");
            assert.ok(actualResult.KPI.length !== 0, "KPI added properly in model");
            assert.ok(actualResult.dataPoint.length !== 0, "dataPoint added properly in model");
            assert.ok(actualResult.dynamicSubTitle.length !== 0, "HeaderInfo added properly in model");
            assert.ok(actualResult.identification.length !== 0, "identification added properly in model");
            assert.ok(actualResult.lineItem.length !== 0, "dataPoint added properly in model");
            assert.ok(actualResult.chart.length !== 0, "chart added properly in model");
            assert.ok(actualModel.getModel("deviceMediaProperties") !== undefined, "device model is set");
            assert.ok(actualModel.getModel("@i18n") !== undefined, "i18n model is set");
            assert.ok(actualModel.getModel() !== undefined, "cardProperties model is set as default model");
            SettingsUtils.dialogBox.fireAfterClose();
            fnDone();
        }.bind(this);
    });

    /**
     *  ------------------------------------------------------------------------------
     *  End of test cases to test if all generic annotations are set properly
     *  ------------------------------------------------------------------------------
     */

    /**
     *  ------------------------------------------------------------------------------
     *  Start of test cases to test if all the annotations names and values are set properly
     *  ------------------------------------------------------------------------------
     */
    QUnit.test("getDialogBox(), label and value of identification annotation are set properly to model, recordType is intentBasedNavigation  ", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.Identification#New": [
                {
                    Label: {
                        String: "To Procurement Page",
                    },
                    RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
                },
            ],
        };

        var oContainerData = fnComponentContainer(oEntityType);
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oContainerData);
        var fnDone = assert.async();

        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
            assert.ok(actualResult.identification[0].name === "To Procurement Page", "identification label set properly");
            assert.ok(actualResult.identification[0].value === "com.sap.vocabularies.UI.v1.Identification#New", "identification value set properly");

            var staticCardProperties = SettingsUtils.dialogBox.getContent()[0].getModel("staticCardProperties");
            assert.ok(staticCardProperties.getProperty("/links").length === 1, "Links are set properly");
            assert.ok(staticCardProperties.getProperty("/links")[0].name === "To Procurement Page", "Link text is set properly");
            assert.ok(staticCardProperties.getProperty("/links")[0].value === "#procurement-overview", "Link value is set properly");

            SettingsUtils.dialogBox.fireAfterClose();
            fnDone();
        };
    });

    QUnit.test("getDialogBox(), label and value of identification are not set in this case label would be the combination of semantic object and action, recordType is intentBasedNavigation  ", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.Identification#New1": [
                {
                    SemanticObject: {
                        String: "Action",
                    },
                    Action: {
                        String: "toappnavsample",
                    },
                    RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
                },
            ],
        };

        var oContainerData = fnComponentContainer(oEntityType);
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oContainerData);
        var fnDone = assert.async();

        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
            assert.ok(actualResult.identification[0].name === "Action-toappnavsample", "identification label set properly");
            assert.ok(actualResult.identification[0].value === "com.sap.vocabularies.UI.v1.Identification#New1", "identification value set properly");
            SettingsUtils.dialogBox.fireAfterClose();
            fnDone();
        };
    });

    QUnit.test("getDialogBox(), label and value of identification set properly, recordType is DataFieldWithUrl  ", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.Identification#New": [
                {
                    Label: {
                        String: "To Procurement Page",
                    },
                    RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
                },
            ],
        };

        var oContainerData = fnComponentContainer(oEntityType);
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oContainerData);
        var fnDone = assert.async();

        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
            assert.ok(actualResult.identification[0].name === "To Procurement Page", "identification label is set properly");
            assert.ok(actualResult.identification[0].value === "com.sap.vocabularies.UI.v1.Identification#New", "identification value is set properly");
            SettingsUtils.dialogBox.fireAfterClose();
            fnDone();
        };
    });

    QUnit.test("getDialogBox(), in case of identification when there is no label annotation then set Url string as label, recordType is DataFieldWithUrl  ", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.Identification#New": [
                {
                    Url: {
                        String: "Url Type",
                    },
                    RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
                },
            ],
        };

        var oContainerData = fnComponentContainer(oEntityType);
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oContainerData)
        var fnDone = assert.async();

        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
            assert.ok(actualResult.identification[0].name === "Url Type", "identification label is set properly");
            assert.ok(actualResult.identification[0].value === "com.sap.vocabularies.UI.v1.Identification#New","identification value is set properly");
            SettingsUtils.dialogBox.fireAfterClose();
            fnDone();
        };
    });

    QUnit.test("getDialogBox(), HeaderInfo when description is present", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.HeaderInfo#AllActualCosts": {
                Description: {
                    Label: {
                        String: "Delivery Date",
                    },
                },
            },
        };

        var oContainerData = fnComponentContainer(oEntityType);
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oContainerData);
        var fnDone = assert.async();

        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
            assert.ok(actualResult.dynamicSubTitle[0].name === "Delivery Date", "HeaderInfo description is set properly");
            assert.ok(actualResult.dynamicSubTitle[0].value === "com.sap.vocabularies.UI.v1.HeaderInfo#AllActualCosts", "HeaderInfo value is set properly");
            SettingsUtils.dialogBox.fireAfterClose();
            fnDone();
        };
    });

    QUnit.test("getDialogBox(), HeaderInfo when description is not present then set default label", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.HeaderInfo#AllActualCosts": {},
        };

        var oContainerData = fnComponentContainer(oEntityType);
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oContainerData);
        var fnDone = assert.async();

        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
            assert.ok(actualResult.dynamicSubTitle[0].name === 'No label defined - "AllActualCosts"', "default HeaderInfo label is set properly");
            assert.ok(actualResult.dynamicSubTitle[0].value === "com.sap.vocabularies.UI.v1.HeaderInfo#AllActualCosts", "HeaderInfo value is set properly");
            SettingsUtils.dialogBox.fireAfterClose();
            fnDone();
        };
    });

    QUnit.test("getDialogBox(), set label for SelectionVariant,PresentationVariant and SelectionPresentationVariant", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.SelectionVariant#blanknD": {
                Text: {
                    String: "Filter with Image Type blanknD",
                },
            },
        };

        var oContainerData = fnComponentContainer(oEntityType);
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oContainerData);
        var fnDone = assert.async();

        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
            assert.ok(actualResult.selectionVariant[0].name === "Filter with Image Type blanknD", "label is set properly");
            assert.ok(actualResult.selectionVariant[0].value === "com.sap.vocabularies.UI.v1.SelectionVariant#blanknD", "HeaderInfo value is set properly");
            SettingsUtils.dialogBox.fireAfterClose();
            fnDone();
        };
    });

    QUnit.test("getDialogBox(), set label for DataPoint", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.DataPoint#Purchase_Order_DeliveryDate": {
                Title: {
                    String: "Delivery Date",
                },
            },
        };

        var oContainerData = fnComponentContainer(oEntityType);
        
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oContainerData);
        var fnDone = assert.async();

        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
            assert.ok(actualResult.dataPoint[0].name === "Delivery Date", "label is set properly");
            assert.ok(actualResult.dataPoint[0].value === "com.sap.vocabularies.UI.v1.DataPoint#Purchase_Order_DeliveryDate", "DataPoint value is set properly");
            SettingsUtils.dialogBox.fireAfterClose();
            fnDone();
        };
    });

    QUnit.test("getDialogBox(), set label for Chart", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut": {
                Description: {
                    String: "Delivery Date",
                },
            },
        };
        
        var oContainerData = fnComponentContainer(oEntityType);
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oContainerData);
        var fnDone = assert.async();

        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
            assert.ok(actualResult.chart[0].name === "Delivery Date", "label is set properly");
            assert.ok(actualResult.chart[0].value === "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut", "Chart value is set properly");
            SettingsUtils.dialogBox.fireAfterClose();
            fnDone();
        };
    });

    QUnit.test("getDialogBox(), set default label for Chart when description is not present", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut": {},
        };
        var oContainerData = fnComponentContainer(oEntityType);
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oContainerData);
        var fnDone = assert.async();

        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
            assert.ok(actualResult.chart[0].name === 'No label defined - "Eval_by_Currency_Donut"', "label is set properly");
            assert.ok(actualResult.chart[0].value === "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut", "Chart value is set properly");
            SettingsUtils.dialogBox.fireAfterClose();
            fnDone();
        };
    });

    QUnit.test("getDialogBox(), set label for LineItem", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.LineItem#Purchase_Order": [
                {
                    "com.sap.vocabularies.UI.v1.Importance": {
                        EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/Medium",
                    },
                },
            ],
        };
        var oContainerData = fnComponentContainer(oEntityType);
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oContainerData);
        var fnDone = assert.async();
        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
            assert.ok(actualResult.lineItem[0].name === "Option 1", "label is set properly");
            assert.ok(actualResult.lineItem[0].value === "com.sap.vocabularies.UI.v1.LineItem#Purchase_Order", "LineItem value is set properly");
            SettingsUtils.dialogBox.fireAfterClose();
            fnDone();   
        };
    });
    
    QUnit.test("getDialogBox(), set label for KPI", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.KPI#AllActualCosts": {
                "com.sap.vocabularies.Common.v1.Label#AllActualCosts": {
                    String: "All Actual Costs",
                },
            },
        };
        var oContainerData = fnComponentContainer(oEntityType);
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oContainerData);
        var fnDone = assert.async();

        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
            assert.ok(actualResult.KPI[0].name === "All Actual Costs", "label is set properly");
            assert.ok(actualResult.KPI[0].value === "com.sap.vocabularies.UI.v1.KPI#AllActualCosts", "KPI value is set properly");
            SettingsUtils.dialogBox.fireAfterClose();
            fnDone();
        };
    });

    /**
     *  ------------------------------------------------------------------------------
     *  End of test cases to test if all the annotations names and values are set properly
     *  ------------------------------------------------------------------------------
     */

    QUnit.test("Function test -> addSupportingObjects -> adding supporting object of all Entity Set label's -> Null check's are also done", function (assert) {
        var oData = {
            entityType: {},
            addNewCard: false,
            metaModel: {
                getODataEntityContainer: function () {
                    return {
                        entitySet: [
                            {
                                entityType: "A",
                                name: "A",
                            },
                            {
                                entityType: "B",
                                name: "B",
                            },
                            {
                                entityType: "C",
                                name: "C",
                            },
                        ],
                    };
                },
                getODataEntityType: function (sEntityType) {
                    if (sEntityType === "A") {
                        return {
                            "sap:label": "My name is A",
                        };
                    } else if (sEntityType === "B") {
                        return {};
                    } else if (sEntityType === "C") {
                        return {
                            "sap:label": "My name is C",
                        };
                    }
                    return {};
                },
            },
            template: "sap.ovp.cards.list",
        };
        var result = [
            {
                name: "My name is A",
                value: "A",
            },
            {
                name: 'No label defined - "B"',
                value: "B",
            },
            {
                name: "My name is C",
                value: "C",
            },
        ];
        var actualResult = SettingsUtils.addSupportingObjects(oData);
        assert.ok(actualResult["allEntitySet"].length === 3, "There are three Entity Set");
        assert.deepEqual(
            actualResult["allEntitySet"],
            result,
            "Check if label's are correctly coming for these Entity Set"
        );

        delete oData.metaModel;
        delete oData["allEntitySet"];
        actualResult = SettingsUtils.addSupportingObjects(oData);
        assert.ok(!actualResult["allEntitySet"], "Check if there is no metaModel");
    });

    QUnit.test("Function test -> getVisibilityOfElement -> Checking the visibility of Entity property in the dialog's form", function (assert) {
        var oCardProperties = {
            mainViewSelected: true,
        };
        assert.ok(!SettingsUtils.getVisibilityOfElement(oCardProperties, "showEntitySet", false), "If view switch is not there then it return false");
        assert.ok(!SettingsUtils.getVisibilityOfElement(oCardProperties, "showEntitySet", true), "If main view is selected then it return false");

        oCardProperties = {
            mainViewSelected: false,
            selectedKey: 2,
            tabs: [
                {
                    entitySet: "A",
                },
                {
                    entitySet: "B",
                },
            ],
        };
        assert.ok(SettingsUtils.getVisibilityOfElement(oCardProperties, "showEntitySet", true), "This will return true because we have Entity Set property at tab level");
    });

    QUnit.test("getTrimmedDataURIName() - To trim the data Url", function (assert) {
        var sDataUri = "/sap/opu/odata/sap/ZEM_C_TOTACCTRECV_CDS";
        var actualResult = SettingsUtils.getTrimmedDataURIName(sDataUri);
        var expectedResult = "ZEM_C_TOTACCTRECV_CDS";
        assert.ok(actualResult === expectedResult, "Data Uri is trimmed");
    });

    QUnit.test("getQualifier()- To get specific qualifier", function (assert) {
        var sAnnotation = "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_ColumnStacked";
        var actualResult = SettingsUtils.getQualifier(sAnnotation);
        var expectedResult = "Eval_by_Currency_ColumnStacked";
        assert.ok(actualResult === expectedResult, "Qualifier is seperated");
    });

    QUnit.test("getQualifier()- Get Default Value", function (assert) {
        var sAnnotation = "com.sap.vocabularies.UI.v1.SelectionVariant";
        var actualResult = SettingsUtils.getQualifier(sAnnotation);
        var expectedResult = "Default";
        assert.ok(actualResult === expectedResult, "Default annotation is taken");
    });

    QUnit.test("addmanifestSettings()- add the manifest property", function (assert) {
        var oData = {
            sortOrder: "ascending",
            listType: "extended",
            listFlavour: "bar",
            enableAddToInsights: true,
            dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint",
        };
        var expectedResult = {
            sortOrder: "ascending",
            listType: "extended",
            listFlavour: "bar",
            enableAddToInsights: true,
            dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint",
            isExtendedList: true,
            bInsightsEnable: true,
            isBarList: false,
            hasKPIHeader: true,
        };
        assert.ok(JSON.stringify(SettingsUtils.addManifestSettings(oData)) == JSON.stringify(expectedResult), "To add the settings to the manifest");
    });

    QUnit.test("setVisibllity()- Properties for List Card", function (assert) {
        var oCardProperties = {
            dataPoint: [
                {
                    name: "Delivery Date",
                    value: "com.sap.vocabularies.UI.v1.DataPoint#Purchase_Order_DeliveryDate",
                },
                {
                    name: "Purchase Order",
                    value: "com.sap.vocabularies.UI.v1.DataPoint#PurchaseOrder",
                },
            ],
            dynamicSubTitle: {
                name: "No label defined - Default",
                value: "com.sap.vocabularies.UI.v1.HeaderInfo",
            },
            lineItem: [
                {
                    field: [
                        {
                            Label: {
                                String: "Order ID (Company)",
                            },
                            Value: {
                                Path: "SalesOrderID",
                            },
                        },
                        {
                            Label: {
                                String: "Contract",
                            },
                            Value: {
                                Path: "CustomerName",
                            },
                        },
                    ],
                    name: "No label defined - Default",
                    value: "com.sap.vocabularies.UI.v1.LineItem",
                },
                {
                    field: [
                        {
                            Label: {
                                String: "Order ID (Company)",
                            },
                            Value: {
                                Path: "SalesOrderID",
                            },
                        },
                        {
                            Label: {
                                String: "Contract",
                            },
                            Value: {
                                Path: "CustomerName",
                            },
                        },
                    ],
                    name: "No label defined - Default",
                    value: "com.sap.vocabularies.UI.v1.LineItem",
                },
            ],
            lineItemQualifier: "No label defined - Default",
            listFlavorName: "Bar Chart",
            listType: "extended",
            sortBy: "DeliveryDate",
            sortOrder: "descending",
            subTitle: "By delivery date and value",
            template: "sap.ovp.cards.list",
            title: "Extended List Card",
        };
        SettingsUtils.setVisibilityForFormElements(oCardProperties);
        assert.ok(SettingsUtils.oVisibility.dynamicSwitchSubTitle == true);
        assert.ok(SettingsUtils.oVisibility.subTitle == true);
        assert.ok(SettingsUtils.oVisibility.title == true);
        assert.ok(SettingsUtils.oVisibility.lineItem == true);
        assert.ok(SettingsUtils.oVisibility.viewSwitchEnabled == true);
    });

    QUnit.test("setVisibllity()- Properties for Link Card", function (assert) {
        var oCardProperties = {
            lineItemQualifier: "No label defined - Default",
            listFlavorName: "Bar Chart",
            listType: "extended",
            sortBy: "DeliveryDate",
            sortOrder: "descending",
            subTitle: "New Dynamic Sub Title",
            template: "sap.ovp.cards.list",
            title: "New Title",
            staticContent: [],
        };
        SettingsUtils.setVisibilityForFormElements(oCardProperties);
        assert.ok(SettingsUtils.oVisibility.listType == true);
        assert.ok(SettingsUtils.oVisibility.listFlavor == true);
        assert.ok(SettingsUtils.oVisibility.subTitle == true);
        assert.ok(SettingsUtils.oVisibility.showMore == true);
    });

    QUnit.test("checkClonedCard()- Check the clonedCard", function (assert) {
        var cardId = "NewKPI_C";
        var expectedResult = SettingsUtils.checkClonedCard(cardId);
        assert.ok(expectedResult == true);
    });

    QUnit.test("setVisibllity()- Properties for static Link list Card", function (assert) {
        var oCardProperties = {
            template: "sap.ovp.cards.linklist",
            title: "New Title",
            staticContent: [
                {
                    id: "linkListItem--1",
                    index: "Index--1",
                    subTitle: "Default SubTitle",
                    targetUri: "www.google.com",
                    title: "test",
                },
            ],
        };
        var expected = { "Index--1": true };
        SettingsUtils.setVisibilityForFormElements(oCardProperties);
        assert.ok(JSON.stringify(SettingsUtils.oVisibility.staticLink) == JSON.stringify(expected));
        assert.ok(JSON.stringify(SettingsUtils.oVisibility.removeVisual) == JSON.stringify(expected));
        assert.ok(JSON.stringify(SettingsUtils.oVisibility.showMore) == JSON.stringify(expected));
    });

    QUnit.test("verifyCardsMaxLimitExceeded() - To validate return value based on card limit", function (assert) {
        //when card limit is greater than the number of visible cards
        var oSelectedElement = fnComponentContainer({}, "resizable", {}, "", undefined, 3);
        var oMainComponent = oSelectedElement.getComponentInstance().getComponentData().mainComponent;
        var expected = SettingsUtils.verifyCardsMaxLimitExceeded(oMainComponent);
        assert.ok(expected === false);

        //when card limit is equal to the number of visible cards
        oSelectedElement = fnComponentContainer({}, "resizable", {}, "", undefined, 2);
        oMainComponent = oSelectedElement.getComponentInstance().getComponentData().mainComponent;
        var expected = SettingsUtils.verifyCardsMaxLimitExceeded(oMainComponent);
        assert.ok(expected === true);

        //when card limit is less than the number of visible cards
        oSelectedElement = fnComponentContainer({}, "resizable", {}, "", undefined, 1);
        oMainComponent = oSelectedElement.getComponentInstance().getComponentData().mainComponent;
        var expected = SettingsUtils.verifyCardsMaxLimitExceeded(oMainComponent);
        assert.ok(expected === true);
    });

    QUnit.test("verifyCardsMaxLimitExceeded() - when extension is not implemented to get maximum card limit configuration", function (assert) {
        var oSelectedElement = fnComponentContainer({}, "resizable", {}, "");
        var oMainComponent = oSelectedElement.getComponentInstance().getComponentData().mainComponent;
        oMainComponent.getAllowedNumberOfCards = function () {};
        var expected = SettingsUtils.verifyCardsMaxLimitExceeded(oMainComponent);
        assert.ok(expected === false);
    });

    QUnit.test("fnCloneCardHandler, fnAddStaticLinkListCardHandler, fnAddKPICardHandler, fnAddNewCardHandler - To validate return value, when card limit is exceeded", async function (assert) {
        //when card limit is equal to the number of visible cards
        var oSelectedElement = fnComponentContainer({}, "resizable", {}, "", undefined, 2);
        var fnCloneCardHandlerPromise = SettingsUtils.fnCloneCardHandler(oSelectedElement);
        var resolvedValue_1 = await fnCloneCardHandlerPromise;
        assert.deepEqual(resolvedValue_1, [], "Promise resolved to an empty array");
        var fnAddStaticLinkListCardHandlerPromise = SettingsUtils.fnAddStaticLinkListCardHandler(oSelectedElement);
        var resolvedValue_2 = await fnAddStaticLinkListCardHandlerPromise;
        assert.deepEqual(resolvedValue_2, [], "Promise resolved to an empty array");
        var fnAddKPICardHandlerPromise = SettingsUtils.fnAddKPICardHandler(oSelectedElement);
        var resolvedValue_3 = await fnAddKPICardHandlerPromise;
        assert.deepEqual(resolvedValue_3, [], "Promise resolved to an empty array");
        var fnAddNewCardHandlerPromise = SettingsUtils.fnAddNewCardHandler(oSelectedElement);
        var resolvedValue_4 = await fnAddNewCardHandlerPromise;
        assert.deepEqual(resolvedValue_4, [], "Promise resolved to an empty array");

        //when card limit is less than the number of visible cards
        var oSelectedElement = fnComponentContainer({}, "resizable", {}, "", undefined, 1);
        fnCloneCardHandlerPromise = SettingsUtils.fnCloneCardHandler(oSelectedElement);
        resolvedValue_1 = await fnCloneCardHandlerPromise;
        assert.deepEqual(resolvedValue_1, [], "Promise resolved to an empty array");
        fnAddStaticLinkListCardHandlerPromise = SettingsUtils.fnAddStaticLinkListCardHandler(oSelectedElement);
        resolvedValue_2 = await fnAddStaticLinkListCardHandlerPromise;
        assert.deepEqual(resolvedValue_2, [], "Promise resolved to an empty array");
        fnAddKPICardHandlerPromise = SettingsUtils.fnAddKPICardHandler(oSelectedElement);
        resolvedValue_3 = await fnAddKPICardHandlerPromise;
        assert.deepEqual(resolvedValue_3, [], "Promise resolved to an empty array");
        fnAddNewCardHandlerPromise = SettingsUtils.fnAddNewCardHandler(oSelectedElement);
        resolvedValue_4 = await fnAddNewCardHandlerPromise;
        assert.deepEqual(resolvedValue_4, [], "Promise resolved to an empty array");
    });

    QUnit.test("getDialogBox(), Resizable Layout, standard card, when defaultSpan is not present", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.KPI#AllActualCosts": {
                "com.sap.vocabularies.Common.v1.Label#AllActualCosts": {
                    String: "All Actual Costs"
                }
            }
        };
        var cardLayout = {
            "rowSpan": 12,
            "colSpan": 1,
            "maxColSpan": 1,
            "noOfItems": 5,
            "autoSpan": true,
            "showOnlyHeader": false,
            "visible": true,
            "column": 2,
            "row": 133,
            "containerLayout": "resizable"
        };
        var oContainerData = fnComponentContainer(oEntityType, "resizable", cardLayout);
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oContainerData);
        var fnDone = assert.async();
        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
                assert.ok(actualResult.KPI[0].name === "All Actual Costs", "label is set properly");
                assert.ok(actualResult.KPI[0].value === "com.sap.vocabularies.UI.v1.KPI#AllActualCosts", "KPI value is set properly");
                assert.ok(actualResult.defaultSpan.rows === actualResult.cardLayout.noOfItems, "No of rows is set correctly");
                assert.ok(actualResult.defaultSpan.cols === actualResult.cardLayout.colSpan, "No of columns is set correctly");
                SettingsUtils.dialogBox.fireAfterClose();
                fnDone();
        };
    });

    QUnit.test("getDialogBox(), Resizable Layout, non list & table cards, when defaultSpan is not present", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.KPI#AllActualCosts": {
                "com.sap.vocabularies.Common.v1.Label#AllActualCosts": {
                    String: "All Actual Costs"
                }
            }
        };
        var cardLayout = {
            "rowSpan": 12,
            "colSpan": 1,
            "maxColSpan": 1,
            "noOfItems": 5,
            "autoSpan": true,
            "showOnlyHeader": false,
            "visible": true,
            "column": 2,
            "row": 133,
            "containerLayout": "resizable"
        };
        var oContainerData = fnComponentContainer(oEntityType, "resizable", cardLayout, "procurement.ext.list");
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oContainerData);
        var fnDone = assert.async();

        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
            assert.ok(actualResult.defaultSpan.rows === actualResult.cardLayout.rowSpan, "No of rows is set correctly");
            assert.ok(actualResult.defaultSpan.cols === actualResult.cardLayout.colSpan, "No of columns is set correctly");
            SettingsUtils.dialogBox.fireAfterClose();
            fnDone();
        };
    });

    QUnit.test("getDialogBox(), Resizable Layout, standard card, when defaultSpan is present", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.KPI#AllActualCosts": {
                "com.sap.vocabularies.Common.v1.Label#AllActualCosts": {
                    String: "All Actual Costs"
                }
            }
        };
        var cardLayout = {
            "rowSpan": 12,
            "colSpan": 1,
            "maxColSpan": 1,
            "noOfItems": 5,
            "autoSpan": true,
            "showOnlyHeader": false,
            "visible": true,
            "column": 2,
            "row": 133,
            "containerLayout": "resizable"
        };
        var defaultSpan = {};
        var oContainerData = fnComponentContainer(oEntityType, "resizable", cardLayout, "sap.ovp.cards.list", defaultSpan);
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oContainerData);
        var fnDone = assert.async();
        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
            assert.ok(actualResult.defaultSpan.rows === actualResult.cardLayout.noOfItems, "No of rows is set correctly");
            assert.ok(actualResult.defaultSpan.cols === actualResult.cardLayout.colSpan, "No of columns is set correctly");
            SettingsUtils.dialogBox.fireAfterClose();
            fnDone();
        };
    });

    QUnit.test("getDialogBox(), Resizable Layout, non list & table cards, when defaultSpan is present", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.KPI#AllActualCosts": {
                "com.sap.vocabularies.Common.v1.Label#AllActualCosts": {
                    String: "All Actual Costs"
                }
            }
        };
        var cardLayout = {
            "rowSpan": 12,
            "colSpan": 1,
            "maxColSpan": 1,
            "noOfItems": 5,
            "autoSpan": true,
            "showOnlyHeader": false,
            "visible": true,
            "column": 2,
            "row": 133,
            "containerLayout": "resizable"
        };
        var defaultSpan = {};
        var oContainerData = fnComponentContainer(oEntityType, "resizable", cardLayout, "procurement.ext.list", defaultSpan);
        this.stub(OVPCardAsAPIUtils, "createCardComponent").returns(true);
        SettingsUtils.getDialogBox(oContainerData);
        var fnDone = assert.async();
        SettingsUtils.dialogBox.onBeforeRendering = function(oView) {
            var actualResult = SettingsUtils.dialogBox.getContent()[0].getModel().oData;
            assert.ok(actualResult.defaultSpan.rows === actualResult.cardLayout.rowSpan, "No of rows is set correctly");
            assert.ok(actualResult.defaultSpan.cols === actualResult.cardLayout.colSpan, "No of columns is set correctly");
            SettingsUtils.dialogBox.fireAfterClose();
            fnDone();
        };
    });
});
