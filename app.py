from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Note
from config import Config
from flask_cors import CORS
import jwt
import datetime

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
migrate = Migrate(app, db)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Secret key for JWT
app.config['SECRET_KEY'] = 'your_secret_key'


# Signup Route
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Check if email already exists
    existing_user = User.query.filter_by(user_email=data['user_email']).first()
    if existing_user:
        return jsonify({'message': 'Email is already registered!'}), 400

    # Hash the password using pbkdf2_sha256
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    # Create new user
    try:
        new_user = User(user_name=data['user_name'], user_email=data['user_email'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error: {str(e)}'}), 500

    return jsonify({'message': 'User created successfully!'}), 201


# Signin Route with JWT Token
@app.route('/api/signin', methods=['POST'])
def signin():
    data = request.get_json()
    user = User.query.filter_by(user_email=data['user_email']).first()

    if user and check_password_hash(user.password, data['password']):
        # Generate JWT token
        token = jwt.encode({
            'user_id': user.user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expires in 1 hour
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            'message': 'Login successful!',
            'token': token
        }), 200

    return jsonify({'message': 'Invalid credentials!'}), 401


# Notes Route - GET and POST
@app.route('/api/notes', methods=['GET', 'POST'])
def notes():
    if request.method == 'POST':
        data = request.get_json()

        # Check for user authentication via JWT
        token = data.get('token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403

        try:
            # Decode the token to get the user ID
            decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = decoded_token['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        # Create a new note
        new_note = Note(note_title=data['note_title'], note_content=data['note_content'], user_id=user_id)
        db.session.add(new_note)
        db.session.commit()
        return jsonify({'message': 'Note created successfully!'}), 201

    elif request.method == 'GET':
        # Get notes based on the user ID from the request args
        user_id = request.args.get('user_id')

        if not user_id:
            return jsonify({'message': 'User ID is required!'}), 400

        notes = Note.query.filter_by(user_id=user_id).all()
        return jsonify([
            {'note_id': note.note_id, 'note_title': note.note_title, 'note_content': note.note_content}
            for note in notes
        ]), 200


if __name__ == '__main__':
    app.run(debug=True)
