<template>
    <div class="company-info">
        <div class="company-title">{{activeCompany.name || '-'}}</div>
        <table class="mz-table-border">
            <colgroup>
                <col width="180"/>
                <col width="252"/>
                <col width="180"/>
                <col width="252"/>
            </colgroup>
            <tbody>
                <tr>
                    <td>法定代表人</td>
                    <td>{{activeCompany.oper_name || '-'}}</td>
                    <td>经营状态</td>
                    <td>{{activeCompany.shortStatus|| '-'}}</td>
                </tr>
                <tr>
                    <td>成立日期</td>
                    <td>{{activeCompany.date.split("T")[0]|| '-'}}</td>
                    <td>注册资本</td>
                    <td>{{activeCompany.reg_capi|| '-'}}</td>
                </tr>
                <tr>
                    <td>统一社会信用代码</td>
                    <td>{{activeCompany.org_no|| '-'}}</td>
                    <td>工商注册号</td>
                    <td>{{activeCompany.reg_no|| '-'}}</td>
                </tr>
                <tr>
                    <td>企业类型</td>
                    <td>{{activeCompany.type|| '-'}}</td>
                    <td>登记机关</td>
                    <td>{{activeCompany.registrar|| '-'}}</td>
                </tr>
                <tr>
                    <td>邮箱</td>
                    <td>{{activeCompany.email|| '-'}}</td>
                    <td>电话</td>
                    <td>{{activeCompany.telephone|| '-'}}</td>
                </tr>
                <tr>
                    <td>域名</td>
                    <td>{{activeCompany.domain|| '-'}}</td>
                    <td>产品</td>
                    <td>{{activeCompany.product|| '-'}}</td>
                </tr>
                <tr>
                    <td>曾用名</td>
                    <td>{{activeCompany.originalNames|| '-'}}</td>
                    <td>英文名</td>
                    <td>{{activeCompany.engName|| '-'}}</td>
                </tr>
                <tr>
                    <td>企业地址</td>
                    <td colspan="3">{{activeCompany.address|| '-'}}</td>
                </tr>
                <tr>
                    <td>经营范围</td>
                    <td colspan="3">{{activeCompany.operationDomain|| '-'}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "CompanyInfo",
        data() {
            return {}
        },
        computed: {
            ...mapGetters([
                'activeCompany'
            ]),
        },
        beforeUpdate() {
            console.log(this.activeCompany)
        },
        methods: {}
    }
</script>

<style lang="scss" scoped>
    .company-info {
        .company-title{
            display: inline-block;
            line-height: 31px;
            font-size: 22px;
            color: #000000;
            letter-spacing: 0;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .mz-table-border{
            width: 100%;
            border-spacing: 0;
            border-collapse: collapse;
            tr{
                td{
                    padding: 10px 10px 11px 10px;
                    border: #E4EEF6 1px solid;
                    word-break: break-all;
                    font-size: 14px;

                    &:nth-child(odd){
                        background-color: #fef2ec;
                    }
                }
            }
        }
    }
</style>
