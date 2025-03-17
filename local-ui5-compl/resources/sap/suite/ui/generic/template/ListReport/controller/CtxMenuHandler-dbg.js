sap.ui.define([
	"sap/ui/base/Object",
	"sap/base/util/extend",
	"sap/suite/ui/generic/template/lib/ContextMenuHandler"
], function(BaseObject, extend, ContextMenuHandler) {
	"use strict";

	function getMethods(oController, oTemplateUtils, oState) {
		// Begin: Instance variables
		var mGenericCtxMenuHandlers = Object.create(null);

		function fnExecuteAction(sSmartControlId, oFocusInfo, oToolbarControlData, oButton){
			if (oToolbarControlData.RecordType === "CRUDActionDelete"){
				oTemplateUtils.oCommonEventHandlers.deleteContextsFromTable(oController.byId(sSmartControlId), oFocusInfo.applicableContexts);
			} else if (oToolbarControlData.RecordType === "CRUDActionMultiEdit") {
				oState.oMultiEditHandler.onMultiEdit(oFocusInfo.applicableContexts);
			} else if (oToolbarControlData.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"){
				var oButtonCustomData = oButton.data();
				oTemplateUtils.oCommonEventHandlers.onDataFieldForIntentBasedNavigationSelectedContext(oButtonCustomData, oFocusInfo.applicableContexts, oState.oSmartFilterbar);
			} else if (oToolbarControlData.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction"){
				var oSmartControl = oController.byId(sSmartControlId);
				var oButtonCustomData = oButton.data();
				oTemplateUtils.oCommonEventHandlers.onCallActionFromToolBarForContexts(oSmartControl, oSmartControl.getTable(), oButtonCustomData, oFocusInfo.applicableContexts, oState, oSmartControl.getEntitySet(), true);
			}
		}

		/**
		 * Finds the breakout action data from "aBreakoutActionsData" (manifest action data) by toolbar button's local id.
		 * - In single view single table and multi view single table, buttons's local id = manifest action id.
		 * - In multi view multi table, local id = (manifest action id + "-" + multi view tab id)
		 */
		function fnFindBreakoutActionByLocalId(aBreakoutActionsData, sToolbarButtonLocalId) {
			// In the multi table multi view scenario, the toolbar button id is suffixed with icon tab bar's current key.
			var oMultipleViewsHandler = oState.oMultipleViewsHandler;
			var sButtonIdSuffix = oMultipleViewsHandler.getMode && oMultipleViewsHandler.getMode() === "multi" ? oMultipleViewsHandler.getSelectedKey() : "";
            return aBreakoutActionsData.find(function (oBreakoutAction) {
				// In multi table multi view, toolbar button local id = (manifest action id + "-" + multi view tab id).
				if (sButtonIdSuffix) {
					return sToolbarButtonLocalId === (oBreakoutAction.id + "-" + sButtonIdSuffix);
				}
				return sToolbarButtonLocalId === oBreakoutAction.id;
            });
        }

		function getGenericHandler(sSmartControlId){
			var oRet = mGenericCtxMenuHandlers[sSmartControlId];
			if (!oRet){
				var oSmartControl = oController.byId(sSmartControlId);
				var oConfiguration = {
					executeAction: fnExecuteAction.bind(null, sSmartControlId),
					findBreakoutActionByLocalId: fnFindBreakoutActionByLocalId
				};
				oRet = new ContextMenuHandler(oController, oTemplateUtils, oState, oSmartControl, oConfiguration);
				mGenericCtxMenuHandlers[sSmartControlId] = oRet;
			}
			return oRet;
		}
		
		function fnBeforeOpenContextMenu(oEvent, sSmartControlId){
			var oGenericHandler = getGenericHandler(sSmartControlId);
			oGenericHandler.beforeOpenContextMenu(oEvent);
		}
		
		function onContextMenu(oEvent, sSmartControlId){
			var oGenericHandler = getGenericHandler(sSmartControlId);
			oGenericHandler.onContextMenu(oEvent);
		}

		// public instance methods
		return {
			beforeOpenContextMenu: fnBeforeOpenContextMenu,
			onContextMenu: onContextMenu
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.ListReport.controller.CtxMenuHandler", {
		constructor: function(oController, oTemplateUtils, oState) {
			extend(this, getMethods(oController, oTemplateUtils, oState));
		}
	});
});
