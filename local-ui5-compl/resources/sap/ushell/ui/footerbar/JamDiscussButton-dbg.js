// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.footerbar.JamDiscussButton.
sap.ui.define([
    "sap/base/Log",
    "sap/m/Button",
    // will load the renderer async
    "sap/m/ButtonRenderer",
    "sap/ui/core/Component",
    "sap/ushell/resources",
    "sap/ushell/Container"
], function (
    Log,
    Button,
    ButtonRenderer,
    Component,
    resources,
    Container
) {
    "use strict";

    /**
     * @alias sap.ushell.ui.footerbar.JamDiscussButton
     * @class
     * @classdesc Constructor for a new ui/footerbar/JamDiscussButton.
     * Add your documentation for the new ui/footerbar/JamDiscussButton
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @extends sap.m.Button
     *
     * @since 1.15.0
     * @private
     */
    var JamDiscussButton = Button.extend("sap.ushell.ui.footerbar.JamDiscussButton", /** @lends sap.ushell.ui.footerbar.JamDiscussButton.prototype */ {
        metadata: {
            library: "sap.ushell",
            properties: {
                beforePressHandler:
                    { type: "any", group: "Misc", defaultValue: null },
                afterPressHandler:
                    { type: "any", group: "Misc", defaultValue: null },
                jamData:
                    { type: "object", group: "Misc", defaultValue: null }
            }
        },
        renderer: ButtonRenderer
    });

    JamDiscussButton.prototype.init = function () {
        var that = this;

        // call the parent sap.m.Button init method
        if (Button.prototype.init) {
            Button.prototype.init.apply(this, arguments);
        }

        this.setEnabled(); // disables button if shell not initialized or Jam not active
        this.setIcon("sap-icon://discussion-2");
        this.setText(resources.i18n.getText("discussBtn"));

        this.attachPress(function () {
            if (that.getBeforePressHandler()) {
                that.getBeforePressHandler()();
            }
            this.showDiscussDialog(that.getAfterPressHandler());
        });
    };

    JamDiscussButton.prototype.showDiscussDialog = function (cb) {
        if (!this.discussComponentPromise) {
            this.discussComponentPromise = Component.create({
                name: "sap.collaboration.components.fiori.feed.dialog",
                settings: this.getJamData()
            });
        }
        return this.discussComponentPromise.then(function (discussComponent) {
            discussComponent.open();
            // TODO: call callback after dialog vanishes
            if (cb) {
                cb();
            }
        });

    };

    JamDiscussButton.prototype.setEnabled = function (bEnabled) {
        if (!Container) {
            if (this.getEnabled()) {
                Log.warning(
                    "Disabling JamDiscussButton: unified shell container not initialized",
                    null,
                    "sap.ushell.ui.footerbar.JamDiscussButton"
                );
            }
            bEnabled = false;
        } else {
            var user = Container.getUser();
            if (!(user && user.isJamActive())) {
                if (this.getEnabled()) {
                    Log.info(
                        "Disabling JamDiscussButton: user not logged in or Jam not active",
                        null,
                        "sap.ushell.ui.footerbar.JamDiscussButton"
                    );
                }
                bEnabled = false;
                this.setVisible(false);
            }
        }
        Button.prototype.setEnabled.call(this, bEnabled);
    };

    return JamDiscussButton;
});
