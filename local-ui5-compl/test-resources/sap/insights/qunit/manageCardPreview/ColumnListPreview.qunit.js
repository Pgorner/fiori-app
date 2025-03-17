/*global QUnit, sinon */
sap.ui.define([
    "sap/insights/manageCardPreview/ColumnListPreview",
    "sap/insights/utils/CardPreviewManager",
    "sap/insights/utils/DeviceType",
    "sap/insights/utils/Transformations"
], function (ColumnListPreview, CardPreviewManager, DeviceType, Transformations
  ) {
	"use strict";
	QUnit.module("Selection test cases", {
		beforeEach: function () {
			this.oSandbox = sinon.sandbox.create();
            this.oColumnList = new ColumnListPreview();
		},
		afterEach: function () {
			this.oSandbox.restore();
            this.oColumnList.destroy();
		}
	});
	QUnit.test("init", function(assert) {
        var stubGetId = sinon.stub(this.oColumnList, "getId");
        stubGetId.returns("test");
        var stubCreateStaticCtrl = sinon.stub(this.oColumnList, "createStaticControls");
        stubCreateStaticCtrl.returns();
        var stubSetAggregation = sinon.stub(this.oColumnList, "setAggregation");
        stubSetAggregation.returns();
        this.oColumnList.init();
        assert.ok(stubCreateStaticCtrl,"createStaticControls getting called");
        assert.ok(stubSetAggregation,"setAggregation getting called");
        stubGetId.restore();
        stubCreateStaticCtrl.restore();
        stubSetAggregation.restore();
    });
    QUnit.test("onBeforeRendering", function(assert) {
        var sManifest = '{"sap.card":{"type":"Table"}}',
        stubManifest = sinon.stub(this.oColumnList, "getManifest"),
        stubInitConfigureCard = sinon.stub(this.oColumnList, "_initConfigureCard"),
        stubAdjustLayoutStyles = sinon.stub(this.oColumnList, "_adjustLayoutStyles");
        stubManifest.returns(sManifest);
        stubInitConfigureCard.returns();
        stubAdjustLayoutStyles.returns();
        this.oColumnList.onBeforeRendering();
        var bInsightsColCardLayer = this.oColumnList.oInsightsColCardLayer.getVisible();
        assert.equal(bInsightsColCardLayer,true);
        assert.ok(stubInitConfigureCard,"_initConfigureCard getting called");
        assert.ok(stubAdjustLayoutStyles,"_adjustLayoutStyles getting called");
        stubManifest.restore();
        stubInitConfigureCard.restore();
        stubAdjustLayoutStyles.restore();
    });
    QUnit.test("_setCardColumnValue: function is called to set the Card Columns and Visible Column count value", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Desktop";};
        var oManifest = {
            "sap.card": {
                "type": "Table",
                "content": {
                    "row": {
                        "columns": [
                            {
                                "title": "title"
                            },
                            {
                                "title": "DummyTitle",
                                "visible": true
                            }
                        ]
                    }
                }
            }
        },
        oExpectedCountValues = {
            "/visibleColumnCount": 1,
            "/cardColumn": [
                {
                    "title": "title",
                    "visible": false
                },
                {
                    "title": "DummyTitle",
                    "visible": true
                }
            ]
        };
        this.oColumnList.oConfCard = oManifest;
        var oColListTable = this.oColumnList.oInsightsCardsEditColumnsListTable;
        var stubTransformations = sinon.stub(oColListTable, "bindAggregation");
        stubTransformations.returns();
        this.oColumnList._innerModel = {
            setProperty: function(sProperty, sValue) {
                assert.equal(JSON.stringify(sValue), JSON.stringify(oExpectedCountValues[sProperty]), "Property is set");
            }        };
        this.oColumnList._setCardColumnValue(oManifest);
        assert.ok(stubTransformations,"bindAggregation getting called");
        stubTransformations.restore();
    });
    QUnit.test("_initConfigureCard: card type is table", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Desktop";};
        var oManifest = {
            "sap.card": {
                "type": "Table"
            }
        },
        oColButton = this.oColumnList.oColumnSegButton;
        var stubSelectedKey = sinon.stub(oColButton, "getSelectedKey");
        stubSelectedKey.returns("Table");
        var stubCardPreviewManager = sinon.stub(CardPreviewManager, "getCardPreviewManifest");
        stubCardPreviewManager.returns(oManifest);
        var stubSetCardColumnValue = sinon.stub(this.oColumnList, "_setCardColumnValue");
        stubSetCardColumnValue.returns();
        this.oColumnList.oManifest = oManifest;
        this.oColumnList._initConfigureCard(oManifest);
        assert.ok(stubCardPreviewManager,"getCardPreviewManifest getting called");
        assert.ok(stubSetCardColumnValue,"_setCardColumnValue getting called");
        stubSetCardColumnValue.restore();
        stubCardPreviewManager.restore();
    });
    QUnit.test("_adjustLayoutStyles: when the screen is in desktop mode", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Desktop";};
        var oManifest = {
            "sap.card": {
                "type": "Table",
                "content": {
                    "row": {
                        "columns": [{"title": "title"}]
                    }
                }
            }
        };
        this.oColumnList.oConfCard = oManifest;
        this.oColumnList._adjustLayoutStyles();
        var sEditColumnsWidth = this.oColumnList.oEditColumnsName.getWidth(),
            bPreviewColCardFlex = this.oColumnList.oPreviewColCardFlex.getVisible(),
            bInsightsColumnEditFlexBox = this.oColumnList.oInsightsColumnEditFlexBox.getVisible();
        assert.equal(sEditColumnsWidth,"90%");
        assert.equal(bPreviewColCardFlex,false);
        assert.equal(bInsightsColumnEditFlexBox,true);
    });
    QUnit.test("_adjustLayoutStyles: when the screen is not in desktop mode", function(assert) {
          DeviceType.getDialogBasedDevice = function() {return "Mobile";};
          var oManifest = {
            "sap.card": {
                "type": "Table",
                "content": {
                    "row": {
                        "columns": [{"title": "title"}]
                    }
                }
            }
          };
          this.oColumnList.bShowPreview = true;
          this.oColumnList.oConfCard = oManifest;
          this.oColumnList._adjustLayoutStyles();
          var sColumnSearch = this.oColumnList.oColumnSearch.getWidth(),
                sEditColumnsTableCheckBox = this.oColumnList.oEditColumnsTableCheckBox.getWidth(),
                bPreviewColCardFlex = this.oColumnList.oPreviewColCardFlex.getVisible();
        assert.equal(sColumnSearch,"90%");
        assert.equal(sEditColumnsTableCheckBox,"20%");
        assert.equal(bPreviewColCardFlex,true);
    });
    QUnit.test("_callPreview: when we click preview card button", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Mobile";};
        this.oColumnList._callPreview();
        var bCardPreviewBtnResult = this.oColumnList.oCardPreviewBtn.getVisible(),
            chkFnCall = 0,
            bPreviewColCardVBoxResult = this.oColumnList.oPreviewColCardVBox.getVisible(),
            oPreviewSD = this.oColumnList.oPreviewColCardSD,
            oPreviewSDStub = sinon.stub(oPreviewSD, "refresh");
            oPreviewSDStub.returns(chkFnCall++);
        assert.equal(bCardPreviewBtnResult,false);
        assert.equal(bPreviewColCardVBoxResult,true);
        assert.ok(chkFnCall,1, "card is refreshed");
    });
    QUnit.test("_callClosePreview: when we click Hide preview card button", function(assert) {
        this.oColumnList._callClosePreview();
        var bCardPreviewBtnResult = this.oColumnList.oCardPreviewBtn.getVisible(),
            bPreviewColCardFlexResult = this.oColumnList.oPreviewColCardFlex.getVisible();
        assert.equal(bCardPreviewBtnResult,true);
        assert.equal(bPreviewColCardFlexResult,false);
    });
    QUnit.test("_onColumnSearch: called when we try searching for columns", function(assert) {
        var oEvent = {
            getSource: function() {
                return {
                    getValue: function() {
                        return "titleText ";
                    }
                };
            }
        },
        chkFnCall = 0,
        oInsightsCardsEditColList = this.oColumnList.oInsightsCardsEditColumnsListTable,
        stubBygetBinding = sinon.stub(oInsightsCardsEditColList, "getBinding");
		stubBygetBinding.returns({
            filter:  function() {
                chkFnCall++;
            }
        });
        this.oColumnList._onColumnSearch(oEvent);
        assert.equal(chkFnCall,1,"filter getting called");
    });
    QUnit.test("_refreshShowPreview: Preview card for latest changes", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Desktop";};
        this.oColumnList._refreshShowPreview();
        var chkFnCall = 0,
            oPreviewCard = this.oColumnList.oPreviewCard,
            oPreviewStub = sinon.stub(oPreviewCard, "refresh");
            oPreviewStub.returns(chkFnCall++);
        assert.ok(chkFnCall,1, "card is refreshed");
    });
    QUnit.test("_onColumnDrop: sInsertPosition is Before and drag index = drop index - 1", function(assert) {
        var chkFnCall = 0,
        oDroppedData = {
            getBindingContextPath: function() {
                chkFnCall++;
                return "/cardColumn/13";
            }
        },
        oDraggedData = {
            getBindingContextPath: function() {
                chkFnCall++;
                return "/cardColumn/12";
            }
        },
        oDummyEvent = {
            getParameter: function (sControl) {
                if (sControl === "draggedControl") {
                    return oDraggedData;
                } else if (sControl === "droppedControl") {
                    return oDroppedData;
                } else {
                    return "Before";
                }
            }
        },
        oExpectedCountValues = {
            "/cardColumn": ["test1","test2"]
        };
        this.oColumnList._oConfigureViewModel = {
            getProperty: function() {return ["test1","test2"];},
            setProperty: function(sProperty, sValue) {
                assert.equal(sValue, oExpectedCountValues[sProperty], "Property is set");
            }
        };
        this.oColumnList._onColumnDrop(oDummyEvent);
        assert.equal(chkFnCall,2,"getBindingContextPath getting called");

    });
    QUnit.test("_onColumnDrop: sInsertPosition is After and drag index = drop index + 1", function(assert) {
        var chkFnCall = 0,
        oDroppedData = {
            getBindingContextPath: function() {
                chkFnCall++;
                return "/cardColumn/12";
            }
        },
        oDraggedData = {
            getBindingContextPath: function() {
                chkFnCall++;
                return "/cardColumn/13";
            }
        },
        oDummyEvent = {
            getParameter: function (sControl) {
                if (sControl === "draggedControl") {
                    return oDraggedData;
                } else if (sControl === "droppedControl") {
                    return oDroppedData;
                } else {
                    return "After";
                }
            }
        },
        oExpectedCountValues = {
            "/cardColumn": ["test1","test2"]
        };
        this.oColumnList._oConfigureViewModel = {
            getProperty: function() {return ["test1","test2"];},
            setProperty: function(sProperty, sValue) {
                assert.equal(sValue, oExpectedCountValues[sProperty], "Property is set");
            }
        };
        this.oColumnList._onColumnDrop(oDummyEvent);
        assert.equal(chkFnCall,2,"getBindingContextPath getting called");
    });
    QUnit.test("_onColumnDrop: sInsertPosition is Before and drag index !== drop index", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Desktop";};
        var chkFnCall = 0,
        oDroppedData = {
            getBindingContextPath: function() {
                chkFnCall++;
                return "/cardColumn/3";
            }
        },
        oDraggedData = {
            getBindingContextPath: function() {
                chkFnCall++;
                return "/cardColumn/0";
            }
        },
        aDummyData =  [
            {
                pageId: "testId2"
            },
            {
                pageId: "testId1"
            }
        ],
        oDummyEvent = {
            getParameter: function (sControl) {
                if (sControl === "draggedControl") {
                    return oDraggedData;
                } else if (sControl === "droppedControl") {
                    return oDroppedData;
                } else {
                    return "Before";
                }
            }
        },
        oExpectedCountValues = {
            "/cardColumn": aDummyData
        };
        var stubCallShowPreview = sinon.stub(this.oColumnList, "_refreshShowPreview");
        stubCallShowPreview.returns();
        this.oColumnList.cardColumn = [
            {
                pageId: "testId1"
            },
            {
                pageId: "testId2"
            }
        ];
        this.oColumnList.oConfCard = {
            "sap.card": {
                content: {
                    item: {
                        attributes: []
                    }
                }
            }
        };
        this.oColumnList._innerModel = {
            setProperty: function(sProperty, sValue) {
                if (typeof sValue === "object") {
                    assert.equal(JSON.stringify(sValue), JSON.stringify(oExpectedCountValues[sProperty]), "Property is set");

                } else {
                    assert.equal(sValue, oExpectedCountValues[sProperty], "Property is set");
                }
            }
        };
        this.oColumnList._onColumnDrop(oDummyEvent);
        assert.equal(chkFnCall,2,"getBindingContextPath getting called");
        assert.ok(stubCallShowPreview,"_refreshShowPreview getting called");
    });
    QUnit.test("_onColumnDrop: sInsertPosition is After and drag index !== drop index", function(assert) {
        var chkFnCall = 0,
        oDroppedData = {
            getBindingContextPath: function() {
                chkFnCall++;
                return "/cardColumn/0";
            }
        },
        oDraggedData = {
            getBindingContextPath: function() {
                chkFnCall++;
                return "/cardColumn/3";
            }
        },
        oDummyEvent = {
            getParameter: function (sControl) {
                if (sControl === "draggedControl") {
                    return oDraggedData;
                } else if (sControl === "droppedControl") {
                    return oDroppedData;
                } else {
                    return "After";
                }
            }
        },
        aDummyData =  [
            {
                pageId: "testId1"
            },
            {
                pageId: "testId4"
            },
            {
                pageId: "testId2"
            },
            {
                pageId: "testId3"
            }
        ],
        oExpectedCountValues = {
            "/cardColumn": aDummyData
        };
        this.oColumnList.cardColumn = [
            {
                pageId: "testId1"
            },
            {
                pageId: "testId2"
            },
            {
                pageId: "testId3"
            },
            {
                pageId: "testId4"
            }
        ];
        this.oColumnList.oConfCard = {
            "sap.card": {
                content: {
                    item: {
                        attributes: []
                    }
                }
            }
        };
        this.oColumnList._innerModel = {
            setProperty: function(sProperty, sValue) {
                if (typeof sValue === "object") {
                    assert.equal(JSON.stringify(sValue), JSON.stringify(oExpectedCountValues[sProperty]), "Property is set");

                } else {
                    assert.equal(sValue, oExpectedCountValues[sProperty], "Property is set");
                }
            }
        };
        this.oColumnList._onColumnDrop(oDummyEvent);
        assert.equal(chkFnCall,2,"getBindingContextPath getting called");
    });

    QUnit.test("_onColumnDrop: when item is dropped on another item", function(assert) {
        var chkFnCall = 0,
        oDroppedData = {
            getBindingContextPath: function() {
                chkFnCall++;
                return "/cardColumn/1";
            }
        },
        oDraggedData = {
            getBindingContextPath: function() {
                chkFnCall++;
                return "/cardColumn/2";
            }
        },
        oDummyEvent = {
            getParameter: function (sControl) {
                if (sControl === "draggedControl") {
                    return oDraggedData;
                } else if (sControl === "droppedControl") {
                    return oDroppedData;
                } else {
                    return "On";
                }
            }
        },
        oExpectedCountValues = {
            "/cardColumn": ["test1","test2"]
        };
        this.oColumnList.cardColumn = [
            {
                pageId: "testId1"
            },
            {
                pageId: "testId2"
            },
            {
                pageId: "testId3"
            },
            {
                pageId: "testId4"
            }
        ];
        this.oColumnList.oConfCard = {
            "sap.card": {
                content: {
                    item: {
                        attributes: []
                    }
                }
            }
        };
        this.oColumnList._oConfigureViewModel = {
            getProperty: function() {return ["test1","test2"];},
            setProperty: function(sProperty, sValue) {
                assert.equal(sValue, oExpectedCountValues[sProperty], "Property is set");
            }
        };
        this.oColumnList._onColumnDrop(oDummyEvent);
        assert.equal(chkFnCall,2,"getBindingContextPath getting called");
    });

    QUnit.test("_handleColumnVisibilityToggle: function is called when we check or check the checkboxes of Column List", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Desktop";};
        var chkFnCall = 0,
        oEvent = {
            getSource: function() {
                return {
                    getSelected: function() {
                        chkFnCall++;
                        return true;
                    },
                    getBindingContext: function() {
                        return {
                            getPath: function() {
                                return "/testPath";
                            }
                        };
                    }
                };
            }
        },
        oExpectedCountValues = {
            "/visibleColumnCount": 1
        };
        this.oColumnList.iVisibleColumnCount = 0;
        this.oColumnList.oConfCard = {
            "sap.card": {
                content: {
                    row: {
                        columns: 0
                    }
                }
            }
        };
        this.oColumnList._innerModel = {
            getProperty:  function(sPropertyName) {
                if (sPropertyName === "/testPath") {
                    return {"visible": true};
                } else if (sPropertyName === "/visibleColumnCount") {
                    return 0;
                } else if (sPropertyName === "/bDesktop") {
                    return true;
                } else {
                    return {};
                }
            },
            setProperty: function(sProperty, sValue) {
                assert.equal(sValue, oExpectedCountValues[sProperty], "Property is set");
            }
        };
        var stubEnableAddButton = sinon.stub(this.oColumnList, "fireEnableAddButton");
        stubEnableAddButton.returns();
        this.oColumnList._handleColumnVisibilityToggle(oEvent);
        assert.equal(chkFnCall,1,"getSelected getting called");
        assert.ok(stubEnableAddButton,"fireEnableAddButton getting called");
        stubEnableAddButton.restore();
    });

    QUnit.test("_onSegmentedSelectionChange: card type is table", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Desktop";};
        var oManifest = {
            "sap.card": {
                "type": "Table",
                "content": {
                    "row": {
                        "columns": [{"title": "title"}]
                    }
                }
            }
        },
        oExpectedCountValues = {
            "/oConfCard": oManifest,
            "/cardColumn": [{"title": "title"}]
        },
        oColButton = this.oColumnList.oColumnSegButton;
        this.oColumnList.oConfCard = oManifest;
        var stubSelectedKey = sinon.stub(oColButton, "getSelectedKey");
        stubSelectedKey.returns("Table");
        var stubTransformations = sinon.stub(Transformations, "createListOptions");
        stubTransformations.returns([oManifest]);
        this.oColumnList._innerModel = {
            setProperty: function(sProperty, sValue) {
                assert.equal(JSON.stringify(sValue), JSON.stringify(oExpectedCountValues[sProperty]), "Property is set");
            }        };
        this.oColumnList._onSegmentedSelectionChange(oManifest);
        assert.ok(stubTransformations,"createListOptions getting called");
        stubTransformations.restore();
        stubSelectedKey.restore();
    });
    QUnit.test("_onSegmentedSelectionChange: card type is list", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Desktop";};
        var oManifest = {
            "sap.card": {
                "type": "List",
                "content": {
                    "item": {
                        "attributes": [{"title": "title"}]
                    },
                    "row": {
                        "columns": [{"title": "title"}]
                    }
                }
            }
        },
        oExpectedCountValues = {
            "/oConfCard": oManifest,
            "/cardColumn": [{"title": "title"}]
        },
        oColButton = this.oColumnList.oColumnSegButton;
        this.oColumnList.oConfCard = oManifest;
        var stubSelectKey = sinon.stub(oColButton, "getSelectedKey");
        stubSelectKey.returns("List");
        var stubTransCreation = sinon.stub(Transformations, "createListOptions");
        stubTransCreation.returns([oManifest]);
        this.oColumnList._innerModel = {
            setProperty: function(sProperty, sValue) {
                assert.equal(JSON.stringify(sValue), JSON.stringify(oExpectedCountValues[sProperty]), "Property is set");
            }        };
        this.oColumnList._onSegmentedSelectionChange(oManifest);
        assert.ok(stubTransCreation,"createTableOptions getting called");
        stubTransCreation.restore();
        stubSelectKey.restore();
    });
    QUnit.test("_generateTableColumnsTemplate: function is called to generate the Table Template and add cells to it", function(assert) {
        var chkFnCall = 0,
            handleColumnVisibilityStub = sinon.stub(this.oColumnList, "_handleColumnVisibilityToggle");
        handleColumnVisibilityStub.returns(chkFnCall++);
        this.oColumnList._generateTableColumnsTemplate();
        assert.ok(chkFnCall,1, "_handleColumnVisibilityToggle is binded");
    });
    QUnit.test("_setPreviewCardAriaText: Function to set the AriaText for Card Manifest", function(assert) {
        var oEvent = {
            getSource: function() {
                return {
                    _ariaText: {
                        getText: function() {
                            return "test aria";
                        },
                        setText: function() {
                            return "Title test aria";
                        }
                    }
                };
            }
        },
        sId = "testId",
        chkFnCall = 0;
        this.oColumnList.i18Bundle = {
            getText: function() {
                chkFnCall++;
                return "Title";
            }
        };
        this.oColumnList._setPreviewCardAriaText(sId, oEvent);
        assert.equal(chkFnCall,1,"Title is returned by i18n");
    });

    QUnit.test("_findIdentifierTitle", function (assert) {
        const aCardColumn = [
            {
                value: "test1",
                identifier: true
            },
            {
                value: "test2"
            },
            {
                value: "test3"
            }
        ];

        this.oColumnList._oListTitle = null;
        const aAttributes = this.oColumnList._findIdentifierTitle(aCardColumn);
        assert.equal(aAttributes.length, 2, "Attributes are filtered");
        assert.equal(this.oColumnList._oListTitle.value, "test1", "Identifier column is found");
    });
});
