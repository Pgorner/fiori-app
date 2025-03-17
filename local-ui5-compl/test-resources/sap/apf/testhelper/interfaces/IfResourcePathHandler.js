/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/apf/utils/exportToGlobal"
], function(
	exportToGlobal
){
	"use strict";

	/**
	 * @class Holds all paths for the message configuration, the message text bundles, other ui texts for apf, and for extensions. 
	 * Furthermore it  holds the information about persistence configuration.
	 * @alias sap.apf.testhelper.interfaces.IfResourcePathHandler
	 */
	function IfResourcePathHandler() {

		/**
		 * @public
		 * @description Loads a new  application configuration in JSON format. 
		 * @param {string} sFilePath The absolute path of application configuration file. Host and port will be added in front of this path. 
		 */
		this.loadConfigFromFilePath = function(sFilePath) {
			throw new Error("not implemented");
		};

		/**
		 * @public
		 * @description This function returns the path of a specified resource. 
		 * @param {string} sResourceIdentifier type sap.apf.core.constants.resourceLocation.*
		 * @returns {string} Resource path
		 */
		this.getResourceLocation = function(sResourceIdentifier) {
			throw new Error("not implemented");
		};
		/**
		 * @public
		 * @description This function returns the configuration for the persistence (of the path).
		 * @returns {object} persistence configuration object
		 */
		this.getPersistenceConfiguration = function() {
			throw new Error("not implemented");
		};
		/**
		 * @public
		 * @description This function returns the properties of the configuration file, which are not used internally.
		 * @returns {object} Copy of properties in configuration
		 */
		this.getConfigurationProperties = function() {
			throw new Error("not implemented");
		};

	}

	exportToGlobal("sap.apf.testhelper.interfaces.IfResourcePathHandler", IfResourcePathHandler);

	return IfResourcePathHandler;
});
