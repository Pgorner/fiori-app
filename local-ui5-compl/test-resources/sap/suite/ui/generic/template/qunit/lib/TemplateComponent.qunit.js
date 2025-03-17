sap.ui.define([
    "sap/ui/core/UIComponent",
       "sap/suite/ui/generic/template/lib/TemplateComponent",
       "sap/ui/generic/app/transaction/TransactionController",
       "sap/ui/generic/app/transaction/DraftController",
       "sap/ui/generic/app/AppComponent",
       "sap/ui/core/mvc/XMLView",
       "sap/ui/core/util/MockServer",
       "sap/ui/model/json/JSONModel",
       "sap/ui/model/odata/v2/ODataModel",
	   "sap/ui/core/CustomData",
	   "sap/suite/ui/generic/template/lib/navigation/routingHelper"
    ],function(UIComponent, TemplateComponent) {
    "use strict";
    var oMockServer;
    var oGetComponentDataStub;
    var oTemplateContract = {
    	mRoutingTree: {
    		root: {
				willBeDisplayed: {
					then: function(fnExecute){
						fnExecute();
					}
				}    			
    		}
    	},
    	oBusyHelper: {
    		setBusy: Function.prototype
    	}
    };

    QUnit.module("sap.suite.ui.generic.template.lib.TemplateComponent", {
        beforeEach: function() {
            oGetComponentDataStub = sinon.stub(UIComponent.prototype, "getComponentData", function(){
                return {
                    registryEntry: {
                    	route: "root",
                    	oTemplateContract: oTemplateContract,
                    	viewRegistered: {
                    		then: function(fnThen){ fnThen(); }
                    	},
                    	oComponent: this 
                    }
                };
            });
            this.oTemplateComponent = new TemplateComponent();

        },
        afterEach: function() {
            this.oTemplateComponent.destroy();
            oGetComponentDataStub.restore();
        }
    });

    QUnit.test("Shall be instantiable", function(assert) {
        assert.ok(this.oTemplateComponent);
    });
});
