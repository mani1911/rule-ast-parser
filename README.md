# Rule AST Parser
Parse and evaluate logical rules by converting to AST and other convinient format

## Setup

1. Clone the repository
2. Create a virtual environment for the python server by running\
  ```cd server &&  virtualenv venv && source venv/bin/activate```
3. Install all the necessary packages by running\
   ```cd server && pip install -r requirements.txt```
4. Run the python flask server by using the command
   ```python3 server/app.y```
   The server starts listening at port 5000

### Sample Rule Format
```((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)```

### Smaple Data format for the above Rule
```
data = {
    'age': 32,
    'department': 'Sales',
    'salary': 60000,
    'experience': 3
}
```

### Sample Output
![image](https://github.com/user-attachments/assets/cea74997-aaaa-4d4f-b54d-68b11093e59e)

