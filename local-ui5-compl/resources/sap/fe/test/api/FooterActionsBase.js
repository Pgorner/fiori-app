/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./FooterAPI","sap/fe/test/Utils","sap/ui/test/OpaBuilder"],function(t,e,r){"use strict";var o=function(e,r){return t.call(this,e,r)};o.prototype=Object.create(t.prototype);o.prototype.constructor=o;o.prototype.isAction=true;o.prototype.iExecuteAction=function(t){var o=this.getBuilder();return this.prepareResult(o.doOnContent(this.createActionMatcher(t),r.Actions.press()).description(e.formatMessage("Executing footer action '{0}'",t)).execute())};return o});
//# sourceMappingURL=FooterActionsBase.js.map