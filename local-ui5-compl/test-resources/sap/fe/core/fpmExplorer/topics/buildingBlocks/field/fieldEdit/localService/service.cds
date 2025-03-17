service Service {
  entity RootEntity {
    key KeyProperty                : Integer;
        preferredNode              : String          @(Common: {
          Label    : 'Preferred Node',
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
        ComputedProperty           : String          @Core.Computed;
        ImmutableProperty          : String          @Core.Immutable;
        FieldControlReadOnly       : String          @Common.FieldControl : #ReadOnly;
        FieldControlInapplicable   : String          @Common.FieldControl : #Inapplicable;
        FieldControlDynamic        : String          @Common.FieldControl : FieldControlValue;
        Currency                   : String not null @Common              : {ValueList: {
          Label         : 'Currency Value Help',
          CollectionPath: 'CurrencyValueHelpEntity',
          Parameters    : [{
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: Currency,
            ValueListProperty: 'Currency'
          }]
        }};
        PropertyWithCurrency       : Decimal(10, 2)  @Measures.ISOCurrency: Currency;
        FieldControlDynamicIf      : String;
        FieldControlDynamicIfValue : Integer;
        FieldControlValue          : Integer         @Common              : {
          Text                    : _FieldControl.Description,
          TextArrangement         : #TextFirst,
          Label                   : 'Value with Value Help',
          ValueListWithFixedValues: true,
          ValueList               : {
            Label         : 'Value with Value Help',
            CollectionPath: 'FieldControlValueHelpEntity',
            Parameters    : [
              {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: FieldControlValue,
                ValueListProperty: 'KeyProp'
              },
              {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'Description'
              }
            ]
          }
        };
        _OneToOne                  : Association to one ChildEntity;
        _FieldControl              : Association to one FieldControlValueHelpEntity
                                       on _FieldControl.KeyProp = FieldControlValue;
        MaskedInputPhone           : String          @(
          UI.InputMask  : {
            Mask             : '(***) *** ******',
            PlaceholderSymbol: '_',
          },
          UI.Placeholder: 'Enter twelve-digit number'
        );
        MaskedInputRegistration    : String          @(
          UI.InputMask  : {
            Mask             : 'I****-**',
            PlaceholderSymbol: '_',
            Rules            : [{
              MaskSymbol: '*',
              RegExp    : '[0-9]'
            }]
          },
          UI.Placeholder: 'Enter digits registration number'
        );
        MaskedInputSAP             : String          @(
          UI.InputMask  : {
            Mask             : 'S^AP-AA-999',
            PlaceholderSymbol: '_',
            Rules            : [
              {
                MaskSymbol: '9',
                RegExp    : '[0-9]'
              },
              {
                MaskSymbol: 'A',
                RegExp    : '[A-Z]'
              }
            ]
          },
          UI.Placeholder: 'Starts with SAP followed by two uppercase letter and three digits'
        );
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
        @Core.Immutable: true
        @Common.Label  : 'ID'
    key ID                     : String;
        parent                 : String;

        @Common.Label  : 'Org level name'
        name                   : String;

        @UI.Hidden     : true
        rootID                 : Integer;

        @Core.Immutable: true
        @Common.Label  : 'Node type'
        nodeType               : String;
        Superordinate          : Association to HierarchyEntity
                                   on Superordinate.ID = parent;
        RootEntity             : Association to RootEntity
                                   on RootEntity.KeyProperty = rootID;

        @Core.Computed : true
        @UI.Hidden     : true
        LimitedDescendantCount : Integer64;

        @Core.Computed : true
        @UI.Hidden     : true
        DistanceFromRoot       : Integer64;

        @Core.Computed : true
        @UI.Hidden     : true
        DrillState             : String;

        @Core.Computed : true
        @UI.Hidden     : true
        Matched                : Boolean;

        @Core.Computed : true
        @UI.Hidden     : true
        MatchedDescendantCount : Integer64;

        @Core.Computed : true
        @UI.Hidden     : true
        LimitedRank            : Integer64;
  };

  annotate HierarchyEntity with @UI: {
    PresentationVariant #VH: {
      $Type                      : 'UI.PresentationVariantType',
      Visualizations             : ['@UI.LineItem', ],
      RecursiveHierarchyQualifier: 'NodesHierarchy',
      InitialExpansionLevel      : 2
    },
    LineItem               : [{
      $Type: 'UI.DataField',
      Value: name,
    }]
  };

  entity FieldControlValueHelpEntity {
    key KeyProp     : Integer @(Common: {
          Label          : 'Value Help Key',
          Text           : Description,
          TextArrangement: #TextFirst
        });
        Description : String  @(
          Core.Immutable: true,
          Common.Label  : 'Value Help Description'
        );
        Currency    : String;
  }

  entity CurrencyValueHelpEntity {
    key KeyProp  : Integer;
        Currency : String;
  }

  entity ChildEntity {
    key ID          : String @(Common: {
          Label          : 'Child ID',
          Text           : Description,
          TextArrangement: #TextFirst
        });
        Description : String @(Common.Label: 'Child Description');
  }
}
