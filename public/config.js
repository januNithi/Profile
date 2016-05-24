
myApp.config(function($routeProvider,$locationProvider) {

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    $routeProvider
        .when('/', {
            templateUrl: '../views/templates/login.html',
            controller: 'loginController'
        })
        .when('/profile', {
            templateUrl: '../views/templates/personalInfo.html',
            controller: 'profileController'
        })
        .when('/changePassword', {
            templateUrl: '../views/templates/changePassword.html',
            controller: 'passwordChangeController'
        })
        .when('/adminDashboard', {
            templateUrl: '../views/templates/AdminDashboard.html',
            controller: 'adminDashboardController'
        })
        .when('/adminProfile', {
           templateUrl: '../views/templates/adminProfile.html',
           controller: 'adminProfileController'
       	})
        .when('/logout', {
            templateUrl: '../views/templates/LogoutScreen.html',
            controller: 'logoutController'
        })
        .when('/chooseProfileViews',{
        	templateUrl: '../views/modal/chooseProfileViews.html',
        	controller:'profileViewModalController'
        })
        .when('/adminDocumentation',{
            templateUrl: '../views/templates/adminDocumentView.html',
            controller:'mainController'
        })
        .when('/documentList',{
            templateUrl: '../views/templates/documentList.html',
            controller:'ListController'
        })
        .otherwise({
            redirectTo: '/logout'
       	});
});

