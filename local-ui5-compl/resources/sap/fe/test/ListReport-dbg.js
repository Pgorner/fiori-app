/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"sap/fe/test/Utils",
		"./TemplatePage",
		"sap/ui/test/Opa5",
		"sap/ui/test/OpaBuilder",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/MacroFieldBuilder",
		"sap/fe/test/builder/VMBuilder",
		"sap/fe/test/builder/OverflowToolbarBuilder",
		"sap/fe/test/builder/KPIBuilder",
		"sap/fe/test/api/FooterActionsBase",
		"sap/fe/test/api/FooterAssertionsBase",
		"sap/fe/test/api/HeaderActionsLR",
		"sap/fe/test/api/HeaderAssertionsLR",
		"sap/fe/test/api/KPICardAssertions",
		"sap/fe/test/api/KPICardActions",
		"sap/ui/core/Lib"
	],
	function (
		Utils,
		TemplatePage,
		Opa5,
		OpaBuilder,
		FEBuilder,
		FieldBuilder,
		VMBuilder,
		OverflowToolbarBuilder,
		KPIBuilder,
		FooterActionsBase,
		FooterAssertionsBase,
		HeaderActionsLR,
		HeaderAssertionsLR,
		KPICardAssertions,
		KPICardActions,
		Lib
	) {
		"use strict";

		function getTableId(sIconTabProperty) {
			return "fe::table::" + sIconTabProperty + "::LineItem";
		}

		function getChartId(sEntityType) {
			return "fe::Chart::" + sEntityType + "::Chart";
		}

		function _getHeaderBuilder(vOpaInstance, sPageId) {
			return FEBuilder.create(vOpaInstance).hasId(sPageId);
		}

		/**
		 * Constructs a new ListReport definition.
		 * @class Provides a test page definition for a list report page with the corresponding parameters.
		 *
		 * Sample usage:
		 * <code><pre>
		 * var oListReportDefinition = new ListReport({ appId: "MyApp", componentId: "MyListReportId", entitySet: "MyEntitySet" });
		 * </pre></code>
		 * @param {object} oPageDefinition The required parameters
		 * @param {string} oPageDefinition.appId The app id (defined in the manifest root)
		 * @param {string} oPageDefinition.componentId The component id (defined in the target section for the list report within the manifest)
		 * @param {string} oPageDefinition.entitySet The entitySet (optional)(defined in the settings of the corresponding target component within the manifest)
		 * @param {string} oPageDefinition.contextPath The contextPath (optional)(defined in the settings of the corresponding target component within the manifest)
		 * @param {...object} [_aInAdditionalPageDefinitions] Additional custom page functions, provided in an object containing <code>actions</code> and <code>assertions</code>
		 * @returns {sap.fe.test.ListReport} A list report page definition
		 * @name sap.fe.test.ListReport
		 * @extends sap.fe.test.TemplatePage
		 * @public
		 */
		function ListReport(oPageDefinition, _aInAdditionalPageDefinitions) {
			var sAppId = oPageDefinition.appId,
				sComponentId = oPageDefinition.componentId,
				sContextPath = oPageDefinition.contextPath,
				sEntityPath = sContextPath ? sContextPath.substring(1).replace("/", "::") : oPageDefinition.entitySet,
				ViewId = sAppId + "::" + sComponentId,
				SingleTableId = "fe::table::" + sEntityPath + "::LineItem",
				SingleChartId = "fe::Chart::" + sEntityPath + "::Chart",
				FilterBarId = "fe::FilterBar::" + sEntityPath,
				FilterBarVHDId = FilterBarId + "::FilterFieldValueHelp::",
				oResourceBundleCore = Lib.getResourceBundleFor("sap.fe.core"),
				IconTabBarId = "fe::TabMultipleMode",
				PageId = "fe::ListReport",
				aAdditionalPageDefinitions = Array.isArray(arguments[1]) ? arguments[1] : Array.prototype.slice.call(arguments, 1);

			function _complementTableIdentifier(tableIdentifier) {
				if (!tableIdentifier) {
					tableIdentifier = { id: SingleTableId };
				} else {
					var sTableProperty = !Utils.isOfType(tableIdentifier, String) ? tableIdentifier.property : tableIdentifier;
					tableIdentifier = { id: getTableId(sTableProperty) };
				}
				return tableIdentifier;
			}

			return TemplatePage.apply(
				TemplatePage,
				[
					ViewId,
					{
						/**
						 * ListReport actions
						 * @namespace sap.fe.test.ListReport.actions
						 * @extends sap.fe.test.TemplatePage.actions
						 * @public
						 */
						actions: {
							/**
							 * Returns a {@link sap.fe.test.api.TableActions} instance for the specified table.
							 * @param {string | sap.fe.test.api.TableIdentifier} vTableIdentifier The identifier of the table, or its header title
							 * @returns {sap.fe.test.api.TableActions} The available table actions
							 * @function
							 * @name sap.fe.test.ListReport.actions#onTable
							 * @public
							 */
							onTable: function (vTableIdentifier) {
								return this._onTable(_complementTableIdentifier(vTableIdentifier));
							},
							onChart: function (vChartIdentifier) {
								var sChartId;
								if (vChartIdentifier) {
									sChartId = !Utils.isOfType(vChartIdentifier, String)
										? getChartId(vChartIdentifier.property)
										: vChartIdentifier;
								} else {
									sChartId = SingleChartId;
								}
								return this._onChart({
									id: sChartId
								});
							},
							onKPICard: function () {
								return new KPICardActions(KPIBuilder.create(this));
							},
							/**
							 * Returns a {@link sap.fe.test.api.FilterBarActions} instance.
							 * @returns {sap.fe.test.api.FilterBarActions} The available filter bar actions
							 * @function
							 * @alias sap.fe.test.ListReport.actions#onFilterBar
							 * @public
							 */
							onFilterBar: function () {
								return this._onFilterBar({ id: FilterBarId });
							},
							/**
							 * Returns a {@link sap.fe.test.api.HeaderActionsLR} instance.
							 * @returns {sap.fe.test.api.HeaderActionsLR} The available header actions
							 * @function
							 * @alias sap.fe.test.ListReport.actions#onHeader
							 * @public
							 */
							onHeader: function () {
								return new HeaderActionsLR(_getHeaderBuilder(this, PageId), { id: PageId });
							},
							/**
							 * Collapses or expands the page header.
							 * @param {boolean} [bCollapse] Defines whether the header should be collapsed, else it is expanded (default)
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @function
							 * @name sap.fe.test.ListReport.actions#iCollapseExpandPageHeader
							 * @public
							 */
							iCollapseExpandPageHeader: function (bCollapse) {
								return this._iCollapseExpandPageHeader(bCollapse);
							},
							iExecuteActionOnDialog: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Button")
									.hasProperties({ text: sText })
									.isDialogElement()
									.doPress()
									.description("Pressing dialog button '" + sText + "'")
									.execute();
							},
							iCheckLinksCount: function (count) {
								return OpaBuilder.create(this)
									.hasType("sap.m.ColumnListItem")
									.check(function (targets) {
										if (targets.length === count) {
											return true;
										} else {
											return false;
										}
									}, true)
									.description("Seeing QuickView Card with " + count + " target applications in ObjectPage")
									.execute();
							},
							iClickQuickViewMoreLinksButton: function () {
								return OpaBuilder.create(this)
									.hasType("sap.m.Button")
									.has(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "info.POPOVER_DEFINE_LINKS"))
									.doPress()
									.description("Pressing 'More Links' button")
									.execute();
							},
							iClickLinkWithText: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Link")
									.hasProperties({ text: sText })
									.doPress()
									.description("Navigating via link '" + sText + "'")
									.execute();
							},
							/**
							 * Navigates to or focuses on the defined view of a Multiple Views List Report table.
							 * @param {string | sap.fe.test.api.ViewIdentifier} vViewIdentifier The identifier of a view as defined in the manifest file, or its label passed as a string
							 * if passed as an object, the following pattern will be considered:
							 * <code><pre>
							 * {
							 *     key: <string>,
							 * }
							 * </pre></code>
							 * Depending on property 'keepPreviousPersonalization' in the manifest the key could be set different within the id of the table. If necessary please check the UI control tree within the debugger.
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @function
							 * @name sap.fe.test.ListReport.actions#iGoToView
							 * @public
							 */
							iGoToView: function (vViewIdentifier) {
								var viewKey =
									Utils.isOfType(vViewIdentifier, Object) && typeof vViewIdentifier.key === "string"
										? { key: "fe::table::" + vViewIdentifier.key + "::LineItem" }
										: { text: vViewIdentifier };
								return OpaBuilder.create(this)
									.hasId(IconTabBarId)
									.has(OpaBuilder.Matchers.aggregation("items", OpaBuilder.Matchers.properties(viewKey)))
									.check(function (aItems) {
										return aItems.length > 0;
									})
									.doPress()
									.description(
										"Selecting view '" +
											(Utils.isOfType(vViewIdentifier, Object) ? vViewIdentifier.key : vViewIdentifier) +
											"'"
									)
									.execute();
							},
							/**
							 * TODO This function is only here for legacy reasons and therefore private. Use iGoToView instead.
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @private
							 */
							iOpenIconTabWithTitle: function () {
								// return this.iGoToView(sName);
								return OpaBuilder.create(this)
									.timeout(1)
									.check(function () {
										return false;
									})
									.error(
										"Test function iOpenIconTabWithTitle() is deprecated - please use function iGoToView() with the same parameter"
									)
									.execute();
							},
							iSaveVariant: function (sVariantName, bSetAsDefault, bApplyAutomatically) {
								var aArguments = Utils.parseArguments([String, Boolean, Boolean], arguments),
									oVMBuilder = VMBuilder.create(this).hasId("fe::PageVariantManagement");

								if (aArguments[0]) {
									oVMBuilder
										.doSaveAs(sVariantName, bSetAsDefault, bApplyAutomatically)
										.description(
											Utils.formatMessage(
												"Saving variant for '{0}' as '{1}' with default='{2}' and applyAutomatically='{3}'",
												"Page Variant",
												sVariantName,
												!!bSetAsDefault,
												!!bApplyAutomatically
											)
										);
								} else {
									oVMBuilder
										.doSave()
										.description(Utils.formatMessage("Updating current variant for '{0}'", "Page Variant"));
								}
								return oVMBuilder.execute();
							},
							iSelectVariant: function (sVariantName) {
								return VMBuilder.create(this)
									.hasId("fe::PageVariantManagement")
									.doSelectVariant(sVariantName)
									.description(Utils.formatMessage("Selecting variant '{1}' from '{0}'", "Page Variant", sVariantName))
									.execute();
							},
							iOpenKPICard: function (sTitle) {
								return KPIBuilder.create(this)
									.clickKPITag(sTitle)
									.description("Opening card for KPI '" + sTitle + "'")
									.execute();
							},
							iCloseKPICard: function () {
								return KPIBuilder.create(this).closeKPICard().description("Closing KPI card").execute();
							}
						},
						/**
						 * ListReport assertions
						 * @namespace sap.fe.test.ListReport.assertions
						 * @extends sap.fe.test.TemplatePage.assertions
						 * @public
						 */
						assertions: {
							/**
							 * Returns a {@link sap.fe.test.api.TableAssertions} instance for the specified table.
							 * @param {string | sap.fe.test.api.TableIdentifier} vTableIdentifier The identifier of the table, or its header title
							 * @returns {sap.fe.test.api.TableAssertions} The available table assertions
							 * @function
							 * @alias sap.fe.test.ListReport.assertions#onTable
							 * @public
							 */
							onTable: function (vTableIdentifier) {
								return this._onTable(_complementTableIdentifier(vTableIdentifier));
							},
							onChart: function (vChartIdentifier) {
								var sChartId;
								if (vChartIdentifier) {
									sChartId = !Utils.isOfType(vChartIdentifier, String)
										? getChartId(vChartIdentifier.property)
										: vChartIdentifier;
								} else {
									sChartId = SingleChartId;
								}
								return this._onChart({
									id: sChartId
								});
							},
							/**
							 * Returns a {@link sap.fe.test.api.FilterBarAssertions} instance.
							 * @returns {sap.fe.test.api.FilterBarAssertions} The available filter bar assertions
							 * @function
							 * @alias sap.fe.test.ListReport.assertions#onFilterBar
							 * @public
							 */
							onFilterBar: function () {
								return this._onFilterBar({ id: FilterBarId });
							},
							/**
							 * Returns a {@link sap.fe.test.api.HeaderAssertionsLR} instance.
							 * @returns {sap.fe.test.api.HeaderAssertionsLR} The available header assertions
							 * @function
							 * @alias sap.fe.test.ListReport.assertions#onHeader
							 * @public
							 */
							onHeader: function () {
								return new HeaderAssertionsLR(_getHeaderBuilder(this, PageId), { id: PageId });
							},
							onKPICard: function () {
								return new KPICardAssertions(KPIBuilder.create(this));
							},
							iSeeTheMessageToast: function (sText) {
								return this._iSeeTheMessageToast(sText);
							},
							iSeeFilterFieldsInFilterBar: function (iNumberOfFilterFields, bIsVisualFilterLayout) {
								if (bIsVisualFilterLayout) {
									return OpaBuilder.create(this)
										.hasId(FilterBarId)
										.check(function (oControl) {
											return (
												oControl
													.getAggregation("layout")
													.isA("sap.fe.macros.controls.filterbar.VisualFilterContainer") &&
												oControl.getAggregation("layout").getFilterFields().length === iNumberOfFilterFields
											);
										})
										.description("Seeing filter bar with " + iNumberOfFilterFields + " filter fields")
										.execute();
								}
								return OpaBuilder.create(this)
									.hasId(FilterBarId)
									.hasAggregationLength("filterItems", iNumberOfFilterFields)
									.description("Seeing filter bar with " + iNumberOfFilterFields + " filter fields")
									.execute();
							},
							iSeeTableCellWithActions: function (sPath, nCellPos, sButtonText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.ColumnListItem")
									.has(OpaBuilder.Matchers.bindingPath(sPath))
									.has(function (row) {
										var cell = row.getCells()[nCellPos];
										if (cell.isA("sap.fe.macros.MacroAPI")) {
											cell = cell.getContent();
										}
										return cell.getMetadata().getElementName() === "sap.m.Button" && cell.getText() === sButtonText;
									})
									.description("Inline Action is present in the table cell with the Text " + sButtonText)
									.execute();
							},
							iSeeLinkWithText: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Link")
									.hasProperties({ text: sText })
									.description("Seeing link with text '" + sText + "'")
									.execute();
							},
							iSeeQuickViewMoreLinksButton: function () {
								return OpaBuilder.create(this)
									.isDialogElement(true)
									.hasType("sap.m.Button")
									.has(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "info.POPOVER_DEFINE_LINKS"))
									.description("The 'More Links' button found")
									.execute();
							},
							iSeeFlpLink: function (sDescription) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Link")
									.isDialogElement(true)
									.hasProperties({ text: sDescription })
									.description("FLP link with text '" + sDescription + "' is present")
									.execute();
							},
							iSeeHeaderPinnableToggle: function (bVisible) {
								var sState = bVisible ? "visible" : "hidden";
								return OpaBuilder.create(this)
									.hasType("sap.f.DynamicPageHeader")
									.hasProperties({ pinnable: bVisible })
									.description("The Page Header Pinnable Toggle is " + sState)
									.execute();
							},
							iSeeContactPopoverWithAvatarImage: function (sImageSource) {
								return OpaBuilder.create(this)
									.hasType("sap.ui.mdc.link.Panel")
									.check(function (avatars) {
										var bFound = avatars.some(function (avatar) {
											return avatar.src === sImageSource;
										});
										return bFound === false;
									}, true)
									.description("Seeing Contact Card with Avatar Image in ListReport")
									.execute();
							},
							iSeeAvatarImage: function (sImageSource) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Avatar")
									.hasProperties({ src: sImageSource })
									.description("Seeing avatar image with url '" + sImageSource + "'")
									.execute();
							},
							iSeeLabelWithText: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Label")
									.hasProperties({ text: sText })
									.description("Seeing label with text '" + sText + "'")
									.execute();
							},
							iSeeTitleInQuickViewForm: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.ui.core.Title")
									.isDialogElement(true)
									.hasProperties({ text: sText })
									.description("Seeing title with text '" + sText + "'")
									.execute();
							},
							iSeeSummaryOfAppliedFilters: function () {
								var sAppliedFilters;
								OpaBuilder.create(this)
									.hasId(FilterBarId)
									.mustBeVisible(false)
									.do(function (oFilterbar) {
										sAppliedFilters = oFilterbar.getAssignedFiltersText().filtersText;
									})
									.execute();
								return OpaBuilder.create(this)
									.hasType("sap.f.DynamicPageTitle")
									.has(function (oDynamicPageTitle) {
										return oDynamicPageTitle.getSnappedContent()[0].getContent().getText() === sAppliedFilters;
									})
									.description("The correct text on the collapsed filterbar is displayed")
									.execute();
							},
							iSeeDeleteConfirmation: function () {
								return this._iSeeTheMessageToast(oResourceBundleCore.getText("C_TRANSACTION_HELPER_DELETE_TOAST_SINGULAR"));
							},
							iSeePageTitle: function (sTitle) {
								return OpaBuilder.create(this)
									.hasType("sap.f.DynamicPageTitle")
									.hasAggregationProperties("heading", { text: sTitle })
									.description("Seeing title '" + sTitle + "'")
									.execute();
							},
							iSeeVariantTitle: function (sTitle) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Title")
									.hasId("fe::PageVariantManagement-vm-text")
									.hasProperties({ text: sTitle })
									.description("Seeing variant title '" + sTitle + "'")
									.execute();
							},
							iSeeControlVMFilterBarTitle: function (sTitle) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Title")
									.hasId(FilterBarId + "::VariantManagement-vm-text")
									.hasProperties({ text: sTitle })
									.description("Seeing variant title '" + sTitle + "'")
									.execute();
							},
							iSeeControlVMTableTitle: function (sTitle, sIconTabProperty) {
								var sTableId = sIconTabProperty ? getTableId(sIconTabProperty) : SingleTableId;
								return OpaBuilder.create(this)
									.hasType("sap.m.Title")
									.hasId(sTableId + "::VM-vm-text")
									.hasProperties({ text: sTitle })
									.description("Seeing variant title '" + sTitle + "'")
									.execute();
							},
							iSeeVariantModified: function (bIsModified, bControl) {
								var sLabelId;
								if (bControl) {
									sLabelId = FilterBarId + "::VariantManagement-vm-modified";
								} else {
									sLabelId = "fe::PageVariantManagement-vm-modified";
								}

								bIsModified = bIsModified === undefined ? true : bIsModified;
								if (bIsModified) {
									return OpaBuilder.create(this)
										.hasType("sap.m.Text")
										.hasId(sLabelId)
										.hasProperties({ text: "*" })
										.description("Seeing variant state as 'modified'")
										.execute();
								} else {
									return OpaBuilder.create(this)
										.hasType("sap.m.Label")
										.check(function (oLabels) {
											return !oLabels.some(function (oLabel) {
												return oLabel.getId() === sLabelId;
											});
										}, true)
										.description("Seeing variant state as 'not modified'")
										.execute();
								}
							},
							iSeePageVM: function (mState) {
								return FEBuilder.create(this)
									.hasId("fe::PageVariantManagement")
									.hasState(mState)
									.description(Utils.formatMessage("Seeing page VM with state '{0}'", mState))
									.execute();
							},
							iSeeControlVMFilterBar: function () {
								return OpaBuilder.create(this)
									.hasId(FilterBarId + "::VariantManagement")
									.description("Seeing control VM - FilterBar")
									.execute();
							},
							iSeeDraftIndicator: function () {
								return OpaBuilder.create(this)
									.hasType("sap.m.ObjectMarker")
									.hasProperties({
										type: "Draft"
									})
									.description("Draft indicator is visible")
									.execute();
							},
							iSeeDraftIndicatorLocked: function (user) {
								var props = user ? { type: "LockedBy", additionalInfo: user } : { type: "Locked" };

								return OpaBuilder.create(this)
									.hasType("sap.m.ObjectMarker")
									.hasProperties(props)
									.description("Draft indicator is visible and locked" + (user ? " by '" + user + "'" : ""))
									.execute();
							},
							/**
							 * Checks the view of a Multiple View List Report table.
							 * @param {string | sap.fe.test.api.ViewIdentifier} vViewIdentifier The identifier of a view as defined in the manifest file, or its label passed as a string
							 * if passed as an object, the following pattern will be considered:
							 * <code><pre>
							 * {
							 *     key: <string>,
							 * }
							 * </pre></code>
							 * Depending on property 'keepPreviousPersonalization' in the manifest, the key could be set differently within the id of the table. If necessary please check the UI control tree within the debugger.
							 * @param {object} mState An object containing properties of the view to be checked
							 * Example:
							 * <code><pre>
							 * {
							 *     count: <number of records expected>,
							 * }
							 * </pre></code>
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @function
							 * @name sap.fe.test.ListReport.assertions#iCheckView
							 * @public
							 */
							iCheckView: function (vViewIdentifier, mState) {
								var viewKey =
									Utils.isOfType(vViewIdentifier, Object) && typeof vViewIdentifier.key === "string"
										? { key: "fe::table::" + vViewIdentifier.key + "::LineItem" }
										: { text: vViewIdentifier };

								return OpaBuilder.create(this)
									.hasId(IconTabBarId)
									.has(OpaBuilder.Matchers.aggregation("items", OpaBuilder.Matchers.properties(viewKey)))
									.has(FEBuilder.Matchers.atIndex(0))
									.hasProperties(mState)
									.description(Utils.formatMessage("Checking view '{0}' with properties '{1}'", vViewIdentifier, mState))
									.execute();
							},
							/**
							 * TODO This function is only here for legacy reasons and therefore private. Use iCheckView instead.
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @private
							 */
							iSeeIconTabWithProperties: function () {
								// return this.iCheckView(mProperties.text, mProperties);
								return OpaBuilder.create(this)
									.timeout(1)
									.check(function () {
										return false;
									})
									.error("Test function iSeeIconTabWithProperties() is deprecated - please use function iCheckView()")
									.execute();
							},
							iSeeNumOfOperators: function (sFieldName, numItems) {
								return OpaBuilder.create(this)
									.hasId(FilterBarVHDId + sFieldName + "-DCP")
									.doOnChildren(OpaBuilder.create(this).hasAggregationLength("items", numItems))
									.description("Seeing a value list of condition operators with " + numItems + " items.")
									.execute();
							},
							iSeeKPI: function (sTitle, oProperties) {
								var sDescription = "Seeing KPI '" + sTitle + "'";
								if (oProperties) {
									sDescription += " with properties " + JSON.stringify(oProperties);
								}
								return KPIBuilder.create(this).checkKPITag(sTitle, oProperties).description(sDescription).execute();
							},
							iSeeKPICard: function () {
								return KPIBuilder.create(this).checkKPICard().description("Seeing KPI Card").execute();
							}
						}
					}
				].concat(aAdditionalPageDefinitions)
			);
		}

		return ListReport;
	}
);
