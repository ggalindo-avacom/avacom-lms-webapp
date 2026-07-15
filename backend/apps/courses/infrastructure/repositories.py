from typing import Any
from uuid import UUID

from apps.courses.domain.exceptions import EntityNotFoundError
from apps.courses.domain.repositories import AcademicContentRepository, CourseRepository
from apps.courses.infrastructure.models import ActivityResource, Course, CourseModule, LearningActivity, LearningUnit


class DjangoCourseRepository(CourseRepository):
    def get_by_id(self, course_id: UUID) -> Course:
        return self._get(id=course_id)

    def get_by_code(self, code: str) -> Course:
        return self._get(code=code)

    def _get(self, **lookup: Any) -> Course:
        try:
            return Course.objects.get(**lookup)
        except Course.DoesNotExist as error:
            raise EntityNotFoundError("Course not found.") from error

    def list_courses(self):
        return Course.objects.all()

    def get_course_detail(self, course_id: UUID) -> Course:
        try:
            return Course.objects.prefetch_related("modules__units__activities__resources").get(id=course_id)
        except Course.DoesNotExist as error:
            raise EntityNotFoundError("Course not found.") from error

    def create(self, **values: Any) -> Course:
        return Course.objects.create(**values)

    def update(self, course_id: UUID, **values: Any) -> Course:
        course = self.get_by_id(course_id)
        for field, value in values.items():
            setattr(course, field, value)
        course.save(update_fields=(*values.keys(), "updated_at"))
        return course

    def delete(self, course_id: UUID) -> None:
        self.get_by_id(course_id).delete()


class DjangoAcademicContentRepository(AcademicContentRepository):
    models = {"course": Course, "module": CourseModule, "unit": LearningUnit, "activity": LearningActivity, "resource": ActivityResource}

    def get(self, entity: str, entity_id: UUID):
        model = self.models[entity]
        try:
            return model.objects.get(id=entity_id)
        except model.DoesNotExist as error:
            raise EntityNotFoundError(f"{entity.replace('_', ' ').title()} not found.") from error

    def create(self, entity: str, **values: Any):
        return self.models[entity].objects.create(**values)

    def update(self, entity: str, entity_id: UUID, **values: Any):
        instance = self.get(entity, entity_id)
        for field, value in values.items():
            setattr(instance, field, value)
        instance.save(update_fields=(*values.keys(), "updated_at"))
        return instance

    def delete(self, entity: str, entity_id: UUID) -> None:
        self.get(entity, entity_id).delete()

    def position_exists(self, entity: str, parent_field: str, parent_id: UUID, position: int, exclude_id: UUID | None = None) -> bool:
        query = self.models[entity].objects.filter(**{f"{parent_field}_id": parent_id, "position": position})
        if exclude_id:
            query = query.exclude(id=exclude_id)
        return query.exists()
