service Service {
  @odata.draft.enabled
  entity RootEntity {
    key ID                                  : Integer       @Common.Label: 'ID';
        StringProperty                      : String        @Common.Label: 'String Property';
        IntegerProperty                     : Integer       @Common.Label: 'Integer Property';
        NumberProperty                      : Decimal(4, 2) @Common.Label: 'Number Property';
        BooleanProperty                     : Boolean       @Common.Label: 'Boolean Property';
        DateProperty                        : Date          @Common.Label: 'Date Property';
        TimeProperty                        : Time          @Common.Label: 'Time Property';
        PropertyWithUnit                    : Integer64     @Common.Label: 'Property With Unit'      @Measures.Unit       : Unit;
        PropertyWithCurrency                : Integer64     @Common.Label: 'Property With Currency'  @Measures.ISOCurrency: Currency;
        Unit                                : String;
        Currency                            : String;
        TextOnlyProperty                    : String        @title       : 'Text Only Description';
        TextLastProperty                    : String        @title       : 'Text Last Description';
        TextFirstProperty                   : String        @title       : 'Text First Description';
        TextSeparateProperty                : String        @title       : 'Text Separate Description';
        TextArrangementTextOnlyProperty     : String        @Common      : {
          Text           : TextOnlyProperty,
          TextArrangement: #TextOnly
        };
        TextArrangementTextLastProperty     : String        @Common      : {
          Text           : TextLastProperty,
          TextArrangement: #TextLast
        };
        TextArrangementTextFirstProperty    : String        @Common      : {
          Text           : TextFirstProperty,
          TextArrangement: #TextFirst
        };
        TextArrangementTextSeparateProperty : String        @Common      : {
          Text           : TextSeparateProperty,
          TextArrangement: #TextSeparate
        };
        Criticality                         : Integer;
        dataFieldForAnnotationContact       : String;
        emailAddress                        : String        @Communication.IsEmailAddress;
        phoneNumber                         : String        @Communication.IsPhoneNumber;
        role                                : String;
        PostalCode                          : String;
        CityName                            : String;
        Country                             : String;
  }

  annotate RootEntity with @(UI: {LineItem: {
    ![@UI.Criticality]: Criticality,
    $value            : [
      {Value: ID},
      {Value: IntegerProperty},
      {Value: NumberProperty},
      {
        $Type : 'UI.DataFieldForAnnotation',
        Target: '@Communication.Contact',
        Label : 'Property With Contact annotation'
      },
      {Value: StringProperty},
      {Value: BooleanProperty},
      {Value: TextArrangementTextFirstProperty}
    ]
  }});

  annotate RootEntity with @(
    Communication.Contact: {
      fn   : dataFieldForAnnotationContact,
      role : role,
      email: [{
        type   : #work,
        address: emailAddress
      }],
      tel  : [{
        type: #fax,
        uri : phoneNumber
      }],
      adr  : [{
        type    : #work,
        code    : PostalCode,
        country : Country,
        locality: CityName
      }]
    },
    UI                   : {
      SelectionFields : [
        BooleanProperty,
        IntegerProperty,
        DateProperty
      ],

      SelectionVariant: {
        Text         : 'String Property',
        SelectOptions: [
          {
            PropertyName: BooleanProperty,
            Ranges      : [{
              Sign  : #I,
              Option: #EQ,
              Low   : false
            }]
          },
          {
            PropertyName: IntegerProperty,
            Ranges      : [{
              Sign  : #I,
              Option: #EQ,
              Low   : 9
            }]
          },
          {
            PropertyName: DateProperty,
            Ranges      : [{
              Sign  : #I,
              Option: #EQ,
              Low   : '2020-12-03'
            }]
          }
        ]
      }
    }
  );
}
