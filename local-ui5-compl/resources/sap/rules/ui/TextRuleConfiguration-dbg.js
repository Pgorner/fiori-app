/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides control sap.rules.ui.TextRuleConfiguration
sap.ui.define([
	"./library", 
	"sap/ui/core/Element"
], function(library, Element) {
	"use strict";

	/**
	 * Constructor for a new TextRuleConfiguration.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The <code>sap.rules.ui.TextRuleConfiguration</code>  element provides the ability to define specific properties that will be applied when rendering the <code>sap.rules.ui.RuleBuilder</code> in decision table mode.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @since 1.4
	 * @alias sap.rules.ui.TextRuleConfiguration
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var TextRuleConfiguration = Element.extend("sap.rules.ui.TextRuleConfiguration", { 
	
		metadata : {
			library : "sap.rules.ui",
			properties : {				
				//Specifies if the 'Settings' button is available in the toolbar of the Text Rule; the Settings button launches the Settings popup which allows the user creating the rule to configure the Text Rule. 
				/**
				 * The value determines whether the Settings button is displayed in a Text Rule when the control is used with S/4 HANA 17.05 (Cloud) or 17.09 (On Premise) and higher (On Premise).
				 * @deprecated Since 1.120.2, to configure the settings, use the Manage Rules Project app or the Rule Authoring APIs.
				 */
				enableSettings: {
					type: "boolean",
					defaultValue: false 
				},
				/**
				 * @deprecated Since 1.120.2, to configure the settings, use the Manage Rules Project app or the Rule Authoring APIs.
				 */
				enableSettingResult: {
					type: "boolean",
					defaultValue: true 
				},
				/**
				 * The value determines whether the Else section is displayed in a Text Rule when the control is used with S/4 HANA 17.05 (Cloud) or 17.09 (On Premise) and higher (On Premise).
				 */
				enableElse: {
					type: "boolean",
					defaultValue: true					
				},
				/**
				 * The value determines whether the Else If section is displayed in a Text Rule when the control is used with S/4 HANA 17.05 (Cloud) or 17.09 (On Premise) and higher (On Premise).
				 */
				enableElseIf: {
					type: "boolean",
					defaultValue: true
				}
			},
			events:{
				change:{
					parameters :{
						name:{},
						value:{}
					}
				}
			}
		},
		
		_handlePropertySetter: function(sPropertyName, value){
			var result = this.setProperty(sPropertyName, value, true);
			this.fireChange({name: sPropertyName, value: value});
			return result;
		},
		
		setEnableSettings: function(bValue){
			return this._handlePropertySetter("enableSettings", bValue);
		},
		
		setEnableSettingResult: function(bValue){
			return this._handlePropertySetter("enableSettingResult", bValue);
		},
		
		setEnableElse: function(bValue){
			return this._handlePropertySetter("enableElse", bValue);
		},
		
		setEnableElseIf: function(bValue){
			return this._handlePropertySetter("enableElseIf", bValue);
		},
	});

	return TextRuleConfiguration;

}, /* bExport= */ true);
