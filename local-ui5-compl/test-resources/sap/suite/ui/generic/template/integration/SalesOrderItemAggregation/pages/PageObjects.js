sap.ui.define(["sap/ui/test/Opa5",
		"sap/suite/ui/generic/template/integration/Common/Common",
		"sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/pages/assertions/ListReportAssertions"
	],

	function (Opa5, Common, ListReportAssertions) {
		"use strict";

		Opa5.createPageObjects({
			onTheListReportPage: {
				baseClass: Common,
				assertions: ListReportAssertions()
			},
			onTheObjectPage: {
				baseClass: Common
			},
			onTheFLPPage: {
				baseClass: Common
			}
		});
	}
);
