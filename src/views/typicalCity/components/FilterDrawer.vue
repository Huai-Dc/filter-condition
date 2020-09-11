<template>
    <div class="filter-groups">
        <!-- 筛选结果 -->
        <Row v-show="selected.length>0" class="filter-result">
            <Col :span="3">
                <span class="filter-title">已选条件</span>
            </Col>
            <Col :span="18" class="item-content">
                <Tag type="border" closable color="primary"
                     v-for="(tag, index) in selected"
                     @on-close="removeTag(tag, index)"
                     :key="index"
                >{{tag.name}}
                </Tag>
            </Col>
            <Col :span="3">
                <Button type="text" @click="clearAllFilter">清空条件</Button>
            </Col>
        </Row>
        <!-- 省份筛选 -->
        <Row v-show="showProvinceFilter">
            <Col :span="3">
                <span>省份地区</span>
            </Col>
            <Col :span="19" class="item-content">
                <dd
                        v-for="(province, index) in baseAreaParams"
                        v-show=" index<4 || (index>3 && provinceShowMore)"
                        :key="province.provinceGuid"
                        @click="addTag(province.name, 'province', province.provinceGuid, province)"
                >
                    <a href="javascript:;">
                        {{province.name}}[{{province.count || ""}}]
                    </a>
                </dd>
            </Col>
            <Col :span="2">
                <div class="toggle-btn" @click="provinceShowMore = !provinceShowMore">
                    <span>{{provinceShowMore?'收起':'更多'}}</span>
                    <Icon :type="provinceShowMore?'ios-arrow-up':'ios-arrow-down'"/>
                </div>
            </Col>
        </Row>
        <!-- 城市筛选 -->
        <Row v-show="showCityFilter && filterCityList.length>0">
            <Col :span="3">
                <span>城市</span>
            </Col>
            <Col :span="19" class="item-content">
                <dd
                        v-for="(city, index) in filterCityList"
                        :key="city.cityGuid"
                        @click="addTag(city.fullName, 'city', city.cityGuid, city)"
                >
                    <a href="javascript:;">
                        {{city.fullName}}[{{city.count || ""}}]
                    </a>
                </dd>
            </Col>
            <Col :span="2"></Col>
        </Row>
        <!-- 地区筛选 -->
        <Row v-show="showAreaFilter && filterAreaList.length>0">
            <Col :span="3">
                <span>区县</span>
            </Col>
            <Col :span="19" class="item-content">
                <dd
                        v-for="(area, index) in filterAreaList"
                        :key="area.regionGuid"
                        @click="addTag(area.name, 'area', area.regionGuid, area)"
                >
                    <a href="javascript:;">
                        {{area.name}}[{{area.count || ""}}]
                    </a>
                </dd>
            </Col>
            <Col :span="2"></Col>
        </Row>
    </div>
</template>

