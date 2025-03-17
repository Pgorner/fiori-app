service Service {
  @readonly
  entity RootEntity {
    key ID                  : Integer       @title: 'Identifier';
        TitleProperty       : String        @title: 'Title';
        DescriptionProperty : String        @title: 'Description';
        NameProperty        : String        @title: 'Some Text';
        Rating              : Decimal(4, 2) @title: 'Rating';
  }

  annotate RootEntity with
  @(UI: {
    PresentationVariant       : {Visualizations: ['@UI.LineItem']},
    HeaderInfo                : {
      TypeName      : 'Root Entity',
      TypeNamePlural: 'Root Entities'
    },
    SelectionFields           : [ID],
    DataPoint #Rating         : {
      Value        : Rating,
      TargetValue  : 5.0,
      Title        : 'Rating',
      Visualization: #Rating
    },
    FieldGroup #multipleFields: {
      $Type: 'UI.FieldGroupType',
      Data : [
        {
          $Type: 'UI.DataField',
          Value: TitleProperty,
        },
        {
          $Type : 'UI.DataFieldForAnnotation',
          Target: '@UI.DataPoint#Rating',
        },
      ],
    },
    LineItem                  : [
      {Value: ID},
      {
        $Type : 'UI.DataFieldForAnnotation',
        Target: '@UI.FieldGroup#multipleFields',
        Label : 'Rating'
      }
    ]
  }) {
    @Common: {ValueListMapping: {
      $Type         : 'Common.ValueListMappingType',
      CollectionPath: 'RootEntity',
      Label         : 'Identifier',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: ID,
          ValueListProperty: 'ID',
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'TitleProperty',
        },
      ],
    }, }
    ID;
    NameProperty        @UI.HiddenFilter;
    TitleProperty       @UI.HiddenFilter;
    DescriptionProperty @UI.HiddenFilter;
  };
}
