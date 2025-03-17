// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell_abap/pbServices/ui2/ODataWrapper",
    "sap/ui/thirdparty/datajs",
    "sap/ui/thirdparty/jquery",
    "sap/ui/VersionInfo",
    "sap/base/Log",
    "sap/ushell/resources",
    "sap/base/i18n/date/CalendarWeekNumbering"
], function (
    ODataWrapper,
    OData,
    jQuery,
    VersionInfo,
    Log,
    resources,
    CalendarWeekNumbering
) {
    "use strict";

    /**
     * @returns {sap.ushell_abap.adapters.abap.UserInfoAdapter}
     * @private
     */

    var oDataWrapper;

    var DEFAULT_LANGUAGE_KEY = "default";

    return function () {
        this._updateODataObjectBasedOnDatatype = function (oValue, oDataObj) {
            if (jQuery.type(oValue) === "string") {
                oDataObj.value = oValue.toString();
                oDataObj.dataType = "Edm.String";
            }
            if (jQuery.type(oValue) === "boolean") {
                oDataObj.value = oValue.toString();
                oDataObj.dataType = "Edm.Boolean";
            }
            return oDataObj;
        };

        // Get list of available themes and theme sets using REST API
        this._getThemeList = async function () {
            let sThemingAPI = "/sap/bc/rest/themes"; // ABAP end point

            const sClient = window["sap-ushell-config"]?.startupConfig?.client;
            if (sClient) {
                sThemingAPI += "/~client-" + sClient;
            }
            const sThemeRoot = sThemingAPI + "/themeroot/v1";
            sThemingAPI += "/themelist/v1";

            const oVersion = await VersionInfo.load();
            const sVersion = oVersion.version;
            if (sVersion) {
                sThemingAPI += "/~v=UI5:" + sVersion;
            }

            sThemingAPI += "?filter-types=STANDARD,SET"; // get all themes and sets
            const oList = await fetch(sThemingAPI);
            if (!oList.ok) {
                throw new Error(`List API failed with status: ${oList.status}`);
            }
            const oListData = await oList.json();
            const aThemes = [];
            const aThemeSets = [];
            oListData.forEach((entry) => {
                if (entry?.type === "STANDARD") {
                    entry.name = entry.label; // for compatibility with previous implementation
                    aThemes.push(entry);
                } else if (entry?.type === "SET") {
                    aThemeSets.push(entry);
                }
            });
            return {
                themes: aThemes,
                sets: aThemeSets,
                themeRoot: sThemeRoot // neeeded for calculate avatar urls
            };
        };

        /**
         * Returns the list of themes available for the user.
         *
         * @returns {jQuery.Promise} Resolves the theme list.
         */
        this.getThemeList = function () {
            const oDeferred = new jQuery.Deferred();

            this._getThemeList()
            .then((oThemeList) => {
                oDeferred.resolve({
                    options: oThemeList.themes, // rename for compatibility with previous implementation
                    sets: oThemeList.sets,
                    themeRoot: oThemeList.themeRoot
                });
            })
            .catch(function (error) {
                Log.error(error, null, "sap.ushell_abap.adapters.abap.UserInfoAdapter");
                // fallback to the previous implementation via /UI2/INTEROP
                OData.read({requestUri: "/sap/opu/odata/UI2/INTEROP/Themes"},
                    (oData) => { // success
                        oDeferred.resolve({
                            options: oData?.results || []
                        });
                    },
                    (oError) => { // fail
                        Log.error(oError.message, null, "sap.ushell_abap.adapters.abap.UserInfoAdapter");
                        oDeferred.reject(oError.message);
                    });
            });

            return oDeferred.promise();
        };

        /**
         * Returns the list of available calendar week numberings to the user.
         * @since 1.118.0
         * @returns {object[]} array of calendar week numberings
         */
        this.getCalendarWeekNumberingList = function () {
            return [{
                value: CalendarWeekNumbering.Default,
                title: resources.i18n.getText("DefaultWeekNumberingTitle"),
                description: resources.i18n.getText("DefaultWeekNumberingText")
            }, {
                value: CalendarWeekNumbering.ISO_8601,
                title: resources.i18n.getText("ISO_8601WeekNumberingTitle"),
                description: resources.i18n.getText("ISO_8601WeekNumberingText")
            }, {
                value: CalendarWeekNumbering.MiddleEastern,
                title: resources.i18n.getText("MiddleEasternWeekNumberingTitle"),
                description: resources.i18n.getText("MiddleEasternWeekNumberingText")
            }, {
                value: CalendarWeekNumbering.WesternTraditional,
                title: resources.i18n.getText("WesternTraditionalWeekNumberingTitle"),
                description: resources.i18n.getText("WesternTraditionalWeekNumberingText")
            }];
        };

        /**
         * Returns the list of available language for the user.
         *
         * @returns {jQuery.Promise} Resolves the list of languages.
         */
        this.getLanguageList = function () {
            var oDeferred = new jQuery.Deferred(),
                sUri = encodeURI("/sap/opu/odata/UI2/INTEROP/UserProfilePropertyValues?$filter=id eq 'PREFERRED_LOGON_LANGUAGE'");

            // read semantic objects from interop service
            OData.read({ requestUri: sUri },
                // sucess
                function (oData) {
                    var aResult = [{
                        text: resources.i18n.getText("userSettings.browserLanguage"),
                        key: DEFAULT_LANGUAGE_KEY
                    }];
                    var aLanguageListFromServer = oData.results.map(function (oLanguage) {
                        return {
                            text: oLanguage.description,
                            key: oLanguage.value
                        };
                    }).sort(function (oLanguage1, oLanguage2) {
                        return oLanguage1.text.localeCompare(oLanguage2.text);
                    });

                    aResult = aResult.concat(aLanguageListFromServer);
                    oDeferred.resolve(aResult);
                },
                // fail
                function (oError) {
                    Log.error(oError.message, null, "sap.ushell_abap.adapters.abap.UserInfoAdapter");
                    oDeferred.reject(oError.message);
                });

            return oDeferred.promise();
        };

        /**
         * Returns the list of possible values ("value lists") for the following
         * user profile properties:
         * NUMBER_FORMAT, TIME_ZONE, TIME_FORMAT,DATE_FORMAT
         *
         * Depending on the service's version no possible values are returned.
         * This is also the indicator that this user profile property cannot be changed via
         * a call to <code>updateUserPreferences</code>.
         *
         * @returns {jQuery.Promise} Resolves an object with the received results, .e.g.:
         *              <pre>
         *              {
         *                  "NUMBER_FORMAT": [
         *                      {
         *                          description: "1,234,567.89",
         *                          value: "X"
         *                      }
         *                  ],
         *                  "TIME_FORMAT": [ ... ]
         *              }
         *              </pre>
         *              In case of a global error the Promise is rejected.
         *
         * @private
         */
        this.getUserProfilePropertyValueLists = function () {
            var oDeferred = new jQuery.Deferred();
            var sUri;
            var oResult = {};
            var aUserProfilePropertyIds = [
                "NUMBER_FORMAT",
                "TIME_ZONE",
                "TIME_FORMAT",
                "DATE_FORMAT",
                "CALENDAR_WEEK_NUMBERING"
            ];

            var oODataWrapper = this._createWrapper("/sap/opu/odata/UI2/INTEROP/");
            oODataWrapper.openBatchQueue();
            var sCurrentId;

            for (var i = 0; i < aUserProfilePropertyIds.length; i++) {
                sCurrentId = aUserProfilePropertyIds[i];
                sUri = encodeURI("UserProfilePropertyValues?$filter=id eq '" + sCurrentId + "'&$select=description,value");

                oODataWrapper.read(sUri,
                    // success
                    function (oData) {
                        oResult[this] = oData.results;
                    }.bind(sCurrentId),
                    // error
                    function (oError) {
                        Log.error(oError.message, null, "sap.ushell_abap.adapters.abap.UserInfoAdapter");
                    }
                );
            }

            oODataWrapper.submitBatchQueue(
                // success
                function () {
                    oDeferred.resolve(oResult);
                },
                // error
                function (oError) {
                    Log.error(oError.message, null, "sap.ushell_abap.adapters.abap.UserInfoAdapter");
                    oDeferred.reject(oError.message);
                }
            );

            return oDeferred.promise();
        };

        this._createWrapper = function (sBaseUrl) {
            return ODataWrapper.createODataWrapper(sBaseUrl, false, function (sError) { /*default error handler*/ });
        };

        /**
         * Sends the updated user attributes to the adapter.
         *
         *  @param {object} oUser User object
         *
         *  @returns {jQuery.Promise} Resolves once the preferences were updated.
         */
        this.updateUserPreferences = function (oUser) {
            Log.debug("[000] updateUserPreferences", "UserInfoAdapter");
            var that = this,
                oDeferred,
                sRelativeUrl,
                aUserChangedProperties,
                iODataRequestsRunning,
                oDataObj,
                fnSuccess = function () {
                    iODataRequestsRunning -= 1;
                    if (iODataRequestsRunning === 0) {
                        oDeferred.resolve();
                    }
                },
                fnFailure = function (sErrorMessage, oParsedErrorInformation) {
                    oDeferred.reject(sErrorMessage, oParsedErrorInformation);
                };
            Log.debug("[000] updateUserPreferences: _createWrapper", "UserInfoAdapter");
            oDataWrapper = this._createWrapper("/sap/opu/odata/UI2/INTEROP/");
            oDeferred = new jQuery.Deferred();

            // prepare
            Log.debug("[000] updateUserPreferences: oDataWrapper.openBatchQueue", "UserInfoAdapter");
            oDataWrapper.openBatchQueue();

            // put the preferences to update in the OData batch queue
            aUserChangedProperties = oUser.getChangedProperties() || [];
            Log.debug("[000] updateUserPreferences: getChangedProperties", "UserInfoAdapter");
            iODataRequestsRunning = aUserChangedProperties.length;
            aUserChangedProperties.forEach(function (oUserChangedProperty) {
                var name = oUserChangedProperty.name,
                    newValue = oUserChangedProperty.newValue;
                if (name.toUpperCase() === "LANGUAGE") {
                    name = "PREFERRED_LOGON_LANGUAGE";
                    newValue = newValue === DEFAULT_LANGUAGE_KEY ? undefined : newValue;
                }
                sRelativeUrl = "UserProfileProperties(" + [
                    "id='" + name + "'",
                    "shellType='FLP')"
                ].join(",");

                // the preference to update
                oDataObj = {
                    id: name,
                    shellType: "FLP",
                    value: newValue
                };
                //check for the datatype of the value & process oDataObj
                that._updateODataObjectBasedOnDatatype(newValue, oDataObj);
                Log.debug("[000] updateUserPreferences: oDataWrapper: put", "UserInfoAdapter");
                oDataWrapper.put(sRelativeUrl, oDataObj, fnSuccess, fnFailure);
            });
            Log.debug("[000] updateUserPreferences: submitBatchQueue", "UserInfoAdapter");
            // submit
            oDataWrapper.submitBatchQueue(function () {
                // request accepted but does not mean that the single requests
                // have been successfully resolved - see above
                if (iODataRequestsRunning === 0) {
                    oDeferred.resolve();
                }
            }, fnFailure);

            return oDeferred.promise();
        };
    };
});
