from django.http import HttpResponse
from django.urls import path
from django.views.generic import View
from personal.settings import BASE_DIR
import os


class AppView(View):
    """
    Serves the compiled frontend entry point.
    """
    def get(self,request):
        try:
            with open(os.path.join(BASE_DIR, 'geodata','build', 'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse('index.html in build not found', status=501)

urlpatterns = [
    path('', AppView.as_view()),
]