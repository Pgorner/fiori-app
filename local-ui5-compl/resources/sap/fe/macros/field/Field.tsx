import type { PropertiesOf } from "sap/fe/base/ClassSupport";
import { defineUI5Class, implementInterface, xmlEventHandler } from "sap/fe/base/ClassSupport";
import type PageController from "sap/fe/core/PageController";
import { convertBuildingBlockMetadata } from "sap/fe/core/buildingBlocks/templating/BuildingBlockSupport";
import BuildingBlockWithTemplating from "sap/fe/macros/controls/BuildingBlockWithTemplating";
import InternalFieldBlock from "sap/fe/macros/internal/InternalField.block";
import type UI5Event from "sap/ui/base/Event";
import type { $ControlSettings } from "sap/ui/core/Control";

import type { IFormContent } from "sap/ui/core/library";

/**
 * Building block for creating a field based on the metadata provided by OData V4.
 * <br>
 * Usually, a DataField or DataPoint annotation is expected, but the field can also be used to display a property from the entity type.
 * When creating a Field building block, you must provide an ID to ensure everything works correctly.
 *
 * Usage example:
 * <pre>
 * sap.ui.require(["sap/fe/macros/field/Field"], function(Field) {
 * 	 ...
 * 	 new Field("MyField", {metaPath:"MyProperty"})
 * })
 * </pre>
 *
 * This is currently an experimental API because the structure of the generated content will change to come closer to the Field that you get out of templates.
 * The public method and property will not change but the internal structure will so be careful on your usage.
 * @public
 * @experimental
 * @mixes sap.fe.macros.Field
 */
@defineUI5Class("sap.fe.macros.field.Field", convertBuildingBlockMetadata(InternalFieldBlock))
export default class Field extends BuildingBlockWithTemplating implements IFormContent {
	@implementInterface("sap.ui.core.IFormContent")
	__implements__sap_ui_core_IFormContent = true;

	constructor(props?: PropertiesOf<InternalFieldBlock> & $ControlSettings, others?: $ControlSettings) {
		super(props, others);
		this.createProxyMethods(["getValue", "setValue", "getEnabled", "setEnabled", "addMessage", "removeMessage"]);
	}

	getFormDoNotAdjustWidth(): boolean {
		return (this.content as unknown as IFormContent)?.getFormDoNotAdjustWidth?.() ?? false;
	}

	@xmlEventHandler()
	_fireEvent(ui5Event: UI5Event, _controller: PageController, eventId: string): void {
		this.fireEvent(eventId, ui5Event.getParameters());
	}
}
