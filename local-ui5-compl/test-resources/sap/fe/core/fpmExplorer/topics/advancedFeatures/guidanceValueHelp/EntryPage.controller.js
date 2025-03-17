/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/PageController", "sap/ui/model/json/JSONModel"], function (PageController, JSONModel) {
  "use strict";

  const CODESNIPPETS = [/* 1.) Dropdown Value Help */
  {
    id: "codeVHFixedValuesHelpSingleSelectSource",
    code: {
      cds: /* cds */`

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

	`.slice(2, -2),
      // remove first and last 2 newlines

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
  }, /* 2.) Dialog Value Help */
  {
    id: "codeVHDialogSingleSelectSource",
    code: {
      cds: /* cds */`

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

	`.slice(2, -2),
      // remove first and last 2 newlines

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
  }, /* 3.) Validation */
  {
    id: "codeVHValidationSource",
    code: {
      cds: /* cds */`

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

	`.slice(2, -2),
      // remove first and last 2 newlines

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
  }, /* 4.) Context Dependent Value Help */
  {
    id: "codeVHContextDependentSource",
    code: {
      cds: /* cds */`

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

	`.slice(2, -2),
      // remove first and last 2 newlines

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
  }, /* 5.) Multi Value Help Dialogs */
  {
    id: "codeVHMultiValueSource",
    code: {
      cds: /* cds */`

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

		`.slice(2, -2),
      // remove first and last 2 newlines

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
  }, /* 6.) Control the content of the Multiple Value Help list */
  {
    id: "codeVHControlMultiValueSource",
    code: {
      cds: /* cds */`
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

		`.slice(2, -2),
      // remove first and last 2 newlines

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
  }, /* 7.) In / Out Mappings in the ValueList Annotation */
  {
    id: "codeVHInOutMappingsSource",
    code: {
      cds: /* cds */`
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

		`.slice(2, -2),
      // remove first and last 2 newlines

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
  }];
  return PageController.extend("sap.fe.core.fpmExplorer.guidanceValueHelp.EntryPage", {
    onInit: function () {
      PageController.prototype.onInit.apply(this);
      const uiModel = new JSONModel({
        isEditable: true
      });
      this.getView().setModel(uiModel, "ui");
      for (const oSnippet of CODESNIPPETS) {
        const oEditor = this.byId(oSnippet.id);
        oEditor.setValue(oSnippet.code.cds);
        oEditor.setMaxLines(20);
      }
    },
    onSelectTab: function (oEvent) {
      const sFilterId = oEvent.getParameter("selectedKey"); //e.g. codeVHFixedValuesHelpSourceCDS
      const codeEditorId = sFilterId.substr(0, sFilterId.length - 3); //e.g. codeValueHelpingleSource
      const snippet = sFilterId.substr(sFilterId.length - 3).toLowerCase(); //e.g. cds or xml
      const oEditor = this.byId(codeEditorId);
      //access code snippet by type, and set editor type accordingly
      oEditor.setValue(CODESNIPPETS.find(x => x.id === codeEditorId)?.code[snippet])?.setType(snippet != "cds" ? snippet : "red");
    }
  });
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDT0RFU05JUFBFVFMiLCJpZCIsImNvZGUiLCJjZHMiLCJzbGljZSIsInhtbCIsIlBhZ2VDb250cm9sbGVyIiwiZXh0ZW5kIiwib25Jbml0IiwicHJvdG90eXBlIiwiYXBwbHkiLCJ1aU1vZGVsIiwiSlNPTk1vZGVsIiwiaXNFZGl0YWJsZSIsImdldFZpZXciLCJzZXRNb2RlbCIsIm9TbmlwcGV0Iiwib0VkaXRvciIsImJ5SWQiLCJzZXRWYWx1ZSIsInNldE1heExpbmVzIiwib25TZWxlY3RUYWIiLCJvRXZlbnQiLCJzRmlsdGVySWQiLCJnZXRQYXJhbWV0ZXIiLCJjb2RlRWRpdG9ySWQiLCJzdWJzdHIiLCJsZW5ndGgiLCJzbmlwcGV0IiwidG9Mb3dlckNhc2UiLCJmaW5kIiwieCIsInNldFR5cGUiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkVudHJ5UGFnZS5jb250cm9sbGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYWdlQ29udHJvbGxlciBmcm9tIFwic2FwL2ZlL2NvcmUvUGFnZUNvbnRyb2xsZXJcIjtcbmltcG9ydCB0eXBlIENvZGVFZGl0b3IgZnJvbSBcInNhcC91aS9jb2RlZWRpdG9yL0NvZGVFZGl0b3JcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuXG50eXBlIHNuaXBwZXRUeXBlID0geyBjZHM6IHN0cmluZzsgeG1sOiBzdHJpbmcgfTtcbnR5cGUgY29kZVNuaXBwZXQgPSB7IGlkOiBzdHJpbmc7IGNvZGU6IHNuaXBwZXRUeXBlIH07XG5jb25zdCBDT0RFU05JUFBFVFM6IEFycmF5PGNvZGVTbmlwcGV0PiA9IFtcblx0LyogMS4pIERyb3Bkb3duIFZhbHVlIEhlbHAgKi9cblx0e1xuXHRcdGlkOiBcImNvZGVWSEZpeGVkVmFsdWVzSGVscFNpbmdsZVNlbGVjdFNvdXJjZVwiLFxuXHRcdGNvZGU6IHtcblx0XHRcdGNkczogLyogY2RzICovIGBcblxuXHRlbnRpdHkgQnVzaW5lc3NQYXJ0bmVyQWRkcmVzcyB7XG5cdFx0a2V5IEJ1c2luZXNzUGFydG5lciA6IFN0cmluZyBAdGl0bGU6ICdCdXNpbmVzcyBQYXJ0bmVyJztcblx0XHRcdEZ1bGxOYW1lICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdOYW1lJztcblx0XHRcdENpdHlOYW1lICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdDaXR5Jztcblx0XHRcdENvdW50cnkgICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdDb3VudHJ5Jztcblx0XHRcdFBvc3RhbENvZGUgICAgICA6IFN0cmluZyBAdGl0bGU6ICdQb3N0YWwgQ29kZSc7XG5cdFx0XHRTdHJlZXROYW1lICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnU3RyZWV0IE5hbWUnO1xuXHRcdFx0SG91c2VOdW1iZXIgICAgIDogU3RyaW5nIEB0aXRsZTogJ0hvdXNlIE51bWJlcic7XG5cdH07XG5cblx0ZW50aXR5IEJ1c2luZXNzUGFydG5lckFkZHJlc3MyIHtcblx0XHRrZXkgQnVzaW5lc3NQYXJ0bmVyIDogU3RyaW5nIEAoXG5cdFx0XHRcdENvbW1vbjoge1xuXHRcdFx0XHRUZXh0ICAgICAgICAgICA6IEZ1bGxOYW1lLCAvL1RleHQgbm90IG9wdGlvbmFsIGlmIHlvdSB3YW50IHRvIGhhdmUgYSBkaXNwbGF5IGZvcm1hdCB2aWEgVGV4dEFycmFuZ2VtZW50IGluIHRoZSB2YWx1ZSBsaXN0XG5cdFx0XHRcdFRleHRBcnJhbmdlbWVudDogI1RleHRGaXJzdCAvL3NldHMgcHJlc2VudGF0aW9uIG9mIGtleSBhbmQgZGVzY3JpcHRpb24gdmFsdWUgbGlrZSAnZGVzY3JpcHRpb24gKGtleSknIGluIHRoZSB2YWx1ZSBoZWxwIHRhYmxlLlxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aXRsZSA6ICdCdXNpbmVzcyBQYXJ0bmVyJ1xuXHRcdFx0KTtcblx0XHRcdEZ1bGxOYW1lICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdOYW1lJztcblx0XHRcdENpdHlOYW1lICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdDaXR5Jztcblx0XHRcdENvdW50cnkgICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdDb3VudHJ5Jztcblx0XHRcdFBvc3RhbENvZGUgICAgICA6IFN0cmluZyBAdGl0bGU6ICdQb3N0YWwgQ29kZSc7XG5cdFx0XHRTdHJlZXROYW1lICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnU3RyZWV0IE5hbWUnO1xuXHRcdFx0SG91c2VOdW1iZXIgICAgIDogU3RyaW5nIEB0aXRsZTogJ0hvdXNlIE51bWJlcic7XG5cdH07XG5cblx0YW5ub3RhdGUgUm9vdEVudGl0eSB3aXRoIHtcblx0XHRAKENvbW1vbjoge1xuXHRcdCAgVmFsdWVMaXN0V2l0aEZpeGVkVmFsdWVzOiB0cnVlLFxuXHRcdCAgVmFsdWVMaXN0ICAgICAgICAgICAgICAgOiB7XG5cdFx0XHRDb2xsZWN0aW9uUGF0aDogJ0J1c2luZXNzUGFydG5lckFkZHJlc3MnLFxuXHRcdFx0UGFyYW1ldGVycyAgICA6IFtcblx0XHRcdCAge1xuXHRcdFx0XHQkVHlwZSAgICAgICAgICAgIDogJ0NvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dCcsXG5cdFx0XHRcdExvY2FsRGF0YVByb3BlcnR5OiB2YWx1ZUhlbHBGaWVsZDFfMSxcblx0XHRcdFx0VmFsdWVMaXN0UHJvcGVydHk6ICdCdXNpbmVzc1BhcnRuZXInXG5cdFx0XHQgIH0sXG5cdFx0XHQgIHtcblx0XHRcdFx0JFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHknLFxuXHRcdFx0XHRWYWx1ZUxpc3RQcm9wZXJ0eTogJ0Z1bGxOYW1lJ1xuXHRcdFx0ICB9XG5cdFx0XHRdXG5cdFx0ICB9XG5cdFx0fSApXG5cdFx0dmFsdWVIZWxwRmllbGQxXzE7XG5cblx0XHRAKENvbW1vbjoge1xuXHRcdCAgVGV4dCAgICAgICAgICAgICAgICAgICAgOiBfQnVzaW5lc3NQYXJ0bmVyQWRkcmVzc19WSEYxXzIuRnVsbE5hbWUsXG5cdFx0ICBWYWx1ZUxpc3RXaXRoRml4ZWRWYWx1ZXM6IHRydWUsXG5cdFx0ICBWYWx1ZUxpc3QgICAgICAgICAgICAgICA6IHtcblx0XHRcdENvbGxlY3Rpb25QYXRoOiAnQnVzaW5lc3NQYXJ0bmVyQWRkcmVzczInLFxuXHRcdFx0UGFyYW1ldGVycyAgICA6IFtcblx0XHRcdCAge1xuXHRcdFx0XHQkVHlwZSAgICAgICAgICAgIDogJ0NvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dCcsXG5cdFx0XHRcdExvY2FsRGF0YVByb3BlcnR5OiB2YWx1ZUhlbHBGaWVsZDFfMixcblx0XHRcdFx0VmFsdWVMaXN0UHJvcGVydHk6ICdCdXNpbmVzc1BhcnRuZXInXG5cdFx0XHQgIH1cblx0XHRcdF1cblx0XHQgIH1cblx0XHR9IClcblx0XHR2YWx1ZUhlbHBGaWVsZDFfMjtcblx0fVxuXG5cdGAuc2xpY2UoMiwgLTIpLCAvLyByZW1vdmUgZmlyc3QgYW5kIGxhc3QgMiBuZXdsaW5lc1xuXG5cdFx0XHR4bWw6IGBcblxuXHQ8RW50aXR5VHlwZSBOYW1lPVwiQnVzaW5lc3NQYXJ0bmVyQWRkcmVzc1wiPlxuXHRcdDxLZXk+XG5cdFx0XHQ8UHJvcGVydHlSZWYgTmFtZT1cIkJ1c2luZXNzUGFydG5lclwiLz5cblx0XHQ8L0tleT5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkJ1c2luZXNzUGFydG5lclwiIFR5cGU9XCJFZG0uU3RyaW5nXCIgTnVsbGFibGU9XCJmYWxzZVwiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkZ1bGxOYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJDaXR5TmFtZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiQ291bnRyeVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiUG9zdGFsQ29kZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiU3RyZWV0TmFtZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiSG91c2VOdW1iZXJcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0PC9FbnRpdHlUeXBlPlxuXHQ8RW50aXR5VHlwZSBOYW1lPVwiQnVzaW5lc3NQYXJ0bmVyQWRkcmVzczJcIj5cblx0XHQ8S2V5PlxuXHRcdFx0PFByb3BlcnR5UmVmIE5hbWU9XCJCdXNpbmVzc1BhcnRuZXJcIi8+XG5cdFx0PC9LZXk+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJCdXNpbmVzc1BhcnRuZXJcIiBUeXBlPVwiRWRtLlN0cmluZ1wiIE51bGxhYmxlPVwiZmFsc2VcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJGdWxsTmFtZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiQ2l0eU5hbWVcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkNvdW50cnlcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIlBvc3RhbENvZGVcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIlN0cmVldE5hbWVcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkhvdXNlTnVtYmVyXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdDwvRW50aXR5VHlwZT5cblx0PEFubm90YXRpb25zIFRhcmdldD1cInNhcC5mZS5jb3JlLlNlcnZpY2UuUm9vdEVudGl0eS92YWx1ZUhlbHBGaWVsZDFfMVwiPlxuXHRcdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uVmFsdWVMaXN0V2l0aEZpeGVkVmFsdWVzXCIgQm9vbD1cInRydWVcIi8+XG5cdFx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5WYWx1ZUxpc3RcIj5cblx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0VHlwZVwiPlxuXHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJDb2xsZWN0aW9uUGF0aFwiIFN0cmluZz1cIkJ1c2luZXNzUGFydG5lckFkZHJlc3NcIi8+XG5cdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlBhcmFtZXRlcnNcIj5cblx0XHRcdDxDb2xsZWN0aW9uPlxuXHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW5PdXRcIj5cblx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkxvY2FsRGF0YVByb3BlcnR5XCIgUHJvcGVydHlQYXRoPVwidmFsdWVIZWxwRmllbGQxXzFcIi8+XG5cdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIkJ1c2luZXNzUGFydG5lclwiLz5cblx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seVwiPlxuXHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVmFsdWVMaXN0UHJvcGVydHlcIiBTdHJpbmc9XCJGdWxsTmFtZVwiLz5cblx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHQ8L0NvbGxlY3Rpb24+XG5cdFx0XHQ8L1Byb3BlcnR5VmFsdWU+XG5cdFx0PC9SZWNvcmQ+XG5cdFx0PC9Bbm5vdGF0aW9uPlxuXHRcdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uTGFiZWxcIiBTdHJpbmc9XCJWYWx1ZSBIZWxwIEZpZWxkIDFfMVwiLz5cbiAgICA8L0Fubm90YXRpb25zPlxuICAgIDxBbm5vdGF0aW9ucyBUYXJnZXQ9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLlJvb3RFbnRpdHkvdmFsdWVIZWxwRmllbGQxXzJcIj5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlRleHRcIiBQYXRoPVwiX0J1c2luZXNzUGFydG5lckFkZHJlc3NfVkhGMV8yL0Z1bGxOYW1lXCIvPlxuXHRcdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uVmFsdWVMaXN0V2l0aEZpeGVkVmFsdWVzXCIgQm9vbD1cInRydWVcIi8+XG5cdFx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5WYWx1ZUxpc3RcIj5cblx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0VHlwZVwiPlxuXHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJDb2xsZWN0aW9uUGF0aFwiIFN0cmluZz1cIkJ1c2luZXNzUGFydG5lckFkZHJlc3MyXCIvPlxuXHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJQYXJhbWV0ZXJzXCI+XG5cdFx0XHQ8Q29sbGVjdGlvbj5cblx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0XCI+XG5cdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJMb2NhbERhdGFQcm9wZXJ0eVwiIFByb3BlcnR5UGF0aD1cInZhbHVlSGVscEZpZWxkMV8yXCIvPlxuXHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVmFsdWVMaXN0UHJvcGVydHlcIiBTdHJpbmc9XCJCdXNpbmVzc1BhcnRuZXJcIi8+XG5cdFx0XHRcdDwvUmVjb3JkPlxuXHRcdFx0PC9Db2xsZWN0aW9uPlxuXHRcdFx0PC9Qcm9wZXJ0eVZhbHVlPlxuXHRcdDwvUmVjb3JkPlxuXHRcdDwvQW5ub3RhdGlvbj5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLkxhYmVsXCIgU3RyaW5nPVwiVmFsdWUgSGVscCBGaWVsZCAxXzJcIi8+XG4gICAgPC9Bbm5vdGF0aW9ucz5cblxuXHRgLnNsaWNlKDIsIC0yKVxuXHRcdH1cblx0fSxcblx0LyogMi4pIERpYWxvZyBWYWx1ZSBIZWxwICovXG5cdHtcblx0XHRpZDogXCJjb2RlVkhEaWFsb2dTaW5nbGVTZWxlY3RTb3VyY2VcIixcblx0XHRjb2RlOiB7XG5cdFx0XHRjZHM6IC8qIGNkcyAqLyBgXG5cblx0ZW50aXR5IEJ1c2luZXNzUGFydG5lckFkZHJlc3Mge1xuXHRcdGtleSBCdXNpbmVzc1BhcnRuZXIgOiBTdHJpbmcgQHRpdGxlOiAnQnVzaW5lc3MgUGFydG5lcic7XG5cdFx0XHRGdWxsTmFtZSAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnTmFtZSc7XG5cdFx0XHRDaXR5TmFtZSAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnQ2l0eSc7XG5cdFx0XHRDb3VudHJ5ICAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnQ291bnRyeSc7XG5cdFx0XHRQb3N0YWxDb2RlICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnUG9zdGFsIENvZGUnO1xuXHRcdFx0U3RyZWV0TmFtZSAgICAgIDogU3RyaW5nIEB0aXRsZTogJ1N0cmVldCBOYW1lJztcblx0XHRcdEhvdXNlTnVtYmVyICAgICA6IFN0cmluZyBAdGl0bGU6ICdIb3VzZSBOdW1iZXInO1xuXHR9O1xuXG5cdGVudGl0eSBCdXNpbmVzc1BhcnRuZXJBZGRyZXNzMiB7XG5cdFx0a2V5IEJ1c2luZXNzUGFydG5lciA6IFN0cmluZyBAKFxuXHRcdFx0XHRDb21tb246IHtcblx0XHRcdFx0VGV4dCAgICAgICAgICAgOiBGdWxsTmFtZSwgLy9UZXh0IG5vdCBvcHRpb25hbCBpZiB5b3Ugd2FudCB0byBoYXZlIGEgZGlzcGxheSBmb3JtYXQgdmlhIFRleHRBcnJhbmdlbWVudCBpbiB0aGUgdmFsdWUgbGlzdFxuXHRcdFx0XHRUZXh0QXJyYW5nZW1lbnQ6ICNUZXh0Rmlyc3QgLy9zZXRzIHByZXNlbnRhdGlvbiBvZiBrZXkgYW5kIGRlc2NyaXB0aW9uIHZhbHVlIGxpa2UgJ2Rlc2NyaXB0aW9uIChrZXkpJyBpbiB0aGUgdmFsdWUgaGVscCB0YWJsZS5cblx0XHRcdFx0fSxcblx0XHRcdFx0dGl0bGUgOiAnQnVzaW5lc3MgUGFydG5lcidcblx0XHRcdCk7XG5cdFx0XHRGdWxsTmFtZSAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnTmFtZSc7XG5cdFx0XHRDaXR5TmFtZSAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnQ2l0eSc7XG5cdFx0XHRDb3VudHJ5ICAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnQ291bnRyeSc7XG5cdFx0XHRQb3N0YWxDb2RlICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnUG9zdGFsIENvZGUnO1xuXHRcdFx0U3RyZWV0TmFtZSAgICAgIDogU3RyaW5nIEB0aXRsZTogJ1N0cmVldCBOYW1lJztcblx0XHRcdEhvdXNlTnVtYmVyICAgICA6IFN0cmluZyBAdGl0bGU6ICdIb3VzZSBOdW1iZXInO1xuXHR9O1xuXG5cdGFubm90YXRlIEJ1c2luZXNzUGFydG5lckFkZHJlc3MzIHdpdGggQChDYXBhYmlsaXRpZXMuU2VhcmNoUmVzdHJpY3Rpb25zLlNlYXJjaGFibGU6IGZhbHNlKTtcblxuXHRlbnRpdHkgQnVzaW5lc3NQYXJ0bmVyQWRkcmVzczMge1xuXHRcdGtleSBCdXNpbmVzc1BhcnRuZXIgOiBTdHJpbmcgQHRpdGxlOiAnQnVzaW5lc3MgUGFydG5lcic7XG5cdFx0XHRGdWxsTmFtZSAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnTmFtZSc7XG5cdFx0XHRDaXR5TmFtZSAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnQ2l0eSc7XG5cdFx0XHRQb3N0YWxDb2RlICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnUG9zdGFsIENvZGUnO1xuXHR9O1xuXG5cdGFubm90YXRlIFJvb3RFbnRpdHkgd2l0aCB7XG5cdFx0QChDb21tb246IHtWYWx1ZUxpc3Q6IHtcblx0XHQgIENvbGxlY3Rpb25QYXRoOiAnQnVzaW5lc3NQYXJ0bmVyQWRkcmVzcycsXG5cdFx0ICBQYXJhbWV0ZXJzICAgIDogW1xuXHRcdFx0e1xuXHRcdFx0ICAkVHlwZSAgICAgICAgICAgIDogJ0NvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dCcsXG5cdFx0XHQgIExvY2FsRGF0YVByb3BlcnR5OiB2YWx1ZUhlbHBGaWVsZDJfMSxcblx0XHRcdCAgVmFsdWVMaXN0UHJvcGVydHk6ICdCdXNpbmVzc1BhcnRuZXInLFxuXHRcdFx0ICAhW0BVSS5JbXBvcnRhbmNlXTogI0hpZ2hcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHQgICRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5Jyxcblx0XHRcdCAgVmFsdWVMaXN0UHJvcGVydHk6ICdGdWxsTmFtZSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHQgICRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5Jyxcblx0XHRcdCAgVmFsdWVMaXN0UHJvcGVydHk6ICdDaXR5TmFtZScsXG5cdFx0XHQgICFbQFVJLkltcG9ydGFuY2VdOiAjSGlnaFxuXHRcdFx0fVxuXHRcdCAgXVxuXHRcdH19IClcblx0XHR2YWx1ZUhlbHBGaWVsZDJfMTtcblxuXHRcdEAoQ29tbW9uOiB7XG5cdFx0ICBUZXh0ICAgICA6IF9CdXNpbmVzc1BhcnRuZXJBZGRyZXNzX1ZIRjJfMi5GdWxsTmFtZSxcblx0XHQgIFZhbHVlTGlzdDoge1xuXHRcdFx0Q29sbGVjdGlvblBhdGg6ICdCdXNpbmVzc1BhcnRuZXJBZGRyZXNzMicsXG5cdFx0XHRQYXJhbWV0ZXJzICAgIDogW1xuXHRcdFx0ICB7XG5cdFx0XHRcdCRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0Jyxcblx0XHRcdFx0TG9jYWxEYXRhUHJvcGVydHk6IHZhbHVlSGVscEZpZWxkMl8yLFxuXHRcdFx0XHRWYWx1ZUxpc3RQcm9wZXJ0eTogJ0J1c2luZXNzUGFydG5lcicsXG5cdFx0XHRcdCFbQFVJLkltcG9ydGFuY2VdOiAjSGlnaFxuXHRcdFx0ICB9LFxuXHRcdFx0ICB7XG5cdFx0XHRcdCRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5Jyxcblx0XHRcdFx0VmFsdWVMaXN0UHJvcGVydHk6ICdGdWxsTmFtZSdcblxuXHRcdFx0ICB9LFxuXHRcdFx0ICB7XG5cdFx0XHRcdCRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5Jyxcblx0XHRcdFx0VmFsdWVMaXN0UHJvcGVydHk6ICdDb3VudHJ5Jyxcblx0XHRcdFx0IVtAVUkuSW1wb3J0YW5jZV06ICNIaWdoXG5cdFx0XHQgIH1cblx0XHRcdF1cblx0XHQgIH1cblx0XHR9KVxuXHRcdHZhbHVlSGVscEZpZWxkMl8yO1xuXG5cdFx0QChDb21tb246IHtWYWx1ZUxpc3Q6IHtcblx0XHQgIENvbGxlY3Rpb25QYXRoOiAnQnVzaW5lc3NQYXJ0bmVyQWRkcmVzczMnLFxuXHRcdCAgUGFyYW1ldGVycyAgICA6IFtcblx0XHRcdHtcblx0XHRcdCAgJFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW5PdXQnLFxuXHRcdFx0ICBMb2NhbERhdGFQcm9wZXJ0eTogdmFsdWVIZWxwRmllbGQyXzMsXG5cdFx0XHQgIFZhbHVlTGlzdFByb3BlcnR5OiAnQnVzaW5lc3NQYXJ0bmVyJyxcblx0XHRcdCAgIVtAVUkuSW1wb3J0YW5jZV06ICNIaWdoXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0ICAkVHlwZSAgICAgICAgICAgIDogJ0NvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seScsXG5cdFx0XHQgIFZhbHVlTGlzdFByb3BlcnR5OiAnRnVsbE5hbWUnXG5cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHQgICRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5Jyxcblx0XHRcdCAgVmFsdWVMaXN0UHJvcGVydHk6ICdQb3N0YWxDb2RlJyxcblx0XHRcdCAgIVtAVUkuSW1wb3J0YW5jZV06ICNIaWdoXG5cdFx0XHR9XG5cdFx0ICBdXG5cdFx0fX0pXG5cdFx0dmFsdWVIZWxwRmllbGQyXzM7XG5cdH1cblxuXHRgLnNsaWNlKDIsIC0yKSwgLy8gcmVtb3ZlIGZpcnN0IGFuZCBsYXN0IDIgbmV3bGluZXNcblxuXHRcdFx0eG1sOiBgXG5cblx0PEVudGl0eVR5cGUgTmFtZT1cIkJ1c2luZXNzUGFydG5lckFkZHJlc3NcIj5cblx0XHQ8S2V5PlxuXHRcdFx0PFByb3BlcnR5UmVmIE5hbWU9XCJCdXNpbmVzc1BhcnRuZXJcIi8+XG5cdFx0PC9LZXk+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJCdXNpbmVzc1BhcnRuZXJcIiBUeXBlPVwiRWRtLlN0cmluZ1wiIE51bGxhYmxlPVwiZmFsc2VcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJGdWxsTmFtZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiQ2l0eU5hbWVcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkNvdW50cnlcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIlBvc3RhbENvZGVcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIlN0cmVldE5hbWVcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkhvdXNlTnVtYmVyXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdDwvRW50aXR5VHlwZT5cblx0PEVudGl0eVR5cGUgTmFtZT1cIkJ1c2luZXNzUGFydG5lckFkZHJlc3MyXCI+XG5cdFx0PEtleT5cblx0XHRcdDxQcm9wZXJ0eVJlZiBOYW1lPVwiQnVzaW5lc3NQYXJ0bmVyXCIvPlxuXHRcdDwvS2V5PlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiQnVzaW5lc3NQYXJ0bmVyXCIgVHlwZT1cIkVkbS5TdHJpbmdcIiBOdWxsYWJsZT1cImZhbHNlXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiRnVsbE5hbWVcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkNpdHlOYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJDb3VudHJ5XCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJQb3N0YWxDb2RlXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJTdHJlZXROYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJIb3VzZU51bWJlclwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHQ8L0VudGl0eVR5cGU+XG5cdDxFbnRpdHlUeXBlIE5hbWU9XCJCdXNpbmVzc1BhcnRuZXJBZGRyZXNzM1wiPlxuXHRcdDxLZXk+XG5cdFx0XHQ8UHJvcGVydHlSZWYgTmFtZT1cIkJ1c2luZXNzUGFydG5lclwiLz5cblx0XHQ8L0tleT5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkJ1c2luZXNzUGFydG5lclwiIFR5cGU9XCJFZG0uU3RyaW5nXCIgTnVsbGFibGU9XCJmYWxzZVwiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkZ1bGxOYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJDaXR5TmFtZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiUG9zdGFsQ29kZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHQ8L0VudGl0eVR5cGU+XG5cdDxBbm5vdGF0aW9ucyBUYXJnZXQ9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLlJvb3RFbnRpdHkvdmFsdWVIZWxwRmllbGQyXzFcIj5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlZhbHVlTGlzdFwiPlxuXHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFR5cGVcIj5cblx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiQ29sbGVjdGlvblBhdGhcIiBTdHJpbmc9XCJCdXNpbmVzc1BhcnRuZXJBZGRyZXNzXCIvPlxuXHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJQYXJhbWV0ZXJzXCI+XG5cdFx0XHRcdDxDb2xsZWN0aW9uPlxuXHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW5PdXRcIj5cblx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkxvY2FsRGF0YVByb3BlcnR5XCIgUHJvcGVydHlQYXRoPVwidmFsdWVIZWxwRmllbGQyXzFcIi8+XG5cdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIkJ1c2luZXNzUGFydG5lclwiLz5cblx0XHRcdFx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiVUkuSW1wb3J0YW5jZVwiIEVudW1NZW1iZXI9XCJVSS5JbXBvcnRhbmNlVHlwZS9IaWdoXCIvPlxuXHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5XCI+XG5cdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIkZ1bGxOYW1lXCIvPlxuXHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5XCI+XG5cdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIkNpdHlOYW1lXCIvPlxuXHRcdFx0XHRcdDxBbm5vdGF0aW9uIFRlcm09XCJVSS5JbXBvcnRhbmNlXCIgRW51bU1lbWJlcj1cIlVJLkltcG9ydGFuY2VUeXBlL0hpZ2hcIi8+XG5cdFx0XHRcdDwvUmVjb3JkPlxuXHRcdFx0XHQ8L0NvbGxlY3Rpb24+XG5cdFx0XHQ8L1Byb3BlcnR5VmFsdWU+XG5cdFx0XHQ8L1JlY29yZD5cblx0XHQ8L0Fubm90YXRpb24+XG5cdFx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5MYWJlbFwiIFN0cmluZz1cIlZhbHVlIEhlbHAgRmllbGQgMl8xXCIvPlxuXHQ8L0Fubm90YXRpb25zPlxuXHQ8QW5ub3RhdGlvbnMgVGFyZ2V0PVwic2FwLmZlLmNvcmUuU2VydmljZS5Sb290RW50aXR5L3ZhbHVlSGVscEZpZWxkMl8yXCI+XG5cdFx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5UZXh0XCIgUGF0aD1cIl9CdXNpbmVzc1BhcnRuZXJBZGRyZXNzX1ZIRjJfMi9GdWxsTmFtZVwiLz5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlZhbHVlTGlzdFwiPlxuXHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFR5cGVcIj5cblx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiQ29sbGVjdGlvblBhdGhcIiBTdHJpbmc9XCJCdXNpbmVzc1BhcnRuZXJBZGRyZXNzMlwiLz5cblx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiUGFyYW1ldGVyc1wiPlxuXHRcdFx0XHQ8Q29sbGVjdGlvbj5cblx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0XCI+XG5cdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJMb2NhbERhdGFQcm9wZXJ0eVwiIFByb3BlcnR5UGF0aD1cInZhbHVlSGVscEZpZWxkMl8yXCIvPlxuXHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVmFsdWVMaXN0UHJvcGVydHlcIiBTdHJpbmc9XCJCdXNpbmVzc1BhcnRuZXJcIi8+XG5cdFx0XHRcdFx0PEFubm90YXRpb24gVGVybT1cIlVJLkltcG9ydGFuY2VcIiBFbnVtTWVtYmVyPVwiVUkuSW1wb3J0YW5jZVR5cGUvSGlnaFwiLz5cblx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seVwiPlxuXHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVmFsdWVMaXN0UHJvcGVydHlcIiBTdHJpbmc9XCJGdWxsTmFtZVwiLz5cblx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seVwiPlxuXHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVmFsdWVMaXN0UHJvcGVydHlcIiBTdHJpbmc9XCJDb3VudHJ5XCIvPlxuXHRcdFx0XHRcdDxBbm5vdGF0aW9uIFRlcm09XCJVSS5JbXBvcnRhbmNlXCIgRW51bU1lbWJlcj1cIlVJLkltcG9ydGFuY2VUeXBlL0hpZ2hcIi8+XG5cdFx0XHRcdDwvUmVjb3JkPlxuXHRcdFx0XHQ8L0NvbGxlY3Rpb24+XG5cdFx0XHQ8L1Byb3BlcnR5VmFsdWU+XG5cdFx0XHQ8L1JlY29yZD5cblx0XHQ8L0Fubm90YXRpb24+XG5cdFx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5MYWJlbFwiIFN0cmluZz1cIlZhbHVlIEhlbHAgRmllbGQgMl8yXCIvPlxuXHQ8L0Fubm90YXRpb25zPlxuXHQ8QW5ub3RhdGlvbnMgVGFyZ2V0PVwic2FwLmZlLmNvcmUuU2VydmljZS5Sb290RW50aXR5L3ZhbHVlSGVscEZpZWxkMl8zXCI+XG5cdFx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5WYWx1ZUxpc3RcIj5cblx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RUeXBlXCI+XG5cdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkNvbGxlY3Rpb25QYXRoXCIgU3RyaW5nPVwiQnVzaW5lc3NQYXJ0bmVyQWRkcmVzczNcIi8+XG5cdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlBhcmFtZXRlcnNcIj5cblx0XHRcdFx0PENvbGxlY3Rpb24+XG5cdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dFwiPlxuXHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiTG9jYWxEYXRhUHJvcGVydHlcIiBQcm9wZXJ0eVBhdGg9XCJ2YWx1ZUhlbHBGaWVsZDJfM1wiLz5cblx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiQnVzaW5lc3NQYXJ0bmVyXCIvPlxuXHRcdFx0XHRcdDxBbm5vdGF0aW9uIFRlcm09XCJVSS5JbXBvcnRhbmNlXCIgRW51bU1lbWJlcj1cIlVJLkltcG9ydGFuY2VUeXBlL0hpZ2hcIi8+XG5cdFx0XHRcdDwvUmVjb3JkPlxuXHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHlcIj5cblx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiRnVsbE5hbWVcIi8+XG5cdFx0XHRcdDwvUmVjb3JkPlxuXHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHlcIj5cblx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiUG9zdGFsQ29kZVwiLz5cblx0XHRcdFx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiVUkuSW1wb3J0YW5jZVwiIEVudW1NZW1iZXI9XCJVSS5JbXBvcnRhbmNlVHlwZS9IaWdoXCIvPlxuXHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0PC9Db2xsZWN0aW9uPlxuXHRcdFx0PC9Qcm9wZXJ0eVZhbHVlPlxuXHRcdFx0PC9SZWNvcmQ+XG5cdFx0PC9Bbm5vdGF0aW9uPlxuXHRcdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uTGFiZWxcIiBTdHJpbmc9XCJWYWx1ZSBIZWxwIEZpZWxkIDJfM1wiLz5cblx0PC9Bbm5vdGF0aW9ucz5cblxuXHRgLnNsaWNlKDIsIC0yKVxuXHRcdH1cblx0fSxcblx0LyogMy4pIFZhbGlkYXRpb24gKi9cblx0e1xuXHRcdGlkOiBcImNvZGVWSFZhbGlkYXRpb25Tb3VyY2VcIixcblx0XHRjb2RlOiB7XG5cdFx0XHRjZHM6IC8qIGNkcyAqLyBgXG5cblx0ZW50aXR5IEJ1c2luZXNzUGFydG5lckFkZHJlc3MyIHtcblx0XHRrZXkgQnVzaW5lc3NQYXJ0bmVyIDogU3RyaW5nIEAoXG5cdFx0XHRcdENvbW1vbjoge1xuXHRcdFx0XHRcdFRleHQgICAgICAgICAgIDogRnVsbE5hbWUsIC8vVGV4dCBub3Qgb3B0aW9uYWwgaWYgeW91IHdhbnQgdG8gaGF2ZSBhIGRpc3BsYXkgZm9ybWF0IHZpYSBUZXh0QXJyYW5nZW1lbnQgaW4gdGhlIHZhbHVlIGxpc3Rcblx0XHRcdFx0XHRUZXh0QXJyYW5nZW1lbnQ6ICNUZXh0Rmlyc3QgLy9zZXRzIHByZXNlbnRhdGlvbiBvZiBrZXkgYW5kIGRlc2NyaXB0aW9uIHZhbHVlIGxpa2UgJ2Rlc2NyaXB0aW9uIChrZXkpJyBpbiB0aGUgdmFsdWUgaGVscCB0YWJsZS5cblx0XHRcdFx0fSxcblx0XHRcdFx0dGl0bGUgOiAnQnVzaW5lc3MgUGFydG5lcidcblx0XHRcdCk7XG5cdFx0XHRGdWxsTmFtZSAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnTmFtZSc7XG5cdFx0XHRDaXR5TmFtZSAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnQ2l0eSc7XG5cdFx0XHRDb3VudHJ5ICAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnQ291bnRyeSc7XG5cdFx0XHRQb3N0YWxDb2RlICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnUG9zdGFsIENvZGUnO1xuXHRcdFx0U3RyZWV0TmFtZSAgICAgIDogU3RyaW5nIEB0aXRsZTogJ1N0cmVldCBOYW1lJztcblx0XHRcdEhvdXNlTnVtYmVyICAgICA6IFN0cmluZyBAdGl0bGU6ICdIb3VzZSBOdW1iZXInO1xuXHR9O1xuXG5cdGFubm90YXRlIFJvb3RFbnRpdHkgd2l0aCB7XG5cdFx0QChDb21tb246IHtcblx0XHRcdFRleHQgICAgICAgICAgICAgICAgICA6IF9CdXNpbmVzc1BhcnRuZXJBZGRyZXNzX1ZIRjNfMS5GdWxsTmFtZSxcblx0XHRcdFZhbHVlTGlzdEZvclZhbGlkYXRpb246ICcnLFxuXHRcdFx0VmFsdWVMaXN0ICAgICAgICAgICAgIDoge1xuXHRcdFx0XHRDb2xsZWN0aW9uUGF0aDogJ0J1c2luZXNzUGFydG5lckFkZHJlc3MyJyxcblx0XHRcdFx0UGFyYW1ldGVycyAgICA6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQkVHlwZSAgICAgICAgICAgIDogJ0NvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dCcsXG5cdFx0XHRcdFx0XHRMb2NhbERhdGFQcm9wZXJ0eTogdmFsdWVIZWxwRmllbGQzXzEsXG5cdFx0XHRcdFx0XHRWYWx1ZUxpc3RQcm9wZXJ0eTogJ0J1c2luZXNzUGFydG5lcidcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdCRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5Jyxcblx0XHRcdFx0XHRcdFZhbHVlTGlzdFByb3BlcnR5OiAnQ291bnRyeSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdF1cblx0XHRcdH1cblx0XHR9KVxuXHRcdHZhbHVlSGVscEZpZWxkM18xO1xuXHR9XG5cblx0YC5zbGljZSgyLCAtMiksIC8vIHJlbW92ZSBmaXJzdCBhbmQgbGFzdCAyIG5ld2xpbmVzXG5cblx0XHRcdHhtbDogYFxuXG5cdDxFbnRpdHlUeXBlIE5hbWU9XCJCdXNpbmVzc1BhcnRuZXJBZGRyZXNzMlwiPlxuXHRcdDxLZXk+XG5cdFx0XHQ8UHJvcGVydHlSZWYgTmFtZT1cIkJ1c2luZXNzUGFydG5lclwiLz5cblx0XHQ8L0tleT5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkJ1c2luZXNzUGFydG5lclwiIFR5cGU9XCJFZG0uU3RyaW5nXCIgTnVsbGFibGU9XCJmYWxzZVwiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkZ1bGxOYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJDaXR5TmFtZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiQ291bnRyeVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiUG9zdGFsQ29kZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiU3RyZWV0TmFtZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiSG91c2VOdW1iZXJcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0PC9FbnRpdHlUeXBlPlxuXG5cdDxBbm5vdGF0aW9ucyBUYXJnZXQ9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLlJvb3RFbnRpdHkvdmFsdWVIZWxwRmllbGQzXzFcIj5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlRleHRcIiBQYXRoPVwiX0J1c2luZXNzUGFydG5lckFkZHJlc3NfVkhGM18xL0Z1bGxOYW1lXCIvPlxuXHRcdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uVmFsdWVMaXN0Rm9yVmFsaWRhdGlvblwiIFN0cmluZz1cIlwiLz5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlZhbHVlTGlzdFwiPlxuXHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFR5cGVcIj5cblx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiQ29sbGVjdGlvblBhdGhcIiBTdHJpbmc9XCJCdXNpbmVzc1BhcnRuZXJBZGRyZXNzMlwiLz5cblx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiUGFyYW1ldGVyc1wiPlxuXHRcdFx0XHQ8Q29sbGVjdGlvbj5cblx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW5PdXRcIj5cblx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiTG9jYWxEYXRhUHJvcGVydHlcIiBQcm9wZXJ0eVBhdGg9XCJ2YWx1ZUhlbHBGaWVsZDNfMVwiLz5cblx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVmFsdWVMaXN0UHJvcGVydHlcIiBTdHJpbmc9XCJCdXNpbmVzc1BhcnRuZXJcIi8+XG5cdFx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5XCI+XG5cdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiQ291bnRyeVwiLz5cblx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0PC9Db2xsZWN0aW9uPlxuXHRcdFx0PC9Qcm9wZXJ0eVZhbHVlPlxuXHRcdFx0PC9SZWNvcmQ+XG5cdFx0PC9Bbm5vdGF0aW9uPlxuXHRcdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uTGFiZWxcIiBTdHJpbmc9XCJWYWx1ZSBIZWxwIEZpZWxkIDNfMVwiLz5cblx0PC9Bbm5vdGF0aW9ucz5cblxuXHRgLnNsaWNlKDIsIC0yKVxuXHRcdH1cblx0fSxcblx0LyogNC4pIENvbnRleHQgRGVwZW5kZW50IFZhbHVlIEhlbHAgKi9cblx0e1xuXHRcdGlkOiBcImNvZGVWSENvbnRleHREZXBlbmRlbnRTb3VyY2VcIixcblx0XHRjb2RlOiB7XG5cdFx0XHRjZHM6IC8qIGNkcyAqLyBgXG5cblx0ZW50aXR5IEJ1c2luZXNzUGFydG5lckFkZHJlc3Mge1xuXHRcdGtleSBCdXNpbmVzc1BhcnRuZXIgOiBTdHJpbmcgQHRpdGxlOiAnQnVzaW5lc3MgUGFydG5lcic7XG5cdFx0XHRGdWxsTmFtZSAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnTmFtZSc7XG5cdFx0XHRDaXR5TmFtZSAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnQ2l0eSc7XG5cdFx0XHRDb3VudHJ5ICAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnQ291bnRyeSc7XG5cdFx0XHRQb3N0YWxDb2RlICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnUG9zdGFsIENvZGUnO1xuXHRcdFx0U3RyZWV0TmFtZSAgICAgIDogU3RyaW5nIEB0aXRsZTogJ1N0cmVldCBOYW1lJztcblx0XHRcdEhvdXNlTnVtYmVyICAgICA6IFN0cmluZyBAdGl0bGU6ICdIb3VzZSBOdW1iZXInO1xuXHRcdH07XG5cblx0ZW50aXR5IEJ1c2luZXNzUGFydG5lckFkZHJlc3MyIHtcblx0XHRrZXkgQnVzaW5lc3NQYXJ0bmVyIDogU3RyaW5nIEAoXG5cdFx0XHRcdENvbW1vbjoge1xuXHRcdFx0XHRUZXh0ICAgICAgICAgICA6IEZ1bGxOYW1lLCAvL1RleHQgbm90IG9wdGlvbmFsIGlmIHlvdSB3YW50IHRvIGhhdmUgYSBkaXNwbGF5IGZvcm1hdCB2aWEgVGV4dEFycmFuZ2VtZW50IGluIHRoZSB2YWx1ZSBsaXN0XG5cdFx0XHRcdFRleHRBcnJhbmdlbWVudDogI1RleHRGaXJzdCAvL3NldHMgcHJlc2VudGF0aW9uIG9mIGtleSBhbmQgZGVzY3JpcHRpb24gdmFsdWUgbGlrZSAnZGVzY3JpcHRpb24gKGtleSknIGluIHRoZSB2YWx1ZSBoZWxwIHRhYmxlLlxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aXRsZSA6ICdCdXNpbmVzcyBQYXJ0bmVyJ1xuXHRcdFx0KTtcblx0XHRcdEZ1bGxOYW1lICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdOYW1lJztcblx0XHRcdENpdHlOYW1lICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdDaXR5Jztcblx0XHRcdENvdW50cnkgICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdDb3VudHJ5Jztcblx0XHRcdFBvc3RhbENvZGUgICAgICA6IFN0cmluZyBAdGl0bGU6ICdQb3N0YWwgQ29kZSc7XG5cdFx0XHRTdHJlZXROYW1lICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnU3RyZWV0IE5hbWUnO1xuXHRcdFx0SG91c2VOdW1iZXIgICAgIDogU3RyaW5nIEB0aXRsZTogJ0hvdXNlIE51bWJlcic7XG5cdH07XG5cblx0YW5ub3RhdGUgUm9vdEVudGl0eSB3aXRoIHtcblx0XHRAKENvbW1vbjoge1xuXHRcdCAgVmFsdWVMaXN0V2l0aEZpeGVkVmFsdWVzOiB0cnVlLFxuXHRcdCAgVmFsdWVMaXN0ICAgICAgICAgICAgICAgOiB7XG5cdFx0XHRMYWJlbCAgICAgICAgIDogJ0J1c2luZXNzIFBhcnRuZXIgQWRkcmVzcycsXG5cdFx0XHRDb2xsZWN0aW9uUGF0aDogJ0J1c2luZXNzUGFydG5lckFkZHJlc3MnLFxuXHRcdFx0UGFyYW1ldGVycyAgICA6IFt7XG5cdFx0XHQgICRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0Jyxcblx0XHRcdCAgTG9jYWxEYXRhUHJvcGVydHk6IHZhbHVlSGVscEZpZWxkNF8xLFxuXHRcdFx0ICBWYWx1ZUxpc3RQcm9wZXJ0eTogJ0J1c2luZXNzUGFydG5lcidcblx0XHRcdH1dXG5cdFx0ICB9XG5cdFx0fSlcblx0XHR2YWx1ZUhlbHBGaWVsZDRfMTtcblxuXHRcdEAoQ29tbW9uOiB7XG5cdFx0ICBWYWx1ZUxpc3RSZWxldmFudFF1YWxpZmllcnM6IFt7JGVkbUpzb246IHskSWY6IFtcblx0XHRcdHskT3I6IFtcblx0XHRcdCAgeyRFcTogW1xuXHRcdFx0XHR7JFBhdGg6ICd2YWx1ZUhlbHBGaWVsZDRfMSd9LFxuXHRcdFx0XHR7JFN0cmluZzogJzE3MTAwMDAxJ31cblx0XHRcdCAgXX0sXG5cdFx0XHQgIHskRXE6IFtcblx0XHRcdFx0eyRQYXRoOiAndmFsdWVIZWxwRmllbGQ0XzEnfSxcblx0XHRcdFx0eyRTdHJpbmc6ICcxNzEwMDAwNid9XG5cdFx0XHQgIF19XG5cdFx0XHRdfSxcblx0XHRcdHskU3RyaW5nOiAncXVhbGlmaWVyMid9LFxuXHRcdFx0eyRTdHJpbmc6ICcnfVxuXHRcdCAgXX19XSxcblx0XHQgIFZhbHVlTGlzdCAgICAgICAgICAgICAgICAgIDoge1xuXHRcdFx0TGFiZWwgICAgICAgICA6ICdCdXNpbmVzcyBQYXJ0bmVyIEFkZHJlc3MnLFxuXHRcdFx0Q29sbGVjdGlvblBhdGg6ICdCdXNpbmVzc1BhcnRuZXJBZGRyZXNzJyxcblx0XHRcdFBhcmFtZXRlcnMgICAgOiBbXG5cdFx0XHQgIHtcblx0XHRcdFx0JFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW5PdXQnLFxuXHRcdFx0XHRMb2NhbERhdGFQcm9wZXJ0eTogdmFsdWVIZWxwRmllbGQ0XzIsXG5cdFx0XHRcdFZhbHVlTGlzdFByb3BlcnR5OiAnQnVzaW5lc3NQYXJ0bmVyJyxcblx0XHRcdFx0IVtAVUkuSW1wb3J0YW5jZV06ICNIaWdoXG5cdFx0XHQgIH0sXG5cdFx0XHQgIHtcblx0XHRcdFx0JFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHknLFxuXHRcdFx0XHRWYWx1ZUxpc3RQcm9wZXJ0eTogJ0Z1bGxOYW1lJ1xuXHRcdFx0ICB9LFxuXHRcdFx0ICB7XG5cdFx0XHRcdCRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5Jyxcblx0XHRcdFx0VmFsdWVMaXN0UHJvcGVydHk6ICdDb3VudHJ5J1xuXHRcdFx0XHQhW0BVSS5JbXBvcnRhbmNlXTogI0hpZ2hcblx0XHRcdCAgfVxuXHRcdFx0XVxuXHRcdCAgfSxcblx0XHQgIFZhbHVlTGlzdCAjcXVhbGlmaWVyMiAgICAgIDoge1xuXHRcdFx0TGFiZWwgICAgICAgICA6ICdCdXNpbmVzcyBQYXJ0bmVyIEFkZHJlc3MgMicsXG5cdFx0XHRDb2xsZWN0aW9uUGF0aDogJ0J1c2luZXNzUGFydG5lckFkZHJlc3MyJyxcblx0XHRcdFBhcmFtZXRlcnMgICAgOiBbXG5cdFx0XHQgIHtcblx0XHRcdFx0JFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW5PdXQnLFxuXHRcdFx0XHRMb2NhbERhdGFQcm9wZXJ0eTogdmFsdWVIZWxwRmllbGQ0XzIsXG5cdFx0XHRcdFZhbHVlTGlzdFByb3BlcnR5OiAnQnVzaW5lc3NQYXJ0bmVyJyxcblx0XHRcdFx0IVtAVUkuSW1wb3J0YW5jZV06ICNIaWdoXG5cdFx0XHQgIH0sXG5cdFx0XHQgIHtcblx0XHRcdFx0JFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHknLFxuXHRcdFx0XHRWYWx1ZUxpc3RQcm9wZXJ0eTogJ0NpdHlOYW1lJ1xuXHRcdFx0ICB9LFxuXHRcdFx0ICB7XG5cdFx0XHRcdCRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5Jyxcblx0XHRcdFx0VmFsdWVMaXN0UHJvcGVydHk6ICdDb3VudHJ5Jyxcblx0XHRcdFx0IVtAVUkuSW1wb3J0YW5jZV06ICNIaWdoXG5cdFx0XHQgIH1cblx0XHRcdF1cblx0XHQgIH1cblx0XHR9KVxuXHRcdHZhbHVlSGVscEZpZWxkNF8yO1xuXHR9XG5cblx0YC5zbGljZSgyLCAtMiksIC8vIHJlbW92ZSBmaXJzdCBhbmQgbGFzdCAyIG5ld2xpbmVzXG5cblx0XHRcdHhtbDogYFxuXG5cdDxFbnRpdHlUeXBlIE5hbWU9XCJCdXNpbmVzc1BhcnRuZXJBZGRyZXNzXCI+XG5cdFx0PEtleT5cblx0XHRcdDxQcm9wZXJ0eVJlZiBOYW1lPVwiQnVzaW5lc3NQYXJ0bmVyXCIvPlxuXHRcdDwvS2V5PlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiQnVzaW5lc3NQYXJ0bmVyXCIgVHlwZT1cIkVkbS5TdHJpbmdcIiBOdWxsYWJsZT1cImZhbHNlXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiRnVsbE5hbWVcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkNpdHlOYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJDb3VudHJ5XCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJQb3N0YWxDb2RlXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJTdHJlZXROYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJIb3VzZU51bWJlclwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHQ8L0VudGl0eVR5cGU+XG5cdDxFbnRpdHlUeXBlIE5hbWU9XCJCdXNpbmVzc1BhcnRuZXJBZGRyZXNzMlwiPlxuXHRcdDxLZXk+XG5cdFx0XHQ8UHJvcGVydHlSZWYgTmFtZT1cIkJ1c2luZXNzUGFydG5lclwiLz5cblx0XHQ8L0tleT5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkJ1c2luZXNzUGFydG5lclwiIFR5cGU9XCJFZG0uU3RyaW5nXCIgTnVsbGFibGU9XCJmYWxzZVwiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkZ1bGxOYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJDaXR5TmFtZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiQ291bnRyeVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiUG9zdGFsQ29kZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiU3RyZWV0TmFtZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiSG91c2VOdW1iZXJcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0PC9FbnRpdHlUeXBlPlxuXHQ8QW5ub3RhdGlvbnMgVGFyZ2V0PVwic2FwLmZlLmNvcmUuU2VydmljZS5Sb290RW50aXR5L3ZhbHVlSGVscEZpZWxkNF8xXCI+XG5cdFx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5WYWx1ZUxpc3RXaXRoRml4ZWRWYWx1ZXNcIiBCb29sPVwidHJ1ZVwiLz5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlZhbHVlTGlzdFwiPlxuXHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFR5cGVcIj5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJMYWJlbFwiIFN0cmluZz1cIkJ1c2luZXNzIFBhcnRuZXIgQWRkcmVzc1wiLz5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJDb2xsZWN0aW9uUGF0aFwiIFN0cmluZz1cIkJ1c2luZXNzUGFydG5lckFkZHJlc3NcIi8+XG5cdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiUGFyYW1ldGVyc1wiPlxuXHRcdFx0XHQ8Q29sbGVjdGlvbj5cblx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW5PdXRcIj5cblx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiTG9jYWxEYXRhUHJvcGVydHlcIiBQcm9wZXJ0eVBhdGg9XCJ2YWx1ZUhlbHBGaWVsZDRfMVwiLz5cblx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVmFsdWVMaXN0UHJvcGVydHlcIiBTdHJpbmc9XCJCdXNpbmVzc1BhcnRuZXJcIi8+XG5cdFx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdDwvQ29sbGVjdGlvbj5cblx0XHRcdFx0PC9Qcm9wZXJ0eVZhbHVlPlxuXHRcdFx0PC9SZWNvcmQ+XG5cdFx0PC9Bbm5vdGF0aW9uPlxuXHRcdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uTGFiZWxcIiBTdHJpbmc9XCJWYWx1ZSBIZWxwIEZpZWxkIDRfMVwiLz5cbiAgXHQ8L0Fubm90YXRpb25zPlxuICBcdDxBbm5vdGF0aW9ucyBUYXJnZXQ9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLlJvb3RFbnRpdHkvdmFsdWVIZWxwRmllbGQ0XzJcIj5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlZhbHVlTGlzdFJlbGV2YW50UXVhbGlmaWVyc1wiPlxuXHRcdDxDb2xsZWN0aW9uPlxuXHRcdFx0PElmPlxuXHRcdFx0PE9yPlxuXHRcdFx0XHQ8RXE+XG5cdFx0XHRcdFx0PFBhdGg+dmFsdWVIZWxwRmllbGQ0XzE8L1BhdGg+XG5cdFx0XHRcdFx0PFN0cmluZz4xNzEwMDAwMTwvU3RyaW5nPlxuXHRcdFx0XHQ8L0VxPlxuXHRcdFx0XHQ8RXE+XG5cdFx0XHRcdFx0PFBhdGg+dmFsdWVIZWxwRmllbGQ0XzE8L1BhdGg+XG5cdFx0XHRcdFx0PFN0cmluZz4xNzEwMDAwNjwvU3RyaW5nPlxuXHRcdFx0XHQ8L0VxPlxuXHRcdFx0PC9Pcj5cblx0XHRcdDxTdHJpbmc+cXVhbGlmaWVyMjwvU3RyaW5nPlxuXHRcdFx0PFN0cmluZz48L1N0cmluZz5cblx0XHRcdDwvSWY+XG5cdFx0PC9Db2xsZWN0aW9uPlxuXHRcdDwvQW5ub3RhdGlvbj5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlZhbHVlTGlzdFwiPlxuXHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFR5cGVcIj5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJMYWJlbFwiIFN0cmluZz1cIkJ1c2luZXNzIFBhcnRuZXIgQWRkcmVzc1wiLz5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJDb2xsZWN0aW9uUGF0aFwiIFN0cmluZz1cIkJ1c2luZXNzUGFydG5lckFkZHJlc3NcIi8+XG5cdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiUGFyYW1ldGVyc1wiPlxuXHRcdFx0XHRcdDxDb2xsZWN0aW9uPlxuXHRcdFx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0XCI+XG5cdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkxvY2FsRGF0YVByb3BlcnR5XCIgUHJvcGVydHlQYXRoPVwidmFsdWVIZWxwRmllbGQ0XzJcIi8+XG5cdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiQnVzaW5lc3NQYXJ0bmVyXCIvPlxuXHRcdFx0XHRcdFx0PEFubm90YXRpb24gVGVybT1cIlVJLkltcG9ydGFuY2VcIiBFbnVtTWVtYmVyPVwiVUkuSW1wb3J0YW5jZVR5cGUvSGlnaFwiLz5cblx0XHRcdFx0XHRcdDwvUmVjb3JkPlxuXHRcdFx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5XCI+XG5cdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiRnVsbE5hbWVcIi8+XG5cdFx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seVwiPlxuXHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIkNvdW50cnlcIi8+XG5cdFx0XHRcdFx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiVUkuSW1wb3J0YW5jZVwiIEVudW1NZW1iZXI9XCJVSS5JbXBvcnRhbmNlVHlwZS9IaWdoXCIvPlxuXHRcdFx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdFx0PC9Db2xsZWN0aW9uPlxuXHRcdFx0XHQ8L1Byb3BlcnR5VmFsdWU+XG5cdFx0XHQ8L1JlY29yZD5cblx0XHQ8L0Fubm90YXRpb24+XG5cdFx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5WYWx1ZUxpc3RcIiBRdWFsaWZpZXI9XCJxdWFsaWZpZXIyXCI+XG5cdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0VHlwZVwiPlxuXHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkxhYmVsXCIgU3RyaW5nPVwiQnVzaW5lc3MgUGFydG5lciBBZGRyZXNzIDJcIi8+XG5cdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiQ29sbGVjdGlvblBhdGhcIiBTdHJpbmc9XCJCdXNpbmVzc1BhcnRuZXJBZGRyZXNzMlwiLz5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJQYXJhbWV0ZXJzXCI+XG5cdFx0XHRcdFx0PENvbGxlY3Rpb24+XG5cdFx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW5PdXRcIj5cblx0XHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJMb2NhbERhdGFQcm9wZXJ0eVwiIFByb3BlcnR5UGF0aD1cInZhbHVlSGVscEZpZWxkNF8yXCIvPlxuXHRcdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiQnVzaW5lc3NQYXJ0bmVyXCIvPlxuXHRcdFx0XHRcdFx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiVUkuSW1wb3J0YW5jZVwiIEVudW1NZW1iZXI9XCJVSS5JbXBvcnRhbmNlVHlwZS9IaWdoXCIvPlxuXHRcdFx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHlcIj5cblx0XHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIkNpdHlOYW1lXCIvPlxuXHRcdFx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHlcIj5cblx0XHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIkNvdW50cnlcIi8+XG5cdFx0XHRcdFx0XHRcdDxBbm5vdGF0aW9uIFRlcm09XCJVSS5JbXBvcnRhbmNlXCIgRW51bU1lbWJlcj1cIlVJLkltcG9ydGFuY2VUeXBlL0hpZ2hcIi8+XG5cdFx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHQ8L0NvbGxlY3Rpb24+XG5cdFx0XHRcdDwvUHJvcGVydHlWYWx1ZT5cblx0XHRcdDwvUmVjb3JkPlxuXHRcdDwvQW5ub3RhdGlvbj5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLkxhYmVsXCIgU3RyaW5nPVwiVmFsdWUgSGVscCBGaWVsZCA0XzJcIi8+XG4gICAgPC9Bbm5vdGF0aW9ucz5cblxuXHRgLnNsaWNlKDIsIC0yKVxuXHRcdH1cblx0fSxcblx0LyogNS4pIE11bHRpIFZhbHVlIEhlbHAgRGlhbG9ncyAqL1xuXHR7XG5cdFx0aWQ6IFwiY29kZVZITXVsdGlWYWx1ZVNvdXJjZVwiLFxuXHRcdGNvZGU6IHtcblx0XHRcdGNkczogLyogY2RzICovIGBcblxuXHRlbnRpdHkgQnVzaW5lc3NQYXJ0bmVyQWRkcmVzcyB7XG5cdFx0a2V5IEJ1c2luZXNzUGFydG5lciA6IFN0cmluZyBAdGl0bGU6ICdCdXNpbmVzcyBQYXJ0bmVyJztcblx0XHRcdEZ1bGxOYW1lICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdOYW1lJztcblx0XHRcdENpdHlOYW1lICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdDaXR5Jztcblx0XHRcdENvdW50cnkgICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdDb3VudHJ5Jztcblx0XHRcdFBvc3RhbENvZGUgICAgICA6IFN0cmluZyBAdGl0bGU6ICdQb3N0YWwgQ29kZSc7XG5cdFx0XHRTdHJlZXROYW1lICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnU3RyZWV0IE5hbWUnO1xuXHRcdFx0SG91c2VOdW1iZXIgICAgIDogU3RyaW5nIEB0aXRsZTogJ0hvdXNlIE51bWJlcic7XG5cdH07XG5cblx0ZW50aXR5IEJ1c2luZXNzUGFydG5lckFkZHJlc3MyIHtcblx0XHRrZXkgQnVzaW5lc3NQYXJ0bmVyIDogU3RyaW5nIEAoXG5cdFx0XHRcdENvbW1vbjoge1xuXHRcdFx0XHRUZXh0ICAgICAgICAgICA6IEZ1bGxOYW1lLCAvL1RleHQgbm90IG9wdGlvbmFsIGlmIHlvdSB3YW50IHRvIGhhdmUgYSBkaXNwbGF5IGZvcm1hdCB2aWEgVGV4dEFycmFuZ2VtZW50IGluIHRoZSB2YWx1ZSBsaXN0XG5cdFx0XHRcdFRleHRBcnJhbmdlbWVudDogI1RleHRGaXJzdCAvL3NldHMgcHJlc2VudGF0aW9uIG9mIGtleSBhbmQgZGVzY3JpcHRpb24gdmFsdWUgbGlrZSAnZGVzY3JpcHRpb24gKGtleSknIGluIHRoZSB2YWx1ZSBoZWxwIHRhYmxlLlxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aXRsZSA6ICdCdXNpbmVzcyBQYXJ0bmVyJ1xuXHRcdFx0KTtcblx0XHRcdEZ1bGxOYW1lICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdOYW1lJztcblx0XHRcdENpdHlOYW1lICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdDaXR5Jztcblx0XHRcdENvdW50cnkgICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdDb3VudHJ5Jztcblx0XHRcdFBvc3RhbENvZGUgICAgICA6IFN0cmluZyBAdGl0bGU6ICdQb3N0YWwgQ29kZSc7XG5cdFx0XHRTdHJlZXROYW1lICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnU3RyZWV0IE5hbWUnO1xuXHRcdFx0SG91c2VOdW1iZXIgICAgIDogU3RyaW5nIEB0aXRsZTogJ0hvdXNlIE51bWJlcic7XG5cdH07XG5cblx0YW5ub3RhdGUgQnVzaW5lc3NQYXJ0bmVyQWRkcmVzczMgd2l0aCBAKENhcGFiaWxpdGllcy5TZWFyY2hSZXN0cmljdGlvbnMuU2VhcmNoYWJsZTogZmFsc2UpO1xuXG5cdGVudGl0eSBCdXNpbmVzc1BhcnRuZXJBZGRyZXNzMyB7XG5cdFx0a2V5IEJ1c2luZXNzUGFydG5lciA6IFN0cmluZyBAdGl0bGU6ICdCdXNpbmVzcyBQYXJ0bmVyJztcblx0XHRcdEZ1bGxOYW1lICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdOYW1lJztcblx0XHRcdENpdHlOYW1lICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdDaXR5Jztcblx0XHRcdFBvc3RhbENvZGUgICAgICA6IFN0cmluZyBAdGl0bGU6ICdQb3N0YWwgQ29kZSc7XG5cdH07XG5cblx0YW5ub3RhdGUgUm9vdEVudGl0eSB3aXRoIHtcblx0XHRAKENvbW1vbjoge1xuXHRcdCAgVGV4dCAgICAgICAgICAgICAgICAgOiBfQnVzaW5lc3NQYXJ0bmVyQWRkcmVzc19WSEY1XzEuRnVsbE5hbWUsXG5cdFx0ICBWYWx1ZUxpc3QgICAgICAgICAgICA6IHtcblx0XHRcdExhYmVsICAgICAgICAgOiAnQnVzaW5lc3MgUGFydG5lciBBZGRyZXNzJyxcblx0XHRcdENvbGxlY3Rpb25QYXRoOiAnQnVzaW5lc3NQYXJ0bmVyQWRkcmVzcycsXG5cdFx0XHRQYXJhbWV0ZXJzICAgIDogW1xuXHRcdFx0ICB7XG5cdFx0XHRcdCRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0Jyxcblx0XHRcdFx0TG9jYWxEYXRhUHJvcGVydHk6IHZhbHVlSGVscEZpZWxkNV8xLFxuXHRcdFx0XHRWYWx1ZUxpc3RQcm9wZXJ0eTogJ0J1c2luZXNzUGFydG5lcicsXG5cdFx0XHRcdCFbQFVJLkltcG9ydGFuY2VdOiAjSGlnaFxuXHRcdFx0ICB9LFxuXHRcdFx0ICB7XG5cdFx0XHRcdCRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5Jyxcblx0XHRcdFx0VmFsdWVMaXN0UHJvcGVydHk6ICdGdWxsTmFtZSdcblx0XHRcdCAgfSxcblx0XHRcdCAge1xuXHRcdFx0XHQkVHlwZSAgICAgICAgICAgIDogJ0NvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seScsXG5cdFx0XHRcdFZhbHVlTGlzdFByb3BlcnR5OiAnQ291bnRyeScsXG5cdFx0XHRcdCFbQFVJLkltcG9ydGFuY2VdOiAjSGlnaFxuXHRcdFx0ICB9XG5cdFx0XHRdXG5cdFx0ICB9LFxuXHRcdCAgVmFsdWVMaXN0ICNxdWFsaWZpZXIyOiB7XG5cdFx0XHRMYWJlbCAgICAgICAgIDogJ0J1c2luZXNzIFBhcnRuZXIgQWRkcmVzcyAyJyxcblx0XHRcdENvbGxlY3Rpb25QYXRoOiAnQnVzaW5lc3NQYXJ0bmVyQWRkcmVzczInLFxuXHRcdFx0UGFyYW1ldGVycyAgICA6IFtcblx0XHRcdCAge1xuXHRcdFx0XHQkVHlwZSAgICAgICAgICAgIDogJ0NvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dCcsXG5cdFx0XHRcdExvY2FsRGF0YVByb3BlcnR5OiB2YWx1ZUhlbHBGaWVsZDVfMSxcblx0XHRcdFx0VmFsdWVMaXN0UHJvcGVydHk6ICdCdXNpbmVzc1BhcnRuZXInXG5cdFx0XHQgIH0sXG5cdFx0XHQgIHtcblx0XHRcdFx0JFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHknLFxuXHRcdFx0XHRWYWx1ZUxpc3RQcm9wZXJ0eTogJ0Z1bGxOYW1lJ1xuXHRcdFx0ICB9LFxuXHRcdFx0ICB7XG5cdFx0XHRcdCRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5Jyxcblx0XHRcdFx0VmFsdWVMaXN0UHJvcGVydHk6ICdDb3VudHJ5J1xuXHRcdFx0ICB9XG5cdFx0XHRdXG5cdFx0ICB9LFxuXHRcdCAgVmFsdWVMaXN0ICNxdWFsaWZpZXIzOiB7XG5cdFx0XHRMYWJlbCAgICAgICAgIDogJ0J1c2luZXNzIFBhcnRuZXIgQWRkcmVzcyAzJyxcblx0XHRcdENvbGxlY3Rpb25QYXRoOiAnQnVzaW5lc3NQYXJ0bmVyQWRkcmVzcycsXG5cdFx0XHRQYXJhbWV0ZXJzICAgIDogW1xuXHRcdFx0ICB7XG5cdFx0XHRcdCRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0Jyxcblx0XHRcdFx0TG9jYWxEYXRhUHJvcGVydHk6IHZhbHVlSGVscEZpZWxkNV8xLFxuXHRcdFx0XHRWYWx1ZUxpc3RQcm9wZXJ0eTogJ0J1c2luZXNzUGFydG5lcidcblx0XHRcdCAgfSxcblx0XHRcdCAge1xuXHRcdFx0XHQkVHlwZSAgICAgICAgICAgIDogJ0NvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seScsXG5cdFx0XHRcdFZhbHVlTGlzdFByb3BlcnR5OiAnUG9zdGFsQ29kZSdcblx0XHRcdCAgfSxcblx0XHRcdCAge1xuXHRcdFx0XHQkVHlwZSAgICAgICAgICAgIDogJ0NvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seScsXG5cdFx0XHRcdFZhbHVlTGlzdFByb3BlcnR5OiAnQ2l0eU5hbWUnXG5cdFx0XHQgIH1cblx0XHRcdF1cblx0XHQgIH1cblx0XHR9KVxuXHRcdHZhbHVlSGVscEZpZWxkNV8xO1xuXHR9XG5cblx0XHRgLnNsaWNlKDIsIC0yKSwgLy8gcmVtb3ZlIGZpcnN0IGFuZCBsYXN0IDIgbmV3bGluZXNcblxuXHRcdFx0eG1sOiBgXG5cblx0PEVudGl0eVR5cGUgTmFtZT1cIkJ1c2luZXNzUGFydG5lckFkZHJlc3NcIj5cblx0XHQ8S2V5PlxuXHRcdFx0PFByb3BlcnR5UmVmIE5hbWU9XCJCdXNpbmVzc1BhcnRuZXJcIi8+XG5cdFx0PC9LZXk+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJCdXNpbmVzc1BhcnRuZXJcIiBUeXBlPVwiRWRtLlN0cmluZ1wiIE51bGxhYmxlPVwiZmFsc2VcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJGdWxsTmFtZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiQ2l0eU5hbWVcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkNvdW50cnlcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIlBvc3RhbENvZGVcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIlN0cmVldE5hbWVcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkhvdXNlTnVtYmVyXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdDwvRW50aXR5VHlwZT5cblx0PEVudGl0eVR5cGUgTmFtZT1cIkJ1c2luZXNzUGFydG5lckFkZHJlc3MyXCI+XG5cdFx0PEtleT5cblx0XHRcdDxQcm9wZXJ0eVJlZiBOYW1lPVwiQnVzaW5lc3NQYXJ0bmVyXCIvPlxuXHRcdDwvS2V5PlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiQnVzaW5lc3NQYXJ0bmVyXCIgVHlwZT1cIkVkbS5TdHJpbmdcIiBOdWxsYWJsZT1cImZhbHNlXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiRnVsbE5hbWVcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkNpdHlOYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJDb3VudHJ5XCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJQb3N0YWxDb2RlXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJTdHJlZXROYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJIb3VzZU51bWJlclwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHQ8L0VudGl0eVR5cGU+XG5cdDxFbnRpdHlUeXBlIE5hbWU9XCJCdXNpbmVzc1BhcnRuZXJBZGRyZXNzM1wiPlxuXHRcdDxLZXk+XG5cdFx0XHQ8UHJvcGVydHlSZWYgTmFtZT1cIkJ1c2luZXNzUGFydG5lclwiLz5cblx0XHQ8L0tleT5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkJ1c2luZXNzUGFydG5lclwiIFR5cGU9XCJFZG0uU3RyaW5nXCIgTnVsbGFibGU9XCJmYWxzZVwiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkZ1bGxOYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJDaXR5TmFtZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiUG9zdGFsQ29kZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHQ8L0VudGl0eVR5cGU+XG5cdDxBbm5vdGF0aW9ucyBUYXJnZXQ9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLlJvb3RFbnRpdHkvdmFsdWVIZWxwRmllbGQ1XzFcIj5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlRleHRcIiBQYXRoPVwiX0J1c2luZXNzUGFydG5lckFkZHJlc3NfVkhGNV8xL0Z1bGxOYW1lXCIvPlxuXHRcdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uVmFsdWVMaXN0XCI+XG5cdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0VHlwZVwiPlxuXHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkxhYmVsXCIgU3RyaW5nPVwiQnVzaW5lc3MgUGFydG5lciBBZGRyZXNzXCIvPlxuXHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkNvbGxlY3Rpb25QYXRoXCIgU3RyaW5nPVwiQnVzaW5lc3NQYXJ0bmVyQWRkcmVzc1wiLz5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJQYXJhbWV0ZXJzXCI+XG5cdFx0XHRcdFx0PENvbGxlY3Rpb24+XG5cdFx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW5PdXRcIj5cblx0XHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJMb2NhbERhdGFQcm9wZXJ0eVwiIFByb3BlcnR5UGF0aD1cInZhbHVlSGVscEZpZWxkNV8xXCIvPlxuXHRcdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiQnVzaW5lc3NQYXJ0bmVyXCIvPlxuXHRcdFx0XHRcdFx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiVUkuSW1wb3J0YW5jZVwiIEVudW1NZW1iZXI9XCJVSS5JbXBvcnRhbmNlVHlwZS9IaWdoXCIvPlxuXHRcdFx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHlcIj5cblx0XHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIkZ1bGxOYW1lXCIvPlxuXHRcdFx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHlcIj5cblx0XHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIkNvdW50cnlcIi8+XG5cdFx0XHRcdFx0XHRcdDxBbm5vdGF0aW9uIFRlcm09XCJVSS5JbXBvcnRhbmNlXCIgRW51bU1lbWJlcj1cIlVJLkltcG9ydGFuY2VUeXBlL0hpZ2hcIi8+XG5cdFx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHQ8L0NvbGxlY3Rpb24+XG5cdFx0XHRcdDwvUHJvcGVydHlWYWx1ZT5cblx0XHRcdDwvUmVjb3JkPlxuXHRcdDwvQW5ub3RhdGlvbj5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlZhbHVlTGlzdFwiIFF1YWxpZmllcj1cInF1YWxpZmllcjJcIj5cblx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RUeXBlXCI+XG5cdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiTGFiZWxcIiBTdHJpbmc9XCJCdXNpbmVzcyBQYXJ0bmVyIEFkZHJlc3MgMlwiLz5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJDb2xsZWN0aW9uUGF0aFwiIFN0cmluZz1cIkJ1c2luZXNzUGFydG5lckFkZHJlc3MyXCIvPlxuXHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlBhcmFtZXRlcnNcIj5cblx0XHRcdFx0XHQ8Q29sbGVjdGlvbj5cblx0XHRcdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dFwiPlxuXHRcdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkxvY2FsRGF0YVByb3BlcnR5XCIgUHJvcGVydHlQYXRoPVwidmFsdWVIZWxwRmllbGQ1XzFcIi8+XG5cdFx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVmFsdWVMaXN0UHJvcGVydHlcIiBTdHJpbmc9XCJCdXNpbmVzc1BhcnRuZXJcIi8+XG5cdFx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seVwiPlxuXHRcdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiRnVsbE5hbWVcIi8+XG5cdFx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seVwiPlxuXHRcdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiQ291bnRyeVwiLz5cblx0XHRcdFx0XHRcdDwvUmVjb3JkPlxuXHRcdFx0XHRcdDwvQ29sbGVjdGlvbj5cblx0XHRcdFx0PC9Qcm9wZXJ0eVZhbHVlPlxuXHRcdFx0PC9SZWNvcmQ+XG5cdFx0PC9Bbm5vdGF0aW9uPlxuXHRcdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uVmFsdWVMaXN0XCIgUXVhbGlmaWVyPVwicXVhbGlmaWVyM1wiPlxuXHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFR5cGVcIj5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJMYWJlbFwiIFN0cmluZz1cIkJ1c2luZXNzIFBhcnRuZXIgQWRkcmVzcyAzXCIvPlxuXHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkNvbGxlY3Rpb25QYXRoXCIgU3RyaW5nPVwiQnVzaW5lc3NQYXJ0bmVyQWRkcmVzc1wiLz5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJQYXJhbWV0ZXJzXCI+XG5cdFx0XHRcdFx0PENvbGxlY3Rpb24+XG5cdFx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW5PdXRcIj5cblx0XHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJMb2NhbERhdGFQcm9wZXJ0eVwiIFByb3BlcnR5UGF0aD1cInZhbHVlSGVscEZpZWxkNV8xXCIvPlxuXHRcdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiQnVzaW5lc3NQYXJ0bmVyXCIvPlxuXHRcdFx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHlcIj5cblx0XHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIlBvc3RhbENvZGVcIi8+XG5cdFx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seVwiPlxuXHRcdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiQ2l0eU5hbWVcIi8+XG5cdFx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHQ8L0NvbGxlY3Rpb24+XG5cdFx0XHRcdDwvUHJvcGVydHlWYWx1ZT5cblx0XHRcdDwvUmVjb3JkPlxuXHRcdDwvQW5ub3RhdGlvbj5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLkxhYmVsXCIgU3RyaW5nPVwiVmFsdWUgSGVscCBGaWVsZCA1XzFcIi8+XG5cdDwvQW5ub3RhdGlvbnM+XG5cblx0XHRgLnNsaWNlKDIsIC0yKVxuXHRcdH1cblx0fSxcblx0LyogNi4pIENvbnRyb2wgdGhlIGNvbnRlbnQgb2YgdGhlIE11bHRpcGxlIFZhbHVlIEhlbHAgbGlzdCAqL1xuXHR7XG5cdFx0aWQ6IFwiY29kZVZIQ29udHJvbE11bHRpVmFsdWVTb3VyY2VcIixcblx0XHRjb2RlOiB7XG5cdFx0XHRjZHM6IC8qIGNkcyAqLyBgXG5cdGVudGl0eSBCdXNpbmVzc1BhcnRuZXJBZGRyZXNzIHtcblx0XHRrZXkgQnVzaW5lc3NQYXJ0bmVyIDogU3RyaW5nIEB0aXRsZTogJ0J1c2luZXNzIFBhcnRuZXInO1xuXHRcdFx0RnVsbE5hbWUgICAgICAgIDogU3RyaW5nIEB0aXRsZTogJ05hbWUnO1xuXHRcdFx0Q2l0eU5hbWUgICAgICAgIDogU3RyaW5nIEB0aXRsZTogJ0NpdHknO1xuXHRcdFx0Q291bnRyeSAgICAgICAgIDogU3RyaW5nIEB0aXRsZTogJ0NvdW50cnknO1xuXHRcdFx0UG9zdGFsQ29kZSAgICAgIDogU3RyaW5nIEB0aXRsZTogJ1Bvc3RhbCBDb2RlJztcblx0XHRcdFN0cmVldE5hbWUgICAgICA6IFN0cmluZyBAdGl0bGU6ICdTdHJlZXQgTmFtZSc7XG5cdFx0XHRIb3VzZU51bWJlciAgICAgOiBTdHJpbmcgQHRpdGxlOiAnSG91c2UgTnVtYmVyJztcblx0XHR9O1xuXG5cdGVudGl0eSBCdXNpbmVzc1BhcnRuZXJBZGRyZXNzMiB7XG5cdGtleSBCdXNpbmVzc1BhcnRuZXIgOiBTdHJpbmcgQChcblx0XHRcdENvbW1vbjoge1xuXHRcdFx0VGV4dCAgICAgICAgICAgOiBGdWxsTmFtZSwgLy9UZXh0IG5vdCBvcHRpb25hbCBpZiB5b3Ugd2FudCB0byBoYXZlIGEgZGlzcGxheSBmb3JtYXQgdmlhIFRleHRBcnJhbmdlbWVudCBpbiB0aGUgdmFsdWUgbGlzdFxuXHRcdFx0VGV4dEFycmFuZ2VtZW50OiAjVGV4dEZpcnN0IC8vc2V0cyBwcmVzZW50YXRpb24gb2Yga2V5IGFuZCBkZXNjcmlwdGlvbiB2YWx1ZSBsaWtlICdkZXNjcmlwdGlvbiAoa2V5KScgaW4gdGhlIHZhbHVlIGhlbHAgdGFibGUuXG5cdFx0XHR9LFxuXHRcdFx0dGl0bGUgOiAnQnVzaW5lc3MgUGFydG5lcidcblx0XHQpO1xuXHRcdEZ1bGxOYW1lICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdOYW1lJztcblx0XHRDaXR5TmFtZSAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnQ2l0eSc7XG5cdFx0Q291bnRyeSAgICAgICAgIDogU3RyaW5nIEB0aXRsZTogJ0NvdW50cnknO1xuXHRcdFBvc3RhbENvZGUgICAgICA6IFN0cmluZyBAdGl0bGU6ICdQb3N0YWwgQ29kZSc7XG5cdFx0U3RyZWV0TmFtZSAgICAgIDogU3RyaW5nIEB0aXRsZTogJ1N0cmVldCBOYW1lJztcblx0XHRIb3VzZU51bWJlciAgICAgOiBTdHJpbmcgQHRpdGxlOiAnSG91c2UgTnVtYmVyJztcblx0fTtcblxuXHRhbm5vdGF0ZSBSb290RW50aXR5IHdpdGgge1xuXHRcdEAoQ29tbW9uOiB7XG5cdFx0ICBWYWx1ZUxpc3RXaXRoRml4ZWRWYWx1ZXM6IHRydWUsXG5cdFx0ICBWYWx1ZUxpc3QgICAgICAgICAgICAgICA6IHtcblx0XHRcdExhYmVsICAgICAgICAgOiAnQnVzaW5lc3MgUGFydG5lciBBZGRyZXNzJyxcblx0XHRcdENvbGxlY3Rpb25QYXRoOiAnQnVzaW5lc3NQYXJ0bmVyQWRkcmVzcycsXG5cdFx0XHRQYXJhbWV0ZXJzICAgIDogW3tcblx0XHRcdCAgJFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW5PdXQnLFxuXHRcdFx0ICBMb2NhbERhdGFQcm9wZXJ0eTogdmFsdWVIZWxwRmllbGQ2XzEsXG5cdFx0XHQgIFZhbHVlTGlzdFByb3BlcnR5OiAnQnVzaW5lc3NQYXJ0bmVyJ1xuXHRcdFx0fV1cblx0XHQgIH1cblx0XHR9KVxuXHRcdHZhbHVlSGVscEZpZWxkNl8xO1xuXG5cdFx0QChDb21tb246IHtcblx0XHQgIFRleHQgICAgICAgICAgICAgICAgICAgICAgIDogX0J1c2luZXNzUGFydG5lckFkZHJlc3NfVkhGNl8yLkZ1bGxOYW1lLFxuXHRcdCAgVmFsdWVMaXN0UmVsZXZhbnRRdWFsaWZpZXJzOiBbXG5cblx0XHRcdHskZWRtSnNvbjogeyRJZjogW1xuXHRcdFx0ICB7JEVxOiBbXG5cdFx0XHRcdHskUGF0aDogJ3ZhbHVlSGVscEZpZWxkNl8xJ30sXG5cdFx0XHRcdHskU3RyaW5nOiAnMTcxMDAwMDEnfVxuXHRcdFx0ICBdfSxcblx0XHRcdCAgeyRTdHJpbmc6ICdxdWFsaWZpZXIxMDInfVxuXHRcdFx0XX19LFxuXG5cdFx0XHR7JGVkbUpzb246IHskSWY6IFtcblx0XHRcdCAgeyRFcTogW1xuXHRcdFx0XHR7JFBhdGg6ICd2YWx1ZUhlbHBGaWVsZDZfMSd9LFxuXHRcdFx0XHR7JFN0cmluZzogJzE3MTAwMDAxJ31cblx0XHRcdCAgXX0sXG5cdFx0XHQgIHskU3RyaW5nOiAncXVhbGlmaWVyMTAzJ31cblx0XHRcdF19fSxcblxuXHRcdFx0eyRlZG1Kc29uOiB7JElmOiBbXG5cdFx0XHQgIHskRXE6IFtcblx0XHRcdFx0eyRQYXRoOiAndmFsdWVIZWxwRmllbGQ2XzEnfSxcblx0XHRcdFx0eyRTdHJpbmc6ICcxNzEwMDAwNid9XG5cdFx0XHQgIF19LFxuXHRcdFx0ICB7JFN0cmluZzogJ3F1YWxpZmllcjEwMyd9XG5cdFx0XHRdfX0sXG5cblx0XHRcdHskZWRtSnNvbjogeyRJZjogW1xuXHRcdFx0ICB7JEVxOiBbXG5cdFx0XHRcdHskUGF0aDogJ3ZhbHVlSGVscEZpZWxkNl8xJ30sXG5cdFx0XHRcdHskU3RyaW5nOiAnMTcxMDAwMDYnfVxuXHRcdFx0ICBdfSxcblx0XHRcdCAgeyRTdHJpbmc6ICdxdWFsaWZpZXIxMDQnfVxuXHRcdFx0XX19LFxuXG5cdFx0XHR7JGVkbUpzb246IHskSWY6IFtcblx0XHRcdCAgeyRBbmQ6IFtcblx0XHRcdFx0eyROZTogW1xuXHRcdFx0XHQgIHskUGF0aDogJ3ZhbHVlSGVscEZpZWxkNl8xJ30sXG5cdFx0XHRcdCAgeyRTdHJpbmc6ICcxNzEwMDAwMSd9XG5cdFx0XHRcdF19LFxuXHRcdFx0XHR7JE5lOiBbXG5cdFx0XHRcdCAgeyRQYXRoOiAndmFsdWVIZWxwRmllbGQ2XzEnfSxcblx0XHRcdFx0ICB7JFN0cmluZzogJzE3MTAwMDA2J31cblx0XHRcdFx0XX1cblx0XHRcdCAgXX0sXG5cdFx0XHQgIHskU3RyaW5nOiAnJ31cblx0XHRcdF19fVxuXG5cdFx0ICBdLFxuXHRcdCAgVmFsdWVMaXN0ICAgICAgICAgICAgICAgICAgOiB7XG5cdFx0XHRMYWJlbCAgICAgICAgIDogJ0J1c2luZXNzIFBhcnRuZXIgQWRkcmVzcycsXG5cdFx0XHRDb2xsZWN0aW9uUGF0aDogJ0J1c2luZXNzUGFydG5lckFkZHJlc3MnLFxuXHRcdFx0UGFyYW1ldGVycyAgICA6IFtcblx0XHRcdCAge1xuXHRcdFx0XHQkVHlwZSAgICAgICAgICAgIDogJ0NvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dCcsXG5cdFx0XHRcdExvY2FsRGF0YVByb3BlcnR5OiB2YWx1ZUhlbHBGaWVsZDZfMixcblx0XHRcdFx0VmFsdWVMaXN0UHJvcGVydHk6ICdCdXNpbmVzc1BhcnRuZXInLFxuXHRcdFx0XHQhW0BVSS5JbXBvcnRhbmNlXTogI0hpZ2hcblx0XHRcdCAgfSxcblx0XHRcdCAge1xuXHRcdFx0XHQkVHlwZSAgICAgICAgICAgIDogJ0NvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seScsXG5cdFx0XHRcdFZhbHVlTGlzdFByb3BlcnR5OiAnRnVsbE5hbWUnXG5cdFx0XHQgIH0sXG5cdFx0XHQgIHtcblx0XHRcdFx0JFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHknLFxuXHRcdFx0XHRWYWx1ZUxpc3RQcm9wZXJ0eTogJ0NvdW50cnknXG5cdFx0XHQgIH1cblx0XHRcdF1cblx0XHQgIH0sXG5cdFx0ICBWYWx1ZUxpc3QgI3F1YWxpZmllcjEwMiAgICA6IHtcblx0XHRcdExhYmVsICAgICAgICAgOiAnQnVzaW5lc3MgUGFydG5lciBBZGRyZXNzIDInLFxuXHRcdFx0Q29sbGVjdGlvblBhdGg6ICdCdXNpbmVzc1BhcnRuZXJBZGRyZXNzMicsXG5cdFx0XHRQYXJhbWV0ZXJzICAgIDogW1xuXHRcdFx0ICB7XG5cdFx0XHRcdCRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0Jyxcblx0XHRcdFx0TG9jYWxEYXRhUHJvcGVydHk6IHZhbHVlSGVscEZpZWxkNl8yLFxuXHRcdFx0XHRWYWx1ZUxpc3RQcm9wZXJ0eTogJ0J1c2luZXNzUGFydG5lcicsXG5cdFx0XHRcdCFbQFVJLkltcG9ydGFuY2VdOiAjSGlnaFxuXHRcdFx0ICB9LFxuXHRcdFx0ICB7XG5cdFx0XHRcdCRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5Jyxcblx0XHRcdFx0VmFsdWVMaXN0UHJvcGVydHk6ICdGdWxsTmFtZSdcblx0XHRcdCAgfSxcblx0XHRcdCAge1xuXHRcdFx0XHQkVHlwZSAgICAgICAgICAgIDogJ0NvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seScsXG5cdFx0XHRcdFZhbHVlTGlzdFByb3BlcnR5OiAnQ291bnRyeSdcblx0XHRcdCAgfVxuXHRcdFx0XVxuXHRcdCAgfSxcblx0XHQgIFZhbHVlTGlzdCAjcXVhbGlmaWVyMTAzICAgIDoge1xuXHRcdFx0TGFiZWwgICAgICAgICA6ICdCdXNpbmVzcyBQYXJ0bmVyIEFkZHJlc3MgMycsXG5cdFx0XHRDb2xsZWN0aW9uUGF0aDogJ0J1c2luZXNzUGFydG5lckFkZHJlc3MnLFxuXHRcdFx0UGFyYW1ldGVycyAgICA6IFtcblx0XHRcdCAge1xuXHRcdFx0XHQkVHlwZSAgICAgICAgICAgIDogJ0NvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dCcsXG5cdFx0XHRcdExvY2FsRGF0YVByb3BlcnR5OiB2YWx1ZUhlbHBGaWVsZDZfMixcblx0XHRcdFx0VmFsdWVMaXN0UHJvcGVydHk6ICdCdXNpbmVzc1BhcnRuZXInLFxuXHRcdFx0XHQhW0BVSS5JbXBvcnRhbmNlXTogI0hpZ2hcblx0XHRcdCAgfSxcblx0XHRcdCAge1xuXHRcdFx0XHQkVHlwZSAgICAgICAgICAgIDogJ0NvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seScsXG5cdFx0XHRcdFZhbHVlTGlzdFByb3BlcnR5OiAnRnVsbE5hbWUnXG5cdFx0XHQgIH0sXG5cdFx0XHQgIHtcblx0XHRcdFx0JFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHknLFxuXHRcdFx0XHRWYWx1ZUxpc3RQcm9wZXJ0eTogJ0NpdHlOYW1lJ1xuXHRcdFx0ICB9XG5cdFx0XHRdXG5cdFx0ICB9LFxuXHRcdCAgVmFsdWVMaXN0ICNxdWFsaWZpZXIxMDQgICAgOiB7XG5cdFx0XHRMYWJlbCAgICAgICAgIDogJ0J1c2luZXNzIFBhcnRuZXIgQWRkcmVzcyA0Jyxcblx0XHRcdENvbGxlY3Rpb25QYXRoOiAnQnVzaW5lc3NQYXJ0bmVyQWRkcmVzcycsXG5cdFx0XHRQYXJhbWV0ZXJzICAgIDogW1xuXHRcdFx0ICB7XG5cdFx0XHRcdCRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0Jyxcblx0XHRcdFx0TG9jYWxEYXRhUHJvcGVydHk6IHZhbHVlSGVscEZpZWxkNl8yLFxuXHRcdFx0XHRWYWx1ZUxpc3RQcm9wZXJ0eTogJ0J1c2luZXNzUGFydG5lcicsXG5cdFx0XHRcdCFbQFVJLkltcG9ydGFuY2VdOiAjSGlnaFxuXHRcdFx0ICB9LFxuXHRcdFx0ICB7XG5cdFx0XHRcdCRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5Jyxcblx0XHRcdFx0VmFsdWVMaXN0UHJvcGVydHk6ICdGdWxsTmFtZSdcblx0XHRcdCAgfSxcblx0XHRcdCAge1xuXHRcdFx0XHQkVHlwZSAgICAgICAgICAgIDogJ0NvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seScsXG5cdFx0XHRcdFZhbHVlTGlzdFByb3BlcnR5OiAnQ2l0eU5hbWUnXG5cdFx0XHQgIH0sXG5cdFx0XHQgIHtcblx0XHRcdFx0JFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHknLFxuXHRcdFx0XHRWYWx1ZUxpc3RQcm9wZXJ0eTogJ1N0cmVldE5hbWUnXG5cdFx0XHQgIH1cblx0XHRcdF1cblx0XHQgIH1cblx0XHR9KVxuXHRcdHZhbHVlSGVscEZpZWxkNl8yO1xuXHR9XG5cblx0XHRgLnNsaWNlKDIsIC0yKSwgLy8gcmVtb3ZlIGZpcnN0IGFuZCBsYXN0IDIgbmV3bGluZXNcblxuXHRcdFx0eG1sOiBgXG5cdDxFbnRpdHlUeXBlIE5hbWU9XCJCdXNpbmVzc1BhcnRuZXJBZGRyZXNzXCI+XG5cdFx0PEtleT5cblx0XHRcdDxQcm9wZXJ0eVJlZiBOYW1lPVwiQnVzaW5lc3NQYXJ0bmVyXCIvPlxuXHRcdDwvS2V5PlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiQnVzaW5lc3NQYXJ0bmVyXCIgVHlwZT1cIkVkbS5TdHJpbmdcIiBOdWxsYWJsZT1cImZhbHNlXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiRnVsbE5hbWVcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkNpdHlOYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJDb3VudHJ5XCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJQb3N0YWxDb2RlXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJTdHJlZXROYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJIb3VzZU51bWJlclwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHQ8L0VudGl0eVR5cGU+XG5cdDxFbnRpdHlUeXBlIE5hbWU9XCJCdXNpbmVzc1BhcnRuZXJBZGRyZXNzMlwiPlxuXHRcdDxLZXk+XG5cdFx0XHQ8UHJvcGVydHlSZWYgTmFtZT1cIkJ1c2luZXNzUGFydG5lclwiLz5cblx0XHQ8L0tleT5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkJ1c2luZXNzUGFydG5lclwiIFR5cGU9XCJFZG0uU3RyaW5nXCIgTnVsbGFibGU9XCJmYWxzZVwiLz5cblx0XHQ8UHJvcGVydHkgTmFtZT1cIkZ1bGxOYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PFByb3BlcnR5IE5hbWU9XCJDaXR5TmFtZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiQ291bnRyeVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiUG9zdGFsQ29kZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiU3RyZWV0TmFtZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdDxQcm9wZXJ0eSBOYW1lPVwiSG91c2VOdW1iZXJcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0PC9FbnRpdHlUeXBlPlxuXHQ8QW5ub3RhdGlvbnMgVGFyZ2V0PVwic2FwLmZlLmNvcmUuU2VydmljZS5Sb290RW50aXR5L3ZhbHVlSGVscEZpZWxkNl8xXCI+XG5cdFx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5WYWx1ZUxpc3RXaXRoRml4ZWRWYWx1ZXNcIiBCb29sPVwidHJ1ZVwiLz5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlZhbHVlTGlzdFwiPlxuXHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFR5cGVcIj5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJMYWJlbFwiIFN0cmluZz1cIkJ1c2luZXNzIFBhcnRuZXIgQWRkcmVzc1wiLz5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJDb2xsZWN0aW9uUGF0aFwiIFN0cmluZz1cIkJ1c2luZXNzUGFydG5lckFkZHJlc3NcIi8+XG5cdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiUGFyYW1ldGVyc1wiPlxuXHRcdFx0XHRcdDxDb2xsZWN0aW9uPlxuXHRcdFx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0XCI+XG5cdFx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiTG9jYWxEYXRhUHJvcGVydHlcIiBQcm9wZXJ0eVBhdGg9XCJ2YWx1ZUhlbHBGaWVsZDZfMVwiLz5cblx0XHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIkJ1c2luZXNzUGFydG5lclwiLz5cblx0XHRcdFx0XHRcdDwvUmVjb3JkPlxuXHRcdFx0XHRcdDwvQ29sbGVjdGlvbj5cblx0XHRcdFx0PC9Qcm9wZXJ0eVZhbHVlPlxuXHRcdFx0PC9SZWNvcmQ+XG5cdFx0PC9Bbm5vdGF0aW9uPlxuXHRcdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uTGFiZWxcIiBTdHJpbmc9XCJWYWx1ZSBIZWxwIEZpZWxkIDZfMVwiLz5cblx0PC9Bbm5vdGF0aW9ucz5cblx0PEFubm90YXRpb25zIFRhcmdldD1cInNhcC5mZS5jb3JlLlNlcnZpY2UuUm9vdEVudGl0eS92YWx1ZUhlbHBGaWVsZDZfMlwiPlxuXHRcdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uVGV4dFwiIFBhdGg9XCJfQnVzaW5lc3NQYXJ0bmVyQWRkcmVzc19WSEY2XzIvRnVsbE5hbWVcIi8+XG5cdFx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5WYWx1ZUxpc3RSZWxldmFudFF1YWxpZmllcnNcIj5cblx0XHRcdDxDb2xsZWN0aW9uPlxuXHRcdFx0PElmPlxuXHRcdFx0XHQ8RXE+XG5cdFx0XHRcdFx0PFBhdGg+dmFsdWVIZWxwRmllbGQ2XzE8L1BhdGg+XG5cdFx0XHRcdFx0PFN0cmluZz4xNzEwMDAwMTwvU3RyaW5nPlxuXHRcdFx0XHQ8L0VxPlxuXHRcdFx0XHQ8U3RyaW5nPnF1YWxpZmllcjEwMjwvU3RyaW5nPlxuXHRcdFx0PC9JZj5cblx0XHRcdDxJZj5cblx0XHRcdFx0PEVxPlxuXHRcdFx0XHRcdDxQYXRoPnZhbHVlSGVscEZpZWxkNl8xPC9QYXRoPlxuXHRcdFx0XHRcdDxTdHJpbmc+MTcxMDAwMDE8L1N0cmluZz5cblx0XHRcdFx0PC9FcT5cblx0XHRcdFx0PFN0cmluZz5xdWFsaWZpZXIxMDM8L1N0cmluZz5cblx0XHRcdDwvSWY+XG5cdFx0XHQ8SWY+XG5cdFx0XHRcdDxFcT5cblx0XHRcdFx0XHQ8UGF0aD52YWx1ZUhlbHBGaWVsZDZfMTwvUGF0aD5cblx0XHRcdFx0XHQ8U3RyaW5nPjE3MTAwMDA2PC9TdHJpbmc+XG5cdFx0XHRcdDwvRXE+XG5cdFx0XHRcdDxTdHJpbmc+cXVhbGlmaWVyMTAzPC9TdHJpbmc+XG5cdFx0XHQ8L0lmPlxuXHRcdFx0PElmPlxuXHRcdFx0XHQ8RXE+XG5cdFx0XHRcdFx0PFBhdGg+dmFsdWVIZWxwRmllbGQ2XzE8L1BhdGg+XG5cdFx0XHRcdFx0PFN0cmluZz4xNzEwMDAwNjwvU3RyaW5nPlxuXHRcdFx0XHQ8L0VxPlxuXHRcdFx0XHQ8U3RyaW5nPnF1YWxpZmllcjEwNDwvU3RyaW5nPlxuXHRcdFx0PC9JZj5cblx0XHRcdDxJZj5cblx0XHRcdFx0PEFuZD5cblx0XHRcdFx0PE5lPlxuXHRcdFx0XHRcdDxQYXRoPnZhbHVlSGVscEZpZWxkNl8xPC9QYXRoPlxuXHRcdFx0XHRcdDxTdHJpbmc+MTcxMDAwMDE8L1N0cmluZz5cblx0XHRcdFx0PC9OZT5cblx0XHRcdFx0PE5lPlxuXHRcdFx0XHRcdDxQYXRoPnZhbHVlSGVscEZpZWxkNl8xPC9QYXRoPlxuXHRcdFx0XHRcdDxTdHJpbmc+MTcxMDAwMDY8L1N0cmluZz5cblx0XHRcdFx0PC9OZT5cblx0XHRcdFx0PC9BbmQ+XG5cdFx0XHRcdDxTdHJpbmc+PC9TdHJpbmc+XG5cdFx0XHQ8L0lmPlxuXHRcdFx0PC9Db2xsZWN0aW9uPlxuXHRcdDwvQW5ub3RhdGlvbj5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlZhbHVlTGlzdFwiPlxuXHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFR5cGVcIj5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJMYWJlbFwiIFN0cmluZz1cIkJ1c2luZXNzIFBhcnRuZXIgQWRkcmVzc1wiLz5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJDb2xsZWN0aW9uUGF0aFwiIFN0cmluZz1cIkJ1c2luZXNzUGFydG5lckFkZHJlc3NcIi8+XG5cdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiUGFyYW1ldGVyc1wiPlxuXHRcdFx0XHRcdDxDb2xsZWN0aW9uPlxuXHRcdFx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0XCI+XG5cdFx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiTG9jYWxEYXRhUHJvcGVydHlcIiBQcm9wZXJ0eVBhdGg9XCJ2YWx1ZUhlbHBGaWVsZDZfMlwiLz5cblx0XHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIkJ1c2luZXNzUGFydG5lclwiLz5cblx0XHRcdFx0XHRcdFx0PEFubm90YXRpb24gVGVybT1cIlVJLkltcG9ydGFuY2VcIiBFbnVtTWVtYmVyPVwiVUkuSW1wb3J0YW5jZVR5cGUvSGlnaFwiLz5cblx0XHRcdFx0XHRcdDwvUmVjb3JkPlxuXHRcdFx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5XCI+XG5cdFx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVmFsdWVMaXN0UHJvcGVydHlcIiBTdHJpbmc9XCJGdWxsTmFtZVwiLz5cblx0XHRcdFx0XHRcdDwvUmVjb3JkPlxuXHRcdFx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5XCI+XG5cdFx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVmFsdWVMaXN0UHJvcGVydHlcIiBTdHJpbmc9XCJDb3VudHJ5XCIvPlxuXHRcdFx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdFx0PC9Db2xsZWN0aW9uPlxuXHRcdFx0XHQ8L1Byb3BlcnR5VmFsdWU+XG5cdFx0XHQ8L1JlY29yZD5cblx0XHQ8L0Fubm90YXRpb24+XG5cdFx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5WYWx1ZUxpc3RcIiBRdWFsaWZpZXI9XCJxdWFsaWZpZXIxMDJcIj5cblx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RUeXBlXCI+XG5cdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiTGFiZWxcIiBTdHJpbmc9XCJCdXNpbmVzcyBQYXJ0bmVyIEFkZHJlc3MgMlwiLz5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJDb2xsZWN0aW9uUGF0aFwiIFN0cmluZz1cIkJ1c2luZXNzUGFydG5lckFkZHJlc3MyXCIvPlxuXHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlBhcmFtZXRlcnNcIj5cblx0XHRcdFx0XHQ8Q29sbGVjdGlvbj5cblx0XHRcdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dFwiPlxuXHRcdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkxvY2FsRGF0YVByb3BlcnR5XCIgUHJvcGVydHlQYXRoPVwidmFsdWVIZWxwRmllbGQ2XzJcIi8+XG5cdFx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVmFsdWVMaXN0UHJvcGVydHlcIiBTdHJpbmc9XCJCdXNpbmVzc1BhcnRuZXJcIi8+XG5cdFx0XHRcdFx0XHRcdDxBbm5vdGF0aW9uIFRlcm09XCJVSS5JbXBvcnRhbmNlXCIgRW51bU1lbWJlcj1cIlVJLkltcG9ydGFuY2VUeXBlL0hpZ2hcIi8+XG5cdFx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seVwiPlxuXHRcdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiRnVsbE5hbWVcIi8+XG5cdFx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seVwiPlxuXHRcdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiQ291bnRyeVwiLz5cblx0XHRcdFx0XHRcdDwvUmVjb3JkPlxuXHRcdFx0XHRcdDwvQ29sbGVjdGlvbj5cblx0XHRcdFx0PC9Qcm9wZXJ0eVZhbHVlPlxuXHRcdFx0PC9SZWNvcmQ+XG5cdFx0PC9Bbm5vdGF0aW9uPlxuXHRcdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uVmFsdWVMaXN0XCIgUXVhbGlmaWVyPVwicXVhbGlmaWVyMTAzXCI+XG5cdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0VHlwZVwiPlxuXHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkxhYmVsXCIgU3RyaW5nPVwiQnVzaW5lc3MgUGFydG5lciBBZGRyZXNzIDNcIi8+XG5cdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiQ29sbGVjdGlvblBhdGhcIiBTdHJpbmc9XCJCdXNpbmVzc1BhcnRuZXJBZGRyZXNzXCIvPlxuXHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlBhcmFtZXRlcnNcIj5cblx0XHRcdFx0XHQ8Q29sbGVjdGlvbj5cblx0XHRcdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dFwiPlxuXHRcdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkxvY2FsRGF0YVByb3BlcnR5XCIgUHJvcGVydHlQYXRoPVwidmFsdWVIZWxwRmllbGQ2XzJcIi8+XG5cdFx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVmFsdWVMaXN0UHJvcGVydHlcIiBTdHJpbmc9XCJCdXNpbmVzc1BhcnRuZXJcIi8+XG5cdFx0XHRcdFx0XHRcdDxBbm5vdGF0aW9uIFRlcm09XCJVSS5JbXBvcnRhbmNlXCIgRW51bU1lbWJlcj1cIlVJLkltcG9ydGFuY2VUeXBlL0hpZ2hcIi8+XG5cdFx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seVwiPlxuXHRcdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiRnVsbE5hbWVcIi8+XG5cdFx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seVwiPlxuXHRcdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiQ2l0eU5hbWVcIi8+XG5cdFx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHQ8L0NvbGxlY3Rpb24+XG5cdFx0XHRcdDwvUHJvcGVydHlWYWx1ZT5cblx0XHRcdDwvUmVjb3JkPlxuXHRcdDwvQW5ub3RhdGlvbj5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlZhbHVlTGlzdFwiIFF1YWxpZmllcj1cInF1YWxpZmllcjEwNFwiPlxuXHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFR5cGVcIj5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJMYWJlbFwiIFN0cmluZz1cIkJ1c2luZXNzIFBhcnRuZXIgQWRkcmVzcyA0XCIvPlxuXHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkNvbGxlY3Rpb25QYXRoXCIgU3RyaW5nPVwiQnVzaW5lc3NQYXJ0bmVyQWRkcmVzc1wiLz5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJQYXJhbWV0ZXJzXCI+XG5cdFx0XHRcdFx0PENvbGxlY3Rpb24+XG5cdFx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW5PdXRcIj5cblx0XHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJMb2NhbERhdGFQcm9wZXJ0eVwiIFByb3BlcnR5UGF0aD1cInZhbHVlSGVscEZpZWxkNl8yXCIvPlxuXHRcdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiQnVzaW5lc3NQYXJ0bmVyXCIvPlxuXHRcdFx0XHRcdFx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiVUkuSW1wb3J0YW5jZVwiIEVudW1NZW1iZXI9XCJVSS5JbXBvcnRhbmNlVHlwZS9IaWdoXCIvPlxuXHRcdFx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHlcIj5cblx0XHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIkZ1bGxOYW1lXCIvPlxuXHRcdFx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHlcIj5cblx0XHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIkNpdHlOYW1lXCIvPlxuXHRcdFx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHlcIj5cblx0XHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIlN0cmVldE5hbWVcIi8+XG5cdFx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHQ8L0NvbGxlY3Rpb24+XG5cdFx0XHRcdDwvUHJvcGVydHlWYWx1ZT5cblx0XHRcdDwvUmVjb3JkPlxuXHRcdDwvQW5ub3RhdGlvbj5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLkxhYmVsXCIgU3RyaW5nPVwiVmFsdWUgSGVscCBGaWVsZCA2XzJcIi8+XG5cdDwvQW5ub3RhdGlvbnM+XG5cblx0XHRgLnNsaWNlKDIsIC0yKVxuXHRcdH1cblx0fSxcblx0LyogNy4pIEluIC8gT3V0IE1hcHBpbmdzIGluIHRoZSBWYWx1ZUxpc3QgQW5ub3RhdGlvbiAqL1xuXHR7XG5cdFx0aWQ6IFwiY29kZVZISW5PdXRNYXBwaW5nc1NvdXJjZVwiLFxuXHRcdGNvZGU6IHtcblx0XHRcdGNkczogLyogY2RzICovIGBcblx0ZW50aXR5IEJ1c2luZXNzUGFydG5lckFkZHJlc3Mge1xuXHRcdGtleSBCdXNpbmVzc1BhcnRuZXIgOiBTdHJpbmcgQHRpdGxlOiAnQnVzaW5lc3MgUGFydG5lcic7XG5cdFx0XHRGdWxsTmFtZSAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnTmFtZSc7XG5cdFx0XHRDaXR5TmFtZSAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnQ2l0eSc7XG5cdFx0XHRDb3VudHJ5ICAgICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnQ291bnRyeSc7XG5cdFx0XHRQb3N0YWxDb2RlICAgICAgOiBTdHJpbmcgQHRpdGxlOiAnUG9zdGFsIENvZGUnO1xuXHRcdFx0U3RyZWV0TmFtZSAgICAgIDogU3RyaW5nIEB0aXRsZTogJ1N0cmVldCBOYW1lJztcblx0XHRcdEhvdXNlTnVtYmVyICAgICA6IFN0cmluZyBAdGl0bGU6ICdIb3VzZSBOdW1iZXInO1xuXHRcdFx0QWNjb3VudCAgICAgICAgIDogU3RyaW5nIEB0aXRsZTogJ0FjY291bnQnO1xuXHRcdH07XG5cblx0ZW50aXR5IEFjY291bnQge1xuXHRcdGtleSBBY2NvdW50ICA6IFN0cmluZyBAdGl0bGU6ICdBY2NvdW50Jztcblx0XHRcdEZ1bGxOYW1lIDogU3RyaW5nIEB0aXRsZTogJ05hbWUnO1xuXHRcdFx0Q2l0eU5hbWUgOiBTdHJpbmcgQHRpdGxlOiAnQ2l0eSc7XG5cdFx0XHRDb3VudHJ5ICA6IFN0cmluZyBAdGl0bGU6ICdDb3VudHJ5Jztcblx0fTtcblxuXHRlbnRpdHkgUGFydG5lckZ1bmN0aW9uIHtcblx0XHRrZXkgUGFydG5lckZ1bmN0aW9uICAgICA6IFN0cmluZyBAKFxuXHRcdFx0XHR0aXRsZSA6ICdQRicsXG5cdFx0XHRcdENvbW1vbjoge1RleHQ6IFBhcnRuZXJGdW5jdGlvbk5hbWV9XG5cdFx0XHQpO1xuXHRcdFBhcnRuZXJGdW5jdGlvbk5hbWUgOiBTdHJpbmcgQHRpdGxlOiAnUGFydG5lciBGdW5jdGlvbic7XG5cdH07XG5cblx0ZW50aXR5IEFjY0JwIHtcblx0XHRrZXkgQWNjb3VudCAgICAgICAgICA6IFN0cmluZyBAdGl0bGU6ICdBY2NvdW50Jztcblx0XHRrZXkgQnVzaW5lc3NQYXJ0bmVyICA6IFN0cmluZyBAdGl0bGU6ICdCdXNpbmVzcyBQYXJ0bmVyJztcblx0XHRcdFBhcnRuZXJGdW5jdGlvbiAgOiBTdHJpbmcgQChcblx0XHRcdFx0dGl0bGUgOiAnUEYnLFxuXHRcdFx0XHRDb21tb246IHtUZXh0OiBfUGFydG5lckZ1bmN0aW9uLlBhcnRuZXJGdW5jdGlvbk5hbWV9XG5cdFx0XHQpO1xuXHRcdF9QYXJ0bmVyRnVuY3Rpb24gOiBBc3NvY2lhdGlvbiB0byBvbmUgUGFydG5lckZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRcdFx0b24gX1BhcnRuZXJGdW5jdGlvbi5QYXJ0bmVyRnVuY3Rpb24gPSBQYXJ0bmVyRnVuY3Rpb247XG5cdH07XG5cblx0YW5ub3RhdGUgUm9vdEVudGl0eSB3aXRoIHtcblx0XHRAKENvbW1vbjoge1ZhbHVlTGlzdDoge1xuXHRcdCAgQ29sbGVjdGlvblBhdGg6ICdBY2NvdW50Jyxcblx0XHQgIFBhcmFtZXRlcnMgICAgOiBbXG5cdFx0XHR7XG5cdFx0XHQgICRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0Jyxcblx0XHRcdCAgTG9jYWxEYXRhUHJvcGVydHk6IHZhbHVlSGVscEZpZWxkN18xLFxuXHRcdFx0ICBWYWx1ZUxpc3RQcm9wZXJ0eTogJ0FjY291bnQnLFxuXHRcdFx0ICAhW0BVSS5JbXBvcnRhbmNlXTogI0hpZ2hcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHQgICRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlck91dCcsXG5cdFx0XHQgIExvY2FsRGF0YVByb3BlcnR5OiB2YWx1ZUhlbHBGaWVsZDdfMixcblx0XHRcdCAgVmFsdWVMaXN0UHJvcGVydHk6ICdGdWxsTmFtZScsXG5cdFx0XHQgICFbQFVJLkltcG9ydGFuY2VdOiAjSGlnaFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdCAgJFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHknLFxuXHRcdFx0ICBWYWx1ZUxpc3RQcm9wZXJ0eTogJ0NpdHlOYW1lJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdCAgJFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHknLFxuXHRcdFx0ICBWYWx1ZUxpc3RQcm9wZXJ0eTogJ0NvdW50cnknXG5cdFx0XHR9LFxuXHRcdCAgXSxcblx0XHR9fSwgKVxuXHRcdHZhbHVlSGVscEZpZWxkN18xO1xuXHR9XG5cblx0Ly8gdmFsdWVIZWxwRmllbGQ3XzIgaXMgb25seSBhIGlucHV0IGZpZWxkIHByZWZpbGxlZCB3aXRoIHRoZSBmaWx0ZXIgcmVzdWx0IGZyb20gdmFsdWVIZWxwRmllbGQ3XzFcblxuXG5cdGFubm90YXRlIFJvb3RFbnRpdHkgd2l0aCB7XG5cdFx0QChDb21tb246IHtcblx0XHQgIFZhbHVlTGlzdEZvclZhbGlkYXRpb246ICcnLFxuXHRcdCAgVmFsdWVMaXN0ICAgICAgICAgICAgIDoge1xuXHRcdFx0TGFiZWwgICAgICAgICA6ICdCdXNpbmVzcyBQYXJ0bmVyIEFkZHJlc3MnLFxuXHRcdFx0Q29sbGVjdGlvblBhdGg6ICdCdXNpbmVzc1BhcnRuZXJBZGRyZXNzJyxcblx0XHRcdFBhcmFtZXRlcnMgICAgOiBbXG5cdFx0XHQgIHtcblx0XHRcdFx0JFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW5PdXQnLFxuXHRcdFx0XHRMb2NhbERhdGFQcm9wZXJ0eTogdmFsdWVIZWxwRmllbGQ3XzMsXG5cdFx0XHRcdFZhbHVlTGlzdFByb3BlcnR5OiAnQnVzaW5lc3NQYXJ0bmVyJyxcblx0XHRcdFx0IVtAVUkuSW1wb3J0YW5jZV06ICNIaWdoXG5cdFx0XHQgIH0sXG5cdFx0XHQgIHtcblx0XHRcdFx0JFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW4nLFxuXHRcdFx0XHRMb2NhbERhdGFQcm9wZXJ0eTogdmFsdWVIZWxwRmllbGQ3XzEsXG5cdFx0XHRcdFZhbHVlTGlzdFByb3BlcnR5OiAnQWNjb3VudCcsXG5cdFx0XHQgIH0sXG5cdFx0XHQgIHtcblx0XHRcdFx0JFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHknLFxuXHRcdFx0XHRWYWx1ZUxpc3RQcm9wZXJ0eTogJ0NpdHlOYW1lJyxcblx0XHRcdFx0IVtAVUkuSW1wb3J0YW5jZV06ICNIaWdoXG5cdFx0XHQgIH0sXG5cdFx0XHRdLFxuXHRcdCAgfVxuXHRcdH0sIClcblx0XHR2YWx1ZUhlbHBGaWVsZDdfMztcblx0ICB9XG5cblx0ICBhbm5vdGF0ZSBSb290RW50aXR5IHdpdGgge1xuXHRcdEAoQ29tbW9uOiB7XG5cdFx0ICBUZXh0ICAgICAgICAgICA6IF9QYXJ0bmVyRnVuY3Rpb24uUGFydG5lckZ1bmN0aW9uTmFtZSxcblx0XHQgIFRleHRBcnJhbmdlbWVudDogI1RleHRPbmx5LFxuXHRcdCAgVmFsdWVMaXN0OiB7XG5cdFx0ICBMYWJlbCAgICAgICAgIDogJ1BhcnRuZXIgRnVuY3Rpb24nLFxuXHRcdCAgQ29sbGVjdGlvblBhdGg6ICdBY2NCcCcsXG5cdFx0ICBQYXJhbWV0ZXJzICAgIDogW1xuXHRcdFx0e1xuXHRcdFx0ICAkVHlwZSAgICAgICAgICAgIDogJ0NvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dCcsXG5cdFx0XHQgIExvY2FsRGF0YVByb3BlcnR5OiB2YWx1ZUhlbHBGaWVsZDdfNCxcblx0XHRcdCAgVmFsdWVMaXN0UHJvcGVydHk6ICdQYXJ0bmVyRnVuY3Rpb24nLFxuXHRcdFx0ICAhW0BVSS5JbXBvcnRhbmNlXTogI0hpZ2hcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHQgICRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckluJyxcblx0XHRcdCAgTG9jYWxEYXRhUHJvcGVydHk6IHZhbHVlSGVscEZpZWxkN18xLFxuXHRcdFx0ICBWYWx1ZUxpc3RQcm9wZXJ0eTogJ0FjY291bnQnLFxuXHRcdFx0ICAhW0BVSS5JbXBvcnRhbmNlXTogI0hpZ2hcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHQgICRUeXBlICAgICAgICAgICAgOiAnQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0Jyxcblx0XHRcdCAgTG9jYWxEYXRhUHJvcGVydHk6IHZhbHVlSGVscEZpZWxkN18zLFxuXHRcdFx0ICBWYWx1ZUxpc3RQcm9wZXJ0eTogJ0J1c2luZXNzUGFydG5lcicsXG5cdFx0XHQgICFbQFVJLkltcG9ydGFuY2VdOiAjSGlnaFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdCAgJFR5cGUgICAgICAgICAgICA6ICdDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVyRGlzcGxheU9ubHknLFxuXHRcdFx0ICBWYWx1ZUxpc3RQcm9wZXJ0eTogJ19QYXJ0bmVyRnVuY3Rpb24vUGFydG5lckZ1bmN0aW9uTmFtZScsXG5cdFx0XHQgICFbQFVJLkltcG9ydGFuY2VdOiAjSGlnaFxuXHRcdFx0fVxuXHRcdCAgXSxcblx0XHR9fSwgKVxuXHRcdHZhbHVlSGVscEZpZWxkN180O1xuXHQgIH1cblxuXHRhbm5vdGF0ZSBSb290RW50aXR5IHdpdGhcblx0XHRAKFVJLkZpZWxkR3JvdXAgI0V4YW1wbGU3OiB7XG5cdFx0TGFiZWw6ICdFeGFtcGxlNycsXG5cdFx0JFR5cGU6ICdVSS5GaWVsZEdyb3VwVHlwZScsXG5cdFx0RGF0YSA6IFtcblx0XHRcdHtcblx0XHRcdFZhbHVlOiB2YWx1ZUhlbHBGaWVsZDdfMSxcblx0XHRcdCRUeXBlOiAnVUkuRGF0YUZpZWxkJyxcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRWYWx1ZTogdmFsdWVIZWxwRmllbGQ3XzIsXG5cdFx0XHQkVHlwZTogJ1VJLkRhdGFGaWVsZCcsXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0VmFsdWU6IHZhbHVlSGVscEZpZWxkN18zLFxuXHRcdFx0JFR5cGU6ICdVSS5EYXRhRmllbGQnLFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFZhbHVlOiB2YWx1ZUhlbHBGaWVsZDdfNCxcblx0XHRcdCRUeXBlOiAnVUkuRGF0YUZpZWxkJyxcblx0XHRcdH0sXG5cdFx0XVxuXHR9KTtcblxuXHRcdGAuc2xpY2UoMiwgLTIpLCAvLyByZW1vdmUgZmlyc3QgYW5kIGxhc3QgMiBuZXdsaW5lc1xuXG5cdFx0XHR4bWw6IGBcblxuXHRcdDxFbnRpdHlUeXBlIE5hbWU9XCJCdXNpbmVzc1BhcnRuZXJBZGRyZXNzXCI+XG5cdFx0XHQ8S2V5PlxuXHRcdFx0XHQ8UHJvcGVydHlSZWYgTmFtZT1cIkJ1c2luZXNzUGFydG5lclwiLz5cblx0XHRcdDwvS2V5PlxuXHRcdFx0PFByb3BlcnR5IE5hbWU9XCJCdXNpbmVzc1BhcnRuZXJcIiBUeXBlPVwiRWRtLlN0cmluZ1wiIE51bGxhYmxlPVwiZmFsc2VcIi8+XG5cdFx0XHQ8UHJvcGVydHkgTmFtZT1cIkZ1bGxOYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0XHQ8UHJvcGVydHkgTmFtZT1cIkNpdHlOYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0XHQ8UHJvcGVydHkgTmFtZT1cIkNvdW50cnlcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHRcdDxQcm9wZXJ0eSBOYW1lPVwiUG9zdGFsQ29kZVwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdFx0PFByb3BlcnR5IE5hbWU9XCJTdHJlZXROYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0XHQ8UHJvcGVydHkgTmFtZT1cIkhvdXNlTnVtYmVyXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0XHQ8UHJvcGVydHkgTmFtZT1cIkFjY291bnRcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8L0VudGl0eVR5cGU+XG5cdFx0XHQ8RW50aXR5VHlwZSBOYW1lPVwiQWNjb3VudFwiPlxuXHRcdFx0PEtleT5cblx0XHRcdFx0PFByb3BlcnR5UmVmIE5hbWU9XCJBY2NvdW50XCIvPlxuXHRcdFx0PC9LZXk+XG5cdFx0XHQ8UHJvcGVydHkgTmFtZT1cIkFjY291bnRcIiBUeXBlPVwiRWRtLlN0cmluZ1wiIE51bGxhYmxlPVwiZmFsc2VcIi8+XG5cdFx0XHQ8UHJvcGVydHkgTmFtZT1cIkZ1bGxOYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0XHQ8UHJvcGVydHkgTmFtZT1cIkNpdHlOYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0XHQ8UHJvcGVydHkgTmFtZT1cIkNvdW50cnlcIiBUeXBlPVwiRWRtLlN0cmluZ1wiLz5cblx0XHQ8L0VudGl0eVR5cGU+XG5cdFx0PEVudGl0eVR5cGUgTmFtZT1cIlBhcnRuZXJGdW5jdGlvblwiPlxuXHRcdFx0PEtleT5cblx0XHRcdFx0PFByb3BlcnR5UmVmIE5hbWU9XCJQYXJ0bmVyRnVuY3Rpb25cIi8+XG5cdFx0XHQ8L0tleT5cblx0XHRcdDxQcm9wZXJ0eSBOYW1lPVwiUGFydG5lckZ1bmN0aW9uXCIgVHlwZT1cIkVkbS5TdHJpbmdcIiBOdWxsYWJsZT1cImZhbHNlXCIvPlxuXHRcdFx0PFByb3BlcnR5IE5hbWU9XCJQYXJ0bmVyRnVuY3Rpb25OYW1lXCIgVHlwZT1cIkVkbS5TdHJpbmdcIi8+XG5cdFx0PC9FbnRpdHlUeXBlPlxuXHRcdDxFbnRpdHlUeXBlIE5hbWU9XCJBY2NCcFwiPlxuXHRcdFx0PEtleT5cblx0XHRcdFx0PFByb3BlcnR5UmVmIE5hbWU9XCJBY2NvdW50XCIvPlxuXHRcdFx0XHQ8UHJvcGVydHlSZWYgTmFtZT1cIkJ1c2luZXNzUGFydG5lclwiLz5cblx0XHRcdDwvS2V5PlxuXHRcdFx0PFByb3BlcnR5IE5hbWU9XCJBY2NvdW50XCIgVHlwZT1cIkVkbS5TdHJpbmdcIiBOdWxsYWJsZT1cImZhbHNlXCIvPlxuXHRcdFx0PFByb3BlcnR5IE5hbWU9XCJCdXNpbmVzc1BhcnRuZXJcIiBUeXBlPVwiRWRtLlN0cmluZ1wiIE51bGxhYmxlPVwiZmFsc2VcIi8+XG5cdFx0XHQ8UHJvcGVydHkgTmFtZT1cIlBhcnRuZXJGdW5jdGlvblwiIFR5cGU9XCJFZG0uU3RyaW5nXCIvPlxuXHRcdFx0PE5hdmlnYXRpb25Qcm9wZXJ0eSBOYW1lPVwiX1BhcnRuZXJGdW5jdGlvblwiIFR5cGU9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLlBhcnRuZXJGdW5jdGlvblwiPlxuXHRcdFx0XHQ8UmVmZXJlbnRpYWxDb25zdHJhaW50IFByb3BlcnR5PVwiUGFydG5lckZ1bmN0aW9uXCIgUmVmZXJlbmNlZFByb3BlcnR5PVwiUGFydG5lckZ1bmN0aW9uXCIvPlxuXHRcdFx0PC9OYXZpZ2F0aW9uUHJvcGVydHk+XG5cdFx0PC9FbnRpdHlUeXBlPlxuXG5cdFx0PEFubm90YXRpb25zIFRhcmdldD1cInNhcC5mZS5jb3JlLlNlcnZpY2UuUm9vdEVudGl0eS92YWx1ZUhlbHBGaWVsZDdfMVwiPlxuXHRcdFx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5WYWx1ZUxpc3RcIj5cblx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFR5cGVcIj5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJDb2xsZWN0aW9uUGF0aFwiIFN0cmluZz1cIkFjY291bnRcIi8+XG5cdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiUGFyYW1ldGVyc1wiPlxuXHRcdFx0XHRcdDxDb2xsZWN0aW9uPlxuXHRcdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dFwiPlxuXHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJMb2NhbERhdGFQcm9wZXJ0eVwiIFByb3BlcnR5UGF0aD1cInZhbHVlSGVscEZpZWxkN18xXCIvPlxuXHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIkFjY291bnRcIi8+XG5cdFx0XHRcdFx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiVUkuSW1wb3J0YW5jZVwiIEVudW1NZW1iZXI9XCJVSS5JbXBvcnRhbmNlVHlwZS9IaWdoXCIvPlxuXHRcdFx0XHRcdDwvUmVjb3JkPlxuXHRcdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJPdXRcIj5cblx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiTG9jYWxEYXRhUHJvcGVydHlcIiBQcm9wZXJ0eVBhdGg9XCJ2YWx1ZUhlbHBGaWVsZDdfMlwiLz5cblx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVmFsdWVMaXN0UHJvcGVydHlcIiBTdHJpbmc9XCJGdWxsTmFtZVwiLz5cblx0XHRcdFx0XHRcdDxBbm5vdGF0aW9uIFRlcm09XCJVSS5JbXBvcnRhbmNlXCIgRW51bU1lbWJlcj1cIlVJLkltcG9ydGFuY2VUeXBlL0hpZ2hcIi8+XG5cdFx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5XCI+XG5cdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiQ2l0eU5hbWVcIi8+XG5cdFx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckRpc3BsYXlPbmx5XCI+XG5cdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiQ291bnRyeVwiLz5cblx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHQ8L0NvbGxlY3Rpb24+XG5cdFx0XHRcdDwvUHJvcGVydHlWYWx1ZT5cblx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHQ8L0Fubm90YXRpb24+XG5cdFx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLkxhYmVsXCIgU3RyaW5nPVwiQWNjb3VudCBJRFwiLz5cblx0XHRcdDwvQW5ub3RhdGlvbnM+XG5cdFx0XHQ8QW5ub3RhdGlvbnMgVGFyZ2V0PVwic2FwLmZlLmNvcmUuU2VydmljZS5Sb290RW50aXR5L3ZhbHVlSGVscEZpZWxkN18yXCI+XG5cdFx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLkxhYmVsXCIgU3RyaW5nPVwiQWNjb3VudCBGdWxsIE5hbWVcIi8+XG5cdFx0PC9Bbm5vdGF0aW9ucz5cblx0XHQ8QW5ub3RhdGlvbnMgVGFyZ2V0PVwic2FwLmZlLmNvcmUuU2VydmljZS5Sb290RW50aXR5L3ZhbHVlSGVscEZpZWxkN18zXCI+XG5cdFx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlZhbHVlTGlzdEZvclZhbGlkYXRpb25cIiBTdHJpbmc9XCJcIi8+XG5cdFx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlZhbHVlTGlzdFwiPlxuXHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0VHlwZVwiPlxuXHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkxhYmVsXCIgU3RyaW5nPVwiQnVzaW5lc3MgUGFydG5lciBBZGRyZXNzXCIvPlxuXHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkNvbGxlY3Rpb25QYXRoXCIgU3RyaW5nPVwiQnVzaW5lc3NQYXJ0bmVyQWRkcmVzc1wiLz5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJQYXJhbWV0ZXJzXCI+XG5cdFx0XHRcdFx0PENvbGxlY3Rpb24+XG5cdFx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0XCI+XG5cdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkxvY2FsRGF0YVByb3BlcnR5XCIgUHJvcGVydHlQYXRoPVwidmFsdWVIZWxwRmllbGQ3XzNcIi8+XG5cdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiQnVzaW5lc3NQYXJ0bmVyXCIvPlxuXHRcdFx0XHRcdFx0PEFubm90YXRpb24gVGVybT1cIlVJLkltcG9ydGFuY2VcIiBFbnVtTWVtYmVyPVwiVUkuSW1wb3J0YW5jZVR5cGUvSGlnaFwiLz5cblx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW5cIj5cblx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiTG9jYWxEYXRhUHJvcGVydHlcIiBQcm9wZXJ0eVBhdGg9XCJ2YWx1ZUhlbHBGaWVsZDdfMVwiLz5cblx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVmFsdWVMaXN0UHJvcGVydHlcIiBTdHJpbmc9XCJBY2NvdW50XCIvPlxuXHRcdFx0XHRcdDwvUmVjb3JkPlxuXHRcdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seVwiPlxuXHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIkNpdHlOYW1lXCIvPlxuXHRcdFx0XHRcdFx0PEFubm90YXRpb24gVGVybT1cIlVJLkltcG9ydGFuY2VcIiBFbnVtTWVtYmVyPVwiVUkuSW1wb3J0YW5jZVR5cGUvSGlnaFwiLz5cblx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHQ8L0NvbGxlY3Rpb24+XG5cdFx0XHRcdDwvUHJvcGVydHlWYWx1ZT5cblx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHQ8L0Fubm90YXRpb24+XG5cdFx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLkxhYmVsXCIgU3RyaW5nPVwiQnVzaW5lc3MgUGFydG5lclwiLz5cblx0XHQ8L0Fubm90YXRpb25zPlxuXHRcdDxBbm5vdGF0aW9ucyBUYXJnZXQ9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLlJvb3RFbnRpdHkvdmFsdWVIZWxwRmllbGQ3XzRcIj5cblx0XHRcdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uVGV4dFwiIFBhdGg9XCJfUGFydG5lckZ1bmN0aW9uL1BhcnRuZXJGdW5jdGlvbk5hbWVcIj5cblx0XHRcdFx0PEFubm90YXRpb24gVGVybT1cIlVJLlRleHRBcnJhbmdlbWVudFwiIEVudW1NZW1iZXI9XCJVSS5UZXh0QXJyYW5nZW1lbnRUeXBlL1RleHRPbmx5XCIvPlxuXHRcdFx0PC9Bbm5vdGF0aW9uPlxuXHRcdFx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5WYWx1ZUxpc3RcIj5cblx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFR5cGVcIj5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJMYWJlbFwiIFN0cmluZz1cIlBhcnRuZXIgRnVuY3Rpb25cIi8+XG5cdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiQ29sbGVjdGlvblBhdGhcIiBTdHJpbmc9XCJBY2NCcFwiLz5cblx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJQYXJhbWV0ZXJzXCI+XG5cdFx0XHRcdFx0PENvbGxlY3Rpb24+XG5cdFx0XHRcdFx0PFJlY29yZCBUeXBlPVwiQ29tbW9uLlZhbHVlTGlzdFBhcmFtZXRlckluT3V0XCI+XG5cdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIkxvY2FsRGF0YVByb3BlcnR5XCIgUHJvcGVydHlQYXRoPVwidmFsdWVIZWxwRmllbGQ3XzRcIi8+XG5cdFx0XHRcdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlZhbHVlTGlzdFByb3BlcnR5XCIgU3RyaW5nPVwiUGFydG5lckZ1bmN0aW9uXCIvPlxuXHRcdFx0XHRcdFx0PEFubm90YXRpb24gVGVybT1cIlVJLkltcG9ydGFuY2VcIiBFbnVtTWVtYmVyPVwiVUkuSW1wb3J0YW5jZVR5cGUvSGlnaFwiLz5cblx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW5cIj5cblx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiTG9jYWxEYXRhUHJvcGVydHlcIiBQcm9wZXJ0eVBhdGg9XCJ2YWx1ZUhlbHBGaWVsZDdfMVwiLz5cblx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVmFsdWVMaXN0UHJvcGVydHlcIiBTdHJpbmc9XCJBY2NvdW50XCIvPlxuXHRcdFx0XHRcdFx0PEFubm90YXRpb24gVGVybT1cIlVJLkltcG9ydGFuY2VcIiBFbnVtTWVtYmVyPVwiVUkuSW1wb3J0YW5jZVR5cGUvSGlnaFwiLz5cblx0XHRcdFx0XHQ8L1JlY29yZD5cblx0XHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uVmFsdWVMaXN0UGFyYW1ldGVySW5PdXRcIj5cblx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiTG9jYWxEYXRhUHJvcGVydHlcIiBQcm9wZXJ0eVBhdGg9XCJ2YWx1ZUhlbHBGaWVsZDdfM1wiLz5cblx0XHRcdFx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVmFsdWVMaXN0UHJvcGVydHlcIiBTdHJpbmc9XCJCdXNpbmVzc1BhcnRuZXJcIi8+XG5cdFx0XHRcdFx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiVUkuSW1wb3J0YW5jZVwiIEVudW1NZW1iZXI9XCJVSS5JbXBvcnRhbmNlVHlwZS9IaWdoXCIvPlxuXHRcdFx0XHRcdDwvUmVjb3JkPlxuXHRcdFx0XHRcdDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5WYWx1ZUxpc3RQYXJhbWV0ZXJEaXNwbGF5T25seVwiPlxuXHRcdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJWYWx1ZUxpc3RQcm9wZXJ0eVwiIFN0cmluZz1cIl9QYXJ0bmVyRnVuY3Rpb24vUGFydG5lckZ1bmN0aW9uTmFtZVwiLz5cblx0XHRcdFx0XHRcdDxBbm5vdGF0aW9uIFRlcm09XCJVSS5JbXBvcnRhbmNlXCIgRW51bU1lbWJlcj1cIlVJLkltcG9ydGFuY2VUeXBlL0hpZ2hcIi8+XG5cdFx0XHRcdFx0PC9SZWNvcmQ+XG5cdFx0XHRcdFx0PC9Db2xsZWN0aW9uPlxuXHRcdFx0XHQ8L1Byb3BlcnR5VmFsdWU+XG5cdFx0XHRcdDwvUmVjb3JkPlxuXHRcdFx0PC9Bbm5vdGF0aW9uPlxuXHRcdFx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5MYWJlbFwiIFN0cmluZz1cIlBhcnRuZXIgRnVuY3Rpb25cIi8+XG5cdFx0PC9Bbm5vdGF0aW9ucz5cblxuXHRcdGAuc2xpY2UoMiwgLTIpXG5cdFx0fVxuXHR9XG5dO1xuXG5leHBvcnQgZGVmYXVsdCBQYWdlQ29udHJvbGxlci5leHRlbmQoXCJzYXAuZmUuY29yZS5mcG1FeHBsb3Jlci5ndWlkYW5jZVZhbHVlSGVscC5FbnRyeVBhZ2VcIiwge1xuXHRvbkluaXQ6IGZ1bmN0aW9uICh0aGlzOiBQYWdlQ29udHJvbGxlcikge1xuXHRcdFBhZ2VDb250cm9sbGVyLnByb3RvdHlwZS5vbkluaXQuYXBwbHkodGhpcyk7XG5cdFx0Y29uc3QgdWlNb2RlbDogSlNPTk1vZGVsID0gbmV3IEpTT05Nb2RlbCh7IGlzRWRpdGFibGU6IHRydWUgfSk7XG5cdFx0dGhpcy5nZXRWaWV3KCkuc2V0TW9kZWwodWlNb2RlbCwgXCJ1aVwiKTtcblx0XHRmb3IgKGNvbnN0IG9TbmlwcGV0IG9mIENPREVTTklQUEVUUykge1xuXHRcdFx0Y29uc3Qgb0VkaXRvcjogQ29kZUVkaXRvciA9IHRoaXMuYnlJZChvU25pcHBldC5pZCkgYXMgQ29kZUVkaXRvcjtcblx0XHRcdG9FZGl0b3Iuc2V0VmFsdWUob1NuaXBwZXQuY29kZS5jZHMpO1xuXHRcdFx0b0VkaXRvci5zZXRNYXhMaW5lcygyMCk7XG5cdFx0fVxuXHR9LFxuXG5cdG9uU2VsZWN0VGFiOiBmdW5jdGlvbiAob0V2ZW50OiBhbnkpIHtcblx0XHRjb25zdCBzRmlsdGVySWQgPSBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwic2VsZWN0ZWRLZXlcIik7IC8vZS5nLiBjb2RlVkhGaXhlZFZhbHVlc0hlbHBTb3VyY2VDRFNcblx0XHRjb25zdCBjb2RlRWRpdG9ySWQgPSBzRmlsdGVySWQuc3Vic3RyKDAsIHNGaWx0ZXJJZC5sZW5ndGggLSAzKTsgLy9lLmcuIGNvZGVWYWx1ZUhlbHBpbmdsZVNvdXJjZVxuXHRcdGNvbnN0IHNuaXBwZXQgPSBzRmlsdGVySWQuc3Vic3RyKHNGaWx0ZXJJZC5sZW5ndGggLSAzKS50b0xvd2VyQ2FzZSgpIGFzIGtleW9mIHNuaXBwZXRUeXBlOyAvL2UuZy4gY2RzIG9yIHhtbFxuXHRcdGNvbnN0IG9FZGl0b3IgPSB0aGlzLmJ5SWQoY29kZUVkaXRvcklkKSBhcyBDb2RlRWRpdG9yO1xuXHRcdC8vYWNjZXNzIGNvZGUgc25pcHBldCBieSB0eXBlLCBhbmQgc2V0IGVkaXRvciB0eXBlIGFjY29yZGluZ2x5XG5cdFx0b0VkaXRvci5zZXRWYWx1ZShDT0RFU05JUFBFVFMuZmluZCgoeCkgPT4geC5pZCA9PT0gY29kZUVkaXRvcklkKT8uY29kZVtzbmlwcGV0XSk/LnNldFR5cGUoc25pcHBldCAhPSBcImNkc1wiID8gc25pcHBldCA6IFwicmVkXCIpO1xuXHR9XG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQU1BLE1BQU1BLFlBQWdDLEdBQUcsQ0FDeEM7RUFDQTtJQUNDQyxFQUFFLEVBQUUseUNBQXlDO0lBQzdDQyxJQUFJLEVBQUU7TUFDTEMsR0FBRyxFQUFFLFNBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLENBQUNDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7TUFBRTs7TUFFZEMsR0FBRyxFQUFFO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLENBQUNELEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1o7RUFDRCxDQUFDLEVBQ0Q7RUFDQTtJQUNDSCxFQUFFLEVBQUUsZ0NBQWdDO0lBQ3BDQyxJQUFJLEVBQUU7TUFDTEMsR0FBRyxFQUFFLFNBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLENBQUNDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7TUFBRTs7TUFFZEMsR0FBRyxFQUFFO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxDQUFDRCxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNaO0VBQ0QsQ0FBQyxFQUNEO0VBQ0E7SUFDQ0gsRUFBRSxFQUFFLHdCQUF3QjtJQUM1QkMsSUFBSSxFQUFFO01BQ0xDLEdBQUcsRUFBRSxTQUFVO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsQ0FBQ0MsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUFFOztNQUVkQyxHQUFHLEVBQUU7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLENBQUNELEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1o7RUFDRCxDQUFDLEVBQ0Q7RUFDQTtJQUNDSCxFQUFFLEVBQUUsOEJBQThCO0lBQ2xDQyxJQUFJLEVBQUU7TUFDTEMsR0FBRyxFQUFFLFNBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLENBQUNDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7TUFBRTs7TUFFZEMsR0FBRyxFQUFFO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLENBQUNELEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1o7RUFDRCxDQUFDLEVBQ0Q7RUFDQTtJQUNDSCxFQUFFLEVBQUUsd0JBQXdCO0lBQzVCQyxJQUFJLEVBQUU7TUFDTEMsR0FBRyxFQUFFLFNBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRyxDQUFDQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQUU7O01BRWZDLEdBQUcsRUFBRTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHLENBQUNELEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2I7RUFDRCxDQUFDLEVBQ0Q7RUFDQTtJQUNDSCxFQUFFLEVBQUUsK0JBQStCO0lBQ25DQyxJQUFJLEVBQUU7TUFDTEMsR0FBRyxFQUFFLFNBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRyxDQUFDQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQUU7O01BRWZDLEdBQUcsRUFBRTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHLENBQUNELEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2I7RUFDRCxDQUFDLEVBQ0Q7RUFDQTtJQUNDSCxFQUFFLEVBQUUsMkJBQTJCO0lBQy9CQyxJQUFJLEVBQUU7TUFDTEMsR0FBRyxFQUFFLFNBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUcsQ0FBQ0MsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUFFOztNQUVmQyxHQUFHLEVBQUU7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRyxDQUFDRCxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNiO0VBQ0QsQ0FBQyxDQUNEO0VBQUMsT0FFYUUsY0FBYyxDQUFDQyxNQUFNLENBQUMscURBQXFELEVBQUU7SUFDM0ZDLE1BQU0sRUFBRSxTQUFBQSxDQUFBLEVBQWdDO01BQ3ZDRixjQUFjLENBQUNHLFNBQVMsQ0FBQ0QsTUFBTSxDQUFDRSxLQUFLLENBQUMsSUFBSSxDQUFDO01BQzNDLE1BQU1DLE9BQWtCLEdBQUcsSUFBSUMsU0FBUyxDQUFDO1FBQUVDLFVBQVUsRUFBRTtNQUFLLENBQUMsQ0FBQztNQUM5RCxJQUFJLENBQUNDLE9BQU8sQ0FBQyxDQUFDLENBQUNDLFFBQVEsQ0FBQ0osT0FBTyxFQUFFLElBQUksQ0FBQztNQUN0QyxLQUFLLE1BQU1LLFFBQVEsSUFBSWhCLFlBQVksRUFBRTtRQUNwQyxNQUFNaUIsT0FBbUIsR0FBRyxJQUFJLENBQUNDLElBQUksQ0FBQ0YsUUFBUSxDQUFDZixFQUFFLENBQWU7UUFDaEVnQixPQUFPLENBQUNFLFFBQVEsQ0FBQ0gsUUFBUSxDQUFDZCxJQUFJLENBQUNDLEdBQUcsQ0FBQztRQUNuQ2MsT0FBTyxDQUFDRyxXQUFXLENBQUMsRUFBRSxDQUFDO01BQ3hCO0lBQ0QsQ0FBQztJQUVEQyxXQUFXLEVBQUUsU0FBQUEsQ0FBVUMsTUFBVyxFQUFFO01BQ25DLE1BQU1DLFNBQVMsR0FBR0QsTUFBTSxDQUFDRSxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztNQUN0RCxNQUFNQyxZQUFZLEdBQUdGLFNBQVMsQ0FBQ0csTUFBTSxDQUFDLENBQUMsRUFBRUgsU0FBUyxDQUFDSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNoRSxNQUFNQyxPQUFPLEdBQUdMLFNBQVMsQ0FBQ0csTUFBTSxDQUFDSCxTQUFTLENBQUNJLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQ0UsV0FBVyxDQUFDLENBQXNCLENBQUMsQ0FBQztNQUMzRixNQUFNWixPQUFPLEdBQUcsSUFBSSxDQUFDQyxJQUFJLENBQUNPLFlBQVksQ0FBZTtNQUNyRDtNQUNBUixPQUFPLENBQUNFLFFBQVEsQ0FBQ25CLFlBQVksQ0FBQzhCLElBQUksQ0FBRUMsQ0FBQyxJQUFLQSxDQUFDLENBQUM5QixFQUFFLEtBQUt3QixZQUFZLENBQUMsRUFBRXZCLElBQUksQ0FBQzBCLE9BQU8sQ0FBQyxDQUFDLEVBQUVJLE9BQU8sQ0FBQ0osT0FBTyxJQUFJLEtBQUssR0FBR0EsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUM5SDtFQUNELENBQUMsQ0FBQztBQUFBIiwiaWdub3JlTGlzdCI6W119