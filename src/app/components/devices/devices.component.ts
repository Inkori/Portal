import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AccountManagementService} from '../../services/account-management.service';
import {DeviceProfileService} from '../../services/device-profile.service';
import {AddDeviceModalRequest, DataSourceType} from '../../models/common';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AlertService} from '../../services/alert.service';
import {HttpErrorResponse} from '@angular/common/http';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {saveAs} from 'file-saver';
import {AddDeviceModalComponent} from '../modals/add-device-modal/add-device-modal.component';
import {TableComponent} from '../table/table.component';
import {
  AIM_AUTO,
  DEVICE_ADD_ERROR_MESSAGE,
  DEVICE_ADD_MESSAGE,
  DEVICE_DELETE_ERROR_MESSAGE,
  DEVICE_DELETE_MESSAGE
} from '../../common/constants';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  isRealmSelected: boolean;
  selectedIds: string[] = [];
  pageName = 'Device page';
  dataSourceType = DataSourceType.DEVICE;
  @ViewChild(TableComponent) tableComponent: TableComponent;

  constructor(
    private dialog: MatDialog,
    private accManagement: AccountManagementService,
    private deviceProfileService: DeviceProfileService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.isRealmSelected = this.accManagement.isRealmSelected();
    this.accManagement.currentRealm$.pipe(takeUntil(this.subscriptions$)).subscribe(data => {
      this.isRealmSelected = !!data;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }


  delete() {
    this.deviceProfileService.deleteDevices(this.selectedIds).pipe(takeUntil(this.subscriptions$)).subscribe({
      next: () => {
        this.tableComponent.paramRequest.pageNumber = 0;
        this.tableComponent.paramRequest.freeText = '';
        this.tableComponent.load();
        this.showAlertMessage(DEVICE_DELETE_MESSAGE);
      },
      error: (error) => this.showAlertMessage(DEVICE_DELETE_ERROR_MESSAGE, error)
    });
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
    if (!data) {
      return;
    }
    if (data.regType === AIM_AUTO) {
      this.deviceProfileService.addDeviceClaim({
        device_name: data.form.deviceName,
        mt: 'VR-S3',
        sn: data.form.serialNumber,
        token: data.form.activationCode,
      }).pipe(takeUntil(this.subscriptions$)).subscribe({
        next: () => {
          this.showAlertMessage(DEVICE_ADD_MESSAGE);
          this.tableComponent.load();
        },
        error: error => this.showAlertMessage(DEVICE_ADD_ERROR_MESSAGE, error)
      });
    } else {
      this.deviceProfileService.addDeviceManually([{
        deviceName: data.form.deviceName,
        deviceSerialnumber: data.form.serialNumber,
      }]).pipe(takeUntil(this.subscriptions$)).subscribe(responce => {
          saveAs(new Blob([responce]), 'devices.zip');
          this.showAlertMessage(DEVICE_ADD_MESSAGE);
          this.tableComponent.load();
        },
        error => {
          this.showAlertMessage(DEVICE_ADD_ERROR_MESSAGE, error);
        });
    }
  }

  assignGroup() {
    this.tableComponent.assign(DataSourceType.GROUP);
  }

  private showAlertMessage(message: string, error?: HttpErrorResponse) {
    this.alertService.showAlertMessage(message, error);
  }

  getIdList(idList: string[]) {
    this.selectedIds = idList;
  }
}
