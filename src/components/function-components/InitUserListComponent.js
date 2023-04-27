import React, { useEffect, useState } from "react"

import LoadingComponent from "./LoadingComponent"

export default function Retrieve (props) {
  const [users, setUsers] = useState([])
  const [searchName, setSearchName] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [late, setLate] = useState(2)
  const [isLate, setIsLate] = useState(false)
  let [date, setDate] = useState([])

  useEffect(() => {
    fetchData()
    // console.log('useEffect: ', users)
  }, [users])

  useEffect(() => {
    handleClickSearch()
  }, [users])

  async function fetchData () {
    let controller = new AbortController()
    let timeout = setTimeout(() => {
      controller.abort()
    }, 3000)

    await fetch('https://reqres.in/api/users?delay=' + late, { signal: controller.signal })
      .then(response => response.json())
      .then(json => {
        clearTimeout(timeout)
        setUsers(json.data)
        setLoading(false)
        setDate(new Date())
        handleClickSearch()
      })
      .catch(error => {
        clearTimeout(timeout)
        setLoading(true)
        console.error('Time out!' + error)
      })
  }

  function handleLate () {
    setIsLate(!isLate)
    if (isLate) {
      alert('response return with delay')
      setLate(5)
      setLoading(true)
      setUsers([])
      fetchData()
    } else {
      alert("resposne return normal")
      setLate(2)
      setLoading(true)
      setUsers([])
      fetchData()
    }
  }

  const hanldeChangeName = (event) => {
    setSearchName(event.target.value)
  }

  const handleClickSearch = () => {
    const buf = users.filter(user => {
      return user.first_name.toLowerCase().includes(searchName.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchName.toLowerCase()) ||
        user.email.toLowerCase().includes(searchName.toLowerCase()) ||
        user.id === Number(searchName)
    })
    setFilteredData(buf)
    console.log(filteredData)
  }

  const loadingComponent = []
  for (let i = 0; i < 6; i++) {
    loadingComponent.push(<LoadingComponent />)
  }


  return (
    <div>
      <h1>init the user lists</h1>
      <h2>Filter</h2>
      <p>Please input either user id or name or email</p>
      <input id="fist_name" type="text" value={searchName} onChange={hanldeChangeName} />
      <button onClick={handleClickSearch}>search</button>
      <hr />
      {
        loading ? loadingComponent : filteredData.map(user => (
          <div>
            <div className='photo'><img src={user.avatar} alt='' /></div>
            <div className='info' key={user.id}>
              <p>First Name: {user.first_name}</p>
              <p>Last Name: {user.last_name}</p>
              <p>Email Name: {user.email}</p>
            </div>
          </div>
        ))
      }
      <p>last update time: {date.toLocaleString()}</p>
      <h2> Late Simulation</h2>
      <hr />
      <button onClick={handleLate}>Simulate Late </button>

    </div>
  )
}

