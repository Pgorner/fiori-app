/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test-resources/sap/ovp/integrations/pages/CommonArrangements",
	"test-resources/sap/ovp/integrations/pages/CommonActions",
	"test-resources/sap/ovp/integrations/pages/CommonAssertions",
], function (
	Opa5,
	opaTest,
	CommonArrangements,
	CommonActions,
	CommonAssertions
) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new CommonArrangements(),
		actions: new CommonActions(),
		assertions: new CommonAssertions(),
		autoWait: true,
		viewNamespace: "view.",
	});

	var Journey = {
		start: function () {
			QUnit.module("Journey - OVP - StackCardJourney");
			opaTest("#000: Start", function (Given, When, Then) {
				Given.iStartMyApp("procurement-overview");
				Then.checkAppTitle("Procurement Overview Page");
			});
			return Journey;
		},

		testAndEnd: function () {
			opaTest("#1 Click on search", function (Given, When, Then) {
				When.iEnterValueInField('EUR',"application-procurement-overview-component---mainView--ovpGlobalFilter-filterItemControlA_-_Parameter.P_DisplayCurrency");
				When.iEnterValueInField('',"application-procurement-overview-component---mainView--ovpGlobalFilter-filterItemControl_BASIC-DeliveryDate");
				When.iClickTheGoButton("application-procurement-overview-component---mainView--ovpGlobalFilter-btnGo");
			});

			opaTest("#2 Check for stack card on UI", function (Given, When, Then) {
				Then.iCheckTheStackCardVisibility();
			});
		
			opaTest("#3 Stack Card Header Title", function (Given, When, Then) {
				Then.iCheckCardText("Awaiting Purchase Order Approval","--ovpHeaderTitle","Title");
			});

			opaTest("#4 Stack Card Header SubTitle", function (Given, When, Then) {
				Then.iCheckCardText("Sorted by delivery date","--SubTitle-Text","SubTitle");
			});

			opaTest("#5 Check the View All text in Stack Card", function (Given, When, Then) {
				Then.iCheckCardText("View All","--ViewAll","Text");
			});

			opaTest("#6 Check the total cards visible in Object Stream", function (Given, When, Then) {
				Then.iCheckLabelText("20","stackSize","Text");
			});

			opaTest("#7 Check the total cards in Object Stream", function (Given, When, Then) {
				Then.iCheckCardText("of\n65","stackTotalSize","Text");
			});

			opaTest("#8 Load the stack card", function (Given, When, Then) {
				When.iClickTheStackCardButton();
			});

			opaTest("#9 Check the object stream title", function (Given, When, Then) {
				Then.iCheckLinkText("Awaiting Purchase Order Approval","__link","Text");
			});

			opaTest("#10 Click on Approve Button on Object Stream Card", function (Given, When, Then) {
				When.iClickButtonOnObjectStreamCardWithIndex("ovpActionFooter",1,"Approve");
				When.iClickOnButtonWithText("ovpCardActionDialog","Approve");
				Then.iCheckPopupMessage("Could not perform action \"Approve\".","error","Error in Approve Process");
				When.iClickOnButtonWithText("error","Close");
			});

			opaTest("#11 Click on Cancel in Approve Button Popup", function (Given, When, Then) {
				When.iClickButtonOnObjectStreamCardWithIndex("ovpActionFooter",2,"Approve");
				When.iClickOnButtonWithText("ovpCardActionDialog","Cancel");
			});

			opaTest("#12 Click on Reject Button on Object Stream Card", function (Given, When, Then) {
				When.iClickButtonOnObjectStreamCardWithIndex("ovpActionFooter",3,"Reject");
				When.iClickOnButtonWithText("ovpCardActionDialog","Reject");
				Then.iCheckPopupMessage("Could not perform action \"Reject\".","error","Error in Reject Process");
				When.iClickOnButtonWithText("error","Close");
			});

			opaTest("#13 Click on Cancel in Reject Button Popup", function (Given, When, Then) {
				When.iClickButtonOnObjectStreamCardWithIndex("ovpActionFooter",4,"Reject");
				When.iClickOnButtonWithText("ovpCardActionDialog","Cancel");
			});

			opaTest("#14 Click on Card Header in Object Stream", function (Given, When, Then) {
				When.iClickTheCardHeader("card015Original_ObjectStream-id", true);
				Then.checkAppTitle("Browse Books (V4)");
				When.iClickBackButton();
				Then.checkAppTitle("Procurement Overview Page");

				Given.iTeardownMyApp();
			});

			return Journey;
		}
	};
	Journey.start().testAndEnd();
});
