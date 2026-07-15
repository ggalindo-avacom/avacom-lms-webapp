from typing import Any

from django.db import IntegrityError
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.courses.application.use_cases import (CreateActivityResourceService, CreateCourseModuleService,
    CreateCourseService, CreateLearningActivityService, CreateLearningUnitService, DeleteCourseService, UpdateCourseService)
from apps.courses.domain.exceptions import DomainValidationError, EntityNotFoundError
from apps.courses.infrastructure.repositories import DjangoAcademicContentRepository, DjangoCourseRepository
from apps.courses.presentation.serializers import (ActivityResourceSerializer, CourseDetailSerializer, CourseModuleSerializer,
    CourseSerializer, LearningActivitySerializer, LearningUnitSerializer)


def error_response(code: str, message: str, http_status: int, field: str | None = None) -> Response:
    error: dict[str, Any] = {"code": code, "message": message}
    if field:
        error["field"] = field
    return Response({"error": error}, status=http_status)


class SafeAPIView(APIView):
    def handle_exception(self, exc: Exception) -> Response:
        if isinstance(exc, EntityNotFoundError):
            return error_response("NOT_FOUND", str(exc), status.HTTP_404_NOT_FOUND)
        if isinstance(exc, DomainValidationError):
            return error_response("VALIDATION_ERROR", exc.message, status.HTTP_400_BAD_REQUEST, exc.field)
        if isinstance(exc, IntegrityError):
            return error_response("CONFLICTING_DATA", "A unique value is already in use.", status.HTTP_400_BAD_REQUEST)
        return super().handle_exception(exc)


class CourseListCreateView(SafeAPIView):
    repository = DjangoCourseRepository()

    def get(self, request: Request) -> Response:
        courses = self.repository.list_courses()
        return Response({"data": CourseSerializer(courses, many=True).data, "meta": {"count": courses.count()}})

    def post(self, request: Request) -> Response:
        serializer = CourseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course = CreateCourseService(self.repository).execute(**serializer.validated_data)
        return Response({"data": CourseSerializer(course).data}, status=status.HTTP_201_CREATED)


class CourseDetailView(SafeAPIView):
    repository = DjangoCourseRepository()

    def get(self, request: Request, course_id) -> Response:
        course = self.repository.get_course_detail(course_id)
        return Response({"data": CourseDetailSerializer(course).data})

    def patch(self, request: Request, course_id) -> Response:
        serializer = CourseSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        course = UpdateCourseService(self.repository).execute(course_id=course_id, **serializer.validated_data)
        return Response({"data": CourseSerializer(course).data})

    def delete(self, request: Request, course_id) -> Response:
        DeleteCourseService(self.repository).execute(course_id=course_id)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ContentCreateView(SafeAPIView):
    serializer_class = None
    service_class = None
    parent_kwarg = ""

    def post(self, request: Request, **kwargs) -> Response:
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = self.service_class(DjangoAcademicContentRepository()).create(parent_id=kwargs[self.parent_kwarg], **serializer.validated_data)
        return Response({"data": self.serializer_class(instance).data}, status=status.HTTP_201_CREATED)


class ContentDetailView(SafeAPIView):
    serializer_class = None
    service_class = None
    id_kwarg = ""

    def patch(self, request: Request, **kwargs) -> Response:
        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = self.service_class(DjangoAcademicContentRepository()).update(entity_id=kwargs[self.id_kwarg], **serializer.validated_data)
        return Response({"data": self.serializer_class(instance).data})

    def delete(self, request: Request, **kwargs) -> Response:
        self.service_class(DjangoAcademicContentRepository()).delete(entity_id=kwargs[self.id_kwarg])
        return Response(status=status.HTTP_204_NO_CONTENT)


class ModuleCreateView(ContentCreateView):
    serializer_class, service_class, parent_kwarg = CourseModuleSerializer, CreateCourseModuleService, "course_id"
class ModuleDetailView(ContentDetailView):
    serializer_class, service_class, id_kwarg = CourseModuleSerializer, CreateCourseModuleService, "module_id"
class UnitCreateView(ContentCreateView):
    serializer_class, service_class, parent_kwarg = LearningUnitSerializer, CreateLearningUnitService, "module_id"
class UnitDetailView(ContentDetailView):
    serializer_class, service_class, id_kwarg = LearningUnitSerializer, CreateLearningUnitService, "unit_id"
class ActivityCreateView(ContentCreateView):
    serializer_class, service_class, parent_kwarg = LearningActivitySerializer, CreateLearningActivityService, "unit_id"
class ActivityDetailView(ContentDetailView):
    serializer_class, service_class, id_kwarg = LearningActivitySerializer, CreateLearningActivityService, "activity_id"
class ResourceCreateView(ContentCreateView):
    serializer_class, service_class, parent_kwarg = ActivityResourceSerializer, CreateActivityResourceService, "activity_id"
class ResourceDetailView(ContentDetailView):
    serializer_class, service_class, id_kwarg = ActivityResourceSerializer, CreateActivityResourceService, "resource_id"

