import {Component} from '@angular/core';
import {GdrService} from '../../../services/gdr.service';
import {DEFAULT_GDR_PARAM_REQUEST} from '../../../common/constants';

@Component({
  selector: 'app-device-registry',
  templateUrl: './device-registry.component.html',
  styleUrls: ['./device-registry.component.css']
})
export class DeviceRegistryComponent {


  constructor(private gdrService: GdrService){  }

  getList() {
    this.gdrService.getDevicesGdr(DEFAULT_GDR_PARAM_REQUEST).subscribe(data => console.log(data));
  }

  search() {
    const param = Object.assign({}, DEFAULT_GDR_PARAM_REQUEST);
    param.freeText = 'RG777777'
    this.gdrService.search(param).subscribe(data => console.log(data));
  }
}
