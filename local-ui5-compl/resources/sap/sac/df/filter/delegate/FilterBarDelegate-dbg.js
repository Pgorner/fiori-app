/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap,Promise*/
sap.ui.define("sap/sac/df/filter/delegate/FilterBarDelegate", [
  "sap/ui/core/Element",
  "sap/ui/mdc/FilterBarDelegate",
  "sap/sac/df/filter/TypeMap",
  "sap/ui/model/Filter",
  "sap/sac/df/model/MemberFilter",
  "sap/sac/df/thirdparty/lodash"
], function (Element, FilterBarDelegate, DragonFlyTypeMap, Filter, MemberFilter, _) {
  "use strict";
  var DragonFlyFilterBarDelegate = Object.assign({}, FilterBarDelegate);
  DragonFlyFilterBarDelegate.apiVersion = 2;

  DragonFlyFilterBarDelegate.fetchProperties = function (oFilterBar) {
    return Promise.resolve().then(() => {
      var aProperties = [];
      _.forEach(oFilterBar._getMetaObject(), function (oVariableDefinition) {
        var oVariable = oVariableDefinition.MergedVariable ? oVariableDefinition.MergedVariable : oVariableDefinition;
        const oFilterField = oFilterBar._getFilterField(oVariable.Name);
        let oFormatOptions = DragonFlyTypeMap.getFormatOptions(oVariable.ValueType);
        let sValueType = "String";
        let bIsDate = oVariable.ValueType.includes("Date");
        let bHasValueHelp = oVariable.SupportsValueHelp;
        if (oFilterField) {
          bIsDate = oFilterField && oFilterField._isDate();
          sValueType = bIsDate && oVariable.SupportsMultipleValues ? "String" : oFilterField && oFilterField._getValueType();
          bHasValueHelp = oFilterField._supportsValueHelp();
        }
        var oProperty = {
          name: oVariable.Name,
          key: oVariable.Name,
          label: oVariable.Description,
          propertyKey: oVariable.Name,
          typeConfig: DragonFlyFilterBarDelegate.getTypeMap().getTypeConfig(sValueType, oFormatOptions ? oFormatOptions : null, null),
          dataType: DragonFlyFilterBarDelegate.getTypeMap().getDataTypeClassName(sValueType),
          maxConditions: bHasValueHelp ? -1 : 1,
          group: oVariableDefinition.Group ? oVariableDefinition.Group : "_basicSearch",
          groupLabel: oFilterBar.getModel("i18n").getResourceBundle().getText(oVariableDefinition.Group ? oVariableDefinition.Group : ""),
          required: oVariable.Mandatory,
          hasValueHelp: bHasValueHelp,
          caseSensitive: false
        };
        aProperties.push(oProperty);
      });
      return aProperties;
    });
  };

  DragonFlyFilterBarDelegate.addItem = function (oFilterBar, sVariableName) {
    return Promise.resolve().then(function () {
      var oFilterField = Element.getElementById(oFilterBar.getFilterFieldId(sVariableName));
      if (!oFilterField) {
        oFilterField = oFilterBar.createFilterField(sVariableName);
        oFilterField.setParent(oFilterBar);
        oFilterField.setModel(oFilterBar._getMultiDimModel(), oFilterBar._getMultiDimModelName());
        oFilterField._setupFilterFieldFromMetaPath();
      }
      return oFilterField;
    });
  };

  DragonFlyFilterBarDelegate.getTypeMap = function () {
    return DragonFlyTypeMap;
  };

  return DragonFlyFilterBarDelegate;
});
