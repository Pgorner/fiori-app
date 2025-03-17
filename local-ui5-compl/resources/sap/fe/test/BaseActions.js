/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/test/Opa5","sap/ui/test/OpaBuilder","sap/fe/test/builder/FEBuilder","sap/fe/test/Utils"],function(e,t,i,r){"use strict";var n=e.extend("sap.fe.test.BaseActions",{iClosePopover:function(){return i.createClosePopoverBuilder(this).description("Closing open popover").execute()},iPressEscape:function(){return i.create(this).has(i.Matchers.FOCUSED_ELEMENT).do(i.Actions.keyboardShortcut("Escape")).description("Pressing escape button").execute()},iWait:function(e){var t=false,n=true;return i.create(this).check(function(){if(n){n=false;setTimeout(function(){t=true},e)}return t}).description(r.formatMessage("Waiting for '{0}' milliseconds ",e)).execute()},iNavigateBack:function(){return t.create(this).viewId(null).do(function(){e.getWindow().history.back()}).description("Navigating back via browser back").execute()},iNavigateForward:function(){return t.create(this).viewId(null).do(function(){e.getWindow().history.forward()}).description("Navigating back via browser forward").execute()},iChangeTimeout:function(t){e.extendConfig({timeout:t});return i.create(this).check(function(){return true}).description(r.formatMessage("Timeout set to '{0}' seconds ",t)).execute()}});n._dummy=function(){};return n});
//# sourceMappingURL=BaseActions.js.map