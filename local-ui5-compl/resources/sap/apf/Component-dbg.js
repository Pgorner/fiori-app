/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap */
sap.ui.define(["sap/ui/core/UIComponent", "sap/apf/api"], function(UIComponent, Api) {
	'use strict';

	var component = UIComponent.extend("sap.apf.Component", {
		oApi : null,
		metadata : {
			"config" : {
				"fullWidth" : true
			},
			"name" : "CoreComponent",
			"version" : "0.0.1",
			"publicMethods" : [ "getApi" ],
			"dependencies" : {
				"libs" : [ "sap.m", "sap.ui.layout", "sap.viz", "sap.ui.comp", "sap.suite.ui.commons" ]
			}
		},
		/**
		 * @public
		 * @description Initialize the Component instance after creation. The component, that extends this component should call this method.
		 * @function
		 * @name sap.apf.Component.prototype.init
		 */
		init : function() {
			if (!this.oApi) {
				this.oApi = new Api(this, this.getApiInjections());
			}
			
			// APF loads application configuration if sap-apf-app-config-path is provided via start parameters
			var appConfigPath = this.oApi.getStartParameterFacade().getApplicationConfigurationPath();
			if (appConfigPath) {
				this.oApi.loadApplicationConfig(appConfigPath);
			}
			UIComponent.prototype.init.apply(this, arguments);
		},
		/**
		 * @public
		 * @description Creates the content of the component. A component, that extends this component should call this method.
		 * @function
		 * @name sap.apf.Component.prototype.createContent
		 * @returns {sap.ui.core.Control} the content
		 */
		createContent : function() {
			UIComponent.prototype.createContent.apply(this, arguments);
			return this.oApi.startApf();
		},
		/**
		 * @public
		 * @description Cleanup  the Component instance . The component, that extends this component should call this method.
		 * @function
		 * @name sap.apf.Component.prototype.exit
		 */
		exit : function() {
			try {
				this.oApi.destroy();
			} catch(e){
				 // continue regardless of error
			}
		},
		/**
		 * @public
		 * @function
		 * @name sap.apf.Component#getApi
		 * @description Returns the instance of the APF API.
		 * @returns {sap.apf.Api}
		 */
		getApi : function() {
			return this.oApi;
		},
		/**
		 * @private
		 */
		getApiInjections: function() {
			return undefined;
		}
	});

	return component;
}, true);