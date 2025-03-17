sap.ui.define(
	["sap/fe/core/PageController", "sap/fe/core/controllerextensions/Share", "./ShareExtend"],
	function (PageController, Share, ShareExtend) {
		"use strict";

		return PageController.extend("sap.fe.core.fpmExplorer.Share", {
			share: Share.override(ShareExtend)
		});
	}
);
