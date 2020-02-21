from flask_socketio import emit
from flask import Flask, jsonify
from flask_socketio import SocketIO
import flask
import os
import random
import requests

access_token = os.getenv("ACCESS_TOKEN")

# changed
present = {};

min_song = 1
max_song = 4696998

app = Flask(__name__, static_folder='.', static_url_path='')

socketio = SocketIO(app)

def getSongID():
  return random.randrange(min_song, max_song)

def makeRequest():
  base_url = "https://api.genius.com/songs/"
  PARAMS = {'access_token': access_token}

  r = requests.get(url = base_url + str(getSongID()) + "/", params = PARAMS)

  return r


@app.route("/")
def index():
  print("ok")
  return flask.render_template('index.html')

@app.route("/about")
def about():
  return flask.render_template('about.html')

@app.route("/credits")
def credits():
  return flask.render_template('credits.html')

@app.route("/composer")
def composer():
  return flask.render_template('composer.html')

@app.route("/midi")
def midi():
  return flask.render_template('midi.html')

@app.route("/sa-re-ga-me-pa-dha-ni")
def game():
  return flask.render_template('game.html')

@app.route("/getsong/")
def getsong():
  featured = []

  r = makeRequest()

  while r.status_code == 404:
      r = makeRequest()

  jsonResponse = r.json()
  if jsonResponse['meta']['status'] != 200:
      getsong()

  song_details = jsonResponse['response']['song']
  song_title = song_details['title']
  song_title = song_title.upper()
  try:
      album = song_details['album']['name']
  except:
      getsong()

  artist = song_details['primary_artist']['name'];

  for i in range(len(song_details['featured_artists'])):
      featured.append(song_details['featured_artists'][i]['name'])

  release = song_details['release_date'];

  data = {"song_title": song_title, "artist": artist, "album": album, "release": release, "featured": featured}

  return jsonify(data)

@app.route("/public-room")
def public_room():
  return flask.render_template('public-room.html')

@app.route("/private-room")
def private_room():
  return flask.render_template('private-room.html')

@socketio.on('connect')
def on_connect():
    # changed
    emit('test', {'already_present': present}, broadcast=True)

@socketio.on("note_sent")
def note_broadcast(note):
  note = note["note"].split(" ")
  classes_list = ''
  for i in note:
    classes_list += "."+i
  # changed
  if classes_list[0:18] not in present:
    present[classes_list[0:18]] = True
  else:
    present[classes_list[0:18]] = not present[classes_list[0:18]]
  emit("broadcast_note", classes_list, broadcast=True)

@socketio.on("add_time")
def add_time():
  emit("time_add", broadcast=True)

@socketio.on("remove_time")
def remove_time():
  emit("time_remove", broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True)