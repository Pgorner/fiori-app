/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/helpers/KeepAliveHelper", "sap/fe/core/library", "sap/fe/navigation/SelectionVariant", "sap/fe/navigation/library", "sap/ui/Device", "sap/ui/fl/apply/api/ControlVariantApplyAPI", "sap/ui/mdc/p13n/StateUtil"], function (Log, MetaModelConverter, KeepAliveHelper, CoreLibrary, SelectionVariant, NavLibrary, Device, ControlVariantApplyAPI, StateUtil) {
  "use strict";

  var getInvolvedDataModelObjects = MetaModelConverter.getInvolvedDataModelObjects;
  const NavType = NavLibrary.NavType,
    VariantManagementType = CoreLibrary.VariantManagement,
    TemplateContentView = CoreLibrary.TemplateContentView,
    InitialLoadMode = CoreLibrary.InitialLoadMode,
    DISPLAY_CURRENCY_PROPERTY_NAME = "DisplayCurrency";

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const ViewStateOverride = {
    _bSearchTriggered: false,
    applyInitialStateOnly: function () {
      return true;
    },
    onBeforeStateApplied: function (aPromises, navigationType) {
      const oView = this.getView(),
        oController = oView.getController(),
        oFilterBar = oController._getFilterBarControl(),
        aTables = oController._getControls("table");
      if (oFilterBar) {
        oFilterBar.setSuspendSelection(true);
        aPromises.push(oFilterBar.waitForInitialization());
        //This is required to remove any existing or default filter conditions before restoring the filter bar state in hybrid navigation mode.
        if (navigationType === NavType.hybrid) {
          this._clearFilterConditions(oFilterBar);
        }
      }
      aTables.forEach(function (oTable) {
        aPromises.push(oTable.initialized());
      });
      delete this._bSearchTriggered;
    },
    adaptBindingRefreshControls: function (aControls) {
      const oView = this.base.getView(),
        oController = oView.getController(),
        aViewControls = oController._getControls(),
        aControlsToRefresh = KeepAliveHelper.getControlsForRefresh(oView, aViewControls);
      Array.prototype.push.apply(aControls, aControlsToRefresh);
    },
    adaptStateControls: function (aStateControls) {
      const oView = this.base.getView(),
        oController = oView.getController();
      const oFilterBarVM = this._getFilterBarVM(oView);
      if (oFilterBarVM) {
        aStateControls.push(oFilterBarVM);
      }
      if (oController._isMultiMode()) {
        aStateControls.push(oController._getMultiModeControl());
      }
      if (oController._hasMultiVisualizations()) {
        aStateControls.push(oController._getSegmentedButton(TemplateContentView.Chart));
        aStateControls.push(oController._getSegmentedButton(TemplateContentView.Table));
      }
      aStateControls.push(oView.byId("fe::ListReport"));
    },
    retrieveAdditionalStates: function (mAdditionalStates) {
      const oView = this.getView(),
        oController = oView.getController(),
        bPendingFilter = oView.getBindingContext("internal").getProperty("hasPendingFilters");
      mAdditionalStates.dataLoaded = !bPendingFilter || !!this._bSearchTriggered;
      if (oController._hasMultiVisualizations()) {
        const sAlpContentView = oView.getBindingContext("internal").getProperty("alpContentView");
        mAdditionalStates.alpContentView = sAlpContentView;
      }
      delete this._bSearchTriggered;
    },
    applyAdditionalStates: function (oAdditionalStates) {
      const oView = this.getView(),
        oController = oView.getController(),
        oFilterBar = oController._getFilterBarControl();
      if (oAdditionalStates) {
        // explicit check for boolean values - 'undefined' should not alter the triggered search property
        if (oAdditionalStates.dataLoaded === false && oFilterBar) {
          // without this, the data is loaded on navigating back
          oFilterBar._bSearchTriggered = false;
        } else if (oAdditionalStates.dataLoaded === true) {
          if (oFilterBar) {
            const filterBarAPI = oFilterBar.getParent();
            filterBarAPI.triggerSearch();
          }
          this._bSearchTriggered = true;
        }
        if (oController._hasMultiVisualizations()) {
          const oInternalModelContext = oView.getBindingContext("internal");
          if (!Device.system.desktop && oAdditionalStates.alpContentView == TemplateContentView.Hybrid) {
            oAdditionalStates.alpContentView = TemplateContentView.Chart;
          }
          oInternalModelContext.getModel().setProperty(`${oInternalModelContext.getPath()}/alpContentView`, oAdditionalStates.alpContentView);
        }
      }
    },
    /**
     * Determines whether Search can be triggered at initial load of the application or not.
     * @param navigationType Navigation Type during the load of the application
     * @returns A Boolean determining whether Search can be triggered or not
     */
    isSearchTriggeredByInitialLoad(navigationType) {
      const view = this.base.getView(),
        controller = view.getController(),
        viewData = view.getViewData();
      let isSearchTriggeredByInitialLoad = false,
        variantManagement;
      // Determining whether it's Control variantManagement or Page variantManagement
      if (viewData.variantManagement === CoreLibrary.VariantManagement.Control) {
        variantManagement = controller._getFilterBarVariantControl();
      } else {
        variantManagement = view.byId("fe::PageVariantManagement");
      }
      const currentVariantKey = variantManagement?.getCurrentVariantKey();
      //The check shall happen for 'intial load' and 'Apply Automatically' for collapsing the header or
      // always be collapsed if navType is xAppState
      // initialLoad Auto or Disabled
      if (navigationType === NavType.xAppState) {
        return true;
      } else if (variantManagement && viewData.initialLoad !== InitialLoadMode.Enabled) {
        // Header is collapsed if preset filters are set for initial load Auto, Header shall remain expanded if initial load is Auto without preset filters or intial load is disabled
        if (controller._shouldAutoTriggerSearch(this._getFilterBarVM(view))) {
          isSearchTriggeredByInitialLoad = true;
        }
      }
      // initialLoad Enabled
      else if (variantManagement && viewData.initialLoad === InitialLoadMode.Enabled && controller._getApplyAutomaticallyOnVariant(variantManagement, currentVariantKey)) {
        isSearchTriggeredByInitialLoad = true;
      }
      return isSearchTriggeredByInitialLoad;
    },
    _enableFilterBar: function (filterBarControl, preventInitialSearch) {
      const filterBarAPI = filterBarControl.getParent();
      const fnOnSearch = () => {
        this._bSearchTriggered = !preventInitialSearch;
      };

      // reset the suspend selection on filter bar to allow loading of data when needed (was set on LR Init)
      if (filterBarControl.getSuspendSelection()) {
        // Only if search is fired we set _bSearchTriggered.
        // If there was an error due to required filterfields empty or other issues we skip setting _bSearchTriggered.
        filterBarAPI.attachEventOnce("search", fnOnSearch);
        filterBarControl.setSuspendSelection(false);
      } else {
        // search might already be triggered.
        fnOnSearch();
      }
    },
    _applyNavigationParametersToFilterbar: function (oNavigationParameter, aResults) {
      const oView = this.base.getView();
      const oController = oView.getController();
      const oAppComponent = oController.getAppComponent();
      const oComponentData = oAppComponent.getComponentData();
      const oStartupParameters = oComponentData && oComponentData.startupParameters || {};
      const oVariantPromise = this.handleVariantIdPassedViaURLParams(oStartupParameters);
      let bFilterVariantApplied;
      aResults.push(oVariantPromise.then(aVariants => {
        if (aVariants && aVariants.length > 0) {
          if (aVariants[0] === true || aVariants[1] === true) {
            bFilterVariantApplied = true;
          }
        }
        return this._applySelectionVariant(oView, oNavigationParameter, bFilterVariantApplied);
      }).then(() => {
        let bPreventInitialSearch = false;
        const oFilterBarVM = this._getFilterBarVM(oView);
        const oFilterBarControl = oController._getFilterBarControl();
        if (oFilterBarControl) {
          if (oNavigationParameter.navigationType !== NavType.initial && oNavigationParameter.requiresStandardVariant || !oFilterBarVM && oView.getViewData().initialLoad === InitialLoadMode.Enabled || oController._shouldAutoTriggerSearch(oFilterBarVM)) {
            const filterBarAPI = oFilterBarControl.getParent();
            filterBarAPI.triggerSearch();
          } else {
            bPreventInitialSearch = this._preventInitialSearch(oFilterBarVM);
          }
          //collapse or expand shall be available only for non-desktop systems
          if (!Device.system.desktop) {
            const internalModelContext = oView.getBindingContext("internal");
            const searchTriggeredByInitialLoad = this.isSearchTriggeredByInitialLoad(oNavigationParameter.navigationType);
            internalModelContext.setProperty("searchTriggeredByInitialLoad", searchTriggeredByInitialLoad);
          }
          this._enableFilterBar(oFilterBarControl, bPreventInitialSearch);
        }
        return;
      }).catch(function () {
        Log.error("Variant ID cannot be applied");
      }));
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    handleVariantIdPassedViaURLParams: async function (oUrlParams) {
      const aPageVariantId = oUrlParams["sap-ui-fe-variant-id"],
        aFilterBarVariantId = oUrlParams["sap-ui-fe-filterbar-variant-id"],
        aTableVariantId = oUrlParams["sap-ui-fe-table-variant-id"],
        aChartVariantId = oUrlParams["sap-ui-fe-chart-variant-id"];
      let oVariantIDs;
      if (aPageVariantId || aFilterBarVariantId || aTableVariantId || aChartVariantId) {
        oVariantIDs = {
          sPageVariantId: aPageVariantId && aPageVariantId[0],
          sFilterBarVariantId: aFilterBarVariantId && aFilterBarVariantId[0],
          sTableVariantId: aTableVariantId && aTableVariantId[0],
          sChartVariantId: aChartVariantId && aChartVariantId[0]
        };
      }
      return this._handleControlVariantId(oVariantIDs);
    },
    _handleControlVariantId: async function (oVariantIDs) {
      let oVM;
      const oView = this.base.getView(),
        aPromises = [];
      const sVariantManagement = oView.getViewData().variantManagement;
      if (oVariantIDs && oVariantIDs.sPageVariantId && sVariantManagement === "Page") {
        oVM = oView.byId("fe::PageVariantManagement");
        this._handlePageVariantId(oVariantIDs, oVM, aPromises);
      } else if (oVariantIDs && sVariantManagement === "Control") {
        if (oVariantIDs.sFilterBarVariantId) {
          oVM = oView.getController()._getFilterBarVariantControl();
          this._handleFilterBarVariantControlId(oVariantIDs, oVM, aPromises);
        }
        if (oVariantIDs.sTableVariantId) {
          const oController = oView.getController();
          this._handleTableControlVariantId(oVariantIDs, oController, aPromises);
        }
        if (oVariantIDs.sChartVariantId) {
          const oController = oView.getController();
          this._handleChartControlVariantId(oVariantIDs, oController, aPromises);
        }
      }
      return Promise.all(aPromises);
    },
    /*
     * Handles page level variant and passes the variant to the function that pushes the promise to the promise array
     *
     * @param oVarinatIDs contains an object of all variant IDs
     * @param oVM contains the vairant management object for the page variant
     * @param aPromises is an array of all promises
     * @private
     */
    _handlePageVariantId: function (oVariantIDs, oVM, aPromises) {
      oVM.getVariants()?.forEach(oVariant => {
        this._findAndPushVariantToPromise(oVariant, oVariantIDs.sPageVariantId, oVM, aPromises, true);
      });
    },
    /*
     * Handles control level variant for filter bar and passes the variant to the function that pushes the promise to the promise array
     *
     * @param oVarinatIDs contains an object of all variant IDs
     * @param oVM contains the vairant management object for the filter bar
     * @param aPromises is an array of all promises
     * @private
     */

    _handleFilterBarVariantControlId: function (oVariantIDs, oVM, aPromises) {
      if (oVM) {
        oVM.getVariants().forEach(oVariant => {
          this._findAndPushVariantToPromise(oVariant, oVariantIDs.sFilterBarVariantId, oVM, aPromises, true);
        });
      }
    },
    /*
     * Handles control level variant for table and passes the variant to the function that pushes the promise to the promise array
     *
     * @param oVarinatIDs contains an object of all variant IDs
     * @param oController has the list report controller object
     * @param aPromises is an array of all promises
     * @private
     */
    _handleTableControlVariantId: function (oVariantIDs, oController, aPromises) {
      const aTables = oController._getControls("table");
      aTables.forEach(oTable => {
        const oTableVariant = oTable.getVariant();
        if (oTable && oTableVariant) {
          oTableVariant.getVariants().forEach(oVariant => {
            this._findAndPushVariantToPromise(oVariant, oVariantIDs.sTableVariantId, oTableVariant, aPromises);
          });
        }
      });
    },
    /*
     * Handles control level variant for chart and passes the variant to the function that pushes the promise to the promise array
     *
     * @param oVarinatIDs contains an object of all variant IDs
     * @param oController has the list report controller object
     * @param aPromises is an array of all promises
     * @private
     */
    _handleChartControlVariantId: function (oVariantIDs, oController, aPromises) {
      const aCharts = oController._getControls("Chart");
      aCharts.forEach(oChart => {
        const oChartVariant = oChart.getVariant();
        const aVariants = oChartVariant.getVariants();
        if (aVariants) {
          aVariants.forEach(oVariant => {
            this._findAndPushVariantToPromise(oVariant, oVariantIDs.sChartVariantId, oChartVariant, aPromises);
          });
        }
      });
    },
    /*
     * Matches the variant ID provided in the url to the available vairant IDs and pushes the appropriate promise to the promise array
     *
     * @param oVariant is an object for a specific variant
     * @param sVariantId is the variant ID provided in the url
     * @param oVM is the variant management object for the specfic variant
     * @param aPromises is an array of promises
     * @param bFilterVariantApplied is an optional parameter which is set to ture in case the filter variant is applied
     * @private
     */
    _findAndPushVariantToPromise: function (oVariant, sVariantId, oVM, aPromises, bFilterVariantApplied) {
      if (oVariant.key === sVariantId) {
        aPromises.push(this._applyControlVariant(oVM, sVariantId, bFilterVariantApplied));
      }
    },
    _applyControlVariant: async function (oVariant, sVariantID, bFilterVariantApplied) {
      const sVariantReference = this._checkIfVariantIdIsAvailable(oVariant, sVariantID) ? sVariantID : oVariant.getStandardVariantKey();
      const oVM = ControlVariantApplyAPI.activateVariant({
        element: oVariant,
        variantReference: sVariantReference
      });
      return oVM.then(function () {
        return bFilterVariantApplied;
      });
    },
    /************************************* private helper *****************************************/

    /**
     * Variant management used by filter bar.
     * @param view View of the LR filter bar
     * @returns VariantManagement if used
     */
    _getFilterBarVM: view => {
      let variantManagement;
      const viewData = view.getViewData();
      switch (viewData.variantManagement) {
        case VariantManagementType.Page:
          variantManagement = view.byId("fe::PageVariantManagement");
          break;
        case VariantManagementType.Control:
          variantManagement = view.getController()._getFilterBarVariantControl();
          break;
        case VariantManagementType.None:
        default:
          break;
      }
      return variantManagement;
    },
    _preventInitialSearch: function (oVariantManagement) {
      if (!oVariantManagement) {
        return true;
      }
      const aVariants = oVariantManagement.getVariants();
      const oCurrentVariant = aVariants.find(function (oItem) {
        return oItem.getKey() === oVariantManagement.getCurrentVariantKey();
      });
      return !oCurrentVariant.executeOnSelect;
    },
    /**
     * Checks if DisplayCurrency is mandatory for filtering.
     * @param metaModel OdataV4 MetaModel
     * @param contextPath List Report context path.
     * @returns Boolean
     */
    _checkIfDisplayCurrencyIsRequired: function (metaModel, contextPath) {
      const metaContext = metaModel.getMetaContext(contextPath),
        dataModelObjectPath = getInvolvedDataModelObjects(metaContext),
        entitySet = dataModelObjectPath.startingEntitySet._type === "EntitySet" ? dataModelObjectPath.startingEntitySet : undefined,
        requiredProperties = entitySet?.annotations.Capabilities?.FilterRestrictions?.RequiredProperties ?? [],
        displayCurrencyIsMandatory = requiredProperties.some(requiredProperty => requiredProperty.value === DISPLAY_CURRENCY_PROPERTY_NAME);
      return displayCurrencyIsMandatory;
    },
    /**
     * Add DisplayCurrency to SV if it is mandatory and exists in SV defaults.
     * @param view View of the LR filter bar
     * @param sv Selection Variant to apply
     * @param svDefaults Selection Variant defaults
     */
    _addDefaultDisplayCurrencyToSV: function (view, sv, svDefaults) {
      if (!svDefaults || svDefaults?.isEmpty()) {
        return;
      }
      const viewData = view.getViewData(),
        metaModel = view.getModel()?.getMetaModel(),
        contextPath = viewData.contextPath || `/${viewData.entitySet}`,
        displayCurrencyIsMandatory = this._checkIfDisplayCurrencyIsRequired(metaModel, contextPath);
      if (!displayCurrencyIsMandatory) {
        return;
      }
      const svOptions = sv.getSelectOption(DISPLAY_CURRENCY_PROPERTY_NAME),
        defaultSVOptions = svDefaults.getSelectOption(DISPLAY_CURRENCY_PROPERTY_NAME),
        displayCurrencyDefaultExists = !!defaultSVOptions && defaultSVOptions.length > 0,
        noSVDisplayCurrencyExists = !svOptions || !svOptions.length;
      if (noSVDisplayCurrencyExists && displayCurrencyDefaultExists) {
        const displayCurrencySelectOption = defaultSVOptions[0],
          sign = displayCurrencySelectOption["Sign"],
          option = displayCurrencySelectOption["Option"],
          low = displayCurrencySelectOption["Low"],
          high = displayCurrencySelectOption["High"];
        sv.addSelectOption(DISPLAY_CURRENCY_PROPERTY_NAME, sign, option, low, high);
      }
    },
    /**
     * Get adjusted Selection Variant based on 'useFLPDefaultValues' and 'already applied SV'.
     *
     * If useFLPDefaultValues is :
     * 1. FALSE, combine 'appSate SV' and 'already applied SV'.
     * 2. TRUE, 'appSate SV' is same as 'default SV'. Select Options of 'default SV' takes priority over 'already applied SV'.
     * @param filterBarAPI FilterBarAPI to fetch the applied SV
     * @param appStateSV Selection Variant to apply from appState
     * @param useFLPDefaultValues Should FLP defaults be used
     * @returns Adjusted SV
     */
    _getAdjustedSV: async (filterBarAPI, appStateSV, useFLPDefaultValues) => {
      let adjustedSV = new SelectionVariant(appStateSV.toJSONObject());
      const alreadyAppliedSV = await filterBarAPI.getSelectionVariant();
      const appliedSelOptNames = alreadyAppliedSV?.getSelectOptionsPropertyNames() || [];
      if (appliedSelOptNames.length > 0) {
        // We merge 'applied SV' and 'appState SV' based on 'useFLPDefaultValues'.
        adjustedSV = appliedSelOptNames.reduce((svCopy, selOptionName) => {
          // (appStateSV = adjustedSV = svCopy)
          const svSelOpts = svCopy.getSelectOption(selOptionName);
          // If useFLPDefaultValues = true, means (appStateSV = svDefaults)
          if (useFLPDefaultValues && !svSelOpts?.length || !useFLPDefaultValues) {
            // if default SV needs to be used, then select options from default select options take priority.
            // else we merge both: already applied SV and SV from navParams.
            const selectOptions = alreadyAppliedSV.getSelectOption(selOptionName);
            svCopy.massAddSelectOption(selOptionName, selectOptions || []);
          }
          return svCopy;
        }, adjustedSV);
      }
      return adjustedSV;
    },
    /**
     * Apply Selection Variant from Navigation Parameter.
     * @param view View of the LR filter bar
     * @param navigationParameter Selection Variant to apply from appState
     * @param filterVariantApplied Is a filter variant alaready applied
     * @returns Promise for asynchronous handling
     */
    _applySelectionVariant: async function (view, navigationParameter, filterVariantApplied) {
      const filterBar = view.getController()._getFilterBarControl();
      const {
        selectionVariant: sv,
        selectionVariantDefaults: svDefaults,
        requiresStandardVariant: reqStdVariant = false,
        bNavSelVarHasDefaultsOnly: svDefaultsOnly = false
      } = navigationParameter;
      if (!filterBar || !sv) {
        return Promise.resolve();
      }
      const variantManagement = this._getFilterBarVM(view);
      const clearFiltersAndReplaceWithAppState = await this._activeVariantAndGetAppStateOverride(variantManagement, reqStdVariant, filterVariantApplied);
      if (clearFiltersAndReplaceWithAppState) {
        this._addDefaultDisplayCurrencyToSV(view, sv, svDefaults);

        // check if FLP default values are there and is it standard variant
        const svDefaultsArePresent = svDefaults ? svDefaults.getSelectOptionsPropertyNames().length > 0 : false;
        const stdVariantIsDefaultVariant = variantManagement && variantManagement.getDefaultVariantKey() === variantManagement.getStandardVariantKey();
        const useFLPDefaultValues = svDefaultsArePresent && (stdVariantIsDefaultVariant || !variantManagement) && svDefaultsOnly;
        const filterBarAPI = filterBar.getParent();
        let svToSet = sv;
        if (filterVariantApplied || useFLPDefaultValues) {
          svToSet = await this._getAdjustedSV(filterBarAPI, sv, useFLPDefaultValues);
        }
        return filterBarAPI.setSelectionVariant(svToSet, true);
      }
    },
    /**
     * Activate variant from variant management and return if appState needs to be applied.
     * @param variantManagement VariantManagement used by filter bar
     * @param reqStdVariant If standard variant is required to be used
     * @param filterVariantApplied Is a filter variant already applied
     * @returns Promise for asynchronous handling
     */
    _activeVariantAndGetAppStateOverride: async function (variantManagement, reqStdVariant, filterVariantApplied) {
      if (variantManagement && !filterVariantApplied) {
        let variantKey = reqStdVariant ? variantManagement.getStandardVariantKey() : variantManagement.getDefaultVariantKey();
        if (variantKey === null) {
          variantKey = variantManagement.getId();
        }
        await ControlVariantApplyAPI.activateVariant({
          element: variantManagement,
          variantReference: variantKey
        });
        return reqStdVariant || variantManagement.getDefaultVariantKey() === variantManagement.getStandardVariantKey();
      }
      return true;
    },
    /*
     * Sets filtered: false flag to every field so that it can be cleared out
     *
     * @param oFilterBar filterbar control is used to display filter properties in a user-friendly manner to populate values for a query
     * @returns promise which will be resolved to object
     * @private
     */
    _fnClearStateBeforexAppNav: async function (oFilterBar) {
      return StateUtil.retrieveExternalState(oFilterBar).then(oExternalState => {
        const oCondition = oExternalState.filter;
        for (const field in oCondition) {
          if (field !== "$editState" && field !== "$search" && oCondition[field]) {
            oCondition[field].forEach(condition => {
              condition["filtered"] = false;
            });
          }
        }
        return oCondition;
      }).catch(function (oError) {
        Log.error("Error while retrieving the external state", oError);
      });
    },
    _clearFilterConditions: async function (oFilterBar) {
      const aItems = [];
      return oFilterBar.waitForInitialization().then(async () => {
        const oClearConditions = await this._fnClearStateBeforexAppNav(oFilterBar);
        return StateUtil.applyExternalState(oFilterBar, {
          filter: oClearConditions,
          items: aItems
        });
      });
    }
  };
  return ViewStateOverride;
}, false);
//# sourceMappingURL=ViewState-dbg.js.map
