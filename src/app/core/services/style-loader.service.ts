import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StyleLoaderService {

  loadStyles(stylesheets: string[]) {
    stylesheets.forEach(href => {
      const head = document.getElementsByTagName('head')[0];
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = href;
      head.appendChild(link);
    });
  }
}
