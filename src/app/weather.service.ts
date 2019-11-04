import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) {
  }

  getWeather(q: string, units: string): Observable<any> {
    return this.http.get(environment.weatherServiceEndpoint, {
      params: {
        'appId': environment.appId,
        'q': q,
        'units': units,
        'lang': environment.locale,
      }
    });
  }

}
