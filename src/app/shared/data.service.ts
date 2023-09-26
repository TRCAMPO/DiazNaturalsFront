import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private inputValue: string = '';

  private inputValue2: string = '';
  constructor() { }

  setInputValue(value: string) {
    this.inputValue = value;
  }

  getInputValue(): string {
    return this.inputValue;
  }

  setInputValue2(value: string) {
    this.inputValue2 = value;
  }

  getInputValue2(): string {
    return this.inputValue2;
  }

}
