
import requests
import json

def test_generate():
    url = "http://localhost:8000/api/generate"
    data = {
        "taskType": "WEEKLY_REPORT",
        "rawContent": "完成了登录页面，修复了数据库连接 bug，准备了下周的演示"
    }
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Result: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_generate()
