"""
Utility functions for authentication and session management
"""
import uuid
import bcrypt
from datetime import datetime, timedelta
from models import UserTbl, Session, db

class AuthUtils:
    """Authentication utility functions"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt"""
        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_bytes, salt)
        return hashed.decode('utf-8')
    
    @staticmethod
    def verify_password(password: str, password_hash: str) -> bool:
        """Verify a password against its hash"""
        password_bytes = password.encode('utf-8')
        hash_bytes = password_hash.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hash_bytes)
    
    @staticmethod
    def generate_session_id() -> str:
        """Generate a unique session ID"""
        return str(uuid.uuid4())
    
    @staticmethod
    def create_user(firstname: str, lastname: str, title: str, username: str, password: str) -> UserTbl:
        """Create a new user with hashed password"""
        # Check if username already exists
        existing_user = UserTbl.query.filter_by(username=username).first()
        if existing_user:
            raise ValueError("Username already exists")
        
        # Hash password
        password_hash = AuthUtils.hash_password(password)
        
        # Create new user
        new_user = UserTbl(
            firstname=firstname,
            lastname=lastname,
            title=title,
            username=username,
            passwordhash=password_hash
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return new_user
    
    @staticmethod
    def authenticate_user(username: str, password: str) -> UserTbl:
        """Authenticate user with username and password"""
        user = UserTbl.query.filter_by(username=username).first()
        
        if not user:
            return None
        
        if AuthUtils.verify_password(password, user.passwordhash):
            return user
        
        return None
    
    @staticmethod
    def create_session(user_id: int, expires_hours: int = 24) -> Session:
        """Create a new session for a user"""
        session_id = AuthUtils.generate_session_id()
        expires_at = datetime.utcnow() + timedelta(hours=expires_hours)
        
        # Deactivate existing sessions for the user
        Session.query.filter_by(user_id=user_id, is_active=True).update({'is_active': False})
        
        # Create new session
        new_session = Session(
            session_id=session_id,
            user_id=user_id,
            expires_at=expires_at,
            is_active=True
        )
        
        db.session.add(new_session)
        db.session.commit()
        
        return new_session
    
    @staticmethod
    def validate_session(session_id: str) -> Session:
        """Validate a session ID"""
        session = Session.query.filter_by(
            session_id=session_id,
            is_active=True
        ).first()
        
        if not session:
            return None
        
        # Check if session is expired
        if session.expires_at and session.expires_at < datetime.utcnow():
            session.is_active = False
            db.session.commit()
            return None
        
        return session
    
    @staticmethod
    def invalidate_session(session_id: str) -> bool:
        """Invalidate a session"""
        session = Session.query.filter_by(session_id=session_id).first()
        if session:
            session.is_active = False
            db.session.commit()
            return True
        return False

def validate_registration_data(data: dict) -> dict:
    """Validate registration data and return errors if any"""
    errors = {}
    
    required_fields = ['firstname', 'lastname', 'username', 'password']
    for field in required_fields:
        if not data.get(field) or not data.get(field).strip():
            errors[field] = f"{field.capitalize()} is required"
    
    # Username validation
    username = data.get('username', '').strip()
    if username:
        if len(username) < 3:
            errors['username'] = "Username must be at least 3 characters long"
        if len(username) > 80:
            errors['username'] = "Username must be less than 80 characters"
    
    # Password validation
    password = data.get('password', '')
    if password:
        if len(password) < 6:
            errors['password'] = "Password must be at least 6 characters long"
        if len(password) > 100:
            errors['password'] = "Password must be less than 100 characters"
    
    # Name validation
    firstname = data.get('firstname', '').strip()
    if firstname and len(firstname) > 100:
        errors['firstname'] = "First name must be less than 100 characters"
    
    lastname = data.get('lastname', '').strip()
    if lastname and len(lastname) > 100:
        errors['lastname'] = "Last name must be less than 100 characters"
    
    # Title validation (optional)
    title = data.get('title', '').strip()
    if title and len(title) > 50:
        errors['title'] = "Title must be less than 50 characters"
    
    return errors
