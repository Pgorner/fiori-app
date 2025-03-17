/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./FooterAPI","sap/fe/test/Utils"],function(t,e){"use strict";var r=function(e,r){return t.call(this,e,r)};r.prototype=Object.create(t.prototype);r.prototype.constructor=r;r.prototype.isAction=false;r.prototype.iCheckAction=function(t,r){var o=this.getBuilder();return this.prepareResult(o.hasContent(this.createActionMatcher(t),r).description(e.formatMessage("Checking footer action '{0}' with state='{1}'",t,r)).execute())};r.prototype.iCheckState=function(t){var r=this.getBuilder();return this.prepareResult(r.hasState(t).description(e.formatMessage("Checking footer with state='{0}'",t)).execute())};return r});
//# sourceMappingURL=FooterAssertionsBase.js.map