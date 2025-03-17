sap.ui.define(["sap/ui/test/Opa5",
	"sap/suite/ui/generic/template/integration/Common/Common",
	"sap/suite/ui/generic/template/integration/demoFilterSettings/pages/assertions/ListReportAssertions"
],
	function (Opa5, Common, ListReportAssertions) {
		"use strict";
		var VIEWNAME = "ListReport";
		var VIEWNAMESPACE = "sap.suite.ui.generic.template.ListReport.view.";
		var PREFIX_ID = "demoFilterSettings::sap.suite.ui.generic.template.ListReport.view.ListReport::RootEntity--";
		Opa5.createPageObjects({
			onTheListReportPage: {
				baseClass: Common,
				assertions: ListReportAssertions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE)
			}
		});
	}
);