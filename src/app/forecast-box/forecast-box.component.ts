import {Component, Input} from '@angular/core';
import {Forecast} from '../forecast.model';
import {Wind} from '../wind.model';
import {TemperatureUnit} from '../temperature-unit.model';


@Component({
  selector: 'forecast-box',
  templateUrl: './forecast-box.component.html',
  styleUrls: ['./forecast-box.component.scss']
})
export class ForecastBoxComponent {

  @Input() forecast: Forecast;

  getWindowDirectionLabel(wind: Wind): string {
    let val = Math.floor((wind.direction / 22.5) + 0.5);
    let arr = [
      'северный',
      'северо-северовосточный',
      'северовосточный',
      'востоко-северовосточный',
      'восточный',
      'востоко-юговосточный',
      'юговосточный',
      'юго-юговосточный',
      'южный',
      'юго-югозападный',
      'югозападный',
      'западо-югозападный',
      'западный',
      'западо-северозападный',
      'северозападный',
      'северо-северозападный'
    ];
    return arr[(val % 16)];
  }

  getRecapIconPath(recapVal: string): string {
    let icon: string = null;
    switch (recapVal) {
      case '01':
        icon = './assets/img/sun.png';
        break;
      case '03':
      case '04':
        icon = './assets/img/cloud.png';
        break;
      case '09':
      case '10':
        icon = './assets/img/rain.png';
        break;
      case '13':
        icon = './assets/img/snow.png';
        break;
      case '02':
        icon = './assets/img/partly_cloudy.png';
        break;
      case '11':
        icon = './assets/img/strom.png';
        break;
    }
    return icon;
  }

  isImperialSystem(): boolean {
    return this.forecast.units === TemperatureUnit.F;
  }

  isMetricSystem(): boolean {
    return this.forecast.units === TemperatureUnit.C;
  }

}
