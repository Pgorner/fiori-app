// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * Implements the press of F6
 * This only works for ui5/ jquery event handler and not for addEventListener
 */
sap.ui.define([
    "sap/ui/test/actions/Action",
    "sap/ui/test/Opa5",
    "sap/ui/events/KeyCodes"
], function (Action, Opa5, KeyCodes) {
    "use strict";

    return Action.extend("sap.ushell.opa.actions.PressF6", {
        metadata: {
            properties: {
                shift: {
                    type: "boolean",
                    defaultValue: false
                }
            }
        },
        executeOn: function () {
            var oDomRef = window.document.activeElement || document;
            var bShift = !!this.getShift();
            var oUtils = Opa5.getUtils();

            oUtils.triggerKeydown(oDomRef, KeyCodes.F6, !!bShift, false, false);
            oUtils.triggerKeyup(oDomRef, KeyCodes.F6, !!bShift, false, false);
        }
    });
}, true);
