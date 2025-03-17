/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../../core/errors","../../sina/i18n"],function(r,e){"use strict";const o=r["ServerErrorCode"];const n=r["ServerError"];const t=e["getText"];function i(r,e){if(!e.data){return}const i=e.dataJSON;if(!i){return}if(typeof i!=="object"){return}if(!i?.error?.code){return}const s=[];s.push(t("error.sina.generalServerError2"));s.push(t("error.sina.errorCode",[i.error.code]));if(i?.error?.message?.value){const r=i.error.message.value.trim();s.push(r)}const a=[];if(i?.error?.innererror){const r=i?.error?.innererror;if(r?.application?.component_id){a.push(t("error.sina.applicationComponent",[r?.application?.component_id]))}if(r?.Error_Resolution?.SAP_Note){a.push(t("error.sina.solutionNote",[r?.Error_Resolution?.SAP_Note]))}}return new n({request:r,response:e,code:o.E001,message:s.join("\n"),details:a.join("\n")})}var s={__esModule:true};s.ajaxErrorFactory=i;return s})})();
//# sourceMappingURL=ajaxErrorFactory.js.map