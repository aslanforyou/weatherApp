import {Injectable} from '@angular/core';
import {Coordinates} from './coordinates.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  getLocation(): Observable<Coordinates> {
    return new Observable<Coordinates>(subscriber => {
      const geolocation = navigator.geolocation;
      if (geolocation) {
        geolocation.getCurrentPosition((position) => {
          const coordinates: Coordinates = new Coordinates(Math.round(position.coords.latitude * 10000) / 10000,
            Math.round(position.coords.longitude * 10000) / 10000);
          subscriber.next(coordinates);
        }, (error) => {
          subscriber.error(error);
        })
      } else {
        subscriber.error('Location service isn\'t available');
      }
    });
  }

}
