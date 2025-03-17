/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../../sina/SinaObject"], function (_____sina_SinaObject) {
  "use strict";

  /* global $ */
  const SinaObject = _____sina_SinaObject["SinaObject"];
  /*
  var curTheme = "";
  var getCurrentTheme = function () {
      if (!curTheme) {
          curTheme = getTheme();
      }
      return curTheme;
  };
  */
  const getTheme = function () {
    const themes = [];
    $.each(document.styleSheets, function (index, cssFile) {
      if (cssFile.href) {
        const fname = cssFile.href.toString();
        const regex = /themes\/(.+)\/library.css/;
        const matches = regex.exec(fname);
        if (matches !== null) {
          themes.push(matches[1]);
          return false; //jquery syntax for 'break'
        }
      }
      return true;
    });
    return themes[0];
  };
  const addThemeToURL = function (url) {
    let res = url;
    let theme = getTheme();
    if (!theme) {
      return res;
    }
    theme = "sap-theme=" + theme + "&";
    if (url.indexOf("sap-theme=") === -1) {
      if (url.indexOf("?") !== -1) {
        res = url.replace("?", "?" + theme);
      }
    }
    return res;
  };
  class SuvNavTargetResolver extends SinaObject {
    suvMimeType;
    suvViewerBasePath;
    constructor(properties) {
      super(properties);
      this.suvMimeType = "application/vnd.sap.universal-viewer+suv";
      this.suvViewerBasePath = "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/fileviewer/viewer/web/viewer.html?file=";
    }
    addHighlightTermsToUrl(url, highlightTerms) {
      if (!highlightTerms) {
        return url;
      }
      url += "&searchTerms=" + encodeURIComponent(JSON.stringify({
        terms: highlightTerms
      }));
      return url;
    }
    resolveSuvNavTargets(dataSource, suvAttributes, suvHighlightTerms) {
      for (const suvAttributeName in suvAttributes) {
        let openSuvInFileViewerUrl;
        const suvAttribute = suvAttributes[suvAttributeName];
        const thumbnailAttribute = suvAttribute.suvThumbnailAttribute;
        if (suvAttribute.suvTargetMimeTypeAttribute.value === this.suvMimeType) {
          openSuvInFileViewerUrl = this.suvViewerBasePath + encodeURIComponent(suvAttribute.suvTargetUrlAttribute.value);
          openSuvInFileViewerUrl = this.addHighlightTermsToUrl(openSuvInFileViewerUrl, suvHighlightTerms);
          openSuvInFileViewerUrl = addThemeToURL(openSuvInFileViewerUrl);
          thumbnailAttribute.setDefaultNavigationTarget(this.sina.createNavigationTarget({
            text: suvAttribute.suvTargetUrlAttribute.value,
            targetUrl: openSuvInFileViewerUrl,
            target: "_blank"
          }));
        } else {
          openSuvInFileViewerUrl = suvAttribute.suvTargetUrlAttribute.value;
          thumbnailAttribute.setDefaultNavigationTarget(this.sina.createNavigationTarget({
            text: suvAttribute.suvTargetUrlAttribute.value,
            targetUrl: openSuvInFileViewerUrl,
            target: "_blank"
          }));
        }
      }
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.SuvNavTargetResolver = SuvNavTargetResolver;
  return __exports;
});
})();