sap.ui.define(
	[
		"sap/ui/test/Opa5",
		"sap/base/strings/capitalize",
		"sap/ui/comp/smartfield/ODataControlFactory",
		"sap/ui/test/actions/Press"
	],
	function (
		Opa5,
		capitalize,
		ODataControlFactory,
		Press
	) {
		"use strict";

		var sIdRequestsLog = "requests";

		Opa5.createPageObjects({
			onTheApplicationPage: {
				actions: {
					iClearRequestsLog: function () {
						return this.waitFor({
							id: sIdRequestsLog,
							success: function (oList) {
								oList.removeAllItems();
							}
						});
					},
					iToggleMode: function (sId, bEditable) {
						return this.waitFor({
							id: sId,
							controlType: "sap.ui.comp.smarttable.SmartTable",
							success: function (oSmartTable) {
								oSmartTable.setEditable(bEditable);
							}
						});
					},
					iOpenSettings: function (sSmartTableId) {
						return this.waitFor({
							id: sSmartTableId + "-btnPersonalisation",
							controlType: "sap.m.OverflowToolbarButton",
							actions: new Press()
						});
					},
					iChangeColumnVisibility: function (sColumnName, bVisible) {
						return this.waitFor({
							controlType: "sap.m.ColumnListItem",
							success: function (aColumnListItem) {
								var oColumnListItem = aColumnListItem.find(function(oCurrColumnListItem){
									return oCurrColumnListItem.getCells()[0].getItems()[0].getText() === sColumnName;
								});

								if (oColumnListItem._oMultiSelectControl) {
									new Press().executeOn(oColumnListItem._oMultiSelectControl);
								}
							}
						});
					},
					iConfirmSettings: function () {
						return this.waitFor({
							controlType: "sap.m.Dialog",
							success: function (aDialog) {
								var oConfirmButton = aDialog[0].getButtons()[0];

								new Press().executeOn(oConfirmButton);
							}
						});
					}
				},
				assertions: {
					iShouldSeeNumberOfRequests: function (nCount, sPath) {
						return this.waitFor({
							id: sIdRequestsLog,
							success: function (oList) {
								var aResult;

								Opa5.assert.ok(true, "Items loaded: " + oList.getItems().length);
								Opa5.assert.ok(true, "Items: " + JSON.stringify(
									oList.getItems().map(
											(o) => {return o.data("sentRequest").sentRequest;}
										)
									)
								);

								aResult = oList.getItems().filter(function(oItem) {
									var oSentRequest = oItem.data("sentRequest").sentRequest,
										sRequestPath = oSentRequest.path;

									return sPath === sRequestPath;
								});

								Opa5.assert.strictEqual(
									aResult.length,
									nCount,
									"Expected requests: " + nCount + ", Actual requests: " + aResult.length
								);
							}
						});
					},
					iShouldSeeSmartFieldWithValue: function (sSmartTableId, sColumnName, iRowIndex, mValue) {
						return this.waitFor({
							controlType: "sap.ui.comp.smarttable.SmartTable",
							id: sSmartTableId,
							success: function (oSmartTable) {
								var oTable = oSmartTable.getTable(),
									oColumnIndex = oTable.getColumns().findIndex(function(oColumn){
										return oColumn.getHeader().getText() === sColumnName;
									}),
									oRow = oTable.getItems()[iRowIndex],
									oSmartField = oRow.getCells()[oColumnIndex],
									oInnerControl = oSmartField.getFirstInnerControl(),
									sValuePropertyMap = ODataControlFactory.getBoundPropertiesMapInfoForControl(oInnerControl.getMetadata().getName(), {
										propertyName: "value"
									})[0],
									sValueMutatorName = "get" + capitalize(sValuePropertyMap),
									mCurrentValue = oInnerControl[sValueMutatorName]();

								Opa5.assert.strictEqual(mCurrentValue, mValue, "The SmartField's inner control has value" + mValue);
							}
						});
					}
				}
			}
		});
	}
);
