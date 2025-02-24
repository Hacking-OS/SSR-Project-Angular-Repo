import { defineConfig } from 'vite';

export default defineConfig({
  ssr: {
    noExternal: [
      '@swimlane/ngx-datatable',
      'video.js',
      'hls.js',
      'ngx-echarts'
    ]
  }
});
