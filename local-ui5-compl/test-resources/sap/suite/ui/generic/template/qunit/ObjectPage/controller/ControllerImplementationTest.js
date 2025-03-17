/*
 * tests for the sap.suite.ui.generic.template.ObjectPage.controller.ControllerImplementation
 */

sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/m/library",
	"sap/m/MessageBox",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/genericUtilities/controlHelper",
	"sap/suite/ui/generic/template/ObjectPage/controller/ControllerImplementation",
	"sap/suite/ui/generic/template/lib/ShareUtils",
	"sap/uxap/ObjectPageSubSection",
	"sap/uxap/ObjectPageSection",
	"sap/base/util/extend",
	"sap/suite/ui/generic/template/genericUtilities/metadataAnalyser",
	"sap/suite/ui/generic/template/ObjectPage/controller/SectionTitleHandler"
], function(sinon, MobileLibrary, MessageBox, testableHelper, controlHelper, ControllerImplementation,
	ShareUtils, ObjectPageSubSection, ObjectPageSection, extend, metadataAnalyser, SectionTitleHandler) {
	"use strict";

	var bShowConfirmationOnDraftActivate = true;
	var bIsAppBusy = false;
	var oBusyHelper = {
		isBusy: function() {
			return bIsAppBusy;
		},
		setBusy: function() {}
	};

	var oConfig = {};
	var oSections = {};
	var navToListOnSave = false;
	var oTemplatePrivateModel = {
		getProperty: function() {
			return 3;
		},
		setProperty: function(sPath, oValue) {
		}
	};
	var oTemplatePrivateGlobalModel = {
		getProperty: function() {},

	};

	var oTemplatePrivateViewModel = {
		bindProperty: function() {
			return {
				getValue: function() {
					return "Sample Table";
				},
				attachChange: function() {}
			};
		},
	};

	var oCRUDActionHandler = { };

	var oTreeNode = {
		facetsWithEmbeddedComponents: {
			MalfunctionInformation: ["simple::Attachments"]
		},
		embeddedComponents: {
			"simple::Attachments": {
				componentId: "attachmentReuseComponent::simple::Attachments::ComponentContainerContent",
				sectionId: "MalfunctionInformation::Section",
				subSectionId: "attachmentReuseComponent::simple::Attachments::ComponentSubSection"
			}
		}
	};

	var oTemplateUtils = {
		oCommonUtils: {
			refreshSmartTable: Function.prototype,
			triggerPrepareOnEnterKeyPress: Function.prototype, // needed for setup
			executeGlobalSideEffect: Function.prototype, // needed for setup
			getDialogFragmentAsync: Function.prototype, // needed for setup
			getDialogFragment: sinon.stub().returns(Promise.reject({})), // needed for setup
			fnProcessDataLossOrDraftDiscardConfirmation: function(){},
			semanticObjectLinkNavigation: function(){},
			getText: function(){},
			getContextText: sinon.stub().returns(""),
			checkToolbarIntentsSupported: function(){},
			getElementCustomData: function(oSubSection){
				switch(oSubSection.getId()) {
					case "lazyloadingAfterHeaderSubsection":
						return  {
							loadingStrategy:"lazyLoadingAfterHeader"
						};
					case "activateAfterHeaderDataReceivedSubsection":
						return {
							loadingStrategy:"activateAfterHeaderDataReceived"
						};
					case "activateWithBindingChangeSubsection":
						return {
							loadingStrategy:"activateWithBindingChange"
						};
					default:
						return {
							loadingStrategy: "lazyLoading"
						}
				}
			},
			getControlStateWrapper: function(){
				return {
					attachStateChanged: Function.prototype,
					setState: Function.prototype
				};
			}
		},
		oServices: {
			oTemplateCapabilities: {},
			oDraftController: {},
			oCRUDManager: {
				saveEntity: function() {
					return {
						then: function(fnThen) {
							fnThen({});
						},
						catch: function(fnCatch){
							fnCatch({});
						}
					};
				}
			},
			oNavigationController: {},
			oViewDependencyHelper: {
				setParentToDirty: Function.prototype
			},
			oApplication: {
				getBusyHelper: function() {
					return oBusyHelper;
				},
				showMessageToast: Function.prototype,
				mustRequireRequestsCanonical: function(){
					return true;
				},
				getEditFlowOfRoot: Function.prototype,
				registerCustomMessageProvider: Function.prototype,
				setNextFocus: Function.prototype
			},
			oApplicationController: {
				executeSideEffects: Function.prototype
			},
			oPresentationControlHandlerFactory: {
				getPresentationControlHandler: function() {
					return {
						getSelectedContexts: function() {
							return [];
						},
						addCellSelector: Function.prototype
					}
				}
			}
		},
		oComponentUtils: {
			getParameterModelForTemplating: function(){
				return {
					getObject: function(sObjectId){
						if (sObjectId === "/treeNode") {
							return oTreeNode;
						}
						return [];
					}
				};
			},
			getFclProxy: function() {
				return {};
			},
			getTemplatePrivateModel: function() {
				return oTemplatePrivateModel;
			},
			isODataBased: function() {
				return true;
			},
			isDraftEnabled: function(){},
			isNonDraftCreate: function() {
				return false;
			},
			getViewLevel: function() {
				return 1;
			},
			getHeaderDataAvailablePromise: function(){},
			getNavigationFinishedPromise: function(){},
			attach: function(){},
			getCRUDActionHandler: function(){ return oCRUDActionHandler; },
			registerAncestorTitleUpdater: function(){
				return Function.prototype;
			},
			getViewRenderedPromise: function(){
				return Promise.resolve();
			},
			isRenderingWaitingForViewportEntered: function() {
				return false;
			},
			getTemplatePrivateGlobalModel: function() {
				return {
					setProperty: Function.prototype,
					getProperty: Function.prototype
				}
			}
		},
		oCommonEventHandlers: {
			onBeforeRebindTable : Function.prototype,
			getSelectedItemContextForDeleteMessage: function() {
				return;
			}
		},
		oInfoObjectHandler: {
			getControlInformation: Function.prototype,
            initializeSubSectionInfoObject: Function.prototype,
            initializeSmartTableInfoObject: Function.prototype,
            initializeSmartChartInfoObject: Function.prototype,
            initializeLinkInfoObject: Function.prototype,
            initializeSideContentInfoObject: Function.prototype,
            setInformationWithControl: Function.prototype,
            executeForAllInformationObjects: Function.prototype
		}
	};
	var oUIModel = {
		setProperty: function(){},
		bindProperty: function(){
			return {
				attachChange: function(){}
			};
		},
		getProperty: function(){}
	};
	var oView = {
		getModel: function(sName) {
			if (sName !== "ui") {
				var oGetObj = {
					getObject: function() {
						var oEntity = {
							IsActiveEntity: function(){}
						};
						return oEntity;
					}
				};
				return oGetObj;
			}
			return oUIModel;
		},
		getBindingContext: function() {
			return {
				getObject: function() {
						return {IsActiveEntity: true};
				}
			}
		},
		getId: function(){return "ViewId";}
	};

	var oMetaModel = {
		getODataEntitySet: function() {
			return {
				"entityType": "EntityType"
			};
		},
		getODataEntityType: function() {
			return {
				"com.sap.vocabularies.UI.v1.HeaderInfo": {
					"TypeName": {
						"String": "TypeName"
					}
				}
			};
		}
	};
	var oUnnamedModel = {
		getMetaModel: function() {
			return oMetaModel;
		}
	};
	var oShellService = {
		setTitle: function() {

		},
		setBackNavigation: function() {

		}
	};

	var oLink1 = {};

	var oComponent = {
		getShowHeaderAsCarouselOnDesktop: function () {
			return false;
		},
		mProperties: {
			condensedTableLayout: false
		},
		getModel: function(sName){
			if (sName === "_templPriv") {
				return oTemplatePrivateModel;
			} else if (sName === "ui"){
				return oUIModel;
			} else if (sName === "_templPrivGlobal") {
				return oTemplatePrivateGlobalModel;
			} else if (sName === "_templPrivView") {
				return oTemplatePrivateViewModel;
			} else if (!sName) {
				return oUnnamedModel;
			} else {
				throw new Error("Only ui model, _templPriv model or unnamed must be retrieved from this component");
			}
		},
		getEntitySet: function() {
			return "STTA_C_MP_Product";
		},
		getId: function(){},
		getService: function(sServiceName) {
			if (sServiceName === "ShellUIService") {
				return {
					then: function(oFunction) {
						return oFunction(oShellService);
					}
				};
			} else {
				throw new Error("Only ShellUIService service must be called from this component");
			}
		},
		getAppComponent: function() {
			return {
				getConfig: function() {
					return oConfig;
				},
				getObjectPageHeaderType: function(){
					return "Static";
				},
				getModel: function(sName){
					if (sName === "_templPrivGlobal"){
						return {
							setProperty: Function.prototype,
						};
					}
				},
				getManifestEntry: function(){
					return {
						title:"FancyTitle"
					}
				},
				getMergeObjectPageSectionTitle: function () {
					return true;
				}
			};
		},
		getSections: function() {
			return oSections;
		},
		getShowConfirmationOnDraftActivate: function() {
			return bShowConfirmationOnDraftActivate;
		},
		getNavToListOnSave: function() {
			return navToListOnSave;
		}
	};

	var oBreadCrumb = new sap.m.Breadcrumbs();
	oLink1 = new sap.m.Link({
		target: "target",
		href: "http://abc.de"
	});

	oBreadCrumb.insertLink(oLink1);

	var onSubSectionEnteredViewPort;
	var onSubSectionVisibilityChange;
	var aSubSectionsFirst = [{
		getId: function() {
			return "firstSectionIdFirstSubSection";
		},
		getVisible: function() {
			return true;
		},
		getBlocks: function (){return [];},
		getMoreBlocks: function (){return [];},
		getActions: function (){return [];},
		getParent:function(){return [];}
	}];
	var aSubSectionsSecond = [{
		getId: function() {
			return "secondSectionIdFIrstSubSection";
		},
		getVisible: function() {
			return true;
		},
		getBlocks: function (){return [];},
		getMoreBlocks: function (){return [];},
		getActions: function (){return [];},
		getParent:function(){return [];}
	}, {
		getId: function() {
			return "secondSectionIdSecondSubSection";
		},
		getVisible: function() {
			return true;
		},
		getBlocks: function (){return [];},
		getMoreBlocks: function (){return [];},
		getActions: function (){return [];},
		getParent:function(){return [];}
	}, {
		getId: function() {
			return "secondSectionIdSecondSubSection1";
		},
		getVisible: function() {
			return true;
		},
		getBlocks: function (){return [];},
		getMoreBlocks: function (){return [];},
		getActions: function (){return [];},
		getParent:function(){return [];}
	}, {
		getId: function() {
			return "secondSectionIdThirdSubSection";
		},
		getVisible: function() {
			return true;
		},
		getBlocks: function (){return [];},
		getMoreBlocks: function (){return [];},
		getActions: function (){return [];},
		getParent:function(){return [];}
	}];
	var aSubSectionsThird = [{
		getId: function() {
			return "lazyloadingAfterHeaderSubsection";
		},
		getVisible: function() {
			return true;
		},
		getBlocks: function (){return [];},
		getMoreBlocks: function (){return []},
		getActions: function (){return [];},
		getParent:function(){return [];}
	}, {
		getId: function() {
			return "activateAfterHeaderDataReceivedSubsection";
		},
		getVisible: function() {
			return true;
		},
		getBlocks: function (){return [];},
		getMoreBlocks: function (){return [];},
		getActions: function (){return [];},
		getParent:function(){return [];}
	}, {
		getId: function() {
			return "activateWithBindingChangeSubsection";
		},
		getVisible: function() {
			return true;
		},
		getBlocks: function (){return [];},
		getMoreBlocks: function (){return [];},
		getActions: function (){return [];},
		getParent:function(){return [];}
	}];
	var aObjectPageSections = [{
		getId: function() {
			return "firstSectionId";
		},
		getSubSections: function(){
			return aSubSectionsFirst;
		},
		getVisible: function() {
			return true;
		}
	}, {
		getId: function() {
			return "secondSectionId";
		},
		getSubSections: function(){
			return aSubSectionsSecond;
		},
		getVisible: function() {
			return false;
		}
	}, {
		getId: function() {
			return "thirdSectionId";
		},
		getSubSections: function(){
			return aSubSectionsThird;
		},
		getVisible: function() {
			return false;
		}
	}];
	// Generically add function findElements to all section and subsection stubs
	aObjectPageSections.forEach(function(oSection){
		var aSubSections = oSection.getSubSections();
		aSubSections.forEach(function(oSubSection){
			oSubSection.findElements = function(){
				return oSubSection.getBlocks();
			};
		});
		oSection.findElements = function(){
			return aSubSections;
		};
	});
	var oObjectPage = {
		getId: function(){
			return "objectPage";
		},
		getHeaderTitle: function() {
			var oTitle = {
				getBreadcrumbs: function() {
						return {
							getLinks: function() {
								return oBreadCrumb.getLinks();
							}
						}
					},
					getActions: function() {
						return [];
					}
			};
			return oTitle;
		},
		getSections: function() {
			return aObjectPageSections;
		},
		getSelectedSection: function() {
			return null;
		},
		getCustomData: function() {
			return [];
		},
		getUseIconTabBar: function() {
			return false;
		},
		indexOfSection: function(){
			return 2;
		},
		attachEvent: function(sEventId, fnEventHandler) {
			var availableEvents = ["subSectionEnteredViewPort", "subSectionVisibilityChange"];
			if (availableEvents.indexOf(sEventId) === -1) {
				throw new Error("Event " + sEventId +  " cann't be used");
			}
			if (typeof fnEventHandler !== "function") {
				throw new Error("Event handler must be a function");
			}
			if (availableEvents.indexOf(sEventId) === 0) {
				onSubSectionEnteredViewPort = fnEventHandler;
				return;
			}
			onSubSectionVisibilityChange = fnEventHandler;
		},
		_triggerVisibleSubSectionsEvents: function () {

		},
		setSelectedSection: function (){},
		getModel: function(sName){
			if (sName === 'ui') {
				return oUIModel;
			}
		},
		attachHeaderContentPinnedStateChange: Function.prototype,
		setHeaderContentPinned: Function.prototype ,
		getShowHeaderContent: function() {
			return true;
		},
		getHeaderContent: function() {
			return false;
		},
		attachPress: Function.prototype
	};
	var oController = {
		beforeLineItemDeleteExtension: Function.prototype,
		onBeforeRebindTableExtension: Function.prototype,
		onSubSectionEnteredExtension: Function.prototype,
		templateBaseExtension: {
			ensureFieldsForSelect: {},
			addFilters: {},
			restoreExtensionStateData: function (){}
		},
		getView: function() {
			return oView;
		},
		getOwnerComponent: function() {
			return oComponent;
		},
		byId: function(sName) {
			if (sName === "objectPage") {
				return oObjectPage;
			}
		},
		applyCustomStateExtension: function (){}
	};
	var oMethods;
	var oStubForPrivate;
	var oViewProxy;
	var oSandbox;
	var oPendingChanges;
	var isModelDirty;
	var oContext1, oContext2;
	var fnIsSmartTableCallbackStub, fnIsObjectObjectPageLayoutCallbackStub;

	var  oMessageButtonHelper = {
		registerExternalListener : Function.prototype
	};

	function fnISetupCallbackStubs() {
		fnIsSmartTableCallbackStub = oSandbox.stub(controlHelper, "isSmartTable");
		fnIsSmartTableCallbackStub.onCall(0).returns(false);
		fnIsSmartTableCallbackStub.returns(true);

		fnIsObjectObjectPageLayoutCallbackStub  = oSandbox.stub(controlHelper, "isObjectObjectPageLayout");
		fnIsObjectObjectPageLayoutCallbackStub.onCall(0).returns(true);
		fnIsObjectObjectPageLayoutCallbackStub.returns(false);
	}
	function fnTearDownCallbackStubs() {
		fnIsSmartTableCallbackStub.restore();
		fnIsObjectObjectPageLayoutCallbackStub.restore();
	}
	function fnCommonSetup() {
		oStubForPrivate = testableHelper.startTest();
		oSandbox = oSandbox || sinon.sandbox.create();

		fnISetupCallbackStubs();

		oSandbox.stub(controlHelper, "isSmartChart", function(){
			return false;
		});

		oSandbox.stub(testableHelper.getStaticStub(), "MessageButtonHelper", function () {
			return oMessageButtonHelper;
		});
		oSandbox.stub(testableHelper.getStaticStub(), "PaginatorButtonsHelper");
		var oMyTemplateUtils = oTemplateUtils;
		oViewProxy = {
			oStatePreserver: {}
		};
		oMethods = ControllerImplementation.getMethods(oViewProxy, oMyTemplateUtils, oController);
		extend(oMyTemplateUtils, oTemplateUtils); // add content to the TemplateUtils, after getMethods has been called. This is the way, as it is done by the TemplateAssembler.
		oMethods.onInit();
		oViewProxy.navigateUp = function(){};
	}

	function fnCommonTeardown() {
		bIsAppBusy = false;
		fnTearDownCallbackStubs();
		oSandbox.restore();
		oSandbox = null;
		testableHelper.endTest();
	}

	QUnit.module("ObjectPage.controller.ControllerImplementation.edit", {
		beforeEach: fnCommonSetup,
		afterEach: fnCommonTeardown
	});

	function fnEditTest(assert, oEditInfo) {
		var bUnconditionalMock = true;
		var oEditEntityStub = sinon.stub(oTemplateUtils.oServices.oCRUDManager, "editEntity", function(bUnconditional) {
			bUnconditional = typeof bUnconditional === "boolean";
			assert.strictEqual(bUnconditional, bUnconditionalMock, "Parameter bUnconditional must be a boolean");
			return {
				then: function(fnResolved, fnRejected) {
					assert.ok(!fnRejected, "Do nothing, when editing is rejected");
					fnResolved(oEditInfo);
				}
			};
		});
		var oGetDraftInfoStub, oSetRootPageToDirtyStub, oSwitchToDraftStub;

		if (oEditInfo.context) {
			if (oEditInfo.context.hasDraft) {
				oSandbox.stub(oTemplateUtils.oServices.oApplication, "invalidatePaginatorInfo");
			}
			oGetDraftInfoStub = sinon.stub(oTemplateUtils.oServices.oDraftController, "getDraftContext", function() {
				return {
					hasDraft: function(oContext) {
						assert.strictEqual(oContext, oEditInfo.context, "context from editInfo must be passed to hasDraft");
						if (oContext.hasDraft) {
							oSetRootPageToDirtyStub = sinon.stub(oTemplateUtils.oServices.oViewDependencyHelper, "setRootPageToDirty");
							oSwitchToDraftStub = sinon.stub(oTemplateUtils.oServices.oApplication, "switchToDraft");
						}
						return oContext.hasDraft;
					}
				};
			});
		}
		oStubForPrivate.editEntity(bUnconditionalMock);
		oEditEntityStub.restore();
		if (oGetDraftInfoStub) {
			oGetDraftInfoStub.restore();
		}
		if (oSetRootPageToDirtyStub) {
			assert.ok(oSetRootPageToDirtyStub.calledOnce, "Root page must have been set dirty");
			oSetRootPageToDirtyStub.restore();
		}
		if (oSwitchToDraftStub) {
			assert.ok(oSwitchToDraftStub.calledOnce, "Navigation to draft must have been performed exactly once");
			assert.ok(oSwitchToDraftStub.calledWithExactly(oEditInfo.context, undefined),
				"Navigation must be performed with the right parameters");
			oSwitchToDraftStub.restore();
		}
	}

	QUnit.test("onEdit: no soft lock by other user, with draft", function(assert) {
		var oEditInfo = {
			context: {
				hasDraft: true
			}
		};
		fnEditTest(assert, oEditInfo);
	});

	QUnit.test("onEdit: non-draft scenario", function(assert) {
		var oSetPropertyStub = sinon.stub(oUIModel, "setProperty");
		var oEditInfo = {
			context: {
				hasDraft: false
			}
		};
		fnEditTest(assert, oEditInfo);
		assert.ok(oSetPropertyStub.calledOnce, "Exactly one property must have been set in the ui model");
		assert.ok(oSetPropertyStub.calledWithExactly("/editable", true), "setProperty must be called with the correct parameters");
		oSetPropertyStub.restore();
	});

	QUnit.test("onEdit: soft lock by other user", function(assert) {
		var oEditInfo = {
			draftAdministrativeData: {
				CreatedByUserDescription: "OTHER"
			}
		};
		var oQuestion = {};
		var oGetTextStub = sinon.stub(oTemplateUtils.oComponentUtils, "getMainComponentUtils", function() {
			return Promise.resolve({
				getText: function(sId, aPars) {
					assert.strictEqual(sId, "DRAFT_LOCK_EXPIRED", "Text with if 'DRAFT_LOCK_EXPIRED' must be retrieved");
					assert.deepEqual(aPars, ["OTHER"], "Name of OTHER user must be used in text");
					return oQuestion;
				},
				getRootExpand: function() {}
			});
		});
		var oDialogModel = {
			setProperty: Function.prototype
		};
		var oDialog = {
			getModel: function(sModelName) {
				assert.strictEqual(sModelName, "Dialog", "Only model with name 'Dialog' must be retrieved");
				return oDialogModel;
			}
		};
		var done = assert.async();
		var oSetPropertySpy = sinon.spy(oDialogModel, "setProperty");
		var oOpenSpy = sinon.spy(oDialog, "open");
		var oDialogController;
		var oGetDialogFragmentStub = sinon.stub(oTemplateUtils.oCommonUtils, "getDialogFragmentAsync", function(sName, oFragmentController, sModel) {

			assert.strictEqual(sName, "sap.suite.ui.generic.template.ObjectPage.view.fragments.UnsavedChangesDialog",
				"Load correct fragment for unsaved changes");
			assert.strictEqual(sModel, "Dialog", "Name of local model must be 'Dialog'");
			oDialogController = oFragmentController;
			return Promise.resolve(oDialog);
		});
		fnEditTest(assert, oEditInfo);
		setTimeout(function () {
			assert.ok(oSetPropertySpy.calledOnce, "Property for dialog model must have been set");
			assert.ok(oSetPropertySpy.calledWithExactly("/unsavedChangesQuestion", oQuestion),
				"Property for the dialog model must have been set correctly");
			assert.ok(oOpenSpy.calledOnce, "Dialog must have been opened");
			oGetDialogFragmentStub.restore();
			oGetTextStub.restore();
			oOpenSpy.restore();
			// Now test the dialog controller
			var oCloseSpy = sinon.spy(oDialog, "close");
			oDialogController.onCancel();
			assert.ok(oCloseSpy.calledOnce, "Dialog must have been closed by Cancel");
			var oEditStub = sinon.stub(oStubForPrivate, "editEntity");
			oDialogController.onEdit();
			assert.ok(oCloseSpy.calledTwice, "Dialog must also have been closed by Edit");
			assert.ok(oEditStub.calledOnce, "Editing must have been started after confirmation");
			assert.ok(oEditStub.calledWithExactly(true), "Editing must be unconditional");
			oEditStub.restore();
			done();
		});
	});

	QUnit.module("ObjectPage.controller.ControllerImplementation.onActivateImpl", {
		beforeEach: fnCommonSetup,
		afterEach: fnCommonTeardown
	});

	function getDraftActivateCreator(assert, oResponse){
		return function(){
			return {
				then: function(fnThen, fnCatch) {
					assert.strictEqual(fnCatch, Function.prototype, "Error case must not be handled on this level");
					fnThen(oResponse);
				},
				catch:function(fnCatch){
					fnCatch({});
				}
			};
		};
	}

	QUnit.test("Draft is saved and stay on object page", function(assert) {
		oSandbox.stub(oTemplateUtils.oServices.oApplication, "invalidatePaginatorInfo");
		bIsAppBusy = false;
		var oResponse = {
			context: {}
		};
		var oMessageToastSpy, oSetAllPagesDirtySpy, oUnbindChildrenSpy, oNavigateToContextSpy, ofireSpy;
		oMessageToastSpy = sinon.spy(oTemplateUtils.oServices.oApplication, "showMessageToast");
		oSetAllPagesDirtySpy = sinon.spy(oTemplateUtils.oServices.oViewDependencyHelper, "setAllPagesDirty");
		oUnbindChildrenSpy = sinon.spy(oTemplateUtils.oServices.oViewDependencyHelper, "unbindChildren");
		var oNavigateAfterActivationSpy = sinon.spy(oTemplateUtils.oServices.oApplication, "navigateAfterActivation");
		ofireSpy = sinon.spy(oTemplateUtils.oComponentUtils, "fire");
		var oActivateDraftEntityStub = sinon.stub(oTemplateUtils.oServices.oCRUDManager, "activateDraftEntity", getDraftActivateCreator(assert, oResponse));
		oStubForPrivate.onActivateImpl();
		assert.ok(oMessageToastSpy.calledOnce, "Message toast have been called");
		if (oResponse && oResponse.context) {
			assert.ok(oSetAllPagesDirtySpy.calledOnce, "setAllPagesDirty called");
			assert.ok(oUnbindChildrenSpy.calledOnce, "unbindChildren called");
			assert.ok(oNavigateAfterActivationSpy.calledOnce, "navigateAfterActivation called");
			assert.ok(oNavigateAfterActivationSpy.calledWithExactly(oResponse.context), "navigateAfterActivatio called correctly");
		}
		assert.ok(ofireSpy.calledOnce, "fire called");
		oMessageToastSpy.restore();
		oSetAllPagesDirtySpy.restore();
		oUnbindChildrenSpy.restore();
		oNavigateAfterActivationSpy.restore();
		ofireSpy.restore();
		oActivateDraftEntityStub.restore();
	});

	QUnit.test("Draft is saved and navigate to list report page", function(assert) {
		oSandbox.stub(oTemplateUtils.oServices.oApplication, "invalidatePaginatorInfo");
		bIsAppBusy = false;
		var oResponse = {
			context: true
		};
		navToListOnSave = true;
		var oMessageToastSpy, oSetAllPagesDirtySpy, oUnbindChildrenSpy, oNavigateToRootSpy, ofireSpy;
		oMessageToastSpy = sinon.spy(oTemplateUtils.oServices.oApplication, "showMessageToast");
		oSetAllPagesDirtySpy = sinon.spy(oTemplateUtils.oServices.oViewDependencyHelper, "setAllPagesDirty");
		oUnbindChildrenSpy = sinon.spy(oTemplateUtils.oServices.oViewDependencyHelper, "unbindChildren");
		var oNavigateAfterActivationSpy = sinon.spy(oTemplateUtils.oServices.oApplication, "navigateAfterActivation");
		ofireSpy = sinon.spy(oTemplateUtils.oComponentUtils, "fire");
		var oActivateDraftEntityStub = sinon.stub(oTemplateUtils.oServices.oCRUDManager, "activateDraftEntity", getDraftActivateCreator(assert, oResponse));
		oStubForPrivate.onActivateImpl();
		assert.ok(oMessageToastSpy.calledOnce, "Message toast have been called");
		if (oResponse && oResponse.context) {
			assert.ok(oSetAllPagesDirtySpy.calledOnce, "setAllPagesDirty called");
			assert.ok(oUnbindChildrenSpy.calledOnce, "unbindChildren called");
			assert.ok(oNavigateAfterActivationSpy.calledOnce, "navigateAfterActivation called");
			assert.ok(!oNavigateAfterActivationSpy.firstCall.args[0], "navigateAfterActivatio called correctly");
		}
		assert.ok(ofireSpy.calledOnce, "fire called");
		oMessageToastSpy.restore();
		oSetAllPagesDirtySpy.restore();
		oUnbindChildrenSpy.restore();
		oNavigateAfterActivationSpy.restore();
		ofireSpy.restore();
		oActivateDraftEntityStub.restore();
	});

	QUnit.module("ObjectPage.controller.ControllerImplementation.onSaveImpl", {
		beforeEach: function() {
			fnCommonSetup();
			oPendingChanges = {
			    "STTA_C_SO_SalesOrder_ND('500000002')": {
			        "__metadata": {
			            "id": "https://localhost:3081/sap/opu/odata/sap/STTA_SALES_ORDER_ND_SRV_01/STTA_C_SO_SalesOrder_ND('500000002')",
			            "uri": "https://localhost:3081/sap/opu/odata/sap/STTA_SALES_ORDER_ND_SRV_01/STTA_C_SO_SalesOrder_ND('500000002')",
			            "type": "STTA_SALES_ORDER_ND_SRV_01.STTA_C_SO_SalesOrder_NDType",
			            "etag": "W/\"'111'\""
			        },
			        "OpportunityID": "222",
			        "CurrencyCode": "EUR",
			        "to_Currency": {
			            "__ref": "I_PrototypeCurrency('EUR')"
			        }
			    },
			    "STTA_C_SO_SalesOrderItem_ND(SalesOrderID='500000002',SalesOrderItemID='10')": {
			        "__metadata": {
			            "id": "https://localhost:3081/sap/opu/odata/sap/STTA_SALES_ORDER_ND_SRV_01/STTA_C_SO_SalesOrderItem_ND(SalesOrderID='500000002',SalesOrderItemID='10')",
			            "uri": "https://localhost:3081/sap/opu/odata/sap/STTA_SALES_ORDER_ND_SRV_01/STTA_C_SO_SalesOrderItem_ND(SalesOrderID='500000002',SalesOrderItemID='10')",
			            "type": "STTA_SALES_ORDER_ND_SRV_01.STTA_C_SO_SalesOrderItem_NDType"
			        },
			        "AvailableToPromiseStatus": "A",
			        "to_AvailableToPromiseStatus": {
			            "__ref": "I_AIS_SOI_Atp_Status('A')"
			        }
			    }
			};
			isModelDirty = true;
			oContext1 = {
				bForceRefresh: false,
				bPreliminary: false,
				bUpdated: false,
				oModel: {},
				sDeepPath: "/STTA_C_SO_SalesOrder_ND('500000002')",
				sPath: "/STTA_C_SO_SalesOrder_ND('500000002')",
				getPath: function() {
					return this.sPath;
				}
			};
			oContext2 = {
				bForceRefresh: false,
				oModel: {},
				sDeepPath: "/STTA_C_SO_SalesOrder_ND('500000002')/to_Item(SalesOrderID='500000002',SalesOrderItemID='10')",
				sPath: "/STTA_C_SO_SalesOrderItem_ND(SalesOrderID='500000002',SalesOrderItemID='10')",
				getPath: function() {
					return this.sPath;
				}
			};
		},
		afterEach: fnCommonTeardown
	});

	QUnit.test("Non-Draft Side Effect calls", function(assert) {
		oSandbox.stub(oController, "getView", function() {
			return {
				getModel: function() {
					return {
						getPendingChanges: function() {
							return oPendingChanges;
						},
						hasPendingChanges: function() {
							return isModelDirty;
						},
						getContext: function(sObject) {
							var oResult = {};
							switch (sObject) {
							case "/STTA_C_SO_SalesOrder_ND('500000002')":
								oResult = oContext1;
								break;
							case "/STTA_C_SO_SalesOrderItem_ND(SalesOrderID='500000002',SalesOrderItemID='10')":
								oResult = oContext2;
								break;
							default:
								break;
							}
							return oResult;
						},
						setProperty: function(){}
					};
				}
			};
		});
		var aPendingChanges1 = [
			"OpportunityID",
			"CurrencyCode",
			"to_Currency"
		];
		var aPendingChanges2 = [
			"AvailableToPromiseStatus",
			"to_AvailableToPromiseStatus"
		];
		oTemplateUtils.oComponentUtils.isComponentDirty = sinon.stub().returns(true);
		var oSubmitChangesForSmartMultiInputSpy = sinon.spy(oTemplateUtils.oCommonEventHandlers, "submitChangesForSmartMultiInput");
		var oSetRootPageToDirtySpy = sinon.spy(oTemplateUtils.oServices.oViewDependencyHelper, "setRootPageToDirty");
		var oUnbindChildrenSpy = sinon.spy(oTemplateUtils.oServices.oViewDependencyHelper, "unbindChildren");
		var oNavigateToRootSpy = sinon.spy(oTemplateUtils.oServices.oNavigationController, "navigateToRoot");
		var oExecuteSideEffectsSpy = sinon.spy(oTemplateUtils.oServices.oApplicationController, "executeSideEffects");
		var oFireSpy = sinon.spy(oTemplateUtils.oComponentUtils, "fire");
		oStubForPrivate.onSaveImpl();
		assert.ok(oExecuteSideEffectsSpy.calledTwice, "Side-Effect called twice because of changes on different entity-sets");
		assert.equal(oExecuteSideEffectsSpy.calledWith(oContext1, aPendingChanges1), true, "executeSideEffects called with parameter Context1, PendingChange1");
		assert.equal(oExecuteSideEffectsSpy.calledWith(oContext2, aPendingChanges2), true, "executeSideEffects called with parameter Context2, PendingChange2");
		assert.equal(oExecuteSideEffectsSpy.neverCalledWith(oContext1, aPendingChanges2), true, "executeSideEffects NOT called with parameter Context1, PendingChange2");
		assert.equal(oExecuteSideEffectsSpy.neverCalledWith(oContext2, aPendingChanges1), true, "executeSideEffects NOT called with parameter Context2, PendingChange1");
		oFireSpy.restore();
		oExecuteSideEffectsSpy.restore();
		oNavigateToRootSpy.restore();
		oUnbindChildrenSpy.restore();
		oSetRootPageToDirtySpy.restore();
		oSubmitChangesForSmartMultiInputSpy.restore();
	});

	QUnit.module("fnIsEntryDeletable", {
		beforeEach: fnCommonSetup,
		afterEach: fnCommonTeardown
	});

	function fnTestIsEntryDeletable(assert, oDeleteRestrictions, oContext, bExpectedIsDeletable) {
		var oSmartTable = {
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.ui.comp.smarttable.SmartTable";
					}
				};
			},
			getModel: function() {
				return {
					getMetaModel: function() {
						return {
							getODataEntitySet: function() {
								return {};
							}
						};
					},
					getProperty: function(sDeletablePath, oContext) {
						return oContext[sDeletablePath];
					}
				};
			},
			getEntitySet: function() {
				return "";
			}
		};
		var oGetTableDeleteRestrictions = sinon.stub(oStubForPrivate, "getTableDeleteRestrictions", function() {
			return oDeleteRestrictions;
		});
		var oGetDeleteRestrictions = sinon.stub(oTemplateUtils.oCommonUtils, "getDeleteRestrictions", function(oControl) {
			return oDeleteRestrictions;
		});
		var actualIsDeletable = oStubForPrivate.isEntryDeletable(oContext, oSmartTable);
		assert.equal(actualIsDeletable, bExpectedIsDeletable);
		oGetTableDeleteRestrictions.restore();
		oGetDeleteRestrictions.restore();
	}

	QUnit.test("Entry is Deletable if there are no delete restrictions", function(assert) {
		fnTestIsEntryDeletable(assert, undefined, {}, true);
	});

	QUnit.test("Entry is Deletable if deletable path is true", function(assert) {
		var oDeleteRestrictions = {
			Deletable: {
				Path: "isDeletable"
			}
		};
		fnTestIsEntryDeletable(assert, oDeleteRestrictions, { isDeletable: true }, true);
	});

	QUnit.test("Entry is not Deletable if deletable path is false", function(assert) {
		var oDeleteRestrictions = {
			Deletable: {
				Path: "isDeletable"
			}
		};
		fnTestIsEntryDeletable(assert, oDeleteRestrictions, { isDeletable: false }, false);
	});

	QUnit.module("ObjectPage.controller.ControllerImplementation.onActivate", {
		beforeEach: function(){
			oSandbox = sinon.sandbox.create();
			oSandbox.stub(oTemplateUtils.oComponentUtils, "isDraftEnabled", function(){
				return true;
			});
			oSandbox.stub(oTemplateUtils.oCommonUtils, "executeIfControlReady", function(fnHandler, sButtonId){
				if (sButtonId === "activate" || sButtonId === "template:::ObjectPageAction:::ActivateMenu") {
					fnHandler();
				}
			});
			fnCommonSetup();
		},
		afterEach: fnCommonTeardown
	});

	QUnit.test("onActivate must call CRUDActionHandler.handleCRUDScenario and pass onActivateImpl", function(assert){
		var done = assert.async();
		var vSave = {
			getSource: Function.prototype
		};
		oController.beforeSaveExtension = function (){
			setTimeout(function(){
				done();
			}, 0);
		};
		var oOnActivateImplStub = oSandbox.stub(oStubForPrivate, "onActivateImpl");
		oSandbox.stub(oCRUDActionHandler, "handleCRUDScenario", function(iScenario, fnOperation){
			var bIsActivation = iScenario === 1;
			assert.ok(bIsActivation, "handleCRUDScenario must have been called for activation");
			assert.ok(oOnActivateImplStub.notCalled, "The activation must only be started after preparation");
			fnOperation();
			assert.ok(oOnActivateImplStub.calledOnce, "The activation must be started if preparation succeeds");
		});

		oMethods.handlers.onSave(vSave);
	});

	QUnit.test("onActivate must call CRUDActionHandler.handleCRUDScenario and pass onActivateImpl for mobile and tablet devices with a MenuButton", function(assert){
		var done = assert.async();
		var vSave = {
			getSource: Function.prototype
		};
		oController.beforeSaveExtension = function (){
			setTimeout(function(){
				done();
			}, 0);
		};
		var oOnActivateImplStub = oSandbox.stub(oStubForPrivate, "onActivateImpl");
		oSandbox.stub(controlHelper, "isMenuButton").returns(true);

		oSandbox.stub(oCRUDActionHandler, "handleCRUDScenario", function(iScenario, fnOperation){
			var bIsActivation = iScenario === 1;
			assert.ok(bIsActivation, "handleCRUDScenario must have been called for activation");
			assert.ok(oOnActivateImplStub.notCalled, "The activation must only be started after preparation");
			fnOperation();
			assert.ok(oOnActivateImplStub.calledOnce, "The activation must be started if preparation succeeds");
		});

		oMethods.handlers.onSave(vSave);
	});

	QUnit.test("onActivate must call CRUDActionHandler.handleCRUDScenario and pass onActivateImpl for mobile and tablet devices with a Menu", function(assert){
		var done = assert.async();
		var vSave = {
			getSource: Function.prototype
		};
		oController.beforeSaveExtension = function (){
			setTimeout(function(){
				done();
			}, 0);
		};
		var oOnActivateImplStub = oSandbox.stub(oStubForPrivate, "onActivateImpl");
		oSandbox.stub(controlHelper, "isMenu").returns(true);

		oSandbox.stub(oCRUDActionHandler, "handleCRUDScenario", function(iScenario, fnOperation){
			var bIsActivation = iScenario === 1;
			assert.ok(bIsActivation, "handleCRUDScenario must have been called for activation");
			assert.ok(oOnActivateImplStub.notCalled, "The activation must only be started after preparation");
			fnOperation();
			assert.ok(oOnActivateImplStub.calledOnce, "The activation must be started if preparation succeeds");
		});

		oMethods.handlers.onSave(vSave);
	});

