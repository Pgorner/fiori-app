sap.ui.define([], function() {
	"use strict";
	const sContentPagesPath = "../../../../../../../sap/ui/demoapps/demokit/rta/test/integration/IFrameContent/";
	const sProduct1 = "HT-1000";
	const sProduct2 = "HT-1001";
	const sProduct1OfficeSupplies = "AR-FB-1013";
	const sProduct2OfficeSupplies = "WD-ERS-1005";
	const sUrl = new URL(sContentPagesPath, document.location.href).href;

	return {
		// Non-parameterized URL
		genericURL: sUrl + "IFrameContentTest.html",
		testPageTitle: "IFrame Test Page",

		// Parameterized URLs
		product1: sProduct1,
		product1OfficeSupplies: sProduct1OfficeSupplies,
		product2: sProduct2,
		product2OfficeSupplies: sProduct2OfficeSupplies,
		productParameterURL: sUrl + "{Product}.html",
		identifierParameterURL: sUrl + "{identifier}.html",
		product1URL: sUrl + sProduct1 + ".html",
		product1OfficeSuppliesURL: sUrl + sProduct1OfficeSupplies + ".html",
		product2URL: sUrl + sProduct2 + ".html",
		product2OfficeSuppliesURL: sUrl + sProduct2OfficeSupplies + ".html",

		// IFrame Dialog IDs
		URLTextAreaId: "sapUiRtaAddIFrameDialog_EditUrlTA",
		titleFieldId: "sapUiRtaAddIFrameDialog_ContainerTitle_TitleInput",
		heightFieldId: "sapUiRtaAddIFrameDialog_HeightInput"
	};
});

