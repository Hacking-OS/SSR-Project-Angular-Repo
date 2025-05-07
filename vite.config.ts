import { defineConfig } from 'vite';

export default defineConfig({
  ssr: {
    noExternal: [
      '@swimlane/ngx-datatable',
      'video.js',
      'hls.js',
      'ngx-echarts',
      'ngx-toastr',
      'bootstrap',
      'ngx-bootstrap',
      'primeng',
      'ng2-charts',
      'chart.js',
      'primeicons',
      'primeflex',
      'ngx-toasta',
      'ngx-logger'
    ]
  }
});
