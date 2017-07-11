/**
 * 项目前端配置文件
 */
 //ajax接口相关配置
let base,socketDomain,payDomain;
if(debug){
  base = 'web-serv/';
  socketDomain = 'ws://pay.pre.ichejk.com';
  payDomain = 'http://pay.pre.ichejk.com';
}else{
  base = '';
  socketDomain = 'ws://pay.ichejk.com';
  payDomain = 'http://pay.ichejk.com';
}
export default {
    API : {
      sendSecurityCode: base+'user/sendSecurityCode',//发送验证码
      userIsSignedIn: base+'user/userIsSignedIn',//检验用户手机号是否已存在
      fastLogin: base+'user/fastLogin',//手机号验证登录 找回密码验证
      signIn: base+'user/signIn',//注册
      accountLogin: base+'user/accountLogin',//用户名和密码登录
      thirdPartLogin: base+'user/thirdPartLogin',//第三方验证登录
      resetPassword: base+'user/resetPassword',//重置密码
      usersCarList: base+'car/queryUsersCarList/checkSession',//查询用户车辆列表
      queryOrderList: base+'order/queryOrderList/checkSession',//
      saveCar: base+'car/saveCar/checkSession',//保存/编辑车辆
      unbindUsersCar: base+'car/unbindUsersCar/checkSession',//解除绑定车辆
      uploadImages: base+'general/uploadImages',//上传图片接口
      queryInsuranceComps: base+'car/queryInsuranceComps',//查询保险公司接口
      queryCarDetail: base+'car/queryCarDetail/checkSession',//查询车辆详情
      queryCarBrands: base+'car/queryCarBrands',//查询车辆品牌
      queryCarSerious: base+'car/queryCarSeries',//查询车系
      queryCarModels: base+'car/queryCarModels',//查询车型
      queryBrandSeries: base+'car/queryBrandSeries',//搜索品牌车系
      addRepairComplaint:base+'repair/addRepairComplaint/checkSession',//保存投诉接口
      saveSelectCar: base+'car/saveSelectCar/checkSession',//保存用户选择车辆
      queryCarRepairList:base+'repair/queryCarRepairList/checkSession',//查询车辆维修列表
      addRepairComment: base+'repair/addRepairComment/checkSession',//保存维修点评
      queryRepairInfo: base+'repair/queryRepairInfo/checkSession',//保存结算单详情
      viewCertificate: base+'repair/viewCertificate/checkSession',//查看合格证
      applyCarAuth: base+'car/applyCarAuth/checkSession',//认证车辆接口
      queryCarCircleList: base+'carCircle/queryCarCircleList',//车圈列表
      queryCarCircle: base+'carCircle/queryCarCircle/',//车圈详情
      praiseCarCircle: base+'carCircle/praiseCarCircle/checkSession',//车圈点赞
      commentCarCircle: base+'carCircle/commentCarCircle/checkSession',//车圈评论
      queryCommentList: base+'carCircle/queryCommentList',//车圈评论列表
      isLogin: base+'general/isLogin',//是否登录
      queryCompTypes: base+'company/queryCompTypes',//获取企业类型
      queryComplist: base+'company/queryComplist',//查询企业列表
      queryCompInfo: base+'company/queryCompInfo',//查询企业详情
      queryRecommendComps: base+'company/queryRecommendComps',//获取推荐企业
      queryCompCommentList: base+'company/queryCommentList',//获取评论列表
      addComment: base+'company/addComment/checkSession',//用户评论
      queryUserInfo: base+'user/queryUserInfo/checkSession',//查询用户信息
      updateUser: base+'user/updateUser/checkSession',//更改个人信息
      queryComplaintRepair: base+'repair/queryComplaintRepair/checkSession',//投诉详情
      paycode:payDomain+'/paymentManager/pay/payOrderJSONP',//获取支付地址
      addOrder: base+'order/addOrder', //添加在线预约
      queryBindPlateNos: base+'car/queryBindPlateNos/checkSession', //在线预约获取用户绑定车牌号
      queryNearByComps: base+'company/queryNearByComps',//企业详情获取最近推荐企业
      userLogout: base+'user/userLogout',//退出登录
      queryHotCarBrands: base+'general/queryHotCarBrands',//获取热门品牌
      bindUsersCar: base+'car/bindUsersCar/checkSession',//用户绑定车辆
      checkCarIsBind: base+'car/checkCarIsBind/checkSession', //判断车辆是否已绑定
      queryPayState: base+'repair/queryPayState/checkSession',//查询支付状态
      queryRecommendCarCircles: base+'carCircle/queryRecommendCarCircles',//获取首页车圈列表
      queryBannderPhotos: base+'company/queryBannderPhotos',//首页banner
      queryAdvertisePhotos: base+'company/queryAdvertisePhotos',//首页广告图
      paysocket:socketDomain+'/paymentManager/webSocketEndpoint',
      payReasult:payDomain+'/paymentManager/pay/longConnect/queryPayStatus',
      getGeneralIp: base+'general/ip2region',//获取行政区域代码
      queyrCityList: base+'general/queyrCityList',//获取城市列表
      userFeedback:base+'user/userFeedback',//用户反馈
      downloadFile:base+'general/downloadFile/checkSession',//下载文件
      queryCarRepairTimes:base+'car/queryCarRepairTimes/checkSession',//计算车辆维修次数
      addCooperate:base+'company/addCooperate'//添加平台合作
    }
}
