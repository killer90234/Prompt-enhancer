import httpx
import json
from typing import Dict, Any
from app.core.config import settings
from app.core.exceptions import NVIDIAAPIError


class NVIDIAAPIClient:
    def __init__(self):
        self.base_url = "https://integrate.api.nvidia.com/v1"
        self.api_key = settings.NVIDIA_API_KEY
        self.model = settings.NVIDIA_MODEL

        self.client = httpx.AsyncClient(
            timeout=30.0,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        )



    async def enhance_prompt(self, prompt: str, mode: str) -> Dict[str, Any]:
        
        system_prompt = f"""
You are a world-class Prompt Engineer with deep expertise in AI systems, LLM behavior, and structured prompt design.

Your job is to transform weak or simple user prompts into HIGH-QUALITY, STRUCTURED, and OPTIMIZED prompts.

You MUST follow this framework strictly:

[ROLE]
Define the most suitable expert role for the task

[TASK]
Clearly describe what needs to be done

[CONTEXT]
Add relevant background, assumptions, and situation details

[INPUT]
Rewrite the user’s original prompt clearly

[CONSTRAINTS]
- Avoid vague language
- Be specific and actionable
- Add depth and clarity
- Ensure the prompt is optimized for AI understanding

Mode Behavior:
- creative → add imagination, storytelling, uniqueness
- technical → focus on precision, implementation, details
- concise → keep it short but structured
- standard → balanced clarity and depth

Current mode: {mode}

[OUTPUT FORMAT]
Define exactly how the AI should respond (bullets, JSON, steps, etc.)

[EXAMPLES] (if useful)
Provide 1 short example if it improves clarity

---

Optimization Rules:
- Convert generic prompts into detailed instructions
- Add missing context automatically
- Improve clarity, specificity, and structure
- Make output predictable and high quality
- Do NOT repeat the original prompt without improvement

---

Your output should ONLY be the final optimized prompt.
Do NOT explain anything.
Do NOT add extra commentary.
"""
        
        user_prompt = f"""Rewrite and optimize the following prompt using the structured framework.

User Prompt:
{prompt}
"""
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],
            "temperature": 0.6,
            "top_p": 0.9,
            "max_tokens": 1200
        }

        try:
            url = f"{self.base_url}/chat/completions"

            print(f"DEBUG URL: {url}")
            print(f"DEBUG MODEL: {self.model}")

            response = await self.client.post(url, json=payload)

            print(f"DEBUG STATUS: {response.status_code}")
            print(f"DEBUG TEXT: {response.text}")

            response.raise_for_status()

            try:
                data = response.json()
            except Exception:
                raise NVIDIAAPIError(f"Invalid JSON response: {response.text}")

            return {
                "optimized_prompt": data["choices"][0]["message"]["content"]
            }

        except httpx.HTTPStatusError as e:
            raise NVIDIAAPIError(f"HTTP error: {e.response.text}")
        except NVIDIAAPIError:
            raise
        except Exception as e:
            raise NVIDIAAPIError(str(e))

    async def close(self):
        await self.client.aclose()


nvidia_client = NVIDIAAPIClient()