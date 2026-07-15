from rest_framework import serializers

from apps.courses.infrastructure.models import ActivityResource, Course, CourseModule, LearningActivity, LearningUnit


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("id", "code", "title", "description", "status", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class CourseModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseModule
        fields = ("id", "title", "description", "position", "is_visible", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class LearningUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningUnit
        fields = ("id", "title", "description", "position", "is_visible", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class ActivityResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityResource
        fields = ("id", "title", "resource_type", "file", "external_url", "launch_path", "mime_type", "position", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class LearningActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningActivity
        fields = ("id", "title", "description", "activity_type", "position", "is_visible", "is_required", "completion_mode", "minimum_progress", "minimum_score", "estimated_duration_minutes", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class ActivityDetailSerializer(LearningActivitySerializer):
    resources = ActivityResourceSerializer(many=True, read_only=True)

    class Meta(LearningActivitySerializer.Meta):
        fields = LearningActivitySerializer.Meta.fields + ("resources",)


class UnitDetailSerializer(LearningUnitSerializer):
    activities = ActivityDetailSerializer(many=True, read_only=True)

    class Meta(LearningUnitSerializer.Meta):
        fields = LearningUnitSerializer.Meta.fields + ("activities",)


class ModuleDetailSerializer(CourseModuleSerializer):
    units = UnitDetailSerializer(many=True, read_only=True)

    class Meta(CourseModuleSerializer.Meta):
        fields = CourseModuleSerializer.Meta.fields + ("units",)


class CourseDetailSerializer(CourseSerializer):
    modules = ModuleDetailSerializer(many=True, read_only=True)

    class Meta(CourseSerializer.Meta):
        fields = CourseSerializer.Meta.fields + ("modules",)

