import {Component, Input, OnInit} from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {

  public chartOptions: ChartOptions = {
    responsive: true,
  };
  public chartLabels: Label[];
  public chartData: any = [];
  public chartType: ChartType;
  public chartLegend = true;
  public chartPlugins = [];

  @Input() public labelsInput: Label[];
  @Input() public chartTypeInput: ChartType;
  @Input() public chartDataInput: any;

  constructor() {
  }

  public ngOnInit() {
    this.chartLabels = this.labelsInput;
    this.chartData = this.chartDataInput;
    this.chartType = this.chartTypeInput;
  }
}
