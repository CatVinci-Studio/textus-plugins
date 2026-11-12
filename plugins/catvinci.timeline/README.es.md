# Cronología

Dibuja hechos como una cronología, uno por línea: cuándo | qué | más.

## Dibujar una cronología

- Escribe un bloque de código en `timeline` con un hecho por línea: cuándo pasó, qué pasó y una nota opcional, separados por `|`. La cronología se dibuja debajo, y el código vuelve a verse al hacer clic en el bloque.
- Los hechos se dibujan en el orden en que los escribes, a lo largo de una línea con un punto para cada uno. "Cuándo" puede ser cualquier texto: una fecha, un año, "Día 3".
- Las líneas vacías se saltan. Lo que va tras un tercer `|` no se muestra.
- `height=400` tras el lenguaje fija la altura del dibujo.
- Usa los colores del tema y se vuelve a dibujar al cambiar de tema.
- Al exportar a HTML, PDF o Word, la cronología va como imagen.

## Ejemplo

```timeline
2024-03 | Primer borrador | El esquema y dos capítulos
2024-09 | Revisión | Notas de tres lectores
2025-01 | Publicado
```

## Permisos

Solo pide **Herramientas para Textus AI**, para que Textus AI pueda revisar un bloque antes de escribirlo. No lee archivos y lo dibuja todo en tu equipo, en escritorio y en iOS.

## Cambios

- **0.3.2** - las notas y fechas largas se ajustan a un panel estrecho, usa la fuente del documento y un bloque vacío dice qué escribir
- **0.3.1** - Su página dice ahora en una frase qué hace, qué puede hacer y qué cambió en cada versión.
- **0.3.0** - una herramienta para Textus AI, `check_timeline`
- **0.2.0** - los colores del tema, con nuevo dibujo al cambiar de tema
- **0.1.3** - el texto con los colores del tema en Textus 1.3
- **0.1.2** - sigue el ritmo de las ediciones rápidas: un dibujo viejo ya no tapa uno nuevo
- **0.1.0-0.1.1** - primeras versiones: hechos dibujados como cronología, altura ajustable, imágenes al exportar

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_timeline`: Revisa el código de un bloque ```timeline - un suceso por línea, escrito cuándo | qué | más - antes de que entre en un documento, sin dibujarlo. Devuelve ok, o los problemas que hay que corregir antes. Pasa el código sin su valla.
<!-- /ai-tools -->
