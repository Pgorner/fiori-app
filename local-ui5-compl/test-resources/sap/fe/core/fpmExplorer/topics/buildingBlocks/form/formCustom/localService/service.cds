service Service {
  entity RootEntity {
    key ID              : Integer       @Common.Label: 'Identifier';
        StringProperty  : String        @Common.Label: 'String Property';
        IntegerProperty : Integer       @Common.Label: 'Integer Property';
        NumberProperty  : Decimal(4, 2) @Common.Label: 'Number Property';
        BooleanProperty : Boolean       @Common.Label: 'Boolean Property';
        DateProperty    : Date          @Common.Label: 'Date Property';
        TimeProperty    : Time          @Common.Label: 'Time Property';
        Currency        : String        @Common.Label: 'Currency';
        TextProperty    : String        @Common.Label: 'Text Property';
  } actions {
    action boundAction1();
    action boundAction2();
  }

  annotate RootEntity with @UI: {
    Facets                        : [
      {
        $Type : 'UI.CollectionFacet',
        ID    : 'GeneralInformation',
        Label : 'General Information',
        Facets: [
          {
            $Type               : 'UI.ReferenceFacet',
            Label               : 'General Information',
            Target              : '@UI.FieldGroup#GeneralInformation',
            ![@UI.PartOfPreview]: true
          },
          {
            $Type               : 'UI.ReferenceFacet',
            Label               : 'Sub Elements',
            Target              : '@UI.FieldGroup#OtherInformation',
            ![@UI.PartOfPreview]: false
          }
        ]
      },
      {
        $Type : 'UI.ReferenceFacet',
        ID    : 'SubElements',
        Label : 'Sub Elements',
        Target: '@UI.FieldGroup#OtherInformation',
      }
    ],
    FieldGroup #OtherInformation  : {
      Label: 'Other Information',
      Data : [
        {Value: StringProperty},
        {
          $Type : 'UI.DataFieldForAction',
          Label : 'Bound Action 1 Inline',
          Action: 'Service.boundAction1',
          Inline: true
        },
        {
          $Type : 'UI.DataFieldForAction',
          Label : 'Bound Action 2',
          Action: 'Service.boundAction2',
          Inline: false
        }
      ]
    },
    FieldGroup #GeneralInformation: {
      Label: 'General Information',
      Data : [
        {Value: IntegerProperty},
        {Value: NumberProperty},
        {Value: BooleanProperty},
        {Value: DateProperty}
      ]
    }
  };
}
