import random
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
        description = fake.text()
        new_blog = Blog(name=name, description=description, owner=user)
        new_blogs.append(new_blog)

    db.session.add_all(new_blogs)
    db.session.commit()

    for user in new_users:
        for _ in range(random.randint(1, 2)):
            name = fake.company()
            description = fake.text()
            new_blog = Blog(name=name, description=description, owner=user)
            db.session.add(new_blog)
            db.session.commit()
            shared_users = [u for u in new_users if u != user]
            random.shuffle(shared_users)
            primary_owner_chosen = False
            co_owner_chosen = False
            for shared_user in shared_users:
                if not primary_owner_chosen:
                    shared_blog_instance = shared_blog.insert().values(user_id=shared_user.id, blog_id=new_blog.id, primary_owner=user.username, co_owner=shared_user.username)
                    db.session.execute(shared_blog_instance)
                    primary_owner_chosen = True
                elif not co_owner_chosen:
                    shared_blog_instance = shared_blog.insert().values(user_id=shared_user.id, blog_id=new_blog.id, primary_owner=shared_user.username, co_owner=user.username)
                    db.session.execute(shared_blog_instance)
                    co_owner_chosen = True
                if primary_owner_chosen and co_owner_chosen:
                    break

    db.session.commit()