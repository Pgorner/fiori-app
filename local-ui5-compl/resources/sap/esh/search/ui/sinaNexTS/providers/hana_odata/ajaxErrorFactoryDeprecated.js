/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../../core/errors","../../sina/i18n"],function(e,r){"use strict";const s=e["ServerErrorCode"];const t=e["ServerError"];const o=r["getText"];function n(e,r){if(r.status!==500||!r.data){return}const n=r.dataJSON;if(!n){return}if(typeof n!=="object"){return}if(!n.code&&!n.message&&!n.details){return}const a=[];a.push(o("error.sina.searchServiceCallFailed"));if(n?.code){a.push(o("error.sina.errorCode",[n.code]))}if(n?.message){a.push(o("error.sina.errorMessage",[n.message]))}return new t({request:e,response:r,code:s.E001,message:a.join("\n"),details:""+n.details})}var a={__esModule:true};a.deprecatedAjaxErrorFactory=n;return a})})();
//# sourceMappingURL=ajaxErrorFactoryDeprecated.js.map