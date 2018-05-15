<template>
  <div id="keys">

    <el-card class="box-card" style="margin-bottom: 30px">
      <div slot="header" class="clearfix">
        <span>添加key</span>
      </div>
      <div>
        <el-input placeholder="key" v-model="key" />
        <el-button type="primary" style="margin-top: 10px;" @click="add">添加</el-button>
      </div>
    </el-card>

    <el-table
      :data="keys"
      border
      style="width: 100%">
      <el-table-column
        label="密钥">
        <template slot-scope="scope">
          {{ scope.row }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      keys: [],
      key: ''
    }
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
    async add() {
      if (this.key === '') {
        this.warnning('key不能为空');
        return;
      }
      try {
        const { data: { data, status, msg } }  = await axios.post('/admin/add/key', { key: this.key });
        if (status) {
          this.keys.push(this.key);
          this.key = '';        
          this.success(msg);
          return;
        }
        this.warnning(msg);
      } catch (e) {
        this.warnning('添加失败');
      }
    },
    async del(key) {
      this.$confirm('确定删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const { data: { status, data, msg } } = await axios.post('/admin/delete/key', { key });
          if (status) {
            this.success('删除成功');
            const index = this.keys.findIndex(keye => keye === key);
            if (index !== -1) this.keys.splice(index, 1);
            console.log(index);
          }
        } catch (e) {

        }
      }).catch(() => {});

    },
    async getKeys() {
      try {
        const { data: { data, status, msg } } = await axios.post('/admin/get/keys');
        this.keys = data.keys;
      } catch (e) {
        this.warnning('获取失败');
      }
    }
  },
  mounted () {
    this.getKeys();
  }
}
</script>
