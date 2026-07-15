class DomainValidationError(Exception):
    def __init__(self, message: str, *, field: str | None = None) -> None:
        self.message = message
        self.field = field
        super().__init__(message)


class EntityNotFoundError(Exception):
    pass


class DuplicatePositionError(DomainValidationError):
    pass

