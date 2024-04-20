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
    serialize_rules = (
        "-_password_hash",
    )

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String, nullable=False)
    date_joined = db.Column(db.DateTime, default=datetime.now())

    blogs = db.relationship('Blog', secondary='shared_blog', back_populates='users', cascade='all,delete')
    favorite_blogs = db.relationship('Blog', secondary='favorites', back_populates='favorited_by')
    
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
    serialize_rules = (
        "-users",
        "-posts",
        "-favorited_by"
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.now())

    users = db.relationship('User', secondary='shared_blog', back_populates='blogs')
    favorited_by = db.relationship('User', secondary='favorites', back_populates='favorite_blogs')
    posts = db.relationship('Post', backref='blog', cascade='all,delete')

    def __repr__(self):
        return f'Title: {self.name}, Description: {self.description}, Date Created: {self.date_created}'
    
    @hybrid_property
    def serialized_users(self):
        return [user.to_dict(rules=('-blogs', '-favorite_blogs')) for user in self.users]
    
    @hybrid_property
    def serialized_favorited_by(self):
        return [user.to_dict(rules=('-blogs', '-users')) for user in self.favorited_by]
    
    def to_dict(self, rules=None):
        data = super().to_dict(rules)
        data['users'] = self.serialized_users
        data['favorited_by'] = self.serialized_favorited_by
        return data

class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'
    serialize_rules = (
        "-blog_id",
    )

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    content = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.now())

    blog_id = db.Column(db.Integer, db.ForeignKey('blogs.id'), nullable=False)

    def __repr__(self):
        return f'Title: {self.title}, Description: {self.description}, Author ID: {self.user_id} Date Created: {self.date_created}'



favorites = db.Table('favorites', metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('blog_id', db.Integer, db.ForeignKey('blogs.id'), primary_key=True),
)