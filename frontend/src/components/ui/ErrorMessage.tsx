interface Props {
  message: string;
}

export function ErrorMessage({ message }: Props) {
  return (
    <div role="alert" className="error-message">
      <strong>Oops!</strong> {message}
    </div>
  );
}
