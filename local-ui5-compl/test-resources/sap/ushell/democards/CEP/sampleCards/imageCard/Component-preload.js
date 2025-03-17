//@ui5-bundle sap/ushell/samplecards/imageCard/Component-preload.js
// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.predefine("sap/ushell/samplecards/imageCard/Component", [
    "sap/ui/core/UIComponent",
    "sap/ushell/utils"
], function (UIComponent, utils) {
	"use strict";

	var Component = UIComponent.extend("sap.ushell.samplecards.imageCard.Component", {

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            var fnAfterRendering = function (oEvent) {
                var oRootControl = oEvent.getSource();
                oRootControl.$().closest(".sapFCard").addClass("sapFCardTransparent").css({
                    boxShadow: "none"
                });

                utils.setPerformanceMark("FLP -- samplecards.imageCard after rendering");
            };
            this.getRootControl()
                .detachAfterRendering(fnAfterRendering)
                .attachAfterRendering(fnAfterRendering);
        }
    });


	return Component;
});
// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.predefine("sap/ushell/samplecards/imageCard/Main.controller", [
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ushell/Container"
], function (DateFormat, Controller, JSONModel, ResourceModel, Container) {
    "use strict";

    return Controller.extend("sap.ushell.samplecards.imageCard.Main", {
        onInit: function () {
            var oView = this.getView();
            var oModel = new JSONModel();
            var i18nModel = new ResourceModel({
                bundleName: "sap.ushell.samplecards.imageCard.i18n.i18n"
            });

            oView.byId("img").setSrc(sap.ui.require.toUrl("sap/ushell/samplecards/imageCard/Image2.png"));
            oView.setModel(oModel);
            oView.setModel(i18nModel, "i18n");

            Container.getServiceAsync("UserInfo").then(function (UserInfo) {
                var sFirstName = UserInfo.getFirstName();

                var oDateFormat = DateFormat.getDateInstance({
                    pattern: "EEE, MMM d"
                });

                oModel.setData({
                    firstName: sFirstName,
                    date: oDateFormat.format(new Date())
                });

            });

        }

    });

});
sap.ui.require.preload({
	"sap/ushell/samplecards/imageCard/View.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:core="sap.ui.core"\n    width="100%"\n    displayBlock="true"\n    controllerName="sap.ushell.samplecards.imageCard.Main"\n    core:require="{\n      formatMessage: \'sap/base/strings/formatMessage\'\n    }"><html:style>\n      .sapUIfloatingtext {\n            position: absolute;\n            bottom: 25px;\n            padding-left: 35px;\n            padding-right: 35px;\n            font-size: 50px;  \n            font-weight: bold;      \n      }\n      .sapUIfloatingdate {\n            position: absolute;\n            bottom: 85px;\n            padding-left: 35px;\n            padding-right: 35px;\n            font-size: 20px;  \n      }\n   </html:style><Image id="img" width="100%" /><Text text="{/date}" class="sapThemeTextInverted sapUIfloatingdate"/><Text text="{\n      parts: [\'i18n>welcomeMessage\', \'/firstName\'],\n      formatter: \'formatMessage\'\n      }" class="sapThemeTextInverted sapUIfloatingtext"/></mvc:View>\n',
	"sap/ushell/samplecards/imageCard/i18n/i18n.properties":'# Translatable texts for the Welcome Card\n\nwelcomeMessage=Hello, {0}!\n',
	"sap/ushell/samplecards/imageCard/manifest.json":'{"_version":"1.15.0","sap.app":{"id":"sap.ushell.samplecards.imageCard","type":"card","i18n":"i18n/i18n.properties","title":"Sample of a Component Card","subTitle":"Just wraps an image","applicationVersion":{"version":"1.2.0"},"shortTitle":"Image Card","info":"Image Card Sample","description":"A Component Card rendering an image","tags":{"keywords":["Component","Card","Sample"]}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://technical-object"}},"sap.ui5":{"rootView":{"viewName":"sap.ushell.samplecards.imageCard.View","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.38","libs":{"sap.m":{}}}},"sap.card":{"type":"Component","header":{"title":""}}}'
});
//# sourceMappingURL=Component-preload.js.map
