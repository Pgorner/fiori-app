// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    /**
     * @namespace
     * @description Page renderer.
     */
    var PageRenderer = {
        apiVersion: 2
    };

    /**
     * Renders the HTML for the given control, using the provided
     * {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} rm
     *            The RenderManager that can be used for writing to the render
     *            output buffer
     * @param {sap.ushell.ui.launchpad.Page} page
     *            Page control that should be rendered
     */
    PageRenderer.render = function (rm, page) {
        const aVisibleSections = page.getSections().filter((oSection) => {
            return page.getEdit() || (oSection.getShowSection() && oSection.getVisible());
        });
        const iNrOfVisualSections = aVisibleSections.length;
        const sDataHelpId = page.getDataHelpId();
        const sTitle = page.getTitle();

        rm.openStart("div", page);
        rm.class("sapUshellPage");
        rm.class("sapContrastPlus");
        rm.attr("role", "region");
        rm.attr("aria-label", sTitle);
        rm.attr("data-sap-ui-customfastnavgroup", "true");
        if (sDataHelpId) {
            rm.attr("data-help-id", sDataHelpId);
        }
        rm.openEnd(); // div - tag

        if (page.getEdit() && page.getAggregation("messageStrip")) {
            rm.renderControl(page.getAggregation("messageStrip"));
        }

        rm.openStart("h2", page.getId() + "-title");
        rm.class("sapMTitle");
        rm.class("sapUshellPageTitle");
        if (!page.getShowTitle()) {
            rm.class("sapUiPseudoInvisibleText");
        }
        rm.attr("aria-level", "2");
        rm.openEnd(); // h2 - tag
        rm.text(sTitle);
        rm.close("h2");

        if (page.getEdit() && !iNrOfVisualSections) {
            rm.renderControl(page.getAggregation("_addSectionButtons")[0]);
        }

        // render "NoSectionsText" when there are no visible sections
        if (!iNrOfVisualSections && page.getShowNoSectionsText()) {
            rm.renderControl(page.getAggregation("_noSectionText"));
        }

        let index;
        let oSection;
        for (index = 0; index < iNrOfVisualSections; index++) {
            oSection = aVisibleSections[index];
            rm.openStart("div");
            rm.class("sapUshellPageSection");
            rm.openEnd(); // div - tag
            rm.renderControl(oSection);
            if (page.getEdit()) {
                rm.renderControl(page.getAggregation("_addSectionButtons")[index + 1]);
            }
            rm.close("div");
        }

        rm.close("div");
    };

    return PageRenderer;
});
