// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/actions/Action"
], function (Action) {
    "use strict";

    return Action.extend("sap.ushell.opa.actions.Focus", {
        metadata: {},
        executeOn: function (oTargetControl) {
            oTargetControl.focus();
        }
    });
}, true);
