<template>
  <div class="reports">
    <!-- 通过options指定数据 -->
    <v-chart :options="data"></v-chart>
  </div>
</template>

<script>
import { getReports } from "@/api/reports_index.js";

import ECharts from "vue-echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/polar";
export default {
  data() {
    return {
      data: {}
    };
  },

  components: {
    "v-chart": ECharts
  },
  mounted() {
    getReports(1).then(res => {
      //   console.log(res);
      if (res.data.meta.status === 200) {
        this.data = res.data.data;
      }
    });
  }
};
</script>

<style lang="less" scoped>
.reports {
  width: 100%;
  height: 100%;
}

.echarts {
  width: 100%;
  height: 100%;
}
</style>