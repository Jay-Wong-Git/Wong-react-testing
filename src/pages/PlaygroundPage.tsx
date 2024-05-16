import SearchBox from "../components/SearchBox";

const PlaygroundPage = () => {
  return <SearchBox onChange={(searchTerm) => console.log(searchTerm)} />;
};

export default PlaygroundPage;
