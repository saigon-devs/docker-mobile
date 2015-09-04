/**
 * Created by Phuong on 8/13/2015.
 */
export function Configure($stateProvider, $urlRouterProvider) {
  //$ionicConfigProvider.views.maxCache(0);
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl',
      resolve:{
        'currentDockerEndpointService': (dataService) =>{
          return dataService.loadCurrentDockerEndpoint()
        }
      }
    })

    .state('app.images', {
      url: '/images/:forceReload',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-images.html',
          controller: 'ImagesCtrl'
        },
        'fabContent': {
          template: ''
        }
      }
    })

    .state('app.image-detail', {
      url: '/image-detail/:imageId/:imageName',
      views: {
        'menuContent': {
          templateUrl: 'templates/image-detail.html',
          controller: 'ImageDetailCtrl'
        },
        'fabContent': {
          template: ''
        }
      }
    })

    .state('app.containers', {
      url: '/containers',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-containers.html',
          controller: 'ContainersCtrl'
        },
        'fabContent': {
          template: ''
        }
      }
    })

    .state('app.servers', {
      url: '/servers',
      views:{
        'menuContent':{
          templateUrl: 'templates/servers.html',
          controller: 'ServerCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/images/');
}
