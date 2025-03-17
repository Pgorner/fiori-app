// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.HeaderManager
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/m/Page",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/ui/AppContainer",
    "sap/ushell/Container"
], function (
    ObjectPath,
    Page,
    nextUIUpdate,
    AppContainer,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.config.reorder = false;

    var oPage2;

    QUnit.module("AppContainer test", {
        before: function () {
            // Stub the logic of home component id finding
            sandbox.stub(Container, "getRendererInternal").returns({
                byId: sandbox.stub().returns({
                    getId: function (id) { return id; }
                })
            });

            this.oTestContainer = window.document.createElement("div");
            this.oTestContainer.setAttribute("id", "app-container");
            this.oTestContainer.setAttribute("height", "400px");
            this.oTestContainer.setAttribute("width", "100%");
            window.document.body.appendChild(this.oTestContainer);

            this.oPage1 = new Page("home-page", { title: "Home" });
            this.oAppContainer = new AppContainer("vewPortContainer", { pages: this.oPage1 });
            this.oAppContainer.navTo("centerViewPort", "home-page");
            this.oAppContainer.placeAt("app-container");
            return nextUIUpdate();
        },
        after: function () {
            this.oAppContainer.destroy();
            window.document.body.removeChild(this.oTestContainer);
            sandbox.restore();
        }
    });

    QUnit.test("Rendering", function (assert) {
        // Assert
        assert.ok(this.oAppContainer.$().width() > 0, "AppContainer is visible");
        assert.ok(this.oPage1.$().width() > 0, "AppContainer home page is visible");
        assert.strictEqual(this.oAppContainer.getCurrentCenterPage(), this.oPage1.getId(), "Page 1 is the current center page");
    });

    QUnit.test("Add page", async function (assert) {
        // Arrange
        oPage2 = new Page("second-page", { title: "Application" });

        // Act
        this.oAppContainer.addCenterViewPort(oPage2);
        await nextUIUpdate();

        // Assert
        assert.ok(oPage2.$().length > 0, "Page 2 is rendered");
        assert.ok(oPage2.$().hasClass("hidden"), "Page 2 is not visible");
    });

    QUnit.test("Navigate to second page", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var onAfterNavigate = function (oEvent) {
            this.oAppContainer.detachAfterNavigate(onAfterNavigate);
            // Assert
            assert.strictEqual(oEvent.getParameter("fromId"), "home-page", "Navigation event fromId OK");
            assert.strictEqual(oEvent.getParameter("toId"), "second-page", "Navigation event toId OK");
            fnDone();
        }.bind(this);
        this.oAppContainer.attachAfterNavigate(onAfterNavigate);

        // Act
        this.oAppContainer.navTo("centerViewPort", "second-page");

        // Assert
        assert.ok(!oPage2.$().hasClass("hidden"), "Page 2 is visible");
        assert.ok(this.oPage1.$().hasClass("hidden"), "Page 1 is not visible");
        assert.strictEqual(this.oAppContainer.getCurrentCenterPage(), oPage2.getId(), "Page 2 is the current center page");
    });

    QUnit.test("Navigate back", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var onAfterNavigate = function (oEvent) {
            this.oAppContainer.detachAfterNavigate(onAfterNavigate);

            // Assert
            assert.strictEqual(oEvent.getParameter("toId"), "home-page", "Navigation event toId OK");
            assert.strictEqual(oEvent.getParameter("fromId"), "second-page", "Navigation event fromId OK");
            fnDone();
        }.bind(this);
        this.oAppContainer.attachAfterNavigate(onAfterNavigate);

        // Act
        this.oAppContainer.navTo("centerViewPort", "home-page");

        // Assert
        assert.ok(oPage2.$().hasClass("hidden"), "Page 2 is not visible");
        assert.ok(!this.oPage1.$().hasClass("hidden"), "Page 1 is visible");
        assert.strictEqual(this.oAppContainer.getCurrentCenterPage(), this.oPage1.getId(), "Page 1 is the current center page");
    });

    QUnit.test("Delete second page", function (assert) {
        // Act
        this.oAppContainer.removeCenterViewPort("second-page");

        // Assert
        assert.strictEqual(this.oAppContainer.getPages().length, 1, "Page 2 was removed");
    });
});
