/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define("sap/sac/df/types/export/XLSConfig",["sap/ui/base/ManagedObject","sap/sac/df/firefly/library"],function(e,t){"use strict";return e.extend("sap.sac.df.types.export.XLSConfig",{metadata:{properties:{autoFilterActive:{type:"boolean",defaultValue:true}}},getFireflyConfig:function(e){var a=t.XlsConfig.createDefault(t.PrFactory.createStructure(),e);a.setAutoFilterActive(this.getAutoFilterActive());return a}})});
//# sourceMappingURL=XLSConfig.js.map