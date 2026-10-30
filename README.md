# ZoodSle Safari Edition 🧭👁️

> **The Web, Understood Aloud — Safari Edition.**  
> *100% On-Device AI Visual Accessibility for Apple Safari & macOS VoiceOver. Standalone, private, zero cloud tracking.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Safari 16.4+](https://img.shields.io/badge/Safari-16.4%2B%20WebExtension-brightgreen.svg)](https://developer.apple.com/safari/extensions/)
[![macOS VoiceOver](https://img.shields.io/badge/Accessibility-VoiceOver%20Ready-success.svg)](https://www.apple.com/accessibility/mac/vision/)
[![LM Studio](https://img.shields.io/badge/AI%20Engine-LM%20Studio%20Direct-purple.svg)](https://lmstudio.ai)

---

## 🌟 Overview

**ZoodSle Safari Edition** is a standalone Safari WebExtension (Manifest V3) that brings on-device visual accessibility to macOS Safari users. As you browse Facebook, Instagram, Twitter/X, Wikipedia, or news articles, ZoodSle analyzes photos in real time and describes them aloud using natural macOS system speech.

### ⚡ 100% Standalone (No Python Server Required!)
Unlike complex AI setups, **ZoodSle Safari Edition connects directly to LM Studio's local vision model API** (`http://127.0.0.1:1234/v1`). 
* No Python required.
* No command-line servers to keep open.
* Just start LM Studio, open Safari, and browse with full visual accessibility!

---

## ✨ Features

* 🎙️ **VoiceOver & System Speech Optimization:** Deep integration with Apple's natural system voices (Samantha Enhanced, Daniel, Karen, Siri). Features a built-in Safari garbage-collection safeguard so audio never drops mid-sentence.
* ⌨️ **Native Mac Hotkey (`⌥⇧D`):** Press **`Option + Shift + D`** anywhere on any webpage to immediately hear the focused photograph described aloud. Press **`⌥⇧S`** to stop speech instantly.
* 🏷️ **Non-Intrusive Floating Action Badges:** Hovering or tabbing over any photograph displays an accessible action badge with the shortcut indicator.
* 💬 **Follow-Up Interactive Q&A:** Click the ZoodSle extension icon in Safari toolbar to ask follow-up questions about the active photograph (*"What does the text on the badge say?"*).
* 📜 **Automatic Queue (Opt-in):** Scroll naturally while ZoodSle queues newly visible images in a sequential, non-overlapping FIFO speech queue.
* 🛡️ **SSRF & Intranet Protection:** Built-in security validator prevents rogue web requests from accessing private network addresses or internal routers.
* 🔒 **Complete Offline Privacy:** 100% of images are analyzed locally on your Mac. No data ever leaves your computer.

---

## 🚀 Step-by-Step Setup Guide (Day 2 Launch)

### Step 1: Open LM Studio (The AI Engine)
1. Download and install [LM Studio for Mac](https://lmstudio.ai) (Apple Silicon M1/M2/M3/M4 or Intel).
2. Download the vision model **`qwen/qwen3-vl-4b`** (4-bit MLX or GGUF).
3. Under the **Developer** tab, click **Start Server** on port `1234` (`http://127.0.0.1:1234`).

---

### Step 2: Enable Extension Support in Safari
1. Open **Safari** on your Mac.
2. In the top menu bar, click **Safari > Settings...** (or press <kbd>⌘,</kbd>).
3. Go to the **Advanced** tab and check **"Show features for web developers"** (or *"Show Develop menu in menu bar"* on older macOS versions).
4. In the menu bar, click the new **Develop** menu and check **"Allow Unsigned Extensions"**. *(macOS may ask for your password or Touch ID).*

---

### Step 3: Load the Extension into Safari
You can load the pre-compiled extension in `dist/` directly:

#### Method A: Using Safari Develop Menu
1. In Safari, go to **Develop > Extension Builder** or open the Extension Converter.
2. Select the `safari/dist` directory.
3. Click **Run / Install**.
4. Check the box in **Safari > Settings > Extensions** to enable **ZoodSle**.

#### Method B: Standalone Xcode Project (Optional)
If you prefer a native macOS `.app` wrapper in your Applications folder:
```bash
xcrun safari-web-extension-converter safari/dist --project-location ~/Desktop --app-name "ZoodSle Safari"
```
Open the generated Xcode project and press **Run (⌘R)**.

---

### Step 4: Test on Any Website!
1. Go to any website with photos (e.g. [unsplash.com](https://unsplash.com), [wikipedia.org](https://wikipedia.org), or Facebook).
2. Click on or tab to any photograph.
3. Press **`⌥ + ⇧ + D`** (Option + Shift + D).
4. Hear ZoodSle describe the photograph in natural spoken voice!

---

## ⚙️ Extension Settings & Configuration

Click the **ZoodSle** extension icon in Safari or visit its Options page to customize:
* **Speech Rate & Volume:** Adjust reading speed from `0.5x` to `2.0x`.
* **Narration Verbosity:** Choose between **Concise** (2-4 sentences) and **Detailed** (structured layout breakdown).
* **Mac High-Quality Voice Toggle:** Enable preference for Apple's Enhanced / Premium system voices.
* **AI Endpoint:** Defaults to `http://127.0.0.1:1234/v1` (LM Studio Direct). Also supports `http://127.0.0.1:8000` (ZoodSle Python server) if preferred.

---

## 👨‍💻 Creator & Contact

Created with ❤️ by **Suman Luitel** to make visual media accessible to everyone.

* **GitHub:** [@5UM-4N](https://github.com/5UM-4N)
* **X (Twitter):** [@auba9201](https://x.com/auba9201)
* **Feedback & Issues:** [GitHub Issues](https://github.com/5UM-4N/Zoodsle-Safari/issues)

---

## 📄 License

This extension is open-source under the **[MIT License](LICENSE)**.
