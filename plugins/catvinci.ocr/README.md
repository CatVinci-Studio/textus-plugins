# OCR

Reads scanned PDFs and pictures into Markdown with an OCR model on your own computer. Nothing is sent anywhere else.

- **Convert to Markdown (OCR)**: right-click a PDF or a picture (PNG, JPEG, WebP) in the sidebar, or use the Plugins menu with one open. A picture is read at once; a PDF opens a tab beside that reads it page by page, with a Stop that keeps what was read. The Markdown is written beside the file, with each PDF page marked, and opened.
- Textus AI can read a scanned PDF or a picture of your folder with it when its text can't be read otherwise.

## Setting it up

1. Install [Ollama](https://ollama.com) and start it.
2. The first time you convert, the plugin asks before it downloads the OCR model (Xiaomi-OCR-0, about 1 GB). It is never downloaded without your OK.

Another server works too: set the plugin's **OCR server** to an OpenAI-compatible address (LM Studio, vLLM, llama.cpp) and **OCR model** to its model's name. Desktop only; needs Textus 1.4.3.

OCR can misread: check names, numbers and tables against the original.

## Changes

- **0.1.0** - First version.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `read_with_ocr`: Reads a scanned PDF or a picture (PNG, JPEG, WebP) of the open folder into Markdown with OCR on this computer. Use it when read_file gives a PDF's or a picture's text as empty or garbled. pages: the PDF's page numbers to read, all when left out; a long PDF takes a while per page.
<!-- /ai-tools -->
