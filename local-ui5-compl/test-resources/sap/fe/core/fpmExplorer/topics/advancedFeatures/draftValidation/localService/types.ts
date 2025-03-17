export interface ChildEntityType {
	ID: number;
	item: string;
	SAP_Message: {
		code: string;
		message: string;
		numericSeverity: number;
		transition: boolean;
		target: string;
		longtextUrl: string;
	}[];
	Parent_ID: number;
}
