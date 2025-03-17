service Service {
  @odata.draft.enabled
  @Common.SemanticKey: [ID]
  entity RootEntity {
    key ID                  : Integer       @title: 'Identifier';
        TitleProperty       : String        @title: 'Title';
        DescriptionProperty : String        @title: 'Description';
        NameProperty        : String        @title: 'Some Text';
        NumberProperty      : Decimal(4, 2) @title: 'Number';
        Currency            : String        @title: 'Currency';
        BooleanProperty     : Boolean       @title: 'Boolean';
        Progress            : Decimal(4, 1) @title: 'Progress';
  }

  annotate RootEntity with
  @(UI: {
    HeaderInfo                          : {
      TypeName      : 'Root Entity',
      TypeNamePlural: 'Root Entities',
      TypeImageUrl  : 'sap-icon://alert',
      Title         : {
        $Type: 'UI.DataField',
        Value: TitleProperty
      }
    },
    HeaderFacets                        : [{
      $Type : 'UI.ReferenceFacet',
      ID    : 'HeaderFacetIdentifier1',
      Target: '@UI.FieldGroup#HeaderGeneralInformation'
    }],
    LineItem                            : [
      {Value: ID},
      {Value: TitleProperty},
      {Value: DescriptionProperty},
      {Value: NameProperty},
      {Value: BooleanProperty}
    ],
    Facets                              : [{
      $Type : 'UI.ReferenceFacet',
      ID    : 'FacetIdentifier1',
      Target: '_Child/@UI.LineItem'
    }],
    FieldGroup #HeaderGeneralInformation: {Data: [
      {
        $Type: 'UI.DataField',
        Value: NameProperty
      },
      {
        $Type: 'UI.DataField',
        Value: DescriptionProperty
      },
      {
        $Type: 'UI.DataField',
        Value: BooleanProperty
      },
      {
        $Type: 'UI.DataField',
        Value: HasActiveEntity
      }
    ]}
  });
}
