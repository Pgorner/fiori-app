
sap.ui.define([
    "sap/ui/base/Object",
    "sap/base/util/extend",
    "sap/insights/channels/ContextChannel",
    "sap/suite/ui/generic/template/lib/ShareUtils"
], function(BaseObject, extend, ContextChannel, ShareUtils) {
    'use strict';
    function getMethods(oTemplateContract) {

        function fnRegisterProvider() {
            var oApp = oTemplateContract.oAppComponent.getManifestEntry("sap.app");
            this.contextProvider = {
                getId: function () {
                    return oApp.id;
                },
                getContext() {
                    var rootLevel = oTemplateContract.oTemplatePrivateGlobalModel.getProperty("/generic/routeLevel");
                    var oComponent = Object.values(oTemplateContract.componentRegistry).find(r => r.viewLevel === rootLevel);
                    var sEntityPath = "/" + oComponent.routeConfig.entitySet;
                    var oView = oComponent.oController.getView();
                    var oContext = {
                        app_title: oApp.title,
                        [oApp.id]: {
                            app: {
                                view: oView.getViewName()
                            },
                            flp: {
                                hash: ShareUtils.getCustomUrl()
                            },
                            entity: {
                                servicePath: oView.getModel().sServiceUrl,
                                entityPath: oView.getBindingContext()?.getPath() ?? oView.getViewData()?.fullContextPath ?? sEntityPath
                            }
                        }
                    };
                    oComponent.oController.getContext(oContext);
                    return Promise.resolve(oContext);
                }
            };
            ContextChannel && ContextChannel.getInstance().then(channel => channel.registerProvider(this.contextProvider));
        }
        function fnUnregisterProvider() {
            ContextChannel && ContextChannel.getInstance().then(channel => channel.unregisterProvider(this.contextProvider));
        }
        return {
            fnRegisterProvider: fnRegisterProvider,
            fnUnregisterProvider: fnUnregisterProvider
        };
    }
    return BaseObject.extend("sap.suite.ui.generic.template.lib.ai.JouleContextProvider",{
        constructor: function(oTemplateContract) {
			extend(this, getMethods(oTemplateContract));
		}
    });
});