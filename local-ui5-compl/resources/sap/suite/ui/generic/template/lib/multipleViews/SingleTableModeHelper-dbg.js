sap.ui.define([
	"sap/ui/base/Object",
	"sap/base/util/extend"
],
function(BaseObject, extend) {
	"use strict";
	/*
	 * This class is a helper class for the generic class XltipleViewsHandler. More, precisely an instance of
	 * this class is created in the constructor of that class in case, that the single table mode of the multiple views feature
	 * has been switched on.
	 * The mode can be switched on and configured via the quickVariantSelection.variants section in the manifest.
	 */

	// oController is the controller of the enclosing ListReport
	// oTemplateUtils are the template utils as passed to the controller implementation
	function getMethods(oController, oTemplateUtils, oConfiguration) {

		function getDefaultShowCounts(){
			return false;
		}

		function fnGetSelectedKeyAndRestoreFromIappState(oState) {
			return oState && oState.selectedKey;
		}

		function fnGetContentForIappState(sSelectedKey) {
			return {
				selectedKey: sSelectedKey
			};
		}

		// general content is only the selected view in single table mode
		function getGeneralContentStateWrapper(oSelectedKeyWrapper) {
			return oSelectedKeyWrapper;
		}
		
		function fnRefreshOperation(iRequest, vTabKey, mEntitySets, sCurrentKey, bIsTabKeyArray, bIsComponentVisible, fnRefreshOperationOnCurrentSmartControl) {
			if (bIsTabKeyArray ? vTabKey.indexOf(sCurrentKey) < 0 : (vTabKey && vTabKey !== sCurrentKey)){
				return; // refresh only required for a non-visible tab. This will happen anyway, when changing to this tab
			}
			if (bIsComponentVisible){
				fnRefreshOperationOnCurrentSmartControl(iRequest);
			} else {
				oController.getOwnerComponent().setIsRefreshRequired(true);
			}
		}

		function fnGetMode() {
			return "single";
		}

		function fnGetRefreshMode(sNewKey) {
			// for single table mode for every switch of tabs we need to refresh
			return 3;
		}

		// For $count requests use the same batchGroupId as for refreshing the data
		function getBatchGroupIdForCount(){
			var oPresentationControlHandler = oConfiguration.getPresentationControlHandler(); // Note that we do not need to pass a key to this function, since in the single table case the presentationControlHandler is identical for all keys
			var oBinding = oPresentationControlHandler.getBinding();
			return oBinding ? oBinding.sRefreshGroupId : undefined;
		}

		// public instance methods
		return {
			getDefaultShowCounts: getDefaultShowCounts,
			getContentForIappState: fnGetContentForIappState,
			getSelectedKeyAndRestoreFromIappState : fnGetSelectedKeyAndRestoreFromIappState,
			getSFBVariantContentStateWrapper: Function.prototype,		// no content belonging to SFB in single table mode
			getGeneralContentStateWrapper: getGeneralContentStateWrapper,			
			refreshOperation: fnRefreshOperation,
			getMode: fnGetMode,
			getRefreshMode: fnGetRefreshMode,
			getBatchGroupIdForCount: getBatchGroupIdForCount
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.lib.multipleViews.SingleTableModeHelper", {
		constructor: function(oController, oTemplateUtils, oConfiguration) {
			extend(this, getMethods(oController, oTemplateUtils, oConfiguration));
		}
	});
});
