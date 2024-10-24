import { useState } from "react"
import './App.css'
import axios from "axios"

const ASTNode = ({ node }) => {
  if (typeof node === "string" || typeof node === "number") {
    return <div className="leaf">{node}</div>;
  }
  return (
    <div className="node">
      <div className="node-value">{node.value}</div>
      <div className="children">
        <ASTNode node={node.left} />
        <ASTNode node={node.right} />
      </div>
    </div>
  );
};

function App() {
  const BACKEND_URL = 'http://127.0.0.1:5000'
  const [input, setInput] = useState("");
  const [ast, setAst] = useState("");
  const [data, setData] = useState("");
  // const ast = {
  //   value: "AND",
  //   left: {
  //     value: ">",
  //     left: "age",
  //     right: "30",
  //   },
  //   right: {
  //     value: "OR",
  //     left: {
  //       value: "=",
  //       left: "department",
  //       right: "'Sales'",
  //     },
  //     right: {
  //       value: "<",
  //       left: "salary",
  //       right: "50000",
  //     },
  //   },
  // };
  const ruleSubmitHandler = async () => {
    const res = await axios.post(
      `${BACKEND_URL}/create_rule`, {'rule' : input },
      {headers : { 'Content-Type' : 'application/json'}}
    )
    setAst(JSON.parse(res.data.ast_json))
  }

  const ruleEvaluateHandler = async () => {
    const res = await axios.post(
      `${BACKEND_URL}/evaluate_rule`, {'rule' : input, 'data': data},
      {headers : { 'Content-Type' : 'application/json'}}
    )

    alert(`The Rule evaluated against the given data is ${res.data.result}`)
  }
  return (
    <div className="text-center p-5">
      <p className="text-4xl">Rule AST Evaluator</p>
      <input className="border-5 border-black p-3 mr-2" value = {input} placeholder="rule" onChange={e => {setInput(e.target.value)}}></input>
      <button className="bg-blue-400 rounded-md p-3" onClick={ruleSubmitHandler}>Submit</button>

      <br/>
      <br/>
      <textarea rows={10} onChange={e => setData(e.target.value)}></textarea>
      <button className="bg-green-400 rounded-md p-3" onClick={ruleEvaluateHandler}>Evaluate</button>

      <br/>
      { ast != ""? <ASTNode node={ast}/> : <></> }

    </div>
  )
}

export default App
