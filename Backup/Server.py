#!flask/bin/python
from flask import Flask, make_response
import csv
import json

app = Flask(__name__)

@app.route('/')
def index():
    return make_response(open('index.html').read())

@app.route('/api/heatmap/{id}')
def heatmap():
    csvfile = open('data.csv', 'r')
    fieldnames = ("State", "Year")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        list.append(row)
    return make_response(json.dumps(list))

if __name__ == '__main__':
    app.run(debug = True)