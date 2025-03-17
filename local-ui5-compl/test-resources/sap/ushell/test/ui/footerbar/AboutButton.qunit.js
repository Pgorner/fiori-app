// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
sap.ui.define([
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ushell/Container",
    "sap/ushell/ui/footerbar/AboutButton",
    "sap/ushell/ui/footerbar/AboutDialog.controller",
    "sap/ui/core/Fragment"
], function (
    Config,
    resources,
    Container,
    AboutButton,
    AboutDialogController,
    Fragment
) {
    "use strict";
    /* global QUnit sinon */
    var sandbox = sinon.sandbox.create();

    QUnit.module("sap.ushell.ui.footerbar.AboutButton", {
        beforeEach: function () {
            this.oAboutButton = new AboutButton();
        },
        afterEach: function () {
            this.oAboutButton.destroy();
        }
    });

    QUnit.test("init: should instantiate the about button", function (assert) {
        // Assert
        assert.strictEqual(this.oAboutButton.getIcon(), "sap-icon://hint", "button icon is correct");
        assert.strictEqual(this.oAboutButton.getText(), resources.i18n.getText("about"), "button title is correct");
    });

    QUnit.module("The showAboutDialog function", {
        beforeEach: function (assert) {
            var done = assert.async();
            this.oAboutDialogController = new AboutDialogController();
            sandbox.stub(this.oAboutDialogController, "_setupAboutDialogModel");
            sandbox.stub(this.oAboutDialogController, "_getSplitAppObj").returns({
                isMasterShown: sandbox.stub().returns(true),
                backToTopMaster: sandbox.stub(),
                showMaster: sandbox.stub(),
                hideMaster: sandbox.stub()

            });

            var oFragmentByIdStub = sandbox.stub(Fragment, "byId");
            oFragmentByIdStub.withArgs("aboutDialogFragment", "aboutDialogMenuButton").returns({
                oMenuButton: sandbox.stub(),
                setVisible: sandbox.stub(),
                setPressed: sandbox.stub(),
                setTooltip: sandbox.stub()
            });

            oFragmentByIdStub.withArgs("aboutDialogFragment", "aboutDialogEntryList").returns({
                setSelectedItem: sandbox.stub(),
                getItems: sandbox.stub().returns([{}, {}])
            });

            this.oAboutButton = new AboutButton();
            this.oAboutButton.init();
            Fragment.load({
                name: "sap.ushell.ui.footerbar.AboutDialog",
                type: "XML",
                controller: this.oAboutDialogController
            }).then(function (dialog) {
                this.oAboutDialog = dialog;
                this.oFragmentLoadStub = sandbox.stub(Fragment, "load").returns(Promise.resolve(this.oAboutDialog));
            }.bind(this)).finally(done);
        },
        afterEach: function () {
            this.oAboutDialog.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("should set the i18n model to the About Dialog.", function (assert) {
        // Arrange
        var done = assert.async();
        assert.expect(2);
        this.oSetModelSpy = sandbox.spy(this.oAboutDialog, "setModel");

        // Act
        this.oAboutButton.showAboutDialog().then(function () {
            // Assert
            assert.ok(this.oSetModelSpy.calledOnce, "The dialog's setModel function was called once.");
            assert.ok(!!this.oAboutDialog.getModel("i18n"), "The i18n model was set to the About Dialog.");
            done();
        }.bind(this));
    });

    QUnit.test("should open the About Dialog.", function (assert) {
        // Arrange
        var done = assert.async();
        assert.expect(1);
        this.oOpenSpy = sandbox.spy(this.oAboutDialog, "open");

        // Act
        this.oAboutButton.showAboutDialog().then(function () {
            // Assert
            assert.ok(this.oOpenSpy.calledOnce, "The dialog's open function was called once.");
            done();
        }.bind(this));
    });
}, /* bExport= */false);
