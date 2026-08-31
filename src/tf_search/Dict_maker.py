import math


def Term_Frequency(text: str) -> dict[str, int]:
    """
        Calculate the Domain Frequency of the Words inside a Text.
        text : The text to apply the TF algorithm.
        return :
            - A dictionary with the text and its number of occurrences.
    """
    word_count: dict[str, int] = {}

    for punctuation in [".", ",", "!", "?", ";", ":", "'", '"', "(", ")", "[", "]", "{", "}"]:
        text = text.replace(punctuation, " ")
    text = text.lower().split()

    for word in text:
        if word in word_count:
            word_count[word] += 1
        else:
            word_count[word] = 1
    return word_count


def Domain_Frequency(texts: list[str]) -> dict[str, int]:
    """
        Calculate the Domain Frequency of the Words across multiple texts.
        texts : The texts to apply the DF algorithm.
        return :
            - A dictionary with the term and the number of documents it appears in.
    """
    domain_count: dict[str, int] = {}

    for text in texts:
        word_count = Term_Frequency(text)
        for word in word_count:
            if word in domain_count:
                domain_count[word] += 1
            else:
                domain_count[word] = 1
    return domain_count



def IDF(word : str, docs : dict[str, int], total_documents : int) -> float:
    """
        Calculate the Inverse Domain Frequence of the Words inside a Text
        docs : The documents to apply the IDF algorithm
        total_documents : The total number of documents
        return :
            - float : The IDF value of the word
    """
    return math.log(total_documents / docs.get(word, 1))

def TF(word : str, doc : dict[str, int], total_words : int) -> float:
    """
        Calculate the Term Frequence of the Words inside a Text
        doc : The document to apply the TF algorithm
        total_words : The total number of words in the document
        return :
            - float : The TF value of the word
    """
    return doc.get(word, 0) / total_words if total_words > 0 else 0.0

def TF_IDF(word : str, texts : list[str]) -> dict[str, float]:
    """
        Calculate the TF-IDF of the Words inside a Text
        texts : The texts to apply the TF-IDF algorithm
        return :
            - A Dictionary with the Text and it's TF-IDF value
    """

    tf_idf = {}
    document_count = Domain_Frequency(texts)
    total_documents = len(texts)

    for text in texts:
        tf = TF(word, Term_Frequency(text), sum(Term_Frequency(text).values()))
        idf = IDF(word, document_count, total_documents)
        tf_idf[text] = tf * idf

    return tf_idf