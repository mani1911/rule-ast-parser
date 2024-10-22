from flask import Flask, render_template, request
from pymongo import MongoClient
import json
from helpers.ast import parse, tokenize, evaluate, ASTNode, combine_rules

app = Flask(__name__)
client = MongoClient('localhost', 27017)

db = client.flask_db

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/create_rule', methods=['POST'])
def create_rule():
    body = request.get_json()
    return f'Welcome to the Flask app.'


@app.route('/evaluate_rule', methods = ['POST'])
def evaluate_rule():
    
    try:
        body = request.json
        rule = body.get('rule')
        json_data = json.loads(body.get('data'))
        
        ast_node = parse(tokenize(rule))
        eval_answer = evaluate(ast_node, json_data)
        
        return json.dumps({'result' : eval_answer})
    except Exception as e:
        return f'Error evaluating the rule', 500

@app.route('/combine_rules', methods = ['POST'])
def combine_ast_rules():
    try:
        body = request.json
        rule1, rule2, op = body.get('rule1'), body.get('rule2'), body.get('op')
        print(rule1, rule2, op)
        
        combined_ast = combine_rules(rule1, rule2, op)
        print(combined_ast)
        
        return f'rules successfully combined', 200

    except Exception as e:
        print(e)
        return 'Cannot combine rules', 500

if __name__ == '__main__':
    app.run(debug=True)