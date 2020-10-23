<template>
    <div>
        <el-row style="margin-bottom: 20px;">
            <el-table v-bind:data="tableData.data" stripe  border>
                <!--自己写的el-table-column列展示在最前边-->
                <slot></slot>
                <template v-for="column in tableData.columns">
                    <!--自动id-->
                    <el-table-column
                            v-if="typeof(column.type) != 'undefined' && column.type.trim() == 'autoId'"
                            type="index"
                            :index="index => (tableData.page - 1) * tableData.size + index + 1"
                            :label="column.label"
                            :width="column.width"
                            :min-width="column.minWidth"
                            :align="column.align"
                            :fixed="column.fixed"
                            :sortable="column.sortable"
                            :resizable="column.resizable"
                            :header-align="column.headerAlign"
                            :style="column.style">
                    </el-table-column>
                    <!--自定义单元格内容-->
                    <el-table-column
                            v-else-if="typeof(column.templateScope) != 'undefined' && column.templateScope.trim() != ''"
                            :label="column.label"
                            :width="column.width"
                            :min-width="column.minWidth"
                            :align="column.align"
                            :fixed="column.fixed"
                            :sortable="column.sortable"
                            :type="column.type"
                            :resizable="column.resizable"
                            :header-align="column.headerAlign"
                            :style="column.style">
                        <template scope="scope">
                            <slot v-bind:name="column.templateScope" v-bind:row="scope.row"></slot>
                        </template>
                    </el-table-column>
                    <!--常规单元格内容，格式如下直接填写内容：-->
                    <!--<el-table-column prop="id" label="id" width="60" align="center" fixed></el-table-column>-->
                    <el-table-column v-else
                            :prop="column.prop"
                            :label="column.label"
                            :width="column.width"
                            :min-width="column.minWidth"
                            :align="column.align"
                            :fixed="column.fixed"
                            :sortable="column.sortable"
                            :type="column.type"
                            :resizable="column.resizable"
                            :header-align="column.headerAlign"
                            :style="column.style"
                    ></el-table-column>
                </template>
                <!--操作事件-->
                <el-table-column v-if=" typeof tableData.action != 'undefined' &&
                typeof(tableData.action.showAction) != 'undefined' && tableData.action.showAction == true"
                         :label="tableData.action.label"
                         :width="tableData.action.width"
                         :min-width="tableData.action.minWidth"
                         :header-align="tableData.action.headerAlign"
                         fixed="right"
                         align="center">
                    <template scope="scope">
                        <template v-for="act in tableData.action.actions">
                            <el-button v-if="typeof act.type != 'undefined' && act.type == 'button'" @click="act.callback(scope.row)">
                                {{act.name}}
                            </el-button>
                            <a v-else href="javascript:void(0)" @click="act.callback(scope.row)" style="color: #409eff;">
                                &nbsp;{{act.name}}&nbsp;
                            </a>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination style="float: right;"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    v-bind:current-page="tableData.page"
                    :page-sizes="[10, 20, 50]"
                    v-bind:page-size="tableData.size"
                    :pager-count="5"
                    layout="prev, pager, next, jumper,sizes,total"
                    v-bind:total="tableData.total">
            </el-pagination>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "pagetable",
        props: {
            tableData: {
                type: Object,
                default: function () {
                    return {
                        data: [],
                        page: 1,  //初始加载页码
                        size: 10,  //初始加载每页显示条数
                        total: 0,
                        params: {},  //默认查询参数
                        url: '',
                        columns:[
                            // {label: 'id', prop: 'id', width: '80',sortable: false},
                        ],
                        action: {label: '操作', showAction: false, actions:[]}//默认为<a>形式，如果加上type=button则为按钮形式
                    }
                }
            },
        },
        methods: {
            //换页
            handleCurrentChange(val) {
                this.tableLoad(this.tableData, val);
            },
            //换表格显示数
            handleSizeChange(val) {
                this.tableData.size = val;
                this.tableLoad(this.tableData, 1);
            },
        },
    }
</script>
<style scoped>

</style>