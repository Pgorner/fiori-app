sap.ui.define(["sap/ui/test/Opa5"], function(Opa5) {
	return function(prefix, viewName, viewNamespace) {
		return {
			theFilterIsFilled: function(sFilter, sValue) {
				return this.waitFor({
					id: prefix + "listReportFilter",
					success: function(oSFB) {
						Opa5.assert.equal(oSFB.getFilters([sFilter])[0].aFilters[0].oValue1, sValue,
						"The SmartFilterBar is filled according to the parameter");
					}
				});
			}
		};
	};
});
