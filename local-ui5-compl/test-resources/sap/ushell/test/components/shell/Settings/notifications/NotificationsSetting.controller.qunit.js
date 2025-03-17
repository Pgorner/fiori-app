// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Config",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/resources",
    "sap/ushell/components/shell/Settings/notifications/NotificationsSetting.controller",
    "sap/ushell/Container"
], function (jQuery, Config, JSONModel, resources, NotificationsSettingController, Container) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.sandbox.create();

    var _oNotificationsMockdata = JSON.stringify({
        "@odata.context": "$metadata#NotificationTypePersonalizationSet",
        "@odata.metadataEtag": "W/\"20181109171651\"",
        value: [{
            NotificationTypeId: "e41d2de5-3d80-1ee8-a2cb-e281635723da",
            NotificationTypeDesc: "SETTING_ALL_TRUE",
            PriorityDefault: "HIGH",
            DoNotDeliver: true,
            DoNotDeliverMob: true,
            DoNotDeliverEmail: true,
            IsEmailEnabled: true,
            IsEmailIdMaintained: true
        }]
    });

    QUnit.module("The onInit method", {
        beforeEach: function () {
            this.oController = new NotificationsSettingController();
            this.oSetModelStub = sandbox.stub();
            this.oSetBusyStub = sandbox.stub();
            this.oGetViewStub = sandbox.stub(this.oController, "getView").returns({
                setModel: this.oSetModelStub,
                setBusy: this.oSetBusyStub
            });

            this.oSettingsDeferred = Promise.resolve(_oNotificationsMockdata);
            this.oReadSettingsDeferred = sandbox.stub().returns(this.oSettingsDeferred);
            this.oGetServiceAsyncPromise = Promise.resolve({
                readSettings: this.oReadSettingsDeferred
            });
            sandbox.stub(Container, "getServiceAsync").returns(this.oGetServiceAsyncPromise);
            this.oInitFlagsStub = sandbox.stub(this.oController, "_initializeFlags");
        },
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("calls the '_initializeFlags' method.", function (assert) {
        // Arrange
        var done = assert.async();
        // Act
        this.oController.onInit();
        // Assert
        this.oGetServiceAsyncPromise
            .then(function () {
                assert.strictEqual(
                    this.oInitFlagsStub.callCount,
                    1,
                    "The '_initializeFlags' method was called once."
                );
            }.bind(this))
            .catch(function () {
                assert.ok(false, "An error occurred and the promise was rejected.");
            })
            .finally(done);
    });

    QUnit.test("calls the 'setBusy' method on the view.", function (assert) {
        // Arrange
        var done = assert.async(),
            that = this;
        // Act
        this.oController.onInit();
        // Assert
        this.oGetServiceAsyncPromise
            .then(function (service) {
                service.readSettings()
                    .then(() => {
                        assert.strictEqual(
                            that.oSetBusyStub.callCount,
                            1,
                            "The 'setBusy' method was called once."
                        );
                        assert.strictEqual(
                            that.oSetBusyStub.firstCall.args[0],
                            true,
                            "The 'setBusy' method was called with 'true'."
                        );
                    })
                    .finally(function () {
                        assert.strictEqual(
                            that.oSetBusyStub.callCount,
                            2,
                            "The 'setBusy' method was called twice."
                        );
                        assert.strictEqual(
                            that.oSetBusyStub.secondCall.args[0],
                            false,
                            "The 'setBusy' method was called with 'false'."
                        );
                        done();
                    });
            });
    });

    QUnit.test("sets the correct properties in the local models.", function (assert) {
        // Arrange
        var done = assert.async(),
            that = this,
            oExpectedModel = new JSONModel({
                rows: [{
                    NotificationTypeId: "e41d2de5-3d80-1ee8-a2cb-e281635723da",
                    NotificationTypeDesc: "SETTING_ALL_TRUE",
                    PriorityDefault: "HIGH",
                    DoNotDeliver: true,
                    DoNotDeliverMob: true,
                    DoNotDeliverEmail: true,
                    IsEmailEnabled: true,
                    IsEmailIdMaintained: true
                }],
                originalRows: [{
                    NotificationTypeId: "e41d2de5-3d80-1ee8-a2cb-e281635723da",
                    NotificationTypeDesc: "SETTING_ALL_TRUE",
                    PriorityDefault: "HIGH",
                    DoNotDeliver: true,
                    DoNotDeliverMob: true,
                    DoNotDeliverEmail: true,
                    IsEmailEnabled: true,
                    IsEmailIdMaintained: true
                }]
            });
        this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel").returns("FAKE_GET_TRANSLATION_MODEL");
        // Act
        this.oController.onInit();
        // Assert
        this.oGetServiceAsyncPromise
            .then(function (service) {
                service.readSettings()
                    .then(() => {})
                    .finally(function () {
                        assert.strictEqual(
                            that.oSetModelStub.callCount,
                            2,
                            "The 'setModel' method was called twice."
                        );
                        assert.deepEqual(
                            that.oSetModelStub.firstCall.args,
                            ["FAKE_GET_TRANSLATION_MODEL", "i18n"],
                            "The i18n model was set."
                        );
                        assert.deepEqual(
                            that.oSetModelStub.secondCall.args[0].getProperty("/rows"),
                            oExpectedModel.getProperty("/rows"),
                            "The unnamed model got the correct 'rows' property."
                        );
                        assert.deepEqual(
                            that.oSetModelStub.secondCall.args[0].getProperty("/originalRows"),
                            oExpectedModel.getProperty("/originalRows"),
                            "The unnamed model got the correct 'originalRows' property."
                        );
                        done();
                    });
            });
    });

    QUnit.module("The onCancel method", {
        beforeEach: function () {
            this.oController = new NotificationsSettingController();
            this.oController._oModel = new JSONModel({
                rows: ["FAKE_ROW"],
                flags: {
                    highPriorityBannerEnabled: true
                },
                originalFlags: {
                    highPriorityBannerEnabled: false
                },
                originalRows: ["FAKE_ORIGINAL_ROW"]
            });
        },
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("resets the properties of the local unnamed model.", function (assert) {
        // Act
        this.oController.onCancel();
        // Assert
        assert.deepEqual(
            this.oController._oModel.getProperty("/rows"),
            ["FAKE_ORIGINAL_ROW"],
            "The 'rows' property was reset."
        );
        assert.deepEqual(
            this.oController._oModel.getProperty("/flags/highPriorityBannerEnabled"),
            false,
            "The 'highPriorityBannerEnabled' property was reset."
        );
        assert.deepEqual(
            this.oController._oModel.getProperty("/originalRows"),
            [],
            "The 'originalRows' property was reset."
        );
        assert.deepEqual(
            this.oController._oModel.getProperty("/originalFlags"),
            {},
            "The 'originalFlags' property was reset."
        );
    });

    QUnit.module("The onSave method", {
        beforeEach: function () {
            this.oController = new NotificationsSettingController();
            this.oSaveSettingsEntryStub = sandbox.stub();
            this.oSetUserSettingsFlagsStub = sandbox.stub();
            this.oController._oNotificationService = {
                saveSettingsEntry: this.oSaveSettingsEntryStub,
                setUserSettingsFlags: this.oSetUserSettingsFlagsStub
            };
            this.oController._oModel = new JSONModel({
                rows: [{
                    NotificationTypeId: "e41d2de5-3d80-1ee8-a2cb-e281635723da",
                    NotificationTypeDesc: "SETTING_ALL_TRUE",
                    PriorityDefault: "HIGH",
                    DoNotDeliver: true,
                    DoNotDeliverMob: true,
                    DoNotDeliverEmail: true,
                    IsEmailEnabled: true,
                    IsEmailIdMaintained: true
                }],
                originalRows: [{
                    NotificationTypeId: "e41d2de5-3d80-1ee8-a2cb-e281635723da",
                    NotificationTypeDesc: "SETTING_ALL_TRUE",
                    PriorityDefault: "HIGH",
                    DoNotDeliver: true,
                    DoNotDeliverMob: true,
                    DoNotDeliverEmail: true,
                    IsEmailEnabled: true,
                    IsEmailIdMaintained: true
                }],
                flags: {
                    highPriorityBannerEnabled: true
                },
                originalFlags: {
                    highPriorityBannerEnabled: true
                }
            });
            this.oHandleFlagsSaveStub = sandbox.spy(this.oController, "_handleFlagsSave");
        },
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("calls proper methods in case nothing was changed.", function (assert) {
        // Arrange
        var fnDone = assert.async();

        // Act
        this.oController.onSave().then(function () {
            // Assert
            assert.strictEqual(this.oHandleFlagsSaveStub.callCount, 0, "_handleFlagsSave was not called.");
            assert.strictEqual(this.oSaveSettingsEntryStub.callCount, 0, "The saveSettingsEntry method of the service was not called.");
            // Reset
            fnDone();
        }.bind(this));
    });

    QUnit.test("calls the proper methods in case there were changes in the rows.", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oController._oModel.setProperty("/originalRows/0/DoNotDeliver", false);

        // Act
        this.oController.onSave().then(function () {
            // Assert
            assert.strictEqual(this.oHandleFlagsSaveStub.callCount, 0, "_handleFlagsSave was not called.");
            assert.strictEqual(this.oSaveSettingsEntryStub.callCount, 1, "The saveSettingsEntry method of the service was called.");
            // Reset
            fnDone();
        }.bind(this));
    });

    QUnit.test("calls the proper methods in case there were changes in the flags.", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oController._oModel.setProperty("/flags/highPriorityBannerEnabled", false);

        // Act
        this.oController.onSave().then(function () {
            // Assert
            assert.strictEqual(this.oHandleFlagsSaveStub.callCount, 1, "_handleFlagsSave was called.");
            assert.strictEqual(this.oSaveSettingsEntryStub.callCount, 0, "The saveSettingsEntry method of the service was not called.");
            // Reset
            fnDone();
        }.bind(this));
    });

    QUnit.test("rejects the onSave promise in case the saveSettingsEntry was rejected.", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oController._oModel.setProperty("/originalRows/0/DoNotDeliver", false);
        this.oSaveSettingsEntryStub.returns(jQuery.Deferred().reject());

        // Act
        this.oController.onSave()
            .then(function () {
                // Assert
                assert.ok(false, "Promise was resolved, but should have been rejected.");
            })
            .catch(function () {
                assert.ok(true, "Promise was rejected.");
            })
            .finally(fnDone);
    });

    QUnit.test("calls the setUserSettingsFlags method in case the flags were changed.", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oController._oModel.setProperty("/flags/highPriorityBannerEnabled", false);

        // Act
        this.oController.onSave()
            .then(function () {
                // Assert
                assert.strictEqual(
                    this.oSetUserSettingsFlagsStub.callCount,
                    1,
                    "The setUserSettingsFlags method was called once."
                );
            }.bind(this))
            .catch(function () {
                assert.ok(false, "Promise was rejected.");
            })
            .finally(fnDone);
    });

    QUnit.module("The onSelectMobile method", {
        beforeEach: function () {
            this.oController = new NotificationsSettingController();
            this.oGetParameterStub = sandbox.stub();
            this.Event = {
                getSource: sandbox.stub().returns({
                    getBindingContext: sandbox.stub().returns({
                        getPath: sandbox.stub().returns("/FAKE_PATH")
                    })
                }),
                getParameter: this.oGetParameterStub
            };
        },
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("switches the 'DoNotDeliverMob' property form 'false' to 'true'.", function (assert) {
        // Arrange
        this.oController._oModel = new JSONModel({
            FAKE_PATH: {
                DoNotDeliverMob: false
            }
        });
        this.oGetParameterStub.returns(false);
        // Act
        this.oController.onSelectMobile(this.Event);
        // Assert
        assert.strictEqual(
            this.oController._oModel.getProperty("/FAKE_PATH/DoNotDeliverMob"),
            true,
            "The property 'FAKE_PATH/DoNotDeliverMob' was switched from 'false' to 'true'."
        );
    });

    QUnit.test("switches the 'DoNotDeliverMob' property form 'true' to 'false'.", function (assert) {
        // Arrange
        this.oController._oModel = new JSONModel({
            FAKE_PATH: {
                DoNotDeliverMob: true
            }
        });
        this.oGetParameterStub.returns(true);
        // Act
        this.oController.onSelectMobile(this.Event);
        // Assert
        assert.strictEqual(
            this.oController._oModel.getProperty("/FAKE_PATH/DoNotDeliverMob"),
            false,
            "The property 'FAKE_PATH/DoNotDeliverMob' was switched from 'true' to 'false'."
        );
    });

    QUnit.module("The onSelectEmail method", {
        beforeEach: function () {
            this.oController = new NotificationsSettingController();
            this.oGetParameterStub = sandbox.stub();
            this.Event = {
                getSource: sandbox.stub().returns({
                    getBindingContext: sandbox.stub().returns({
                        getPath: sandbox.stub().returns("/FAKE_PATH")
                    })
                }),
                getParameter: this.oGetParameterStub
            };
        },
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("switches the 'DoNotDeliverEmail' property form 'false' to 'true'.", function (assert) {
        // Arrange
        this.oController._oModel = new JSONModel({
            FAKE_PATH: {
                DoNotDeliverEmail: false
            }
        });
        this.oGetParameterStub.returns(false);
        // Act
        this.oController.onSelectEmail(this.Event);
        // Assert
        assert.strictEqual(
            this.oController._oModel.getProperty("/FAKE_PATH/DoNotDeliverEmail"),
            true,
            "The property 'FAKE_PATH/DoNotDeliverEmail' was switched from 'false' to 'true'."
        );
    });

    QUnit.test("switches the 'DoNotDeliverEmail' property form 'true' to 'false'.", function (assert) {
        // Arrange
        this.oController._oModel = new JSONModel({
            FAKE_PATH: {
                DoNotDeliverEmail: true
            }
        });
        this.oGetParameterStub.returns(true);
        // Act
        this.oController.onSelectEmail(this.Event);
        // Assert
        assert.strictEqual(
            this.oController._oModel.getProperty("/FAKE_PATH/DoNotDeliverEmail"),
            false,
            "The property 'FAKE_PATH/DoNotDeliverEmail' was switched from 'true' to 'false'."
        );
    });

    QUnit.module("The onSelectHighPriority method", {
        beforeEach: function () {
            this.oController = new NotificationsSettingController();
            this.oGetParameterStub = sandbox.stub();
            this.Event = {
                getSource: sandbox.stub().returns({
                    getBindingContext: sandbox.stub().returns({
                        getPath: sandbox.stub().returns("/FAKE_PATH")
                    })
                }),
                getParameter: this.oGetParameterStub
            };
        },
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("switches the 'PriorityDefault' property form 'false' to 'true'.", function (assert) {
        // Arrange
        this.oController._oModel = new JSONModel({
            FAKE_PATH: {
                PriorityDefault: "HIGH"
            }
        });
        this.oGetParameterStub.returns(false);
        // Act
        this.oController.onSelectHighPriority(this.Event);
        // Assert
        assert.strictEqual(
            this.oController._oModel.getProperty("/FAKE_PATH/PriorityDefault"),
            "",
            "The property 'FAKE_PATH/PriorityDefault' was switched from 'HIGH' to ''."
        );
    });

    QUnit.test("switches the 'PriorityDefault' property form 'true' to 'false'.", function (assert) {
        // Arrange
        this.oController._oModel = new JSONModel({
            FAKE_PATH: {
                PriorityDefault: ""
            }
        });
        this.oGetParameterStub.returns(true);
        // Act
        this.oController.onSelectHighPriority(this.Event);
        // Assert
        assert.strictEqual(
            this.oController._oModel.getProperty("/FAKE_PATH/PriorityDefault"),
            "HIGH",
            "The property 'FAKE_PATH/PriorityDefault' was switched from '' to 'HIGH'."
        );
    });

    QUnit.module("The onEnableSwitchChange method", {
        beforeEach: function () {
            this.oController = new NotificationsSettingController();
            this.oGetParameterStub = sandbox.stub();
            this.Event = {
                getSource: sandbox.stub().returns({
                    getBindingContext: sandbox.stub().returns({
                        getPath: sandbox.stub().returns("/FAKE_PATH")
                    })
                }),
                getParameter: this.oGetParameterStub
            };
        },
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("switches the 'DoNotDeliver' property form 'false' to 'true'.", function (assert) {
        // Arrange
        this.oController._oModel = new JSONModel({
            FAKE_PATH: {
                DoNotDeliver: false
            }
        });
        this.oGetParameterStub.returns(false);
        // Act
        this.oController.onEnableSwitchChange(this.Event);
        // Assert
        assert.strictEqual(
            this.oController._oModel.getProperty("/FAKE_PATH/DoNotDeliver"),
            true,
            "The property 'FAKE_PATH/DoNotDeliver' was switched from 'false' to 'true'."
        );
    });

    QUnit.test("switches the 'DoNotDeliver' property form 'true' to 'false'.", function (assert) {
        // Arrange
        this.oController._oModel = new JSONModel({
            FAKE_PATH: {
                DoNotDeliver: true
            }
        });
        this.oGetParameterStub.returns(true);
        // Act
        this.oController.onEnableSwitchChange(this.Event);
        // Assert
        assert.strictEqual(
            this.oController._oModel.getProperty("/FAKE_PATH/DoNotDeliver"),
            false,
            "The property 'FAKE_PATH/DoNotDeliver' was switched from 'true' to 'false'."
        );
    });
});
