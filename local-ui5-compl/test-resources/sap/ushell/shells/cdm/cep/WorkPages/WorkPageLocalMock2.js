// Copyright (c) 2009-2023 SAP SE, All Rights Reserved


sap.ui.define([], function () {
    "use strict";

    return {
        descriptor: {
            value: {
                title: "CEP Standard WorkPage",
                description: ""
            },
            schemaVersion: "3.2.0"
        },
        rows: [
            {
                id: "row0",
                configurations: [],
                descriptor: {
                    value: {
                        title: "First Section: Tiles"
                    },
                    schemaVersion: "3.2.0"
                },
                columns: [
                    {
                        id: "row0_col0",
                        tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                        instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                        descriptor: {
                            value: {
                                columnWidth: 24
                            },
                            schemaVersion: "3.2.0"
                        },
                        configurations: [],
                        cells: [
                            {
                                id: "row0_col0_cell0",
                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                descriptor: {
                                    value: {},
                                    schemaVersion: "3.2.0"
                                },
                                configurations: [],
                                widgets: [
                                    {
                                        id: "dynamic_tile_0",
                                        tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                        instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                        configurations: [],
                                        visualization: {
                                            id: "provider2_1e504721-8532-4a80-8fdd-0d88744c336f#Default-VizId"
                                        }
                                    }
                                ]
                            }, {
                                id: "row0_col0_cell1",
                                tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                descriptor: {
                                    value: {},
                                    schemaVersion: "3.2.0"
                                },
                                configurations: [],
                                widgets: [
                                    {
                                        id: "static_tile_0",
                                        tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                        instanceId: "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                        configurations: [],
                                        visualization: {
                                            id: "provider2_5a119bf3-8540-42b6-a0b4-059db20cd459#Default-VizId"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
});
