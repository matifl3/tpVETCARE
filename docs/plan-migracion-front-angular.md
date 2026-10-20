# Plan: Migración del frontend React → Angular (PetCare)

> Proyecto: `C:\Users\Usuario\Desktop\VETACRE\tpVETCARE\PetCare`
> Frontend React actual: `frontend/` (React 18 + Vite + react-router v6)
> Frontend Angular destino: `frontend-ng/` (Angular 18, standalone + signals)
> Backend: Spring Boot — **no se modifica**.
> Repo: https://github.com/matifl3/tpVETCARE.git (branch `main`)

---

## 0. Estado actual (actualizado)

| Fase | Estado | Commit |
|---|---|---|
| Fase 0 — Scaffolding | ✅ completada | `27a4788` (pusheado) |
| Fase 1 — Infraestructura | ✅ completada y verificada con `tsc` | `27a4788` (pusheado) |
| Fase 2 — Layout + sesión | ✅ completada y verificada con `tsc` | `10b0dbc` (pusheado) |
| Fase 3 — 19 páginas restantes (4 bloques) | ⏳ pendiente (los subagentes se cortaron por reinicios del servidor) | — |
| Fase 4 — Verificación y cierre | ⏳ pendiente | — |

**Regla de trabajo:** commitear y pushear al terminar cada fase.

> El `ng build` completo falló una vez por falta de memoria del sistema (`esbuild: cannot allocate memory`), no por errores de código. Chequeos diarios con `npx tsc --noEmit -p tsconfig.app.json` (liviano) y `ng build` reservado para hitos.

---

## 1. Diagnóstico del punto de partida

- **Backend Spring Boot** (Maven/Java): expone `/api/*`, `/login`, `/logout` con sesión por cookie (`credentials: 'include'`). No se toca.
- **Frontend React** en `frontend/`:
  - 24 archivos `.jsx` en `pages/` (~2.300 líneas): 23 páginas + `Dashboard.jsx` (layout con `<Outlet>`)
  - `src/App.jsx`: rutas anidadas bajo `/dashboard` + params (`:idProfesional`, `:idMascota`)
  - `src/services/api.js`: wrapper de `fetch` con 10 objetos de dominio (auth, mascotas, productos, carrito, turnos, tarjetas, profesionales, usuarios, seguimiento, reportes)
  - `src/styles/index.css`: 562 líneas CSS global (sin CSS-in-JS → migración trivial)
  - Auth: `Dashboard.jsx` llama `/api/auth/me` en `useEffect`, redirige a `/login` si falla; pasa `user` vía outlet context
  - `vite.config.js`: proxy `/api`, `/login`, `/logout` → `http://localhost:8080`
  - `vercel.json`: rewrites SPA
  - `.env`: `VITE_API_URL`

## 2. Decisiones tomadas (confirmadas)

1. **Carpeta nueva `frontend-ng/`**: el React sigue funcionando hasta que se confirme el corte.
2. **Estilo Angular**: standalone + signals + control flow `@if`/`@for` (sin NgModules).
3. **Formularios con signals**: estado en `signal()`, binding `[value]` + eventos `(input)`/`(change)` (equivalente a inputs controlados de React). Sin Reactive Forms ni ngModel.
4. **Alcance**: migración completa de las 24 páginas.
5. **`tsconfig.json`**: se desactivó `noPropertyAccessFromIndexSignature` porque `core/models.ts` declara `[key: string]: any` (misma flexibilidad que el JS original) para campos extra que devuelva el backend.

## 3. Equivalencias React → Angular

