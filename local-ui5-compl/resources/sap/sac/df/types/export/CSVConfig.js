/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define("sap/sac/df/types/export/CSVConfig",["sap/ui/base/ManagedObject","sap/sac/df/firefly/library"],function(e,t){"use strict";return e.extend("sap.sac.df.types.export.CSVConfig",{metadata:{properties:{delimiter:{type:"string",defaultValue:","}}},getFireflyConfig:function(e){var r=t.CsvConfig.createDefault(t.PrFactory.createStructure(),e);r.setDelimiter(this.getDelimiter());return r}})});
//# sourceMappingURL=CSVConfig.js.map