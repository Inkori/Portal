import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AccountManagementService} from '../../services/account-management.service';
import {Observable, Subscription} from 'rxjs';
import {DeviceProfileService} from '../../services/device-profile.service';
import {Device} from '../../models/device';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {tap} from 'rxjs/operators';
import {ParamRequest} from '../../models/common';
import {defaultDeviceParamRequest} from '../../common/constants';
import {DeviceDataSource} from '../../models/device-data-source';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  isRealmSelected: boolean;
  dataSource: DeviceDataSource;
  loading: boolean;
  paramRequest = defaultDeviceParamRequest;
  displayedColumns = ['status', 'deviceDisplayName', 'deviceSerialnumber', 'groups'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private accManagement: AccountManagementService, private deviceProfileService: DeviceProfileService) {
  }

  ngOnInit(): void {
    this.isRealmSelected = this.accManagement.isRealmSelected();
    this.dataSource = new DeviceDataSource(this.deviceProfileService);
    this.dataSource.loadDevices(this.paramRequest);

    // this.retrieveDevicesFromApi(this.paramRequest);
    this.subscriptions.add(this.accManagement.currentRealm$.subscribe(data => {
      this.isRealmSelected = !!data;
      if (!!data) {
        this.dataSource.loadDevices(this.paramRequest);
      }
    }));
    this.subscriptions.add(this.dataSource.loadingSubject$.subscribe(
      value => this.loading = value));
    this.subscriptions.add(this.deviceProfileService.reloadDeviceList$.subscribe(val => {
      this.dataSource.loadDevices(this.paramRequest);
    }));
  }

  ngAfterViewInit() {
    this.subscriptions.add(this.paginator.page
      .pipe(tap(data => {
          console.log(data);
          this.setParamRequest(data);
          this.dataSource.loadDevices(this.paramRequest);
        }
      )).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setParamRequest(data): void{
    this.paramRequest.pageSize = data.pageSize;
    this.paramRequest.pageNumber = data.pageIndex;
    // this.paramRequest.sortByProperty = data.sortByProperty;
    // this.paramRequest.sortByDirection = data.sortByDirection;
  }
}
