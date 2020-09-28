import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewChildren} from '@angular/core';
import {CommonDataSource, DataType} from '../../../models/common';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {GroupsDataSource} from '../data-source/groups-data-source';
import {AccountManagementService} from '../../../services/account-management.service';
import {
  DEFAULT_DEVICE_PARAM_REQUEST,
  DEFAULT_GDR_PARAM_REQUEST,
  DEFAULT_GROUP_PARAM_REQUEST,
  DEVICE_LIST_EMPTY_MESSAGE,
  DEVICE_SEARCH_RESPONSE_EMPTY_MESSAGE,
  DEVICE_TABLE_COLUMNS,
  GDR_SEARCH_EMPTY_MESSAGE,
  GDR_TABLE_COLUMNS,
  GROUP_ASSIGN_ERROR_MESSAGE,
  GROUP_ASSIGN_MESSAGE,
  GROUP_LIST_EMPTY_MESSAGE,
  GROUP_SEARCH_RESPONSE_EMPTY_MESSAGE,
  GROUP_TABLE_COLUMNS
} from '../../../common/constants';
import {PageEvent} from '@angular/material/paginator';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ListModalComponent} from '../../modals/list-modal/list-modal.component';
import {AlertService} from '../../../services/alert.service';
import {DeviceDataSource} from '../data-source/device-data-source';
import {DeviceProfileService} from '../../../services/device-profile.service';
import {GdrDataSource} from '../data-source/gdr-data-source';
import {GdrService} from '../../../services/gdr.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  dataSource: CommonDataSource<any>;
  displayedColumns = [];
  paramRequest: any;
  defaultParamRequest: any;
  isRealmSelected: boolean;
  loading: boolean;
  emptyListMessage: string;
  emptySearchResponseMessage: string;
  selectedIds = [];
  selectAllIds = false;

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('checkAll') checkAllBoxes: ElementRef;
  @ViewChildren('check') checkBoxes: ElementRef[];
  @Input() dataSourceType: DataType;
  @Output() idListEmitter = new EventEmitter<string[]>();


  constructor(private accManagement: AccountManagementService,
              private deviceProfileService: DeviceProfileService,
              private gdrService: GdrService,
              private alertService: AlertService,
              private dialog: MatDialog) {
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
    this.setDefaultRequestParams();
  }

  ngOnInit(): void {
    this.isRealmSelected = this.accManagement.isRealmSelected();
    this.initDependsOnDataSourceType();
    this.dataSource.load(this.defaultParamRequest);
    this.dataSource.loadingSubject$.pipe(takeUntil(this.subscriptions$)).subscribe(value => this.loading = value);
    this.accManagement.reloadPage$.pipe(takeUntil(this.subscriptions$)).subscribe(() => this.load());
    this.accManagement.currentRealm$.pipe(takeUntil(this.subscriptions$)).subscribe(data => {
      this.isRealmSelected = !!data;
      if (!!data) {
        this.load(this.defaultParamRequest);
      }
    });
  }

  private initDependsOnDataSourceType(): void {
    if (DataType.DEVICE === this.dataSourceType) {
      this.displayedColumns = DEVICE_TABLE_COLUMNS;
      this.paramRequest = Object.assign({}, DEFAULT_DEVICE_PARAM_REQUEST);
      this.defaultParamRequest = Object.assign({}, DEFAULT_DEVICE_PARAM_REQUEST);
      this.emptyListMessage = DEVICE_LIST_EMPTY_MESSAGE;
      this.emptySearchResponseMessage = DEVICE_SEARCH_RESPONSE_EMPTY_MESSAGE;
      this.dataSource = new DeviceDataSource(this.deviceProfileService);
    } else if (DataType.GROUP === this.dataSourceType) {
      this.displayedColumns = GROUP_TABLE_COLUMNS;
      this.paramRequest = Object.assign({}, DEFAULT_GROUP_PARAM_REQUEST);
      this.defaultParamRequest = Object.assign({}, DEFAULT_GROUP_PARAM_REQUEST);
      this.emptyListMessage = GROUP_LIST_EMPTY_MESSAGE;
      this.emptySearchResponseMessage = GROUP_SEARCH_RESPONSE_EMPTY_MESSAGE;
      this.dataSource = new GroupsDataSource(this.accManagement);
    } else if (DataType.GDR === this.dataSourceType) {
      this.displayedColumns = GDR_TABLE_COLUMNS;
      this.paramRequest = Object.assign({}, DEFAULT_GDR_PARAM_REQUEST);
      this.defaultParamRequest = Object.assign({}, DEFAULT_GDR_PARAM_REQUEST);
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
    this.paramRequest = Object.assign({}, this.defaultParamRequest);
  }

  private setPaginationRequest(data): void {
    this.paramRequest.pageSize = data.pageSize;
    this.paramRequest.pageNumber = data.pageIndex;
  }

  load(paramRequest?: any) {
    // this.selectAllCheckBoxes(false, true);
    this.dataSource.load(paramRequest ? paramRequest : this.paramRequest);
    this.dataSource.page$.subscribe(() => this.activateCheckBoxes());
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

  assign(type: DataType) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {type: type};
    const dialogRef = this.dialog.open(ListModalComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.subscriptions$)).subscribe(
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
          this.load(this.defaultParamRequest);
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
