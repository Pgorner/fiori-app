/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

sap.ui.define(
	[
		"sap/ui/comp/smartfield/SmartField"
	],
	function(
		SmartField
	) {
		"use strict";

		/**
		 * Constructor for a new SmartField test wrapper.
		 *
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @extends sap.ui.comp.smartfield.SmartField
		 *
		 * @author SAP SE
		 * @version 1.132.1
		 *
		 * @constructor
		 * @private
		 * @alias sap.ui.comp.test.qunit.smartfield.SmartFieldTestWrapper
		 */
		var SFTestWrapper = SmartField.extend("sap.ui.comp.test.qunit.smartfield.SmartFieldTestWrapper", {
			metadata: {
				library : "sap.ui.comp"
			},

			renderer: SmartField.getMetadata().getRenderer()
		});

		/**
		 * Promise resolves when the control is rendered in its final state after
		 * all re-renderings.
		 * @returns {Promise}
		 */
		SFTestWrapper.prototype.getTestReadyPromise = function () {
			return new Promise(function (fnSuccess /*, fnReject */) {
				var oTimeout;
				this.attachInnerControlsCreated(function () {
					if (oTimeout) {
						clearTimeout(oTimeout);
					}
					oTimeout = setTimeout(fnSuccess, 50);
				});
			}.bind(this));
		};

		return SFTestWrapper;
	}, false /* No export */);
