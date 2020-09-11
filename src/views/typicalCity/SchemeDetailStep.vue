<template>
    <div :class="[`${prefixCls}`]">
        <!-- 步骤 -->
        <div :class="[`${prefixCls}-list`]">
            <div class="step-item active">
                <span>步骤1</span>
                <i class="step-arrow"></i>
            </div>
            <div class="step-item">
                <span>步骤2</span>
                <i class="step-arrow"></i>
            </div>
        </div>
        <!-- 结果 -->
        <div :class="[`${prefixCls}-body`]">
            <!-- 头部按钮组 -->
            <div :class="[`${prefixCls}-action-group`]">
                <Button type="warning">保存修改</Button>
                <Button type="primary">以当前条件创建新版本</Button>

                <Button type="warning" class="fr">导出数据</Button>
            </div>
            <!-- 筛选条件 -->
            <div :class="[`${prefixCls}-filter`]">
                <Row>
                    <Col :span="2">筛选条件</Col>
                    <Col :span="22">11111</Col>
                </Row>
            </div>
            <!-- 重点标记 -->
            <section>
                <div class="section-title">重点标记</div>
                <div class="section-body">
                    <Table
                            class="dark-table"
                            :columns="keyTagTableColumn"
                            :data="keyTagTableData"
                    ></Table>
                    <Page
                            class="opacity-page"
                            :total="100"
                    />
                </div>
            </section>
            <!-- 全部结果 -->
            <section>
                <div class="section-title">全部结果</div>
                <div class="section-body">
                    <Table
                            class="dark-table"
                            :columns="keyTagTableColumn"
                            :data="allResultTableData"
                    ></Table>
                    <Page
                            class="opacity-page"
                            :total="100"
                    />
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    const prefixCls = 'scheme-step'
    import {Row, Col, Table, Page} from 'view-design'

    export default {
        name: "SchemeDetailStep",
        components: {
            Row, Col, Table, Page
        },
        data() {
            return {
                prefixCls: prefixCls,
                activeStep: 1, // 当前选中的步骤
                keyTagTableColumn: [
                    {
                        title: '公司名',
                        key: 'name',
                    },
                    {
                        title: '成立时间',
                        key: 'createDate',
                    },
                    {
                        title: '注册资本',
                        key: 'registeredCapital',
                    },
                    {
                        title: '电话',
                        key: 'phone',
                    },
                    {
                        title: '邮箱',
                        key: 'email',
                    },
                ],
                keyTagTableData: [],
                allResultTableData: []
            }
        }
    }
</script>

<style scoped lang="scss">
    .scheme-step {
        position: relative;
        padding: 15px;
        min-width: 1200px;

        .scheme-step-list {
            position: absolute;
            display: inline-block;
            top: 15px;
            left: 15px;
            width: 140px;
            z-index: 2;

            .step-item {
                height: 54px;
                width: 116px;
                border: 1px solid #544B5C;
                border-radius: 3px;
                background-color: #544B5C;
                position: relative;
                margin: 8px 2px 5px;

                span {
                    display: inline-block;
                    font-size: 14px;
                    color: white;
                    font-weight: bold;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .step-arrow {
                    display: none
                }

                &:first-child {
                    margin-top: 0;
                }

                &:hover {
                    border: 1px solid #2d8cf0;
                    transition: border .5s ease-in-out;
                }

                &.active {
                    background-color: #2d8cf0;

                    .step-arrow {
                        position: absolute;
                        top: 50%;
                        margin-top: -5px;
                        width: 0;
                        height: 0;
                        border-color: transparent;
                        border-style: solid;
                        display: inline-block;
                        right: -5px;
                        border-width: 5px 0 5px 5px;
                        border-left-color: #2d8cf0;
                    }
                }
            }
        }

        .scheme-step-body {
            box-sizing: border-box;
            position: relative;
            display: inline-block;
            top: 0;
            padding-left: 160px;
            width: 100%;

            .scheme-step-action-group {
                button {
                    margin-right: 8px;

                    &.fr {
                        float: right;
                        margin-left: 8px;
                        margin-right: 0;
                    }
                }
            }

            .scheme-step-filter {
                margin: 15px 0;
                border: 1px dashed #939393;
                border-radius: 4px;
                padding: 20px;
            }

            section {
                margin-bottom: 20px;
                background-color: #211c21;

                .section-title {
                    font-size: 18px;
                    font-weight: bold;
                    color: white;
                    margin-bottom: 5px;
                }

                .section-body {
                    padding: 20px;
                    border: 1px solid #939393;
                    border-radius: 4px;
                    text-align: center;

                    .ivu-page {
                        margin-top: 10px;
                    }
                }
            }
        }
    }
</style>
