import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {Subject} from 'rxjs';
import {DeviceDataSource} from '../data-source/device-data-source';
import {AddDeviceModalRequest, Page, ParamRequest} from '../../models/common';
import {Device} from '../../models/device';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AccountManagementService} from '../../services/account-management.service';
import {DeviceProfileService} from '../../services/device-profile.service';
import {AlertService} from '../../services/alert.service';
import {takeUntil} from 'rxjs/operators';
import {
  ASC,
  DEFAULT_DEVICE_PARAM_REQUEST,
  DESC,
  DEVICE_DELETE_ERROR_MESSAGE,
  DEVICE_DELETE_MESSAGE,
  GROUP_ADD_ERROR_MESSAGE,
  GROUP_ADD_MESSAGE
} from '../../common/constants';
import {PageEvent} from '@angular/material/paginator';
import {AddDeviceModalComponent} from '../modals/add-device-modal/add-device-modal.component';
import {GroupsModalComponent} from '../modals/groups-modal/groups-modal.component';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-device-registry',
  templateUrl: './device-registry.component.html',
  styleUrls: ['./device-registry.component.css']
})
export class DeviceRegistryComponent implements OnInit, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  isRealmSelected: boolean;
  deviceDataSource: DeviceDataSource<Page<Device>>;
  loading: boolean;
  paramRequest: ParamRequest;
  displayedColumns = ['selectDevice', 'status', 'deviceDisplayName', 'deviceSerialnumber', 'groups'];
  selectedDeviceIds: string[] = [];
  selectAllDeviceIds = false;

  constructor(
    private dialog: MatDialog,
    private accManagement: AccountManagementService,
    private deviceProfileService: DeviceProfileService,
    private alertService: AlertService) {
  }

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('checkAll') checkAllBoxes: ElementRef;
  @ViewChildren('check') checkBoxes: ElementRef[];

  ngOnInit() {
    this.setDefaultRequestParams();
    this.isRealmSelected = this.accManagement.isRealmSelected();
    this.deviceDataSource = new DeviceDataSource(this.deviceProfileService);
    this.loadDevices();
    this.accManagement.currentRealm$.pipe(takeUntil(this.subscriptions$)).subscribe(data => {
      this.isRealmSelected = !!data;
      if (!!data) {
        this.setDefaultRequestParams();
        this.loadDevices();
      }
    });
    this.deviceDataSource.loadingSubject$.pipe(takeUntil(this.subscriptions$)).subscribe(value => this.loading = value);
    this.accManagement.reloadPage$.pipe(takeUntil(this.subscriptions$)).subscribe(() => this.loadDevices());
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
    this.setDefaultRequestParams();
  }

  private setDefaultRequestParams(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    this.paramRequest = Object.assign({}, DEFAULT_DEVICE_PARAM_REQUEST);
  }

  private setPaginationRequest(data): void {
    this.paramRequest.pageSize = data.pageSize;
    this.paramRequest.pageNumber = data.pageIndex;
  }

  private loadDevices() {
    this.selectAllDevicesCheckBoxChange(false, true);
    this.deviceDataSource.load(this.paramRequest);
  }

  getServerData($event: PageEvent) {
    this.setPaginationRequest($event);
    this.loadDevices();
  }

  searchBy(search: string) {
    this.paramRequest.freeText = search;
    this.loadDevices();
  }

  sort(param: string) {
    this.paramRequest.sortByDirection = (this.paramRequest.sortByProperty === param && this.paramRequest.sortByDirection) === ASC ? DESC : ASC;
    this.paramRequest.sortByProperty = param;
    this.loadDevices();
  }

  delete() {
    this.deviceProfileService.deleteDevices(this.selectedDeviceIds).pipe(takeUntil(this.subscriptions$)).subscribe({
      next: () => {
        this.paramRequest.pageNumber = 0;
        this.paramRequest.freeText = '';
        this.loadDevices();
        this.showAlertMessage(DEVICE_DELETE_MESSAGE);
      },
      error: (error) => this.showAlertMessage(DEVICE_DELETE_ERROR_MESSAGE, error)
    });
  }

  select(deviceId: string, checked: boolean) {
    if (checked && !this.selectedDeviceIds.find(value => value === deviceId)) {
      this.selectedDeviceIds.push(deviceId);
      if (!this.selectAllDeviceIds && !this.checkBoxes.find(value => !value.nativeElement.checked)) {
        this.selectAllDevicesCheckBoxChange(true);
      }
    }
    if (!checked) {
      this.selectedDeviceIds = this.selectedDeviceIds.filter(value => value !== deviceId);
      if (this.selectAllDeviceIds) {
        this.selectAllDevicesCheckBoxChange(false);
      }
    }
  }

  selectAll(checked: boolean) {
    this.selectAllDeviceIds = checked;
    this.checkBoxes.forEach(value => {
        value.nativeElement.checked = checked;
        value.nativeElement.dispatchEvent(new MouseEvent('change'));
      }
    );
  }

// modals
  addDevice() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(AddDeviceModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => this.addDeviceToPortal(data)
    );
  }

  private addDeviceToPortal(data: AddDeviceModalRequest) {
    // if (!data) {
    //   return;
    // }
    // if (data.regType === AIM_AUTO) {
    //   this.deviceProfileService.addDeviceClaim({
    //     device_name: data.form.deviceName,
    //     mt: 'VR-S3',
    //     sn: data.form.serialNumber,
    //     token: data.form.activationCode,
    //   }).pipe(takeUntil(this.subscriptions$)).subscribe({
    //     next: () => {
    //       this.showAlertMessage(DEVICE_ADD_MESSAGE);
    //       this.loadDevices();
    //     },
    //     error: error => this.showAlertMessage(DEVICE_ADD_ERROR_MESSAGE, error)
    //   });
    // } else {
    //   this.deviceProfileService.addDeviceManually([{
    //     deviceName: data.form.deviceName,
    //     deviceSerialnumber: data.form.serialNumber,
    //   }]).pipe(takeUntil(this.subscriptions$)).subscribe(responce => {
    //       saveAs(new Blob([responce]), 'devices.zip');
    //       this.showAlertMessage(DEVICE_ADD_MESSAGE);
    //       this.loadDevices();
    //     },
    //     error => {
    //       this.showAlertMessage(DEVICE_ADD_ERROR_MESSAGE, error);
    //     });
    // }
  }

  addGroup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(GroupsModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.addGroupToDevice(data);
        }
      });
  }

  private addGroupToDevice(groupIds: []) {
    this.accManagement.assignGroupsBulk(this.selectedDeviceIds.map(id => ({deviceId: id})), groupIds)
      .pipe(takeUntil(this.subscriptions$))
      .subscribe({
        next: () => {
          this.paramRequest.pageNumber = 0;
          this.paramRequest.freeText = '';
          this.loadDevices();
          this.showAlertMessage(GROUP_ADD_MESSAGE);
        },
        error: (error) => this.showAlertMessage(GROUP_ADD_ERROR_MESSAGE, error)
      });
  }

  private showAlertMessage(message: string, error?: HttpErrorResponse) {
    this.alertService.showAlertMessage(message, error);
  }

  private selectAllDevicesCheckBoxChange(value: boolean, clear?: boolean) {
    this.selectAllDeviceIds = value;
    if (this.checkAllBoxes) {
      this.checkAllBoxes.nativeElement.checked = value;
    }
    if (clear) {
      this.selectedDeviceIds = [];
    }
  }
}
