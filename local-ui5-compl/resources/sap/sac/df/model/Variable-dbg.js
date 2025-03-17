/*!
* SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
*/
/*global sap, Promise */
sap.ui.define(
  "sap/sac/df/model/Variable",
  [
    "sap/ui/base/Object",
    "sap/sac/df/model/MemberFilter",
    "sap/sac/df/thirdparty/lodash",
    "sap/sac/df/firefly/library",
    "sap/sac/df/utils/SyncActionHelper",
    "sap/sac/df/utils/ListHelper",
    "sap/m/MessageBox",
    "sap/sac/df/utils/ResourceBundle",
    "sap/ui/model/FilterOperator",
    "sap/sac/df/types/DisplayType"
  ], /*eslint-disable max-params*/
  function (
    BaseObject,
    MemberFilter,
    _,
    FF,
    SyncActionHelper,
    ListHelper,
    MessageBox,
    ResourceBundle,
    sapUiModelFilterOperator,
    DisplayType
  ) {
    "use strict";
    /*eslint-disable max-statements*/
    /**
         *
         * @class
         * Variable Object
         *
         * <b>Structure of Exposed Data:</b>
         * <pre><code>
         * "Name": "",
         * "Dimension": "",
         * "ValueType": "",
         * "VariableType": "",
         * "Description": "",
         * "Mandatory": "",
         * "SupportsMultipleValues": "",
         * "TechName": "",
         * "InputEnabled": "",
         * "Position": ""
         * "SupportsValueHelp": "",
         * "DataProviderName": "",
         * "MemberFilter": []
         * </code></pre>
         * @author SAP SE
         * @version 1.132.0
         * @public
         * @hideconstructor
         * @experimental since version 1.119
         * @since 1.119
         * @alias sap.sac.df.model.Variable
         */
    const Variable = BaseObject.extend("sap.sac.df.model.Variable", /** @lends sap.sac.df.model.Variable.prototype */ {

      constructor: function (oDataProvider, oVariable) {
        Object.assign(this, Object.getPrototypeOf(this));
        const that = this;
        /** @private */
        this._DataProvider = oDataProvider;
        /** @private */
        this._FFVariable = oVariable;
        /** @private */
        this._createMemberFilter = function () {
          this.MemberFilter = [];
          this.MemberFilter = this._FFVariable.getMemberFilter ? _transformMemberFilterList(this._FFVariable.getMemberFilter()) : getStringMemberFilter(this._FFVariable);
        };

        /** @private */
        this._createFilterDisplayType = function () {
          if (this._DataProvider._VariableDisplayType && this._DataProvider._VariableDisplayType[this.Name]) {
            this.FilterDisplayType = this._DataProvider._VariableDisplayType[this.Name];
          } else {
            this.FilterDisplayType = this._getDisplayType(this.DisplayType);
          }
        };

        this._getSupportedOperators = function () {
          if (this._FFVariable && this._FFVariable.getDimension && this._FFVariable.getDimension()) {
            const oFilterCapabilities = this._FFVariable.getFilterCapability();
            if (oFilterCapabilities) {
              const aFFOperators = ListHelper.arrayFromList(oFilterCapabilities.getSupportedComparisonOperators(FF.SetSign.INCLUDING));
              if (aFFOperators) {
                return _.map(aFFOperators, function (oOperator) {
                  if (oOperator && oOperator.getName()) {
                    return MemberFilter.getUI5OperatorFromFFOperator({
                      Sign: "INCLUDING",
                      Operator: oOperator.getName()
                    });
                  }
                });
              }
            }
          }
          return ["EQ"];
        };

        /** @private */
        this._getDisplayType = function (sDisplayType) {
          switch (sDisplayType) {
            case FF.FilterDisplayInfo.ID:
              return DisplayType.Key;
            case FF.FilterDisplayInfo.DESCRIPTION:
              return DisplayType.Text;
            case FF.FilterDisplayInfo.ID_AND_DESCRIPTION:
              return DisplayType.KeyText;
            case FF.FilterDisplayInfo.DESCRIPTION_AND_ID:
              return DisplayType.TextKey;
          }
        };
        /** @private */
        this._createFFSelection = function (aMemberFilter) {
          let aExistingMemberFilter = _.clone(this._FFVariable.getMemberFilter());
          if (!this.SupportsMultipleValues) {
            aExistingMemberFilter = null;
          }
          return MemberFilter._condenseDimensionMemberFilter(aMemberFilter, aExistingMemberFilter, this._FFVariable.getDimension());
        };

        Object.assign(this, {
          Name: this._FFVariable.getNameExternal() || this._FFVariable.getName(),
          Dimension: this._FFVariable.getDimension && this._FFVariable.getDimension() && (this._FFVariable.getDimension().getExternalName() || this._FFVariable.getDimension().getName()),
          ValueType: this._FFVariable.getValueType().getName(),
          VariableType: this._FFVariable.getVariableType().getName(),
          Description: this._FFVariable.getText(),
          Mandatory: this._FFVariable.isMandatory(),
          SupportsMultipleValues: this._FFVariable.supportsMultipleValues(),
          TechName: this._FFVariable.getName(),
          InputEnabled: this._FFVariable.isInputEnabled(),
          IsFilterable: this._FFVariable.getDimension && this._FFVariable.getDimension() && this._FFVariable.getDimension().getKeyField().isFilterable(),
          Position: this._FFVariable.getVariableOrder(),
          SupportsValueHelp: this._FFVariable.supportsValueHelp && this._FFVariable.supportsValueHelp(),
          DataProviderName: this._DataProvider.Name,
          DisplayType: this._FFVariable.getDimension && this._FFVariable.getDimension() && FF.FilterDisplayInfo.getDimensionDisplayInfo(this._FFVariable.getDimension()),
          FilterDisplayType: null,
          MemberFilter: [],
          SupportedOperators: that._getSupportedOperators().filter(Boolean)
        });
        that._createMemberFilter();
        that._createFilterDisplayType();
      }
    });

    function _transformMemberFilterList(aMemberFilterList) {
      return _.map(
        ListHelper.arrayFromList(aMemberFilterList), (oMemberFilter) => {
          return MemberFilter._createFromFFFilter(oMemberFilter, aMemberFilterList);
        }
      );
    }

    function getStringMemberFilter(oFFVariable) {
      const sValue = oFFVariable.getValueByString();
      if (!oFFVariable.getValue() || !sValue) {
        return [];
      }
      return [new MemberFilter([sValue], [sValue], [sValue])];
    }


    /** @private */
    Variable.prototype._transferMemberFilterFromAnotherVariable = function (oSourceVariable) {
      const oVariable = this._FFVariable;
      if (!compareVariableContent(oVariable, oSourceVariable._FFVariable)) {
        this._DataProvider._getQueryModel().stopEventing();
        oVariable.getVariableType().isTypeOf(FF.VariableType.DIMENSION_MEMBER_VARIABLE)
          ? oVariable.setMemberFilter(_.clone(oSourceVariable._FFVariable.getMemberFilter()))
          : oVariable.setValueByStringExt(_.clone(oSourceVariable.getValueByString()), true);
        this._DataProvider._getQueryModel().resumeEventing();
        this._createMemberFilter();
        this._DataProvider.variableChanged = true;
        this._DataProvider._triggerDataProviderPropertyUpdate(true);
      }
    };

    function compareVariableContent(oVar1, oVar2) {
      if (oVar1.getVariableType().isTypeOf(FF.VariableType.DIMENSION_MEMBER_VARIABLE)) {
        return oVar1.getMemberFilter().serializeToString(FF.QModelFormat.INA_REPOSITORY) == oVar2.getMemberFilter().serializeToString(FF.QModelFormat.INA_REPOSITORY);
      } else
        return oVar1.getValueByString() == oVar2.getValueByString();
    }

    /** @private */
    Variable.prototype._applyMemberFilter = function (aMemberFilter) {
      if (!this._FFVariable && !this._FFVariable.isInputEnabled()) {
        throw new Error("Variable is not input enabled");
      }
      this._DataProvider._getQueryModel().queueEventing();
      return this._DataProvider._reinitIfNeededPromise().then(() => {
        this._FFVariable.getVariableType().isTypeOf(FF.VariableType.DIMENSION_MEMBER_VARIABLE)
          ? FF.FilterDialogValueUtils.updateVariableFilter(this._FFVariable, this._createFFSelection(aMemberFilter))
          : _.forEach(aMemberFilter, (oMemberFilter) => {
            this._FFVariable.setValueByStringExt(oMemberFilter.InternalKey[0], true);
          });
      }).then(() => {
        this._DataProvider._getQueryModel().resumeEventing();
        this._createMemberFilter();
        this._DataProvider.variableChanged = true;
        this._DataProvider._triggerDataProviderPropertyUpdate();
      });
    };


    /** @private */
    Variable.prototype.transformValueHelpNode = function (node, hierarchyName, sSearchString) {
      const dimensionMember = node.getDimensionMember();
      const resultNode = new MemberFilter(
        [hierarchyName ? dimensionMember.getFieldValue(node.getDimension().getHierarchyDisplayKeyField()).getString() : dimensionMember.getFieldValue(node.getDimension().getDisplayKeyField()).getString()],
        [dimensionMember.getFieldValue(node.getDimension().getKeyField()).getString()],
        [dimensionMember.getText()]
      );

      if (hierarchyName) {
        const children = node.getChildren();
        if (children && children.hasElements()) {
          const transformedChildren = ListHelper.arrayFromList(children).map((childrenNode) => {
            return this.transformValueHelpNode(childrenNode, hierarchyName, sSearchString);
          }).filter((item) => {
            return item !== null;
          });
          if (transformedChildren.length !== 0) {
            resultNode.Children = transformedChildren;
          }
        }
      }
      // Check exactness
      if (sSearchString && !resultNode.Children) {
        if (!resultNode.Key.includes(sSearchString) && !resultNode.Text.includes(sSearchString)) {
          return null;
        }
      }
      return resultNode;
    };

    /**
         * Performs the search for a given value
         *
         * @param {string} sSearchString string to search for
         * @param {boolean} bFuzzy if a fuzzy search is performed
         * @param {boolean} bText if to search in text/description (default true)
         * @param {boolean} bKey if to search in key/id (default true)
         * @param {int} iMaxNumberOfResults maximal number of search results (default 1)
         * @param {boolean} bRequestParents if to provide the parents of the search result for hierarchical variables (only relevant if iMaxNumberOfResults is set)
         * @return {Promise<sap.sac.df.MemberFilter[]>} array of found member filters
         * @private
         */
    Variable.prototype.searchMember = function (sSearchString, bFuzzy, bText, bKey, iMaxNumberOfResults, bRequestParents) {
      // Mimic the defaults
      if (bText === undefined) {
        bText = true;
      }
      if (bKey === undefined) {
        bKey = true;
      }
      if (iMaxNumberOfResults === undefined) {
        bRequestParents = false;
        iMaxNumberOfResults = 1;
      }
      const oVariable = this._FFVariable;
      if (!oVariable) {
        return Promise.reject(new Error("Variable " + this.Name + " is not known"));
      }
      const searchFields = FF.XList.create();
      const fields = FF.XList.create();
      const oDim = oVariable.getDimension();
      const textField = oDim.getTextField();
      if (textField) {
        fields.add(textField);
        if (bText) {
          searchFields.add(textField);
        }
      }
      if (oDim.getDisplayKeyField() && bKey) {
        searchFields.add(oDim.getDisplayKeyField());
      }
      return this._DataProvider._reinitIfNeededPromise().then(() => {
        return FF.QFactory.createVariableValueHelpWizard(oVariable).withReadMode(FF.QMemberReadMode.BOOKED).withPaging(0, iMaxNumberOfResults).withMainKeyAndTextFields().searchPromise(sSearchString, bKey, bText, bRequestParents, bFuzzy
        ).then((oValueHelpResult) => {
          const varType = oVariable.getVariableType();
          const sHierarchyName = varType != null && varType.isTypeOf(FF.VariableType.HIERARCHY_NODE_VARIABLE) ? oVariable.getHierarchyName() : null;
          this._createMemberFilter();
          return MemberFilter.createFromFFValueHelpNode(oValueHelpResult, sHierarchyName, !bFuzzy ? sSearchString : null);
        }).onCatch((oMessages) => {
          this._DataProvider._addMessagesToModel(oMessages);
        });
      });
    };

    /**
         * Get effective variable filters
         * @return {sap.sac.df.model.MemberFilter[]} array of member filters
         * @public
         */
    Variable.prototype.getMemberFilter = function () {
      return this.MemberFilter;
    };

    /**
         * Set variable filters
         * @param {sap.sac.df.model.MemberFilter[]} aMemberFilter array of member filters
         * @return {this} Reference to this in order to allow method chaining
         * @public
         */
    Variable.prototype.setMemberFilter = function (aMemberFilter) {
      return this._applyMemberFilter(aMemberFilter);
    };

    /**
         * Add a member filter by its (internal) key
         * @param {string} sKey (internal) key of a dimension member
         * @return {this} Reference to this in order to allow method chaining
         * @public
         */
    Variable.prototype.addMemberFilterByKey = function (sKey) {
      return this.addMemberFilter(new MemberFilter([sKey]));
    };

    /**
         * Set a member filter by its (internal) key
         * @param {string} sKey (internal) key of a dimension member
         * @return {this} Reference to this in order to allow method chaining
         * @public
         */
    Variable.prototype.setMemberFilterByKey = function (sKey) {
      return this.setMemberFilter([new MemberFilter([sKey])]);
    };

    /**
         * Remove a member filter by its (internal) key
         * @param {string} sKey (internal) key of a dimension member
         * @return {this} Reference to this in order to allow method chaining
         * @public
         */
    Variable.prototype.removeMemberFilterByKey = function (sKey) {
      let oMemberFilter = _.filter(_.clone(this.getMemberFilter()), (oExistingMemberFilter) => {
        return oExistingMemberFilter.InternalKey.includes(sKey);
      });
      oMemberFilter = oMemberFilter && oMemberFilter[0];
      return this.removeMemberFilter(oMemberFilter);
    };

    /**
         * Add variable filters
         * @param {sap.sac.df.model.MemberFilter} oMemberFilter a member filter object
         * @return {this} Reference to this in order to allow method chaining
         * @public
         */
    Variable.prototype.addMemberFilter = function (oMemberFilter) {
      let aNewMemberFilter = _.clone(this.getMemberFilter()) || [];
      aNewMemberFilter.push(oMemberFilter);
      return this.setMemberFilter(aNewMemberFilter);
    };

    /**
         * Remove variable filter
         * @param {sap.sac.df.model.MemberFilter} oMemberFilter a member filter object
         * @return {this} Reference to this in order to allow method chaining
         * @public
         */
    Variable.prototype.removeMemberFilter = function (oMemberFilter) {
      const aNewMemberFilter = _.filter(_.clone(this.getMemberFilter()), (oExistingMemberFilter) => {
        return oMemberFilter.UniqueID !== oExistingMemberFilter.UniqueID;
      });
      return this._applyMemberFilter(aNewMemberFilter);

    };

    /**
         * Clear variable filter
         * @return {this} Reference to this in order to allow method chaining
         * @public
         */
    Variable.prototype.clearMemberFilter = function () {
      return this._applyMemberFilter([]);
    };

    /**
         * Open a dialog to display and change the filter on a variable
         * @return {Promise} resolving to a boolean which is false when the dialog is cancelled and true if is was closed with Ok and dynamic filters of the given dimension are updated
         * @public
         */
    Variable.prototype.openValueHelpDialog = function () {
      let oDisplayType;
      if (!this.SupportsValueHelp) {
        throw new Error("No Value help for variable " + this.Name);
      }
      this._DataProvider._getQueryModel().queueEventing();
      return this._DataProvider._reinitIfNeededPromise()
        .then(() => this._DataProvider._transferVariablesIfNeededPromise())
        .then(() => new Promise(resolve => {
          const runner = FF.FilterDialogProgramRunnerFactory.createForVariableFilter(this._DataProvider._Model.getApplication().getProcess(), this._DataProvider._getQueryManager(), this._FFVariable, ResourceBundle.getText("SELECTOR", [this.Description]));
          //runner.setStringArgument(FF.FilterDialog.PARAM_SELECTION_MODE, this.supportsMultipleValues ? FF.UiSelectionMode.MULTI_SELECT.getName() : FF.UiSelectionMode.SINGLE_SELECT_LEFT.getName());
          runner.getProgramStartData().putXObject(FF.FilterDialog.PRG_DATA_DEFAULT_SELECTION, FF.FilterDialogValueFactory.createSelectionFromVariable(this._FFVariable));
          runner.getProgramStartData().putXObject(FF.FilterDialog.PRG_DATA_LISTENER_CLOSE, {
            onFilterDialogOk: function (oSel) {
              resolve(oSel);
            },
            onFilterDialogCancel: function () {
              resolve(null);
            }
          });
          runner.getProgramStartData().putXObject(FF.FilterDialog.PRG_DATA_LISTENER_BEFORE_FILTER_CHANGE, {
            onBeforeChange: function (oChange) {
              oDisplayType = oChange.getDisplayInfo();
            }
          });
          runner.runProgram();
        }))
        .then((aSelection) => {
          this._DataProvider._getQueryModel().resumeEventing();
          let oFFFilter = this._FFVariable.getMemberFilter();
          if (oDisplayType) {
            this.FilterDisplayType = this._getDisplayType(oDisplayType);
            this._DataProvider._VariableDisplayType[this.Name] = this.FilterDisplayType;
            if (oFFFilter) {
              oFFFilter.getUiSettings(FF.QContextType.SELECTOR).setDisplayInfo(oDisplayType);
            }
          }
          if (aSelection) {
            this._createMemberFilter();
            this._DataProvider.variableChanged = true;
            this._DataProvider._triggerDataProviderPropertyUpdate();
          }
          return !!aSelection;
        });
    };

    return Variable;
  }
);
