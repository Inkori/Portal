import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataType, TableSupplier} from '../../../models/common';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {TableComponent} from '../../common/table/table.component';
import {AddModalComponent} from '../../modals/add-modal/add-modal.component';
import {
  GROUP_CREATE_ERROR_MESSAGE,
  GROUP_CREATE_MESSAGE,
  GROUP_DELETE_ERROR_MESSAGE,
  GROUP_DELETE_MESSAGE,
  TYPE_DEVICE
} from '../../../constants/constants';
import {takeUntil} from 'rxjs/operators';
import {AccountManagementService} from '../../../services/account-management.service';
import {AlertService} from '../../../services/alert.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  pageName = 'Groups page';
  dataSourceType = DataType.GROUP;
  isRealmSelected: boolean;
  selectedIds: TableSupplier[] = [];

  @ViewChild(TableComponent) tableComponent: TableComponent;

  constructor(private dialog: MatDialog, private accManagement: AccountManagementService, private alertService: AlertService) {
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

  getIdList(idList: TableSupplier[]) {
    this.selectedIds = idList;
  }

  assign() {
    this.tableComponent.assign(DataType.DEVICE);
  }

  createGroup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {type: DataType.GROUP};
    const dialogRef = this.dialog.open(AddModalComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.subscriptions$)).subscribe(
      data => this.addGroupToPortal(data)
    );
  }

  private addGroupToPortal(data: any) {
    if (!data) {
      return;
    }
    this.accManagement.createGroup({
      disableIdentityIntegration: true,
      displayName: data.form.groupName,
      name: data.form.groupName,
      type: TYPE_DEVICE
    }).pipe(takeUntil(this.subscriptions$)).subscribe(responce => {
        this.alertService.showAlertMessage(GROUP_CREATE_MESSAGE);
        this.tableComponent.load();
      },
      error => {
        this.alertService.showAlertMessage(GROUP_CREATE_ERROR_MESSAGE, error);
      });
  }

  delete() {
   this.accManagement.deleteGroup({groupList: this.selectedIds.map(value => value.id)}).pipe(takeUntil(this.subscriptions$)).subscribe(responce => {
        this.alertService.showAlertMessage(GROUP_DELETE_MESSAGE);
        this.tableComponent.load();
      },
      error => {
        this.alertService.showAlertMessage(GROUP_DELETE_ERROR_MESSAGE, error);
      });
  }
}
