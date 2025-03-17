service Service {
  @odata.draft.enabled
  entity RootEntity {
    key ID                       : Integer       @title: 'Identifier';
        TitleProperty            : String        @title: 'Title';
        DescriptionProperty      : String        @title: 'Description';
        LongDescription1Property : String        @title: 'Show Details';
        LongDescription2Property : String        @title: 'Show More';
        NumberProperty           : Decimal(4, 2) @title: 'Number';
        items                    : Composition of many ChildEntity
                                     on items.Parent = $self;
  }

  entity ChildEntity {
    key ID                       : Integer       @title: 'Item Identifier';
        LongDescription2Property : String        @title: 'String';
        IntegerProperty          : Integer       @title: 'Integer';
        NumberProperty           : Decimal(4, 2) @title: 'Number';
        BooleanProperty          : Boolean       @title: 'Boolean';
        DateProperty             : Date          @title: 'Date';
        TimeProperty             : Time          @title: 'Time';
        Parent                   : Association to RootEntity;
  }

  annotate RootEntity with
  @(UI: {
    HeaderInfo                 : {
      TypeName      : 'Root Entity',
      TypeNamePlural: 'Root Entities',
      Title         : {
        $Type: 'UI.DataField',
        Value: TitleProperty
      },
      Description   : {
        $Type: 'UI.DataField',
        Value: DescriptionProperty
      }
    },

    Facets                     : [
      {
        $Type : 'UI.ReferenceFacet',
        ID    : 'ReferenceFacet1',
        Label : 'Reference Facet',
        Target: '@UI.Identification'
      },
      {
        $Type : 'UI.CollectionFacet',
        ID    : 'CollectionFacet2',
        Label : 'Collection Facet',
        Facets: [{
          $Type : 'UI.CollectionFacet',
          ID    : 'CollectionFacet1',
          Label : 'Collection Facet',
          Facets: [
            {
              $Type : 'UI.ReferenceFacet',
              ID    : 'ReferenceFacet2_1',
              Label : 'Reference Facet 2_1',
              Target: '@UI.FieldGroup#FieldGroup2_1_1'
            },
            {
              $Type               : 'UI.ReferenceFacet',
              ID                  : 'ReferenceFacet2_2',
              Label               : 'Reference Facet 2_2',
              Target              : 'items/@com.sap.vocabularies.UI.v1.LineItem',
              ![@UI.PartOfPreview]: false // Facet only shown when Show More button is clicked
            }
          ]
        }]
      }
    ],

    Identification             : [
      {
        $Type            : 'UI.DataField',
        Value            : LongDescription1Property,
        ![@UI.Importance]: #High
      },
      {
        $Type               : 'UI.DataField',
        Value               : NumberProperty,
        ![@UI.PartOfPreview]: false // Field only shown when Show Details button is clicked
      }
    ],

    FieldGroup #FieldGroup2_1_1: {
      Label: 'FieldGroup 2_1_1',
      Data : [{Value: LongDescription2Property}]
    }

  }) {
    LongDescription1Property @UI.MultiLineText: true;
    LongDescription2Property @UI.MultiLineText: true;
  };

  annotate ChildEntity with @(UI: {LineItem: {$value: [
    {Value: ID},
    {Value: LongDescription2Property},
    {Value: IntegerProperty},
    {Value: DateProperty},
    {Value: TimeProperty},
    {Value: BooleanProperty}
  ]}})
}
