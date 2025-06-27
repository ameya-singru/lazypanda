import os, subprocess, json
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://mongo:27017/lazypanda")
app.config["JWT_SECRET"] = os.getenv("JWT_SECRET", "supersecret")
mongo = PyMongo(app)

def auth_required(f):
    from functools import wraps
    @wraps(f)
    def decorator(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        try:
            data = jwt.decode(token, app.config["JWT_SECRET"], algorithms=["HS256"])
            request.user = data["user"]
        except:
            return jsonify({"error":"Auth failed"}), 401
        return f(*args, **kwargs)
    return decorator

@app.route("/api/register", methods=["POST"])
def register():
    u = request.json
    if mongo.db.users.find_one({"email": u["email"]}):
        return jsonify({"error":"Email exists"}), 400
    pw = generate_password_hash(u["password"])
    mongo.db.users.insert_one({"email":u["email"], "password":pw})
    return jsonify({"status":"ok"}), 201

@app.route("/api/login", methods=["POST"])
def login():
    u = request.json
    rec = mongo.db.users.find_one({"email": u["email"]})
    if rec and check_password_hash(rec["password"], u["password"]):
        token = jwt.encode({"user": str(rec["_id"]), "exp": datetime.utcnow()+timedelta(hours=6)}, app.config["JWT_SECRET"], algorithm="HS256")
        return jsonify({"token":token})
    return jsonify({"error":"Invalid creds"}), 401

@app.route("/api/search")
@auth_required
def search():
    q = request.args.get('q','')
    subprocess.run(['scrapy','crawl','product_spider', '-a', f'query={q}'], cwd='scraper')
    with open('scraper/items.json') as f:
        data = json.load(f)
    return jsonify(data[:3])

@app.route("/api/history", methods=["GET","POST"])
@auth_required
def history():
    user = request.user
    coll = mongo.db.history
    if request.method=="POST":
        entry = request.json
        entry.update({"user":user, "ts": datetime.utcnow()})
        coll.insert_one(entry)
    docs = list(coll.find({"user":user}).sort("ts",-1).limit(10))
    for d in docs:
        d["_id"]=str(d["_id"])
        d["ts"]=d["ts"].isoformat()
    return jsonify(docs)

if __name__=="__main__":
    app.run(host="0.0.0.0", port=5000)
