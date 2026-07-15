from dataclasses import dataclass
from uuid import UUID


@dataclass(frozen=True)
class CourseData:
    title: str
    description: str
    code: str
    status: str
    id: UUID | None = None

