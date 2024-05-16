import ExpandableText from "../components/ExpandableText";

const PlaygroundPage = () => {
  const text = "a".repeat(256);
  return <ExpandableText text={text} />;
};

export default PlaygroundPage;
