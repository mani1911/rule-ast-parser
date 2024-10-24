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
  const [input1, setInput1] = useState("");
  const [ast, setAst] = useState("");
  const [data, setData] = useState("");
  const [input2, setInput2] = useState("");
  const [op, setOp] = useState("");

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
    // console.log(input1);
    // console.log(input2);
    // console.log(op);
    if(op != "" && input1 != "" && input2 != ""){
      const res = await axios.post(
        `${BACKEND_URL}/combine_rules`, {'rule1' : input1, 'rule2' : input2, 'op': op },
        {headers : { 'Content-Type' : 'application/json'}}
      )

      console.log(res.data)
      setAst(JSON.parse(res.data.ast_json))
    } else if(input1 != "" || input2 != "") {
      const res = await axios.post(
        `${BACKEND_URL}/create_rule`, {'rule' : input1 != ""? input1: input2 },
        {headers : { 'Content-Type' : 'application/json'}}
      )
      setAst(JSON.parse(res.data.ast_json))
    }

  }

  const ruleEvaluateHandler = async () => {

    if((input1 == "" && input2 == "")) return;
    if(data == "") return;
    const res = await axios.post(
      `${BACKEND_URL}/evaluate_rule`, {'rule' : input1 != ""? input1: input2, 'data': data},
      {headers : { 'Content-Type' : 'application/json'}}
    )

    alert(`The Rule evaluated against the given data is ${res.data.result}`)
  }

  return (
    <div className="text-center p-5">
      <p className="text-4xl">Rule AST Evaluator</p>
      <input className="border-5 border-black p-3 mr-2" value = {input1} placeholder="rule" onChange={e => {setInput1(e.target.value)}}></input>
      <select className="m-5 p-2" onChange={e => setOp(e.target.value)}>
        <option value = "">None</option>
        <option value = "AND">AND</option>
        <option value = "OR">OR</option>
      </select>
      <input className="border-5 border-black p-3 mr-2" value = {input2} placeholder="rule" onChange={e => {setInput2(e.target.value)}}></input>
      <br/>
      <button className="bg-blue-400 rounded-md p-3" onClick={ruleSubmitHandler}>Submit</button>

      <br/>
      <br/>
      <textarea className="m-2" rows={10} onChange={e => setData(e.target.value)}></textarea>

      <br/>
      <button className="bg-green-400 rounded-md p-3" onClick={ruleEvaluateHandler}>Evaluate</button>

      <br/>
      { ast != ""? <ASTNode node={ast}/> : <></> }

    </div>
  )
}

export default App
