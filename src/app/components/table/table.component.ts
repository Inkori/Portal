import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {Page} from '../../models/common';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {GroupsDataSource} from '../data-source/groups-data-source';
import {Group, GroupsPageRequest} from '../../models/acc-management';
import {AccountManagementService} from '../../services/account-management.service';
import {DEFAULT_GROUP_PARAM_REQUEST, GROUP_ADD_ERROR_MESSAGE, GROUP_ADD_MESSAGE} from '../../common/constants';
import {PageEvent} from '@angular/material/paginator';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DeviceModalComponent} from '../modals/device-modal/device-modal.component';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  dataSource: GroupsDataSource<Page<Group>>;
  displayedColumns = ['groupId', 'groups'];
  paramRequest: GroupsPageRequest;
  isRealmSelected: boolean;
  loading: boolean;
  selectedIds = [];
  selectAllIds = false;

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('checkAll') checkAllBoxes: ElementRef;
  @ViewChildren('check') checkBoxes: ElementRef[];

  constructor(private accManagement: AccountManagementService, private alertService: AlertService, private dialog: MatDialog) {
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
    this.setDefaultRequestParams();
  }

  ngOnInit(): void {
    this.isRealmSelected = this.accManagement.isRealmSelected();
    this.paramRequest = Object.assign({}, DEFAULT_GROUP_PARAM_REQUEST);
    this.dataSource = new GroupsDataSource<Page<Group>>(this.accManagement);
    this.dataSource.loadGroups(DEFAULT_GROUP_PARAM_REQUEST);
    this.dataSource.loadingSubject$.pipe(takeUntil(this.subscriptions$)).subscribe(value => this.loading = value);
    this.accManagement.reloadPage$.pipe(takeUntil(this.subscriptions$)).subscribe(() => this.load());
    this.accManagement.currentRealm$.pipe(takeUntil(this.subscriptions$)).subscribe(data => {
      this.isRealmSelected = !!data;
      if (!!data) {
        this.load(DEFAULT_GROUP_PARAM_REQUEST);
      }
    });
  }


  select(id: string, checked: boolean) {
    if (checked && !this.selectedIds.find(value => value === id)) {
      this.selectedIds.push(id);
      if (!this.selectAllIds && !this.checkBoxes.find(value => !value.nativeElement.checked)) {
        this.selectAllCheckBoxes(true);
      }
    }
    if (!checked) {
      this.selectedIds = this.selectedIds.filter(value => value !== id);
      if (this.selectAllIds) {
        this.selectAllCheckBoxes(false);
      }
    }
    console.log('ids: ' + this.selectedIds);
  }

  selectAll(checked: boolean) {
    this.selectAllIds = checked;
    this.checkBoxes.forEach(value => {
        value.nativeElement.checked = checked;
        value.nativeElement.dispatchEvent(new MouseEvent('change'));
      }
    );
  }

  activateCheckBoxes() {
    this.selectedIds.forEach(id =>
      this.checkBoxes.forEach(box => {
        if (box.nativeElement.id === id) {
          console.log(box.nativeElement.id);
          console.log(box.nativeElement.checked);
          box.nativeElement.checked = true;
          box.nativeElement.dispatchEvent(new MouseEvent('change'));
        }
      }));
  }

  getServerData($event: PageEvent) {
    this.setPaginationRequest($event);
    this.load();
  }

  private setDefaultRequestParams(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    this.paramRequest = Object.assign({}, DEFAULT_GROUP_PARAM_REQUEST);
  }

  private setPaginationRequest(data): void {
    this.paramRequest.pageSize = data.pageSize;
    this.paramRequest.pageNumber = data.pageIndex;
  }

  private load(paramRequest?: GroupsPageRequest) {
    // this.selectAllCheckBoxes(false, true);
    this.dataSource.loadGroups(paramRequest ? paramRequest : this.paramRequest);
    this.dataSource.page$.subscribe( () => this.activateCheckBoxes())
  }

  private selectAllCheckBoxes(value: boolean, clear?: boolean) {
    // todo
    // this.selectAllIds = value;
    // if (this.checkAllBoxes) {
    //   this.checkAllBoxes.nativeElement.checked = value;
    // }
    // if (clear) {
    //   this.selectedIds = [];
    // }
  }

  searchBy(value: string) {
    this.paramRequest.freeText = value;
    this.load();
  }

  assign() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(DeviceModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.assignGroupToDeviceBulk(data);
        }
      });
  }

  private assignGroupToDeviceBulk(data: any) {
    this.accManagement.assignGroupsBulk(data.map(id => ({deviceId: id})), this.selectedIds)
      .pipe(takeUntil(this.subscriptions$))
      .subscribe({
        next: () => {
          this.paramRequest.pageNumber = 0;
          this.paramRequest.freeText = '';
          this.load(DEFAULT_GROUP_PARAM_REQUEST);
          this.alertService.showAlertMessage(GROUP_ADD_MESSAGE);
        },
        error: (error) => this.alertService.showAlertMessage(GROUP_ADD_ERROR_MESSAGE, error)
      });
  }
}
