class TrieNode {
    children: { [key: string]: TrieNode } = {};
    numTotalChildren: number;
    isLeaf: boolean;
    parent: TrieNode | null;
    weight: number = 0;

    constructor(parent: TrieNode | null = null) {
        this.children = {};
        this.isLeaf = false;
        this.numTotalChildren = 0;
        this.parent = parent;
    }
}

class Trie {
    root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    insert(sent: string) {
        const words = this.tokenize(sent);
        let node = this.root;

        for (const word of words) {
            if (!node.children[word]) {
                node.children[word] = new TrieNode(node);
            }
            node.isLeaf = false;
            node = node.children[word];
            node.weight += 1;
        }
        if (!Object.keys(node.children).length) {
            node.isLeaf = true;
        }
    }

    insertSents(sents: string[]) {
        for (const sent of sents) {
            this.insert(sent);
        }
        this.computeNumLeafChildren();
    }

    computeNumLeafChildren(node: TrieNode = this.root): number {
        if (node.isLeaf) {
            node.numTotalChildren = 1;
            return 1;
        }

        let count = 0;
        for (const child of Object.values(node.children)) {
            count += this.computeNumLeafChildren(child);
        }
        node.numTotalChildren = count;
        return count;
    }


    tokenize(sent: string) {
        // sent = sent.replace(/[^\w\s\']|_/g, "").replace(/\s+/g, " ").toLowerCase();
        return sent.split(' ');
    }
}

export {Trie, TrieNode}