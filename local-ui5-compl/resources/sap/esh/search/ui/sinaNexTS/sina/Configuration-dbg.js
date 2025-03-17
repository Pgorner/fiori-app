/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SinaObject", "../providers/abap_odata/Provider", "../providers/inav2/Provider"], function (___SinaObject, ___providers_abap_odata_Provider, ___providers_inav2_Provider) {
  "use strict";

  const SinaObject = ___SinaObject["SinaObject"];
  const ABAPODataProvider = ___providers_abap_odata_Provider["Provider"];
  const INAV2Provider = ___providers_inav2_Provider["Provider"];
  class Configuration extends SinaObject {
    // _meta: {
    //     properties: {
    //         personalizedSearch: {
    //             required: true,
    //             setter: true
    //         },
    //         isPersonalizedSearchEditable: {
    //             required: true
    //         }
    //     }
    // }

    personalizedSearch;
    isPersonalizedSearchEditable;
    setPersonalizedSearch(personalizedSearch) {
      this.personalizedSearch = personalizedSearch;
    }
    constructor(properties) {
      super(properties);
      this.personalizedSearch = properties.personalizedSearch ?? this.personalizedSearch;
      this.isPersonalizedSearchEditable = properties.isPersonalizedSearchEditable ?? this.isPersonalizedSearchEditable;
    }
    async resetPersonalizedSearchDataAsync() {
      if (this.sina.provider instanceof INAV2Provider || this.sina.provider instanceof ABAPODataProvider) {
        return this.sina.provider.resetPersonalizedSearchDataAsync();
      }
    }
    async saveAsync() {
      if (this.sina.provider instanceof INAV2Provider || this.sina.provider instanceof ABAPODataProvider) {
        return this.sina.provider.saveConfigurationAsync(this);
      }
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.Configuration = Configuration;
  return __exports;
});
})();