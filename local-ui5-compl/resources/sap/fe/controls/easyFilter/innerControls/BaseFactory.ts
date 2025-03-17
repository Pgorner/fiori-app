import type { PrimitiveType } from "@sap-ux/vocabularies-types/Edm";
import type { EnhanceWithUI5 } from "sap/fe/base/ClassSupport";
import type { PropertyMetadata } from "ux/eng/fioriai/reuse/easyfilter/EasyFilter";
import type EasyFilterBarContainer from "../EasyFilterBarContainer";
import type { TokenSelectedValuesDefinition } from "../EasyFilterBarContainer";
import type EasyFilterToken from "../Token";

type codeListType = PropertyMetadata["codeList"];

export type finalCodeListType = { value: PrimitiveType; description: string };

export class BaseFactory<T> {
	// Private property to hold array of items
	protected items: TokenSelectedValuesDefinition[] | codeListType = [];

	private control?: T;

	private easyFilter?: EnhanceWithUI5<EasyFilterBarContainer>;

	private easyFilterToken?: EnhanceWithUI5<EasyFilterToken>;

	constructor(easyFilter: EnhanceWithUI5<EasyFilterBarContainer>, easyFilterToken: EnhanceWithUI5<EasyFilterToken>) {
		this.easyFilter = easyFilter;
		this.easyFilterToken = easyFilterToken;
	}

	public getItems(): TokenSelectedValuesDefinition[] | codeListType {
		return this.items;
	}

	public getControl(): T | undefined {
		return this.control;
	}

	protected setControl(control: T): void {
		this.control = control;
	}

	public getEasyFilter(): EnhanceWithUI5<EasyFilterBarContainer> | undefined {
		return this.easyFilter;
	}

	public getToken(): EnhanceWithUI5<EasyFilterToken> | undefined {
		return this.easyFilterToken;
	}
}
