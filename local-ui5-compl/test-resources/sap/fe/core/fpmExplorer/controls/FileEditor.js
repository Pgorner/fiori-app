/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"../util/FileUtils",
		"sap/base/util/extend",
		"sap/m/IconTabHeader",
		"sap/m/IconTabFilter",
		"sap/m/Image",
		"sap/m/MessageStrip",
		"sap/m/MessageToast",
		"sap/ui/codeeditor/CodeEditor",
		"sap/ui/core/Control",
		"sap/ui/core/HTML",
		"sap/base/util/restricted/_debounce"
	],
	function (FileUtils, extend, IconTabHeader, IconTabFilter, Image, MessageStrip, MessageToast, CodeEditor, Control, HTML) {
		"use strict";
		var FileEditor = Control.extend("sap.fe.core.fpmExplorer.controls.FileEditor", {
			metadata: {
				properties: {
					/**
					 * Array containing list of objects which have property name and link
					 */
					files: {
						type: "object[]",
						defaultValue: []
					},
					editable: {
						type: "boolean",
						defaultValue: true
					}
				},
				aggregations: {
					_header: {
						type: "sap.ui.core.Control",
						multiple: false,
						visibility: "hidden"
					},
					_editor: {
						type: "sap.ui.core.Control",
						multiple: false,
						visibility: "hidden"
					},
					_readOnlyWarningStrip: {
						type: "sap.ui.core.Control",
						multiple: false,
						visibility: "hidden"
					},
					_errorsStrip: {
						type: "sap.ui.core.Control",
						multiple: false,
						visibility: "hidden"
					},
					_schemaErrorsStrip: {
						type: "sap.ui.core.Control",
						multiple: false,
						visibility: "hidden"
					},
					_image: {
						type: "sap.ui.core.Control",
						multiple: false,
						visibility: "hidden"
					},
					_MDView: {
						type: "sap.ui.core.Control",
						multiple: false,
						visibility: "hidden"
					}
				},
				events: {
					fileChange: {},
					fileSwitch: {
						parameters: {
							editable: { type: "boolean" }
						}
					}
				}
			},
			renderer: {
				apiVersion: 2,
				render: function (oRm, oFileEditor) {
					oRm.openStart("div", oFileEditor).class("sapUiFPMExplorerFileEditor").style("height", "100%").openEnd();

					oRm.openStart("div").class("sapUiFPMExplorerFileEditorHeader").openEnd();
					oRm.renderControl(oFileEditor._getErrorsStrip());
					oRm.renderControl(oFileEditor._getSchemaErrorsStrip());
					oRm.renderControl(oFileEditor._getReadOnlyWarningStrip());

					if (oFileEditor.getFiles().length > 1) {
						oRm.renderControl(oFileEditor._getHeader());
					}

					oRm.close("div");

					oRm.openStart("div").class("sapUiFPMExplorerFileEditorContent").openEnd();
					oRm.renderControl(oFileEditor._getImage());
					oRm.renderControl(oFileEditor._getMDView());
					oRm.renderControl(oFileEditor._getEditor());
					oRm.close("div");

					oRm.close("div");
				}
			}
		});

		FileEditor.prototype.init = function () {
			this._bFetch = false;
			this._aFiles = [];
		};

		FileEditor.prototype.onBeforeRendering = function () {
			if (!this._bFetch) {
				return;
			}

			this._bFetch = false;
			var fnResolve = function () {
				this._getHeader().setSelectedKey(this._aFiles[0].key);
				this._createIconTabFilters();
				this._update();
			}.bind(this);
			this._fetchContents(this._aFiles, fnResolve);
		};

		FileEditor.prototype.setEditable = function (editable) {
			if (editable !== undefined) {
				this.setProperty("editable", editable);
			} else {
				this.setProperty("editable", true);
			}
		};

		FileEditor.prototype.getEditable = function () {
			return this.getProperty("editable");
		};

		FileEditor.prototype.setFiles = function (aFiles) {
			this._getHeader().destroyItems();
			this._bFetch = true;
			this._bFirstRefresh = 2;
			this._createInternalFiles(aFiles);

			return this.setProperty("files", aFiles);
		};

		FileEditor.prototype._getHeader = function () {
			var oHeader = this.getAggregation("_header");

			if (!oHeader) {
				oHeader = new IconTabHeader(this.getId() + "-header", {
					select: this._onFileSwitch.bind(this)
				});
				this.setAggregation("_header", oHeader);
			}

			return oHeader;
		};

		FileEditor.prototype._getEditor = function () {
			var oEditor = this.getAggregation("_editor");

			if (!oEditor) {
				oEditor = new CodeEditor(this.getId() + "-editor", {
					liveChange: this._onFileEdit.bind(this),
					syntaxHints: false
				});

				oEditor._oEditor.session.on("changeAnnotation", this._onSyntaxError.bind(this));
				oEditor._oEditor.completers = []; // This will prevent all auto complete and suggestions of the editor
				this.setAggregation("_editor", oEditor);
			}

			return oEditor;
		};

		FileEditor.prototype._getReadOnlyWarningStrip = function () {
			var oStrip = this.getAggregation("_readOnlyWarningStrip");

			if (!oStrip) {
				oStrip = new MessageStrip({
					showIcon: true,
					type: "Information",
					text: "Editing and auto reload disabled, files are for illustration only",
					visible: false
				});
				this.setAggregation("_readOnlyWarningStrip", oStrip);
			}

			return oStrip;
		};

		FileEditor.prototype._getErrorsStrip = function () {
			var oStrip = this.getAggregation("_errorsStrip");

			if (!oStrip) {
				oStrip = new MessageStrip({
					showIcon: true,
					type: "Error",
					visible: false
				});
				this.setAggregation("_errorsStrip", oStrip);
			}

			return oStrip;
		};

		FileEditor.prototype._getSchemaErrorsStrip = function () {
			var oStrip = this.getAggregation("_schemaErrorsStrip");

			if (!oStrip) {
				oStrip = new MessageStrip({
					showIcon: true,
					type: "Error",
					visible: false
				});
				this.setAggregation("_schemaErrorsStrip", oStrip);
			}

			return oStrip;
		};

		FileEditor.prototype._getImage = function () {
			var oImage = this.getAggregation("_image");

			if (!oImage) {
				oImage = new Image(this.getId() + "-image", {
					width: "100%"
				});
				this.setAggregation("_image", oImage);
			}

			return oImage;
		};

		FileEditor.prototype._getMDView = function () {
			var mdView = this.getAggregation("_MDView");

			if (!mdView) {
				mdView = new HTML(this.getId() + "-mdView", {
					width: "100%",
					sanitizeContent: true
				});
				this.setAggregation("_MDView", mdView);
			}
			return mdView;
		};

		FileEditor.prototype._renderMarkdown = function (fileContent) {
			sap.ui.require(
				["sap/ui/integration/thirdparty/markdown-it"],
				function (_Markdown) {
					if (!this.Markdownit) {
						this.Markdownit = _Markdown;
					}
					const html = this.Markdownit("commonmark", {
						html: true,
						linkify: true,
						typographer: true,
						breaks: true
					}).render(fileContent);
					this._getMDView()
						.setContent("<div id='markdown' class='markdown-body'>" + html + "</div>")
						.setVisible(true);
				}.bind(this)
			);
		};

		FileEditor.prototype._update = function () {
			var sSelectedFileKey = this._getHeader().getSelectedKey(),
				sFileExtension = sSelectedFileKey.split(".").pop(),
				iSelectedFileIndex = this._aFiles.findIndex(function (oEl) {
					return oEl.key === sSelectedFileKey;
				}),
				oSelectedFile = this._aFiles[iSelectedFileIndex],
				bEditable = this.getEditable();

			//choose code editor type dependent on file type
			//default editor type 'javascript' applies syntax checks on editor content
			switch (sFileExtension) {
				case "js":
					sFileExtension = "javascript";
					break;
				case "cds":
					//no code editor type available for file type 'cds'
					//choosing editor type with nice coloring and no syntax checks
					sFileExtension = "red";
					break;
				default:
					//keep as is
					break;
			}

			this._getReadOnlyWarningStrip().setVisible(!bEditable);

			this._getErrorsStrip().setVisible(false);
			this._getSchemaErrorsStrip().setVisible(false);

			if (FileUtils.isBlob(sSelectedFileKey)) {
				this._getImage().setSrc(oSelectedFile.content).setVisible(true);
				document.getElementById("markdown")?.classList?.add("sapUiHiddenPlaceholder");
				this._getEditor().setVisible(false);
			} else if (FileUtils.isMD(sSelectedFileKey)) {
				this._renderMarkdown(oSelectedFile.content);
				document.getElementById("markdown")?.classList?.remove("sapUiHiddenPlaceholder");
				this._getImage().setVisible(false);
				this._getEditor().setVisible(false);
			} else {
				this._bPreventLiveChange = true;
				this._getEditor().setEditable(bEditable).setType(sFileExtension).setValue(oSelectedFile.content).setVisible(true);
				this._bPreventLiveChange = false;

				this._getImage().setVisible(false);
				document.getElementById("markdown")?.classList?.add("sapUiHiddenPlaceholder");
			}

			this.fireFileSwitch({
				editable: bEditable
			});
		};

		FileEditor.prototype._createIconTabFilters = function () {
			this._aFiles.forEach(
				function (oFile) {
					this._getHeader().addItem(
						new IconTabFilter({
							key: oFile.key,
							text: oFile.name
						})
					);
				}.bind(this)
			);
		};
		FileEditor.mimetypes = {
			js: "text/javascript",
			json: "application/json",
			html: "text/html",
			properties: "text/plain"
		};

		FileEditor.prototype._fetchContents = async function (aFiles, fnResolve) {
			var aFetchPromises = aFiles.map(function (oFile) {
				var sType = oFile.url.substring(oFile.url.lastIndexOf(".") + 1);
				oFile._type = FileEditor.mimetypes[sType] || "text/plain";
				oFile.promise = FileUtils.fetch(sap.ui.require.toUrl("sap/fe/core/fpmExplorer" + oFile.url));
				return oFile.promise;
			});

			return Promise.all(aFetchPromises)
				.then(function (aData) {
					aData.forEach((sData, i) => {
						aFiles[i]._url = URL.createObjectURL(new Blob([sData], { type: aFiles[i]._type }));
						aFiles[i].content = sData;
					});
					return aFiles;
				})
				.then(fnResolve)
				.catch(
					function (sErr) {
						this._getErrorsStrip().setVisible(true).setText(sErr);
					}.bind(this)
				);
		};

		FileEditor.prototype._onFileSwitch = function (oEvent) {
			this._update();
		};

		FileEditor.prototype._onFileEdit = function (oEvent) {
			if (this._bFirstRefresh > 0 && oEvent.mParameters.editorEvent.action === "insert") {
				this._bFirstRefresh--;
				return;
			}
			if (this._bPreventLiveChange) {
				return;
			}
			if (oEvent.getParameter("value") === "") {
				return;
			}
			var oCurrentKey = this.getAggregation("_header").getSelectedKey();
			var aFiles = this._aFiles;
			var oCurrentFile = aFiles.find(function (oFile) {
				return oFile.key === oCurrentKey;
			});
			if (oCurrentFile.content === oEvent.getParameter("value")) {
				return;
			}
			oCurrentFile.content = oEvent.getParameter("value");
			var that = this;
			fetch("." + oCurrentFile.url, { method: "POST", body: oCurrentFile.content })
				.then((res) => {
					return res.text();
				})
				.then((res2) => {
					that.fireFileChange();
				})
				.catch((err) => {});
		};

		FileEditor.prototype._findIndex = function (sName) {
			return this._aFiles.findIndex(function (oFile) {
				return oFile.key === sName;
			});
		};

		FileEditor.prototype._onSyntaxError = function () {
			var aErrorAnnotations = this._getEditor()._oEditor.session.$annotations,
				sMessage = "";

			if (aErrorAnnotations && aErrorAnnotations.length) {
				aErrorAnnotations.forEach(function (oError) {
					sMessage += "Line " + String(oError.row) + ": " + oError.text + "\n";
				});
				this._getErrorsStrip().setVisible(true).setText(sMessage);
			} else {
				this._getErrorsStrip().setVisible(false);
			}
		};

		FileEditor.prototype._createInternalFiles = function (aFiles) {
			this._aFiles = aFiles.map(function (oFile) {
				return extend({}, oFile, {
					content: "",
					promise: null
				});
			});
		};

		FileEditor.prototype.hideSchemaErrors = function () {
			this._getSchemaErrorsStrip().setVisible(false);
		};

		FileEditor.prototype.getFilesWithContent = async function (aFiles, aExtraFiles) {
			if (!aFiles) {
				aFiles = this._aFiles;
			}
			if (aExtraFiles) {
				aFiles = aFiles.concat(aExtraFiles);
			}
			await this._fetchContents(aFiles);
			var aFetchPromises = aFiles.map(function (oFile) {
				return oFile.promise;
			});

			return Promise.all(aFetchPromises).then(function () {
				return aFiles;
			});
		};
		FileEditor.prototype.setFilesWithContent = async function (filesWithContent) {
			await Promise.all(
				Object.keys(filesWithContent).map((currentFileName) => {
					return fetch("." + currentFileName, { method: "POST", body: filesWithContent[currentFileName] });
				})
			);
			const filesToSet = Object.keys(filesWithContent).map((currentFileName) => {
				const fileKey = currentFileName.substring(currentFileName.lastIndexOf("/") + 1);
				return {
					name: fileKey,
					url: currentFileName,
					key: fileKey
				};
			});

			setTimeout(() => {
				this.setFiles(filesToSet);
				this.invalidate();
				this.fireFileChange();
				MessageToast.show("Sample successfully imported");
			}, 1000);
		};

		FileEditor.prototype.showError = function (sError) {
			this._getErrorsStrip().setVisible(true).setText(sError);
		};

		return FileEditor;
	}
);
