// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file This module reads the "sap-ushell-xx-overwrite-config" query parameter from the URL
 * and generates an object out of it which can be merged with the ushell config.
 *
 * @private
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/util/ObjectPath"
], function (Log, ObjectPath) {
    "use strict";

    /*
     * Possible block list entries:
     *     - "a/b/c": [] --> a/b/c cannot be overwritten at all
     *     - "a/b/c": [ 1, 2 ] --> a/b/c cannot be overwritten with the values 1 or 2 but with any other value like 3
     */
    var oBlockList = {
        "renderers/fiori2/componentData/config/enablePersonalization": [true], // switch off only

        // Session handling
        "renderers/fiori2/componentData/config/sessionTimeoutReminderInMinutes": [],
        "renderers/fiori2/componentData/config/sessionTimeoutIntervalInMinutes": [],
        "renderers/fiori2/componentData/config/sessionTimeoutTileStopRefreshIntervalInMinutes": [],
        "renderers/fiori2/componentData/config/enableAutomaticSignout": [false], // switch on only

        // abap user must no be overwritten
        "services/Container/adapter/config/id": [], // user id
        "services/Container/adapter/config/firstName": [],
        "services/Container/adapter/config/lastName": [],
        "services/Container/adapter/config/fullName": [],

        // cdm user must no be overwritten
        "services/Container/adapter/config/userProfile/defaults/id": [], // user id
        "services/Container/adapter/config/userProfile/defaults/firstName": [],
        "services/Container/adapter/config/userProfile/defaults/lastName": [],
        "services/Container/adapter/config/userProfile/defaults/fullName": [],

        // The usageRecorder serviceUrl must not be overwritten for security reasons
        "services/NavTargetResolution/config/usageRecorder/serviceUrl": [],
        "services/NavTargetResolutionInternal/config/usageRecorder/serviceUrl": []
    };

    function isBlockListed (oConsideredBlockList, oEntry) {
        var sFullPropertyPath = "";

        if (oEntry.namespace) {
            sFullPropertyPath = oEntry.namespace + "/";
        }
        sFullPropertyPath += oEntry.propertyName;

        var aBlockListEntry = oConsideredBlockList[sFullPropertyPath];
        if (!aBlockListEntry) {
            return false;
        }

        if (Array.isArray(aBlockListEntry)) {
            if (aBlockListEntry.length === 0) {
                return true;
            }
            // check if the value is on the value block list
            for (var i = 0; i < aBlockListEntry.length; i++) {
                if (aBlockListEntry[i] === oEntry.value) {
                    return true;
                }
            }
            // the specified value is not on the block list
            return false;
        }

        throw new Error('Block list entry "' + sFullPropertyPath + '" has an unknown type');
    }

    function parseValue (sValue) {
        var nTempNumber;

        // booleans
        if (sValue === "false") {
            return false;
        }
        if (sValue === "true") {
            return true;
        }

        // numbers
        nTempNumber = Number.parseFloat(sValue);
        if (!Number.isNaN(nTempNumber)) {
            return nTempNumber;
        }

        // just a string
        return sValue;
    }

    /*
     * Example usages of "sap-ushell-xx-overwrite-config":
     *   ?sap-ushell-xx-overwrite-config=renderers/fiori2/componentData/config/enablePersonalization:false
     *   ?sap-ushell-xx-overwrite-config=ushell/spaces/enabled:false,ushell/spaces/configurable:false
     *   ?sap-ushell-xx-overwrite-config=startupConfig/spacesMyhome:false,ushell/homeApp/component:false
     *   ?sap-ushell-xx-overwrite-config=
     *   ushell/companyLogo/url:data\:image/png;base64\,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==
     */
    function getConfigFromWindowLocation (oWindowLocation) {
        var aParsedQueryParamValue;
        var oFinalConfig = {};
        // to conform with the specification of the query string ("application/x-www-form-urlencoded")
        // see: https://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
        var sQueryString = oWindowLocation.search.replaceAll("+", " ");

        // find the parameter value
        aParsedQueryParamValue = /[?&]sap-ushell-xx-overwrite-config=([^&]*)(&|$)/.exec(sQueryString);
        if (aParsedQueryParamValue === null) {
            return {};
        }

        // commas (",") can be used to overwrite multiple "parameter:value" pairs at the same time
        // the negative lookbehind is to allow commas to be escaped with a backslash ("\")
        var aOverwrittenEntryCandidates = decodeURIComponent(aParsedQueryParamValue[1])
            .split(/(?<!\\),/)
            .map((sOverwrittenEntryCandidate) => sOverwrittenEntryCandidate.replaceAll("\\,", ","));

        var aOverwrittenEntries = aOverwrittenEntryCandidates.reduce(function (aEntries, sCandidate) {
            // a colon (":") is used to separate each parameter from its value within each "parameter:value" pair
            // the negative lookbehind is to allow colons to be escaped with a backslash ("\")
            var aParts = sCandidate
                .split(/(?<!\\):/)
                .map((sPart) => sPart.replaceAll("\\:", ":"));

            // namespaces may contain a leading "/" (e.g. for "sap-ui-debug")
            var aNamespaceParts = /^\/?(.*)\/([^/]*)$/.exec(aParts[0]);
            if (aNamespaceParts === null) {
                Log.warning('Ignoring invalid parameter for "sap-ushell-xx-overwrite-config": "' + aParts[0] + '"');
                return aEntries;
            }

            var oEntry = {
                namespace: aNamespaceParts[1],
                propertyName: aNamespaceParts[2],
                value: parseValue(aParts[1])
            };

            if (isBlockListed(oBlockList, oEntry)) {
                Log.warning('Ignoring restricted parameter for "sap-ushell-xx-overwrite-config": "' + aParts[0] + '"');
                return aEntries;
            }

            aEntries.push(oEntry);
            return aEntries;
        }, []);

        // convert entries to config
        aOverwrittenEntries.forEach(function (oOverwrite) {
            var vValue = oOverwrite.value;
            var sNamespace = oOverwrite.namespace.replace(/\//g, ".");
            var oNamespace = ObjectPath.get(sNamespace, oFinalConfig);

            if (oNamespace === undefined) {
                // create namespace as not existing yet
                ObjectPath.set(sNamespace, {}, oFinalConfig);
                oNamespace = ObjectPath.get(sNamespace, oFinalConfig);
            }

            oNamespace[oOverwrite.propertyName] = vValue;
        });

        return oFinalConfig;
    }

    return {
        getConfig: getConfigFromWindowLocation.bind(null, window.location),
        _getConfigFromWindowLocation: getConfigFromWindowLocation,
        _isBlockListed: isBlockListed
    };
});
