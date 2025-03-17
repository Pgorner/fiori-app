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
        _OneToOne       : Association to one ChildEntity;
  } actions {
    action boundAction1();
    action boundAction2();
  }

  entity ChildEntity {
    key ID          : String @(Common: {
          Label          : 'Child ID',
          Text           : Description,
          TextArrangement: #TextFirst
        });
        Description : String @Common.Label: 'Child Description';
  }

  annotate RootEntity with @UI: {
    Facets                               : [
      {
        $Type : 'UI.CollectionFacet',
        ID    : 'GeneralInformation',
        Label : 'General Information',
        Facets: [
          {
            $Type               : 'UI.ReferenceFacet',
            Label               : 'First facet',
            Target              : '@UI.FieldGroup#first',
            ![@UI.PartOfPreview]: true
          },
          {
            $Type               : 'UI.ReferenceFacet',
            Label               : 'Second facet',
            Target              : '@UI.FieldGroup#second',
            ![@UI.PartOfPreview]: true
          }
        ]
      },
      {
        $Type : 'UI.CollectionFacet',
        ID    : 'ResponsiveGridTesting',
        Label : 'Responsive Grid Testing',
        Facets: [
          {
            $Type               : 'UI.ReferenceFacet',
            Label               : 'First',
            Target              : '@UI.FieldGroup#GeneralInformationForRGL',
            ![@UI.PartOfPreview]: true
          },
          {
            $Type               : 'UI.ReferenceFacet',
            Label               : 'Second',
            Target              : '@UI.FieldGroup#GeneralInformationForRGL2',
            ![@UI.PartOfPreview]: true
          },
          {
            $Type               : 'UI.ReferenceFacet',
            Label               : 'Third',
            Target              : '@UI.FieldGroup#GeneralInformationForRGL3',
            ![@UI.PartOfPreview]: true
          }
        ]
      },
      {
        $Type : 'UI.ReferenceFacet',
        ID    : 'SubElements',
        Label : 'Sub Elements',
        Target: '@UI.FieldGroup#GeneralInformation',
      }
    ],

    FieldGroup #OtherInformation         : {
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
    FieldGroup #GeneralInformation       : {
      Label: 'General Information',
      Data : [
        {Value: IntegerProperty},
        {Value: NumberProperty},
        {Value: BooleanProperty},
        {Value: StringProperty},

      ]
    },
    FieldGroup #first                    : {
      Label: 'First part',
      Data : [
        {Value: TimeProperty},
        {Value: Currency}
      ]
    },
    FieldGroup #second                   : {
      Label: 'Second part',
      Data : [{Value: TextProperty}]
    },
    FieldGroup #OtherGeneralInformation  : {
      Label: 'Another set of information',
      Data : [
        {Value: IntegerProperty},
        {Value: NumberProperty},
        {Value: BooleanProperty},
        {Value: DateProperty}
      ]
    },
    FieldGroup #GeneralInformationForRGL : {
      Label: 'Grid Layout 1',
      Data : [
        {Value: IntegerProperty},
        {Value: NumberProperty},
        {Value: TimeProperty},
        {Value: BooleanProperty}
      ]
    },
    FieldGroup #GeneralInformationForRGL2: {
      Label: 'Grid Layout 2',
      Data : [
        {Value: NumberProperty},
        {Value: Currency},
        {Value: TimeProperty},
        {Value: BooleanProperty}
      ]
    },
    FieldGroup #GeneralInformationForRGL3: {
      Label: 'Grid Layout 3',
      Data : [
        {Value: DateProperty},
        {Value: StringProperty},
        {Value: TimeProperty},
        {Value: BooleanProperty}
      ]
    }
  };

  annotate ChildEntity with @UI: {FieldGroup #GeneralInformation: {
    Label: 'Associated Entity Information',
    Data : [{Value: ID}]
  }};
}
