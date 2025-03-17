// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/ui/shell/SysInfoBar",
    "sap/ui/qunit/utils/nextUIUpdate"
], function (
    SysInfoBar,
    nextUIUpdate
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("Init Control", {
        beforeEach: function () {
            this.oSysInfoBar = new SysInfoBar();
        },
        afterEach: function () {
            this.oSysInfoBar.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Color Mapping check", function (assert) {
        // Assert
        assert.ok(this.oSysInfoBar._isMappedColor("orange"), "orange is a mapped color.");
        assert.ok(this.oSysInfoBar._isMappedColor("red"), "Red is a mapped color.");
        assert.ok(this.oSysInfoBar._isMappedColor("pink"), "pink is a mapped color.");
        assert.ok(this.oSysInfoBar._isMappedColor("violet"), "violet is a mapped color.");
        assert.ok(this.oSysInfoBar._isMappedColor("blue"), "blue is a mapped color.");
        assert.ok(this.oSysInfoBar._isMappedColor("green"), "green is a mapped color.");
        assert.ok(this.oSysInfoBar._isMappedColor("grey"), "grey is a mapped color.");
        assert.ok(this.oSysInfoBar._isMappedColor("gray"), "gray is a mapped color.");

        assert.ok(this.oSysInfoBar._isMappedColor("Orange"), "Orange is a mapped color.");
        assert.ok(this.oSysInfoBar._isMappedColor("Red"), "Red is a mapped color.");
        assert.ok(this.oSysInfoBar._isMappedColor("Pink"), "Pink is a mapped color.");
        assert.ok(this.oSysInfoBar._isMappedColor("Violet"), "Violet is a mapped color.");
        assert.ok(this.oSysInfoBar._isMappedColor("Blue"), "Blue is a mapped color.");
        assert.ok(this.oSysInfoBar._isMappedColor("Green"), "Green is a mapped color.");
        assert.ok(this.oSysInfoBar._isMappedColor("Grey"), "Grey is a mapped color.");
        assert.ok(this.oSysInfoBar._isMappedColor("Gray"), "Gray is a mapped color.");
    });

    QUnit.test("Color to CSS Class Mapping check", function (assert) {
        // Assert
        assert.equal(this.oSysInfoBar._getMappedColorClass("orange"), "sapUshellSysInfoBarOrange", "Orange is a mapped color.");
        assert.equal(this.oSysInfoBar._getMappedColorClass("red"), "sapUshellSysInfoBarRed", "Red is a mapped color.");
        assert.equal(this.oSysInfoBar._getMappedColorClass("pink"), "sapUshellSysInfoBarPink", "Pink is a mapped color.");
        assert.equal(this.oSysInfoBar._getMappedColorClass("violet"), "sapUshellSysInfoBarViolet", "Violet is a mapped color.");
        assert.equal(this.oSysInfoBar._getMappedColorClass("blue"), "sapUshellSysInfoBarBlue", "Blue is a mapped color.");
        assert.equal(this.oSysInfoBar._getMappedColorClass("green"), "sapUshellSysInfoBarGreen", "Green is a mapped color.");
        assert.equal(this.oSysInfoBar._getMappedColorClass("grey"), "sapUshellSysInfoBarGrey", "Grey is a mapped color.");
        assert.equal(this.oSysInfoBar._getMappedColorClass("gray"), "sapUshellSysInfoBarGrey", "Gray is a mapped color.");
        assert.equal(this.oSysInfoBar._getMappedColorClass("pink2"), "sapUshellSysInfoBarPink2", "Pink is a mapped color.");
        assert.equal(this.oSysInfoBar._getMappedColorClass("violet2"), "sapUshellSysInfoBarViolet2", "Violet is a mapped color.");
        assert.equal(this.oSysInfoBar._getMappedColorClass("blue2"), "sapUshellSysInfoBarBlue2", "Blue is a mapped color.");
        assert.equal(this.oSysInfoBar._getMappedColorClass("green2"), "sapUshellSysInfoBarGreen2", "Green is a mapped color.");
        assert.equal(this.oSysInfoBar._getMappedColorClass("grey2"), "sapUshellSysInfoBarGrey2", "Grey is a mapped color.");
        assert.equal(this.oSysInfoBar._getMappedColorClass("gray2"), "sapUshellSysInfoBarGrey2", "Gray is a mapped color.");
    });

    QUnit.test("Inner aggregation structure created", function (assert) {
        // Assert
        assert.ok(this.oSysInfoBar, "SysInfoBar was created.");
        assert.ok(this.oSysInfoBar.getAggregation("_bar"), "Inner Bar was created.");
        assert.equal(this.oSysInfoBar.getAggregation("_bar").data("sap-ui-fastnavgroup"), "false", "Inner Bar is not fast forward nav enabled.");
        assert.equal(this.oSysInfoBar.getAggregation("_bar")._getRootAccessibilityRole(), "complementary", "Inner Bar is not fast forward nav enabled.");
        assert.ok(this.oSysInfoBar._oText, "Inner Text was created.");
        assert.ok(this.oSysInfoBar._oSubText, "Inner SubText was created.");
    });

    QUnit.test("Inner aggregation structure created has added CSS Classes", function (assert) {
        // Assert
        assert.ok(this.oSysInfoBar, "SysInfoBar was created");
        assert.ok(this.oSysInfoBar.getAggregation("_bar").hasStyleClass("sapUshellSysInfoBar"));
        assert.ok(this.oSysInfoBar._oText.hasStyleClass("sapUshellSysInfoBarText"));
        assert.ok(this.oSysInfoBar._oSubText.hasStyleClass("sapUshellSysInfoBarText"));
    });

    QUnit.test("CustomData for help-id", function (assert) {
        // Arrange
        var oCustomData = this.oSysInfoBar.getCustomData()[0];
        // Assert
        assert.equal(oCustomData.getKey(), "help-id");
        assert.equal(oCustomData.getValue(), "FLP-SysInfoBar");
        assert.ok(oCustomData.getWriteToDom());
    });

    QUnit.module("Overridden setter methods", {
        beforeEach: function () {
            this.oSysInfoBar = new SysInfoBar();
            this.oSysInfoBar.placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            this.oSysInfoBar.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("setText", function (assert) {
        // Arrange
        var oSpyInvalidate = sinon.spy(this.oSysInfoBar, "invalidate");
        var oStubTextSetter = sinon.stub(this.oSysInfoBar._oText, "setText");
        // Act
        this.oSysInfoBar.setText("Otto");
        // Assert
        assert.equal(this.oSysInfoBar.getText(), "Otto");
        assert.ok(oStubTextSetter.calledOnce, "Inner control setter was called.");
        assert.equal(oSpyInvalidate.callCount, 0, "Control was not invalidated.");
    });

    QUnit.test("setSubText", function (assert) {
        // Arrange
        var oSpyInvalidate = sinon.spy(this.oSysInfoBar, "invalidate");
        var oStubSubTextSetter = sinon.stub(this.oSysInfoBar._oSubText, "setText");
        // Act
        this.oSysInfoBar.setSubText("Otto");
        // Assert
        assert.equal(this.oSysInfoBar.getSubText(), "Otto");
        assert.ok(oStubSubTextSetter.calledOnce, "Inner control setter was called.");
        assert.equal(oSpyInvalidate.callCount, 0, "Control was not invalidated.");
    });

    QUnit.test("setIcon", function (assert) {
        // Arrange
        var oSpyInvalidate = sinon.spy(this.oSysInfoBar, "setProperty");
        // Act
        this.oSysInfoBar.setIcon("sap-icon://begin");
        // Assert
        assert.equal(this.oSysInfoBar.getIcon(), "sap-icon://begin", "Property correct set.");
        assert.equal(this.oSysInfoBar._oIcon.getMetadata().getName(), "sap.ui.core.Icon", "sap.core.ui.Icon created for Icon Font.");
        assert.equal(this.oSysInfoBar._oIcon.getSrc(), "sap-icon://begin", "Created Icon src correct set.");
        assert.ok(oSpyInvalidate.calledOnce, "Control was invalidated.");
    });

    QUnit.test("Calling setIcon destroys the existing Icon instance", function (assert) {
        // Arrange
        this.oSysInfoBar.setIcon("sap-icon://begin");
        var oSpyDestroy = sinon.spy(this.oSysInfoBar._oIcon, "destroy");
        // Act
        this.oSysInfoBar.setIcon("sap-icon://begin");
        // Assert
        assert.ok(oSpyDestroy.calledOnce, "Existing Icon was destroyed.");
    });

    QUnit.test("Set Icon destroys Icon in case not valid icon url is given", function (assert) {
        // Arrange
        this.oSysInfoBar.setIcon("sap-icon://begin");
        var oSpyDestroy = sinon.spy(this.oSysInfoBar._oIcon, "destroy");
        // Act
        this.oSysInfoBar.setIcon("www.sap.com");
        // Assert
        assert.ok(oSpyDestroy.calledOnce, "Existing Icon was destroyed.");
        assert.equal(this.oSysInfoBar.getIcon(), "www.sap.com", "Property value was set.");
    });

    QUnit.test("setColor", async function (assert) {
        // Arrange
        var oSpyInvalidate = sinon.spy(this.oSysInfoBar, "invalidate");
        // Act
        this.oSysInfoBar.placeAt("qunit-fixture");
        this.oSysInfoBar.setColor("red");
        await nextUIUpdate();
        // Assert
        assert.ok(oSpyInvalidate.calledOnce, "Control was invalidated");
        assert.ok(this.oSysInfoBar.hasStyleClass("sapUshellSysInfoBarRed"), "Style Class was added.");
    });

    QUnit.test("setColor removes existing StyleClass from inner Bar", async function (assert) {
        // Arrange
        this.oSysInfoBar.setColor("orange");
        this.oSysInfoBar.placeAt("qunit-fixture");
        await nextUIUpdate();
        // Act
        this.oSysInfoBar.setColor("red");
        await nextUIUpdate();
        // Assert
        assert.notOk(this.oSysInfoBar.hasStyleClass("sapUshellSysInfoBarOrange"), "Style Class was removed.");
        assert.ok(this.oSysInfoBar.hasStyleClass("sapUshellSysInfoBarRed"), "Style Class was added.");
    });

    QUnit.module("Order of Inner Controls", {
        beforeEach: function () {
            this.oSysInfoBar = new SysInfoBar();
            this.oSysInfoBar.placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            this.oSysInfoBar.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Icon first", async function (assert) {
        // Arrange
        var oBar = this.oSysInfoBar.getAggregation("_bar");
        this.oSysInfoBar.setIcon("sap-icon://begin");
        this.oSysInfoBar.setText("orange");
        this.oSysInfoBar.setSubText("orange");
        // Act
        this.oSysInfoBar.placeAt("qunit-fixture");
        await nextUIUpdate();
        // Assert
        assert.equal(oBar.indexOfAggregation("contentMiddle", this.oSysInfoBar._oIcon), 0);
    });

    QUnit.test("Text second", async function (assert) {
        // Arrange
        var oBar = this.oSysInfoBar.getAggregation("_bar");
        this.oSysInfoBar.setIcon("sap-icon://begin");
        this.oSysInfoBar.setText("orange");
        this.oSysInfoBar.setSubText("orange");
        // Act
        this.oSysInfoBar.placeAt("qunit-fixture");
        await nextUIUpdate();
        // Assert
        assert.equal(oBar.indexOfAggregation("contentMiddle", this.oSysInfoBar._oText), 1);
    });

    QUnit.test("SubText third", async function (assert) {
        // Arrange
        var oBar = this.oSysInfoBar.getAggregation("_bar");
        this.oSysInfoBar.setIcon("sap-icon://begin");
        this.oSysInfoBar.setText("orange");
        this.oSysInfoBar.setSubText("orange");
        // Act
        this.oSysInfoBar.placeAt("qunit-fixture");
        await nextUIUpdate();
        // Assert
        assert.equal(oBar.indexOfAggregation("contentMiddle", this.oSysInfoBar._oSubText), 2);
    });

    QUnit.module("Renderer", {
        beforeEach: function () {
            this.oSysInfoBar = new SysInfoBar();
        },
        afterEach: function () {
            this.oSysInfoBar.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("During rendering mapped style class is added to inner Bar", async function (assert) {
        // Arrange
        this.oSysInfoBar.setColor("orange");
        // Act
        this.oSysInfoBar.placeAt("qunit-fixture");
        await nextUIUpdate();
        // Assert
        assert.ok(this.oSysInfoBar.hasStyleClass("sapUshellSysInfoBarOrange"), "Style Class added.");
    });

    QUnit.test("During rendering 'sapUshellSysInfoBarCustom' style class is added in case of custom color", async function (assert) {
        // Arrange
        this.oSysInfoBar.setColor("f41515");
        // Act
        this.oSysInfoBar.placeAt("qunit-fixture");
        await nextUIUpdate();
        // Assert
        assert.ok(this.oSysInfoBar.hasStyleClass("sapUshellSysInfoBarCustom"), "Style Class added.");
    });

    QUnit.test("Renderer writes not mapped color as background-color", async function (assert) {
        // Arrange
        this.oSysInfoBar.setColor("black");
        // Act
        this.oSysInfoBar.placeAt("qunit-fixture");
        await nextUIUpdate();
        // Assert
        var oCssClassList = this.oSysInfoBar.getDomRef().classList;
        assert.notOk(oCssClassList.contains("sapUshellSysInfoBarOrange"), "Style Class not added.");
        assert.equal(this.oSysInfoBar.getDomRef().style.backgroundColor, "black", "Custom Color set as 'background-color'.");
    });

    QUnit.test("ACC information is rendered", async function (assert) {
        // Arrange
        this.oSysInfoBar.setText("TEST");
        this.oSysInfoBar.setSubText("CLIENT");
        // Act
        this.oSysInfoBar.placeAt("qunit-fixture");
        await nextUIUpdate();
        // Assert
        var sAriaLabel = this.oSysInfoBar.getDomRef().ariaLabel;
        var sAriaRole = this.oSysInfoBar.getDomRef().role;
        assert.equal(sAriaLabel, "System Information Bar - TEST CLIENT", "Aria Label written to DOM.");
        assert.equal(sAriaRole, "complementary", "Aria role written to DOM.");
    });

});
