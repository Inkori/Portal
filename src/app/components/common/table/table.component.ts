import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {CommonDataSource, DataType, TableParams} from '../../../models/common';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {GroupsDataSource} from '../data-source/groups-data-source';
import {AccountManagementService} from '../../../services/account-management.service';
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
  GROUP_TABLE_COLUMNS
} from '../../../constants/constants';
import {PageEvent} from '@angular/material/paginator';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ListModalComponent} from '../../modals/list-modal/list-modal.component';
import {AlertService} from '../../../services/alert.service';
import {DeviceDataSource} from '../data-source/device-data-source';
import {DeviceProfileService} from '../../../services/device-profile.service';
import {GdrDataSource} from '../data-source/gdr-data-source';
import {GdrService} from '../../../services/gdr.service';
import {PageRequest} from '../../../models/acc-management';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  dataSource: CommonDataSource<any>;
  displayedColumns: TableParams[];
  displayedHeaders: string[];
  pageRequest: PageRequest;
  defaultPageRequest: PageRequest;
  isRealmSelected: boolean;
  loading: boolean;
  emptyListMessage: string;
  emptySearchResponseMessage: string;
  selectedIds = [];
  selectAllIds = false;
  sortDirection: boolean;

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('checkAll') checkAllBoxes: ElementRef;
  @ViewChildren('check') checkBoxes: QueryList<ElementRef>;
  @Input() dataSourceType: DataType;
  @Output() idListEmitter = new EventEmitter<string[]>();


  constructor(private accManagement: AccountManagementService,
              private deviceProfileService: DeviceProfileService,
              private gdrService: GdrService,
              private alertService: AlertService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.isRealmSelected = this.accManagement.isRealmSelected();
    this.initDependsOnDataSourceType();
    this.dataSource.load(this.defaultPageRequest);
    this.dataSource.loadingSubject$.pipe(takeUntil(this.subscriptions$)).subscribe(value => {
      this.loading = value;
      if (!this.loading) { setTimeout(() => this.activateCheckBoxes()); }
    });
    this.accManagement.reloadPage$.pipe(takeUntil(this.subscriptions$)).subscribe(() => this.load());
    this.accManagement.currentRealm$.pipe(takeUntil(this.subscriptions$)).subscribe(data => {
      this.isRealmSelected = !!data;
      if (!!data) { this.load(this.defaultPageRequest); }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
    this.setDefaultRequestParams();
  }

  private initDependsOnDataSourceType(): void {
    if (DataType.DEVICE === this.dataSourceType) {
      this.displayedColumns = DEVICE_TABLE_COLUMNS;
      this.displayedHeaders = this.displayedColumns.map(entity => entity.name);
      this.pageRequest = Object.assign({}, DEFAULT_DEVICE_PAGE_REQUEST);
      this.defaultPageRequest = Object.assign({}, DEFAULT_DEVICE_PAGE_REQUEST);
      this.emptyListMessage = DEVICE_LIST_EMPTY_MESSAGE;
      this.emptySearchResponseMessage = DEVICE_SEARCH_RESPONSE_EMPTY_MESSAGE;
      this.dataSource = new DeviceDataSource(this.deviceProfileService);
    } else if (DataType.GROUP === this.dataSourceType) {
      this.displayedColumns = GROUP_TABLE_COLUMNS;
      this.displayedHeaders = this.displayedColumns.map(entity => entity.name);
      this.pageRequest = Object.assign({}, DEFAULT_GROUP_PARAM_REQUEST);
      this.defaultPageRequest = Object.assign({}, DEFAULT_GROUP_PARAM_REQUEST);
      this.emptyListMessage = GROUP_LIST_EMPTY_MESSAGE;
      this.emptySearchResponseMessage = GROUP_SEARCH_RESPONSE_EMPTY_MESSAGE;
      this.dataSource = new GroupsDataSource(this.accManagement);
    } else if (DataType.GDR === this.dataSourceType) {
      this.displayedColumns = GDR_TABLE_COLUMNS;
      this.displayedHeaders = this.displayedColumns.map(entity => entity.name);
      this.pageRequest = Object.assign({}, DEFAULT_GDR_PAGE_REQUEST);
      this.defaultPageRequest = Object.assign({}, DEFAULT_GDR_PAGE_REQUEST);
      this.emptyListMessage = '';
      this.emptySearchResponseMessage = GDR_SEARCH_EMPTY_MESSAGE;
      this.dataSource = new GdrDataSource(this.gdrService);
    }
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
    this.idListEmitter.emit(this.selectedIds);
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
    this.selectedIds.forEach(id => {
      const box = this.checkBoxes.find(value => value.nativeElement.id === id);
      if (box){ box.nativeElement.checked = true; }
    });
    if (!this.checkBoxes.find(el => !el.nativeElement.checked)) {
      this.checkAllBoxes.nativeElement.checked = true;
      return;
    }
    this.checkAllBoxes.nativeElement.checked = false;
  }

  getServerData($event: PageEvent) {
    this.setPaginationRequest($event);
    this.load();
  }

  sort(column: string, sortDisable: boolean): void {
    if (!sortDisable) {
      this.pageRequest.sortByDirection = (this.pageRequest.sortByProperty === column && (this.sortDirection = !this.sortDirection));
      this.pageRequest.sortByProperty = column;
      this.load(this.pageRequest);
    }
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

  load(pageRequest?: any) {
    this.dataSource.load(pageRequest ? pageRequest : this.pageRequest);
  }

  private selectAllCheckBoxes(value: boolean, clear?: boolean) {
    this.selectAllIds = value;
    if (this.checkAllBoxes) {
      this.checkAllBoxes.nativeElement.checked = value;
    }
    if (clear) {
      this.selectedIds = [];
    }
  }

  searchBy(value: string) {
    this.pageRequest.freeText = value;
    this.load();
  }

  assign(type: DataType) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {type};
    const dialogRef = this.dialog.open(ListModalComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.subscriptions$)).subscribe(
      data => {
        if (data) {
          this.assignGroupToDeviceBulk(data);
        }
      });
  }

  private assignGroupToDeviceBulk(data: any) {
    const deviceIds = (this.dataSourceType === DataType.GROUP ? data : this.selectedIds).filter(val => val);
    const groupIds = (this.dataSourceType === DataType.DEVICE ? data : this.selectedIds).filter(val => val);
    if (deviceIds.length < 1 || groupIds.length < 1) {
      this.alertService.showAlertMessage(EMPTY_ID_ARR_ERROR_MESSAGE, null, ALERT_DANGER); return;
    }
    this.accManagement.assignGroupsBulk(deviceIds.map(id => ({deviceId: id})), groupIds)
      .pipe(takeUntil(this.subscriptions$))
      .subscribe({
        next: () => {
          this.pageRequest.pageNumber = 0;
          this.pageRequest.freeText = '';
          this.load(this.defaultPageRequest);
          this.alertService.showAlertMessage(GROUP_ASSIGN_MESSAGE);
        },
        error: (error) => this.alertService.showAlertMessage(GROUP_ASSIGN_ERROR_MESSAGE, error)
      });
  }

  isArray(obj: any): boolean {
    return Array.isArray(obj);
  }

  getInnerData(element: any): string {
    // todo type check(instance of doesn't work!)
    return element.groupName;

  }
}
