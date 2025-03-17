import type { Action, PathAnnotationExpression, Property, PropertyAnnotationValue } from "@sap-ux/vocabularies-types";
import type {
	DataField,
	DataFieldAbstractTypes,
	DataFieldForAction,
	DataFieldTypes,
	DataFieldWithNavigationPath,
	DataFieldWithUrl,
	DataPointType
} from "@sap-ux/vocabularies-types/vocabularies/UI";
import { UIAnnotationTypes } from "@sap-ux/vocabularies-types/vocabularies/UI";
import uid from "sap/base/util/uid";
import type { BindingToolkitExpression, CompiledBindingToolkitExpression } from "sap/fe/base/BindingToolkit";
import {
	compileExpression,
	constant,
	equal,
	formatResult,
	getExpressionFromAnnotation,
	ifElse,
	isPathInModelExpression,
	not,
	pathInModel
} from "sap/fe/base/BindingToolkit";
import FormElementWrapper from "sap/fe/core/controls/FormElementWrapper";
import * as MetaModelConverter from "sap/fe/core/converters/MetaModelConverter";
import valueFormatters from "sap/fe/core/formatters/ValueFormatter";
import { generate } from "sap/fe/core/helpers/StableIdHelper";
import { isPathAnnotationExpression } from "sap/fe/core/helpers/TypeGuards";
import {
	buildExpressionForCriticalityButtonType,
	buildExpressionForCriticalityColor,
	buildExpressionForCriticalityIcon
} from "sap/fe/core/templating/CriticalityFormatters";
import type { DataModelObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { enhanceDataModelPath, getContextRelativeTargetObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { hasValidAnalyticalCurrencyOrUnit } from "sap/fe/core/templating/UIFormatters";
import CommonHelper from "sap/fe/macros/CommonHelper";
import FieldHelper from "sap/fe/macros/field/FieldHelper";
import * as FieldTemplating from "sap/fe/macros/field/FieldTemplating";
import type { FieldBlockProperties } from "sap/fe/macros/internal/field/FieldStructureHelper";
import QuickView from "sap/fe/macros/quickView/QuickView";
import Avatar from "sap/m/Avatar";
import Button from "sap/m/Button";
import ExpandableText from "sap/m/ExpandableText";
import HBox from "sap/m/HBox";
import ImageCustomData from "sap/m/ImageCustomData";
import Label from "sap/m/Label";
import type { Link$PressEvent } from "sap/m/Link";
import Link from "sap/m/Link";
import type { ObjectIdentifier$TitlePressEvent } from "sap/m/ObjectIdentifier";
import ObjectIdentifier from "sap/m/ObjectIdentifier";
import ObjectStatus from "sap/m/ObjectStatus";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import { LinkAccessibleRole, ObjectMarkerVisibility } from "sap/m/library";
import type Event from "sap/ui/base/Event";
import type EventProvider from "sap/ui/base/EventProvider";
import type Control from "sap/ui/core/Control";
import type { Control$ValidateFieldGroupEvent } from "sap/ui/core/Control";
import CustomData from "sap/ui/core/CustomData";
import Icon from "sap/ui/core/Icon";
import type MdcLink from "sap/ui/mdc/Link";
import FieldEditMode from "sap/ui/mdc/enums/FieldEditMode";
import type Context from "sap/ui/model/odata/v4/Context";
import Currency from "sap/ui/unified/Currency";
import type {
	FileUploader$ChangeEvent,
	FileUploader$FileSizeExceedEvent,
	FileUploader$TypeMissmatchEvent,
	FileUploader$UploadCompleteEvent,
	FileUploader$UploadStartEvent
} from "sap/ui/unified/FileUploader";
import FileUploader from "sap/ui/unified/FileUploader";
import Contact from "../../contact/Contact";
import Email from "../../contact/Email";
import ConditionalWrapper from "../../controls/ConditionalWrapper";
import FileWrapper from "../../controls/FileWrapper";
import TextLink from "../../controls/TextLink";
import DraftIndicator from "../../draftIndicator/DraftIndicator";
import SituationsIndicator from "../../situations/SituationsIndicator";
import DataPoint from "../DataPoint";
import type { DisplayStyle as DisplayStyleType } from "../InternalField.block";

const DisplayStyle = {
	getPrecisionForCurrency(internalField: FieldBlockProperties): number {
		let scale = internalField.property.scale ?? 5;
		if (typeof scale !== "number") {
			// Scale can be "variable" but it's not typed as such. In this case, Scale equals the precision
			scale = internalField.property.precision ?? 5;
		}
		return Math.min(scale, 5);
	},

	getCurrencyOrUnitControl(
		internalField: FieldBlockProperties,
		currencyOrUnit: string,
		visibleExpression?: BindingToolkitExpression<boolean>
	): Control {
		return (
			<Link
				core:require="{FIELDRUNTIME: 'sap/fe/macros/field/FieldRuntime'}"
				text="{sap.fe.i18n>M_TABLE_SHOW_DETAILS}"
				press={
					`FIELDRUNTIME.displayAggregateDetails($event, '${getContextRelativeTargetObjectPath(
						internalField.dataModelPath
					)}')` as unknown as (evt: Link$PressEvent) => void
				}
				visible={visibleExpression}
			>
				{{
					dependents: currencyOrUnit
				}}
			</Link>
		);
	},

	/**
	 * Generates the AmountWithCurrency template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getAmountWithCurrencyTemplate(internalField: FieldBlockProperties): string {
		const maxPrecision = DisplayStyle.getPrecisionForCurrency(internalField);

		// We don't display anything if the value is undefined
		const relativePropertyPath = getContextRelativeTargetObjectPath(internalField.dataModelPath);
		const overallVisible = not(equal(pathInModel(relativePropertyPath), undefined));

		if (internalField.formatOptions.isAnalytics) {
			const currency = (
				<Currency
					stringValue={internalField.valueAsStringBindingExpression}
					currency={internalField.unitBindingExpression}
					useSymbol="false"
					maxPrecision={maxPrecision}
					visible={overallVisible}
				/>
			);
			return (
				<ConditionalWrapper
					visible={internalField.displayVisible}
					condition={internalField.hasValidAnalyticalCurrencyOrUnit as unknown as boolean}
				>
					{{
						contentTrue: currency,
						contentFalse: this.getCurrencyOrUnitControl(internalField, currency, overallVisible)
					}}
				</ConditionalWrapper>
			);
		} else {
			return (
				<FormElementWrapper
					formDoNotAdjustWidth={true}
					width={internalField.formatOptions.textAlignMode === "Table" ? "100%" : undefined}
					visible={overallVisible}
				>
					<Currency
						visible={internalField.displayVisible}
						stringValue={internalField.valueAsStringBindingExpression}
						currency={internalField.unitBindingExpression}
						useSymbol="false"
						maxPrecision={maxPrecision}
					/>
				</FormElementWrapper>
			);
		}
	},

	/**
	 * Generates the Avatar template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getAvatarTemplate(internalField: FieldBlockProperties): string {
		let avatarId;
		if (internalField._flexId) {
			avatarId = internalField._flexId;
		} else if (internalField.idPrefix) {
			avatarId = generate([internalField.idPrefix, "Field-content"]);
		}

		const avatarVisible = FieldTemplating.getVisibleExpression(internalField.dataModelPath as DataModelObjectPath<DataPointType>);

		const avatarSrc = FieldTemplating.getValueBinding(internalField.dataModelPath, {});
		const avatarDisplayShape = FieldTemplating.getAvatarShape(internalField.dataModelPath);

		return (
			<FormElementWrapper visible={avatarVisible}>
				<Avatar
					id={avatarId}
					src={avatarSrc}
					displaySize="S"
					class="sapUiSmallMarginEnd"
					imageFitType="Cover"
					displayShape={avatarDisplayShape}
				/>
			</FormElementWrapper>
		);
	},

	/**
	 * Generates the button template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getButtonTemplate: (internalField: FieldBlockProperties): string => {
		const icon =
			internalField.formatOptions?.showIconUrl ?? false ? (internalField.convertedMetaPath as DataFieldTypes).IconUrl : undefined;
		const text = !(internalField.formatOptions?.showIconUrl ?? false)
			? (internalField.convertedMetaPath as DataFieldTypes).Label
			: undefined;
		const tooltip =
			internalField.formatOptions?.showIconUrl ?? false ? (internalField.convertedMetaPath as DataFieldTypes).Label : undefined;

		let buttonPress;
		let buttonIsBound;
		let buttonOperationAvailable;
		let buttonOperationAvailableFormatted;
		let navigationAvailable;

		if (internalField.convertedMetaPath.$Type === UIAnnotationTypes.DataFieldForAction) {
			//Qualms: the getObject is a bad practice, but for now it´s fine as an intermediate step to avoid refactoring of the helper in addition
			const dataFieldObject = internalField.metaPath.getObject();
			buttonPress = FieldHelper.getPressEventForDataFieldActionButton(internalField, dataFieldObject);

			buttonIsBound = internalField.convertedMetaPath.ActionTarget ? internalField.convertedMetaPath.ActionTarget.isBound : true;
			buttonOperationAvailable = internalField.convertedMetaPath.ActionTarget
				? internalField.convertedMetaPath.ActionTarget.annotations?.Core?.OperationAvailable
				: "false";
			buttonOperationAvailableFormatted = internalField.convertedMetaPath.ActionTarget ? undefined : "false";

			if (buttonOperationAvailable && buttonOperationAvailable !== "false") {
				const actionTarget = internalField.convertedMetaPath.ActionTarget as Action;
				const bindingParamName = actionTarget.parameters[0].name;
				//QUALMS, needs to be checked whether this makes sense at that place, might be good in a dedicated helper function
				buttonOperationAvailableFormatted = compileExpression(
					getExpressionFromAnnotation(
						buttonOperationAvailable as PropertyAnnotationValue<boolean>,
						[],
						undefined,
						(path: string) => {
							if (path.startsWith(bindingParamName)) {
								return path.replace(bindingParamName + "/", "");
							}
							return path;
						}
					)
				);
			}
		}

		if (internalField.convertedMetaPath.$Type === UIAnnotationTypes.DataFieldForIntentBasedNavigation) {
			buttonPress = CommonHelper.getPressHandlerForDataFieldForIBN(internalField.metaPath.getObject(), undefined, undefined);
			navigationAvailable = true;
			if (
				internalField.convertedMetaPath?.$Type === UIAnnotationTypes.DataFieldForIntentBasedNavigation &&
				internalField.convertedMetaPath.NavigationAvailable !== undefined &&
				String(internalField.formatOptions.ignoreNavigationAvailable) !== "true"
			) {
				navigationAvailable = compileExpression(getExpressionFromAnnotation(internalField.convertedMetaPath.NavigationAvailable));
			}
		}

		let button = "";
		if (internalField.convertedMetaPath.$Type === UIAnnotationTypes.DataFieldForIntentBasedNavigation) {
			button = (
				<Button
					visible={internalField.visible}
					text={text}
					icon={icon}
					enabled={navigationAvailable}
					tooltip={tooltip}
					press={buttonPress as unknown as ((oEvent: Event<object, EventProvider>) => void) | undefined}
				/>
			);
		} else if (
			FieldHelper.isDataFieldActionButtonVisible(
				internalField.convertedMetaPath,
				buttonIsBound,
				buttonOperationAvailable as boolean | undefined
			)
		) {
			const enabled = FieldHelper.isDataFieldActionButtonEnabled(
				internalField.convertedMetaPath as DataFieldForAction,
				buttonIsBound as unknown as boolean,
				buttonOperationAvailable,
				buttonOperationAvailableFormatted as string
			);
			const type = buildExpressionForCriticalityButtonType(internalField.dataModelPath as DataModelObjectPath<DataPointType>);

			button = (
				<Button
					class={internalField.class}
					text={text}
					icon={icon}
					tooltip={tooltip}
					press={buttonPress as unknown as ((oEvent: Event<object, EventProvider>) => void) | undefined}
					enabled={enabled}
					visible={internalField.visible}
					type={type}
				/>
			);
		}
		return button;
	},

	/**
	 * Generates the Contact template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getContactTemplate(internalField: FieldBlockProperties): string {
		const contactMetaPath = internalField.metaPath.getModel().createBindingContext("Target/$AnnotationPath", internalField.metaPath);
		const contactVisible = FieldTemplating.getVisibleExpression(internalField.dataModelPath as DataModelObjectPath<DataPointType>);

		return (
			<Contact
				idPrefix={internalField.idPrefix}
				ariaLabelledBy={internalField.ariaLabelledBy}
				metaPath={contactMetaPath.getPath()}
				contextPath={internalField.contextPath.getPath()}
				_flexId={internalField._flexId}
				visible={contactVisible}
				showEmptyIndicator={internalField.formatOptions.showEmptyIndicator}
			/>
		);
	},

	/**
	 * Generates the innerpart of the data point to be used in getDataPointTemplate.
	 * @param internalField Reference to the current internal field instance
	 * @param withConditionalWrapper Boolean value to determine whether the DataPoint
	 * 					  			shall be generated for the conditional wrapper case
	 * @returns An XML-based string with the definition of the field control
	 */
	getDataPointInnerPart(internalField: FieldBlockProperties, withConditionalWrapper: boolean): string {
		const convertedDataField = MetaModelConverter.convertMetaModelContext(internalField.metaPath) as DataFieldAbstractTypes;

		const metaPath =
			convertedDataField.$Type === UIAnnotationTypes.DataFieldForAnnotation
				? internalField.metaPath.getModel().createBindingContext("Target/$AnnotationPath", internalField.metaPath)
				: internalField.metaPath;

		const formatOptions = {
			measureDisplayMode: internalField.formatOptions.measureDisplayMode,
			showEmptyIndicator: internalField.formatOptions.showEmptyIndicator,
			isAnalytics: internalField.formatOptions.isAnalytics
		};

		return (
			<DataPoint
				idPrefix={internalField.idPrefix}
				visible={(!withConditionalWrapper ? internalField.displayVisible : "") as unknown as string | undefined}
				ariaLabelledBy={internalField.ariaLabelledBy ? internalField.ariaLabelledBy : undefined}
				metaPath={metaPath.getPath()}
				contextPath={internalField.contextPath?.getPath()}
				value={internalField.value}
			>
				{{
					formatOptions: { formatOptions }
				}}
			</DataPoint>
		);
	},

	/**
	 * Generates the DataPoint template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getDataPointTemplate(internalField: FieldBlockProperties): string {
		if ((internalField.formatOptions.isAnalytics ?? false) && (internalField.hasUnitOrCurrency ?? false)) {
			return (
				<ConditionalWrapper
					visible={internalField.displayVisible}
					condition={internalField.hasValidAnalyticalCurrencyOrUnit as unknown as boolean}
				>
					{{
						contentTrue: this.getDataPointInnerPart(internalField, true),
						contentFalse: this.getCurrencyOrUnitControl(internalField, this.getDataPointInnerPart(internalField, false))
					}}
				</ConditionalWrapper>
			);
		} else {
			return this.getDataPointInnerPart(internalField, false);
		}
	},

	/**
	 * Generates the ExpandableText template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getExpandableText(internalField: FieldBlockProperties): string {
		return (
			<ExpandableText
				id={internalField?.displayStyleId}
				visible={internalField?.displayVisible}
				text={internalField.text}
				overflowMode={internalField?.formatOptions?.textExpandBehaviorDisplay}
				maxCharacters={internalField?.formatOptions?.textMaxCharactersDisplay}
				emptyIndicatorMode={internalField?.emptyIndicatorMode}
			/>
		);
	},

	/**
	 * Generates the File template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getFileTemplate(internalField: FieldBlockProperties): string {
		let innerFilePart;

		const fileRelativePropertyPath = getContextRelativeTargetObjectPath(internalField.dataModelPath);
		const fileNameAnnotation = internalField.property.annotations.Core?.ContentDisposition?.Filename;
		let fileFilenameExpression;
		if (isPathAnnotationExpression(fileNameAnnotation)) {
			const fileNameDataModelPath = enhanceDataModelPath(internalField.dataModelPath, fileNameAnnotation.path);
			// This causes an expression parsing error: compileExpression(pathInModel(getContextRelativeTargetObjectPath(fileNameDataModelPath)));
			fileFilenameExpression = "{ path: '" + getContextRelativeTargetObjectPath(fileNameDataModelPath) + "' }";
		}
		const fileStreamNotEmpty = compileExpression(not(equal(pathInModel(`${fileRelativePropertyPath}@odata.mediaContentType`), null)));

		// FileWrapper
		const fileUploadUrl = FieldTemplating.getValueBinding(internalField.dataModelPath, {});
		const fileFilenamePath = (internalField.property.annotations.Core?.ContentDisposition?.Filename as PathAnnotationExpression<string>)
			?.path;
		const fileMediaType =
			internalField.property.annotations.Core?.MediaType &&
			compileExpression(getExpressionFromAnnotation(internalField.property.annotations.Core?.MediaType));

		// template:if
		const fileIsImage =
			!!internalField.property.annotations.UI?.IsImageURL ||
			!!internalField.property.annotations.UI?.IsImage ||
			/image\//i.test(internalField.property.annotations.Core?.MediaType?.toString() ?? "");

		// Avatar
		const fileAvatarSrc = FieldTemplating.getValueBinding(internalField.dataModelPath, {});
		const fileAvatarDisplayShape = FieldTemplating.getAvatarShape(internalField.dataModelPath);

		// Icon
		const fileIconSrc = FieldHelper.getPathForIconSource(fileRelativePropertyPath);

		// Link
		const fileLinkText = FieldHelper.getFilenameExpr(fileFilenameExpression, "{sap.fe.i18n>M_FIELD_FILEUPLOADER_NOFILENAME_TEXT}");
		const fileLinkHref = FieldHelper.getDownloadUrl(fileUploadUrl ?? "");

		// Text
		const fileTextVisible = compileExpression(equal(pathInModel(`${fileRelativePropertyPath}@odata.mediaContentType`), null));

		let fileAcceptableMediaTypes;
		// FileUploader
		if (internalField.property.annotations.Core?.AcceptableMediaTypes) {
			const acceptedTypes = Array.from(internalField.property.annotations.Core.AcceptableMediaTypes as unknown as string[]).map(
				(type) => `'${type}'`
			);
			fileAcceptableMediaTypes = `{=odata.collection([${acceptedTypes.join(",")}])}`; // This does not feel right, but follows the logic of AnnotationHelper#value
		}
		const fileMaximumSize = FieldHelper.calculateMBfromByte(internalField.property.maxLength);

		if (fileIsImage) {
			innerFilePart = {
				avatar: (
					<Avatar
						visible={internalField.displayVisible}
						src={fileAvatarSrc}
						displaySize="S"
						class="sapUiSmallMarginEnd"
						imageFitType="Cover"
						displayShape={fileAvatarDisplayShape}
					>
						{{
							customData: <ImageCustomData paramName="xcache" />
						}}
					</Avatar>
				)
			};
		} else {
			innerFilePart = {
				icon: <Icon src={fileIconSrc} class="sapUiSmallMarginEnd" visible={fileStreamNotEmpty} />,
				link: <Link text={fileLinkText} target="_blank" href={fileLinkHref} visible={fileStreamNotEmpty} wrapping="true" />,
				text: <Text emptyIndicatorMode={internalField.emptyIndicatorMode} text="" visible={fileTextVisible} />
			};
		}

		if (internalField.editMode !== FieldEditMode.Display) {
			const beforeDialogOpen = internalField.collaborationEnabled ? "FIELDRUNTIME.handleOpenUploader" : undefined;
			const afterDialogOpen = internalField.collaborationEnabled ? "FIELDRUNTIME.handleCloseUploader" : undefined;

			innerFilePart = {
				...innerFilePart,
				fileUploader: (
					<FileUploader
						name="FEV4FileUpload"
						visible={internalField.editableExpression}
						buttonOnly="true"
						iconOnly="true"
						multiple="false"
						tooltip="{sap.fe.i18n>M_FIELD_FILEUPLOADER_UPLOAD_BUTTON_TOOLTIP}"
						icon="sap-icon://upload"
						style="Transparent"
						sendXHR="true"
						useMultipart="false"
						sameFilenameAllowed="true"
						mimeType={fileAcceptableMediaTypes}
						typeMissmatch={"FIELDRUNTIME.handleTypeMissmatch" as unknown as (oEvent: FileUploader$TypeMissmatchEvent) => void}
						maximumFileSize={fileMaximumSize}
						fileSizeExceed={
							"FIELDRUNTIME.handleFileSizeExceed" as unknown as (oEvent: FileUploader$FileSizeExceedEvent) => void
						}
						uploadOnChange="false"
						uploadComplete={
							`FIELDRUNTIME.handleUploadComplete($event, ${
								fileFilenameExpression || "undefined"
							}, '${fileRelativePropertyPath}', $controller)` as unknown as (oEvent: FileUploader$UploadCompleteEvent) => void
						}
						httpRequestMethod="Put"
						change={"FIELDRUNTIME.uploadStream($controller, $event)" as unknown as (oEvent: FileUploader$ChangeEvent) => void}
						beforeDialogOpen={beforeDialogOpen as unknown as (oEvent: Event) => void}
						afterDialogClose={afterDialogOpen as unknown as (oEvent: Event) => void}
						uploadStart={"FIELDRUNTIME.handleOpenUploader" as unknown as (oEvent: FileUploader$UploadStartEvent) => void}
					/>
				),
				deleteButton: (
					<Button
						icon="sap-icon://sys-cancel"
						type="Transparent"
						press={
							`FIELDRUNTIME.removeStream($event, ${
								fileFilenameExpression || "undefined"
							}, '${fileRelativePropertyPath}', $controller)` as unknown as (oEvent: Event) => void
						}
						tooltip="{sap.fe.i18n>M_FIELD_FILEUPLOADER_DELETE_BUTTON_TOOLTIP}"
						visible={internalField.editableExpression}
						enabled={fileStreamNotEmpty}
					/>
				)
			};
		}

		return (
			<FileWrapper
				core:require="{FIELDRUNTIME: 'sap/fe/macros/field/FieldRuntime'}"
				visible={internalField.visible}
				uploadUrl={fileUploadUrl}
				propertyPath={fileRelativePropertyPath}
				filename={fileFilenamePath}
				mediaType={fileMediaType}
				fieldGroupIds={internalField.fieldGroupIds}
				validateFieldGroup={
					"FIELDRUNTIME.onValidateFieldGroup($event)" as unknown as (oEvent: Control$ValidateFieldGroupEvent) => void
				}
				log:sourcePath={internalField.dataSourcePath}
			>
				{{
					innerFilePart
				}}
			</FileWrapper>
		);
	},

	/**
	 * Generates the Link template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getLinkTemplate(internalField: FieldBlockProperties): string {
		let linkUrl;
		let linkPress;
		let iconUrl;
		let linkActived;
		type LinkTarget = "_blank" | "_self" | "_top" | "_parent";
		let linkTarget: LinkTarget | undefined;

		switch (internalField.convertedMetaPath.$Type as string) {
			case UIAnnotationTypes.DataFieldWithIntentBasedNavigation:
				linkPress = CommonHelper.getPressHandlerForDataFieldForIBN(internalField.metaPath.getObject());
				return (
					<Link
						id={internalField.displayStyleId}
						core:require="{WSR: 'sap/base/strings/whitespaceReplacer'}"
						visible={internalField.displayVisible}
						text={DisplayStyle.computeTextWithWhiteSpace(internalField)}
						press={linkPress as unknown as (oEvent: Link$PressEvent) => void}
						ariaLabelledBy={internalField.ariaLabelledBy as unknown as Array<Control | string>}
						emptyIndicatorMode={internalField.emptyIndicatorMode}
						class="sapMTextRenderWhitespaceWrap"
						accessibleRole={LinkAccessibleRole.Button}
					/>
				);
			case UIAnnotationTypes.DataFieldWithNavigationPath:
				linkPress = `FieldRuntime.onDataFieldWithNavigationPath(\${$source>/}, $controller, '${
					(internalField.convertedMetaPath as DataFieldWithNavigationPath).Target.value
				}')`;
				return (
					<Link
						id={internalField.displayStyleId}
						core:require="{FieldRuntime: 'sap/fe/macros/field/FieldRuntime'}"
						visible={internalField.displayVisible}
						text={internalField.text}
						press={linkPress as unknown as (oEvent: Link$PressEvent) => void}
						ariaLabelledBy={internalField.ariaLabelledBy as unknown as Array<Control | string>}
						emptyIndicatorMode={internalField.emptyIndicatorMode}
						class="sapMTextRenderWhitespaceWrap"
					/>
				);
			case UIAnnotationTypes.DataFieldWithAction:
				linkPress = FieldHelper.getPressEventForDataFieldActionButton(internalField, internalField.metaPath.getObject());
				return (
					<Link
						id={internalField.displayStyleId}
						visible={internalField.displayVisible}
						text={internalField.text}
						press={linkPress as unknown as (oEvent: Link$PressEvent) => void}
						ariaLabelledBy={internalField.ariaLabelledBy as unknown as Array<Control | string>}
						emptyIndicatorMode={internalField.emptyIndicatorMode}
						class="sapMTextRenderWhitespaceWrap"
						accessibleRole={LinkAccessibleRole.Button}
					/>
				);
			case UIAnnotationTypes.DataFieldWithUrl:
				const html5LinkTarget = internalField.property.annotations.HTML5?.LinkTarget;
				internalField.text = DisplayStyle.computeTextWithWhiteSpace(internalField);
				iconUrl = (internalField.convertedMetaPath as DataFieldTypes).IconUrl
					? compileExpression(
							getExpressionFromAnnotation(
								(internalField.convertedMetaPath as DataFieldTypes).IconUrl as unknown as PropertyAnnotationValue<String>
							)
					  )
					: undefined;
				const linkBinding = getExpressionFromAnnotation(
					(internalField.convertedMetaPath as DataFieldWithUrl).Url as unknown as PropertyAnnotationValue<String>
				);
				linkUrl = compileExpression(linkBinding);
				linkActived = compileExpression(not(equal(linkBinding, "")));
				linkTarget = html5LinkTarget && (html5LinkTarget.toString() as LinkTarget);
		}

		if (
			internalField.property.annotations?.Communication?.IsEmailAddress ||
			internalField.property.annotations?.Communication?.IsPhoneNumber
		) {
			const linkIsEmailAddress = internalField.property.annotations.Communication?.IsEmailAddress !== undefined;
			const linkIsPhoneNumber = internalField.property.annotations.Communication?.IsPhoneNumber !== undefined;
			const propertyValueBinding = FieldTemplating.getValueBinding(internalField.dataModelPath, {});
			const mailBlockId = internalField.displayStyleId ? internalField.displayStyleId : `mailBlock${uid()}`;
			if (linkIsEmailAddress) {
				linkUrl = `mailto:${propertyValueBinding}`;
				return (
					<Email
						id={mailBlockId}
						visible={internalField.displayVisible}
						text={internalField.text}
						mail={propertyValueBinding}
						ariaLabelledBy={internalField.ariaLabelledBy ? internalField.ariaLabelledBy : undefined}
						emptyIndicatorMode={internalField.emptyIndicatorMode}
					/>
				);
			}
			if (linkIsPhoneNumber) {
				linkUrl = `tel:${propertyValueBinding}`;
				return (
					<Link
						id={internalField.displayStyleId}
						core:require="{WSR: 'sap/base/strings/whitespaceReplacer'}"
						visible={internalField.displayVisible}
						text={DisplayStyle.computeTextWithWhiteSpace(internalField)}
						href={linkUrl}
						enabled={linkActived}
						ariaLabelledBy={internalField.ariaLabelledBy as unknown as Array<Control | string>}
						emptyIndicatorMode={internalField.emptyIndicatorMode}
						class="sapMTextRenderWhitespaceWrap"
					/>
				);
			}
		}

		if (iconUrl) {
			return (
				<ObjectStatus
					core:require="{WSR: 'sap/base/strings/whitespaceReplacer', FieldRuntime: 'sap/fe/macros/field/FieldRuntime'}"
					id={internalField.displayStyleId}
					icon={iconUrl}
					visible={internalField.displayVisible}
					text={internalField.text}
					press={"FieldRuntime.openExternalLink" as unknown as (oEvent: Event) => void}
					active={linkActived}
					emptyIndicatorMode={internalField.emptyIndicatorMode}
					ariaLabelledBy={internalField.ariaLabelledBy as unknown as Array<Control | string>}
				>
					{{
						customData: <CustomData key={"url"} value={linkUrl} />
					}}
				</ObjectStatus>
			);
		} else {
			return (
				<Link
					id={internalField.displayStyleId}
					core:require="{WSR: 'sap/base/strings/whitespaceReplacer'}"
					visible={internalField.displayVisible}
					text={internalField.text}
					href={linkUrl}
					enabled={linkActived}
					target={linkTarget === undefined ? "_top" : linkTarget}
					wrapping={internalField.wrap === undefined ? true : internalField.wrap}
					ariaLabelledBy={internalField.ariaLabelledBy as unknown as Array<Control | string>}
					emptyIndicatorMode={internalField.emptyIndicatorMode}
				/>
			);
		}
	},

	/**
	 * Find the foreign key of target entity which quick view Facets we want to display.
	 * @param internalField Reference to the current internal field instance
	 * @returns The key of the target entity
	 */
	getForeignKeyForCustomData(internalField: FieldBlockProperties): string | undefined {
		const relativePathToQuickViewEntity = QuickView.getRelativePathToQuickViewEntity(internalField.dataModelPath);
		if (relativePathToQuickViewEntity) {
			const targetNavigationProperties = internalField.dataModelPath.targetEntityType.navigationProperties;
			const targetNavProp = targetNavigationProperties.find((navProp) => navProp.name === relativePathToQuickViewEntity);
			const refConstraint = targetNavProp?.referentialConstraint;
			const key = refConstraint?.length && typeof refConstraint[0] === "object" && refConstraint[0].targetProperty;
			const keyToFetch = key ? `${relativePathToQuickViewEntity}/${key}` : undefined;
			if (keyToFetch !== undefined) {
				return keyToFetch;
			}
		}
		return undefined;
	},

	/**
	 * Generates the check expression for displaying or not a quickview.
	 * @param internalField Reference to the current internal field instance
	 * @returns The key of the target entity
	 */
	getForeignKeyValueExpression(internalField: FieldBlockProperties): string {
		const foreignKeyRelativePath = QuickView.getRelativePathToQuickViewEntity(internalField.dataModelPath)
			? this.getForeignKeyForCustomData(internalField)
			: undefined;
		const expression: BindingToolkitExpression<string> = {
			path: `${foreignKeyRelativePath}`,
			_type: "PathInModel"
		};
		return `${compileExpression(ifElse(equal(foreignKeyRelativePath, undefined), constant(true), not(equal(null, expression))))}`;
	},

	/**
	 * Generates the StandardLinkWithQuickView template.
	 * @param internalField Reference to the current internal field instance
	 * @param text The text to display
	 * @returns An XML-based string with the definition of the field control
	 */
	getStandardLinkWithQuickViewTemplate(internalField: FieldBlockProperties, text: CompiledBindingToolkitExpression): string {
		return (
			<Link
				id={internalField.displayStyleId}
				core:require="{FieldRuntimeHelper: 'sap/fe/macros/field/FieldRuntimeHelper', WSR: 'sap/base/strings/whitespaceReplacer'}"
				text={text}
				visible={internalField.displayVisible}
				wrapping={internalField.wrap === undefined ? true : internalField.wrap}
				press={"FieldRuntimeHelper.pressLink" as unknown as (oEvent: Link$PressEvent) => void}
				ariaLabelledBy={internalField.ariaLabelledBy as unknown as Array<Control | string>}
				emptyIndicatorMode={internalField.emptyIndicatorMode}
			>
				{{
					customData: [<CustomData key={"loadValue"} value={internalField.valueAsStringBindingExpression} />],
					dependents: DisplayStyle.getMdcLinkForQuickView(internalField)
				}}
			</Link>
		);
	},

	/**
	 * Generates the ConditionalLinkTemplate template.
	 * @param internalField Reference to the current internal field instance
	 * @param condition Condition to display a Link or a Text
	 * @param text The text to display
	 * @returns An XML-based string with the definition of the field control
	 */
	getConditionalLinkWithQuickViewTemplate(
		internalField: FieldBlockProperties,
		condition: CompiledBindingToolkitExpression,
		text: CompiledBindingToolkitExpression
	): string {
		return (
			<TextLink
				id={internalField.displayStyleId}
				core:require="{FieldRuntimeHelper: 'sap/fe/macros/field/FieldRuntimeHelper', ValueFormatter: 'sap/fe/core/formatters/ValueFormatter', WSR: 'sap/base/strings/whitespaceReplacer'}"
				showAsLink={condition as unknown as boolean}
				semanticObject={internalField.semanticObject}
				text={text}
				wrapping={internalField.wrap === undefined ? true : internalField.wrap}
				press={"FieldRuntimeHelper.pressLink" as unknown as (oEvent: Link$PressEvent) => void}
				ariaLabelledBy={internalField.ariaLabelledBy}
				emptyIndicatorMode={internalField.emptyIndicatorMode}
			>
				{{
					customData: [<CustomData key={"loadValue"} value={internalField.valueAsStringBindingExpression} />],
					dependents: DisplayStyle.getMdcLinkForQuickView(internalField)
				}}
			</TextLink>
		);
	},

	/**
	 * Generates the ConditionalLinkTemplate template.
	 * @param internalField Reference to the current internal field instance
	 * @param condition Condition to display a Link or a Text
	 * @param contentTrue The Control to display in case condition is true
	 * @param contentFalse The Control to display in case condition is false
	 * @returns An XML-based string with the definition of the field control
	 */
	getConditionalWrapperForQuickViewTemplate(
		internalField: FieldBlockProperties,
		condition: string,
		contentTrue: string,
		contentFalse: string
	): string {
		return (
			<ConditionalWrapper visible={internalField.displayVisible} condition={condition as unknown as boolean}>
				{{
					contentTrue: contentTrue,
					contentFalse: contentFalse
				}}
			</ConditionalWrapper>
		);
	},

	/**
	 * Generates the LinkWithQuickView template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getLinkWithQuickViewTemplate(internalField: FieldBlockProperties): string {
		const text = internalField.formatOptions.retrieveTextFromValueList
			? internalField.textFromValueList
			: DisplayStyle.computeTextWithWhiteSpace(internalField);
		const condition = this.getQuickViewCondition(internalField);
		if (condition === "true") {
			return this.getStandardLinkWithQuickViewTemplate(internalField, text);
		}
		return this.getConditionalLinkWithQuickViewTemplate(internalField, condition, text);
	},

	/**
	 * Generates the Text template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getTextTemplate(internalField: FieldBlockProperties): string {
		if (internalField.formatOptions.isAnalytics && internalField.hasUnitOrCurrency) {
			const content = DisplayStyle.getCurrencyOrUnitControl(internalField, <Text text={internalField.text} textAlign="End"></Text>);
			return (
				<ConditionalWrapper
					visible={internalField.displayVisible}
					condition={internalField.hasValidAnalyticalCurrencyOrUnit as unknown as boolean}
				>
					{{
						contentTrue: (
							<Text
								id={internalField.displayStyleId}
								text={internalField.text}
								emptyIndicatorMode={internalField.emptyIndicatorMode}
								renderWhitespace="true"
								wrapping={internalField.wrap}
							/>
						),
						contentFalse: content
					}}
				</ConditionalWrapper>
			);
		} else if (internalField.formatOptions.retrieveTextFromValueList) {
			return (
				<Text
					id={internalField.displayStyleId}
					visible={internalField.displayVisible}
					text={internalField.textFromValueList}
					core:require="{FieldRuntime: 'sap/fe/macros/field/FieldRuntime'}"
					emptyIndicatorMode={internalField.emptyIndicatorMode}
					renderWhitespace="true"
				/>
			);
		} else {
			// When having a TextArrangement with TextOnly, RTA can only find the binding for the text, but not for the field.
			// To prevent that such a field can be added twice via RTA, we need to provide the field binding as a dummy custom binding.
			let customdata;
			if (internalField.formatOptions.displayMode === "Description" && internalField.valueAsStringBindingExpression) {
				customdata = <CustomData key="fieldBinding" value={internalField.valueAsStringBindingExpression} />;
			}
			return (
				<Text
					id={internalField.displayStyleId}
					visible={internalField.displayVisible}
					text={internalField.text}
					wrapping={internalField.wrap}
					emptyIndicatorMode={internalField.emptyIndicatorMode}
					renderWhitespace="true"
				>
					{customdata}
				</Text>
			);
		}
	},

	/**
	 * Generates the ObjectIdentifier template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getObjectIdentifier(internalField: FieldBlockProperties): string {
		let dependents: MdcLink | undefined;
		let titleActive;
		if (internalField.hasQuickView) {
			titleActive = this.getQuickViewCondition(internalField);
			dependents = DisplayStyle.getMdcLinkForQuickView(internalField);
		} else {
			titleActive = false;
		}

		let identifier = (
			<ObjectIdentifier
				core:require="{FieldRuntimeHelper: 'sap/fe/macros/field/FieldRuntimeHelper'}"
				id={internalField.displayStyleId}
				title={internalField.identifierTitle}
				text={internalField.identifierText}
				titleActive={titleActive}
				titlePress={"FieldRuntimeHelper.pressLink" as unknown as (oEvent: ObjectIdentifier$TitlePressEvent) => void}
				ariaLabelledBy={internalField.ariaLabelledBy as unknown as Array<Control | string>}
				emptyIndicatorMode={internalField.emptyIndicatorMode}
			>
				{{
					customData: [<CustomData key={"loadValue"} value={internalField.valueAsStringBindingExpression} />],
					dependents: dependents
				}}
			</ObjectIdentifier>
		);
		if (internalField.hasSituationsIndicator) {
			identifier = (
				<HBox alignItems="Center" justifyContent="SpaceBetween" width="100%">
					{identifier}
					<SituationsIndicator
						contextPath={internalField.contextPath.getPath()}
						propertyPath={internalField.situationsIndicatorPropertyPath}
					/>
				</HBox>
			);
		}
		if (internalField.showErrorIndicator && internalField.showErrorObjectStatus) {
			identifier = (
				<VBox>
					{identifier}
					<ObjectStatus
						visible={internalField.showErrorObjectStatus}
						class="sapUiSmallMarginBottom"
						text="{sap.fe.i18n>Contains_Errors}"
						state="Error"
					/>
				</VBox>
			);
		}

		return identifier;
	},

	/**
	 * Generates the ObjectStatus template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getObjectStatus(internalField: FieldBlockProperties): string {
		let objectStatus;
		let requiredHelper = {
			"core:require": "{FieldRuntimeHelper: 'sap/fe/macros/field/FieldRuntimeHelper'}"
		};
		const dataModelObjectPath = MetaModelConverter.getInvolvedDataModelObjects<DataField>(
			internalField.metaPath,
			internalField.contextPath
		);
		const enhancedValueDataModelPath = enhanceDataModelPath<Property>(
			dataModelObjectPath,
			dataModelObjectPath.targetObject?.Value.path
		);
		const condition = hasValidAnalyticalCurrencyOrUnit(enhancedValueDataModelPath);
		const convertedDataField = MetaModelConverter.getInvolvedDataModelObjects<DataPointType>(internalField.metaPath);
		const criticalityIcon = buildExpressionForCriticalityIcon(convertedDataField);
		const state = buildExpressionForCriticalityColor(convertedDataField);

		const linkUrl = (internalField.convertedMetaPath as DataFieldWithUrl).Url
			? compileExpression(
					getExpressionFromAnnotation(
						(internalField.convertedMetaPath as DataFieldWithUrl).Url as unknown as PropertyAnnotationValue<String>
					)
			  )
			: undefined;

		if (internalField.formatOptions.isAnalytics && internalField.hasUnitOrCurrency) {
			const content = DisplayStyle.getCurrencyOrUnitControl(internalField, <Text text={internalField.text} textAlign="End"></Text>);
			objectStatus = (
				<ConditionalWrapper id={internalField.displayStyleId} condition={condition as unknown as boolean}>
					{{
						contentTrue: (
							<ObjectStatus
								icon={criticalityIcon}
								state={state}
								visible={internalField.displayVisible}
								text={internalField.text}
								emptyIndicatorMode={internalField.emptyIndicatorMode}
								class="sapMTextRenderWhitespaceWrap"
							/>
						),
						contentFalse: content
					}}
				</ConditionalWrapper>
			);
		} else {
			let dependents: MdcLink | undefined;
			let active = false;
			let isActive;
			let pressAction;
			if (internalField.hasQuickView) {
				dependents = DisplayStyle.getMdcLinkForQuickView(internalField);
				isActive = this.getQuickViewCondition(internalField);
				pressAction = "FieldRuntimeHelper.pressLink";
			}
			if (linkUrl) {
				active = true;
				requiredHelper = {
					"core:require": "{FieldRuntime: 'sap/fe/macros/field/FieldRuntime'}"
				};
				pressAction = "FieldRuntime.openExternalLink";
			}

			objectStatus = (
				<ObjectStatus
					id={internalField.displayStyleId}
					icon={criticalityIcon}
					state={state}
					text={internalField.text}
					visible={internalField.displayVisible}
					emptyIndicatorMode={internalField.emptyIndicatorMode}
					{...requiredHelper}
					active={isActive ? isActive : active}
					press={pressAction as unknown as (oEvent: Event) => void}
					ariaLabelledBy={internalField.ariaLabelledBy as unknown as Array<Control | string>}
				>
					{{
						customData: [
							<CustomData key={"loadValue"} value={internalField.valueAsStringBindingExpression} />,
							<CustomData key={"url"} value={linkUrl} />
						],
						dependents: dependents
					}}
				</ObjectStatus>
			);
		}

		return objectStatus;
	},

	getMdcLinkForQuickView(internalField: FieldBlockProperties): MdcLink {
		return new QuickView(
			internalField.dataModelPath,
			internalField.metaPath.getPath(),
			internalField.contextPath.getPath(),
			internalField.semanticObject
		).createContent() as MdcLink;
	},

	/**
	 * Generates the LabelSemantickey template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getLabelSemanticKey(internalField: FieldBlockProperties): string {
		const contentTrue = (
			<Link
				text={internalField.text}
				wrapping="true"
				core:require="{FieldRuntimeHelper: 'sap/fe/macros/field/FieldRuntimeHelper'}"
				press={"FieldRuntimeHelper.pressLink" as unknown as (oEvent: Link$PressEvent) => void}
				ariaLabelledBy={internalField.ariaLabelledBy as unknown as Array<Control | string>}
				emptyIndicatorMode={internalField.emptyIndicatorMode}
			>
				{{
					customData: [<CustomData key={"loadValue"} value={internalField.valueAsStringBindingExpression} />],
					dependents: DisplayStyle.getMdcLinkForQuickView(internalField)
				}}
			</Link>
		);
		const contentFalse = (
			<Label
				id={internalField.displayStyleId}
				visible={internalField.displayVisible}
				text={internalField.identifierTitle}
				design="Bold"
			/>
		);
		if (internalField.hasQuickView) {
			const hasQuickview = this.getQuickViewCondition(internalField);
			if (hasQuickview === "true") {
				return contentTrue;
			} else {
				return this.getConditionalWrapperForQuickViewTemplate(internalField, hasQuickview as string, contentTrue, contentFalse);
			}
		}
		return (
			<Label
				id={internalField.displayStyleId}
				visible={internalField.displayVisible}
				text={internalField.identifierTitle}
				design="Bold"
			/>
		);
	},
	/**
	 * Gets the template for the semantic key with draft indicator.
	 * @param semanticKeyTemplate The template result without draft indicator
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	addDraftIndicator(semanticKeyTemplate: string, internalField: FieldBlockProperties): string {
		if (!internalField.formatOptions.fieldGroupDraftIndicatorPropertyPath) {
			// if the draftIndicator is not handled at the fieldGroup level
			//TODO could this be a boolean no draftIndicator
			semanticKeyTemplate = (
				<FormElementWrapper visible={internalField.displayVisible}>
					<VBox class={FieldHelper.getMarginClass(internalField.formatOptions.compactSemanticKey)}>
						{semanticKeyTemplate}
						<DraftIndicator
							draftIndicatorType={ObjectMarkerVisibility.IconAndText}
							contextPath={internalField.contextPath.getPath()}
							visible={internalField.draftIndicatorVisible}
							ariaLabelledBy={internalField.ariaLabelledBy ? internalField.ariaLabelledBy : []}
						/>
					</VBox>
				</FormElementWrapper>
			);
		}
		return semanticKeyTemplate;
	},

	/**
	 * Computes the text property with the appropriate white space handling.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	computeTextWithWhiteSpace(internalField: FieldBlockProperties): CompiledBindingToolkitExpression {
		const text = FieldTemplating.getTextBinding(internalField.dataModelPath, internalField.formatOptions, true);
		return isPathInModelExpression(text) || typeof text === "string"
			? compileExpression(formatResult([text], "WSR"))
			: compileExpression(text);
	},
	/**
	 * Gets the condition for having an active link that opens the quick view.
	 * @param internalField
	 * @returns A compile binding expression for the condition.
	 */
	getQuickViewCondition(internalField: FieldBlockProperties): CompiledBindingToolkitExpression {
		switch (internalField.quickViewType) {
			case "Facets":
				//there is quick viewFacets annotation only then we check if the navigation is reachable
				return this.getForeignKeyValueExpression(internalField);

			case "SemanticLinks":
				if (internalField.dynamicSemanticObjects) {
					const listOfDynamicSemanticObjects: BindingToolkitExpression<string>[] = [];
					if (internalField.semanticObject) {
						// If we see a dynamic expression with a formatter, we return false. The condition will be resolved later in TextLink control.
						return compileExpression(constant(false));
					}
					for (const semanticObjectExpression of internalField.dynamicSemanticObjects) {
						if (semanticObjectExpression._type === "PathInModel" || semanticObjectExpression._type === "Constant") {
							listOfDynamicSemanticObjects.push(semanticObjectExpression);
						} else {
							// If we see a dynamic expression ($edmJson), we return true.
							return compileExpression(constant(true));
						}
					}
					const semanticObjectsPath = [
						pathInModel<Context[]>("/semanticObjects", "internal") as BindingToolkitExpression<string>
					].concat(listOfDynamicSemanticObjects);
					return compileExpression(formatResult(semanticObjectsPath, valueFormatters.hasSemanticObjects));
				}
				return "true";
			default:
				// "facetsAndSemanticLinks"
				// if there is both facets and semantic links, we do not check if the navigation is reachable
				return "true";
		}
	},

	/**
	 * Entry point for further templating processings.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getTemplate: (internalField: FieldBlockProperties): string => {
		let innerFieldContent;
		switch (internalField.displayStyle as DisplayStyleType) {
			case "AmountWithCurrency":
				innerFieldContent = DisplayStyle.getAmountWithCurrencyTemplate(internalField);
				break;
			case "Avatar":
				innerFieldContent = DisplayStyle.getAvatarTemplate(internalField);
				break;
			case "Button":
				innerFieldContent = DisplayStyle.getButtonTemplate(internalField);
				break;
			case "Contact":
				innerFieldContent = DisplayStyle.getContactTemplate(internalField);
				break;
			case "DataPoint":
				innerFieldContent = DisplayStyle.getDataPointTemplate(internalField);
				break;
			case "ExpandableText":
				innerFieldContent = DisplayStyle.getExpandableText(internalField);
				break;
			case "File":
				innerFieldContent = DisplayStyle.getFileTemplate(internalField);
				break;
			case "Link":
				innerFieldContent = DisplayStyle.getLinkTemplate(internalField);
				break;
			case "LinkWithQuickView":
				innerFieldContent = DisplayStyle.getLinkWithQuickViewTemplate(internalField);
				break;
			case "ObjectIdentifier":
				innerFieldContent = DisplayStyle.getObjectIdentifier(internalField);
				break;
			case "ObjectStatus": {
				innerFieldContent = DisplayStyle.getObjectStatus(internalField);
				break;
			}
			case "LabelSemanticKey":
				innerFieldContent = DisplayStyle.getLabelSemanticKey(internalField);
				break;
			case "Text":
				innerFieldContent = DisplayStyle.getTextTemplate(internalField);
				break;
			default:
				innerFieldContent = "";
		}
		if (internalField.addDraftIndicator && innerFieldContent) {
			innerFieldContent = DisplayStyle.addDraftIndicator(innerFieldContent, internalField);
		}

		return innerFieldContent;
	}
};

export default DisplayStyle;
