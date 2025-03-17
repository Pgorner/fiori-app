/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var n={},t=null;n.SEMANTIC_CLASS_NAME={BACKGROUND:"backgroundSemanticColor",BORDER:"borderSemanticColor",TEXT:"textSemanticColor",FILL:"fillSemanticColor",STROKE:"strokeSemanticColor"};n.find=function(n,t,e){var r;if(typeof n.find==="function"){return n.find(t,e)}else{for(r=0;r<n.length;r++){if(t.call(e,n[r],r,n)){return n[r]}}return undefined}};n.trimText=function(n,t){if(n&&n.length>t){return n.substring(0,t)+" ... "}return n};n.throttle=(n,e)=>(...r)=>{if(t===null){n(...r);t=setTimeout(()=>{t=null},e)}};return n},true);
//# sourceMappingURL=Utils.js.map