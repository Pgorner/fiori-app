sap.ui.define(
    ["sap/ui/comp/config/condition/DateRangeType"],
    function (DateRangeType) {
        "use strict";

        var DefaultDateRange = DateRangeType.extend("procurement.ext.customDateRangeType", {});

        DefaultDateRange.prototype.getDefaultOperation = function () {
            return this.getOperation("TODAY");
        };

        return DefaultDateRange;
    },
    /* bExport= */ true
);
