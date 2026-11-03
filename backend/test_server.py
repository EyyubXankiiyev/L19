import json
import threading
import unittest
from http.server import ThreadingHTTPServer
from urllib.error import HTTPError
from urllib.request import urlopen

from server import Handler


class ContentApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = f"http://127.0.0.1:{cls.server.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def test_health(self):
        with urlopen(self.base + "/api/health") as response:
            self.assertEqual(json.load(response), {"status": "ok"})

    def test_bilingual_content_and_unicode(self):
        with urlopen(self.base + "/api/content") as response:
            self.assertIn("charset=utf-8", response.headers["Content-Type"])
            data = json.load(response)
            self.assertIn("Tədqiqat", data["az"]["navResearch"])
            for lang in ("az", "en"):
                self.assertEqual(len(data[lang]["research"]), 5)
                self.assertEqual(data[lang]["papersList"], [])

    def test_unknown_api_is_json_404(self):
        with self.assertRaises(HTTPError) as error:
            urlopen(self.base + "/api/missing")
        self.assertEqual(error.exception.code, 404)
        self.assertEqual(json.load(error.exception), {"error": "Not found"})

    def test_content_file_is_not_exposed_by_static_server(self):
        with self.assertRaises(HTTPError) as error:
            urlopen(self.base + "/backend/content.json")
        self.assertEqual(error.exception.code, 404)


if __name__ == "__main__":
    unittest.main()
