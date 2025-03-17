service Service {
  @Aggregation.CustomAggregate #NumberProperty: 'Edm.Decimal'
  @Aggregation.ApplySupported                 : {
    GroupableProperties   : [StringProperty, ],
    AggregatableProperties: [{Property: NumberProperty}]
  }

  @odata.draft.enabled
  entity RootEntity {
    key ID              : Integer       @Common.Label: 'ID';
        StringProperty  : String        @Common.Label: 'String Property';
        IntegerProperty : Integer       @Common.Label: 'Integer Property';
        NumberProperty  : Decimal(4, 2) @Common.Label: 'Number Property';
        BooleanProperty : Boolean       @Common.Label: 'Boolean Property';
        DateProperty    : Date          @Common.Label: 'Date Property';
        TimeProperty    : Time          @Common.Label: 'Time Property';
        Criticality     : Integer;
        emailAddress    : String        @Communication.IsEmailAddress;
        phoneNumber     : String        @Communication.IsPhoneNumber;
        role            : String;
        PostalCode      : String;
        CityName        : String;
        Country         : String;
  }

  annotate RootEntity with @(UI: {LineItem: {
    ![@UI.Criticality]: Criticality,
    $value            : [
      {Value: ID},
      {Value: IntegerProperty},
      {Value: NumberProperty},
      {Value: StringProperty},
      {Value: BooleanProperty}
    ]
  }});
}
