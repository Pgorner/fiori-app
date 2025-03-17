/*** List Report Actions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/matchers/AggregationFilled"],

	function (PropertyStrictEquals, AggregationFilled) {
		'use strict';

		return function (prefix, viewName, viewNamespace) {

			return {

				/* SET AN ITEM TO NOT DELETABLE (BY UPDATING DELETABLE-PATH) */
				iSetItemsToNotDeletableInTheTable: function (aItemIndex) {
					return this.waitFor({
						id: prefix + "responsiveTable",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						actions: function(oControl) {
							var oModel = oControl.getModel();
							var aTableItems = oControl.getItems();
							for (var i = 0; i < aItemIndex.length; i++) {
								var sPath = aTableItems[aItemIndex[i]].getBindingContext().getPath();
								oModel.setProperty(sPath + "/Delete_mc", false);
							}
						},
						errorMessage: "The Smart Table is not rendered correctly"
					});
				}
			};
		};
});
