/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/ui/qunit/QUnitUtils"], function (Opa5, OpaBuilder, QUnitUtils) {
	"use strict";

	/**
	 * Creates a RegExp for HeaderFacetContainer Facet ID.
	 * @param {string} [sFacetId] The name of the Facet
	 * @returns {object} A RegExp matching the Facet ID.
	 * @private
	 */
	function getHeaderFacetContainerId(sFacetId) {
		return new RegExp("fe::HeaderFacetContainer::" + sFacetId + "$");
	}

	/**
	 * Creates a RegExp for Section Facet ID.
	 * @param {string} [sId] The name of the Section Facet
	 * @returns {object} A RegExp matching the Section Facet ID
	 * @private
	 */
	function getSectionId(sId) {
		return new RegExp("fe::FacetSection::" + sId + "-anchor$");
	}

	/**
	 * Creates a RegExp for FormElement ID for a field added via RTA.
	 * @param {string} [sId] The ID of the Field including the RTA specific part, i.e. GeneralInformation::Content_sap.fe.manageitems.TechnicalTestingService.LineItems_dataField
	 * @returns {object} A RegExp matching the FormElement ID.
	 * @private
	 */
	function getFormElementRTAId(sId) {
		return new RegExp("fe::Form::(.+)" + sId + "_FormElement" + "$");
	}

	/**
	 * Generates a matcher function to match the ID of the referenced control of an overlay.
	 * @param {string | RegExp} [vId] The name of the Facet
	 * @param {boolean} [bCheckParent] Set to true to check the parent element of the control
	 * @returns {object} A RegExp matching the Facet ID.
	 * @private
	 */
	function generateHasReferencedControlIdMatcher(vId, bCheckParent) {
		return function (oOverlay) {
			var oElement = bCheckParent ? oOverlay.getElement().getParent() : oOverlay.getElement(),
				sElementId = oElement && oElement.getId();

			return typeof vId === "string" ? sElementId === vId : vId.test(sElementId); // check ID of referenced control
		};
	}

	return {
		actions: {
			iExecuteById: function (vId, sDescription) {
				return OpaBuilder.create(this).viewId(null).hasId(vId).doPress().description(sDescription).execute();
			},

			iExecuteMeArea: function () {
				return this.iExecuteById("userActionsMenuHeaderButton", "Me Area");
			},

			iExecuteAdaptUI: function () {
				return this.iExecuteById(/RTA_Plugin_ActionButton$/, "Adapt UI");
			},

			iExecuteAdaptation: function () {
				return this.iExecuteById(/adaptationSwitcherButton$/, "Adaptation");
			},

			iExecuteNavigation: function () {
				return this.iExecuteById(/navigationSwitcherButton$/, "Navigation");
			},

			iExecuteDialogConfirm: function () {
				return this.iExecuteById(/confirmVersionTitleButton$/, "Confirm");
			},

			iWaitUntilTheBusyIndicatorIsGone: function () {
				// switch to Adapt UI can take some time, so we explicitly wait for non-busy
				return OpaBuilder.create(this)
					.viewId(null)
					.hasId("mainShell")
					.has(function (oRootView) {
						return oRootView.getBusy() === false;
					})
					.timeout(180) // could take some time
					.description("Busy indicator is gone")
					.execute();
			},

			iExecuteRightContextMenuById: function (vId, sDescription, bCheckParent) {
				var fnHasReferencedControlId = generateHasReferencedControlIdMatcher(vId, bCheckParent);

				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.ui.dt.ElementOverlay")
					.has(fnHasReferencedControlId)
					.do(function (oOverlay) {
						oOverlay.$().trigger("contextmenu"); // right click
					})
					.description(sDescription)
					.execute();
			},

			iExecuteLeftContextMenuById: function (vId, sDescription, bCheckParent) {
				var fnHasReferencedControlId = generateHasReferencedControlIdMatcher(vId, bCheckParent);

				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.ui.dt.ElementOverlay")
					.has(fnHasReferencedControlId)
					.doPress()
					.description(sDescription)
					.execute();
			},

			iExecuteRightContextMenuOnHeaderContainer: function () {
				return this.iExecuteRightContextMenuById(/fe::HeaderContentContainer$/, "Context menu for Header Container");
			},

			iExecuteRightContextMenuOnVariantManagement: function () {
				return this.iExecuteRightContextMenuById(/fe::PageVariantManagement$/, "Context menu for Variant Management");
			},

			iExecuteRightContextMenuOnTable: function () {
				return this.iExecuteRightContextMenuById(/fe::table::SalesOrderManage::LineItem$/, "Context menu for Table");
			},

			iExecuteRightContextMenuOnFilterBar: function () {
				return this.iExecuteRightContextMenuById(/fe::FilterBar::SalesOrderManage$/, "Context menu for FilterBar");
			},

			/*
			iExecuteLeftContextMenuOnHeaderContainer: function() {
				return this.iExecuteLeftContextMenuById(/fe::HeaderContentContainer$/, "Left Context menu for Header Container");
			},
			*/

			iExecuteRightContextMenuOnHeaderFacet: function (sFacetId) {
				return this.iExecuteRightContextMenuById(getHeaderFacetContainerId(sFacetId), "Context menu for " + sFacetId, true);
			},

			iExecuteRightContextMenuOnSection: function (sId) {
				return this.iExecuteRightContextMenuById(getSectionId(sId), "Context menu for " + sId, false);
			},

			iExecuteRightContextMenuOnFormContainer: function (sId) {
				return this.iExecuteRightContextMenuById(
					new RegExp("fe::FormContainer::" + sId + "$"),
					"Context menu for Form Container " + sId
				);
			},

			iExecuteRightContextMenuOnHeaderFacetFormContainer: function (sId) {
				return this.iExecuteRightContextMenuById(
					new RegExp("fe::HeaderFacet::FormContainer::" + sId + "$"),
					"Context menu for HeaderFacet Form Container " + sId
				);
			},

			iExecuteRightContextMenuOnHeaderFacetFormElement: function (sId) {
				return this.iExecuteRightContextMenuById(
					new RegExp("fe::HeaderFacet::FormContainer::" + sId + "::FormElement" + "$"),
					"Context menu for HeaderFacet Form Element " + sId
				);
			},

			iExecuteLeftContextMenuOnSection: function (sId) {
				return this.iExecuteLeftContextMenuById(getSectionId(sId), "Left context menu for " + sId, false);
			},

			iExecuteLeftContextMenuOnHeaderFacet: function (sFacetId) {
				return this.iExecuteLeftContextMenuById(getHeaderFacetContainerId(sFacetId), "Left Context menu for " + sFacetId, true);
			},

			iExecuteLeftContextMenuOnHeaderFacetFormContainer: function (sId) {
				return this.iExecuteLeftContextMenuById(
					new RegExp("fe::HeaderFacet::FormContainer::" + sId + "$"),
					"Left context menu for HeaderFacet Form Container " + sId
				);
			},

			iExecuteLeftContextMenuOnHeaderFacetFormElement: function (sId) {
				return this.iExecuteLeftContextMenuById(
					new RegExp("fe::HeaderFacet::FormContainer::" + sId + "::FormElement" + "$"),
					"Left context menu for HeaderFacet Form Element " + sId
				);
			},

			iExecuteRightContextMenuOnFieldAddedViaRTA: function (sId) {
				return this.iExecuteRightContextMenuById(getFormElementRTAId("_" + sId), "Context menu for Field " + sId);
			},

			iExecuteFocusOnAnchorBar: function () {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasId(/fe::ObjectPage-anchBar$/)
					.doPress()
					.description("Focus on AnchorBar")
					.execute();
			},

			iExecutePopOverActionByIcon: function (sIcon, sDescription) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.ui.unified.MenuItem")
					.hasProperties({ icon: "sap-icon://" + sIcon }) // e.g. edit, add, rename, less (=remove), scissors (=cut), paste
					.isDialogElement()
					.doPress()
					.description(sDescription)
					.execute();
			},

			iExecutePopOverButtonByIcon: function (sIcon, sDescription) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.Button")
					.hasProperties({ icon: "sap-icon://" + sIcon })
					.isDialogElement()
					.doPress()
					.description(sDescription)
					.execute();
			},

			iExecutePopOverActionRename: function (sId) {
				return this.iExecutePopOverActionByIcon("edit", "Press rename on " + sId);
			},

			iExecutePopOverActionAdd: function (sDescription) {
				return this.iExecutePopOverActionByIcon("add", sDescription);
			},

			iExecutePopOverActionRemove: function (sDescription) {
				return this.iExecutePopOverActionByIcon("less", sDescription);
			},

			iExecutePopOverActionCut: function (sDescription) {
				return this.iExecutePopOverActionByIcon("scissors", sDescription);
			},

			iExecutePopOverActionPaste: function (sDescription) {
				return this.iExecutePopOverActionByIcon("paste", sDescription);
			},

			iExecutePopOverActionDuplicate: function (sDescription) {
				return this.iExecutePopOverActionByIcon("duplicate", "Duplicate Variant '" + sDescription + "'");
			},

			iExecutePopOverActionSettings: function (sDescription) {
				return this.iExecutePopOverActionByIcon("key-user-settings", "Open " + sDescription + " Settings");
			},

			iExecutePopOverActionEmbedContent: function (sDescription) {
				return this.iExecutePopOverActionByIcon("tnt/content-enricher", "Open " + sDescription + " Settings");
			},

			iSwitchToGroupViewInTheFilterBarDialog: function () {
				return this.iExecutePopOverButtonByIcon("group-2", "Switch to grouped view in filter bar dialog");
			},

			iSelectExpandFiltersgroupInTheFilterBarDialog: function (sFiltersgroupName) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.Panel")
					.hasChildren(OpaBuilder.create(this).hasType("sap.m.Title").hasProperties({ text: sFiltersgroupName }))
					.doOnChildren(OpaBuilder.create(this).hasType("sap.m.Button").doPress())
					.description("Expanding filter group wiht name '" + sFiltersgroupName + "'")
					.execute();
			},

			iSelectCheckBoxInTheFilterBarDialog: function (sText) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.CustomListItem")
					.doOnChildren(
						OpaBuilder.create(this)
							.hasType("sap.m.CustomListItem")
							.hasChildren(OpaBuilder.create(this).hasType("sap.m.Label").hasProperties({ text: sText }))
							.doOnChildren(OpaBuilder.create(this).hasType("sap.m.CheckBox").doPress())
					)
					.description("Selected Checkbox next to '" + sText + "'")
					.execute();
			},

			iChangeVisibilityFilter: function (sSelection) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.Bar")
					.isDialogElement()
					.doOnChildren(OpaBuilder.create(this).hasType("sap.m.Select").checkNumberOfMatches(1).doEnterText(sSelection))
					.description("Changed displayed fields to '" + sSelection + "'")
					.execute();
			},

			iEnterUrlInTheTextArea: function (sUrl) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.TextArea")
					.hasId("sapUiRtaAddIFrameDialog_EditUrlTA")
					.isDialogElement()
					.doEnterText(sUrl)
					.description("Added URL '" + sUrl + "' to Text Area")
					.execute();
			},

			iSwitchToReorderOnDialog: function () {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.Button")
					.isDialogElement()
					.hasProperties({ text: "Reorder" })
					.doPress()
					.description("Switch to reorder view")
					.execute();
			},

			_iSelectALabelOnTheReorderDialog: function (sText) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.Label")
					.isDialogElement()
					.hasProperties({ text: sText })
					.doPress()
					.execute();
			},

			/**
			 * Presses the according Button for the Reorder Process
			 * @param {string} [sLabel] label of column which should be reordered
			 * @param {number} [nNewPlace] which of the four reorder buttons should be pressed (0-3), effectively changes where the selected Label should move to
			 * @private
			 */

			iReorderTableColumn: function (sLabel, nNewPlace) {
				this._iSelectALabelOnTheReorderDialog(sLabel);
				var iconSpecific,
					Icon = "sap-icon://";

				if (nNewPlace === 0) {
					iconSpecific = "collapse-group";
				} else if (nNewPlace === 1) {
					iconSpecific = "slim-arrow-up";
				} else if (!nNewPlace === 2) {
					iconSpecific = "slim-arrow-down";
				} else if (!nNewPlace === 3) {
					iconSpecific = "expand-group";
				}
				Icon += iconSpecific;
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.Button")
					.isDialogElement()
					.hasProperties({ icon: Icon })
					.doPress()
					.description("Reorder '" + sLabel + "'")
					.execute();
			},

			iEnterTextInSearchfield: function (sNewText) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.SearchField")
					.isDialogElement()
					.checkNumberOfMatches(1)
					.doEnterText(sNewText)
					.description("Enter text: '" + sNewText + "'")
					.execute();
			},

			iEnterTextinFilterField: function (sText) {
				return OpaBuilder.create(this)
					.hasType("sap.ui.mdc.field.FieldMultiInput")
					.checkNumberOfMatches(1)
					.doEnterText(sText)
					.description("Enter text: '" + sText + "'")
					.execute();
			},

			iEnterTextinDialogField: function (sText) {
				return (
					OpaBuilder.create(this)
						.hasType("sap.m.Input")
						//.hasId("versionTitleInput")
						.doEnterText(sText)
						.description("Enter text: '" + sText + "'")
						.execute()
				);
			},

			iSelectAFieldInTheDialog: function (vTooltip) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.CustomListItem")
					.isDialogElement()
					.has(function (oListItem) {
						var sToolTip = oListItem.getTooltip(); // currently we check the tooltip
						return typeof vTooltip === "string" ? sToolTip === vTooltip : vTooltip.test(sToolTip);
					})
					.doPress()
					.description("Select " + vTooltip)
					.execute();
			},

			iExecutePopOverOk: function () {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.Button")
					.hasProperties({ text: "OK" }) // .has(OpaBuilder.Matchers.resourceBundle("title", "sap.ui.rta", "BTN_FREP_OK")) does not work?
					.isDialogElement()
					.doPress()
					.description("OK Button")
					.execute();
			},

			iExecuteActivate: function () {
				return this.iExecuteById(/sapUiRta_activate$/, "Activate");
			},

			iExecuteSave: function () {
				return this.iExecuteById(/sapUiRta_save$/, "Save");
			},

			iExecuteExit: function () {
				return this.iExecuteById(/sapUiRta_exit$/, "Exit");
			},

			iExecuteUndo: function () {
				return this.iExecuteById(/sapUiRta_undo$/, "Undo");
			},

			iEnterTextForRTAEditableField: function (sNewText) {
				return OpaBuilder.create(this)
					.hasType("sap.ui.dt.ElementOverlay")
					.has(function (oOverlay) {
						if (oOverlay.$().hasClass("sapUiDtOverlaySelected")) {
							var $Overlay = oOverlay.$().find(".sapUiRtaEditableField");
							return $Overlay.children()[0];
						}
						return null;
					})
					.do(function (oEditableFieldDomNode) {
						oEditableFieldDomNode.innerHTML = sNewText;
						QUnitUtils.triggerEvent("keypress", oEditableFieldDomNode, { which: 13, keyCode: 13 });
						oEditableFieldDomNode.blur();
					})
					.description("Enter text: " + sNewText)
					.execute();
			},

			iEnterTextForTitle: function (sNewText) {
				return this.iEnterTextForRTAEditableField(sNewText);
			},

			iEnterTextForViewField: function (sNewText) {
				return OpaBuilder.create(this)
					.hasType("sap.m.Input")
					.isDialogElement()
					.doEnterText(sNewText, true)
					.description("Entering text: " + sNewText + " as variant name")
					.execute();
			}
		},

		assertions: {
			iSeeTheFLPToolbar: function () {
				return OpaBuilder.create(this)
					.hasType("sap.ushell.ui.ShellHeader")
					.hasId("shell-header")
					.description("Seeing the FLP toolbar")
					.execute();
			},

			iSeeTheRTAToolbar: function () {
				return OpaBuilder.create(this).hasType("sap.ui.rta.toolbar.Fiori").description("Seeing the RTA toolbar").execute();
			},

			iSeeTheHeaderFacet: function (sFacetId) {
				return OpaBuilder.create(this)
					.hasType("sap.fe.templates.ObjectPage.controls.StashableHBox")
					.hasId(getHeaderFacetContainerId(sFacetId))
					.description("Seeing the Header Facet " + sFacetId)
					.execute();
			},

			iSeeTheFieldAddedViaRTA: function (sId) {
				return OpaBuilder.create(this)
					.hasType("sap.ui.layout.form.FormElement")
					.hasId(getFormElementRTAId("_" + sId))
					.description("Seeing the Field " + sId)
					.execute();
			},

			iSeeTheEditableHeaderFieldAddedViaRTA: function (sId) {
				return OpaBuilder.create(this)
					.hasType("sap.ui.layout.form.FormElement")
					.hasId(new RegExp("fe::EditableHeaderForm_(.+)_" + sId + "_FormElement" + "$"))
					.description("Seeing the Editable Header Field " + sId)
					.execute();
			},

			iSeeTheEditableHeaderField: function (sId) {
				return OpaBuilder.create(this)
					.hasType("sap.ui.layout.form.FormElement")
					.hasId(new RegExp("fe::HeaderFacet::FormContainer::" + sId + "::FormElement" + "$"))
					.description("Seeing the Editable Header Field " + sId)
					.execute();
			},

			iDoNotSeeTheHeaderFacet: function (sFacetId) {
				var vId = getHeaderFacetContainerId(sFacetId);

				return OpaBuilder.create(this)
					.hasType("sap.fe.templates.ObjectPage.controls.StashableHBox")
					.check(function (facets) {
						var bFound = facets.some(function (oFacet) {
							return typeof vId === "string" ? oFacet.getId() === vId : vId.test(oFacet.getId());
						});
						return bFound === false;
					}, true)
					.description("Not seeing the Header Facet " + sFacetId)
					.execute();
			},

			iDoNotSeeTheField: function (sId) {
				return OpaBuilder.create(this)
					.hasType("sap.ui.layout.form.FormElement")
					.check(function (elements) {
						var bFound = elements.some(function (element) {
							return element.getId().indexOf(sId) > -1;
						});
						return bFound === false;
					}, true)
					.description("Not seeing the Field " + sId)
					.execute();
			},

			iSeeTheElementOverlayById: function (vId, sDescription, bCheckParent) {
				var fnHasReferencedControlId = generateHasReferencedControlIdMatcher(vId, bCheckParent);

				return OpaBuilder.create(this)
					.hasType("sap.ui.dt.ElementOverlay")
					.has(fnHasReferencedControlId)
					.description(sDescription)
					.execute();
			},

			iDoNotSeeTheElementOverlayById: function (vId, sDescription, bCheckParent) {
				var fnHasReferencedControlId = generateHasReferencedControlIdMatcher(vId, bCheckParent);

				return OpaBuilder.create(this)
					.hasType("sap.ui.dt.ElementOverlay")
					.check(function (oOverlay) {
						var bFound = oOverlay.some(fnHasReferencedControlId);
						return bFound === false;
					}, true)
					.description(sDescription)
					.execute();
			},

			iSeeTheElementOverlayForTheApp: function () {
				return this.iSeeTheElementOverlayById(/component---appRootView--appContent$/, "Seeing the ElementOverlay for the App");
			},

			iSeeThePopover: function () {
				return OpaBuilder.create(this).hasType("sap.ui.unified.Menu").description("Seeing the Popover").execute();
			},

			iSeeTheButtonByIcon: function (sIcon, sDescription) {
				return OpaBuilder.create(this)
					.hasType("sap.m.Button")
					.isDialogElement()
					.hasProperties({ icon: sIcon })
					.description("Seeing " + sDescription)
					.execute();
			},

			iSeeTheMenuItemByIcon: function (sIcon, sDescription) {
				return OpaBuilder.create(this)
					.hasType("sap.ui.unified.MenuItem")
					.isDialogElement()
					.hasProperties({ icon: sIcon })
					.description("Seeing " + sDescription)
					.execute();
			},

			iDoNotSeeTheButtonByIcon: function (sIcon, sDescription) {
				return OpaBuilder.create(this)
					.hasType("sap.m.Button")
					.isDialogElement()
					.check(function (aButtons) {
						var bFound = aButtons.some(function (oButton) {
							return oButton.getProperty("icon") === sIcon;
						});
						return bFound === false;
					}, true)
					.description("Not seeing " + sDescription)
					.execute();
			},

			iDoNotSeeTheMenuItemByIcon: function (sIcon, sDescription) {
				return OpaBuilder.create(this)
					.hasType("sap.ui.unified.MenuItem")
					.isDialogElement()
					.check(function (aButtons) {
						var bFound = aButtons.some(function (oButton) {
							return oButton.getProperty("icon") === sIcon;
						});
						return bFound === false;
					}, true)
					.description("Not seeing " + sDescription)
					.execute();
			},

			iSeeTheVariantManagementPopover: function () {
				return this.iSeeTheMenuItemByIcon("sap-icon://duplicate", "The Popover");
			},

			iSeeTheRTAPopover: function () {
				return this.iSeeTheMenuItemByIcon("sap-icon://key-user-settings", "The RTAPopover");
			},

			iSeeTheRenameButton: function () {
				return this.iSeeTheMenuItemByIcon("sap-icon://edit", "the button 'rename'");
			},

			iSeeTheAddButton: function () {
				return this.iSeeTheMenuItemByIcon("sap-icon://add", "the button 'add'");
			},

			iSeeTheCreateGroupButton: function () {
				return this.iSeeTheMenuItemByIcon("sap-icon://add-folder", "the button 'create group'");
			},

			iDoNotSeeTheRenameButton: function () {
				return this.iDoNotSeeTheMenuItemByIcon("sap-icon://edit", "the button 'rename'");
			},

			iDoNotSeeTheAddButton: function () {
				return this.iDoNotSeeTheMenuItemByIcon("sap-icon://add", "the button 'add'");
			},

			iDoNotSeeTheRemoveButton: function () {
				return this.iDoNotSeeTheMenuItemByIcon("sap-icon://less", "the button 'remove'");
			},

			iSeeThePopoverDialog: function () {
				return OpaBuilder.create(this).hasType("sap.m.Dialog").description("Seeing the Popover Dialog").execute();
			},

			iSeeThePopoverDialogWithId: function (sId) {
				return OpaBuilder.create(this)
					.hasType("sap.m.Dialog")
					.hasId(sId)
					.description("Seeing the Popover Dialog with Id:", sId)
					.execute();
			},

			iSeeTheHeaderFacetOverlay: function (sFacetId) {
				return this.iSeeTheElementOverlayById(getHeaderFacetContainerId(sFacetId), "Seeing the Header Facet: " + sFacetId, true);
			},

			iDoNotSeeTheHeaderFacetOverlay: function (sFacetId) {
				return this.iDoNotSeeTheElementOverlayById(
					getHeaderFacetContainerId(sFacetId),
					"Not seeing the Header Facet Overlay: " + sFacetId,
					true
				);
			},

			iSeeTheTitleOnTheUI: function (sText) {
				// Rename HeaderFacet seems to be locally more stable without .checkNumberOfMatches(1)
				return OpaBuilder.create(this)
					.hasType("sap.m.Title")
					.hasProperties({ text: sText })
					.description("Seeing the Title " + sText)
					.execute();
			},

			iSeeTheLinkOnTheUI: function (sText) {
				return OpaBuilder.create(this)
					.hasType("sap.m.Link")
					.hasProperties({ text: sText })
					.checkNumberOfMatches(1)
					.description("Seeing the Link " + sText)
					.execute();
			},

			iCheckTheHeaderFacetTitle: function (sFacetId, sText) {
				return OpaBuilder.create(this)
					.hasType("sap.fe.templates.ObjectPage.controls.StashableHBox")
					.hasId(getHeaderFacetContainerId(sFacetId))
					.hasProperties({ title: sText })
					.description("The Header Facet  " + sFacetId + " has title " + sText)
					.execute();
			},

			iSeeTheSectionTextById: function (sId, sText) {
				var vId = getSectionId(sId);

				return OpaBuilder.create(this)
					.hasId(vId)
					.hasProperties({ text: sText })
					.description("Seeing the section " + sId + " with text " + sText)
					.execute();
			},

			iSeeTheSectionAtPosition: function (sId, iPosition) {
				var vId = getSectionId(sId);

				return OpaBuilder.create(this)
					.hasType("sap.m.IconTabFilter") // (not for HeaderInfo which is of type sap.m.MenuButton)
					.hasId(vId)
					.has(function (oElement) {
						var aContent = oElement.getParent().getItems(), // anchBar content
							iFound = aContent.findIndex(function (oSection) {
								return vId.test(oSection.getId());
							});

						return iFound === iPosition;
					})
					.description("Seeing the section " + sId + " at position " + iPosition)
					.execute();
			},

			iSeeTheAddedIFrameInHeader: function (sUrlWithContentForIFrame) {
				return OpaBuilder.create(this)
					.hasType("sap.ui.dt.AggregationOverlay")
					.hasProperties({ aggregationName: "headerContent" })
					.doOnChildren(OpaBuilder.create(this).hasType("sap.ui.fl.util.IFrame"))
					.description("Seeing the application with URL: " + sUrlWithContentForIFrame + " in iFrame in header content container")
					.execute();
			},

			iSeeTheIFrameInSectionWithTitle: function (sSectionTitle) {
				return OpaBuilder.create(this)
					.hasType("sap.uxap.ObjectPageSection")
					.hasProperties({ title: sSectionTitle })

					.doOnChildren(OpaBuilder.create(this).hasType("sap.ui.fl.util.IFrame"))
					.description("Seeing iFrame in section with title '" + sSectionTitle + "'")
					.execute();
			}
		}
	};
});
