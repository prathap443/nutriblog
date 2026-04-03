from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

blogs = [
    {"id": 1, "title": "Why Most Diets Fail", "excerpt": "Most diets fail because they are too strict.", "category": "Weight Loss", "date": "2026-03-28", "author": "Diet App Team", "content": "Most diets fail because they are too strict and hard to follow long term. Sustainable habits win."},
    {"id": 2, "title": "High-Protein Foods That Keep You Full", "excerpt": "Protein keeps you full longer.", "category": "Nutrition", "date": "2026-03-28", "author": "Diet App Team", "content": "Eggs, chicken, Greek yogurt, and lentils help reduce cravings and improve energy."},
    {"id": 3, "title": "Smart Restaurant Eating Tips", "excerpt": "Eat smart when dining out.", "category": "Lifestyle", "date": "2026-03-28", "author": "Diet App Team", "content": "Choose grilled over fried, control portions, and prioritize protein."}
]

@app.route("/")
def home():
    return "Diet Blog API Running"

@app.route("/blogs", methods=["GET"])
def get_blogs():
    return jsonify(blogs)

@app.route("/blogs/<int:blog_id>", methods=["GET"])
def get_blog(blog_id):
    blog = next((b for b in blogs if b["id"] == blog_id), None)
    if blog:
        return jsonify(blog)
    return jsonify({"error": "Not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
