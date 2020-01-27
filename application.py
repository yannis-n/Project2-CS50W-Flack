import os
import requests

from flask import Flask,render_template, redirect, request, url_for, jsonify, request
from flask_socketio import SocketIO, emit, join_room, leave_room, send

session=dict()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = ["General"]
# channel_messages = [{"channel_name":"General", "message":"Write something to begin a conversation!", "messenger":"Flack", "timestamp":""},{"channel_name":"Not General", "message":"It works!", "messenger":"Flask", "timestamp":""}]
messages_ch = {"General" : [{"id":0, "message":"Write something to begin a conversation!", "messenger":"Flack", "timestamp":""}]}
# messages = list()
counter = dict()
users = list()

@app.route("/", methods=["GET"])
def index():

    return render_template("index.html", channels=channels, users=users)

@app.route("/check", methods=["POST"])
def check_username():
    username_input = request.form.get("username_input")
    if username_input not in users:
        return jsonify({"taken": False})
    return jsonify({"taken": True})

@app.route("/check_channel_name", methods=["POST"])
def check_channel_name():
    channel_name = request.form.get("channel_name")
    if channel_name in channels:
        return jsonify({"taken": True})
    return jsonify({"taken": False})

@socketio.on("add_user")
def add_user(data):
    users.append(data["username"])
    emit("user_list", {'user':data["username"]},broadcast=True)



@socketio.on("create_channel")
def create_channel(data):
    new_channel = data["channel_name"]
    channels.append(new_channel)
    emit("channelsList", {'new_channel':new_channel}, broadcast=True)

@app.route("/<channel>", methods=["POST","GET"])
def channel(channel):

    if request.method == "POST":
            # messages = load_messages(channel)
        if channel in messages_ch:
            return jsonify(messages_ch[channel])
        return jsonify([{"id": "none", "message":"Begin a Conversation!", "messenger":"Flack", "timestamp":""}])
    else:
        return redirect("/")


@socketio.on("submit_message")
def submit_message(data):
    # channel_messages.append(data)
    # if data["channel_name"] in counter:
    #     counter[data["channel_name"]] += 1
    # else:
    #     counter[data["channel_name"]] = 0
    # if counter[data["channel_name"]] >= 101:
    #     for message in channel_messages:
    #         if message["channel_name"] ==  data["channel_name"]:
    #             del message
    #             break
    #
    # if messages:
    #     messages.clear()
    # for message in channel_messages:
    #     if (data["channel_name"]==message["channel_name"]):
    #         messages.append(message)
    if data["channel_name"] in messages_ch:
        message_info = {"id":messages_ch[data["channel_name"]][len(messages_ch[data["channel_name"]])-1]["id"] + 1,"message":data["message"], "messenger":data["messenger"], "timestamp":data["timestamp"]}
    else:
        message_info = {"id":0,"message":data["message"], "messenger":data["messenger"], "timestamp":data["timestamp"]}

    if not data["channel_name"] in messages_ch:
        messages_ch[data["channel_name"]] = [message_info]
    else:
        messages_ch[data["channel_name"]].append(message_info)
    if len(messages_ch[data["channel_name"]]) >= 100:
        messages_ch[data["channel_name"]].pop(0)

    room = data["channel_name"]
    emit("add_message", {'messages':[message_info]}, room=room)

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    emit("joined", {'username': username}, room=room)


@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    emit("left", {'username': username}, room=room)

@socketio.on('delete_message')
def delete_message(data):
    id = int(data['id'])
    for i in range(len(messages_ch[data["channel_name"]])):
        if messages_ch[data["channel_name"]][i]['id'] == id:
            messages_ch[data["channel_name"]].pop(i)
    room=data["channel_name"]
    print(2)
    emit("deleted_message", {'id':data["id"]}, room=room)



def load_messages(channel_name):
    if messages:
        messages.clear()
    for message in channel_messages:
        if (message["channel_name"]==channel_name):
            messages.append(message)
    return messages


if __name__ == '__main__':
    socketio.run(app)
