import Mock from 'mockjs'

// 评论语句库
const commentPhrases = [
  '服务很专业，态度也很好。',
  '师傅准时到达，操作熟练。',
  '性价比高，值得推荐。',
  '使用后体验非常好，解决了大问题！',
  '工作人员很细心，还帮我多检查了一下。',
  '打扫很干净，没有死角。',
  '维修速度很快，而且讲解详细。',
  '疏通管道后就没再堵过，感谢！',
  'App下单方便快捷，客服响应快。',
  '整个过程很省心，五星好评。',
  '响应迅速，问题解决彻底。',
  '收费合理，没有隐形消费。',
  '工具专业，操作规范安全。',
  '服务周到，细节考虑全面。',
  '技术过硬，一次解决问题。',
  '态度亲切，沟通顺畅。',
  '价格透明，消费明白。',
  '售后跟进及时，很负责任。',
  '穿着整齐，很有职业素养。',
  '保护现场卫生，完工清理。',
  '按照约定时间准时上门。',
  '解释清楚，耐心回答问题。',
  '维修质量好，使用稳定。',
  '服务流程规范，体验舒适。',
  '配件质量好，使用寿命长。',
  '客服态度好，预约方便。',
  '技术员经验丰富，手法娴熟。',
  '解决问题快速，不拖沓。',
  '收费公道，物有所值。',
  '服务后还有回访，很贴心。',
  '工作认真，不敷衍了事。',
  '设备先进，检测准确。',
  '服务热情，让人心情愉快。',
  '维修后提供保养建议。',
  '价格比市场价更优惠。',
  '服务超出预期，非常满意。',
  '技术可靠，值得信赖。',
  '响应及时，紧急情况处理快。',
  '服务细节到位，体验佳。',
  '专业团队，品质有保障。',
  '解决问题彻底，不返修。',
  '服务态度真诚，不忽悠。',
  '工作效率高，不浪费时间。',
  '技术精湛，手法细腻。',
]

/**
 * 生成随机评论内容
 * @returns {string} 拼接后的评论内容
 */
export function generateRandomComment() {
  const count = Math.floor(Math.random() * 2) + 1
  const shuffled = [...commentPhrases].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count).join(' ')
}

/**
 * 生成评论数据
 * @param {number} count 生成数量
 * @returns {Array} 评论数据数组
 */
export function generateComments(count) {
  return Array.from({ length: count }, () => ({
    // imgs: `https://picsum.photos/seed/avatar${Mock.Random.integer(1, 100)}/100/100`,
    // img: `https://picsum.photos/200/200?random=${Mock.Random.integer(1, 100)}`,
    name: Mock.Random.cname(),
    content: generateRandomComment(),
    time: Mock.Random.datetime(),
  }))
}

/**
 * 格式化用户名（脱敏处理）
 * @param {string} name 原始用户名
 * @returns {string} 脱敏后的用户名
 */
export function formatName(name) {
  if (!name) return ''
  const len = name.length
  if (len <= 2) {
    return name[0] + '*'
  } else {
    return name[0] + '*'.repeat(len - 2) + name[len - 1]
  }
}

/**
 * 启动评论自动滚动
 * @param {Object} options 配置对象
 * @param {Ref} options.currentIndex 当前索引的ref
 * @param {number} options.commentCount 评论总数
 * @param {number} options.visibleCount 可见评论数
 * @param {number} [options.interval=8000] 滚动间隔(ms)
 * @returns {function} 清除定时器的函数
 */
export function startAutoScroll({ currentIndex, commentCount, visibleCount, interval = 8000 }) {
  let scrollTimer = null

  const clear = () => {
    if (scrollTimer) {
      clearInterval(scrollTimer)
      scrollTimer = null
    }
  }

  clear() // 先清除已有定时器

  if (commentCount <= visibleCount) {
    return clear // 评论不足时不滚动
  }

  scrollTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % (commentCount - visibleCount + 1)
  }, interval)

  return clear
}
// // 添加定时器变量
// let scrollTimer = null
// const startAutoScroll = () => {
//   if (scrollTimer) clearInterval(scrollTimer)
//   scrollTimer = setInterval(() => {
//     currentCommentIndex.value =
//       (currentCommentIndex.value + 1) % Math.max(1, comments.length - visibleCommentCount + 1)
//   }, 8000)
// }
