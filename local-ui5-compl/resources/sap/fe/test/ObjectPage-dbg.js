/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"sap/base/util/merge",
		"./TemplatePage",
		"sap/ui/test/OpaBuilder",
		"sap/ui/test/Opa5",
		"sap/fe/test/Utils",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/MacroFieldBuilder",
		"sap/fe/test/builder/OverflowToolbarBuilder",
		"sap/fe/test/api/FooterActionsOP",
		"sap/fe/test/api/FooterAssertionsOP",
		"sap/fe/test/api/HeaderActions",
		"sap/fe/test/api/HeaderAssertions",
		"sap/fe/test/api/FormActions",
		"sap/fe/test/api/FormAssertions",
		"sap/ui/core/Lib"
	],
	function (
		mergeObjects,
		TemplatePage,
		OpaBuilder,
		Opa5,
		Utils,
		FEBuilder,
		FieldBuilder,
		OverflowToolbarBuilder,
		FooterActionsOP,
		FooterAssertionsOP,
		HeaderActions,
		HeaderAssertions,
		FormActions,
		FormAssertions,
		Lib
	) {
		"use strict";

		function getTableId(sNavProperty, sQualifier) {
			return sQualifier
				? "fe::table::" + sNavProperty.split("/").join("::") + "::LineItem::" + sQualifier
				: "fe::table::" + sNavProperty.split("/").join("::") + "::LineItem";
		}

		function getChartId(sEntityType) {
			return "fe::Chart::" + sEntityType + "::Chart";
		}

		function _getOverflowToolbarBuilder(vOpaInstance, vFooterIdentifier) {
			return OverflowToolbarBuilder.create(vOpaInstance).hasId(vFooterIdentifier.id);
		}

		function _getHeaderBuilder(vOpaInstance, vHeaderIdentifier) {
			return FEBuilder.create(vOpaInstance).hasId(vHeaderIdentifier.id);
		}

		function _getFormBuilder(vOpaInstance, vFormIdentifier) {
			var oFormBuilder = FEBuilder.create(vOpaInstance);
			if (Utils.isOfType(vFormIdentifier, String)) {
				oFormBuilder.hasType("sap.uxap.ObjectPageSubSection");
				oFormBuilder.hasProperties({ title: vFormIdentifier });
			} else if (vFormIdentifier.fieldGroupId) {
				oFormBuilder.hasId(vFormIdentifier.fieldGroupId);
				if (vFormIdentifier.fullSubSectionId) {
					oFormBuilder.has(OpaBuilder.Matchers.ancestor(vFormIdentifier.fullSubSectionId, false));
				}
			} else {
				oFormBuilder.hasId(vFormIdentifier.id);
			}
			return oFormBuilder;
		}

		function _createSectionMatcher(vSectionIdentifier, sOPSectionIdPrefix) {
			var vMatcher, sActionId;

			if (!Utils.isOfType(vSectionIdentifier, String)) {
				if (typeof vSectionIdentifier.section === "string" && !vSectionIdentifier.subSection) {
					sActionId =
						vSectionIdentifier.section === "EditableHeaderSection"
							? "fe::" + vSectionIdentifier.section + "-anchor"
							: sOPSectionIdPrefix + "::" + vSectionIdentifier.section + "-anchor";
					vMatcher = OpaBuilder.Matchers.children(FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("{0}$", sActionId))));
				} else {
					throw new Error(
						"not supported section and subsection parameters for creating a control id: " +
							vSectionIdentifier.section +
							"/" +
							vSectionIdentifier.subSection
					);
				}
			} else {
				vMatcher = OpaBuilder.Matchers.children(
					FEBuilder.Matchers.states({
						controlType: "sap.m.IconTabFilter",
						text: vSectionIdentifier
					})
				);
			}
			return vMatcher;
		}

		function _anchorSectionIdMatcher(sSection, sOPSectionIdPrefix) {
			var vMatcher,
				sSectionId =
					sSection === "EditableHeaderSection" ? "fe::" + sSection + "-anchor" : sOPSectionIdPrefix + "::" + sSection + "-anchor";
			vMatcher = FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("{0}$", sSectionId)));
			return vMatcher;
		}
		function _anchorSectionTextMatcher(sSection) {
			var vMatcher;
			vMatcher = FEBuilder.Matchers.states({ text: sSection });
			return vMatcher;
		}
		function _anchorSubSectionIdMatcher(sSubSection, sOPSubSectionIdPrefix) {
			var vMatcher,
				sSubSectionId = sOPSubSectionIdPrefix + "::" + sSubSection + "-anchor";
			// coming from the sap.m.IconTabFilter --> checking via aggregationMatcher for the subSection
			vMatcher = OpaBuilder.Matchers.aggregationMatcher(
				"items",
				FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("{0}$", sSubSectionId)))
			);
			return vMatcher;
		}
		function _anchorSubSectionIconMatcher(sSection, sOPSectionIdPrefix) {
			var vMatcher,
				sSectionExpandIconId = sOPSectionIdPrefix + "::" + sSection + "-anchor-expandIcon";
			vMatcher = FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("{0}$", sSectionExpandIconId)));
			return vMatcher;
		}
		function _anchorOverflowMatcher() {
			var vMatcher;
			vMatcher = FEBuilder.Matchers.id(new RegExp("fe::ObjectPage-anchBar-.+verflow$"));
			return vMatcher;
		}

		function _createMenuActionExecutorBuilder(vMenuAction, sOPSubSectionIdPrefix) {
			if (!vMenuAction) {
				throw new Error("vMenuAction parameter missing");
			}
			var sActionId = sOPSubSectionIdPrefix + "::" + vMenuAction + "-anchor-unifiedmenu";

			return FEBuilder.create()
				.hasType("sap.ui.unified.MenuItem")
				.hasId(new RegExp(Utils.formatMessage("{0}$", sActionId)))
				.doPress()
				.description(Utils.formatMessage("Executing action '{0}' from currently open action menu", vMenuAction));
		}

		function _getObjectPageSectionSubSectionBuilder(vOpaInstance, SectionSubSectionIdentifier, SectionSubSectionIdPrefix, ControlType) {
			var SectionSubSectionBuilder = FEBuilder.create(vOpaInstance).hasType(ControlType);
			if (Utils.isOfType(SectionSubSectionIdentifier, String)) {
				SectionSubSectionBuilder.hasProperties({ title: SectionSubSectionIdentifier });
			} else if (SectionSubSectionIdentifier.section) {
				SectionSubSectionBuilder.hasId(SectionSubSectionIdPrefix + "::" + SectionSubSectionIdentifier.section);
			} else {
				throw new Error(
					"section or sub-section parameters not supported for creating a control id: " + SectionSubSectionIdentifier
				);
			}
			return SectionSubSectionBuilder;
		}
		function _getObjectPageSectionBuilder(vOpaInstance, ObjectPageSectionIdentifier, OPSectionIdPrefix) {
			return _getObjectPageSectionSubSectionBuilder(
				vOpaInstance,
				ObjectPageSectionIdentifier,
				OPSectionIdPrefix,
				"sap.uxap.ObjectPageSection"
			);
		}
		function _getObjectPageSubSectionBuilder(vOpaInstance, ObjectPageSubSectionIdentifier, OPSubSectionIdPrefix) {
			return _getObjectPageSectionSubSectionBuilder(
				vOpaInstance,
				ObjectPageSubSectionIdentifier,
				OPSubSectionIdPrefix,
				"sap.uxap.ObjectPageSubSection"
			);
		}

		/**
		 * Constructs a new ObjectPage instance.
		 * @class Provides a test page definition for an object page with the corresponding parameters.
		 *
		 * Sample usage:
		 * <code><pre>
		 * var oObjectPageDefinition = new ObjectPage({ appId: "MyApp", componentId: "MyObjectPageId", entitySet: "MyEntitySet" });
		 * </pre></code>
		 * @param {object} oPageDefinition The required parameters
		 * @param {string} oPageDefinition.appId The app id (defined in the manifest root)
		 * @param {string} oPageDefinition.componentId The component id (defined in the target section for the list report within the manifest)
		 * @param {string} oPageDefinition.entitySet The entitySet (defined in the settings of the corresponding target component within the manifest)
		 * @param {string} oPageDefinition.contextPath The contextPath (optional)(defined in the settings of the corresponding target component within the manifest)
		 * @param {...object} [_aAdditionalPageDefinitions] Additional custom page functions, provided in an object containing <code>actions</code> and <code>assertions</code>
		 * @returns {sap.fe.test.ObjectPage} An object page page definition
		 * @name sap.fe.test.ObjectPage
		 * @extends sap.fe.test.TemplatePage
		 * @public
		 */
		function ObjectPage(oPageDefinition, _aAdditionalPageDefinitions) {
			var sAppId = oPageDefinition.appId,
				sComponentId = oPageDefinition.componentId,
				ViewId = sAppId + "::" + sComponentId,
				ObjectPageLayoutId = ViewId + "--fe::ObjectPage",
				OPHeaderId = "fe::HeaderFacet",
				OPHeaderContentId = "fe::ObjectPage-OPHeaderContent",
				OPHeaderContentContainerId = ViewId + "--fe::HeaderContentContainer",
				OPFooterId = "fe::FooterBar::_fc",
				OPSectionIdPrefix = "fe::FacetSection",
				OPSubSectionIdPrefix = "fe::FacetSubSection",
				OPFormIdPrefix = "fe::Form",
				OPFormContainerIdPrefix = "fe::FormContainer",
				OPFormContainerHeaderFacetsIdPrefix = "fe::HeaderFacet::FormContainer",
				BreadCrumbId = ViewId + "--fe::Breadcrumbs",
				AnchorBarId = "fe::ObjectPage-anchBar",
				PaginatorId = "fe::Paginator",
				EditableHeaderTitleId = "EditableHeaderForm::EditableHeaderTitle",
				PageEditMode = {
					DISPLAY: "Display",
					EDITABLE: "Editable"
				},
				oResourceBundleCore = Lib.getResourceBundleFor("sap.fe.core"),
				aAdditionalPages = Array.prototype.slice.call(arguments, 1);

			return TemplatePage.apply(
				TemplatePage,
				[
					ViewId,
					{
						/**
						 * ObjectPage actions
						 * @namespace sap.fe.test.ObjectPage.actions
						 * @extends sap.fe.test.TemplatePage.actions
						 * @public
						 */
						actions: {
							/**
							 * Returns a {@link sap.fe.test.api.TableActions} instance for the specified table.
							 * @param {string | sap.fe.test.api.TableIdentifier} vTableIdentifier The identifier of the table, or its header title
							 * @returns {sap.fe.test.api.TableActions} The available table actions
							 * @function
							 * @name sap.fe.test.ObjectPage.actions#onTable
							 * @public
							 */
							onTable: function (vTableIdentifier) {
								if (!Utils.isOfType(vTableIdentifier, String) && !vTableIdentifier.id) {
									vTableIdentifier = { id: getTableId(vTableIdentifier.property, vTableIdentifier.qualifier) };
								}
								return this._onTable(vTableIdentifier);
							},
							onChart: function (vChartIdentifier) {
								var sChartId;
								if (vChartIdentifier) {
									sChartId = !Utils.isOfType(vChartIdentifier, String)
										? getChartId(vChartIdentifier.property)
										: vChartIdentifier;
								}
								return this._onChart({
									id: sChartId
								});
							},
							/**
							 * Returns a {@link sap.fe.test.api.FilterBarActions} instance.
							 * @param {sap.fe.test.api.FilterBarIdentifier | string} vFilterBarIdentifier The identifier of the filterbar
							 * @returns {sap.fe.test.api.FilterBarActions} The available filter bar actions
							 * @function
							 * @alias sap.fe.test.ObjectPage.actions#onFilterBar
							 * @public
							 */
							onFilterBar: function (vFilterBarIdentifier) {
								var vIdentifier =
									typeof vFilterBarIdentifier === "string" ? { id: vFilterBarIdentifier } : vFilterBarIdentifier;
								return this._onFilterBar(vIdentifier);
							},
							/**
							 * Returns a {@link sap.fe.test.api.FooterActionsOP} instance.
							 * @returns {sap.fe.test.api.FooterActionsOP} The available footer actions
							 * @function
							 * @alias sap.fe.test.ObjectPage.actions#onFooter
							 * @public
							 */
							onFooter: function () {
								return new FooterActionsOP(_getOverflowToolbarBuilder(this, { id: OPFooterId }), {
									id: OPFooterId
								});
							},
							/**
							 * Returns a {@link sap.fe.test.api.HeaderActions} instance.
							 * @returns {sap.fe.test.api.HeaderActions} The available header actions
							 * @function
							 * @alias sap.fe.test.ObjectPage.actions#onHeader
							 * @public
							 */
							onHeader: function () {
								return new HeaderActions(_getHeaderBuilder(this, { id: ObjectPageLayoutId }), {
									id: ObjectPageLayoutId,
									headerId: OPHeaderId,
									headerContentId: OPHeaderContentId,
									headerContentContainerId: OPHeaderContentContainerId,
									viewId: ViewId,
									paginatorId: PaginatorId,
									breadCrumbId: BreadCrumbId
								});
							},
							/**
							 * Returns a {@link sap.fe.test.api.FormActions} instance.
							 * @param {sap.fe.test.api.FormIdentifier | string} vFormIdentifier The identifier of the form, or its title
							 * @returns {sap.fe.test.api.FormActions} The available form actions
							 * @function
							 * @alias sap.fe.test.ObjectPage.actions#onForm
							 * @public
							 */
							onForm: function (vFormIdentifier) {
								if (!Utils.isOfType(vFormIdentifier, String)) {
									if (vFormIdentifier.section) {
										vFormIdentifier.id = OPSubSectionIdPrefix + "::" + vFormIdentifier.section;
										vFormIdentifier.fullSubSectionId = ViewId + "--" + vFormIdentifier.id;
									}
									if (vFormIdentifier.fieldGroup) {
										vFormIdentifier.fieldGroupId = vFormIdentifier.isHeaderFacet
											? OPFormContainerHeaderFacetsIdPrefix + "::" + vFormIdentifier.fieldGroup
											: OPFormContainerIdPrefix + "::" + vFormIdentifier.fieldGroup;
									}
								}
								return new FormActions(_getFormBuilder(this, vFormIdentifier), vFormIdentifier);
							},
							/**
							 * Collapses or expands the page header.
							 * @param {boolean} [bCollapse] Defines whether header should be collapsed, else it gets expanded (default)
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @function
							 * @name sap.fe.test.ObjectPage.actions#iCollapseExpandPageHeader
							 * @public
							 */
							iCollapseExpandPageHeader: function (bCollapse) {
								return this._iCollapseExpandPageHeader(bCollapse);
							},
							iClickQuickViewMoreLinksButton: function () {
								return OpaBuilder.create(this)
									.hasType("sap.m.Button")
									.has(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "info.POPOVER_DEFINE_LINKS"))
									.doPress()
									.description("Pressing 'More Links' button")
									.execute();
							},
							iClickQuickViewCancelButton: function () {
								return OpaBuilder.create(this)
									.hasType("sap.m.Button")
									.has(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "p13nDialog.CANCEL"))
									.doPress()
									.description("Pressing Quickview 'Cancel' button")
									.execute();
							},
							iClickQuickViewTitleLink: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Link")
									.isDialogElement(true)
									.hasProperties({ text: sText })
									.doPress()
									.description("Navigating via quickview title link '" + sText + "'")
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
							iClickObjectStatus: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.ObjectStatus")
									.hasProperties({ text: sText })
									.doPress()
									.description("Press Object Status '" + sText + "'")
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
							iEnableLink: function (sText) {
								var vAggregationMatcher = FEBuilder.Matchers.deepAggregationMatcher("cells/items/items", [
									OpaBuilder.Matchers.properties({ text: sText })
								]);
								return OpaBuilder.create(this)
									.hasType("sap.m.ColumnListItem")
									.has(vAggregationMatcher)
									.doPress("selectMulti")
									.description("The CheckBox for link " + sText + " is selected")
									.execute();
							},
							iPressKeyboardShortcutOnSection: function (sShortcut, mProperties) {
								return this._iPressKeyboardShortcut(undefined, sShortcut, mProperties, "sap.uxap.ObjectPageSection");
							},
							/**
							 * Navigates to or focuses on the defined section.
							 * @param {string | sap.fe.test.api.SectionIdentifier} vSectionIdentifier The identifier of a section, or its label
							 * if passed as an object, the following pattern will be considered (please use to open sub-sections via drop-down):
							 * <code><pre>
							 * {
							 *     section: <string>,
							 *     subSection: <string>
							 * }
							 * </pre></code>
							 * to open the editable header section use pattern:
							 * <code><pre>
							 * {
							 *     section: "EditableHeaderSection"
							 * }
							 * </pre></code>
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @function
							 * @name sap.fe.test.ObjectPage.actions#iGoToSection
							 * @public
							 */
							iGoToSection: function (vSectionIdentifier) {
								var fnClickSectionExpandIconHandler = function (sSection, sOPSectionIdPrefix) {
										var sSectionExpandIconId = sOPSectionIdPrefix + "::" + sSection + "-anchor-expandIcon";
										FEBuilder.create(this)
											.hasId(new RegExp(Utils.formatMessage("{0}$", sSectionExpandIconId)))
											.doPress()
											.description(Utils.formatMessage("Pressing drop-down icon for section '{0}'", sSection))
											.execute();
									},
									fnCheckSectionExpandIconHandler = function (sSection, sOPSectionIdPrefix) {
										FEBuilder.create(this)
											.hasType("sap.ui.core.Icon")
											.doConditional(_anchorSubSectionIconMatcher(sSection, sOPSectionIdPrefix), function (sIcon) {
												fnClickSectionExpandIconHandler(sSection, sOPSectionIdPrefix);
											})
											// .doPress()
											.description(Utils.formatMessage("Checking for section icon '{0}'", sSection))
											.execute();
									},
									fnClickSubSectionByIdHandler = function (sSubSection, sOPSubSectionIdPrefix) {
										var sSubSectionId = sOPSubSectionIdPrefix + "::" + sSubSection + "-anchor-__clone";
										FEBuilder.create(this)
											.hasId(new RegExp(Utils.formatMessage("{0}.+", sSubSectionId)))
											.doPress()
											.description(Utils.formatMessage("Pressing sub-section by id: '{0}'", sSubSection))
											.execute();
									},
									fnClickEditableHeaderSectionHandler = function (sSection) {
										var sSectionId = "fe::" + sSection;
										FEBuilder.create(this)
											.hasType("sap.m.IconTabFilter")
											.hasId(new RegExp(Utils.formatMessage("{0}.+", sSectionId)))
											.doPress()
											.description("Pressing editable header section")
											.execute();
									},
									fnClickSectionByTextHandler = function (sSection) {
										OpaBuilder.create(this)
											.hasType("sap.m.IconTabFilter")
											.hasProperties({ text: sSection })
											.doPress()
											.description(Utils.formatMessage("Pressing section by text: '{0}'", sSection))
											.execute();
									},
									fnClickOverflowHandler = function () {
										OpaBuilder.create(this)
											.hasType("sap.m.IconTabFilter")
											.hasId(new RegExp("fe::ObjectPage-anchBar-.+verflow$"))
											.doPress()
											.description("Pressing Overflow button")
											.execute();
									};

								// check whether the section has to be identified by label (string) or id (object)
								var sectionMatcher;
								if (Utils.isOfType(vSectionIdentifier, Object)) {
									sectionMatcher = _anchorSectionIdMatcher(vSectionIdentifier.section, OPSectionIdPrefix);
								} else {
									sectionMatcher = _anchorSectionTextMatcher(vSectionIdentifier);
								}

								var bVisibleChecked = false,
									bHiddenChecked = false;
								return OpaBuilder.create(this)
									.hasType("sap.m.IconTabFilter")
									.doConditional(sectionMatcher, function (sSection) {
										// at this point we know that the section is on the visible area of the anchorBar
										if (!bHiddenChecked) {
											if (Utils.isOfType(vSectionIdentifier, Object)) {
												if (vSectionIdentifier.section === "EditableHeaderSection") {
													fnClickEditableHeaderSectionHandler(vSectionIdentifier.section);
												} else {
													fnClickSectionExpandIconHandler(vSectionIdentifier.section, OPSectionIdPrefix);
													fnClickSubSectionByIdHandler(vSectionIdentifier.subSection, OPSubSectionIdPrefix);
												}
											} else {
												fnClickSectionByTextHandler(vSectionIdentifier);
											}
											bVisibleChecked = true;
										}
									})
									.doConditional(_anchorOverflowMatcher(), function (sOverflow) {
										if (!bVisibleChecked) {
											fnClickOverflowHandler();
											if (Utils.isOfType(vSectionIdentifier, Object)) {
												if (vSectionIdentifier.section === "EditableHeaderSection") {
													fnClickEditableHeaderSectionHandler(vSectionIdentifier.section);
												} else {
													fnCheckSectionExpandIconHandler(vSectionIdentifier.section, OPSectionIdPrefix);
													fnClickSubSectionByIdHandler(vSectionIdentifier.subSection, OPSubSectionIdPrefix);
												}
											} else {
												fnClickSectionByTextHandler(vSectionIdentifier);
											}
											bHiddenChecked = true;
										}
									})
									.description("Switching section anchorBar")
									.execute();
							},

							/**
							 * TODO This function is only here for legacy reasons and therefore private. Use iGoToSection instead.
							 * @param {string} sName The name of the section
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @private
							 */
							iOpenSectionWithTitle: function (sName) {
								return OpaBuilder.create(this)
									.timeout(1)
									.check(function () {
										return false;
									})
									.error(
										"Test function iOpenSectionWithTitle() is deprecated - please use function iGoToSection() with the same parameters"
									)
									.execute();
							},

							// public test-funtion to switch sections (iGoToSection) does not support the case of showing user-interaction in an extension event within changing the section, see journey CustomReuseComponentJourney.js
							// therefore created a very simple internal function to switch the section as a workaround
							iClickOnSectionWithTitle: function (sSection) {
								OpaBuilder.create(this)
									.hasType("sap.m.IconTabFilter")
									.hasProperties({ text: sSection })
									.doPress()
									.description(Utils.formatMessage("Clicking section with title: '{0}'", sSection))
									.execute();
							},

							iEnterValueForFieldInEditableHeader: function (sValue) {
								return FieldBuilder.create(this)
									.hasId(ViewId + "--fe::" + EditableHeaderTitleId)
									.doEnterText(sValue)
									.description("Entering '" + sValue + " in field ")
									.execute();
							},
							iClickOnMessageButton: function () {
								return OpaBuilder.create(this)

									.hasType("sap.fe.macros.messages.MessageButton")
									.doPress()
									.description("Clicked on Message Button")
									.execute();
							},
							iCheckMessageButtonTooltip: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.fe.macros.messages.MessageButton")
									.check(function (oControl) {
										return oControl[0].getTooltip() === sText;
									}, true)
									.description("Checking tooltip of MessageButton")
									.execute();
							},
							iClickOnMessage: function (oMessageInfo) {
								return OpaBuilder.create(this)
									.hasType("sap.m.MessageListItem")
									.hasProperties({
										title: oMessageInfo.MessageText
										//groupAnnouncement: oMessageInfo.GroupLabel => with openui5/+/6328248 groups are no longer announced
									})
									.isDialogElement(true)
									.description("MessageItem with correct text and group label")
									.doOnChildren(
										OpaBuilder.create(this)
											.hasType("sap.m.Link")
											.hasProperties({ text: oMessageInfo.MessageText })
											.doPress()
											.description("Click on the message")
									)
									.execute();
							},
							iClickBackOnMessageView: function () {
								return OpaBuilder.create(this)
									.hasType("sap.m.MessageView")
									.isDialogElement(true)
									.doOnChildren(
										OpaBuilder.create(this)
											.hasType("sap.m.Button")
											.hasProperties({ icon: "sap-icon://nav-back" })
											.doPress()
											.description("Click on the message view back")
									)
									.execute();
							}
						},
						/**
						 * ObjectPage assertions
						 * @namespace sap.fe.test.ObjectPage.assertions
						 * @extends sap.fe.test.TemplatePage.assertions
						 * @public
						 */
						assertions: {
							/**
							 * Returns a {@link sap.fe.test.api.TableAssertions} instance for the specified table.
							 * @param {string | sap.fe.test.api.TableIdentifier} vTableIdentifier The identifier of the table, or its header title
							 * @returns {sap.fe.test.api.TableAssertions} The available table assertions
							 * @function
							 * @name sap.fe.test.ObjectPage.assertions#onTable
							 * @public
							 */
							onTable: function (vTableIdentifier) {
								if (!Utils.isOfType(vTableIdentifier, String) && !vTableIdentifier.id) {
									vTableIdentifier = { id: getTableId(vTableIdentifier.property, vTableIdentifier.qualifier) };
								}
								return this._onTable(vTableIdentifier);
							},
							onChart: function (vChartIdentifier) {
								var sChartId;
								if (vChartIdentifier) {
									sChartId = !Utils.isOfType(vChartIdentifier, String)
										? getChartId(vChartIdentifier.property)
										: vChartIdentifier;
								}
								return this._onChart({
									id: sChartId
								});
							},
							/**
							 * Returns a {@link sap.fe.test.api.FilterBarAssertions} instance.
							 * @param {sap.fe.test.api.FilterBarIdentifier | string} vFilterBarIdentifier The identifier of the filterbar
							 * @returns {sap.fe.test.api.FilterBarAssertions} The available filter bar assertions
							 * @function
							 * @alias sap.fe.test.ObjectPage.assertions#onFilterBar
							 * @public
							 */
							onFilterBar: function (vFilterBarIdentifier) {
								var vIdentifier =
									typeof vFilterBarIdentifier === "string" ? { id: vFilterBarIdentifier } : vFilterBarIdentifier;
								return this._onFilterBar(vIdentifier);
							},
							/**
							 * Returns a {@link sap.fe.test.api.FooterAssertionsOP} instance.
							 * @returns {sap.fe.test.api.FooterAssertionsOP} The available footer assertions
							 * @function
							 * @alias sap.fe.test.ObjectPage.assertions#onFooter
							 * @public
							 */
							onFooter: function () {
								return new FooterAssertionsOP(_getOverflowToolbarBuilder(this, { id: OPFooterId }), { id: OPFooterId });
							},
							/**
							 * Returns a {@link sap.fe.test.api.HeaderAssertions} instance.
							 * @returns {sap.fe.test.api.HeaderAssertions} The available header assertions
							 * @function
							 * @alias sap.fe.test.ObjectPage.assertions#onHeader
							 * @public
							 */
							onHeader: function () {
								return new HeaderAssertions(_getHeaderBuilder(this, { id: ObjectPageLayoutId }), {
									id: ObjectPageLayoutId,
									headerId: OPHeaderId,
									headerContentId: OPHeaderContentId,
									headerContentContainerId: OPHeaderContentContainerId,
									viewId: ViewId,
									paginatorId: PaginatorId,
									breadCrumbId: BreadCrumbId
								});
							},
							/**
							 * Returns a {@link sap.fe.test.api.FormAssertions} instance.
							 * @param {sap.fe.test.api.FormIdentifier | string} vFormIdentifier The identifier of the form, or its title
							 * @returns {sap.fe.test.api.FormAssertions} The available form actions
							 * @function
							 * @alias sap.fe.test.ObjectPage.assertions#onForm
							 * @public
							 */
							onForm: function (vFormIdentifier) {
								if (!Utils.isOfType(vFormIdentifier, String)) {
									if (vFormIdentifier.section) {
										vFormIdentifier.id = OPSubSectionIdPrefix + "::" + vFormIdentifier.section;
										vFormIdentifier.fullSubSectionId = ViewId + "--" + vFormIdentifier.id;
									}
									if (vFormIdentifier.fieldGroup) {
										vFormIdentifier.fieldGroupId = vFormIdentifier.isHeaderFacet
											? OPFormContainerHeaderFacetsIdPrefix + "::" + vFormIdentifier.fieldGroup
											: OPFormContainerIdPrefix + "::" + vFormIdentifier.fieldGroup;
									}
								}
								return new FormAssertions(_getFormBuilder(this, vFormIdentifier), vFormIdentifier);
							},

							iSeeMessageButton: function (messageType, messageButtonText) {
								var message = {
									Error: {
										type: "Negative"
									},
									Warning: {
										type: "Critical"
									},
									Information: {
										type: "Neutral"
									}
								};
								return OpaBuilder.create(this)
									.hasType("sap.fe.macros.messages.MessageButton")
									.hasProperties({
										text: messageButtonText,
										type: message[messageType]["type"]
									})
									.description("Messagebutton is visible with " + message[messageType]["type"] + " button type")
									.execute();
							},
							iSeeLinkWithText: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Link")
									.hasProperties({ text: sText })
									.description("Seeing link with text '" + sText + "'")
									.execute();
							},
							iSeeTextWithText: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Text")
									.hasProperties({ text: sText })
									.description("Seeing Text with text '" + sText + "'")
									.execute();
							},
							iSeeBetterLinkWithText: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.fe.macros.controls.TextLink")
									.hasProperties({ text: sText })
									.description("Seeing Text with text '" + sText + "'")
									.execute();
							},
							iSeeTitleWithText: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Title")
									.hasProperties({ text: sText })
									.description("Seeing Title with text '" + sText + "'")
									.execute();
							},
							iSeeContactDetailsPopover: function (sTitle) {
								return (
									OpaBuilder.create(this)
										.hasType("sap.ui.mdc.link.Panel")
										// .hasAggregation("items", [
										// 	function(oItem) {
										// 		return oItem instanceof sap.m.Label;
										// 	},
										// 	{
										// 		properties: {
										// 			text: sTitle
										// 		}
										// 	}
										// ])
										.description("Contact card with title '" + sTitle + "' is present")
										.execute()
								);
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
									.description("Seeing Contact Card with Avatar Image in ObjectPage")
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
							iSeeObjectPageInDisplayMode: function () {
								return this._iSeeObjectPageInMode(PageEditMode.DISPLAY);
							},
							iSeeObjectPageInEditMode: function () {
								return this._iSeeObjectPageInMode(PageEditMode.EDITABLE);
							},
							_iSeeObjectPageInMode: function (sMode) {
								return OpaBuilder.create(this)
									.hasId(ViewId)
									.viewId(null)
									.has(function (oObjectPage) {
										return oObjectPage.getModel("ui").getProperty("/editMode") === sMode;
									})
									.description("Object Page is in mode '" + sMode + "'")
									.execute();
							},
							/**
							 * Checks a section.
							 * It is checked if a section is already loaded and therefore the data is visible to the user. This function does not check properties of the anchor bar buttons for section selection.
							 * @param {string | sap.fe.test.api.SectionIdentifier} SectionIdentifier The identifier of the section.
							 * This can either be a string containing the label of the section or an object having the pattern
							 * <code><pre>
							 * 	{
							 *  	section: <section id>
							 * 	}
							 * </pre></code>
							 * @param {object} mState Defines the expected state of the section, e.g. its visibility
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @public
							 */
							iCheckSection: function (SectionIdentifier, mState) {
								var SectionBuilder = _getObjectPageSectionBuilder(this, SectionIdentifier, OPSectionIdPrefix);
								return SectionBuilder.hasState(mState)
									.description(
										Utils.formatMessage("Checking section '{0}' having state='{1}'", SectionIdentifier, mState)
									)
									.execute();
							},
							/**
							 * TODO This function is only here for legacy reasons and therefore private. Use iCheckSection instead.
							 * @param {string} sTitle The name of the section
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @private
							 */
							iSeeSectionWithTitle: function (sTitle) {
								return this.iCheckSection(sTitle, { visible: true });
							},

							/**
							 * Checks the expected number of sections in an object page.
							 * @param {number} ExpectedNumberOfSections The number of expected sections within the object page.
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @public
							 */
							iCheckNumberOfSections: function (ExpectedNumberOfSections) {
								return FEBuilder.create(this)
									.hasId(AnchorBarId)
									.hasAggregationLength("items", ExpectedNumberOfSections)
									.description(
										Utils.formatMessage(
											"Object Page contains the expected number of {0} sections",
											ExpectedNumberOfSections
										)
									)
									.execute();
							},

							/**
							 * Checks a sub-section.
							 * @param {string | sap.fe.test.api.SectionIdentifier} SubSectionIdentifier The identifier of the sub-section to be checked for visibility.
							 * This can either be a string containing the label of the sub-section or an object having the pattern
							 * <code><pre>
							 * 	{
							 *  	section: <sub-section id>
							 * 	}
							 * </pre></code>
							 * @param {object} mState Defines the expected state of the sub-section, e.g. its visibility
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @public
							 */
							iCheckSubSection: function (SubSectionIdentifier, mState) {
								var SubSectionBuilder = _getObjectPageSubSectionBuilder(this, SubSectionIdentifier, OPSubSectionIdPrefix);
								return SubSectionBuilder.hasState(mState)
									.description(
										Utils.formatMessage("Checking sub-section '{0}' having state='{1}'", SubSectionIdentifier, mState)
									)
									.execute();
							},
							/**
							 * TODO This function is only here for legacy reasons and therefore private. Use iCheckSubSection instead.
							 * @param {string} sTitle The name of the sub-section
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 * @private
							 */
							iSeeSubSectionWithTitle: function (sTitle) {
								return this.iCheckSubSection(sTitle, { visible: true });
							},

							iSeeSectionButtonWithTitle: function (sTitle, mState) {
								return FEBuilder.create(this)
									.hasId(AnchorBarId)
									.has(
										OpaBuilder.Matchers.children(
											FEBuilder.Matchers.states(
												mergeObjects({}, { controlType: "sap.m.Button", text: sTitle }, mState)
											)
										)
									)
									.description(
										Utils.formatMessage("Seeing section button with title '{0}' and state='{1}'", sTitle, mState)
									)
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
							iSeeLabel: function (sDescription) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Label")
									.hasProperties({ text: sDescription })
									.description("Label '" + sDescription + "' is present")
									.execute();
							},
							iSeeSimpleFormWithLabel: function (sDescription) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Label")
									.isDialogElement(true)
									.hasProperties({ text: sDescription })
									.description("SimpleForm has label '" + sDescription + "' is present")
									.execute();
							},
							iSeeSimpleFormWithText: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.ui.layout.form.SimpleForm")
									.isDialogElement(true)
									.doOnChildren(OpaBuilder.create(this).hasType("sap.m.Text").hasProperties({ text: sText }))
									.description("SimpleForm has text '" + sText + "' is present")
									.execute();
							},
							iSeeSimpleFormWithLink: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.ui.layout.form.SimpleForm")
									.isDialogElement(true)
									.doOnChildren(OpaBuilder.create(this).hasType("sap.m.Link").hasProperties({ text: sText }))
									.description("SimpleForm has link '" + sText + "' is present")
									.execute();
							},
							iSeeSimpleFormWithTitle: function (sTitle) {
								return OpaBuilder.create(this)
									.hasSome(
										FEBuilder.Matchers.state("controlType", "sap.m.Title"),
										FEBuilder.Matchers.state("controlType", "sap.ui.core.Title")
									)
									.isDialogElement(true)
									.hasProperties({ text: sTitle })
									.description("SimpleForm has label '" + sTitle + "' is present")
									.execute();
							},
							iSeeGridWithLabel: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.ui.layout.Grid")
									.isDialogElement(true)
									.doOnChildren(OpaBuilder.create(this).hasType("sap.m.Label").hasProperties({ text: sText }))
									.description("Grid Layout has label '" + sText + "' is present")
									.execute();
							},
							iSeeSelectLinksDialog: function () {
								return OpaBuilder.create(this)
									.hasType("sap.m.Title")
									.isDialogElement(true)
									.has(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "info.SELECTION_DIALOG_ALIGNEDTITLE"))
									.description("Seeing dialog open")
									.execute();
							},
							iDoNotSeeFlpLink: function (sDescription) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Link")
									.isDialogElement(true)
									.check(function (links) {
										var bFound = links.some(function (link) {
											return link.getText() === sDescription;
										});
										return bFound === false;
									}, true)
									.description("FLP link with text '" + sDescription + "' is not found")
									.execute();
							},
							iSeeTextInQuickViewForm: function (sText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Text")
									.isDialogElement(true)
									.hasProperties({ text: sText })
									.description("Seeing label with text '" + sText + "'")
									.execute();
							},
							iSeeCreateConfirmation: function () {
								return this._iSeeTheMessageToast(oResourceBundleCore.getText("C_TRANSACTION_HELPER_OBJECT_CREATED"));
							},
							iSeeSaveConfirmation: function () {
								return this._iSeeTheMessageToast(oResourceBundleCore.getText("C_TRANSACTION_HELPER_OBJECT_SAVED"));
							},
							iSeeDeleteConfirmation: function () {
								return this._iSeeTheMessageToast(oResourceBundleCore.getText("C_TRANSACTION_HELPER_DELETE_TOAST_SINGULAR"));
							},
							iSeeConfirmMessageBoxWithTitle: function (sTitle) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Dialog")
									.isDialogElement(true)
									.hasProperties({ title: sTitle })
									.description("Seeing Message dialog open")
									.execute();
							},
							iSeeMoreFormContent: function (sSectionId) {
								return OpaBuilder.create(this)
									.hasId(OPFormIdPrefix + "::" + sSectionId + "::MoreContent")
									.description("Seeing More Form Content in " + sSectionId)
									.execute();
							},
							iDoNotSeeMoreFormContent: function (sSectionId) {
								return OpaBuilder.create(this)
									.hasType("sap.ui.layout.form.Form")
									.check(function (aElements) {
										var bFound = aElements.some(function (oElement) {
											return oElement.getId().includes(sSectionId + "::MoreContent");
										});
										return bFound === false;
									})
									.description("Not Seeing More Form Content in " + sSectionId)
									.execute();
							},
							iSeeControlVMTableTitle: function (sTitle, sNavProperty) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Title")
									.hasId(getTableId(sNavProperty) + "::VM-vm-text")
									.hasProperties({ text: sTitle })
									.description("Seeing variant title '" + sTitle + "'")
									.execute();
							},
							iSeeMessageView: function () {
								return OpaBuilder.create(this)
									.hasType("sap.m.MessageView")
									.isDialogElement(true)
									.description("MessageView is visible")
									.execute();
							},
							iCheckMessageItemsOrder: function (aBoundMessagesInfo) {
								return OpaBuilder.create(this)
									.hasType("sap.m.MessageView")
									.check(function (oMessageView) {
										var messages = oMessageView[0].getItems();
										var aNewBoundMessagesInfo = [];
										if (aBoundMessagesInfo instanceof Array) {
											aNewBoundMessagesInfo = aBoundMessagesInfo;
										} else {
											Object.keys(aBoundMessagesInfo).forEach(function (oElement) {
												aNewBoundMessagesInfo.push(aBoundMessagesInfo[oElement]);
											});
										}
										return (
											messages[0].getGroupName() === aNewBoundMessagesInfo[0].GroupLabel &&
											messages[1].getGroupName() === aNewBoundMessagesInfo[1].GroupLabel &&
											messages[0].getTitle() === aNewBoundMessagesInfo[0].MessageText &&
											messages[1].getTitle() === aNewBoundMessagesInfo[1].MessageText
										);
									}, true)
									.isDialogElement(true)
									.description("MessageItems are correctly ordered")
									.execute();
							},

							iCheckMessageItemProperties: function (oBoundMessageInfo, iMessagePosition) {
								return OpaBuilder.create(this)
									.hasType("sap.m.MessageView")
									.check(function (oMessageView) {
										var messages = oMessageView[0].getItems();
										var bMessageObjectHasExpectedValues =
											messages[iMessagePosition].getGroupName() === oBoundMessageInfo.GroupLabel &&
											messages[iMessagePosition].getTitle() === oBoundMessageInfo.MessageText &&
											messages[iMessagePosition].getSubtitle() === oBoundMessageInfo.SubTitle &&
											messages[iMessagePosition].getActiveTitle() === oBoundMessageInfo.ActiveTitle;
										if (oBoundMessageInfo.Description) {
											return (
												bMessageObjectHasExpectedValues &&
												messages[iMessagePosition].getGroupName() === oBoundMessageInfo.GroupLabel
											);
										}
										return bMessageObjectHasExpectedValues;
									}, true)
									.isDialogElement(true)
									.description("MessageItem is correctly displayed")
									.execute();
							},
							iCheckVisibilityOfButtonWithText: function (sText, bExpectedVisibility) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Button")
									.mustBeVisible(bExpectedVisibility)
									.hasProperties({ text: sText, visible: bExpectedVisibility })
									.description("Button '" + sText + "' is " + (bExpectedVisibility ? "visible" : "NOT visible"))
									.execute();
							},
							iCheckFieldVisibilityInMassEditDialog: function (sFieldID, sValue) {
								return OpaBuilder.create(this)
									.isDialogElement()
									.hasType("sap.m.ComboBox")
									.check(function (aControls) {
										var bControlExists = aControls.some(function (oControl) {
											return oControl.getId() === sFieldID;
										});
										return bControlExists === sValue;
									})
									.description("Checking visibility of field in mass edit dialog")
									.execute();
							}
						}
					}
				].concat(aAdditionalPages)
			);
		}

		return ObjectPage;
	}
);
