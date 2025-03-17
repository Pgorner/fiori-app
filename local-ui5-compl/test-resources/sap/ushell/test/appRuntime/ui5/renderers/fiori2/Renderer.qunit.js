// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.renderers.fiori2.Renderer
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ushell/appRuntime/ui5/renderers/fiori2/Renderer",
    "sap/ushell/appRuntime/ui5/AppRuntimeService"
], function (jQuery, Renderer, AppRuntimeService) {
    "use strict";

    /* global sinon, QUnit */

    var sandbox = sinon.createSandbox({});

    QUnit.module("addTopHeaderPlaceHolder", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Adds a placeholder", function (assert) {

        // Arrange
        var aElements = [
            '<div class="sapAppRuntimeBaseStyle"></div>',
            '<div class="sapAppRuntimeBaseStyle"></div>'
        ];

        aElements.forEach(function (oElement) {
            jQuery("body").append(oElement);
        });

        // Act
        Renderer.addTopHeaderPlaceHolder();

        // Assert
        var oRmHeader = jQuery(document).find("#rmheader"),
        oContainers = jQuery("body").find(".sapAppRuntimeBaseStyle");

        assert.ok(oRmHeader.length, "The placeholder is rendered successfully");
        oContainers.each(function (i, oContainer) {
            assert.strictEqual(oContainer.style.height, "calc(100% - 2.75rem)", "The height of Container " + i + "  has been adapted");
        });
    });

    QUnit.module("removeTopHeaderPlaceHolder", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("removes a placeholder", function (assert) {

        // Act
        Renderer.removeTopHeaderPlaceHolder();

        // Assert
        var oRmHeader = jQuery(document).find("#rmheader"),
            oContainers = jQuery("body").find(".sapAppRuntimeBaseStyle");

        assert.notOk(oRmHeader.length, "The placeholder has been removed");
        oContainers.each(function (i, oContainer) {
            assert.strictEqual(oContainer.style.height, "100%", "The height of Container " + i + " returned to initial");
        });
    });

    QUnit.module("addUserAction", {
        beforeEach: function () {
            sandbox.stub(AppRuntimeService, "postMessageToFLP").resolves();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns a promise", function (assert) {
        // Act
        return Renderer.addUserAction({ oControlProperties: {} }).then(() => {
            // Assert
            assert.ok(true);
        });
    });

    QUnit.test("Adds a fallback id to the control properties", function (assert) {
        // Act
        return Renderer.addUserAction({ oControlProperties: {} }).then(() => {
            // Assert
            var aArgs = AppRuntimeService.postMessageToFLP.getCall(0).args;
            assert.strictEqual(aArgs[0], "sap.ushell.services.Renderer.addUserAction", "The message id is correct");
            assert.ok(aArgs[1].oParameters.oControlProperties.id, "A fallback id has been added");
        });
    });

    QUnit.module("createShellHeadItem", {
        beforeEach: function () {
            sandbox.stub(AppRuntimeService, "postMessageToFLP").resolves();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Adds a fallback id to the control properties", function (assert) {
        // Act
        return Renderer.createShellHeadItem({}).then(() => {
            // Assert
            var aArgs = AppRuntimeService.postMessageToFLP.getCall(0).args;
            assert.strictEqual(aArgs[0], "sap.ushell.services.Renderer.createShellHeadItem", "The message id is correct");
            assert.ok(aArgs[1].params.id, "A fallback id has been added");
        });
    });

    QUnit.module("addHeaderItem", {
        beforeEach: function () {
            sandbox.stub(AppRuntimeService, "postMessageToFLP").resolves();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Adds a fallback id to the control properties", function (assert) {
        // Act
        Renderer.addHeaderItem({}, true, true);

        // Assert
        var aArgs = AppRuntimeService.postMessageToFLP.getCall(0).args;
        assert.strictEqual(aArgs[0], "sap.ushell.services.Renderer.addHeaderItem", "The message id is correct");
        assert.ok(aArgs[1].sId, "A fallback id has been added");
    });

    QUnit.module("addHeaderEndItem", {
        beforeEach: function () {
            sandbox.stub(AppRuntimeService, "postMessageToFLP").resolves();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Adds a fallback id to the control properties", function (assert) {
        // Act
        Renderer.addHeaderEndItem({}, true, true);

        // Assert
        var aArgs = AppRuntimeService.postMessageToFLP.getCall(0).args;
        assert.strictEqual(aArgs[0], "sap.ushell.services.Renderer.addHeaderEndItem", "The message id is correct");
        assert.ok(aArgs[1].sId, "A fallback id has been added");
    });
});
