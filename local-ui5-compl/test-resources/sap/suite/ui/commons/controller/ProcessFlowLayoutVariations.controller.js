sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/mvc/XMLView"
], async function (Fragment, Controller, XMLView) {
    Controller.extend("sap.ui.suite.commons.ProcessFlowLayoutVariations", {
        onInit: function () {
            var oDataNodes = {
                foo: "test test",
                flows:
                    [
                        { id: "1", lane: "0", title: "title 1", children: [10, 11, 12] },
                        { id: "10", lane: "3", title: "title 10", children: null },
                        { id: "11", lane: "2", title: "title 11", children: null },
                        { id: "12", lane: "1", title: "title 12", children: [5] },
                        { id: "5", lane: "2", title: "title 5", children: null },
                    ],
                columns:
                    [
                        { id: "0", icon: "sap-icon://order-status", label: "Id 0", position: 0 },
                        { id: "1", icon: "sap-icon://order-status", label: "Id 1", position: 1 },
                        { id: "2", icon: "sap-icon://order-status", label: "Id 2", position: 2 },
                        { id: "3", icon: "sap-icon://order-status", label: "Id 3", position: 3 }
                    ]
            }
                , oModel
                , oBar
                ;

            // create a Model and assign it to the View
            oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(oDataNodes);
            this.getView().setModel(oModel, "data");
            oBar = this.byId("pfLayoutVariationsBar");
            //oBar.setSelectedKey("Splitter");
            oBar.fireSelect();
        },

        handleLayoutVariantSelection: function (oEvent) {
            var sKey = oEvent.getParameter("selectedKey")
                , myPage = this.getView().byId("pfLayoutVariationsPage");
            myPage.removeAllContent();

            if (sKey === "Grid") {
                if (!this.oGrid) {
                    Fragment.load({
                        definition: jQuery('#grid1').html()
                    }).then(function (oGrid) {
                        this.oGrid = oGrid;
                        myPage.addContent(this.oGrid);
                    }.bind(this));
                } else {
                    myPage.addContent(this.oGrid);
                }
            } else if (sKey === "Vertical") {
                if (!this.oVertical) {
                    Fragment.load({
                        definition: jQuery('#vertical1').html()
                    }).then(function (oVertical) {
                        this.oVertical = oVertical;
                        myPage.addContent(this.oVertical);
                    }.bind(this));
                } else {
                    myPage.addContent(this.oVertical);
                }
            } else if (sKey === "Horizontal") {
                if (!this.oHorizontal) {
                    Fragment.load({
                        definition: jQuery('#horizontal1').html()
                    }).then(function (oHorizontal) {
                        this.oHorizontal = oHorizontal;
                        myPage.addContent(this.oHorizontal);
                    }.bind(this));
                } else {
                    myPage.addContent(this.oHorizontal);
                }
            } else if (sKey === "ResponsiveFlow") {
                if (!this.oResponsiveFlow) {
                    Fragment.load({
                        definition: jQuery('#responsiveFlow1').html()
                    }).then(function (oResponsiveFlow) {
                        this.oResponsiveFlow = oResponsiveFlow;
                        myPage.addContent(this.oResponsiveFlow);
                    }.bind(this));
                } else {
                    myPage.addContent(this.oResponsiveFlow);
                }
            } else { // if (sKey === "Splitter")
                if (!this.oSplitter) {
                    Fragment.load({
                        definition: jQuery('#splitter1').html()
                    }).then(function (oSplitter) {
                        this.oSplitter = oSplitter;
                        myPage.addContent(this.oSplitter);
                    }.bind(this));
                } else {
                    myPage.addContent(this.oSplitter);
                }
            }
        }
    });

    // instantiate the View
    var myView = await XMLView.create({ definition: jQuery('#view1').html() });

    // put the View onto the screen
    var app = new sap.m.App("App");
    app.addPage(myView);
    var shell = new sap.m.Shell("shell", { title: "ProcessFlow application layout variations" });
    shell.setApp(app);
    shell.placeAt("content");


});