# Autocompletado de LaTeX

Sugiere comandos de LaTeX mientras escribes una fórmula.

- En una fórmula (entre `$ … $` o en un bloque matemático), escribe una barra invertida y el comienzo de un comando, como `\fr` o `\alp`. Una barra invertida sola muestra los más comunes.
- La lista muestra los comandos que coinciden, cada uno con lo que dibuja: más de 200, de `\frac` a `\begin{pmatrix}`. Primero van los que empiezan por lo que escribiste y después los que lo contienen, sin distinguir mayúsculas.
- Las letras en orden también encuentran un comando: `\rarr` es `\rightarrow`, `\lra` es `\leftrightarrow`.
- **Intro** o **Tab** escribe el elegido, con el cursor dentro de sus llaves; **Esc** cierra la lista. `\left(`, `\left[` y `\left\{` llegan con su `\right`.

Funciona en escritorio y en iPhone y necesita Textus 1.3.0 o posterior. Pide un solo permiso, leer el editor, para ver lo que escribes en la fórmula.

## Cambios

- **0.1.5** - La descripción de la tienda empieza ahora por lo que hace el plugin.
- **0.1.4** - Un comando escrito entero va primero, así que Intro lo mantiene (\in sigue siendo \in); un comando sin llaves se escribe con un espacio detrás; con Textus 1.3.13 la lista se cierra al escribir un comando.
- **0.1.3** - Su página dice ahora en una frase qué hace, qué puede hacer y qué cambió en cada versión.
- **0.1.2** - Indica dónde funciona: escritorio y iPhone.
- **0.1.0-0.1.1** - Primeras versiones: más de 200 comandos con lo que dibuja cada uno, búsqueda por letras en orden, llaves y cursor en su sitio, pares de paréntesis que crecen; página en la tienda e icono.
