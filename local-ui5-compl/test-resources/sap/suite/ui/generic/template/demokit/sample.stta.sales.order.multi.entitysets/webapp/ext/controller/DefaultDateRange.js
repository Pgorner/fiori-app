sap.ui.define([
    "sap/ui/comp/config/condition/DateRangeType"
], function (DateRangeType) {
    "use strict";

    var DefaultDateRange = DateRangeType.extend("SOMULTIENTITY.ext.controller.customDateRangeType", {

    });

    DefaultDateRange.prototype.getDefaultOperation = function () {
        return this.getOperation("THISYEAR");
    };

    return DefaultDateRange;

}, /* bExport= */ true);