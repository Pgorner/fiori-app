service Service {
  entity RootEntity {
    key KeyProperty                   : Integer;
        ChildID                       : String  @(Common: {
          Text           : _NavProp1.Description,
          TextArrangement: #TextFirst
        });
        PropertyWithValueHelpRootText : String;
        PropertyWithValueHelpRoot     : Integer @(Common: {
          Text           : PropertyWithValueHelpRootText,
          TextArrangement: #TextFirst,
          ValueList      : {
            Label         : 'Value with Value Help',
            CollectionPath: 'ValueHelpEntity',
            Parameters    : [
              {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: PropertyWithValueHelpRoot,
                ValueListProperty: 'KeyProp'
              },
              {
                $Type            : 'Common.ValueListParameterOut',
                ValueListProperty: 'Description',
                LocalDataProperty: PropertyWithValueHelpRootText
              }
            ]
          }
        });
        MinimumDate                   : Date;
        MaximumDate                   : Date;
        _NavProp1                     : Association to NavProp1
                                          on _NavProp1.ID = ChildID;
  }

  entity ValueHelpEntity {
    key KeyProp     : Integer    @(
          Common: {
            Text           : Description,
            TextArrangement: #TextLast
          },
          title : 'Value Help Key'
        );
        Description : String(20) @(
          Core.Immutable: true,
          title         : 'Value Help Description'
        );
  }

  entity NavProp1 {
    key ID                                  : String(1)  @(Common: {
          Label          : 'Child ID',
          Text           : Description,
          TextArrangement: #TextFirst
        });

        Description                         : String(20) @(Common.Label: 'Child Description');
        PropertyWithValueHelpNav1Text       : String;
        PropertyWithValueHelpNav1           : Integer    @(Common: {
          Text           : PropertyWithValueHelpNav1Text,
          TextArrangement: #TextFirst,
          ValueList      : {
            Label         : 'Value with Value Help',
            CollectionPath: 'ValueHelpEntity',
            Parameters    : [
              {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: PropertyWithValueHelpNav1,
                ValueListProperty: 'KeyProp'
              },
              {
                $Type            : 'Common.ValueListParameterOut',
                LocalDataProperty: PropertyWithValueHelpNav1Text,
                ValueListProperty: 'Description'
              }
            ]
          }
        });

        StringProperty                      : String;
        IntegerProperty                     : Integer;
        NumberProperty                      : Decimal(4, 2);
        BooleanProperty                     : Boolean;
        MinimumDate                         : Date;
        MaximumDate                         : Date;
        DateProperty                        : Date       @(Validation: {
          Minimum: MinimumDate,
          Maximum: {$edmJson: {$Date: '2024-08-22'}}
        });
        TimeProperty                        : Time;
        PropertyWithUnit                    : Integer64  @Measures.Unit       : Unit;
        PropertyWithCurrency                : Integer64  @Measures.ISOCurrency: Currency;
        Unit                                : String;
        Currency                            : String;
        TextPropertyForTextOnly             : String;
        TextPropertyForTextLast             : String;
        TextPropertyForTextFirst            : String;
        TextPropertyForTextSeparate         : String;

        TextArrangementTextOnlyProperty     : String     @Common              : {
          Text           : TextPropertyForTextOnly,
          TextArrangement: #TextOnly
        };
        TextArrangementTextLastProperty     : String     @Common              : {
          Text           : TextPropertyForTextLast,
          TextArrangement: #TextLast
        };
        TextArrangementTextFirstProperty    : String     @Common              : {
          Text           : TextPropertyForTextFirst,
          TextArrangement: #TextFirst
        };
        TextArrangementTextSeparateProperty : String     @Common              : {
          Text           : TextPropertyForTextSeparate,
          TextArrangement: #TextSeparate
        };

        SubChildID                          : String;
        _NavProp2                           : Association to NavProp2
                                                on _NavProp2.ID = SubChildID;
  }

  entity NavProp2 {
    key ID                        : String(1)  @(Common: {
          Label          : 'Child ID',
          Text           : Description,
          TextArrangement: #TextFirst
        }, );
        Description               : String(20) @(Common.Label: 'Child Description');
        PropertyWithValueHelpNav2 : Integer    @(Common.ValueList: {
          Label         : 'Value with Value Help',
          CollectionPath: 'ValueHelpEntity',
          Parameters    : [
            {
              $Type            : 'Common.ValueListParameterInOut',
              LocalDataProperty: PropertyWithValueHelpNav2,
              ValueListProperty: 'KeyProp'
            },
            {
              $Type            : 'Common.ValueListParameterDisplayOnly',
              ValueListProperty: 'Description'
            }
          ]
        });
  }
}
