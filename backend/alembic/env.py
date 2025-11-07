"""
Alembic Environment Configuration

Este archivo configura Alembic para que:
1. Lea la configuración de DATABASE_URL desde app/config.py
2. Importe automáticamente todos los modelos ORM
3. Genere migraciones automáticas basadas en cambios en modelos
"""

from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
import sys
import os

# Agregar el directorio raíz al path para poder importar app
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Importar configuración y modelos
from app.config import settings
from app.database import Base

# Importar TODOS los modelos para que Alembic los detecte
from app.models import Usuario, Producto, Carrito, ItemCarrito

# this is the Alembic Config object
config = context.config

# Sobrescribir sqlalchemy.url con el valor de settings
config.set_main_option('sqlalchemy.url', settings.DATABASE_URL)

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here for 'autogenerate' support
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well. By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,  # Detectar cambios en tipos de datos
        compare_server_default=True,  # Detectar cambios en defaults
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,  # Detectar cambios en tipos de datos
            compare_server_default=True,  # Detectar cambios en defaults
            render_as_batch=True,  # Para SQLite (permite ALTER TABLE)
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
