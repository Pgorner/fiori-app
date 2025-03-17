// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file QUnit tests for "sap.ushell.components.pages.ActionMode"
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/VBox",
    "sap/ui/core/Element",
    "sap/ui/model/json/JSONModel",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/components/pages/ActionMode",
    "sap/ushell/EventHub",
    "sap/ushell/renderer/AccessKeysHandler",
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/Page",
    "sap/ushell/ui/launchpad/Section",
    "sap/ushell/Container"
], function (
    Log,
    ObjectPath,
    MessageBox,
    MessageToast,
    VBox,
    Element,
    JSONModel,
    nextUIUpdate,
    ActionMode,
    EventHub,
    AccessKeysHandler,
    resources,
    Page,
    Section,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("The start function", {
        beforeEach: function () {
            this.oSetPropertyStub = sandbox.stub();
            this.oGetPropertyStub = sandbox.stub().returns(false); // AddToMyHomeOnly
            this.oGetModelStub = sandbox.stub();
            this.oGetModelStub.withArgs("viewSettings").returns({
                setProperty: this.oSetPropertyStub,
                getProperty: this.oGetPropertyStub
            });
            this.oGetViewStub = sandbox.stub();
            this.oNavigateToErrorPageStub = sandbox.stub();
            this.oHandleMyHomeActionModeStub = sandbox.stub().resolves();
            this.oGetViewStub.returns({ getModel: this.oGetModelStub });
            this.oMockController = {
                getView: this.oGetViewStub,
                handleMyHomeActionMode: this.oHandleMyHomeActionModeStub,
                navigateToErrorPage: this.oNavigateToErrorPageStub
            };

            this.oEmitStub = sandbox.stub(EventHub, "emit");

            this.oSetTooltipStub = sandbox.stub();
            this.oSetTextStub = sandbox.stub();
            this.oGetTextStub = sandbox.stub();
            this.oButtonMock = {
                setTooltip: this.oSetTooltipStub,
                setText: this.oSetTextStub,
                getText: this.oGetTextStub
            };
            this.oByIdStub = sandbox.stub(Element, "getElementById");
            this.oByIdStub.withArgs("ActionModeBtn").returns(this.oButtonMock);

            this.sMockText = "sMockText";
            this.oGetTextStub = sandbox.stub(resources.i18n, "getText");
            this.oGetTextStub.withArgs("PageRuntime.EditMode.Exit").returns(this.sMockText);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode.start(this.oMockController);
        //Assert
        assert.strictEqual(ActionMode.oController, this.oMockController, "Controller was saved to the ActionMode");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/actionModeEditActive", true], "set property was called with the right parameters");
        assert.deepEqual(this.oEmitStub.getCall(0).args, ["enableMenuBarNavigation", false], "EventHub was called with the right parameters");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once");
        assert.strictEqual(this.oHandleMyHomeActionModeStub.callCount, 1, "handleMyHomeActionMode was called once");
        assert.ok(this.oHandleMyHomeActionModeStub.calledWith(true), "handleMyHomeActionMode was called with the expected arguments");

        assert.strictEqual(this.oSetTooltipStub.getCall(0).args[0], this.sMockText, "setTooltip was called with the right parameters");
        assert.strictEqual(this.oSetTextStub.getCall(0).args[0], this.sMockText, "setText was called with the right parameters");
        assert.strictEqual(this.oGetTextStub.callCount, 1, "getText was called with the right parameters");
    });

    QUnit.test("AddToMyHomeOnly is true", function (assert) {
        //Arrange
        this.oGetPropertyStub.returns(true); // AddToMyHomeOnly === true
        //Act
        ActionMode.start(this.oMockController);
        //Assert
        assert.strictEqual(ActionMode.oController, this.oMockController, "Controller was saved to the ActionMode"); // Action mode but not edit mode
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/actionModeActive", true], "set property was called with the right parameters");
    });

    QUnit.test("Attaches the correct handler to AccessKeysHandler's editModeDone event", function (assert) {
        // Arrange
        var oRequireStub = sandbox.stub(sap.ui, "require");
        oRequireStub.withArgs(["sap/ushell/renderer/AccessKeysHandler"], sandbox.match.any).returns();
        oRequireStub.callThrough();

        var oAttachEventStub = sandbox.stub(AccessKeysHandler, "attachEvent");

        // Act
        ActionMode.start(this.oMockController);
        oRequireStub.withArgs(["sap/ushell/renderer/AccessKeysHandler"], sandbox.match.any).getCall(0).args[1](AccessKeysHandler);

        // Assert
        assert.strictEqual(oAttachEventStub.callCount, 1, "The function attachEvent has been called once.");
        assert.strictEqual(oAttachEventStub.firstCall.args.length, 3, "The function attachEvent has been called with the correct number of arguments.");
        assert.strictEqual(oAttachEventStub.firstCall.args[0], "editModeDone", "The function attachEvent has been called with the correct parameter.");
        assert.strictEqual(oAttachEventStub.firstCall.args[1], ActionMode.save, "The function attachEvent has been called with the correct parameter.");
        assert.strictEqual(oAttachEventStub.firstCall.args[2], ActionMode, "The function attachEvent has been called with the correct parameter.");
    });

    QUnit.test("Calls the navigateToErrorPage function if handleMyHomeActionMode rejects", function (assert) {
        //Arrange
        this.oHandleMyHomeActionModeStub.rejects();
        //Act
        ActionMode.start(this.oMockController);
        //Assert
        return this.oHandleMyHomeActionModeStub().catch(function () {
            assert.ok(this.oNavigateToErrorPageStub.calledOnce, "The navigateToErrorPage function was called.");
        }.bind(this));
    });

    QUnit.module("The cancel function", {
        beforeEach: function () {
            this.oCleanupStub = sandbox.stub(ActionMode, "_cleanup");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode.cancel();
        //Assert
        assert.strictEqual(this.oCleanupStub.callCount, 1, "cleanup was called once");
    });

    QUnit.module("The save function", {
        beforeEach: function () {
            this.oCleanupStub = sandbox.stub(ActionMode, "_cleanup");
            this.oInfoStub = sandbox.stub(Log, "info");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode.save();
        //Assert
        assert.strictEqual(this.oInfoStub.callCount, 1, "Log.info was called once");
        assert.strictEqual(this.oCleanupStub.callCount, 1, "cleanup was called once");
    });

    QUnit.module("The _cleanup function", {
        beforeEach: function () {
            this.oSetPropertyStub = sandbox.stub();
            this.oGetModelStub = sandbox.stub();
            this.oGetModelStub.withArgs("viewSettings").returns({ setProperty: this.oSetPropertyStub });
            this.oGetViewStub = sandbox.stub();
            this.oNavigateToErrorPageStub = sandbox.stub();
            this.oHandleMyHomeActionModeStub = sandbox.stub().resolves();
            this.oGetViewStub.returns({ getModel: this.oGetModelStub });
            ActionMode.oController = {
                getView: this.oGetViewStub,
                handleMyHomeActionMode: this.oHandleMyHomeActionModeStub,
                navigateToErrorPage: this.oNavigateToErrorPageStub
            };

            this.oEmitStub = sandbox.stub(EventHub, "emit");

            this.oSetTooltipStub = sandbox.stub();
            this.oSetTextStub = sandbox.stub();
            this.oButtonMock = {
                setTooltip: this.oSetTooltipStub,
                setText: this.oSetTextStub
            };
            this.oByIdStub = sandbox.stub(Element, "getElementById");
            this.oByIdStub.withArgs("ActionModeBtn").returns(this.oButtonMock);

            this.sMockText = "sMockText";
            ActionMode.sActionButtonActivateText = this.sMockText;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode._cleanup();
        //Assert
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/actionModeActive", false], "set property was called with the right parameters");
        assert.deepEqual(this.oEmitStub.getCall(0).args, ["enableMenuBarNavigation", true], "EventHub was called with the right parameters");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once");
        assert.strictEqual(this.oHandleMyHomeActionModeStub.callCount, 1, "handleMyHomeActionMode was called once");
        assert.ok(this.oHandleMyHomeActionModeStub.calledWith(false), "handleMyHomeActionMode was called with the expected arguments");

        assert.strictEqual(this.oSetTooltipStub.getCall(0).args[0], this.sMockText, "setTooltip was called with the right parameters");
        assert.strictEqual(this.oSetTextStub.getCall(0).args[0], this.sMockText, "setText was called with the right parameters");
    });

    QUnit.test("Detaches the correct handler from AccessKeysHandler's editModeDone event", function (assert) {
        // Arrange
        var oRequireStub = sandbox.stub(sap.ui, "require");
        oRequireStub.withArgs(["sap/ushell/renderer/AccessKeysHandler"], sandbox.match.any).returns();
        oRequireStub.callThrough();

        var oDetachEventStub = sandbox.stub(AccessKeysHandler, "detachEvent");

        // Act
        ActionMode._cleanup();
        oRequireStub.withArgs(["sap/ushell/renderer/AccessKeysHandler"], sandbox.match.any).getCall(0).args[1](AccessKeysHandler);

        // Assert
        assert.strictEqual(oDetachEventStub.callCount, 1, "The function detachEvent has been called once.");
        assert.strictEqual(oDetachEventStub.firstCall.args.length, 3, "The function detachEvent has been called with the correct number of arguments.");
        assert.strictEqual(oDetachEventStub.firstCall.args[0], "editModeDone", "The function detachEvent has been called with the correct parameter.");
        assert.strictEqual(oDetachEventStub.firstCall.args[1], ActionMode.save, "The function detachEvent has been called with the correct parameter.");
        assert.strictEqual(oDetachEventStub.firstCall.args[2], ActionMode, "The function detachEvent has been called with the correct parameter.");
    });

    QUnit.test("Calls the navigateToErrorPage function if handleMyHomeActionMode rejects", function (assert) {
        //Arrange
        this.oHandleMyHomeActionModeStub.rejects();
        //Act
        ActionMode._cleanup();
        //Assert
        return this.oHandleMyHomeActionModeStub().catch(function () {
            assert.ok(this.oNavigateToErrorPageStub.calledOnce, "The navigateToErrorPage function was called.");
        }.bind(this));
    });

    QUnit.module("The addVisualization function", {
        beforeEach: function () {
            this.oNavigationService = {
                navigate: sandbox.stub()
            };

            this.getServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").returns({
                then: function (fnCallback) {
                    fnCallback(this.oNavigationService);
                }.bind(this)
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Was called correctly", function (assert) {
        //Arrange
        var oModel = new JSONModel();
        var oModelStub = sandbox.stub(oModel, "getProperty");

        oModelStub.withArgs("/pages/3/id").returns("some_page_id");
        oModelStub.withArgs("/pages/3/sections/1/id").returns("some_section_id");

        var oSource = {
            getBindingContext: function () {
                return {
                    getModel: sandbox.stub().returns(oModel),
                    getPath: sandbox.stub().returns("/pages/3/sections/1")
                };
            }
        };

        var expectedCallParameter = {
            target: {
                shellHash: "Shell-appfinder?&/catalog/{\"pageID\":\"some_page_id\",\"sectionID\":\"some_section_id\"}"
            }
        };
        //Act
        ActionMode.addVisualization(null, oSource, null);
        //Assert
        assert.strictEqual(this.getServiceAsyncStub.callCount, 1, "getServiceAsync was called once");
        assert.strictEqual(this.getServiceAsyncStub.getCall(0).args[0], "Navigation", "Navigation service was used");

        assert.strictEqual(this.oNavigationService.navigate.callCount, 1, "navigate method of service was called");
        assert.deepEqual(this.oNavigationService.navigate.getCall(0).args, [expectedCallParameter], "Correct shell hash was used for navigation");
    });

    QUnit.module("The addSection function", {
        beforeEach: async function () {
            this.oAddSectionStub = sandbox.stub().callsFake(function (iPageIndex, iSectionIndex) {
                var aSections = this.oModel.getProperty("/pages/" + iPageIndex + "/sections");
                aSections.splice(iSectionIndex, 0, {});
                this.oModel.setProperty("/pages/" + iPageIndex + "/sections", aSections);
            }.bind(this));

            ActionMode.oController = {
                getOwnerComponent: sandbox.stub().returns({
                    getPagesService: sandbox.stub().resolves({ addSection: this.oAddSectionStub })
                })
            };

            this.oModel = new JSONModel({
                pages: [{
                    sections: []
                }]
            });
            this.oVBox = new VBox();
            this.oVBox.setModel(this.oModel);
            this.oVBox.bindAggregation("items", {
                path: "/pages",
                factory: function () {
                    return new Page({
                        edit: true,
                        sections: {
                            path: "sections",
                            factory: function () {
                                return new Section({
                                    title: "{title}",
                                    editable: true
                                });
                            }
                        }
                    });
                }
            });

            this.oVBox.placeAt("qunit-fixture");

            this.oPage = this.oVBox.getItems()[0];
            this.oPage.focus();
            this.oClock = sandbox.useFakeTimers();
        },
        afterEach: function () {
            this.oVBox.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Adds a section on an empty page", async function (assert) {
        // Act
       ActionMode.addSection({}, this.oPage, { index: 0 }).then(async function () {
            // Assert
            assert.strictEqual(this.oPage.getSections().length, 1, "The page now has exactly one section.");
            assert.strictEqual(this.oAddSectionStub.callCount, 1, "addSection was called exactly once.");
            assert.strictEqual(this.oAddSectionStub.args[0][0], 0, "addSection was called with the correct page index.");
            assert.strictEqual(this.oAddSectionStub.args[0][1], 0, "addSection was called with the correct section index.");
            this.oPage.invalidate();
            await nextUIUpdate();
            this.oClock.tick(1);

            assert.strictEqual(document.activeElement, this.oPage.getSections()[0].getAggregation("_header").getContent()[2].getFocusDomRef(),
                "Focus is set correctly.");
        }.bind(this));
    });

    QUnit.test("Adds a section between other sections", async function (assert) {
        // Arrange
        this.oModel.setProperty("/pages/0/sections", [
            { title: "first Section" },
            { title: "second Section" }
        ]);

        // Act
        ActionMode.addSection({}, this.oPage, { index: 1 }).then(async function () {
            // Assert
            assert.strictEqual(this.oPage.getSections().length, 3, "The page now has exactly three sections.");
            assert.strictEqual(this.oPage.getSections()[0].getTitle(), "first Section", "The first section is correct.");
            assert.strictEqual(this.oPage.getSections()[1].getTitle(), "", "The second section is correct.");
            assert.strictEqual(this.oPage.getSections()[2].getTitle(), "second Section", "The third section is correct.");
            assert.strictEqual(this.oAddSectionStub.callCount, 1, "addSection was called exactly once.");
            assert.strictEqual(this.oAddSectionStub.args[0][0], 0, "addSection was called with the correct page index.");
            assert.strictEqual(this.oAddSectionStub.args[0][1], 1, "addSection was called with the correct section index.");
            this.oPage.invalidate();
            await nextUIUpdate();
            this.oClock.tick(1);

            assert.strictEqual(document.activeElement, this.oPage.getSections()[1].getAggregation("_header").getContent()[2].getFocusDomRef(),
                "Focus is set correctly.");

        }.bind(this));
    });

    QUnit.test("Adds a section at the end", async function (assert) {
        // Arrange
        this.oModel.setProperty("/pages/0/sections", [
            { title: "first Section" },
            { title: "second Section" }
        ]);

        // Act
        ActionMode.addSection({}, this.oPage, { index: 2 }).then(async function () {
            // Assert
            assert.strictEqual(this.oPage.getSections().length, 3, "The page now has exactly three sections.");
            assert.strictEqual(this.oPage.getSections()[0].getTitle(), "first Section", "The first section is correct.");
            assert.strictEqual(this.oPage.getSections()[1].getTitle(), "second Section", "The second section is correct.");
            assert.strictEqual(this.oPage.getSections()[2].getTitle(), "", "The thrid section is correct.");
            assert.strictEqual(this.oAddSectionStub.callCount, 1, "addSection was called exactly once.");
            assert.strictEqual(this.oAddSectionStub.args[0][0], 0, "addSection was called with the correct page index.");
            assert.strictEqual(this.oAddSectionStub.args[0][1], 2, "addSection was called with the correct section index.");
            this.oPage.invalidate();
            await nextUIUpdate();
            this.oClock.tick(1);

            assert.strictEqual(document.activeElement, this.oPage.getSections()[2].getAggregation("_header").getContent()[2].getFocusDomRef(),
                "Focus is set correctly.");
        }.bind(this));
    });

    QUnit.module("The deleteSection function", {
        beforeEach: async function () {
            this.oDeleteSectionStub = sandbox.stub().callsFake(function (iPageIndex, iSectionIndex) {
                var aSections = this.oModel.getProperty("/pages/" + iPageIndex + "/sections");
                aSections.splice(iSectionIndex, 1);
                this.oModel.setProperty("/pages/" + iPageIndex + "/sections", aSections);
            }.bind(this));

            ActionMode.oController = {
                getOwnerComponent: sandbox.stub().returns({
                    getPagesService: sandbox.stub().resolves({ deleteSection: this.oDeleteSectionStub })
                })
            };

            this.getServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").resolves({
                confirm: function (sMsg, fnCallBack) {
                    fnCallBack.call(this, MessageBox.Action.DELETE);
                }.bind(this)
            });

            this.oMessageToastStub = sandbox.stub(MessageToast, "show");

            this.oModel = new JSONModel({ pages: [{ sections: [] }] });
            this.oVBox = new VBox();
            this.oVBox.setModel(this.oModel);
            this.oVBox.bindAggregation("items", {
                path: "/pages",
                factory: function () {
                    return new Page({
                        edit: true,
                        sections: {
                            path: "sections",
                            factory: function () {
                                return new Section({
                                    title: "{title}",
                                    editable: true
                                });
                            }
                        }
                    });
                }
            });

            this.oVBox.placeAt("qunit-fixture");

            this.oPage = this.oVBox.getItems()[0];
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Deletes the last section", async function (assert) {
        // Arrange
        this.oModel.setProperty("/pages/0/sections", [
            { title: "some Section" }
        ]);
        var oSection = this.oPage.getSections()[0];
        oSection.getAggregation("_header").getContent()[7].focus();

        // Act
        ActionMode.deleteSection({}, oSection, { index: 0 }).then(async function () {
            // Assert
            assert.strictEqual(this.oPage.getSections().length, 0, "The page now has no sections.");
            assert.strictEqual(this.oMessageToastStub.callCount, 1, "MessageToast shown.");
            assert.strictEqual(this.oMessageToastStub.args[0][0],
                resources.i18n.getText("PageRuntime.Message.SectionDeleted"),
                "MessageToast shows the correct message.");
            assert.strictEqual(this.oDeleteSectionStub.callCount, 1, "deleteSection was called exactly once.");
            assert.strictEqual(this.oDeleteSectionStub.args[0][0], 0, "deleteSection was called with the correct page index.");
            assert.strictEqual(this.oDeleteSectionStub.args[0][1], 0, "deleteSection was called with the correct section index.");
            await nextUIUpdate();
            assert.strictEqual(document.activeElement, this.oPage.getFocusDomRef(),
                "Focus is set correctly.");
        }.bind(this));
    });

    QUnit.test("Deletes first section", async function (assert) {
        // Arrange
        this.oModel.setProperty("/pages/0/sections", [
            { title: "some Section" },
            { title: "second Section" }
        ]);
        var oSection = this.oPage.getSections()[0];
        oSection.getAggregation("_header").getContent()[7].focus();

        // Act
        ActionMode.deleteSection({}, oSection, { index: 0 }).then(async function () {
            // Assert
            var aSections = this.oPage.getSections();
            assert.strictEqual(aSections.length, 1, "The page now has one section.");
            assert.strictEqual(this.oMessageToastStub.callCount, 1, "MessageToast shown.");
            assert.strictEqual(this.oMessageToastStub.args[0][0],
                resources.i18n.getText("PageRuntime.Message.SectionDeleted"),
                "MessageToast shows the correct message.");
            assert.strictEqual(this.oDeleteSectionStub.callCount, 1, "deleteSection was called exactly once.");
            assert.strictEqual(this.oDeleteSectionStub.args[0][0], 0, "deleteSection was called with the correct page index.");
            assert.strictEqual(this.oDeleteSectionStub.args[0][1], 0, "deleteSection was called with the correct section index.");
            this.oPage.invalidate();
            await nextUIUpdate();

            assert.strictEqual(document.activeElement, aSections[0].getFocusDomRef(), "Focus is set correctly.");

        }.bind(this));
    });

    QUnit.test("Deletes a section between other sections", async function (assert) {
        // Arrange
        this.oModel.setProperty("/pages/0/sections", [
            { title: "some Section" },
            { title: "second Section" },
            { title: "third Section" }
        ]);
        var oSection = this.oPage.getSections()[1];
        oSection.getAggregation("_header").getContent()[7].focus();

        // Act
        ActionMode.deleteSection({}, oSection, { index: 1 }).then(async function () {
            // Assert
            var aSections = this.oPage.getSections();
            assert.strictEqual(aSections.length, 2, "The page now has two sections.");
            assert.strictEqual(this.oMessageToastStub.callCount, 1, "MessageToast shown.");
            assert.strictEqual(this.oMessageToastStub.args[0][0],
                resources.i18n.getText("PageRuntime.Message.SectionDeleted"),
                "MessageToast shows the correct message.");
            assert.strictEqual(this.oDeleteSectionStub.callCount, 1, "deleteSection was called exactly once.");
            assert.strictEqual(this.oDeleteSectionStub.args[0][0], 0, "deleteSection was called with the correct page index.");
            assert.strictEqual(this.oDeleteSectionStub.args[0][1], 1, "deleteSection was called with the correct section index.");
            this.oPage.invalidate();
            await nextUIUpdate();

            assert.strictEqual(document.activeElement, aSections[0].getFocusDomRef(), "Focus is set correctly.");

        }.bind(this));
    });

    QUnit.test("Deletes a section at the end", async function (assert) {
        // Arrange
        this.oModel.setProperty("/pages/0/sections", [
            { title: "some Section" },
            { title: "second Section" },
            { title: "third Section" }
        ]);
        var oSection = this.oPage.getSections()[2];
        oSection.getAggregation("_header").getContent()[7].focus();

        // Act
        ActionMode.deleteSection({}, this.oPage.getSections()[2], { index: 2 }).then(async function () {
            // Assert
            var aSections = this.oPage.getSections();
            assert.strictEqual(aSections.length, 2, "The page now has two sections.");
            assert.strictEqual(this.oMessageToastStub.callCount, 1, "MessageToast shown.");
            assert.strictEqual(this.oMessageToastStub.args[0][0],
                resources.i18n.getText("PageRuntime.Message.SectionDeleted"),
                "MessageToast shows the correct message.");
            assert.strictEqual(this.oDeleteSectionStub.callCount, 1, "deleteSection was called exactly once.");
            assert.strictEqual(this.oDeleteSectionStub.args[0][0], 0, "deleteSection was called with the correct page index.");
            assert.strictEqual(this.oDeleteSectionStub.args[0][1], 2, "deleteSection was called with the correct section index.");
            this.oPage.invalidate();
            await nextUIUpdate();

            assert.strictEqual(document.activeElement, aSections[1].getFocusDomRef(), "Focus is set correctly.");

        }.bind(this));
    });

    QUnit.test("Deletes a section but cancels the deletion", async function (assert) {
        // Arrange
        this.getServiceAsyncStub.resolves({
            confirm: function (sMsg, fnCallBack) {
                fnCallBack.call(this, MessageBox.Action.CANCEL);
            }.bind(this)
        });

        this.oModel.setProperty("/pages/0/sections", [
            { title: "some Section" },
            { title: "second Section" }
        ]);
        this.oPage.invalidate();

        var oSection = this.oPage.getSections()[1];
        oSection.getAggregation("_header").getContent()[7].focus();

        // Act
        ActionMode.deleteSection({}, oSection, { index: 1 }).then(async function () {
            // Assert
            assert.strictEqual(this.oPage.getSections().length, 2, "The page now has two sections.");
            assert.strictEqual(this.oMessageToastStub.callCount, 0, "MessageToast not shown.");
            assert.strictEqual(this.oDeleteSectionStub.callCount, 0, "deleteSection was not called.");
            await nextUIUpdate();

            var oFocusElement = oSection.getAggregation("_header").getContent()[7].getFocusDomRef();
            assert.strictEqual(document.activeElement, oFocusElement, "Focus is set correctly.");

        }.bind(this));
    });

    QUnit.module("The resetSection function", {
        beforeEach: function () {
            this.oController = {};
            this.oParameters = {};

            this.oResetSectionStub = sandbox.stub();

            this.oController.getOwnerComponent = sandbox.stub().returns({
                getPagesService: sandbox.stub().resolves({ resetSection: this.oResetSectionStub })
            });

            ActionMode.oController = this.oController;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Was called correctly", function (assert) {
        //Arrange
        var oMockControl = {
            getBindingContext: function () {
                return {
                    getPath: function () {
                        return "/pages/0/sections/1";
                    }
                };
            }
        };

        //Act
        return ActionMode.resetSection({}, oMockControl, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oResetSectionStub.callCount, 1, "resetSection was called once");
            assert.deepEqual(this.oResetSectionStub.getCall(0).args, [0, 1], "resetSection was called with the right parameters");
        }.bind(this));
    });

    QUnit.module("The changeSectionTitle function", {
        beforeEach: function () {
            this.oController = {};
            this.oParameters = {};

            this.oRenameSectionStub = sandbox.stub();

            this.oController.getOwnerComponent = sandbox.stub().returns({
                getPagesService: sandbox.stub().resolves({
                    renameSection: this.oRenameSectionStub
                })
            });

            ActionMode.oController = this.oController;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Was called correctly", function (assert) {
        //Arrange
        var oMockControl = {
            getBindingContext: function () {
                return {
                    getPath: function () {
                        return "/pages/0/sections/1";
                    }
                };
            },
            getProperty: function () {
                return "new Title";
            }
        };

        //Act
        return ActionMode.changeSectionTitle({}, oMockControl, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oRenameSectionStub.callCount, 1, "renameSection was called once");
            assert.deepEqual(this.oRenameSectionStub.getCall(0).args, [0, 1, "new Title"], "renameSection was called with the right parameters");
        }.bind(this));
    });

    QUnit.module("The moveSection function", {
        beforeEach: function () {
            this.oController = {};

            this.oGetDraggedPathStub = sandbox.stub();
            this.oGetDroppedPathStub = sandbox.stub();

            this.oParameters = {
                draggedControl: {
                    getBindingContext: function () {
                        return {
                            getPath: this.oGetDraggedPathStub
                        };
                    }.bind(this)
                },
                droppedControl: {
                    getBindingContext: function () {
                        return {
                            getPath: this.oGetDroppedPathStub
                        };
                    }.bind(this)
                }
            };

            this.oMoveSectionStub = sandbox.stub().resolves();

            this.oController.getOwnerComponent = sandbox.stub().returns({
                getPagesService: sandbox.stub().resolves({
                    moveSection: this.oMoveSectionStub
                })
            });

            this.oInvisibleMessageStub = sandbox.stub();

            this.oSource = {
                announceMove: this.oInvisibleMessageStub,
                getSections: sandbox.stub().returns([
                    { focus: sandbox.stub() },
                    { focus: sandbox.stub() },
                    { focus: sandbox.stub() }
                ])
            };

            ActionMode.oController = this.oController;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Dropping a section before the next section does nothing", function (assert) {
        //Arrange
        this.sMockPath = "/pages/0/sections/";

        this.oGetDraggedPathStub.returns("/pages/0/sections/0");
        this.oGetDroppedPathStub.returns("/pages/0/sections/1");
        this.oParameters.dropPosition = "Before";

        //Act
        return ActionMode.moveSection({}, this.oSource, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oMoveSectionStub.callCount, 0, "moveSection was not called");
            assert.strictEqual(this.oInvisibleMessageStub.callCount, 0, "announceMove was not called");
        }.bind(this));
    });

    QUnit.test("Dropping a section after the section before does nothing", function (assert) {
        //Arrange
        this.sMockPath = "/pages/0/sections/";

        this.oGetDraggedPathStub.returns("/pages/0/sections/2");
        this.oGetDroppedPathStub.returns("/pages/0/sections/1");
        this.oParameters.dropPosition = "After";

        //Act
        return ActionMode.moveSection({}, this.oSource, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oMoveSectionStub.callCount, 0, "moveSection was not called");
            assert.strictEqual(this.oInvisibleMessageStub.callCount, 0, "announceMove was not called");
        }.bind(this));
    });

    QUnit.test("Dropping a section after another section calls moveSection", function (assert) {
        //Arrange
        this.sMockPath = "/pages/0/sections/";

        this.oGetDraggedPathStub.returns("/pages/0/sections/0");
        this.oGetDroppedPathStub.returns("/pages/0/sections/2");
        this.oParameters.dropPosition = "After";

        //Act
        return ActionMode.moveSection({}, this.oSource, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oMoveSectionStub.callCount, 1, "moveSection was called once");
            assert.deepEqual(this.oMoveSectionStub.getCall(0).args, [0, 0, 3], "moveSection was called with the right parameters");
            assert.strictEqual(this.oInvisibleMessageStub.callCount, 1, "announceMove was called once");
        }.bind(this));
    });

    QUnit.test("Dropping a section before another section calls moveSection", function (assert) {
        //Arrange
        this.sMockPath = "/pages/0/sections/";

        this.oGetDraggedPathStub.returns("/pages/0/sections/0");
        this.oGetDroppedPathStub.returns("/pages/0/sections/2");
        this.oParameters.dropPosition = "Before";

        //Act
        return ActionMode.moveSection({}, this.oSource, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oMoveSectionStub.callCount, 1, "moveSection was called once");
            assert.deepEqual(this.oMoveSectionStub.getCall(0).args, [0, 0, 2], "moveSection was called with the right parameters");
            assert.strictEqual(this.oInvisibleMessageStub.callCount, 1, "announce was called once");
        }.bind(this));
    });

    QUnit.module("The sectionVisibilityChange function", {
        beforeEach: function () {
            this.oController = {};
            this.oParameters = {};

            this.oSetSectionVisibilityStub = sandbox.stub();

            this.oController.getOwnerComponent = sandbox.stub().returns({
                getPagesService: sandbox.stub().resolves({
                    setSectionVisibility: this.oSetSectionVisibilityStub
                })
            });

            this.oMockControl = {
                getBindingContext: function () {
                    return {
                        getPath: function () {
                            return "/pages/0/sections/1";
                        }
                    };
                },
                getProperty: function () {
                    return true;
                }
            };

            ActionMode.oController = this.oController;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Was called correctly", function (assert) {
        //Arrange
        this.oParameters.visible = false;

        //Act
        return ActionMode.changeSectionVisibility({}, this.oMockControl, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oSetSectionVisibilityStub.callCount, 1, "setSectionVisibility was called once");
            assert.deepEqual(this.oSetSectionVisibilityStub.getCall(0).args, [0, 1, false], "setSectionVisibility was called with the right parameters");
        }.bind(this));
    });

    QUnit.test("Doesn't call setSectionVisibility when no visibility is provided", function (assert) {
        //Arrange
        this.oParameters.visible = undefined;

        //Act
        return ActionMode.changeSectionVisibility({}, this.oMockControl, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oSetSectionVisibilityStub.callCount, 0, "setSectionVisibility was not called");
        }.bind(this));
    });

    QUnit.test("Doesn't call setSectionVisibility when the controller is not set", function (assert) {
        //Arrange
        this.oParameters.visible = true;
        ActionMode.oController = undefined;

        //Act
        return ActionMode.changeSectionVisibility({}, this.oMockControl, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oSetSectionVisibilityStub.callCount, 0, "setSectionVisibility was not called");
        }.bind(this));
    });
});
