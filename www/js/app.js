import "ionic/js/ionic";
import "angular";
import "angular-animate";
import "angular-ui-router";
import "angular-sanitize";
import "ionic/js/ionic-angular";
import "zachsoft/Ionic-Material/dist/ionic.material"
import "driftyco/ng-cordova/dist/ng-cordova.min"

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
angular.module('docker-client', ['ionic', 'ngCordova', 'ionic-material', 'angularMoment'])

  .run(function ($ionicPlatform, $cordovaSQLite, systemConfig) {
    $ionicPlatform.ready(function () {
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

      //setup db
      setupDb($cordovaSQLite, systemConfig)
    });

    function setupDb($cordovaSQLite, config){
      let db
      if(window.cordova) {
        // App syntax
        db = $cordovaSQLite.openDB(config.dbName);
      } else {
        // Ionic serve syntax
        db = window.openDatabase(config.dbName, "1.0", "docker mobile app", -1);
      }
      $cordovaSQLite.execute(db, `
        CREATE TABLE IF NOT EXISTS servers (id integer primary key AUTOINCREMENT, ip text, port text)
      `)
      $cordovaSQLite.execute(db, `
        INSERT INTO servers (ip, port) VALUES ('jackyu1404.cloudapp.net', 2375)
      `);
    }

  })

  .config(appConfig.Configure)

  .constant('$ionicLoadingConfig', {
    /*template: '<ion-spinner></ion-spinner>Loading...'*/
    template: `
      <div class="loader">
        <svg class="circular">
          <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle>
        </svg>
      </div>
    `
  })

  .constant('systemConfig', {
    dbName: 'docker-mobile.db'
  })

  .factory('settingService', serviceLib.settingService)

  .factory('imageService', serviceLib.imageService)

  .controller('AppCtrl', controllerLib.AppCtrl)

  .controller('ImagesCtrl', controllerLib.ImagesCtrl)

  .controller('ImageDetailCtrl', controllerLib.ImageDetailCtrl)

  .controller('ContainersCtrl', controllerLib.ContainersCtrl)

  .controller('ServerCtrl', controllerLib.ServerCtrl)

  .directive('searchBar', directiveLib.searchBar)


