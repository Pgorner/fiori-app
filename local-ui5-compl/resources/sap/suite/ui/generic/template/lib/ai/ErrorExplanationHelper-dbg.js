sap.ui.define([
    "sap/suite/ui/generic/template/genericUtilities/FeLogger",
    "sap/ui/performance/trace/FESRHelper"
], function(FeLogger, FESRHelper) {
    'use strict';
    var oLogger = new FeLogger("lib.ai.ErrorExplanationHelper").getLogger();

    function generateErrorExplanation(oEvent, oController, oTemplateUtils) {
        var oErrorExplanationMetadata, oErrorExplanationData;
        var oSource = oEvent.getSource();

        var oOwnerComponent = oController.getOwnerComponent();
        var oAppComponent = oOwnerComponent.getAppComponent();
        var aRegistrationIds = oAppComponent.getManifestEntry("sap.fiori").registrationIds;
		var sRegistrationIdsString = aRegistrationIds && aRegistrationIds.length > 0 ? aRegistrationIds.join(",") : "";

        oErrorExplanationMetadata = {
            version : 1,
            fioriId: sRegistrationIdsString,
            appName: oAppComponent.getManifestEntry("sap.app").title || null,
            componentName: oAppComponent.getManifestEntry("sap.app").id || null
        };
        oErrorExplanationData = {
            version : 1,
            message : oSource.data("message"),
            code: oSource.data("code"),
            description: oSource.data("description"),
            descriptionUrl: oSource.data("descriptionUrl")
        };
        try {
            oTemplateUtils.oServices.oFioriAIHandler.fioriaiLib.ErrorExplanation.explain(oErrorExplanationMetadata, oErrorExplanationData);
        } catch (oError) {
            oLogger.warning(oError);
        }
        FESRHelper.setSemanticStepname(oSource, "press", "fe:ee:explain");
    }

    function isErrorExplanationEnabled(oTemplateUtils) {
        var oTemplatePrivateGlobalModel = oTemplateUtils.oComponentUtils.getTemplatePrivateGlobalModel();
        return oTemplatePrivateGlobalModel.getProperty("/generic/fioriAI/isErrorExplanationEnabled");
    }

    return {
        generateErrorExplanation: generateErrorExplanation,
        isErrorExplanationEnabled: isErrorExplanationEnabled
    };
});