sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/cards/CommonUtils",
    "sap/ovp/ui/DashboardLayoutUtil",
    "sap/ui/Device"
], function (
    utils,
    mockservers,
    CommonUtils,
    DashboardLayoutUtil,
    Device
) {
    "use strict";

    var iDashboardWidth = window.innerWidth;
    QUnit.module("sap.ovp.ui.DashboardLayoutUtil", {
        beforeEach: function () {
            mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
            if (!this.dashboardLayoutUtil) {
                this.dashboardLayoutUtil = new DashboardLayoutUtil();
            }
        },
        afterEach: function () { },
    });

    QUnit.test("Constructor Test", function (assert) {
        assert.ok(this.dashboardLayoutUtil.ROW_HEIGHT_PX === 16, "initial Row height should be 16 px");
        assert.ok(this.dashboardLayoutUtil.MIN_COL_WIDTH_PX === 320, "initial Column height should be 320 px");
        assert.ok(this.dashboardLayoutUtil.CARD_BORDER_PX === 8, "initial Card border should be 8 px");
        assert.ok(
            this.dashboardLayoutUtil.EXTRA_MARGIN === 8,
            "initial Extra margin should be 8 px, this is required for dynamicPageHeader"
        );
        assert.ok(
            this.dashboardLayoutUtil.oLayoutData.layoutWidthPx === 1680,
            "initial layout width is assumed as 1680 px"
        );
        assert.ok(
            this.dashboardLayoutUtil.oLayoutData.contentWidthPx === 1600,
            "initial content width is assumed as 1600 px"
        );
        assert.ok(this.dashboardLayoutUtil.oLayoutData.colCount === 5, "initial number of columns is set as 5");

        //transform based on browser settings
        switch (true) {
            case Device.browser.webkit:
                assert.ok(
                    this.dashboardLayoutUtil.cssVendorTransition === "-webkit-transition",
                    "transition settings for webkit"
                );
                assert.ok(
                    this.dashboardLayoutUtil.cssVendorTransform === "-webkit-transform",
                    "transform settings for webkit"
                );
                break;
            case Device.browser.msie:
                assert.ok((this.dashboardLayoutUtil.cssVendorTransition = "-ms-transition"), "transition settings for ie");
                assert.ok((this.dashboardLayoutUtil.cssVendorTransform = "-ms-transform"), "transform settings for ie");
                break;
            case Device.browser.mozilla:
                assert.ok(
                    (this.dashboardLayoutUtil.cssVendorTransition = "-moz-transition"),
                    "transition settings for mozilla"
                );
                assert.ok(
                    (this.dashboardLayoutUtil.cssVendorTransform = "-moz-transform"),
                    "transform settings for mozilla"
                );
                break;
            default:
                assert.ok((this.dashboardLayoutUtil.cssVendorTransition = "transition"), "default transition settings");
                assert.ok((this.dashboardLayoutUtil.cssVendorTransform = "transform"), "default transform settings");
        }
    });

    QUnit.test("Test to update layout data", function (assert) {
        var updateLayoutData = this.dashboardLayoutUtil.updateLayoutData(iDashboardWidth);
        var iDashboardMargin = updateLayoutData.marginPx,
            iSmallScreenWidth = 320,
            iMiddleScreenWidth = 1024,
            iCardMargin = this.dashboardLayoutUtil.CARD_BORDER_PX,
            iNewScreenWidth = iDashboardWidth + iDashboardMargin;
        assert.ok(
            this.dashboardLayoutUtil.oLayoutData.layoutWidthPx === iDashboardWidth,
            "screen width changes accordingly. Expected: " +
            iDashboardWidth +
            " Actual: " +
            this.dashboardLayoutUtil.oLayoutData.layoutWidthPx
        );

        if (iNewScreenWidth <= iSmallScreenWidth) {
            assert.ok(
                iDashboardMargin === this.dashboardLayoutUtil.convertRemToPx(0.5) - iCardMargin,
                "case for small screens. Actual: " +
                iDashboardMargin +
                " Expected: " +
                (this.dashboardLayoutUtil.convertRemToPx(0.5) - iCardMargin)
            );
        } else if (iNewScreenWidth <= iMiddleScreenWidth) {
            assert.ok(
                iDashboardMargin === this.dashboardLayoutUtil.convertRemToPx(1) - iCardMargin,
                "case for mid size screens. Actual: " +
                iDashboardMargin +
                " Expected: " +
                (this.dashboardLayoutUtil.convertRemToPx(1) - iCardMargin)
            );
        } else {
            assert.ok(
                iDashboardMargin === this.dashboardLayoutUtil.convertRemToPx(3) - iCardMargin,
                "default case: Expected : " +
                (this.dashboardLayoutUtil.convertRemToPx(3) - iCardMargin) +
                " Actual: " +
                iDashboardMargin
            );
        }
        if (iDashboardMargin !== this.dashboardLayoutUtil.oLayoutData.marginPx) {
            assert.ok(this.dashboardLayoutUtil.oLayoutData.marginPx === iDashboardMargin, "new margin is set");
        }

        assert.ok(
            this.dashboardLayoutUtil.oLayoutData.colCount ===
            Math.round(
                this.dashboardLayoutUtil.oLayoutData.contentWidthPx / this.dashboardLayoutUtil.MIN_COL_WIDTH_PX
            ),
            "calculate the extra space for vertical scroll bar on the desktop"
        );
        if (this.dashboardLayoutUtil.oLayoutData.colCount === 0) {
            assert.ok(this.dashboardLayoutUtil.oLayoutData.colCount === 1, "single column layout");
        }
        assert.ok(
            this.dashboardLayoutUtil.oLayoutData.colWidthPx ===
            this.dashboardLayoutUtil.oLayoutData.contentWidthPx / this.dashboardLayoutUtil.oLayoutData.colCount,
            "column width calculation correct"
        );
    });

    QUnit.test("Test to convert Rem to px", function (assert) {
        var iExpected = "4 px";
        var iActual = this.dashboardLayoutUtil.convertRemToPx(iExpected);

        if (typeof iExpected === "string" || iExpected instanceof String) {
            //take string with a rem unit
            iExpected = iExpected.length > 0 ? parseInt(iExpected.split("rem")[0], 10) : 0;
        }
        iExpected = iExpected * CommonUtils.getPixelPerRem();
        assert.ok(iActual === iExpected, "");
    });

    QUnit.test("Test to convert px to Rem", function (assert) {
        var iExpected = "8 rem";
        var iActual = this.dashboardLayoutUtil.convertPxToRem(iExpected);

        if (typeof iExpected === "string" || iExpected instanceof String) {
            //take string with a rem unit
            iExpected = iExpected.length > 0 ? parseInt(iExpected.split("rem")[0], 10) : 0;
        }
        iExpected = iExpected / CommonUtils.getPixelPerRem();
        assert.ok(iActual === iExpected, "");
    });

    QUnit.test("test getDashboardLayoutModel", function (assert) {
        assert.ok(
            this.dashboardLayoutUtil.getDashboardLayoutModel() === this.dashboardLayoutUtil.dashboardLayoutModel,
            "should return the dashboardLayoutModel instance"
        );
    });

    QUnit.test("test getCards with colCount 0", function (assert) {
        this.dashboardLayoutUtil.aCards = [
            {
                id: "card001",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                dashboardLayout: {
                    autoSpan: true,
                    colSpan: 1,
                    column: 1,
                    containerLayout: "resizable",
                    headerHeight: 82,
                    height: "192px",
                    iCardBorderPx: 8,
                    iRowHeightPx: 16,
                    itemHeight: 64,
                    left: "0px",
                    maxColSpan: 1,
                    noOfItems: 3,
                    row: 1,
                    rowSpan: 12,
                    showOnlyHeader: false,
                    top: "0px",
                    visible: true,
                    width: "380px",
                },
                settings: {
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                    customParams: "getParameters",
                    defaultSpan: { rows: 3, cols: 1 },
                    entitySet: "ProductSet",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                    listType: "condensed",
                    sortBy: "Availability_Status",
                    sortOrder: "Descending",
                    subTitle: "Less than 10 in stock",
                    title: "Reorder Soon",
                },
            },
        ];
        assert.ok(
            this.dashboardLayoutUtil.getCards(0) === this.dashboardLayoutUtil.aCards,
            "should return array of cards"
        );
    });

    QUnit.test("test getCards with colCount 5", function (assert) {
        this.dashboardLayoutUtil.aCards = [
            {
                id: "card001",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                dashboardLayout: {
                    autoSpan: true,
                    colSpan: 1,
                    column: 1,
                    containerLayout: "resizable",
                    headerHeight: 82,
                    height: "192px",
                    iCardBorderPx: 8,
                    iRowHeightPx: 16,
                    itemHeight: 64,
                    left: "0px",
                    maxColSpan: 1,
                    noOfItems: 3,
                    row: 1,
                    rowSpan: 12,
                    showOnlyHeader: false,
                    top: "0px",
                    visible: true,
                    width: "380px",
                },
                settings: {
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                    customParams: "getParameters",
                    defaultSpan: { rows: 3, cols: 1 },
                    entitySet: "ProductSet",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                    listType: "condensed",
                    sortBy: "Availability_Status",
                    sortOrder: "Descending",
                    subTitle: "Less than 10 in stock",
                    title: "Reorder Soon",
                },
            },
        ];
        this.dashboardLayoutUtil.dashboardLayoutModel.getCards = function () {
            return this.dashboardLayoutUtil.aCards;
        }.bind(this);
        assert.ok(
            this.dashboardLayoutUtil.getCards(5) === this.dashboardLayoutUtil.aCards,
            "should return array of cards"
        );
    });

    QUnit.test("test resizeLayout function", function (assert) {
        this.dashboardLayoutUtil.aCards = [
            {
                id: "card001",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                dashboardLayout: {
                    autoSpan: true,
                    colSpan: 1,
                    column: 1,
                    containerLayout: "resizable",
                    headerHeight: 82,
                    height: "192px",
                    iCardBorderPx: 8,
                    iRowHeightPx: 16,
                    itemHeight: 64,
                    left: "0px",
                    maxColSpan: 1,
                    noOfItems: 3,
                    row: 1,
                    rowSpan: 12,
                    showOnlyHeader: false,
                    top: "0px",
                    visible: true,
                    width: "380px",
                },
                settings: {
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                    customParams: "getParameters",
                    defaultSpan: { rows: 3, cols: 1 },
                    entitySet: "ProductSet",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                    listType: "condensed",
                    sortBy: "Availability_Status",
                    sortOrder: "Descending",
                    subTitle: "Less than 10 in stock",
                    title: "Reorder Soon",
                },
            },
        ];
        this.dashboardLayoutUtil.dashboardLayoutModel.getCards = function () {
            return this.dashboardLayoutUtil.aCards;
        }.bind(this);
        this.dashboardLayoutUtil.dashboardLayoutModel._removeSpaceBeforeCard = function () { }.bind(this);
        this.dashboardLayoutUtil.oLayoutCtrl.fireAfterDragEnds = function () { }.bind(this);
        this.dashboardLayoutUtil.setAriaPos = function () { }.bind(this);
        assert.ok(this.dashboardLayoutUtil.resizeLayout() === undefined, "by default function returns undefined");
    });

    QUnit.test("test getCardDomId function", function (assert) {
        this.dashboardLayoutUtil.layoutDomId = "mainView--ovpLayout";
        assert.ok(
            this.dashboardLayoutUtil.getCardDomId("card00") === "mainView--ovpLayout--card00",
            "should return the card dom id mainView--ovpLayout--card00"
        );
    });

    QUnit.test("test getCardId function", function (assert) {
        assert.ok(
            this.dashboardLayoutUtil.getCardId("mainView--ovpLayout--card00") === "card00",
            "should return the card id card00"
        );
    });

    QUnit.test("test getCardIdFromComponent function", function (assert) {
        assert.ok(
            this.dashboardLayoutUtil.getCardIdFromComponent("mainView--card00") === "card00",
            "should return the card id card00 from card component id"
        );
    });

    QUnit.test("test _getCardComponentDomId function", function (assert) {
        this.dashboardLayoutUtil.componentDomId = "mainView";
        assert.ok(
            this.dashboardLayoutUtil._getCardComponentDomId("card00") === "mainView--card00",
            "should return the card component dom id mainView--card00 from card id card00"
        );
    });

    QUnit.test("test getLayoutWidthPx function", function (assert) {
        assert.ok(
            this.dashboardLayoutUtil.getLayoutWidthPx() === 1600,
            "should return this.oLayoutData.colCount * this.oLayoutData.colWidthPx = 5 * 320 = 1600"
        );
    });

    QUnit.test("test getColWidthPx function", function (assert) {
        assert.ok(this.dashboardLayoutUtil.getColWidthPx() === 320, "should return this.oLayoutData.colWidthPx = 320");
    });

    QUnit.test("test getRowHeightPx function", function (assert) {
        assert.ok(this.dashboardLayoutUtil.getRowHeightPx() === 16, "should return this.oLayoutData.rowHeightPx = 16");
    });

    QUnit.test("test _setColCount function", function (assert) {
        this.dashboardLayoutUtil._setColCount(4);
        assert.ok(this.dashboardLayoutUtil.oLayoutData.colCount === 4, "should return colCount = 16");
    });

    QUnit.test("test isCardAutoSpan function", function (assert) {
        this.dashboardLayoutUtil.dashboardLayoutModel.aCards = [
            {
                id: "card001",
                model: "salesOrder",
                template: "sap.ovp.cards.list",
                dashboardLayout: {
                    autoSpan: true,
                    colSpan: 1,
                    column: 1,
                    containerLayout: "resizable",
                    headerHeight: 82,
                    height: "192px",
                    iCardBorderPx: 8,
                    iRowHeightPx: 16,
                    itemHeight: 64,
                    left: "0px",
                    maxColSpan: 1,
                    noOfItems: 3,
                    row: 1,
                    rowSpan: 12,
                    showOnlyHeader: false,
                    top: "0px",
                    visible: true,
                    width: "380px",
                },
                settings: {
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                    customParams: "getParameters",
                    defaultSpan: { rows: 3, cols: 1 },
                    entitySet: "ProductSet",
                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                    listType: "condensed",
                    sortBy: "Availability_Status",
                    sortOrder: "Descending",
                    subTitle: "Less than 10 in stock",
                    title: "Reorder Soon",
                },
            },
        ];
        assert.ok(
            this.dashboardLayoutUtil.isCardAutoSpan("card00") === true,
            "should return the autospan of card with id card00"
        );
    });
});
