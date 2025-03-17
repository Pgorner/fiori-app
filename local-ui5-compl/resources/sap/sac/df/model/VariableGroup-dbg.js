/*!
* SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
*/
/*global sap */
sap.ui.define(
  "sap/sac/df/model/VariableGroup",
  [
    "sap/ui/base/Object",
    "sap/sac/df/model/DataProvider",
    "sap/sac/df/model/MemberFilter",
    "sap/sac/df/thirdparty/lodash"
  ], /*eslint-disable max-params*/
  function (
    BaseObject,
    DataProvider,
    MemberFilter,
    _
  ) {
    "use strict";
    /*eslint-disable max-statements*/
    /**
     * @class
     * Variable Group Object
     *
     * <b>Structure of Exposed Data:</b>
     *  <pre><code>
     * "Name": "",
     * "MergedVariable": { },
     * "Rule": function () {}
     * </code></pre>
     * @author SAP SE
     * @version 1.132.0
     * @public
     * @experimental since version 1.119
     * @since 1.119
     * @hideconstructor
     * @alias sap.sac.df.model.VariableGroup
     */
    const VariableGroup = BaseObject.extend("sap.sac.df.model.VariableGroup", /** @lends sap.sac.df.model.VariableGroup.prototype */ {
      constructor: function (oMultiDimModel, sVariableGroupName, fRule, oProperties) {
        Object.assign(this, Object.getPrototypeOf(this));
        Object.assign(this, {
          Name: sVariableGroupName,
          Rule: fRule,
          MergedVariable: null
        },
        oProperties);
        /** @private */
        this._Model = oMultiDimModel;
        /** @private */
        this._getVariableGroupMapping =  () => {
          return this._Model.VariableGroupMapping;
        };
        this.updateVariableGroup();
      },

      /** @private */
      updateVariableGroup: function () {
        var that = this;
        that._getVariableGroupMapping()[this.Name] = [];
        _.forEach(that._Model.getDataProviders(),  (oDataProvider) => {
          that.updateVariablesForDataProvider(oDataProvider);
        });
      },

      /** @private */
      updateVariablesForDataProvider: function (oDataProvider) {
        if (oDataProvider) {
          _.forEach(oDataProvider.getVariables(), (oVariable) => {
            this._updateVariableInGroup(this, oVariable, oDataProvider.Name);
          });
          oDataProvider.variableChanged = true;
          oDataProvider._triggerDataProviderPropertyUpdate();
          this.MergedVariable._createFilterDisplayType();
          this.MergedVariable._createMemberFilter();
          oDataProvider.attachEventOnce("dataUpdated", null, () => {
            this.MergedVariable._createMemberFilter();
          });
          oDataProvider.attachEventOnce("dataProviderUpdated", null, () => {
            this.MergedVariable._createMemberFilter();
          });
        }
      },

      /** @private */
      _updateVariableInGroup: function (group, oVariable, sDataProviderName) {
        if (group.Rule(oVariable, sDataProviderName)) {
          if (group.MergedVariable && group.MergedVariable.DataProviderName !== sDataProviderName) {
            // TODO check more properties like input enablement
            if (group.MergedVariable.VariableType !== oVariable.VariableType) {
              throw new Error("Could not add variable '" + oVariable.Name + "' for DataProvider='" + sDataProviderName + "'." + //
                " The type=" + oVariable.VariableType + " doesn't match type=" + group.MergedVariable.VariableType + " of previously added variables ");
            }
          } else {
            group.MergedVariable = oVariable;
          }
          this._getVariableGroupMapping()[group.Name].push(oVariable);
        }
      }
    });

    /**
     * Set variable group filters
     * @param {sap.sac.df.model.MemberFilter[]} aMemberFilter array of member filters
     * @returns Promise<void> which resolve when the value is set
     * @public
     */
    VariableGroup.prototype.setMemberFilter = function (aMemberFilter) {
      return this.MergedVariable.setMemberFilter(aMemberFilter).then(() => {
        this.updateVariableGroup();
      });
    };

    /**
     * Performs the search in values of a given Variable
     *
     * @param {string} sSearchString string to search for
     * @param {boolean} bFuzzy if a fuzzy search is performed
     * @param {boolean} bText if to search in text/description (default true)
     * @param {boolean} bKey if to search in key/id (default true)
     * @param {int} iMaxNumberOfResults maximal number of search results (default 1)
     * @param {boolean} bRequestParents if to provide the parents of the search result for hierarchical variables (only relevant if iMaxNumberOfResults is set)
     * @return {Promise<sap.sac.df.model.MemberFilter[]>} array with found values
     * @private
     */
    VariableGroup.prototype.searchMember = function (sSearchString, bFuzzy, bText, bKey, iMaxNumberOfResults, bRequestParents) {
      return this.MergedVariable.searchMember(sSearchString, bFuzzy, bText, bKey, iMaxNumberOfResults, bRequestParents);
    };

    /**
     * Add a member filter by its (internal) key
     * @param {string} sKey (internal) key of a dimension member
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    VariableGroup.prototype.addMemberFilterByKey = function (sKey) {
      return this.MergedVariable.addMemberFilterByKey(sKey).then(() => {
        this.updateVariableGroup();
      });
    };

    /**
     * Set a member filter by its (internal) key
     * @param {string} sKey (internal) ey of a dimension member
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    VariableGroup.prototype.setMemberFilterByKey = function (sKey) {
      return this.MergedVariable.setMemberFilterByKey(sKey).then(() => {
        this.updateVariableGroup();
      });
    };

    /**
     * Remove a member filter by its (internal) key
     * @param {string} sKey (internal) key of a dimension member
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    VariableGroup.prototype.removeMemberFilterByKey = function (sKey) {
      return this.MergedVariable.removeMemberFilterByKey(sKey).then( () =>{
        this.updateVariableGroup();
      });
    };

    /**
     * Add variable group filters
     * @param {sap.sac.df.model.MemberFilter} oMemberFilter a member filter object
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    VariableGroup.prototype.addMemberFilter = function (oMemberFilter) {
      return this.MergedVariable.addMemberFilter(oMemberFilter).then( () =>{
        this.updateVariableGroup();
      });
    };

    /**
     * Remove variable group filter
     * @param {sap.sac.df.model.MemberFilter} oMemberFilter a member filter object
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    VariableGroup.prototype.removeMemberFilter = function (oMemberFilter) {
      return this.MergedVariable.removeMemberFilter(oMemberFilter).then( () => {
        this.updateVariableGroup();
      });
    };

    /**
     * Clear variable group filter
     * @return {this} Reference to this in order to allow method chaining
     * @public
     */
    VariableGroup.prototype.clearMemberFilter = function () {
      return this.MergedVariable.clearMemberFilter().then( ()=> {
        this.updateVariableGroup();
      });
    };


    /**
     * Get effective variable group filters
     * @return {sap.sac.df.model.MemberFilter[]} array of member filters
     * @public
     */
    VariableGroup.prototype.getMemberFilter = function () {
      return this.MergedVariable.getMemberFilter();
    };

    /**
     * Opens the value help dialog so the user choose a value for a variable group
     * After the value is selected only teh VariableGroup.MergedVariable is updated. The variables of the aggregated DataProviders are updated with the next ResultSet fetch
     * @return {Promise<boolean>} to indicate if the VariableGroup has been updated
     * @public
     */
    VariableGroup.prototype.openValueHelpDialog = function () {
      // Ensure the MergedVariable is in sync with the leading DataProvider
      this.updateVariablesForDataProvider(this.MergedVariable._DataProvider, true);
      return this.MergedVariable.openValueHelpDialog().then( (aSelection) => {
        if (aSelection) {
          this.updateVariableGroup();
        }
        return !!aSelection;
      });
    };

    /**
     * Map of properties, that are provided by the object.
     */
    VariableGroup.M_PROPERTIES = {
      Name: "Name",
      MergedVariable: "MergedVariable"
    };

    /**
     * Name
     * @name sap.sac.df.model.VariableGroup#Name
     * @property Name
     * @type {string}
     * @public
     */

    /**
     * Merged Variable
     * @name sap.sac.df.model.VariableGroup#MergedVariable
     * @property Variable
     * @type {sap.sac.df.model.Variable}
     * @public
     * */

    return VariableGroup;
  }
);
