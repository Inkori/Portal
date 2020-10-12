import {Component, OnDestroy, OnInit} from '@angular/core';
import {GdrService} from '../../../services/gdr.service';
import {DataType} from '../../../models/common';
import {takeUntil} from 'rxjs/operators';
import {AccountManagementService} from '../../../services/account-management.service';
import {Subject} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {InfoModalComponent} from '../../modals/info-modal/info-modal.component';
import {DeviceProfileService} from '../../../services/device-profile.service';
import {ACT_CODE_ERROR_MESSAGE, ACT_CODE_MULTIPLE_ERROR_MESSAGE, ALERT_DANGER} from '../../../constants/constants';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-device-registry',
  templateUrl: './device-registry.component.html',
  styleUrls: ['./device-registry.component.css']
})
export class DeviceRegistryComponent implements OnInit, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  pageName = 'Device Registry';
  dataSourceType = DataType.GDR;
  isRealmSelected: boolean;
  selectedIds = [];


  constructor(
    private gdrService: GdrService,
    private deviceProfileService: DeviceProfileService,
    private accManagement: AccountManagementService,
    private alertService: AlertService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.isRealmSelected = this.accManagement.isRealmSelected();
    this.accManagement.currentRealm$.pipe(takeUntil(this.subscriptions$)).subscribe(data => {
      this.isRealmSelected = !!data;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  getIdList(idList: string[]) {
    this.selectedIds = idList;
  }

  generateCode() {
    if (!this.selectedIds || this.selectedIds.length > 1) {
      this.alertService.showAlertMessage(ACT_CODE_MULTIPLE_ERROR_MESSAGE, null, ALERT_DANGER);
      return;
    }
    this.deviceProfileService.getActivationCode(this.createActRequest())
      .pipe(takeUntil(this.subscriptions$))
      .subscribe(data => {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {token: data.token};
        this.dialog.open(InfoModalComponent, dialogConfig);
      }, error => {
        this.alertService.showAlertMessage(ACT_CODE_ERROR_MESSAGE, error);
      });
  }

  private createActRequest() {
    return {mt: 'VR-S3', sn: 'ghbcv'};

  }
}
