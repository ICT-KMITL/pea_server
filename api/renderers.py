from rest_framework.renderers import AdminRenderer

class CustomAdminRenderer(AdminRenderer):
    template = 'api/admin.html'