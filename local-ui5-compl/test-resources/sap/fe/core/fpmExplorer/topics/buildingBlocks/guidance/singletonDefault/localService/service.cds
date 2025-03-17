service Service {
  @odata.singleton
  entity User {
    Name    : String @Common.Label: 'Name';
    Friends : Association to many Friend;
  }


  entity ChildEntity {
    key ID    : String;
        name  : String @Common: {ValueList: {
          Label         : 'Value Help of name property',
          CollectionPath: 'NameValueHelpEntity',
          Parameters    : [
            {
              $Type            : 'Common.ValueListParameterDisplayOnly',
              ValueListProperty: 'Child_ID'
            },
            {
              $Type            : 'Common.ValueListParameterInOut',
              LocalDataProperty: name,
              ValueListProperty: 'Child_Name'
            }
          ]
        }};
        owner : Association to SingletonPropertyFields;
  }

  entity NameValueHelpEntity {
    key Child_ID          : String @(Common: {
          Label: 'Value Help ID',
          Text : Child_Name
        });
        Child_Name        : String @(
          Core.Immutable: true,
          Common.Label  : 'Value Help Name'
        );
        Child_Description : String @(
          Core.Immutable: true,
          Common.Label  : 'Value Help Description'
        );
  }

  @odata.singleton
  entity SingletonPropertyFields {
    StringProperty       : String        @Common.Label: 'String Property';
    IntegerProperty      : Integer       @Common      : {
      Label       : 'Integer Property',
      FieldControl: #ReadOnly
    };
    NumberProperty       : Decimal(4, 2) @Common      : {
      Label       : 'Number Property',
      FieldControl: #ReadOnly
    };
    BooleanProperty      : Boolean       @Common      : {
      Label       : 'Boolean Property',
      FieldControl: #ReadOnly
    };
    DateProperty         : Date          @Common      : {
      Label       : 'Date Property',
      FieldControl: #ReadOnly
    };
    TimeProperty         : Time          @Common.Label: 'Time Property';
    PropertyWithUnit     : Integer64     @Common.Label: 'Property With Unit'      @Measures.Unit       : {$edmJson: {$Path: '/SingletonPropertyFields/Unit'}};
    PropertyWithCurrency : Integer64     @Common.Label: 'Property With Currency'  @Measures.ISOCurrency: {$edmJson: {$Path: '/SingletonPropertyFields/Currency'}};
    Unit                 : String        @(UI.Hidden: {$edmJson: {$Path: '/SingletonPropertyFields/BooleanProperty'}});
    Currency             : String;
    TextProperty         : String;
    VHproperty           : String        @Common      : {
      Label    : 'Value Help Property',
      ValueList: {
        Label         : 'Test Value Help',
        CollectionPath: 'RootEntity',
        Parameters    : [{
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: VHproperty,
          ValueListProperty: 'StringProperty'
        }]
      }
    };
    _toChildren          : Association to many ChildEntity;
  // _toChildren : Composition of many ChildEntity;
  }

  annotate SingletonPropertyFields with @UI: {FieldGroup #GeneralInformation: {
    Label: 'General Information',
    Data : [
      {Value: IntegerProperty},
      {Value: NumberProperty},
      {Value: BooleanProperty},
      {Value: DateProperty}
    ]
  }};

  annotate SingletonPropertyFields with @(UI: {LineItem: {$value: [
    {Value: ID},
    {Value: StringProperty},
    {Value: IntegerProperty},
    {Value: NumberProperty},
    {Value: BooleanProperty},
    {Value: DateProperty},
    {Value: TimeProperty},
    {Value: PropertyWithUnit},
    {Value: PropertyWithCurrency},
    {Value: Unit},
    {Value: Currency},
    {Value: TextProperty}
  ]}});

  entity Friend {
    key FriendID : Integer @Common.Label: 'ID';
        Name     : String  @Common.Label: 'Name';
  }

  annotate Friend with @(UI: {LineItem: {$value: [
    {Value: FriendID},
    {Value: Name}
  ]}});

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
        TextProperty                        : String;
        TextArrangementTextOnlyProperty     : String        @Common      : {
          Text           : TextProperty,
          TextArrangement: #TextOnly
        };
        TextArrangementTextLastProperty     : String        @Common      : {
          Text           : TextProperty,
          TextArrangement: #TextLast
        };
        TextArrangementTextFirstProperty    : String        @Common      : {
          Text           : TextProperty,
          TextArrangement: #TextFirst
        };
        TextArrangementTextSeparateProperty : String        @Common      : {
          Text           : TextProperty,
          TextArrangement: #TextSeparate
        };
        PropertyWithValueHelp               : String        @(Common: {
          Label    : 'Property with Value Help',
          ValueList: {
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
          }
        });
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
      {Value: TextArrangementTextFirstProperty},
      {Value: PropertyWithValueHelp}
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
    UI                   : {HeaderInfo: {Title: {TypeImageUrl: 'sap-icon://add-contact'}}}
  );

  entity ValueHelpEntity {
    key KeyProp     : String(1)  @(
          Common: {
            Text           : Description,
            TextArrangement: #TextFirst
          },
          title : 'Value Help Key'
        );
        Description : String(20) @(
          Core.Immutable: true,
          Common        : {Label: 'Value Help Description'}
        );
  }
}
