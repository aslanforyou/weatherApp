import {Component} from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getWeather(false);
  }

  citySearch = false;
  city = 'Москва';
  lat = null;
  lon = null;
  title = 'weatherApp';
  units = 'metric';
  temp = '';
  descr = '';
  wind = {
    deg: null,
    speed: null,
    descr: '',
  };
  pressure = '';
  humidity = '';
  weatherCond = '50';
  warnMsg = null;
  url = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?';


  setUnits(number: number) {
    switch (number) {
      case 1 : {
        this.units = 'metric';
        break;
      }
      case 2 : {
        this.units = 'imperial';
        break;
      }
      default: {
        this.units = 'metric';
        break;
      }
    }
    this.getWeather(false);
  }

  degToCompass(num) {
    let val = Math.floor((num / 22.5) + 0.5);
    let arr = [
      "северный",
      "северо-северовосточный",
      "северовосточный",
      "востоко-северовосточный",
      "восточный",
      "востоко-юговосточный",
      "юговосточный",
      "юго-юговосточный",
      "южный",
      "юго-югозападный",
      "югозападный",
      "западо-югозападный",
      "западный",
      "западо-северозападный",
      "северозападный",
      "северо-северозападный"
    ];
    return arr[(val % 16)];
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

    const req = new HttpRequest('GET', this.url, {
      params: new HttpParams({
        fromObject: params
      })
    });

    this.http.request(req).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Sent ');
          break;
        case HttpEventType.DownloadProgress:
          console.log(`Downloading: ${event.loaded / 1024}Kb`);
          break;
        case HttpEventType.Response:
          this.warnMsg = null;
          console.log('Finished', event.body);
          let data = event.body;
          this.temp = String(Math.round(Number(data.main.temp)));
          this.descr = data.weather[0].description;
          this.wind.descr = this.degToCompass(data.wind.deg);
          this.wind.speed = data.wind.speed;
          this.humidity = data.main.humidity;
          this.pressure = Math.round(data.main.pressure * 0.75006157584566).toString();
          this.weatherCond = data.weather[0].icon.slice(0, 2);
          if (coord) {
            this.city = data.name;
          }
      }

    }, (err)=>{
      console.log(err)
      this.warnMsg = "Please change City";
    });
  }

  changeCity() {
    console.log('ggggg');
    this.citySearch = !this.citySearch;
  }

  submit() {
    console.log('submin');
    this.citySearch = !this.citySearch;
    this.getWeather(false);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
        this.getWeather(true);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

}
