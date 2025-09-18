# Database Schema Documentation

## Tables

### USERTBL
The main user table that stores user registration information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique user identifier |
| firstname | VARCHAR(100) | NOT NULL | User's first name |
| lastname | VARCHAR(100) | NOT NULL | User's last name |
| title | VARCHAR(50) | NULLABLE | User's title (Mr., Ms., Dr., etc.) |
| username | VARCHAR(80) | UNIQUE, NOT NULL | Unique username for login |
| passwordhash | VARCHAR(128) | NOT NULL | Bcrypt hashed password |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Record last update timestamp |

### SESSION
Session management table for tracking user sessions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique session identifier |
| session_id | VARCHAR(36) | UNIQUE, NOT NULL | UUID session identifier |
| user_id | INTEGER | FOREIGN KEY (USERTBL.id), NOT NULL | Reference to user |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Session creation timestamp |
| expires_at | DATETIME | NULLABLE | Session expiration timestamp |
| is_active | BOOLEAN | DEFAULT TRUE | Session active status |

## Relationships

- **SESSION.user_id** → **USERTBL.id** (Many-to-One)
  - One user can have multiple sessions
  - Each session belongs to exactly one user

## Indexes

- **USERTBL.username** - Unique index for fast username lookups
- **SESSION.session_id** - Unique index for fast session validation
- **SESSION.user_id** - Index for user session queries

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with salt
2. **Session Management**: UUID-based session IDs with expiration
3. **Username Uniqueness**: Enforced at database level
4. **Session Cleanup**: Inactive sessions are marked as inactive

## Sample Data

```sql
-- Sample user record
INSERT INTO USERTBL (firstname, lastname, title, username, passwordhash)
VALUES ('John', 'Doe', 'Mr.', 'johndoe', '$2b$12$...');

-- Sample session record  
INSERT INTO SESSION (session_id, user_id, expires_at, is_active)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 1, '2025-09-19 07:00:00', TRUE);
```

## Database File Location

- **Development**: `dev_app.db`
- **Production**: `app.db`
- **Testing**: In-memory SQLite database
