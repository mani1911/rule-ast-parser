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
  const [ast, setAst] = useState({})
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

    console.log(typeof ast)
  }
  return (
    <div>
      <input value = {input} placeholder="rule" onChange={e => {setInput(e.target.value)}}></input>
      <button onClick={ruleSubmitHandler}>Submit</button>

      <br/>
      { ast != {}? <ASTNode node={ast}/> : <></> }

    </div>
  )
}

export default App
