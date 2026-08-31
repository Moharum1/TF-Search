import unittest
from tf_search.Dict_maker import Term_Frequency, Domain_Frequency

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
        texts = ["hello world"]
        expected_output = {"hello": 1, "world": 1}
        self.assertEqual(Domain_Frequency(texts), expected_output)

    def test_DF_multiple_texts(self):
        texts = ["hello world", "hello again"]
        expected_output = {"hello": 2, "world": 1, "again": 1}
        self.assertEqual(Domain_Frequency(texts), expected_output)