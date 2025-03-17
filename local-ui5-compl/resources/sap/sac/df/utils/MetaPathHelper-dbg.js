/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/sac/df/utils/MetaPathHelper", [],
  function () {
    "use strict";

    function MetaPathHelper() {
      this.getMultiDimModelName = function (sMetaPath) {
        return sMetaPath && sMetaPath.split(">")[0];
      };

      this.getDataProviderName = function(sMetaPath) {
        const sDataProvider = sMetaPath && sMetaPath.split(this.getMultiDimModelName(sMetaPath) + ">" + this.PathTo.DataProviders + "/")[1];
        return sDataProvider?.includes("/") ? sDataProvider.split("/")[0] : sDataProvider;
      };

      this.getVisualizationName = function(sMetaPath) {
        return sMetaPath && sMetaPath.split(this.getMultiDimModelName(sMetaPath) + ">" + this.PathTo.DataProviders +"/" + this.getDataProviderName(sMetaPath) + this.PathTo.Visualizations + "/")[1];
      };

      this.PathTo = {
        DataProviders: "/DataProviders",
        VariableGroups: "/VariableGroups",
        Messages: "/Messages",
        Visualizations: "/Visualizations",
        Variables: "/Variables",
        AxesLayout: "/AxesLayout",
        DataSourceInfo: "/DataSourceInfo",
        Grid: "/Grid",
        Dimensions: "/Dimensions",
        Measures: "/Measures",
        MemberFilter: "/MemberFilter",
        Configuration: "/Configuration"
      };

    }

    return new MetaPathHelper();
  }
);

