/*** List Report assertions ***/
sap.ui.define(["sap/ui/test/Opa5"],
	function (Opa5) {
		'use strict';

		return function (prefix) {

			return {
				checkTheColumnOnTheLRTable: function (oColumnData, sTabKey) {
					return this.waitFor({
						controlType: "sap.ui.comp.smarttable.SmartTable",
						id: sTabKey ? prefix + "listReport-" + sTabKey : prefix + "listReport",
						success: function (oSmartTable) {
							var sColumnId = oSmartTable.getTable().getColumns()[oColumnData.Index].getId();
							var sColumnHeader = oSmartTable.getTable().getColumns()[oColumnData.Index].getAggregation("header").getText();
							var sColumnHeaderId = oSmartTable.getTable().getColumns()[oColumnData.Index].getAggregation("header").getId();
							Opa5.assert.ok(sColumnId === prefix + oColumnData.ColId, "Column id is correct");
							Opa5.assert.ok(sColumnHeader === oColumnData.ColHeader, "Column header is correct");
							Opa5.assert.ok(sColumnHeaderId === prefix + oColumnData.ColHeaderId, "Column header id is correct");
						},
						errorMessage: "Smart table not found on the screen"
					});
				},
			};
		};
	});
