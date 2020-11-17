import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {saveAs} from 'file-saver';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
  AIM_AUTO,
  DEVICE_ADD_ERROR_MESSAGE,
  DEVICE_ADD_MESSAGE,
  DEVICE_DELETE_ERROR_MESSAGE,
  DEVICE_DELETE_MESSAGE,
  MT_VR_S3,
} from '../../../constants/constants';
import {AddDeviceModalRequest, DataType, TableSupplier} from '../../../models/common';
import {AccountManagementService} from '../../../services/account-management.service';
import {AlertService} from '../../../services/alert.service';
import {DeviceProfileService} from '../../../services/device-profile.service';
import {TableComponent} from '../../common/table/table.component';
import {AddModalComponent} from '../../modals/add-modal/add-modal.component';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
})
export class DevicesComponent implements OnInit, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  public isRealmSelected: boolean;
  public selectedIds: TableSupplier[] = [];
  public pageName = 'Device page';
  public dataSourceType = DataType.DEVICE;
  @ViewChild(TableComponent) public tableComponent: TableComponent;

  constructor(
    private dialog: MatDialog,
    private accManagement: AccountManagementService,
    private deviceProfileService: DeviceProfileService,
    private alertService: AlertService) {
  }

  public ngOnInit() {
    this.isRealmSelected = this.accManagement.isRealmSelected();
    this.accManagement.currentRealm$.pipe(takeUntil(this.subscriptions$)).subscribe((data) => {
      this.isRealmSelected = !!data;
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  public delete() {
    this.deviceProfileService.deleteDevices(this.selectedIds.map((value) => value.data.orgDeviceId)).pipe(takeUntil(this.subscriptions$)).subscribe({
      next: () => {
        this.tableComponent.pageRequest.pageNumber = 0;
        this.tableComponent.pageRequest.freeText = '';
        this.tableComponent.load();
        this.alertService.showAlertMessage(DEVICE_DELETE_MESSAGE);
      },
      error: (error) => this.alertService.showAlertMessage(DEVICE_DELETE_ERROR_MESSAGE, error),
    });
  }

// modals
  public addDevice() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {type: DataType.DEVICE};
    const dialogRef = this.dialog.open(AddModalComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.subscriptions$)).subscribe(
      (data) => this.addDeviceToPortal(data),
    );
  }

  private addDeviceToPortal(data: AddDeviceModalRequest) {
    if (!data) {
      return;
    }
    if (data.regType === AIM_AUTO) {
      this.deviceProfileService.addDeviceClaim({
        device_name: data.form.deviceName,
        mt: MT_VR_S3,
        sn: data.form.serialNumber,
        token: data.form.activationCode,
      }).pipe(takeUntil(this.subscriptions$)).subscribe({
        next: () => {
          this.alertService.showAlertMessage(DEVICE_ADD_MESSAGE);
          this.tableComponent.load();
        },
        error: (error) => this.alertService.showAlertMessage(DEVICE_ADD_ERROR_MESSAGE, error),
      });
    } else {
      this.deviceProfileService.addDeviceManually([{
        deviceName: data.form.deviceName,
        deviceSerialnumber: data.form.serialNumber,
      }]).pipe(takeUntil(this.subscriptions$)).subscribe((responce) => {
          saveAs(new Blob([responce]), 'devices.zip');
          this.alertService.showAlertMessage(DEVICE_ADD_MESSAGE);
          this.tableComponent.load();
        },
        (error) => {
          this.alertService.showAlertMessage(DEVICE_ADD_ERROR_MESSAGE, error);
        });
    }
  }

  public assignGroup() {
    this.tableComponent.assign(DataType.GROUP);
  }

  public getIdList(idList: TableSupplier[]) {
    this.selectedIds = idList;
  }
}
