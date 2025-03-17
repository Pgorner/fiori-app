// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

QUnit.config.autoStart = false;
if (window.localStorage) { window.localStorage.clear(); }
if (window.sessionStorage) { window.sessionStorage.clear(); }

sap.ui.define([
    "sap/ui/core/Core",
    "ControlPlaygrounds/test/integration/AllJourneys"
], (Core) => {
    "use strict";

    /* global QUnit */

    Core.ready(QUnit.start);
});
