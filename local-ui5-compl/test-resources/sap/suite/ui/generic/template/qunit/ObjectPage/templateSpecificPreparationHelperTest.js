/*
 * tests for the sap.suite.ui.generic.template.ObjectPage.templateSpecificPreparationHelper
 */

sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/ObjectPage/templateSpecificPreparationHelper",
	"sap/suite/ui/generic/template/js/AnnotationHelper",
	"sap/suite/ui/generic/template/ObjectPage/annotationHelpers/AnnotationHelperActionButtons",
	"sap/ui/model/odata/AnnotationHelper"
], function (sinon, templateSpecificPreparationHelper, AnnotationHelper, AHActionButtons, AHModel) {
	"use strict";
	var oSandbox;

	function fnAssertExpectedPropertiesDeep(assert, mActual, mExpected, sTest){
		// assert, that all expected properties are actually contained and for them recursively the same is true, however allow additional properties (on each level)
		// works also for undefined and for empty array, if explicitly mentioned in mExpected

		function getUnmatchedPath(mActual, mExpected){
			if(Array.isArray(mExpected)){
				if(!Array.isArray(mActual)){
					return " is not an array";
				}
				if(mExpected.length === 0 && mActual.length > 0){
					return " is not empty";
				}
				var iUnmatchedEntryIndex = mExpected.findIndex(function(mExpectedEntry){
					return mActual.every(function(mActualEntry){
						return getUnmatchedPath(mActualEntry, mExpectedEntry);
					});
				});
				// none of the actual elements matches. With this logic, we currently describe, why the first element doesn't match - although this might not be the best 
				// explanation for the user. To get sth. better, we'd need to describe for each actual entry why it doesn't match - which means, we'd need to pass an array of texts as result.
				// Could be achieved by using mActual.map - but also other returns would need adaptation.
				return iUnmatchedEntryIndex > -1 && "[" +  iUnmatchedEntryIndex + "]" + getUnmatchedPath(mActual[0], mExpected[iUnmatchedEntryIndex]);
			} else if(typeof(mExpected) === "object"){
				if(typeof(mActual) !== "object"){
					return " is not an object";
				}
				var sUnmatchedKey = Object.keys(mExpected).find(function(sKey){
					return getUnmatchedPath(mActual[sKey], mExpected[sKey]);
				});
				return sUnmatchedKey && "." + sUnmatchedKey + getUnmatchedPath(mActual[sUnmatchedKey], mExpected[sUnmatchedKey]);
			} else {
				return mActual === mExpected ? false : ": " + mExpected;
			}
		}

		var sResult = getUnmatchedPath(mActual, mExpected);
		assert.notOk(sResult, sTest + ": Unmatched expected value at " + sResult);
	}

	var oComponentUtils = {
		getBreadCrumbInfo: Function.prototype,
		getViewExtensions: Function.prototype,
		getControllerExtensions: Function.prototype,
		isDraftEnabled: Function.prototype,
		isRenderingWaitingForViewportEntered: Function.prototype,
		getSettings: Function.prototype,
		getToolbarDataFieldForActionCommandDetails: Function.prototype,
		getToolbarDataFieldForIBNCommandDetails: Function.prototype
	};
	var oDeviceModelData = {
		system: {
			phone: false,
			tablet: false
		}
	};
	var oMetaModelData = {};

	function getSubObject (oObject, sIdentifyingPropertyName, sPath) {
		if (sPath) {
			var aPathSegments = sPath.split("/");
			// can point to either object or array
			var vPointer = oObject;
			var aIdentifyPathSegments = sIdentifyingPropertyName && sIdentifyingPropertyName.split("/");
			aPathSegments.forEach(function (sPathSegment) {
				if (sPathSegment === "") {
					return;
				}
				if (sIdentifyingPropertyName && Array.isArray(vPointer)) {
					vPointer = vPointer.find(function (oEntry) {
						var vIdentifyingPointer = oEntry;
						aIdentifyPathSegments.forEach(function (sIdentifyingPathSegment) {
							vIdentifyingPointer = vIdentifyingPointer[sIdentifyingPathSegment];
						});
						return vIdentifyingPointer === sPathSegment;
					});
				} else {
					vPointer = vPointer[sPathSegment];
				}
			});
			return vPointer;
		}
	}

	var oMetaModel = {
			getObject: function(sPath){
				return getSubObject(oMetaModelData, undefined, sPath);
			},
			getMetaContext: function(sPath) {
				return {
					getPath: function () {
						var oEntitySet = getSubObject(oMetaModelData, "name", "entitySet" + sPath);
						var iPosition = oMetaModelData.entityType.map(function(oEntityType){return oEntityType.name}).indexOf(oEntitySet.entityType);
						return "entityType/" + iPosition;
					}
				}
			},
			getContext: function(sPath) {
				return { 
					getObject: getSubObject.bind(null, oMetaModelData, undefined, sPath),
					sPath: sPath
				};
			},
			getODataEntitySet: function(sEntitySetName){
				return oMetaModelData.entitySet.find(function(oEntitySet){return oEntitySet.name === sEntitySetName;});
			},
			getODataEntityType: function(sEntityTypeName){
				return oMetaModelData.entityType.find(function(oEntityType){return oEntityType.name === sEntityTypeName;});
			},
			getODataAssociationSetEnd: function (oEntityType, sNavigationPropertyPath){
				var sTargetEntitySet = oEntityType.navigationProperties[sNavigationPropertyPath].targetEntitySet;
				return {entitySet: sTargetEntitySet};
			},
			getODataProperty: function (oEntityType, sProperty) {
				return oEntityType.properties.find(oProp => oProp.name === sProperty);
			}
	};

	var sut;
	QUnit.module("Object Page Component", {
		before: function () {
			// sut: System under test
			sut = templateSpecificPreparationHelper;
		},
		beforeEach: function(){
			oSandbox = sinon.sandbox.create();
			oSandbox.stub(AHModel, "resolvePath", function (oContext) {
				// for time being we just assume annotation without qualifier on the same entity type
				var aPathSegments = oContext.sPath.split("/");
				var aAnnotationPathSegments = oContext.getObject().AnnotationPath.split("@");
				return aPathSegments[0] + "/" + aPathSegments[1] + "/" + aAnnotationPathSegments[1];
			});
			oSandbox.stub(AHModel, "gotoEntitySet", function (oContext) {
				// currently not needed, but corresponding test to be added: referenceFacet pointing to lineItem on different entitySet
				
				// get the path (in oMetaModelData) pointing to the EntitySet the target of the given annotation is pointing to
				
				// deep paths possible
				var aPathSegments = oContext.getObject().AnnotationPath.split("/");
				// every navigationProperty should be followed by "/", so last segment is only the annotation term (which we don't care for here)
				aPathSegments.pop();
				
				// if no path provided, original function (annotationHelper from odata model) does not return current entitySet but just undefined, so we do similar
				if (aPathSegments.length === 0){
					return undefined;
				}
				
				// provided context is pointing to an annotation in oMetaModelData, assume it can only be a reference facet annotation. Then annotation target is an EntityType 
				// (i.e. path starts with "entityType/"), question is only, which one (number between 1st ans 2nd "/")
				var oEntityType = oMetaModelData.entityType[oContext.sPath.split("/")[1]];
				
				// follow the path segments
				aPathSegments.forEach(function(sNavigationProperty){
					// oEntityType is source of navigation property, replace it with its target
					oEntityType = oMetaModel.getODataEntityType(oEntityType.navigationProperties[sNavigationProperty].targetEntityType);
				})
				
				// found EntityType the target annotation is defined on, now finally get the path (in oMetaModelData) of the corresponding EntitySet
				var iEntitySet = oMetaModelData.entitySet.findIndex(function(oEntitySet){return oEntitySet.entityType === oEntityType.name;});
				return "entitySet/" + iEntitySet;
			});
			oSandbox.stub(AHModel, "format", function (oContext) {
				return oContext.getObject().String;
			});
		},
		afterEach: function(){
			oSandbox.restore();
		}
	}, function () {
		
		
		/* Intended structure for templateSpecific on OP
		 * ---------------------------------------------
		 * still work in progress, can be adapted if needed
		 * 
		 * controlProperties: anything completely prepared to be put directly as property to ObjectPageLayout (e.g. showFooter could make sense), but not necessarily everything has to be prepared
		 * manifestSettings: any settings from manifest, but 
		 * 		- enhanced with defaults
		 * 		- without deprecated ones (already being mapped to most current ones
		 * 		- without settings irrelevant on this level (but only for inheritance)
		 * annotations: Map of relevant annotations (key = annotation term, maybe abbreviated) to enable direct use for bindings that are simple enough not to require preparation. Note: For ReferenceFacet/CollectionFacet we use the common abstract 
		 * superType Facet as key to ease direct access in fragemnts. Concrete type can be read from annotation/RecordYpe. Format to be decided:
		 * 		- copy from metamodel
		 * 			pro: enables enhancement with defaults without changing metamodel
		 * 			contra: model.AnnotationHelper cannot be used (as templating variables are pointing to wrong model)
		 * 		- reference to metamodel
		 * 			contra: enhancement with defaults would change metamodel, model.AnnotationHelper still cannot be used
		 * 		- string containing path to metamodel, get access to metamodel with annotationHelper.getMetaModelBinding
		 * 			pro: no duplication, leaner structure, model.AnnotationHelper can be used (however these again enables complicated use cases that should better be solved in preparation)
		 * 			contra: more complicated usage, enhancement with defaults not possible
		 * 		- any combination of these: for the time being, use a copy and the path (combined in an object with two properties metaModelPath and annotation)
		 * additionalData: any additional data we want to prepare that does not fall into any of the other categories
		 * aggregations: any aggregations we want to prepare data for, esp. at least sections (as long as sections is the only one, skip this intermediate structure level)
		 * 		<aggregations> (map - name of aggregation should be key)
		 * 			<control> name of control to be put into aggregation. Array if multiple instances can be needed. (if there's only one type of control to be put in the aggregation, we can think of skipping this intermediate structure level)
		 * 		sections: array with one entry per section to be created, containing (similar as OP):
		 * 			controlProperties: anything completely prepared to be put directly as property to ObjectPageSection: id, title, visible
		 * 			manifestSettings: any settings from manifest, but 
		 *		 		- enhanced with inherited settings from OP
		 *				- enhanced with defaults
		 * 				- without deprecated ones (already being mapped to most current ones
		 * 				- without settings irrelevant on this level (but only for inheritance)
		 * 			(annotations: should hopefully not be needed at this level. Only relevant could be the facet annotation, but this could be CollectionFacet or ReferenceFacet, thus we need preparation anyway) 
		 * 			additionalData: any additional data we want to prepare that does not fall into any of the other categories
		 * 			subSections: (as this is the only aggregation we use, skip the intermediate structure level aggregations). Array with one entry per subSection to be created, containing (similar as OP/sections): 
		 * 				controlProperties: anything completely prepared to be put directly as property to ObjectPageSubSection: id, title, visible, showTitle
		 * 				manifestSettings: any settings from manifest, but 
		 *			 		- enhanced with inherited settings from section
		 *					- enhanced with defaults
		 * 					- without deprecated ones (already being mapped to most current ones
		 * 					- without settings irrelevant on this level (but only for inheritance)
		 * 				(annotations: should hopefully not be needed at this level. Only relevant could be the facet annotation, but this could be CollectionFacet or ReferenceFacet, thus we need preparation anyway) 
		 * 				additionalData: any additional data we want to prepare that does not fall into any of the other categories
		 * 				aggregations: (here we definitely use several aggregations, so keep this level)
		 * 					blocks:  (Array) Actually we only put one control (extensionPoint) directly into the aggregation blocks and others into (default) aggregation of that one (or even the contained ones), but there's no need to rebuild the complete
		 * 								depth here. Thus, we differentiate between different controls, but put them all directly here
		 * 						controlProperties: A map (key = control name) containing properties for the controls put here
		 * 							extensionPoint: (ReplaceFacet) currently only property: name. Think of whether we should pre analyze like for other extensions points and only provide if used.
		 * 							dynamicSideContent: Only if used. Properties: id, sideContentPosition, showMainContent, showSideContent, equalSplit, extensionPoint (actually separate control to be put into aggregation sideContent - think how to put this best into the structure)
		 * 							grid: currently, in all cases (except special SmartForm for old UI changes) we add a grid - clarify, whether this is actually needed
		 * 							smartForm: id
		 * 							extensionPoint: SmartFormExtensions
		 * 							smartTable
		 * 							smartChart
		 * 							vBox: visible (contacts), binding (address) -> same control could be used in different types, clarify how to ensure using default (undefined, empty string, or actual default value?)
		 * 							gridData: id (contacts)
		 * 							list: id (contacts - all others are derived directly from contacts annotation, so need for preanalysis)
		 * 						aggregations: also different (depending on type), hence also a map
		 * 							groups: (default aggregation of SmartForm)
		 * 								controlProperties: map (key = controlname)
		 * 									group: properties for group put into aggregation groups of SmartForm
		 * 									groupElement: In most cases, we put exactly one GroupElement into the (default aggregation groupElements of) Group, only exception is ExtensionPoint SmartFormExtension directly put into (default aggregation groupElements of) Group
		 * 									extensionPointSmartFormExtension: only name
		 * 									extensionPointReplaceSimpleHeaderFacet: only name
		 * 									smartField
		 * 									link
		 * 									icon
		 * 									smartMultiInput
		 * 						additionalData:
		 * 							type: SmartForm, SmartTable, SmartChart, Contacts, or Address (derived from annotation target of reference facet)
		 * 					moreBlocks: Similar to content inside blocks, but...
		 * 						- no extensionPoint and dynamicSideContent, thus we can use an array directly
		 * 						- additional Blockbase for separation
		 * 					actions: array, entries containing properties for buttons: id, text, press, visible, enable, Action, SemanticObject
		 * 	            
		 */
		
		QUnit.test("temporary test for restructuring: ensure not to provide values at 'old' place", function (assert) {
			oMetaModelData = {
				entityType: [{
					name: "RootEntityType",
					"com.sap.vocabularies.UI.v1.FieldGroup": {
						Label: {
							String: "FieldGroup for RootEntity"
						}
					},
					"com.sap.vocabularies.UI.v1.Facets": [{
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
						ID: {
							String: "ReferenceFacet_1"
						},
						Target: {
							AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup"
						}
					}]
				}],
				entitySet: [{
					name: "RootEntitySet",
					entityType: "RootEntityType"
				}]
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData , "RootEntitySet");

			var oExpected = {
				sections: [{
					facetId: undefined,
					facetAnnotation: undefined
				}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "facetAnnotation should be provided within annotations, not on top level");
		});

		QUnit.test("fnGetSections : ReferenceFacet on top level", function (assert) {
			oMetaModelData = {
					entityType: [{
						name: "RootEntityType",
						"com.sap.vocabularies.UI.v1.FieldGroup": {
							Label: {
								String: "FieldGroup for RootEntity"
							},
							Data: [{
								RecordType: "com.sap.vocabularies.UI.v1.DataField"
							}]
						},
						"com.sap.vocabularies.UI.v1.Facets": [{
							RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							ID: {
								String: "ReferenceFacet_1"
							},
							Target: {
								AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup"
							}
						}]
					}],
					entitySet: [{
						name: "RootEntitySet",
						entityType: "RootEntityType"
					}]
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData , "RootEntitySet");

			var oExpected = {
					sections: [{
						additionalData: {
							facetId: "ReferenceFacet_1"
						},
						annotations: {
							Facet: {
								annotation: {
									ID: {
										String: "ReferenceFacet_1"
									}
								}
							}
						},
						subSections: [{
							additionalData: {
								facetId: "ReferenceFacet_1"
							},
							annotations: {
								Facet: {
									annotation: {
										ID: {
											String: "ReferenceFacet_1"
										}
									}
								}
							},
							blocks: [{
								additionalData: {
									facetId: "ReferenceFacet_1",
									type: "SmartForm"
								},
								controlProperties: {
									id: "ReferenceFacet_1::Form"
								},
								aggregations: {
									groups: [{
										additionalData: {
											facetId: "ReferenceFacet_1"
										},
										targetAnnotation: {
											Label: {
												String: "FieldGroup for RootEntity"
											}
										}
									}]
								}
							}]
						}]
					}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains a section, subSection, block, and group all created by the facet annotation; block points to correct target annotation");
		});

		QUnit.test("fnGetSections : CollectionFacet with ReferenceFacet", function (assert) {
			oMetaModelData = {
					entityType: [{
						name: "RootEntityType",
						"com.sap.vocabularies.UI.v1.FieldGroup": {
							Label: {
								String: "FieldGroup for RootEntity"
							},
							Data: [{
								RecordType: "com.sap.vocabularies.UI.v1.DataField"
							}]
						},
						"com.sap.vocabularies.UI.v1.Facets": [{
							RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
							ID: {
								String: "CollectionFacet_1"
							},
							Facets: [{
								RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
								ID: {
									String: "ReferenceFacet_1_1"
								},
								Target: {
									AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup"
								}
							}]
						}]
					}],
					entitySet: [{
						name: "RootEntitySet",
						entityType: "RootEntityType"
					}]
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData , "RootEntitySet");

			var oExpected = {
					sections: [{
						additionalData: {
							facetId: "CollectionFacet_1"
						},
						annotations: {
							Facet: {
								annotation: {
									ID: {
										String: "CollectionFacet_1"
									}
								}
							}
						},
						subSections: [{
							additionalData: {
								facetId: "CollectionFacet_1"
							},
							annotations: {
								Facet: {
									annotation: {
										ID: {
											String: "CollectionFacet_1"
										}
									}
								}
							},
							blocks: [{
								additionalData: {
									facetId: "CollectionFacet_1",
									type: "SmartForm"
								},
								controlProperties: {
									id: "CollectionFacet_1::Form"
								},
								aggregations: {
									groups: [{
										additionalData: {
											facetId: "ReferenceFacet_1_1"
										}
									}]
								}
							}]
						}]
					}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains a section, subSection, and block with id generated from collection facet, and a group with id from reference facet");
		}); 

		QUnit.test("fnGetSections : empty CollectionFacet", function (assert) {
			// to be revisited: creating sections for empty collectionFacet is only needed to enable replaceFacet extension -> when this is transferred, we should not create the section anymore (or only, if extension really is used)
			oMetaModelData = {
					entityType: [{
						name: "RootEntityType",
						"com.sap.vocabularies.UI.v1.Facets": [{
							RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
							ID: {
								String: "CollectionFacet_1"
							},
							Label: {
								String: "CollectionFacet 1 (empty)"
							}
						}]
					}],
					entitySet: [{
						name: "RootEntitySet",
						entityType: "RootEntityType"
					}]
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData , "RootEntitySet");

			var oExpected = {
					sections: [{
						additionalData: {
							facetId: "CollectionFacet_1"
						},
						subSections: [{
							additionalData: {
								facetId: "CollectionFacet_1"
							},
							blocks: []
						}]
					}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains a section with a subSection with empty array of blocks");
		}); 

		QUnit.test("fnGetSections : CollectionFacet with 2 ReferenceFacets", function (assert) {
			// be aware: In this case, only 1 subsection with 1 block for a SmartForm with 2 groups must be created (to keep compatibility)
			oMetaModelData = {
					entityType: [{
						name: "RootEntityType",
						navigationProperties: {
							toSubEntity: {
								targetEntityType: "SubEntityType"
							}
						},
						"com.sap.vocabularies.UI.v1.FieldGroup": {
							Label: {
								String: "FieldGroup for RootEntity"
							},
							Data: [{
								RecordType: "com.sap.vocabularies.UI.v1.DataField"
							}]
						},
						"com.sap.vocabularies.UI.v1.Facets": [{
							RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
							ID: {
								String: "CollectionFacet_1"
							},
							Facets: [{
								RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
								ID: {
									String: "ReferenceFacet_1_1"
								},
								Target: {
									AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup"
								}
							}, {
								RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
								ID: {
									String: "ReferenceFacet_1_2"
								},
								Target: {
									AnnotationPath: "toSubEntity/@com.sap.vocabularies.UI.v1.FieldGroup"
								}
							}]
						}]
					}, {
						name: "SubEntityType",
						"com.sap.vocabularies.UI.v1.FieldGroup": {
							Label: {
								String: "FieldGroup for SubEntity"
							},
							Data: [{
								RecordType: "com.sap.vocabularies.UI.v1.DataField"
							}]
						}
					}
					],
					entitySet: [{
						name: "RootEntitySet",
						entityType: "RootEntityType"
					}, {
						name: "SubEntitySet",
						entityType: "SubEntityType"
					}]
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData , "RootEntitySet");

			var oExpected = {
					sections: [{
						additionalData: {
							facetId: "CollectionFacet_1"
						},
						subSections: [{
							additionalData: {
								facetId: "CollectionFacet_1"
							},
							blocks: [{
								additionalData: {
									type: "SmartForm",
									facetId: "CollectionFacet_1"
								},
								controlProperties: {
									id: "CollectionFacet_1::Form"
								},
								aggregations: {
									groups: [{
										additionalData: {
											facetId: "ReferenceFacet_1_1"
										}
									}, {
										additionalData: {
											facetId: "ReferenceFacet_1_2"
										}
									}]
								}
							}]
						}]
					}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains a section, subSection, and block with 2 groups for the 2 reference facets");
		}); 

		QUnit.test("fnGetSections : CollectionFacet with CollectionFacet with ReferenceFacet", function (assert) {
			oMetaModelData = {
					entityType: [{
						name: "RootEntityType",
						"com.sap.vocabularies.UI.v1.FieldGroup": {
							Label: {
								String: "FieldGroup for RootEntity"
							},
							Data: [{
								RecordType: "com.sap.vocabularies.UI.v1.DataField"
							}]
						},
						"com.sap.vocabularies.UI.v1.Facets": [{
							RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
							ID: {
								String: "CollectionFacet_1"
							},
							Facets: [{
								RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
								ID: {
									String: "CollectionFacet_1_1"
								},
								Facets: [{
									RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
									ID: {
										String: "ReferenceFacet_1_1_1"
									},
									Target: {
										AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup"
									}
								}]
							}]
						}]
					}],
					entitySet: [{
						name: "RootEntitySet",
						entityType: "RootEntityType"
					}]
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData , "RootEntitySet");

			var oExpected = {
					sections: [{
						additionalData: {
							facetId: "CollectionFacet_1"
						},
						subSections: [{
							additionalData: {
								facetId: "CollectionFacet_1_1"
							},
							blocks: [{
								additionalData: {
									facetId: "CollectionFacet_1_1",
									type: "SmartForm"
								},
								controlProperties: {
									id: "CollectionFacet_1_1::Form"
								},
								aggregations: {
									groups: [{
										additionalData: {
											facetId: "ReferenceFacet_1_1_1"
										}
									}]
								}
							}]
						}]
					}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains a section for top collection facet, a subSection with block for collection facet on second level, and a group for the reference facet");
		}); 

		QUnit.test("fnGetSections : Separated SmartForms for ReferenceFacets pointing to FieldGroups on 3rd level, if sibling RefernceFacets points to LineItem", function (assert) {
			// todo: better provide a meaningful lineItem (i.e. typically pointing to subEntity. But how should this lineItem be handled? (see also incident...))

			oMetaModelData = {
					entityType: [{
						name: "RootEntityType",
						"com.sap.vocabularies.UI.v1.FieldGroup": {
							Label: {
								String: "FieldGroup for RootEntity"
							},
							Data: [{
								RecordType: "com.sap.vocabularies.UI.v1.DataField"
							}]
						},
						"com.sap.vocabularies.UI.v1.LineItem": [],
						"com.sap.vocabularies.UI.v1.Facets": [{
							RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
							ID: {
								String: "CollectionFacet_1"
							},
							Facets: [{
								RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
								ID: {
									String: "CollectionFacet_1_1"
								},
								Facets: [{
									RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
									ID: {
										String: "ReferenceFacet_1_1_1"
									},
									Target: {
										AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup"
									}
								}, {
									RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
									ID: {
										String: "ReferenceFacet_1_1_2"
									},
									Target: {
										AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup"
									}
								}, {
									RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
									ID: {
										String: "ReferenceFacet_1_1_3"
									},
									Target: {
										AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
									}
								}]
							}]
						}]
					}],
					entitySet: [{
						name: "RootEntitySet",
						entityType: "RootEntityType"
					}]
			};

			oSandbox.stub(oComponentUtils, "getControllerExtensions", Function.prototype);
			oSandbox.stub(oComponentUtils, "isDraftEnabled", Function.prototype);

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData , "RootEntitySet");

			var oExpected = {
					sections: [{
						additionalData: {
							facetId: "CollectionFacet_1"
						},
						subSections: [{
							additionalData: {
								facetId: "CollectionFacet_1_1"
							},
							dummyFormId: undefined,
							blocks: [{
								additionalData: {
									facetId: "ReferenceFacet_1_1_1",
									type: "SmartForm"
								},
								controlProperties: {
									id: "ReferenceFacet_1_1_1::Form"
								},
								aggregations: {
									groups: [{
										additionalData: {
											facetId: "ReferenceFacet_1_1_1"
										}
									}]
								}
							}, {
								additionalData: {
									facetId: "ReferenceFacet_1_1_2",
									type: "SmartForm"
								},
								controlProperties: {
									id: "ReferenceFacet_1_1_2::Form"
								},
								aggregations: {
									groups: [{
										additionalData: {
											facetId: "ReferenceFacet_1_1_2"
										}
									}]
								}
							}, {
								additionalData: {
									facetId: "ReferenceFacet_1_1_3",
									type: "SmartTable"
								}
							}]
						}]
					}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains a section for top collection facet, a subSection for collection facet on second level, and a separated blocks for the reference facets, containing each 1 group if pointing to FieldGroup");
		}); 

		QUnit.test("fnGetSections : facetExtensions", function (assert) {
			oMetaModelData = {
					entityType: [{
						name: "RootEntityType",
						"com.sap.vocabularies.UI.v1.FieldGroup": {
							Label: {
								String: "FieldGroup for RootEntity"
							},
							Data: [{
								RecordType: "com.sap.vocabularies.UI.v1.DataField"
							}]
						},
						"com.sap.vocabularies.UI.v1.Facets": [{
							RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							ID: {
								String: "ReferenceFacet_1"
							},
							Target: {
								AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup"
							}
						}]
					}],
					entitySet: [{
						name: "RootEntitySet",
						entityType: "RootEntityType"
					}]
			};

			oSandbox.stub(oComponentUtils, "getViewExtensions", function () {
				var mResult = {};
				mResult["BeforeFacet|RootEntitySet|ReferenceFacet_1"] = {};
				return mResult;
			}); 

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData , "RootEntitySet");

			var oExpected = {
					sections: [{
						id: "BeforeFacet::RootEntitySet::ReferenceFacet_1::Section",
						additionalData: {
							facetId: "ReferenceFacet_1"
						},
						extensionPointName: "BeforeFacet|RootEntitySet|ReferenceFacet_1",
						extensionPointNamePrefix: "BeforeFacet",
						subSections: [{
							id: "BeforeFacet::RootEntitySet::ReferenceFacet_1::SubSection",
							additionalData: {
								facetId: "ReferenceFacet_1"
							},
							extensionPointName: "BeforeFacet|RootEntitySet|ReferenceFacet_1",
							extensionPointNamePrefix: "BeforeFacet",
							blocks: []
						}]
					}, {
						additionalData: {
							facetId: "ReferenceFacet_1"
						},
						subSections: [{
							additionalData: {
								facetId: "ReferenceFacet_1"
							},
							blocks: [{
								additionalData: {
									facetId: "ReferenceFacet_1",
									type: "SmartForm"
								},
								controlProperties: {
									id: "ReferenceFacet_1::Form"
								},
								aggregations: {
									groups: [{
										additionalData: {
											facetId: "ReferenceFacet_1"
										}
									}]
								}
							}]
						}]
					}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains a section with subSection with no blocks for the extension and the usual section (with subSection and block created by the facet annotation)");

		});

		QUnit.test("fnGetSections : SmartFormExtension", function (assert) {
			oMetaModelData = {
					entityType: [{
						name: "RootEntityType",
						"com.sap.vocabularies.UI.v1.FieldGroup": {
							Label: {
								String: "FieldGroup for RootEntity"
							},
							Data: [{
								RecordType: "com.sap.vocabularies.UI.v1.DataField"
							}]
						},
						"com.sap.vocabularies.UI.v1.Facets": [{
							RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							ID: {
								String: "ReferenceFacet_1"
							},
							Target: {
								AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup"
							}
						}]
					}],
					entitySet: [{
						name: "RootEntitySet",
						entityType: "RootEntityType"
					}]
			};

			oSandbox.stub(oComponentUtils, "getViewExtensions", function () {
				var mResult = {};
				mResult["SmartFormExtension|RootEntitySet|ReferenceFacet_1"] = {};
				return mResult;
			}); 

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData , "RootEntitySet");

			var oExpected = {
					sections: [{
						additionalData: {
							facetId: "ReferenceFacet_1"
						},
						subSections: [{
							additionalData: {
								facetId: "ReferenceFacet_1"
							},
							blocks: [{
								additionalData: {
									facetId: "ReferenceFacet_1",
									type: "SmartForm"
								},
								controlProperties: {
									id: "ReferenceFacet_1::Form"
								},
								aggregations: {
									groups: [{
										additionalData: {
											facetId: "ReferenceFacet_1"
										},
										extensionPointName: "SmartFormExtension|RootEntitySet|ReferenceFacet_1",
										extensionPointNamePrefix: "SmartFormExtension",
									}]
								}
							}]
						}]
					}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains a section, subSection, block, and group for the refernce facet, group including the extension");

		});

		QUnit.test("fnGetSections : SmartFormExtension for broken FieldGroup", function (assert) {
			oMetaModelData = {
					entityType: [{
						name: "RootEntityType",
						"com.sap.vocabularies.UI.v1.Facets": [{
							RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							ID: {
								String: "ReferenceFacet_1"
							},
							Target: {
								AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup"
							}
						}]
					}],
					entitySet: [{
						name: "RootEntitySet",
						entityType: "RootEntityType"
					}]
			};

			oSandbox.stub(oComponentUtils, "getViewExtensions", function () {
				var mResult = {};
				mResult["SmartFormExtension|RootEntitySet|ReferenceFacet_1"] = {};
				return mResult;
			}); 

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData , "RootEntitySet");

			var oExpected = {
					sections: [{
						additionalData: {
							facetId: "ReferenceFacet_1"
						},
						subSections: [{
							additionalData: {
								facetId: "ReferenceFacet_1"
							},
							blocks: [{
								additionalData: {
									facetId: "ReferenceFacet_1",
									type: "SmartForm"
								},
								controlProperties: {
									id: "ReferenceFacet_1::Form"
								},
								aggregations: {
									groups: [{
										extensionPointName: "SmartFormExtension|RootEntitySet|ReferenceFacet_1",
										extensionPointNamePrefix: "SmartFormExtension",
									}]
								}
							}]
						}]
					}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains a section, subSection, block, and group for the extension although the target of reference facet does not exist");

		});

		QUnit.test("fnGetSections : ReferenceFacet point to FieldGroup containing only actions", function (assert) {
			oMetaModelData = {
					entityType: [{
						name: "RootEntityType",
						"com.sap.vocabularies.UI.v1.FieldGroup": {
							Label: {
								String: "FieldGroup for RootEntity"
							},
							Data: [{
								RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
								Action: {
									String: "Action_1"
								},
								Label: {
									String: "Action_1"
								}
							}, {
								RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
								SemanticObject: {
									String: "SemanticObject_2"
								},
								Action: {
									String: "Action_2"
								},
								Label: {
									String: "IntentBasedNavigation_2"
								}
							}]
						},
						"com.sap.vocabularies.UI.v1.Facets": [{
							RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							ID: {
								String: "ReferenceFacet_1"
							},
							Target: {
								AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup"
							}
						}]
					}],
					entitySet: [{
						name: "RootEntitySet",
						entityType: "RootEntityType"
					}]
			};
			oSandbox.stub(oComponentUtils, "getSettings", function() {
				return {};
			});

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData , "RootEntitySet");

			var oExpected = {
					sections: [{
						additionalData: {
							facetId: "ReferenceFacet_1"
						},
						annotations: {
							Facet: {
								annotation: {
									ID: {
										String: "ReferenceFacet_1"
									}
								}
							}
						},
						subSections: [{
							additionalData: {
								facetId: "ReferenceFacet_1"
							},
							annotations: {
								Facet: {
									annotation: {
										ID: {
											String: "ReferenceFacet_1"
										}
									}
								}
							},
							blocks: [],
							actions: [{
								id: "action::Action_1::ReferenceFacet_1::FormAction",
								metaModelPath: "entityType/0/com.sap.vocabularies.UI.v1.FieldGroup/Data/0"
							}, {
								id: "action::SemanticObject_2::Action_2::ReferenceFacet_1::FormAction",
								metaModelPath: "entityType/0/com.sap.vocabularies.UI.v1.FieldGroup/Data/1"
							}]
						}]
					}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains a section, subSection, and action");
		});  


		QUnit.test("fnGetSections : ReferenceFacet point to FieldGroup containing field and action", function (assert) {
			oMetaModelData = {
					entityType: [{
						name: "RootEntityType",
						"com.sap.vocabularies.UI.v1.FieldGroup": {
							Label: {
								String: "FieldGroup for RootEntity"
							},
							Data: [{
								RecordType: "com.sap.vocabularies.UI.v1.DataField"
							},{
								RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
								Action: {
									String: "DataFieldForAction_2"
								},
								Label: {
									String: "DataFieldForAction 2"
								}
							}]
						},
						"com.sap.vocabularies.UI.v1.Facets": [{
							RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							ID: {
								String: "ReferenceFacet_1"
							},
							Target: {
								AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup"
							}
						}]
					}],
					entitySet: [{
						name: "RootEntitySet",
						entityType: "RootEntityType"
					}]
			};
			oSandbox.stub(oComponentUtils, "getSettings", function() {
				return {};
			});

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData , "RootEntitySet");

			var oExpected = {
					sections: [{
						additionalData: {
							facetId: "ReferenceFacet_1"
						},
						annotations: {
							Facet: {
								annotation: {
									ID: {
										String: "ReferenceFacet_1"
									}
								}
							}
						},
						subSections: [{
							additionalData: {
								facetId: "ReferenceFacet_1"
							},
							annotations: {
								Facet: {
									annotation: {
										ID: {
											String: "ReferenceFacet_1"
										}
									}
								}
							},
							blocks: [{
								additionalData: {
									facetId: "ReferenceFacet_1",
									type: "SmartForm"
								},
								controlProperties: {
									id: "ReferenceFacet_1::Form"
								},
								aggregations: {
									groups: [{
										additionalData: {
											facetId: "ReferenceFacet_1"
										}
									}]
								}
							}],
							actions: [{
								id: "action::DataFieldForAction_2::ReferenceFacet_1::FormAction",
								metaModelPath: "entityType/0/com.sap.vocabularies.UI.v1.FieldGroup/Data/1"
							}]
						}]
					}]
			};

			// how to assert, that actions contains only 1 entry?
			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains a section, subSection, block, and action");
		});  

		QUnit.test("fnGetSections : extensionActions for FieldGroup", function (assert) {
			oMetaModelData = {
					entityType: [{
						name: "RootEntityType",
						"com.sap.vocabularies.UI.v1.FieldGroup": {
							Label: {
								String: "FieldGroup for RootEntity"
							}
						},
						"com.sap.vocabularies.UI.v1.Facets": [{
							RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							ID: {
								String: "ReferenceFacet_1"
							},
							Target: {
								AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup"
							}
						}]
					}],
					entitySet: [{
						name: "RootEntitySet",
						entityType: "RootEntityType"
					}]
			};

			oSandbox.stub(oComponentUtils, "getControllerExtensions", function () {
				return {
					Sections: {
						ReferenceFacet_1: {
							Actions: {
								ExtensionAction1: {
									id: "ExtensionAction_1",
									text: "Extension Action Text",
									press: "extensionActionHandler"
								}
							}
						}
					}
				};
			}); 

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData , "RootEntitySet");

			var oExpected = {
					sections: [{
						additionalData: {
							facetId: "ReferenceFacet_1"
						},
						annotations: {
							Facet: {
								annotation: {
									ID: {
										String: "ReferenceFacet_1"
									}
								}
							}
						},
						subSections: [{
							additionalData: {
								facetId: "ReferenceFacet_1"
							},
							annotations: {
								Facet: {
									annotation: {
										ID: {
											String: "ReferenceFacet_1"
										}
									}
								}
							},
							blocks: [],
							actions: [{
								id: "ExtensionAction_1",
								text: "Extension Action Text",
								press: "extensionActionHandler"
							}]
						}]
					}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "Extension actions refering to fieldgroup are added to subSection");
		});

		QUnit.test("fnGetSections : extensionActions for LineItem", function (assert) {
			oMetaModelData = {
					entityType: [{
						name: "RootEntityType",
						"com.sap.vocabularies.UI.v1.LineItem": [],
						"com.sap.vocabularies.UI.v1.Facets": [{
							RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							ID: {
								String: "ReferenceFacet_1"
							},
							Target: {
								AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
							}
						}]
					}],
					entitySet: [{
						name: "RootEntitySet",
						entityType: "RootEntityType"
					}]
			};

			oSandbox.stub(oComponentUtils, "getControllerExtensions", function () {
				return {
					Sections: {
						ReferenceFacet_1: {
							Actions: {
								ExtensionAction1: {
									id: "ExtensionAction_1",
									text: "Extension Action Text",
									press: "extensionActionHandler"
								}
							}
						}
					}
				};
			}); 
			oSandbox.stub(oComponentUtils, "isDraftEnabled", Function.prototype);

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData , "RootEntitySet");

			var oExpected = {
					sections: [{
						additionalData: {
							facetId: "ReferenceFacet_1"
						},
						annotations: {
							Facet: {
								annotation: {
									ID: {
										String: "ReferenceFacet_1"
									}
								}
							}
						},
						subSections: [{
							additionalData: {
								facetId: "ReferenceFacet_1"
							},
							annotations: {
								Facet: {
									annotation: {
										ID: {
											String: "ReferenceFacet_1"
										}
									}
								}
							},
							actions: []
						}]
					}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "Extension actions refering to lineItem are not added to subSection");
		});

		// Identification is similar to FieldGroup - except that it directly contains the data
		QUnit.test("fnGetSections : ReferenceFacet on top level pointing to Identification", function (assert) {
			oMetaModelData = {
					entityType: [{
						name: "RootEntityType",
						"com.sap.vocabularies.UI.v1.Identification": [{
							RecordType: "com.sap.vocabularies.UI.v1.DataField"
						}],
						"com.sap.vocabularies.UI.v1.Facets": [{
							RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							ID: {
								String: "ReferenceFacet_1"
							},
							Target: {
								AnnotationPath: "@com.sap.vocabularies.UI.v1.Identification"
							}
						}]
					}],
					entitySet: [{
						name: "RootEntitySet",
						entityType: "RootEntityType"
					}]
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData , "RootEntitySet");

			var oExpected = {
					sections: [{
						additionalData: {
							facetId: "ReferenceFacet_1"
						},
						annotations: {
							Facet: {
								annotation: {
									ID: {
										String: "ReferenceFacet_1"
									}
								}
							}
						},
						subSections: [{
							additionalData: {
								facetId: "ReferenceFacet_1"
							},
							annotations: {
								Facet: {
									annotation: {
										ID: {
											String: "ReferenceFacet_1"
										}
									}
								}
							},
							blocks: [{
								additionalData: {
									facetId: "ReferenceFacet_1",
									type: "SmartForm"
								},
								controlProperties: {
									id: "ReferenceFacet_1::Form"
								},
								aggregations: {
									groups: [{
										additionalData: {
											facetId: "ReferenceFacet_1"
										},
										targetAnnotation: [{
											RecordType: "com.sap.vocabularies.UI.v1.DataField"
										}]
									}]
								}
							}]
						}]
					}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains a section, subSection, block, and group all created by the facet annotation; block points to correct target annotation");
		});

		QUnit.test("fnGetSections : smart table's variant management and persistency key", function (assert) {
			oMetaModelData = {
				entityType: [{
					name: "RootEntityType",
					"com.sap.vocabularies.UI.v1.LineItem": [],
					"com.sap.vocabularies.UI.v1.Facets": [{
						RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
						ID: {
							String: "CollectionFacet_1"
						},
						Facets: [{
							RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
							ID: {
								String: "CollectionFacet_1_1"
							},
							Facets: [{
								RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
								ID: {
									String: "ReferenceFacet_1_1_3"
								},
								Target: {
									AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
								}
							}]
						}]
					}]
				}],
				entitySet: [{
					name: "RootEntitySet",
					entityType: "RootEntityType"
				}]
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");

			var oExpected = {
				sections: [{
					subSections: [{
						blocks: [{
							tableSettings: {
								variantManagement: true,
								persistencyKeyState: "New"
							}
						}]
					}]
				}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains the correct value of the corresponding smart\
			 table's variant management and peristency key when variant management is not defined in the manifest");
		});

		QUnit.test("fnGetSections : smart table's variant management and persistency key", function (assert) {
			oMetaModelData = {
				entityType: [{
					name: "RootEntityType",
					"com.sap.vocabularies.UI.v1.LineItem": [],
					"com.sap.vocabularies.UI.v1.Facets": [{
						RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
						ID: {
							String: "CollectionFacet_1"
						},
						Facets: [{
							RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
							ID: {
								String: "CollectionFacet_1_1"
							},
							Facets: [{
								RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
								ID: {
									String: "ReferenceFacet_1_1_3"
								},
								Target: {
									AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
								}
							}]
						}]
					}]
				}],
				entitySet: [{
					name: "RootEntitySet",
					entityType: "RootEntityType"
				}]
			};
			var oSettings = {
				tableSettings: {
					variantManagement: true
				}
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, oSettings, oDeviceModelData, "RootEntitySet");

			var oExpected = {
				sections: [{
					subSections: [{
						blocks: [{
							tableSettings: {
								variantManagement: true,
								persistencyKeyState: "Retain"
							}
						}]
					}]
				}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains the correct value of the corresponding smart\
			 table's variant management and peristency key when variant management is enabled in the manifest");
		});

		QUnit.test("fnGetSections : smart table's variant management and persistency key", function (assert) {
			oMetaModelData = {
				entityType: [{
					name: "RootEntityType",
					"com.sap.vocabularies.UI.v1.LineItem": [],
					"com.sap.vocabularies.UI.v1.Facets": [{
						RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
						ID: {
							String: "CollectionFacet_1"
						},
						Facets: [{
							RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
							ID: {
								String: "CollectionFacet_1_1"
							},
							Facets: [{
								RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
								ID: {
									String: "ReferenceFacet_1_1_3"
								},
								Target: {
									AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
								}
							}]
						}]
					}]
				}],
				entitySet: [{
					name: "RootEntitySet",
					entityType: "RootEntityType"
				}]
			};
			var oSettings = {
				tableSettings: {
					variantManagement: false
				}
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, oSettings, oDeviceModelData, "RootEntitySet");

			var oExpected = {
				sections: [{
					subSections: [{
						blocks: [{
							tableSettings: {
								variantManagement: true,
								persistencyKeyState: "Remove"
							}
						}]
					}]
				}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains the correct value of the corresponding smart\
			 table's variant management and peristency key when variant management is disabled in the manifest");
		});

		QUnit.test("fnGetSections : smart chart's variant management and persistency key", function (assert) {
			oMetaModelData = {
				entityType: [{
					name: "RootEntityType",
					"com.sap.vocabularies.UI.v1.Chart": [],
					"com.sap.vocabularies.UI.v1.Facets": [{
						RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
						ID: {
							String: "CollectionFacet_1"
						},
						Facets: [{
							RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
							ID: {
								String: "CollectionFacet_1_1"
							},
							Facets: [{
								RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
								ID: {
									String: "ReferenceFacet_1_1_3"
								},
								Target: {
									AnnotationPath: "@com.sap.vocabularies.UI.v1.Chart"
								}
							}]
						}]
					}]
				}],
				entitySet: [{
					name: "RootEntitySet",
					entityType: "RootEntityType"
				}]
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");

			var oExpected = {
				sections: [{
					subSections: [{
						blocks: [{
							chartSettings: {
								variantManagement: true,
								persistencyKeyState: "New"
							}
						}]
					}]
				}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains the correct value of the corresponding smart\
			 chart's variant management and peristency key when variant management is not defined in the manifest");
		});

		QUnit.test("fnGetSections : smart chart's variant management and persistency key", function (assert) {
			oMetaModelData = {
				entityType: [{
					name: "RootEntityType",
					"com.sap.vocabularies.UI.v1.Chart": [],
					"com.sap.vocabularies.UI.v1.Facets": [{
						RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
						ID: {
							String: "CollectionFacet_1"
						},
						Facets: [{
							RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
							ID: {
								String: "CollectionFacet_1_1"
							},
							Facets: [{
								RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
								ID: {
									String: "ReferenceFacet_1_1_3"
								},
								Target: {
									AnnotationPath: "@com.sap.vocabularies.UI.v1.Chart"
								}
							}]
						}]
					}]
				}],
				entitySet: [{
					name: "RootEntitySet",
					entityType: "RootEntityType"
				}]
			};
			var oSettings = {
				chartSettings: {
					variantManagement: true
				}
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, oSettings, oDeviceModelData, "RootEntitySet");

			var oExpected = {
				sections: [{
					subSections: [{
						blocks: [{
							chartSettings: {
								variantManagement: true,
								persistencyKeyState: "Retain"
							}
						}]
					}]
				}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains the correct value of the corresponding smart\
			chart's variant management and peristency key when variant management is enabled in the manifest");
		});

		QUnit.test("fnGetSections : smart chart's variant management and persistency key", function (assert) {
			oMetaModelData = {
				entityType: [{
					name: "RootEntityType",
					"com.sap.vocabularies.UI.v1.Chart": [],
					"com.sap.vocabularies.UI.v1.Facets": [{
						RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
						ID: {
							String: "CollectionFacet_1"
						},
						Facets: [{
							RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
							ID: {
								String: "CollectionFacet_1_1"
							},
							Facets: [{
								RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
								ID: {
									String: "ReferenceFacet_1_1_3"
								},
								Target: {
									AnnotationPath: "@com.sap.vocabularies.UI.v1.Chart"
								}
							}]
						}]
					}]
				}],
				entitySet: [{
					name: "RootEntitySet",
					entityType: "RootEntityType"
				}]
			};
			var oSettings = {
				chartSettings: {
					variantManagement: false
				}
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, oSettings, oDeviceModelData, "RootEntitySet");

			var oExpected = {
				sections: [{
					subSections: [{
						blocks: [{
							chartSettings: {
								variantManagement: true,
								persistencyKeyState: "Remove"
							}
						}]
					}]
				}]
			};

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "TemplateSpecific contains the correct value of the corresponding smart\
			chart's variant management and peristency key when variant management is disabled in the manifest");
		});

		QUnit.test("fnGetPageLevelActions : extension action with 'logicalAction: Save'", function (assert) {
			oSandbox.stub(oComponentUtils, "getControllerExtensions", function () {
				return {
					Header: {
						Actions: {
							ExtensionAction: {
								id: "ExtensionAction",
								text: "Extension Action Text",
								press: "extensionActionHandler",
								logicalAction: "Save"
							}
						}
					}
				};
			});
			var oExpected = {
				pageLevelActions: {
					commandExecution: {
						Save: {
							action: "Save",
							ariaHasPopup: "None",
							callbackName: "extensionActionHandler",
							determining: true,
							id: "ExtensionAction",
							isStandardAction: false,
							press: "cmd:Save",
							text: "Extension Action Text",
							type: "Emphasized",
							visible: "{ui>/editable}"
						}
					},
					extensionActions: []
				}
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "Extension actions overriding a footer standard action i.e. 'Save' has correct details");
		});

		QUnit.test("fnGetPageLevelActions : save action in mobile device in a non draft app", function (assert) {
			oSandbox.stub(oDeviceModelData.system, "phone").returns(true);
			oSandbox.stub(oComponentUtils, "isDraftEnabled").returns(false);
			var oExpected = {
				pageLevelActions: {
					commandExecution: {
						Save: {
							action: "Save",
							callbackName: "._templateEventHandlers.onSave",
							determining: true,
							id: "save",
							isStandardAction: true,
							press: "cmd:Save",
							text: "{= ${ui>/createMode} ? ${i18n>CREATE} : ${i18n>SAVE}}",
							type: "Emphasized",
							visible: "{ui>/editable}"
						}
					},
					extensionActions: []
				}
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet", {});

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "save action in mobile device in non draft app");
		});

		QUnit.test("fnGetPageLevelActions : save action in tablet device in a non draft app", function (assert) {
			oSandbox.stub(oDeviceModelData.system, "tablet").returns(true);
			oSandbox.stub(oComponentUtils, "isDraftEnabled").returns(false);
			var oExpected = {
				pageLevelActions: {
					commandExecution: {
						Save: {
							action: "Save",
							callbackName: "._templateEventHandlers.onSave",
							determining: true,
							id: "save",
							isStandardAction: true,
							press: "cmd:Save",
							text: "{= ${ui>/createMode} ? ${i18n>CREATE} : ${i18n>SAVE}}",
							type: "Emphasized",
							visible: "{ui>/editable}"
						}
					},
					extensionActions: []
				}
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet", {});

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "save action in tablet device in non draft app");
		});

		QUnit.test("fnGetPageLevelActions : extension action with 'logicalAction: Delete'", function (assert) {
			oSandbox.stub(oComponentUtils, "getControllerExtensions", function () {
				return {
					Header: {
						Actions: {
							ExtensionAction: {
								id: "ExtensionAction",
								text: "Extension Action Text",
								press: "extensionActionHandler",
								logicalAction: "Delete"
							}
						}
					}
				};
			});
			var oExpected = {
				pageLevelActions: {
					commandExecution: {
						Delete: {
							action: "Delete",
							ariaHasPopup: "None",
							callbackName: "extensionActionHandler",
							determining: false,
							id: "action::ExtensionAction",
							isStandardAction: false,
							press: "cmd:Delete",
							text: "Extension Action Text",
							type: "Default"
						}
					},
					extensionActions: []
				}
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "Extension actions overriding a header standard action like 'Delete' has correct details");
		});

		QUnit.test("Page level custom actions with command", function (assert) {
			oSandbox.stub(oComponentUtils, "getControllerExtensions", function () {
				return {
					Header: {
						Actions: {
							HeaderExtensionAction: {
								id: "HeaderExtensionAction",
								text: "HeaderExension Action Text",
								press: "HeaderExtensionActionHandler",
								command: "HeaderCommand"
							},
							FooterExtensionAction: {
								id: "FooterExtensionAction",
								text: "FooterExension Action Text",
								press: "FooterExtensionActionHandler",
								determining: true,
								command: "FooterCommand"
							}
						}
					}
				};
			});
			var oExpected = {
				pageLevelActions: {
					commandExecution: {
						"action::HeaderExtensionAction": {
							action: "HeaderCommand",
							callbackName: "HeaderExtensionActionHandler",
							id: "action::HeaderExtensionAction"
						},
						FooterExtensionAction: {
							action: "FooterCommand",
							callbackName: "FooterExtensionActionHandler",
							id: "FooterExtensionAction"
						}
					},
					extensionActions: [{
						command: "HeaderCommand",
						id: "action::HeaderExtensionAction",
						press: "cmd:HeaderCommand",
						text: "HeaderExension Action Text"
					}, {
						command: "FooterCommand",
						determining: true,
						id: "FooterExtensionAction",
						press: "cmd:FooterCommand",
						text: "FooterExension Action Text",
					}]
				}
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "Page level extension actions (header and footer) with command has correct details");
		});

		QUnit.test("Table level custom action with command", function (assert) {
			oMetaModelData = {
				entityType: [{
					name: "RootEntityType",
					"com.sap.vocabularies.UI.v1.LineItem": [],
					"com.sap.vocabularies.UI.v1.Facets": [{
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
						ID: {
							String: "ReferenceFacet_1"
						},
						Target: {
							AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
						}
					}]
				}],
				entitySet: [{
					name: "RootEntitySet",
					entityType: "RootEntityType"
				}]
			};
			oSandbox.stub(oComponentUtils, "getControllerExtensions", function () {
				return {
					Sections: {
						ReferenceFacet_1: {
							Actions: {
								ExtensionAction: {
									id: "ExtensionAction",
									text: "Extension Action Text",
									press: "extensionActionHandler",
									command: "ExtensionCommand"
								}
							}
						}
					}
				};
			});
			var oExpected = {
				sections: [{
					subSections: [{
						blocks: [{
							tableSettings: {
								commandExecution: {
									ExtensionAction: {
										action: "ExtensionCommand",
										callbackName: "extensionActionHandler",
										id: "ExtensionAction"
									}
								},
								extensionActions: [{
									command: "ExtensionCommand",
									enabled: "{_templPriv>/generic/listCommons/breakoutActionsEnabled/ExtensionAction/enabled}",
									id: "ExtensionAction",
									press: "cmd:ExtensionCommand",
									text: "Extension Action Text"
								}]
							}
						}]
					}]
				}]
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "Table level extension action with command has correct details");
		});

		QUnit.test("Smart form level custom action with command", function (assert) {
			oMetaModelData = {
				entityType: [{
					name: "RootEntityType",
					"com.sap.vocabularies.UI.v1.FieldGroup": {},
					"com.sap.vocabularies.UI.v1.Facets": [{
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
						ID: {
							String: "ReferenceFacet_1"
						},
						Target: {
							AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup"
						}
					}]
				}],
				entitySet: [{
					name: "RootEntitySet",
					entityType: "RootEntityType"
				}]
			};
			oSandbox.stub(oComponentUtils, "getControllerExtensions", function () {
				return {
					Sections: {
						ReferenceFacet_1: {
							Actions: {
								ExtensionAction: {
									id: "ExtensionAction",
									text: "Extension Action Text",
									press: "extensionActionHandler",
									command: "ExtensionCommand"
								}
							}
						}
					}
				};
			});
			var oExpected = {
				sections: [{
					subSections: [{
						actions: [{
							command: "ExtensionCommand",
							id: "ExtensionAction",
							press: "extensionActionHandler",
							text: "Extension Action Text"
						}]
					}]
				}]
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "Smart form level extension action with command has correct details");
		});

		QUnit.test("Page level DataFieldForAction with command", function (assert) {
			oMetaModelData = {
				entityType: [{
					name: "RootEntityType",
					"com.sap.vocabularies.UI.v1.Identification": [{
						RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Action: {
							String: "STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities/C_STTA_SalesOrder_WD_20Setopportunityid"
						}
					}, {
						RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Action: {
							String: "STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities/C_STTA_SalesOrder_WD_20SetDeterminingopportunityid"
						},
						Determining: {
							Bool: "true"
						}
					}]
				}],
				entitySet: [{
					name: "RootEntitySet",
					entityType: "RootEntityType"
				}]
			};
			oSandbox.stub(oComponentUtils, "getSettings", function () {
				return {
					annotatedActions: {
						C_STTA_SalesOrder_WD_20Setopportunityid: {
							command: "OPSetOpportunityCommand"
						},
						C_STTA_SalesOrder_WD_20SetDeterminingopportunityid: {
							command: "OPSetDeterminingOpportunityCommand"
						}
					}
				};
			});
			oSandbox.stub(AnnotationHelper, "getStableIdPartFromDataField").returns("OppActionId");
			oSandbox.stub(AHActionButtons, "getCallAction").returns("oppIdCallback");
			oSandbox.stub(AnnotationHelper, "getStableIdPartForDatafieldActionButton").returns("OppDeterminingActionId");
			var oExpected = {
				pageLevelActions: {
					commandExecution: {
						"action::OppActionId": {
							action: "OPSetOpportunityCommand",
							callbackName: "oppIdCallback",
							id: "action::OppActionId",
							annotatedAction: true
						},
						"OppDeterminingActionId::Determining": {
							id: "OppDeterminingActionId::Determining",
							action: "OPSetDeterminingOpportunityCommand",
							callbackName: "._templateEventHandlers.onDeterminingDataFieldForAction",
							annotatedAction: true
						}
					}
				}
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "Page level DataFieldForAction (header and footer) with command has correct details");
		});

		QUnit.test("Table level DataFieldForAction and DataFieldForIBN with command", function (assert) {
			oMetaModelData = {
				entityType: [{
					name: "RootEntityType",
					"com.sap.vocabularies.UI.v1.LineItem": [{
						RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"
					}, {
						RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"
					}],
					"com.sap.vocabularies.UI.v1.Facets": [{
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
						ID: {
							String: "ReferenceFacet_1"
						},
						Target: {
							AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
						}
					}]
				}],
				entitySet: [{
					name: "RootEntitySet",
					entityType: "RootEntityType"
				}]
			};
			oSandbox.stub(oComponentUtils, "getToolbarDataFieldForActionCommandDetails").returns({
				id: "AnnotatedActionId",
				action: "AnnotatedCommand",
				callbackName: "AnnotatedCallback",
				annotatedAction: true
			});
			oSandbox.stub(oComponentUtils, "getToolbarDataFieldForIBNCommandDetails").returns({
				id: "OutboundActionId",
				action: "OutboundCommand",
				callbackName: "OutboundCallback",
				outboundAction: true
			});
			var oExpected = {
				sections: [{
					subSections: [{
						blocks: [{
							tableSettings: {
								commandExecution: {
									AnnotatedActionId: {
										action: "AnnotatedCommand",
										callbackName: "AnnotatedCallback",
										id: "AnnotatedActionId",
										annotatedAction: true
									},
									OutboundActionId: {
										id: "OutboundActionId",
										action: "OutboundCommand",
										callbackName: "OutboundCallback",
										outboundAction: true
									}
								}
							}
						}]
					}]
				}]
			};
			
			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "Table level DataFieldForAction and DataFieldForIBN with command has correct details");
		});

		QUnit.test("Smart form level DataFieldForAction and DataFieldForIBN with command", function (assert) {
			oMetaModelData = {
				entityType: [{
					name: "RootEntityType",
					"com.sap.vocabularies.UI.v1.FieldGroup": {
						Label: {
							String: "FieldGroup for RootEntity"
						},
						Data: [{
							RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
							Action: {
								String: "STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities/C_STTA_SalesOrder_WD_20Setopportunityid"
							},
							Label: {
								String: "Set Opportunity Id"
							}
						}, {
							RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
							SemanticObject: {
								String: "SemanticObject"
							},
							Action: {
								String: "Action"
							},
							Label: {
								String: "IntentBasedNavigation"
							}
						}]
					},
					"com.sap.vocabularies.UI.v1.Facets": [{
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
						ID: {
							String: "ReferenceFacet_1"
						},
						Target: {
							AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup"
						}
					}]
				}],
				entitySet: [{
					name: "RootEntitySet",
					entityType: "RootEntityType"
				}]
			};
			oSandbox.stub(oComponentUtils, "getOutboundNavigationIntent").returns({
				action: "Action",
				semanticObject: "SemanticObject"
			});
			oSandbox.stub(oComponentUtils, "getSettings", function () {
				return {
					annotatedActions: {
						C_STTA_SalesOrder_WD_20Setopportunityid: {
							command: "OPSetOpportunityCommand"
						}
					},
					outbounds: {
						Navigation: {
							command: "NavigationCommand"
						}
					}
				};
			});
			var sActionId = "action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setopportunityid::ReferenceFacet_1::FormAction";
			var oExpected = {
				sections: [{
					subSections: [{
						actions: [{
							action: undefined,
							actionPress: "cmd:OPSetOpportunityCommand",
							command: "OPSetOpportunityCommand",
							id: sActionId,
							metaModelPath: "entityType/0/com.sap.vocabularies.UI.v1.FieldGroup/Data/0",
							press: "._templateEventHandlers.onCallAction('STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities/C_STTA_SalesOrder_WD_20Setopportunityid', '" + sActionId + "', '')",
							semanticObject: undefined
						}, {
							action: "Action",
							actionPress: "cmd:NavigationCommand",
							command: "NavigationCommand",
							id: "action::SemanticObject::Action::ReferenceFacet_1::FormAction",
							metaModelPath: "entityType/0/com.sap.vocabularies.UI.v1.FieldGroup/Data/1",
							press: "._templateEventHandlers.onDataFieldForIntentBasedNavigation",
							semanticObject: "SemanticObject"
						}]
					}]
				}]
			};
			
			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");

			fnAssertExpectedPropertiesDeep(assert, oTemplateSpecificParameters, oExpected, "Smart form level DataFieldForAction and DataFieldForIBN with command has correct details");
		});

		QUnit.test("Test for paste button visibility", function (assert) {
			// Initial setup
			var oRootEntitySet = {
				name: "RootEntitySet",
				entityType: "RootEntityType"
			};

			var oRootEntityType = {
				name: "RootEntityType",
				navigationProperties: {
					to_Child: {
						targetEntityType: "ChildEntityType",
						targetEntitySet: "ChildEntitySet"
					}
				},
				properties: [
					{
						name: "Create_mc",
						type: "Edm.Boolean"
					},
					{
						name: "Update_mc",
						type: "Edm.Boolean"
					}
				],
				"com.sap.vocabularies.UI.v1.Facets": [{
					RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
					ID: {
						String: "ReferenceFacet_1"
					},
					Target: {
						AnnotationPath: "to_Child/@com.sap.vocabularies.UI.v1.LineItem"
					}
				}]
			};

			var oChildEntitySet = {
				name: "ChildEntitySet",
				entityType: "ChildEntityType"
			};

			var oChildEntityType = {
				name: "ChildEntityType",
				properties: [
					{
						name: "Create_child_mc",
						type: "Edm.Boolean"
					},
					{
						name: "Update_child_mc",
						type: "Edm.Boolean"
					}
				],
				"com.sap.vocabularies.UI.v1.LineItem": [],	
			}


			oMetaModelData = {
				entitySet: [oRootEntitySet, oChildEntitySet],
				entityType: [oRootEntityType, oChildEntityType]
			};

			oSandbox.stub(AHModel, "isMultiple").returns(true);

			// Case 1: Without any navigation or section level restrictions
			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");
			var vShowPasteButton = oTemplateSpecificParameters.sections[0].subSections[0].blocks[0].tableSettings.vShowPasteButton;
			var vExpectedValue = "{ui>/editable}";
			assert.equal(vShowPasteButton, vExpectedValue, "When there's no insert or update restrictions, binding expression should contain only the object page's editable property");

			// Case 2: On parent entity set's navigation restrictions, both insertable and updatable are restricted by 'path' 
			oRootEntitySet["Org.OData.Capabilities.V1.NavigationRestrictions"] = {
				"RestrictedProperties": [
					{
						"InsertRestrictions": {
							"Insertable": {
								"Path": "Create_mc"
							}
						},
						"UpdateRestrictions": {
							"Updatable": {
								"Path": "Update_mc"
							}
						},
						"NavigationProperty": {
							"NavigationPropertyPath": "to_Child"
						}
					}
				]
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");
			var vShowPasteButton = oTemplateSpecificParameters.sections[0].subSections[0].blocks[0].tableSettings.vShowPasteButton;
			var vExpectedValue = "{= ${ui>/editable} && ( ${Create_mc} || ${Update_mc} )}";
			assert.equal(vShowPasteButton, vExpectedValue, "When insertable and updatable are restricted by path, binding expression should contain both the restricted paths");

			// Case 3: On parent entity set's navigation restrictions, one is "Path" and another one is boolean "true"
			oRootEntitySet["Org.OData.Capabilities.V1.NavigationRestrictions"] = {
				"RestrictedProperties": [
					{
						"InsertRestrictions": {
							"Insertable": {
								"Path": "Create_mc"
							}
						},
						"UpdateRestrictions": {
							"Updatable": {
								"Bool": "true"
							}
						},
						"NavigationProperty": {
							"NavigationPropertyPath": "to_Child"
						}
					}
				]
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");
			var vShowPasteButton = oTemplateSpecificParameters.sections[0].subSections[0].blocks[0].tableSettings.vShowPasteButton;
			var vExpectedValue = "{ui>/editable}";
			assert.equal(vShowPasteButton, vExpectedValue, "The binding expression should only contain object page's editable property");

			// Case 4: On parent entity set's navigation restrictions, one is "Path" and another one is boolean "false"
			oRootEntitySet["Org.OData.Capabilities.V1.NavigationRestrictions"] = {
				"RestrictedProperties": [
					{
						"InsertRestrictions": {
							"Insertable": {
								"Bool": "false"
							}
						},
						"UpdateRestrictions": {
							"Updatable": {
								"Path": "Update_mc"
							}
						},
						"NavigationProperty": {
							"NavigationPropertyPath": "to_Child"
						}
					}
				]
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");
			var vShowPasteButton = oTemplateSpecificParameters.sections[0].subSections[0].blocks[0].tableSettings.vShowPasteButton;
			var vExpectedValue = "{= ${ui>/editable} && ( ${Update_mc} )}";
			assert.equal(vShowPasteButton, vExpectedValue, "The binding expression should contain editable property and the updatable path");

			// Case 5: On parent entity set's navigation restrictions, both insertable and updatable have boolean value "false"
			oRootEntitySet["Org.OData.Capabilities.V1.NavigationRestrictions"] = {
				"RestrictedProperties": [
					{
						"InsertRestrictions": {
							"Insertable": {
								"Bool": "false"
							}
						},
						"UpdateRestrictions": {
							"Updatable": {
								"Bool": "false"
							}
						},
						"NavigationProperty": {
							"NavigationPropertyPath": "to_Child"
						}
					}
				]
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");
			var vShowPasteButton = oTemplateSpecificParameters.sections[0].subSections[0].blocks[0].tableSettings.vShowPasteButton;
			var vExpectedValue = false;
			assert.equal(vShowPasteButton, vExpectedValue, "As both insertable and updatable are not supported by navigation restriction, paste shouldn't be supported. So, the expected value is false");

			// Case 6: On section level restrictions, both insertable and updatable have boolean value "false"
			oRootEntitySet["Org.OData.Capabilities.V1.NavigationRestrictions"] = null;
			oChildEntitySet["Org.OData.Capabilities.V1.InsertRestrictions"] = {
				"Insertable": {
					"Bool": "false"
				}
			};
			oChildEntitySet["Org.OData.Capabilities.V1.UpdateRestrictions"] = {
				"Updatable": {
					"Bool": "false"
				}
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");
			var vShowPasteButton = oTemplateSpecificParameters.sections[0].subSections[0].blocks[0].tableSettings.vShowPasteButton;
			var vExpectedValue = false;
			assert.equal(vShowPasteButton, vExpectedValue, "As both insertable and updatable are not supported by section level restriction, paste shouldn't be supported. So, the expected value is false");

			// Case 7: On section level restrictions, both insertable and updatable are bounded by path
			oRootEntitySet["Org.OData.Capabilities.V1.NavigationRestrictions"] = null;
			oChildEntitySet["Org.OData.Capabilities.V1.InsertRestrictions"] = {
				"Insertable": {
					"Path": "Create_child_mc"
				}
			};
			oChildEntitySet["Org.OData.Capabilities.V1.UpdateRestrictions"] = {
				"Updatable": {
					"Path": "Update_child_mc"
				}
			};

			var oTemplateSpecificParameters = sut.getTemplateSpecificParameters(oComponentUtils, oMetaModel, {}, oDeviceModelData, "RootEntitySet");
			var vShowPasteButton = oTemplateSpecificParameters.sections[0].subSections[0].blocks[0].tableSettings.vShowPasteButton;
			var vExpectedValue = "{ui>/editable}";
			assert.equal(vShowPasteButton, vExpectedValue, "Should ignore the paths on section level restrictions. The binding expression should only contain the object page's editable property");

		});
		/*
		 * Add a test for separation of blocks and moreBlocks
		 * Remark: On the first 2 levels of our result hierarchy, we use naming according to the controls we put to the default aggregation of the control above
		 * On the third level, we use two different aggregations (blocks and moreBlocks) of the parent control (SubSection), and their names in our hierarchy
		 * Should we unify this?
		 * - always using the aggregation name would mean to use "content" on the first two levels, which is not really significant
		 * - always using the control names would lead to unwanted separation of different controls used on the third level (at least SmartForm, SmartTable, SmartChart)
		 */


	});
});