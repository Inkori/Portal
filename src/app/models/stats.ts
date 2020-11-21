import {Label, SingleDataSet} from 'ng2-charts';
import {ChartDataSets, ChartType} from 'chart.js';

export class UserStats {
  public authenticatedUserCount: number;
  public invitedUserCount: number;
}

export class AppStats {
  public installed: number;
  public top: [];
  public total: number;
}

class AssetsByType {
  public count: number;
  public size: number;
  public type: string;
}

export class AssetStats {
  public assetsByType: AssetsByType[];
  public count: number;
  public size: number;
}

class DeviceByStatus {
  public count: number;
  public percentage: string;
  public status: string;
}

export class DevicesStat {
  public deviceByStatus: DeviceByStatus[];
  public total: number;
}

export enum StatsDataType {
  MEDIA,
  APPS,
  USER,
  DEVICE
}

export class  StatsChartInfo {
  public title: string;
  public labels: Label[] = [];
  public chartData: ChartDataSets[] = [];
  public total: number;
  public chartType: ChartType;
  public dataType: StatsDataType;
}
