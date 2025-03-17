import type Decimal from "sap/ui/model/odata/type/Decimal";
import type Integer from "sap/ui/model/type/Integer";

export interface RootEntityType {
	ID: Integer;
	TitleProperty: string;
	DescriptionProperty: string;
	NameProperty: string;
	Rating: Decimal;
	OverallSDProcessStatus: string;
}
export interface OverallSDProcessStatusType {
	OverallSDProcessStatus: string;
	OverallSDProcessStatus_Text: string;
	StatusCriticality: Integer;
}
