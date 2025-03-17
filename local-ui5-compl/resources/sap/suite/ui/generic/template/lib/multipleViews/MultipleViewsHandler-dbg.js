sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/Filter",
	"sap/suite/ui/generic/template/lib/multipleViews/MultipleTablesModeHelper",
	"sap/suite/ui/generic/template/lib/multipleViews/SingleTableModeHelper",
	"sap/fe/navigation/SelectionVariant",
	"sap/suite/ui/generic/template/genericUtilities/metadataAnalyser",
	"sap/suite/ui/generic/template/genericUtilities/FeLogger",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/base/util/extend",
	"sap/base/security/encodeURL",
	"sap/ui/comp/util/DateTimeUtil",
	"sap/base/util/isEmptyObject",
	"sap/ui/core/format/NumberFormat"
], function(BaseObject, Filter, MultipleTablesModeHelper, SingleTableModeHelper, SelectionVariant, metadataAnalyser, FeLogger, testableHelper,
		extend, encodeURL, DateTimeUtil, isEmptyObject, NumberFormat) {
	"use strict";

	var oLogger = new FeLogger("lib.multipleViews.MultipleViewsHandler").getLogger();
	// This class handles one instance of the multiple views feature. This means that it covers one "logical" occurrence of a table/chart possessing multiple "views"
	// can be switched by the user via a suitable "switching facility" (e.g. table tabs).
	// Note that each of these views can be identified by a key.
	// Technically, there are two ways to achieve this:
	// 1. Exactly one smart control is used to implement this. Whenever the views are switched this control is reconfigured.
	// 2. Each view is implemented via a separate smart control. Whenever the views are switched the corresponding control is set to visible and all other controls are set to invisible.
	// Note that the second possibility is much more flexible, since it allows to mix the implementing controls (tables and charts) and even use different entity sets for each control.
	// 1 is called "Single views mode", 2 is called "Multiple views mode"
	// Parameters:
	// - oTemplateUtils: The utilities for the view that hosts the multiple view
	// - oController: The controller of the view that hosts the multiple view
	// - oConfiguration: Configuration of this class (also callbacks) containing floorplan specific logic. This contains the following properties:
	// 	 + mode: contain the Multiple Views mode (Single Table/Multiple Table) 
	//   + manifestSettings: the settings from the manifest defining the multiple views
	//   + pathInTemplatePrivateModel: a prefix for the paths of all properties in TemplatePrivateModel being connected with this multiple views instance
	//   + getPresentationControlHandler: a function that returns the corresponding smartControl's presentationControlHandler instance for a given key
	//   + switchingControl: the control which is used to switch between the views. It must possess a getItems() method.
	//   + getSearchValue : optional function to retrieve current value of the search field
	//   + smartFilterBar : optional smartFilterBar which is present only in the list report
	//   + isDataToBeShown : function tells whether to retrieve data
	//   + adaptRefreshRequestMode: optional function to adapt the refresh request
	function getMethods(oController, oTemplateUtils, oConfiguration) {
		// maps the keys of the switching facility to meta information about the corresponding view. This meta information contains the following properties:
		// presentationControlHandler: the presentationControlHandler instance which contains the corresponding smart control implementing the view
		// selectedTabText : returns the custom text of the icon tab header
		// templateSortOrder : stores the sorting order
		// getPath function that return the bindingpath of the smart control
		// selectionVariantFilters : stores the selectionVariant Filters for the smart contrtol
		// numberOfUpdates: count for number of updates (used to relate count requests and their responses)
		// getFiltersForCount: a function which returns the filters which should currently be used to determine the counts for the view. Will be updated by fnOnRebindContentControl
		// updateStartFunction: function that starts the busy indicator and increments the update count
		// updateSuccessFunction: function that does processing of count after function call is done
		// updateErrorFunction: function that shows the error , if an error is encountered
		// implementingHelperAttributes: object which can be used by oImplementingHelper to store information specific for it.
		//             1. ignoredLabels: contains all the labels of the ignored filters fnHandlerForNonMultiFilters will store the ignoredLabels and pass on
		//             2.entityTypeProperty: contains the entity property of the implementing helper ( fnGetImplementingHelperAttributes will return the property)
		var mSwitchingKeyToViewMeta = Object.create(null);
		
		var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel(); // the template private model used to transfer data between javascript and UI
		// more doc
		var sPathToItems = oConfiguration.pathInTemplatePrivateModel + "/items";
		// more doc
		var sPathToSelectedKey = oConfiguration.pathInTemplatePrivateModel + "/selectedKey";
		oTemplatePrivateModel.setProperty(oConfiguration.pathInTemplatePrivateModel, Object.create(null));
		oTemplatePrivateModel.setProperty(sPathToItems, Object.create(null));

		var oImplementingHelper = new (oConfiguration.mode === "single" ? SingleTableModeHelper : MultipleTablesModeHelper)(oController, oTemplateUtils, oConfiguration);
		oTemplatePrivateModel.setProperty(oConfiguration.pathInTemplatePrivateModel + "/mode", oImplementingHelper.getMode());

		var fnResolveInitialization;
		var oInitializationPromise = new Promise(function(resolve) {
			fnResolveInitialization = resolve;
		});

		var iDefaultDelayMs = oTemplateUtils.oServices.oApplication.getBusyHelper().getBusyDelay();
		var oModel = oController.getOwnerComponent().getModel();
		var sDefaultSelectedKey;
		var bShowCounts;
		
		var aSwitchingKeyListeners = [];

		// changes over the time frequently
		var sSelectedKey;

		function fnUpdateCounts() {
			if (bShowCounts) {
				var sSearchValue = oConfiguration.getSearchValue && oConfiguration.getSearchValue();
				var oSearch = sSearchValue ? {
					search: sSearchValue
				} : {};

				// If the implementingHelper defines a batchgroupId for count (currently only valid for single table case) use that one to
				// bundle the count request with other requests of the same batch group id.
				var sBatchGroupId = (oImplementingHelper.getBatchGroupIdForCount || Function.prototype)();

				for (var sKey in mSwitchingKeyToViewMeta) {
					var oViewMeta =  mSwitchingKeyToViewMeta[sKey];
					var sPath = oViewMeta.getPath();
					oViewMeta.numberOfUpdates++; // start a new update call
					oViewMeta.updateStartFunction(oViewMeta.numberOfUpdates); // set counter busy
					oModel.read(sPath + "/$count", {
						urlParameters: oSearch,
						filters: oViewMeta.getFiltersForCount && oViewMeta.getFiltersForCount(),
						groupId: sBatchGroupId,
						success: oViewMeta.updateSuccessFunction.bind(null, oViewMeta.numberOfUpdates), // bind the success handler to the current request
						error: oViewMeta.errorFunction.bind(null, oViewMeta.numberOfUpdates) // bind the error handler to the current request
					});
				}
			}
		}

		/*
		 * Resolves the path for a parameterized entityset
		 * @param {object} oEntitySet - object containing current entityset information
		 * @param {object} oParameterInfo - object containing parameter info
		 * @return {string} sPath - resolved path used to fetch count
		 */
		function fnResolveParameterizedEntitySet(oEntitySet, oParameterInfo) {
			var sPath = "";
			var aParameters = oParameterInfo["parameters"];

			if (!oParameterInfo || !oParameterInfo.entitySetName || !oParameterInfo.navPropertyName || aParameters.length < 1) {
				sPath = "/" + oEntitySet.name;
				return sPath;
			}

			var aFilterParams = oConfiguration.smartFilterBar && oConfiguration.smartFilterBar.getAnalyticalParameters();
			if (aFilterParams && aFilterParams.length > 0) {
				//Read the parameters from the smartfilterbar and build the binding path
				var oUiState = oConfiguration.smartFilterBar && oConfiguration.smartFilterBar.getUiState({
					allFilters: false
				});
				var sSelectionVariant = oUiState ? JSON.stringify(oUiState.getSelectionVariant()) : "{}";
				var oSelectionVariant = new SelectionVariant(sSelectionVariant);
				var aApplicableParams = [];
				//For each parameter in the parameter set, check if it is present in the filterparams.
				aParameters.forEach(function(sParam) {
					aFilterParams.forEach(function(oFilterParam) {
						if (oFilterParam && (oFilterParam.name === sParam)){
							var sParameterName = oFilterParam.name;
							//To get the current value of the parameter
							// refactoring if required: need to check if sSelectionVariant is empty object
							var sValue = oSelectionVariant.getParameter(sParameterName);
							//Fix BCP : 1970602412 Count is not being update in case of parameterized entityset having date as a parameter.
							if (oFilterParam.type === 'Edm.DateTime' || oFilterParam.type === 'Edm.DateTimeOffset') {
								sValue = new Date(sValue);
								sValue = DateTimeUtil.localToUtc(sValue);
							} else if (oFilterParam.type === 'Edm.String' && oFilterParam["sap:parameter"] === "optional") {
								// The empty property value is set if the parameter is optional and there is no selection variant.
								if (sValue === undefined) {
									sValue = "";
								}
							}
							//Fix BCP : 2170261898 encoding sValue for all filterParam types instead of just DateTime/DateTimeOffset type
							sValue = encodeURL(oFilterParam.control.getModel().formatValue(sValue, oFilterParam.type));
							aApplicableParams.push(sParameterName + '=' + sValue);
						}
					});
				});
				sPath = '/' + oParameterInfo.entitySetName + '(' + aApplicableParams.join(',') + ')/' + oParameterInfo.navPropertyName;
			} else {
				sPath = "/" + oEntitySet.name;
				oLogger.error("SelectionParameters", "There are no parameters to resolve");
				return sPath;
			}
			return sPath;
		}

		function fnGetPath(oPresentationControlHandler) {
			var sBindingPath;
			var sControlEntitySet = oPresentationControlHandler.getEntitySet();
			var oComponent = oController.getOwnerComponent();
			if (oConfiguration.smartFilterBar && oConfiguration.smartFilterBar.getConsiderAnalyticalParameters && oConfiguration.smartFilterBar.getConsiderAnalyticalParameters()) {
				var oMetaModel = oModel.getMetaModel();
				var oEntitySet = oMetaModel.getODataEntitySet(sControlEntitySet);
				var oAppComponent = oComponent.getAppComponent();
				var oParameterInfo = metadataAnalyser.getParametersByEntitySet(oAppComponent.getModel(), sControlEntitySet);
				sBindingPath = oConfiguration.resolveParameterizedEntitySet ?  oConfiguration.resolveParameterizedEntitySet(oEntitySet, oParameterInfo) : fnResolveParameterizedEntitySet(oEntitySet, oParameterInfo);
				return sBindingPath;
			}
			var sTableOrChartBindingPath = oPresentationControlHandler.getBindingPath();
			sBindingPath = sTableOrChartBindingPath ? sTableOrChartBindingPath : "/" + sControlEntitySet;
			// Add binding context of the page (if there is one) to the binding path.
			// This binding path should be retrieved from the ComponentContainer, since other controls might still have an outdated context.
			var oComponentContainer = oComponent.getComponentContainer();
			var oElementBinding = oComponentContainer.getElementBinding();
			return oElementBinding ? oElementBinding.getPath() + '/' + sBindingPath : sBindingPath;
		}

		function getSelectionVariantFilters(oPresentationControlHandler, oCustomData) {
			var oMetaModel = oModel.getMetaModel();
			/* getEntitySet should not be a method of PresentationControlHandler. For more details, refer to the comment 
			   mentioned before the method's definition in the class */
			var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(oPresentationControlHandler.getEntitySet()).entityType);
			var aSelectionVariantFilters = [], oSelectionVariantPath;
			var sSelectionVariantPath = oCustomData.variantAnnotationPath;
			if (sSelectionVariantPath) {
				var oVariant = oEntityType[sSelectionVariantPath];
				if (!oVariant) {
					return [];
				}
				if (!oVariant.SelectOptions && oVariant.SelectionVariant) {
					// for SelectionPresentationVariants, make sure to refer to SelectionVariant
					oVariant = oVariant.SelectionVariant;
					if (oVariant.Path) {
						// resolve reference to SelectionVariant via path
						sSelectionVariantPath = oVariant.Path.split("@")[1];
						oVariant = sSelectionVariantPath && oEntityType[sSelectionVariantPath];
					}
				}
				if (oVariant.AnnotationPath) {
					oSelectionVariantPath = oVariant.AnnotationPath.split("@")[1];
					oVariant = oEntityType[oSelectionVariantPath];
				}
				for (var i in oVariant.SelectOptions) {
					if (oVariant.SelectOptions[i].PropertyName) {
						var sPath = oVariant.SelectOptions[i].PropertyName.PropertyPath;
						for (var j in oVariant.SelectOptions[i].Ranges) {
							var sSign = oVariant.SelectOptions[i].Ranges[j].Sign && oVariant.SelectOptions[i].Ranges[j].Sign.EnumMember;
							var sOperator = oVariant.SelectOptions[i].Ranges[j].Option && oVariant.SelectOptions[i].Ranges[j].Option.EnumMember;
							sOperator = sSign ? fnDetermineOperator(sSign.replace("com.sap.vocabularies.UI.v1.SelectionRangeSignType/", ""), sOperator.replace("com.sap.vocabularies.UI.v1.SelectionRangeOptionType/", "")) : sOperator.replace("com.sap.vocabularies.UI.v1.SelectionRangeOptionType/", "");
							var oValueLow = oVariant.SelectOptions[i].Ranges[j].Low;
							var oValueHigh = oVariant.SelectOptions[i].Ranges[j].High;
							var vValueLow = getPrimitiveValue(oValueLow);
							if (oValueHigh) {
								var vValueHigh = getPrimitiveValue(oValueHigh);
								aSelectionVariantFilters.push(new Filter(sPath, sOperator, vValueLow, vValueHigh));
							} else {
								aSelectionVariantFilters.push(new Filter(sPath, sOperator, vValueLow));
							}
						}
					}
				}
			}
			return aSelectionVariantFilters;
		}
		/* This logic cannot (yet) work correctly in all cases(specially in case where we need to determine operator by clubbing multiple conditions)
		and we plan to create a BLI to fix the same.*/
		function fnDetermineOperator(sSign, sOption) {
			var sOperator;
			var mOperator = new Map([
				["EQ", "NE"],
				["BT", "NB"],
				["CP", "NP"],
				["LE", "GT"],
				["GE", "LT"],
				["NE", "EQ"],
				["NB", "BT"],
				["NP", "CP"],
				["GT", "LE"],
				["LT", "GE"]
			]);

			if (sSign === "I") {
				sOperator = sOption;
			} else if (sSign === "E") {
				if (mOperator.has(sOption)) {
					sOperator = mOperator.get(sOption);
				} else {
					sOperator = sOption;
				}
			}
			return sOperator;
		}

		/**
		 * Returns primitive value from the value object
		 * 
		 * TODO: In future, it should be enhanced to support other primitive types
		 * similar to {sap.suite.ui.generic.template.AnalyticalListPage.util.FilterUtil#getPrimitiveValue}
		 * 
		 * @param {object} oValue 
		 * @returns {string|boolean|unknown} 
		 */
		function getPrimitiveValue (oValue) {
			var vValue;

			if (oValue) {
				if (oValue.String ) {
					vValue = oValue.String;
				} else if (oValue.Bool) {
					vValue = oValue.Bool.toLowerCase() === "true";
				} else {
					var sKey = Object.keys(oValue)[0];
					vValue = oValue[sKey];
				}
			}

			return vValue;
		}

		// returns one (the "preferred") key for a given entity set if it exists
		function fnGetKeyForEntitySet(sEntitySet){
			for (var sKey in mSwitchingKeyToViewMeta) {
				var oViewMeta =  mSwitchingKeyToViewMeta[sKey];
				/* getEntitySet should not be a method of PresentationControlHandler. For more details, refer to the comment 
			   	   mentioned before the method's definition in the class */
				if (oViewMeta.presentationControlHandler.getEntitySet() === sEntitySet){
					return sKey;
				}
			} 
			return "";
		}
		
		function fnHasEntitySet(sEntitySet){
			return !!fnGetKeyForEntitySet(sEntitySet);
		}
		
		// provide the key which should preferably used when displaying the table 
		function fnGetPreferredKey(sEntitySet){
			return (sEntitySet && (fnGetCurrentViewMeta().presentationControlHandler.getEntitySet() !== sEntitySet) && fnGetKeyForEntitySet(sEntitySet)) ||  sSelectedKey;
		}

		// This function is called when the beforeRebind-Event of the SmartControl has been triggered.
		// aFiltersFromRebindEvent is a snapshot of the filters which have been passed to the onBeforeRebind by SmartTable.
		// It does NOT contain all the changes which have been applied to oBindingParams.filters by
		// - CommonEventHandlers.onBeforeRebindTable and onBeforeRebindTableExtension (table case)
		// - CommonUtils.onBeforeRebindTableOrChart and onBeforeRebindChartExtension (chart case)
		// Note that aFiltersFromRebindEvent is only used for the count call in the multi table case. In this case this array contains
		// those filters which are coming from the settings of the current table (and therefore should be ignored for all count calls).
		// The task of this function is as follows:
		// - update the filters-property of oBindingParams such that it now reflects the complete filter for the content of the currently selected view
		// - inform oImplementingHelper about the filters currently valis so that it may store this information for its own purpose
		// - (only if counts are enabled) update the getFiltersForCount-function inside ALL instances of oViewMeta, so that they provide the filters currently valid
		//   for the counts for the corresponding items
		function fnOnRebindContentControl(oBindingParams, aFiltersFromRebindEvent) {
			if (bShowCounts) { // Reset the getFiltersForCount method for all instances of oViewMeta according to the filters currently applicable
				var aCommonFilterForCounts = oImplementingHelper.getCommonFiltersForCounts ? oImplementingHelper.getCommonFiltersForCounts(oBindingParams.filters, aFiltersFromRebindEvent) : oBindingParams.filters;                                                                
				for (var sKey in mSwitchingKeyToViewMeta) {
					var oViewMeta =  mSwitchingKeyToViewMeta[sKey];
					oViewMeta.getFiltersForCount = getFiltersForItem.bind(null, aCommonFilterForCounts, oViewMeta, true);
				}
			}
			// Now we are adapting the filters for the rebind event of the smart control.
			var oCurrentViewMeta = fnGetCurrentViewMeta();
			oBindingParams.filters = getFiltersForItem(oBindingParams.filters, oCurrentViewMeta, false);			
		}

		// Provide the filters that should be used for the view specified by oViewMeta.
		// bForCount specifies whether the filters are used for determining the content of the view or only for the count.
		// aFilters contains the filters which are currently present in the oBindingParams of the onBeforeRebind-event.
		// That array must not be changed by this function.
		// aFiltersFromRebindEvent is explained in the documentation of fnOnRebindContentControl.
		function getFiltersForItem(aFilters, oViewMeta, bForCount) {
			// oImplementingHelper may create a modified version of aFilters. In fact this is only happening in the count case for the multi table scenario.
			// In this case the filters coming from the smart filterbar are not yet included in aFilters.
			// They will be added by oImplementingHelper.
			// Thereby, oImplementingHelper may also update its internal structure.
			if (oImplementingHelper.getFiltersAdaptedFromItem) {
				aFilters = oImplementingHelper.getFiltersAdaptedFromItem(aFilters, oViewMeta, bForCount);
			}
			// Finally add the filters that are derived from the specification of the view
			return aFilters.concat(oViewMeta.selectionVariantFilters);
		}

		function fnGetCurrentViewMeta() {
			return mSwitchingKeyToViewMeta[sSelectedKey]; // return metadata of selected item
		}

		function fnFormatMessageStrip(aIgnoredFilters,  sSelectedKey) {
			return oImplementingHelper.formatMessageStrip(aIgnoredFilters, sSelectedKey);
		}

		function fnGetSelectedKey(){
			return sSelectedKey;
		}

		function fnGetMode() {
			return oImplementingHelper.getMode();
		}

		function fnSetSelectedKey(sNewKey) {
			if (!sNewKey) {
				// There could be use case where application developers could use extension API
				// and set the variant key even before the SwitchingControl is resolved. API would
				// hit the fnSetSelectedKey method which stores the Key passed in sSelectedKey.
				// Default value needs to be assigned only in case this sNewKey is undefined
				sNewKey = sDefaultSelectedKey;
			}
			sSelectedKey = sNewKey;
			oTemplatePrivateModel.setProperty(sPathToSelectedKey, sSelectedKey);
		}


		// currently still needed for ALP. LR uses getSFBVariantContentStateWrapper and getGeneralContentStateWrapper instead
		function fnGetContentForIappState(){
			return oImplementingHelper.getContentForIappState(sSelectedKey);
		}

		function fnFormatItemTextForMultipleView(oItemDataModel) {
			var sFormatedValue;
			if (!oItemDataModel) {
				return "";
			}
			if (oItemDataModel.state === "error") {
				return oTemplateUtils.oCommonUtils.getText("SEG_BUTTON_ERROR", oItemDataModel.text); // originally the text was for segmented button only but is now used for all texts with multiple views
			}
			if (oItemDataModel.state === "" || oItemDataModel.state === "busy") {
				var oIntegerInstance = NumberFormat.getIntegerInstance({
					groupingEnabled: true
				});
				sFormatedValue = oIntegerInstance.format(oItemDataModel.count);
			}
			// originally the text was for segmented button only but is now used for all texts with multiple views
			return oTemplateUtils.oCommonUtils.getText("SEG_BUTTON_TEXT", [oItemDataModel.text, oItemDataModel.state === "busyLong" ? "..." : sFormatedValue]);
		}

		// currently still needed for ALP. LR uses getSFBVariantContentStateWrapper and getGeneralContentStateWrapper instead
		function fnRestoreFromIappState(oState) {
			sSelectedKey = oImplementingHelper.getSelectedKeyAndRestoreFromIappState(oState);
			if (mSwitchingKeyToViewMeta[sSelectedKey]){
				oTemplatePrivateModel.setProperty(sPathToSelectedKey, sSelectedKey);
			}
		}

		// generic multipleViewsHandler knows about the current view - but implementing helpers know, whether this information belongs to SFB or to general state
		var oSelectedKeyWrapper = {
				getState: fnGetSelectedKey,
				setState: fnSetSelectedKey,
				attachStateChanged: fnRegisterKeyChange
		};
		
		function getSFBVariantContentStateWrapper() {
			return oImplementingHelper.getSFBVariantContentStateWrapper(oSelectedKeyWrapper);
		}
		
		function getGeneralContentStateWrapper() {
			return oImplementingHelper.getGeneralContentStateWrapper(oSelectedKeyWrapper);
		}
		
		function fnDetermineSortOrder() {
			return mSwitchingKeyToViewMeta[sSelectedKey].templateSortOrder;
		}

		function fnRefreshOperationOnCurrentSmartControl(iRequest){
			var oCurrentViewMeta = fnGetCurrentViewMeta();
			if (iRequest !== 2){ // rebind needed
				oCurrentViewMeta.presentationControlHandler.rebind();
			}
			if (iRequest > 1){ // refresh needed
				if (oConfiguration.refreshModelOnTableRefresh) {
					/* getEntitySet should not be a method of PresentationControlHandler. For more details, refer to the comment 
			   	   	   mentioned before the method's definition in the class */
					var bIsInvalidating = oTemplateUtils.oCommonUtils.refreshModel(oCurrentViewMeta.presentationControlHandler.getEntitySet());
					if (bIsInvalidating){
						fnRefreshSiblingControls(oCurrentViewMeta.presentationControlHandler);
					}
				}
				oCurrentViewMeta.presentationControlHandler.refresh();
			}
		}

		// Perform a refresh operation (refresh or rebind) on a subset of the given tabs.
		// Only performs the action if multiple views are active. Then it returns true.
		// Otherwise it returns false.
		// iRequest: 1 = rebind, 2 = refresh, 3 = both
		// vTabKey: If it is truthy, then it is either a tab key or an array of tab keys. In this case only the specified tab keys are affected.
		// mEntitySets: Only considered when vTabKey is faulty. Then, if mEntitySets is truthy it is expected to be a map that has entity sets as keys.
		//              Only those tabs are affected by this call that are bound to an entity set that is mapped onto a truthy value in this map.
		// If vTabKey and mEntitySets are both faulty, all tabs are affected
		function fnRefreshOperation(iRequest, vTabKey, mEntitySets){
			var bIsTabKeyArray = Array.isArray(vTabKey);
			var bIsComponentVisible = oTemplateUtils.oComponentUtils.isComponentActive();
			if ((bIsTabKeyArray && vTabKey.length === 0) || (mEntitySets && isEmptyObject(mEntitySets))){
				return;
			}
			oImplementingHelper.refreshOperation(iRequest, vTabKey, mEntitySets, sSelectedKey, bIsTabKeyArray, bIsComponentVisible, fnRefreshOperationOnCurrentSmartControl);
		}

		function fnSetControlVariant(sChartVariantId, sTableVariantId) {
			if (oImplementingHelper.setControlVariant) {
				oImplementingHelper.setControlVariant(sChartVariantId, sTableVariantId);
			}
		}

		function fnGetCustomDataText(oElement, sPathToTheItem, oModelEntry, oViewMeta) {
			return oTemplateUtils.oCommonUtils.getCustomDataText(oElement)
				.then(function(sText) {
					oModelEntry.text = sText;
					oViewMeta.text = sText;
					return {
						modelEntry: oModelEntry,
						pathToTheItem: sPathToTheItem
					};
				});
		}

		function fnSetCustomDataText(oResult) {
			oTemplatePrivateModel.setProperty(oResult.pathToTheItem, oResult.modelEntry);
		}
		
		function fnRefreshSiblingControls(oPresentationControlHandler){
			if (oImplementingHelper.refreshSiblingControls) {
				oImplementingHelper.refreshSiblingControls(oPresentationControlHandler);
			}			
		}

		function fnRegisterKeyChange(onKeyChange){
			aSwitchingKeyListeners.push(onKeyChange);
		}
		
		function fnGetKeys() {
			return Object.keys(mSwitchingKeyToViewMeta);
		}		

		// refactor: remove init in all files
		(function () { // constructor coding encapsulated in order to reduce scope of helper variables


			testableHelper.testable(function () {
				return oImplementingHelper;
			}, "getImplementingHelper");
			testableHelper.testable(function () {
				return bShowCounts;
			}, "getShowCounts");
			testableHelper.testable(function () {
				return mSwitchingKeyToViewMeta[sSelectedKey];
			}, "getCurrentViewMeta");


			// collect meta information for each view and store it in mSwitchingKeyToViewMeta

			var fnUpdateFunction = function (oViewMeta, sState, iNumberOfUpdates, iNewCount) {
				if (oViewMeta.numberOfUpdates !== iNumberOfUpdates) { // this is the response for an outdated request
					return;
				}
				var sPathToTheItem = sPathToItems + "/" + oViewMeta.switchingKey;
				var oModelEntry = extend({}, oTemplatePrivateModel.getProperty(sPathToTheItem)); // must create a new instance. Otherwise UI5 will not recognize the change
				if (!oModelEntry.state && sState == "busy") {
					setTimeout(function () {
						if (oTemplatePrivateModel.getProperty(sPathToTheItem).state === "busy") {
							oModelEntry = extend({}, oTemplatePrivateModel.getProperty(sPathToTheItem)); // must create a new instance. Otherwise UI5 will not recognize the change
							oModelEntry.state = "busyLong";
							oTemplatePrivateModel.setProperty(sPathToTheItem, oModelEntry); // Note that this will trigger the call of formatItemTextForMultipleView
						}
					}, iDefaultDelayMs);
				}
				oModelEntry.state = sState; // update the state
				if (!sState) { // determination was successfull -> update the count
					oModelEntry.count = iNewCount;
				}
				oTemplatePrivateModel.setProperty(sPathToTheItem, oModelEntry); // Note that this will trigger the call of formatItemTextForMultipleView
			};

			oConfiguration.getSwitchingControlAsync().then(function (oSwitchingControl) {
				var aSwitchingItems = oSwitchingControl ? oSwitchingControl.getItems() : [];
				for (var i = 0; i < aSwitchingItems.length; i++) {
					var oSwitchingItem = aSwitchingItems[i];
					var sSwitchingItemKey = oSwitchingItem.getKey();
					if (i === 0) {
						// first item selected
						sDefaultSelectedKey = sSwitchingItemKey;
					}
					var oViewMeta = {
						presentationControlHandler: oConfiguration.getPresentationControlHandler(sSwitchingItemKey),
						switchingKey: sSwitchingItemKey
					};
					var oCustomData = oTemplateUtils.oCommonUtils.getElementCustomData(oSwitchingItem);
					var sPathToTheItem = sPathToItems + "/" + oViewMeta.switchingKey;
					var oModelEntry = Object.create(null);
					oModelEntry.text = oCustomData.text;
					oModelEntry.count = 0; // at initialization 0 will be displayed as counter everywhere
					oModelEntry.state = "";
					oModelEntry.facetId = oConfiguration.sectionKey;
					fnGetCustomDataText(oSwitchingItem, sPathToTheItem, oModelEntry, oViewMeta).then(fnSetCustomDataText);
					oViewMeta.templateSortOrder = oCustomData.TemplateSortOrder;
					oViewMeta.getPath = fnGetPath.bind(null, oViewMeta.presentationControlHandler);
					oViewMeta.selectionVariantFilters = getSelectionVariantFilters(oViewMeta.presentationControlHandler, oCustomData);
					oViewMeta.numberOfUpdates = 0;
					oViewMeta.updateStartFunction = fnUpdateFunction.bind(null, oViewMeta, "busy");
					oViewMeta.updateSuccessFunction = fnUpdateFunction.bind(null, oViewMeta, "");
					oViewMeta.errorFunction = fnUpdateFunction.bind(null, oViewMeta, "error");
					mSwitchingKeyToViewMeta[sSwitchingItemKey] = oViewMeta;
				}

				if (oImplementingHelper.init) {
					oImplementingHelper.init(mSwitchingKeyToViewMeta, fnRefreshOperation, fnGetCurrentViewMeta);
				}

				// only for the case where its not defined in manifest
				// if the configuration is not present for different entity sets the defaults showcount is true else false
				// by default the different entity sets show count is true, should be explicity set to showCounts to false if we dont want count to be displayed
				if (oConfiguration.manifestSettings.showCounts === undefined) {
					bShowCounts = oImplementingHelper.getDefaultShowCounts();
				} else {
					bShowCounts = oConfiguration.manifestSettings.showCounts;
				}
				
				fnSetSelectedKey(sSelectedKey);
				// register for change of the tabs
				var oBinding = oTemplatePrivateModel.bindProperty(sPathToSelectedKey);
				oBinding.attachChange(function (oChangeEvent) {
					var sNewKey = oChangeEvent.getSource().getValue();
					aSwitchingKeyListeners.forEach(function (onKeyChange) {
						onKeyChange(sNewKey, sSelectedKey);
					});
					sSelectedKey = sNewKey;
					if (oImplementingHelper.onSelectedKeyChanged) {
						oImplementingHelper.onSelectedKeyChanged(sNewKey);
					}
					var bDataToBeShown = oConfiguration.isDataToBeShown();
					var iRequest = oImplementingHelper.getRefreshMode(sSelectedKey);
					if (oConfiguration.adaptRefreshRequestMode) {
						iRequest = oConfiguration.adaptRefreshRequestMode(iRequest);
						if (bDataToBeShown && iRequest > 0) {
							fnRefreshOperationOnCurrentSmartControl(iRequest);
						} else {
							// need to update the toolbar button visibility here as the delete button would not be updated otherwise
							// see BCP:1770601204
							fnGetCurrentViewMeta().presentationControlHandler.setEnabledToolbarButtons();
						}
					}
					oConfiguration.appStateChange();
				});

				// Initialization is complete, resolve the promise
				fnResolveInitialization();
			});
		})();

		// public instance methods
		return {
			updateCounts: fnUpdateCounts,
			refreshOperation: fnRefreshOperation,
			onRebindContentControl: fnOnRebindContentControl,
			formatMessageStrip: fnFormatMessageStrip,
			getSelectedKey: fnGetSelectedKey,
			setSelectedKey: fnSetSelectedKey,
			getContentForIappState: fnGetContentForIappState,
			restoreFromIappState: fnRestoreFromIappState,
			getSFBVariantContentStateWrapper: getSFBVariantContentStateWrapper,
			getGeneralContentStateWrapper: getGeneralContentStateWrapper,
			formatItemTextForMultipleView: fnFormatItemTextForMultipleView,
			determineSortOrder: fnDetermineSortOrder,
			setControlVariant: fnSetControlVariant,
			hasEntitySet: fnHasEntitySet,
			getPreferredKey: fnGetPreferredKey,
			refreshSiblingControls: fnRefreshSiblingControls,
			resolveParameterizedEntitySet: fnResolveParameterizedEntitySet,
			getMode: fnGetMode,
			registerKeyChange: fnRegisterKeyChange,
			getKeys: fnGetKeys,
			getInitializationPromise: function() { return oInitializationPromise; }
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.lib.multipleViews.MultipleViewsHandler", {
		constructor: function(oController, oTemplateUtils, oConfiguration) {
			extend(this, getMethods(oController, oTemplateUtils, oConfiguration));
		}
	});
});
