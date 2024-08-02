"""Added user-post relationship

Revision ID: fa22d6ace6ab
Revises: 14f999e08315
Create Date: 2024-07-18 22:47:21.572327

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fa22d6ace6ab'
down_revision = '14f999e08315'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('blogs', schema=None) as batch_op:
        batch_op.alter_column('owner_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    with op.batch_alter_table('favorites', schema=None) as batch_op:
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.drop_column('favorite_blog_id')
        batch_op.drop_column('date_added')

    with op.batch_alter_table('posts', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key(batch_op.f('fk_posts_user_id_users'), 'users', ['user_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('posts', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_posts_user_id_users'), type_='foreignkey')
        batch_op.drop_column('user_id')

    with op.batch_alter_table('favorites', schema=None) as batch_op:
        batch_op.add_column(sa.Column('date_added', sa.DATETIME(), nullable=True))
        batch_op.add_column(sa.Column('favorite_blog_id', sa.INTEGER(), nullable=False))
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    with op.batch_alter_table('blogs', schema=None) as batch_op:
        batch_op.alter_column('owner_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###