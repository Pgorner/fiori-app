// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * Implements the keyboard press
 * This only works for ui5/ jquery event handler and not for addEventListener
 */
sap.ui.define([
    "sap/ui/test/actions/Action",
    "sap/ui/test/Opa5"
], function (Action, Opa5) {
    "use strict";

    return Action.extend("sap.ushell.opa.actions.PressKey", {
        // keyCode must be always provided
        // Add Alt and Ctrl handling, if needed
        metadata: {
            properties: {
                keyCode: {
                    type: "int",
                    defaultValue: 0
                },
                shift: {
                    type: "boolean",
                    defaultValue: false
                }
            }
        },
        executeOn: function () {
            var oDomRef = window.document.activeElement || window.document;
            var bShift = !!this.getShift();
            var keyCode = this.getKeyCode();
            var oUtils = Opa5.getUtils();

            oUtils.triggerKeydown(oDomRef, keyCode, bShift, false, false);
            oUtils.triggerKeyup(oDomRef, keyCode, bShift, false, false);
        }
    });
}, true);
