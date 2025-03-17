sap.ui.define([
    "sap/ui/base/Object",
    "sap/base/util/extend",
    "sap/ui/core/Lib",
    "sap/suite/ui/generic/template/genericUtilities/FeLogger",
    "sap/suite/ui/generic/template/genericUtilities/polyFill"
], function(BaseObject, extend, Lib, FeLogger) {
    'use strict';
    // List of AI capabilities that are available in the template
    var aAIIntentMaster = [
        { name : "summarize", intent : "#IntelligentPrompt-summarize", importURL : "ux/eng/fioriai/reuse/library", localProperty : "isSummarizationEnabled", oEnabledPromise : Promise.withResolvers() },
        { name : "EasyFilter", intent :  "#IntelligentPrompt-filter", importURL : "ux/eng/fioriai/reuse/easyfilter/EasyFilter", localProperty : "isEasyFilterEnabled", oEnabledPromise : Promise.withResolvers() },
        { name : "ErrorExplanation", intent : "#IntelligentPrompt-explain", importURL : "ux/eng/fioriai/reuse/errorexplanation/ErrorExplanation", localProperty : "isErrorExplanationEnabled", oEnabledPromise : Promise.withResolvers() }
    ];
    var sFioriAILibrary = "ux.eng.fioriai.reuse";
    var UShellContainer = sap.ui.require("sap/ushell/Container");
    var oLogger = new FeLogger("lib.ai.FioriAIHandler").getLogger();
    /*
     * This is a handler class for Fiori AI. It is used to load the Fiori AI library and provide it to the template for template consumption.
     * 
     */

    function getMethods(oTemplateContract) {
        
        /**
         * This method is used to load the Fiori AI library and make the available AI capabilities to the template contract
         */
        function fnLoadAILibrary() {
            var that = this;
            UShellContainer && UShellContainer.getServiceAsync("Navigation").then(function(oNavigationService) {
                aAIIntentMaster.forEach(function(oAIIntent) {
                    oNavigationService.resolveIntent(oAIIntent.intent).then(function(sURL) {
                        Lib.load({name: sFioriAILibrary , url : sURL }).then(function() {
                            sap.ui.require([oAIIntent.importURL
                            ], function(fioriaiLibImport) {
                                oTemplateContract.oTemplatePrivateGlobalModel.setProperty("/generic/fioriAI/" + oAIIntent.localProperty , true);
                                that.fioriaiLib[oAIIntent.name] = fioriaiLibImport;
                                oAIIntent.oEnabledPromise.resolve();
                            });
                        });
                    }, function() {
                        oLogger.warning(oAIIntent.intent + " capability not enabled on this tenant");
                        oAIIntent.oEnabledPromise.reject();
                    });
                });
            }).catch(function() {
                oLogger.warning("No Navigation service enabled on the tenant");
            });
        }

        /**
         * @param {*} sAIIntentName The name of the AI intent
         * @returns Promise which resolves to true if the AI is enabled
         */
        function fnGetFioriAIEnabledPromise(sAIIntentName) {
            var oAIIntent;
            oAIIntent = aAIIntentMaster.find(function(oAIIntent) {
                return oAIIntent.name === sAIIntentName;
            });
            return oAIIntent.oEnabledPromise.promise;
        }

        return {
            loadAILibrary: fnLoadAILibrary,
            getFioriAIEnabledPromise: fnGetFioriAIEnabledPromise
        };
    }
    return BaseObject.extend("sap.suite.ui.generic.template.lib.ai.FioriAIHandler", {
        constructor: function (oTemplateContract) {
            // If the AI intent is available then later the library will be loaded
            this.fioriaiLib = {
                summarize: null,
                EasyFilter: null,
                ErrorExplanation: null
            };
			extend(this, getMethods(oTemplateContract));
		}
    });
});