/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./DialogAssertions","sap/ui/test/OpaBuilder","sap/fe/test/builder/FEBuilder","sap/fe/test/Utils"],function(e,t,s,r){"use strict";var i=function(t,s){return e.call(this,t,s,0)};i.prototype=Object.create(e.prototype);i.prototype.constructor=i;i.prototype.isAction=false;i.prototype.iCheckBack=function(e){return this.prepareResult(this.getBuilder().hasHeaderButton(t.Matchers.properties({icon:"sap-icon://nav-back"}),e).description(r.formatMessage("Checking that dialog '{0}' has a back button with state '{1}'",this.getIdentifier(),e)).execute())};i.prototype.iCheckRefresh=function(e){return this.prepareResult(this.getBuilder().hasFooterButton(t.Matchers.resourceBundle("text","sap.fe.core","C_COMMON_SAPFE_REFRESH"),e).description(r.formatMessage("Checking that dialog '{0}' has a refresh button with state '{1}'",this.getIdentifier(),e)).execute())};i.prototype.iCheckMessage=function(e){return this.prepareResult(this.getBuilder().hasContent(s.Matchers.states({controlType:"sap.m.MessageView"}),true).hasAggregation("items",t.Matchers.properties(e)).description(r.formatMessage("Checking dialog '{0}' having a message '{1}' ",this.getIdentifier(),e)).execute())};return i});
//# sourceMappingURL=DialogMessageAssertions.js.map