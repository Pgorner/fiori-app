// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "./ContentFinderVisualizations",
    "./ContentFinderContextData",
    "./ContentFinderCategoryTree"
], function (JSONModel, visualizations, contextData, categoryTree) {
    "use strict";

    var oModel = {
        vizData: visualizations,
        contextData: contextData,
        categoryTree: categoryTree
    };

    return new JSONModel(oModel);
});
