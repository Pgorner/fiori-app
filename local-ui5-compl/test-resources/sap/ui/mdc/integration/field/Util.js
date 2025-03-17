/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([], function() {
    "use strict";

    const oUtil = {
        getDateWithoutTime: function(oDate, bSecondDate) {
            if (bSecondDate) {
                return new Date(new Date(oDate).setHours(23, 59, 59));
            }
            return new Date(new Date(oDate).setHours(0, 0, 0));
        }
    };

    return oUtil;
});