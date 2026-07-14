# AGENTS.md

## 1. Propósito

Este repositorio contiene un pre-MVP de un LMS básico construido con Django REST Framework.

El objetivo principal es validar rápidamente las tecnologías y los stacks propuestos mediante pruebas de concepto, implementando inicialmente CRUD sencillos para entidades principales del LMS.

Aunque el alcance sea pequeño, el código debe mantener una estructura clara, limpia y preparada para evolucionar.

Las prioridades del proyecto son:

- demostrar buenas prácticas de ingeniería
- mantener separación de responsabilidades
- evitar lógica de negocio en las vistas
- facilitar pruebas automatizadas
- permitir que el proyecto crezca sin reescrituras innecesarias
- evitar sobrearquitectura para un pre-MVP

---

## 2. Principios de desarrollo

Todo código generado o modificado debe seguir estas reglas:

1. Las vistas no deben contener lógica de negocio.
2. Los serializers no deben contener reglas complejas del dominio.
3. La lógica de negocio debe vivir en el dominio o en los casos de uso.
4. Los modelos de Django representan persistencia, no toda la lógica del sistema.
5. Las reglas del negocio deben ser probables mediante pruebas unitarias.
6. Las dependencias deben apuntar hacia el dominio.
7. Se debe priorizar código explícito y legible.
8. No crear abstracciones sin una necesidad real.
9. No duplicar validaciones ni reglas de negocio.
10. Cada clase o función debe tener una responsabilidad clara.
11. Los nombres deben expresar intención.
12. Toda nueva funcionalidad debe respetar la estructura existente.

---

## 3. Alcance inicial del LMS

El pre-MVP puede incluir los siguientes módulos:

- usuarios
- cursos
- lecciones
- matrículas
- evaluaciones
- progreso académico

Para la primera prueba de concepto se recomienda empezar con:

- CRUD de cursos
- CRUD de lecciones
- matrícula de estudiantes
- consulta de cursos disponibles

No se deben implementar desde el inicio funcionalidades avanzadas como:

- microservicios
- event sourcing
- CQRS completo
- colas de mensajería
- arquitectura distribuida
- múltiples bases de datos
- patrones innecesarios para el alcance actual

Estas decisiones solo deben incorporarse si el crecimiento real del proyecto las justifica.

---

## 4. Arquitectura DDD simplificada

La arquitectura debe seguir un enfoque DDD ligero.

Cada módulo funcional debe dividirse en las siguientes capas:

```text
apps/
└── courses/
    ├── domain/
    │   ├── entities.py
    │   ├── repositories.py
    │   ├── services.py
    │   └── exceptions.py
    │
    ├── application/
    │   ├── dto.py
    │   └── use_cases.py
    │
    ├── infrastructure/
    │   ├── models.py
    │   ├── repositories.py
    │   └── mappers.py
    │
    ├── presentation/
    │   ├── serializers.py
    │   ├── views.py
    │   └── urls.py
    │
    ├── tests/
    │   ├── unit/
    │   └── integration/
    │
    └── apps.py
```

Para módulos pequeños se permite agrupar algunos archivos, pero no mezclar responsabilidades entre capas.

---

## 5. Reglas de dependencia

Las dependencias deben seguir esta dirección:

```text
presentation
      ↓
application
      ↓
domain

infrastructure
      ↓
domain
```

Reglas obligatorias:

- `domain` no puede importar código de `application`, `presentation` o `infrastructure`.
- `application` puede depender de `domain`.
- `presentation` puede depender de `application`.
- `infrastructure` implementa interfaces definidas en `domain`.
- Las vistas nunca deben consultar directamente el ORM si existe un caso de uso para esa operación.
- Los casos de uso no deben depender de `request`, `Response`, serializers ni clases HTTP.

---

## 6. Capa de dominio

La capa `domain` contiene las reglas principales del negocio.

Debe incluir:

- entidades del dominio
- reglas de negocio
- interfaces de repositorios
- servicios de dominio
- excepciones propias del negocio

Ejemplos de reglas de dominio:

- un curso debe tener título
- un curso no puede publicarse sin contenido
- un estudiante no puede matricularse dos veces en el mismo curso
- una lección debe pertenecer a un curso válido
- una evaluación debe tener una fecha de cierre posterior a la fecha de apertura

