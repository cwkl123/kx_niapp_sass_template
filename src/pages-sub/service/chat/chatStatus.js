export default {
  type: {
    conversation: ['question', 'chat'], //对话类型
    send: ['admin', 'user', 'system'], //发送者的用户类型
    content: ['text', 'html', 'imageUrl'], //消息内容的类型
  },

  isQuestion(conversationType) {
    return this.type.conversation[0] === conversationType
  },

  isChat(conversationType) {
    return this.type.conversation[1] === conversationType
  },

  isAdmin(sendType) {
    return this.type.send[0] === sendType
  },

  isUser(sendType) {
    return this.type.send[1] === sendType
  },

  isSystem(sendType) {
    return this.type.send[2] === sendType
  },

  isText(contentType) {
    return this.type.content[0] === contentType
  },

  isHtml(contentType) {
    return this.type.content[1] === contentType
  },

  isImageUrl(contentType) {
    return this.type.content[2] === contentType
  },
}
