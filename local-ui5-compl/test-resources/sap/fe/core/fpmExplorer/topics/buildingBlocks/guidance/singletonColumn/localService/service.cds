service Service {
  @odata.singleton
  entity User {
    Name : String @Common.Label: 'Singleton';
  }

  @odata.draft.enabled
  entity RootEntity {
    key ID                   : Integer       @Common.Label: 'ID';
        IntegerProperty      : Integer       @Common.Label: 'Integer Property';
        NumberProperty       : Decimal(4, 2) @Common.Label: 'Number Property';
        _SingletonNavigation : Association to User;
  }

  annotate RootEntity with @(UI: {LineItem: {
    ![@UI.Criticality]: Criticality,
    $value            : [
      {Value: ID},
      {Value: IntegerProperty},
      {Value: NumberProperty},
      {Value: _SingletonNavigation.Name}
    ]
  }});

  annotate RootEntity with @(UI: {SelectionFields #SF2: [
    IntegerProperty,
    NumberProperty,
    _SingletonNavigation.Name
  ]});
}
