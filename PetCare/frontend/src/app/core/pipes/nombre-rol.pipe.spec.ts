import { NombreRolPipe } from './nombre-rol.pipe';

describe('NombreRolPipe', () => {
  const pipe = new NombreRolPipe();

  it('traduce los roles conocidos', () => {
    expect(pipe.transform('ADMIN')).toBe('Administrador');
    expect(pipe.transform('CLIENTE')).toBe('Cliente');
    expect(pipe.transform('VETERINARIO')).toBe('Veterinario');
    expect(pipe.transform('PASEADOR')).toBe('Paseador');
    expect(pipe.transform('PELUQUERO')).toBe('Peluquero');
    expect(pipe.transform('ADIESTRADOR')).toBe('Adiestrador');
    expect(pipe.transform('CUIDADOR')).toBe('Cuidador');
  });

  it('acepta el rol en minúsculas', () => {
    expect(pipe.transform('veterinario')).toBe('Veterinario');
  });

  it('capitaliza un rol desconocido', () => {
    expect(pipe.transform('OTRO_ROL')).toBe('Otro_rol');
  });

  it('devuelve cadena vacía para null, undefined o vacío', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });
});
