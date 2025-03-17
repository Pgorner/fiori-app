import type { PropertiesOf } from "sap/fe/base/ClassSupport";
import { defineUI5Class, property } from "sap/fe/base/ClassSupport";
import BuildingBlock from "sap/fe/core/buildingBlocks/BuildingBlock";
import DFFilterPanel from "sap/sac/df/FilterPanel";
import MetaPathHelper from "sap/sac/df/utils/MetaPathHelper";
import type { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";

/**
 * Building block for creating a dragonfly filter panel
 * @experimental
 */
@defineUI5Class("sap.fe.ina.blocks.FilterPanel")
export default class FilterPanel extends BuildingBlock {
	@property({ type: "string", required: true })
	public id!: string;

	@property({ type: "string", required: true })
	public metaPath!: string;

	constructor(idOrSettings: PropertiesOf<FilterPanel>, settings?: PropertiesOf<FilterPanel>) {
		super(idOrSettings, settings);
	}

	applySettings(mSettings: $ManagedObjectSettings, oScope?: object): this {
		super.applySettings(mSettings, oScope);
		this.content = this.createContent();
		return this;
	}

	createContent(): FilterPanel {
		this.id = this.id + "::FilterPanel";
		const sMetaPath = "mdm>" + MetaPathHelper.PathTo.DataProviders + this.metaPath + MetaPathHelper.PathTo.Dimensions;
		return (<DFFilterPanel id={this.id} metaPath={sMetaPath}></DFFilterPanel>) as FilterPanel;
	}
}
