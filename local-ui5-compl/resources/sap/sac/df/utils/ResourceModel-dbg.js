/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/sac/df/utils/ResourceModel",
  [
    "sap/ui/model/resource/ResourceModel", "sap/base/i18n/ResourceBundle", "sap/base/util/UriParameters"
  ],
  function (ResourceModel, ResourceBundle, UriParameters) {
    "use strict";
    var useLocalTranslations = UriParameters.fromQuery(window.location.search).get("dft_local");
    var baseBundleName = useLocalTranslations? "sap/sac/df/i18n/firefly/localization":  "sap/sac/df/i18n/localization";
    var bundleConfig = {
      bundleName: baseBundleName
    };
    if(useLocalTranslations){
      bundleConfig.enhanceWith = [
        ResourceBundle.create({
          bundleName: "sap/sac/df/i18n/localization"
        })
      ];
    }
    return new ResourceModel(bundleConfig);
  }
);
