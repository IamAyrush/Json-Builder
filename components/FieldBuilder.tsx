"use client";

import { useFieldArray, useFormContext } from "react-hook-form";

interface Props {
  name: string;
  nested?: boolean;
}

export default function FieldBuilder({ name, nested = false }: Props) {
  const { register, control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });


  return (
    <div className={`border p-4 rounded ${nested ? "ml-6" : ""}`}>
      {fields.map((field, index) => {
        const basePath = `${name}.${index}`;
        const type = watch(`${basePath}.type`);

        return (
          <div key={field.id} className="mb-4 space-x-2 text-white">
            <input
              {...register(`${basePath}.name`)}
              placeholder="Key"
              className="border px-2 py-1 rounded"
            />

            {type !== "NESTED" && (
              <input
                {...register(`${basePath}.value`)}
                placeholder="Value"
                className="border px-2 py-1 rounded"
              />
            )}

            <select {...register(`${basePath}.type`)} className="border px-2 py-1 rounded bg-gray-800">
              <option value="STRING">string</option>
              <option value="NUMBER">number</option>
              <option value="FLOAT">float</option>
              <option value="NESTED">nested</option>
            </select>

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 font-bold"
            >
              ✕
            </button>

            {type === "NESTED" && (
              <FieldBuilder name={`${basePath}.children`} nested={true} />
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => append({ name: "", type: "STRING", value: "" })}
        className="bg-yellow-500 text-white px-3 py-1 rounded mt-2"
      >
        + Add Field
      </button>
    </div>
  );
}
