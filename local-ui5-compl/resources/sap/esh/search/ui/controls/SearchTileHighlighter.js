/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["sap/esh/search/ui/SearchHelper","sap/base/security/encodeXML","sap/ui/core/hyphenation/Hyphenation"],function(e,t,i){"use strict";const h=e["Tester"];const s=e;class n{_softHyphenRegExp;tester;constructor(){this._softHyphenRegExp=new RegExp("[­]","g")}setHighlightTerms(e){this.tester=new h(e,"sapUshellSearchHighlight",true,"or")}highlight(e){const t=e.getDomRef();if(!t){return}const h=i.getInstance();if(!h.isLanguageInitialized()){h.initialize().then(function(){this.doHighlight(t)}.bind(this),function(){this.doHighlight(t)}.bind(this))}else{this.doHighlight(t)}}doHighlight(e){if(e.nodeType===window.Node.TEXT_NODE){this.highlightTextNode(e);return}for(let t=0;t<e.childNodes.length;++t){const i=e.childNodes[t];this.doHighlight(i)}}removeSoftHyphens(e){return e.replace(this._softHyphenRegExp,"")}highlightTextNode(e){const i=this.tester.test(this.removeSoftHyphens(e.textContent));if(!i.bMatch){return}const h=document.createElement("span");h.innerHTML=t(i.sHighlightedText);s.boldTagUnescaper(h,"sapUshellSearchHighlight");e.parentNode.insertBefore(h,e);e.parentNode.removeChild(e)}}var o={__esModule:true};o.Highlighter=n;return o})})();
//# sourceMappingURL=SearchTileHighlighter.js.map