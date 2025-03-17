sap.ui.define(
	["sap/base/i18n/Localization", "sap/ui/core/UIComponent", "sap/ui/core/IconPool", "sap/ui/Device"],
	function (Localization, UIComponent, IconPool, Device) {
		"use strict";
		return UIComponent.extend("sap.fe.core.fpmExplorer.Component", {
			metadata: {
				manifest: "json",
				includes: ["css/style.css"]
			},

			/**
			 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
			 * In this function, the device models are set and the router is initialized.
			 * @public
			 * @override
			 */
			init: function () {
				// call the base component's init function
				UIComponent.prototype.init.apply(this, arguments);

				// specify the only supported language
				Localization.setLanguage("en");

				// register TNT icon font
				IconPool.registerFont({
					fontFamily: "SAP-icons-TNT",
					fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
				});

				this.getRouter().initialize();
			},

			/**
			 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
			 * design mode class should be set, which influences the size appearance of some controls.
			 * @public
			 * @returns {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
			 */
			getContentDensityClass: function () {
				if (document.body.classList.contains("sapUiSizeCompact") && !Device.support.touch) {
					// apply "compact" mode if touch is not supported
					return "sapUiSizeCompact";
				}
				// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
				return "sapUiSizeCozy";
			}
		});
	}
);
