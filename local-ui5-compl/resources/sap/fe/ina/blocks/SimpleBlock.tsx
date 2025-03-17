import type { PropertiesOf } from "sap/fe/base/ClassSupport";
import { defineUI5Class, property } from "sap/fe/base/ClassSupport";
import BuildingBlock from "sap/fe/core/buildingBlocks/BuildingBlock";
import Label from "sap/m/Label";
import type { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";

@defineUI5Class("sap.fe.ina.blocks.SimpleBlock")
export default class SimpleBlock extends BuildingBlock {
	@property({ type: "string" })
	myProp?: string;

	constructor(idOrSettings: PropertiesOf<SimpleBlock>, settings?: PropertiesOf<SimpleBlock>) {
		super(idOrSettings, settings);
	}

	applySettings(mSettings: $ManagedObjectSettings, oScope?: object): this {
		super.applySettings(mSettings, oScope);
		this.content = <Label text={this.myProp} />;
		return this;
	}
}
