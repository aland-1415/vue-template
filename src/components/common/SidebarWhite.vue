<template>
    <div class="sidebar">
        <div v-show="showlogo" class="logo">&nbsp;&nbsp;<i class="el-icon-lx-noticefill"></i>后台管理系统</div>
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#fff"
            text-color="#2f3237"
            active-text-color="#3eaf7c"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            showlogo: true,
            items: [
                {
                    icon: 'el-icon-lx-file',
                    index: '0',
                    title: 'demo',
                    subs: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: '1',
                        title: '数据表格',
                        subs: [
                            {
                                index: 'table',
                                title: '基础表格',
                            },
                            {
                                index: 'pageTable',
                                title: '分页表格',
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-lx-copy',
                        index: 'tabs',
                        title: 'tab选项卡'
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: '3',
                        title: '表单相关',
                        subs: [
                            {
                                index: 'form',
                                title: '基本表单'
                            },
                            {
                                index: 'upload',
                                title: '文件上传'
                            }
                        ]
                    },
                    {
                        index: '3-2',
                        title: '三级菜单',
                        subs: [
                            {
                                index: 'editor',
                                title: '富文本编辑器'
                            },
                            {
                                index: 'markdown',
                                title: 'markdown编辑器'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-emoji',
                        index: 'icon',
                        title: '自定义图标'
                    },
                    {
                        icon: 'el-icon-pie-chart',
                        index: 'charts',
                        title: 'schart图表'
                    },
                    {
                        icon: 'el-icon-lx-lock',
                        index: 'permission',
                        title: '鉴权页面'
                    },
                    {
                        icon: 'el-icon-rank',
                        index: '6',
                        title: '拖拽组件',
                        subs: [
                            {
                                index: 'drag',
                                title: '拖拽列表'
                            },
                            {
                                index: 'dialog',
                                title: '拖拽弹框'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-global',
                        index: 'i18n',
                        title: '国际化功能'
                    },
                    ]
                },
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
        this.getBreadcrumb(this.$route.path.replace('/', ''));
    },
    watch:{
        $route(newValue, oldValue){
            this.getBreadcrumb(newValue.path.replace('/', ''));
        },
        //优化logo在切换时的动画显示
        collapse(newV, oldV){
            if (newV){
                this.showlogo = !newV;
            } else {
                setTimeout(()=> {
                    this.showlogo = !newV;
                }, 300);
            }
        }
    },
    methods: {
        getBreadcrumb(index){
            let menuOrder = this.findItemByIndex(index, this.items);
            bus.$emit('breadcrumb', menuOrder);
        },
        findItemByIndex(index, items){
            let menuOrder = [];
            for (let i in items){
                if (items[i].index == index){
                    menuOrder.push(items[i].title);
                    break;
                }
                if (items[i].subs) {
                    let subMenuOrder = this.findItemByIndex(index, items[i].subs)
                    if (subMenuOrder.length > 0){
                        menuOrder.push(items[i].title);
                        menuOrder = menuOrder.concat(subMenuOrder);
                        break;
                    }
                }
            }
            return menuOrder;
        }
    }
};
</script>

<style scoped>
.logo {
    line-height: 55px;
    color: #2f3237;
    background: #fff;
    font-size: 22px;
    width: 200px;
}
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 0px;
    bottom: 0;
    z-index: 10;
}
.sidebar > ul::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 200px;
}
.sidebar > ul {
    height: calc(100% - 55px);
    overflow-y: scroll;
}
/*deep是与scoped相结合使用，用于只影响当前页面公共组件的样式，如果不加则样式修改不成功*/
/deep/.el-submenu__title i{
    color: white;
}
</style>
