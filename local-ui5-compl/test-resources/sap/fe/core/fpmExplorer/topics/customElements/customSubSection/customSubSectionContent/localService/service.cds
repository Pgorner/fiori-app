service Service {
  @odata.draft.enabled
  entity RootEntity {
    key ID                  : Integer @title: 'Identifier';
        TitleProperty       : String  @title: 'Title';
        DescriptionProperty : String  @title: 'Description';
        NameProperty        : String  @title: 'Name';
        items               : Association to many ChildEntity
                                on items.Parent = $self;
  }

  entity ChildEntity {
    key ID              : Integer                   @title: 'Item Identifier';
        StringProperty  : String                    @title: 'String';
        IntegerProperty : Integer                   @title: 'Integer';
        NumberProperty  : Decimal(4, 2)             @title: 'Number';
        BooleanProperty : Boolean                   @title: 'Boolean';
        DateProperty    : Date                      @title: 'Date';
        TimeProperty    : Time                      @title: 'Time';
        Parent          : Association to RootEntity @UI.Hidden;
  }

  annotate RootEntity with
  @(UI: {
    HeaderInfo                 : {
      TypeName      : 'Root Entity',
      TypeNamePlural: 'Root Entities',
      Title         : {
        $Type: 'UI.DataField',
        Value: TitleProperty
      },
      Description   : {
        $Type: 'UI.DataField',
        Value: DescriptionProperty
      }
    },

    Facets                     : [
      {
        $Type : 'UI.ReferenceFacet',
        ID    : 'ReferenceFacet1',
        Label : 'Reference Facet 1',
        Target: '@UI.Identification'
      },
      {
        $Type : 'UI.CollectionFacet',
        ID    : 'CollectionFacet2',
        Label : 'Collection Facet 2',
        Facets: [{
          $Type : 'UI.ReferenceFacet',
          ID    : 'ReferenceFacet2_1',
          Label : 'Reference Facet 2_1',
          Target: '@UI.FieldGroup#FieldGroup2_1'
        }]
      },
      {
        $Type : 'UI.CollectionFacet',
        ID    : 'CollectionFacet3',
        Label : 'Collection Facet 3',
        Facets: [{
          $Type : 'UI.CollectionFacet',
          ID    : 'CollectionFacet3_1',
          Label : 'Collection Facet 3_1',
          Facets: [
            {
              $Type : 'UI.ReferenceFacet',
              ID    : 'ReferenceFacet3_1_1',
              Label : 'Reference Facet 3_1_1',
              Target: '@UI.FieldGroup#FieldGroup3_1_1'
            },
            {
              $Type : 'UI.ReferenceFacet',
              ID    : 'ReferenceFacet3_1_2',
              Label : 'Reference Facet 3_1_2',
              Target: '@UI.FieldGroup#FieldGroup3_1_2'
            }
          ]
        }]
      }
    ],

    Identification             : [
      {
        $Type            : 'UI.DataField',
        Value            : DescriptionProperty,
        ![@UI.Importance]: #High
      },
      {
        $Type            : 'UI.DataField',
        Value            : NameProperty,
        ![@UI.Importance]: #High
      }
    ],

    FieldGroup #FieldGroup2_1  : {
      Label: 'FieldGroup 2_1',
      Data : [
        {Value: ID},
        {Value: NameProperty}
      ]
    },

    FieldGroup #FieldGroup3_1_1: {
      Label: 'FieldGroup 3_1_1',
      Data : [{Value: NameProperty}]
    },

    FieldGroup #FieldGroup3_1_2: {
      Label: 'FieldGroup 3_1_2',
      Data : [{Value: NameProperty}]
    }

  });

  annotate ChildEntity with @(UI: {LineItem: {
    ![@UI.Criticality]: Criticality,
    $value            : [
      {Value: ID},
      {Value: StringProperty},
      {Value: IntegerProperty},
      {Value: DateProperty},
      {Value: TimeProperty},
      {Value: BooleanProperty}
    ]
  }})
}
