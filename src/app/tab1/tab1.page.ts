import { Component, OnInit,OnChanges, SimpleChanges } from '@angular/core';
import { query, collection, Firestore, orderBy, collectionData, where } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { doc, updateDoc, arrayUnion, increment,arrayRemove,deleteDoc  } from 'firebase/firestore';
import { getAuth,onAuthStateChanged  } from "firebase/auth";
import { ModalController } from '@ionic/angular';
import { ImagenPage } from '../imagen/imagen.page';


@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone:false,
})
export class Tab1Page implements OnInit {

  
  sub!: Subscription;
  cosasLindas: any[] = [];
  cosasFeas: any[] = [];
  isLoading = true;
  uid: string="";
  usuarioActual :any;

  constructor(
    private firestore: Firestore,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() 
  { 
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


  
  obtenerItemsCosasDB(nombre_lista:string) {
    const coleccion = collection(this.firestore, nombre_lista);
    const q = query(coleccion, orderBy('fecha', 'asc'));
  
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
  

  usuarioDioLike(item: any): boolean 
  {
    return item.likedBy && item.likedBy.includes(this.uid);
  }

  async darLike(item: any, nombre_lista: string)
  {
    const itemDocRef = doc(this.firestore, nombre_lista, item.id);
  
    if (this.usuarioDioLike(item)) 
    {
      try {
        await updateDoc(itemDocRef, {
          likedBy: arrayRemove(this.uid),
          likes: increment(-1)
        });
        console.log('Like quitado');
      } catch (error) {
        console.error('Error al quitar like:', error);
      }
    }
    else
    {
      try {
        await updateDoc(itemDocRef, {
          likedBy: arrayUnion(this.uid),
          likes: increment(1)
        });
        console.log('Like agregado');
      } catch (error) {
        console.error('Error al dar like:', error);
      }
    }
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
    const modal = await this.modalCtrl.create({
      component: ImagenPage,
      componentProps: { imagenUrl: imagenUrl }
    });
    return await modal.present();
  }
}
