import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, takeUntil} from 'rxjs/operators';
import {StatsService} from '../../../services/stats.service';
import {StatsChartInfo} from '../../../models/stats';
import {Subject} from 'rxjs';
import {AccountManagementService} from '../../../services/account-management.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  public pageName = 'Home';
  public isRealmSelected: boolean;
  public chartInfo: StatsChartInfo[] = [];
  public loading: boolean;

  public cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return {
          columns: 1,
          miniCard: {cols: 1, rows: 1},
          chart: {cols: 1, rows: 2},
        };
      }

      return {
        columns: 4,
        miniCard: {cols: 1, rows: 1},
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
    this.accManagement.currentRealm$.pipe(takeUntil(this.subscriptions$)).subscribe(data => {
      this.isRealmSelected = !!data;
      this.initChartInfo();
    });
    this.accManagement.reloadPage$.pipe(takeUntil(this.subscriptions$)).subscribe(data => {
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
    this.chartInfo = [];
    this.statsService.getDevicesStats().pipe(takeUntil(this.subscriptions$)).subscribe({
      next: (devices) => {
        const chart = new StatsChartInfo();
        chart.title = 'Device';
        devices.deviceByStatus.forEach((el) => {
          chart.labels.push(el.status);
          chart.chartData.push(+el.count);
        });
        chart.total = +devices.total;
        this.chartInfo.push(chart);
      },
    });

    this.statsService.getUsersStats().pipe(takeUntil(this.subscriptions$)).subscribe({
      next: (users) => {
        const chart = new StatsChartInfo();
        chart.title = 'Users';
        chart.labels.push('Authenticated');
        chart.labels.push('Invited');
        chart.chartData.push(+users.authenticatedUserCount);
        chart.chartData.push(+users.invitedUserCount);
        chart.total = +users.authenticatedUserCount + +users.invitedUserCount;
        this.chartInfo.push(chart);
      },
    });
    this.loading = false;
  }
}
