sap.ui.define([], function () {
    "use strict";
    return {
        getAllowedNumberOfCards: function () {
            var sWarningMsgtext = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("WARNING_MSG");
            return { 
                numberOfCards: 27, 
                errorMessage: sWarningMsgtext
            };
        }
    };
});
