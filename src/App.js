import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const Form = styled.form`
text-align: center;
display: grid;
grid-template-columns: repeat(2,1fr);
grid-gap: 20px;
width: 600px;
margin: auto;
> * {
  padding: 10px;
}
`
const Heading = styled.h1`
text-align: center;
`
const Pin = styled.input`
grid-area: 2/1/3/3;
`

const Address = styled.textarea`
grid-area: 3/1/4/3;
`

const Apartments = styled.input`
grid-area: 4/1/5/3;
`
const City = styled.input`
grid-area: 5/1/6/3;
`
const Phone = styled.input`
grid-area: 7/1/8/3;
`
const SubHeading = styled.h4`
text-align: center;
color: red;
`

function App () {
  const [address, setAddress] = useState([])
  const [city, setCity] = useState('')
  const [country, setCountry] = useState([])
  const [states, setState] = useState([])
  const [pin, setPin] = useState('')
  const [isPin, SetIsPin] = useState(false)
  const [response, setResponse] = useState('')

  useEffect(() => {
    fetchPin(`https://api.postalpincode.in/pincode/${pin}`)
  }, [isPin])


  function valuesFilter (array) {
    return array.PostOffice.map(item => item.District).reduce((acc, cv) => {
      if (acc.indexOf(cv) === -1) {
        acc.push(cv)
        return acc
      }
      return acc
    }, [])
  }

  async function fetchPin (url) {
    const response = await window.fetch(url)
    const result = await response.json()
    if (result[0].Status === ('404' || 'Error')) {
      setResponse(result[0].Message)
    }

    if (result[0].Status === 'Success') {
     
      setResponse('')
      const address = result[0].PostOffice.map(item => {
        return `${item.Name}, ${item.Division} Division,
         ${item.Region} Region, ${item.Block} TQ, ${item.District} (Dist), 
         ${item.State}, ${item.Country}, PIN-${item.Pincode}.
    
         `
      })

      const city = valuesFilter(result[0],)
      setCity(city[0])
      setAddress(address)
    }
  }

  function handlePin (e) {
    const val = e.target.value
    setPin(val)
  }
  function handleSearchPin () {
    SetIsPin(true)
  }
  return (
    <>
      <Heading>Shipping Address</Heading>
      <SubHeading>{response}</SubHeading>
      <Form>
        <input type='text' placeholder='First Name' name='firstName' />
        <input type='text' placeholder='Last Name' name='lastName' />

        <Pin type='text' placeholder='Pin Code' name='pinCode' value={pin} onChange={handlePin} onBlur={handleSearchPin} />

        <Address type='text' placeholder='Address' name='address' value={address.map(item => item)} />

        <Apartments type='text' placeholder='Apartments, suite, etc(Optional)' />

        <City type='text' placeholder='City' value={city} />

        <select placeholder='Country/Region'>
          <option>India</option>
          {country.map(item => {
            return (<option key={item}>{item}</option>)
          })}
        </select>
        <select placeholder='State'>
          <option>State</option>
          {states.map(item => {
            return (<option key={item}>{item}</option>)
          })}
        </select>

        <Phone type='text' placeholder='Phone number' />

      </Form>
    </>
  )
}

export default App
