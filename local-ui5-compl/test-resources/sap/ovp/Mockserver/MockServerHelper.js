sap.ui.define([
    "test-resources/sap/ovp/Mockserver/mockServer",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/core/Component"
], function (MockServer, ODataModel, CoreComponent) {
    "use strict";

    var oMockServer;
    var oMockServerInfo = {
        startServer: function (sPathUrl) {
            oMockServer = new MockServer();
            var that = this;
            that.oDataObject = that.oDataObject || {};
            return oMockServer.started.then(function () {
                var sUrl = sPathUrl ? sPathUrl : "/sap/opu/odata4/IWBEP/V4_SAMPLE/default/IWBEP/V4_GW_SAMPLE_BASIC/0001/";
                var mModelOptions = {
                        serviceUrl: sUrl,
                        groupId: "$direct",
                        autoExpandSelect: true,
                        operationMode: "Server"
                    },
                    oModel = new ODataModel(mModelOptions);
                that.oDataObject.oModel = oModel;
                return oModel;
            })
        },
        closeServer: function () {
            oMockServer && oMockServer.destroy();
            this.oDataObject && this.oDataObject.oComponent && this.oDataObject.oComponent.destroy();
            this.oDataObject && this.oDataObject.oModel && this.oDataObject.oModel.destroy();
            this.oDataObject && this.oDataObject.oView && this.oDataObject.oView.destroy();
            oMockServer = undefined;
            this.oDataObject = undefined;
        },
        getCardData: function () {
            return this.oDataObject || {};
        },
        createXMLView: function (oConfig, oModel) {
            var that = this;
            that.oDataObject = that.oDataObject || {};
            return oModel.getMetaModel().fetchObject("/").then(function () {
                return CoreComponent.create({
                    name: oConfig.template,
                    componentData: {
                        cardId: oConfig.id,
                        getComponentData: function () {
                            return this;
                        },
                        appComponent: {
                            containerLayout: "",
                            getModel: function (sDummy) {
                                return {
                                    getProperty: function () {
                                        return [];
                                    },
                                    setProperty: function() {
                                        return [];
                                    }
                                };
                            },
                            getOvpConfig: function () {
                                return;
                            },
                            getMetadata: function () {
                                return {
                                    getName: function () {
                                        return "dummy";
                                    }
                                };
                            },
                            getManifest: function () {
                                return {
                                    "sap.app": {
                                        "id": "Bookshop"
                                    }
                                };
                            },
                            getManifestObject: function() {
                                return {
                                    getRawJson: function() {
                                        return {
                                            "sap.fiori": {
                                                registrationIds: [""]
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        model: oModel,
                        settings: oConfig["settings"]
                    }
                });
            }).then(function (oComponent) {
                that.oDataObject.oComponent = oComponent;
                return oComponent.getAggregation("rootControl");
            }).then(function (oView) {
                that.oDataObject.oView = oView;
                return oView.loaded();
            });
        }
    };
    return {
        getCardData: oMockServerInfo.getCardData,
        startServer: oMockServerInfo.startServer,
        createXMLView: oMockServerInfo.createXMLView,
        closeServer: oMockServerInfo.closeServer
    };
});