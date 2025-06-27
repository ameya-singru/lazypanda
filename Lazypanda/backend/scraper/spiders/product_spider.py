import scrapy

class ProductSpider(scrapy.Spider):
    name = "product_spider"
    custom_settings = {'FEEDS': {'items.json': {'format': 'json'}}}

    def __init__(self, query=None, **kwargs):
        super().__init__(**kwargs)
        self.query = query.lower()
        self.start_urls = ["https://books.toscrape.com/"]

    def parse(self, response):
        for p in response.css("article.product_pod"):
            name = p.css("h3 a::attr(title)").get()
            if self.query in name.lower():
                yield {
                    "name": name,
                    "price": p.css(".price_color::text").get(),
                    "url": response.urljoin(p.css("h3 a::attr(href)").get())
                }
        nxt = response.css("li.next a::attr(href)").get()
        if nxt:
            yield response.follow(nxt, self.parse)