| React actual | Angular |
|---|---|
| `react-router` `<Routes>` anidadas | `app.routes.ts` con rutas hijas bajo `/dashboard` |
| `useParams` | `ActivatedRoute.paramMap` / snapshot |
| `useNavigate` | `Router.navigate([...])` |
| `useOutletContext({ user })` | `AuthService.user()` (signal global) — se elimina el contexto |
| Guard en `useEffect` de `Dashboard.jsx` | `authGuard` + `canActivateChild` funcionales (`core/auth.guard.ts`) |
| `useState` / `useEffect` | `signal()` + carga en `ngOnInit` con `.subscribe({ next, error })` |
| fetch wrapper `api.js` | `ApiService` (HttpClient, `withCredentials: true`) + servicios por dominio |
| Manejo de errores del `request()` | `errorInterceptor` (HttpInterceptorFn): `body.error \|\| body.message \|\| statusText \|\| 'Error en la solicitud'` → `Error` |
| Forms controlados (`value`/`onChange`) | `[value]="form().x"` + `(input)="upd({ x: inputValue($event) })"` con helpers de `core/form.helpers.ts` |
| `className` / `style={{...}}` | `class` / `style="..."` (camelCase → kebab); dinámicos con `[class.x]` |
| `index.css` global | `frontend-ng/src/styles.css` (mismo contenido, mismas clases) |
| `VITE_API_URL` | `environment.apiUrl` (`src/environments/environment.ts`) |
| Proxy de `vite.config.js` | `frontend-ng/proxy.conf.json` (npm start ya lo usa) |
| `vercel.json` rewrites | `vercel.json` equivalente para la salida Angular (`dist/frontend-ng/browser`) — Fase 4 |

## 4. Estructura objetivo

```
frontend-ng/
  proxy.conf.json
  vercel.json                      # al cierre (Fase 4)
  src/
    styles.css                     # copia del CSS React
    environments/environment.ts    # apiUrl (equivale a VITE_API_URL)
    index.html                     # título "PetCare"
    app/
      app.config.ts                # provideRouter + provideHttpClient(withInterceptors([errorInterceptor]))
      app.routes.ts                # todas las rutas (eager) + wildcard → ''
      core/
        models.ts                  # interfaces (SessionUser, Mascota, Turno, Carrito, ...)
        api.service.ts             # get/post/put/delete(+WithParams) con withCredentials
        auth.service.ts            # signal user, check(), login(), registro(), logout()
        auth.guard.ts              # authGuard (equivale al useEffect de Dashboard)
        error.interceptor.ts       # misma semántica de errores que el fetch original
        form.helpers.ts            # inputValue(), checkedValue(), numberValue()
      services/                    # espejo 1:1 de los objetos de api.js
        mascota, producto, carrito, turno, tarjeta,
        profesional, usuario, seguimiento, reporte
      layout/
        dashboard.component.ts     # nav + @if profesional no aprobado + <router-outlet>  ✅
      pages/                       # 24 componentes
        home, login, dashboard-home, solicitud-pendiente  ✅ (Fase 2)
        + 19 pendientes (Fase 3)
```

### Rutas (espejo de `App.jsx`, ya implementadas en `app.routes.ts`)

```
/                                                        Home                         ✅
/login                                                   Login                        ✅
/dashboard                        [authGuard, canActivateChild: authGuard]
  index                                                   DashboardHome                ✅
  mascotas | profesionales | profesionales/reservar/:idProfesional
  tienda | carrito | mis-turnos | tarjetas | compra-exitosa
  mascotas/:idMascota/seguimiento
  admin/usuarios|postulaciones|mascotas|turnos|productos|reportes
  profesional | profesional/mis-turnos|mis-pacientes|perfil
**  → redirect a ''
```

## 5. Fases

### Fase 0 — Scaffolding ✅
- `ng new frontend-ng --routing --style=css --ssr=false` (Angular CLI 18.0.3)
- CSS global copiado, `proxy.conf.json`, `environment.ts`, título "PetCare", script `start` con proxy.

### Fase 1 — Infraestructura ✅ (commit `27a4788`)
- `core/`: models, ApiService, AuthService (signal), authGuard, errorInterceptor, form.helpers
- 9 servicios de dominio (espejo exacto de `api.js`)
- `app.config.ts` con `provideHttpClient(withInterceptors([errorInterceptor]))`
- Verificación: `tsc` limpio.

