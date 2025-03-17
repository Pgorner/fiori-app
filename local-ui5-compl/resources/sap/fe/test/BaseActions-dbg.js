/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/FEBuilder", "sap/fe/test/Utils"],
	function (Opa5, OpaBuilder, FEBuilder, Utils) {
		"use strict";

		/**
		 * Constructs a new {@link sap.fe.test.Opa5} instance.
		 * @class All common actions (<code>When</code>) for all Opa tests are defined here.
		 * @alias sap.fe.test.BaseActions
		 * @public
		 */
		var BaseActions = Opa5.extend("sap.fe.test.BaseActions", {
			/**
			 * Closes the open popover via function.
			 *
			 * NOTE: This function ensures that a certain UI state is maintained in some exceptional cases.
			 * This function isn't usually called directly in a journey.
			 * @returns {sap.ui.test.OpaBuilder} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
			 * @function
			 * @name sap.fe.test.BaseActions#iClosePopover
			 * @public
			 */
			iClosePopover: function () {
				return FEBuilder.createClosePopoverBuilder(this).description("Closing open popover").execute();
			},
			/**
			 * Simulates the pressing of the Esc key for the element in focus.
			 * @returns {sap.ui.test.OpaBuilder} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
			 * @function
			 * @name sap.fe.test.BaseActions#iPressEscape
			 * @public
			 */
			iPressEscape: function () {
				return FEBuilder.create(this)
					.has(FEBuilder.Matchers.FOCUSED_ELEMENT)
					.do(FEBuilder.Actions.keyboardShortcut("Escape"))
					.description("Pressing escape button")
					.execute();
			},
			/**
			 * Waits for the specified amount of milliseconds.
			 *
			 * NOTE: Use this function with care, as waiting for a specified timeframe only makes sense in exceptional cases.
			 * @param {number} iMilliseconds The amount of milliseconds to wait before proceeding
			 * @returns {sap.ui.test.OpaBuilder} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
			 * @function
			 * @name sap.fe.test.BaseActions#iWait
			 * @private
			 */
			iWait: function (iMilliseconds) {
				var bWaitingPeriodOver = false,
					bFirstTime = true;
				return FEBuilder.create(this)
					.check(function () {
						if (bFirstTime) {
							bFirstTime = false;
							setTimeout(function () {
								bWaitingPeriodOver = true;
							}, iMilliseconds);
						}
						return bWaitingPeriodOver;
					})
					.description(Utils.formatMessage("Waiting for '{0}' milliseconds ", iMilliseconds))
					.execute();
			},
			/**
			 * Emulates a browser back navigation.
			 *
			 * NOTE: If the application is executed within the FLP, use {@link sap.fe.test.Shell#iNavigateBack} instead.
			 * @returns {sap.ui.test.OpaBuilder} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
			 * @function
			 * @name sap.fe.test.BaseActions#iNavigateBack
			 * @private
			 */
			iNavigateBack: function () {
				return OpaBuilder.create(this)
					.viewId(null)
					.do(function () {
						Opa5.getWindow().history.back();
					})
					.description("Navigating back via browser back")
					.execute();
			},
			/**
			 * Emulates a browser forward navigation.
			 * @returns {sap.ui.test.OpaBuilder} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
			 * @function
			 * @name sap.fe.test.BaseActions#iNavigateForward
			 * @private
			 */
			iNavigateForward: function () {
				return OpaBuilder.create(this)
					.viewId(null)
					.do(function () {
						Opa5.getWindow().history.forward();
					})
					.description("Navigating back via browser forward")
					.execute();
			},
			/**
			 * Changes the timeout to the specified amount of seconds.
			 * The new timeout will be active for all waitFor calls to follow until a new timeout is set.
			 * @param {number} iSeconds The amount of seconds to be set for the timeout
			 * @returns {sap.ui.test.OpaBuilder} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
			 * @function
			 * @name sap.fe.test.BaseActions#iChangeTimeout
			 * @private
			 */
			iChangeTimeout: function (iSeconds) {
				Opa5.extendConfig({
					timeout: iSeconds
				});
				return (
					FEBuilder.create(this)
						.check(function () {
							return true;
						})
						// .hasId("This.Id.does.not.exist")
						.description(Utils.formatMessage("Timeout set to '{0}' seconds ", iSeconds))
						.execute()
				);
			}
		});
		BaseActions._dummy = function () {}; // dummy to avoid eslint from removing the "var BaseActions" / "return BaseActions" construct - otherwise the JSDoc would not be created
		return BaseActions;
	}
);
