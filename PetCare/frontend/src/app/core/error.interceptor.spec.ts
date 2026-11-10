import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { providersDePrueba } from '../testing/test-utils';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: providersDePrueba() });
    httpClient = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('convierte el { error } del backend en un Error con ese mensaje', () => {
    let mensaje = '';
    httpClient.get('/api/x').subscribe({ error: (e: Error) => (mensaje = e.message) });

    http
      .expectOne('/api/x')
      .flush({ error: 'El email ya está registrado' }, { status: 400, statusText: 'Bad Request' });

    expect(mensaje).toBe('El email ya está registrado');
  });

  it('si el backend no manda mensaje usa el statusText', () => {
    let mensaje = '';
    httpClient.get('/api/x').subscribe({ error: (e: Error) => (mensaje = e.message) });

    http.expectOne('/api/x').flush(null, { status: 500, statusText: 'Server Error' });

    expect(mensaje).toBe('Server Error');
  });
});
