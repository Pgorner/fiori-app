sap.ui.define([
	'sap/apf/core/binding',
	'sap/apf/testhelper/interfaces/IfResourcePathHandler',
	'sap/apf/utils/exportToGlobal',
	'sap/apf/utils/hashtable'
], function(
	Binding,
	IfResourcePathHandler,
	exportToGlobal,
	Hashtable
) {
	"use strict";

	/**
	 * @description Constructor, simply clones the configuration object and sets
	 * @param oInject
	 * @alias sap.apf.testhelper.doubles.ConfigurationFactory
	 */
	function ConfigurationFactory(oInject) {
		var that = this;
		/**
		 * supports the loading of configuration and creation of binding
		 */
		this.supportLoadAndCreateBinding = function() {
			function loadConfigurationObjects(aConfigurationObjects, sType) {
				for(var i = 0; i < aConfigurationObjects.length; i++) {
					loadConfigurationObject(aConfigurationObjects[i], sType);
				}
			}
			function loadConfigurationObject(oConfigurationObject, sType) {
				if (oConfigurationObject.type === undefined) {
					oConfigurationObject.type = sType;
				}
				that.idRegistry.setItem(oConfigurationObject.id, oConfigurationObject);
			}
			this.loadConfig = function(oConfiguration) {
				that.idRegistry = new Hashtable(oInject.instances.messageHandler);
				loadConfigurationObjects(oConfiguration.bindings, "binding");
				loadConfigurationObjects(oConfiguration.representationTypes, "representationType");
			};
			this.createBinding = function(sBindingId, oTitle, oLongTitle) {
				var oBindingConfig = that.idRegistry.getItem(sBindingId);
				oBindingConfig.oTitle = oTitle;
				oBindingConfig.oLongTitle = oLongTitle;
				return new Binding(oInject, oBindingConfig, this);
			};
			this.getConfigurationById = function(sId) {
				return that.idRegistry.getItem(sId);
			};
			return this;
		};
	}
	// TODO this looks wrong, shouldn't this be new IfConfigurationFactory() ?
	ConfigurationFactory.prototype = new IfResourcePathHandler();
	ConfigurationFactory.prototype.constructor = ConfigurationFactory;

	exportToGlobal("sap.apf.testhelper.doubles.ConfigurationFactory", ConfigurationFactory);

	return ConfigurationFactory;
});
