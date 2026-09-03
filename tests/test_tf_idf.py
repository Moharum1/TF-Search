import unittest
from tf_search.Dict_maker import Domain_Frequency, TF_IDF, Term_Frequency

class TestTF(unittest.TestCase):    
    def test_TF_empty_string(self):
        text = ""
        expected_output = {}
        self.assertEqual(Term_Frequency(text), expected_output)

    def test_TF_single_word(self):
        text = "hello"
        expected_output = {"hello": 1}
        self.assertEqual(Term_Frequency(text), expected_output)

    def test_TF_case_insensitivity(self):
        text = "Hello hello HELLO"
        expected_output = {"hello": 3}
        self.assertEqual(Term_Frequency(text), expected_output)

    def test_TF_with_punctuation(self):
        text = "hello, world! hello."
        expected_output = {"hello": 2, "world": 1}
        self.assertEqual(Term_Frequency(text), expected_output)


class TestDomainFrequency(unittest.TestCase):
    def test_DF_empty_list(self):
        texts = []
        expected_output = {}
        self.assertEqual(Domain_Frequency(texts), expected_output)

    def test_DF_single_text(self):
        texts = [{"hello": 1, "world": 1}]
        expected_output = {"hello": 1, "world": 1}
        self.assertEqual(Domain_Frequency(texts), expected_output)

    def test_DF_multiple_texts(self):
        texts = [{"hello": 1, "world": 1}, {"hello": 1, "again": 1}]
        expected_output = {"hello": 2, "world": 1, "again": 1}
        self.assertEqual(Domain_Frequency(texts), expected_output)


class TestTFIDF(unittest.TestCase):
    def test_TF_IDF_multiple_texts(self):
        texts = [{"hello": 2, "world": 1}, {"hello": 1, "again": 1}]
        self.assertEqual(TF_IDF("hello", texts), [2 / 3, 1 / 2])

    def test_TF_IDF_phrase_uses_matching_terms(self):
        texts = [{"hello": 2, "world": 1}, {"goodbye": 1}]
        self.assertAlmostEqual(TF_IDF("hello world", texts)[0], 1.4054651081)
        self.assertEqual(TF_IDF("hello world", texts)[1], 0.0)

    def test_TF_IDF_absent_word_scores_zero(self):
        texts = [{"hello": 2}, {"hello": 1}]
        self.assertEqual(TF_IDF("missing", texts), [0.0, 0.0])