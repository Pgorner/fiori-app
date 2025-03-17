/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/ui/model/resource/ResourceModel",
    "./utils/InsightsUtils",
    "./base/InMemoryCachingHost",
    "sap/ui/integration/widgets/Card",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/m/ScrollContainer",
    "./utils/AppConstants",
    "./utils/CardSkeletonManifest",
    "sap/m/MessageToast",
    "sap/base/Log",
    "sap/m/IllustratedMessage",
    "sap/ui/performance/trace/FESRHelper",
    "sap/m/Title",
    "sap/m/Label",
    "sap/m/FlexBox",
    "sap/m/Panel",
    "sap/m/Toolbar",
    "sap/m/TextArea",
    "sap/m/Text",
    "sap/m/MessageStrip",
    "sap/ui/core/Icon",
    "sap/m/MessageBox"
], function (
    Control,
    Button,
    Dialog,
    ResourceModel,
    InsightsUtils,
    InMemoryCachingHost,
    Card,
    VBox,
    HBox,
    ScrollContainer,
    AppConstants,
    CardSkeletonManifest,
    MessageToast,
    Log,
    IllustratedMessage,
    FESRHelper,
    Title,
    Label,
    FlexBox,
    Panel,
    Toolbar,
    TextArea,
    Text,
    MessageStrip,
    Icon,
    MessageBox
) {
    "use strict";

    var oCardManifest = JSON.parse(JSON.stringify(CardSkeletonManifest));

    /**
     * Constructor for  ManageAddCardWithSearch control.
     *
     * @class
     * This control is wrapper for and opens a dialog for search cards to insight
     * @extends sap.ui.core.Control
     * @private
     *
     * @since since 1.130.0
     *
     * @alias sap.insights.ManageAddCardWithSearch
     */

    var ManageAddCardWithSearch = Control.extend("sap.insights.ManageAddCardWithSearch", {
        metadata: {
            events: {
                /**
                 * onAddButtonPress event triggerd when the confirm button is pressed
                 * if not passed the default add card to my home happens
                 */
                onAddButtonPress: {
                    parameters: {
                        /**
                         * Manifest to be passed as a string
                         */
                        manifest: { type: "string" }
                    }
                }
            },
            aggregations: {
                /**
                 * Hidden aggregation of dialog control which opens when openDialog() is called for this control
                 */
                _queryDialog: {
                    type: "sap.m.Dialog",
                    multiple: false,
                    visibility: "hidden"
                }
            }
        }
    });

    /**
     * Initializes the control.
     * @returns {void}
     */
    ManageAddCardWithSearch.prototype.init = function () {
        this.i18Bundle = new ResourceModel({ bundle: InsightsUtils.getResourceBundle() }).getResourceBundle();
        this._createStaticControls();
        this._getQueryDialog();
    };

    /**
     * Creates the dialog control and set it as _queryDialog aggregation.
     * @returns {sap.m.Dialog} The _queryDialog control
     * @private
     * @experimental since 1.130.0
     *
     */
    ManageAddCardWithSearch.prototype._getQueryDialog = function () {
        if (!this.getAggregation("_queryDialog")) {
            var _oManageDialog = new Dialog({
                title: this.i18Bundle.getText("addToInsights"),
                content: [this._getOuterVbox()],
                showHeader: true,
                contentHeight: "41.1rem",
                contentWidth: "59.3rem",
                verticalScrolling: false,
                horizontalScrolling: false,
                afterClose: this.resetDialog.bind(this, true),
                escapeHandler: this.closeDialog.bind(this),
                afterOpen: this.afterOpenDialog.bind(this),
                beginButton: this._getAddButton(),
                endButton: this._getCancelButton()
            });
            this.setAggregation("_queryDialog", _oManageDialog, true);
        }
        return this.getAggregation("_queryDialog");
    };

    /**
     * Creates static controls while initializing the control
     * @returns {void}
     * @private
     * @experimental since 1.130.0
     */
     ManageAddCardWithSearch.prototype._createStaticControls = function () {
        var oInnerControl = {};

        oInnerControl.host = new InMemoryCachingHost(this.getId() + "--transactionalCardHost", {
            action: function (oEvent) {
                var oCard = oEvent.getParameter("card") || {};
                this.oManifest = oCard.getManifest();
            }.bind(this)
        });
        oInnerControl.searchedCard = new Card(this.getId() + "--searchedCard",{
            manifest: oCardManifest,
            manifestApplied: this._setAriaTextOnManifest.bind(this),
            width: "19rem",
            height: "33.5rem",
            host: oInnerControl.host,
            previewMode: "Abstract",
            visible: true
        });

        oInnerControl.oAddButton = new Button(this.getId() + "--addButton", {
            text: this.i18Bundle.getText("INT_DIALOG_Ok"),
            press: this.addCard.bind(this),
            type: "Emphasized",
            enabled: false,
            width: "2.75rem"
        });
        FESRHelper.setSemanticStepname(oInnerControl.oAddButton, "press", AppConstants.FESR_AIGENERATE_ADD_CARD);
        oInnerControl.oCancelButton = new Button(this.getId() + "--cancelButton", {
            text: this.i18Bundle.getText("cancelButton"),
            press: this.closeDialog.bind(this)
        });
        oInnerControl.messageStripHbox = this._createMessageStripHBox();

        oInnerControl.oNoCardMessage = new IllustratedMessage(this.getId() + "--editInsightNoInsightsCardsMsg", {
            illustrationSize: "Dialog",
            illustrationType: "sapIllus-SimpleEmptyList",
            description: " "
        }).addStyleClass("sapFIllustratedMessageAlign sapFFrequentIllustratedMessageAlign");
        oInnerControl.noCardBox = new VBox(this.getId() + "--illusCardVbox", {
            alignItems: "Center",
            height: "100%",
            renderType: "Bare",
            justifyContent: "Center",
            items: [
                oInnerControl.oNoCardMessage
            ],
            visible: false
        }).addStyleClass("aiErrorPadding");

        var oTypedText = new Text(this.getId() + "--label",{
            text: this.i18Bundle.getText('typed_text_label'),
            wrapping: true
        }).addStyleClass("sapUiSmallMarginBeginEnd sapUiSmallMarginTop");
        oInnerControl.oTextBox = new TextArea(this.getId() + "--textBox",{
            "width": "calc(100% - 2rem)",
            "height": "7rem",
            "placeholder": this.i18Bundle.getText('SAMPLE_QUERY_MSG') + " " + this.i18Bundle.getText('SAMPLE_QUERY_TEXT'),
            "liveChange": this.onChange.bind(this)
          }).addStyleClass("sapUiSmallMarginBeginEnd sapUiSmallMarginTop sapUiTinyMarginBottom");
        //on enter of TextBox trigger search
        oInnerControl.oTextBox.attachBrowserEvent("keydown", function(oEvent) {
            if (oEvent.keyCode === 13) {
                this._onSearch();
            }
        }.bind(this));

        oInnerControl.oRegenerateButton = new Button(this.getId() + "--searchButton", {
            type: "Default",
            icon: "sap-icon://ai",
            text: this.i18Bundle.getText('GO'),
            press: this._onSearch.bind(this),
            enabled: false
        }).addStyleClass("sapUiSmallMarginBegin");
        FESRHelper.setSemanticStepname( oInnerControl.oRegenerateButton, "press", AppConstants.FESR_AIGENERATE_CARD);

        oInnerControl.oClearButton = new Button(this.getId() + "--clearButton", {
            type: "Transparent",
            text: this.i18Bundle.getText('Clear'),
            enabled: false,
            press: this._onClear.bind(this)
        }).addStyleClass("sapUiTinyMarginBegin sapUiSmallMarginEnd");
        var oButtonHBox = new HBox(this.getId() + "--buttonHBox",{
            width: "100%",
            alignItems: "End",
            renderType: "Bare",
            justifyContent: "End",
            items:[oInnerControl.oRegenerateButton,  oInnerControl.oClearButton]
        });

        var oHelpIcon = new Icon(this.getId() + "--helpIcon", {
            src: "sap-icon://sys-help",
            size: "0.875rem",
            height: "0.875rem",
            color: "Neutral"
        });
        var oSampleQueryLabel = new Label(this.getId() + "--sampleQueryLabel",{
            text: this.i18Bundle.getText('SAMPLE_QUERY')
        }).addStyleClass("sapUiTinyMarginBegin");

        var oQueryHbox = new HBox(this.getId() + "--queryHbox",{
            width: "calc(100% - 1rem)",
            justifyContent: "Start",
            backgroundDesign: "Transparent",
            renderType: "Bare",
            alignItems: "Center",
            items: [
                oHelpIcon, oSampleQueryLabel
            ]
        }).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTop");

        var oDefaultQueryVBox = new FlexBox(this.getId() + "--defaultPreviewFormFlex",{
            height: "100%",
            width: "50%",
            direction: "Column",
            renderType: "Bare",
            items: [
                oTypedText, oInnerControl.oTextBox, oButtonHBox, oQueryHbox, this._createSampleQueryListBox()
            ]
        });
        var oDefaultPreviewCardText = new Title(this.getId() + "--defaultPreviewCardText",{
            text: this.i18Bundle.getText("INT_DIALOG_TITLE_CardPreview"),
            textAlign: "Left"
        }).addStyleClass("sapUiSmallMarginTop sapUiTinyMarginBottom");
        var oDefaultPreviewHBox = new HBox(this.getId() + "--defaultPreviewHBox",{
            width: "100%",
            height: "100%",
            justifyContent: "Start",
            backgroundDesign: "Transparent",
            renderType: "Bare",
            items: [
                oDefaultPreviewCardText
            ]
        }).addStyleClass("sapUiTinyMarginBegin");
        var oDefaultPreviewToolBar = new Toolbar(this.getId() + "--defaultPreviewToolBar",{
            width: "100%",
            height: "2.5rem",
            style: "Clear",
            design: "Auto",
            content: [
                oDefaultPreviewHBox
            ]
        }).addStyleClass("sapThemeBaseBG");
        var oInsightsCardOverflowInnerHBox = new HBox(this.getId() + "--insightsCardOverflowInnerHBox",{
        }).addStyleClass("insightsCardOverflowLayer insightsPreviewCardOverLay insightsPreviewOVPOverLayPositionLS");

        oInnerControl.oInsightsCardOverflowLayer = new HBox(this.getId() + "--insightsCardOverflowLayer",{
            height: "0",
            visible: false,
            items: [
                oInsightsCardOverflowInnerHBox
            ]
        }).addStyleClass("sapMFlexBoxJustifyCenter");
        var oDefaultPreviewVBox = new VBox(this.getId() + "--defaultPreviewVBox",{
            height: "100%",
            alignItems: "Center",
            backgroundDesign: "Transparent",
            justifyContent: "SpaceAround",
            items: [
                oInnerControl.searchedCard ,
                oInnerControl.oInsightsCardOverflowLayer,
                oInnerControl.messageStripHbox
            ]
        });
        var oDefaultPreviewPanel = new Panel(this.getId() + "--defaultPreviewPanel",{
            expanded: false,
            height: "100%",
            backgroundDesign: "Transparent",
            content: [
                oDefaultPreviewVBox
            ]
        });
        oInnerControl.oDefaultPreviewPanelFlex = new FlexBox(this.getId() + "--defaultPreviewPanelFlex",{
            height: "100%",
            backgroundDesign: "Transparent",
            renderType: "Bare",
            justifyContent: "Center",
            items: [
                oDefaultPreviewPanel
            ]
        });
        var oBusyMessageStrip = new MessageStrip(this.getId() + "--busyMessageStrip",{
            text: this.i18Bundle.getText("CARD_GENERATE_MSG"),
            showIcon: true,
            showCloseButton: false
        });
        oInnerControl.busyMessageBox = new HBox(this.getId() + "--busyMessageBox",{
            alignItems: "Center",
            renderType: "Bare",
            width: "calc(100% - 2rem)",
            height: "3rem",
            visible: false,
            justifyContent: "Start",
            backgroundDesign: "Transparent",
            items: [
                oBusyMessageStrip
            ]
        }).addStyleClass("sapUiSmallMarginBeginEnd sapUiTinyMarginBottom");
        var oDefaultPreviewScroll = new ScrollContainer(this.getId() + "--defaultPreviewScroll",{
            vertical: true,
            horizontal: false,
            height: "100%",
            content: [
                oDefaultPreviewToolBar,
                oInnerControl.busyMessageBox,
                oInnerControl.oDefaultPreviewPanelFlex,
                oInnerControl.noCardBox
            ]
        });
        var oPreviewFlexBox = new FlexBox(this.getId() + "--defaultPreviewFlex",{
            height: "100%",
            width: "50%",
            direction: "Column",
            renderType: "Bare",
            items: [
                oDefaultPreviewScroll
            ]
        }).addStyleClass("sapMPageBgStandard");
        oInnerControl.oDefaultVBox = new VBox(this.getId() + "--defaultVBox",{
            height: "100%",
            width: "100%",
            direction: "Row",
            justifyContent: "SpaceBetween",
            items: [
                oDefaultQueryVBox,
                oPreviewFlexBox
            ]
        });
        this._setAccessMethods(oInnerControl);
    };

    /**
     * Creates and returns an HBox containing AI text and verification text.
     * @private
     * @returns {sap.m.HBox} The HBox containing the AI text and verification text.
     */
    ManageAddCardWithSearch.prototype._createMessageStripHBox = function() {
        var oAIText = new Text(this.getId() + "--messageAIText", {
            text: this.i18Bundle.getText('addCardsAIInfo'),
            width: "6.3rem"
        }).addStyleClass("sapThemeHighlight-asColor");

        var oAIVerificationText = new Label(this.getId() + "--messageAIVerificationText", {
            text: this.i18Bundle.getText('addVerifyInfo')
        });

        var oMessageStripHBox = new HBox(this.getId() + "--messageHBox", {
            alignItems: "Center",
            renderType: "Bare",
            width: "19rem",
            height: "1rem",
            visible: false,
            justifyContent: "Start",
            backgroundDesign: "Transparent",
            items: [
                oAIText, oAIVerificationText
            ]
        }).addStyleClass('sapUiTinyMarginTop');

        return oMessageStripHBox;
    };

    /**
     * Creates and returns a VBox containing query labels.
     * @private
     * @returns {sap.m.VBox} The VBox containing the query labels.
     */
    ManageAddCardWithSearch.prototype._createSampleQueryListBox = function() {

        var oQueryLabelMsg1 = new Label(this.getId() + "--queryListItem1",{
            showColon: false,
            text: this.i18Bundle.getText('QUERY_LIST_ITEM1'),
            wrapping: true
        }).addStyleClass("aiDialogText sapUiTinyMarginEnd sapUiTinyMarginTop");

        var oQueryLabelMsg2 = new Label(this.getId() + "--queryListItem2",{
            showColon: false,
            text: this.i18Bundle.getText('QUERY_LIST_ITEM2'),
            wrapping: true
        }).addStyleClass("aiDialogText sapUiTinyMarginEnd");

        var oQueryLabelMsg3 = new Label(this.getId() + "--queryListItem3",{
            showColon: false,
            text: this.i18Bundle.getText('QUERY_LIST_ITEM3'),
            wrapping: true
        }).addStyleClass("aiDialogText sapUiTinyMarginEnd");

        var oSampleQueryListBox = new VBox(this.getId() + "--sampleQueryListBox", {
            alignItems: "Start",
            justifyContent: "Start",
            backgroundDesign: "Transparent",
            renderType: "Bare",
            items: [
                oQueryLabelMsg1,
                oQueryLabelMsg2,
                oQueryLabelMsg3
            ]
        }).addStyleClass("sapUiSmallMarginBegin");

        return oSampleQueryListBox;
    };

    /**
     * Sets various access methods for managing and interacting with the internal controls.
     * These methods are designed to encapsulate the private controls and prevent direct
     * access to them from outside the class.
     *
     * @param {Object} oInnerControls - The object containing inner private controls.
     * @private
     * @experimental since 1.130.0
     */
    ManageAddCardWithSearch.prototype._setAccessMethods = function(oInnerControls) {

        /**
         * Method to access the searchedCard control.
         */
        this._getSearchedCard = function() {
            return oInnerControls && oInnerControls.searchedCard;
        };

        /**
         * Method to access the add button.
         */
        this._getAddButton = function() {
            return oInnerControls && oInnerControls.oAddButton;
        };

        /**
         * Method to access the cancel button.
         */
        this._getCancelButton = function() {
            return oInnerControls && oInnerControls.oCancelButton;
        };

        /**
         * Method to interact with the add button.
         * Enables or disables the add button and sets focus if enabled.
         */
        this._enableFocusAddButton = function(enable) {
            if (oInnerControls && oInnerControls.oAddButton) {
                oInnerControls.oAddButton.setEnabled(enable);
                //if enable set focus on add button
                if (enable) {
                    setTimeout(function(){
                        oInnerControls.oAddButton.focus();
                    },0);
                }
            }
        };

        /**
         * Method to access the text box
         */
        this._getTextBox = function() {
            return oInnerControls && oInnerControls.oTextBox;
        };

        /**
         * Method to set the visibility of the message strip and overflow layer
         */
        this._setMessageStripOverflowVisibility = function(bVisible) {
            if (oInnerControls && oInnerControls.messageStripHbox && oInnerControls.oInsightsCardOverflowLayer) {
                oInnerControls.messageStripHbox.setVisible(bVisible);
                oInnerControls.oInsightsCardOverflowLayer.setVisible(bVisible);
            }
        };

        /**
         * Method to access the no card message.
         */
        this._getNoCardMessage = function() {
            return oInnerControls && oInnerControls.oNoCardMessage;
        };

        /**
         * Method to access the default preview panel flex.
         */
        this._getDefaultPreviewPanelFlex = function() {
            return oInnerControls && oInnerControls.oDefaultPreviewPanelFlex;
        };

        /**
         * Method to toggle the visibility of the card box.
         */
        this._toggleCardBox = function(bVisible) {
            oInnerControls.oDefaultPreviewPanelFlex.setVisible(bVisible);
            oInnerControls.noCardBox.setVisible(!bVisible);
        };

        /**
         * Toggles the enabled state of the text box, busy message box, and regenerate button.
         */
        this._toggleButtonAndText = function(bEnable) {
            oInnerControls.oTextBox.setEnabled(bEnable);
            oInnerControls.busyMessageBox.setVisible(!bEnable);
            oInnerControls.oRegenerateButton.setEnabled(bEnable);
            this._enableClearButton(bEnable);
        };

        /**
         * Enables or disables the clear button.
         */
        this._enableClearButton = function(bEnable) {
            oInnerControls.oClearButton.setEnabled(bEnable);
        };

        /**
         * Enables or disables the Regenerate button.
         */
         this._enableRegenerateButton = function(bEnable) {
            oInnerControls.oRegenerateButton.setEnabled(bEnable);
        };

        /**
         * Method to access the outer VBox.
         */
        this._getOuterVbox = function () {
            return oInnerControls && oInnerControls.oDefaultVBox;
        };
    };

    /**
     * Reset the textbox and card preview on clear all
     * @returns {void}
     */
    ManageAddCardWithSearch.prototype._onClear = function() {
        this.resetDialog(true);
        MessageToast.show(this.i18Bundle.getText("Query_Deleted"));
        this._getTextBox().focus();
    };

    /**
     * Add card to insights section
     * @returns {void}
     * @private
     */
    ManageAddCardWithSearch.prototype.addCard = function(){
        var oManifest = this._getSearchedCard() && this._getSearchedCard().getManifest();
        this.getAggregation("_queryDialog").setBusy(true);
        sap.ui.require(["sap/insights/CardHelper"], function (CardHelper) {
            CardHelper.getServiceAsync().then(function (oService) {
                oService._createCard(oManifest).then(function (oReponse) {
                    this.getAggregation("_queryDialog").setBusy(false);
                    MessageToast.show(this.i18Bundle.getText("Card_Created"));
                    this.closeDialog();
                    if (!oReponse['sap.insights'].visible) {
                        MessageBox.information(this.i18Bundle.getText("INT_CARD_LIMIT_MESSAGEBOX"), {
                            styleClass: "msgBoxAlign"
                        });
                    }
                    if (this.hasListeners("onAddButtonPress")) {
                        this.fireOnAddButtonPress();
                    }
                }.bind(this));
            }.bind(this))
            .catch(function(oErr){
                this.getAggregation("_queryDialog").setBusy(false);
                Log.error(oErr.message);
                MessageToast.show(oErr.message);
            }.bind(this));
        }.bind(this));
    };

    /**
     * Opens the dialog.
     * @returns {void}
     */
    ManageAddCardWithSearch.prototype.closeDialog = function () {
        this._getQueryDialog().close();
    };

    /**
     * Opens the dialog.
     * @returns {void}
     */
    ManageAddCardWithSearch.prototype.openDialog = function () {
        this._getQueryDialog().open();
    };

     /**
     * AfterOpen set focus on the textbox field of the dialog.
     * @returns {void}
     */
    ManageAddCardWithSearch.prototype.afterOpenDialog = function () {
        this._getTextBox().focus();
    };

    /**
     * Function to set the AriaText for Card Manifest
     * @param {Object} oEvent oEvent
     * @private
     */
    ManageAddCardWithSearch.prototype._setAriaTextOnManifest = function(oEvent) {
        var ariaText = oEvent.getSource()._ariaText.getText();
        var sTitle = this.i18Bundle.getText('INT_DIALOG_TITLE_CardPreview');
        oEvent.getSource()._ariaText.setText(sTitle + ariaText);
        var oSapAppManifest = oEvent.getSource().getManifest()["sap.app"];
        if (oSapAppManifest && !(oSapAppManifest.title === oCardManifest["sap.app"].title)) {
            oEvent.getSource().setPreviewMode("Off");
        }
    };

    /**
     * onLiveChange of the text box
     * @private
     */
     ManageAddCardWithSearch.prototype.onChange = function() {
        var sQuery = this._getTextBox().getValue();
        if (sQuery && sQuery.trim().length) {
            this._enableRegenerateButton(true);
            this._enableClearButton(true);
        } else {
            this.resetDialog();
        }
    };

    /**
     * Function to handle search event
     * @param {Object} oEvent oEvent
     * @private
     * @experimental since 1.130.0
     */
    ManageAddCardWithSearch.prototype._onSearch = function () {
        var sQuery = this._getTextBox().getValue();
        if (sQuery && sQuery.trim().length) {
            this._startGenerate = true;
            this._getCancelButton().focus();
            this._toggleButtonAndText(false);
            this.resetDialog();
            var oPayload = {
                "UserInput": sQuery
            };
            fetch(AppConstants.AI_INSIGHTCARD_BASEURL, {
                method: "HEAD",
                headers: {
                    "X-CSRF-Token": "Fetch"
                }
            })
            .then(function(oToken) {
                var token = oToken.headers.get("X-CSRF-Token");

                return fetch(AppConstants.ADD_AI_INSIGHTCARD_COMPLETEURL, {
                    method: AppConstants.POST,
                    headers: {
                        "X-CSRF-Token": token,
                        "content-type": "application/json;odata.metadata=minimal;charset=utf-8"
                    },
                    body: JSON.stringify(oPayload)
                });
            })
            .then(function(response) {
                if (!response.ok) {
                    return response.json().then(function(errorData) {
                        return Promise.reject({ message: errorData.message || errorData.error.message });
                    });
                }
                return response.json();
            })
            .then(function(data) {
                if (this._startGenerate) {
                    this._toggleButtonAndText(true);
                    var response = "";
                    if (data && data.CardManifest) {
                        response = JSON.parse(data.CardManifest);
                    }
                    if (response) {
                        var oCard = this._getSearchedCard();
                        oCard.setManifest(response);
                        this._enableFocusAddButton(true);
                        this._setMessageStripOverflowVisibility(true);
                        this._toggleCardBox(true);
                    }
                    this._startGenerate = false;
                }
            }.bind(this))
            .catch(function(oErr) {
                if (this._startGenerate) {
                    this._toggleButtonAndText(true);
                    Log.error(oErr.message);
                    // match the error code and error message, it captures first two digit from the
                    // error code i.e from code like (3001 , 2001) we extract the first two digits (30,20)
                    //and excludes the remaining digits. And also we capture the message after the error code in the rest of the message
                    var regexCode = /\((\d{2})\d*\)\s*(.*)/;
                    var match = oErr.message.match(regexCode);
                    var prefixCode = "", errMessage = "";
                    if (match) {
                        prefixCode = match[1];
                        errMessage = match[2];
                    }
                    var oErrObject = this.setErrorMessage(prefixCode, errMessage);
                    var oNoCardMessage = this._getNoCardMessage();
                    oNoCardMessage.setTitle(oErrObject.title);
                    oNoCardMessage.setDescription(oErrObject.description);
                    oNoCardMessage.setIllustrationType(oErrObject.type);
                    this._toggleCardBox(false);
                    setTimeout(function() {
                        this._getTextBox().focus();
                    }.bind(this), 0);
                    this._startGenerate = false;
                }
            }.bind(this));
        } else {
            this._getTextBox().focus();
        }
    };

    /**
     * Function to set the error message type, title and description based on the error code
     * @param {string} prefixCode first two digits extracted from the error message
     * @param {string} errMessage remaining message after the error code
     * @returns {Object} oErr
     * @private
     */
    ManageAddCardWithSearch.prototype.setErrorMessage = function(prefixCode, errMessage) {
        var oIllusType = {
            type1: "sapIllus-SimpleConnection",
            type2: "sapIllus-SimpleNotFoundMagnifier",
            type3: "sapIllus-SimpleEmptyDoc",
            type4: "sapIllus-SimpleError"
        };
        var oErr = {
            type: "",
            title: "",
            description: errMessage
        };
        switch (prefixCode) {
            case "10":
                oErr.type = oIllusType.type1;
                oErr.title = this.i18Bundle.getText("ERRORCODE_TITLE1");
                break;
            case "20":
                oErr.type = oIllusType.type2;
                oErr.title = this.i18Bundle.getText("ERRORCODE_TITLE2");
                break;
            case "30":
                oErr.type = oIllusType.type3;
                oErr.title = this.i18Bundle.getText("ERRORCODE_TITLE3");
                break;
            default:
                oErr.type = oIllusType.type4;
                oErr.title = this.i18Bundle.getText("ERRORCODE_TITLE4");
                break;
        }

        return oErr;
    };

    /**
     * Resets the dialog by clearing the input field and card header title if specified,
     * setting the card manifest and preview mode, toggling the card and message strip visibility,
     * and disabling the add button.
     *
     * @param {boolean} bClose - A boolean value indicating whether to clear the input field and card header title.
     * @returns {void}
     * @public
     * @experimental since 1.130.0
     */
    ManageAddCardWithSearch.prototype.resetDialog = function(bClose) {
        if (bClose) {
            this._getTextBox().setValue("");
            this._getNoCardMessage().setDescription(" ");
            this._toggleButtonAndText(true);
            this._startGenerate = false;
        }
        this._setMessageStripOverflowVisibility(false);
        const manifestChanges = {"/sap.card/header/dataTimestamp": ""};
        var oCard = this._getSearchedCard();
        oCard.setManifestChanges([manifestChanges]);
        oCard.setManifest(oCardManifest);
        oCard.setPreviewMode("Abstract");
        this._toggleCardBox(true);
        this._enableFocusAddButton(false);
        this._enableClearButton(false);
        this._enableRegenerateButton(false);
    };

    return ManageAddCardWithSearch;
});