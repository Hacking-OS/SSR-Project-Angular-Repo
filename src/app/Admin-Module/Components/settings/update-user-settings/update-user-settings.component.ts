import { Component } from '@angular/core';

@Component({
    selector: 'app-update-user-settings',
    templateUrl: './update-user-settings.component.html',
    styleUrl: './update-user-settings.component.css',
    standalone: false
})
export class UpdateUserSettingsComponent {
  // Data for each chart type
  barChartData = {
    title: 'Bar Chart Example',
    xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    yAxis: [
      { value: 820, name: 'Mon' },
      { value: 932, name: 'Tue' },
      { value: 901, name: 'Wed' },
      { value: 934, name: 'Thu' },
      { value: 1290, name: 'Fri' },
    ],
  };

  lineChartData = {
    title: 'Line Chart Example',
    xAxis: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    series: [120, 132, 101, 134, 90],
  };

  pieChartData = {
    title: 'Pie Chart Example',
    legend: ['Category A', 'Category B', 'Category C'],
    data: [
      { name: 'Category A', value: 40 },
      { name: 'Category B', value: 35 },
      { name: 'Category C', value: 25 },
    ],
  };

  scatterChartData = {
    title: 'Scatter Chart Example',
    data: [
      [10, 20],
      [30, 40],
      [50, 60],
      [70, 80],
      [90, 100],
    ],
  };

  radarChartData = {
    title: 'Radar Chart Example',
    indicator: [
      { name: 'Math', max: 100 },
      { name: 'Science', max: 100 },
      { name: 'English', max: 100 },
      { name: 'History', max: 100 },
    ],
    data: [
      { value: [90, 80, 70, 60], name: 'Student A' },
      { value: [60, 70, 80, 90], name: 'Student B' },
    ],
  };

  // Chart Options
  barChartOptions = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: this.barChartData.xAxis },
    yAxis: { type: 'value' },
    series: [
      {
        data: this.barChartData.yAxis.map((item) => item.value),
        type: 'bar',
      },
    ],
  };

  lineChartOptions = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: this.lineChartData.xAxis },
    yAxis: { type: 'value' },
    series: [
      {
        data: this.lineChartData.series,
        type: 'line',
        smooth: true,
      },
    ],
  };

  pieChartOptions = {
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: this.pieChartData.legend,
    },
    series: [
      {
        name: 'Categories',
        type: 'pie',
        radius: '50%',
        data: this.pieChartData.data,
      },
    ],
  };

  scatterChartOptions = {
    tooltip: { trigger: 'item' },
    xAxis: { type: 'value' },
    yAxis: { type: 'value' },
    series: [
      {
        symbolSize: 20,
        data: this.scatterChartData.data,
        type: 'scatter',
      },
    ],
  };

  radarChartOptions = {
    tooltip: { trigger: 'axis' },
    radar: {
      indicator: this.radarChartData.indicator,
    },
    series: [
      {
        type: 'radar',
        data: this.radarChartData.data,
      },
    ],
  };
}
