// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview resolves references
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/i18n/Formatting",
    "sap/base/util/deepExtend",
    "sap/base/util/isEmptyObject",
    "sap/ui/core/CalendarType",
    "sap/ui/core/Lib",
    "sap/ui/core/Supportability",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/odata/ODataUtils",
    "sap/ui/model/odata/v4/ODataUtils",
    "sap/ushell/User",
    "sap/ushell/utils",
    "sap/ushell/Container"
], function (
    Log,
    Formatting,
    deepExtend,
    isEmptyObject,
    CalendarType,
    Library,
    Supportability,
    DateFormat,
    ODataUtilsV2,
    ODataUtilsV4,
    User,
    ushellUtils,
    Container
) {
    "use strict";

    const sModuleName = "sap.ushell.services.ReferenceResolver";

    function UserEnvReferenceResolver () {
        /**
         * Resolves the value of the given user env reference.
         *
         * @param {string} sReference
         *    A reference name like <code>User.env.sap-theme</code>
         * @returns {Promise<{value: string}>}
         *    A promise that is always resolved.
         *    resolved, the promise resolves with a rich object like:
         *    <pre>
         *    { value: "some value" }
         *    </pre>
         *    . Otherwise, the promise resolves with an empty object.
         *
         *    The values this resolves to is a string value,which may be undefined
         *    sap-ui-legacy-date-format a value of Domain XUDATFM "1"|"2"|.."9"|"A"|"B"|"C" or undefined
         *    sap-ui-legacy-time-format a value of Domain XUTIMFM "0"|"1"|"2"|"3"|"4"| or undefined
         *    sap-ui-legacy-number-format a value of Domain XUCPFM " "|"X"|"X" or undefined
         *    (for these three, undefined should not occur within a Fiori Launchpad instance,this would indicate a lacking configuration of the UI5 core).
         *
         *    sap-language:      Two character code representing a SAP Logon language code
         *    sap-languagebcp47: A bcp47 language/locale setting (e.g "en-GB")
         *    sap-accessibility: "X" or undefined        (Note: no "false", " " or similar returned, if falsy, return undefined indicating parameter should not be filled on propagation!)
         *    sap-statistics:    "true" or undefined     (Note: no "false" or similar returned! return undefined indicating parameter should not be filled on propagation(
         *
         *    a return value of undefined indicates the parameter should not be added to the url/appstate or similar!
         *
         * @private
         * @since 1.42.0
         */
        this.getValue = async function (sReference) {
            let sValue;

            if (sReference === "User.env.sap-ui-legacy-date-format") {
                sValue = Formatting.getABAPDateFormat();
            }
            if (sReference === "User.env.sap-ui-legacy-number-format") {
                sValue = Formatting.getABAPNumberFormat();
            }
            if (sReference === "User.env.sap-ui-legacy-time-format") {
                sValue = Formatting.getABAPTimeFormat();
            }
            if (sReference === "User.env.sap-language") {
                sValue = Container.getUser().getLanguage();
            }
            if (sReference === "User.env.sap-languagebcp47") {
                sValue = Container.getUser().getLanguageBcp47();
            }
            if (sReference === "User.env.sap-accessibility") {
                sValue = (Container.getUser().getAccessibilityMode()) ? "X" : undefined;
            }
            if (sReference === "User.env.sap-statistics") {
                sValue = (Supportability.isStatisticsEnabled()) ? "true" : undefined;
            }
            if (sReference === "User.env.sap-theme") {
                sValue = Container.getUser().getTheme(User.prototype.constants.themeFormat.THEME_NAME_PLUS_URL);
            }
            if (sReference === "User.env.sap-theme-name") {
                sValue = Container.getUser().getTheme();
            }
            if (sReference === "User.env.sap-theme-NWBC") {
                sValue = Container.getUser().getTheme(User.prototype.constants.themeFormat.NWBC);
            }

            return { value: sValue };
        };
    }

    /**
     * @alias sap.ushell.services.ReferenceResolver
     * @class
     * @classdesc The Unified Shell's ReferenceResolver service.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call
     * <code>Container.getServiceAsync("ReferenceResolver")</code>. For details, see
     * {@link sap.ushell.Container#getServiceAsync}.
     *
     * @hideconstructor
     *
     * @since 1.42.0
     * @private
     */
    function ReferenceResolver (oContainerInterface, sParameter, oConfig) {
        /**
         * Returns an instance of UserEnvReferenceResolver.
         *
         * @returns {object}
         *    An instance of UserEnvReferenceResolver. The instance is created
         *    only once and stored in this service. This method should be called
         *    at the time the instance is used to avoid creating the instance
         *    if not required.
         *
         * @private
         * @since 1.42.0
         */
        this._getUserEnvReferenceResolver = function () {
            if (!this.oUserEnvReferenceResolver) {
                this.oUserEnvReferenceResolver = new UserEnvReferenceResolver();
            }
            return this.oUserEnvReferenceResolver;
        };

        /**
         * This resolves (finds the value of) all the given reference names.
         *
         * @param {string[]} aReferences
         *    An array of reference names, like <code>["UserDefault.currency", "User.env.sap-theme-name"... ]</code>.
         * @param {object} [oSystemContext] The systemContext
         * @returns {Promise<object>}
         *    <p>A promise that resolves with an object containing all the
         *    resolved references, or is rejected with an error message if it
         *    was not possible to resolve all the references.</p>
         *
         *    <p>The object this promise resolves to maps the full (with prefix)
         *    reference name to its value:</p>
         *    <pre>
         *    {
         *        UserDefault.currency: "EUR",
         *        User.env.sap-theme-name: "sap-belize"
         *        ...
         *    }
         *    </pre>
         *
         * @private
         * @since 1.42.0
         */
        this.resolveReferences = async function (aReferences, oSystemContext) {
            const aReferencePromises = [];
            let bAllRefsResolvable = true;
            const oDistinctRefs = {};
            const oDistinctEnvRefs = {};

            const aRichRefs = aReferences
                .map((sRefWithPrefix) => {
                    let sRefName;

                    if (sRefWithPrefix.indexOf("User.env.") === 0) {
                        sRefName = sRefWithPrefix;
                        oDistinctEnvRefs[sRefName] = 1;
                    }
                    if (sRefWithPrefix.indexOf("UserDefault.") === 0) {
                        sRefName = this._extractAnyUserDefaultReferenceName(sRefWithPrefix);
                        oDistinctRefs[sRefName] = 1;
                    }

                    if (typeof sRefName !== "string") {
                        bAllRefsResolvable = false;
                        Log.error(`'${ sRefWithPrefix }' is not a legal reference name`, null, sModuleName);
                    }
                    return {
                        full: sRefWithPrefix,
                        name: sRefName
                    };
                });

            if (!bAllRefsResolvable) {
                throw new Error("One or more references could not be resolved");
            }

            if (!oSystemContext) {
                const ClientSideTargetResolution = await Container.getServiceAsync("ClientSideTargetResolution");
                oSystemContext = await ClientSideTargetResolution.getSystemContext();
            }

            const UserDefaultParameters = await Container.getServiceAsync("UserDefaultParameters");



            Object.keys(oDistinctRefs).forEach((sName) => {
                aReferencePromises.push(UserDefaultParameters.getValue(sName, oSystemContext));
            });

            const oUserEnvResolver = this._getUserEnvReferenceResolver();
            Object.keys(oDistinctEnvRefs).forEach((sName) => {
                aReferencePromises.push(oUserEnvResolver.getValue(sName));
            });

            const aRefValues = await Promise.all(aReferencePromises);

            const oKnownRefs = {};
            let iIndex = 0;
            Object.keys(oDistinctRefs).forEach((sName) => {
                oDistinctRefs[sName] = aRefValues[iIndex];
                iIndex = iIndex + 1;
            });
            Object.keys(oDistinctEnvRefs).forEach((sName) => {
                oDistinctEnvRefs[sName] = aRefValues[iIndex];
                iIndex = iIndex + 1;
            });

            // All parameters retrieved successfully and stored in arguments.
            aRichRefs.forEach((oRef) => {
                let oMergedValue;
                if (oRef.full.indexOf("UserDefault.extended.") === 0) {
                    oMergedValue = this.mergeSimpleAndExtended(oDistinctRefs[oRef.name]);
                    if (!isEmptyObject(oMergedValue)) {
                        oKnownRefs[oRef.full] = oMergedValue;
                    } else {
                        // even if no value is provided, the property must exist to indicate that the
                        // reference could be resolved
                        oKnownRefs[oRef.full] = undefined;
                    }
                } else if (oRef.full.indexOf("UserDefault.") === 0) {
                    oKnownRefs[oRef.full] = oDistinctRefs[oRef.name].value;
                } else if (oRef.full.indexOf("User.env.") === 0) {
                    oKnownRefs[oRef.full] = oDistinctEnvRefs[oRef.name].value;
                } // one of the above branches must have been hit, there can be no else here,
                // else  { assert(0); }
            });

            return oKnownRefs;
        };

        /**
         * Extracts the name of a full reference parameter.
         * For example, returns <code>value</code> from
         * <code>UserDefault.value</code> or <code>UserDefault.extended.value</code>.
         *
         * @param {string} sRefParamName
         *    Name of a full reference parameter
         * @returns {string}
         *    The name of the reference parameter extracted from
         *    sRefParamName, or undefined in case this cannot be extracted.
         *
         * @private
         * @since 1.42.0
         */
        this._extractAnyUserDefaultReferenceName = function (sRefParamName) {
            const sParamName = this.extractExtendedUserDefaultReferenceName(sRefParamName);
            if (typeof sParamName === "string") {
                return sParamName;
            }
            return this.extractUserDefaultReferenceName(sRefParamName);
        };

        /**
         * Extracts an extended user default reference name from a reference parameter
         * name. For example, returns <code>value</code> from
         * <code>UserDefault.extended.value</code>, but returns <code>undefined</code>
         * for <code>UserDefault.value</code>.
         *
         * @param {string} sRefParamName
         *    Name of a reference parameter
         * @returns {string}
         *    The name of the user default parameter extracted from
         *    sRefParamName, or undefined in case this cannot be extracted.
         *
         * @private
         * @since 1.42.0
         */
        this.extractExtendedUserDefaultReferenceName = function (sRefParamName) {
            if (typeof sRefParamName !== "string" || sRefParamName.indexOf("UserDefault.extended.") !== 0) {
                return undefined;
            }
            return sRefParamName.replace(/^UserDefault[.]extended[.]/, "");
        };

        /**
         * Extracts the user default reference name from a reference parameter
         * name. For example, returns <code>value</code> from
         * <code>UserDefault.value</code>, but returns <code>undefined</code>
         * for <code>MachineDefault.value</code> or <code>UserDefault.extended.value</code>.
         *
         * @param {string} sRefParamName
         *    Name of a reference parameter
         * @returns {string}
         *    The name of the user default parameter extracted from
         *    sRefParamName, or undefined in case this cannot be extracted.
         *
         * @private
         * @since 1.42.0
         */
        this.extractUserDefaultReferenceName = function (sRefParamName) {
            if (typeof sRefParamName !== "string"
                || sRefParamName.indexOf("UserDefault.") !== 0
                || sRefParamName.indexOf("UserDefault.extended.") === 0) {
                return undefined;
            }
            return sRefParamName.replace(/^UserDefault[.]/, "");
        };

        /**
         * Merges a simple user default value (if present) and the extended value object into a new object.
         * A simple value will even be converted if no extended value is present.
         *
         * @param {object} oValueObject
         *  The value object as returned by {@link sap.ushell.services.UserDefaultParameters#getValue}.
         * @returns {object}
         *  The new object containing the merged values. If no values are present, an empty object is returned.
         * @private
         * @since 1.42.0
         */
        this.mergeSimpleAndExtended = function (oValueObject) {
            const oMergedExtendedObject = deepExtend({}, oValueObject.extendedValue);
            if (typeof oValueObject.value === "string") {
                if (!Array.isArray(oMergedExtendedObject.Ranges)) {
                    oMergedExtendedObject.Ranges = [];
                }
                // add simple value as range
                oMergedExtendedObject.Ranges.push({ Sign: "I", Option: "EQ", Low: oValueObject.value, High: null });
            }
            return oMergedExtendedObject;
        };

        /**
         * finds all references in sUrl and returns their edmTypes (if known) and names
         * @param {string} sUrl
         *  Url containing references like
         *  /some/url/?param1={Edm.String%%UserDefault.CompanyCode%%}&param2={Edm.String%%ABC%%}&param2={%%Test%%}
         * @returns {Array<{ edmType: string, name: string }>}
         *  array of all found reference edmTypes and names like
         *  <pre>
         *  [
         *      {
         *          edmType: "Edm.String",
         *          name: "UserDefault.CompanyCode",
         *      },
         *      {
         *          edmType: "Edm.String",
         *          name: "ABC",
         *      },
         *      {
         *          name: "Test",
         *      }
         *  ]
         *  </pre>
         *
         * @private
         */
        function findReferences (sUrl) {
            const reReferenceNames = /{([^}%]*%%[^%]+%%)}?/g;
            const reGetEdmType = /([^%]*)%%/;
            const reGetName = /%%([^%]+)%%/;
            const aFoundReferences = [];

            // search and collect all found references user default references in the URL
            let oCurrentMatch = reReferenceNames.exec(sUrl);
            while (oCurrentMatch) {
                const oCurrentEdmType = reGetEdmType.exec(oCurrentMatch[1]);
                const oCurrentName = reGetName.exec(oCurrentMatch[1]);

                aFoundReferences.push({ edmType: oCurrentEdmType[1], name: oCurrentName[1] });

                oCurrentMatch = reReferenceNames.exec(sUrl);
            }

            return aFoundReferences;
        }

        /**
         * Extracts parameters of the pattern {Edm.<type>%%<placeholder>%%} out of a given URL
         *
         * @param {string} sUrl
         * The given URL with placeholders
         * @param {string} sFilterRegex
         * The regex for filtering based on the given placeholder type (e.g. DynamicDate, UserDefault)
         * @returns {object}
         * An object containing the extracted and the ignored references
         * @private
         * @since 1.110.0
         */
        this._extractUrlPlaceholders = function (sUrl, sFilterRegex) {
            let oUrl,
             aReferences;
            const aIgnoredReferences = [];

            /*
             * A typical oDataV2 call:
             *
             * https://services.odata.org/OData/OData.svc/Category(1)/Products?$top=2&$orderby=name
             * _________________________________________/ ___________________/ ___________________/
             *                    |                               |                    |
             *             service root URI                 resource path        query options
             *
             * Only the last two parts are allowed to have placeholders in them.
             * If the 2nd part has placeholders in it, it uses them inside of brackets.
             * If the 3rd part has placeholders in it, it has a question mark in front.
             * Normal service root URIs don't use brackets or question marks.
             */

            // checking if the service root URI contains any placeholders. These will lead to ignored references.
            oUrl = /[^(?]*/.exec(sUrl);
            aReferences = (oUrl === null) ? [] : findReferences(oUrl[0]);

            aReferences.forEach((oReference) => {
                aIgnoredReferences.push(oReference.name);
            });

            // checking if the resource path or the query path have placeholders. These will be resolved.
            oUrl = /[(?][^]*/.exec(sUrl);
            aReferences = (oUrl === null) ? [] : findReferences(oUrl[0]);

            const aExtractedReferences = aReferences.filter((oReference) => {
                const sReferenceName = oReference.name;

                if (sFilterRegex.test(sReferenceName)) {
                    return true;
                }

                aIgnoredReferences.push(sReferenceName);
                return false;
            });

            return {
                extractedReferences: aExtractedReferences,
                ignoredReferences: aIgnoredReferences
            };
        };

        /**
         * Replace parameters of the pattern {Edm.<type>%%<placeholder>%%} with the given values in a given URL
         *
         * @param {string} sUrl
         * The given URL with placeholders
         * @param {object[]} aResolvedPlaceholders
         * An array of objects containing the previously extracted placeholders with the determined value
         * @param {boolean} [bODataV4=false]
         * Format values according to ODataV4 if this flag is set to true
         * @returns {object}
         * An object containing the resolved URL and an array of placeholders without value
         * @private
         * @since 1.110.0
         */
        this._replaceUrlPlaceholders = function (sUrl, aResolvedPlaceholders, bODataV4) {
            let sResolvedUrl = sUrl;
            const aPlaceholdersWithoutValue = [];
            const fnFormatODataValue = bODataV4 ? ODataUtilsV4.formatLiteral.bind(ODataUtilsV4) : ODataUtilsV2.formatValue.bind(ODataUtilsV2);

            aResolvedPlaceholders.forEach((oResolvedPlaceholder) => {
                const sDefaultName = oResolvedPlaceholder.name;
                let sOldResolvedUrl = null;
                let bPlaceholderWithoutValue = false;

                // incase the reference is present multiple times (replace all)
                while (sOldResolvedUrl !== sResolvedUrl) {
                    sOldResolvedUrl = sResolvedUrl;

                    if (oResolvedPlaceholder.value !== undefined) {
                        // replace the references with the actual value, encoding is required

                        const sFormattedValue = fnFormatODataValue(oResolvedPlaceholder.value, oResolvedPlaceholder.edmType);

                        sResolvedUrl = sResolvedUrl.replace(`{${ oResolvedPlaceholder.edmType }%%${ sDefaultName }%%}`,
                            window.encodeURIComponent(sFormattedValue));
                    } else {
                        bPlaceholderWithoutValue = true;
                        sResolvedUrl = sResolvedUrl.replace(`{${ oResolvedPlaceholder.edmType }%%${ sDefaultName }%%}`, "");
                    }
                }

                if (bPlaceholderWithoutValue) {
                    aPlaceholdersWithoutValue.push(sDefaultName);
                }
            });

            return {
                resolvedUrl: sResolvedUrl,
                placeholdersWithoutValue: aPlaceholdersWithoutValue
            };
        };

        /**
         * Resolves Simple User Default Parameter references within the given URL with
         * the users default values. In case the user maintained a value,
         * it is injected (encoded). In case there is no value maintained
         * the value will be empty.
         *
         * @param  {string} sUrl
         *  URL containing User Default parameter names like
         *  /some/url/?param1={%%UserDefault.CompanyCode%%}&param2={Edm.String%%UserDefault.CostCenter%%}&param3={%%abc%%}
         * @param {object} [oSystemContext] The systemContext
         * @returns {Promise<object>} Resolves an Object
         *  like:
         *  <pre>
         *  {
         *      url: "/some/url/?param1=1100&param2=&param3={%%abc%%}", // url with resolved User Default parameters like
         *      defaultsWithoutValue: ["UserDefault.CostCenter"], // simple user default which do not have a value
         *      ignoredReferences: ["abc"] // references which are not simple User Defaults
         *  }
         *  </pre>
         *  <p>
         *  In case there is not a value maintained for a simple User Default Reference,
         *  the value becomes an empty ("param2={Edm.String%%UserDefault.CostCenter%%}" becomes "param2=").
         *  In case a reference is not a simple User Default, it stays unchanged in
         *  the returned URL ("param3={%%abc%%}" stays unchanged)
         *
         * @private
         */
        this.resolveUserDefaultParameters = async function (sUrl, oSystemContext) {

            const oPlaceholders = this._extractUrlPlaceholders(sUrl, /^UserDefault\.(?!extended\.).+/);
            const aSimpleUserDefaultReferences = oPlaceholders.extractedReferences;
            const aIgnoredReferences = oPlaceholders.ignoredReferences;

            if (aSimpleUserDefaultReferences.length === 0) {
                return {
                    url: sUrl,
                    defaultsWithoutValue: [],
                    ignoredReferences: aIgnoredReferences
                };
            }

            const aReferenceNames = aSimpleUserDefaultReferences.map((oReference) => {
                return oReference.name;
            });

            const oResolvedDefaults = await this.resolveReferences(aReferenceNames, oSystemContext);

            aSimpleUserDefaultReferences.forEach((oPlaceholder) => {
                oPlaceholder.value = oResolvedDefaults[oPlaceholder.name];
            });
            const oReplacementResult = this._replaceUrlPlaceholders(sUrl, aSimpleUserDefaultReferences);

            return {
                url: oReplacementResult.resolvedUrl,
                defaultsWithoutValue: oReplacementResult.placeholdersWithoutValue,
                ignoredReferences: aIgnoredReferences
            };

        };

        /**
         * Loads the Dynamic Date Range und its prerequisite, the unified library.
         * @returns {Promise} Promise that resolves with the Dynamic Date Range.
         */
        this._loadDynamicDateRange = async function () {
            await Library.load("sap.ui.unified");

            const [ DynamicDateRange ] = await ushellUtils.requireAsync(["sap/m/DynamicDateRange"]);

            return DynamicDateRange;
        };

        /**
         * The regex to identify semantic date range placeholders.
         */
        this._rSemanticDateRangeRegex = /^DynamicDate\..+/;

        /**
         * Resolves semantic date range parameters within the given URL.
         *
         * The parameters have the following pattern: {Edm.<type>%%DynamicDate.<operator>.<value1>.<value2>.<position>%%} which can be contained in a URL.
         * Examples:
         * /some/url/$count?$filter=(PostingDate eq {Edm.String%%DynamicDate.YESTERDAY%%})
         * /some/url/$count?$filter=(ClearingDate ge {Edm.DateTimeOffset%%DynamicDate.YESTERDAY.start%%} and ClearingDate le {Edm.DateTimeOffset%%DynamicDate.YESTERDAY.end%%})
         * /some/url/$count?$filter=(ValidityEndDateForEdit ge {Edm.DateTime%%DynamicDate.NEXTDAYS.5.start%%} and ValidityEndDateForEdit le {Edm.DateTime%%DynamicDate.NEXTDAYS.5.end%%})
         * /some/url/$count?$filter=(ValidityEndDateForEdit ge {Edm.DateTime%%DynamicDate.TODAYFROMTO.1.5.start%%} and ValidityEndDateForEdit le {Edm.DateTime%%DynamicDate.TODAYFROMTO.1.5.end%%})
         *
         * Supported EdmTypes are:
         * Edm.String (OData V2 only)
         * Edm.DateTime (OData V2 only)
         * Edm.DateTimeOffset
         * Edm.Date (OData V4 only)
         *
         * <operator>: Supported operators are those of {@link sap.m.DynamicDateUtil#getStandardKeys}, e.g. TODAY, YESTERDAY, TODAYFROMTO
         * <value1> and <value2>: The start and end values of date range operators
         * <position>: Marks the start or end of a date range.
         *
         * @param {string} sUrl
         * URL containing semantic date range parameters like YESTERDAY or THISYEAR
         * @param {string} sODataVersion
         * The services's OData version. Used to format values according to the specified version.
         * Only relevant if Semantic Date Ranges are actually found in the URL.
         * Valid values are "2.0" and "4.0".
         * @returns {Promise<object>}
         * The returned object has the following properties:
         * <ul>
         * <li> url: The URL with the resolved semantic date ranges or the original URL if it didn't contain any semantic date ranges
         * <li> hasSemanticDateRanges: The info if semantic date ranges were found at all
         * <li> invalidSemanticDateRanges: Semantic date ranges that are specified incorrectly
         * <li> ignoredReferences: References that are no semantic date ranges
         * <ul>
         *
         * Example:
         * <pre>
         * {
         *     url: "/some/url/$count?$filter=(PostingDate eq '20221204')", // url with resolved semantic date ranges
         *     hasSemanticDateRanges: true, // the URL contains semantic date ranges
         *     invalidSemanticDates: ["DynamicDate.UNKNOWN"], // semantic date range with invalid definition
         *     ignoredReferences: ["abc"] // references which are not semantic date ranges
         * }
         * </pre>
         *
         * @private
         * @since 1.110.0
         */
        this.resolveSemanticDateRanges = async function (sUrl, sODataVersion) {
            const oPlaceholders = this._extractUrlPlaceholders(sUrl, this._rSemanticDateRangeRegex);
            const aSemanticDateRangeReferences = oPlaceholders.extractedReferences;
            const aIgnoredReferences = oPlaceholders.ignoredReferences;

            if (aSemanticDateRangeReferences.length === 0) {
                return {
                    url: sUrl,
                    hasSemanticDateRanges: false,
                    invalidSemanticDates: [],
                    ignoredReferences: aIgnoredReferences
                };
            }

            const aValidODataVersions = ["2.0", "4.0"];
            if (!sODataVersion || !aValidODataVersions.includes(sODataVersion)) {
                throw new Error(`Invalid OData version: ${ sODataVersion}`);
            }
            const bODataV4 = sODataVersion === "4.0";

            const aSemanticDateRanges = await this._resolveSemanticDateRanges(aSemanticDateRangeReferences, bODataV4);

            const oReplacementResult = this._replaceUrlPlaceholders(sUrl, aSemanticDateRanges, bODataV4);

            if (Log.getLevel() >= Log.Level.DEBUG) {
                const aResolvedSemanticDateRanges = aSemanticDateRanges.filter((oElement) => {
                    return "value" in oElement;
                });
                Log.debug(
                    "Resolving semantic date ranges \n" +
                    `- OData Version: ${ sODataVersion }\n` +
                    `- URL: ${ sUrl }\n` +
                    `- ignoring references: ${ JSON.stringify(aIgnoredReferences, null, 4) }\n` +
                    `- resolved semantic date ranges: ${ JSON.stringify(aResolvedSemanticDateRanges, null, 4) }\n` +
                    `- invalid semantic date ranges:${ JSON.stringify(oReplacementResult.placeholdersWithoutValue, null, 4) }\n` +
                    `- final URL: ${ oReplacementResult.resolvedUrl}`, null, sModuleName);
            }

            return {
                url: oReplacementResult.resolvedUrl,
                hasSemanticDateRanges: aSemanticDateRangeReferences.length > 0,
                invalidSemanticDates: oReplacementResult.placeholdersWithoutValue,
                ignoredReferences: aIgnoredReferences
            };
        };

        /**
         * Resolves semantic date ranges into concrete dates for their given EdmType.
         *
         * @param {object[]} aSemanticDateRanges
         * An array of semantic date ranges to resolve with name and EdmType
         * @param {boolean} [bODataV4=false]
         * Format values according to ODataV4 if this flag is set to true
         * @returns {Promise<object[]>} A promise that resolves with an array containing the resolved semantic date ranges
         * @private
         * @since 1.110.0
         */
        this._resolveSemanticDateRanges = async function (aSemanticDateRanges, bODataV4) {
            const oDateTimeFormatters = this._getDateTimeFormatters();
            // must be required dynamically because of a dependency to sap.ui.unified
            const DynamicDateRange = await this._loadDynamicDateRange();

            return aSemanticDateRanges.map((oSemanticDate) => {
                const oResult = {
                    name: oSemanticDate.name,
                    edmType: oSemanticDate.edmType
                };
                const aSemanticDate = oSemanticDate.name.split(".");

                /*
                    * Analyze the semantic date. It can have 2 - 5 parts, depending on the operator and the usage in the OData request.
                    * Examples:
                    * - DynamicDate.YESTERDAY
                    * - DynamicDate.YESTERDAY.start
                    * - DynamicDate.NEXTDAYS.5.start
                    * - DynamicDate.TODAYFROMTO.1.5.start
                    */

                const oDateValue = {
                    operator: aSemanticDate[1],
                    values: []
                };
                let sPosition;

                if (aSemanticDate.length === 3) {
                    sPosition = aSemanticDate[2];
                } else if (aSemanticDate.length === 4) {
                    oDateValue.values.push(aSemanticDate[2]);
                    sPosition = aSemanticDate[3];
                } else if (aSemanticDate.length === 5) {
                    oDateValue.values = aSemanticDate.slice(2, 4);
                    sPosition = aSemanticDate[4];
                }

                let aDynamicDate;
                try {
                    aDynamicDate = DynamicDateRange.toDates(oDateValue);
                } catch (error) {
                    return oResult;
                }

                if (aSemanticDate.length >= 3 && sPosition !== "start" && sPosition !== "end") {
                    return oResult;
                }

                let oDate;
                if (sPosition === "end") {
                    oDate = aDynamicDate[1];
                } else {
                    oDate = aDynamicDate[0];
                }
                if (!oDate) {
                    return oResult;
                }

                switch (oSemanticDate.edmType) {
                    case "Edm.String":
                        oResult.value = oDateTimeFormatters.string.format(oDate);
                        break;
                    case "Edm.Date":
                        // This is an OData V4 only type
                        // The OData V4 formatter doesn't do any formatting for date so it is done here
                        oResult.value = oDateTimeFormatters.date.format(oDate);
                        break;
                    case "Edm.DateTime":
                        // The OData formatter that is used later on converts the date object's UTC time to an OData string
                        // Therefore set the UTC date to the local date
                        oDate.setUTCFullYear(oDate.getFullYear(), oDate.getMonth(), oDate.getDate());
                        oDate.setUTCHours(0, 0, 0, 0);
                        oResult.value = oDate;
                        break;
                    case "Edm.DateTimeOffset":
                        if (bODataV4) {
                            // The OData V4 formatter doesn't do any formatting for datetimeoffset so it is done here
                            oResult.value = oDateTimeFormatters.dateTimeOffsetV4.format(oDate, true);
                        } else {
                            // The OData formatter converts the date object's UTC time to an OData string
                            oResult.value = oDate;
                        }
                        break;
                    default:
                        break;
                }

                return oResult;
            });
        };

        /**
         * Returns date time formatters for different OData formats.
         *
         * @returns {object}
         * The date time formatters
         * @private
         * @since 1.110.0
         */
        this._getDateTimeFormatters = function () {
            if (!this._oDateTimeFormatters) {
                this._oDateTimeFormatters = {
                    string: DateFormat.getDateInstance({
                        pattern: "yyyyMMdd",
                        calendarType: CalendarType.Gregorian
                    }),
                    date: DateFormat.getDateInstance({
                        pattern: "yyyy-MM-dd",
                        calendarType: CalendarType.Gregorian
                    }),
                    dateTimeOffsetV4: DateFormat.getDateInstance({
                        pattern: "yyyy-MM-dd'T'HH:mm:ss'.'SSS'Z'",
                        calendarType: CalendarType.Gregorian
                    })
                };
            }

            return this._oDateTimeFormatters;
        };

        /**
         * Checks if a URL contains semantic date range placeholders
         *
         * @param {string} sUrl
         *   A URL
         * @returns {boolean}
         *   Returns true if the URL contains semantic date range placeholders
         *
         * @private
         * @since 1.112.0
         */
        this.hasSemanticDateRanges = function (sUrl) {
            const oPlaceholders = this._extractUrlPlaceholders(sUrl, this._rSemanticDateRangeRegex);
            return oPlaceholders.extractedReferences.length > 0;
        };
    }

    ReferenceResolver.hasNoAdapter = true;
    return ReferenceResolver;
}, true /* bExport */);
