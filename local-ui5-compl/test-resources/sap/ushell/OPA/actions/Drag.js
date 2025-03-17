// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * Mocks drag functionality
 * This only works for ui5/ jquery event handler and not for addEventListener
 */
sap.ui.define([
    "sap/ushell/opa/actions/DragDropBase"
], function (DragDropBase) {
    "use strict";

    return DragDropBase.extend("sap.ushell.opa.actions.Drag", {
        metadata: {
            properties: {}
        },

        init: function () {
            DragDropBase.prototype.init.apply(this, arguments);

            this.setEventType("dragstart");
        }
    });
});
