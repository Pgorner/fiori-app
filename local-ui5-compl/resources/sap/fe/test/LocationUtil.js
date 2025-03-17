/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/test/OpaBuilder","sap/ui/test/Opa5","sap/fe/test/Utils"],function(t,e,n){"use strict";var r=function(t,n){if(n||!(typeof t.getController().getRouter==="function")){var r=e.getWindow();return r.window.location.hash}return t.getController().getRouter().getHashChanger().getHash()};var i=function(t){return new RegExp(n.formatMessage("^application-{0}-component---app(RootView)?$",t))};return{create:function(e){return{actions:{},assertions:{iCheckCurrentHashStartsWith:function(n,a){return t.create(this).hasId(i(e)).check(function(t){var e=r(t[0],a);return e.indexOf(n)===0}).description("Checking hash starts with "+n).execute()},iCheckCurrentHashDoesNotContain:function(n,a){return t.create(this).hasId(i(e)).check(function(t){var e=r(t[0],a);return e.indexOf(n)===-1}).description("Checking hash doesn't contain "+n).execute()}}}}}});
//# sourceMappingURL=LocationUtil.js.map