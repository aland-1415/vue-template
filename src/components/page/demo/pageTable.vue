<template>
    <div>
        <div>
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-lx-calendar"></i>ESC自动化测试</el-breadcrumb-item>
                    <el-breadcrumb-item>测试集</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container">
            <div class="paginationTable">
                <el-form :inline="true" :model="table.params" ref="queryForm" :rules="queryFormRules">
                    <el-form-item label="id" prop="id">
                        <el-input v-model="table.params.id" placeholder="请输入数字"></el-input>
                    </el-form-item>
                    <el-form-item label="用例名称" prop="name" >
                        <el-input v-model="table.params.name" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleQuery" id="queryButton">查询</el-button>
                    </el-form-item>
                    <el-form-item style="float: right; position: relative">
                        <el-button type="primary" @click="handleCreate">新增</el-button>
                    </el-form-item>
                </el-form>
                <pagetable v-bind:tableData="table">
                    <el-table-column prop="id" label="IDIDID"></el-table-column>
                    <template v-slot:cellTpl="{row}">
                        <el-button size="small" @click="handleEdit2(row)">编辑2</el-button>
                    </template>
                </pagetable>
            </div>
            <el-dialog :title=createUpdateDialogTitle :visible.sync="createUpdateDialogVisible" width="40%">
                <el-form :label-position="'right'" ref="createUpdateForm" label-width="100px"
                         :rules="createUpdateFormRules" el-form :model="testSuite">
                    <el-form-item label="名称:" prop="name">
                        <el-input v-model="testSuite.name"></el-input>
                    </el-form-item>

                    <el-col :span="12">
                        <el-form-item label="自动执行:" prop="autoExecute">
                            <el-select v-model="testSuite.autoExecute" placeholder="是否自动执行">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="-1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="执行时间:">
                            <el-time-select
                                    v-model="testSuite.executeTime"
                                    :picker-options="{
                                        start: '08:30',
                                        step: '00:15',
                                        end: '18:30'
                                      }"
                                    placeholder="请选择时间">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="结果发送邮箱:" prop="mailAddresses">
                            <el-input v-model="testSuite.mailAddresses" type="textarea" placeholder="多个邮箱以英文分号(;)分隔"></el-input>
                        </el-form-item>
                    </el-col>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitCreateUpdateData('createUpdateForm')">提  交</el-button>
                    <el-button type="primary" @click="resetCreateUpdateForm" plain >重 置</el-button>
                    <el-button @click="createUpdateDialogVisible = false">取  消</el-button>
                </div>
            </el-dialog>

        </div>
    </div>
</template>
<script>
    export default {
        data(){
            //数字但非必填验证器
            let numVal = (rule, value, callback) => {
                if (value && !(/^[0-9]+$/).test(value)){
                    return callback(new  Error(this.$t('msg.ref_number') + this.$t('msg.inputMsg')));
                }
                return callback();
            };
            return{
                table: {
                    data: [],
                    page: 1,  //初始加载页码
                    size: 10,  //初始加载每页显示条数
                    total: 0,
                    params: {id : '', name : ''},  //默认查询参数
                    url: 'http://rtp.dmall.com/testcase/pageData',
                    // url: this.httpHost + '/testsuite/pageData',
                    columns:[
                        {label: 'id', type: "autoId", fixed: ''},
                        {label: '名称', prop: 'name'},
                        {label: '方式', prop: 'testModeName', minWidth: '80',sortable: false},
                        {label: '自定义表格内容', templateScope:'cellTpl'},
                    ],
                    action: {showAction: true, label: '操作', minWidth: '50',
                        actions:[
                            {name: 'edit', callback: this.editAction},
                            ]},
                },

                queryFormRules: {
                    id: [{ validator: numVal, required: false, message: 'id只能是数字',}],
                },

                createUpdateDialogVisible: false,
                createUpdateDialogTitle: '新增',
                createUpdateFormRules: {
                    name: [{ required: true, message: '名称不能为空',}],
                    autoExecute: [{required: true, message: '请选择是否自动执行',}],
                },
                testSuite:{
                    id: '',
                    name: '',
                    autoExecute: '',
                    executeTime: '',
                    mailAddresses: '',
                },

            };

        },
        created(){
            this.tableLoad(this.table, 1);
        },
        components: {
        },
        methods: {
            editAction: function(row) {
                console.log('来自父组件：', JSON.stringify(row));
            },
            //查询
            handleQuery() {
                this.tableLoad(this.table, 1);
            },
            handleEdit2(raw) {
                console.log(JSON.stringify(raw));
            },
            //新增
            handleCreate(){
                this.createUpdateDialogTitle = '新增';
                this.createUpdateDialogVisible = true;
                this.clearObjectVal(this.testSuite)
            },
            //编辑
            handleEdit(val){
                this.createUpdateDialogTitle = '编辑';
                this.createUpdateDialogVisible = true;
                for (let prop in this.testSuite){
                    this.testSuite[prop] = val[prop];
                }
                this.testSuite.autoExecute = this.testSuite.autoExecute.toString();
            },

            //提交新增、编辑信息
            submitCreateUpdateData(createUpdateForm){
                this.$refs[createUpdateForm].validate((valid) => {
                    if (valid) {
                        this.submitFormData(this.httpHost + '/testsuite/createOrUpdate', this.testSuite,
                            (resData) => {
                            if (resData.status == 200){
                                this.$message({type: 'success', message: this.createUpdateDialogTitle + '成功！', offset: 100});
                                this.createUpdateDialogVisible = false;
                                this.clearObjectVal(this.table.params);
                                this.tableLoad(this.table, 1);
                            } else {
                                this.$alert(resData.message, '提示',{type: 'warning'  });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            //删除
            handleDel(row) {
                this.$confirm('确认删除用例：' + row.name , '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.submitFormData(this.httpHost + '/testsuite/delete', {id : row.id},
                    resData => {
                        if (resData.status == 200){
                            this.$message({type: 'success', message: '删除成功!', offset: 100});
                            this.tableLoad(this.table, this.table.page);
                        } else {
                            this.$alert(resData.message, '提示',{type: 'warning'  });
                        }
                    });
                }).catch(() => {});
            },

            //执行测试
            handleExcute(row){
                this.$confirm('确定开始执行 “' + row.name + '” 的所有用例？' , '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.submitFormData(this.httpHost + '/testsuite/runSuiteCases', {suiteId : row.id},
                        resData => {
                            if (resData.status == 200){
                                this.$message({type: 'success', message: '执行成功!', offset: 100});
                                this.$router.push('/testResult');
                            } else {
                                this.$alert(resData.message, '提示',{type: 'warning'  });
                            }
                        });
                }).catch(() => {});

            },
            //重置
            resetCreateUpdateForm() {
                this.clearObjectVal(this.testSuite, 'id');
            },

        },
    }
</script>

