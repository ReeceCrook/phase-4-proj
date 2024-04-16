import datetime
from app import app
from models import db, User, Blog, Post, Favorite, shared_blog

with app.app_context():

    # Delete all rows in tables
    db.session.query(shared_blog).delete()
    db.session.commit()
    User.query.delete()
    Blog.query.delete()
    Post.query.delete()

    # Add Users
    user1 = User(username="Uri Lee", image_url='totally_a_url1')
    user1._password_hash="password1"
    user2 = User(username="Tristan Tal", image_url='totally_a_url2')
    user2._password_hash="password2"
    user3 = User(username="Sasha Hao", image_url='totally_a_url3')
    user3._password_hash="password3"
    user4 = User(username="Taylor Jai", image_url='totally_a_url4')
    user4._password_hash="password4"
    db.session.add_all([user1, user2, user3, user4])
    db.session.commit()

    # Add Blogs
    blog1 = Blog(name="Good Blog Name", description="Best decription")
    blog2 = Blog(name="Meh Blog Name", description="Meh decription")
    db.session.add_all([blog1, blog2])
    db.session.commit()

    # Add Posts
    post1 = Post(title="XYZ Post Flask server", description="Totally a descriptive description", content="I am content with this content")
    post2 = Post(title="XYZ Post React UI", description="This is a descriptive description", content="CONTENT!")
    db.session.add_all([post1, post2])
    db.session.commit()

    fav1 = Favorite(favorite_blog_id=1)
    fav2 = Favorite(favorite_blog_id=2)
    db.session.add_all([fav1, fav2])
    db.session.commit()


    # Many-to-many relationship

    user1.blogs.append(blog1)
    user1.blogs.append(blog2)
    
    blog2.users.append(user2)
    blog2.users.append(user3)
    blog2.users.append(user4)
    db.session.commit()