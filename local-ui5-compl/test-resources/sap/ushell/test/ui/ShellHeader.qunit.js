// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.ShellHeader
 */
sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/ui/core/Theming",
    "sap/ui/core/theming/Parameters",
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/IconPool",
    "sap/base/util/ObjectPath",
    "sap/m/Button",
    "sap/m/Input",
    "sap/ushell/api/NewExperience",
    "sap/ushell/ui/ShellHeader",
    "sap/ushell/ui/shell/ShellAppTitle",
    "sap/ushell/ui/shell/ShellHeadItem",
    "sap/base/Log",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ushell/utils",
    "sap/ushell/Container",
    "sap/ushell/state/StateManager"
], function (
    Localization,
    Theming,
    ThemeParameters,
    jQuery,
    IconPool,
    ObjectPath,
    Button,
    Input,
    NewExperience,
    ShellHeader,
    ShellAppTitle,
    ShellHeadItem,
    Log,
    nextUIUpdate,
    Config,
    resources,
    utils,
    Container,
    StateManager
) {
    "use strict";

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const ShellMode = StateManager.ShellMode;

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({
        useFakeTimers: false
    });

    QUnit.module("getLogo", {
        afterEach: function () {
            this.oShellHeader.destroy();
            sandbox.restore();
        }
    });
    QUnit.test("Custom Logo definded in the config", function (assert) {
        // Arrange
        sandbox.stub(Config, "last").returns("customLogo");
        this.oShellHeader = new ShellHeader("shell-header", {});
        // Act
        var sLogo = this.oShellHeader.getLogo();
        // Assert
        assert.strictEqual(sLogo, "customLogo", "Custom Logo is returned");
    });
    QUnit.test("Logo set in the constructor of the shell header", function (assert) {
        // Arrange
        this.oShellHeader = new ShellHeader("shell-header", { logo: "customLogo2" });
        // Act
        var sLogo = this.oShellHeader.getLogo();
        // Assert
        assert.strictEqual(sLogo, "customLogo2", "Custom Logo is returned");
    });

    QUnit.test("Logo is defined in the theme", function (assert) {
        // Arrange
        sandbox.stub(ThemeParameters, "get").returns("url(image.gif)");
        this.oShellHeader = new ShellHeader("shell-header", {
            logo: ""
        });
        // Act
        var sLogo = this.oShellHeader.getLogo();
        // Assert
        assert.strictEqual(sLogo, "image.gif", "Theme Logo is returned");
    });


    QUnit.test("Logo is not defined nor in the theme, nor in the constructor nor in the config", function (assert) {
        // Arrange
        var _sSapLogo = sap.ui.require.toUrl("sap/ushell/themes/base/img/SAPLogo.svg");

        this.oShellHeader = new ShellHeader("shell-header");
        // Act
        var sLogo = this.oShellHeader.getLogo();
        // Assert
        assert.strictEqual(sLogo, _sSapLogo, "default Logo is returned");
    });


    QUnit.test("an invalid Logo is defined in the theme", function (assert) {
        // Arrange
        sandbox.stub(ThemeParameters, "get").returns("invalid.gif)");
        this.oShellHeader = new ShellHeader("shell-header");
        // Act
        var sLogo = this.oShellHeader.getLogo();
        // Assert
        assert.strictEqual(sLogo, undefined, "undefined is returned");
    });

    QUnit.module("basic tests", {
        beforeEach: function (assert) {
            var done = assert.async();
            // this setTimeout fixes an issue with the not completely deleted objects
            setTimeout(async function () {
                this.oShellHeader = new ShellHeader("shell-header", {
                    logo: sap.ui.require.toUrl("sap/ushell/themes/base/img/SAPLogo.svg"),
                    showLogo: true,
                    visible: true,
                    headItems: [
                        new ShellHeadItem("backBtn", { icon: IconPool.getIconURI("nav-back"), ariaLabel: "Back" })
                    ],
                    headEndItems: [
                        new ShellHeadItem("sf", { icon: IconPool.getIconURI("search"), ariaLabel: "Search" })
                    ],
                    title: "Subtitle with a long text",
                    appTitle: new ShellAppTitle("shellAppTitle", { text: "AppTitle with a long text" }),
                    search: new Input()
                });
                this.oShellHeader.placeAt("qunit-fixture");
                await nextUIUpdate();

                done();
            }.bind(this), 0);
        },
        afterEach: function () {
            this.oShellHeader.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Logo linked if not on homepage, navigate home", async function (assert) {
        // Arrange
        this.oShellHeader.destroy();
        window.hasher = { getHash: sandbox.stub().returns("aaa-bbb-ccc") };

        this.oShellHeader = new ShellHeader("shell-header", {
            logo: sap.ui.require.toUrl("sap/ushell/themes/base/img/SAPLogo.svg"),
            homeUri: "#Shell-home"
        });

        var oSetHrefStub = sandbox.stub(this.oShellHeader, "_setLocationHref");

        // Act
        this.oShellHeader.placeAt("qunit-fixture");
        await nextUIUpdate();

        // Assert
        assert.equal(jQuery(".sapUshellShellIco").attr("href"), "#Shell-home", "Logo is linked");

        // Navigate home
        var oLogo = this.oShellHeader.$("logo")[0];
        this.oShellHeader.onsapspace({
            target: oLogo
        });
        assert.strictEqual(oSetHrefStub.callCount, 1, "_setLocationHref called once");
        assert.strictEqual(oLogo.href, oSetHrefStub.getCall(0).args[0], "Navigate home by space on the logo");

        // Cleanup
        delete window.hasher;
    });

    QUnit.test("Logo is linked on homepage", async function (assert) {
        // Arrange
        this.oShellHeader.destroy();

        window.hasher = { getHash: sandbox.stub().returns("Shell-home") };
        this.oShellHeader = new ShellHeader("shell-header", {
            logo: sap.ui.require.toUrl("sap/ushell/themes/base/img/SAPLogo.svg"),
            visible: true,
            homeUri: "#Shell-home"
        });

        // Act
        this.oShellHeader.placeAt("qunit-fixture");
        await nextUIUpdate();

        // Assert
        assert.notOk(jQuery(".sapUshellShellIco").attr("tabindex"), "tabindex is not set");
        assert.ok(jQuery(".sapUshellShellIco").attr("title"), "title is set");
        delete window.hasher;
    });

    QUnit.test("Rendering", function (assert) {
        // Arrange
        // Act
        // Assert
        assert.ok(this.oShellHeader.getId() === "shell-header", "Shell Header is rendered");
        assert.ok(jQuery("#shellAppTitle-button").text() === this.oShellHeader.getAppTitle().getText(), "Apptitle is rendered");
        assert.ok(jQuery(".sapUshellShellIco").length === 1, "Logo is rendered");
        assert.ok(jQuery(".sapUshellShellIco").attr("id") === "shell-header-logo", "Logo has an ID");
        assert.ok(jQuery("#sf").length === 1, "Search button is rendered");
    });

    QUnit.test("Test that accessibility property is set correctly", function (assert) {
        // Arrange
        // Act
        // Assert
        var aHeadItems = this.oShellHeader.getHeadItems(),
            aHeadEndItems = this.oShellHeader.getHeadEndItems();

        function assertShellHeaderItem (oItem) {
            if (!oItem.getDomRef()) {
                return;
            }
            var jQueryItem = jQuery(oItem.getDomRef()),
                sId = oItem.getId();
            assert.equal(jQueryItem.attr("tabindex"), 0, "tabindex is set correctly for ShellHeaderItem: " + sId);
            assert.equal(jQueryItem.attr("role"), "button", "role is set correctly for ShellHeaderItem: " + sId);
            assert.ok(!!jQueryItem.attr("aria-label"), "aria-label is not empty for ShellHeaderItem: " + sId);
        }

        aHeadItems.forEach(assertShellHeaderItem);
        aHeadEndItems.forEach(assertShellHeaderItem);
    });

    QUnit.test("setFocusOnShellHeader:", function (assert) {
        [{
            sTestDescription: "navigation direction forward, no HeadItems",
            bForwardNavigation: true,
            bExpectedFocusOnShellHeadItem: false,
            bExpectedFocusOnAppTitle: true,
            bExpectedFocusOnShellHeadEndItem: false
        }, {
            sTestDescription: "navigation direction forward, with HeadItems",
            bForwardNavigation: true,
            bShellHeadItems: true,
            bExpectedFocusOnShellHeadItem: true,
            bExpectedFocusOnAppTitle: false,
            bExpectedFocusOnShellHeadEndItem: false
        }, {
            sTestDescription: "navigation direction backwards, no HeadEndItems",
            bForwardNavigation: false,
            bExpectedFocusOnShellHeadItem: false,
            bExpectedFocusOnAppTitle: true,
            bExpectedFocusOnShellHeadEndItem: false
        }, {
            sTestDescription: "navigation direction backwards, with HeadEndItems",
            bForwardNavigation: false,
            bShellHeadEndItems: true,
            bExpectedFocusOnShellHeadItem: false,
            bExpectedFocusOnAppTitle: false,
            bExpectedFocusOnShellHeadEndItem: true
        }].forEach(function (oFixture) {
            // Arrange
            var oFocusResult = {
                bShellHeadItem: false,
                bAppTitle: false,
                bShellHeadEndItem: false
            };

            var fnGetHeadItemsStub = sandbox.stub(this.oShellHeader, "getHeadItems").callsFake(
                function () {
                    return oFixture.bShellHeadItems ? [{
                        focus: function () {
                            oFocusResult.bShellHeadItem = true;
                        }
                    }] : [];
                }
            );
            var fnGetAppTitleStub = sandbox.stub(this.oShellHeader, "getAppTitle").returns({
                focus: function () {
                    oFocusResult.bAppTitle = true;
                }
            });
            var fnGetHeadEndItemsStub = sandbox.stub(this.oShellHeader, "getHeadEndItems").callsFake(
                function () {
                    return oFixture.bShellHeadEndItems ? [{
                        focus: function () {
                            oFocusResult.bShellHeadEndItem = true;
                        }
                    }] : [];
                }
            );
            // Act
            this.oShellHeader.setFocusOnShellHeader(!oFixture.bForwardNavigation);

            // Assert
            assert.strictEqual(
                oFocusResult.bShellHeadItem,
                oFixture.bExpectedFocusOnShellHeadItem,
                "Focus was (not) set on the first shellHeadItem when " + oFixture.sTestDescription);
            assert.strictEqual(
                oFocusResult.bAppTitle,
                oFixture.bExpectedFocusOnAppTitle,
                "Focus was (not) set on the appTitle when " + oFixture.sTestDescription);
            assert.strictEqual(
                oFocusResult.bShellHeadEndItem,
                oFixture.bExpectedFocusOnShellHeadEndItem,
                "Focus was (not) set on the last shellHeadEndItem when " + oFixture.sTestDescription);

            fnGetHeadItemsStub.restore();
            fnGetAppTitleStub.restore();
            fnGetHeadEndItemsStub.restore();
        }.bind(this));
    });

    QUnit.test("Search State", async function (assert) {
        // open search
        this.oShellHeader.setSearchState("EXP", 10, true);
        await nextUIUpdate();

        var searchContainer = jQuery("#shell-header-hdr-search");
        var maxWidth = searchContainer[0].style.maxWidth;
        assert.strictEqual(maxWidth, "10rem", "Search field width is correctly set");
        assert.strictEqual(searchContainer.width() > 0, true, "Search Field container is visible");
        assert.strictEqual(searchContainer.attr("data-help-id"), "shellHeader-search");

        // close search
        this.oShellHeader.setSearchState("COL", 10, true);
        await nextUIUpdate();

        searchContainer = jQuery("#shell-header-hdr-search");
        maxWidth = searchContainer[0].style.maxWidth;
        assert.strictEqual(maxWidth, "0rem", "Search field width is correctly set");
        assert.strictEqual(searchContainer.width(), 0, "Search Field container is invisible");
    });

    /**
     * Theme Designer calls the onThemeChanged function when e.g. the Logo is updated.
     * With that, a rerendering should happen - although the theme stays the same
     * (as Theme Designer just changes the current theme).
     */
    QUnit.test("Rerender when onThemeChange is called", async function (assert) {
        // Arrange
        var oRenderer = this.oShellHeader.getRenderer();
        var oRendererStub = sandbox.stub(oRenderer, "render");
        sandbox.stub(this.oShellHeader, "getLogo").returns("fake/FakeLogo.svg"); // pretends that a different logo was set (BCP: 2280201266)

        var oEventMock = {
            theme: Theming.getTheme()
        };

        // Act
        this.oShellHeader.onThemeChanged(oEventMock);
        await nextUIUpdate();

        // Assert
        assert.ok(oRendererStub.called, "onThemeChanged() caused rerendering.");

        // Cleanup
        sandbox.restore();
    });

    QUnit.test("_getLeanMode", function (assert) {
        sandbox.stub(StateManager, "getShellMode");

        StateManager.getShellMode.returns(ShellMode.Headerless);
        assert.ok(this.oShellHeader._getLeanMode() === false, "lean mode correctly returned: false");
        StateManager.getShellMode.returns(ShellMode.Lean);
        assert.ok(this.oShellHeader._getLeanMode() === true, "lean mode correctly returned: true");
        StateManager.getShellMode.returns(ShellMode.Default);
        assert.ok(this.oShellHeader._getLeanMode() === false, "lean mode correctly returned: false");
    });

    QUnit.module("test accessibility roles", {
        beforeEach: function () {
            this.oShellHeader = new ShellHeader("shell-header", {
                showLogo: true,
                visible: true,
                headItems: [
                    new ShellHeadItem("backBtn", {
                        icon: IconPool.getIconURI("nav-back"),
                        target: "#Shell-home",
                        ariaLabel: "Back"
                    })
                ],
                headEndItems: [
                    new ShellHeadItem("userMenu", {
                        icon: IconPool.getIconURI("action-settings"),
                        ariaLabel: "User Settings",
                        ariaHaspopup: "dialog"
                    })
                ],
                title: "Subtitle with a long text",
                appTitle: new ShellAppTitle("shellAppTitle", { text: "AppTitle with a long text" })
            });
            this.oShellHeader.placeAt("qunit-fixture");

            return nextUIUpdate();
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellHeader.destroy();
        }
    });

    QUnit.test("Accessibility role set correctly for head items", function (assert) {
        var oButton1 = this.oShellHeader.getHeadItems()[0];
        var oButton2 = this.oShellHeader.getHeadEndItems()[0];
        assert.strictEqual(oButton1.$().attr("role"), "link", "navigation items should have aria role 'link'.");
        assert.strictEqual(oButton1.$().attr("aria-haspopup"), undefined, "aria-haspopup is not set specified.");
        assert.strictEqual(oButton2.$().attr("role"), "button", "normal items should have aria role 'button'.");
        assert.strictEqual(oButton2.$().attr("aria-haspopup"), "dialog", "aria-haspopup is correctly specified.");
    });

    QUnit.test("Accessibility role set correctly for the home button", function (assert) {
        assert.strictEqual(document.getElementById("shell-header-logo").getAttribute("role"), "button", "the home button has role 'button'");
    });

    QUnit.module("isHomepage", {
        beforeEach: function () {
            this.originalRootIntent = ObjectPath.get("renderers.fiori2.componentData.config.rootIntent", window["sap-ushell-config"]);
            this.oShellHeader = new ShellHeader();
            this.oHashStub = sandbox.stub();
            window.hasher = {
                getHash: this.oHashStub
            };
            this.setHomeUri = function (sIntent) {
                this.oShellHeader.setHomeUri(sIntent);
                ObjectPath.set("renderers.fiori2.componentData.config.rootIntent", sIntent, window["sap-ushell-config"]);
            };
        },
        afterEach: function () {
            ObjectPath.set("renderers.fiori2.componentData.config.rootIntent", this.originalRootIntent, window["sap-ushell-config"]);
            this.oShellHeader.destroy();
            delete window.hasher;
            sandbox.restore();
        }
    });

    QUnit.test("no special root intent - hash is #Shell-home", function (assert) {
        // Arrange
        this.oHashStub.returns("Shell-home");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, true, "Should return true.");
    });

    QUnit.test("no special root intent - hash is #Shell-home?", function (assert) {
        // Arrange
        this.oHashStub.returns("Shell-home?");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, true, "Should return true.");
    });

    QUnit.test("no special root intent - hash is #Launchpad-openFLPPage", function (assert) {
        // Arrange
        this.oHashStub.returns("Launchpad-openFLPPage");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, true, "Should return true.");
    });

    QUnit.test("no special root intent - hash is #Launchpad-openFLPPage?pageId=somePageId&spaceId=someSpaceId", function (assert) {
        // Arrange
        this.oHashStub.returns("Launchpad-openFLPPage?pageId=somePageId&spaceId=someSpaceId");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, true, "Should return true.");
    });

    QUnit.test("no special root intent - hash is #Sales-manage", function (assert) {
        // Arrange
        this.oHashStub.returns("Sales-manage");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.test("no special root intent - hash is #some-hash?withParam=value", function (assert) {
        // Arrange
        this.oHashStub.returns("some-hash?withParam=value");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.test("root intent is #Sales-manage - hash is #Shell-home", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("Shell-home");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.test("root intent is #Sales-manage - hash is #Shell-home?", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("Shell-home?");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.test("root intent is #Sales-manage - hash is #Launchpad-openFLPPage", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("Launchpad-openFLPPage");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, true, "Should return true.");
    });

    QUnit.test("root intent is #Sales-manage - hash is #Launchpad-openFLPPage?pageId=somePageId&spaceId=someSpaceId", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("Launchpad-openFLPPage?pageId=somePageId&spaceId=someSpaceId");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, true, "Should return true.");
    });

    QUnit.test("root intent is #Sales-manage - hash is #Sales-manage", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("Sales-manage");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, true, "Should return true.");
    });

    QUnit.test("no special root intent - hash is #some-hash?withParam=value", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("some-hash?withParam=value");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.test("root intent is #Sales-manage and hash is Sales-manage?", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("SalesManage?");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.test("root intent is #Sales-manage and hash is Sales-manag", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("SalesManag");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.test("root intent is #Sales-manage and hash is Sales-manage?param1=1", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("SalesManage?param1=1");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return true.");
    });

    QUnit.test("root intent is #Sales-manage and hash is Sales-manage&/home", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("Sales-manage&/home");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.test("root intent is #Sales-manage and hash is Sales-manage?param1=1&/home", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("Sales-manage?param1=1&/home");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.module("Event delegates", {
        beforeEach: function () {
            this.oPreventDefaultStub = sandbox.stub();
            this.oAddDelegateStub = sandbox.stub(ShellHeader.prototype, "addDelegate");
            this.oShellHeader = new ShellHeader();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.module("setHomeUri", {
        beforeEach: function () {
            this.oShellHeader = new ShellHeader();
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellHeader.destroy();
        }
    });

    QUnit.test("Sets the homeUri property to the value and returns an instance of ShellHeader", function (assert) {
        // Arrange
        var sUri = "#foo-bar";
        var oResult;
        // Act
        oResult = this.oShellHeader.setHomeUri(sUri);
        // Assert
        assert.strictEqual(this.oShellHeader.mProperties.homeUri, sUri, "The property was updated");
        assert.strictEqual(oResult.isA("sap.ushell.ui.ShellHeader"), true, "An instance of ShellHeader was returned");
    });

    QUnit.test("Does not set the homeUri property if the new value contains an invalid protocol", function (assert) {
        // Arrange
        // eslint-disable-next-line no-script-url
        var sUri = "javascript:alert('Hey there!')";
        var oLogStub = sandbox.stub(Log, "fatal");
        // Act
        this.oShellHeader.setHomeUri(sUri);
        // Assert
        assert.strictEqual(this.oShellHeader.mProperties.homeUri, "", "The value was replaced by an empty string");
        assert.strictEqual(oLogStub.callCount, 1, "One error was logged");
    });

    QUnit.module("_setLocationHref", {
        beforeEach: function () {
            this.oShellHeader = new ShellHeader();
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellHeader.destroy();
        }
    });

    QUnit.test("does not navigate and logs an error instead when the target contains an invalid protocol", function (assert) {
        // Arrange
        // eslint-disable-next-line no-script-url
        var sUrl = "javascript:alert('Hey there!')";
        var oLogStub = sandbox.stub(Log, "fatal");
        // Act
        this.oShellHeader._setLocationHref(sUrl);
        // Assert
        assert.strictEqual(oLogStub.callCount, 1, "One error was logged");
    });

    QUnit.module("Get Logo ALT text", {
        beforeEach: function () {
            this.oShellHeader = new ShellHeader();
            var oAccTitles = {
                "en-EN": "EN",
                de: "DE",
                default: "DEFAULT"
            };
            sandbox.stub(Config, "last").returns(JSON.stringify(oAccTitles));
        },
        afterEach: function () {
            sandbox.restore();
            this.oShellHeader.destroy();
            Config._reset();
        }
    });

    QUnit.test("returns correct text for en", function (assert) {
        sandbox.stub(Localization, "getLanguage").returns("en");
        this.oShellHeader.getCustomLogoAltText();
        assert.strictEqual(this.oShellHeader._sCustomAltText, "EN", "Correct text is returned");
    });

    QUnit.test("returns correct text for en-EN", function (assert) {
        sandbox.stub(Localization, "getLanguage").returns("en-EN");
        this.oShellHeader.getCustomLogoAltText();
        assert.strictEqual(this.oShellHeader._sCustomAltText, "EN", "Correct text is returned");
    });

    QUnit.test("returns correct text for de", function (assert) {
        sandbox.stub(Localization, "getLanguage").returns("de");
        this.oShellHeader.getCustomLogoAltText();
        assert.strictEqual(this.oShellHeader._sCustomAltText, "DE", "Correct text is returned");
    });

    QUnit.test("returns correct default text", function (assert) {
        sandbox.stub(Localization, "getLanguage").returns("fr");
        this.oShellHeader.getCustomLogoAltText();
        assert.strictEqual(this.oShellHeader._sCustomAltText, "DEFAULT", "Correct text is returned");
    });

    QUnit.test("correct text for different logo Uri, custom ALT text is configured", function (assert) {
        sandbox.stub(Localization, "getLanguage").returns("en");
        this.oShellHeader.getCustomLogoAltText();

        var sSapLogoUri = sap.ui.require.toUrl("sap/ushell/themes/base/img/SAPLogo.svg");
        assert.strictEqual(this.oShellHeader.getLogoAltText(), "", "No ALT text for empty logo");
        assert.strictEqual(this.oShellHeader.getLogoAltText(sSapLogoUri), resources.i18n.getText("sapLogoText"), "ALT text for SAP logo");
        assert.strictEqual(this.oShellHeader.getLogoAltText("CustomUri"), "EN", "Custom ALT text for custom logo");
    });

    QUnit.test("correct text for different logo Uri, custom ALT text is not configured", function (assert) {
        sandbox.stub(Localization, "getLanguage").returns("en");
        this.oShellHeader.getCustomLogoAltText();

        var sSapLogoUri = sap.ui.require.toUrl("sap/ushell/themes/base/img/SAPLogo.svg");
        delete this.oShellHeader._sCustomAltText;
        assert.strictEqual(this.oShellHeader.getLogoAltText(), "", "No ALT text for empty logo");
        assert.strictEqual(this.oShellHeader.getLogoAltText(sSapLogoUri), resources.i18n.getText("sapLogoText"), "ALT text for SAP logo");
        assert.strictEqual(this.oShellHeader.getLogoAltText("CustomUri"), resources.i18n.getText("SHELL_LOGO_TOOLTIP"), "Standard ALT text for custom logo");
    });

    QUnit.module("Logo tooltip", {
        afterEach: function () {
            if (this.oShellHeader) {
                this.oShellHeader.destroy();
                delete this.oShellHeader;
            }
            sandbox.restore();
        }
    });

    QUnit.test("current home intent is root", async function (assert) {
        this.oShellHeader = new ShellHeader("shell-header", {
            logo: sap.ui.require.toUrl("sap/ushell/themes/base/img/SAPLogo.svg"),
            homeUri: "#Shell-home"
        });

        this.oShellHeader.placeAt("qunit-fixture");
        await nextUIUpdate();

        assert.strictEqual(jQuery(".sapUshellShellIco").attr("title"), resources.i18n.getText("homeBtn_tooltip_text"), "Navigate to home");
    });

    QUnit.test("current home intent ids not root", async function (assert) {
        sandbox.stub(utils, "isRootIntent").returns(false); // The current intent is not root intent
        this.oShellHeader = new ShellHeader("shell-header", {
            logo: sap.ui.require.toUrl("sap/ushell/themes/base/img/SAPLogo.svg"),
            homeUri: "#Shell-home"
        });

        this.oShellHeader.placeAt("qunit-fixture");
        await nextUIUpdate();

        assert.strictEqual(jQuery(".sapUshellShellIco").attr("title"), resources.i18n.getText("lastPage_tooltip"), "Navigate to last opened page");
    });

    QUnit.module("getNewExperienceSwitchControl", {
        beforeEach: async function () {
            this.oShellHeader = new ShellHeader();
        },
        afterEach: async function () {
            sandbox.restore();
            this.oShellHeader.destroy();
        }
    });

    QUnit.test("Returns undefined when NewExperience is disabled", async function (assert) {
        // Arrange
        sandbox.stub(NewExperience, "isActive").returns(true);
        // Act
        var oControl = this.oShellHeader.getNewExperienceSwitchControl();
        // Assert
        assert.notOk(oControl, "The control is undefined");
    });

    QUnit.test("Returns undefined when NewExperience is enabled and switch is hidden", async function (assert) {
        // Arrange
        sandbox.stub(NewExperience, "isActive").returns(true);
        // Act
        var oControl = this.oShellHeader.getNewExperienceSwitchControl();
        // Assert
        assert.notOk(oControl, "The control is undefined");
    });

    QUnit.test("Returns control when NewExperience is enabled and switch is visible", async function (assert) {
        // Arrange
        const oButton = new Button();
        this.oShellHeader.setShowNewExperienceSwitch(true);
        sandbox.stub(NewExperience, "isActive").returns(true);
        sandbox.stub(NewExperience, "getShellHeaderControl").returns(oButton);
        // Act
        var oControl = this.oShellHeader.getNewExperienceSwitchControl();
        // Assert
        assert.strictEqual(oControl, oButton, "The correct control was returned");
    });
});
