service Service {
  @odata.draft.enabled
  entity RootEntity {
    key ID             : Integer;
        name           : String;
        _toChildren    : Association to many ChildEntity
                           on _toChildren.owner = $self;
        _PreferredNode : Association to many SmallHierarchyEntity
                           on _PreferredNode.RootEntity = $self;
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

  entity SmallHierarchyEntity {
        @Core.Immutable: true
    key ID         : String @(Common: {
          Label    : 'Preferred Node',
          ValueList: {
            CollectionPath              : 'HierarchyEntity',
            Parameters                  : [
              {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: ID,
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
        rootID     : Integer;
        RootEntity : Association to RootEntity
                       on RootEntity.ID = rootID;
  };

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

  @cds.autoexpose
  entity ChildEntity {
    key ID          : String @(Common: {
          Label          : 'Child ID',
          Text           : description,
          TextArrangement: #TextFirst
        });
        name        : String @Common: {ValueList: {
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
        description : String @Common: {ValueList: {
          Label         : 'Value Help of description property',
          CollectionPath: 'NameValueHelpEntity',
          Parameters    : [
            {
              $Type            : 'Common.ValueListParameterDisplayOnly',
              ValueListProperty: 'Child_ID'
            },
            {
              $Type            : 'Common.ValueListParameterInOut',
              LocalDataProperty: description,
              ValueListProperty: 'Child_Description'
            }
          ]
        }};
        owner       : Association to RootEntity;
  }

  annotate ChildEntity with @UI: {FieldGroup #Default: {Data: [{
    $Type: 'UI.DataField',
    Value: name
  }]}};

  annotate RootEntity with @UI: {LineItem: [
    {Value: ID},
    {
      $Type: 'UI.DataField',
      Label: 'MVF Annotation',
      Value: _toChildren.name
    }
  ]};

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
}
