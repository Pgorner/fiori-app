// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
	"sap/ui/core/Component",
	"sap/ui/core/Element",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/CheckConditions",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/Trigger"
], function (
	Component,
	Element,
	AppLifeCycleUtils,
	CheckConditions,
	Trigger
) {
	"use strict";

	var BaseRTAPlugin = Component.extend("sap.ushell.plugins.BaseRTAPlugin", {
		sType: null,

		init: function (mConfig) {
			this.mConfig = mConfig;
			this.mConfig.i18n = this.getModel("i18n").getResourceBundle();
			this.mConfig.loadPlugins = this._loadPlugins.bind(this);
			this.mConfig.onStartHandler = this._onStartHandler.bind(this);
			this.mConfig.onErrorHandler = this._onErrorHandler.bind(this);
			this.mConfig.onStopHandler = this._onStopHandler.bind(this);

			this.oTrigger = new Trigger(this.mConfig);

			this._oPluginPromise = (async () => {
				await this.oTrigger.getInitPromise();
				if (
					this.mConfig.checkRestartRTA
					&& CheckConditions.checkRestartRTA(this.mConfig.layer)
				) {
					await this.oTrigger.triggerStartRta(this);
				}
				const oAppLifeCycleService = await AppLifeCycleUtils.getAppLifeCycleService();
				await oAppLifeCycleService.attachAppLoaded(this._onAppLoaded, this);
			})();
		},

		getPluginPromise: function () {
			return this._oPluginPromise;
		},

		exit: function () {
			this._oPluginPromise = this._oPluginPromise
				.then(AppLifeCycleUtils.getAppLifeCycleService)
				.then(function (oAppLifeCycleService) {
					oAppLifeCycleService.detachAppLoaded(this._onAppLoaded, this);
					if (this._onRendererCreated) {
						var oContainer = AppLifeCycleUtils.getContainer();
						oContainer.detachRendererCreatedEvent(this._onRendererCreated, this);
					}
				}.bind(this));
		},

		_onAppLoaded: async function () {
			if (await CheckConditions.checkRtaPrerequisites()) {
				if (CheckConditions.checkRestartRTA(this.mConfig.layer)) {
					this.oTrigger.triggerStartRta(this);
				}
				this._setButtonVisibility(true);
			} else {
				this._setButtonVisibility(false);
			}
		},

		/**
		 * Event handler for the "Adapt" button of the RTA FLP Plugin
		 * Checks the supported browsers and starts the RTA
		 * @returns {Promise} Resolves when rta is triggered
		 * @private
		 */
		_onAdapt: function () {
			return this.oTrigger.triggerStartRta(this);
		},

		_setButtonVisibility: function (bVisible) {
			if (!this.oActionButton) {
				return;
			}
			if (bVisible) {
				this.oActionButton.showForAllApps();
			} else {
				this.oActionButton.hideForAllApps();
			}
		},

		/**
		 * Leaves the RTA adaptation mode
		 * @private
		 */
		_exitAdaptation: function () {
			if (this._switchToDefaultMode) {
				this._switchToDefaultMode();
			}
			this.oTrigger.exitRta();
		},

		/**
		 * This function is called when the start event of RTA was fired
		 * @private
		 */
		_onStartHandler: function () {},

		/**
		 * This function is called when the failed event of RTA was fired
		 * @private
		 */
		_onErrorHandler: function () {
			this._exitAdaptation();
		},

		/**
		 * This function is called when the stop event of RTA was fired
		 * @private
		 */
		_onStopHandler: function () {
			this._exitAdaptation();
		},

		/**
		 * This function should be overridden when custom plugins are needed
		 *
		 * @private
		 * @returns {Promise} Returns a resolved Promise
		 */
		_loadPlugins: function () {
			return Promise.resolve();
		}

	});
	return BaseRTAPlugin;

}, true /* bExport */);
