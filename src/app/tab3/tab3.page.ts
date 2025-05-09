import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc ,updateDoc} from "firebase/firestore";  
import { ErrorService } from '../../app/servicios/error-toast.service';
import { supabase } from '../../environments/environment';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  constructor(
        private error:ErrorService,  
        public auth: Auth,
  
  ) {

  }

  async almacenarCosasLindas() {
    await this.tomarFotoYGuardar('cosas_lindas');
  }

  async almacenarCosasFeas() {
    await this.tomarFotoYGuardar('cosas_feas');
  }

  async tomarFotoYGuardar(categoria: string) {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });
  
      const nombreArchivo = `${new Date().getTime()}_${this.auth.currentUser?.email?.split('@',1)}.jpg`;
      const fileData = this.base64ToBlob(photo.base64String!, 'image/jpeg');
  
      // Subir a Supabase
      const { data, error } = await supabase.storage.from('fotos').upload(`${categoria}/${nombreArchivo}`, fileData, {
          contentType: 'image/jpeg'
        });
  
      if (error) 
      {
        throw error;
      }
  
      const { data: publicUrlData } = supabase.storage.from('fotos').getPublicUrl(`${categoria}/${nombreArchivo}`);
  
      const publicUrl = publicUrlData.publicUrl;
  
      const db = getFirestore();
      await addDoc(collection(db, categoria), {
        url: publicUrl,
        usuario: this.auth.currentUser?.email,
        fecha: new Date(),
        nombre: nombreArchivo,
        likes: 0,
        likedBy: [],
      }).then((docRef) => {
                updateDoc(docRef, { id: docRef.id }).then(() => {
                  console.log("ID foto agregada");
                });
              })
              .catch((error) => {
                console.error(error);
              }
            );
  

      this.error.Toast.fire(
        {
          title:"Foto subida correctamente",
          icon:'info'
        }) 

    } catch (error) {
      console.error('Error al tomar o subir la foto', error);
      alert('Ocurrió un error al subir la foto');
    }
  }
  
  base64ToBlob(base64: string, contentType: string): Blob 
  {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) 
      {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) 
      {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }



}
