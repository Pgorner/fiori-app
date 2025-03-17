// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    "use strict";

    var Copilot = Control.extend("sap.ushell.demo.PluginAddFakeCopilot.Copilot", {
        metadata: {
            properties: {},
            events: {
                /**
                 * Event is fired when the user presses the item.
                 */
                press: {}
            }
        },
        renderer: {
            apiVersion: 2,

            /**
            * Renders the HTML for the Copilot, using the provided {@link sap.ui.core.RenderManager}.
            *
            * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the render output buffer.
            * @param {sap.ushell.demo.PluginAddFakeCopilot.Copilot} copilot Copilot to be rendered.
            */
            render: function (rm, copilot) {
                //copy from https://codepen.io/anon/pen/zyVRLp
                rm.openStart("div", copilot);
                rm.class("fakeCopilot");
                rm.openEnd(); // div - tag

                rm.openStart("svg");
                rm.class("svg-box-content");
                rm.attr("xmlns", "http://www.w3.org/2000/svg");
                rm.attr("viewBox", "0 0 323.7 329.7");
                rm.openEnd(); // svg - tag

                rm.openStart("defs");
                rm.openEnd(); // defs - tag

                rm.openStart("style");
                rm.openEnd(); // style - tag
                rm.text(".cls-1,.cls-2{fill:#ffffff;}.cls-1{opacity:0.3;}.cls-2{opacity:0.6;}");
                rm.close("style");
                rm.close("defs");

                rm.openStart("title");
                rm.openEnd(); // title - tag
                rm.text("Copiot SVG");
                rm.close("title");

                rm.openStart("g", "Behind_layer");
                rm.attr("data-name", "Behind layer");
                rm.openEnd(); // g - tag

                rm.voidStart("path");
                rm.class("cls-1");
                rm.attr("d", "M411,205c-3-30-35-55-47-66-29-45-54.9-54.6-94-59-44-5-69,16-87,28-23,7-64,19-84,56-21.7," +
                    "40.1-5,113,3,125-4,42,21,76,41,90s54,30,111.5,29.8C339,401,358,386,381,359s23-55,25-70C410,260,414,235,411,205ZM250," +
                    "399A149,149,0,1,1,399,250,149,149,0,0,1,250,399Z");
                rm.attr("transform", "translate(-88.3 -79.2)");
                rm.voidEnd(); // path - tag

                rm.close("g");

                rm.openStart("g", "Top_layer");
                rm.attr("data-name", "Top layer");
                rm.openEnd(); // g - tag

                rm.voidStart("path");
                rm.class("cls-2");
                rm.attr("d", "M405.2,238.4c-1-13-3-63-36-101S288.7,91.9,267.7,92.9c-15-1-60-9-106.5,19.5-58.9,36.1-64," +
                    "108-64,108-12,54,9,103,9,103s14,35,71.5,61.5c50,26,66.9,29,117,18,32-7,66.3-38.8,82.5-64.5a178.2,178.2,0,0,0,26-48C408." +
                    "1,277.4,406.2,251.4,405.2,238.4ZM250,399A149,149,0,1,1,399,250,149,149,0,0,1,250,399Z");
                rm.attr("transform", "translate(-88.3 -79.2)");
                rm.voidEnd(); // path - tag

                rm.close("g");

                rm.close("svg");
                rm.close("div");
            }
        }
    });

    Copilot.prototype.onclick = function (oEvent) {
        this.firePress(oEvent);
    };

    return Copilot;
});
