// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Shell Navigation Hash Changer Service.
 */

sap.ui.define([
    "sap/ui/core/EventBus",
    "sap/ushell/library",
    "sap/ushell/utils/UrlShortening",
    "sap/ushell/utils/UrlParsing",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/performance/trace/Interaction",
    "sap/ui/thirdparty/hasher",
    "sap/base/util/isEmptyObject",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log",
    "sap/ushell/Container"
], function (
    EventBus,
    ushellLibrary,
    UrlShortening,
    UrlParsing,
    HashChanger,
    Interaction,
    hasher,
    isEmptyObject,
    jQuery,
    Log,
    Container
) {
    "use strict";

    // shortcut for sap.ushell.NavigationState
    var NavigationState = ushellLibrary.NavigationState;

    /**
     * Denotes all possible events that can be emitted by the
     * ShellNavigationHashChanger. Each event is described by an object, with
     * the following attributes:
     * <pre>
     * {
     *   name: "...", // the event name that sent via fireEvent
     *   historyEntry: true // or false, to indicate whether or not a browser
     *                      // history entry should be added once the event is fired.
     * }
     * </pre>
     *
     * @enum {object}
     * @private
     */
    var O_EVENT = {
        HASH_SET: {
            name: "hashSet",
            historyEntry: true
        },
        HASH_REPLACED: {
            name: "hashReplaced",
            historyEntry: false
        },
        SHELL_HASH_CHANGED: {
            name: "shellHashChanged",
            historyEntry: true,
            usedByUi5HistoryDetection: true,
            ui5EventParameterNames: {
                // UI5 needs no separator when inner app routes are emitted
                oldHash: "oldAppSpecificRouteNoSeparator",
                newHash: "newAppSpecificRouteNoSeparator"
            },
            // UI5 needs to know whether the event should be forwarded to the Router in existing components
            // or the event is only relevant for the components which are going to be created.
            // With the "shellHashChanged" event, the new hash should only be consumed by the new component which is
            // going to be created with the new intent and the existing components shouldn't get notified by this hash
            // change. Therefore this option needs to be set with true.
            updateHashOnly: true
        },
        SHELL_HASH_PARAMETER_CHANGED: {
            name: "shellHashParameterChanged",
            historyEntry: null // unknown, control may be passed to an arbitrary function in this case
        },
        HASH_CHANGED: {
            name: "hashChanged",
            historyEntry: false,
            usedByUi5HistoryDetection: true,
            ui5EventParameterNames: {
                newHash: "newHash",
                fullHash: "fullHash"
            }
        }
    };

    const sModuleName = "ShellNavigationHashChanger";
    const sLogFesrPrefix = "[FesrFlp]";

    /**
     * @alias sap.ushell.services.ShellNavigationHashChanger
     * @class
     *
     * @extends sap.ui.core.routing.HashChanger
     *
     * @private
     */
    var ShellNavigationHashChanger = HashChanger.extend("sap.ushell.services.ShellNavigationHashChanger", /** @lends sap.ushell.services.ShellNavigationHashChanger.prototype*/ {
        constructor: function (oConfig) {
            this.oServiceConfig = oConfig;
            this._oNavigationState = {};

            HashChanger.apply(this);
            this._initializedByShellNav = false; // initialization flag for the shellNavigationService
            this._bReloadApplication = false;
            this.privfnShellCallback = null;
            this.privappHashPrefix = "&/";
            this.privhashPrefix = "#";
            this.aNavigationFilters = [];
            this.NavigationFilterStatus = {
                Continue: "Continue",
                Custom: "Custom",
                Abandon: "Abandon",
                Keep: "Keep"
            };

            // used by UI5 to understand what events affect the history
            this.getRelevantEventsInfo = function () {
                return this._getAllEvents().filter(function (oEvent) {
                    return oEvent.usedByUi5HistoryDetection;
                }).map(function (oEvent) {
                    var oEventInfo = {
                        name: oEvent.name,
                        paramMapping: oEvent.ui5EventParameterNames
                    };

                    if (oEvent.updateHashOnly !== undefined) {
                        oEventInfo.updateHashOnly = oEvent.updateHashOnly;
                    }

                    return oEventInfo;
                });
            };
        }
    });

    /**
     * Obtains the current shell hash (with #) urlDecoded
     * Shortened(!)
     * @returns {object} Object containing the shell hash
     * @private
     */
    ShellNavigationHashChanger.prototype.privgetCurrentShellHash = function () {
        var res = this.privsplitHash(hasher.getHash());
        return {
            hash: "#" + ((res && res.shellPart) ? res.shellPart : "")
        };
    };

    /**
     * Internally constructs the next hash, with #
     * shortened(!)
     * @param {string} sAppSpecific Application specific hash
     * @returns {string} constructed full hash
     * @private
     */
    ShellNavigationHashChanger.prototype.privconstructHash = function (sAppSpecific) {
        var o = this.privgetCurrentShellHash();
        o.hash += sAppSpecific;
        return o;
    };

    /**
     * internal, without #
     * @param {object} oShellHash shell hash concept
     * @returns {string} return constructed string
     * @private
     */
    ShellNavigationHashChanger.prototype.privconstructShellHash = function (oShellHash) {
        return UrlParsing.constructShellHash(oShellHash);
    };

    /** split a shell hash into app and shell specific part
     *  @private
     *  @returns <code>null</code>, if sHash is not a valid hash (not parsable);
     *      otherwise an object with properties <code>shellPart</code> and <code>appSpecificRoute</code>
     *      the properties are <code>null</code> if sHash is falsy
     */
    // this method is deliberately restrictive to work only on proper hashes
    //  this may be made part of URLParser
    ShellNavigationHashChanger.prototype.privsplitHash = function (sHash) {
        if (sHash === undefined || sHash === null || sHash === "") {
            return {
                shellPart: null,
                appSpecificRoute: null,
                intent: null,
                params: null
            };
        }
        // break down hash into parts
        // "#SO-ABC~CONTXT?ABC=3A&DEF=4B&/detail/1?A=B");
        var oShellHash = UrlParsing.parseShellHash(sHash);
        if (oShellHash === undefined || oShellHash === null) {
            return null;
        }

        var oShellHashParams = (oShellHash.params && !isEmptyObject(oShellHash.params)) ? oShellHash.params : null;
        var sAppSpecificRoute = oShellHash.appSpecificRoute;
        oShellHash.appSpecificRoute = undefined;
        return {
            shellPart: this.privstripLeadingHash(this.privconstructShellHash(oShellHash)) || null,
            appSpecificRoute: sAppSpecificRoute || null, // ,"&/detail/1?A=B");
            intent: (oShellHash.semanticObject && oShellHash.action
                && (oShellHash.semanticObject + "-" + oShellHash.action + (oShellHash.contextRaw || ""))) || null,
            params: oShellHashParams
        };
    };

    /**
     * internal, central navigation hook that trigger hash change
     * triggers events and sets the hash
     * @param {string} sFullHash full shell hash
     * @param {string} sAppHash application specific hash
     * @param {boolean} bWriteHistory whether to create a history record (true, undefined) or replace the hash (false)
     * @private
     */
    ShellNavigationHashChanger.prototype.privsetHash = function (sFullHash, sAppHash, bWriteHistory) {
        hasher.prependHash = "";
        sFullHash = this.privstripLeadingHash(sFullHash);
        sAppHash = sAppHash || "";
        if (bWriteHistory === undefined) {
            bWriteHistory = true;
        }
        // don't call method on super class
        // we set the full hash and fire the events for the app-specific part only
        // this is necessary for consistency of all events; hashSet and hashReplaced are
        // evaluated by sap.ui.core.routing.History
        if (bWriteHistory) {
            this.fireEvent(O_EVENT.HASH_SET.name, { sHash: sAppHash });
            hasher.setHash(sFullHash);
        } else {
            this.fireEvent(O_EVENT.HASH_REPLACED.name, { sHash: sAppHash });
            hasher.replaceHash(sFullHash);
        }
    };

    ShellNavigationHashChanger.prototype.privstripLeadingHash = function (sHash) {
        if (sHash[0] === "#") {
            return sHash.substring(1);
        }
        return sHash;
    };

    ShellNavigationHashChanger.prototype.registerNavigationFilter = function (fnFilter) {
        if (typeof fnFilter !== "function") {
            throw new Error("fnFilter must be a function");
        }
        this.aNavigationFilters.push(fnFilter);
    };

    ShellNavigationHashChanger.prototype.unregisterNavigationFilter = function (fnFilter) {
        if (typeof fnFilter !== "function") {
            throw new Error("fnFilter must be a function");
        }
        this.aNavigationFilters = this.aNavigationFilters.filter(function (fnRegisteredFilter) {
            return fnRegisteredFilter !== fnFilter;
        });
    };

    /**
     * @alias sap.ushell.services.StoreContext
     * @class
     * @classdesc This object can generate an arbitrary number of keys
     * and potentially store them in sequence,
     *
     * it is required to call the getNextKey function before
     * calling store(sValue)
     *
     * this.getPromise(), invoked after the last store sequence,
     * returns a promise which will be ok *after* all save sequences are
     * done
     *
     * @param {object} AppStateService The AppState service
     * @param {object} oComponent a ui5 component
     * @param {boolean} [bTransient] whether the AppState is supposed to be transient
     */
    function StoreContext (AppStateService, oComponent, bTransient) {
        this.oAppState = undefined;
        this.oPromise = (new jQuery.Deferred()).resolve();
        this.getNextKey = function () {
            this.oAppState = AppStateService.createEmptyAppState(oComponent, bTransient);
            return this.oAppState.getKey();
        };
        this.store = function (sValue) {
            var nPromise;
            this.oAppState.setData(sValue);
            nPromise = this.oAppState.save();
            this.oPromise = jQuery.when(this.oPromise, nPromise);
        };
        this.getPromise = function () {
            return this.oPromise;
        };
    }

    /**
     * Compact a given parameter object if too long,
     * retaining <code> aRetainParameterList if possible
     * a member sap-intent-param with the key will be added to the
     * returned oParams object
     * @param {object} oParams a parameter object
     * @param {Array<*>} [aRetainParameterList] the parameter list to retain
     * @param {object} [oComponent] a ui5 component, should be the root component of your application
     * @param {boolean} [bTransient] indicates a transient appstate should be created
     * @returns {jQuery.Promise} a promise, whose first argument on resolution is a either
     * an equivalent oParams object (or the identical one) or a new
     * parameter object with the retained url parameters and a sap-intent-param with key value
     */
    ShellNavigationHashChanger.prototype.compactParams = function (oParams, aRetainParameterList, oComponent, bTransient) {
        var oDeferred = new jQuery.Deferred();
        var sHash = UrlParsing.constructShellHash({
            target: {
                semanticObject: "SO",
                action: "action"
            },
            params: oParams
        });

        if (oParams === undefined || Object.keys(oParams).length === 0) {
            return oDeferred.resolve(oParams).promise();
        }

        Container.getServiceAsync("AppState")
            .then(function (AppStateService) {
                var oSaveContext = new StoreContext(AppStateService, oComponent, bTransient);
                var oResult = UrlShortening.compactHash(sHash, aRetainParameterList, oSaveContext);

                // separate the parameters
                var oCompactedParams = UrlParsing.parseParameters(oResult.hash.match(/\?.*/)[0]);
                var oPromise = oSaveContext.getPromise();
                oPromise
                    .done(function () {
                        oDeferred.resolve(oCompactedParams);
                    })
                    .fail(function (sMsg) {
                        oDeferred.reject(sMsg);
                    });
            });
        return oDeferred.promise();
    };

    /// protected API, only used by shell services
    /**
     * Returns a string which can be put into the DOM (e.g. in a link tag), asynchronously.
     * Please use CrossApplicationNavigation service and do not invoke this method directly
     * if you are an application.
     *
     * @param {object} oArgs
     *     object encoding a semantic object and action
     *     e.g.:
     *     <pre>
     *     {
     *        target: {
     *            semanticObject: "AnObject",
     *            action: "Action"
     *        },
     *        params: {
     *            A: "B"
     *        }
     *     }
     *     </pre>
     *
     *     or
     *
     *     <pre>
     *     {
     *         target: {
     *             shellHash: "SO-36&jumper=postman"
     *         }
     *     }
     *     </pre>
     * @param {boolean} [bVerbose]
     *    whether the response should be returned in verbose format. If
     *    this flag is set to true, this function returns an object
     *    instead of a string.
     * @returns {Promise<object>}
     *    <p>a string that can be put into an href attribute of an
     *    HTML anchor.  The returned string will always start with a
     *    hash character.</p>
     *
     *    <p>
     *    In case the <b>bVerbose</b> parameter is set to true, an
     *    object that wraps the result string will be returned
     *    instead:
     *    <pre>
     *    { hash : {string},
     *      params : {object}
     *      skippedParams : {object}
     *    }
     *    </pre>
     *    </p>
     *
     * where:
     * <ul>
     * <li><code>params</code> is an object containing non-truncated parameters</li>
     * <li><code>skippedParams</code> is an object containing truncated parameters if truncation occurred or undefined if not</li>
     * </ul>
     *
     * @since 1.15.0
     * @private
     */
    ShellNavigationHashChanger.prototype.hrefForExternal = function (oArgs, bVerbose) {
        // must encode the result
        function encodeResult (vResult, bIsVerbose) {
            if (bIsVerbose === true) {
                vResult.hash = encodeURI(vResult.hash);
            } else {
                vResult = encodeURI(vResult);
            }
            return vResult;
        }

        return this.hrefForExternalNoEncAsync(oArgs, bVerbose).then(function (vResult) {
            return encodeResult(vResult, bVerbose);
        });
    };

    /**
     * Returns a string which can be put into the DOM (e.g. in a link tag), synchronously.
     * Please use CrossApplicationNavigation service and do not invoke this method directly
     * if you are an application.
     *
     * @param {object} oArgs
     *     object encoding a semantic object and action
     *     e.g.:
     *     <pre>
     *     {
     *        target: {
     *            semanticObject: "AnObject",
     *            action: "Action"
     *        },
     *        params: {
     *            A: "B"
     *        }
     *     }
     *     </pre>
     *
     *     or
     *
     *     <pre>
     *     {
     *         target: {
     *             shellHash: "SO-36&jumper=postman"
     *         }
     *     }
     *     </pre>
     * @param {boolean} [bVerbose]
     *    whether the response should be returned in verbose format. If
     *    this flag is set to true, this function returns an object
     *    instead of a string.
     * @param {object} [oComponent]
     *    an optional instance of sap.ui.core.UIComponent
     * @returns {object}
     *    <p>a string that can be put into an href attribute of an
     *    HTML anchor.  The returned string will always start with a
     *    hash character.</p>
     *
     *    <p>
     *    In case the <b>bVerbose</b> parameter is set to true, an
     *    object that wraps the result string will be returned
     *    instead:
     *    <pre>
     *    { hash : {string},
     *      params : {object}
     *      skippedParams : {object}
     *    }
     *    </pre>
     *    </p>
     *
     * where:
     * <ul>
     * <li><code>params</code> is an object containing non-truncated parameters</li>
     * <li><code>skippedParams</code> is an object containing truncated parameters if truncation occurred or undefined if not</li>
     * </ul>
     *
     * @since 1.119.0
     * @private
     * @deprecated since 1.119.0 Please use {@link #hrefForExternal} instead.
     */
    ShellNavigationHashChanger.prototype.hrefForExternalSync = function (oArgs, bVerbose, oComponent) {
        // must encode the result
        function encodeResult (vResult, bIsVerbose) {
            if (bIsVerbose === true) {
                vResult.hash = encodeURI(vResult.hash);
            } else {
                vResult = encodeURI(vResult);
            }
            return vResult;
        }

        var vResult = this.hrefForExternalNoEnc(oArgs, bVerbose, oComponent);
        return encodeResult(vResult, bVerbose);
    };

    /**
     * Behaves as {@link #hrefForExternal} but does not encode the
     * returned intents with encodeURI.
     *
     * @param {object} oArgs
     *     object encoding a semantic object and action
     * @param {boolean} [bVerbose]
     *    whether the response should be returned in verbose format.
     * @param {object} [oComponent]
     *    an optional instance of sap.ui.core.UIComponent
     * @param {boolean} [bAsync]
     *    indicates whether the method should return the result asynchronously.
     *    <code>bAsync=false</code> is deprecated since 1.95.
     *
     * @returns {object}
     *    <p>a string that can be put into an href attribute of an
     *    HTML anchor.</p>
     *
     * @see {@link #hrefForExternal}
     * @since 1.32.0
     * @private
     * @deprecated since 1.108.0 Please use {@link #hrefForExternalNoEncAsync} instead.
     */
    ShellNavigationHashChanger.prototype.hrefForExternalNoEnc = function (oArgs, bVerbose, oComponent, bAsync) {
        Log.error("Deprecated API call of 'sap.ushell.services.ShellNavigationHashChanger.hrefForExternalNoEnc'. Please use 'hrefForExternalNoEncAsync' instead",
            null,
            "sap.ushell.services.ShellNavigationHashChanger"
        );

        if (bAsync) {
            var oDeferred = new jQuery.Deferred();

            this.hrefForExternalNoEncAsync(oArgs, bVerbose)
                .then(oDeferred.resolve)
                .catch(oDeferred.reject);

            return oDeferred.promise();
        }

        var oTmp = this.privhrefForExternalNoEnc(oArgs);
        if (bVerbose === true) {
            return {
                hash: oTmp.hash,
                params: oTmp.params,
                skippedParams: oTmp.skippedParams
            };
        }

        return oTmp.hash;
    };

    /**
     * Behaves as {@link #hrefForExternal} but does not encode the
     * returned intents with encodeURI.
     *
     * @param {object} oArgs
     *     object encoding a semantic object and action
     * @param {boolean} [bVerbose]
     *    whether the response should be returned in verbose format.
     *
     * @returns {Promise<object>}
     *    <p>Promise resolving a string that can be put into an href
     *    attribute of an HTML anchor.</p>
     *
     * @see {@link #hrefForExternal}
     * @since 1.95.0
     * @private
     */
    ShellNavigationHashChanger.prototype.hrefForExternalNoEncAsync = function (oArgs, bVerbose) {
        var vResult;

        var oTmp = this.privhrefForExternalNoEnc(oArgs);
        if (bVerbose === true) {
            vResult = {
                hash: oTmp.hash,
                params: oTmp.params,
                skippedParams: oTmp.skippedParams
            };
        } else {
            vResult = oTmp.hash;
        }

        return new Promise(function (resolve) {
            resolve(vResult);

        });
    };

    /**
     * Shortened(!)
     * @param {object} oArgs arguments
     * @returns {object} Object with at least member "hash", containing THE hash
     */
    ShellNavigationHashChanger.prototype.privhrefForExternalNoEnc = function (oArgs) {
        if (oArgs === undefined) {
            return this.privgetCurrentShellHash();
        }
        // construct url
        if (oArgs && oArgs.target && (typeof oArgs.target.semanticObject === "string" || typeof oArgs.target.shellHash === "string")) {
            return {
                hash: "#" + this.privconstructShellHash(oArgs)
            };
        }
        return this.privgetCurrentShellHash();
    };

    ShellNavigationHashChanger.prototype.privgetAppHash = function (oArgs) {
        var sAppHash;
        if (oArgs && oArgs.target && (typeof oArgs.target.shellHash === "string")) {
            var oShellHash = UrlParsing.parseShellHash(oArgs.target.shellHash);
            sAppHash = oShellHash && oShellHash.appSpecificRoute;
            sAppHash = sAppHash && sAppHash.substring(2);
        }
        return sAppHash;
    };

    /**
     * returns a string which can be put into the DOM (e.g. in a link tag)
     * given an app specific hash suffix
     *
     * @param {string} sAppHash Application hash
     * @returns {string} a string which can be put into the link tag,
     *          containing the current shell hash as prefix and the
     *          specified application hash as suffix
     *
     * example: hrefForAppSpecificHash("View1/details/0/") returns
     * "#MyApp-Display&/View1/details/0/"
     *
     * @since 1.15.0
     * @private
     */
    ShellNavigationHashChanger.prototype.hrefForAppSpecificHash = function (sAppHash) {
        return encodeURI(this.privconstructHash(this.privappHashPrefix + sAppHash).hash);
    };

    /**
     *
     * Navigate to an external target
     * Please use CrossApplicationNavigation service and do not invoke this method directly!
     *
     * @param {object} oArgs  configuration object describing the target
     *
     *  e.g. { target : { semanticObject : "AnObject", action: "Action" },
     *         params : { A : "B" } }
     *
     * constructs sth. like    http://....ushell#AnObject-Action?A=B ....
     * and navigates to it.
     * @param {object} oComponent runtime - not in use anymore!
     * @param {boolean} bWriteHistory
     *     set to false to invoke replaceHash
     *
     * @returns {Promise<undefined>} A Promise which resolves after the navigation was triggered
     *
     * @private
     */
    ShellNavigationHashChanger.prototype.toExternal = function (oArgs, oComponent, bWriteHistory) {
        var sHash = this.privhrefForExternalNoEnc(oArgs).hash;
        var sAppHash = this.privgetAppHash(oArgs);
        this.privsetHash(sHash, sAppHash, bWriteHistory);
        return Promise.resolve();
    };

    /**
     * constructs the full shell hash and
     * sets it, thus triggering a navigation to it
     * @param {string} sAppHash specific hash
     * @param {boolean} bWriteHistory if true it adds a history entry in the browser if not it replaces the hash
     * @private
     */
    ShellNavigationHashChanger.prototype.toAppHash = function (sAppHash, bWriteHistory) {
        var sHash = this.privconstructHash(this.privappHashPrefix + sAppHash).hash;
        this.privsetHash(sHash, sAppHash, bWriteHistory);
    };

    /**
     * Initialization for the shell navigation.
     *
     * This will start listening to hash changes and also fire a hash changed event with the initial hash.
     * @param {function} fnShellCallback Shell callback
     * @protected
     * @returns {boolean} false if it was initialized before, true if it was initialized the first time
     */
    ShellNavigationHashChanger.prototype.initShellNavigation = function (fnShellCallback) {
        if (this._initializedByShellNav) {
            Log.info("initShellNavigation already called on this ShellNavigationHashChanger instance.");
            return false;
        }

        this.privfnShellCallback = fnShellCallback;

        hasher.changed.add(this.treatHashChanged, this); //parse hash changes

        if (!hasher.isActive()) {
            hasher.initialized.addOnce(this.treatHashChanged, this); //parse initial hash
            hasher.init(); //start listening for history change
        } else {
            this.treatHashChanged(hasher.getHash());
        }
        this._initializedByShellNav = true;
        return true;
    };

    /**
     * Initialization for the application
     *
     * The init method of the base class is overridden, because the hasher initialization (registration for hash changes) is already done
     * in <code>initShellNavigation</code> method. The application-specific initialization ensures that the application receives a hash change event for the
     * application-specific part if set in the  initial hash.
     * @returns {boolean} false if it was initialized before, true if it was initialized the first time
     * @protected
     */
    ShellNavigationHashChanger.prototype.init = function () {
        if (this._initialized) {
            Log.info("init already called on this ShellNavigationHashChanger instance.");
            return false;
        }
        // fire initial hash change event for the app-specific part
        var oNewHash = this.privsplitHash(hasher.getHash());
        var sAppSpecificRoute = ((oNewHash && oNewHash.appSpecificRoute) || "  ").substring(2); // strip &/
        var sDelimiterIfNecessary = sAppSpecificRoute ? "&/" : "";
        var sShellPart = (oNewHash && oNewHash.shellPart) || "";
        this.fireEvent(O_EVENT.HASH_CHANGED.name, {
            newHash: sAppSpecificRoute,
            fullHash: sShellPart + sDelimiterIfNecessary + sAppSpecificRoute
        });
        this._initialized = true;
        return true;
    };

    ShellNavigationHashChanger.prototype._removeInnerAppSeparator = function (sInnerAppRoute) {
        return (sInnerAppRoute || "").replace("&/", "");
    };

    ShellNavigationHashChanger.prototype._setNavigationStatus = function (sNavigationStatus) {
        // inform ui5 interaction about pending navigation
        if (sNavigationStatus === NavigationState.InProgress && !this._fnResolveInteraction) {
            Log.debug(`${sLogFesrPrefix} Interaction Start`, null, sModuleName);
            this._fnResolveInteraction = Interaction.notifyAsyncStep();
        } else if (sNavigationStatus === NavigationState.Finished && this._fnResolveInteraction) {
            Log.debug(`${sLogFesrPrefix} Interaction End`, null, sModuleName);
            this._fnResolveInteraction();
            this._fnResolveInteraction = null;
        }

        this._oNavigationState.status = sNavigationStatus;
    };

    /**
     * Saves the old and new hash of a navigation step.
     *
     * @param {string} newHash the new hash of the browser
     * @param {string} oldHash the previous hash
     * @private
     */
    ShellNavigationHashChanger.prototype._trackNavigation = function (newHash, oldHash) {
        this._oNavigationState.newHash = newHash;
        this._oNavigationState.oldHash = oldHash;
    };

    ShellNavigationHashChanger.prototype.getCurrentNavigationState = function () {
        return this._oNavigationState;
    };

    /**
     * Fires the hashchanged event, may be extended to modify the hash before firing the event
     * @param {string} newHash the new hash of the browser
     * @param {string} oldHash the previous hash
     * @protected
     */
    ShellNavigationHashChanger.prototype.treatHashChanged = function (newHash, oldHash) {
        this._trackNavigation(newHash, oldHash);
        this._setNavigationStatus(NavigationState.InProgress);

        if (this.inAbandonFlow) {
            // in case and navigation was abandon by a navigation filter, we ignore the hash reset event
            this._setNavigationStatus(NavigationState.Finished);
            this.setReloadApplication(false);
            return;
        }

        var bShouldKeep;
        newHash = UrlShortening.expandHash(newHash); // do synchronous expansion if possible
        oldHash = UrlShortening.expandHash(oldHash); // if not, the parameter remains and is expanded during NavTargetResolutionInternal
        var oNewHash = this.privsplitHash(newHash);
        var oOldHash = this.privsplitHash(oldHash);

        if (!oNewHash) {
            // illegal new hash; pass the full string and an error object
            var oError = new Error("Illegal new hash - cannot be parsed: '" + newHash + "'");
            this.fireEvent(O_EVENT.SHELL_HASH_CHANGED.name, {
                newShellHash: newHash,
                newAppSpecificRoute: null,
                fullHash: newHash,
                oldShellHash: (oOldHash ? oOldHash.shellPart : oldHash),
                error: oError
            });
            this.privfnShellCallback(newHash, null, (oOldHash ? oOldHash.shellPart : oldHash), (oOldHash ? oOldHash.appSpecificRoute : null), oError);
            this._setNavigationStatus(NavigationState.Finished);
            this.setReloadApplication(false);
            return;
        }

        if (!oOldHash) {
            // illegal old hash - we are less restrictive in this case and just set the complete hash as shell part
            oOldHash = {
                shellPart: oldHash,
                appSpecificRoute: null
            };
        }

        //call all navigation filters
        for (var i = 0; i < this.aNavigationFilters.length; i++) {
            try {
                var sFilterHash;
                var vFilterResult = this.aNavigationFilters[i].call(undefined, newHash, oldHash);
                var sFilterResult = vFilterResult;
                if (typeof vFilterResult !== "string") {
                    sFilterResult = vFilterResult.status;
                    sFilterHash = vFilterResult.hash;
                }

                if (sFilterResult === this.NavigationFilterStatus.Custom) {
                    //filter is handling navigation - stop the navigation flow.
                    if (sFilterHash && sFilterHash.length > 0) {
                        this.inAbandonFlow = true;
                        hasher.replaceHash(sFilterHash);
                        this.inAbandonFlow = false;
                    }
                    this._setNavigationStatus(NavigationState.Finished);
                    this.setReloadApplication(false);
                    return;
                }
                if (sFilterResult === this.NavigationFilterStatus.Abandon) {
                    //filter abandon this navigation, therefore we need to reset the hash and stop the navigation flow
                    this.inAbandonFlow = true;
                    hasher.replaceHash(oldHash);
                    this.inAbandonFlow = false;
                    this._setNavigationStatus(NavigationState.Finished);
                    this.setReloadApplication(false);
                    return;
                }

                if (sFilterResult === this.NavigationFilterStatus.Keep) {
                    bShouldKeep = true;
                }
            } catch (e) {
                Log.error("Error while calling Navigation filter! ignoring filter...", e.message, "sap.ushell.services.ShellNavigationHashChanger");
            }
        }

        if (bShouldKeep) {
            // parameter fullHash is passed twice for consistency
            this.fireEvent(O_EVENT.HASH_CHANGED.name, {
                newHash: newHash,
                oldHash: oldHash,
                fullHash: newHash
            });
            this._setNavigationStatus(NavigationState.Finished);
            this.setReloadApplication(false);
            return;
        }
        //else - continue with navigation

        var bIsInitialHashChange = oldHash === undefined;
        var oHashComparison = UrlParsing.compareHashes(newHash, oldHash);
        oHashComparison.sameIntent = oHashComparison.sameIntent && !bIsInitialHashChange;

        var bNavigationToExactSameHash = oHashComparison.sameIntent && oHashComparison.sameParameters && oHashComparison.sameAppSpecificRoute;
        if (bNavigationToExactSameHash) {
            // this kind of navigation might happen when the technical parameters are changed.
            // e.g. sap-ui-fl-control-variant-id
            Log.info("Navigation happened but hash stayed the same", null, "sap.ushell.services.ShellNavigationHashChanger");
            // an empty string has to be propagated!
            this.fireEvent(O_EVENT.HASH_CHANGED.name, {
                newHash: this._removeInnerAppSeparator(oNewHash.appSpecificRoute),
                oldHash: this._removeInnerAppSeparator(oOldHash.appSpecificRoute),
                fullHash: newHash
            });
            this._setNavigationStatus(NavigationState.Finished);
            this.setReloadApplication(false);

            return;
        }

        var bInnerAppNavigation = oHashComparison.sameIntent && oHashComparison.sameParameters;
        if (bInnerAppNavigation) {
            // In case a UI5 application navigates to itself without an appSpecificRoute, the app should be reloaded.
            // This check gives the option to continue the navigation, as if the navigation was not an app specific navigation.
            // Thereby reloading the app. (calling exit and init functions of the app component)
            if (this.getReloadApplication()) {
                this.setReloadApplication(false);
            } else {
                var sNewAppSpecificRoute = this._removeInnerAppSeparator(oNewHash.appSpecificRoute);
                var sOldAppSpecificRoute = this._removeInnerAppSeparator(oOldHash.appSpecificRoute);
                Log.info("Inner App Hash changed from '" + sOldAppSpecificRoute + "' to '" + sNewAppSpecificRoute + "'", null, "sap.ushell.services.ShellNavigationHashChanger");
                // an empty string has to be propagated!
                this.fireEvent(O_EVENT.HASH_CHANGED.name, {
                    newHash: sNewAppSpecificRoute,
                    oldHash: sOldAppSpecificRoute,
                    fullHash: newHash
                });
                this._setNavigationStatus(NavigationState.Finished);

                return;
            }
        }

        if (oHashComparison.sameIntent && this.hasListeners(O_EVENT.SHELL_HASH_PARAMETER_CHANGED.name)) {
            /*
             * This implements a feature requested via FLPINTEGRATION2014-403,
             * where consumers are allowed to change intent parameters at will
             * without triggering navigation.
             *
             * Attached listeners take control over the navigation after the
             * hash fragment changes.
             */
            var sNewParameters = UrlParsing.paramsToString(oNewHash.params);
            var sOldParameters = UrlParsing.paramsToString(oOldHash.params);

            Log.info("Shell hash parameters changed from '" + sOldParameters + "' to '" + sNewParameters + "'", null, "sap.ushell.services.ShellNavigationHashChanger");
            this.fireEvent(O_EVENT.SHELL_HASH_PARAMETER_CHANGED.name, {
                oNewParameters: oNewHash.params,
                oOldParameters: oOldHash.params
            });
            this._setNavigationStatus(NavigationState.Finished);
            this.setReloadApplication(false);
            return;
        }

        Log.info("Outer shell hash changed from '" + oldHash + "' to '" + newHash + "'", null, "sap.ushell.services.ShellNavigationHashChanger");
        // all Shell specific callback -> load other app !
        this.fireEvent(O_EVENT.SHELL_HASH_CHANGED.name, {
            newShellHash: oNewHash.shellPart,
            newAppSpecificRoute: oNewHash.appSpecificRoute,
            fullHash: newHash,
            oldShellHash: oOldHash.shellPart,
            oldAppSpecificRoute: oOldHash.appSpecificRoute,
            error: "",
            oldAppSpecificRouteNoSeparator: this._removeInnerAppSeparator(oOldHash.appSpecificRoute),
            newAppSpecificRouteNoSeparator: this._removeInnerAppSeparator(oNewHash.appSpecificRoute)
        });
        this.privfnShellCallback(oNewHash.shellPart, oNewHash.appSpecificRoute, oOldHash.shellPart, oOldHash.appSpecificRoute);

        this._setNavigationStatus(NavigationState.Finished);
        this.setReloadApplication(false);
    };

    /**
     * Sets the hash to a certain value, this hash is prefixed by the shell hash if present
     * @param {string} sHash the hash
     *  adds a history entry in the browser if not it replaces the hash
     * @protected
     */
    ShellNavigationHashChanger.prototype.setHash = function (sHash) {
        this.toAppHash(sHash, /*bWriteHistory*/true);
    };

    /**
     * Replaces the hash to a certain value. When using the replace function no browser history is written.
     * If you want to have an entry in the browser history, please use set setHash function.
     * this function has a side effect
     * @param {string} sHash the hash
     * @protected
     */
    ShellNavigationHashChanger.prototype.replaceHash = function (sHash) {
        this.toAppHash(sHash, /* bWriteHistory */false);
    };

    /**
     * Gets the current hash
     *
     * Override the implementation of the base class and just return the application-specific hash part
     * @returns {string} returned string
     * @protected
     */
    ShellNavigationHashChanger.prototype.getHash = function () {
        return this.getAppHash();
    };

    /**
     * Gets the current application-specific hash part
     *
     * @returns {string} the current application hash
     * @private
     */
    ShellNavigationHashChanger.prototype.getAppHash = function () {
        var oNewHash = this.privsplitHash(hasher.getHash());
        var sAppSpecificRoute = ((oNewHash && oNewHash.appSpecificRoute) || "  ").substring(2); // strip &/
        return sAppSpecificRoute;
    };

    /**
     * Cleans the event registration
     * @see sap.ui.base.Object.prototype.destroy
     * @protected
     */
    ShellNavigationHashChanger.prototype.destroy = function () {
        hasher.changed.remove(this.treatHashChanged, this);
        HashChanger.prototype.destroy.apply(this, arguments);
    };

    /**
     * Returns all events triggered by this module into an array.
     *
     * @returns {object[]}
     *  the ShellNavigationHashChanger.EVENT enum items wrapped into an array.
     *
     * @private
     */
    ShellNavigationHashChanger.prototype._getAllEvents = function () {
        return Object.keys(O_EVENT).map(function (sEvent) {
            return O_EVENT[sEvent];
        });
    };

    /**
     * Returns the name of events that would not cause an entry to be added in
     * the history once triggered.
     *
     * @returns {string[]}
     *   An array containing event names.
     *
     * @protected
     */
    ShellNavigationHashChanger.prototype.getReplaceHashEvents = function () {
        return this._getAllEvents().filter(function (oEvent) {
            return oEvent.historyEntry === false;
        }).map(function (oEvent) {
            return oEvent.name;
        });
    };

    /**
     * Returns the name of events that would cause an entry to be added in the
     * history once triggered.
     *
     * @returns {string[]}
     *   An array containing event names.
     *
     * @protected
     */
    ShellNavigationHashChanger.prototype.getSetHashEvents = function () {
        return this._getAllEvents().filter(function (oEvent) {
            return oEvent.historyEntry === true;
        }).map(function (oEvent) {
            return oEvent.name;
        });
    };

    /**
     * Determines whether an inner app navigation will be made, given the old
     * and the new hash. This method should be called internally by FLP
     * components only, and it's not intended for any other usage.
     * Technical parameters are filtered out before the evaluation.
     *
     * @param {string} sNewHash
     *   The new hash as returned by <code>treatHashChanged</code>
     *
     * @param {string} sOldHash
     *   The old hash as returned by <code>treatHashChanged</code>
     *
     * @returns {boolean}
     *   Whether the hash change is only in the appSpecificRoute.
     *
     * @protected
     */
    ShellNavigationHashChanger.prototype.isInnerAppNavigation = function (sNewHash, sOldHash) {
        var oNewHash = UrlParsing.parseShellHash(sNewHash);
        var oOldHash = UrlParsing.parseShellHash(sOldHash);

        var bIsInitialHashChange = sOldHash === undefined;
        var bHaveSameIntent = UrlParsing.haveSameIntent(oNewHash, oOldHash) && !bIsInitialHashChange;
        var bHaveSameIntentParameters = UrlParsing.haveSameIntentParameters(oNewHash, oOldHash);

        return bHaveSameIntent && bHaveSameIntentParameters;
    };

    /**
     * Returns wether the currently running application should be reloaded during navigation.
     *
     * @returns {boolean} indicating wether the currently running application should be reloaded during navigation.
     *
     * @since 1.106
     * @private
     */
    ShellNavigationHashChanger.prototype.getReloadApplication = function () {
        return this._bReloadApplication;
    };

    /**
     * Sets a flag to indicate that the currently running application should be reloaded during navigation.
     *
     * @param {boolean} value wether the currently running application should be reloaded during navigation.
     *
     * @since 1.106
     * @private
     */
    ShellNavigationHashChanger.prototype.setReloadApplication = function (value) {
        this._bReloadApplication = value;
    };

    return ShellNavigationHashChanger;
});
