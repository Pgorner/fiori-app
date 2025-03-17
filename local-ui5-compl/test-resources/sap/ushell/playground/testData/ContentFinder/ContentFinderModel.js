// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "./ContentFinderTiles",
    "./ContentFinderCards",
    "./ContentFinderRoles",
    "./ContentFinderCatalog",
    "./ContentFinderTree"
], function (JSONModel, aTiles, aCards, oRoles, oContentFinderCatalog, aTree) {
    "use strict";

    var oModel = {
        data: {
            Catalog: oContentFinderCatalog
        }
    };

    return new JSONModel(oModel);
});
