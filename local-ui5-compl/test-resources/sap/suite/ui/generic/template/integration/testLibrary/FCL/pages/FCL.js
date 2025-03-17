sap.ui.define(["sap/ui/test/Opa5", "sap/suite/ui/generic/template/integration/testLibrary/FCL/pages/assertions/FCLAssertion",
	"sap/suite/ui/generic/template/integration/testLibrary/FCL/pages/actions/FCLActions",
	"sap/suite/ui/generic/template/integration/testLibrary/utils/Common"],

	function(Opa5, FCLAssertion, FCLActions, Common) {

	"use strict";

	Opa5.createPageObjects({
		onTheGenericFCLApp: {
			baseClass: Common,
			actions: FCLActions(),
			assertions: FCLAssertion()
		}
	});
});
