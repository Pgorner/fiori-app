/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2015 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/apf/api",
	"sap/apf/cloudFoundry/uiHandler",
	"sap/base/util/deepExtend"
], function(UIComponent, Api, uiHandler, deepExtend) {
	'use strict';

	var component = UIComponent.extend("sap.apf.base.Component", {
		metadata : {
			"manifest" : "json",
			"library" : "sap.apf",
			"publicMethods" : [ "getApi" ]
		},
		oApi : null,
		init : function() {
			var baseManifest;
			var manifest;
			var ApiConstructor;
			if (!this.oApi) {
				baseManifest = component.prototype.getMetadata()._getManifest();
				manifest = deepExtend({}, this.getManifest());
				if (this.getMetadata().getAllProperties().injectedApfApi) {
					ApiConstructor = this.getMetadata().getAllProperties().injectedApfApi.appData.Constructor;
				} else {
					ApiConstructor = Api;
				}
				this.oApi = new ApiConstructor(this, undefined,{
					manifest : manifest,
					baseManifest : baseManifest
				});
				if (this.oApi.startupSucceeded()) {
					UIComponent.prototype.init.apply(this, arguments);
				}
			} else {
				return;
			}

			if (this.getInjections() && this.getInjections().functions && this.getInjections().functions.isUsingCloudFoundryProxy
				&& (typeof this.getInjections().functions.isUsingCloudFoundryProxy === 'function') && this.getInjections().functions.isUsingCloudFoundryProxy() === true) {
				uiHandler.initRuntime(this);
			}
		},
		/**
		 * @public
		 * @description Creates the content of the component. A component that extends this component shall call this method.
		 * @function
		 * @name sap.apf.base.Component.prototype.createContent
		 * @returns {sap.ui.core.Control} the content
		 */
		createContent : function() {
			UIComponent.prototype.createContent.apply(this, arguments);
			return this.oApi.startApf();
		},
		/**
		 * @public
		 * @description Cleanup the Component instance. The component that extends this component should call this method.
		 * @function
		 * @name sap.apf.base.Component.prototype.exit
		 */
		exit : function() {
			this.oApi.destroy();
		},
		/**
		 * @public
		 * @function
		 * @name sap.apf.base.Component#getApi
		 * @description Returns the instance of the APF API.
		 * @returns {sap.apf.Api}
		 */
		getApi : function() {
			return this.oApi;
		},
		/**
		* @public
		* @experimental NOT FOR PRODUCTION USE
		* @since 1.38.4
		* @function
		* @name sap.apf.base.Component#getInjections
		* @description This function is optional and can be implemented in any extending Component.js.
		* Its return value is an object containing injected constructors, functions, references and exits.
		* The injected sub entities are all optional and will be used by the APF logic when defined.
		* Exits are used to change predefined enhancement points.
		* Instances, functions and constructors are used for test isolation.
		* Probe is used in tests to access internal APF references.
		* @returns {object} Object containing optional injects and exits
		* @returns {object.exits} Exit functions
		* @returns {object.exits.binding.afterGetFilter} Exit function to be used for altering the filter returned by binding.getFilter()
		* @returns {object.exits.path.beforeAddingToCumulatedFilter} Exit function to be used for altering the filter of a step during path update before adding to cumulative filter
		* @returns {object.instances} Instances to be injected for testing purposes
		* @returns {object.functions} Functions to be injected for testing purposes
		* @returns {object.constructors} Constructors to be injected for testing purposes
		* @returns {object.probe} Probe constructor to get internal APF references for testing purposes
		*/
		getInjections : function() {
			return {
				exits: {},
				instances: {},
				functions: {},
				constructors: {},
				probe: function(){}
			};
		}
	});

	return component;
}, true);