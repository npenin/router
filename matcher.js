module.exports = function(pattern) {
	if (typeof pattern !== 'string') { // regex
		return function(url) {
			return url.match(pattern);
		};
	}
	var keys = [];
	
	pattern = pattern.replace(/:(\w+)/g, '{$1}'); // normalize
	pattern = pattern.replace(/(\/)?(\.)?\{([^}]+)\}(?:\(([^)]*)\))?(\?)?/g, function(match, slash, dot, key, capture, opt, offset) {
		var incl = (pattern[match.length+offset] || '/') === '/';

		keys.push(key);
		
		return (incl ? '(?:' : '')+(slash || '')+(incl ? '' : '(?:')+(dot || '')+'('+(capture || '[^/]+')+'))'+(opt || '');
	});
	pattern = pattern.replace(/([\/.])/g, '\\$1').replace(/\*/g, '(.+)');
	pattern = new RegExp('^'+pattern+'[\\/]?$', 'i');

	return function(str) {
		var match = str.match(pattern);

		if (!match) {
			return match;
		}
		var map = {};
		
		match.slice(1).forEach(function(param, i) {
			var k = keys[i] = keys[i] || 'wildcard';

			map[k] = map[k] ? [].concat(map[k]).concat(param) : param;
		});
		
		return map;
	};	
};