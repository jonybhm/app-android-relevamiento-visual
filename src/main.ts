import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { AppModule } from './app/app.module';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory() {
  return player;
}
platformBrowserDynamic().bootstrapModule(AppModule)
.catch(err => console.log(err));

defineCustomElements(window);