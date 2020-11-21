import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChartDataSets} from 'chart.js';
import {Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {
  APPS,
  APPS_ADDED,
  APPS_INSTALLED, ASSETS,
  CHART_TYPE_BAR, CHART_TYPE_PIE,
  DEVICES,
  USERS,
  USERS_AUTHENTICATED,
  USERS_INVITED,
} from '../../../constants/constants';
import {StatsChartInfo, StatsDataType} from '../../../models/stats';
import {AccountManagementService} from '../../../services/account-management.service';
import {StatsService} from '../../../services/stats.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  public chartContainer: StatsChartInfo[];
  public pageName = 'Home';
  public isRealmSelected: boolean;
  public loading: boolean;

  public cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return {
          columns: 1,
          chart: {cols: 1, rows: 2},
        };
      }
      return {
        columns: 4,
        chart: {cols: 2, rows: 2},
      };
    }),
  );

  constructor(private breakpointObserver: BreakpointObserver,
              private statsService: StatsService,
              private accManagement: AccountManagementService) {
  }

  public ngOnInit(): void {
    this.initChartInfo();
    this.isRealmSelected = this.accManagement.isRealmSelected();
    this.accManagement.currentRealm$.pipe(takeUntil(this.subscriptions$)).subscribe((data) => {
      this.isRealmSelected = !!data;
      this.initChartInfo();
    });
    this.accManagement.reloadPage$.pipe(takeUntil(this.subscriptions$)).subscribe((data) => {
      this.isRealmSelected = !!data;
      this.initChartInfo();
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  public getPercent(chartData: number[], num: number): number {
    if (chartData && num) {
      let a = 0;
      chartData.forEach((el) => a += el);
      return Math.round(((num * 100 / a) + Number.EPSILON) * 100) / 100;
    }
    return 0;
  }

  private initChartInfo() {
    this.loading = true;
    this.chartContainer = [];
    this.statsService.getDevicesStats().pipe(takeUntil(this.subscriptions$)).subscribe({
      next: (devices) => {
        const chart = new StatsChartInfo();
        chart.title = DEVICES;
        const dataSet: ChartDataSets[] = [{ data: []}];
        devices.deviceByStatus.forEach((el) => {
          chart.labels.push(el.status);
          dataSet[0].data.push(+el.count);
        });
        chart.chartData = dataSet;
        chart.total = +devices.total;
        chart.chartType = CHART_TYPE_PIE;
        this.chartContainer.push(chart);
        this.loading = false;
      },
    });

    this.statsService.getUsersStats().pipe(takeUntil(this.subscriptions$)).subscribe({
      next: (users) => {
        const chart = new StatsChartInfo();
        chart.title = USERS;
        chart.labels.push(USERS_AUTHENTICATED);
        chart.labels.push(USERS_INVITED);
        chart.chartData.push( { data: [+users.authenticatedUserCount, +users.invitedUserCount]});
        chart.total = +users.authenticatedUserCount + +users.invitedUserCount;
        chart.chartType = CHART_TYPE_PIE;
        this.chartContainer.push(chart);
        this.loading = false;
      },
    });

    this.statsService.getAppsStats().pipe(takeUntil(this.subscriptions$)).subscribe({
      next: (apps) => {
        const chart = new StatsChartInfo();
        chart.title = APPS;
        const dataSet: ChartDataSets[] = [];
        dataSet.push( { data: [+apps.installed], label: APPS_INSTALLED });
        dataSet.push({ data: [+apps.total], label: APPS_ADDED } );
        chart.chartData = dataSet;
        chart.labels.push(APPS);
        chart.chartType = CHART_TYPE_BAR;
        chart.total = +apps.total;
        this.chartContainer.push(chart);
        this.loading = false;
      },
    });

    this.statsService.getAssetStats().pipe(takeUntil(this.subscriptions$)).subscribe({
      next: (media) => {
        const chart = new StatsChartInfo();
        chart.title = ASSETS;
        const dataSet: ChartDataSets[] = [];
        media.assetsByType.forEach((el) => dataSet.push( { data: [el.count], label: el.type }));
        chart.chartData = dataSet;
        chart.labels.push(ASSETS);
        chart.chartType = CHART_TYPE_BAR;
        chart.total = Math.round(((+media.size / 1073741824) + Number.EPSILON) * 100) / 100 ;
        chart.dataType = StatsDataType.MEDIA;
        this.chartContainer.push(chart);
        this.loading = false;
      },
    });
  }

  public getTotal(title: string, total: number, type: StatsDataType): string {
    if (type === StatsDataType.MEDIA) {
      return 'Total ' + title.toLowerCase() + ' size: ' + total + 'GB';
    } else {
      return 'Total ' + title.toLowerCase() + ': ' + total;
    }
  }
}
