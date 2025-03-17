sap.ui.define([
    "sap/ui/core/util/MockServer"
], function(MockServer) {
    "use strict";

    var PACKAGE = "test/sap/apf/testhelper/mockServerCloudFoundry";
    var CATALOG = "/sap/opu/odata/iwfnd/catalogservice;v=2/";

    return {
        /**
         * Initializes the mock server.
         * You can configure the delay with the URL parameter "serverDelay".
         * The local mock data in this folder is returned instead of the real data for testing.
         * @public
         */
        init: function() {
            /* CatalogService (OData) */
            this.mockCatalogService = new MockServer({
                rootUri: "/destination/testdestination1" + CATALOG
            });
            var sBaseUrl = sap.ui.require.toUrl(PACKAGE);
            this.mockCatalogService.simulate(sBaseUrl + "/metadata.xml", {
                sMockdataBaseUrl: sBaseUrl + "/mockdata",
                bGenerateMissingMockData: true
            });
            this.mockCatalogService.start();

            this.mockODataList = new MockServer({
                rootUri: "/destination/testdestination2/odata/v2/",
                requests: [
                    {
                        method: "GET",
                        path: "/?",
                        response: function(xhr) {
                            xhr.respond(200, {},
                                "<h1>\n" +
                                "OData endpoints: \n" +
                                "</h1>\n\n" +
                                "<a href=\"https://first-odata-service/\"></a>\n" +
                                "<a href=\"https://second-odata-service/\"></a>\n" +
                                "Some text without meaning to the odata list .."
                            );
                        }
                    }
                ]
            });
            this.mockODataList.start();

            this.mockServiceMetadata = new MockServer({
                rootUri: "/destination/testdestination4/$metadata",
                requests: [
                    {
                        method: "GET",
                        path: "/?",
                        response: function(xhr) {
                            xhr.respond(200, {}, "<?xml version='1.0' encoding='utf-8'?><service xml:base=\"http://test4.de/odata/v2/service/\" xmlns=\"http://www.w3.org/2007/app\" xmlns:atom=\"http://www.w3.org/2005/Atom\"><workspace><atom:title>Default</atom:title></workspace></service>");
                        }
                    }
                ]
            });
            this.mockServiceMetadata.start();

            /* Destinations-List */
            this.mockDestinationService = new MockServer({
                rootUri: "/sap/apf/destination-catalog/v1/",
                requests: [
                    {
                        method: "GET",
                        path: "Destinations",
                        response: function(xhr) {
                            xhr.respondJSON(200, {}, {
                                destinations: [
                                    { name: "testdestination1", description: "This is a Destination", url: "http://test1.de", proxyType: "OnPremise" },
                                    { name: "testdestination2", description: "Another Destination", url: "http://test2.de", proxyType: "Internet" },
                                    { name: "testdestination3", description: "Weird Destination", url: "http://test3.de", proxyType: "OnPremise" },
                                    { name: "testdestination4", description: "Actually a Service", url: "http://test4.de/odata/v2/service/", proxyType: "Internet" }
                                ]
                            });
                        }
                    }
                ]
            });
            this.mockDestinationService.start();
        }
    };

});
