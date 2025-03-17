// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/XMLView",
    "sap/base/Log",
    "sap/ushell/resources",
    "sap/ushell/Container"
], function (
    XMLView,
    Log,
    resources,
    Container
) {
    "use strict";

    let oThemeList;

    function _loadThemeList () {
        if (oThemeList) {
            return Promise.resolve(oThemeList);
        }

        return Container.getServiceAsync("UserInfo").then(function (oUserInfoService) {
            return new Promise(function (fnResolve) {
                oUserInfoService.getThemeList()
                    .done(function (oData) {
                        oThemeList = oData;
                        fnResolve(oThemeList);
                    })
                    .fail(function () {
                        //retrigger request the next time
                        Log.error("Failed to load theme list.");
                        fnResolve({});
                    });
            });
        });
    }

    function getEntry () {

        var oViewInstance;
        var oEntry = {
            id: "themes",
            entryHelpID: "themes",
            title: resources.i18n.getText("Appearance"),
            valueResult: null,
            contentResult: null,
            icon: "sap-icon://palette",
            valueArgument: function () {
                return _loadThemeList().then(function (oThemes) {
                    const aThemes = oThemes?.options || [];
                    const sUserThemeId = Container.getUser().getTheme();
                    const oTheme = aThemes.find((theme) => theme?.id === sUserThemeId);
                    return oTheme?.name || "";
                });
            },
            contentFunc: function () {
                return _loadThemeList()
                    .then(function (oThemes) {
                        return XMLView.create({
                            id: "userPrefThemeSelector",
                            viewName: "sap.ushell.components.shell.Settings.appearance.Appearance",
                            viewData: {
                                themeList: oThemes?.options || [],
                                themeSets: oThemes?.sets || [],
                                themeRoot: oThemes?.themeRoot
                            }
                        });
                    }).then(function (oView) {
                        oViewInstance = oView;
                        return oView;
                    });
            },
            onSave: function (fnUpdateUserPreferences) {
                if (oViewInstance) {
                    return oViewInstance.getController().onSave(fnUpdateUserPreferences);
                }
                Log.warning("Save operation for appearance settings was not executed, because the userPrefThemeSelector view was not initialized");
                return Promise.resolve();

            },
            onCancel: function () {
                if (oViewInstance) {
                    oViewInstance.getController().onCancel();
                    return;
                }
                Log.warning(
                    "Cancel operation for appearance settings was not executed, because the userPrefThemeSelector view was not initialized"
                );
            }
        };

        return oEntry;
    }

    return {
        getEntry: getEntry
    };

});
