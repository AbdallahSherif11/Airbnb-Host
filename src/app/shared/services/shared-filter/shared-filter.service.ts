// shared-filter.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedFilterService {
  private viewSelectedSubject = new Subject<string>();
  
  viewSelected$ = this.viewSelectedSubject.asObservable();
  
  selectView(view: string) {
    this.viewSelectedSubject.next(view);
  }

  private priceRangeSubject = new Subject<{min: number, max: number}>();
priceRangeChanged$ = this.priceRangeSubject.asObservable();

updatePriceRange(min: number, max: number) {
  this.priceRangeSubject.next({min, max});
}
}