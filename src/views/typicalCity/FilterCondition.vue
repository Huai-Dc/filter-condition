<template>
    <div :class="[`${prefixCls}-container`, isFullTable ? `${prefixCls}-full-table` : '',]" ref="filterContainer">
        <div :class="[`${prefixCls}-topBar`]">
            <!--            <Button type="primary" class="hide-full">查看历史版本</Button>-->
            <Button type="warning" class="show-full" @click="isFullTable=false">退出全屏</Button>
            <Button type="primary" @click="showFilterDrawer = true">更多条件</Button>
        </div>
        <div :class="[`${prefixCls}-body`]" ref="filterBody">
            <Row>
                <!-- 左侧筛选模块 -->
                <Col class="hide-full" span="12">
                    <div :class="[`${prefixCls}-box`]">
                        <div :class="[`${prefixCls}-box-top`]">
                            <Input v-model="keyWord" placeholder="请输入字段" style="width: 200px"
                                   @on-enter="addCondition('add')"/>
                            <Button @click="addCondition('add')" type="warning" style="margin-left: 5px;">添加条件</Button>
                        </div>
                        <div :class="[`${prefixCls}-box-body`]">
                            <Card v-if="freeList.length>0">
                                <p slot="title">推荐关键词</p>
                                <Tag v-for="(tag, index) in freeList"
                                     :key="index"
                                     @click.native="selectCondition(tag, index)"
                                     color="cyan">{{tag.name}}
                                </Tag>
                            </Card>
                            <Card v-if="selectList.length>0">
                                <p slot="title">已选关键词</p>
                                <Tag v-for="(tag, index) in selectList"
                                     :key="index"
                                     closable :color="tag.exclude?'error':'primary'"
                                     @click.native="changeState(tag)"
                                     @on-close="removeSelectTag(tag)"
                                >{{tag.name}}
                                </Tag>
                            </Card>
                            <Alert class="opacity-alter" show-icon
                                   v-if="freeList.length === 0 && selectList.length === 0">
                                提示
                                <Icon type="ios-bulb-outline" slot="icon"></Icon>
                                <template slot="desc">添加条件后出筛选结果及建议关键字！</template>
                            </Alert>
                        </div>
                    </div>
                </Col>
                <!-- 右侧结果模块 -->
                <Col :span="isFullTable?24:12">
                    <div :class="[`${prefixCls}-box`]">
                        <div :class="[`${prefixCls}-box-top`, 'hide-full']">
                            <Button @click="exportData" type="warning" class="btn-right">导出数据</Button>
                            <!--                            <Button @click="saveStep" type="primary" class="btn-right">保存步骤</Button>-->
                        </div>
                        <div :class="[`${prefixCls}-box-body`]" :style="{'top': isFullTable?'-55px':'-65px'}">
                            <Table
                                    class="dark-table"
                                    no-data-text="暂无结果，请添加筛选条件"
                                    :loading="tableLoading"
                                    :columns="tableColumn"
                                    :data="tableData"
                                    :max-height="tableMaxHeight"
                                    @on-selection-change="selectionChange"
                                    @on-select="select"
                                    @on-select-all="selectAll"
                                    @on-select-cancel="selectCancel"
                                    @on-select-all-cancel="selectAllCancel"
                            >
                                <template slot="name" slot-scope="{ row, index }">
                                    <span class="company-name" @click="showCompanyInfo(row)">{{row.name}}</span>
                                </template>
                                <template slot="date" slot-scope="{ row, index }">
                                    <span>{{row.date?row.date.split("T")[0]:"暂无数据"}}</span>
                                </template>
                                <template slot="reg_capi" slot-scope="{ row, index }">
                                    <span>{{formatMoney(row.reg_capi / 1000)}} 万</span>
                                </template>
                            </Table>
                            <Page :current="currentPage" class="opacity-page" :total="totalCount"
                                  @on-change="changePage"/>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
        <!-- 更多条件 -->
        <Drawer
                v-model="showFilterDrawer"
                placement="left"
                width="650"
                title="多选搜索"
        >
            <FilterDrawer
                    ref="filterDrawer"
                    @changeFetchParams="changeFetchParams"
            />
        </Drawer>
        <!-- 企业信息 -->
        <Drawer
                v-model="showCompanyDrawer"
                width="900"
                title="企业信息"
                @on-visible-change="changeInfo"
        >
            <CompanyInfo v-if="activeCompany"/>
        </Drawer>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {getDateAgo} from "../../utils/date";

    const prefixCls = 'filter-condition'
    import {Row, Col, Table, Tag, Page, Card, Alert, Drawer} from 'view-design'
    import FilterDrawer from './components/FilterDrawer'
    import CompanyInfo from './components/CompanyInfo'
    import throttle from 'loadsh/throttle'
    import {getStorage, setStorage} from "../../utils/storageData";
    import {formatCurrencyFilter} from "../../utils/common";

    export default {
        name: "FilterCondition",
        components: {
            Row, Col, Table, Tag, Page, Card, Alert, Drawer, FilterDrawer, CompanyInfo
        },
        data() {
            return {
                prefixCls: prefixCls,
                keyWord: '',  // 输入的关键词
                oldKeyWord: '',  // 上一次输入的关键词
                keyWordAry: [],  // 已选关键词 参数
                excludesAry: [], // 排除关键词 参数
                currentPage: 1,  // 当前页码 参数
                beginDate: '',  // 筛选开始日期 参数
                endDate: '',  // 筛选结束日期 参数
                totalCount: 0,  // 当前结果集条数
                area: {
                    "provGuid": "",
                    "cityGuid": "",
                    "regionGuid": "",
                },
                freeList: [], // 后端返回的关键词数组
                selectList: [], // 选择的关键词数据
                tableLoading: false, // 表格是否处于加载中状态
                filtering: false, // 是否处于筛选中 防止重复请求
                isFullTable: false, // 表格是否全屏
                tableMaxHeight: '100', // 表格最大高度 100 为初始值
                createDateFilter: [
                    {
                        label: '1年内',
                        value: 1
                    },
                    {
                        label: '1-3年',
                        value: 2
                    },
                    {
                        label: '3-5年',
                        value: 3
                    },
                    {
                        label: '5-10年',
                        value: 4
                    },
                    {
                        label: '10年以上',
                        value: 5
                    },
                ],
                assetFilter: [],
                tableColumn: [
                    {
                        type: 'selection',
                        width: 35,
                        align: 'center'
                    },
                    {
                        title: '公司名',
                        key: 'name',
                        slot: 'name',
                        resizable: true,
                    },
                    {
                        title: '成立时间',
                        key: 'date',
                        slot: 'date',
                        renderHeader: (h, params) => {
                            return h('div', [
                                h('span', '成立时间'),
                                h('Dropdown', {
                                    attrs: {
                                        trigger: 'click',
                                        transfer: true
                                    },
                                    on: {
                                        'on-click': this.dateFilterHandler
                                    }
                                }, [
                                    h('a', [
                                        h('Icon', {
                                            props: {
                                                type: 'ios-funnel',
                                            },
                                            attrs: {
                                                title: '筛选成立时间'
                                            },
                                            style: {
                                                position: 'relative',
                                                left: '5px',
                                                display: 'inline-block',
                                                cursor: 'pointer'
                                            },
                                        }),
                                    ], {
                                        attrs: {
                                            href: 'javascript:void(0)'
                                        }
                                    }),
                                    h('DropdownMenu', {
                                        slot: 'list'
                                    }, this.createDateFilter.map((item, index) => {
                                        return h('DropdownItem', {
                                            attrs: {
                                                name: item.value
                                            }
                                        }, item.label)
                                    }))
                                ]),
                            ]);
                        },
                    },
                    {
                        title: '注册资本',
                        key: 'reg_capi',
                        slot: 'reg_capi'
                    },
                    {
                        title: '电话',
                        key: 'telephone',
                        renderHeader: (h, params) => {
                            return h('div', [
                                h('span', '电话'),
                                h('Icon', {
                                    props: {
                                        type: 'md-expand',
                                    },
                                    attrs: {
                                        title: '全屏显示'
                                    },
                                    style: {
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        display: this.isFullTable ? 'none' : 'inline-block'
                                    },
                                    on: {
                                        click: this.fullTableHandler
                                    }
                                }),
                            ]);
                        }
                    },
                    // {
                    //     title: '邮箱',
                    //     key: 'email',
                    // }
                ],
                tableData: [], // 表格数据
                showFilterDrawer: false,
                showCompanyDrawer: false,
                tableSelected: [], // 表格选中项
            }
        },
        computed: {
            ...mapGetters([
                'activeCompany'
            ])
        },
        created() {
            // 请求筛选参数
            this.getParams();
        },
        mounted() {
            this.setBodySize()
            this.setTableMaxHeight()
            window.addEventListener('resize', throttle(() => {
                this.setBodySize()
                this.setTableMaxHeight()
            }, 100), false);
        },
        methods: {
            fullTableHandler() {
                this.isFullTable = true
            },
            setTableMaxHeight() {
                let windowHeight = document.body.clientHeight || document.body.offsetHeight;
                this.tableMaxHeight = windowHeight - 255
            },
            setBodySize() {
                let windowHeight = document.body.clientHeight || document.body.offsetHeight;
                let dom = this.$refs.filterBody
                let realDom = dom.style ? dom : dom.$el;
                realDom.style.height = windowHeight - 140 + "px"
            },
            getParams() {
                if (getStorage("baseAreaParams")) return false;
                this.$http.post(this.$apis.baseHost + this.$apis.params).then(res => {
                    if (res && res.data && +res.data.code === 1) {
                        setStorage("baseAreaParams", res.data.data.baseAreaParams)
                        setStorage("regcapiParams", res.data.data.regcapiParams)
                        setStorage("statusParams", res.data.data.statusParams)
                    }
                })
            },
            /**
             * 添加条件
             * @param type add 添加新词  select 选择标签  switch 切换页码
             */
            addCondition(type) {
                this.tableLoading = true;
                if (!this.keyWord || this.keyWord === '') {
                    this.$Message.warning("请输入关键词");
                    this.tableLoading = false;
                    return false;
                }
                if (type === 'add') {
                    if (this.keyWordAry.indexOf(this.keyWord) === -1) {
                        this.keyWordAry.push(this.keyWord)
                    }
                    this.currentPage = 1
                } else if (type === 'select') {
                    this.currentPage = 1
                } else if (type === 'switch') {
                } else if (type === 'filter') {
                }

                this.$http.post(this.$apis.baseHost + this.$apis.analyse, {
                    "keywords": this.keyWordAry,
                    "keywords_filter": this.excludesAry,
                    "date_begin": this.beginDate,
                    "date_end": this.endDate,
                    "reg_capi_begin": 0,
                    "reg_capi_end": 0,
                    "provGuid": this.area["provGuid"],
                    "cityGuid": this.area["cityGuid"],
                    "regionGuid": this.area["regionGuid"],
                    "domain": "",
                    "shortStatus": "",
                    "geoCenterPoint": {},
                    "geoPolygonPoint": [],
                    "topLeft": {},
                    "bottomRight": {},
                    "radius": 0,
                    "page": this.currentPage,
                    "pageSize": 10,
                    "showfilterOption": true,
                }).then(res => {
                    this.filtering = false;
                    this.tableLoading = false;
                    if (type === "add") {
                        this.oldKeyWord = this.keyWord;
                        let inSide = false;
                        for (let i = 0; i < this.selectList.length; i++) {
                            if (this.selectList[i].name === this.keyWord) {
                                inSide = true;
                                break;
                            }
                        }
                        if (!inSide) {
                            this.selectList.push({
                                name: this.keyWord,
                                exclude: false
                            })
                        }
                    }
                    if (!res.data) {
                        this.$Message.error("请求出错，请重试")
                        return false;
                    }
                    let data = res.data.data

                    let suggest = data.suggest;
                    this.tableData = []; // 初始化表格数据

                    let groupOption = data.groupOption;
                    if (groupOption.length > 0) {
                        for (let i = 0; i < groupOption.length; i++) {
                            let cur = groupOption[i];
                            if(cur.name === "provGuid"){
                                this.$refs["filterDrawer"].setRegionNumber("provGuid", cur.data)
                            }else if(cur.name === "cityGuid"){
                                this.$refs["filterDrawer"].setRegionNumber("cityGuid", cur.data)
                            }else if(cur.name === "regionGuid"){
                                this.$refs["filterDrawer"].setRegionNumber("regionGuid", cur.data)
                            }
                        }
                    }

                    if (type !== 'switch' && type !== 'filter') {
                        this.totalCount = data.total;
                        this.freeList = [];
                        suggest.forEach(item => {
                            if (this.keyWordAry.indexOf(item) === -1) {
                                let flag = true;
                                for (let i = 0; i < this.freeList.length; i++) {
                                    let cur = this.freeList[i]
                                    if (cur.name === item) {
                                        flag = false;
                                        break;
                                    }
                                }
                                if (flag) {
                                    this.freeList.push({
                                        name: item,
                                        exclude: false
                                    })
                                }
                            }
                        })
                    }

                    data.results.forEach(item => {
                        if (this.tableSelected.indexOf(item.guid) !== -1) {
                            item._checked = true;
                        }
                        this.tableData.push(item)
                    })
                })
            },
            /**
             * 保存步骤
             */
            saveStep() {
                this.$Message.info("保存步骤")
            },
            /**
             * 导出数据
             */
            exportData() {
                let selections = this.tableSelected; // 选中项
                if (selections.length === 0) {
                    this.$Message.error("请选择要导出的数据！")
                    return false;
                }
                this.$http.post(this.$apis.baseHost + this.$apis.exportExcel, "\"" + selections.join(",") + "\"").then(res => {
                    console.log(res);
                    this.exportExcel(res.data.data)
                })
            },
            exportExcel(list) {
                import('../../vendor/Export2Excel').then(excel => {
                    const tHeader = ["名称", "法人", "经营范围", "组织代码", '实缴金额', "注册资本", "工商注册号", "所属区县", "注册机关", "状态", "经营状态", "电话", "公司类型", "网址",
                        "品牌", "省份", "地址", "城市", "公司介绍", "公司规模", "统一社会信用代码", "注册时间", "所属行业", "邮箱", "英文名", "领域"
                    ]
                    const filterVal = ['name', 'oper_name', "operationDomain", 'org_no', 'paid_in_capi', 'reg_capi_desc', 'reg_no', 'regionName', 'registrar', "shortStatus", "status", "telephone", "type", "webSite",
                        "Product", "Province", "address", "cityName", "companyDesc", "companyScalar", "credit_no", "date", "domain", "email", "engName", "industry"
                    ]
                    const data = this.formatJson(filterVal, list)

                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: "导出数据",
                        autoWidth: this.autoWidth,
                        bookType: this.bookType
                    })
                })
            },
            /**
             * 选择条件
             * @param tag
             * @param index
             */
            selectCondition(tag, index) {
                this.selectList.push(tag)
                this.freeList.splice(index, 1)
                this.updateParams(this.selectList)
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
                this.updateParams(this.selectList)
            },
            removeSelectTag(tag) {
                for (let i = 0; i < this.selectList.length; i++) {
                    let cur = this.selectList[i];
                    if (tag.name === cur.name) {
                        this.freeList.push({
                            name: cur.name,
                            exclude: false
                        })
                        this.selectList.splice(i, 1);
                        let kIndex = this.keyWordAry.indexOf(tag.name),
                            eIndex = this.excludesAry.indexOf(tag.name);
                        if (kIndex !== -1) this.keyWordAry.splice(kIndex, 1)
                        if (eIndex !== -1) this.excludesAry.splice(eIndex, 1);

                        this.addCondition('select')
                        break;
                    }
                }
            },
            changePage(newPageNum) {
                this.currentPage = newPageNum;
                this.addCondition('switch')
            },
            updateParams(paramsAry) {
                if (paramsAry.length > 0) {
                    paramsAry.forEach((item) => {
                        let name = item.name
                        let indexKeyWord = this.keyWordAry.indexOf(name),
                            indexExclude = this.excludesAry.indexOf(name);
                        if (item.exclude) { // 排除的
                            if (indexExclude === -1) {
                                this.excludesAry.push(name)
                            }
                            if (indexKeyWord > -1) {
                                this.keyWordAry.splice(indexKeyWord, 1);
                            }
                        } else {
                            if (indexKeyWord === -1) {
                                this.keyWordAry.push(name)
                            }
                            if (indexExclude !== -1) {
                                this.excludesAry.splice(indexExclude, 1)
                            }
                        }
                    })

                    this.addCondition('select')
                }
            },
            dateFilterHandler(value) {
                setTimeout(() => {
                    switch (value) {
                        case 1: // 1年内
                            this.beginDate = getDateAgo(1)
                            this.endDate = ''
                            break;
                        case 2: // 1-3年
                            this.beginDate = getDateAgo(3)
                            this.endDate = getDateAgo(1)
                            break;
                        case 3: // 3-5年
                            this.beginDate = getDateAgo(5)
                            this.endDate = getDateAgo(3)
                            break;
                        case 4: // 5-10年
                            this.beginDate = getDateAgo(10)
                            this.endDate = getDateAgo(5)
                            break;
                        case 5: // 10年以上
                            this.beginDate = ''
                            this.endDate = getDateAgo(10)
                            break
                    }

                    this.addCondition('filter')
                })
            },
            showCompanyInfo(info) {
                this.showCompanyDrawer = true
                setStorage("CURRENT_COMPANY", info)

                this.$store.commit("SET_ACTIVE_COMPANY", info);
            },
            changeInfo() {

            },
            changeFetchParams(params) {
                this.area["provGuid"] = params.area[0] ? params.area[0].guid : ''
                this.area["cityGuid"] = params.area[1] ? params.area[1].guid : ''
                this.area["regionGuid"] = params.area[2] ? params.area[2].guid : ''

                this.addCondition()
            },
            formatMoney(num) {
                if (typeof num === 'string') {
                    num = Number(num) || 0;
                }
                return formatCurrencyFilter(num, "").split(".")[0]
            },
            selectionChange(selection) {
                console.log(this.tableSelected)
                console.log("变化")
            },
            select(selection, row) {
                console.log("选中")
                let guid = row.guid
                if (this.tableSelected.indexOf(guid) === -1) {
                    this.tableSelected.push(guid)
                }
            },
            selectAll(selection) {
                console.log("全选中")
                selection.forEach(item => {
                    let guid = item.guid
                    if (this.tableSelected.indexOf(guid) === -1) {
                        this.tableSelected.push(guid)
                    }
                })
            },
            selectCancel(selection, row) {
                let guid = row.guid, index = this.tableSelected.indexOf(guid)
                if (index >= 0) {
                    this.tableSelected.splice(index, 1)
                }
            },
            selectAllCancel() {
                this.tableData.forEach(item => {
                    let guid = item.guid, index = this.tableSelected.indexOf(guid)
                    if (index >= 0) {
                        this.tableSelected.splice(index, 1)
                    }
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        // return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            }
        }
    }
</script>

<style scoped lang="scss">
    .filter-condition-container {
        padding: 15px;
        height: 100%;
        overflow: hidden;

        .show-full {
            display: none
        }

        .filter-condition-topBar {
            height: 40px;
            line-height: 40px;

            .ivu-btn {
                float: right;
                margin-left: 10px;
            }
        }

        .filter-condition-body {
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

                    .filter-condition-box {
                        height: 100%;
                        border: 1px solid #474747;
                        border-radius: 4px;
                        background-color: #1e191f;

                        .filter-condition-box-top {
                            position: relative;
                            height: 65px;
                            padding: 10px 10px;
                            z-index: 20;

                            .btn-right {
                                float: right;
                                margin-left: 10px;
                            }
                        }

                        .filter-condition-box-body {
                            box-sizing: border-box;
                            height: 100%;
                            position: relative;
                            top: -65px;
                            padding: 65px 10px 0 10px;

                            .company-name {
                                cursor: pointer;
                            }

                            .ivu-page {
                                text-align: center;
                                margin-top: 10px;
                            }

                            .ivu-card {
                                background-color: transparent;
                                height: 45%;
                                margin-bottom: 10px;

                                &:last-child {
                                    margin-bottom: 0;
                                }

                                .ivu-card-head p, .ivu-card-head-inner {
                                    color: #ffffff;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .filter-condition-full-table {
        .hide-full {
            display: none;
        }

        .show-full {
            display: inline-block;
        }
    }
</style>
