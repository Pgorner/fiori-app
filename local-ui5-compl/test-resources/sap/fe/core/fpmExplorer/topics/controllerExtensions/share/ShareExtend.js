sap.ui.define([], function () {
	"use strict";

	return {
		adaptShareMetadata: function (oShareData) {
			oShareData.email.title = "Email Subject";
			return oShareData;
		}
	};
});
