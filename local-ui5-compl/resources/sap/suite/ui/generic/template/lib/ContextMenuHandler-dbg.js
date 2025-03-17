sap.ui.define([
	"sap/base/util/extend",
	"sap/base/util/ObjectPath",
	"sap/m/MessageBox",
	"sap/suite/ui/generic/template/genericUtilities/controlHelper",
	"sap/suite/ui/generic/template/genericUtilities/FeLogger",
	"sap/ui/base/Object",
	"sap/ui/base/Event"
], function (extend, ObjectPath, MessageBox, controlHelper, FeLogger, BaseObject, Event) {
	"use strict";

	/* This class provides generic functionality for handling of the context menu for one smart control (oSourceControl).
	 * Note that this is currently restricted to the case that oSourceControl is a table.
	 * oConfiguration is an object which contains logic which is specific to the floorplan using this functionality.
     */
	var oLogger = new FeLogger("lib.ContextMenuHandler").getLogger();
	
	// Constants
	var MAX_RECORDS_OPEN_IN_NEW_TAB = 10;
	var aToolbarContentsToBeOmitted = ["btnPersonalisation", "btnExcelExport"];

	function getMethods(oController, oTemplateUtils, oState, oSourceControl, oConfiguration) {

		//Type definitions

		/**
		 * @typedef {object} sap.suite.ui.generic.template.lib.ContextMenuHandler.FocusInfo Information about the applicable records for the context menu
		 * @property {sap.ui.model.Context} focussedBindingContext - Binding context of the currently focussed row
		 * @property {Array<sap.ui.model.Context>} applicableContexts - Array of contexts applicable to the context menu
		 * @property {boolean} doesApplicableEqualSelected - If the focussed row is part of selected rows
		 */

		/**
		 * @typedef {object} sap.suite.ui.generic.template.lib.ContextMenuHandler.ContextMenuEntry Context menu entry
		 * @property {string} text - Text
		 * @property {string} icon - Icon
		 * @property {string} key - Uniquely identifiable key
		 * @property {boolean} enabled - Is the entry enabled
		 * @property {Array<ContextMenuEntry>} children - Child entries
		 * @property {Promise<Function|undefined>} handlerPromise - A promise which resolves the handler method for the current entry
		 */

		var oView = oController.getView();
		var oTemplatePrivateModel = oView.getModel("_templPriv");
		var oCommonUtils = oTemplateUtils.oCommonUtils;
		var oComponentUtils = oTemplateUtils.oComponentUtils;

		// reserve a place in the template private model which can be used to determine the content of the context menu in a declarative way.
		// The corresponding entries are evaluated in .fragments.SmartControlContextMenu fragment.
		var sModelPathPrefix = "/generic/controlProperties/" + oView.getLocalId(oSourceControl.getId());
		if (!oTemplatePrivateModel.getProperty(sModelPathPrefix)){
			oTemplatePrivateModel.setProperty(sModelPathPrefix, {});
		}
		var sModelPath = sModelPathPrefix + "/contextMenu";
		var sItemsPath = sModelPath + "/items";
		oTemplatePrivateModel.setProperty(sModelPath, {
			items: []
		});

		var oPresentationControlHandler = oTemplateUtils.oServices.oPresentationControlHandlerFactory.getPresentationControlHandler(oSourceControl);
		var bNavigationSupported = oComponentUtils.canNavigateToSubEntitySet(oSourceControl.getEntitySet());
		var mHandlers; // maps keys of context menu entries to handler functions for the corresponding entry
		var iCreatedMenuItemsCounter = 0; // increased whenever a new MenuItem is being created In fnAddMenuItem). Used to generate a key for mHandlers.
		// Store the outbound navigation target
		var sOutboundNavigationTarget = oSourceControl.getTable().getContextMenu().data("CrossNavigation");
		var oOutbound = sOutboundNavigationTarget && fnGetOutboundInfoFromManifest(sOutboundNavigationTarget);
		/**
		 * The method does the following
		 *  - Adds an entry (menu item) to the context menu.
		 *  - Waits for the handler promise to be resolved and 
		 * 		- Enables the menu item only if it has the handler method
		 * 		- Registers the press event handler to the "mHandlers"
		 *  - If the current menu item contains child entries, it waits for all the children handler promises to be resolved and
		 * 		- Enables the child menu items based on the availability of respective handlers
		 * 		- Enables the current menu item if at least one child item is enabled.
		 * 
		 *  Note: When the current entry has children, please pass "oHandlerPromise" as null.
		 * 
		 * @param {string} sPathToItems Binding path for the items
		 * @param {Array<sap.suite.ui.generic.template.lib.ContextMenuHandler.ContextMenuEntry>} aItems Array which stores all context menu entries
		 * @param {string} sText Text of the context menu item
		 * @param {string} sIcon Icon for the context menu item
		 * @param {boolean} bStartsSection Defines whether a visual separator should be rendered before the item
		 * @param {Promise<Function|boolean>} oHandlerPromise Optional parameter. A promise which resolves the press handler method to the current menu item
		 * @param {Array<sap.suite.ui.generic.template.lib.ContextMenuHandler.ContextMenuEntry>} aChildren Child entries for the current menu item
		 */
		function fnAddMenuItem(sPathToItems, aItems, sText, sIcon, bStartsSection, oHandlerPromise, aChildren){
			iCreatedMenuItemsCounter++;
			var sKey = "ContextMenuKey" + iCreatedMenuItemsCounter;
			var iPosition = aItems.length;
			aChildren = aChildren || [];
			if (oHandlerPromise){
				oHandlerPromise.then(function(fnHandler){ 
					if (fnHandler){
						mHandlers[sKey] = fnHandler;
						oTemplatePrivateModel.setProperty(sPathToItems + "/" + iPosition + "/enabled", true);
					}
				});
			} else if (aChildren.length > 0) {
				var aHandlerPromisesForChildren = aChildren.map(function (oMenuItem){
					return oMenuItem.handlerPromise;
				});
				Promise.all(aHandlerPromisesForChildren).then(function (aHandlersForChildren) {
					var bParentEnabled = false;
					// Enabling the child menu items
					aHandlersForChildren.forEach(function (fnHandler, iIndex) {
						if (fnHandler) {
							oTemplatePrivateModel.setProperty(sPathToItems + "/" + iPosition + "/children/" + iIndex + "/enabled", true);
							// Parent is enabled if at least one child is enabled
							bParentEnabled = true;
						}
					});
					// Enabling the parent
					oTemplatePrivateModel.setProperty(sPathToItems + "/" + iPosition + "/enabled", bParentEnabled);					
				});
			}
			bStartsSection = bStartsSection && aItems.length > 0;
			aItems.push({
				text: sText,
				icon: sIcon,
				key: sKey,
				enabled: false,
				startsSection: bStartsSection,
				children: aChildren,
				handlerPromise: oHandlerPromise
			});
		}

		var fnAddMainMenuItem = fnAddMenuItem.bind(null, sItemsPath);

		// Executes the custom / breakout action
		function fnExecuteCustomAction (oFocusInfo, oBreakoutControlData, oToolbarControl) {
			// Setting the focus info to the controller's state 
			// which will be used by ExtensionAPI#getSelectedContexts
			oState.oFocusInfo = extend(oFocusInfo, {smartControlId: oSourceControl.getId()});
			// If breakout control is registered with a command execution, execute the command.
			// Otherwise, invoke the press event handler of the breakout control.
			if (oBreakoutControlData.command) {
				fnExecuteCustomActionByCommand(oBreakoutControlData);
			} else {
				fnExecuteCustomActionByPressEvent(oBreakoutControlData, oToolbarControl);
			}
			// Resetting the focus info
			oState.oFocusInfo = null;
		}

		// Finds the "CommandExecution" from the smart table's dependents and execute it.
		function fnExecuteCustomActionByCommand (oBreakoutControlData) {
			var oCommandExecution = oSourceControl.getDependents().find(function(oDependent){
				return oDependent.isA("sap.ui.core.CommandExecution") && (oDependent.getProperty("command") === oBreakoutControlData.command);
			});
			if (!oCommandExecution) {
				return;
			}
			oCommandExecution.fireExecute();
		}

		// Invokes the "press" event handler of breakout control
		function fnExecuteCustomActionByPressEvent (oBreakoutControlData, oToolbarControl) {
			// Get the press handler name from the "press" property of action from manifest
			var sPressHandlerName = oBreakoutControlData.press;
			var fnEventHandler = null;
			// Case 1: If the extension controller extends "sap.ui.core.mvc.ControllerExtension",
			//   the press handler name would be in ".extension.controller_extension_name." format.
			//   Here, event handler function is derived using ObjectPath.
			//
			// Case 2: If the extension controller extends "sap.ui.core.mvc.Controller",
			//   then the press property from manifest has the event handler name.
			//   Here, event handler function can be directly obtained from oController.
			if (sPressHandlerName.startsWith(".")) {
				// Omit the leading "." to find out the press handler path
				var sPressHandlerPath = sPressHandlerName.substring(1);
				fnEventHandler = ObjectPath.create(sPressHandlerPath, oController);
			} else {
				fnEventHandler = oController[sPressHandlerName];
			}
			var oEventSource = oToolbarControl;
			// Creating a custom event with toolbar control as source
			var oPressEvent = new Event("press", oEventSource);
			fnEventHandler && fnEventHandler.apply(oController, [oPressEvent]);
		}

		// Returns the handler for standard action
		function getHandlePromiseForStandardAction(oFocusInfo, oToolbarControlData, oButton){
			var getHandler = function(bEnabled){
				return bEnabled && oConfiguration.executeAction.bind(null, oFocusInfo, oToolbarControlData, oButton);
			};
			// Check whether the action should be enabled
			var oEnablementInfo = oCommonUtils.getToolbarActionEnablementInfo(oToolbarControlData, oFocusInfo.applicableContexts, oSourceControl);
			// If the "oEnablementInfo" contains "enabledPromise", wait till the promise fulfilled and return the handler
			if (oEnablementInfo.enabledPromise){
				return oEnablementInfo.enabledPromise.then(getHandler);
			}
			// Otherwise, just return the handler
			return Promise.resolve(getHandler(oEnablementInfo.enabled));
		}

		// Returns the handler for breakout action
		function getHandlePromiseForBreakoutAction (oFocusInfo, oBreakoutControlData, oButton) {
			var getHandler = function (bEnabled) {
				return bEnabled && fnExecuteCustomAction.bind(null, oFocusInfo, oBreakoutControlData, oButton);
			};
			/**
			 * Skip the process for the following conditions
			 * 1. The action is marked as "excludeFromContextMenu"
			 * 2. The action is unbound (doesn't require selection)
			 */
			if (oBreakoutControlData.excludeFromContextMenu || !oBreakoutControlData.requiresSelection) {
				return;
			}
			var bEnabled = oCommonUtils.isBreakoutActionEnabled(oBreakoutControlData, oFocusInfo.applicableContexts, oSourceControl.getModel(), oSourceControl, true);
			return Promise.resolve(getHandler(bEnabled));
		}

		function fnAddToolbarButtonToContextMenu(sPathToItems, oFocusInfo, oToolbarControlsData, aItems, oButton, bStartsNewSection){
			// Case 1: If button has the stable id, use it to find local id.
			// Case 2: If the button was created using design time adaption, use the custom data "originalButtonId" to find local id. 
			var sButtonLocalId = oView.getLocalId(oButton.getId()) || oView.getLocalId(oButton.data("originalButtonId"));

			var oHandlePromise = null;
			//Check if the control data available on standard actions
			var oStandardControlData = oToolbarControlsData.standardActions.find(function(oControlData){
				return oControlData.ID === sButtonLocalId;
			});

			// If not check on breakout actions
			var oBreakoutControlData = oConfiguration.findBreakoutActionByLocalId(oToolbarControlsData.breakoutActions, sButtonLocalId);

			// Get the handle promise based on the control type (standard / breakout)
			if (oStandardControlData) {
				oHandlePromise = getHandlePromiseForStandardAction(oFocusInfo, oStandardControlData, oButton);
			} else if (oBreakoutControlData) {
				oHandlePromise = getHandlePromiseForBreakoutAction(oFocusInfo, oBreakoutControlData, oButton);
			}

			if (oHandlePromise){
				fnAddMenuItem(sPathToItems, aItems, oButton.getText(), oButton.getIcon(), bStartsNewSection, oHandlePromise);
				return true;
			}
			return false;
		}

		// Adds the menu button to context menu and creates a sub-menu for the child entries 
		function fnAddMenuButtonToContextMenu(sPathToItems, oFocusInfo, oToolbarControlsData, aItems, oMenuButton, bStartsNewSection) {
			var aMenuItems = oMenuButton.getMenu().getItems();

			var aChildContextMenuEntries = [];
			aMenuItems.forEach(function (oMenuItem) {
				var bStartsSectionOnSubMenu = oMenuItem.getStartsSection();
				fnAddToolbarButtonToContextMenu(sItemsPath, oFocusInfo, oToolbarControlsData, aChildContextMenuEntries, oMenuItem, bStartsSectionOnSubMenu);
			});

			if (aChildContextMenuEntries.length > 0) {
				fnAddMenuItem(sPathToItems, aItems, oMenuButton.getText(), oMenuButton.getIcon(), bStartsNewSection, null, aChildContextMenuEntries);				
				return true;
			}
			return false;
		}

		/**
		 * Adds the toolbar buttons and menu buttons to the context menu
		 * @param {sap.suite.ui.generic.template.lib.ContextMenuHandler.FocusInfo} oFocusInfo Focus info
		 * @param {Array<sap.suite.ui.generic.template.lib.ContextMenuHandler.ContextMenuEntry>} aItems Array of context menu items
		 */
		function fnAddToolbarButtonsToContextMenu(oFocusInfo, aItems){
			var aStandardActions = oCommonUtils.getToolbarCustomData(oSourceControl);
			var mBreakoutActions = oCommonUtils.getBreakoutActions(oSourceControl);
			var aBreakoutActions = mBreakoutActions ? Object.values(mBreakoutActions) : [];
			
			var oToolbarControlsData = {
				standardActions: aStandardActions,
				breakoutActions: aBreakoutActions
			};
			var oToolbar = oSourceControl.getToolbar();
			var aToolbarContent = oToolbar.getContent();
			var bFirst = true;
			aToolbarContent.forEach(function(oToolbarEntry){
				if (!(oToolbarEntry.getVisible && oToolbarEntry.getVisible())) {
					return;
				}
				var bIgnoreToolbarEntry = aToolbarContentsToBeOmitted.some(function (sControlToBeOmitted) {
					return oToolbarEntry.getId().includes(sControlToBeOmitted);
				});
				if (bIgnoreToolbarEntry) {
					return;
				}
				if (controlHelper.isButton(oToolbarEntry)){
					bFirst = !fnAddToolbarButtonToContextMenu(sItemsPath, oFocusInfo, oToolbarControlsData, aItems, oToolbarEntry, bFirst) && bFirst;
				} else if (controlHelper.isMenuButton(oToolbarEntry)){
					bFirst = !fnAddMenuButtonToContextMenu(sItemsPath, oFocusInfo, oToolbarControlsData, aItems, oToolbarEntry, bFirst) && bFirst;
				}
			});
		}

		/********************************************************
		 * Methods related to "Open in new tab" functionality
		 ********************************************************/

		// Currently the inactive contexts (inline creation rows which are untouched and missing required props) 
		// are considered as non navigable contexts
		function fnIsContextNavigable (oContext) {
			var bIsEmptyRow = oContext.isInactive();
			//TODO: add other conditions if necessary
			return !bIsEmptyRow;
		}

		// Fetches the outbound target from manifest
		function fnGetOutboundInfoFromManifest (sOutboundNavigationTarget) {
			var oManifestEntry = oController.getOwnerComponent().getAppComponent().getManifestEntry("sap.app");
			return oManifestEntry.crossNavigation.outbounds[sOutboundNavigationTarget];
		}

		function fnCrossAppNavErrorHandler(oContext, oError) {
			oLogger.error("Error while opening the context " + oContext.getPath() + "in new tab: " + oError);
		}

		/**
		 * Opens all the eligible contexts in new tab.
		 * Also, validates the maximum allowed number of records to be opened.
		 * @param {sap.suite.ui.generic.template.lib.ContextMenuHandler.FocusInfo} oFocusInfo 
		 * @param {Array<sap.ui.model.Context>} aNavigableContexts 
		 */
		function fnOpenNavigableContextsInNewTab (oFocusInfo, aNavigableContexts) {
			if (oFocusInfo.applicableContexts.length > MAX_RECORDS_OPEN_IN_NEW_TAB) {
				var sWarningMessage = oCommonUtils.getText("T_TABLE_NAVIGATION_TOO_MANY_ITEMS_SELECTED", [MAX_RECORDS_OPEN_IN_NEW_TAB]);
				MessageBox.warning(sWarningMessage);
				return;
			}

			var oSynchronizeDraftPromise = oSourceControl.getModel().hasPendingChanges() ? oTemplateUtils.oServices.oApplicationController.synchronizeDraftAsync() : Promise.resolve();
			oSynchronizeDraftPromise.then(function () {
				aNavigableContexts.forEach(function (oContext) {
					if (oOutbound) {
						var fnHandleError = fnCrossAppNavErrorHandler.bind(null, oContext);
						oTemplateUtils.oCommonEventHandlers.navigateIntentOnNewTab(oOutbound, oContext, oState.oSmartFilterbar, fnHandleError);
					} else {
						oTemplateUtils.oCommonUtils.openContextInNewTabFromListItem(oContext);
					}
				});
			});
		}

		/**
		 * Returns the promise which resolves the event handler for "Open in new tab/window" entry.
		 * 
		 * Negative scenario: It just returns without any value when anyone of the following condition met.
		 * So that, "Open in new tab" option isn't added in context menu.
		 *   a. Navigation is not supported by the table
		 *   b. Direct edit flow (when the edit icon is pressed on row, the object is opened with draft record) is configured.  
		 *   c. The controller is configured with onListNavigationExtension (i.e custom navigation logic written by app).
		 *   d. If ushell container is unavailable
		 * 
		 * @param {sap.suite.ui.generic.template.lib.ContextMenuHandler.FocusInfo} oFocusInfo 
		 * @returns {Promise<Function|undefined>} Promise which resolves the handler method
		 */
		function getHandlePromiseForOpenInNewTab (oFocusInfo) {
			var getHandler = function (bEnabled, oFocusInfo, aNavigableContexts) {
				return bEnabled && fnOpenNavigableContextsInNewTab.bind(null, oFocusInfo, aNavigableContexts);
			};

			var bDirectEdit = oTemplateUtils.oServices.oApplication.getEditFlowOfRoot() === "direct";
			var bOnListNavigationExtensionFound = oController.hasOwnProperty("onListNavigationExtension");
			var UshellContainer = sap.ui.require("sap/ushell/Container");
			if (!bNavigationSupported || bDirectEdit || bOnListNavigationExtensionFound || !UshellContainer) {
				return;
			}

			// Enable the context menu entry only if at least one navigable context is available
			var aNavigableContexts = oFocusInfo.applicableContexts.filter(fnIsContextNavigable);
			var bEnabled = aNavigableContexts.length > 0;

			return Promise.resolve(getHandler(bEnabled, oFocusInfo, aNavigableContexts));
		}

		/**
		 * Adds "Open in wew tab/window" entry to context menu
		 * @param {sap.suite.ui.generic.template.lib.ContextMenuHandler.FocusInfo} oFocusInfo 
		 * @param {Array<sap.suite.ui.generic.template.lib.ContextMenuHandler.ContextMenuEntry>} aItems 
		 */
		function fnAddOpenInNewTabToContextMenu(oFocusInfo, aItems) {
			var oHandlePromise = getHandlePromiseForOpenInNewTab(oFocusInfo);
			var bStartsSection = true;
			if (oHandlePromise) {
				fnAddMainMenuItem(aItems, oCommonUtils.getText("ST_OPEN_NEW_TAB_OR_WINDOW"), null, bStartsSection, oHandlePromise);		
			}
		}

		/************************************************************
		 * End of methods related to "Open in new tab" functionality
		 ************************************************************/

		function getContextMenuItems(oEvent){
			var oFocusInfo = oPresentationControlHandler.getFocusInfoForContextMenuEvent(oEvent);
			mHandlers = Object.create(null);
			var aRet = [];
			// Add the toolbar buttons to context menu
			fnAddToolbarButtonsToContextMenu(oFocusInfo, aRet);
			//Add an entry for "Open in new tab or window"
			fnAddOpenInNewTabToContextMenu(oFocusInfo, aRet);
			return aRet;
		}

		function fnBeforeOpenContextMenu(oEvent){
			var aContextMenuItems = getContextMenuItems(oEvent);
			oTemplatePrivateModel.setProperty(sModelPath + "/items", aContextMenuItems);
			if (aContextMenuItems.length === 0) {
				oEvent.preventDefault();
			}
		}

		function onContextMenu(oEvent){
			var sKey = oEvent.getSource().getKey();
			var fnHandler = mHandlers[sKey];
			fnHandler();
		}

		// public instance methods
		return {
			beforeOpenContextMenu: fnBeforeOpenContextMenu,
			onContextMenu: onContextMenu
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.lib.ContextMenuHandler", {
		constructor: function(oController, oTemplateUtils, oState, oSourceControl, oConfiguration) {
			extend(this, getMethods(oController, oTemplateUtils, oState, oSourceControl, oConfiguration));
		}
	});
});
