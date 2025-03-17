/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Element",
	"sap/gantt/thirdparty/d3fc-discontinuous-scale"
], function (Element) {
	"use strict";

	/**
	 * Creates and initializes a new class for skip time pattern.
	 *
	 * @param {string} [sId] ID of the new control. The ID is generated automatically if it is not provided.
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Enables the user to define skip time pattern.
	 *
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 * @since 1.126
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.skipTime.SkipPattern
	 */

	var SkipPattern = Element.extend("sap.gantt.skipTime.SkipPattern", /** @lends sap.gantt.skipTime.SkipPattern.prototype */ {
		metadata: {
			library: "sap.gantt",
			"abstract": true
		}
	});

	/**
	 * Returns the discontinuity provider of the skip pattern. Default value is null
	 * @return {sap.gantt.skipTime.DiscontinuousProvider} Discontinuity provider of the skip pattern
	 * @public
	 */
	SkipPattern.prototype.getDiscontinuityProvider = function () {
		return null;
	};

	/**
	 * Updates the discontinuity provider for the gantt chart timeline.
	 * @param {sap.gantt.skipTime.DiscontinuousProvider} oDiscontinuousProvider Discontinuous provider to be set
	 * @param {Boolean} bSuppressInvalidate Flag to suppress re-rendering of the control.
	 * @public
	 */
	SkipPattern.prototype.updateDiscontinuousProvider = function (oDiscontinuousProvider, bSuppressInvalidate) {
		var oAxisTimeStrategy = this.getParent();
		if (oAxisTimeStrategy) {
			delete oAxisTimeStrategy._nGanttVisibleWidth;
			oAxisTimeStrategy.setProperty("_discontinuousProvider", oDiscontinuousProvider, bSuppressInvalidate);
		}
	};

	/**
	 * @param {object} oLocale locale value to set
	 * @private
	 */
	SkipPattern.prototype.setLocale = function (oLocale) {
		this._oLocale = oLocale;
	};

	/**
	 * @private
	 * @returns {object} returns the current locale;
	 */
	SkipPattern.prototype.getLocale = function () {
		return this._oLocale;
	};

	/**
	 * @private
	 * @returns {string} returns the current timezone;
	 */
	SkipPattern.prototype._getTimezone = function () {
		return this._sTimezone;
	};

	/**
	 * @param {string} sTimezone timezone to set
	 * @private
	 */
	SkipPattern.prototype._setTimezone = function (sTimezone) {
		if (sTimezone === null) {
			sTimezone = undefined;
		}

		if (this._sTimezone !== sTimezone) {
			this._sTimezone = sTimezone;

			this.updateDiscontinuousProvider(this.getDiscontinuityProvider());
		}
	};

	/**
	 * @returns {object} cloned locale
	 * @private
	 */
	SkipPattern.prototype.clone = function () {
		const oClone = Element.prototype.clone.apply(this, arguments);
		const oLocale = this.getLocale();

		if (oLocale) {
			oClone.setLocale(oLocale);
		}

		oClone._sTimezone = this._sTimezone;

		return oClone;
	};

	return SkipPattern;
});
