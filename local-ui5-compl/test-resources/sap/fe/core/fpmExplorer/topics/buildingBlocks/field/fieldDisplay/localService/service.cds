service Service {
  entity RootEntity {
    key ID                                         : Integer;
        StringProperty                             : String;
        IntegerProperty                            : Integer;
        NumberProperty                             : Decimal(4, 2);
        BooleanProperty                            : Boolean;
        DateProperty                               : Date;
        TimeProperty                               : Time;
        PropertyWithUnit                           : Integer @Measures.Unit       : Unit;
        PropertyWithCurrency                       : Integer @Measures.ISOCurrency: Currency;
        Unit                                       : String;
        Currency                                   : String;
        TextProperty                               : String;
        PropertyWithText                           : String  @Common              : {Text: TextProperty};
        PropertyWithTextAndTextArrangementTextOnly : String  @Common              : {
          Text           : TextProperty,
          TextArrangement: #TextOnly
        };
        _OneToOne                                  : Association to one ChildEntity;
  }


  entity ChildEntity {
    key ID          : String @(Common: {
          Label          : 'Child ID',
          Text           : Description,
          TextArrangement: #TextFirst
        });

        Description : String @(
          Core.Immutable: true,
          Common.Label  : 'Child Description'
        );
  }


  annotate RootEntity with @UI: {FieldGroup #Default: {Data: [{
    $Type      : 'UI.DataField',
    Value      : StringProperty,
    Criticality: #Positive
  }]}}
}
