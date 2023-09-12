import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appRestrictDash]'
})
export class RestrictDashDirective {

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;

    // Verificar si el carácter "-" está presente en el valor del input
    if (inputValue.includes('-')) {
      // Si está presente, eliminarlo
      input.value = inputValue.replace('-', '');
    }
  }
}
