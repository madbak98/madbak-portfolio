export function MadlabPropsList({ props }: { props: { name: string; type: string; description: string }[] }) {
  return (
    <dl className="divide-y divide-white/12 border-y border-white/12">
      {props.map((prop) => (
        <div key={prop.name} className="grid gap-2 py-4 sm:grid-cols-[10rem_12rem_1fr] sm:gap-5">
          <dt className="font-mono text-sm text-[#ebe8e1]">{prop.name}</dt>
          <dd className="font-mono text-xs text-[#ff2a2a]">{prop.type}</dd>
          <dd className="text-sm text-white/50">{prop.description}</dd>
        </div>
      ))}
    </dl>
  );
}
