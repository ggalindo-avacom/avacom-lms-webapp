from django.contrib import admin

from apps.courses.infrastructure.models import ActivityResource, Course, CourseModule, LearningActivity, LearningUnit


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("code", "title", "status", "created_at")
    search_fields = ("code", "title")
    list_filter = ("status",)
    ordering = ("title",)


@admin.register(CourseModule)
class CourseModuleAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "position", "is_visible")
    search_fields = ("title", "course__code", "course__title")
    list_filter = ("is_visible", "course")
    ordering = ("course", "position")


@admin.register(LearningUnit)
class LearningUnitAdmin(admin.ModelAdmin):
    list_display = ("title", "module", "position", "is_visible")
    search_fields = ("title", "module__title", "module__course__code")
    list_filter = ("is_visible",)
    ordering = ("module", "position")


@admin.register(LearningActivity)
class LearningActivityAdmin(admin.ModelAdmin):
    list_display = ("title", "unit", "activity_type", "position", "is_visible", "is_required")
    search_fields = ("title", "unit__title", "unit__module__course__code")
    list_filter = ("activity_type", "completion_mode", "is_visible", "is_required")
    ordering = ("unit", "position")


@admin.register(ActivityResource)
class ActivityResourceAdmin(admin.ModelAdmin):
    list_display = ("title", "activity", "resource_type", "position", "mime_type")
    search_fields = ("title", "activity__title", "activity__unit__module__course__code")
    list_filter = ("resource_type",)
    ordering = ("activity", "position")

