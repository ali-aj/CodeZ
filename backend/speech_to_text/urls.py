from django.urls import path
from . import views

urlpatterns = [
    path('speech-to-text', views.speechToText, name='speech-to-text'),
]
