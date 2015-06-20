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