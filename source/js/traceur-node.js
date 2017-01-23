var traceur = require('traceur');
var fs = require('fs');

// 將ES6腳本轉換為字符串
var contents = fs.readFileSync('main.js').toString();

var result = traceur.compile(contents, {
	filename: 'main.js',
	sourceMap: true,
	// 其他設置
	modules: 'commonjs'
});

if (result.error)
  throw result.error;

console.log(result);

// result對象的js屬性就是轉換後的ES5代碼
fs.writeFileSync('out.js', result);
// sourceMap屬性對應map文件
fs.writeFileSync('out.js.map', result.sourceMap);