"use client";

import Select from "react-select";
import useInfoPage from "@/hooks/listing/use-product";
import useInfoPages from "@/hooks/use-info-pages";

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
        formatOptionLabel={(option: any) => (
          <div className="flex flex-row items-center gap-3">
            {" "}
            <div>{option.label}</div>
          </div>
        )}
        classNames={{
          control: () => "p-3 border-2",
          input: () => "text-lg",
          option: () => "text-lg",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "black",
            primary25: "#ffe4e6",
          },
        })}
      />
    </div>
  );
};

export default InfoSearchClient;
