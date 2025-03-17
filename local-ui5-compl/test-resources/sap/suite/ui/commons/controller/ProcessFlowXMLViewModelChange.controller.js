sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/core/mvc/XMLView"
], async function (Controller, XMLView) {

        var oDataNodes = {
			flows:
			[
				{id: "1",  lane: "0",  title: "Sales Order 80017001",  children: [10, 11, 12]},
				{id: "10", lane: "3" , title: "Accounting Document 80017010", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive},
				{id: "11", lane: "2" , title: "Customer Invoice 80017011", children: null},
				{id: "12", lane: "1" , title: "OD 80017012", children: [5]},
				{id: "5",  lane: "2" , title: "CI 80017005",  children: null},
			],
			columns:
			[
				{id: "0", icon: "sap-icon://order-status", label: "In Delivery", position: 0},
				{id: "1", icon: "sap-icon://order-status", label: "In Order", position: 1},
				{id: "2", icon: "sap-icon://order-status", label: "In Payment", position: 2},
				{id: "3", icon: "sap-icon://order-status", label: "In Invoice", position: 3}
			]
		};

		var oDataNodesProgress1 = {
			flows:
			[
				{id: "1",  lane: "0",  title: "Sales Order 80017001 for the long wrapping and shortened text today",  children: [10, 11, 12], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "State Transportation planned"},
				{id: "10", lane: "3" , title: "Accounting Document 80017010 for the long wrapping and shortened text today", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "State Transportation planned"},
				{id: "11", lane: "2" , title: "Customer Invoice 80017011 for the long wrapping and shortened text today", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "State Transportation planned"},
				{id: "12", lane: "1" , title: "Outbound Delivery 80017012 for the long wrapping and shortened text today", children: [5], state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "State Transportation planned"},
				{id: "5",  lane: "2" , title: "Customer Invoice 80017005 for the long wrapping and shortened text today",  children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "State Transportation planned"},
			],
			columns:
			[
				{id: "0", icon: "sap-icon://order-status", label: "In Delivery", position: 0},
				{id: "1", icon: "sap-icon://order-status", label: "In Order", position: 1},
				{id: "2", icon: "sap-icon://order-status", label: "In Payment", position: 2},
				{id: "3", icon: "sap-icon://order-status", label: "In Invoice", position: 3}
			]
		};

		var oDataNodesProgress2 = {
			flows:
			[
				{id: "1",  lane: "0",  title: "Sales Order 80017001 for the long wrapping and shortened text today",  children: [10, 11, 12], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "State Transportation planned", texts: ["text 1 runs over two rows but no  more than two", ""]},
				{id: "10", lane: "3" , title: "Accounting Document 80017010 for the long wrapping and shortened text today", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "State Transportation planned", texts: ["text 1 runs over two rows ","text 2 runs over two rows"]},
				{id: "11", lane: "2" , title: "Customer Invoice 80017011 for the long wrapping and shortened text today", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "State Transportation planned", texts: ["text 1 runs over two rows ","text 2 runs over two rows"]},
				{id: "12", lane: "1" , title: "Outbound Delivery 80017012 for the long wrapping and shortened text today", children: [5], state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "State Transportation planned", texts: ["text 1 runs over two rows but no  more than two", ""]},
				{id: "5",  lane: "2" , title: "Customer Invoice 80017005 for the long wrapping and shortened text today",  children: [51, 52], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "State Transportation planned", texts: ["text 1 runs over two rows ","text 2 runs over two rows"]},
				{id: "51",  lane: "3" , title: "Customer Invoice 80017051 for the long wrapping and shortened text today",  children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, stateText: "State Transportation planned", texts: ["text 1 runs over two rows ","text 2 runs over two rows"]},				
				{id: "52",  lane: "3" , title: "Customer Invoice 80017052 for the long wrapping and shortened text today",  children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, stateText: "State Transportation planned", texts: ["text 1 runs over two rows but no  more than two", ""]},				
			],
			columns:
			[
				{id: "0", icon: "sap-icon://order-status", label: "In Delivery", position: 0},
				{id: "1", icon: "sap-icon://order-status", label: "In Order", position: 1},
				{id: "2", icon: "sap-icon://order-status", label: "In Payment", position: 2},
				{id: "3", icon: "sap-icon://order-status", label: "In Invoice", position: 3}
			]
		};		

		Controller.extend("sap.m.sample.DatePicker.Group", {

		  onInit: function () {
		    var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oDataNodes);
			//this.getView().setModel(oModel, "data");
			this.getView().setModel(oModel);
		  },

		  onPress: function (evt) {
		    //oDataNodes.flows[0].title = 'title AAA changed';
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(models[modelIdx]);
			modelIdx += 1; if (modelIdx >= models.length) {modelIdx = 0};
			this.getView().setModel(oModel);		    
			
			this.getView().byId("pf3").updateModel();

			jQuery.sap.require("sap.m.MessageToast");
		    sap.m.MessageToast.show("Model was updated");
		  }
		});

		var models = [oDataNodes, oDataNodesProgress1, oDataNodesProgress2];
		var modelIdx = 1; // the second model

		var myView = await XMLView.create({definition:jQuery('#view1').html()}); // accessing the HTML inside the script tag above
		
		var shell = new sap.m.Shell("shell", {title: "ProcessFlow"});
		var app = new sap.m.App("App");
		app.addPage(myView);
		shell.setApp(app);
		shell.placeAt('content');
});
