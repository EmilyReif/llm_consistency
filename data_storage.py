import os
import json
import pandas as pd

DATA_DIR = "data"

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


def load_or_create_pd_from_csv(filepath: str):
    df = pd.DataFrame()
    if os.path.exists(filepath):
        print(f"Loading from cached file: {filepath}")
        with open(filepath, "r") as fp:
            df = pd.read_csv(fp)
    return df

def save_csv(df, filepath: str):
    df.to_csv(filepath, index=False)  
    print(f"saved to {filepath}")

def get_original_data_filename():
    return os.path.join(DATA_DIR, "truthfulQA-alldata.csv")


# Specific file loading/saving

# Parallel dataset.
PARALLEL_DATA_DICT_FILE = os.path.join(DATA_DIR, "parallel_dataset.json")
def load_or_create_parallel_data_dict():
    return load_or_create_dict(PARALLEL_DATA_DICT_FILE)


def save_parallel_data_dict(data_dict):
    save_dict(data_dict, PARALLEL_DATA_DICT_FILE)

# Many generations per input.
MULT_GENERATIONS_FILENAME = os.path.join(DATA_DIR, "multiple_generations_all_keys.json")
def load_or_create_multi_generations():
    return load_or_create_dict(MULT_GENERATIONS_FILENAME)


def save_multi_generations(generations_dict):
    save_dict(generations_dict, MULT_GENERATIONS_FILENAME)

# All stats
STATS_AND_DATASET_PATH = os.path.join(DATA_DIR, 'stats_dataset.json')
def load_or_create_stats():
    return load_or_create_dict(STATS_AND_DATASET_PATH)

def save_stats(stats_and_dataset_dict):
    save_dict(stats_and_dataset_dict, STATS_AND_DATASET_PATH)


# (at most) 10 paraphrases of each original example
PARAPHRASE_DICT = os.path.join(DATA_DIR, "paraphrases.json")
def load_or_create_paraphrases():
    return load_or_create_dict(PARAPHRASE_DICT)

def save_paraphrases(paraphrases):
    save_dict(paraphrases, PARAPHRASE_DICT)


# 10 paraphrases of each original example
PARAPHRASE_ONE_OUTPUT_PER_INPUT_DICT = os.path.join(DATA_DIR, "paraphrases_outputs.json")
def load_or_create_paraphrase_outputs():
    return load_or_create_dict(PARAPHRASE_ONE_OUTPUT_PER_INPUT_DICT)

def save_paraphrase_outputs(outputs):
    save_dict(outputs, PARAPHRASE_ONE_OUTPUT_PER_INPUT_DICT)


# 10 paraphrases of each original example
STATS = os.path.join(DATA_DIR, "all_data.csv")
def load_or_create_stats_csv():
    return load_or_create_pd_from_csv(STATS)

def save_stats_csv(df):
    save_csv(df, STATS)
