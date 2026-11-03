# Plantillas

Documentos y fragmentos nuevos a partir de tus plantillas, con fecha, hora y título rellenados.

- **Nuevo desde plantilla…** crea un documento en la carpeta abierta; **Insertar plantilla…** (o `/` en el texto) la pone en el cursor.
- **Guardar como plantilla…** guarda el documento abierto como plantilla.
- En una plantilla, `{{date}}`, `{{time}}` y `{{title}}` se rellenan al usarla. Para empezar hay una de Notas de reunión.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_templates`: Enumera las plantillas de documento del usuario, cada una con su nombre y su Markdown, donde {{date}}, {{time}} y {{title}} se rellenan al usarla.
- `create_from_template`: Crea un documento nuevo en la carpeta abierta a partir de una plantilla del usuario, con {{date}}, {{time}} y {{title}} rellenados. Devuelve su ruta.
<!-- /ai-tools -->
