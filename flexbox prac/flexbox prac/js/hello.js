var myApp=angular.module("creatingApp",[]);
myApp.controller("carousel",function($scope,$http){
$scope.results=[{Image:"images/guitar.jpg",Data:"This is guitar"},{Image:"images/img-hiker.jpg",Data:"This is a hiker"},{Image:"images/blog-post-header.jpg"}];

$scope.counter=0;
$scope.next=function(){
	$scope.counter++;
	if($scope.counter >2)
		$scope.counter=0;
}
$scope.previous=function(){
	$scope.counter--;
	if($scope.counter <0)
		$scope.counter=2;
}
$scope.showMe=false;
$scope.displayProduct=function(){
	
	$scope.showMe=!$scope.showMe;
	
}
$scope.second=false;
$scope.displayNav=function(){
	
	$scope.second=!$scope.second;
	
}
});

