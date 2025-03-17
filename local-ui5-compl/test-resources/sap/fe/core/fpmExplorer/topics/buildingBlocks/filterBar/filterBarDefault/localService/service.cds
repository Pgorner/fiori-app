service Service {
  @odata.draft.enabled
  entity RootEntity {
    key ID                                  : Integer       @Common.Label: 'ID';
        preferredNode                       : String        @(Common: {
          Label    : 'Property with Tree Table Value Help',
          ValueList: {
            CollectionPath              : 'HierarchyEntity',
            Parameters                  : [
              {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: preferredNode,
                ValueListProperty: 'ID',
              },
              {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'name',
              },
            ],
            PresentationVariantQualifier: 'VH',
          }
        });
        StringProperty                      : String        @Common.Label: 'String Property';
        IntegerProperty                     : Integer       @Common.Label: 'Integer Property';
        NumberProperty                      : Decimal(4, 2) @Common.Label: 'Number Property';
        BooleanProperty                     : Boolean       @Common.Label: 'Boolean Property';
        SingleValueDateProperty             : Date          @Common.Label: 'Single Value Date Property';
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
        ChildID                             : String;
        _OneToOne                           : Association to ChildEntity
                                                on _OneToOne.ID = ChildID;
        _OneToMulti                         : Composition of many MultiChildEntity
                                                on _OneToMulti.ownerID = ID;
  }

  @Aggregation.RecursiveHierarchy #NodesHierarchy: {
    NodeProperty            : ID,
    ParentNavigationProperty: Superordinate
  }
  @Hierarchy.RecursiveHierarchy #NodesHierarchy  : {
    ExternalKey           : ID,
    LimitedDescendantCount: LimitedDescendantCount,
    DistanceFromRoot      : DistanceFromRoot,
    DrillState            : DrillState,
    Matched               : Matched,
    MatchedDescendantCount: MatchedDescendantCount,
    LimitedRank           : LimitedRank,
  }
  entity HierarchyEntity {
    key ID                     : String    @(Common: {
          Label: 'ID',
          Text : name
        });
        parent                 : String;
        name                   : String    @(Common: {Label: 'Level name'});
        rootID                 : Integer   @(UI.Hidden: true);
        nodeType               : String    @(Common: {Label: 'Node type'});
        Superordinate          : Association to HierarchyEntity
                                   on Superordinate.ID = parent;
        RootEntity             : Association to RootEntity
                                   on RootEntity.ID = rootID;
        LimitedDescendantCount : Integer64 @(
          Core.Computed: true,
          UI.Hidden    : true
        );
        DistanceFromRoot       : Integer64 @(
          Core.Computed: true,
          UI.Hidden    : true
        );
        DrillState             : String    @(
          Core.Computed: true,
          UI.Hidden    : true
        );
        Matched                : Boolean   @(
          Core.Computed: true,
          UI.Hidden    : true
        );
        MatchedDescendantCount : Integer64 @(
          Core.Computed: true,
          UI.Hidden    : true
        );
        LimitedRank            : Integer64 @(
          Core.Computed: true,
          UI.Hidden    : true
        );
  }

  annotate RootEntity with @(
    UI          : {
      SelectionFields     : [
        StringProperty,
        IntegerProperty,
        NumberProperty,
        DateProperty,
        PropertyWithValueHelp,
        preferredNode,
        SingleValueDateProperty,
        _OneToOne.ChildName,
        _OneToMulti.MultiChildName
      ],
      SelectionFields #SF1: [
        StringProperty,
        IntegerProperty,
        NumberProperty,
        DateProperty,
        TimeProperty,
        PropertyWithUnit,
        PropertyWithCurrency,
        PropertyWithValueHelp
      ]
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
    },
  );

  annotate HierarchyEntity with @UI: {
    PresentationVariant #VH: {
      $Type                      : 'UI.PresentationVariantType',
      Visualizations             : ['@UI.LineItem', ],
      RecursiveHierarchyQualifier: 'NodesHierarchy'
    },
    LineItem               : [{
      $Type: 'UI.DataField',
      Value: name,
    }]
  };

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
