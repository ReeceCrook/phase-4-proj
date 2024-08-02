"""Added user-post relationship

Revision ID: 29c0c0d956b3
Revises: 14f999e08315
Create Date: 2024-07-18 22:37:19.052424

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '29c0c0d956b3'
down_revision = '14f999e08315'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('blogs', schema=None) as batch_op:
        batch_op.alter_column('owner_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    with op.batch_alter_table('posts', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key(batch_op.f('fk_posts_user_id_users'), 'users', ['user_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('posts', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_posts_user_id_users'), type_='foreignkey')
        batch_op.drop_column('user_id')

    with op.batch_alter_table('blogs', schema=None) as batch_op:
        batch_op.alter_column('owner_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    
    # ### end Alembic commands ###