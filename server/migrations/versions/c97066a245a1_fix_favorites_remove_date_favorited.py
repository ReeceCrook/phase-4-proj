"""Fix favorites/remove date_favorited

Revision ID: c97066a245a1
Revises: ff75fbe004e7
Create Date: 2024-04-20 00:14:49.659103

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c97066a245a1'
down_revision = 'ff75fbe004e7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('favorites', schema=None) as batch_op:
        batch_op.drop_column('date_favorited')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('favorites', schema=None) as batch_op:
        batch_op.add_column(sa.Column('date_favorited', sa.DATETIME(), nullable=True))

    # ### end Alembic commands ###