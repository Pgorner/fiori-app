// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Util module for ClientSideTargetResolution's tests
 */
sap.ui.define([
    "sap/base/util/deepExtend",
    "sap/base/util/extend",
    "sap/ushell/services/ClientSideTargetResolution/Formatter"
], function (deepExtend, extend, oFormatter) {
    "use strict";

    // the virtual inbounds defined in client side target resolution
    var A_VIRTUAL_INBOUNDS = [{
        action: "search",
        deviceTypes: {
            desktop: true,
            phone: true,
            tablet: true
        },
        hideIntentLink: true,
        resolutionResult: {
            additionalInformation: "SAPUI5.Component=sap.ushell.renderer.search.searchComponent",
            applicationType: "SAPUI5",
            loadCoreExt: true,
            loadDefaultDependencies: false,
            ui5ComponentName: "sap.ushell.renderer.search.searchComponent",
            url: sap.ui.require.toUrl("sap/ushell/renderer/search/searchComponent")
        },
        semanticObject: "Action",
        signature: {
            additionalParameters: "notallowed",
            parameters: {}
        }
    }, {
        // #FLPPageTemplate-manage used for CONF layer.
        // This virtual inbound will be removed if the PageComposer is ready to run in a standalone html.
        // The PageComposer as of now, is only supported on ABAP platform.
        // If this intent is called on non-abap platforms, a runtime error will occur as before.
        hideIntentLink: true, // don't show in getLinks
        semanticObject: "FLPPageTemplate",
        action: "manage",
        deviceTypes: {
            desktop: true, tablet: false, phone: false
        },
        signature: {
            parameters: {
                pageId: {
                    required: false,
                    defaultValue: { value: "" }
                },
                mode: {
                    required: false,
                    defaultValue: { value: "view" }
                }
            },
            additionalParameters: "notallowed"
        },
        resolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "nw.core.flp.pagecomposer.conf",
            additionalInformation: "SAPUI5.Component=nw.core.flp.pagecomposer.conf",
            url: "/sap/bc/ui5_ui5/sap/sui_paget_man",
            applicationDependencies: {
                manifest: "/sap/bc/lrep/content/apps/nw.core.flp.pagecomposer.conf/app/sap/sui_paget_man/manifest.appdescr",
                name: "nw.core.flp.pagecomposer.conf",
                self: {
                    name: "nw.core.flp.pagecomposer.conf",
                    url: "/sap/bc/ui5_ui5/sap/sui_paget_man"
                },
                asyncHints: {
                    libs: [{
                        name: "nw.core.flp.transport.cust",
                        url: { final: false, url: "/sap/bc/ui5_ui5/sap/sui_tr_cust" }
                    }]
                }
            },
            async: true,
            loadDefaultDependencies: false
        }
    }];

    /**
     * Used to create inbound
     *
     * To convert inbound to function call the following tool can be used: test/js/sap/ushell/tools/InboundFormatter.html
     *
     * @param {string} sInbound inbound string based on ClientSideTargetResolution/Formatter
     * @param {object} [oResolutionResult] resolution result which should be added in inbound
     * @param {object} [oExtraProperties] extra parameters which should be overwritten in created inbound
     *
     * @returns {object} inbound
     * @private
     */
    function createInbound (sInbound, oResolutionResult /* optional */, oExtraProperties /* optional */) {
        var oInbound = oFormatter.parseInbound(sInbound);
        oResolutionResult = oResolutionResult || {};

        oInbound.resolutionResult = deepExtend({}, oResolutionResult);

        if (oResolutionResult.hasOwnProperty("url") && oResolutionResult.url === undefined) {
            oInbound.resolutionResult.url = undefined;
        }

        deepExtend(oInbound, oExtraProperties || {});

        return oInbound;
    }

    function getLocalSystemAlias () {
        return {
            http: {
                id: "",
                host: "",
                port: 0,
                pathPrefix: "/sap/bc/"
            },
            https: {
                id: "",
                host: "",
                port: 0,
                pathPrefix: "/sap/bc/"
            },
            rfc: {},
            id: "",
            client: "",
            language: ""
        };
    }

    /**
     * Create a system alias based on the local system alias. In order to
     * overwrite some property use oExtraProperties.
     * @param {object} oExtraProperties contain the property which should be overwrite:
     *      - http
     *      - https
     *      - rfc
     *      - client
     *      - language
     *
     * @returns {object} new system alias
     * @private
     *
     */
    function createSystemAlias (oExtraProperties /* optional */) {
        return extend(getLocalSystemAlias(), oExtraProperties || {});
    }

    function createHttpConnection (host, port, pathPrefix) {
        return {
            id: "",
            host: host || "",
            port: port || 0,
            pathPrefix: pathPrefix || ""
        };
    }

    function createRfcConnection (systemId, host, service, loginGroup, sncNameR3, sncQoPR3) {
        return {
            id: "",
            systemId: systemId || "",
            host: host || "",
            service: service || 0,
            loginGroup: loginGroup || "",
            sncNameR3: sncNameR3 || "",
            sncQoPR3: sncQoPR3 || ""
        };
    }

    var testHelper = {};
    testHelper.createInbound = createInbound;
    testHelper.getVirtualInbounds = function () {
        return A_VIRTUAL_INBOUNDS;
    };
    testHelper.getLocalSystemAlias = getLocalSystemAlias;
    testHelper.createSystemAlias = createSystemAlias;
    testHelper.createHttpConnection = createHttpConnection;
    testHelper.createRfcConnection = createRfcConnection;

    return testHelper;
});
