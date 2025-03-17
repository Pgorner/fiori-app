
/*global QUnit, sinon */
sap.ui.define([
    "sap/insights/manageCardPreview/Preview",
    "sap/insights/utils/DeviceType"
], function(Preview, DeviceType) {
    "use strict";
    QUnit.module("Preview controller test cases", {
        beforeEach: function () {
            this.oSandbox = sinon.sandbox.create();
            this.oPreview = new Preview();
        },
        afterEach: function () {
            this.oSandbox.restore();
            this.oPreview.destroy();
        }
    });
    QUnit.test("setPreviewModeOfCard: Called for initialising the PreviewMode for Card, Desktop mode", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Desktop";};
        var oManifest = {
            "sap.card": {
                "type": "Table"
            }
        },
        previewCard = this.oPreview.oDefaultPreviewCardLS,
            chkfnCall = 0;
        var stubCardPreview = sinon.stub(previewCard, "setPreviewMode");
        stubCardPreview.returns(chkfnCall++);
        this.oPreview.oManifest = oManifest;
        var stubTransformations = sinon.stub(this.oPreview, "getTransformation");
        stubTransformations.returns(true);
        this.oPreview.setPreviewModeOfCard();
        assert.ok(stubTransformations,"getTransformation getting called");
        assert.equal(chkfnCall,1,"setPreviewMode getting called");
    });
    QUnit.test("setPreviewModeOfCard: Called for initialising the PreviewMode for Card, Not Desktop mode", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Mobile";};
        var oManifest = {
            "sap.card": {
                "type": "Table"
            }
        },
        previewCard = this.oPreview.oDefaultPreviewCardLS,
            chkfnCall = 0;
        var stubCardPreview = sinon.stub(previewCard, "setPreviewMode");
        stubCardPreview.returns(chkfnCall++);
        this.oPreview.oManifest = oManifest;
        var stubTransformations = sinon.stub(this.oPreview, "getTransformation");
        stubTransformations.returns(true);
        this.oPreview.setPreviewModeOfCard();
        assert.ok(stubTransformations,"getTransformation getting called");
        assert.equal(chkfnCall,1,"setPreviewMode getting called");
    });
    QUnit.test("_setCardMessageInfo: Called for setting the text, type and visibility for Card", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Desktop";};
        var oCardMessageInfo = {
            text: "test",
            type: "Warning"
        },
        oCardMessageStrip = this.oPreview.oCardMessageStrip,
        chkfnCall = 0,
        chkFnSetTypeCall = 0,
        chkFnSetTextCall = 0,
        oMessageStrip = this.oPreview.oMessageStrip;
        var stubSetVisible = sinon.stub(oCardMessageStrip, "setVisible");
        stubSetVisible.returns(chkfnCall++);
        var stubSetText = sinon.stub(oMessageStrip, "setText");
        stubSetText.returns(chkFnSetTextCall++);
        var stubSetType = sinon.stub(oMessageStrip, "setType");
        stubSetType.returns(chkFnSetTypeCall++);
        var stubCardMessageInfo = sinon.stub(this.oPreview, "getCardMessageInfo");
        stubCardMessageInfo.returns(oCardMessageInfo);
        this.oPreview._setCardMessageInfo();
        assert.equal(chkfnCall,1,"setVisible getting called");
        assert.equal(chkFnSetTypeCall,1,"setType getting called");
        assert.equal(chkFnSetTextCall,1,"setText getting called");
        stubSetVisible.restore();
        stubSetText.restore();
        stubSetType.restore();
    });
    QUnit.test("_callPreview: when we click preview card button", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Mobile";};
        this.oPreview._callPreview();
        var bCardPreviewBtnResult = this.oPreview.oCardPreviewBtn.getVisible(),
            chkFnCall = 0,
            bDefaultPreviewFlexBox = this.oPreview.oDefaultPreviewFlexBox.getVisible(),
            oPreviewSD = this.oPreview.oDefaultPreviewCardSD,
            oPreviewSDStub = sinon.stub(oPreviewSD, "refresh"),
            oStubMsgStrip = sinon.stub(this.oPreview, "_setCardMessageInfo");
        oStubMsgStrip.returns();
        oPreviewSDStub.returns(chkFnCall++);
        assert.equal(bCardPreviewBtnResult,false);
        assert.equal(bDefaultPreviewFlexBox,true);
        assert.ok(chkFnCall,1, "card is refreshed");
    });
    QUnit.test("_callClosePreview: when we click Hide preview card button", function(assert) {
        this.oPreview._callClosePreview();
        var bCardPreviewBtnResult = this.oPreview.oCardPreviewBtn.getVisible(),
            bPreviewCardFlexResult = this.oPreview.oDefaultPreviewFlexBox.getVisible(),
            oStubMsgStrip = sinon.stub(this.oPreview, "_setCardMessageInfo");
        oStubMsgStrip.returns();
        assert.equal(bCardPreviewBtnResult,true);
        assert.equal(bPreviewCardFlexResult,false);
        assert.ok(oStubMsgStrip,"_setCardMessageInfo is called");
    });
    QUnit.test("_handleTitleChange: title text is there", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Desktop";};
        var oEvent = {
            getSource: function() {
                return {
                    getValue: function() {
                        return {
                            trim: function() {
                                return "test";
                            }
                        };
                    },
                    setValueState: function() {},
                    setValueStateText: function() {}
                };
            }
        },
        oManifest = {
            'sap.card': {
                header: {
                    title: 'test'
                }
            }
        },
        chkFnCall = 0,
        oPreviewCardLS = this.oPreview.oDefaultPreviewCardLS,
        oStubGetHeader = sinon.stub(oPreviewCardLS, "getCardHeader"),
        oStubFireEvent = sinon.stub(this.oPreview, "fireTitleCheck"),
        oStubRefresh = sinon.stub(oPreviewCardLS, "refresh");
        oStubGetHeader.returns(true);
        oStubFireEvent.returns();
        oStubRefresh.returns(chkFnCall++);
        this.oPreview.oManifest = oManifest;
        this.oPreview._handleTitleChange(oEvent);
        assert.ok(oStubGetHeader.called, "getCardHeader is called");
        assert.ok(oStubFireEvent.called, "fireTitleCheck is called");
        assert.ok(chkFnCall,1, "card is refreshed");
        oStubFireEvent.restore();
        oStubGetHeader.restore();
    });
    QUnit.test("_handleTitleChange: title text is not there", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Desktop";};
        var oEvent = {
            getSource: function() {
                return {
                    getValue: function() {
                        return {
                            trim: function() {
                                return "test";
                            }
                        };
                    },
                    setValueState: function() {
                        return "Error";
                    },
                    setValueStateText: function() {
                        return "Please provide a title";
                    }
                };
            }
        },
        oManifest = {
            'sap.card': {
                header: {
                    title: 'test'
                }
            }
        },
        chkFnCall = 0,
        oPreviewCardLS = this.oPreview.oDefaultPreviewCardLS,
        oStubGetHeader = sinon.stub(oPreviewCardLS, "getCardHeader"),
        oStubFireEvent = sinon.stub(this.oPreview, "fireTitleCheck"),
        oStubRefresh = sinon.stub(oPreviewCardLS, "refresh");
        oStubGetHeader.returns(true);
        oStubFireEvent.returns();
        oStubRefresh.returns(chkFnCall++);
        this.oPreview.oManifest = oManifest;
        this.oPreview._handleTitleChange(oEvent);
        assert.ok(oStubGetHeader.called, "getCardHeader is called");
        assert.ok(oStubFireEvent.called, "fireTitleCheck is called");
        assert.ok(chkFnCall,1, "card is refreshed");
        oStubFireEvent.restore();
        oStubGetHeader.restore();
    });
    QUnit.test("_handleSubTitleChange", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Desktop";};
        var oEvent = {
            getSource: function() {
                return {
                    getValue: function() {
                        return {
                            trim: function() {
                                return "test";
                            }
                        };
                    },
                    setValueState: function() {},
                    setValueStateText: function() {}
                };
            }
        },
        oManifest = {
            'sap.card': {
                header: {
                    title: 'test',
                    subTitle: "SubTitle"
                }
            }
        },
        chkFnCall = 0,
        oPreviewCardLS = this.oPreview.oDefaultPreviewCardLS,
        oStubGetHeader = sinon.stub(oPreviewCardLS, "getCardHeader"),
        oStubRefresh = sinon.stub(oPreviewCardLS, "refresh");
        oStubGetHeader.returns(true);
        oStubRefresh.returns(chkFnCall++);
        this.oPreview.oManifest = oManifest;
        this.oPreview._handleSubTitleChange(oEvent);
        assert.ok(oStubGetHeader.called, "getCardHeader is called");
        assert.ok(chkFnCall,1, "card is refreshed");
        oStubGetHeader.restore();
        oStubRefresh.restore();
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
        },
        chkFnCall = 0,
        oPreviewCardLS = this.oPreview.oDefaultPreviewCardLS,
        oStubRefresh = sinon.stub(oPreviewCardLS, "refresh");
        oStubRefresh.returns(chkFnCall++);
        this.oPreview.oManifest = oManifest;
        this.oPreview._adjustLayoutStyles();
        var sDefaultFlexBoxWidth = this.oPreview.oDefaultFlexBox.getWidth(),
            bCardPreviewBtn = this.oPreview.oCardPreviewBtn.getVisible(),
            bPreviewFlexBox = this.oPreview.oPreviewFlexBox.getVisible(),
            oStubMsgStrip = sinon.stub(this.oPreview, "_setCardMessageInfo");
        oStubMsgStrip.returns();
        assert.equal(sDefaultFlexBoxWidth,"62%");
        assert.equal(bCardPreviewBtn,false);
        assert.equal(bPreviewFlexBox,true);
        assert.ok(chkFnCall,1, "card is refreshed");
        assert.ok(oStubMsgStrip, "_setCardMessageInfo is called");
        oStubRefresh.restore();
        oStubMsgStrip.restore();
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
          var oStubSetCardType = sinon.stub(this.oPreview, "_setCardTypeForColumn");
          oStubSetCardType.returns();
          this.oPreview.bShowCardPreview = true;
          this.oPreview.oConfCard = oManifest;
          this.oPreview._adjustLayoutStyles();
          var sPreviewFormFlex = this.oPreview.oDefaultPreviewFormFlex.getWidth(),
                sDefaultFlexBox = this.oPreview.oDefaultFlexBox.getWidth(),
                bPreviewFlexBox = this.oPreview.oDefaultPreviewFlexBox.getVisible(),
                oStubMsgStrip = sinon.stub(this.oPreview, "_setCardMessageInfo");
        oStubMsgStrip.returns();
        assert.equal(sPreviewFormFlex,"100%");
        assert.equal(sDefaultFlexBox,"100%");
        assert.equal(bPreviewFlexBox,true);
        assert.ok(oStubMsgStrip, "_setCardMessageInfo is called");
        oStubMsgStrip.restore();
    });
    QUnit.test("_setAriaTextOnManifest: Function to set the AriaText for Card Manifest", function(assert) {
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
        chkFnCall = 0;
        this.oPreview.i18Bundle = {
            getText: function() {
                chkFnCall++;
                return "Title";
            }
        };
        this.oPreview._setAriaTextOnManifest(oEvent);
        assert.equal(chkFnCall,1,"Title is returned by i18n");
    });
    QUnit.test("_formatTitle: title text is there", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Desktop";};
        var oTitleInput = this.oPreview.oTitleTextInput,
        oStubSetValueState = sinon.stub(oTitleInput, "setValueState"),
        oStubFireEvent = sinon.stub(this.oPreview, "fireTitleCheck"),
        oStubSetValueStateText = sinon.stub(oTitleInput, "setValueStateText");
        oStubSetValueState.returns();
        oStubSetValueStateText.returns();
        oStubFireEvent.returns();
        this.oPreview._formatTitle("Title");
        assert.ok(oStubSetValueState.called, "setValueState is called");
        assert.ok(oStubSetValueStateText.called, "setValueStateText is called");
        assert.ok(oStubFireEvent.called, "fireTitleCheck is called");
        oStubSetValueState.restore();
        oStubSetValueStateText.restore();
        oStubFireEvent.restore();
    });
    QUnit.test("_formatTitle: title text is not there", function(assert) {
        DeviceType.getDialogBasedDevice = function() {return "Desktop";};
        var oTitleInput = this.oPreview.oTitleTextInput,
        oStubSetValueState = sinon.stub(oTitleInput, "setValueState"),
        oStubFireEvent = sinon.stub(this.oPreview, "fireTitleCheck"),
        oStubSetValueStateText = sinon.stub(oTitleInput, "setValueStateText");
        oStubSetValueState.returns("Error");
        oStubSetValueStateText.returns("");
        oStubFireEvent.returns();
        this.oPreview._formatTitle("");
        assert.ok(oStubSetValueState.called, "setValueState is called");
        assert.ok(oStubSetValueStateText.called, "setValueStateText is called");
        assert.ok(oStubFireEvent.called, "fireTitleCheck is called");
        oStubSetValueState.restore();
        oStubSetValueStateText.restore();
        oStubFireEvent.restore();
    });
    QUnit.test("init", function(assert) {
        var stubGetId = sinon.stub(this.oPreview, "getId");
        stubGetId.returns("testId");
        var stubCreateStaticCtrl = sinon.stub(this.oPreview, "createStaticControls");
        stubCreateStaticCtrl.returns();
        var stubSetAggregation = sinon.stub(this.oPreview, "setAggregation");
        stubSetAggregation.returns();
        this.oPreview.init();
        assert.ok(stubCreateStaticCtrl,"createStaticControls getting called");
        assert.ok(stubSetAggregation,"setAggregation getting called");
        stubGetId.restore();
        stubCreateStaticCtrl.restore();
        stubSetAggregation.restore();
    });
    QUnit.test("onBeforeRendering", function(assert) {
        var sManifest = '{"sap.card":{"header":{"title":"test","subTitle":"SubTitle"},"type":"Table"}}',
        stubManifest = sinon.stub(this.oPreview, "getManifest"),
        stubFormatTitle = sinon.stub(this.oPreview, "_formatTitle"),
        stubAdjustLayoutStyles = sinon.stub(this.oPreview, "_adjustLayoutStyles");
        stubManifest.returns(sManifest);
        stubFormatTitle.returns();
        stubAdjustLayoutStyles.returns();
        this.oPreview.onBeforeRendering();
        var bInsightsPreviewOverflowLayerSD = this.oPreview.oInsightsPreviewOverflowLayerSD.getVisible();
        var oTitleInput = this.oPreview.oTitleTextInput,
            oSubTitleTextInput = this.oPreview.oSubTitleTextInput,
            stubTitleInput = sinon.stub(oTitleInput, "setValue"),
            stubSubTitleInput = sinon.stub(oSubTitleTextInput, "setValue"),
            stubGetTitle = sinon.stub(oTitleInput, "getValue");
        stubGetTitle.returns("Title");
        stubTitleInput.returns();
        stubSubTitleInput.returns();
        assert.equal(bInsightsPreviewOverflowLayerSD,true);
        assert.ok(stubFormatTitle,"_formatTitle getting called");
        assert.ok(stubAdjustLayoutStyles,"_adjustLayoutStyles getting called");
        assert.ok(stubTitleInput,"setValue getting called");
        assert.ok(stubSubTitleInput,"setValue getting called");
        stubManifest.restore();
        stubFormatTitle.restore();
        stubAdjustLayoutStyles.restore();
        stubGetTitle.restore();
        stubTitleInput.restore();
        stubSubTitleInput.restore();
    });
});
