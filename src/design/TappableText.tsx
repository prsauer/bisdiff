export function TappableText(props: {
  onClick?: () => void;
  disabled?: boolean;
  text: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{ cursor: "pointer", ...props.style }}
      onClick={() =>
        props.onClick && !props.disabled ? props.onClick() : null
      }
    >
      [{props.text}]
    </div>
  );
}
