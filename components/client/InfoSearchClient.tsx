"use client";
//info pages parent component
import Select from "react-select";
import useInfoPages from "@/app/(info_support_layout)/info/(components)/use-info-pages";

export type InfoPageValue = {
  label: string;
  value: string;
  href: string;
};

interface InfoPageSelectProps {
  value?: InfoPageValue;
  onChange: (value: InfoPageValue) => void;
}

const InfoSearchClient: React.FC<InfoPageSelectProps> = ({
  value,
  onChange,
}) => {
  const { getAll } = useInfoPages();

  return (
    <div>
      <Select
        placeholder="Find an Info Page"
        isClearable
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value as InfoPageValue)}
        formatOptionLabel={(option: { label: string }) => (
          <div className="rounded-lg">{option.label}</div>
        )}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          ClearIndicator: () => null,
        }}
        classNames={{
          control: () => "px-2 bg shadow-sm peer",
          input: () => "text-lg",
          option: () => "text-xs",
          dropdownIndicator: () => "hidden",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 20,
          colors: {
            ...theme.colors,
            primary: "#ced9bb",
            primary25: "#ced9bb",
          },
        })}
      />
    </div>
  );
};

export default InfoSearchClient;
