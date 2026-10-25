---
name: continue-story
description: >-
  Writes the next scene or section of a story, novel or script, picking up exactly
  where the text stops, in the author's voice and consistent with the library and
  earlier chapters. Use when asked to continue the story, write the next part or
  chapter, or what happens next (续写/接着写, 続きを書く, 이어서 쓰기, continuar,
  continuer, weiterschreiben, продолжить). Not for non-fiction drafts or for
  questions about inline completion.
license: MIT
metadata:
  textus-version: "1.0.0"
  textus-invocation: "both"
  textus-category: "write"
  textus-modes: "write"
  textus-packs: "contract craft#fiction standards#dialogue standards#ai-tells"
  textus-sources: "Our own text. Ideas from chinese-novelist-skill (MIT) and mattpocock/skills writing-beats (MIT); show vs tell summarised from Wikipedia."
  textus-label-en: "Continue the story"
  textus-hint-en: "Write the next section in your voice, consistent with the library"
  textus-aliases-en: "continue, next-scene"
  textus-label-zh: "接着写"
  textus-hint-zh: "用你的文风写下一节，与资料库保持一致"
  textus-aliases-zh: "接着写, 续写, 写下一节, 下一章"
  textus-label-zh-Hant: "接著寫"
  textus-hint-zh-Hant: "用你的文風寫下一節，與資料庫保持一致"
  textus-aliases-zh-Hant: "接著寫, 續寫, 寫下一節"
  textus-label-ja: "続きを書く"
  textus-hint-ja: "あなたの文体で次の場面を書き、ライブラリの設定と矛盾させません"
  textus-aliases-ja: "続きを書く, 続き"
  textus-label-ko: "다음 장면 쓰기"
  textus-hint-ko: "내 문체로 다음 장면을 쓰고, 라이브러리 설정과 맞춥니다"
  textus-aliases-ko: "이어서 쓰기, 다음 이야기, 이어서쓰기"
  textus-label-es: "Continuar la historia"
  textus-hint-es: "Escribe la siguiente sección con tu voz, fiel a la biblioteca"
  textus-aliases-es: "continuar"
  textus-label-fr: "Continuer l'histoire"
  textus-hint-fr: "Écrit la suite dans votre voix, cohérente avec la bibliothèque"
  textus-aliases-fr: "continuer, suite"
  textus-label-de: "Geschichte fortsetzen"
  textus-hint-de: "Schreibt den nächsten Abschnitt in deinem Ton, passend zum Lexikon"
  textus-aliases-de: "fortsetzen, weiterschreiben"
  textus-label-ru: "Продолжить историю"
  textus-hint-ru: "Пишет следующую часть вашим голосом, в согласии с картотекой"
  textus-aliases-ru: "продолжить, дальше"
  textus-label-pt: "Continuar a história"
  textus-hint-pt: "Escreve a próxima seção com a sua voz, coerente com a biblioteca"
  textus-aliases-pt: "continuar"
---

# Continue the story

## Scope
- Continue from where the text stops, or from the cursor when the request carries one, or from the point the user names ("after the fight").
- Read the current section in full before writing, and the end of the previous one if the scene began there. With a project folder, search other chapters only for a name or event the request mentions that the document doesn't explain, at most twice.

## Do
- Write one section: about 400–800 words, or 600–1,200 Chinese or Japanese characters, unless the user gives a length. Start a new chapter only when asked, with a heading in the document's own chapter style.
- Pick up the exact moment: no recap, no restating the last line, no time skip unless the text was heading there.
- Keep the point of view and tense of the scene. The point-of-view character knows only what they have seen or been told.
- Let something move: a decision, a discovery, a reversal or rising tension. End on a natural pause, or on a hook if the section closes a chapter.
- Render key moments through action, dialogue and concrete sensory detail; use summary for transitions and passing time.
- New detail must agree with the text and the library: names, ages, looks, relationships, places, who knows what.
- Write dialogue in the attached conventions and the quotation style the document already uses. Keep paired …… and —— (or …… and ―― in Japanese) where the language uses them.

## Don't
- Introduce a major character, kill one, or resolve the central conflict unless asked.
- Explain the characters' feelings to the reader after showing them, or end on a moral.
- Use the patterns in the attached AI-tells list.

## Options instead of text
- If the user asks for directions or options, write no section: offer two or three candidate next beats of one or two sentences each, all consistent with the text, and wait for a choice.

## Deliver
- Write mode: one proposal that inserts the section after the last paragraph of the scene (insert_after), or at the cursor (insert_at_cursor) when the message carries one.
- Review mode: the new section in the reply, and a note that Write mode can insert it.
- Reply in one or two sentences saying what happens in the new section.
