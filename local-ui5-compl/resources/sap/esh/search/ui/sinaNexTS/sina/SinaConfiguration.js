/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define([],function(){"use strict";var i=function(i){i["ABAP_ODATA"]="abap_odata";i["HANA_ODATA"]="hana_odata";i["INAV2"]="inav2";i["MULTI"]="multi";i["SAMPLE"]="sample";i["DUMMY"]="dummy";return i}(i||{});async function r(i){if(typeof i==="string"){i=i.trim();if(i.indexOf("/")>=0&&i.indexOf("Provider")<0&&i[0]!=="{"){i=require(i);return await r(i)}if(i[0]!=="{"){i='{ "provider" : "'+i+'"}'}i=JSON.parse(i)}return i}var e={__esModule:true};e.AvailableProviders=i;e._normalizeConfiguration=r;return e})})();
//# sourceMappingURL=SinaConfiguration.js.map