from abc import ABC, abstractmethod
from typing import Any
from uuid import UUID


class CourseRepository(ABC):
    @abstractmethod
    def get_by_id(self, course_id: UUID) -> Any: ...

    @abstractmethod
    def get_by_code(self, code: str) -> Any: ...

    @abstractmethod
    def list_courses(self) -> Any: ...

    @abstractmethod
    def get_course_detail(self, course_id: UUID) -> Any: ...

    @abstractmethod
    def create(self, **values: Any) -> Any: ...

    @abstractmethod
    def update(self, course_id: UUID, **values: Any) -> Any: ...

    @abstractmethod
    def delete(self, course_id: UUID) -> None: ...


class AcademicContentRepository(ABC):
    @abstractmethod
    def get(self, entity: str, entity_id: UUID) -> Any: ...

    @abstractmethod
    def create(self, entity: str, **values: Any) -> Any: ...

    @abstractmethod
    def update(self, entity: str, entity_id: UUID, **values: Any) -> Any: ...

    @abstractmethod
    def delete(self, entity: str, entity_id: UUID) -> None: ...

    @abstractmethod
    def position_exists(self, entity: str, parent_field: str, parent_id: UUID, position: int, exclude_id: UUID | None = None) -> bool: ...

