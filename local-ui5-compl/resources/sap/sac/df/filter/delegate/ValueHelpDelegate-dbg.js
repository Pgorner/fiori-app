/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap,Promise*/
sap.ui.define([
  "sap/ui/mdc/ValueHelpDelegate"
], function (
  ValueHelpDelegate
) {
  "use strict";

  /**
     * Delegate for {@link sap.ui.mdc.ValueHelp ValueHelp}.<br>
     * <b>Note:</b> The class is experimental and the API/behavior is not finalized and hence this should not be used for productive usage.
     *
     * @namespace
     * @author SAP SE
     * @private
     * @since 1.95.0
     * @extends module:sap/ui/mdc/BaseDelegate
     * @alias module:sap/sac/df/filter/delegate/ValueHelpDelegate
     */
  const DragonflyValueHelpDelegate = Object.assign({}, ValueHelpDelegate);

  /**
     * Requests the content of the value help.
     *
     * This function is called when the value help is opened or a key or description is requested.
     *
     * So depending on the value help content used, all content controls and data need to be assigned.
     * Once they are assigned and the data is set, the returned <code>Promise</code> needs to be resolved.
     * Only then does the value help continue opening or reading data.
     *
     * @param {sap.ui.mdc.ValueHelp} oValueHelp The <code>ValueHelp</code> control instance
     * @param {sap.ui.mdc.valuehelp.base.Container} oContainer Container instance
     * @param {string} sContentId ID of the content shown after this call to retrieve content
     *
     * @returns {Promise} <code>Promise</code> that is resolved if all content is available
     * @public
     */
  // eslint-disable-next-line no-unused-vars
  DragonflyValueHelpDelegate.retrieveContent = function (oValueHelp, oContainer, sContentId) {
    //if(oValueHelp.getFilterValue()) {
    return Promise.resolve();
    /*    var oContent = sContentId ? sap.ui.getCore().byId(sContentId) : oContainer.getContent()[0];
    var sValue = oValueHelp.getControl() && oValueHelp.getControl()._vLiveChangeValue || oValueHelp.getFilterValue();
    //var sValue = oValueHelp.getFilterValue();
    /!*    var oTable =new sap.m.Table({});
              var oColumnListItem = new sap.m.ColumnListItem({});
              oColumnListItem.addCell(new sap.m.Text({text:"ABC"}));
              oColumnListItem.addCell(new sap.m.Text({text:"XYZ"}));
              //oTable.addColumn(new sap.m.Column({}));
              oTable.addItem(oColumnListItem);
              oContent.setTable(oTable);
              return oContent;*!/
    if (sValue) {
      var oFilterField = oValueHelp.getControl();
      var sVariableName = oFilterField.getPropertyKey();
      //var oVariable = oFilterField.getParent().__getVariable(sVariableName);
      var oVariable = oFilterField._getMetaObject();
      //var oContent = sContentId ? sap.ui.getCore().byId(sContentId) : oContainer.getContent()[0];
      oContent.destroyItems();
      return Promise.resolve(
        this._searchValue(oVariable, sValue)
      ).then(function (aResult) {
        /!*        var oTable = new sap.m.Table({
          mode: sap.m.ListMode.SingleSelectMaster
          /!*          columns: [
            new sap.m.Column({header: new Text({text : "ID"})}),
            new sap.m.Column({header: new Text({text : "Name"})})
          ]*!/
        });*!/

        _.forEach(aResult, function (oResult) {
          /!*          var oColumnListItem = new sap.m.ColumnListItem({});
          oColumnListItem.addCell(new sap.m.Text({text: oResult.InternalKey[0]}));
          //oTable.addColumn(new sap.m.Column({}));
          oTable.addItem(oColumnListItem);*!/
          oContent.insertItem(new sap.ui.mdc.valuehelp.content.FixedListItem({
            key: oResult.Key[0],
            text: oResult.Text[0]
          }));
        });
        //oContent.setTable(oTable);

        return oContent;
      });
    }*/
  };


  DragonflyValueHelpDelegate._searchValue = function (oVariable, sKey) {
    return oVariable.searchMember(sKey, true, true, true, 10)
      .then(function (aResult) {
        if (!aResult.length) {
          return Promise.resolve();
        }
        return aResult;
      });
  };

  /**
     * Checks if a <code>ListBinding</code> supports <code>$search</code>.
     *
     * @param {sap.ui.mdc.ValueHelp} oValueHelp The <code>ValueHelp</code> control instance
     * @param {sap.ui.mdc.valuehelp.base.Content} oContent Content element
     * @param {sap.ui.model.ListBinding} oListBinding <code>ListBinding</code>
     * @returns {boolean} <code>true</code> if <code>$search</code> is supported
     * @public
     */
  // eslint-disable-next-line no-unused-vars
  DragonflyValueHelpDelegate.isSearchSupported = function (oValueHelp, oContent, oListBinding) {
    return true;
  };

  /**
     * Controls if a type-ahead is opened or closed.
     *
     *
     * @param {sap.ui.mdc.ValueHelp} oValueHelp The <code>ValueHelp</code> control instance
     * @param {sap.ui.mdc.valuehelp.base.Content} oContent <code>ValueHelp</code> Content requesting conditions configuration
     * @returns {Promise|boolean} Boolean or <code>Promise</code> resolving into a boolean indicating the desired behavior
     * @since 1.110.0
     * @public
     */
  DragonflyValueHelpDelegate.showTypeahead = function (oValueHelp, oContent) {
    if (!oContent || (oContent.isA("sap.ui.mdc.valuehelp.base.FilterableListContent") && !oContent.getFilterValue())) { // Do not show non-existing content or suggestions without filterValue
      return false;
    } else if (oContent.isA("sap.ui.mdc.valuehelp.base.ListContent")) { // All List-like contents should have some data to show
      const oListBinding = oContent.getListBinding();
      const iLength = oListBinding && oListBinding.getAllCurrentContexts().length;
      return iLength > 0;
      //return !!oContent.getFilterValue();
    }
    return true; // All other content should be shown by default
  };

  /**
     * @param {sap.ui.mdc.ValueHelp} oValueHelp The <code>ValueHelp</code> control instance
     * @param {sap.ui.mdc.valuehelp.base.ListContent} oContent <code>ValueHelp</code> content instance
     * @param {sap.ui.mdc.valuehelp.base.ItemForValueConfiguration} oConfig Configuration
     * @returns {sap.ui.model.Context} Promise resolving in the <code>Context</code> that's relevant'
     */
  DragonflyValueHelpDelegate.getFirstMatch = function (oValueHelp, oContent, oConfig) {
    return oContent.getRelevantContexts(oConfig)[0];
  };

  return DragonflyValueHelpDelegate;
});
