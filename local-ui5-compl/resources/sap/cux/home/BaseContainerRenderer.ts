/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import RenderManager from "sap/ui/core/RenderManager";
import BaseContainer from "./BaseContainer";
import { LayoutType } from "./library";

export default {
	apiVersion: 2,

	/**
	 * Renders the control.
	 *
	 * @public
	 * @override
	 * @param {RenderManager} rm - The RenderManager object.
	 * @param {BaseContainer} control - The BaseContainer control to be rendered.
	 */
	render: function (rm: RenderManager, control: BaseContainer) {
		rm.openStart("div", control).class("sapCuxBaseContainer");

		//Apply Layout based style classes
		if (control.getProperty("layout") === LayoutType.SideBySide) {
			rm.class("sapCuxSideBySide");
		} else if (control.getProperty("layout") === LayoutType.Horizontal) {
			rm.class("sapCuxHorizontal");
		} else {
			rm.class("sapCuxVertical");
		}

		//update width and height
		rm.style("width", control.getWidth());
		rm.style("height", control.getHeight());
		rm.openEnd();

		//render content
		this.renderContent(rm, control);

		rm.close("div");
	},

	/**
	 * Renders the content of the control.
	 *
	 * @private
	 * @param {RenderManager} rm - The RenderManager object.
	 * @param {BaseContainer} control - The BaseContainer control.
	 */
	renderContent: function (rm: RenderManager, control: BaseContainer) {
		if (control.getContent()?.length > 0) {
			//render header
			rm.openStart("div", control.getId() + "-header")
				.class("sapUiBaseContainerHeader")
				.openEnd();
			rm.renderControl(control._getHeader());
			rm.close("div");

			//render content
			rm.openStart("div", control.getId() + "-content")
				.class("sapUiBaseContainerContent")
				.openEnd();
			rm.renderControl(control._getInnerControl());
			rm.close("div");
		}
	}
};
