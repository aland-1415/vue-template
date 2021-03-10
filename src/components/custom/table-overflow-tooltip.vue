<template>
    <span v-if="content.length > maxlength">
        <el-tooltip v-bind:content="content" effect="light">
            <span>{{content.substring(0, maxlength) + '...'}}</span>
        </el-tooltip>
    </span>
    <span v-else="">{{ content }}</span>
</template>

<script>
    export default {
        name: "table-overflow-tooltip",
        props: {
            content: {type: String, default: ''},
            maxlength: {type: Number, default: 0}
        }
    }
</script>

<style scoped>
    .el-tooltip__popper{
        max-width:90%;
        max-height: 50%;
        overflow: auto;
    }
    .el-tooltip__popper,.el-tooltip__popper.is-dark{
        background:#f5f5f5;
        color: #303133;
    }
</style>