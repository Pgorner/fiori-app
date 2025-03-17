// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/bootstrap/sandbox2/sandbox"
], (
    sandbox
) => {
    "use strict";

    return {
        //async run to ensure to be ready for the next phase
        async run () {
            return sandbox.bootstrap();
        }
    };
});
