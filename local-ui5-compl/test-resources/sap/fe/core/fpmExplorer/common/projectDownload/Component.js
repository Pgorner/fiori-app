sap.ui.define(
	[
		"sap/fe/core/AppComponent" //,
		//	"sap/ui/core/routing/HashChanger"
	],
	function (
		Component //,
		//HashChanger
	) {
		"use strict";

		return Component.extend("##appid##.Component", {
			metadata: {
				manifest: "json"
			} //,
			//init: function () {
			//	var hashChanger = new HashChanger();
			//	hashChanger.replaceHash("##hash##");
			//	Component.prototype.init.apply(this, arguments);
			//}
			//##hashChanger##
		});
	}
);
