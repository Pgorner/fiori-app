sap.ui.define([
	"sap/ui/test/generic/GenericTestCollection"
], function(GenericTestCollection) {
	"use strict";

	var oConfig = GenericTestCollection.createTestsuiteConfig({
		library: "sap.uiext.inbox",
		skipTests: [
			GenericTestCollection.Test.ControlRenderer,
			GenericTestCollection.Test.EnforceSemanticRendering,
			GenericTestCollection.Test.SettersContextReturn
		],
		objectCapabilities: {
			"sap.uiext.inbox.InboxLaunchPad": {
				knownIssues: {
					memoryLeaks: true,
					id: true
				}
			},
			"sap.uiext.inbox.InboxSplitApp": {
				properties: {
					tcmConfiguration: GenericTestCollection.ExcludeReason.CantSetDefaultValue
				},
				knownIssues: {
					memoryLeaks: true
				}
			},
			"sap.uiext.inbox.SubstitutionRulesManager": {
				create: false
			},
			"sap.uiext.inbox.composite.InboxAttachmentsTileContainer": {
				properties: {
					fileName: GenericTestCollection.ExcludeReason.CantSetDefaultValue, // Can't GET default value
					fileType: GenericTestCollection.ExcludeReason.CantSetDefaultValue, // Can't GET default value
					isFileSelected: GenericTestCollection.ExcludeReason.CantSetDefaultValue // Can't GET default value
				},
				knownIssues: {
					memoryLeaks: true
				}
			},
			"sap.uiext.inbox.composite.InboxTaskTitleControl": {
				properties: {
					taskTitle: GenericTestCollection.ExcludeReason.CantSetDefaultValue
				}
			},
			"sap.uiext.inbox.composite.InboxUploadAttachmentTile": {
				knownIssues: {
					memoryLeaks: true
				}
			},
			"sap.uiext.inbox.InboxTaskCategoryFilterList": {
				knownIssues: {
					memoryLeaks: true
				}
			},
			"sap.uiext.inbox.InboxTaskDetails": {
				moduleName: "sap/uiext/inbox/InboxFormattedTextView"
			}
		}
	});

	// "sap.uiext.inbox.InboxTile" relies on "sap.m" lib therefore
	// it's necessary to load "sap.m" as well in advance
	oConfig.defaults.ui5.libs.push("sap.m");

	return oConfig;
});