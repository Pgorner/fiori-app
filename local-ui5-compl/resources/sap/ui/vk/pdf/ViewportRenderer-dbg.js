/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"sap/ui/core/Element"
], (
	Element
) => {
	"use strict";

	function isRedlineTool(tool) {
		return tool.isA("sap.ui.vk.tools.RedlineTool");
	}

	function isTransformSvgElementTool(tool) {
		return tool.isA("sap.ui.vk.tools.TransformSvgElementTool");
	}

	function renderTools(rm, viewport, filterPredicate) {
		viewport.getTools()
			.map(toolId => Element.getElementById(toolId))
			.filter(tool => filterPredicate(tool))
			.map(tool => tool.getGizmoForContainer(viewport))
			.filter(gizmo => gizmo?.hasDomElement())
			.forEach(tool => rm.renderControl(tool));
	}

	return {
		apiVersion: 2,

		render(rm, viewport) {
			// The `div` elements are nested as follows:
			//
			// viewport                 the root element, non-scrollable
			//   scrollContainer        the scroll container element, the size of the viewport
			//    document              the whole PDF document, the size of all the pages plus the
			//                          gaps between the document pages. This is the scrollable
			//                          content.
			//      page                a single page
			//        canvas            the canvas of the full page, the size of the page
			//        stretchedCanvas   the low-res thumbnail of the full page, the size of the page
			//        highResCanvas     the high-res canvas of the visible part of the page, the size
			//                          is the intersection of `stretchedCanvas` and the viewport
			//      page                a single page; `highResCanvas` is positioned on top of
			//                          `stretchedCanvas`
			//        ...
			//
			// NOTE 1: Multiple pages are not supported yet.
			// NOTE 2: `(stretchedCanvas, highResCanvas)` and `canvas` are mutually exclusive.

			/* eslint-disable no-lone-blocks */

			// viewport begins
			{
				rm.openStart("div", viewport);
				rm.class("sapVizKitViewport");
				rm.class("sapVizKitPDFViewport");
				rm.attr("tabindex", 0);
				rm.attr("aria-label", "Image");
				rm.attr("role", "figure");
				rm.style("width", viewport.getWidth());
				rm.style("height", viewport.getHeight());
				rm.openEnd();

				viewport.renderContent(rm);
				renderTools(rm, viewport, tool => !(isRedlineTool(tool) || isTransformSvgElementTool(tool)));

				// scroll container begins
				{
					rm.openStart("div", viewport.getId() + "-scrollContainer");
					rm.class("sapVizKitPDFScrollContainer");
					rm.openEnd();

					// document begins
					{
						rm.openStart("div", viewport.getId() + "-document");
						rm.class("sapVizKitPDFDocument");
						rm.openEnd();

						// page begins
						{
							// NOTE: Multiple pages are not supported yet. When they are supported,
							// maybe they should be created dynamically by the Viewport control.

							rm.openStart("div", viewport.getId() + "-page");
							rm.class("sapVizKitPDFPage");
							rm.style("--sapUiVizKitRedlineScale", viewport._scale);
							rm.openEnd();

							// The RedlineTool is rendered on top of the PDF content. Technically,
							// its DOM element is added before the canvas elements, but its
							// `z-index` is higher than the canvas elements, so it is rendered on
							// top.
							renderTools(rm, viewport, tool => isRedlineTool(tool) || isTransformSvgElementTool(tool));

							// The hotspot surface will be added here in the `onAfterRendering`
							// method.

							// The canvas elements will be added here in the `onAfterRendering`
							// method.
							//
							// _normalCanvas
							// or
							// _stretchedCanvas
							// _highResCanvas

							rm.close("div");
						}
						// page ends

						rm.close("div");
					}
					// document ends

					rm.close("div");
				}
				// scroll container ends

				rm.close("div");
			}
			// viewport ends

			/* eslint-enable no-lone-blocks */
		}
	};
});
