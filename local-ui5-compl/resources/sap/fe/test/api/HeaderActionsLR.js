/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./HeaderLR","sap/fe/test/Utils","sap/ui/test/OpaBuilder","sap/fe/test/builder/FEBuilder","./APIHelper"],function(e,t,r,s,i){"use strict";var o=function(t,r){return e.call(this,t,r)};o.prototype=Object.create(e.prototype);o.prototype.constructor=o;o.prototype.isAction=true;o.prototype.iExecuteAction=function(e){var s=t.parseArguments([[Object,String]],arguments),i=this.createOverflowToolbarBuilder(this._sPageId);return this.prepareResult(i.doOnContent(this.createActionMatcher(e),r.Actions.press()).description(t.formatMessage("Executing custom header action '{0}'",s[0])).execute())};o.prototype.iExecuteSaveAsTile=function(e){var o={icon:"sap-icon://action"};var a=s.create(this.getOpaInstance());return this.prepareResult(a.hasProperties(o).do(r.Actions.press()).description(t.formatMessage("Open share menu")).success(i.createSaveAsTileExecutorBuilder(e)).execute())};o.prototype.iExecuteSendEmail=function(){var e={icon:"sap-icon://action"},o=s.create(this.getOpaInstance());return this.prepareResult(o.hasProperties(e).do(r.Actions.press()).description(t.formatMessage("Pressing header '{0}' Share button",this.getIdentifier())).success(i.createSendEmailExecutorBuilder()).execute())};return o});
//# sourceMappingURL=HeaderActionsLR.js.map