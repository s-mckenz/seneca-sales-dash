import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UrlParamService {
  constructor(private route: ActivatedRoute, private router: Router) {}

  // Get a single query parameter by key
  getQueryParam(key: string): string | null {
    return this.route.snapshot.queryParamMap.get(key);
  }

  // Get all query parameters as an object
  getAllQueryParams(): { [key: string]: string } {
    return this.route.snapshot.queryParams;
  }

  // Get a query parameter as an Observable
  getQueryParamAsObservable(key: string): Observable<string | null> {
    return this.route.queryParamMap.pipe(map((params) => params.get(key)));
  }

  // Navigate and update a query parameter
  setQueryParam(key: string, value: string): void {
    const queryParams = { ...this.route.snapshot.queryParams, [key]: value };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge', // Merge with existing parameters
    });
  }
}
