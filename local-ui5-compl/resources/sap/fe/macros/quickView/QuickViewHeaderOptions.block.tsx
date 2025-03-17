import type { EntityType, Property, ServiceObject } from "@sap-ux/vocabularies-types";
import type * as Edm from "@sap-ux/vocabularies-types/Edm";
import type {
	DataField,
	DataFieldAbstractTypes,
	DataFieldForAction,
	DataFieldForIntentBasedNavigation,
	DataFieldTypes,
	DataFieldWithNavigationPath,
	DataFieldWithUrl,
	HeaderInfoType
} from "@sap-ux/vocabularies-types/vocabularies/UI";
import type { BindingToolkitExpression } from "sap/fe/base/BindingToolkit";
import { compileExpression, getExpressionFromAnnotation, type CompiledBindingToolkitExpression } from "sap/fe/base/BindingToolkit";
import type { PropertiesOf } from "sap/fe/base/ClassSupport";
import { defineReference } from "sap/fe/base/ClassSupport";
import type { Ref } from "sap/fe/base/jsx-runtime/jsx";
import { blockAttribute, defineBuildingBlock } from "sap/fe/core/buildingBlocks/templating/BuildingBlockSupport";
import type { TemplateProcessorSettings } from "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor";
import RuntimeBuildingBlock from "sap/fe/core/buildingBlocks/templating/RuntimeBuildingBlock";
import * as MetaModelConverter from "sap/fe/core/converters/MetaModelConverter";
import { convertTypes, getInvolvedDataModelObjects } from "sap/fe/core/converters/MetaModelConverter";
import { isDataField } from "sap/fe/core/converters/annotations/DataField";
import { isEntityType } from "sap/fe/core/helpers/TypeGuards";
import type { DataModelObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { getDisplayMode } from "sap/fe/core/templating/UIFormatters";
import FieldHelper from "sap/fe/macros/field/FieldHelper";
import { getDataModelObjectPathForValue, getTextBinding } from "sap/fe/macros/field/FieldTemplating";
import type { LinkDelegatePayload } from "sap/fe/macros/quickView/QuickViewDelegate";
import Avatar from "sap/m/Avatar";
import AvatarShape from "sap/m/AvatarShape";
import Link from "sap/m/Link";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import VBox from "sap/m/VBox";
import coreLibrary from "sap/ui/core/library";
import HorizontalLayout from "sap/ui/layout/HorizontalLayout";
import VerticalLayout from "sap/ui/layout/VerticalLayout";
import type Context from "sap/ui/model/Context";
import type ODataMetaModel from "sap/ui/model/odata/v4/ODataMetaModel";

@defineBuildingBlock({ name: "QuickViewHeaderOptions", namespace: "sap.fe.macros" })
export default class QuickViewHeaderOptionsBlock extends RuntimeBuildingBlock {
	@blockAttribute({ type: "sap.ui.model.Context", required: true })
	public contextPath!: Context;

	@blockAttribute({ type: "object", required: true })
	public semanticPayload!: LinkDelegatePayload;

	@blockAttribute({
		type: "string"
	})
	id?: string;

	@blockAttribute({
		type: "string"
	})
	titleLink?: string;

	@defineReference()
	horizontalLayout!: Ref<HorizontalLayout>;

	visible = true;

	private readonly settings: TemplateProcessorSettings;

	private readonly entityType?: EntityType;

	private readonly dataFieldValue?: DataModelObjectPath<Property>;

	private readonly convertedDataField?:
		| DataField
		| DataFieldForAction
		| DataFieldForIntentBasedNavigation
		| DataFieldWithUrl
		| DataFieldWithNavigationPath;

	private readonly headerInfo: HeaderInfoType | undefined;

	private icon: CompiledBindingToolkitExpression | Edm.String | undefined;

	private fallbackIcon: CompiledBindingToolkitExpression | undefined;

	private title: BindingToolkitExpression<string> | CompiledBindingToolkitExpression | undefined;

	private description: BindingToolkitExpression<string> | CompiledBindingToolkitExpression | Edm.String | undefined;

	public isInitialized?: Promise<void>;

	constructor(
		props: PropertiesOf<QuickViewHeaderOptionsBlock>,
		controlConfiguration: TemplateProcessorSettings,
		settings: TemplateProcessorSettings
	) {
		super(props, controlConfiguration, settings);
		this.settings = settings;
		const convertedTypes = convertTypes(this.contextPath.getModel() as ODataMetaModel);
		const contextObject = convertedTypes.resolvePath<ServiceObject>(this.contextPath.getPath());
		const targetObject = contextObject.target;
		if (isEntityType(targetObject)) {
			this.entityType = targetObject;
			this.headerInfo = this.entityType?.annotations.UI?.HeaderInfo;
		} else if (isDataField(targetObject)) {
			const contextObjectDataModelObjectPath = getInvolvedDataModelObjects<
				DataField | DataFieldForAction | DataFieldForIntentBasedNavigation | DataFieldWithUrl | DataFieldWithNavigationPath
			>(this.contextPath);
			this.convertedDataField = MetaModelConverter.convertMetaModelContext(this.contextPath) as
				| DataField
				| DataFieldForAction
				| DataFieldForIntentBasedNavigation
				| DataFieldWithUrl
				| DataFieldWithNavigationPath;
			this.dataFieldValue = getDataModelObjectPathForValue(contextObjectDataModelObjectPath);
		}
	}

	setHeaderDisplayParametersForDataField(): void {
		if (this.dataFieldValue && this.convertedDataField) {
			if (this.convertedDataField?.IconUrl) {
				this.icon = this.convertedDataField.IconUrl;
				this.fallbackIcon = "sap-icon://product";
			} else {
				this.icon = undefined;
				this.fallbackIcon = undefined;
			}
			this.title = getTextBinding(this.dataFieldValue, {
				displayMode: getDisplayMode(this.dataFieldValue)
			});
			this.description = this.convertedDataField.Label
				? compileExpression(this.convertedDataField.Label)
				: compileExpression((this.convertedDataField as DataFieldTypes).Value?.$target?.annotations?.Common?.Label);
		}
	}

	setHeaderDisplayParametersForEntityType(): void {
		if (this.entityType) {
			const iconExpression = this.headerInfo?.ImageUrl
				? getExpressionFromAnnotation(this.headerInfo.ImageUrl)
				: getExpressionFromAnnotation(this.headerInfo?.TypeImageUrl);
			const iconExpressionCompiled = compileExpression(iconExpression);
			this.icon = iconExpressionCompiled === "undefined" ? undefined : iconExpressionCompiled;
			if (this.headerInfo?.TypeImageUrl) {
				this.fallbackIcon = compileExpression(this.headerInfo.TypeImageUrl);
			} else if (this.entityType?.annotations.Common?.IsNaturalPerson?.valueOf() === true) {
				this.fallbackIcon = "sap-icon://person-placeholder";
			} else {
				this.fallbackIcon = "sap-icon://product";
			}
			if ((this.headerInfo?.Title as DataField)?.Value) {
				const headerTitle = getInvolvedDataModelObjects<DataFieldAbstractTypes>(
					this.contextPath.getModel().createBindingContext("@com.sap.vocabularies.UI.v1.HeaderInfo/Title/Value", this.contextPath)
				);
				const titleExpression = getTextBinding(headerTitle, {
					displayMode: getDisplayMode(headerTitle)
				});
				this.title = titleExpression !== "{}" ? titleExpression : undefined;
			}
			const headerDescription = getInvolvedDataModelObjects<DataFieldAbstractTypes>(
				this.contextPath
					.getModel()
					.createBindingContext("@com.sap.vocabularies.UI.v1.HeaderInfo/Description/Value", this.contextPath)
			);
			const headerExpression =
				headerDescription.targetObject &&
				getTextBinding(headerDescription, {
					displayMode: getDisplayMode(headerDescription)
				});
			this.description =
				headerDescription.targetObject === undefined
					? compileExpression({ _type: "PathInModel", modelName: "semantic", path: "propertyPathLabel" })
					: headerExpression;
		}
	}

	async getSemanticObjectsPrimaryActions(): Promise<void> {
		if (await FieldHelper.checkPrimaryActions(this.semanticPayload, false, this.settings.appComponent)) {
			const primaryAction = FieldHelper.getPrimaryAction(this.semanticPayload);
			this.titleLink = primaryAction;
		}
		this.setupTitle();
	}

	getContent(): VBox {
		let avatar;
		this.setHeaderDisplayParametersForDataField();
		this.setHeaderDisplayParametersForEntityType();
		this.isInitialized = this.getSemanticObjectsPrimaryActions();
		if (this.icon && this.fallbackIcon) {
			avatar = (
				<Avatar
					class="sapMQuickViewThumbnail sapUiTinyMarginEnd"
					src={this.icon}
					displayShape={
						this.entityType?.annotations.Common?.IsNaturalPerson?.valueOf() === true ? AvatarShape.Circle : AvatarShape.Square
					}
					fallbackIcon={this.fallbackIcon}
				/>
			);
		}
		const hLayout = (
			<HorizontalLayout class="sapUiSmallMarginBottom sapMQuickViewPage" ref={this.horizontalLayout}>
				{avatar}
			</HorizontalLayout>
		);
		return <VBox>{hLayout}</VBox>;
	}

	setupTitle(): void {
		let title;
		if (this.title) {
			if (this.titleLink) {
				title = <Link text={this.title} href={this.titleLink} emphasized="true" />;
			} else {
				title = <Title text={this.title} level={coreLibrary.TitleLevel.H3} wrapping="true" />;
			}
		}
		const description = this.description ? <Text text={this.description} /> : undefined;
		const vLayout = (
			<VerticalLayout>
				{title}
				{description}
			</VerticalLayout>
		);
		this.horizontalLayout.current?.addContent(vLayout);
	}
}
