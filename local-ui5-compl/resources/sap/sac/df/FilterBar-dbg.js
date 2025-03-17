/* SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
   */
/*global sap*/
sap.ui.define("sap/sac/df/FilterBar", [
  "sap/ui/mdc/FilterBar",
  "sap/sac/df/FilterField",
  "sap/ui/mdc/enums/FieldDisplay",
  "sap/ui/base/ManagedObjectObserver",
  "sap/ui/mdc/enums/FilterBarValidationStatus",
  "sap/ui/mdc/util/FilterUtil",
  "sap/ui/core/library",
  "sap/sac/df/thirdparty/lodash",
  "sap/ui/fl/apply/_internal/flexObjects/States"
], function (MDCFilterBar, FilterField, FieldDisplay, ManagedObjectObserver, FilterBarValidationStatus, FilterUtil, coreLibrary, _, States) {

  /**
   * Constructor for a new Filter Bar.
   *
   * @class A Filter Bar based on Multidimensional Model
   * @extends sap.ui.mdc.FilterBar
   *
   * @author SAP SE
   * @version 1.132.0
   *
   * @constructor
   * @public
   * @experimental since version 1.119
   * @alias sap.sac.df.FilterBar
   */
  const {ValueState} = coreLibrary;
  const FilterBar = MDCFilterBar.extend("sap.sac.df.FilterBar",/** @lends sap.sac.df.FilterBar.prototype */ {
    metadata: {
      library: "sap.sac.df",
      properties: {
        /**
         * Defines the relative path of the property in the metamodel, based on the current contextPath.
         **/
        metaPath: {
          type: "string"
        }
      }
    },
    renderer: "sap.ui.mdc.FilterBarRenderer",
    init: function () {
      if (MDCFilterBar.prototype.init) {
        MDCFilterBar.prototype.init.apply(this, arguments);
      }
      this._getObserver().observe(this, {
        aggregations: ["dependents"]
      });
      this.setP13nMode(["Item", "Value"]);
      this.setDelegate({name: "sap/sac/df/filter/delegate/FilterBarDelegate"});
      this._aChangedVariables = [];
    },

    _applyFailedChanges: function () {
      let oOwnerComponent = this._getView().getController().getOwnerComponent();
      const sLocalId = this.getId().split(this._getView().getController().getOwnerComponent().getId() + "---").pop();
      this._loadFlex().then((oFlex) => {
        if (oFlex) {
          oFlex.getVariantModel(oOwnerComponent).then((oVM) => {
            if(oVM.getVariantManagementReference().variantManagementReference !== "") {
              let aControlChanges = oVM.getVariant(oVM.getCurrentControlVariantIds()[0]).controlChanges;
              let aFailedChanges = aControlChanges.filter((oChange) => {
                return oChange.getApplyState() === States.ApplyState.APPLY_FAILED && oChange.getProperty("selector").id === sLocalId;
              });
              oVM.getVariant(oVM.getCurrentControlVariantIds()[0]).controlChanges = aControlChanges.filter((oChange) => {
                return oChange.getApplyState() !== States.ApplyState.APPLY_FAILED && oChange.getProperty("selector").id === sLocalId;
              });
              _.forEach(aFailedChanges, (oChange) => {
                oChange.setApplyState(States.ApplyState.INITIAL);
                oChange.setState(States.LifecycleState.DIRTY);
              });
              if (aFailedChanges) {
                return oVM.addAndApplyChangesOnVariant(aFailedChanges);
              }
            }
          });
        }
      });
    },


    onAfterRendering: function () {
      if (this.getFilterItems().length === 0) {
        this._setPaths();
        if (!_.isEmpty(this._getMetaObject())) {
          return this._setupFilterBar();
        } else {
          if (this._isVariableGroup()) {
            this._getMultiDimModel().attachEventOnce("variableGroupsAdded", null, this._setupFilterBar.bind(this));
          } else {
            this._getMultiDimModel().attachEventOnce("dataProviderAdded", null, this._setupFilterBar.bind(this));
          }
        }
      }
    },

    getFilterConditions: function () {
      return this._getConditionModel().getData().conditions;
    },

    _setPaths: function () {
      this._metaObjectPath = this.getMetaPath().split(">")[1];
    },

    _getMetaObjectType: function () {
      if (this.getMetaPath().includes("/VariableGroups")) {
        return "sap.sac.df.model.VariableGroup";
      } else if (this.getMetaPath().includes("/Variables")) {
        return "sap.sac.df.model.Variable";
      } else if (this.getMetaPath().includes("/Dimensions")) {
        return "sap.sac.df.model.Dimension";
      }
    },

    _isVariableGroup: function () {
      return this._getMetaObjectType() === "sap.sac.df.model.VariableGroup";
    },

    _getMetaObjectPath: function () {
      return this._metaObjectPath;
    },

    _getMultiDimModel: function () {
      return this.getModel(this._getMultiDimModelName());
    },

    _getMultiDimModelName: function () {
      return this.getMetaPath().split(">")[0];
    },

    _getMetaObject: function () {
      return this._getMultiDimModel().getProperty(this._metaObjectPath);
    },

    _setupFilterBar: function () {
      if (this.getFilterItems().length === 0) {
        _.forEach(this._getMetaObject(), (oMetaObject) => {
          if (!this._isVariableGroup() || _.isUndefined(oMetaObject.VisibleInFilterBar) || (!_.isUndefined(oMetaObject.VisibleInFilterBar) && oMetaObject.VisibleInFilterBar)) {
            const oFilterField = this.createFilterField(oMetaObject.Name);
            this.addFilterItem(oFilterField);
            oFilterField.setModel(this._getMultiDimModel(), this._getMultiDimModelName());
            oFilterField._setupFilterFieldFromMetaPath();
          } else {
            this._setConditions(oMetaObject.getMemberFilter(), oMetaObject, this);
          }
          return this.finalizePropertyHelper();
        });
        return this._applyFailedChanges();
      }
    },

    _setConditions: function (aMemberFilter, oVariable) {
      var aFilter = [];
      if (aMemberFilter && aMemberFilter.length > 0) {
        _.forEach(aMemberFilter, function (oMemberFilter) {
          return aFilter.push({
            operator: oMemberFilter.Operator,
            validated: "Validated",
            values: oMemberFilter.InternalKey
          });
        });
        this._getConditionModel().setProperty("/conditions/" + oVariable.Name, aFilter);
      }
      return aFilter;
    },

    createFilterField: function (sMetaObjectName) {
      return new FilterField(this.getFilterFieldId(sMetaObjectName), {
        metaPath: this.getMetaPath() + "/" + sMetaObjectName,
        propertyKey: sMetaObjectName,
        delegate: {name: "sap/sac/df/filter/delegate/FieldBaseDelegate"}
      });
    },

    getFilterFieldId: function (sPropertyName) {
      return this.getId() + "::FilterField::" + sPropertyName.replace(/[^0-9A-Z_.:-]/gi, "");
    },

    _getObserver: function () {
      if (!this._oObserver) {
        this._oObserver = new ManagedObjectObserver(this._observeChanges.bind(this));
      }
      return this._oObserver;
    },

    _observeChanges: function (oChanges) {
      MDCFilterBar.prototype._observeChanges.apply(this, arguments);
      if (oChanges.name === "dependents" && oChanges.mutation === "insert" && oChanges.child && oChanges.child.isA("sap.m.p13n.Popup")) {
        this._onOpenAdaptFilterDialog(oChanges.child);
      }
    },

    _onOpenAdaptFilterDialog: function (oP13nPopup) {
      const that = this;
      this._adaptFiltersDialogIsOpen = true;
      this._oVariablesBeforeOpeningAdaptFilters = {};
      _.forEach(this._getMetaObject(), function (oMetaObject) {
        const aMemberFilter = that._isVariableGroup() ? [].concat(oMetaObject.MergedVariable.MemberFilter) : [].concat(oMetaObject.MemberFilter);
        this._oVariablesBeforeOpeningAdaptFilters[oMetaObject.Name] = {
          Name: oMetaObject.Name, MemberFilter: aMemberFilter
        };
      }.bind(this));
      this.retrieveInbuiltFilter().then(function (oP13nFilter) {
        that._adaptFilters = oP13nFilter;
      });
      const fnPressCancelButton = function (oEvent) {
        if (oEvent.getParameters().reason === "Cancel") {
          _.forEach(_.uniq(this._aChangedVariables), (sChangedVariable) => {
            const oStoredVariable = this._oVariablesBeforeOpeningAdaptFilters[sChangedVariable];
            const aMemberFilter = oStoredVariable.MemberFilter ? oStoredVariable.MemberFilter : [];
            _.forEach(aMemberFilter, (oMemberFilter) => {
              oMemberFilter.UniqueID = null;
            });
            const oVariable = _.find(this._getMetaObject(), function (oObject) {
              return oObject.Name === sChangedVariable;
            });
            oVariable && oVariable.setMemberFilter(aMemberFilter);
          });
          that._adaptFiltersDialogIsOpen = false;
        }
        this._aChangedVariables = [];
        this._oVariablesBeforeOpeningAdaptFilters = undefined;
      };
      oP13nPopup.attachClose(null, fnPressCancelButton, this);
    },

    _filterChanged: function (oFilterField) {
      this._aChangedVariables.push(oFilterField.getPropertyKey());
      this.fireFiltersChanged({
        conditionsBased: true,
        filtersTextExpanded: this._getAssignedFiltersExpandedText(),
        filtersText: this._getAssignedFiltersCollapsedText()
      });
    },

    _checkRequiredFields: function () {
      let vRetErrorState = FilterBarValidationStatus.NoError;

      const aReqFiltersWithoutValue = this._getRequiredFieldNamesWithoutValues();
      aReqFiltersWithoutValue.forEach((sName) => {
        const oFilterField = this._getFilterField(sName);
        if (oFilterField) {
          if (oFilterField.getValueState() === ValueState.None) {
            oFilterField.setValueState(ValueState.Error);
            oFilterField.setValueStateText(this._getRequiredFilterFieldValueText(oFilterField));
          }
        }
        vRetErrorState = FilterBarValidationStatus.RequiredHasNoValue;
      });

      return vRetErrorState;
    },

    _getRequiredFieldNamesWithoutValues: function () {
      const aReqFiltersWithoutValue = [];
      if (this._getRequiredPropertyNames) {
        this._getRequiredPropertyNames().forEach((sName) => {
          let oFilterField = this._getFilterField(sName);
          let oMetaObject = oFilterField && oFilterField._getMetaObject && oFilterField._getMetaObject();
          if (oMetaObject) {
            var oVariable = oMetaObject.MergedVariable ? oMetaObject.MergedVariable : oMetaObject;
            const aMemberFilter = oVariable && oVariable.MemberFilter;
            if (!aMemberFilter || aMemberFilter.length === 0) {
              aReqFiltersWithoutValue.push(sName);
            }
          }
        });
      }

      return aReqFiltersWithoutValue;
    }
  });

  return FilterBar;
});
