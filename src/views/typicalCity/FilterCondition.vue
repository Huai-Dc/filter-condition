<template>
    <div :class="[`${prefixCls}-container`]" ref="filterContainer">
        <div :class="[`${prefixCls}-topBar`]">
            <Button type="primary">查看历史版本</Button>
        </div>
        <div :class="[`${prefixCls}-body`]" ref="filterBody">
            <Row>
                <Col span="12">
                    <div :class="[`${prefixCls}-box`]">
                        <div :class="[`${prefixCls}-box-top`]">
                            <Input v-model="keyWord" placeholder="请输入字段" style="width: 200px"/>
                            <Button @click="addCondition" type="warning" style="margin-left: 5px;">添加条件</Button>
                        </div>
                        <div :class="[`${prefixCls}-box-body`]">
                            <div>
                                <Tag v-for="(tag, index) in freeList" @click.native="selectCondition(tag, index)"
                                     color="cyan">{{tag.name}}
                                </Tag>
                            </div>
                            <div>
                                <Tag v-for="(tag, index) in selectList"
                                     closable :color="tag.exclude?'error':'primary'"
                                     @click.native="changeState(tag)"
                                >{{tag.name}}
                                </Tag>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span="12">
                    <div :class="[`${prefixCls}-box`]">
                        <div :class="[`${prefixCls}-box-top`]">
                            <Button @click="exportData" type="warning" style="float: right">导出数据</Button>
                        </div>
                        <div :class="[`${prefixCls}-box-body`]">
                            <Table height="200" :columns="tableColumn" :data="tableData"></Table>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
    const prefixCls = 'city-filter'
    import {Button, Row, Col, Table, Tag} from 'view-design'

    export default {
        name: "FilterCondition",
        components: {
            Button, Row, Col, Table, Tag
        },
        data() {
            return {
                prefixCls: prefixCls,
                keyWord: '',
                freeList: [], // 后端返回的关键词数组
                selectList: [], // 选择的关键词数据
                excludeList: [], // 排除的数组
                tableColumn: [
                    {
                        title: '公司名',
                        key: 'name'
                    },
                    {
                        title: '成立时间',
                        key: 'date'
                    },
                    {
                        title: '注册资本',
                        key: 'registeredCapital'
                    },
                    {
                        title: '电话',
                        key: 'phone'
                    },
                    {
                        title: '邮箱',
                        key: 'email'
                    }
                ],
                tableData: [
                    {
                        name: 'John Brown',
                        date: 18,
                        registeredCapital: 'New York No. 1 Lake Park',
                        phone: '2016-10-03',
                        email: '2016-10-03'
                    },
                ]
            }
        },
        mounted() {
            this.setBodySize()
            window.addEventListener('resize', this.setBodySize.bind(this), false);
        },
        methods: {
            setBodySize() {
                let containerHeight = this.$refs.filterContainer.offsetHeight;
                this.$refs.filterBody.style.height = containerHeight - 30 - 40 + "px"
            },
            /**
             * 添加条件
             */
            addCondition() {
                console.log("添加条件")
                let testData = [{name: "运营"}, {name: "运营2"}, {name: "运营3"}, {name: "运营4"},];
                this.freeList.push(...testData)

                this.$http.post(this.$apis.baseHost + this.$apis.analyse, {
                    "keywords": ["招商"],
                    "keywords_filter": [""],
                    "date_begin": "",
                    "date_end": "",
                    "reg_capi_begin": 0,
                    "reg_capi_end": 0,
                    "provGuid": "",
                    "cityGuid": "",
                    "regionGuid": "",
                    "domain": "",
                    "shortStatus": "",
                    "geoCenterPoint": {},
                    "geoPolygonPoint": [{}],
                    "topLeft": {},
                    "bottomRight": {},
                    "radius": 0,
                    "page": 1,
                    "pageSize": 10
                }).then(res=>{
                    console.log(res)
                })
            },
            /**
             * 导出数据
             */
            exportData() {
                console.log("导出数据")
            },
            /**
             * 选择条件
             * @param tag
             * @param index
             */
            selectCondition(tag, index) {
                this.selectList.push(tag)
                this.freeList.splice(index, 1)
            },
            /**
             * 切换状态  蓝色已选  红色排除
             * @param tag
             * @param index
             */
            changeState(tag, index) {
                if (tag.exclude === undefined) {
                    this.$set(tag, 'exclude', true)
                } else {
                    tag.exclude = !tag.exclude
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .city-filter-container {
        padding: 15px;
        height: 100%;
        overflow: hidden;

        .city-filter-topBar {
            height: 40px;
            line-height: 40px;

            .ivu-btn {
                float: right;
            }
        }

        .city-filter-body {
            overflow: hidden;

            .ivu-row {
                height: 100%;

                .ivu-col {
                    height: 100%;
                    box-sizing: border-box;

                    &:first-child {
                        padding-right: 8px;
                    }

                    &:last-child {
                        padding-left: 8px;
                    }

                    .city-filter-box {
                        height: 100%;
                        border: 1px solid #474747;
                        border-radius: 4px;
                        background-color: #1e191f;

                        .city-filter-box-top {
                            position: relative;
                            height: 65px;
                            padding: 10px 10px;
                            z-index: 20;
                        }

                        .city-filter-box-body {
                            box-sizing: border-box;
                            height: 100%;
                            position: relative;
                            top: -65px;
                            padding: 65px 10px 0 10px;
                        }
                    }
                }
            }
        }
    }
</style>
