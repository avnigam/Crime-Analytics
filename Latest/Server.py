#!flask/bin/python
from flask import Flask, make_response, request
import csv
import json
from flask_cors import CORS, cross_origin
import collections
import math

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return make_response(open('index.html').read())

@app.route('/api/bar')
def data():
    state = request.args.get('state')
    year = request.args.get('year')
    print(state)
    print(year)
    list = []
    return make_response(json.dumps(list))

@app.route('/api/parallel')
def parallel():
    csvfile = open('parallel.csv', 'r')
    fieldnames = ("victim sex",	"victim age", "victim race", "relationship", "perpetrator race", "perpetrator age", "perpetrator sex")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        row = collections.OrderedDict(sorted(row.items()))
        row['victim age'] = int(row["victim age"])
        row['perpetrator age'] = int(row["perpetrator age"])
        list.append(row)
    return make_response(json.dumps(list))


@app.route('/api/stack')
def stack():
    csvfile = open('gender.csv', 'r')
    fieldnames = ("year", "male","female")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        row = collections.OrderedDict(sorted(row.items()))
        list.append(row)
    return make_response(json.dumps(list))

@app.route('/api/bar_weapon')
def weapon():
    state = request.args.get('state')
    year = request.args.get('year')
    csvfile = open('weapon.csv', 'r')
    fieldnames = ("weapon", "frequency")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        row = collections.OrderedDict(sorted(row.items()))
        row['frequency'] = math.log(float(row["frequency"]) + 5)
        list.append(row)
    list = sorted(list, key=lambda k: k['frequency'], reverse=True)
    return make_response(json.dumps(list))

@app.route('/api/line')
def line():
    csvfile = open('line.csv', 'r')
    fieldnames = ("month", "count")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        row = collections.OrderedDict(sorted(row.items()))
        row['count'] = int(row["count"])
        list.append(row)
    return make_response(json.dumps(list))

@app.route('/api/heatmap/')
def heatmap():
    state_map = dict()
    with open('database.csv') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            count = 0
            if (row['State'], row['Year']) in state_map.keys():
                count = state_map[(row['State'], row['Year'])]
            count += 1
            state_map[(row['State'], row['Year'])] = count

    list = []
    for key in state_map.keys():
        mapping = dict()
        mapping['state'] = key[0]
        mapping['year'] = key[1]
        mapping['count'] = state_map[key]
        mapping = collections.OrderedDict(sorted(mapping.items()))
        list.append(mapping)

    print(list)
    return make_response(json.dumps(list))

if __name__ == '__main__':
    app.run(debug = True)