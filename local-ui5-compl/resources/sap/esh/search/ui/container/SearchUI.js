/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.require(["sap/esh/search/ui/SearchCompositeControl","sap/esh/search/ui/sinaNexTS/core/errors"],async function(e,o){let r;const n={applicationComponent:"HAN-AS-INA-UI",enableMultiSelectionResultItems:true,sinaConfiguration:{provider:"sample"}};r=new e(n);const t=await r.getInitializationStatus();if(t&&t.success===false&&t.error instanceof o.NoValidEnterpriseSearchAPIConfigurationFoundError&&t.error.previous instanceof o.ESHNoBusinessObjectDatasourceError){console.error("Error creating SearchCompositeControl: ",t.error.previous.message)}window.addEventListener("hashchange",function(){r.parseURL()},false);r.placeAt("content")});document.documentElement.style.overflowY="auto";document.documentElement.style.height="100%"})();
//# sourceMappingURL=SearchUI.js.map