// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

QUnit.config.testTimeout = 500000;

/**
 * @fileOverview QUnit tests for behaviour of stateful container
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/test/components/applicationIntegration/application/IframeUtils",
    "sap/ushell/utils"
], function (
    Log,
    nextUIUpdate,
    IframeUtils,
    ushellUtils
) {
    "use strict";

    /* global QUnit, sinon*/

    let oFlpIframe,
        sIframeIdLetterBoxing,
        sIframeIdX1Y1,
        sIframeIdGUISimulation,
        sIframeSCube,
        sIframeRenderer,
        sIframeFESR;
    const oCustomLocale = {
        calendarType: "Gregorian",
        datePattern: {
            short: "mm/dd/yyyy",
            medium: "mmm d', 'yyyy"
        },
        numberFormat: {
            group: " ",
            decimal: ","
        },
        timePattern: {
            short: "hh:mm",
            medium: "hh:mm:ss a"
        },
        calendarMapping: [
            "mm/dd/yyyy",
            "29/9/1444",
            "4/20/23"
        ],
        currencies: {
            KWD: {digits: 3},
            TND: {digits: 3}
        }
    };

    async function navToHome () {
        IframeUtils.setHash(oFlpIframe, "#Shell-home");
        await IframeUtils.waitForCssSelector(oFlpIframe, "#__renderer0---pages-component-container");
    }

    function getApplicationCount () {
        const oViewPortContainer = IframeUtils.getWithCssSelector(oFlpIframe, "#viewPortContainer");
        return Array.from(oViewPortContainer.children).filter((element) => element.id.startsWith("application-")).length;
    }

    function checkCorrectAppContainersIds (assert, nAppsIframes, bHomeShown) {
        //check that total number of entries under "viewPortContainer" is correct
        const iApplicationCount = getApplicationCount();
        assert.strictEqual(iApplicationCount, nAppsIframes, "checking container elements");

        if (nAppsIframes >= 1) {
            assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#application-toLetterBoxing-toLetterBoxing"), "application-toLetterBoxing-toLetterBoxing was found");
            assert.strictEqual(getIframeIdx("toLetterBoxing-toLetterBoxing"), sIframeIdLetterBoxing, "correct iframe index");
        }
        if (nAppsIframes >= 2) {
            assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#application-X1-Y1"), "application-X1-Y1 was found");
            assert.strictEqual(getIframeIdx("X1-Y1"), sIframeIdX1Y1, "correct iframe index");
        }
        if (nAppsIframes >= 3) {
            assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#application-GUI-Simulation"), "application-GUI-Simulation was found");
            assert.strictEqual(getIframeIdx("GUI-Simulation"), sIframeIdGUISimulation, "correct iframe index");
        }
        if (nAppsIframes >= 4) {
            assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#application-SCube-App1"), "application-SCube-App1 was found");
            assert.strictEqual(getIframeIdx("SCube-App1"), sIframeSCube, "correct iframe index");
        }
        if (nAppsIframes >= 5) {
            assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#application-Renderer-Sample"), "application-Renderer-Sample was found");
            assert.strictEqual(getIframeIdx("Renderer-Sample"), sIframeRenderer, "correct iframe index");
        }
        if (nAppsIframes >= 6) {
            assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#application-FioriToExtAppIsolated-Action"), "application-FioriToExtAppIsolated-Action was found");
            assert.strictEqual(getIframeIdx("FioriToExtAppIsolated-Action"), sIframeFESR, "correct iframe index");
        }
    }

    function checkElementInIframeApp (assert, sAppId, sId, bExists) {
        const oNode = IframeUtils.getWithCssSelector(oFlpIframe, `.${sId}`, `#application-${sAppId}`);
        if (bExists) {
            assert.ok(oNode, `${sId} was found`);
        } else {
            assert.ok(!oNode, `${sId} was not found`);
        }
    }

    function checkAppContainerClass (assert, sFrameSelector, aAssertions) {
        aAssertions.forEach(([sClass, bExists]) => {
            const oAppContainer = IframeUtils.getWithCssSelector(oFlpIframe, `${sFrameSelector}`);
            if (oAppContainer) {
                if (bExists) {
                    assert.ok(oAppContainer.classList.contains(sClass), `${sClass} was found`);
                } else {
                    assert.ok(!oAppContainer.classList.contains(sClass), `${sClass} was not found`);
                }
            } else {
                assert.notOk(oAppContainer, `AppContainer ${sFrameSelector} was not found`);
            }
        });
    }

    function getIframeIdx (sAppId) {
        const oIframe = IframeUtils.getWithCssSelector(oFlpIframe, `#application-${sAppId}`);
        return oIframe.getAttribute("sap-iframe-idx");
    }

    async function clickOnIframeAppButton (sAppId, sButtonClass) {
        const oButtonDomRef = IframeUtils.getWithCssSelector(oFlpIframe, `.${sButtonClass}`, `#application-${sAppId}`);
        const oButton = await IframeUtils.waitForControl(oFlpIframe, oButtonDomRef.id, `#application-${sAppId}`);
        oButton.firePress();
    }

    QUnit.module("test", {
        beforeEach: function () {
            oFlpIframe = IframeUtils.createIframe("sap/ushell/shells/cdm/FioriLaunchpadCFLP.html?sap-ui-debug=true#Shell-home");
            IframeUtils.appendToQunitFixture(oFlpIframe);
        }
    });

    QUnit.test("check use of same iframe for two apps", async function (assert) {
        await navToHome();

        /**
         * ================================================ test 1 =================================================
         * In this test we open the first ui5 app that should create the first stateful container iframe
         * ==========================================================================================================
         */
        assert.ok(true, "-------------------------------- starting test 1 --------------------------------");
        Log.info("----- openApp1");
        const Formatting = await IframeUtils.requireAsync(oFlpIframe, "sap/base/i18n/Formatting");

        Formatting.setCalendarType(oCustomLocale.calendarType);
        Formatting.setDatePattern("short", oCustomLocale.datePattern.short);
        Formatting.setDatePattern("medium", oCustomLocale.datePattern.medium);
        Formatting.setNumberSymbol("group", oCustomLocale.numberFormat.group);
        Formatting.setNumberSymbol("decimal", oCustomLocale.numberFormat.decimal);
        Formatting.setTimePattern("short", oCustomLocale.timePattern.short);
        Formatting.setTimePattern("medium", oCustomLocale.timePattern.medium);
        Formatting.setCustomIslamicCalendarData(oCustomLocale.calendarMapping);
        Formatting.setCustomCurrencies(oCustomLocale.currencies);
        checkCorrectAppContainersIds(assert, 0, true);

        IframeUtils.setHash(oFlpIframe, "#toLetterBoxing-toLetterBoxing");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idQunitChangeLetterBoxButton", "#application-toLetterBoxing-toLetterBoxing");

        const oContainerOuterContentWindow = await IframeUtils.requireAsync(oFlpIframe, "sap/ushell/Container");
        let oInnerFrame = IframeUtils.getWithCssSelector(oFlpIframe, "#application-toLetterBoxing-toLetterBoxing");
        let oContainerInnerContentWindow = await IframeUtils.requireAsync(oInnerFrame, "sap/ushell/Container");
        const aResults = await Promise.all([
            oContainerOuterContentWindow.getServiceAsync("UserInfo"),
            oContainerInnerContentWindow.getServiceAsync("UserInfo"),
            oContainerInnerContentWindow.getServiceAsync("Navigation"),
            oContainerInnerContentWindow.getServiceAsync("CrossApplicationNavigation"),
            oContainerInnerContentWindow.getServiceAsync("AppState")
        ]);

        const oUserInfoServiceFlpIframe = aResults[0];
        const oUserInfoServiceAppIframe = aResults[1];
        const oNavigationServiceAppIframe = aResults[2];
        const oCrossAppNavigationServiceAppIframe = aResults[3];
        const oAppStateServiceAppIframe = aResults[4];

        //make sure that user info returned in shell is the same one as returned
        //in iframe when "getShellUserInfo" api
        assert.strictEqual(oUserInfoServiceFlpIframe.getId(), "DOEJ");
        assert.strictEqual(oUserInfoServiceFlpIframe.getEmail(), "john.doe@sap.com");
        assert.strictEqual(oUserInfoServiceFlpIframe.getFirstName(), "John");
        assert.strictEqual(oUserInfoServiceFlpIframe.getLastName(), "Doe");
        assert.strictEqual(oUserInfoServiceFlpIframe.getFullName(), "John Doe");

        const oShellUserInfoFlpIframe = await oUserInfoServiceFlpIframe.getShellUserInfo();
        assert.propEqual(oShellUserInfoFlpIframe, {
            id: "DOEJ",
            email: "john.doe@sap.com",
            firstName: "John",
            lastName: "Doe",
            fullName: "John Doe"
        });

        assert.strictEqual(oUserInfoServiceAppIframe.getId(), "CFLP_TESTER");
        assert.strictEqual(oUserInfoServiceAppIframe.getEmail(), "email");
        assert.strictEqual(oUserInfoServiceAppIframe.getFirstName(), "First_Name");
        assert.strictEqual(oUserInfoServiceAppIframe.getLastName(), "Last_Name");
        assert.strictEqual(oUserInfoServiceAppIframe.getFullName(), "Full_Name");

        const oShellUserInfoAppIframe = await oUserInfoServiceAppIframe.getShellUserInfo();
        assert.propEqual(oShellUserInfoAppIframe, {
            id: "DOEJ",
            email: "john.doe@sap.com",
            firstName: "John",
            lastName: "Doe",
            fullName: "John Doe"
        });

        //check the "Navigation" service proxy
        //===============================================
        //[Navigation] test 1: getHref
        const sHref = await oNavigationServiceAppIframe.getHref(
            {
                target: {
                    semanticObject: "AnObject",
                    action: "action"
                },
                params: {
                    "sap-xapp-state-data": JSON.stringify({ a: "b", c: "d" })
                }
            }
        );

        assert.strictEqual(sHref.startsWith("#AnObject-action?sap-app-origin-hint=&sap-xapp-state="), true, "Navigation:getHref works");

        //===============================================
        //[Navigation] test 2: isInitialNavigation
        const bIsInitialNavigation = await oNavigationServiceAppIframe.isInitialNavigation();

        assert.strictEqual(bIsInitialNavigation, false, "Navigation:isInitialNavigation works");

        //===============================================
        //[Navigation] test 3: getPrimaryIntent
        const oPrimaryIntent = await oNavigationServiceAppIframe.getPrimaryIntent("toLetterBoxing");
        assert.deepEqual(
            JSON.parse(JSON.stringify(oPrimaryIntent)),
                {
                    intent: "#toLetterBoxing-toLetterBoxing?sap-app-origin-hint=",
                    tags: ["primaryAction"],
                    text: "Letter Boxing"
                },
            "Navigation:getPrimaryIntent works");

        //===============================================
        //[Navigation] test 4: getLinks
        const oGetLinkParams = [
            {semanticObject: "SCube"},
            {semanticObject: "X1"}
        ];
        oGetLinkParams[0].ui5Component = oGetLinkParams[0];
        const aGetLinksRes = await oNavigationServiceAppIframe.getLinks(oGetLinkParams);

        assert.deepEqual(JSON.parse(JSON.stringify(aGetLinksRes)),
            [
                [
                    {
                        intent: "#SCube-App1?sap-app-origin-hint=",
                        text: "SCube App1"
                    },
                    {
                        intent: "#SCube-App2?sap-app-origin-hint=",
                        text: "SCube App2"
                    }
                ],
                [
                    {
                        intent: "#X1-Y1?sap-app-origin-hint=",
                        text: "Stateful App A"
                    }
                ]
            ],
            "Navigation:getLinks works");

        //===============================================
        //[Navigation] test 5: getSemanticObjects
        const aGetSemanticObjects = await oNavigationServiceAppIframe.getSemanticObjects();

        assert.deepEqual(
            JSON.parse(JSON.stringify(aGetSemanticObjects)).sort(),
            [
                "App1",
                "App2",
                "AppFullWidth",
                "AppNavSample",
                "BookmarkStateIso",
                "CameraAndLocation",
                "FioriToExtAppIsolated",
                "FioriToExtAppTargetIsolated",
                "GUI",
                "Renderer",
                "SCube",
                "Shell",
                "X1",
                "X2",
                "toLetterBoxing"
            ].sort(),
            "Navigation:getSemanticObjects works");

        //===============================================
        //[Navigation] test 6: getAppState
        const oState = oAppStateServiceAppIframe.createEmptyAppState();
        oState.setData({
            a: 1
        });
        await oState.save();
        const oAppState = await oNavigationServiceAppIframe.getAppState(undefined, oState.getKey());

        assert.deepEqual(
            JSON.parse(JSON.stringify(oAppState.getData())),
            {a: 1},
            "Navigation:getAppState works");

        //===============================================
        //[Navigation] test 7: resolveIntent
        const oResolveIntent = await oNavigationServiceAppIframe.resolveIntent("#AppFullWidth-id");

        oResolveIntent.url = oResolveIntent.url
            .replace("sap-history-dir=NewEntry", "sap-history-dir=ABCD")
            .replace("sap-history-dir=Unknown", "sap-history-dir=ABCD");
        assert.deepEqual(
            JSON.parse(JSON.stringify(oResolveIntent)),
            {url: "../../../../../test-resources/" +
                "sap/ushell/shells/demo/ui5appruntime.html?sap-ui-app-id=sap.ushell.demo.AppNavSample&" +
                "sap-startup-params=sap-ushell-defaultedParameterNames%3D%5B%22sap-ushell-navmode%22%5D&" +
                "sap-shell=FLP&sap-touch=1&sap-ui-versionedLibCss=true&sap-history-dir=ABCD&" +
                "sap-theme=sap_horizon&sap-locale=en&sap-iframe-hint=UI5&sap-spaces=true#toLetterBoxing-toLetterBoxing"},
            "Navigation:resolveIntent works");

        //===============================================
        //[Navigation] test 8: resolveIntent (error case)
        await oNavigationServiceAppIframe.resolveIntent("#DoesNot-exist").catch((oError) => {
            // This error is coming from the application iframe, so we need to compare against
            // the local error class, because the error class is not shared across iframes
            const { Error: LocalErrorClass } = IframeUtils.getGlobalThis(oInnerFrame);
            assert.ok(oError instanceof LocalErrorClass, "Navigation:resolveIntent error case works");
            // check that error details originate from the outer iframe
            assert.ok(oError.message.includes("DoesNot-exist"), "Navigation:resolveIntent error message is correct");
            assert.ok(oError.stack.includes("sap/ushell/services"), "Navigation:resolveIntent error stack is correct");
        });

        //===============================================
        //[Navigation] test 9: isUrlSupported
        await oNavigationServiceAppIframe.isUrlSupported("https://www.sap.com")
            .then(() => assert.ok(true, "Navigation:isUrlSupported works"))
            .catch(() => assert.ok(false, "Navigation:isUrlSupported does not work"));
        //===============================================


        //check the "CrossApplicationNavigation" service proxy (still supported in old versions of AppRuntime)
        //===============================================
        //[CrossApplicationNavigation] test 1: getSemanticObjectLinks
        const aResult = await oCrossAppNavigationServiceAppIframe.getSemanticObjectLinks("SCube");
        assert.deepEqual(JSON.parse(JSON.stringify(aResult)),
            [
                {
                    intent: "#SCube-App1?sap-app-origin-hint=",
                    text: "SCube App1"
                },
                {
                    intent: "#SCube-App2?sap-app-origin-hint=",
                    text: "SCube App2"
                }
            ], "CrossApplicationNavigation:getSemanticObjectLinks");

        //===============================================
        //[CrossApplicationNavigation] test 2: isIntentSupported
        let oIsIntentSupported = await oCrossAppNavigationServiceAppIframe.isIntentSupported(["#AnObject-action?A=B&c=e"]);
        assert.strictEqual(oIsIntentSupported["#AnObject-action?A=B&c=e"].supported, false,
            "CrossApplicationNavigation:isIntentSupported 1 works");

        oIsIntentSupported = await oCrossAppNavigationServiceAppIframe.isIntentSupported(["#toLetterBoxing-toLetterBoxing"]);
        assert.strictEqual(oIsIntentSupported["#toLetterBoxing-toLetterBoxing"].supported, true,
            "CrossApplicationNavigation:isIntentSupported 2 works");

        //===============================================
        //[CrossApplicationNavigation] test 3: isNavigationSupported
        const aIsNavigationSupported = await oCrossAppNavigationServiceAppIframe.isNavigationSupported([
            { shellHash: "SalesOrder-approve?SOId=1234" }, {shellHash: "AnObject-Action"}
        ]);
        assert.strictEqual(aIsNavigationSupported[0].supported, true,
            "CrossApplicationNavigation:isNavigationSupported 1 works");
        assert.strictEqual(aIsNavigationSupported[1].supported, true,
            "CrossApplicationNavigation:isNavigationSupported 2 works");

        //===============================================
        //[CrossApplicationNavigation] test 4: expandCompactHash
        const sExpandCompactHash = await oCrossAppNavigationServiceAppIframe.expandCompactHash("SalesOrder-approve?SOId=1234");
        assert.strictEqual(sExpandCompactHash, "SalesOrder-approve?SOId=1234",
            "CrossApplicationNavigation:expandCompactHash works");

        //===============================================

        //[CrossApplicationNavigation] test 5: getDistinctSemanticObjects
        const aDistinctSemanticObjects = await oCrossAppNavigationServiceAppIframe.getDistinctSemanticObjects();
        assert.deepEqual(JSON.parse(JSON.stringify(aDistinctSemanticObjects)).sort(),
            [
                "App1",
                "App2",
                "AppFullWidth",
                "AppNavSample",
                "BookmarkStateIso",
                "CameraAndLocation",
                "FioriToExtAppIsolated",
                "FioriToExtAppTargetIsolated",
                "GUI",
                "Renderer",
                "SCube",
                "Shell",
                "X1",
                "X2",
                "toLetterBoxing"
            ].sort(),
            "CrossApplicationNavigation:getDistinctSemanticObjects works");

        //===============================================
        //[CrossApplicationNavigation] test 6: getLinks
        let aGetLinksRes2 = await oCrossAppNavigationServiceAppIframe.getLinks({semanticObject: "SCube"});
        assert.deepEqual(JSON.parse(JSON.stringify(aGetLinksRes2)),
            [
                {
                    intent: "#SCube-App1?sap-app-origin-hint=",
                    text: "SCube App1"
                },
                {
                    intent: "#SCube-App2?sap-app-origin-hint=",
                    text: "SCube App2"
                }
            ], "CrossApplicationNavigation:getLinks works - single param");

        //getLinks - option 2
        aGetLinksRes2 = await oCrossAppNavigationServiceAppIframe.getLinks([
            [{semanticObject: "SCube"}],
            [{semanticObject: "X1"}]
        ]);

        assert.deepEqual(
            JSON.parse(JSON.stringify(aGetLinksRes2)),
            [
                [
                    [{
                        intent: "#SCube-App1?sap-app-origin-hint=",
                        text: "SCube App1"
                    },
                        {
                            intent: "#SCube-App2?sap-app-origin-hint=",
                            text: "SCube App2"
                        }]
                ],
                [
                    [{
                        intent: "#X1-Y1?sap-app-origin-hint=",
                        text: "Stateful App A"
                    }]
                ]
            ], "CrossApplicationNavigation:getLinks works - multiple params");

        //===============================================
        //[CrossApplicationNavigation] test 7: getPrimaryIntent
        const oPrimaryIntent2 = await oCrossAppNavigationServiceAppIframe.getPrimaryIntent("toLetterBoxing");
        assert.deepEqual(JSON.parse(JSON.stringify(oPrimaryIntent2)),
            {
                intent: "#toLetterBoxing-toLetterBoxing?sap-app-origin-hint=",
                tags: ["primaryAction"],
                text: "Letter Boxing"
            },
            "CrossApplicationNavigation:getPrimaryIntent works");

        //===============================================
        //[CrossApplicationNavigation] test 8: getAppState
        const oState2 = oAppStateServiceAppIframe.createEmptyAppState();
        oState2.setData({
            a: 1
        });
        await oState2.save();
        const oAppState2 = await oCrossAppNavigationServiceAppIframe.getAppState(undefined, oState2.getKey());

        assert.deepEqual(JSON.parse(JSON.stringify(oAppState2.getData())),
            {
                a: 1
            },
            "CrossApplicationNavigation:getAppState works");

        const oAppStateData = await oCrossAppNavigationServiceAppIframe.getAppStateData(oState2.getKey());
        assert.deepEqual(JSON.parse(JSON.stringify(oAppStateData)),
            {
                a: 1
            },
            "CrossApplicationNavigation:appStateData works");

        //===============================================
        //[CrossApplicationNavigation] test 9: isInitialNavigationAsync
        const bIsInitialNavigation2 = await oCrossAppNavigationServiceAppIframe.isInitialNavigationAsync();
        assert.strictEqual(bIsInitialNavigation2, false, "oCrossAppNavService:isInitialNavigation works");

        //===============================================
        //[CrossApplicationNavigation] test 10: resolveIntent
        const oResolveIntent2 = await oCrossAppNavigationServiceAppIframe.resolveIntent("#AppFullWidth-id");

        oResolveIntent2.url = oResolveIntent2.url
            .replace("sap-history-dir=NewEntry", "sap-history-dir=ABCD")
            .replace("sap-history-dir=Unknown", "sap-history-dir=ABCD");
        assert.deepEqual(
            JSON.parse(JSON.stringify(oResolveIntent2)),
            {url: "../../../../../test-resources/" +
                "sap/ushell/shells/demo/ui5appruntime.html?sap-ui-app-id=sap.ushell.demo.AppNavSample&" +
                "sap-startup-params=sap-ushell-defaultedParameterNames%3D%5B%22sap-ushell-navmode%22%5D&" +
                "sap-shell=FLP&sap-touch=1&sap-ui-versionedLibCss=true&sap-history-dir=ABCD&" +
                "sap-theme=sap_horizon&sap-locale=en&sap-iframe-hint=UI5&sap-spaces=true#toLetterBoxing-toLetterBoxing"},
            "CrossApplicationNavigation:resolveIntent works");

        //===============================================
        //[CrossApplicationNavigation] test 11: resolveIntent (error case)
        await ushellUtils.promisify(oCrossAppNavigationServiceAppIframe.resolveIntent("#DoesNot-exist")).catch((oError) => {
            // This error is coming from the application iframe, so we need to compare against
            // the local error class, because the error class is not shared across iframes
            const { Error: LocalErrorClass } = IframeUtils.getGlobalThis(oInnerFrame);
            assert.ok(oError instanceof LocalErrorClass, "CrossApplicationNavigation:resolveIntent error case works");
            // check that error details originate from the outer iframe
            assert.ok(oError.message.includes("DoesNot-exist"), "CrossApplicationNavigation:resolveIntent error message is correct");
            assert.ok(oError.stack.includes("sap/ushell/services"), "CrossApplicationNavigation:resolveIntent error stack is correct");
        });
        //===============================================

        sIframeIdLetterBoxing = getIframeIdx("toLetterBoxing-toLetterBoxing");
        checkCorrectAppContainersIds(assert, 1, false);
        checkElementInIframeApp(assert, "toLetterBoxing-toLetterBoxing", "idQunitChangeLetterBoxButton", true);
        checkAppContainerClass(assert, "#application-toLetterBoxing-toLetterBoxing", [
            ["hidden", false],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);

        /**
         * ================================================ test 2 =================================================
         * In this test we open the second ui5 app that should use the existing first stateful container iframe
         * ==========================================================================================================
         */
        assert.ok(true, "-------------------------------- starting test 2 --------------------------------");
        Log.info("----- openApp2");
        const AppLifeCycleAI = await IframeUtils.requireAsync(oFlpIframe, "sap/ushell/components/applicationIntegration/AppLifeCycle");
        sinon.spy(AppLifeCycleAI, "_handleExitApplication");

        await navToHome();

        checkCorrectAppContainersIds(assert, 1, true);
        assert.ok(AppLifeCycleAI._handleExitApplication.calledOnce, "AppLifeCycle._handleExitApplication called once");
        assert.ok(AppLifeCycleAI._handleExitApplication.args[0][1] === true, "isHomePage should be 'true'");
        assert.ok(AppLifeCycleAI._handleExitApplication.args[0][2] === true, "bFromAfterNavigate should be 'true'");
        AppLifeCycleAI._handleExitApplication.restore();
        checkElementInIframeApp(assert, "toLetterBoxing-toLetterBoxing", "idQunitChangeLetterBoxButton", false);
        checkAppContainerClass(assert, "#application-toLetterBoxing-toLetterBoxing", [
            ["hidden", true],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);
        assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#__renderer0---pages-component-container"), "pages component container was found");
        sinon.spy(AppLifeCycleAI, "_handleExitApplication");

        IframeUtils.setHash(oFlpIframe, "#AppNavSample-id");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idQunitToggleSizeBehavior", "#application-toLetterBoxing-toLetterBoxing");

        checkCorrectAppContainersIds(assert, 1, false);
        assert.ok(AppLifeCycleAI._handleExitApplication.notCalled, "AppLifeCycle._handleExitApplication not called");
        AppLifeCycleAI._handleExitApplication.restore();
        checkElementInIframeApp(assert, "toLetterBoxing-toLetterBoxing", "idQunitToggleSizeBehavior", true);
        checkAppContainerClass(assert, "#application-toLetterBoxing-toLetterBoxing", [
            ["hidden", false],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);

        /**
         * ================================================ test 3 =================================================
         * In this test we open the third iframe app that should create a new stateful container iframe
         * ==========================================================================================================
         */
        assert.ok(true, "-------------------------------- starting test 3 --------------------------------");
        Log.info("----- openApp3");

        await navToHome();

        checkCorrectAppContainersIds(assert, 1, true);
        checkElementInIframeApp(assert, "toLetterBoxing-toLetterBoxing", "idQunitToggleSizeBehavior", false);
        checkAppContainerClass(assert, "#application-toLetterBoxing-toLetterBoxing", [
            ["hidden", true],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);
        assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#__renderer0---pages-component-container"), "pages component container was found");

        IframeUtils.setHash(oFlpIframe, "#X1-Y1");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idQunitAppAButton", "#application-X1-Y1");

        sIframeIdX1Y1 = getIframeIdx("X1-Y1");
        checkCorrectAppContainersIds(assert, 2, false);
        checkElementInIframeApp(assert, "X1-Y1", "idQunitAppAButton", true);
        checkAppContainerClass(assert, "#application-toLetterBoxing-toLetterBoxing", [
            ["hidden", true],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);
        checkAppContainerClass(assert, "#application-X1-Y1", [
            ["hidden", false],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);

        /**
         * ================================================ test 4 =================================================
         * In this test we open previous app to see that no new iframes are created
         * ==========================================================================================================
         */
        assert.ok(true, "-------------------------------- starting test 4 --------------------------------");
        Log.info("----- openApp4");

        await navToHome();

        checkCorrectAppContainersIds(assert, 2, true);
        checkAppContainerClass(assert, "#application-toLetterBoxing-toLetterBoxing", [
            ["hidden", true],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);
        checkAppContainerClass(assert, "#application-X1-Y1", [
            ["hidden", true],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);
        assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#__renderer0---pages-component-container"), "pages component container was found");

        IframeUtils.setHash(oFlpIframe, "#X2-Y2");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idQunitAppBButton", "#application-X1-Y1");

        checkCorrectAppContainersIds(assert, 2, false);
        checkElementInIframeApp(assert, "X1-Y1", "idQunitAppBButton", true);
        checkAppContainerClass(assert, "#application-toLetterBoxing-toLetterBoxing", [
            ["hidden", true],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);
        checkAppContainerClass(assert, "#application-X1-Y1", [
            ["hidden", false],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);

        /**
         * ================================================ test 5 =================================================
         * In this test we open a GUI iframe (using the gui.template) and expect a new iframe.
         * We also open previous apps to see that no new iframe are created.
         * ==========================================================================================================
         */
        assert.ok(true, "-------------------------------- starting test 5 --------------------------------");
        Log.info("----- openApp5");

        await navToHome();

        checkCorrectAppContainersIds(assert, 2, true);
        checkAppContainerClass(assert, "#application-toLetterBoxing-toLetterBoxing", [
            ["hidden", true],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);
        checkAppContainerClass(assert, "#application-X1-Y1", [
            ["hidden", true],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);
        assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#__renderer0---pages-component-container"), "pages component container was found");

        IframeUtils.setHash(oFlpIframe, "#GUI-Simulation");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idQunitAppBButton", "#application-GUI-Simulation");

        sIframeIdGUISimulation = getIframeIdx("GUI-Simulation");
        checkCorrectAppContainersIds(assert, 3, false);
        checkElementInIframeApp(assert, "GUI-Simulation", "idQunitAppBButton", true);
        checkAppContainerClass(assert, "#application-toLetterBoxing-toLetterBoxing", [
            ["hidden", true],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);
        checkAppContainerClass(assert, "#application-X1-Y1", [
            ["hidden", true],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);
        checkAppContainerClass(assert, "#application-GUI-Simulation", [
            ["hidden", false],
            ["sapUShellApplicationContainerShiftedIframe", true],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);

        await navToHome();

        checkCorrectAppContainersIds(assert, 3, true);
        checkAppContainerClass(assert, "#__renderer0---pages-component-container", [
            ["hidden", false],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);
        checkAppContainerClass(assert, "#application-toLetterBoxing-toLetterBoxing", [
            ["hidden", true],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);
        checkAppContainerClass(assert, "#application-X1-Y1", [
            ["hidden", true],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);
        checkAppContainerClass(assert, "#application-GUI-Simulation", [
            ["hidden", false],
            ["sapUShellApplicationContainerShiftedIframe", true],
            ["sapUShellApplicationContainerIframeHidden", true]
        ]);
        assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#__renderer0---pages-component-container"), "pages component container was found");

        /**
         * ================================================ test 6 =================================================
         * In this test we test scube application to see that the correct iframe are created and reused.
         * ==========================================================================================================
         */
        assert.ok(true, "-------------------------------- starting test 6 --------------------------------");
        Log.info("----- openApp6");

        IframeUtils.setHash(oFlpIframe, "#SCube-App1");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idBtnNavToIntent1", "#application-SCube-App1");

        const oAppFrame = IframeUtils.getWithCssSelector(oFlpIframe, "#application-SCube-App1");
        const FormattingFromAppFrame = await IframeUtils.requireAsync(oAppFrame, "sap/base/i18n/Formatting");

        const sCalendarType = FormattingFromAppFrame.getCalendarType();
        const sDateFormatShort = FormattingFromAppFrame.getDatePattern("short");
        const sDateFormatMedium = FormattingFromAppFrame.getDatePattern("medium");
        const sNumberFormatGroup = FormattingFromAppFrame.getNumberSymbol("group");
        const sNumberFormatDecimal = FormattingFromAppFrame.getNumberSymbol("decimal");
        const sTimeFormatShort = FormattingFromAppFrame.getTimePattern("short");
        const sTimeFormatMedium = FormattingFromAppFrame.getTimePattern("medium");
        const aCalendarMapping = FormattingFromAppFrame.getCustomIslamicCalendarData();
        const oCurrencyFormats = FormattingFromAppFrame.getCustomCurrencies();

        assert.strictEqual(sCalendarType, oCustomLocale.calendarType, "app calendar type is correct");
        assert.strictEqual(sDateFormatShort, oCustomLocale.datePattern.short, "app short date format is correct");
        assert.strictEqual(sDateFormatMedium, oCustomLocale.datePattern.medium, "app medium date format is correct");
        assert.strictEqual(sNumberFormatGroup, oCustomLocale.numberFormat.group, "app group number format is correct");
        assert.strictEqual(sNumberFormatDecimal, oCustomLocale.numberFormat.decimal, "app decimal number format is correct");
        assert.strictEqual(sTimeFormatShort, oCustomLocale.timePattern.short, "app short time format is correct");
        assert.strictEqual(sTimeFormatMedium, oCustomLocale.timePattern.medium, "app medium time format is correct");
        assert.deepEqual(aCalendarMapping, oCustomLocale.calendarMapping, "app calendar mapping is correct");
        assert.propEqual(oCurrencyFormats, oCustomLocale.currencies, "app currency format is correct");
        sIframeSCube = getIframeIdx("SCube-App1");
        checkCorrectAppContainersIds(assert, 4, false);
        clickOnIframeAppButton("SCube-App1", "idBtnNavToIntent1");

        await IframeUtils.waitForCssSelector(oFlpIframe, ".idBtnNavToIntent2", "#application-SCube-App1");

        checkCorrectAppContainersIds(assert, 4, false);
        clickOnIframeAppButton("SCube-App1", "idNavToIntentFullHash2");

        await IframeUtils.waitForCssSelector(oFlpIframe, ".idBtnNavToIntent1", "#application-SCube-App1");

        checkCorrectAppContainersIds(assert, 4, false);

        await navToHome();

        checkCorrectAppContainersIds(assert, 4, true);

        IframeUtils.setHash(oFlpIframe, "#Shell-startIntent");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idBtnNavToIntent1", "#application-SCube-App1");

        checkCorrectAppContainersIds(assert, 4, false);

        await navToHome();

        checkCorrectAppContainersIds(assert, 4, true);

        /**
         * ================================================ test 7 =================================================
         * In this test we check:
         * 1. that a request to open a ui5 app with async-loading=false, creates a new iframe specially for it.
         * 3. that a request to open a ui5 app that uses FESR, creates a new iframe specially for it.
         * ==========================================================================================================
         */
        assert.ok(true, "-------------------------------- starting test 7 --------------------------------");
        Log.info("----- openApp7");

        IframeUtils.setHash(oFlpIframe, "#BookmarkStateIso-Sample");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".btnCreateStateT", "#application-toLetterBoxing-toLetterBoxing");

        checkCorrectAppContainersIds(assert, 4, false);

        await navToHome();

        checkCorrectAppContainersIds(assert, 4, true);

        IframeUtils.setHash(oFlpIframe, "#Renderer-Sample");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idSetHeaderTitleBtn", "#application-Renderer-Sample");

        sIframeRenderer = getIframeIdx("Renderer-Sample");
        checkCorrectAppContainersIds(assert, 5, false);

        await navToHome();

        checkCorrectAppContainersIds(assert, 5, true);

        IframeUtils.setHash(oFlpIframe, "#FioriToExtAppTargetIsolated-Action");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idQunitSubmit", "#application-toLetterBoxing-toLetterBoxing");

        checkCorrectAppContainersIds(assert, 5, false);

        await navToHome();

        checkCorrectAppContainersIds(assert, 5, true);

        IframeUtils.setHash(oFlpIframe, "#FioriToExtAppIsolated-Action");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".btnSubmitToMain", "#application-FioriToExtAppIsolated-Action");

        sIframeFESR = getIframeIdx("FioriToExtAppIsolated-Action");
        checkCorrectAppContainersIds(assert, 6, false);

        await navToHome();

        checkCorrectAppContainersIds(assert, 6, true);

        /**
         * ================================================ test 8 =================================================
         * In this test we check the dirty state showing.
         * ==========================================================================================================
         */
        assert.ok(true, "-------------------------------- starting test 8 --------------------------------");
        Log.info("----- openApp8");
        assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#__renderer0---pages-component-container"), "pages component container was found");

        IframeUtils.setHash(oFlpIframe, "#AppNavSample-id");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idQunitDirtyStateProvider", "#application-toLetterBoxing-toLetterBoxing");

        // registerDirtyStateProvider
        await nextUIUpdate();
        const oButton = await IframeUtils.waitForControl(oFlpIframe, "application-AppNavSample-id-component---MainView--List--testDirtyStateProvider", "#application-toLetterBoxing-toLetterBoxing");
        assert.ok(oButton !== null, "Register dirty state provider button found");
        oButton.firePress();
        IframeUtils.getGlobalThis(oFlpIframe).confirm = function () {
            return true;
        };

        await ushellUtils.awaitTimeout(2000);

        oInnerFrame = IframeUtils.getWithCssSelector(oFlpIframe, "#application-toLetterBoxing-toLetterBoxing");
        oContainerInnerContentWindow = await IframeUtils.requireAsync(oInnerFrame, "sap/ushell/Container");
        const bDirty = oContainerInnerContentWindow.getDirtyFlag();
        assert.strictEqual(bDirty, true, "Dirty flag is set");

        IframeUtils.setHash(oFlpIframe, "#Shell-home");

        await ushellUtils.awaitTimeout(2000);
        checkAppContainerClass(assert, "#__renderer0---pages-component-container", [
            ["hidden", false],
            ["sapUShellApplicationContainerShiftedIframe", false],
            ["sapUShellApplicationContainerIframeHidden", false]
        ]);
    });
});
