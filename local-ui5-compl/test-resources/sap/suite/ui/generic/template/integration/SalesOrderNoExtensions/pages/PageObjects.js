sap.ui.define(["sap/ui/test/Opa5",
		"sap/suite/ui/generic/template/integration/Common/Common",
		"sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/pages/actions/ObjectPageActions",
		"sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/pages/assertions/ObjectPageAssertions"],

	function (Opa5, Common, ObjectPageActions, ObjectPageAssertions) {
		"use strict";

		var OP_VIEWNAME = "Details";
		var OP_VIEWNAMESPACE = "sap.suite.ui.generic.template.ObjectPage.view.";
		var OP1_PREFIX_ID = "SOwoExt::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrder_WD_20--";

		Opa5.createPageObjects({
			onTheListReportPage: {
				baseClass: Common
			},
			onTheObjectPage: {
				baseClass: Common,
				actions: ObjectPageActions(OP1_PREFIX_ID, OP_VIEWNAME, OP_VIEWNAMESPACE),
				assertions: ObjectPageAssertions(OP1_PREFIX_ID, OP_VIEWNAME, OP_VIEWNAMESPACE)
			},
			onTheSubObjectPage: {
				baseClass: Common
			},
			onTheFLPPage: {
				baseClass: Common
			}
		});
	}
);
