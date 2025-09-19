import React, {useState} from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function App(){
  const [token,setToken] = useState(localStorage.getItem('token'))
  const [user,setUser] = useState(null)

  if (!token) return <Auth setToken={t=>{localStorage.setItem('token',t); setToken(t)}} />
  return <Dashboard token={token} />
}

function Auth({setToken}){
  const [email,setEmail]=useState('')
  const [pass,setPass]=useState('')
  const [mode,setMode]=useState('login')

  async function submit(e){
    e.preventDefault()
    const url = mode === 'login' ? '/api/login' : '/api/signup'
    const res = await axios.post(API+url, { email, password: pass, name: '' })
    setToken(res.data.token)
  }

  return (
    <div style={{padding:20}}>
      <h2>{mode}</h2>
      <form onSubmit={submit}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
        <button type="submit">{mode}</button>
      </form>
      <button onClick={()=>setMode(mode==='login'?'signup':'login')}>switch</button>
    </div>
  )
}

function Dashboard({token}){
  const [plans, setPlans] = React.useState([])
  React.useEffect(()=>{
    axios.get(API+'/api/plans').then(r=>setPlans(r.data))
  },[])
  return (
    <div style={{padding:20}}>
      <h1>Admin / Dashboard (MVP)</h1>
      <section>
        <h3>Plans</h3>
        <ul>{plans.map(p=> <li key={p.id}>{p.name} - {p.speed} - {p.price}₺</li>)}</ul>
      </section>
      <section>
        <h3>Quick actions</h3>
        <p>Ticket creation and basic stats will appear here.</p>
      </section>
    </div>
  )
}