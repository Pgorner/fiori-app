/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.require(["sap/esh/search/ui/SearchCompositeControl", "sap/esh/search/ui/sinaNexTS/core/errors"], async function (SearchCompositeControl, errors) {
  let eshComp;
  const options = {
    // see SearchCompositeControl.ts and SearchConfigurationSettings.ts for available options
    applicationComponent: "HAN-AS-INA-UI",
    enableMultiSelectionResultItems: true,
    sinaConfiguration: {
      provider: "sample"
    }
  };
  eshComp = new SearchCompositeControl(options);
  const status = await eshComp.getInitializationStatus();
  if (status && status.success === false && status.error instanceof errors.NoValidEnterpriseSearchAPIConfigurationFoundError && status.error.previous instanceof errors.ESHNoBusinessObjectDatasourceError) {
    console.error("Error creating SearchCompositeControl: ", status.error.previous.message);
  }
  window.addEventListener("hashchange", function () {
    eshComp.parseURL();
  }, false);
  eshComp.placeAt("content");
});
document.documentElement.style.overflowY = "auto";
document.documentElement.style.height = "100%";
})();