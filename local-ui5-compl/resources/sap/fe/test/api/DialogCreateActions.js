/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./DialogActions","sap/fe/test/Utils","sap/ui/test/OpaBuilder"],function(t,e,r){"use strict";var o=function(e,r){return t.call(this,e,r,0)};o.prototype=Object.create(t.prototype);o.prototype.constructor=o;o.prototype.isAction=true;o.prototype.iExecuteCreate=function(){return this.prepareResult(this.getBuilder().doPressFooterButton(r.Matchers.resourceBundle("text","sap.fe.core","C_TRANSACTION_HELPER_SAPFE_ACTION_CREATE_BUTTON_CONTINUE")).description(e.formatMessage("Pressing create button on dialog '{0}'",this.getIdentifier())).execute())};return o});
//# sourceMappingURL=DialogCreateActions.js.map