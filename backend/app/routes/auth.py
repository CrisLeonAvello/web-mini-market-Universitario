"""
🔐 Rutas de Autenticación JWT

Este módulo contiene todos los endpoints relacionados con:
- Registro de usuarios
- Inicio de sesión (login)
- Verificación de tokens
- Gestión de sesiones
"""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.auth import UserCreate, UserLogin, UserResponse, Token
from app.auth import (
    authenticate_user, 
    create_access_token, 
    get_password_hash, 
    get_current_user
)
from app.config import settings

router = APIRouter()


# Schema para Google Login
class GoogleLoginRequest(BaseModel):
    """Request body para login con Google"""
    id_token: str

@router.post(
    "/register", 
    response_model=UserResponse,
    summary="Registrar nuevo usuario",
    description="""
    ## 📝 Registrar Usuario
    
    Crea una nueva cuenta de usuario en el sistema.
    
    ### 📋 Parámetros:
    - **email**: Correo electrónico único
    - **password**: Contraseña (mínimo 6 caracteres)
    - **name**: Nombre completo del usuario
    
    ### ✅ Respuesta:
    - Información del usuario creado
    - Estado de activación
    - Fecha de creación
    
    ### ❌ Errores:
    - **400**: Email ya registrado
    - **422**: Datos de entrada inválidos
    """,
    responses={
        200: {
            "description": "Usuario creado exitosamente",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "email": "usuario@example.com",
                        "name": "Juan Pérez",
                        "is_active": True,
                        "created_at": "2025-11-09T20:30:00"
                    }
                }
            }
        },
        400: {
            "description": "Email ya existe",
            "content": {
                "application/json": {
                    "example": {"detail": "El email ya está registrado"}
                }
            }
        }
    }
)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Registrar nuevo usuario"""
    
    # Verificar si el usuario ya existe
    existing_user = db.query(Usuario).filter(Usuario.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    # Crear nuevo usuario
    hashed_password = get_password_hash(user_data.password)
    
    # Separar nombre completo en nombre y apellido
    name_parts = user_data.name.strip().split()
    nombre = name_parts[0] if name_parts else ""
    apellido = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""
    
    db_user = Usuario(
        email=user_data.email,
        password_hash=hashed_password,
        nombre=nombre,
        apellido=apellido,
        is_active=True,
        is_admin=False
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return UserResponse(
        id=db_user.id_usuario,
        email=db_user.email,
        name=db_user.nombre_completo or db_user.nombre or "",
        is_active=db_user.is_active,
        created_at=db_user.created_at.isoformat() if db_user.created_at else ""
    )

@router.post(
    "/login", 
    response_model=Token,
    summary="Iniciar sesión",
    description="""
    ## 🔑 Iniciar Sesión
    
    Autentica un usuario y devuelve un token JWT para acceder a endpoints protegidos.
    
    ### 📋 Parámetros:
    - **email**: Correo electrónico registrado
    - **password**: Contraseña del usuario
    
    ### ✅ Respuesta:
    - **access_token**: Token JWT para autenticación
    - **token_type**: Tipo de token (bearer)
    - **expires_in**: Tiempo de expiración (30 minutos)
    
    ### 🔐 Uso del Token:
    ```
    Authorization: Bearer <access_token>
    ```
    
    ### ❌ Errores:
    - **401**: Credenciales incorrectas
    - **400**: Cuenta inactiva
    """,
    responses={
        200: {
            "description": "Login exitoso",
            "content": {
                "application/json": {
                    "example": {
                        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        "token_type": "bearer"
                    }
                }
            }
        },
        401: {
            "description": "Credenciales incorrectas",
            "content": {
                "application/json": {
                    "example": {"detail": "Email o contraseña incorrectos"}
                }
            }
        }
    }
)
async def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Iniciar sesión de usuario"""
    
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cuenta inactiva"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get(
    "/me", 
    response_model=UserResponse,
    summary="Obtener perfil del usuario actual",
    description="""
    ## 👤 Perfil de Usuario
    
    Obtiene la información del usuario autenticado usando el token JWT.
    
    ### 🔐 Autenticación Requerida:
    Este endpoint requiere un token JWT válido en el header.
    
    ### ✅ Respuesta:
    - Información completa del usuario
    - Estado de la cuenta
    - Fecha de registro
    
    ### ❌ Errores:
    - **401**: Token inválido o expirado
    - **404**: Usuario no encontrado
    """,
    responses={
        200: {
            "description": "Información del usuario",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "email": "usuario@example.com",
                        "name": "Juan Pérez",
                        "is_active": True,
                        "created_at": "2025-11-09T20:30:00"
                    }
                }
            }
        },
        401: {
            "description": "No autorizado",
            "content": {
                "application/json": {
                    "example": {"detail": "Token inválido"}
                }
            }
        }
    }
)
async def get_current_user_info(current_user: Usuario = Depends(get_current_user)):
    """Obtener información del usuario actual"""
    return UserResponse(
        id=current_user.id_usuario,
        email=current_user.email,
        name=current_user.nombre_completo or current_user.nombre or "",
        is_active=current_user.is_active,
        created_at=current_user.created_at.isoformat() if current_user.created_at else ""
    )

