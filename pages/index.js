import { useState } from 'react'
import Header from '../components/header'
import { command } from '../utils'

export default () => {
  const [apdu, setApdu] = useState('')
  const [logs, setLogs] = useState([])

  async function handleClick() {
    const newLogs = [
      ...logs,
      {
        type: 'info',
        data: `Sending command with apdu: ${apdu}`,
      },
    ]
    setLogs(newLogs)

    try {
      const data = await command(apdu)
      setLogs([
        ...newLogs,
        {
          type: 'success',
          data: `Result: ${data}`,
        },
      ])
    } catch (e) {
      setLogs([
        ...newLogs,
        {
          type: 'error',
          data: e.toString(),
        },
      ])
    }
  }

  return (
    <main>
      <Header />
      <section>
        <label>APDU: (hex)</label>
        <input type="text" value={apdu} onChange={e => setApdu(e.target.value)} />
        <button onClick={handleClick}>Send</button>

        <p>
          Notice: we&#39;ll convert APDU to WebSafeBase64, which means replacing:
          <br />
          <code>/</code> to <code>_</code>
          <br />
          <code>+</code> to <code>-</code>
          <br />
          <code>=</code> to empty string
        </p>

        <h4>LOG</h4>
        <ul>
          {logs.map(({ type, data }, index) => (
            <li key={index}>
              <span className={`is-${type}`}>{type.toUpperCase()}</span>
              <p>{data}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
