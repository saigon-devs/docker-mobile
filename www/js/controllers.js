'use strict';
import "moment"
import "urish/angular-moment"


export function AppCtrl($scope) {
  $scope.isExpanded = false
  $scope.hasHeaderFabLeft = false
  $scope.hasHeaderFabRight = false

  $scope.hideNavBar = function () {
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
  }

  $scope.showNavBar = function () {
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
  }

  $scope.hideMenuToggle = ()=> {
    angular.element(document.querySelector('[menu-toggle="left"]'))[0].style.display = 'none';
  }

  $scope.showMenuToggle = ()=> {
    angular.element(document.querySelector('[menu-toggle="left"]'))[0].style.display = 'block';
  }

  $scope.noHeader = function () {
    var content = document.getElementsByTagName('ion-content');
    for (var i = 0; i < content.length; i++) {
      if (content[i].classList.contains('has-header')) {
        content[i].classList.toggle('has-header');
      }
    }
  };

  $scope.setExpanded = function (bool) {
    $scope.isExpanded = bool
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

    $scope.hasHeaderFabLeft = hasHeaderFabLeft
    $scope.hasHeaderFabRight = hasHeaderFabRight
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

export function ImagesCtrl($scope, $timeout, $ionicLoading, imageService, $ionicPopup) {
  $scope.search = {
    filterString: '',
    minLength: 3,
    isShow: false
  }

  $scope.images = []
  //set header
  $scope.$parent.showHeader()
  $scope.$parent.clearFabs()

  $scope.$on('$ionicView.enter', ()=> {
    $scope.search.isShow = false
    if ($scope.images.length === 0) {
      $scope.searchImages()
    }
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
        }).then(()=> {
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide()
        }).catch((reason)=> {
          $ionicLoading.hide()
          $scope.$broadcast('scroll.refreshComplete');
          console.log("Err: " + reason)
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

  //set header
  $scope.$parent.showHeader()
  $scope.$parent.clearFabs()
  $scope.$parent.hideMenuToggle()


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
      .catch((reason)=>{
        $ionicLoading.hide()
        $ionicPopup.alert({
          title: 'Error',
          template: 'Cannot connect to docker server.'
        });
      })
  }
}

export function ServerCtrl($scope, $timeout){
  $scope.servers = []

}

export function ContainersCtrl($scope, $timeout, ionicMaterialInk, ionicMaterialMotion) {
}