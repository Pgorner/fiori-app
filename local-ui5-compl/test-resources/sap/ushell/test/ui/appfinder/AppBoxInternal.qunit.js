// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.appfinder.AppBoxInternal
 */
sap.ui.define([
    "sap/ushell/ui/appfinder/AppBoxInternal",
    "sap/ushell/resources",
    "sap/ui/qunit/utils/nextUIUpdate"
], function (
    AppBoxInternal,
    resources,
    nextUIUpdate
) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("onAfterRendering", {
        beforeEach: function () {
            this.oAppBox = new AppBoxInternal();

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
            this.oAppBox = new AppBoxInternal();
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

    QUnit.module("setIcon", {
        beforeEach: function () {
            this.oAppBox = new AppBoxInternal();
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
});
