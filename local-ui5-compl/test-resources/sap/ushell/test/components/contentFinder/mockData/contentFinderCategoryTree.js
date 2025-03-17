// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    var aCategoryTree = [
        {
            id: "cat0",
            descriptor: { value: { title: "All Tiles" } } },
        {
            id: "cat1",
            descriptor: { value: { title: "Catalog" } },
            nodes: [
                { id: "1", descriptor: { value: { title: "MyCatalog 1" } } },
                { id: "2", descriptor: { value: { title: "MyCatalog 2" } } },
                { id: "3", descriptor: { value: { title: "MyCatalog 3" } } },
                { id: "4", descriptor: { value: { title: "MyCatalog 4" } } },
                { id: "5", descriptor: { value: { title: "MyCatalog 5" } } }
            ]
        },
        {
            id: "cat2",
            descriptor: { value: { title: "Roles" } },
            nodes: [
                { id: "1", descriptor: { value: { title: "Role 1" } } },
                { id: "2", descriptor: { value: { title: "Role 2" } } },
                { id: "3", descriptor: { value: { title: "Role 3" } } },
                { id: "4", descriptor: { value: { title: "Role 4" } } },
                { id: "5", descriptor: { value: { title: "Role 5" } } }
            ]
        },
        {
            id: "cat3",
            descriptor: { value: { title: "Groups" } },
            nodes: [
                { id: "1", descriptor: { value: { title: "Group 1" } } },
                { id: "2", descriptor: { value: { title: "Group 2" } } },
                { id: "3", descriptor: { value: { title: "Group 3" } } },
                { id: "4", descriptor: { value: { title: "Group 4" } } },
                { id: "5", descriptor: { value: { title: "Group 5" } } }
            ]
        }
    ];


    // contentProviderId and contentProviderLabel are not yet provided by Catalog API.
    // This will be used as mock data once both are available
    /* var aCategoryTree = [
        { id: "cat0", descriptor: { value: { title: "All Tiles" } } },
        {
            id: "cat1",
            descriptor: { value: { title: "Catalog" } },
            nodes: [
                { id: "1", descriptor: { value: { title: "MyCatalog 1" } }, contentProviderId: "id1", contentProviderLabel: "Label 1" },
                { id: "2", descriptor: { value: { title: "MyCatalog 2" } }, contentProviderId: "id2", contentProviderLabel: "Label 2" },
                { id: "3", descriptor: { value: { title: "MyCatalog 3" } }, contentProviderId: "id3", contentProviderLabel: "Label 3" },
                { id: "4", descriptor: { value: { title: "MyCatalog 4" } }, contentProviderId: "id4" },
                { id: "5", descriptor: { value: { title: "MyCatalog 5" } }, contentProviderId: "id5", contentProviderLabel: "Label 5" }
            ]
        },
        {
            id: "cat2",
            descriptor: { value: { title: "Roles" } },
            nodes: [
                { id: "1", descriptor: { value: { title: "Role 1" } }, contentProviderId: "id6", contentProviderLabel: "Label 1" },
                { id: "2", descriptor: { value: { title: "Role 2" } }, contentProviderId: "id7" },
                { id: "3", descriptor: { value: { title: "Role 3" } }, contentProviderId: "id8" },
                { id: "4", descriptor: { value: { title: "Role 4" } }, contentProviderId: "id9", contentProviderLabel: "Label 4" },
                { id: "5", descriptor: { value: { title: "Role 5" } }, contentProviderId: "id10", contentProviderLabel: "Label 5" }
            ]
        },
        {
            id: "cat3",
            descriptor: { value: { title: "Groups" } },
            nodes: [
                { id: "1", descriptor: { value: { title: "Group 1" } }, contentProviderId: "id36" },
                { id: "2", descriptor: { value: { title: "Group 2" } }, contentProviderId: "id37", contentProviderLabel: "Label 2" },
                { id: "3", descriptor: { value: { title: "Group 3" } }, contentProviderId: "id38", contentProviderLabel: "Label 3" },
                { id: "4", descriptor: { value: { title: "Group 4" } }, contentProviderId: "id39" },
                { id: "5", descriptor: { value: { title: "Group 5" } }, contentProviderId: "id40", contentProviderLabel: "Label 5" }
            ]
        }
    ]; */

    return aCategoryTree;
});
