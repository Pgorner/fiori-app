// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Element",
    "sap/ui/core/EventBus",
    "sap/ui/core/UIComponent",
    "sap/m/SearchField",
    "sap/ushell/components/shell/SearchCEP/SearchCEP.controller",
    "sap/base/Log",
    "sap/ushell/resources",
    "sap/ui/core/IconPool",
    "sap/ui/Device",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/Container"
], function (
    Element,
    EventBus,
    UIComponent,
    SearchField,
    SearchCEPController,
    Log,
    resources,
    IconPool,
    Device,
    jQuery,
    UrlParsing,
    Container
) {
    "use strict";

    return UIComponent.extend("sap.ushell.components.shell.SearchCEP.Component", {
        metadata: {
            version: "1.132.1",
            library: ["sap.ushell", "sap.ushell.components.shell"],
            dependencies: {
                libs: ["sap.m"]
            }
        },

        createContent: function () {
            try {
                this.oRenderer = Container.getRendererInternal("fiori2");
                this.oShellHeader = Element.getElementById("shell-header");
                // create search Icon
                this.oRenderer.addHeaderEndItem({
                    id: "sf",
                    tooltip: "{i18n>openSearchBtn}",
                    text: "{i18n>search}",
                    ariaLabel: "{i18n>openSearchBtn}",
                    icon: IconPool.getIconURI("search"),
                    visible: true,
                    press: this.onShellSearchButtonPressed.bind(this)
                }, true, false);
                this.oShellSearchBtn = Element.getElementById("sf");
                this.oShellSearchBtn.data("help-id", "shellHeader-search", true);
                this.oShellSearchBtn.addEventDelegate({
                    onkeydown: this._keyDownSearchBtn.bind(this)
                });
                // create search field on shell header
                var oSearchConfig = {
                    width: "90%",
                    placeholder: resources.i18n.getText("search"),
                    tooltip: resources.i18n.getText("search"),
                    enableSuggestions: true,
                    suggest: this.onSuggest.bind(this),
                    search: this.onSearch.bind(this)
                };
                this.oSF = new SearchField("PlaceHolderSearchField", oSearchConfig);
                this.oSF.addStyleClass("sapUshellCEPSearchCenter");

                var sScreenSize = this.getScreenSize();
                if (sScreenSize === "S") {
                    this.initSearchSSize();
                } else if (sScreenSize === "M" || sScreenSize === "L") {
                    this.initSearchMLSizes();
                } else if (sScreenSize === "XL") {
                    this.initSearchXLSize();
                }

                this.oShellHeader.setSearch(this.oSF);
                this.oSearchCEPController = new SearchCEPController();

                this.oSF.addEventDelegate({
                    onfocusin: this._onfocusin.bind(this),
                    onAfterRendering: this._onAfterRendering.bind(this)
                });
                this.oSearchCEPController.getHomePageApps();
            } catch (error) {
                Log.info("Failed to create CEP search field content" + error);
            }
            EventBus.getInstance().publish("shell", "searchCompLoaded", { delay: 0 });
        },

        initSearchSSize: function () {
            this.oSF.setWidth("60%");
            this.oShellHeader.setSearchState("COL", 35, false);
        },

        initSearchMLSizes: function () {
            this.oShellHeader.setSearchState("COL", 35, false);
        },

        initSearchXLSize: function () {
            this.oShellSearchBtn.setVisible(false);
            this.oShellHeader.setSearchState("EXP", 35, false);
        },

        _onAfterRendering: function (event) {

            // align search field vertically
            var oShellHeaderSearch = jQuery(this.oShellHeader.getDomRef()).find("#shell-header-hdr-search");
            oShellHeaderSearch.addClass("CEPShellHeaderPadding");

            // add tooltip to Search Placeholder icon
            jQuery(this.oSF.getDomRef()).find("#PlaceHolderSearchField-search").attr("title", resources.i18n.getText("search"));

            var sUrl = Container.getFLPUrl(true),
                sHash = UrlParsing.getHash(sUrl),
                sIntent = sHash.split("&/")[0];

            if (this.oSF.getValue()) {
                // prevent opening popover after navigation to Results page
                if (sIntent === "Action-search" || sIntent === "WorkZoneSearchResult-display") {
                    jQuery(this.oSF.getDomRef()).blur();
                }
            }
        },

        _onfocusin: function (event) {
            if (this.oSF.getEnableSuggestions() && Device.system.phone) {
                // eslint-disable-next-line no-undef
                jQuery(this.oSF.getDomRef()).find("input").attr("inputmode", "search");
            }
        },

        onSuggest: function (event) {
            if (this.oSF.getEnableSuggestions() && Device.system.phone) {
                // eslint-disable-next-line no-undef
                jQuery(this.oSF.getDomRef()).find("input").attr("inputmode", "search");
            }
            if (Element.getElementById("CEPSearchField")) {
                this.oSearchCEPController.onSuggest(event);
            } else {
                this.oSearchCEPController.onInit();
            }
        },

        onSearch: function (event) {
            if (Element.getElementById("CEPSearchField")) {
                this.oSearchCEPController.onSearch(event);
            }
        },

        exit: function () {
            this.oSearchCEPController.onExit();
        },

        expandSearch: function () {
            this.oShellHeader.setSearchState("EXP_S", 35, false);
            this.oSF.focus();
        },

        onShellSearchButtonPressed: function () {
            this.oShellSearchBtn.setVisible(false);
            this.expandSearch();
        },

        collapseSearch: function () {
            this.oShellHeader.setSearchState("COL", 35, false);
            this.oShellSearchBtn.setVisible(true);
        },

        getScreenSize: function () {
            var oScreenSize = Device.media.getCurrentRange(Device.media.RANGESETS.SAP_STANDARD_EXTENDED);
            if (oScreenSize.from >= 1440) {
                return "XL";
            } else if (oScreenSize.from >= 1024) {
                return "L";
            } else if (oScreenSize.from >= 600) {
                return "M";
            } else if (oScreenSize.from >= 0) {
                return "S";
            }
        },

        _keyDownSearchBtn: function (event) {
            if (event.code === 13 || event.code === "Enter") {
                setTimeout(function () {
                    this.oSF.focus();
                }.bind(this), 500);
            }
        }
    });
});
