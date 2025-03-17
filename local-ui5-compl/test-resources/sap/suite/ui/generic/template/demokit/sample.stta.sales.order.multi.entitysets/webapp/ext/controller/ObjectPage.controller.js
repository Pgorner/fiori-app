sap.ui.define([
    "sap/ui/core/message/MessageType"
], function (MessageType) {
    "use strict";
    return {

        onInit: function () { },

        onBeforeRebindTableExtension: function () {
            if (this.extensionAPI.setCustomMessage) {
                var oMsg = {
                    message: "Custom message on object page table",
                    type: MessageType.Success
                };
                this.extensionAPI.setCustomMessage(oMsg, "SOMULTIENTITY::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrder_WD_20--SalesOrderItemsID::Table");

            }
        }
    };
});