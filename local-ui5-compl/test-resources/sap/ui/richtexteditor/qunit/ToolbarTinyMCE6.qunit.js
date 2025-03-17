/* global QUnit, sinon */
sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/core/Lib",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/richtexteditor/library",
	"sap/ui/richtexteditor/RichTextEditor",
	"sap/m/Button",
	"sap/ui/base/Event",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/mvc/XMLView",
	"sap/ui/qunit/utils/waitForThemeApplied",
	"sap/ui/model/json/JSONModel"
], function(Element, Library, nextUIUpdate, rteLibrary, RichTextEditor, Button, Event, Fragment, Controller, XMLView, waitForThemeApplied, JSONModel) {
	"use strict";

	var ButtonGroups = rteLibrary.ButtonGroups,
		EditorCommands = rteLibrary.EditorCommands,
		EditorType = rteLibrary.EditorType;

	QUnit.config.testTimeout = 6000;
	var oResourceBundle = Library.getResourceBundleFor("sap.ui.richtexteditor");

	QUnit.module("General");

	QUnit.test("Warmup environment before executing tests", async function (assert) {
		// arrange
		var done = assert.async();

		var oRichTextEditor = new RichTextEditor({
			editorType: EditorType.TinyMCE6,
			width: "100%",
			height: "300px",
			customToolbar: true,
			showGroupFont: true,
			showGroupUndo: true
		});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function () {
			assert.ok(Button, "sap.m. Library should have been loaded.");
			assert.ok(true, "RichTextEditor had been initialized.");

			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Custom Toolbar is resolved properly", async function(assert) {
		// arrange
		var done = assert.async(),
			oCustomToolbarEnablementSpy = this.spy(RichTextEditor.prototype, "_customToolbarEnablement"),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont: true,
				showGroupUndo: true
			});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function () {
			assert.ok(oCustomToolbarEnablementSpy.called, "Cutom Toolbar enabler method has be invoked.");
			assert.ok(oRichTextEditor._bCustomToolbarRequirementsFullfiled, "Custom Toolbar requirements are fulfilled.");
			assert.ok(oRichTextEditor.getAggregation("_toolbarWrapper"), "The ToolbarWrapper is in the aggregation.");

			oRichTextEditor.destroy();

			done();
		});
	});

	QUnit.test("RTE with custom toolbar should not steal the focus", async function(assert) {
		// arrange
		var done = assert.async(),
			oButton = new Button(),
			oRichTextEditor = new RichTextEditor({
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont: true,
				showGroupUndo: true
			});

		oButton.placeAt("content");
		oRichTextEditor.placeAt("content");
		await nextUIUpdate();
		oButton.focus();

		oRichTextEditor.attachReady(function () {
			assert.strictEqual(document.activeElement, oButton.getDomRef(), "The focus remains on the button");

			oRichTextEditor.destroy();
			oButton.destroy();
			done();
		});
	});

	QUnit.test("Toolbar aggregations", async function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont: true,
				showGroupUndo: true
			}),
			oRTECustomToolbar;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function () {
			oRTECustomToolbar = oRichTextEditor.getAggregation("_toolbarWrapper");
			// assert
			assert.ok(oRTECustomToolbar.getAggregation("_toolbar"),
				"There should be a toolbar aggregation");
			assert.ok(oRTECustomToolbar.getAggregation("_customInsertImageDialog"),
				"There should be a insert image dialog aggregation");
			assert.ok(oRTECustomToolbar.getAggregation("_customInsertLinkDialog"),
				"There should be a insert link dialog aggregation");
			assert.ok(oRTECustomToolbar.getAggregation("_customTextColorDialog"),
				"There should be a text color dialog aggregation");
			assert.ok(oRTECustomToolbar.getAggregation("_customBackgroundColorDialog"),
				"There should be a background color dialog aggregation");
			assert.ok(oRTECustomToolbar.getAggregation("_customInsertTableDialog"),
				"There should be a insert table dialog aggregation");
			//destroy
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("setButtonGroups", async function(assert) {
		// arrange
		var done = assert.async(6),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont: true,
				showGroupUndo: true
			}),
			oFontGroup = {
				name: "font-style",
				visible: true,
				row: 0,
				priority: 10,
				buttons: [
					"bold", "italic", "underline", "strikethrough"
				]
			},
			oTextAlignGroup = {
				// Text Align group
				name: "text-align",
				visible: true,
				row: 0,
				priority: 20,
				buttons: [
					"justifyleft", "justifycenter", "justifyright", "justifyfull"
				]
			},
			oInsertGroup = {
				name: "insert",
				visible: false,
				row: 1,
				priority: 50,
				buttons: [
					"image", "emoticons"
				]
			};

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function () {
			var oRTECustomToolbar = oRichTextEditor.getAggregation("_toolbarWrapper"),
				oToolbar = oRTECustomToolbar.getAggregation("_toolbar");

			// act
			oRichTextEditor.setButtonGroups([]);
			//assert
			assert.strictEqual(oToolbar.getContent().length, 0, "There is no content in the toolbar");
			done();

			// act
			oRichTextEditor.setButtonGroups([oFontGroup]);
			//assert
			assert.strictEqual(oToolbar.getContent().length, 4, "There are 4 controls in the toolbar");
			done();
			assert.ok(oRTECustomToolbar._isButtonGroupAdded("font-style"), "The font-style is currently added in the toolbar.");
			done();

			//act
			oRichTextEditor.setButtonGroups([oTextAlignGroup, oInsertGroup]);
			//assert
			assert.strictEqual(oToolbar.getContent().length, 2, "There are 2 controls in the toolbar");
			done();
			assert.ok(oRTECustomToolbar._isButtonGroupAdded("insert"), "The Insert group is currently added in the toolbar.");
			done();
			assert.ok(oRTECustomToolbar._isButtonGroupAdded("text-align"), "The TextAlign group is currently added in the toolbar.");

			//destroy
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("setButtonGroups + Custom Button", async function(assert) {
		// arrange
		var done = assert.async(3),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont: true,
				customButtons: [new Button({
					id: "idCustomBtn",
					text: "Custom Button"
				})]
			}),
			oFontGroup = {
				name: "font-style",
				visible: true,
				row: 0,
				priority: 10,
				buttons: [
					"bold", "italic", "underline", "strikethrough"
				]
			},
			oStructureGroup = {
				name: "structure",
				visible: true,
				row: 1,
				priority: 20,
				buttons: [
					"bullist", "numlist", "outdent", "indent"
				]
			};

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			var oRTECustomToolbar = oRichTextEditor.getAggregation("_toolbarWrapper"),
				oToolbar = oRTECustomToolbar.getAggregation("_toolbar"),
				iGroupButtonCount = 0;

			// act
			oRichTextEditor.setButtonGroups([]);
			//assert
			assert.strictEqual(oToolbar.getContent()[iGroupButtonCount].getId(), "idCustomBtn", "The custom button is added on correct position");
			done();

			// act
			oRichTextEditor.setButtonGroups([oFontGroup]);
			iGroupButtonCount = oFontGroup.buttons.length;
			//assert
			assert.strictEqual(oToolbar.getContent()[iGroupButtonCount].getId(), "idCustomBtn", "The custom button is added on correct position");
			done();

			//act
			oRichTextEditor.setButtonGroups([oFontGroup, oStructureGroup]);
			iGroupButtonCount = oFontGroup.buttons.length + oStructureGroup.buttons.length;
			//assert
			assert.strictEqual(oToolbar.getContent()[iGroupButtonCount].getId(), "idCustomBtn", "The custom button is added on correct position");

			//destroy
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Rerendering should not attach multiple handlers to the color selection split buttons.", async function(assert) {
		// arrange
		var done = assert.async();
		var	oRichTextEditor = new RichTextEditor({
					editorType: EditorType.TinyMCE6,
					width: "100%",
					height: "300px",
					customToolbar: true,
					showGroupFont: true
				});
		var oToolbar,
			oTextButtonPopover,
			oBackgroundButtonPopover,
			iTextButtonAfterOpenHandlersCount,
			iTextButtonAfterCloseHandlersCount,
			iBGButtonAfterOpenHandlersCount,
			iBGButtonAfterCloseHandlersCount;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function () {
			oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper");
			oTextButtonPopover = oToolbar.getAggregation("_customTextColorDialog")._ensurePopover();
			oBackgroundButtonPopover = oToolbar.getAggregation("_customBackgroundColorDialog")._ensurePopover();
			iTextButtonAfterOpenHandlersCount = oTextButtonPopover.mEventRegistry.afterOpen.length;
			iTextButtonAfterCloseHandlersCount = oTextButtonPopover.mEventRegistry.afterClose.length;
			iBGButtonAfterOpenHandlersCount = oBackgroundButtonPopover.mEventRegistry.afterOpen.length;
			iBGButtonAfterCloseHandlersCount = oBackgroundButtonPopover.mEventRegistry.afterClose.length;

			// act
			oToolbar.onAfterRendering();

			// assert
			assert.strictEqual(iTextButtonAfterOpenHandlersCount, oTextButtonPopover.mEventRegistry.afterOpen.length, "TextColor button after open handlers have not increased.");
			assert.strictEqual(iTextButtonAfterCloseHandlersCount, oTextButtonPopover.mEventRegistry.afterClose.length, "TextColor button after close handlers have not increased.");
			assert.strictEqual(iBGButtonAfterOpenHandlersCount, oBackgroundButtonPopover.mEventRegistry.afterOpen.length, "BackgroundColor button after open handlers have not increased.");
			assert.strictEqual(iBGButtonAfterCloseHandlersCount, oBackgroundButtonPopover.mEventRegistry.afterClose.length, "BackgroundColor button after close handlers have not increased.");

			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("API - Toolbar enablement", function (assert) {
		// Setup
		var done = assert.async(2),
			sRTEFragment = '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m" xmlns:rte="sap.ui.richtexteditor"> ' +
					' ' +
					'   <rte:RichTextEditor  ' +
					'    editorType="TinyMCE6" ' +
					'    width="100%" ' +
					'    height="300px" ' +
					'    editable="false" ' +
					'    customToolbar="true"></rte:RichTextEditor> ' +
					'   ' +
					'  </core:FragmentDefinition>',

			sXMLView = '<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true"> ' +
					'    <App> ' +
					'     <Page title="RTE in XMLFragment" id="myPage"></Page> ' +
					'    </App> ' +
					'   </mvc:View>';

		var MyController = Controller.extend("myController", {
			_loadRTEFragment: function () {
				return Fragment.load({
					definition: sRTEFragment,
					controller: this
				}).then(function(oRTE) {
					var oView = this.getView();
					var oPage = oView.byId("myPage");
					oPage.addContent(oRTE);
					this._runAssertions(oRTE);
				}.bind(this));
			},

			onInit: function () {
				sap.ui.require(["sap/m/Button"], function (Button) {
					return this._loadRTEFragment();
				}.bind(this));
			},
			// Assert
			_runAssertions: function (oRichTextEditor) {
				assert.ok(oRichTextEditor, "RTE got instantiated");
				done();

				oRichTextEditor.attachReady(function () {
					var oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar");
					assert.equal(oToolbar.getEnabled(), false, "The custom toolbar should have been initialized with disabled buttons");


					// clean
					this.getView().destroy();
					done();
				}.bind(this));
			}
		});

		// Act
		XMLView.create({
			definition: sXMLView,
			controller: new MyController()
		}).then(async function(oXMLView) {
			oXMLView.placeAt("content");
			await nextUIUpdate();
		});
	});

	QUnit.test("API - RemoveButtonGroup", async function(assert) {
		// arrange
		var done = assert.async(1);
		var	oRichTextEditor = new RichTextEditor({
					editorType: EditorType.TinyMCE6,
					width: "100%",
					height: "300px",
					customToolbar: true
				});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		var oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper");

		assert.ok(oToolbar._isButtonGroupAdded("text-align"), "The aggregation is currently added in the toolbar.");
		assert.ok(oToolbar._findGroupedControls("text-align")[0], "The button is in the custom toolbar wrapper.");

		oRichTextEditor.attachReady(function () {
			// act
			oToolbar.removeButtonGroup("text-align");

			assert.ok(oToolbar._findGroupedControls("text-align").length === 0, "The button was successfully removed from the toolbar");

			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("API - RemoveButtonGroup 'font' calls _modifyPopoverOpeningArrowHandlers with false", async function(assert) {
		// arrange
		var done = assert.async();
		var	oRichTextEditor = new RichTextEditor({
					editorType: EditorType.TinyMCE6,
					width: "100%",
					height: "300px",
					customToolbar: true,
					showGroupFont: true
				});
		var oSpy, oToolbar;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(async function () {
			oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper");
			oSpy = this.spy(oToolbar, "_modifyPopoverOpeningArrowHandlers");
			// act
			oToolbar.removeButtonGroup("font");
			await nextUIUpdate();


			// assert
			assert.ok(oSpy.called, "The _modifyPopoverOpeningArrowHandlers method was called...");
			assert.strictEqual(oSpy.firstCall.args[0], false, "...with the correct parameter.");

			// clean
			oSpy.restore();
			oRichTextEditor.destroy();
			done();
		}.bind(this));
	});

	QUnit.test("API - AddButtonGroupToContent", async function(assert) {
		const done = assert.async();
		var oRichTextEditor = new RichTextEditor({
					editorType: EditorType.TinyMCE6,
					width: "100%",
					height: "300px",
					customToolbar: true
				}),
				oButtonGroup = {
					name: "text-align",
					visible: true,
					row: 0,
					priority: 20,
					buttons: [
						"justifyleft", "justifycenter", "justifyright", "justifyfull"
					]
				};

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		var oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper");

		oRichTextEditor.attachReady(function () {
			assert.ok(oToolbar._isButtonGroupAdded("text-align"), "The aggregation is currently added in the toolbar.");
			oRichTextEditor.removeButtonGroup("text-align");
			oToolbar.addButtonGroupToContent(oButtonGroup);
			assert.ok(oToolbar._findGroupedControls("text-align")[0], "The text-align button was successfully added back in the toolbar");
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("_synchronizeCustomToolbarStates() - Toggle Buttons", async function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor("myRTE7", {
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			// act
			oRichTextEditor.getNativeApi().execCommand("Bold");

			oRichTextEditor._pTinyMCEInitialized.then(function() {
				// assert
				assert.equal(Element.getElementById(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getId() + "-Bold").getPressed(), true, "The bold button should be pressed");

				//destroy
				oRichTextEditor.destroy();
				done();
			});
		});
	});

	QUnit.test("Toolbar control states/selected items should match the applied styles", async function(assert) {
		// arrange
		var done = assert.async(3),
			oRichTextEditor = new RichTextEditor("myRTE8", {
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0]);
			Element.getElementById(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getId() + "-Bold").firePress();
			oActiveEditor.execCommand("JustifyCenter");
			oActiveEditor.execCommand("FontSize", false, "12pt");
			oActiveEditor.execCommand("FontName", false, '"comic sans ms", sans-serif');

			oRichTextEditor._pTinyMCEInitialized.then(function() {
				// assert
				assert.equal(oActiveEditor.formatter.match("bold"),
							true,
							"The bold style should be applied to the editor");
				done();
				assert.equal(oActiveEditor.formatter.match("aligncenter"),
							true,
							"The JustifyCenter style should be applied to the editor");
				done();
				assert.equal(EditorCommands["FontFamily"]["ComicSansMS"].commandValue,
							'"comic sans ms", sans-serif',
							"The FontFamily 'Comic Sans MS' style should be applied to the editor");

				// destroy
				oRichTextEditor.destroy();
				done();
			});
		});
	});

	QUnit.test("_getColor(sCommand)", async function(assert) {
		// arrange
		var done = assert.async(4),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0]);

			assert.equal(oRichTextEditor.getAggregation("_toolbarWrapper")._getColor('TextColor'),
					'#000000',
					"The default text color should be returned");
			done();
			assert.equal(oRichTextEditor.getAggregation("_toolbarWrapper")._getColor('BackgroundColor'),
					'#ffffff',
					"The default background color should be returned");
			done();

			oActiveEditor.execCommand("ForeColor", false, 'rgb(123, 123, 123)');
			oActiveEditor.execCommand("HiliteColor", false, 'rgb(123, 123, 123)');

			oRichTextEditor._pTinyMCEInitialized.then(function() {
				// assert
				assert.equal(oRichTextEditor.getAggregation("_toolbarWrapper")._getColor('TextColor'),
							'rgb(123, 123, 123)',
							"The colors should be the same");
				done();
				assert.equal(oRichTextEditor.getAggregation("_toolbarWrapper")._getColor('BackgroundColor'),
							'rgb(123, 123, 123)',
							"The colors should be the same");
				// destroy
				oRichTextEditor.destroy();
				done();
			});
		});
	});

	QUnit.test("Color Palettes integration", async function(assert) {
		// arrange
		var done = assert.async(7),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true
			});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			// act
			var oActiveEditor = oRichTextEditor.getNativeApi(),
				oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper"),
				oRTESplitButton = oToolbar._findGroupedControls("font")[2],
				oFakeEventTextColor = new Event(),
				oFakeEventBackgroundColor = new Event();

			oFakeEventTextColor.value = "rgb(100, 149, 237)";
			oFakeEventBackgroundColor.value = "orange";

			assert.equal(oToolbar._getColor('TextColor'),
					"#000000",
					"The initial text color should be the default one");
					done();
			assert.equal(oToolbar._getColor('BackgroundColor'),
					'#ffffff',
					"The initial background color should be the default one");
					done();
			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0]);
			assert.equal(oToolbar._getColor('TextColor'),
					'#000000',
					"The text color should be the default one");
					done();
			assert.equal(oToolbar._getColor('BackgroundColor'),
					"#ffffff",
					"The background color should be the default one");
					done();

			oToolbar.getAggregation('_customTextColorDialog')
					.fireColorSelect(oFakeEventTextColor);
			oToolbar.getAggregation('_customBackgroundColorDialog')
					.fireColorSelect(oFakeEventBackgroundColor);

			setTimeout(function() {
				// assert
				assert.equal(oToolbar._getColor('TextColor'),
						"rgb(100, 149, 237)",
						"The text color should be changed to the color palettes selection");
						done();
				assert.equal(oToolbar._getColor('BackgroundColor'),
						"orange",
						"The background color should be changed to the color palettes selection");
						done();
				assert.equal(oRTESplitButton.getIconColor(),
						"rgb(100, 149, 237)",
						"The icon color should be changed to the color palette selection");
				// destroy
				oRichTextEditor.destroy();
				done();
			});
		});
	});

	QUnit.test("_getColor(sCommand) - applying twice the same color", async function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			// act
			var oActiveEditor = oRichTextEditor.getNativeApi(),
				oFakeEvent = new Event();

			oFakeEvent.value = "rgb(255, 215, 0)";

			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0]);
			oActiveEditor.execCommand("ForeColor", false, 'gold');
			oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls('font')[2].firePress();
			oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation('_customTextColorDialog')
					.fireColorSelect(oFakeEvent);

			setTimeout(function() {
				// assert
				assert.equal(oRichTextEditor.getAggregation("_toolbarWrapper")._getColor('TextColor'),
							"rgb(255, 215, 0)",
							"The text color should not be changed to the default one");
				// destroy
				oRichTextEditor.destroy();
				done();
			});
		});
	});

	QUnit.test("_applyColor should call native api with correct parameters", async function(assert) {
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			}),
			oSpy, oToolbar;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			// arrange
			oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper");
			oSpy = this.spy(oRichTextEditor.getNativeApi(), "execCommand");

			// act
			oToolbar._applyColor("TextColor", "ForeColor", "gold", false);

			setTimeout(function() {
				// assert
				assert.strictEqual(oSpy.called, true, "The method was called");
				assert.strictEqual(oSpy.firstCall.args[0], "ForeColor", "... with correct first parameter");
				assert.strictEqual(oSpy.firstCall.args[2], "gold", "... with correct third parameter");

				// destroy
				oSpy.restore();
				oRichTextEditor.destroy();
				done();
			});
		}.bind(this));
	});

	QUnit.test("_synchronizeCustomToolbarStates() - Menu Button", async function(assert) {
		// assert
		var done = assert.async(2),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			// act
			var oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper"),
				oRTEMenuButton = oToolbarWrapper._findGroupedControls('text-align')[0],
				oRTEMenu = oRTEMenuButton.getAggregation("menu"),
				oCenterMenuItem = oRTEMenu.getAggregation("items")[1],
				oCenterMenuItemIcon = oCenterMenuItem.getIcon();

			assert.equal(oRTEMenuButton.getIcon(), oRTEMenu.getAggregation("items")[0].getIcon(), "The menu button icon should be as the JustifyLeft ininitialy.");

			oRTEMenu.fireItemSelected({
				item: oCenterMenuItem
			});

			assert.equal(oToolbarWrapper._findTextAlignCommandByIcon(oCenterMenuItemIcon), 'Center',
				'_findTextAlignCommandByIcon function should find the correct text align command.');
			done();
			oRichTextEditor._pTinyMCEInitialized.then(function() {
				// assert
				assert.equal(oRTEMenuButton.getIcon(), oCenterMenuItemIcon,
					"The menu button icon should be as the JustifyCenter command icon.");

				assert.equal(
					oRTEMenuButton.getTooltip(),
					oResourceBundle.getText("TEXTALIGN_BUTTON_TOOLTIP") + " " + oResourceBundle.getText("TEXTALIGH_CENTER"),
					"The menu button tooltip should be updated.");

				// destroy
				oRichTextEditor.destroy();
				done();
			});
		});
	});

	QUnit.test("_synchronizeCustomToolbarStates() - Menu Button, selecting the same alignment twice should apply the default one.", async function(assert) {
		// assert
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor("myRTE9", {
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			var oRTEMenuButton = Element.getElementById(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getId() + "-TextAlign"),
				oRTEMenu = oRTEMenuButton.getAggregation("menu");
			// act
			oRTEMenu.fireItemSelected({item: oRTEMenu.getAggregation("items")[1]})
					.fireItemSelected({item: oRTEMenu.getAggregation("items")[1]});

			oRichTextEditor._pTinyMCEInitialized.then(function() {
				// assert
				assert.equal(oRTEMenuButton.getIcon(),
							"sap-icon://" + EditorCommands["TextAlign"]["Left"].icon,
							"The menu button icon should be as the default JustifyLeft command icon.");
				// destroy
				oRichTextEditor.destroy();
				done();
			});
		});
	});

	// QUnit.test("_synchronizeCustomToolbarStates() - Select", async function(assert) {
	// 	// arrange
	// 	var done = assert.async(),
	// 		oRichTextEditor = new RichTextEditor("rte-select", {
	// 			editorType: EditorType.TinyMCE6,
	// 			width: "100%",
	// 			height: "300px",
	// 			customToolbar: true,
	// 			showGroupFont : true,
	// 			showGroupUndo : true
	// 		});

	// 	oRichTextEditor.placeAt("content");
	// 	await nextUIUpdate();

	// 	oRichTextEditor.attachReady(async function() {
	// 		var oGroupFont = oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls('font');
	// 		assert.equal(oGroupFont[0].getSelectedItem().getText(), "Verdana", "The selected item should be 'Verdana'");
	// 		assert.equal(oGroupFont[1].getSelectedItem().getText(), "12 pt", "The selected item should be '10pt'");

	// 		// act
	// 		oRichTextEditor.getNativeApi().execCommand("FontSize", false, "12pt");
	// 		oRichTextEditor.getNativeApi().execCommand("FontName", false, 'wingdings, "zapf dingbats"');
	// 		await nextUIUpdate();
	// 		oRichTextEditor._pTinyMCEInitialized.then(function() {
	// 			// assert
	// 			assert.equal(Element.getElementById(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getId() + "-FontFamily").getSelectedItem().getText(),
	// 				"Wingdings",
	// 				"The selected item should be 'Wingdings'");
	// 			// destroy
	// 			oRichTextEditor.destroy();
	// 			done();
	// 		});
	// 	});
	// });

	QUnit.test("RTE.prototype.setEditable() with CustomToolbar", async function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor("myRTE10", {
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true,
				editable: false
			});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(async function() {
			// act
			await oRichTextEditor._pTinyMCEInitialized;
			oRichTextEditor.getNativeApi().setContent('<p>some</p>');
			await nextUIUpdate();

			assert.strictEqual(oRichTextEditor.getNativeApi().getContent().indexOf("span"),
				-1,
				"No additional spans are added in the content on reinizialization");
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("_synchronizeCustomToolbarStates() - Selected items update", async function(assert) {
		// arrange
		var done = assert.async(2),
			selectedFontSizeSpy, selectedFontFamilySpy, selectedFormatBlockSpy,
			oToolbar, oActiveEditor, aFontGroup,
			oRichTextEditor = new RichTextEditor("myRTE14", {
				editorType: EditorType.TinyMCE6,
				customToolbar: true,
				showGroupFont : true
			});


		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			oRichTextEditor.addButtonGroup("formatselect");

			oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper");
			aFontGroup = oToolbar._findGroupedControls('font');
			oActiveEditor = oRichTextEditor.getNativeApi();
			selectedFormatBlockSpy = sinon.spy(oToolbar._findGroupedControls('formatselect')[0], "setSelectedItemId");
			selectedFontSizeSpy = sinon.spy(aFontGroup[1], "setSelectedItemId");
			selectedFontFamilySpy = sinon.spy(aFontGroup[0], "setSelectedItemId");

			oActiveEditor.execCommand("FormatBlock", false, "h1");
            oActiveEditor.execCommand("FontName", false, '"comic sans ms", sans-serif');

			oRichTextEditor._pTinyMCEInitialized.then(function() {
				// assert
				assert.equal(selectedFormatBlockSpy.callCount, 1, "setSelectedItem was called once");
				done();

				assert.equal(selectedFontFamilySpy.callCount, 1, "setSelectedItem was called once");

				// cleanup
				oRichTextEditor.destroy();
				selectedFontFamilySpy.restore();
				selectedFontSizeSpy.restore();
				selectedFormatBlockSpy.restore();
				done();
			});
		});
	});

	QUnit.test("Undo/Redo action", async function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor("myRTE11", {
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			// act
			oRichTextEditor.getNativeApi().execCommand("Bold", false);
			oRichTextEditor.getNativeApi().execCommand("Undo", false);

			oRichTextEditor._pTinyMCEInitialized.then(function() {
				// assert
				assert.equal(Element.getElementById(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getId() + "-Bold").getPressed(),
							false,
							"The bold button should not be pressed");
				// destroy
				oRichTextEditor.destroy();
				done();
			});
		});
	});

	QUnit.test("Non-latin font family should not throw an error.", async function(assert) {
		// arrange
		var done = assert.async(0),
			oRichTextEditor = new RichTextEditor("myRTEKorean", {
				editorType: EditorType.TinyMCE6,
				customToolbar: true,
				showGroupFont : true,
				value: "<p style='font-family:\"맑은 고딕\"'>abc</p>"
			});


		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			// assert
			assert.ok(true, "Error is not thrown");

			// destroy
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("_getFontStyleCommand", async function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor("myRTE12", {
				width: "100%",
				height: "300px",
				customToolbar: true
			});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		// assert
		assert.equal(oRichTextEditor.getAggregation("_toolbarWrapper")._getFontStyleCommand(EditorCommands["FontFamily"]["Verdana"].text), EditorCommands["FontFamily"]["Verdana"].commandValue);

		// destroy
		oRichTextEditor.destroy();
		done();
	});

	QUnit.test("Custom Dialogs", async function(assert) {
		var done = assert.async(),
			openDialog;

		openDialog = async function (sGroup, sCommand, doneCallback) {
			// arrange
			var	oRichTextEditor = new RichTextEditor({
					editorType: EditorType.TinyMCE6,
					width: "100%",
					height: "300px",
					customToolbar: true,
					showGroupFont : true,
					showGroupUndo : true,
					showGroupInsert : true,
					showGroupLink : true
				}),
				fnAfterClose = function () {
					assert.ok(!oToolbarWrapper.getAggregation("_custom" + sCommand + "Dialog").isOpen(),
								"The Insert " + sCommand + " Dialog should closed");

					// destroy
					oRichTextEditor.destroy();
					setTimeout(doneCallback);
				},
				iCommandPosition = ButtonGroups[sGroup].indexOf(sCommand),
				oToolbarWrapper;

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();

			oRichTextEditor.attachReady(function() {
				oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
				oToolbarWrapper.getAggregation("_custom" + sCommand + "Dialog").attachAfterClose(fnAfterClose);
				// act
				oToolbarWrapper._findGroupedControls(sGroup)[iCommandPosition].firePress();

				// assert
				assert.ok(oToolbarWrapper.getAggregation("_custom" + sCommand + "Dialog").isOpen(),
							"The Insert " + sCommand + " Dialog should open");
				oToolbarWrapper.getAggregation("_custom" + sCommand + "Dialog").getButtons()[1].firePress();
			});
		};

		await openDialog('insert', 'InsertImage', async function () {
			await openDialog('link', 'InsertLink', done);
		});
	});

	QUnit.test("Table Dialog", async function(assert) {
		// arrange
		var done = assert.async(6),
			oRichTextEditor = new RichTextEditor("rte-table-dialog", {
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true
			}),
			oInsertTableDialog;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			oRichTextEditor.addButtonGroup({
				name: "table",
				visible: true,
				row: 1,
				priority: "60",
				buttons: ["table"]
			});
			var oTableButtonGroup = ButtonGroups["table"],
				iCommandPosition = oTableButtonGroup.indexOf("InsertTable");

			assert.ok(oTableButtonGroup, 'The "table" group should be added');
			done();

			assert.ok(iCommandPosition !== -1, 'Tabe button should exist');
			done();

			oInsertTableDialog = oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_customInsertTableDialog");

			// act
		oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls("table")[iCommandPosition].firePress();

			var aDimensionsInputs,
				sDimensionsLabelText = oResourceBundle.getText("INSERT_CONTENT_DIMENSIONS");

			// assert
			assert.ok(oInsertTableDialog.isOpen(), "The Insert Table Dialog should open");
			done();

			var aTableInputs = oInsertTableDialog.getContent()[0].getItems();
			// get all dimensions inputs
			aDimensionsInputs = aTableInputs[5].getItems()
					.filter(function(oItem){return oItem.getMetadata().getName() === "sap.m.Input";});

			aDimensionsInputs.forEach(function(oInput){
				assert.strictEqual(Element.getElementById(oInput.getAriaLabelledBy()[0]).getText(), sDimensionsLabelText,
						"The correct label is associated with the input");
				done();
			});

			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Table Dialog - columns and rows number restriction - max", async function (assert) {
		// arrange
		const done = assert.async();
		const iMaxTableCells = 25;

		const oRichTextEditor = new RichTextEditor("rte-table-dialog", {
			editorType: EditorType.TinyMCE6,
			width: "100%",
			height: "300px",
			customToolbar: true
		});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(() => {
			oRichTextEditor.addButtonGroup({
				name: "table",
				visible: true,
				row: 1,
				priority: "60",
				buttons: ["table"]
			});

			const oTableButtonGroup = ButtonGroups["table"];
			const iCommandPosition = oTableButtonGroup.indexOf("InsertTable");
			const oSpy = this.spy(oRichTextEditor.getNativeApi(), "execCommand");

			// act
			oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls("table")[iCommandPosition].firePress();

			const oInsertTableDialog = oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_customInsertTableDialog");

			const aDimensionsInputs = oInsertTableDialog.getContent()[0].getItems()
				.filter(function (oItem) { return oItem.getMetadata().getName() === "sap.m.StepInput"; });

			aDimensionsInputs[0].setValue(iMaxTableCells + 10);
			aDimensionsInputs[1].setValue(iMaxTableCells + 10);

			oInsertTableDialog.getButtons()[0].firePress();

			// assert
			assert.strictEqual(oSpy.called, true, "The method was called");
			assert.strictEqual(oSpy.firstCall.args[0], "mceInsertTable", "with correct function name");
			assert.strictEqual(oSpy.firstCall.args[2].rows, iMaxTableCells, "with correct number of rows");
			assert.strictEqual(oSpy.firstCall.args[2].columns, iMaxTableCells, "with correct number of columns");

			// restore
			oSpy.restore();
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Table Dialog - columns and rows number restriction - min", async function (assert) {
		// arrange
		const done = assert.async();
		const iMinTableCells = 0;

		const oRichTextEditor = new RichTextEditor("rte-table-dialog", {
			editorType: EditorType.TinyMCE6,
			width: "100%",
			height: "300px",
			customToolbar: true
		});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(() => {
			oRichTextEditor.addButtonGroup({
				name: "table",
				visible: true,
				row: 1,
				priority: "60",
				buttons: ["table"]
			});

			const oTableButtonGroup = ButtonGroups["table"];
			const iCommandPosition = oTableButtonGroup.indexOf("InsertTable");
			const oSpy = this.spy(oRichTextEditor.getNativeApi(), "execCommand");

			// act
			oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls("table")[iCommandPosition].firePress();

			const oInsertTableDialog = oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_customInsertTableDialog");

			const aDimensionsInputs = oInsertTableDialog.getContent()[0].getItems()
				.filter(function (oItem) { return oItem.getMetadata().getName() === "sap.m.StepInput"; });

			aDimensionsInputs[0].setValue(iMinTableCells - 10);
			aDimensionsInputs[1].setValue(iMinTableCells - 10);

			oInsertTableDialog.getButtons()[0].firePress();

			// assert
			assert.strictEqual(oSpy.called, true, "The method was called");
			assert.strictEqual(oSpy.firstCall.args[0], "mceInsertTable", "with correct function name");
			assert.strictEqual(oSpy.firstCall.args[2].rows, iMinTableCells, "with correct number of rows");
			assert.strictEqual(oSpy.firstCall.args[2].columns, iMinTableCells, "with correct number of columns");

			// restore
			oSpy.restore();
			oRichTextEditor.destroy();
			done();
		});
	});


	QUnit.test("Table Dialog - columns and rows validation state text", async function (assert) {
		// arrange
		const done = assert.async();

		const oRichTextEditor = new RichTextEditor("rte-table-dialog", {
			editorType: EditorType.TinyMCE6,
			width: "100%",
			height: "300px",
			customToolbar: true
		});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function () {
			oRichTextEditor.addButtonGroup({
				name: "table",
				visible: true,
				row: 1,
				priority: "60",
				buttons: ["table"]
			});

			const oTableButtonGroup = ButtonGroups["table"];
			const iCommandPosition = oTableButtonGroup.indexOf("InsertTable");

			// act
			oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls("table")[iCommandPosition].firePress();

			const oInsertTableDialog = oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_customInsertTableDialog");

			// get all dimensions inputs
			const aDimensionsInputs = oInsertTableDialog.getContent()[0].getItems()
				.filter(function (oItem) { return oItem.getMetadata().getName() === "sap.m.StepInput"; });

			assert.strictEqual(aDimensionsInputs[0].getValueStateText(), oResourceBundle.getText("INSERT_TABLE_ROWS_ERROR"), "The validation works correctly");
			assert.strictEqual(aDimensionsInputs[1].getValueStateText(), oResourceBundle.getText("INSERT_TABLE_COLS_ERROR"), "Error message is as expected");

			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Dialogs should have padding", async function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				showGroupLink: true,
				customToolbar: true
			}),
			oToolbar, oLinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oToolbar = oRichTextEditor && oRichTextEditor.getAggregation("_toolbarWrapper");
		oLinkButton = oToolbar && oToolbar._findGroupedControls('link')[0];

		oRichTextEditor.attachReady(function() {
			// act
			oLinkButton.firePress();
			oLinkDialog = oToolbar && oToolbar.getAggregation("_customInsertLinkDialog");

			// assert
			assert.ok(oLinkDialog.hasStyleClass("sapUiContentPadding"),
						"The Insert Link Dialog should have padding class applied");

			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("FormatBlock with formatselect", async function(assert) {
		// arrange
		var done = assert.async(4),
			oRTE = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true
			});

		oRTE.placeAt("content");
		await nextUIUpdate();

		oRTE.attachReady(function () {
			oRTE.addButtonGroup("formatselect");
			var oFormatBlockGroup = ButtonGroups["formatselect"],
					iCommandPosition = oFormatBlockGroup.indexOf("FormatBlock");

			assert.ok(oFormatBlockGroup, 'The "formatselect" group should be added');
			done();
			assert.ok(iCommandPosition !== -1, 'formatBlock button should exist');
			done();

			// act
			var oActiveEditor = oRTE.getNativeApi(),
					oFormatBlockSelect;

			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0]);

			oRTE._pTinyMCEInitialized.then(function () {

				oFormatBlockSelect = oRTE.getAggregation("_toolbarWrapper")._findGroupedControls('formatselect')[0];


				oActiveEditor.execCommand("FormatBlock", false, EditorCommands["FormatBlock"]["Heading1"].commandValue);

				// assert
				assert.equal(oFormatBlockSelect.getSelectedItem(), oFormatBlockSelect.getItemAt(1), "The selected item is correct: h1");
				done();
				assert.ok(["Heading 1", "h1"].indexOf(oActiveEditor.getDoc().queryCommandValue("FormatBlock")) > -1, "The Heading 1 format should be applied to the editor");

				// destroy
				oRTE.destroy();
				done();
			});
		});
	});

	QUnit.test("FormatBlock with styleselect", async function(assert) {
		// arrange
		var done = assert.async(4),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true
			});

		oRichTextEditor.placeAt("content");

		await nextUIUpdate();

		oRichTextEditor.attachReady(function () {
			oRichTextEditor.addButtonGroup("styleselect");

			var oFormatBlockGroup = ButtonGroups["styleselect"],
			iCommandPosition = oFormatBlockGroup.indexOf("FormatBlock");

			assert.ok(oFormatBlockGroup, 'The "formatselect" group should be added');
			assert.ok(iCommandPosition !== -1, 'formatBlock button should exist');

			// act
			var oActiveEditor = oRichTextEditor.getNativeApi(),
				oFormatBlockSelect;

			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0]);

			oRichTextEditor._pTinyMCEInitialized.then(function () {

				oFormatBlockSelect = oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls('styleselect')[0];
				assert.equal(Element.getElementById(oFormatBlockSelect.getAriaLabelledBy()[0]).getText(), oResourceBundle.getText("FORMAT_BUTTON_TOOLTIP"), "Then correct invisible text was set for formatBlock");
				done();


				oActiveEditor.execCommand("FormatBlock", false, EditorCommands["FormatBlock"]["Heading1"].commandValue);
				assert.equal(oFormatBlockSelect.getSelectedItem(), oFormatBlockSelect.getItemAt(1), "The selected item is correct: h1");
				done();
				assert.ok(["Heading 1", "h1"].indexOf(oActiveEditor.getDoc().queryCommandValue("FormatBlock")) > -1, "The Heading 1 format should be applied to the editor");
				done();
				oRichTextEditor.destroy();
				done();
			});
		});
	});

	QUnit.test("Buttons accessibility", async function(assert) {
		// arrange
		var done = assert.async(2),
			oRichTextEditor = new RichTextEditor("myRTE13", {
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			// act
			oRichTextEditor._pTinyMCEInitialized.then(function() {
				// assert
				var sAriaLabelId0 = oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls('font')[0].getAriaLabelledBy()[0],
					sAriaLabelId1 = oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls('font')[1].getAriaLabelledBy()[0],
					sAriaLabelId2 = oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls('font')[2]._getTextButton().getAriaLabelledBy()[0],
					sAriaLabelId3 = oRichTextEditor.getAggregation("_toolbarWrapper")._findGroupedControls('font')[3]._getTextButton().getAriaLabelledBy()[0];
				assert.equal(Element.getElementById(sAriaLabelId0).getText(), oResourceBundle.getText("FONT_FAMILY_TEXT"), "Then correct invisible text was set for fontFamily");
				done();
				assert.equal(Element.getElementById(sAriaLabelId1).getText(), oResourceBundle.getText("FONT_SIZE_TEXT"), "Then correct invisible text set was for fontSize");
				assert.equal(Element.getElementById(sAriaLabelId2).getText(), oResourceBundle.getText("FONT_COLOR_TEXT"), "Then correct invisible text set was for font color");
				assert.equal(Element.getElementById(sAriaLabelId3).getText(), oResourceBundle.getText("BACKGROUND_COLOR_TEXT"), "Then correct invisible text set was for background color");

				//destroy
				oRichTextEditor.destroy();
				done();
			});
		});
	});

	QUnit.module("Insert/Edit Image");

	QUnit.test("_generateImageHTML()", async function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				customToolbar: true
			});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			// assert
			assert.equal(oRichTextEditor.getAggregation("_toolbarWrapper")._generateImageHTML(), '<img>', "An IMG tag should be created");

			// destroy
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Insert Image", async function(assert) {
		// arrange
		var done = assert.async(3),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				customToolbar: true,
				showGroupInsert : true
			}),
			fnAfterClose = function () {
				oImage = oActiveEditor.dom.select('img')[0];

				assert.equal(oImage.getAttribute('data-sap-ui-rte-image-ratio'), 'false', "The image ratio attribute, should be set to true");

				// destroy
				oRichTextEditor.destroy();
				done();
			},
			sDimensionsLabelText = oResourceBundle.getText("INSERT_CONTENT_DIMENSIONS"),
			oToolbarWrapper, oImageButton, oImageDialog, oActiveEditor, aImageDialogContent, oImage, aHBoxItems;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oImageButton = oToolbarWrapper._findGroupedControls('insert')[0];
			oImageDialog = oToolbarWrapper.getAggregation("_customInsertImageDialog");
			aImageDialogContent = oImageDialog && oImageDialog.getContent();
			oImageDialog.attachAfterClose(fnAfterClose);
			aHBoxItems = aImageDialogContent[5].getItems();

			// act
			oActiveEditor = oRichTextEditor.getNativeApi();
			// assert
			assert.ok(!oImageButton.getPressed(), "The image button should not be pressed initially.");
			done();

		oImageButton.firePress();

			assert.strictEqual(Element.getElementById(aHBoxItems[2].getAriaLabelledBy()[0]).getText(), sDimensionsLabelText,
					"The ariaLabelledBy association is correctly set to the width input");
			assert.strictEqual(Element.getElementById(aHBoxItems[0].getAriaLabelledBy()[0]).getText(), sDimensionsLabelText,
					"The ariaLabelledBy association is correctly set to the height input.");
			assert.ok(!aImageDialogContent[6].getEnabled(),
				"The dimension checkbox should be disabled when there isn't an selected image.");

			aImageDialogContent[1].setValue("../images/screenshot.png");
			aImageDialogContent[3].setValue("some");
			oImageDialog.getButtons()[0].firePress();
		done();
		});
	});

	QUnit.test("Press cancel insert image button", async function(assert) {
		// arrange
		var done = assert.async(2),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				customToolbar: true,
				showGroupInsert : true
			}),
			fnAfterClose = function () {

				assert.ok(!oImageButton.getPressed(),
					"Insert image button should not be pressed if inserting of image is cancelled via cancel button.");


				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oImageButton, oImageDialog;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oImageButton = oToolbarWrapper._findGroupedControls('insert')[0];
			oImageDialog = oToolbarWrapper.getAggregation("_customInsertImageDialog");
			oImageDialog.attachAfterClose(fnAfterClose);

			// assert
			assert.ok(!oImageButton.getPressed(), "The image button should not be pressed initially.");
			done();
			oImageButton.firePress();

			setTimeout(function() {
				oImageDialog.getButtons()[1].firePress();
			}, 0);
		});
	});

	QUnit.module("Insert/Edit Link");

	QUnit.test("Insert Link", async function(assert) {
		// arrange
		var done = assert.async(8),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				customToolbar: true,
				showGroupLink : true
			}),
			fnAfterClose = function () {
				assert.equal(oRichTextEditor.getNativeApi().selection.getNode().tagName, "A", "There should be an anchor tag.");
				done();
				assert.ok(oLinkButton.getPressed(), "The link button should be pressed, when an anchor is created.");
				done();
				assert.ok(oUnlinkButton.getEnabled(), "The unlink button should be enabled, when an anchor is selected.");
				done();

				oUnlinkButton.firePress();

				setTimeout(function() {
					assert.ok(!oLinkButton.getPressed(), "When the selection is unlinked, the link button should not be pressed.");
					done();
					assert.ok(!oUnlinkButton.getEnabled(), "When the selection is unlinked, the unlink button should again be disabled.");
					done();
					assert.notEqual(oRichTextEditor.getNativeApi().selection.getStart().tagName, "A",
						"The selection tag should not be an anchor, if the link is unlinked");

					// destroy
					oRichTextEditor.destroy();
					done();
				}, 0);
			},
			oToolbarWrapper, oLinkButton, oUnlinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oUnlinkButton = oToolbarWrapper._findGroupedControls('link')[1];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0]);
			oLinkButton.firePress();

			// assert
			assert.ok(!oLinkButton.getPressed(), "The link button should not be pressed, if the selection is not an anchor.");
			done();
			assert.ok(!oUnlinkButton.getEnabled(), "The unlink button should not be enabled, if the selection is not an anchor.");
			done();

			setTimeout(function() {
				oLinkDialog.getContent()[1].setValue("#");
				oLinkDialog.getButtons()[0].firePress();
			}, 0);
		});
	});

	QUnit.test("Reset dialog fields", function(assert) {
		var done = assert.async(),
			openDialog;

		openDialog = async function (sGroup, sCommand, doneCallback) {
			var	oRichTextEditor = new RichTextEditor({
					editorType: EditorType.TinyMCE6,
					customToolbar: true,
					showGroupFont : true,
					showGroupInsert : true,
					showGroupLink : true
				}),
				fnAfterOpen = function () {
					var that = this,
						aControls = oDialog.findAggregatedObjects(true);
					// assert
					aControls.forEach(function (oControl) {
						var sControlName = oControl.getMetadata().getName();
						if (sControlName === "sap.m.Input") {
							assert.strictEqual(oControl.getValue(), '', that.getTitle() + ': The field should be empty');
						} else if (sControlName === "sap.m.CheckBox") {
							assert.strictEqual(oControl.getSelected(), false, that.getTitle() + ': The checkbox should be deselected');
						}
					});

					// destroy
					oRichTextEditor.destroy();
					setTimeout(doneCallback);
				}, oDialog;

			oRichTextEditor.placeAt("content");
			await nextUIUpdate();

			oRichTextEditor.attachReady(function() {
				oRichTextEditor.addButtonGroup({
					name: "table",
					visible: true,
					row: 1,
					priority: "60",
					buttons: ["table"]
				});

				var oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper"),
					aControls;

				oDialog = oToolbarWrapper.getAggregation("_custom" + sCommand + "Dialog");
				oDialog.attachAfterOpen(fnAfterOpen);
				aControls = oDialog.findAggregatedObjects(true);

				// act
				aControls.forEach(function (oControl) {
					var sControlName = oControl.getMetadata().getName();

					if (sControlName === "sap.m.Input") {
						oControl.setValue('text');
					} else if (sControlName === "sap.m.CheckBox") {
						oControl.setSelected(true);
					}
				});
				oToolbarWrapper._findGroupedControls(sGroup)[0].firePress();
			});
		};
		openDialog('table', 'InsertTable', function () {
			openDialog('insert', 'InsertImage', done);
		});
	});

	QUnit.test("Insert link with no given href value", async function(assert) {
		// arrange
		var done = assert.async(3),
			oRichTextEditor = new RichTextEditor({
				customToolbar: true,
				showGroupLink : true
			}),
			fnAfterClose = function () {
				assert.notEqual(oRichTextEditor.getNativeApi().selection.getStart().tagName, "A",
					"There should not be an anchor tag, since there was no href value passed.");
					done();
				assert.ok(!oLinkButton.getPressed(), "The link button should remain not pressed.");
				done();
				assert.ok(!oUnlinkButton.getEnabled(), "The unlink button should remain disabled.");

				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oLinkButton, oUnlinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oUnlinkButton = oToolbarWrapper._findGroupedControls('link')[1];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0].text);
			oLinkButton.firePress();

			setTimeout(function() {
				oLinkDialog.getButtons()[0].firePress();
			}, 0);
		});
	});

	QUnit.test("Write text, open dialog and change the text before inserting link", async function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				customToolbar: true,
				showGroupLink : true
			}),
			fnAfterClose = function () {
				assert.equal(oRichTextEditor.getNativeApi().dom.select('a')[0].text, "text",
					"The text should be changed.");

				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oLinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0]);
			oLinkButton.firePress();

			setTimeout(function() {
				oLinkDialog.getContent()[1].setValue("#");
				oLinkDialog.getContent()[3].setValue("text");
				oLinkDialog.getButtons()[0].firePress();
			}, 0);
		});
	});

	QUnit.test("Create a link with no initial node selection", async function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				customToolbar: true,
				showGroupLink : true
			}),
			fnAfterClose = function () {
				assert.equal(oRichTextEditor.getNativeApi().dom.select('a')[0].text, "text",
					"The anchor should be created.");

				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oLinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			oLinkButton.firePress();

			setTimeout(function() {
				oLinkDialog.getContent()[1].setValue("#");
				oLinkDialog.getContent()[3].setValue("text");
				oLinkDialog.getButtons()[0].firePress();
			}, 0);
		});
	});

	QUnit.test("Create a link with no initial node selection and no text provided", async function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				customToolbar: true,
				showGroupLink : true
			}),
			fnAfterClose = function () {
				assert.equal(oRichTextEditor.getNativeApi().dom.select('a')[0].text, "#",
					"The href should be mapped as anchor text");

				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oLinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			oLinkButton.firePress();

			setTimeout(function() {
				oLinkDialog.getContent()[1].setValue("#");
				oLinkDialog.getButtons()[0].firePress();
			}, 0);
		});
	});

	QUnit.test("Update Link", async function(assert) {
		// arrange
		var done = assert.async(),
			oModel = new JSONModel({value: '<a href="https://sap.com">Sap</a>'}),
			sExpectValue = '',
			oRichTextEditor = new RichTextEditor({
				customToolbar: true,
				showGroupLink: true,
				value: '{/value}'
			}).setModel(oModel),
			fnAfterClose = function () {
				assert.ok(oRichTextEditor.getValue() !== sExpectValue, "Value should have changed. This means that the binding has been triggered");

				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oLinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function () {
			sExpectValue = oRichTextEditor.getValue();

			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.selection.select(oActiveEditor.dom.select('a')[0]);
			oLinkButton.firePress();

			setTimeout(function () {
				oLinkDialog.getContent()[1].setValue("#");
				oLinkDialog.getContent()[3].setValue("text");
				oLinkDialog.getButtons()[0].firePress();
			}, 0);
		});
	});

	QUnit.test("Cancel insert link", async function(assert) {
		// arrange
		var done = assert.async(3),
			oRichTextEditor = new RichTextEditor({
				customToolbar: true,
				showGroupLink : true
			}),
			fnAfterClose = function () {
				assert.notEqual(oRichTextEditor.getNativeApi().selection.getStart().tagName, "A",
					"There should not be an anchor tag, since the cancel button was pressed");
					done();
				assert.ok(!oLinkButton.getPressed(), "The link button should remain not pressed.");
				done();
				assert.ok(!oUnlinkButton.getEnabled(), "The unlink button should remain disabled.");

				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oLinkButton, oUnlinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oUnlinkButton = oToolbarWrapper._findGroupedControls('link')[1];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<span id="mySpan">some</span>');
			oActiveEditor.selection.select(oActiveEditor.dom.select('span')[0].text);
			oLinkButton.firePress();

			setTimeout(function() {
				oLinkDialog.getContent()[1].setValue("#");
				oLinkDialog.getButtons()[1].firePress();
			}, 0);
		});
	});

	QUnit.test("Create and open edit dialog", async function(assert) {
		// arrange
		var done = assert.async(4),
			oRichTextEditor = new RichTextEditor({
				customToolbar: true,
				showGroupLink : true,
				width: "100%"
			}),
			fnAfterClose = function () {
				assert.ok(oLinkButton.getPressed(), "The link button should be pressed.");
				done();
				assert.ok(oUnlinkButton.getEnabled(), "The unlink button should be disabled.");
				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oLinkButton, oUnlinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oUnlinkButton = oToolbarWrapper._findGroupedControls('link')[1];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<a href="#">some</a>');
			oActiveEditor.selection.setCursorLocation(oActiveEditor.dom.select('a')[0]);
			oLinkButton.firePress();

			setTimeout(function() {
				assert.equal(oLinkDialog.getContent()[1].getValue(), '#',
					"The value of the url input should be the same as the href value.");
					done();
				assert.equal(oLinkDialog.getContent()[3].getValue(), 'some',
					"The value of the display text input should be the same as the value of the anchor.");
				oLinkDialog.getButtons()[1].firePress();
			}, 0);
			done();
		});
	});

	QUnit.test("Delete the href value of an existin anchor", async function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				customToolbar: true,
				showGroupLink : true,
				width: "100%"
			}),
			fnAfterClose = function () {
				assert.ok(!oRichTextEditor.getNativeApi().dom.select('a').length, "The element should be unlinked");
				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oLinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<a href="#">some</a>');
			oActiveEditor.selection.setCursorLocation(oActiveEditor.dom.select('a')[0]);
			oLinkButton.firePress();

			setTimeout(function() {
				oLinkDialog.getContent()[1].resetProperty('value');
				oLinkDialog.getButtons()[0].firePress();
			}, 0);
		});
	});

	QUnit.test("Preserve styling of elements after link insertion", async function(assert) {
		// arrange
		var done = assert.async(1),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				customToolbar: true,
				showGroupLink : true
			}),
			fnAfterClose = function () {
				assert.equal(oRichTextEditor.getNativeApi().selection.getNode().tagName, "A", "There should be an anchor tag.");
				assert.equal(oRichTextEditor.getNativeApi().selection.getNode().children[0].tagName, "STRONG", "There should be a strong in the anchor tag.");

				// destroy
				oRichTextEditor.destroy();
				done();
			},
			oToolbarWrapper, oLinkButton, oLinkDialog;

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oRichTextEditor.attachReady(function() {
			oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
			oLinkButton = oToolbarWrapper._findGroupedControls('link')[0];
			oLinkDialog = oToolbarWrapper.getAggregation("_customInsertLinkDialog");
			oLinkDialog.attachAfterClose(fnAfterClose);

			// act
			var oActiveEditor = oRichTextEditor.getNativeApi();
			oActiveEditor.setContent('<b>test</b>');
			// b gets transformed to strong
			oActiveEditor.selection.select(oActiveEditor.dom.select("strong")[0]);

			oLinkButton.firePress();

			setTimeout(function() {
				oLinkDialog.getContent()[1].setValue("#");
				oLinkDialog.getButtons()[0].firePress();
			}, 0);
		});
	});

	QUnit.module("Custom Toolbar Priority");

	QUnit.test("Increase priority", async function(assert) {
		// arrange
		var done = assert.async(8),
			sBoldText = oResourceBundle.getText("BOLD_BUTTON_TOOLTIP"),
			sItalicText =  oResourceBundle.getText("ITALIC_BUTTON_TOOLTIP"),
			sUnderlineText = oResourceBundle.getText("UNDERLINE_BUTTON_TOOLTIP"),
			sStrikeThroughText = oResourceBundle.getText("STRIKETHROUGH_BUTTON_TOOLTIP"),
			oToolbar, aContent, oFontStyleGroup,
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true
			});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar");
		aContent = oToolbar.getContent();

		// assert that the initial position of the buttons from group "font-style" is correct
		assert.strictEqual(aContent[0].getText(), sBoldText, "The Bold button is added an position 0.");
		done();
		assert.strictEqual(aContent[1].getText(), sItalicText, "The Italic button is added an position 1.");
		done();
		assert.strictEqual(aContent[2].getText(), sUnderlineText, "The Underline button is added an position 2.");
		done();
		assert.strictEqual(aContent[3].getText(), sStrikeThroughText, "The Strikethrough button is added an position 3.");
		done();

		oRichTextEditor.attachReady(async function () {
			oFontStyleGroup = oRichTextEditor.getButtonGroups()[0];

			// act
			oRichTextEditor.removeButtonGroup("font-style");
			// increase customToolbarPriority
			oFontStyleGroup.customToolbarPriority = 40;
			// add the altered group back in the toolbar
			oRichTextEditor.addButtonGroup(oFontStyleGroup);

			await nextUIUpdate();

			// assert that the changed positions of the buttons from group "font-style" is correct
			// and the buttons are added in correct order
			aContent = oToolbar.getContent();
			assert.strictEqual(aContent[1].getText(), sBoldText, "The Bold button is added an position 1.");
			done();
			assert.strictEqual(aContent[2].getText(), sItalicText, "The Italic button is added an position 2.");
			done();
			assert.strictEqual(aContent[3].getText(), sUnderlineText, "The Underline button is added an position 3.");
			done();
			assert.strictEqual(aContent[4].getText(), sStrikeThroughText, "The Strikethrough button is added an position 4.");

			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Decrease priority", async function(assert) {
		// arrange
		var done = assert.async(8),
			oStructureGroup, oToolbar, aContent,
			sBulletedListText = oResourceBundle.getText("UNORDERED_LIST_BUTTON_TOOLTIP"),
			sNumberedListText = oResourceBundle.getText("ORDERED_LIST_BUTTON_TOOLTIP"),
			sIncreaseIndentText = oResourceBundle.getText("OUTDENT_BUTTON_TOOLTIP"),
			sDecreaseIndentText = oResourceBundle.getText("INDENT_BUTTON_TOOLTIP"),
			oRichTextEditor = new RichTextEditor({
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true
			});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar");
		aContent = oToolbar.getContent();

		// assert that the initial position of the buttons from group "font-style" is correct
		assert.strictEqual(aContent[9].getText(), sBulletedListText, "The Bulleted list button is added an position 9.");
		done();
		assert.strictEqual(aContent[10].getText(), sNumberedListText, "The Numbered list button is added an position 10.");
		done();
		assert.strictEqual(aContent[11].getText(), sIncreaseIndentText, "The Increase indent button is added an position 11.");
		done();
		assert.strictEqual(aContent[12].getText(), sDecreaseIndentText, "The Decrease indent button is added an position 12.");
		done();

		oRichTextEditor.attachReady(async function () {
			oStructureGroup = oRichTextEditor.getButtonGroups()[3];

			// act
			oRichTextEditor.removeButtonGroup("structure");
			await nextUIUpdate();

			// decrease customToolbarPriority
			oStructureGroup.customToolbarPriority = 10;

			// add the altered buttons group in the toolbar
			oRichTextEditor.addButtonGroup(oStructureGroup);
			await nextUIUpdate();

			aContent = oToolbar.getContent();

			// assert that the changed positions of the buttons from group "structure" is correct
			assert.strictEqual(aContent[0].getText(), sBulletedListText, "The Bulleted list button is added an position 0.");
			done();
			assert.strictEqual(aContent[1].getText(), sNumberedListText, "The Numbered list button is added an position 1.");
			done();
			assert.strictEqual(aContent[2].getText(), sIncreaseIndentText, "The Increase indent button is added an position 2.");
			done();
			assert.strictEqual(aContent[3].getText(), sDecreaseIndentText, "The Decrease indent button is added an position 3.");

			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Custom Button position", async function(assert) {
		// arrange
		var done = assert.async(3),
			oFontStyleGroup, oToolbar, oStrikeThroughBtn,
			sStrikeThroughText =  oResourceBundle.getText("STRIKETHROUGH_BUTTON_TOOLTIP"),
			oCustomBtn = new Button({
				text: "Custom Button"
			}),
			oRichTextEditor = new RichTextEditor("myRTE", {
				editorType: EditorType.TinyMCE6,
				width: "100%",
				height: "300px",
				customToolbar: true,
				customButtons: [oCustomBtn]
			});

		oRichTextEditor.placeAt("content");
		await nextUIUpdate();

		oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar");
		oStrikeThroughBtn = oToolbar.getContent()[3];

		// check the initial position of the reference button
		assert.strictEqual(oStrikeThroughBtn.getText(), sStrikeThroughText, "The last button of font-style group is placed correctly");
		done();

		oFontStyleGroup = oRichTextEditor.getButtonGroups()[0];

		oRichTextEditor.attachReady(function () {
			oRichTextEditor.removeButtonGroup("font-style");
			oFontStyleGroup.customToolbarPriority = 2000;
			oRichTextEditor.addButtonGroup(oFontStyleGroup);
			oStrikeThroughBtn = oToolbar.getContent()[20];
			// assure that the reference button is repositioned
			assert.strictEqual(oStrikeThroughBtn.getText(), sStrikeThroughText, "The last button of font-style group is repositioned after priority change");
			done();
			assert.ok(oToolbar.indexOfContent(oStrikeThroughBtn) < oToolbar.indexOfContent(oCustomBtn), "then the group is positioned before the custom Button");

			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.module("Removing individual buttons");

	QUnit.test("Removing button from 'font-style' group", async function(assert) {
		// arrange
		var done = assert.async();
		var oRichTextEditor = new RichTextEditor({
			buttonGroups: [
				{
					name: 'font-style',
					visible: true,
					priority: 10,
					customToolbarPriority: 10,
					buttons: [
						"bold", "underline"
					]
				}
			],
			customToolbar: true
		});

		// act
		oRichTextEditor.placeAt('content');
		await nextUIUpdate();

		oRichTextEditor.attachReady(function () {
			var oToolbar = oRichTextEditor.getAggregation('_toolbarWrapper');
			var aToolbarContent = oToolbar.getAggregation("_toolbar").getContent();

			// assert
			assert.strictEqual(aToolbarContent.length, 2, "There are two buttons in the toolbar.");
			assert.strictEqual(aToolbarContent[0].getId(), oToolbar._findButtonById("Bold").getId(), "Bold button is there.");
			assert.strictEqual(aToolbarContent[1].getId(), oToolbar._findButtonById("Underline").getId(), "Underline button is there.");

			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Removing button from 'font' group", async function(assert) {
		// arrange
		var done = assert.async();
		var oRichTextEditor = new RichTextEditor({
			buttonGroups: [
				{
					name: 'font',
					visible: true,
					priority: 10,
					customToolbarPriority: 10,
					buttons: [
						"fontsizeselect", "backcolor"
					]
				}
			],
			customToolbar: true
		});

		// act
		oRichTextEditor.placeAt('content');
		await nextUIUpdate();

		oRichTextEditor.attachReady(function () {
			var oToolbar = oRichTextEditor.getAggregation('_toolbarWrapper');
			var aToolbarContent = oToolbar.getAggregation("_toolbar").getContent();

			// assert
			assert.strictEqual(aToolbarContent.length, 2, "There are two buttons in the toolbar.");
			assert.strictEqual(aToolbarContent[0].getId(), oToolbar._findButtonById("FontSize").getId(), "FontSize button is there.");
			assert.strictEqual(aToolbarContent[1].getId(), oToolbar._findButtonById("BackgroundColor").getId(), "BackgroundColor button is there.");

			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Removing button from 'clipboard' group", async function(assert) {
		// arrange
		var done = assert.async();
		var oRichTextEditor = new RichTextEditor({
			buttonGroups: [
				{
					name: 'clipboard',
					visible: true,
					priority: 10,
					customToolbarPriority: 10,
					buttons: [
						"copy"
					]
				}
			],
			customToolbar: true
		});

		// act
		oRichTextEditor.placeAt('content');
		await nextUIUpdate();

		oRichTextEditor.attachReady(function () {
			var oToolbar = oRichTextEditor.getAggregation('_toolbarWrapper');
			var aToolbarContent = oToolbar.getAggregation("_toolbar").getContent();

			// assert
			assert.strictEqual(aToolbarContent.length, 1, "There are two buttons in the toolbar.");
			assert.strictEqual(aToolbarContent[0].getId(), oToolbar._findButtonById("Copy").getId(), "Copy button is there.");

			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Removing button from 'structure' group", async function(assert) {
		// arrange
		var done = assert.async();
		var oRichTextEditor = new RichTextEditor({
			buttonGroups: [
				{
					name: 'structure',
					visible: true,
					priority: 10,
					customToolbarPriority: 10,
					buttons: [
						"numlist", "indent"
					]
				}
			],
			customToolbar: true
		});

		// act
		oRichTextEditor.placeAt('content');
		await nextUIUpdate();

		oRichTextEditor.attachReady(function () {
			var oToolbar = oRichTextEditor.getAggregation('_toolbarWrapper');
			var aToolbarContent = oToolbar.getAggregation("_toolbar").getContent();

			// assert
			assert.strictEqual(aToolbarContent.length, 2, "There are two buttons in the toolbar.");
			assert.strictEqual(aToolbarContent[0].getId(), oToolbar._findButtonById("OrderedList").getId(), "OrderedList button is there.");
			assert.strictEqual(aToolbarContent[1].getId(), oToolbar._findButtonById("Indent").getId(), "Indent button is there.");

			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Removing button from 'undo' group", async function(assert) {
		// arrange
		var done = assert.async();
		var oRichTextEditor = new RichTextEditor({
			buttonGroups: [
				{
					name: 'undo',
					visible: true,
					priority: 10,
					customToolbarPriority: 10,
					buttons: [
						"redo"
					]
				}
			],
			customToolbar: true
		});

		// act
		oRichTextEditor.placeAt('content');
		await nextUIUpdate();

		oRichTextEditor.attachReady(function () {
			var oToolbar = oRichTextEditor.getAggregation('_toolbarWrapper');
			var aToolbarContent = oToolbar.getAggregation("_toolbar").getContent();

			// assert
			assert.strictEqual(aToolbarContent.length, 1, "There are two buttons in the toolbar.");
			assert.strictEqual(aToolbarContent[0].getId(), oToolbar._findButtonById("Redo").getId(), "Redo button is there.");

			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Removing button from 'link' group", async function(assert) {
		// arrange
		var done = assert.async();
		var oRichTextEditor = new RichTextEditor({
			buttonGroups: [
				{
					name: 'link',
					visible: true,
					priority: 10,
					customToolbarPriority: 10,
					buttons: [
						"unlink"
					]
				}
			],
			customToolbar: true
		});

		// act
		oRichTextEditor.placeAt('content');
		await nextUIUpdate();

		oRichTextEditor.attachReady(function () {
			var oToolbar = oRichTextEditor.getAggregation('_toolbarWrapper');
			var aToolbarContent = oToolbar.getAggregation("_toolbar").getContent();

			// assert
			assert.strictEqual(aToolbarContent.length, 1, "There are two buttons in the toolbar.");
			assert.strictEqual(aToolbarContent[0].getId(), oToolbar._findButtonById("Unlink").getId(), "Unlink button is there.");

			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Removing button from 'text-align' group will create the whole group", async function(assert) {
		// arrange
		var done = assert.async();
		var oRichTextEditor = new RichTextEditor({
			buttonGroups: [
				{
					name: 'text-align',
					visible: true,
					priority: 10,
					customToolbarPriority: 10,
					buttons: [
						"alignleft", "aligncenter"
					]
				}
			],
			customToolbar: true
		});

		// act
		oRichTextEditor.placeAt('content');
		await nextUIUpdate();

		oRichTextEditor.attachReady(function () {
			var oToolbar = oRichTextEditor.getAggregation('_toolbarWrapper');
			var aToolbarContent = oToolbar.getAggregation("_toolbar").getContent();

			// assert
			assert.strictEqual(aToolbarContent.length, 1, "There are two buttons in the toolbar.");
			assert.strictEqual(aToolbarContent[0].getId(), oToolbar._findButtonById("TextAlign").getId(), "TextAlign menu button is there.");
			assert.ok(oToolbar._findButtonById("TextAlignLeft"), "TextAlignLeft option is there.");
			assert.ok(oToolbar._findButtonById("TextAlignCenter"), "TextAlignCenter option is there.");
			assert.ok(oToolbar._findButtonById("TextAlignRight"), "TextAlignRight option is there.");
			assert.ok(oToolbar._findButtonById("TextAlignFull"), "TextAlignFull option is there.");

			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("'text-align' group without defined buttons will create the whole group.", async function(assert) {
		// arrange
		var done = assert.async();
		var oRichTextEditor = new RichTextEditor({
			buttonGroups: [
				{
					name: 'text-align',
					visible: true,
					priority: 10,
					customToolbarPriority: 10,
					buttons: [

					]
				}
			],
			customToolbar: true
		});

		// act
		oRichTextEditor.placeAt('content');
		await nextUIUpdate();

		oRichTextEditor.attachReady(function () {
			var oToolbar = oRichTextEditor.getAggregation('_toolbarWrapper');
			var aToolbarContent = oToolbar.getAggregation("_toolbar").getContent();

			// assert
			assert.strictEqual(aToolbarContent.length, 1, "There are two buttons in the toolbar.");
			assert.strictEqual(aToolbarContent[0].getId(), oToolbar._findButtonById("TextAlign").getId(), "TextAlign menu button is there.");
			assert.ok(oToolbar._findButtonById("TextAlignLeft"), "TextAlignLeft option is there.");
			assert.ok(oToolbar._findButtonById("TextAlignCenter"), "TextAlignCenter option is there.");
			assert.ok(oToolbar._findButtonById("TextAlignRight"), "TextAlignRight option is there.");
			assert.ok(oToolbar._findButtonById("TextAlignFull"), "TextAlignFull option is there.");

			// clean
			oRichTextEditor.destroy();
			done();
		});
	});

	return waitForThemeApplied();
});
