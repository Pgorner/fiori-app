sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/comp/smartfilterbar/SmartFilterBar",
    "sap/ovp/handlers/IAppStateHandler",
    "sap/ui/thirdparty/jquery"
], function (
    Controller,
    SmartFilterBar,
    IAppStateHandler,
    jQuery
) {
    "use strict";

    var oController;

    QUnit.module("IAppStateHandler", {
        beforeEach: function () {
            return Controller.create({
                name: "sap.ovp.app.Main"
            }).then(function (controller) {
                oController = controller;

                var oGlobalFilter = new SmartFilterBar();
                var getGlobalFilterStub = sinon.stub(oController, "getGlobalFilter");
                getGlobalFilterStub.returns(oGlobalFilter);

                var getMacroFilterBarStub = sinon.stub(oController, "getMacroFilterBar");
                getMacroFilterBarStub.returns(undefined);
            });
        }
    });

    QUnit.test("Create an app state key", function (assert) {
        var dAppStateKey = "dummyAppStateKey"
        var oDeferred = jQuery.Deferred();

        var storeInnerAppStateAsyncStub = function () {
            oDeferred.resolve(dAppStateKey);
            return oDeferred.promise();
        };

        oController.oNavigationHandler = {
            storeInnerAppStateAsync: storeInnerAppStateAsyncStub,
        };
        var fnDone = assert.async();
        IAppStateHandler.getCurrentAppStatePromise(undefined, oController).then(function (appStateKey) {
            assert.ok(appStateKey === dAppStateKey, "app state key is created");
            fnDone();
        })
    });
});