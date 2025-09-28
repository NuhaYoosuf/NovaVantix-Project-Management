from database import SessionLocal, engine
from models import User, Project, Task, UserRole, TaskStatus
from auth import get_password_hash

def seed_data():
    db = SessionLocal()
    
    try:
        # Check if users already exist
        existing_admin = db.query(User).filter(User.email == "admin@demo.test").first()
        existing_alice = db.query(User).filter(User.email == "alice@demo.test").first()
        existing_bob = db.query(User).filter(User.email == "bob@demo.test").first()
        
        users_to_add = []
        
        # Create users only if they don't exist
        if not existing_admin:
            admin = User(
                name="Admin User",
                email="admin@demo.test",
                password_hash=get_password_hash("Passw0rd!"),
                role=UserRole.ADMIN
            )
            users_to_add.append(admin)
            print("✅ Created admin user: admin@demo.test / Passw0rd!")
        else:
            admin = existing_admin
            print("ℹ️  Admin user already exists: admin@demo.test / Passw0rd!")
        
        if not existing_alice:
            alice = User(
                name="Alice",
                email="alice@demo.test",
                password_hash=get_password_hash("password123"),
                role=UserRole.MEMBER
            )
            users_to_add.append(alice)
            print("✅ Created user: alice@demo.test / password123")
        else:
            alice = existing_alice
            print("ℹ️  Alice user already exists: alice@demo.test / password123")
        
        if not existing_bob:
            bob = User(
                name="Bob",
                email="bob@demo.test",
                password_hash=get_password_hash("password123"),
                role=UserRole.MEMBER
            )
            users_to_add.append(bob)
            print("✅ Created user: bob@demo.test / password123")
        else:
            bob = existing_bob
            print("ℹ️  Bob user already exists: bob@demo.test / password123")
        
        if users_to_add:
            db.add_all(users_to_add)
            db.commit()
        
        # Check if project already exists
        existing_project = db.query(Project).filter(Project.name == "Website Redesign").first()
        if not existing_project:
            project = Project(
                name="Website Redesign",
                description="Complete overhaul of company website"
            )
            db.add(project)
            db.commit()
            print("✅ Created project: Website Redesign")
        else:
            project = existing_project
            print("ℹ️  Project already exists: Website Redesign")
        
        # Check if tasks already exist
        existing_tasks = db.query(Task).filter(Task.project_id == project.id).count()
        if existing_tasks == 0:
            tasks = [
                Task(project_id=project.id, title="Design homepage", assignee_user_id=alice.id),
                Task(project_id=project.id, title="Implement backend", assignee_user_id=bob.id, status=TaskStatus.IN_PROGRESS),
                Task(project_id=project.id, title="Write documentation", assignee_user_id=alice.id, status=TaskStatus.TODO),
            ]
            db.add_all(tasks)
            db.commit()
            print("✅ Created sample tasks")
        else:
            print("ℹ️  Tasks already exist for the project")
        
        print("\n🎉 Seed data completed successfully!")
        print("\n📝 Demo Credentials:")
        print("Admin: admin@demo.test / Passw0rd!")
        print("Member: alice@demo.test / password123")
        print("Member: bob@demo.test / password123")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()