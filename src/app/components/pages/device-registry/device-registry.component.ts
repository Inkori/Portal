import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ACT_CODE_ERROR_MESSAGE, ACT_CODE_MULTIPLE_ERROR_MESSAGE, ALERT_DANGER} from '../../../constants/constants';
import {DataType, TableSupplier} from '../../../models/common';
import {AccountManagementService} from '../../../services/account-management.service';
import {AlertService} from '../../../services/alert.service';
import {DeviceProfileService} from '../../../services/device-profile.service';
import {GdrService} from '../../../services/gdr.service';
import {InfoModalComponent} from '../../modals/info-modal/info-modal.component';

@Component({
  selector: 'app-device-registry',
  templateUrl: './device-registry.component.html',
  styleUrls: ['./device-registry.component.css'],
})
export class DeviceRegistryComponent implements OnInit, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  public pageName = 'Device Registry';
  public dataSourceType = DataType.GDR;
  public isRealmSelected: boolean;
  public selectedIds: TableSupplier[] = [];

  constructor(
    private gdrService: GdrService,
    private deviceProfileService: DeviceProfileService,
    private accManagement: AccountManagementService,
    private alertService: AlertService,
    private dialog: MatDialog) {
  }

  public ngOnInit(): void {
    this.isRealmSelected = this.accManagement.isRealmSelected();
    this.accManagement.currentRealm$.pipe(takeUntil(this.subscriptions$)).subscribe((data) => {
      this.isRealmSelected = !!data;
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  public getIdList(idList: TableSupplier[]) {
    this.selectedIds = idList;
  }

  public generateCode() {
    if (!this.selectedIds || this.selectedIds.length > 1) {
      this.alertService.showAlertMessage(ACT_CODE_MULTIPLE_ERROR_MESSAGE, null, ALERT_DANGER);
      return;
    }
    this.deviceProfileService.getActivationCode({mt: this.selectedIds[0].data.mt, sn: this.selectedIds[0].data.sn})
      .pipe(takeUntil(this.subscriptions$))
      .subscribe((data) => {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {token: data.token};
        this.dialog.open(InfoModalComponent, dialogConfig);
      }, (error) => {
        this.alertService.showAlertMessage(ACT_CODE_ERROR_MESSAGE, error);
      });
  }
}
