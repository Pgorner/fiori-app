/* global QUnit, sinon, tinymce */
sap.ui.define([
	"sap/base/i18n/Localization",
	"sap/ui/core/Element",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/richtexteditor/RichTextEditor",
	"sap/m/Button",
	"sap/ui/core/Core",
	"sap/ui/core/UIArea",
	"sap/ui/core/InvisibleText",
	"sap/ui/core/mvc/XMLView",
	"sap/ui/thirdparty/jquery",
	"sap/ui/richtexteditor/library",
	"sap/base/Log"
], function(Localization, Element, nextUIUpdate, RichTextEditor, Button, Core, UIArea, InvisibleText, XMLView, jQuery, rteLibrary, Log) {
	"use strict";

	return function runRTECommonTests(sEditorType) {

		var fnTestControlLifecycle = function (assert) {
			var done = assert.async(7);

			var oRichTextEditor1 = new RichTextEditor("RTETestControlLifecycle", {
				editorType: sEditorType,
				width: "400px",
				height: "300px"
			});

			assert.ok(!!sap.ui.richtexteditor.RichTextEditorRenderer, "RichTextEditorRenderer class should exist");
			done();

			oRichTextEditor1.attachReady(function () {
				assert.ok(true, "This point should be reached, which means the editor is rendered and initialized correctly.");
				done();

				assert.ok(!!window.tinymce, "tinymce global must be definied");
				done();
				assert.ok(!!window.tinyMCE, "tinyMCE global must be definied");
				done();

				assert.ok(tinymce.activeEditor, "There must be one tinymce editor now");
				done();
				assert.equal(tinymce.activeEditor.id, "RTETestControlLifecycle-textarea", "tinymce id must be 'RTETestControlLifecycle-textarea'");

				oRichTextEditor1.destroy();
				done();

				assert.notOk(tinymce.activeEditor, "There must be no tinymce editor now");
				done();
			});

			oRichTextEditor1.placeAt("content");

			Core.applyChanges();
		};

		var fnTestControlSize = function (assert) {
			var done = assert.async(5);

			var oRichTextEditor1 = new RichTextEditor("RTETestControlSize", {
				editorType: sEditorType,
				width: "400px",
				height: "300px"
			});

			UIArea.registry.get("content") && UIArea.registry.get("content").removeAllContent();

			oRichTextEditor1.attachReady(function () {
				assert.ok(!!document.getElementById("RTETestControlSize-textarea_ifr"), "Editor Iframe exists");
				done();

				assert.ok(tinymce.activeEditor, "There must be again one tinymce editor now");
				done();
				assert.equal(document.getElementById("RTETestControlSize").offsetWidth, 400, "Editor width should be 400px");
				done();
				assert.equal(document.getElementById("RTETestControlSize").offsetHeight, 300, "Editor height should be 300px");

				oRichTextEditor1.destroy();
				done();

				assert.notOk(tinymce.activeEditor, "There must be no tinymce editor now");
				done();
			});

			oRichTextEditor1.placeAt("content");
			Core.applyChanges();
		};

		var fnTestNativeApi = function (assert) {
			var done = assert.async(6);

			var oRichTextEditor1 = new RichTextEditor("RTETestNativeApi", {
				editorType: sEditorType,
				width: "400px",
				height: "300px"
			});
			//Cleanup UIArea because placeAt only adds new control to UIArea
			UIArea.registry.get("content") && UIArea.registry.get("content").removeAllContent();

			oRichTextEditor1.attachReady(function () {
				assert.ok(tinymce.activeEditor, "There must be again one tinymce editor now");
				done();
				var oEditor = oRichTextEditor1.getNativeApi();
				assert.equal(oEditor.id, "RTETestNativeApi-textarea", "nativeApi id must be 'RTETestNativeApi-textarea'");
				done();
				assert.ok(oEditor === tinymce.activeEditor, "nativeApi must equal the existing editor"); // equals and deepEquals gives a "too much recursion" error
				done();

				assert.ok(!!oEditor.getContainer(), "Editor container is rendered");
				done();
				assert.ok(!!oEditor.getBody(), "Editor body is rendered");


				oRichTextEditor1.destroy();
				done();

				assert.notOk(tinymce.activeEditor, "There must be no tinymce editor now");
				done();
			});

			oRichTextEditor1.placeAt("content");
			Core.applyChanges();
		};

		var fnTestInitialValue = function (assert) {
			var done = assert.async(5);

			var myValue = "<p>Hello <strong>World!</strong></p>".toUpperCase();

			var oRichTextEditor1 = new RichTextEditor("RTETestInitialValue", {
				editorType: sEditorType,
				width: "400px",
				height: "300px",
				value: myValue
			});

			oRichTextEditor1.attachReady(function () {
				assert.equal(oRichTextEditor1.getValue().toUpperCase(), myValue, "Editor should have the correct value");
				done();

				var iframe = document.getElementById("RTETestInitialValue-textarea_ifr");
				var iframeHTML = iframe.contentWindow.document.body.innerHTML;
				var instHTML = oRichTextEditor1.getNativeApi().getBody().innerHTML;
				var contentHTML = oRichTextEditor1.getNativeApi().getContent();

				// check the actual content in two ways
				assert.equal(iframeHTML.toUpperCase(), myValue, "Editor iframe should have the correct value");
				done();
				assert.equal(instHTML.toUpperCase(), myValue, "Editor iframe should have the correct value");
				done();
				assert.equal(contentHTML.toUpperCase(), myValue, "Editor iframe should have the correct value");

				oRichTextEditor1.destroy();
				done();

				assert.notOk(tinymce.activeEditor, "There must be no tinymce editor now");
				done();
			});

			oRichTextEditor1.placeAt("content");
			Core.applyChanges();
		};

		var fnTestSetValue = function (assert) {
			var done = assert.async(5);

			var myValue = "<p>Hello <strong>World!</strong></p>".toUpperCase();

			var oRichTextEditor1 = new RichTextEditor("RTETestSetValue", {
				editorType: sEditorType,
				width: "400px",
				height: "300px"
			});

			oRichTextEditor1.attachReady(function () {
				oRichTextEditor1.setValue(myValue);
				assert.equal(oRichTextEditor1.getValue().toUpperCase(), myValue, "Editor should immediately have the correct value");
				done();

				setTimeout(function () {
					var iframe = document.getElementById("RTETestSetValue-textarea_ifr");
					var iframeHTML = iframe.contentWindow.document.body.innerHTML;
					var instHTML = oRichTextEditor1.getNativeApi().getBody().innerHTML;
					var contentHTML = oRichTextEditor1.getNativeApi().getContent();

					// check the actual content in two ways
					assert.equal(iframeHTML.toUpperCase(), myValue, "Editor iframe should have the correct value");
					done();
					assert.equal(instHTML.toUpperCase(), myValue, "Editor iframe should have the correct value");
					done();
					assert.equal(contentHTML.toUpperCase(), myValue, "Editor iframe should have the correct value");

					oRichTextEditor1.destroy();
					done();

					assert.notOk(tinymce.activeEditor, "There must be no tinymce editor now");
					done();
				}, 0);
			});

			oRichTextEditor1.placeAt("content");
			Core.applyChanges();
		};

		var fnTestSanitization = function (assert) {
			var done = assert.async(5);

			var myValue = "<p><span>Hello <strong>World!</strong></span><script>alert('XSS')<\/script></p>".toUpperCase();
			var mySanitizedValue = "<p>Hello <strong>World!</strong></p>".toUpperCase();
			var mySanitizedImmediateValue = "<p><span>Hello <strong>World!</strong></span></p>".toUpperCase();

			var oRichTextEditor1 = new RichTextEditor("RTETestSanitization", {
				editorType: sEditorType,
				width: "400px",
				height: "300px"
			});

			oRichTextEditor1.attachReady(function () {
				oRichTextEditor1.setValue(myValue);
				assert.equal(oRichTextEditor1.getValue().toUpperCase(), mySanitizedImmediateValue, "Editor should immediately have the correct (but unoptimized) value");
				done();
				setTimeout(function () {
					var iframe = document.getElementById("RTETestSanitization-textarea_ifr");
					var iframeHTML = iframe.contentWindow.document.body.innerHTML;
					var instHTML = oRichTextEditor1.getNativeApi().getBody().innerHTML;
					var contentHTML = oRichTextEditor1.getNativeApi().getContent();

					// check the actual content in two ways
					assert.equal(iframeHTML.toUpperCase(), mySanitizedValue, "Editor iframe should have the correct value");
					done();
					assert.equal(instHTML.toUpperCase(), mySanitizedValue, "Editor iframe should have the correct value");
					done();
					assert.equal(contentHTML.toUpperCase(), mySanitizedValue, "Editor iframe should have the correct value");

					oRichTextEditor1.destroy();
					done();

					assert.notOk(tinymce.activeEditor, "There must be no tinymce editor now");
					done();
				}, 0);
			});

			oRichTextEditor1.placeAt("content");
			Core.applyChanges();
		};

		var fnTestSanitizationOnTinyMCEChange = function (assert) {
			var oFireChangeSpy;
			var done = assert.async();

			var myValue = '<p style="text-align: left;">No semicolon should exist in the style attribute after sanitizing</p>';
			var mySanitizedValue = '<p style="text-align: left">No semicolon should exist in the style attribute after sanitizing</p>';

			var oRichTextEditor = new RichTextEditor({
				editorType: sEditorType,
				width: "400px",
				height: "300px"
			});


			oRichTextEditor.attachReady(function () {
				oFireChangeSpy = sinon.spy(oRichTextEditor, "fireChange");
				oRichTextEditor.setValue(myValue);
				assert.equal(oRichTextEditor.getValue(), mySanitizedValue, "Rich Text Editor should have the sanitized value");

				oRichTextEditor.onTinyMCEChange(oRichTextEditor._oEditor);
				assert.equal(oFireChangeSpy.notCalled, true, "No change event is fired - The RTE content value is the same as the one returned from the TinyMCE after sanitization");

				oRichTextEditor.setSanitizeValue(false);
				oRichTextEditor.setValue(myValue);
				assert.equal(oRichTextEditor.getValue(), myValue, "Rich Text Editor should have the unsanitized value");

				oRichTextEditor.onTinyMCEChange(oRichTextEditor._oEditor);
				assert.equal(oRichTextEditor.getValue(), myValue, "Rich Text Editor value should still be the unsanitized");

				oRichTextEditor.destroy();
				done();
			});

			oRichTextEditor.placeAt("content");
			Core.applyChanges();
		};

		var fnTestLinkTargets = function (assert) {
			var done = assert.async(3);

			var myValue = "<p><a id='l1' href='http://www.sap.com'>link1</a><a id='l2' target='_top' href='http://www.sap.com'>link2</a></p>";

			var oRichTextEditor1 = new RichTextEditor("RTETestLinkTargets", {
				editorType: sEditorType,
				width: "400px",
				height: "300px",
				editable: false
			});

			oRichTextEditor1.attachReady(function () {
				oRichTextEditor1.setValue(myValue);

				setTimeout(function () {
					var oDoc = oRichTextEditor1.getNativeApi().getDoc();

					// check the actual content in two ways
					assert.equal(oDoc.getElementById("l1").target, "_blank", "Target should be blank");
					done();
					assert.equal(oDoc.getElementById("l2").target, "_blank", "Target should be blank");

					oRichTextEditor1.destroy();
					done();

					assert.notOk(tinymce.activeEditor, "There must be no tinymce editor now");
					done();
				}, 0);
			});

			oRichTextEditor1.placeAt("content");
			Core.applyChanges();
		};

		QUnit.module("Common");

		QUnit.test("Control Creation and Destruction", fnTestControlLifecycle.bind(this));
		QUnit.test("Control Creation and Size", fnTestControlSize.bind(this));
		QUnit.test("getNativeApi", fnTestNativeApi);
		QUnit.test("Check InitialValue", fnTestInitialValue);
		QUnit.test("setValue", fnTestSetValue);

		QUnit.test("setValue with comments", async function(assert) {
			var done = assert.async(5);

			var myValue = '<!-- my comment--><p>My text</p>';
			var oRichTextEditor = new RichTextEditor("RTEsetValue", {
				editorType: sEditorType,
				value: myValue
			});

			var initSpy = sinon.spy(oRichTextEditor, "_initializeTinyMCE");
			var configCbSpy = sinon.spy(oRichTextEditor, "_createConfigTinyMCE");

			oRichTextEditor.attachReady(function () {
				//Assert
				assert.ok(initSpy.callCount, "_initializeTinyMCE should have been called.");
				done();
				assert.ok(!initSpy.threw(), "_initializeTinyMCE should not have thrown exceptions");
				done();
				assert.ok(configCbSpy.callCount, "_initializeTinyMCE should have been called.");
				done();
				assert.ok(!configCbSpy.threw(), "_initializeTinyMCE should not have thrown exceptions");


				setTimeout(function () {
					// Act
					oRichTextEditor.destroy();
					done();

					// Assert
					assert.notOk(tinymce.activeEditor, "There must be no tinymce editor now");
					done();
				}, 0);
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("setValue with HTML", async function(assert) {
			var done = assert.async(6);

			var myValue = '<!DOCTYPE>';
			var oRichTextEditor = new RichTextEditor("RTEsetValueHTML", {
				editorType: sEditorType,
				sanitizeValue: false,
				value: myValue
			});

			var initSpy = sinon.spy(oRichTextEditor, "_initializeTinyMCE");
			var configCbSpy = sinon.spy(oRichTextEditor, "_createConfigTinyMCE");

			oRichTextEditor.attachReady(function () {
				//Assert
				var iZeroWidthSpaceIndex = oRichTextEditor._textAreaDom.value.toString().indexOf("&#8203;");

				assert.strictEqual(iZeroWidthSpaceIndex, -1, "No zero width space is added.");
				done();
				assert.ok(initSpy.callCount, "_initializeTinyMCE should have been called.");
				done();
				assert.ok(!initSpy.threw(), "_initializeTinyMCE should not have thrown exceptions");
				done();

				assert.ok(configCbSpy.callCount, "_initializeTinyMCE should have been called.");
				done();
				assert.ok(!configCbSpy.threw(), "_initializeTinyMCE should not have thrown exceptions");

				setTimeout(function () {
					// Act
					oRichTextEditor.destroy();
					done();

					// Assert
					assert.notOk(tinymce.activeEditor, "There must be no tinymce editor now");
					done();
				}, 0);
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("setValue sanitization escaping", async function(assert) {
			var done = assert.async(2),
				oRichTextEditor = new RichTextEditor("RTEsetValueEscaping", {
					editorType: sEditorType,
					value: null
				});


			oRichTextEditor.attachReady(function () {
				assert.equal(oRichTextEditor.getValue(), "", "RTE's content should be empty");

				setTimeout(function () {
					// Act
					oRichTextEditor.destroy();
					done();

					// Assert
					assert.notOk(tinymce.activeEditor, "There must be no tinymce editor now");
					done();
				}, 0);
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("setValue sanitization", fnTestSanitization);
		QUnit.test("setValue sanitization", fnTestSanitizationOnTinyMCEChange);
		QUnit.test("readonly link target modification", fnTestLinkTargets);

		QUnit.test("Enable 'dirty' event usage", async function(assert) {
			var done = assert.async(),
				oRichTextEditor = new RichTextEditor({
					editorType: sEditorType,
					customToolbar: true,
					value: null
				});

			oRichTextEditor.attachReady(function () {
				assert.equal(oRichTextEditor.getNativeApi().isDirty(), false, "RTE's dirty state should be clean if no updates are made after initialization");

				// Clean
				oRichTextEditor.destroy();
				done();
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.module("Improve Coverage", {
			beforeEach: function () {
				this.oRichTextEditor = new RichTextEditor("RTEImproveCoverage", {
					editorType: sEditorType,
					width: "100%",
					height: "100%",
					tooltip: "Tooltip1"
				});
			},
			afterEach: function () {
				this.oRichTextEditor.destroy();
			}
		});

		function containsNamedObject(aObjects, sObjectName) {
			for (var i = 0, iLen = aObjects.length; i < iLen; ++i) {
				if (aObjects[i].name === sObjectName) {
					return true;
				}
			}
			return false;
		}

		QUnit.test("Editor initialization", async function(assert) {
			var done = assert.async(9),
				iReadyCalled = 0,
				iBeforeInitCalled = 0,
				iChangeCalled = 0;

			assert.ok(iBeforeInitCalled === 0, "No init events have been fired");
			done();
			assert.ok(iReadyCalled === 0, "No ready events have been fired");
			done();
			assert.ok(iChangeCalled === 0, "No change events have been fired");
			done();

			var oRichTextEditor = new RichTextEditor({
				editorType: sEditorType,
				beforeEditorInit: function () {
					iBeforeInitCalled++;
				},
				ready: function () {
					setTimeout(function () {
						assert.ok(iBeforeInitCalled === 1, "One init events has been fired");
						done();
						assert.ok(iReadyCalled === 1, "One ready events has been fired");
						done();
						assert.ok(iChangeCalled === 0, "No change events have been fired");

						oRichTextEditor.destroy();
						done();
					}, 200);

					iReadyCalled++;
				},
				change: function () {
					iChangeCalled++;
				}
			});

			assert.ok(iBeforeInitCalled === 0, "No init events have been fired");
			done();
			assert.ok(iReadyCalled === 0, "No ready events have been fired");
			done();
			assert.ok(iChangeCalled === 0, "No change events have been fired");
			done();

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("Plugins", async function(assert) {
			var done = assert.async(15),
				iReadyCalled = 0,
				iBeforeInitCalled = 0,
				iChangeCalled = 0;

			assert.ok(iBeforeInitCalled === 0, "No init events have been fired");
			done();
			assert.ok(iReadyCalled === 0, "No ready events have been fired");
			done();
			assert.ok(iChangeCalled === 0, "No change events have been fired");
			done();

			var oRichTextEditor = new RichTextEditor({
				editorType: sEditorType,
				beforeEditorInit: function () {
					iBeforeInitCalled++;
				},
				ready: function () {
					setTimeout(function () {
						assert.equal(iBeforeInitCalled, 1, "One init events has been fired");
						done();
						assert.equal(iReadyCalled, 1, "One ready events has been fired");
						done();
						assert.equal(iChangeCalled, 0, "No change events have been fired");

						oRichTextEditor.destroy();
						done();
					}, 200);

					iReadyCalled++;
				},
				change: function () {
					iChangeCalled++;
				}
			});

			var aAddedPlugins = ["media", "autolink", "fullscreen", "preview"];
			var aRemovedPlugins = ["media", "preview"];

			for (var i = 0, iLen = aAddedPlugins.length; i < iLen; ++i) {
				oRichTextEditor.addPlugin(aAddedPlugins[i]);
			}

			var aPlugins = oRichTextEditor.getPlugins();
			for (var i = 0, iLen = aAddedPlugins.length; i < iLen; ++i) {
				assert.ok(
					containsNamedObject(aPlugins, aAddedPlugins[i]),
					"Plugin was correctly added: " + aAddedPlugins[i]
				);
				done();
			}

			for (var i = 0, iLen = aRemovedPlugins.length; i < iLen; ++i) {
				oRichTextEditor.removePlugin(aRemovedPlugins[i]);
			}

			var aPlugins = oRichTextEditor.getPlugins();
			for (var i = 0, iLen = aRemovedPlugins.length; i < iLen; ++i) {
				assert.ok(
					!containsNamedObject(aPlugins, aRemovedPlugins[i]),
					"Plugin was correctly removed: " + aRemovedPlugins[i]
				);
				done();
			}

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();

			assert.ok(iBeforeInitCalled === 0, "No init events have been fired");
			done();
			assert.ok(iReadyCalled === 0, "No ready events have been fired");
			done();
			assert.ok(iChangeCalled === 0, "No change events have been fired");
			done();
		});

		QUnit.test("Plugins init", function (assert) {
			var oRichTextEditor = new RichTextEditor({
				editorType: sEditorType,
				showGroupLink: true
			});

			if (oRichTextEditor.getEditorType() === rteLibrary.EditorType.TinyMCE || oRichTextEditor.getEditorType() === rteLibrary.EditorType.TinyMCE6) {
				assert.strictEqual(oRichTextEditor.getPlugins().length, 7, "Plugins should have been initialized");
			} else {
				assert.strictEqual(oRichTextEditor.getPlugins().length, 11, "Plugins should have been initialized");
			}

			oRichTextEditor.destroy();
			oRichTextEditor = null;
		});


		QUnit.test("Custom plugins init", async function(assert) {
			var done = assert.async(),
				oRichTextEditor = new RichTextEditor({
					editorType: sEditorType,
					customToolbar: true,
					plugins: [{
						name: "fullscreen"
					}],
					ready: function () {
						setTimeout(function () {

							assert.strictEqual(oRichTextEditor.getPlugins().length, 2, "Plugins should have been initialized correctly");

							oRichTextEditor.destroy();
							oRichTextEditor = null;
							done();
						}, 500);
					}
				}).placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("Button Groups", async function(assert) {
			var done = assert.async(33),
				iReadyCalled = 0,
				iBeforeInitCalled = 0,
				iChangeCalled = 0;

			assert.ok(iBeforeInitCalled === 0, "No init events have been fired");
			done();
			assert.ok(iReadyCalled === 0, "No ready events have been fired");
			done();
			assert.ok(iChangeCalled === 0, "No change events have been fired");
			done();

			var oRichTextEditor = new RichTextEditor({
				editorType: sEditorType,
				beforeEditorInit: function () {
					iBeforeInitCalled++;
				},
				ready: function () {
					setTimeout(function () {
						assert.ok(iBeforeInitCalled === 1, "One init events has been fired");
						done();
						assert.ok(iReadyCalled === 1, "One ready events has been fired");
						done();
						assert.ok(iChangeCalled === 0, "No change events have been fired");

						oRichTextEditor.destroy();
						done();
					}, 200);

					iReadyCalled++;
				},
				change: function () {
					iChangeCalled++;
				}
			});

			var aButtons = [{
				name: "font-style",
				visible: true,
				row: 0,
				priority: 10,
				buttons: [
					"bold", "italic", "underline", "strikethrough"
				]
			}, {
				// Text Align group
				name: "text-align",
				visible: true,
				row: 0,
				priority: 20,
				buttons: [
					"justifyleft", "justifycenter", "justifyright", "justifyfull"
				]
			}, {
				name: "font",
				visible: false,
				row: 0,
				priority: 30,
				buttons: [
					"fontselect", "fontsizeselect", "forecolor", "backcolor"
				]
			}, {
				name: "formatselect",
				visible: true,
				row: 0,
				priority: 30,
				buttons: [
					"paragraph", "h1", "h2", "h3", "h4", "h5", "h6", "pre"
				]
			}, {
				name: "clipboard",
				visible: true,
				row: 1,
				priority: 10,
				buttons: [
					"cut", "copy", "paste"
				]
			}, {
				name: "structure",
				visible: true,
				row: 1,
				priority: 20,
				buttons: [
					"bullist", "numlist", "outdent", "indent"
				]
			}];


			for (var i = 0, iLen = aButtons.length; i < iLen; ++i) {
				oRichTextEditor.removeButtonGroup(aButtons[i].name);
			}

			var aButtonGroups = oRichTextEditor.getButtonGroups();
			for (var i = 0, iLen = aButtons.length; i < iLen; ++i) {
				assert.ok(
					!containsNamedObject(aButtonGroups, aButtons[i].name),
					"Button Group was correctly removed: " + aButtons[i]
				);
				done();
			}

			for (var i = 0, iLen = aButtons.length; i < iLen; ++i) {
				oRichTextEditor.addButtonGroup(aButtons[i]);
			}

			var aButtonGroups = oRichTextEditor.getButtonGroups();
			for (var i = 0, iLen = aButtons.length; i < iLen; ++i) {
				assert.ok(
					containsNamedObject(aButtonGroups, aButtons[i].name),
					"Button Group was correctly added: " + aButtons[i]
				);
				done();
			}

			for (var i = 0, iLen = aButtons.length; i < iLen; ++i) {
				oRichTextEditor.removeButtonGroup(aButtons[i].name);
			}

			aButtonGroups = oRichTextEditor.getButtonGroups();
			for (var i = 0, iLen = aButtons.length; i < iLen; ++i) {
				assert.ok(
					!containsNamedObject(aButtonGroups, aButtons[i].name),
					"Button Group was removed: " + aButtons[i]
				);
				done();
			}

			oRichTextEditor.setButtonGroups(aButtons);

			aButtonGroups = oRichTextEditor.getButtonGroups();
			for (var i = 0, iLen = aButtons.length; i < iLen; ++i) {
				assert.ok(
					containsNamedObject(aButtonGroups, aButtons[i].name),
					"Button Group was added: " + aButtons[i].name
				);
				done();
			}

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();

			assert.ok(iBeforeInitCalled === 0, "No init events have been fired");
			done();
			assert.ok(iReadyCalled === 0, "No ready events have been fired");
			done();
			assert.ok(iChangeCalled === 0, "No change events have been fired");
			done();
		});

		QUnit.test("addButtonGroup called without parameter should return 'this'", async function(assert) {
			var done = assert.async();
			var oSpy;

			this.oRichTextEditor.placeAt("content");
			await nextUIUpdate();

			this.oRichTextEditor.attachReady(function () {
				// arrange
				oSpy = this.spy(this.oRichTextEditor, "addButtonGroup");

				// act
				this.oRichTextEditor.addButtonGroup();

				// assert
				assert.strictEqual(oSpy.called, true, "Add button group was called.");
				assert.strictEqual(oSpy.firstCall.returned(this.oRichTextEditor), true, "the RTE instance was returned.");

				// clean
				oSpy.restore();
				done();
			}.bind(this));
		});

		QUnit.test("addButtonGroup called with existing group should log warning", async function(assert) {
			var done = assert.async();
			var oSpy;
			var sWarningString = "Trying to add already existing group: font. Please remove the group first and then add it.";

			this.oRichTextEditor.placeAt("content");
			await nextUIUpdate();

			this.oRichTextEditor.attachReady(function () {
				// arrange
				oSpy = this.spy(Log, "warning");

				// act
				this.oRichTextEditor.addButtonGroup("font");

				// assert
				assert.strictEqual(oSpy.called, true, "Add button group was called.");
				assert.strictEqual(oSpy.firstCall.args[0], sWarningString, "Correct message was logged.");

				// clean
				oSpy.restore();
				done();
			}.bind(this));
		});

		QUnit.test("setButtonGroups called with incorrect parameter should log error", async function(assert) {
			var done = assert.async();
			var oSpy;
			var sErrorString = "Button groups cannot be set: test is not an array.";

			this.oRichTextEditor.placeAt("content");
			await nextUIUpdate();

			this.oRichTextEditor.attachReady(function () {
				// arrange
				oSpy = this.spy(Log, "error");

				// act
				this.oRichTextEditor.setButtonGroups("test");

				// assert
				assert.strictEqual(oSpy.called, true, "Add button group was called.");
				assert.strictEqual(oSpy.firstCall.args[0], sErrorString, "Correct message was logged.");

				// clean
				oSpy.restore();
				done();
			}.bind(this));
		});

		QUnit.test("setPlugins called with incorrect parameter should log error", async function(assert) {
			var done = assert.async();
			var oSpy;
			var sErrorString = "Plugins cannot be set: test is not an array.";

			this.oRichTextEditor.placeAt("content");
			await nextUIUpdate();

			this.oRichTextEditor.attachReady(function () {
				// arrange
				oSpy = this.spy(Log, "error");

				// act
				this.oRichTextEditor.setPlugins("test");

				// assert
				assert.strictEqual(oSpy.called, true, "Add button group was called.");
				assert.strictEqual(oSpy.firstCall.args[0], sErrorString, "Correct message was logged.");

				// clean
				oSpy.restore();
				done();
			}.bind(this));
		});

		QUnit.test("Directionality = RTL", async function(assert) {
			var done = assert.async();
			var oRichTextEditor = new RichTextEditor("rtl-rte", {
				editorType: sEditorType,
				textDirection: sap.ui.core.TextDirection.RTL,
				customToolbar: true,
				value: "Lorem Ipsum",
				ready: function () {
					setTimeout(function () {
						assert.strictEqual(oRichTextEditor.getNativeApi().iframeElement.contentWindow.document.body.getAttribute("dir"), "rtl", "Text Direction is applied correctly");
						oRichTextEditor.destroy();
						done();
					}, 200);
				}
			});
			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("Directionality = LTR", async function(assert) {
			var done = assert.async();
			var oRichTextEditor = new RichTextEditor({
				editorType: sEditorType,
				textDirection: sap.ui.core.TextDirection.LTR,
				ready: function () {
					setTimeout(function () {
						assert.strictEqual(oRichTextEditor.getNativeApi().iframeElement.contentWindow.document.body.getAttribute("dir"), "ltr", "Text Direction is applied correctly");
						oRichTextEditor.destroy();
						done();
					}, 200);
				}
			});
			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("Directionality (default value applied)", async function(assert) {
			var done = assert.async();
			var oRichTextEditor = new RichTextEditor({
				editorType: sEditorType,
				ready: function () {
					setTimeout(function () {
						assert.strictEqual(oRichTextEditor.getNativeApi().iframeElement.contentWindow.document.body.getAttribute("dir"), "ltr", "Text Direction is applied correctly");
						oRichTextEditor.destroy();
						done();
					}, 200);
				}
			});
			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("SetValue 2 times", function (assert) {
			var done = assert.async();
			var spySetValue = sinon.spy(this.oRichTextEditor, "setValueTinyMCE");
			this.oRichTextEditor.setValue("TEXT");
			this.oRichTextEditor.setValue("TEXT");
			assert.equal(spySetValue.callCount, 1, "Same value only set once.");
			done();
		});

		QUnit.test("Wrapping/Required setter", function (assert) {
			var done = assert.async();
			var spyReinitialize = sinon.spy(this.oRichTextEditor, "reinitializeTinyMCE");
			this.oRichTextEditor.setWrapping(false);
			this.oRichTextEditor.setRequired(true);
			setTimeout(function () {
				assert.equal(spyReinitialize.callCount, 1, "Editor is only reinitialized once.");
				done();
			}, 0);
		});

		QUnit.test("ID with special characters", async function(assert) {
			var done = assert.async();
			var oRichTextEditor = new RichTextEditor(
				"test.test::--Test",
				{editorType: sEditorType}
			);

			oRichTextEditor.attachReady(function () {
				// assert
				assert.ok(true, "Text editor is initialized correctly");

				// destroy
				oRichTextEditor.destroy();
				done();
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.module("'customToolbar' property");

		QUnit.test("Lifecycle", async function(assert) {
			// arrange
			var done = assert.async(7),
				oRichTextEditor1 = new RichTextEditor("RTELifecycle", {
					editorType: sEditorType,
					customToolbar: true,
					width: "400px",
					height: "300px"
				});

			// assert
			assert.ok(!!sap.ui.richtexteditor.RichTextEditorRenderer, "RichTextEditorRenderer class should exist");
			done();
			oRichTextEditor1.attachReady(function () {

				// assert
				assert.ok(true, "This point should be reached, which means the editor is rendered and initialized correctly.");
				done();
				assert.ok(!!window.tinymce, "tinymce global must be definied");
				done();
				assert.ok(!!window.tinyMCE, "tinyMCE global must be definied");
				done();
				assert.ok(tinymce.activeEditor, "There must be one tinymce editor now");
				done();
				assert.equal(tinymce.activeEditor.id, "RTELifecycle-textarea", "tinymce id must be 'RTELifecycle-textarea'");

				// destroy
				oRichTextEditor1.destroy();
				done();
				// assert
				assert.notOk(tinymce.activeEditor, "There must be no tinymce editor now");
				done();
			});

			oRichTextEditor1.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("customToolbar setter", async function(assert) {
			var done = assert.async(4),
				Log = sap.ui.require('sap/base/Log');

			assert.ok(Log, "Log module should be loaded");
			done();

			var oRichTextEditor = new RichTextEditor({
					editorType: sEditorType,
					width: "100%",
					height: "300px",
					customToolbar: true,
					showGroupFont: true,
					showGroupUndo: true
				}),
				oSetCustomToolbarSpy = sinon.spy(oRichTextEditor, "setCustomToolbar"),
				oLogSpy = sinon.spy(Log, "error");

			oRichTextEditor.attachReady(function () {
				oRichTextEditor._pTinyMCEInitialized.then(function () {
					// act
					oRichTextEditor.setCustomToolbar(false);

					// assert
					assert.ok(oSetCustomToolbarSpy.calledOnce, "The setter function was called once");
					done();
					assert.ok(oLogSpy.calledOnce, "There was one error logged in the console");
					done();
					assert.ok(oRichTextEditor.getAggregation("_toolbarWrapper"), "The custom toolbar still exists");

					// destroy
					oRichTextEditor.destroy();
					done();
					oLogSpy.restore();
				});
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("SetCustomToolbar(true)", async function(assert) {
			// arrange
			var done = assert.async(),
				oRichTextEditor = new RichTextEditor({
					editorType: sEditorType,
					width: "100%",
					height: "300px",
					customToolbar: true,
					showGroupFont: true,
					showGroupUndo: true
				});

			oRichTextEditor.attachReady(function () {
				// assert
				assert.equal(document.querySelectorAll("#myRTE2 .mce-toolbar").length, 0, "There should not be a native TinyMCE toolbar");

				// destroy
				oRichTextEditor.destroy();
				done();
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("SetCustomToolbar(false) after creating a RichTextEditor with a custom toolbar", async function(assert) {
			// arrange
			var done = assert.async(2),
				oRichTextEditor = new RichTextEditor("RTEFalseCustomToolbar", {
					editorType: sEditorType,
					width: "100%",
					height: "300px",
					customToolbar: true,
					showGroupFont: true,
					showGroupUndo: true
				});

			oRichTextEditor.attachReady(function (oEvent) {
				setTimeout(function () {
					// assert
					assert.equal(document.querySelectorAll("#RTEFalseCustomToolbar .mce-toolbar").length, 0, "The toolbar should not be changed - no native toolbar shown");
					done();
					assert.equal(document.querySelectorAll("#RTEFalseCustomToolbar .mce-toolbar .mce-btn[aria-label='Undo']").length, false, "The native undo button should not be visible");

					// destroy
					oRichTextEditor.destroy();
					done();
				}, 0);
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();

			// act
			oRichTextEditor.setCustomToolbar(false);
			oRichTextEditor.setShowGroupUndo(false);
		});

		QUnit.test("Group Visibility", async function(assert) {
			// arrange
			var done = assert.async(42),
				oRichTextEditor = new RichTextEditor({
					editorType: sEditorType,
					width: "100%",
					height: "300px",
					customToolbar: true,
					showGroupFont: true,
					showGroupUndo: true,
					showGroupLink: true,
					showGroupInsert: true
				});

			var aAriaLabels = ['FontFamily', 'FontSize', 'TextColor', 'BackgroundColor', //  Group Font
				'TextAlign', // Group Text Align
				'Cut', 'Copy', 'Paste', //Group Clipboard
				'UnorderedList', 'OrderedList', 'Indent', 'Outdent', // Group Structure
				'Undo', 'Redo', // Group Undo
				'Bold', 'Italic', 'Underline', 'Strikethrough', // Group Font Style
				'InsertLink', 'Unlink', // Group Link
				'InsertImage' // Group Insert
			];

			var fnShowGroups = function (bVisible) {
				oRichTextEditor.setShowGroupFontStyle(bVisible);
				oRichTextEditor.setShowGroupTextAlign(bVisible);
				oRichTextEditor.setShowGroupStructure(bVisible);
				oRichTextEditor.setShowGroupFont(bVisible);
				oRichTextEditor.setShowGroupClipboard(bVisible);
				oRichTextEditor.setShowGroupUndo(bVisible);
				oRichTextEditor.setShowGroupLink(bVisible);
				oRichTextEditor.setShowGroupInsert(bVisible);
			};

			oRichTextEditor.attachReady(function (oEvent) {
				for (var i = 0; i < aAriaLabels.length; i++) {
					// assert
					assert.ok(Element.getElementById(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getId() + "-" + aAriaLabels[i]).getVisible(), aAriaLabels[i] + " visible");
					done();
				}
				// act
				fnShowGroups(false);
				setTimeout(function () {
					setTimeout(function () {
						oRichTextEditor._pTinyMCEInitialized.then(function () {
							for (var i = 0; i < aAriaLabels.length; i++) {
								// assert
								assert.ok(!Element.getElementById(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getId() + "-" + aAriaLabels[i]).getVisible(), aAriaLabels[i] + " invisible");
								done();
							}
							// destroy
							oRichTextEditor.destroy();
						});
					}, 100);
				}, 100);
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("'editable: false' + 'customToolbar: true'", async function(assert) {
			// arrange
			var done = assert.async(),
				oRichTextEditor = new RichTextEditor({
					editorType: sEditorType,
					editable: false,
					customToolbar: true
				});

			oRichTextEditor.attachReady(function (oEvent) {
				setTimeout(function () {
					// assert
					assert.notOk(oRichTextEditor._bHasNativeMobileSupport, "The mobile configuration should not be set.");
					assert.ok(!oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getEnabled(), "The toolbar should be disabled.");

					// destroy
					oRichTextEditor.destroy();
					done();
				}, 0);
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("'customToolbar: true' + setEditable(false)", async function(assert) {
			// arrange
			var done = assert.async(),
				oRichTextEditor = new RichTextEditor({
					editorType: sEditorType,
					customToolbar: true
				});

			// act
			oRichTextEditor.setEditable(false);

			oRichTextEditor.attachReady(function (oEvent) {
				setTimeout(function () {
					// assert
					assert.ok(!oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getEnabled(), "The toolbar should be disabled.");

					// destroy
					oRichTextEditor.destroy();
					done();
				}, 0);
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("'customToolbar: true' + setEditable(false) delayed", async function(assert) {
			// arrange
			var done = assert.async(),
				oRichTextEditor = new RichTextEditor({
					editorType: sEditorType,
					customToolbar: true
				});

			oRichTextEditor.attachReady(function () {
				// arrange
				var oSpy = this.spy(oRichTextEditor.getAggregation("_toolbarWrapper"), "setToolbarEnabled");

				// act
				oRichTextEditor.setEditable(false);

				// assert
				assert.ok(oSpy.called, "setToolbarEnabled should be called...");
				assert.strictEqual(oSpy.firstCall.args[0], false, "... with the correct parameter.");

				// destroy
				oSpy.restore();
				oRichTextEditor.destroy();
				done();
			}.bind(this));

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});


		QUnit.test("'customToolbar: true' + TinyMCE mobile support enabled", async function(assert) {
			// arrange
			var done = assert.async(),
				oSpy,
				oStub,
				oRichTextEditor = new RichTextEditor({
					editorType: sEditorType,
					customToolbar: true
				}).attachBeforeEditorInit(function (oEvent) {
					oSpy = sinon.spy(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar"), "removeStyleClass");
					oStub = sinon.stub(oRichTextEditor, "_tinyMCEDesktopDetected").returns(false);

					var oConfig = oEvent.getParameter('configuration');
					oConfig.mobile = {
						theme: "mobile",
						toolbar: ['undo', 'redo', 'bold', 'italic', 'underline', 'link', 'unlink', 'image', 'bullist', 'numlist', 'fontsizeselect', 'forecolor', 'styleselect', 'removeformat']
					};
				});

			oRichTextEditor.attachReady(function () {
				setTimeout(function () {
					// assert
					assert.notOk(oSpy.calledOnce, "The custom toolbar should not be showed on non-desktop devices");
					assert.ok(oRichTextEditor._bHasNativeMobileSupport, "The mobile configuration should be detected.");

					// destroy
					oSpy.restore();
					oStub.restore();
					oRichTextEditor.destroy();
					done();
				}, 0);
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("'editable: false' + 'customToolbar: true' + setEditable(true)", async function(assert) {
			// arrange
			var done = assert.async(),
				oRichTextEditor = new RichTextEditor({
					editorType: sEditorType,
					customToolbar: true,
					editable: false
				});

			// act
			oRichTextEditor.setEditable(true);

			oRichTextEditor.attachReady(function (oEvent) {
				setTimeout(function () {
					// assert
					assert.ok(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getEnabled(), "The toolbar should be enabled.");

					// destroy
					oRichTextEditor.destroy();
					done();
				}, 0);
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("Link manipulation", async function(assert) {
			// arrange
			var done = assert.async(),
				oRichTextEditor = new RichTextEditor({
					editorType: sEditorType,
					showGroupLink: true,
					customToolbar: true,
					value: '<a href="www.test.com">Test</a> \n\n\n\n Some text here'
				});

			oRichTextEditor.attachReady(function (oEvent) {
				setTimeout(function () {
					// Arrange
					var aLinks,
						oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper"),
						oTinyMce = oRichTextEditor.getNativeApi();

					// Act
					// Move the cursor to the end of the
					oTinyMce.selection.select(oTinyMce.getBody(), true);
					oTinyMce.selection.collapse(false);

					oToolbarWrapper.handleLinks('www.test.com', null, null, "Another tEst");
					Core.applyChanges();

					aLinks = oTinyMce.dom.select('a[href="www.test.com"]');

					// Assert
					assert.strictEqual(aLinks.length, 2, "There should be 2 links in the content");
					assert.ok(aLinks[0].getAttribute("href") === aLinks[1].getAttribute("href"), "Href(s) should point to the same url");
					assert.ok(aLinks[0].innerText, 'Test', "First link's text should be 'Test'");
					assert.ok(aLinks[1].innerText, 'Another tEst', "Second link's text should be 'Another tEst'");

					// destroy
					oRichTextEditor.destroy();
					setTimeout(done);
				});
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("Calling addButtonGroup should call the 'addButtonToContent' method of the toolbar", async function(assert) {
			var done = assert.async();
			var oRichTextEditor = new RichTextEditor({
				customToolbar: true
			});
			var oSpy;

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();

			oRichTextEditor.attachReady(function () {
				// arrange
				oSpy = this.spy(oRichTextEditor.getAggregation("_toolbarWrapper"), "addButtonGroupToContent");

				// act
				oRichTextEditor.addButtonGroup("formatselect");

				// assert
				assert.strictEqual(oSpy.called, true, "ToolbarWrapper method was called.");

				// clean
				oSpy.restore();
				oRichTextEditor.destroy();
				done();
			}.bind(this));
		});

		QUnit.test("Calling addButtonGroup with configuration without 'name' or 'buttons' properties should log error.", async function(assert) {
			var done = assert.async();
			var oRichTextEditor = new RichTextEditor({
				customToolbar: true
			});
			var oSpy;
			var sMissingParametersErrorString = "The properties 'name' and 'buttons' are mandatory for the group configuration object. Please make sure they exist within the provided configuration.";

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();

			oRichTextEditor.attachReady(function () {
				// arrange
				oSpy = this.spy(Log, "error");

				// act
				oRichTextEditor.addButtonGroup({});

				// assert
				assert.strictEqual(oSpy.called, true, "Log error method was called.");
				assert.strictEqual(oSpy.firstCall.args[0], sMissingParametersErrorString, "Correct error message was logged.");

				// act
				oRichTextEditor.addButtonGroup({
					name: "test"
				});

				// assert
				assert.strictEqual(oSpy.callCount, 2, "Log error method was called second time.");
				assert.strictEqual(oSpy.secondCall.args[0], sMissingParametersErrorString, "Correct error message was logged.");

				// clean
				oSpy.restore();
				oRichTextEditor.destroy();
				done();
			}.bind(this));
		});

		QUnit.test("Calling addButtonGroup with 'buttons' empty array should log error.", async function(assert) {
			var done = assert.async();
			var oRichTextEditor = new RichTextEditor({
				customToolbar: true
			});
			var oSpy;
			var sMissingParametersErrorString = "The 'buttons' array of the provided group configuration object cannot be empty.";

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();

			oRichTextEditor.attachReady(function () {
				// arrange
				oSpy = this.spy(Log, "error");

				// act
				oRichTextEditor.addButtonGroup({
					name: "test",
					buttons: []
				});

				// assert
				assert.strictEqual(oSpy.called, true, "log error method was called.");
				assert.strictEqual(oSpy.firstCall.args[0], sMissingParametersErrorString, "Correct error message was logged.");

				// clean
				oSpy.restore();
				oRichTextEditor.destroy();
				done();
			}.bind(this));
		});

		QUnit.test("Calling setButtonGroup should call the 'setButtonGroups' method of the toolbar", async function(assert) {
			var done = assert.async();
			var oRichTextEditor = new RichTextEditor({
				customToolbar: true
			});
			var oSpy;

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();

			oRichTextEditor.attachReady(function () {
				// arrange
				oSpy = this.spy(oRichTextEditor.getAggregation("_toolbarWrapper"), "setButtonGroups");

				// act
				oRichTextEditor.setButtonGroups([{
					name: "table",
					buttons: ["table"],
					visible: true,
					priority: 10,
					row: 0
				}]);

				// assert
				assert.strictEqual(oSpy.called, true, "ToolbarWrapper method was called.");

				// clean
				oSpy.restore();
				oRichTextEditor.destroy();
				done();
			}.bind(this));
		});

		QUnit.module("RTE Integrations");

		QUnit.test("RTE + Custom toolbar- XML view", function (assert) {
			//Setup
			var done = assert.async();
			var sXMLView =
				'<mvc:View xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc" xmlns:rte="sap.ui.richtexteditor">' +
				'    <rte:RichTextEditor id="myRTEXMLFragment" ' +
				'        ' + (sEditorType ? ' editorType="' + sEditorType + '"' : '') + ' customToolbar="true" />' +
				'</mvc:View>';

			XMLView.create({
				definition: sXMLView
			}).then(async function(oXMLContent) {
				var oRichTextEditor = oXMLContent.byId("myRTEXMLFragment");
				var oRTESpy = this.spy(oRichTextEditor, "onAfterRenderingTinyMCE");

				oRichTextEditor.attachReady(function () {
					//Assert
					/**
					 * @deprecated since 1.120 because content preservation in XMLView is deprecated
					 */
					assert.ok(oRichTextEditor.$().parent().attr("data-sap-ui-preserve"), "RTE's direct parent has preserve flag.");
					assert.ok(!oRichTextEditor.$().attr("data-sap-ui-preserve"), "RTE's preserve flag is removed.");
					assert.ok(!oRTESpy.threw(), "There should not be any exceptions in 'onAfterRenderingTinyMCE'");

					//Cleanup
					oXMLContent.destroy();
					oXMLContent = null;
					done();
				});

				oXMLContent.placeAt("content");
				await nextUIUpdate();
			}.bind(this));
		});

		QUnit.test("RTE available buttons in Custom Toolbar", async function(assert) {
			//Setup
			var aButtons = [];
			var aCustomButtons = [];
			var done = assert.async();
			var oRTE = new RichTextEditor("customToolbarRTEAvailableButtons", {
				editorType: sEditorType,
				customToolbar: true,
				customButtons: [
					new Button({id: "CustBtn1"}),
					new Button({id: "CustBtn2"})
				]
			});
			var aAvailableButtons = [
				"Bold",
				"Italic",
				"Underline",
				"Strikethrough",
				"TextAlign",
				"FontFamily",
				"FontSize",
				"TextColor",
				"BackgroundColor",
				"UnorderedList",
				"OrderedList",
				"Outdent",
				"Indent",
				"InsertLink",
				"Unlink",
				"InsertImage",
				"Undo",
				"Redo",
				"Cut",
				"Copy",
				"Paste",
				"CustBtn1",
				"CustBtn2"
			];

			oRTE.attachReady(function () {
				//Act
				aButtons = oRTE.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getContent().filter(function (oControl) {
					return oControl.getMetadata().getElementName() !== "sap.ui.core.InvisibleText";
				});

				aCustomButtons = oRTE.getCustomButtons();
				aButtons.forEach(function (oButton, index) {
					assert.ok(oButton.getId().indexOf(aAvailableButtons[index]) > -1, "Position #" + index + ": " + aAvailableButtons[index]);
				});

				assert.strictEqual(aCustomButtons[0].getId(), "CustBtn1", "Custom Buttons should be retrievable also by the aggregation");
				assert.strictEqual(aCustomButtons[1].getId(), "CustBtn2", "Custom Buttons should be retrievable also by the aggregation");

				//Cleanup
				oRTE.destroy();
				done();
			});

			oRTE.placeAt("content");
			await nextUIUpdate();
		});

		/**
		 * There's a bug in TinyMCE + PowerPaste plugin: when RTE is in read-only mode and
		 * PowerPaste is enabled, it's still possible to Paste text into the editor.
		 * Remove this test and the filter in _createConfigTinyMCE when the bug gets fixed in TinyMCE
		 */
		QUnit.test("Disable PowerPaste plugin when RTE in read-only mode", async function(assert) {
			//Setup
			var done = assert.async();
			var oRTE = new RichTextEditor({
				editorType: sEditorType,
				editable: false
			});

			oRTE.attachReady(function () {
				var udef;

				//Assert
				assert.strictEqual(oRTE.getEditable(), false, "RTE is in read-only model");
				assert.ok(JSON.stringify(oRTE.getPlugins()).indexOf("powerpaste") > -1, "PowerPaste is available through the official API");
				assert.strictEqual(oRTE.getNativeApi().plugins["powerpaste"], udef, "PowerPaste is not loaded into TinyMCE");
				assert.ok(oRTE.getNativeApi().plugins["link"], "Link is loaded into TinyMCE");

				//Cleanup
				oRTE.destroy();
				done();
			});

			oRTE.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("Add RTESplit Button", async function(assert) {
			//arrange
			var done = assert.async(),
				oRichTextEditor = new RichTextEditor({
					editorType: sEditorType,
					width: "100%",
					height: "300px",
					customToolbar: true,
					showGroupFont: true
				});

			oRichTextEditor.attachReady(function () {
				setTimeout(function () {
					var oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper");

					//assert
					assert.ok(oToolbar._findGroupedControls("font")[2].getMetadata().getName() === "sap.ui.richtexteditor.RTESplitButton", "The font color button is in the custom toolbar");

					//destroy
					oRichTextEditor.destroy();
					done();
				}, 0);
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.module("CustomButtons aggregation overwritten methods", {
			before: async function(assert) {
				var done = assert.async();
				this.oRichTextEditor = new RichTextEditor("customToolbarRTE", {
					editorType: sEditorType,
					customToolbar: true
				});

				// Initialize fully the RTE and then continue with the tests
				this.oRichTextEditor.attachReady(done);

				this.oRichTextEditor.placeAt("content");
				await nextUIUpdate();
			},
			after: function () {
				this.oRichTextEditor.destroy();
				this.oRichTextEditor = null;
			},
			afterEach: async function() {
				this.oRichTextEditor.destroyCustomButtons();
				await nextUIUpdate();
			}
		});

		QUnit.test("addCustomButton", function (assert) {
			//Setup
			var oButton = new Button();
			var oToolbarWrapper = this.oRichTextEditor.getAggregation("_toolbarWrapper");
			var oRTEAggregationSpy = this.spy(oToolbarWrapper, "_proxyToolbarAdd");

			//Act
			this.oRichTextEditor.addCustomButton(oButton);

			//Assert
			assert.ok(oRTEAggregationSpy.calledWithExactly(oButton), "RTE should proxy to the Toolbar");
			assert.ok(/Bold$/ig.test(this.oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getContent()[0].getId()), "RTE should proxy to the Toolbar");
		});

		QUnit.test("destroyCustomButtons", async function(assert) {
			//Setup
			var oButton = new Button();
			var oToolbarWrapper = this.oRichTextEditor.getAggregation("_toolbarWrapper");
			var oRTEAggregationSpy = this.spy(oToolbarWrapper, "_proxyToolbarDestroy");
			var oButtonDestroySpy = this.spy(oButton, "destroy");

			//Act
			this.oRichTextEditor.addCustomButton(oButton);
			await nextUIUpdate();

			this.oRichTextEditor.destroyCustomButtons();
			await nextUIUpdate();

			//Assert
			assert.ok(oRTEAggregationSpy.calledOnce, "RTE should proxy to the ToolbarWrapper.");
			assert.deepEqual(this.oRichTextEditor.getCustomButtons(), [], "RTE aggregation should be empty after that call.");
			assert.deepEqual(oToolbarWrapper.modifyToolbarContent("get"), [], "RTE's ToolbarWrapper aggregation should be also empty.");
			assert.ok(oButtonDestroySpy.called, "Control's destructor should have been invoked.");
			assert.ok(oButton._bIsBeingDestroyed, "Control should be destroyed.");
		});

		QUnit.test("getCustomButtons", function (assert) {
			//Setup
			var oButton = new Button(),
				oButton2 = new Button(),
				oButton3 = new Button();

			//Act
			this.oRichTextEditor.addCustomButton(oButton);
			this.oRichTextEditor.addCustomButton(oButton2);
			this.oRichTextEditor.addCustomButton(oButton3);

			//Assert
			assert.deepEqual(this.oRichTextEditor.getCustomButtons(), [oButton, oButton2, oButton3], "As RTE is proxy to the ToolbarWrapper, it should return only the controls set through RTE's setter");
		});

		QUnit.test("indexOfCustomButton", function (assert) {
			//Setup
			var index = null;
			var oButton = new Button();
			var oButton2 = new Button();
			var oToolbarWrapper = this.oRichTextEditor.getAggregation("_toolbarWrapper");
			var oRTEAggregationSpy = this.spy(oToolbarWrapper, "_proxyToolbarIndexOf");

			//Act
			this.oRichTextEditor.addCustomButton(oButton);
			this.oRichTextEditor.addCustomButton(oButton2);


			// Assert
			index = this.oRichTextEditor.indexOfCustomButton(oButton);
			assert.ok(oRTEAggregationSpy.calledWithExactly(oButton), "RTE should proxy to the Toolbar");
			assert.strictEqual(index, 0, "RTE should return the proper index according to RTE, but not to the ToolbarWrapper");

			index = this.oRichTextEditor.indexOfCustomButton(oButton2);
			assert.ok(oRTEAggregationSpy.calledWithExactly(oButton2), "RTE should proxy to the Toolbar");
			assert.strictEqual(index, 1, "RTE should return the proper index according to RTE, but not to the ToolbarWrapper");
		});

		QUnit.test("insertCustomButton", async function(assert) {
			//Setup
			var oButton = new Button();
			var oButton2 = new Button();
			var oButton3 = new Button();
			var oToolbarWrapper = this.oRichTextEditor.getAggregation("_toolbarWrapper");
			var oRTEAggregationSpy = this.spy(oToolbarWrapper, "_proxyToolbarInsert");

			//Act
			this.oRichTextEditor.insertCustomButton(oButton);
			this.oRichTextEditor.insertCustomButton(oButton2);
			this.oRichTextEditor.insertCustomButton(oButton3);
			await nextUIUpdate();

			//Assert
			assert.ok(oRTEAggregationSpy.calledWithExactly(oButton), "RTE should proxy to the Toolbar");
			assert.ok(oRTEAggregationSpy.calledWithExactly(oButton2), "RTE should proxy to the Toolbar");
			assert.ok(oRTEAggregationSpy.calledWithExactly(oButton3), "RTE should proxy to the Toolbar");

			assert.strictEqual(this.oRichTextEditor.indexOfCustomButton(oButton), 0, "Button1 should be positioned properly");
			assert.strictEqual(this.oRichTextEditor.indexOfCustomButton(oButton2), 1, "Button2 should be positioned properly");
			assert.strictEqual(this.oRichTextEditor.indexOfCustomButton(oButton3), 2, "Button3 should be positioned properly");
		});

		QUnit.test("removeAllCustomButtons", async function(assert) {
			//Setup
			var aRemovedCustomButtons = null;
			var oButton = new Button();
			var oToolbarWrapper = this.oRichTextEditor.getAggregation("_toolbarWrapper");
			var oRTEAggregationSpy = this.spy(oToolbarWrapper, "_proxyToolbarRemoveAll");

			//Act
			this.oRichTextEditor.addCustomButton(oButton);
			aRemovedCustomButtons = this.oRichTextEditor.removeAllCustomButtons();
			await nextUIUpdate();

			//Assert
			assert.ok(oRTEAggregationSpy.calledOnce, "RTE should proxy to the Toolbar");
			assert.deepEqual(aRemovedCustomButtons, [oButton], "RTE should remove only the controls that were proxied.");
			assert.deepEqual(this.oRichTextEditor.getCustomButtons(), [], "RTE aggregation should be empty after that call.");
			assert.deepEqual(oToolbarWrapper.modifyToolbarContent("get"), [], "RTE's ToolbarWrapper aggregation should be also empty.");

			//Clean
			oButton.destroy();
		});

		QUnit.test("removeCustomButton", async function(assert) {
			//Setup
			var aRemovedCustomButtons = null;
			var oButton = new Button();
			var oButton2 = new Button();
			var oButton3 = new Button();
			var oButton4 = new Button({id: "removeMe"});
			var oToolbarWrapper = this.oRichTextEditor.getAggregation("_toolbarWrapper");
			var oRTEAggregationSpy = this.spy(oToolbarWrapper, "_proxyToolbarRemove");

			//Act
			this.oRichTextEditor.addCustomButton(oButton);
			this.oRichTextEditor.addCustomButton(oButton2);
			this.oRichTextEditor.addCustomButton(oButton3);
			this.oRichTextEditor.addCustomButton(oButton4);
			await nextUIUpdate();

			aRemovedCustomButtons = this.oRichTextEditor.removeCustomButton(oButton);
			await nextUIUpdate();

			//Assert
			assert.ok(oRTEAggregationSpy.calledOnce, "RTE should proxy to the Toolbar");
			assert.deepEqual(aRemovedCustomButtons, oButton, "RTE should remove only the controls that were proxied.");
			assert.deepEqual(this.oRichTextEditor.getCustomButtons(), [oButton2, oButton3, oButton4], "RTE aggregation should return only the aggregated controls.");
			assert.deepEqual(oToolbarWrapper.modifyToolbarContent("get"), [oButton2, oButton3, oButton4], "RTE's ToolbarWrapper aggregation should also return the same controls.");

			// Act / Remove by ID
			aRemovedCustomButtons = this.oRichTextEditor.removeCustomButton("removeMe");
			await nextUIUpdate();

			//Assert
			assert.deepEqual(aRemovedCustomButtons, oButton4, "RTE should remove only the controls that were proxied.");
			assert.deepEqual(this.oRichTextEditor.getCustomButtons(), [oButton2, oButton3], "RTE aggregation should return only the aggregated controls.");
			assert.deepEqual(oToolbarWrapper.modifyToolbarContent("get"), [oButton2, oButton3], "RTE's ToolbarWrapper aggregation should also return the same controls.");

			// Act / Remove by index
			aRemovedCustomButtons = this.oRichTextEditor.removeCustomButton(1);
			await nextUIUpdate();

			//Assert
			assert.deepEqual(aRemovedCustomButtons, oButton3, "RTE should remove only the controls that were proxied.");
			assert.deepEqual(this.oRichTextEditor.getCustomButtons(), [oButton2], "RTE aggregation should return only the aggregated controls.");
			assert.deepEqual(oToolbarWrapper.modifyToolbarContent("get"), [oButton2], "RTE's ToolbarWrapper aggregation should also return the same controls.");

			// Act / Remove by index
			aRemovedCustomButtons = this.oRichTextEditor.removeCustomButton(99);
			await nextUIUpdate();

			//Assert
			assert.strictEqual(aRemovedCustomButtons, null, "RTE should not have removed any buttons.");
			assert.deepEqual(this.oRichTextEditor.getCustomButtons(), [oButton2], "RTE aggregation should return only the aggregated controls.");
			assert.deepEqual(oToolbarWrapper.modifyToolbarContent("get"), [oButton2], "RTE's ToolbarWrapper aggregation should also return the same controls.");

			//Clean
			oButton.destroy();
			oButton2.destroy();
			oButton3.destroy();
			oButton4.destroy();
		});

		QUnit.module("CustomButtons aggregation overwritten methods in 'native' mode", {
			before: async function(assert) {
				var done = assert.async();

				this.oRichTextEditor = new RichTextEditor("customToolbarRTENative", {
					editorType: sEditorType
				});

				this.oRichTextEditor.attachReady(done);

				this.oRichTextEditor.placeAt("content");
				await nextUIUpdate();
			},
			after: async function() {
				this.oRichTextEditor.destroy();
				await nextUIUpdate();
			},
			afterEach: async function() {
				this.oRichTextEditor.destroyCustomButtons();
				await nextUIUpdate();
			}
		});

		QUnit.test("addCustomButton", function (assert) {
			//Setup
			var oButton = new Button();
			var oRTEAggregationSpy = this.spy(this.oRichTextEditor, "addAggregation");

			//Act
			this.oRichTextEditor.addCustomButton(oButton);

			//Assert
			assert.ok(oRTEAggregationSpy.calledWithExactly("customButtons", oButton), "RTE should store the aggregations");

		});

		QUnit.test("destroyCustomButtons", async function(assert) {
			//Setup
			var oButton = new Button();
			var oRTEAggregationSpy = this.spy(this.oRichTextEditor, "destroyAggregation");
			var oButtonDestroySpy = this.spy(oButton, "destroy");

			//Act
			this.oRichTextEditor.addCustomButton(oButton);
			await nextUIUpdate();

			this.oRichTextEditor.destroyCustomButtons();
			await nextUIUpdate();

			//Assert
			assert.ok(oRTEAggregationSpy.calledOnce, "RTE aggregation should be destroyed.");
			assert.deepEqual(this.oRichTextEditor.getCustomButtons(), null, "RTE aggregation should be empty after that call.");

			assert.ok(oButtonDestroySpy.called, "Control's destructor should have been invoked.");
			assert.ok(oButton._bIsBeingDestroyed, "Control should be destroyed.");
		});

		QUnit.test("getCustomButtons", function (assert) {
			//Setup
			var oButton = new Button();

			//Act
			this.oRichTextEditor.addCustomButton(oButton);

			//Assert
			assert.deepEqual(this.oRichTextEditor.getCustomButtons(), [oButton], "RTE should return the controls stored in the aggregation");
		});

		QUnit.test("indexOfCustomButton", function (assert) {
			//Setup
			var index = null;
			var oButton = new Button();
			var oButton2 = new Button();
			var oRTEAggregationSpy = this.spy(this.oRichTextEditor, "indexOfAggregation");

			//Act
			this.oRichTextEditor.addCustomButton(oButton);
			this.oRichTextEditor.addCustomButton(oButton2);

			// Assert
			index = this.oRichTextEditor.indexOfCustomButton(oButton);
			assert.ok(oRTEAggregationSpy.calledWithExactly("customButtons", oButton), "RTE should call indexOfAggregation.");
			assert.strictEqual(index, 0, "RTE should return the proper index.");

			index = this.oRichTextEditor.indexOfCustomButton(oButton2);
			assert.ok(oRTEAggregationSpy.calledWithExactly("customButtons", oButton2), "RTE should call indexOfAggregation.");
			assert.strictEqual(index, 1, "RTE should return the proper index.");
		});

		QUnit.test("insertCustomButton", function (assert) {
			//Setup
			var oButton = new Button();
			var oRTEAggregationSpy = this.spy(this.oRichTextEditor, "insertAggregation");

			//Act
			this.oRichTextEditor.insertCustomButton(oButton);

			//Assert
			assert.ok(oRTEAggregationSpy.calledWithExactly("customButtons", oButton), "RTE should call insertAggregation.");
		});

		QUnit.test("removeAllCustomButtons", function (assert) {
			//Setup
			var aRemovedCustomButtons = null;
			var oButton = new Button();
			var oRTEAggregationSpy = this.spy(this.oRichTextEditor, "removeAllAggregation");

			//Act
			this.oRichTextEditor.addCustomButton(oButton);
			aRemovedCustomButtons = this.oRichTextEditor.removeAllCustomButtons();
			//Assert
			assert.ok(oRTEAggregationSpy.calledWithExactly("customButtons"), "RTE should call removeAllAggregation");
			assert.deepEqual(aRemovedCustomButtons, [oButton], "RTE should remove all the controls in that aggregation.");
			assert.deepEqual(this.oRichTextEditor.getCustomButtons(), null, "RTE aggregation should be empty after that call.");
		});

		QUnit.module("Resize handling module", {
			beforeEach: async function(assert) {
				var done = assert.async();

				this.oRichTextEditor = new RichTextEditor({
					editorType: sEditorType
				});

				this.oRichTextEditor.attachReady(done);

				this.oRichTextEditor.placeAt("content");
				await nextUIUpdate();

				this.oRichTextEditor._bUnloading = false;
			},
			afterEach: function () {
				this.oRichTextEditor.destroy();
			}
		});

		QUnit.test("Should resize TinyMCE when the document state is 'complete'", function (assert) {
			// Arrange
			var oStub = sinon.stub(this.oRichTextEditor._oEditor, "getDoc").callsFake(function () {
				return {
					readyState: "complete"
				};
			});
			var _resizeEditorTinyMCESpy = sinon.spy(this.oRichTextEditor, "_resizeEditorTinyMCE");

			// Act
			this.oRichTextEditor._resizeEditorOnDocumentReady();

			// Assert
			assert.ok(_resizeEditorTinyMCESpy.calledOnce, "resize should be called once");

			// cleanup
			oStub.restore();
		});

		QUnit.test("Should not resize TinyMCE when the document state is not 'complete'", function (assert) {
			// Arrange
			var oStub = sinon.stub(this.oRichTextEditor._oEditor, "getDoc").callsFake(function () {
				return {
					addEventListener: function () {
					},
					readyState: "loading"
				};
			});
			var _resizeEditorTinyMCESpy = sinon.spy(this.oRichTextEditor, "_resizeEditorTinyMCE");

			// Act
			this.oRichTextEditor._resizeEditorOnDocumentReady();

			// Assert
			assert.ok(_resizeEditorTinyMCESpy.notCalled, "resize should not be called");

			// cleanup
			oStub.restore();
		});

		QUnit.test("Should not resize TinyMCE when the document is undefined", function (assert) {
			// Arrange
			var oStub = sinon.stub(this.oRichTextEditor._oEditor, "getDoc").callsFake(function () {
				return undefined;
			});
			var _resizeEditorTinyMCESpy = sinon.spy(this.oRichTextEditor, "_resizeEditorTinyMCE");

			// Act
			this.oRichTextEditor._resizeEditorOnDocumentReady();

			// Assert
			assert.ok(_resizeEditorTinyMCESpy.notCalled, "resize should not be called");

			// cleanup
			oStub.restore();
		});

		QUnit.module("ARIA attributes");

		QUnit.test("Should add aria-labelledby attribute on the correct DOM element", async function(assert) {
			// Arrange
			var done = assert.async();
			var oLabel = new InvisibleText("textForRTE", {
				text: "test"
			}).placeAt("content");

			var oRichTextEditor = new RichTextEditor({
				editorType: sEditorType,
				ariaLabelledBy: ["test"]
			});

			oRichTextEditor.attachReady(function () {
				// Assert
				assert.strictEqual(document.getElementById(oRichTextEditor._iframeId).attributes["aria-labelledby"].value, "test textForRTE", "Correct aria-labelledby attribute is added to the DOM");

				// Clean
				oLabel.destroy();
				oRichTextEditor.destroy();
				done();
			});

			// Act
			oRichTextEditor.addAriaLabelledBy(oLabel);

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("Should add aria-label attribute on the Rich Text Editor wrapper DOM element", async function(assert) {
			// Arrange
			var done = assert.async();
			// We need to be sure that the RTE is in the correct language for the assertion
			Localization.setLanguage("en");
			await nextUIUpdate();

			var oRichTextEditor = new RichTextEditor({
				editorType: sEditorType
			});

			// Act
			oRichTextEditor.attachReady(function () {
				// Assert
				assert.strictEqual(oRichTextEditor.getDomRef().getAttribute("aria-label"), "Rich Text Editor", "The Correct aria-label attribute is added to the DOM");

				// Clean
				oRichTextEditor.destroy();
				done();
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("Should add role 'region' attribute on the Rich Text Editor wrapper DOM element", async function(assert) {
			// Arrange
			var done = assert.async();
			var oRichTextEditor = new RichTextEditor({
				editorType: sEditorType
			});

			// Act
			oRichTextEditor.attachReady(function () {
				// Assert
				assert.strictEqual(oRichTextEditor.getDomRef().getAttribute("role"), "region", "Role 'region' attribute is added to the DOM");

				// Clean
				oRichTextEditor.destroy();
				done();
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		QUnit.test("Should add aria-roledescription attribute on the Rich Text Editor's custom toolbar'", async function(assert) {
			// Arrange
			var done = assert.async();
			var oCustomToolBarDOM;
			var oRichTextEditor = new RichTextEditor({
				editorType: sEditorType,
				customToolbar: true
			});

			// Act
			oRichTextEditor.attachReady(function () {
				oCustomToolBarDOM = oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getDomRef();

				// Assert
				assert.strictEqual(oCustomToolBarDOM.getAttribute("aria-roledescription"), "Rich Text Editing Options", "The correct aria-roledescrition text is set to the CustomToolbar");

				// Clean
				oRichTextEditor.destroy();
				done();
			});

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();
		});

		// QUnit.module("Change and focusout", {
		// 	beforeEach: async function () {
		// 		this.sValue = "<p>Hello world</p>";
		// 		this.sBoldValue = "<p><strong>Hello world</strong></p>";
		// 		this.sEmptyString = "";

		// 		this.oRichTextEditor = new RichTextEditor({
		// 			editorType: sEditorType,
		// 			customToolbar: true,
		// 			showGroupUndo: true,
		// 			value: this.sValue
		// 		});

		// 		this.oRichTextEditor.placeAt("content");
		// 		await nextUIUpdate();
		// 	},
		// 	afterEach: function () {
		// 		this.oRichTextEditor.destroy();
		// 	}
		// });

		// QUnit.test("Should call RTE fireChange event only once after making changes and focusing out from the editor", function (assert) {
		// 	const done = assert.async();
		// 	const oFireChangeSpy = sinon.spy(this.oRichTextEditor, "fireChange");
		// 	this.oRichTextEditor.attachReady( () => {
		// 		this.oRichTextEditor.setValueTinyMCE(this.sEmptyString);

		// 		// Act
		// 		this.oRichTextEditor.getNativeApi().fire("focusout");

		// 		// Assert
		// 		assert.strictEqual(this.oRichTextEditor.getValue(), this.sEmptyString, "Value has been changed");
		// 		assert.strictEqual(oFireChangeSpy.calledOnce, true, "RTE fireChange was called only once");

		// 		done();
		// 	});
		// });

		// QUnit.test("Should call RTE fireChange event only once after RTE cnage event and focus out", function (assert) {
		// 	const done = assert.async();
		// 	const oFireChangeSpy = sinon.spy(this.oRichTextEditor, "fireChange");
		// 	this.oRichTextEditor.attachReady( () => {
		// 		this.oRichTextEditor.setValueTinyMCE(this.sEmptyString);

		// 		// Act
		// 		this.oRichTextEditor.getNativeApi().fire("change");
		// 		this.oRichTextEditor.getNativeApi().fire("focusout");

		// 		// Assert
		// 		assert.strictEqual(this.oRichTextEditor.getValue(), this.sEmptyString, "Value has been changed");
		// 		assert.strictEqual(oFireChangeSpy.calledOnce, true, "RTE fireChange was called only once");

		// 		done();
		// 	});
		// });

		// QUnit.test("Should call fireChange only once when interacting with custom toolbar buttons", function (assert) {
		// 	const done = assert.async();
		// 	const oFireChangeSpy = sinon.spy(this.oRichTextEditor, "fireChange");
		// 	this.oRichTextEditor.attachReady( () => {
		// 		this.oRichTextEditor.getNativeApi().selection.select(this.oRichTextEditor.getNativeApi().dom.select('p')[0]);
		// 		Element.getElementById(this.oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getId() + "-Bold").firePress();

		// 		// Act
		// 		this.oRichTextEditor.getNativeApi().fire("focusout");

		// 		// Assert
		// 		assert.strictEqual(this.oRichTextEditor.getValue(), this.sBoldValue, "Value is bold");
		// 		assert.strictEqual(oFireChangeSpy.calledOnce, true, "RTE fireChange was called only once");
		// 		done();
		// 	});
		// });

		// QUnit.test("Should call fireChange only once when TinyMCE uses own toolabr and executes commands", async function (assert) {
		// 	const done = assert.async();

		// 	UIArea.registry.get("content").removeAllContent();

		// 	var oRTE = new RichTextEditor({customToolbar: false});
		// 	oRTE.setValue(this.sValue);
		// 	oRTE.placeAt("content");
		// 	await nextUIUpdate();

		// 	const oFireChangeSpy = sinon.spy(oRTE, "fireChange");

		// 	oRTE.attachReady( () => {
		// 		oRTE.getNativeApi().selection.select(oRTE.getNativeApi().dom.select('p')[0]);
		// 		oRTE.getNativeApi().execCommand("bold");

		// 		// Act
		// 		oRTE.getNativeApi().fire("focusout");

		// 		// Assert
		// 		assert.strictEqual(oRTE.getValue(), this.sBoldValue, "Value is bold");
		// 		assert.strictEqual(oFireChangeSpy.calledOnce, true, "RTE fireChange was called only once");

		// 		oRTE.destroy();
		// 		done();
		// 	});
		// });
	};
});
