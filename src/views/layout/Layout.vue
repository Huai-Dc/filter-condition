<template>
    <Layout>
        <Header></Header>
        <Content>
            <router-view></router-view>
        </Content>
    </Layout>
</template>

<script>
    import {Layout, Header, Content, Footer, Sider,} from 'view-design'
    export default {
        name: "MyLayout", // 此处不可命名与view-design 重复
        components: {
            Layout, Header, Content, Footer, Sider,
        },
    }
</script>

<style scoped lang="scss">
.ivu-layout{
    color: #d7d7d7;
    .ivu-layout-header{
        background-color: #292a2c;
    }
    .ivu-layout-content{
        background-color: #1d1a20;
    }
}
</style>
