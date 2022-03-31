import "./App.css";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useState } from "react";

const COUNTRIES = gql`
  query {
    countries {
      id
      name
    }
  }
`;

const REGIONS = gql`
  query regions($countryID: ID!){
    regions(countryID: $countryID) {
      id
      name
    }
  }
`

const NEW_REGION = gql`
  mutation newRegion($name: String! $countryID: ID!) {
    newRegion(name: $name countryID: $countryID) {
      id
      name
    }
  }
`

function App() {
  const [countryID, setCountryID] = useState('')

  const { data, error } = useQuery(COUNTRIES);
  const { data: regionData } = useQuery(REGIONS, {
    variables: { countryID }
  });

  const [newRegion, { data: newregionData }] = useMutation(NEW_REGION, {
    update(cache, data) {
      console.log(data);
    }
  })

  const handleSubmit = e => {
    e.preventDefault()

    const { select, region } = e.target.elements
    newRegion({
      variables: {
        name: region.value,
        countryID: select.value
      }
    })
  }
  
  return (
  <>
  {error && <>error</>}

  <form onSubmit={handleSubmit}>
    <select name="select">
      <option value={'select'} hidden>Choose</option>

      {
        data && data.countries.map((e, i) => (
          <option key={i} value={e.id}>{e.name}</option>
        ))
      }
    </select>
    <input name="region" type="text" placeholder="region..." />
    <button type="submit">Send</button>
  </form>

    {
      data && data.countries.map((e, i) => (
        <h3 onClick={() => setCountryID(e.id)} key={i}>{e.name}</h3>
      ))
    }

    {
      regionData && regionData.regions.map((e, i) => (
        <h3 onClick={() => setCountryID(e.id)} key={i}>{e.name}</h3>
      ))
    }
  </>
  )
}

export default App;
