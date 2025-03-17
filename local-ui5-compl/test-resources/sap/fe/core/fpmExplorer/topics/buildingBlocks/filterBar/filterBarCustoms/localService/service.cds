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
        RatingIndicator                     : Integer;
        RatingOperator                      : Integer;
        RatingRange                         : Integer;
        MultiValueRating                    : Integer;
        RatingChoices                       : Integer;
        ChildID                             : String;
        _OneToOne                           : Association to ChildEntity
                                                on _OneToOne.ID = ChildID;
        _OneToMulti                         : Composition of many MultiChildEntity
                                                on _OneToMulti.ownerID = ID;
  }

  annotate RootEntity with @(
    UI                                        : {
      SelectionFields #SF1  : [
        StringProperty,
        IntegerProperty,
        NumberProperty
      ],
      SelectionFields       : [
        StringProperty,
        IntegerProperty,
        NumberProperty,
        DateProperty,
        TimeProperty,
        PropertyWithUnit,
        PropertyWithCurrency,
        PropertyWithValueHelp
      ],
      DataPoint #Criticality: {
        Value        : Criticality,
        TargetValue  : 5.0,
        Title        : 'Criticality',
        Visualization: #Number
      },
    },
    Capabilities.SearchRestrictions.Searchable: true
  );

  entity ChildEntity {
    key ID          : String(1)  @(
          Common: {
            Text           : Description,
            TextArrangement: #TextFirst
          },
          title : 'Child ID'
        );
        ChildName   : String(20) @(Common: {Label: 'Child Name'});
        Description : String(20) @(Common: {Label: 'Child Description'});
        owner       : Association to RootEntity
                        on owner.ChildID = ID;
  }

  entity MultiChildEntity {
    key ID             : String(1)  @(
          Common: {
            Text           : Description,
            TextArrangement: #TextFirst
          },
          title : 'Child ID'
        );
        MultiChildName : String(20) @(Common: {Label: 'Multi Child Name'});
        Description    : String(20) @(Common: {Label: 'Child Description'});
        ownerID        : Integer    @Common.Label: 'Owner ID';
        owner          : Association to RootEntity
                           on owner.ID = ownerID;
  }

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
