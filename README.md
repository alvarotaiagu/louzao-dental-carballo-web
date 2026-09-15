# Clínica Dental Louzao — landing

React + Vite + TypeScript + Tailwind CSS. Una sola página (`src/App.tsx`),
sin librerías de UI ni de iconos. Técnica principal: **"masked cards"** —
varias tarjetas comparten una única imagen de fondo grande, cada una
mostrando una "ventana" distinta hacia esa misma imagen (mosaico coherente
en vez de recortes independientes).

```
npm install
npm run dev      # desarrollo
npm run build    # build de producción a dist/
```

## Origen del contenido

Negocio real, sin web previa. El usuario pasó una captura de la ficha de
Google de **Clínica Dental Louzao** (Rúa Vázquez de Parga, 5, 3°C, 15100
Carballo, A Coruña — teléfono 981 75 54 18, 5,0★ sobre 10 reseñas,
categoría "Clínica dental", horario semanal completo) junto con un prompt
técnico detallado (estructura de secciones, hooks, estilos) que se siguió
tal cual, sustituyendo el contenido de ejemplo por estos datos reales:

- **Dirección, teléfono y horario semanal real** cableados como `tel:` en
  el navbar, el hero, el menú móvil y el pie de contacto; horario completo
  en el pie.
- **Valoración**: 5,0★ sobre 10 reseñas en Google, enlazada al pie.
- **Enlace "Cómo llegar"** a una búsqueda de Google Maps por nombre +
  dirección (sin API key, sin invención de `place_id`).

### Placeholders conscientes (pendiente de confirmar con el cliente)

La ficha de Google solo indica la categoría "Clínica dental", sin listar
tratamientos concretos. Para no inventar servicios que el prompt original
sí incluía (carillas, implantes...) sin poder confirmarlos, se optó por:

- **Sección de servicios** (tira de 4 tarjetas): Revisión y Diagnóstico,
  Limpieza Dental, Empastes y Caries, Ortodoncia — servicios genéricos de
  odontología general, no una lista confirmada por la clínica.
- **Tercera sección**, renombrada de "Implant Dentistry" (spec original) a
  "Cuidado Integral" — contenido genérico de salud dental familiar en vez
  de un servicio específico no verificado.
- Se eliminaron los reclamos "Free Consultation" / "Dental Emergency" del
  prompt original (no verificables) y se sustituyeron por CTAs de llamada
  reales.

Si el cliente confirma su lista real de tratamientos, actualizar el array
`services` y el contenido de la Sección 3 en `src/App.tsx`.

## Estructura técnica (resumen del spec seguido)

- **Splash screen**: contador 0→100 en 2000ms, esquina inferior izquierda.
- **Navbar** fija con logo "Louzao / Dental", menú hamburguesa en móvil
  (overlay + panel deslizante) con enlaces de scroll y CTA de llamada.
- **Sección 1 (Hero)**: 3 barras de features + tarjeta principal, todas
  "masked cards" sobre `HERO_IMAGE`.
- **Sección 2**: grid de mosaico ("Nuestra Clínica", CTA de llamada,
  "Cuidado Dental", tira de servicios) sobre `SECTION2_IMAGE`.
- **Sección 3**: columna izquierda (texto + 2 imágenes + CTA de cita) y
  columna derecha (imagen alta con overlays "Tu Primera Visita" /
  "Cuidados para tu Sonrisa").
- **Pie de contacto** (no estaba en el spec original, añadido porque una
  clínica real necesita horario/dirección visibles): dirección, teléfono,
  valoración y horario completo sobre fondo negro.
- Animaciones de aparición por scroll (`useStaggeredReveal`,
  IntersectionObserver) y el hook `useMaskPositions` (ResizeObserver) que
  calcula el recorte de cada tarjeta sobre la imagen compartida.
