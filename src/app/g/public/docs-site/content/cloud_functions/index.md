---
title: Cloud Functions
weight: 8
---
  
Cloud Functions are used in doing custom actions or to override the default actions. Cloud functions are used by the developers to implement business logic speicific to the app developed. Cloud functions are implemented using AWS Lambda and these lambda functions reside in developers own AWS account.

# Signature #

Tipo Cloud Functions only takes a single JSON input and a single JSON output, both these are explained in the Request Structure and Response Structure sections below.

  *`tipo_fn_response` handler ( `tipo_context`, `tipo_request`, `tipo_response`, `server_dependencies`);*

## Request Structure ##
 
Tipo cloud function request is a Json object with the following four members.

Member name | Description
------------ | ---------------
`tipo_context` | Tipo Context contains all the contextual information about the user, application, current request and user actions
`tipo_request []` | Contains array of all the requests from the client. Only bulk action will contain more than one array item, but the structure will always be an array.
`tipo_response []`| Function may be called after performing database action, in which case there will be responses as well as requests as requests.
  
## tipo_context ##
  
Both compute functions used in generating simple field values and also TipoFunctions used in actions take tipo_context as input. TipoContext has the following fields.

`Support for settings yet to be added. Once settings concept if finalised, it will be added.`

Context Variable |  Description 
------------ | ------------
**tipo_context.user** | Logged-in user id (Email)
tipo_context.account | Logged-in user account
tipo_context.application | Logged-in application
tipo_context.application_owner | Logged-in application owner account
tipo_context.request.tipo_name | Tipo in context
tipo_context.request.tipo_id
tipo_context.request.tipo_action
tipo_context.request.http_method
tipo_context.request.compression
tipo_context.request.page
tipo_context.request.per_page
tipo_context.request.tipo_fields
tipo_context.request.tipo_filter
    
    Use the above format in the tipo_filter when specifying dependencies for dynamic replacement. 
      I.e. {{tipo_context.application}} will be replaced on the server with the actual application name.
    
    *** Example tipo_context - Input to TipoFunction***
    {
      \"user\" : \"test_user\",
      \"account\" : \"acme\",
        \"request\": {
          \"tipo_name\" : \"Customer\",
          \"tipo_filter\" \"asdf\"
        }
    }

    
  ### tipo_request   ###
    
    * tipo_request[array].tipo_name
    * tipo_request[array].data.tipo_id
    * tipo_request[array].data.TipoField1
    * tipo_request[array].data.TipoField2 ... and so on.
    
    
    *** Example Request ***
      [
          {
            \"tipo_name\": \"Customer\",
            \"db_action\": \"PUT\",
            \"data\" : {
              \"tipo_id\": \"123\",
              \"first_name\": \"ABC\",
              \"last_name\": \"XYZ\"
            }
          },
          {
            \"tipo_name\": \"PurchaseOrder\", //Yes, it doesn't have to be the same tipo as the tipo_name in the request.
            \"db_action\": \"PUT\",
            \"data\" : {
              \"tipo_id\": \"111\",
              \"order_amount\": 1000.00
              \"ordered_product\" : 123 
            }
            
          }
      ]

  ### server_dependencies  ###
  List of Tipos required to reference by the function. In the TipoDefinition an array of Tipos and tipo_filters are defined. When fetching a tipo tipo_filters.
  
  In the TipoDefinition configuraiton for server dependecies is captured under various actions. 
  
  Server dependency is an array with each containing the following:
  1. tipo_name
  2. tipo_filter - explained further below.
  
  
  *** Example of server dependencies object ***

     [
        {
          \"tipo_name\": \"Countries\",
          \"data\" : [{
            \"tipo_id\": \"123\",
            \"country_name\": \"Australia\",
            \"country_code\": \"AU\"
          },
          {
            \"tipo_id\": \"124\",
            \"country_name\": \"New Zealand\",
            \"country_code\": \"NZ\"
          }]
        },
        {
          \"tipo_name\": \"PurchaseOrder\",
          \"data\" : [{
            \"tipo_id\": \"111\",
            \"order_amount\": 1000.00
            \"ordered_product\" : 123 
          }]
          
        }
      ]

  ### Tipo Function Output  ###
  
  #### Scenario 1 ####
    
    *** TipoFunction Output - Scenario to continue processing request ***
    ** To continue processing data - simply return body with tipo data as below **
    ** The following response will result in deletion of Customer 123 and update or create to PurchaseOrder 111. **

        [
          {
            \"tipo_name\": \"Customer\",
            \"db_action\" : \"DELETE\", // Optionally return db_action, can be same as http_method or different as need be.
            \"data\" : {
              \"tipo_id\" : \"123\",
              \"first_name\": \"ABC\",
              \"last_name\": \"XYZ\"
            }
          },
          {
            \"tipo_name\": \"PurchaseOrder\", //Yes, it doesn't have to be the same tipo as the tipo_name in the request.
            \"db_action\" : \"PUT\", // Optionally return db_action, can be same as http_method or different as need be. 
            \"data\" : {
              \"tipo_id\": \"111\",
              \"order_amount\": 1000.00,
              \"ordered_product\" : 123 
            }
            
          }
        ]

  #### Scenario 2 ####
    *** TipoFunction Output - Scenario to stop processing and return to client ***
    *** In this case, no further processing is done. Simply response is returned to client without executing further database activity or post funciton. The main difference status_code. If there is status_code in the response from the function, it is assumed that no further processing is required. It is assumed that all the items in the reponse array are same. ***

      [
        { 
          \"tipo_name\" : \"Customer\",
          \"status_code\": 200,
          \"message\" : \"\", // only if error
          \"stack_trace\" : \"\", // only if error
          \"data\" : {
              \"tipo_id\" : \"123\",
              \"first_name\": \"ABC\",
              \"last_name\": \"XYZ\"
          }
        },
        {
          \"tipo_name\" : \"PurchaseOrder\",
          \"status_code\": 200,
          \"message\" : \"\", // only if error
          \"stack_trace\" : \"\", // only if error
          \"data\" : {
              \"tipo_id\" : \"111\",
              \"order_amount\": 1000.00,
              \"ordered_product\" : 123 
          }
        }
      ]