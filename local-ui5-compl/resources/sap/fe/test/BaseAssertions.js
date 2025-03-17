/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/test/Opa5","sap/ui/test/OpaBuilder","sap/fe/test/builder/FEBuilder","sap/fe/test/Utils"],function(e,s,t,a){"use strict";var i=e.extend("sap.fe.test.BaseAssertions",{iSeeMessagePage:function(e){return s.create(this).hasType("sap.m.MessagePage").hasProperties({text:e}).description(a.formatMessage("Error Page with message '{0}' is visible",e)).execute()},iSeePage:function(){return s.create(this).hasType("sap.m.Page").hasProperties({showHeader:false}).execute()},iSeeIllustratedMessage:function(e){return s.create(this).hasType("sap.m.IllustratedMessage").hasProperties({title:e}).execute()},iSeeMessageToast:function(e){return t.createMessageToastBuilder(e).execute(this)}});i._dummy=function(){};return i});
//# sourceMappingURL=BaseAssertions.js.map