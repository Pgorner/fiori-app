/*global QUnit*/

sap.ui.define([
    "sap/ovp/cards/OVPCardAsAPIUtils",
    "sap/ovp/cards/CommonUtils",
    "sap/ui/core/mvc/Controller"
], function (
    OVPCardAsAPIUtils,
    CommonUtils,
    Controller
) {
    "use strict";

    var testContainer;
    var oController;
    
    QUnit.module("sap.ovp.cards.List", {
        beforeEach: function () {
            document.body.insertAdjacentHTML("beforeend", '<div id="testContainer" style="display: none;">');
            testContainer = document.querySelector("#testContainer");
            var workingArea = '<div id="root">' + '<div id="container"> </div>' + "</div>";
            document.body.insertAdjacentHTML("beforeend", workingArea);
            return Controller.create({
                name: "sap.ovp.cards.v4.list.List"
            }).then(function(controller) { 
                oController = controller;
            });
        },
        afterEach: function () {
            testContainer.parentNode.removeChild(testContainer);
            oController.destroy();
        },
    });

    // /**
    //  *  ------------------------------------------------------------------------------
    //  *  Start of test cases to update minMaxModel and barChart value
    //  *  ------------------------------------------------------------------------------
    //  */

    QUnit.test("Card List Controller Test- returnBarChartValue First Data Point has Percentage Unit when value is greater then zero", function (assert) {
        oController._updateMinMaxModel = function () {
            return {
                minValue: 0,
                maxValue: 100,
            };
        };
        assert.ok(oController.returnBarChartValue(70) == 70, "show minimal value in negative");
    });

    QUnit.test("Card List Controller Test- returnBarChartValue First Data Point has Percentage Unit  when both Max is equal to zero and min is equal to zero", function (assert) {
        oController._updateMinMaxModel = function () {
            return {
                minValue: 0,
                maxValue: 0,
            };
        };
        assert.ok(oController.returnBarChartValue(0) == 0, "Show value as it is.");
    });

    // // /**
    // //  *  ------------------------------------------------------------------------------
    // //  *  End of test cases to update minMaxModel and barChart value
    // //  *  ------------------------------------------------------------------------------
    // //  */

    // // /**
    // //  *  ------------------------------------------------------------------------------
    // //  *  Start of Test Cases for resize cards
    // //  *  ------------------------------------------------------------------------------
    // //  */
    function testResizeCard(oController, lengthVal, card) {
        var classList = {
            remove: function () {
                return ["sapMFlexItem", "sapOvpCardContentContainer", "sapOvpWrapper"];
            },
            add: function () {
                return ["sapMFlexItem", "sapOvpContentHidden", "sapOvpCardContentContainer", "sapOvpWrapper"];
            },
        };
        oController.cardId = card;
        oController.oDashboardLayoutUtil = {
            getCardDomId: function () {
                return "mainView--ovpLayout--" + oController.cardId;
            },
        };
        oController.getCardItemBindingInfo = function () {
            return { length: lengthVal };
        };
        oController.getCardItemsBinding = function () {
            return {
                refresh: function () {
                    return true;
                },
            };
        };
        oController.getHeaderHeight = function () {
            return 82;
        };
        oController.getView = function () {
            return {
                byId: function (id) {
                    return {
                        getDomRef: function () {
                            return {
                                classList: classList,
                                style: {
                                    height: "",
                                },
                            };
                        },
                    };
                },
            };
        };
        oController.minMaxModel.refresh = function () {
            return true;
        };
    }

    QUnit.test("Card Test - resize card, when showOnlyHeader is false, No change in number of rows", function (assert) {
        var newCardLayout = {
            showOnlyHeader: false,
            rowSpan: 20,
            iRowHeightPx: 16,
            iCardBorderPx: 8,
            noOfItems: 3,
        };
        var cardSizeProperties = {
            dropDownHeight: 0,
            itemHeight: 111,
        };
        document.body.insertAdjacentHTML(
            "beforeend",
            '<div id="mainView--ovpLayout--card001" style="height:320px; width:1500px">'
        );
        var testContainer = document.querySelector("#mainView--ovpLayout--card001");
        document.querySelector("#container").appendChild(testContainer);

        testResizeCard(oController, 2, "card001");
        var iNoOfItems = 2;
        oController.resizeCard(newCardLayout, cardSizeProperties);
        assert.ok(oController.getCardItemBindingInfo().length === iNoOfItems, "No change in number of rows");
    });
        
    QUnit.test("Card Test - resize card, when showOnlyHeader is false, Show more less of rows", function (assert) {
        var newCardLayout = {
            showOnlyHeader: false,
            rowSpan: 20,
            iRowHeightPx: 16,
            iCardBorderPx: 8,
            noOfItems: 3,
        };
        var cardSizeProperties = {
            dropDownHeight: 0,
            itemHeight: 111,
        };
        document.body.insertAdjacentHTML(
            "beforeend",
            '<div id="mainView--ovpLayout--card002" style="height:320px; width:1500px">'
        );
        var testContainer = document.querySelector("#mainView--ovpLayout--card002");
        document.querySelector("#container").appendChild(testContainer);
        testResizeCard(oController, 4, "card002");
        var iNoOfItems = 2;
        oController.resizeCard(newCardLayout, cardSizeProperties);
        assert.ok(oController.getCardItemBindingInfo().length !== iNoOfItems, "Show less number of rows");
    });

    QUnit.test("Card Test - resize card, when showOnlyHeader is false, Show more number of rows", function (assert) {
        var newCardLayout = {
            showOnlyHeader: false,
            rowSpan: 20,
            iRowHeightPx: 16,
            iCardBorderPx: 8,
            noOfItems: 3,
        };
        var cardSizeProperties = {
            dropDownHeight: 0,
            itemHeight: 111,
        };
        document.body.insertAdjacentHTML(
            "beforeend",
            '<div id="mainView--ovpLayout--card003" style="height:320px; width:1500px">'
        );
        var testContainer = document.querySelector("#mainView--ovpLayout--card003");
        document.querySelector("#container").appendChild(testContainer);
        testResizeCard(oController, 2, "card003");
        var iNoOfItems = 4;
        oController.resizeCard(newCardLayout, cardSizeProperties);
        assert.ok(oController.getCardItemBindingInfo().length !== iNoOfItems, "Show more number of rows");
    });

    QUnit.test("Card Test - resize card, when showOnlyHeader is true", function (assert) {
        var newCardLayout = {
            showOnlyHeader: true,
            rowSpan: 20,
            iRowHeightPx: 16,
            iCardBorderPx: 8,
            noOfItems: 3,
        };
        var cardSizeProperties = {
            dropDownHeight: 0,
            itemHeight: 111,
        };
        document.body.insertAdjacentHTML(
            "beforeend",
            '<div id="mainView--ovpLayout--card004" style="height:320px; width:1500px">'
        );
        var testContainer = document.querySelector("#mainView--ovpLayout--card004");
        document.querySelector("#container").appendChild(testContainer);
        testResizeCard(oController, 2, "card004");
        var iNoOfItems = 4;
        oController.resizeCard(newCardLayout, cardSizeProperties);
        assert.ok(oController.getCardItemBindingInfo().length !== iNoOfItems, "Show more number of rows");
    });
    // // /**
    // //  *  ------------------------------------------------------------------------------
    // //  *  End of Test Cases for resize cards
    // //  *  ------------------------------------------------------------------------------
    // //  */

    QUnit.test("Card Test - Testing card item binding info", function (assert) {
        oController.getView = function () {
            return {
                byId: function (id) {
                    return {
                        getBindingInfo: function (val) {
                            return {};
                        },
                    };
                },
            };
        };
        var expectedResult = {};
        assert.deepEqual(oController.getCardItemBindingInfo(), expectedResult);
    });

    QUnit.test("Card Test - Testing card item binding", function (assert) {
        oController.getView = function () {
            return {
                byId: function (id) {
                    return {
                        getBinding: function (val) {
                            return {};
                        },
                    };
                },
            };
        };
        var expectedResult = {};
        assert.deepEqual(oController.getCardItemsBinding(), expectedResult);
    });

    // // /**
    // //  *  Start of test cases
    // //  *  This function does some CSS changes after the card is rendered
    // //  */
    function ImageStyle(oController, desc, icon) {
        oController.byId = function (ovpList) {
            return {
                getItems: function () {
                    return [
                        {
                            getIcon: function () {
                                return icon;
                            },
                            getDomRef: function () {
                                return {
                                    children: [
                                        {
                                            id: "ovpIconImage",
                                            children: [
                                                {
                                                    getAttribute: function (val1) {
                                                        return "sapMImg sapMSLIImgThumb";
                                                    },
                                                    setAttribute: function (val1, val2) {
                                                        oController.attributeClass = val2;
                                                        return val2;
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                    getAttribute: function (val) {
                                        return val;
                                    },
                                    insertBefore: function (val1, val2) {
                                        oController.placeHolderClass = val1.className;
                                        return "";
                                    },
                                };
                            },
                            getDescription: function () {
                                return desc;
                            },
                            getTitle: function () {
                                return "Electronics Retail & Co.";
                            },
                            addStyleClass: function (val) {
                                oController.class = val;
                                return val;
                            },
                        },
                    ];
                },
                getDomRef: function () {
                    return {
                        getAttribute: function () {
                            return "sapMList sapMListBGSolid";
                        },
                        setAttribute: function (val1, val2) {
                            oController.densityClass = val2;
                            return val2;
                        },
                    };
                },
            };
        };
    }

    QUnit.test("Card Test - onAfterRendering, when density style = compact and imageDensity = true", function (assert) {
        var image = "https://www.w3schools.com/css/trolltunga.jpg";
        ImageStyle(oController, "Smart Firewall", image);
        oController._addImageCss("compact");
        var expectedValue = "sapOvpListWithImageIconCompact";
        assert.ok(oController.densityClass.indexOf("sapOvpListImageCompact") != -1, "Set the list image compact css");
        assert.ok(oController.class === expectedValue, "Set the compact css when image is present");
    });

    QUnit.test("Card Test - onAfterRendering, when density style = cozy and imageDensity = true", function (assert) {
        var image = "https://www.w3schools.com/css/trolltunga.jpg";
        ImageStyle(oController, "Smart Firewall", image);
        oController._addImageCss("cozy");
        var expectedValue1 = "sapOvpListWithImageIconCozy";
        assert.ok(oController.densityClass.indexOf("sapOvpListImageCozy") != -1, "Set the list image cozy css");
        assert.ok(oController.class === expectedValue1, "Set the css when image is present");
        assert.ok(oController.attributeClass.indexOf("sapOvpImageCozy") != -1, "Set the attribute css");
    });

    QUnit.test("Card Test - onAfterRendering, when density style = cozy, imageDensity = true, no description and icon is present", function (assert) {
        var icon = "https://www.w3schools.com/css/trolltunga/icon.jpg";
        ImageStyle(oController, "", icon);
        oController._addImageCss("cozy");
        var expectedValue = "sapOvpListWithIconNoDescCozy";
        assert.ok(oController.densityClass.indexOf("sapOvpListImageCozy") != -1, "Set the list image cozy css");
        assert.ok(oController.class === expectedValue, "Set the css when icon is present");
    });

    QUnit.test("Card Test - onAfterRendering, when density style = cozy, imageDensity = true and no description", function (assert) {
        var image = "https://www.w3schools.com/css/trolltunga.jpg";
        ImageStyle(oController, "", image);
        oController._addImageCss("cozy");
        var expectedValue1 = "sapOvpListWithImageNoDescCozy";
        assert.ok(oController.class === expectedValue1, "Set the css when image is present");
    });

    QUnit.test("Card Test - onAfterRendering, when density style = cozy, imageDensity = true and no image and icon is present", function (assert) {
        var image = "";
        ImageStyle(oController, "", image);
        oController._addImageCss("cozy");
        assert.ok(oController.placeHolderClass.indexOf("sapOvpImageCozy") != -1, "There is no image and icon present");
    });
    // /**
    //  *  End of test cases
    //  *  This function does some CSS changes after the card is rendered
    //  */

    // /**
    //  *
    //  * Start of test cases onListItemPress
    //  */
    QUnit.test("List Card Test - On Content click of OVP Cards used as an API in other Applications", function (assert) {
        var oOVPCardAsAPIUtilsStub = sinon.stub(OVPCardAsAPIUtils, "checkIfAPIIsUsed").returns(true);
        var oCommonUtilsStub = sinon.stub(CommonUtils, "onContentClicked").returns(undefined);
        oController.checkAPINavigation = function () {
            return 1;
        };
        var actualValue = oController.onListItemPress();
        assert.ok(actualValue === undefined, "Valid semantic object and action are not available");
        oOVPCardAsAPIUtilsStub.restore();
        oCommonUtilsStub.restore();
    });

    QUnit.test("Check enablement of insight button for v4 list card", function (assert) {
        var bAddToInsightsEnabled = false;
        oController.additionalCardActionsMenu = Promise.resolve({enabled: bAddToInsightsEnabled, openBy : function(){}});

        oController.getView = function() {
            return {
                byId : function() {
                    return {
                        getEnabled : function() { return false; },
                        setEnabled : function() {bAddToInsightsEnabled = true;}
                    }
                }
            };
        };

        assert.ok(!bAddToInsightsEnabled, "The button Add Card To Insights is not enabled as data received is not called yet.");
        var fnDone = assert.async();

        oController.onShowAdditionalCardActions({getSource : function() {}, cancelBubble: function() {}});

        setTimeout(function() {
            assert.ok(!bAddToInsightsEnabled, "The button Add Card To Insights is not enabled as data received is not called yet.");
            oController.onDataReceived(oController);
            oController.onShowAdditionalCardActions({getSource : function() {}, cancelBubble: function() {}});

            setTimeout(function() {
                assert.ok(bAddToInsightsEnabled, "The button Add Card To Insights is enabled as data received is called and then after tripple dot is clicked.");
                fnDone();
            });
        });
    });
    /**
     *
     * End of test cases onListItemPress
     */
});
