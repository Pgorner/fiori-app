/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define("sap/sac/df/utils/MetaPathHelper",[],function(){"use strict";function i(){this.getMultiDimModelName=function(i){return i&&i.split(">")[0]};this.getDataProviderName=function(i){const t=i&&i.split(this.getMultiDimModelName(i)+">"+this.PathTo.DataProviders+"/")[1];return t?.includes("/")?t.split("/")[0]:t};this.getVisualizationName=function(i){return i&&i.split(this.getMultiDimModelName(i)+">"+this.PathTo.DataProviders+"/"+this.getDataProviderName(i)+this.PathTo.Visualizations+"/")[1]};this.PathTo={DataProviders:"/DataProviders",VariableGroups:"/VariableGroups",Messages:"/Messages",Visualizations:"/Visualizations",Variables:"/Variables",AxesLayout:"/AxesLayout",DataSourceInfo:"/DataSourceInfo",Grid:"/Grid",Dimensions:"/Dimensions",Measures:"/Measures",MemberFilter:"/MemberFilter",Configuration:"/Configuration"}}return new i});
//# sourceMappingURL=MetaPathHelper.js.map