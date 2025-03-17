service Service {
  @odata.draft.enabled
  entity RootEntity {
    key ID                      : Integer       @Common.Label: 'ID';
        StringProperty          : String        @Common.Label: 'String Property';
        IntegerProperty         : Integer       @Common.Label: 'Integer Property';
        NumberProperty          : Decimal(4, 2) @Common.Label: 'Number Property';
        BooleanProperty         : Boolean       @Common.Label: 'Boolean Property';
        SingleValueDateProperty : Date          @Common.Label: 'Single Value Date Property';
        DateProperty            : Date          @Common.Label: 'Date Property';
        TimeProperty            : Time          @Common.Label: 'Time Property';
  }

  annotate RootEntity with @(
    UI          : {
      SelectionFields : [
        StringProperty,
        IntegerProperty,
        DateProperty,
        SingleValueDateProperty
      ],

      SelectionVariant: {
        Text         : 'String Property',
        SelectOptions: [
          {
            PropertyName: StringProperty,
            Ranges      : [{
              Sign  : #I,
              Option: #EQ,
              Low   : 'abc'
            }]
          },
          {
            PropertyName: IntegerProperty,
            Ranges      : [{
              Sign  : #I,
              Option: #EQ,
              Low   : 1
            }]
          },
          {
            PropertyName: DateProperty,
            Ranges      : [{
              Sign  : #I,
              Option: #EQ,
              Low   : '2022-02-01'
            }]
          },
          {
            PropertyName: SingleValueDateProperty,
            Ranges      : [{
              Sign  : #I,
              Option: #EQ,
              Low   : '2021-05-12'
            }]
          }
        ]
      }
    },
    Capabilities: {
      SearchRestrictions: {Searchable: true},
      FilterRestrictions: {FilterExpressionRestrictions: [
        {
          Property          : 'DateProperty',
          AllowedExpressions: 'SingleRange'
        },
        {
          Property          : 'SingleValueDateProperty',
          AllowedExpressions: 'SingleValue'
        }
      ]}
    }
  );

}
