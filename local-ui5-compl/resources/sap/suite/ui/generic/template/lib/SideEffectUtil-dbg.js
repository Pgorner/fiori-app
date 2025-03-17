sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper",
"sap/suite/ui/generic/template/genericUtilities/metadataAnalyser",
"sap/base/util/deepExtend",
"sap/ui/comp/util/SharedUtil"
], function(AnnotationHelper, metadataAnalyser, deepExtend, SharedUtil) {
	"use strict";
	var SideEffectSourcePropertyType = {
		SINGLE_SOURCE_ONLY : "OnlySingleSource",
		SINLGE_AND_MULTIPLE_SOURCE: "SingleAndMultipleSource",
		MULTIPLE_SOURCE_ONLY: "OnlyMultipleSource",
		NO_SIDE_EFFECT: "NoSideEffect"
	};

	/***
	 * To trigger side effect on value change , only the fieldGroup Ids of single source property is required
	 * @param {sap.ui.comp.smartfield.SmartField} oSmartField
	 * @param {*} oComputedMetaData
	 * @returns {string[]|null} array of fieldGroupID assigned for a property (oComputedMetaData.path)
	 */
	function fnGetFieldGroupIdOnlyForSingleSource(oSmartField, oComputedMetaData) {
		var oSideEffect;
		var oClonedMetaData = deepExtend({}, oComputedMetaData);
		for (var sEntityAttributeKey in oComputedMetaData.entityType) {
			if (sEntityAttributeKey.startsWith("com.sap.vocabularies.Common.v1.SideEffects")) {
				oSideEffect = oComputedMetaData.entityType[sEntityAttributeKey];
				// since only the side effect which has the given smartfield as the single source property should get triggered with this event, the other side effect(s)
				// where the given smartfield is used in combination with other property needs to be eliminated, in order to get only the relevant fieldGroupIds.
				if (oSideEffect.SourceProperties && oSideEffect.SourceProperties.length > 1 && metadataAnalyser.hasPropertyInSideEffect(oSideEffect, oComputedMetaData.path)) {
					delete oClonedMetaData.entityType[sEntityAttributeKey];
				}
			}
		}
		return oSmartField._calculateFieldGroupIDs(oClonedMetaData);
	}
	function fnComputeFieldGroupAndTriggerSideEffect(oSmartField, sSideEffectSourcePropertyType) {

		var aFieldGroupIds;
		var fnTriggerValidateFieldGroupEvent = function() {
			if (aFieldGroupIds) {
				oSmartField.triggerValidateFieldGroup(aFieldGroupIds);
			}
		};
		var fnCallTriggerValidateFieldGroup = function(sSideEffectSourcePropertyType, oComputedMetaData) {	

			switch (sSideEffectSourcePropertyType) {
				case SideEffectSourcePropertyType.SINGLE_SOURCE_ONLY:
					var aInnerControls = oSmartField.getInnerControls();
					aFieldGroupIds = aInnerControls && aInnerControls[0] && aInnerControls[0].getFieldGroupIds && aInnerControls[0].getFieldGroupIds();
					fnTriggerValidateFieldGroupEvent(aFieldGroupIds);
					break;
				case SideEffectSourcePropertyType.SINLGE_AND_MULTIPLE_SOURCE:
					// Even if the property is mentioned in multiple side effect sources , execute only the single source side effects
					if (oComputedMetaData) { // In case of the smart field not rendered by generic template, oComputedMetaData is already fetched to calculate SideEffectSourcePropertyType at runtime
						aFieldGroupIds = fnGetFieldGroupIdOnlyForSingleSource(oSmartField, oComputedMetaData);
						fnTriggerValidateFieldGroupEvent(aFieldGroupIds);
					} else {
						oSmartField._getComputedMetadata().then(function(oComputedMetaData) {
							aFieldGroupIds = fnGetFieldGroupIdOnlyForSingleSource(oSmartField, oComputedMetaData);
							fnTriggerValidateFieldGroupEvent(aFieldGroupIds);
						});
					}
					break;
				case SideEffectSourcePropertyType.MULTIPLE_SOURCE_ONLY:
					// If a property is added to a side effect source group then it is not possible to judge the next user interation.
					// So do not programatically trigger side effect.
					break;
				default:
					break;
			}
		};

		if (!sSideEffectSourcePropertyType) {
			oSmartField._getComputedMetadata().then(function(oComputedMetaData) {
				var sSideEffectSourcePropertyType,
				sEntityTypeFullPath = oComputedMetaData.entityType.namespace + "." + oComputedMetaData.entityType.name;
				//bIsDraft = oTemplateUtils.oComponentUtils.isDraftEnabled(),
				sSideEffectSourcePropertyType = AnnotationHelper.getSideEffectSourcePropertyType(oComputedMetaData.path, true, oSmartField.getModel().getMetaModel(), sEntityTypeFullPath);
				if (sSideEffectSourcePropertyType === SideEffectSourcePropertyType.NO_SIDE_EFFECT) { // if the field does not contain side effect then exit
					return;
				}
				fnCallTriggerValidateFieldGroup(sSideEffectSourcePropertyType, oComputedMetaData);
			});
		} else {
			fnCallTriggerValidateFieldGroup(sSideEffectSourcePropertyType);
		}
	}

	/**
	 * Triggers side effect from generic template layer for a field. This method gets triggerd from two sources
	 * 	1. changeModelValue (SmartField)
	 * 	2. fieldChange (SmartTable) - in this case get the source smart field from 'changeEvent'
	 * @param {sap.ui.base.Event} oEvent
	 * @param {*} oComponentUtils
	 * @param {boolean} bIsSideEffectTypeComputed
	 */
	function fnHandleSideEffectForField(oEvent, oComponentUtils, bIsSideEffectTypeComputed) {
		
		if (!oComponentUtils.isDraftEnabled()) {
			return;
		}
		var oSmartField = oEvent.getParameter("changeEvent") && oEvent.getParameter("changeEvent").getSource ? oEvent.getParameter("changeEvent").getSource() : oEvent.getSource();

		if (bIsSideEffectTypeComputed) { // For FE rendered smart fields the side effect type is computed at the templating time
			var sSideEffectSourcePropertyTypeCustomData = oSmartField.getCustomData().find(function (oCustomData) {
				return oCustomData.getKey() === "SideEffectSourcePropertyType";
			});
			sSideEffectSourcePropertyTypeCustomData = sSideEffectSourcePropertyTypeCustomData && sSideEffectSourcePropertyTypeCustomData.getValue();
			fnComputeFieldGroupAndTriggerSideEffect(oSmartField, sSideEffectSourcePropertyTypeCustomData);
		} else {
			fnComputeFieldGroupAndTriggerSideEffect(oSmartField);
		}
	}

	/**
	 * Calculate and assign fieldGroup Id(s) for a smart Field
	 * @param {sap.ui.comp.smartfield.SmartField} oSmartField
	 * @param {*} oMetaModel
	 * @param {*} sEntitySet
	 */
	function fnAssignFieldGroupIds(oSmartField, oMetaModel, sEntitySet) {
		oSmartField._getComputedMetadata().then(function (oComputedMetaData) {
			if (oComputedMetaData && oComputedMetaData.navigationPath && !!oSmartField.getBindingContext()) {
				var oClonedMetaData = deepExtend({}, oComputedMetaData);
				/* EntitySet and EntityType of the cloned metamodel of smartfield needs to be changed to the parent entity so that when
					_calculateFieldGroupIDs looks through the passed metamodel, it should be able to find the corresponding side effect annotation */
				oClonedMetaData.entitySet = oMetaModel.getODataEntitySet(sEntitySet);
				oClonedMetaData.entityType = oMetaModel.getODataEntityType(oClonedMetaData.entitySet.entityType);

				var aIDs = oSmartField._calculateFieldGroupIDs(oClonedMetaData);
				if (aIDs) {
					oSmartField._setInternalFieldGroupIds(aIDs);
				}
			}
		});
	}

	/**
	 * Returns the EntitySet name, EntityType name, PropertyName for a given link field
	 * @param {sap.ui.model.odata.ODataMetaModel.EntitySet} oEntitySet
	 * @param {object} oTarget
	 * @param {string} sFieldName
	 */
	function fnGetPropsForLinkFields (oEntitySet, oTarget, sFieldName) {
		var sLinkProperty;
		if (oTarget && oTarget.Value && oTarget.Value.Path){
			sLinkProperty = oTarget.Value.Path;
		} else {
			sLinkProperty = oTarget.Target.AnnotationPath.split("/")[0] + "/" + sFieldName;
		}
		var oCustomData = {
			"sEntitySetName": oEntitySet.name,
			"sEntityTypeName":  oEntitySet.entityType,
			"sLinkProperty": sLinkProperty
		};
		return JSON.stringify(oCustomData);
	}

	/**
	 * Calculate and assign fieldGroup Id(s) for the link field
	 * The following logic is executed in the onAfterRendering event of the control because
	 * 1. We need the binding context to be available for the control
	 * 2. Avoid unnecessary strain on the rendering of the application during templating
	 * @param {sap.suite.ui.generic.template.genericUtilities.Link} oLink
	 */
	function fnAssignFieldGroupIdsToLinkField (oLink) {
		var aCustomData = oLink.getCustomData();
		var oMetaModel = oLink.getModel().getMetaModel();
		var oCustomData = aCustomData.find((oCustomData) => oCustomData.getKey() === "SideEffects" && oCustomData.getValue());
		if (oLink.getBindingContext() && oCustomData){
			var oCustomDataValue = oCustomData.getValue();
			var sEntitySetName = oCustomDataValue.sEntitySetName;
			var sEntityTypeName = oCustomDataValue.sEntityTypeName;
			var sLinkProperty = oCustomDataValue.sLinkProperty;
			var sSideEffectType = metadataAnalyser.getFieldSourcePropertiesType(sLinkProperty, oMetaModel, sEntityTypeName);
			
			if (sSideEffectType === "NoSideEffect"){
				return;
			}

			var oControl = oLink;
			var oEntityType = oMetaModel.getODataEntityType(sEntityTypeName);
			var oEntitySet = oMetaModel.getODataEntitySet(sEntitySetName);
			var oProperty = metadataAnalyser.getPropertyMetadata(oMetaModel, sEntityTypeName, sLinkProperty);
			var oMetaData = {
				entitySet: oEntitySet,
				entityType: oEntityType,
				path: sLinkProperty,
				property: {
					property: oProperty
				}
			};

			if (sLinkProperty.includes("/")){
				while (!oControl.isA("sap.ui.comp.smartform.Group")) {
					oControl = oControl.getParent();
				}
				//The method SharedUtil.applyFieldGroupIDs takes in the control and its metadata
				//It then reads the Side Effect annotations configured for it, calculates fieldGroupIds and assigns them to the field
				
				//For navigation path link fields, we pass the oLink's parent Group control's binding context when calculating the fieldGroupIds
				//This makes sure the calculated fieldGroupIds are consistent with the other source fields
				SharedUtil.applyFieldGroupIDs(oLink, oMetaData, null, oControl.getBindingContext());
			} else {
				//For non navigation path link fields, we just pass the oLink along with its metadata
				SharedUtil.applyFieldGroupIDs(oLink, oMetaData);
			}
		}
	}

	/**
	* Configures a side effect for custom field.
	* @param {Object} oView - The view instance of the object page.
	* @param {Object} oControl - The control object for the custom field.
	* @param {String} sProperty - The name of the property associated with the custom field.
	* @param {String} sEntitySet - The entity set to which the custom field belongs.
	* @param {String} oController - Object page controller.
	*/
	function registerCustomFieldForSideEffect(oControl, sProperty, sEntitySet, oController) {
		var oMetaModel = oController.getView().getModel().getMetaModel();
		var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
		var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
		var oProperty = oMetaModel.getODataProperty(oEntityType, sProperty);
		//The method SharedUtil.applyFieldGroupIDs takes in the control and its metadata, reads the Side Effect annotations configured for it 
		//and assigns the fieldGroupID accordingly.
		oController.extensionAPI.attachPageDataLoaded(() => {
			SharedUtil.applyFieldGroupIDs(oControl, {
				entitySet: oEntitySet,
				entityType: oEntityType,
				path: sProperty,
				property: {
					property: oProperty
				}
			});
		});
	}

	/**
	* Register field group Change.
	* @param {object} oComponent
	* @param {Object} oTemplateUtils
	* @param {String} sFieldName - The name of the property associated with the custom field.
	* @param {string} sEntitySet - EntitySet where side effect is defined.
	*/
	function fieldGroupChangeRegister(oComponent, oTemplateUtils, sFieldName, sEntitySet) {
		var oEntitySet = oComponent.getModel().getMetaModel().getODataEntitySet(sEntitySet);
		var oEntityType = oComponent.getModel().getMetaModel().getODataEntityType(oEntitySet.entityType);
		for (var sProperty in oEntityType) {
			if (sProperty.includes("com.sap.vocabularies.Common.v1.SideEffects")) {
				var aSource = oEntityType[sProperty].SourceProperties;
				if (!aSource) {
					continue;
				}
				for (var i = 0; i < aSource.length; i++) {
					if (aSource[i].PropertyPath === sFieldName) {
						var sQualifier = sProperty.split("#")[1];
						oTemplateUtils.oServices.oApplicationController.registerGroupChange(sQualifier);
					}
				}
			}
		}
	}

	return {
		handleSideEffectForField : fnHandleSideEffectForField,
		assignFieldGroupIds: fnAssignFieldGroupIds,
		getPropsForLinkFields: fnGetPropsForLinkFields,
		assignFieldGroupIdsToLinkField: fnAssignFieldGroupIdsToLinkField,
		registerCustomFieldForSideEffect: registerCustomFieldForSideEffect,
		fieldGroupChangeRegister: fieldGroupChangeRegister
	};
});