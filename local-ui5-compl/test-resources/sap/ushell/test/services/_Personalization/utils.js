// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The Unified Shell's personalization service utils.
 *
 * @version 1.132.1
 * @deprecated since 1.120 Please use {@link sap.ushell.services.PersonalizationV2} instead
 */
sap.ui.define([
    "sap/ushell/utils",
    "sap/ushell/services/Personalization",
    "sap/ui/thirdparty/jquery"
], function (utils, Personalization, jQuery) {
    "use strict";

    /* global sinon */

    function createPersonalizationAdapterMock (AdapterContainerMock) {
        var PersonalizationAdapterMock = function (oSystem) {
            this._sCONTAINER_PREFIX = "sap.ushell.personalization#";
            this._oContainerMap = new utils.Map();
            this._oErrorMap = new utils.Map(); // has to be outside the container
        };

        PersonalizationAdapterMock.prototype.setErrorProvocation = function (sContainerKey) {
            this._oErrorMap.put(this._sCONTAINER_PREFIX + sContainerKey, true);
        };

        PersonalizationAdapterMock.prototype.resetErrorProvocation = function (sContainerKey) {
            this._oErrorMap.put(this._sCONTAINER_PREFIX + sContainerKey, false);
        };

        // ---- Container ----
        PersonalizationAdapterMock.prototype.getAdapterContainer = function (sContainerKey) {
            var oContainer = {};

            if (this._oContainerMap.containsKey(sContainerKey)) {
                oContainer = this._oContainerMap.get(sContainerKey);
            } else {
                oContainer = new AdapterContainerMock(sContainerKey);
                oContainer._oErrorMap = this._oErrorMap; // dirty injection to keep the API of all adapters the same
                this._oContainerMap.put(sContainerKey, oContainer);
            }
            return oContainer;
        };

        PersonalizationAdapterMock.prototype.delAdapterContainer = function (sContainerKey) {
            var oDeferred = new jQuery.Deferred();

            this._oContainerMap.get(sContainerKey);
            if (this._oErrorMap.get(sContainerKey)) {
                oDeferred.reject();
            } else {
                oDeferred.resolve();
            }
            this._oContainerMap.remove(sContainerKey);
            return oDeferred.promise();
        };

        return PersonalizationAdapterMock;
    }

    function ensureSapUshellContainer () {
        sap = sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || {
            getService: function () { },
            getServiceAsync: function () { return Promise.resolve(); },
            getUser: function () {
                return {
                    getLanguage: function () { }
                };
            },
            getLogonSystem: function () {
                return {
                    getClient: function () { },
                    isTrial: function () { }
                };
            }
        };
    }

    function mockGetService () {
        ensureSapUshellContainer();

        var oGetServiceStub = sinon.stub(sap.ushell.Container, "getService");
        oGetServiceStub.withArgs("AppLifeCycle").returns({
            getCurrentApplication: sinon.stub().returns(undefined) /* important, see ContextContainer#_init */
        });
        oGetServiceStub.withArgs("ShellNavigationInternal").returns({
            registerNavigationFilter: sinon.stub().returns(undefined) /* important, see sap/ui/fl/apply/_internal/flexState/FlexState */
        });
        oGetServiceStub.withArgs("URLParsing").returns({
            parseShellHash: sinon.stub().returns(undefined) /* important, see sap/ui/fl/apply/_internal/flexState/FlexState */
        });
        oGetServiceStub.returns({});
    }

    function restoreGetService () {
        sap.ushell.Container.getService.restore();
    }

    /**
     * Creates the personalization service instance based on a certain
     * configuration (e.g., mocked adapters).
     *
     * @param {object} oConfig
     *   A build configuration like:
     *   <pre>
     *   {
     *      adapterContainerConstructor: <function>
     *   }
     *   </pre>
     *
     * @returns {object}
     *   The personalization service.
     * @private
     */
    function createPersonalizationService (oConfig) {
        var PersonalizationAdapterMock = createPersonalizationAdapterMock(oConfig.adapterContainerConstructor);

        var oAdapter = new PersonalizationAdapterMock({} /* oSystem */);
        var oService = new Personalization(oAdapter);

        return oService;
    }

    return {
        createPersonalizationAdapterMock: createPersonalizationAdapterMock,
        ensureSapUshellContainer: ensureSapUshellContainer,
        mockGetService: mockGetService,
        restoreGetService: restoreGetService,
        createPersonalizationService: createPersonalizationService
    };
}, false /* bExport */);
