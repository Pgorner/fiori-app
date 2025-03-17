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
  };
}
