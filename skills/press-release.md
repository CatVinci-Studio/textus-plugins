---
name: press-release
description: >-
  Turns notes, an announcement or a draft into a press release: a headline
  that says the news, a lead that answers who, what, when and where, the
  details in order of importance, a quote, and the boilerplate. Use when asked
  for a press release, news release or 新闻稿.
license: MIT
metadata:
  textus-version: "1.0.0"
  textus-invocation: "both"
  textus-category: "write"
  textus-modes: "write"
  textus-label-en: "Press release"
  textus-hint-en: "Turn notes or an announcement into a press release"
  textus-aliases-en: "press release, news release"
  textus-label-zh: "写新闻稿"
  textus-hint-zh: "把笔记或公告写成一篇新闻稿"
  textus-aliases-zh: "新闻稿, 新闻通稿"
  textus-label-zh-Hant: "寫新聞稿"
  textus-hint-zh-Hant: "把筆記或公告寫成一篇新聞稿"
  textus-aliases-zh-Hant: "新聞稿, 新聞通稿"
  textus-label-ja: "プレスリリース"
  textus-hint-ja: "メモや告知をプレスリリースにまとめます"
  textus-aliases-ja: "プレスリリース, 報道発表"
  textus-label-ko: "보도자료"
  textus-hint-ko: "메모나 공지를 보도자료로 씁니다"
  textus-aliases-ko: "보도자료, 언론 보도문"
  textus-label-es: "Nota de prensa"
  textus-hint-es: "Convierte notas o un anuncio en una nota de prensa"
  textus-aliases-es: "nota de prensa, comunicado"
  textus-label-fr: "Communiqué de presse"
  textus-hint-fr: "Transforme des notes ou une annonce en communiqué de presse"
  textus-aliases-fr: "communiqué de presse, communiqué"
  textus-label-de: "Pressemitteilung"
  textus-hint-de: "Macht aus Notizen oder einer Ankündigung eine Pressemitteilung"
  textus-aliases-de: "pressemitteilung, presseinfo"
  textus-label-ru: "Пресс-релиз"
  textus-hint-ru: "Превращает заметки или объявление в пресс-релиз"
  textus-aliases-ru: "пресс-релиз"
  textus-label-pt: "Comunicado de imprensa"
  textus-hint-pt: "Transforma notas ou um anúncio num comunicado de imprensa"
  textus-aliases-pt: "comunicado de imprensa, press release"
---

Write a press release from what the user gives you, in the language they write in.

1. **Headline**: the news itself, in one line of at most twelve words - a fact, not a slogan. A subheading may add the second most important fact.
2. **Dateline and lead**: the city and date (ask for them if the notes have neither, or leave `[City, Date]` for the user to fill), then one paragraph that says who did what, when, where and why it matters.
3. **Body**: the details in order of importance, so the release can be cut from the end. Numbers, dates and names exactly as the notes give them; nothing the notes don't support.
4. **Quote**: one or two sentences from the person the notes name, saying something the facts don't - why it matters, what comes next. If the notes have no quote, write one marked `[Quote to approve]`.
5. **Boilerplate**: "About <organisation>" in two or three sentences, from what the notes say about it, and the press contact if they give one.

Plain words, the third person, no exclamation marks, no "we are thrilled". Propose the release as an edit at the cursor, or replacing the selected notes.
