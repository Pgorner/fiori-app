/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./DialogAssertions","sap/ui/test/OpaBuilder","sap/fe/test/builder/FEBuilder","sap/fe/test/Utils"],function(t,e,r,s){"use strict";var i=function(e,r){return t.call(this,e,r,0)};i.prototype=Object.create(t.prototype);i.prototype.constructor=i;i.prototype.isAction=false;i.prototype.iCheckCreate=function(t){return this.prepareResult(this.getBuilder().hasFooterButton(e.Matchers.resourceBundle("text","sap.fe.core","C_TRANSACTION_HELPER_SAPFE_ACTION_CREATE_BUTTON_CONTINUE"),t).description(s.formatMessage("Checking that dialog '{0}' has create button with state '{1}'",this.getIdentifier(),t)).execute())};return i});
//# sourceMappingURL=DialogCreateAssertions.js.map