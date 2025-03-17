/*global QUnit, sinon */
sap.ui.define([
    'sap/insights/manageCardPreview/HouseOfCards',
    "sap/insights/utils/CardPreviewManager",
    "sap/insights/utils/DeviceType"

], function(HouseOfCards, CardPreviewManager, DeviceType) {
	"use strict";
	QUnit.module("Selection test cases", {
		beforeEach: function () {
			this.oSandbox = sinon.sandbox.create();
            this.oHouseOfCards = new HouseOfCards();
		},
		afterEach: function () {
			this.oSandbox.restore();
            this.oHouseOfCards.destroy();
		}
	});


    QUnit.test("onBeforeRendering", function(assert) {
        var sManifest = '{"sap.card":{"header":{"title":"test","subTitle":"SubTitle"},"type":"Analytical"}}',
            oExpectedCountValues = {
                "/oSelected": {
                    "sap.card": {
                        "header": {
                            title: "test",
                            subTitle: "SubTitle"
                        },
                        "type": "Analytical"
                    }
                }
            },
            stubManifest = sinon.stub(this.oHouseOfCards, "getManifest"),
            stubAdjustLayoutStyles = sinon.stub(this.oHouseOfCards, "_adjustLayoutStyles");
        stubManifest.returns(sManifest);
        var stubBindAggregation = sinon.stub(this.oHouseOfCards._oHocChartCombo, "bindAggregation");
            stubBindAggregation.returns(true);
        var stubCardBindAggregation = sinon.stub(this.oHouseOfCards._oCardsTypeTable, "bindAggregation");
        stubCardBindAggregation.returns(true);

        var stubCardContainerBindAgg = sinon.stub(this.oHouseOfCards._oCardContainer, "bindAggregation");
        stubCardContainerBindAgg.returns(true);

        var stubCreateHOC = sinon.stub(this.oHouseOfCards, "_createHouseOfCards");
        stubCreateHOC.returns(true);

        this.oHouseOfCards._innerHocModel = {
            getProperty: function() {return true;},
            setProperty: function(sProperty, sValue) {
                assert.equal(JSON.stringify(sValue), JSON.stringify(oExpectedCountValues[sProperty]), "Property is set");
            }
        };
        stubAdjustLayoutStyles.returns();
        this.oHouseOfCards.onBeforeRendering();

        assert.ok(stubAdjustLayoutStyles,"_adjustLayoutStyles getting called");
        assert.ok(stubManifest,"getManifest getting called");
        assert.ok(stubBindAggregation,"bindAggregation getting called");
        stubManifest.restore();
        stubAdjustLayoutStyles.restore();
        stubBindAggregation.restore();
        stubCardBindAggregation.restore();
        stubCreateHOC.restore();
    });
    QUnit.test("_setBorderStyleSelectedCard", function(assert) {
        var stubGetItems = sinon.stub(this.oHouseOfCards._oCardContainer, "getItems"),
            chkFnCall = 0;
        stubGetItems.returns(
            [{
                hasStyleClass: function() {return false;},
                removeStyleClass: function() {},
                addStyleClass: function() {},
                getBindingContext: function() {
                    return {
                        getPath: function() {return "/testPath1";}
                    };
                },
                focus: function() {
                    chkFnCall++;
                }
            }]
        );
        this.oHouseOfCards._setBorderStyleSelectedCard("/testPath1");
        assert.ok(chkFnCall,1,"focus has been called once");
    });
    QUnit.test("_adjustLayoutStyles: when the screen is in desktop mode", function(assert) {
        this.oHouseOfCards._bDesktop = true;
        var oStubCreateHOC = sinon.stub(this.oHouseOfCards, "_createHouseOfCards");
        oStubCreateHOC.returns();
        this.oHouseOfCards._adjustLayoutStyles();
        var sCardTableType = this.oHouseOfCards._oCardsTypeTable.getWidth(),
            bPreviewPanelCardContainer = this.oHouseOfCards._oPreviewPanelCardContainer.getVisible(),
            bCardContainerFlex = this.oHouseOfCards._oCardContainerFlex.getVisible();
        assert.equal(sCardTableType,"90%");
        assert.equal(bPreviewPanelCardContainer,false);
        assert.equal(bCardContainerFlex,true);
        oStubCreateHOC.restore();
    });
    QUnit.test("_adjustLayoutStyles: when the screen is not in desktop mode", function(assert) {
        this.oHouseOfCards._bDesktop = false;
        var oStubCreateHOC = sinon.stub(this.oHouseOfCards, "_createHouseOfCards");
        oStubCreateHOC.returns();
          this.oHouseOfCards._adjustLayoutStyles();
          var sHocflexbox1 = this.oHouseOfCards._oHocflexbox1.getWidth(),
            bPreviewPanelCardContainer = this.oHouseOfCards._oPreviewPanelCardContainer.getVisible(),
            bPanelFlexCard = this.oHouseOfCards._oPanelFlexCard.getVisible();
        assert.equal(sHocflexbox1,"100%");
        assert.equal(bPreviewPanelCardContainer,false);
        assert.equal(bPanelFlexCard,false);
        oStubCreateHOC.restore();
    });

    QUnit.test("showHouseOfCardsDialog: oSelected property is empty", function(assert) {
        var oCard = {
            "sap.card": {
                "header": {
                    title: "test",
                    subTitle: "SubTitle"
                },
                "type": "Analytical"
            }
        },
        chkFnCall = 0,
        chkFnCall2 = 0,
        stubManifest = sinon.stub(this.oHouseOfCards, "getManifest"),
        sManifest = '{"sap.card":{"header":{"title":"test","subTitle":"SubTitle"},"type":"Analytical"}}',
        oExpectedCountValues = {
            "/oCard": oCard,
            "/oSelected": {
                "sap.card": {
                    content: {}
                }
            },
            "/selectedPath": ''
        };
        stubManifest.returns(sManifest);
        var stubChartTypeSearch = sinon.stub(this.oHouseOfCards, "_onChartTypeSearch");
        stubChartTypeSearch.returns(chkFnCall++);

        var stubCreateHouseOfCards = sinon.stub(this.oHouseOfCards, "_createHouseOfCards");
        stubCreateHouseOfCards.returns(chkFnCall2++);
        this.oHouseOfCards._innerHocModel = {
            setProperty: function(sProperty, sValue) {
                assert.equal(JSON.stringify(sValue), JSON.stringify(oExpectedCountValues[sProperty]), "Property is set");
            },
            getProperty:  function(sPropertyName) {
                if (sPropertyName === "/selectedPath") {
                    return "/testPath1";
                } else if (sPropertyName === "/oSelected") {
                    return {};
                }
            }
        };
        this.oHouseOfCards.showHouseOfCardsDialog(oCard);
        assert.ok(chkFnCall2,1, "_createHouseOfCards is called");
        assert.ok(chkFnCall,1, "_onChartTypeSearch is called");
        stubChartTypeSearch.restore();
        stubCreateHouseOfCards.restore();
    });

    QUnit.test("showHouseOfCardsDialog: oSelected property is not empty", function(assert) {
        var oCard = {
            "sap.card": {
                "header": {
                    title: "test",
                    subTitle: "SubTitle"
                },
                "type": "Analytical"
            }
        },
        chkFnCall = 0,
        stubManifest = sinon.stub(this.oHouseOfCards, "getManifest"),
        sManifest = '{"sap.card":{"header":{"title":"test","subTitle":"SubTitle"},"type":"Analytical"}}',
        oExpectedCountValues = {
            "/oCard": oCard,
            "/oSelected": {
                "sap.card": {
                    content: {}
                }
            },
            "/selectedPath": ''
        };
        stubManifest.returns(sManifest);

        var stubBorderStyleCard = sinon.stub(this.oHouseOfCards, "_setBorderStyleSelectedCard");
        stubBorderStyleCard.returns(chkFnCall++);

        this.oHouseOfCards._innerHocModel = {
            setProperty: function(sProperty, sValue) {
                assert.equal(JSON.stringify(sValue), JSON.stringify(oExpectedCountValues[sProperty]), "Property is set");
            },
            getProperty:  function(sPropertyName) {
                if (sPropertyName === "/selectedPath") {
                    return "/testPath1";
                } else if (sPropertyName === "/oSelected") {
                    return {
                        "sap.card": {
                            content: {}
                        }
                    };
                }
            }
        };
        this.oHouseOfCards.showHouseOfCardsDialog(oCard);
        assert.ok(chkFnCall,1, "_setBorderStyleSelectedCard is called");
        stubBorderStyleCard.restore();
    });
    QUnit.test("_onChartTypePress", function(assert) {
        var oEvent = {
            getParameter: function() {
                return {
                    getBindingContext: function() {
                        return {
                            getPath: function() {return "#testPath";}
                        };
                    }
                };
            }
        },
        oCard = {
            "sap.card": {
                content: {}
            }
        },
        oExpectedCountValues = {
            "/oSelected": oCard,
            "/oConfCard": oCard,
            "/selectedPath": "#testPath"
        },
        chkFnCall = 0;
        this.oHouseOfCards._innerHocModel = {
            getProperty: function() {return oCard;},
            setProperty: function(sProperty, sValue) {
                assert.equal(sValue, oExpectedCountValues[sProperty], "Property is set");
            }
        };

        var stubSelectedKey = sinon.stub(this.oHouseOfCards._oHocChartCombo, "setSelectedKey");
        stubSelectedKey.returns(chkFnCall++);

        var stubGetItems = sinon.stub(this.oHouseOfCards._oCardContainer, "getItems");
        stubGetItems.returns(
            [{
                hasStyleClass: function() {return false;},
                removeStyleClass: function() {
                },
                getBindingContext: function() {
                    return {
                        getPath: function() {return "/testPath1";}
                    };
                }
            }]
        );

        this.oHouseOfCards._onChartTypePress(oEvent);
        assert.equal(chkFnCall,1,"setSelectedKey getting called");
    });
    QUnit.test("_onClickFunction: Handler for click on the card", function(assert) {
        var chkFnCall2 = 0,
        chkFnCall3 = 0,
        chkFnCall4 = 0,
        oCardwAction = {
            "sap.card": {
                content: {}
            }
        },
        oExpectedCountValues = {
            "/oSelected": oCardwAction,
            "/oConfCard": oCardwAction,
            "/selectedPath": "/testPath"
        },
        oCard = {
            addStyleClass: function() {
                chkFnCall3++;
            },
            focus: function() {
                chkFnCall2++;
            },
            getBindingContext: function() {
                return {
                    getPath: function() {return "/testPath";}
                };
            },
            getManifest: function() {return oCardwAction;}
        };
        var stubGetItems = sinon.stub(this.oHouseOfCards._oCardContainer, "getItems");
        stubGetItems.returns(
            [{
                hasStyleClass: function() {return false;},
                removeStyleClass: function() {
                    chkFnCall4++;
                },
                getBindingContext: function() {
                    return {
                        getPath: function() {return "/testPath1";}
                    };
                }
            }]
        );
        var stubRefresh = sinon.stub(this.oHouseOfCards._oPreviewCardHoC, "refresh");
        stubRefresh.returns();

        var stubSelectedKey = sinon.stub(this.oHouseOfCards._oHocChartCombo, "setSelectedKey");
        stubSelectedKey.returns();

        var stubScrollTo = sinon.stub(this.oHouseOfCards._oHoCScrollContainer, "scrollToElement");
        stubScrollTo.returns();
        this.oHouseOfCards._innerHocModel = {
            getProperty:  function(sPropertyName) {
                if (sPropertyName === "/selectedPath") {
                    return "/testPath1";
                } else if (sPropertyName.includes("/aCards/")) {
                    return oCardwAction;
                }
            },
            setProperty: function(sProperty, sValue) {
                assert.equal(sValue, oExpectedCountValues[sProperty], "Property is set");
            }
        };
        this.oHouseOfCards._onClickFunction(oCard, "/testPath");
        var done = assert.async();
        setTimeout(function() {
            assert.ok(stubSelectedKey,"setSelectedKey fn getting called");
            assert.equal(chkFnCall2,1,"focus getting called");
            assert.equal(chkFnCall3,1,"addStyleClass getting called");
            assert.equal(chkFnCall4,1,"removeStyleClass getting called");
            stubSelectedKey.restore();
            stubRefresh.restore();
            done();
        });
    });
    QUnit.test("_onCardRender", function(assert) {
        var chkFnCall1 = 0,
        chkFnCall2 = 0,
        chkFnCall3 = 0,
        chkFnCall4 = 0,
        oEvent1 = {
            getSource: function() {
                return {
                    sId: "#test",
                    getCardHeader: function() {
                        return {
                            addStyleClass: function() {
                                chkFnCall2++;
                            }
                        };
                    },
                    attachEvent: function() {}
                };
            }
        },
        oEvent = {
            getSource: function() {
                return {
                    attachManifestApplied: function(callback) {callback(oEvent1);},
                    id: "#test",
                    removeStyleClass: function() {},
                    getDomRef: function() {
                        return {
                            addEventListener: function() {
                                chkFnCall3++;
                            },
                            removeEventListener: function() {
                                chkFnCall4++;
                            }
                        };
                    },
                    getCardHeader: function() {
                        return {
                            addStyleClass: function() {
                                return true;
                            }
                        };
                    },
                    attachEvent: function() {
                        return true;
                    }
                };
            }
        };
        this.oHouseOfCards._innerHocModel = {
            getProperty: function() {return "/testPath";}
        };
        var stubGetItems = sinon.stub(this.oHouseOfCards._oCardContainer, "getItems");
        stubGetItems.returns([{
            sId: "#test",
            focus: function() {
                chkFnCall1++;
            },
            getBindingContext: function() {
                return {
                    getPath: function() {return "/testPath";}
                };
            },
            addStyleClass: function() {}
        }]);
        var stubScrollTo = sinon.stub(this.oHouseOfCards._oHoCScrollContainer, "scrollToElement");
        stubScrollTo.returns();
        this.oHouseOfCards._onCardRender(oEvent);
        var done = assert.async();
        setTimeout(function() {
            assert.equal(chkFnCall1,1,"focus getting called");
            assert.equal(chkFnCall2,1,"addStyleClass getting called");
            assert.equal(chkFnCall3,1,"addEventListener getting called twice");
            assert.equal(chkFnCall4,1,"removeEventListener getting called");
            stubScrollTo.restore();
            done();
        });
    });
    QUnit.test("_setFocusOnElement: desktop screen", function(assert) {
        this.oHouseOfCards._bDesktop = true;
        var chkFnCall = 0;
        var stubFocus = sinon.stub(this.oHouseOfCards._oHocChartCombo, "focus");
        stubFocus.returns(chkFnCall++);

        this.oHouseOfCards._setFocusOnElement();
        assert.equal(chkFnCall,1,"focus getting called");
        stubFocus.restore();
    });
    QUnit.test("_setFocusOnElement: mobile screen", function(assert) {
        this.oHouseOfCards._bDesktop = true;
        var chkFnCall = 0;
        var stubFocus = sinon.stub(this.oHouseOfCards._oChartTypeSearch, "focus");
        stubFocus.returns(chkFnCall++);

        this.oHouseOfCards._setFocusOnElement();
        assert.equal(chkFnCall,1,"focus getting called");
        stubFocus.restore();
    });
    QUnit.test("_callClosePreview", function(assert) {
        var chkFnCall = 0;
        var stubAdjustLayout = sinon.stub(this.oHouseOfCards, "_adjustLayoutStyles");
        stubAdjustLayout.returns(chkFnCall++);
        this.oHouseOfCards._callClosePreview();
        assert.equal(chkFnCall,1,"_adjustLayoutStyles getting called");
    });
    QUnit.test("_callPreview", function(assert) {
        var chkFnCall = 0;
        this.oHouseOfCards._bDesktop = true;
        var stubAdjustLayout = sinon.stub(this.oHouseOfCards, "_adjustLayoutStyles");
        stubAdjustLayout.returns(chkFnCall++);
        this.oHouseOfCards._callPreview();
        assert.equal(chkFnCall,1,"_adjustLayoutStyles getting called");
    });
    QUnit.test("_onCardStateChanged", function(assert) {
        var oEvent = {
            getSource: function() {
                return {
                    _errorType: "testError"
                };
            }
        },
        oExpectedCountValues = {
            "/aPreviewCards": [
                {
                    "sap.card": {
                        "content": {
                            "chartType" : "column"
                        }
                    }
                }
            ]
        },
        chkFnCall = 0,
        oCard = {
            getAggregation: function() {
                return {
                    getAggregation: function() {
                        return {
                            attachRenderComplete: function(callback) {callback(oEvent);}
                        };
                    }
                };
            },
            getManifest: function() {
                return {
                    "sap.card": {
                        "content": {
                            "chartType" : "bar"
                        }
                    }
                };
            },
            sId: "#testId"
        };
        this.oHouseOfCards._innerHocModel = {
            getProperty:  function(sPropertyName) {
                if (sPropertyName === "sOriginalChartType") {
                    return "column";
                } else {
                    return [
                        {
                            "sap.card": {
                                "content": {
                                    "chartType" : "column"
                                }
                            }
                        }
                    ];
                }
            },
            setProperty: function(sProperty, sValue) {
                assert.equal(JSON.stringify(sValue), JSON.stringify(oExpectedCountValues[sProperty]), "Property is set");
            }
        };
        var stubRemoveItem = sinon.stub(this.oHouseOfCards._oCardContainer, "removeItem");
        stubRemoveItem.returns({
            destroy: function() {
                return chkFnCall++;
            }
        });

        CardPreviewManager.hasVizData = function() {return false;};
        var oSpy2 = sinon.spy(CardPreviewManager, "hasVizData");

        this.oHouseOfCards._onCardStateChanged(oCard);
        assert.ok(chkFnCall,1,"destroy is called once");
        assert.ok(oSpy2.calledOnce,"hasVizData has been called once");
        stubRemoveItem.restore();
    });
    QUnit.test("_onCardLoadFailure - Original Card Loading Error", function(assert) {
        var orgCard = {
            "sap.card": {
                content: {
                    chartType: "Line"
                }
            }
        },
        oCard = {
            getManifest: () => orgCard
        },
        chkFnCall = 0;
        var stubRemoveItem = sinon.stub(this.oHouseOfCards._oCardContainer, "removeItem");
        stubRemoveItem.returns({
            destroy: function() {
                return chkFnCall++;
            }
        });
        this.oHouseOfCards._oManifest = orgCard;
        this.oHouseOfCards._onCardLoadFailure(oCard);
        assert.equal(chkFnCall,0,"destroy has not been called");
        stubRemoveItem.restore();
    });
    QUnit.test("_onCardLoadFailure - Transformed Card Loading Error", function(assert) {
        var orgCard = {
            "sap.card": {
                content: {
                    chartType: "Line"
                }
            }
        },
        oCard = {
            getManifest: () => {
                return {
                    "sap.card": {
                        content: {
                            chartType: "Column"
                        }
                    }
                };
            }
        },
        chkFnCall = 0;
        var stubRemoveItem = sinon.stub(this.oHouseOfCards._oCardContainer, "removeItem");
        stubRemoveItem.returns({
            destroy: function() {
                return chkFnCall++;
            }
        });
        this.oHouseOfCards._oManifest = orgCard;
        this.oHouseOfCards._onCardLoadFailure(oCard);
        assert.ok(chkFnCall,1,"destroy has been called once");
        stubRemoveItem.restore();
    });
    QUnit.test("_onSelectionChange", function(assert) {
        var oEvent = {
            getParameters: function() {
                return {
                    selectedItem: {
                        getBindingContext: function() {
                            return {
                                getPath: function() {return "/testPath";}
                            };
                        }
                    }
                };
            }
        };
        var stubOnClickFunction = sinon.stub(this.oHouseOfCards, "_onClickFunction");
        stubOnClickFunction.returns();
        this.oHouseOfCards._onSelectionChange(oEvent);
        assert.ok(stubOnClickFunction.calledOnce,"onClickFunction has been called once");
    });
    QUnit.test("_setChartDetail: key is icon", function(assert) {
        var sResult = this.oHouseOfCards._setChartDetail("bar", "icon");
        assert.equal(sResult,"sap-icon://horizontal-bar-chart","returns true");
    });
    QUnit.test("_setChartDetail: key is title", function(assert) {
        var sResult = this.oHouseOfCards._setChartDetail("column", "title");
        assert.equal(sResult,"Column Chart","returns true");
    });
    QUnit.test("_onChartTypeSearch", function(assert) {
        var oEvent = {
                getSource: function() {
                    return {
                        getValue: function() {
                            return "titleText ";
                        }
                    };
                }
            },
            chkFnCall = 0;
        var stubCardBinding = sinon.stub(this.oHouseOfCards._oCardsTypeTable, "getBinding");
        stubCardBinding.returns(chkFnCall++);

        this.oHouseOfCards._onChartTypeSearch(oEvent);

        assert.ok(chkFnCall,"getBinding getting called");
        stubCardBinding.restore();
    });
	QUnit.test("init", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Desktop";};
        var stubCreateHoc = sinon.stub(this.oHouseOfCards, "_createHocFlex");
        stubCreateHoc.returns(true);
        var stubGetId = sinon.stub(this.oHouseOfCards, "getId");
        stubGetId.returns("testId");

        var stubSetModel = sinon.stub(this.oHouseOfCards.oParentPage, "setModel");
        stubSetModel.returns();
        var stubSetAggregation = sinon.stub(this.oHouseOfCards, "setAggregation");
        stubSetAggregation.returns();

        this.oHouseOfCards.init();
        assert.ok(stubSetModel,"setModel getting called");
        assert.ok(stubSetAggregation,"setAggregation getting called");
        stubGetId.restore();
        stubSetModel.restore();
        stubCreateHoc.restore();
        stubSetAggregation.restore();
    });


});
