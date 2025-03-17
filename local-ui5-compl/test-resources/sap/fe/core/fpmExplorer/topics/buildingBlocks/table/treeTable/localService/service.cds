service Service {
  @Aggregation.RecursiveHierarchy #ProductsHierarchy: {
    NodeProperty            : ID,
    ParentNavigationProperty: Parent
  }
  @Hierarchy.RecursiveHierarchy #ProductsHierarchy  : {
    ExternalKey           : ID,
    LimitedDescendantCount: LimitedDescendantCount,
    DistanceFromRoot      : DistanceFromRoot,
    DrillState            : DrillState,
    Matched               : Matched,
    MatchedDescendantCount: MatchedDescendantCount
  }
  @Capabilities.FilterRestrictions                  : {NonFilterableProperties: [
    LimitedDescendantCount,
    DistanceFromRoot,
    DrillState,
    Matched,
    MatchedDescendantCount
  ]}
  @Capabilities.SortRestrictions                    : {NonSortableProperties: [
    LimitedDescendantCount,
    DistanceFromRoot,
    DrillState,
    Matched,
    MatchedDescendantCount
  ]}
  entity Products                        @(Common: {SemanticKey: [ID]}) {
    key ID                     : String  @title: 'Identifier'  @Core.Computed;
        Title                  : String  @title: 'Product Title';
        Description            : String  @title: 'Product Description';
        ParentID               : String;
        Parent                 : Association to one Products
                                   on Parent.ID = ParentID;

        @Core.Computed: true
        LimitedDescendantCount : Integer64;

        @Core.Computed: true
        DistanceFromRoot       : Integer64;

        @Core.Computed: true
        DrillState             : String;

        @Core.Computed: true
        Matched                : Boolean;

        @Core.Computed: true
        MatchedDescendantCount : Integer64;
  }

  annotate Products with @UI: {
    LineItem                 : [
      {
        $Type: 'UI.DataField',
        Value: ID,
      },
      {
        $Type: 'UI.DataField',
        Value: Title,
      },
      {
        $Type: 'UI.DataField',
        Value: Description,
      },
    ],
    PresentationVariant      : {
      $Type         : 'UI.PresentationVariantType',
      Visualizations: ['@UI.LineItem', ],
      Text          : 'Hierarchical',
    },
    PresentationVariant #Flat: {
      $Type         : 'UI.PresentationVariantType',
      Visualizations: ['@UI.LineItem#Flat', ],
      Text          : 'Flat list',
    },
    LineItem #Flat           : [
      {
        $Type: 'UI.DataField',
        Value: ID,
      },
      {
        $Type: 'UI.DataField',
        Value: Title,
      },
      {
        $Type: 'UI.DataField',
        Value: Description,
      },
    ],
    HeaderInfo               : {
      $Type         : 'UI.HeaderInfoType',
      TypeName      : 'Product',
      TypeNamePlural: 'Products',
      Title         : {
        $Type: 'UI.DataField',
        Value: ID,
      },
    },
    FieldGroup               : {
      $Type: 'UI.FieldGroupType',
      Data : [
        {
          $Type: 'UI.DataField',
          Value: Description,
        },
        {
          $Type: 'UI.DataField',
          Value: Title,
        },
      ],
    },
    Facets                   : [{
      $Type : 'UI.ReferenceFacet',
      Target: '@UI.FieldGroup',
      Label : 'General',
    }, ],
  };
}
