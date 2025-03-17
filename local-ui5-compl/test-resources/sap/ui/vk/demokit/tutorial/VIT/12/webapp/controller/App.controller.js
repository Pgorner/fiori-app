sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/ContentConnector",
	 "sap/ui/vk/ViewStateManager",
	 "sap/ui/unified/ColorPickerPopover",
	 "sap/ui/unified/library",
	 "sap/ui/core/library",
	 "sap/ui/vk/tools/RedlineTool",
	 "sap/ui/vk/RedlineElementRectangle",
	 "sap/ui/vk/RedlineElementEllipse",
	 "sap/ui/vk/RedlineElementLine",
	 "sap/ui/vk/RedlineElementFreehand",
	 "sap/ui/vk/RedlineElementText"
], function(Controller, ContentResource, ContentConnector, ViewStateManager, ColorPickerPopover, UnifiedLibrary, CoreLibrary, RedlineTool, RedlineElementRectangle, RedlineElementEllipse,
	RedlineElementLine, RedlineElementFreehand, RedlineElementText) {
	"use strict";

	return Controller.extend("annotations.controller.App", {

		onInit: function() {
			var view = this.getView();
			var oViewport = view.byId("viewport");

			// Create redlineTool and add it to viewport
			this.redlineTool = window.redlineTool = new RedlineTool();
			oViewport.addTool(this.redlineTool);

			this.deletedElements = [];

			this.strokeColorPicker = view.byId("strokeColorPicker");
			this.fillColorPicker = view.byId("fillColorPicker");

			this.redliningButton = view.byId("redliningButton");
			var buttonRectangle = view.byId("buttonRectangle");
			var buttonEllipse = view.byId("buttonEllipse");
			var buttonLine = view.byId("buttonLine");
			var buttonArrowLine = view.byId("buttonArrowLine");
			var buttonFreehand = view.byId("buttonFreehand");
			var buttonText = view.byId("buttonText");

			function resetButtons(event) {
				buttonRectangle.setPressed(false);
				buttonEllipse.setPressed(false);
				buttonLine.setPressed(false);
				buttonArrowLine.setPressed(false);
				buttonFreehand.setPressed(false);
				buttonText.setPressed(false);
				if (event && event.getSource() instanceof sap.m.ToggleButton) {
					event.getSource().setPressed(true);
				}
			}
			this.redlineTool.attachElementCreated(resetButtons);

			// Constructor for a new content resource
			var contentResource = new ContentResource({
				// specifying the resource to load
				source: "models/RedlineDemo.vds",
				sourceType: "vds4",
				sourceId: "abc123"
			});

			// Constructor for a new content connector
			var contentConnector = new ContentConnector();

			// Manages the visibility and the selection states of nodes in the scene.
			var viewStateManager = new ViewStateManager("vsmA", {
				contentConnector: contentConnector
			});

			// Set content connector and viewStateManager for viewport
			oViewport.setContentConnector(contentConnector);
			oViewport.setViewStateManager(viewStateManager);

			view.addDependent(contentConnector).addDependent(viewStateManager);

			// Add resource to load to content connector
			contentConnector.addContentResource(contentResource);

			// Settings for redline
			this.settings = {
				text: "Text",
				font: "Arial",
				fontSize: 32,
				textStroke: false,
				strokeWidth: 1,
				strokeDashArray: [],
				opacity: 1,
				strokeColor: "rgba(230,96,13, 1)",
				fillColor: "rgba(0,0,0, 0)",
				halo: false
			};

			this.lineSettings = function() {
				return {
					strokeColor: this.settings.strokeColor,
					strokeWidth: this.settings.strokeWidth,
					strokeDashArray: this.settings.strokeDashArray,
					opacity: this.settings.opacity,
					halo: this.settings.halo
				};
			};

			this.arrowLineSettings = function() {
				var arrowLineSettings = this.lineSettings();
				arrowLineSettings.endArrowHead = true;
				return arrowLineSettings;
			};

			this.areaSettings = function() {
				var areaSettings = this.lineSettings();
				areaSettings.fillColor = this.settings.fillColor;
				return areaSettings;
			};

			this.textSettings = function() {
				var textSettings = {
					text: this.settings.text,
					font: this.settings.font,
					fontSize: this.settings.fontSize,
					fillColor: this.settings.textStroke ? this.settings.fillColor : this.settings.strokeColor,
					strokeColor: this.settings.textStroke ? this.settings.strokeColor : "rgba(0,0,0,0)",
					opacity: this.settings.opacity,
					halo: this.settings.halo
				};
				if (this.settings.textStroke) {
					textSettings.strokeWidth = this.settings.strokeWidth;
					textSettings.strokeDashArray = this.settings.strokeDashArray;
				}
				return textSettings;
			};

			// Export redlining as SVG or JSON
			this.download = function(data, filename, type) {
				var file = new Blob([ data ], {
					type: type
				});
				if (window.navigator.msSaveOrOpenBlob) { // IE10+
					window.navigator.msSaveOrOpenBlob(file, filename);
				} else { // Others
					var a = document.createElement("a");
					var url = URL.createObjectURL(file);
					a.href = url;
					a.download = filename;
					document.body.appendChild(a);
					a.click();
					setTimeout(function() {
						document.body.removeChild(a);
						window.URL.revokeObjectURL(url);
					}, 0);
				}
			};

		},

		onActivate: function(event) {
			// Clear redline elements
			this.redlineTool.destroyRedlineElements();

			// Activate redlining
			this.redlineTool.setActive(this.redliningButton.getPressed());
		},

		onUndo: function(event) {
			var elements = this.redlineTool.getRedlineElements();
			if (elements.length > 0) {
				this.deletedElements.push(elements[ elements.length - 1 ]);
				this.redlineTool.removeRedlineElement(elements.length - 1);
				this.redlineTool.getGizmo().invalidate();
			}
		},

		onRedo: function(event) {
			if (this.deletedElements.length > 0) {
				this.redlineTool.addRedlineElement(this.deletedElements.pop());
				this.redlineTool.getGizmo().invalidate();
			}
		},

		onRemoveAll: function(event) {
			var elements = this.redlineTool.getRedlineElements();
			var i = elements.length;
			while (i-- > 0) {
				this.deletedElements.push(elements[ i ]);
			}
			this.redlineTool.removeAllRedlineElements();
			this.redlineTool.getGizmo().invalidate();
		},

		onRectangle: function(event) {
			this.redlineTool.startAdding(new RedlineElementRectangle(this.areaSettings()));
		},

		onEllipse: function(event) {
			this.redlineTool.startAdding(new RedlineElementEllipse(this.areaSettings()));
		},

		onLine: function(event) {
			this.redlineTool.startAdding(new RedlineElementLine(this.lineSettings()));
		},

		onArrowLine: function(event) {
			this.redlineTool.startAdding(new RedlineElementLine(this.arrowLineSettings()));
		},

		onFreehand: function(event) {
			this.redlineTool.startAdding(new RedlineElementFreehand(this.lineSettings()));
		},

		onText: function(event) {
			this.redlineTool.startAdding(new RedlineElementText(this.textSettings()));
		},

		onExportSVG: function(event) {
			// Export as SVG
			var svg = this.redlineTool.exportSVG();
			var s = new XMLSerializer();
			this.download(s.serializeToString(svg), "exported.svg", "xml");
		},

		onExportJSON: function(event) {
			// Export as JSON
			var json = this.redlineTool.exportJSON();
			this.download(JSON.stringify(json), "exported.json", "json");
		},

		onFileUpload: function(event) {
			// Upload redlining SVG or JSON
			var inputFiles = event.getParameter("files");
			var that = this;
			if (inputFiles.length > 0) {
				var reader = new FileReader();
				reader.onload = function(e) {
					that.redliningButton.setPressed(true);
					that.redliningButton.firePress();
					if (inputFiles[ 0 ].name.substr(-3) === "svg") {
						var doc = new DOMParser();
						var xml = doc.parseFromString(e.target.result, "image/svg+xml");
						that.redlineTool.importSVG(xml.documentElement);
					} else if (inputFiles[ 0 ].name.substr(-4) === "json") {
						var json = JSON.parse(e.target.result);
						that.redlineTool.importJSON(json);
					}
				};
				reader.readAsText(inputFiles[ 0 ]);
			}
		},

		onStrokeValueHelp: function(event) {
				var that = this;
				var ColorPickerMode = UnifiedLibrary.ColorPickerMode;
				var ColorPickerDisplayMode = UnifiedLibrary.ColorPickerDisplayMode;
				this.colorPickerLargePopover = new ColorPickerPopover({
					displayMode: ColorPickerDisplayMode.Large,
					mode: ColorPickerMode.HSL,
					change: function(event) {
						that.settings.strokeColor = event.getParameter("colorString");
						this.strokeColorPicker.setValue(that.settings.strokeColor);
						this.strokeColorPicker.setValueState("None");
					}.bind(this)
				});
			this.colorPickerLargePopover.setColorString(this.settings.strokeColor);
			this.colorPickerLargePopover.openBy(event.getSource());
		},

		onStrokeChange: function(event) {
			var valid = CoreLibrary.CSSColor.isValid(this.getValue());
			this.setValueState(valid ? "None" : "Error");

			if (valid) {
				this.settings.strokeColor = this.getValue();
			}
		},

		onFillValueHelp: function(event) {
				var that = this;
				var ColorPickerMode = UnifiedLibrary.ColorPickerMode;
				var ColorPickerDisplayMode = UnifiedLibrary.ColorPickerDisplayMode;
				this.colorPickerLargePopover = new ColorPickerPopover({
					displayMode: ColorPickerDisplayMode.Large,
					mode: ColorPickerMode.HSL,
					change: function(event) {
						that.settings.fillColor = event.getParameter("colorString");
						this.fillColorPicker.setValue(that.settings.fillColor);
						this.fillColorPicker.setValueState("None");
					}.bind(this)
				});
			this.colorPickerLargePopover.setColorString(this.settings.fillColor);
			this.colorPickerLargePopover.openBy(event.getSource());
		},

		onFillChange: function(event) {
			var valid = CoreLibrary.CSSColor.isValid(this.getValue());
			this.setValueState(valid ? "None" : "Error");

			if (valid) {
				this.settings.fillColor = this.getValue();
			}
		}
	});
});
