sap.ui.define([],function () {
    "use strict";

    return {
        setRelevantFilters: function (oFilters) {
            var oViz = this.getView().byId("idVizFrame");
            oViz.getDataset().getBinding("data").filter(oFilters);
        }
    };
});