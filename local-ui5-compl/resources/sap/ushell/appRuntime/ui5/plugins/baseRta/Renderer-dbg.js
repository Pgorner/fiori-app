/*!
 * Copyright (c) 2009-2023 SAP SE, All Rights Reserved
 */

sap.ui.define([
	"sap/base/Log",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils"
], function (
	Log,
	AppLifeCycleUtils
) {
	"use strict";

	const Renderer = {

		createActionButton: async function (oComponent, onClickHandler, bIsVisible) {
			const oContainer = AppLifeCycleUtils.getContainer();
			const ExtensionService = await oContainer.getServiceAsync("FrameBoundExtension");

			try {
				const oUserAction = await ExtensionService.createUserAction({
					id: oComponent.mConfig.id,
					text: oComponent.mConfig.i18n.getText(oComponent.mConfig.text),
					icon: oComponent.mConfig.icon,
					press: onClickHandler
				}, {
					controlType: "sap.ushell.ui.launchpad.ActionItem"
				});
				if (bIsVisible) {
					oUserAction.showForAllApps();
				} else {
					oUserAction.hideForAllApps();
				}
				return oUserAction;
			} catch (sErrorMessage) {
				Log.error(sErrorMessage, undefined, oComponent.mConfig.sComponentName);
			}
		},

		exit: function () {}
	};

	return Renderer;
}, true);
