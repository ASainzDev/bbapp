# Guía de extracción de listas de equipo

## Procedimiento

1. Busca en `completo.txt` el encabezado `LISTAS DE EQUIPO` y luego el nombre del equipo. El primer equipo con tabla de plantilla en este documento es Amazons.
2. En la página del equipo, transcribe por separado el contexto (equipos famosos, liga y reglas especiales) y cada fila de la tabla.
3. Lee las columnas de jugador en este orden: cantidad, nombre/posición/raza, coste, MV, FU, AG, PS, AR, habilidades y rasgos, habilidades primarias y secundarias. En las propiedades JSON se usan `cantidad`, `nombre`, `posicion`, `raza`, `coste`, `mv`, `fu`, `ag`, `ps`, `ar`, `habilidades_y_rasgos`, `habilidades_primarias` y `habilidades_secundarias`. Se puede añadir `subtipo` cuando la fuente distingue una especie más concreta dentro de una categoría amplia.
4. Conserva los nombres y abreviaturas tal como aparecen impresos. Guarda el coste como entero en M.O.; conserva los valores de atributo con `+` como cadenas (por ejemplo, `"3+"`). Las categorías de habilidades se representan como códigos (G, A, P, F, etc.).
5. Registra las segundas oportunidades y si se permite un apotecario en las propiedades de nivel de equipo `segundas_oportunidades` y `apotecario`. Usa listas vacías para reglas o habilidades que la tabla indique como ninguna.
6. Si una lista impone límites adicionales (por ejemplo, un máximo total de jugadores Grandullones elegibles), anótalos en `restricciones_plantilla` para no perder esa regla.
7. El OCR sirve para encontrar el texto y preparar la transcripción, pero puede mezclar columnas, deformar nombres o confundir cifras. Contrasta las filas con la página escaneada del PDF antes de dar los datos por válidos.
8. Añade `metadata` con `pagina_pdf` (índice de página del archivo PDF, empezando por 1), `pagina_txt` (número de página del texto separado por saltos de página, empezando por 1), `validado` y `faqs_revisadas`. Deja ambos indicadores en `false` mientras cada revisión esté pendiente. `validado: true` significa que el usuario comprobó los datos contra la fuente; `faqs_revisadas: true` indica que se revisaron las FAQs aplicables. Considera el equipo listo cuando ambos sean `true`. `pagina_impresa` puede añadirse como dato auxiliar si el número impreso en el reglamento difiere del índice del PDF.

## Cómo se localizaron los datos de Amazons

- En `completo.txt`, el encabezado y la tabla de Amazons están en la página 168. Se cuenta una página por cada separador de página del archivo.
- En `rulebook.pdf`, la sección está en la página 168 del archivo; el número impreso en la hoja es 160.
- Se usó el OCR para localizar y transcribir la sección, y se revisó visualmente la tabla escaneada del PDF para confirmar filas, atributos y accesos a habilidades. Los datos de este equipo se marcaron como validados tras la comprobación manual.

## Equipo siguiente: Black Orcs

- En `completo.txt`, la lista está en la página 169.
- En `rulebook.pdf`, la sección está en la página 169 del archivo; el número impreso es 161.
- Los datos se transcribieron y contrastaron visualmente con la tabla escaneada, pero permanecen con `validado: false` y `faqs_revisadas: false` hasta la revisión del usuario y la comprobación posterior de FAQs.

## Equipos procesados

El reglamento anuncia 30 listas; en las páginas de listas localizadas entre las páginas impresas 160 y 188 aparecen 29 equipos. La relación de abajo cubre las páginas consecutivas 168–196 del PDF/TXT y conserva el orden del documento.

- Bretonnians: `bretonnians.json`, páginas 170 del PDF y del TXT.
- Chaos Chosen: `chaos_chosen.json`, páginas 171 del PDF y del TXT.
- Chaos Dwarfs: `chaos_dwarfs.json`, páginas 172 del PDF y del TXT.
- Chaos Renegades: `chaos_renegades.json`, páginas 173 del PDF y del TXT.
- Dark Elves: `dark_elves.json`, páginas 174 del PDF y del TXT.
- Dwarfs: `dwarfs.json`, páginas 175 del PDF y del TXT.
- Elven Union: `elven_union.json`, páginas 176 del PDF y del TXT.
- Gnomes: `gnomes.json`, páginas 177 del PDF y del TXT.
- Goblins: `goblins.json`, páginas 178 del PDF y del TXT.
- Halflings: `halflings.json`, páginas 179 del PDF y del TXT.
- Humans: `humans.json`, páginas 180 del PDF y del TXT.
- Imperial Nobility: `imperial_nobility.json`, páginas 181 del PDF y del TXT.
- Khorne: `khorne.json`, páginas 182 del PDF y del TXT.
- Lizardmen: `lizardmen.json`, páginas 183 del PDF y del TXT.
- Necromantic Horror: `necromantic_horror.json`, páginas 184 del PDF y del TXT.
- Norse: `norse.json`, páginas 185 del PDF y del TXT.
- Nurgle: `nurgle.json`, páginas 186 del PDF y del TXT.
- Ogres: `ogres.json`, páginas 187 del PDF y del TXT.
- Old World Alliance: `old_world_alliance.json`, páginas 188 del PDF y del TXT.
- Orcs: `orcs.json`, páginas 189 del PDF y del TXT.
- Shambling Undead: `shambling_undead.json`, páginas 190 del PDF y del TXT.
- Skaven: `skaven.json`, páginas 191 del PDF y del TXT.
- Snotlings: `snotlings.json`, páginas 192 del PDF y del TXT.
- Tomb Kings: `tomb_kings.json`, páginas 193 del PDF y del TXT.
- Underworld Denizens: `underworld_denizens.json`, páginas 194 del PDF y del TXT.
- Vampires: `vampires.json`, páginas 195 del PDF y del TXT.
- Wood Elves: `wood_elves.json`, páginas 196 del PDF y del TXT.

## Nombre de archivo

Guarda cada equipo como un archivo JSON independiente con el nombre del equipo en minúsculas y espacios sustituidos por guiones bajos, por ejemplo `amazons.json` o `black_orcs.json`.
