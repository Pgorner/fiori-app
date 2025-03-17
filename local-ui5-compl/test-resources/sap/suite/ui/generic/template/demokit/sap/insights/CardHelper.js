sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    return {
        getServiceAsync: function () {
            return Promise.resolve({
                showCardPreview: function () {
                    MessageToast.show("Card Preview Triggered!");
                }
            });
        }
    };
});