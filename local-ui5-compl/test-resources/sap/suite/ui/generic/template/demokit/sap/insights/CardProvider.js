sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/base/Object", "sap/base/util/extend",
], function (MessageToast, BaseObject, extend) {
    'use strict';

    function getMethods(sAppComponentId, aShareCards) {
        function onViewUpdate(bIsRegistered, aShareCards) {
            if (sAppComponentId === "application-SalesOrder-nondraft-component") { // Allow mocking only to specific apps in demokit
                if (bIsRegistered) {
                    if (aShareCards && aShareCards.length > 0) {
                        MessageToast.show("Insights channel is updated with new cards");
                    } else {
                        MessageToast.show("Share cards to Insights channel removed");
                    }
                } else {
                    MessageToast.show("CardProvider is unregistered");
                }
            }
        }
        return {
            onViewUpdate : onViewUpdate
        }
    }
    return BaseObject.extend("sap.insights.CardProvider", { 
        constructor: function(sAppComponentId, aShareCards) {
			extend(this, getMethods(sAppComponentId, aShareCards));
		}
    })
});