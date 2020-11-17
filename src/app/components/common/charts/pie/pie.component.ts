import {Component, Input, OnInit} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import {StatsService} from '../../../../services/stats.service';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css'],
})
export class PieComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  @Input() labels: Label[];
  @Input() chartData: SingleDataSet;

  constructor(private statsService: StatsService) { }

  ngOnInit() {
    this.pieChartLabels = this.labels;
    this.pieChartData = this.chartData;
    // this.statsService.getDevicesStats().subscribe({
    //   next: (devices) => {
    //     devices.deviceByStatus.forEach(el => {
    //       this.pieChartLabels.push(el.status);
    //       this.pieChartData.push(el.count);
    //     });
    //   }
    // });
  }
}
