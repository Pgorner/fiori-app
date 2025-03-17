//Component, that extends the modeler component and uses the LREP persistence.
sap.ui.define([
	"sap/apf/modeler/Component",
	"sap/m/App"
], function(
	ModelerComponent,
	App
) {
	'use strict';

	return ModelerComponent.extend("sap.apf.testhelper.modelerComponent.Component", {
		metadata : {
			"config" : {
				"fullWidth" : true
			},
			"name" : "sap.apf.testhelper.modelerComponent.Component",
			"version" : "1.3.0",
			"manifest" : "json"
		},
		/**
		 * Initialize the application
		 * 
		 * @returns {sap.ui.core.Control} the content
		 */
		init : function() {
			ModelerComponent.prototype.init.apply(this, arguments);
		},
		/**
		 * Creates the application layout and returns the outer layout of APF 
		 * @returns
		 */
		createContent : function() {
			var disableCreateContentForUnitTest = (new URLSearchParams(window.location.search)).get('createContent');
			if (disableCreateContentForUnitTest) {
				return new App();
			}
			ModelerComponent.prototype.createContent.apply(this, arguments);
		},
		getInjections : function () {
			return {
				exits : {
					getRuntimeUrl : this.getRuntimeUrl
				}
			};
		},
		getRuntimeUrl : function() {
			return "testURL";
		}
	});
});
