/**
 * Created by Phuong on 8/13/2015.
 */
export function Configure($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
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
      controller: 'AppCtrl'
    })

    .state('app.images', {
      url: '/images',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-images.html',
          controller: 'ImagesCtrl'
        },
        'fabContent': {
          template: '<button id="fab-images" class="button"><i class="icon ion-plus"></i></button>',
          controller: function ($timeout) {
            $timeout(function () {
              document.getElementById('fab-images').classList.toggle('on');
              document.getElementById('fab-images').classList.add('button-fab','button-fab-bottom-right', 'expanded', 'button-energized-900','spin')
            }, 600);
          }
        }
      }
    })

    .state('app.image-detail', {
      url: '/image-detail/:imageId',
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
          template: '<button id="fab-activity" class="button button-fab button-fab-bottom-right expanded button-energized-900 spin"><i class="icon ion-plus"></i></button>',
          controller: function ($timeout) {
            $timeout(function () {
              document.getElementById('fab-activity').classList.toggle('on');
            }, 200);
          }
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/images');
}
