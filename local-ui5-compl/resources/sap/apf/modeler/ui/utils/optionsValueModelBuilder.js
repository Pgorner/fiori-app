/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/modeler/ui/utils/nullObjectChecker","sap/ui/model/json/JSONModel"],function(e,n){"use strict";var r=500;var t={};t.prepareModel=function(t,i){var u;if(!e.checkIsNotNullOrUndefined(i)){i=r}u=new n;u.setSizeLimit(i);u.setData({Objects:t});return u};t.convert=function(n,r){var i=[],u;if(!e.checkIsNotNullOrUndefinedOrBlank(n)){return undefined}n.forEach(function(n){if(!e.checkIsNotNullOrUndefined(n)){return}u={};u.key=n instanceof Object?n.key:n;u.name=n instanceof Object?n.name:n;i.push(u)});return t.prepareModel(i,r)};return t},true);
//# sourceMappingURL=optionsValueModelBuilder.js.map