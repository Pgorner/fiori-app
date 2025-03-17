// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview defines the post message API for all applications running in iframe within the shell
 * @version 1.132.1
 * @private
 */
sap.ui.define([
    "sap/base/i18n/Formatting",
    "sap/base/i18n/Localization",
    "sap/ui/core/Element",
    "sap/ushell/utils",
    "sap/ui/core/library",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log",
    "sap/ui/core/UIComponent",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/services/Navigation/compatibility",
    "sap/ushell/EventHub",
    "sap/ushell/components/applicationIntegration/application/PostMessageAPIInterface",
    "sap/ui/thirdparty/URI",
    "sap/base/util/deepExtend",
    "sap/ushell/Config",
    "sap/ushell/library",
    "sap/ushell/utils/UrlParsing",
    "sap/m/Button",
    "sap/m/library",
    "sap/ui/thirdparty/hasher",
    "sap/ui/core/EventBus",
    "sap/ushell/resources",
    "sap/ushell/ui/shell/ShellHeadItem",
    "sap/base/util/uid",
    "sap/ushell/Container",
    "sap/base/util/Deferred",
    "sap/ushell/state/ShellModel",
    "sap/ushell/ApplicationType/systemAlias"
], function (
    Formatting,
    Localization,
    Element,
    ushellUtils,
    coreLib,
    jQuery,
    Log,
    UIComponent,
    AppConfiguration,
    navigationCompatibility,
    EventHub,
    PostMessageAPIInterface,
    URI,
    deepExtend,
    Config,
    ushellLibrary,
    UrlParsing,
    Button,
    mobileLibrary,
    hasher,
    EventBus,
    resources,
    ShellHeadItem,
    fnGetUid,
    Container,
    Deferred,
    ShellModel,
    SystemAlias
) {
    "use strict";

    // shortcut for sap.ushell.ContentNodeType
    const ContentNodeType = ushellLibrary.ContentNodeType;

    const SAP_API_PREFIX = "sap.ushell.";

    const oDummyComponent = new UIComponent();
    const URLHelper = mobileLibrary.URLHelper;
    /**
     * All APIs must start with "sap.ushell" prefix
     */
    const oAPIs = {
        "sap.ushell.services.Navigation": {
            oServiceCalls: {
                getHref: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { oTarget } = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        return Navigation.getHref(oTarget);
                    }
                },
                backToPreviousApp: {
                    executeServiceCallFn: async () => {
                        const Navigation = await Container.getServiceAsync("Navigation");
                        return Navigation.backToPreviousApp();
                    }
                },
                historyBack: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { iSteps } = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        return Navigation.historyBack(iSteps);
                    }
                },
                isInitialNavigation: {
                    executeServiceCallFn: async () => {
                        const Navigation = await Container.getServiceAsync("Navigation");
                        return Navigation.isInitialNavigation();
                    }
                },
                navigate: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { oTarget } = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        const oTargetClone = deepExtend({}, oTarget);
                        ushellUtils.storeSapSystemToLocalStorage(oTargetClone);

                        return Navigation.navigate(oTargetClone);
                    }
                },
                getPrimaryIntent: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sSemanticObject, oLinkFilter } = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        return Navigation.getPrimaryIntent(sSemanticObject, oLinkFilter);
                    }
                },
                getLinks: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const oParams = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        return Navigation.getLinks(oParams);
                    }
                },
                getSemanticObjects: {
                    executeServiceCallFn: async () => {
                        const Navigation = await Container.getServiceAsync("Navigation");
                        return Navigation.getSemanticObjects();
                    }
                },

                isNavigationSupported: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aTargets } = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        return Navigation.isNavigationSupported(aTargets);
                    }
                },
                getAppState: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sAppStateKey } = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        const oAppState = await Navigation.getAppState(oDummyComponent, sAppStateKey);
                        delete oAppState._oServiceInstance;

                        return oAppState;
                    }
                },
                resolveIntent: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sHashFragment } = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        return Navigation.resolveIntent(sHashFragment);
                    }
                },
                isUrlSupported: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sUrl } = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        return Navigation.isUrlSupported(sUrl);
                    }
                }
            }
        },
        "sap.ushell.services.CrossApplicationNavigation": {
            oServiceCalls: {
                hrefForExternal: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { oArgs } = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        return Navigation.getHref(oArgs);
                    }
                },
                getSemanticObjectLinks: {
                    executeServiceCallFn: async (oServiceParams) => {
                        // beware sSemanticObject may also be an array of argument arrays
                        // {sSemanticObject, mParameters, bIgnoreFormFactors }
                        const { sSemanticObject, mParameters, bIgnoreFormFactors, bCompactIntents } = oServiceParams.oMessageData.body;

                        return navigationCompatibility.getSemanticObjectLinks(
                            sSemanticObject,
                            mParameters,
                            bIgnoreFormFactors,
                            undefined,
                            undefined,
                            bCompactIntents
                        );
                    }
                },
                isIntentSupported: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aIntents } = oServiceParams.oMessageData.body;

                        return navigationCompatibility.isIntentSupported(aIntents);
                    }
                },
                isNavigationSupported: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aIntents } = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        return Navigation.isNavigationSupported(aIntents);
                    }
                },
                backToPreviousApp: {
                    executeServiceCallFn: async () => {
                        const Navigation = await Container.getServiceAsync("Navigation");
                        Navigation.backToPreviousApp();
                    }
                },
                historyBack: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { iSteps } = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        Navigation.historyBack(iSteps);
                    }
                },
                getAppStateData: {
                    executeServiceCallFn: async (oServiceParams) => {
                        // note: sAppStateKey may be an array of argument arrays
                        const { sAppStateKey: vAppStateKey } = oServiceParams.oMessageData.body;

                        return navigationCompatibility.getAppStateData(vAppStateKey);
                    }
                },
                toExternal: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { oArgs } = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        const oArgsClone = deepExtend({}, oArgs);
                        ushellUtils.storeSapSystemToLocalStorage(oArgsClone);

                        return Navigation.navigate(oArgsClone);
                    }
                },
                registerBeforeAppCloseEvent: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const oParams = oServiceParams.oMessageData.body;
                        oServiceParams.oContainer.setProperty(
                            "beforeAppCloseEvent",
                            {
                                enabled: true,
                                params: oParams
                            },
                            true
                        );
                    }
                },
                expandCompactHash: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sHashFragment } = oServiceParams.oMessageData.body;
                        const NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");

                        const oDeferred = NavTargetResolutionInternal.expandCompactHash(sHashFragment);
                        return ushellUtils.promisify(oDeferred);
                    }
                },
                getDistinctSemanticObjects: {
                    executeServiceCallFn: async () => {
                        const Navigation = await Container.getServiceAsync("Navigation");

                        return Navigation.getSemanticObjects();
                    }
                },
                getLinks: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const vParams = oServiceParams.oMessageData.body;

                        return navigationCompatibility.getLinks(vParams);
                    }
                },
                getPrimaryIntent: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sSemanticObject, mParameters } = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        return Navigation.getPrimaryIntent(sSemanticObject, mParameters);
                    }
                },
                hrefForAppSpecificHash: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sAppHash } = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        return Navigation.getHref(sAppHash);
                    }
                },
                isInitialNavigation: {
                    executeServiceCallFn: async () => {
                        const Navigation = await Container.getServiceAsync("Navigation");
                        return Navigation.isInitialNavigation();
                    }
                },
                getAppState: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sAppStateKey } = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        const oAppState = await Navigation.getAppState(oDummyComponent, sAppStateKey);
                        delete oAppState._oServiceInstance;

                        return oAppState;
                    }
                },
                setInnerAppRoute: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { appSpecificRoute, writeHistory } = oServiceParams.oMessageData.body;

                        const oHash = UrlParsing.parseShellHash(hasher.getHash());

                        //do nothing if new is exactly like the current one
                        if (oHash.appSpecificRoute === appSpecificRoute) {
                            return;
                        }
                        oHash.appSpecificRoute = appSpecificRoute;
                        const sNewHash = `#${UrlParsing.constructShellHash(oHash)}`;
                        hasher.disableBlueBoxHashChangeTrigger = true;
                        if (writeHistory === true || writeHistory === "true") {
                            hasher.setHash(sNewHash);
                        } else {
                            hasher.replaceHash(sNewHash);
                        }
                        hasher.disableBlueBoxHashChangeTrigger = false;
                    }
                },
                setInnerAppStateData: {
                    executeServiceCallFn: (oServiceParams) => {
                        return PostMessageAPI.prototype._createNewInnerAppState(oServiceParams);
                    }
                },
                resolveIntent: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sHashFragment } = oServiceParams.oMessageData.body;
                        const Navigation = await Container.getServiceAsync("Navigation");

                        return Navigation.resolveIntent(sHashFragment);
                    }
                }
            }
        },
        "sap.ushell.ui5service.ShellUIService": {
            oServiceCalls: {
                setTitle: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sTitle } = oServiceParams.oMessageData.body;
                        const ShellUIService = oServiceParams.oContainer.getShellUIService();

                        ShellUIService.setTitle(sTitle);
                    }
                },
                setBackNavigation: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const ShellUIService = oServiceParams.oContainer.getShellUIService();

                        let fnCallback;
                        if (oServiceParams?.oMessageData?.body?.callbackMessage?.service) {
                            fnCallback = PostMessageAPI.prototype._backButtonPressedCallback.bind(
                                null,
                                oServiceParams.oMessage.source,
                                oServiceParams.oMessageData.body.callbackMessage.service,
                                oServiceParams.oMessage.origin
                            );
                        } // empty body or callback message will call the setBackNavigation with undefined, this should reset the back button callback

                        ShellUIService.setBackNavigation(fnCallback);
                    }
                }
            }
        },
        "sap.ushell.services.ShellUIService": {
            oServiceCalls: {
                setTitle: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sTitle } = oServiceParams.oMessageData.body;
                        const ShellUIService = oServiceParams.oContainer.getShellUIService();

                        ShellUIService.setTitle(sTitle);
                    }
                },
                setHierarchy: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aHierarchyLevels } = oServiceParams.oMessageData.body;
                        const ShellUIService = oServiceParams.oContainer.getShellUIService();

                        ShellUIService.setHierarchy(aHierarchyLevels);
                    }
                },
                setRelatedApps: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aRelatedApps } = oServiceParams.oMessageData.body;
                        const ShellUIService = oServiceParams.oContainer.getShellUIService();

                        ShellUIService.setRelatedApps(aRelatedApps);
                    }
                },
                setDirtyFlag: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { bIsDirty } = oServiceParams.oMessageData.body;

                        Container.setDirtyFlag(bIsDirty);
                    }
                },
                showShellUIBlocker: {
                    executeServiceCallFn: async (oServiceParams) => {
                        Log.error("'sap.ushell.services.ShellUIService.showShellUIBlocker' was discontinued. This call will be ignored.");
                    }
                },
                getFLPUrl: {
                    executeServiceCallFn: (oServiceParams) => {
                        const bIncludeHash = oServiceParams?.oMessageData?.body?.bIncludeHash;

                        return Container.getFLPUrlAsync(bIncludeHash);
                    }
                },
                getShellGroupIDs: {
                    executeServiceCallFn: async (oServiceParams) => {
                        /**
                         * @deprecated since 1.120 Classic homepage is deprecated.
                         */ // eslint-disable-next-line no-constant-condition
                        if (true) {
                            const { bGetAll } = oServiceParams.oMessageData.body || {};
                            const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                            return BookmarkV2.getShellGroupIDs(bGetAll);
                        }

                        throw new Error("Bookmark.getShellGroupIDs is deprecated. Please use BookmarkV2.getContentNodes instead.");
                    }
                },
                addBookmark: {
                    executeServiceCallFn: async (oServiceParams) => {
                        /**
                         * @deprecated since 1.120 Classic homepage is deprecated.
                         */ // eslint-disable-next-line no-constant-condition
                        if (true) {
                            const { oParameters, groupId } = oServiceParams.oMessageData.body;
                            const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                            return BookmarkV2.addBookmarkByGroupId(oParameters, groupId);
                        }

                        throw new Error("Bookmark.addBookmarkByGroupId is deprecated. Please use BookmarkV2.addBookmark instead.");
                    }
                },
                addBookmarkDialog: {
                    executeServiceCallFn: async () => {
                        const [AddBookmarkButton] = await ushellUtils.requireAsync(["sap/ushell/ui/footerbar/AddBookmarkButton"]);
                        const dialogButton = new AddBookmarkButton();
                        dialogButton.firePress({});
                    }
                },
                getShellGroupTiles: {
                    executeServiceCallFn: async (oServiceParams) => {
                        /**
                         * @deprecated since 1.120 Classic homepage is deprecated.
                         */ // eslint-disable-next-line no-constant-condition
                        if (true) {
                            const { groupId } = oServiceParams.oMessageData.body;
                            const FlpLaunchPage = await Container.getServiceAsync("FlpLaunchPage");

                            const oDeferred = FlpLaunchPage.getTilesByGroupId(groupId);
                            return ushellUtils.promisify(oDeferred);
                        }

                        throw new Error("Classic homepage is deprecated.");
                    }
                },
                sendUrlAsEmail: {
                    executeServiceCallFn: async () => {
                        const sAppName = ShellModel.getModel().getProperty("/application/title");

                        let sSubject;
                        if (sAppName === undefined) {
                            sSubject = resources.i18n.getText("linkToApplication");
                        } else {
                            sSubject = `${resources.i18n.getText("linkTo")} '${sAppName}'`;
                        }

                        PostMessageAPI.prototype._sendEmail(
                            "",
                            sSubject,
                            document.URL,
                            "",
                            "",
                            document.URL,
                            true
                        );
                    }
                },
                sendEmailWithFLPButton: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { bSetAppStateToPublic } = oServiceParams.oMessageData.body;

                        const sAppName = ShellModel.getModel().getProperty("/application/title");
                        let sSubject;
                        if (sAppName === undefined) {
                            sSubject = resources.i18n.getText("linkToApplication");
                        } else {
                            sSubject = `${resources.i18n.getText("linkTo")} '${sAppName}'`;
                        }

                        PostMessageAPI.prototype._sendEmail(
                            "",
                            sSubject,
                            document.URL,
                            "",
                            "",
                            document.URL,
                            bSetAppStateToPublic
                        );
                    }
                },
                sendEmail: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sTo, sSubject, sBody, sCc, sBcc, sIFrameURL, bSetAppStateToPublic } = oServiceParams.oMessageData.body;

                        PostMessageAPI.prototype._sendEmail(
                            sTo,
                            sSubject,
                            sBody,
                            sCc,
                            sBcc,
                            sIFrameURL,
                            bSetAppStateToPublic
                        );
                    }
                },
                processHotKey: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const oParams = oServiceParams.oMessageData.body;
                        // IE doesn't support creating the KeyboardEvent object with a the "new" constructor, hence if this will fail, it will be created
                        // using the document object- https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
                        // This KeyboardEvent has a constructor, so checking for its ecsitaance will not solve this, hence, only solution found is try-catch
                        let oEvent;
                        try {
                            oEvent = new KeyboardEvent("keydown", oParams);
                        } catch (err) {
                            const { altKey, ctrlKey, shiftKey, key, keyCode } = oParams;
                            const IEevent = document.createEvent("KeyboardEvent");

                            let sSpecialKeys = ""; // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/initKeyboardEvent
                            if (altKey) {
                                sSpecialKeys += "Alt ";
                            }
                            if (ctrlKey) {
                                sSpecialKeys += "Control ";
                            }
                            if (shiftKey) {
                                sSpecialKeys += "Shift ";
                            }

                            IEevent.initKeyboardEvent("keydown", false, false, null, key, keyCode, sSpecialKeys, 0, false);
                            oEvent = IEevent;
                        }
                        document.dispatchEvent(oEvent);
                    }
                }
            }
        },
        "sap.ushell.services.Container": {
            oServiceCalls: {
                setDirtyFlag: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { bIsDirty } = oServiceParams.oMessageData.body;
                        Container.setDirtyFlag(bIsDirty);
                    }
                },
                registerDirtyStateProvider: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { bRegister } = oServiceParams.oMessageData.body;
                        if (bRegister) {
                            PostMessageAPI.prototype.registerAsyncDirtyStateProvider(oServiceParams);
                        } else {
                            PostMessageAPI.prototype.deregisterAsyncDirtyStateProvider(oServiceParams);
                        }
                    }
                },
                getFLPUrl: {
                    executeServiceCallFn: (oServiceParams) => {
                        const bIncludeHash = oServiceParams?.oMessageData?.body?.bIncludeHash;
                        return Container.getFLPUrlAsync(bIncludeHash);
                    }
                },
                getFLPConfig: {
                    executeServiceCallFn: async () => {
                        return Container.getFLPConfig();
                    }
                },
                getFLPPlatform: {
                    executeServiceCallFn: () => {
                        return Container.getFLPPlatform();
                    }
                },
                attachLogoutEvent: {
                    executeServiceCallFn: async (oServiceParams) => {
                        Container.attachLogoutEvent(async function () {
                            const [PostMessageUtils] = await ushellUtils.requireAsync(["sap/ushell/components/applicationIntegration/application/PostMessageUtils"]);

                            return PostMessageUtils.postMessageToIframeApp(
                                oServiceParams.oContainer,
                                "sap.ushell.appRuntime",
                                "executeLogoutFunctions",
                                {},
                                true
                            );
                        }, true);
                    }
                }
            }
        },
        "sap.ushell.services.AppState": {
            oServiceCalls: {
                getAppState: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sKey } = oServiceParams.oMessageData.body;
                        const AppState = await Container.getServiceAsync("AppState");

                        const oDeferred = AppState.getAppState(sKey);

                        const oAppState = await ushellUtils.promisify(oDeferred);
                        delete oAppState._oServiceInstance;
                        return oAppState;
                    }
                },
                _saveAppState: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sKey, sData, sAppName, sComponent, bTransient, iPersistencyMethod, oPersistencySettings } = oServiceParams.oMessageData.body;
                        const AppState = await Container.getServiceAsync("AppState");

                        const oDeferred = AppState._saveAppState(
                            sKey,
                            sData,
                            sAppName,
                            sComponent,
                            bTransient,
                            iPersistencyMethod,
                            oPersistencySettings
                        );
                        return ushellUtils.promisify(oDeferred);
                    }
                },
                _loadAppState: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sKey } = oServiceParams.oMessageData.body;
                        const AppState = await Container.getServiceAsync("AppState");

                        const oDeferred = AppState._loadAppState(sKey);
                        return ushellUtils.promisify(oDeferred);
                    }
                },
                deleteAppState: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sKey } = oServiceParams.oMessageData.body;
                        const AppState = await Container.getServiceAsync("AppState");

                        const oDeferred = AppState.deleteAppState(sKey);
                        return ushellUtils.promisify(oDeferred);
                    }
                },
                makeStatePersistent: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sKey, iPersistencyMethod, oPersistencySettings } = oServiceParams.oMessageData.body;
                        const AppState = await Container.getServiceAsync("AppState");

                        const oDeferred = AppState.makeStatePersistent(sKey, iPersistencyMethod, oPersistencySettings);
                        return ushellUtils.promisify(oDeferred);
                    }
                }
            }
        },
        "sap.ushell.services.Bookmark": {
            oServiceCalls: {
                addBookmarkUI5: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { oParameters, vContainer } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();
                        PostMessageAPI.prototype._stripBookmarkServiceUrlForLocalContentProvider(oParameters, oSystemContext);

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.addBookmark(oParameters, vContainer, oSystemContext.id);
                    }
                },
                // Bookmark@addBookmarkByGroupId is mapped to sap.ushell.services.Bookmark.addBookmark
                // Bookmark@addBookmark is mapped to sap.ushell.services.Bookmark.addBookmarkUI5
                addBookmark: {
                    executeServiceCallFn: async (oServiceParams) => {
                        /**
                         * @deprecated since 1.120 Classic homepage is deprecated.
                         */ // eslint-disable-next-line no-constant-condition
                        if (true) {
                            const { oParameters, groupId } = oServiceParams.oMessageData.body;
                            const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                            return BookmarkV2.addBookmarkByGroupId(oParameters, groupId);
                        }

                        throw new Error("Bookmark.addBookmarkByGroupId is deprecated. Please use BookmarkV2.addBookmark instead.");
                    }
                },
                getShellGroupIDs: {
                    executeServiceCallFn: async () => {
                        /**
                         * @deprecated since 1.120 Classic homepage is deprecated.
                         */ // eslint-disable-next-line no-constant-condition
                        if (true) {
                            const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                            return BookmarkV2.getShellGroupIDs();
                        }

                        throw new Error("Bookmark.getShellGroupIDs is deprecated. Please use BookmarkV2.getContentNodes instead.");
                    }
                },
                addCatalogTileToGroup: {
                    executeServiceCallFn: async (oServiceParams) => {
                        Log.error("Bookmark.addCatalogTileToGroup is deprecated. Please use BookmarkV2.addBookmark instead.");

                        /**
                         * @deprecated since 1.120 Classic homepage is deprecated.
                         */ // eslint-disable-next-line no-constant-condition
                        if (true) {
                            const { sCatalogTileId, sGroupId, oCatalogData } = oServiceParams.oMessageData.body;
                            const Bookmark = await Container.getServiceAsync("Bookmark");

                            const oDeferred = Bookmark.addCatalogTileToGroup(sCatalogTileId, sGroupId, oCatalogData);
                            return ushellUtils.promisify(oDeferred);
                        }

                        throw new Error("Bookmark.addCatalogTileToGroup is deprecated. Please use BookmarkV2.addBookmark instead.");
                    }
                },
                countBookmarks: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sUrl } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.countBookmarks(sUrl, oSystemContext.id);
                    }
                },
                deleteBookmarks: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sUrl } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.deleteBookmarks(sUrl, oSystemContext.id);
                    }
                },
                updateBookmarks: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sUrl, oParameters } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.updateBookmarks(sUrl, oParameters, oSystemContext.id);
                    }
                },
                getContentNodes: {
                    executeServiceCallFn: async () => {
                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.getContentNodes();
                    }
                },
                addCustomBookmark: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sVizType, oConfig, vContentNodes } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.addCustomBookmark(sVizType, oConfig, vContentNodes, oSystemContext.id);
                    }
                },
                countCustomBookmarks: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { oIdentifier } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();
                        oIdentifier.contentProviderId = oSystemContext.id;

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.countCustomBookmarks(oIdentifier);
                    }
                },
                updateCustomBookmarks: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { oIdentifier, oConfig } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();
                        oIdentifier.contentProviderId = oSystemContext.id;

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.updateCustomBookmarks(oIdentifier, oConfig);
                    }
                },
                deleteCustomBookmarks: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { oIdentifier } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();
                        oIdentifier.contentProviderId = oSystemContext.id;

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.deleteCustomBookmarks(oIdentifier);
                    }
                },
                addBookmarkToPage: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { oParameters, sPageId } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.addBookmarkToPage(oParameters, sPageId, oSystemContext.id);
                    }
                }
            }
        },
        "sap.ushell.services.BookmarkV2": {
            oServiceCalls: {
                addBookmarkUI5: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { oParameters, vContainer } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();
                        PostMessageAPI.prototype._stripBookmarkServiceUrlForLocalContentProvider(oParameters, oSystemContext);

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.addBookmark(oParameters, vContainer, oSystemContext.id);
                    }
                },
                // BookmarkV2@addBookmarkByGroupId is mapped to sap.ushell.services.BookmarkV2.addBookmark
                // BookmarkV2@addBookmark is mapped to sap.ushell.services.BookmarkV2.addBookmarkUI5
                addBookmark: {
                    executeServiceCallFn: async (oServiceParams) => {
                        /**
                         * @deprecated since 1.120 Classic homepage is deprecated.
                         */ // eslint-disable-next-line no-constant-condition
                        if (true) {
                            const { oParameters, groupId } = oServiceParams.oMessageData.body;
                            const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                            return BookmarkV2.addBookmarkByGroupId(oParameters, groupId);
                        }

                        throw new Error("BookmarkV2.addBookmarkByGroupId is deprecated. Please use BookmarkV2.addBookmark instead.");
                    }
                },
                getShellGroupIDs: {
                    executeServiceCallFn: async () => {
                        /**
                         * @deprecated since 1.120 Classic homepage is deprecated.
                         */ // eslint-disable-next-line no-constant-condition
                        if (true) {
                            const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                            return BookmarkV2.getShellGroupIDs();
                        }

                        throw new Error("BookmarkV2.getShellGroupIDs is deprecated. Please use BookmarkV2.getContentNodes instead.");
                    }
                },
                countBookmarks: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sUrl } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.countBookmarks(sUrl, oSystemContext.id);
                    }
                },
                deleteBookmarks: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sUrl } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.deleteBookmarks(sUrl, oSystemContext.id);
                    }
                },
                updateBookmarks: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sUrl, oParameters } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.updateBookmarks(sUrl, oParameters, oSystemContext.id);
                    }
                },
                getContentNodes: {
                    executeServiceCallFn: async () => {
                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.getContentNodes();
                    }
                },
                addCustomBookmark: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sVizType, oConfig, vContentNodes } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.addCustomBookmark(sVizType, oConfig, vContentNodes, oSystemContext.id);
                    }
                },
                countCustomBookmarks: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { oIdentifier } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();
                        oIdentifier.contentProviderId = oSystemContext.id;

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.countCustomBookmarks(oIdentifier);
                    }
                },
                updateCustomBookmarks: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { oIdentifier, oConfig } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();
                        oIdentifier.contentProviderId = oSystemContext.id;

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.updateCustomBookmarks(oIdentifier, oConfig);
                    }
                },
                deleteCustomBookmarks: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { oIdentifier } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();
                        oIdentifier.contentProviderId = oSystemContext.id;

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.deleteCustomBookmarks(oIdentifier);
                    }
                },
                addBookmarkToPage: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { oParameters, sPageId } = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();

                        const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");

                        return BookmarkV2.addBookmarkToPage(oParameters, sPageId, oSystemContext.id);
                    }
                }
            }
        },
        "sap.ushell.services.AppLifeCycle": {
            oServiceCalls: {
                reloadCurrentApp: {
                    executeServiceCallFn: async (oServiceParams) => {
                        // should only be called for appruntime
                        EventHub.emit("reloadCurrentApp", {
                            // Omit sAppContainerId, otherwise the entire iframe will be reloaded
                            sCurrentHash: hasher.getHash(),
                            date: Date.now()
                        });
                    }
                },
                getFullyQualifiedXhrUrl: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { path } = oServiceParams.oMessageData.body;

                        if (path !== "" && path !== undefined && path !== null) {
                            const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");
                            const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();
                            const sXhrUrl = oSystemContext.getFullyQualifiedXhrUrl(path);

                            let sHostName = "";
                            let sProtocol = "";
                            let sPort = "";
                            const sFlpURL = Container.getFLPUrl(true);
                            const oURI = new URI(sFlpURL);
                            if (oURI.protocol() !== null && oURI.protocol() !== undefined && oURI.protocol() !== "") {
                                sProtocol = `${oURI.protocol()}://`;
                            }
                            if (oURI.hostname() !== null && oURI.hostname() !== undefined && oURI.hostname() !== "") {
                                sHostName = oURI.hostname();
                            }
                            if (oURI.port() !== null && oURI.port() !== undefined && oURI.port() !== "") {
                                sPort = `:${oURI.port()}`;
                            }

                            const sResult = sProtocol + sHostName + sPort + sXhrUrl;
                            return sResult;
                        }
                    }
                },
                getSystemAlias: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const oAppTargetResolution = oServiceParams.oContainer.getCurrentAppTargetResolution();
                        const sFullyQualifiedSystemAlias = oAppTargetResolution.systemAlias;
                        const sContentProviderId = oAppTargetResolution.contentProviderId;
                        return SystemAlias.getSystemAliasInProvider(sFullyQualifiedSystemAlias, sContentProviderId);
                    }
                },
                setNewAppInfo: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const oParams = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        AppLifeCycle.setAppInfo(oParams, true);
                    }
                },
                updateCurrentAppInfo: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const oParams = oServiceParams.oMessageData.body;
                        const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

                        AppLifeCycle.setAppInfo(oParams, false);
                    }
                }
            }
        },
        "sap.ushell.services.AppConfiguration": {
            oServiceCalls: {
                setApplicationFullWidth: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { bValue } = oServiceParams.oMessageData.body;
                        AppConfiguration.setApplicationFullWidthInternal(bValue);
                    }
                }
            }
        },
        "sap.ushell.appRuntime": {
            oRequestCalls: {
                innerAppRouteChange: {
                    isActiveOnly: true,
                    distributionType: ["all"]
                },
                keepAliveAppHide: {
                    isActiveOnly: true,
                    distributionType: ["all"]
                },
                keepAliveAppShow: {
                    isActiveOnly: true,
                    distributionType: ["all"]
                },
                hashChange: {
                    isActiveOnly: true,
                    distributionType: ["URL"]
                },
                setDirtyFlag: {
                    isActiveOnly: true,
                    distributionType: ["URL"]
                },
                getDirtyFlag: {
                    isActiveOnly: true,
                    distributionType: ["URL"]
                },
                themeChange: {
                    isActiveOnly: false,
                    distributionType: ["all"]
                },
                uiDensityChange: {
                    isActiveOnly: false,
                    distributionType: ["all"]
                }
            },
            oServiceCalls: {
                hashChange: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { newHash, direction } = oServiceParams.oMessageData.body;
                        //FIX for internal incident #1980317281 - In general, hash structure in FLP is splitted into 3 parts:
                        //A - application identification & B - Application parameters & C - Internal application area
                        // Now, when an IFrame changes its hash, it sends PostMessage up to the FLP. The FLP does 2 things: Change its URL
                        // and send a PostMessage back to the IFrame. This fix instruct the Shell.Controller.js to block only
                        // the message back to the IFrame.
                        hasher.disableBlueBoxHashChangeTrigger = true;
                        hasher.replaceHash(newHash);
                        hasher.disableBlueBoxHashChangeTrigger = false;

                        //Getting the history direction, taken from the history object of UI5 (sent by the Iframe).
                        //The direction value is used to update the direction property of the UI5 history object
                        // that is running in the Iframe.
                        if (direction) {
                            const ShellNavigationInternal = await Container.getServiceAsync("ShellNavigationInternal");
                            ShellNavigationInternal.hashChanger.fireEvent(
                                "hashReplaced",
                                {
                                    hash: ShellNavigationInternal.hashChanger.getHash(),
                                    direction: direction
                                }
                            );
                            Log.debug(`PostMessageAPI.hashChange :: Informed by the Iframe, to change the History direction property in FLP to: ${direction}`);
                        }

                        return;
                    }
                },
                iframeIsValid: {
                    executeServiceCallFn: async (oServiceParams) => {
                        oServiceParams.oContainer.setProperty("isIframeValidTime", { time: new Date().getTime() }, true);
                    }
                },
                iframeIsBusy: {
                    executeServiceCallFn: async (oServiceParams) => {
                        //deprecated since 1.118 and not used anymore
                    }
                },
                isInvalidIframe: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { bValue } = oServiceParams.oMessageData.body;
                        oServiceParams.oContainer.setProperty("isInvalidIframe", bValue, true);
                    }
                }
            }
        },
        "sap.ushell.services.UserInfo": {
            oServiceCalls: {
                getThemeList: {
                    executeServiceCallFn: async () => {
                        const UserInfo = await Container.getServiceAsync("UserInfo");

                        const oDeferred = UserInfo.getThemeList();

                        return ushellUtils.promisify(oDeferred);
                    }
                },
                getShellUserInfo: {
                    executeServiceCallFn: async () => {
                        const UserInfo = await Container.getServiceAsync("UserInfo");

                        return UserInfo.getShellUserInfo();
                    }
                },
                getLanguageList: {
                    executeServiceCallFn: async () => {
                        const UserInfo = await Container.getServiceAsync("UserInfo");

                        const oDeferred = UserInfo.getLanguageList();

                        return ushellUtils.promisify(oDeferred);
                    }
                },
                updateUserPreferences: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { language } = oServiceParams.oMessageData.body;

                        if (language) {
                            const oUser = Container.getUser();
                            oUser.setLanguage(language);
                            const UserInfo = await Container.getServiceAsync("UserInfo");

                            const oDeferred = UserInfo.updateUserPreferences();
                            await ushellUtils.promisify(oDeferred);

                            oUser.resetChangedProperty("language");
                        }
                    }
                },
                openThemeManager: {
                    executeServiceCallFn: async () => {
                        EventHub.emit("openThemeManager", Date.now());
                    }
                },
                getLocaleData: {
                    executeServiceCallFn: async () => {
                        const oLocaleData = {
                            //date format
                            calendarType: Formatting.getCalendarType(),
                            dateFormatShort: Formatting.getDatePattern("short"),
                            dateFormatMedium: Formatting.getDatePattern("medium"),
                            //number format
                            numberFormatGroup: Formatting.getNumberSymbol("group"),
                            numberFormatDecimal: Formatting.getNumberSymbol("decimal"),
                            //time format
                            timeFormatShort: Formatting.getTimePattern("short"),
                            timeFormatMedium: Formatting.getTimePattern("medium"),
                            //calendar customizing
                            calendarMapping: Formatting.getCustomIslamicCalendarData(),
                            //timezone
                            timeZone: Localization.getTimezone(),
                            //currency formats
                            currencyFormats: Formatting.getCustomCurrencies()
                        };
                        return oLocaleData;
                    }
                }
            }
        },
        "sap.ushell.services.UserDefaultParameters": {
            oServiceCalls: {
                getValue: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sParameterName } = oServiceParams.oMessageData.body;
                        const [AppLifeCycle, UserDefaultParameters] = await Promise.all([
                            Container.getServiceAsync("AppLifeCycle"),
                            Container.getServiceAsync("UserDefaultParameters")
                        ]);
                        const oSystemContext = await AppLifeCycle.getCurrentApplication().getSystemContext();
                        return UserDefaultParameters.getValue(sParameterName, oSystemContext);
                    }
                }
            }
        },
        "sap.ushell.services.ShellNavigation": {
            oServiceCalls: {
                toExternal: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { oArgs, bWriteHistory } = oServiceParams.oMessageData.body;
                        const ShellNavigationInternal = await Container.getServiceAsync("ShellNavigationInternal");

                        ShellNavigationInternal.toExternal(oArgs, undefined, bWriteHistory);
                    }
                },
                toAppHash: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sAppHash, bWriteHistory } = oServiceParams.oMessageData.body;
                        const ShellNavigationInternal = await Container.getServiceAsync("ShellNavigationInternal");

                        ShellNavigationInternal.toAppHash(sAppHash, bWriteHistory);
                    }
                }
            }
        },
        "sap.ushell.services.ShellNavigationInternal": {
            oServiceCalls: {
                toExternal: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { oArgs, bWriteHistory } = oServiceParams.oMessageData.body;
                        const ShellNavigationInternal = await Container.getServiceAsync("ShellNavigationInternal");

                        ShellNavigationInternal.toExternal(oArgs, undefined, bWriteHistory);
                    }
                },
                toAppHash: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sAppHash, bWriteHistory } = oServiceParams.oMessageData.body;
                        const ShellNavigationInternal = await Container.getServiceAsync("ShellNavigationInternal");

                        ShellNavigationInternal.toAppHash(sAppHash, bWriteHistory);
                    }
                }
            }
        },
        "sap.ushell.services.NavTargetResolution": {
            oServiceCalls: {
                getDistinctSemanticObjects: {
                    executeServiceCallFn: async () => {
                        const NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");

                        const oDeferred = NavTargetResolutionInternal.getDistinctSemanticObjects();

                        return ushellUtils.promisify(oDeferred);
                    }
                },
                expandCompactHash: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sHashFragment } = oServiceParams.oMessageData.body;
                        const NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");

                        const oDeferred = NavTargetResolutionInternal.expandCompactHash(sHashFragment);

                        return ushellUtils.promisify(oDeferred);
                    }
                },
                resolveHashFragment: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sHashFragment } = oServiceParams.oMessageData.body;
                        const NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");

                        const oDeferred = NavTargetResolutionInternal.resolveHashFragment(sHashFragment);

                        return ushellUtils.promisify(oDeferred);
                    }
                },
                isIntentSupported: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aIntents } = oServiceParams.oMessageData.body;
                        const NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");

                        // isIntentSupported: [intent1, intent2, ...] => { intent1: result1, intent2: result2, ... }
                        // isNavigationSupported: [intent1, intent2, ...] => [result1, result2, ...]
                        const oDeferred = NavTargetResolutionInternal.isNavigationSupported(aIntents);
                        const aResults = await ushellUtils.promisify(oDeferred);

                        return aResults.reduce((oResult, oIntentSupported, iIndex) => {
                            const sIntent = aIntents[iIndex];
                            oResult[sIntent] = oIntentSupported;
                            return oResult;
                        }, {});
                    }
                },
                isNavigationSupported: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aIntents } = oServiceParams.oMessageData.body;
                        const NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");

                        const oDeferred = NavTargetResolutionInternal.isNavigationSupported(aIntents);

                        return ushellUtils.promisify(oDeferred);
                    }
                }
            }
        },
        "sap.ushell.services.NavTargetResolutionInternal": {
            oServiceCalls: {
                getDistinctSemanticObjects: {
                    executeServiceCallFn: async () => {
                        const NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");

                        const oDeferred = NavTargetResolutionInternal.getDistinctSemanticObjects();

                        return ushellUtils.promisify(oDeferred);
                    }
                },
                expandCompactHash: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sHashFragment } = oServiceParams.oMessageData.body;
                        const NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");

                        const oDeferred = NavTargetResolutionInternal.expandCompactHash(sHashFragment);

                        return ushellUtils.promisify(oDeferred);
                    }
                },
                resolveHashFragment: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sHashFragment } = oServiceParams.oMessageData.body;
                        const NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");

                        const oDeferred = NavTargetResolutionInternal.resolveHashFragment(sHashFragment);

                        return ushellUtils.promisify(oDeferred);
                    }
                },
                isIntentSupported: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aIntents } = oServiceParams.oMessageData.body;
                        const NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");

                        // isIntentSupported: [intent1, intent2, ...] => { intent1: result1, intent2: result2, ... }
                        // isNavigationSupported: [intent1, intent2, ...] => [result1, result2, ...]
                        const oDeferred = NavTargetResolutionInternal.isNavigationSupported(aIntents);
                        const aResults = await ushellUtils.promisify(oDeferred);

                        return aResults.reduce((oResult, oIntentSupported, iIndex) => {
                            const sIntent = aIntents[iIndex];
                            oResult[sIntent] = oIntentSupported;
                            return oResult;
                        }, {});
                    }
                },
                isNavigationSupported: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aIntents } = oServiceParams.oMessageData.body;
                        const NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");

                        const oDeferred = NavTargetResolutionInternal.isNavigationSupported(aIntents);

                        return ushellUtils.promisify(oDeferred);
                    }
                }
            }
        },
        "sap.ushell.services.Renderer": {
            oServiceCalls: {
                addHeaderItem: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sId, sTooltip, sIcon, iFloatingNumber, bVisible, bCurrentState, aStates } = oServiceParams.oMessageData.body;
                        const FrameBoundExtension = await Container.getServiceAsync("FrameBoundExtension");

                        const oItem = await FrameBoundExtension.createHeaderItem({
                            id: sId,
                            tooltip: sTooltip,
                            icon: sIcon,
                            floatingNumber: iFloatingNumber,
                            press: async function () {
                                const [PostMessageUtils] = await ushellUtils.requireAsync(["sap/ushell/components/applicationIntegration/application/PostMessageUtils"]);

                                PostMessageUtils.postMessageToIframeApp(
                                    oServiceParams.oContainer,
                                    "sap.ushell.appRuntime",
                                    "buttonClick",
                                    { buttonId: sId }
                                );
                            }
                        }, {
                            position: "begin"
                        });

                        storeItem(sId, oItem);
                        applyItemVisibility(oItem, bVisible, bCurrentState, aStates);
                    }
                },

                addHeaderEndItem: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sId, sTooltip, sIcon, iFloatingNumber, bVisible, bCurrentState, aStates } = oServiceParams.oMessageData.body;
                        const FrameBoundExtension = await Container.getServiceAsync("FrameBoundExtension");

                        const oItem = await FrameBoundExtension.createHeaderItem({
                            id: sId,
                            tooltip: sTooltip,
                            icon: sIcon,
                            floatingNumber: iFloatingNumber,
                            press: async function () {
                                const [PostMessageUtils] = await ushellUtils.requireAsync(["sap/ushell/components/applicationIntegration/application/PostMessageUtils"]);

                                PostMessageUtils.postMessageToIframeApp(
                                    oServiceParams.oContainer,
                                    "sap.ushell.appRuntime",
                                    "buttonClick",
                                    { buttonId: sId }
                                );
                            }
                        }, {
                            position: "end"
                        });

                        storeItem(sId, oItem);
                        applyItemVisibility(oItem, bVisible, bCurrentState, aStates);
                    }
                },

                showHeaderItem: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aIds: vIds, bCurrentState, aStates } = oServiceParams.oMessageData.body;

                        const aIds = Array.isArray(vIds) ? vIds : [vIds];

                        visitItems(aIds, (oItem) => {
                            applyItemVisibility(oItem, true, bCurrentState, aStates);
                        });
                    }
                },
                showHeaderEndItem: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aIds: vIds, bCurrentState, aStates } = oServiceParams.oMessageData.body;

                        const aIds = Array.isArray(vIds) ? vIds : [vIds];

                        visitItems(aIds, (oItem) => {
                            applyItemVisibility(oItem, true, bCurrentState, aStates);
                        });
                    }
                },
                hideHeaderItem: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aIds: vIds, bCurrentState, aStates } = oServiceParams.oMessageData.body;

                        const aIds = Array.isArray(vIds) ? vIds : [vIds];

                        visitItems(aIds, (oItem) => {
                            applyItemVisibility(oItem, false, bCurrentState, aStates);
                        });
                    }
                },
                hideHeaderEndItem: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aIds: vIds, bCurrentState, aStates } = oServiceParams.oMessageData.body;

                        const aIds = Array.isArray(vIds) ? vIds : [vIds];

                        visitItems(aIds, (oItem) => {
                            applyItemVisibility(oItem, false, bCurrentState, aStates);
                        });
                    }
                },
                setHeaderTitle: { // secondTitle
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sTitle } = oServiceParams.oMessageData.body;
                        const Extension = await Container.getServiceAsync("Extension");

                        Extension.setSecondTitle(sTitle);
                    }
                },
                setHeaderVisibility: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { bVisible, bCurrentState, aStates } = oServiceParams.oMessageData.body;
                        const oRenderer = Container.getRendererInternal("fiori2");

                        oRenderer.setHeaderVisibility(bVisible, !!bCurrentState, aStates);
                    }
                },
                createShellHeadItem: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { params } = oServiceParams.oMessageData.body;
                        params.press = async function () {
                            const [PostMessageUtils] = await ushellUtils.requireAsync(["sap/ushell/components/applicationIntegration/application/PostMessageUtils"]);

                            PostMessageUtils.postMessageToIframeApp(
                                oServiceParams.oContainer,
                                "sap.ushell.appRuntime",
                                "buttonClick",
                                { buttonId: params.id }
                            );
                        };
                        // eslint-disable-next-line no-new
                        new ShellHeadItem(params);
                    }
                },
                showActionButton: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aIds: vIds, bCurrentState, aStates } = oServiceParams.oMessageData.body;

                        const aIds = Array.isArray(vIds) ? vIds : [vIds];

                        visitItems(aIds, (oItem) => {
                            applyItemVisibility(oItem, true, bCurrentState, aStates);
                        });
                    }
                },
                hideActionButton: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aIds: vIds, bCurrentState, aStates } = oServiceParams.oMessageData.body;

                        const aIds = Array.isArray(vIds) ? vIds : [vIds];

                        visitItems(aIds, (oItem) => {
                            applyItemVisibility(oItem, true, bCurrentState, aStates);
                        });
                    }
                },
                addUserAction: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { controlType, oControlProperties, bIsVisible, bCurrentState, aStates } = oServiceParams.oMessageData.body.oParameters;
                        const Extension = await Container.getServiceAsync("Extension");

                        oControlProperties.press = async function () {
                            const [PostMessageUtils] = await ushellUtils.requireAsync(["sap/ushell/components/applicationIntegration/application/PostMessageUtils"]);

                            PostMessageUtils.postMessageToIframeApp(
                                oServiceParams.oContainer,
                                "sap.ushell.appRuntime",
                                "buttonClick",
                                { buttonId: oControlProperties.id }
                            );
                        };

                        const oItem = await Extension.createUserAction(oControlProperties, {
                            controlType
                        });

                        storeItem(oControlProperties.id, oItem);
                        applyItemVisibility(oItem, bIsVisible, bCurrentState, aStates);
                    }
                },
                addOptionsActionSheetButton: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const vButtons = oServiceParams.oMessageData.body;
                        const Extension = await Container.getServiceAsync("Extension");

                        const aButtons = Array.isArray(vButtons) ? vButtons : [vButtons];

                        aButtons.forEach(async (oButton) => {
                            destroyControl(oButton.id);

                            // eslint-disable-next-line no-new
                            new Button({
                                id: oButton.id,
                                text: oButton.text,
                                icon: oButton.icon,
                                tooltip: oButton.tooltip,
                                press: async function () {
                                    const [PostMessageUtils] = await ushellUtils.requireAsync(["sap/ushell/components/applicationIntegration/application/PostMessageUtils"]);

                                    PostMessageUtils.postMessageToIframeApp(
                                        oServiceParams.oContainer,
                                        "sap.ushell.appRuntime",
                                        "buttonClick",
                                        { buttonId: oButton.id }
                                    );
                                }
                            });

                            const oItem = await Extension.createUserAction({
                                id: oButton.id
                            });

                            storeItem(oButton.id, oItem);
                            applyItemVisibility(oItem, true, true, oButton.aStates);
                        });
                    }
                },
                removeOptionsActionSheetButton: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const vButtons = oServiceParams.oMessageData.body;

                        const aButtons = Array.isArray(vButtons) ? vButtons : [vButtons];

                        aButtons.forEach((oButton) => {
                            const oItem = getItem(oButton.id);
                            if (oItem) {
                                applyItemVisibility(oItem, true, true, oButton.aStates);

                                return destroyControl(oButton.id);
                            }
                            Log.warning(`User action with id ${oButton.id} not found`);
                        });
                    }
                },
                updateHeaderItem: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { sId, oControlProperties } = oServiceParams.oMessageData.body;

                        // we only support update of floatingNumber
                        if (!Object.hasOwn(oControlProperties, "floatingNumber")) {
                            return;
                        }

                        const oItem = getItem(sId);

                        if (oItem?.getControl) {
                            const oControl = await oItem.getControl();
                            oControl?.setFloatingNumber?.(oControlProperties.floatingNumber);
                        }
                    }
                },
                destroyButton: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aIds: vIds } = oServiceParams.oMessageData.body;

                        const aIds = Array.isArray(vIds) ? vIds : [vIds];

                        aIds.forEach((sId) => {
                            destroyControl(sId);
                        });
                    }
                }
            }
        },
        "sap.ushell.services.Extension": {
            oServiceCalls: {
                createHeaderItem: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { controlProperties, events, parameters } = oServiceParams.oMessageData.body;
                        const sItemId = generateItemId();

                        events.forEach((sEventName) => {
                            controlProperties[sEventName] = async function () {
                                const [PostMessageUtils] = await ushellUtils.requireAsync(["sap/ushell/components/applicationIntegration/application/PostMessageUtils"]);

                                PostMessageUtils.postMessageToIframeApp(
                                    oServiceParams.oContainer,
                                    "sap.ushell.services.Extension",
                                    "handleControlEvent", {
                                    eventName: sEventName,
                                    itemId: sItemId
                                }
                                );
                            };
                        });

                        const Extension = await Container.getServiceAsync("Extension");
                        const oItem = await Extension.createHeaderItem(controlProperties, parameters);
                        storeItem(sItemId, oItem);

                        return {
                            itemId: sItemId
                        };
                    }
                },
                createUserAction: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { controlProperties, events, parameters } = oServiceParams.oMessageData.body;
                        const sItemId = generateItemId();

                        events.forEach((sEventName) => {
                            controlProperties[sEventName] = async function () {
                                const [PostMessageUtils] = await ushellUtils.requireAsync(["sap/ushell/components/applicationIntegration/application/PostMessageUtils"]);

                                PostMessageUtils.postMessageToIframeApp(
                                    oServiceParams.oContainer,
                                    "sap.ushell.services.Extension",
                                    "handleControlEvent",
                                    {
                                        eventName: sEventName,
                                        itemId: sItemId
                                    }
                                );
                            };
                        });

                        const Extension = await Container.getServiceAsync("Extension");
                        const oItem = await Extension.createUserAction(controlProperties, parameters);
                        storeItem(sItemId, oItem);

                        return {
                            itemId: sItemId
                        };
                    }
                },
                "Item.destroy": {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { itemId } = oServiceParams.oMessageData.body;

                        const oItem = getItem(itemId);
                        if (oItem?.destroy) {
                            oItem.destroy();
                            removeItem(itemId);
                        }
                    }
                },
                "Item.showForCurrentApp": {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { itemId } = oServiceParams.oMessageData.body;

                        const oItem = getItem(itemId);
                        if (oItem?.showForCurrentApp) {
                            oItem.showForCurrentApp();
                        }
                    }
                },
                "Item.hideForCurrentApp": {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { itemId } = oServiceParams.oMessageData.body;

                        const oItem = getItem(itemId);
                        if (oItem?.hideForCurrentApp) {
                            oItem.hideForCurrentApp();
                        }
                    }
                },
                "Item.showForAllApps": {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { itemId } = oServiceParams.oMessageData.body;

                        const oItem = getItem(itemId);
                        if (oItem?.showForAllApps) {
                            oItem.showForAllApps();
                        }
                    }
                },
                "Item.hideForAllApps": {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { itemId } = oServiceParams.oMessageData.body;

                        const oItem = getItem(itemId);
                        if (oItem?.hideForAllApps) {
                            oItem.hideForAllApps();
                        }
                    }
                },
                "Item.showOnHome": {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { itemId } = oServiceParams.oMessageData.body;

                        const oItem = getItem(itemId);
                        if (oItem?.showOnHome) {
                            oItem.showOnHome();
                        }
                    }
                },
                "Item.hideOnHome": {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { itemId } = oServiceParams.oMessageData.body;

                        const oItem = getItem(itemId);
                        if (oItem?.hideOnHome) {
                            oItem.hideOnHome();
                        }
                    }
                },
                setSecondTitle: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { title } = oServiceParams.oMessageData.body;
                        const Extension = await Container.getServiceAsync("Extension");

                        return Extension.setSecondTitle(title);
                    }
                }
            }
        },
        "sap.ushell.services.LaunchPage": {
            oServiceCalls: {
                getGroupsForBookmarks: {
                    executeServiceCallFn: async () => {
                        /**
                         * @deprecated since 1.120 Classic homepage is deprecated.
                         */ // eslint-disable-next-line no-constant-condition
                        if (true) {
                            const FlpLaunchPage = await Container.getServiceAsync("FlpLaunchPage");

                            const oDeferred = FlpLaunchPage.getGroupsForBookmarks();

                            return ushellUtils.promisify(oDeferred);
                        }

                        throw new Error("LaunchPage.getGroupsForBookmarks is deprecated. Please use BookmarkV2.getContentNodes instead.");
                    }
                }
            }
        },
        "sap.ushell.services.Menu": {
            oServiceCalls: {
                getSpacesPagesHierarchy: {
                    executeServiceCallFn: async () => {
                        const Menu = await Container.getServiceAsync("Menu");

                        const aContentNodes = Menu.getContentNodes([ContentNodeType.Space, ContentNodeType.Page]);

                        return aContentNodes.map(({ id: spaceId, label: spaceLabel, children }) => {
                            return {
                                id: spaceId,
                                title: spaceLabel,
                                pages: (children || []).map(({ id: pageId, label: pageLabel }) => {
                                    return {
                                        id: pageId,
                                        title: pageLabel
                                    };
                                })
                            };
                        });
                    }
                }
            }
        },
        "sap.ushell.services.CommonDataModel": {
            oServiceCalls: {
                getAllPages: {
                    executeServiceCallFn: async () => {
                        const CommonDataModel = await Container.getServiceAsync("CommonDataModel");

                        return CommonDataModel.getAllPages();
                    }
                }
            }
        },
        "sap.ushell.services.UITracer": {
            oServiceCalls: {
                trace: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { trace } = oServiceParams.oMessageData.body;
                        await Container.getServiceAsync("UITracer");

                        EventHub.emit("UITracer.trace", trace);
                    }
                }
            }
        },
        "sap.ushell.services.MessageBroker": {
            oServiceCalls: {
                _execute: {
                    executeServiceCallFn: async (oServiceParams) => {
                        if (Config.last("/core/shell/enableMessageBroker")) {
                            await Container.getServiceAsync("MessageBroker");
                            const [MessageBrokerEngine] = await ushellUtils.requireAsync(["sap/ushell/services/MessageBroker/MessageBrokerEngine"]);

                            return MessageBrokerEngine.processPostMessage(oServiceParams);
                        }
                        return {};
                    }
                }
            }
        },
        "sap.ushell.services.SearchableContent": {
            oServiceCalls: {
                getApps: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const oOptions = oServiceParams?.oMessageData?.body?.oOptions || {};
                        const SearchableContent = await Container.getServiceAsync("SearchableContent");

                        return SearchableContent.getApps(oOptions);
                    }
                }
            }
        },
        "sap.ushell.services.ReferenceResolver": {
            oServiceCalls: {
                resolveReferences: {
                    executeServiceCallFn: async (oServiceParams) => {
                        const { aReferences } = oServiceParams.oMessageData.body;
                        const ReferenceResolver = await Container.getServiceAsync("ReferenceResolver");

                        return ReferenceResolver.resolveReferences(aReferences);
                    }
                }
            }
        }
    };

    /**
     * @private
     */
    function PostMessageAPI () {
        /**
         * @private
         */
        this._getBrowserURL = function () {
            return document.URL;
        };

        //check that all APIs start with "sap.ushell". FLP will not
        // start successfully if this is not the case
        Object.keys(oAPIs).forEach((sKey) => {
            if (sKey.indexOf(SAP_API_PREFIX) !== 0) {
                throw new Error(`All Post Message APIs must start with '${SAP_API_PREFIX}' - ${sKey}`);
            }
        });

        PostMessageAPIInterface.init(
            true,
            PostMessageAPI.prototype.registerShellCommunicationHandler.bind(this)
        );
    }

    /**
     * @private
     */
    PostMessageAPI.prototype.getAPIs = function () {
        return oAPIs;
    };

    /**
     * @private
     */
    function addShellCommunicationHandler (sKey, oCommunicationEntry) {
        //only one entry is possible in oCommunicationHandler because we got here from registerShellCommunicationHandler!
        const oCommObject = oAPIs[sKey];

        //We have the entry just update it
        if (oCommObject) {
            //add the communication handler to that entry
            if (oCommunicationEntry.oServiceCalls) {
                Object.keys(oCommunicationEntry.oServiceCalls).forEach((key) => {
                    oCommObject.oServiceCalls[key] = oCommunicationEntry.oServiceCalls[key];
                });
            }

            if (!oCommObject.oRequestCalls) {
                oCommObject.oRequestCalls = {};
            }

            if (oCommunicationEntry.oRequestCalls) {
                Object.keys(oCommunicationEntry.oRequestCalls).forEach((key) => {
                    oCommObject.oRequestCalls[key] = oCommunicationEntry.oRequestCalls[key];
                });
            }
            return;
        }

        //create a new entry..
        const oNewCommEntry = {
            oRequestCalls: {},
            oServiceCalls: {}
        };

        if (oCommunicationEntry.oServiceCalls) {
            Object.keys(oCommunicationEntry.oServiceCalls).forEach((key) => {
                oNewCommEntry.oServiceCalls[key] = oCommunicationEntry.oServiceCalls[key];
            });
        }

        if (oCommunicationEntry.oRequestCalls) {
            Object.keys(oCommunicationEntry.oRequestCalls).forEach((key) => {
                oNewCommEntry.oRequestCalls[key] = oCommunicationEntry.oRequestCalls[key];
            });
        }

        oAPIs[sKey] = oNewCommEntry;
    }

    /**
     * @private
     */
    PostMessageAPI.prototype._getPostMesageInterface = function (sServiceName, sInterface) {
        const oShellCommunicationHandlersObj = this.getAPIs();

        if (oShellCommunicationHandlersObj[sServiceName]) {
            const oCommHandlerService = oShellCommunicationHandlersObj[sServiceName];
            if (oCommHandlerService?.oRequestCalls?.[sInterface]) {
                return oCommHandlerService.oRequestCalls[sInterface];
            }
        }
    };

    /**
     * @private
     */
    PostMessageAPI.prototype.registerShellCommunicationHandler = function (oCommunicationHandler) {
        Object.keys(oCommunicationHandler).forEach((sKey) => {
            addShellCommunicationHandler(sKey, oCommunicationHandler[sKey]);
        });
    };

    /**
     * @private
     */
    PostMessageAPI.prototype.isActiveOnly = function (sServiceName, sInterface) {
        const oCommandInterface = this._getPostMesageInterface(sServiceName, sInterface);

        if (oCommandInterface) {
            return oCommandInterface.isActiveOnly;
        }
    };

    /**
     * @private
     */
    PostMessageAPI.prototype._createNewInnerAppState = async function (oServiceParams) {
        const { sData } = oServiceParams.oMessageData.body;
        let oValue;

        if (sData !== undefined) {
            try {
                oValue = JSON.parse(sData);
            } catch (e) {
                oValue = sData;
            }
        } else {
            oValue = "";
        }

        const AppState = await Container.getServiceAsync("AppState");
        const oNewAppState = AppState.createEmptyAppState();

        oNewAppState.setData(oValue);
        oNewAppState.save();
        const sNewAppStateKey = oNewAppState.getKey();

        let sHash = hasher.getHash();
        if (sHash.indexOf("&/") > 0) {
            if (sHash.indexOf("sap-iapp-state=") > 0) {
                const sCurrAppStateKey = /(?:sap-iapp-state=)([^&/]+)/.exec(sHash)[1];
                sHash = sHash.replace(sCurrAppStateKey, sNewAppStateKey);
            } else {
                sHash = `${sHash}/sap-iapp-state=${sNewAppStateKey}`;
            }
        } else {
            sHash = `${sHash}&/sap-iapp-state=${sNewAppStateKey}`;
        }

        hasher.disableBlueBoxHashChangeTrigger = true;
        hasher.replaceHash(sHash);
        hasher.disableBlueBoxHashChangeTrigger = false;

        return sNewAppStateKey;
    };

    /**
     * Destroys a control by its ID.
     * Does nothing if the control does not exist.
     * @param {string} sControlId The ID of the control.
     *
     * @since 1.125.0
     * @private
     */
    function destroyControl (sControlId) {
        const oControl = Element.getElementById(sControlId);
        if (oControl?.destroy) {
            oControl.destroy();
        }
    }

    /**
     * Applies the visibility of an item according to the fiori2 renderer logic.
     * @param {sap.ushell.services.Extension.Item|sap.ushell.services.FrameBoundExtension.Item} oItem The extension item.
     * @param {boolean} bVisible The visibility for the item.
     * @param {boolean} bCurrentState Wether the visibility applies to the current state.
     * @param {sap.ushell.renderer.Renderer.LaunchpadState[]} aStates The desired launchpad states.
     *
     * @since 1.125.0
     * @private
     */
    function applyItemVisibility (oItem, bVisible, bCurrentState, aStates) {
        /* eslint-disable no-unused-expressions */
        if (bCurrentState) {
            bVisible ? oItem.showForCurrentApp() : oItem.hideForCurrentApp();
        } else {
            bVisible ? oItem.hideForCurrentApp() : oItem.showForCurrentApp();

            // aStates is only evaluated if bCurrentState is false
            if (Array.isArray(aStates)) {
                if (aStates.includes("app")) {
                    bVisible ? oItem.showForAllApps() : oItem.hideForAllApps();
                } else {
                    bVisible ? oItem.hideForAllApps() : oItem.showForAllApps();
                }
                if (aStates.includes("home")) {
                    bVisible ? oItem.showOnHome() : oItem.hideOnHome();
                } else {
                    bVisible ? oItem.hideOnHome() : oItem.showOnHome();
                }
            }
        }
        /* eslint-enable no-unused-expressions */
    }

    const oItemMap = {};

    /**
     * Generates a unique ID for an item.
     * @returns {string} A unique ID.
     *
     * @see sap.ushell.services.Extension.Item
     * @see sap.ushell.services.FrameBoundExtension.Item
     *
     * @since 1.124.0
     * @private
     */
    function generateItemId () {
        const sItemId = fnGetUid();
        if (Object.hasOwn(oItemMap, sItemId)) {
            return generateItemId();
        }
        // reserve the item ID in the map to avoid duplicates
        oItemMap[sItemId] = null;
        return sItemId;
    }

    /**
     * Stores the Item object by its ID.
     * @param {*} sItemId The ID of the item.
     * @param {object} oItem The item object.
     *
     * @see sap.ushell.services.Extension.Item
     * @see sap.ushell.services.FrameBoundExtension.Item
     *
     * @since 1.124.0
     * @private
     */
    function storeItem (sItemId, oItem) {
        oItemMap[sItemId] = oItem;
    }

    /**
     * Returns the Item object by its ID.
     * @param {string} sItemId The ID of the item.
     * @returns {object} The item object.
     *
     * @see sap.ushell.services.Extension.Item
     * @see sap.ushell.services.FrameBoundExtension.Item
     *
     * @since 1.124.0
     * @private
     */
    function getItem (sItemId) {
        return oItemMap[sItemId];
    }

    /**
     * Removes the Item object by its ID.
     * @param {string} sItemId The ID of the item.
     *
     * @see sap.ushell.services.Extension.Item
     * @see sap.ushell.services.FrameBoundExtension.Item
     *
     * @since 1.124.0
     * @private
     */
    function removeItem (sItemId) {
        delete oItemMap[sItemId];
    }

    /**
     * Visits each item by its ID and calls a callback function.
     * Ignores items that are not found.
     * @param {string[]} aIds The ids of the items to visit
     * @param {function} fnCallback The callback function to call for each item
     *
     * @since 1.125.0
     * @private
     */
    function visitItems (aIds, fnCallback) {
        aIds.forEach((sId) => {
            const oItem = getItem(sId);
            if (oItem) {
                fnCallback(oItem);
            } else {
                Log.warning(`Item with id ${sId} not found`);
            }
        });
    }

    /**
     * @private
     */
    PostMessageAPI.prototype.registerAsyncDirtyStateProvider = function (oServiceParams) {
        Container.setAsyncDirtyStateProvider(async function (oNavigationContext) {
            const [PostMessageUtils] = await ushellUtils.requireAsync(["sap/ushell/components/applicationIntegration/application/PostMessageUtils"]);

            //safety check in case post message does not get result
            const oNativeDeferred = new Deferred();
            const backupTimer = setTimeout(() => {
                oNativeDeferred.resolve(false);
            }, 2500);

            PostMessageUtils.postMessageToIframeApp(
                oServiceParams.oContainer,
                "sap.ushell.appRuntime",
                "handleDirtyStateProvider",
                { oNavigationContext: oNavigationContext },
                true
            ).then((oResponse) => {
                if (backupTimer) {
                    clearTimeout(backupTimer);
                }

                oNativeDeferred.resolve(oResponse?.body?.result || false);
            });

            return oNativeDeferred.promise;
        });
    };

    /**
     * @private
     */
    PostMessageAPI.prototype.deregisterAsyncDirtyStateProvider = function () {
        Container.setAsyncDirtyStateProvider();
    };

    /**
     * @private
     */
    PostMessageAPI.prototype._sendEmail = async function (sTo = "", sSubject = "", sBody = "", sCc = "", sBcc = "", sIFrameURL, bSetAppStateToPublic) {
        let sFLPUrl = (this._getBrowserURL && this._getBrowserURL()) || document.URL;

        function replaceIframeUrlToFLPUrl (sIFrameURL1, sFLPUrl1, sXStateKey, sIStateKey, sXStateKeyNew, sIStateKeyNew) {
            //replace iframe url with flp url
            sSubject = sSubject.includes(sIFrameURL1) ? sSubject.replace(sIFrameURL1, sFLPUrl1) : sSubject;
            sBody = sBody.includes(sIFrameURL1) ? sBody.replace(sIFrameURL1, sFLPUrl1) : sBody;

            //for cases where we do not find iframe url, replace the app state keys
            if (sXStateKey && sXStateKeyNew) {
                sSubject = sSubject.includes(sXStateKey) ? sSubject.replaceAll(sXStateKey, sXStateKeyNew) : sSubject;
                sBody = sBody.includes(sXStateKey) ? sBody.replaceAll(sXStateKey, sXStateKeyNew) : sBody;
            }

            if (sIStateKey && sIStateKeyNew) {
                sSubject = sSubject.includes(sIStateKey) ? sSubject.replaceAll(sIStateKey, sIStateKeyNew) : sSubject;
                sBody = sBody.includes(sIStateKey) ? sBody.replaceAll(sIStateKey, sIStateKeyNew) : sBody;
            }

        }

        if (bSetAppStateToPublic) {
            const oAppStateService = await Container.getServiceAsync("AppState");
            oAppStateService.setAppStateToPublic(sIFrameURL).then((sNewURL, sXStateKey, sIStateKey, sXStateKeyNew = "", sIStateKeyNew = "") => {
                if (sXStateKeyNew) {
                    sFLPUrl = sFLPUrl.replace(sXStateKey, sXStateKeyNew);
                }
                if (sIStateKeyNew) {
                    sFLPUrl = sFLPUrl.replace(sIStateKey, sIStateKeyNew);
                }
                //check if the subject or the body of the email contain the IFrame URL
                replaceIframeUrlToFLPUrl(sIFrameURL, sFLPUrl, sXStateKey, sIStateKey, sXStateKeyNew, sIStateKeyNew);
                URLHelper.triggerEmail(sTo, sSubject, sBody, sCc, sBcc);
            }, Log.error);
        } else {
            //check if the subject or the body of the email contain the IFrame URL
            replaceIframeUrlToFLPUrl(sIFrameURL, sFLPUrl);
            URLHelper.triggerEmail(sTo, sSubject, sBody, sCc, sBcc);
        }
    };

    /**
     * Helper function for removing the service URL of dynamic bookmark tiles
     * if the bookmark is created from a local service provider
     * <p>
     * This is a short-term mitigation for customer incident 57472/2021.
     * The service URLs for dynamic tiles created as bookmark for apps created
     * locally on CF (either manually or deployed to the local HTML5 repo) cannot
     * be correctly constructed, because the path prefix cannot be resolved.
     * As intermediate workaround, we remove the service URL to avoid the display
     * of the ERROR state.
     *
     * @private
     * @param {object} oParameters parameters for bookmark creation
     * @param {object} oSystemContext the system context for bookmark creation
     */
    PostMessageAPI.prototype._stripBookmarkServiceUrlForLocalContentProvider = function (oParameters, oSystemContext) {
        if (!oParameters || !oParameters.serviceUrl || !oSystemContext) {
            return;
        }

        if (oSystemContext.id === "" || oSystemContext.id === "saas_approuter") {
            oParameters.serviceUrl = undefined;

            Log.warning("Dynamic data bookmarks tiles are not supported for local content providers",
                null, "sap/ushell/components/applicationIntegration/application/PostMessageAPI");
        }
    };

    /**
     * Callback for the back button registered via
     * <code>sap.ushell.ui5service.ShellUIService#setBackNavigation</code>
     *
     * Sends a postMessage request to the source window for triggering the
     * back navigation in the application.
     *
     * @param {object} oSourceWindow
     *   the source window object
     * @param {string} sServiceName
     *   the service name returned from the previous setBackNavigation
     *   postMessage request
     * @param {string} sOrigin
     *   a string identifying the origin where the message is sent from
     */
    PostMessageAPI.prototype._backButtonPressedCallback = function (oSourceWindow, sServiceName, sOrigin) {
        const sRequestData = JSON.stringify({
            type: "request",
            service: sServiceName,
            request_id: fnGetUid(),
            body: {}
        });

        Log.debug(
            `Sending post message request to origin ' ${sOrigin}': ${sRequestData}`,
            null,
            "sap.ushell.components.container.ApplicationContainer"
        );

        oSourceWindow.postMessage(sRequestData, sOrigin);
    };

    return new PostMessageAPI();
});
