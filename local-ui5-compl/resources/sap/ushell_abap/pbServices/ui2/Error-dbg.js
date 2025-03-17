// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview An error object which logs the error message immediately.
 */

sap.ui.define([
    "sap/base/Log"
], function (
    Log
) {
    "use strict";

    /**
     * Creates an <code>Error</code> object and logs the error message immediately.
     *
     * @param {string} sMessage
     *   the error message
     * @param {string} [sComponent]
     *   the error component to log
     * @param {boolean} [bLogError=true]
     *   defines if the error is logged directly in the constructor; In case the error is going to be catched,
     *   the logging may be misleading
     *
     * @class
     * @since 1.2.0
     */
    var SrvcError = function (sMessage, sComponent, bLogError) {
        // see also redundant declaration in utils.js which has to be in sync
        var oError = new Error(sMessage); // reuse Error constructor to benefit from it (e.g. stack)

        // by default the error should be logged (as always in this project)
        bLogError = bLogError === undefined ? true : bLogError;

        oError.name = "Error";
        if (bLogError === true) {
            Log.error(sMessage, null, sComponent);
        }

        return oError;
    };

    return SrvcError;
});
