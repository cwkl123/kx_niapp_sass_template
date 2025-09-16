<!--
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-07-08 14:49:52
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-07-17 10:26:36
 * @FilePath: \huijiashenghuo_niapp\src\components\upload-image\uploadImage.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <view @click.stop="chooseImg">
    <slot></slot>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  maxNum: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['onUpImgSuc', 'onUpImgFail'])
const fileList = ref([])
const chooseImg = () => {
  if (props.maxNum <= 0) {
    uni.showToast({
      icon: 'none',
      title: '最多可选9张图片',
      duration: 1200,
    })
    return
  }

  uni.chooseImage({
    count: 1,
    sizeType: 'original',
    success: (res) => {
      fileList.value = res.tempFilePaths.map((path) => ({
        url: path,
      }))
      uploadImages()
    },
    fail: (res) => {
      emit('onUpImgFail', '选择图片失败')
    },
  })
}

// const uploadImages = async () => {
//   uni.showLoading({
//     title: '图片上传中'
//   })
// const formData= ({
//         file:fileList.value[0].url,
// 		type: 1 ,

//       })
//   try {
//     const {success, data} = await uploadImg(formData)
//     if (success) {
//       console.log("图片上传成功", data)
//       emit('onUpImgSuc', data)
//     }
//   } catch (e) {
//     console.error("上传出错:", e)
//   } finally {
//     setTimeout(() => {
//           uni.hideLoading()
//         }, 300)
//   }
// }
const uploadImages = async () => {
  uni.showLoading({ title: '图片上传中' })
  try {
    const uploadRes = await new Promise((resolve, reject) => {
      uni.uploadFile({
        url: '/upload/uploadImg',
        filePath: fileList.value[0].url,
        name: 'file',
        formData: { type: 1 },
        success: resolve,
        fail: reject,
      })
    })

    const { value } = JSON.parse(uploadRes.data)

    emit('onUpImgSuc', {
      url: value.path, // 直接使用返回的path
      name: value.path.split('/').pop(), // 从路径提取文件名
    })
  } catch (e) {
    console.error('上传出错:', e)
    emit('onUpImgFail', e.message)
    uni.showToast({ title: '上传失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}
</script>

<style></style>
