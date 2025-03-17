sap.ui.define([
    "sap/ui/core/util/MockServer",
    "test/sap/apf/testhelper/mockServerCloudFoundry/APFServiceMockServer",
    "test/sap/apf/testhelper/mockServerCloudFoundry/ValueHelpMockServer",
    "sap/ui/thirdparty/sinon",
    "sap/ui/test/opaQunit",
    "test/sap/apf/integration/cloudFoundry/pages/Step.page",
    "test/sap/apf/integration/cloudFoundry/pages/ValueHelpDialog.page"
], function (Mockserver, APFServiceMockServer, ValueHelpMockServer, sinon, opaTest) {
    "use strict";

    QUnit.module("ValueHelp", {
        beforeEach: function () {
            APFServiceMockServer.init();
            ValueHelpMockServer.init();
        },
        afterEach: function () {
            Mockserver.destroyAll();
        }
    });

    opaTest("Should start the Modeler", function (Given, When, Then) {
        // Arrangements
        var sPageUrl = sap.ui.require.toUrl('test/sap/apf/testhelper/modelerComponentCloudFoundry/index.html');
        Given.iStartMyAppInAFrame(sPageUrl + '?sap-ui-language=EN#/app/57FCA36EC3D350DEE10000000A442AF5/config/15184393783558433132010203955379/category/Category-1/step/Step-1');
        Then.waitFor({
            success: function () {
                QUnit.assert.ok(true, "Startup successful");
            }
        });
    });

    opaTest("Should open the ValueHelp dialog", function (Given, When, Then) {
        //Actions
        When.onTheStepPage.iPressTheValueHelpButton();
        // Assertions
        Then.onTheStepPage.iShouldSeeTheValueHelpDialog();
    });
    opaTest("Should close the ValueHelp dialog", function (Given, When, Then) {
        // Arrange: Setup Spy
        Given.waitFor({
            id: "catalogBrowser",
            viewName: "sap.apf.cloudFoundry.ui.valuehelp.view.CatalogBrowser",
            success: function (oCatalogBrowser) {
                this.onCloseSpy = sinon.spy(oCatalogBrowser, "close");
            }.bind(this)
        });
        // Actions
        When.onTheValueHelpDialog.iPressTheCancelButton();
        // Assertions
        Then.waitFor({
            success: function () {
                QUnit.assert.ok(this.onCloseSpy.called, "Dialog was closed");
                this.onCloseSpy.restore();
            }.bind(this)
        });
    });

    opaTest("Should show Destinations on the first page of the Dialog", function (Given, When, Then) {
        When.onTheStepPage.iPressTheValueHelpButton();
        Then.onTheValueHelpDialog.iShouldSeeFourDestinations();
        Then.onTheValueHelpDialog.iShouldNotSeeTheBackButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheSelectButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheOKButton();
    });
    // FIRST DESTINATION
    opaTest("Should search for the first Destination on the first page of the Dialog", function (Given, When, Then) {
        When.onTheValueHelpDialog.iSearchDestination1();
        Then.onTheValueHelpDialog.iShouldSeeOneDestination();
    });
    opaTest("Should show Services on the second page of the Dialog", function (Given, When, Then) {
        When.onTheValueHelpDialog.iSelectTheFirstDestination();
        Then.onTheValueHelpDialog.iShouldSeeServices();
        Then.onTheValueHelpDialog.iShouldSeeTheBackButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheSelectButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheOKButton();
    });
    opaTest("Should search Services on the second page of the Dialog", function (Given, When, Then) {
        When.onTheValueHelpDialog.iSearchAService();
        // Search is not implemented in MockServer, so we will get an empty result
        Then.onTheValueHelpDialog.iShouldSeeNoServices();
    });
    opaTest("Should go back to the first page of the Dialog", function (Given, When, Then) {
        When.onTheValueHelpDialog.iPressTheBackButton();
        Then.onTheValueHelpDialog.iShouldSeeOneDestination();
        Then.onTheValueHelpDialog.iShouldNotSeeTheBackButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheSelectButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheOKButton();
    });
    // SECOND DESTINATION
    opaTest("Should search for the second Destination on the first page of the Dialog", function(Given, When, Then) {
        When.onTheValueHelpDialog.iSearchDestination2();
        Then.onTheValueHelpDialog.iShouldSeeOneDestination();
    });
    opaTest("Should see the URL Input on the second page of the Dialog", function(Given, When, Then) {
        When.onTheValueHelpDialog.iSelectTheFirstDestination();
        Then.onTheValueHelpDialog.iShouldSeeTheUrlInput();
        Then.onTheValueHelpDialog.iShouldSeeTheBackButton();
        Then.onTheValueHelpDialog.iShouldSeeTheSelectButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheOKButton();
    });
    opaTest("Should not continue with wrong input", function(Given, When, Then) {
        When.onTheValueHelpDialog.iInputAWrongServiceUrl();
        When.onTheValueHelpDialog.iPressTheSelectButton();
        Then.onTheValueHelpDialog.iShouldSeeTheUrlInput();
        Then.onTheValueHelpDialog.iShouldSeeTheBackButton();
        Then.onTheValueHelpDialog.iShouldSeeTheSelectButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheOKButton();
    });
    opaTest("Should continue to the Overview page with correct input", function(Given, When, Then) {
        When.onTheValueHelpDialog.iInputACorrectServiceUrl();
        When.onTheValueHelpDialog.iPressTheSelectButton();
        Then.onTheValueHelpDialog.iShouldSeeTheReducedOverviewPage();
        Then.onTheValueHelpDialog.iShouldSeeTheBackButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheSelectButton();
        Then.onTheValueHelpDialog.iShouldSeeTheOKButton();
    });
    opaTest("Should go back to the second page of the Dialog", function(Given, When, Then) {
        When.onTheValueHelpDialog.iPressTheBackButton();
        Then.onTheValueHelpDialog.iShouldSeeTheUrlInput();
        Then.onTheValueHelpDialog.iShouldSeeTheBackButton();
        Then.onTheValueHelpDialog.iShouldSeeTheSelectButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheOKButton();
    });
    opaTest("Should go back to the first page of the Dialog", function(Given, When, Then) {
        When.onTheValueHelpDialog.iPressTheBackButton();
        Then.onTheValueHelpDialog.iShouldSeeOneDestination();
        Then.onTheValueHelpDialog.iShouldNotSeeTheBackButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheSelectButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheOKButton();
    });
    // THIRD DESTINATION
    opaTest("Should search for the third Destination on the first page of the Dialog", function(Given, When, Then) {
        When.onTheValueHelpDialog.iSearchDestination3();
        Then.onTheValueHelpDialog.iShouldSeeOneDestination();
    });
    opaTest("Should see the URL Input on the second page of the Dialog", function(Given, When, Then) {
        When.onTheValueHelpDialog.iSelectTheFirstDestination();
        Then.onTheValueHelpDialog.iShouldSeeTheUrlInput();
        Then.onTheValueHelpDialog.iShouldSeeTheBackButton();
        Then.onTheValueHelpDialog.iShouldSeeTheSelectButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheOKButton();
    });
    opaTest("Should continue to the Overview page with correct input", function(Given, When, Then) {
        When.onTheValueHelpDialog.iInputACorrectServiceUrl();
        When.onTheValueHelpDialog.iPressTheSelectButton();
        Then.onTheValueHelpDialog.iShouldSeeTheReducedOverviewPage();
        Then.onTheValueHelpDialog.iShouldSeeTheBackButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheSelectButton();
        Then.onTheValueHelpDialog.iShouldSeeTheOKButton();
    });
    opaTest("Should go back to the second page of the Dialog", function(Given, When, Then) {
        When.onTheValueHelpDialog.iPressTheBackButton();
        Then.onTheValueHelpDialog.iShouldSeeTheUrlInput();
        Then.onTheValueHelpDialog.iShouldSeeTheBackButton();
        Then.onTheValueHelpDialog.iShouldSeeTheSelectButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheOKButton();
    });
    opaTest("Should go back to the first page of the Dialog", function(Given, When, Then) {
        When.onTheValueHelpDialog.iPressTheBackButton();
        Then.onTheValueHelpDialog.iShouldSeeOneDestination();
        Then.onTheValueHelpDialog.iShouldNotSeeTheBackButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheSelectButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheOKButton();
    });
    // FOURTH DESTINATION
    opaTest("Should search for the fourth Destination on the first page of the Dialog", function(Given, When, Then) {
        When.onTheValueHelpDialog.iSearchDestination4();
        Then.onTheValueHelpDialog.iShouldSeeOneDestination();
    });
    opaTest("Should see the Service-Only Overview page", function(Given, When, Then) {
        When.onTheValueHelpDialog.iSelectTheFirstDestination();
        Then.onTheValueHelpDialog.iShouldSeeTheServiceOnlyOverviewPage();
        Then.onTheValueHelpDialog.iShouldSeeTheBackButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheSelectButton();
        Then.onTheValueHelpDialog.iShouldSeeTheOKButton();
    });
    opaTest("Should go back to the first page of the Dialog", function(Given, When, Then) {
        When.onTheValueHelpDialog.iPressTheBackButton();
        Then.onTheValueHelpDialog.iShouldSeeOneDestination();
        Then.onTheValueHelpDialog.iShouldNotSeeTheBackButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheSelectButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheOKButton();
    });
    // FIRST DESTINATION
    opaTest("Should show an Overview on the third page of the Dialog", function (Given, When, Then) {
        Given.onTheValueHelpDialog.iSearchDestination1();
        Given.onTheValueHelpDialog.iSelectTheFirstDestination();
        When.onTheValueHelpDialog.iSelectAService();
        Then.onTheValueHelpDialog.iShouldSeeTheOverviewPage();
        Then.onTheValueHelpDialog.iShouldSeeTheBackButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheSelectButton();
        Then.onTheValueHelpDialog.iShouldSeeTheOKButton();
    });
    opaTest("Should go back to the second page of the Dialog", function (Given, When, Then) {
        When.onTheValueHelpDialog.iPressTheBackButton();
        Then.onTheValueHelpDialog.iShouldSeeServices();
        Then.onTheValueHelpDialog.iShouldSeeTheBackButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheSelectButton();
        Then.onTheValueHelpDialog.iShouldNotSeeTheOKButton();
    });
    opaTest("Should set the Destination at okaying the Dialog", function (Given, When, Then) {
        Given.onTheValueHelpDialog.iSelectAService();
        Given.waitFor({
            id: "catalogBrowser",
            viewName: "sap.apf.cloudFoundry.ui.valuehelp.view.CatalogBrowser",
            success: function (oCatalogBrowser) {
                this.onOkSpy = sinon.spy(oCatalogBrowser.getParent().getViewData().parentControl, "fireEvent");
            }.bind(this)
        });
        When.onTheValueHelpDialog.iPressTheOKButton();
        Then.waitFor({
            success: function () {
                QUnit.assert.ok(this.onOkSpy.called, "Dialog was closed");
                this.onOkSpy.restore();
            }.bind(this)
        });
    });

    opaTest("Should teardown the Modeler", function (Given, When, Then) {
        // Cleanup
        Given.iTeardownMyAppFrame();
        Then.waitFor({
            success: function () {
                QUnit.assert.ok(true, "Teardown successful");
            }
        });
    });
});
