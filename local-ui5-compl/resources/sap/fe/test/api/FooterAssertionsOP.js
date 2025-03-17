/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./FooterAssertionsBase","sap/fe/test/Utils","sap/m/library"],function(t,e,r){"use strict";var n=function(e,r){return t.call(this,e,r)};n.prototype=Object.create(t.prototype);n.prototype.constructor=n;n.prototype.isAction=false;var i=r.DraftIndicatorState;function o(t,e){return t.hasContent(function(t){return t.getMetadata().getName()==="sap.m.DraftIndicator"&&t.getState()===e}).description("Draft Indicator on footer bar is in "+e+" state").execute()}n.prototype.iCheckSave=function(t){return this.iCheckAction({service:"StandardAction",action:"Save",unbound:true},t)};n.prototype.iCheckApply=function(t){return this.iCheckAction({service:"StandardAction",action:"Apply",unbound:true},t)};n.prototype.iCheckCancel=function(t){return this.iCheckAction({service:"StandardAction",action:"Cancel",unbound:true},t)};n.prototype.iCheckDraftStateClear=function(){return this.prepareResult(o(this.getBuilder(),i.Clear))};n.prototype.iCheckDraftStateSaved=function(){return this.prepareResult(o(this.getBuilder(),i.Saved))};return n});
//# sourceMappingURL=FooterAssertionsOP.js.map