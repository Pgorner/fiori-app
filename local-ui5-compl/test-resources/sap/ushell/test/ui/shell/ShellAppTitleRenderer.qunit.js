// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.shell.ShellAppTitle
 */
sap.ui.define([
    "sap/ui/core/Element",
    "sap/base/util/ObjectPath",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/ui/shell/NavigationMiniTile",
    "sap/ushell/test/utils",
    "sap/ushell/state/ShellModel",
    "sap/ushell/state/StateManager"
], (
    Element,
    ObjectPath,
    AppLifeCycle,
    Container,
    EventHub,
    NavigationMiniTile,
    testUtils,
    ShellModel,
    StateManager
) => {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox();

    QUnit.module("sap.ushell.ui.shell.ShellAppTitle", {
        beforeEach: async function () {
            ObjectPath.create("sap-ushell-config.renderers.fiori2.componentData.config").rootIntent = "Shell-home";
            QUnit.sap.ushell.createTestDomRef(); // used to place the Renderer

            await Container.init("local");

            this.oRendererControl = await Container.createRendererInternal("fiori2");
            this.oRendererControl.placeAt("qunit-canvas");
        },
        afterEach: function () {
            this.oRendererControl.destroy();
            sandbox.restore();
            EventHub._reset();
            Container.resetServices();
            StateManager.resetAll();
        }
    });

    QUnit.test("Renderer Test", async (assert) => {
        await testUtils.waitForEventHubEvent("RendererLoaded");

        // prepare event data to simulate ShellUIService callback on the shell-controller for setting title
        const oShellHeader = Element.getElementById("shell-header");
        const oAppTitle = oShellHeader.getAppTitle();
        EventHub.emit("CoreResourcesComplementLoaded");
        await testUtils.waitForEventHubEvents([
            // need to wait until Nav Menu gets created as it is post-core-ext control now....
            "loadRendererExtensions",
            // Sometimes the test runs before the initial title got set,
            // leading to the title set by the test being overwritten by e.g. "Home"
            "TitleChanged"
        ]);

        const sTitleNew = "Application's title";

        AppLifeCycle.getShellUIService().setTitle(sTitleNew);

        const sNavMenu = oAppTitle.getNavigationMenu();
        const oNavMenu = Element.getElementById(sNavMenu);
        assert.strictEqual(oNavMenu.getItems().length, 0, "check that no hierarchy items exist on nav menu");
        // (1) check text was modified in app title
        assert.strictEqual(oAppTitle.getText(), "Application's title", "Check application title");
        // (2) see that navigation menu exists but no hierarchy items added

        // prepare event data to simulate ShellUIService callback on the shell-controller for setting hierarchy which was changed
        const aHierarchyNew = [{
            title: "Item",
            subtitle: "Item 2",
            icon: "someIconURI"
        }];

        // trigger the event callback
        AppLifeCycle.getShellUIService().setHierarchy(aHierarchyNew);

        // (4) check that title was not changed
        assert.strictEqual(oAppTitle.getText(), "Application's title", "Check application title");

        // (5) check that a hierarchy item was created
        assert.strictEqual(oNavMenu.getItems() && oNavMenu.getItems().length, 1, "check that hierarchy item created on the navigation menu");

        // (6) validate the hierarchy item which was created according to the factory method as created within the shell-view
        const oHierarchyItem = oNavMenu.getItems()[0];
        let oExpectedResult = {
            title: "Item",
            subtitle: "Item 2",
            icon: "someIconURI"
        };
        assert.ok(oHierarchyItem.isA("sap.m.StandardListItem"), "check that hierarchy item created");
        assert.strictEqual(oHierarchyItem.getProperty("title"), oExpectedResult.title, "check that hierarchy property assigned");
        assert.strictEqual(oHierarchyItem.getProperty("description"), oExpectedResult.subtitle, "check that hierarchy property assigned");
        assert.strictEqual(oHierarchyItem.getProperty("icon"), oExpectedResult.icon, "check that hierarchy property assigned");

        // prepare event data to simulate ShellUIService callback on the shell-controller for setting Related-Apps which were changed
        const aRelatedApps = [{
            title: "App 1",
            subtitle: "App1 subtitle",
            icon: "someIconURI",
            intent: "#someintent1"
        }, {
            title: "Item",
            subtitle: "Item 2",
            icon: "someIconURI",
            intent: "#someintent2"
        }];

        // trigger the event callback
        AppLifeCycle.getShellUIService().setRelatedApps(aRelatedApps);

        const aHierarchy = ShellModel.getModel().getProperty("/application/hierarchy");
        assert.strictEqual(aHierarchy.length, 1, "application/hierarchy contains the expected number of entries");

        const oNavMenuItems = oNavMenu.getItems();
        const oNavMenuMiniTiles = oNavMenu.getMiniTiles();

        // (7) check that title was not changed
        assert.strictEqual(oAppTitle.getText(), "Application's title", "Check application title");

        // (8) check that a hierarchy item was not modified AND relatedApps created correctly
        assert.ok(Array.isArray(oNavMenuItems), "got nav menu items as an array");
        assert.ok(Array.isArray(oNavMenuMiniTiles), "got nav menu mini tiles as an array");
        assert.strictEqual(oNavMenuItems.length, 1, "check that hierarchy item created was not changed due to setting related apps");
        assert.strictEqual(oNavMenuMiniTiles.length, 2, "check that related apps hierarchy item created on the navigation menu");

        // (9) validate the related Apps items which was created according to the factory method as created within the shell-view
        let oRelatedAppMiniTile = oNavMenuMiniTiles[0];
        oExpectedResult = {
            title: "App 1",
            subtitle: "App1 subtitle",
            icon: "someIconURI",
            intent: "#someintent1"
        };
        assert.ok(oRelatedAppMiniTile instanceof NavigationMiniTile, "check that related app item created");
        assert.strictEqual(oRelatedAppMiniTile.getProperty("title"), oExpectedResult.title, "check that related app property assigned");
        assert.strictEqual(oRelatedAppMiniTile.getProperty("subtitle"), oExpectedResult.subtitle, "check that related app property assigned");
        assert.strictEqual(oRelatedAppMiniTile.getProperty("icon"), oExpectedResult.icon, "check that related app property assigned");
        assert.strictEqual(oRelatedAppMiniTile.getProperty("intent"), oExpectedResult.intent, "check that related app property assigned");

        oRelatedAppMiniTile = oNavMenu.getMiniTiles()[1];
        oExpectedResult = {
            title: "Item",
            subtitle: "Item 2",
            icon: "someIconURI",
            intent: "#someintent2"
        };
        assert.ok(oRelatedAppMiniTile instanceof NavigationMiniTile, "check that related app item created");
        assert.strictEqual(oRelatedAppMiniTile.getProperty("title"), oExpectedResult.title, "check that related app property assigned");
        assert.strictEqual(oRelatedAppMiniTile.getProperty("subtitle"), oExpectedResult.subtitle, "check that related app property assigned");
        assert.strictEqual(oRelatedAppMiniTile.getProperty("icon"), oExpectedResult.icon, "check that related app property assigned");
        assert.strictEqual(oRelatedAppMiniTile.getProperty("intent"), oExpectedResult.intent, "check that related app property assigned");

        // prepare event data to simulate ShellUIService callback on the shell-controller for setting Related-Apps which were changed
        const aRelatedApps2 = [
            { title: "App 1", subtitle: "App1 subtitle", icon: "someIconURI", intent: "#someintent1" },
            { title: "App 2", subtitle: "Item 2", icon: "someIconURI", intent: "#someintent2" },
            { title: "App 3", subtitle: "App1 subtitle", icon: "someIconURI", intent: "#someintent1" },
            { title: "App 4", subtitle: "Item 2", icon: "someIconURI", intent: "#someintent2" },
            { title: "App 5", subtitle: "App1 subtitle", icon: "someIconURI", intent: "#someintent1" },
            { title: "App 6", subtitle: "Item 2", icon: "someIconURI", intent: "#someintent2" },
            { title: "App 7", subtitle: "App1 subtitle", icon: "someIconURI", intent: "#someintent1" },
            { title: "App 8 ", subtitle: "Item 2", icon: "someIconURI", intent: "#someintent2" },
            { title: "App 9", subtitle: "App1 subtitle", icon: "someIconURI", intent: "#someintent1" },
            { title: "App 10", subtitle: "Item 2", icon: "someIconURI", intent: "#someintent2" },
            { title: "App 11", subtitle: "Item 2", icon: "someIconURI", intent: "#someintent2" }
        ];

        // trigger the event callback
        AppLifeCycle.getShellUIService().setRelatedApps(aRelatedApps2);

        // (10) check that a hierarchy item was not modified due to related apps change
        assert.strictEqual(oNavMenu.getItems().length, 1, "check that hierarchy item created was not changed due to setting related apps");

        // (11) MAKE SURE no more than 9 related apps reside on the navigation menu
        // although event passed 11 related apps in array
        assert.strictEqual(oNavMenu.getMiniTiles().length, 9, "check that related apps hierarchy item created on the navigation menu");

        oRelatedAppMiniTile = oNavMenu.getMiniTiles()[8];
        oExpectedResult = {
            title: "App 9",
            subtitle: "App1 subtitle",
            icon: "someIconURI",
            intent: "#someintent1"
        };

        // (12) MAKE SURE last related app created is the 9th related app from the event data
        assert.ok(oRelatedAppMiniTile instanceof NavigationMiniTile, "check that related app item created");
        assert.strictEqual(oRelatedAppMiniTile.getProperty("title"), oExpectedResult.title, "check that related app property assigned");
        assert.strictEqual(oRelatedAppMiniTile.getProperty("subtitle"), oExpectedResult.subtitle, "check that related app property assigned");
        assert.strictEqual(oRelatedAppMiniTile.getProperty("icon"), oExpectedResult.icon, "check that related app property assigned");
        assert.strictEqual(oRelatedAppMiniTile.getProperty("intent"), oExpectedResult.intent, "check that related app property assigned");
    });

});
