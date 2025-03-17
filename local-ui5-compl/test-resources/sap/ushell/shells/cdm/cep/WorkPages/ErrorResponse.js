// Copyright (c) 2009-2023 SAP SE, All Rights Reserved


sap.ui.define([], function () {
    "use strict";

    return {
        errors: [
            {
                message: "Cannot return null for non-nullable field WorkPage.id.",
                path: [
                    "workPage",
                    "id"
                ],
                extensions: {
                    statusCode: "INTERNAL_SERVER_ERROR"
                }
            }
        ],
        data: null
    };
});
