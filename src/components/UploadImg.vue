<template>
  <div>
    <el-upload
      v-loading="loading"
      class="uploadImg"
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-change="onChange"
      :before-upload="beforeUpload"
      :http-request="onHttpRequest"
      :limit="1"
    >

      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog title="图片预览" width="50%" :visible.sync="dialogVisible">
      <img width="100%" :src="previewImgUrl">
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDkNo57uVsBKDrHVWIuHRVO2SeeYIoQoxu',
  SecretKey: 'pPlspYCeuyUopcAbItLchXBfw3yviKjz'
})
export default {
  name: 'UploadImg',
  props: {
    defaultUrl: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      fileList: [],
      dialogVisible: false,
      previewImgUrl: '',
      loading: false
    }
  },
  watch: {
    defaultUrl() {
      this.fileList.push({
        name: 'default', url: this.defaultUrl
      })
    }
  },
  methods: {
    onPreview(file) {
      this.previewImgUrl = file.url
      this.dialogVisible = true
    },
    onRemove(file, fileList) {
      this.fileList = fileList
    },
    onChange(file, fileList) {
      this.fileList = fileList
    },
    onHttpRequest({ file }) {
      this.loading = true
      cos.putObject({
        Bucket: 'hz-yxy-1314348616', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-shanghai', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        if (err) return this.$message.error('上传图片失败')
        this.loading = false
        this.$emit('on-success', { imgUrl: 'https://' + data.Location })
      })
    },
    beforeUpload(file) {
      const allowTypes = ['image/jpeg', 'image/gif']
      const ishas = allowTypes.includes(file.type)
      if (!ishas) {
        this.$message.error('亲，只能上传' + allowTypes.join('、') + '类型文件')
        return false
      }
      const maxSize = 1 * 1024 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('亲上传文件不能超过1MB')
        return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .uploadImg{
    width: 148px;
    height: 148px;
    overflow: hidden;
  }
</style>
