<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  style: {
    navigationBarTitleText: '个人信息',
  },
}
</route>
<template>
  <view class="bg">
    <view class="box">
      <view class="item">
        <view class="label">头像</view>
        <view class="right">
          <uploadImage @on-up-img-suc="handleUploadSuccess" @on-up-img-fail="handleFail">
            <image class="avatar" :src="userInfo.avatar" mode="aspectFit" />
          </uploadImage>

          <image class="menu-arrow" src="/static/images/mine/index/close-icon.png" />
        </view>
      </view>
      <view class="item">
        <view class="label">昵称</view>
        <view class="right" @click="showNickName = true">
          <view class="txt">{{ userInfo.nickName }}</view>
          <image class="menu-arrow" src="/static/images/mine/index/close-icon.png" />
        </view>
      </view>
    </view>
  </view>
  <wd-action-sheet v-model="showNickName" title="修改昵称" :z-index="100">
    <view class="box">
      <view class="search">
        <view class="search_icon">昵称</view>
        <input
          class="input_box"
          v-model="searchValue"
          placeholder="请输入昵称"
          maxlength="10"
          clearable
        />
        <view class="input_image" v-if="searchValue" @click="searchValue = ''">
          <wd-icon name="error-fill" size="18px" color="#cdcdcd"></wd-icon>
        </view>
      </view>
      <view class="limit">限制昵称长度为1-10个字符，一个汉字算1个字符</view>
      <view class="botton" @click="saveNickName">保存</view>
    </view>
  </wd-action-sheet>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store'
import { updateInfo } from '@/service/user/userSelApi'
import { getWxUserInfo } from '@/service/base/loginApi'

const imgUrl = import.meta.env.VITE_UPLOAD_BASEURL
const userStore = useUserStore()
const searchValue = ref('')
const showNickName = ref(false)
const userInfo = ref({
  avatar: defaultAvatar,
  nickName: '微信用户',
})
const defaultAvatar =
  'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'

const getUserInfo = async () => {
  const { code, value } = await getWxUserInfo()
  if (code === '000' && value != null) {
    userInfo.value = value
  }
  searchValue.value = userInfo.value.nickName || '微信用户'
  if (userInfo.value.avatar == defaultAvatar) {
    userInfo.value.avatar = '/static/images/mine/index/user_images.png'
  } else {
    userInfo.value.avatar = imgUrl + userInfo.value.avatar
  }
}
// 处理上传成功
const handleUploadSuccess = async (fileData) => {
  console.log('上传成功:', fileData)
  const res = await updateInfo({
    avatar: fileData.url,
    uId: userInfo.value.uId,
  })
  if (res.code == '000') {
    await getUserInfo()
    userStore.setUserInfo(userInfo.value)
  } else {
    uni.showToast({
      title: res.message || '上传失败',
      icon: 'none',
    })
  }
}
// 处理上传失败
const handleFail = (error) => {
  uni.showToast({
    title: error || '上传失败',
    icon: 'none',
  })
}
// 保存昵称
const saveNickName = async () => {
  if (searchValue.value.trim() === '') {
    uni.showToast({
      title: '昵称不能为空',
      icon: 'none',
    })
    return
  }
  const res = await updateInfo({
    nickname: searchValue.value,
    uId: userInfo.value.uId,
  })
  if (res.code == '000') {
    await getUserInfo()
    userStore.setUserInfo(userInfo.value)
    showNickName.value = false
  } else {
    uni.showToast({
      title: res.message || '修改失败',
      icon: 'none',
    })
  }
}
onShow(async () => {
  await getUserInfo()
})
</script>

<style scoped lang="scss">
.bg {
  height: 100vh;
  background: #f8f8f8;
  padding: 5vw;
  .box {
    background-color: #fff;
    border-radius: 10px;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 5px 10px 15px;
      .label {
        color: #333;
        font-size: 15px;
      }
      .right {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #fff;
          border: 1px solid #d9d2e0;
        }
        .txt {
          font-size: 14px;
        }
        .menu-arrow {
          width: 40rpx;
          height: 40rpx;
          margin-left: 10rpx;
        }
      }
    }
  }
}
.box {
  padding: 0 5vw;
  .search {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    width: 100%;
    background-color: #f8f8f8;
    border-radius: 10px;
    font-size: 14px;
  }
  .search_icon {
    display: flex;
    text-align: center;
    align-items: center;
    width: 15%;
    padding-left: 15px;
    height: 40px;
  }
  .input_box {
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: 72%;
  }
  .input_image {
    align-items: center;
    justify-content: space-between;
    width: 5%;
  }
  .limit {
    font-size: 12px;
    color: #999;
    margin-bottom: 20px;
  }
  .botton {
    padding: 15px;
    text-align: center;
    background-color: #2771f0;
    color: #fff;
    border-radius: 25px;
    font-size: 16px;
  }
}
</style>
