/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2019 SAP AG. All rights reserved
 */
sap.ui.define([
	'sap/apf/ui/utils/constants',
	'sap/apf/core/constants',
	'sap/apf/utils/exportToGlobal',
	'sap/apf/utils/trace',
	'sap/ui/base/Object',
	'sap/ui/core/mvc/View',
	'sap/ui/core/mvc/ViewType',
	'sap/ui/dom/includeStylesheet',
	'sap/ui/thirdparty/jquery'
	], function(uiUtilsConstants, coreConstants, exportToGlobal, trace, BaseObject, View, ViewType, includeStylesheet, jQuery) {
	'use strict';

	function setHeightForFilterAndFooter(oContext, oFilter, oStyleClassNames) {
		const isSmartfilterBar = BaseObject.isObjectA(oFilter, "sap.ui.comp.smartfilterbar.SmartFilterBar");
		var oLayoutView = oContext.getLayoutView();
		var subHeaderInstance = oLayoutView.byId("subHeader");
		var filterSplitterLayout = oLayoutView.byId("idSplitterLayoutData");
		subHeaderInstance.addContent(oFilter);
		if (!isSmartfilterBar) {
			filterSplitterLayout.setSize("65px");
		}
		oFilter.addEventDelegate({
			onAfterRendering : function() {
				subHeaderInstance.setBusy(false);
				if (isSmartfilterBar) {
					subHeaderInstance.setHeight("");
					subHeaderInstance.addStyleClass(oStyleClassNames);
				}
			}
		});
	}

	function removeBusyIndicatorFromSubHeader(oContext) {
		oContext.getLayoutView().byId("subHeader").setBusy(false);
	}

	/**
	 * Creates a new UI Component Instance.
	 * @class UI Component Instance
	 * @alias sap.apf.ui.Instance
	 * @param {object} oInject - Core Instance
	 * @private
	 * @ui5-restricted sap.apf
	 */
	function Instance(oInject) {
		oInject.uiApi = this;
		var oCoreApi = oInject.oCoreApi;
		var oStartFilterHandler = oInject.oStartFilterHandler;

		/**
		 * Map of promises for loading the after following instances
		 */
		const promises = {};

		// instances start
		var analysisPath;
		var stepContainer;
		var toolbar;
		var carousel;
		var stepGallery;
		var pathGallery;
		var deleteAnalysisPath;
		var applicationLayout;
		// instances end

		var oFacetFilterView, oSmartFilterBarView;
		var apfLocation = oCoreApi.getUriGenerator().getApfLocation();
		this.oEventCallbacks = {};

		includeStylesheet(apfLocation + "resources/css/apfUi.css", "apfCss");
		includeStylesheet(apfLocation + "resources/css/apfPrint.css", "printCss");
		jQuery("#printCss").attr("media", "print"); // @comment : Doesn't Support adding attribute

		/**
		 * Get add analysis step button.
		 *
		 * @returns {sap.m.Button} Button
		 * @private
		 * @ui5-restricted sap.apf.ui.reuse.controller.smartFilterBar
		 */
		this.getAddAnalysisStepButton = function(){
			return this.getAnalysisPath().getCarouselView().getAddStepButton();
		};

		/**
		 * Loads the analysis path view asynchronously.
		 *
		 * @returns {Promise<sap.apf.ui.reuse.view.analysisPath>}
		 * @private
		 */
		this._loadAnalysisPath = function() {
			if (promises.analysisPath === undefined) {
				promises.analysisPath = View.create({
					viewName : "module:sap/apf/ui/reuse/view/analysisPath.view",
					viewData : oInject
				}).then((oView) => analysisPath = oView);
			}
			return promises.analysisPath;
		};

		/**
		 * Retrieves the already loaded analysis path view.
		 *
		 * Must only be called after the ànalysis path view has been loaded, typically
		 * by calling `createApplicationLayout` and waiting for it to finish.
		 *
		 * @returns {sap.apf.ui.reuse.view.analysisPath}
		 * @throws {Error} If `_loadAnalysisPath` has not been executed yet.
		 * @private
		 * @ui5-restricted sap.apf
		 */
		this.getAnalysisPath = function() {
			if (analysisPath === undefined) {
				throw new Error("premature access to analysisPath view");
			}
			return analysisPath;
		};

		/**
		 * Loads the notification bar view asynchronusly.
		 *
		 * Note: there's no getter for the notification bar view. It can only be retriebed
		 *       via the promise returned by this method.
		 *
		 * @returns {Promise<sap.apf.ui.reuse.view.messageHandler>}
		 * @private
		 * @ui5-restricted sap.apf
		 */
		this.loadNotificationBar = function() {
			if (promises.messageHandler === undefined) {
				promises.messageHandler = View.create({
					viewName : "module:sap/apf/ui/reuse/view/messageHandler.view",
					viewData : oInject
				});
			}
			return promises.messageHandler;
		};

		/**
		 * Loads the step container view (which holds representations) asynchronulsy.
		 *
		 * @returns {Promise<sap.apf.ui.reuse.view.stepContainer>}
		 * @private
		 */
		this._loadStepContainer = function() {
			if (promises.stepContainer === undefined) {
				promises.stepContainer = View.create({
					viewName : "module:sap/apf/ui/reuse/view/stepContainer.view",
					viewData : oInject
				}).then((oView) => stepContainer = oView);
			}
			return promises.stepContainer;
		};

		/**
		 * Retrieves the already loaded step container view to hold representations.
		 *
		 * Must only be called after the step container view has been loaded, typically
		 * by calling `createApplicationLayout` and waiting for it to finish.
		 *
		 * @returns {sap.apf.ui.reuse.view.stepContainer}
		 * @throws {Error} If `_loadStepContainer` has not been executed yet.
		 * @private
		 * @ui5-restricted sap.apf
		 */
		this.getStepContainer = function() {
			if (stepContainer === undefined) {
				throw new Error("premature access to stepContainer view");
			}
			return stepContainer;
		};

		/**
		 * Loads the toolbar view asynchronusly.
		 *
		 * @returns {Promise<sap.apf.ui.reuse.view.toolbar>}
		 * @private
		 */
		this._loadToolbar = function() {
			if (promises.toolbar === undefined) {
				promises.toolbar = View.create({
					viewName : "module:sap/apf/ui/reuse/view/toolbar.view",
					viewData : oInject
				}).then((oView) => toolbar = oView);
			}
			return promises.toolbar;
		};

		/**
		 * Retrieves the already loaded toolbar view.
		 *
		 * Must only be called after the toolbar view has been loaded, typically
		 * by calling `createApplicationLayout` and waiting for it to finish.
		 *
		 * @returns {sap.apf.ui.reuse.view.toolbar}
		 * @throws {Error} If `_loadToolbar` has not been executed yet.
		 * @private
		 * @ui5-restricted sap.apf
		 */
		this.getToolbar = function() {
			if (toolbar === undefined) {
				throw new Error("premature access to toolbar view");
			}
			return toolbar;
		};

		/**
		 * Loads the carousel view asynchronously.
		 *
		 * @returns {Promise<sap.apf.ui.reuse.view.carousel>}
		 * @private
		 */
		this._loadCarouselSingleton = function() {
			if (oInject && oInject.functions && oInject.functions.createCarouselSingleton){
				carousel = oInject.functions.createCarouselSingleton();
				promises.carousel = Promise.resolve(carousel);
			}
			if (promises.carousel === undefined) {
				promises.carousel = View.create({
					viewName  :"module:sap/apf/ui/reuse/view/carousel.view",
					viewData : {
						oInject : oInject
					}
				}).then((oView) => carousel = oView);
			}
			return promises.carousel;
		};

		/**
		 * Retrieves the already loaded carousel view.
		 *
		 * Must only be called after the carousel view has been loaded, typically
		 * by calling `createApplicationLayout` and waiting for it to finish.
		 *
		 * @returns {sap.apf.ui.reuse.view.carousel}
		 * @throws {Error} If `_loadCarouselSingleton` has not been executed yet.
		 * @private
		 * @ui5-restricted sap.apf
		 */
		this.createCarouselSingleton = function() {
			if (carousel === undefined) {
				throw new Error("premature access to carousel view");
			}
			return carousel;
		};

		/**
		 * Loads the step gallery view asynchronously.
		 *
		 * @returns {Promise<sap.apf.ui.reuse.view.stepGallery>}
		 * @private
		 */
		this._loadStepGallery = function() {
			if ( promises.stepGallery == null ) {
				promises.stepGallery = View.create({
					viewName : "module:sap/apf/ui/reuse/view/stepGallery.view",
					viewData : oInject
				}).then((oView) => stepGallery = oView);
			}
			return promises.stepGallery;
		}

		/**
		 * Retrieves the already loaded step gallery view.
		 *
		 * Must only be called after the step gallery view has been loaded, typically
		 * by calling `createApplicationLayout` and waiting for it to finish.
		 *
		 * @returns {sap.apf.ui.reuse.view.stepGallery}
		 * @throws {Error} If `_loadStepGallery` has not been executed yet.
		 * @private
		 * @ui5-restricted sap.apf
		 */
		this.getStepGallery = function() {
			if (stepGallery === undefined) {
				throw new Error("premature access to stepGallery view");
			}
			return stepGallery;
		};

		/**
		 * Loads the path gallery view asynchronously.
		 *
		 * @returns {Promise<sap.apf.ui.reuse.view.pathGallery>}
		 * @private
		 */
		this._loadPathGallery = function() {
			if (promises.pathGallery === undefined) {
				promises.pathGallery = View.create({
					viewName : "module:sap/apf/ui/reuse/view/pathGallery.view",
					viewData : {
						oInject : oInject
					}
				}).then((oView) => pathGallery = oView);
			}
			return promises.pathGallery;
		};

		/**
		 * Retrieves the already loaded path gallery view.
		 *
		 * Must only be called after the path gallery view has been loaded, typically
		 * by calling `createApplicationLayout` and waiting for it to finish.
		 *
		 * @returns {sap.apf.ui.reuse.view.pathGallery}
		 * @throws {Error} If `_loadStepGallery` has not been executed yet.
		 * @private
		 * @ui5-restricted sap.apf
		 */
		this.getPathGallery = function() {
			if (pathGallery === undefined) {
				throw new Error("premature access to pathGallery view");
			}
			return pathGallery;
		};

		/**
		 * Loads the delete analysis path view asynchronously.
		 *
		 * @returns {Promise<sap.apf.ui.reuse.view.deleteAnalysisPath>}
		 * @private
		 */
		this._loadDeleteAnalysisPath = function() {
			if (promises.deleteAnalysisPath === undefined) {
				promises.deleteAnalysisPath = View.create({
					viewName : "module:sap/apf/ui/reuse/view/deleteAnalysisPath.view",
					viewData : {
						oInject : oInject
					}
				}).then((oView) => deleteAnalysisPath = oView);
			}
			return promises.deleteAnalysisPath;
		};

		/**
		 * Retrieves the already loaded delete analysis path view.
		 *
		 * Must only be called after the delete analysis path view has been loaded, typically
		 * by calling `createApplicationLayout` and waiting for it to finish.
		 *
		 * @returns {sap.apf.ui.reuse.view.deleteAnalysisPath}
		 * @throws {Error} If `_loadDeleteAnalysisPath` has not been executed yet.
		 * @private
		 * @ui5-restricted sap.apf
		 */
		this.getDeleteAnalysisPath = function() {
			if (deleteAnalysisPath === undefined) {
				throw new Error("premature access to deleteAnalysisPath view");
			}
			return deleteAnalysisPath;
		};

		/**
		 * Loads the main application layout view with the header and main view asynchronously.
		 *
		 * @returns {Promise<sap.apf.ui.reuse.view.layout>}
		 * @private
		 */
		this._loadLayoutView = function() {
			if (promises.applicationLayout === undefined) {
				promises.applicationLayout = View.create({
					viewName : "sap.apf.ui.reuse.view.layout",
					type : ViewType.XML,
					viewData : oInject
				}).then((oView) => applicationLayout = oView);
			}
			return promises.applicationLayout;
		};

		/**
		 * Retrieves the already loaded main application layout view.
		 *
		 * Must only be called after the main application layout view has been loaded, typically
		 * by calling `createApplicationLayout` and waiting for it to finish.
		 *
		 * @returns {sap.apf.ui.reuse.view.layout}
		 * @throws {Error} If `_loadLayoutView` has not been executed yet.
		 * @private
		 * @ui5-restricted sap.apf
		 */
		this.getLayoutView = function() {
			if (applicationLayout === undefined) {
				throw new Error("premature access to applicationLayout view");
			}
			return applicationLayout;
		};

		/**
		 *@memberOf sap.apf.Api#addMasterFooterContent
		 *@description Calls the updatePath with proper callback for UI.
		 * 				It also refreshes the steps either from the active step or
		 * 				all the steps depending on the boolean value passed.
		 *@param {boolean}
		 */
		this.selectionChanged = function(bRefreshAllSteps) {
			trace.logCall("ui/Instance.selectionChanged", ", bRefreshAllSteps: ", bRefreshAllSteps, "--------");
			var nActiveStepIndex;
			var that = this;

			function updateOpenInButtonAfterPathUpdate() {
				if (applicationLayout) {
					applicationLayout.getController().enableDisableOpenIn();
				}
			}

			nActiveStepIndex = oCoreApi.getSteps().indexOf(oCoreApi.getActiveStep());
			var indexOfRefresh = 0 ;
			nActiveStepIndex = oCoreApi.getSteps().indexOf(oCoreApi.getActiveStep());
			if (!bRefreshAllSteps) {
				indexOfRefresh = nActiveStepIndex + 1;
			}
			trace.logCall("...", ", nActiveStepIndex: ", nActiveStepIndex, ", indexOfRefresh", indexOfRefresh);
			that.getAnalysisPath().getController().refresh(indexOfRefresh);
			that.getAnalysisPath().getController().getView().getCarouselView().getController().setBusyFromIndex(indexOfRefresh);
			oCoreApi.updatePath(that.getAnalysisPath().getController().callBackForUpdatePath.bind(that.getAnalysisPath().getController()), function(){
			    updateOpenInButtonAfterPathUpdate();
			});
			trace.logReturn("ui/Instance.selectionChanged");
		};

		let pAppLayoutCreated;

		/**
		 * Loads the main application layout view and its child views asynchronously.
		 *
		 * @returns {Promise<sap.apf.Application>}
		 * @private
		 * @ui5-restricted sap.apf
		 */
		this.createApplicationLayout = function(app) {
			var self = this;
			// Ensure layout page is created only once
			if ( pAppLayoutCreated == null ) {
				//promise the application layout
				pAppLayoutCreated = new Promise(function(resolveApplication) {
					var pStepGallery = self._loadStepGallery();
					var pToolbar = self._loadToolbar();
					var pPathGallery = self._loadPathGallery();
					var pDeleteAnalysisPath = self._loadDeleteAnalysisPath();
					var pStepContainer = self._loadStepContainer();
					var pCarousel = pStepGallery.then(function() {
						return self._loadCarouselSingleton();
					});
					var pAnalysisPath = Promise.all([pToolbar, pCarousel, pPathGallery, pDeleteAnalysisPath]).then(function() {
						return self._loadAnalysisPath();
					});
					var pLayoutView = Promise.all([pStepContainer, pAnalysisPath]).then(function() {
						return self._loadLayoutView();
					});
					pLayoutView.then(function() {
						app.addPage(applicationLayout);
						//resolve the application layout
						resolveApplication(app);
					});
				});
			}
			return pAppLayoutCreated;
		};

		/**
		 * Adds content to detail footer.
		 *
		 * @param {sap.ui.core.Control} oControl Any valid UI5 control
		 */
		this.addDetailFooterContent = function(oControl) {
			this.getLayoutView().getController().addDetailFooterContentLeft(oControl);
		};

		/**
		 * Adds content to master footer.
		 *
		 * @param {sap.ui.core.Control} oControl Any valid UI5 control
		 */
		this.addMasterFooterContentRight = function(oControl) {
			this.getLayoutView().getController().addMasterFooterContentRight(oControl);
		};

		/**
		 * Registers callback for event callback.
		 *
		 * @param {string} sEventType
		 * @param {function} fnCallback
		 * @private
		 * @ui5-restricted sap.apf.Api
		 */
		this.setEventCallback = function(sEventType, fnCallback) {
			this.oEventCallbacks[sEventType] = fnCallback;
		};

		/**
		 * Get the registered callback for the given event.
		 *
		 * @param {string} sEventType
		 * @returns {function|undefined} the registered callback for event callback.
		 * @private
		 * @ui5-restricted sap.apf
		 */
		this.getEventCallback = function(sEventType) {
			return this.oEventCallbacks[sEventType];
		};

		/**
		 * Get custom format exit object from oInject.
		 * @private
		 * @ui5-restricted sap.apf
		 */
		this.getCustomFormatExit = function() {
			return oInject.exits;
		};

		/**
		 * Set function callback to  the exit object.
		 *
		 * @param {function} fnCallback that will be added to the exit object
		 * @private
		 * @ui5-restricted sap.apf.Api
		 */
		this.setCustomFormatExit = function(fnCallback) {
			var oCustomFormatExits = this.getCustomFormatExit();
			oCustomFormatExits.customFormat = fnCallback;
		};

		/**
		 * Draws smart filter bar on layout subHeader.
		 *
		 * @param {Object} smartFilterBarConfiguration - Configuration object of SmartFilterBar
		 * @private
		 */
		this.drawSmartFilterBar = function(smartFilterBarConfiguration) {
			var oSelf = this;

			function drawSmartFilterBarWithDefaultValues(sfbConfiguration) {
				return oCoreApi.getSmartFilterbarDefaultFilterValues().done(async function(oControlConfiguration) {
					oSmartFilterBarView = await View.create({
						viewName : "module:sap/apf/ui/reuse/view/smartFilterBar.view",
						viewData : {
							oCoreApi : oCoreApi,
							oUiApi : oSelf,
							oSmartFilterBarConfiguration : sfbConfiguration,
							controlConfiguration : oControlConfiguration,
							parent : oSelf.getLayoutView()
						}
					});
					setHeightForFilterAndFooter(oSelf, oSmartFilterBarView.byId("idAPFSmartFilterBar"), "smartFilterBarContainer");
				});
			}

			if (smartFilterBarConfiguration) {
				if (smartFilterBarConfiguration.entitySet) {
					return drawSmartFilterBarWithDefaultValues(smartFilterBarConfiguration);
				}
				return oCoreApi.getMetadata(smartFilterBarConfiguration.service).done(function(metadata){
					smartFilterBarConfiguration.entitySet = metadata.getEntitySetByEntityType(smartFilterBarConfiguration.entityType);
					delete smartFilterBarConfiguration.entityType;
					return drawSmartFilterBarWithDefaultValues(smartFilterBarConfiguration);
				});
			}
			removeBusyIndicatorFromSubHeader(oSelf);
		};

		/**
		 * Draws facet filter on layout subHeader.
		 *
		 * @param {array} aConfiguredfilters
		 * @private
		 */
		this.drawFacetFilter = async function(aConfiguredFilters) {
			if (aConfiguredFilters.length > 0) {
				if ( promises.facetFilterView == null ) {
					promises.facetFilterView = View.create({
						viewName : "module:sap/apf/ui/reuse/view/facetFilter.view",
						viewData : {
							oCoreApi : oCoreApi,
							oUiApi : this,
							aConfiguredFilters : aConfiguredFilters,
							oStartFilterHandler : oStartFilterHandler
						}
					});
				}
				oFacetFilterView = await promises.facetFilterView;
				setHeightForFilterAndFooter(this, oFacetFilterView.byId("idAPFFacetFilter"));
			} else {
				removeBusyIndicatorFromSubHeader(this);
			}
		};

		/**
		 * Will be called when the path context is changed/updated.
		 * Notifies application footers of context change.
		 *
		 * @param {boolean} bResetPath - True when new path is triggered.
		 */
		this.contextChanged = function(bResetPath) {
			var fnCallback = this.getEventCallback(coreConstants.eventTypes.contextChanged);
			if (typeof fnCallback === "function") {
				fnCallback();
			}
		};

		/**
		 * Currently used by printHelper to get formatted filter values.
		 *
		 * @returns {sap.m.FacetFilter} facet filter control from which selected values (formatted) are used for printing
		 * @private
		 * @ui5-restricted sap.apf.ui.utils.PrintModel
		 */
		this.getFacetFilterForPrint = function() {
			if (oFacetFilterView) {
				return oFacetFilterView.byId("idAPFFacetFilter");
			}
		};

		/**
		 * Currently used by printHelper to get formatted smart filter values.
		 *
		 * @returns {sap.ui.comp.smartfilterbar.SmartFilterBar} smart filter control from which selected values (formatted) are used for printing
		 * @private
		 * @ui5-restricted sap.apf.ui.utils.PrintModel
		 */
		this.getSmartFilterForPrint = function() {
			if (oSmartFilterBarView) {
				return oSmartFilterBarView.byId("idAPFSmartFilterBar");
			}
		};

		/**
		 * It is called during start of APF.
		 *
		 * Gets the configured visible facet filters and draws the facet filter.
		 * In case the first step is configured for the application it is created.
		 * In addition the callback for updating the path is also registered.
		 * @returns {jQuery.promise}
		 * @private
		 * @ui5-restricted sap.apf.Api
		 */
		this.handleStartup = function(deferredMode) {
			var that = this;
			var promiseStartup = jQuery.Deferred();
			oCoreApi.getSmartFilterBarConfigurationAsPromise().done(function(smartFilterBarConfiguration) {
				if (smartFilterBarConfiguration) {
					that.drawSmartFilterBar(smartFilterBarConfiguration);
				}
				deferredMode.done(function(mode) {
					var promiseStartFilters = oStartFilterHandler.getStartFilters();
					promiseStartFilters.done(function(aConfiguredFilters) { //visible filters are returned in the callback
						that.contextChanged();
						if (!smartFilterBarConfiguration) {
							that.drawFacetFilter(aConfiguredFilters);
						}
						if (mode.navigationMode === "backward") {
							that.getAnalysisPath().getController().isBackNavigation = true;
							oCoreApi.updatePath(that.getAnalysisPath().getController().callBackForUpdatePath.bind(that.getAnalysisPath().getController()));
							that.getLayoutView().getController().setPathTitle();
						}
						if (mode.navigationMode === "forward") {
							if (oCoreApi.getStartParameterFacade().getSteps()) {
								var stepId = oCoreApi.getStartParameterFacade().getSteps()[0].stepId;
								var repId = oCoreApi.getStartParameterFacade().getSteps()[0].representationId;
								var callback = that.getAnalysisPath().getController().callBackForUpdatePathAndSetLastStepAsActive.bind(that.getAnalysisPath().getController());
								oCoreApi.createFirstStep(stepId, repId, callback);
							}

							// if busy Indicator is opened during the forward navigation from App finder/SB apps, it is closed after data load.
							sap.ui.require("sap/ui/core/BusyIndicator")?.hide();
						}
						//Initialize Message Handler and set callback for message handling
						that.loadNotificationBar().then(function(oMessageHandlerView) {
							that.getLayoutView().byId("applicationPage").addContent(oMessageHandlerView);
							var fnCallbackMessageHandling = oMessageHandlerView.getController().showMessage;
							oCoreApi.setCallbackForMessageHandling(fnCallbackMessageHandling.bind(oMessageHandlerView.getController()));
							promiseStartup.resolve();
						});
					});
				});
			});
			return promiseStartup.promise();
		};

		/**
		 * Cleanup of instance level objects called on destroy of application
		 */
		this.destroy = function() {
			oFacetFilterView = undefined;
			oSmartFilterBarView = undefined;
			if (analysisPath) {
				// Dialogs from Tool Bar control
				var toolbarController = this.getAnalysisPath().getToolbar().getController();
				checkAndCloseDialog(toolbarController.saveDialog);
				checkAndCloseDialog(toolbarController.newOpenDialog);
				checkAndCloseDialog(toolbarController.newDialog);
				checkAndCloseDialog(toolbarController.confirmDialog);
				checkAndCloseDialog(toolbarController.errorMsgDialog);
				checkAndCloseDialog(toolbarController.noPathAddedDialog);
				//Selection Dialogs
				if (toolbarController.deleteAnalysisPath !== undefined) {
					checkAndCloseDialog(toolbarController.deleteAnalysisPath.getController().oDialog);
				}
				if (toolbarController.pathGallery !== undefined) {
					checkAndCloseDialog(toolbarController.pathGallery.getController().oDialog);
				}
				// Dialogs from Step Gallery control
				var stepGalleryController = this.getAnalysisPath().getCarouselView().getStepGallery().getController();
				checkAndCloseDialog(stepGalleryController.oHierchicalSelectDialog);
			}
			if (stepContainer) {
				// Dialogs from Step Container control
				var stepContainerController = this.getStepContainer().getController();
				checkAndCloseDialog(stepContainerController.selectionDisplayDialog);
				//Function call for View Settings Dialog
				viewDialogClose(this);
			}
		};

		function checkAndCloseDialog(dialog) {
			if (dialog !== undefined) {
				if (dialog.isA("sap.m.ViewSettingsDialog")) {
					dialog.destroy();
				} else if (dialog.isOpen()) {
					dialog.close();
				}
			}
		}
		function viewDialogClose(self) {
			var bIsActiveStep = false;
			var bIsSelectedRepresentatioin = false;
			var selectedRepresentation;
			if (self.getStepContainer().getViewData().oCoreApi.getActiveStep() !== undefined) {
				bIsActiveStep = true;
			}
			if (bIsActiveStep) {
				selectedRepresentation = self.getStepContainer().getViewData().oCoreApi.getActiveStep().getSelectedRepresentation();
				if (selectedRepresentation !== undefined) {
					bIsSelectedRepresentatioin = true;
				}
			}
			if (bIsSelectedRepresentatioin) {
				if (selectedRepresentation.type !== uiUtilsConstants.representationTypes.TABLE_REPRESENTATION) {
					if (selectedRepresentation.toggleInstance !== undefined) {
						checkAndCloseDialog(selectedRepresentation.toggleInstance.viewSettingsDialog);
					}
				} else {
					checkAndCloseDialog(selectedRepresentation.viewSettingsDialog);
				}
			}
		}
	}
	/*BEGIN_COMPATIBILITY*/
	exportToGlobal("sap.apf.ui.Instance", Instance);
	/*END_COMPATIBILITY*/

	return Instance;
}, true /*GLOBAL_EXPORT*/);