from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Note
from config import Config
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
migrate = Migrate(app, db)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Check if email already exists
    existing_user = User.query.filter_by(user_email=data['user_email']).first()
    if existing_user:
        return jsonify({'message': 'Email is already registered!'}), 400

    # Hash the password using pbkdf2_sha256 (make sure both are consistent)
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

@app.route('/api/signin', methods=['POST'])
def signin():
    data = request.get_json()
    user = User.query.filter_by(user_email=data['user_email']).first()

    if user and check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Login successful!'}), 200

    return jsonify({'message': 'Invalid credentials!'}), 401

@app.route('/api/notes', methods=['GET', 'POST'])
def notes():
    if request.method == 'POST':
        data = request.get_json()
        new_note = Note(note_title=data['note_title'], note_content=data['note_content'], user_id=data['user_id'])
        db.session.add(new_note)
        db.session.commit()
        return jsonify({'message': 'Note created successfully!'}), 201
    elif request.method == 'GET':
        user_id = request.args.get('user_id')
        notes = Note.query.filter_by(user_id=user_id).all()
        return jsonify([{'note_id': note.note_id, 'note_title': note.note_title, 'note_content': note.note_content} for note in notes]), 200

if __name__ == '__main__':
    app.run(debug=True)
