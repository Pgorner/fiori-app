/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/esh/search/ui/SearchHelper", "sap/base/security/encodeXML", "sap/ui/core/hyphenation/Hyphenation"], function (sap_esh_search_ui_SearchHelper, encodeXml, Hyphenation) {
  "use strict";

  const Tester = sap_esh_search_ui_SearchHelper["Tester"];
  const SearchHelper = sap_esh_search_ui_SearchHelper;
  /**
   * @namespace sap.esh.search.ui.controls
   */
  class Highlighter {
    _softHyphenRegExp;
    tester;
    constructor() {
      this._softHyphenRegExp = new RegExp("[\u00ad]", "g");
    }
    setHighlightTerms(highlightTerms) {
      this.tester = new Tester(highlightTerms, "sapUshellSearchHighlight", true, "or");
    }
    highlight(tileView) {
      const node = tileView.getDomRef();
      if (!node) {
        return;
      }
      const oHyphenation = Hyphenation.getInstance();
      if (!oHyphenation.isLanguageInitialized()) {
        oHyphenation.initialize().then(function () {
          this.doHighlight(node);
        }.bind(this), function () {
          this.doHighlight(node);
        }.bind(this));
      } else {
        this.doHighlight(node);
      }
    }
    doHighlight(node) {
      if (node.nodeType === window.Node.TEXT_NODE) {
        this.highlightTextNode(node);
        return;
      }
      for (let i = 0; i < node.childNodes.length; ++i) {
        const child = node.childNodes[i];
        this.doHighlight(child);
      }
    }
    removeSoftHyphens(text) {
      return text.replace(this._softHyphenRegExp, "");
    }
    highlightTextNode(node) {
      // check for match
      const testResult = this.tester.test(this.removeSoftHyphens(node.textContent));
      if (!testResult.bMatch) {
        return;
      }
      // match -> replace dom node
      const spanNode = document.createElement("span");
      spanNode.innerHTML = encodeXml(testResult.sHighlightedText);
      SearchHelper.boldTagUnescaper(spanNode, "sapUshellSearchHighlight");
      node.parentNode.insertBefore(spanNode, node);
      node.parentNode.removeChild(node);
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.Highlighter = Highlighter;
  return __exports;
});
})();