// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define(function () {
	"use strict";

	function getQueryString (sURL) {
		const iHash = sURL.indexOf("#");
		if (iHash >= 0) {
			sURL = sURL.slice(0, iHash);
		}
		const iSearch = sURL.indexOf("?");
		if (iSearch >= 0) {
			return sURL.slice(iSearch + 1);
		}
		return "";
	}

	/**
	 * @private
	 * @ui5-restricted sap.ushell
	 */
	class UriParameters extends URLSearchParams {
		#mParams;
		constructor (sURL) {
			super(getQueryString(sURL));
		}
		/* eslint-disable accessor-pairs */
		get mParams () {
			if (this.#mParams === null || this.#mParams === undefined) {
				this.#mParams = Array.from(this.keys()).reduce((oResult, sParam) => {
					oResult[sParam] = this.getAll(sParam);
					return oResult;
				}, Object.create(null));
			}
			return this.#mParams;
		}
		/* eslint-enable accessor-pairs */
		static fromURL (sURL) {
			return new UriParameters(sURL);
		}
	}

	return UriParameters;
});
