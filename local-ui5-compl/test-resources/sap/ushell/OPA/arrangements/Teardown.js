// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ushell/EventHub",
    "sap/ushell/bootstrap/SchedulingAgent/FLPScheduler",
    "sap/ushell/opa/localService/Mockserver",
    "sap/ushell/Container"
], function (
    Opa5,
    EventHub,
    FLPScheduler,
    Mockserver,
    Container
) {
    "use strict";

    function teardownDomForFLP () {
        document.body.classList.remove("sapUiOpaFLP");
        FLPScheduler.oSchedule.aBlocksLoading = [];
    }


    return Opa5.extend("sap.ushell.opa.arrangements.Teardown", {
        iTeardownMyFLP: function (oConfig) {
            return this.iTeardownMyUIComponent()
                .then(teardownDomForFLP)
                .then(Mockserver.destroyAll)
                .then(EventHub._reset)
                .then(this._handleTeardownConfig.bind(this, oConfig));
        },

        _handleTeardownConfig: function (oConfig) {
            if (oConfig && oConfig.deletePersonalization === false) {
                return Promise.resolve();
            }

            return Container.getServiceAsync("PersonalizationV2").then(function (oPersonalization) {
                return Promise.all([
                    oPersonalization.deleteContainer("sap.ushell.cdm3-1.personalization"),
                    oPersonalization.deleteContainer("sap.ushell.cdm.personalization")
                ]);
            });
        }
    });
});
