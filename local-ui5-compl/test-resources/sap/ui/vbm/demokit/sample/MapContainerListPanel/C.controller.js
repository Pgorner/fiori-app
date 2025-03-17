sap.ui.define([
				"sap/ui/model/json/JSONModel",
				"sap/ui/Device",
				"sap/ui/core/mvc/Controller"
               ],function(JSONModel, Device, Controller) {
	"use strict";
	
	var oModel;

	return Controller.extend("sap.ui.vbm.sample.MapContainerListPanel.C", {
		onInit : function () 
		{
			oModel = new sap.ui.model.json.JSONModel("test-resources/sap/ui/vbm/demokit/sample/MapContainerListPanel/Data.json");
			this.getView().setModel(oModel);
		 // set the device model
			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.getView().setModel(oDeviceModel, "device");
		 },
		 
		 onSelectionChange : function (oEvt) 
		 {
			var oList = oEvt.getSource();
			var aItems = oList.getSelectedItems();
			for(var j=0;j<3;j++){// loop over first 3 locations in Data.json
				var locJson = oModel.getProperty("/Spots/"+j+"/tooltip"); // location from Data.json
				var flagScaled = false;
			for(var i=0;i<aItems.length;i++){// loop over all selected locations
				var locList = aItems[i].getTitle();
					if(locList == locJson){
						if(oModel.getProperty("/Spots/"+j+"/scale") == "1;1;1"){
							oModel.setProperty("/Spots/"+j+"/scale","1.5;1.5;1.5");
							flagScaled=true;
						}
						else if(oModel.getProperty("/Spots/"+j+"/scale") == "1.5;1.5;1.5"){
							flagScaled=true;
						}
					}
					continue;
				}
				if(!flagScaled){
					if(oModel.getProperty("/Spots/"+j+"/scale") == "1.5;1.5;1.5"){
						oModel.setProperty("/Spots/"+j+"/scale","1;1;1");
					}
				}
			}
		}
	});

	

}, /* bExport= */ true);
