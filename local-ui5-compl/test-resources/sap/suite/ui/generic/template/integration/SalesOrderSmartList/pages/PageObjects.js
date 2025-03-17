sap.ui.define(["sap/ui/test/Opa5",
		"sap/suite/ui/generic/template/integration/Common/Common",
        "sap/suite/ui/generic/template/integration/SalesOrderSmartList/pages/actions/ListReportActions",
        "sap/suite/ui/generic/template/integration/SalesOrderSmartList/pages/assertions/ListReportAssertions"
    ],
	function (Opa5, Common, ListReportActions, ListReportAssertions) {
		"use strict";
        var VIEWNAME = "ListReport";
		var VIEWNAMESPACE = "sap.suite.ui.generic.template.ListReport.view.";
		var PREFIX_ID = "SalesOrderSmartList::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--";
		Opa5.createPageObjects({
			onTheListReportPage: {
				baseClass: Common,
                actions: ListReportActions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE),
				assertions: ListReportAssertions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE)
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