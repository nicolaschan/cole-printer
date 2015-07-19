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
			$scope.printer = {};
			$scope.job = {};
			$scope.temperature_data = [];

			var update = function() {
				$http.defaults.headers.common['X-Api-Key'] = '5F99911C5462436E885F6F78BC8484D9';
				$http.get('http://emulatron.zapto.org:5000/api/printer?history=true&limit=8').success(function(data, status) {
					$scope.printer = data;
					var parseData = function(data) {
						var bed_actual = [];
						var extruder_actual = [];
						var bed_target = [];
						var extruder_target = [];
						for (var i in data.temperature.history) {
							var time = data.temperature.history[i].time;
							bed_actual.push([time, data.temperature.history[i].bed.actual]);
							extruder_actual.push([time, data.temperature.history[i].tool0.actual]);
							bed_target.push([time, data.temperature.history[i].bed.target]);
							extruder_target.push([time, data.temperature.history[i].tool0.target]);
						}
						return [{
							key: 'Heat Bed Actual',
							values: bed_actual
						}, {
							key: 'Extruder Actual',
							values: bed_actual
						}, {
							key: 'Heat Bed Target',
							values: bed_actual
						}, {
							key: 'Extruder Target',
							values: bed_actual
						}];
					};
					$scope.temperature_data = parseData(data);
				});
				$http.get('http://emulatron.zapto.org:5000/api/job').success(function(data, status) {
					$scope.job = data;
				});
			};
			update();
			setInterval(update, 1000);
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

app.filter('secondsToTime', function() {
	return function(seconds) {
		return new Date(1970, 0, 1).setSeconds(seconds);
	};
});
app.filter('flooredPercentToTenth', function() {
	return function(proportion) {
		return Math.floor(proportion * 1000) / 10;
	};
});