// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.appfinder.AppBox
 * @deprecated As of version 1.120
 */
sap.ui.define([
    "sap/ushell/ui/appfinder/AppBox",
    "sap/ushell/resources",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/Config"
], function (
    AppBox,
    resources,
    nextUIUpdate,
    Config
) {
    "use strict";

    /* global QUnit, sinon */

    Config.emit("/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations", true);
    var sandbox = sinon.createSandbox({});

    QUnit.module("onAfterRendering", {
        beforeEach: function () {
            this.oAppBox = new AppBox();

            this.oHeightStub = sinon.stub();
            this.oTitleAddClassStub = sinon.stub();
            this.oSubTitleAddClassStub = sinon.stub();

            var oJQueryStub = sinon.stub(this.oAppBox, "$");
            oJQueryStub.withArgs("title").returns({
                css: sinon.stub().returns("20"),
                height: this.oHeightStub,
                addClass: this.oTitleAddClassStub
            });
            oJQueryStub.withArgs("subTitle").returns({
                addClass: this.oSubTitleAddClassStub
            });

            this.oAppBox.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oAppBox.destroy();
        }
    });

    QUnit.test("One line title", async function (assert) {
        // Arrange
        this.oHeightStub.returns(20);

        // Act
        await nextUIUpdate();

        // Assert
        assert.ok(this.oTitleAddClassStub.calledWith("sapUshellAppBoxHeaderElementOneLine"),
            "sapUshellAppBoxHeaderElementOneLine was added to the title.");
        assert.ok(this.oSubTitleAddClassStub.calledWith("sapUshellAppBoxHeaderElementTwoLines"),
            "sapUshellAppBoxHeaderElementTwoLines was added to the subtitle.");
    });

    QUnit.test("Two line title", async function (assert) {
        // Arrange
        this.oHeightStub.returns(40);

        // Act
        await nextUIUpdate();

        // Assert
        assert.ok(this.oTitleAddClassStub.calledWith("sapUshellAppBoxHeaderElementTwoLines"),
            "sapUshellAppBoxHeaderElementTwoLines was added to the title.");
        assert.ok(this.oSubTitleAddClassStub.calledWith("sapUshellAppBoxHeaderElementOneLine"),
            "sapUshellAppBoxHeaderElementOneLine was added to the subtitle.");
    });

    QUnit.module("_getAriaLabel", {
        beforeEach: function () {
            this.oAppBox = new AppBox();
            this.oAppBox.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oAppBox.destroy();
        }
    });

    QUnit.test("aria-label is correct if AppBox has only a title", async function (assert) {
        // Arrange
        this.oAppBox.setTitle("Some Title");
        var sExpectedAriaLabel = "Some Title";

        // Act
        await nextUIUpdate();

        // Assert
        var sAriaLabel = this.oAppBox.getDomRef().getAttribute("aria-label");
        assert.strictEqual(sAriaLabel, sExpectedAriaLabel, "aria-label is as expected.");
    });

    QUnit.test("aria-label is correct if AppBox has a title and a subtitle", async function (assert) {
        // Arrange
        this.oAppBox.setTitle("Some Title");
        this.oAppBox.setSubtitle("Some SubTitle");
        var sExpectedAriaLabel = "Some Title Some SubTitle";

        // Act
        await nextUIUpdate();

        // Assert
        var sAriaLabel = this.oAppBox.getDomRef().getAttribute("aria-label");
        assert.strictEqual(sAriaLabel, sExpectedAriaLabel, "aria-label is as expected.");
    });

    QUnit.test("aria-label is correct if AppBox has a title, a subtitle and a navigation mode", async function (assert) {
        // Arrange
        this.oAppBox.setTitle("Some Title");
        this.oAppBox.setSubtitle("Some SubTitle");
        this.oAppBox.setNavigationMode("embedded");
        var sExpectedAriaLabel = "Some Title Some SubTitle " + resources.i18n.getText("embeddedNavigationMode");

        // Act
        await nextUIUpdate();

        // Assert
        var sAriaLabel = this.oAppBox.getDomRef().getAttribute("aria-label");
        assert.strictEqual(sAriaLabel, sExpectedAriaLabel, "aria-label is as expected.");
    });

    QUnit.test("aria-label is correct if AppBox has a title, a subtitle and a navigation mode and a contentProviderLabel", async function (assert) {
        // Arrange
        this.oAppBox.setTitle("Some Title");
        this.oAppBox.setSubtitle("Some SubTitle");
        this.oAppBox.setNavigationMode("embedded");
        this.oAppBox.setShowContentProviderLabel(true);
        this.oAppBox.setContentProviderLabel("Test Content Provider Label");
        var sExpectedAriaLabel = "Some Title Some SubTitle " + resources.i18n.getText("embeddedNavigationMode") + " Test Content Provider Label";

        // Act
        await nextUIUpdate();

        // Assert
        var sAriaLabel = this.oAppBox.getDomRef().getAttribute("aria-label");
        assert.strictEqual(sAriaLabel, sExpectedAriaLabel, "aria-label is as expected.");
    });

    QUnit.module("setIcon", {
        beforeEach: function () {
            this.oAppBox = new AppBox();
            this.oAppBox.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oAppBox.destroy();
        }
    });

    QUnit.test("icon: sap-icon://product", async function (assert) {
        // Arrange
        this.oAppBox.setIcon("sap-icon://product");

        // Act
        await nextUIUpdate();

        // Assert
        assert.ok(this.oAppBox._oIcon.isA("sap.ui.core.Icon"), "icon is a sap.ui.core.Icon");
        assert.ok(this.oAppBox._oIcon.hasStyleClass("sapUshellAppBoxIcon"), "icon has class \"sapUshellAppBoxIcon\"");
        assert.strictEqual(this.oAppBox._oIcon.getSrc(), "sap-icon://product", "icon has the right src.");
    });

    QUnit.test("contentProviderLabel", async function (assert) {
        // Arrange
        var sExpectedContentProviderLabel = "";
        var sExpectedShowContentProviderLabel = true;

        // Act
        await nextUIUpdate();

        // Assert
        var contentProviderLabel = this.oAppBox.getContentProviderLabel();
        var showContentProviderLabel = this.oAppBox.getShowContentProviderLabel();

        assert.strictEqual(contentProviderLabel, sExpectedContentProviderLabel, "contentProviderLabel is as expected.");
        assert.strictEqual(showContentProviderLabel, sExpectedShowContentProviderLabel, "showContentProviderLabel is as expected.");
    });

    QUnit.module("Handle showContentProviderInfoOnVisualizations config changes as part of onInit", {
        beforeEach: function () {
            this.oConfigDoStub = sandbox.stub().returns({
                off: sandbox.stub()
            });
            this.oConfigOnStub = sandbox.stub(Config, "on").returns({
                do: this.oConfigDoStub
            });
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations").returns(false);

            this.oAppBox = new AppBox();
            this.oAppBox.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oAppBox.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("onInit attaches to correct config setting", async function (assert) {
        // Assert
        assert.strictEqual(this.oConfigOnStub.getCall(0).args[0],
            "/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations", "Attached to the correct config");
    });

    QUnit.test("AppBox handles correctly the showContentProviderInfoOnVisualizations config change and updates property", function (assert) {
        assert.strictEqual(this.oAppBox.getShowContentProviderLabel(), false, "showContentProviderLabel property is initially set to false");

        // Arrange
        this.oConfigDoStub.getCall(0).callArgWith(0, true); // Simulate config change for showContentProviderInfoOnVisualizations from false to true

        // Assert
        assert.strictEqual(this.oAppBox.getShowContentProviderLabel(), true, "property was set correctly after config change");
    });
});
