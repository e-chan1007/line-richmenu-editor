import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import dynamic from "next/dynamic";

const JSONEditor = dynamic(() => import("@/components/index/JSONEditor"), { ssr: false });

export default function JSONEditorCard() {
  return (<>
    <Card sx={{ overflow: "visible" }}>
      <CardContent sx={{ height: "75vh" }}>
        <JSONEditor />
      </CardContent>
    </Card>
  </>
  );
}
