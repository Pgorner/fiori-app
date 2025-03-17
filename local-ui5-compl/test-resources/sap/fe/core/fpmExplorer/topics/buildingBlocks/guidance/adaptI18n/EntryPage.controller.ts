import PageController from "sap/fe/core/PageController";
import type CodeEditor from "sap/ui/codeeditor/CodeEditor";

const CODESNIPPETS = [
	/* Adapt the manifest to enhance the i18n properties */
	{
		id: "codeManifest",
		code: /* json */ `

"targets": {
	"entryPage": {
		"type": "Component",
		"id": "entryPage",
		"name": "sap.fe.core.fpm",
		"options": {
			"settings": {
				"viewName": "your.view",
				"enhanceI18n": "i18n/i18n.properties" // This is the line to be added - it provides SAP Fiori Elements with the name of the custom resource bundle.
				"contextPath": "/RootEntity"
			}
		}
	}
}

`.slice(2, -2) // remove first and last 2 newlines
	}
];

export default PageController.extend("sap.fe.core.fpmExplorer.adaptI18n.EntryPage", {
	onInit: function () {
		PageController.prototype.onInit.apply(this);

		for (const oSnippet of CODESNIPPETS) {
			const oEditor: CodeEditor = this.byId(oSnippet.id) as CodeEditor;
			const iHeight = oSnippet.code.split("\n")?.length || 3;
			oEditor.setValue(oSnippet.code);
			oEditor.setHeight(`${iHeight}rem`);
		}
	}
});
