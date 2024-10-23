import operator
import json 

class ASTNode:
    def __init__(self, value, left=None, right=None):
        self.value = value  
        self.left = left    
        self.right = right  
        
    def to_dict(self):
        if self.left is None and self.right is None:
            print(self.value)
            return {'value': self.value[0], 'left' : self.value[1], 'right' : self.value[2]}
        else:
            return {
                'value': self.value,
                'left': self.left.to_dict() if self.left else None,
                'right': self.right.to_dict() if self.right else None
            }

def tokenize(expression):
    tokens = []
    temp = ""
    for char in expression:
        if char in '() ':
            if temp:
                tokens.append(temp)
                temp = ""
            if char != ' ':
                tokens.append(char)
        else:
            temp += char
    if temp:
        tokens.append(temp)
    return tokens


def parse(tokens):
    def parse_expression(index):
        if tokens[index] == '(':
            index += 1
            left, index = parse_expression(index)
            op = tokens[index]
            index += 1
            right, index = parse_expression(index)
            node = ASTNode(op, left, right)
            index += 1  
            return node, index
        else:
            left_operand = tokens[index]
            op = tokens[index + 1]
            right_operand = tokens[index + 2]
            node = ASTNode((op, left_operand, right_operand))
            return node, index + 3

    ast, _ = parse_expression(0)
    return ast

def evaluate(node, data):
    if isinstance(node.value, tuple):
        op, left_operand, right_operand = node.value
        left_value = data[left_operand]
        right_value = float(right_operand) if right_operand.isdigit() else right_operand
        
        ops = {
            '>': operator.gt,
            '<': operator.lt,
            '=': operator.eq
        }
        return ops[op](left_value, right_value)
    
    left_value = evaluate(node.left, data)
    right_value = evaluate(node.right, data)

    if node.value == 'AND':
        return left_value and right_value
    elif node.value == 'OR':
        return left_value or right_value
    

def combine_rules(expr1, expr2, logical_op):
    tokens1 = tokenize(expr1)
    tokens2 = tokenize(expr2)
    
    ast1 = parse(tokens1)
    ast2 = parse(tokens2)

    combined_ast = ASTNode(logical_op, ast1, ast2)
    return combined_ast


def evaluate_from_json(ast_json, data):
    if 'left' not in ast_json and 'right' not in ast_json:
        condition = ast_json['value']
        op, left_operand, right_operand = condition
        
        left_value = data[left_operand]
        right_value = float(right_operand) if right_operand.isdigit() else right_operand
        
        ops = {
            '>': operator.gt,
            '<': operator.lt,
            '=': operator.eq
        }
        
        return ops[op](left_value, right_value)
    
    left_value = evaluate_from_json(ast_json['left'], data)
    right_value = evaluate_from_json(ast_json['right'], data)
    
    if ast_json['value'] == 'AND':
        return left_value and right_value
    elif ast_json['value'] == 'OR':
        return left_value or right_value


expression1 = "(age < 33 OR department = 'Sales')"
expression2 = "(experience > 5 OR salary = 60)"

tokens = tokenize(expression1)
ast = parse(tokens)


print(ast.to_dict())

# data = {
#     'age': 32,
#     'department': 'Sales',
#     'salary': 60000,
#     'experience': 3
# }

# combined_ast = combine_rules(expression1, expression2, 'OR')
# print(evaluate(ast, data))

