#!flask/bin/python
from flask import Flask, make_response, request
import csv
import json
from flask_cors import CORS, cross_origin
import collections
import math
import calendar

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return make_response(open('index.html').read())

@app.route('/api/parallel/<year>/<state>')
def parallel(year, state):
    csvfile = open('parallel_data.csv', 'r')
    fieldnames = ("state", "year", "victim sex", "victim age", "victim race", "relationship", "perpetrator race", "perpetrator age", "perpetrator sex")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        if row['state'] == state and row['year'] == year:
            data = collections.OrderedDict()
            data['perpetrator age'] = int(row["perpetrator age"])
            data['perpetrator race'] = row['perpetrator race']
            data['perpetrator sex'] = row['perpetrator sex']
            data['relationship'] = row['relationship']
            data['victim age'] = int(row["victim age"])
            data['victim race'] = row['victim race']
            data['victim sex'] = row['victim sex']
            list.append(data)
    return make_response(json.dumps(list))


@app.route('/api/stack/<state>/<choice>')
def stack(state, choice):
    csvfile = open('st_gender_data.csv', 'r')
    fieldnames = ("state","year", "male","female")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        if row['state'] == state:
            row = collections.OrderedDict(sorted(row.items()))
            list.append(row)

    return make_response(json.dumps(list))

@app.route('/api/bar/<year>/<state>/<choice>')
def weapon(year, state, choice):
    if choice == 'weapon':
        csvfile = open('bar_weapon.csv', 'r')
        fieldnames = ("state", "year", "weapon", "frequency")
        reader = csv.DictReader(csvfile, fieldnames)
        list = []
        for row in reader:
            if row['state'] == state and row['year'] == year:
                data = collections.OrderedDict()
                #row = collections.OrderedDict(sorted(row.items()))
                data['frequency'] = math.log(float(row["frequency"]) + 5)
                data['weapon'] = row['weapon']
                list.append(data)
        list = sorted(list, key=lambda k: k['frequency'], reverse=True)
        return make_response(json.dumps(list))
    elif choice == ''

@app.route('/api/line/<year>/<state>/<choice>')
def line(year, state, choice):
    csvfile = open('Line_Homicide.csv', 'r')
    fieldnames = ("state", "year", "month", "count")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        if row['state'] == state and row['year'] == year:
            data = collections.OrderedDict()
            data['count'] = int(row["count"])
            data['month'] = row['month']
            list.append(data)
    #list = sorted(list, key=lambda k: k['month'])

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

    return make_response(json.dumps(list))

if __name__ == '__main__':
    app.run(debug = True)