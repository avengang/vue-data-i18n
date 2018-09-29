function install(Vue, options) {
  var data = options.data
  var dir = options.dir
  var config = options.config
  var i18nObj = {}
  var defaultLang = options.default
  if(data) {
    for(var langIndex = 0; langIndex < config.length; langIndex++) {
    	var langObj = i18nObj[config[langIndex]] = {}
    	for(var i = 0, ii = data.length; i < ii; i++) {
    		langObj[data[i][0]] = data[i][langIndex]
    	}
    }
  } else {
    var tempLangData = null
    var keyArr = Object.keys(options)
    for(var i = 0, ii = keyArr.length; i < ii; i++) {
      var k = keyArr[i]
      if(k === 'data' || k === 'config' || k === 'callback') continue
      tempLangData = i18nObj[k] = options[k]
    }
    if(tempLangData && !i18nObj[defaultLang]) {
      i18nObj[defaultLang] = {}
      for(var k in tempLangData) {
        i18nObj[defaultLang][k] = k 
      }
    }
  }
  var regex = /\((.*?)\)/gm
  var cache = {}
  Vue.mixin({
    created: function () {
      if(this._uid === 1) {
        this.$watch('g.__language__', function (newVal, oldVal) {
          options.callback && options.callback(newVal, oldVal)
        })
      }
    }
  })
  Vue.prototype.$t = window.VueData.$t = function(str) {
    var lang = this.g.__language__
    if(!lang) lang = (config&&config.length) ? config[0] : defaultLang
    if(cache[lang] && cache[lang][str]) return cache[lang][str]
    var oldStr = str
    var _this = this
    str = str.replace(/\[[^\]]*\]/gm, '')
    var index = str.indexOf('(')
    if(index !== -1) {
      var matchArr = []
      var exp = null
      while((exp = regex.exec(str)) !== null) {
        var v = ''
        if(_this.hasOwnProperty(exp[1])) {
          v += _this[exp[1]]
        } else if(_this.g[exp[1]]) {
          v += _this.g[exp[1]]
        } else {
          v = exp[1]
        }
        matchArr.push(v)
      }
    }
    var key = oldStr.replace(/\([^\)]*\)/gm, '()')
    if(i18nObj[lang][key]) {
      var result = i18nObj[lang][key].replace(/\[[^\]]*\]/gm, '')
      var matchArrIndex = 0
      while(result.indexOf('(') !== -1) {
        result = result.replace('()', matchArr[matchArrIndex])
        matchArrIndex++
      }
      if(!cache[lang]) cache[lang] = {}
      cache[lang][str] = result
      return result
    }
    return ''
  }
}
export default install