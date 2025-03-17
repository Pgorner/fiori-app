/*global QUnit*/

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ovp/ui/DashboardLayout",
    "sap/m/Button"
], function (
    jQuery,
    DashboardLayout,
    Button
) {
    "use strict";

    QUnit.module("DashboardLayout", {
        beforeEach: function () {
            this.originalInit = DashboardLayout.prototype.init;
            this.orignalInitResizeHandler = DashboardLayout.prototype.initResizeHandler;
            this.getDragAndDropEnabled = DashboardLayout.prototype.getDragAndDropEnabled;
            DashboardLayout.prototype.init = function () {
                this.data("sap-ui-fastnavgroup", "true", true);
                this.oColumnLayoutData = {};
                this.resizeHandlerId = this.initResizeHandler();
                this.dashboardLayoutUtil = {
                    getCardId: function (sCard) {
                        return sCard ? sCard : "card01";
                    },
                    getCards: function () {
                        return [];
                    },
                    setCardCssValues: function () { },
                    updateLayoutData: function () {
                        return {
                            colCount: 5,
                            colWidthPx: 350.4,
                            contentWidthPx: 1752,
                            layoutWidthPx: 1792,
                            marginPx: 40,
                            previousColCount: 5,
                        };
                    },
                    getDashboardLayoutModel: function () {
                        return {
                            aCards: [
                                { id: "card01", dashboardLayout: { column: 1, colSpan: 1 } },
                                {
                                    id: "card02",
                                    dashboardLayout: {
                                        autoSpan: true,
                                        colSpan: 1,
                                        column: 1,
                                        containerLayout: "resizable",
                                        headerHeight: 139,
                                        height: "592px",
                                        iCardBorderPx: 8,
                                        iRowHeightPx: 16,
                                        itemHeight: 0,
                                        left: "0px",
                                        maxColSpan: 1,
                                        noOfItems: 0,
                                        row: 1,
                                        rowSpan: 37,
                                        showOnlyHeader: undefined,
                                        top: "0px",
                                        visible: true,
                                    },
                                },
                                {
                                    id: "card04",
                                    dashboardLayout: {
                                        autoSpan: true,
                                        colSpan: 1,
                                        column: 4,
                                        containerLayout: "resizable",
                                        headerHeight: 100,
                                        height: "512px",
                                        iCardBorderPx: 8,
                                        iRowHeightPx: 16,
                                        itemHeight: 0,
                                        left: "952.8000000000001px",
                                        maxColSpan: 1,
                                        noOfItems: 0,
                                        row: 1,
                                        rowSpan: 32,
                                        showOnlyHeader: undefined,
                                        top: "0px",
                                        visible: true,
                                    },
                                },
                            ],
                            iCardBorderPx: 8,
                            iColCount: 5,
                            iDisplaceRow: null,
                            iDummyRow: 999,
                            iRowHeightPx: 16,
                            oLayoutVars: [],
                            getColCount: function () {
                                return 5;
                            },
                            getCardById: function (sCardId) {
                                if (sCardId && sCardId === "card05") {
                                    return { id: "card04", dashboardLayout: { column: 2, colSpan: 0 } };
                                }
                                return { id: "card02", dashboardLayout: { column: 1, colSpan: 0 } };
                            },
                            _sortCardsByRow: function () {
                                return {};
                            },
                        };
                    },
                    getCardDomId: function (id) {
                        return "mainView--ovpLayout--" + id;
                    },
                    ariaPos: {
                        card02: 1,
                        card04: 2,
                        card01: 3,
                    },
                };
            };
            DashboardLayout.prototype.initResizeHandler = function () { };
            DashboardLayout.prototype.getDragAndDropEnabled = function () {
                return false;
            };
        },
        afterEach: function () {
            DashboardLayout.prototype.init = this.originalInit;
            DashboardLayout.prototype.initResizeHandler = this.orignalInitResizeHandler;
            DashboardLayout.prototype.getDragAndDropEnabled = this.getDragAndDropEnabled;
        },
    });

    QUnit.test("Dashboard Layout - Layout focus handler", function (assert) {
        var btn = new Button("btnId1");
        var dashboard = new DashboardLayout();
        dashboard.addAggregation("content", btn);
        document.body.insertAdjacentHTML("beforeend", '<div id="testContainer">');
        var dashboardAfterRender = dashboard.onAfterRendering.bind(dashboard);
        var fnDone = assert.async();

        dashboard.onAfterRendering = function () {
            var keyboardNavigation = dashboard.keyboardNavigation;
            var dummyCard =
                '<div id="mainView--ovpLayout--card01" class="easyScanLayoutItemWrapper sapOvpDashboardLayoutItem sapOvpNotResizableLeftRight" style="height: 240px; width: 342.4px;" tabindex="0" ;="" aria-setsize="1" aria-posinset="1" role="listitem"><div id="mainView--card014" data-sap-ui="mainView--card01" class="sapUiComponentContainer"></div><div class="lastElement" tabindex="0"></div></div>';
            dashboard.$().find(".sapUshellEasyScanLayoutInner").append(dummyCard);
            keyboardNavigation.jqElement = dashboard.$();

            var event = {
                keyCode: null,
                preventDefault: function () { },
                relatedTarget: jQuery("<div class='easyScanLayoutItemWrapper'/>"),
                stopImmediatePropagation:function () {
                    assert.ok(true, "stopImmediatePropagation function is called for layoutFocus handler.");
                }
            };
            keyboardNavigation.layoutFocusHandler(event);
            assert.ok(!keyboardNavigation.sLastFocusableCard, "On wrapper focus: lastfocusable card should not be set");
            assert.ok(
                !keyboardNavigation.layoutUtil.sLastFocusableCard,
                "On wrapper focus: lastfocusable card should not be set in layoututils"
            );

            event = { 
                keyCode: null, 
                preventDefault: function () { }, 
                relatedTarget: undefined,
                stopImmediatePropagation:function () {
                    assert.ok(true, "stopImmediatePropagation function is called for layoutFocus handler.");
                }
            };
            keyboardNavigation.layoutFocusHandler(event);
            var firstItem = dashboard.$().find(".easyScanLayoutItemWrapper").first();
            assert.ok(firstItem.is(document.activeElement), "On outside focus: first child is focused");
            assert.ok(firstItem.is(keyboardNavigation.sLastFocusableCard), "On outside focus: lastfocusable card is set");

            event = { 
                keyCode: null, 
                preventDefault: function () { }, 
                relatedTarget: jQuery("<div/>"),
                stopImmediatePropagation:function () {
                    assert.ok(true, "stopImmediatePropagation function is called for layoutFocus handler.");
                }
             };
            keyboardNavigation.lastFocussedElement = firstItem;
            keyboardNavigation.layoutFocusHandler(event);
            assert.ok(
                !keyboardNavigation.lastFocussedElement,
                "focusable card is lastFocussedElement:  lastFocussedElement should be removed"
            );

            event = { 
                keyCode: null, 
                preventDefault: function () { }, 
                relatedTarget: jQuery("<div/>"),
                stopImmediatePropagation:function () {
                    assert.ok(true, "stopImmediatePropagation function is called for layoutFocus handler.");
                }
            };
            keyboardNavigation.lastFocussedElement = firstItem;
            keyboardNavigation.layoutFocusHandler(event);
            assert.ok(
                !keyboardNavigation.lastFocussedElement,
                "If focusable card is lastFocussedElement:  lastFocussedElement should be removed"
            );

            event = { 
                keyCode: null, 
                preventDefault: function () { }, 
                relatedTarget: jQuery("<div/>"),
                stopImmediatePropagation:function () {
                    assert.ok(true, "stopImmediatePropagation function is called for layoutFocus handler.");
                }
            };
            keyboardNavigation.lastFocussedElement = jQuery("<div/>");
            keyboardNavigation.layoutFocusHandler(event);
            assert.ok(
                keyboardNavigation.sLastFocusableCard.is(document.activeElement),
                "If focusable card is not lastFocussedElement:  focusable card is focused"
            );            
            dashboard.destroy();
            fnDone();
        };
        dashboardAfterRender(dashboard);
        dashboard.placeAt("testContainer");
    });

    QUnit.test("Dashboard Layout - focus in case of right arrow key is pressed", function (assert) {
        var btn = new Button("btnId1");
        var dashboard = new DashboardLayout();
        dashboard.addAggregation("content", btn);
        document.body.insertAdjacentHTML("beforeend", '<div id="testContainer">');
        var dashboardAfterRender = dashboard.onAfterRendering.bind(dashboard);
        var fnDone = assert.async();

        dashboard.onAfterRendering = function () {
            var keyboardNavigation = dashboard.keyboardNavigation;
            var dummyCard =
                '<div id="mainView--ovpLayout--card02" class="easyScanLayoutItemWrapper sapOvpDashboardLayoutItem" style="transform: translate3d(0px, 0px, 0px); height: 592px; width: 317.6px;" tabindex="0" ;="" aria-setsize="1" aria-posinset="1" role="listitem"></div><div id="mainView--ovpLayout--card04" class="easyScanLayoutItemWrapper sapOvpDashboardLayoutItem" style="transform: translate3d(952.8px, 0px, 0px); height: 512px; width: 317.6px;" aria-posinset="2" role="listitem"></div>';
            dashboard.$().find(".sapUshellEasyScanLayoutInner").append(dummyCard);
            keyboardNavigation.jqElement = dashboard.$();
            var event = {
                keyCode: 39,
                preventDefault: function () { },
                stopImmediatePropagation:function () {
                    assert.ok(true, "stopImmediatePropagation function is called on keydown handler.");
                },
                relatedTarget: jQuery("<div class='easyScanLayoutItemWrapper'/>"),
            };
            keyboardNavigation.keyDownHandler(event);
            assert.ok(
                keyboardNavigation.layoutUtil.sLastFocusableCard.getAttribute("id") ===
                "mainView--ovpLayout--card04",
                "Focus is on right side card"
            );
            dashboard.destroy();
        };
        dashboardAfterRender(dashboard);
        dashboard.placeAt("testContainer");
        fnDone();
    });

    QUnit.test("Dashboard Layout - focus in case of left arrow key is pressed", function (assert) {
        var btn = new Button("btnId1");
        var dashboard = new DashboardLayout();
        dashboard.addAggregation("content", btn);
        document.body.insertAdjacentHTML("beforeend", '<div id="testContainer">');
        var testContainer = document.querySelector("#testContainer");
        var dashboardAfterRender = dashboard.onAfterRendering.bind(dashboard);
        var fnDone = assert.async();

        dashboard.onAfterRendering = function () {
            var keyboardNavigation = dashboard.keyboardNavigation;
            var dummyCard =
                '<div id="mainView--ovpLayout--card02" class="easyScanLayoutItemWrapper sapOvpDashboardLayoutItem" style="transform: translate3d(0px, 0px, 0px); height: 592px; width: 317.6px;" tabindex="0" ;="" aria-setsize="1" aria-posinset="1" role="listitem"></div><div id="mainView--ovpLayout--card04" class="easyScanLayoutItemWrapper sapOvpDashboardLayoutItem" style="transform: translate3d(952.8px, 0px, 0px); height: 512px; width: 317.6px;" aria-posinset="2" role="listitem"></div>';
            dashboard.$().find(".sapUshellEasyScanLayoutInner").append(dummyCard);
            keyboardNavigation.jqElement = dashboard.$();
            document.activeElement.id = "card05";
            var event = {
                keyCode: 37,
                preventDefault: function () { },
                stopImmediatePropagation:function () {
                    assert.ok(true, "stopImmediatePropagation function is called on keydown handler.");
                },
                relatedTarget: jQuery("<div class='easyScanLayoutItemWrapper'/>"),
            };
            var jqFocused = jQuery(document.activeElement);
            jqFocused.addClass("easyScanLayoutItemWrapper");
            keyboardNavigation.keyDownHandler(event);
            assert.ok(
                keyboardNavigation.layoutUtil.sLastFocusableCard.getAttribute("id") ===
                "mainView--ovpLayout--card02",
                "Focus is on right side card"
            );
            dashboard.destroy();
            fnDone();
        };
        dashboardAfterRender(dashboard);
        dashboard.placeAt("testContainer");
    });
});
