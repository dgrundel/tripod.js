var perf = function(testName) {
	this.testName = testName;
	this.formattedTestName = '<span class="testName">' + testName + '</span>';
	this.iterations = perf.config.defaultIterations;
	this.setups = [];
	this.tests = [];
	this.teardowns = [];
	this.lastRunTime = 0;
	
	return this;
};

perf.prototype.setIterations = function(iterations) {
	this.iterations = iterations;
	return this;
}

perf.prototype.test = function(callback) {
	this.tests.push(callback);
	return this;
}

perf.prototype.setup = function(callback) {
	this.setups.push(callback);
	return this;
}

perf.prototype.teardown = function(callback) {
	this.teardowns.push(callback);
	return this;
}

perf.prototype.run = function() {
	var t0;
	var t1;
	var namespace = {};
	var error = false;
	var runAll = function(arrayOfFunctions) {
		for(var i = 0, l = arrayOfFunctions.length; i < l; i++) {
			try {
				arrayOfFunctions[i](namespace);
			} catch(e) {
				if(e.message) {
					perf.log(e.message, 'error');
				} else if(typeof e === 'string') {
					perf.log(e, 'error');
				}
				return false;
			}
		}
	}
	
	runAll(this.setups);

	t0 = performance.now();
	for(var iterationIndex = 0; iterationIndex < this.iterations; iterationIndex++) {
		if(runAll(this.tests) === false) {
			perf.log('Exception thrown, ' + this.formattedTestName + ' ended prematurely.', 'alert');
			error = true;
			break;
		}
	}
	t1 = performance.now();

	runAll(this.teardowns);

	if(error !== true) {
		this.lastRunTime = (t1 - t0);
		perf.log(this.formattedTestName + ' (x ' + this.iterations + ') <span class="time">' + this.lastRunTime.toFixed(8) + ' ms</span>');
	}

	return this;
}

perf.log = function(message, cssClass) {
	var messageNode = document.createElement('li');
	if(cssClass) {
		messageNode.className = cssClass;
	}
	messageNode.innerHTML = (message + '').replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
	perf.config.logNode.appendChild(messageNode);

	return this;
}

perf.compare = function() {
	var fastest = null;
	for(var i = 0, l = arguments.length; i < l; i++) {
		if(typeof arguments[i] === 'string') {
			perf.log(arguments[i], 'note');

		} else {
			if(arguments[i].lastRunTime === 0) {
				arguments[i].run();
			}
			if(fastest === null || arguments[i].lastRunTime < fastest.lastRunTime) {
				fastest = arguments[i];
			}
		}
	}

	perf.log(fastest.formattedTestName + ' is fastest.', 'result');
}

perf.config = {
	defaultIterations: 500000,
	logNode: document.getElementById('testLog')
};