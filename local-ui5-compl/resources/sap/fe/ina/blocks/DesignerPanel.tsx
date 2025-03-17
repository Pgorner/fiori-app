import type { PropertiesOf } from "sap/fe/base/ClassSupport";
import { defineUI5Class, property } from "sap/fe/base/ClassSupport";
import BuildingBlock from "sap/fe/core/buildingBlocks/BuildingBlock";
import DFDesignerPanel from "sap/sac/df/DesignerPanel";
import MetaPathHelper from "sap/sac/df/utils/MetaPathHelper";
import type { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";

/**
 * Building block for creating a dragonfly designer panel
 * @experimental
 */
@defineUI5Class("sap.fe.ina.blocks.DesignerPanel")
export default class DesignerPanel extends BuildingBlock {
	@property({ type: "string", required: true })
	public id!: string;

	@property({ type: "string", required: true })
	public metaPath!: string;

	@property({ type: "string", required: false, defaultValue: true })
	public hideAvailableObjects!: boolean;

	@property({ type: "string", required: false })
	public height = "100%";

	@property({ type: "string", required: false })
	public width = "100%";

	constructor(idOrSettings: PropertiesOf<DesignerPanel>, settings?: PropertiesOf<DesignerPanel>) {
		super(idOrSettings, settings);
	}

	applySettings(mSettings: $ManagedObjectSettings, oScope?: object): this {
		super.applySettings(mSettings, oScope);
		this.content = this.createContent();
		return this;
	}

	createContent(): DesignerPanel {
		this.id = this.id + "::DesignerPanel";
		const sMetaPath = "mdm>" + MetaPathHelper.PathTo.DataProviders + this.metaPath;
		return (
			<DFDesignerPanel
				id={this.id}
				metaPath={sMetaPath}
				hideAvailableObjects={this.hideAvailableObjects}
				height={this.height}
				width={this.width}
			></DFDesignerPanel>
		) as DesignerPanel;
	}
}
