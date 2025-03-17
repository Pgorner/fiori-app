/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/ui/cardPositionHelper",
], function (
    CardUtils,
    Mockserver,
    cardPositionHelper
) {
    "use strict";

    QUnit.module("cardPositionHelper", {
        beforeEach: function () {
            Mockserver.loadMockServer(CardUtils.odataBaseUrl_salesOrder, CardUtils.odataRootUrl_salesOrder);
        },
        afterEach: function () { },
    });

    QUnit.test("Test Card Position Helper", function (assert) {
        var cardsOnColumn = [
            [{ id: "card001", dashboardLayout: { column: 1, row: 1, rowSpan: 27 }, visited: false }],
            [
                { id: "card005", dashboardLayout: { column: 2, row: 1, rowSpan: 28 }, visited: false },
                { id: "card018", dashboardLayout: { column: 2, row: 29, rowSpan: 27 }, visited: false },
            ],
            [],
            [
                { id: "card003", dashboardLayout: { column: 4, row: 16, rowSpan: 30 }, visited: false },
                { id: "card0a19", dashboardLayout: { column: 4, row: 46, rowSpan: 33 }, visited: false },
            ],
            [{ id: "card014", dashboardLayout: { column: 5, row: 1, rowSpan: 15 }, visited: false }],
            [],
            [{ id: "card0989", dashboardLayout: { column: 7, row: 1, rowSpan: 27 }, visited: false }],
        ];
        var this1 = {};
        this1.ariaPos = {};
        this1.getCardDomId = function (sId) {
            return "mainView-Ovplayout" + sId;
        };
        cardPositionHelper.setAriaPosition(cardsOnColumn, this1);
        var aId = ["card0a19", "card001", "card003", "card005", "card014", "card018"];
        var oResult = {
            card0a19: 7,
            card001: 1,
            card003: 6,
            card005: 2,
            card014: 3,
            card018: 5,
            card0989: 4,
        };
        var bNotValidCase = aId.some(function (sId) {
            return this1.ariaPos[sId] !== oResult[sId];
        });
        assert.equal(!bNotValidCase, true, "all the values of aria poisnet are correct");
    });

    QUnit.test("Test Card Position Helper - Position dependent cards with column priority", function (assert) {
        var cardsOnColumn1 = [
            [
                { id: "card_1", dashboardLayout: { rowSpan: 12, column: 1, row: 1 }, visited: false },
                { id: "card_5", dashboardLayout: { rowSpan: 12, column: 1, row: 13 }, visited: false },
            ],
            [{ id: "card_6", dashboardLayout: { rowSpan: 12, column: 2, row: 13 }, visited: false }],
            [{ id: "card_7", dashboardLayout: { rowSpan: 12, column: 3, row: 13 }, visited: false }],
            [
                { id: "card_2", dashboardLayout: { rowSpan: 12, column: 4, row: 1 }, visited: false },
                { id: "card_8", dashboardLayout: { rowSpan: 15, column: 4, row: 13 }, visited: false },
            ],
            [{ id: "card_3", dashboardLayout: { rowSpan: 12, column: 5, row: 1 }, visited: false }],
            [{ id: "card_4", dashboardLayout: { rowSpan: 12, column: 6, row: 1 }, visited: false }],
        ];

        var this1 = {};
        this1.ariaPos = {};
        this1.getCardDomId = function (sId) {
            return "mainView-Ovplayout" + sId;
        };
        cardPositionHelper.setAriaPosition(cardsOnColumn1, this1);
        var aId = ["card_8", "card_7", "card_6", "card_5", "card_4", "card_3", "card_2", "card_1"];
        var oResult = {
            card_1: 1,
            card_2: 2,
            card_3: 3,
            card_4: 4,
            card_5: 5,
            card_6: 6,
            card_7: 7,
            card_8: 8,
        };
        var bNotValidCase = aId.some(function (sId) {
            return this1.ariaPos[sId] !== oResult[sId];
        });
        assert.equal(!bNotValidCase, true, "all the values of aria poisnet are correct");
    });

    QUnit.test("Test Card Position Helper - Position dependent on column order and row value", function (assert) {
        var cardsOnColumn1 = [
            [{ id: "card_1", dashboardLayout: { rowSpan: 12, column: 1, row: 5 }, visited: false }],
            [{ id: "card_2", dashboardLayout: { rowSpan: 5, column: 2, row: 1 }, visited: false }],
        ];

        var this1 = {};
        this1.ariaPos = {};
        this1.getCardDomId = function (sId) {
            return "mainView-Ovplayout" + sId;
        };
        cardPositionHelper.setAriaPosition(cardsOnColumn1, this1);
        var aId = ["card_2", "card_1"];
        var oResult = {
            card_1: 2,
            card_2: 1,
        };
        var bNotValidCase = aId.some(function (sId) {
            return this1.ariaPos[sId] !== oResult[sId];
        });
        assert.equal(!bNotValidCase, true, "all the values of aria poisnet are correct");
    });
});
