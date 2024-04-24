import random
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
    admin_user = User(username='admin')
    admin_user.password_hash='qweqwe'
    new_users.append(admin_user)
    for _ in range(20):
        username = fake.user_name()
        password = fake.password()
        new_user = User(username=username)
        new_user.password_hash = password
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
        for _ in range(random.randint(1, 2)):
            name = fake.company()
            description = fake.catch_phrase()
            new_blog = Blog(name=name, description=description, owner=user)
            db.session.add(new_blog)
            db.session.commit()
            shared_users = [u for u in new_users if u != user and random.randint(0, 1)]
            for shared_user in shared_users:
                shared_blog_instance = shared_blog.insert().values(user_id=shared_user.id, blog_id=new_blog.id, primary_owner=user.username, co_owner=shared_user.username)
                db.session.execute(shared_blog_instance)

    db.session.commit()