<script>
    import {getStorage} from "@/utils/storageData.js";
    import {Row, Col, Tag} from 'view-design'

    export default {
        name: "FilterDrawer",
        components: {
            Row, Col, Tag
        },
        data() {
            return {
                showProvinceFilter: true, // 筛选省份
                provinceShowMore: false,  // 查看更多省份
                showCityFilter: false,
                showAreaFilter: false,
                baseAreaParams: null,
                selected: [], // 已选条件
                filterCityList: [],  // 已选省份下城市列表
                filterAreaList: [],  // 已选城市下区县列表
            }
        },
        mounted() {
            this.baseAreaParams = JSON.parse(getStorage("baseAreaParams"));
            this.statusParams = JSON.parse(getStorage("statusParams"));
            this.regcapiParams = JSON.parse(getStorage("regcapiParams"));

            // console.log(this.statusParams)
            // console.log(this.regcapiParams)

        },
        methods: {
            setRegionNumber(type, data){
                if(type === "provGuid"){
                    console.log(this.baseAreaParams)
                    console.log(data)
                    this.setNumber(this.baseAreaParams, "provinceGuid", data)
                }else if(type === "cityGuid"){
                    console.log(this.filterCityList)
                    console.log(data)
                    this.setNumber(this.filterCityList, "cityGuid", data)
                }else if(type === "regionGuid"){
                    console.log(this.filterAreaList)
                    console.log(data)
                    this.setNumber(this.filterAreaList, "regionGuid", data)
                }
            },
            setNumber(array, key, data){
                array.forEach(item => {
                    for(let i=0; i< data.length; i++){
                        if(item[key] === data[i].key){
                            this.$set(item, "count", data[i].count)
                        }
                    }
                })
            },
            addTag(name, type, guid, data) {
                switch (type) {
                    case 'province':
                    case 'city':
                    case 'area':
                        this.changeDistrict(type, 'add', data);
                        break;
                }
                this.selected.push({
                    name: name,
                    type: type,
                    guid: guid
                })

                this.changeParams()
            },
            removeTag(item, index) {
                this.changeDistrict(item.type, 'remove')
                if(item.type === 'province'){
                    for (let i = this.selected.length - 1; i >= 0; i--) {
                        let con = this.selected[i]
                        if (con.type === "province" || con.type === "city" || con.type === "area") {
                            this.selected.splice(i, 1);
                        }
                    }
                }else if(item.type === 'city'){
                    for (let i = this.selected.length - 1; i >= 0; i--) {
                        let con = this.selected[i]
                        if (con.type === "city" || con.type === "area") {
                            this.selected.splice(i, 1);
                        }
                    }
                }else{
                    this.selected.splice(index, 1);
                }

                this.changeParams()
            },
            clearAllFilter(){
                this.selected = [];
                this.handleFilterState(true, false, false)

                this.changeParams()
            },
            /**
             * 增删行政区 处理逻辑
             * @param level
             * @param type
             */
            changeDistrict(level, type, data) {
                if (level === 'province') {
                    if (type === 'add') {
                        this.handleFilterState(false, true, false)
                        if(data.childs.length > 0){
                            this.filterCityList = data.childs;
                        }else{
                            this.filterCityList = []
                        }
                    }else if(type==="remove"){
                        this.filterAreaList = []
                        this.handleFilterState(true, false, false)
                    }
                } else if (level === 'city') {
                    if (type === 'add') {
                        this.handleFilterState(false, false, true)
                        if(data.childs.length > 0){
                            this.filterAreaList = data.childs;
                        }else{
                            this.filterAreaList = []
                        }
                    }else if(type==="remove"){
                        this.filterAreaList = []
                        this.handleFilterState(false, true, false)
                    }
                } else if (level === 'area') {
                    if (type === 'add') {
                        this.handleFilterState(false, false, false)
                    }else if(type==="remove"){
                        this.handleFilterState(false, false, true)
                    }
                }
            },
            handleFilterState(a,b,c){
                this.showProvinceFilter = a;
                this.showCityFilter = b;
                this.showAreaFilter = c;
            },
            // 通知父级参数变化
            changeParams(){
                let params = {
                    area: [...this.selected]
                }
                this.$emit('changeFetchParams', params);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .filter-groups {
        .filter-result {
            position: relative;
            padding: 0 0 15px;
            margin-bottom: 20px;
            border-top: none;
            border-right: none;
            border-left: none;
            border-image: initial;
            border-bottom: 1px dashed rgb(204, 204, 204);

            .filter-title {
                display: inline-block;
                height: 24px;
                line-height: 24px;
                margin: 2px 4px 2px 0;
            }
        }

        .item-content {
            dd {
                display: inline-block;

                a {
                    display: inline-block;
                    padding: .1em 0.6em .2em;
                    margin: 0 4px 5px;
                    text-align: center;
                    font-size: 14px;
                    color: #222;
                    cursor: pointer;

                    &:hover {
                        border-radius: 2px;
                        background: #128cec;
                        color: #fff;
                    }
                }

                &.province-dd {
                    display: none;
                }
            }
        }

        .toggle-btn {
            cursor: pointer;
        }
    }
</style>
