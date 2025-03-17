// Copyright (c) 2009-2023 SAP SE, All Rights Reserved


sap.ui.define([], function () {
    "use strict";

    return {
        menu: [
            {
                id: "test-space-2",
                type: "space",
                title: "Space - Mixed - Page 1.",
                subMenu: [
                    {
                        id: "page1",
                        type: "workpage",
                        title: "Test Page 1",
                        pageType: "page"
                    },
                    {
                        id: "1fac2d11-e9d3-4f23-8ef5-57475030c5c3#Default-VizId",
                        type: "visualization",
                        title: "Test App 1"
                    },
                    {
                        id: "test-page-2",
                        type: "workpage",
                        title: "Test Page 2",
                        pageType: "workpage"
                    },
                    {
                        id: "1fac2d11-e9d3-4f23-8ef5-57475030c5c3#Default-VizId",
                        type: "visualization",
                        title: "Test App 2"
                    }
                ]
            },
            {
                id: "test-space-1",
                type: "space",
                title: "Space - Mixed - App 1.",
                subMenu: [
                    {
                        id: "1fac2d11-e9d3-4f23-8ef5-57475030c5c3#Default-VizId",
                        type: "visualization",
                        title: "Test App 3"
                    },
                    {
                        id: "page3",
                        type: "workpage",
                        title: "Test Page 3",
                        pageType: "page"
                    },
                    {
                        id: "1fac2d11-e9d3-4f23-8ef5-57475030c5c3#Default-VizId",
                        type: "visualization",
                        title: "Test App 4"
                    },
                    {
                        id: "test-page-4",
                        type: "workpage",
                        title: "Test Page 4",
                        pageType: "workpage"
                    }
                ]
            },
            {
                id: "test-space-3",
                type: "space",
                title: "Space - Only App",
                subMenu: [
                    {
                        id: "1fac2d11-e9d3-4f23-8ef5-57475030c5c3#Default-VizId",
                        type: "visualization",
                        title: "Test App 5"
                    }
                ]
            },
            {
                id: "test-space-4",
                type: "space",
                title: "Space - Only Page",
                subMenu: [
                    {
                        id: "test-page-5",
                        type: "workpage",
                        title: "Test Page 5",
                        pageType: "workpage"
                    }
                ]
            }
        ]
    };
});
