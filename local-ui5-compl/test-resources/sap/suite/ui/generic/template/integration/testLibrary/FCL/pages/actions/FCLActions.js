/*** FCL actions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/Opa5"],
	function (PropertyStrictEquals, Opa5) {
		"use strict";
		return function () {
			return {

				/**
				* Click on the FCL Action button which is provided 
				*
				* @param {String} sButtonId Id of the FCL Action button. Available buttons are ["fullScreen", "exitFullScreen", "closeColumn"]
				* @throws {Error} Throws an error if the FCL Action button could not be found or not enabled on the UI
				* @return {*} success or failure
				* @public
				*/
				iClickTheFCLActionButton: function (sButtonId) {
					var availableFCLActionButton = ["fullScreen", "exitFullScreen", "closeColumn"];
					if (availableFCLActionButton.indexOf(sButtonId) === -1) {
						Opa5.assert.notOk(true, "Provided clickable button id is wrong");
					}
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageHeaderActionButton",
						id: new RegExp(sButtonId + "$"),
						matchers: [
							new PropertyStrictEquals({
								name: "visible",
								value: true
							}),
							new PropertyStrictEquals({
								name: "enabled",
								value: true
							})
						],
						actions: function(oButton) {
							oButton.firePress();
							Opa5.assert.ok(true, "FCL Action Button: \"" + sButtonId + "\" clicked successfully");
						},
						errorMessage: "The button with id: \"" + sButtonId + "\" is either not enabled or visible"
					});
				},

				/**
				* Set the FCL Layout with the given value
				*
				* @param {String} sLayout Layout to be set
				* @throws {Error} Throws an error if the FlexibleColumnLayout not found on the screen 
				* @return {*} success or failure
				* @public
				*/
				iSetTheFCLLayout: function (sLayout) {
					return this.waitFor({
						controlType: "sap.f.FlexibleColumnLayout",
						actions: function (oFlexibleColumnLayout) {
							oFlexibleColumnLayout.setLayout(sLayout);
							Opa5.assert.ok(true, "FCL Layout '" + sLayout + "' is set successfully");
						},
						errorMessage: "Did not find the FlexibleColumnLayout"
					});
				}
			};
		};
});
