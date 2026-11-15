# OCR

用你自己电脑上的 OCR 模型，把扫描版 PDF 和图片读成 Markdown。内容不会发到别处。

- **转成 Markdown（OCR）**：在侧栏里右键 PDF 或图片（PNG、JPEG、WebP），或者打开文件后用插件菜单。图片直接识别；PDF 会在旁边打开一个标签页逐页识别，可以随时停止，已识别的页面会保留。结果写成同名的 Markdown 文件放在原文件旁边（PDF 每页有标记），并自动打开。
- 文件里的文字读不出来时，Textus AI 也能用它读扫描版 PDF 和图片。

## 准备

1. 安装 [Ollama](https://ollama.com) 并启动。
2. 第一次转换时，插件会先问你要不要下载 OCR 模型（Xiaomi-OCR-0，大约 1 GB）。没有你的同意不会下载。

也可以用别的服务：在插件设置里把 **OCR 服务地址** 改成 OpenAI 兼容的地址（LM Studio、vLLM、llama.cpp），**OCR 模型** 填它的模型名。仅桌面版，需要 Textus 1.4.3。

OCR 可能识别错：人名、数字和表格请对照原文检查。

## 更新

- **0.1.0** - 第一版。

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `read_with_ocr`：Reads a scanned PDF or a picture (PNG, JPEG, WebP) of the open folder into Markdown with OCR on this computer. Use it when read_file gives a PDF's or a picture's text as empty or garbled. pages: the PDF's page numbers to read, all when left out; a long PDF takes a while per page.
<!-- /ai-tools -->
