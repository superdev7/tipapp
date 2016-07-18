(function() {

  'use strict';

  function TipoGenericListController(
    tipoManipulationService,
    $scope) {
    
    var _instance = this;
    
    var tipoDefinition = $scope.tipoRootController.tipoDefinition;
    var tipos = $scope.tipoRootController.tipos;

    var fields = tipoManipulationService.extractShortDisplayFields(tipoDefinition);
    var data = [];

    _.each(tipos, function(tipo){
      var row = {
        key: tipo.TipoID,
        value: []
      };
      _.each(fields, function(field){
        var expression = field._ui.accessor;
        var value = {
          field: field,
          value: tipoManipulationService.getFieldValue(tipo, expression)
        };
        row.value.push(value);
      });
      data.push(row);
    });

    _instance.tipoFields = fields;
    _instance.tipoData = data;


  }

  angular.module('tipo.framework')
  .controller('TipoGenericListController', TipoGenericListController);

})();