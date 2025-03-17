// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/utils",
    "sap/ushell/services/PersonalizationV2",
    "sap/ui/thirdparty/jquery"
], function (
    Container,
    utils,
    Personalization,
    jQuery
) {
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

    function mockGetService () {
        var oGetServiceStub = sinon.stub(Container, "getServiceAsync");
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
       Container.getServiceAsync.restore();
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
        mockGetService: mockGetService,
        restoreGetService: restoreGetService,
        createPersonalizationService: createPersonalizationService
    };
}, false /* bExport */);
