from scipy.spatial.distance import cdist
import numpy as np

def get_mean_cosine_sim(embs: np.ndarray):
    return (1 - cdist(embs, embs, metric='cosine')).mean()

def get_consistency(responses: list[str], embedder):
    embs = embedder.embed(responses)
    return get_mean_cosine_sim(embs)


TRANSFORMS = [
    'lowercase',
    'uppercase',
    'shuffle',
    'french',
    'german',
    'chinese',
    'russian',
    'use long and flowery words, but keep the meaning the same',
    'use short words (ie, 3rd grade reading level or simple english wikipedia)',
]