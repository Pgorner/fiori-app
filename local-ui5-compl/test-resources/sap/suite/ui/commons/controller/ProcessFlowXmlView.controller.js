sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/mvc/XMLView"
], async function (Controller, XMLView) {

    Controller.extend("my.own.controller", {
    });

    var oDataNodes = {
        foo: "test test",
        flows:
        [
            {id: "1",  lane: "0",  title: "title 1",  children: [10, 11, 12]},
            {id: "10", lane: "3" , title: "title 10", children: null },
            {id: "11", lane: "2" , title: "title 11", children: null },
            {id: "12", lane: "1" , title: "title 12", children: [5] },
            {id: "5",  lane: "2" , title: "title 5",  children: null },
        ],
        columns:
        [
            {id: "0", icon: "sap-icon://order-status", label: "Id 0", position: 0},
            {id: "1", icon: "sap-icon://order-status", label: "Id 1", position: 1},
            {id: "2", icon: "sap-icon://order-status", label: "Id 2", position: 2},
            {id: "3", icon: "sap-icon://order-status", label: "Id 3", position: 3}
        ]
    };

    // instantiate the View
    var myView = await XMLView.create({definition:jQuery('#view1').html()}); // accessing the HTML inside the script tag above

    // create a Model and assign it to the View
    var oModel = new sap.ui.model.json.JSONModel();
    oModel.setData(oDataNodes);
    myView.setModel(oModel, "data");

    // put the View onto the screen
    myView.placeAt('content');
});
