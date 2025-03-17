// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/EventBus",
    "sap/ushell/EventHub"
], function (
    EventBus,
    EventHub
) {
    "use strict";

    function _init (oController) {
        setTimeout(function () {
            EventBus.getInstance().publish("sap.ushell", "rendererLoaded", { rendererName: "fiori2" });
        }, 0);
        EventHub.emit("RendererLoaded", { rendererName: "fiori2" });
    }
    function _publishExternalEvent (sEventName, oData) {
        setTimeout(function () {
            EventBus.getInstance().publish("sap.ushell.renderers.fiori2.Renderer", sEventName, oData);
        }, 0);
    }

    return {
        publishExternalEvent: _publishExternalEvent,
        init: _init
    };
});
