// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.LogonSystem
 * @deprecated since 1.120
 */
sap.ui.define([
    "sap/ushell/components/factsheet/tools/ODataUrlTemplating"
], function (ODataUrlTemplating) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap.ushell.components.factsheet.tools.ODataUrlTemplating", {
        /**
         * This method is called after each test. Add every restoration code
         * here.
         */
        afterEach: function () {
        }
    });

    QUnit.test("resolve good data", function (assert) {
        var oTempl, oResult, oTestData, i;
        oTempl = ODataUrlTemplating;

        assert.ok(oTempl !== undefined, "ODataUrlTemplating loaded");

        // extract hash from url

        oTestData = [{
            entityTemplateURI: "/sap/opu/odata/sap/CB_MAINTENANCE_ORDER_SRV/MaintenanceOrders('{MaintenanceOrder}')",
            FunctionalLocation: "4000003",
            MaintenanceOrder: "4000003",
            entityURI: "/sap/opu/odata/sap/CB_MAINTENANCE_ORDER_SRV/MaintenanceOrders('4000003')"
        }, {
            entityTemplateURI: "/sap/opu/odata/sap/CB_CONTRACT_SRV/Contracts(binary'{GUID}')",
            GUID: "DD102320D87968F1997900300577E931",
            entityURI: "/sap/opu/odata/sap/CB_CONTRACT_SRV/Contracts(binary'DD102320D87968F1997900300577E931')"
        }, {
            entityTemplateURI: "/sap/opu/odata/sap/CB_SITE_SRV/WRF3s(SiteCustomer='{SiteCustomer}',ValidityEndDate=datetime'{ValidityEndDate}',"
                + "ValidityStartDate=datetime'{ValidityStartDate}',SupplyingSite='{SupplyingSite}',MerchandiseCategory='{MerchandiseCategory}')",
            SiteCustomer: "R300",
            ValidityEndDate: "9999-12-31T00%3A00%3A00",
            ValidityStartDate: "2013-09-24T00%3A00%3A00",
            MerchandiseCategory: "",
            SupplyingSite: "R100",
            entityURI: "/sap/opu/odata/sap/CB_SITE_SRV/WRF3s(SiteCustomer='R300',ValidityEndDate=datetime'9999-12-31T00%3A00%3A00',"
                + "ValidityStartDate=datetime'2013-09-24T00%3A00%3A00',SupplyingSite='R100',MerchandiseCategory='')"
        }];

        // Test good data
        for (i = oTestData.length - 1; i >= 0; i -= 1) {
            oResult = oTempl.resolve(oTestData[i].entityTemplateURI, oTestData[i]);
            assert.equal(oResult, oTestData[i].entityURI, "Template resolved: " + oResult);
        }
    });

    QUnit.test("resolve bad data", function (assert) {
        var oTempl, oBadData, i, testException;
        oTempl = ODataUrlTemplating;

        assert.ok(oTempl !== undefined, "ODataUrlTemplating loaded");
        oBadData = [{
            entityTemplateURI: "/sap/opu/odata/sap/CB_MAINTENANCE_ORDER_SRV/MaintenanceOrders('{MaintenanceOrder}')",
            MaintenanceOrders: "4000003",
            entityURI: "/sap/opu/odata/sap/CB_MAINTENANCE_ORDER_SRV/MaintenanceOrders('4000003')"
        }];

        // Test exceptions for bad data
        for (i = oBadData.length - 1; i >= 0; i -= 1) {
            testException = (function (badData) {
                return function () {
                    oTempl.resolve(badData.entityTemplateURI, badData);
                };
            })(oBadData[i]);
            assert.throws(testException,
                ODataUrlTemplating.ParameterException,
                "succesfully throwed ParameterException"
            );
        }
    });
});
