sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel) {
	"use strict";

	// Please order topics alphabetically by "title"
	const jsonModel = new JSONModel();
	let isLoaded = false;
	return {
		init: async function () {
			if (!isLoaded) {
				await jsonModel.loadData("./model/macroNavigationModel.json", {}, true);
				isLoaded = true;
			}
			return jsonModel;
		}
	};
});
