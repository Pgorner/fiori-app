sap.ui.define([
    "sap/ui/comp/config/condition/DateRangeType"
], function(DateRangeType) {
    "use strict";

    var DefaultDateRange = DateRangeType.extend("sap.ovp.demo.ext.customDateRangeType", {

    });

    DefaultDateRange.prototype.getDefaultOperation = function () {
        return this.getOperation("THISYEAR");
    };

    return DefaultDateRange;

}, /* bExport= */ true);
