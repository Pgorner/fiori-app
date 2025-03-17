/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/PageController"], function (PageController) {
  "use strict";

  const CODESNIPPETS = [/* Adapt the manifest to enhance the i18n properties */
  {
    id: "codeManifest",
    code: /* json */`

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
  }];
  return PageController.extend("sap.fe.core.fpmExplorer.adaptI18n.EntryPage", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDT0RFU05JUFBFVFMiLCJpZCIsImNvZGUiLCJzbGljZSIsIlBhZ2VDb250cm9sbGVyIiwiZXh0ZW5kIiwib25Jbml0IiwicHJvdG90eXBlIiwiYXBwbHkiLCJvU25pcHBldCIsIm9FZGl0b3IiLCJieUlkIiwiaUhlaWdodCIsInNwbGl0IiwibGVuZ3RoIiwic2V0VmFsdWUiLCJzZXRIZWlnaHQiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkVudHJ5UGFnZS5jb250cm9sbGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYWdlQ29udHJvbGxlciBmcm9tIFwic2FwL2ZlL2NvcmUvUGFnZUNvbnRyb2xsZXJcIjtcbmltcG9ydCB0eXBlIENvZGVFZGl0b3IgZnJvbSBcInNhcC91aS9jb2RlZWRpdG9yL0NvZGVFZGl0b3JcIjtcblxuY29uc3QgQ09ERVNOSVBQRVRTID0gW1xuXHQvKiBBZGFwdCB0aGUgbWFuaWZlc3QgdG8gZW5oYW5jZSB0aGUgaTE4biBwcm9wZXJ0aWVzICovXG5cdHtcblx0XHRpZDogXCJjb2RlTWFuaWZlc3RcIixcblx0XHRjb2RlOiAvKiBqc29uICovIGBcblxuXCJ0YXJnZXRzXCI6IHtcblx0XCJlbnRyeVBhZ2VcIjoge1xuXHRcdFwidHlwZVwiOiBcIkNvbXBvbmVudFwiLFxuXHRcdFwiaWRcIjogXCJlbnRyeVBhZ2VcIixcblx0XHRcIm5hbWVcIjogXCJzYXAuZmUuY29yZS5mcG1cIixcblx0XHRcIm9wdGlvbnNcIjoge1xuXHRcdFx0XCJzZXR0aW5nc1wiOiB7XG5cdFx0XHRcdFwidmlld05hbWVcIjogXCJ5b3VyLnZpZXdcIixcblx0XHRcdFx0XCJlbmhhbmNlSTE4blwiOiBcImkxOG4vaTE4bi5wcm9wZXJ0aWVzXCIgLy8gVGhpcyBpcyB0aGUgbGluZSB0byBiZSBhZGRlZCAtIGl0IHByb3ZpZGVzIFNBUCBGaW9yaSBFbGVtZW50cyB3aXRoIHRoZSBuYW1lIG9mIHRoZSBjdXN0b20gcmVzb3VyY2UgYnVuZGxlLlxuXHRcdFx0XHRcImNvbnRleHRQYXRoXCI6IFwiL1Jvb3RFbnRpdHlcIlxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5gLnNsaWNlKDIsIC0yKSAvLyByZW1vdmUgZmlyc3QgYW5kIGxhc3QgMiBuZXdsaW5lc1xuXHR9XG5dO1xuXG5leHBvcnQgZGVmYXVsdCBQYWdlQ29udHJvbGxlci5leHRlbmQoXCJzYXAuZmUuY29yZS5mcG1FeHBsb3Jlci5hZGFwdEkxOG4uRW50cnlQYWdlXCIsIHtcblx0b25Jbml0OiBmdW5jdGlvbiAoKSB7XG5cdFx0UGFnZUNvbnRyb2xsZXIucHJvdG90eXBlLm9uSW5pdC5hcHBseSh0aGlzKTtcblxuXHRcdGZvciAoY29uc3Qgb1NuaXBwZXQgb2YgQ09ERVNOSVBQRVRTKSB7XG5cdFx0XHRjb25zdCBvRWRpdG9yOiBDb2RlRWRpdG9yID0gdGhpcy5ieUlkKG9TbmlwcGV0LmlkKSBhcyBDb2RlRWRpdG9yO1xuXHRcdFx0Y29uc3QgaUhlaWdodCA9IG9TbmlwcGV0LmNvZGUuc3BsaXQoXCJcXG5cIik/Lmxlbmd0aCB8fCAzO1xuXHRcdFx0b0VkaXRvci5zZXRWYWx1ZShvU25pcHBldC5jb2RlKTtcblx0XHRcdG9FZGl0b3Iuc2V0SGVpZ2h0KGAke2lIZWlnaHR9cmVtYCk7XG5cdFx0fVxuXHR9XG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUdBLE1BQU1BLFlBQVksR0FBRyxDQUNwQjtFQUNBO0lBQ0NDLEVBQUUsRUFBRSxjQUFjO0lBQ2xCQyxJQUFJLEVBQUUsVUFBVztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsQ0FBQ0MsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2QsQ0FBQyxDQUNEO0VBQUMsT0FFYUMsY0FBYyxDQUFDQyxNQUFNLENBQUMsNkNBQTZDLEVBQUU7SUFDbkZDLE1BQU0sRUFBRSxTQUFBQSxDQUFBLEVBQVk7TUFDbkJGLGNBQWMsQ0FBQ0csU0FBUyxDQUFDRCxNQUFNLENBQUNFLEtBQUssQ0FBQyxJQUFJLENBQUM7TUFFM0MsS0FBSyxNQUFNQyxRQUFRLElBQUlULFlBQVksRUFBRTtRQUNwQyxNQUFNVSxPQUFtQixHQUFHLElBQUksQ0FBQ0MsSUFBSSxDQUFDRixRQUFRLENBQUNSLEVBQUUsQ0FBZTtRQUNoRSxNQUFNVyxPQUFPLEdBQUdILFFBQVEsQ0FBQ1AsSUFBSSxDQUFDVyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUVDLE1BQU0sSUFBSSxDQUFDO1FBQ3RESixPQUFPLENBQUNLLFFBQVEsQ0FBQ04sUUFBUSxDQUFDUCxJQUFJLENBQUM7UUFDL0JRLE9BQU8sQ0FBQ00sU0FBUyxDQUFDLEdBQUdKLE9BQU8sS0FBSyxDQUFDO01BQ25DO0lBQ0Q7RUFDRCxDQUFDLENBQUM7QUFBQSIsImlnbm9yZUxpc3QiOltdfQ==