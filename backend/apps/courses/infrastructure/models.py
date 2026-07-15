import uuid

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class TimestampedModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Course(TimestampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    code = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)

    class Meta:
        ordering = ("title",)

    def __str__(self) -> str:
        return f"{self.code} - {self.title}"


class CourseModule(TimestampedModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="modules")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    position = models.PositiveIntegerField()
    is_visible = models.BooleanField(default=True)

    class Meta:
        ordering = ("position",)
        constraints = [models.UniqueConstraint(fields=("course", "position"), name="unique_module_position_per_course")]

    def __str__(self) -> str:
        return f"{self.course.code} / {self.position}. {self.title}"


class LearningUnit(TimestampedModel):
    module = models.ForeignKey(CourseModule, on_delete=models.CASCADE, related_name="units")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    position = models.PositiveIntegerField()
    is_visible = models.BooleanField(default=True)

    class Meta:
        ordering = ("position",)
        constraints = [models.UniqueConstraint(fields=("module", "position"), name="unique_unit_position_per_module")]

    def __str__(self) -> str:
        return f"{self.module} / {self.position}. {self.title}"


class LearningActivity(TimestampedModel):
    class ActivityType(models.TextChoices):
        LESSON = "lesson", "Lesson"
        VIDEO = "video", "Video"
        DOCUMENT = "document", "Document"
        QUIZ = "quiz", "Quiz"
        ASSIGNMENT = "assignment", "Assignment"
        SCORM = "scorm", "SCORM"
        EXTERNAL_LINK = "external_link", "External link"

    class CompletionMode(models.TextChoices):
        MANUAL = "manual", "Manual"
        VIEW = "view", "View"
        PROGRESS = "progress", "Progress"
        SCORE = "score", "Score"

    unit = models.ForeignKey(LearningUnit, on_delete=models.CASCADE, related_name="activities")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    activity_type = models.CharField(max_length=20, choices=ActivityType.choices)
    position = models.PositiveIntegerField()
    is_visible = models.BooleanField(default=True)
    is_required = models.BooleanField(default=False)
    completion_mode = models.CharField(max_length=20, choices=CompletionMode.choices, default=CompletionMode.MANUAL)
    minimum_progress = models.PositiveSmallIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    minimum_score = models.PositiveSmallIntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    estimated_duration_minutes = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ("position",)
        constraints = [models.UniqueConstraint(fields=("unit", "position"), name="unique_activity_position_per_unit")]

    def __str__(self) -> str:
        return f"{self.unit} / {self.position}. {self.title}"


class ActivityResource(TimestampedModel):
    class ResourceType(models.TextChoices):
        HTML = "html", "HTML"
        VIDEO = "video", "Video"
        AUDIO = "audio", "Audio"
        PDF = "pdf", "PDF"
        IMAGE = "image", "Image"
        FILE = "file", "File"
        URL = "url", "URL"

    activity = models.ForeignKey(LearningActivity, on_delete=models.CASCADE, related_name="resources")
    title = models.CharField(max_length=255)
    resource_type = models.CharField(max_length=10, choices=ResourceType.choices)
    file = models.FileField(upload_to="course_resources/", null=True, blank=True)
    external_url = models.URLField(blank=True)
    launch_path = models.CharField(max_length=500, blank=True)
    mime_type = models.CharField(max_length=100, blank=True)
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ("position",)
        constraints = [models.UniqueConstraint(fields=("activity", "position"), name="unique_resource_position_per_activity")]

    def __str__(self) -> str:
        return f"{self.activity} / {self.position}. {self.title}"

