// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview Ui5 Native Service Factory
 *
 * @version 1.132.1
 */

sap.ui.define([
    "sap/ui/core/service/ServiceFactory"
],
    function (ServiceFactory) {
        "use strict";

        /**
         * @alias sap.ushell.Ui5NativeServiceFactory
         * @namespace
         *
         * @private
         */
        var oUi5NativeServiceFactory = {
            _servicePromises: {},

            /**
             * Creates UI5 service factories for the given service name. The once created service
             * instances are reused on every service instantiation.
             *
             * @param {string} sServiceName The card service name
             * @returns {object} The card service factory
             */
            createServiceFactory: function (sServiceName) {
                var oServicePromises = this._servicePromises;
                var Ui5NativeServiceFactory = ServiceFactory.extend("sap.ushell.ui5Service." + sServiceName + "Factory", {
                    createInstance: function () {
                        var oServicePromise = oServicePromises[sServiceName];

                        if (!oServicePromise) {
                            oServicePromise = new Promise(function (resolve, reject) {
                                sap.ui.require(["sap/ushell/ui5service/" + sServiceName], function (Service) {
                                    var oService;

                                    if (!Service) {
                                        reject();
                                    }
                                    oService = new Service();
                                    resolve(oService);
                                });
                            });
                            oServicePromises[sServiceName] = oServicePromise;
                        }

                        return oServicePromise;
                    }
                });

                return new Ui5NativeServiceFactory();
            }
        };

    return oUi5NativeServiceFactory;

});
