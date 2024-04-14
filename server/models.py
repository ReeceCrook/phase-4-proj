from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from cryptography.fernet import Fernet

from config import db, bcrypt, secret_key, metadata

cipher = Fernet(secret_key)


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    __table_args__ = (
        "-_password_hash",
       " -favorites",
        "-blog",
    )
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    image_url = db.Column(db.String, nullable=False)
    has_blog = db.Column(db.Boolean, default=False)

    blog = db.relationship('Blog', secondary='post_engagement', backref='users')
    favorites = db.relationship('Favorite', backref='users')
    
    def __repr__(self):
        return f'User {self.username}, ID: {self.id}, Amount of favorites: {len(self.favorites)}, Amount of suggestions: {len(self.suggestions)}'
    
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
    __table_args__ = (
        "-post",
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)

    user = db.relationship('User', backref='Blog')
    post = db.relationship('Post',secondary='post_engagement', backref='blogs')

    def __repr__(self):
        return f'Title: {self.title}, Content: {self.content}, Author ID: {self.user_id}'


class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    content = db.Column(db.String, nullable=False)

    blog = db.relationship("Blog", secondary='post_engagement', backref='posts')

    def __repr__(self):
        return f'Title: {self.title}, Description: {self.description}, Author ID: {self.blog_id}'

post_engagement = db.Table('post_engagement', metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('post_id', db.Integer, db.ForeignKey('posts.id'), primary_key=True),
    db.Column('likes', db.Integer, default=0),
    db.Column('dislikes', db.Integer, default=0),
    db.Column('comments', db.String, nullable=False)
)

class Favorite(db.Model, SerializerMixin):
    __tablename__ = 'favorites'

    id = db.Column(db.Integer, primary_key=True)
    favorite_blog_id = db.Column(db.Integer, nullable=False, unique=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)

    def __repr__(self):
        return f'ID: {self.id}, Original listing URL: {self.original_listing_url}'
    

