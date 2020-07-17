/**
 * Created by huai on 2019-08-01
 */
'use strict';

export default {
    'baseHost': process.env.NODE_ENV === 'development' ? 'http://localhost:8088' :  'http://192.168.1.114:8005',// 'http://192.168.1.114:8005', // 本机域名 服务器域名配置在nginx中
    'fileBaseHost':'http://59.61.72.38:28890',
    //6ad89241556e45998fa69697f842dcb2: 37888服务器
    'fileUpload':'/File/Upload/bc97f34fe45941228f3cd9820293be59', //2a4582f864b045a68a6cf4a597a3026c为演示站点  bc97f34fe45941228f3cd9820293be59为测试站点
    'fileDownload':'/File/Download/',

    'mixCode': '/api/verify/mixcode', // 验证码
    'checkUserName': '/api/account/checkusername', // 检测用户名重复
    'register': '/api/account/register',
    'randKey': '/api/account/randkey',
    'login': '/api/account/encrplogin',
    'logout': '/api/account/logout',
    'saveAvatar': '/api/system/saveAvatar', // 保存头像
    'saveUserInfo': '/api/user/SaveUserInfo', // 保存用户信息 

    'modelLibs': '/api/model/modellibs', // 模型列表
    'modelTypes': '/api/model/modeltypes', // 模型分类
    'saveModelDae':'/api/model/saveModelDae', // 上传模型库模型dae
    'saveModel':'/api/model/SaveModel', // 保存模型库模型
    'modelFileList':'/api/model/modelfilelist',//获取模型文件列表
    'getModelFile':'/api/model/getmodelfile',//获取单个模型文件
    'saveModelFiles':'/api/model/SaveModelFiles',//上传模型文件
    'updateModelFileStatus':'/api/model/changeModelStatus', //修改模型文件的上传状态
    'delModel':'/api/model/DelModel',//删除模型

    'saveScene':'/api/scene/SaveJsonScene', //仅保存模型名称和封面到后台，返回模型ID  可用于新建场景
    'sceneFileList':'/api/scene/modelfilelist',//获取场景文件列表
    'sceneModels':'/api/scene/SceneModels', //获取单个场景中包含的模型信息
    'saveSceneFile':'/api/scene/savescenefiles',//上传单个模型文件
    'delScene': '/api/scene/DelScene', // 删除场景
    'userscenelist': '/api/scene/userscenelist', // 用户作品列表
    'delSceneFiles': '/api/scene/delSceneFile', //删除场景文件

    'getHouseSources':'/api/house/GetHouseResource',//获取房源列表
}
