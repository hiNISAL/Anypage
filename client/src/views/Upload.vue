<template>
  <div id="upload">
    <el-card>
      <div slot="header" class="clearfix">
        <span>添加站点</span>
      </div>
      <el-form ref="form" :model="addData" label-width="120px">

        <el-form-item label="上传文件">
          <el-upload
            ref="upload"
            name="site"
            action="/admin/create/site"
            drag
            :data="addData"
            :auto-upload="false"
            :before-upload="doUpload"
            with-credentials
            :on-success="onSuccess"
            :on-error="onError">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip" style="margin: 0;">只能上传zip格式压缩包</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="使用配置文件">
          <el-switch
            v-model="addData.useConfig"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
            <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
        <el-collapse-transition>
          <div v-show="!addData.useConfig">
            <el-form-item label="站点名称">
              <el-input v-model="addData.title"></el-input>
            </el-form-item>
            <el-form-item label="路由">
              <el-input v-model="addData.route"></el-input>
            </el-form-item>
            <el-form-item label="封面">
              <el-input v-model="addData.cover" placeholder="只能使用线上的图片地址"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="addData.desc"></el-input>
            </el-form-item>
          </div>
        </el-collapse-transition>
        <el-form-item>
          <el-button type="primary" @click="submit">添加站点</el-button>
        </el-form-item>
      </el-form>
    </el-card>


    <el-card style="margin: 20px 0;">
      <div slot="header" class="clearfix">
        <span>site.josn说明</span>
      </div>
      <p style="margin-bottom: 10px;">
        <code>site.json</code> 文件可以放在压缩包的根目录，存放着站点配置信息。使用 <code>site.json</code> 可以在添加站点的时候不需要填写表单信息。
      </p>
      <el-table
        :data="siteConfig"
        border
        style="width: 100%">
        <el-table-column
          prop="config"
          label="配置项">
        </el-table-column>
        <el-table-column
          prop="desc"
          label="描述">
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      siteConfig: [{
        config: 'title',
        desc: '站点名称'
      },{
        config: 'route',
        desc: '路由'
      },{
        config: 'cover',
        desc: '封面'
      },{
        config: 'desc',
        desc: '描述'
      }],
      addData: {
        title: '',
        route: '',
        cover: '',
        desc: '',
        useConfig: true
      },
      haveFile: false
    };
  },
  methods: {
    success(text) {
      this.$notify({
        title: '成功',
        message: text,
        type: 'success'
      })
    },
    warnning(text) {
      this.$notify({
        title: '提示',
        message: text,
        type: 'warning'
      });
    },
    doUpload(file) {
      if (file.name.split('.').pop() !== 'zip') {
        this.warnning('必须为 .zip 文件');
        return false;
      }
    },
    submit() {
      this.$refs.upload.submit();
    },
    onSuccess({ data, msg, status }) {
      if (status) {
        this.success(`添加成功 路由为 ${ data.route }`);
        return;
      }
      this.warnning(msg);
    },
    onError(err) {
      console.log(err);
    }
  }
}
</script>

<style lang="scss" scoped>
  #upload {
    code {
      padding: 2px 4px;
      font-size: 90%;
      color: #c7254e;
      background-color: #f9f2f4;
      border-radius: 4px;
    }
  }
</style>
