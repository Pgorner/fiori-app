// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.appfinder.GroupListPopover
 */
sap.ui.define([
    "sap/m/library",
    "sap/ui/core/Control",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/mvc/View"
], function (
    mobileLibrary,
    Control,
    Controller,
    View
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    // shortcut for sap.m.ListMode
    var ListMode = mobileLibrary.ListMode;

    QUnit.module("_cancelButtonPress", {
        beforeEach: function () {
            this.oPopover = {
                close: sandbox.stub()
            };

            return Controller.create({
                name: "sap.ushell.components.appfinder.GroupListPopover"
            }).then(function (oController) {
                this.oController = oController;

                this.oController.getView = sandbox.stub().returns({
                    oPopover: this.oPopover
                });
            }.bind(this));
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Popover is closed", function (assert) {
        // Act
        this.oController._cancelButtonPress();

        // Assert
        assert.strictEqual(this.oPopover.close.callCount, 1, "Close function was called exactly once.");
    });

    QUnit.module("_groupListItemClickHandler", {
        beforeEach: function () {
            this.oPopover = {
                close: sandbox.stub()
            };

            return Controller.create({
                name: "sap.ushell.components.appfinder.GroupListPopover"
            }).then(function (oController) {
                this.oController = oController;

                this.oController.getView = sandbox.stub().returns({
                    oPopover: this.oPopover
                });

                this.oNavigateToCreateNewGroupPane = sandbox.stub(this.oController, "_navigateToCreateNewGroupPane");
            }.bind(this));
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("New Group Item was pressed", function (assert) {
        // Arrange
        var oEvent = {
            getParameter: sandbox.stub().returns({
                data: sandbox.stub().returns(true)
            })
        };

        // Act
        this.oController._groupListItemClickHandler(oEvent);

        // Assert
        assert.strictEqual(this.oNavigateToCreateNewGroupPane.callCount, 1,
            "_navigateToCreateNewGroupPane function was called exactly once.");
    });

    QUnit.test("Group was pressed in SingleSelectMaster mode", function (assert) {
        // Arrange
        var oListItem = {
            data: sandbox.stub().returns(false),
            getSelected: sandbox.stub().returns(false),
            setSelected: sandbox.stub()
        };
        var oEvent = {
            getParameter: sandbox.stub().returns(oListItem),
            getSource: sandbox.stub().returns({
                getMode: sandbox.stub().returns(ListMode.SingleSelectMaster)
            })
        };

        // Act
        this.oController._groupListItemClickHandler(oEvent);

        // Assert
        assert.strictEqual(this.oNavigateToCreateNewGroupPane.callCount, 0,
            "_navigateToCreateNewGroupPane function was not called.");
        assert.strictEqual(this.oPopover.close.callCount, 1, "Close function was called exactly once.");
    });

    QUnit.test("Group was pressed in MultiSelect mode and it was not selected before", function (assert) {
        // Arrange
        var oListItem = {
            data: sandbox.stub().returns(false),
            getSelected: sandbox.stub().returns(false),
            setSelected: sandbox.stub()
        };
        var oEvent = {
            getParameter: sandbox.stub().returns(oListItem),
            getSource: sandbox.stub().returns({
                getMode: sandbox.stub().returns(ListMode.MultiSelect)
            })
        };

        // Act
        this.oController._groupListItemClickHandler(oEvent);

        // Assert
        assert.strictEqual(this.oNavigateToCreateNewGroupPane.callCount, 0,
            "_navigateToCreateNewGroupPane function was not called.");
        assert.strictEqual(this.oPopover.close.callCount, 0, "Close function was not called.");
        assert.strictEqual(oListItem.setSelected.callCount, 1, "setSelected function was called exactly once.");
        assert.deepEqual(oListItem.setSelected.args[0], [true], "setSelected function was called correctly.");
    });

    QUnit.test("Group was pressed in MultiSelect mode and it was selected before", function (assert) {
        // Arrange
        var oListItem = {
            data: sandbox.stub().returns(false),
            getSelected: sandbox.stub().returns(true),
            setSelected: sandbox.stub()
        };
        var oEvent = {
            getParameter: sandbox.stub().returns(oListItem),
            getSource: sandbox.stub().returns({
                getMode: sandbox.stub().returns(ListMode.MultiSelect)
            })
        };

        // Act
        this.oController._groupListItemClickHandler(oEvent);

        // Assert
        assert.strictEqual(this.oNavigateToCreateNewGroupPane.callCount, 0,
            "_navigateToCreateNewGroupPane function was not called.");
        assert.strictEqual(this.oPopover.close.callCount, 0, "Close function was not called.");
        assert.strictEqual(oListItem.setSelected.callCount, 1, "setSelected function was called exactly once.");
        assert.deepEqual(oListItem.setSelected.args[0], [false], "setSelected function was called correctly.");
    });

    QUnit.module("_okayCancelButtonPress", {
        beforeEach: function () {
            this.oPopover = {
                close: sandbox.stub()
            };

            this.oGetValueStub = sandbox.stub();

            return Controller.create({
                name: "sap.ushell.components.appfinder.GroupListPopover"
            }).then(function (oController) {
                this.oController = oController;

                this.oController.getView = sandbox.stub().returns({
                    oPopover: this.oPopover,
                    _getNewGroupInput: sandbox.stub().returns({
                        getValue: this.oGetValueStub
                    })
                });
            }.bind(this));
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("No new group name given", function (assert) {
        // Arrange
        this.oGetValueStub.returns("");

        // Act
        this.oController._okayCancelButtonPress();

        // Assert
        assert.strictEqual(this.oController.sNewGroupId, undefined, "sNewGroupId is still undefined");
        assert.strictEqual(this.oPopover.close.callCount, 1, "Close function was called exactly once.");
    });

    QUnit.test("New group name given", function (assert) {
        // Arrange
        this.oGetValueStub.returns("test_group");

        // Act
        this.oController._okayCancelButtonPress();

        // Assert
        assert.strictEqual(this.oController.sNewGroupId, "test_group", "sNewGroupId is the new group name.");
        assert.strictEqual(this.oPopover.close.callCount, 1, "Close function was called exactly once.");
    });

    QUnit.module("sap.ushell.components.appfinder.GroupListPopover", {
        beforeEach: function () {
            this.oEndButton = {
                setVisible: sandbox.stub()
            };
            this.oPopover = {
                removeAllContent: sandbox.stub(),
                setContentHeight: sandbox.stub(),
                setVerticalScrolling: sandbox.stub(),
                setHorizontalScrolling: sandbox.stub(),
                addContent: sandbox.stub(),
                getContent: sandbox.stub().returns([]),
                getBeginButton: sandbox.stub(),
                getEndButton: sandbox.stub().returns(this.oEndButton),
                setTitle: sandbox.stub(),
                setCustomHeader: sandbox.stub()
            };

            return Controller.create({
                name: "sap.ushell.components.appfinder.GroupListPopover"
            }).then(function (oController) {
                this.oController = oController;
            }.bind(this));
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            this.oController.destroy();

            sandbox.restore();
        }
    });

    QUnit.test("_navigateToCreateNewGroupPane Test", function (assert) {
        this.oPopover.getBeginButton.returns({
            setText: sandbox.stub()
        });

        this.oPopover.getEndButton.returns({
            setText: sandbox.stub(),
            setVisible: sandbox.stub()
        });

        var oSetFooterVisibilityStub = sandbox.spy(this.oController, "_setFooterVisibility");
        var oView = {
            oPopover: this.oPopover,
            _getNewGroupHeader: sandbox.stub(),
            _getNewGroupInput: sandbox.stub().returns({
                focus: sandbox.stub()
            }),
            getViewData: function () {
                return { singleGroupSelection: true };
            }
        };
        this.oController.getView = function () {
            return oView;
        };

        this.oController._navigateToCreateNewGroupPane();
        assert.strictEqual(this.oPopover.removeAllContent.callCount, 1);
        assert.strictEqual(this.oPopover.addContent.callCount, 1);
        assert.strictEqual(this.oPopover.setCustomHeader.callCount, 1);
        assert.strictEqual(this.oPopover.setContentHeight.callCount, 1);
        assert.strictEqual(this.oPopover.getEndButton.callCount, 1);
        assert.strictEqual(this.oPopover.getBeginButton.callCount, 1);
        assert.strictEqual(oSetFooterVisibilityStub.callCount, 1);
        assert.strictEqual(oSetFooterVisibilityStub.args[0][0], true);
    });

    QUnit.test("_backButtonHandler Test", function (assert) {
        this.oPopover.getBeginButton.returns({
            setText: sandbox.stub()
        });

        var oSetFooterVisibilityStub = sandbox.stub(this.oController, "_setFooterVisibility");

        var oSetValueStub = sandbox.stub();
        var oListContainer = {};

        var oView = {
            oPopover: this.oPopover,
            _getNewGroupInput: sandbox.stub().returns({
                setValue: oSetValueStub
            }),
            getViewData: function () {
                return { singleGroupSelection: true };
            },
            _getListContainer: function () {
                return oListContainer;
            }
        };
        this.oController.getView = function () {
            return oView;
        };

        this.oController._backButtonHandler();
        assert.strictEqual(this.oPopover.removeAllContent.callCount, 1);
        assert.strictEqual(this.oPopover.setVerticalScrolling.callCount, 1);
        assert.strictEqual(this.oPopover.setHorizontalScrolling.callCount, 1);
        assert.strictEqual(this.oPopover.addContent.callCount, 1);
        assert.strictEqual(this.oPopover.addContent.firstCall.args[0], oListContainer);
        assert.strictEqual(this.oPopover.setTitle.callCount, 1);
        assert.strictEqual(this.oPopover.setCustomHeader.callCount, 1);
        assert.strictEqual(oSetValueStub.callCount, 1);
        assert.strictEqual(oSetFooterVisibilityStub.callCount, 1);
        assert.strictEqual(oSetFooterVisibilityStub.args[0][0], false);
    });

    QUnit.module("_afterCloseHandler", {
        beforeEach: function () {
            this.aGroups = [{
                selected: false,
                initiallySelected: false,
                oGroup: { id: "groupA" }
            }, {
                selected: true,
                initiallySelected: true,
                oGroup: { id: "groupB" }
            }];
            this.oViewDestroyStub = sandbox.stub();
            this.oResolveStub = sandbox.stub();

            return Controller.create({
                name: "sap.ushell.components.appfinder.GroupListPopover"
            }).then(function (oController) {
                this.oController = oController;

                this.oController.oPopoverModel = {
                    getProperty: sandbox.stub().returns(this.aGroups)
                };

                this.oController.getView = sandbox.stub().returns({
                    destroy: this.oViewDestroyStub,
                    deferred: {
                        resolve: this.oResolveStub
                    }
                });
            }.bind(this));
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("No groups where added, removed or created", function (assert) {
        // Arrange
        var oExpectedChanges = {
            addToGroups: [],
            removeFromGroups: [],
            newGroups: [],
            allGroups: this.aGroups
        };

        // Act
        this.oController._afterCloseHandler();

        // Assert
        assert.strictEqual(this.oViewDestroyStub.callCount, 1, "View is destroyed.");
        assert.strictEqual(this.oResolveStub.callCount, 1, "Deferred is resolved.");
        assert.deepEqual(this.oResolveStub.args[0][0], oExpectedChanges, "Changes are as expected.");
    });

    QUnit.test("No groups were added or removed, but a new group was created.", function (assert) {
        // Arrange
        this.oController.sNewGroupId = "groupC";
        var oExpectedChanges = {
            addToGroups: [],
            removeFromGroups: [],
            newGroups: ["groupC"],
            allGroups: this.aGroups
        };

        // Act
        this.oController._afterCloseHandler();

        // Assert
        assert.strictEqual(this.oViewDestroyStub.callCount, 1, "View is destroyed.");
        assert.strictEqual(this.oResolveStub.callCount, 1, "Deferred is resolved.");
        assert.deepEqual(this.oResolveStub.args[0][0], oExpectedChanges, "Changes are as expected.");
    });

    QUnit.test("No groups were added, but a group was removed.", function (assert) {
        // Arrange
        var oGroupB = this.aGroups[1];
        oGroupB.selected = false;
        var oExpectedChanges = {
            addToGroups: [],
            removeFromGroups: [oGroupB.oGroup],
            newGroups: [],
            allGroups: this.aGroups
        };

        // Act
        this.oController._afterCloseHandler();

        // Assert
        assert.strictEqual(this.oViewDestroyStub.callCount, 1, "View is destroyed.");
        assert.strictEqual(this.oResolveStub.callCount, 1, "Deferred is resolved.");
        assert.deepEqual(this.oResolveStub.args[0][0], oExpectedChanges, "Changes are as expected.");
    });

    QUnit.test("No groups were removed, but a group was added.", function (assert) {
        // Arrange
        var oGroupA = this.aGroups[0];
        oGroupA.selected = true;
        var oExpectedChanges = {
            addToGroups: [oGroupA.oGroup],
            removeFromGroups: [],
            newGroups: [],
            allGroups: this.aGroups
        };

        // Act
        this.oController._afterCloseHandler();

        // Assert
        assert.strictEqual(this.oViewDestroyStub.callCount, 1, "View is destroyed.");
        assert.strictEqual(this.oResolveStub.callCount, 1, "Deferred is resolved.");
        assert.deepEqual(this.oResolveStub.args[0][0], oExpectedChanges, "Changes are as expected.");
    });

    QUnit.test("Groups were added, removed and newly created.", function (assert) {
        // Arrange
        this.oController.sNewGroupId = "groupC";
        var oGroupA = this.aGroups[0];
        var oGroupB = this.aGroups[1];
        oGroupA.selected = true;
        oGroupB.selected = false;
        var oExpectedChanges = {
            addToGroups: [oGroupA.oGroup],
            removeFromGroups: [oGroupB.oGroup],
            newGroups: ["groupC"],
            allGroups: this.aGroups
        };

        // Act
        this.oController._afterCloseHandler();

        // Assert
        assert.strictEqual(this.oViewDestroyStub.callCount, 1, "View is destroyed.");
        assert.strictEqual(this.oResolveStub.callCount, 1, "Deferred is resolved.");
        assert.deepEqual(this.oResolveStub.args[0][0], oExpectedChanges, "Changes are as expected.");
    });

    QUnit.module("UI5 lifecycle handling", {
        beforeEach: function () {
            this.oRegisterSpy = sandbox.spy(Control.prototype, "register");
            this.oDeregisterSpy = sandbox.spy(Control.prototype, "deregister");
        },
        afterEach: function (assert) {
            var oControl;
            for (var i = 0; i < this.oRegisterSpy.callCount; i++) {
                oControl = this.oRegisterSpy.getCall(i).thisValue;

                assert.ok(this.oDeregisterSpy.thisValues.includes(oControl), oControl.getId() + " (" + oControl.getMetadata().getName() + ") has been destroyed.");
            }
            sandbox.restore();
        }
    });

    QUnit.test("The view and all controls are correctly destroyed", function () {
        // Arrange
        return View.create({
            viewName: "module:sap/ushell/components/appfinder/GroupListPopoverView",
            viewData: {
                enableHideGroups: false
            }
        }).then(function (oView) {
            // Act
            oView.destroy();

            // Assert
            // Done in afterEach
        });
    });

    QUnit.test("The view and all controls are correctly destroyed if enableHideGroups = true", function () {
        // Arrange
        return View.create({
            viewName: "module:sap/ushell/components/appfinder/GroupListPopoverView",
            viewData: {
                enableHideGroups: true
            }
        }).then(function (oView) {
            // Act
            oView.destroy();

            // Assert
            // Done in afterEach
        });
    });
});
