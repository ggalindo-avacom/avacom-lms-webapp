from django.urls import path

from apps.courses.presentation.views import (ActivityCreateView, ActivityDetailView, CourseDetailView, CourseListCreateView,
    ModuleCreateView, ModuleDetailView, ResourceCreateView, ResourceDetailView, UnitCreateView, UnitDetailView)

urlpatterns = [
    path("courses/", CourseListCreateView.as_view(), name="course-list"),
    path("courses/<uuid:course_id>/", CourseDetailView.as_view(), name="course-detail"),
    path("courses/<uuid:course_id>/modules/", ModuleCreateView.as_view(), name="module-create"),
    path("course-modules/<uuid:module_id>/", ModuleDetailView.as_view(), name="module-detail"),
    path("course-modules/<uuid:module_id>/units/", UnitCreateView.as_view(), name="unit-create"),
    path("learning-units/<uuid:unit_id>/", UnitDetailView.as_view(), name="unit-detail"),
    path("learning-units/<uuid:unit_id>/activities/", ActivityCreateView.as_view(), name="activity-create"),
    path("learning-activities/<uuid:activity_id>/", ActivityDetailView.as_view(), name="activity-detail"),
    path("learning-activities/<uuid:activity_id>/resources/", ResourceCreateView.as_view(), name="resource-create"),
    path("activity-resources/<uuid:resource_id>/", ResourceDetailView.as_view(), name="resource-detail"),
]

