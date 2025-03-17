/*global QUnit*/

sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/cards/CommonUtils",
    "sap/ovp/ui/DashboardLayoutModel"
], function (
    utils,
    Mockserver,
    CommonUtils,
    DashboardLayoutModel
) {
    "use strict";

    QUnit.module("DashboardLayoutModel", {
        beforeEach: function () {
            Mockserver.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
        },
        afterEach: function () { },
    });

    QUnit.test("DashboardLayoutModel Constructor Test", function (assert) {
        //create DashboardLayoutModel object with initial configuration
        if (!this.dashboardLayoutModel) {
            this.dashboardLayoutModel = new DashboardLayoutModel("", null, 16, 8);
        }
        assert.ok(this.dashboardLayoutModel.iColCount === 5, "initial column count should be 5");
        assert.ok(this.dashboardLayoutModel.iCardBorderPx === 8, "initial card border should be 8px");
        assert.ok(this.dashboardLayoutModel.iRowHeightPx === 16, "initial row height should be 16px");
    });

    QUnit.test("setColCount function test", function (assert) {
        //create DashboardLayoutModel object with column count 10
        if (!this.dashboardLayoutModel) {
            this.dashboardLayoutModel = new DashboardLayoutModel("", 10, 16, 8);
        }
        assert.ok(this.dashboardLayoutModel.iColCount === 10, "column count should be 10");
    });

    QUnit.test("getColCount function test", function (assert) {
        //create DashboardLayoutModel object with column count 4
        if (!this.dashboardLayoutModel) {
            this.dashboardLayoutModel = new DashboardLayoutModel("", 4, 16, 8);
        }
        assert.ok(this.dashboardLayoutModel.getColCount() === 4, "column count should be 4");
    });

    QUnit.test("getCardById function test", function (assert) {
        //create DashboardLayoutModel object with initial configuration
        if (!this.dashboardLayoutModel) {
            this.dashboardLayoutModel = new DashboardLayoutModel("", null, 16, 8);
        }
        this.dashboardLayoutModel.aCards = [
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
            this.dashboardLayoutModel.getCardById("card001") === this.dashboardLayoutModel.aCards[0],
            "should return the card with id card001"
        );
    });

    QUnit.test("getLayoutVariants4Pers function test", function (assert) {
        //create DashboardLayoutModel object with initial configuration
        if (!this.dashboardLayoutModel) {
            this.dashboardLayoutModel = new DashboardLayoutModel("", null, 16, 8);
        }
        this.dashboardLayoutModel.oLayoutVars = [
            {
                id: "card001",
                selectedKey: undefined,
                visibility: true,
                dashboardLayout: {
                    C4: {
                        autoSpan: true,
                        col: 1,
                        colSpan: 1,
                        maxColSpan: 1,
                        noOfItems: 3,
                        row: 1,
                        rowSpan: 12,
                        showOnlyHeader: false,
                    },
                },
            },
        ];
        assert.ok(
            JSON.stringify(this.dashboardLayoutModel.getLayoutVariants4Pers()) ===
            JSON.stringify(this.dashboardLayoutModel.oLayoutVars),
            "should return the card layout variant for personalization"
        );
    });

    QUnit.test("_mergeLayoutVariants function test", function (assert) {
        if (!this.dashboardLayoutModel) {
            this.dashboardLayoutModel = new DashboardLayoutModel("", null, 16, 8);
        }
        var oSourceObject = {},
            oDestinationObject = {
                rowSpan: 12,
                colSpan: 1,
                maxColSpan: 1,
                noOfItems: 5,
                autoSpan: true,
                row: 1,
                col: 1,
                showOnlyHeader: true,
            };
        this.dashboardLayoutModel._mergeLayoutVariants(oSourceObject, oDestinationObject);
        assert.ok(
            oDestinationObject.rowSpan === oSourceObject.rowSpan,
            "source object rowSpan should be equal to destination object rowSpan"
        );
        assert.ok(
            oDestinationObject.colSpan === oSourceObject.colSpan,
            "source object colSpan should be equal to destination object colSpan"
        );
        assert.ok(
            oDestinationObject.maxColSpan === oSourceObject.maxColSpan,
            "source object maxColSpan should be equal to destination object maxColSpan"
        );
        assert.ok(
            oDestinationObject.noOfItems === oSourceObject.noOfItems,
            "source object noOfItems should be equal to destination object noOfItems"
        );
        assert.ok(
            oDestinationObject.autoSpan === oSourceObject.autoSpan,
            "source object autoSpan should be equal to destination object autoSpan"
        );
        assert.ok(
            oDestinationObject.row === oSourceObject.row,
            "source object row should be equal to destination object row"
        );
        assert.ok(
            oDestinationObject.col === oSourceObject.column,
            "source object column should be equal to destination object column"
        );
        assert.ok(
            oDestinationObject.showOnlyHeader === oSourceObject.showOnlyHeader,
            "source object showOnlyHeader should be equal to destination object showOnlyHeader"
        );
    });

    QUnit.test("_getDefaultCardItemHeightAndCount function test for list card", function (assert) {
        //create DashboardLayoutModel object with initial configuration
        if (!this.dashboardLayoutModel) {
            this.dashboardLayoutModel = new DashboardLayoutModel("", null, 16, 8);
        }
        var oCardProperties = {
            id: "card001",
            model: "salesOrder",
            template: "sap.ovp.cards.list",
            dashboardLayout: {},
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
        };
        var densityStyle = sinon.stub(CommonUtils, "_setCardpropertyDensityAttribute", function () {
            return "compact";
        });
        var oReturnedObject = this.dashboardLayoutModel._getDefaultCardItemHeightAndCount(oCardProperties);
        assert.ok(oReturnedObject.headerHeight == 82, "header height should be 82");
        assert.ok(oReturnedObject.itemHeight == 64, "item height should be 82");
        assert.ok(oReturnedObject.noOfItems == 5, "number of items should be 5");
        densityStyle.restore();
    });

    QUnit.test("_setCardSpanFromDefault function test for list card with defaultSpan", function (assert) {
        //create DashboardLayoutModel object with initial configuration
        if (!this.dashboardLayoutModel) {
            this.dashboardLayoutModel = new DashboardLayoutModel("", null, 16, 8);
        }
        var oCardProperties = {
            id: "card001",
            model: "salesOrder",
            template: "sap.ovp.cards.list",
            dashboardLayout: {},
            settings: {
                annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                customParams: "getParameters",
                defaultSpan: { rows: 3, cols: 1, showOnlyHeader: true },
                entitySet: "ProductSet",
                identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                listType: "condensed",
                sortBy: "Availability_Status",
                sortOrder: "Descending",
                subTitle: "Less than 10 in stock",
                title: "Reorder Soon",
            },
        };
        this.dashboardLayoutModel._setCardSpanFromDefault(oCardProperties);
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("autoSpan") &&
            oCardProperties.dashboardLayout.autoSpan === false,
            "it should add property autoSpan in dashboardLayout object with value false"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("colSpan") &&
            oCardProperties.dashboardLayout.colSpan === 1,
            "it should add property colSpan in dashboardLayout object with value 1"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("headerHeight") &&
            oCardProperties.dashboardLayout.headerHeight === 82,
            "it should add property headerHeight in dashboardLayout object with value 82"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("itemHeight") &&
            oCardProperties.dashboardLayout.itemHeight === 64,
            "it should add property itemHeight in dashboardLayout object with value 64"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("maxColSpan") &&
            oCardProperties.dashboardLayout.maxColSpan === 1,
            "it should add property maxColSpan in dashboardLayout object with value 1"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("noOfItems") &&
            oCardProperties.dashboardLayout.noOfItems === 0,
            "it should add property noOfItems in dashboardLayout object with value 0"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("rowSpan") &&
            oCardProperties.dashboardLayout.rowSpan === 7,
            "it should add property rowSpan in dashboardLayout object with value 7"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("showOnlyHeader") &&
            oCardProperties.dashboardLayout.showOnlyHeader === true,
            "it should add property showOnlyHeader in dashboardLayout object with value true"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("visible") &&
            oCardProperties.dashboardLayout.visible === true,
            "it should add property visible in dashboardLayout object with value true"
        );
    });

    QUnit.test("_setCardSpanFromDefault function test for table card without defaultSpan", function (assert) {
        //create DashboardLayoutModel object with initial configuration
        if (!this.dashboardLayoutModel) {
            this.dashboardLayoutModel = new DashboardLayoutModel("", null, 16, 8);
        }
        var oCardProperties = {
            id: "card001",
            model: "salesOrder",
            template: "sap.ovp.cards.table",
            dashboardLayout: {},
            settings: {
                annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                customParams: "getParameters",
                entitySet: "ProductSet",
                identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                sortBy: "Availability_Status",
                sortOrder: "Descending",
                subTitle: "Less than 10 in stock",
                title: "Reorder Soon",
            },
        };
        this.dashboardLayoutModel._setCardSpanFromDefault(oCardProperties);
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("autoSpan") &&
            oCardProperties.dashboardLayout.autoSpan === true,
            "it should add property autoSpan in dashboardLayout object with value true"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("colSpan") &&
            oCardProperties.dashboardLayout.colSpan === 1,
            "it should add property colSpan in dashboardLayout object with value 1"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("headerHeight") &&
            oCardProperties.dashboardLayout.headerHeight === 82,
            "it should add property headerHeight in dashboardLayout object with value 82"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("itemHeight") &&
            oCardProperties.dashboardLayout.itemHeight === 48,
            "it should add property itemHeight in dashboardLayout object with value 48"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("maxColSpan") &&
            oCardProperties.dashboardLayout.maxColSpan === 1,
            "it should add property maxColSpan in dashboardLayout object with value 1"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("noOfItems") &&
            oCardProperties.dashboardLayout.noOfItems === 5,
            "it should add property noOfItems in dashboardLayout object with value 5"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("rowSpan") &&
            oCardProperties.dashboardLayout.rowSpan === 12,
            "it should add property rowSpan in dashboardLayout object with value 12"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("showOnlyHeader") &&
            oCardProperties.dashboardLayout.showOnlyHeader === false,
            "it should add property showOnlyHeader in dashboardLayout object with value false"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("visible") &&
            oCardProperties.dashboardLayout.visible === true,
            "it should add property visible in dashboardLayout object with value true"
        );
    });

    QUnit.test("_setCardSpanFromDefault function test for link list card without defaultSpan", function (assert) {
        //create DashboardLayoutModel object with initial configuration
        if (!this.dashboardLayoutModel) {
            this.dashboardLayoutModel = new DashboardLayoutModel("", null, 16, 8);
        }
        var oCardProperties = {
            id: "card001",
            model: "salesOrder",
            template: "sap.ovp.cards.linklist",
            dashboardLayout: {},
            settings: {
                annotationPath: "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                customParams: "getParameters",
                entitySet: "ProductSet",
                identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                sortBy: "Availability_Status",
                sortOrder: "Descending",
                subTitle: "Less than 10 in stock",
                title: "Reorder Soon",
            },
        };
        this.dashboardLayoutModel._setCardSpanFromDefault(oCardProperties);
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("autoSpan") &&
            oCardProperties.dashboardLayout.autoSpan === true,
            "it should add property autoSpan in dashboardLayout object with value true"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("colSpan") &&
            oCardProperties.dashboardLayout.colSpan === 1,
            "it should add property colSpan in dashboardLayout object with value 1"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("headerHeight") &&
            oCardProperties.dashboardLayout.headerHeight === 82,
            "it should add property headerHeight in dashboardLayout object with value 82"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("itemHeight") &&
            oCardProperties.dashboardLayout.itemHeight === 0,
            "it should add property itemHeight in dashboardLayout object with value 0"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("maxColSpan") &&
            oCardProperties.dashboardLayout.maxColSpan === 1,
            "it should add property maxColSpan in dashboardLayout object with value 1"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("noOfItems") &&
            oCardProperties.dashboardLayout.noOfItems === 6,
            "it should add property noOfItems in dashboardLayout object with value 6"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("rowSpan") &&
            oCardProperties.dashboardLayout.rowSpan === 1,
            "it should add property rowSpan in dashboardLayout object with value 1"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("showOnlyHeader") &&
            oCardProperties.dashboardLayout.showOnlyHeader === false,
            "it should add property showOnlyHeader in dashboardLayout object with value false"
        );
        assert.ok(
            oCardProperties.dashboardLayout.hasOwnProperty("visible") &&
            oCardProperties.dashboardLayout.visible === true,
            "it should add property visible in dashboardLayout object with value true"
        );
    });
});
