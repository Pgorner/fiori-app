/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BaseAPI","sap/fe/test/Utils","sap/ui/test/OpaBuilder","sap/fe/test/builder/FEBuilder","sap/fe/test/builder/OverflowToolbarBuilder","sap/fe/core/helpers/StableIdHelper"],function(e,t,r,a,s,i){"use strict";var n=function(r,s){if(!t.isOfType(r,a)){throw new Error("oHeaderBuilder parameter must be a FEBuilder instance")}this._sPageId=s.id;return e.call(this,r,s)};n.prototype=Object.create(e.prototype);n.prototype.constructor=n;n.prototype.createOverflowToolbarBuilder=function(e){return s.create(this.getOpaInstance()).hasType("sap.m.OverflowToolbar").has(function(t){return t.getParent().getMetadata().getName()==="sap.f.DynamicPageTitle"&&t.getParent().getParent().getMetadata().getName()==="sap.f.DynamicPage"&&t.getParent().getParent().getId().endsWith(e)})};return n});
//# sourceMappingURL=HeaderLR.js.map