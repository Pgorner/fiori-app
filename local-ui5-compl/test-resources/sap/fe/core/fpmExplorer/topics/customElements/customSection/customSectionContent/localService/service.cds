service Service {
  @odata.draft.enabled
  entity RootEntity {
    key ID                     : Integer  @title          : 'Identifier';
        TitleProperty          : String   @title          : 'Title';
        DescriptionProperty    : String   @title          : 'Description';
        NameProperty           : String   @title          : 'Name';
        StandardProperty       : String   @title          : 'Information'  @UI.MultiLineText;
        dateTimeOffsetVariable : DateTime @Common.Timezone: 'Europe/London';
        items                  : Composition of many ChildEntity
                                   on items.Parent = $self;
  }

  entity ChildEntity {
    key ID                                  : Integer       @title: 'Item Identifier';
        StringProperty                      : String        @title: 'String';
        IntegerProperty                     : Integer       @title: 'Integer';
        NumberProperty                      : Decimal(4, 2) @title: 'Number';
        BooleanProperty                     : Boolean       @title: 'Boolean';
        DateProperty                        : Date          @title: 'Date';
        TimeProperty                        : Time          @title: 'Time';
        PropertyWithUnit                    : Integer64     @title: 'With Unit'      @Measures.Unit       : Unit;
        PropertyWithCurrency                : Integer64     @title: 'With Currency'  @Measures.ISOCurrency: Currency;
        Unit                                : String        @title: 'UoM';
        Currency                            : String        @title: 'Currency';
        TextOnlyProperty                    : String        @title: 'Text Only Description';
        TextLastProperty                    : String        @title: 'Text Last Description';
        TextFirstProperty                   : String        @title: 'Text First Description';
        TextSeparateProperty                : String        @title: 'Text Separate Description';
        TextArrangementTextOnlyProperty     : String        @title: 'Text Only';
        TextArrangementTextLastProperty     : String        @title: 'Text Last';
        TextArrangementTextFirstProperty    : String        @title: 'Text First';
        TextArrangementTextSeparateProperty : String        @title: 'Text Separate';
        PropertyWithValueHelp               : String        @title: 'With Value Help';
        Parent                              : Association to RootEntity;
  }

  entity ValueHelpEntity {
    key KeyProp     : String(1)  @title: 'Value Help Key';

        @Core.Immutable
        Description : String(20) @title: 'Value Help Description';
  }

  entity ValueHelpCurrencyEntity {
    key Currency    : String(3)  @title: 'Currency Key';

        @Core.Immutable
        Description : String(20) @title: 'Currency Name';
  }

  annotate RootEntity with
  @(
    UI                                       : {
      HeaderInfo                    : {
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
      FieldGroup #GeneralInformation: {Data: [{
        $Type: 'UI.DataField',
        Value: StandardProperty
      }]},
      Facets                        : [{
        $Type : 'UI.ReferenceFacet',
        Label : 'Standard Section',
        ID    : 'StandardSection',
        Target: '@UI.FieldGroup#GeneralInformation'
      }]
    },

    Capabilities.DeleteRestrictions.Deletable: false
  );

  annotate ChildEntity with @(UI: {
    HeaderInfo    : {
      TypeName      : 'Child Entity',
      TypeNamePlural: 'Child Entities',
      Title         : {
        $Type: 'UI.DataField',
        Value: ID
      }
    },

    Facets        : [{
      $Type            : 'UI.ReferenceFacet',
      Label            : 'Details',
      Target           : '@UI.Identification',
      ![@UI.Importance]: #High
    }],


    Identification: [

      {
        $Type            : 'UI.DataField',
        Value            : BooleanProperty,
        ![@UI.Importance]: #High
      },
      {
        $Type            : 'UI.DataField',
        Value            : TextArrangementTextFirstProperty,
        ![@UI.Importance]: #High
      },
      {
        $Type            : 'UI.DataField',
        Value            : PropertyWithValueHelp,
        ![@UI.Importance]: #High
      },
      {
        $Type            : 'UI.DataField',
        Value            : PropertyWithCurrency,
        ![@UI.Importance]: #High
      }
    ],

    LineItem      : [
      {Value: ID},
      {Value: BooleanProperty},
      {Value: TextArrangementTextFirstProperty},
      {Value: PropertyWithValueHelp},
      {Value: PropertyWithCurrency}
    ]
  }) {
    TextArrangementTextOnlyProperty     @Common: {
      Text           : TextOnlyProperty,
      TextArrangement: #TextOnly
    };
    TextArrangementTextLastProperty     @Common: {
      Text           : TextLastProperty,
      TextArrangement: #TextLast
    };
    TextArrangementTextFirstProperty    @Common: {
      Text           : TextFirstProperty,
      TextArrangement: #TextFirst
    };
    TextArrangementTextSeparateProperty @Common: {
      Text           : TextSeparateProperty,
      TextArrangement: #TextSeparate
    };
    PropertyWithValueHelp               @(Common: {ValueList: {
      Label         : 'Value with Value Help',
      CollectionPath: 'ValueHelpEntity',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: PropertyWithValueHelp,
          ValueListProperty: 'KeyProp'
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'Description'
        }
      ]
    }});
    Currency                            @(Common: {
      ValueListWithFixedValues,
      ValueList: {
        Label         : 'Currency Value Help',
        CollectionPath: 'ValueHelpCurrencyEntity',
        Parameters    : [
          {
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: Currency,
            ValueListProperty: 'Currency'
          },
          {
            $Type            : 'Common.ValueListParameterDisplayOnly',
            ValueListProperty: 'Description'
          }
        ]
      }
    });
  };

  annotate ValueHelpEntity with {
    KeyProp @(Common: {
      Text           : Description,
      TextArrangement: #TextFirst
    },

    );
  };
}
