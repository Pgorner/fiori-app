sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"./mockserver/MockServerInitializer",
	"sap/ui/model/odata/ODataModel",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/Button",
	"sap/ui/core/Core"
], function(Controller, MockServerInitializer, ODataModel, Dialog, MText, Input, Button, Core) {
	"use strict";

	return Controller.extend("sap.collaboration.sample.SocialTimelineComponent.Controller", {
		onInit: function() {
			// OData Timeline Service settings.
			var oSettings = {
				rootUri: "/sap/opu/odata/sap/Z_TIMELINE_SRV/",
				boCollection: "TestBusinessObjects"
			};

			MockServerInitializer.initializeMockServers("SocialTimelineComponent", ["timeline", "smi", "jam"]);

			var oServiceConfig = {annotationURI: oSettings.rootUri + "$metadata", json: true};
			var oServiceModel = new ODataModel( oSettings.rootUri, oServiceConfig);

			/*
			 * Create Social Timeline Component with the event 'customActionPress'.
			 */
			var oSocialTimeline = Core.createComponent({
					name:"sap.collaboration.components.socialtimeline",
					settings: {
						customActionPress: function(oEventData){
							var sTimelineEntryId = oEventData.getParameter("timelineEntryId");

							 if (oEventData.getParameter('key') === 'key1'){
								 var oDialog = new Dialog({
										showHeader: false,
										content:[new MText({text: "Enter text to change the content of the Social Timeline Entry."}),
										         new Input({})],
										beginButton: new Button({
											text: "OK",
											press: function(){
												oDialog.close();
											}
										}),
										afterClose: function(){
											oSocialTimeline.updateTimelineEntry(oDialog.getContent()[1].getValue(), sTimelineEntryId);
										}
									});
									oDialog.open();
							}
							 else if (oEventData.getParameter('key') === 'key2'){
								 var oDialog = new Dialog({
									 showHeader: false,
									 content: [new MText({text: "Press OK to delete the Social Timeline Entry."})],
									 beginButton: new Button({
										 text: "OK",
										 press: function(){
											 oDialog.close();
										 }
									 }),
									 afterClose: function(){
										 oSocialTimeline.deleteTimelineEntry(sTimelineEntryId);
									 }
								 });
								 oDialog.open();
							 }
						}
					}
				});

			/*
			 *	Set the object map by calling the method setBusinessObjectMap. We pass an object that contains information about the
			 *	business object, as well as a customActionCallback.
			 */
			oSocialTimeline.setBusinessObjectMap({
				serviceModel: oServiceModel,
				collection: oSettings.boCollection,
				applicationContext: "TEST_APP_CONTEXT",
				servicePath: "TestServicePath",
				customActionCallback: function(oOdataEntry){
					if (oOdataEntry.TestActorID === "CARTER-NORA" || oOdataEntry.TestActorID === "SAINTCRUIS"){
						return [{key:"key1", value: "Edit"}, {key:"key2", value: "Delete"}];
					}
				}
			});
			oSocialTimeline.setBusinessObjectKey("'1'");
			/* !!!Workaround for the Demokit only!!!
			 * We need to override the buildImageURL method of the TimelineDataHandler class and insert our own image URLs.
			 * The function buildImageURL is called by the Social Timeline to build the image URL for the browser to download
			 * every user's image. Since we want to provide a local copy, we override this method and provide the relative path
			 * to the images.
			 */
			MockServerInitializer.initializeMockData(oSocialTimeline);
			/*
			 * Create Component Container for the Social Timeline Component.
			 */
			this.getView()._socialTimelineComponentContainer.setComponent(oSocialTimeline);
			this.getView()._socialTimelineComponentContainer.setHeight("800px");
		}
	});
});
