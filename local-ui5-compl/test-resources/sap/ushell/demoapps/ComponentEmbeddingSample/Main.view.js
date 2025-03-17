// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/View",
    "sap/m/Panel",
    "sap/m/Toolbar",
    "sap/m/Input",
    "sap/m/Button",
    "sap/m/CheckBox",
    "sap/ui/core/ComponentContainer"
], function (View, Panel, Toolbar, Input, Button, CheckBox, ComponentContainer) {
    "use strict";

    return View.extend("sap.ushell.demo.ComponentEmbeddingSample.Main", {
        createContent: function (oController) {
            return new Panel("panel", {
                height: "100%",
                headerToolbar: new Toolbar({
                    content: [
                        new Input(this.createId("inputNavigationIntent"), {
                            placeholder: "Enter a Navigation Intent ..."
                        }),
                        new Button(this.createId("goButton"), {
                            text: "Go!",
                            press: oController.handleLoadComponent.bind(oController)
                        }),
                        new CheckBox(this.createId("checkBoxOwner"), {
                            text: "Set this app as owner component"
                        })
                    ]
                }),
                content: [
                    new ComponentContainer(this.createId("componentContainer"), {
                        name: "sap.ushell.demo.AppPersSample",
                        url: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppPersSample",
                        width: "100%",
                        height: "100%",
                        async: true
                    })
                ]
            });
        },

        /** Specifies the Controller belonging to this View.
         * In the case that it is not implemented, or that "null" is returned, this View does not
         * have a Controller.
         */
        getControllerName: function () {
            return "sap.ushell.demo.ComponentEmbeddingSample.Main";
        }
    });
});
