sap.ui.define([
	"sap/ui/base/Object",
	"sap/base/util/extend",
	"sap/suite/ui/generic/template/lib/ContextMenuHandler"
], function(BaseObject, extend, ContextMenuHandler) {
    "use strict";

    function getMethods(oController, oTemplateUtils, oState) {
		var mGenericCtxMenuHandlers = Object.create(null);

        function fnExecuteAction(sSmartControlId, oFocusInfo, oToolbarControlData, oButton){
			if (oToolbarControlData.RecordType === "CRUDActionDelete"){
				oTemplateUtils.oCommonEventHandlers.deleteContextsFromTable(oController.byId(sSmartControlId), oFocusInfo.applicableContexts);
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
		 * - In multi view multi table, local id = template:::ALPAction:::ExtensionAction:::sQuickVariantKey::<MULTI_VIEW_TAB_ID>:::sAction::<MANIFEST_ACTION_ID>
		 */
        function fnFindBreakoutActionByLocalId(aBreakoutActionsData, sToolbarButtonLocalId) {
			var oMultipleViewsHandler = oState.oMultipleViewsHandler;
			var bIsMultiViewMultiTable = oMultipleViewsHandler.getMode && oMultipleViewsHandler.getMode() === "multi";

            return aBreakoutActionsData.find(function (oBreakoutAction) {
				if (bIsMultiViewMultiTable) {
					return sToolbarButtonLocalId.endsWith("::" + oBreakoutAction.id);
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

    return BaseObject.extend("sap.suite.ui.generic.template.AnalyticalListPage.controller.CtxMenuHandler", {
		constructor: function(oController, oTemplateUtils, oState) {
			extend(this, getMethods(oController, oTemplateUtils, oState));
		}
	});
});