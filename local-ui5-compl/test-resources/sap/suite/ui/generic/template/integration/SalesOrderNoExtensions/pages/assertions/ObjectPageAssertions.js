/*** List Report assertions ***/
sap.ui.define(
	["sap/ui/test/Opa5",
	"sap/suite/ui/generic/template/integration/Common/Common"],
	function (Opa5) {
		'use strict';

		return function () {
			return {
				iShouldSeeTheRowHighlighted: function (sId, iRowIndex, sExpectedHighlight) {
					return this.waitFor({
						id: new RegExp(sId + "$"),
						success: function (oTable) {
							var sHighlight = oTable[0].getItems()[iRowIndex].getHighlight();
							Opa5.assert.equal(sHighlight, sExpectedHighlight, "The Row Item Highlight for the item at index: " + iRowIndex);
						},
						errorMessage: "The row item Highlight is incorrect"
					});
				},

				iCheckTextInPopover: function (sText) {
					return this.waitFor({
						controlType: "sap.m.Popover",
						success: function (oPopover) {
							var sActualText = oPopover[0].getContent()[0].getItems()[0].getText();
							Opa5.assert.ok(sActualText === sText, "MessagePopover with text '" + sText + "' found on the screen");
						},
						errorMessage: "Couldn't find the message popover on the screen"
					});
				},

				iCheckTheOptionInTheDiscardDraftPopUp: function (sOption, sDescription, bSelected) {
					return this.waitFor({
						controlType: "sap.m.CustomListItem",
						searchOpenDialogs: true,
						success: function (oListItems) {
							var bFlag = false
							for (var i = 0; i < oListItems.length; i++) {
								if (oListItems[i].getContent()[0].getItems()[0].getText() === sOption &&
									oListItems[i].getContent()[0].getItems()[1].getText() === sDescription &&
									oListItems[i].getSelected() === bSelected ) {
									bFlag = true;
									break;
								}
							}
							Opa5.assert.ok(bFlag, "Option '" + sOption + "' with description '" + sDescription + "' is found");
						},
						errorMessage: "The CustomListItem not found on the screen"
					});
				},
				
				iCheckTheItemPresentInTheDraftAndActiveObjectPopOverList: function (sItem) {
					return this.waitFor({
						controlType: "sap.m.Popover",
						success: function (oPopover) {
							var aListItems = oPopover[0].getContent()[0].getItems();
							var bFlag = false
							for (var i = 0; i < aListItems.length; i++) {
								if (aListItems[i].getText() === sItem) {
									bFlag = true;
									break;
								}
							}
							Opa5.assert.ok(bFlag, "The item '" + sItem + "' is available present in the PopOver list");
						},
						errorMessage: "The Popover not found on the screen"
					});
				},

				/**
			 * Check that the focus sets on the particular field of the table
			 * @param {Number} iRowIndex - Nth row number of table(starting from 0)
			 * @param {Number} iColIndex - Nth column of the given row(starting from 0)
			 * @param {String} sTableId - The id of the table
			 * @return {*} success or failure
			 */
				iExpectFocusOnNthCellOfNthRowOfTheTable: function (iRowIndex, iColIndex, sTableId) {
					return this.waitFor({
						id: new RegExp(sTableId + "$"),
						success: function (oTable) {
							var oRowItem = oTable[0].getItems()[iRowIndex].getCells()[iColIndex];
							var focusedDomNode = document.getElementById("OpaFrame").contentWindow.document.activeElement;
							//focusedDomNode is pointing to the inner div element within the dom structure. So we have to traverse up to the parent element.
							var parentDomNode = focusedDomNode.parentElement.parentElement.parentElement.parentElement;
							if (parentDomNode.id === oRowItem.getId()) {
								Opa5.assert.ok(true, "Field of " + iColIndex + "th column in the " + iRowIndex + "th row in the table is focused");
							} else {
								Opa5.assert.notOk(true, "Field of " + iColIndex + "th column in the " + iRowIndex + "th row in the table is not focused");
							}
						},
						errorMessage: "Table Control with id " + sTableId + " not found"
					});
				},

				iShouldSeeTheInactiveRowOnTheTable: function (sTotalInactiveRows, sTableId) {
					return this.waitFor({
						id: new RegExp(sTableId + "$"),
						success: function (oTable) {
							switch (oTable[0].getMetadata().getElementName()) {
								case "sap.m.Table":
									var rInActiveRow = 0;
									for (var i = 0; i < oTable[0].getItems().length; i++) {
										if (oTable[0].getItems()[i].getType() === "Inactive") {
											rInActiveRow++;
										}
									}
									Opa5.assert.ok(sTotalInactiveRows === rInActiveRow, "There are'" + rInActiveRow + "'Inactive Rows");

									break;
								case "sap.ui.table.Table":
									var noOfRows = oTable[0].getBinding().getLength();
									var gInActiveRow = 0;
									for (var j = 1; j <= 2; j++) {
										if ((oTable[0].getRows()[noOfRows - j].getRowAction().getItems()[0].getVisible() === false)) {
											gInActiveRow++;

										}
									}
									Opa5.assert.ok(sTotalInactiveRows === gInActiveRow, "There are '" + gInActiveRow + "'Inactive Rows");
									break;
								default:
									break;
							}
						},
						errorMessage: "Cannot find the table on the UI"
					});
				},
				iCheckCustomizeConfigPropertyOfTable: function (sId, oObject) {
					return this.waitFor({
						id: new RegExp(sId + "$"),
						success: function (oTable) {
							Opa5.assert.ok(JSON.stringify(oTable[0].getCustomizeConfig()) === JSON.stringify(oObject), "The CustomizeConfig property exists for the Table");
						},
						errorMessage: "Cannot find the table on the UI"
					});
				},
				iCheckTooltipForTheButton: function (sId, sTooltip) {
					return this.waitFor({
						id: new RegExp(sId + "$"),
						success: function (oButton) {
							Opa5.assert.ok(oButton[0].getTooltip() === sTooltip, "Tooltip '" + sTooltip + "' found for the button");
						},
						errorMessage: "Button with the given id not found"
					});
				}
			};
		};
	});
