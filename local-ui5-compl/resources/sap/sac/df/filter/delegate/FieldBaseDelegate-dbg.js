/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap,Promise*/
sap.ui.define("sap/sac/df/filter/delegate/FieldBaseDelegate", [
  "sap/ui/core/Element",
  "sap/ui/mdc/field/FieldBaseDelegate",
  "sap/sac/df/filter/TypeMap"
], function (Element, FieldBaseDelegate, DragonFlyTypeMap) {
  "use strict";
  const DragonFlyFieldBaseDelegate = Object.assign({}, FieldBaseDelegate);
  DragonFlyFieldBaseDelegate.apiVersion = 2;

  // eslint-disable-next-line no-unused-vars
  DragonFlyFieldBaseDelegate.getDescription = function (oField, oFieldHelp, vKey, oInParameters, oOutParameters, oBindingContext, oConditionModel, sConditionModelName, oConditionPayload, oControl) {
    const oMemberFilter = oConditionPayload;
    return oMemberFilter && oMemberFilter.Text[0] !== oMemberFilter.InternalKey[0] ? oMemberFilter.Text[0] : "";
  };

  DragonFlyFieldBaseDelegate.getItemForValue = function (oField, oValueHelp, oConfig) {
    if (!oConfig.value) {
      return Promise.resolve();
    }
    const oValue = {
      key: oConfig.value
    };
    let oMetaObject = oField._getMetaObject();
    if (oMetaObject.isA("sap.sac.df.model.VariableGroup")) {
      oMetaObject = oMetaObject.MergedVariable;
    }
    if (oMetaObject && oMetaObject.MemberFilter && oConfig.value) {
      const oMemberFilter = oMetaObject.MemberFilter.find(function (oItem) {
        return oField._isDate() ? oConfig.value === oItem.InternalKey[0] : oConfig.value === oItem.InternalKey[0];
      });
      if (oMemberFilter) {
        oValue.description = (oMemberFilter && oMemberFilter.Text[0]) ? oMemberFilter.Text[0] : oConfig.value;
      }
    }
    return Promise.resolve(oValue);
  };

  DragonFlyFieldBaseDelegate.isInvalidInputAllowed = function () {
    return false;
  };


  DragonFlyFieldBaseDelegate.isInputValidationEnabled = function (oField) {
    return oField._supportsValueHelp() && oField._getValueType() === "String";
  };

  DragonFlyFieldBaseDelegate.getDataTypeClass = function (oField, sType) {
    return DragonFlyTypeMap.getDataTypeClassName(sType);
  };

  DragonFlyFieldBaseDelegate.getTypeMap = function () {
    return DragonFlyTypeMap;
  };

  return DragonFlyFieldBaseDelegate;
});
