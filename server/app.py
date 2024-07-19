from flask import request, session, make_response, jsonify
from flask_restful import Resource

from config import app, db, api
from models import User, Blog, Post, favorites, shared_blog

class Signup(Resource):
    def post(self):
        json = request.get_json()
        user = User(
            username=json.get('username'),
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
    
class UserByID(Resource):
    def get(self, id):
        user = User.query.filter(User.id == id).first().to_dict()
        if user:
            return make_response(jsonify(user), 200)
        return {"Message": f"User {id} not found"}, 401
    
    def patch(self, id):
        if session['user_id'] == id:
            json = request.get_json()

            user = User.query.filter(User.id == id).first()
            for attr, value in json.items():
                if attr == 'password':
                    user.password_hash = value
                else:
                    setattr(user, attr, value)
            
            db.session.add(user)
            db.session.commit()

            response = make_response(
                user.to_dict(),
                200
            )

            return response
        return {"Message": "User not logged in"}, 401
    
    def delete(self, id):
        if session['user_id'] == id:
            user = User.query.filter(User.id == id).first()

            db.session.delete(user)
            db.session.commit()

            session['user_id'] = None
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
            user_id = session['user_id']
            name = json.get("name")
            description = json.get("description")
            is_shared = json.get("isShared") 

            owner = User.query.filter(User.id == user_id).first()
            if owner is None:
                return {"message": "User not found"}, 404
            
            blog = Blog(name=name, description=description, owner=owner, owner_id=owner.id)
            db.session.add(blog)

            print("OWNER", blog.owner)
            if is_shared:
                try:
                    co_owner_id = json.get("coOwnerId")
                    co_owner = User.query.filter(User.id == co_owner_id).first()


                    if co_owner is None:
                        return {"message": "Co-owner not found"}, 404

                    print("Owner:", owner.username)
                    print("Blog ID:", blog.id)
                    print("Co-Owner:", co_owner.username)

                    shared_blog_entry = shared_blog.insert().values(
                        user_id=co_owner_id,
                        blog_id=blog.id,
                        primary_owner=owner.username,
                        co_owner=co_owner.username
                    )
                    db.session.execute(shared_blog_entry)
                    db.session.commit()
                    return blog.to_dict(), 201
                except Exception as e:
                    print("Error:", e)
                    import traceback
                    traceback.print_exc()
                    db.session.rollback()
                    return {"message": "Failed to create shared blog"}, 500

            if blog:
                db.session.commit()
                return blog.to_dict(), 201
            
            return {"Message": "One or more fields are invalid"}, 422
        
        return {"Message": "User not logged in"}, 401


class BlogByID(Resource):

    def get(self, id):
        blog = Blog.query.filter(Blog.id == id).first()
        if blog:
            return blog.to_dict(), 200
        
        return {"Message": "Blog not found"}, 401
    
    def patch(self, id):
        json = request.get_json()

        blog = Blog.query.filter(Blog.id == id).first()
        if blog:
            for attr in json:
                setattr(blog, attr, json[attr])
            
            db.session.add(blog)
            db.session.commit()

            response = make_response(
                blog.to_dict(),
                200
            )

            return response
        return {"Message": "Blog not found"}, 401

    
    def delete(self, id):
        blog = Blog.query.filter(Blog.id == id).first()

        if blog:
            db.session.delete(blog)
            db.session.commit()

            response = make_response(
                "Deleted",
                204
            )

            return response
        return {"Message": "Blog not found"}, 401

class BlogByUserID(Resource):
    def get(self, id):
        if 'user_id' in session and session['user_id'] != None:
            user = User.query.filter(User.id == id).first()
            if user:
                return [blog.to_dict() for blog in Blog.query.filter(Blog.users.contains(user)).all() + Blog.query.filter(Blog.owner_id == id).all()], 200
            else:
                return {'message': 'User not found'}, 404
        
        return {'message': 'User not logged in'}, 401


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
                blog_id = json.get("blog_id"),
                user_id = user.id
            )

            if post and len(post.description) <= 150:
                db.session.add(post)
                db.session.commit()
                print(user)
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
        if post:
            for attr in json:
                setattr(post, attr, json[attr])
            
            db.session.add(post)
            db.session.commit()

            response = make_response(
                post.to_dict(),
                200
            )

            return response
        return {"Message": "Post not found"}, 401
    
    def delete(self, id):

        post = Post.query.filter(Post.id == id).first()
        if post:
            db.session.delete(post)
            db.session.commit()

            response = make_response(
                "Deleted",
                204
            )

            return response
        return {"Message": "Post not found"}, 401
    
class PostByBlogID(Resource):
    def get(self, id):
        return [post.to_dict() for post in Post.query.filter(Post.blog_id == id).all()], 200

class FavoriteIndex(Resource):
    def get(self):
        if 'user_id' in session and session['user_id'] != None:
            favorite_list = db.session.query(favorites).filter_by(user_id=session['user_id']).all()
            favorites_json = [{'user_id': fav.user_id, 'blog_id': fav.blog_id} for fav in favorite_list]
            return  [fav for fav in favorites_json], 200
            
        return {"Message": "User not logged in"}, 401
    
    def post(self):
        json = request.get_json()
        if 'user_id' in session and session['user_id'] != None:
            
            try:
                blog = Blog.query.filter(Blog.id == json.get("blog_id")).first()
                favorite_entry = favorites.insert().values(
                    blog_id=json.get("blog_id"),
                    user_id=session['user_id']
                )
                
                
                db.session.execute(favorite_entry)
                db.session.commit()
                return blog.to_dict(), 201
            except Exception as e:
                    db.session.rollback()
                    print("Error:", e)
            
            return {"Message": "One or more fields are invalid"}, 422
        
        return {"Message": "User not logged in"}, 401

class FavoriteByUserID(Resource):

    def get(self, id):
        if 'user_id' in session and session['user_id'] != None:
            favorite = db.query(favorites).filter(favorites.c.user_id == id).all().to_dict()
            return make_response(jsonify(favorite), 200)
        
    def delete(self, id):
        if 'user_id' in session and session['user_id'] != None:
            favorite = db.session.query(favorites).filter_by(user_id=session['user_id']).filter_by(blog_id=id).delete()

            if favorite:
                db.session.commit()
                return "Deleted", 204
            else:
                return "Favorite not found", 404
            
        return "User not logged in", 401

class BlogPosts(Resource):
    def get(self, n):
        blogs = Blog.query.all()
        blog_list = []
        for blog in blogs:
            if len(blog.posts) >= n:
                blog_list.append(blog)
        return [blog.to_dict() for blog in blog_list]
                
api.add_resource(BlogPosts, "/blog_posts/<int:n>")
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