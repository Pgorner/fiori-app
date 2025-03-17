/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./FooterActionsBase","sap/fe/test/Utils","sap/ui/test/OpaBuilder"],function(t,e,n){"use strict";var r=function(e,n){return t.call(this,e,n)};r.prototype=Object.create(t.prototype);r.prototype.constructor=r;r.prototype.isAction=true;r.prototype.iExecuteSave=function(){return this.iExecuteAction({service:"StandardAction",action:"Save",unbound:true})};r.prototype.iExecuteApply=function(){return this.iExecuteAction({service:"StandardAction",action:"Apply",unbound:true})};r.prototype.iExecuteCancel=function(){return this.iExecuteAction({service:"StandardAction",action:"Cancel",unbound:true})};r.prototype.iConfirmCancel=function(){return this.prepareResult(n.create(this).hasType("sap.m.Popover").isDialogElement().doOnChildren(n.Matchers.resourceBundle("text","sap.fe.core","C_TRANSACTION_HELPER_DRAFT_DISCARD_BUTTON"),n.Actions.press()).description("Confirming discard changes").execute())};return r});
//# sourceMappingURL=FooterActionsOP.js.map