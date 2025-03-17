// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.MenuBar.Component
 */
sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/ui/core/Element",
    "sap/ushell/components/shell/PostLoadingHeaderEnhancement/Component",
    "sap/ushell/Container",
    "sap/ushell/state/ShellModel",
    "sap/ui/qunit/utils/nextUIUpdate"
], function (
    Localization,
    Element,
    PostLoadingHeaderEnhancementComponent,
    Container,
    ShellModel,
    nextUIUpdate
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox();

    QUnit.module("The function init", {
        beforeEach: function () {
            sandbox.stub(Element, "getElementById");
            Element.getElementById.withArgs("shell-header").returns({
                getModel: sandbox.stub(),
                updateAggregation: sandbox.stub()
            });
            Element.getElementById.callThrough();

            sandbox.stub(Container, "getRendererInternal").returns({
                getShellConfig: sandbox.stub().returns({
                    moveAppFinderActionToShellHeader: false,
                    moveContactSupportActionToShellHeader: false
                })
            });

            ShellModel.getConfigModel().setProperty("/notificationsCount", 5);

            // stub async call to prevent duplicate id error
            sandbox.stub(PostLoadingHeaderEnhancementComponent.prototype, "_createShellNavigationMenu");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("OverflowButton floating Number is populated, when floating number is part of the model", async function (assert) {
        // Act
        var oComponent = new PostLoadingHeaderEnhancementComponent();

        // Assert
        var oOverflowButton = Element.getElementById("endItemsOverflowBtn");
        oOverflowButton.placeAt("qunit-fixture");
        await nextUIUpdate();

        assert.equal(oOverflowButton.getFloatingNumber(), 5, "The Floating Number is as expected");
        assert.strictEqual(oOverflowButton.getFloatingNumberMaxValue(), 999, "The Floating Number max value is 999");

        oComponent.destroy();
    });

    QUnit.test("Shell back button on RTL hash correct icon", function (assert) {
        sandbox.stub(Localization, "getRTL").returns(true);
        var oComponent = new PostLoadingHeaderEnhancementComponent();

        var oBackBtn = Element.getElementById("backBtn");
        assert.ok(oBackBtn.getIcon().indexOf("feeder-arrow") > 0, "Back button should be with Right Orientation when RTL is ON");

        oComponent.destroy();
    });

    QUnit.module("_createShellNavigationMenu", {
        beforeEach: function () {
            sandbox.stub(Element, "getElementById");
            Element.getElementById.withArgs("shellAppTitle").returns({
                getModel: sandbox.stub(),
                setModel: sandbox.stub(),
                setNavigationMenu: sandbox.stub(),
                updateAggregation: sandbox.stub()
            });
            Element.getElementById.callThrough();
            sandbox.stub(PostLoadingHeaderEnhancementComponent.prototype, "init");
            this.component = new PostLoadingHeaderEnhancementComponent();
            this.oShellConfig = { appState: "home" };
        },
        afterEach: function () {
            sandbox.restore();
            this.component.destroy();
        }
    });

    QUnit.test("binds properties", function (assert) {
        // Act
        return this.component._createShellNavigationMenu(this.oShellConfig).then(function (oShellNavigationMenu) {
            // Assert
            assert.strictEqual(oShellNavigationMenu.getBindingPath("items"), "/application/hierarchy", "items");
            assert.strictEqual(oShellNavigationMenu.getBindingPath("miniTiles"), "/application/relatedApps", "miniTiles");
            assert.strictEqual(oShellNavigationMenu.getBindingPath("visible"), "/shellAppTitleState", "visible");
        });
    });
});
