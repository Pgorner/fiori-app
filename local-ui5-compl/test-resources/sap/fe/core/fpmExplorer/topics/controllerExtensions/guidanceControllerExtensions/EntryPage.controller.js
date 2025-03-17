/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/PageController"], function (PageController) {
  "use strict";

  const CODESNIPPETS = [/* Load Custom Controller in XML */
  {
    id: "codeControllerRequire",
    code: /* xml */`

<HBox core:require="{handler: 'myApp/ext/myCustomSectionHandler'}">
	<Button text="Accept" press="handler.accept" type="Positive" />
</HBox>

`.slice(2, -2) // remove first and last 2 newlines
  }, {
    id: "codeControllerRequireExample",
    code: /* js */`

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
  }, /* Defining Controller Extensions */
  {
    id: "codeDefinition",
    code: /* json */`

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
  }, /* How to Implement a Controller Extension */
  {
    id: "codeImplementation",
    code: /* js */`

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
  }, /* Using Event Handlers and Formatters */
  {
    id: "codeUsage",
    code: /* xml */`

<HBox>
	<Button text="Accept" press=".extension.myApp.ext.OPExtend.accept" type="Positive" />
	<Text text="{path: 'TotalNetAmount', formatter:'.extension.myApp.ext.OPExtend.myFormatter' }" />
</HBox>

`.slice(2, -2) // remove first and last 2 newlines
  }, /* How to use a building block in a Fragment */
  {
    id: "codeLoadFragment",
    code: /* js */`

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
  }];
  return PageController.extend("sap.fe.core.fpmExplorer.guidanceControllerExtensions.EntryPage", {
    onInit: function () {
      PageController.prototype.onInit.apply(this);
      for (const oSnippet of CODESNIPPETS) {
        const oEditor = this.byId(oSnippet.id);
        const iHeight = oSnippet.code.split("\n")?.length || 3;
        oEditor.setValue(oSnippet.code);
        oEditor.setHeight(`${iHeight}rem`);
      }
    }
  });
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDT0RFU05JUFBFVFMiLCJpZCIsImNvZGUiLCJzbGljZSIsIlBhZ2VDb250cm9sbGVyIiwiZXh0ZW5kIiwib25Jbml0IiwicHJvdG90eXBlIiwiYXBwbHkiLCJvU25pcHBldCIsIm9FZGl0b3IiLCJieUlkIiwiaUhlaWdodCIsInNwbGl0IiwibGVuZ3RoIiwic2V0VmFsdWUiLCJzZXRIZWlnaHQiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkVudHJ5UGFnZS5jb250cm9sbGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYWdlQ29udHJvbGxlciBmcm9tIFwic2FwL2ZlL2NvcmUvUGFnZUNvbnRyb2xsZXJcIjtcbmltcG9ydCB0eXBlIENvZGVFZGl0b3IgZnJvbSBcInNhcC91aS9jb2RlZWRpdG9yL0NvZGVFZGl0b3JcIjtcblxuY29uc3QgQ09ERVNOSVBQRVRTID0gW1xuXHQvKiBMb2FkIEN1c3RvbSBDb250cm9sbGVyIGluIFhNTCAqL1xuXHR7XG5cdFx0aWQ6IFwiY29kZUNvbnRyb2xsZXJSZXF1aXJlXCIsXG5cdFx0Y29kZTogLyogeG1sICovIGBcblxuPEhCb3ggY29yZTpyZXF1aXJlPVwie2hhbmRsZXI6ICdteUFwcC9leHQvbXlDdXN0b21TZWN0aW9uSGFuZGxlcid9XCI+XG5cdDxCdXR0b24gdGV4dD1cIkFjY2VwdFwiIHByZXNzPVwiaGFuZGxlci5hY2NlcHRcIiB0eXBlPVwiUG9zaXRpdmVcIiAvPlxuPC9IQm94PlxuXG5gLnNsaWNlKDIsIC0yKSAvLyByZW1vdmUgZmlyc3QgYW5kIGxhc3QgMiBuZXdsaW5lc1xuXHR9LFxuXG5cdHtcblx0XHRpZDogXCJjb2RlQ29udHJvbGxlclJlcXVpcmVFeGFtcGxlXCIsXG5cdFx0Y29kZTogLyoganMgKi8gYFxuXG5zYXAudWkuZGVmaW5lKFtdLCBmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdHJldHVybiB7XG5cdFx0YWNjZXB0OiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIC4uLiBjdXN0b20gY29kZSBoZXJlXG5cdFx0XHQvLyBcInRoaXNcIiBpcyB0aGUgRmlvcmkgZWxlbWVudHMgRXh0ZW5zaW9uQVBJXG5cdFx0XHR0aGlzLnJlZnJlc2goKTtcblx0XHR9XG5cdH07XG59KTtcblxuYC5zbGljZSgyLCAtMikgLy8gcmVtb3ZlIGZpcnN0IGFuZCBsYXN0IDIgbmV3bGluZXNcblx0fSxcblxuXHQvKiBEZWZpbmluZyBDb250cm9sbGVyIEV4dGVuc2lvbnMgKi9cblx0e1xuXHRcdGlkOiBcImNvZGVEZWZpbml0aW9uXCIsXG5cdFx0Y29kZTogLyoganNvbiAqLyBgXG5cblwic2FwLnVpNVwiOiB7XG5cdFwiZXh0ZW5kc1wiOiB7XG5cdFx0XCJleHRlbnNpb25zXCI6IHtcblx0XHRcdFwic2FwLnVpLmNvbnRyb2xsZXJFeHRlbnNpb25zXCI6IHtcblx0XHRcdFx0XCJzYXAuZmUudGVtcGxhdGVzLkxpc3RSZXBvcnQuTGlzdFJlcG9ydENvbnRyb2xsZXJcIjoge1xuXHRcdFx0XHRcdFwiY29udHJvbGxlck5hbWVcIjogXCJteUFwcC5leHQuTFJFeHRlbmRcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcInNhcC5mZS50ZW1wbGF0ZXMuT2JqZWN0UGFnZS5PYmplY3RQYWdlQ29udHJvbGxlciNteUFwcElEOjpDdXN0b21lckRldGFpbHNcIjoge1xuXHRcdFx0XHRcdFwiY29udHJvbGxlck5hbWVzXCI6IFtcblx0XHRcdFx0XHRcdFwibXlBcHAuZXh0Lk9QRXh0ZW5kXCIsXG5cdFx0XHRcdFx0XHRcIm15QXBwLmV4dC5DdXN0b21lckRldGFpbHNFeHRlbmRcIlxuXHRcdFx0XHRcdF1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5gLnNsaWNlKDIsIC0yKSAvLyByZW1vdmUgZmlyc3QgYW5kIGxhc3QgMiBuZXdsaW5lc1xuXHR9LFxuXG5cdC8qIEhvdyB0byBJbXBsZW1lbnQgYSBDb250cm9sbGVyIEV4dGVuc2lvbiAqL1xuXHR7XG5cdFx0aWQ6IFwiY29kZUltcGxlbWVudGF0aW9uXCIsXG5cdFx0Y29kZTogLyoganMgKi8gYFxuXG5zYXAudWkuZGVmaW5lKFtcInNhcC91aS9jb3JlL212Yy9Db250cm9sbGVyRXh0ZW5zaW9uXCJdLCBmdW5jdGlvbihcblx0Q29udHJvbGxlckV4dGVuc2lvblxuKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHJldHVybiBDb250cm9sbGVyRXh0ZW5zaW9uLmV4dGVuZChcIm15QXBwLmV4dC5PUEV4dGVuZFwiLCB7XG5cdFx0Ly8gdGhpcyBzZWN0aW9uIGFsbG93cyB0byBleHRlbmQgbGlmZWN5Y2xlIGhvb2tzIG9yIGhvb2tzIHByb3ZpZGVkIGJ5IEZpb3JpIGVsZW1lbnRzXG5cdFx0b3ZlcnJpZGU6IHtcblx0XHRcdG9uSW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIHlvdSBjYW4gYWNjZXNzIHRoZSBGaW9yaSBlbGVtZW50cyBleHRlbnNpb25BUEkgdmlhIHRoaXMuYmFzZS5nZXRFeHRlbnNpb25BUElcblx0XHRcdFx0dmFyIG9Nb2RlbCA9IHRoaXMuYmFzZS5nZXRFeHRlbnNpb25BUEkoKS5nZXRNb2RlbCgpO1xuXG5cdFx0XHRcdC8vIC4uLiBjdXN0b20gY29kZSBoZXJlXG5cdFx0XHR9LFxuXHRcdFx0dmlld1N0YXRlOiB7XG5cdFx0XHRcdGFwcGx5SW5pdGlhbFN0YXRlT25seTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Ly8gLi4uIGN1c3RvbSBjb2RlIGhlcmVcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8geW91IGNhbiBhZGQgb3duIGZvcm1hdHRlciBvciBoZWxwZXJcblx0XHRmb3JtYXRNeUZpZWxkOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIC4uLiBjdXN0b20gY29kZSBoZXJlXG5cdFx0fSxcblx0XHRhY2NlcHQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gLi4uIGN1c3RvbSBjb2RlIGhlcmVcblx0XHR9LFxuXHRcdC8vICEhISBidW5kbGluZyBmb3JtYXR0ZXJzIG9yIGV2ZW50IGhhbmRsZXJzIGludG8gYW4gb2JqZWN0IGRvZXMgbm90IHdvcmtcblx0XHRmb3JtYXR0ZXIgOiB7XG5cdFx0XHRmb3JtYXRNeUZpZWxkOiBmdW5jdGlvbigpIHtcblx0XHRcdCBcdC8vIHRoaXMgbWV0aG9kIGlzIG5vdCBhY2Nlc3NpYmxlXG5cdFx0XHR9LFxuXHRcdH1cblx0fSk7XG59KTtcblxuYC5zbGljZSgyLCAtMikgLy8gcmVtb3ZlIGZpcnN0IGFuZCBsYXN0IDIgbmV3bGluZXNcblx0fSxcblxuXHQvKiBVc2luZyBFdmVudCBIYW5kbGVycyBhbmQgRm9ybWF0dGVycyAqL1xuXHR7XG5cdFx0aWQ6IFwiY29kZVVzYWdlXCIsXG5cdFx0Y29kZTogLyogeG1sICovIGBcblxuPEhCb3g+XG5cdDxCdXR0b24gdGV4dD1cIkFjY2VwdFwiIHByZXNzPVwiLmV4dGVuc2lvbi5teUFwcC5leHQuT1BFeHRlbmQuYWNjZXB0XCIgdHlwZT1cIlBvc2l0aXZlXCIgLz5cblx0PFRleHQgdGV4dD1cIntwYXRoOiAnVG90YWxOZXRBbW91bnQnLCBmb3JtYXR0ZXI6Jy5leHRlbnNpb24ubXlBcHAuZXh0Lk9QRXh0ZW5kLm15Rm9ybWF0dGVyJyB9XCIgLz5cbjwvSEJveD5cblxuYC5zbGljZSgyLCAtMikgLy8gcmVtb3ZlIGZpcnN0IGFuZCBsYXN0IDIgbmV3bGluZXNcblx0fSxcblx0LyogSG93IHRvIHVzZSBhIGJ1aWxkaW5nIGJsb2NrIGluIGEgRnJhZ21lbnQgKi9cblx0e1xuXHRcdGlkOiBcImNvZGVMb2FkRnJhZ21lbnRcIixcblx0XHRjb2RlOiAvKiBqcyAqLyBgXG5cbnNhcC51aS5kZWZpbmUoW1wic2FwL3VpL2NvcmUvbXZjL0NvbnRyb2xsZXJFeHRlbnNpb25cIl0sIGZ1bmN0aW9uKFxuXHRDb250cm9sbGVyRXh0ZW5zaW9uXG4pIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0cmV0dXJuIENvbnRyb2xsZXJFeHRlbnNpb24uZXh0ZW5kKFwibXlBcHAuZXh0Lk9QRXh0ZW5kXCIsIHtcblx0XHQvLyB0aGlzIHNlY3Rpb24gYWxsb3dzIHRvIGV4dGVuZCBsaWZlY3ljbGUgaG9va3Mgb3IgaG9va3MgcHJvdmlkZWQgYnkgRmlvcmkgZWxlbWVudHNcblx0XHRvdmVycmlkZToge1xuXHRcdFx0Ly8gLi4uLlxuXHRcdH0sXG5cdFx0b25DcmVhdGVQcmVzczogZnVudGlvbigpIHtcblx0XHRcdHRoaXMuYmFzZS5nZXRFeHRlbnNpb25BUEkoKS5sb2FkRnJhZ21lbnQoe1xuXHRcdFx0XHRuYW1lOiBcImZwbUV4cGxvcmVyLmZyYWdtZW50cy5jdXN0b21EaWFsb2dcIixcblx0XHRcdFx0Y29udHJvbGxlcjogdGhpc1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYC5zbGljZSgyLCAtMikgLy8gcmVtb3ZlIGZpcnN0IGFuZCBsYXN0IDIgbmV3bGluZXNcblx0fVxuXTtcblxuZXhwb3J0IGRlZmF1bHQgUGFnZUNvbnRyb2xsZXIuZXh0ZW5kKFwic2FwLmZlLmNvcmUuZnBtRXhwbG9yZXIuZ3VpZGFuY2VDb250cm9sbGVyRXh0ZW5zaW9ucy5FbnRyeVBhZ2VcIiwge1xuXHRvbkluaXQ6IGZ1bmN0aW9uICgpIHtcblx0XHRQYWdlQ29udHJvbGxlci5wcm90b3R5cGUub25Jbml0LmFwcGx5KHRoaXMpO1xuXG5cdFx0Zm9yIChjb25zdCBvU25pcHBldCBvZiBDT0RFU05JUFBFVFMpIHtcblx0XHRcdGNvbnN0IG9FZGl0b3I6IENvZGVFZGl0b3IgPSB0aGlzLmJ5SWQob1NuaXBwZXQuaWQpIGFzIENvZGVFZGl0b3I7XG5cdFx0XHRjb25zdCBpSGVpZ2h0ID0gb1NuaXBwZXQuY29kZS5zcGxpdChcIlxcblwiKT8ubGVuZ3RoIHx8IDM7XG5cdFx0XHRvRWRpdG9yLnNldFZhbHVlKG9TbmlwcGV0LmNvZGUpO1xuXHRcdFx0b0VkaXRvci5zZXRIZWlnaHQoYCR7aUhlaWdodH1yZW1gKTtcblx0XHR9XG5cdH1cbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBR0EsTUFBTUEsWUFBWSxHQUFHLENBQ3BCO0VB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