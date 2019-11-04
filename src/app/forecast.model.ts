import {Wind} from './wind.model';
import {TemperatureUnit} from './temperature-unit.model';


export class Forecast {

  temperature: number;
  units: TemperatureUnit;
  description: string;
  wind: Wind;
  humidity: number;
  recap: string;
  pressure: number;
  city: string;


  constructor(temperature: number, units: TemperatureUnit, description: string, wind: Wind, humidity: number, recap: string, pressure: number, city: string) {
    this.temperature = temperature;
    this.units = units;
    this.description = description;
    this.wind = wind;
    this.humidity = humidity;
    this.recap = recap;
    this.pressure = pressure;
    this.city = city;
  }
}
