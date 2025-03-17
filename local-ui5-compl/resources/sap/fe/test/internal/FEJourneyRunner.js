/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/fe/test/JourneyRunner","sap/fe/test/Utils","./FEArrangements","sap/base/Log"],function(e,n,t){"use strict";var a=e.extend("sap.fe.test.internal.FEJourneyRunner",{constructor:function(n){if(window.QUnit){const e=window.QUnit.test;window.QUnit.test=function(n,t,a){if(a===undefined){a=t}return e(n,a)}}var t={launchUrl:"test-resources/sap/fe/templates/internal/demokit/flpSandbox.html",launchParameters:{"sap-ui-xx-csp-policy":"sap-target-level-3:ro"}};n=Object.assign(t,n);try{if(window.__karma__.config.ui5.config.usetenants){var a=window.__karma__.config.ui5.shardIndex;if(a!==undefined&&a!==null){n.launchParameters["sap-client"]=a}}}catch(e){delete n.launchParameters["sap-client"]}e.apply(this,[n])},getBaseArrangements:function(e){return new t(e)}});var r=new a({opaConfig:{frameWidth:1300,frameHeight:1e3}});var i=new a({opaConfig:{frameWidth:1700,frameHeight:1e3}});var s=new a({opaConfig:{frameWidth:1900,frameHeight:1440,timeout:90}});a.run=r.run.bind(r);a.runWide=i.run.bind(i);a.runFCL=s.run.bind(s);return a});
//# sourceMappingURL=FEJourneyRunner.js.map