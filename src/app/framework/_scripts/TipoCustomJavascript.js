(function() {

    'use strict';


    function TipoCustomJavascript(tipoHandle, tipoRouter, tipoManipulationService, $rootScope, $stateParams) {

        var intercom_app_id = tipoHandle.application_meta.TipoConfiguration.intercom_app_id || "a4gpt05a";
        var intercom_state;

        // function TipoS3Browser_OnClick(tipoData,selectedTipo,tipo_name,query_params,event){
        function TipoS3Browser_OnClick(data_handle) {
            if (data_handle.selected_tipo.is_folder) {
                data_handle.queryparams.fq_folder = data_handle.selected_tipo.fq_filename;
                tipoHandle.getTipos(data_handle.tipo_name, data_handle.queryparams).then(function(response) {
                    data_handle.tipo_list = response;
                    if (data_handle.event) {
                        data_handle.event.stopPropagation();
                    };
                    tipoRouter.endStateChange();
                });
                return false;
            }
            tipoRouter.endStateChange();
            return true;
        }
        this.TipoS3Browser_OnClick = TipoS3Browser_OnClick;

        //___TipoDefinition___

        function TipoDefinition_tipo_fields_label_style_OnChange(data_handle) {
            if (data_handle.label === "Value Based Style") {
                if (data_handle.context.allowed_values) {
                    var expression = "";
                    _.each(data_handle.context.allowed_values, function(value) {
                        if (value !== data_handle.context.allowed_values[data_handle.context.allowed_values.length - 1]) {
                            expression = expression + _.replace(_.replace(data_handle.new_value, "$field", "$tipo." + data_handle.context.field_name), "$value", value) + " || ";
                        } else {
                            expression = expression + _.replace(_.replace(data_handle.new_value, "$field", "$tipo." + data_handle.context.field_name), "$value", value);
                        }
                    });
                    data_handle.new_value = expression;
                };
            };
        }

        this.TipoDefinition_tipo_fields_label_style_OnChange = TipoDefinition_tipo_fields_label_style_OnChange;
        this.TipoDefinition_tipo_fields_value_style_OnChange = TipoDefinition_tipo_fields_label_style_OnChange;

        function TipoDefinition_tipo_meta_tipo_type_copy_OnChange(data_handle) {
            if (data_handle.tipo.tipo_meta.tipo_type_copy) {
                data_handle.tipo.tipo_meta.tipo_type = [data_handle.tipo.tipo_meta.tipo_type_copy];
                data_handle.tipo.tipo_meta.tipo_type_labels = [data_handle.tipo.tipo_meta.tipo_type_copy_labels];
            }
        }

        this.TipoDefinition_tipo_meta_tipo_type_copy_OnChange = TipoDefinition_tipo_meta_tipo_type_copy_OnChange;

        function TipoDefinition_tipo_menu_type__OnChange(data_handle) {
            if (data_handle.new_object && data_handle.new_object.tipo_meta.tipo_type) {
                data_handle.context.tipo_type = data_handle.new_object.tipo_meta.tipo_type;
            };
        }

        this.TipoDefinition_tipo_menu_type__OnChange = TipoDefinition_tipo_menu_type__OnChange;

        function TipoDefinition_tipo_fields_default_value_BeforeLookup(data_handle) {
            if (_.startsWith(data_handle.context.field_type, 'Tipo.')) {
                data_handle.tipo_name = data_handle.context.field_type.substring(5);
                data_handle.key_field = data_handle.context.select_key_field || "tipo_id";
                data_handle.label_field = data_handle.context.select_label_field || data_handle.key_field;
                if (!_.isUndefined(data_handle.context.relationship_filter) && data_handle.context.relationship_filter.indexOf("$tipo") === -1) {
                    var basefilterExpanded = data_handle.context.relationship_filter;
                    if (!_.isUndefined(basefilterExpanded) && basefilterExpanded !== "" && !data_handle.searchCriteria.tipo_filter) {
                        data_handle.searchCriteria.tipo_filter = basefilterExpanded;
                    } else if (data_handle.searchCriteria.tipo_filter && !_.isUndefined(basefilterExpanded) && basefilterExpanded !== "") {
                        data_handle.searchCriteria.tipo_filter = data_handle.searchCriteria.tipo_filter + " AND " + basefilterExpanded;
                    }
                }
            }
        }
        this.TipoDefinition_tipo_fields_default_value_BeforeLookup = TipoDefinition_tipo_fields_default_value_BeforeLookup;
        this.TipoDefinition_tipo_field_groups_tipo_fields_default_value_BeforeLookup = TipoDefinition_tipo_fields_default_value_BeforeLookup;

        //___TipoDefinition___

        function TipoDefinition_OnView(data_handle) {
            var menu_item = tipoHandle.getMenuItem();
            if (data_handle.mode === 'create' && menu_item.quickFilters === 'Menu Definitions') {
                var unbind = $rootScope.$watch(function() { return data_handle }, function(new_value, old_value) {
                    if (data_handle.tipo.tipo_meta) {
                        data_handle.tipo.tipo_meta.tipo_type_copy = "abstract";
                        data_handle.tipo.tipo_meta.tipo_type_copy_labels = "Abstract Tipo";
                        data_handle.tipo.tipo_meta.tipo_type = ["abstract"];
                        data_handle.tipo.tipo_meta.tipo_type_labels = ["Abstract Tipo"];
                        unbind();
                    }
                }, true);
                window.Intercom("trackEvent", "addedToMenu");
                setTimeout(function(){
                        window.Intercom('update');
                },5000);
            }
            if (data_handle.mode === 'create') {
                window.Intercom("trackEvent", "createdTipo");
                setTimeout(function(){
                        window.Intercom('update');
                },5000);
            };
        }
        this.TipoDefinition_OnView = TipoDefinition_OnView;

        //___TipoApp___
        function TipoApp_OnView(data_handle) {
            var introOptions = {
                steps: [{
                        element: '#manageTipos',
                        intro: "Start creating tipos to represent business objects along with fields, E.g. Customer, Invoice etc"
                    },
                    {
                        element: '#manageMenus',
                        intro: "Add menu items to system menus 'Home', 'Profile' and 'Settings'. Or even create whole new menus, also called as perspectives in TipoTapp",
                        position: 'right'
                    },
                    {
                        element: '#customization',
                        intro: 'Choose your own colours, font and logo for your application',
                        position: 'bottom'
                    },
                    {
                        element: '#home_menu',
                        intro: "Visualise how your user sees the developed application instantly by accessing Home",
                        position: 'bottom'
                    },
                    {
                        element: '#develop_menu',
                        intro: "Switch back to developer mode to continue to build application",
                        position: 'bottom'
                    },
                    {
                        element: '#start_tour_action',
                        intro: "You can start the tour from here",
                        position: 'bottom'
                    }
                ],
                showStepNumbers: false,
                showBullets: false,
                exitOnOverlayClick: true,
                exitOnEsc: true,
                nextLabel: 'next',
                prevLabel: '<span style="color:green">Previous</span>',
                skipLabel: 'Dont show the tour gain',
                doneLabel: 'Finish'
            };
            var tour_item = "tipoapp_tour_1";
            $("#loader").addClass("loading");
            tipoHandle.getTourItem(tour_item).then(function(tipo) {
                if (!tipo[tour_item]) {
                    var unbind = $rootScope.$watch(function() {
                        return document.querySelectorAll('#manageTipos')[0];
                    }, function watchCallback(newValue, oldValue) {
                        //react on value change here
                        if (newValue) {
                            setTimeout(function() {
                                $("#loader").removeClass("loading");
                                if ($stateParams.tipo_name === "TipoApp" && $stateParams.tipo_id && data_handle.mode === "view") {
                                    tipoHandle.setTourObject(tour_item, introOptions, tipo);
                                };
                                unbind();
                            }, 3000);
                        };
                    });
                } else {
                    $("#loader").removeClass("loading");
                }
            });
        }
        this.TipoApp_OnView = TipoApp_OnView;

        function TipoApp_start_tour(data_handle) {
            var introOptions = {
                steps: [{
                        element: '#manageTipos',
                        intro: "Start creating tipos to represent business objects along with fields, E.g. Customer, Invoice etc"
                    },
                    {
                        element: '#manageMenus',
                        intro: "Add menu items to system menus 'Home', 'Profile' and 'Settings'. Or even create whole new menus, also called as perspectives in TipoTapp",
                        position: 'right'
                    },
                    {
                        element: '#customization',
                        intro: 'Choose your own colours, font and logo for your application',
                        position: 'bottom'
                    },
                    {
                        element: '#home_menu',
                        intro: "Visualise how your user sees the developed application instantly by accessing Home",
                        position: 'bottom'
                    },
                    {
                        element: '#develop_menu',
                        intro: "Switch back to developer mode to continue to build application",
                        position: 'bottom'
                    }
                ],
                showStepNumbers: false,
                showBullets: false,
                exitOnOverlayClick: true,
                exitOnEsc: true,
                nextLabel: 'next',
                prevLabel: '<span style="color:green">Previous</span>',
                skipLabel: 'Dont Show the Tour Again',
                doneLabel: 'Finish'
            };
            var tour_item = "tipoapp_tour_1";
            tipoHandle.setTourObject(tour_item, introOptions);
        }
        this.TipoApp_start_tour = TipoApp_start_tour;
        //___TipoApp___
        //___TipoAboutApp___

        function TipoAboutApp_OnView(data_handle) {
            var application = _.get(tipoHandle.application_meta, "TipoApp.application");
            tipoHandle.getTipo('TipoApp', application).then(function(tipo_res) {
                data_handle.tipo.app_name = tipo_res.app_name;
                data_handle.tipo.app_version = tipo_res.app_version;
                data_handle.tipo.app_link = tipo_res.app_url;
                data_handle.tipo.app_description = tipo_res.app_description;
                data_handle.tipo.mobile_app_qr_code = tipo_res.mobile_app_qr_cd;
            })
        }
        this.TipoAboutApp_OnView = TipoAboutApp_OnView;

        //___TipoAboutApp___

        //___App level events__
        function tipoapp_Login(status, email) {
            if (window.Intercom && (currentApp === 'tipoapp')) {
                if (status === 'success') {
                    window.Intercom("boot", {
                        app_id: intercom_app_id,
                        email: email
                    });
                    intercom_state = "boot";
                    setTimeout(function() {
                        window.Intercom('update');
                    }, 5000);
                }
            }
        }

        function tipoapp_Logout() {
            if (window.Intercom && (currentApp === 'tipoapp' || $rootScope.developMode === true)) {
                window.Intercom("shutdown");
                intercom_state = "shutdown";
            }
        }

        function tipoapp_URLChange() {
            // if (window.Intercom) {
            //     window.Intercom('update');
            // }
        }

        function tipoapp_PerspectiveChange() {
            if (currentApp === 'tipoapp') {
                if ($stateParams.perspective === "Settings" && $rootScope.showSubscribeNow) {
                    window.Intercom("trackEvent", "subscription");
                    setTimeout(function() {
                        window.Intercom('update');
                    }, 5000);
                };
            } else if ($rootScope.developMode) {
                if (_.startsWith($stateParams.perspective, "TipoApp.") && intercom_state !== "boot") {
                    window.Intercom("boot", {
                        app_id: intercom_app_id,
                        email: currentUser.tipo_id
                    });
                    setTimeout(function() {
                        window.Intercom('update');
                    }, 5000);
                    intercom_state = "boot";
                } else if (window.Intercom && !_.startsWith($stateParams.perspective, "TipoApp.") && !$rootScope.showSubscribeNow) {
                    window.Intercom("shutdown");
                    intercom_state = "shutdown";
                }
            }
        }

        function tipoapp_AppInit() {
            if (intercom_state !== "boot" && !window.location.href.includes("tipotapp")) {
            	if (!currentUser) {
            		var currentUser = tipoHandle.user_meta;
            	};
                window.Intercom("boot", {
                    app_id: intercom_app_id,
                    email: currentUser.tipo_id
                });
                setTimeout(function() {
                        window.Intercom('update');
                    }, 5000);
                intercom_state = "boot";
            };
            if (currentApp !== 'tipoapp' && !$rootScope.showSubscribeNow && $rootScope.developMode === true && !window.location.href.includes("tipotapp")) {
                window.Intercom("trackEvent", "appCreated");
                setTimeout(function(){
                	window.Intercom('update');
                },5000);
            }
        }

        function tipoapp_PasswordChange() {}

        function tipoapp_ExistApp() {
            if ($rootScope.showSubscribeNow && currentApp !== 'tipoapp' && $rootScope.developMode === true) {
                window.Intercom("trackEvent", "exitIntent");
                setTimeout(function(){
                	window.Intercom('update');
                },5000);
            };
        }

        var currentApp = tipoHandle.application_meta.TipoApp.application_name;
        var currentUser = tipoHandle.user_meta;
        this[currentApp + "_Logout"] = tipoapp_Logout;
        this[currentApp + "_Login"] = tipoapp_Login;
        this[currentApp + "_URLChange"] = tipoapp_URLChange;
        this[currentApp + "_PerspectiveChange"] = tipoapp_PerspectiveChange;
        this[currentApp + "_PasswordChange"] = tipoapp_PasswordChange;
        this[currentApp + "_ExistApp"] = tipoapp_ExistApp;
        this[currentApp + "_AppInit"] = tipoapp_AppInit;

        //___App level events__
    }

    // Added Client Side Javascript Service in Custom Module
    angular.module('tipo.custom')
        .service('tipoCustomJavascript', TipoCustomJavascript);;

})();