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



def Domain_Frequency(texts: list[dict[str, int]]) -> dict[str, int]:
    """
        Calculate the Domain Frequency of the Words across multiple texts.
        texts : The texts to apply the DF algorithm.
        return :
            - A dictionary with the term and the number of documents it appears in.
    """
    domain_count: dict[str, int] = {}

    for text in texts:
        for word in text.keys():
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
    if total_documents == 0:
        return 0.0

    return math.log((total_documents + 1) / (docs.get(word, 0) + 1)) + 1

def TF(word : str, doc : dict[str, int], total_words : int) -> float:
    """
        Calculate the Term Frequence of the Words inside a Text
        doc : The document to apply the TF algorithm
        total_words : The total number of words in the document
        return :
            - float : The TF value of the word
    """
    return doc.get(word, 0) / total_words if total_words > 0 else 0.0

def TF_IDF(query : str, texts : list[dict[str, int]]) -> list[float]:
    """
        Calculate the TF-IDF of the query terms across multiple texts.
        texts : The texts to apply the TF-IDF algorithm
        return : A list with one combined TF-IDF value for each text
    """

    tf_idf = []
    document_count = Domain_Frequency(texts)
    total_documents = len(texts)
    query_terms = Term_Frequency(query)

    for text in texts:
        total_words = sum(text.values())
        score = 0.0
        for term in query_terms:
            score += TF(term, text, total_words) * IDF(
                term, document_count, total_documents
            )
        tf_idf.append(score)

    return tf_idf