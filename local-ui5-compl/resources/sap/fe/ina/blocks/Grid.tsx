import type { PropertiesOf } from "sap/fe/base/ClassSupport";
import { defineUI5Class, property } from "sap/fe/base/ClassSupport";
import BuildingBlock from "sap/fe/core/buildingBlocks/BuildingBlock";
import DFGrid from "sap/sac/df/Grid";
import MetaPathHelper from "sap/sac/df/utils/MetaPathHelper";
import type { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";

/**
 * Building block for creating a dragonfly multidimensional grid
 * @experimental
 */
@defineUI5Class("sap.fe.ina.blocks.Grid")
export default class Grid extends BuildingBlock {
	@property({ type: "string", required: true })
	public id!: string;

	@property({ type: "string", required: false })
	public metaPath!: string;

	@property({ type: "string", required: false })
	public annotationPath?: string;

	@property({ type: "boolean", required: false, defaultValue: true })
	public showTitle!: boolean;

	@property({ type: "string", required: false })
	public height = "100%";

	@property({ type: "string", required: false })
	public width = "100%";

	constructor(idOrSettings: PropertiesOf<Grid>, settings?: PropertiesOf<Grid>) {
		super(idOrSettings, settings);
	}

	applySettings(mSettings: $ManagedObjectSettings, oScope?: object): this {
		super.applySettings(mSettings, oScope);
		this.content = this.createContent();
		return this;
	}

	createContent(): Grid {
		this.id = this.id + "::Grid";
		const sMetaPath = "mdm>" + MetaPathHelper.PathTo.DataProviders + this.metaPath;
		return (
			<DFGrid id={this.id} metaPath={sMetaPath} showTitle={this.showTitle} height={this.height} width={this.width}></DFGrid>
		) as Grid;
	}
}
