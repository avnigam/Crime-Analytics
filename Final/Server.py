#!flask/bin/python
from flask import Flask, make_response, request
import csv
import json
from flask_cors import CORS, cross_origin
import collections
import math
import calendar
from datetime import datetime

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
    list = []
    if choice == 'v_gender' or choice == 'p_gender':
        if choice == 'v_gender':
            csvfile = open('st_v_gender.csv', 'r')
        else:
            csvfile = open('st_p_gender.csv', 'r')

        fieldnames = ("state","year", "male","female","unknown")
        reader = csv.DictReader(csvfile, fieldnames)
        list = []
        for row in reader:
            if row['state'] == state:
                row = collections.OrderedDict(sorted(row.items()))
                list.append(row)

    elif choice == 'v_age' or choice == 'p_age':
        if choice == 'v_age':
            csvfile = open('st_v_age.csv', 'r')
        else:
            csvfile = open('st_p_age.csv', 'r')

        fieldnames = ("state","year", "young","middle","old")
        reader = csv.DictReader(csvfile, fieldnames)
        list = []
        for row in reader:
            if row['state'] == state:
                row = collections.OrderedDict(sorted(row.items()))
                list.append(row)

    elif choice == 'v_race' or choice == 'p_race':
        if choice == 'v_race':
            csvfile = open('st_v_race.csv', 'r')
        else:
            csvfile = open('st_p_race.csv', 'r')

        fieldnames = ("state","year", "Asian / Pacific","Black","Native American / Alaska Native", "Unknown", "White")
        reader = csv.DictReader(csvfile, fieldnames)
        list = []
        for row in reader:
            if row['state'] == state:
                row = collections.OrderedDict(sorted(row.items()))
                list.append(row)

    return make_response(json.dumps(list))

@app.route('/api/bar/<year>/<state>/<choice>')
def weapon(year, state, choice):
    list = []
    csvfile = ''
    if choice == 'weapon':
        csvfile = open('bar_weapon.csv', 'r')
    elif choice == 'v_age':
        csvfile = open('bar_v_age.csv', 'r')
    elif choice == 'p_age':
        csvfile = open('bar_p_age.csv', 'r')
    elif choice == 'v_race':
        csvfile = open('bar_v_race.csv', 'r')
    elif choice == 'p_race':
        csvfile = open('bar_p_race.csv', 'r')


    fieldnames = ("state", "year", "data", "frequency")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        if row['state'] == state and row['year'] == year:
            data = collections.OrderedDict()
            #row = collections.OrderedDict(sorted(row.items()))
            data['frequency'] = math.log(float(row["frequency"]) + 5)
            data['data'] = row['data']
            list.append(data)

    list = sorted(list, key=lambda k: k['frequency'], reverse=True)

    return make_response(json.dumps(list))

@app.route('/api/line/<year>/<state>')
def line(year, state):
    csvfile = open('Line_Homicide.csv', 'r')
    fieldnames = ("state", "year", "date", "count")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        if row['state'] == state and row['year'] == year:
            data = collections.OrderedDict()
            data['count'] = int(row['count'])
            data['date'] = row['date'][0:3]
            list.append(data)

    list = sorted(list, key=lambda day: datetime.strptime(day['date'], "%b"))
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