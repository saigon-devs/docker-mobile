'use strict';
import "moment"
import "urish/angular-moment"
import "zachsoft/Ionic-Material/dist/ionic.material"

export function AppCtrl($scope) {
  $scope.setting = {
    hasMenuToggle: false,
    isExpanded: false,
    hasHeaderFabLeft: false,
    hasHeaderFabRight: false
  }

  $scope.hideNavBar = function () {
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
  }

  $scope.showNavBar = function () {
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
  }

  $scope.noHeader = function () {
    var content = document.getElementsByTagName('ion-content');
    for (var i = 0; i < content.length; i++) {
      if (content[i].classList.contains('has-header')) {
        content[i].classList.toggle('has-header');
      }
    }
  };

  $scope.setMenuToggle = (bool)=> {
    $scope.setting.hasMenuToggle = bool
  }

  $scope.setExpanded = function (bool) {
    $scope.setting.isExpanded = bool
  }

  $scope.setHeaderFab = function (location) {
    var hasHeaderFabLeft = false
    var hasHeaderFabRight = false

    switch (location) {
      case 'left':
        hasHeaderFabLeft = true
        break
      case 'right':
        hasHeaderFabRight = true
        break
    }

    $scope.setting.hasHeaderFabLeft = hasHeaderFabLeft
    $scope.setting.hasHeaderFabRight = hasHeaderFabRight
  }

  $scope.hasHeader = function () {
    var content = document.getElementsByTagName('ion-content');
    for (var i = 0; i < content.length; i++) {
      if (!content[i].classList.contains('has-header')) {
        content[i].classList.toggle('has-header');
      }
    }
  }

  $scope.hideHeader = function () {
    $scope.hideNavBar()
    $scope.noHeader()
  }

  $scope.showHeader = function () {
    $scope.showNavBar()
    $scope.hasHeader()
  }

  $scope.clearFabs = function () {
    var fabs = document.getElementsByClassName('button-fab');
    if (fabs.length && fabs.length >= 1) {
      console.log(fabs.length)
      fabs[0].remove();
    }
  };
}

export function ImagesCtrl($scope, $ionicLoading, $state, $ionicHistory, $ionicPopup, ionicMaterialMotion,
                           $timeout, imageService, currentDockerEndpoint) {
  $scope.search = {
    filterString: '',
    minLength: 3,
    isShow: false
  }

  $scope.images = []

  $scope.$on('$ionicView.beforeEnter', function () {
    //set header
    $scope.$parent.showHeader()
    $scope.$parent.setMenuToggle(true)
  });

  $scope.$on('$ionicView.enter', ()=> {
    $timeout(()=>{
      //todo: move this code to dashboard in future
      if (currentDockerEndpoint.ip === '') {
        $ionicHistory.nextViewOptions({
          historyRoot: true
        })
        $state.go('app.servers')
      }
      else{
        $scope.search.isShow = false
        if ($scope.images.length === 0) {
          $scope.searchImages()
        }
      }
    }, 500)
  })

  $scope.clearSearch = ()=> {
    $scope.search.value = ''
  }

  $scope.searchImages = () => {
    let options = {
      queryData: {all: 0}
    }
    if ($scope.search.filterString.length >= $scope.search.minLength) {
      options.queryData["filter"] = '*' + $scope.search.filterString + '*'
    }
    if ($scope.search.filterString.length === 0 || $scope.search.filterString.length >= $scope.search.minLength) {
      $ionicLoading.show();

      imageService.getAllImages(options)
        .then((result)=> {
          $scope.images = result.data
          setTimeout(function () {
            ionicMaterialMotion.ripple();
          }, 500);
        })
        .then(()=> {
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide()
        })
        .catch((reason)=> {
          $ionicLoading.hide()
          $scope.$broadcast('scroll.refreshComplete');

          $ionicPopup.alert({
            title: 'Error',
            template: 'Cannot connect to docker server.'
          });
        })
    }
  }
}

export function ImageDetailCtrl($scope, $ionicLoading, $stateParams, imageService) {
  $scope.currentImage = {}
  $scope.title = $stateParams.imageName

  $scope.$on('$ionicView.beforeEnter', function () {
    //set header
    $scope.$parent.showHeader()
    $scope.$parent.setMenuToggle(false)
  });

  $scope.$on('$ionicView.enter', ()=> {
    $scope.queryImageDetail()
  })

  $scope.queryImageDetail = ()=> {
    $ionicLoading.show()
    var option = {
      queryData: {
        imageId: $stateParams.imageId
      }
    }

    imageService.getImageDetail(option)
      .then((result)=> {
        console.log(result.data)
        $scope.currentImage = result.data
      })
      .then(()=> {
        $ionicLoading.hide()
      })
      .catch((reason)=> {
        $ionicLoading.hide()
        $ionicPopup.alert({
          title: 'Error',
          template: 'Cannot connect to docker server.'
        });
      })
  }
}

export function ServerCtrl($scope, $ionicLoading, $state, $ionicHistory,
                           dataService, currentDockerEndpoint) {

  $scope.$on('$ionicView.beforeEnter', function () {
    //set header
    $scope.$parent.showHeader()
    $scope.$parent.setMenuToggle(true)
  })

  $scope.data = {
    servers: [],
    selectedServerId: 0
  }

  $scope.currrentSelectedServer = 0

  loadAllServers()

  function loadAllServers() {
    $ionicLoading.show()
    dataService.loadAllServers()
      .then(
      (res)=> {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            if (res.rows.item(i).isSelected === 1) {
              $scope.data.selectedServerId = res.rows.item(i).id
            }
            $scope.data.servers.push({
              id: res.rows.item(i).id,
              ip: res.rows.item(i).ip,
              port: res.rows.item(i).port
            });
          }
        }
        else {
          $scope.data.servers = []
        }
        $ionicLoading.hide()
      },
      (err)=> {
        console.log(err)
        $ionicLoading.hide()
      }
    )
  }

  $scope.selectServer = (serverId, ip, port)=> {
    dataService.selectDockerEndpoint(serverId)
      .then(()=> {
        currentDockerEndpoint.ip = ip
        currentDockerEndpoint.port = port

        $ionicHistory.nextViewOptions({
          historyRoot: true
        })
        $state.go('app.images')
      })
      .catch((err)=> {
        console.log(err)
      })

  }
}

export function ContainersCtrl($scope, $timeout, ionicMaterialInk, ionicMaterialMotion) {
}