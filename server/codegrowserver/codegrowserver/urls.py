from django.contrib import admin
from django.urls import path

from users.views import UserView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", UserView.as_view(graphiql=True)),
]
