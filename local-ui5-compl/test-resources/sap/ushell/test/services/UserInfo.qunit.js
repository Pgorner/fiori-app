// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.UserInfo
 */
sap.ui.define([
    "sap/ushell/services/UserInfo",
    "sap/ushell/User",
    "sap/ui/core/Core",
    "sap/ui/core/Theming",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (UserInfo, User, Core, Theming, jQuery, Container) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.services.UserInfo", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            if (Core.applyTheme) {
                sandbox.stub(Core, "applyTheme");
            }
            sandbox.stub(Theming, "setTheme");
            Container.init("local")
                .then(function () {
                    Container.getServiceAsync("UserInfo").then(function (UserInfoService) {
                        this.UserInfoService = UserInfoService;
                        fnDone();
                    }.bind(this));
                }.bind(this));
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            sandbox.restore();

        }
    });

    QUnit.test("getServiceAsync", function (assert) {
        // test
        assert.ok(this.UserInfoService instanceof UserInfo);
        assert.strictEqual(typeof this.UserInfoService.getId, "function");
    });

    QUnit.test("delegation to Container - id", function (assert) {
        // prepare test
        sandbox.stub(Container, "getUser").callsFake(function () {
            return new User({ id: "id" });
        });

        // test
        assert.strictEqual(this.UserInfoService.getId(), "id");
        assert.strictEqual(Container.getUser.callCount, 1, "Container.getUser was called once");
    });

    QUnit.test("delegation to Container - first name", function (assert) {
        // prepare test
        sandbox.stub(Container, "getUser").callsFake(function () {
            return new User({ firstName: "First_Name" });
        });

        // test
        assert.strictEqual(this.UserInfoService.getFirstName(), "First_Name");
        assert.ok(Container.getUser.callCount, 1, "Container.getUser was called once");
    });

    QUnit.test("delegation to Container - last name", function (assert) {
        // prepare test
        sandbox.stub(Container, "getUser").callsFake(function () {
            return new User({ lastName: "Last_Name" });
        });

        // test
        assert.strictEqual(this.UserInfoService.getLastName(), "Last_Name");
        assert.ok(Container.getUser.callCount, 1, "Container.getUser was called once");
    });

    QUnit.test("delegation to Container - full name", function (assert) {
        // prepare test
        sandbox.stub(Container, "getUser").callsFake(function () {
            return new User({ fullName: "Full_Name" });
        });

        // test
        assert.strictEqual(this.UserInfoService.getFullName(), "Full_Name");
        assert.ok(Container.getUser.callCount, 1, "Container.getUser was called once");
    });

    QUnit.test("delegation to Container - email", function (assert) {
        // prepare test
        sandbox.stub(Container, "getUser").callsFake(function () {
            return new User({ email: "email" });
        });

        // test
        assert.strictEqual(this.UserInfoService.getEmail(), "email");
        assert.ok(Container.getUser.callCount, 1, "Container.getUser was called once");
    });

    QUnit.test("get user data", function (assert) {
        var oUser = this.UserInfoService.getUser();

        // test
        assert.ok(oUser.getTheme() === "sap_horizon", "check user selected theme");
        assert.ok(oUser.getAccessibilityMode() === false, "check user selected accessibility mode");
    });

    QUnit.test("set user data", function (assert) {
        var oUser = this.UserInfoService.getUser();
        var bFailed = false;
        sandbox.stub(oUser, "applyTheme");
        //Set
        oUser.setTheme("theme2");
        oUser.setAccessibilityMode(true);
        // test
        assert.ok(oUser.getTheme() === "theme2", "check user selected theme");
        assert.ok(oUser.getAccessibilityMode() === true, "check user selected accessibility mode");

        oUser.isSetThemePermitted = function () {
            return false;
        };
        try {
            oUser.setTheme("theme3");
        } catch (e) {
            assert.ok(oUser.getTheme() === "theme2", "check user  theme wasn't changed");
            bFailed = true;
        }
        assert.ok(bFailed === true, "check that set Theme was prevented");

        oUser.isSetAccessibilityPermitted = function () {
            return false;
        };
        bFailed = false;
        try {
            oUser.setAccessibilityMode(false);
        } catch (exc) {
            assert.ok(oUser.getAccessibilityMode() === true, "check user accessibility wasn't changed ");
            bFailed = true;
        }
        assert.ok(bFailed === true, "check that set accessibility was prevented");
    });

    QUnit.test("get theme list", function (assert) {
        var oFakeAdapter = {
            getThemeList: sandbox.stub().returns(
                new jQuery.Deferred().resolve({ options: [{ id: "sap_belize_plus" }] }).promise()
            )
        };
        var oUserInfoService = new UserInfo(oFakeAdapter);
        assert.expect(3);

        // test
        return oUserInfoService.getThemeList().done(function (res) {
            var aThemeConfig = res.options;
            assert.ok(aThemeConfig, "got the theme configuration back");
            assert.ok(Object.prototype.toString.apply(aThemeConfig), "[object Array]", "got configuration array");
            assert.ok(aThemeConfig.length === 1, "got 1 theme back");
        });
    });

    QUnit.test("update user preferences", function (assert) {
        // Arrange
        var oFakeAdapter = {
            updateUserPreferences: sandbox.stub().returns(
                new jQuery.Deferred().resolve().promise()
            )
        };

        sandbox.stub(Container, "getUser");

        var oUserInfoService = new UserInfo(oFakeAdapter);

        // Test
        return oUserInfoService.updateUserPreferences()
            .done(function () {
                // Assert
                assert.strictEqual(oFakeAdapter.updateUserPreferences.callCount, 1, "updateUserPreferences call delegated to adapter correctly");
            })
            .fail(function () {
                assert.ok(false, "should never happen");
            });
    });
});
