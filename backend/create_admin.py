"""
Script para crear usuario administrador
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import bcrypt
from app.models.usuario import Usuario

# Configuración de la base de datos
DATABASE_URL = "mysql+pymysql://minimarket_user:minimarket_pass@db:3306/minimarket_db"

def create_admin():
    """Crear usuario administrador"""
    try:
        # Crear conexión
        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        
        # Crear sesión
        db = SessionLocal()
        
        # Verificar si ya existe
        existing_admin = db.query(Usuario).filter(Usuario.email == "admin@admin.com").first()
        if existing_admin:
            print("✅ Usuario admin ya existe")
            return
        
        # Crear hash de contraseña usando bcrypt simple
        password = "admin123"
        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        password_hash = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
        
        # Crear admin
        admin_user = Usuario(
            email="admin@admin.com",
            password_hash=password_hash,
            nombre="Admin",
            apellido="User",
            is_active=True,
            is_admin=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("✅ Usuario admin creado exitosamente:")
        print(f"   Email: admin@admin.com")
        print(f"   Password: admin123")
        print(f"   ID: {admin_user.id_usuario}")
        
        # Cerrar sesión
        db.close()
        
    except Exception as e:
        print(f"❌ Error al crear usuario admin: {e}")

if __name__ == "__main__":
    create_admin()