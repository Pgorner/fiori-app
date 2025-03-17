sap.ui.define(["sap/ui/base/Object"], function(BaseObject) {
	"use strict";
	var NavError = BaseObject.extend("sap.ui.comp.sample.NavError",
	{
		metadata: {
			publicMethods: [
				// getter methods of properties
				"getErrorCode"
			],
			properties: {},
			library: "sap.ui.generic.app"
		},
		constructor: function(sErrorCode) {
			BaseObject.apply(this);

			this._sErrorCode = sErrorCode;
		}
	});
    NavError.prototype.getErrorCode = function() {
		return this._sErrorCode;
	};
	// final step for library
	return NavError;
});