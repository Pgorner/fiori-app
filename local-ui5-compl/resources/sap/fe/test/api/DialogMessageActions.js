/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./DialogActions","sap/fe/test/Utils","sap/ui/test/OpaBuilder","sap/fe/test/builder/FEBuilder"],function(e,t,r,i){"use strict";var s=function(t,r){return e.call(this,t,r,0)};s.prototype=Object.create(e.prototype);s.prototype.constructor=s;s.prototype.isAction=true;s.prototype.iExecuteBack=function(){return this.prepareResult(this.getBuilder().doPressHeaderButton(r.Matchers.properties({icon:"sap-icon://nav-back"})).description(t.formatMessage("Pressing back button on dialog '{0}'",this.getIdentifier())).execute())};s.prototype.iExecuteRefresh=function(){return this.prepareResult(this.getBuilder().doPressFooterButton(r.Matchers.resourceBundle("text","sap.fe.core","C_COMMON_SAPFE_REFRESH")).description(t.formatMessage("Pressing refresh button on dialog '{0}'",this.getIdentifier())).execute())};s.prototype.iSelectDraftDataLossOption=function(e){return this.prepareResult(i.create().hasType("sap.m.List").isDialogElement(true).has(r.Matchers.aggregation("items")).has(function(t){return t.find(function(t){return t.data("itemKey")===e})}).doPress().description("Selecting option with key {0} in draft data loss popup").execute())};return s});
//# sourceMappingURL=DialogMessageActions.js.map