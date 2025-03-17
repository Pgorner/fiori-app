service Service {
  @odata.draft.enabled
  entity RootEntity {
    key ID                  : Integer @title: 'Identifier';
        TitleProperty       : String  @title: 'Title';
        DescriptionProperty : String  @title: 'Description';
        NameProperty        : String  @title: 'Name';
  }

  annotate RootEntity with
  @(
    Common.SideEffects #BusinessPartner      : {
      SourceProperties: [
        NameProperty,
        DescriptionProperty
      ],
      TargetProperties: ['TitleProperty']
    },
    Capabilities.DeleteRestrictions.Deletable: false,
    UI                                       : {
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
          Label : 'ReferenceFacet 1',
          Target: '@UI.Identification'
        },
        {
          $Type : 'UI.ReferenceFacet',
          ID    : 'ReferenceFacet2',
          Label : 'Reference Facet 2',
          Target: '@UI.FieldGroup#FieldGroup2'
        },
        {
          $Type : 'UI.CollectionFacet',
          ID    : 'CollectionFacet3',
          Label : 'Collection Facet 3',
          Facets: [{
            $Type : 'UI.ReferenceFacet',
            ID    : 'ReferenceFacet3_1',
            Label : 'Reference Facet 3_1',
            Target: '@UI.FieldGroup#FieldGroup3_1'
          }]
        },
        {
          $Type : 'UI.CollectionFacet',
          ID    : 'CollectionFacet4',
          Label : 'Collection Facet 4',
          Facets: [{
            $Type : 'UI.CollectionFacet',
            ID    : 'CollectionFacet4_1',
            Label : 'Collection Facet 4_1',
            Facets: [
              {
                $Type : 'UI.ReferenceFacet',
                ID    : 'ReferenceFacet4_1_1',
                Label : 'Reference Facet 4_1_1',
                Target: '@UI.FieldGroup#FieldGroup4_1_1'
              },
              {
                $Type : 'UI.ReferenceFacet',
                ID    : 'ReferenceFacet4_1_2',
                Label : 'Reference Facet 4_1_2',
                Target: '@UI.FieldGroup#FieldGroup4_1_2'
              }
            ]
          }]
        }
      ],
      FieldGroup #FieldGroup2    : {
        Label: 'FieldGroup 2',
        Data : [
          {
            $Type: 'UI.DataField',
            Value: ID
          },
          {
            $Type: 'UI.DataField',
            Value: NameProperty
          },
        ]
      },
      FieldGroup #FieldGroup3_1  : {
        Label: 'FieldGroup 3_1',
        Data : [
          {Value: ID},
          {Value: NameProperty}
        ]
      },
      FieldGroup #FieldGroup4_1_1: {
        Label: 'FieldGroup 4_1_1',
        Data : [
          {Value: ID},
          {Value: NameProperty}
        ]
      },
      FieldGroup #FieldGroup4_1_2: {
        Label: 'FieldGroup 4_1_2',
        Data : [
          {Value: ID},
          {Value: NameProperty}
        ]
      },
      Identification             : [
        {
          $Type            : 'UI.DataField',
          Value            : TitleProperty,
          ![@UI.Importance]: #High
        },
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
      ]
    }
  );
}
