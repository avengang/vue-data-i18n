function install(Vue, options) {
  var data = options.data
  var config = options.config
  var i18nObj = {}
  for(var langIndex = 0; langIndex < config.length; langIndex++) {
    var langObj = i18nObj[config[langIndex]] = {}
    for(var i = 0, ii = data.length; i < ii; i++) {
    	langObj[data[i][0]] = data[i][langIndex]
    }
  }
  Vue.mixin({
    created: function () {
      this.$vd('$language', config[0])
    }
  })
  var regex = /\((.*?)\)/gm
  var cache = {}
  Vue.prototype.$t = function(str) {
    if(cache[str]) return cache[str]
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
        } else {
          v = exp[1]
        }
        matchArr.push(v)
      }
    }
    var key = oldStr.replace(/\([^\)]*\)/gm, '()')
    if(i18nObj[this.g.$language][key]) {
      var result = i18nObj[this.g.$language][key].replace(/\[[^\]]*\]/gm, '')
      var matchArrIndex = 0
      while(result.indexOf('(') !== -1) {
        result = result.replace('()', matchArr[matchArrIndex])
        matchArrIndex++
      }
      cache[str] = result
      return result
    }
    return ''
  }
}
export default install