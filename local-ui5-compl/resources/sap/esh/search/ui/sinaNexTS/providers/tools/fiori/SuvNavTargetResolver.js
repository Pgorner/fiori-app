/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../../sina/SinaObject"],function(e){"use strict";const t=e["SinaObject"];const r=function(){const e=[];$.each(document.styleSheets,function(t,r){if(r.href){const t=r.href.toString();const s=/themes\/(.+)\/library.css/;const i=s.exec(t);if(i!==null){e.push(i[1]);return false}}return true});return e[0]};const s=function(e){let t=e;let s=r();if(!s){return t}s="sap-theme="+s+"&";if(e.indexOf("sap-theme=")===-1){if(e.indexOf("?")!==-1){t=e.replace("?","?"+s)}}return t};class i extends t{suvMimeType;suvViewerBasePath;constructor(e){super(e);this.suvMimeType="application/vnd.sap.universal-viewer+suv";this.suvViewerBasePath="/sap/bc/ui5_ui5/ui2/ushell/resources/sap/fileviewer/viewer/web/viewer.html?file="}addHighlightTermsToUrl(e,t){if(!t){return e}e+="&searchTerms="+encodeURIComponent(JSON.stringify({terms:t}));return e}resolveSuvNavTargets(e,t,r){for(const e in t){let i;const a=t[e];const n=a.suvThumbnailAttribute;if(a.suvTargetMimeTypeAttribute.value===this.suvMimeType){i=this.suvViewerBasePath+encodeURIComponent(a.suvTargetUrlAttribute.value);i=this.addHighlightTermsToUrl(i,r);i=s(i);n.setDefaultNavigationTarget(this.sina.createNavigationTarget({text:a.suvTargetUrlAttribute.value,targetUrl:i,target:"_blank"}))}else{i=a.suvTargetUrlAttribute.value;n.setDefaultNavigationTarget(this.sina.createNavigationTarget({text:a.suvTargetUrlAttribute.value,targetUrl:i,target:"_blank"}))}}}}var a={__esModule:true};a.SuvNavTargetResolver=i;return a})})();
//# sourceMappingURL=SuvNavTargetResolver.js.map