import { Component, OnInit,OnChanges, SimpleChanges } from '@angular/core';
import { query, collection, Firestore, orderBy, collectionData, where } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { doc, updateDoc, arrayUnion, increment,arrayRemove,deleteDoc  } from 'firebase/firestore';
import { getAuth,onAuthStateChanged  } from "firebase/auth";
import { ModalController } from '@ionic/angular';
import { ImagenPage } from '../imagen/imagen.page';
import { SpinnerService } from '../servicios/spinner.service';
import { SonidosService } from '../servicios/sonidos.service';

@Component({
  selector: 'app-tab0',
  templateUrl: './tab0.page.html',
  styleUrls: ['./tab0.page.scss'],
  standalone: false
})
export class Tab0Page implements OnInit {

sub!: Subscription;
  cosasLindas: any[] = [];
  cosasFeas: any[] = [];
  isLoading = true;
  uid: string="";
  usuarioActual :any;

  constructor(
    private firestore: Firestore,
    private modalCtrl: ModalController,    
    private spinner: SpinnerService,
    private sonido: SonidosService

  ) { }

  ngOnInit() 
  { 
    
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 2000);

    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) 
      {
        this.usuarioActual = user;
        this.uid = this.usuarioActual.uid;

        console.log('Nuevo usuario logueado:', this.usuarioActual.email);
  
        this.obtenerItemsCosasDB('cosas_lindas');
        this.obtenerItemsCosasDB('cosas_feas');
      }
      else
      {
        console.log('Usuario deslogueado');
        this.uid = "";
      }
    });
  }  


  
  obtenerItemsCosasDB(nombre_lista:string) 
  {

    const auth = getAuth();
    const coleccion = collection(this.firestore, nombre_lista);
    const q = query(coleccion,where('usuario','==',auth.currentUser?.email));
  
    const observable = collectionData(q, { idField: 'id' });
  
    observable.subscribe((datos) => {
      if(nombre_lista ==="cosas_lindas")
      {
        this.cosasLindas = datos;
      }
      else
      {
        this.cosasFeas = datos;
      }
      console.log('items', datos);
    });
  }
  

  
  async eliminarItem(item: any, nombre_lista: string)
  {
    const itemDocRef = doc(this.firestore, nombre_lista, item.id);
  
    try 
    {
      await deleteDoc(itemDocRef);
      console.log('Item eliminado');
    } catch (error) {
      console.error('Error al eliminar item:', error);
    }
  }

  async abrirImagen(imagenUrl: string) 
  {
        this.sonido.ejecutarSonido('abrir');

    const modal = await this.modalCtrl.create({
      component: ImagenPage,
      componentProps: { imagenUrl: imagenUrl }
    });
    return await modal.present();
  }
}
