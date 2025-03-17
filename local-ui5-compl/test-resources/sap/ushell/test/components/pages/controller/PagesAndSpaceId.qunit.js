// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* global QUnit, sinon */

/**
 * @file QUnit tests for sap.ushell.components.pages.controller.PagesAndSpaceId
 */
sap.ui.define([
    "sap/ushell/components/pages/controller/PagesAndSpaceId",
    "sap/ushell/resources",
    "sap/ushell/services/URLParsing",
    "sap/ushell/library",
    "sap/ushell/Config",
    "sap/ushell/Container"
], function (
    PagesAndSpaceId,
    resources,
    URLParsing,
    ushellLibrary,
    Config,
    Container
) {
    "use strict";

    // shortcut for sap.ushell.ContentNodeType
    var ContentNodeType = ushellLibrary.ContentNodeType;

    var sandbox = sinon.createSandbox({});

    QUnit.module("The function getPageAndSpaceId", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            window.hasher = { getHash: function () { } };
            sandbox.stub(window.hasher, "getHash").returns("intent-fromHasher");

            var oURLParsingService = new URLParsing();
            this.oGetServiceAsyncStub.withArgs("URLParsing").resolves(oURLParsingService);

            this.oParsePageAndSpaceIdStub = sandbox.stub(PagesAndSpaceId, "_parsePageAndSpaceId");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the function _parsePageAndSpaceId with the pageId and spaceId returned by the URL Parsing service", function (assert) {
        // Arrange
        var sHash = "some-intent?pageId=page1&spaceId=space1";
        var aExpectedResult = [
            ["page1"],
            ["space1"],
            {
                semanticObject: "some",
                action: "intent"
            }
        ];

        // Act
        var oResult = PagesAndSpaceId.getPageAndSpaceId(sHash);

        // Assert
        return oResult.then(function () {
            assert.ok(this.oParsePageAndSpaceIdStub.calledOnce, "The function _parsePageAndSpaceId is called once");
            assert.deepEqual(this.oParsePageAndSpaceIdStub.getCall(0).args, aExpectedResult, "The function _parsePageAndSpaceId is called with correct parameters");
        }.bind(this));
    });

    QUnit.test("Calls the function _parsePageAndSpaceId with the empty arrays when no pageId and spaceId are returned by the URL Parsing service", function (assert) {
        // Arrange
        var sHash = "";
        var aExpectedResult = [
            [],
            [],
            {
                semanticObject: "",
                action: ""
            }
        ];

        // Act
        var oResult = PagesAndSpaceId.getPageAndSpaceId(sHash);

        // Assert
        return oResult.then(function () {
            assert.ok(this.oParsePageAndSpaceIdStub.calledOnce, "The function _parsePageAndSpaceId is called once");
            assert.deepEqual(this.oParsePageAndSpaceIdStub.getCall(0).args, aExpectedResult, "The function _parsePageAndSpaceId is called with correct parameters");
        }.bind(this));
    });

    QUnit.test("Defaults to the hasher when no hash was provided", function (assert) {
        // Arrange
        var aExpectedResult = [
            [],
            [],
            {
                semanticObject: "intent",
                action: "fromHasher"
            }
        ];

        // Act
        var oResult = PagesAndSpaceId.getPageAndSpaceId();

        // Assert
        return oResult.then(function () {
            assert.ok(this.oParsePageAndSpaceIdStub.calledOnce, "The function _parsePageAndSpaceId is called once");
            assert.deepEqual(this.oParsePageAndSpaceIdStub.getCall(0).args, aExpectedResult, "The function _parsePageAndSpaceId is called with correct parameters");
        }.bind(this));
    });

    QUnit.test("Returns the returned value of the function _parsePageAndSpaceId", function (assert) {
        // Arrange
        var sHash = "";
        this.oParsePageAndSpaceIdStub.returns({
            pageId: "page1",
            spaceId: "space1"
        });

        // Act
        return PagesAndSpaceId.getPageAndSpaceId(sHash).then(function (result) {
            // Assert
            assert.ok(this.oParsePageAndSpaceIdStub.calledOnce, "The function _parsePageAndSpaceId is called once");
            assert.deepEqual(result, { pageId: "page1", spaceId: "space1" }, "The correct result is returned");
        }.bind(this));
    });

    QUnit.module("The function _getUserDefaultSpaceAndPage", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oResourceI18nGetTextStub = sandbox.stub(resources.i18n, "getText").returnsArg(0);
            this.oGetDefaultSpaceStub = sandbox.stub();
            sandbox.stub(PagesAndSpaceId, "getUserMyHomeEnablement").resolves();

            this.oGetServiceAsyncStub.withArgs("Menu").resolves({
                getDefaultSpace: this.oGetDefaultSpaceStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns a rejected promise if it cannot be determined whether myHome is enabled for the user.", function (assert) {
        // Arrange
        PagesAndSpaceId.getUserMyHomeEnablement = sandbox.stub().rejects();

        // Act
        return PagesAndSpaceId._getUserDefaultSpaceAndPage().catch(function () {
            // Assert
            assert.strictEqual(this.oGetServiceAsyncStub.args[0][0], "Menu", "The menu service was requested from the ushell container.");
            assert.ok(PagesAndSpaceId.getUserMyHomeEnablement.calledOnce, "The function getUserMyHomeEnablement of the menu service is called once.");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise with an error message when no default space was returned by the menu service", function (assert) {
        // Arrange
        this.oGetDefaultSpaceStub.resolves();

        // Act
        return PagesAndSpaceId._getUserDefaultSpaceAndPage().catch(function (error) {
            // Assert
            assert.ok(this.oGetDefaultSpaceStub.calledOnce, "The function GetDefaultSpace of the menu service is called once.");
            assert.strictEqual(error, "PageRuntime.NoAssignedSpace", "A rejected promise with the correctly translated error message is returned.");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise with an error message when there's no page in the default space.", function (assert) {
        // Arrange
        this.oGetDefaultSpaceStub.resolves({
            id: "EMPTY_SPACE",
            label: "Empty space",
            type: ContentNodeType.Space,
            isContainer: false,
            children: []
        });

        // Act
        return PagesAndSpaceId._getUserDefaultSpaceAndPage().catch(function (error) {
            // Assert
            assert.ok(this.oGetDefaultSpaceStub.calledOnce, "The function oGetDefaultSpaceStub of the menu service is called once.");
            assert.strictEqual(error, "PageRuntime.NoAssignedPage", "A rejected promise with the correctly translated error message is returned.");
        }.bind(this));
    });

    QUnit.test("Returns a promise which resolves to an object with a spaceId and a pageId in the default space", function (assert) {
        // Arrange
        this.oGetDefaultSpaceStub.resolves({
            id: "ZTEST_SPACE",
            label: "ZTest space",
            type: ContentNodeType.Space,
            isContainer: false,
            children: [{
                id: "ZTEST_PAGE",
                label: "ZTest page",
                type: ContentNodeType.Page,
                isContainer: true,
                children: []
            }]
        });

        var oExpectedResult = {
            spaceId: "ZTEST_SPACE",
            pageId: "ZTEST_PAGE"
        };

        PagesAndSpaceId.getUserMyHomeEnablement = sandbox.stub().resolves(false);

        // Act and assert
        return PagesAndSpaceId._getUserDefaultSpaceAndPage().then(function (result) {
            assert.deepEqual(PagesAndSpaceId.getUserMyHomeEnablement.calledOnce, true, "The function getUserMyHomeEnablement of the menu service is called once.");
            assert.deepEqual(result, oExpectedResult, "The resolved default page is 'page1' and default space is 'space1.");
        });
    });

    QUnit.module("The function _parsePageAndSpaceId", {
        beforeEach: function () {
            sandbox.stub(PagesAndSpaceId, "getUserMyHomeEnablement").resolves();
            this.oResourceI18nGetTextStub = sandbox.stub(resources.i18n, "getText").returns("translation");
            this.oGetUserDefaultPageStub = sandbox.stub(PagesAndSpaceId, "_getUserDefaultSpaceAndPage").resolves("page1");
            this.oSomeIntent = {
                semanticObject: "some",
                intent: "intent"
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns a rejected promise when the intent is not Shell-home and no pageId and spaceId are provided", function (assert) {
        // Act
        return PagesAndSpaceId._parsePageAndSpaceId([/*pageId */], [/*spaceId*/], this.oSomeIntent).catch(function (error) {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.strictEqual(this.oResourceI18nGetTextStub.getCall(0).args[0], "PageRuntime.NoPageIdAndSpaceIdProvided", "The function getText is called with correct parameters.");
            assert.strictEqual(error, "translation", "The correct error message is returned");
        }.bind(this));
    });

    QUnit.test("Returns the result of _getUserDefaultSpaceAndPage when the intent is Shell-home and no pageId and spaceId are provided", function (assert) {
        // Arrange
        var oIntent = {
            semanticObject: "Shell",
            action: "home"
        };

        // Act
        return PagesAndSpaceId._parsePageAndSpaceId([/*pageId*/], [/*spaceId*/], oIntent).then(function (result) {
            // Assert
            assert.strictEqual(this.oGetUserDefaultPageStub.callCount, 1, "The function _getUserDefaultSpaceAndPage is called once.");
            assert.strictEqual(result, "page1", "The correct result is returned.");
        }.bind(this));
    });

    QUnit.test("Returns the result of _getUserDefaultSpaceAndPage when the intent is empty and no pageId and spaceId are provided", function (assert) {
        // Arrange
        var oIntent = {
            semanticObject: "",
            action: ""
        };

        // Act
        return PagesAndSpaceId._parsePageAndSpaceId([/*pageId*/], [/*spaceId*/], oIntent).then(function (result) {
            // Assert
            assert.strictEqual(this.oGetUserDefaultPageStub.callCount, 1, "The function _getUserDefaultSpaceAndPage is called once.");
            assert.strictEqual(result, "page1", "The correct result is returned.");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise when the intent is Shell-home and no pageId and spaceId are provided and _getUserDefaultSpaceAndPage rejects", function (assert) {
        // Arrange
        var oIntent = {
            semanticObject: "Shell",
            action: "home"
        };

        var sError = "myError";

        this.oGetUserDefaultPageStub.returns(Promise.reject(sError));

        // Act
        return PagesAndSpaceId._parsePageAndSpaceId([/*pageId*/], [/*spaceId*/], oIntent).catch(function (error) {
            // Assert
            assert.strictEqual(this.oGetUserDefaultPageStub.callCount, 1, "The function _getUserDefaultSpaceAndPage is called once.");
            assert.strictEqual(error, sError, "The correct error is returned.");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise when only a spaceId is provided", function (assert) {
        // Act
        return PagesAndSpaceId._parsePageAndSpaceId([/*pageId*/], ["space1"], this.oSomeIntent).catch(function (error) {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.strictEqual(this.oResourceI18nGetTextStub.getCall(0).args[0], "PageRuntime.OnlySpaceIdProvided", "The function getText is called with correct parameters.");
            assert.strictEqual(error, "translation", "The correct error message is returned");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise when only a pageId are provided", function (assert) {
        // Act
        return PagesAndSpaceId._parsePageAndSpaceId(["page1"], [/*spaceId*/], this.oSomeIntent).catch(function (error) {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.strictEqual(this.oResourceI18nGetTextStub.getCall(0).args[0], "PageRuntime.OnlyPageIdProvided", "The function getText is called with correct parameters.");
            assert.strictEqual(error, "translation", "The correct error message is returned");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise when more than one pageId or spaceId are provided", function (assert) {
        // Act
        return PagesAndSpaceId._parsePageAndSpaceId(["page1", "page2"], [ /*spaceId*/], this.oSomeIntent).catch(function (error) {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.strictEqual(this.oResourceI18nGetTextStub.getCall(0).args[0], "PageRuntime.MultiplePageOrSpaceIdProvided", "The function getText is called with correct parameters.");
            assert.strictEqual(error, "translation", "The correct error message is returned");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise when the pageId is empty", function (assert) {
        // Act
        return PagesAndSpaceId._parsePageAndSpaceId([""], ["spaceId"], this.oSomeIntent).catch(function (error) {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.strictEqual(this.oResourceI18nGetTextStub.getCall(0).args[0], "PageRuntime.InvalidPageId", "The function getText is called with correct parameters.");
            assert.strictEqual(error, "translation", "The correct error message is returned");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise when the spaceId is empty", function (assert) {
        // Act
        return PagesAndSpaceId._parsePageAndSpaceId(["pageId"], [""], this.oSomeIntent).catch(function (error) {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.strictEqual(this.oResourceI18nGetTextStub.getCall(0).args[0], "PageRuntime.InvalidSpaceId", "The function getText is called with correct parameters.");
            assert.strictEqual(error, "translation", "The correct error message is returned");
        }.bind(this));
    });

    QUnit.test("Returns a resolved promise when the pageId and spaceId are not empty", function (assert) {
        // Arrange
        var oExpectedResult = {
            pageId: "providedPageId",
            spaceId: "providedSpaceId"
        };

        // Act
        return PagesAndSpaceId._parsePageAndSpaceId(["providedPageId"], ["providedSpaceId"], {/*intent*/ }).then(function (result) {
            // Assert
            assert.deepEqual(result, oExpectedResult, "The correct page and space ID is returned.");
        });
    });

    QUnit.module("getUserMyHomeEnablement", {
        beforeEach: function () {
            this.oConfigEmitStub = sandbox.stub(Config, "emit");
            this.oGetShowMyHomeStub = sandbox.stub();

            sandbox.stub(Container, "getUser").returns({
                getShowMyHome: this.oGetShowMyHomeStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Retrieves the config from the User object, updates the config and returns the value", function (assert) {
        // Arrange
        var bExpectedResult = true;
        var bExpectedConfigEmitArgs = [
            "/core/spaces/myHome/userEnabled",
            bExpectedResult
        ];
        this.oGetShowMyHomeStub.returns(bExpectedResult);
        // Act
        return PagesAndSpaceId.getUserMyHomeEnablement()
            .then(function (result) {
                // Assert
                assert.strictEqual(this.oGetShowMyHomeStub.callCount, 1, "getShowMyHome was called exactly once on the user object");
                assert.strictEqual(this.oConfigEmitStub.callCount, 1, "Config.emit was called exactly once");
                assert.deepEqual(this.oConfigEmitStub.getCall(0).args, bExpectedConfigEmitArgs, "Config.emit was called with the expected arguments");
                assert.strictEqual(result, bExpectedResult, "The expected result was returned");
            }.bind(this));
    });
});
