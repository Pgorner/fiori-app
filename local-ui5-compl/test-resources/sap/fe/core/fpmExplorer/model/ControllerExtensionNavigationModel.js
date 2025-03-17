sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel) {
	"use strict";

	// Please order topics alphabetically by "title"
	return new JSONModel({
		selectedKey: "controllerExtensionsOverview",
		topic: "Controller Extensions",
		target: "controllerExtensions",
		navigation: [
			{
				title: "Documentation",
				icon: "sap-icon://documents",
				key: "controllerExtensionsOverview"
			},
			{
				key: "guidanceControllerExtensions",
				title: "Guidance",
				tags: "load custom controller, override controller, extensionAPI, lifecycle hooks, event handlers, formatters, use building blocks in fragments, loadFragment",
				icon: "sap-icon://learning-assistant",
				hash: "",
				experimental: false,
				downloadProject: false,
				editable: false,
				files: [
					{
						url: "/topics/controllerExtensions/guidanceControllerExtensions/template/CustomSection.fragment.xml",
						name: "CustomSection.fragment.xml",
						key: "CustomSection.fragment.xml"
					},
					{
						url: "/topics/controllerExtensions/guidanceControllerExtensions/template/extendOP.controller.js",
						name: "extendOP.controller.js",
						key: "extendOP.controller.js"
					}
				]
			},
			{
				key: "basicExtensibility",
				title: "Edit Flow",
				tags: "invokeAction, bound action, unbound action, action with parameters, skip action parameter dialog",
				icon: "sap-icon://edit",
				hash: "EditFlow-Sample?&/RootEntity(ID='1',IsActiveEntity=true)",
				experimental: false,
				downloadProject: true,
				downloadRootUrl: "/topics/controllerExtensions/basicExtensibility/",
				editable: true,
				files: [
					{
						url: "/topics/controllerExtensions/basicExtensibility/OPExtend.controller.js",
						name: "OPExtend.controller.js",
						key: "OPExtend.controller.js"
					},
					{
						url: "/topics/controllerExtensions/basicExtensibility/SubOPExtend.controller.js",
						name: "SubOPExtend.controller.js",
						key: "SubOPExtend.controller.js"
					},
					{
						url: "/topics/controllerExtensions/basicExtensibility/manifest.json",
						name: "manifest.json",
						key: "manifest.json"
					},
					{
						url: "/topics/controllerExtensions/basicExtensibility/localService/service.cds",
						name: "service.cds",
						key: "service.cds"
					},
					{
						url: "/topics/controllerExtensions/basicExtensibility/localService/RootEntity.json",
						name: "RootEntity.json",
						key: "RootEntity.json"
					},
					{
						url: "/topics/controllerExtensions/basicExtensibility/localService/ChildEntity.json",
						name: "ChildEntity.json",
						key: "ChildEntity.json"
					}
				]
			},

			{
				key: "customEditFlow",
				title: "Draft Handling on Custom Page",
				tags: "custom page, edit flow, draft",
				icon: "sap-icon://edit",
				experimental: false,
				downloadProject: true,
				downloadRootUrl: "/topics/controllerExtensions/customEditFlow/",
				files: [
					{
						url: "/topics/controllerExtensions/customEditFlow/manifest.json",
						name: "manifest.json",
						key: "manifest.json"
					},
					{
						url: "/topics/controllerExtensions/customEditFlow/CustomPage.controller.js",
						name: "CustomPage.controller.js",
						key: "CustomPage.controller.js"
					},
					{
						url: "/topics/controllerExtensions/customEditFlow/CustomPage.view.xml",
						name: "CustomPage.view.xml",
						key: "CustomPage.view.xml"
					},
					{
						url: "/topics/controllerExtensions/customEditFlow/localService/service.cds",
						name: "service.cds",
						key: "service.cds"
					},
					{
						url: "/topics/controllerExtensions/customEditFlow/localService/RootEntity.json",
						name: "RootEntity.json",
						key: "RootEntity.json"
					}
				]
			},
			{
				key: "viewState",
				title: "Custom State Handling",
				tags: "",
				icon: "sap-icon://connected",
				hash: "#ViewState-Sample?&/RootEntity(ID='1',IsActiveEntity=true)",
				experimental: false,
				downloadProject: false,
				downloadRootUrl: "/topics/controllerExtensions/viewState/",
				editable: true,
				files: [
					{
						url: "/topics/controllerExtensions/viewState/manifest.json",
						name: "manifest.json",
						key: "manifest.json"
					},
					{
						url: "/topics/controllerExtensions/viewState/OPExtend.controller.js",
						name: "OPExtend.controller.js",
						key: "OPExtend.controller.js"
					},
					{
						url: "/topics/controllerExtensions/viewState/CustomSection.fragment.xml",
						name: "CustomSection.fragment.xml",
						key: "CustomSection.fragment.xml"
					},
					{
						url: "/topics/controllerExtensions/viewState/localService/service.cds",
						name: "service.cds",
						key: "service.cds"
					},
					{
						url: "/topics/controllerExtensions/viewState/localService/RootEntity.json",
						name: "RootEntity.json",
						key: "RootEntity.json"
					}
				]
			},
			{
				key: "shareExtensibility",
				title: '"Share" Functionality',
				tags: "override in custom page",
				icon: "sap-icon://action",
				hash: "",
				experimental: false,
				downloadProject: true,
				downloadRootUrl: "/topics/controllerExtensions/share/",
				editable: true,
				files: [
					{
						url: "/topics/controllerExtensions/share/manifest.json",
						name: "manifest.json",
						key: "manifest.json"
					},
					{
						url: "/topics/controllerExtensions/share/Share.controller.js",
						name: "Share.controller.js",
						key: "Share.controller.js"
					},
					{
						url: "/topics/controllerExtensions/share/Share.view.xml",
						name: "Share.view.xml",
						key: "Share.view.xml"
					},
					{
						url: "/topics/controllerExtensions/share/ShareExtend.js",
						name: "ShareExtend.js",
						key: "ShareExtend.js"
					},
					{
						url: "/topics/controllerExtensions/share/localService/service.cds",
						name: "service.cds",
						key: "service.cds"
					},
					{
						url: "/topics/controllerExtensions/share/localService/RootEntity.json",
						name: "RootEntity.json",
						key: "RootEntity.json"
					}
				]
			},
			{
				key: "routingExtensibility",
				title: "Routing Extensibility",
				tags: "navigation",
				icon: "sap-icon://navigation-right-arrow",
				hash: "Routing-Sample",
				experimental: false,
				downloadProject: true,
				downloadRootUrl: "/topics/controllerExtensions/routingExtensibility/",
				editable: true,
				files: [
					{
						url: "/topics/controllerExtensions/routingExtensibility/manifest.json",
						name: "manifest.json",
						key: "manifest.json"
					},
					{
						url: "/topics/controllerExtensions/routingExtensibility/extendLR.controller.js",
						name: "extendLR.controller.js",
						key: "extendLR.controller.js"
					},
					{
						url: "/topics/controllerExtensions/routingExtensibility/extendOP.controller.js",
						name: "extendOP.controller.js",
						key: "extendOP.controller.js"
					},
					{
						url: "/topics/controllerExtensions/routingExtensibility/localService/service.cds",
						name: "service.cds",
						key: "service.cds"
					},
					{
						url: "/topics/controllerExtensions/routingExtensibility/localService/RootEntity.json",
						name: "RootEntity.json",
						key: "RootEntity.json"
					}
				]
			},
			{
				key: "intentBasedNavigation",
				title: "Intent-Based Navigation",
				tags: "navigateOutbound, override in custom page",
				icon: "sap-icon://space-navigation",
				hash: "#IntentBasedNavigation-Sample",
				experimental: false,
				downloadProject: true,
				downloadRootUrl: "/topics/controllerExtensions/intentBasedNavigation/",
				editable: true,
				files: [
					{
						url: "/topics/controllerExtensions/intentBasedNavigation/manifest.json",
						name: "manifest.json",
						key: "manifest.json"
					},
					{
						url: "/topics/controllerExtensions/intentBasedNavigation/IntentBasedNavigation.controller.js",
						name: "IntentBasedNavigation.controller.js",
						key: "IntentBasedNavigation.controller.js"
					},
					{
						url: "/topics/controllerExtensions/intentBasedNavigation/IntentBasedNavigation.view.xml",
						name: "IntentBasedNavigation.view.xml",
						key: "IntentBasedNavigation.view.xml"
					}
				]
			},
			{
				key: "tableExtensibility",
				title: "Table Extensibility",
				tags: "",
				icon: "sap-icon://table-view",
				hash: "/RootEntity(ID='1',IsActiveEntity=true)",
				experimental: false,
				downloadProject: true,
				downloadRootUrl: "/topics/controllerExtensions/tableExtensibility/",
				editable: true,
				files: [
					{
						url: "/topics/controllerExtensions/tableExtensibility/manifest.json",
						name: "manifest.json",
						key: "manifest.json"
					},
					{
						url: "/topics/controllerExtensions/tableExtensibility/OPExtend.controller.js",
						name: "OPExtend.controller.js",
						key: "OPExtend.controller.js"
					},
					{
						url: "/topics/controllerExtensions/tableExtensibility/localService/service.cds",
						name: "service.cds",
						key: "service.cds"
					},
					{
						url: "/topics/controllerExtensions/tableExtensibility/localService/RootEntity.json",
						name: "RootEntity.json",
						key: "RootEntity.json"
					},
					{
						url: "/topics/controllerExtensions/tableExtensibility/localService/ChildEntity.json",
						name: "ChildEntity.json",
						key: "ChildEntity.json"
					}
				]
			},
			{
				key: "multiModeExtensibility",
				title: "Multi Mode Extensibility",
				tags: "navigation",
				icon: "sap-icon://table-view",
				hash: "MultiModeExtensibility-Sample",
				experimental: false,
				downloadProject: true,
				downloadRootUrl: "/topics/controllerExtensions/multiModeExtensibility/",
				editable: true,
				files: [
					{
						url: "/topics/controllerExtensions/multiModeExtensibility/manifest.json",
						name: "manifest.json",
						key: "manifest.json"
					},
					{
						url: "/topics/controllerExtensions/multiModeExtensibility/extendLR.controller.js",
						name: "extendLR.controller.js",
						key: "extendLR.controller.js"
					},
					{
						url: "/topics/controllerExtensions/multiModeExtensibility/localService/service.cds",
						name: "service.cds",
						key: "service.cds"
					},
					{
						url: "/topics/controllerExtensions/multiModeExtensibility/CustomViewWithTableMacro.fragment.xml",
						name: "CustomViewWithTableMacro.fragment.xml",
						key: "CustomViewWithTableMacro.fragment.xml"
					},
					{
						url: "/topics/controllerExtensions/multiModeExtensibility/localService/RootEntity.json",
						name: "RootEntity.json",
						key: "RootEntity.json"
					}
				]
			}
		]
	});
});
