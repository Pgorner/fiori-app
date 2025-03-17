/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var e=function(e){e[e["ERROR"]=1]="ERROR";e[e["WARN"]=2]="WARN";e[e["INFO"]=3]="INFO";e[e["DEBUG"]=4]="DEBUG";return e}(e||{});class r{static level=(()=>e.ERROR)();static persistency=(()=>console)();constructor(e="default-log"){this.name=e}debug(e){this.printMessageOrError("DEBUG",e)}info(e){this.printMessageOrError("INFO",e)}warn(e){this.printMessageOrError("WARN",e)}error(e){this.printMessageOrError("ERROR",e)}printMessageOrError(e,r){if(r instanceof Error){if(r.stack){this.printMessage(e,r.stack)}else{this.printMessage(e,r+"")}}else{this.printMessage(e,r)}}printMessage(s,t){const n=e[s];const i="["+this.name+"]: "+t;if(n<=r.level){switch(n){case e.DEBUG:{if(typeof r.persistency.debug==="function"){r.persistency.debug(i);return}}break;case e.INFO:{if(typeof r.persistency.info==="function"){r.persistency.info(i);return}}break;case e.WARN:{if(typeof r.persistency.warn==="function"){r.persistency.warn(i);return}}break;case e.ERROR:{if(typeof r.persistency.error==="function"){r.persistency.error(i);return}}}console.log(i)}}}var s={__esModule:true};s.Severity=e;s.Log=r;return s})})();
//# sourceMappingURL=Log.js.map