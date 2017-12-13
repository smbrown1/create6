var myApp = angular.module("myApp",["firebase"]);
myApp.controller("chatController", ["$scope", "$firebaseArray",

	function($scope, $firebaseArray) {
		$scope.name;
		$scope.logIn = false;
		$scope.inv = [];
		$scope.message = "You have not yet logged in";

		var inventory = firebase.database().ref().child("INV");
		var users = firebase.database().ref().child("users");		

		$scope.logout = function()
		{
			$scope.name = "";
			$scope.logIn = false;
	                $scope.inv = [];
	                $scope.message = "You have not yet logged in";
			$scope.$apply();
		}


		$scope.signIn = function(user) {
			console.log("SIGNING IN");
			users.once("value", function (snap) {
				snap.forEach( function(data){
//					console.log(user);
//					console.log(data.val());
					var temp = data.val();
					if(temp.username == user.name && temp.password == user.password)
					{      
						//console.log("1");
						$scope.logIn = true;
						$scope.name = user.name;
						$scope.message = "You are logged in as " + user.name;
						get();
						$scope.$apply();
						return;
					} else {
						//console.log("2");
						$scope.message = "Incorrect username or password";
						$scope.$apply();
					}
				});
			});
		}
		
		$scope.register = function(user)
		{
			users.once("value", function (snap){
					for (var u in snap.val()) { 
						var temp = snap.val()[u];
						if(temp.username == user.name)
						{
							$scope.message = "Username Already in use";
							$scope.apply();
							return;
						} 
					}

					users.push({
                                        	username: user.name,
                                                password: user.password,
                                                up: user.name+user.password
                                        });

					$scope.logIn = true;
                                        $scope.name = user.name;
		                        $scope.message = "You are logged in as " + user.name;								    
					get();
					$scope.$apply();
				});
		}

		$scope.addItem = function(item) {
			inventory.push({
				username: $scope.name,
				description: item.desc,
				image: item.url,
				amount: item.amount
			})
		}

		function get() {
		inventory.on("child_added", function(snapshot, prevChildKey) {
			var next = snapshot.val();
//			console.log(next)
//			console.log(prevChildKey);

			if(next.username == $scope.name)
			{
				$scope.inv.push(next);
			}
			$scope.$apply();
		});
		}

		$scope.isLogIn = function() {
			return $scope.logIn;
		}
	} 
]);
