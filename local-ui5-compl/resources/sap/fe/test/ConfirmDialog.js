/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/test/OpaBuilder","sap/ui/test/Opa5","sap/fe/test/Utils"],function(e,t,n){"use strict";function i(e){if(e.testWindow){e.testWindow.confirm=e.testWindowConfirm;delete e.testWindow;delete e.testWindowConfirm}}return{create:function(){return{actions:{iSetNextConfirmAnswer:function(o,r){return e.create(this).do(function(){var e=t.getWindow(),n=e.confirm;function s(e){i(r);r.confirmed=o;r.message=e;return o}delete r.confirmed;delete r.message;r.testWindow=e;r.testWindowConfirm=n;e.confirm=s}).description(n.formatMessage("Next confirmation dialog will be {0}",o?"accepted":"refused")).execute()}},assertions:{confirmDialogHasBeenDisplayed:function(t,i){return e.create(this).check(function(){return i&&i.confirmed===t},true).description(n.formatMessage("Confirm dialog has been displayed and {0}",t?"accepted":"refused")).execute()},confirmDialogHasNotBeenDisplayed:function(t){return e.create(this).check(function(){return t&&!("confirmed"in t)},true).success(function(){i(t)}).description("No confirm dialog has been displayed").execute()}}}}}});
//# sourceMappingURL=ConfirmDialog.js.map