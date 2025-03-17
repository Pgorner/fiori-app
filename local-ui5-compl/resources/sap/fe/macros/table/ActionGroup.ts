import { aggregation, defineUI5Class, property } from "sap/fe/base/ClassSupport";
import BuildingBlockObjectProperty from "sap/fe/macros/controls/BuildingBlockObjectProperty";
import Action from "sap/fe/macros/table/Action";

/**
 * Definition of a custom ActionGroup to be used inside the table toolbar
 * @public
 */
@defineUI5Class("sap.fe.macros.table.ActionGroup")
export default class ActionGroup extends BuildingBlockObjectProperty {
	/**
	 * Unique identifier of the ActionGroup
	 * @public
	 */
	@property({ type: "string" })
	key!: string;

	/**
	 * Defines nested actions
	 * @public
	 */
	@aggregation({ type: "sap.fe.macros.table.Action", multiple: true, defaultClass: Action, isDefault: true })
	actions: Action[] = [];

	/**
	 * The text that will be displayed for this action group
	 * @public
	 */
	@property({ type: "string" })
	text!: string;

	/**
	 * Reference to the key of another action or action group already displayed in the toolbar to properly place this one
	 * @public
	 */
	@property({ type: "string" })
	anchor?: string;

	/**
	 * Defines where this action group should be placed relative to the defined anchor
	 *
	 * Allowed values are `Before` and `After`
	 * @public
	 */
	@property({ type: "string" })
	placement?: "Before" | "After";
}
