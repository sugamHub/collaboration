var app = angular.module("taskApp", []);

app.factory('socket', function ($rootScope) {
	var socket = io.connect();
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {	
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});

app.controller("TaskCtrl", function($scope, socket) {
	// Socket listeners
	// ================
	socket.on('init', function (data) {
		$scope.tasks = data.tasks;
		$scope.name = data.name;
		$scope.users = data.users;
	});
	
	socket.on('tasks:refresh', function(data) {
		$scope.tasks = data;
	});
	
	socket.on('tasks:toggled', function(data) {
		//console.log($scope.tasks[n].done);
		var i, task;
		for (i = 0; i < $scope.tasks.length; i++) {
			task = $scope.tasks[i];
			console.log(data.id);
			console.log(task.id);
			if (data.id === task.id) { console.log(task.done);
				task.done = (task.done) ? false : true ; console.log(task.done);
				break;
			}
		}
	});
	
	socket.on('tasks:add', function(data) {
		$scope.tasks.push({
			"id":($scope.tasks.length),
			"text":data.task,
			"done":false
		});
	});
	
	socket.on('user:join', function(data) {
		$scope.users.push(data.name);
		$scope.messages.push({
			classname: 'system',
			user: 'system',
			text: 'User ' + data.name + ' has joined.'
		});
	});

	socket.on('user:message', function (message) {
		$scope.messages.push(message);
	});

	socket.on('user:rename', function (data) {
		changeName(data.oldName, data.newName);
	});

	socket.on('user:left', function (data) {
		$scope.messages.push({
			classname: 'system',
			user: 'system',
			text: 'User ' + data.name + ' has left.'
		});
		var i, user;
		for (i = 0; i < $scope.users.length; i++) {
			user = $scope.users[i];
			if (user === data.name) {
				$scope.users.splice(i, 1);
				break;
			}
		}
	});
	
	
	
	// Private helpers
	// ===============
	var changeName = function (oldName, newName) {
		// rename user in list of users
		var i;
		for (i = 0; i < $scope.users.length; i++) {
			if ($scope.users[i] === oldName) {
				$scope.users[i] = newName;
			}
		}
		
		$scope.messages.push({
			classname: 'system',
			user: 'system',
			text: 'User ' + oldName + ' is now known as ' + newName + '.'
		});
	}
	
	
	
	// Methods published to the scope
	// ==============================
	$scope.addTodo = function() {
		socket.emit('tasks:add', {
			task: $scope.todoText
		});
		
		$scope.tasks.push({
			"id":($scope.tasks.length),
			"text":$scope.todoText,
			"done":false
		});
		
		$scope.todoText = '';
	};
	
	$scope.todoClick = function(id) {
		socket.emit('tasks:toggled', {
			"id": id
		});
	};
 
	$scope.remaining = function() {
		var count = 0;
		angular.forEach($scope.tasks, function(task) {
			count += task.done ? 0 : 1;
		});
		return count;
	};
 
	$scope.archive = function() {
		var oldTasks = $scope.tasks;
		$scope.tasks = [];
		angular.forEach(oldTasks, function(task) {
			if (!task.done) $scope.tasks.push(task);
		});
		
		socket.emit('task:cleanup', $scope.tasks );
	};
	
	$scope.changeName = function () { console.log('changing name?');
		socket.emit('user:rename', {
			name: $scope.newName
		}, function (result) {
			if (!result) {
				alert('There was an error changing your name');
			} else {
				
				changeName($scope.name, $scope.newName);

				$scope.name = $scope.newName;
				$scope.newName = '';
			}
		});
	};

	$scope.messages = [];

	$scope.sendMessage = function () {
		socket.emit('user:message', {
			classname: 'user',
			user: $scope.name,
			message: $scope.message
		});

		// add the message to our model locally
		$scope.messages.push({
			classname: 'user',
			user: $scope.name,
			text: $scope.message
		});

		// clear message box
		$scope.message = '';
	};
});