/* Todo: Move these unit tests to BeforeSaveHandler unit tests
	QUnit.test("Open Confirmation Dialog if warning exists and flag is set in manifest", function(assert) {
		var oMessagePopover = {
			getBinding: function(sItems) {
				var aIndices = [0], type;
				return {
					"aIndices": aIndices,
					"oList": [
						{
							"type": "Warning",
							"message": "Testing Warning Message"
						}
					]
				};
			}
		};
		var oPerformAfterSideEffectExecutionSpy = sinon.spy(oTemplateUtils.oServices.oApplication, "performAfterSideEffectExecution");
		var oMessagePopoverStub = sinon.stub(oTemplateUtils.oCommonUtils, "getDialogFragment", function(sName) {
			assert.strictEqual(sName, "sap.suite.ui.generic.template.fragments.MessagePopover", "Load correct fragment for getting Message Binding");
			return oMessagePopover;
		});
		var oOpenConfirmationDialog = sinon.stub(oStubForPrivate, "fnOpenConfirmationDialog", function() {});
		oStubForPrivate.onActivate();
		assert.ok(true, "onActivate function is called");
		assert.ok(oOpenConfirmationDialog.calledOnce, "fnOpenConfirmationDialog called");
		assert.ok(oPerformAfterSideEffectExecutionSpy.notCalled, "Perform After Side Effect Execution Not Called");
		oMessagePopoverStub.restore();
		oPerformAfterSideEffectExecutionSpy.restore();
	});

	QUnit.test("Do not open Confirmation dialog if there are no warnings, but flag is set to true", function(assert) {
		var oMessagePopover = {
			getBinding: function(sItems) {
				var aIndices = [0], type;
				return {
					"aIndices": aIndices,
					"oList": [
						{
							"type": "Error",
							"message": "Testing when there are no warning messages"
						}
					]
				};
			}
		};
		var oPerformAfterSideEffectExecutionSpy = sinon.spy(oTemplateUtils.oServices.oApplication, "performAfterSideEffectExecution");
		var oMessagePopoverStub = sinon.stub(oTemplateUtils.oCommonUtils, "getDialogFragment", function(sName) {
			assert.strictEqual(sName, "sap.suite.ui.generic.template.fragments.MessagePopover", "Load correct fragment for getting Message Binding");
			return oMessagePopover;
		});
		var oOpenConfirmationDialog = sinon.stub(oStubForPrivate, "fnOpenConfirmationDialog", function() {});
		oStubForPrivate.onActivate();
		assert.ok(true, "onActivate function is called");
		assert.ok(oOpenConfirmationDialog.notCalled, "fnOpenConfirmationDialog not called");
		assert.ok(oPerformAfterSideEffectExecutionSpy.calledOnce, "Perform After Side Effect Execution is called");
		oMessagePopoverStub.restore();
		oPerformAfterSideEffectExecutionSpy.restore();
	});

	QUnit.test("Do not open Confirmation dialog if flag is not set, but warnings exists", function(assert) {
		var oPerformAfterSideEffectExecutionSpy = sinon.spy(oTemplateUtils.oServices.oApplication, "performAfterSideEffectExecution");
		var oOpenConfirmationDialog = sinon.stub(oStubForPrivate, "fnOpenConfirmationDialog");
		bShowConfirmationOnDraftActivate = undefined;
		oStubForPrivate.onActivate();
		assert.ok(true, "onActivate function is called");
		assert.ok(oOpenConfirmationDialog.notCalled, "fnOpenConfirmationDialog not called");
		assert.ok(oPerformAfterSideEffectExecutionSpy.calledOnce, "Perform After Side Effect Execution is called");
		oPerformAfterSideEffectExecutionSpy.restore();
	});

	QUnit.test("Do not open Confirmation dialog if flag is set to false, but warnings exists", function(assert) {
		var oPerformAfterSideEffectExecutionSpy = sinon.spy(oTemplateUtils.oServices.oApplication, "performAfterSideEffectExecution");
		var oOpenConfirmationDialog = sinon.stub(oStubForPrivate, "fnOpenConfirmationDialog");
		bShowConfirmationOnDraftActivate = false;
		oStubForPrivate.onActivate();
		assert.ok(true, "onActivate function is called");
		assert.ok(oOpenConfirmationDialog.notCalled, "fnOpenConfirmationDialog not called");
		assert.ok(oPerformAfterSideEffectExecutionSpy.calledOnce, "Perform After Side Effect Execution is called");
		oPerformAfterSideEffectExecutionSpy.restore();
	});

	QUnit.module("ObjectPage.controller.ControllerImplementation.fnOpenConfirmationDialog", {
		beforeEach: fnCommonSetup,
		afterEach: fnCommonTeardown
	});

	QUnit.test("Dialog opened successfully", function(assert) {
		var oScope = {};
		var aPersistentMessageModel = [];
		var sMessageType = "Warning";
		var oDialog = {};
		var oOpenSpy = sinon.spy(oDialog, "open");
		var oRemoveAllContentSpy = sinon.spy(oDialog, "removeAllContent");
		var oAddContentSpy = sinon.spy(oDialog, "addContent");
		var oSetContentHeightSpy = sinon.spy(oDialog, "setContentHeight");
		var oSetContentWidthSpy = sinon.spy(oDialog, "setContentWidth");
		var oSetVerticalScrollingSpy = sinon.spy(oDialog, "setVerticalScrolling");
		var oSetStateSpy = sinon.spy(oDialog, "setState");
		var oDialogController;
		var oGetDialogFragmentStub = sinon.stub(oTemplateUtils.oCommonUtils, "getDialogFragment", function(sName, oFragmentController) {
			assert.strictEqual(sName, "sap.suite.ui.generic.template.ObjectPage.view.fragments.ShowConfirmationOnDraftActivate",
				"Load correct fragment for confirmation dialog after Save in case of warnings");
			oDialogController = oFragmentController;
			return oDialog;
		});
		oStubForPrivate.fnOpenConfirmationDialog(oScope, aPersistentMessageModel, sMessageType);
		assert.ok(oOpenSpy.calledOnce, "Dialog must have been opened");
		assert.ok(oRemoveAllContentSpy.calledOnce, "removeAllContent function called");
		assert.ok(oAddContentSpy.calledOnce, "addContent function called");
		assert.ok(oSetContentHeightSpy.calledOnce, "setContentHeight function called");
		assert.ok(oSetContentWidthSpy.calledOnce, "setContentWidth function called");
		assert.ok(oSetVerticalScrollingSpy.calledOnce, "setVerticalScrolling function called");
		assert.ok(oSetStateSpy.calledOnce, "setState function called");
		oGetDialogFragmentStub.restore();
		oOpenSpy.restore();
		oRemoveAllContentSpy.restore();
		oAddContentSpy.restore();
		oSetContentHeightSpy.restore();
		oSetContentWidthSpy.restore();
		oSetVerticalScrollingSpy.restore();
		oSetStateSpy.restore();
		//Testing Dialog Controller
		var oCloseSpy = sinon.spy(oDialog, "close");
		oDialogController.onCancel();
		assert.ok(oCloseSpy.calledOnce, "Dialog must have been closed by Cancel");
		var oPerformAfterSideEffectExecutionSpy = sinon.spy(oTemplateUtils.oServices.oApplication, "performAfterSideEffectExecution");
		oDialogController.onSave();
		assert.ok(oPerformAfterSideEffectExecutionSpy.calledOnce, "Perform After Side Effect Execution called on save");
		oCloseSpy.restore();
	});
*/
	QUnit.module("ObjectPage.controller.ControllerImplementation.deleteEntries", {
		beforeEach: fnCommonSetup,
		afterEach: fnCommonTeardown
	});

	QUnit.test("delete entries, while app is busy", function(assert) {
		bIsAppBusy = true;
		var oBy = {};
		var oEvent = {
			getSource: sinon.stub().returns(oBy)
		};
		var executeIfControlReadyStub = oSandbox.stub(oTemplateUtils.oCommonUtils, "executeIfControlReady", function(fnHandler){
			var newFnHandler = fnHandler.bind(oController);
			newFnHandler(oEvent.getSource());
		});
		executeIfControlReadyStub.withArgs(fnTestDeleteEntries, 'test');
		assert.ok(true, "delete entries could be called while app is busy without any effect");
	});

	function fnTestDeleteEntries(assert, aPaths) {
		var done = assert.async();
		var oBindingContext = { bindingContext: "TableBindingContext" };
		var sTableBindingPath = "bindingPath";
		var aContexts = [];
		var oDialog = {
			getModel: function() {
				return {
					setData: function() {
					}
				};
			},
			setModel: Function.prototype,
			open: function() {
			}
		};
		var fnGetPath = function(sPath) { return sPath; };
		for (var i = 0; i < aPaths.length; i++) {
			aContexts.push({
				getPath: fnGetPath.bind(null, aPaths[i])
			});
		}
		var oButton = {
			setEnabled: function(bEnabled) {
			},
			getParent: function() {
				return {
					getParent: function() {
						return {
							getId: function() {
								return "sUiElementId";
							}
						};
					}
				};
			}
		};
		var oEvent = {
			getSource: function() {
				return oButton;
			}
		};
		var oEventForDialog = {
			getSource: function() {
				return {
					getParent: function() {
						return {
							close: function() {
							}
						};
					}
				};
			}
		};
		var oTable = {
			getTable: function() {
				return {
					attachEventOnce: Function.prototype
				};
			},
			getBindingContext: function() {
				return oBindingContext;
			},
			getTableBindingPath: function() {
				return sTableBindingPath;
			},
			getId: function() {
				return "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table";
			},
			getParent: function() {
				return this;
			}
		};
		var oDialogController;

		var executeIfControlReadyStub = oSandbox.stub(oTemplateUtils.oCommonUtils, "executeIfControlReady", function(fnHandler){
			var newFnHandler = fnHandler.bind(oController);
			newFnHandler(oEvent.getSource());
		});
		var oGetDialogFragmentStub = sinon.stub(oTemplateUtils.oCommonUtils, "getDialogFragmentAsync", function(sName, oFragmentController) {
			assert.strictEqual(sName, "sap.suite.ui.generic.template.ObjectPage.view.fragments.TableDeleteConfirmation",
				"Load correct fragment for confirmation dialog after Save in case of warnings");
			oDialogController = oFragmentController;
			return Promise.resolve(oDialog);
		});
		var oGetOwnerControlStub = sinon.stub(oTemplateUtils.oCommonUtils, "getOwnerControl", function(oSourceControl) {
			assert.strictEqual(oSourceControl, oButton, "source control must be the source of the event");
			return oTable;
		});
		var oGetSelectedContextsStub = sinon.stub(oTemplateUtils.oCommonUtils, "getSelectedContexts", function(oControl) {
			assert.strictEqual(oControl, oTable, "selected contexts must be determined for table");
			return aContexts;
		});
		var oIsEntryDeletableStub = sinon.stub(oStubForPrivate, "isEntryDeletable", function() {
			return true;
		});
		var oGetDeleteButtonInTableToolbar = sinon.stub(oStubForPrivate, "getDeleteButtonInTableToolbar", function(oSmartTable) {
			return {
				setEnabled: function(bEnabled) {
				}
			};
		});
		var oExecuteSideEffectsStub = sinon.stub(oTemplateUtils.oServices.oApplicationController, "executeSideEffects");
		var oDeletePromise, oThenStub, oDeleteEntitiesStub, oSetBusySpy, oErrorStub, oGetTextStub, oGetContentDensityClassStub;
		var oText = {};
		var aFailedPath = [];
		var sDensityClass = "§§§";
		var ofireSpy = sinon.spy(oTemplateUtils.oComponentUtils, "fire");
		if (aPaths.length > 0) {
			oDeletePromise = {};
			oThenStub = sinon.stub(oDeletePromise, "then", function(fnThen) {
//					var oRebindTableSpy = sinon.spy(oTable, "rebindTable");
				var oRefreshTableSpy = sinon.spy(oTemplateUtils.oCommonUtils, "refreshSmartTable");
				fnThen(aFailedPath);
//					assert.ok(oRebindTableSpy.calledOnce, "Promise must have been sent to rebindTable");
				assert.ok(oRefreshTableSpy.calledOnce, "refreshSmartTable has been called after deletion");
//					oRebindTableSpy.restore();
				oRefreshTableSpy.restore();
			});
			oDeleteEntitiesStub = sinon.stub(oTemplateUtils.oServices.oCRUDManager, "deleteEntities", function(aPath) {
				assert.deepEqual(aPath, aPaths, "given paths must be passed to delete");
				return oDeletePromise;
			});
			oSetBusySpy = sinon.spy(oBusyHelper, "setBusy");
		} else {
			oErrorStub = sinon.stub(MessageBox, "error", function(sText, oSettings) {
				assert.strictEqual(sText, oText, "CorrectText must be shown");
				assert.deepEqual(oSettings, {
					styleClass: sDensityClass
				}, "Error must be shown correctly");
			});
			oGetTextStub = sinon.stub(oTemplateUtils.oCommonUtils, "getText", function(sId) {
				//assert.strictEqual(sId, "ST_GENERIC_NO_ITEM_SELECTED", "Correct no item text must be retrieved");
				return oText;
			});
			oGetContentDensityClassStub = sinon.stub(oTemplateUtils.oCommonUtils, "getContentDensityClass", function() {
				return sDensityClass;
			});
		}
		oMethods.handlers.deleteEntries(oEvent);
		setTimeout(function(){
			if (aContexts.length > 0) {
				oDialogController.onDelete(oEventForDialog);
			}
			if (aPaths.length > 0) {
				assert.ok(ofireSpy.calledOnce, "fire called");
				assert.ok(oSetBusySpy.calledOnce, "setBusy must have been called once");
				assert.ok(oSetBusySpy.calledWithExactly(oDeletePromise), "delete promise must have been passed to setBusy");
				assert.ok(oThenStub.calledOnce, "Rebind table must have been attached to Promise");
				oDeleteEntitiesStub.restore();
				oSetBusySpy.restore();
				assert.ok(oExecuteSideEffectsStub.calledOnce, "executeSideEffects should be called once");
			} else {
				assert.notOk(ofireSpy.calledOnce, "fire not called");
				assert.ok(oErrorStub.calledOnce, "Error must have been displayed");
				oErrorStub.restore();
				oGetTextStub.restore();
				oGetContentDensityClassStub.restore();
				assert.ok(oExecuteSideEffectsStub.notCalled, "executeSideEffects should not be called if no entry is selected");
			}
			oGetOwnerControlStub.restore();
			oGetSelectedContextsStub.restore();
			oIsEntryDeletableStub.restore();
			oGetDeleteButtonInTableToolbar.restore();
			oExecuteSideEffectsStub.restore();
			ofireSpy.restore();
			oGetDialogFragmentStub.restore();
			// Testing for the Dialog
			done();
		});
	}

	QUnit.test("delete one entry", function(assert) {
		fnTestDeleteEntries(assert, {
			"pathes": [
			  "test1"
			]
		  });
	});

	QUnit.test("delete without any entry selected", function(assert) {
		fnTestDeleteEntries(assert, []);
	});

	QUnit.module("adapt links for navigation", {
		beforeEach: fnCommonSetup,
		afterEach: fnCommonTeardown
	});

	QUnit.test("Function onBeforeSemanticObjectLinkPopoverOpens", function(assert) {
		assert.ok(true, "Test - Always Good!");
	});

	QUnit.module("Event handler onShareObjectPageActionButtonPress", {
		beforeEach: function() {
			this.oOpenSharePopupStub = sinon.stub(ShareUtils, "openSharePopup");
			this.onShareObjectPageActionButtonPress = ControllerImplementation.getMethods(oViewProxy, oTemplateUtils, {}).handlers.onShareObjectPageActionButtonPress;
		},
		afterEach: function() {
			this.onShareObjectPageActionButtonPress = null;
			this.oOpenSharePopupStub.restore();
			this.oOpenSharePopupStub = null;
		}
	});

	QUnit.test("Calls the openSharePopup function of ShareUtils", function(assert) {
		// Arrange
		var oBy = {};
		var oEvent = {
			getSource: sinon.stub().returns(oBy)
		};
		oSandbox = sinon.sandbox.create();
		oSandbox.stub(oTemplateUtils.oCommonUtils, "executeIfControlReady", function(fnHandler){
				fnHandler(oEvent.getSource());
				});
		// Act
		this.onShareObjectPageActionButtonPress(oEvent);
		// Assert
		assert.strictEqual(this.oOpenSharePopupStub.callCount, 1, "The function openSharePopup has been called once.");
		assert.strictEqual(this.oOpenSharePopupStub.firstCall.args[0], oTemplateUtils.oCommonUtils, "The CommonUtils instance has been passed to the function.");
		assert.strictEqual(this.oOpenSharePopupStub.firstCall.args[1], oBy, "The event source has been passed to the function.");
		assert.strictEqual(typeof this.oOpenSharePopupStub.firstCall.args[2], "object", "An object instance has been passed to the function.");
	});

	function getFragmentController(title, subtitle, assert) {
		// Arrange
		var oOpenSharePopupStub = sinon.stub(ShareUtils, "openSharePopup");
		var oEvent = {
			getSource: function() {
				return {};
			}
		};
		var oGetPropertyStub = sinon.stub(oTemplatePrivateModel, "getProperty");
		var oGetTitleStub = sinon.stub(oTemplateUtils.oComponentUtils, "getTitle");
		oGetTitleStub.returns(title);
		oGetPropertyStub.withArgs("/objectPage/headerInfo/objectTitle").returns(subtitle);
		ControllerImplementation.getMethods(oViewProxy, oTemplateUtils, oController).handlers.onShareObjectPageActionButtonPress(oEvent);
		// Assert
		assert(oOpenSharePopupStub.firstCall.args[2]);
		// Cleanup
		oGetPropertyStub.restore();
		oGetTitleStub.restore();
		oOpenSharePopupStub.restore();
	}

	function getFragmentControllerForShareDialog(title, subtitle, assert) {
		// Arrange
		var oOpenSharePopupStub = sinon.stub(ShareUtils, "openSharePopup");
		var oEvent = {
			getSource: function() {
				return {};
			}
		};
		var oGetPropertyStub = sinon.stub(oTemplatePrivateModel, "getProperty");
		var oGetTitleStub = sinon.stub(oTemplateUtils.oComponentUtils, "getTitle");
		oGetTitleStub.returns(title);

		oGetPropertyStub.withArgs("/objectPage/headerInfo/objectShellTitle").returns(title);
		oGetPropertyStub.withArgs("/objectPage/headerInfo/objectTitle").returns(subtitle);
		
		var oControllerMethods = ControllerImplementation.getMethods(oViewProxy, oTemplateUtils, oController);
		oControllerMethods.onInit();
		oControllerMethods.handlers.onShareObjectPageActionButtonPress(oEvent);
		// Assert
		assert(oOpenSharePopupStub.firstCall.args[2]);
		// Cleanup
	}

	QUnit.module("Fragment controller functions", {
		beforeEach: function() {
			this.oController = {};
		},
		afterEach: function() {
			this.oController = null;
		}
	});

	QUnit.test("The fragmentController's sharePageToPressed (Email) function with title and subtitle", function(assert) {
		// Arrange
		var done = assert.async();
		var oSandbox = sinon.sandbox.create();

		var oGetCurrentURLStub = oSandbox.stub(ShareUtils, "getCurrentUrl", function() {
			return Promise.resolve("www.sample.com");
		});
		var oTriggerEmailStub = sinon.stub(MobileLibrary.URLHelper, "triggerEmail");

		// Act
		getFragmentController.call(this, "FancyShellTitle", "FancyTitle", function(oFragmentController) {
			oFragmentController.sharePageToPressed("Email");
			setTimeout(function() {
				// Assert
				assert.strictEqual(oTriggerEmailStub.callCount, 1, "The URLHelper's triggerEmail function has been called once.");
				assert.strictEqual(oTriggerEmailStub.firstCall.args[0], null, "The correct destination e-mail parameter has been passed.");
				assert.strictEqual(oTriggerEmailStub.firstCall.args[1], "FancyShellTitle - FancyTitle", "The correct subject parameter has been passed.");
				assert.strictEqual(oTriggerEmailStub.firstCall.args[2], "www.sample.com", "The correct e-mail body parameter has been passed.");
				// Cleanup
				oTriggerEmailStub.restore();
				oGetCurrentURLStub.restore();
				done();
			}, 0);
		});
	});

	QUnit.test("The fragmentController's sharePageToPressed (Email) function with title and without subtitle", function(assert) {
		// Arrange
		var done = assert.async();
		var oSandbox = sinon.sandbox.create();

		var oGetCurrentURLStub = oSandbox.stub(ShareUtils, "getCurrentUrl", function() {
			return Promise.resolve("www.sample.com");
		});
		var oTriggerEmailStub = sinon.stub(MobileLibrary.URLHelper, "triggerEmail");

		// Act
		getFragmentController.call(this, "FancyShellTitle", "", function(oFragmentController) {
			oFragmentController.sharePageToPressed("Email");
			setTimeout(function() {
				// Assert
				assert.strictEqual(oTriggerEmailStub.callCount, 1, "The URLHelper's triggerEmail function has been called once.");
				assert.strictEqual(oTriggerEmailStub.firstCall.args[1], "FancyShellTitle", "The correct subject parameter has been passed.");
				assert.strictEqual(oTriggerEmailStub.firstCall.args[2], "www.sample.com", "The correct e-mail body parameter has been passed.");
				// Cleanup
				oTriggerEmailStub.restore();
				oGetCurrentURLStub.restore();
				done();
			}, 0);
		});
	});

	QUnit.test("The fragmentController's shareJamPressed function", function(assert) {
		// Arrange
		var oStub = sinon.stub(ShareUtils, "openJamShareDialog");
		// Act
		getFragmentController.call(this, "FancyShellTitle", "FancyTitle", function(oFragmentController) {
			oFragmentController.shareJamPressed();
			// Assert
			assert.strictEqual(oStub.callCount, 1, "The function openJamShareDialog has been called once.");
			assert.strictEqual(oStub.firstCall.args[0], "FancyShellTitle FancyTitle", "The function openJamShareDialog has been called with the correct parameter.");
			// Cleanup
			oStub.restore();
		});
	});

	QUnit.test("The fragmentController's getModelData function", function(assert) {
		// Arrange
		var done = assert.async();
		// Act
		getFragmentControllerForShareDialog.call(this, "FancyTitle", "FancySubtitle", function(oFragmentController) {
			var oModelData = oFragmentController.getModelData();
			// Assert
			assert.ok(oModelData instanceof Promise, "Returned a Promise");
			oModelData.then(function (oShareInfo) {
				assert.strictEqual(oShareInfo.shellTitle, "FancyTitle", "The title property has the correct value.");
				assert.strictEqual(oShareInfo.pageTitle, "FancySubtitle", "The subtitle property has the correct value.");
				assert.strictEqual(oShareInfo.customUrl, document.URL, "The customUrl property has the correct function reference.");
				done();
			});
		});
	});

	QUnit.module("ObjectPage.controller.ControllerImplementation.fnAdaptBindingParamsForInlineCreate", {
		beforeEach: fnCommonSetup,
		afterEach: fnCommonTeardown
	});

	QUnit.test("The fnAdaptBindingParamsForInlineCreate function", function(assert) {
		// Arrange
		var oSubSection = new ObjectPageSubSection({id:"secondSectionIdSecondSubSection", blocks:new sap.m.Text({text:"Demo"})});
		var oSection = new ObjectPageSection({id:"secondSectionId"});
		oSection.addSubSection(oSubSection);
		oSubSection.getParent = function() {
			return oSection;
		}
		var oMockData = fnGetMockData(false, true, false, true, oSubSection);
		oMockData.smartTableMock.getUseVariantManagement = function (){};
		oMockData.smartTableMock.data = function(key) {
			if (key === "disableInlineCreateSort") {
				return "false";
			}
			if (key === "creationMode") {
				return "inline";
			}
		};
		oMockData.smartTableMock.getTable = function () { return {}; };
		// Case 1: Default Sorting
		var oBindingParams = {
			batchGroupId: "facets",
			expand: "to_Language,to_ProductSalesPrice,to_ProductSalesRevenue",
			select: "LanguageForEdit",
			sorter: [],
			filters: [],
			events:{}
		};
		var oEvent = {
			getSource: function() {
				return oMockData.smartTableMock;
			},
			getParameter: function(sParams) {
				if (sParams === "messageFilterActive") {
					return false;
				}
				return oBindingParams;
			},
			mParameters:{}
		};
		oEvent.mParameters.bindingParams = oBindingParams;
		oEvent.getParameters = function(){
			return oEvent.mParameters;
		};

		oTemplateUtils.oInfoObjectHandler.getControlInformation = sinon.stub().returns(oMockData.smartTableInfoMock);
		oSandbox.stub(oTemplateUtils.oCommonUtils, "getMetaModelEntityType", function(sEntitySet){
			assert.equal(sEntitySet, oMockData.smartTableMock.getEntitySet(), "Entity type must only be read for the smart table");
			return {
				property : [{
					name: "dummy"
				}, {
					name: "DraftEntityCreationDateTime"
				}]
			};
		});

		oMethods.handlers.onBeforeRebindDetailTable(oEvent);

		assert.strictEqual(oBindingParams.sorter[0].sPath, "DraftEntityCreationDateTime", "The function fnAdaptBindingParamsForInlineCreate has been called with default sorting");

		// Case 2: Disable default sorting
		oBindingParams = {
			batchGroupId: "facets",
			expand: "to_Language,to_ProductSalesPrice,to_ProductSalesRevenue",
			select: "LanguageForEdit",
			sorter: [],
			filters: [],
			events:{}
		};
		oMockData.smartTableMock.data = function(key) {
				if (key === "disableInlineCreateSort") {
					return "true";
				} else if (key === "creationMode") {
					return "inline";
				}
			};

		oMethods.handlers.onBeforeRebindDetailTable(oEvent);
		assert.strictEqual(oBindingParams.sorter.length,0, "The function fnAdaptBindingParamsForInlineCreate has been called with disable default sorting");

		//case 3 : with user filters from table during edit
		oBindingParams = {
			batchGroupId: "facets",
			expand: "to_Language,to_ProductSalesPrice,to_ProductSalesRevenue",
			select: "LanguageForEdit",
			sorter: [],
			messageFilterActive: false,
			filters: [{
				oValue1 : "dummy",
				oValue2 : undefined,
				sFractionalSeconds1 : undefined,
				sFractionalSeconds2 : undefined,
				sOperator : "EQ",
				sPath : "dummy_Path",
				bMultiFilter : false
			}],
			events:{}
		};

		var aExpectedResults = JSON.stringify({
			"aFilters": [
				{
					"aFilters": [
						{
							"sPath": "IsActiveEntity",
							"sOperator": "EQ",
							"oValue1": true,
							"_bMultiFilter": false
						},
						{
							"oValue1": "dummy",
							"sOperator": "EQ",
							"sPath": "dummy_Path",
							"bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				},
				{
					"aFilters": [
						{
							"sPath": "IsActiveEntity",
							"sOperator": "EQ",
							"oValue1": false,
							"_bMultiFilter": false
						},
						{
							"aFilters": [
								{
									"oValue1": "dummy",
									"sOperator": "EQ",
									"sPath": "dummy_Path",
									"bMultiFilter": false
								},
								{
									"sPath": "HasActiveEntity",
									"sOperator": "EQ",
									"oValue1": false,
									"_bMultiFilter": false
								}
							],
							"_bMultiFilter": true
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				}
			],
			"_bMultiFilter": true
		});
		oMethods.handlers.onBeforeRebindDetailTable(oEvent);
		oTemplateUtils.oInfoObjectHandler.getControlInformation = sinon.stub().returns(oMockData.smartTableInfoMock);
		assert.deepEqual(JSON.stringify(oBindingParams.filters), aExpectedResults, "The function fnAdaptBindingParamsForInlineCreate has been called to form the filter during edit");

		// Clear the stubs
		oTemplateUtils.oInfoObjectHandler.getControlInformation = Function.prototype;
		
	});

	QUnit.module("Functions dealing with table expand in object page", {
		beforeEach: fnCommonSetup,
		afterEach: fnCommonTeardown
	});

	QUnit.test("The fnHandleUITableExpand Function", function(assert) {
		// Arrange
		var sClassAppliedToOPSubSection = "";
		var sClassAppliedToOPGrid = "";
		var oOPSubSection = {
			addStyleClass: function(sClass) {
				sClassAppliedToOPSubSection = sClass;
				return;
			},
			removeStyleClass: function(sClass) {
				return sClassAppliedToOPSubSection === sClass ? "" : sClassAppliedToOPSubSection;
			},
			getParent: function() {
				return "";
			}
		};
		oSandbox.stub(controlHelper, "isObjectPageSubSection", function(oControl){
			return oControl === oOPSubSection;
		});
		var oGridLayout = {
			getParent: function() {
				return oOPSubSection;
			},
			addStyleClass: function(sClass) {
				sClassAppliedToOPGrid = sClass;
				return;
			},
			removeStyleClass: function(sClass) {
				return sClassAppliedToOPGrid === sClass ? "" : sClassAppliedToOPGrid;
			}
		};
		oSandbox.stub(controlHelper, "isGrid", function(oControl){
			return oControl === oGridLayout;
		});
		var oSmartTable = {
			getParent: function() {
				return oGridLayout;
			},
			setFitContainer: function() {}
		};
		// Act
		ControllerImplementation.getMethods(oViewProxy, oTemplateUtils, oController).handlers.onUITableExpand(oSmartTable, true);
		// Assert
		assert.strictEqual(sClassAppliedToOPSubSection, "sapUxAPObjectPageSubSectionFitContainer", "Relevant CSS has been applied to OP Sub Section");
		assert.strictEqual(sClassAppliedToOPGrid, "sapSmartTemplatesObjectPageSubSectionGridExpand", "Relevant CSS has been applied to OP Grid Layout");
	});

	QUnit.module("Functions checking if single section subsection exists in Object Page", {
		beforeEach: fnCommonSetup,
		afterEach: fnCommonTeardown
	});

	QUnit.test("The fnHasSingleVisibleSection Function", function(assert) {
		var oControllerMethods = ControllerImplementation.getMethods(oViewProxy, oTemplateUtils, oController);
		fnTearDownCallbackStubs();
		fnISetupCallbackStubs();
		oControllerMethods.onInit();
		var isSingleSectionVisible = oControllerMethods.handlers.onSingleSectionOrSubsectionVisible();
		assert.strictEqual(isSingleSectionVisible, true, "The function ensures that there is only one section in object Page.");
	});

	QUnit.test("The fnHasSingleVisibleSubSection Function", function(assert) {
		var oSection = {
			getSubSections: function() {
				return [
					{
						getVisible: function(){
							return true;
						}
					}
				];
			}
		};
		var oControllerMethods = ControllerImplementation.getMethods(oViewProxy, oTemplateUtils, oController);
		fnTearDownCallbackStubs();
		fnISetupCallbackStubs();
		oControllerMethods.onInit();
		var isSingleSubSectionVisible = oControllerMethods.handlers.onSingleSectionOrSubsectionVisible(oSection);
		assert.strictEqual(isSingleSubSectionVisible, true, "The function ensures that there is only one SubSection in object Page.");
	});

/* Deactivated, since hiding functionality has been refactored. Needs to be reworked.
	QUnit.module("Qunit to test function fnHideSmartTableColumns", {
		beforeEach: fnCommonSetup,
		afterEach: fnCommonTeardown
	});

	// First test Path = "", this means Hide the column and Lineitem with qualifier exists
	QUnit.test("Testing function fnHideSmartTableColumns", function(assert) {
		var oSmartTable = {
			getModel: function() {
				return {
					getMetaModel: function () {
						return {
							getODataEntitySet: function () {
								return {
									"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductTextType"
								};
							},
							getODataEntityType: function () {
								return {
									"com.sap.vocabularies.UI.v1.LineItem#Test" : [
										{
											"com.sap.vocabularies.UI.v1.Hidden": {
												"Path": ""
											},
											"Value": {
												"Path": "LanguageForEdit"
											},
											"RecordType": "com.sap.vocabularies.UI.v1.DataField"
										}
									],
									"com.sap.vocabularies.UI.v1.LineItem" : [
										{
											"com.sap.vocabularies.UI.v1.Hidden": {
												"Path": ""
											},
											"Value": {
												"Path": "LanguageForEdit"
											},
											"RecordType": "com.sap.vocabularies.UI.v1.DataField"
										}
									]
								};
							},
							getODataAssociationSetEnd: function() {
								return {
									"entitySet": "STTA_C_MP_Product"
								}
							}
						};
					}
				};
			},
			getEntitySet: function() {
				return "STTA_C_MP_ProductText";
			},
			deactivateColumns: function() {
				return true;
			},
			getCustomData: function() {
				return [{
					getKey: function() {
						return "lineItemQualifier";
					},
					getValue: function() {
						return "Test";
					}
				}];
			}
		};
		var oParentContext = {
			getProperty: function() {
				return true;
			}
		};
		var aHiddenColumns = ["LanguageForEdit"];
		var oSpy = sinon.spy(oSmartTable,"deactivateColumns");
		oStubForPrivate.fnHideSmartTableColumns(oSmartTable, oParentContext);
		assert.ok(oSpy.calledWithExactly(aHiddenColumns), "Path is emtpy and Lineitem with qualifier exists");
		oSpy.restore();
		// Second test Path="to_Product/to_Supplier/Edit_ac" and no custom data exists
		oSmartTable = {
			getModel: function() {
				return {
					getMetaModel: function () {
						return {
							getODataEntitySet: function () {
								return {
									"entityType" : "STTA_PROD_MAN.STTA_C_MP_ProductTextType"
								};
							},
							getODataEntityType: function () {
								return {
									"com.sap.vocabularies.UI.v1.LineItem" : [
										{
											"com.sap.vocabularies.UI.v1.Hidden": {
												"Path": "to_Product/to_Supplier/Edit_ac"
											},
											"Value": {
												"Path": "LanguageForEdit"
											},
											"RecordType": "com.sap.vocabularies.UI.v1.DataField"
										},
										{
											"Value": {
												"Path": "Language"
											},
											"RecordType": "com.sap.vocabularies.UI.v1.DataField"
										}
									],
									"navigationProperty": [
										{
											"name": "to_Product"
										}
									]
								};
							},
							getODataAssociationSetEnd: function() {
								return {
									"entitySet": "STTA_C_MP_Product"
								}
							}
						};
					}
				};
			},
			getEntitySet: function() {
				return "STTA_C_MP_ProductText";
			},
			deactivateColumns: function(aHiddenColumns) {
				return true;
			},
			getCustomData: function() {
				return [];
			}
		};
		oParentContext = {
			getProperty: function() {
				return true;
			}
		};
		aHiddenColumns = ["LanguageForEdit"];
		oSpy = sinon.spy(oSmartTable,"deactivateColumns");
		oStubForPrivate.fnHideSmartTableColumns(oSmartTable, oParentContext);
		assert.ok(oSpy.calledWithExactly(aHiddenColumns), "Correct path exists, custom data does not exists");
		oSpy.restore();
		//Third Test -if Path does not contain association to header
		oSmartTable = {
			getModel: function() {
				return {
					getMetaModel: function () {
						return {
							getODataEntitySet: function () {
								return {
									"entityType" : "STTA_PROD_MAN.STTA_C_MP_ProductTextType"
								};
							},
							getODataEntityType: function () {
								return {
									"com.sap.vocabularies.UI.v1.LineItem" : [
										{
											"com.sap.vocabularies.UI.v1.Hidden": {
												"Path": "Edit_ac"
											},
											"Value": {
												"Path": "LanguageForEdit"
											},
											"RecordType": "com.sap.vocabularies.UI.v1.DataField"
										},
										{
											"com.sap.vocabularies.UI.v1.Hidden": {
												"Path": "to_Product/Edit_ac"
											},
											"Value": {
												"Path": "Language"
											},
											"RecordType": "com.sap.vocabularies.UI.v1.DataField"
										}
									],
									"navigationProperty": [
										{
											"name": "to_Product"
										}
									]
								};
							},
							getODataAssociationSetEnd: function() {
								return {
									"entitySet": "STTA_C_MP_Product"
								}
							}
						};
					}
				};
			},
			getEntitySet: function() {
				return "STTA_C_MP_ProductText";
			},
			deactivateColumns: function(aHiddenColumns) {
				return true;
			},
			getCustomData: function() {
				return [{
					getKey: function() {
						return "";
					},
					getValue: function() {
						return "";
					}
				}];
			}
		};
		oParentContext = {
			getProperty: function() {
				return true;
			}
		};
		aHiddenColumns = ["Language"];
		oSpy = sinon.spy(oSmartTable,"deactivateColumns");
		oStubForPrivate.fnHideSmartTableColumns(oSmartTable, oParentContext);
		assert.ok(oSpy.calledWithExactly(aHiddenColumns), "Path does not contain association to header");
		oSpy.restore();
		// Fourth test navigationProperty object does not exist
		oSmartTable = {
				getModel: function() {
					return {
						getMetaModel: function () {
							return {
								getODataEntitySet: function () {
									return {
										"entityType" : "STTA_PROD_MAN.STTA_C_MP_ProductTextType"
									};
								},
								getODataEntityType: function () {
									return {
										"com.sap.vocabularies.UI.v1.LineItem" : [
											{
												"com.sap.vocabularies.UI.v1.Hidden": {
													"Path": "to_Product/Edit_ac"
												},
												"Value": {
													"Path": "LanguageForEdit"
												},
												"RecordType": "com.sap.vocabularies.UI.v1.DataField"
											}
										]
									};
								},
								getODataAssociationSetEnd: function() {
								return {
									"entitySet": "STTA_C_MP_Product"
								}
							}
							};
						}
					};
				},
				getEntitySet: function() {
					return "STTA_C_MP_ProductText";
				},
				deactivateColumns: function(aHiddenColumns) {
					return true;
				},
				getCustomData: function() {
				return [{
					getKey: function() {
						return "";
					},
					getValue: function() {
						return "";
					}
				}];
			}
			};
			oParentContext = {
				getProperty: function() {
					return true;
				}
			};
			aHiddenColumns = [];
			oSpy = sinon.spy(oSmartTable,"deactivateColumns");
			oStubForPrivate.fnHideSmartTableColumns(oSmartTable, oParentContext);
			assert.ok(oSpy.calledWithExactly(aHiddenColumns), "NavigationProperty object does not exist");
			oSpy.restore();
			//Fifth test - Hidden contains a Boolean value
			var oSmartTable = {
			getModel: function() {
				return {
					getMetaModel: function () {
						return {
							getODataEntitySet: function () {
								return {
									"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductTextType"
								};
							},
							getODataEntityType: function () {
								return {
									"com.sap.vocabularies.UI.v1.LineItem" : [
										{
											"com.sap.vocabularies.UI.v1.Hidden": {
												"Bool": "true"
											},
											"Value": {
												"Path": "LanguageForEdit"
											},
											"RecordType": "com.sap.vocabularies.UI.v1.DataField"
										}
									]
								};
							}
						};
					}
				};
			},
			getEntitySet: function() {
				return "STTA_C_MP_ProductText";
			},
			deactivateColumns: function() {
				return true;
			},
			getCustomData: function() {
				return [{
					getKey: function() {
						return "";
					},
					getValue: function() {
						return "";
					}
				}];
			}
		};
		oParentContext = {
			getProperty: function() {
				return true;
			}
		};
		aHiddenColumns = ["LanguageForEdit"];
		oSpy = sinon.spy(oSmartTable,"deactivateColumns");
		oStubForPrivate.fnHideSmartTableColumns(oSmartTable, oParentContext);
		assert.ok(oSpy.calledWithExactly(aHiddenColumns), "Hidden annotation contains boolean value");
		oSpy.restore();
	}); */


	QUnit.module("Different loading behaviour of subsections on Object Page", {
		beforeEach: fnCommonSetup,
		afterEach: fnCommonTeardown
	});

	function fnGetMockData(bLayoutFinished, bEnteredToViewPort, bStateApplied, bRebindCompleted, oSubSection) {
		var oLoadingStrategy = {};
		oLoadingStrategy.bWaitForViewportEnter = bEnteredToViewPort;
		oLoadingStrategy.waitFor = {
			bLayoutFinished: bLayoutFinished,
			bStateApplied: bStateApplied,
			bRebindCompleted: bRebindCompleted
		};
		var oInactiveSpy = oSandbox.spy(oLoadingStrategy, "inActiveHandler");
		var oActiveSpy = oSandbox.spy(oLoadingStrategy, "activeHandler");

		var oSmartTableMock = {
			getMetadata: function(){
				return {
					hasProperty: function(sProperty){
						return sProperty === "header" || sProperty === "headerLevel" || sProperty === "headerStyle";
					}
				};
			},
			getTable: function() {
				return {
					isA: function (){}
				};
			},
			getUseVariantManagement: function() {return true;},
			getParent: function() {return oSubSection;},
			getModel: function() {return oUnnamedModel;},
			getEntitySet: function (){},
			getCustomData: function() {return [];},
			getId: function(){return "SmartTableId";},
			getHeader: function(){return "Sample";},
			getHeaderLevel: function(){return "H5";},
			getHeaderStyle: function(){return "H5";},
			setHeader: function(){return;},
			setHeaderLevel: function(){return;},
			setHeaderStyle: function(){return;},
			setModel: function(oUnnamedModel) {return;},
			data: function (){},
			setNoData: Function.prototype,
			attachInitialise: Function.prototype,
			attachAfterVariantInitialise: Function.prototype,
			attachBeforeRebindTable: Function.prototype,
			getDataStateIndicator:Function.prototype
		};
		var oSmartTableInfoMock = {
			getControlAsync: sinon.stub().returns(Promise.resolve(oSmartTableMock)),
			getHiddenColumnInfo: sinon.stub().returns([]),
			getSearchFieldId: sinon.stub(),
			isSearchSupported: sinon.stub(),
			onSaveWithError: sinon.stub(),
			rebindTable: sinon.stub(),
			getControlStateWrapper: function() {
				return { setState: Function.prototype };
			}
		};
		var oSubSectionInfoMock = {
			getControlAsync: fnGetControlPromise.bind(null, oSubSection),
			getLoadingStrategy: sinon.stub().returns(oLoadingStrategy),
			refresh: Function.prototype,
			getId: sinon.stub().returns(oSubSection.getId()),
			getSettings: function() {
				return {
					additionalData: {
						facetId: ""
					}
				};
			}
		};
		oSandbox.stub(oTemplateUtils.oInfoObjectHandler, "setInformationWithControl", function(oControl) {
			if (oControl.getId() === "SmartTableId") {
				return oSmartTableInfoMock;
			}

			if (oControl.getId() === oSubSection.getId()) {
				return oSubSectionInfoMock;
			}
		});

		function fnGetControlPromise(oControl) {
			return Promise.resolve(oControl);
		}

		return {
			inActiveSpy: oInactiveSpy,
			activeSpy: oActiveSpy,
			loadingStrategy: oLoadingStrategy,
			smartTableMock: oSmartTableMock,
			subSectionInfoMock: oSubSectionInfoMock,
			smartTableInfoMock: oSmartTableInfoMock
		};
	}

	QUnit.test("Section having loadingBehavior waitForHeaderData and waitForViewportEnter true and entered into view port before header data", function(assert) {
		// preparation
		// onInit already called by fnCommonSetup
		// however, onTableInit still needs to be called
		var done = assert.async();

		var oSubSection = new ObjectPageSubSection({id:"lazyloadingAfterHeaderSubsection", blocks:new sap.m.Text({text:"Demo"})}); // third subSection overall, therefore not initially visible
		var oSection = new ObjectPageSection({id:"lazyloadingAfterHeaderSection"});
		oSection.addSubSection(oSubSection);
		oSubSection.getParent = function() {
			return oSection;
		}
		var oMockData = fnGetMockData(true, true, false, true, oSubSection);
		var fnOriginalById = oController.byId;
		oController.byId = sinon.stub().returns(oSubSection);
		oSandbox.stub(oTemplateUtils.oInfoObjectHandler, "executeForAllInformationObjects", function (sCategory, fnExecutionFunction){
			if (sCategory === "smartControl") {
				return fnExecutionFunction(oMockData.smartTableInfoMock);
			}

			if (sCategory === "subSection" || sCategory === "subSectionNotWaitingForViewPort") {
				return fnExecutionFunction(oMockData.subSectionInfoMock);
			}
		});

		oMethods.handlers.onTableInit({
			getSource: function() {
				return oMockData.smartTableMock;
			}
		});
		// bind OP
		oViewProxy.beforeRebind({then: function (callback) {
			callback.apply(null, arguments);
		}});

		oMockData.subSectionInfoMock.getControlAsync().then(function() {
			// Needs to be checked as execution is done only once control is assigned to InfoObject
			assert.ok(oMockData.inActiveSpy.calledOnce, "Binding for SubSection with SmartTable with VM is suspended");

			// subsection entered into viewport before receiving header data
			onSubSectionEnteredViewPort({
				getParameter: function (){return oSubSection;}
			});

			assert.ok(!oMockData.activeSpy.calledOnce, "Binding still suspended, subsection is entered into viewport but header data is not received");

			oViewProxy.applyState({});
		});

		oStubForPrivate.getStateAppliedPromise().then(function(){
			// ensure to do the check only after the execution itself
			setTimeout(function(){
				assert.ok(oMockData.activeSpy.calledOnce, "Header data has received and binding of subsection is activated");
				// ensure to do the check only after the execution itself
				setTimeout(function(){
					oSubSection.destroy();
					oSection.destroy();
					oController.byId = fnOriginalById;
					done();
				}, 0);
			}, 0);
		});
	});

	QUnit.test("Section having loadingBehavior waitForHeaderData and waitForViewportEnter true and entered into view port after header data", function(assert) {
		// preparation
		// onInit already called by fnCommonSetup
		// however, onTableInit still needs to be called
		var done = assert.async();
		var oSubSection = new ObjectPageSubSection({id:"lazyloadingAfterHeaderSubsection", blocks:new sap.m.Text({text:"Demo"})}); // third subSection overall, therefore not initially visible
		var oSection = new ObjectPageSection({id:"lazyloadingAfterHeaderSection"});
		oSection.addSubSection(oSubSection);
		oSubSection.getParent = function() {
			return oSection;
		}
		var oMockData = fnGetMockData(true, true, false, true, oSubSection);
		var fnOriginalById = oController.byId;
		oController.byId = sinon.stub().returns(oSubSection);
		oSandbox.stub(oTemplateUtils.oInfoObjectHandler, "executeForAllInformationObjects", function (sCategory, fnExecutionFunction){
			if (sCategory === "smartControl") {
				return fnExecutionFunction(oMockData.smartTableInfoMock);
			}

			if (sCategory === "subSection" || !oMockData.loadingStrategy.bWaitForViewportEnter) {
				return fnExecutionFunction(oMockData.subSectionInfoMock);
			}
		});

		oMethods.handlers.onTableInit({
			getSource: function() {
				return oMockData.smartTableMock;
			}
		});

		// bind OP
		oViewProxy.beforeRebind({then: function (callback) {
			callback.apply(null, arguments);
		}});

		oMockData.subSectionInfoMock.getControlAsync().then(function() {
			assert.ok(oMockData.inActiveSpy.calledOnce, "Binding for SubSection with SmartTable with VM is suspended");

			assert.ok(!oMockData.activeSpy.calledOnce, "Binding still suspended, Neither header data received nor subsection entered into view port");

			oViewProxy.applyState({});
		});

		oStubForPrivate.getStateAppliedPromise().then(function(){
			// ensure to do the check only after the execution itself
			setTimeout(function(){
				assert.ok(!oMockData.activeSpy.calledOnce, "Binding is still suspended,Header data has received but subsection did not enter into viewport");

				// subsection entered into viewport after receiving header data
				onSubSectionEnteredViewPort({
					getParameter: function (){return oSubSection;}
				});

				setTimeout(function(){
					assert.ok(oMockData.activeSpy.calledOnce, "Binding is activated, header data has received and subsection is also entered into viewport");
					oSubSection.destroy();
					oSection.destroy();
					oController.byId = fnOriginalById;
					done();
				}, 100);
			}, 0);
		});
	});

	QUnit.test("Section having loadingBehavior waitForHeaderData true and waitForViewportEnter false and entered into view port before header data", function(assert) {
		// preparation
		// onInit already called by fnCommonSetup
		// however, onTableInit still needs to be called
		var done = assert.async();
		var oSubSection = new ObjectPageSubSection({id:"activateAfterHeaderDataReceivedSubsection", blocks:new sap.m.Text({text:"Demo"})});
		var oSection = new ObjectPageSection({id:"activateAfterHeaderDataReceivedSection"});
		oSection.addSubSection(oSubSection);
		oSubSection.getParent = function() {
			return oSection;
		}
		var oMockData = fnGetMockData(true, false, false, true, oSubSection);
		var fnOriginalById = oController.byId;
		oController.byId = sinon.stub().returns(oSubSection);
		oSandbox.stub(oTemplateUtils.oInfoObjectHandler, "executeForAllInformationObjects", function (sCategory, fnExecutionFunction){
			if (sCategory === "smartControl") {
				return fnExecutionFunction(oMockData.smartTableInfoMock);
			}

			if (sCategory === "subSection" || !oMockData.loadingStrategy.bWaitForViewportEnter) {
				return fnExecutionFunction(oMockData.subSectionInfoMock);
			}
		});

		oMethods.handlers.onTableInit({
			getSource: function() {
				return oMockData.smartTableMock;
			}
		});
		// bind OP
		oViewProxy.beforeRebind({then: function (callback) {
			callback.apply(null, arguments);
		}});

		oMockData.subSectionInfoMock.getControlAsync(oSubSection).then(function() {
			assert.ok(oMockData.inActiveSpy.calledOnce, "Binding for SubSection with SmartTable with VM is suspended");

			// subsection entered into viewport after receiving header data
			onSubSectionEnteredViewPort({
				getParameter: function (){return oSubSection;}
			});

			assert.ok(!oMockData.activeSpy.calledOnce, "Binding still suspended, Although visible but waiting for header data");

			oViewProxy.applyState({});
		});

		oStubForPrivate.getStateAppliedPromise().then(function(){
			// ensure to do the check only after the execution itself
			setTimeout(function(){
				assert.ok(oMockData.activeSpy.calledOnce, "Binding is activated, when header data is received");
				setTimeout(function(){
					oSubSection.destroy();
					oSection.destroy();
					oController.byId = fnOriginalById;
					done();
				}, 0);
			}, 0);
		});
	});

	QUnit.test("Section having loadingBehavior waitForHeaderData false and waitForViewportEnter false and does not enter into view port", function(assert) {
		// preparation
		// onInit already called by fnCommonSetup
		// however, onTableInit still needs to be called
		var done = assert.async();
		var oSubSection = new ObjectPageSubSection({id:"activateWithBindingChangeSubsection", blocks:new sap.m.Text({text:"Demo"})});
		var oSection = new ObjectPageSection({id:"activateWithBindingChangeSection"});
		oSection.addSubSection(oSubSection);
		oSubSection.getParent = function() {
			return oSection;
		}
		var oMockData = fnGetMockData(false, false, false, true, oSubSection);
		var fnOriginalById = oController.byId;
		oController.byId = sinon.stub().returns(oSubSection);
		oSandbox.stub(oTemplateUtils.oInfoObjectHandler, "executeForAllInformationObjects", function (sCategory, fnExecutionFunction){
			if (sCategory === "smartControl") {
				return fnExecutionFunction(oMockData.smartTableInfoMock);
			}

			if (sCategory === "subSection" || !oMockData.loadingStrategy.bWaitForViewportEnter) {
				return fnExecutionFunction(oMockData.subSectionInfoMock);
			}
		});
		oMethods.handlers.onTableInit({
			getSource: function() {
				return oMockData.smartTableMock;
			}
		});

		// bind OP
		oViewProxy.beforeRebind({then: function (callback) {
			setTimeout(function () {callback.apply(null, arguments);}, 0);
		}});

		oMockData.subSectionInfoMock.getControlAsync().then(function() {
			assert.ok(oMockData.inActiveSpy.calledOnce, "Binding for SubSection with SmartTable with VM is suspended");
			oViewProxy.applyState({});

			setTimeout(function(){
				// As soon as the rebinding of OP is done, subsection's active handler should be called.
				assert.ok(oMockData.activeSpy.calledOnce, "Binding is activated, without header data received and without entering to viewport");
				setTimeout(function(){
					oSubSection.destroy();
					oSection.destroy();
					oController.byId = fnOriginalById;
					done();
				}, 0);
			}, 0);
		});
	});

	QUnit.test("Subsection title is not visible", function(assert) {
		var oTitle = new sap.ui.core.Title({ text: "Sample Title" });
		var oFormContainer = new sap.ui.layout.form.FormContainer({});
		oFormContainer.mAggregations.title = oTitle;
		var aFormContainers =[oFormContainer];
	
		var oForm = new sap.ui.layout.form.Form({});
	
		var oSmartForm = new sap.ui.comp.smartform.SmartForm({});

		oForm.mAggregations.formContainers = aFormContainers;

		oSmartForm.mAggregations.content = oForm;
	
		var oGrid = new sap.ui.layout.Grid({ content: [oSmartForm] });
	
		var oSubSection = new sap.uxap.ObjectPageSubSection({
			blocks: [oGrid],
			titleVisible: false
		});
	
		var oSection = new sap.uxap.ObjectPageSection({
			subSections: [oSubSection]
		});
	
		oObjectPage.getSections = function() {
			return [oSection];
		};
		
		var oSectionTitleHandler = new SectionTitleHandler(oController, oObjectPage);
		oSectionTitleHandler.adjustSubSectionTitle(oSubSection);
	
		var oTitle = oFormContainer.getTitle();
		assert.strictEqual(oTitle.getLevel(), "H4", "Title level has been adjusted to H4");
	
		oSmartForm.destroy();
		oGrid.destroy();
		oSubSection.destroy();
		oSection.destroy();
	});
	QUnit.test("Subsection title is visible", function(assert) {
		var oTitle = new sap.ui.core.Title({ text: "Sample Title" });
		var oFormContainer = new sap.ui.layout.form.FormContainer({});
		oFormContainer.mAggregations.title = oTitle;
		var aFormContainers = [oFormContainer];
	
		var oForm = new sap.ui.layout.form.Form({});
	
		var oSmartForm = new sap.ui.comp.smartform.SmartForm({});

		oForm.mAggregations.formContainers = aFormContainers;

		oSmartForm.mAggregations.content = oForm;
	
		var oGrid = new sap.ui.layout.Grid({ content: [oSmartForm] });
	
		var oSubSection = new sap.uxap.ObjectPageSubSection({
			blocks: [oGrid]
		});
		oSubSection.mAggregations.titleVisible = true;
	
		var oSection = new sap.uxap.ObjectPageSection({
			subSections: [oSubSection]
		});
	
		oObjectPage.getSections = function() {
			return [oSection];
		};
		
		var oSectionTitleHandler = new SectionTitleHandler(oController, oObjectPage);
		oSectionTitleHandler.adjustSubSectionTitle(oSubSection);
	
		var oTitle = oFormContainer.getTitle();
		assert.strictEqual(oTitle.getLevel(), "Auto", "Title level has not been changed");
	
		oSmartForm.destroy();
		oGrid.destroy();
		oSubSection.destroy();
		oSection.destroy();
	});
	

	QUnit.test("Table with VM in Section, state applied before ViewPort entered", function(assert) {
		// preparation
		// onInit already called by fnCommonSetup
		// however, onTableInit still needs to be called
		var done = assert.async();
		var oSubSection = new ObjectPageSubSection({id:"secondSectionIdThirdSubSection", blocks:new sap.m.Text({text:"Demo"})}); // third subSection overall, therefore not initially visible
		var oSection = new ObjectPageSection({id:"secondSectionIdThirdSection"});
		oSection.addSubSection(oSubSection);
		oSubSection.getParent = function() {
			return oSection;
		}
		var oMockData = fnGetMockData(false, true, false, true, oSubSection);
		var fnOriginalById = oController.byId;
		oController.byId = sinon.stub().returns(oSubSection);
		oSandbox.stub(oTemplateUtils.oInfoObjectHandler, "executeForAllInformationObjects", function (sCategory, fnExecutionFunction){
			if (sCategory === "smartControl") {
				return fnExecutionFunction(oMockData.smartTableInfoMock);
			}

			if (sCategory === "subSection") {
				return fnExecutionFunction(oMockData.subSectionInfoMock);
			}
		});
		oMethods.handlers.onTableInit({
			getSource: function() {
				return oMockData.smartTableMock;
			}
		});
		// bind OP
		oViewProxy.beforeRebind({then: function (callback) {
			callback.apply(null, arguments);
		}});

		oMockData.subSectionInfoMock.getControlAsync().then(function() {
			assert.ok(oMockData.inActiveSpy.calledOnce, "Binding for SubSection with SmartTable with VM is suspended");
			oViewProxy.applyState({});
		});

		oStubForPrivate.getStateAppliedPromise().then(function(){
			// ensure to do the check only after the execution itself
			setTimeout(function(){
				assert.ok(!oMockData.activeSpy.calledOnce, "Binding still suspended, when state applied, but viewport not yet entered");

				onSubSectionEnteredViewPort({
					getParameter: function (){return oSubSection;}
				});

				assert.ok(oMockData.activeSpy.calledOnce, "Subsection enters into viewPort and activates binding of subsection");
				// ensure to do the check only after the execution itself
				setTimeout(function(){
					oSubSection.destroy();
					oSection.destroy();
					oController.byId = fnOriginalById;
					done();
				}, 0);
			}, 0);
		});
	});

	QUnit.test("Table with VM in Section, viewport entered before state applied", function(assert) {
		// preparation
		// onInit already called by fnCommonSetup
		// however, onTableInit still needs to be called
		var done = assert.async();
		var oSubSection = new ObjectPageSubSection({id:"secondSectionIdSecondSubSection1", blocks:new sap.m.Text({text:"Demo"})}); // third subSection overall, therefore not initially visible
		var oSection = new ObjectPageSection({id:"secondSectionIdSecondSection1"});
		oSection.addSubSection(oSubSection);
		oSubSection.getParent = function() {
			return oSection;
		}
		var oMockData = fnGetMockData(false, true, true, false, oSubSection);
		var fnOriginalById = oController.byId;
		oController.byId = sinon.stub().returns(oSubSection);
		oSandbox.stub(oTemplateUtils.oInfoObjectHandler, "executeForAllInformationObjects", function (sCategory, fnExecutionFunction){
			if (sCategory === "smartControl") {
				return fnExecutionFunction(oMockData.smartTableInfoMock);
			}

			if (sCategory === "subSection") {
				return fnExecutionFunction(oMockData.subSectionInfoMock);
			}
		});

		oMethods.handlers.onTableInit({
			getSource: function() {
				return oMockData.smartTableMock;
			}
		});

		// bind OP
		oViewProxy.beforeRebind({then: function (callback) {
			callback.apply(null, arguments);
		}});

		oMockData.subSectionInfoMock.getControlAsync().then(function() {
			assert.ok(oMockData.inActiveSpy.calledOnce, "Binding for SubSection with SmartTable with VM is suspended");

			onSubSectionEnteredViewPort({
				getParameter: function (){return oSubSection;}
			});

			assert.ok(!oMockData.activeSpy.calledOnce, "Waiting for flag bStateApplied to be set");

			// ensure to do the check only after the execution itself
		setTimeout(function(){
			assert.ok(!oMockData.activeSpy.calledOnce, "Binding still suspended, when ViewPort entered, but state not yet applied");
			// state is applied and flag bStateApplied is set.
			oViewProxy.applyState({});
			oStubForPrivate.getStateAppliedPromise().then(function(){
				// ensure to do the check only after the execution itself

				setTimeout(function(){
					// this is simulation of function _triggerVisibleSubSectionsEvents. This function triggers subSectionEnteredViewPort Event
					// for the currently visible subsection, which we are doing here manually
					onSubSectionEnteredViewPort({
						getParameter: function (){return oSubSection;}
					});
					assert.ok(oMockData.activeSpy.calledOnce, "Binding for SubSection with SmartTable with VM is restored");
					oSubSection.destroy();
					oSection.destroy();
					oController.byId = fnOriginalById;
					done();
				}, 0);
			});
		}, 0);
		});
	});

	QUnit.module("Functions related to side effects", {
		beforeEach: fnCommonSetup,
		afterEach: fnCommonTeardown
	});


	QUnit.module("Sub-section initialization", {
		beforeEach: fnCommonSetup,
		afterEach: fnCommonTeardown
	});

	QUnit.test("The embedded components in the sub sections should be initialized", function(assert){
		// Setup
		var oControllerMethods = ControllerImplementation.getMethods(oViewProxy, oTemplateUtils, oController);
		fnTearDownCallbackStubs();
		fnISetupCallbackStubs();
		oTemplateUtils.oInfoObjectHandler.initializeSubSectionInfoObject = sinon.stub().returns({});
		var oInitializationParam = {
			additionalData: {
				facetId: "MalfunctionInformation::Section"
			},
			id: "attachmentReuseComponent::simple::Attachments::ComponentSubSection",
			loadingStrategy: "reuseComponent"
		};
		// Execution
		oControllerMethods.onInit();
		// Assertion
		assert.ok(oTemplateUtils.oInfoObjectHandler.initializeSubSectionInfoObject.calledOnce, "InfoObjectHandler.initializeSubSectionInfoObject should be called once");
		assert.ok(oTemplateUtils.oInfoObjectHandler.initializeSubSectionInfoObject.calledWithExactly(oInitializationParam), "Checking the parameters of InfoObjectHandler.initializeSubSectionInfoObject");
		// Resetting the stub
		oTemplateUtils.oInfoObjectHandler.initializeSubSectionInfoObject = Function.prototype;
	});

	QUnit.module("Proper handling of SubSectionEntered event", {
		beforeEach: fnCommonSetup,
		afterEach: fnCommonTeardown
	});

	QUnit.test("SubSectionEntered event handler should be executed only when the Object Page rebind has completed", function(assert){
		//calls oViewProxy.afterRebind() to mimic the execution of fnRebindHeaderData
		//calls oViewProxy.beforeRebind() to set the oWaitForState.bRebindCompleted to true and continue normal execution
		var oSubSection = new ObjectPageSubSection({id:"subSectionWaitForRendering", blocks:new sap.m.Text({text:"Demo"})});
		var oSpy = sinon.spy(oViewProxy.oController, "onSubSectionEnteredExtension");
		var oStub = sinon.stub(oObjectPage, "_triggerVisibleSubSectionsEvents", function() {
			onSubSectionEnteredViewPort({
				getParameter: function(){ return oSubSection;}
			});
		});
		oViewProxy.afterRebind();
		assert.notOk(oSpy.calledOnce, "onSubSectionEnteredExtension should not be called before rebind has completed");
		oViewProxy.beforeRebind({then: function (callback) {
			callback.apply(null, arguments);
		}});
		assert.ok(oSpy.calledOnce, "onSubSectionEnteredExtension should be called only after rebind has completed");
		oSpy.restore();
		oStub.restore();
	});
});
