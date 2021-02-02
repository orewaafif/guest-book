import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssetLoaderService {

  constructor() { }

  // Returns a Promise that loads the script
  loadScript(scriptPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const scriptElement = window.document.createElement('script');
      scriptElement.src = scriptPath;

      scriptElement.onload = () => {
        resolve();
      };

      scriptElement.onerror = () => {
        reject();
      };

      window.document.body.appendChild(scriptElement);
    });
  }
}
