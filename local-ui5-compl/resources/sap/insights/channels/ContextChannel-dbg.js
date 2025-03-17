/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 * POC
 */
sap.ui.define(
	[
		"sap/ui/base/Object"
	],
	function (UI5Object) {
		"use strict";

		/**
		 * Interface required for classes that would like to provide cards using the <code>sap.insights.CardsChannel</code>.
		 *
		 * @name sap.insights.channels.IContextProvider
		 * @interface
		 * @public
		 * @experimental
		 */

		/**
		 * Getter of the current context as promise.
		 *
		 * @returns {Promise<object>} returns a promise of the context
		 * @public
		 * @experimental
		 * @function
		 * @name sap.insights.channels.IContextProvider.getContext
		 */

		/**
		 * Get the unique identifier of the context provider (e.g. app id)
		 *
		 * @returns {string} unique id of the context provider
		 * @public
		 * @experimental
		 * @function
		 * @name sap.insights.channels.IContextProvider.getId
		 */




		/**
		 * Provides a communication between card providers and consumers in FLP and included iframes.
		 *
		 * @class
		 * @alias sap.insights.channels.ContextChannel
		 * @public
		 * @experimental
		 */
		var ContextChannel = UI5Object.extend("sap.insights.channels.ContextChannel", /** @lends sap.insights.channels.ContextChannel.prototype */ {

			/**
			 * @private
			 */
			constructor: function () {
				this.providers = [];
			},

			/**
			 * Initialize the ContextChannel either with the FLP message broker or an internal implementation for iframes.
			 *
			 * @returns {Promise<void>} .
			 * @experimental
			 * @public
			 */
			init: function () {
				return new Promise(function (resolve, reject) {
					const oContainer = sap.ui.require("sap/ushell/Container");
					if (oContainer) {
						oContainer.getServiceAsync("MessageBroker").then(function (broker) {
							this.broker = broker;
							resolve(this);
						}.bind(this));
					} else {
						reject('S/CUBE is not yet supported');
					}
				}.bind(this));
			},

			/**
			 * Register a card provider with a unique id. The provider will be notified if new consumers get registered.
			 *
			 * @param {sap.insights.channels.IContextProvider} provider Object implementing the TBD interface
			 * @returns {Promise<void>} .
			 * @experimental
			 * @public
			 */
			registerProvider: function (provider) {
				this.providers.push(provider);
				// TBD: register with the MessageBroker for S/CUBE
			},

			/**
			 * Unregister a previously registered consumer or provider.
			 *
			 * @param {sap.insights.channels.IContextProvider} provider Object implementing the TBD interface
			 * @returns {Promise<void>} .
			 * @experimental
			 * @public
			 */
			unregisterProvider: function (provider) {
				const index = this.providers.indexOf(provider);
				this.providers.splice(index, 1);
			},

			/**
			 * Get the context from the active provider.
			 *
			 * @returns {Promise<object>} .
			 * @experimental
			 * @public
			 */
			getContext: function () {
				if (this.providers.length > 0) {
					const contextProvider = this.providers[this.providers.length - 1].getContext();
					return contextProvider.then(function (oContext) {
						return this.withAppInfo(oContext);
					}.bind(this));
					// TBD: use the MessageBroker for S/CUBE
				} else {
					return this.withAppInfo({});
				}
				// TBD
			},

			/**
			 * Enhances the context with ushell app info
			 *
			 * @param {Object} oContext the context object
			 * @returns {Promise<object>} the context enhanced with the ushell app info
			 * @private
			 */
			withAppInfo: function (oContext) {
				return this.getAppInfo().then(function (appInfo) {
					if (appInfo && oContext) {
						oContext["nw.core.flp.shell"] = {
							appInfo: appInfo
						};
					}
					return oContext;
				}).catch(function () {
					return oContext;
				});
			},

			/**
			 * Get ushell app info
			 *
			 * @returns {Promise<object>} ushell app info
			 * @private
			 */
			getAppInfo: function () {
				return new Promise(function (resolve) {
					const oContainer = sap.ui.require("sap/ushell/Container");
					if (oContainer) {
						oContainer.getServiceAsync("AppLifeCycle").then(function (appLifeCycle) {
							if (appLifeCycle && appLifeCycle.getCurrentApplication) {
								return appLifeCycle.getCurrentApplication().getAllAppInfo();
							}
							return undefined;
						}).then(function (appInfo) {
							resolve(appInfo);
						}).catch(function () {
							resolve();
						});
					} else {
						resolve();
					}
				});
			}
		});

		var instance;
		return {
			/**
			 * Function to get instance of the singleton ContextChannel service.
			 * @returns {Promise<sap.insights.channels.ContextChannel>} Returns promise which is resolved to instance of ContextChannel service.
			 * @public
			 * @experimental
			 */
			getInstance: function () {
				if (!instance) {
					instance = new ContextChannel();
					return instance.init();
				} else {
					return Promise.resolve(instance);
				}
			}
		};
	}
);
