/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import { Value } from "sap/ui/core/theming/Parameters";
import { DEFAULT_BG_COLOR, LEGEND_COLORS, PAGE_SELECTION_LIMIT } from "./Constants";

class ColorUtils {
	private _oColorList!: { key: string; value: Value; assigned: boolean }[];

	constructor() {
		this._oColorList = LEGEND_COLORS().slice(0, PAGE_SELECTION_LIMIT);
	}

	/**
	 * Returns first unassigned color from the list
	 *
	 * @public
	 * @returns {string} color key of unassigned color
	 */
	public getFreeColor() {
		const oColor = this._oColorList.find((oColour) => !oColour.assigned);
		let sColor = DEFAULT_BG_COLOR().key;

		if (oColor) {
			oColor.assigned = true;
			sColor = oColor.key;
		}
		return sColor;
	}

	/**
	 * Marks color as assigned in the list
	 *
	 * @public
	 * @param {string} sKey color key
	 * @returns {object} color list instance for chaining
	 */
	addColor(sKey: string) {
		this._fetchColor(sKey).assigned = true;
		return this;
	}

	/**
	 * Marks color as unassigned in the list
	 *
	 * @public
	 * @param {string} sKey color key
	 * @returns {object} color list instance for chaining
	 */
	removeColor(sKey: string) {
		this._fetchColor(sKey).assigned = false;
		return this;
	}

	/**
	 * Fetch Color Object from the list
	 *
	 * @private
	 * @param {string} sKey color key
	 * @returns {object} color Object, if found
	 */
	_fetchColor(sKey: string): { assigned: boolean } {
		return (
			this._oColorList.find(function (oColour) {
				return oColour.key === sKey;
			}) || { assigned: false }
		);
	}

	/**
	 * Getter for Color List
	 *
	 * @private
	 * @returns {object} color list object
	 */
	_getColorMap() {
		return this._oColorList;
	}
}

export default new ColorUtils();
