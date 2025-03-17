sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers"
], function (utils, mockservers) {
    "use strict";

    var utils = utils;

    QUnit.module("sap.ovp.cards.HeaderExtension", {
        beforeEach: function () {
            mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
        },
        afterEach: function () {
            mockservers.close();
        }
    });

    QUnit.test("Header - Screen reader accessability test", function (assert) {
        var cardTestData = {
            card: {
                id: "card_1",
                model: "salesOrder",
                template: "sap.ovp.test.qunit.cards.headerExtension",
                settings: {
                    entitySet: "SalesOrderSet",
                    description: "Static Description",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {
                    subTitle: "Static Description",
                    headerExtension: "OVP Extension Header Feature Simplest example ever",
                },
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
                //start the async test
                // start();

                var cardHtml = oView.getDomRef();
                var headerRole = testContainer.find(".sapOvpCardHeader").attr("role");
                assert.ok(headerRole == "button", "header role is set for accessability");
                oView.destroy();
                fnDone();
                
            };
        });
    });

    QUnit.test("Card Test - Header Extension test - Load header extension fragment according to custom Component", function (assert) {
        var cardTestData = {
            card: {
                id: "card_2",
                model: "salesOrder",
                template: "sap.ovp.test.qunit.cards.headerExtension",
                settings: {
                    entitySet: "SalesOrderSet",
                    description: "Static Description",
                },
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml",
            },
            expectedResult: {
                Header: {
                    subTitle: "Static Description",
                    headerExtension: "OVP Extension Header Feature Simplest example ever",
                },
            },
        };

        var oModel = utils.createCardModel(cardTestData);
        //stop();
        var fnDone = assert.async();
        utils.createCardView(cardTestData, oModel).then(function (oView) {
            //start the async test
           // start();

            var cardXml = oView._xContent;
            assert.ok(cardXml !== undefined, "Existence check to XML parsing");

            // validate the card's header XML
            assert.ok(utils.isValidCategory(cardTestData, cardXml), "Header's Category property Value");
            assert.ok(utils.isValidTitle(cardTestData, cardXml), "Header's Title property Value");
            assert.ok(utils.isValidSub(cardTestData, cardXml), "Header's Description property Value");

            assert.ok(
                utils.isValidHeaderExtension(cardTestData, cardXml),
                "Header Extension Custom Fragment - validate text injected"
            );
            fnDone();
        });
    });
});
