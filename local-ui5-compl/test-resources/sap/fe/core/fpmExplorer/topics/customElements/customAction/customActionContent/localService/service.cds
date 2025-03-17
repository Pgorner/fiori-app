service Service {

  @odata.draft.enabled
  entity RootEntity {
    key ID                     : Integer @title: 'Identifier';
        TitleProperty          : String  @title: 'Title'        @readonly;
        DescriptionProperty    : String  @title: 'Description'  @readonly;
        NameProperty           : String  @title: 'Action Hidden When Text Field Empty';
        BooleanProperty        : Boolean @title: 'Boolean';
        HeaderBooleanProperty1 : Boolean @title: 'Boolean';
        HeaderActionVisible    : Integer @title: 'Boolean';
        ShowAlertDescription1  : String  @title: 'Description'  @UI.MultiLineText: true  @readonly;
        ShowAlertDescription2  : String  @title: 'Description'  @UI.MultiLineText: true  @readonly;
        visible                : Association to ActionVisibilityEntity
                                   on visible.code = $self.HeaderActionVisible;
        items                  : Association to many ChildEntity
                                   on items.Parent = $self;
  } actions {

    action Header1MenuAction1();
    action Header1MenuAction2();
    action Header2MenuAction1();
    action Header2MenuAction2();
    action Subsection1MenuAction1();
    action Subsection1MenuAction2();
    action Subsection2MenuAction1();
    action Subsection2MenuAction2();
    action HeaderAnnotationAction();
    action SubsectionAnnotationAction();

  }

  entity ChildEntity {
    key ID2          : Integer @title: 'Item Identifier';
        TextProperty : String  @title: 'Text';
        Parent       : Association to RootEntity;
  } actions {
    action Table1MenuAction1();
    action Table1MenuAction2();
    action Table2MenuAction1();
    action Table2MenuAction2();
    action TableAnnotationAction();
  }

  @odata.singleton
  entity EntitiesSingleton {
    key DoNotChange      : Integer @Core.Computed;
        ShowAlertVisible : Boolean @Core.Computed;
  }

  entity ActionVisibilityEntity {
    key code        : Integer    @(
          Common: {
            Text           : Description,
            TextArrangement: #TextFirst
          },
          title : 'Visibility'
        );
        Description : String(20) @(
          Core.Immutable: true,
          Common        : {Label: 'Value Help Description'}
        );
  }

  annotate RootEntity with
  @(

    UI                                       : {
      Identification                       : [
        {
          $Type  : 'UI.DataFieldForActionGroup',
          ID     : 'HeaderActionGroup1',
          Label  : 'Action Group Override',
          Actions: [
            {
              $Type : 'UI.DataFieldForAction',
              Label : 'Menu Item 1',
              Action: 'Service.Header1MenuAction1',
            },
            {
              $Type : 'UI.DataFieldForAction',
              Label : 'Menu Item 2',
              Action: 'Service.Header1MenuAction2',
            }
          ]
        },
        {
          $Type  : 'UI.DataFieldForActionGroup',
          ID     : 'HeaderActionGroup2',
          Label  : 'Menu Item Override',
          Actions: [
            {
              $Type : 'UI.DataFieldForAction',
              Label : 'Action Enabled Overridden',
              Action: 'Service.Header2MenuAction1',
            },
            {
              $Type : 'UI.DataFieldForAction',
              Label : 'Menu Item 2',
              Action: 'Service.Header2MenuAction2',
            }
          ]
        },
        {
          $Type : 'UI.DataFieldForAction',
          Label : 'Annotation Action in Menu',
          Action: 'Service.HeaderAnnotationAction',
        },
      ],
      HeaderInfo                           : {
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
      HeaderFacets                         : [{
        $Type : 'UI.ReferenceFacet',
        Target: '@UI.FieldGroup#ToggleHeaderActionVisible',
        Label : 'Header Actions Visibility and Enablement'
      }, ],
      FieldGroup #ToggleHeaderActionVisible: {Data: [
        {
          $Type: 'UI.DataField',
          Label: '"Show Message" Enabled',
          Value: HeaderBooleanProperty1
        },
        {
          $Type: 'UI.DataField',
          Label: '"Show Message" Visible',
          Value: HeaderActionVisible
        },
        {
          $Type: 'UI.DataField',
          Label: '"Show Alert" Enabled',
          Value: ShowAlertDescription1
        },
        {
          $Type: 'UI.DataField',
          Label: '"Show Alert" Visible',
          Value: ShowAlertDescription2
        },

      ],

      },
      FieldGroup #FacetCustomAction        : {Data: [
        {
          $Type: 'UI.DataField',
          Label: 'Custom Action in Section Enabled',
          Value: BooleanProperty
        },
        {
          $Type: 'UI.DataField',
          Value: NameProperty
        },
        {
          $Type  : 'UI.DataFieldForActionGroup',
          ID     : 'SubsectionActionGroup1',
          Label  : 'Action Group Override',
          Actions: [
            {
              $Type : 'UI.DataFieldForAction',
              Label : 'Menu Item 1',
              Action: 'Service.Subsection1MenuAction1',
            },
            {
              $Type : 'UI.DataFieldForAction',
              Label : 'Menu Item 2',
              Action: 'Service.Subsection1MenuAction2',
            }
          ]
        },
        {
          $Type  : 'UI.DataFieldForActionGroup',
          ID     : 'SubsectionActionGroup2',
          Label  : 'Menu Item Override',
          Actions: [
            {
              $Type : 'UI.DataFieldForAction',
              Label : 'Action Enabled Overridden',
              Action: 'Service.Subsection2MenuAction1',
            },
            {
              $Type : 'UI.DataFieldForAction',
              Label : 'Menu Item 2',
              Action: 'Service.Subsection2MenuAction2',
            }
          ]
        },
        {
          $Type : 'UI.DataFieldForAction',
          Label : 'Annotation Action in Menu',
          Action: 'Service.SubsectionAnnotationAction',
        },
      ]},
      Facets                               : [
        {
          $Type : 'UI.ReferenceFacet',
          Label : '{@i18n>facetCustomAction}',
          Target: '@UI.FieldGroup#FacetCustomAction'
        },
        {
          $Type : 'UI.ReferenceFacet',
          Label : '{@i18n>tableCustomAction}',
          Target: 'items/@UI.LineItem',
        }
      ]
    },
    Capabilities.DeleteRestrictions.Deletable: false
  ) {
    HeaderActionVisible @(Common: {
      Text                    : visible.Description,
      TextArrangement         : #TextOnly,
      ValueListWithFixedValues: true,
      ValueList               : {
        Label         : 'Value with Value Help',
        CollectionPath: 'ActionVisibilityEntity',
        Parameters    : [
          {
            $Type            : 'Common.ValueListParameterInOut',
            LocalDataProperty: HeaderActionVisible,
            ValueListProperty: 'code'
          },
          {
            $Type            : 'Common.ValueListParameterDisplayOnly',
            ValueListProperty: 'Description'
          }
        ]
      }
    })
  };

  annotate ChildEntity with @(UI: {LineItem: [
    {Value: TextProperty, },
    {
      $Type  : 'UI.DataFieldForActionGroup',
      ID     : 'TableActionGroup1',
      Label  : 'Action Group Override',
      Actions: [
        {
          $Type : 'UI.DataFieldForAction',
          Label : 'Menu Item 1',
          Action: 'Service.Table1MenuAction1',
        },
        {
          $Type : 'UI.DataFieldForAction',
          Label : 'Menu Item 2',
          Action: 'Service.Table1MenuAction2',
        }
      ]
    },
    {
      $Type  : 'UI.DataFieldForActionGroup',
      ID     : 'TableActionGroup2',
      Label  : 'Menu Item Override',
      Actions: [
        {
          $Type : 'UI.DataFieldForAction',
          Label : 'Action Enabled Overridden',
          Action: 'Service.Table2MenuAction1',
        },
        {
          $Type : 'UI.DataFieldForAction',
          Label : 'Menu Item 2',
          Action: 'Service.Table2MenuAction2',
        }
      ]
    },
    {
      $Type : 'UI.DataFieldForAction',
      Label : 'Annotation Action in Menu',
      Action: 'Service.TableAnnotationAction',
    },
  ]}) {
    ID2    @UI.Hidden;
    Parent @UI.Hidden;
  };
}
