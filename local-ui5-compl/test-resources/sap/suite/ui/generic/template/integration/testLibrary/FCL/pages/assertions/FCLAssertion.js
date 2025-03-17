/*** FCL Assertions ***/

sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
	"use strict";
	return function () {

		return {

			/**
			* Check if currently the application is in a specific layout of FlexibleColumnLayout
			*
			* @param {String} sLayout The layout to be checked for the FlexibleColumnLayout
			* @throws {Error} Throws an error if the FCL layout not found with the given layout
			* @return {*} success or failure
			* @public
			*/
			iCheckFCLLayout: function(sLayout) {
				return this.theFCLHasLayout(sLayout);
			},

			/**
			* Check for the visibility of the FCL action buttons
			* FCLActionButtons container visibility can't be checked here because it's always visible
			* even if all it's action button inside of it is hidden.
			* @param {boolean} bVisible - if true, then it checks if at least one action button inside
			* the FCLActionButtons container is visible.
			* if false, then it checks if all action button inside the FCLActionButtons container is hidden.
			* @param {string} sEntitySet The EntitySet of the currently visible UI (you only have to provide this
			* parameter when you are on a sub-ObjectPage)
			* @throws {Error} Throws an error if the FCLActionButtons not found on the page
			* @return {*} success or failure
			* @public
			*/
			iCheckFCLActionButtonsVisibility: function(bVisible, sEntitySet) {
				sEntitySet = sEntitySet ? sEntitySet : "";
				return this.waitFor({
					controlType: "sap.m.HBox",
					id:new RegExp(sEntitySet + "--template::FCLActionButtons$"),
					success: function(oControl) {
						var aHeaderActionButtons = oControl[0].getItems();
						for (var j = 0; j < aHeaderActionButtons.length; j++) {
							if (bVisible && aHeaderActionButtons[j].getVisible()) {
								Opa5.assert.ok(true, "FCL Action Button is visible");
								return null;
							} else if (!bVisible && aHeaderActionButtons[j].getVisible()) {
								Opa5.assert.notOk(true, "FCL Action Button: \"" + aHeaderActionButtons[j] + "\" should not be visible");
								return null;
							}
						}
						if (bVisible) {
							Opa5.assert.notOk(true, "FCL Action Button is not visible");
							return null;
						}
						Opa5.assert.ok(true, "FCL Action Button is not visible");
						return null;
					},
					errorMessage: "FCLActionButtons not found on the page"
				});
			},

			/**
			* Check for the visibility of a particular FCL Header action button
			* @param {object} oButton This object must be filled with the data needed to check the visibility of a particular FCL Header action button
			* against a given value true or false. Example: {fullScreen: true, exitFullScreen: false, closeColumn: false}
			* @param {string} sEntitySet The EntitySet of the currently visible UI (you only have to provide this
			* parameter when you are on a sub-ObjectPage)
			* @throws {Error} Throws an error if the FCLActionButtons not found on the page
			* @return {*} success or failure
			* @public
			*/
			iCheckFCLHeaderActionButtonsVisibility: function(oButton, sEntitySet) {
				sEntitySet = sEntitySet ? sEntitySet : "";
				return this.waitFor({
					controlType: "sap.m.HBox",
					id:new RegExp(sEntitySet + "--template::FCLActionButtons$"),
					matchers: new sap.ui.test.matchers.PropertyStrictEquals({
						name: "visible",
						value: true
					}),
					success: function(oControl) {
						var aHeaderActionButtons = oControl[0].getItems();
						var aButton = Object.keys(oButton);
						for (var i = 0; i < aButton.length; i++) {
							for (var j = 0; j < aHeaderActionButtons.length; j++) {
								if (aHeaderActionButtons[j].getId().indexOf(aButton[i]) !== -1) {
									if (aHeaderActionButtons[j].getVisible() !== oButton[aButton[i]]) {
										Opa5.assert.notOk(true, "Header Action Button: \"" + aButton[i] + "\" didn't match expectation");
										return null;
									}
									break;
								}
							}
						}
						Opa5.assert.ok(true, "Header Action Button did match the expectation");
						return null;
					},
					errorMessage: "FCLActionButtons not found"
				});
			},

			/**
			* Check for the a given FCLLayout parameter in the app url
			* @param {string} sValue: The value of expected FCLLayout parameter
			* if no sValue is provided means it will check that FCLLayout should not be present in url.
			* @return {*} success or failure
			* @public
			*/
			iCheckForFCLLayoutAppStateInUrl: function(sValue) {
				return this.waitFor({
					controlType: "sap.f.FlexibleColumnLayout",
					success: function() {
						var sUrl = Opa5.getWindow().location.href;
						var appStateString = sValue ? "FCLLayout=" + sValue : "FCLLayout";
						if (!sValue && sUrl.indexOf(appStateString) === -1) {
							Opa5.assert.ok(true, "There is no FCLLayout parameter in app url and is expected");
							return null;
						} else if (~sUrl.indexOf(appStateString)) {
							Opa5.assert.ok(true, "There is FCLLayout parameter in app url");
							return null;
						}
						Opa5.assert.notOk(true, "FCLLayout App State validation failed");
						return null;
					},
					errorMessage: "Probably FCL layout not found"
				});
			}
		};
	};
});
