/*global QUnit*/
sap.ui.define([
    "sap/ovp/app/NavigationHelper",
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ushell/Container"
], function (
    NavigationHelperComponent,
    CardUtils,
    mockservers,
    UshellContainer
) {
    "use strict";

    var NavigationHelperComponent;
    
    QUnit.module("sap.ovp.app.NavigationHelper", {
        beforeEach: function () {
            mockservers.loadMockServer(CardUtils.odataBaseUrl_salesOrder, CardUtils.odataRootUrl_salesOrder);
            mockservers.loadMockServer(CardUtils.odataBaseUrl_salesShare, CardUtils.odataRootUrl_salesShare);
        },
        afterEach: function () {
            mockservers.close();
        },
    });

    QUnit.test("Navigation Test- do Url navigation - getEntity with identificationAnnotationPath", function (assert) {
        var GetServiceAsyncStub = sinon.stub(UshellContainer, "getServiceAsync").returns(
            Promise.resolve({
                isIntentUrlAsync: function () {
                    return Promise.resolve(true);
                },
                parseShellHash: function () {
                    return {
                        semanticObject: "Action",
                        action: "toappnavsample",
                        contextRaw: "",
                        params: [],
                        appSpecificRoute: ""
                    }
                }
            })
        );
        
        var cardTestData = {
            card: {
                id: "card_7_list",
                model: "salesOrder",
                template: "sap.ovp.cards.list",

                settings: {
                    listType: "extended",
                    entitySet: "SalesOrderSet",
                    staticParameters: {
                        "SupplierName": "Talpa",
                        "CustomerName": "TECUM"
                    }
                },
            },
            dataSource: {
                baseUrl: CardUtils.odataBaseUrl_salesOrder,
                rootUri: CardUtils.odataRootUrl_salesOrder,
                annoUri: CardUtils.testBaseUrl + "data/annotations_for_url_navigation.xml",

            },
            getCardPropertiesModel: function () {
                return {
                    getProperty: function (sPath) {
                        return "sap.ovp.cards.list";
                    },
                };
            },
        };

        var oModel = CardUtils.createCardModel(cardTestData);
        var fnDone = assert.async();
        CardUtils.createCardView(cardTestData, oModel).then(function (oView) {
            var oCardController = oView.getController(),
                oCardPropertiesModel = oCardController.getCardPropertiesModel();
            var oCardComponentData = oCardPropertiesModel.getData();
            var oCardDefinition = {
                entitySet: oCardComponentData.entitySet,
                entityType: oCardComponentData.entityType,
                cardComponentName: "List",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oView
            };

            var pNavigationParameters = NavigationHelperComponent.getNavigationParameters(oCardController, oCardDefinition);
            pNavigationParameters.then(
                function (mNavigationEntities) {
                    assert.ok(mNavigationEntities.action === "toappnavsample", "Validate action datafield");
                    assert.ok(mNavigationEntities.semanticObject === "Action", "Validate semanticObject datafield");
                    fnDone();
                    GetServiceAsyncStub.restore();
                },
                function (oError) {
                    assert.ok(false, oError);
                    fnDone();
                }
            );
        });
    });
});
