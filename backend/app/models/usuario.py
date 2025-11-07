"""
Modelo ORM para Usuario

Mapea la tabla 'usuarios' de la base de datos.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Usuario(Base):
    """
    Modelo de Usuario (mapea a tabla 'usuarios')
    
    Relaciones:
    - usuarios (1) → carritos (N)
    """
    __tablename__ = "usuarios"
    
    # Clave primaria
    id_usuario = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Datos de autenticación
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    
    # Datos personales
    nombre = Column(String(100), nullable=True)
    apellido = Column(String(100), nullable=True)
    # nombre_completo es GENERATED en SQL, no se define aquí
    
    # Control de cuenta
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    is_admin = Column(Boolean, default=False, nullable=False)
    
    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones ORM
    carritos = relationship(
        "Carrito",
        back_populates="usuario",
        cascade="all, delete-orphan",  # Borrar usuario → borrar carritos
        lazy="dynamic"  # No cargar carritos automáticamente (query on-demand)
    )
    
    def __repr__(self):
        return f"<Usuario(id={self.id_usuario}, email='{self.email}')>"
    
    @property
    def nombre_completo(self):
        """Propiedad calculada (similar a GENERATED en SQL)"""
        if self.nombre and self.apellido:
            return f"{self.nombre} {self.apellido}"
        elif self.nombre:
            return self.nombre
        return None