@router.post(
    "/create-admin",
    summary="[DEV] Crear usuario administrador",
    description="""
    ## 🛠️ Crear Administrador (Solo Desarrollo)
    
    Endpoint de desarrollo para crear un usuario administrador predefinido.
    
    ### ⚠️ Importante:
    - Solo para uso en desarrollo
    - Crea usuario: `admin@admin.com` / `admin123`
    - No requiere autenticación
    
    ### ✅ Respuesta:
    - Confirmación de creación
    - Credenciales del administrador
    
    ### 📝 Nota:
    En producción, este endpoint debería estar protegido o eliminado.
    """,
    responses={
        200: {
            "description": "Administrador creado",
            "content": {
                "application/json": {
                    "example": {
                        "message": "Usuario admin creado exitosamente",
                        "email": "admin@admin.com",
                        "password": "admin123"
                    }
                }
            }
        }
    },
    tags=["development"]
)
async def create_admin_user(db: Session = Depends(get_db)):
    """Crear usuario administrador (solo para desarrollo)"""
    
    # Verificar si ya existe
    existing_admin = db.query(Usuario).filter(Usuario.email == "admin@admin.com").first()
    if existing_admin:
        return {"message": "Usuario admin ya existe"}
    
    # Crear admin
    hashed_password = get_password_hash("admin123")
    
    admin_user = Usuario(
        email="admin@admin.com",
        password_hash=hashed_password,
        nombre="Admin",
        apellido="User",
        is_active=True,
        is_admin=True
    )
    
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    
    return {
        "message": "Usuario admin creado exitosamente",
        "email": "admin@admin.com",
        "password": "admin123"
    }


@router.post(
    "/google",
    response_model=Token,
    summary="Iniciar sesión con Google",
    description="""
    ## 🔐 Login con Google OAuth
    
    Autenticación usando Google Sign-In.
    
    ### 📋 Flujo:
    1. El cliente obtiene un `id_token` de Google
    2. Envía el token a este endpoint
    3. El backend verifica el token con Google
    4. Si es válido, crea/actualiza el usuario
    5. Retorna un JWT token propio
    
    ### 📝 Parámetros:
    - **id_token**: Token de Google obtenido del cliente
    
    ### ✅ Respuesta:
    - Token JWT de StudiMarket
    - Tipo de token (Bearer)
    
    ### ❌ Errores:
    - **401**: Token de Google inválido
    - **500**: Error de servidor
    """,
    responses={
        200: {
            "description": "Login exitoso",
            "content": {
                "application/json": {
                    "example": {
                        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        "token_type": "bearer"
                    }
                }
            }
        },
        401: {
            "description": "Token inválido",
            "content": {
                "application/json": {
                    "example": {"detail": "Token de Google inválido"}
                }
            }
        }
    }
)
async def google_login(
    google_data: GoogleLoginRequest,
    db: Session = Depends(get_db)
):
    """
    Autenticación con Google OAuth
    
    Verifica el token de Google y crea/actualiza el usuario en la base de datos.
    """
    try:
        # Verificar el token de Google
        idinfo = id_token.verify_oauth2_token(
            google_data.id_token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
        
        # Extraer información del usuario
        email = idinfo.get('email')
        nombre = idinfo.get('given_name', '')
        apellido = idinfo.get('family_name', '')
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No se pudo obtener el email de Google"
            )
        
        # Buscar o crear usuario
        user = db.query(Usuario).filter(Usuario.email == email).first()
        
        if not user:
            # Crear nuevo usuario
            # Para usuarios de Google, generamos un hash aleatorio ya que no tienen contraseña
            import secrets
            random_password = secrets.token_urlsafe(32)
            hashed_password = get_password_hash(random_password)
            
            user = Usuario(
                email=email,
                password_hash=hashed_password,
                nombre=nombre,
                apellido=apellido,
                is_active=True,
                is_admin=False
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Actualizar información si es necesario
            if not user.nombre and nombre:
                user.nombre = nombre
            if not user.apellido and apellido:
                user.apellido = apellido
            db.commit()
        
        # Crear token JWT propio
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "user_id": user.id_usuario},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
        
    except ValueError as e:
        # Token inválido
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token de Google inválido: {str(e)}"
        )
    except Exception as e:
        # Error general
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar login de Google: {str(e)}"
        )