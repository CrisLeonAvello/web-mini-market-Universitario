"""change_imagen_to_longtext

Revision ID: af607ef179b2
Revises: 6decab79b444
Create Date: 2025-11-25 18:04:59.253190

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'af607ef179b2'
down_revision = '6decab79b444'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Cambiar el tipo de columna 'imagen' de VARCHAR/TEXT a LONGTEXT para soportar imágenes Base64
    op.execute("ALTER TABLE productos MODIFY COLUMN imagen LONGTEXT")


def downgrade() -> None:
    # Revertir a TEXT
    op.execute("ALTER TABLE productos MODIFY COLUMN imagen TEXT")
