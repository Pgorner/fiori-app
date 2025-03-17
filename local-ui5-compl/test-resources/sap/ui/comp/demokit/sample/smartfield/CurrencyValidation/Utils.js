sap.ui.define(
	[
        "sap/ui/core/util/MockServer"
	],
	function (MockServer) {
		"use strict";

        return {
            SUCCESS: 'Success',
            ERROR: 'Error',
            processFlowDefaultValues: {
                frontend: {
                    iconColor: "Neutral",
                    label:"",
                    text: ""
                },
                model: {
                    iconColor: "Neutral",
                    label:"",
                    text: ""
                },
                request: {
                    iconColor: "Neutral",
                    label:"",
                    text: ""
                },
                backend: {
                    iconColor: "Neutral",
                    label:"",
                    text: ""
                }
            },
            isPostOrMerge: function(sMethod){
                return sMethod === MockServer.HTTPMETHOD.MERGE || sMethod === MockServer.HTTPMETHOD.POST;
            },
			/**
			 * Internal custom function used to simulate a backend validation of currency code.
			 * The criteria are valid only for this example.
			 * @param {string} sCurrencyCode  - the currency code
			 * @returns {boolean} - True if the currency code is known from the backend, false otherwise
			 */
			backendCurrencyCodeValidation: function(sCurrencyCode){
				return ["EUR", "USD", "JPY", "CLF", "KWD", "USDN", "MY"].indexOf(sCurrencyCode) !== -1;
			},

			/**
			 * Internal custom function used to simulate a backend validation of currency value.
			 * The criteria are valid only for this example.
			 * @param {string} sAmount - the currency amount (Price)
			 * @param {string} sCurrencyCode  - the currency code
			 * @returns {boolean} - True if the amount has suitable number of decimal digits based on the currency code. False otherwise
			 */
			backendCurrencyAmountValidation: function(sAmount, sCurrencyCode) {
				var nDecimalDigitsCount = 2, iSeparatorPosition;

				switch (sCurrencyCode) {
					case "JPY":
						nDecimalDigitsCount = 0;
						break;
					case "KWD":
						nDecimalDigitsCount = 3;
						break;
					case "CLF":
						nDecimalDigitsCount = 4;
						break;
					case "USDN":
						nDecimalDigitsCount = 5;
						break;
					case "MY":
						nDecimalDigitsCount = 7;
						break;
					default:
						break;
				}

				if (sAmount.indexOf(".") === -1 && sAmount.indexOf(",") === -1) {
					return true;
				}

				iSeparatorPosition = sAmount.indexOf(".") !== -1 ? sAmount.indexOf(".") : sAmount.indexOf(",");

				return (sAmount.length - 1) - iSeparatorPosition <= nDecimalDigitsCount;
			}
        };
    }
);
