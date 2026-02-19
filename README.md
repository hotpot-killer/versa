# Versa AI Toolkit 🚀

[English](#english) | [中文](#chinese)

<a name="english"></a>
## English

Versa is a premium, AI-powered productivity toolkit designed to streamline modern professional workflows. From extract professional weekly reports to polishing business emails and generating viral social media copy, Versa transforms raw information into high-value outputs using state-of-the-art AI models.

![Versa AI Preview](https://via.placeholder.com/1200x600?text=Versa+AI+Toolkit+UI+Preview) <!-- Replace with actual screenshot when available -->

### ✨ Core Features

| Feature | Description |
| :--- | :--- |
| **Weekly Expert** | Converts scattered work fragments into professional, result-oriented weekly reports with persona-based wording. |
| **Copy Workshop** | Deeply understands Chinese social media algorithms to create viral "Little Red Book" (小红书) style content. |
| **Email Consultant** | Polishes rough drafts into elegant, professional business correspondence. |
| **Meeting Archive** | Distills complex meeting notes into concise summaries, key decisions, and actionable items. |
| **Privacy Guard** | Integrated data masking for sensitive information like emails and phone numbers. |
| **Shared Archive** | Persistent history of all AI generations for easy retrieval and collaboration. |

### 🛠️ Technical Stack

- **Frontend:** React 19, Vite, TailwindCSS (v4), Framer Motion, Lucide Icons.
- **Backend:** FastAPI (Python), SQLAlchemy, SQLite.
- **AI Engine:** DeepSeek-Chat / OpenAI API integration with streaming support.
- **Design:** Modern, minimalist "premium tool" aesthetic with light-theme optimization.

### 🚀 Getting Started

#### Prerequisites
- Python 3.10+
- Node.js 18+
- [DeepSeek](https://www.deepseek.com/) or OpenAI API Key

#### Backend Setup
1. Clone the repository and navigate to the root directory.
2. Create a `.env` file from the template:
   ```env
   DEEPSEEK_API_KEY=your_api_key_here
   DEEPSEEK_BASE_URL=https://api.deepseek.com
   DEEPSEEK_MODEL=deepseek-chat
   ```
3. Install dependencies:
   ```bash
   pip install -r pyproject.toml # Or use uv: uv sync
   ```
4. Start the API server:
   ```bash
   python main.py
   ```

#### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

#### 🛡️ Privacy & Security
Versa includes a built-in masking layer that automatically redacts sensitive data (Phone numbers, Emails) before sending requests to the AI engine, ensuring your data stays protected.

---

<a name="chinese"></a>
## 中文

Versa 是一款基于 AI 的高端生产力工具集，旨在简化现代职业工作流。从提炼专业的周报，到润色商务邮件，再到生成爆款社交媒体文案，Versa 利用最先进的 AI 模型将零散信息转化为高价值产出。

### ✨ 核心功能

| 功能 | 描述 |
| :--- | :--- |
| **周报专家** | 将零散的工作片段提炼为专业、结果导向的周报，支持身份化表达。 |
| **文案工坊** | 深度理解小红书推荐算法，创作极具爆款潜力的社交媒体笔记。 |
| **邮件顾问** | 将口语化的草稿润色为得体、专业的商务邮件。 |
| **会议归档** | 从杂乱的会议记录中提取核心决策、待办事项和简报。 |
| **隐私卫士** | 内置敏感信息脱敏功能，自动识别并屏蔽邮箱、电话等私密数据。 |
| **共享档案** | 持久化存储所有 AI 生成结果，方便随时追溯与协作。 |

### 🛠️ 技术栈

- **前端:** React 19, Vite, TailwindCSS (v4), Framer Motion, Lucide Icons.
- **后端:** FastAPI (Python), SQLAlchemy, SQLite.
- **AI 引擎:** 集成 DeepSeek-Chat / OpenAI API，支持流式输出。
- **设计:** 现代极简“高端工具”审美，针对浅色主题深度优化。

### 🚀 快速上手

#### 准备工作
- Python 3.10+
- Node.js 18+
- [DeepSeek](https://www.deepseek.com/) 或 OpenAI API Key

#### 后端配置
1. 克隆仓库并进入根目录。
2. 在根目录创建 `.env` 文件：
   ```env
   DEEPSEEK_API_KEY=你的API密钥
   DEEPSEEK_BASE_URL=https://api.deepseek.com
   DEEPSEEK_MODEL=deepseek-chat
   ```
3. 安装依赖：
   ```bash
   pip install -r pyproject.toml # 或使用 uv: uv sync
   ```
4. 启动后端服务：
   ```bash
   python main.py
   ```

#### 前端配置
1. 进入 `frontend` 目录：
   ```bash
   cd frontend
   ```
2. 安装依赖：
   ```bash
   npm install
   ```
3. 启动开发服务器：
   ```bash
   npm run dev
   ```

#### 🛡️ 隐私与安全
Versa 内置脱敏层，在向 AI 引擎发送请求前会自动屏蔽敏感数据（如电话、邮箱），确保您的信息安全。

## 📄 License
MIT License. See `LICENSE` for more information.

---
Built with ❤️ for productive professionals.
