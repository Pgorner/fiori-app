import PageController from "sap/fe/core/PageController";
import type CodeEditor from "sap/ui/codeeditor/CodeEditor";
import JSONModel from "sap/ui/model/json/JSONModel";

type snippetType = { cds: string; xml: string };
type codeSnippet = { id: string; code: snippetType };
const CODESNIPPETS: Array<codeSnippet> = [
	/* 1.) Dropdown Value Help */
	{
		id: "codeVHFixedValuesHelpSingleSelectSource",
		code: {
			cds: /* cds */ `

	entity BusinessPartnerAddress {
		key BusinessPartner : String @title: 'Business Partner';
			FullName        : String @title: 'Name';
			CityName        : String @title: 'City';
			Country         : String @title: 'Country';
			PostalCode      : String @title: 'Postal Code';
			StreetName      : String @title: 'Street Name';
			HouseNumber     : String @title: 'House Number';
	};

	entity BusinessPartnerAddress2 {
		key BusinessPartner : String @(
				Common: {
				Text           : FullName, //Text not optional if you want to have a display format via TextArrangement in the value list
				TextArrangement: #TextFirst //sets presentation of key and description value like 'description (key)' in the value help table.
				},
				title : 'Business Partner'
			);
			FullName        : String @title: 'Name';
			CityName        : String @title: 'City';
			Country         : String @title: 'Country';
			PostalCode      : String @title: 'Postal Code';
			StreetName      : String @title: 'Street Name';
			HouseNumber     : String @title: 'House Number';
	};

	annotate RootEntity with {
		@(Common: {
		  ValueListWithFixedValues: true,
		  ValueList               : {
			CollectionPath: 'BusinessPartnerAddress',
			Parameters    : [
			  {
				$Type            : 'Common.ValueListParameterInOut',
				LocalDataProperty: valueHelpField1_1,
				ValueListProperty: 'BusinessPartner'
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'FullName'
			  }
			]
		  }
		} )
		valueHelpField1_1;

		@(Common: {
		  Text                    : _BusinessPartnerAddress_VHF1_2.FullName,
		  ValueListWithFixedValues: true,
		  ValueList               : {
			CollectionPath: 'BusinessPartnerAddress2',
			Parameters    : [
			  {
				$Type            : 'Common.ValueListParameterInOut',
				LocalDataProperty: valueHelpField1_2,
				ValueListProperty: 'BusinessPartner'
			  }
			]
		  }
		} )
		valueHelpField1_2;
	}

	`.slice(2, -2), // remove first and last 2 newlines

			xml: `

	<EntityType Name="BusinessPartnerAddress">
		<Key>
			<PropertyRef Name="BusinessPartner"/>
		</Key>
		<Property Name="BusinessPartner" Type="Edm.String" Nullable="false"/>
		<Property Name="FullName" Type="Edm.String"/>
		<Property Name="CityName" Type="Edm.String"/>
		<Property Name="Country" Type="Edm.String"/>
		<Property Name="PostalCode" Type="Edm.String"/>
		<Property Name="StreetName" Type="Edm.String"/>
		<Property Name="HouseNumber" Type="Edm.String"/>
	</EntityType>
	<EntityType Name="BusinessPartnerAddress2">
		<Key>
			<PropertyRef Name="BusinessPartner"/>
		</Key>
		<Property Name="BusinessPartner" Type="Edm.String" Nullable="false"/>
		<Property Name="FullName" Type="Edm.String"/>
		<Property Name="CityName" Type="Edm.String"/>
		<Property Name="Country" Type="Edm.String"/>
		<Property Name="PostalCode" Type="Edm.String"/>
		<Property Name="StreetName" Type="Edm.String"/>
		<Property Name="HouseNumber" Type="Edm.String"/>
	</EntityType>
	<Annotations Target="sap.fe.core.Service.RootEntity/valueHelpField1_1">
		<Annotation Term="Common.ValueListWithFixedValues" Bool="true"/>
		<Annotation Term="Common.ValueList">
		<Record Type="Common.ValueListType">
			<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress"/>
			<PropertyValue Property="Parameters">
			<Collection>
				<Record Type="Common.ValueListParameterInOut">
					<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField1_1"/>
					<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
				</Record>
				<Record Type="Common.ValueListParameterDisplayOnly">
					<PropertyValue Property="ValueListProperty" String="FullName"/>
				</Record>
			</Collection>
			</PropertyValue>
		</Record>
		</Annotation>
		<Annotation Term="Common.Label" String="Value Help Field 1_1"/>
    </Annotations>
    <Annotations Target="sap.fe.core.Service.RootEntity/valueHelpField1_2">
		<Annotation Term="Common.Text" Path="_BusinessPartnerAddress_VHF1_2/FullName"/>
		<Annotation Term="Common.ValueListWithFixedValues" Bool="true"/>
		<Annotation Term="Common.ValueList">
		<Record Type="Common.ValueListType">
			<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress2"/>
			<PropertyValue Property="Parameters">
			<Collection>
				<Record Type="Common.ValueListParameterInOut">
					<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField1_2"/>
					<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
				</Record>
			</Collection>
			</PropertyValue>
		</Record>
		</Annotation>
		<Annotation Term="Common.Label" String="Value Help Field 1_2"/>
    </Annotations>

	`.slice(2, -2)
		}
	},
	/* 2.) Dialog Value Help */
	{
		id: "codeVHDialogSingleSelectSource",
		code: {
			cds: /* cds */ `

	entity BusinessPartnerAddress {
		key BusinessPartner : String @title: 'Business Partner';
			FullName        : String @title: 'Name';
			CityName        : String @title: 'City';
			Country         : String @title: 'Country';
			PostalCode      : String @title: 'Postal Code';
			StreetName      : String @title: 'Street Name';
			HouseNumber     : String @title: 'House Number';
	};

	entity BusinessPartnerAddress2 {
		key BusinessPartner : String @(
				Common: {
				Text           : FullName, //Text not optional if you want to have a display format via TextArrangement in the value list
				TextArrangement: #TextFirst //sets presentation of key and description value like 'description (key)' in the value help table.
				},
				title : 'Business Partner'
			);
			FullName        : String @title: 'Name';
			CityName        : String @title: 'City';
			Country         : String @title: 'Country';
			PostalCode      : String @title: 'Postal Code';
			StreetName      : String @title: 'Street Name';
			HouseNumber     : String @title: 'House Number';
	};

	annotate BusinessPartnerAddress3 with @(Capabilities.SearchRestrictions.Searchable: false);

	entity BusinessPartnerAddress3 {
		key BusinessPartner : String @title: 'Business Partner';
			FullName        : String @title: 'Name';
			CityName        : String @title: 'City';
			PostalCode      : String @title: 'Postal Code';
	};

	annotate RootEntity with {
		@(Common: {ValueList: {
		  CollectionPath: 'BusinessPartnerAddress',
		  Parameters    : [
			{
			  $Type            : 'Common.ValueListParameterInOut',
			  LocalDataProperty: valueHelpField2_1,
			  ValueListProperty: 'BusinessPartner',
			  ![@UI.Importance]: #High
			},
			{
			  $Type            : 'Common.ValueListParameterDisplayOnly',
			  ValueListProperty: 'FullName'
			},
			{
			  $Type            : 'Common.ValueListParameterDisplayOnly',
			  ValueListProperty: 'CityName',
			  ![@UI.Importance]: #High
			}
		  ]
		}} )
		valueHelpField2_1;

		@(Common: {
		  Text     : _BusinessPartnerAddress_VHF2_2.FullName,
		  ValueList: {
			CollectionPath: 'BusinessPartnerAddress2',
			Parameters    : [
			  {
				$Type            : 'Common.ValueListParameterInOut',
				LocalDataProperty: valueHelpField2_2,
				ValueListProperty: 'BusinessPartner',
				![@UI.Importance]: #High
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'FullName'

			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'Country',
				![@UI.Importance]: #High
			  }
			]
		  }
		})
		valueHelpField2_2;

		@(Common: {ValueList: {
		  CollectionPath: 'BusinessPartnerAddress3',
		  Parameters    : [
			{
			  $Type            : 'Common.ValueListParameterInOut',
			  LocalDataProperty: valueHelpField2_3,
			  ValueListProperty: 'BusinessPartner',
			  ![@UI.Importance]: #High
			},
			{
			  $Type            : 'Common.ValueListParameterDisplayOnly',
			  ValueListProperty: 'FullName'

			},
			{
			  $Type            : 'Common.ValueListParameterDisplayOnly',
			  ValueListProperty: 'PostalCode',
			  ![@UI.Importance]: #High
			}
		  ]
		}})
		valueHelpField2_3;
	}

	`.slice(2, -2), // remove first and last 2 newlines

			xml: `

	<EntityType Name="BusinessPartnerAddress">
		<Key>
			<PropertyRef Name="BusinessPartner"/>
		</Key>
		<Property Name="BusinessPartner" Type="Edm.String" Nullable="false"/>
		<Property Name="FullName" Type="Edm.String"/>
		<Property Name="CityName" Type="Edm.String"/>
		<Property Name="Country" Type="Edm.String"/>
		<Property Name="PostalCode" Type="Edm.String"/>
		<Property Name="StreetName" Type="Edm.String"/>
		<Property Name="HouseNumber" Type="Edm.String"/>
	</EntityType>
	<EntityType Name="BusinessPartnerAddress2">
		<Key>
			<PropertyRef Name="BusinessPartner"/>
		</Key>
		<Property Name="BusinessPartner" Type="Edm.String" Nullable="false"/>
		<Property Name="FullName" Type="Edm.String"/>
		<Property Name="CityName" Type="Edm.String"/>
		<Property Name="Country" Type="Edm.String"/>
		<Property Name="PostalCode" Type="Edm.String"/>
		<Property Name="StreetName" Type="Edm.String"/>
		<Property Name="HouseNumber" Type="Edm.String"/>
	</EntityType>
	<EntityType Name="BusinessPartnerAddress3">
		<Key>
			<PropertyRef Name="BusinessPartner"/>
		</Key>
		<Property Name="BusinessPartner" Type="Edm.String" Nullable="false"/>
		<Property Name="FullName" Type="Edm.String"/>
		<Property Name="CityName" Type="Edm.String"/>
		<Property Name="PostalCode" Type="Edm.String"/>
	</EntityType>
	<Annotations Target="sap.fe.core.Service.RootEntity/valueHelpField2_1">
		<Annotation Term="Common.ValueList">
			<Record Type="Common.ValueListType">
			<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress"/>
			<PropertyValue Property="Parameters">
				<Collection>
				<Record Type="Common.ValueListParameterInOut">
					<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField2_1"/>
					<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
					<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
				</Record>
				<Record Type="Common.ValueListParameterDisplayOnly">
					<PropertyValue Property="ValueListProperty" String="FullName"/>
				</Record>
				<Record Type="Common.ValueListParameterDisplayOnly">
					<PropertyValue Property="ValueListProperty" String="CityName"/>
					<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
				</Record>
				</Collection>
			</PropertyValue>
			</Record>
		</Annotation>
		<Annotation Term="Common.Label" String="Value Help Field 2_1"/>
	</Annotations>
	<Annotations Target="sap.fe.core.Service.RootEntity/valueHelpField2_2">
		<Annotation Term="Common.Text" Path="_BusinessPartnerAddress_VHF2_2/FullName"/>
		<Annotation Term="Common.ValueList">
			<Record Type="Common.ValueListType">
			<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress2"/>
			<PropertyValue Property="Parameters">
				<Collection>
				<Record Type="Common.ValueListParameterInOut">
					<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField2_2"/>
					<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
					<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
				</Record>
				<Record Type="Common.ValueListParameterDisplayOnly">
					<PropertyValue Property="ValueListProperty" String="FullName"/>
				</Record>
				<Record Type="Common.ValueListParameterDisplayOnly">
					<PropertyValue Property="ValueListProperty" String="Country"/>
					<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
				</Record>
				</Collection>
			</PropertyValue>
			</Record>
		</Annotation>
		<Annotation Term="Common.Label" String="Value Help Field 2_2"/>
	</Annotations>
	<Annotations Target="sap.fe.core.Service.RootEntity/valueHelpField2_3">
		<Annotation Term="Common.ValueList">
			<Record Type="Common.ValueListType">
			<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress3"/>
			<PropertyValue Property="Parameters">
				<Collection>
				<Record Type="Common.ValueListParameterInOut">
					<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField2_3"/>
					<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
					<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
				</Record>
				<Record Type="Common.ValueListParameterDisplayOnly">
					<PropertyValue Property="ValueListProperty" String="FullName"/>
				</Record>
				<Record Type="Common.ValueListParameterDisplayOnly">
					<PropertyValue Property="ValueListProperty" String="PostalCode"/>
					<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
				</Record>
				</Collection>
			</PropertyValue>
			</Record>
		</Annotation>
		<Annotation Term="Common.Label" String="Value Help Field 2_3"/>
	</Annotations>

	`.slice(2, -2)
		}
	},
	/* 3.) Validation */
	{
		id: "codeVHValidationSource",
		code: {
			cds: /* cds */ `

	entity BusinessPartnerAddress2 {
		key BusinessPartner : String @(
				Common: {
					Text           : FullName, //Text not optional if you want to have a display format via TextArrangement in the value list
					TextArrangement: #TextFirst //sets presentation of key and description value like 'description (key)' in the value help table.
				},
				title : 'Business Partner'
			);
			FullName        : String @title: 'Name';
			CityName        : String @title: 'City';
			Country         : String @title: 'Country';
			PostalCode      : String @title: 'Postal Code';
			StreetName      : String @title: 'Street Name';
			HouseNumber     : String @title: 'House Number';
	};

	annotate RootEntity with {
		@(Common: {
			Text                  : _BusinessPartnerAddress_VHF3_1.FullName,
			ValueListForValidation: '',
			ValueList             : {
				CollectionPath: 'BusinessPartnerAddress2',
				Parameters    : [
					{
						$Type            : 'Common.ValueListParameterInOut',
						LocalDataProperty: valueHelpField3_1,
						ValueListProperty: 'BusinessPartner'
					},
					{
						$Type            : 'Common.ValueListParameterDisplayOnly',
						ValueListProperty: 'Country'
					}
				]
			}
		})
		valueHelpField3_1;
	}

	`.slice(2, -2), // remove first and last 2 newlines

			xml: `

	<EntityType Name="BusinessPartnerAddress2">
		<Key>
			<PropertyRef Name="BusinessPartner"/>
		</Key>
		<Property Name="BusinessPartner" Type="Edm.String" Nullable="false"/>
		<Property Name="FullName" Type="Edm.String"/>
		<Property Name="CityName" Type="Edm.String"/>
		<Property Name="Country" Type="Edm.String"/>
		<Property Name="PostalCode" Type="Edm.String"/>
		<Property Name="StreetName" Type="Edm.String"/>
		<Property Name="HouseNumber" Type="Edm.String"/>
	</EntityType>

	<Annotations Target="sap.fe.core.Service.RootEntity/valueHelpField3_1">
		<Annotation Term="Common.Text" Path="_BusinessPartnerAddress_VHF3_1/FullName"/>
		<Annotation Term="Common.ValueListForValidation" String=""/>
		<Annotation Term="Common.ValueList">
			<Record Type="Common.ValueListType">
			<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress2"/>
			<PropertyValue Property="Parameters">
				<Collection>
					<Record Type="Common.ValueListParameterInOut">
						<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField3_1"/>
						<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
					</Record>
					<Record Type="Common.ValueListParameterDisplayOnly">
						<PropertyValue Property="ValueListProperty" String="Country"/>
					</Record>
				</Collection>
			</PropertyValue>
			</Record>
		</Annotation>
		<Annotation Term="Common.Label" String="Value Help Field 3_1"/>
	</Annotations>

	`.slice(2, -2)
		}
	},
	/* 4.) Context Dependent Value Help */
	{
		id: "codeVHContextDependentSource",
		code: {
			cds: /* cds */ `

	entity BusinessPartnerAddress {
		key BusinessPartner : String @title: 'Business Partner';
			FullName        : String @title: 'Name';
			CityName        : String @title: 'City';
			Country         : String @title: 'Country';
			PostalCode      : String @title: 'Postal Code';
			StreetName      : String @title: 'Street Name';
			HouseNumber     : String @title: 'House Number';
		};

	entity BusinessPartnerAddress2 {
		key BusinessPartner : String @(
				Common: {
				Text           : FullName, //Text not optional if you want to have a display format via TextArrangement in the value list
				TextArrangement: #TextFirst //sets presentation of key and description value like 'description (key)' in the value help table.
				},
				title : 'Business Partner'
			);
			FullName        : String @title: 'Name';
			CityName        : String @title: 'City';
			Country         : String @title: 'Country';
			PostalCode      : String @title: 'Postal Code';
			StreetName      : String @title: 'Street Name';
			HouseNumber     : String @title: 'House Number';
	};

	annotate RootEntity with {
		@(Common: {
		  ValueListWithFixedValues: true,
		  ValueList               : {
			Label         : 'Business Partner Address',
			CollectionPath: 'BusinessPartnerAddress',
			Parameters    : [{
			  $Type            : 'Common.ValueListParameterInOut',
			  LocalDataProperty: valueHelpField4_1,
			  ValueListProperty: 'BusinessPartner'
			}]
		  }
		})
		valueHelpField4_1;

		@(Common: {
		  ValueListRelevantQualifiers: [{$edmJson: {$If: [
			{$Or: [
			  {$Eq: [
				{$Path: 'valueHelpField4_1'},
				{$String: '17100001'}
			  ]},
			  {$Eq: [
				{$Path: 'valueHelpField4_1'},
				{$String: '17100006'}
			  ]}
			]},
			{$String: 'qualifier2'},
			{$String: ''}
		  ]}}],
		  ValueList                  : {
			Label         : 'Business Partner Address',
			CollectionPath: 'BusinessPartnerAddress',
			Parameters    : [
			  {
				$Type            : 'Common.ValueListParameterInOut',
				LocalDataProperty: valueHelpField4_2,
				ValueListProperty: 'BusinessPartner',
				![@UI.Importance]: #High
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'FullName'
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'Country'
				![@UI.Importance]: #High
			  }
			]
		  },
		  ValueList #qualifier2      : {
			Label         : 'Business Partner Address 2',
			CollectionPath: 'BusinessPartnerAddress2',
			Parameters    : [
			  {
				$Type            : 'Common.ValueListParameterInOut',
				LocalDataProperty: valueHelpField4_2,
				ValueListProperty: 'BusinessPartner',
				![@UI.Importance]: #High
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'CityName'
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'Country',
				![@UI.Importance]: #High
			  }
			]
		  }
		})
		valueHelpField4_2;
	}

	`.slice(2, -2), // remove first and last 2 newlines

			xml: `

	<EntityType Name="BusinessPartnerAddress">
		<Key>
			<PropertyRef Name="BusinessPartner"/>
		</Key>
		<Property Name="BusinessPartner" Type="Edm.String" Nullable="false"/>
		<Property Name="FullName" Type="Edm.String"/>
		<Property Name="CityName" Type="Edm.String"/>
		<Property Name="Country" Type="Edm.String"/>
		<Property Name="PostalCode" Type="Edm.String"/>
		<Property Name="StreetName" Type="Edm.String"/>
		<Property Name="HouseNumber" Type="Edm.String"/>
	</EntityType>
	<EntityType Name="BusinessPartnerAddress2">
		<Key>
			<PropertyRef Name="BusinessPartner"/>
		</Key>
		<Property Name="BusinessPartner" Type="Edm.String" Nullable="false"/>
		<Property Name="FullName" Type="Edm.String"/>
		<Property Name="CityName" Type="Edm.String"/>
		<Property Name="Country" Type="Edm.String"/>
		<Property Name="PostalCode" Type="Edm.String"/>
		<Property Name="StreetName" Type="Edm.String"/>
		<Property Name="HouseNumber" Type="Edm.String"/>
	</EntityType>
	<Annotations Target="sap.fe.core.Service.RootEntity/valueHelpField4_1">
		<Annotation Term="Common.ValueListWithFixedValues" Bool="true"/>
		<Annotation Term="Common.ValueList">
			<Record Type="Common.ValueListType">
				<PropertyValue Property="Label" String="Business Partner Address"/>
				<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress"/>
				<PropertyValue Property="Parameters">
				<Collection>
					<Record Type="Common.ValueListParameterInOut">
						<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField4_1"/>
						<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
					</Record>
				</Collection>
				</PropertyValue>
			</Record>
		</Annotation>
		<Annotation Term="Common.Label" String="Value Help Field 4_1"/>
  	</Annotations>
  	<Annotations Target="sap.fe.core.Service.RootEntity/valueHelpField4_2">
		<Annotation Term="Common.ValueListRelevantQualifiers">
		<Collection>
			<If>
			<Or>
				<Eq>
					<Path>valueHelpField4_1</Path>
					<String>17100001</String>
				</Eq>
				<Eq>
					<Path>valueHelpField4_1</Path>
					<String>17100006</String>
				</Eq>
			</Or>
			<String>qualifier2</String>
			<String></String>
			</If>
		</Collection>
		</Annotation>
		<Annotation Term="Common.ValueList">
			<Record Type="Common.ValueListType">
				<PropertyValue Property="Label" String="Business Partner Address"/>
				<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress"/>
				<PropertyValue Property="Parameters">
					<Collection>
						<Record Type="Common.ValueListParameterInOut">
						<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField4_2"/>
						<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
						<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
						<PropertyValue Property="ValueListProperty" String="FullName"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
						<PropertyValue Property="ValueListProperty" String="Country"/>
						<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
						</Record>
					</Collection>
				</PropertyValue>
			</Record>
		</Annotation>
		<Annotation Term="Common.ValueList" Qualifier="qualifier2">
			<Record Type="Common.ValueListType">
				<PropertyValue Property="Label" String="Business Partner Address 2"/>
				<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress2"/>
				<PropertyValue Property="Parameters">
					<Collection>
						<Record Type="Common.ValueListParameterInOut">
							<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField4_2"/>
							<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
							<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="CityName"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="Country"/>
							<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
						</Record>
					</Collection>
				</PropertyValue>
			</Record>
		</Annotation>
		<Annotation Term="Common.Label" String="Value Help Field 4_2"/>
    </Annotations>

	`.slice(2, -2)
		}
	},
	/* 5.) Multi Value Help Dialogs */
	{
		id: "codeVHMultiValueSource",
		code: {
			cds: /* cds */ `

	entity BusinessPartnerAddress {
		key BusinessPartner : String @title: 'Business Partner';
			FullName        : String @title: 'Name';
			CityName        : String @title: 'City';
			Country         : String @title: 'Country';
			PostalCode      : String @title: 'Postal Code';
			StreetName      : String @title: 'Street Name';
			HouseNumber     : String @title: 'House Number';
	};

	entity BusinessPartnerAddress2 {
		key BusinessPartner : String @(
				Common: {
				Text           : FullName, //Text not optional if you want to have a display format via TextArrangement in the value list
				TextArrangement: #TextFirst //sets presentation of key and description value like 'description (key)' in the value help table.
				},
				title : 'Business Partner'
			);
			FullName        : String @title: 'Name';
			CityName        : String @title: 'City';
			Country         : String @title: 'Country';
			PostalCode      : String @title: 'Postal Code';
			StreetName      : String @title: 'Street Name';
			HouseNumber     : String @title: 'House Number';
	};

	annotate BusinessPartnerAddress3 with @(Capabilities.SearchRestrictions.Searchable: false);

	entity BusinessPartnerAddress3 {
		key BusinessPartner : String @title: 'Business Partner';
			FullName        : String @title: 'Name';
			CityName        : String @title: 'City';
			PostalCode      : String @title: 'Postal Code';
	};

	annotate RootEntity with {
		@(Common: {
		  Text                 : _BusinessPartnerAddress_VHF5_1.FullName,
		  ValueList            : {
			Label         : 'Business Partner Address',
			CollectionPath: 'BusinessPartnerAddress',
			Parameters    : [
			  {
				$Type            : 'Common.ValueListParameterInOut',
				LocalDataProperty: valueHelpField5_1,
				ValueListProperty: 'BusinessPartner',
				![@UI.Importance]: #High
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'FullName'
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'Country',
				![@UI.Importance]: #High
			  }
			]
		  },
		  ValueList #qualifier2: {
			Label         : 'Business Partner Address 2',
			CollectionPath: 'BusinessPartnerAddress2',
			Parameters    : [
			  {
				$Type            : 'Common.ValueListParameterInOut',
				LocalDataProperty: valueHelpField5_1,
				ValueListProperty: 'BusinessPartner'
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'FullName'
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'Country'
			  }
			]
		  },
		  ValueList #qualifier3: {
			Label         : 'Business Partner Address 3',
			CollectionPath: 'BusinessPartnerAddress',
			Parameters    : [
			  {
				$Type            : 'Common.ValueListParameterInOut',
				LocalDataProperty: valueHelpField5_1,
				ValueListProperty: 'BusinessPartner'
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'PostalCode'
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'CityName'
			  }
			]
		  }
		})
		valueHelpField5_1;
	}

		`.slice(2, -2), // remove first and last 2 newlines

			xml: `

	<EntityType Name="BusinessPartnerAddress">
		<Key>
			<PropertyRef Name="BusinessPartner"/>
		</Key>
		<Property Name="BusinessPartner" Type="Edm.String" Nullable="false"/>
		<Property Name="FullName" Type="Edm.String"/>
		<Property Name="CityName" Type="Edm.String"/>
		<Property Name="Country" Type="Edm.String"/>
		<Property Name="PostalCode" Type="Edm.String"/>
		<Property Name="StreetName" Type="Edm.String"/>
		<Property Name="HouseNumber" Type="Edm.String"/>
	</EntityType>
	<EntityType Name="BusinessPartnerAddress2">
		<Key>
			<PropertyRef Name="BusinessPartner"/>
		</Key>
		<Property Name="BusinessPartner" Type="Edm.String" Nullable="false"/>
		<Property Name="FullName" Type="Edm.String"/>
		<Property Name="CityName" Type="Edm.String"/>
		<Property Name="Country" Type="Edm.String"/>
		<Property Name="PostalCode" Type="Edm.String"/>
		<Property Name="StreetName" Type="Edm.String"/>
		<Property Name="HouseNumber" Type="Edm.String"/>
	</EntityType>
	<EntityType Name="BusinessPartnerAddress3">
		<Key>
			<PropertyRef Name="BusinessPartner"/>
		</Key>
		<Property Name="BusinessPartner" Type="Edm.String" Nullable="false"/>
		<Property Name="FullName" Type="Edm.String"/>
		<Property Name="CityName" Type="Edm.String"/>
		<Property Name="PostalCode" Type="Edm.String"/>
	</EntityType>
	<Annotations Target="sap.fe.core.Service.RootEntity/valueHelpField5_1">
		<Annotation Term="Common.Text" Path="_BusinessPartnerAddress_VHF5_1/FullName"/>
		<Annotation Term="Common.ValueList">
			<Record Type="Common.ValueListType">
				<PropertyValue Property="Label" String="Business Partner Address"/>
				<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress"/>
				<PropertyValue Property="Parameters">
					<Collection>
						<Record Type="Common.ValueListParameterInOut">
							<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField5_1"/>
							<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
							<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="FullName"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="Country"/>
							<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
						</Record>
					</Collection>
				</PropertyValue>
			</Record>
		</Annotation>
		<Annotation Term="Common.ValueList" Qualifier="qualifier2">
			<Record Type="Common.ValueListType">
				<PropertyValue Property="Label" String="Business Partner Address 2"/>
				<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress2"/>
				<PropertyValue Property="Parameters">
					<Collection>
						<Record Type="Common.ValueListParameterInOut">
							<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField5_1"/>
							<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="FullName"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="Country"/>
						</Record>
					</Collection>
				</PropertyValue>
			</Record>
		</Annotation>
		<Annotation Term="Common.ValueList" Qualifier="qualifier3">
			<Record Type="Common.ValueListType">
				<PropertyValue Property="Label" String="Business Partner Address 3"/>
				<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress"/>
				<PropertyValue Property="Parameters">
					<Collection>
						<Record Type="Common.ValueListParameterInOut">
							<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField5_1"/>
							<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="PostalCode"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="CityName"/>
						</Record>
					</Collection>
				</PropertyValue>
			</Record>
		</Annotation>
		<Annotation Term="Common.Label" String="Value Help Field 5_1"/>
	</Annotations>

		`.slice(2, -2)
		}
	},
	/* 6.) Control the content of the Multiple Value Help list */
	{
		id: "codeVHControlMultiValueSource",
		code: {
			cds: /* cds */ `
	entity BusinessPartnerAddress {
		key BusinessPartner : String @title: 'Business Partner';
			FullName        : String @title: 'Name';
			CityName        : String @title: 'City';
			Country         : String @title: 'Country';
			PostalCode      : String @title: 'Postal Code';
			StreetName      : String @title: 'Street Name';
			HouseNumber     : String @title: 'House Number';
		};

	entity BusinessPartnerAddress2 {
	key BusinessPartner : String @(
			Common: {
			Text           : FullName, //Text not optional if you want to have a display format via TextArrangement in the value list
			TextArrangement: #TextFirst //sets presentation of key and description value like 'description (key)' in the value help table.
			},
			title : 'Business Partner'
		);
		FullName        : String @title: 'Name';
		CityName        : String @title: 'City';
		Country         : String @title: 'Country';
		PostalCode      : String @title: 'Postal Code';
		StreetName      : String @title: 'Street Name';
		HouseNumber     : String @title: 'House Number';
	};

	annotate RootEntity with {
		@(Common: {
		  ValueListWithFixedValues: true,
		  ValueList               : {
			Label         : 'Business Partner Address',
			CollectionPath: 'BusinessPartnerAddress',
			Parameters    : [{
			  $Type            : 'Common.ValueListParameterInOut',
			  LocalDataProperty: valueHelpField6_1,
			  ValueListProperty: 'BusinessPartner'
			}]
		  }
		})
		valueHelpField6_1;

		@(Common: {
		  Text                       : _BusinessPartnerAddress_VHF6_2.FullName,
		  ValueListRelevantQualifiers: [

			{$edmJson: {$If: [
			  {$Eq: [
				{$Path: 'valueHelpField6_1'},
				{$String: '17100001'}
			  ]},
			  {$String: 'qualifier102'}
			]}},

			{$edmJson: {$If: [
			  {$Eq: [
				{$Path: 'valueHelpField6_1'},
				{$String: '17100001'}
			  ]},
			  {$String: 'qualifier103'}
			]}},

			{$edmJson: {$If: [
			  {$Eq: [
				{$Path: 'valueHelpField6_1'},
				{$String: '17100006'}
			  ]},
			  {$String: 'qualifier103'}
			]}},

			{$edmJson: {$If: [
			  {$Eq: [
				{$Path: 'valueHelpField6_1'},
				{$String: '17100006'}
			  ]},
			  {$String: 'qualifier104'}
			]}},

			{$edmJson: {$If: [
			  {$And: [
				{$Ne: [
				  {$Path: 'valueHelpField6_1'},
				  {$String: '17100001'}
				]},
				{$Ne: [
				  {$Path: 'valueHelpField6_1'},
				  {$String: '17100006'}
				]}
			  ]},
			  {$String: ''}
			]}}

		  ],
		  ValueList                  : {
			Label         : 'Business Partner Address',
			CollectionPath: 'BusinessPartnerAddress',
			Parameters    : [
			  {
				$Type            : 'Common.ValueListParameterInOut',
				LocalDataProperty: valueHelpField6_2,
				ValueListProperty: 'BusinessPartner',
				![@UI.Importance]: #High
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'FullName'
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'Country'
			  }
			]
		  },
		  ValueList #qualifier102    : {
			Label         : 'Business Partner Address 2',
			CollectionPath: 'BusinessPartnerAddress2',
			Parameters    : [
			  {
				$Type            : 'Common.ValueListParameterInOut',
				LocalDataProperty: valueHelpField6_2,
				ValueListProperty: 'BusinessPartner',
				![@UI.Importance]: #High
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'FullName'
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'Country'
			  }
			]
		  },
		  ValueList #qualifier103    : {
			Label         : 'Business Partner Address 3',
			CollectionPath: 'BusinessPartnerAddress',
			Parameters    : [
			  {
				$Type            : 'Common.ValueListParameterInOut',
				LocalDataProperty: valueHelpField6_2,
				ValueListProperty: 'BusinessPartner',
				![@UI.Importance]: #High
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'FullName'
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'CityName'
			  }
			]
		  },
		  ValueList #qualifier104    : {
			Label         : 'Business Partner Address 4',
			CollectionPath: 'BusinessPartnerAddress',
			Parameters    : [
			  {
				$Type            : 'Common.ValueListParameterInOut',
				LocalDataProperty: valueHelpField6_2,
				ValueListProperty: 'BusinessPartner',
				![@UI.Importance]: #High
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'FullName'
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'CityName'
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'StreetName'
			  }
			]
		  }
		})
		valueHelpField6_2;
	}

		`.slice(2, -2), // remove first and last 2 newlines

			xml: `
	<EntityType Name="BusinessPartnerAddress">
		<Key>
			<PropertyRef Name="BusinessPartner"/>
		</Key>
		<Property Name="BusinessPartner" Type="Edm.String" Nullable="false"/>
		<Property Name="FullName" Type="Edm.String"/>
		<Property Name="CityName" Type="Edm.String"/>
		<Property Name="Country" Type="Edm.String"/>
		<Property Name="PostalCode" Type="Edm.String"/>
		<Property Name="StreetName" Type="Edm.String"/>
		<Property Name="HouseNumber" Type="Edm.String"/>
	</EntityType>
	<EntityType Name="BusinessPartnerAddress2">
		<Key>
			<PropertyRef Name="BusinessPartner"/>
		</Key>
		<Property Name="BusinessPartner" Type="Edm.String" Nullable="false"/>
		<Property Name="FullName" Type="Edm.String"/>
		<Property Name="CityName" Type="Edm.String"/>
		<Property Name="Country" Type="Edm.String"/>
		<Property Name="PostalCode" Type="Edm.String"/>
		<Property Name="StreetName" Type="Edm.String"/>
		<Property Name="HouseNumber" Type="Edm.String"/>
	</EntityType>
	<Annotations Target="sap.fe.core.Service.RootEntity/valueHelpField6_1">
		<Annotation Term="Common.ValueListWithFixedValues" Bool="true"/>
		<Annotation Term="Common.ValueList">
			<Record Type="Common.ValueListType">
				<PropertyValue Property="Label" String="Business Partner Address"/>
				<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress"/>
				<PropertyValue Property="Parameters">
					<Collection>
						<Record Type="Common.ValueListParameterInOut">
							<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField6_1"/>
							<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
						</Record>
					</Collection>
				</PropertyValue>
			</Record>
		</Annotation>
		<Annotation Term="Common.Label" String="Value Help Field 6_1"/>
	</Annotations>
	<Annotations Target="sap.fe.core.Service.RootEntity/valueHelpField6_2">
		<Annotation Term="Common.Text" Path="_BusinessPartnerAddress_VHF6_2/FullName"/>
		<Annotation Term="Common.ValueListRelevantQualifiers">
			<Collection>
			<If>
				<Eq>
					<Path>valueHelpField6_1</Path>
					<String>17100001</String>
				</Eq>
				<String>qualifier102</String>
			</If>
			<If>
				<Eq>
					<Path>valueHelpField6_1</Path>
					<String>17100001</String>
				</Eq>
				<String>qualifier103</String>
			</If>
			<If>
				<Eq>
					<Path>valueHelpField6_1</Path>
					<String>17100006</String>
				</Eq>
				<String>qualifier103</String>
			</If>
			<If>
				<Eq>
					<Path>valueHelpField6_1</Path>
					<String>17100006</String>
				</Eq>
				<String>qualifier104</String>
			</If>
			<If>
				<And>
				<Ne>
					<Path>valueHelpField6_1</Path>
					<String>17100001</String>
				</Ne>
				<Ne>
					<Path>valueHelpField6_1</Path>
					<String>17100006</String>
				</Ne>
				</And>
				<String></String>
			</If>
			</Collection>
		</Annotation>
		<Annotation Term="Common.ValueList">
			<Record Type="Common.ValueListType">
				<PropertyValue Property="Label" String="Business Partner Address"/>
				<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress"/>
				<PropertyValue Property="Parameters">
					<Collection>
						<Record Type="Common.ValueListParameterInOut">
							<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField6_2"/>
							<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
							<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="FullName"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="Country"/>
						</Record>
					</Collection>
				</PropertyValue>
			</Record>
		</Annotation>
		<Annotation Term="Common.ValueList" Qualifier="qualifier102">
			<Record Type="Common.ValueListType">
				<PropertyValue Property="Label" String="Business Partner Address 2"/>
				<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress2"/>
				<PropertyValue Property="Parameters">
					<Collection>
						<Record Type="Common.ValueListParameterInOut">
							<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField6_2"/>
							<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
							<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="FullName"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="Country"/>
						</Record>
					</Collection>
				</PropertyValue>
			</Record>
		</Annotation>
		<Annotation Term="Common.ValueList" Qualifier="qualifier103">
			<Record Type="Common.ValueListType">
				<PropertyValue Property="Label" String="Business Partner Address 3"/>
				<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress"/>
				<PropertyValue Property="Parameters">
					<Collection>
						<Record Type="Common.ValueListParameterInOut">
							<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField6_2"/>
							<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
							<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="FullName"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="CityName"/>
						</Record>
					</Collection>
				</PropertyValue>
			</Record>
		</Annotation>
		<Annotation Term="Common.ValueList" Qualifier="qualifier104">
			<Record Type="Common.ValueListType">
				<PropertyValue Property="Label" String="Business Partner Address 4"/>
				<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress"/>
				<PropertyValue Property="Parameters">
					<Collection>
						<Record Type="Common.ValueListParameterInOut">
							<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField6_2"/>
							<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
							<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="FullName"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="CityName"/>
						</Record>
						<Record Type="Common.ValueListParameterDisplayOnly">
							<PropertyValue Property="ValueListProperty" String="StreetName"/>
						</Record>
					</Collection>
				</PropertyValue>
			</Record>
		</Annotation>
		<Annotation Term="Common.Label" String="Value Help Field 6_2"/>
	</Annotations>

		`.slice(2, -2)
		}
	},
	/* 7.) In / Out Mappings in the ValueList Annotation */
	{
		id: "codeVHInOutMappingsSource",
		code: {
			cds: /* cds */ `
	entity BusinessPartnerAddress {
		key BusinessPartner : String @title: 'Business Partner';
			FullName        : String @title: 'Name';
			CityName        : String @title: 'City';
			Country         : String @title: 'Country';
			PostalCode      : String @title: 'Postal Code';
			StreetName      : String @title: 'Street Name';
			HouseNumber     : String @title: 'House Number';
			Account         : String @title: 'Account';
		};

	entity Account {
		key Account  : String @title: 'Account';
			FullName : String @title: 'Name';
			CityName : String @title: 'City';
			Country  : String @title: 'Country';
	};

	entity PartnerFunction {
		key PartnerFunction     : String @(
				title : 'PF',
				Common: {Text: PartnerFunctionName}
			);
		PartnerFunctionName : String @title: 'Partner Function';
	};

	entity AccBp {
		key Account          : String @title: 'Account';
		key BusinessPartner  : String @title: 'Business Partner';
			PartnerFunction  : String @(
				title : 'PF',
				Common: {Text: _PartnerFunction.PartnerFunctionName}
			);
		_PartnerFunction : Association to one PartnerFunction
								on _PartnerFunction.PartnerFunction = PartnerFunction;
	};

	annotate RootEntity with {
		@(Common: {ValueList: {
		  CollectionPath: 'Account',
		  Parameters    : [
			{
			  $Type            : 'Common.ValueListParameterInOut',
			  LocalDataProperty: valueHelpField7_1,
			  ValueListProperty: 'Account',
			  ![@UI.Importance]: #High
			},
			{
			  $Type            : 'Common.ValueListParameterOut',
			  LocalDataProperty: valueHelpField7_2,
			  ValueListProperty: 'FullName',
			  ![@UI.Importance]: #High
			},
			{
			  $Type            : 'Common.ValueListParameterDisplayOnly',
			  ValueListProperty: 'CityName'
			},
			{
			  $Type            : 'Common.ValueListParameterDisplayOnly',
			  ValueListProperty: 'Country'
			},
		  ],
		}}, )
		valueHelpField7_1;
	}

	// valueHelpField7_2 is only a input field prefilled with the filter result from valueHelpField7_1


	annotate RootEntity with {
		@(Common: {
		  ValueListForValidation: '',
		  ValueList             : {
			Label         : 'Business Partner Address',
			CollectionPath: 'BusinessPartnerAddress',
			Parameters    : [
			  {
				$Type            : 'Common.ValueListParameterInOut',
				LocalDataProperty: valueHelpField7_3,
				ValueListProperty: 'BusinessPartner',
				![@UI.Importance]: #High
			  },
			  {
				$Type            : 'Common.ValueListParameterIn',
				LocalDataProperty: valueHelpField7_1,
				ValueListProperty: 'Account',
			  },
			  {
				$Type            : 'Common.ValueListParameterDisplayOnly',
				ValueListProperty: 'CityName',
				![@UI.Importance]: #High
			  },
			],
		  }
		}, )
		valueHelpField7_3;
	  }

	  annotate RootEntity with {
		@(Common: {
		  Text           : _PartnerFunction.PartnerFunctionName,
		  TextArrangement: #TextOnly,
		  ValueList: {
		  Label         : 'Partner Function',
		  CollectionPath: 'AccBp',
		  Parameters    : [
			{
			  $Type            : 'Common.ValueListParameterInOut',
			  LocalDataProperty: valueHelpField7_4,
			  ValueListProperty: 'PartnerFunction',
			  ![@UI.Importance]: #High
			},
			{
			  $Type            : 'Common.ValueListParameterIn',
			  LocalDataProperty: valueHelpField7_1,
			  ValueListProperty: 'Account',
			  ![@UI.Importance]: #High
			},
			{
			  $Type            : 'Common.ValueListParameterInOut',
			  LocalDataProperty: valueHelpField7_3,
			  ValueListProperty: 'BusinessPartner',
			  ![@UI.Importance]: #High
			},
			{
			  $Type            : 'Common.ValueListParameterDisplayOnly',
			  ValueListProperty: '_PartnerFunction/PartnerFunctionName',
			  ![@UI.Importance]: #High
			}
		  ],
		}}, )
		valueHelpField7_4;
	  }

	annotate RootEntity with
		@(UI.FieldGroup #Example7: {
		Label: 'Example7',
		$Type: 'UI.FieldGroupType',
		Data : [
			{
			Value: valueHelpField7_1,
			$Type: 'UI.DataField',
			},
			{
			Value: valueHelpField7_2,
			$Type: 'UI.DataField',
			},
			{
			Value: valueHelpField7_3,
			$Type: 'UI.DataField',
			},
			{
			Value: valueHelpField7_4,
			$Type: 'UI.DataField',
			},
		]
	});

		`.slice(2, -2), // remove first and last 2 newlines

			xml: `

		<EntityType Name="BusinessPartnerAddress">
			<Key>
				<PropertyRef Name="BusinessPartner"/>
			</Key>
			<Property Name="BusinessPartner" Type="Edm.String" Nullable="false"/>
			<Property Name="FullName" Type="Edm.String"/>
			<Property Name="CityName" Type="Edm.String"/>
			<Property Name="Country" Type="Edm.String"/>
			<Property Name="PostalCode" Type="Edm.String"/>
			<Property Name="StreetName" Type="Edm.String"/>
			<Property Name="HouseNumber" Type="Edm.String"/>
			<Property Name="Account" Type="Edm.String"/>
		</EntityType>
			<EntityType Name="Account">
			<Key>
				<PropertyRef Name="Account"/>
			</Key>
			<Property Name="Account" Type="Edm.String" Nullable="false"/>
			<Property Name="FullName" Type="Edm.String"/>
			<Property Name="CityName" Type="Edm.String"/>
			<Property Name="Country" Type="Edm.String"/>
		</EntityType>
		<EntityType Name="PartnerFunction">
			<Key>
				<PropertyRef Name="PartnerFunction"/>
			</Key>
			<Property Name="PartnerFunction" Type="Edm.String" Nullable="false"/>
			<Property Name="PartnerFunctionName" Type="Edm.String"/>
		</EntityType>
		<EntityType Name="AccBp">
			<Key>
				<PropertyRef Name="Account"/>
				<PropertyRef Name="BusinessPartner"/>
			</Key>
			<Property Name="Account" Type="Edm.String" Nullable="false"/>
			<Property Name="BusinessPartner" Type="Edm.String" Nullable="false"/>
			<Property Name="PartnerFunction" Type="Edm.String"/>
			<NavigationProperty Name="_PartnerFunction" Type="sap.fe.core.Service.PartnerFunction">
				<ReferentialConstraint Property="PartnerFunction" ReferencedProperty="PartnerFunction"/>
			</NavigationProperty>
		</EntityType>

		<Annotations Target="sap.fe.core.Service.RootEntity/valueHelpField7_1">
			<Annotation Term="Common.ValueList">
				<Record Type="Common.ValueListType">
				<PropertyValue Property="CollectionPath" String="Account"/>
				<PropertyValue Property="Parameters">
					<Collection>
					<Record Type="Common.ValueListParameterInOut">
						<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField7_1"/>
						<PropertyValue Property="ValueListProperty" String="Account"/>
						<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
					</Record>
					<Record Type="Common.ValueListParameterOut">
						<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField7_2"/>
						<PropertyValue Property="ValueListProperty" String="FullName"/>
						<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
					</Record>
					<Record Type="Common.ValueListParameterDisplayOnly">
						<PropertyValue Property="ValueListProperty" String="CityName"/>
					</Record>
					<Record Type="Common.ValueListParameterDisplayOnly">
						<PropertyValue Property="ValueListProperty" String="Country"/>
					</Record>
					</Collection>
				</PropertyValue>
				</Record>
			</Annotation>
			<Annotation Term="Common.Label" String="Account ID"/>
			</Annotations>
			<Annotations Target="sap.fe.core.Service.RootEntity/valueHelpField7_2">
			<Annotation Term="Common.Label" String="Account Full Name"/>
		</Annotations>
		<Annotations Target="sap.fe.core.Service.RootEntity/valueHelpField7_3">
			<Annotation Term="Common.ValueListForValidation" String=""/>
			<Annotation Term="Common.ValueList">
				<Record Type="Common.ValueListType">
				<PropertyValue Property="Label" String="Business Partner Address"/>
				<PropertyValue Property="CollectionPath" String="BusinessPartnerAddress"/>
				<PropertyValue Property="Parameters">
					<Collection>
					<Record Type="Common.ValueListParameterInOut">
						<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField7_3"/>
						<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
						<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
					</Record>
					<Record Type="Common.ValueListParameterIn">
						<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField7_1"/>
						<PropertyValue Property="ValueListProperty" String="Account"/>
					</Record>
					<Record Type="Common.ValueListParameterDisplayOnly">
						<PropertyValue Property="ValueListProperty" String="CityName"/>
						<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
					</Record>
					</Collection>
				</PropertyValue>
				</Record>
			</Annotation>
			<Annotation Term="Common.Label" String="Business Partner"/>
		</Annotations>
		<Annotations Target="sap.fe.core.Service.RootEntity/valueHelpField7_4">
			<Annotation Term="Common.Text" Path="_PartnerFunction/PartnerFunctionName">
				<Annotation Term="UI.TextArrangement" EnumMember="UI.TextArrangementType/TextOnly"/>
			</Annotation>
			<Annotation Term="Common.ValueList">
				<Record Type="Common.ValueListType">
				<PropertyValue Property="Label" String="Partner Function"/>
				<PropertyValue Property="CollectionPath" String="AccBp"/>
				<PropertyValue Property="Parameters">
					<Collection>
					<Record Type="Common.ValueListParameterInOut">
						<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField7_4"/>
						<PropertyValue Property="ValueListProperty" String="PartnerFunction"/>
						<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
					</Record>
					<Record Type="Common.ValueListParameterIn">
						<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField7_1"/>
						<PropertyValue Property="ValueListProperty" String="Account"/>
						<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
					</Record>
					<Record Type="Common.ValueListParameterInOut">
						<PropertyValue Property="LocalDataProperty" PropertyPath="valueHelpField7_3"/>
						<PropertyValue Property="ValueListProperty" String="BusinessPartner"/>
						<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
					</Record>
					<Record Type="Common.ValueListParameterDisplayOnly">
						<PropertyValue Property="ValueListProperty" String="_PartnerFunction/PartnerFunctionName"/>
						<Annotation Term="UI.Importance" EnumMember="UI.ImportanceType/High"/>
					</Record>
					</Collection>
				</PropertyValue>
				</Record>
			</Annotation>
			<Annotation Term="Common.Label" String="Partner Function"/>
		</Annotations>

		`.slice(2, -2)
		}
	}
];

