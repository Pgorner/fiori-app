import DynamicPage from "sap/f/DynamicPage";
import DynamicPageTitle from "sap/f/DynamicPageTitle";
import type { PropertiesOf } from "sap/fe/base/ClassSupport";
import { aggregation, defineUI5Class, property } from "sap/fe/base/ClassSupport";
import BuildingBlock from "sap/fe/core/buildingBlocks/BuildingBlock";
import BusyLocker from "sap/fe/core/controllerextensions/BusyLocker";
import CommandExecution from "sap/fe/core/controls/CommandExecution";
import ObjectTitle from "sap/fe/macros/ObjectTitle";
import FlexBox from "sap/m/FlexBox";
import Title from "sap/m/Title";
import type Control from "sap/ui/core/Control";
import type Context from "sap/ui/model/odata/v4/Context";

/**
 * Provides a page building block that can be used to create a page with a title, content and actions.
 * By default, the page comes with an ObjectTitle
 */
@defineUI5Class("sap.fe.macros.Page")
export default class Page extends BuildingBlock {
	@aggregation({ type: "sap.ui.core.Control", multiple: true, isDefault: true })
	items!: Control[];

	@aggregation({ type: "sap.ui.core.Control", multiple: true })
	actions!: Control[];

	@property({ type: "string" })
	title?: string;

	@property({ type: "boolean" })
	editable = false;

	constructor(idOrSettings: string);

	constructor(idOrSettings: PropertiesOf<Page>);

	constructor(idOrSettings: string | PropertiesOf<Page>, settings?: PropertiesOf<Page>) {
		super(idOrSettings, settings);
	}

	onMetadataAvailable(): void {
		this.content = this.createContent();
	}

	createContent(): DynamicPage {
		return (
			<DynamicPage id={this.createId("page")}>
				{{
					title: (
						<DynamicPageTitle id={this.createId("title")}>
							{{
								heading: this.title ? (
									<Title id={this.createId("titleContent")} text={this.title} />
								) : (
									<ObjectTitle id={this.createId("titleContent")} />
								),
								actions: this.actions
							}}
						</DynamicPageTitle>
					),
					content: (
						<FlexBox id={this.createId("content")} direction="Column">
							{{
								items: this.items.map((item) => {
									item.addStyleClass("sapUiMediumMarginBottom");
									return item;
								})
							}}
						</FlexBox>
					),
					dependents: [
						<CommandExecution
							execute={(): void => {
								const oContext = this.getBindingContext() as Context;
								const oModel = this.getModel("ui")!;
								BusyLocker.lock(oModel);
								this.getPageController()
									?.editFlow?.editDocument(oContext)
									.finally(function () {
										BusyLocker.unlock(oModel);
									});
							}}
							enabled={true}
							visible={true}
							command="Edit"
						/>
					]
				}}
			</DynamicPage>
		);
	}
}
