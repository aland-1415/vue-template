import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import axios from './components/common/httploading.js';
import pagetable from './components/custom/pagetable';

Vue.component('pagetable', pagetable);
Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        // next('/login');
        localStorage.setItem('ms_username', 'Admin');
        next();
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});
new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');


Vue.prototype.$axios = axios;
ElementUI.Dialog.props.closeOnClickModal.default = false;  //点击遮罩不关闭dialog
// ElementUI.MessageBox.setDefaults({closeOnClickModal: false}); //点击遮罩不关闭MessageBox

//自定义全局方法
//jsonbody形式post
Vue.prototype.postBody = function(url, data, succesCallBack){
    url = this.envUrl(url);
    Vue.prototype.$axios({
        url: url,
        method:"post",
        data: data,
    }).then(function (res) {
        if(!res.data.success) {
            Vue.prototype.$message.error(res.data.message)
            return
        }
        if (typeof succesCallBack === "function"){
            succesCallBack(res.data);
        }
    }).catch(err => {alert("网络错误: " + err)});
};

//form请求提交
Vue.prototype.submitFormData = function(url, data, succesCallBack){
    url = this.envUrl(url);
    axios({
        url: url,
        method:"post",
        data: data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: (obj) => {
            var str = [];
            for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        }
    }).then(function (res) {
        if (typeof succesCallBack === "function"){
            succesCallBack(res.data);
        }
    }).catch(err => {alert("网络错误: " + err)});
};

//PageData类型分页表格加载
Vue.prototype.tableLoad = function (tableData, page) {
    tableData.page = page;
    var queryData = {page : page, size : tableData.size, params : JSON.stringify(tableData.params)};
    this.submitFormData(tableData.url, queryData,
        resData=>{
            tableData.total = resData.total;
            tableData.data = resData.rows;
        });
};
//用于重置form表单,ignoreProps为忽略重置的属性名
Vue.prototype.clearObjectVal = function(obj, ignoreProps = []){
    for (let prop in obj){
        if (ignoreProps.indexOf(prop) == -1){
            obj[prop] = '';
        }
    }
};
//关闭指定tab页
Vue.prototype.closeTab = function(path){
    let closeTag = window.document.querySelector('.tags-li [href *= "' + path + '"] + .tags-li-icon .el-icon-close');
    closeTag != null && closeTag.click();
}

//对测试环境的前端定位到后端为8081
Vue.prototype.envUrl = function(url) {
    //如果自带前缀则不处理
    if (url != undefined && url.indexOf("http") == -1){
        //对于localhost的本地调试代码都重新修改到8081后台去
        if (window.location.href.indexOf("localhost:8080") != -1){
            url = "http://localhost:8081/" + url;
        }
    }
    return url;
}

//如果是从其他页面带参数跳转的，刷新跳转组件已有的缓存
Vue.mixin({
    beforeRouteLeave: function(to, from, next){
        let needClearCache = JSON.stringify(to.params) != '{}';
        if (needClearCache){
            let componentName = to.name;
            let cache = this.$vnode.parent.componentInstance.cache;
            let keys = this.$vnode.parent.componentInstance.keys;
            for (let index in keys){
                if(keys[index].indexOf(componentName) != -1){
                    delete cache[keys[index]];
                }
            }
        }
        next();
    }
})
