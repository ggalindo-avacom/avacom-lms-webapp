from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import IntegrityError
from django.test import TestCase
from rest_framework.test import APITestCase

from apps.courses.application.use_cases import CreateActivityResourceService, CreateLearningActivityService
from apps.courses.domain.exceptions import DomainValidationError, DuplicatePositionError
from apps.courses.infrastructure.models import ActivityResource, Course, CourseModule, LearningActivity, LearningUnit
from apps.courses.infrastructure.repositories import DjangoAcademicContentRepository


class CourseModelTests(TestCase):
    def setUp(self):
        self.course = Course.objects.create(code="PY-001", title="Python")
        self.module = CourseModule.objects.create(course=self.course, title="Basics", position=1)
        self.unit = LearningUnit.objects.create(module=self.module, title="Variables", position=1)
        self.activity = LearningActivity.objects.create(unit=self.unit, title="Video", activity_type="video", position=1)

    def test_hierarchy_creation_and_cascade(self):
        resource = ActivityResource.objects.create(activity=self.activity, title="External", resource_type="url", external_url="https://example.com", position=1)
        self.assertEqual(resource.activity.unit.module.course, self.course)
        self.course.delete()
        self.assertFalse(ActivityResource.objects.filter(id=resource.id).exists())

    def test_database_rejects_duplicate_position(self):
        with self.assertRaises(IntegrityError):
            CourseModule.objects.create(course=self.course, title="Duplicate", position=1)


class CourseServiceTests(TestCase):
    def setUp(self):
        course = Course.objects.create(code="PY-001", title="Python")
        module = CourseModule.objects.create(course=course, title="Basics", position=1)
        self.unit = LearningUnit.objects.create(module=module, title="Variables", position=1)
        self.activity = LearningActivity.objects.create(unit=self.unit, title="Video", activity_type="video", position=1)
        self.repository = DjangoAcademicContentRepository()

    def test_score_completion_requires_minimum_score(self):
        with self.assertRaises(DomainValidationError):
            CreateLearningActivityService(self.repository).create(parent_id=self.unit.id, title="Exam", activity_type="quiz", completion_mode="score", position=2)

    def test_resource_requires_exactly_one_location(self):
        service = CreateActivityResourceService(self.repository)
        with self.assertRaises(DomainValidationError):
            service.create(parent_id=self.activity.id, title="Invalid", resource_type="url", position=1)
        with self.assertRaises(DomainValidationError):
            service.create(parent_id=self.activity.id, title="Invalid", resource_type="url", file=SimpleUploadedFile("x.txt", b"x"), external_url="https://example.com", position=1)

    def test_service_rejects_duplicate_position(self):
        service = CreateActivityResourceService(self.repository)
        service.create(parent_id=self.activity.id, title="First", resource_type="url", external_url="https://example.com/1", position=1)
        with self.assertRaises(DuplicatePositionError):
            service.create(parent_id=self.activity.id, title="Second", resource_type="url", external_url="https://example.com/2", position=1)


class CourseApiTests(APITestCase):
    def test_complete_course_flow_and_nested_detail(self):
        course_response = self.client.post("/api/courses/", {"code": "PYTHON-001", "title": "Python", "description": "Basic", "status": "published"}, format="json")
        self.assertEqual(course_response.status_code, 201)
        course_id = course_response.data["data"]["id"]
        module_response = self.client.post(f"/api/courses/{course_id}/modules/", {"title": "Fundamentals", "position": 1}, format="json")
        self.assertEqual(module_response.status_code, 201)
        module_id = module_response.data["data"]["id"]
        unit_response = self.client.post(f"/api/course-modules/{module_id}/units/", {"title": "Variables", "position": 1}, format="json")
        self.assertEqual(unit_response.status_code, 201)
        unit_id = unit_response.data["data"]["id"]
        activity_response = self.client.post(f"/api/learning-units/{unit_id}/activities/", {"title": "Intro", "activity_type": "video", "position": 1}, format="json")
        self.assertEqual(activity_response.status_code, 201)
        activity_id = activity_response.data["data"]["id"]
        resource_response = self.client.post(f"/api/learning-activities/{activity_id}/resources/", {"title": "Video", "resource_type": "url", "external_url": "https://example.com/video", "position": 1}, format="json")
        self.assertEqual(resource_response.status_code, 201)
        detail = self.client.get(f"/api/courses/{course_id}/")
        self.assertEqual(detail.status_code, 200)
        self.assertEqual(detail.data["data"]["modules"][0]["units"][0]["activities"][0]["resources"][0]["title"], "Video")

    def test_patch_delete_and_not_found(self):
        created = self.client.post("/api/courses/", {"code": "DELETE-1", "title": "Old"}, format="json")
        course_id = created.data["data"]["id"]
        self.assertEqual(self.client.patch(f"/api/courses/{course_id}/", {"title": "New"}, format="json").status_code, 200)
        self.assertEqual(self.client.delete(f"/api/courses/{course_id}/").status_code, 204)
        self.assertEqual(self.client.get(f"/api/courses/{course_id}/").status_code, 404)

