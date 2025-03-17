service Service {
  @odata.draft.enabled
  entity RootEntity {
    key ID                                  : Integer       @title: 'ID';
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
        TagStatus                           : String;
        TagText                             : String;
        TextArrangementTextOnlyProperty     : String        @title: 'Text Only';
        TextArrangementTextLastProperty     : String        @title: 'Text Last';
        TextArrangementTextFirstProperty    : String        @title: 'Text First';
        TextArrangementTextSeparateProperty : String        @title: 'Text Separate';
  } actions {
    @(
      Common                         : {SideEffects: {TargetProperties: ['_it/BooleanProperty']}},
      cds.odata.bindingparameter.name: '_it'
    )
    action toggleBoolean();
    action MenuAction1();
    action MenuAction2();
  }

  annotate RootEntity with @(UI: {LineItem: [
    {Value: ID},
    {Value: BooleanProperty},
    {Value: TextArrangementTextFirstProperty},
    {
      $Type : 'UI.DataFieldForAction',
      Label : 'Toolbar Action',
      Action: 'Service.toggleBoolean'
    },
    {
      $Type  : 'UI.DataFieldForActionGroup',
      ID     : 'TableActionGroup',
      Label  : 'Annotation Action Group',
      Actions: [
        {
          $Type : 'UI.DataFieldForAction',
          Label : 'Menu Item 1',
          Action: 'Service.MenuAction1',
        },
        {
          $Type : 'UI.DataFieldForAction',
          Label : 'Menu Item 2',
          Action: 'Service.MenuAction2',
        }
      ]
    },
    {
      $Type : 'UI.DataFieldForAction',
      Label : 'Inline Action',
      Action: 'Service.toggleBoolean',
      Inline: true
    },
    {Value: PropertyWithCurrency},
  ]}) {
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
  };
}
