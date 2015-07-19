(function() {
	var app = angular.module('printer', ['nvd3ChartDirectives']);

	app.directive('printerHeader', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/printer-header.html'
		};
	});
	app.directive('printerData', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/printer-data.html',
			controller: function($scope, $http) {
				var api_url = 'http://emulatron.zapto.org:5000/api';
				var api_key = '5F99911C5462436E885F6F78BC8484D9';

				$scope.printer = {};
				$scope.job = {};
				$scope.temperature_data = [];
				$scope.connected = true;

				var bed_actual = [];
				var extruder_actual = [];
				var bed_target = [];
				var extruder_target = [];

				var update = function() {
					$http.defaults.headers.common['X-Api-Key'] = api_key;
					$http.get(api_url + '/printer?history=true&limit=60').success(function(data, status) {
						$scope.connected = true;
						$scope.printer = data;

						var getLastElements = function(array, number) {
							if (array.length <= number) {
								return array;
							} else {
								return array.slice(array.length - number);
							}
						};

						var parseData = function(data) {
							for (var i in data.temperature.history) {
								var time = data.temperature.history[i].time;
								bed_actual.push([time, data.temperature.history[i].bed.actual]);
								extruder_actual.push([time, data.temperature.history[i].tool0.actual]);
								bed_target.push([time, data.temperature.history[i].bed.target]);
								extruder_target.push([time, data.temperature.history[i].tool0.target]);
							}

							bed_actual = getLastElements(bed_actual, 20);
							extruder_actual = getLastElements(extruder_actual, 20);
							bed_target = getLastElements(bed_target, 20);
							extruder_target = getLastElements(extruder_target, 20);

							return [{
								key: 'Heat Bed Actual',
								values: bed_actual,
								color: '#ff4d4d'
							}, {
								key: 'Extruder Actual',
								values: extruder_actual,
								color: '#ff0000'
							}, {
								key: 'Heat Bed Target',
								values: bed_target,
								color: '#0000ff'
							}, {
								key: 'Extruder Target',
								values: extruder_target,
								color: '#4d4dff'
							}];
						};
						$scope.temperature_data = parseData(data);
					}).error(function(data) {
						$scope.connected = false;
					});
					$http.get(api_url + '/job').success(function(data, status) {
						$scope.job = data;
					});
				};
				update();
				setInterval(update, 2000);
			},
			controllerAs: 'dataCtrl'
		};
	});
	app.directive('printerStatus', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/printer-status.html'
		};
	});
	app.directive('currentJob', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/current-job.html'
		};
	});
	app.directive('temperatureGraph', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/temperature-graph.html'
		};
	});
	app.directive('temperatureAlert', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/temperature-alert.html'
		};
	});
	app.directive('connectionAlert', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/connection-alert.html'
		};
	});

	app.filter('secondsToTime', function() {
		return function(seconds) {
			return new Date(1970, 0, 1).setSeconds(seconds);
		};
	});
	app.filter('flooredToTenth', function() {
		return function(percent) {
			return Math.floor(percent * 10) / 10;
		};
	});
})();