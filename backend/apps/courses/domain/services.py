from apps.courses.domain.exceptions import DomainValidationError


def validate_activity_completion(completion_mode: str, minimum_score: int | None) -> None:
    if completion_mode == "score" and minimum_score is None:
        raise DomainValidationError("minimum_score is required when completion_mode is score.", field="minimum_score")


def validate_resource(resource_type: str, file: object | None, external_url: str) -> None:
    has_file = bool(file)
    has_url = bool(external_url)
    if has_file == has_url:
        raise DomainValidationError("Provide exactly one of file or external_url.", field="file")
    if resource_type == "url" and not has_url:
        raise DomainValidationError("external_url is required for URL resources.", field="external_url")
    if resource_type != "url" and not has_file:
        raise DomainValidationError("file is required for non-URL resources.", field="file")

