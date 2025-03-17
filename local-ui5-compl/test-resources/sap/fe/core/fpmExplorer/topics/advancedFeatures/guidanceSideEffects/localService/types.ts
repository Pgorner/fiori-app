export interface RootEntityType {
	ID: number;
	sourceProperty1: string;
	sourceProperty2: string;
	sourceProperty3a: number;
	sourceProperty3b: string;
	otherProperty3c: string;
	sourceProperty4: boolean;
	targetProperty1a: string;
	targetProperty1b: string;
	targetProperty2: string;
	targetProperty3: string;
	targetProperty4: string;
	complexProperty_number: number;
	complexProperty_prime: boolean;
	totalAmount: number;
	currency: string;
	fieldControlProperty1: number;
	fieldControlProperty2: number;
	BusinessPartnerID: string;
	items: ChildEntityType;
}

export interface ChildEntityType {
	ID: number;
	item: string;
	price: number;
	currency: string;
	Parent_ID: number;
}

export interface AbsoluteEntityType {
	ID: number;
	TimeStamp: Date;
	Duration: string;
}

export interface EntitiesSingletonType {
	ID: number;
	BooleanProperty: boolean;
}
