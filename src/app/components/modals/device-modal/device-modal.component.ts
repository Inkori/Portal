import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {Subject} from 'rxjs';
import {Page, ParamRequest} from '../../../models/common';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ASC, DEFAULT_DEVICE_PARAM_REQUEST, DESC} from '../../../common/constants';
import {takeUntil} from 'rxjs/operators';
import {PageEvent} from '@angular/material/paginator';
import {DeviceDataSource} from '../../data-source/device-data-source';
import {Device} from '../../../models/device';
import {DeviceProfileService} from '../../../services/device-profile.service';
import {AccountManagementService} from '../../../services/account-management.service';

@Component({
  selector: 'app-device-modal',
  templateUrl: './device-modal.component.html',
  styleUrls: ['./device-modal.component.css']
})
export class DeviceModalComponent implements OnInit, OnDestroy {
  private readonly subscriptions$ = new Subject<void>();
  dataSource: DeviceDataSource<Page<Device>>;
  displayedColumns = ['selectDevice', 'deviceDisplayName'];
  paramRequest: ParamRequest;
  loading: boolean;
  selectedIds = [];
  selectAllIds = false;
  isRealmSelected: boolean;

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('checkAll') checkAllBoxes: ElementRef;
  @ViewChildren('check') checkBoxes: ElementRef[];

  constructor(
              private dialogRef: MatDialogRef<DeviceModalComponent>,
              private accManagement: AccountManagementService,
              private deviceProfileService: DeviceProfileService,
              @Inject(MAT_DIALOG_DATA) data) {
  }

  ngOnInit(): void {
    this.isRealmSelected = this.accManagement.isRealmSelected();
    this.paramRequest = Object.assign({}, DEFAULT_DEVICE_PARAM_REQUEST);
    this.dataSource = new DeviceDataSource(this.deviceProfileService);
    this.dataSource.loadDevices(DEFAULT_DEVICE_PARAM_REQUEST);
    this.dataSource.loadingSubject$.pipe( takeUntil(this.subscriptions$) ).subscribe(value => this.loading = value);
    this.accManagement.currentRealm$.pipe(takeUntil(this.subscriptions$)).subscribe(data => {
      this.isRealmSelected = !!data;
      if (!!data) {
        this.setDefaultRequestParams();
        this.loadDevices();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
    this.setDefaultRequestParams();
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.selectedIds);
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
  }

  selectAll(checked: boolean) {
    this.selectAllIds = checked;
    this.checkBoxes.forEach(value => {
        value.nativeElement.checked = checked;
        value.nativeElement.dispatchEvent(new MouseEvent('change'));
      }
    );
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
    this.selectAllCheckBoxes(false, true);
    this.dataSource.loadDevices(this.paramRequest);
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


  private selectAllCheckBoxes(value: boolean, clear?: boolean) {
    this.selectAllIds = value;
    if (this.checkAllBoxes) {
      this.checkAllBoxes.nativeElement.checked = value;
    }
    if (clear) {
      this.selectedIds = [];
    }
  }
}
