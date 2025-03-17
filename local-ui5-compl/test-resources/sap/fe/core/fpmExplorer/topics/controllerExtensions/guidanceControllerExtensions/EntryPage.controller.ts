import PageController from "sap/fe/core/PageController";
import type CodeEditor from "sap/ui/codeeditor/CodeEditor";

const CODESNIPPETS = [
	/* Load Custom Controller in XML */
	{
		id: "codeControllerRequire",
		code: /* xml */ `

<HBox core:require="{handler: 'myApp/ext/myCustomSectionHandler'}">
	<Button text="Accept" press="handler.accept" type="Positive" />
</HBox>

`.slice(2, -2) // remove first and last 2 newlines
	},

	{
		id: "codeControllerRequireExample",
		code: /* js */ `

sap.ui.define([], function() {
	"use strict";
	return {
		accept: function() {
			// ... custom code here
			// "this" is the Fiori elements ExtensionAPI
			this.refresh();
		}
	};
});

`.slice(2, -2) // remove first and last 2 newlines
	},

	/* Defining Controller Extensions */
	{
		id: "codeDefinition",
		code: /* json */ `

"sap.ui5": {
	"extends": {
		"extensions": {
			"sap.ui.controllerExtensions": {
				"sap.fe.templates.ListReport.ListReportController": {
					"controllerName": "myApp.ext.LRExtend"
				},
				"sap.fe.templates.ObjectPage.ObjectPageController#myAppID::CustomerDetails": {
					"controllerNames": [
						"myApp.ext.OPExtend",
						"myApp.ext.CustomerDetailsExtend"
					]
				}
			}
		}
	}
}

`.slice(2, -2) // remove first and last 2 newlines
	},

	/* How to Implement a Controller Extension */
	{
		id: "codeImplementation",
		code: /* js */ `

sap.ui.define(["sap/ui/core/mvc/ControllerExtension"], function(
	ControllerExtension
) {
	"use strict";

	return ControllerExtension.extend("myApp.ext.OPExtend", {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			onInit: function() {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();

				// ... custom code here
			},
			viewState: {
				applyInitialStateOnly: function() {
					// ... custom code here
				}
			}
		},
		// you can add own formatter or helper
		formatMyField: function() {
			// ... custom code here
		},
		accept: function() {
			// ... custom code here
		},
		// !!! bundling formatters or event handlers into an object does not work
		formatter : {
			formatMyField: function() {
			 	// this method is not accessible
			},
		}
	});
});

`.slice(2, -2) // remove first and last 2 newlines
	},

	/* Using Event Handlers and Formatters */
	{
		id: "codeUsage",
		code: /* xml */ `

<HBox>
	<Button text="Accept" press=".extension.myApp.ext.OPExtend.accept" type="Positive" />
	<Text text="{path: 'TotalNetAmount', formatter:'.extension.myApp.ext.OPExtend.myFormatter' }" />
</HBox>

`.slice(2, -2) // remove first and last 2 newlines
	},
	/* How to use a building block in a Fragment */
	{
		id: "codeLoadFragment",
		code: /* js */ `

sap.ui.define(["sap/ui/core/mvc/ControllerExtension"], function(
	ControllerExtension
) {
	"use strict";

	return ControllerExtension.extend("myApp.ext.OPExtend", {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			// ....
		},
		onCreatePress: funtion() {
			this.base.getExtensionAPI().loadFragment({
				name: "fpmExplorer.fragments.customDialog",
				controller: this
			}
		}
	});
});

`.slice(2, -2) // remove first and last 2 newlines
	}
];

export default PageController.extend("sap.fe.core.fpmExplorer.guidanceControllerExtensions.EntryPage", {
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
