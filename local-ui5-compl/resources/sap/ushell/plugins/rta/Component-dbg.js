// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
	"sap/ushell/plugins/BaseRTAPlugin",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/CheckConditions",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/Renderer"
], function (
	BaseRTAPlugin,
	CheckConditions,
	Renderer
) {
	"use strict";

	var RTAPlugin = BaseRTAPlugin.extend("sap.ushell.plugins.rta.Component", {
		sType: "rta",
		metadata: {
			manifest: "json",
			library: "sap.ushell"
		},

		init: function () {
			var oConfig = {
				sComponentName: "sap.ushell.plugins.rta",
				layer: "CUSTOMER",
				developerMode: false,
				id: "RTA_Plugin_ActionButton",
				text: "RTA_BUTTON_TEXT",
				icon: "sap-icon://wrench",
				visible: true,
				checkRestartRTA: true
			};
			BaseRTAPlugin.prototype.init.call(this, oConfig);
			this._oPluginPromise = this._oPluginPromise
			.then(CheckConditions.checkRtaPrerequisites.bind(CheckConditions))
			.then(function (bRtaAvailable) {
				return Renderer.createActionButton(this, this._onAdapt.bind(this), bRtaAvailable);
			}.bind(this))
			.then(function (oActionButton) {
				this.oActionButton = oActionButton;
			}.bind(this));
		}
	});

	return RTAPlugin;
}, true /* bExport */);
