<template>
    <div :class="[`${prefixCls}`]">
        <div :class="[`${prefixCls}-topBar`]">
            <Button type="warning">创建新版本</Button>
        </div>
        <Card :class="[`${prefixCls}-body`]" ref="cardBody">
            <div style="text-align:center">
                <Table
                        :columns="tableColumn"
                        :data="tableData"
                        :loading="tableLoading"
                        class="dark-table"
                        no-data-text="暂无版本"
                        :height="tableMaxHeight"
                >
                    <template slot-scope="{ row, index }" slot="handler">
                        <Button size="small" @click="versionEdit(row, index)" type="info" ghost>编辑</Button>
                        <Button size="small" @click="versionResult(row, index)" type="warning" ghost>查看结果</Button>
                        <Button size="small" @click="versionDelete(row, index)" type="error" ghost>删除</Button>
                    </template>
                </Table>
                <Page :total="totalCount" />
            </div>
        </Card>
        <!-- 删除提示框 -->
        <Modal v-model="modalDeleteVersion"
               width="360"
               class-name="vertical-center-modal"
        >
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>确认删除</span>
            </p>
            <div style="text-align:center">
                <p>删除版本后，版本数据不可恢复</p>
                <p>是否继续删除?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="deleteVersion">删除</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import throttle from "loadsh/throttle";

    const prefixCls = 'scheme-list'
    import { Card, Table, Page } from 'view-design'
    export default {
        name: "SchemeList",
        components: {
            Card, Table, Page
        },
        data(){
            return {
                prefixCls: prefixCls,
                tableLoading: false,
                tableMaxHeight: 0,
                tableColumn: [
                    {
                        title: '版本名称',
                        key: 'name',
                        align: 'center',
                        resizable: true,
                    },
                    {
                        title: '创建时间',
                        key: 'createDate',
                        align: 'center',
                        resizable: true,
                    },
                    {
                        title: '步骤',
                        key: 'step',
                        align: 'center',
                        resizable: true,
                    },
                    {
                        title: '筛选结果',
                        key: 'filterResult',
                        align: 'center',
                        resizable: true,
                    },
                    {
                        title: '操作',
                        key: 'handler',
                        align: 'center',
                        resizable: true,
                        slot: 'handler'
                    },
                ],
                tableData: [ // 测试数据
                    {
                        name: '互联网公司',
                        createDate: '2020-01-01',
                        step: 3,
                        filterResult: 1000,
                    }
                ],
                modalDeleteVersion: false,  // 是否显示删除提示对话框
                activeVersion: null, // 当前操作版本
                totalCount: 100, // 总条数
            }
        },
        mounted() {
            this.setBodySize()
                window.addEventListener('resize', throttle(() => {
                this.setBodySize()
            }, 100), false);
        },
        methods: {
            setBodySize() {
                let windowHeight = document.body.clientHeight || document.body.offsetHeight;
                this.$refs.cardBody.$el.style.height = windowHeight - 155 + "px"
                this.tableMaxHeight = windowHeight - 255
            },
            versionEdit(row, index){
                this.activeVersion = row;
                this.$Message.info("编辑第"+index+"行")
            },
            versionResult(row, index){
                this.activeVersion = row;
                this.$Message.info("查看第"+index+"行结果")
            },
            versionDelete(row, index){
                this.activeVersion = row;
                this.modalDeleteVersion = true;
            },
            deleteVersion(){

            }
        }
    }
</script>

<style scoped lang="scss">
.scheme-list{
    padding: 15px;
    height: 100%;
    .scheme-list-topBar {
        height: 40px;
        line-height: 40px;

        .ivu-btn {
            margin-right: 10px;
        }
    }
    .scheme-list-body{
        margin-top: 15px;
        position: relative;
        background: #211c21;
        border-color: #4b4b4b;
        padding: 10px;
        .ivu-card-body{
            .ivu-table-cell-slot{
                button{
                    margin-right: 5px;
                    font-size: 12px;
                }
            }
        }
        .ivu-page{
            margin-top: 10px;
        }
    }
}
</style>
