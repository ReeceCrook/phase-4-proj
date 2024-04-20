from flask import request, session, make_response, jsonify
from flask_restful import Resource

from config import app, db, api
from models import User, Blog, Post, favorites

class Signup(Resource):
    def post(self):
        json = request.get_json()
        user = User(
            username=json.get('username'),
            image_url=json.get('image_url'),
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
        if 'user_id' in session and session['user_id'] != None:
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
            return user.to_dict(), 200
        
        return {"Message": "User not found"}, 401

class Logout(Resource):
    def delete(self):
        if 'user_id' in session:

            session['user_id'] = None
            return {}, 204
        
        return {"Message": "User not logged in"}, 401
    
class UserIndex(Resource):
    def get(self):
        return [user.to_dict() for user in User.query.all()], 200
    
    # def post(self):
    #     json = request.get_json()
    #     if 'user_id' in session:
    #         user = User(
    #             username = json.get("username"),
    #             image_url = json.get("image_url"),
    #             _password_hash = json.get("password"),
    #         )
            
    #         if user and len(user.username) <= 20:
    #             db.session.add(user)
    #             db.session.commit()
    #             return user.to_dict(), 201
            
    #         return {"Message": "One or more fields are invalid"}, 422
        
    #     return {"Message": "User not logged in"}, 401
    
class UserByID(Resource):

    def get(self, id):
        user = User.query.filter(User.id == id).first().to_dict()
        return make_response(jsonify(user), 200)
    
    def patch(self, id):
        json = request.get_json()

        user = User.query.filter(User.id == id).first()
        for attr in json:
            setattr(user, attr, json[attr])
        
        db.session.add(user)
        db.session.commit()

        response = make_response(
            user.to_dict(),
            200
        )

        return response
    
    def delete(self, id):
        if session['user_id'] == id:
            user = User.query.filter(User.id == id).first()

            db.session.delete(user)
            db.session.commit()


            response = make_response(
                "Deleted",
                204
            )

            return response
        return {"Message": "User not logged in"}, 401

class UserByBlogID(Resource):
    def get(self, id):
        return [user.to_dict() for user in User.query.filter(User.blogs.id == id).all()], 200

class BlogIndex(Resource):
    def get(self):
        return [blog.to_dict() for blog in Blog.query.all()], 200
        
    def post(self):
        json = request.get_json()
        if 'user_id' in session and session['user_id'] != None:
            blog = Blog(
                name = json.get("name"),
                description = json.get("description"),
            )
            blog.users.primary_owner = json.get("primary_owner")
            blog.users.co_owner = json.get("co_owner")
            
            if blog and len(blog.description) <= 250:
                db.session.add_all(blog)
                db.session.commit()
                return blog.to_dict(), 201
            
            return {"Message": "One or more fields are invalid"}, 422
        
        return {"Message": "User not logged in"}, 401


class BlogByID(Resource):

    def get(self, id):
        blog = Blog.query.filter(Blog.id == id).first().to_dict()
        return make_response(jsonify(blog), 200)
    
    def patch(self, id):
        json = request.get_json()

        blog = Blog.query.filter( Blog.id == id).first()
        for attr in json:
            setattr(blog, attr, json[attr])
        
        db.session.add(blog)
        db.session.commit()

        response = make_response(
            blog.to_dict(),
            200
        )

        return response
    
    def delete(self, id):
        blog = Blog.query.filter(Blog.id == id).first()

        db.session.delete(blog)
        db.session.commit()


        response = make_response(
            "Deleted",
            204
        )

        return response

class BlogByUserID(Resource):
    def get(self, id):
        return [blog.to_dict() for blog in Blog.query.filter(Blog.users.id == id).all()], 200

class PostIndex(Resource):
    def get(self):
        return [post.to_dict() for post in Post.query.all()], 200
        
    def post(self):
        json = request.get_json()
        if 'user_id' in session and session['user_id'] != None:
            user = User.query.filter(User.id == session['user_id']).first()
            post = Post(
                title = json.get("title"),
                description = json.get("description"),
                content = json.get("content"),
            )

            if post and len(post.description) <= 150:
                db.session.add(post)
                db.session.commit()
                return post.to_dict(), 201
            
            return {"Message": "One or more fields are invalid"}, 422
        
        return {"Message": "User not logged in"}, 401

class PostByID(Resource):

    def get(self, id):
        post = Post.query.filter(Post.id == id).first().to_dict()
        return make_response(jsonify(post), 200)
        
    def patch(self, id):
        json = request.get_json()
        post = Post.query.filter(Post.id == id).first()
        for attr in json:
            setattr(post, attr, json[attr])
        
        db.session.add(post)
        db.session.commit()

        response = make_response(
            post.to_dict(),
            200
        )

        return response
    
    def delete(self, id):

        post = Post.query.filter(Post.id == id).first()

        db.session.delete(post)
        db.session.commit()


        response = make_response(
            "Deleted",
            204
        )

        return response
    
class PostByBlogID(Resource):
    def get(self, id):
        return [post.to_dict() for post in Post.query.filter(Post.blog_id == id).all()], 200

class FavoriteIndex(Resource):
    def get(self):
        if 'user_id' in session and session['user_id'] != None:
            favorite_list = db.session.query(favorites).filter_by(user_id=session['user_id']).all()
            favorites_data = [{'user_id': fav.user_id, 'blog_id': fav.blog_id} for fav in favorite_list]
            return  [fav for fav in favorites_data], 200
            
        return {"Message": "User not logged in"}, 401
    
    def post(self):
        json = request.get_json()
        if 'user_id' in session and session['user_id'] != None:
            favorite = favorites(
                blog_id = json.get("blog_id"),
                user_id = session['user_id']
            )
            
            if favorite:
                db.session.add(favorite)
                db.session.commit()
                return favorite.to_dict(), 201
            
            return {"Message": "One or more fields are invalid"}, 422
        
        return {"Message": "User not logged in"}, 401

class FavoriteByUserID(Resource):

    def get(self, id):
        if 'user_id' in session and session['user_id'] != None:
            favorite = db.query(favorites).filter(favorites.c.user_id == id).all().to_dict()
            return make_response(jsonify(favorite), 200)
        
    def patch(self, id):
        json = request.get_json()
        favorite = favorites.query.filter(favorites.id == id).first()
        for attr in json:
            setattr(favorite, attr, json[attr])
        
        db.session.add(favorite)
        db.session.commit()

        response = make_response(
            favorite.to_dict(),
            200
        )

        return response
    
    def delete(self, id):
        if 'user_id' in session and session['user_id'] != None:
            favorite = db.session.query(favorites).filter_by(user_id=session['user_id']).filter_by(blog_id=id).first()

            if favorite:
                db.session.query(favorites).delete(favorite)
                db.session.commit()
                return "Deleted", 204
            else:
                return "Favorite not found", 404
            
        return "User not logged in", 401


api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')

api.add_resource(UserIndex, '/user', endpoint='user')
api.add_resource(UserByID, '/user/<int:id>')

api.add_resource(BlogIndex, '/blog', endpoint='blog')
api.add_resource(BlogByID, '/blog/<int:id>')
api.add_resource(BlogByUserID, '/blog-by-user/<int:id>')

api.add_resource(PostIndex, '/post', endpoint='post')
api.add_resource(PostByID, '/post/<int:id>')
api.add_resource(PostByBlogID, '/post-by-blog/<int:id>')

api.add_resource(FavoriteIndex, '/favorite', endpoint='favorite')
api.add_resource(FavoriteByUserID, '/favorite/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)