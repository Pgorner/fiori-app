/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/merge", "sap/fe/base/ClassSupport", "sap/fe/core/helpers/PromiseKeeper", "sap/fe/macros/MacroAPI", "sap/fe/macros/filter/FilterUtils", "sap/fe/macros/filterBar/SemanticDateOperators", "sap/fe/macros/mdc/adapter/StateHelper", "sap/fe/navigation/library", "sap/ui/core/Element", "sap/ui/mdc/enums/FieldEditMode", "sap/ui/mdc/p13n/StateUtil"], function (Log, merge, ClassSupport, PromiseKeeper, MacroAPI, FilterUtils, SemanticDateOperators, stateHelper, library, UI5Element, FieldEditMode, StateUtil) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14;
  var NavType = library.NavType;
  var xmlEventHandler = ClassSupport.xmlEventHandler;
  var property = ClassSupport.property;
  var implementInterface = ClassSupport.implementInterface;
  var event = ClassSupport.event;
  var defineUI5Class = ClassSupport.defineUI5Class;
  var aggregation = ClassSupport.aggregation;
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  // Track telemetry content for the filterBar
  let FilterBarTelemetry = /*#__PURE__*/function () {
    function FilterBarTelemetry(filterBarAPI) {
      this.countFilterActions = 0;
      this.countVariantFilters = 0;
      this.filterBarAPI = filterBarAPI;
    }
    var _proto = FilterBarTelemetry.prototype;
    _proto.onFiltersChanged = function onFiltersChanged(reason) {
      if (reason === "Variant") {
        this.countVariantFilters++;
      } else {
        this.countFilterActions++;
      }
    };
    _proto.onSearch = function onSearch(eventParameters, conditions) {
      const filterNames = this.getFilterNamesFromConditions(conditions);
      this.filterBarAPI.getController().telemetry.storeAction({
        type: "FE.FilterBarSearch",
        parameters: {
          countFilterActions: this.countFilterActions,
          //  How many filterChanged actions are performed
          countFilters: Object.keys(conditions).length,
          // How many different filters are applied
          countVariantFilters: this.countVariantFilters,
          // How many filter belong to a variant
          variantLayer: this.filterBarAPI.getVariant()?.layer ?? "None",
          // | "SAP" | "Custom"; // Type of variant
          autoLoad: eventParameters.reason === "Variant",
          // Is the filter automatically executed
          searchUsed: conditions.$search ? !!Object.keys(conditions.$search).length : false,
          // Was the search field in the filterbar used?
          filterNames: filterNames // Property names of the filters
        }
      });
      // Reset the count
      this.countFilterActions = 0;
      this.countVariantFilters = 0;
    };
    _proto.getFilterNamesFromConditions = function getFilterNamesFromConditions(conditions) {
      let filterNames = "";
      Object.keys(conditions).forEach(condition => {
        if (condition != "$search") {
          filterNames += condition + ";";
        }
      });
      return filterNames;
    };
    return FilterBarTelemetry;
  }();
  /**
   * Building block for creating a FilterBar based on the metadata provided by OData V4.
   * <br>
   * Usually, a SelectionFields annotation is expected.
   *
   *
   * Usage example:
   * <pre>
   * &lt;macros:FilterBar id="MyFilterBar" metaPath="@com.sap.vocabularies.UI.v1.SelectionFields" /&gt;
   * </pre>
   * @alias sap.fe.macros.FilterBar
   * @public
   */
  let FilterBarAPI = (_dec = defineUI5Class("sap.fe.macros.filterBar.FilterBarAPI", {
    returnTypes: ["sap.ui.core.Control"]
  }), _dec2 = implementInterface("sap.fe.core.controllerextensions.viewState.IViewStateContributor"), _dec3 = property({
    type: "string"
  }), _dec4 = property({
    type: "string",
    expectedAnnotations: ["com.sap.vocabularies.UI.v1.SelectionFields"],
    expectedTypes: ["EntitySet", "EntityType"]
  }), _dec5 = property({
    type: "string",
    expectedTypes: ["EntitySet", "EntityType", "NavigationProperty"]
  }), _dec6 = property({
    type: "boolean",
    defaultValue: false
  }), _dec7 = property({
    type: "boolean",
    defaultValue: true
  }), _dec8 = property({
    type: "boolean",
    defaultValue: true
  }), _dec9 = property({
    type: "boolean",
    defaultValue: false
  }), _dec10 = aggregation({
    type: "sap.fe.macros.filterBar.FilterField",
    multiple: true
  }), _dec11 = event(), _dec12 = event(), _dec13 = event(), _dec14 = event(), _dec15 = event(), _dec16 = xmlEventHandler(), _dec17 = xmlEventHandler(), _dec(_class = (_class2 = /*#__PURE__*/function (_MacroAPI) {
    function FilterBarAPI(props, others) {
      var _this;
      _this = _MacroAPI.call(this, props, others) || this;
      _initializerDefineProperty(_this, "__implements__sap_fe_core_controllerextensions_viewState_IViewStateContributor", _descriptor, _this);
      _this.initialControlState = {};
      _this._initialStatePromise = new PromiseKeeper();
      /**
       * The identifier of the FilterBar control.
       */
      _initializerDefineProperty(_this, "id", _descriptor2, _this);
      /**
       * Defines the relative path of the property in the metamodel, based on the current contextPath.
       * @public
       */
      _initializerDefineProperty(_this, "metaPath", _descriptor3, _this);
      /**
       * Defines the path of the context used in the current page or block.
       * This setting is defined by the framework.
       * @public
       */
      _initializerDefineProperty(_this, "contextPath", _descriptor4, _this);
      /**
       * If true, the search is triggered automatically when a filter value is changed.
       * @public
       */
      _initializerDefineProperty(_this, "liveMode", _descriptor5, _this);
      /**
       * Parameter which sets the visibility of the FilterBar building block
       * @public
       */
      _initializerDefineProperty(_this, "visible", _descriptor6, _this);
      /**
       * Displays possible errors during the search in a message box
       * @public
       */
      _initializerDefineProperty(_this, "showMessages", _descriptor7, _this);
      /**
       * Handles the visibility of the 'Clear' button on the FilterBar.
       * @public
       */
      _initializerDefineProperty(_this, "showClearButton", _descriptor8, _this);
      /**
       * Aggregate filter fields of the FilterBar building block
       * @public
       */
      _initializerDefineProperty(_this, "filterFields", _descriptor9, _this);
      /**
       * This event is fired when the 'Go' button is pressed or after a condition change.
       * @public
       */
      _initializerDefineProperty(_this, "search", _descriptor10, _this);
      /**
       * This event is fired when the 'Go' button is pressed or after a condition change. This is only internally used by sap.fe (Fiori elements) and
       * exposes parameters from internal MDC-FilterBar search event
       * @private
       */
      _initializerDefineProperty(_this, "internalSearch", _descriptor11, _this);
      /**
       * This event is fired after either a filter value or the visibility of a filter item has been changed. The event contains conditions that will be used as filters.
       * @public
       */
      _initializerDefineProperty(_this, "filterChanged", _descriptor12, _this);
      /**
       * This event is fired when the 'Clear' button is pressed. This is only possible when the 'Clear' button is enabled.
       * @public
       */
      _initializerDefineProperty(_this, "afterClear", _descriptor13, _this);
      /**
       * This event is fired after either a filter value or the visibility of a filter item has been changed. The event contains conditions that will be used as filters.
       * This is used internally only by sap.fe (Fiori Elements). This exposes parameters from the MDC-FilterBar filterChanged event that is used by sap.fe in some cases.
       * @private
       */
      _initializerDefineProperty(_this, "internalFilterChanged", _descriptor14, _this);
      _this.telemetry = new FilterBarTelemetry(_this);
      _this.attachStateChangeHandler();
      return _this;
    }
    _inheritsLoose(FilterBarAPI, _MacroAPI);
    var _proto2 = FilterBarAPI.prototype;
    _proto2.applyLegacyState = async function applyLegacyState(getControlState, _navParameters, shouldApplyDiffState, skipMerge) {
      const filterBar = this.content;
      const filterBarState = getControlState(filterBar);
      const controlState = {};
      if (filterBarState) {
        controlState.innerState = {
          ...filterBarState,
          fullState: {
            ...controlState.innerState?.fullState,
            ...filterBarState.fullState
          },
          initialState: {
            ...controlState.innerState?.initialState,
            ...filterBarState.initialState
          }
        };
      }
      if (controlState && Object.keys(controlState).length > 0) {
        await this.applyState(controlState, _navParameters, shouldApplyDiffState, skipMerge);
      }
    };
    _proto2.applyState = async function applyState(controlState, navParameter, shouldApplyDiffState, skipMerge) {
      try {
        if (controlState && navParameter) {
          const navigationType = navParameter.navigationType;
          //When navigation type is hybrid, we override the filter conditions in IAppState with SV received from XappState
          if (navigationType === NavType.hybrid && controlState.innerState?.fullState !== undefined) {
            const xAppStateFilters = await this.convertSelectionVariantToStateFilters(navParameter.selectionVariant, true);
            const mergedFullState = {
              ...controlState.innerState?.fullState,
              filter: {
                ...controlState.innerState?.fullState.filter,
                ...xAppStateFilters
              }
            };
            //when navigating from card, remove all existing filters values (default or otherwise) and then apply the state
            await this._clearFilterValuesWithOptions(this.content, {
              clearEditFilter: true
            });
            return await StateUtil.applyExternalState(this.content, mergedFullState);
          }
          if (shouldApplyDiffState) {
            const diffState = await StateUtil.diffState(this.content, controlState.innerState?.initialState, controlState.innerState?.fullState);
            return await StateUtil.applyExternalState(this.content, diffState);
          } else if (skipMerge) {
            //skipMerge is true when coming from the dynamic tile, in this case, remove all existing filters values (default or otherwise)
            await this._clearFilterValuesWithOptions(this.content, {
              clearEditFilter: true
            });
          }
          return await StateUtil.applyExternalState(this.content, controlState?.innerState?.fullState ?? controlState);
        }
      } catch (error) {
        Log.error(error);
      } finally {
        this._initialStatePromise.resolve();
      }
    };
    _proto2.waitForInitialState = async function waitForInitialState() {
      return this._initialStatePromise.promise;
    };
    _proto2.getControlState = function getControlState(controlState) {
      const initialControlState = this.initialControlState;
      if (controlState) {
        return {
          fullState: controlState,
          initialState: initialControlState
        };
      }
      return controlState;
    };
    _proto2.retrieveState = async function retrieveState() {
      const filterBarState = {};
      //const controlStateKey = this.getStateKey(filterBar);
      filterBarState.innerState = this.getControlState(await StateUtil.retrieveExternalState(this.content));
      // remove sensitive or view state irrelevant fields
      const propertiesInfo = this.content.getPropertyInfoSet();
      const filter = filterBarState.innerState?.filter || {};
      propertiesInfo.filter(function (propertyInfo) {
        return Object.keys(filter).length > 0 && propertyInfo.path && filter[propertyInfo.path] && (propertyInfo.removeFromAppState || filter[propertyInfo.path].length === 0);
      }).forEach(function (PropertyInfo) {
        if (PropertyInfo.path) {
          delete filter[PropertyInfo.path];
        }
      });
      return filterBarState;
    };
    _proto2.setInitialState = async function setInitialState() {
      try {
        const initialControlState = await StateUtil.retrieveExternalState(this.content);
        this.initialControlState = initialControlState;
      } catch (e) {
        Log.error(e);
      }
    };
    _proto2.attachStateChangeHandler = function attachStateChangeHandler() {
      StateUtil.detachStateChange(this.stateChangeHandler);
      StateUtil.attachStateChange(this.stateChangeHandler);
    };
    _proto2.stateChangeHandler = function stateChangeHandler(oEvent) {
      const control = oEvent.getParameter("control");
      if (control.isA("sap.ui.mdc.FilterBar")) {
        const filterBarAPI = control.getParent();
        if (filterBarAPI?.handleStateChange) {
          filterBarAPI.handleStateChange();
        }
      }
    };
    _proto2.handleSearch = function handleSearch(oEvent) {
      const oFilterBar = oEvent.getSource();
      const eventParameters = oEvent.getParameters();
      if (oFilterBar) {
        const conditions = oFilterBar.getFilterConditions() ?? {};
        const preparedEventParameters = this._prepareEventParameters(oFilterBar);
        this.telemetry?.onSearch(eventParameters, conditions);
        this.fireEvent("internalSearch", merge({
          conditions: conditions
        }, eventParameters));
        this.fireEvent("search", merge({
          reason: eventParameters.reason
        }, preparedEventParameters));
      }
    };
    _proto2.handleFilterChanged = function handleFilterChanged(oEvent) {
      const filterBar = oEvent.getSource();
      const oEventParameters = oEvent.getParameters();
      if (filterBar) {
        const oConditions = filterBar.getFilterConditions();
        const eventParameters = this._prepareEventParameters(filterBar);
        this.telemetry?.onFiltersChanged(this._getFilterBarReason(filterBar));
        this.fireEvent("internalFilterChanged", merge({
          conditions: oConditions
        }, oEventParameters));
        this.fireEvent("filterChanged", eventParameters);
      }
    };
    _proto2._getFilterBarReason = function _getFilterBarReason(filterBar) {
      return filterBar?._sReason ?? "";
    };
    _proto2._prepareEventParameters = function _prepareEventParameters(oFilterBar) {
      const {
        parameters,
        filters,
        search
      } = FilterUtils.getFilters(oFilterBar) || {};
      return {
        parameters,
        filters,
        search
      };
    }

    /**
     * Set the filter values for the given property in the filter bar.
     * The filter values can be either a single value or an array of values.
     * Each filter value must be represented as a primitive value.
     * @param sConditionPath The path to the property as a condition path
     * @param [sOperator] The operator to be used (optional) - if not set, the default operator (EQ) will be used
     * @param vValues The values to be applied
     * @returns A promise for asynchronous handling
     * @public
     */;
    _proto2.setFilterValues = async function setFilterValues(sConditionPath, sOperator, vValues) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (arguments.length === 2) {
        vValues = sOperator;
        return FilterUtils.setFilterValues(this.content, sConditionPath, vValues);
      }
      return FilterUtils.setFilterValues(this.content, sConditionPath, sOperator, vValues);
    }

    /**
     * Get the Active Filters Text Summary for the filter bar.
     * @returns Active filters summary as text
     * @public
     */;
    _proto2.getActiveFiltersText = function getActiveFiltersText() {
      return this.content?.getAssignedFiltersText()?.filtersText || "";
    }

    /**
     * Provides all the filters that are currently active
     * along with the search expression.
     * @returns An array of active filters and the search expression.
     * @public
     */;
    _proto2.getFilters = function getFilters() {
      return FilterUtils.getFilters(this.content) || {};
    }

    /**
     * Triggers the API search on the filter bar.
     * @returns Returns a promise which resolves if filter go is triggered successfully; otherwise gets rejected.
     * @public
     */;
    _proto2.triggerSearch = async function triggerSearch() {
      const filterBar = this.content;
      try {
        if (filterBar) {
          await filterBar.waitForInitialization();
          return await filterBar.triggerSearch();
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        Log.error(`FE : Buildingblock : FilterBar : ${message}`);
        throw Error(message);
      }
    };
    _proto2.isSemanticDateFilterApplied = function isSemanticDateFilterApplied() {
      return SemanticDateOperators.hasSemanticDateOperations(this.content.getConditions(), false);
    }

    /**
     * Get the selection variant from the filter bar.
     * @returns A promise which resolves with a {@link sap.fe.navigation.SelectionVariant}
     * @public
     */;
    _proto2.getSelectionVariant = async function getSelectionVariant() {
      return stateHelper.getSelectionVariant(this.getContent());
    }

    /**
     * Get the list of mandatory filter property names.
     * @returns The list of mandatory filter property names
     */;
    _proto2.getMandatoryFilterPropertyNames = function getMandatoryFilterPropertyNames() {
      return this.content.getPropertyInfoSet().filter(function (filterProp) {
        return filterProp.required;
      }).map(function (requiredProp) {
        return requiredProp.conditionPath;
      });
    }

    /**
     * Get the filter bar parameters for a parameterized service.
     * @returns Array of parameters configured in a parameterized service
     */;
    _proto2.getParameters = function getParameters() {
      const filterBar = this.content;
      const parameters = filterBar.data("parameters");
      if (parameters) {
        return Array.isArray(parameters) ? parameters : JSON.parse(parameters);
      }
      return [];
    };
    _proto2.getVariant = function getVariant() {
      let currentVariant;
      try {
        const variantModel = this.getModel("$FlexVariants");
        const variantBackReference = this.content.getVariantBackreference();
        if (variantModel && variantBackReference) {
          currentVariant = variantModel.getVariant(variantModel.getCurrentVariantReference(variantBackReference));
        }
      } catch (e) {
        Log.debug("Couldn't fetch variant ", e);
      }
      return currentVariant;
    }

    /**
     * Shows or hides any filter field from the filter bar.
     * The property will not be hidden inside the adaptation dialog and may be re-added.
     * @param conditionPath The path to the property as a condition path
     * @param visible Whether it should be shown or hidden
     * @returns A {@link Promise} resolving once the change in visibility was applied
     * @public
     */;
    _proto2.setFilterFieldVisible = async function setFilterFieldVisible(conditionPath, visible) {
      await StateUtil.applyExternalState(this.content, {
        items: [{
          name: conditionPath,
          visible
        }]
      });
    }

    /**
     * Gets the visibility of a filter field.
     * @param conditionPath The path to the property as a condition path
     * @returns A {@link Promise} that resolves to check whether the filter field is visible or not.
     * @public
     */;
    _proto2.getFilterFieldVisible = async function getFilterFieldVisible(conditionPath) {
      const state = await StateUtil.retrieveExternalState(this.content);
      return !!state.items.find(item => item.name === conditionPath);
    }

    /**
     * Gets the associated variant management.
     * @returns The {@link sap.ui.fl.variants.VariantManagement} control associated with the filter bar.
     */;
    _proto2.getVariantManagement = function getVariantManagement() {
      const variantBackreference = this.content.getVariantBackreference();
      if (variantBackreference) {
        return UI5Element.getElementById(variantBackreference);
      } else {
        throw new Error(`Variant back reference not defined on the filter bar ${this.id}`);
      }
    }

    /**
     * Sets the variant back reference association for this instance.
     * @param variant The `VariantManagement` instance to set as the back reference.
     */;
    _proto2.setVariantBackReference = function setVariantBackReference(variant) {
      if (!this.liveMode) {
        this.content.setVariantBackreference(variant);
      }
    }

    /**
     * Gets the key of the current variant in the associated variant management.
     * @returns Key of the currently selected variant. In case the model is not yet set, `null` will be returned.
     * @public
     */;
    _proto2.getCurrentVariantKey = function getCurrentVariantKey() {
      return this.getVariantManagement().getCurrentVariantKey();
    }

    /**
     * Sets the new selected variant in the associated variant management.
     * @param key Key of the variant that should be selected. If the passed key doesn't identify a variant, it will be ignored.
     * @public
     */;
    _proto2.setCurrentVariantKey = function setCurrentVariantKey(key) {
      const variantManagement = this.getVariantManagement();
      variantManagement.setCurrentVariantKey(key);
    }

    /**
     * Sets the enablement of the field.
     * @param name Name of the field that should be enabled or disabled.
     * @param enabled Whether the field should be enabled or disabled.
     * @public
     */;
    _proto2.setFilterFieldEnabled = function setFilterFieldEnabled(name, enabled) {
      this.getModel("internal").setData({
        [this.content.data("localId")]: {
          filterFields: {
            [name]: {
              editMode: enabled ? FieldEditMode.Editable : FieldEditMode.Disabled
            }
          }
        }
      }, true);
    }

    /**
     * Determines whether the field is enabled or disabled.
     * @param name Name of the field.
     * @returns Whether the filterField is enabled or disabled.
     * @public
     */;
    _proto2.getFilterFieldEnabled = function getFilterFieldEnabled(name) {
      return this.getModel("internal").getProperty(`/${this.content.data("localId")}/filterFields/${name}/editMode`) === FieldEditMode.Disabled ? false : true;
    }

    /**
     * Convert {@link sap.fe.navigation.SelectionVariant} to conditions.
     * @param selectionVariant The selection variant to apply to the filter bar.
     * @param prefillDescriptions If true, we try to find the associated Text value for each property in the selectionVariant (to avoid fetching it from the server)
     * @returns A promise resolving to conditions
     */;
    _proto2.convertSelectionVariantToStateFilters = async function convertSelectionVariantToStateFilters(selectionVariant, prefillDescriptions) {
      return stateHelper.convertSelectionVariantToStateFilters(this.content, selectionVariant, prefillDescriptions, this.content?.getModel());
    }

    /**
     * Clears all input values of visible filter fields in the filter bar with flag to indicate whether to clear Edit Filter or not.
     * @param filterBar The filter bar that contains the filter field
     * @param options Options for filtering on the filter bar
     * @param options.clearEditFilter Whether to clear the edit filter or let it be default value 'All' instead
     */;
    _proto2._clearFilterValuesWithOptions = async function _clearFilterValuesWithOptions(filterBar, options) {
      await stateHelper._clearFilterValuesWithOptions(filterBar, options);
    }

    /**
     * Sets {@link sap.fe.navigation.SelectionVariant} to the filter bar. Note: setSelectionVariant will clear existing filters and then apply the SelectionVariant values.
     * @param selectionVariant The {@link sap.fe.navigation.SelectionVariant} to apply to the filter bar
     * @param prefillDescriptions Optional. If true, we will use the associated text property values (if they're available in the selectionVariant) to display the filter value descriptions, instead of loading them from the backend
     * @returns A promise for asynchronous handling
     * @public
     */;
    _proto2.setSelectionVariant = async function setSelectionVariant(selectionVariant) {
      let prefillDescriptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return stateHelper.setSelectionVariantToMdcControl(this.getContent(), selectionVariant, prefillDescriptions);
    }

    /**
     * Called by the MDC state util when the state for this control's child has changed.
     */;
    _proto2.handleStateChange = function handleStateChange() {
      this.getPageController()?.getExtensionAPI().updateAppState();
    };
    _proto2.showFilterField = async function showFilterField(name) {
      const state = await StateUtil.retrieveExternalState(this.content);
      const targetFilterField = !!state.items.find(item => item.name === name);
      if (!targetFilterField) {
        state.items.push({
          name
        });
      }
      await StateUtil.applyExternalState(this.content, state);
    };
    _proto2.openValueHelpForFilterField = function openValueHelpForFilterField(name, inputValue, fnCallback) {
      const filterField = this.content.getFilterItems().find(item => item.getPropertyKey() === name);
      if (filterField) {
        const valueHelp = UI5Element.getElementById(filterField.getValueHelp());
        if (valueHelp) {
          let selectedItems = [];
          const handleItemSelected = oEvent => {
            selectedItems = oEvent.getParameter("conditions");
          };
          valueHelp.attachClosed(() => {
            valueHelp.detachSelect(handleItemSelected, this);
            fnCallback?.(selectedItems);
          });
          valueHelp.attachSelect(handleItemSelected, this);
        }
        filterField._oFocusInfo = {
          targetInfo: {
            silent: true
          }
        };
        filterField.onfocusin?.();
        setTimeout(() => {
          filterField.getAggregation("_content")[0].fireValueHelpRequest({
            fromKeyboard: true,
            _userInputValue: inputValue
          });
        }, 200);
      }
    };
    _proto2.getCollapsedFiltersText = function getCollapsedFiltersText() {
      return this.content?.getAssignedFiltersText()?.filtersText;
    };
    return FilterBarAPI;
  }(MacroAPI), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "__implements__sap_fe_core_controllerextensions_viewState_IViewStateContributor", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return true;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "metaPath", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "contextPath", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "liveMode", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "visible", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "showMessages", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "showClearButton", [_dec9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "filterFields", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "search", [_dec11], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "internalSearch", [_dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "filterChanged", [_dec13], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "afterClear", [_dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "internalFilterChanged", [_dec15], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, "handleSearch", [_dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "handleSearch"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "handleFilterChanged", [_dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "handleFilterChanged"), _class2.prototype), _class2)) || _class);
  return FilterBarAPI;
}, false);
//# sourceMappingURL=FilterBarAPI-dbg.js.map
