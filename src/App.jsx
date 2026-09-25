import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Get all Pokémon from the API
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1025")
      .then((response) => response.json())
      .then((data) => {
        return Promise.all(
          data.results.map((item) =>
            fetch(item.url).then((response) => response.json())
          )
        );
      })
      .then((data) => {
        setPokemon(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  // Search Pokémon
  const filteredPokemon = pokemon.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <h1>Pokédex</h1>
        <p>Explore the world of Pokémon</p>
      </header>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* Loading */}
      {loading && (
        <h2 className="loading">
          Loading all Pokémon...
        </h2>
      )}

      {/* Pokémon Cards */}
      {!loading && (
        <div className="pokemon-container">

          {filteredPokemon.map((item) => (
            <div className="pokemon-card" key={item.id}>

              <img
                src={
                  item.sprites.other["official-artwork"].front_default ||
                  item.sprites.front_default
                }
                alt={item.name}
              />

              <h2>{item.name}</h2>

              <p className="number">
                #{String(item.id).padStart(4, "0")}
              </p>

              {/* Pokémon Types */}
              <div className="types">
                {item.types.map((type) => (
                  <span
                    className={"type " + type.type.name}
                    key={type.type.name}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>

              {/* Pokémon Information */}
              <div className="info">
                <p>
                  <strong>Height:</strong>{" "}
                  {item.height / 10} m
                </p>

                <p>
                  <strong>Weight:</strong>{" "}
                  {item.weight / 10} kg
                </p>
              </div>

            </div>
          ))}

        </div>
      )}

      {/* No Search Results */}
      {!loading && filteredPokemon.length === 0 && (
        <h2 className="not-found">
          Pokémon not found.
        </h2>
      )}

    </div>
  );
}

export default App;