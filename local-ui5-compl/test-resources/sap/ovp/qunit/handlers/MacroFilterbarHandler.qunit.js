sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/fe/navigation/SelectionVariant",
    "sap/ovp/handlers/MacroFilterbarHandler"
], function (
    Controller,
    SelectionVariant,
    MacroFilterbarHandler
) {
    "use strict";

    var oController, oMacroFilterBar;

    QUnit.module("MacroFilterbarHandler", {
        beforeEach: function () {
            return Controller.create({
                name: "sap.ovp.app.Main"
            }).then(function (controller) {
                oController = controller;
                oMacroFilterBar = {
                    getSelectionVariant: function() {}
                };
                var getMacroFilterBarStub = sinon.stub(oController, "getMacroFilterBar");
                getMacroFilterBarStub.returns(oMacroFilterBar);
            });
        }
    });

    QUnit.test("Get Filter bar configurations", function (assert) {
        var selectionVariant = {
            Version: {
                Major: "1",
                Minor: "0",
                Patch: "0",
            },
            SelectionVariantID: "",
            Text: "Selection Variant with ID ",
            ODataFilterExpression: "",
            Parameters: [],
            SelectOptions: [],
        };
        var sSelectionVariant = JSON.stringify(selectionVariant);

        var dPromise = new Promise(function (resolve, reject) {
            resolve(new SelectionVariant());
        });
        var getSelectionVariantStub = sinon.stub(oMacroFilterBar, "getSelectionVariant");
        getSelectionVariantStub.returns(dPromise);

        var fnDone = assert.async();
        MacroFilterbarHandler.getFilterBarConfiguration(undefined, oController).then(function (data) {
            var val = data;
            assert.ok(val.selectionVariant === sSelectionVariant, "Selection Variant Must be empty");
            fnDone();
        })
    });
});