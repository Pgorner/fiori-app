// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/base/Log"
], function (
    Log
) {
    "use strict";

    class BlueBoxesCache {
        #oActiveApplicationContainers = {};
        #oApplicationContainerPool = {};

        constructor () {
            this.init();
        }

        init () {
            // this contains THE statefulContainer for a system+client+technology
            // ...and keepAlive iframes
            this.#oActiveApplicationContainers = {};
            // this contains unused iframes for future reuse
            this.#oApplicationContainerPool = {};
        }

        getLength () {
            return Object.keys(this.#oActiveApplicationContainers).length;
        }

        getPoolLength () {
            return Object.values(this.#oApplicationContainerPool).reduce((iCount, oPool) => {
                return iCount + oPool.length;
            }, 0);
        }

        add (sUrl, oApplicationContainer) {
            var sKey = this.getKeyFromUrl(sUrl);
            this.#oActiveApplicationContainers[sKey] = {
                container: oApplicationContainer,
                key: sKey
            };
        }

        /**
         * @param {object} oApplicationContainer
         * @returns {boolean} true if the iframe was moved to the pool, false if it is used as stateful container.
         */
        moveKeepAliveToPool (oApplicationContainer) {
            if (!oApplicationContainer) {
                return false;
            }

            this.removeByContainer(oApplicationContainer);
            const sNewUrl = oApplicationContainer.getCurrentAppUrl().replaceAll("sap-keep-alive", "sap-temp");
            const sNewKey = this.getKeyFromUrl(sNewUrl);

            // priority 1: use iframe as current stateful container
            if (!this.#oActiveApplicationContainers[sNewKey]) {
                this.add(sNewUrl, oApplicationContainer);
                return false;
            }

            // priority 2: add iframe to pool
            if (!this.#oApplicationContainerPool[(sNewKey)]) {
                this.#oApplicationContainerPool[sNewKey] = [];
            }
            this.#oApplicationContainerPool[sNewKey].push(oApplicationContainer);
            return true;
        }

        remove (sUrl) {
            if (!sUrl) {
                return;
            }

            var sKey = this.getKeyFromUrl(sUrl);
            if (this.#oActiveApplicationContainers[sKey]) {
                delete this.#oActiveApplicationContainers[sKey];
            }
        }

        removeByContainer (oApplicationContainer) {
            if (!oApplicationContainer) {
                return;
            }

            // remove from active containers
            const oEntry = this.#getByContainer(oApplicationContainer);
            if (oEntry) {
                delete this.#oActiveApplicationContainers[oEntry.key];
            }

            // todo: [FLPCOREANDUX-10024]: is this a real scenario?
            // remove from pool
            // this.#oApplicationContainerPool.values().forEach((oPool) => {
            //     const iIndex = oPool.indexOf(oApplicationContainer);
            //     if (iIndex >= 0) {
            //         oPool.splice(iIndex, 1);
            //     }
            // });
        }

        get (sUrl, bGetStatefulContainer) {
            if (sUrl === undefined || this.getLength() === 0) {
                return;
            }

            if (bGetStatefulContainer) {
                sUrl = sUrl.replaceAll("sap-keep-alive", "sap-temp");
            }

            var sKey = this.getKeyFromUrl(sUrl);

            const oEntry = this.#oActiveApplicationContainers[sKey];
            if (oEntry) {
                return oEntry.container;
            }
        }

        #getByContainer (oApplicationContainer) {
            if (!oApplicationContainer) {
                return;
            }

            let oResult;
            Object.values(this.#oActiveApplicationContainers).forEach((oEntry) => {
                if (oEntry.container === oApplicationContainer) {
                    oResult = oEntry;
                }
            });
            return oResult;
        }

        isApplicationContainerActive (oApplicationContainer) {
            return !!this.#getByContainer(oApplicationContainer);
        }

        getFromPool (sUrl) {
            const sUrlWithoutKeepAlive = sUrl.replaceAll("sap-keep-alive", "sap-temp");
            const sKey = this.getKeyFromUrl(sUrlWithoutKeepAlive);

            if (this.#oApplicationContainerPool[sKey]?.length) {
                const oAppContainer = this.#oApplicationContainerPool[sKey].shift();

                if (this.#oApplicationContainerPool[sKey].length === 0) {
                    delete this.#oApplicationContainerPool[sKey];
                }
                return oAppContainer;
            }
        }

        getByApplicationContainerId (sId) {
            for (const sKey in this.#oActiveApplicationContainers) {

                const oEntry = this.#oActiveApplicationContainers[sKey];
                if (oEntry) {
                    if (oEntry.container.sId === sId) {
                        return oEntry.container;
                    }
                }
            }
        }

        forEach (fnCallback) {
            Object.values(this.#oActiveApplicationContainers).forEach((oEntry) => {
                fnCallback(oEntry.container);
            });
            Object.values(this.#oApplicationContainerPool).forEach((oPool) => {
                oPool.forEach((ApplicationContainer) => {
                    fnCallback(ApplicationContainer);
                });
            });
        }

        /**
         * Builds a key of a reusable iframe that is not destroyed and can be reused.
         * When a new application is opened, and it is hosted in an iframe, in order to
         * check if an iframe for this app already exists, we will build the iframe key based
         * on hard coded keys (The keys are always taken from the URL parameters).
         *
         * The structure of the string key:
         * [url-origin]@hint:[sap-iframe-hint]@uiver:[sap-ui-version]@
         *
         * Example of an iframe key:
         * http://www.test.com@hint:ABC@uiver:1.84.0@async:false@ka:[sap-keep-alive]@async:sap-async-loading@fesr:[sap-calm]@testid:[sap-testcflp-iframeid]
         *
         * NOTE: reusable iframes are kept in in "oCacheStorage" declared above.
         *
         * @param {string} sUrl application url
         * @returns {string} iframe key.
         * @private
         */
        getKeyFromUrl (sUrl) {
            let sOrigin,
                sIframeHint = "",
                sUI5Version = "",
                sKeepAlive = "",
                sUI5Async = "",
                sFESR = "",
                sTestUniqueId = "";

            try {
                const oURL = new URL(sUrl, this._getWindowLocationHref());
                sOrigin = oURL.origin;
                if (oURL.port === "") {
                    if (oURL.protocol === "https:") {
                        sOrigin = sOrigin + ":443";
                    } else if (oURL.protocol === "http:") {
                        sOrigin = sOrigin + ":80";
                    }
                }

                const oSearchParams = oURL.searchParams;
                if (oSearchParams.has("sap-iframe-hint")) {
                    sIframeHint = "@hint:" + oSearchParams.get("sap-iframe-hint");
                }
                if (oSearchParams.has("sap-ui-version")) {
                    sUI5Version = "@uiver:" + oSearchParams.get("sap-ui-version");
                }
                if ((sIframeHint === "@hint:GUI" || sIframeHint === "@hint:WDA" || sIframeHint === "@hint:WCF") && oSearchParams.has("sap-keep-alive")) {
                    sKeepAlive = "@ka:" + oSearchParams.get("sap-keep-alive") + "-" + sUrl;
                }
                if (oSearchParams.has("sap-async-loading") && oSearchParams.get("sap-async-loading") !== "true") {
                    sUI5Async = "@async:" + oSearchParams.get("sap-async-loading");
                }
                if (oSearchParams.has("sap-enable-fesr") && oSearchParams.get("sap-enable-fesr") !== "false") {
                    sFESR = "@fesr:" + oSearchParams.get("sap-enable-fesr");
                }
                if (oSearchParams.has("sap-testcflp-iframeid")) {
                    sTestUniqueId = "@testid:" + oSearchParams.get("sap-testcflp-iframeid");
                }
            } catch (ex) {
                Log.error(
                    "URL '" + sUrl + "' can not be parsed: " + ex,
                    "sap.ushell.components.applicationIntegration.application.BlueBoxHandler"
                );
                sOrigin = sUrl;
            }

            const sKey = sOrigin.toLowerCase() + sIframeHint + sUI5Version + sKeepAlive + sUI5Async + sFESR + sTestUniqueId;

            return sKey;
        }

        _getWindowLocationHref () {
            return window.location.href;
        }

        _getStorageForDebug () {
            return {
                oCacheStorage: this.#oActiveApplicationContainers,
                oKeepAliveIframePool: this.#oApplicationContainerPool
            };
        }
    }

    return new BlueBoxesCache();
});
