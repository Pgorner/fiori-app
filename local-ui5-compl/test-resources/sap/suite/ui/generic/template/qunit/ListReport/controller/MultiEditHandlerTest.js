/**
 * tests for the sap.suite.ui.generic.template.ListReport.controller.MultiEditHandler.js
 */
sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/ListReport/controller/MultiEditHandler",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/lib/MessageUtils",
	"sap/m/MessageBox"],
	function(sinon, MultiEditHandler, testableHelper, MessageUtils, MessageBox) {
	"use strict";

	// Variables defined (but not necessarily initialized) in global closure:
	// 1. global test objects (same for all tests)
	var oSandbox;
	var oStubForPrivate;

	// 2. SUT. Can be the same or different ones for different modules 
	var oMultiEditHandler;
	
	// 3. parameters needed for creation of SUT (including static dependencies)
	var oState;
	var oController;
	var oTemplateUtils;
	
	// 4. anything that needs to retrieved from these parameters and has a static nature (i.e. is correct to be retrieved already during constructor of SUT)
	// typical example (getOwnerComponent is of static nature in FE context), although usage in multiEditHAndler is rather questionable - here using oState.oMultipleViewsHandler
	// would be better
	var oComponent;

	QUnit.module("MultiEditHandler constructor", {}, function(){
		QUnit.test("MultiEditHandler instance creation", function(assert) {
			try {
				// act
				var oMultiEditHandler = new MultiEditHandler(undefined, undefined, {});	

				// assert
				assert.ok(oMultiEditHandler, "oMultiEditHandler instance creation was successfull");
			} catch (oError) {
				assert.notOk(oError, "oMultiEditHandler instance creation was not successfull");
			}
		});
	});


	QUnit.module("MultiEditHandler", {
		beforeEach: function() {
			// initialize global test objects
			oSandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			
			// initialize objects already used/usable in constructor
			oState = Object.create(null);
			oController = Object.create(null);
			oTemplateUtils = {
					oCommonUtils: Object.create(null),
					oComponentUtils: Object.create(null),
					oServices: {
						oCRUDManager: Object.create(null)
					}
			};

			oComponent = Object.create(null);
			oSandbox.stub(oController, "getOwnerComponent").returns(oComponent);

			// initialize SUT
			oMultiEditHandler = new MultiEditHandler(oState, oController, oTemplateUtils);	
		},
		afterEach: function() {
			testableHelper.endTest();
			oSandbox.restore();
		}
	}, function(){

		function fnCommonArrange(aContexts){
			var oContainer = {
					resetContainer: Function.prototype,
					setContexts: Function.prototype
			};
			
			var oDialog = {
					setModel: Function.prototype,
					getContent: function() {
						return [oContainer];
					},
					setVisible: Function.prototype
			};

			oSandbox.stub(oController, "byId").withArgs("template:::ListReportAction:::MultiEditDialog").returns(oDialog);
			
			oState.oPresentationControlHandler = Object.create(null);
			oSandbox.stub(oState.oPresentationControlHandler, "getSelectedContexts").returns(aContexts);
			oSandbox.stub(oState.oPresentationControlHandler, "getEntitySet").returns("EntitySetName");

			var oVariantSettings = {
				quickVariantSelectionX: {
					variants: {}
				}
			};

			oSandbox.stub(oTemplateUtils.oComponentUtils, "getSettings").returns(oVariantSettings);
			oSandbox.stub(oTemplateUtils.oComponentUtils, "getViewExtensions");
			
			oSandbox.stub(oComponent, "getTableSettings").returns({
				multiEdit: {
					annotationPath:"namespace#testPath"
				}
			});

			return {
				oContainer: oContainer,
				oDialog: oDialog,
				oDialogOpenSpy: oSandbox.spy(oDialog, "open"),
				oContextEditableStub: oSandbox.stub(oTemplateUtils.oCommonUtils, "isContextEditable").returns(true),
				oGetTextStub: oSandbox.stub(oTemplateUtils.oCommonUtils, "getText").returns("Edit Object"),
				oSetContextSpy: oSandbox.spy(oContainer, "setContexts")
			};
		}
		
		QUnit.test("Check if Multi Edit is Possible where all the selected context is Updatable", function(assert) {
			var aContexts = [{ getPath: function() { return "/ProductType(SalesOrderItem = '10')"; }, sPath:"/ProductType()", getProperty: function() { return "10"; }}];					
			var oArrangement = fnCommonArrange(aContexts);

			oMultiEditHandler.onMultiEditButtonPress();

			assert.ok(oArrangement.oDialogOpenSpy.calledOnce, "MultiEdit Dialog is open successfully");
		});

		QUnit.test("Multi Edit with updatable and non-updatable context: warning shown", function(assert) {
			var aContexts = [{x: "1"}, {x: "2"}]; // content of contexts doesn't matter, they only need to be different to allow usage of withArgs
			var oArrangement = fnCommonArrange(aContexts);
			oArrangement.oContextEditableStub.withArgs(aContexts[1]).returns(false);
			oArrangement.oGetTextStub.withArgs("EDIT_REMAINING", [1,2,1]).returns("Warning title");
			oArrangement.oGetTextStub.withArgs("MULTI_EDIT").returns("edit button");
			oArrangement.oGetTextStub.withArgs("CANCEL").returns("cancel button");
			var oMessageBoxSpy = oSandbox.stub(MessageBox, "warning");

			oMultiEditHandler.onMultiEditButtonPress();

			assert.ok(oMessageBoxSpy.calledWithMatch("Warning title", {actions: ["edit button", "cancel button"]}), "Warning shown");
		});

		QUnit.test("Multi Edit with updatable and non-updatable context, user cancellation", function(assert) {
			var aContexts = [{x: "1"}, {x: "2"}]; // content of contexts doesn't matter, they only need to be different to allow usage of withArgs
			var oArrangement = fnCommonArrange(aContexts);
			oArrangement.oContextEditableStub.withArgs(aContexts[1]).returns(false);
			oSandbox.stub(MessageBox, "warning", function(sText, oMessageBoxModel){
				oMessageBoxModel.onClose(oMessageBoxModel.actions[1]); // user chooses to cancel
			});
			oArrangement.oGetTextStub.withArgs("MULTI_EDIT").returns("edit button"); // messageBox relies on different texts to distinguish buttons!
			oArrangement.oGetTextStub.withArgs("CANCEL").returns("cancel button");

			oMultiEditHandler.onMultiEditButtonPress();

			assert.ok(oArrangement.oDialogOpenSpy.notCalled, "Multiedit dialog not opened when user cancels warning");
		});

		QUnit.test("Multi Edit with updatable and non-updatable context, user continues", function(assert) {
			var aContexts = [{x: "1"}, {x: "2"}]; // content of contexts doesn't matter, they only need to be different to allow usage of withArgs
			var oArrangement = fnCommonArrange(aContexts);
			oArrangement.oContextEditableStub.withArgs(aContexts[1]).returns(false);
			oSandbox.stub(MessageBox, "warning", function(sText, oMessageBoxModel){
				oMessageBoxModel.onClose(oMessageBoxModel.actions[0]); // user chooses to edit
			});
			oArrangement.oGetTextStub.withArgs("MULTI_EDIT").returns("edit button"); // messageBox relies on different texts to distinguish buttons!
			oArrangement.oGetTextStub.withArgs("CANCEL").returns("cancel button");
			
			oMultiEditHandler.onMultiEditButtonPress();
			
			assert.ok(oArrangement.oDialogOpenSpy.called, "Multiedit dialog opened when user continues");
			assert.ok(oArrangement.oSetContextSpy.calledWith([aContexts[0]]), "Only the updatable context is provided to MultiEditContainer");
		});
		

		QUnit.test("Check if fnOnSaveMultiEditDialog is called", function(assert) {
			// Remark: This test just tests the most simple straightforward case to run through. The fact, that this needs such a huge arrangement already shows, that the complexity
			// of the productive code is much to high and ideally should be refactored.
			var oArrangement = fnCommonArrange([]);
			var oEvent = {
					getSource: function() {
						return {
							getParent: function(){
								return oArrangement.oDialog;
							}
						};
					}
			};
			var oField = {
					isKeepExistingSelected: Function.prototype,
					getPropertyName: Function.prototype,
					getUnitOfMeasurePropertyName: Function.prototype,
					isComposite: Function.prototype
			};
			var oContext = {
					data: Object.create(null),
					context: {
						getPath: Function.prototype
					}
			};
			oSandbox.stub(oArrangement.oContainer, "getErroneousFieldsAndTokens").returns(Promise.resolve([]));
			oSandbox.stub(oArrangement.oContainer, "getAllUpdatedContexts").returns(Promise.resolve([oContext]));
			oSandbox.stub(oArrangement.oContainer, "getFields").returns([oField]);
			oSandbox.stub(oController, "beforeMultiEditSaveExtension");
			oSandbox.stub(oArrangement.oDialog, "close");
			// Several asynchronous steps not returning any result (as a Promise), thus attach to the last step being called
			// Could be improved for better test result if one of the steps fails (currently, the test would just wait forever)
			var fnExecutionResolve;
			var oExecutionPromise = new Promise(function(resolve){
				fnExecutionResolve = resolve;
			});
			var oUpdatePromise = Promise.resolve([oContext]);
			oSandbox.stub(oTemplateUtils.oServices.oCRUDManager, "updateMultipleEntities", function(){
				// resolve execution promise only after this (last) step has been executed
				setTimeout(fnExecutionResolve);
				return oUpdatePromise;
			});
			oSandbox.stub(oState.oPresentationControlHandler, "refresh");
			var oShowSuccessMessageSpy = oSandbox.stub(MessageUtils, "showSuccessMessageIfRequired");
			// testing asynchronous execution
			var done = assert.async();
			
			oStubForPrivate.fnOnSaveMultiEditDialog(oEvent);
			
			oExecutionPromise.then(function(){
				assert.ok(oShowSuccessMessageSpy.called, "Contexts updated from MultiEdit dialog");
				done();
			});
		});

	});

});