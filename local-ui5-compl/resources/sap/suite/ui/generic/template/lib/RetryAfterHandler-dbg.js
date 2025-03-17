sap.ui.define(["sap/ui/base/Object", 
	"sap/base/util/extend",
    "sap/base/i18n/Formatting",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/ProgressIndicator",
    "sap/m/Text",
    "sap/m/library",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/library",
    "sap/ui/core/Messaging",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/suite/ui/generic/template/genericUtilities/testableHelper"
], function (BaseObject, extend, Formatting, Button, Dialog, ProgressIndicator, Text, mobileLibrary, DateFormat, coreLibrary, 
    Messaging, Filter, FilterOperator, JSONModel, testableHelper) {
	"use strict";

    /**
     * This class handles the 503 error (service unavailable) response.
     * 
     * ///////////////////////////////////////
     * Response includes "retry-after" header
     * ///////////////////////////////////////
     * 
     * When the server throws 503 error, sometimes it adds "retry-after" (minimum number of seconds need to be waited before the next server call)
     * to the response header. The model intercepts the error and invokes the error handler registered on "setRetryAfterHandler" method.
     * Model takes care of converting the "retry-after" value to the Date value.
     * 
     * Here the code flow starts with "fnRegisterRetryAfterHandler". It sets the retry after handler to the model. 
     * Whenever 503 error is thrown, the "fnRetryAfterHandler" method is invoked.
     * The method should always return a promise. The model waits for the promise to be resolved.
     * - If the promise is resolved, the model retries the batch call.
     * - If the promise is rejected, it aborts the batch call.
     * 
     * Cases handled here.
     * 1. When the retry after time is < 5 seconds
     *      Shows the busy indicator until retry after time and retries the HTTP request automatically
     * 2. When the retry after time is <= 600 seconds
     *      Opens up dialog with progress indicator. Once the retry after time is reached, the dialog is automatically closed and the action is retried.
     * 3. When the retry after time is more than 600 seconds, navigate to message page
     *    a. If the service will be available on same day as today
     *      (Message shown: We expect it to be available again at 7:00 AM)
     *    b. If the service will be available on different day in the same year
     *      (Message shown: We expect it to be available again on October 1 at 7:00 AM)
     *    c. If the service will be available on next year (Possibly Jan 01 of next year)
     *      (Message shown: We expect it to be available again on January 1, 2022 at 12:00 PM)
     * 
     * ///////////////////////////////////////////
     * Response doesn't have "retry-after" header
     * ///////////////////////////////////////////
     * 
     * When the 503 error response doesn't have "retry-after" header, the model adds a new technical message to the message model.
     * The message's technical detail contains "statusCode" value as 503. 
     * 
     * If such message is added to message model, we need to intercept that and navigate to message page.
     * The message page would show the message "Please try again later."
     */

	function getMethods(oTemplateContract, oAppComponent) {
        // Shortcut for sap.m.ButtonType
        var ButtonType = mobileLibrary.ButtonType;
        // Shortcut for sap.m.DialogType
	    var DialogType = mobileLibrary.DialogType;
        // Shortcut for sap.m.IllustratedMessageType
        var IllustratedMessageType = mobileLibrary.IllustratedMessageType;
	    // Shortcut for sap.ui.core.ValueState
	    var ValueState = coreLibrary.ValueState;
        //  Shortcut for getting i18n text
        var getText = oTemplateContract.getText;
        
        // Get user's time pattern. If no pattern available on user's settings, use "hh:mm a"
        var sTimePattern = Formatting.getTimePattern("short") || "hh:mm a";

        /**
         * Section handles retry-after header
         */
        function fnRetryAfterHandler (oError) {
            var sErrorMessage = oError.message;
            var sAdditionalMessage;
            if (sErrorMessage) {
                //Add prefix to the error message
                sAdditionalMessage = getText("ST_GENERIC_503_SOURCE_MESSAGE") + " " + sErrorMessage;
            }

            var oRetryAfterDate = oError.retryAfter;
            var oNow = new Date();
            var iDifferenceInMilliSeconds = oRetryAfterDate.getTime() - oNow.getTime();
            var iDifferenceInSeconds = Math.ceil(iDifferenceInMilliSeconds / 1000);

            return new Promise((fnResolve, fnReject) => {
                if (iDifferenceInSeconds < 5) {
                    fnShowBusyIndicator(iDifferenceInSeconds, fnResolve);
                } else if (iDifferenceInSeconds <= 600) {
                    fnOpenAutoRetryDialog(oNow, oRetryAfterDate, iDifferenceInSeconds, sAdditionalMessage, fnResolve, fnReject);
                } else {
                    fnNavigateToMessagePage(oNow, oRetryAfterDate, sAdditionalMessage);
                    fnReject();
                }
            });
        }

        function fnShowBusyIndicator(iSecondsToRetryAfter, fnResolveRetry) {
            var oBusyHandlingPromise = new Promise(function (fnResolve) {
                setTimeout(function () {
                    fnResolve();
                }, iSecondsToRetryAfter * 1000);
            });
            oTemplateContract.oBusyHelper.setBusy(oBusyHandlingPromise, undefined, undefined, true);
            oBusyHandlingPromise.then(function() {
                fnResolveRetry();
            });
        }

        /**
         * Opens the auto retry dialog. Dialog contains
         *   - a text containing the number of seconds remaining to retry the action
         *   - a progress indicator which shows the progress to reach the retry after time
         *   - a "Cancel" button
         * 
         * If the user doesn't do anything, this function will wait until the retry after time and resolves the promise to retry
         * and closes the dialog.
         * 
         * If the user presses "Cancel" button, it opens a new confirmation dialog which does the following:
         *   - if user presses "Retry" button, it closes the confirmation dialog and opens the auto retry dialog.
         *   - if user presses "Cancel" button, it rejects the promise for retry (Retry operation will be aborted) and navigates to message page
         * 
         * @param {Date} oNow Current date
         * @param {Date} oRetryAfterDate Retry after date
         * @param {number} iInitialSecondsToRetryAfter Number of seconds to reach the retry-after time from now
         * @param {function} fnResolveRetry Resolve function for retry promise 
         * @param {function} fnRejectRetry Reject function for retry promise
         */
        function fnOpenAutoRetryDialog (oNow, oRetryAfterDate, iInitialSecondsToRetryAfter, sAdditionalMessage, fnResolveRetry, fnRejectRetry) {
            var iRetryAfterTime = oRetryAfterDate.getTime();
            var oAutoRetryModel = new JSONModel({
                lapsedSeconds: 0
            });
            var oAutoRetryDialog = null;
            var oConfirmRetryDialog = null;
            var oAutoRetryProgressIndicator = null;
            var oAutoRetryText = null;
            var iAutoRetryInterval = -1;

            function getAutoRetryText (iSeconds) {
                return getText("ST_GENERIC_503_SERVICE_UNAVAILABLE") + " " + getText("ST_GENERIC_503_AUTO_RETRY_MSG", [iSeconds]);
            }
            // Creating the text (which shows the remaining time) and binding with model
            oAutoRetryText = new Text({
                text: getAutoRetryText(iInitialSecondsToRetryAfter)
            });
            oAutoRetryText.setModel(oAutoRetryModel);
            oAutoRetryText.bindText({
                path: "/lapsedSeconds",
                formatter: function (iLapsedSeconds) {
                    var iSecondsUntilRetryAfter = iInitialSecondsToRetryAfter - iLapsedSeconds;
                    return getAutoRetryText(iSecondsUntilRetryAfter);
                }
            });
            // Progress indicator 
            oAutoRetryProgressIndicator = new ProgressIndicator({
                percentValue : 0,
                state : ValueState.None
            });
            oAutoRetryProgressIndicator.setModel(oAutoRetryModel);
            oAutoRetryProgressIndicator.bindProperty("percentValue", {
                path: "/lapsedSeconds",
                formatter: function (iLapsedSeconds) {
                    return iLapsedSeconds / iInitialSecondsToRetryAfter * 100;
                }
            });
            // Auto retry dialog which contains the above text and progress indicator
            oAutoRetryDialog = new Dialog({
                type : DialogType.Message,
				state : ValueState.Warning,
                title: getText("ST_MESSAGES_DIALOG_TITLE_WARNING"),
                content: [oAutoRetryText, oAutoRetryProgressIndicator],
                buttons: [
                    new Button({
                        type: ButtonType.Emphasized,
                        text: getText("CANCEL"),
                        press: function () {
                            // Close the current dialog and open the confirmation dialog
                            oAutoRetryDialog.close();
                            oConfirmRetryDialog.open();
                        }
                    })
                ]
            });
            // Confirmation dialog
            oConfirmRetryDialog = new Dialog({
                type : DialogType.Message,
				state : ValueState.Warning,
                title: getText("ST_MESSAGES_DIALOG_TITLE_WARNING"),
                content: [
                    new Text({ text: getText("ST_GENERIC_503_CANCEL_RETRY") })
                ],
                buttons: [
                    new Button({
                        type: ButtonType.Emphasized,
                        text: getText("RETRY"),
                        press: function () {
                            // As the user wants to retry, close the current dialog and reopen the auto retry dialog which contains progress indicator
                            oConfirmRetryDialog.close();
                            oAutoRetryDialog.open();
                        }
                    }),
                    new Button({
                        text: getText("CANCEL"),
                        press: function () {
                            // Abort retry and close the confirmation dialog
                            fnRejectRetry(new Error("Request(s) canceled by user"));
                            oConfirmRetryDialog.close();
                            // Clear the interval for updating the auto-retry model
                            clearInterval(iAutoRetryInterval);
                            // Navigate to message page
                            fnNavigateToMessagePage(oNow, oRetryAfterDate, sAdditionalMessage);
                        }
                    })
                ]
            });

            // Open the dialog
            oAutoRetryDialog.open();
            // Updates the model on every 1 second
            var iAutoRetryInterval = setInterval(function () {
                var iLapsedSeconds = oAutoRetryModel.getProperty("/lapsedSeconds");
                oAutoRetryModel.setProperty("/lapsedSeconds", iLapsedSeconds + 1);
                // When the retry after time is reached
                //   1. Clear the interval
                //   2. Resolve the promise to retry the request
                //   3. Close the auto retry dialog
                if (new Date().getTime() > iRetryAfterTime) {
                    clearInterval(iAutoRetryInterval);
                    fnResolveRetry();
                    oAutoRetryDialog.close();
                }
            }, 1000);
        }

        /**
         * This function navigates the user to message page.
         * - The message page's text is a constant
         * - The description is calculated based on the retry after time
         * 
         * @param {Date} oNow Current date
         * @param {Date} oRetryAfterDate Retry after date
         * @param {string} sAdditionalMessage Additional message to be shown below the description
         */
        function fnNavigateToMessagePage (oNow, oRetryAfterDate, sAdditionalMessage) {
            var aAdditionalContent = [];
            if (sAdditionalMessage) {
                aAdditionalContent.push(new Text({text: sAdditionalMessage}));
            }

            oTemplateContract.oNavigationControllerProxy.navigateToMessagePage({
                messageType: IllustratedMessageType.UnableToLoad,
                title: getText("ST_GENERIC_ERROR_TITLE"),
                text: getText("ST_GENERIC_503_SERVICE_UNAVAILABLE"),
                description: fnGetErrorMessageWithTime(oNow, oRetryAfterDate),
                additionalContent: aAdditionalContent
            });
        }

        /**
         * It derives the retry after message based on the time difference between the current date and retry after date.
         * 
         * @param {Date} oNow Current date
         * @param {Date} oRetryAfterDate Retry after date
         * @returns {string} Message with the retry after date/time
         */
        function fnGetErrorMessageWithTime (oNow, oRetryAfterDate) {
            var sResultMessage = null;
            // Date format varies from case to case
            var oDateFormat = null;
            var sFormattedDate = null;
            //Time format remains same
            var oTimeFormat = DateFormat.getTimeInstance({
                pattern: sTimePattern
            });
            var sFormattedTime = oTimeFormat.format(oRetryAfterDate);

            if (oNow.getYear() !== oRetryAfterDate.getYear()) {
                // Different year
                oDateFormat = DateFormat.getDateInstance({
                    pattern: "MMMM dd, yyyy"
                });
                sFormattedDate = oDateFormat.format(oRetryAfterDate);
                sResultMessage = getText("ST_GENERIC_503_RETRY_MSG_OTHER_DAY", [sFormattedDate, sFormattedTime]);
            } else if (oNow.getMonth() !== oRetryAfterDate.getMonth() || oNow.getDate() !== oRetryAfterDate.getDate()) {
                // Different day
                oDateFormat = DateFormat.getDateInstance({
                    pattern: "MMMM dd"
                });
                sFormattedDate = oDateFormat.format(oRetryAfterDate);
                sResultMessage = getText("ST_GENERIC_503_RETRY_MSG_OTHER_DAY", [sFormattedDate, sFormattedTime]);
            } else {
                // Same day (only time is required)
                sResultMessage = getText("ST_GENERIC_503_RETRY_MSG_SAME_DAY", [sFormattedTime]);
            }
            return sResultMessage;
        }

        function fnRegisterRetryAfterHandler() {
            // Registering the retry after handler to model
            var oModel = oAppComponent.getModel();
            oModel.setRetryAfterHandler(fnRetryAfterHandler);
        }

        /**
         * When the response doesn't have "retry-after" header
         */
        var oMessageModel = Messaging.getMessageModel();
        var a503MessageFilters = [
            new Filter("technical", FilterOperator.EQ, true), // technical message
            new Filter("technicalDetails/statusCode", FilterOperator.EQ, 503) // status code as 503
        ];
        var oMessageListBinding = oMessageModel.bindList("/", null, null, a503MessageFilters);
        oMessageListBinding.attachChange((oEvent) => {
            var oMessageBinding = oEvent.getSource();
            // Navigate to message page when
            // 1. There's exactly one message with the status code 503 (and)
            // 2. There's exactly one message present in the message model
            if (oMessageBinding.getLength() === 1 && oMessageModel.getData()?.length === 1) {
                oTemplateContract.oNavigationControllerProxy.navigateToMessagePage({
                    messageType: IllustratedMessageType.UnableToLoad,
                    title: getText("ST_GENERIC_ERROR_TITLE"),
                    text: getText("ST_GENERIC_503_SERVICE_UNAVAILABLE"),
                    description: getText("ST_GENERIC_503_RETRY_MSG_TIME_UNKNOWN")
                });
            }
        });

        /* eslint-disable */
        testableHelper.testable(fnGetErrorMessageWithTime, "fnGetErrorMessageWithTime");
        /* eslint-enable */
        
        return {
            registerRetryAfterHandler: fnRegisterRetryAfterHandler
        };
	}

	return BaseObject.extend("sap.suite.ui.generic.template.lib.RetryAfterHandler", {
		constructor: function (oTemplateContract, oAppComponent) {
			extend(this, getMethods(oTemplateContract, oAppComponent));
		}
	});
});
