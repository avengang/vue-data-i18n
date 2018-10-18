# vue-data-i18n
基于vue-data的vue国际化插件  

## 使用  
```
npm install vue-data-i18n -D
import vuedatai18n from 'vue-data-i18n'

this.$setLanguage('zh');//设置语言为zh
```  

### 国际化配置文件  
例如入口文件同目录下有 i18n.json
```
{
  "config": ["cn", "en"], //config数组第一个值将会默认作为翻译时的key来和$t的参数匹配
  "data": [
    ["()中()国()", "()china()()"] 
  ]
}
```  

### 入口js文件
```
import i18nData from './i18n.json'
Vue.use(vuedatai18n, i18nData) // i18nData是json字符串
```  

### script标签
```
data() {
  return {
    xx: '123',
    yy: 'sss',
    zz: 'ddd'
  }
},
console.log(this.$t("(xx)中(yy)国(zz)")) // 打印 中文：123中sss国ddd，英文：123chinasssddd
```
### template标签
```
<div>{{$t("(xx)中(yy)国(zz)")}}</div> // 页面展示：中文：123中sss国ddd，英文：123chinasssddd
```  

### 非vue实例对象的属性将会当成普通字符串原样输出
比如：
```
console.log(this.$t("(xx)中(yy)国(zz1)")) // 打印 中文：123中sss国zz1，英文：123chinassszz1
<div>{{$t("(xx)中(yy)国(zz1)")}}</div> // 页面展示：中文：123中sss国zz1，英文：123chinassszz1
```  
如果当前vue实例没有的属性会再往全局对象中取找，如果找到了就取全局属性值，再没找到就当成字符串输出。  

## 同名冲突处理
翻译文件中翻译主键值有可能会有不同的多语言翻译的情况，比如：  
```
{
  "config": ["cn", "en"], //config数组第一个值将会默认作为翻译时的key来和$t的参数匹配
  "data": [
    ["好的", "yes"], 
    ["好的", "ok"] // 只会最后一次出现的key生效
  ]
}
```  
要想都生效的话就需要用到中括号来区分了，如下：  
```
{
  "config": ["cn", "en"], //config数组第一个值将会默认作为翻译时的key来和$t的参数匹配
  "data": [
    ["好的[1]", "yes"], 
    ["好的[2]", "ok"] // 只会最后一次出现的key生效
  ]
}
```  
使用的时候同样要把中括号带上去选择：  
```
console.log(this.$t("好的[1]")) // 打印 中文：好的，英文：yes
<div>{{$t("好的[2]")}}</div> // 页面展示：中文：好的，英文：ok
```  
中括号是不会出现在翻译结果里面的。
### 第三方库国际化
可以通过语言切换回调方法做第三方国际化，比如：
```
import Vue from 'vue'
import { Menu, Submenu, MenuItem } from 'element-ui'
import vuedata from 'vue-data'
import vuedatai18n from 'vue-data-i18n'
import i18nData from './i18n.json'
import { beforeSend, beforeReceive } from './assets/util/ajaxHandler.js'

import App from './App.vue'
import router from './park-router'

import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'

Vue.use(vuedata)
Vue.use(vuedatai18n, {
  data: i18nData.data,
  config: i18nData.config,
  callback: function(newV, oldV) {
    // 设置语言
    if(newV === 'cn') {
      locale.use(zhLocale)
    } else {
      locale.use(enLocale)
    }
  }
})
Vue.component(Menu.name, Menu)
Vue.component(Submenu.name, Submenu)
Vue.component(MenuItem.name, MenuItem)
```
### 多个翻译文件
```
---src
----assets
-----languages
------cn.json
------en.json
```
en.json  
```
{
  "中国":"china"
}
```
默认的语言可以不用创建json文件，如果不存在默认的语言配置文件的话就会把其他配置文件的key作为值，比如cn.json  
### 非vue文件使用
在非vue文件中可以使用window.VueData.$t来做国际化操作。