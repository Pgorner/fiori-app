import type { BindingToolkitExpression } from "sap/fe/base/BindingToolkit";
import { not } from "sap/fe/base/BindingToolkit";
import type { TableVisualization } from "sap/fe/core/converters/controls/Common/Table";
import FieldHelper from "sap/fe/macros/field/FieldHelper";
import UploadSetwithTable from "sap/m/plugins/UploadSetwithTable";
import UploadItemConfiguration from "sap/m/upload/UploadItemConfiguration";
import type UI5Event from "sap/ui/base/Event";

function getUploadButtonInvisible(tableDefinition: TableVisualization): BindingToolkitExpression<boolean> | boolean {
	if (
		tableDefinition.annotation?.uploadTable?.uploadAction?.isTemplated &&
		tableDefinition.annotation?.uploadTable?.uploadAction?.visibleExpression
	) {
		return not(tableDefinition.annotation.uploadTable.uploadAction.visibleExpression);
	} else {
		// not create enabled, therefore upload button is always invisible
		return true;
	}
}

export function getUploadPlugin(tableDefinition: TableVisualization, id: string): UploadSetwithTable {
	return (
		<UploadSetwithTable
			core:require="{UploadTableRuntime: 'sap/fe/macros/table/uploadTable/UploadTableRuntime'}"
			httpRequestMethod="Put"
			multiple={false}
			uploadButtonInvisible={getUploadButtonInvisible(tableDefinition)}
			itemValidationHandler="UploadTableRuntime.uploadFile"
			mediaTypeMismatch={"UploadTableRuntime.onMediaTypeMismatch" as unknown as (event: UI5Event) => void}
			fileSizeExceeded={"UploadTableRuntime.onFileSizeExceeded" as unknown as (event: UI5Event) => void}
			maxFileSize={FieldHelper.calculateMBfromByte(tableDefinition.annotation?.uploadTable?.maxLength)}
			uploadCompleted={"UploadTableRuntime.onUploadCompleted" as unknown as (event: UI5Event) => void}
			uploadEnabled={tableDefinition.annotation?.uploadTable?.uploadAction?.enabled}
			mediaTypes={tableDefinition.annotation?.uploadTable?.acceptableMediaTypes}
			actions={[`${id}-uploadButton`]}
			uploadUrl={tableDefinition.annotation?.uploadTable?.stream}
			maxFileNameLength={tableDefinition.annotation?.uploadTable?.fileNameMaxLength}
			fileNameLengthExceeded={"UploadTableRuntime.onFileNameLengthExceeded" as unknown as (event: UI5Event) => void}
		>
			{{
				rowConfiguration: <UploadItemConfiguration fileNamePath={tableDefinition.annotation?.uploadTable?.fileName} />
			}}
		</UploadSetwithTable>
	);
}
