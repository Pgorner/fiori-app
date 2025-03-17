(() => {
	"use strict";

	// The connector to be used can be defined in the 'params' attribute of the script; default is LocalStorageConnector
	let sConnectorsConfig = '[{"connector":"KeyUserConnector","url":"/flexKeyuser"}, {"connector":"PersonalizationConnector","url":"/flexPersonalization"}]';
	const oParams = JSON.parse(document.currentScript.getAttribute('params'));
	if (!oParams || oParams.localConnector) {
		sConnectorsConfig = '[{"connector": "LocalStorageConnector"}]';
	}

	// The paths for the ushell sandbox and sap-ui-core must be relative because the app runs on different environments
	const sPathPrefix = "../../../../../../../..";
	document.write(`<script src="${sPathPrefix}/resources/sap/ushell/bootstrap/sandbox2.js" id="sap-ushell-bootstrap"></script>`);

	document.write(`<script src="${sPathPrefix}/resources/sap-ui-core.js"'
			id="sap-ui-bootstrap"
			data-sap-ui-theme="sap_horizon"
			data-sap-ui-language="en"
			data-sap-ui-noConflict="true"
			data-sap-ui-async="true"
			data-sap-ui-resourceroots='{
				"sap.ui.demoapps.rta.fev4": "../",
				"local": "./"
			}'
			data-sap-ui-libs="sap.m, sap.ushell, sap.fe.templates, sap.ui.rta"
			data-sap-ui-xx-bindingSyntax="complex"
			data-sap-ui-flexibilityServices='${sConnectorsConfig}'
			data-sap-ui-onInit="module:local/initModule"
		></script>`
	);
	document.write(`<script src="${sPathPrefix}/test-resources/sap/ushell/bootstrap/standalone.js" id="sap-ushell-bootstrap"></script>`);
})();