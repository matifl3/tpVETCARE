/**
 * Helpers para formularios basados en signals (modelo de estado + eventos de input),
 * equivalentes a los inputs controlados de React (`value` + `onChange`).
 */

export function inputValue(event: Event): string {
  const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  return target.value;
}

export function checkedValue(event: Event): boolean {
  return (event.target as HTMLInputElement).checked;
}

/** Lectura numérica (input type=number). Devuelve `''` si está vacío. */
export function numberValue(event: Event): number | '' {
  const raw = inputValue(event);
  if (raw === '') return '';
  return Number(raw);
}
