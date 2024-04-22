"""Updated cascade e's

Revision ID: f79579c92d1d
Revises: 92ac8afb890c
Create Date: 2024-04-21 21:32:01.688234

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f79579c92d1d'
down_revision = '92ac8afb890c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('favorites', schema=None) as batch_op:
        batch_op.drop_constraint('fk_favorites_blog_id_blogs', type_='foreignkey')
        batch_op.drop_constraint('fk_favorites_user_id_users', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_favorites_blog_id_blogs'), 'blogs', ['blog_id'], ['id'], ondelete='CASCADE')
        batch_op.create_foreign_key(batch_op.f('fk_favorites_user_id_users'), 'users', ['user_id'], ['id'], ondelete='CASCADE')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('favorites', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_favorites_user_id_users'), type_='foreignkey')
        batch_op.drop_constraint(batch_op.f('fk_favorites_blog_id_blogs'), type_='foreignkey')
        batch_op.create_foreign_key('fk_favorites_user_id_users', 'users', ['user_id'], ['id'])
        batch_op.create_foreign_key('fk_favorites_blog_id_blogs', 'blogs', ['blog_id'], ['id'])

    # ### end Alembic commands ###
