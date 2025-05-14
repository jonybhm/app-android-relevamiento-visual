import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../servicios/spinner.service';
import { SonidosService } from '../servicios/sonidos.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone:false,
})
export class Tab2Page implements OnInit {

  constructor(
    private spinner: SpinnerService,
    private sonido: SonidosService

  ) { }


  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }


}
