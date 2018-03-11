import webapp2, json

class InfoEndpoint(webapp2.RequestHandler):
	def get(self):
		self.response.out.write('static only')

app = webapp2.WSGIApplication(
    [
        ('/info', InfoEndpoint),
        
    ],
    debug=True
)