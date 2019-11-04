import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType, HttpParams, HttpRequest} from '@angular/common/http';
import {WeatherService} from './weather.service';
import {LocationService} from './location.service';
import {Forecast} from './forecast.model';
import {TemperatureUnit} from './temperature-unit.model';
import {Wind} from './wind.model';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private httpClient: HttpClient,
              private weatherService: WeatherService,
              private locationService: LocationService) {
  }

  currentForecast: Forecast;

  ngOnInit() {
    this.getWeather(false);
  }

  loading = true;
  searchComplete = false;
  searchCProgress = false;
  citySearch = false;
  city = 'Москва';
  cityNew = '';
  cityList = [];
  lat = null;
  lon = null;
  title = 'weatherApp';
  units: TemperatureUnit = TemperatureUnit.C;
  warnMsg = null;

  setMetricSystem(): void {
    this.units = TemperatureUnit.C;
  }

  setImperialSystem(): void {
    this.units = TemperatureUnit.F;
  }

  isImperialSystem(): boolean {
    return this.units === TemperatureUnit.F;
  }

  isMetricSystem(): boolean {
    return this.units === TemperatureUnit.C;
  }

  getWeather(coord) {
    let params = {
      'appId': '33664a2595f1e0907eb7bcf07bdd40c4',
      'q': '',
      'units': this.units,
      'lang': 'ru',
      'lat': '',
      'lon': ''
    };

    if (coord && this.lat && this.lon) {
      params.lat = this.lat;
      params.lon = this.lon;
    } else {
      params.q = this.city;
    }

    const req = new HttpRequest('GET', `${environment.weatherServiceEndpoint}?`, {
      params: new HttpParams({
        fromObject: params
      })
    });

    this.httpClient.request(req).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Sent ');
          this.loading = true;
          break;
        case HttpEventType.Response:
          this.warnMsg = null;
          let data = event.body;

          let wind: Wind = new Wind(data.wind.deg as number, Math.round(data.wind.speed));
          this.currentForecast = new Forecast(
            Math.round(Number(data.main.temp)),
            TemperatureUnit.C,
            data.weather[0].description,
            wind,
            data.main.humidity as number,
            data.weather[0].icon.slice(0, 2),
            Math.round(data.main.pressure * 0.75006157584566),
            data.name
          );
          if (coord) {
            this.city = data.name;
          }
          this.loading = false;
      }

    }, (err) => {
      console.log(err)
      this.loading = false;
      this.warnMsg = 'Please change City';
    });
  }

  changeCity() {
    this.citySearch = !this.citySearch;
    this.cityNew = this.city;
    this.cityList = [];
    this.searchComplete = false
  }

  submit() {
    this.citySearch = !this.citySearch;
    this.city = this.cityNew;
    this.getWeather(false);
  }


  currentLocation() {
    console.info('getting current location');
  }

  // getLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.lat = Math.round(position.coords.latitude*10000)/10000;
  //       this.lon = Math.round(position.coords.longitude*10000)/10000;
  //       this.getWeather(true);
  //     });
  //   } else {
  //     console.log('no location');
  //     alert("Geolocation is not supported by this browser.");
  //   }
  // }

  reset(evnt) {
    if (this.citySearch && !(!!evnt.target.id && evnt.target.id.indexOf('city') > -1)) {
      this.citySearch = false;
    }
  }

  findCity() {
    this.searchCProgress = true;
    let params = {
      'appId': '33664a2595f1e0907eb7bcf07bdd40c4',
      'q': this.cityNew,
      'units': this.units,
      'lang': 'ru',
    };

    const req = new HttpRequest('GET', `${environment.citySearchServiceEndpoint}?`, {
      params: new HttpParams({
        fromObject: params
      })
    });

    this.httpClient.request(req).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Response:
          let data = event.body;
          this.cityList = !!data && !!data.list && data.list || [];
          this.searchComplete = true;
          this.searchCProgress = false;
      }
    }, (err) => {
      console.log(err)
    });
  }

  timeout = 0;

  searchCity() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.searchComplete = false;
      this.findCity()
    }, 1200)
  }

  setCity(city) {
    this.cityNew = city;
    this.submit()
  }

}
