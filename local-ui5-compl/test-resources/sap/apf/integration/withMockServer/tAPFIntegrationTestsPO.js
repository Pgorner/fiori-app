sap.ui.define([
	'sap/ui/test/Opa',
	'sap/ui/test/Opa5'
], function(Opa, Opa5) {
	"use strict";
	var apfIntegrationTestsPO = Opa5.extend("apf.tAPFIntegrationTestsPO", {

		//Global Variables
		myGlobalVariable : function() {
			this.facetFilter = false;
			this.pageSection = false;
			this.footerFilter = false;
			this.oJQuery = Opa5.getJQuery(); // Assigned the sap Jquery object instead of null.
		},

		//Arrangement
		iInitiateLaunch : function() {
			return this.iStartMyAppInAFrame(sap.ui.require.toUrl("test-resources/sap/apf/demokit/app/index.html?sap-ui-language=EN"));
		},
		iPrepareForScenario : function(){
			if(Opa.getContext().control === false || Opa.getContext().control === undefined){
				this.iInitiateLaunch();
				this.iLaunchDemokit();
				this.iAssertLaunch();
			}
		},
		//Action
		iLaunchDemokit : function() {
				return this.iCheckOnFacetFilter().and.iCheckOnPageSection().and.iCheckOnFooter();
		},
		iCheckOnFacetFilter : function() {
			return this.waitFor({
				viewName : "layout",
				controlType : "sap.m.FacetFilter",
				success : function() {
					this.myGlobalVariable.facetFilter = true;
				}
			});
		},
		iCheckOnPageSection : function() {
			return this.waitFor({
				viewName : "layout",
				controlType : "sap.m.Page",
				success : function(page) {
					var oPage = page.length;
					if (oPage === 3) {
						this.myGlobalVariable.pageSection = true;
					} else {
						this.myGlobalVariable.pageSection = false;
					}
				}
			});
		},
		iCheckOnFooter : function() {
			return this.waitFor({
				viewName : "layout",
				controlType : "sap.m.Bar",
				success : function() {
					this.myGlobalVariable.footerFilter = true;
				}
			});
		},
		iTearDownDemokit : function() {
			return this.iTeardownMyAppFrame();
		},

		//Assertions
		iAssertLaunch : function() {
			return this.waitFor({
				viewName : "layout",
				check : function() {
					Opa.getContext().control = false;
					if (this.myGlobalVariable.facetFilter === true && this.myGlobalVariable.pageSection === true && this.myGlobalVariable.footerFilter === true) {
						Opa.getContext().control = true;
						this.myGlobalVariable.oJQuery = Opa5.getJQuery(); // Overwriting the default value 
						return true;
					} 
						return false;
				},
				success : function() {
					// Only executes when check returns true.
					Opa5.assert.ok(true, "Demokit Application is Launched!");
				},
				errorMessage : "Did not Launch Demokit"
			});
		}	
	});
	return apfIntegrationTestsPO;
});
