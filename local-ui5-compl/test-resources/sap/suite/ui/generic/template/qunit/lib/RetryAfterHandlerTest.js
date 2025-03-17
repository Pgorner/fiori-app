sap.ui.define([
    "sap/base/i18n/Formatting",
    "sap/base/i18n/Localization",
    "sap/ui/core/Messaging",
    "sap/ui/core/message/Message",
    "sap/ui/model/resource/ResourceModel",
    "sap/suite/ui/generic/template/lib/RetryAfterHandler",
    "sap/suite/ui/generic/template/genericUtilities/testableHelper"
], function (Formatting, Localization, Messaging, Message, ResourceModel, RetryAfterHandler, testableHelper) {

    // Preserving the default timezone
    var sDefaultTimezone = Localization.getTimezone();
    // Preserving the default time pattern
    var sDefaultTimePattern = Formatting.getTimePattern("short");

    var sandbox;
	var oStubForPrivate;
    var oRetryAfterHandler;
    var oRB;
    var oTemplateContract = {
        getText: function () {
            oRB = oRB || new ResourceModel({
                bundleName: "sap/suite/ui/generic/template/lib/i18n/i18n"
            }).getResourceBundle();
            return oRB.getText.apply(oRB, arguments);
        },
        oNavigationControllerProxy: {
            navigateToMessagePage: sinon.stub() 
        }    
    };
    var oAppComponent = {};

    QUnit.module("Retry after messages", {
        beforeEach: () => {
            oStubForPrivate = testableHelper.startTest();
			sandbox = sinon.sandbox.create();

            oRetryAfterHandler = new RetryAfterHandler(oTemplateContract, oAppComponent);
            // Set "UTC" as timezone
            Localization.setTimezone("UTC");
            // Set time pattern as "hh:mm a"
            Formatting.setTimePattern("short", "hh:mm a");
        },
        afterEach: () => {
            // Revert the timezone
            Localization.setTimezone(sDefaultTimezone);
            // Revert the time pattern
            Formatting.setTimePattern("short", sDefaultTimePattern);
            
            sandbox.restore();
			testableHelper.endTest();
        }
    });

    QUnit.test("Testing the retry after message for various time intervals", function (assert) {
        // Current date as Oct 10, 2024 11:00 AM
        var oCurrentDate = new Date("2024-10-10T11:00:00.000+00:00");

        // Case 1: Retry after date is 10 mins from now (Same day as today)
        var oRetryAfterDate = new Date("2024-10-10T11:10:00.000+00:00");
        var sMsg = oStubForPrivate.fnGetErrorMessageWithTime(oCurrentDate, oRetryAfterDate);
        assert.equal(sMsg, "We expect it to be available again at 11:10 AM.", "The retry after message should contain the time");

        // Case 2: Retry after date is next day
        oRetryAfterDate = new Date("2024-10-11T10:30:00.000+00:00");
        sMsg = oStubForPrivate.fnGetErrorMessageWithTime(oCurrentDate, oRetryAfterDate);
        assert.equal(sMsg, "We expect it to be available again on October 11 at 10:30 AM.", "The retry after message should contain the date & time");

        // Case 3: Retry after date is next year
        oRetryAfterDate = new Date("2025-01-01T14:45:00.000+00:00");
        sMsg = oStubForPrivate.fnGetErrorMessageWithTime(oCurrentDate, oRetryAfterDate);
        assert.equal(sMsg, "We expect it to be available again on January 01, 2025 at 02:45 PM.", "The retry after message should contain the date, time and year");
    });

    QUnit.module("Navigation to message page");

    QUnit.test("Test the navigation to message page when the message model has a message with the status code as 503", function (assert) {
        var o503ErrorMessage = new Message({
            target: "/",
            technical: true,
            technicalDetails: {
                statusCode: 503
            }
        });

        Messaging.addMessages(o503ErrorMessage);
        assert.ok(oTemplateContract.oNavigationControllerProxy.navigateToMessagePage.calledOnce, "navigateToMessagePage is invoked once");
    });
});