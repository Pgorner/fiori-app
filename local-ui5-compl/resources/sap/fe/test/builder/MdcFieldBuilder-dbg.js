/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["./FEBuilder", "sap/ui/mdc/enums/FieldDisplay", "sap/fe/test/Utils", "sap/ui/mdc/enums/ConditionValidated"],
	function (FEBuilder, FieldDisplay, Utils, ConditionValidated) {
		"use strict";

		var VALUE_DESCRIPTION_PATTERN = /(.+?) \((.+?)\)/;

		/**
		 * This function checks whether the expected value is fulfilled by the checked value.
		 * Both values can be either an array or a single element.
		 * In case of arrays, the it checks the second parameter to start with the same vales as the expected value array.
		 * @param {any} vExpectedValue
		 * @param {any} vValueToCheck
		 * @returns {boolean} `true` if expected values are met, `false` else
		 * @private
		 */
		function _equalish(vExpectedValue, vValueToCheck) {
			vExpectedValue = (vExpectedValue && [].concat(vExpectedValue)) || [];
			vValueToCheck = (vValueToCheck && [].concat(vValueToCheck)) || [];

			return vExpectedValue.every(function (vValue, iIndex) {
				return iIndex < vValueToCheck.length && (vValue || "") == (vValueToCheck[iIndex] || "");
			});
		}

		/**
		 * This function checks the current value against expected values with respect to the display type.
		 * @param {sap.ui.mdc.enums.FieldDisplay} sDisplay The type of display
		 * @param {any} oExpectedValue
		 * @param {any} oExpectedDescription
		 * @param {any} vActualValue
		 * @param {any} vActualDescription
		 * @returns {boolean|boolean} The result of the check
		 * @private
		 */
		function _fieldDisplayEquals(sDisplay, oExpectedValue, oExpectedDescription, vActualValue, vActualDescription) {
			switch (sDisplay) {
				case FieldDisplay.Value:
					return _equalish(oExpectedValue, vActualValue);
				case FieldDisplay.Description:
					return oExpectedDescription === undefined
						? _equalish(oExpectedValue, vActualDescription)
						: _equalish(oExpectedDescription, vActualDescription);
				case FieldDisplay.ValueDescription:
				case FieldDisplay.DescriptionValue:
					return (
						_equalish(oExpectedValue, vActualValue) &&
						(oExpectedDescription === undefined || _equalish(oExpectedDescription, vActualDescription))
					);
				default:
					throw new Error(Utils.formatMessage("unsupported field display '{0}'", sDisplay));
			}
		}

		function _parseValue(vValue, sDisplay) {
			var mResult = {};
			if (Utils.isOfType(vValue, Array)) {
				mResult.value = vValue.length > 0 ? vValue[0] : null;
				mResult.description = vValue.length > 1 ? vValue[1] : undefined;
			} else if (Utils.isOfType(vValue, Object)) {
				mResult.value = vValue.value;
				mResult.description = vValue.description;
			} else {
				switch (sDisplay) {
					case FieldDisplay.Description:
						mResult.value = undefined;
						mResult.description = vValue;
						break;
					case FieldDisplay.ValueDescription:
					case FieldDisplay.DescriptionValue:
						var aMatches = VALUE_DESCRIPTION_PATTERN.exec(vValue);
						if (aMatches) {
							mResult.value = sDisplay === FieldDisplay.ValueDescription ? aMatches[1] : aMatches[2];
							mResult.description = sDisplay === FieldDisplay.ValueDescription ? aMatches[2] : aMatches[1];
							break;
						}
					// of no match, fall through to default
					case FieldDisplay.Value:
					default:
						mResult.value = vValue;
						mResult.description = undefined;
				}
			}
			return mResult;
		}

		var FieldBuilder = function () {
			return FEBuilder.apply(this, arguments);
		};

		FieldBuilder.create = function (oOpaInstance) {
			return new FieldBuilder(oOpaInstance);
		};

		FieldBuilder.prototype = Object.create(FEBuilder.prototype);
		FieldBuilder.prototype.constructor = FieldBuilder;

		FieldBuilder.prototype.hasValue = function (vValue) {
			// silently ignore undefined argument for convenience
			if (vValue === undefined) {
				return this;
			}
			return this.has(FieldBuilder.Matchers.value(vValue));
		};

		/**
		 * Checks for certain condition value(s).
		 * @param {string|object|Array} [vValue] The expected value(s)
		 * @param {string} [sOperator] The expected operator
		 * @returns {sap.fe.test.builder.FieldBuilder} `this`
		 * @public
		 * @ui5-restricted
		 */
		FieldBuilder.prototype.hasConditionValues = function (vValue, sOperator) {
			// silently ignore undefined argument for convenience
			if (vValue === undefined) {
				return this;
			}
			return this.has(FieldBuilder.Matchers.conditionsValue(vValue, sOperator));
		};

		/**
		 * Changes the value of the field.
		 * @param {string} vValue The new value
		 * @returns {sap.fe.test.builder.FieldBuilder} `this`
		 * @public
		 * @ui5-restricted
		 */
		FieldBuilder.prototype.doChangeValue = function (vValue) {
			// silently ignore undefined argument for convenience
			if (vValue === undefined) {
				return this;
			}
			return this.doEnterText(vValue);
		};

		/**
		 * Returns the state matcher for the MdcField control.
		 * @param {any} mState
		 * @returns {*} The state matcher.
		 * @protected
		 */
		FieldBuilder.prototype.getStatesMatcher = function (mState) {
			return FieldBuilder.Matchers.states(mState);
		};

		FieldBuilder.prototype.doPressKeyboardShortcut = function (sShortcut) {
			return this.do(FEBuilder.Actions.keyboardShortcut(sShortcut, "input"));
		};

		FieldBuilder.prototype.doOpenValueHelp = function () {
			return this.doPressKeyboardShortcut("F4");
		};

		FieldBuilder.Matchers = {
			value: function (vExpectedValue) {
				return function (oField) {
					if (!oField.isA("sap.ui.mdc.Field")) {
						throw new Error("Expected sap.ui.mdc.Field but got " + oField.getMetadata().getName());
					}

					var mExpectedValue = _parseValue(vExpectedValue, oField.getDisplay()),
						vValue = oField.getValue(),
						vDescription = oField.getAdditionalValue();

					return _fieldDisplayEquals(oField.getDisplay(), mExpectedValue.value, mExpectedValue.description, vValue, vDescription);
				};
			},
			/**
			 * Returns a matcher function that checks a field for given condition value(s) and operator (optional).
			 * @param {string|object|Array} vExpectedValue The expected value
			 * @param {string} [sOperator] The operator of the condition
			 * @returns {function(*=): *|boolean} The matcher function.
			 * @static
			 * @ui5-restricted
			 */
			conditionsValue: function (vExpectedValue, sOperator) {
				if (!Utils.isOfType(vExpectedValue, Array)) {
					vExpectedValue = [vExpectedValue];
				}
				return function (oField) {
					var aExpectedValues = vExpectedValue.map(function (vElement) {
							return _parseValue(vElement, oField.getDisplay());
						}),
						aConditions = oField.getConditions().map(function (oCondition) {
							return {
								conditionOperator: oCondition.operator,
								conditionValue: _parseValue(oCondition.values),
								conditionValidated: oCondition.validated === ConditionValidated.Validated
							};
						}),
						fnConditionsCheck = function (vExpected) {
							return function (oCondition) {
								if (sOperator && oCondition.conditionOperator !== sOperator) {
									return false;
								}
								return _fieldDisplayEquals(
									oField.getDisplay(),
									vExpected.value,
									vExpected.description,
									oCondition.conditionValue.value,
									oCondition.conditionValidated ? vExpected.description : oCondition.conditionValue.description
								);
							};
						};
					return (
						aConditions &&
						aExpectedValues.every(function (vExpected) {
							return aConditions.some(fnConditionsCheck(vExpected));
						})
					);
				};
			},
			state: function (sName, vValue) {
				switch (sName) {
					case "content":
						return function (oField) {
							var oContentDisplay = oField.getContentDisplay(),
								oContentEdit = oField.getContentEdit(),
								oContent = oField.getContent(),
								aContents = (oField.getAggregation("_content") || []).concat(
									oContent || [],
									oContentDisplay || [],
									oContentEdit || []
								),
								fnMatcher = FEBuilder.Matchers.states(vValue);
							return aContents.some(fnMatcher);
						};
					case "contentEdit":
					case "contentDisplay":
						return function (oField) {
							return FEBuilder.Matchers.states(vValue)(oField.getAggregation(sName));
						};
					default:
						return FEBuilder.Matchers.state(sName, vValue);
				}
			},
			states: function (mStateMap) {
				return FEBuilder.Matchers.states(mStateMap, FieldBuilder.Matchers.state);
			}
		};

		FieldBuilder.Actions = {};

		return FieldBuilder;
	}
);
