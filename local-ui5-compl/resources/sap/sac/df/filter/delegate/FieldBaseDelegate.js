/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define("sap/sac/df/filter/delegate/FieldBaseDelegate",["sap/ui/core/Element","sap/ui/mdc/field/FieldBaseDelegate","sap/sac/df/filter/TypeMap"],function(e,t,a){"use strict";const n=Object.assign({},t);n.apiVersion=2;n.getDescription=function(e,t,a,n,i,r,l,s,u,o){const c=u;return c&&c.Text[0]!==c.InternalKey[0]?c.Text[0]:""};n.getItemForValue=function(e,t,a){if(!a.value){return Promise.resolve()}const n={key:a.value};let i=e._getMetaObject();if(i.isA("sap.sac.df.model.VariableGroup")){i=i.MergedVariable}if(i&&i.MemberFilter&&a.value){const t=i.MemberFilter.find(function(t){return e._isDate()?a.value===t.InternalKey[0]:a.value===t.InternalKey[0]});if(t){n.description=t&&t.Text[0]?t.Text[0]:a.value}}return Promise.resolve(n)};n.isInvalidInputAllowed=function(){return false};n.isInputValidationEnabled=function(e){return e._supportsValueHelp()&&e._getValueType()==="String"};n.getDataTypeClass=function(e,t){return a.getDataTypeClassName(t)};n.getTypeMap=function(){return a};return n});
//# sourceMappingURL=FieldBaseDelegate.js.map