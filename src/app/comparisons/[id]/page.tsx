export default async function ComparisonResultsPage(
  props: Readonly<PageProps<`/comparisons/[id]`>>,
) {
  const { id } = await props.params;

  return <div>Hello World {id}</div>;
}
