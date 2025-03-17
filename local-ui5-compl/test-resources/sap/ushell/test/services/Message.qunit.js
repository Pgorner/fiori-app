// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.Message
 * @deprecated since 1.120
 */
sap.ui.define([
    "sap/base/Log",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/MessageBox",
    "sap/m/library",
    "sap/m/Text",
    "sap/ui/core/library",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/resources",
    "sap/ushell/services/Message"
], function (
    Log,
    Button,
    Dialog,
    MessageBox,
    mobileLibrary,
    Text,
    coreLibrary,
    Config,
    Container,
    resources,
    Message
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    // shortcut for sap.m.DialogType
    var DialogType = mobileLibrary.DialogType;

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    // shortcut for sap.m.FlexRendertype
    var FlexRendertype = mobileLibrary.FlexRendertype;

    QUnit.module("init", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    return Container.getServiceAsync("Message").then(function (oMessageService) {
                        this.oMessage = oMessageService;
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            Container.reset();
            sandbox.restore();
        }
    });

    QUnit.test("returns instance of MessageService", function (assert) {
        // Act
        var oMessageInstance = this.oMessage.init();

        // Assert
        assert.ok(oMessageInstance instanceof Message, "instance returned");
    });

    QUnit.module("show", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    return Container.getServiceAsync("Message").then(function (oMessageService) {
                        this.oMessage = oMessageService;
                        this.oBuildMessageStub = sandbox.stub(this.oMessage, "buildMessage");
                        sandbox.stub(Log, "error");
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            Container.reset();
            sandbox.restore();
        }
    });

    QUnit.test("throws an error when no message is provided", function (assert) {
        // Act
        this.oMessage.show();

        // Assert
        assert.strictEqual(Log.error.called, true, "Log.error was called");
        assert.strictEqual(this.oBuildMessageStub.called, false, "buildMessage was not called");
    });

    QUnit.test("uses callback function configured in init when available", function (assert) {
        // Arrange
        var oCallback = sandbox.stub();
        this.oMessage.init(oCallback);

        // Act
        this.oMessage.show(0, "Some foo message", null);

        // Assert
        assert.strictEqual(Log.error.called, false, "Log.error was not called");
        assert.strictEqual(oCallback.called, true, "Callback was called");
        assert.strictEqual(this.oBuildMessageStub.called, false, "buildMessage was not called");
    });

    QUnit.test("uses buildMessage method when no callback is configured", function (assert) {
        // Act
        this.oMessage.show(0, "Some foo message", null);

        // Assert
        assert.strictEqual(Log.error.called, false, "Log.error was not called");
        assert.strictEqual(this.oBuildMessageStub.called, true, "buildMessage was called");
    });

    QUnit.module("buildMessage", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    return Container.getServiceAsync("Message").then(function (oMessageService) {
                        this.oMessage = oMessageService;
                        this.oSendMessageBoxStub = sandbox.stub(this.oMessage, "sendMessageBox");
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            Container.reset();
            sandbox.restore();
        }
    });

    QUnit.test("defaults to a generic message when no type is provided", function (assert) {
        // Arrange
        var aExpectedParameters = ["TestMessage", "show", { duration: 3000 }];

        // Act
        this.oMessage.buildMessage(null, "TestMessage", {});

        // Assert
        assert.strictEqual(this.oSendMessageBoxStub.called, true, "sendMessageBox was called");
        assert.deepEqual(this.oSendMessageBoxStub.args[0], aExpectedParameters,
            "sendMessageBox was called with the correct parameters");
    });

    QUnit.test("defaults to a generic message when no type is provided but Parameters are provided", function (assert) {
        // Arrange
        var aExpectedParameters = ["TestMessage", "show", { duration: 1234 }];

        // Act
        this.oMessage.buildMessage(null, "TestMessage", {
            duration: 1234,
            details: "FooBar" // Should NOT be considered!
        });

        // Assert
        assert.strictEqual(this.oSendMessageBoxStub.called, true, "sendMessageBox was called");
        assert.deepEqual(this.oSendMessageBoxStub.args[0], aExpectedParameters,
            "sendMessageBox was called with the correct parameters");
    });

    QUnit.test("confirm MessageBox is shown when no actions and MessageType CONFIRM are provided", function (assert) {
        // Arrange
        var aExpectedParameters = ["TestMessage", "confirm", {
            actions: undefined,
            title: undefined,
            onClose: undefined,
            details: "FooBar",
            emphasizedAction: undefined
        }];

        // Act
        this.oMessage.buildMessage(2, "TestMessage", {
            details: "FooBar"
        });

        // Assert
        assert.strictEqual(this.oSendMessageBoxStub.called, true, "sendMessageBox was called");
        assert.deepEqual(this.oSendMessageBoxStub.args[0], aExpectedParameters,
            "sendMessageBox was called with the correct parameters");
    });

    QUnit.test("confirm MessageBox is not shown when actions and MessageType CONFIRM are provided", function (assert) {
        // Arrange
        var aExpectedParameters = ["TestMessage", "show", {
            actions: ["Some", "FakeActions"],
            title: undefined,
            onClose: undefined,
            icon: "QUESTION",
            details: "FooBar",
            emphasizedAction: undefined
        }];

        // Act
        this.oMessage.buildMessage(2, "TestMessage", {
            details: "FooBar",
            actions: ["Some", "FakeActions"]
        });

        // Assert
        assert.strictEqual(this.oSendMessageBoxStub.called, true, "sendMessageBox was called");
        assert.deepEqual(this.oSendMessageBoxStub.args[0], aExpectedParameters,
            "sendMessageBox was called with the correct parameters");
    });

    QUnit.test("warning MessageBox is shown when MessageType CONFIRM and a Delete action are provided", function (assert) {
        // Arrange
        var aExpectedParameters = ["TestMessage", "warning", {
            actions: ["DELETE"],
            title: undefined,
            onClose: undefined,
            details: undefined,
            emphasizedAction: "DELETE"
        }];

        //Act
        this.oMessage.buildMessage(2, "TestMessage", {
            actions: ["DELETE"]
        });

        //Assert
        assert.strictEqual(this.oSendMessageBoxStub.called, true, "sendMessageBox was called");
        assert.deepEqual(this.oSendMessageBoxStub.args[0], aExpectedParameters,
            "sendMessageBox was called with the correct parameters");
    });

    QUnit.module("_copyToClipboard", {
        beforeEach: function () {
            this.oExecCommandStub = sandbox.stub(document, "execCommand");
            return Container.init("local")
                .then(function () {
                    return Container.getServiceAsync("Message").then(function (oMessageService) {
                        this.oMessage = oMessageService;
                        this.oBuildAndSendMessageToastStub = sandbox.stub(this.oMessage, "buildAndSendMessageToast");
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            Container.reset();
            sandbox.restore();
        }
    });

    QUnit.test("execCommand with argument \"copy\" is called", function (assert) {
        // Act
        this.oMessage._copyToClipboard("someMessage", {}, "someTitle");

        // Assert
        assert.strictEqual(this.oExecCommandStub.callCount, 1, "execCommand was called.");
        assert.deepEqual(this.oExecCommandStub.args[0], ["copy"], "execCommand was called with the \"copy\" argument.");
    });

    QUnit.test("MessageTost is shown", function (assert) {
        // Act
        this.oMessage._copyToClipboard("someMessage", {
            details: {
                errorCode: "666",
                errorDetails: "someDetails"
            }
        }, "someTitle");

        // Assert
        assert.strictEqual(this.oBuildAndSendMessageToastStub.callCount, 1, "buildAndSendMessageToast function was called.");
    });

    QUnit.module("_createAndOpenErrorDialog", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oDialogAddButtonStub = sandbox.stub(Dialog.prototype, "addButton");
            this.oDialogOpenStub = sandbox.stub(Dialog.prototype, "open");
            return Container.init("local")
                .then(function () {
                    return Container.getServiceAsync("Message").then(function (oMessageService) {
                        this.oMessage = oMessageService;
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            Container.reset();
            sandbox.restore();
        }
    });

    QUnit.test("correctly enriches the Dialog when Contact Support is disabled and no details are given", function (assert) {
        // Arrange
        var oExpected = {
            buttons: [
                resources.i18n.getText("CopyToClipboardBtn"),
                resources.i18n.getText("closeBtn")
            ],
            buttonTypes: [
                ButtonType.Default,
                ButtonType.Emphasized
            ]
        };

        this.oConfigLastStub.withArgs("/core/extension/SupportTicket").returns(false);

        // Act
        this.oMessage._createAndOpenErrorDialog("TestMessage", {});

        // Assert
        var index = 0;

        assert.strictEqual(this.oDialogAddButtonStub.callCount, oExpected.buttons.length,
            "added exactly " + oExpected.buttons.length + " buttons");

        for (; index < oExpected.buttons.length; index++) {
            assert.strictEqual(this.oDialogAddButtonStub.args[index][0].getText(), oExpected.buttons[index],
                "button: " + oExpected.buttons[index] + " is placed correctly");
            assert.strictEqual(this.oDialogAddButtonStub.args[index][0].getType(), oExpected.buttonTypes[index],
                "button: " + oExpected.buttons[index] + " has the correct type"
            );
        }
    });

    QUnit.test("correctly enriches the Dialog when Contact Support is disabled and details are given", function (assert) {
        // Arrange
        var oExpected = {
            buttons: [
                resources.i18n.getText("CopyToClipboardBtn"),
                resources.i18n.getText("closeBtn")
            ],
            buttonTypes: [
                ButtonType.Default,
                ButtonType.Emphasized
            ]
        };

        this.oConfigLastStub.withArgs("/core/extension/SupportTicket").returns(false);

        // Act
        this.oMessage._createAndOpenErrorDialog("TestMessage", {
            details: "TestDetails"
        });

        // Assert
        var index = 0;

        assert.strictEqual(this.oDialogAddButtonStub.callCount, oExpected.buttons.length,
            "added exactly " + oExpected.buttons.length + " buttons");

        for (; index < oExpected.buttons.length; index++) {
            assert.strictEqual(this.oDialogAddButtonStub.args[index][0].getText(), oExpected.buttons[index],
                "button: " + oExpected.buttons[index] + " is placed correctly");
            assert.strictEqual(this.oDialogAddButtonStub.args[index][0].getType(), oExpected.buttonTypes[index],
                "button: " + oExpected.buttons[index] + " has the correct type"
            );
        }
    });

    QUnit.test("correctly enriches the Dialog when Contact Support is enabled and details are not given", function (assert) {
        // Arrange
        var oExpected = {
            buttons: [
                resources.i18n.getText("contactSupportBtn"),
                resources.i18n.getText("CopyToClipboardBtn"),
                resources.i18n.getText("closeBtn")
            ],
            buttonTypes: [
                ButtonType.Default,
                ButtonType.Default,
                ButtonType.Emphasized
            ]
        };

        this.oConfigLastStub.withArgs("/core/extension/SupportTicket").returns(true);

        // Act
        this.oMessage._createAndOpenErrorDialog("TestMessage", {});

        // Assert
        var index = 0;

        assert.strictEqual(this.oDialogAddButtonStub.callCount, oExpected.buttons.length,
            "added exactly " + oExpected.buttons.length + " buttons");

        for (; index < oExpected.buttons.length; index++) {
            assert.strictEqual(this.oDialogAddButtonStub.args[index][0].getText(), oExpected.buttons[index],
                "button: " + oExpected.buttons[index] + " is placed correctly");
            assert.strictEqual(this.oDialogAddButtonStub.args[index][0].getType(), oExpected.buttonTypes[index],
                "button: " + oExpected.buttons[index] + " has the correct type"
            );
        }
    });

    QUnit.test("correctly enriches the Dialog when Contact Support is enabled and details are given", function (assert) {
        // Arrange
        var oExpected = {
            buttons: [
                resources.i18n.getText("contactSupportBtn"),
                resources.i18n.getText("CopyToClipboardBtn"),
                resources.i18n.getText("closeBtn")
            ],
            buttonTypes: [
                ButtonType.Default,
                ButtonType.Default,
                ButtonType.Emphasized
            ]
        };

        this.oConfigLastStub.withArgs("/core/extension/SupportTicket").returns(true);

        // Act
        this.oMessage._createAndOpenErrorDialog("TestMessage", {
            details: "TestDetails"
        });

        // Assert
        var index = 0;

        assert.strictEqual(this.oDialogAddButtonStub.callCount, oExpected.buttons.length,
            "added exactly " + oExpected.buttons.length + " buttons");

        for (; index < oExpected.buttons.length; index++) {
            assert.strictEqual(this.oDialogAddButtonStub.args[index][0].getText(), oExpected.buttons[index],
                "button: " + oExpected.buttons[index] + " is placed correctly");
            assert.strictEqual(this.oDialogAddButtonStub.args[index][0].getType(), oExpected.buttonTypes[index],
                "button: " + oExpected.buttons[index] + " has the correct type"
            );
        }
    });

    QUnit.module("buildAndSendMessageToast", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    return Container.getServiceAsync("Message").then(function (oMessageService) {
                        this.oMessage = oMessageService;
                        this.oShowStub = sandbox.stub();
                        this.oRequireStub = sandbox.stub(sap.ui, "require");
                        this.oRequireStub.callsFake(function (aFiles, fnCallBack) {
                            fnCallBack({ show: this.oShowStub });
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            Container.reset();
            sandbox.restore();
        }
    });

    QUnit.test("passes on the arguments correctly", function (assert) {
        // Arrange
        var aExpectedParameters = [
            "Some Message",
            {
                duration: 3000
            }
        ];

        // Act
        this.oMessage.buildAndSendMessageToast("Some Message", 3000);

        // Assert
        assert.strictEqual(this.oShowStub.called, true, "show function was called");
        assert.deepEqual(this.oShowStub.args[0], aExpectedParameters,
            "show function was called with the correct arguments");
    });

    QUnit.module("sendMessageBox", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    return Container.getServiceAsync("Message").then(function (oMessageService) {
                        this.oMessage = oMessageService;
                        this.oShowStub = sandbox.stub(MessageBox, "show");
                        this.oConfirmStub = sandbox.stub(MessageBox, "confirm");
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            Container.reset();
            sandbox.restore();
        }
    });

    QUnit.test("calls the correct MessageBox type when show is needed", function (assert) {
        // Arrange
        var aExpectedParameters = [
            "TestMessage",
            {
                someProperty: "This is a Property"
            }
        ];

        // Act
        this.oMessage.sendMessageBox("TestMessage", "show", {
            someProperty: "This is a Property"
        });

        // Assert
        assert.strictEqual(this.oShowStub.called, true, "show function was called");
        assert.deepEqual(this.oShowStub.args[0], aExpectedParameters,
            "function was called with the correct parameters");
        assert.strictEqual(this.oConfirmStub.called, false, "confirm function was called");
    });

    QUnit.test("calls the correct MessageBox type when confirm is needed", function (assert) {
        // Arrange
        var aExpectedParameters = [
            "TestMessage",
            {
                someProperty: "This is a Property"
            }
        ];

        // Act
        this.oMessage.sendMessageBox("TestMessage", "confirm", {
            someProperty: "This is a Property"
        });

        // Assert
        assert.strictEqual(this.oShowStub.called, false, "show function was called");
        assert.strictEqual(this.oConfirmStub.called, true, "confirm function was called");
        assert.deepEqual(this.oConfirmStub.args[0], aExpectedParameters,
            "function was called with the correct parameters");
    });

    QUnit.module("info", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    return Container.getServiceAsync("Message").then(function (oMessageService) {
                        this.oMessage = oMessageService;
                        this.oShowSpy = sandbox.spy(this.oMessage, "show");
                        this.oBuildAndSendMessageToastStub = sandbox.stub(this.oMessage, "buildAndSendMessageToast");
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("calls the correct function with correct arguments when duration is provided", function (assert) {
        // Arrange
        var aExpectedParameters = [
            0,
            "TestMessage",
            {
                duration: 5000
            }
        ];

        // Act
        this.oMessage.info("TestMessage", 5000);

        // Assert
        assert.strictEqual(this.oShowSpy.called, true, "show function was called");
        assert.deepEqual(this.oShowSpy.args[0], aExpectedParameters,
            "function was called with the correct parameters");
        assert.strictEqual(this.oBuildAndSendMessageToastStub.called, true, "show function was called");
    });

    QUnit.test("calls the correct function with correct arguments when duration is not provided", function (assert) {
        // Arrange
        var aExpectedParameters = [
            0,
            "TestMessage",
            {
                duration: 3000
            }
        ];

        // Act
        this.oMessage.info("TestMessage");

        // Assert
        assert.strictEqual(this.oShowSpy.called, true, "show function was called");
        assert.deepEqual(this.oShowSpy.args[0], aExpectedParameters,
            "function was called with the correct parameters");
        assert.strictEqual(this.oBuildAndSendMessageToastStub.called, true, "show function was called");
    });

    QUnit.module("error", {
        beforeEach: function () {
            this.oLogErrorStub = sandbox.stub(Log, "error");
            return Container.init("local")
                .then(function () {
                    return Container.getServiceAsync("Message").then(function (oMessageService) {
                        this.oMessage = oMessageService;
                        this.oShowSpy = sandbox.spy(this.oMessage, "show");
                        this.oCreateAndOpenErrorDialogStub = sandbox.stub(this.oMessage, "_createAndOpenErrorDialog");
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            Container.reset();
            sandbox.restore();
        }
    });

    QUnit.test("logs the error and calls the correct function with correct arguments when title is provided", function (assert) {
        // Arrange
        var oExpected = {
            showParameters: [
                1,
                "TestMessage",
                {
                    title: "FoobarTitle"
                }
            ],
            createAndOpenErrorDialogParameters: [
                "TestMessage",
                {
                    actions: undefined,
                    details: undefined,
                    onClose: undefined,
                    title: "FoobarTitle",
                    emphasizedAction: undefined
                }
            ]
        };

        // Act
        this.oMessage.error("TestMessage", "FoobarTitle");

        // Assert
        assert.strictEqual(this.oLogErrorStub.called, true, "Log.error function was called");
        assert.deepEqual(this.oLogErrorStub.args[0], ["TestMessage"],
            "Log.error function was called with the correct parameters");
        assert.strictEqual(this.oShowSpy.called, true, "show function was called");
        assert.deepEqual(this.oShowSpy.args[0], oExpected.showParameters,
            "function was called with the correct parameters");
        assert.strictEqual(this.oCreateAndOpenErrorDialogStub.called, true,
            "_createAndOpenErrorDialog function was called");
        assert.deepEqual(this.oCreateAndOpenErrorDialogStub.args[0], oExpected.createAndOpenErrorDialogParameters,
            "Log.error function was called with the correct parameters");
    });

    QUnit.test("logs the error and calls the correct function with correct arguments when title is not provided", function (assert) {
        // Arrange
        var oExpected = {
            showParameters: [
                1,
                "TestMessage",
                {
                    title: undefined
                }
            ],
            createAndOpenErrorDialogParameters: [
                "TestMessage",
                {
                    actions: undefined,
                    details: undefined,
                    onClose: undefined,
                    title: undefined,
                    emphasizedAction: undefined
                }
            ]
        };

        // Act
        this.oMessage.error("TestMessage");

        // Assert
        assert.strictEqual(this.oLogErrorStub.called, true, "Log.error function was called");
        assert.deepEqual(this.oLogErrorStub.args[0], ["TestMessage"],
            "Log.error function was called with the correct parameters");
        assert.strictEqual(this.oShowSpy.called, true, "show function was called");
        assert.deepEqual(this.oShowSpy.args[0], oExpected.showParameters,
            "function was called with the correct parameters");
        assert.strictEqual(this.oCreateAndOpenErrorDialogStub.called, true,
            "_createAndOpenErrorDialog function was called");
        assert.deepEqual(this.oCreateAndOpenErrorDialogStub.args[0], oExpected.createAndOpenErrorDialogParameters,
            "Log.error function was called with the correct parameters");
    });

    QUnit.module("confirm", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    return Container.getServiceAsync("Message").then(function (oMessageService) {
                        this.oMessage = oMessageService;
                        this.oShowStub = sandbox.stub(this.oMessage, "show");
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("calls the correct function with correct arguments", function (assert) {
        // Arrange
        var fnCallBack = sandbox.stub();
        var aExpectedParameters = [
            2,
            "TestMessage",
            {
                callback: fnCallBack,
                title: "SomeTitle",
                actions: ["Some", "Fake", "Action"]
            }
        ];

        // Act
        this.oMessage.confirm("TestMessage", fnCallBack, "SomeTitle", ["Some", "Fake", "Action"]);

        // Assert
        assert.strictEqual(this.oShowStub.called, true, "show function was called");
        assert.deepEqual(this.oShowStub.args[0], aExpectedParameters,
            "function was called with the correct parameters");
    });

    QUnit.module("errorWithDetails", {
        beforeEach: function () {
            this.sMessage = "Some error occurred.";
            this.oDetailControl = new Text({
                text: "Some details to this error."
            });
            this.sTitle = "Critical Error";
            this.aButtons = [
                new Button({
                    text: "Button1",
                    type: ButtonType.Emphasized
                }),
                new Button({
                    text: "Button2"
                })
            ];
            return Container.init("local")
                .then(function () {
                    return Container.getServiceAsync("Message").then(function (oMessageService) {
                        this.oMessage = oMessageService;
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            Container.reset();
            sandbox.restore();
        }
    });

    QUnit.test("default error dialog", function (assert) {
        // Arrange
        var fnDone = assert.async();

        // Act
        var oDialog = this.oMessage.errorWithDetails(this.sMessage, this.oDetailControl);

        oDialog.attachAfterOpen(function () {
            // Assert
            assert.strictEqual(oDialog.hasStyleClass("sapContrastPlus"), true,
                "The Dialog has the style class \"sapUiSmallMarginBottom\".");
            assert.strictEqual(oDialog.getState(), ValueState.Error, "The value state is correct.");
            assert.strictEqual(oDialog.getType(), DialogType.Message, "The dialog type is correct.");
            assert.strictEqual(oDialog.getContentWidth(), "30rem", "The content width is correct.");
            assert.strictEqual(oDialog.getTitle(), resources.i18n.getText("error"), "The default title is correct.");
            assert.strictEqual(oDialog.getContent().length, 1, "The content aggregation contains one control.");
            assert.strictEqual(oDialog.getButtons().length, 1, "The button aggregation contains one default control.");

            var oVBox = oDialog.getContent()[0];
            assert.strictEqual(oVBox.isA("sap.m.VBox"), true, "The control in the content aggregation is a sap.m.VBox.");
            assert.strictEqual(oVBox.getRenderType(), FlexRendertype.Bare, "The flex render type of the VBox is correct.");
            assert.strictEqual(oVBox.getItems().length, 2, "The item aggregation of the VBox contains three controls.");
            assert.strictEqual(oVBox.getItems()[0].isA("sap.m.Text"), true, "The first item is a sap.m.Text.");
            assert.strictEqual(oVBox.getItems()[0].hasStyleClass("sapUiSmallMarginBottom"), true,
                "The first item has the style class \"sapUiSmallMarginBottom\".");
            assert.strictEqual(oVBox.getItems()[0].getText(), this.sMessage, "The first item has the correct Text.");
            assert.strictEqual(oVBox.getItems()[1].isA("sap.m.Link"), true, "The second item is a sap.m.Link.");
            assert.strictEqual(oVBox.getItems()[1].getText(), resources.i18n.getText("ViewDetails"),
                "The second item has the correct Text.");
            // assert.deepEqual(oVBox.getItems()[2], this.oDetailControl, "The third item is the detail control.");
            // assert.strictEqual(oVBox.getItems()[2].getVisible(), false, "The third item is invisible.");

            var oButton = oDialog.getButtons()[0];
            assert.strictEqual(oButton.getText(), resources.i18n.getText("closeBtn"), "The default button has the correct text.");
            assert.strictEqual(oButton.getType(), ButtonType.Emphasized, "The default button has the correct type.");

            // Clean-up
            oDialog.getEndButton().firePress();
            fnDone();
        }.bind(this));
    });

    QUnit.test("error dialog with a special title and different buttons", function (assert) {
        // Arrange
        var fnDone = assert.async();

        // Act
        var oDialog = this.oMessage.errorWithDetails(this.sMessage, this.oDetailControl, this.sTitle, this.aButtons);

        oDialog.attachAfterOpen(function () {
            // Assert
            assert.strictEqual(oDialog.hasStyleClass("sapContrastPlus"), true,
                "The Dialog has the style class \"sapUiSmallMarginBottom\".");
            assert.strictEqual(oDialog.getState(), ValueState.Error, "The value state is correct.");
            assert.strictEqual(oDialog.getType(), DialogType.Message, "The dialog type is correct.");
            assert.strictEqual(oDialog.getContentWidth(), "30rem", "The content width is correct.");
            assert.strictEqual(oDialog.getTitle(), this.sTitle, "The custom title is correct.");
            assert.strictEqual(oDialog.getContent().length, 1, "The content aggregation contains one control.");
            assert.strictEqual(oDialog.getButtons().length, 2, "The button aggregation contains two controls.");
            assert.deepEqual(oDialog.getButtons(), this.aButtons, "The button aggregation has the correct buttons.");

            // Clean-up
            oDialog.getEndButton().firePress();
            fnDone();
        }.bind(this));
    });

    QUnit.test("error dialog view details link behavior", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oDialog = this.oMessage.errorWithDetails(this.sMessage, this.oDetailControl);

        oDialog.attachAfterOpen(function () {
            // Act
            oDialog.getContent()[0].getItems()[1].firePress();

            // Assert
            assert.deepEqual(oDialog.getContent()[0].getItems()[1], this.oDetailControl,
                "The link got exchanged for the detail control.");

            // Clean-up
            oDialog.getEndButton().firePress();
            fnDone();
        }.bind(this));
    });
});
