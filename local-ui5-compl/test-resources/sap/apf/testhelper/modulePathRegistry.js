/*global sap*/
sap.ui.define([
	"sap/apf/testhelper/pathMap"
], function(PathMap){
	"use strict";

	var pathMap = new PathMap("test/uilib/", "main/uilib/", "sap.apf");

    pathMap.registerModulePathForTestResource("sap.apf");
    pathMap.registerModulePathForTestResource("sap.apf.testhelper");
    pathMap.registerModulePathForProductiveResource("sap.apf.api");
    pathMap.registerModulePathForProductiveResource("sap.apf.Component");
    pathMap.registerModulePathForProductiveResource("sap.apf.core");
    pathMap.registerModulePathForProductiveResource("sap.apf.modeler");
    pathMap.registerModulePathForProductiveResource("sap.apf.ui");
    pathMap.registerModulePathForProductiveResource("sap.apf.utils");

});
