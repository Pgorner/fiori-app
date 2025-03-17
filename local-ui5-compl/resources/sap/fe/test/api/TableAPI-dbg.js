/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"./BaseAPI",
		"sap/fe/test/Utils",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/MdcTableBuilder",
		"sap/ui/test/OpaBuilder",
		"sap/ui/test/actions/Action",
		"sap/ui/core/library",
		"sap/ui/test/Opa5"
	],
	function (BaseAPI, Utils, FEBuilder, TableBuilder, OpaBuilder, Action, library, Opa5) {
		"use strict";

		var SortOrder = library.SortOrder;

		/**
		 * A column identifier
		 * @typedef {object} ColumnIdentifier
		 * @property {string} name The technical name of the column
		 * @name sap.fe.test.api.ColumnIdentifier
		 * @public
		 */

		/**
		 * Constructs a new TableAPI instance.
		 * @param {sap.fe.test.builder.TableBuilder} oTableBuilder The builder instance used to interact with the UI
		 * @param {string} [vTableDescription] Description (optional) of the table to be used for logging messages
		 * @returns {sap.fe.test.api.TableAPI} The new instance
		 * @alias sap.fe.test.api.TableAPI
		 * @class
		 * @hideconstructor
		 * @public
		 */
		var TableAPI = function (oTableBuilder, vTableDescription) {
			if (!Utils.isOfType(oTableBuilder, TableBuilder)) {
				throw new Error("oTableBuilder parameter must be an TableBuilder instance");
			}
			return BaseAPI.call(this, oTableBuilder, vTableDescription);
		};
		TableAPI.prototype = Object.create(BaseAPI.prototype);
		TableAPI.prototype.constructor = TableAPI;

		TableAPI.createRowMatchers = function (vRowValues, mRowState, vAdditionalMatchers, vHiddenCells) {
			var aArguments = Utils.parseArguments([[Object, Number], Object, [Array, Function], Array], arguments),
				aRowMatchers = [];
			if (Utils.isOfType(aArguments[0], Object)) {
				aRowMatchers.push(TableBuilder.Row.Matchers.cellValues(aArguments[0]));
			} else if (Utils.isOfType(aArguments[0], Number)) {
				aRowMatchers.push(function (oRow) {
					var oRowParent = oRow.getParent(),
						sParentAggregation = oRow.sParentAggregationName;
					return oRowParent && sParentAggregation
						? oRowParent.getAggregation(sParentAggregation).indexOf(oRow) === aArguments[0]
						: false;
				});
			}
			if (Utils.isOfType(aArguments[1], Object)) {
				aRowMatchers.push(TableBuilder.Row.Matchers.states(aArguments[1]));
			}
			if (!Utils.isOfType(aArguments[3], [null, undefined])) {
				aRowMatchers.push(TableBuilder.Row.Matchers.hiddenCells(aArguments[3]));
			}
			if (!Utils.isOfType(aArguments[2], [null, undefined])) {
				aRowMatchers = aRowMatchers.concat(aArguments[2]);
			}
			return aRowMatchers;
		};

		TableAPI.prototype.createGroupRowMatchers = function (iLevel, sTitle) {
			return [TableBuilder.Row.Matchers.visualGroup(iLevel, sTitle)];
		};

		/**
		 * Opens the column adaptation dialog of the table.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		TableAPI.prototype.iOpenColumnAdaptation = function () {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.doOpenColumnAdaptation()
					.description(
						Utils.formatMessage("Opening the column adaptation dialog for '{0}' (if not open yet)", this.getIdentifier())
					)
					.execute()
			);
		};

		/**
		 * Confirms and closes the adaptation dialog of the table.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		TableAPI.prototype.iConfirmColumnAdaptation = function () {
			return this.prepareResult(
				TableBuilder.createAdaptationDialogBuilder(this.getOpaInstance())
					.doPressFooterButton(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "p13nDialog.OK"))
					.description(
						Utils.formatMessage("Confirming the column adaptation dialog for '{0}' (if currently open)", this.getIdentifier())
					)
					.execute()
			);
		};

		/**
		 * Opens the sorting dialog of the table.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		TableAPI.prototype.iOpenColumnSorting = function () {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.doOpenColumnSorting()
					.description(Utils.formatMessage("Opening the column sorting dialog for '{0}' (if not open yet)", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Confirms and closes the sorting dialog of the table.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		TableAPI.prototype.iConfirmColumnSorting = function () {
			return this.prepareResult(
				TableBuilder.createSortingDialogBuilder(this.getOpaInstance())
					.doPressFooterButton(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "p13nDialog.OK"))
					.description(
						Utils.formatMessage("Closing the column sorting dialog for '{0}' (if currently open)", this.getIdentifier())
					)
					.execute()
			);
		};

		/**
		 * Opens the filtering dialog of the table.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		TableAPI.prototype.iOpenFilterDialog = function () {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.doOpenColumnFiltering()
					.description(Utils.formatMessage("Opening the filter dialog for '{0}' (if not open yet)", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Confirms and closes the filtering dialog of the table.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		TableAPI.prototype.iConfirmFilterDialog = function () {
			return this._iConfirmFilterDialogWithQueryPanel();
		};

		TableAPI.prototype._iConfirmFilterDialogWithQueryPanel = function () {
			var sTableId = this.getIdentifier(),
				oFilterDialogBuilder = TableBuilder.createFilteringDialogBuilder(this.getOpaInstance()).hasChildren(
					OpaBuilder.create().hasType("sap.m.ComboBox")
				),
				oComboBoxBuilder = OpaBuilder.create(this.getOpaInstance()).isDialogElement().hasType("sap.m.ComboBox");
			return this.prepareResult(
				FEBuilder.create(this.getOpaInstance())
					.success(function () {
						if (FEBuilder.controlsExist(oComboBoxBuilder)) {
							oFilterDialogBuilder
								.doPressFooterButton(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "p13nDialog.OK"))
								.description(Utils.formatMessage("Closing the filter dialog for '{0}' (if currently open)", sTableId))
								.execute();
						}
					})
					.execute()
			);
		};

		TableAPI.prototype._iConfirmFilterDialogWithListPanel = function () {
			return this.prepareResult(
				TableBuilder.createFilteringDialogBuilder(this.getOpaInstance())
					.doPressFooterButton(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "p13nDialog.OK"))
					.description(Utils.formatMessage("Closing the filter dialog for '{0}' (if currently open)", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Helper method to personalize table, to select a columns from the combo box on the filter dialog.
		 * @param {string | sap.fe.test.api.ColumnIdentifier} vColumnIdentifier The identifier provided
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @ui5-restricted
		 */
		TableAPI.prototype.selectColumnOnFilterDialog = function (vColumnIdentifier) {
			var sTableId = this.getIdentifier().id,
				oComboBox,
				// TODO: Remove this temporary workaround when obsolete
				fnItemKeyCleansing = function (sKey) {
					return sKey.startsWith("Property::") ? sKey.split("::")[1] : sKey;
				},
				oColumnListBuilder = FEBuilder.create(this.getOpaInstance()).hasType("sap.m.ComboBox").isDialogElement(),
				oColumnBuilder = TableBuilder.createFilteringDialogBuilder(this.getOpaInstance())
					.has(OpaBuilder.Matchers.children(oColumnListBuilder))
					.has(function (aMatchingComboBoxes) {
						if (aMatchingComboBoxes.length !== 1) {
							throw Error(Utils.formatMessage("Cannot open filtering dialog of table '{0}'", sTableId));
						}
						oComboBox = aMatchingComboBoxes[0];
						return oComboBox.getItems();
					}),
				oColumnMatcher = function (aFoundComboBoxItems) {
					var fnFindColumn = Utils.isOfType(vColumnIdentifier, String)
						? function (oItem) {
								return oItem.getText() === vColumnIdentifier;
						  }
						: function (oItem) {
								return fnItemKeyCleansing(oItem.getKey()) === vColumnIdentifier.name;
						  };
					return aFoundComboBoxItems.filter(fnFindColumn);
				};
			return this.prepareResult(
				oColumnBuilder
					.has(oColumnMatcher)
					.do(function (aMatchingItems) {
						if (aMatchingItems.length === 0) {
							throw Error(Utils.formatMessage("Cannot open filter field '{0}'", vColumnIdentifier));
						}
						var oItemToSelect = aMatchingItems[0],
							sItemText = oItemToSelect.getText();
						OpaBuilder.Actions.executor(OpaBuilder.Actions.enterText(sItemText, false, false, true))(oComboBox);
					})
					.execute()
			);
		};

		/**
		 * Helper method to personalize table, either adapt columns or filter. If no actions are given, this function can be used for checking only.
		 * During execution it checks for an already open dialog. If it does not exist, it is opened before
		 * the check/interaction of the columns, and closed/confirmed directly afterwards.
		 * @param {string | sap.fe.test.api.ColumnIdentifier} vColumnIdentifier The field identifier
		 * @param {object} [mState] The state of the personalization field. The following states are supported:
		 * <code><pre>
		 * 	{
		 * 		selected: true|false
		 * 	}
		 * </pre></code>
		 * @param {Function|Array|sap.ui.test.actions.Action} [vActions] The actions to be executed on found field
		 * @param {string} sDescription The description of the check or adaptation
		 * @param {sap.ui.test.OpaBuilder} oDialogBuilder The dialog builder
		 * @param {Function} fnOpenDialog A callback for opening the dialog
		 * @param {Function} fnCloseDialog A callback for closing the dialog
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @ui5-restricted
		 */
		TableAPI.prototype.personalization = function (
			vColumnIdentifier,
			mState,
			vActions,
			sDescription,
			oDialogBuilder,
			fnOpenDialog,
			fnCloseDialog
		) {
			var aArguments = Utils.parseArguments(
					[[String, Object], Object, [Function, Array, Action], String, OpaBuilder, Function, Function],
					arguments
				),
				oBuilder = FEBuilder.create(this.getOpaInstance()),
				bDialogOpen,
				oAdaptColumnBuilder = FEBuilder.create(this.getOpaInstance()).hasType("sap.m.ColumnListItem").isDialogElement();

			oDialogBuilder = aArguments[4];
			fnOpenDialog = aArguments[5];
			fnCloseDialog = aArguments[6];

			vColumnIdentifier = aArguments[0];
			if (Utils.isOfType(vColumnIdentifier, String)) {
				// oAdaptColumnBuilder.has(OpaBuilder.Matchers.bindingProperties(BaseAPI.MDC_P13N_MODEL, { label: vColumnIdentifier }));
				oAdaptColumnBuilder.hasSome(
					OpaBuilder.Matchers.bindingProperties(BaseAPI.MDC_P13N_MODEL, { label: vColumnIdentifier }),
					OpaBuilder.Matchers.bindingProperties(BaseAPI.MDC_P13N_MODEL, { name: vColumnIdentifier })
				);
			} else {
				oAdaptColumnBuilder.has(
					OpaBuilder.Matchers.bindingProperties(BaseAPI.MDC_P13N_MODEL, {
						name: vColumnIdentifier.name
					})
				);
			}

			mState = aArguments[1];
			var bCheckForNotVisible = mState && mState.visible === false;
			if (!bCheckForNotVisible && !Utils.isOfType(mState, [null, undefined])) {
				oAdaptColumnBuilder.hasState(mState);
			}

			vActions = aArguments[2];
			if (!Utils.isOfType(vActions, [null, undefined])) {
				oDialogBuilder.do(vActions);
			}

			sDescription = aArguments[3];
			return this.prepareResult(
				oBuilder
					.success(function () {
						bDialogOpen = FEBuilder.controlsExist(oDialogBuilder);
						if (!bDialogOpen) {
							fnOpenDialog();
							oDialogBuilder.success(fnCloseDialog);
						}
						return oDialogBuilder
							.has(OpaBuilder.Matchers.children(oAdaptColumnBuilder))
							.has(function (aFoundAdaptationColumns) {
								if (bCheckForNotVisible) {
									return aFoundAdaptationColumns.length === 0;
								}
								return FEBuilder.Matchers.atIndex(0)(aFoundAdaptationColumns);
							})
							.description(sDescription)
							.execute();
					})
					.execute()
			);
		};
		/**
		 * Helper method to adapt the sorting of a table. If no actions are given, this function can be used for checking only.
		 * During execution it checks for an already open dialog. If it does not exist, it is opened before
		 * the check/interaction of the columns, and closed/confirmed directly afterwards.
		 * @param {string | sap.fe.test.api.ColumnIdentifier} vColumnIdentifier The field identifier
		 * @param {object} [mState] The state of the personalization field. The following states are supported:
		 * <code><pre>
		 * 	{
		 * 		sortOrder: SortOrder.Ascending|SortOrder.Descending|SortOrder.None
		 * 	}
		 * </pre></code>
		 * @param {Function|Array|sap.ui.test.actions.Action} [vActions] The actions to be executed on found field
		 * @param {string} sDescription The description of the check or adaptation
		 * @param {sap.ui.test.OpaBuilder} oDialogBuilder The dialog builder
		 * @param {Function} fnOpenDialog A callback for opening the dialog
		 * @param {Function} fnCloseDialog A callback for closing the dialog
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @ui5-restricted
		 */
		TableAPI.prototype.sortingPersonalization = function (
			vColumnIdentifier,
			mState,
			vActions,
			sDescription,
			oDialogBuilder,
			fnOpenDialog,
			fnCloseDialog
		) {
			var aArguments = Utils.parseArguments(
					[[String, Object], Object, [Function, Array, Action], String, OpaBuilder, Function, Function],
					arguments
				),
				oBuilder = FEBuilder.create(this.getOpaInstance()),
				bDialogOpen,
				oAdaptColumnBuilder = FEBuilder.create(this.getOpaInstance()).hasType("sap.m.CustomListItem").isDialogElement(),
				oNoneColumnMatcher = OpaBuilder.Matchers.childrenMatcher(
					OpaBuilder.create().hasType("sap.m.ComboBox").hasProperties({ placeholder: "Sort By" })
				),
				oTargetColumnMatcher;

			oDialogBuilder = aArguments[4];
			fnOpenDialog = aArguments[5];
			fnCloseDialog = aArguments[6];

			vColumnIdentifier = aArguments[0];
			if (Utils.isOfType(vColumnIdentifier, String)) {
				oTargetColumnMatcher = OpaBuilder.Matchers.childrenMatcher(
					OpaBuilder.create(this.getOpaInstance())
						.hasType("sap.m.ComboBox")
						.has(function (oSelectControl) {
							return oSelectControl.getSelectedItem()
								? oSelectControl.getSelectedItem().getText() === vColumnIdentifier
								: false;
						})
				);
			} else {
				oTargetColumnMatcher = OpaBuilder.Matchers.childrenMatcher(
					OpaBuilder.create(this.getOpaInstance())
						.hasType("sap.m.ComboBox")
						.hasProperties({ selectedKey: vColumnIdentifier.name })
				);
			}

			mState = aArguments[1];
			var bCheckForNotVisible = mState && mState.visible === false;

			oDialogBuilder
				.has(OpaBuilder.Matchers.children(oAdaptColumnBuilder))
				.has(function (aCustomListItems) {
					var aMatchingListItems = OpaBuilder.Matchers.filter(oTargetColumnMatcher)(aCustomListItems);
					if (aMatchingListItems.length) {
						return aMatchingListItems;
					}
					return OpaBuilder.Matchers.filter(oNoneColumnMatcher)(aCustomListItems);
				})
				.has(function (aFoundAdaptationColumns) {
					if (bCheckForNotVisible) {
						return aFoundAdaptationColumns.length === 0;
					}
					return FEBuilder.Matchers.atIndex(0)(aFoundAdaptationColumns);
				});

			if (!bCheckForNotVisible && !Utils.isOfType(mState, [null, undefined])) {
				if (mState.sortOrder) {
					var sSortOrder = mState.sortOrder;
					delete mState.sortOrder;
					oDialogBuilder.hasChildren(
						OpaBuilder.create()
							.hasType("sap.m.SegmentedButton")
							.has(function (oSegmentedButton) {
								if (sSortOrder === SortOrder.None) {
									return !oSegmentedButton.enabled;
								}
								return oSegmentedButton.getSelectedKey() === (sSortOrder === SortOrder.Ascending ? "asc" : "desc");
							})
					);
				}
				//oDialogBuilder.hasState(mState);
			}

			vActions = aArguments[2];
			if (!Utils.isOfType(vActions, [null, undefined])) {
				oDialogBuilder.do(vActions);
			}

			sDescription = aArguments[3];
			return this.prepareResult(
				oBuilder
					.success(function () {
						bDialogOpen = FEBuilder.controlsExist(oDialogBuilder);
						if (!bDialogOpen) {
							fnOpenDialog();
							oDialogBuilder.success(fnCloseDialog);
						}
						return oDialogBuilder.description(sDescription).execute();
					})
					.execute()
			);
		};
		/**
		 * Helper method to adapt columns fields. If no actions are given, this function can be used for checking only.
		 * During execution it checks for an already open adaptation dialog. If it does not exist, it is opened before
		 * the check/interaction of the columns, and closed/confirmed directly afterwards.
		 * @param {string | sap.fe.test.api.ColumnIdentifier} vColumnIdentifier The identifier of the column
		 * @param {object} [mState] Defines the state of the adaptation column
		 * @param {Function|Array|sap.ui.test.actions.Action} [vActions] The actions to be executed on found adaptation field
		 * @param {string} sDescription The description of the check or adaptation
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @ui5-restricted
		 */
		TableAPI.prototype.columnAdaptation = function (vColumnIdentifier, mState, vActions, sDescription) {
			return this.personalization(
				vColumnIdentifier,
				mState,
				vActions,
				sDescription,
				TableBuilder.createAdaptationDialogBuilder(this.getOpaInstance()),
				this.iOpenColumnAdaptation.bind(this),
				this.iConfirmColumnAdaptation.bind(this)
			);
		};

		/**
		 * Helper method to sort columns fields. If no actions are given, this function can be used for checking only.
		 * During execution it checks for an already open sorting dialog. If it does not exist, it is opened before
		 * the check/interaction of the columns, and closed/confirmed directly afterwards.
		 * @param {string | sap.fe.test.api.ColumnIdentifier} vColumnIdentifier The identifier of the column
		 * @param {object} [mState] Defines the state of the adaptation column
		 * @param {Function|Array|sap.ui.test.actions.Action} [vActions] The actions to be executed on found adaptation field
		 * @param {string} sDescription The description of the check or adaptation
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @ui5-restricted
		 */
		TableAPI.prototype.columnSorting = function (vColumnIdentifier, mState, vActions, sDescription) {
			return this.sortingPersonalization(
				vColumnIdentifier,
				mState,
				vActions,
				sDescription,
				TableBuilder.createSortingDialogBuilder(this.getOpaInstance()),
				this.iOpenColumnSorting.bind(this),
				this.iConfirmColumnSorting.bind(this)
			);
		};

		return TableAPI;
	}
);
