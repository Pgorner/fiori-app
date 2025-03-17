/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/**
 * Actions and assertions to be used with a page hosted in an FCL
 */
sap.ui.define(["sap/ui/test/OpaBuilder"], function (OpaBuilder) {
	"use strict";
	return {
		actions: {
			iEnterFullScreenMode: function () {
				return OpaBuilder.create(this)
					.hasType("sap.m.OverflowToolbarButton")
					.hasProperties({ icon: "sap-icon://full-screen" })
					.description("Entering the FullScreen Button")
					.doPress()
					.execute();
			},
			iExitFullScreenMode: function () {
				return OpaBuilder.create(this)
					.hasType("sap.m.OverflowToolbarButton")
					.hasProperties({ icon: "sap-icon://exit-full-screen" })
					.description("Exiting Full screen mode")
					.doPress()
					.execute();
			},
			iCloseThisColumn: function () {
				return OpaBuilder.create(this)
					.hasType("sap.m.OverflowToolbarButton")
					.hasProperties({ icon: "sap-icon://decline" })
					.doPress()
					.description("Close FCL column for object page")
					.execute();
			}
		},
		assertions: {
			iCheckActionButton: function (bVisible, sIcon, sButtonName) {
				if (!sButtonName) {
					sButtonName = sIcon;
				}
				return OpaBuilder.create(this)
					.hasType("sap.uxap.ObjectPageDynamicHeaderTitle")
					.check(function (aHeaders) {
						var oHeader = aHeaders[0],
							aExists = oHeader.getNavigationActions().filter(function (oButton) {
								return oButton.getIcon && oButton.getIcon() === sIcon && oButton.getVisible();
							});

						return bVisible ? aExists.length !== 0 : aExists.length === 0;
					})
					.description((bVisible ? "Seeing" : "Not seeing") + " the " + sButtonName + " Button")
					.execute();
			},

			iCheckFullScreenButton: function (bVisible) {
				return this.iCheckActionButton(bVisible, "sap-icon://full-screen", "Fullscreen");
			},
			iCheckFullScreenExitButton: function (bVisible) {
				return this.iCheckActionButton(bVisible, "sap-icon://exit-full-screen", "Exit Fullscreen");
			},
			iCheckCloseColumnButton: function (bVisible) {
				return this.iCheckActionButton(bVisible, "sap-icon://decline", "Close Column");
			},
			iSeeEndColumnFullScreen: function () {
				return OpaBuilder.create(this)
					.hasType("sap.m.OverflowToolbarButton")
					.check(function (oButtons) {
						var bFound = oButtons.some(function (oButton) {
							return oButton.getProperty("icon") === "sap-icon://full-screen";
						});
						return bFound === false;
					}, true)
					.description("No FCL displayed")
					.execute();
			}
		}
	};
});
