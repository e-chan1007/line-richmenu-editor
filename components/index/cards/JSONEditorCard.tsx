import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import React, { useEffect, useRef } from "react";
import JSONEditor from "../JSONEditor";

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
