(function() {

  'use strict';

  var menu = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      state: 'dashboard',
      icon: 'dashboard',
      divider: true
    },
    {
      id: 'dynamic'
    },
    {
      id: 'support',
      label: 'Support',
      state: 'support',
      icon: 'help_outline'
    }
  ];

  function prepareTipoMenu(tipoDefinitions){
    tipoDefinitions = _.filter(_.values(tipoDefinitions), function(each){
      return Boolean(each.tipo_meta.main_menu);
    });
    var tipoMenuItems = _.map(tipoDefinitions, function(definition){
      var menuItem = {};
      var meta = definition.tipo_meta;
      menuItem.id = 'tipo.' + meta.tipo_name;
      menuItem.tipo_name = meta.tipo_name;
      menuItem.tipo_version = meta.default_version;
      menuItem.label = meta.display_name;
      menuItem.icon = meta.icon;
      return menuItem;
    });

    var fullMenu = _.cloneDeep(menu);
    var tipoMenuIndex = _.findIndex(fullMenu, {id: 'dynamic'});
    fullMenu.splice(tipoMenuIndex, 1, tipoMenuItems);
    fullMenu = _.flatten(fullMenu);
    return fullMenu;
  }

  function NavigationController(
    tipoRouter,
    tipoDefinitionDataService,
    $mdSidenav,
    $mdMedia,
    $scope,
    $rootScope) {

    var _instance = this;

    _instance.navigate = function(menuItem){
      $mdSidenav('left').close();
      _instance.activeItem = menuItem;
      if(menuItem.state){
        tipoRouter.to(menuItem.state, menuItem.state);
      }else if(menuItem.tipo_name){
        tipoRouter.toTipoList(menuItem.tipo_name);
      }
    };

    $rootScope.$watch('perspective', function(newValue, oldValue){
      if(newValue === 'home'){
        _instance.menu = prepareTipoMenu($scope.allTipoDefinitions);
      }else if(newValue === 'settings'){
        // load settings menu
      }
    });

  }

  angular.module('tipo.layout')
  .controller('NavigationController', NavigationController);

})();