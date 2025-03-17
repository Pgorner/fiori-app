/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./HeaderLR","sap/fe/test/Utils","sap/ui/test/OpaBuilder","sap/fe/test/builder/FEBuilder","sap/fe/test/builder/MdcFieldBuilder","./APIHelper"],function(e,t,r,s,i,a){"use strict";var c=function(t,r){return e.call(this,t,r)};c.prototype=Object.create(e.prototype);c.prototype.constructor=c;c.prototype.isAction=false;c.prototype.iCheckAction=function(e,r){var s=t.parseArguments([[Object,String],Object],arguments),i=this.createOverflowToolbarBuilder(this._sPageId);return this.prepareResult(i.hasContent(this.createActionMatcher(e),r).description(t.formatMessage("Checking custom header action '{0}' with state='{1}'",s[0],s[1])).execute())};c.prototype.iCheckSaveAsTile=function(e){var i={icon:"sap-icon://action"};var c=s.create(this.getOpaInstance());return this.prepareResult(c.hasProperties(i).do(r.Actions.press()).description(t.formatMessage("Open share menu")).success(a.createSaveAsTileCheckBuilder(e)).execute())};c.prototype.iCheckSendEmail=function(e){var i={icon:"sap-icon://action"};var c=s.create(this.getOpaInstance());return this.prepareResult(c.hasProperties(i).do(r.Actions.press()).description(t.formatMessage("Open share menu")).success(a.createSendEmailCheckBuilder(e)).execute())};return c});
//# sourceMappingURL=HeaderAssertionsLR.js.map