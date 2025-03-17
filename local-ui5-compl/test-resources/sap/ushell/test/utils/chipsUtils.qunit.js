// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.utils.chipsUtils
 */
sap.ui.define([
    "sap/ushell/utils/chipsUtils",
    "sap/base/Log",
    "sap/ushell/services/URLParsing",
    "sap/ushell/Container"
], function (chipsUtils, Log, URLParsing, Container) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    QUnit.module("The function getCatalogTilePreviewTitle", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns bag without title; tile is a stub", function (assert) {
        // Arrange
        var oGetBagTextStub = sandbox.stub(chipsUtils, "getBagText");
        var oMockTile = {
            isStub: sandbox.stub().returns(true),
            getContract: sandbox.stub().throws(new Error("tile is a stub, getContract should not be called!"))
        };

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewTitle(oMockTile);

        // Assert
        assert.strictEqual(sResult, undefined, "getCatalogTilePreviewTitle result");
        assert.strictEqual(oGetBagTextStub.callCount, 1, "getBagText is always called first");
        assert.strictEqual(oGetBagTextStub.firstCall.args[0], oMockTile, "getBagText: arg1 is the tile");
        assert.strictEqual(oGetBagTextStub.firstCall.args[1], "tileProperties",
            "getBagText:  BagID is as app launchers use it");
        assert.strictEqual(oGetBagTextStub.firstCall.args[2], "display_title_text",
            "getBagText: text name is as the app launchers use it fot the title");
    });

    QUnit.test("Returns bag without title; tile has no preview contract", function (assert) {
        // Arrange
        var oGetBagTextStub = sandbox.stub(chipsUtils, "getBagText");
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub()
        };

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewTitle(oMockTile);

        // Assert
        assert.strictEqual(sResult, undefined, "getCatalogTilePreviewTitle result");
        assert.strictEqual(oGetBagTextStub.callCount, 1, "getBagText is always called first");
        assert.strictEqual(oGetBagTextStub.firstCall.args[0], oMockTile, "getBagText: arg1 is the tile");
        assert.strictEqual(oGetBagTextStub.firstCall.args[1], "tileProperties",
            "getBagText:  BagID is as app launchers use it");
        assert.strictEqual(oGetBagTextStub.firstCall.args[2], "display_title_text",
            "getBagText: text name is as the app launchers use it fot the title");
    });

    QUnit.test("Returns bag without title; preview contract without title", function (assert) {
        // Arrange
        var oGetBagTextStub = sandbox.stub(chipsUtils, "getBagText");
        var oMockPreviewContract = {
            getPreviewTitle: sandbox.stub()
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewTitle(oMockTile);

        // Assert
        assert.strictEqual(sResult, undefined, "getCatalogTilePreviewTitle result");
        assert.strictEqual(oGetBagTextStub.callCount, 1, "getBagText is always called first");
        assert.strictEqual(oGetBagTextStub.firstCall.args[0], oMockTile, "getBagText: arg1 is the tile");
        assert.strictEqual(oGetBagTextStub.firstCall.args[1], "tileProperties",
            "getBagText:  BagID is as app launchers use it");
        assert.strictEqual(oGetBagTextStub.firstCall.args[2], "display_title_text",
            "getBagText: text name is as the app launchers use it fot the title");
    });

    QUnit.test("Returns bag with falsy title; preview contract without title", function (assert) {
        // Arrange
        var oGetBagTextStub = sandbox.stub(chipsUtils, "getBagText").returns("");
        var oMockPreviewContract = {
            getPreviewTitle: sandbox.stub()
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewTitle(oMockTile);

        // Assert
        assert.strictEqual(sResult, undefined, "getCatalogTilePreviewTitle result");
        assert.strictEqual(oGetBagTextStub.callCount, 1, "getBagText is always called first");
        assert.strictEqual(oGetBagTextStub.firstCall.args[0], oMockTile, "getBagText: arg1 is the tile");
        assert.strictEqual(oGetBagTextStub.firstCall.args[1], "tileProperties",
            "getBagText:  BagID is as app launchers use it");
        assert.strictEqual(oGetBagTextStub.firstCall.args[2], "display_title_text",
            "getBagText: text name is as the app launchers use it fot the title");
    });

    QUnit.test("Returns bag without title; preview contract with title", function (assert) {
        // Arrange
        var oGetBagTextStub = sandbox.stub(chipsUtils, "getBagText");
        var oMockPreviewContract = {
            getPreviewTitle: sandbox.stub().returns("title form contract")
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewTitle(oMockTile);

        // Assert
        assert.strictEqual(sResult, "title form contract", "getCatalogTilePreviewTitle result");
        assert.strictEqual(oGetBagTextStub.callCount, 1, "getBagText is always called first");
        assert.strictEqual(oGetBagTextStub.firstCall.args[0], oMockTile, "getBagText: arg1 is the tile");
        assert.strictEqual(oGetBagTextStub.firstCall.args[1], "tileProperties",
            "getBagText:  BagID is as app launchers use it");
        assert.strictEqual(oGetBagTextStub.firstCall.args[2], "display_title_text",
            "getBagText: text name is as the app launchers use it fot the title");
    });

    QUnit.test("Returns bag with title; preview contract with title", function (assert) {
        // Arrange
        var oGetBagTextStub = sandbox.stub(chipsUtils, "getBagText").returns("title form bag");
        var oMockPreviewContract = {
            getPreviewTitle: sandbox.stub().returns("title form contract")
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewTitle(oMockTile);

        // Assert
        assert.strictEqual(sResult, "title form bag", "getCatalogTilePreviewTitle result");
        assert.strictEqual(oGetBagTextStub.callCount, 1, "getBagText is always called first");
        assert.strictEqual(oGetBagTextStub.firstCall.args[0], oMockTile, "getBagText: arg1 is the tile");
        assert.strictEqual(oGetBagTextStub.firstCall.args[1], "tileProperties",
            "getBagText:  BagID is as app launchers use it");
        assert.strictEqual(oGetBagTextStub.firstCall.args[2], "display_title_text",
            "getBagText: text name is as the app launchers use it fot the title");
    });

    QUnit.test("Returns bag with falsy title should be ignored; preview contract with title", function (assert) {
        // Arrange
        var oGetBagTextStub = sandbox.stub(chipsUtils, "getBagText").returns("");
        var oMockPreviewContract = {
            getPreviewTitle: sandbox.stub().returns("title form contract")
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewTitle(oMockTile);

        // Assert
        assert.strictEqual(sResult, "title form contract", "getCatalogTilePreviewTitle result");
        assert.strictEqual(oGetBagTextStub.callCount, 1, "getBagText is always called first");
        assert.strictEqual(oGetBagTextStub.firstCall.args[0], oMockTile, "getBagText: arg1 is the tile");
        assert.strictEqual(oGetBagTextStub.firstCall.args[1], "tileProperties",
            "getBagText:  BagID is as app launchers use it");
        assert.strictEqual(oGetBagTextStub.firstCall.args[2], "display_title_text",
            "getBagText: text name is as the app launchers use it fot the title");
    });

    QUnit.module("The function getCatalogTilePreviewSubtitle", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns bag without subtitle; tile is a stub", function (assert) {
        // Arrange
        var oMockTile = {
            isStub: sandbox.stub().returns(true),
            getContract: sandbox.stub().throws(new Error("tile is a stub, getContract should not be called!"))
        };
        var oGetBagTextStub = sandbox.stub(chipsUtils, "getBagText");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewSubtitle(oMockTile);

        // Assert
        assert.strictEqual(sResult, undefined, "getCatalogTilePreviewSubtitle result");
        assert.strictEqual(oGetBagTextStub.callCount, 1, "getBagText is always called first");
        assert.strictEqual(oGetBagTextStub.firstCall.args[0], oMockTile, "getBagText: arg1 is the tile");
        assert.strictEqual(oGetBagTextStub.firstCall.args[1], "tileProperties",
            "getBagText:  BagID is as app launchers use it");
        assert.strictEqual(oGetBagTextStub.firstCall.args[2], "display_subtitle_text",
            "getBagText: text name is as the app launchers use it fot the subtitle");
    });

    QUnit.test("Returns bag without subtitle; tile has no preview contract", function (assert) {
        // Arrange
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub()
        };
        var oGetBagTextStub = sandbox.stub(chipsUtils, "getBagText");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewSubtitle(oMockTile);

        // Assert
        assert.strictEqual(sResult, undefined, "getCatalogTilePreviewSubtitle result");
        assert.strictEqual(oGetBagTextStub.callCount, 1, "getBagText is always called first");
        assert.strictEqual(oGetBagTextStub.firstCall.args[0], oMockTile, "getBagText: arg1 is the tile");
        assert.strictEqual(oGetBagTextStub.firstCall.args[1], "tileProperties",
            "getBagText:  BagID is as app launchers use it");
        assert.strictEqual(oGetBagTextStub.firstCall.args[2], "display_subtitle_text",
            "getBagText: text name is as the app launchers use it fot the subtitle");
    });

    QUnit.test("Returns bag without subtitle; preview contract without subtitle", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getPreviewSubtitle: sandbox.stub()
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };
        var oGetBagTextStub = sandbox.stub(chipsUtils, "getBagText");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewSubtitle(oMockTile);

        // Assert
        assert.strictEqual(sResult, undefined, "getCatalogTilePreviewSubtitle result");
        assert.strictEqual(oGetBagTextStub.callCount, 1, "getBagText is always called first");
        assert.strictEqual(oGetBagTextStub.firstCall.args[0], oMockTile, "getBagText: arg1 is the tile");
        assert.strictEqual(oGetBagTextStub.firstCall.args[1], "tileProperties",
            "getBagText:  BagID is as app launchers use it");
        assert.strictEqual(oGetBagTextStub.firstCall.args[2], "display_subtitle_text",
            "getBagText: text name is as the app launchers use it fot the subtitle");
    });

    QUnit.test("Returns bag with falsy subtitle; preview contract without subtitle", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getPreviewSubtitle: sandbox.stub()
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };
        var oGetBagTextStub = sandbox.stub(chipsUtils, "getBagText").returns("");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewSubtitle(oMockTile);

        // Assert
        assert.strictEqual(sResult, undefined, "getCatalogTilePreviewSubtitle result");
        assert.strictEqual(oGetBagTextStub.callCount, 1, "getBagText is always called first");
        assert.strictEqual(oGetBagTextStub.firstCall.args[0], oMockTile, "getBagText: arg1 is the tile");
        assert.strictEqual(oGetBagTextStub.firstCall.args[1], "tileProperties",
            "getBagText:  BagID is as app launchers use it");
        assert.strictEqual(oGetBagTextStub.firstCall.args[2], "display_subtitle_text",
            "getBagText: text name is as the app launchers use it fot the subtitle");
    });

    QUnit.test("Returns bag without subtitle; preview contract with subtitle", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getPreviewSubtitle: sandbox.stub().returns("subtitle form contract")
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };
        var oGetBagTextStub = sandbox.stub(chipsUtils, "getBagText");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewSubtitle(oMockTile);

        // Assert
        assert.strictEqual(sResult, "subtitle form contract", "getCatalogTilePreviewSubtitle result");
        assert.strictEqual(oGetBagTextStub.callCount, 1, "getBagText is always called first");
        assert.strictEqual(oGetBagTextStub.firstCall.args[0], oMockTile, "getBagText: arg1 is the tile");
        assert.strictEqual(oGetBagTextStub.firstCall.args[1], "tileProperties",
            "getBagText:  BagID is as app launchers use it");
        assert.strictEqual(oGetBagTextStub.firstCall.args[2], "display_subtitle_text",
            "getBagText: text name is as the app launchers use it fot the subtitle");
    });

    QUnit.test("Returns bag with subtitle; preview contract with subtitle", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getPreviewSubtitle: sandbox.stub().returns("subtitle form contract")
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };
        var oGetBagTextStub = sandbox.stub(chipsUtils, "getBagText").returns("subtitle form bag");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewSubtitle(oMockTile);

        // Assert
        assert.strictEqual(sResult, "subtitle form bag", "getCatalogTilePreviewSubtitle result");
        assert.strictEqual(oGetBagTextStub.callCount, 1, "getBagText is always called first");
        assert.strictEqual(oGetBagTextStub.firstCall.args[0], oMockTile, "getBagText: arg1 is the tile");
        assert.strictEqual(oGetBagTextStub.firstCall.args[1], "tileProperties",
            "getBagText:  BagID is as app launchers use it");
        assert.strictEqual(oGetBagTextStub.firstCall.args[2], "display_subtitle_text",
            "getBagText: text name is as the app launchers use it fot the subtitle");
    });

    QUnit.test("Returns bag with falsy subtitle should be ignored; preview contract with subtitle", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getPreviewSubtitle: sandbox.stub().returns("subtitle form contract")
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };
        var oGetBagTextStub = sandbox.stub(chipsUtils, "getBagText").returns("");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewSubtitle(oMockTile);

        // Assert
        assert.strictEqual(sResult, "subtitle form contract", "getCatalogTilePreviewSubtitle result");
        assert.strictEqual(oGetBagTextStub.callCount, 1, "getBagText is always called first");
        assert.strictEqual(oGetBagTextStub.firstCall.args[0], oMockTile, "getBagText: arg1 is the tile");
        assert.strictEqual(oGetBagTextStub.firstCall.args[1], "tileProperties",
            "getBagText:  BagID is as app launchers use it");
        assert.strictEqual(oGetBagTextStub.firstCall.args[2], "display_subtitle_text",
            "getBagText: text name is as the app launchers use it fot the subtitle");
    });

    QUnit.module("The function getCatalogTilePreviewIcon", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns no value in config; tile is a stub", function (assert) {
        // Arrange
        var oMockTile = {
            isStub: sandbox.stub().returns(true),
            getContract: sandbox.stub().throws(new Error("tile is a stub, getContract should not be called!"))
        };
        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewIcon(oMockTile);

        // Assert
        assert.strictEqual(sResult, undefined, "getCatalogTilePreviewIcon result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "display_icon_url",
            "_getConfigurationProperty:  property name is as the app launchers use it for the icon");
    });

    QUnit.test("Returns value in config; tile is a stub", function (assert) {
        // Arrange
        var oMockTile = {
            isStub: sandbox.stub().returns(true),
            getContract: sandbox.stub().throws(new Error("tile is a stub, getContract should not be called!"))
        };
        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty")
            .returns("icon form bag");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewIcon(oMockTile);

        // Assert
        assert.strictEqual(sResult, "icon form bag", "getCatalogTilePreviewIcon result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "display_icon_url",
            "_getConfigurationProperty:  property name is as the app launchers use it for the icon");
    });

    QUnit.test("Returns no value in config; tile has no preview contract", function (assert) {
        // Arrange
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub()
        };
        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewIcon(oMockTile);

        // Assert
        assert.strictEqual(sResult, undefined, "getCatalogTilePreviewIcon result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "display_icon_url",
            "_getConfigurationProperty:  property name is as the app launchers use it for the icon");
    });

    QUnit.test("Returns value in config; tile has no preview contract", function (assert) {
        // Arrange
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub()
        };
        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty")
            .returns("icon form bag");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewIcon(oMockTile);

        // Assert
        assert.strictEqual(sResult, "icon form bag", "getCatalogTilePreviewIcon result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "display_icon_url",
            "_getConfigurationProperty:  property name is as the app launchers use it for the icon");
    });

    QUnit.test("Returns no value in config; preview contract without icon", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getPreviewIcon: sandbox.stub()
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };

        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewIcon(oMockTile);

        // Assert
        assert.strictEqual(sResult, undefined, "getCatalogTilePreviewIcon result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "display_icon_url",
            "_getConfigurationProperty:  property name is as the app launchers use it for the icon");
    });

    QUnit.test("Returns value in config; preview contract without icon", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getPreviewIcon: sandbox.stub()
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };
        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty")
            .returns("icon form bag");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewIcon(oMockTile);

        // Assert
        assert.strictEqual(sResult, "icon form bag", "getCatalogTilePreviewIcon result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "display_icon_url",
            "_getConfigurationProperty:  property name is as the app launchers use it for the icon");
    });

    QUnit.test("Returns no value in config; preview contract with icon", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getPreviewIcon: sandbox.stub().returns("icon form contract")
        },
            oMockTile = {
                isStub: sandbox.stub().returns(false),
                getContract: sandbox.stub().returns(oMockPreviewContract)
            };
        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewIcon(oMockTile);

        // Assert
        assert.strictEqual(sResult, "icon form contract", "getCatalogTilePreviewIcon result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "display_icon_url",
            "_getConfigurationProperty:  property name is as the app launchers use it for the icon");
    });

    QUnit.test("Returns value in config; preview contract with icon", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getPreviewIcon: sandbox.stub().returns("icon form contract")
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };
        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty")
            .returns("icon form bag");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewIcon(oMockTile);

        // Assert
        assert.strictEqual(sResult, "icon form bag", "getCatalogTilePreviewIcon result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "display_icon_url",
            "_getConfigurationProperty:  property name is as the app launchers use it for the icon");
    });

    QUnit.test("Returns falsy value from config; preview contract without icon", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getPreviewIcon: sandbox.stub()
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };
        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty")
            .returns("");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewIcon(oMockTile);

        // Assert
        assert.strictEqual(sResult, undefined, "getCatalogTilePreviewIcon result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "display_icon_url",
            "_getConfigurationProperty:  property name is as the app launchers use it for the icon");
    });

    QUnit.test("Returns falsy value in config; preview contract with icon", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getPreviewIcon: sandbox.stub().returns("icon form contract")
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };

        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty")
            .returns("");

        // Act
        var sResult = chipsUtils.getCatalogTilePreviewIcon(oMockTile);

        // Assert
        assert.strictEqual(sResult, "icon form contract", "getCatalogTilePreviewIcon result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "display_icon_url",
            "_getConfigurationProperty:  property name is as the app launchers use it for the icon");
    });

    QUnit.module("The function getCatalogTileTargetURL", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns no value in config; tile is a stub.", function (assert) {
        // Arrange
        var oMockTile = {
            isStub: sandbox.stub().returns(true),
            getContract: sandbox.stub().throws(new Error("tile is a stub, getContract should not be called!"))
        };
        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty");

        // Act
        var sResult = chipsUtils.getCatalogTileTargetURL(oMockTile);

        // Assert
        assert.strictEqual(sResult, undefined, "getCatalogTileTargetURL result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "navigation_target_url",
            "_getConfigurationProperty: property name is as the app launchers use it for the target URL");
    });

    QUnit.test("Returns no value in config; tile has no preview contract.", function (assert) {
        // Arrange
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub()
        };
        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty");

        // Act
        var sResult = chipsUtils.getCatalogTileTargetURL(oMockTile);

        // Assert
        assert.strictEqual(sResult, undefined, "getCatalogTileTargetURL result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "navigation_target_url",
            "_getConfigurationProperty: property name is as the app launchers use it for the target URL");
    });

    QUnit.test("Returns no value in config; preview contract without target URL.", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getTargetUrl: sandbox.stub()
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };
        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty");

        // Act
        var sResult = chipsUtils.getCatalogTileTargetURL(oMockTile);

        // Assert
        assert.strictEqual(sResult, undefined, "getCatalogTileTargetURL result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "navigation_target_url",
            "_getConfigurationProperty: property name is as the app launchers use it for the target URL");
    });

    QUnit.test("Returns value in config; preview contract without target URL.", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getTargetUrl: sandbox.stub()
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };
        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty")
            .returns("#From-config");

        // Act
        var sResult = chipsUtils.getCatalogTileTargetURL(oMockTile);

        // Assert
        assert.strictEqual(sResult, "#From-config", "getCatalogTileTargetURL result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "navigation_target_url",
            "_getConfigurationProperty: property name is as the app launchers use it for the target URL");
    });

    QUnit.test("Returns no value in config; preview contract with target URL.", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getTargetUrl: sandbox.stub().returns("#From-contract")
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };
        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty");

        // Act
        var sResult = chipsUtils.getCatalogTileTargetURL(oMockTile);

        // Assert
        assert.strictEqual(sResult, "#From-contract", "getCatalogTileTargetURL result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "navigation_target_url",
            "_getConfigurationProperty: property name is as the app launchers use it for the target URL");
    });

    QUnit.test("Returns value in config; preview contract with target URL.", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getTargetUrl: sandbox.stub().returns("#From-contract")
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };
        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty")
            .returns("#From-config");

        // Act
        var sResult = chipsUtils.getCatalogTileTargetURL(oMockTile);

        // Assert
        assert.strictEqual(sResult, "#From-config", "getCatalogTileTargetURL result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "navigation_target_url",
            "_getConfigurationProperty: property name is as the app launchers use it for the target URL");
    });

    QUnit.test("Returns falsy value from config; preview contract without target URL.", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getTargetUrl: sandbox.stub()
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };
        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty")
            .returns("");

        // Act
        var sResult = chipsUtils.getCatalogTileTargetURL(oMockTile);

        // Assert
        assert.strictEqual(sResult, undefined, "getCatalogTileTargetURL result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "navigation_target_url",
            "_getConfigurationProperty: property name is as the app launchers use it for the target URL");
    });

    QUnit.test("Returns falsy value in config; preview contract with target URL.", function (assert) {
        // Arrange
        var oMockPreviewContract = {
            getTargetUrl: sandbox.stub().returns("#From-contract")
        };
        var oMockTile = {
            isStub: sandbox.stub().returns(false),
            getContract: sandbox.stub().returns(oMockPreviewContract)
        };
        var fnGetConfigProperty = sandbox.stub(chipsUtils, "_getConfigurationProperty")
            .returns("");

        // Act
        var sResult = chipsUtils.getCatalogTileTargetURL(oMockTile);

        // Assert
        assert.strictEqual(sResult, "#From-contract", "getCatalogTileTargetURL result");
        assert.strictEqual(fnGetConfigProperty.callCount, 1, "_getConfigurationProperty is always called first");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[0], oMockTile, "_getConfigurationProperty: arg1 is the tile");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[1], "tileConfiguration",
            "_getConfigurationProperty:  BagID is as app launchers use it");
        assert.strictEqual(fnGetConfigProperty.firstCall.args[2], "navigation_target_url",
            "_getConfigurationProperty: property name is as the app launchers use it for the target URL");
    });

    QUnit.module("The function getCatalogTileNumberUnit", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls the _getConfigurationProperty function and returns correct value of the configuration.", function (assert) {
        // Arrange
        var oCatalogTile = {};
        var oGetConfigurationPropertyStub = sandbox.stub(chipsUtils, "_getConfigurationProperty")
            .withArgs(oCatalogTile, "tileConfiguration", "display_number_unit")
            .returns("EUR");

        // Act
        var sResult = chipsUtils.getCatalogTileNumberUnit(oCatalogTile);

        // Assert
        assert.strictEqual(sResult, "EUR", "returns the correct value.");
        assert.strictEqual(oGetConfigurationPropertyStub.callCount, 1, "called the _getConfigurationProperty function once.");
    });

    QUnit.module("The function getCatalogTilePreviewInfo", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("getCatalogTilePreviewInfo: returns the bag text of 'display_info_text'", function (assert) {
        // Act
        var sCatalogTileInfo = chipsUtils.getCatalogTilePreviewInfo({
            getChip: sandbox.stub().returns({
                getBagIds: sandbox.stub().returns(["tileProperties"]),
                getBag: sandbox.stub().returns({
                    getTextNames: sandbox.stub().returns(["display_info_text"]),
                    getText: sandbox.stub().returns("Catalog tile info text")
                })
            })
        });

        // Assert
        assert.strictEqual(sCatalogTileInfo, "Catalog tile info text", "The function getCatalogTilePreviewInfo returns the bag text of tile property 'display_info_text'.");
    });

    QUnit.module("The function getCatalogTileSize", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("getCatalogTileSize", function (assert) {
        // Assign
        sandbox.stub(chipsUtils, "getTileSize").returns("foo");

        // Act
        var sResult = chipsUtils.getCatalogTileSize({});

        // Assert
        assert.strictEqual(sResult, "foo");
        assert.ok(chipsUtils.getTileSize.calledWith({}));
    });

    QUnit.module("The function getCatalogTilePreviewIndicatorDataSource", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("getCatalogTilePreviewIndicatorDataSource: returns the correct configuration parameters of a dynamic tile as an indicator data source", function (assert) {
        // Act
        var sCatalogTileIndicatorDataSource = chipsUtils.getCatalogTilePreviewIndicatorDataSource({
            getConfigurationParameter: sandbox.stub().returns("{ \"service_url\": \"url/to/service/$count\", \"service_refresh_interval\": \"300\" }"),
            getChip: sandbox.stub().returns({
                getBaseChipId: sandbox.stub().returns("X-SAP-UI2-CHIP:/UI2/DYNAMIC_APPLAUNCHER")
            })
        });

        // Assert
        assert.deepEqual(sCatalogTileIndicatorDataSource, {
            path: "url/to/service/$count",
            refresh: "300"
        }, "The function getCatalogTilePreviewIndicatorDataSource returns the correct indicator data source.");
    });

    QUnit.test("getCatalogTilePreviewIndicatorDataSource: returns undefined if service_url is not specified", function (assert) {
        // Act
        var sCatalogTileIndicatorDataSource = chipsUtils.getCatalogTilePreviewIndicatorDataSource({
            getConfigurationParameter: sandbox.stub().returns("{ \"service_refresh_interval\": \"300\" }"),
            getChip: sandbox.stub().returns({
                getBaseChipId: sandbox.stub().returns("X-SAP-UI2-CHIP:/UI2/DYNAMIC_APPLAUNCHER")
            })
        });

        // Assert
        assert.strictEqual(typeof sCatalogTileIndicatorDataSource, "undefined", "The function getCatalogTilePreviewIndicatorDataSource returns undefined.");
    });

    QUnit.module("The function _getConfigurationProperty", {
        beforeEach: function () {
            this.oGetConfigurationParameterStub = sandbox.stub();
            this.oChipInstanceMock = {
                getConfigurationParameter: this.oGetConfigurationParameterStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns CHIP without configuration contract.", function (assert) {
        // Arrange
        var sConfigParameterId = "unknown_parameter";

        // Act
        var sResult = chipsUtils._getConfigurationProperty(this.oChipInstanceMock, sConfigParameterId, "unknown_property");

        // Assert
        assert.strictEqual(sResult, undefined, "_getConfigurationProperty result");
        assert.strictEqual(this.oGetConfigurationParameterStub.callCount, 1, "getConfigurationParameter is always called");
        assert.strictEqual(this.oGetConfigurationParameterStub.firstCall.args[0], sConfigParameterId,
            "correct configuration parameter requested");
    });

    QUnit.test("Returns CHIP with empty configuration.", function (assert) {
        // Arrange
        var sConfigParameterId = "unknown_bag";

        // Act
        var sResult = chipsUtils._getConfigurationProperty(this.oChipInstanceMock, sConfigParameterId, "unknown_property");

        // Assert
        assert.strictEqual(sResult, undefined, "_getConfigurationProperty result");
        assert.strictEqual(this.oGetConfigurationParameterStub.callCount, 1, "getConfigurationParameter is always called");
        assert.strictEqual(this.oGetConfigurationParameterStub.firstCall.args[0], sConfigParameterId,
            "correct configuration parameter requested");
    });

    QUnit.test("Checks if config parameter exists but property id does not.", function (assert) {
        // Arrange
        var sConfigParameterId = "param1";
        this.oGetConfigurationParameterStub.returns("");

        // Act
        var sResult = chipsUtils._getConfigurationProperty(this.oChipInstanceMock, sConfigParameterId, "key1");

        // Assert
        assert.strictEqual(sResult, undefined, "_getConfigurationProperty result");
        assert.strictEqual(this.oGetConfigurationParameterStub.callCount, 1, "getConfigurationParameter is always called");
        assert.strictEqual(this.oGetConfigurationParameterStub.firstCall.args[0], sConfigParameterId,
            "correct configuration parameter requested");
    });

    QUnit.test("Checks that config parameter value is not a stringified JSON.", function (assert) {
        // Arrange
        var sConfigParameterId = "param1";
        this.oGetConfigurationParameterStub.returns("no-stringified-JSON");

        // Act
        var sResult = chipsUtils._getConfigurationProperty(this.oChipInstanceMock, sConfigParameterId, "key1");

        // Assert
        assert.strictEqual(sResult, undefined, "_getConfigurationProperty result");
        assert.strictEqual(this.oGetConfigurationParameterStub.callCount, 1, "getConfigurationParameter is always called");
        assert.strictEqual(this.oGetConfigurationParameterStub.firstCall.args[0], sConfigParameterId,
            "correct configuration parameter requested");
    });

    QUnit.test("Checks that config parameter value is parsable but does not  a stringified JSON.", function (assert) {
        // Arrange
        var sConfigParameterId = "param1";
        this.oGetConfigurationParameterStub.returns("{}");

        // Act
        var sResult = chipsUtils._getConfigurationProperty(this.oChipInstanceMock, sConfigParameterId, "key1");

        // Assert
        assert.strictEqual(sResult, undefined, "_getConfigurationProperty result");
        assert.strictEqual(this.oGetConfigurationParameterStub.callCount, 1, "getConfigurationParameter is always called");
        assert.strictEqual(this.oGetConfigurationParameterStub.firstCall.args[0], sConfigParameterId,
            "correct configuration parameter requested");
    });

    QUnit.test("Checks that config parameter value is a string.", function (assert) {
        // Arrange
        var sConfigParameterId = "param1";
        this.oGetConfigurationParameterStub.returns("{\"key1\":\"successfully read\"}");

        // Act
        var sResult = chipsUtils._getConfigurationProperty(this.oChipInstanceMock, sConfigParameterId, "key1");

        // Assert
        assert.strictEqual(sResult, "successfully read", "_getConfigurationProperty result");
        assert.strictEqual(this.oGetConfigurationParameterStub.callCount, 1, "getConfigurationParameter is always called");
        assert.strictEqual(this.oGetConfigurationParameterStub.firstCall.args[0], sConfigParameterId,
            "correct configuration parameter requested");
    });

    QUnit.test("Checks that config parameter value is falsy.", function (assert) {
        // Arrange
        var sConfigParameterId = "param1";
        this.oGetConfigurationParameterStub.returns("{\"key1\": 0}");

        // Act
        var sResult = chipsUtils._getConfigurationProperty(this.oChipInstanceMock, sConfigParameterId, "key1");

        // Assert
        assert.strictEqual(sResult, 0, "_getConfigurationProperty result");
        assert.strictEqual(this.oGetConfigurationParameterStub.callCount, 1, "getConfigurationParameter is always called");
        assert.strictEqual(this.oGetConfigurationParameterStub.firstCall.args[0], sConfigParameterId,
            "correct configuration parameter requested");
    });

    QUnit.test("Checks that config parameter value is false.", function (assert) {
        // Arrange
        var sConfigParameterId = "param1";
        this.oGetConfigurationParameterStub.returns("{\"key1\": false}");

        // Act
        var sResult = chipsUtils._getConfigurationProperty(this.oChipInstanceMock, sConfigParameterId, "key1");

        // Assert
        assert.strictEqual(sResult, false, "_getConfigurationProperty result");
        assert.strictEqual(this.oGetConfigurationParameterStub.callCount, 1, "getConfigurationParameter is always called");
        assert.strictEqual(this.oGetConfigurationParameterStub.firstCall.args[0], sConfigParameterId,
            "correct configuration parameter requested");
    });

    QUnit.module("The function getBagText", {
        beforeEach: function () {
            this.oChipInstanceMock = {
                getBagIds: sandbox.stub().returns(["Bag1"]),
                getBag: sandbox.stub().withArgs("Bag1").returns({
                    getTextNames: sandbox.stub().returns(["text1"]),
                    getText: sandbox.stub().withArgs("text1").returns("textValue1")
                })
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns CHIP without Bag contract.", function (assert) {
        // Arrange
        // Act
        var sResult = chipsUtils.getBagText(this.oChipInstanceMock, "unknown_bag", "unknown_text");

        // Assert
        assert.strictEqual(sResult, undefined, "getBagText result");
        assert.strictEqual(this.oChipInstanceMock.getBag.callCount, 0, "getBag was not called");
    });

    QUnit.test("Returns bag Id and text name do not exist.", function (assert) {
        // Arrange
        // Act
        var sResult = chipsUtils.getBagText(this.oChipInstanceMock, "unknown_bag", "sTextName");

        // Assert
        assert.strictEqual(sResult, undefined, "getBagText result");
        assert.strictEqual(this.oChipInstanceMock.getBag.callCount, 0, "getBag was not called");
    });

    QUnit.test("Returns bag Id exists but text name does not.", function (assert) {
        // Arrange
        // Act
        var sResult = chipsUtils.getBagText(this.oChipInstanceMock, "Bag1", "unknown_text");

        // Assert
        assert.strictEqual(sResult, undefined, "getBagText result");
        assert.strictEqual(this.oChipInstanceMock.getBag.callCount, 1, "getBag was called once");
    });

    QUnit.test("Returns bag Id and text name exist.", function (assert) {
        // Arrange
        // Act
        var sResult = chipsUtils.getBagText(this.oChipInstanceMock, "Bag1", "text1");

        // Assert
        assert.strictEqual(sResult, "textValue1", "getBagText result");
        assert.strictEqual(this.oChipInstanceMock.getBag.callCount, 2, "getBag was called once");
    });

    QUnit.module("The function getTileSize", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct tile size of the tile.", function (assert) {
        // Arrange
        var oTile = {
            isStub: sandbox.stub().returns(false),
            getConfigurationParameter: sandbox.stub().returns(2)
        };

        // Act
        var sReturnedTileSize = chipsUtils.getTileSize(oTile);

        // Assert
        assert.strictEqual(sReturnedTileSize, "2x2", "The tile size was returned correctly.");
    });

    QUnit.test("Returns default tile size when tile is a stub.", function (assert) {
        // Arrange
        var oTile = {
            isStub: sandbox.stub().returns(true)
        };

        // Act
        var sReturnedTileSize = chipsUtils.getTileSize(oTile);

        // Assert
        assert.strictEqual(sReturnedTileSize, "1x1", "The tile size was returned correctly.");
    });

    QUnit.module("The function getTileConfigurationFromSimplifiedChip");

    QUnit.test("Returns the tile configuration if one exists", function (assert) {
        // Arrange
        var oSimplifiedChipMock = {
            configuration: {
                tileConfiguration: "{\"row\": 1,\"col\": 2}"
            }
        };

        // Act
        var oTileConfiguration = chipsUtils.getTileConfigurationFromSimplifiedChip(oSimplifiedChipMock);

        // Assert
        var oExpectedConfig = {
            row: 1,
            col: 2
        };
        assert.deepEqual(oTileConfiguration, oExpectedConfig, "The returned config is correct.");
    });

    QUnit.test("Returns an empty object if tile configuration doesn't exist", function (assert) {
        // Arrange
        var oSimplifiedChipMock = {
            configuration: {}
        };

        // Act
        var oTileConfiguration = chipsUtils.getTileConfigurationFromSimplifiedChip(oSimplifiedChipMock);

        // Assert
        assert.deepEqual(oTileConfiguration, {}, "The functions returns an empty object");
    });

    QUnit.module("The function getTargetUrlFromSimplifiedChip", {
        beforeEach: function () {
            this.oURLParsing = new URLParsing();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the navigation_target_url from the tile configuration", function (assert) {
        // Arrange
        var oSimplifiedChipMock = {
            configuration: {
                tileConfiguration: "{\"navigation_target_url\": \"#SalesOrder-manage\"}"
            }
        };

        // Act
        var sTargetUrl = chipsUtils.getTargetUrlFromSimplifiedChip(oSimplifiedChipMock, this.oURLParsing);

        // Assert
        assert.strictEqual(sTargetUrl, "#SalesOrder-manage", "The function returns the correct target url.");
    });

    QUnit.test("Builds the hash for custom targets", function (assert) {
        // Arrange
        var oSimplifiedChipMock = {};
        var oCustomTarget = {
            target: {
                semanticObject: "Action",
                action: "toSSB"
            },
            params: {
                EvaluationId: ["TheSpecialEvaluationId"]
            }
        };
        var oGetCustomTileTargetFromSimplifiedStub = sandbox.stub(chipsUtils, "getCustomTileTargetFromSimplified");
        oGetCustomTileTargetFromSimplifiedStub.returns(oCustomTarget);

        // Act
        var sTargetUrl = chipsUtils.getTargetUrlFromSimplifiedChip(oSimplifiedChipMock, this.oURLParsing);

        // Assert
        assert.strictEqual(sTargetUrl, "#Action-toSSB?EvaluationId=TheSpecialEvaluationId", "The function returns the correct target url.");
    });

    QUnit.module("The function getIndicatorDataSourceFromSimplifiedChip");

    QUnit.test("Returns the correct indicator data source object based on the tile configuration", function (assert) {
        // Arrange
        var oSimplifiedChipMock = {
            configuration: {
                tileConfiguration: "{\"service_url\": \"/SRV_SALESORDER_MANAGE/$count\", \"service_refresh_interval\": \"5\"}"
            }
        };

        // Act
        var oIndicatorDataSource = chipsUtils.getIndicatorDataSourceFromSimplifiedChip(oSimplifiedChipMock);

        // Assert
        var oExpectedIndicatorDataSource = {
            path: "/SRV_SALESORDER_MANAGE/$count",
            refresh: "5"
        };
        assert.deepEqual(oIndicatorDataSource, oExpectedIndicatorDataSource, "The function return the correct indicator data source.");
    });

    QUnit.test("Returns undefined if the service_url is not part of the tile configuration", function (assert) {
        // Arrange
        var oSimplifiedChipMock = {
            configuration: {
                tileConfiguration: "{\"service_refresh_interval\": \"5\"}"
            }
        };

        // Act
        var oIndicatorDataSource = chipsUtils.getIndicatorDataSourceFromSimplifiedChip(oSimplifiedChipMock);

        // Assert
        assert.strictEqual(typeof oIndicatorDataSource, "undefined", "The function returns undefined.");
    });

    QUnit.module("The function getTileSizeFromSimplifiedChip");

    QUnit.test("Returns the tile size as a string", function (assert) {
        // Arrange
        var oSimplifiedChipMock = {
            configuration: {
                row: 2,
                col: 3
            }
        };

        // Act
        var sTileSize = chipsUtils.getTileSizeFromSimplifiedChip(oSimplifiedChipMock);

        // Assert
        assert.strictEqual(sTileSize, "2x3", "The function returns the correct tile size");
    });

    QUnit.test("Return the default tile size if row/col configuration is missing", function (assert) {
        // Arrange
        var oSimplifiedChipMock = {
            configuration: {}
        };

        // Act
        var sTileSize = chipsUtils.getTileSizeFromSimplifiedChip(oSimplifiedChipMock);

        // Assert
        assert.strictEqual(sTileSize, "1x1", "The function returns the correct tile size");
    });

    QUnit.module("The function getNumberUnitFromSimplifiedChip");

    QUnit.test("Returns the display_number_unit from the tile configuration", function (assert) {
        // Arrange
        var oSimplifiedChipMock = {
            configuration: {
                tileConfiguration: "{\"display_number_unit\": \"kg\"}"
            }
        };

        // Act
        var sNumberUnit = chipsUtils.getNumberUnitFromSimplifiedChip(oSimplifiedChipMock);

        // Assert
        assert.strictEqual(sNumberUnit, "kg", "The function returns the correct number unit.");
    });

    QUnit.module("The function getInfoFromSimplifiedChip");

    QUnit.test("Returns the display_info_text from the chip bags tileProperties", function (assert) {
        // Arrange
        var oSimplifiedChipMock = {
            bags: {
                tileProperties: {
                    properties: {},
                    texts: {
                        display_info_text: "Tile Info from bag"
                    }
                }
            }
        };

        // Act
        var sTileInfo = chipsUtils.getInfoFromSimplifiedChip(oSimplifiedChipMock);

        // Assert
        assert.strictEqual(sTileInfo, "Tile Info from bag", "The function returns the correct tile info.");
    });

    QUnit.test("Returns undefined when the bag 'tileProperties' is missing", function (assert) {
        // Arrange
        var oSimplifiedChipMock = {
            bags: {}
        };

        // Act
        var sTileInfo = chipsUtils.getInfoFromSimplifiedChip(oSimplifiedChipMock);

        // Assert
        assert.strictEqual(sTileInfo, undefined, "The function returns the correct tile info.");
    });

    QUnit.test("Returns undefined when the bagProperty 'display_info_text' is missing", function (assert) {
        // Arrange
        var oSimplifiedChipMock = {
            bags: {
                tileProperties: {
                    properties: {},
                    texts: {}
                }
            }
        };

        // Act
        var sTileInfo = chipsUtils.getInfoFromSimplifiedChip(oSimplifiedChipMock);

        // Assert
        assert.strictEqual(sTileInfo, undefined, "The function returns the correct tile info.");
    });

    QUnit.module("The function isCustomTileFromSimplifiedChip");

    QUnit.test("Returns true if the chipId is not a dynamic or static base chip id", function (assert) {
        // Arrange
        var oSimplifiedChipMock = {
            chipId: "X-SAP-UI2-CHIP:/UI2/SOME_CUSTOM_TILE"
        };

        // Act
        var bIsCustomTile = chipsUtils.isCustomTileFromSimplifiedChip(oSimplifiedChipMock);

        // Assert
        assert.ok(bIsCustomTile, "The function returns true.");
    });

    QUnit.test("Returns false if the chipId is a dynamic base chip id", function (assert) {
        // Arrange
        var oSimplifiedChipMock = {
            chipId: "X-SAP-UI2-CHIP:/UI2/DYNAMIC_APPLAUNCHER"
        };

        // Act
        var bIsCustomTile = chipsUtils.isCustomTileFromSimplifiedChip(oSimplifiedChipMock);

        // Assert
        assert.notOk(bIsCustomTile, "The function returns false.");
    });

    QUnit.test("Returns false if the chipId is a static base chip id", function (assert) {
        // Arrange
        var oSimplifiedChipMock = {
            chipId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER"
        };

        // Act
        var bIsCustomTile = chipsUtils.isCustomTileFromSimplifiedChip(oSimplifiedChipMock);

        // Assert
        assert.notOk(bIsCustomTile, "The function returns false.");
    });

    QUnit.module("The function loadChipInstanceFromSimplifiedChip", {
        beforeEach: function () {
            this.oChipInstance = {
                load: sandbox.stub().callsArg(0)
            };
            this.oCreateChipInstanceStub = sandbox.stub().returns(this.oChipInstance);
            var oFactoryMock = {
                createChipInstance: this.oCreateChipInstanceStub
            };
            this.oGetFactoryStub = sandbox.stub().returns(oFactoryMock);
            var oPageBuildingService = {
                getFactory: this.oGetFactoryStub
            };
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").withArgs("PageBuilding")
                .resolves(oPageBuildingService);

            this.oAddBagDataToChipInstanceStub = sandbox.stub(chipsUtils, "addBagDataToChipInstance");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns a valid chip instance from the simplified chip data.", function (assert) {
        // Arrange
        var oSimplifiedChipMock = {
            chipId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
            bags: {},
            configuration: "configuration"
        };

        var oRawDataMock = {
            chipId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
            configuration: "\"configuration\""
        };

        // Act
        var oResult = chipsUtils.loadChipInstanceFromSimplifiedChip(oSimplifiedChipMock);

        return oResult.then(function (oChipInstance) {
            // Assert
            assert.strictEqual(this.oGetServiceAsyncStub.callCount, 1, "The service was requested once.");
            assert.strictEqual(this.oGetFactoryStub.callCount, 1, "The factory was requested once.");
            assert.strictEqual(this.oCreateChipInstanceStub.callCount, 1, "The chip instance was requested once.");
            assert.strictEqual(this.oAddBagDataToChipInstanceStub.callCount, 1, "The bag data from the chip instance were added.");
            assert.deepEqual(this.oCreateChipInstanceStub.getCall(0).args[0], oRawDataMock, "The creation of the instance was called with the correct data.");
            assert.deepEqual(this.oChipInstance, oChipInstance, "The correct chip instance was returned.");
            assert.deepEqual(this.oAddBagDataToChipInstanceStub.getCall(0).args[0], oChipInstance, "The correct chip instance was returned.");
        }.bind(this));
    });

    QUnit.module("The function addBagDataToChipInstance", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");

            this.oLogErrorStub = sandbox.stub(Log, "error");

            this.oSetTextStub = sandbox.stub();
            this.oSetPropertyStub = sandbox.stub();
            this.oBag = {
                setText: this.oSetTextStub,
                setProperty: this.oSetPropertyStub
            };

            this.oGetBagStub = sandbox.stub().returns(this.oBag);
            this.oChipInstance = {
                getBag: this.oGetBagStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns directly if there is no bag", function (assert) {
        // Act
        chipsUtils.addBagDataToChipInstance(this.oChipInstance, undefined);

        // Assert
        assert.strictEqual(this.oGetBagStub.callCount, 0, "getBag was not called.");
    });

    QUnit.test("Handles empty properties and missing texts correctly", function (assert) {
        // Arrange
        var oBags = {
            bag1: {
                properties: {}
            }
        };
        // Act
        chipsUtils.addBagDataToChipInstance(this.oChipInstance, oBags);

        // Assert
        assert.strictEqual(this.oSetTextStub.callCount, 0, "setText was not called.");
        assert.strictEqual(this.oSetPropertyStub.callCount, 0, "setProperty was not called.");
    });

    QUnit.test("Adds all bagProperties of all bags to the chip", function (assert) {
        // Arrange
        var oBags = {
            bag1: {
                properties: {
                    key1a: "value1a",
                    key1b: "value1b"
                },
                texts: {
                    key1c: "value1c",
                    key1d: "value1d"
                }
            },
            bag2: {
                properties: {
                    key2a: "value2a",
                    key2b: "value2b"
                },
                texts: {
                    key2c: "value2c",
                    key2d: "value2d"
                }
            }
        };

        // Act
        chipsUtils.addBagDataToChipInstance(this.oChipInstance, oBags);

        // Assert
        assert.strictEqual(this.oGetBagStub.callCount, 2, "getBag was called twice.");
        assert.deepEqual(this.oGetBagStub.getCall(0).args, [ "bag1" ], "getBag was called the first time with correct parameters.");
        assert.deepEqual(this.oGetBagStub.getCall(1).args, [ "bag2" ], "getBag was called the second time with correct parameters.");

        assert.strictEqual(this.oSetPropertyStub.callCount, 4, "setProperty was called four times.");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, [ "key1a", "value1a" ], "setProperty was called the first time with correct parameters.");
        assert.deepEqual(this.oSetPropertyStub.getCall(1).args, [ "key1b", "value1b" ], "setProperty was called the second time with correct parameters.");
        assert.deepEqual(this.oSetPropertyStub.getCall(2).args, [ "key2a", "value2a" ], "setProperty was called the third time with correct parameters.");
        assert.deepEqual(this.oSetPropertyStub.getCall(3).args, [ "key2b", "value2b" ], "setProperty was called the fourth time with correct parameters.");

        assert.strictEqual(this.oSetTextStub.callCount, 4, "setText was called four times.");
        assert.deepEqual(this.oSetTextStub.getCall(0).args, [ "key1c", "value1c" ], "setText was called the first time with correct parameters.");
        assert.deepEqual(this.oSetTextStub.getCall(1).args, [ "key1d", "value1d" ], "setText was called the second time with correct parameters.");
        assert.deepEqual(this.oSetTextStub.getCall(2).args, [ "key2c", "value2c" ], "setText was called the third time with correct parameters.");
        assert.deepEqual(this.oSetTextStub.getCall(3).args, [ "key2d", "value2d" ], "setText was called the fourth time with correct parameters.");
    });

    QUnit.test("Logs an error in case the bag.setProperty fails", function (assert) {
        // Arrange
        var oBags = {
            bagId: {
                properties: {
                    someProperty: "someValue"
                }
            }
        };
        this.oSetPropertyStub.throws("setProperty failed intentionally");
        var sExpectedMessage = "chipsUtils.addBagDataToChipInstance: setProperty failed intentionally";

        // Act
        chipsUtils.addBagDataToChipInstance(this.oChipInstance, oBags);

        // Assert
        assert.deepEqual(this.oLogErrorStub.getCall(0).args, [ sExpectedMessage ], "Log.error was called with correct parameters.");
    });

    QUnit.test("Logs an error in case the bag.setText fails", function (assert) {
        // Arrange
        var oBags = {
            bagId: {
                texts: {
                    someProperty: "someValue"
                }
            }
        };
        this.oSetTextStub.throws("setText failed intentionally");
        var sExpectedMessage = "chipsUtils.addBagDataToChipInstance: setText failed intentionally";

        // Act
        chipsUtils.addBagDataToChipInstance(this.oChipInstance, oBags);

        // Assert
        assert.deepEqual(this.oLogErrorStub.getCall(0).args, [ sExpectedMessage ], "Log.error was called with correct parameters.");
    });

    QUnit.module("The function getCustomTileTargetFromSimplified");

    QUnit.test("Returns no target, when the simplifiedChip does not match any case", function (assert) {
        // Arrange
        var oSimplifiedChip = {
            chipId: "X-SAP-UI2-CHIP:/UI2/SOME_CUSTOM_CHIP",
            configuration: {},
            bags: {}
        };
        // Act
        var oTarget = chipsUtils.getCustomTileTargetFromSimplified(oSimplifiedChip);
        // Assert
        assert.strictEqual(oTarget, null, "Returned the correct target");
    });

    QUnit.test("Returns the news tile specific target", function (assert) {
        // Arrange
        var oSimplifiedChip = {
            chipId: "X-SAP-UI2-CHIP:/UI2/AR_SRVC_NEWS",
            configuration: {},
            bags: {}
        };
        var oExpectedTarget = {
            target: {
                semanticObject: "NewsFeed",
                action: "displayNewsList"
            }
        };
        // Act
        var oTarget = chipsUtils.getCustomTileTargetFromSimplified(oSimplifiedChip);
        // Assert
        assert.deepEqual(oTarget, oExpectedTarget, "Returned the correct target");
    });

    QUnit.test("Returns the smart business specific target", function (assert) {
        // Arrange
        var oSimplifiedChip = {
            chipId: "X-SAP-UI2-CHIP:/UI2/SOME_SSB_CHIP",
            configuration: {
                tileConfiguration: JSON.stringify({
                    TILE_PROPERTIES: JSON.stringify({
                        semanticObject: "Action",
                        semanticAction: "toSSB",
                        evaluationId: "TheSpecialEvaluationId"
                    })
                })
            },
            bags: {}
        };
        var oExpectedTarget = {
            target: {
                semanticObject: "Action",
                action: "toSSB"
            },
            params: {
                EvaluationId: ["TheSpecialEvaluationId"]
            }
        };
        // Act
        var oTarget = chipsUtils.getCustomTileTargetFromSimplified(oSimplifiedChip);
        // Assert
        assert.deepEqual(oTarget, oExpectedTarget, "Returned the correct target");
    });

    QUnit.module("The function getKeywordsFromSimplifiedChip");

    QUnit.test("Returns a single keyword", function (assert) {
        // Arrange
        var oSimplifiedChip = {
            chipId: "X-SAP-UI2-CHIP:/UI2/SOME_SSB_CHIP",
            configuration: {},
            bags: {
                tileProperties: {
                    properties: {},
                    texts: {
                        display_search_keywords: "someKeyword"
                    }
                }
            }
        };
        var aExpectedKeywords = ["someKeyword"];
        // Act
        var aKeywords = chipsUtils.getKeywordsFromSimplifiedChip(oSimplifiedChip);
        // Assert
        assert.deepEqual(aKeywords, aExpectedKeywords, "Returned the correct keywords");
    });

    QUnit.test("Returns multiple keywords", function (assert) {
        // Arrange
        var oSimplifiedChip = {
            chipId: "X-SAP-UI2-CHIP:/UI2/SOME_SSB_CHIP",
            configuration: {},
            bags: {
                tileProperties: {
                    properties: {},
                    texts: {
                        display_search_keywords: "keyword1,keyword2"
                    }
                }
            }
        };
        var aExpectedKeywords = ["keyword1", "keyword2"];
        // Act
        var aKeywords = chipsUtils.getKeywordsFromSimplifiedChip(oSimplifiedChip);
        // Assert
        assert.deepEqual(aKeywords, aExpectedKeywords, "Returned the correct keywords");
    });

    QUnit.test("Returns an empty array when no keywords are defined", function (assert) {
        // Arrange
        var oSimplifiedChip = {
            chipId: "X-SAP-UI2-CHIP:/UI2/SOME_SSB_CHIP",
            configuration: {},
            bags: {
                tileProperties: {
                    properties: {},
                    texts: {
                        display_search_keywords: ""
                    }
                }
            }
        };
        // Act
        var aKeywords = chipsUtils.getKeywordsFromSimplifiedChip(oSimplifiedChip);
        // Assert
        assert.deepEqual(aKeywords, [], "Returned the correct keywords");
    });

    QUnit.test("Returns an empty array when tileProperties bag is missing", function (assert) {
        // Arrange
        var oSimplifiedChip = {
            chipId: "X-SAP-UI2-CHIP:/UI2/SOME_SSB_CHIP",
            configuration: {},
            bags: {}
        };
        // Act
        var aKeywords = chipsUtils.getKeywordsFromSimplifiedChip(oSimplifiedChip);
        // Assert
        assert.deepEqual(aKeywords, [], "Returned the correct keywords");
    });
});
