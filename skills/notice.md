---
name: notice
description: >-
  Drafts or corrects notices, announcements and official documents in the
  conventions of their language and type, including Chinese 公文 (通知, 请示, 报告,
  函, 纪要), Taiwanese 函, Japanese 公用文 and Korean 공문서: title formula,
  structure, numbering, dates and closing formulas. Use when asked to write or
  fix a notice, circular, request for approval or official letter (公文/通知/请示,
  お知らせ・公用文, 공문/공지, aviso, avis, Bekanntmachung, уведомление).
license: MIT
metadata:
  textus-version: "1.0.0"
  textus-invocation: "both"
  textus-category: "format"
  textus-modes: "write"
  textus-packs: "contract craft#plain standards#official standards#numbers"
  textus-sources: "Our own text. Rules quoted or summarised from 党政机关公文处理工作条例 (2012), GB/T 9704-2012 (summarised), 行政院 文書處理手冊, 公用文作成の考え方 (文化庁), 행정업무의 운영 및 혁신에 관한 규정 시행규칙, Decreto 9.758/2019, Lei 15.263/2025 and GOV.UK (OGL v3.0)."
  textus-label-en: "Notice or official document"
  textus-hint-en: "Draft or fix a notice, announcement or official letter"
  textus-aliases-en: "notice, announcement, memo"
  textus-label-zh: "公文与通知"
  textus-hint-zh: "起草或修改通知、请示等公文"
  textus-aliases-zh: "公文与通知, 公文, 通知, 请示, 函"
  textus-label-zh-Hant: "公文與通知"
  textus-hint-zh-Hant: "起草或修改通知、函、簽等公文"
  textus-aliases-zh-Hant: "公文與通知, 公文, 函, 簽"
  textus-label-ja: "お知らせ・公用文"
  textus-hint-ja: "お知らせや公用文を作成・修正します"
  textus-aliases-ja: "お知らせ・公用文, 公用文, お知らせ"
  textus-label-ko: "공문서·공지"
  textus-hint-ko: "공지나 공문서를 작성하거나 고칩니다"
  textus-aliases-ko: "공문, 공지"
  textus-label-es: "Aviso o documento oficial"
  textus-hint-es: "Redacta o corrige un aviso, un comunicado o un escrito oficial"
  textus-aliases-es: "aviso, comunicado"
  textus-label-fr: "Avis ou document officiel"
  textus-hint-fr: "Rédige ou corrige un avis, une note ou un courrier officiel"
  textus-aliases-fr: "avis, note"
  textus-label-de: "Bekanntmachung oder Amtsschreiben"
  textus-hint-de: "Entwirft oder überarbeitet eine Bekanntmachung oder ein amtliches Schreiben"
  textus-aliases-de: "bekanntmachung, aushang"
  textus-label-ru: "Объявление или официальный документ"
  textus-hint-ru: "Составляет или правит объявление или официальное письмо"
  textus-aliases-ru: "объявление"
  textus-label-pt: "Aviso ou documento oficial"
  textus-hint-pt: "Redige ou corrige um aviso, um comunicado ou um ofício"
  textus-aliases-pt: "aviso, ofício, oficio"
---

# Notice or official document

## Scope
- A new notice from notes or a request; or the notice or official document in the document to fix or check.
- For an official document whose type, direction (to a superior, a peer or the public) or addressee isn't clear, ask once, with the choices in one question.

## Do (every language)
- Purpose first: who, what, when, where, what the reader must do and by when, and whom to contact.
- Headings that outline the content; one matter per document; plain language (attached): must/need/can, short sentences, no hype.
- Dates with the weekday, and times with the time zone where readers may differ.
- Web notices in English (GOV.UK style): title at most 65 characters, a summary at most 160 characters ending with a full stop.

## By language and type (rules in the attached official conventions)
- Simplified Chinese 公文: choose the type by purpose (请示 asks a superior, 报告 reports, 函 goes between bodies, 纪要 records); title = 发文机关 + 关于……的 + 文种, never a mixed type such as 请示报告; 请示 has one matter and closes 妥否，请批示。; a 报告 asks for no approval and closes 特此报告。; 发文字号 such as 〔2026〕9号; dates 2026年10月9日 with no zero padding; levels 一、 （一） 1. （1）. When one document holds two matters, propose splitting it (一文一事).
- Taiwan 函: 主旨, 說明, 辦法; 稱謂, 期望語 and 引敘語 by direction; 國曆 dates; markers 一、 (一) １、 (１). 挪抬 is a convention to offer, never to enforce.
- Japanese 公用文: notices and requests in です・ます; the title states the subject and type (〜について（通知）); numbering 第1 → 1 → （1） → ア; conclusion first.
- Korean 공문서: dates 2026. 10. 14., times 14:30 (never 오후 2시); item symbols 1. → 가. → 1) → 가); a 붙임 line; end with two half-width spaces and 끝.
- Brazilian Portuguese official writing: senhor/senhora only; plain-language techniques of Lei 15.263/2025.

## Don't
- Invent document numbers, dates, addressees, agency names, venues or contacts; ask, or leave the slot for the user to fill and say so.
- Fake layout that Markdown can't hold (fonts, margins, page furniture) with spaces; describe it in the reply. Korean "  끝." is textual and is written.
- Treat conventions such as 挪抬 or 以上 as errors.

## Deliver
- New document: append it. Fix: one replace per part (title, addressee line, body, closing, dates). "Check it": comments, each naming the rule.
- Write mode: the new document, or the fixes to the one there.
- Review mode: the text or the comments.
- Reply in one or two sentences, plus any question about missing facts.
