import "ionic/js/ionic";
import "angular";
import "angular-animate";
import "angular-ui-router";
import "angular-sanitize";
import "ionic/js/ionic-angular";
import "zachsoft/Ionic-Material/dist/ionic.material"

import * as appConfig from "js/appConfig"
import * as controllerLib from "js/controllers";
import * as serviceLib from "js/services";
import * as directiveLib from 'js/directives'

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('docker-client', ['ionic', 'ionic-material', 'angularMoment'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(appConfig.Configure)

.constant('$ionicLoadingConfig', {
  template: '<ion-spinner></ion-spinner>Loading...'
})

.factory('settingService', serviceLib.settingService)

.factory('imageService', serviceLib.imageService)

.controller('AppCtrl', controllerLib.AppCtrl)

.controller('ImagesCtrl', controllerLib.ImagesCtrl)

.controller('ImageDetailCtrl', controllerLib.ImageDetailCtrl)

.controller('ContainersCtrl', controllerLib.ContainersCtrl)

.directive('searchBar', directiveLib.searchBar)


