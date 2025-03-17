sap.ui.define([
    "sap/base/Log"
], function (
    Log
) {
    "use strict";

    return {
        onInit: function () { },

        /**
         * Gets the card item's binding object for the count footer
         */
        getCardItemsBinding: function () {
            var table = this.getView().byId("ovpTable");
            return table.getBinding("items");
        },

        onAfterRendering: function () {
            var oTable = this.getView().byId("ovpTable");
            var aAggregation = oTable.getAggregation("columns");
            for (var iCount = 0; iCount < 3; iCount++) {
                if (aAggregation[iCount]) {
                    aAggregation[iCount].setStyleClass("sapTableColumnShow").setVisible(true);
                }
            }
        },

        /**
         * Gets the card item's binding info
         */
        getCardItemBindingInfo: function () {
            var oList = this.getView().byId("ovpTable");
            return oList.getBindingInfo("items");
        },

        /**
         * Manages the number of columns that can be displayed in the table during view-switch
         *
         * @method addColumnInTable
         * @param {Object} oCardResizeData- card resize properties
         */
        addColumnInTable: function (oCardResizeData) {
            if (oCardResizeData.colSpan >= 1) {
                var table = this.getView().byId("ovpTable");
                var aggregation = table.getAggregation("columns");
                var iColSpan = oCardResizeData.colSpan;
                // No of columns to be shown calculated based upon colspan
                var iIndicator = iColSpan + 1;
                for (var i = 0; i < 6; i++) {
                    if (aggregation[i]) {
                        if (i <= iIndicator) {
                            //Show any particular column
                            aggregation[i].setStyleClass("sapTableColumnShow").setVisible(true);
                        } else {
                            //hide any particular column
                            aggregation[i].setStyleClass("sapTableColumnHide").setVisible(false);
                        }
                    }
                }
                table.invalidate();
            }
        },

        onRefresh: function () {
            if (this.getCardItemsBinding()) {
                this.getCardItemsBinding().refresh();
            }
        },

        /**
         * Method called upon card resize
         *
         * @method resizeCard
         * @param {Object} newCardLayout- resize data of the card
         * @param {Object} cardSizeProperties - card properties
         */
        resizeCard: function (newCardLayout, cardSizeProperties) {
            var iNoOfItems, iAvailableSpace, iHeightWithoutContainer, iAvailableSpace;
            var oCardController = this.getView().getController();
            var iItemHeight = oCardController.getItemHeight(oCardController, "ovpTable", true);
            try {
                var oCard = document.getElementById(this.oDashboardLayoutUtil.getCardDomId(this.cardId)),
                    oBindingInfo = this.getCardItemBindingInfo(),
                    iHeaderHeight = this.getHeaderHeight(),
                    oOvpContent = this.getView().byId("ovpCardContentContainer").getDomRef();
                if (newCardLayout.showOnlyHeader) {
                    oOvpContent.classList.add("sapOvpContentHidden");
                    iNoOfItems = 0;
                } else {
                    oOvpContent.classList.remove("sapOvpContentHidden");
                    iHeightWithoutContainer = iHeaderHeight + cardSizeProperties.dropDownHeight;
                    iAvailableSpace =
                        newCardLayout.rowSpan * newCardLayout.iRowHeightPx -
                        iHeightWithoutContainer -
                        iItemHeight;
                    iNoOfItems = Math.abs(Math.floor(iAvailableSpace / iItemHeight));
                    oCard.style.height = newCardLayout.rowSpan * newCardLayout.iRowHeightPx + "px";
                }
                oOvpContent.style.height =
                    newCardLayout.rowSpan * newCardLayout.iRowHeightPx -
                    (iHeaderHeight + 2 * newCardLayout.iCardBorderPx) +
                    "px";
                this.addColumnInTable(newCardLayout);
                if (iNoOfItems !== oBindingInfo.length) {
                    oBindingInfo.length = iNoOfItems;
                    newCardLayout.noOfItems = oBindingInfo.length;
                    this.getCardItemsBinding().refresh();
                } else {
                    this._handleCountHeader();
                }
            } catch (error) {
                Log.warning("OVP resize: " + this.cardId + " catch " + error.toString());
            }
        }
    };
});
