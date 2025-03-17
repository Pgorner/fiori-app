sap.ui.define(["sap/ui/test/Opa5", "sap/suite/ui/generic/template/integration/SalesOrderItemEditableFieldFor/pages/assertions/ListReportAssertions"],
	function (Opa5, ListReportAssertions) {
		"use strict";

		var LR_VIEWNAME = "ListReport";
		var LR_VIEWNAMESPACE = "sap.suite.ui.generic.template.ListReport.view.";
		var LR_PREFIX_ID = "SalesOrderItemEditableFieldFor::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrderItem_WD_20--";

		Opa5.createPageObjects({
			onTheListReportPage: {
				assertions: ListReportAssertions(LR_PREFIX_ID, LR_VIEWNAME, LR_VIEWNAMESPACE)
			}
		});
	});
