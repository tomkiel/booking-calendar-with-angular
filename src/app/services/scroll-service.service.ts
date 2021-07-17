import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollServiceService {

  constructor() {

  }

  determineScroll(htmlElementName: string): void {
    const horizontalElement = document.getElementById(htmlElementName)!;
    window.addEventListener("wheel", function (element) {
      if (element.deltaY > 0) horizontalElement.scrollLeft += 100;
      else horizontalElement.scrollLeft -= 100;
    })
  }
}
