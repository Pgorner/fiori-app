/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"sap/ui/test/Opa5",
		"sap/ui/test/OpaBuilder",
		"./FEBuilder",
		"./MacroFieldBuilder",
		"./OverflowToolbarBuilder",
		"./DialogBuilder",
		"sap/fe/test/Utils",
		"sap/fe/test/api/APIHelper",
		"sap/ui/test/matchers/Interactable",
		"sap/ui/core/library",
		"sap/ui/test/actions/EnterText",
		"sap/ui/core/Lib"
	],
	function (
		Opa5,
		OpaBuilder,
		FEBuilder,
		MacroFieldBuilder,
		OverflowToolbarBuilder,
		DialogBuilder,
		Utils,
		APIHelper,
		Interactable,
		library,
		EnterText,
		Lib
	) {
		"use strict";

		var SortOrder = library.SortOrder;
		var oSAPMResourceBundle = Lib.getResourceBundleFor("sap.m");

		// depending on the sap.ui.table creates now extra request which are not optimal for test execution
		var RowActionType = {
			/**
			 * Custom defined Row Action.
			 * @public
			 */
			Custom: "Custom",

			/**
			 * Navigation Row Action.
			 * @public
			 */
			Navigation: "Navigation",

			/**
			 * Delete Row Action.
			 * @public
			 */
			Delete: "Delete"
		};

		var TableBuilder = function () {
			return FEBuilder.apply(this, arguments).hasType("sap.ui.mdc.Table").hasProperties({ busy: false });
		};

		function _isGridTable(oMdcTable) {
			if (Array.isArray(oMdcTable)) {
				oMdcTable = oMdcTable[0];
			}
			return oMdcTable.getType().isA("sap.ui.mdc.table.GridTableType");
		}

		function _getRowAggregationName(oMdcTable) {
			return _isGridTable(oMdcTable) ? "rows" : "items";
		}

		function _getColumnIndex(vColumn, oMdcTable) {
			var iIndex = Number(vColumn);
			return Number.isNaN(iIndex)
				? oMdcTable.getColumns().findIndex(function (oColumn) {
						return oColumn.getHeader() === vColumn || oColumn.getPropertyKey() === vColumn;
				  })
				: iIndex;
		}

		function _getMdcTable(vTableElement) {
			var oMdcTable = vTableElement;
			while (oMdcTable && !oMdcTable.isA("sap.ui.mdc.Table")) {
				oMdcTable = oMdcTable._feMdcTableWrapper || oMdcTable.getParent();
			}
			return oMdcTable;
		}

		function _getCellIndex(vColumn, oRow) {
			var oMdcTable = _getMdcTable(oRow);
			return oMdcTable ? _getColumnIndex(vColumn, oMdcTable) : -1;
		}

		function _getTableForSelection(oRow) {
			var oUIControl = oRow,
				sTableType = oRow.getMetadata().getName() === "sap.ui.table.Row" ? "sap.ui.table.Table" : "sap.ui.mdc.Table";
			while (oUIControl && !oUIControl.isA(sTableType)) {
				oUIControl = oUIControl._feMdcTableWrapper || oUIControl.getParent();
			}
			return oUIControl;
		}

		function _getCell(oRow, iColumn) {
			var oCell;
			if (!oRow) {
				return null;
			}
			if (oRow.isA("sap.ui.mdc.table.CreationRow")) {
				oCell = oRow._oInnerCreationRow._getCell(iColumn);
			} else if (oRow.isA("sap.ui.table.CreationRow")) {
				oCell = oRow._getCell(iColumn);
			} else {
				oCell = oRow.getCells()[iColumn];
			}

			if (oCell.isA("sap.fe.macros.MacroAPI")) {
				oCell = oCell.getContent();
			}
			return oCell;
		}

		function _getCellButtonsForInlineAction(oCell, sButtonText) {
			if (oCell.isA("sap.fe.macros.MacroAPI")) {
				oCell = oCell.getContent();
			}

			var mState = {
					controlType: "sap.m.Button"
				},
				oStateMatcher;
			if (sButtonText) {
				mState.text = sButtonText;
			}
			oStateMatcher = FEBuilder.Matchers.states(mState);
			return oStateMatcher(oCell) ? [oCell] : OpaBuilder.Matchers.children(oStateMatcher)(oCell);
		}

		function _getButtonsForInlineActions(vColumn, oRow) {
			var iIndex = Number(vColumn);
			if (Number.isNaN(iIndex)) {
				return oRow.getCells().reduce(function (aPrev, oCell) {
					return aPrev.concat(_getCellButtonsForInlineAction(oCell, vColumn));
				}, []);
			}
			return _getCellButtonsForInlineAction(_getCell(oRow, iIndex));
		}

		function _getRowNavigationIconOnGridTable(oRow) {
			var oRowAction = oRow.getRowAction();
			return oRowAction.getItems().reduce(function (oIcon, oActionItem, iIndex) {
				if (!oIcon && oActionItem.getType() === RowActionType.Navigation) {
					oIcon = oRowAction.getAggregation("_icons")[iIndex];
				}
				return oIcon;
			}, null);
		}

		function _getRowMatcher(vRowMatcher) {
			var aRowMatcher = [new Interactable(), FEBuilder.Matchers.bound()];
			if (Utils.isOfType(vRowMatcher, Object)) {
				vRowMatcher = TableBuilder.Row.Matchers.cellValues(vRowMatcher);
			}
			if (vRowMatcher) {
				aRowMatcher = aRowMatcher.concat(vRowMatcher);
			}
			return aRowMatcher;
		}

		function _getInnerTable(oMdcTable) {
			return oMdcTable && oMdcTable._oTable;
		}

		function _createTableInternalButtonBuilder(oTableBuilder, sButtonSuffix, vAction, sButtonType) {
			sButtonType = sButtonType || "sap.m.Button";
			return oTableBuilder.doOpenOverflow().success(function (oTable) {
				return OpaBuilder.create()
					.hasType(sButtonType)
					.hasId(RegExp(Utils.formatMessage("-{0}$", sButtonSuffix)))
					.has(OpaBuilder.Matchers.ancestor(oTable))
					.doConditional(!!vAction, vAction)
					.execute();
			});
		}

		function _createColumnWrapper(oColumn, bGridTable) {
			return {
				getHeader: function () {
					return bGridTable
						? (oColumn.getLabel() && oColumn.getLabel().getText()) || oColumn.getName()
						: oColumn.getHeader() && oColumn.getHeader().getText();
				},
				getDataProperty: function () {
					return "$data property not available$";
				},
				getPropertyKey: function () {
					return "$data property not available$";
				}
			};
		}

		function _createTableWrapper(oInnerTable) {
			var bGridTable = oInnerTable.isA("sap.ui.table.Table"),
				oWrapper = {
					_oTable: oInnerTable,
					isA: function (sName) {
						return sName === "sap.ui.mdc.Table";
					},
					getType: function () {
						return {
							isA: function (sName) {
								return sName === (bGridTable ? "sap.ui.mdc.table.GridTableType" : "sap.ui.mdc.table.ResponsiveTableType");
							}
						};
					},
					getColumns: function () {
						return oInnerTable.getColumns().map(function (oColumn) {
							return _createColumnWrapper(oColumn, bGridTable);
						});
					},
					getRowBinding: function () {
						return oInnerTable.getBinding(_getRowAggregationName(oWrapper));
					}
				};
			oInnerTable._feMdcTableWrapper = oWrapper;
			return oWrapper;
		}

		function _showHideDetailsOnTableToolbar(bShowDetails) {
			var sStateToPress;
			if (bShowDetails !== undefined) {
				sStateToPress = bShowDetails ? "showDetails" : "hideDetails";
			}
			OpaBuilder.create()
				.hasType("sap.m.SegmentedButton")
				.hasId(/-showHideDetails$/)
				.check(function (oSegmentedButton) {
					if (bShowDetails === undefined) {
						sStateToPress = oSegmentedButton[0].getSelectedKey() === "showDetails" ? "hideDetails" : "showDetails";
					}
					return true;
				})
				.success(function (oSegmButtonControl) {
					return FEBuilder.create()
						.hasType("sap.m.SegmentedButton")
						.hasId(/-showHideDetails$/)
						.doOnAggregation("items", OpaBuilder.Matchers.properties({ key: sStateToPress }), OpaBuilder.Actions.press())
						.execute();
				})
				.execute();
		}
		function _showHideDetailsOnOverflow(bShowDetails) {
			var oRb = Opa5.getWindow().sap.ui.require("sap/ui/core/Lib").getResourceBundleFor("sap.ui.mdc"),
				sExpectedText;
			if (bShowDetails !== undefined) {
				sExpectedText = bShowDetails ? oRb.getText("table.SHOWDETAILS_TEXT") : oRb.getText("table.HIDEDETAILS_TEXT");
			}
			return (
				OpaBuilder.create()
					.hasType("sap.m.Select")
					.hasId(/-showHideDetails-select$/)
					// .has(OpaBuilder.Matchers.ancestor(oMdcTable))
					.check(function (oSelectItem) {
						if (bShowDetails === undefined) {
							sExpectedText =
								oSelectItem[0].getSelectedItem().getText() === oRb.getText("table.SHOWDETAILS_TEXT")
									? oRb.getText("table.HIDEDETAILS_TEXT")
									: oRb.getText("table.SHOWDETAILS_TEXT");
						}
						return true;
					})
					.doPress()
					.success(function (oSegmButtonControl) {
						return FEBuilder.create()
							.hasType("sap.m.SelectList")
							.isDialogElement(true)
							.has(function (oSelectListItem) {
								return true;
							})
							.has(APIHelper.createMenuAndListActionMatcher(sExpectedText, true))
							.doPress()
							.description(Utils.formatMessage("Executing action '{0}' from currently open selection list", sExpectedText))
							.execute();
					})
					.execute()
			);
		}

		function _getColumnContextToggleBuilder(ToggleButtonLabel, ToggleType) {
			return OpaBuilder.create()
				.isDialogElement()
				.hasType("sap.m.ToggleButton")
				.hasProperties({ text: ToggleButtonLabel })
				.doPress()
				.description(Utils.formatMessage(ToggleType + " column '{0}'", ToggleButtonLabel));
		}

		TableBuilder.create = function (oOpaInstance) {
			return new TableBuilder(oOpaInstance);
		};

		TableBuilder.createWrapper = function (oOpaInstance, sTableType, vTableMatcher) {
			var oBuilder = new TableBuilder(oOpaInstance).hasType(sTableType);

			if (vTableMatcher) {
				oBuilder.has(vTableMatcher);
			}

			return oBuilder.has(function (oTable) {
				return _createTableWrapper(oTable);
			});
		};

		TableBuilder.prototype = Object.create(FEBuilder.prototype);
		TableBuilder.prototype.constructor = TableBuilder;

		TableBuilder.prototype.getStatesMatcher = function (mState) {
			return TableBuilder.Matchers.states(mState);
		};

		TableBuilder.prototype.hasColumns = function (mColumnMap, bIgnoreColumnState) {
			if (!mColumnMap || Object.keys(mColumnMap).length === 0) {
				return this;
			}
			return this.has(TableBuilder.Matchers.columnsMatcher(mColumnMap, bIgnoreColumnState));
		};

		TableBuilder.prototype.hasTitle = function (sTitle) {
			return this.hasChildren(FEBuilder.create(this).hasType("sap.m.Title").hasProperties({ text: sTitle }));
		};

		TableBuilder.prototype.hasSearchField = function (sSearchText, mState) {
			var aArguments = Utils.parseArguments([String, Object], arguments);
			mState = aArguments[1];
			var oSuccessBuilder = new TableBuilder(this.getOpaInstance(), this.build()).has(
				mState && mState.visible === false && mState.present !== true,
				OpaBuilder.Matchers.not(FEBuilder.Matchers.deepAggregationMatcher("actions/action", FEBuilder.Matchers.id(/BasicSearch$/))),
				OpaBuilder.Matchers.childrenMatcher(
					FEBuilder.create(this)
						.hasType("sap.fe.macros.table.BasicSearch")
						.checkNumberOfMatches(1)
						.hasProperties(mState)
						.hasAggregation("filter", OpaBuilder.Matchers.properties(aArguments[0] ? { value: sSearchText } : {}))
				)
			);
			return this.doOpenOverflow().success(oSuccessBuilder);
		};

		TableBuilder.prototype.hasRows = function (vRowMatcher, bReturnAggregationItems) {
			vRowMatcher = _getRowMatcher(vRowMatcher);

			return bReturnAggregationItems
				? this.has(TableBuilder.Matchers.rows(vRowMatcher))
				: this.has(TableBuilder.Matchers.rowsMatcher(vRowMatcher));
		};

		TableBuilder.prototype.doOnRows = function (vRowMatcher, vRowAction) {
			if (arguments.length === 1) {
				vRowAction = vRowMatcher;
				vRowMatcher = undefined;
			}
			if (!vRowAction) {
				return this;
			}
			return this.hasRows(vRowMatcher, true).do(OpaBuilder.Actions.executor(vRowAction));
		};

		TableBuilder.prototype.doClickOnCell = function (vRowMatcher, vColumn) {
			return this.doOnRows(vRowMatcher, TableBuilder.Row.Actions.onCell(vColumn, OpaBuilder.Actions.press()));
		};
		TableBuilder.prototype.doClickOnRow = function (vRowMatcher) {
			return this.doOnRows(vRowMatcher, function (oRow) {
				if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
					var oTable = oRow.getParent(),
						oRowIndex = oTable.indexOfRow(oRow);
					return OpaBuilder.Actions.press("rows-row" + oRowIndex).executeOn(oTable);
				}
				return OpaBuilder.Actions.press().executeOn(oRow.getMultiSelectControl() || oRow.getSingleSelectControl());
			});
		};

		TableBuilder.prototype.doScroll = function (sDirection) {
			return this.do(function (oTable) {
				switch (sDirection) {
					case "up":
						oTable.scrollToIndex(0);
						break;
					case "down":
					default:
						oTable.scrollToIndex(-1);
						break;
				}
			});
		};

		TableBuilder.prototype.doPressKeyboardShortcut = function (sShortcut, vRowMatcher, vColumn) {
			// All arguments are passed -> shortcut will be executed on cell level
			if (vRowMatcher && vColumn) {
				return this.doOnRows(
					vRowMatcher,
					TableBuilder.Row.Actions.onCell(vColumn, FEBuilder.Actions.keyboardShortcut(sShortcut, "input"))
				);
			}
			// else shortcut will be executed on table level
			return this.do(FEBuilder.Actions.keyboardShortcut(sShortcut, true));
		};

		TableBuilder.prototype.doEditValues = function (vRowMatcher, mColumnValueMap, bInputNotFinalized) {
			if (arguments.length === 1) {
				mColumnValueMap = vRowMatcher;
				vRowMatcher = undefined;
			}
			return this.hasColumns(mColumnValueMap, true).doOnRows(
				vRowMatcher,
				TableBuilder.Row.Actions.editCells(mColumnValueMap, bInputNotFinalized)
			);
		};

		TableBuilder.prototype.doEditCreationRowValues = function (mColumnValueMap, bInputNotFinalized) {
			return this.hasColumns(mColumnValueMap, true)
				.has(OpaBuilder.Matchers.aggregation("creationRow"))
				.do(TableBuilder.Row.Actions.editCells(mColumnValueMap, bInputNotFinalized));
		};
		TableBuilder.prototype.doSelectValueHelpTableRows = function (vRowMatcher) {
			return this.doOnRows(vRowMatcher, function (oRow) {
				if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
					var oTable = oRow.getParent(),
						oRowIndex = oTable.indexOfRow(oRow);
					// might be table with or without checkboxes for selection
					return (
						OpaBuilder.Actions.press("rowsel" + oRowIndex).executeOn(oTable) ||
						OpaBuilder.Actions.press("rows-row" + oRowIndex).executeOn(oTable)
					);
				}
				return OpaBuilder.Actions.press().executeOn(oRow.getMultiSelectControl() || oRow.getSingleSelectControl());
			});
		};
		TableBuilder.prototype.doSelect = function (vRowMatcher) {
			return this.doOnRows(vRowMatcher, function (oRow) {
				var oTable = _getTableForSelection(oRow);
				// if several rows are selected, the table may be blocked by other events, e.g. tableRuntime.js --> setContexts
				if (oTable.getBusy()) {
					oTable.setBusy(false);
				}
				if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
					var oRowIndex = oTable.indexOfRow(oRow);
					return OpaBuilder.Actions.press("rowsel" + oRowIndex).executeOn(oTable);
				}
				return OpaBuilder.Actions.press().executeOn(oRow.getMultiSelectControl() || oRow.getSingleSelectControl());
			});
		};
		TableBuilder.prototype.doSelectAll = function () {
			return this.do(function (oTable) {
				var bIsGridTable = _isGridTable(oTable);
				if (bIsGridTable) {
					return OpaBuilder.Actions.press("selall").executeOn(oTable.getAggregation("_content"));
				}
				return OpaBuilder.Actions.press("sa").executeOn(oTable.getAggregation("_content"));
			});
		};

		TableBuilder.prototype.doNavigate = function (vRowMatcher) {
			return this.doOnRows(vRowMatcher, function (oRow) {
				if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
					return OpaBuilder.Actions.press().executeOn(_getRowNavigationIconOnGridTable(oRow));
				}
				return OpaBuilder.Actions.press("imgNav").executeOn(oRow);
			});
		};

		TableBuilder.prototype.doPressColumnHeader = function (vColumn) {
			return this.has(TableBuilder.Matchers.columnControl(vColumn)).has(FEBuilder.Matchers.singleElement()).doPress();
		};

		TableBuilder.prototype.doColumnHeaderSorting = function (vColumn, sFieldName, sSortOrder, sIcon, bClearFirst) {
			var SortingIcon = sSortOrder === SortOrder.Ascending ? "sap-icon://sort-ascending" : "sap-icon://sort-descending";

			var TriggerSortOK = OpaBuilder.create()
				.isDialogElement()
				.hasType("sap.m.Button")
				.hasProperties({ text: "OK" })
				.doPress()
				.description("Confirming the Sorting dialog");

			// Builder to clear existing sorting entries
			var DeclineSortingBuilder = OpaBuilder.create()
				.isDialogElement()
				.hasType("sap.m.Button")
				.hasProperties({ icon: "sap-icon://decline" })
				.doPress()
				.description("Removing all previous sortings");

			// Builder to check for a specific sorting entry
			var CheckSortingFieldBuilder = OpaBuilder.create(this)
				.isDialogElement()
				.hasType("sap.m.ComboBox")
				.hasProperties({ value: sFieldName });

			// Builder for changing existing sorting entries
			var ExistingSortingFieldBuilder = OpaBuilder.create(this)
				.isDialogElement()
				.hasType("sap.m.CustomListItem")
				.hasChildren(OpaBuilder.create(this).hasType("sap.m.ComboBox").hasProperties({ value: sFieldName }))
				.doOnChildren(OpaBuilder.create(this).hasType("sap.m.Button").hasProperties({ icon: SortingIcon }).doPress())
				.description(Utils.formatMessage("Change existing sorting field '{0}': {1}", sFieldName, sSortOrder))
				.success(TriggerSortOK);

			// Builder for new sorting entries
			var NewSortingFieldBuilder = OpaBuilder.create(this)
				.isDialogElement()
				.hasType("sap.m.CustomListItem")
				.hasChildren(
					OpaBuilder.create(this).hasType("sap.m.ComboBox").hasProperties({ placeholder: "Sort By" }).hasProperties({ value: "" })
				)
				.doOnChildren(
					OpaBuilder.create(this)
						.hasType("sap.m.ComboBox")
						.hasProperties({ placeholder: "Sort By" })
						.hasProperties({ value: "" })
						.doEnterText(sFieldName, true, false, true)
				)
				.doOnChildren(OpaBuilder.create(this).hasType("sap.m.Button").hasProperties({ icon: SortingIcon }).doPress())
				.description(Utils.formatMessage("Insert new sorting field '{0}': {1}", sFieldName, sSortOrder))
				.success(TriggerSortOK);

			// Builder to distinguish between inserting a new entry or changing an existing entry
			var CheckSortingPanelBuilder = OpaBuilder.create()
				.isDialogElement()
				.hasType("sap.m.p13n.SortPanel")
				.do(function () {
					if (bClearFirst) {
						DeclineSortingBuilder.execute();
					}
					if (!FEBuilder.controlsExist(CheckSortingFieldBuilder) || bClearFirst) {
						return NewSortingFieldBuilder.execute();
					} else {
						return ExistingSortingFieldBuilder.execute();
					}
				});

			// Opens the Sorting panel within the table column header context menu
			var TriggerSortingPanelBuilder = OpaBuilder.create()
				.isDialogElement()
				.hasType("sap.m.StandardListItem")
				.hasProperties({ icon: sIcon })
				.doPress()
				.description("Opening the Sorting dialog")
				.success(CheckSortingPanelBuilder);

			// Triggers the sorting by using the toggle buttons on the context menu
			var TriggerToggleBuilder = OpaBuilder.create()
				.isDialogElement()
				.hasType("sap.m.ToggleButton")
				.hasProperties({ text: sSortOrder })
				.has(function (oButton) {
					if (typeof oButton.getParent().getLabel === "function") {
						return (
							oButton.getParent().getLabel() ===
							Utils.formatMessage(oSAPMResourceBundle.getText("table.COLUMNMENU_QUICK_SORT"), sFieldName)
						);
					}
					return false;
				})
				.doPress()
				.description(Utils.formatMessage("Sorting column '{0}': {1}", vColumn, sSortOrder));

			// return this.doPressColumnHeader(vColumn).success(!sFieldName ? TriggerToggleBuilder : TriggerSortingPanelBuilder);
			return this.doPressColumnHeader(vColumn).success(bClearFirst ? TriggerToggleBuilder : TriggerSortingPanelBuilder);
		};
		TableBuilder.prototype.doSortByColumn = function (vColumn, sFieldName, sSortOrder, bClearFirst) {
			var sIcon = "sap-icon://sort";
			return this.doColumnHeaderSorting(vColumn, sFieldName, sSortOrder, sIcon, bClearFirst);
		};

		TableBuilder.prototype.doColumnHeaderGrouping = function (vColumn, sFieldName) {
			var sGroupingField = !sFieldName ? vColumn : sFieldName,
				// Triggers the grouping by using the toggle buttons on the context menu
				TriggerToggleBuilder = _getColumnContextToggleBuilder(sGroupingField, "Grouping");

			return this.doPressColumnHeader(vColumn).success(TriggerToggleBuilder);
		};
		TableBuilder.prototype.doGroupByColumn = function (vColumn, sFieldName) {
			return this.doColumnHeaderGrouping(vColumn, sFieldName);
		};

		TableBuilder.prototype.doColumnHeaderAggregating = function (vColumn, sFieldName) {
			var sAggregationField = !sFieldName ? vColumn : sFieldName,
				// Triggers the grouping by using the toggle buttons on the context menu
				TriggerToggleBuilder = _getColumnContextToggleBuilder(sAggregationField, "Aggregating");

			return this.doPressColumnHeader(vColumn).success(TriggerToggleBuilder);
		};
		TableBuilder.prototype.doAggregateByColumn = function (vColumn, sFieldName) {
			return this.doColumnHeaderAggregating(vColumn, sFieldName);
		};

		TableBuilder.prototype.doChangeSearch = function (sSearchText) {
			var oSuccessBuilder = new TableBuilder(this.getOpaInstance(), this.build()).doOnChildren(
				OpaBuilder.create(this)
					.hasType("sap.fe.macros.table.BasicSearch")
					.checkNumberOfMatches(1)
					.doOnAggregation("filter", OpaBuilder.Actions.press(), OpaBuilder.Actions.enterText(sSearchText || ""))
			);
			return this.doOpenOverflow().success(oSuccessBuilder);
		};

		TableBuilder.prototype.doResetSearch = function () {
			var oSuccessBuilder = new TableBuilder(this.getOpaInstance(), this.build()).doOnChildren(
				OpaBuilder.create(this)
					.hasType("sap.fe.macros.table.BasicSearch")
					.checkNumberOfMatches(1)
					.doOnAggregation("filter", OpaBuilder.Actions.press(), OpaBuilder.Actions.press("reset"))
			);
			return this.doOpenOverflow().success(oSuccessBuilder);
		};

		TableBuilder.prototype.checkColumnHeaderAction = function (vColumn, sActionIconName, sFieldName, iExpectedNumber, sGroupTotals) {
			var TriggerGroupingCancel = OpaBuilder.create()
				.isDialogElement()
				.hasType("sap.m.Button")
				.hasProperties({ text: "Cancel" })
				.doPress()
				.description("Cancelling the dialog");

			// Opens the Grouping panel within the table column header context menu to successfully leave the context dialog with cancel button
			var TriggerGroupingPanelBuilder = OpaBuilder.create()
				.isDialogElement()
				.hasType("sap.m.StandardListItem")
				.hasProperties({ icon: sActionIconName })
				.doPress()
				.success(TriggerGroupingCancel);

			var CheckMultipleGroupingBuilder = OpaBuilder.create()
				.isDialogElement()
				.hasType("sap.m.ToggleButton")
				.has(function (oButton) {
					if (typeof oButton.getParent().getLabel === "function") {
						return oButton.getParent().getLabel() === sGroupTotals;
					}
					return false;
				})
				.checkNumberOfMatches(iExpectedNumber)
				.success(TriggerGroupingPanelBuilder);

			var CheckSingleGroupingBuilder = OpaBuilder.create()
				.isDialogElement()
				.hasType("sap.m.ToggleButton")
				.hasProperties({ text: sFieldName })
				.has(function (oButton) {
					if (typeof oButton.getParent().getLabel === "function") {
						return oButton.getParent().getLabel() === sGroupTotals;
					}
					return false;
				})
				.checkNumberOfMatches(iExpectedNumber)
				.success(TriggerGroupingPanelBuilder);

			return this.doPressColumnHeader(vColumn).success(sFieldName ? CheckSingleGroupingBuilder : CheckMultipleGroupingBuilder);
		};
		TableBuilder.prototype.hasGroupByColumn = function (vColumn, sFieldName, iExpectedNumber) {
			return this.checkColumnHeaderAction(
				vColumn,
				"sap-icon://group-2",
				sFieldName,
				iExpectedNumber,
				oSAPMResourceBundle.getText("table.COLUMNMENU_QUICK_GROUP")
			);
		};

		TableBuilder.prototype.hasAggregationColumn = function (vColumn, sFieldName, iExpectedNumber) {
			return this.checkColumnHeaderAction(
				vColumn,
				"sap-icon://table-column",
				sFieldName,
				iExpectedNumber,
				oSAPMResourceBundle.getText("table.COLUMNMENU_QUICK_TOTAL")
			);
		};

		TableBuilder.prototype.doExpand = function (vRowMatcher) {
			return this.doOnRows(vRowMatcher, function (oRow) {
				if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
					oRow.expand();
				}
			});
		};

		TableBuilder.prototype.doCollapse = function (vRowMatcher) {
			return this.doOnRows(vRowMatcher, function (oRow) {
				if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
					oRow.collapse();
				}
			});
		};

		TableBuilder.prototype.hasOverlay = function (bHasOverlay) {
			return this.has(TableBuilder.Matchers.overlay(bHasOverlay));
		};

		TableBuilder.prototype.hasNumberOfRows = function (iNumberOfRows) {
			return this.has(function (oTable) {
				var oRowBinding = oTable.getRowBinding(),
					// when having an overlay, the table is dirty and the rows do not reflect the actual table state
					bHasOverlay = TableBuilder.Matchers.overlay(true)(oTable);
				return (
					(oRowBinding &&
						!bHasOverlay &&
						(iNumberOfRows === undefined ? oRowBinding.getLength() !== 0 : oRowBinding.getLength() === iNumberOfRows)) ||
					((!oRowBinding || bHasOverlay) && iNumberOfRows === 0)
				);
			});
		};

		TableBuilder.prototype.hasHeaderFocused = function () {
			return this.has(function (oTable) {
				var oTestCore = Opa5.getWindow().sap.ui.require("sap/ui/core/Core"),
					sFocusedEltId = oTestCore.getCurrentFocusedControlId(),
					oInnerTable = _getInnerTable(oTable);
				if (_isGridTable(oTable)) {
					return oInnerTable.getColumns()[0].getId() === sFocusedEltId;
				} else {
					return oInnerTable.getId() === sFocusedEltId;
				}
			});
		};

		TableBuilder.prototype.hasFocusOnRow = function (iRowIndex) {
			return this.has(function (oTable) {
				var oTestCore = Opa5.getWindow().sap.ui.require("sap/ui/core/Core"),
					sFocusedEltId = oTestCore.getCurrentFocusedControlId(),
					oInnerTable = _getInnerTable(oTable);
				if (_isGridTable(oTable)) {
					return sFocusedEltId.includes(oInnerTable.getRows()[iRowIndex].getId());
				} else {
					return sFocusedEltId === oInnerTable.getItems()[iRowIndex].getId();
				}
			});
		};

		TableBuilder.prototype.hasQuickFilterItems = function (iNumberOfItems) {
			return this.has(function (oTable) {
				var oQuickFilter = oTable.getQuickFilter()?.content;
				if (oQuickFilter) {
					var aItems = oQuickFilter.getItems();
					if (Utils.isOfType(aItems, Array)) {
						return aItems.length === iNumberOfItems;
					}
					return false;
				}
				return false;
			});
		};

		TableBuilder.prototype.doSelectQuickFilter = function (oItemMatcher) {
			return this.has(function (oTable) {
				return oTable.getQuickFilter().content;
			})
				.doConditional(FEBuilder.Matchers.state("controlType", "sap.m.Select"), OpaBuilder.Actions.press())
				.success(
					function (oQFControl) {
						return FEBuilder.create(this)

							.hasId([].concat(oQFControl)[0].getId())
							.doOnAggregation("items", oItemMatcher, OpaBuilder.Actions.press())
							.execute();
					}.bind(this)
				);
		};

		TableBuilder.prototype.doPressMore = function () {
			return this.do(
				function (oTable) {
					return FEBuilder.create(this).hasId(oTable._oTable.getId("trigger")).do(OpaBuilder.Actions.press()).execute();
				}.bind(this)
			);
		};

		TableBuilder.prototype.doOpenOverflow = function () {
			return OverflowToolbarBuilder.openOverflow(this, "toolbar");
		};

		TableBuilder.prototype.doCloseOverflow = function () {
			return OverflowToolbarBuilder.closeOverflow(this, "toolbar");
		};

		TableBuilder.prototype.doExecuteAction = function (vActionMatcher, vAction) {
			var oOverflowToolbarBuilder = new TableBuilder(this.getOpaInstance(), this.build()),
				fnMatcherIsTextButton = function (oControl) {
					return (
						!!oControl.getText || (oControl.isA("sap.fe.core.buildingBlocks.BuildingBlock") && !!oControl.getContent()?.getText)
					);
				},
				fnDeepAggregation = FEBuilder.Matchers.deepAggregation("actions/action", [fnMatcherIsTextButton, vActionMatcher]),
				fnGetDefaultActionButton = function (oMenuButton) {
					/* This helper function returns the default action button of a menu button (if it exists, otherwise returns null);
					 * Remark: Currently there is no official API to retrieve this button; an alternative way to achieve the same
					 * result might be to check oMenuButton.getButtonMode() === "Split" && oMenuButton.getUseDefaultActionOnly()
					 * first, and then call oMenuButton.fireDefaultAction(), but the interface parameter vAction expects
					 * a sap.m.button nonetheless. Hence, we currently use the internal aggregation names as a workaround.
					 */
					return oMenuButton.getAggregation("_button")
						? oMenuButton.getAggregation("_button").getAggregation("_textButton")
						: null;
				},
				oSuccessHandler = function () {
					oOverflowToolbarBuilder
						.has(function (oOverflowToolbar) {
							return fnDeepAggregation(oOverflowToolbar).length === 1;
						})
						.do(function (oOverflowToolbar) {
							var oToolbarButton = fnDeepAggregation(oOverflowToolbar)[0];
							if (oToolbarButton.isA("sap.fe.core.buildingBlocks.BuildingBlock")) {
								oToolbarButton = oToolbarButton.getContent();
							}
							var oButtonForAction =
								oToolbarButton.getMetadata().getName() === "sap.m.MenuButton"
									? fnGetDefaultActionButton(oToolbarButton) || oToolbarButton
									: oToolbarButton;
							OpaBuilder.Actions.executor(vAction || OpaBuilder.Actions.press())(oButtonForAction);
						})
						.execute();
				};
			return this.doOpenOverflow().success(oSuccessHandler);
		};

		TableBuilder.prototype.doClickOnMessageStripFilter = function () {
			return this.do(function (oMdcTable) {
				var oLink = oMdcTable.getDataStateIndicator()._oLink;
				return OpaBuilder.create()
					.hasType("sap.m.Link")
					.hasId(oLink.getId())
					.description("Press the messageStrip filter on Table")
					.doPress()
					.execute();
			});
		};

		TableBuilder.prototype.hasShowHideDetails = function () {
			return _createTableInternalButtonBuilder(this, "showHideDetails", false);
		};

		TableBuilder.prototype.doShowHideDetails = function (bShowDetails) {
			return this.doOpenOverflow().success(function (oMdcTable) {
				if (_isGridTable(oMdcTable)) {
					return;
				}
				OpaBuilder.create()
					.hasType("sap.m.SegmentedButton")
					.hasId(/-showHideDetails$/)
					.doConditional(
						OpaBuilder.Matchers.childrenMatcher(OpaBuilder.create(this).hasType("sap.m.Select"), true),
						function (oItem) {
							// in the overflow
							_showHideDetailsOnOverflow(bShowDetails);
							return true;
						},
						function (oItem) {
							// on the table toolbar
							_showHideDetailsOnTableToolbar(bShowDetails);
							return true;
						}
					)
					.execute();
			});
		};

		TableBuilder.prototype.hasColumnAdaptation = function () {
			return _createTableInternalButtonBuilder(this, "settings", false);
		};

		TableBuilder.prototype.doOpenColumnAdaptation = function () {
			return _createTableInternalButtonBuilder(this, "settings", OpaBuilder.Actions.press());
		};

		TableBuilder.prototype.hasColumnSorting = function () {
			return _createTableInternalButtonBuilder(this, "settings", false);
		};

		TableBuilder.prototype.doOpenColumnSorting = function () {
			return _createTableInternalButtonBuilder(this, "settings", OpaBuilder.Actions.press()).success(
				OpaBuilder.create(this.getOpaInstance())
					.isDialogElement()
					.hasType("sap.m.IconTabBar")
					.has(
						OpaBuilder.Matchers.aggregation(
							"items",
							OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "p13nDialog.TAB_Sort")
						)
					)
					.has(FEBuilder.Matchers.singleElement())
					.doPress()
					.description("Selecting Icon Tab Sort")
			);
		};

		TableBuilder.prototype.hasColumnFiltering = function () {
			return _createTableInternalButtonBuilder(this, "filter", false);
		};

		TableBuilder.prototype.doOpenColumnFiltering = function () {
			return _createTableInternalButtonBuilder(this, "settings", OpaBuilder.Actions.press()).success(
				OpaBuilder.create(this.getOpaInstance())
					.isDialogElement()
					.hasType("sap.m.IconTabBar")
					.has(
						OpaBuilder.Matchers.aggregation(
							"items",
							OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "p13nDialog.TAB_Filter")
						)
					)
					.has(FEBuilder.Matchers.singleElement())
					.doPress()
					.description("Selecting Icon Tab Filter")
			);
		};

		TableBuilder.prototype.hasExport = function () {
			return _createTableInternalButtonBuilder(this, "export", false, "sap.m.MenuButton");
		};

		TableBuilder.prototype.hasPaste = function () {
			return _createTableInternalButtonBuilder(this, "paste", false, "sap.m.OverflowToolbarButton");
		};

		TableBuilder.prototype.doExecuteInlineAction = function (vRowMatcher, vColumn) {
			return this.doOnRows(vRowMatcher, TableBuilder.Row.Actions.pressInlineAction(vColumn));
		};

		TableBuilder.prototype.doPasteData = function (aData) {
			return this.do(function (oMdcTable) {
				oMdcTable.firePaste({ data: aData });
			});
		};

		TableBuilder.createAdaptationDialogBuilder = function (oOpaInstance) {
			return DialogBuilder.create(oOpaInstance).hasSome(
				OpaBuilder.Matchers.resourceBundle("title", "sap.ui.mdc", "table.SETTINGS_COLUMN"),
				OpaBuilder.Matchers.resourceBundle("title", "sap.ui.mdc", "p13nDialog.VIEW_SETTINGS")
			);
		};

		TableBuilder.createSortingDialogBuilder = function (oOpaInstance) {
			return DialogBuilder.create(oOpaInstance)
				.has(OpaBuilder.Matchers.resourceBundle("title", "sap.ui.mdc", "p13nDialog.VIEW_SETTINGS"))
				.hasChildren(
					OpaBuilder.create(oOpaInstance)
						.hasType("sap.m.IconTabFilter")
						.has(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "p13nDialog.TAB_Sort"))
				);
		};

		TableBuilder.createFilteringDialogBuilder = function (oOpaInstance) {
			return DialogBuilder.create(oOpaInstance)
				.has(OpaBuilder.Matchers.resourceBundle("title", "sap.ui.mdc", "p13nDialog.VIEW_SETTINGS"))
				.hasChildren(
					OpaBuilder.create(oOpaInstance)
						.hasType("sap.m.IconTabFilter")
						.has(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "p13nDialog.TAB_Filter"))
				);
		};

		TableBuilder.Cell = {
			Matchers: {
				state: function (sName, vValue) {
					switch (sName) {
						case "editor":
						case "editors":
							return function (oCell) {
								return MacroFieldBuilder.Matchers.states(vValue)(oCell);
							};
						default:
							return FEBuilder.Matchers.state(sName, vValue);
					}
				},
				states: function (mStateMap) {
					return FEBuilder.Matchers.states(mStateMap, TableBuilder.Cell.Matchers.state);
				}
			}
		};

		TableBuilder.Column = {
			Matchers: {
				state: function (sName, vValue) {
					switch (sName) {
						case "sortOrder":
							return TableBuilder.Column.Matchers.sortOrder(vValue);
						case "template":
						case "creationTemplate":
							return function (oColumn) {
								return MacroFieldBuilder.Matchers.states(vValue)(oColumn.getAggregation(sName));
							};
						case "importance":
							return TableBuilder.Column.Matchers.importance(vValue);
						default:
							return FEBuilder.Matchers.state(sName, vValue);
					}
				},
				states: function (mStateMap) {
					return FEBuilder.Matchers.states(mStateMap, TableBuilder.Column.Matchers.state);
				},
				sortOrder: function (sSortOrder) {
					return function (oMdcColumn) {
						var oMdcTable = oMdcColumn.getParent(),
							bIsGridTable = _isGridTable(oMdcTable),
							mProperties = {};

						if (bIsGridTable) {
							mProperties.sorted = sSortOrder === SortOrder.None ? false : true;
							if (sSortOrder !== SortOrder.None) {
								mProperties.sortOrder = sSortOrder;
							}
						} else {
							mProperties.sortIndicator = sSortOrder;
						}

						return FEBuilder.controlsExist(
							FEBuilder.create()
								.hasId(oMdcColumn.getId() + "-innerColumn")
								.hasProperties(mProperties)
						);
					};
				},
				importance: function (sImportance) {
					return function (oMdcColumn) {
						return oMdcColumn.getExtendedSettings().getImportance() === sImportance;
					};
				}
			}
		};

		TableBuilder.Row = {
			Matchers: {
				cell: function (vColumn) {
					return function (oRow) {
						var iColumn = _getCellIndex(vColumn, oRow);
						return _getCell(oRow, iColumn);
					};
				},
				cellValue: function (vColumn, vExpectedValue) {
					return function (oRow) {
						if (oRow.isA("sap.m.GroupHeaderListItem")) {
							// don´t check grouping rows
							return null;
						}
						var oCellField = TableBuilder.Row.Matchers.cell(vColumn)(oRow);
						while (oCellField.isA("sap.fe.macros.MacroAPI")) {
							oCellField = oCellField.getContent();
						}

						return MacroFieldBuilder.Matchers.value(vExpectedValue)(oCellField);
					};
				},
				cellValues: function (mColumnValueMap) {
					if (!mColumnValueMap) {
						return OpaBuilder.Matchers.TRUE;
					}
					return FEBuilder.Matchers.match(
						Object.keys(mColumnValueMap).map(function (sColumnName) {
							return TableBuilder.Row.Matchers.cellValue(sColumnName, mColumnValueMap[sColumnName]);
						})
					);
				},
				hiddenCell: function (sColumnName) {
					return function (oRow) {
						var oCellField = TableBuilder.Row.Matchers.cell(sColumnName)(oRow);
						while (oCellField.isA("sap.fe.macros.MacroAPI")) {
							oCellField = oCellField.getContent();
						}

						return MacroFieldBuilder.Matchers.empty(oCellField);
					};
				},
				hiddenCells: function (vColumn) {
					if (!vColumn || vColumn.length === 0) {
						return OpaBuilder.Matchers.TRUE;
					}
					return FEBuilder.Matchers.match(
						vColumn.map(function (sColumnName) {
							return TableBuilder.Row.Matchers.hiddenCell(sColumnName);
						})
					);
				},
				cellProperty: function (vColumn, oExpectedState) {
					return function (oRow) {
						var oCell = TableBuilder.Row.Matchers.cell(vColumn)(oRow);
						while (oCell.isA("sap.fe.macros.MacroAPI")) {
							oCell = oCell.getContent();
						}
						return TableBuilder.Cell.Matchers.states(oExpectedState)(oCell);
					};
				},
				cellProperties: function (mCellStateMap) {
					if (!mCellStateMap) {
						return OpaBuilder.Matchers.TRUE;
					}
					return FEBuilder.Matchers.match(
						Object.keys(mCellStateMap).map(function (sColumnName) {
							return TableBuilder.Row.Matchers.cellProperty(sColumnName, mCellStateMap[sColumnName]);
						})
					);
				},
				selected: function (bSelected) {
					return function (oRow) {
						var oTable = oRow.getParent(),
							oMdcTable = oTable.getParent(),
							bIsGridTable = _isGridTable(oMdcTable),
							bRowIsSelected = bIsGridTable
								? oMdcTable.getSelectedContexts().includes(oRow.getBindingContext())
								: oRow.getSelected();

						return bSelected ? bRowIsSelected : !bRowIsSelected;
					};
				},
				navigated: function (bNavigated) {
					return function (oRow) {
						var bRowIsNavigated;

						if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
							bRowIsNavigated = oRow.getAggregation("_settings").getNavigated();
						} else {
							bRowIsNavigated = oRow.getNavigated();
						}
						return bNavigated ? bRowIsNavigated : !bRowIsNavigated;
					};
				},
				focused: function () {
					return function (oRow) {
						var aElementsToCheck = [oRow];
						if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
							aElementsToCheck.push(_getRowNavigationIconOnGridTable(oRow));
						}
						return aElementsToCheck.some(OpaBuilder.Matchers.focused(true));
					};
				},
				highlighted: function (sHighlight) {
					return function (oRow) {
						var sRowHighlight;

						if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
							sRowHighlight = oRow.getAggregation("_settings").getHighlight();
						} else {
							sRowHighlight = oRow.getHighlight();
						}
						return sHighlight === sRowHighlight;
					};
				},
				isDraft: function (bIsDraft) {
					var draftMatcher = OpaBuilder.Matchers.childrenMatcher(function (oRowChild) {
						return oRowChild.isA("sap.m.ObjectMarker");
					}, false);

					if (bIsDraft) {
						return draftMatcher;
					} else {
						return OpaBuilder.Matchers.not(draftMatcher);
					}
				},
				states: function (mStateMap) {
					if (!Utils.isOfType(mStateMap, Object)) {
						return OpaBuilder.Matchers.TRUE;
					}
					return FEBuilder.Matchers.match(
						Object.keys(mStateMap).map(function (sProperty) {
							switch (sProperty) {
								case "selected":
									return TableBuilder.Row.Matchers.selected(mStateMap.selected);
								case "focused":
									return TableBuilder.Row.Matchers.focused();
								case "navigated":
									return TableBuilder.Row.Matchers.navigated(mStateMap.navigated);
								case "highlight":
									return TableBuilder.Row.Matchers.highlighted(mStateMap.highlight);
								case "isDraft":
									return TableBuilder.Row.Matchers.isDraft(mStateMap.isDraft);
								default:
									return FEBuilder.Matchers.state(sProperty, mStateMap[sProperty]);
							}
						})
					);
				},
				visualGroup: function (iLevel, sTitle) {
					return function (oRow) {
						if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
							return oRow.getLevel() === iLevel && oRow.getTitle() === sTitle;
						} else {
							return false; // Visual grouping not supported in responsive table yet
						}
					};
				}
			},
			Actions: {
				onCell: function (vColumn, vCellAction) {
					return function (oRow) {
						var iColumn = _getCellIndex(vColumn, oRow),
							oCellControl = _getCell(oRow, iColumn);

						// if the cellControl is a FieldWrapper replace it by its active control (edit or display)
						if (oCellControl.isA("sap.fe.macros.controls.FieldWrapper")) {
							oCellControl =
								oCellControl.getEditMode() === "Display"
									? oCellControl.getContentDisplay()
									: oCellControl.getContentEdit()[0];
						}
						if (oCellControl.isA("sap.m.VBox")) {
							oCellControl =
								oCellControl.getItems()[0].getContent().getEditMode() === "Display"
									? oCellControl.getItems()[0].getContent().getContentDisplay()
									: oCellControl.getItems()[0].getContent().getContentEdit()[0];
						}
						if (oCellControl.isA("sap.fe.macros.controls.ConditionalWrapper")) {
							oCellControl = oCellControl.getCondition() ? oCellControl.getContentTrue() : oCellControl.getContentFalse();
						}

						// Collaboration case: the field is wrapped in a HBox with an avatar
						if (
							oCellControl.isA("sap.m.HBox") &&
							oCellControl.getItems().length === 2 &&
							oCellControl.getItems()[1].isA("sap.m.Avatar")
						) {
							oCellControl = oCellControl.getItems()[0];
						}

						if (vCellAction.executeOn) {
							vCellAction.executeOn(oCellControl);
						} else {
							vCellAction(oCellControl);
						}
					};
				},
				editCell: function (vColumn, vValue, bInputNotFinalized) {
					return TableBuilder.Row.Actions.onCell(
						vColumn,
						new EnterText({
							text: vValue,
							clearTextFirst: true,
							keepFocus: bInputNotFinalized ? true : false,
							idSuffix: null,
							pressEnterKey: bInputNotFinalized ? false : true
						})
					);
				},
				editCells: function (mColumnValueMap, bInputNotFinalized) {
					return Object.keys(mColumnValueMap).map(function (sColumnName) {
						return TableBuilder.Row.Actions.editCell(sColumnName, mColumnValueMap[sColumnName], bInputNotFinalized);
					});
				},
				onCellInlineAction: function (vColumn, vCellAction) {
					return function (oRow) {
						var aButtons = _getButtonsForInlineActions(vColumn, oRow);
						return OpaBuilder.Actions.executor(vCellAction)(aButtons);
					};
				},
				pressInlineAction: function (vColumn) {
					return TableBuilder.Row.Actions.onCellInlineAction(vColumn, OpaBuilder.Actions.press());
				}
			}
		};

		TableBuilder.Matchers = {
			isGridTable: function () {
				return _isGridTable;
			},
			rows: function (vRowMatcher) {
				return function (oMdcTable) {
					// when having an overlay, the table is dirty and the rows do not reflect the actual table state
					if (TableBuilder.Matchers.overlay(true)(oMdcTable)) {
						return [];
					}
					return OpaBuilder.Matchers.aggregation(_getRowAggregationName(oMdcTable), vRowMatcher)(oMdcTable._oTable);
				};
			},
			rowsMatcher: function (vRowMatcher) {
				var fnMatchRows = TableBuilder.Matchers.rows(vRowMatcher);
				return function (oMdcTable) {
					return fnMatchRows(oMdcTable).length > 0;
				};
			},
			columnControl: function (vColumn) {
				return function (oMdcTable) {
					var iColumnIndex = _getColumnIndex(vColumn, oMdcTable),
						oInnerTable = _getInnerTable(oMdcTable);
					return oInnerTable.getColumns()[iColumnIndex];
				};
			},
			column: function (vColumn, mStates) {
				return function (oMdcTable) {
					var iColumnIndex = _getColumnIndex(vColumn, oMdcTable),
						aColumns = Utils.getAggregation(oMdcTable, "columns");
					if (iColumnIndex === -1) {
						// check for non-existing columns 'false' - add 'null' in case there is no column on purpose
						if (mStates && mStates.visible === false) {
							return true;
						}
					} else {
						var oColumn = aColumns[iColumnIndex];
						if (!mStates || FEBuilder.Matchers.match(TableBuilder.Column.Matchers.states(mStates))(oColumn)) {
							return oColumn;
						}
					}
					return false;
				};
			},
			columns: function (mColumnsStatesMaps, bIgnoreColumnState) {
				return function (oMdcTable) {
					return Object.keys(mColumnsStatesMaps).reduce(function (aResult, vColumn) {
						var oColumn = TableBuilder.Matchers.column(
							vColumn,
							bIgnoreColumnState ? undefined : mColumnsStatesMaps[vColumn]
						)(oMdcTable);
						if (oColumn) {
							aResult.push(oColumn === true ? null : oColumn);
						}
						return aResult;
					}, []);
				};
			},
			columnsMatcher: function (mColumnMatchers, bIgnoreColumnState) {
				var fnMatchColumns = TableBuilder.Matchers.columns(mColumnMatchers, bIgnoreColumnState);
				return function (oMdcTable) {
					return fnMatchColumns(oMdcTable).length === Object.keys(mColumnMatchers).length;
				};
			},
			overlay: function (bHasOverlay) {
				if (bHasOverlay === undefined) {
					bHasOverlay = true;
				}
				return function (oMdcTable) {
					oMdcTable = oMdcTable._feMdcTableWrapper || oMdcTable;
					return oMdcTable && oMdcTable._oTable.getShowOverlay() === bHasOverlay;
				};
			},
			state: function (sName, vValue) {
				switch (sName) {
					case "overlay":
						return TableBuilder.Matchers.overlay(vValue);
					default:
						return FEBuilder.Matchers.state(sName, vValue);
				}
			},
			states: function (mStateMap) {
				return FEBuilder.Matchers.states(mStateMap, TableBuilder.Matchers.state);
			}
		};

		TableBuilder.Actions = {};

		return TableBuilder;
	}
);
