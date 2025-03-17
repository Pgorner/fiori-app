sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel) {
	"use strict";

	return new JSONModel({
		autoRun: true,
		schemaValidation: false,
		splitViewVertically: false,
		panesSwitched: false,
		editable: true,
		editorType: "text",
		internal: window._isinternal,
		fallBackUI5Version: "1.120.4",
		templateFiles: [
			{
				key: "i18nModel.txt",
				url: "/common/projectDownload/templates/i18nModel.txt"
			},
			{
				key: "localUri.txt",
				url: "/common/projectDownload/templates/localUri.txt"
			},
			{
				key: "sourceTemplate.txt",
				url: "/common/projectDownload/templates/sourceTemplate.txt"
			}
		],
		commonFiles: [
			{
				content: "",
				key: "package.json",
				name: "package.json",
				url: "/common/projectDownload/package.json",
				folder: "root",
				parentFolder: "",
				level: 0
			},
			{
				content: "",
				key: "README.md",
				name: "README.md",
				url: "/common/projectDownload/README.md",
				folder: "root",
				parentFolder: "",
				level: 0
			},
			{
				content: "",
				key: "developer-license.txt",
				name: "developer-license.txt",
				url: "/common/projectDownload/developer-license.txt",
				folder: "root",
				parentFolder: "",
				level: 0
			},
			{
				content: "",
				key: "ui5.yaml",
				name: "ui5.yaml",
				url: "/common/projectDownload/ui5.yaml",
				folder: "root",
				parentFolder: "",
				level: 0
			},
			{
				content: "",
				key: "flpSandbox.html",
				name: "flpSandbox.html",
				url: "/common/projectDownload/flpSandbox.html",
				folder: "test",
				parentFolder: "webapp",
				level: 2
			},
			{
				content: "",
				key: "Component.js",
				name: "Component.js",
				url: "/common/projectDownload/Component.js",
				folder: "webapp",
				parentFolder: "root",
				level: 1
			},
			{
				content: "",
				key: "i18n.properties",
				name: "i18n.properties",
				url: "/common/projectDownload/i18n.properties",
				folder: "i18n",
				parentFolder: "webapp",
				level: 2
			}
		]
	});
});