El dominio no debe importar:

- Django REST Framework
- serializers
- views
- requests
- responses
- viewsets
- routers
- modelos ORM concretos

---

## 7. Modelos de dominio y modelos ORM

Los modelos de Django pertenecen a la capa de infraestructura.

Ejemplo:

```text
domain/entities.py
```

Contiene una representación del negocio:

```python
from dataclasses import dataclass


@dataclass
class Course:
    id: int | None
    title: str
    description: str
    is_published: bool = False

    def publish(self) -> None:
        if not self.title.strip():
            raise ValueError("A course must have a title.")

        self.is_published = True
```

Ejemplo:

```text
infrastructure/models.py
```

Contiene el modelo de persistencia:

```python
from django.db import models


class CourseModel(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

No se debe copiar automáticamente toda la lógica del dominio dentro del modelo ORM.

Para operaciones simples del CRUD, se permite usar el modelo ORM directamente dentro del repositorio de infraestructura, pero no desde la vista.

---

## 8. Repositorios

Las interfaces de repositorio deben declararse en el dominio.

Ejemplo:

```python
from abc import ABC, abstractmethod

from .entities import Course


class CourseRepository(ABC):

    @abstractmethod
    def create(self, course: Course) -> Course:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, course_id: int) -> Course | None:
        raise NotImplementedError

    @abstractmethod
    def list(self) -> list[Course]:
        raise NotImplementedError

    @abstractmethod
    def update(self, course: Course) -> Course:
        raise NotImplementedError

    @abstractmethod
    def delete(self, course_id: int) -> None:
        raise NotImplementedError
```

La implementación concreta debe ubicarse en infraestructura.

Ejemplo:

```text
infrastructure/repositories.py
```

La implementación puede utilizar:

- Django ORM
- select_related
- prefetch_related
- transacciones
- filtros de consulta

La interfaz del dominio no debe conocer estos detalles.

---

## 9. Casos de uso

Cada operación relevante debe implementarse como un caso de uso.

Ejemplos:

- `CreateCourse`
- `ListCourses`
- `GetCourse`
- `UpdateCourse`
- `DeleteCourse`
- `PublishCourse`
- `EnrollStudent`

Los casos de uso deben:

- recibir datos simples o DTO
- aplicar reglas del dominio
- usar repositorios
- retornar entidades o DTO
- lanzar excepciones claras
- permanecer independientes de HTTP

Ejemplo:

```python
from dataclasses import dataclass

from apps.courses.domain.entities import Course
from apps.courses.domain.repositories import CourseRepository


@dataclass
class CreateCourseInput:
    title: str
    description: str


class CreateCourse:

    def __init__(self, repository: CourseRepository) -> None:
        self.repository = repository

    def execute(self, data: CreateCourseInput) -> Course:
        course = Course(
            id=None,
            title=data.title.strip(),
            description=data.description.strip(),
        )

        if not course.title:
            raise ValueError("The course title is required.")

        return self.repository.create(course)
```

---

## 10. Vistas delgadas

Las vistas deben ser delgadas.

Una vista únicamente debe:

1. recibir la petición HTTP
2. validar el formato de entrada mediante un serializer
3. construir el DTO de entrada
4. ejecutar un caso de uso
5. transformar el resultado a una respuesta HTTP
6. mapear excepciones conocidas a códigos HTTP

Las vistas no deben:

- contener reglas de negocio
- ejecutar cálculos del dominio
- consultar directamente múltiples modelos
- crear flujos complejos con condicionales
- duplicar validaciones
- decidir reglas de permisos del negocio
- contener transacciones
- construir consultas ORM complejas
- enviar correos directamente
- ejecutar tareas de infraestructura

Ejemplo aceptable:

```python
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CreateCourseSerializer
from apps.courses.application.dto import CreateCourseInput
from apps.courses.application.use_cases import CreateCourse
from apps.courses.infrastructure.repositories import DjangoCourseRepository


