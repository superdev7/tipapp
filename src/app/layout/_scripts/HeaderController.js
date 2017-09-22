(function () {

  'use strict';

  function HeaderController(
    tipoRouter,
    tipoDefinitionDataService,
    tipoInstanceDataService,
    tipoManipulationService,
    metadataService,
    $mdMedia,
    $state,
    $stateParams,
    $scope,
    $rootScope,
    tipoRegistry) {

    var _instance = this;
    if ($stateParams.hideheader) {
      _instance.hideheader = true;
    };

    function addPerspectives(userMeta,homeMeta){
        _instance.perspectives = [{
          name: 'Home',
          icon: 'home',
          disabled: false,
          perspective: 'Home'
        }, {
          name: 'Settings',
          icon: 'settings',
          disabled: false,
          perspective: 'Settings'
        }
      ];
        
        if (homeMeta.application === userMeta.application) {
            _instance.perspectives.push({
                name: 'Profile',
                icon: 'account_box',
                disabled: false,
                perspective: 'ProfilePerspective'
              });
        } else {
            _instance.perspectives.push({
                name: 'Profile',
                icon: 'account_box',
                disabled: true,
                perspective: 'ProfilePerspective'
              });
        }
        
      if (homeMeta.application_owner_account === userMeta.account ) {
        _instance.perspectives.push({
          name: 'Develop',
          icon: 'build',
          disabled: false,
          perspective: 'TipoApp.' + homeMeta.application
        });
      }
      
      if (homeMeta.application === userMeta.application) {
          _instance.perspectives.push({
              name: 'Log Out',
              icon: 'exit_to_app',
              disabled: false,
              perspective: 'logout'
          });
      } else {
          _instance.perspectives.push({
              name: 'Log Out',
              icon: 'exit_to_app',
              disabled: true,
              perspective: 'logout'
          });
      }
    }

    var userMeta = metadataService.userMetadata;
    var homeMeta = tipoRegistry.get('Home');
    if (_.isUndefined(homeMeta) && !$rootScope.readonly) {
      tipoDefinitionDataService.getOne('Home').then(function(definition){
        homeMeta = definition;
        addPerspectives(userMeta,homeMeta);
      });
    }else{
      addPerspectives(userMeta,homeMeta);
    };

    _instance.reload = function () {
      tipoRouter.reloadCurrent();
    };


  }

  angular.module('tipo.layout')
    .controller('HeaderController', HeaderController);

})();