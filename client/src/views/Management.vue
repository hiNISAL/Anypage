<template>
  <div id="management">
    <el-table
      :data="sites"
      border
      style="width: 100%">
      <el-table-column
        prop="title"
        label="站点名称">
      </el-table-column>
      <el-table-column
        label="路由">
        <template slot-scope="scope">
          <a :href="scope.row.route">{{ scope.row.route }}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="desc"
        label="描述">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="del(scope.row.folderName)">删除</el-button>
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
      sites: []
    };
  },
  methods: {
    async getSites() {
      try {
        const { data: { data, msg, status } } = await axios.post('/common/sites');

        if (!status) {
          this.warnning(msg);
          return;
        }

        if (data.length === 0) {
          this.warnning('没有数据');
          return;
        }

        this.sites = data.sites;
      } catch(e) {
        this.warnning('加载失败');
      }
    },
    go(route) {
      location.href = route;
    },
    async del(id, index) {
      this.$confirm('确定删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const { data: { data, msg, status } } = await axios.post('/admin/delete/site', { id });

          if (status) {
            let i = this.sites.findIndex(site => site.folderName === id);
            console.log(i);
            if (i !== -1) this.sites.splice(i, 1);
            return;
          }
          this.warnning(msg);
        } catch (e) {
          this.warnning('删除失败');
        }
      }).catch(() => {});


    },
    warnning(text) {
      this.$notify({
        title: '成功',
        message: text,
        type: 'success'
      });
    }
  },
  mounted() {
    this.getSites();
  }
};
</script>
