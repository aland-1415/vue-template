import axios from 'axios'//引入axios
import { Loading,Message } from 'element-ui';//引入Loading服务
import Router from '@/router/index';

let loading;
function startLoading() {
  loading  = Loading.service({
    lock:true, //是否锁定
    text:'拼命加载中...',//加载中需要显示的文字
    background:'rgba(0,0,0,.7)',//背景颜色
  });
}
//结束加载动画
function endLoading() {
  loading.close();
}
/*//请求拦截*/
axios.interceptors.request.use(config=>{
   startLoading()
  return config;
},error => {
  return Promise.reject(error)
})
/*//相应拦截*/
axios.interceptors.response.use(response=>{
  /*//结束加载动画*/
  endLoading()
  return response;
},error => {
  //错误提醒
  endLoading()//如果错误也结束动画
  /*alert("返回数据："+error);*/
  if(500 === error.response.status){
   Router.push({path:'/500'});
  }else if(404 === error.response.status){
    Router.push({ path:'/404'});
  }else if(502 === error.response.status){
    this.vue.router.push({path:'/502'});
    Router.push({ path:'/502'});
  }
  /*Message.error(error);*/
  return Promise.reject(error)
})
/*//导出axios  在main.js中可以引入*/
export default axios
