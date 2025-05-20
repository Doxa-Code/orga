export const TagLists: React.FC<{ tags?: string[] }> = ({ tags }) => {
  return (
    <div className="flex py-2 gap-2">
      {tags?.map((tag) => (
        <span
          key={tag}
          className="btn no-animation hover:bg-primary hover:text-primary-content bg-primary/5 border-0 text-primary text-sm px-3 py-2 min-h-fit h-fit rounded-md w-fit capitalize font-medium"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};
