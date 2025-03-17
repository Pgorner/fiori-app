sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel) {
	"use strict";

	return new JSONModel({
		selectedKey: "advancedFeaturesOverview",
		topic: "Advanced Features",
		target: "advancedFeatures",
		navigation: [
			{
				title: "Documentation",
				tags: "",
				icon: "sap-icon://documents",
				key: "advancedFeaturesOverview"
			},
			{
				title: "Guidance",
				tags: "extend sap.fe.PageController, extend sap.fe.AppComponent, wrap FPM component, handling edit mode, metaPath, contextPath, navigation, sap.fe.macros",
				key: "guidance",
				icon: "sap-icon://learning-assistant",
				hasExpander: true,
				hasContent: false,
				items: [
					{
						key: "guidanceSideEffects",
						hash: "/RootEntity(ID='1',IsActiveEntity=true)",
						title: "Usage of Side Effects",
						tags: "Action, TriggerAction, CheckBox, Core.OperationAvailable, invalidate cached value help",
						experimental: false,
						downloadRootUrl: "/topics/advancedFeatures/guidanceSideEffects/",
						editable: true,
						files: [
							{
								url: "/topics/advancedFeatures/guidanceSideEffects/localService/service.cds",
								name: "Service.cds",
								key: "Service.cds"
							},
							{
								url: "/topics/advancedFeatures/guidanceSideEffects/localService/metadata.xml",
								name: "metadata.xml",
								key: "metadata.xml"
							}
						]
					},
					{
						key: "draftValidation",
						hash: "#DraftValidation-Sample?&/RootEntity(ID='1',IsActiveEntity=true)",
						tags: "side effects, PrepareAction, back-end messages, table",
						title: "Draft Validation",
						experimental: false,
						downloadRootUrl: "/topics/advancedFeatures/draftValidation/",
						editable: true,
						files: [
							{
								url: "/topics/advancedFeatures/draftValidation/localService/service.cds",
								name: "Service.cds",
								key: "Service.cds"
							}
						]
					},
					{
						key: "guidanceValueHelp",
						hash: "/RootEntity(ID='1',IsActiveEntity=true)",
						title: "Usage of a Value Help",
						tags: "Value List, Value Help, select control, dialog control, validation, context dependent, dropdown, multiple value help, type ahead	",
						experimental: false,
						downloadRootUrl: "/topics/advancedFeatures/guidanceValueHelp/",
						editable: true,
						files: [
							{
								url: "/topics/advancedFeatures/guidanceValueHelp/localService/service.cds",
								name: "Service.cds",
								key: "Service.cds"
							},
							{
								url: "/topics/advancedFeatures/guidanceValueHelp/localService/metadata.xml",
								name: "metadata.xml",
								key: "metadata.xml"
							}
						]
					}
				]
			},
			{
				key: "showMore",
				title: "Show/Hide Content",
				tags: "UI.PartOfPreview, show more, show details, show less",
				icon: "sap-icon://display-more",
				hash: "/RootEntity(ID='1',IsActiveEntity=true)",
				topic: "advancedFeatures",
				experimental: false,
				downloadProject: true,
				downloadRootUrl: "/topics/advancedFeatures/showMore/",
				files: [
					{
						url: "/topics/advancedFeatures/showMore/manifest.json",
						name: "manifest.json",
						key: "manifest.json"
					},
					{
						url: "/topics/advancedFeatures/showMore/localService/service.cds",
						name: "service.cds",
						key: "service.cds"
					},
					{
						url: "/topics/advancedFeatures/showMore/localService/RootEntity.json",
						name: "RootEntity.json",
						key: "RootEntity.json"
					},
					{
						url: "/topics/advancedFeatures/showMore/localService/ChildEntity.json",
						name: "ChildEntity.json",
						key: "ChildEntity.json"
					}
				]
			}
		]
	});
});
