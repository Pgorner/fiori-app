/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define(["sap/ui/mdc/DefaultTypeMap"],function(e){"use strict";var t=Object.assign({},e);t.import(e);t.setAlias("Double","sap.ui.model.type.Float");t.freeze();var s={Date:{source:{format:"yyyy-MM-dd",pattern:"yyyy-MM-dd"}},Time:{source:{format:"HH:mm:ss",pattern:"HH:mm:ss"}},DateTime:{source:{format:"yyyy-MM-ddTHH:mm:ss",pattern:"yyyy-MM-ddTHH:mm:ss"}}};t.getFormatOptions=function(e){return s[e]};return t});
//# sourceMappingURL=TypeMap.js.map