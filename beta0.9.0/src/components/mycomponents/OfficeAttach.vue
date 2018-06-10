<!-- office附件 附件为空的时候有按钮生成空的word模板 存在附件的时候点击在线编辑 -->
<template>
  <div>
    <div class="office-action-content" @click="addOffice()" v-if="!docAttachs.length">
      <p class="office-icon">
        <i class="gs-note_add"></i>
      </p>
      <p class="office-title">
        生成{{typeText}}
      </p>
    </div>
    <div class="office-content" v-if="docAttachs.length">
      <div class="office-item" @click="editOnLine(attachItem)" v-for="attachItem in docAttachs">
        <p class="office-icon">
          <i :class="getFileIconCss(attachItem.suffix)"></i>
        </p>
        <p class="office-title">
          {{attachItem.name}}
        </p>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.office-content{
  display: flex;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  .office-item{
    flex:1;
    text-align: center;
    padding: 8px;
    .office-icon{
      margin-top: 4px;
      i{
        font-size: 50px;
      }
    }
    .office-title{
      line-height: 30px;
    }
  }
}

.office-action-content{
  text-align: center;
  padding: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #8a8a8a;
  .office-icon{
    margin-top: 4px;
    i{
      font-size: 80px;
    }
  }
  .office-title{
    line-height: 30px;
  }
}
</style>
<script>
  import { siteUrl } from '../../utils/common'

  export default {
    name: 'OfficeAttach',
    props: {
      attachs: { // office附件 暂时只支持显示一个
        type: Array,
        default() {
          return []
        }
      },
      type: { // office模板类型
        type: String,
        default: ''
      },
      draftId: { // 附件关联的消息的id
        type: String,
        default: ''
      },
      infoId: { // 生成模板所需的事件信息的infoId
        type: String,
        default: ''
      }
    },
    computed: {
      typeText() {
        switch (this.type) {
          case 'REPORT':
            return '报告'
          case 'TELEX':
            return '电报'
          case 'BULLETIN':
            return '快报'
          case 'SPECIAL':
            return '专报'
          default:
            return ''
        }
      },
      typeCode() {
        switch (this.type) {
          case 'REPORT':
            return '02'
          case 'TELEX':
            return '03'
          case 'BULLETIN':
            return '04'
          case 'SPECIAL':
            return '05'
          default:
            return '02'
        }
      },
      docAttachs: {
        get() {
          return this.attachs
        },
        set() {}
      }
    },
    methods: {
      addOffice() { // 通过服务端生成的office模板
        const url = `${siteUrl}/eventInfo/mis/getAttachTemplate?type=${this.typeCode}&eventInfoId=${this.infoId}&draftId=${this.draftId}`
        this.axios.get(url).then((res) => {
          if (res.data.code === 200) {
            this.docAttachs = []
            this.docAttachs.push(res.data.response)
          }
        })
      },
      editOnLine(attachItem) { // 通过调用安卓原生方法在线编辑文档
        if (this.$store.state.projectType === 'mini') {
          this.$vux.toast.text('小程序不支持在线编辑文档', 'middle')
        }
        const fileId = attachItem.id
        const localId = attachItem.attachPath
        this.$gsafety.amendFile(fileId, localId, (loaclAttachPath) => {
          this.$emit('edit-success', loaclAttachPath)
        })
      },
      getFileIconCss(suffix) {
        const docSuffix = suffix.toLowerCase()
        switch (docSuffix) {
          case 'jpg':
            return 'gs-image'
          case 'txt':
            return 'gs-file'
          case 'pdf':
            return 'gs-file-pdf-o'
          case 'doc':
            return 'gs-file-word-o'
          case 'docx':
            return 'gs-file-word-o'
          default:
            return 'gs-file'
        }
      }
    }
  }
</script>
