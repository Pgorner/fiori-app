QUnit.config.testTimeout = 30000

sap.ui.define(
	[
		"testUtils/sinonEnhanced",
		"sap/ui/core/library",
		"sap/suite/ui/generic/template/lib/MessageUtils",
		"sap/ui/core/message/Message",
		"sap/ui/core/message/MessageType",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/Fragment",
		"sap/ui/events/KeyCodes"
	],
	function (sinon, coreLibrary, MessageUtils, Message, MessageType, JSONModel, Fragment, KeyCodes) {
		"use strict";

		var ValueState = coreLibrary.ValueState,
			oTemplateContract,
			oDialog;

		function getTemplateContract() {
			return {
				oApplicationProxy: {
					isTransientMessageNoCustomMessage: sinon
						.stub()
						.returns(true),
					getDialogFragmentAsync: undefined, // should be impl. in specific test
				},
				getText: sinon.spy(function (i18nKey) {
					return "key-" + i18nKey;
				}),
			};
		}

		function addTransientMessage(message, processor) {
			sap.ui
				.getCore()
				.getMessageManager()
				.addMessages(
					new Message({
						message,
						description: message + " Description",
						type: MessageType.Warning,
						processor: processor,
						persistent: true,
					})
				);
		}

		QUnit.module("Basic tests");

		QUnit.test(
			"has method validation: getSeverityIconFromIconPool",
			function (assert) {
				var Icon, messageType;

				messageType = ValueState.Error;
				Icon = MessageUtils.getSeverityIconFromIconPool(messageType);
				assert.equal(
					Icon,
					"sap-icon://error",
					"Function should returned 'sap-icon://error' value"
				);

				messageType = ValueState.Warning;
				Icon = MessageUtils.getSeverityIconFromIconPool(messageType);
				assert.equal(
					Icon,
					"sap-icon://alert",
					"Function should returned 'sap-icon://alert' value"
				);
			}
		);

		QUnit.test("has method validation: getIconColor", function (assert) {
			var IconColor, messageType;

			messageType = ValueState.Error;
			IconColor = MessageUtils.getIconColor(messageType);
			assert.equal(
				IconColor,
				"Negative",
				"Function should returned Negative value"
			);

			messageType = ValueState.Warning;
			IconColor = MessageUtils.getIconColor(messageType);
			assert.equal(
				IconColor,
				"Critical",
				"Function should returned Critical value"
			);
		});

		QUnit.module("fnHandleTransientMessages", {
			beforeEach: function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				oTemplateContract = getTemplateContract();
			},
			afterEach: function () {
				sinon.restore();
				sap.ui.getCore().getMessageManager().removeAllMessages();
				if (oDialog) {
					oDialog.destroy();
					oDialog = undefined;
				}
			},
		});

		[
			{
				message: "close oDialog with ESC button",
				closeFunc: function(oDialogFragment) {
					var esc = jQuery.Event("keydown", { keyCode: 27 });
					jQuery(oDialogFragment.getDomRef()).trigger(esc);
				}
			},
			{
				message: "close oDialog with close() method",
				closeFunc: function(oDialogFragment) {
					oDialogFragment.close();
				}
			},
			{
				message: "close oDialog with close button",
				closeFunc: function(oDialogFragment) {
					oDialogFragment.getButtons()[1].firePress();
				}
			}
		].forEach(function (entry) {
			QUnit.test(entry.message, function(assert) {
				// prepare
				var processor = new JSONModel(),
					oMessageViewSpy,
					oModelSpy,
					done = assert.async();
				addTransientMessage("message01", processor);
				oTemplateContract.oApplicationProxy.getDialogFragmentAsync = sinon.spy(function( sName, oFragmentController, sModel, fnOnFragmentCreated) {
					return Fragment.load({ id: "someId", name: sName, controller: oFragmentController, type: "XML", }).then(function(oFragment) {
						if (sModel) {
							var oModel = new JSONModel();
							oModelSpy = {
								setProperty: sinon.spy(oModel, "setProperty"),
								getProperty: sinon.spy(oModel, "getProperty"),
							}
							oFragment.setModel(oModel, sModel);
						}
						oDialog = oFragment;
						oMessageViewSpy = {
							navigateBack: sinon.spy(oDialog.getContent()[0], "navigateBack"),
							setAsyncURLHandler: sinon.spy(oDialog.getContent()[0], "setAsyncURLHandler")
						}
						return oFragment;
					});
				});

				// execute
				MessageUtils.handleTransientMessages(oTemplateContract)
					.then(function () {
						// validate
						assert.ok(oTemplateContract.oApplicationProxy.isTransientMessageNoCustomMessage.called, "oTemplateContract.oApplicationProxy.isTransientMessageNoCustomMessage was called");
						assert.ok(oTemplateContract.oApplicationProxy.getDialogFragmentAsync.calledOnce, "oTemplateContract.oApplicationProxy.getDialogFragmentAsync was called");
						assert.ok(oTemplateContract.oApplicationProxy.getDialogFragmentAsync.calledWith("sap.suite.ui.generic.template.fragments.MessageDialog"), "oTemplateContract.oApplicationProxy.getDialogFragmentAsync loaded 'sap.suite.ui.generic.template.fragments.MessageDialog' fragment");

						// check if fnDialogClose get called
						assert.ok(oModelSpy.setProperty.getCall(oModelSpy.setProperty.callCount - 3).calledWithExactly("/backButtonVisible", false), "oSettingModel.setProperty(\"/backButtonVisible\", false) was called");
						assert.ok(oModelSpy.setProperty.getCall(oModelSpy.setProperty.callCount - 2).calledWithExactly("/messages", []), "oSettingModel.setProperty(\"/messages\", []) was called");
						assert.ok(oModelSpy.setProperty.getCall(oModelSpy.setProperty.callCount - 1).calledWithExactly("/messageToGroupName", Object.create(null)), "oSettingModel.setProperty(\"/messageToGroupName\", Object.create(null)) was called");
						assert.ok(oMessageViewSpy.navigateBack.calledOnce, "oMessageView.navigateBack() was called");
						assert.ok(oMessageViewSpy.setAsyncURLHandler.calledOnce, "oMessageView.setAsyncURLHandler was called");
						assert.ok(oModelSpy.getProperty.getCall(oModelSpy.getProperty.callCount - 1).calledWithExactly("/resolve"), "oSettingModel.getProperty(\"/resolve\") was called");
						done();
					});

				setTimeout(function () {
					if (oDialog) {
						entry.closeFunc(oDialog);
					} else {
						assert.ok(false, "oDialog is missing. Increase timeout");
					}
				}, 100);
			});
		});
	}
);
