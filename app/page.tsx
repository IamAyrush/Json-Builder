'use client'
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import FieldBuilder from "@/components/FieldBuilder";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function Home() {
  const methods = useForm({ defaultValues: { fields: [] } });
  const { control } = methods;
  const fields = useWatch({ control, name: "fields" });
  const [json, setJson] = useState({});

  useEffect(() => {
    const buildSchema = (fields: any[]): any => {
      const schema: any = {};
      fields?.forEach((field) => {
        if (!field?.name) return;

        if (field.type === "NESTED") {
          schema[field.name] = buildSchema(field.children || []);
        } else {
          let val: any = field.value;
          if (field.type === "NUMBER") val = parseInt(val || "0");
          else if (field.type === "FLOAT") val = parseFloat(val || "0.0");
          else val = val ?? "";

          schema[field.name] = val;
        }
      });
      return schema;
    };

    setJson(buildSchema(fields || []));
  }, [fields]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    toast.success("Copied JSON to clipboard");
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen p-8 bg-gray-950 space-y-6">
        <h1 className="text-3xl font-bold flex justify-center text-white ">JSON Schema Builder</h1>

        <Card className="shadow-md bg-black">
          <CardContent className="p-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <FieldBuilder name="fields" />
            </form>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white"> output.json Preview</h2>
          <Button onClick={handleCopy}>Copy JSON</Button>
        </div>

        
          <CardContent className="p-4 overflow-auto max-h-[500px]">
            <SyntaxHighlighter language="json" style={oneDark} wrapLongLines>
              {JSON.stringify(json, null, 2)}
            </SyntaxHighlighter>
          </CardContent>
        
      </div>
    </FormProvider>
  );
}
