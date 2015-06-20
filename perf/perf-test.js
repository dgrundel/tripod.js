perf.log('So, for some reason, I couldn\'t get to JSPerf today. This is the result.');

perf.log('Here\'s a really simple example test:');

new perf('Add two numbers')
	.test(function(namespace){
		var result = 2 + 2;
	})
	.run();

perf.log('...and now a little suite of tests that compares the results:');

perf.compare(
	'Testing methods to grab a template string from the DOM.',

	new perf('Template acquisition with attribute')
		.setup(function(namespace){
			namespace.attributeNode = document.getElementById('testNode');
		})
		.test(function(namespace){
			var templateString = namespace.attributeNode.getAttribute('data-test-attribute');
		}),

	new perf('Template acquisition with getElementById and attribute')
		.test(function(namespace){
			var templateString = document.getElementById('testNode').getAttribute('data-test-attribute');
		}),

	new perf('Template acquisition with getElementById and innerHTML')
		.test(function(){
			var templateString = document.getElementById('testTemplateNode').innerHTML;
		})
);

perf.log('...and this is why we cache the template string in a data attribute. ' +
	'binding modifiers already have the node available, so we have the best case scenario.');