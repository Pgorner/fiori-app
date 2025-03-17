/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/NavContainer",
    "sap/ui/model/resource/ResourceModel",
    "./manageCards/CardsList",
    "sap/insights/CardHelper",
    "sap/ui/core/Lib",
    "sap/ui/core/Core",
    "./utils/InsightsUtils"
], function (
    Control,
    NavContainer,
    ResourceModel,
    CardsList,
    CardHelper,
    CoreLib,
    Core,
    InsightsUtils
) {
    "use strict";

    /**
	 * Constructor for  ManageCards.
	 *
	 * @class
	 * This control shows list of all user cards and allows perform actions like change visibility, change order.
     * It also allows user to get preview of particular card, delete or copy.
	 * @extends sap.ui.core.Control
	 * @public
     * @since 1.119
     * @alias sap.insights.ManageCards
	 */
    var ManageCards = Control.extend("sap.insights.ManageCards", {
        metadata: {
            properties: {
                /**
                 * Sets enableResetAllCards property
                 */
                enableResetAllCards: {
                    type: "boolean",
                    group: "Behavior",
                    defaultValue: false
                },
                 /**
                 * Sets the cardId property  which decides whether to render the details page or cardlist page,
                 *  if cardId is provided , cardDetails page is rendered
                 */
                cardId: {
                    type: "string",
                    group: "Behavior",
                    defaultValue: null
                }
            },
            aggregations: {
                _navContainer: {
                    type: "sap.m.NavContainer",
                    multiple: false,
                    visibility: "hidden"
                }
            }
        },
        renderer: {
            apiVersion: 2,
            render: function (oRm, oControl) {
                oRm.openStart("div", oControl);
                oRm.style("height", "100%");
                oRm.style("width", "100%");
                oRm.openEnd();
                oControl._oNavContainer.to(oControl._oNavContainer.getInitialPage());
                oRm.renderControl(oControl.getAggregation("_navContainer"));
                oRm.close("div");
            }
        }
    });

    ManageCards.prototype.onAfterRendering = function() {
        var oUserCardModel;
        this._oNavContainer.setBusy(true);
        CardHelper.getServiceAsync().then(function (oService) {
            return oService._getUserAllCardModel();
        }).then(function(cardModel) {

            oUserCardModel = cardModel;
            if (!this._cardListPage) {
                // Add CardList Page
                this._cardListPage = new CardsList(this.getId() + "cardList", {
                    enableResetAllCards: this.getEnableResetAllCards(),
                    listPress: this._navToDetails.bind(this)
                });
                this._cardListPage.setModel(oUserCardModel);
                this._cardListPage._handleModelChange(); //one time call during initialisation
                oUserCardModel.bindProperty("/cards").attachChange(function(event) {
                    this._cardListPage._handleModelChange(); //whenever 'cards' change invoke _handleModelChange
                }.bind(this));
                this._oNavContainer.addPage(this._cardListPage);
            }

            var sCardId = this.getCardId();
            if (sCardId) {
                var aCards = oUserCardModel.getProperty("/cards");
                var oCard = aCards.find(function(oCard){
                    return oCard.id === sCardId;
                });
                if (oCard) {
                    this.loadCardDetails().then(function() {
                        this._oNavContainer.addPage(this._cardDetailControl);
                        var manifest = JSON.stringify(oCard);
                        this._cardDetailControl.setProperty("manifest", manifest, false);
                        this._oNavContainer.to(this._cardDetailControl);
                    }.bind(this));
                }
            } else {
                this._oNavContainer.setInitialPage(this._cardListPage);
                this._oNavContainer.to(this._cardListPage);

            }
            this._oNavContainer.setBusy(false);
        }.bind(this));
    };

    ManageCards.prototype.loadCardDetails = function() {
        return new Promise(async function (resolve) {
            if (!this._cardDetailControl) {
                await CoreLib.load({
                    name: "sap/ui/mdc"
                });
                sap.ui.require(["sap/insights/manageCards/CardDetails"], function (CardDetails) {
                    this._cardDetailControl = new CardDetails(this.getId() + "previewPage",{
                        navigate: this.navigateTo.bind(this)
                    });
                    resolve();
                }.bind(this));
            } else {
                resolve();
            }
        }.bind(this));
    };

    ManageCards.prototype.init = function() {
        //Instantiate NavContainer creation
        this._oNavContainer = new NavContainer(this.getId() + "--selectionNavCon", {
            busy: true
        });
        this._oNavContainer.setModel(new ResourceModel({ bundle: InsightsUtils.getResourceBundle() }), "i18n");
        this.setAggregation("_navContainer", this._oNavContainer);
	};

    /**
	* Function to navigate to the specified page, if no sPageId provided navigate to CardList by default
    * @param {Object} oEvent oEvent object
    * @param {String} sPageId page id to which to navigate to
    * @public
    */
    ManageCards.prototype.navigateTo = function (oEvent, sPageId) {
        if (!oEvent && sPageId) {
            this._oNavContainer.to(sPageId);
        } else {
            this._oNavContainer.to(this._cardListPage.getId());
        }
    };

    /**
	* Function to navigate to to cardDetails page
    * @param {Object} oDetails object containing manifest as a property. This is the manifest
    * of the card whose detail will be be displayed after navigation
    * @private
    * @experimental Since 1.119
    */
    ManageCards.prototype._navToDetails = function (oDetails) {
        if (oDetails && oDetails.getParameter("manifest")) {
            this._oNavContainer.setBusy(true);
            this.loadCardDetails().then(function(){
                this._cardDetailControl.setProperty("manifest",oDetails.getParameter("manifest"),false);
                //if not already added to NavContainer add cardDetailPage to navcontainer
                if (!this._oNavContainer.getPage(this._cardDetailControl.getId())) {
                    this._oNavContainer.addPage( this._cardDetailControl );
                }
                this._cardDetailControl.oPage.setShowNavButton(true);
                //when list is refreshed from cardsList, the cardDetails should be updated with the latest data, so pass list of dtcards id to clear cache
                if (oDetails.getParameter("listRefresh")) {
                    this._cardDetailControl._refreshDTSmartForm(oDetails.getParameter("listRefresh"));
                }
                this._cardDetailControl.setEditable(false);
                this._oNavContainer.setBusy(false);
                this._oNavContainer.to(this._cardDetailControl);
            }.bind(this));
        }
    };

    /**
	* Function to Clear Activities like navigation, filters
    * @public
    * @experimental Since 1.119
    */
    ManageCards.prototype.clearPage = function () {
        if (this._cardListPage) {
            this.navigateTo();  // Navigate Back to List Page
            if (this._cardListPage._oSearchField) {
                this._cardListPage._oSearchField.clear();
            }
            if (this._cardListPage._oVisibleFilterSwitch && this._cardListPage._oVisibleFilterSwitch.getState()) {
                this._cardListPage._oVisibleFilterSwitch.setState(false);
                this._cardListPage._oVisibleFilterSwitch.fireChange();
            }
        }
        this.setProperty("cardId", "");
    };

    return ManageCards;
});
