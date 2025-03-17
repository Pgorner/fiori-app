/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/base/Object',
"../simple/PrintUtils"
], function(BaseObject,PrintUtils) {
    'use strict';
        /**
         * Creates and initializes a print configuration class.
         * @class PrintConfig is a class that holds the configuration for the print page.
         * @extends sap.ui.base.Object
         *
         *  @param {object} printConfiguartionObject - The print configuration object can have keys as pageConfig, textConfig, marginConfig, durationConfig, exportConfig and with values as defined in below structure.
         *  <ul>
         *  pageConfig - The page configuration object with the following given keys.
         *     <li> paperSize: Possible values are "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "Letter" | "Legal" | "Tabloid" | "Custom". Select one of the provided values as the paper size of the print page. Default value is "A4". </li>
         *     <li> unit: Possible values are "mm" | "cm" | "in". Select one of the provided values as the unit for paper and margin measurements. Default value is "mm" for all paper size except "Letter", "Legal", "Tabloid" where default value is "in". </li>
         *     <li> paperHeight: It must be a number, and it must be the unit specified within the page configuration. It is considered only when paper size is "Custom". If paper size is not provided, then the default value is height of the "A4" paper size. </li>
         *     <li> paperWidth: It must be a number, and it must be the unit specified within the page configuration. It is considered only when the paper size is "Custom". If paper size is not provided, then "A4" is the default width. </li>
         *     <li> portrait: It must be a boolean value as it is the orientation of the page. Default value is true. </li>
         *     <li> showPageNumber: It must be a boolean value. It decides if the page number is to be displayed. Default value is false. Not applicable in single page API. </li>
         *  </ul>
         *  <ul>
         *  textConfig - The text configuration with the following given keys.
         *     <li> showHeaderText: It must be a boolean value. It is a flag to decide whether to show the header text or not in the print page. Default value is false. </li>
         *     <li> showFooterText: It must be a boolean value. It is a flag to decide whether to show the footer text or not in the print page. Default value is false. </li>
         *     <li>  headerText: It must be a string value to display header text in the print page. Default value is empty string. </li>
         *     <li> footerText: It must be a string value to display footer text in the print page. Default value is empty string. </li>
         *  </ul>
         *  <ul>
         *  marginConfig - The margin configuration object with the following given keys.
         *     <li> marginType: Possible values are "custom" | "none" | "default". Select one of the provided values for the margin type of the print page. Default value is "default".</li>
         *     <li> marginLeft: It must be a number and it must be in the unit specified within the page configuration. It is considered only when margin type is set as "custom". When the margin type is "default", the default value is "5mm". If "none" is maintained, then the value is "0". </li>
         *     <li> marginBottom: It must be a number and it must be in the unit specified within the page configuration. It is considered only when margin type is set as "custom". When the margin type is "default", the default value is "5mm". If "none" is maintained, then the value is "0". </li>
         *     <li> marginRight: It must be a number and it must be in the unit specified within the page configuration. It is considered only when margin type is set as "custom". When the margin type is "default", the default value is "5mm". If "none" is maintained, then the value is "0". </li>
         *     <li> marginTop: It must be a number and it must be in the unit specified within the page configuration. It is considered only when margin type is set as "custom". When the margin type is "default", the default value is "5mm". If "none" is maintained, then the value is "0". </li>
         *     <li> marginLocked: It must be a boolean value. If set to true, it signifies all four margins get synced on the same value. If the value is provided by the application, the margin top is considered for all four margins. Default value is false and considered only when the margin type is "custom". </li>
         *  </ul>
         *  <ul>
         *  durationConfig - The duration configuration object with following given keys.
         *      <li> duration: Possible values are "all" | "week" | "month" | "custom". Select the date duration of the print page. Default value is "all". </li>
         *          <ul>
         *              <li> If the provided value is "all", then the total horizon is set as duration. Values provided in "startDate" and "endDate" are ignored. </li>
         *              <li> If the provided value is "week", then the next week is set as duration. Values provided in "startDate" and "endDate" are ignored. </li>
         *              <li> If the provided value is "month", then the next month is set as duration. Values provided in "startDate" and "endDate" are ignored. </li>
         *              <li> If the provided value is "custom", then the value provided in "startDate" and "endDate" is set as duration. </li>
         *         </ul>
         *      <li> startDate: This is a UI5 date object. It is the start date of a print page. It is considered only when the "duration" is set as "custom". </li>
         *      <li> endDate: This is a UI5 date object. It is the end date of a print page. It is considered only when the "duration" is set as "custom". </li>
         *  </ul>
         *  <ul>
         *  exportConfig - The export configuration object with the following given keys.
         *      <li> exportAsJPEG: It must be a boolean value. It is a flag to decide whether to export the pdf as a JPEG or not. Default value is true, which means that the exported PDF has content in a JPEG image format. This is not applicable for single page API. </li>
         *      <li> exportRange: It must be a string value such as, '0,1". It is the range of the export. This is not applicable for a single page API and when "exportAll" is set to true. </li>
         *      <li> exportAll: It must be a boolean value. It is a flag to decide whether to export all the pages or not. Default value is true. This is not applicable for a single page API. </li>
         *      <li> compressionQuality: It must be a number between the range of 1 to 100. The quality of the compression is applicable only when "exportAsJPEG" is set to true. Default value is 75. This is not applicable for a single page API. </li>
         *      <li> scale: It must be a number between the range of 50 to 100. This is to scale the export up or down. Default value is 100. This is not applicable for a single page API. </li>
         *      <li> multiplePage: It must be a boolean value. It is a flag to decide whether if the export is multiple page. This is not applicable for a single page API. </li>
         *  </ul>
         *  <ul>
         *  If the configuration is incorrect, errors with the following codes are shown.
         *      <li> TYPE_ERROR - If the type of the property is not as expected. </li>
         *      <li> RANGE_ERROR - If the value of the property is not in the expected range or not in the list specified. </li>
         *      <li> REQUIRED_ERROR - If the required property is missing. </li>
         *  </ul>
         * @return Instance of PrintConfiguration class.
         * @constructor
         * @public
         * @since 1.127
         * @alias sap.gantt.simple.PrintConfig
         */

    var PrintConfig = BaseObject.extend('sap.gantt.simple.PrintConfig', {
        constructor: function(printConfiguartionObject) {
            if (printConfiguartionObject && typeof printConfiguartionObject == 'object'){
                this._setPageConfig(printConfiguartionObject.pageConfig);
                this._setTextConfig(printConfiguartionObject.textConfig);
                this._setMarginConfig(printConfiguartionObject.marginConfig);
                this._setDurationConfig(printConfiguartionObject.durationConfig);
                this._setExportConfig(printConfiguartionObject.exportConfig);
            }
        }
    });

    /**
     * Error class for PrintConfig.
     * PrintConfigError is a class that extends Error class and holds the error code and details.
     * @param {string} code - The error code.
     * @param {string} details - The error details.
     * @private
     */
    class PrintConfigError extends Error{
        static typeError(details){
            return new PrintConfigError(`TYPE_ERROR`,details);
        }
        static rangeError(details){
            return new PrintConfigError(`RANGE_ERROR`,details);
        }
        static requiredError(details){
            return new PrintConfigError(`REQUIRED_ERROR`,details);
        }
        constructor(code,details){
            super(details);
            this.code = code;
            this.details = details;
        }
    }
    /**
     * Gets the page configuration.
     * @returns {object} - The page configuration.
     * @private
     */
    PrintConfig.prototype._getPageConfig = function() {
        return this.pageConfig || {};
    };
    /**
     * Sets the page configuration.
     * @param {object} pageConfig - The page configuration.
     * @private
     */
    PrintConfig.prototype._setPageConfig = function(pageConfig) {
        if (pageConfig && typeof pageConfig !== 'object') {
            throw PrintConfigError.typeError('pageConfig must be an object');
        } else if (pageConfig && Object.keys(pageConfig).length > 0){
            if (pageConfig.hasOwnProperty('portrait') && typeof pageConfig['portrait'] !== 'boolean') {
                throw PrintConfigError.typeError('Portrait must be a boolean');
            } else if (pageConfig.hasOwnProperty('showPageNumber') && typeof pageConfig['showPageNumber'] !== 'boolean') {
                throw PrintConfigError.typeError('showPageNumber must be a boolean');
            } else if (pageConfig.hasOwnProperty('unit') && !['mm', 'cm', 'in'].includes(pageConfig['unit'])) {
                throw PrintConfigError.rangeError('Unit must be selected from the possible values of mm, cm or in');
            } else if (pageConfig.hasOwnProperty('paperSize')){
                if (!['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'Letter', 'Legal', 'Tabloid', 'Custom'].includes(pageConfig['paperSize'])) {
                    throw PrintConfigError.rangeError('paperSize must be selected from one of the possible values A0, A1, A2, A3, A4, A5, Letter, Legal, Tabloid, or Custom');
                } else if (['Letter', 'Legal', 'Tabloid'].includes(pageConfig['paperSize'])){
                    pageConfig['unit'] =  pageConfig['unit'] || "in";
                }
            }
            pageConfig['unit'] = pageConfig['unit'] || 'mm';
            if (pageConfig.hasOwnProperty('paperSize') && pageConfig['paperSize'] === 'Custom'){
                if (!pageConfig.hasOwnProperty('paperWidth') || !pageConfig.hasOwnProperty('paperHeight')){
                    throw PrintConfigError.requiredError('paperWidth and paperHeight must be provided for custom paperSize');
                }
                if (typeof pageConfig['paperHeight'] !== 'number'){
                    throw PrintConfigError.typeError('paperHeight must be a number');
                }
                if (typeof pageConfig['paperWidth'] !== 'number'){
                    throw PrintConfigError.typeError('paperWidth must be a number');
                }
            } else {
                pageConfig['paperSize'] = pageConfig['paperSize'] || 'A4';
                pageConfig['paperWidth'] = PrintUtils._convertPxToUnit(PrintUtils._getPaperConfiguarations()[pageConfig['paperSize']]['width'],pageConfig['unit']);
                pageConfig['paperHeight'] =  PrintUtils._convertPxToUnit(PrintUtils._getPaperConfiguarations()[pageConfig['paperSize']]['height'],pageConfig['unit']);
            }
        }
        this.pageConfig = pageConfig;
    };
    /**
     * Gets the text configuration.
     * @returns {object} -  The text configuration.
     * @private
     */
    PrintConfig.prototype._getTextConfig = function() {
        return this.textConfig || {};
    };
    /**
     * Sets the text configuration
     * @param {object} textConfig - The text configuration.
     * @private
     */
    PrintConfig.prototype._setTextConfig = function(textConfig) {
        if (textConfig && typeof textConfig !== 'object') {
            throw PrintConfigError.typeError('textConfig must be an object');
        } else if (textConfig && Object.keys(textConfig).length > 0){
            const requiredProperties = ['showHeaderText', 'showFooterText', 'headerText', 'footerText'];
            for (var prop of requiredProperties) {
                if (['showHeaderText', 'showFooterText'].includes(prop) && typeof textConfig[prop] !== 'boolean') {
                    throw PrintConfigError.typeError(`${prop} must be a boolean`);
                } else if (['headerText', 'footerText'].includes(prop) && typeof textConfig[prop] !== 'string') {
                    throw PrintConfigError.typeError(`${prop} must be a string`);
                }
            }
            this.textConfig = textConfig;
        }
    };
     /**
     * Gets the margin configuration.
     * @returns {object} - The margin configuration.
     * @private
     */
    PrintConfig.prototype._getMarginConfig = function() {
        return this.marginConfig || {};
    };
    /**
     * Sets the margin configuration.
     * @param {object} marginConfig - The margin configuration.
     * @private
    */
    PrintConfig.prototype._setMarginConfig = function (marginConfig) {
        if (marginConfig && typeof marginConfig !== 'object') {
            throw PrintConfigError.typeError('marginConfig must be an object');
        } else if (marginConfig && Object.keys(marginConfig).length > 0){
            const requiredProperties = ['marginLeft', 'marginBottom', 'marginRight', 'marginTop'];
            var paperUnit = this._getPageConfig().unit;
            var marginDefaultValue = PrintUtils._convertPxToUnit(PrintUtils._mmToPx(5),paperUnit);

            switch (marginConfig.marginType) {
                case 'default':
                    this.marginConfig = {
                        marginLeft: marginDefaultValue,
                        marginBottom: marginDefaultValue,
                        marginRight: marginDefaultValue,
                        marginTop: marginDefaultValue,
                        marginLocked: marginConfig.hasOwnProperty('marginLocked') ? marginConfig['marginLocked'] : false,
                        marginType: 'default'
                    };
                    break;
                case 'none':
                    this.marginConfig = { marginLeft: 0, marginBottom: 0, marginRight: 0, marginTop: 0, marginType: 'none', marginLocked: marginConfig.hasOwnProperty('marginLocked') ? marginConfig['marginLocked'] : false};
                    break;
                case 'custom':
                    var paperWidth = this._getPageConfig().paperWidth, paperHeight = this._getPageConfig().paperHeight;
                    for (var prop of requiredProperties) {
                        if (marginConfig.hasOwnProperty(prop)){
                            if (typeof marginConfig[prop] !== 'number') {
                                throw PrintConfigError.typeError(`${prop} must be a number`);
                            }
                            if (['marginLeft', 'marginRight'].includes(prop) && marginConfig[prop] > (paperWidth / 3)) {
                                throw PrintConfigError.rangeError(prop + ' must not be more than ' + paperWidth / 3 + ' ' + paperUnit);
                            }
                            if (['marginBottom', 'marginTop'].includes(prop) && marginConfig[prop] > (paperHeight / 3)) {
                                throw PrintConfigError.rangeError(prop + ' must not be more than ' + paperHeight / 3 + ' ' + paperUnit);
                            }
                        } else {
                            marginConfig[prop] = marginDefaultValue;
                        }
                    }
                    if (marginConfig.hasOwnProperty('marginLocked') ){
                        if (typeof marginConfig['marginLocked'] !== 'boolean'){
                            throw PrintConfigError.typeError('marginLocked must be a boolean value.');
                        }
                        if (marginConfig['marginLocked']){
                            marginConfig['marginLeft'] = marginConfig['marginTop'];
                            marginConfig['marginRight'] = marginConfig['marginTop'];
                            marginConfig['marginBottom'] = marginConfig['marginTop'];
                        }
                    }
                    this.marginConfig = marginConfig;
                    break;
                default:
                    throw PrintConfigError.rangeError("marginType must be either 'custom', 'none', or 'default'.");
            }
        }
    };

    /**
     * Gets the duration configuration.
     * @returns {object} - The duration configuration.
     * @private
     */
    PrintConfig.prototype._getDurationConfig = function() {
        return this.durationConfig || {};
    };
    /**
     * Sets the duration configuration.
     * @param {object} durationConfig - The duration configuration.
     * @private
     */
    PrintConfig.prototype._setDurationConfig = function(durationConfig) {
        if (durationConfig && typeof durationConfig !== 'object') {
            throw PrintConfigError.typeError('durationConfig must be an object');
        } else if (durationConfig && Object.keys(durationConfig).length > 0){
            if (!durationConfig.hasOwnProperty('duration')) {
                throw PrintConfigError.requiredError(`Required property is missing for durationConfig: duration`);
            }
            if (!['all', 'week', 'month', 'custom'].includes(durationConfig['duration'])) {
                throw PrintConfigError.rangeError(`Date duration must be selected from the possible values of: 'all', 'week', 'month', 'custom'`);
            }
            if (durationConfig['duration'] == 'custom'){
                if (!durationConfig.hasOwnProperty('startDate') || !durationConfig.hasOwnProperty('endDate')){
                    throw PrintConfigError.requiredError(`startDate and endDate must be provided for custom duration`);
                } else if (!(durationConfig['startDate'] instanceof Date) || !(durationConfig['endDate'] instanceof Date)){
                    throw PrintConfigError.typeError(`startDate and endDate must be a UI5 date object`);
                }
            }
            this.durationConfig = durationConfig;
        }
    };
    /**
     * Gets the export configuration.
     * @returns {object} - The export configuration.
     * @private
     */
    PrintConfig.prototype._getExportConfig = function() {
        return this.exportConfig || {};
    };
    /**
     * Sets the export configuration.
     * @param {object} exportConfig - The export configuration.
     * @private
     */
    PrintConfig.prototype._setExportConfig = function(exportConfig) {
        if (exportConfig && typeof exportConfig !== 'object') {
            throw PrintConfigError.typeError('exportConfig must be an object');
        } else if (exportConfig && Object.keys(exportConfig).length > 0){
        const requiredProperties = ['exportAsJPEG', 'exportRange', 'exportAll', 'compressionQuality', 'scale', 'multiplePage'];
            for (var prop of requiredProperties) {
                if (exportConfig.hasOwnProperty(prop)){
                    if (['exportAsJPEG', 'exportAll', 'multiplePage'].includes(prop) && typeof exportConfig[prop] !== 'boolean') {
                        throw PrintConfigError.typeError(`${prop} must be a boolean`);
                    } else if (['compressionQuality', 'scale'].includes(prop) && typeof exportConfig[prop] !== 'number') {
                        throw PrintConfigError.typeError(`${prop} must be a number`);
                    } else if (prop === 'exportRange' && typeof exportConfig[prop] !== 'string') {
                        throw PrintConfigError.typeError(`exportRange must be string`);
                    }
                }
            }
            if (exportConfig.hasOwnProperty('scale') && (exportConfig['scale'] < 50 || exportConfig['scale'] > 200)){
                throw PrintConfigError.rangeError('scale must be in the range of 50 to 200');
            }
            if (exportConfig.hasOwnProperty('compressionQuality') && (exportConfig['compressionQuality'] < 1 || exportConfig['compressionQuality'] > 100)){
                throw PrintConfigError.rangeError('compressionQuality must be in the range of 1 to 100');
            }
            this.exportConfig = exportConfig;
        }
    };
    return PrintConfig;
});