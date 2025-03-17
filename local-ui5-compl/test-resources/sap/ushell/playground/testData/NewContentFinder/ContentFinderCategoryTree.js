// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    const aCategoryTree = [
        {
            id: "cat0",
            title: "All Apps",
            filterIsTitle: true,
            inactive: false,
            allowedFilters: ["tiles", "cards"]
        },
        {
            id: "cat1",
            title: "Catalogs",
            filterIsTitle: false,
            inactive: true,
            allowedFilters: ["tiles"],
            nodes: [
                { id: "1", title: "MyCatalog 1", contentProviderId: "id1", contentProviderLabel: "Label 1" },
                { id: "2", title: "MyCatalog 2", contentProviderId: "id2", contentProviderLabel: "Label 2" },
                { id: "3", title: "MyCatalog 3", contentProviderId: "id3", contentProviderLabel: "Label 3" },
                { id: "4", title: "MyCatalog 4", contentProviderId: "id4" },
                { id: "5", title: "MyCatalog 5", contentProviderId: "id5", contentProviderLabel: "Label 5" },
                { id: "6", title: "MyCatalog 6", contentProviderId: "id12", contentProviderLabel: "Label 6" },
                { id: "7", title: "MyCatalog 7", contentProviderId: "id13", contentProviderLabel: "Label 7" },
                { id: "8", title: "MyCatalog 8", contentProviderId: "id14", contentProviderLabel: "Label 8" },
                { id: "9", title: "MyCatalog 9", contentProviderId: "id15" },
                { id: "10", title: "MyCatalog 10", contentProviderId: "id16", contentProviderLabel: "Label 10" },
                { id: "11", title: "MyCatalog 11", contentProviderId: "id17" },
                { id: "12", title: "MyCatalog 12", contentProviderId: "id18", contentProviderLabel: "Label 12" },
                { id: "13", title: "MyCatalog 13", contentProviderId: "id19" },
                { id: "14", title: "MyCatalog 14", contentProviderId: "id20", contentProviderLabel: "Label 14" },
                { id: "15", title: "MyCatalog 15", contentProviderId: "id21" },
                { id: "16", title: "MyCatalog 16", contentProviderId: "id22", contentProviderLabel: "Label 16" },
                { id: "17", title: "MyCatalog 17", contentProviderId: "id23" },
                { id: "18", title: "MyCatalog 18", contentProviderId: "id24", contentProviderLabel: "Label 18" },
                { id: "19", title: "MyCatalog 19", contentProviderId: "id25" },
                { id: "20", title: "MyCatalog 20", contentProviderId: "id26", contentProviderLabel: "Label 20" },
                { id: "21", title: "MyCatalog 21", contentProviderId: "id27", contentProviderLabel: "Label 21" },
                { id: "22", title: "MyCatalog 22", contentProviderId: "id28", contentProviderLabel: "Label 22" },
                { id: "23", title: "MyCatalog 23", contentProviderId: "id29" },
                { id: "24", title: "MyCatalog 24", contentProviderId: "id30", contentProviderLabel: "Label 24" },
                { id: "25", title: "MyCatalog 25", contentProviderId: "id31" },
                { id: "26", title: "MyCatalog 26", contentProviderId: "id32", contentProviderLabel: "Label 26" },
                { id: "27", title: "MyCatalog 27", contentProviderId: "id33" },
                { id: "28", title: "MyCatalog 28", contentProviderId: "id34", contentProviderLabel: "Label 28" },
                { id: "29", title: "MyCatalog 29", contentProviderId: "id35" },
                { id: "30", title: "MyCatalog 30", contentProviderId: "id36", contentProviderLabel: "Label 30" },
                { id: "31", title: "Danny's Test catalog"}
            ]
        }
    ];

    return aCategoryTree;
});
