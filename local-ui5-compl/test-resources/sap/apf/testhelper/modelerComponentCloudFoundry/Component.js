// modeler component for integration testing

sap.ui.define([
	'sap/apf/modeler/Component',
	'sap/base/util/deepExtend',
	'sap/m/App'
], function(ModelerComponent, deepExtend, App) {
	"use strict";

	var Component = ModelerComponent.extend("test.sap.apf.testhelper.modelerComponentCloudFoundry.Component", {
		name: "test.sap.apf.testhelper.modelerComponentCloudFoundry",
		metadata: {
			manifest : "json",
			properties : {
				injectedApfApi: {
					Constructor: function(oComponent, injectedConstructors, manifests) {
						this.startApf = function() {
							var application = new App();
							return application;
						};
						this.destroy = function() {};

						this.startupSucceeded = function() {
							return true;
						};
					}
				}
			}
		},
		getInjections : function() {
			var inject = {
				functions: {
					isUsingCloudFoundryProxy: function() { return true; }
				}
			};
			deepExtend(inject, inject, ModelerComponent.prototype.getInjections.apply(this, arguments));

			return inject;
		}
	});
	return Component;

}, true);
