import { Component, OnInit , Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-imagen',
  templateUrl: './imagen.page.html',
  styleUrls: ['./imagen.page.scss'],
  standalone:false
})
export class ImagenPage {

  @Input() imagenUrl: string = '';

  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }
}
