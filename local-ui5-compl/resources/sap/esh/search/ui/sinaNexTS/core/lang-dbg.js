/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
  "use strict";

  function getLanguagePreferences() {
    const isFirefox = typeof window.InstallTrigger !== "undefined";
    // eslint-disable-next-line no-constant-binary-expression
    const isIE = false || !!document.documentMode;
    const isEdge = !isIE && !!window.StyleMedia;
    const isChrome = !!window.chrome && !!window.chrome.webstore;
    const languagePreferences = [];
    if (isIE || isEdge) {
      const ieLang = window.navigator.browserLanguage || window.navigator.language;
      languagePreferences.splice(0, 0, this._getLanguageCountryObject(ieLang));
    } else if (isFirefox || isChrome) {
      const language = window.navigator.language;
      const languages = window.navigator.languages.slice();
      const index = languages.indexOf(language);
      if (index > -1) {
        languages.splice(index, 1);
      }
      languagePreferences.splice(0, 0, this._getLanguageCountryObject(language));
      for (let i = 0; i < languages.length; i++) {
        const languagePreference = this._getLanguageCountryObject(languages[i]);
        if (languagePreference) {
          languagePreferences.splice(languagePreferences.length, 0, languagePreference);
        }
      }
    } else {
      languagePreferences.splice(0, 0, this._getLanguageCountryObject(window.navigator.language));
    }
    return languagePreferences;
  }
  function _getLanguageCountryObject(l) {
    let language;
    let country;
    if (l.length === 2) {
      language = l;
      country = "";
    } else if (l.length === 5 && l.indexOf("-") === 2) {
      language = l.substr(0, 2);
      country = l.substr(3);
    } else {
      return undefined;
    }
    return {
      Language: language,
      Country: country
    };
  }
  var __exports = {
    __esModule: true
  };
  __exports.getLanguagePreferences = getLanguagePreferences;
  __exports._getLanguageCountryObject = _getLanguageCountryObject;
  return __exports;
});
})();