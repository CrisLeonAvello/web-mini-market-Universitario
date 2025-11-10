#!/usr/bin/env python3
"""
Script para verificar usuarios en la BD
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.usuario import Usuario

# Configuración de la base de datos
DATABASE_URL = "mysql+pymysql://minimarket_user:minimarket_pass@db:3306/minimarket_db"

def check_users():
    """Verificar usuarios en la base de datos"""
    try:
        # Crear conexión
        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        
        # Crear sesión
        db = SessionLocal()
        
        # Obtener todos los usuarios
        users = db.query(Usuario).all()
        
        print("=== Usuarios en la base de datos ===")
        for user in users:
            print(f"ID: {user.id_usuario}")
            print(f"Email: {user.email}")
            print(f"Nombre: {user.nombre}")
            print(f"Apellido: {user.apellido}")
            print(f"Activo: {user.is_active}")
            print(f"Admin: {user.is_admin}")
            print(f"Hash length: {len(user.password_hash) if user.password_hash else 0}")
            print(f"Hash starts with: {user.password_hash[:20] if user.password_hash else 'None'}...")
            print("---")
        
        # Cerrar sesión
        db.close()
        
    except Exception as e:
        print(f"❌ Error al verificar usuarios: {e}")

if __name__ == "__main__":
    check_users()