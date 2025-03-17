// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui5service.ShellUIService
 */
sap.ui.define([
    "sap/ushell/ui5service/ShellUIService",
    "sap/base/Log",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/EventHub",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/state/StateManager",
    "sap/ushell/state/ShellModel"
], (
    ShellUIService,
    Log,
    Config,
    ushellResources,
    AppConfiguration,
    EventHub,
    hasher,
    StateManager,
    ShellModel
) => {
    "use strict";

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    // shortcut for sap.ushell.state.StateManager.Operation
    const Operation = StateManager.Operation;

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const ShellMode = StateManager.ShellMode;

    /* global sinon, QUnit */

    const sandbox = sinon.sandbox.create();

    QUnit.module("sap.ushell.ui5service.ShellUIService constructor", {
        beforeEach: async function () {
            sandbox.stub(StateManager, "getShellMode").returns(ShellMode.Default);
            sandbox.stub(StateManager, "getLaunchpadState").returns(LaunchpadState.App);
            this.oShellUIService = new ShellUIService({
                scopeObject: { getId: sandbox.stub().returns("componentId") },
                scopeType: "component"
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellUIService.destroy();
        }
    });

    QUnit.test("Inits the service as expected", function (assert) {
        assert.strictEqual(this.oShellUIService.getActive(), true, "Service is active");
        assert.strictEqual(this.oShellUIService.getTitle(), "", "no title set");
    });

    QUnit.module("_getHierarchyDefaultValue", {
        beforeEach: async function () {
            sandbox.stub(Config, "last");
            Config.last.withArgs("/core/shellHeader/rootIntent").returns("Shell-home");
            Config.last.withArgs("/core/spaces/enabled").returns(true);

            sandbox.stub(StateManager, "getShellMode").returns(ShellMode.Default);
            sandbox.stub(StateManager, "getLaunchpadState").returns(LaunchpadState.App);

            this.oShellUIService = new ShellUIService({
                scopeObject: { getId: sandbox.stub().returns("componentId") },
                scopeType: "component"
            });

            sandbox.stub(ushellResources.i18n, "getText").returnsArg(0);
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellUIService.destroy();
        }
    });

    QUnit.test("SpacesPages Mode: Add Page to Navigation Hierarchy in an App", function (assert) {
        // Arrange
        Config.last.withArgs("/core/spaces/currentSpaceAndPage").returns({
            pageTitle: "Test Page",
            spaceTitle: "Test Space",
            hash: "page-Hash"
        });

        const aExpectedHierarchy = [{
            icon: "sap-icon://space-navigation",
            title: "Test Page",
            subtitle: "Test Space",
            intent: "#page-Hash"
        }, {
            icon: "sap-icon://home",
            title: "actionHomePage",
            intent: "#Shell-home"
        }];

        // Act
        const aHierarchy = this.oShellUIService._getHierarchyDefaultValue();

        // Assert
        assert.deepEqual(aHierarchy, aExpectedHierarchy, "Expected history entries are there.");
    });

    QUnit.test("No Space and Page Info -> no Hierarchy Entry for the Page", function (assert) {
        // Arrange
        const aExpectedHierarchy = [{
            icon: "sap-icon://home",
            title: "actionHomePage",
            intent: "#Shell-home"
        }];

        // Act
        const aHierarchy = this.oShellUIService._getHierarchyDefaultValue();

        // Assert
        assert.deepEqual(aHierarchy, aExpectedHierarchy, "Expected history entries are there.");
    });

    QUnit.test("SpacesPages Mode on Home page -> no entry to add", function (assert) {
        // Arrange
        StateManager.getLaunchpadState.returns(LaunchpadState.Home);
        Config.last.withArgs("/core/spaces/currentSpaceAndPage").returns({
            pageTitle: "Test Page",
            spaceTitle: "Test Space",
            hash: "pageHash"
        });

        const aExpectedHierarchy = [];

        // Act
        const aHierarchy = this.oShellUIService._getHierarchyDefaultValue();

        // Assert
        assert.deepEqual(aHierarchy, aExpectedHierarchy, "Expected history entries are there.");
    });

    QUnit.module("_getTitleDefaultValue", {
        beforeEach: async function () {
            sandbox.stub(StateManager, "getShellMode").returns(ShellMode.Default);
            sandbox.stub(StateManager, "getLaunchpadState").returns(LaunchpadState.App);

            this.oShellUIService = new ShellUIService({
                scopeObject: { getId: sandbox.stub().returns("componentId") },
                scopeType: "component"
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellUIService.destroy();
        }
    });

    QUnit.test("valid title found in AppConfiguration", function (assert) {
        // Arrange
        sandbox.stub(AppConfiguration, "getMetadata").returns({ title: "App Title Test" });

        // Act
        const oTitle = this.oShellUIService._getTitleDefaultValue();
        // Assert
        assert.strictEqual(oTitle, "App Title Test", "Valid app title was returned.");
    });

    QUnit.test("no valid title found in AppConfiguration", function (assert) {
        // Arrange
        sandbox.stub(AppConfiguration, "getMetadata");
        // Act
        const oTitle = this.oShellUIService._getTitleDefaultValue();
        // Assert
        assert.strictEqual(oTitle, "", "Empty string for app title was returned.");
    });

    QUnit.module("setHierarchy", {
        beforeEach: async function () {
            sandbox.stub(StateManager, "getShellMode").returns(ShellMode.Default);
            sandbox.stub(StateManager, "getLaunchpadState").returns(LaunchpadState.App);
            sandbox.stub(StateManager, "updateBaseStates");
            sandbox.stub(StateManager, "updateCurrentState");

            this.oShellUIService = new ShellUIService({
                scopeObject: { getId: sandbox.stub().returns("componentId") },
                scopeType: "component"
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellUIService.destroy();
        }
    });

    QUnit.test("With valid parameters called on active service with LaunchpadState app", function (assert) {
        // Arrange
        const aHierarchy = [{
            title: "Page Title",
            icon: "sap-icon://home",
            intent: "#PageIntent"
        }];
        const aExpectedHierarchy = [{
            title: "Page Title",
            icon: "sap-icon://home",
            intent: "#PageIntent"
        }, {
            title: "Home",
            icon: "sap-icon://home",
            intent: "#"
        }];
        const aExpectedCurrentStateArgs = [
            "application.hierarchy",
            Operation.Set,
            aExpectedHierarchy
        ];

        // Act
        this.oShellUIService.setHierarchy(aHierarchy);

        // Assert
        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.deepEqual(StateManager.updateCurrentState.getCall(0).args, aExpectedCurrentStateArgs, "updateCurrentState was called with correct parameters");
    });

    QUnit.test("With valid parameters called on active service with LaunchpadState home", function (assert) {
        // Arrange
        const aHierarchy = [{
            title: "Page Title",
            icon: "sap-icon://home",
            intent: "#PageIntent"
        }];
        StateManager.getLaunchpadState.returns(LaunchpadState.Home);
        const aExpectedHierarchy = [{
            title: "Page Title",
            icon: "sap-icon://home",
            intent: "#PageIntent"
        }];
        const aExpectedBaseStateArgs = [
            [LaunchpadState.Home],
            "application.hierarchy",
            Operation.Set,
            aExpectedHierarchy
        ];
        const aExpectedCurrentStateArgs = [
            "application.hierarchy",
            Operation.Set,
            aExpectedHierarchy
        ];

        // Act
        this.oShellUIService.setHierarchy(aHierarchy);

        // Assert
        assert.deepEqual(StateManager.updateBaseStates.getCall(0).args, aExpectedBaseStateArgs, "updateBaseState was called with correct parameters");
        assert.deepEqual(StateManager.updateCurrentState.getCall(0).args, aExpectedCurrentStateArgs, "updateCurrentState was called with correct parameters");
    });

    QUnit.test("With valid parameters called on deactivated service with LaunchpadState app", function (assert) {
        // Arrange
        const aHierarchy = [{
            title: "Page Title",
            icon: "sap-icon://home",
            intent: "#PageIntent"
        }];
        this.oShellUIService.setActive(false);

        // Act
        this.oShellUIService.setHierarchy(aHierarchy);

        // Assert
        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.strictEqual(StateManager.updateCurrentState.callCount, 0, "updateCurrentState was not called");
    });

    QUnit.test("With invalid parameter called on activated service with LaunchpadState app", function (assert) {
        // Arrange
        const aHierarchy = [{
            title: "Page Title",
            icon: "sap-icon://home",
            intent: "#PageIntent",
            invasion: true
        }];

        // Act & Assert
        assert.throws(() => {
            this.oShellUIService.setHierarchy(aHierarchy);
        }, "Error was thrown");

        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.strictEqual(StateManager.updateCurrentState.callCount, 0, "updateCurrentState was not called");
    });

    QUnit.test("With invalid parameter called on deactivated service with LaunchpadState app", function (assert) {
        // Arrange
        const aHierarchy = [{
            title: "Page Title",
            icon: "sap-icon://home",
            intent: "#PageIntent",
            invasion: true
        }];
        this.oShellUIService.setActive(false);

        // Act
        this.oShellUIService.setHierarchy(aHierarchy);

        // Assert
        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.strictEqual(StateManager.updateCurrentState.callCount, 0, "updateCurrentState was not called");
    });

    QUnit.module("setTitle", {
        beforeEach: async function () {
            sandbox.stub(StateManager, "getShellMode").returns(ShellMode.Default);
            sandbox.stub(StateManager, "getLaunchpadState").returns(LaunchpadState.App);
            sandbox.spy(StateManager, "updateBaseStates");
            sandbox.spy(StateManager, "updateCurrentState");

            this.oShellUIService = new ShellUIService({
                scopeObject: { getId: sandbox.stub().returns("componentId") },
                scopeType: "component"
            });

            sandbox.stub(EventHub, "emit");
            sandbox.stub(AppConfiguration, "getMetadata").returns({ title: "Default Title" });
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellUIService.destroy();
        }
    });

    QUnit.test("With valid parameters called on active service", function (assert) {
        // Arrange
        const sTitle = "Shell Header Title";
        const aExpectedCurrentStateArgs = [
            "application.title",
            Operation.Set,
            "Shell Header Title"
        ];

        // Act
        this.oShellUIService.setTitle(sTitle);

        // Assert
        assert.strictEqual(this.oShellUIService.getTitle(), sTitle, "Title was set correctly");
        assert.strictEqual(EventHub.emit.getCall(0).args[1], sTitle, "EventHub.emit was called with correct parameters");
        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.deepEqual(StateManager.updateCurrentState.getCall(0).args, aExpectedCurrentStateArgs, "updateCurrentState was called with correct parameters");
    });

    QUnit.test("With no parameter called on active service", function (assert) {
        // Arrange
        const aExpectedCurrentStateArgs = [
            "application.title",
            Operation.Set,
            "Default Title"
        ];

        // Act
        this.oShellUIService.setTitle();

        // Assert
        assert.strictEqual(this.oShellUIService.getTitle(), "Default Title", "Last Set Title was set to default title");
        assert.strictEqual(EventHub.emit.getCall(0).args[1], "Default Title", "EventHub.emit was called with correct parameters");
        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.deepEqual(StateManager.updateCurrentState.getCall(0).args, aExpectedCurrentStateArgs, "updateCurrentState was called with correct parameters");
    });

    QUnit.test("With valid parameters called on deactivated service", function (assert) {
        // Arrange
        const sTitle = "Shell Header Title";
        this.oShellUIService.setActive(false);

        // Act
        this.oShellUIService.setTitle(sTitle);

        // Assert
        assert.strictEqual(this.oShellUIService.getTitle(), undefined, "Title was not set");
        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.strictEqual(StateManager.updateCurrentState.callCount, 0, "updateCurrentState was not called");
    });

    QUnit.test("With valid parameters called on destroyed service", function (assert) {
        // Arrange
        const sTitle = "Shell Header Title";
        this.oShellUIService.destroy();

        // Act
        this.oShellUIService.setTitle(sTitle);

        // Assert
        assert.strictEqual(this.oShellUIService.getTitle(), undefined, "Title was not set");
        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.strictEqual(StateManager.updateCurrentState.callCount, 0, "updateCurrentState was not called");
    });

    QUnit.test("With no parameter called on deactivated service", function (assert) {
        // Arrange
        this.oShellUIService.setActive(false);

        // Act
        this.oShellUIService.setTitle();

        // Assert
        assert.strictEqual(this.oShellUIService.getTitle(), undefined, "Title was not set");
        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.strictEqual(StateManager.updateCurrentState.callCount, 0, "updateCurrentState was not called");
    });

    QUnit.test("With undefined string and second optional parameter called on active service", function (assert) {
        // Arrange
        this.oShellUIService.setActive(true);
        const aExpectedCurrentStateArgs = [
            "application.title",
            Operation.Set,
            undefined
        ];

        // Act
        this.oShellUIService.setTitle(undefined, true);

        // Assert
        assert.strictEqual(this.oShellUIService.getTitle(), undefined, "Title was not set");
        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.deepEqual(StateManager.updateCurrentState.getCall(0).args, aExpectedCurrentStateArgs, "updateCurrentState was called with correct parameters");
    });

    QUnit.test("With empty string and second optional parameter called on active service", function (assert) {
        // Arrange
        const sTitle = "";
        this.oShellUIService.setActive(true);
        const aExpectedCurrentStateArgs = [
            "application.title",
            Operation.Set,
            ""
        ];

        // Act
        this.oShellUIService.setTitle(sTitle, true);

        // Assert
        assert.strictEqual(this.oShellUIService.getTitle(), "", "Title was not set");
        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.deepEqual(StateManager.updateCurrentState.getCall(0).args, aExpectedCurrentStateArgs, "updateCurrentState was called with correct parameters");
    });

    QUnit.test("With valid parameter and currentState home called", function (assert) {
        // Arrange
        StateManager.getLaunchpadState.returns(LaunchpadState.Home);
        const sTitle = "Shell Header Title";
        this.oShellUIService.setActive(true);
        const aExpectedBaseStateArgs = [
            [LaunchpadState.Home],
            "application.title",
            Operation.Set,
            "Shell Header Title"
        ];
        const aExpectedCurrentStateArgs = [
            "application.title",
            Operation.Set,
            "Shell Header Title"
        ];

        // Act
        this.oShellUIService.setTitle(sTitle);

        // Assert
        assert.strictEqual(this.oShellUIService.getTitle(), sTitle, "Title was set");
        assert.deepEqual(StateManager.updateBaseStates.getCall(0).args, aExpectedBaseStateArgs, "updateBaseState was called with correct parameters");
        assert.deepEqual(StateManager.updateCurrentState.getCall(0).args, aExpectedCurrentStateArgs, "updateCurrentState was called with correct parameters");
    });

    QUnit.test("With invalid parameters called on active service", function (assert) {
        // Arrange
        const sTitle = 123;

        // Act && Assert
        assert.throws(() => {
            this.oShellUIService.setTitle(sTitle);
        }, "Error was thrown");

        // Assert
        assert.strictEqual(EventHub.emit.callCount, 0, "EventHub.emit was not called");
        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.strictEqual(StateManager.updateCurrentState.callCount, 0, "updateCurrentState was not called");
    });

    QUnit.module("setBackNavigation", {
        beforeEach: async function () {
            this.oComponent = { getId: sandbox.stub().returns("componentId") };
            this.oShellUIService = new ShellUIService({
                scopeObject: this.oComponent,
                scopeType: "component"
            });

            this.oBackNavigationChangedHandler = sandbox.stub();
            this.oShellUIService.attachBackNavigationChanged(this.oBackNavigationChangedHandler);
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellUIService.destroy();
        }
    });

    QUnit.test("With callback function on active service", function (assert) {
        // Arrange
        function fnCallback () {
            return "Back Navigation Callback";
        }

        // Act
        this.oShellUIService.setBackNavigation(fnCallback);

        // Assert
        const oEventParameters = this.oBackNavigationChangedHandler.getCall(0).args[0].getParameters();
        assert.strictEqual(oEventParameters.data, fnCallback, "backNavigationChanged event was fired with handler");
        assert.strictEqual(oEventParameters.component, this.oComponent, "backNavigationChanged event was fired with component");
    });

    QUnit.test("With callback function on deactivated service", function (assert) {
        // Arrange
        function fnCallback () {
            return "Back Navigation Callback";
        }
        this.oShellUIService.setActive(false);

        // Act
        this.oShellUIService.setBackNavigation(fnCallback);

        // Assert
        assert.strictEqual(this.oBackNavigationChangedHandler.callCount, 0, "backNavigationChanged event was not fired");
    });

    QUnit.test("With callback function on destroyed service", function (assert) {
        // Arrange
        function fnCallback () {
            return "Back Navigation Callback";
        }
        this.oShellUIService.destroy();

        // Act
        this.oShellUIService.setBackNavigation(fnCallback);

        // Assert
        assert.strictEqual(this.oBackNavigationChangedHandler.callCount, 0, "backNavigationChanged event was not fired");
    });

    QUnit.test("With malicious callback function on active service", function (assert) {
        // Arrange
        const fnCallback = [function () {
            return "Back Navigation Callback";
        }];
        this.oShellUIService.setActive(true);

        // Act & Assert
        assert.throws(() => {
            this.oShellUIService.setBackNavigation(fnCallback);
        }, "Error was thrown");

        assert.strictEqual(this.oBackNavigationChangedHandler.callCount, 0, "backNavigationChanged event was not fired");
    });

    QUnit.test("With no callback on active service", function (assert) {
        // Act
        this.oShellUIService.setBackNavigation();

        // Assert
        const oEventParameters = this.oBackNavigationChangedHandler.getCall(0).args[0].getParameters();
        assert.strictEqual(oEventParameters.data, undefined, "backNavigationChanged event was fired with handler");
        assert.strictEqual(oEventParameters.component, this.oComponent, "backNavigationChanged event was fired with component");
    });

    QUnit.module("setRelatedApps", {
        beforeEach: async function () {
            sandbox.stub(StateManager, "getShellMode").returns(ShellMode.Default);
            sandbox.stub(StateManager, "getLaunchpadState").returns(LaunchpadState.App);
            sandbox.stub(StateManager, "updateBaseStates");
            sandbox.stub(StateManager, "updateCurrentState");

            this.oShellUIService = new ShellUIService({
                scopeObject: { getId: sandbox.stub().returns("componentId") },
                scopeType: "component"
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellUIService.destroy();
        }
    });

    QUnit.test("With valid parameters on active service", function (assert) {
        // Arrange
        const aRelatedApps = [{
            title: "Related App",
            icon: "sap-icon://home",
            intent: "#RelatedAppIntent"
        }];
        const aExpectedRelatedApps = [{
            title: "Related App",
            icon: "sap-icon://home",
            intent: "#RelatedAppIntent"
        }];
        const aExpectedCurrentStateArgs = [
            "application.relatedApps",
            Operation.Set,
            aExpectedRelatedApps
        ];

        // Act
        this.oShellUIService.setRelatedApps(aRelatedApps);

        // Assert
        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.deepEqual(StateManager.updateCurrentState.getCall(0).args, aExpectedCurrentStateArgs, "updateCurrentState was called with correct parameters");
    });

    QUnit.test("With valid parameters on deactivated service", function (assert) {
        // Arrange
        const aRelatedApps = [{
            title: "Related App",
            icon: "sap-icon://home",
            intent: "#RelatedAppIntent"
        }];
        this.oShellUIService.setActive(false);

        // Act
        this.oShellUIService.setRelatedApps(aRelatedApps);

        // Assert
        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.strictEqual(StateManager.updateCurrentState.callCount, 0, "updateCurrentState was not called");
    });

    QUnit.test("With valid parameters on destroyed service", function (assert) {
        // Arrange
        const aRelatedApps = [{
            title: "Related App",
            icon: "sap-icon://home",
            intent: "#RelatedAppIntent"
        }];
        this.oShellUIService.destroy();

        // Act
        this.oShellUIService.setRelatedApps(aRelatedApps);

        // Assert
        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.strictEqual(StateManager.updateCurrentState.callCount, 0, "updateCurrentState was not called");
    });

    QUnit.test("With invalid parameters on active service", function (assert) {
        // Arrange
        const aRelatedApps = [{
            title: "Related App",
            icon: "sap-icon://home",
            intent: "#RelatedAppIntent",
            invasion: true
        }];

        // Act & Assert
        assert.throws(() => {
            this.oShellUIService.setRelatedApps(aRelatedApps);
        }, "Error was thrown");

        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.strictEqual(StateManager.updateCurrentState.callCount, 0, "updateCurrentState was not called");
    });

    QUnit.test("With invalid parameters on deactivated service", function (assert) {
        // Arrange
        const aRelatedApps = [{
            title: "Related App",
            icon: "sap-icon://home",
            intent: "#RelatedAppIntent",
            invasion: true
        }];
        this.oShellUIService.setActive(false);

        // Act
        this.oShellUIService.setRelatedApps(aRelatedApps);

        // Assert
        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.strictEqual(StateManager.updateCurrentState.callCount, 0, "updateCurrentState was not called");
    });

    QUnit.test("With invalid parameters on destroyed service", function (assert) {
        // Arrange
        const aRelatedApps = [{
            title: "Related App",
            icon: "sap-icon://home",
            intent: "#RelatedAppIntent",
            invasion: true
        }];
        this.oShellUIService.destroy();

        // Act
        this.oShellUIService.setRelatedApps(aRelatedApps);

        // Assert
        assert.strictEqual(StateManager.updateBaseStates.callCount, 0, "updateBaseStates was not called");
        assert.strictEqual(StateManager.updateCurrentState.callCount, 0, "updateCurrentState was not called");
    });

    QUnit.test("With empty parameters on active service and current state home", function (assert) {
        // Arrange
        StateManager.getLaunchpadState.returns(LaunchpadState.Home);
        const aExpectedBaseStateArgs = [
            [LaunchpadState.Home],
            "application.relatedApps",
            Operation.Set,
            []
        ];
        const aExpectedCurrentStateArgs = [
            "application.relatedApps",
            Operation.Set,
            []
        ];

        // Act
        this.oShellUIService.setRelatedApps();

        // Assert
        assert.deepEqual(StateManager.updateBaseStates.getCall(0).args, aExpectedBaseStateArgs, "updateBaseState was called with correct parameters");
        assert.deepEqual(StateManager.updateCurrentState.getCall(0).args, aExpectedCurrentStateArgs, "updateCurrentState was called with correct parameters");
    });

    QUnit.module("_shouldEnableAutoHierarchy", {
        beforeEach: async function () {
            this.oShellUIService = new ShellUIService({
                scopeObject: { getId: sandbox.stub().returns("componentId") },
                scopeType: "component"
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellUIService.destroy();
        }
    });

    QUnit.test("With valid parameters", function (assert) {
        // Arrange
        const oAppComponent = {
            getManifestEntry: sandbox.stub().withArgs("/sap.ui5/services/ShellUIService/settings/setHierarchy").returns("auto")
        };

        // Act
        const bResult = this.oShellUIService._shouldEnableAutoHierarchy(oAppComponent);

        // Assert
        assert.strictEqual(bResult, true, "AutoHierarchy was enabled");
    });

    QUnit.test("With invalid parameters", function (assert) {
        // Arrange
        const oAppComponent = {
            getManifestEntry: sandbox.stub().withArgs("/sap.ui5/services/ShellUIService/settings/setHierarchy").returns("manual")
        };

        // Act
        const bResult = this.oShellUIService._shouldEnableAutoHierarchy(oAppComponent);

        // Assert
        assert.strictEqual(bResult, false, "AutoHierarchy was enabled");
    });

    QUnit.module("_shouldEnableAutoTitle", {
        beforeEach: async function () {
            this.oShellUIService = new ShellUIService({
                scopeObject: { getId: sandbox.stub().returns("componentId") },
                scopeType: "component"
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellUIService.destroy();
        }
    });

    QUnit.test("With valid parameters", function (assert) {
        // Arrange
        const oAppComponent = {
            getManifestEntry: sandbox.stub().withArgs("/sap.ui5/services/ShellUIService/settings/setTitle").returns("auto")
        };

        // Act
        const bResult = this.oShellUIService._shouldEnableAutoTitle(oAppComponent);

        // Assert
        assert.strictEqual(bResult, true, "AutoTitle was enabled");
    });

    QUnit.test("With invalid parameters", function (assert) {
        // Arrange
        const oAppComponent = {
            getManifestEntry: sandbox.stub().withArgs("/sap.ui5/services/ShellUIService/settings/setTitle").returns("manual")
        };

        // Act
        const bResult = this.oShellUIService._shouldEnableAutoTitle(oAppComponent);

        // Assert
        assert.strictEqual(bResult, false, "AutoTitle was enabled");
    });

    QUnit.module("_enableAutoHierarchy", {
        beforeEach: async function () {
            sandbox.stub(Log, "error");

            this.oShellUIService = new ShellUIService({
                scopeObject: { getId: sandbox.stub().returns("componentId") },
                scopeType: "component"
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellUIService.destroy();
        }
    });

    QUnit.test("With valid parameters", function (assert) {
        // Arrange
        const oAppComponent = {
            getRouter: sandbox.stub().returns({
                attachTitleChanged: sandbox.stub().callsFake((fnCallback, oScope) => {
                    const oEvent = {
                        getParameter: sandbox.stub().returns([{
                            title: "Page Title",
                            icon: "sap-icon://home",
                            intent: "#PageIntent"
                        }])
                    };
                    fnCallback.call(oScope, oEvent);
                }
            )})
        };
        sandbox.stub(hasher, "getHash").returns("PageIntent");
        // Act
        this.oShellUIService._enableAutoHierarchy(oAppComponent);

        // Assert
        assert.strictEqual(Log.error.callCount, 0, "Error was not logged");
    });

    QUnit.test("With invalid parameters", function (assert) {
        // Arrange
        const oAppComponent = {
            getRouter: sandbox.stub().returns({
                attachTitleChanged: sandbox.stub().callsFake((fnCallback, oScope) => {
                    const oEvent = {
                        getParameter: sandbox.stub().returns([{
                            title: "Page Title",
                            icon: "sap-icon://home",
                            intent: "#PageIntent"
                        }])
                    };
                    fnCallback.call(oScope, oEvent);
                }
            )})
        };
        sandbox.stub(hasher, "getHash").returns("");

        // Act
        this.oShellUIService._enableAutoHierarchy(oAppComponent);

        // Assert
        assert.strictEqual(Log.error.callCount, 1, "Error was logged");
    });

    QUnit.module("_enableAutoTitle", {
        beforeEach: async function () {
            sandbox.stub(Log, "error");

            this.oShellUIService = new ShellUIService({
                scopeObject: { getId: sandbox.stub().returns("componentId") },
                scopeType: "component"
            });

            sandbox.spy(this.oShellUIService, "setTitle");
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellUIService.destroy();
        }
    });

    QUnit.test("With valid parameters", function (assert) {
        // Arrange
        const done = assert.async();
        const oAppComponent = {
            getRouter: sandbox.stub().returns({
                attachTitleChanged: sandbox.stub().callsFake((fnCallback, oScope) => {
                    const oEvent = {
                        getParameter: sandbox.stub().returns("Page Title")
                    };
                    fnCallback.call(oScope, oEvent);
                }),
                getTitleHistory: sandbox.stub().returns([{ title: "Page Title" }])
            })
        };

        // Act
        this.oShellUIService._enableAutoTitle(oAppComponent);

        setTimeout(() => {
            // Assert
            assert.strictEqual(Log.error.callCount, 0, "Error was not logged");
            assert.strictEqual(this.oShellUIService.setTitle.callCount, 2, "SetTitle was called");
            done();
        }, 0);
    });

    QUnit.test("With invalid parameters", function (assert) {
        // Arrange
        const done = assert.async();
        const oAppComponent = {
            getRouter: sandbox.stub()
        };

        // Act
        setTimeout(() => {
            this.oShellUIService._enableAutoTitle(oAppComponent);
            // Assert
            assert.strictEqual(Log.error.callCount, 1, "Error was logged");
            assert.strictEqual(this.oShellUIService.setTitle.callCount, 0, "SetTitle was not called");
            done();
        }, 0);
    });

    QUnit.module("_getCurrentShellHashWithoutAppRoute", {
        beforeEach: async function () {
            sandbox.stub(Log, "error");

            this.oShellUIService = new ShellUIService({
                scopeObject: { getId: sandbox.stub().returns("componentId") },
                scopeType: "component"
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellUIService.destroy();
        }
    });

    QUnit.test("With URL from hasher", function (assert) {
        // Arrange
        sandbox.stub(hasher, "getHash").returns("PageIntent");

        // Act
        const sResult = this.oShellUIService._getCurrentShellHashWithoutAppRoute();

        // Assert
        assert.strictEqual(Log.error.callCount, 0, "Error was not logged");
        assert.strictEqual(sResult, "#PageIntent", "Hash was returned");
    });

    QUnit.test("With empty URL from hasher", function (assert) {
        // Arrange
        sandbox.stub(hasher, "getHash").returns("");

        // Act
        const sResult = this.oShellUIService._getCurrentShellHashWithoutAppRoute();

        // Assert
        assert.strictEqual(Log.error.callCount, 1, "Error was logged");
        assert.strictEqual(sResult, "", "Empty Hash was returned");
    });

    QUnit.module("_ensureArrayOfObjectOfStrings", {
        beforeEach: async function () {
            sandbox.stub(Log, "error");

            this.oShellUIService = new ShellUIService({
                scopeObject: { getId: sandbox.stub().returns("componentId") },
                scopeType: "component"
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellUIService.destroy();
        }
    });

    QUnit.test("With valid array", function (assert) {
        // Arrange
        const aArray = [{
            title: "Page Title",
            icon: "sap-icon://home",
            intent: "#PageIntent"
        }, {
            title: "Page Title",
            icon: "sap-icon://home",
            intent: "#PageIntent"
        }];

        // Act
        this.oShellUIService._ensureArrayOfObjectOfStrings(aArray);

        // Assert
        assert.ok(true, "no error was thrown");
    });

    QUnit.test("With invalid array", function (assert) {
        // Arrange
        const aArray = ["Page Title", "sap-icon://home", "#PageIntent"];
        const sMethodName = "setHierarchy";

        // Act & Assert
        assert.throws(() => {
            this.oShellUIService._ensureArrayOfObjectOfStrings(aArray, sMethodName);
        }, "Error was thrown");
    });

    QUnit.module("initService", {
        beforeEach: async function () {
            this.oComponent = { getId: sandbox.stub().returns("componentId") };
            this.oShellUIService = new ShellUIService({
                scopeObject: this.oComponent,
                scopeType: "component"
            });
        },
        afterEach: async function () {
            sandbox.restore();
            this.oShellUIService.destroy();
        }
    });

    QUnit.test("Initializes title, hierarchy, relatedApps and backNavigation", async function (assert) {
        // Arrange
        sandbox.spy(this.oShellUIService, "setTitle");
        sandbox.spy(this.oShellUIService, "setHierarchy");
        sandbox.spy(this.oShellUIService, "setRelatedApps");
        sandbox.spy(this.oShellUIService, "setBackNavigation");
        // Act
        this.oShellUIService.initService();
        // Assert
        assert.deepEqual(this.oShellUIService.setTitle.getCall(0).args, [], "setTitle was called correctly");
        assert.deepEqual(this.oShellUIService.setHierarchy.getCall(0).args, [], "setHierarchy was called correctly");
        assert.deepEqual(this.oShellUIService.setRelatedApps.getCall(0).args, [], "setRelatedApps was called correctly");
        assert.deepEqual(this.oShellUIService.setBackNavigation.getCall(0).args, [], "setBackNavigation was called correctly");
    });

    QUnit.test("Resets the title for scube", async function (assert) {
        // Arrange
        sandbox.spy(this.oShellUIService, "setTitle");
        sandbox.stub(hasher, "getHash").returns("Shell-startIntent?param1=value1");
        const aExpectedArgs = ["", true];
        // Act
        this.oShellUIService.initService();
        // Assert
        assert.deepEqual(this.oShellUIService.setTitle.getCall(0).args, aExpectedArgs, "setTitle was called correctly");
    });

    QUnit.test("Skips title, hierarchy, relatedApps and backNavigation for bSkipInitialValues=true", async function (assert) {
        // Arrange
        sandbox.spy(this.oShellUIService, "setTitle");
        sandbox.spy(this.oShellUIService, "setHierarchy");
        sandbox.spy(this.oShellUIService, "setRelatedApps");
        sandbox.spy(this.oShellUIService, "setBackNavigation");

        sandbox.spy(this.oShellUIService, "_shouldEnableAutoHierarchy");
        sandbox.spy(this.oShellUIService, "_shouldEnableAutoTitle");

        // Act
        this.oShellUIService.initService(true);

        // Assert
        assert.strictEqual(this.oShellUIService.setTitle.callCount, 0, "setTitle was not called");
        assert.strictEqual(this.oShellUIService.setHierarchy.callCount, 0, "setHierarchy was not called");
        assert.strictEqual(this.oShellUIService.setRelatedApps.callCount, 0, "setRelatedApps was not called");
        assert.strictEqual(this.oShellUIService.setBackNavigation.callCount, 0, "setBackNavigation was not called");

        assert.strictEqual(this.oShellUIService._shouldEnableAutoHierarchy.callCount, 1, "_shouldEnableAutoHierarchy was called");
        assert.strictEqual(this.oShellUIService._shouldEnableAutoTitle.callCount, 1, "_shouldEnableAutoTitle was called");
    });

    QUnit.module("serviceDestroyed event", {
        beforeEach: async function () {
            this.oShellUIService = new ShellUIService({
                scopeObject: { getId: sandbox.stub().returns("componentId") },
                scopeType: "component"
            });
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Fires an event when service is destroyed", async function (assert) {
        // Arrange
        const oServiceDestroyedHandler = sandbox.stub();
        this.oShellUIService.attachServiceDestroyed(oServiceDestroyedHandler);
        // Act
        this.oShellUIService.destroy();
        // Assert
        assert.strictEqual(oServiceDestroyedHandler.callCount, 1, "The serviceDestroyed event was fired once");
    });

    QUnit.module("Auto Handling", {
        beforeEach: async function () {
            this.oComponent = { getId: sandbox.stub().returns("componentId") };
            this.oShellUIService = new ShellUIService({
                scopeObject: this.oComponent,
                scopeType: "component"
            });
        },
        afterEach: async function () {
            sandbox.restore();
            this.oShellUIService.destroy();
        }
    });

    QUnit.test("initService enables AutoHierarchy", async function (assert) {
        // Arrange
        sandbox.spy(this.oShellUIService, "setHierarchy");
        sandbox.stub(hasher, "getHash").returns("SemanticObject-action");

        let fnTitleChangedHandler;
        const oMockRouter = {
            attachTitleChanged: sandbox.stub().callsFake((fnCallback, oScope) => {
                fnTitleChangedHandler = fnCallback.bind(oScope);
            }),
            getTitleHistory: sandbox.stub().returns([])
        };
        this.oComponent.getRouter = sandbox.stub().returns(oMockRouter);
        this.oComponent.getManifestEntry = sandbox.stub();
        this.oComponent.getManifestEntry.withArgs("/sap.ui5/services/ShellUIService/settings/setHierarchy").returns("auto");

        const oEvent = {
            getParameter: sandbox.stub().withArgs("history").returns([{
                title: "Page Title",
                hash: "ui5Hash"
            }])
        };
        const aExpectedHierarchy = [{
            title: "Page Title",
            intent: "#SemanticObject-action&/ui5Hash"
        }];
        // Act
        this.oShellUIService.initService();
        this.oShellUIService.setHierarchy.resetHistory();
        fnTitleChangedHandler(oEvent);
        // Assert
        assert.deepEqual(this.oShellUIService.setHierarchy.getCall(0).args, [aExpectedHierarchy], "setHierarchy was called correctly");
        const aActualHierarchy = ShellModel.getModel().getProperty("/application/hierarchy");
        assert.deepEqual(aActualHierarchy, aExpectedHierarchy, "The title was set correctly");
    });

    QUnit.test("AutoHierarchy prevents manual hierarchy", async function (assert) {
        // Arrange
        sandbox.spy(this.oShellUIService, "setHierarchy");
        sandbox.stub(hasher, "getHash").returns("SemanticObject-action");

        let fnTitleChangedHandler;
        const oMockRouter = {
            attachTitleChanged: sandbox.stub().callsFake((fnCallback, oScope) => {
                fnTitleChangedHandler = fnCallback.bind(oScope);
            }),
            getTitleHistory: sandbox.stub().returns([])
        };
        this.oComponent.getRouter = sandbox.stub().returns(oMockRouter);
        this.oComponent.getManifestEntry = sandbox.stub();
        this.oComponent.getManifestEntry.withArgs("/sap.ui5/services/ShellUIService/settings/setHierarchy").returns("auto");

        const oEvent = {
            getParameter: sandbox.stub().withArgs("history").returns([{
                title: "Page Title",
                hash: "ui5Hash"
            }])
        };
        const aExpectedHierarchy = [{
            title: "Page Title",
            intent: "#SemanticObject-action&/ui5Hash"
        }];
        // Act
        this.oShellUIService.initService();
        this.oShellUIService.setHierarchy.resetHistory();
        fnTitleChangedHandler(oEvent);
        // Assert
        assert.throws(() => {
            this.oShellUIService.setHierarchy([{
                title: "Manual Title",
                intent: "#ManualIntent"
            }]);
        }, "Error was thrown");
        assert.deepEqual(this.oShellUIService.setHierarchy.getCall(0).args, [aExpectedHierarchy], "setHierarchy was called correctly");
        const aActualHierarchy = ShellModel.getModel().getProperty("/application/hierarchy");
        assert.deepEqual(aActualHierarchy, aExpectedHierarchy, "The title was set correctly");
    });

    QUnit.test("initService enables AutoTitle", async function (assert) {
        // Arrange
        sandbox.spy(this.oShellUIService, "setTitle");
        sandbox.stub(hasher, "getHash").returns("SemanticObject-action");

        let fnTitleChangedHandler;
        const oMockRouter = {
            attachTitleChanged: sandbox.stub().callsFake((fnCallback, oScope) => {
                fnTitleChangedHandler = fnCallback.bind(oScope);
            }),
            getTitleHistory: sandbox.stub().returns([{ title: "Initial Title" }])
        };
        this.oComponent.getRouter = sandbox.stub().returns(oMockRouter);
        this.oComponent.getManifestEntry = sandbox.stub();
        this.oComponent.getManifestEntry.withArgs("/sap.ui5/services/ShellUIService/settings/setTitle").returns("auto");

        const oEvent = {
            getParameter: sandbox.stub().withArgs("title").returns("Page Title")
        };
        const sExpectedTitle = "Page Title";
        // Act
        this.oShellUIService.initService();
        this.oShellUIService.setTitle.resetHistory();
        fnTitleChangedHandler(oEvent);
        // Assert
        assert.deepEqual(this.oShellUIService.setTitle.getCall(0).args, [sExpectedTitle], "setTitle was called correctly");
        const sActualTitle = ShellModel.getModel().getProperty("/application/title");
        assert.strictEqual(sActualTitle, sExpectedTitle, "The title was set correctly");
    });

    QUnit.test("initService enables AutoTitle with initial title", async function (assert) {
        // Arrange
        sandbox.useFakeTimers();
        sandbox.spy(this.oShellUIService, "setTitle");
        sandbox.stub(hasher, "getHash").returns("SemanticObject-action");

        let fnTitleChangedHandler;
        const oMockRouter = {
            attachTitleChanged: sandbox.stub().callsFake((fnCallback, oScope) => {
                fnTitleChangedHandler = fnCallback.bind(oScope);
            }),
            getTitleHistory: sandbox.stub().returns([{ title: "Initial Title" }])
        };
        this.oComponent.getRouter = sandbox.stub().returns(oMockRouter);
        this.oComponent.getManifestEntry = sandbox.stub();
        this.oComponent.getManifestEntry.withArgs("/sap.ui5/services/ShellUIService/settings/setTitle").returns("auto");

        const oEvent = {
            getParameter: sandbox.stub().withArgs("title").returns("Page Title")
        };
        const aExpectedInitialTitle = "Initial Title";
        const sExpectedTitle = "Page Title";
        // Act
        this.oShellUIService.initService();
        this.oShellUIService.setTitle.resetHistory();
        sandbox.clock.tick(0);
        fnTitleChangedHandler(oEvent);
        // Assert
        assert.deepEqual(this.oShellUIService.setTitle.getCall(0).args, [aExpectedInitialTitle], "setTitle was called correctly");
        assert.deepEqual(this.oShellUIService.setTitle.getCall(1).args, [sExpectedTitle], "setTitle was called correctly");
        const sActualTitle = ShellModel.getModel().getProperty("/application/title");
        assert.strictEqual(sActualTitle, sExpectedTitle, "The title was set correctly");
    });

    QUnit.test("AutoTitle prevents manual title", async function (assert) {
        // Arrange
        sandbox.spy(this.oShellUIService, "setTitle");
        sandbox.stub(hasher, "getHash").returns("SemanticObject-action");

        let fnTitleChangedHandler;
        const oMockRouter = {
            attachTitleChanged: sandbox.stub().callsFake((fnCallback, oScope) => {
                fnTitleChangedHandler = fnCallback.bind(oScope);
            }),
            getTitleHistory: sandbox.stub().returns([{ title: "Initial Title" }])
        };
        this.oComponent.getRouter = sandbox.stub().returns(oMockRouter);
        this.oComponent.getManifestEntry = sandbox.stub();
        this.oComponent.getManifestEntry.withArgs("/sap.ui5/services/ShellUIService/settings/setTitle").returns("auto");

        const oEvent = {
            getParameter: sandbox.stub().withArgs("title").returns("Page Title")
        };
        const sExpectedTitle = "Page Title";
        // Act
        this.oShellUIService.initService();
        this.oShellUIService.setTitle.resetHistory();
        fnTitleChangedHandler(oEvent);
        // Assert
        assert.throws(() => {
            this.oShellUIService.setTitle("Manual Title");
        }, "Error was thrown");
        assert.deepEqual(this.oShellUIService.setTitle.getCall(0).args, [sExpectedTitle], "setTitle was called correctly");
        const sActualTitle = ShellModel.getModel().getProperty("/application/title");
        assert.strictEqual(sActualTitle, sExpectedTitle, "The title was set correctly");
    });
});
