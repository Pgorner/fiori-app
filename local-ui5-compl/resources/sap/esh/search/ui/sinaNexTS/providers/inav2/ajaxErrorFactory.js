/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../../core/errors","../../sina/i18n"],function(r,e){"use strict";const s=r["ServerErrorCode"];const o=r["ServerError"];const t=e["getText"];function n(r,e){if(!e?.data){return}const n=e.dataJSON;if(!n){return}if(typeof n!=="object"){return}if(!n?.Error?.Code||!n?.Error?.Message){return}const a=[];if(n?.ErrorDetails){for(let r=0;r<n.ErrorDetails.length;++r){const e=n.ErrorDetails[r];a.push(e.Code+": "+e.Message)}}if(n?.Messages){for(let r=0;r<n.Messages.length;++r){const e=n.Messages[r];a.push(e.Number+": "+e.Text+" ("+e.Type+")")}}return new o({request:r,response:e,code:s.E001,message:t("error.sina.serverError",[n.Error.Code,n.Error.Message]),details:a.join("\n")})}var a={__esModule:true};a.ajaxErrorFactory=n;return a})})();
//# sourceMappingURL=ajaxErrorFactory.js.map