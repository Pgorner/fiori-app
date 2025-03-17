sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/UIComponent",
		"sap/ui/core/library",
		"../model/ExploreSettingsModel",
		"../util/FileUtils",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/BindingMode",
		"sap/ui/Device",
		"sap/ui/core/Core",
		"sap/base/Log",
		"sap/base/util/restricted/_debounce",
		"sap/base/util/deepClone",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/m/TextArea",
		"sap/m/Dialog",
		"sap/m/Button",
		"sap/m/Text",
		"sap/m/library",
		"sap/ui/unified/FileUploader",
		"sap/ui/layout/VerticalLayout",
		"sap/ui/core/Theming"
	],
	function (
		Controller,
		UIComponent,
		coreLib,
		exploreSettingsModel,
		FileUtils,
		JSONModel,
		BindingMode,
		Device,
		Core,
		Log,
		_debounce,
		deepClone,
		MessageToast,
		MessageBox,
		TextArea,
		Dialog,
		Button,
		Text,
		mLibrary,
		FileUploader,
		VerticalLayout,
		Theming
	) {
		"use strict";
		const ButtonType = mLibrary.ButtonType;
		const ValueState = coreLib.ValueState;
		const DialogType = mLibrary.DialogType;
		return Controller.extend("sap.fe.core.fpmExplorer.controller.BaseController", {
			onInit: function () {
				this.model = new JSONModel({});
				this.model.setDefaultBindingMode(BindingMode.OneWay);
				this._sampleIndexModel = this.getOwnerComponent().getModel("sampleIndex_model");
				this.getView().setModel(this.model);
				this.getView().setModel(exploreSettingsModel, "settings");
				this._fileEditor = this.byId("fileEditor");
				this._paneContainer = this.byId("explorerPaneContainer");
				this.onFileEditorFileChangeDebounced = _debounce(this.onFileEditorFileChangeDebounced, 1000);
				this._fnApplyAppSettingsHandler = this._ApplyAppSettingsHandler.bind(this);
				//apply current app settings to iFrame content
				window.addEventListener("message", this._fnApplyAppSettingsHandler);
				this._registerResize();
				//apply app settings changes to iFrame content
				Theming.attachApplied((oEvent) => {
					this.applyAppSettings();
				});
			},

			onExit: function () {
				this._deregisterResize();
				window.removeEventListener("message", this._fnApplyAppSettingsHandler);
				window.removeEventListener("message", this._fnOnFrameMessageHandler);
				this._fnOnFrameMessageHandler = null;
			},

			_removePreviousPage: function (sTopic) {
				//fix issue with service worker based mock server instantiation when toggling FPM Explorer topics
				//get all iframes from DOM
				var iframes = document.querySelectorAll("iframe.sapUiTopicsIframe");
				iframes.forEach(function (iframe) {
					//remove whole sample pages from DOM if iframe baseURI differs from target route topic
					if (!iframe.baseURI.includes(sTopic)) {
						var sPageId = iframe.parentNode.id.split("--iframeWrapper")[0];
						if (sPageId) {
							//determine sample page
							const oPage = document.getElementById(sPageId);
							//check for code editor existence in sample page children to avoid removing plain md overview pages
							if (oPage && oPage.querySelector("#" + sPageId + "--editPage")) {
								document.getElementById(sPageId).parentNode.removeChild(oPage);
							}
						}
					}
				});
			},

			_findSample: async function (sSampleKey) {
				try {
					var sections = (await this.getNavigationModel()).getProperty("/navigation"),
						foundSample;
					// loops through all samples in the navigation and gets the current one
					sections.some(function (section) {
						if (section.key === sSampleKey) {
							foundSample = section;
							foundSample.topicTitle = section.title;
							return true;
						}
						if (section.items) {
							section.items.some(function (sample) {
								if (sample.key === sSampleKey) {
									foundSample = sample;
									foundSample.topicTitle = section.title + " - " + sample.title;
									return true;
								}
							});
						}
					});

					return foundSample;
				} catch (error) {
					Log.error(error);
					return null;
				}
			},

			_findSubSample: function (oSample, subSampleKey) {
				var foundSubSample;

				if (!subSampleKey) {
					return null;
				}

				oSample.subSamples.some(function (subSample) {
					if (subSample.key === subSampleKey) {
						foundSubSample = subSample;
						return true;
					}
				});

				return foundSubSample;
			},

			_showSample: function (sample, subSample) {
				var currentSample = subSample || sample;
				var that = this;
				this._currSample = currentSample;
				if (this._currSample.key !== currentSample.key) {
					return;
				}
				this.editorPane = this.byId("editorPane");
				if (currentSample.files) {
					this._fileEditor.setEditable(currentSample.editable != undefined ? currentSample.editable : true);
					this._fileEditor.setFiles(currentSample.files);
					this._paneContainer.addPane(this.editorPane);
				} else {
					this._paneContainer.removePane(this.editorPane);
					that.byId("splitView").setBusy(false);
				}

				if (exploreSettingsModel.getProperty("/splitViewVertically")) {
					this._changeSplitterOrientation();
				}

				if (exploreSettingsModel.getProperty("/panesSwitched")) {
					this._changeSplitPanePosition();
				}

				this.model.setProperty("/sample", sample);
				window.addEventListener(
					"message",
					async function (event) {
						if (event.data === "sampleLoaded") {
							that.byId("splitView").setBusy(false);
							//check on sample files to upload after navigation
							var filestoUpload = JSON.parse(sessionStorage.getItem("sampleUpload"));
							if (filestoUpload) {
								try {
									const sampleInfo = FileUtils.getSampleInfo(filestoUpload);
									//check on uploaded sample path matches root path of shown sample
									if (this._checkSamplePath(sampleInfo)) {
										let matchingFiles = FileUtils.getMatchingFilesFromUpload(filestoUpload, this._currSample.files);
										this._importSample(matchingFiles, sampleInfo);
									}
								} catch (error) {
									sessionStorage.removeItem("sampleUpload");
									this._showInvalidSample(error);
								}
							}
						}
					}.bind(this)
				);
				try {
					var topicURL = sap.ui.require.toUrl(this.getTopicUrl() + sample.key + ".html");
					if (sample.hash) {
						topicURL += "#" + sample.hash;
					}
					this.model.setProperty("/topicURL", topicURL);

					if (subSample) {
						this.model.setProperty("/subSample", subSample);
					}
				} catch (sError) {
					Log.error(sError);
					return;
				}
			},

			_checkSamplePath: function (sampleInfo) {
				const samplePath = JSON.parse(sampleInfo).samplePath,
					parts = samplePath.split("/topics/").pop().split("/");
				//make sure sample path matches a routing pattern
				if (!this.getRouter().getURL(parts[0], { sample: parts[1], subSample: parts[2] })) {
					throw new Error("Invalid Sample Path");
				}
				//check route matches current sample
				return samplePath === this._currSample.downloadRootUrl;
			},

			_importSample: async function (matchingFiles, sampleInfo) {
				sessionStorage.removeItem("sampleUpload");
				//check on matching UI5 version
				const versionInfo = await FileUtils._getVersionInfo(exploreSettingsModel.getProperty("/fallBackUI5Version"));
				if (JSON.parse(sampleInfo).version === versionInfo) {
					await this._fileEditor.setFilesWithContent(matchingFiles);
				} else {
					const versionDialog = new Dialog({
						type: DialogType.Message,
						state: ValueState.Warning,
						title: "Warning",
						content: new Text({
							text:
								"Uploaded Sample UI5 version " +
								JSON.parse(sampleInfo).version +
								" differs from current UI5 version " +
								versionInfo +
								"."
						}),
						beginButton: new Button({
							text: "Import Anyway",
							press: async () => {
								versionDialog.close();
								await this._fileEditor.setFilesWithContent(matchingFiles);
							}
						}),
						endButton: new Button({ text: "Cancel", press: () => versionDialog.close() })
					});
					versionDialog.open();
				}
			},

			_storeSampleAndNavigate: function (unpackagedFiles, sampleInfo) {
				const navigationDialog = new Dialog({
					type: DialogType.Message,
					state: ValueState.Warning,
					title: "Warning",
					content: new Text({
						text: "Imported file content matches another sample. Do you want to navigate there?"
					}),
					beginButton: new Button({
						text: "Navigate and Import",
						press: () => {
							navigationDialog.close().destroy();
							sessionStorage.setItem("sampleUpload", JSON.stringify(unpackagedFiles));
							const parts = JSON.parse(sampleInfo).samplePath.split("/topics/").pop().split("/");
							this._removePreviousPage(parts[0]);
							this.getRouter().navTo(parts[0], {
								sample: parts[1],
								subSample: parts[2]
							});
						}
					}),
					endButton: new Button({ text: "Cancel", press: () => navigationDialog.close().destroy() })
				});
				navigationDialog.open();
			},

			onUpload: function () {
				var sampleFile;
				const fileUploader = new FileUploader({
					id: "sampleFileUploader",
					width: "100%",
					tooltip: "Select a sample file (.files.zip)",
					change: (event) => {
						sampleFile = event.getParameter("files") && event.getParameter("files")[0];
						uploadDialog.getBeginButton().setEnabled(sampleFile.name.length > 0);
					},
					style: "Emphasized",
					fileType: "zip",
					placeholder: "Select a sample file (.files.zip)..."
				});
				var uploadDialog = new Dialog({
					title: "Upload and Import Sample File",
					content: new VerticalLayout({
						width: "400px"
					})
						.addStyleClass("sapUiMediumMargin")
						.addContent(
							new Text({
								class: "sapUiSmallMarginBottom",
								text: "You can upload and import a sample (.files.zip) that has been downloaded and shared with you."
							}).addStyleClass("sapUiSmallMarginBottom")
						)
						.addContent(fileUploader),
					beginButton: new Button({
						text: "Upload and Import",
						enabled: false,
						press: () => {
							uploadDialog.close().destroy();
							if (sampleFile && window.FileReader) {
								const reader = new FileReader();
								var that = this;
								reader.onload = async function (event) {
									var toUpload = event.target.result;
									try {
										let unpackagedFiles = await FileUtils.unpackFiles(toUpload);
										const sampleInfo = FileUtils.getSampleInfo(unpackagedFiles);
										//check on uploaded sample path matches root path of shown sample
										if (this._checkSamplePath(sampleInfo)) {
											let matchingFiles = FileUtils.getMatchingFilesFromUpload(
												unpackagedFiles,
												this._currSample.files
											);
											this._importSample(matchingFiles, sampleInfo);
										} else {
											this._storeSampleAndNavigate(unpackagedFiles, sampleInfo);
										}
									} catch (error) {
										this._showInvalidSample(error);
									}
								}.bind(this);
								reader.readAsArrayBuffer(sampleFile);
							}
						}
					}),
					endButton: new Button({ text: "Cancel", press: () => uploadDialog.close().destroy() })
				}).addStyleClass("sapUiLargeMargin");
				uploadDialog.open();
			},

			_showInvalidSample: function (error) {
				const invalidSampleDialog = new Dialog({
					type: DialogType.Message,
					title: "Sample Upload Failed",
					state: ValueState.Error,
					content: new Text({
						text: error + ".\n Please make sure to provide a valid sample (.files.zip)."
					}),
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "OK",
						press: function () {
							invalidSampleDialog.close().destroy();
						}
					})
				});
				invalidSampleDialog.open();
			},

			onFileEditorFileChange: function (event) {
				this.onFileEditorFileChangeDebounced();
			},

			onFileSwitch: function (event) {
				exploreSettingsModel.setProperty("/editable", event.getParameter("editable"));
			},

			onRunPressed: function (event) {
				this._updateSample.bind(this)();
			},

			onChangeSplitterOrientation: function (event) {
				//Toggles the value of splitter orientation
				exploreSettingsModel.setProperty("/splitViewVertically", !exploreSettingsModel.getProperty("/splitViewVertically"));
				this._changeSplitterOrientation();
			},

			_changeSplitterOrientation: function () {
				var isOrientationVertical = exploreSettingsModel.getProperty("/splitViewVertically");
				this._paneContainer.setOrientation(isOrientationVertical ? "Vertical" : "Horizontal");
				this.byId("splitPaneBtn").toggleStyleClass("splitPaneBtnOrientation", isOrientationVertical);
			},

			onChangeSplitPanePosition: function (event) {
				exploreSettingsModel.setProperty("/panesSwitched", !exploreSettingsModel.getProperty("/panesSwitched"));
				this._changeSplitPanePosition();
			},

			_changeSplitPanePosition: function () {
				const panes = this._paneContainer.getPanes();
				this._paneContainer.removeAllPanes();
				while (panes.length > 0) {
					this._paneContainer.addPane(panes.pop());
				}
			},

			/**
			 * A method to be overridden by the specific topic controllers
			 * @protected
			 */
			getNavigationModel: function () {
				throw new Error("getNavigationModel: Implementation required in specific controller");
			},

			/**
			 * A method to be overridden by the specific topic controllers
			 * @protected
			 */
			getTopicUrl: function () {
				throw new Error("getTopicUrl: Implementation required in specific controller");
			},

			/**
			 * Convenience method for accessing the router.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter: function () {
				return UIComponent.getRouterFor(this);
			},

			/**
			 * Convenience method for getting the view model by name.
			 * @public
			 * @param {string} [name] the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel: function (name) {
				return this.getView().getModel(name);
			},

			/**
			 * Convenience method for setting the view model.
			 * @public
			 * @param {sap.ui.model.Model} model the model instance
			 * @param {string} name the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel: function (model, name) {
				return this.getView().setModel(model, name);
			},

			/**
			 * Getter for the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle: function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},
			/* Apply app settings to iFrame
			 * @public
			 */
			applyAppSettings: function () {
				var frameWrapperEl = this.byId("iframeWrapper");
				var frame = frameWrapperEl?.$().find("iframe")[0];
				var that = this;
				if (frame && frame.contentWindow && frame.contentWindow.sap) {
					var jsonModel = this.getView().getModel("appSettings");
					if (jsonModel) {
						jsonModel.applyValues();
						frame.contentWindow.sap.ui.require(["sap/ui/core/Theming"], function (Theming) {
							Theming.setTheme(jsonModel.getTheme());
						});
						frame.contentWindow.sap.ui.require(["sap/base/i18n/Localization"], function (Localization) {
							Localization.setRTL(jsonModel.getRTL());
						});
					}
				}
			},
			onFileEditorFileChangeDebounced: function () {
				if (exploreSettingsModel.getProperty("/autoRun")) {
					this._updateSample();
				}
			},

			onSubSampleChange: function (event) {
				var item = event.getParameter("selectedItem");

				this.getRouter().navTo("exploreSamples", {
					sample: this.model.getProperty("/sample").key,
					subSample: item.getKey()
				});
			},

			/**
			 * Downloads all files that the example consists of.
			 */
			onDownloadZip: async function () {
				const sampleInfo = {};
				sampleInfo.version = await FileUtils._getVersionInfo(exploreSettingsModel.getProperty("/fallBackUI5Version"));
				sampleInfo.samplePath = this._currSample.downloadRootUrl;
				const filesWithContent = await Promise.all([this._fileEditor.getFilesWithContent(undefined)]),
					target = await FileUtils.downloadFilesCompressed(
						filesWithContent[0],
						this._getArchiveName(this._currSample.topicTitle),
						"files.zip",
						sampleInfo
					);
			},

			onDownloadProjectZip: function () {
				this._onDownloadProjectCompressed("project.zip");
			},

			_getArchiveName: function (topicTitle) {
				const specialCharRegex = new RegExp("[^A-Za-z0-9]");
				return topicTitle.replaceAll(topicTitle.match(specialCharRegex), "");
			},

			_onDownloadProjectCompressed: async function (fileExtension) {
				try {
					if (!this._currSample.downloadRootUrl || !this._sampleIndexModel.getData().children) {
						throw new Error("Project download failed");
					}
					var specialCharRegex = new RegExp("[^A-Za-z0-9]"),
						archiveName = this._getArchiveName(this._currSample.topicTitle),
						parentFolderName = "webapp",
						files = [],
						sampleIndex = deepClone(this._sampleIndexModel.getProperty("/"), 40),
						drilldown = this._currSample.downloadRootUrl.split("/").filter((el) => el != "");
					//skip root topic node
					drilldown.shift();
					//drill down to sample root folder
					drilldown.forEach((current) => {
						sampleIndex = sampleIndex.children.find((el) => el.name == current);
					});

					//get all sample files from all folders recursively
					files = FileUtils._getFilesFromIndex(sampleIndex, files, parentFolderName, archiveName, 1);
					//filter out original component.js
					files = files.filter((file) => file.key != "Component.js");
					if (files.length === 0) {
						throw new Error("Project download failed, incorrect download root Url");
					}
					//get common project files
					var commonFiles = deepClone(exploreSettingsModel.getProperty("/commonFiles"));
					commonFiles.forEach((file) => {
						//set actual root folder name for common download files
						if (file.folder === "root") {
							file.folder = archiveName;
						}
						if (file.parentFolder === "root") {
							file.parentFolder = archiveName;
						}
					});
					//check for existance of i18n file
					if (files.find(({ key }) => key.includes("i18n"))) {
						commonFiles = commonFiles.filter((file) => !file.key.includes("i18n"));
					}
					commonFiles = commonFiles.concat(files);
					var fetchFilesPromise = await this._fileEditor._fetchContents(commonFiles);
					//files content for all files
					Promise.all([this._fileEditor.getFilesWithContent(fetchFilesPromise)])
						.then(
							async function (filesWithContent) {
								const serviceFile = filesWithContent[0].find(({ key }) => key.includes("cds"));
								if (!serviceFile) {
									throw new Error("Project download failed, no service definition file found");
								}
								const serviceFolder = { folder: serviceFile.folder, file: serviceFile.key };
								var templateFiles = JSON.parse(JSON.stringify(exploreSettingsModel.getProperty("/templateFiles")));
								fetchFilesPromise = await this._fileEditor._fetchContents(templateFiles);
								Promise.all([this._fileEditor.getFilesWithContent(fetchFilesPromise)]).then(
									function (templateFiles) {
										//replace placeholders in common files
										FileUtils._processCommonFiles(
											filesWithContent[0],
											templateFiles[0],
											this._currSample,
											serviceFolder,
											exploreSettingsModel.getProperty("/fallBackUI5Version")
										).then((downloadFiles) => {
											FileUtils.downloadProjectCompressed(downloadFiles, archiveName, fileExtension);
										});
									}.bind(this)
								);
							}.bind(this)
						)
						.catch((error) => {
							Log.error(error);
							MessageToast.show("Project download failed");
						});
				} catch (error) {
					Log.error(error);
					MessageToast.show("Project download failed");
					return;
				}
			},

			_onTopicMatched: async function (event) {
				var oArgs = event.getParameter("arguments"),
					sTopic = oArgs.topic,
					sSubTopic = oArgs.subTopic || "",
					sId = oArgs.id,
					sNavigationItemKey = sTopic;

				// Note: oArgs.id shouldn't equal any subTopic, else it won't work.
				if (sSubTopic && (await this._isSubTopic(sSubTopic))) {
					sNavigationItemKey = sSubTopic;
					sSubTopic = "/" + sSubTopic;
				} else if (oArgs.key) {
					sId = oArgs.sSubTopic; // right shift subTopic to id
				}

				this.getOwnerComponent().getEventBus().publish("navEntryChanged", {
					navigationItemKey: sNavigationItemKey,
					routeName: "overview"
				});

				var oNavEntry = await this._findNavEntry(sTopic),
					sTopicURL = sap.ui.require.toUrl(this.getTopicUrl() + sTopic + sSubTopic + ".html");

				var jsonObj = {
					pageTitle: oNavEntry.title,
					topicURL: sTopicURL,
					bIsPhone: Device.system.phone
				};

				this.model.setData(jsonObj);
			},

			_findNavEntry: async function (key) {
				var navEntries = (await this.getNavigationModel()).getProperty("/navigation"),
					navEntry,
					subItems,
					i,
					j;

				for (i = 0; i < navEntries.length; i++) {
					navEntry = navEntries[i];

					if (navEntry.key === key) {
						return navEntry;
					}

					subItems = navEntry.items;

					if (subItems) {
						for (j = 0; j < subItems.length; j++) {
							if (subItems[j].key === key) {
								return subItems[j];
							}
						}
					}
				}
			},

			/**
			 * Checks if the given key is subtopic key
			 * "/learn/{topic}/:subTopic:/:id:",
			 */
			_isSubTopic: async function (sKey) {
				var aNavEntries = (await this.getNavigationModel()).getProperty("/navigation");

				return aNavEntries.some(function (oNavEntry) {
					return (
						oNavEntry.items &&
						oNavEntry.items.some(function (oSubEntry) {
							return oSubEntry.key === sKey;
						})
					);
				});
			},

			_onRouteMatched: async function (event) {
				var oArgs = event.getParameter("arguments"),
					sSampleKey = oArgs.subSample || oArgs.sample,
					oSample = await this._findSample(sSampleKey),
					oSubSample;
				var oSubSampleOrSample = oSubSample || oSample;

				this.getOwnerComponent()
					.getEventBus()
					.publish("navEntryChanged", {
						navigationItemKey: sSampleKey,
						routeName: event.getParameter("name")
					});

				if (!oSubSampleOrSample || oSubSampleOrSample.hasContent === false) {
					sessionStorage.removeItem("sampleUpload");
					return;
				}
				// reset the model
				this.model.setData({});

				if (oSubSampleOrSample.isApplication) {
					exploreSettingsModel.setProperty("/editorType", "text");
				}

				exploreSettingsModel.setProperty("/isApplication", !!oSubSampleOrSample.isApplication);
				this.byId("splitView").setBusy(true);
				this._showSample(oSample, oSubSample);
			},

			/**
			 * Refreshes the sample component and its associated app component.
			 * @param {object} component The template component to refresh.
			 * @param {object} appComponent The associated app component.
			 */
			_refreshSample: function (component, appComponent, shouldKeepMock) {
				appComponent.refresh(shouldKeepMock).then(function () {
					if (component) {
						component
							.getTemplatedViewService()
							.refreshView(component)
							.then(function () {
								//get current hash
								var hashChanger = appComponent.getRouter().getHashChanger();
								var currentHash = hashChanger.getHash();
								//remove timestamp from previous refresh
								var newHash = currentHash.split("?")[0] + "?ts=" + new Date().getTime();
								//discard draft state from old hash
								newHash = newHash.replaceAll("IsActiveEntity=false", "IsActiveEntity=true");
								hashChanger.replaceHash(newHash);
							});
					}
				});
			},

			/**
			 * Reflects changes in the code editor to the sample.
			 */
			_updateSample: function () {
				var frameWrapperEl = this.byId("iframeWrapper");
				var frame = frameWrapperEl.$().find("iframe")[0];
				var that = this;
				if (frame.contentWindow && frame.contentWindow.sap) {
					var allApps = frame.contentWindow.sap.ui.core.Component.registry.all();
					var component;
					var appComponent;
					Object.keys(allApps).forEach((sAppName) => {
						if (allApps[sAppName].getMetadata().isA("sap.fe.core.TemplateComponent")) {
							component = allApps[sAppName];
						}
						if (allApps[sAppName].getMetadata().isA("sap.fe.core.AppComponent")) {
							appComponent = allApps[sAppName];
						}
					});
					var allModules = frame.contentWindow.sap.ui.loader._.getAllModules();
					var toRemove = Object.keys(allModules).filter((sName) => sName.startsWith("sap/fe/core/fpmExplorer/"));
					toRemove.forEach((moduleName) => {
						frame.contentWindow.sap.ui.loader._.unloadResources(moduleName, false, true, true);
					});

					try {
						delete frame.contentWindow.sap.fe.core.fpmExplorer;
					} catch (e) {
						/* */
					}
					if (appComponent) {
						var shouldKeepMockOnReload = this._currSample.shouldKeepMockOnReload;
						var sManifestPath;
						var hasManifest = this._currSample.files.find(function (oFile) {
							if (oFile.name.includes("manifest.json")) {
								var delimiter = "/",
									start = 3,
									tokens = oFile.url.split(delimiter).slice(start);
								sManifestPath = "./" + tokens.join(delimiter);
							}
							return oFile.name.indexOf("manifest.json") !== -1;
						});
						if (hasManifest) {
							var appId = appComponent.getManifest()["sap.app"].id;
							delete appComponent._oManifest;
							frame.contentWindow.sap.ui.core.Manifest.load({
								async: true,
								componentName: appId,
								failOnError: false,
								manifestUrl: sManifestPath
							}).then(function (oManifest) {
								var oManifestJson = oManifest.getJson();
								appComponent.getManifest = function () {
									return oManifestJson;
								};
								Object.keys(oManifestJson["sap.ui5"].routing.targets).forEach((sTargetName) => {
									var oConfig = oManifestJson["sap.ui5"].routing.targets[sTargetName];
									if (
										oConfig.options &&
										oConfig.options.settings &&
										oConfig.options.settings.content &&
										appComponent.createId(oConfig.id) === component.getId()
									) {
										component.setContent(oConfig.options.settings.content);
									}
								});
								that._refreshSample(component, appComponent, shouldKeepMockOnReload);
							});
						} else {
							that._refreshSample(component, appComponent, shouldKeepMockOnReload);
						}
					}
				}
			},

			_deregisterResize: function () {
				Device.media.detachHandler(this._onResize, this);
			},

			_registerResize: function () {
				Device.media.attachHandler(this._onResize, this);
				this._onResize();
			},

			_onResize: function () {
				var isOrientationVertical = exploreSettingsModel.getProperty("/splitViewVertically"),
					sRangeName = Device.media.getCurrentRange("StdExt").name;

				if (sRangeName == "Tablet" || (sRangeName == "Phone" && !isOrientationVertical)) {
					if (this.getView().byId("splitView")) {
						exploreSettingsModel.setProperty("/splitViewVertically", true);
						this.getView().byId("splitView").getRootPaneContainer().setOrientation("Vertical");
					}
				}
			},
			_ApplyAppSettingsHandler: function (event) {
				if (event.data === "applyAppSettings") {
					this.applyAppSettings();
				}
			}
		});
	}
);
