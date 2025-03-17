// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/ui/core/Element",
    "sap/ushell/components/shell/Settings/userDefaults/UserDefaultsEntry",
    "sap/ushell/resources",
    "sap/ushell/Container"
], function (
    Log,
    ObjectPath,
    Element,
    UserDefaultsEntry,
    resources,
    Container
) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("UserDefaultsEntry", {
        beforeEach: function () {
            this.oLogWarningSpy = sandbox.spy(Log, "warning");

            this.aContentProviderIds = ["contentProviderId1", "contentProviderId2"];
            this.oRelevantSystemContext = {
                relevant: true
            };
            this.oNonRelevantSystemContext = {
                relevant: false
            };
            this.oGetServiceStub = sandbox.stub(Container, "getServiceAsync");

            this.oHasParametersStub = sandbox.stub();
            this.oHasParametersStub.withArgs(this.oRelevantSystemContext).resolves(true);
            this.oHasParametersStub.withArgs(this.oNonRelevantSystemContext).resolves(false);

            this.oGetServiceStub.withArgs("UserDefaultParameters").resolves({
                hasRelevantMaintainableParameters: this.oHasParametersStub
            });

            this.oGetSystemContextStub = sandbox.stub();
            this.oGetSystemContextStub.withArgs("contentProviderId1").resolves(this.oRelevantSystemContext);
            this.oGetSystemContextStub.withArgs("contentProviderId2").resolves(this.oRelevantSystemContext);
            this.oGetServiceStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: this.oGetSystemContextStub
            });

            this.oGetContentProviderIdsStub = sandbox.stub();
            this.oGetContentProviderIdsStub.resolves(this.aContentProviderIds);
            this.oGetServiceStub.withArgs("CommonDataModel").resolves({
                getContentProviderIds: this.oGetContentProviderIdsStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            if (Element.getElementById("defaultParametersSelector")) {
                Element.getElementById("defaultParametersSelector").destroy();
            }
        }
    });

    QUnit.test("Check contract property", function (assert) {
        // Arrange
        // Act
        var oContract = UserDefaultsEntry.getEntry();

        // Assert
        assert.equal(oContract.id, "userDefaultEntry", "id is correct");
        assert.equal(oContract.entryHelpID, "defaultParameters", "entryHelpID is correct");
        assert.equal(oContract.title, resources.i18n.getText("defaultsValuesEntry"), "title is correct");
        assert.equal(oContract.valueResult, null, "valueResult is null");
        assert.equal(oContract.contentResult, null, "contentResult is null");
        assert.equal(oContract.icon, undefined, "icon is correct");
        assert.equal(oContract.provideEmptyWrapper, undefined, "provideEmptyWrapper is correct");
        assert.equal(typeof oContract.valueArgument, "function", "valueArgument is correct");
        assert.equal(typeof oContract.contentFunc, "function", "contentFunc is function");
        assert.equal(typeof oContract.onSave, "function", "onSave is function");
        assert.equal(typeof oContract.onCancel, "function", "onCancel is function");
    });

    QUnit.test("valueArgument returns the correct object if the value resolves", function (assert) {
        // Arrange
        var oUserDefaultsEntry = UserDefaultsEntry.getEntry();

        // Act
        return oUserDefaultsEntry.valueArgument().then(function (oValue) {
            // Assert
            assert.deepEqual(oValue, { value: true }, "The correct value argument is returned.");

            assert.strictEqual(this.oGetContentProviderIdsStub.callCount, 1, "getContentProviderIds was called once");
            assert.strictEqual(this.oGetSystemContextStub.callCount, 2, "getSystemContext was called two times");
            assert.strictEqual(this.oHasParametersStub.callCount, 2, "hasRelevantMaintainableParameters was called two times");
        }.bind(this));
    });

    QUnit.test("valueArgument resolves if atleast one contentProvider has maintainable parameters", function (assert) {
        // Arrange
        var oUserDefaultsEntry = UserDefaultsEntry.getEntry();
        this.oGetSystemContextStub.withArgs("contentProviderId1").resolves(this.oNonRelevantSystemContext);

        // Act
        return oUserDefaultsEntry.valueArgument().then(function (oValue) {
            // Assert
            assert.deepEqual(oValue, { value: true }, "The correct value argument is returned.");

            assert.strictEqual(this.oGetContentProviderIdsStub.callCount, 1, "getContentProviderIds was called once");
            assert.strictEqual(this.oGetSystemContextStub.callCount, 2, "getSystemContext was called two times");
            assert.strictEqual(this.oHasParametersStub.callCount, 2, "hasRelevantMaintainableParameters was called two times");
        }.bind(this));
    });

    QUnit.test("valueArgument returns the correct object if there are no maintainable parameters", function (assert) {
        // Arrange
        var oUserDefaultsEntry = UserDefaultsEntry.getEntry();
        this.oGetSystemContextStub.withArgs(sinon.match.any).resolves(this.oNonRelevantSystemContext);

        // Act
        return oUserDefaultsEntry.valueArgument().then(function (oValue) {
            // Assert
            assert.deepEqual(oValue, { value: false }, "The correct value argument is returned.");

            assert.strictEqual(this.oGetContentProviderIdsStub.callCount, 1, "getContentProviderIds was called once");
            assert.strictEqual(this.oGetSystemContextStub.callCount, 2, "getSystemContext was called two times");
            assert.strictEqual(this.oHasParametersStub.callCount, 2, "hasRelevantMaintainableParameters was called two times");
        }.bind(this));
    });

    QUnit.test("valueArgument returns the correct object if hasRelevantMaintainableParameters fails for all systemContexts", function (assert) {
        // Arrange
        var oUserDefaultsEntry = UserDefaultsEntry.getEntry();
        this.oHasParametersStub.withArgs(sinon.match.any).resolves(undefined);

        // Act
        return oUserDefaultsEntry.valueArgument().then(function (oValue) {
            // Assert
            assert.deepEqual(oValue, { value: false }, "The correct value argument is returned.");

            assert.strictEqual(this.oGetContentProviderIdsStub.callCount, 1, "getContentProviderIds was called once");
            assert.strictEqual(this.oGetSystemContextStub.callCount, 2, "getSystemContext was called two times");
            assert.strictEqual(this.oHasParametersStub.callCount, 2, "hasRelevantMaintainableParameters was called two times");
        }.bind(this));
    });

    QUnit.test("valueArgument defaults contentProviderId to empty space if the CommonDataModel fails", function (assert) {
        // Arrange
        var oUserDefaultsEntry = UserDefaultsEntry.getEntry();
        this.oGetServiceStub.withArgs("CommonDataModel").rejects();
        this.oGetSystemContextStub.withArgs("").resolves(this.oRelevantSystemContext);

        // Act
        return oUserDefaultsEntry.valueArgument().then(function (oValue) {
            // Assert
            assert.deepEqual(oValue, { value: true }, "The correct value argument is returned.");

            assert.strictEqual(this.oGetContentProviderIdsStub.callCount, 0, "getContentProviderIds was not called");
            assert.strictEqual(this.oGetSystemContextStub.callCount, 1, "getSystemContext was called once");
            assert.strictEqual(this.oHasParametersStub.callCount, 1, "hasRelevantMaintainableParameters was called once");
        }.bind(this));
    });

    QUnit.test("valueArgument defaults contentProviderId to empty space if no content provider is available", function (assert) {
        // Arrange
        var oUserDefaultsEntry = UserDefaultsEntry.getEntry();
        this.oGetContentProviderIdsStub.resolves([]);
        this.oGetSystemContextStub.withArgs("").resolves(this.oRelevantSystemContext);

        // Act
        return oUserDefaultsEntry.valueArgument().then(function (oValue) {
            // Assert
            assert.deepEqual(oValue, { value: true }, "The correct value argument is returned.");

            assert.strictEqual(this.oGetContentProviderIdsStub.callCount, 1, "getContentProviderIds was called once");
            assert.strictEqual(this.oGetSystemContextStub.callCount, 1, "getSystemContext was called once");
            assert.strictEqual(this.oHasParametersStub.callCount, 1, "hasRelevantMaintainableParameters was called once");
        }.bind(this));
    });

    QUnit.test("contentFunc: create UserDefaults view", function (assert) {
        // Arrange
        var oUserDefaultsEntry = UserDefaultsEntry.getEntry();

        // Act
        return oUserDefaultsEntry.contentFunc().then(function (oComponentContainer) {
            // Assert
            assert.equal(oComponentContainer.getId(), "defaultParametersSelector", "The correct container was created");
            assert.equal(oComponentContainer.getName(),
                "sap.ushell.components.shell.Settings.userDefaults", "The correct container was created");
        });
    });

    QUnit.test("onSave: resolve promise when view was not created", function (assert) {
        // Arrange
        var oUserDefaultsEntry = UserDefaultsEntry.getEntry();

        // Act
        return oUserDefaultsEntry.onSave().then(function () {
            // Assert
            assert.ok(this.oLogWarningSpy.calledOnce, "the warning was logged");
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved when no view");
        });
    });

    QUnit.test("onSave: call the onSave from component", function (assert) {
        // Arrange
        var oUserDefaultsEntry = UserDefaultsEntry.getEntry();
        var oComponentInstance = {
            onSave: sandbox.stub().resolves()
        };

        // Act
        return oUserDefaultsEntry.contentFunc().then(function (oComponentContainer) {
            sandbox.stub(oComponentContainer, "getComponentInstance").returns(oComponentInstance);
            return oUserDefaultsEntry.onSave();
        }).then(function () {
            // Assert
            assert.ok(oComponentInstance.onSave.calledOnce, "onSave of the controller was called");
        }, function () {
            assert.ok(false, "The promise should be resolved when component is created");
        });
    });

    QUnit.test("onCancel: resolve promise when view was not created", function (assert) {
        // Arrange
        var oUserDefaultsEntry = UserDefaultsEntry.getEntry();

        // Act
        oUserDefaultsEntry.onCancel();

        // Assert
        assert.ok(this.oLogWarningSpy.calledOnce, "the warning was logged");
    });

    QUnit.test("onCancel: call the onCancel from Component", function (assert) {
        // Arrange
        var oComponentInstance = {
            onCancel: sandbox.stub().resolves()
        };
        var oUserDefaultsEntry = UserDefaultsEntry.getEntry();

        // Act
        return oUserDefaultsEntry.contentFunc().then(function (oComponentContainer) {
            sandbox.stub(oComponentContainer, "getComponentInstance").returns(oComponentInstance);
            oUserDefaultsEntry.onCancel();

            // Assert
            assert.ok(oComponentInstance.onCancel.calledOnce, "onCancel of the controller was called");
        });
    });
});
