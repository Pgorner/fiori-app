sap.ui.define(["sap/ui/test/Opa5",
		"sap/suite/ui/generic/template/integration/Common/Common",
		"sap/suite/ui/generic/template/integration/SalesOrderTableTabs/pages/assertions/ListReportAssertions"],

	function (Opa5, Common, ListReportAssertions) {
		"use strict";

		var LR_PREFIX_ID = "ManageSalesOrderWithTableTabs::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--";

		Opa5.createPageObjects({
			onTheListReportPage: {
				baseClass: Common,
				assertions: ListReportAssertions(LR_PREFIX_ID)
			}
		});
	}
);
