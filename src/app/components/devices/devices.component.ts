import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AccountManagementService} from '../../services/account-management.service';
import {Subscription} from 'rxjs';
import {DeviceProfileService} from '../../services/device-profile.service';
import {Device} from '../../models/device';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {defaultDeviceParamRequest} from '../../common/constants';
import {DeviceDataSource} from '../../services/device-data-source';
import {Page} from '../../models/common';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  isRealmSelected: boolean;
  dataSource: DeviceDataSource<Page<Device>>;
  loading: boolean;
  paramRequest = defaultDeviceParamRequest;
  displayedColumns = ['status', 'deviceDisplayName', 'deviceSerialnumber', 'groups'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private accManagement: AccountManagementService, private deviceProfileService: DeviceProfileService) {
  }

  async ngOnInit(): Promise<void> {
    this.isRealmSelected = this.accManagement.isRealmSelected();
    this.dataSource = new DeviceDataSource(this.deviceProfileService);
    this.dataSource.loadDevices(this.paramRequest);
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setParamRequest(data): void {
    this.paramRequest.pageSize = data.pageSize;
    this.paramRequest.pageNumber = data.pageIndex;
    // this.paramRequest.sortByProperty = data.sortByProperty;
    // this.paramRequest.sortByDirection = data.sortByDirection;
  }

  getServerData($event: PageEvent) {
    this.setParamRequest($event);
    this.dataSource.loadDevices(this.paramRequest);
  }
}
