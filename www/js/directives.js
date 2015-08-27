export function searchBar() {
  return {
    scope: {
      searchOption: '=',
      queryData: '&'
    },
    restrict: 'E',
    replace: true,
    template: `
			<div class="searchBar">
				<div class="searchTxt" ng-show="searchOption.isShow">
					<div class="bgdiv"></div>
					<div class="bgtxt">
						<input type="input" placeholder="   Search...." id="searchBarTxtBox"
									 ng-change="query()"	ng-model="searchOption.filterString">
					</div>
				</div>
				<i class="icon placeholder-icon ion-search light"
						ng-click="searchOption.txt=\'\'; searchOption.isShow= !searchOption.isShow"></i>
			</div>`,

    controller: function ($scope, $ionicNavBarDelegate) {
      let title;

      $scope.query = function () {
        $scope.queryData()
      }

      $scope.$watch('searchOption.isShow', function (showing, oldVal) {
        if (showing !== oldVal) {

          if (showing) {
            title = $ionicNavBarDelegate.title()
            $ionicNavBarDelegate.title('')
            setTimeout(function(){
              angular.element(document.querySelector('#searchBarTxtBox'))[0].focus()
            }, 100)

          }
          else {
            $ionicNavBarDelegate.title(title)
          }
        }
        else if (!title) {
          title = $ionicNavBarDelegate.title()
        }
      })
    },

  }
}