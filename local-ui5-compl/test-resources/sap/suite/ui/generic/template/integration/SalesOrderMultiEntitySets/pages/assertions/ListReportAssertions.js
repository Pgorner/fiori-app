/*** List Report assertions ***/
sap.ui.define(["sap/ui/test/Opa5",
"sap/ui/test/matchers/AggregationFilled"],
	function (Opa5,AggregationFilled) {
		'use strict';

		return function () {

			return {

				iCheckTheItemPresentInThePopOverList: function (sPopOverId, sValue, bPresent) {
					return this.waitFor({
						id: new RegExp(sPopOverId + "$"),
						success: function (oControl) {
							var aListItems = oControl[0].getContent()[0].getPages()[0].getContent()[0].getItems();
							for (var i = 0; i < aListItems.length; i++) {
								var bFound = false;
								if (aListItems[i].getTitle() === sValue) {
									bFound = true;
									break;
								}
							}
							if (bPresent) {
								Opa5.assert.ok(bFound, sValue + " is present in the List");
							} else {
								Opa5.assert.ok(!bFound, sValue + " is not present in the List");
							}
						},
						errorMessage: "PopOver with id: '" + sPopOverId + "' not found"
					});
				}
			};
		};
	});
