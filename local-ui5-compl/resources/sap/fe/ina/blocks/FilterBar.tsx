import type { PropertiesOf } from "sap/fe/base/ClassSupport";
import { defineUI5Class, property } from "sap/fe/base/ClassSupport";
import BuildingBlock from "sap/fe/core/buildingBlocks/BuildingBlock";
import DFFilterBar from "sap/sac/df/FilterBar";
import MetaPathHelper from "sap/sac/df/utils/MetaPathHelper";

/**
 * Building block for creating a dragonfly filter bar
 * @experimental
 */
@defineUI5Class("sap.fe.ina.blocks.FilterBar")
export default class FilterBar extends BuildingBlock {
	@property({ type: "string", required: true })
	public id!: string;

	@property({ type: "string", required: true })
	metaPath!: string;

	constructor(idOrSettings: PropertiesOf<FilterBar>, settings?: PropertiesOf<FilterBar>) {
		super(idOrSettings, settings);
	}

	onMetadataAvailable(): void {
		const pageDef = this._getOwner()?.preprocessorContext?.getDefinitionForPage();
		if (pageDef) {
			const _filterBarDefinition = pageDef.getFilterBarDefinition({});
			//console.table(filterBarDefinition.getFilterFields())
		}
		this.content = this.createContent();
	}

	createContent(): FilterBar {
		this.id = this.id + "::FilterBar";
		const sMetaPath = "mdm>" + MetaPathHelper.PathTo.DataProviders + this.metaPath + MetaPathHelper.PathTo.Variables;
		return (<DFFilterBar id={this.id} metaPath={sMetaPath}></DFFilterBar>) as FilterBar;
	}
}
