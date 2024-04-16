from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime

from config import db, bcrypt, metadata

shared_blog = db.Table('shared_blog', metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('blog_id', db.Integer, db.ForeignKey('blogs.id'), primary_key=True),
    db.Column('primary_owner', db.String),
    db.Column('co_owner', db.String),
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String, nullable=False)
    has_blog = db.Column(db.Boolean, default=False)
    date_joined = db.Column(db.DateTime, default=datetime.utcnow)

    blogs = db.relationship('Blog', secondary='shared_blog', back_populates='users')
    posts = db.relationship('Post', backref='users')
    favorites = db.relationship('Favorite', backref='users')
    
    def __repr__(self):
        return f'User {self.username}, ID: {self.id}, Date Created: {self.date_joined}, Image URL: {self.image_url}, Amount of favorites: {len(self.favorites)}'
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))


class Blog(db.Model, SerializerMixin):
    __tablename__ = 'blogs'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    users = db.relationship('User', secondary='shared_blog', back_populates='blogs')
    post = db.relationship('Post', backref='blogs')

    def __repr__(self):
        return f'Title: {self.name}, Description: {self.description}, Date Created: {self.date_created}'


class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    content = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    blog_id = db.Column(db.Integer, db.ForeignKey('blogs.id'))

    def __repr__(self):
        return f'Title: {self.title}, Description: {self.description}, Author ID: {self.user_id} Date Created: {self.date_created}'



class Favorite(db.Model, SerializerMixin):
    __tablename__ = 'favorites'

    id = db.Column(db.Integer, primary_key=True)
    favorite_blog_id = db.Column(db.Integer, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def __repr__(self):
        return f'ID: {self.id}, Original listing URL: {self.favorite_blog_id}, Date Added: {self.date_added}'
    

