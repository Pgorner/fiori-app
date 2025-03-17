/*** List Report assertions ***/
sap.ui.define(["sap/ui/test/Opa5"],
	function (Opa5) {
		'use strict';

		return function () {

			return {

				iClickTheItemPresentInThePopOverList: function (sPopOverId, sValue) {
					return this.waitFor({
						id: new RegExp(sPopOverId + "$"),
						success: function (oControl) {
							var aListItems = oControl[0].getContent()[0].getPages()[0].getContent()[0].getItems();
							for (var i = 0; i < aListItems.length; i++) {
								if (aListItems[i].getTitle() === sValue) {
									aListItems[i].firePress();
									Opa5.assert.ok(true, "Item '" + sValue + "' is clicked from the List");
									return null;
								}
							}
							Opa5.assert.NotOk(true, "Item '" + sValue + "' is not present in the List");
						},
						errorMessage: "PopOver with id: '" + sPopOverId + "' not found"
					});
				}
			};
		};
	});
