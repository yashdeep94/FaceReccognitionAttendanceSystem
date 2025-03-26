from django.contrib import admin
from .models import *

admin.site.register(AdminUser)
admin.site.register(StudentUser)
admin.site.register(Subject)
admin.site.register(ClassRoom)
admin.site.register(Lecture)
admin.site.register(Standard)