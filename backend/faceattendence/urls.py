from django.urls import path
from . import views

urlpatterns = [
    path('auth/createadminuser/', views.create_admin_user),
    path('studentuser/', views.student_user),
    path('auth/adminlogin/', views.admin_user_login),
    path('auth/studentlogin/', views.student_user_login),
    path('subject/', views.subject),
    path('classroom/', views.classroom),
    path('lecture/', views.lecture),
    path('standard/', views.standard),
    path('recognizeFace/', views.recognize_face),
]