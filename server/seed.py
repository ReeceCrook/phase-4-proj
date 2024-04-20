import datetime
from app import app
from models import db, User, Blog, Post, favorites, shared_blog

with app.app_context():

    # Delete all rows in tables
    db.session.query(shared_blog).delete()
    db.session.query(favorites).delete()
    User.query.delete()
    Blog.query.delete()
    Post.query.delete()
    db.session.commit()


    # Add Users
    user1 = User(username="Uri Lee", image_url='totally_a_url1')
    user1.password_hash = "password1"

    user2 = User(username="Tristan Tal", image_url='totally_a_url2')
    user2.password_hash = "password2"

    user3 = User(username="Sasha Hao", image_url='totally_a_url3')
    user3.password_hash = "password3"

    user4 = User(username="Taylor Jai", image_url='totally_a_url4')
    user4.password_hash = "password4"

    db.session.add_all([user1, user2, user3, user4])
    db.session.commit()

    # Add Blogs
    blog1 = Blog(name="Good Blog Name", description="Best description")
    blog2 = Blog(name="Meh Blog Name", description="Meh description")
    db.session.add_all([blog1, blog2])
    db.session.commit()

    # Add Posts
    post1 = Post(title="XYZ Post Flask server", description="Totally a descriptive description", content="I am content with this content", blog=blog1)
    post2 = Post(title="XYZ Post React UI", description="This is a descriptive description", content="CONTENT!", blog=blog2)
    post3 = Post(title="Real Post Title", description="Real Post Description", content="Real Post Content", blog=blog1)
    db.session.add_all([post1, post2, post3])
    db.session.commit()


    # Many-to-many relationships

    user1.blogs.append(blog1)
    
    blog2.users.append(user2)
    blog2.users.append(user3)
    blog2.users.append(user4)

    # Add favorites

    blog1.favorited_by.append(user1)
    blog1.favorited_by.append(user2)
    blog2.favorited_by.append(user1)

    db.session.commit()
