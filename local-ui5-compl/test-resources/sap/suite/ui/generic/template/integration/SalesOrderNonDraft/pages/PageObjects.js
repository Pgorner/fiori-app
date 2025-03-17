sap.ui.define(["sap/ui/test/Opa5", "sap/suite/ui/generic/template/integration/Common/Common"],

	function (Opa5, Common) {
		"use strict";

		Opa5.createPageObjects({
			onTheListReportPage: {
				baseClass: Common
			},
			onTheObjectPage: {
				baseClass: Common
			},
			onTheSubObjectPage: {
				baseClass: Common
			}
		});
	}
);
