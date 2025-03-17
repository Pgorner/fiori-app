/* global QUnit, sinon, tinymce */
sap.ui.define([
	"sap/ui/richtexteditor/library",
	"sap/ui/core/Core",
	"sap/ui/richtexteditor/qunit/RichTextEditorCommonTestsTinyMCE6",
	"sap/ui/richtexteditor/RichTextEditor",
	"sap/m/Dialog",
	"sap/ui/thirdparty/jquery"
], function (library, Core, richTextEditorCommonTests, RichTextEditor, Dialog, jQuery) {
	"use strict";

	QUnit.config.testTimeout = 6000;

	function wrapTinyMCE6Tests(sEditorType) {

		QUnit.module("Editor Specific: Common: TinyMCE6");

		QUnit.test("Check Toolbar groups", function (assert) {
			var done = assert.async(3),
				oRichTextEditor1 = new RichTextEditor("RTETestToolbarGroups", {
					editorType: sEditorType,
					width: "800px",
					height: "300px"
				});

			oRichTextEditor1.attachReady(function () {
				Core.applyChanges();
				assert.equal(document.querySelectorAll('div.tox-editor-container div.tox-editor-header div[role=toolbar] button[title=Justify].tox-tbtn').length, 1, "Text justify button should be there");
				done();
				assert.equal(document.querySelectorAll('div.tox-editor-container div.tox-editor-header div[role=toolbar] button[title=Emojis].tox-tbtn').length, 0, "The smiley button should not be there");
				done();
				oRichTextEditor1.setShowGroupInsert(true);

				setTimeout(function () {
					setTimeout(function () {
						oRichTextEditor1._pTinyMCEInitialized.then(function () {
							assert.equal(document.querySelectorAll('div.tox-editor-container div.tox-editor-header div[role=toolbar] button[title=Emojis].tox-tbtn').length, 1, "The smiley button should now be there");

							oRichTextEditor1.destroy();
							done();
						});
					}, 0);
				}, 0);
			});

			oRichTextEditor1.placeAt("content");
			Core.applyChanges();
		});

		QUnit.test("Editor Specific: Non-default Plugins", function (assert) {
			var done = assert.async(7);

			var oRichTextEditor1 = new RichTextEditor("RTETestPluginsNonDefault", {
				editorType: sEditorType,
				width: "400px",
				height: "300px"
			});

			oRichTextEditor1.addPlugin({
				name: "searchreplace"
			});

			oRichTextEditor1.addPlugin({
				name: "contextmenu"
			});

			oRichTextEditor1.addPlugin("preview");
			oRichTextEditor1.addPlugin("media");
			oRichTextEditor1.addButtonGroup("media");
			oRichTextEditor1.addButtonGroup("table");

			oRichTextEditor1.attachReady(function () {
				// Check for loaded plugins
				assert.ok(tinymce.PluginManager.lookup.media, "Media plugin loaded");
				done();
				assert.ok(tinymce.PluginManager.lookup.table, "Table plugin loaded");
				done();
				assert.equal(document.querySelectorAll('#RTETestPluginsNonDefault div.tox-editor-header div.tox-toolbar-overlord div[role=toolbar] button[title="Insert/edit media"]').length, 1, "Media button shown");
				done();
				assert.equal(document.querySelectorAll('#RTETestPluginsNonDefault div.tox-editor-header div.tox-toolbar-overlord div[role=toolbar] button[title=Table]').length, 1, "Table button shown");
				done();
				assert.notOk(tinymce.PluginManager.lookup.contextmenu, "Context menu plugin should not be loaded"); // removed in TinyMCE 6
				done();
				assert.ok(tinymce.PluginManager.lookup.searchreplace !== undefined, "Search/Replace plugin loaded");
				done();
				assert.ok(tinymce.PluginManager.lookup.preview, "Preview plugin loaded");

				setTimeout(function () {
					oRichTextEditor1.destroy();
					done();
				}, 0);
			});

			oRichTextEditor1.placeAt("content");
			Core.applyChanges();
		});

		QUnit.test("Height and autoresize", function (assert) {
			var done = assert.async(3);

			var oRichTextEditor1 = new RichTextEditor("RTEHeightAndAutoresize", {
				editorType: sEditorType,
				height: "300px",
				useLegacyTheme: false
			});

			oRichTextEditor1.placeAt("content");
			Core.applyChanges();

			assert.equal(document.getElementById("RTEHeightAndAutoresize").getAttribute("style"), "height: 300px;", "Height is applied when autoresize plugin is not used");
			done();

			oRichTextEditor1.addPlugin({
				name: "autoresize"
			});
			Core.applyChanges();

			oRichTextEditor1.attachReady(function () {
				assert.ok(tinymce.PluginManager.lookup.autoresize, "Autoresize plugin loaded");
				done();

				assert.notOk(document.getElementById("RTEHeightAndAutoresize").getAttribute("style"), "Height is not applied");

				setTimeout(function () {
					oRichTextEditor1.destroy();
					done();
				}, 0);
			});
		});

		QUnit.test("Focus in Popups", function (assert) {
			var done = assert.async();

			var oRichTextEditor2 = new RichTextEditor({
				editorType: sEditorType,
				width: "1000px",
				height: "99%"
			});
			oRichTextEditor2.addPlugin("media");
			oRichTextEditor2.addButtonGroup("media");
			Core.applyChanges();

			var oDialog = new Dialog("myDialog");

			oRichTextEditor2.attachReady(function () {
				var oButton = jQuery('.tox.tox-tinymce div.tox-editor-header div.tox-toolbar-overlord div[role=toolbar] button[title="Insert/edit media"]');
				oButton.trigger("click");
				setTimeout(function () {

					var oTextField = document.querySelector(".tox.tox-tinymce-aux .tox-dialog div[role=tabpanel] input[type=url]");
					oTextField.focus();
					assert.equal(document.activeElement, oTextField, "The Textfield is focused");
					oDialog.close();
					Core.applyChanges();
				}, 500); // Allow time for opening TinyMCE Popup
			});

			oDialog.attachAfterOpen(function () {
				oDialog.addContent(oRichTextEditor2);
				Core.applyChanges();
			});

			oDialog.attachAfterClose(function () {
				oDialog.destroy();
				done();
			});

			oDialog.open();
			Core.applyChanges();
		});

		QUnit.module("Editor Specific: Improve Coverage: TinyMCE6");

		QUnit.test("Toolbar groups setter", function (assert) {
			var oRichTextEditor = new RichTextEditor("RTEImproveCoverage", {
				editorType: sEditorType,
				width: "100%",
				height: "100%",
				tooltip: "Tooltip1"
			});

			var done = assert.async(50);
			var checkForVisibility = function (sAriaLabel, bVisible) {
				var aSplitButtons = ['Text color Black', 'Background color Black'];
				var sElementType = aSplitButtons.indexOf(sAriaLabel) !== -1 ? "div" : "button";

				assert.equal(document.querySelectorAll("#RTEImproveCoverage .tox.tox-tinymce .tox-toolbar-overlord " + sElementType + "[aria-label='" + sAriaLabel + "']").length, bVisible ? 1 : 0, sAriaLabel + " visible");
				done();
			};

			var aAriaLabels = ['Font System Font', 'Font size 12pt', 'Text color Black', 'Background color Black', //  Group Font
				'Align left', 'Align right', 'Align center', 'Justify', // Group Text Align
				'Cut', 'Copy', 'Paste', //Group Clipboard
				'Bullet list', 'Numbered list', 'Decrease indent', 'Increase indent', // Group Structure
				'Undo', 'Redo', // Group Undo
				'Insert/edit image', 'Emojis', // Group Insert
				'Insert/edit link', 'Remove link', // Group Link
				'Bold', 'Italic', 'Underline', 'Strikethrough' // Group Font Style
			];

			var fnShowGroups = function (bVisible) {
				oRichTextEditor.setShowGroupFontStyle(bVisible);
				oRichTextEditor.setShowGroupTextAlign(bVisible);
				oRichTextEditor.setShowGroupStructure(bVisible);
				oRichTextEditor.setShowGroupFont(bVisible);
				oRichTextEditor.setShowGroupClipboard(bVisible);
				oRichTextEditor.setShowGroupInsert(bVisible);
				oRichTextEditor.setShowGroupLink(bVisible);
				oRichTextEditor.setShowGroupUndo(bVisible);
			};

			oRichTextEditor.attachReady(function (oEvent) {
				for (var i = 0; i < aAriaLabels.length; i++) {
					checkForVisibility(aAriaLabels[i], true);
				}
				fnShowGroups(false);
				setTimeout(function () {
					setTimeout(function () {
						oRichTextEditor._pTinyMCEInitialized.then(function () {
							for (var i = 0; i < aAriaLabels.length; i++) {
								checkForVisibility(aAriaLabels[i], false);
							}
							oRichTextEditor.destroy();
						});
					}, 0);
				}, 0);
			});
			oRichTextEditor.placeAt("content");
			Core.applyChanges();

			fnShowGroups(true);
		});

		QUnit.test("_createButtonRowsTinyMCE", function (assert) {
			var done = assert.async(),
				oRichTextEditor = new RichTextEditor({editorType: library.EditorType.TinyMCE6}),
				oCreateButtonsSpy = sinon.spy(oRichTextEditor, "_createButtonRowsTinyMCE");

			oRichTextEditor.attachReady(function () {
				// assert
				assert.ok(oCreateButtonsSpy.calledOnce, "_createButtonRowsTinyMCE should be called");
				assert.deepEqual(oCreateButtonsSpy.returnValues[0], "bold italic underline strikethrough | cut copy paste | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | ", "should return correct values");

				// destroy
				oRichTextEditor.destroy();
				oCreateButtonsSpy.restore();
				done();
			});

			oRichTextEditor.placeAt("content");
			Core.applyChanges();
		});

		QUnit.test("_shouldLoadTinyMCE", function (assert) {

			var done = assert.async(),
				oRichTextEditor = new RichTextEditor({editorType: sEditorType});

			oRichTextEditor.attachReady(function () {
				// assert
				assert.notOk(oRichTextEditor._shouldLoadTinyMCE(), "_shouldLoadTinyMCE should return false because it is already loaded");

				window.tinymce.majorVersion = "4";
				assert.ok(oRichTextEditor._shouldLoadTinyMCE(), "_shouldLoadTinyMCE should return true when it doesn't match the current TinyMCE version in order to start loading it again");
				window.tinymce.majorVersion = "6";
				assert.notOk(oRichTextEditor._shouldLoadTinyMCE(), "_shouldLoadTinyMCE should return false when it match the current TinyMCE version");
				// destroy
				oRichTextEditor.destroy();
				done();
			});

			oRichTextEditor.placeAt("content");
			Core.applyChanges();
		});

		QUnit.module("Editor Specific: 'customToolbar' property: TinyMCE6");

		QUnit.test("SetCustomToolbar(false)", function (assert) {
			// arrange
			var done = assert.async(),
				oRichTextEditor = new RichTextEditor("RTESetCustomToolbar", {
					editorType: sEditorType,
					width: "100%",
					height: "300px",
					customToolbar: false,
					showGroupFont: true,
					showGroupUndo: true
				});

			oRichTextEditor.attachReady(function () {
				// assert
				assert.ok(document.querySelectorAll("#RTESetCustomToolbar .tox.tox-tinymce .tox-toolbar-overlord").length, "There should be a native TinyMCE toolbar");

				// destroy
				oRichTextEditor.destroy();
				done();
			});

			oRichTextEditor.placeAt("content");
			Core.applyChanges();
		});

		QUnit.test("SetCustomToolbar(true) after creating a RichTextEditor with no custom toolbar", function (assert) {
			// arrange
			var done = assert.async(2),
				oRichTextEditor = new RichTextEditor("RTECustomToolbarSetter", {
					editorType: sEditorType,
					width: "100%",
					height: "300px",
					customToolbar: false,
					showGroupFont: true,
					showGroupUndo: true
				});

			oRichTextEditor.attachReady(function (oEvent) {
				oRichTextEditor._pTinyMCEInitialized.then(function () {
					// act
					oRichTextEditor.setCustomToolbar(true);

					// assert
					assert.strictEqual(document.querySelectorAll("#RTECustomToolbarSetter .sapMTB").length, 0, "The toolbar should not be changed - no native toolbar shown");
					done();
					assert.ok(document.querySelectorAll("#RTECustomToolbarSetter .tox.tox-tinymce .tox-toolbar-overlord").length, "There should be a native TinyMCE toolbar");

					// destroy
					oRichTextEditor.destroy();
					done();
				});
			});

			oRichTextEditor.placeAt("content");
			Core.applyChanges();
		});

		QUnit.test("legacy theme sanitization", function (assert) {
			var done = assert.async();
			var sDialogImage;

			var oRichTextEditorLegacyTheme = new RichTextEditor("fnTestLegacyThemeSanitization", {
				editorType: "TinyMCE6",
				width: "400px",
				height: "300px",
				sanitizeValue: true,
				useLegacyTheme: true,
				customToolbar: false
			});

			var fnInjection = function() {
				tinymce.WindowManager(oRichTextEditorLegacyTheme._oEditor).alert('"<img src=x onerror=alert(1)>"');
			};

			oRichTextEditorLegacyTheme.attachReady(function () {
				fnInjection();
				sDialogImage = document.querySelector("[role='dialog'] img");

				assert.notOk(sDialogImage.hasAttribute(onerror), "Editor should have the correct content value");
				oRichTextEditorLegacyTheme.destroy();

				done();
			});

			oRichTextEditorLegacyTheme.placeAt("content");
			Core.applyChanges();
		});
	}

	richTextEditorCommonTests(library.EditorType.TinyMCE6);
	wrapTinyMCE6Tests(library.EditorType.TinyMCE6);
});