### Fase 2 — Layout + sesión ✅ (commit `10b0dbc`)
- `layout/dashboard.component.ts` ← `Dashboard.jsx`: nav, logout, `@if (esProfesionalNoAprobado) { <app-solicitud-pendiente/> } @else { <router-outlet/> }` usando `AuthService.user()`.
- `pages/login.component.ts` ← `Login.jsx` (tabs con signals, registro con rol profesional)
- `pages/home.component.ts` ← `Home.jsx`
- `pages/dashboard-home.component.ts` ← `DashboardHome.jsx`
- `pages/solicitud-pendiente-page.component.ts` ← `SolicitudPendientePage.jsx`
- `app.routes.ts` con todas las rutas
- Verificación: `npx tsc --noEmit -p tsconfig.app.json` → solo quedan TS2307 de las 19 páginas pendientes.

### Fase 3 — Las 19 páginas restantes en 4 bloques ⏳

| Bloque | Páginas |
|---|---|
| 3a | MascotasPage, ProfesionalesPage, ReservarTurnoPage* |
| 3b | TiendaPage, CarritoPage*, TarjetasPage, CompraExitosaPage |
| 3c | MisTurnosPage, SeguimientoPage, ProfesionalDashboard, MisTurnosProfesionalPage, MisPacientesProfesionalPage, PerfilProfesionalPage |
| 3d | AdminUsuariosPage, AdminPostulacionesPage, AdminMascotasPage, AdminTurnosPage, AdminProductosPage, AdminReportesPage |

\* las más complejas: `ReservarTurnoPage` (params + disponibilidad por fecha) y `CarritoPage` (tabs, método de pago, tarjeta nueva).

**Patrón por componente** (referencias: `dashboard-home.component.ts` y `login.component.ts`):
```ts
data = signal<T[]>([]); loading = signal(true); error = signal('');
ngOnInit() { this.cargar(); }
cargar(): void {
  this.svc.listar().subscribe({
    next: (d) => { this.data.set(d); this.loading.set(false); },
    error: (err) => { this.error.set(err.message); this.loading.set(false); },
  });
}
upd(patch: Partial<Form>): void { this.form.set({ ...this.form(), ...patch }); }
```
```html
@if (loading()) { <p>Cargando...</p> } @else { ... }
<input [value]="form().nombre" (input)="upd({ nombre: inputValue($event) })" />
```

**Regla de convivencia**: los subagentes solo crean archivos en `pages/` (nadie toca `app.routes.ts` ni `models.ts` a la vez); las rutas ya están puestas y las corrige el agente principal si hace falta.
**Verificación por bloque:** `npx tsc --noEmit -p tsconfig.app.json` (aceptar solo TS2307 de otros bloques).

### Fase 4 — Verificación y cierre ⏳
- `ng build` production limpio (con memoria disponible)
- Control: 24 rutas, textos/acentos/emojis idénticos, paridad visual con el CSS compartido
- `vercel.json` para salida Angular
- Recién ahí (con confirmación): eliminar o dejar de referencia `frontend/` React

## 6. Riesgos y notas

- **Memoria de la máquina**: el `ng build` completo puede fallar; alternar con `tsc --noEmit` y cerrar procesos pesados. Los subagentes en paralelo se cortaron con reinicios del servidor: si vuelve a pasar, lanzar los bloques de a uno.
- **Campos extra del backend**: `models.ts` declara `[key: string]: any` en las interfaces para mantener la misma flexibilidad que el JS original; si una página usa un campo no previsto, agregarlo ahí (siempre por el agente principal, sin ediciones concurrentes).
- **Paridad visual garantizada**: mismo CSS y mismas clases → cero trabajo de estilos salvo diferencias de DOM.
- **Comportamiento idéntico**: el interceptor replica exactamente la jerarquía de mensajes de error del `request()` original; el guard replica el redirect a `/login` ante cualquier fallo de `/api/auth/me`.
- **Commit/push por fase**: al terminar cada fase, `git add frontend-ng && git commit && git push origin main`.
