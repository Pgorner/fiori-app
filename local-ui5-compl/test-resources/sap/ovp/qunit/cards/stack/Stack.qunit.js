/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ui/model/Context",
    "sap/ovp/cards/list/Component",
    "sap/ovp/cards/NavigationHelper",
    "sap/ui/model/odata/v2/ODataListBinding",
    "sap/ui/core/Lib"
], function (
    utils, 
    Mockserver, 
    Context, 
    OvpListComponent,
    NavigationHelper,
    ODataListBinding,
    CoreLib
) {
    "use strict";

    QUnit.module("sap.ovp.app.Component", {
        beforeEach: function () {
            Mockserver.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
        },
        afterEach: function () {
            Mockserver.close();
        }
    });

    QUnit.test("Test Stack Card -  stack card Size indicator and ObjectStream open Check", function (assert) {
        var cardTestData = {
            card: {
                id: "card_1",
                model: "salesOrder",
                template: "sap.ovp.cards.stack",
                settings: {
                    entitySet: "ContactSet",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        //Get controller with read stub and call render
        var modelReadStub = sinon.stub(oModel, "read");
        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oController = oView.getController();
            oController.onAfterRendering();

            // create test stub
            var oObjectStream = oController.oObjectStream;
            var binding = oController.oObjectStream.getBinding("content");
            var getCurrentContextsStub = sinon.stub(binding, "getCurrentContexts");
            var getContextsStub = sinon.stub(binding, "getContexts").returns([]);
            getCurrentContextsStub.returns([1, 2, 3]);

            //CreateData Change event
            binding.fireDataReceived();

            //check stack card Size indicator
            assert.ok(oView.byId("stackSize").getText() === "3", "Stack card size indicator number same as card count");

            //Create card Stub and check object stream open
            sinon.spy(oObjectStream, "open");
            oController.openStack();
            assert.ok(oObjectStream.open.callCount == 1, "object stream opened when there are cards");

            //Create No card Stub and check object stream won't open
            getCurrentContextsStub.returns([]);
            //sinon.spy(oObjectStream, "open");
            oController.openStack();
            assert.ok(oObjectStream.open.callCount == 1, "object stream not opened when there no cards");

            //restore sinons
            getCurrentContextsStub.restore();
            getContextsStub.restore();
            modelReadStub.restore();
            fnDone();
        });
    });

    QUnit.test("Test Stack Card - No intent then no placeHolder", function (assert) {
        var cardTestData = {
            card: {
                id: "card_2",
                model: "salesOrder",
                template: "sap.ovp.cards.stack",
                settings: {
                    entitySet: "ContactSet",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        //create all data with sinons and render card
        var modelReadStub = sinon.stub(oModel, "read");
        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oController = oView.getController();
            var getEntityIntentsStub = sinon.stub(NavigationHelper, "getEntityNavigationEntries").returns([]);
            oController.onAfterRendering();

            var oObjectStream = oController.oObjectStream;
            var binding = oObjectStream.getBinding("content");

            assert.ok(!oObjectStream.getPlaceHolder(), "A place Holder has been created even there is no intents");

            getEntityIntentsStub.restore();
            modelReadStub.restore();
            fnDone();
        });
    });

    QUnit.test("Test Stack Card - there is intent then there is placeHolder", function (assert) {
        var cardTestData = {
            card: {
                id: "card_3",
                model: "salesOrder",
                template: "sap.ovp.cards.stack",
                settings: {
                    entitySet: "ContactSet",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        //create all data with sinons and render card
        var modelReadStub = sinon.stub(oModel, "read");
        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oController = oView.getController();
            var getEntityIntentsStub = sinon.stub(NavigationHelper, "getEntityNavigationEntries").returns([1, 2]);
            oController.onAfterRendering();

            var oObjectStream = oController.oObjectStream;
            var binding = oObjectStream.getBinding("content");

            assert.ok(oObjectStream.getPlaceHolder(), "There is no place holder although there is intent");

            getEntityIntentsStub.restore();
            modelReadStub.restore();
            fnDone();
        });
    });

    QUnit.test("Test Stack Card - there is intent but stack is complex then no placeHolder", function (assert) {
        var cardTestData = {
            card: {
                id: "card_4",
                model: "salesOrder",
                template: "sap.ovp.cards.stack",
                settings: {
                    entitySet: "BusinessPartnerSet",
                    objectStreamCardsTemplate: "sap.ovp.cards.list",
                    objectStreamCardsNavigationProperty: "ToSalesOrders",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        //create all data with sinons and render card
        var modelReadStub = sinon.stub(oModel, "read");
        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oController = oView.getController();
            var getEntityIntentsSpy = sinon.spy(NavigationHelper, "getEntityNavigationEntries");
            oController.onAfterRendering();

            var oObjectStream = oController.oObjectStream;
            var binding = oObjectStream.getBinding("content");

            assert.ok(!oObjectStream.getPlaceHolder(), "There is a place holder although stack is complex");
            assert.ok(
                getEntityIntentsSpy.callCount === 0,
                "getEntityNavigationEntries was called although stack is complex"
            );

            getEntityIntentsSpy.restore();
            modelReadStub.restore();
            fnDone();
        });
    });

    QUnit.test("Test Stack Card - entitySet with input parameters", function (assert) {
        var cardTestData = {
            card: {
                id: "card_5",
                model: "salesOrder",
                template: "sap.ovp.cards.stack",
                settings: {
                    entitySet: "SalesShare",
                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesShare,
                rootUri: utils.odataRootUrl_salesShare,
                annoUri: utils.testBaseUrl + "data/salesshare/annotations_parameterized_ES_Valid.xml",
            },
        };

        Mockserver.loadMockServer(utils.odataBaseUrl_salesShare, utils.odataRootUrl_salesShare);
        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();
        //create all data with sinons and render card
        var modelReadStub = sinon.stub(oModel, "read");
        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oController = oView.getController();
            oController.onAfterRendering();

            var oObjectStream = oController.oObjectStream;
            var binding = oObjectStream.getBinding("content");

            assert.equal(
                binding.getPath(),
                "/SalesShareParameters(P_Currency=%27EUR%27,P_Country=%27IN%27)/Results",
                "path is with parametets"
            );

            modelReadStub.restore();
            fnDone();
        });
    });

    QUnit.test("Stack Card - Screen Reader attribute test", function (assert) {
        var cardTestData = {
            card: {
                id: "card_6",
                model: "salesOrder",
                template: "sap.ovp.cards.stack",
                settings: {
                    entitySet: "ContactSet",
                    description: "Static Description",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();
        utils.createCardView(cardTestData, oModel).then(function (oView) {
            document.body.insertAdjacentHTML("beforeend", '<div id="testContainer" style="display: none;">');
            var testContainer = document.querySelector("#testContainer");
            oView.placeAt("testContainer");
            oView.invalidate();
            oView.onAfterRendering = function () {
                var oController = oView.getController();
                oController.onAfterRendering();
                // create test stub
                var oObjectStream = oController.oObjectStream;
                var binding = oController.oObjectStream.getBinding("content");
                var getCurrentContextsStub = sinon.stub(binding, "getCurrentContexts");
                var getLengthStub = sinon.stub(binding, "getLength");
                var getContextsStub = sinon.stub(binding, "getContexts").returns([1, 2, 3, 4, 5, 6, 7, 8]);
                getCurrentContextsStub.returns([1, 2, 3]);
                getLengthStub.returns(8);

                //CreateData Change event
                binding.fireDataReceived();

                var cardHtml = oView.getDomRef();
                var numberLabelObject = testContainer.querySelector(".sapMLabel");
                var stackCardSize = getCurrentContextsStub().length;
                var totalCards = getContextsStub().length;

                //Check list
                assert.ok(
                    numberLabelObject.getAttribute("aria-label") ==
                    CoreLib.getResourceBundleFor("sap.ovp").getText("stackCard", stackCardSize),
                    "Stack Card type is accessble"
                );
                assert.ok(numberLabelObject.getAttribute("role") == "", "card role is define");

                //Check footer
                var StackCardContent = testContainer.querySelector(".sapOvpStackCardContent");
                assert.ok(
                    StackCardContent.getAttribute("aria-label") ==
                         CoreLib.getResourceBundleFor("sap.ovp")
                        .getText("stackCardContent", [stackCardSize, totalCards]),
                    "aria-label is define on right content"
                );
                assert.ok(StackCardContent.getAttribute("role") == "button", "button role is define on right content");
                oView.destroy();
                fnDone();
            };
        });
    });

    QUnit.test("Test Stack Card - 'objectStreamCardsSettings' affects objectStream cards", function (assert) {
        var cardTestData = {
            card: {
                id: "card_7",
                model: "salesOrder",
                template: "sap.ovp.cards.stack",
                settings: {
                    category: "Contacts",
                    title: "My Team",
                    description: "Stack Card",
                    entitySet: "SalesOrderSet",
                    objectStreamCardsSettings: {
                        identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#StackTest",
                        category: "Category from manifest for QuickView cards",
                    },
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {},
                Body: {},
                Footer: {
                    actions: [
                        {
                            type: /DataFieldForIntentBasedNavigation/,
                            action: /toappnavsample1/,
                            label: "SO Navigation (M) StackTest",
                            semanticObj: "Action1",
                        },
                        {
                            type: /DataFieldForAction/,
                            action: /SalesOrder_Confirm/,
                            label: "Confirm StackTest",
                        },
                        {
                            type: /DataFieldForAction/,
                            action: /SalesOrder_Cancel/,
                            label: "Cancel StackTest",
                        },
                    ],
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        //Get controller and call render
        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oController = oView.getController();
            oController.onAfterRendering();

            //Get first quickview card XML
            var oObjectStream = oController.oObjectStream;
            var bindingInfo = oObjectStream.getBindingInfo("content");
            var componentContainer = bindingInfo.factory();

            var quickViewCardPromiseArray = [];
            for (var i = 0; i < oController.quickViewCardContextArray.length; i++) {
                quickViewCardPromiseArray.push(
                    oController._renderQuickViewCards(
                        oController.quickViewCardContextArray[i].sId,
                        oController.quickViewCardContextArray[i].oContext,
                        oController.quickViewCardContextArray[i].oComponentContainer
                    )
                );
            }
            Promise.all(quickViewCardPromiseArray).then(
                function () {
                    var componentInstance = componentContainer.getComponentInstance();
                    var quickviewCardView = componentInstance.getAggregation("rootControl");
                    var quickviewCardXML = quickviewCardView._xContent;
                    var expectedFooterRes = cardTestData.expectedResult.Footer;
                    // specific XML property binding value test
                    assert.ok(
                        utils.validateActionFooterXmlValues(quickviewCardXML, expectedFooterRes),
                        "Action Footer XML Values"
                    );
                    fnDone();
                }.bind(this)
            );
        });
    });

    QUnit.test("Test Stack Card - 'objectStreamCardsSettings' affects objectStream cards", function (assert) {
        var cardTestData = {
            card: {
                id: "card_8",
                model: "salesOrder",
                template: "sap.ovp.cards.stack",
                settings: {
                    category: "Contacts",
                    title: "My Team",
                    description: "Stack Card",
                    entitySet: "BusinessPartnerSet",
                    objectStreamCardsNavigationProperty: "ToSalesOrders",
                    objectStreamCardsTemplate: "sap.ovp.cards.list",
                    objectStreamCardsSettings: {},
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {},
                Body: {},
                Footer: {},
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();

        //Get controller and call render
        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oController = oView.getController();
            oController.onAfterRendering();

            //Get first quickview card XML
            var oObjectStream = oController.oObjectStream;
            var bindingInfo = oObjectStream.getBindingInfo("content");
            var oContext = new Context(oModel, "/BusinessPartnerSet('0100000000')");
            oContext.getProperty = function () {
                return "FilterValue";
            };
            oContext.isRefreshForced = function() {
                return false;
            };
            oContext.isPreliminary =  function() {
                return false;
            };
            oContext.isUpdated = function() {
                return false;
            };

            var componentContainer = bindingInfo.factory("id", oContext);

            var quickViewCardPromiseArray = [];
            for (var i = 0; i < oController.quickViewCardContextArray.length; i++) {
                quickViewCardPromiseArray.push(
                    oController._renderQuickViewCards(
                        oController.quickViewCardContextArray[i].sId,
                        oController.quickViewCardContextArray[i].oContext,
                        oController.quickViewCardContextArray[i].oComponentContainer
                    )
                );
            }
            Promise.all(quickViewCardPromiseArray).then(
                function () {
                    var componentInstance = componentContainer.getComponentInstance();
                    var quickviewCardView = componentInstance.getAggregation("rootControl");
                    var quickviewCardXML = quickviewCardView._xContent;
                    assert.ok(componentInstance instanceof OvpListComponent);
                    var filter = { path: "CustomerID", operator: "EQ", value1: "FilterValue" };
                    assert.deepEqual(
                        componentInstance.getComponentData().settings.filters[0],
                        filter,
                        "filter for inline card is nor as expected"
                    );
                    fnDone();
                }.bind(this)
            );
        });
    });

    QUnit.test("Test Stack Card - quick view cards with navigation property", function (assert) {
        var cardTestData = {
            card: {
                id: "card_9",
                model: "salesOrder",
                template: "sap.ovp.cards.stack",
                settings: {
                    category: "Contacts",
                    title: "My Team",
                    description: "Stack Card",
                    entitySet: "BusinessPartnerSet",
                    objectStreamCardsNavigationProperty: "ToSalesOrders",
                    objectStreamCardsSettings: {},
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {},
                Body: {},
                Footer: {},
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        var fnDone = assert.async();
        //Get controller and call render
        utils.createCardView(cardTestData, oModel).then(function (oView) {
            var oController = oView.getController();
            var determineFilterPropertyIdSpy = sinon.spy(oController, "_determineFilterPropertyId");
            var setErrorStateStub = sinon.stub(oController, "setErrorState");

            oController.onAfterRendering();
            assert.ok(
                typeof oController.oObjectStream !== "object",
                "Object Stream should not be created, there is Navigation Property with quickView card"
            );
            assert.ok(
                determineFilterPropertyIdSpy.callCount === 0,
                "Navigation property is not set so filter property don't need to be found"
            );
            assert.ok(setErrorStateStub.callCount === 1, "setErrorState should be called");

            determineFilterPropertyIdSpy.restore();
            setErrorStateStub.restore();
            fnDone();
        });
    });
});
