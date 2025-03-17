sap.ui.define(["sap/ui/test/Opa5",
		"sap/suite/ui/generic/template/integration/Common/Common",
		"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/pages/actions/ListReportActions",
		"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/pages/assertions/ListReportAssertions"],

	function (Opa5, Common, ListReportActions, ListReportAssertions) {
		"use strict";

		Opa5.createPageObjects({
			onTheListReportPage: {
				baseClass: Common,
				actions: ListReportActions(),
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
