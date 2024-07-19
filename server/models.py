from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from datetime import datetime

from config import db, bcrypt, metadata

shared_blog = db.Table('shared_blog', metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('blog_id', db.Integer, db.ForeignKey('blogs.id'), primary_key=True),
    db.Column('primary_owner', db.String, nullable=False),
    db.Column('co_owner', db.String, nullable=False),
)

favorites = db.Table('favorites', metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    db.Column('blog_id', db.Integer, db.ForeignKey('blogs.id', ondelete='CASCADE'), primary_key=True),
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = (
        "-_password_hash",
        "-posts.user",
        "-posts.blog",
    )

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    date_joined = db.Column(db.DateTime, default=datetime.now())

    shared_blogs = db.relationship('Blog', secondary='shared_blog', back_populates='users')
    blogs = db.relationship('Blog', back_populates='owner', cascade='all,delete')
    posts = db.relationship('Post', back_populates='user', cascade='all,delete')

    favorite_blogs = db.relationship('Blog', secondary='favorites', back_populates='favorited_by', cascade='all,delete')
    
    def __repr__(self):
        return f'User {self.username}, ID: {self.id}, Date Created: {self.date_joined}'
    
    @validates('username')
    def validate_username(self, key, username):
        if not any(char.isalpha() for char in username):
            raise ValueError("Username must contain at least one letter.")
        elif len(username) > 25 or len(username) < 3:
            raise ValueError("Username must be at least 3 characters and at most 25 characters.")
        return username

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
    serialize_rules = (
        "-users.shared_blogs",
        "-users.blogs",
        "-users.favorite_blogs",
        "-posts.blog",
        "-posts.user",
        "-favorited_by",
        "-owner"
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.now())

    owner = db.relationship('User', back_populates='blogs')
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    users = db.relationship('User', secondary='shared_blog', back_populates='shared_blogs')

    favorited_by = db.relationship('User', secondary='favorites', back_populates='favorite_blogs')
    posts = db.relationship('Post', backref='blog', cascade='all,delete')

    def __repr__(self):
        return f'ID: {self.id}, Owner ID: {self.owner_id}, Title: {self.name}, Description: {self.description}, Date Created: {self.date_created}'
    
    @validates('name')
    def validate_name(self, key, name):
        if not any(char.isalpha() for char in name):
            raise ValueError("Name must contain at least one letter.")
        elif len(name) > 50 or len(name) < 3:
            raise ValueError("Name must be at least 3 characters and at most 50 characters.")
        return name
    
    @validates('description')
    def validate_description(self, key, description):
        if len(description) > 500:
            raise ValueError("Description cant be more than 500 characters.")
        return description

    @hybrid_property
    def serialized_owner(self):
        return self.owner.to_dict(rules=('-blogs', '-favorite_blogs'))
    
    @hybrid_property
    def serialized_users(self):
        return [user.to_dict(rules=('-blogs', '-favorite_blogs')) for user in self.users]
    
    @hybrid_property
    def serialized_favorited_by(self):
        return [user.to_dict(rules=('-blogs', '-users')) for user in self.favorited_by]
    
    def to_dict(self, rules=None):
        data = super().to_dict(rules)
        data['owner'] = self.serialized_owner
        data['users'] = self.serialized_users
        data['favorited_by'] = self.serialized_favorited_by
        return data

class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    content = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.now())

    user = db.relationship('User', back_populates='posts')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    blog_id = db.Column(db.Integer, db.ForeignKey('blogs.id'), nullable=False)
    
    def __repr__(self):
        return f'User ID: {self.user_id}, Title: {self.title}, Description: {self.description}, Date Created: {self.date_created}'
    
    @validates('title')
    def validate_title(self, key, title):
        if len(title) > 50:
            raise ValueError("Title cant be more than 50 characters.")
        return title
    
    @validates("content")
    def validate_content(self, key, content):
        if len(content) < 20 or len(content) > 4000:
            return TypeError("Content Cannot be shorter than 20 characters or longer than 4000 characters")
        return content