# vue-data-i18n
基于vue-data的vue国际化插件
## 使用  
```
npm install vue-data-i18n -D
import vuedatai18n from 'vue-data-i18n'
Vue.use(vuedatai18n, i18nData)
```
## vue文件
### script标签
```
data() {
  return {
    xx: '123',
    yy: 'sss',
    zz: 'ddd'
  }
},
console.log(this.$t("(yy)中(zz)国[abc](xx)")) // 打印 sss中ddd国123
```
### template标签
```
<div>{{$t("(yy)中(zz)国[abc](xx)")}}</div> // 页面展示：sss中ddd国123
```