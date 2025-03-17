// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
QUnit.config.testTimeout = 400000;

/**
 * @fileOverview QUnit tests for behaviour of stateful container
 */
sap.ui.define([
    "sap/ushell/test/components/applicationIntegration/application/IframeUtils"
], function (
    IframeUtils
) {
    "use strict";

    /* global QUnit */

    let oFlpIframe;

    QUnit.module("test", {
        beforeEach: function () {
            oFlpIframe = IframeUtils.createIframe("sap/ushell/shells/demo/FioriLaunchpadIsolation.html#Shell-home");
            IframeUtils.appendToQunitFixture(oFlpIframe);
        }
    });

    function addAppFrameworkVersion (oExpectedResult, sVersion, bValue) {
        if (typeof sVersion === "string") {
            if (bValue === true) {
                oExpectedResult.appFrameworkVersion = sVersion;
            } else {
                oExpectedResult.appFrameworkVersion = {
                    value: sVersion
                };
            }
        }
        return oExpectedResult;
    }

    QUnit.test("Changing exist app info parameters and adding new parameters to appInfoParameters", async function (assert) {
        IframeUtils.setHash(oFlpIframe, "#Shell-home");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".sapUshellVizInstance");

        IframeUtils.setHash(oFlpIframe, "#AppNav-SAP1?sap-keep-alive=restricted");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idQunitDirtyStateProvider", "#application-AppNav-SAP1");

        const oUshellContainerFromIframe = await IframeUtils.requireAsync(oFlpIframe, "sap/ushell/Container");
        const AppLifeCycle = await oUshellContainerFromIframe.getServiceAsync("AppLifeCycle");
        const oCurrentApplication = AppLifeCycle.getCurrentApplication();

        let sVersion;
        const oResult = await oCurrentApplication.getInfo(["languageTag", "appFrameworkVersion"]);
        if (oResult && oResult.hasOwnProperty("appFrameworkVersion")) {
            sVersion = oResult.appFrameworkVersion;
        }

        // Act #1
        const oAllAppInfo = await oCurrentApplication.getAllAppInfo(true);
        // Assert #1
        assert.propEqual(
            oAllAppInfo,
            addAppFrameworkVersion({
                appFrameworkId: "UI5",
                appFrameworkVersion: undefined,
                appId: "F6407",
                appIntent: "AppNav-SAP1?sap-keep-alive=restricted",
                appSupportInfo: "CA-FLP-FE-UI",
                appVersion: "1.1.0",
                applicationType: "UI5",
                homePage: false,
                languageTag: "en",
                productName: "",
                applicationParams: {
                    "sap-keep-alive": ["restricted"]
                },
                technicalAppComponentId: "sap.ushell.demo.AppNavSample",
                theme: "sap_horizon"
            }, sVersion, true),
            "#1 getAllAppInfo function"
        );

        // Arrange #2
        AppLifeCycle.setAppInfo({ info: {
            appId: "1234"
        }});
        // Act #2
        const oAllAppInfo2 = await oCurrentApplication.getAllAppInfo(true);
        // Assert #2
        assert.propEqual(
            oAllAppInfo2,
            addAppFrameworkVersion({
                appFrameworkId: "UI5",
                appFrameworkVersion: undefined,
                appId: "1234",
                appIntent: "AppNav-SAP1?sap-keep-alive=restricted",
                appSupportInfo: "CA-FLP-FE-UI",
                appVersion: "1.1.0",
                applicationType: "UI5",
                homePage: false,
                languageTag: "en",
                productName: "",
                applicationParams: {
                    "sap-keep-alive": ["restricted"]
                },
                technicalAppComponentId: "sap.ushell.demo.AppNavSample",
                theme: "sap_horizon"
            }, sVersion, true),
            "#2 Changing exist app info parameter by setAppInfo"
        );

        // Arrange #3 - App can add custom parameters
        AppLifeCycle.setAppInfo({
            info: {
                title: "Nav App",
                customProperties: {
                    "abap.gui.screenNumber": {
                        value: "screen 1",
                        showInAbout: true,
                        label: "Screen Number"
                    },
                    "abap.client": {
                        value: "120",
                        showInAbout: true,
                        label: "Screen Number"
                    }
                }
            }
        });

        // Act #3
        const oAllAppInfo3 = await oCurrentApplication.getAllAppInfo(true);
        // Assert #3
        assert.propEqual(
            oAllAppInfo3,
            addAppFrameworkVersion({
                title: "Nav App",
                "abap.gui.screenNumber": "screen 1",
                "abap.client": "120",
                appFrameworkId: "UI5",
                appFrameworkVersion: undefined,
                appId: "1234",
                appIntent: "AppNav-SAP1?sap-keep-alive=restricted",
                appSupportInfo: "CA-FLP-FE-UI",
                appVersion: "1.1.0",
                applicationType: "UI5",
                homePage: false,
                languageTag: "en",
                productName: "",
                applicationParams: {
                    "sap-keep-alive": ["restricted"]
                },
                technicalAppComponentId: "sap.ushell.demo.AppNavSample",
                theme: "sap_horizon"
            }, sVersion, true),
            "#3 Adding new parameters"
        );

        // Arrange #4 - App can override a technical parameter (appId)
        AppLifeCycle.setAppInfo({
            info: {
                appId: "5678"
            }
        });
        // Act #4
        const oAllAppInfo4 = await oCurrentApplication.getAllAppInfo(true);
        // Assert #4
        assert.propEqual(
            oAllAppInfo4,
            addAppFrameworkVersion({
                title: "Nav App",
                "abap.gui.screenNumber": "screen 1",
                "abap.client": "120",
                appFrameworkId: "UI5",
                appFrameworkVersion: undefined,
                appId: "5678",
                appIntent: "AppNav-SAP1?sap-keep-alive=restricted",
                appSupportInfo: "CA-FLP-FE-UI",
                appVersion: "1.1.0",
                applicationType: "UI5",
                homePage: false,
                languageTag: "en",
                productName: "",
                applicationParams: {
                    "sap-keep-alive": ["restricted"]
                },
                technicalAppComponentId: "sap.ushell.demo.AppNavSample",
                theme: "sap_horizon"
            }, sVersion, true),
            "#4 Changing exist technical parameter by setAppInfo"
        );

        // Act #5 - bValues = false
        const oAllAppInfo5 = await oCurrentApplication.getAllAppInfo(false);
        // Assert #5
        assert.propEqual(
            oAllAppInfo5,
            addAppFrameworkVersion({
                title: {
                    value: "Nav App"
                },
                "abap.gui.screenNumber": {
                    value: "screen 1",
                    showInAbout: true,
                    label: "Screen Number"
                },
                "abap.client": {
                    value: "120",
                    showInAbout: true,
                    label: "Screen Number"
                },
                appFrameworkId: {
                    value: "UI5"
                },
                appFrameworkVersion: {
                    value: undefined
                },
                appId: {
                    value: "5678"
                },
                appIntent: {
                    value: "AppNav-SAP1?sap-keep-alive=restricted"
                },
                appSupportInfo: {
                    value: "CA-FLP-FE-UI"
                },
                appVersion: {
                    value: "1.1.0"
                },
                applicationType: {
                    value: "UI5"
                },
                homePage: {
                    value: false
                },
                languageTag: {
                    value: "en"
                },
                productName: {
                    value: ""
                },
                applicationParams: {
                    value: {
                        "sap-keep-alive": ["restricted"]
                    }
                },
                technicalAppComponentId: {
                    value: "sap.ushell.demo.AppNavSample"
                },
                theme: {
                    value: "sap_horizon"
                }
            }, sVersion, false),
            "#5 GetAllAppInfo when bValues = false"
        );

        // Arrange #6 - Navigate to another app
        IframeUtils.setHash(oFlpIframe, "#BookmarkState-Sample");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".btnCreateStateT", "#application-BookmarkState-Sample");

        // Act #6
        const oAllAppInfo6 = await oCurrentApplication.getAllAppInfo(false);
        // Assert #6
        assert.propEqual(
            oAllAppInfo6,
            addAppFrameworkVersion({
                appFrameworkId: {
                    value: "UI5"
                },
                appFrameworkVersion: {
                    value: undefined
                },
                appId: {
                    value: undefined
                },
                appIntent: {
                    value: "BookmarkState-Sample"
                },
                appSupportInfo: {
                    value: undefined
                },
                appVersion: {
                    value: "1.132.1"
                },
                applicationType: {
                    value: "UI5"
                },
                homePage: {
                    value: false
                },
                languageTag: {
                    value: "en"
                },
                productName: {
                    value: ""
                },
                applicationParams: {
                    value: {
                        "sap-keep-alive": ["restricted"]
                    }
                },
                technicalAppComponentId: {
                    value: "sap.ushell.demo.bookmarkstate"
                },
                theme: {
                    value: "sap_horizon"
                }
            }, sVersion, false),
            "#6 GetAllAppInfo when bValues = false"
        );

        // Arrange #7 - Navigate back to keep alive app
        IframeUtils.setHash(oFlpIframe, "#AppNav-SAP1?sap-keep-alive=restricted");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idQunitDirtyStateProvider", "#application-AppNav-SAP1");

        // Act #7
        const oAllAppInfo7 = await oCurrentApplication.getAllAppInfo(false);

        // Assert #7
        assert.propEqual(
            oAllAppInfo7,
            addAppFrameworkVersion({
                title: {
                    value: "Nav App"
                },
                "abap.gui.screenNumber": {
                    value: "screen 1",
                    showInAbout: true,
                    label: "Screen Number"
                },
                "abap.client": {
                    value: "120",
                    showInAbout: true,
                    label: "Screen Number"
                },
                appFrameworkId: {
                    value: "UI5"
                },
                appFrameworkVersion: {
                    value: undefined
                },
                appId: {
                    value: "5678"
                },
                appIntent: {
                    value: "AppNav-SAP1?sap-keep-alive=restricted"
                },
                appSupportInfo: {
                    value: "CA-FLP-FE-UI"
                },
                appVersion: {
                    value: "1.1.0"
                },
                applicationType: {
                    value: "UI5"
                },
                homePage: {
                    value: false
                },
                languageTag: {
                    value: "en"
                },
                productName: {
                    value: ""
                },
                applicationParams: {
                    value: {
                        "sap-keep-alive": ["restricted"]
                    }
                },
                technicalAppComponentId: {
                    value: "sap.ushell.demo.AppNavSample"
                },
                theme: {
                    value: "sap_horizon"
                }
            }, sVersion, false),
            "#7 GetAllAppInfo when bValues = false"
        );
    });
});
