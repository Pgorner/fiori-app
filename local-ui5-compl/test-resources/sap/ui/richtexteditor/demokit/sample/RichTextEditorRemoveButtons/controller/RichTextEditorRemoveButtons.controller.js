sap.ui.define(['sap/ui/core/mvc/Controller'], function (Controller){
	"use strict";

	return Controller.extend("sap.ui.richtexteditor.sample.RichTextEditorRemoveButtons.controller.RichTextEditorRemoveButtons", {
		onInit: function() {
			this.initRichTextEditor(false);
		},
		handleSelect: function (oEvent) {
			var sSelectedKey = oEvent.getParameters().selectedItem.getKey();
			if (this.oRichTextEditor) {
				this.oRichTextEditor.destroy();
			}
			switch (sSelectedKey) {
				case "TinyMCE5":
					this.initRichTextEditor(true);
					break;
				default:
					this.initRichTextEditor(false);
					break;
			}
		},
		initRichTextEditor: function (bIsTinyMCE5) {
			var that = this,
				sHtmlValue = '<div>By Using the following commands, this RichTextEditor control has two of its buttons removed from the "font-style" group.</div>\n' +
				'<div>The buttons "underline" and "strike through" are missing.</div>\n<div>&nbsp;</div>\n<div><span style="font-family: &#34;andale mono&#34; , monospace">' +
				'<span style="color: darkorange">this</span>.removeButtonGroup(<span style="color: darkcyan">"font-style"</span>);</span></div>\n<div>' +
				'<span style="font-family: &#34;andale mono&#34; , monospace"><span style="color: darkorange">this</span>.addButtonGroup({</span></div>\n' +
				'<div style="padding-left: 40px"><span style="font-family: &#34;andale mono&#34; , monospace">name: <span style="color: darkcyan">"font-style"</span>,' +
				'</span></div>\n<div style="padding-left: 40px"><span style="font-family: &#34;andale mono&#34; , monospace">visible: <span style="color: cornflowerblue">true</span>,' +
				'</span></div>\n<div style="padding-left: 40px"><span style="font-family: &#34;andale mono&#34; , monospace">priority: <span style="color: cornflowerblue">10</span>,' +
				'</span></div>\n<div style="padding-left: 40px"><span style="font-family: &#34;andale mono&#34; , monospace">customToolbarPriority: <span style="color: cornflowerblue">10</span>,' +
				'</span></div>\n<div style="padding-left: 40px"><span style="font-family: &#34;andale mono&#34; , monospace">buttons: [</span></div>\n<div style="padding-left: 80px">' +
				'<span style="font-family: &#34;andale mono&#34; , monospace"><span style="color: darkcyan">"bold"</span>, <span style="color: darkcyan">"italic"</span></span></div>\n' +
				'<div style="padding-left: 40px"><span style="font-family: &#34;andale mono&#34; , monospace">]</span></div>\n<div><span style="font-family: &#34;andale mono&#34; , monospace">});</span></div>';

			sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/library"],
				function (RTE, library) {
					var EditorType = library.EditorType;
					that.oRichTextEditor = new RTE("myRTE", {
						editorType: bIsTinyMCE5 ? EditorType.TinyMCE5 : EditorType.TinyMCE6,
						width: "100%",
						height: "600px",
						customToolbar: true,
						ready: function () {
							this.setValue(sHtmlValue);
							this.removeButtonGroup("font-style");
							this.addButtonGroup({
								name: "font-style",
								visible: true,
								priority: 10,
								customToolbarPriority: 10,
								buttons: [
									"bold", "italic"
								]
							});
						}
					});

					that.getView().byId("idVerticalLayout").addContent(that.oRichTextEditor);
			});
		}

	});
});
