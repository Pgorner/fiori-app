/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define("sap/sac/df/utils/ResourceModel",["sap/ui/model/resource/ResourceModel","sap/base/i18n/ResourceBundle","sap/base/util/UriParameters"],function(e,a,i){"use strict";var s=i.fromQuery(window.location.search).get("dft_local");var n=s?"sap/sac/df/i18n/firefly/localization":"sap/sac/df/i18n/localization";var o={bundleName:n};if(s){o.enhanceWith=[a.create({bundleName:"sap/sac/df/i18n/localization"})]}return new e(o)});
//# sourceMappingURL=ResourceModel.js.map