from mistralai import Mistral
from openai import OpenAI
import numpy as np
import time
from tqdm import tqdm
import asyncio
from openai import AsyncOpenAI
from concurrent.futures import ThreadPoolExecutor
from tqdm.asyncio import tqdm_asyncio  # Supports async progress bars

MAKE_ANSWERS_SHORT = "Make your answers as short as possible. If you can answer in a single word or sentence, do that. If you can answer in a single sentence do that. Only use multiple sentences or paragraphs when it’s necessary to convey the meaning of your answer in longer responses."


class LLM:

    def call(self, text: str, n: int, temp=None):
        pass

    def call_with_ratelimit(self, texts: list[str], n: int, temp=None):
        start = time.time()
        rate_limit = 2

        results = []
        for example in tqdm(texts):
            # For rate limiting.
            s_since_last_generation = time.time() - start
            if s_since_last_generation < rate_limit:
                time.sleep(rate_limit - s_since_last_generation)
            result = self.call(example, n=n, temp=temp)
            start = time.time()

            results.append(result)
        return results

    def translate(self, example: str, language: str):
        text = f"""Translate the following question to {language}. Don't answer the question. Don't add text like "here is the translation". Just pretend you're Google Translate.
        ENGLISH: {example}
        """
        return self.call(text, n=1)[0]

    def style_transfer(self, example: str, style: str):
        text = f"""Here is a sentence:
        ========
        {example}
        ========
        Please rewrite it to be {style}. Just tell me the rewritten sentence-- do not say "here is a rewritten sentence" or use quote marks or anything. Keep the format and punctuation the same unless explicitly requested."""
        return self.call(text, n=1)[0]


class MistralLLM(LLM):
    def __init__(self, name="open-mistral-nemo", api_key=""):
        self.api_key = api_key
        self.name = name
        self.llm = Mistral(api_key=api_key)
        super().__init__()
        print("🚗 Initialized LLM", self.name)

    def call(self, text: str, n: int, temp=None):
        response = self.llm.chat.complete(
            model=self.name,
            messages=[
                {
                    "role": "user",
                    "content": text,
                },
            ],
            max_tokens=50,
            n=n,
            temperature=temp,
        )
        result = [c.message.content for c in response.choices]
        return result


class OpenAILLM(LLM):
    def __init__(self, name="gpt-4o-mini", api_key=""):
        self.api_key = api_key
        self.name = name
        self.llm = OpenAI(api_key=api_key)
        super().__init__()
        print("🚗 Initialized LLM", self.name)

    def call(self, text: str, n: int, temp=None):
        response = self.llm.chat.completions.create(
            model=self.name,
            messages=[
                {"role": "system", "content": "You are a helpful assistant. "},
                {
                    "role": "user",
                    "content": text,
                },
            ],
            max_tokens=50,
            n=n,
            temperature=temp,
        )
        result = [c.message.content for c in response.choices]
        return result


class ConcurrentOpenAILLM(LLM):
    def __init__(self, name="gpt-4o-mini", api_key=""):
        self.api_key = api_key
        self.name = name
        self.async_llm = AsyncOpenAI(api_key=api_key)  # Async version
        self.llm = OpenAI(api_key=api_key)

        super().__init__()
        print("🚗 Initialized LLM", self.name)
        
    def call(self, text: str, n: int, temp=None):
        response = self.llm.chat.completions.create(
            model=self.name,
            messages=[
                {"role": "system", "content": "You are a helpful assistant. "},
                {
                    "role": "user",
                    "content": text,
                },
            ],
            max_tokens=50,
            n=n,
            temperature=temp,
        )
        result = [c.message.content for c in response.choices]
        return result
    
    async def _async_call(self, text: str, n: int, temp=None):
        """Async method to call the API."""
        response = await self.async_llm.chat.completions.create(
            model=self.name,
            messages=[
                {"role": "system", "content": "You are a helpful assistant. "},
                {"role": "user", "content": text},
            ],
            max_tokens=50,
            n=n,
            temperature=temp,
        )
        return [c.message.content for c in response.choices]

    async def call_concurrent(self, texts, n=1, temp=None, max_concurrent=256):
        """Runs multiple API calls concurrently."""
        semaphore = asyncio.Semaphore(max_concurrent)  # Limit concurrent calls

        async def call_with_semaphore(text):
            async with semaphore:
                return await self._async_call(text, n, temp)

        tasks = [asyncio.create_task(call_with_semaphore(text)) for text in texts]
        return await asyncio.gather(*tasks)

    def run_concurrent(self, texts, n=1, temp=None, max_concurrent=256):
        """Runs call_concurrent safely in any environment."""
        loop = asyncio.get_event_loop()
        if loop.is_running():
            return loop.create_task(
                self.call_concurrent(texts, n, temp, max_concurrent)
            )
        else:
            return asyncio.run(self.call_concurrent(texts, n, temp, max_concurrent))

    async def call_batch_async(
        self, texts, batch_size=256, n=1, temp=None, max_concurrent=256
    ):
        """Processes requests in batches with tqdm for tracking progress."""
        results = []

        # Split requests into batches
        batches = [texts[i : i + batch_size] for i in range(0, len(texts), batch_size)]

        for batch in tqdm_asyncio(batches, desc="Processing batches"):
            batch_results = await self.call_concurrent(
                batch, n=n, temp=temp, max_concurrent=max_concurrent
            )
            results.extend(batch_results)  # Collect all results

        return results

    async def call_batch_short_answer(
        self, texts, batch_size=256, n=1, temp=None, max_concurrent=256
    ):
        updated_texts = [f"{text} \n {MAKE_ANSWERS_SHORT}" for text in texts]
        return await self.call_batch_async(
            updated_texts,
            batch_size=batch_size,
            n=n,
            temp=temp,
            max_concurrent=max_concurrent,
        )
