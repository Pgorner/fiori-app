import { defineUI5Class, xmlEventHandler, type PropertiesOf } from "sap/fe/base/ClassSupport";

import type PageController from "sap/fe/core/PageController";
import { convertBuildingBlockMetadata } from "sap/fe/core/buildingBlocks/templating/BuildingBlockSupport";
import BuildingBlockWithTemplating from "sap/fe/macros/controls/BuildingBlockWithTemplating";
import MicroChartBlock from "sap/fe/macros/microchart/MicroChart.block";
import type UI5Event from "sap/ui/base/Event";
import type { $ControlSettings } from "sap/ui/mdc/Control";

/**
 * Building block used to create a MicroChart based on the metadata provided by OData V4.
 *
 * Usage example:
 * <pre>
 * sap.ui.require(["sap/fe/macros/microchart/MicroChart"], function(MicroChart) {
 * 	 ...
 * 	 new MicroChart("microChartID", {metaPath:"MyProperty"})
 * })
 * </pre>
 *
 * This is currently an experimental API because the structure of the generated content will change to come closer to the MicroChart that you get out of templates.
 * The public method and property will not change but the internal structure will so be careful on your usage.
 * @public
 * @experimental
 * @mixes sap.fe.macros.MicroChart
 */
@defineUI5Class("sap.fe.macros.microchart.MicroChart", convertBuildingBlockMetadata(MicroChartBlock))
export default class MicroChart extends BuildingBlockWithTemplating {
	constructor(props?: PropertiesOf<MicroChartBlock> & $ControlSettings, others?: $ControlSettings) {
		super(props, others);
	}

	@xmlEventHandler()
	_fireEvent(ui5Event: UI5Event, _controller: PageController, eventId: string): void {
		this.fireEvent(eventId, ui5Event.getParameters());
	}
}
