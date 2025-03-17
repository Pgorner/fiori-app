sap.ui.define((function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var dist = {exports: {}};

	(function (module, exports) {
		(function webpackUniversalModuleDefinition(root, factory) {
			module.exports = factory();
		})(commonjsGlobal, () => {
		return /******/ (() => { // webpackBootstrap
		/******/ 	var __webpack_modules__ = ({

		/***/ "./src/converters/BaseAdaptiveCard.ts":
		/*!********************************************!*\
		  !*** ./src/converters/BaseAdaptiveCard.ts ***!
		  \********************************************/
		/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		exports.BaseAdaptiveCard = void 0;
		var templates_1 = __webpack_require__(/*! ../templates */ "./src/templates/index.ts");
		/**
		 *
		 * Abstract class for converting Integration card to Adaptive Card
		 * subclass must implement getContent and getAdaptiveStructure
		 *
		 */
		var BaseAdaptiveCard = /** @class */ (function () {
		    /**
		     * Constructs a new instance of the BaseAdaptiveCard and initializes it with the given parameters.
		     *
		     * @param integrationCardManifest The integration card manifest.
		     * @param converterOptions The converter options for the adaptive card.
		     * @param timeOptions The localization parameters for date and time formatting.
		     */
		    function BaseAdaptiveCard(integrationCardManifest, converterOptions, timeOptions) {
		        this.content = {};
		        this.baseStructure = this.getTemplateStructure('adaptiveBase');
		        this.integrationCardManifest = integrationCardManifest;
		        this.timeOptions = timeOptions || {};
		        this.converterOptions = converterOptions;
		        this.header = this.getCardHeader();
		        this.footer = {};
		    }
		    /**
		     * Method to get the card header
		     *
		     * @returns AdaptiveCardObjects The adaptive card objects corresponding to the 'adaptiveHeader' template
		     * @private
		     */
		    BaseAdaptiveCard.prototype.getCardHeader = function () {
		        return this.getAdaptiveStructure('adaptiveHeader');
		    };
		    /**
		     * Retrieves the template structure for a given template name.
		     * If the template name is not provided, it returns an empty object.
		     *
		     * @param {string} templateName The name of the template for which the structure is required.
		     * @returns {object} The template structure as a deep copy of the corresponding adaptive card template.
		     * @protected
		     */
		    BaseAdaptiveCard.prototype.getTemplateStructure = function (templateName) {
		        if (!templateName) {
		            return {};
		        }
		        return JSON.parse(JSON.stringify(templates_1.AdaptiveCardTemplates[templateName]));
		    };
		    /**
		     * Merges the given adaptive card structure into the base adaptive card structure.
		     * If the structure is an array, it concatenates the array to the base body.
		     * If the structure is a single object, it pushes the object to the base body.
		     *
		     * @param {AdaptiveBaseStructure} base - The base adaptive card structure to be updated.
		     * @param {AdaptiveCardObjects} structure - The adaptive card structure to be merged into the base.
		     * @returns {void}
		     * @protected
		     */
		    BaseAdaptiveCard.prototype.mergeStructureToBase = function (base, structure) {
		        if (Array.isArray(structure)) {
		            base.body = base.body.concat(structure);
		        }
		        else {
		            base.body.push(structure);
		        }
		    };
		    /**
		     * Generates the complete adaptive card structure by merging the base structure with the header, content, and footer.
		     * It also adds metadata to the adaptive card structure.
		     *
		     * @returns {AdaptiveBaseStructure} - The fully constructed adaptive card structure.
		     */
		    BaseAdaptiveCard.prototype.generateAdaptiveCard = function () {
		        var adaptiveBaseStructure = this.baseStructure;
		        this.mergeStructureToBase(adaptiveBaseStructure, this.header);
		        this.mergeStructureToBase(adaptiveBaseStructure, this.getContent());
		        var footer = this.footer;
		        if (footer && Object.keys(footer).length) {
		            this.mergeStructureToBase(adaptiveBaseStructure, footer);
		        }
		        adaptiveBaseStructure.metadata = {
		            'sap.cards.ap': this.integrationCardManifest['sap.insights']
		        };
		        return adaptiveBaseStructure;
		    };
		    return BaseAdaptiveCard;
		}());
		exports.BaseAdaptiveCard = BaseAdaptiveCard;


		/***/ }),

		/***/ "./src/converters/ObjectAdaptiveCard.ts":
		/*!**********************************************!*\
		  !*** ./src/converters/ObjectAdaptiveCard.ts ***!
		  \**********************************************/
		/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


		var __extends = (this && this.__extends) || (function () {
		    var extendStatics = function (d, b) {
		        extendStatics = Object.setPrototypeOf ||
		            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
		            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
		        return extendStatics(d, b);
		    };
		    return function (d, b) {
		        if (typeof b !== "function" && b !== null)
		            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
		        extendStatics(d, b);
		        function __() { this.constructor = d; }
		        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		    };
		})();
		Object.defineProperty(exports, "__esModule", ({ value: true }));
		exports.ObjectAdaptiveCard = void 0;
		var BaseAdaptiveCard_1 = __webpack_require__(/*! ./BaseAdaptiveCard */ "./src/converters/BaseAdaptiveCard.ts");
		var Binding_1 = __webpack_require__(/*! ../helpers/Binding */ "./src/helpers/Binding.ts");
		var CommonUtils_1 = __webpack_require__(/*! ../utils/CommonUtils */ "./src/utils/CommonUtils.ts");
		var FooterAction_1 = __webpack_require__(/*! ../helpers/FooterAction */ "./src/helpers/FooterAction.ts");
		var formatters_1 = __webpack_require__(/*! ../formatters */ "./src/formatters/index.ts");
		var FormatterUtils_1 = __webpack_require__(/*! ../formatters/FormatterUtils */ "./src/formatters/FormatterUtils.ts");
		var QueryBuilder_1 = __webpack_require__(/*! ../helpers/QueryBuilder */ "./src/helpers/QueryBuilder.ts");
		var MAX_COLUMNS = 3;
		/**
		 *
		 * Class for converting Object Integration card to Object Adaptive Card
		 * extends BaseAdaptiveCard implements getContent and getAdaptiveStructure for Object card
		 *
		 */
		var ObjectAdaptiveCard = /** @class */ (function (_super) {
		    __extends(ObjectAdaptiveCard, _super);
		    /**
		     * Constructs a new instance of the ObjectAdaptiveCard and initializes it with the given parameters.
		     *
		     * @param integrationCardManifest The integration card manifest.
		     * @param converterOptions The converter options for the adaptive card.
		     * @param timeOptions The localization parameters for date and time formatting.
		     */
		    function ObjectAdaptiveCard(integrationCardManifest, converterOptions, timeOptions) {
		        return _super.call(this, integrationCardManifest, converterOptions, timeOptions) || this;
		    }
		    /**
		     * Checks if the hideActions property is set to true in the manifest
		     *
		     * @returns true if the hideActions property is set to true, otherwise false.
		     */
		    ObjectAdaptiveCard.prototype.isHideActions = function () {
		        var _a, _b, _c, _d, _e;
		        var mConfig = (_c = (_b = (_a = this.converterOptions) === null || _a === void 0 ? void 0 : _a.cardsConfig) === null || _b === void 0 ? void 0 : _b.embeds) === null || _c === void 0 ? void 0 : _c.ObjectPage;
		        var defaultEntitySet = mConfig === null || mConfig === void 0 ? void 0 : mConfig.default;
		        return Boolean(defaultEntitySet && ((_e = (_d = mConfig === null || mConfig === void 0 ? void 0 : mConfig.manifests[defaultEntitySet]) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.hideActions));
		    };
		    /**
		     * Updates the column set items within the given adaptive object structure.
		     * This function processes nested column set items, validates and formats text values,
		     * and ensures that the number of columns meets the required maximum.
		     *
		     * @param adaptiveObjectStructure - The adaptive object structure to be updated.
		     * @returns AdaptiveObjectStructure[] The updated adaptive object structure.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.updateColumnSetItems = function (adaptiveObjectStructure) {
		        var _a, _b;
		        var adaptiveGroups = adaptiveObjectStructure[0].items;
		        for (var j = 0; j < adaptiveGroups.length; j++) {
		            var containerItems = adaptiveGroups[j].items;
		            var columnSetItems = (_a = containerItems === null || containerItems === void 0 ? void 0 : containerItems[1]) === null || _a === void 0 ? void 0 : _a.items;
		            var nestedColumnSetItems = (_b = columnSetItems === null || columnSetItems === void 0 ? void 0 : columnSetItems[0]) === null || _b === void 0 ? void 0 : _b.items;
		            for (var _i = 0, nestedColumnSetItems_1 = nestedColumnSetItems; _i < nestedColumnSetItems_1.length; _i++) {
		                var nestedColumnSetItem = nestedColumnSetItems_1[_i];
		                var rowItems = nestedColumnSetItem.columns;
		                rowItems.forEach(function (rowItem) {
		                    var valueText = rowItem.items[1].text;
		                    var emptyText = rowItem.items[2].text;
		                    var endIndex = valueText.indexOf('}');
		                    var propertyRegex = /^\$\{[^{}]+\}$/;
		                    if (emptyText !== '&minus;' &&
		                        rowItem.items[2].isVisible === false) {
		                        rowItem.items.splice(2, 1);
		                    }
		                    //validate if valueText is in the format of ${propertyValue}
		                    if (propertyRegex.test(valueText) &&
		                        !valueText.includes('convertToUTC') &&
		                        !valueText.includes('formatDateTime')) {
		                        var formatterExpression = valueText.slice(2, endIndex);
		                        rowItem.items[1].text = "${if(trim(string(".concat(formatterExpression, ")) == '', '&minus;', string(").concat(formatterExpression, "))}");
		                    }
		                });
		                if (rowItems.length && rowItems.length < MAX_COLUMNS) {
		                    var emptyRowsLength = MAX_COLUMNS - rowItems.length;
		                    for (var i = 0; i < emptyRowsLength; i++) {
		                        rowItems.push({
		                            "type": "Column",
		                            "width": "stretch"
		                        });
		                    }
		                }
		            }
		            if (adaptiveObjectStructure[0].items[j].items[1] && nestedColumnSetItems.length > 0) {
		                adaptiveObjectStructure[0].items[j].items[1].items = nestedColumnSetItems;
		            }
		        }
		        return adaptiveObjectStructure;
		    };
		    /**
		     * Retrieves the footer actions for the adaptive card if any actions exist.
		     * It creates an instance of FooterAction using the integration card manifest,
		     * checks if any footer actions exist, and returns the footer actions if they do.
		     *
		     * @returns AdaptiveCardObjects | undefined The footer actions for the adaptive card, or undefined if no actions exist.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.getCardFooter = function () {
		        if (!this.isHideActions()) {
		            var footerActionInstance = new FooterAction_1.FooterAction(this.integrationCardManifest, this.converterOptions);
		            var actionExists = footerActionInstance.actionExists();
		            if (actionExists) {
		                return footerActionInstance.getActions();
		            }
		        }
		    };
		    /**
		     * Updates the column set items within the adaptive card object based on the provided template source and repeat property.
		     * This function organizes the items into a container with column sets, ensuring that the number of columns does not exceed the maximum allowed.
		     *
		     * @param templateSource The source template array used to determine the structure of the column sets.
		     * @param adaptiveCardObject The adaptive card object to be updated with the new column set items.
		     * @param repeatProperty The array of columns to be repeated and added to the column sets.
		     * @returns void
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.getUpdatedColumnSetItems = function (templateSource, adaptiveCardObject, repeatProperty) {
		        var container = {
		            type: 'Container',
		            items: []
		        };
		        for (var index = 0; index < templateSource.length; index++) {
		            if (index % MAX_COLUMNS === 0) {
		                var newColumnSet = {
		                    type: 'ColumnSet',
		                    columns: []
		                };
		                container.items.push(newColumnSet);
		            }
		            var currentItem = repeatProperty[index];
		            container.items[container.items.length - 1].columns.push(currentItem);
		        }
		        adaptiveCardObject.items = container.items;
		    };
		    /**
		     * Handles the repeat template for the given adaptive card object.
		     * This function processes the repeat settings, updates the repeat property, and manages the column set items if applicable.
		     *
		     * @param adaptiveCardObject The adaptive card object to be updated with the repeat template.
		     * @returns void
		     */
		    ObjectAdaptiveCard.prototype.handleRepeatTemplate = function (adaptiveCardObject) {
		        var _a, _b;
		        var repeatSetting = (_a = adaptiveCardObject._internal) === null || _a === void 0 ? void 0 : _a.repeat;
		        var repeatSource = repeatSetting === null || repeatSetting === void 0 ? void 0 : repeatSetting.source;
		        var templateSource = (0, CommonUtils_1.getDescendantPropertyValue)((_b = this.integrationCardManifest) === null || _b === void 0 ? void 0 : _b['sap.card'], repeatSource) || [];
		        var repeatProperty = adaptiveCardObject[repeatSetting.propertyName];
		        if ((repeatSetting === null || repeatSetting === void 0 ? void 0 : repeatSetting.propertyName) === 'columns') {
		            var column = repeatProperty[0];
		            if (column._internal) {
		                column._internal.source = "".concat(repeatSource, "[0]");
		            }
		        }
		        for (var index = 0; index < templateSource.length - 1; index++) {
		            repeatProperty[index]._internal.source = "".concat(repeatSource, "[").concat(index, "]");
		            var templateCopy = JSON.parse(JSON.stringify(repeatProperty[index]));
		            templateCopy._internal.source = "".concat(repeatSource, "[").concat(index + 1, "]");
		            repeatProperty.push(templateCopy); // hard coded 0, breaking the reference
		        }
		        if (repeatSource.startsWith('content.groups[') && repeatSource.endsWith('].items')) {
		            this.getUpdatedColumnSetItems(templateSource, adaptiveCardObject, repeatProperty);
		        }
		    };
		    /**
		     * Handles the template for the given adaptive card object.
		     * This function processes the internal template structure, updates property and repeat values with the correct source,
		     * and deeply iterates over the adaptive card object to apply the template.
		     *
		     * @param adaptiveCardObject The adaptive card object to be updated with the template.
		     * @returns void
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.handleTemplate = function (adaptiveCardObject) {
		        var internal = adaptiveCardObject._internal;
		        if (!internal) {
		            return;
		        }
		        internal.template = this.getTemplateStructure(internal.template);
		        var templateItems = internal.template.items;
		        if (internal.source && templateItems) {
		            templateItems.forEach(function (templateItem) {
		                var itemInternal = templateItem._internal;
		                if (itemInternal) {
		                    if (itemInternal.properties) {
		                        itemInternal.properties.forEach(function (property) {
		                            var propertyName = property.value.split('.').pop();
		                            property.value = "".concat(internal.source, ".").concat(propertyName);
		                        });
		                    }
		                    if (itemInternal.repeat) {
		                        itemInternal.repeat.source = "".concat(internal.source, ".").concat(itemInternal.repeat.source.split('.').pop());
		                    }
		                }
		                else {
		                    templateItem._internal = {
		                        source: internal.source
		                    };
		                }
		            });
		        }
		        Object.assign(adaptiveCardObject, adaptiveCardObject._internal.template);
		        this.iterateAdaptiveCardObjectDeeply(adaptiveCardObject === null || adaptiveCardObject === void 0 ? void 0 : adaptiveCardObject._internal);
		    };
		    /**
		     * Updates the properties of the adaptive card object
		     *
		     * @param adaptiveCardObject The adaptive card object to be updated
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.updateProperties = function (adaptiveCardObject) {
		        var _a;
		        if ((_a = adaptiveCardObject._internal) === null || _a === void 0 ? void 0 : _a.properties) {
		            adaptiveCardObject._internal.properties.forEach(function (property) {
		                var propertyName = property.value.split('.').pop();
		                property.value = adaptiveCardObject._internal.source + '.' + propertyName;
		            });
		        }
		    };
		    /**
		     * Updates the repeat source of the given template item based on the adaptive card object's source.
		     * This function modifies the repeat source of the template item by appending the last segment of the original repeat source
		     * to the source of the adaptive card object.
		     *
		     * @param adaptiveCardObject The adaptive card object containing the new source.
		     * @param templateItem The template item whose repeat source is to be updated.
		     * @returns void
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.updateRepeatSource = function (adaptiveCardObject, templateItem) {
		        if (templateItem._internal.repeat) {
		            var repeatSourceEnd = templateItem._internal.repeat.source.split('.').pop();
		            templateItem._internal.repeat.source = adaptiveCardObject._internal.source + '.' + repeatSourceEnd;
		        }
		    };
		    /**
		     * Handles the template item for the adaptive card object
		     *
		     * @param adaptiveCardObject The adaptive card object containing the source
		     * @param templateItem The template item to be updated
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.handleTemplateItem = function (adaptiveCardObject, templateItem) {
		        var _a;
		        if (templateItem._internal) {
		            this.updateProperties(templateItem);
		            this.updateRepeatSource(adaptiveCardObject, templateItem);
		        }
		        else {
		            templateItem._internal = {
		                source: (_a = adaptiveCardObject === null || adaptiveCardObject === void 0 ? void 0 : adaptiveCardObject._internal) === null || _a === void 0 ? void 0 : _a.source
		            };
		        }
		    };
		    /**
		     *  Handles the source template for the given adaptive card object.
		     * This function processes the items within the adaptive card object, updating each template item with the correct source and properties.
		     * If no items are present, it updates the properties of the adaptive card object directly.
		     * Finally, it deeply iterates over the adaptive card object to apply the template updates.
		     *
		     * @param adaptiveCardObject The adaptive card object to be updated with the source template
		     * @returns void
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.handleSourceTemplate = function (adaptiveCardObject) {
		        var _this = this;
		        var templateItems = adaptiveCardObject.items;
		        if (templateItems) {
		            templateItems.forEach(function (templateItem) {
		                _this.handleTemplateItem(adaptiveCardObject, templateItem);
		            });
		            templateItems.forEach(this.handleTemplateItem.bind(this, adaptiveCardObject));
		        }
		        else {
		            this.updateProperties(adaptiveCardObject);
		        }
		        this.iterateAdaptiveCardObjectDeeply(adaptiveCardObject === null || adaptiveCardObject === void 0 ? void 0 : adaptiveCardObject._internal);
		    };
		    /**
		     * Checks if the given property value matches the format "content.groups[<index>].items[<index>].label".
		     *
		     * This function uses a regular expression to determine if the input string contains the required substrings
		     * "content.groups[", "].items[", and "].label" with numeric indices in square brackets.
		     *
		     * @param {string} propertyValue - The property value to be checked.
		     * @returns {boolean} - Returns true if the property value matches the format, otherwise false.
		     */
		    ObjectAdaptiveCard.prototype.isGroupLabel = function (propertyValue) {
		        var propertyLabelRegex = /content\.groups\[\d*\]\.items\[\d*\]\.label/;
		        return propertyLabelRegex.test(propertyValue);
		    };
		    /**
		     * Retrieves the value of a specified property from the integration card manifest.
		     * If the property type is 'Expression', it resolves the expression binding to get the value.
		     *
		     * @param property The property definition object containing the property name and type.
		     * @returns The value of the specified property, or an empty string if the property is not found.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.getPropertyValue = function (property) {
		        var _a, _b;
		        var sPropertyValue = property.value;
		        var value = (0, CommonUtils_1.getDescendantPropertyValue)((_a = this.integrationCardManifest) === null || _a === void 0 ? void 0 : _a['sap.card'], sPropertyValue) || '';
		        if (value && this.isGroupLabel(sPropertyValue)) {
		            value = "".concat(value, ":");
		        }
		        if (property.type === 'Expression') {
		            value = (0, Binding_1.resolveExpressionBinding)((_b = this.integrationCardManifest) === null || _b === void 0 ? void 0 : _b['sap.card'], sPropertyValue);
		        }
		        return value;
		    };
		    /**
		     * Extracts the criticality expression from the input string
		     *
		     * @param inputString The input string containing the criticality expression.
		     * @returns The extracted criticality expression, or an empty string if the markers are not found.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.extractCriticallityExpression = function (inputString) {
		        var startMarker = '${';
		        var endMarker = '}';
		        var startIndex = inputString.indexOf(startMarker);
		        var endIndex = inputString.indexOf(endMarker, startIndex);
		        if (startIndex !== -1 && endIndex !== -1) {
		            // Extracting the content between `${` and the first `}` encountered after that.
		            return inputString.substring(startIndex + startMarker.length, endIndex);
		        }
		        return '';
		    };
		    /**
		     * Handles the state color formatting
		     *
		     * @param adaptiveCardObject The adaptive card object to be updated with the state color.
		     * @param valueFieldName The name of the property in the adaptive card object to be updated with the color.
		     * @param value The state value to be mapped to a color.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.handleStateColorFormatting = function (adaptiveCardObject, valueFieldName, value) {
		        var stateToColor = {
		            Critical: 'Warning',
		            Error: 'Attention',
		            Information: 'Accent',
		            None: 'Default',
		            Success: 'Good',
		            Warning: 'Warning',
		            Good: 'Good'
		        };
		        adaptiveCardObject[valueFieldName] = value ? stateToColor[value] : "Default";
		    };
		    /**
		     * Handles the expression formatting for the given adaptive card object.
		     *
		     * @param adaptiveCardObject The adaptive card object to be updated with the formatted expression.
		     * @param valueFieldName The name of the property in the adaptive card object to be updated with the formatted expression.
		     * @param value The value containing the expression to be formatted.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.handleExpressionFormatting = function (adaptiveCardObject, valueFieldName, value) {
		        if (value.includes('formatValueColor')) {
		            adaptiveCardObject[valueFieldName] = (0, Binding_1.getBindingExpression)(value);
		            return;
		        }
		        var formatterExpression = this.extractCriticallityExpression(value);
		        if (formatterExpression.length) {
		            var adaptiveFormatText = "${if(toLower(".concat(formatterExpression, ") == 'critical', 'Warning', if(toLower(").concat(formatterExpression, ") == 'error', 'Attention', if(toLower(").concat(formatterExpression, ") == 'good', 'Good', if(int(").concat(formatterExpression, ") == 3, 'Good', if(int(").concat(formatterExpression, ") == 1, 'Attention', if(int(").concat(formatterExpression, ") == 2, 'Warning', 'Default'))))))}");
		            adaptiveCardObject[valueFieldName] = adaptiveFormatText;
		        }
		        else {
		            adaptiveCardObject[valueFieldName] = 'Default';
		        }
		    };
		    /**
		     * Formats the state color based on if it is a static value or binding
		     * In case of static value resolve the color based on the value
		     * In case if binding a binding expression is created which is resolved at runtime by the adaptive card
		     *
		     * @param adaptiveCardObject The adaptive card object to be updated with the formatted state color.
		     * @param valueFieldName The name of the property in the adaptive card object to be updated with the state color.
		     * @param value The value to be formatted, which can be an expression or a direct state value.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.formatStateColor = function (adaptiveCardObject, valueFieldName, value) {
		        if (value.startsWith('{=')) {
		            this.handleExpressionFormatting(adaptiveCardObject, valueFieldName, value);
		        }
		        else {
		            this.handleStateColorFormatting(adaptiveCardObject, valueFieldName, value);
		        }
		    };
		    /**
		     * Handles the supported formatter expression for the given expression string.
		     *
		     * @param expression The expression string to be processed.
		     * @param formatterConversionSupported A flag indicating whether formatter conversion is supported.
		     * @returns The updated expression if conversion is supported, otherwise the original expression.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.handleSupportedFormatterExpression = function (expression, formatterConversionSupported) {
		        if (formatterConversionSupported) {
		            return (0, formatters_1.updateFormatterExpression)(expression, this.timeOptions);
		        }
		        return expression;
		    };
		    /**
		     * Converts binding expressions containing date and time placeholders to adaptive card expressions.
		     *
		     * @param bindingExpression The binding expression containing date and time placeholders.
		     * @returns The updated binding expression with adaptive card expressions.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.getTextArrangementValueForDate = function (bindingExpression) {
		        var datePattern = /{{DATE\((.*?)\)}}/g;
		        var timePattern = /{{TIME\((.*?)\)}}/g;
		        var parts = bindingExpression.split(/({{DATE\(.*?\)}}|{{TIME\(.*?\)}})/g);
		        var updatedParts = parts.map(function (part) {
		            var isDateOrTimePattern = datePattern.test(part) || timePattern.test(part);
		            return isDateOrTimePattern ? part : part.replace(/{/g, '${');
		        });
		        return updatedParts.join('');
		    };
		    /**
		     * Processes a date value based on navigation, binding, and text arrangement flags.
		     *
		     * @param value The date value to be processed.
		     * @param hasNavigation Flag indicating if navigation is enabled, which replaces slashes with dots.
		     * @param hasBinding Flag indicating if binding is enabled.
		     * @param hasTextArrangement Flag indicating if text arrangement is enabled.
		     * @returns The processed date value.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.handleDateValue = function (value, hasNavigation, hasBinding, hasTextArrangement) {
		        value = hasNavigation ? value.replace(/\//g, '.') : value;
		        if (hasNavigation || hasBinding || hasTextArrangement) {
		            return this.getTextArrangementValueForDate(value);
		        }
		        return value;
		    };
		    /**
		     * Handles the navigation property for adaptive card object
		     * Replaces '/' with '.' and '{' with '${'
		     *
		     * @param value The property value to be processed.
		     * @returns The updated property value.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.handleNavigationProperty = function (value) {
		        return value.replace(/\//g, '.').replace(/{/g, '${');
		    };
		    /**
		     * Converts binding expressions to adaptive card expressions by replacing '{' with '${'.
		     *
		     * @param value The string containing binding expressions to be converted.
		     * @returns The updated string with adaptive card expressions.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.handleBindingOrTextArrangement = function (value) {
		        return value.replace(/{/g, '${');
		    };
		    /**
		     * Creates a binding expression for the given value.
		     *
		     * @param value The string value to be converted into a binding expression.
		     * @returns The binding expression formatted for adaptive cards, or the original value if no conversion is needed.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.createBindingExpression = function (value) {
		        var hasIntegrationCardDefaultFormatters = value.indexOf('format.') > -1;
		        var hasCardExtensionFormatters = value.indexOf('extension.formatters.') > -1;
		        var hasBinding = (0, Binding_1.isExpression)(value) && !(0, Binding_1.isI18nText)(value);
		        var hasTextArrangement = (0, Binding_1.isTextArrangement)(value);
		        var hasNavigation = (0, Binding_1.isNavigationProperty)(value);
		        var formatterConversionSupported = (0, FormatterUtils_1.isFormatterConversionSupported)(value);
		        value = this.handleSupportedFormatterExpression(value, formatterConversionSupported);
		        if (value.startsWith('{/items/')) {
		            return '';
		        }
		        if ((0, Binding_1.hasFormatter)(value) && (hasIntegrationCardDefaultFormatters || hasCardExtensionFormatters || hasNavigation)) {
		            return (0, Binding_1.getBindingExpression)(value);
		        }
		        if (value.indexOf('{{DATE') > -1) {
		            return this.handleDateValue(value, hasNavigation, hasBinding, hasTextArrangement);
		        }
		        if (hasNavigation) {
		            return this.handleNavigationProperty(value);
		        }
		        if (hasBinding || hasTextArrangement) {
		            return this.handleBindingOrTextArrangement(value);
		        }
		        return value;
		    };
		    /**
		     * Handles the expression for a given property and updates the adaptive card object accordingly.
		     *
		     * @param adaptiveCardObject The adaptive card object to be updated with the expression..
		     * @param valueFieldName - The name of the property in the adaptive card object to be updated.
		     * @param value - The value of the property to be processed.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.handleExpression = function (adaptiveCardObject, valueFieldName, value) {
		        var propertyPath = (0, Binding_1.getPropertyFromExpression)(value).toString();
		        var bindingExpression = this.createBindingExpression(value);
		        adaptiveCardObject[valueFieldName] = bindingExpression;
		        if (bindingExpression.indexOf('formatDateTime') > -1) {
		            if (adaptiveCardObject.isVisible === false) {
		                adaptiveCardObject.isVisible = "${if(".concat(propertyPath, " == null || ").concat(propertyPath, " == '', true, false)}");
		                adaptiveCardObject[valueFieldName] = '&minus;';
		            }
		            else {
		                adaptiveCardObject.isVisible = "${if(".concat(propertyPath, " != null && ").concat(propertyPath, " != '', true, false)}");
		            }
		        }
		    };
		    /**
		     * Processes a property and updates the given adaptive card object accordingly.
		     *
		     * @param adaptiveCardObject The adaptive card object to be updated with the property value.
		     * @param property The property definition object containing the value and formatter information.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.processProperty = function (adaptiveCardObject, property) {
		        var valueFieldName = property.valueField || null;
		        if (valueFieldName && property.value) {
		            var value = this.getPropertyValue(property);
		            switch (property.formatter) {
		                case '$data':
		                    adaptiveCardObject[valueFieldName] = '${ }'.replace(' ', value).replace('/', '');
		                    break;
		                case '$':
		                    adaptiveCardObject[valueFieldName] = '$' + value;
		                    break;
		                case 'STATE-COLOR':
		                    this.formatStateColor(adaptiveCardObject, valueFieldName, value);
		                    break;
		                default:
		                    this.handleExpression(adaptiveCardObject, valueFieldName, value);
		            }
		        }
		    };
		    /**
		     * Handles the properties template for adaptive card object
		     *
		     * @param adaptiveCardObject The adaptive card object whose properties template is to be handled.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.handlePropertiesTemplate = function (adaptiveCardObject) {
		        var _this = this;
		        var _a;
		        (_a = adaptiveCardObject === null || adaptiveCardObject === void 0 ? void 0 : adaptiveCardObject._internal) === null || _a === void 0 ? void 0 : _a.properties.forEach(function (property) {
		            _this.processProperty(adaptiveCardObject, property);
		        });
		    };
		    /**
		     * Processes the card template for adaptive card object
		     *
		     * @param adaptiveCardObject The adaptive card object to be processed.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.processCardTemplate = function (adaptiveCardObject) {
		        var internal = adaptiveCardObject._internal;
		        if (!internal) {
		            return;
		        }
		        var repeat = internal.repeat, template = internal.template, source = internal.source, properties = internal.properties;
		        if (repeat) {
		            this.handleRepeatTemplate(adaptiveCardObject);
		        }
		        if (template) {
		            this.handleTemplate(adaptiveCardObject);
		        }
		        if (source) {
		            this.handleSourceTemplate(adaptiveCardObject);
		        }
		        if (properties) {
		            this.handlePropertiesTemplate(adaptiveCardObject);
		        }
		        delete adaptiveCardObject._internal;
		    };
		    /**
		     * Recursively iterates over the adaptive card objects and processes each object with internal properties.
		     *
		     * @param adaptiveCardObjects The adaptive card objects to be iterated and processed.
		     * @private
		     */
		    ObjectAdaptiveCard.prototype.iterateAdaptiveCardObjectDeeply = function (adaptiveCardObjects) {
		        var _this = this;
		        Object.keys(adaptiveCardObjects).forEach(function (key) {
		            if (adaptiveCardObjects[key] && typeof adaptiveCardObjects[key] === 'object') {
		                if (adaptiveCardObjects[key].hasOwnProperty('_internal')) {
		                    _this.processCardTemplate(adaptiveCardObjects[key]);
		                }
		                _this.iterateAdaptiveCardObjectDeeply(adaptiveCardObjects[key]);
		                return;
		            }
		        });
		    };
		    /**
		     * Implements the abstract method getAdaptiveStructure of the parent class BaseAdaptiveCard
		     * Method to get the adaptive card structure of the object card
		     *
		     * @param templateName The name of the template for which the adaptive structure is required.
		     * @returns The adaptive card objects corresponding to the specified template name.
		     * @protected
		     */
		    ObjectAdaptiveCard.prototype.getAdaptiveStructure = function (templateName) {
		        var adaptiveObjectStructure = templateName === "adaptiveHeader" ? this.getTemplateStructure(templateName)["objectCardHeader"] : this.getTemplateStructure(templateName);
		        this.iterateAdaptiveCardObjectDeeply(adaptiveObjectStructure);
		        if (templateName === 'adaptiveObjectCard') {
		            adaptiveObjectStructure = this.updateColumnSetItems(adaptiveObjectStructure);
		        }
		        this.footer = this.getCardFooter();
		        return adaptiveObjectStructure;
		    };
		    /**
		     * Implements the abstract method getContent of the parent class BaseAdaptiveCard
		     * Method to get the content of the object card
		     *
		     * @returns The adaptive card objects corresponding to the 'adaptiveObjectCard' template.
		     * @protected
		     */
		    ObjectAdaptiveCard.prototype.getContent = function () {
		        var content = this.getAdaptiveStructure('adaptiveObjectCard');
		        return content;
		    };
		    /**
		     * Generates an adaptive card structure with a formatted header.
		     *
		     * This method overrides the base class's `generateAdaptiveCard` method to add
		     * additional functionality for formatting the header of the adaptive card.
		     *
		     * The header text is modified to include a link, to the application URL.
		     *
		     * @returns {AdaptiveBaseStructure} The modified adaptive card structure.
		     */
		    ObjectAdaptiveCard.prototype.generateAdaptiveCard = function () {
		        _super.prototype.generateAdaptiveCard.call(this);
		        var adaptiveBaseStructure = this.baseStructure;
		        var cardHeader = adaptiveBaseStructure.body[0];
		        var headerTitle = cardHeader.text;
		        if (headerTitle && !headerTitle.startsWith("[")) {
		            var applicationUrl = this.getApplicationUrl();
		            headerTitle = headerTitle.startsWith("{") ? "$".concat(headerTitle) : headerTitle;
		            cardHeader.text = "[ ".concat(headerTitle, " ](").concat(applicationUrl, ")");
		        }
		        return adaptiveBaseStructure;
		    };
		    /**
		     * Constructs and returns the application URL based on the integration card manifest and converter options.
		     *
		     * This method extracts the entity set from the integration card manifest and uses the converter options
		     * to build a URL that includes the application intent, entity set, and context as URL parameters.
		     *
		     * @param {Record<string, string>} [filters] The filters to be applied to the application URL.
		     * @returns {URL} The constructed application URL.
		     * @public
		     */
		    ObjectAdaptiveCard.prototype.getApplicationUrl = function () {
		        var _a, _b, _c, _d, _e, _f, _g, _h;
		        var _j = this.integrationCardManifest['sap.card'], data = _j.data, configuration = _j.configuration;
		        var configParameters = configuration.parameters;
		        var entitySet = ((_b = (_a = configuration.parameters) === null || _a === void 0 ? void 0 : _a._entitySet) === null || _b === void 0 ? void 0 : _b.value) || '';
		        var _k = this.converterOptions, serviceUrl = _k.serviceUrl, appIntent = _k.appIntent, context = _k.context;
		        var parametersValueMap = {
		            "{{parameters._entitySet}}": entitySet,
		            '{{parameters.contextParameters}}': (0, QueryBuilder_1.getContextAsUrl)(context)
		        };
		        (_d = (_c = configParameters === null || configParameters === void 0 ? void 0 : configParameters._mandatoryODataParameters) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.forEach(function (key) {
		            parametersValueMap["{{parameters.".concat(key, "}}")] = context[key];
		        });
		        var batchInfo = (_e = data === null || data === void 0 ? void 0 : data.request) === null || _e === void 0 ? void 0 : _e.batch;
		        var contentUrl = ((_f = batchInfo === null || batchInfo === void 0 ? void 0 : batchInfo.content) === null || _f === void 0 ? void 0 : _f.url) || ((_g = batchInfo === null || batchInfo === void 0 ? void 0 : batchInfo.response) === null || _g === void 0 ? void 0 : _g.url) || '';
		        var objectPageUrl = contentUrl.split('?')[0];
		        Object.keys(parametersValueMap).forEach(function (key) {
		            objectPageUrl = objectPageUrl.replace(key, parametersValueMap[key] + "");
		        });
		        var appUrl = ((_h = window === null || window === void 0 ? void 0 : window.location) === null || _h === void 0 ? void 0 : _h.href) ? new URL(window.location.href) : "";
		        var pathName = appUrl ? appUrl.pathname : '/ui';
		        var applicationUrl = new URL(pathName, serviceUrl);
		        applicationUrl.hash = appIntent;
		        applicationUrl.hash = "".concat(applicationUrl.hash, "&/").concat(objectPageUrl);
		        return applicationUrl;
		    };
		    return ObjectAdaptiveCard;
		}(BaseAdaptiveCard_1.BaseAdaptiveCard));
		exports.ObjectAdaptiveCard = ObjectAdaptiveCard;


		/***/ }),

		/***/ "./src/converters/TableAdaptiveCard.ts":
		/*!*********************************************!*\
		  !*** ./src/converters/TableAdaptiveCard.ts ***!
		  \*********************************************/
		/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


		var __extends = (this && this.__extends) || (function () {
		    var extendStatics = function (d, b) {
		        extendStatics = Object.setPrototypeOf ||
		            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
		            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
		        return extendStatics(d, b);
		    };
		    return function (d, b) {
		        if (typeof b !== "function" && b !== null)
		            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
		        extendStatics(d, b);
		        function __() { this.constructor = d; }
		        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		    };
		})();
		Object.defineProperty(exports, "__esModule", ({ value: true }));
		exports.TableAdaptiveCard = void 0;
		var Binding_1 = __webpack_require__(/*! ../helpers/Binding */ "./src/helpers/Binding.ts");
		var CommonUtils_1 = __webpack_require__(/*! ../utils/CommonUtils */ "./src/utils/CommonUtils.ts");
		var BaseAdaptiveCard_1 = __webpack_require__(/*! ./BaseAdaptiveCard */ "./src/converters/BaseAdaptiveCard.ts");
		/**
		 *
		 * Class for converting Table Integration card to Table Adaptive Card
		 * extends BaseAdaptiveCard implements getContent and getAdaptiveStructure based on the table template
		 *
		 */
		var TableAdaptiveCard = /** @class */ (function (_super) {
		    __extends(TableAdaptiveCard, _super);
		    /**
		     * Constructs a new instance of the TableAdaptiveCard and initializes it with the given parameters.
		     *
		     * @param integrationCardManifest The integration card manifest.
		     * @param converterOptions The converter options for the adaptive card.
		     * @param timeOptions The localization parameters for date and time formatting.
		     */
		    function TableAdaptiveCard(integrationCardManifest, converterOptions, timeOptions) {
		        return _super.call(this, integrationCardManifest, converterOptions, timeOptions) || this;
		    }
		    /**
		     * Implementation of the abstract method getContent of the parent class BaseAdaptiveCard
		     * Method to get the content of the table card
		     *
		     * @returns The adaptive card objects corresponding to the table card
		     * @protected
		     */
		    TableAdaptiveCard.prototype.getContent = function () {
		        return this.getAdaptiveStructure('AdaptiveTable');
		    };
		    /**
		     * Filters out the invisible properties from the given adaptive card object.
		     * This function processes the table columns and items, removing any cells that have a visibility condition ($when).
		     * It updates the adaptive card object with only the visible columns and items.
		     *
		     * @param adaptiveCardObject The adaptive card object containing table columns and items to be filtered.
		     * @returns The updated adaptive card object with only visible properties.
		     * @private
		     */
		    TableAdaptiveCard.prototype.getVisibleProperties = function (adaptiveCardObject) {
		        var _a, _b;
		        var tableColumns = (_a = adaptiveCardObject[0]) === null || _a === void 0 ? void 0 : _a.rows[0];
		        var tableItems = (_b = adaptiveCardObject[0]) === null || _b === void 0 ? void 0 : _b.rows[1];
		        if ((tableColumns === null || tableColumns === void 0 ? void 0 : tableColumns.cells) && (tableItems === null || tableItems === void 0 ? void 0 : tableItems.cells)) {
		            var visibleColumns = tableColumns.cells.filter(function (tableCell) {
		                return !tableCell.items[0].$when;
		            });
		            var visibleItems = tableItems.cells.filter(function (tableCell) {
		                return !tableCell.items[0].$when;
		            });
		            tableColumns.cells = visibleColumns;
		            tableItems.cells = visibleItems;
		        }
		        return adaptiveCardObject;
		    };
		    /**
		    * Implementation of the abstract method getAdaptiveStructure of the parent class BaseAdaptiveCard
		    * Method to get the adaptive card structure of the table card
		    *
		    * @param templateName The name of the template for which the adaptive structure is required.
		    * @returns The adaptive card objects corresponding to the specified template name.
		    * @protected
		    */
		    TableAdaptiveCard.prototype.getAdaptiveStructure = function (templateName) {
		        var adaptiveCardObject = templateName === "adaptiveHeader" ? this.getTemplateStructure(templateName)["tableCardHeader"] : this.getTemplateStructure(templateName);
		        if (!adaptiveCardObject) {
		            return {};
		        }
		        this.iterateObjectDeeplyForTable(adaptiveCardObject);
		        if (templateName !== "adaptiveHeader") {
		            return this.getVisibleProperties(adaptiveCardObject);
		        }
		        return adaptiveCardObject;
		    };
		    /**
		     * Repeats the table template for the given adaptive card object node.
		     *
		     * @param adaptiveCardObject The adaptive card object node to be updated with the repeated template.
		     * @private
		     */
		    TableAdaptiveCard.prototype.repeatTableTemplate = function (adaptiveCardObject) {
		        var _a, _b, _c;
		        var repeatSetting = (_a = adaptiveCardObject._internal) === null || _a === void 0 ? void 0 : _a.repeat;
		        var templateSource = (_c = (0, CommonUtils_1.getDescendantPropertyValue)((_b = this.integrationCardManifest) === null || _b === void 0 ? void 0 : _b["sap.card"], repeatSetting.source)) !== null && _c !== void 0 ? _c : [];
		        templateSource = templateSource.filter(function (container) {
		            var firstContainer = container === null || container === void 0 ? void 0 : container[0];
		            return (firstContainer === null || firstContainer === void 0 ? void 0 : firstContainer.label) !== null && !(firstContainer === null || firstContainer === void 0 ? void 0 : firstContainer.value);
		        });
		        for (var index = 0; index < templateSource.length - 1; index++) {
		            adaptiveCardObject[repeatSetting.propertyName][index].items[0]._internal.source = repeatSetting.source + "[" + index + "]";
		            var templateCopy = JSON.parse(JSON.stringify(adaptiveCardObject[repeatSetting.propertyName][index]));
		            templateCopy.items[0]._internal.source = repeatSetting.source + "[" + (index + 1) + "]";
		            adaptiveCardObject[repeatSetting.propertyName].push(templateCopy);
		        }
		    };
		    /**
		     * Converts the horizontal alignment value from the input format to the corresponding CSS alignment value.
		     *
		     * @param hAlign The horizontal alignment value to be converted.
		     * @returns The corresponding CSS alignment value ("left", "center", "right").
		     * @private
		     */
		    TableAdaptiveCard.prototype.getHorizontalAlignment = function (hAlign) {
		        switch (hAlign) {
		            case "Begin":
		            case "Left":
		                return "left";
		            case "Center":
		                return "center";
		            case "End":
		            case "Right":
		                return "right";
		            default:
		                return "left";
		        }
		    };
		    /**
		     * Handles the card data for the given adaptive card object.
		     * This function retrieves the property value from the integration card manifest, processes it to remove any leading slashes,
		     * converts it to a binding expression, and updates the $data property of the adaptive card object.
		     *
		     * @param adaptiveCardObject The adaptive card object whose $data property is to be handled.
		     * @private
		     */
		    TableAdaptiveCard.prototype.handleCardData = function (adaptiveCardObject) {
		        var _a, _b;
		        var sPropertyValue = adaptiveCardObject.$data;
		        var value = (_b = (0, CommonUtils_1.getDescendantPropertyValue)((_a = this.integrationCardManifest) === null || _a === void 0 ? void 0 : _a["sap.card"], sPropertyValue)) !== null && _b !== void 0 ? _b : "";
		        value = value.startsWith("/") ? value.substring(1) : value;
		        value = this.getBindingExpression("{".concat(value, "}"));
		        adaptiveCardObject.$data = value;
		    };
		    /**
		     * Handles the properties of the given adaptive card object.
		     *
		     * @param adaptiveCardObject The adaptive card object whose properties are to be handled.
		     * @private
		     */
		    TableAdaptiveCard.prototype.handleCardProperties = function (adaptiveCardObject) {
		        var _this = this;
		        adaptiveCardObject._internal.properties.forEach(function (property) {
		            var _a;
		            var valueFieldName = property === null || property === void 0 ? void 0 : property.valueField;
		            var sPropertyValue = property === null || property === void 0 ? void 0 : property.value;
		            if (valueFieldName && sPropertyValue) {
		                var value = (0, CommonUtils_1.getDescendantPropertyValue)((_a = _this.integrationCardManifest) === null || _a === void 0 ? void 0 : _a["sap.card"], sPropertyValue);
		                value = typeof value === "undefined" ? "" : value;
		                if (typeof value === "boolean" && valueFieldName === "$when") {
		                    value = value ? false : true;
		                }
		                else if ((value === null || value === void 0 ? void 0 : value.startsWith("{=")) || (value === null || value === void 0 ? void 0 : value.indexOf("{path:")) > -1) {
		                    value = _this.resolveBindingExpression(value);
		                }
		                if (typeof value === "string") {
		                    value = _this.getBindingExpression(value);
		                }
		                adaptiveCardObject[valueFieldName] = value;
		            }
		        });
		    };
		    /**
		     * Handles the source properties for the given adaptive card object.
		     *
		     * @param adaptiveCardObject The adaptive card object whose source properties are to be handled.
		     * @private
		     */
		    TableAdaptiveCard.prototype.handleSource = function (adaptiveCardObject) {
		        var _a;
		        if ((_a = adaptiveCardObject === null || adaptiveCardObject === void 0 ? void 0 : adaptiveCardObject._internal) === null || _a === void 0 ? void 0 : _a.properties) {
		            adaptiveCardObject._internal.properties.forEach(function (property) {
		                var propertyName = property.value.split(".").pop();
		                property.value = adaptiveCardObject._internal.source + "." + propertyName;
		            });
		        }
		        this.iterateObjectDeeplyForTable(adaptiveCardObject._internal);
		    };
		    /**
		     * Performs various operations on the given adaptive card object for table-specific adjustments.
		     *
		     * @param adaptiveCardObject The adaptive card object to be processed.
		     * @private
		     */
		    TableAdaptiveCard.prototype.performOperationForTable = function (adaptiveCardObject) {
		        var _a, _b, _c, _d;
		        if (!adaptiveCardObject._internal) {
		            return;
		        }
		        if (adaptiveCardObject._internal.repeat) {
		            this.repeatTableTemplate(adaptiveCardObject);
		        }
		        if (adaptiveCardObject.$data) {
		            this.handleCardData(adaptiveCardObject);
		        }
		        if (adaptiveCardObject.horizontalAlignment) {
		            var value = (_c = (0, CommonUtils_1.getDescendantPropertyValue)((_a = this.integrationCardManifest) === null || _a === void 0 ? void 0 : _a["sap.card"], (_b = adaptiveCardObject._internal) === null || _b === void 0 ? void 0 : _b.source)) !== null && _c !== void 0 ? _c : "";
		            adaptiveCardObject.horizontalAlignment = this.getHorizontalAlignment(value === null || value === void 0 ? void 0 : value.hAlign);
		        }
		        if ((_d = adaptiveCardObject === null || adaptiveCardObject === void 0 ? void 0 : adaptiveCardObject._internal) === null || _d === void 0 ? void 0 : _d.source) {
		            this.handleSource(adaptiveCardObject);
		        }
		        if (adaptiveCardObject._internal.properties) {
		            this.handleCardProperties(adaptiveCardObject);
		        }
		        delete adaptiveCardObject._internal;
		    };
		    /**
		     * Resolves a binding expression by extracting and formatting the binding paths.
		     *
		     * @param {string} value - The input string containing the binding expression.
		     * @returns {string} - A string containing the unique binding paths formatted as `{value}`,
		     *                     or the original string if no binding paths are found.
		     * @private
		     */
		    TableAdaptiveCard.prototype.resolveBindingExpression = function (value) {
		        var bindingValue = value.startsWith("{=") ? value.substring(0, value.length - 1).replace("{=", "") : value;
		        var bindingPathRegex = /\{path:\s*'([^']+)',/g;
		        var bindingParts = new Set();
		        var biningPath;
		        while ((biningPath = bindingPathRegex.exec(bindingValue)) !== null) {
		            bindingParts.add("{".concat(biningPath[1], "}"));
		        }
		        var bindingPathArray = Array.from(bindingParts);
		        return (bindingPathArray === null || bindingPathArray === void 0 ? void 0 : bindingPathArray.length) ? bindingPathArray.join(' ') : bindingValue;
		    };
		    /**
		     * Converts a binding expression to an adaptive card expression.
		     *
		     * @param value The string containing the binding expression to be converted.
		     * @returns The formatted binding expression for adaptive cards, or the original value if no conversion is needed.
		     * @private
		     */
		    TableAdaptiveCard.prototype.getBindingExpression = function (value) {
		        var hasBinding = (0, Binding_1.isExpression)(value) && !(0, Binding_1.isI18nText)(value);
		        if (hasBinding) {
		            var resolvedValue = value.startsWith("{/") ? value.replace("{/", "{") : value;
		            resolvedValue = resolvedValue.replace(/{/g, "${").replace(/\//g, ".");
		            return resolvedValue;
		        }
		        return value;
		    };
		    /**
		     * Recursively iterates over the properties of the given object node and performs table-specific operations.
		     *
		     * @param adaptiveCardObject The AdaptiveCardObject to be iterated and processed.
		     * @private
		     */
		    TableAdaptiveCard.prototype.iterateObjectDeeplyForTable = function (adaptiveCardObject) {
		        var _this = this;
		        Object.keys(adaptiveCardObject).forEach(function (key) {
		            if (adaptiveCardObject[key] !== null && typeof adaptiveCardObject[key] === "object") {
		                if (adaptiveCardObject[key].hasOwnProperty("_internal")) {
		                    _this.performOperationForTable(adaptiveCardObject[key]);
		                }
		                _this.iterateObjectDeeplyForTable(adaptiveCardObject[key]);
		                return;
		            }
		        });
		    };
		    /**
		     * Generates an adaptive card structure with a formatted header.
		     *
		     * This method overrides the base class's `generateAdaptiveCard` method to add
		     * additional functionality for formatting the header of the adaptive card.
		     *
		     * The header text is modified to include a link, to the application URL.
		     *
		     * @returns {AdaptiveBaseStructure} The modified adaptive card structure.
		     */
		    TableAdaptiveCard.prototype.generateAdaptiveCard = function () {
		        _super.prototype.generateAdaptiveCard.call(this);
		        var adaptiveBaseStructure = this.baseStructure;
		        var cardHeader = adaptiveBaseStructure.body[0];
		        var headerTitle = cardHeader.text;
		        if (headerTitle && !headerTitle.startsWith("[")) {
		            var applicationUrl = this.getApplicationUrl();
		            headerTitle = headerTitle.startsWith("{") ? "$".concat(headerTitle) : headerTitle;
		            cardHeader.text = "[ ".concat(headerTitle, " ](").concat(applicationUrl, ")");
		        }
		        return this.updateFirstColumnText(adaptiveBaseStructure);
		    };
		    /**
		     * Updates the text of the first column in the adaptive card manifest.
		     * If the first column text is not empty, it generates an application URL to navigate to the LR page.
		     * Updates the first column text with a hyperlink to the generated URL.
		     *
		     * @param adaptiveCardManifest - The adaptive card manifest to update.
		     * @returns The updated adaptive card manifest.
		     */
		    TableAdaptiveCard.prototype.updateFirstColumnText = function (adaptiveCardManifest) {
		        var tableCard = adaptiveCardManifest.body[adaptiveCardManifest.body.length - 1];
		        var firstColumnText = tableCard.rows[1].cells[0].items[0].text;
		        if (firstColumnText) {
		            var columnLength = tableCard.rows[1].cells.length;
		            var sensitiveProperties = this.integrationCardManifest['sap.card'].configuration.parameters.sensitiveProps;
		            if (columnLength > 1) {
		                var filters = {};
		                for (var i = 0; i < columnLength; i++) {
		                    var cellKeyText = tableCard.rows[0].cells[i].items[0].text;
		                    var cellValueText = tableCard.rows[1].cells[i].items[0].text.trim();
		                    //To exclude sensitive data from the url, if any of the field in the rowcontext, is present in the sensitiveProps array
		                    if (!(sensitiveProperties === null || sensitiveProperties === void 0 ? void 0 : sensitiveProperties.includes(cellKeyText))) {
		                        filters[cellKeyText] = cellValueText;
		                    }
		                }
		                /* If existing filters are to be added along with row context then,
		                   pass the &$filters from this.integrationCardManifest['sap.card'].data.request.batch.response.url also to filters object.
		                   To do - filters to be passed to getApplicationUrl when we can access data for cell items */
		                var applicationUrlOfLRPage = this.getApplicationUrl();
		                firstColumnText = "[".concat(firstColumnText, "](").concat(applicationUrlOfLRPage, ")");
		            }
		        }
		        tableCard.rows[1].cells[0].items[0].text = firstColumnText;
		        return adaptiveCardManifest;
		    };
		    /**
		     * Constructs and returns the application URL based on the integration card manifest and converter options.
		     *
		     * This method extracts the entity set from the integration card manifest and uses the converter options
		     * to build a URL that includes the application intent, entity set, and context as URL parameters.
		     *
		     * @param {Record<string, string>} [filters] The filters to be applied to the application URL.
		     * @returns {URL} The constructed application URL.
		     * @public
		     */
		    TableAdaptiveCard.prototype.getApplicationUrl = function (filters) {
		        var _a;
		        var _b = this.converterOptions, serviceUrl = _b.serviceUrl, appIntent = _b.appIntent;
		        var appUrl = ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) ? new URL(window.location.href) : "";
		        var pathName = appUrl ? appUrl.pathname : '/ui';
		        var applicationUrl = new URL(pathName, serviceUrl);
		        applicationUrl.hash = appIntent;
		        if (filters) {
		            applicationUrl.hash += "?$filters=".concat(new URLSearchParams(filters).toString());
		        }
		        applicationUrl.hash = "".concat(applicationUrl.hash);
		        return applicationUrl;
		    };
		    return TableAdaptiveCard;
		}(BaseAdaptiveCard_1.BaseAdaptiveCard));
		exports.TableAdaptiveCard = TableAdaptiveCard;


		/***/ }),

		/***/ "./src/formatters/DateFormatters.ts":
		/*!******************************************!*\
		  !*** ./src/formatters/DateFormatters.ts ***!
		  \******************************************/
		/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		exports.convertDateTimeFormatting = exports.convertDateFormatting = void 0;
		var Binding_1 = __webpack_require__(/*! ../helpers/Binding */ "./src/helpers/Binding.ts");
		/**
		 * Accepts Integration card text and evaluates for UTC
		 *
		 * @param text - bindingExpressionValue
		 * @returns true if text has UTC
		 */
		var extractUTCValue = function (text) {
		    // Regular expression to match the UTC value (handle different types of quotes)
		    var utcPattern = /['"]UTC['"]:\s*(true|false)/;
		    var match = text.match(utcPattern);
		    return (match === null || match === void 0 ? void 0 : match[1]) === 'true';
		};
		/**
		 * Get the style if present in the bindingExpression. Default style is set to SHORT.
		 *
		 * @param bindingExpression - The bindingExpression to be checked for style type
		 * @returns - The style type
		 */
		var getStyleType = function (bindingExpression) {
		    var styleExists = bindingExpression.indexOf('style:') > -1;
		    if (styleExists && bindingExpression.indexOf('short') > -1) {
		        return 'COMPACT';
		    }
		    if (styleExists && bindingExpression.indexOf('long') > -1) {
		        return 'LONG';
		    }
		    return 'SHORT';
		};
		/**
		 * Handles date/dateTime conversion
		 *
		 * @param bindingExpression - BindingValue
		 * @param formatType - Either date or dateTime
		 * @returns - replaced expression
		 */
		var applyDateFormatConversionHelper = function (bindingExpression, formatType) {
		    var expressionValue = (0, Binding_1.getPropertyFromExpression)(bindingExpression).toString();
		    var styleType = getStyleType(bindingExpression);
		    // Date or DateTime specific formatting
		    var adaptiveFormatText;
		    var regex;
		    if (formatType === 'date') {
		        // Date formatting
		        var formatting = "${formatDateTime(".concat(expressionValue, ", 'yyyy-MM-ddTHH:mm:ssZ')}");
		        adaptiveFormatText = "{{DATE(".concat(formatting, ", ").concat(styleType, ")}}");
		        regex = /\{=\s*format\.date\(\s*([^\)]+?)\s*(?:,\s*\{[^}]*\})?\s*\)\s*\}/g;
		    }
		    else {
		        // DateTime formatting
		        if (extractUTCValue(bindingExpression)) {
		            adaptiveFormatText = "{if(".concat(expressionValue, " && ").concat(expressionValue, " != '', convertToUTC(").concat(expressionValue, ", 'UTC', 'ddd d MMM YYYY HH:mm'), '&minus;')}");
		            regex = /\{=\s*format\.dateTime\(([^)]+)\)\s*\}/g;
		        }
		        else {
		            var formatting = "${formatDateTime(".concat(expressionValue, ", 'yyyy-MM-ddTHH:mm:ssZ')}");
		            adaptiveFormatText = "{{DATE(".concat(formatting, ", ").concat(styleType, ")}} {{TIME(").concat(formatting, ")}}");
		            regex = /\{=\s*format\.dateTime\(\s*([^\)]+?)\s*(?:,\s*\{[^}]*\})?\s*\)\s*\}/g;
		        }
		    }
		    return bindingExpression.replace(regex, adaptiveFormatText);
		};
		/**
		 * Apply the date format conversion on the bindingExpression.
		 *
		 * @param bindingExpression - The bindingExpression to be formatted
		 * @returns - adaptiveFormatText
		 */
		var convertDateFormatting = function (bindingExpression) {
		    return applyDateFormatConversionHelper(bindingExpression, 'date');
		};
		exports.convertDateFormatting = convertDateFormatting;
		/**
		 * Apply the datetime format conversion on the bindingExpression.
		 *
		 * @param bindingExpression - The bindingExpression to be formatted
		 * @returns - adaptiveFormatText
		 */
		var convertDateTimeFormatting = function (bindingExpression) {
		    return applyDateFormatConversionHelper(bindingExpression, 'dateTime');
		};
		exports.convertDateTimeFormatting = convertDateTimeFormatting;


		/***/ }),

		/***/ "./src/formatters/FormatterUtils.ts":
		/*!******************************************!*\
		  !*** ./src/formatters/FormatterUtils.ts ***!
		  \******************************************/
		/***/ ((__unused_webpack_module, exports) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		exports.isFormatterConversionSupported = isFormatterConversionSupported;
		/**
		 * Checks if the given value supports formatter conversion.
		 *
		 *
		 * @param {string} value - The string to check for supported formatter conversion.
		 * @returns {boolean} - Returns true if the value supports formatter conversion, otherwise false.
		 */
		function isFormatterConversionSupported(value) {
		    var supportedFormats = [
		        'format.float',
		        'format.integer',
		        'format.unit',
		        'format.percent',
		        'format.dateTime',
		        'format.date'
		    ];
		    for (var _i = 0, supportedFormats_1 = supportedFormats; _i < supportedFormats_1.length; _i++) {
		        var format = supportedFormats_1[_i];
		        if (value.includes(format)) {
		            if (format.startsWith('format.date') && value.includes('relative')) {
		                return isRelativeDate(value);
		            }
		            return true;
		        }
		    }
		    return false;
		}
		/**
		 * Checks if the given text indicates a non-relative date.
		 *
		 * @param {string} text - The text to check for the 'relative' date indicator.
		 * @returns {boolean} - Returns true if the 'relative' key is present and its value is 'false', otherwise false.
		 * @private
		 */
		function isRelativeDate(text) {
		    // Regular expression to match the UTC value (handle different types of quotes)
		    var utcPattern = /['"]relative['"]:\s*(true|false)/;
		    var match = text.match(utcPattern);
		    return (match === null || match === void 0 ? void 0 : match[1]) === 'false';
		}


		/***/ }),

		/***/ "./src/formatters/NumberFormatter.ts":
		/*!*******************************************!*\
		  !*** ./src/formatters/NumberFormatter.ts ***!
		  \*******************************************/
		/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		exports.convertUnitFormatting = exports.convertPercentFormatting = exports.convertFloatFormatting = exports.convertIntegerFormatting = void 0;
		var Binding_1 = __webpack_require__(/*! ../helpers/Binding */ "./src/helpers/Binding.ts");
		/**
		 * Get the decimals bindingExpression if present in the bindingExpression.
		 *
		 * @param bindingExpression - The bindingExpression to be checked for decimals
		 * @returns - The decimals bindingExpression
		 */
		var getDecimalValue = function (bindingExpression) {
		    // Regular expression to find decimals
		    var regex = /['"]?decimals['"]?:\s*(\d+)/;
		    var match = bindingExpression.match(regex);
		    if (match && match[1]) {
		        return match[1];
		    }
		    else if (bindingExpression.includes('format.integer')) {
		        return 0;
		    }
		    //For float format, default decimal value is set to 2
		    return 2;
		};
		var getUnitFromText = function (integrationText) {
		    var formatUnitPart = integrationText.match(/\{= format\.unit\(([^)]*)\)\}/);
		    if (!formatUnitPart || !formatUnitPart[1]) {
		        return '';
		    }
		    var placeholdersPart = formatUnitPart[1];
		    var placeholders = placeholdersPart.match(/\$\{([^}]+)\}/g);
		    if (placeholders && placeholders.length > 1) {
		        return placeholders[1].replace(/^\$\{/, '').replace(/\}$/, '');
		    }
		    return '';
		};
		/**
		 * Handles integer/float conversion
		 *
		 * @param bindingExpression - Binding value
		 * @param formatType - Integer or float
		 * @param timeOptions - locale
		 * @returns - replaced expression formed.
		 */
		var convertNumberFormatting = function (bindingExpression, formatType, timeOptions) {
		    var _a;
		    var expressionValue = (0, Binding_1.getPropertyFromExpression)(bindingExpression);
		    var locale = (_a = timeOptions === null || timeOptions === void 0 ? void 0 : timeOptions.locale) !== null && _a !== void 0 ? _a : null;
		    var decimalValue = getDecimalValue(bindingExpression);
		    var adaptiveFormatText = "{formatNumber(float(".concat(expressionValue, "), ").concat(decimalValue, ", '").concat(locale, "')}");
		    var regex = new RegExp("\\{=\\s*format\\.".concat(formatType, "\\(([^)]+)\\)\\s*\\}"), 'g');
		    return bindingExpression.replace(regex, adaptiveFormatText);
		};
		/**
		 * Apply the integer format conversion on the bindingExpression.
		 *
		 * @param bindingExpression - The bindingExpression to be formatted
		 * @param timeOptions
		 * @returns - adaptiveFormatText
		 */
		var convertIntegerFormatting = function (bindingExpression, timeOptions) {
		    return convertNumberFormatting(bindingExpression, 'integer', timeOptions);
		};
		exports.convertIntegerFormatting = convertIntegerFormatting;
		/**
		 * Apply the float format conversion on the bindingExpression.
		 *
		 * @param bindingExpression - The bindingExpression to be formatted
		 * @param timeOptions
		 * @returns - adaptiveFormatText
		 */
		var convertFloatFormatting = function (bindingExpression, timeOptions) {
		    return convertNumberFormatting(bindingExpression, 'float', timeOptions);
		};
		exports.convertFloatFormatting = convertFloatFormatting;
		/**
		 * Apply the percent format conversion on the integrationText.
		 *
		 * @param integrationText - The integrationText to be formatted
		 * @returns - The formatted integrationText
		 */
		var convertPercentFormatting = function (integrationText) {
		    var expressionValue = (0, Binding_1.getPropertyFromExpression)(integrationText);
		    var adaptiveFormatText = "{".concat(expressionValue, "*100}%");
		    var regex = /\{=\s*format\.percent\(([^)]+)\)\s*\}/g;
		    return integrationText.replace(regex, adaptiveFormatText);
		};
		exports.convertPercentFormatting = convertPercentFormatting;
		var convertUnitFormatting = function (integrationText) {
		    var expressionValue = (0, Binding_1.getPropertyFromExpression)(integrationText);
		    var decimalValue = getDecimalValue(integrationText);
		    var adaptiveUnit = getUnitFromText(integrationText);
		    var adaptiveFormatText = "{formatNumber(float(".concat(expressionValue, "), ").concat(decimalValue, ")} {").concat(adaptiveUnit, "}");
		    var regex = /\{=\s*format\.unit\(([^)]+)\)\s*\}/g;
		    return integrationText.replace(regex, adaptiveFormatText);
		};
		exports.convertUnitFormatting = convertUnitFormatting;


		/***/ }),

		/***/ "./src/formatters/index.ts":
		/*!*********************************!*\
		  !*** ./src/formatters/index.ts ***!
		  \*********************************/
		/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		exports.updateFormatterExpression = updateFormatterExpression;
		var NumberFormatter_1 = __webpack_require__(/*! ./NumberFormatter */ "./src/formatters/NumberFormatter.ts");
		var DateFormatters_1 = __webpack_require__(/*! ./DateFormatters */ "./src/formatters/DateFormatters.ts");
		var formatterFunctions = {
		    'format.float': NumberFormatter_1.convertFloatFormatting,
		    'format.integer': NumberFormatter_1.convertIntegerFormatting,
		    'format.dateTime': DateFormatters_1.convertDateTimeFormatting,
		    'format.date': DateFormatters_1.convertDateFormatting,
		    'format.percent': NumberFormatter_1.convertPercentFormatting,
		    'format.unit': NumberFormatter_1.convertUnitFormatting
		};
		/**
		 * Update the formatter value based on the getExpressionValue.
		 * logic to apply the formatter conversion based on the expression
		 *
		 * @param expression - The expression to be formatted
		 * @param timeOptions
		 * @returns adaptiveText - converted adaptive text
		 */
		function updateFormatterExpression(expression, timeOptions) {
		    for (var format in formatterFunctions) {
		        if (expression.includes(format)) {
		            return formatterFunctions[format](expression, timeOptions);
		        }
		    }
		    return expression;
		}


		/***/ }),

		/***/ "./src/helpers/Binding.ts":
		/*!********************************!*\
		  !*** ./src/helpers/Binding.ts ***!
		  \********************************/
		/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		exports.getPropertyFromExpression = exports.isNavigationProperty = exports.isTextArrangement = exports.hasFormatter = exports.isI18nText = exports.isExpression = exports.getBindingExpression = exports.resolveExpressionBinding = void 0;
		exports.parseExpressionBinding = parseExpressionBinding;
		var CommonUtils_1 = __webpack_require__(/*! ../utils/CommonUtils */ "./src/utils/CommonUtils.ts");
		/**
		 *	Resolves the binding condition
		 *
		 * @param integrationCardManifest The integration card manifest
		 * @param bindingCondition The binding conditions needs to be resolved
		 * @returns The resolved binding condition
		 */
		var resolveBindingCondition = function (integrationCardManifest, bindingCondition) {
		    var conditionTokens = (bindingCondition === null || bindingCondition === void 0 ? void 0 : bindingCondition.split(' ')) || [];
		    var result = '', index = 0;
		    conditionTokens.forEach(function (conditionToken) {
		        index++;
		        var value = (0, CommonUtils_1.getDescendantPropertyValue)(integrationCardManifest, conditionToken) || '';
		        var isOperator = index % 2 === 0;
		        if (value) {
		            value = "'" + value + "'";
		            result = index === 1 ? result + value : result + ' ' + value;
		        }
		        else if (isOperator) {
		            result = result + ' ' + conditionToken;
		        }
		        else {
		            result = index === 1 ? 'false' : ' false';
		        }
		    });
		    return result;
		};
		/**
		 * Resolves the expression binding
		 *
		 * @param integrationCardManifest The integration card manifest
		 * @param expressionBinding The expression binding needs to be resolved
		 * @returns The resolved binding string
		 */
		var resolveExpressionBinding = function (integrationCardManifest, expressionBinding) {
		    var resolvedBinding = '';
		    if ((expressionBinding === null || expressionBinding === void 0 ? void 0 : expressionBinding.indexOf('?')) > -1 && (expressionBinding === null || expressionBinding === void 0 ? void 0 : expressionBinding.indexOf(':')) > -1) {
		        var startIndex = (expressionBinding === null || expressionBinding === void 0 ? void 0 : expressionBinding.indexOf('(')) + 1, endIndex = expressionBinding === null || expressionBinding === void 0 ? void 0 : expressionBinding.indexOf(')');
		        if (startIndex && endIndex) {
		            var bindingCondition = expressionBinding === null || expressionBinding === void 0 ? void 0 : expressionBinding.substring(startIndex, endIndex), resolvedCondition = resolveBindingCondition(integrationCardManifest, bindingCondition);
		            resolvedBinding = expressionBinding === null || expressionBinding === void 0 ? void 0 : expressionBinding.replace(bindingCondition, resolvedCondition);
		        }
		    }
		    return resolvedBinding;
		};
		exports.resolveExpressionBinding = resolveExpressionBinding;
		/**
		 * Parses an expression binding string and returns an object with the parts of the expression.
		 * Uses expression evaluation algorithm to parse the expression binding.
		 *
		 * @param expression - The expression binding string to parse.
		 * @returns An object with a `parts` property.
		 */
		function parseExpressionBinding(expression) {
		    var stack = [];
		    var parts = [];
		    var index = 0;
		    var currentExpression = expression;
		    while (currentExpression.length > 0) {
		        var startingChar = currentExpression[0];
		        currentExpression = currentExpression.slice(1);
		        if (startingChar === '{' && currentExpression.startsWith('=')) {
		            stack.push('{=');
		            currentExpression = currentExpression.slice(1);
		        }
		        else if (startingChar === '{' || startingChar === '(') {
		            if ((startingChar === '{' && stack.indexOf('{=') > -1 && expression[index] === '$') ||
		                (startingChar === '{' && stack.indexOf('{=') === -1)) {
		                parts.push({
		                    path: currentExpression.substring(0, currentExpression.indexOf('}'))
		                });
		            }
		            stack.push(startingChar);
		        }
		        else if (startingChar === '}' || startingChar === ')') {
		            stack.pop();
		        }
		        index++;
		    }
		    return {
		        parts: parts
		    };
		}
		/**
		 * Parses a binding expression and returns paths of the binding expression.
		 * in case of multiple paths, it return the paths as '${path1} ${path2}'
		 *
		 * @param value - The binding expression to parse.
		 * @returns A JSON string representation of the binding and its parts.
		 */
		var getBindingExpression = function (value) {
		    if (value.includes('{=')) {
		        var bindingInfo = parseExpressionBinding(value);
		        var propertyPaths_1 = [];
		        bindingInfo.parts.forEach(function (argument) {
		            if (argument === null || argument === void 0 ? void 0 : argument.path) {
		                propertyPaths_1.push('${' + argument.path + '}');
		            }
		        });
		        return propertyPaths_1.join(' ');
		    }
		    return '';
		};
		exports.getBindingExpression = getBindingExpression;
		/**
		 * Checks if a given path is an expression.
		 *
		 * @param path - The path to check.
		 * @returns Returns true if the path starts with "{" and ends with "}", otherwise false.
		 */
		var isExpression = function (path) {
		    return path.startsWith('{') && path.endsWith('}');
		};
		exports.isExpression = isExpression;
		/**
		 * Checks if a given path is an i18n text.
		 *
		 * @param path - The path to check.
		 * @returns Returns true if the path starts with "{{" and ends with "}}", otherwise false.
		 */
		var isI18nText = function (path) {
		    return path.startsWith('{{') && path.endsWith('}}');
		};
		exports.isI18nText = isI18nText;
		/**
		 * Checks if a given path has a formatter.
		 *
		 * @param path - The path to check.
		 * @returns Returns true if the path includes "{=", otherwise false.
		 */
		var hasFormatter = function (path) {
		    return path.includes('{=');
		};
		exports.hasFormatter = hasFormatter;
		/**
		 * Checks if a given path is a text arrangement.
		 *
		 * @param value - The path to check.
		 * @returns Returns true if the path starts with "{" and includes "(" and ")", otherwise false.
		 */
		var isTextArrangement = function (value) {
		    return value.startsWith('{') && value.includes('(') && value.includes(')') && !value.includes('{{');
		};
		exports.isTextArrangement = isTextArrangement;
		/**
		 * Checks if a given path has navigation.
		 *
		 * @param value - The path to check.
		 * @returns Returns true if the path starts with "{" or "(" and includes "/", otherwise false.
		 */
		var isNavigationProperty = function (value) {
		    return ((value.startsWith('{') || value.startsWith('(')) &&
		        value.includes('/') &&
		        (value.endsWith('}') || value.endsWith(')')));
		};
		exports.isNavigationProperty = isNavigationProperty;
		/**
		 * Get the property from binding expression.
		 *
		 * @param expression
		 * @returns
		 */
		var getPropertyFromExpression = function (expression) {
		    var startIndex = expression.indexOf('${') + 2;
		    var endIndex = expression.indexOf('}', startIndex);
		    return expression.substring(startIndex, endIndex);
		};
		exports.getPropertyFromExpression = getPropertyFromExpression;


		/***/ }),

		/***/ "./src/helpers/FooterAction.ts":
		/*!*************************************!*\
		  !*** ./src/helpers/FooterAction.ts ***!
		  \*************************************/
		/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		exports.FooterAction = void 0;
		var QueryBuilder_1 = __webpack_require__(/*! ../helpers/QueryBuilder */ "./src/helpers/QueryBuilder.ts");
		/**
		 *
		 * Class for handling actions of the adaptive card
		 *
		 */
		var FooterAction = /** @class */ (function () {
		    /**
		     * Constructs a new instance of the FooterAction and initializes it with the given parameters.
		     *
		     * @param integrationCardManifest
		     */
		    function FooterAction(integrationCardManifest, converterOptions) {
		        /**
		         * Extracts additional context information from the integration card manifest.
		         *
		         * This function processes the adaptive footer action parameters in the integration card manifest
		         * and extracts entity set and service URL pairs, returning them as a context object.
		         *
		         * @param {CardManifest} integrationMainfestCard - The integration card manifest containing configuration parameters.
		         * @returns {Record<string, string>} - Returns a context object where the keys are entity sets and the values are service URLs.
		         * @public
		         */
		        this.getAdditionalContext = function (integrationMainfestCard) {
		            var _a;
		            var context = {};
		            var configParams = (_a = integrationMainfestCard["sap.card"].configuration) === null || _a === void 0 ? void 0 : _a.parameters;
		            var adaptiveFooterActionParameters = (configParams === null || configParams === void 0 ? void 0 : configParams._adaptiveFooterActionParameters) || {};
		            var actionParameterKeys = Object.keys(adaptiveFooterActionParameters);
		            actionParameterKeys.forEach(function (actionParameterKey) {
		                var _a;
		                var actionInfo = adaptiveFooterActionParameters[actionParameterKey];
		                (_a = actionInfo.actionParameters) === null || _a === void 0 ? void 0 : _a.forEach(function (actionParameter) {
		                    var actionParameterConfig = actionParameter.configuration;
		                    var actionParameterEntitySet = actionParameterConfig === null || actionParameterConfig === void 0 ? void 0 : actionParameterConfig.entitySet;
		                    var actionParameterServiceUrl = actionParameterConfig === null || actionParameterConfig === void 0 ? void 0 : actionParameterConfig.serviceUrl;
		                    if (actionParameterEntitySet && actionParameterServiceUrl) {
		                        context[actionParameterEntitySet] = actionParameterServiceUrl;
		                    }
		                });
		            });
		            return context;
		        };
		        this.integrationCardManifest = integrationCardManifest;
		        this.converterOptions = converterOptions;
		    }
		    /**
		     * Method to check if action exists
		     *
		     * @returns boolean
		     * @public
		     */
		    FooterAction.prototype.actionExists = function () {
		        var _a, _b;
		        var cardConfiguration = (_b = (_a = this.integrationCardManifest) === null || _a === void 0 ? void 0 : _a['sap.card']) === null || _b === void 0 ? void 0 : _b.configuration;
		        var configParams = cardConfiguration === null || cardConfiguration === void 0 ? void 0 : cardConfiguration.parameters;
		        var adaptiveFooterActionParams = configParams === null || configParams === void 0 ? void 0 : configParams._adaptiveFooterActionParameters;
		        return !!adaptiveFooterActionParams;
		    };
		    /**
		     * Method to get the card actions :
		     * In case if action parametes are present, it will return the show card action
		     * otherwise it will return the execute action
		     *
		     * @returns AdaptiveCardObject
		     * @public
		     */
		    FooterAction.prototype.getActions = function () {
		        var _this = this;
		        var _a, _b;
		        var actionSet = {
		            type: 'ActionSet',
		            actions: []
		        };
		        var cardConfiguration = (_b = (_a = this.integrationCardManifest) === null || _a === void 0 ? void 0 : _a['sap.card']) === null || _b === void 0 ? void 0 : _b.configuration;
		        var configParams = cardConfiguration === null || cardConfiguration === void 0 ? void 0 : cardConfiguration.parameters;
		        var adaptiveFooterActionParams = configParams === null || configParams === void 0 ? void 0 : configParams._adaptiveFooterActionParameters;
		        if (adaptiveFooterActionParams) {
		            var actionParameterKeys = Object.keys(adaptiveFooterActionParams);
		            actionParameterKeys.forEach(function (actionParameterKey) {
		                var _a;
		                var adaptiveCardParameter = adaptiveFooterActionParams[actionParameterKey];
		                var cardAction;
		                if ((_a = adaptiveCardParameter.actionParameters) === null || _a === void 0 ? void 0 : _a.length) {
		                    cardAction = _this.getShowCardAction(adaptiveCardParameter);
		                }
		                else {
		                    cardAction = _this.getExecuteAction(adaptiveCardParameter);
		                }
		                actionSet.actions.push(cardAction);
		            });
		        }
		        if (actionSet.actions.length) {
		            return actionSet;
		        }
		    };
		    /**
		     * Generates the parameters for the ShowCard action in an adaptive card.
		     *
		     * This function processes the action parameters from the given adaptive card parameter
		     * and constructs the corresponding input elements for the ShowCard action.
		     *
		     * @param {AdaptiveCardAction} adaptiveCardParameter - The adaptive card parameter containing action parameters.
		     * @returns {ShowCardActionParam[]} - Returns an array of ShowCard action parameters.
		     * @private
		     */
		    FooterAction.prototype.getShowCardActionParameters = function (adaptiveCardParameter) {
		        var _a;
		        var actionParameters = [];
		        (_a = adaptiveCardParameter === null || adaptiveCardParameter === void 0 ? void 0 : adaptiveCardParameter.actionParameters) === null || _a === void 0 ? void 0 : _a.forEach(function (actionParameter) {
		            var _a, _b, _c, _d, _e, _f, _g;
		            var actionParameterEntitySet = (_b = (_a = actionParameter === null || actionParameter === void 0 ? void 0 : actionParameter.configuration) === null || _a === void 0 ? void 0 : _a.entitySet) !== null && _b !== void 0 ? _b : '';
		            if (actionParameterEntitySet) {
		                actionParameters.push({
		                    type: 'Input.ChoiceSet',
		                    id: actionParameter.id,
		                    label: actionParameter.label,
		                    isRequired: (_c = actionParameter === null || actionParameter === void 0 ? void 0 : actionParameter.isRequired) !== null && _c !== void 0 ? _c : false,
		                    errorMessage: (_d = actionParameter === null || actionParameter === void 0 ? void 0 : actionParameter.errorMessage) !== null && _d !== void 0 ? _d : "",
		                    placeholder: (_e = actionParameter === null || actionParameter === void 0 ? void 0 : actionParameter.placeholder) !== null && _e !== void 0 ? _e : "",
		                    isMultiline: false,
		                    choices: [
		                        {
		                            $data: "${".concat(actionParameterEntitySet, "}"),
		                            title: (_f = actionParameter === null || actionParameter === void 0 ? void 0 : actionParameter.configuration) === null || _f === void 0 ? void 0 : _f.value,
		                            value: (_g = actionParameter === null || actionParameter === void 0 ? void 0 : actionParameter.configuration) === null || _g === void 0 ? void 0 : _g.title
		                        }
		                    ]
		                });
		            }
		            else {
		                actionParameters.push({
		                    type: 'Input.Text',
		                    id: actionParameter.id,
		                    label: actionParameter.label,
		                    isRequired: (actionParameter === null || actionParameter === void 0 ? void 0 : actionParameter.isRequired) || false,
		                    isMultiline: false
		                });
		            }
		        });
		        return actionParameters;
		    };
		    /**
		     * Method to get the show card action for adaptive card
		     *
		     * @param adaptiveCardParameter
		     * @returns ShowCardAction
		     * @private
		     */
		    FooterAction.prototype.getShowCardAction = function (adaptiveCardParameter) {
		        var enabledPath = adaptiveCardParameter.enablePath.split('/').join('.');
		        var showCardAction = {
		            type: 'Action.ShowCard',
		            card: {
		                type: 'AdaptiveCard',
		                body: [],
		                actions: []
		            },
		            style: adaptiveCardParameter.style || 'default',
		            title: adaptiveCardParameter.label,
		            isEnabled: enabledPath ? '${' + enabledPath + '}' : 'true',
		            $when: enabledPath ? '${' + enabledPath + ' ? true : false}' : 'true'
		        };
		        showCardAction.card.body = this.getShowCardActionParameters(adaptiveCardParameter);
		        adaptiveCardParameter.data.contextURL = this.getContextUrl();
		        showCardAction.card.actions.push({
		            type: 'Action.Execute',
		            title: 'OK',
		            verb: adaptiveCardParameter.verb,
		            data: adaptiveCardParameter.data,
		            style: 'positive'
		        });
		        return showCardAction;
		    };
		    /**
		     * Extracts the base URL (without query parameters) from the web URL generated by the integration card manifest and converter options.
		     *
		     * @returns {string} - Returns the base URL without query parameters, or an empty string if the URL is invalid.
		     * @private
		     */
		    FooterAction.prototype.getContextUrl = function () {
		        var webUrl = (0, QueryBuilder_1.getWebUrl)(this.integrationCardManifest, this.converterOptions);
		        var queryIndex = webUrl === null || webUrl === void 0 ? void 0 : webUrl.indexOf('?');
		        var contextUrl = queryIndex !== -1 ? webUrl === null || webUrl === void 0 ? void 0 : webUrl.substring(0, queryIndex) : webUrl;
		        return contextUrl ? contextUrl : '';
		    };
		    /**
		     * Method to get the execute action for adaptive card
		     *
		     * @param adaptiveCardParameter
		     * @returns AdaptiveCardAction
		     * @private
		     */
		    FooterAction.prototype.getExecuteAction = function (adaptiveCardParameter) {
		        var enabledPath = adaptiveCardParameter.enablePath.split('/').join('.');
		        adaptiveCardParameter.data.contextURL = this.getContextUrl();
		        return {
		            type: 'Action.Execute',
		            title: adaptiveCardParameter.label,
		            verb: adaptiveCardParameter.verb,
		            data: adaptiveCardParameter.data,
		            isEnabled: enabledPath ? '${' + enabledPath + '}' : 'true',
		            style: adaptiveCardParameter.style || 'default',
		            $when: enabledPath ? '${' + enabledPath + ' ? true : false}' : 'true'
		        };
		    };
		    return FooterAction;
		}());
		exports.FooterAction = FooterAction;


		/***/ }),

		/***/ "./src/helpers/QueryBuilder.ts":
		/*!*************************************!*\
		  !*** ./src/helpers/QueryBuilder.ts ***!
		  \*************************************/
		/***/ ((__unused_webpack_module, exports) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		exports.getWebUrl = exports.getContextAsUrl = exports.updateExpandQuery = exports.updateSelectQuery = exports.getSeparatedProperties = void 0;
		/**
		 * Function to form the select query parameters for the adaptive card content url
		 *
		 * @param cardManifest
		 * @returns
		 */
		var getSelectQueryParams = function (cardManifest) {
		    var _a, _b, _c;
		    var configParameters = (_a = cardManifest['sap.card'].configuration) === null || _a === void 0 ? void 0 : _a.parameters;
		    if (configParameters) {
		        var headerSelectQuery = (_b = configParameters === null || configParameters === void 0 ? void 0 : configParameters._headerSelectQuery) === null || _b === void 0 ? void 0 : _b.value.replace('$select=', '');
		        var contentSelectQuery = (_c = configParameters === null || configParameters === void 0 ? void 0 : configParameters._contentSelectQuery) === null || _c === void 0 ? void 0 : _c.value.replace('$select=', '');
		        var headerSelectQueryParams = headerSelectQuery ? headerSelectQuery.split(',') : [];
		        var contentSelectQueryParams = contentSelectQuery ? contentSelectQuery.split(',') : [];
		        if (headerSelectQueryParams.length || contentSelectQueryParams.length) {
		            var mergedSelectQueryParams = headerSelectQueryParams.concat(contentSelectQueryParams);
		            var selectQueryParams = Array.from(new Set(mergedSelectQueryParams));
		            return selectQueryParams.length ? '$select=' + selectQueryParams.join(',') : '';
		        }
		    }
		};
		/**
		 * Get the separated properties from the expand query parameters as select properties and normal properties
		 *
		 * @param expandQueryParams
		 * @returns
		 */
		var getSeparatedProperties = function (expandQueryParams) {
		    var stack = [];
		    var navigationPropertiesWithSelect = [];
		    var selectProperties = [];
		    var navigationProperties = [];
		    expandQueryParams.forEach(function (expandQueryParam) {
		        var hasOpeningBracket = expandQueryParam.indexOf('(') > -1;
		        var hasClosingBracket = expandQueryParam.indexOf(')') > -1;
		        if (hasOpeningBracket && hasClosingBracket) {
		            navigationPropertiesWithSelect.push(expandQueryParam);
		        }
		        else if (hasOpeningBracket && !hasClosingBracket) {
		            selectProperties = [];
		            stack.push('(');
		            selectProperties.push(expandQueryParam);
		        }
		        else if (hasClosingBracket) {
		            selectProperties.push(expandQueryParam);
		            stack.pop();
		            if (stack.length === 0) {
		                navigationPropertiesWithSelect.push(selectProperties.join(','));
		            }
		        }
		        else if (stack.length !== 0) {
		            selectProperties.push(expandQueryParam);
		        }
		        else {
		            navigationProperties.push(expandQueryParam);
		        }
		    });
		    return {
		        navigationPropertiesWithSelect: navigationPropertiesWithSelect,
		        navigationProperties: navigationProperties
		    };
		};
		exports.getSeparatedProperties = getSeparatedProperties;
		/**
		 * Formats the expand query parameters with select properties
		 *
		 * @param expandQueryParams
		 * @returns
		 */
		var getFormattedExpandQuery = function (expandQueryParams) {
		    var _a = (0, exports.getSeparatedProperties)(expandQueryParams), navigationPropertiesWithSelect = _a.navigationPropertiesWithSelect, navigationProperties = _a.navigationProperties;
		    var properties = new Map();
		    navigationPropertiesWithSelect.forEach(function (property) {
		        var navigationProperty = property.substring(0, property.indexOf('('));
		        property = property.replace(navigationProperty, '').replace('($select=', '').replace(')', '');
		        var existingProperties = properties.get(navigationProperty) || [];
		        if (existingProperties.length === 0) {
		            properties.set(navigationProperty, property.split(','));
		        }
		        else {
		            var propertiesToAdd = property.split(',');
		            propertiesToAdd.forEach(function (prop) {
		                if (!existingProperties.includes(prop)) {
		                    existingProperties.push(prop);
		                }
		            });
		            properties.set(navigationProperty, existingProperties);
		        }
		    });
		    navigationProperties.forEach(function (property) {
		        properties.set(property, []);
		    });
		    return formatExpandQuery(properties);
		};
		/**
		 * Function to form the expand query parameters for the adaptive card content url
		 *
		 * @param cardManifest
		 * @returns The selected expand query parameters
		 */
		var getExpandQueryParams = function (cardManifest) {
		    var _a, _b, _c, _d, _e, _f, _g;
		    var configParameters = (_a = cardManifest['sap.card'].configuration) === null || _a === void 0 ? void 0 : _a.parameters;
		    if (!configParameters) {
		        return '';
		    }
		    var headerExpandQuery = (_b = configParameters === null || configParameters === void 0 ? void 0 : configParameters._headerExpandQuery) === null || _b === void 0 ? void 0 : _b.value.replace('$expand=', '');
		    var contentExpandQuery = (_c = configParameters === null || configParameters === void 0 ? void 0 : configParameters._contentExpandQuery) === null || _c === void 0 ? void 0 : _c.value.replace('$expand=', '');
		    var headerExpandQueryParams = headerExpandQuery ? headerExpandQuery.split(',') : [];
		    var contentExpandQueryParams = contentExpandQuery ? contentExpandQuery.split(',') : [];
		    if (headerExpandQueryParams.length || contentExpandQueryParams.length) {
		        var firstQueryParamContent = contentExpandQueryParams === null || contentExpandQueryParams === void 0 ? void 0 : contentExpandQueryParams[0];
		        var operatorContent = (firstQueryParamContent === null || firstQueryParamContent === void 0 ? void 0 : firstQueryParamContent.indexOf('?')) > -1 ? '?' : '&';
		        headerExpandQueryParams[0] = (_e = (_d = headerExpandQueryParams === null || headerExpandQueryParams === void 0 ? void 0 : headerExpandQueryParams[0]) === null || _d === void 0 ? void 0 : _d.replace(operatorContent, '')) !== null && _e !== void 0 ? _e : '';
		        contentExpandQueryParams[0] = (_g = (_f = contentExpandQueryParams === null || contentExpandQueryParams === void 0 ? void 0 : contentExpandQueryParams[0]) === null || _f === void 0 ? void 0 : _f.replace(operatorContent, '')) !== null && _g !== void 0 ? _g : '';
		        headerExpandQueryParams = headerExpandQueryParams.filter(function (param) { return param !== ''; });
		        contentExpandQueryParams = contentExpandQueryParams.filter(function (param) { return param !== ''; });
		        var mergedExpandQueryParams = headerExpandQueryParams.concat(contentExpandQueryParams);
		        var expandQueryParams = Array.from(new Set(mergedExpandQueryParams));
		        if ((headerExpandQuery === null || headerExpandQuery === void 0 ? void 0 : headerExpandQuery.indexOf('$select')) > -1 || (contentExpandQuery === null || contentExpandQuery === void 0 ? void 0 : contentExpandQuery.indexOf('$select')) > -1) {
		            var expandQuery = getFormattedExpandQuery(expandQueryParams);
		            return expandQuery ? "".concat(operatorContent, "$expand=") + expandQuery : '';
		        }
		        return expandQueryParams.length ? "".concat(operatorContent, "$expand=") + expandQueryParams.join(',') : '';
		    }
		    return '';
		};
		/**
		 * Formats the expand query from the expand query parameters
		 *
		 * @param mapProperties
		 * @returns
		 */
		var formatExpandQuery = function (mapProperties) {
		    var formattedExpandQuery = '';
		    mapProperties.forEach(function (value, key) {
		        if (value.length === 0) {
		            formattedExpandQuery += key + ',';
		        }
		        else {
		            formattedExpandQuery += key + '($select=' + value.join(',') + '),';
		        }
		    });
		    return formattedExpandQuery.substring(0, formattedExpandQuery.length - 1);
		};
		/**
		 * Updates the select query in the content url
		 *
		 * @param contentUrl
		 * @param integrationCardManifest
		 * @returns
		 */
		var updateSelectQuery = function (contentUrl, integrationCardManifest) {
		    if (!contentUrl.includes('?{{parameters._contentSelectQuery}}')) {
		        contentUrl += '?{{parameters._contentSelectQuery}}';
		    }
		    var selectQueryParams = getSelectQueryParams(integrationCardManifest) || '';
		    return selectQueryParams
		        ? contentUrl.replace('{{parameters._contentSelectQuery}}', selectQueryParams)
		        : contentUrl.replace('?{{parameters._contentSelectQuery}}', '');
		};
		exports.updateSelectQuery = updateSelectQuery;
		/**
		 * Updates the expand query in the content url
		 *
		 * @param contentUrl
		 * @param integrationCardManifest
		 * @returns
		 */
		var updateExpandQuery = function (contentUrl, integrationCardManifest) {
		    if (contentUrl.indexOf('{{parameters._contentExpandQuery}}') === -1) {
		        contentUrl += '{{parameters._contentExpandQuery}}';
		    }
		    var expandQueryParams = getExpandQueryParams(integrationCardManifest) || '';
		    if (!expandQueryParams) {
		        return contentUrl.replace('{{parameters._contentExpandQuery}}', '');
		    }
		    return contentUrl.replace('{{parameters._contentExpandQuery}}', expandQueryParams);
		};
		exports.updateExpandQuery = updateExpandQuery;
		/**
		 * Updates the request url with the origin and content url
		 *
		 * @param requestUrl
		 * @param origin
		 * @param contentUrl
		 * @returns
		 */
		var updateRequestUrl = function (requestUrl, origin, contentUrl) {
		    requestUrl = requestUrl === null || requestUrl === void 0 ? void 0 : requestUrl.replace('{{destinations.service}}', origin);
		    requestUrl = requestUrl === null || requestUrl === void 0 ? void 0 : requestUrl.replace('$batch', contentUrl);
		    return requestUrl;
		};
		/**
		 * Get the object context as url
		 *
		 * @param context
		 * @returns
		 */
		var getContextAsUrl = function (context) {
		    return Object.keys(context)
		        .map(function (key) { return "".concat(key, "=").concat(context[key]); })
		        .join(',');
		};
		exports.getContextAsUrl = getContextAsUrl;
		/**
		 * Get the web url for the adaptive card
		 *
		 * @param integrationCardManifest
		 * @param options
		 * @returns
		 */
		var getWebUrl = function (integrationCardManifest, options) {
		    var _a, _b, _c, _d;
		    var _e = integrationCardManifest['sap.card'], data = _e.data, configuration = _e.configuration;
		    var configParameters = configuration.parameters;
		    var parametersValueMap = {
		        '{{parameters.contextParameters}}': (0, exports.getContextAsUrl)(options.context)
		    };
		    Object.keys(configParameters).forEach(function (key) {
		        if (configParameters[key]) {
		            parametersValueMap["{{parameters.".concat(key, "}}")] = configParameters[key].value || options.context[key];
		        }
		    });
		    var batchInfo = (_a = data === null || data === void 0 ? void 0 : data.request) === null || _a === void 0 ? void 0 : _a.batch;
		    var contentUrl = ((_b = batchInfo === null || batchInfo === void 0 ? void 0 : batchInfo.content) === null || _b === void 0 ? void 0 : _b.url) || ((_c = batchInfo === null || batchInfo === void 0 ? void 0 : batchInfo.response) === null || _c === void 0 ? void 0 : _c.url) || '';
		    contentUrl = (0, exports.updateSelectQuery)(contentUrl, integrationCardManifest);
		    contentUrl = (0, exports.updateExpandQuery)(contentUrl, integrationCardManifest);
		    Object.keys(parametersValueMap).forEach(function (key) {
		        contentUrl = contentUrl.replace(key, parametersValueMap[key] + "");
		    });
		    return updateRequestUrl((_d = data === null || data === void 0 ? void 0 : data.request) === null || _d === void 0 ? void 0 : _d.url, options.serviceUrl, contentUrl);
		};
		exports.getWebUrl = getWebUrl;


		/***/ }),

		/***/ "./src/templates/base/AdaptiveBaseTemplate.ts":
		/*!****************************************************!*\
		  !*** ./src/templates/base/AdaptiveBaseTemplate.ts ***!
		  \****************************************************/
		/***/ ((__unused_webpack_module, exports) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		exports["default"] = {
		    type: 'AdaptiveCard',
		    $schema: 'https://adaptivecards.io/schemas/adaptive-card.json',
		    version: '1.6',
		    msteams: { "width": "full" },
		    body: [],
		    metadata: {}
		};


		/***/ }),

		/***/ "./src/templates/base/AdaptiveHeaderTemplate.ts":
		/*!******************************************************!*\
		  !*** ./src/templates/base/AdaptiveHeaderTemplate.ts ***!
		  \******************************************************/
		/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		var constants_1 = __webpack_require__(/*! ../constants */ "./src/templates/constants.ts");
		exports["default"] = {
		    'objectCardHeader': [
		        {
		            type: 'TextBlock',
		            wrap: false,
		            weight: constants_1.Weight.Bolder,
		            size: constants_1.FontSize.Default,
		            maxLines: 1,
		            spacing: constants_1.Spacing.None,
		            color: 'Default',
		            _internal: {
		                properties: [
		                    {
		                        valueField: 'text',
		                        value: 'header.title'
		                    }
		                ]
		            }
		        },
		        {
		            type: 'ColumnSet',
		            spacing: constants_1.Spacing.None,
		            columns: [
		                {
		                    type: 'Column',
		                    width: 'auto',
		                    items: [
		                        {
		                            type: 'TextBlock',
		                            wrap: false,
		                            isSubtle: true,
		                            size: constants_1.FontSize.Default,
		                            weight: constants_1.Weight.Default,
		                            maxLines: 1,
		                            spacing: constants_1.Spacing.None,
		                            color: 'Default',
		                            _internal: {
		                                properties: [
		                                    {
		                                        valueField: 'text',
		                                        value: 'header.subTitle'
		                                    },
		                                    {
		                                        valueField: '$when',
		                                        value: '${ (header.subTitle) ? true: false}',
		                                        type: 'Expression'
		                                    }
		                                ]
		                            }
		                        }
		                    ]
		                },
		                {
		                    type: 'Column',
		                    width: 'auto',
		                    items: [
		                        {
		                            type: 'TextBlock',
		                            text: '|',
		                            wrap: false,
		                            spacing: constants_1.Spacing.None,
		                            isSubtle: true,
		                            size: constants_1.FontSize.Default,
		                            weight: constants_1.Weight.Default,
		                            maxLines: 1,
		                            color: 'Default',
		                            horizontalAlignment: 'Center',
		                            _internal: {
		                                properties: [
		                                    {
		                                        valueField: '$when',
		                                        value: '${ (header.subTitle && header.unitOfMeasurement) ? true: false}',
		                                        type: 'Expression'
		                                    }
		                                ]
		                            }
		                        }
		                    ]
		                },
		                {
		                    type: 'Column',
		                    width: 'auto',
		                    items: [
		                        {
		                            type: 'TextBlock',
		                            wrap: false,
		                            isSubtle: true,
		                            size: constants_1.FontSize.Default,
		                            weight: constants_1.Weight.Default,
		                            maxLines: 1,
		                            spacing: constants_1.Spacing.None,
		                            color: 'Default',
		                            _internal: {
		                                properties: [
		                                    {
		                                        valueField: 'text',
		                                        value: 'header.unitOfMeasurement'
		                                    },
		                                    {
		                                        valueField: '$when',
		                                        value: '${ (header.unitOfMeasurement) ? true: false}',
		                                        type: 'Expression'
		                                    }
		                                ]
		                            }
		                        }
		                    ]
		                }
		            ]
		        },
		        {
		            type: 'TextBlock',
		            wrap: false,
		            size: constants_1.FontSize.ExtraLarge,
		            weight: constants_1.Weight.Default,
		            maxLines: 1,
		            spacing: constants_1.Spacing.None,
		            _internal: {
		                properties: [
		                    {
		                        valueField: 'text',
		                        value: 'header.mainIndicator.number'
		                    },
		                    {
		                        valueField: 'color',
		                        value: 'header.mainIndicator.state',
		                        formatter: 'STATE-COLOR'
		                    }
		                ]
		            }
		        }
		    ],
		    'tableCardHeader': [
		        {
		            type: 'TextBlock',
		            wrap: true,
		            weight: constants_1.Weight.Bolder,
		            _internal: {
		                properties: [
		                    {
		                        valueField: 'text',
		                        value: 'header.title'
		                    }
		                ]
		            }
		        },
		        {
		            type: 'TextBlock',
		            wrap: true,
		            _internal: {
		                properties: [
		                    {
		                        valueField: 'text',
		                        value: 'header.status.text'
		                    }
		                ]
		            }
		        },
		        {
		            type: 'TextBlock',
		            wrap: true,
		            isSubtle: true,
		            _internal: {
		                properties: [
		                    {
		                        valueField: 'text',
		                        value: 'header.subTitle'
		                    },
		                    {
		                        valueField: '$when',
		                        value: '${ (header.subTitle) ? true: false}',
		                        type: 'Expression'
		                    }
		                ]
		            }
		        }
		    ]
		};


		/***/ }),

		/***/ "./src/templates/constants.ts":
		/*!************************************!*\
		  !*** ./src/templates/constants.ts ***!
		  \************************************/
		/***/ ((__unused_webpack_module, exports) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		exports.FontSize = exports.Weight = exports.Spacing = void 0;
		var Spacing;
		(function (Spacing) {
		    Spacing["None"] = "none";
		    Spacing["Small"] = "small";
		    Spacing["Default"] = "default";
		    Spacing["Medium"] = "medium";
		    Spacing["Large"] = "large";
		    Spacing["ExtraLarge"] = "extraLarge";
		    Spacing["Padding"] = "padding";
		})(Spacing || (exports.Spacing = Spacing = {}));
		var Weight;
		(function (Weight) {
		    Weight["Lighter"] = "lighter";
		    Weight["Default"] = "default";
		    Weight["Bolder"] = "bolder";
		})(Weight || (exports.Weight = Weight = {}));
		var FontSize;
		(function (FontSize) {
		    FontSize["Small"] = "small";
		    FontSize["Default"] = "default";
		    FontSize["Medium"] = "medium";
		    FontSize["Large"] = "large";
		    FontSize["ExtraLarge"] = "extraLarge";
		})(FontSize || (exports.FontSize = FontSize = {}));


		/***/ }),

		/***/ "./src/templates/index.ts":
		/*!********************************!*\
		  !*** ./src/templates/index.ts ***!
		  \********************************/
		/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


		var __importDefault = (this && this.__importDefault) || function (mod) {
		    return (mod && mod.__esModule) ? mod : { "default": mod };
		};
		Object.defineProperty(exports, "__esModule", ({ value: true }));
		exports.AdaptiveCardTemplates = void 0;
		var AdaptiveGroupPropertyTemplate_1 = __importDefault(__webpack_require__(/*! ./object/AdaptiveGroupPropertyTemplate */ "./src/templates/object/AdaptiveGroupPropertyTemplate.ts"));
		var AdaptiveGroupTemplate_1 = __importDefault(__webpack_require__(/*! ./object/AdaptiveGroupTemplate */ "./src/templates/object/AdaptiveGroupTemplate.ts"));
		var AdaptiveHeaderTemplate_1 = __importDefault(__webpack_require__(/*! ./base/AdaptiveHeaderTemplate */ "./src/templates/base/AdaptiveHeaderTemplate.ts"));
		var AdaptiveObjectCardTemplate_1 = __importDefault(__webpack_require__(/*! ./object/AdaptiveObjectCardTemplate */ "./src/templates/object/AdaptiveObjectCardTemplate.ts"));
		var AdaptiveTableTemplate_1 = __importDefault(__webpack_require__(/*! ./table/AdaptiveTableTemplate */ "./src/templates/table/AdaptiveTableTemplate.ts"));
		var AdaptiveBaseTemplate_1 = __importDefault(__webpack_require__(/*! ./base/AdaptiveBaseTemplate */ "./src/templates/base/AdaptiveBaseTemplate.ts"));
		exports.AdaptiveCardTemplates = {
		    adaptiveBase: AdaptiveBaseTemplate_1.default,
		    adaptiveHeader: AdaptiveHeaderTemplate_1.default,
		    adaptiveObjectCard: AdaptiveObjectCardTemplate_1.default,
		    adaptiveGroup: AdaptiveGroupTemplate_1.default,
		    adaptiveGroupProperty: AdaptiveGroupPropertyTemplate_1.default,
		    AdaptiveTable: AdaptiveTableTemplate_1.default
		};


		/***/ }),

		/***/ "./src/templates/object/AdaptiveGroupPropertyTemplate.ts":
		/*!***************************************************************!*\
		  !*** ./src/templates/object/AdaptiveGroupPropertyTemplate.ts ***!
		  \***************************************************************/
		/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		var constants_1 = __webpack_require__(/*! ../constants */ "./src/templates/constants.ts");
		exports["default"] = {
		    type: 'Column',
		    width: 'stretch',
		    items: [
		        {
		            type: 'TextBlock',
		            wrap: false,
		            isSubtle: true,
		            maxLines: 1,
		            size: constants_1.FontSize.Small,
		            weight: constants_1.Weight.Default,
		            spacing: constants_1.Spacing.Default,
		            color: 'Default',
		            _internal: {
		                properties: [
		                    {
		                        valueField: 'text',
		                        value: 'content.groups[].items[].label'
		                    }
		                ]
		            }
		        },
		        {
		            type: 'TextBlock',
		            wrap: true,
		            maxLines: 2,
		            size: constants_1.FontSize.Small,
		            weight: constants_1.Weight.Default,
		            spacing: constants_1.Spacing.None,
		            color: 'Default',
		            _internal: {
		                properties: [
		                    {
		                        valueField: 'text',
		                        value: 'content.groups[].items[].value'
		                    },
		                    {
		                        valueField: 'color',
		                        value: 'content.groups[].items[].state',
		                        formatter: 'STATE-COLOR'
		                    }
		                ]
		            }
		        },
		        {
		            type: 'TextBlock',
		            _internal: {
		                properties: [
		                    {
		                        valueField: 'text',
		                        value: 'content.groups[].items[].value'
		                    }
		                ]
		            },
		            isVisible: false
		        }
		    ]
		};


		/***/ }),

		/***/ "./src/templates/object/AdaptiveGroupTemplate.ts":
		/*!*******************************************************!*\
		  !*** ./src/templates/object/AdaptiveGroupTemplate.ts ***!
		  \*******************************************************/
		/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		var constants_1 = __webpack_require__(/*! ../constants */ "./src/templates/constants.ts");
		exports["default"] = {
		    type: 'Container',
		    spacing: constants_1.Spacing.Medium,
		    items: [
		        {
		            type: 'TextBlock',
		            wrap: true,
		            weight: constants_1.Weight.Bolder,
		            size: constants_1.FontSize.Small,
		            maxLines: 2,
		            spacing: constants_1.Spacing.Medium,
		            color: 'Default',
		            _internal: {
		                properties: [
		                    {
		                        valueField: 'text',
		                        value: 'content.groups[].title'
		                    }
		                ]
		            }
		        },
		        {
		            type: 'Container',
		            spacing: constants_1.Spacing.Small,
		            items: [
		                {
		                    type: 'ColumnSet',
		                    columns: [
		                        {
		                            _internal: {
		                                template: 'adaptiveGroupProperty'
		                            }
		                        }
		                    ],
		                    _internal: {
		                        repeat: {
		                            propertyName: 'columns',
		                            source: 'content.groups[].items'
		                        }
		                    }
		                }
		            ]
		        }
		    ]
		};


		/***/ }),

		/***/ "./src/templates/object/AdaptiveObjectCardTemplate.ts":
		/*!************************************************************!*\
		  !*** ./src/templates/object/AdaptiveObjectCardTemplate.ts ***!
		  \************************************************************/
		/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		var constants_1 = __webpack_require__(/*! ../constants */ "./src/templates/constants.ts");
		exports["default"] = [
		    {
		        type: 'Container',
		        spacing: constants_1.Spacing.Large,
		        items: [
		            {
		                _internal: {
		                    'template': 'adaptiveGroup'
		                }
		            }
		        ],
		        _internal: {
		            'repeat': {
		                'propertyName': 'items',
		                'source': 'content.groups'
		            }
		        }
		    }
		];


		/***/ }),

		/***/ "./src/templates/table/AdaptiveTableTemplate.ts":
		/*!******************************************************!*\
		  !*** ./src/templates/table/AdaptiveTableTemplate.ts ***!
		  \******************************************************/
		/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		var constants_1 = __webpack_require__(/*! ../constants */ "./src/templates/constants.ts");
		exports["default"] = [
		    {
		        type: "Table",
		        gridStyle: "default",
		        verticalCellContentAlignment: "Center",
		        firstRowAsHeaders: true,
		        showGridLines: true,
		        columns: [
		            {
		                width: 1
		            },
		            {
		                width: 1
		            },
		            {
		                width: 1
		            }
		        ],
		        rows: [
		            {
		                type: "TableRow",
		                separator: true,
		                cells: [
		                    {
		                        type: "TableCell",
		                        items: [
		                            {
		                                type: "TextBlock",
		                                wrap: true,
		                                weight: constants_1.Weight.Bolder,
		                                horizontalAlignment: "content.row.columns[].hAlign",
		                                _internal: {
		                                    properties: [
		                                        {
		                                            valueField: "text",
		                                            value: "content.row.columns[].title"
		                                        },
		                                        {
		                                            valueField: "$when",
		                                            value: "content.row.columns[].visible"
		                                        }
		                                    ]
		                                }
		                            }
		                        ]
		                    }
		                ],
		                _internal: {
		                    repeat: {
		                        propertyName: "cells",
		                        source: "content.row.columns"
		                    }
		                }
		            },
		            {
		                type: "TableRow",
		                $data: "content.data.path",
		                cells: [
		                    {
		                        type: "TableCell",
		                        items: [
		                            {
		                                type: "TextBlock",
		                                wrap: true,
		                                horizontalAlignment: "content.row.columns[].hAlign",
		                                _internal: {
		                                    properties: [
		                                        {
		                                            valueField: "text",
		                                            value: "content.row.columns[].value"
		                                        },
		                                        {
		                                            valueField: "$when",
		                                            value: "content.row.columns[].visible"
		                                        }
		                                    ]
		                                }
		                            }
		                        ]
		                    }
		                ],
		                _internal: {
		                    repeat: {
		                        propertyName: "cells",
		                        source: "content.row.columns"
		                    }
		                }
		            }
		        ]
		    }
		];


		/***/ }),

		/***/ "./src/types/CommonTypes.ts":
		/*!**********************************!*\
		  !*** ./src/types/CommonTypes.ts ***!
		  \**********************************/
		/***/ ((__unused_webpack_module, exports) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		exports.CARD_TYPES = void 0;
		var CARD_TYPES;
		(function (CARD_TYPES) {
		    CARD_TYPES["Object"] = "Object";
		    CARD_TYPES["Table"] = "Table";
		    CARD_TYPES["List"] = "List";
		})(CARD_TYPES || (exports.CARD_TYPES = CARD_TYPES = {}));


		/***/ }),

		/***/ "./src/utils/CommonUtils.ts":
		/*!**********************************!*\
		  !*** ./src/utils/CommonUtils.ts ***!
		  \**********************************/
		/***/ ((__unused_webpack_module, exports) => {


		Object.defineProperty(exports, "__esModule", ({ value: true }));
		exports.getDescendantPropertyValue = void 0;
		/**
		 * Gets the value of a property path from integration card manifest object
		 *
		 * @param sourceObject
		 * @param path
		 * @param position
		 * @returns
		 */
		var getDescendantPropertyValue = function (sourceObject, path, position) {
		    if (!sourceObject || !path) {
		        return;
		    }
		    var aProperties = path.split('.');
		    try {
		        while (aProperties.length) {
		            var propertyName = aProperties.shift() || '';
		            var matchRegex = /\[(.*?)\]/.exec(propertyName) || [];
		            if (propertyName.endsWith('[]')) {
		                sourceObject = sourceObject[propertyName.replace('[]', '')][position || 0];
		            }
		            else if (matchRegex.length) {
		                var index = parseInt(matchRegex[1]);
		                sourceObject = sourceObject[propertyName.split('[')[0]][index];
		            }
		            else {
		                sourceObject = sourceObject[propertyName];
		            }
		        }
		        return sourceObject;
		    }
		    catch (e) {
		        // throw e;
		        return;
		    }
		};
		exports.getDescendantPropertyValue = getDescendantPropertyValue;


		/***/ })

		/******/ 	});
		/************************************************************************/
		/******/ 	// The module cache
		/******/ 	var __webpack_module_cache__ = {};
		/******/ 	
		/******/ 	// The require function
		/******/ 	function __webpack_require__(moduleId) {
		/******/ 		// Check if module is in cache
		/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
		/******/ 		if (cachedModule !== undefined) {
		/******/ 			return cachedModule.exports;
		/******/ 		}
		/******/ 		// Create a new module (and put it into the cache)
		/******/ 		var module = __webpack_module_cache__[moduleId] = {
		/******/ 			// no module.id needed
		/******/ 			// no module.loaded needed
		/******/ 			exports: {}
		/******/ 		};
		/******/ 	
		/******/ 		// Execute the module function
		/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		/******/ 	
		/******/ 		// Return the exports of the module
		/******/ 		return module.exports;
		/******/ 	}
		/******/ 	
		/************************************************************************/
		var __webpack_exports__ = {};
		// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
		(() => {
		var exports = __webpack_exports__;
		/*!**********************!*\
		  !*** ./src/index.ts ***!
		  \**********************/

		Object.defineProperty(exports, "__esModule", ({ value: true }));
		exports.convertToAdaptiveCard = void 0;
		var ObjectAdaptiveCard_1 = __webpack_require__(/*! ./converters/ObjectAdaptiveCard */ "./src/converters/ObjectAdaptiveCard.ts");
		var TableAdaptiveCard_1 = __webpack_require__(/*! ./converters/TableAdaptiveCard */ "./src/converters/TableAdaptiveCard.ts");
		var QueryBuilder_1 = __webpack_require__(/*! ./helpers/QueryBuilder */ "./src/helpers/QueryBuilder.ts");
		var CommonTypes_1 = __webpack_require__(/*! ./types/CommonTypes */ "./src/types/CommonTypes.ts");
		/**
		 * Convert integration card manifest to adaptive card manifest
		 *
		 * @param integrationCardManifest
		 * @param options
		 * @param timeOptions
		 * @returns
		 */
		var convertToAdaptiveCard = function (integrationCardManifest, options, timeOptions) {
		    var _a, _b;
		    var _c;
		    if (!validIntegrationCard(integrationCardManifest, options)) {
		        return {
		            type: 'AdaptiveCard',
		            $schema: 'https://adaptivecards.io/schemas/adaptive-card.json',
		            version: '1.6',
		            body: [],
		            metadata: {}
		        };
		    }
		    var cardType = integrationCardManifest["sap.card"].type;
		    var adaptiveCardManifest;
		    if (cardType === CommonTypes_1.CARD_TYPES.Object) {
		        var ObjectAdaptiveCardInstance = new ObjectAdaptiveCard_1.ObjectAdaptiveCard(integrationCardManifest, options, timeOptions);
		        adaptiveCardManifest = ObjectAdaptiveCardInstance.generateAdaptiveCard();
		    }
		    else if (cardType === CommonTypes_1.CARD_TYPES.Table) {
		        var TableAdaptiveAdaptiveCardInstance = new TableAdaptiveCard_1.TableAdaptiveCard(integrationCardManifest, options, timeOptions);
		        adaptiveCardManifest = TableAdaptiveAdaptiveCardInstance.generateAdaptiveCard();
		    }
		    (_a = adaptiveCardManifest.metadata) !== null && _a !== void 0 ? _a : (adaptiveCardManifest.metadata = {});
		    (_b = (_c = adaptiveCardManifest.metadata).webUrl) !== null && _b !== void 0 ? _b : (_c.webUrl = (0, QueryBuilder_1.getWebUrl)(integrationCardManifest, options));
		    return adaptiveCardManifest;
		};
		exports.convertToAdaptiveCard = convertToAdaptiveCard;
		/**
		 * Check if the integration card is valid or not :
		 * - if the integration card is not present or cardtype is not present
		 * - if the serviceUrl, appIntent, context or entitySet is not present
		 *
		 * @param integrationCardManifest  The integration card manifest.
		 * @param converterOptions The converter options for the adaptive card.
		 * @returns
		 */
		function validIntegrationCard(integrationCardManifest, converterOptions) {
		    var _a, _b, _c, _d, _e;
		    if (!integrationCardManifest || !((_a = integrationCardManifest['sap.card']) === null || _a === void 0 ? void 0 : _a.type)) {
		        return false;
		    }
		    var entitySet = (_e = (_d = (_c = (_b = integrationCardManifest['sap.card']) === null || _b === void 0 ? void 0 : _b.configuration) === null || _c === void 0 ? void 0 : _c.parameters) === null || _d === void 0 ? void 0 : _d._entitySet) === null || _e === void 0 ? void 0 : _e.value;
		    var serviceUrl = converterOptions.serviceUrl, appIntent = converterOptions.appIntent, context = converterOptions.context;
		    if (!serviceUrl || !appIntent || !context || !entitySet) {
		        return false;
		    }
		    return true;
		}

		})();

		/******/ 	return __webpack_exports__;
		/******/ })()
		;
		});
		
	} (dist));

	var distExports = dist.exports;

	Object.defineProperty(distExports, "__" + "esModule", { value: true });

	return distExports;

}));
