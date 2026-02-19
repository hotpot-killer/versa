import json

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import init_db, get_db, GenerationHistory
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uvicorn
import re


def mask_sensitive_info(text: str) -> str:
    """Simple data masking for emails and phone numbers."""
    # Mask emails: user@example.com -> u***@example.com
    text = re.sub(r'([a-zA-Z0-9_.+-])([a-zA-Z0-9_.+-]*)@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)', 
                  lambda m: m.group(1) + "***@" + m.group(3), text)
    # Mask phone numbers (generic 11-digit or 7+ digit): 13812345678 -> 138****5678
    text = re.sub(r'(\d{3})\d{4}(\d{4})', r'\1****\2', text)
    return text


load_dotenv()
client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)

app = FastAPI(title="Versa AI API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# --- 系统人格设定 ---
PROMPTS = {
    "WEEKLY_REPORT": """你是一位资深大厂项目专家/高级产品经理。你的任务是将用户提供的零散信息，提炼为专业、量化、极简、结果导向的周报。
    
    核心原则：
    1. 零废话：严禁任何解释、说明、过度修饰或语气词。
    2. 忠于事实：仅基于用户输入内容提炼，禁止添加未提及的任务、数据、细节，严禁幻觉。
    3. 量化优先：优先提取输入中的数字、百分比、时间点、结果。
    4. 专业表达：将“做了XX”升级为“完成/推进/落地/优化/上线/交付XX”，突出动作和成果。
    5. 结构与格式：
       严格使用纯文本，禁止 Markdown、禁止表格、禁止特殊符号。结构固定为：
       【本周核心进展】
       （仅列出已达成的关键结果/产出，使用数字序号 1.2.3. 递增排列，用数据说话，突出价值）
       【下周工作计划】
       （仅列出明确的后续执行动作，使用数字序号 1.2.3. 递增排列，明确优先级和目标）
    
    示例：
    输入：
    1. 不同模型文学能力评估 100%
    2. AI文学创作网页转图片API开发 50%
    3. AI文摘需求沟通，多说话人识别处理 80%
    
    输出：
    【本周核心进展】
    1. 完成不同大模型文学创作能力全维度评估，覆盖10+主流模型，输出评估报告。
    2. 推进AI文学创作网页转图片API开发，完成核心渲染逻辑及接口设计，整体进度达50%。
    3. 落地AI文摘多说话人识别处理方案，完成80%核心场景的需求沟通与技术验证。
    
    【下周工作计划】
    1. 完成AI文学创作网页转图片API的剩余开发及联调，计划上线测试。
    2. 推进AI文摘多说话人识别处理的剩余场景验证，完成需求文档输出。""",

    "XHS_STYLE": """你是一位深谙小红书算法的爆款操盘手。请将用户输入内容重构成具备爆款潜力的笔记。
    结构：
    1. [爆款标题]：提供3个不同风格的选项。
    2. [正文逻辑]：包含痛点共鸣、分点叙述（使用数字序号 1. 2. 3. 递增排列，并配 Emoji）、互动结尾。
    3. [标签矩阵]：包含行业大类和流量长尾标签。
    要求：
    1. 严禁出现任何语气化用词或解释性说明。""",

    "EMAIL_POLISH": """你是一位精通职场沟通的资深行政/商务顾问。你的任务是将用户提供的粗糙、口语化的邮件草稿，翻译为专业、得体、礼貌的商务邮件。
    结构：
    1. [邮件主题]：简明扼要且具吸引力。
    2. [正文]：包含称呼、开场白、核心事项、行动建议、结语。
    要求：
    1. 保持专业语调，根据内容自动判断所需的礼貌程度（如：道歉、请求、通知）。""",

    "MEETING_MINUTES": """你是一位极简主义的会议秘书。请从杂乱的会议记录中提取核心决策和待办事项。
    格式要求：
    【会议主题】：(自拟)
    【核心结论】：(分项列出关键决定)
    【行动清单】：(明确 责任人/任务/截止日期，若无责任人则仅列任务)
    要求：
    1. 严禁冗长描述，只保留干货。"""
}


class VersaRequest(BaseModel):
    taskType: str
    rawContent: str
    role: str = None  # Optional role for customization


@app.post("/api/generate")
async def generate(request: VersaRequest, db: Session = Depends(get_db)):
    if request.taskType not in PROMPTS:
        raise HTTPException(status_code=400, detail="Invalid taskType")

    # Data Masking
    masked_content = mask_sensitive_info(request.rawContent)
    
    # Context enhancement for Weekly Report
    system_prompt = PROMPTS[request.taskType]
    if request.taskType == "WEEKLY_REPORT" and request.role:
        system_prompt += f"\n当前用户角色设定：{request.role}。请基于该身份调整表达维度和专业词汇。"

    response = client.chat.completions.create(
        model=os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": masked_content}
        ],
        temperature=0.7
    )

    generated_result = response.choices[0].message.content

    # Try to parse if model still outputs JSON despite instructions
    try:
        import json
        content = json.loads(generated_result)
        if isinstance(content, dict) and "result" in content:
            generated_result = content["result"]
    except:
        pass

    # Clean up any potential markdown headers if the models leaks them
    if isinstance(generated_result, str):
        import re
        generated_result = re.sub(r'^#+\s*', '', generated_result, flags=re.MULTILINE)
        generated_result = re.sub(r'\*\*(.*?)\*\*', r'\1', generated_result)

    # Save to history
    history_entry = GenerationHistory(
        task_type=request.taskType,
        raw_content=request.rawContent,
        generated_result=generated_result
    )
    db.add(history_entry)
    db.commit()

    return {"result": generated_result}

@app.get("/api/history")
async def get_history(db: Session = Depends(get_db)):
    history = db.query(GenerationHistory).order_by(GenerationHistory.created_at.desc()).all()
    import json
    for item in history:
        try:
            # Try to parse if it's a JSON string
            item.generated_result = json.loads(item.generated_result)
        except (json.JSONDecodeError, TypeError):
            # Keep as is if not a JSON string or already processed
            pass
    return history


@app.post("/api/generate_stream")
async def generate_stream(request: VersaRequest, db: Session = Depends(get_db)):
    if request.taskType not in PROMPTS:
        raise HTTPException(status_code=400, detail="Invalid taskType")

    masked_content = mask_sensitive_info(request.rawContent)
    system_prompt = PROMPTS[request.taskType]
    if request.taskType == "WEEKLY_REPORT" and request.role:
        system_prompt += f"\n当前用户角色设定：{request.role}。请基于该身份调整表达维度和专业词汇。"

    async def event_generator():
        full_response = ""
        stream = client.chat.completions.create(
            model=os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": masked_content}
            ],
            temperature=0.7,
            stream=True
        )
        
        for chunk in stream:
            if chunk.choices[0].delta.content:
                content = chunk.choices[0].delta.content
                full_response += content
                yield f"data: {json.dumps({'content': content})}\n\n"
        
        # Save history after stream finishes
        history_entry = GenerationHistory(
            task_type=request.taskType,
            raw_content=request.rawContent,
            generated_result=full_response
        )
        db.add(history_entry)
        db.commit()
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)