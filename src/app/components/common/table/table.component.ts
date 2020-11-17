import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
  ALERT_DANGER,
  DEFAULT_DEVICE_PAGE_REQUEST,
  DEFAULT_GDR_PAGE_REQUEST,
  DEFAULT_GROUP_PARAM_REQUEST,
  DEVICE_LIST_EMPTY_MESSAGE,
  DEVICE_SEARCH_RESPONSE_EMPTY_MESSAGE,
  DEVICE_TABLE_COLUMNS,
  EMPTY_ID_ARR_ERROR_MESSAGE,
  GDR_SEARCH_EMPTY_MESSAGE,
  GDR_TABLE_COLUMNS,
  GROUP_ASSIGN_ERROR_MESSAGE,
  GROUP_ASSIGN_MESSAGE,
  GROUP_LIST_EMPTY_MESSAGE,
  GROUP_SEARCH_RESPONSE_EMPTY_MESSAGE,
  GROUP_TABLE_COLUMNS,
} from '../../../constants/constants';
import {PageRequest} from '../../../models/acc-management';
import {CommonDataSource, DataType, TableParams, TableSupplier} from '../../../models/common';
import {AccountManagementService} from '../../../services/account-management.service';
import {AlertService} from '../../../services/alert.service';
import {DeviceProfileService} from '../../../services/device-profile.service';
import {GdrService} from '../../../services/gdr.service';
import {ListModalComponent} from '../../modals/list-modal/list-modal.component';
import {DeviceDataSource} from '../data-source/device-data-source';
import {GdrDataSource} from '../data-source/gdr-data-source';
import {GroupsDataSource} from '../data-source/groups-data-source';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  public dataSource: CommonDataSource<any>;
  public displayedColumns: TableParams[];
  public displayedHeaders: string[];
  public pageRequest: PageRequest;
  public defaultPageRequest: PageRequest;
  public isRealmSelected: boolean;
  public loading: boolean;
  public emptyListMessage: string;
  public emptySearchResponseMessage: string;
  public selectedIds: TableSupplier[] = [];
  public selectAllIds = false;
  public sortDirection: boolean;

  @ViewChild('searchInput') public searchInput: ElementRef;
  @ViewChild('checkAll') public checkAllBoxes: ElementRef;
  @ViewChildren('check') public checkBoxes: QueryList<ElementRef>;
  @Input() public dataSourceType: DataType;
  @Output() public idListEmitter = new EventEmitter<TableSupplier[]>();

  constructor(private accManagement: AccountManagementService,
              private deviceProfileService: DeviceProfileService,
              private gdrService: GdrService,
              private alertService: AlertService,
              private dialog: MatDialog) {
  }

  public ngOnInit(): void {
    this.isRealmSelected = this.accManagement.isRealmSelected();
    this.initDependsOnDataSourceType();
    this.dataSource.load(this.defaultPageRequest);
    this.dataSource.loadingSubject$.pipe(takeUntil(this.subscriptions$)).subscribe((value) => {
      this.loading = value;
      if (!this.loading) {
        setTimeout(() => this.activateCheckBoxes());
      }
    });
    this.accManagement.reloadPage$.pipe(takeUntil(this.subscriptions$)).subscribe(() => this.load());
    this.accManagement.currentRealm$.pipe(takeUntil(this.subscriptions$)).subscribe((data) => {
      this.isRealmSelected = !!data;
      if (!!data) {
        this.load(this.defaultPageRequest);
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
    this.setDefaultRequestParams();
  }

  public select(id: string, data: any, checked: boolean) {
    if (checked && !this.selectedIds.find((value) => value.id === id)) {
      this.selectedIds.push({id, data});
      if (!this.selectAllIds && !this.checkBoxes.find((value) => !value.nativeElement.checked)) {
        this.selectAllCheckBoxes(true);
      }
    }
    if (!checked) {
      this.selectedIds = this.selectedIds.filter((value) => value.id !== id);
      if (this.selectAllIds) {
        this.selectAllCheckBoxes(false);
      }
    }
    this.idListEmitter.emit(this.selectedIds);
  }

  public selectAll(checked: boolean) {
    this.selectAllIds = checked;
    this.checkBoxes.forEach((value) => {
        value.nativeElement.checked = checked;
        value.nativeElement.dispatchEvent(new MouseEvent('change'));
      },
    );
  }

  public activateCheckBoxes() {
    this.selectedIds.forEach((el) => {
      const box = this.checkBoxes.find((value) => value.nativeElement.id === el.id);
      if (box) {
        box.nativeElement.checked = true;
      }
    });
    if (!this.checkBoxes.find((el) => !el.nativeElement.checked)) {
      this.checkAllBoxes.nativeElement.checked = true;
      return;
    }
    this.checkAllBoxes.nativeElement.checked = false;
  }

  public getServerData($event: PageEvent) {
    this.setPaginationRequest($event);
    this.load();
  }

  public sort(column: string, sortDisable: boolean): void {
    if (!sortDisable) {
      this.pageRequest.sortByDirection = (this.pageRequest.sortByProperty === column && (this.sortDirection = !this.sortDirection));
      this.pageRequest.sortByProperty = column;
      this.load(this.pageRequest);
    }
  }

  public load(pageRequest?: any) {
    this.dataSource.load(pageRequest ? pageRequest : this.pageRequest);
  }

  private initDependsOnDataSourceType(): void {
    if (DataType.DEVICE === this.dataSourceType) {
      this.displayedColumns = DEVICE_TABLE_COLUMNS;
      this.displayedHeaders = this.displayedColumns.map((entity) => entity.name);
      this.pageRequest = Object.assign({}, DEFAULT_DEVICE_PAGE_REQUEST);
      this.defaultPageRequest = Object.assign({}, DEFAULT_DEVICE_PAGE_REQUEST);
      this.emptyListMessage = DEVICE_LIST_EMPTY_MESSAGE;
      this.emptySearchResponseMessage = DEVICE_SEARCH_RESPONSE_EMPTY_MESSAGE;
      this.dataSource = new DeviceDataSource(this.deviceProfileService);
    } else if (DataType.GROUP === this.dataSourceType) {
      this.displayedColumns = GROUP_TABLE_COLUMNS;
      this.displayedHeaders = this.displayedColumns.map((entity) => entity.name);
      this.pageRequest = Object.assign({}, DEFAULT_GROUP_PARAM_REQUEST);
      this.defaultPageRequest = Object.assign({}, DEFAULT_GROUP_PARAM_REQUEST);
      this.emptyListMessage = GROUP_LIST_EMPTY_MESSAGE;
      this.emptySearchResponseMessage = GROUP_SEARCH_RESPONSE_EMPTY_MESSAGE;
      this.dataSource = new GroupsDataSource(this.accManagement);
    } else if (DataType.GDR === this.dataSourceType) {
      this.displayedColumns = GDR_TABLE_COLUMNS;
      this.displayedHeaders = this.displayedColumns.map((entity) => entity.name);
      this.pageRequest = Object.assign({}, DEFAULT_GDR_PAGE_REQUEST);
      this.defaultPageRequest = Object.assign({}, DEFAULT_GDR_PAGE_REQUEST);
      this.emptyListMessage = '';
      this.emptySearchResponseMessage = GDR_SEARCH_EMPTY_MESSAGE;
      this.dataSource = new GdrDataSource(this.gdrService);
    }
  }

  public searchBy(value: string) {
    this.selectAllCheckBoxes(false, true);
    this.pageRequest.freeText = value;
    this.load();
  }

  public assign(type: DataType) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {type};
    const dialogRef = this.dialog.open(ListModalComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.subscriptions$)).subscribe(
      (data) => {
        if (data) {
          this.assignGroupToDeviceBulk(data);
        }
      });
  }

  public isArray(obj: any): boolean {
    return Array.isArray(obj);
  }

  public getInnerData(element: any): string {
    // todo type check(instance of doesn't work!)
    return element.groupName;
  }

  private setDefaultRequestParams(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    this.pageRequest = Object.assign({}, this.defaultPageRequest);
  }

  private setPaginationRequest(data): void {
    this.pageRequest.pageSize = data.pageSize;
    this.pageRequest.pageNumber = data.pageIndex;
  }

  private selectAllCheckBoxes(value: boolean, clear?: boolean) {
    this.selectAllIds = value;
    if (this.checkAllBoxes) {
      this.checkAllBoxes.nativeElement.checked = value;
    }
    if (clear) {
      this.selectedIds = [];
      this.idListEmitter.emit(this.selectedIds);
    }
  }

  private assignGroupToDeviceBulk(data: any) {
    const deviceIds = (this.dataSourceType === DataType.GROUP ? data : this.selectedIds).filter((val) => val.id);
    const groupIds = (this.dataSourceType === DataType.DEVICE ? data : this.selectedIds).filter((val) => val.id);
    if (deviceIds.length < 1 || groupIds.length < 1) {
      this.alertService.showAlertMessage(EMPTY_ID_ARR_ERROR_MESSAGE, null, ALERT_DANGER);
      return;
    }
    this.accManagement.assignGroupsBulk(deviceIds.map((obj) => ({deviceId: obj.id})), groupIds.map((obj) => obj.id))
      .pipe(takeUntil(this.subscriptions$))
      .subscribe({
        next: () => {
          this.pageRequest.pageNumber = 0;
          this.pageRequest.freeText = '';
          this.load(this.defaultPageRequest);
          this.alertService.showAlertMessage(GROUP_ASSIGN_MESSAGE);
        },
        error: (error) => this.alertService.showAlertMessage(GROUP_ASSIGN_ERROR_MESSAGE, error),
      });
  }
}
