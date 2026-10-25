---
name: dialogue
description: >-
  Polishes dialogue in fiction and scripts: speech punctuation and quotation marks
  by the language's conventions (“”, 「」, raya, guillemets, „“, тире), speech tags
  and action beats, one speaker per paragraph, natural speech. Use when asked to
  fix or improve dialogue or its punctuation (对话/对白, 会話文・台詞, 대사,
  diálogo, dialogues, Dialog, диалог).
license: MIT
metadata:
  textus-version: "1.0.0"
  textus-invocation: "both"
  textus-category: "write"
  textus-modes: "write"
  textus-packs: "contract craft#fiction standards#dialogue"
  textus-sources: "Our own text. Dialogue rules summarised from GB/T 15834, the Taiwan MOE handbook, JLReq (W3C), 한글 맞춤법 문장 부호, RAE DPD, OQLF, Amtliches Regelwerk 2024 (CC BY 4.0), Правила 1956 and Ciberdúvidas."
  textus-label-en: "Polish dialogue"
  textus-hint-en: "Fix dialogue punctuation and speech tags for the document's language"
  textus-aliases-en: "dialog"
  textus-label-zh: "对话润色"
  textus-hint-zh: "按文档语言的规范理顺对话的标点和提示语"
  textus-aliases-zh: "对话润色, 对话, 对白"
  textus-label-zh-Hant: "對話潤飾"
  textus-hint-zh-Hant: "依文件語言的規範整理對話的標點和提示語"
  textus-aliases-zh-Hant: "對話潤飾, 對話, 對白"
  textus-label-ja: "会話文を整える"
  textus-hint-ja: "文書の言語の決まりに沿って、会話文の記号や話者の示し方を整えます"
  textus-aliases-ja: "会話文を整える, 会話文, 台詞"
  textus-label-ko: "대사 다듬기"
  textus-hint-ko: "문서 언어의 규칙에 맞게 대사의 문장 부호와 인용 표현을 바로잡습니다"
  textus-aliases-ko: "대사, 대화문"
  textus-label-es: "Pulir diálogos"
  textus-hint-es: "Corrige la puntuación y los incisos del diálogo según el idioma del documento"
  textus-aliases-es: "diálogo, dialogo"
  textus-label-fr: "Peaufiner les dialogues"
  textus-hint-fr: "Corrige la ponctuation et les incises des dialogues selon la langue du document"
  textus-aliases-fr: "dialogues"
  textus-label-de: "Dialoge überarbeiten"
  textus-hint-de: "Korrigiert Zeichensetzung und Begleitsätze in Dialogen nach der Sprache des Dokuments"
  textus-aliases-de: "dialog"
  textus-label-ru: "Отшлифовать диалог"
  textus-hint-ru: "Исправляет пунктуацию и авторские ремарки в диалогах по нормам языка документа"
  textus-aliases-ru: "диалог"
  textus-label-pt: "Polir diálogos"
  textus-hint-pt: "Corrige a pontuação e as falas do narrador nos diálogos, conforme o idioma do documento"
  textus-aliases-pt: "diálogo, dialogo"
---

# Polish dialogue

## Scope
- The selection; else the dialogue the user names; else the dialogue in the current scene.
- Run check_conventions on the passage first (`heading` or `start_line`/`end_line`) and use its dialogue findings; run it on your draft (`text`) before proposing.

## Two jobs, by request
- **Punctuation** ("fix the punctuation", "只改标点"): normalise to the project's dialogue style, or to the document's majority style when none is set. Every change is mechanical; say which rule in the proposal's reason. Change nothing but punctuation and spacing.
- **Craft** ("improve the dialogue"): tags versus action beats, adverb-heavy tags, a new paragraph for each speaker, rhythm, distinct voices. Keep each character's words unless the user asks for rewrites.
- "Check my dialogue" asks for comments, not edits.

## Do
- Apply the attached dialogue conventions for the document's language exactly: quotation marks and nesting, where the final mark goes, the comma or colon around the tag, capitals after the tag, dashes and ellipses for interruption and trailing off.
- Spanish and Portuguese: the raya or travessão opens each turn; narrator incisos between dashes per the attached rules. Russian: a turn that starts a paragraph begins with "— " and takes no quotes. French: one dash style per document.
- Keep the document's dash style (em, en, ——, ――) and its quote style when it is consistent and valid.
- One proposal per paragraph or contiguous dialogue block.

## Don't
- Change what a character says, beyond punctuation, unless asked; never add lines unless asked.
- Convert straight quotes to curly ones when the document is plain Markdown for code or the project uses straight quotes.
- "Correct" forms the conventions list as valid: Spanish ?». and ?…, Russian ?.., a Korean period dropped consistently inside quotes.

## Deliver
- Write mode: replace proposals, each with a short reason naming the rule.
- Review mode: comments on the lines that need changes, with the corrected line.
- Reply in one or two sentences: what kind of fixes were made, and any line left alone on purpose.