class CourseCreateView(APIView):

    def post(self, request):
        serializer = CreateCourseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        use_case = CreateCourse(
            repository=DjangoCourseRepository()
        )

        course = use_case.execute(
            CreateCourseInput(**serializer.validated_data)
        )

        return Response(
            {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "is_published": course.is_published,
            },
            status=status.HTTP_201_CREATED,
        )
```

La vista coordina HTTP, pero no decide reglas del negocio.

---

## 11. Serializers

Los serializers deben utilizarse principalmente para:

- validar tipos de datos
- validar campos requeridos
- validar formatos
- serializar respuestas
- convertir datos HTTP a estructuras simples

Los serializers no deben:

- contener lógica extensa del negocio
- ejecutar varios accesos al ORM
- enviar correos
- aplicar flujos de dominio
- reemplazar casos de uso
- contener reglas que deberían existir también fuera de la API

Validaciones simples, como longitud máxima, formato de correo o campo requerido, sí pueden permanecer en el serializer.

---

## 12. ViewSets y Generic Views

Se pueden usar:

- `APIView`
- `GenericAPIView`
- `ViewSet`
- `ModelViewSet`

Para un CRUD muy simple se permite `ModelViewSet`, siempre que:

- no se introduzca lógica de negocio en sus métodos
- las operaciones complejas deleguen en casos de uso
- no se utilice `perform_create` o `perform_update` para ocultar reglas de negocio extensas
- no se acople el dominio directamente al serializer

Cuando una operación tenga reglas específicas, debe implementarse mediante un caso de uso explícito.

---

## 13. Servicios

Usar servicios solo cuando exista una responsabilidad clara.

Tipos permitidos:

### Servicios de dominio

Contienen reglas que involucran varias entidades o que no pertenecen naturalmente a una sola entidad.

### Servicios de aplicación

Coordinan casos de uso o integraciones externas.

No crear clases llamadas genéricamente:

- `Utils`
- `Helpers`
- `Manager`
- `CommonService`

Se deben preferir nombres específicos:

- `EnrollmentPolicy`
- `CoursePublicationService`
- `StudentProgressCalculator`

---

## 14. Manejo de excepciones

Las excepciones del negocio deben definirse en el dominio.

Ejemplo:

```python
class CourseNotFoundError(Exception):
    pass


class CourseAlreadyPublishedError(Exception):
    pass
```

La capa de presentación debe traducirlas a respuestas HTTP.

Ejemplo:

```text
CourseNotFoundError -> 404 Not Found
ValidationError -> 400 Bad Request
PermissionDeniedError -> 403 Forbidden
ConflictError -> 409 Conflict
```

Las excepciones del dominio no deben conocer códigos HTTP.

---

## 15. Transacciones

Las transacciones deben ubicarse en:

- repositorios de infraestructura
- servicios de aplicación
- casos de uso cuando la operación lo requiera

No deben declararse en las vistas.

Usar `transaction.atomic()` cuando una operación modifique varias entidades y deba completarse completamente o revertirse.

---

## 16. Autenticación y permisos

La autenticación puede implementarse con JWT.

Django REST Framework puede encargarse de:

- autenticación
- lectura del usuario autenticado
- permisos HTTP básicos

Las reglas de autorización del negocio deben permanecer en la aplicación o dominio.

Ejemplos:

- solo un instructor propietario puede editar su curso
- un estudiante solo puede consultar sus propias matrículas
- solo un administrador puede eliminar determinados registros

Estas reglas no deben depender exclusivamente de ocultar botones en el frontend.

---

## 17. Convenciones de código

Seguir las siguientes convenciones:

- clases en `PascalCase`
- funciones y variables en `snake_case`
- constantes en `UPPER_SNAKE_CASE`
- nombres en inglés
- nombres descriptivos y sin abreviaciones ambiguas
- tipado en funciones públicas
- imports absolutos dentro del proyecto
- funciones pequeñas
- evitar métodos con múltiples responsabilidades
- evitar comentarios que expliquen código confuso; mejorar primero el código
- agregar docstrings cuando aporten contexto real

No usar nombres genéricos como:

- `data`
- `item`
- `obj`
- `temp`
- `process`
- `handle`

salvo que el contexto sea evidente y muy reducido.

---

## 18. Formato de respuestas API

Las respuestas deben ser consistentes.

Ejemplo de éxito:

```json
{
  "data": {
    "id": 1,
    "title": "Introducción a Python"
  }
}
```

Ejemplo de colección:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Introducción a Python"
    }
  ],
  "meta": {
    "count": 1
  }
}
```

