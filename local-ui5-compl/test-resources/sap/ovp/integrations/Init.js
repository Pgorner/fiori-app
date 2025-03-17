sap.ui.require(["sap/ui/core/Core"], (Core) => {
    Core.ready().then(() => {
        sap.ui.require(["OVPMock/mockservers"], (mockservers) => {
            mockservers.loadMockServer("../data/salesorder/", "/sap/opu/odata/sap/salesorder/");
            mockservers.loadMockServer("../data/salesshare_srv/", "/sap/opu/odata/sap/salesshare_srv/");
            mockservers.loadMockServer("../data/salesshare/", "/sap/opu/odata/sap/salesshare/");
            mockservers.loadMockServer("../data/purchaseorder/", "/sap/opu/odata/sap/purchaseorder/");
        });
    })
});