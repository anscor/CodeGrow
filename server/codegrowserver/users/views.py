from graphene_django.views import GraphQLView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import BasicAuthentication
from rest_framework.decorators import (
    authentication_classes,
    permission_classes,
    api_view,
)
from rest_framework.settings import api_settings
from rest_framework.request import Request


class UserView(GraphQLView):
    def parse_body(self, request):
        if type(request) is Request:
            return request.data
        return super().parse_body(request)

    @classmethod
    def as_view(cls, *args, **kwargs):
        view = super(UserView, cls).as_view(*args, **kwargs)
        view = permission_classes([IsAuthenticated])(view)
        view = authentication_classes([BasicAuthentication])(view)
        view = api_view(["GET", "POST"])(view)
        return view
