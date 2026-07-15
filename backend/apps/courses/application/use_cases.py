from typing import Any
from uuid import UUID

from django.db import transaction

from apps.courses.domain.exceptions import DuplicatePositionError
from apps.courses.domain.repositories import AcademicContentRepository, CourseRepository
from apps.courses.domain.services import validate_activity_completion, validate_resource


class CreateCourseService:
    def __init__(self, repository: CourseRepository) -> None:
        self.repository = repository

    @transaction.atomic
    def execute(self, **values: Any):
        return self.repository.create(**values)


class UpdateCourseService:
    def __init__(self, repository: CourseRepository) -> None:
        self.repository = repository

    @transaction.atomic
    def execute(self, *, course_id: UUID, **values: Any):
        return self.repository.update(course_id, **values)


class DeleteCourseService:
    def __init__(self, repository: CourseRepository) -> None:
        self.repository = repository

    @transaction.atomic
    def execute(self, *, course_id: UUID) -> None:
        self.repository.delete(course_id)


class ContentService:
    entity = ""
    parent_field = ""

    def __init__(self, repository: AcademicContentRepository) -> None:
        self.repository = repository

    @transaction.atomic
    def create(self, *, parent_id: UUID, **values: Any):
        self.repository.get(self.parent_field, parent_id)
        self._validate(values)
        self._validate_position(parent_id, values.get("position"))
        values[f"{self.parent_field}_id"] = parent_id
        return self.repository.create(self.entity, **values)

    @transaction.atomic
    def update(self, *, entity_id: UUID, **values: Any):
        instance = self.repository.get(self.entity, entity_id)
        effective_values = {
            "completion_mode": getattr(instance, "completion_mode", None),
            "minimum_score": getattr(instance, "minimum_score", None),
            "resource_type": getattr(instance, "resource_type", None),
            "file": getattr(instance, "file", None),
            "external_url": getattr(instance, "external_url", ""),
            **values,
        }
        self._validate(effective_values, partial=True)
        if "position" in values:
            self._validate_position(getattr(instance, f"{self.parent_field}_id"), values["position"], entity_id)
        return self.repository.update(self.entity, entity_id, **values)

    @transaction.atomic
    def delete(self, *, entity_id: UUID) -> None:
        self.repository.delete(self.entity, entity_id)

    def _validate_position(self, parent_id: UUID, position: int | None, exclude_id: UUID | None = None) -> None:
        if position is not None and self.repository.position_exists(self.entity, self.parent_field, parent_id, position, exclude_id):
            raise DuplicatePositionError(f"Position {position} is already used within this {self.parent_field}.", field="position")

    def _validate(self, values: dict[str, Any], partial: bool = False) -> None:
        return None


class CreateCourseModuleService(ContentService):
    entity = "module"
    parent_field = "course"


class CreateLearningUnitService(ContentService):
    entity = "unit"
    parent_field = "module"


class CreateLearningActivityService(ContentService):
    entity = "activity"
    parent_field = "unit"

    def _validate(self, values: dict[str, Any], partial: bool = False) -> None:
        validate_activity_completion(values.get("completion_mode", "manual"), values.get("minimum_score"))


class CreateActivityResourceService(ContentService):
    entity = "resource"
    parent_field = "activity"

    def _validate(self, values: dict[str, Any], partial: bool = False) -> None:
        validate_resource(values["resource_type"], values.get("file"), values.get("external_url", ""))