export default PageController.extend("sap.fe.core.fpmExplorer.guidanceValueHelp.EntryPage", {
	onInit: function (this: PageController) {
		PageController.prototype.onInit.apply(this);
		const uiModel: JSONModel = new JSONModel({ isEditable: true });
		this.getView().setModel(uiModel, "ui");
		for (const oSnippet of CODESNIPPETS) {
			const oEditor: CodeEditor = this.byId(oSnippet.id) as CodeEditor;
			oEditor.setValue(oSnippet.code.cds);
			oEditor.setMaxLines(20);
		}
	},

	onSelectTab: function (oEvent: any) {
		const sFilterId = oEvent.getParameter("selectedKey"); //e.g. codeVHFixedValuesHelpSourceCDS
		const codeEditorId = sFilterId.substr(0, sFilterId.length - 3); //e.g. codeValueHelpingleSource
		const snippet = sFilterId.substr(sFilterId.length - 3).toLowerCase() as keyof snippetType; //e.g. cds or xml
		const oEditor = this.byId(codeEditorId) as CodeEditor;
		//access code snippet by type, and set editor type accordingly
		oEditor.setValue(CODESNIPPETS.find((x) => x.id === codeEditorId)?.code[snippet])?.setType(snippet != "cds" ? snippet : "red");
	}
});
