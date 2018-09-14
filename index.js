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
      var matchStrTotalLen = 0
      while((exp = regex.exec(str)) !== null) {
        matchArr.push({
          value: _this[exp[1]],
          index: exp.index - matchStrTotalLen
        })
        matchStrTotalLen += exp[0].length
      }
    }
    var key = oldStr.replace(/\([^\)]*\)/gm, '')
    if(i18nObj[this.g.$language][key]) {
      var result = i18nObj[this.g.$language][key].replace(/\[[^\]]*\]/gm, '')
      var totalLen = 0
      for(var i = 0, ii = matchArr.length; i < ii; i++) {
        result = result.substring(0, matchArr[i].index + totalLen) + matchArr[i].value + result.substr(matchArr[i].index + totalLen)
        totalLen += matchArr[i].value.length
      }
      cache[str] = result
      return result
    }
    return ''
  }
}
export default install