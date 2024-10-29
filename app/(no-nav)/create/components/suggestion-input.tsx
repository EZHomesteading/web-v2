//parent input field component
interface InputFieldProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  placeholder,
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      id={id}
      className="border-[1px] p-2 w-full rounded-full mb-1"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  );
};

export default InputField;
