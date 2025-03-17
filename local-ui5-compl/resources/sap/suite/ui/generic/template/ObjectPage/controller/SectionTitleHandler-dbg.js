sap.ui.define(["sap/ui/base/Object", "sap/base/util/extend", "sap/suite/ui/generic/template/genericUtilities/controlHelper", "sap/ui/core/library",
		"sap/suite/ui/generic/template/genericUtilities/FeLogger"
	], function(BaseObject, extend, controlHelper, SapCoreLibrary, FeLogger) {
		"use strict";

		var STYLE_CLASS_FOR_ADJUSTMENT = "sapUiTableOnObjectPageAdjustmentsForSection";
		var sClassName = "ObjectPage.controller.SectionTitleHandler";
		var oLogger = new FeLogger(sClassName).getLogger();

		function getMethods(oController, oObjectPage) {
			
			var oViewPropertiesModel = oController.getOwnerComponent().getModel("_templPrivView");
			
			var mSubSectionTitleInfo = Object.create(null);

			var oAppComponent = oController.getOwnerComponent().getAppComponent();
			
			oObjectPage.getSections().forEach(function(oSection){
				var aSubSections = oSection.getSubSections();
				if (aSubSections.length === 1){
					var oSingleSubSection = aSubSections[0];
					var sSubSectionId = oSingleSubSection.getId();
					mSubSectionTitleInfo[sSubSectionId] = {
						isStaticallySingleChild: true	
					};
				}
			});
			
			function fnSetAsTitleOwner(oControl, bIsStandardSection) {
				// If the manifest setting is set, then the title of the section will not be adjusted

				if (!oAppComponent.getMergeObjectPageSectionTitle()) {
					oLogger.warning("Title of the section will not be adjusted as the manifest setting \"mergeObjectPageSectionTitle\" is set.");
					return;
				}

				var oSubSection;
				for (var oTestControl = oControl; oTestControl; oTestControl = controlHelper.getParent(oTestControl)){
					if (controlHelper.isObjectPageSubSection(oTestControl)){
						if (oTestControl === oControl){
							var oTitleInfoToBeCleared = mSubSectionTitleInfo[oControl.getId()];
							if (oTitleInfoToBeCleared && oTitleInfoToBeCleared.titleOwner){
								oTitleInfoToBeCleared.titleOwner.reset();
							}
							return;
						}
						oSubSection = oTestControl;
						break;
					}
				}
				
				if (bIsStandardSection && (!oSubSection || oSubSection.getBlocks().concat(oSubSection.getMoreBlocks()).length > 1)){
					return;
				}
				var oSection = oSubSection.getParent();
				var aSubSections = oSection.getSubSections();
				var sSubSectionId = oSubSection.getId();
				var oTitleInfo = mSubSectionTitleInfo[sSubSectionId];
				if (oTitleInfo){
					if (oTitleInfo.titleOwner){
						oTitleInfo.titleOwner.reset();
					}
				} else {
					oTitleInfo = { };
					mSubSectionTitleInfo[sSubSectionId] = oTitleInfo;
				}
				var oSubSectionTitleBinding = oViewPropertiesModel.bindProperty("/#" + oSubSection.getId() + "/title");
				var oControlMetadata = oControl.getMetadata();
				var bHasHeader = oControlMetadata.hasProperty("header");
				var setHeader = (bHasHeader ? oControl.setHeader : oControl.setText).bind(oControl);
				var sCurrentHeader = bHasHeader ? oControl.getHeader() : oControl.getText();
				var bHasHeaderLevel = oControlMetadata.hasProperty("headerLevel");
				var setHeaderLevel = (bHasHeaderLevel ? oControl.setHeaderLevel : oControl.setLevel).bind(oControl);
				var bHasHeaderStyle = oControlMetadata.hasProperty("headerStyle");
				var setHeaderStyle = (bHasHeaderStyle ? oControl.setHeaderStyle : oControl.setTitleStyle).bind(oControl);
				var sCurrentHeaderLevel = bHasHeaderLevel ?  oControl.getHeaderLevel() : oControl.getLevel();
				var sCurrentHeaderStyle = bHasHeaderStyle ?  oControl.getHeaderStyle() : oControl.getTitleStyle();
				var fnAdjustTitle = function(){
					setHeader(oSubSectionTitleBinding.getValue());
					oSubSection.setShowTitle(false);
					oSubSection.setTitleLevel(SapCoreLibrary.TitleLevel.Auto);
					oSection.addStyleClass(STYLE_CLASS_FOR_ADJUSTMENT);
				};
				oSubSectionTitleBinding.attachChange(fnAdjustTitle);
				oTitleInfo.titleOwner = {
					reset: function(){
						setHeader(sCurrentHeader);
						setHeaderLevel(sCurrentHeaderLevel);
						setHeaderStyle(sCurrentHeaderStyle);
						oSection.removeStyleClass(STYLE_CLASS_FOR_ADJUSTMENT);
						oSubSection.setShowTitle(true);
						oSubSection.setTitleLevel(SapCoreLibrary.TitleLevel.H4);
						if (oTitleInfo.isStaticallySingleChild){
							oSection.setShowTitle(true);
							oSection.setTitleLevel(SapCoreLibrary.TitleLevel.H3);
						}
						delete oTitleInfo.titleOwner;
						oSubSectionTitleBinding.destroy();
					}
				};
				fnAdjustTitle();
				if (oTitleInfo.isStaticallySingleChild){
					oSection.setShowTitle(false);
					oSection.setTitleLevel(SapCoreLibrary.TitleLevel.Auto);
				}
				setHeaderLevel(oTitleInfo.isStaticallySingleChild ? SapCoreLibrary.TitleLevel.H3 : SapCoreLibrary.TitleLevel.H4); // If one Section has only 1 Sub-Section, then Control title is set as "H3" else Section Title is "H3" and Control Title is "H4"
				if (aSubSections.length === 1) { // If one Section has only 1 Sub-Section, then Control's headerStyle will be set as "H4" irrespective of the headerLevel. This is done as per the suggestion from Object Page Community
					setHeaderStyle(SapCoreLibrary.TitleLevel.H4);
				}
			}

			//This logic is only for the first subsection
			//If the title of the subsection is not visible, then set the title level of all the controls to H4 to maintain the proper hierarchy.
			function fnAdjustSubSectionTitle(oFirstSubSection) {
				if (oFirstSubSection && typeof oFirstSubSection.getTitleVisible === "function" && !oFirstSubSection.getTitleVisible()) {
					var aBlocks = oFirstSubSection.getAggregation("blocks");
					if (aBlocks && aBlocks.length > 0) {
						var oBlock = aBlocks[0];
						if (oBlock.isA("sap.ui.layout.Grid")) {
							var aContent = oBlock.getAggregation("content");
							if (aContent && aContent.length > 0) {
								aContent.forEach(function(oControl) {
									//The title handling for other smart controls (SmartTable and SmartChart) is already handled.
									if (oControl.isA("sap.ui.comp.smartform.SmartForm")) {
										var oContent = oControl.getAggregation("content");
										var oFormContainers = oContent.getAggregation("formContainers");
										if (oFormContainers && oFormContainers.length > 0) {
											oFormContainers.forEach(function(oFormContainer) {
												var oTitle = oFormContainer.getAggregation("title");
												if (oTitle) {
													oTitle.setProperty("level", "H4");
												}
											});
										}
									}
								});
							}
						}
					}
				}

			}

			// public instance methods
			return {
				setAsTitleOwner: fnSetAsTitleOwner,
				adjustSubSectionTitle: fnAdjustSubSectionTitle
			};
		}

		return BaseObject.extend("sap.suite.ui.generic.template.ObjectPage.controller.SectionTitleHandler", {
			constructor: function(oController, oObjectPage) {
				extend(this, getMethods(oController, oObjectPage));
			}
		});
	});
