from flask import request, session, make_response
from flask_restful import Resource

from config import app, db, api
from models import User, Blog, Post, Favorite

class Signup(Resource):
    def post(self):
        json = request.get_json()
        user = User(
            username=json.get('username'),
            image_url=json.get('image_url'),
            bio=json.get('bio')
        )
        user.password_hash = json.get('password')
        if user and user.username:

            db.session.add(user)
            db.session.commit()

            session['user_id'] = user.id

            return user.to_dict(), 201
        
        return {"Message": "One or more fields are invalid"}, 422

class CheckSession(Resource):
    def get(self):
        if session['user_id']:
            user = User.query.filter(User.id == session["user_id"]).first()
            return user.to_dict(), 200
        
        return {"Message": "User not found"}, 401

class Login(Resource):
    def post(self):
        json = request.get_json()
        username = json.get('username')
        password = json.get('password')

        user = User.query.filter(User.username == username).first()
        if user and user.authenticate(password):
            session['user_id'] = user.id
            return user.to_dict()
        
        return {"Message": "User not found"}, 401

class Logout(Resource):
    def delete(self):
        if session['user_id']:

            session['user_id'] = None
            return {}, 204
        
        return {"Message": "User not logged in"}, 401

class BlogIndex(Resource):
    def get(self):
        if session['user_id']:
           return Blog.query.filter(id=session['user_id']).first().to_dict(), 200
        
        return {"Message": "User not logged in"}, 401
    
    def post(self):
        user = User.query.filter(id=session['user_id']).first()
        json = request.get_json()
        if session['user_id'] and user.has_blog == False:
            user.has_blog = True
            blog = Blog(
                name = json.get("name"),
                description = json.get("description"),
                user_id = session['user_id']
            )
            
            if blog and len(blog.description) <= 150:
                db.session.add(blog, user)
                db.session.commit()
                return blog.to_dict(), 201
            
            return {"Message": "One or more fields are invalid"}, 422
        
        return {"Message": "User not logged in"}, 401

    def patch(self, id):

        blog = Blog.query.filter(id=id).first()
        for attr in request.form:
            setattr(blog, attr, request.form[attr])

        db.session.add(blog)
        db.session.commit()

        response_dict = blog.to_dict()

        response = make_response(
            response_dict,
            200
        )

        return response



api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(BlogIndex, '/blog', endpoint='blog')

if __name__ == '__main__':
    app.run(port=5555, debug=True)