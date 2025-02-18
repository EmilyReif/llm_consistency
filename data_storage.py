import os
import json

DATA_DIR = "data"
PARALLEL_DATA_DICT_FILE = os.path.join(DATA_DIR, "parallel_dataset.json")
MULT_GENERATIONS_FILENAME = os.path.join(DATA_DIR, "multiple_generations_all_keys.json")
STATS_AND_DATASET_PATH = os.path.join(DATA_DIR, 'stats_dataset.json')

def load_or_create_dict(filepath: str):
    new_dict = {}
    if os.path.exists(filepath):
        print(f"Loading from cached file: {filepath}")
        with open(filepath, "r") as fp:
            new_dict = json.load(fp)
    return new_dict


def save_dict(data_dict, filepath: str):
    with open(filepath, "w") as fp:
        json.dump(data_dict, fp)
        print(f"saved to {filepath}")


def get_original_data_filename():
    return os.path.join(DATA_DIR, "truthfulQA-alldata.csv")


def load_or_create_parallel_data_dict():
    return load_or_create_dict(PARALLEL_DATA_DICT_FILE)


def save_parallel_data_dict(data_dict):
    save_dict(data_dict, PARALLEL_DATA_DICT_FILE)


def load_or_create_multi_generations():
    return load_or_create_dict(MULT_GENERATIONS_FILENAME)


def save_multi_generations(generations_dict):
    save_dict(generations_dict, MULT_GENERATIONS_FILENAME)


def load_or_create_stats():
    return load_or_create_dict(STATS_AND_DATASET_PATH)

def save_stats(stats_and_dataset_dict):
    save_dict(stats_and_dataset_dict, STATS_AND_DATASET_PATH)


# 10 paraphrases of each original example
PARAPHRASE_DICT = os.path.join(DATA_DIR, "paraphrases.json")
