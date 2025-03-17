sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/View",
    "sap/ui/core/mvc/ViewType",
    "sap/ui/core/Component",
    "sap/m/library",
    "sap/ovp/app/ShareUtils",
    "sap/ushell/Container"
], function (
    Controller,
    JSONModel,
    View,
    ViewType,
    CoreComponent,
    SapMLibrary,
    ShareUtils,
    UshellContainer
) {
    "use strict";

    var oController, oShareUtils, uiModel, oDummyView, oComponent;
    QUnit.module("ShareUtils", {
        beforeEach: function () {
            return Controller.create({
                name: "sap.ovp.app.Main"
            }).then(function (controller) {
                oController = controller;
                oShareUtils = new ShareUtils(controller);
                uiModel = new JSONModel({
                    subtitle: 'TestTitle'
                });
                oDummyView = new View("mainView", {
                    height: "100%",
                    preprocessors: {
                        xml: {
                            bindingContexts: {
                                ui: uiModel.createBindingContext("/"),
                            },
                            models: {
                                ui: uiModel,
                            },
                        },
                    },
                    type: ViewType.XML,
                    viewName: "sap.ovp.app.Main",
                });
                oController.getView = function () {
                    return oDummyView;
                };
                oComponent = new CoreComponent("", {});
                oController.getOwnerComponent = function () {
                    return oComponent;
                };
                var oDummyModel = oController.getOwnerComponent();
                oDummyModel.setModel(uiModel, "ui");
                
                oShareUtils.init();
                oShareUtils.onShareButtonAvailableAndPressed();
            });
        },
        afterEach: function () {
            oDummyView.destroy();
        },
    });

    QUnit.test("Action Button - Send Email", function (assert) {
        var fnDone = assert.async();
        UshellContainer.init("cdm").then(function () {
            var oEmailListener = oShareUtils.oSharePageFragment.then(function (oControl) {
                return oControl.getAggregation("items")[0].mEventRegistry.press[0].oListener;
            });
            oEmailListener.then(function (oControl) {
                var spy = sinon.stub(SapMLibrary.URLHelper, "triggerEmail").returns(true);
                oControl.shareEmailPressed();
                assert.ok(spy.called, "Send Email option handled");
                fnDone();
            });
        });
    });

    QUnit.test("Action Button - Share to Micrososft Teams", function (assert) {
        var fnDone = assert.async();
        UshellContainer.init("cdm").then(function () {
            var oShareToTeamsListener = oShareUtils.oSharePageFragment.then(function (oControl) {
                return oControl.getAggregation("items")[0].mEventRegistry.press[0].oListener;
            });
            oShareToTeamsListener.then(function (oControl) {
                var spy = sinon.stub(oShareUtils.oSuiteCollaborationService, "share").returns(true);
                oControl.getCustomData = function () {
                    return [
                        {
                            getValue: function () {return 'TestValue'}
                        }
                    ]
                }
                oControl.shareMSTeamsPressed();
                assert.ok(spy.called, "Share to Teams option handled");
                fnDone();
            });
        });
        
    });
});