Ejemplo de error:

```json
{
  "error": {
    "code": "COURSE_NOT_FOUND",
    "message": "Course not found."
  }
}
```

No devolver estructuras diferentes para operaciones similares.

---

## 19. Pruebas

Toda regla de negocio debe tener pruebas unitarias.

Estructura recomendada:

```text
tests/
├── unit/
│   ├── test_course_entity.py
│   ├── test_create_course.py
│   └── test_publish_course.py
│
└── integration/
    ├── test_course_repository.py
    └── test_course_api.py
```

Pruebas unitarias:

- entidades
- servicios de dominio
- casos de uso
- validaciones del negocio

Pruebas de integración:

- repositorios con Django ORM
- endpoints
- autenticación
- persistencia
- códigos HTTP

No es necesario probar internamente Django REST Framework.

Se debe probar el comportamiento propio del proyecto.

---

## 20. Flujo para crear una funcionalidad

Al implementar una nueva funcionalidad, seguir este orden:

1. identificar la regla de negocio
2. definir o modificar la entidad de dominio
3. definir la interfaz del repositorio si es necesaria
4. crear el caso de uso
5. implementar el repositorio con Django ORM
6. crear el serializer de entrada o salida
7. crear la vista delgada
8. registrar la URL
9. crear pruebas unitarias
10. crear pruebas de integración

No empezar escribiendo toda la lógica dentro de la vista.

---

## 21. Reglas para CRUD básicos

Para un CRUD básico, cada módulo puede incluir:

- entidad de dominio
- interfaz de repositorio
- repositorio Django
- casos de uso CRUD
- serializers
- vistas
- URLs
- pruebas

Casos de uso mínimos:

```text
CreateEntity
GetEntity
ListEntities
UpdateEntity
DeleteEntity
```

Si una operación no tiene reglas de negocio y es puramente técnica, mantener la implementación sencilla.

No crear múltiples capas adicionales para una operación trivial.

---

## 22. Qué evitar

No generar:

- lógica de negocio en views
- serializers con cientos de líneas
- modelos ORM con responsabilidades no relacionadas
- señales de Django para flujos centrales del negocio
- imports circulares
- clases base genéricas sin necesidad
- repositorios genéricos para todas las entidades
- patrones abstractos difíciles de seguir
- código duplicado
- consultas ORM desde cualquier parte del proyecto
- archivos llamados `utils.py` con lógica heterogénea
- funciones de más de una responsabilidad
- manejo de errores con `except Exception` sin justificación
- valores sensibles hardcodeados
- credenciales dentro del repositorio

---

## 23. Configuración

La configuración debe obtenerse mediante variables de entorno.

Ejemplos:

```text
SECRET_KEY
DEBUG
DATABASE_URL
ALLOWED_HOSTS
CORS_ALLOWED_ORIGINS
JWT_ACCESS_TOKEN_LIFETIME
JWT_REFRESH_TOKEN_LIFETIME
```

No hardcodear:

- secretos
- contraseñas
- hosts de producción
- credenciales
- tokens
- URLs privadas

---

## 24. Criterios de calidad

Antes de considerar una funcionalidad terminada, verificar:

- la vista no contiene lógica de negocio
- el caso de uso tiene una responsabilidad clara
- el dominio no depende de Django REST Framework
- el acceso a datos está encapsulado
- las excepciones son explícitas
- los nombres son claros
- no hay código duplicado
- existen pruebas para las reglas principales
- la API mantiene el formato acordado
- la implementación es proporcional al alcance del pre-MVP

---

## 25. Prioridad del proyecto

Ante varias alternativas, seguir este orden de prioridad:

1. comportamiento correcto
2. claridad
3. simplicidad
4. facilidad de pruebas
5. mantenibilidad
6. rendimiento
7. abstracción

No optimizar prematuramente.

No agregar complejidad para demostrar conocimiento técnico.

El código limpio debe demostrarse mediante decisiones simples, responsabilidades claras y una arquitectura coherente.