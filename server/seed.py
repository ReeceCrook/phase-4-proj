from random import choice
from faker import Faker
from app import app
from models import db, User, Blog, Post, favorites, shared_blog

fake = Faker()
with app.app_context():
    db.session.query(shared_blog).delete()
    db.session.query(favorites).delete()
    User.query.delete()
    Blog.query.delete()
    Post.query.delete()
    db.session.commit()

    new_users = []
    for _ in range(20):
        username = fake.user_name()
        password = fake.password()
        new_user = User(username=username, _password_hash=password)
        new_users.append(new_user)

    db.session.add_all(new_users)
    db.session.commit()

    new_blogs = []
    for user in new_users:
        name = fake.company()
        description = fake.catch_phrase()
        new_blog = Blog(name=name, description=description, owner=user)
        new_blogs.append(new_blog)

    db.session.add_all(new_blogs)
    db.session.commit()

    new_posts = []
    for _ in range(20):
        title = fake.sentence()
        description = fake.sentence()
        content = fake.paragraph()
        blog = choice(new_blogs)
        new_post = Post(title=title, description=description, content=content, blog=blog)
        new_posts.append(new_post)

    db.session.add_all(new_posts)
    db.session.commit()


    for user in new_users:
        if user.id % 2 != 0:
            blog_to_share = choice(new_blogs)
            primary_owner = blog_to_share.owner
            shared_users = [primary_owner] + [u for u in new_users if u != primary_owner and u not in blog_to_share.users]
            for shared_user in shared_users:
                existing_entry = db.session.query(shared_blog).filter_by(user_id=shared_user.id, blog_id=blog_to_share.id).first()
                if not existing_entry:
                    shared_blog_instance = shared_blog.insert().values(user_id=shared_user.id, blog_id=blog_to_share.id, primary_owner=primary_owner.username, co_owner=shared_user.username)
                    db.session.execute(shared_blog_instance)

        blog_to_favorite = choice(new_blogs)
        blog_to_favorite.favorited_by.append(user)

    db.session.commit()
