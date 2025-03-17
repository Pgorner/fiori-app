// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The <code>sap.ushell_abap.pbServices.ui2.Chip</code> object with related functions.
 */

 sap.ui.define([
     "sap/ushell_abap/pbServices/ui2/Bag",
     "sap/ushell_abap/pbServices/ui2/Utils",
     "sap/ushell_abap/pbServices/ui2/Error",
     "sap/ushell_abap/pbServices/ui2/ChipDefinition",
     "sap/base/Log"
 ], function (
    Bag,
    Utils,
    SrvcError,
    ChipDefinition,
    Log
) {
    "use strict";

    /**
     * A map of all registered contracts by name.
     * @see sap.ushell_abap.pbServices.ui2.Chip.addContract
     */
    var mContractsByName = {};

    /**
     * A cache containing promises for each component name to ensure that
     * component resources are only loaded once
     */
    var _oComponentPromiseCache = {};

    // "private" methods (static) without need to access properties -------------

    /**
     * Returns the initializer function for the given contract name or <code>null</code> if not found.
     *
     * @param {string} sName
     *   name of the contract to be return
     * @returns {function}
     *   function to be called to initialize the contract or null if none was found
     */
    function getContractInitializer (sName) {
        return Object.prototype.hasOwnProperty.call(mContractsByName, sName) ?
            mContractsByName[sName] : null;
    }

    // "public class" -----------------------------------------------------------

    /**
     * Constructs a new representation (wrapper) of the CHIP with the given CHIP data as loaded from
     * the page building service.
     * <p>
     * Initially a stub is created which can load its CHIP definition XML later on in an asynchronous
     * fashion.
     * <p>
     * CHIPs are currently read-only and cannot be updated through the page building service.
     * (see {@link sap.ushell_abap.pbServices.ui2.PageBuildingService})
     *
     * @param {object} oAlterEgo
     *   the CHIP data as loaded via page building service
     * @param {sap.ushell_abap.pbServices.ui2.Factory} oFactory
     *  the factory
     *
     * @class
     * @since 1.2.0
     */
    var Chip = function (oAlterEgo, oFactory) {
        var that = this,
            oBags,
            /**
             * @type {string}
             * The URL of the CHIP definition XML (as base for the referenced files)
             */
            sChipUrl,
            /**
             * @type {map<string,string>}
             * The configuration as read from the CHIP spec in the page building service.
             * The values are already validated and typed correctly. (Must be initialized
             * after the CHIP definition XML has been parsed.)
             */
            oConfiguration,
            /**
             * @type {sap.ushell_abap.pbServices.ui2.ChipDefinition}
             * The data from the CHIP definition XML. If undefined, the CHIP is still a stub.
             */
            oDefinition,
            /**
             * @type {string}
             * Cached error message in case loading fails.
             */
            sErrorMessage,
            /**
             * @type {object}
             * Cached error information in case loading fails.
             */
            oErrorInformation,
            /**
             * List of all success and failure handlers passed to a <code>load()</code> call while this
             * CHIP is already loading its XML; these will all be called after initialization has
             * finished. This list is non-<code>null</code> iff. this CHIP is currently loading its XML.
             *
             * @see #load()
             */
            aLoadHandlers,
            /**
             * The remote catalog if there is one.
             */
            oRemoteCatalog,
            /**
             * whether the chip expects to be updated from a (remote) catalog
             */
            bWaitingForUpdateViaCatalog;

        // BEWARE: constructor code below!

        // "private" or hidden methods --------------------------------------------

        /**
         * Makes sure this CHIP is not just a stub.
         *
         * @private
         */
        function checkStub () {
            if (!oDefinition) {
                throw new SrvcError(that + ": CHIP is just a stub", "sap.ushell_abap.pbServices.ui2.Chip");
            }
        }

        /**
         * Initialize the bags from raw CHIP bags array.
         *
         * @param {object[]} aRawChipBags
         *   Array of raw CHIP bags
         *
         * @private
         */
        function initBags (aRawChipBags) {
            var i;

            oBags = new Utils.Map();
            if (!aRawChipBags) {
                return;
            }
            for (i = 0; i < aRawChipBags.length; i += 1) {
                // for each bag instance: create wrapper
                oBags.put(aRawChipBags[i].id, new Bag(oFactory, aRawChipBags[i]));
            }
        }

        /**
         * Initialize some details (which need only be computed once) in the given SAPUI5
         * implementation by decorating it with additional properties starting with "$".
         *
         * @param {object} oImplementation
         *   UI5 implementation
         * @private
         */
        function initSAPUI5 (oImplementation) {
            /*jslint regexp: true */
            var sBasePath = oImplementation.basePath,
                iLastSlash,
                aMatches,
                sNamespace,
                sViewName = oImplementation.viewName;

            if (oImplementation.componentName) {
                oImplementation.$Namespace = oImplementation.componentName;
            } else {
                // (namespace)/(viewName).view.(viewType)

                // eslint-disable-next-line no-useless-escape
                aMatches = /^(?:([^\/]+)\/)?(.*)\.view\.(.*)$/.exec(sViewName);
                if (!aMatches) {
                    throw new SrvcError(that + ": Illegal view name: " + sViewName, "Chip");
                }

                // determine namespace, view name, and view type
                sNamespace = aMatches[1];
                sViewName = aMatches[2];
                oImplementation.$ViewType = aMatches[3].toUpperCase(); // @see sap.ui.core.mvc.ViewType
                if (sNamespace) {
                    // prefix view name with namespace
                    sViewName = sNamespace + "." + sViewName;
                } else {
                    // derive namespace from view name's "package"
                    iLastSlash = sViewName.lastIndexOf(".");
                    if (iLastSlash < 1) {
                        throw new SrvcError(that + ": Missing namespace: " + sViewName, "Chip");
                    }
                    sNamespace = sViewName.substring(0, iLastSlash);
                }
                oImplementation.$Namespace = sNamespace;
                oImplementation.$ViewName = sViewName;
            }

            // if virtualNameSpace is set, carry with oImplementation
            var bVirtualNamespace = oImplementation.virtualNamespace;
            if (bVirtualNamespace) {
                oImplementation.$VirtualNamespace = bVirtualNamespace;
            }

            // URL prefix to load module for given namespace relative to CHIP definition XML
            oImplementation.$UrlPrefix = oImplementation.$Namespace.replace(/\./g, "/");
            if (sBasePath !== ".") {
                sBasePath = sBasePath.replace(/\/?$/, "/"); // ensure it ends with a slash
                oImplementation.$UrlPrefix = sBasePath + oImplementation.$UrlPrefix;
            }
            oImplementation.$UrlPrefix = that.toAbsoluteUrl(oImplementation.$UrlPrefix);
        }

        /**
         * Initializes the configuration, considers defaults set in the CHIP definition XML.
         *
         * @private
         */
        function initConfiguration () {
            oConfiguration = {};
            if (oDefinition.contracts.configuration && oDefinition.contracts.configuration.parameters) {
                // clone the parameters so that we can merge in oAlterEgo.configuration
                oConfiguration = JSON.parse(JSON.stringify(oDefinition.contracts.configuration.parameters));
            }
            that.updateConfiguration(oConfiguration, oAlterEgo.configuration);
        }

        /**
         * Initialize this CHIP using the given CHIP definition.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipDefinition} oNewDefinition
         *   the CHIP definition
         *
         * @private
         */
        function initialize (oNewDefinition) {
            var i1, n1;

            if (oDefinition) {
                throw new SrvcError(that + ": cannot initialize twice", null, "Chip");
            }
            oDefinition = oNewDefinition;
            oDefinition.contracts = oDefinition.contracts || {};

            if (!oDefinition.implementation || !oDefinition.implementation.sapui5) {
                throw new SrvcError(that + ": Missing SAPUI5 implementation", "Chip");
            }
            initSAPUI5(oDefinition.implementation.sapui5);

            initConfiguration();

            Log.debug("Initialized: " + that, null, "Chip");
            if (aLoadHandlers) {
                // initialization has finished, call all waiting success handlers
                for (i1 = 0, n1 = aLoadHandlers.length; i1 < n1; i1 += 2) {
                    aLoadHandlers[i1]();
                }
                aLoadHandlers = null;
            }
        }

        /**
         * Updates property bags with given raw data.
         *
         * @param {object[]} aRawChipBags
         *   Array of raw CHIP bags
         *
         * @private
         */
        this.updateBags = function (aRawChipBags) {
            var i, sKey, aExistingKeys = oBags.keys();
            for (i = 0; i < aRawChipBags.length; i += 1) {
                sKey = aRawChipBags[i].id;
                if (oBags.containsKey(sKey)) {
                    oBags.get(sKey).update(aRawChipBags[i]);
                    aExistingKeys.splice(aExistingKeys.indexOf(sKey), 1);
                } else {
                    oBags.put(sKey, new Bag(oFactory, aRawChipBags[i]));
                }
            }
            for (i = 0; i < aExistingKeys.length; i += 1) {
                oBags.remove(aExistingKeys[i]);
            }
        };

        // "public" methods -------------------------------------------------------

        /**
         * Creates the API object for a CHIP instance. Can only be called if the CHIP is not a stub
         * anymore.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oChipInstance
         *   the CHIP instance
         * @param {Utils.Map} [oContractsByName]
         *   CHIP instance's map from contract name to contract interface for page builder
         *   (since 1.11.0)
         * @returns {object}
         *   the API object
         * @since 1.2.0
         *
         * @see #isStub()
         * @see sap.ushell_abap.pbServices.ui2.ChipInstance#getContract()
         */
        this.createApi = function (oChipInstance, oContractsByName) {
            var oApi = {},
                oContract,
                fnInitializer,
                sName,
                mRequestedContracts;

            checkStub();
            mRequestedContracts = oDefinition.contracts;
            if (mRequestedContracts) {
                for (sName in mRequestedContracts) {
                    if (Object.prototype.hasOwnProperty.call(mRequestedContracts, sName)) {
                        fnInitializer = getContractInitializer(sName);
                        if (!fnInitializer) {
                            throw new SrvcError(this + ": Contract '" + sName + "' is not supported", "Chip");
                        }
                        oApi[sName] = {};
                        oContract = fnInitializer.call(oApi[sName], oChipInstance);
                        if (oContractsByName) {
                            oContractsByName.put(sName, oContract);
                        }
                    }
                }
            }
            return oApi;
        };

        /**
         * Returns the list of available types of visualization. The types are always lower case.
         *
         * @returns {string[]}
         *   the available tile types in lower case, e.g. <code>["tile", "link"]</code>
         * @private
         * @see chip.types.getAvailableTypes
         */
        this.getAvailableTypes = function () {
            var sTypes;
            checkStub();
            if (oDefinition.contracts.types &&
                oDefinition.contracts.types.parameters &&
                typeof oDefinition.contracts.types.parameters.supportedTypes === "string" &&
                oDefinition.contracts.types.parameters.supportedTypes !== "") {
                // convert all supported types to lower case to make comparison easier
                sTypes = oDefinition.contracts.types.parameters.supportedTypes.toLowerCase();
                // types are comma separated
                return sTypes.split(",");
            }
            return [];
        };

        /**
         * Returns the default type. The type is always lower case.
         * If no default type is specified "tile" is used if it is supported.
         * If no default type is specified and "tile" is not supported. The first supported one will be used
         *
         * @returns {string}
         *   the default tile type in lower case, e.g. <code>"tile"</code>
         * @private
         *
         * @since 1.86.0
         */
        this.getDefaultType = function () {
            //If you refactor this out make sure to call 'checkStub' as it is now called in 'getAvailableTypes'
            var aSupportedTypes = this.getAvailableTypes();

            if (oDefinition.contracts.types &&
                oDefinition.contracts.types.parameters &&
                typeof oDefinition.contracts.types.parameters.defaultType === "string" &&
                oDefinition.contracts.types.parameters.defaultType !== "") {
                var sDefaultType = oDefinition.contracts.types.parameters.defaultType;

                // the supported types are returned in lower case
                sDefaultType = sDefaultType.toLowerCase();
                if (aSupportedTypes.indexOf(sDefaultType) > -1) {
                    return sDefaultType;
                }
                throw new SrvcError("The chip has the default type: " + sDefaultType + " which is not supported");
            }
            if (aSupportedTypes.indexOf("tile") > -1) {
                return "tile";
            }
            if (aSupportedTypes.length > 0) {
                return aSupportedTypes[0];
            }
            return "";
        };

        /**
         * Returns the property bag with given ID attached to this CHIP.
         * <p>
         * If there is no bag with that ID <code>undefined</code> is returned.
         *
         * @param {string} sBagId
         *   the bag ID
         *
         * @returns {sap.ushell_abap.pbServices.ui2.Bag}
         *   the CHIP's bag for given ID
         * @private
         */
        this.getBag = function (sBagId) {
            if (!sBagId) {
                throw new SrvcError("Missing bag ID", "Chip");
            }

            return oBags.get(sBagId);
        };

        /**
         * Returns an array of bag IDs attached to this CHIP.
         *
         * @returns {string[]}
         *   array of bag IDs
         * @private
         */
        this.getBagIds = function () {
            return oBags.keys();
        };

        /**
         * Returns the id of this CHIP's base CHIP as defined by the page building service. Returns
         * the empty String if the CHIP does not have a base CHIP.
         *
         * @returns {string}
         *   the id of this CHIP's base CHIP. Empty string in case the CHIP has no base CHIP.
         * @see #isBasedOn()
         * @since 1.11.0
         */
        this.getBaseChipId = function () {
            return oAlterEgo.baseChipId;
        };

        /**
         * Returns the catalog by which this CHIP was loaded. The result may be
         * <code>undefined</code> if the CHIP is only a proxy and the actual
         * instance has been deleted in the backend server. This may happen for
         * CHIPs referenced by a chip instance.
         *
         * @returns {sap.ushell_abap.pbServices.ui2.Catalog}
         *   this CHIP's catalog or <code>undefined</code>
         * @since 1.19.0
         */
        this.getCatalog = function () {
            // CHIP from remote catalog
            if (oRemoteCatalog) {
                return oRemoteCatalog;
            }

            return oAlterEgo.$proxy ? undefined : oFactory.createCatalog(oAlterEgo.catalogId);
        };

        /**
         * Gets the value of a configuration parameter. Can only be called if the CHIP is not a stub
         * anymore.
         *
         * @param {string} sKey
         *   the name of the parameter
         * @returns {string}
         *   the value of the parameter or <code>undefined</code> if it does not exist
         * @since 1.2.0
         *
         * @see #isStub()
         */
        this.getConfigurationParameter = function (sKey) {
            checkStub();
            return oConfiguration[sKey];
        };

        /**
         * Returns the raw configuration of the OData CHIP entity ignoring defaults from
         * CHIP Definition XML.
         *
         * @returns {string}
         *   raw configuration of the OData CHIP entity; may be undefined
         * @private
         */
        this._getChipRawConfigurationString = function () {
            return oAlterEgo.configuration;
        };

        /**
         * Returns this CHIP's description as defined by the page building service.
         *
         * @returns {string}
         *   this CHIP's description
         * @since 1.2.0
         */
        this.getDescription = function () {
            return oAlterEgo.description;
        };

        /**
         * Returns this CHIP's ID.
         *
         * @returns {string}
         *   this CHIP's ID
         * @since 1.2.0
         */
        this.getId = function () {
            return oAlterEgo.id;
        };

        /**
         * Returns this CHIP's reference ID also known as the stable ID
         *
         * @returns {string}
         *  this CHIP's reference ID
         * @since 1.98.0
         * @private
         */
        this.getReferenceChipId = function () {
            return oAlterEgo.referenceChipId;
        };

        /**
         * Returns this CHIP instance's implementation of type SAPUI5 as a control. This control
         * represents the root of this CHIP instance's UI from a page builder point of view. Can only
         * be called if the CHIP is not a stub anymore.
         *
         * @param {object} oApi
         *   the CHIP instance specific API
         * @returns {sap.ui.core.Control}
         *   this CHIP instance's SAPUI5 implementation as a control
         * @since 1.2.0
         * @deprecated since 1.97. Use <code>getImplementationAsSapui5Async</code> instead
         *
         * @see #isStub()
         */
        this.getImplementationAsSapui5 = function (oApi) {
            var oData, oImplementation, sBaseChipId;

            Log.error("Deprecated API call of 'Chip.getImplementationAsSapui5'. Please use 'getImplementationAsSapui5Async' instead",
                null,
                "sap.ushell_abap.pbServices.ui2.Chip"
            );

            checkStub();
            oData = {
                /**
                 * @namespace
                 * The namespace for the instance specific CHIP API, which allows you to
                 * access the various contracts consumed by your CHIP instance.
                 */
                chip: oApi
            };
            oImplementation = oDefinition.implementation.sapui5;

            // In case the chip is used in FLP wave 2 or later context we load it from the standard path
            sBaseChipId = this.getBaseChipId();
            if ((sBaseChipId !== "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER") && (sBaseChipId !== "X-SAP-UI2-CHIP:/UI2/DYNAMIC_APPLAUNCHER")) {
                if (oImplementation.$VirtualNamespace) {
                    oImplementation.$absolutePath = this.toAbsoluteUrl(oImplementation.basePath);
                    sap.ui.loader.config({paths: JSON.parse("{\"" + oImplementation.$Namespace.replace(/\./g, "/") + "\":\"" + oImplementation.$absolutePath + "\"}")});
                } else {
                    sap.ui.loader.config({paths: JSON.parse("{\"" + oImplementation.$Namespace.replace(/\./g, "/") + "\":\"" + oImplementation.$UrlPrefix + "\"}")});
                }
            }

            if (oImplementation.componentName) {

                // The standard tiles have no manifest. Since we know this and are in control of it we can save the server roundtrip for those.
                if (sBaseChipId === "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER" || sBaseChipId === "X-SAP-UI2-CHIP:/UI2/DYNAMIC_APPLAUNCHER") {
                    oData.manifest = false;
                }

                // SAPUI5 component
                var ComponentContainer = sap.ui.requireSync("sap/ui/core/ComponentContainer"); // LEGACY API (deprecated)
                var oComponentContainer = new ComponentContainer();
                // load the content lazily to enable components using async interface
                this.oComponentPromise = new Promise(function (resolve, reject) {
                    sap.ui.require([
                        "sap/ui/core/Component"
                    ], function (Component) {
                        Component.create({
                            name: oImplementation.componentName,
                            componentData: oData
                        })
                            .then(function (oComponent) {
                                oComponentContainer.setComponent(oComponent);
                            })
                            .then(resolve)
                            .catch(reject);
                    });
                });

                return oComponentContainer;
            }

            // SAPUI5 MVC
            return sap.ui.view({ // LEGACY API (deprecated)
                type: oImplementation.$ViewType,
                viewName: oImplementation.$ViewName,
                viewData: oData
            });
        };

        /**
         * Returns this CHIP instance's implementation of type SAPUI5 as a control. This control
         * represents the root of this CHIP instance's UI from a page builder point of view. Can only
         * be called if the CHIP is not a stub anymore.
         *
         * @param {object} oApi
         *   the CHIP instance specific API
         * @returns {Promise<sap.ui.core.Control>}
         *   this CHIP instance's SAPUI5 implementation as a control
         * @since 1.97.0
         *
         * @see #isStub()
         */
        this.getImplementationAsSapui5Async = function (oApi) {
            try {
                checkStub();
            } catch (oError) {
                return Promise.reject(oError);
            }

            return new Promise(function (resolve, reject) {
                sap.ui.require([
                    "sap/ui/core/ComponentContainer",
                    "sap/ui/core/Component",
                    "sap/ui/core/mvc/View"
                ], function (ComponentContainer, Component, View) {
                    var oData = {
                        /**
                         * @namespace
                         * The namespace for the instance specific CHIP API, which allows you to
                         * access the various contracts consumed by your CHIP instance.
                         * @private
                         */
                        chip: oApi
                    };
                    var oImplementation = oDefinition.implementation.sapui5;

                    // In case the chip is used in FLP wave 2 or later context we load it from the standard path
                    var sBaseChipId = this.getBaseChipId();
                    if ((sBaseChipId !== "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER") && (sBaseChipId !== "X-SAP-UI2-CHIP:/UI2/DYNAMIC_APPLAUNCHER")) {
                        if (oImplementation.$VirtualNamespace) {
                            oImplementation.$absolutePath = this.toAbsoluteUrl(oImplementation.basePath);
                            sap.ui.loader.config({paths: JSON.parse("{\"" + oImplementation.$Namespace.replace(/\./g, "/") + "\":\"" + oImplementation.$absolutePath + "\"}")});
                        } else {
                            sap.ui.loader.config({paths: JSON.parse("{\"" + oImplementation.$Namespace.replace(/\./g, "/") + "\":\"" + oImplementation.$UrlPrefix + "\"}")});
                        }
                    }

                    if (oImplementation.componentName) {
                        var bLoadManifest = true;

                        // The standard tiles have no manifest. Since we know this and are in control of it we can save the server roundtrip for those.
                        if (sBaseChipId === "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER" || sBaseChipId === "X-SAP-UI2-CHIP:/UI2/DYNAMIC_APPLAUNCHER") {
                            bLoadManifest = false;
                        }

                        if (!_oComponentPromiseCache[oImplementation.componentName]) {
                            _oComponentPromiseCache[oImplementation.componentName] = Component.create({
                                name: oImplementation.componentName,
                                componentData: oData,
                                manifest: bLoadManifest
                            });

                            return _oComponentPromiseCache[oImplementation.componentName]
                                .then(function (oComponent) {
                                    return new ComponentContainer({
                                        component: oComponent
                                    });
                                })
                                .then(resolve)
                                .catch(reject);
                        }

                        return _oComponentPromiseCache[oImplementation.componentName]
                            .then(function () {
                                // SAPUI5 component
                                return Component.create({
                                    name: oImplementation.componentName,
                                    componentData: oData,
                                    manifest: bLoadManifest
                                });
                            })
                            .then(function (oComponent) {
                                return new ComponentContainer({
                                    component: oComponent
                                });
                            })
                            .then(resolve)
                            .catch(reject);
                    }

                    // SAPUI5 MVC
                    return View.create({
                        type: oImplementation.$ViewType,
                        viewName: oImplementation.$ViewName,
                        viewData: oData
                    })
                        .then(resolve)
                        .catch(reject);
                }.bind(this));
            }.bind(this));
        };

        /**
         * Returns the catalog by which this remote CHIP was loaded. This catalog is
         * <code>undefined</code> if the CHIP is from the same system as the catalog.
         *
         * @returns {sap.ushell_abap.pbServices.ui2.Catalog}
         *   this CHIP's remote catalog or <code>undefined</code>
         * @since 1.9.0
         */
        this.getRemoteCatalog = function () {
            return oRemoteCatalog;
        };

        /**
         * Returns this CHIP's title as defined by the page building service or the CHIP definition XML
         * (if available).
         *
         * @returns {string}
         *   this CHIP's title
         * @since 1.2.0
         */
        this.getTitle = function () {
            return oAlterEgo.title
                || (oDefinition && oDefinition.appearance && oDefinition.appearance.title);
        };

        /**
         * Checks whether this CHIP is based on the given CHIP instance. This can happen because there
         * is a catalog type which is built on a catalog page. In such a case the ABAP backend maps
         * each CHIP instance on that page to a CHIP in the resulting catalog.
         * <p>
         * Note: This CHIP's <code>baseChipId</code> is exactly non-empty if the CHIP is catalog-page
         * based. Then it is the ID of the CHIP used to build the CHIP instance. (This is recursive.
         * So if that CHIP is again catalog-page based...)
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oChipInstance
         *   the CHIP instance to compare with
         * @returns {boolean}
         *   <code>true</code> iff the CHIP is based on the given CHIP instance
         * @since 1.19.1
         * @see #refresh()
         */
        this.isBasedOn = function (oChipInstance) {
            var sExpectedId
                = "X-SAP-UI2-PAGE:" + oChipInstance.getPage().getId()
                + ":" + oChipInstance.getId();

            /**
             * @param {string} sActualId
             * @returns {boolean}
             * @private
             */
            function matchesExpectation (sActualId) {
                // TODO use oAlterEgo.catalogPageChipInstanceId
                return sActualId === sExpectedId
                    || sActualId.indexOf(sExpectedId + ":") === 0; // old IDs still contain the scope
            }

            return (oAlterEgo.referenceChipId && matchesExpectation(oAlterEgo.referenceChipId))
                || matchesExpectation(oAlterEgo.id);
        };

        /**
         * Tells whether this CHIP is a reference, pointing to its original CHIP.
         * Note: A refresh on the CHIP may be needed before calling this method, but only if the CHIP
         * is based on a catalog page and that corresponding catalog page may be updated in your use
         * case after the CHIP has been loaded.
         *
         * @returns {boolean}
         *   whether this CHIP is a reference
         * @since 1.19.1
         * @see #refresh()
         *
         */
        this.isReference = function () {
            return !!oAlterEgo.referenceChipId;
        };

        /**
         * Tells whether this CHIP is a broken reference,
         * as indicated by referenceChipId being set to "O" (Orphaned)
         *
         * @returns {boolean}
         *   whether this CHIP is a broken reference
         * @since 1.23.1
         *
         */
        this.isBrokenReference = function () {
            // If an underlying chip of a reference is deleted, the property referenceChipId is set
            // to "O" (Orphaned)
            return oAlterEgo.referenceChipId === "O";
        };

        /**
         * Tells whether this CHIP is still only a stub and does not yet know its CHIP definition XML.
         *
         * @returns {boolean}
         *   whether this CHIP is still only a stub
         * @since 1.2.0
         *
         * @see #load()
         */
        this.isStub = function () {
            return !oDefinition;
        };

        /**
         * Loads the CHIP definition XML in case this has not yet been done. If this CHIP is not a stub
         * anymore this method fails!
         *
         * @param {function} fnSuccess
         *   no-args success handler
         * @param {function(string, object=)} [fnFailure]
         *   error handler taking an error message and, since version 1.28.6, an
         *   optional object containing the complete error information as delivered
         *   by the ODataService. See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details.
         *   If not given
         *   <code>{@link sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler}</code> is used.
         * @since 1.2.0
         *
         * @see #isStub()
         */
        this.load = function (fnSuccess, fnFailure) {
            function onError (sErrMessage, oErrDetails) {
                // loading has failed, call all waiting error handlers
                sErrorMessage = sErrMessage;
                oErrorInformation = oErrDetails;
                var i, n;
                if (aLoadHandlers) {
                    for (i = 1, n = aLoadHandlers.length; i < n; i += 2) {
                        aLoadHandlers[i](sErrMessage, oErrDetails);
                    }
                    aLoadHandlers = null;
                }
            }

            // Note: might fail synchronously!
            function createChipDefinition () {
                if (oFactory) { // Note: factory is optional!
                    oFactory.createChipDefinition(oAlterEgo.url, initialize, onError);
                    return;
                }
                Utils.get(oAlterEgo.url, /*XML=*/true,
                    function (oXml) {
                        Log.debug("Loaded: " + that, null, "Chip");
                        initialize(new ChipDefinition(oXml));
                    }, onError);
            }

            function onChipUpdated () {
                if (!oAlterEgo.url) {
                    if (bWaitingForUpdateViaCatalog) {
                        throw new SrvcError("Remote catalog did not deliver CHIP '" + oAlterEgo.id
                            + "'", "Chip");
                    }
                    throw new SrvcError("Missing module URL", "Chip");
                }
                bWaitingForUpdateViaCatalog = false;
                sChipUrl = Utils.absoluteUrl(oAlterEgo.url);
                createChipDefinition();
            }

            if (!this.isStub()) {
                throw new SrvcError("Chip is not a stub anymore", "Chip");
            }
            if (typeof fnSuccess !== "function") {
                throw new SrvcError("Missing success handler", "Chip");
            }
            fnFailure = fnFailure || oFactory.getPageBuildingService().getDefaultErrorHandler();

            if (sErrorMessage) { // NOTE: check sErrorMessage only
                Utils.callHandler(fnFailure.bind(null, sErrorMessage, oErrorInformation), null, true);
                return;
            }

            if (aLoadHandlers) {
                // wait until loading has finished (one way or the other)
                aLoadHandlers.push(fnSuccess, fnFailure);
                return;
            }

            // start loading
            if (oAlterEgo.url) {
                createChipDefinition();
            } else if (oAlterEgo.remoteCatalogId) {
                // a remote chip, request the catalog to update all registered CHIPs (incl. this one)
                this.getRemoteCatalog().readRegisteredChips(onChipUpdated, onError);
                bWaitingForUpdateViaCatalog = true;
            } else {
                // this looks like a null object, try to read our raw data and expect a failure
                // Note: might fail synchronously!
                oFactory.getPageBuildingService().readChip(
                    oAlterEgo.id,
                    function (oRawChip) {
                        oAlterEgo = oRawChip;
                        onChipUpdated();
                    },
                    onError
                );
            }
            aLoadHandlers = [fnSuccess, fnFailure];
        };

        /**
         * Refreshes the CHIP from the OData service. Use this only for CHIPs that you received via a
         * catalog. When called on a CHIP received via a page, the function may fail.
         * <p>
         * This method is intended to refresh a CHIP in a catalog based on a catalog page. Such a CHIP
         * is based on a CHIP instance of this catalog page. If such a CHIP instance is changed this
         * method can be used to refresh the corresponding CHIP.
         * <p>
         * Note: This method does not replace the {@link #load} method, as the CHIP definition is not
         * loaded. Thus, if the CHIP was a stub before the refresh, it is still a stub afterwards.
         *
         * @param {function} fnSuccess
         *   no-args success handler
         * @param {function(string, object=)} [fnFailure]
         *   error handler taking an error message and, since version 1.28.6, an
         *   optional object containing the complete error information as delivered
         *   by the ODataService. See fnFailure parameter of {@link sap.ushell_abap.pbServices.ui2.ODataWrapper#onError}
         *   for more details.
         *   If not given
         *   <code>{@link sap.ushell_abap.pbServices.ui2.ODataService#getDefaultErrorHandler}</code> is used
         * @since 1.16.5
         *
         * @see #load()
         * @see #isStub()
         * @see #isBasedOn()
         */
        this.refresh = function (fnSuccess, fnFailure) {
            function updateChip (oNewAlterEgo) {
                oAlterEgo.title = oNewAlterEgo.title;
                oAlterEgo.configuration = oNewAlterEgo.configuration;
                oAlterEgo.referenceChipId = oNewAlterEgo.referenceChipId;
                initBags(oNewAlterEgo.ChipBags && oNewAlterEgo.ChipBags.results);
                // All other fields cannot be changed via the corresponding CHIP instance.
                // TODO throw exception if URL changes?
                if (!that.isStub()) {
                    that.updateConfiguration(oConfiguration, oAlterEgo.configuration);
                }
                fnSuccess();
            }

            function updateRemoteChip (oResult) {
                if (oResult.results[0]) {
                    updateChip(oResult.results[0]);
                } else {
                    fnFailure = fnFailure || oFactory.getPageBuildingService().getDefaultErrorHandler();
                    fnFailure("Could not refresh CHIP. No update received from catalog "
                        + oAlterEgo.remoteCatalogId);
                }
            }

            if (typeof fnSuccess !== "function") {
                throw new SrvcError("Missing success handler", "Chip");
            }
            if (!oAlterEgo.url) {
                throw new SrvcError(that + ": CHIP is just a stub", "Chip");
            }
            if (oAlterEgo.remoteCatalogId) {
                this.getRemoteCatalog().readChips([oAlterEgo.id], updateRemoteChip, fnFailure);
            } else {
                oFactory.getPageBuildingService().readChip(oAlterEgo.id, updateChip, fnFailure);
            }
        };

        /**
         * Updates the CHIP. This is an internal function, used when a "preliminary" object has been
         * created and the data from the page building service are delivered together with another
         * object (e.g. the catalog).
         *
         * @param {object} oNewAlterEgo
         *   the CHIP data as loaded via page building service
         * @private
         * @throws Error when the update data do not match or when the CHIP already is complete
         */
        this.update = function (oNewAlterEgo) {
            // was erroneously publicly documented in 1.18 and made @private in 1.19.0
            if (typeof oNewAlterEgo !== "object" || oNewAlterEgo.id !== this.getId()) {
                throw new SrvcError("Invalid update data: " + this, "Chip");
            }
            // update bags if available
            if (oNewAlterEgo.ChipBags && oNewAlterEgo.ChipBags.results) {
                this.updateBags(oNewAlterEgo.ChipBags && oNewAlterEgo.ChipBags.results);
            }

            if (oAlterEgo.url) {
                return; // No more update, please!
            }
            if (!oNewAlterEgo.url) {
                return; // This is not really an update!
            }
            oAlterEgo = oNewAlterEgo;
            sChipUrl = Utils.absoluteUrl(oAlterEgo.url);
            Log.debug("Updated: " + this, null, "Chip");
        };

        /**
         * Updates the given parameter map from the given JSON string. All parameters that actually were
         * defined in the CHIP definition XML are accepted. All others will raise a warning to the log.
         *
         * @param {Object<string,string>} mParameters
         *   the parameter map to fill
         * @param {Object<string,string>|string} vConfigurationUpdates
         *   the configuration updates as parameter map or as JSON string
         *   <p>If one parameter value is <code>undefined</code> (which can only happen by supplying a
         *   map) then this property is removed from <code>mParameters</code>.
         *
         * @since 1.2.0
         */
        this.updateConfiguration = function (mParameters, vConfigurationUpdates) {
            var mConfigurationUpdates,
                sKey,
                sValue;
            if (!vConfigurationUpdates) {
                return;
            }
            if (typeof vConfigurationUpdates === "string") {
                try {
                    mConfigurationUpdates = JSON.parse(vConfigurationUpdates);
                } catch (e) {
                    // configuration as a whole is incorrect and will be ignored
                    // Note: toString(true) will also output configuration, thus it is no secret
                    Log.warning(this + ': ignoring invalid configuration "'
                        + vConfigurationUpdates + '"', null, "Chip");
                    return;
                }
            } else {
                mConfigurationUpdates = vConfigurationUpdates;
            }
            for (sKey in mConfigurationUpdates) {
                if (Object.prototype.hasOwnProperty.call(mConfigurationUpdates, sKey)) {
                    if (Object.prototype.hasOwnProperty.call(oConfiguration, sKey)) {
                        sValue = mConfigurationUpdates[sKey];
                        if (sValue === undefined) {
                            delete mParameters[sKey];
                        } else if (typeof sValue !== "string") {
                            throw new SrvcError("Value for '" + sKey + "' must be a string", "Chip");
                        } else {
                            mParameters[sKey] = sValue;
                        }
                    } else {
                        Log.warning(this + ": ignoring unknown configuration parameter " + sKey, null, "Chip");
                    }
                }
            }
        };

        /**
         * Makes the given relative URL absolute. URLs containing host and/or protocol
         * and URLs with an absolute path remain unchanged. The URL is in no way
         * normalized; the function takes the URL of the CHIP definition XML as base.
         *
         * @param {string} sUrl
         *   the (possibly server-relative) URL
         * @returns {string}
         *   the absolute URL
         * @since 1.2.0
         */
        this.toAbsoluteUrl = function (sUrl) {
            return Utils.absoluteUrl(sUrl, sChipUrl);
        };

        /**
         * Returns this CHIP's string representation.
         *
         * @param {boolean} [bVerbose=false]
         *   flag whether to show all properties
         * @returns {string}
         *   this CHIP's string representation
         * @since 1.2.0
         */
        this.toString = function (bVerbose) {
            var aResult = [
                'Chip({sChipUrl:"', sChipUrl, '"'
            ];
            if (bVerbose) {
                aResult.push(",oAlterEgo:", JSON.stringify(oAlterEgo),
                    ",oBags:", oBags.toString(),
                    ",oDefinition:", JSON.stringify(oDefinition)
                );
            }
            aResult.push("})");
            return aResult.join("");
        };

        /**
         * This method can be used to figure out if the CHIP initially existed.
         * This is only relevant when the CHIP navigation property was expanded
         * (OData $expand).
         *
         * @param {boolean} bDefined defined
         * @returns {boolean} Whether the CHIP initially existed.
         *
         * @private
         */
        this.isInitiallyDefined = function (bDefined) {
            return bDefined;
        }.bind(
            null,
            oAlterEgo && !oAlterEgo.hasOwnProperty("$proxy") // $proxy (set from factory) when null
        );

        // for test purposes -------------------------------------------------------

        this._setDefinition = function (oNewDefinition) {
            oDefinition = oNewDefinition;
        };

        // constructor code -------------------------------------------------------
        if (!oAlterEgo) {
            throw new SrvcError("Missing CHIP description", "Chip");
        }

        sChipUrl = Utils.absoluteUrl(oAlterEgo.url);
        if (oAlterEgo.remoteCatalogId) {
            oRemoteCatalog = oFactory.createCatalog(oAlterEgo.remoteCatalogId);
            if (!oAlterEgo.url) {
                oRemoteCatalog.registerChip(this);
            }
        }
        initBags(oAlterEgo.ChipBags && oAlterEgo.ChipBags.results);
        Log.debug("Created: " + this, null, "Chip");
    };

    // "public" methods (static) ------------------------------------------------

    /**
     * Adds a contract to the list of known contracts which can be consumed by CHIPs.
     *
     * @param {string} sName
     *   The name of the contract.
     * @param {function(sap.ushell_abap.pbServices.ui2.ChipInstance)} fnInitializer
     *   This function will initialize the contract for a CHIP instance. When the API object for a
     *   CHIP instance requesting this contract is initialized, a sub-object with the contract's name
     *   is added to the API. The initializer is then called with this sub-object as <code>this</code>
     *   and the CHIP instance as parameter.
     * @since 1.2.0
     */
    Chip.addContract = function (sName, fnInitializer) {
        if (getContractInitializer(sName)) {
            throw new SrvcError("Cannot register contract '" + sName + "' twice", "Chip");
        }
        mContractsByName[sName] = fnInitializer;
    };


    /**
     * Removes a contract from the list of known contracts which can be consumed by CHIPs. Does not
     * fail even if the contract was not known before!
     * Note: Only used in test code
     *
     * @param {string} sName
     *   The name of the contract.
     * @since 1.11.0
     * @private
     */
    Chip.removeContract = function (sName) {
        delete mContractsByName[sName];
    };

    // Add "navigation" contract stub as this is requested in some cases for historic reasons - but not used in FLP scenarios
    if (!mContractsByName.navigation) {
        Chip.addContract("navigation", function (oChipInstance) {
            this.navigateToUrl = function (sUrl, oSettings) {
                throw new SrvcError("'navigation' contract not implemented!");
            };
        });
    }

    // for test purposes -------------------------------------------------------

    Chip.prototype._clearComponentCache = function () {
        _oComponentPromiseCache = {};
    };

    return Chip;
});
