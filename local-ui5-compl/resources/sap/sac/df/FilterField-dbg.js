/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap,Promise*/
sap.ui.define("sap/sac/df/FilterField", [
  "sap/ui/mdc/FilterField",
  "sap/ui/core/Element",
  "sap/ui/mdc/field/FieldBase",
  "sap/ui/mdc/field/FieldBaseRenderer",
  "sap/ui/mdc/enums/FieldDisplay",
  "sap/base/util/merge",
  "sap/base/util/deepEqual",
  "sap/sac/df/model/MemberFilter",
  "sap/sac/df/utils/ResourceBundle",
  "sap/sac/df/filter/TypeMap",
  "sap/ui/mdc/condition/Condition",
  "sap/ui/base/ManagedObjectObserver",
  "sap/ui/mdc/enums/ConditionValidated",
  "sap/ui/mdc/ValueHelp",
  "sap/sac/df/filter/ValueHelp",
  "sap/ui/mdc/valuehelp/content/FixedListItem",
  "sap/ui/mdc/valuehelp/Popover",
  "sap/ui/core/date/UI5Date",
  "sap/ui/core/library",
  "sap/sac/df/firefly/library",
  "sap/sac/df/thirdparty/lodash",
  "sap/sac/df/types/DisplayType",
  "sap/ui/mdc/field/ConditionType",
  "sap/ui/model/FilterOperator",
  "sap/ui/mdc/condition/FilterOperatorUtil"
], function (
  MDCFilterField,
  Element,
  FieldBase,
  FieldBaseRenderer,
  FieldDisplay,
  merge,
  deepEqual,
  MemberFilter,
  ResourceBundle,
  TypeMap,
  Condition,
  ManagedObjectObserver,
  MDCEnumConditionValidated,
  MDCValueHelp,
  DFValueHelp,
  MDCFixedListItem,
  MDCPopover,
  UI5Date,
  coreLibrary,
  FF,
  _,
  DisplayType,
  ConditionType,
  FilterOperator,
  FilterOperatorUtil
) {
  "use strict";

  /**
   * Constructor for a new <code>FilterField</code>.
   *
   * @param {string} [sId] ID for the new control, generated automatically if no ID is given
   * @param {object} [mSettings] Initial settings for the new control
   *
   * @class
   * The <code>FilterField</code> control is used to filter data based on the conditions. The conditions are managed
   * in the corresponding {@link sap.ui.mdc.condition.ConditionModel ConditionModel}.
   * @extends sap.ui.mdc.FilterField
   * @implements sap.ui.core.IFormContent, sap.ui.core.ISemanticFormContent, sap.m.IOverflowToolbarContent
   *
   * @author SAP SE
   * @version 1.132.0
   *
   * @constructor
   * @alias sap.sac.df.FilterField
   * @version 1.132.0
   * @since 1.121
   *
   * @public
   * @experimental As of version 1.121
   */
  const ValueState = coreLibrary.ValueState;
  const DateFormat = coreLibrary.format.DateFormat;
  //const UI5Date = coreLibrary.date.UniversalDate;

  const FilterField = MDCFilterField.extend("sap.sac.df.FilterField", /** @lends sap.sac.df.FilterField.prototype */ {
    metadata: {
      library: "sap.sac.df",
      designtime: "sap/ui/mdc/designtime/field/FilterField.designtime",
      properties: {
        /** Defines the relative path of the property in the metamodel, based on the current contextPath. **/
        metaPath: {
          type: "string"
        }
      }
    },
    renderer: FieldBaseRenderer,

    init: function () {
      FieldBase.prototype.init.apply(this, arguments);

      this._oObserver.observe(this, {
        properties: ["operators", "propertyKey", "additionalDataType"],
        aggregations: ["_content", "filterItems", "dependents"]
      });
      /* this.attachChange(null, this._onChange, this);
       this.attachEvent("_onTokenUpdate", null, this._onTokenUpdate.bind(this));*/
      this.attachEvent("_onValueHelpRequest", null, this._onValueHelpRequest.bind(this));
      this.attachEvent("press", null, this._onValueHelpRequest.bind(this));
      this.setDelegate({name: "sap/sac/df/filter/delegate/FieldBaseDelegate"});
    },

    setMetaPath: function (sPath) {
      sPath = sPath.replace("&gt;", ">");
      this.setProperty("metaPath", sPath);
      FieldBase.prototype.setProperty.call(this, "metaPath", sPath);
      this._initialise();
    },

    _initialise: function () {
      if (!this._initialized) {
        if (this._getMetaObject()) {
          this._setupFilterFieldFromMetaPath();
        } else {
          if (this._isVariableGroup()) {
            this._getMultiDimModel() && this._getMultiDimModel().attachEventOnce("variableGroupsAdded", null, this._setupFilterFieldFromMetaPath.bind(this));
          } else {
            this._getMultiDimModel() && this._getMultiDimModel().attachEventOnce("dataProviderAdded", null, this._setupFilterFieldFromMetaPath.bind(this));
          }
        }
      }
    },

    onAfterRendering: function () {
      this._initialise();
    },

    _setupFilterFieldFromMetaPath: function () {
      this._setMetaObjectPath(this.getMetaPath().split(">")[1]);
      this._setupFilterField();
    },

    _getMultiDimModel: function () {
      return this.getMetaPath() && this.getMetaPath().split(">") && this.getModel(this.getMetaPath().split(">")[0]);
    },

    _getMetaObjectType: function () {
      return this._getMetaObject() && this._getMetaObject().getMetadata().getName();
    },

    _isVariableGroup: function () {
      return this._getMetaObjectType() === "sap.sac.df.model.VariableGroup";
    },

    _isDate: function () {
      const sValueType = this._getValueType();
      return sValueType.includes("Date") || sValueType.includes("Time");
    },

    _getValueType: function () {
      let oMetaObject = this._getMetaObject();
      if (this._isVariableGroup()) {
        oMetaObject = this._getMetaObject().MergedVariable;
      }
      return oMetaObject && oMetaObject.ValueType ? oMetaObject.ValueType : "String";
    },

    _isVariable: function () {
      return this._getMetaObjectType() === "sap.sac.df.model.Variable";
    },

    _isDimension: function () {
      return this._getMetaObjectType() === "sap.sac.df.model.Dimension";
    },

    _setMetaObjectPath: function (sMetaObjectPath) {
      return this._metaObjectPath = sMetaObjectPath;
    },

    _getMetaObjectPath: function () {
      return this._metaObjectPath;
    },

    _getMetaObject: function () {
      return this.getMetaPath() && this.getMetaPath().split(">") && this._getMultiDimModel() && this._getMultiDimModel().getProperty(this.getMetaPath().split(">")[1]);
    },

    _setupFilterField: function () {
      this.setBlocked(true);
      let oMetaObject = this._getMetaObject();
      if (!oMetaObject || this._initialized) {
        return;
      }
      this._initialized = true;
      let sMetaPath = this.getMetaPath();
      if (this._isVariableGroup()) {
        oMetaObject = this._getMetaObject().MergedVariable;
        sMetaPath = sMetaPath + "/MergedVariable";
      }
      const bIsDate = this._isDate();
      const sValueType = bIsDate && oMetaObject.SupportsMultipleValues ? "String" : this._getValueType();
      const bSupportsMultipleValues = this._getMetaObjectType() === "Dimension" || oMetaObject.SupportsMultipleValues;
      const bIsMandatory = this._getMetaObjectType() === "Dimension" || oMetaObject.Mandatory;
      const oFormatOptions = TypeMap.getFormatOptions(sValueType);
      this.setProperty("dataType", TypeMap.getDataTypeClassName(sValueType));
      this.setProperty("dataTypeFormatOptions", oFormatOptions ? oFormatOptions : null);
      if (!this._isDimension()) {
        this.setAssociation("valueHelp", this._supportsValueHelp() ? null : "DEFAULT");
      }
      this.setProperty("label", oMetaObject.Description);
      this.setProperty("required", !!bIsMandatory);

      this.bindProperty("valueState", {
        parts: [
          {path: sMetaPath + "/Mandatory"},
          {path: sMetaPath + "/MemberFilter"}
        ],
        formatter: this._getValueState.bind(this)
      });
      this.setProperty("maxConditions", this._isDimension() || bSupportsMultipleValues ? -1 : 1);
      this.setProperty("operators", bIsDate && !bSupportsMultipleValues ? ["EQ"] : []);
      this.setProperty("defaultOperator", "EQ");
      //this.setProperty("operators", oMetaObject.SupportedOperators);
      //this.setProperty("defaultOperator", oMetaObject.SupportedOperators && oMetaObject.SupportedOperators.length > 0 && oMetaObject.SupportedOperators[0]);
      this.awaitControlDelegate().then(() => {
        this.bindProperty("display", {
          path: sMetaPath + "/FilterDisplayType",
          formatter: this._getDisplay.bind(this)
        });
        this.bindProperty("conditions", {
          path: sMetaPath + "/MemberFilter",
          formatter: this._setConditions.bind(this)
        });
      });

      this._observeContent();
      this.setBlocked(false);
    },

    _observeContent: function () {
      this._getObserver().observe(this, {
        aggregations: ["_content"]
      });
    },

    _addValueHelpAssociation: function () {
      if (!this.getAssociation("valueHelp")) {
        this.setAssociation("valueHelp",
          new DFValueHelp(this.getId() + "--ValueHelp"));
      }
    },

    _getValueState: function (bMandatory, aMemberFilter) {
      return this._getLiveMode() && bMandatory && aMemberFilter && aMemberFilter.length === 0 ? ValueState.Error : ValueState.None;
    },

    _supportsValueHelp: function () {
      let oMetaObject = this._getMetaObject();
      if (this._isVariableGroup()) {
        oMetaObject = this._getMetaObject().MergedVariable;
      }
      return this._getMetaObjectType() === "Dimension" ? true : oMetaObject.SupportsValueHelp;
    },

    _getConditionForMemberFilter: function (oMemberFilter) {
      const aKey = this._isDate() ? oMemberFilter.InternalKey : oMemberFilter.Key;
      let oConditionType = new ConditionType(this.getFormatOptions());
      let sValue1 = "";
      let sValue2 = "";

      const sMDCFilterOperator = this._getMDCFilterOperatorFromModelOperator(oMemberFilter.Operator);

      switch (oMemberFilter.Operator) {
        case FilterOperator.EQ:
          return Condition.createItemCondition(aKey[0], oMemberFilter.Text[0], null, null, oMemberFilter);
        case FilterOperator.BT:
        case FilterOperator.NB:
          sValue1 = oConditionType.formatValue(Condition.createItemCondition(aKey[0], oMemberFilter.Text[0]), "string");
          sValue2 = oConditionType.formatValue(Condition.createItemCondition(aKey[1], oMemberFilter.Text[1]), "string");
          return Condition.createCondition(sMDCFilterOperator, [sValue1, sValue2], null, null, MDCEnumConditionValidated.Validated, oMemberFilter);
        default:
          sValue1 = oConditionType.formatValue(Condition.createItemCondition(aKey[0], oMemberFilter.Text[0]), "string");
          return Condition.createCondition(sMDCFilterOperator, [sValue1], null, null, MDCEnumConditionValidated.Validated, oMemberFilter);
      }
    },

    _getMDCFilterOperatorFromModelOperator: function (sOperator) {
      const oMDCOperator = _.find(FilterOperatorUtil._mOperators, (oOperator) => {
        return oOperator.filterOperator === sOperator;
      });
      return oMDCOperator && oMDCOperator.name;
    },

    _getDisplay: function (sFilterDisplayType) {
      let sDisplay = this.getDisplay();
      let oMetaObject = this._getMetaObject();
      if (this._isVariableGroup()) {
        oMetaObject = this._getMetaObject().MergedVariable;
      }

      if (!this._isDimension() && !this._supportsValueHelp() || this._isDate()) {
        sDisplay = FieldDisplay.Value;
      } else {
        if (sFilterDisplayType) {
          switch (oMetaObject.FilterDisplayType) {
            case DisplayType.Text:
              sDisplay = FieldDisplay.Description;
              break;
            case DisplayType.Key:
              sDisplay = FieldDisplay.Value;
              break;
            case DisplayType.KeyText:
              sDisplay = FieldDisplay.ValueDescription;
              break;
            case DisplayType.TextKey:
              sDisplay = FieldDisplay.DescriptionValue;
              break;
          }
        }
      }
      this._observeContent();
      return sDisplay;
    },

    _setConditionsForFilterField: function (aMemberFilter) {
      const aFilter = [];
      aMemberFilter.forEach(function (oMemberFilter) {
        aFilter.push(this._getConditionForMemberFilter(oMemberFilter));
      }.bind(this));
      this.setConditions(aFilter);
      return aFilter;
    },

    _setConditionsForFilterBar: function (aMemberFilter) {
      const aFilter = [];
      aMemberFilter.forEach(function (oMemberFilter) {
        aFilter.push(this._getConditionForMemberFilter(oMemberFilter));
      }.bind(this));
      this._getFilterBar()._getConditionModel().setProperty("/conditions/" + this.getPropertyKey(), aFilter);
      return aFilter;
    },

    _setConditions: function (aMemberFilter) {
      if (aMemberFilter && aMemberFilter.length > 0) {
        const oFilterBar = this._getFilterBar();
        if (oFilterBar) {
          return oFilterBar._adaptFiltersDialogIsOpen ? this._setConditionsForFilterField(aMemberFilter) : this._setConditionsForFilterBar(aMemberFilter);
        } else {
          return this._setConditionsForFilterField(aMemberFilter);
        }
      }
    },

    getFilterFieldId: function (sPropertyName) {
      return this.getId() + "::FilterField::" + sPropertyName.replace(/[^0-9A-Z_.:-]/gi, "");
    },

    observeChanges: function (oChanges) {
      MDCFilterField.prototype.observeChanges.apply(this, arguments);
      if (oChanges.name === "_content") {
        this._onFieldChange(oChanges.object, true);
      }
      if (oChanges.name === "filterItems") {
        this._onFieldChange(oChanges.child, false);
      }
    },

    _onFieldChange: function (oFilterField, bIsFromFilterbar) {
      const oFieldMultiInput = oFilterField.getAggregation("_content") && oFilterField.getAggregation("_content")[0];
      if (oFieldMultiInput) {
        const mEventRegistry = oFieldMultiInput.mEventRegistry;
        let oEvent;
        while (mEventRegistry.change && mEventRegistry.change.length) {
          oEvent = mEventRegistry.change[0];
          oFieldMultiInput.detachChange(oEvent.fFunction, oEvent.oListener);
        }
        while (mEventRegistry.tokenUpdate && mEventRegistry.tokenUpdate.length) {
          oEvent = mEventRegistry.tokenUpdate[0];
          oFieldMultiInput.detachTokenUpdate(oEvent.fFunction, oEvent.oListener);
        }
        while (mEventRegistry.valueHelpRequest && mEventRegistry.valueHelpRequest.length) {
          oEvent = mEventRegistry.valueHelpRequest[0];
          oFieldMultiInput.detachValueHelpRequest(oEvent.fFunction, oEvent.oListener);
        }
        if (oFieldMultiInput.attachValueHelpRequest) {
          oFieldMultiInput.attachValueHelpRequest(null, this._onValueHelpRequest, this);
        }
        if (oFieldMultiInput.attachChange) {
          oFieldMultiInput.attachChange(null, this._onChange, this);
        }
        if (oFieldMultiInput.attachTokenUpdate) {
          oFieldMultiInput.attachTokenUpdate(null, this._onTokenUpdate, this);
        }

        if (bIsFromFilterbar) {
          this._getObserver().unobserve(oFilterField, {
            aggregations: ["_content"]
          });
        }
      }
    },

    _getObserver: function () {
      if (!this._oObserver) {
        this._oObserver = new ManagedObjectObserver(this.observeChanges.bind(this));
      }
      return this._oObserver;
    },

    _onTokenUpdate: function (oEvent) {
      const that = this;
      const oMetaObject = this._getMetaObject();
      if (oEvent.getParameter("type") === "removed") {
        const oToken = oEvent.getParameter("removedTokens")[0];
        const oCondition = this.getConditions()[oEvent.getSource().indexOfToken(oToken)];
        const oMemberFilter = oCondition.payload;
        if (oMemberFilter && oMemberFilter.InternalKey.length > 0) {
          this._setBusy(true);
          return Promise.resolve(
            oMetaObject.removeMemberFilter(oMemberFilter)
          ).then(function () {
            oEvent.getSource().setValue(null);
            that._setBusy(false);
            that._filterChanged();
          }).catch(function () {
            that._setBusy(false);
          });
        }
      }
    },

    _onChange: function (oEvent) {
      const that = this;
      let sNewValue = oEvent.getParameter("newValue");
      let sFFOperator = null;
      let aNotValidatedCondition = [];
      const oMetaObject = this._getMetaObject();
      let oVariable = this._getMetaObject();
      if (this._isVariableGroup()) {
        oVariable = this._getMetaObject().MergedVariable;
      }
      this._setBusy(true);
      this.setValueState(ValueState.None);
      if (!sNewValue) {
        aNotValidatedCondition = this.getConditions().filter((oCondition) => {
          return oCondition.validated === "NotValidated";
        });
        if (aNotValidatedCondition.length > 0) {
          sNewValue = aNotValidatedCondition[0].values[0];
          sFFOperator = aNotValidatedCondition[0].operator;
        }
      }

      if (sNewValue) {
        return Promise.resolve(
          that._isSearchSupported()
            ? that._validateValue(oVariable, sNewValue)
            : [new MemberFilter([sNewValue])]
        ).then(function (aResult) {
          if (aResult) {
            if (aResult.length > 1) {
              return that._openTypeAheadPopover(aResult);
            }
            if (sFFOperator) {
              aResult[0].Operator = sFFOperator;
            }
            return that.getMaxConditions() === 1
              ? oMetaObject.setMemberFilter(aResult)
              : oMetaObject.addMemberFilter(aResult[0]);
          } else {
            that.setValueState(ValueState.Error);
            that.setValueStateText(ResourceBundle.getText("FILTERBAR_VALUEHELP_VALUE_NOT_EXIST", [sNewValue]));
          }
        }).then(function () {
          that._setBusy(false);
          that.setValueStateText();
          that._filterChanged();
        }).catch(function () {
          that._setBusy(false);
        });
      } else {
        if (oVariable.MemberFilter.length > 0) {
          return Promise.resolve(
            oMetaObject.setMemberFilter(null)
          ).then(function () {
            that._setBusy(false);
            //that.setValueStateText();
            that._filterChanged();
          }).catch(function () {
            that._setBusy(false);
          });
        } else {
          that.setConditions([]);
          //that.setValueStateText();
          that._setBusy(false);
        }
      }
    },

    _onValueHelpRequest: function () {
      const that = this;
      const oMetaObject = this._getMetaObject();
      return oMetaObject.openValueHelpDialog(
      ).then(function (bFilterIsChanged) {
        if (bFilterIsChanged) {
          that._filterChanged();
        }
      });
    },

    _setBusy: function (bStatus) {
      if (this.getParent().isA("sap.ui.mdc.FilterBar")) {
        this.getParent().setBusy(bStatus);
      } else {
        this.setBusy(bStatus);
      }
    },

    _isSearchSupported: function () {
      let oMetaObject = this._getMetaObject();
      if (this._isVariableGroup()) {
        oMetaObject = this._getMetaObject().MergedVariable;
      }
      return this._isDimension() || !this._isDate() && oMetaObject.SupportsValueHelp && oMetaObject.IsFilterable;
    },

    _getLiveMode: function () {
      return this._getFilterBar() ? this._getFilterBar().getLiveMode() : true;
    },

    _getFilterBar: function () {
      const oFilterFieldContainer = this.getParent();
      let oFilterBar;
      if (oFilterFieldContainer) {
        if (oFilterFieldContainer.isA("sap.ui.mdc.FilterBar")) {
          oFilterBar = oFilterFieldContainer;
        } else if (oFilterFieldContainer.isA("sap.ui.mdc.filterbar.p13n.AdaptationFilterBar")) {
          oFilterBar = Element.getElementById(oFilterFieldContainer.getAssociation("adaptationControl"));
        }
      }
      return oFilterBar;
    },

    _filterChanged: function () {
      if (this._getFilterBar()) {
        this._getFilterBar()._filterChanged(this);
      }
    },

    _openTypeAheadPopover: function (aResult) {
      const that = this;
      let oValueHelp = Element.getElementById(that.getId() + "--ValueHelp");
      return Promise.resolve(
        that._addValueHelpAssociation()
      ).then(function () {
        oValueHelp = Element.getElementById(that.getId() + "--ValueHelp");
        oValueHelp.connect(that);
        return oValueHelp.initControlDelegate();
      }).then(function () {
        const oTypeAheadPopover = oValueHelp.getTypeahead();
        const oFixedList = oTypeAheadPopover.getContent()[0];
        _.forEach(aResult, function (oResult) {
          oFixedList.insertItem(new MDCFixedListItem({
            key: oResult.InternalKey[0],
            text: oResult.Text[0]
          }));
        });
        that._setBusy(false);
        return oTypeAheadPopover.open(null, true);
      });
    },

    _formatDate: function (sValue) {
      return DateFormat.getDateTimeWithTimezoneInstance({
        showTimezone: false,
        showTime: false
      }).format(UI5Date.getInstance(sValue));
    },

    _validateValue: function (oVariable, sKey) {
      /*      let bSearchInText = false;
            let bSearchInKey = true;

            switch(this.getDisplay()){
              case FieldDisplay.Value:
                bSearchInKey = true;
                break;
              case FieldDisplay.ValueDescription:
              case FieldDisplay.DescriptionValue:
                bSearchInKey = true;
                bSearchInText = true;
                break;
              case FieldDisplay.Description:
                bSearchInText = true;
                break;
            }*/

      return oVariable.searchMember(sKey, false, true, true, 10).then(function (aResult) {
        if (!aResult || aResult.length === 0) {
          return Promise.resolve();
        }
        return aResult;
      });
    }
  });

  return FilterField;

});
