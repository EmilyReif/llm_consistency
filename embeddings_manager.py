from sentence_transformers import SentenceTransformer
from sentence_transformers import util
import numpy as np
import os

class Embedder():
    def __init__(self, name):
        self.name = name
        self.embedder = SentenceTransformer(self.name)

        # Load or create the cache.
        self.cache_file = self.get_cache_name()
        # TODO(ereif): Add limit to the cache (LRU).
        self.cache = self.load_or_init_cache()
        print('🚗 Initialized embedder')

    def get_cache_name(self):
        sanitized_name = self.name.replace('/', '_____')
        return f'cache_{sanitized_name}'
    
    def load_or_init_cache(self):
        file_path = self.cache_file
        if os.path.exists(file_path):
            print(f'🚗 Cache file already exists. Loading from: {file_path}')
            return np.load(file_path, allow_pickle=True)[()]
        else:
            print(f'🚗 Cache file did not exist ({file_path})')
            return {}
        
    def save_cache(self):
        file_path = self.cache_file
        with open(file_path, 'wb') as f:
            print(f'🚗 Writing cache to: {file_path}')
            np.save(f, self.cache)

    def embed(self, examples: list[str]) -> np.ndarray:
        '''Embed a set of examples, some of which may be cached already'''

        # Collect precached embeddings.
        embeddings_dict = {}
        to_calculate = []
        for example in examples:
            if example in self.cache.keys():
                embeddings_dict[example] = self.cache[example]
            else:
                to_calculate.append(example)

        # Embed the new ones.
        if len(to_calculate) > 0:
            embeddings = self.embedder.encode(to_calculate,
                show_progress_bar=True,
                convert_to_tensor=True).cpu().numpy()
            for emb, example in zip(embeddings, to_calculate):
                embeddings_dict[example] = emb
                self.cache[example] = emb

        # Reorder all embeddings in the original order they were given.
        ordered_embeddings = []
        for example in examples:
            ordered_embeddings.append(embeddings_dict[example])
        
        # ordered_embeddings = util.normalize_embeddings(ordered_embeddings)
        return np.array(ordered_embeddings)
